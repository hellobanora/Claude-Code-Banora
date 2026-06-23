// src/lib/rom/analysers/sagittal.ts
// Cervical flexion/extension and lumbar flexion/extension analysis.
// Both movements share the same sagittal-view pipeline: track a single
// segment angle relative to vertical over time, smooth it, find neutral
// and peak, and package the result.

import {
  Landmark,
  LandmarkFrame,
  MovementResult,
  MovementType,
  PoseFrame,
} from "../types";
import {
  angleFromVertical,
  averageVisibility,
  KalmanAngleFilter,
} from "../geometry";
import {
  MIN_LANDMARK_VISIBILITY,
  NORMAL_RANGES,
  PEAK_STABILITY_VELOCITY_THRESHOLD_DEG_PER_S,
  PEAK_STABILITY_WINDOW_MS,
} from "../constants";
import { scoreTrafficLight } from "../scoring";

/**
 * Cervical flexion/extension angle for a single frame.
 * Vector: shoulder -> ear (tragus). At neutral, this vector is close to
 * vertical. Forward flexion tips the ear forward (toward the camera-near
 * side in sagittal view), increasing the angle from vertical.
 *
 * Sign convention: positive = flexion (chin toward chest),
 * negative = extension (looking up/back).
 */
function cervicalAngleForFrame(frame: LandmarkFrame, facingRight: boolean): number | null {
  const shoulder = frame["shoulder"];
  const ear = frame["ear_tragus"];
  if (!shoulder || !ear) return null;

  const rawAngle = angleFromVertical(shoulder, ear);
  // angleFromVertical is clockwise-positive in image space. Which sign
  // means "flexion" depends on which way the patient is facing relative
  // to the camera, so we flip if needed to keep flexion positive.
  return facingRight ? rawAngle : -rawAngle;
}

/**
 * Lumbar flexion/extension angle for a single frame.
 * Vector: hip -> shoulder. At neutral standing, this is close to vertical.
 * Forward bend tips the shoulder forward relative to the hip, increasing
 * the angle from vertical.
 *
 * Sign convention: positive = flexion (bending forward),
 * negative = extension (bending backward).
 */
function lumbarAngleForFrame(frame: LandmarkFrame, facingRight: boolean): number | null {
  const hip = frame["hip"];
  const shoulder = frame["shoulder"];
  if (!hip || !shoulder) return null;

  const rawAngle = angleFromVertical(hip, shoulder);
  return facingRight ? rawAngle : -rawAngle;
}

export interface SagittalAnalysisOptions {
  movement: "cervical_flexion_extension" | "lumbar_flexion_extension";
  frames: PoseFrame[];
  /** Which way the patient is facing in the recorded video. */
  facingRight: boolean;
  /** Kalman filter tuning — defaults are sensible for 30-60fps phone video. */
  processNoise?: number;
  measurementNoise?: number;
}

/**
 * Full pipeline: raw frames -> smoothed angle series -> neutral/peak
 * detection -> MovementResult with traffic-light score.
 *
 * Returns two MovementResults: one for the flexion phase, one for the
 * extension phase, since a single ROM recording typically captures both
 * (patient flexes forward, returns to neutral, then extends backward).
 */
export function analyseSagittalMovement(opts: SagittalAnalysisOptions): MovementResult[] {
  const { movement, frames, facingRight } = opts;
  const angleFn = movement === "cervical_flexion_extension" ? cervicalAngleForFrame : lumbarAngleForFrame;
  const requiredLandmarks =
    movement === "cervical_flexion_extension" ? ["shoulder", "ear_tragus"] : ["hip", "shoulder"];

  // Kalman tuning note: the stable-peak detector requires angular
  // velocity to settle within a ~400ms window. The original defaults
  // (processNoise=0.5, measurementNoise=4) converge too slowly — the
  // filtered estimate keeps drifting toward the true value for 300ms+
  // even during a genuinely held end-range, which permanently exceeds
  // the velocity threshold and causes real held positions to go
  // undetected. These defaults converge to within ~0.1 degree by
  // roughly the 6th frame (~200ms at 30fps) of a held position, which
  // reliably clears the stability check while still smoothing jitter.
  const filter = new KalmanAngleFilter(opts.processNoise ?? 2, opts.measurementNoise ?? 3);
  const warnings: string[] = [];

  const series: { timestampMs: number; angleDeg: number; frame: PoseFrame; confidence: number }[] = [];

  for (const frame of frames) {
    const rawAngle = angleFn(frame.landmarks, facingRight);
    const confidence = averageVisibility(frame.landmarks, requiredLandmarks);

    if (rawAngle === null) continue; // missing landmarks this frame, skip
    if (confidence < MIN_LANDMARK_VISIBILITY) {
      warnings.push(`Low landmark confidence (${confidence.toFixed(2)}) at frame ${frame.frameIndex}`);
    }

    const smoothed = filter.next(rawAngle);
    series.push({ timestampMs: frame.timestampMs, angleDeg: smoothed, frame, confidence });
  }

  if (series.length === 0) {
    throw new Error(
      `No usable frames for ${movement}: required landmarks (${requiredLandmarks.join(", ")}) were not detected in any frame.`
    );
  }

  // Neutral = angle at the very start of the recording (first ~5 frames
  // averaged, assuming the patient starts in neutral as per protocol).
  const neutralSampleCount = Math.min(5, series.length);
  const neutralAngle =
    series.slice(0, neutralSampleCount).reduce((s, p) => s + p.angleDeg, 0) / neutralSampleCount;
  const neutralFrame = series[0].frame;

  // Find stable peaks: local maxima where angular velocity stays below
  // threshold for the stability window, separately for positive (flexion)
  // and negative (extension) excursions from neutral.
  const flexionPeak = findStablePeak(series, neutralAngle, "max");
  const extensionPeak = findStablePeak(series, neutralAngle, "min");

  const results: MovementResult[] = [];

  if (flexionPeak) {
    results.push(
      buildResult({
        movement,
        direction: "flexion",
        neutralAngle,
        neutralFrame,
        peak: flexionPeak,
        series,
        warnings,
      })
    );
  }

  if (extensionPeak) {
    results.push(
      buildResult({
        movement,
        direction: "extension",
        neutralAngle,
        neutralFrame,
        peak: extensionPeak,
        series,
        warnings,
      })
    );
  }

  if (results.length === 0) {
    throw new Error(
      `Could not detect a stable flexion or extension peak for ${movement}. Check that the patient performed a full movement and held briefly at end-range.`
    );
  }

  return results;
}

interface SeriesPoint {
  timestampMs: number;
  angleDeg: number;
  frame: PoseFrame;
  confidence: number;
}

/**
 * Find the most extreme stable point in the series, in the given
 * direction ("max" = largest angle = flexion, "min" = smallest = extension).
 * "Stable" means angular velocity around that point stays under the
 * configured threshold for the configured window — this is what
 * distinguishes a genuine held end-range from a fast pass-through frame.
 */
function findStablePeak(
  series: SeriesPoint[],
  neutralAngle: number,
  direction: "max" | "min"
): SeriesPoint | null {
  // Candidate = the most extreme angle in this direction.
  const candidates = [...series].sort((a, b) =>
    direction === "max" ? b.angleDeg - a.angleDeg : a.angleDeg - b.angleDeg
  );

  for (const candidate of candidates) {
    // Only consider candidates that actually represent excursion from
    // neutral in the right direction (avoid noise-only "peaks").
    const excursion = candidate.angleDeg - neutralAngle;
    if (direction === "max" && excursion < 3) break; // sorted, so no more valid candidates
    if (direction === "min" && excursion > -3) break;

    if (isStableAround(series, candidate)) {
      return candidate;
    }
  }
  return null;
}

function isStableAround(series: SeriesPoint[], point: SeriesPoint): boolean {
  const windowStart = point.timestampMs - PEAK_STABILITY_WINDOW_MS / 2;
  const windowEnd = point.timestampMs + PEAK_STABILITY_WINDOW_MS / 2;
  const windowPoints = series.filter((p) => p.timestampMs >= windowStart && p.timestampMs <= windowEnd);
  if (windowPoints.length < 2) return false;

  for (let i = 1; i < windowPoints.length; i++) {
    const dt = (windowPoints[i].timestampMs - windowPoints[i - 1].timestampMs) / 1000;
    if (dt <= 0) continue;
    const dAngle = Math.abs(windowPoints[i].angleDeg - windowPoints[i - 1].angleDeg);
    const velocity = dAngle / dt;
    if (velocity > PEAK_STABILITY_VELOCITY_THRESHOLD_DEG_PER_S) return false;
  }
  return true;
}

function buildResult(args: {
  movement: MovementType;
  direction: "flexion" | "extension";
  neutralAngle: number;
  neutralFrame: PoseFrame;
  peak: SeriesPoint;
  series: SeriesPoint[];
  warnings: string[];
}): MovementResult {
  const { movement, direction, neutralAngle, neutralFrame, peak, series, warnings } = args;

  const romDeg = Math.abs(peak.angleDeg - neutralAngle);
  const normalRangeEntry = NORMAL_RANGES.find((r) => r.movement === movement && r.direction === direction);
  const normalRangeDeg: [number, number] = normalRangeEntry
    ? [normalRangeEntry.normalMinDeg, normalRangeEntry.normalMaxDeg]
    : [0, 0];

  const overallConfidence =
    series.reduce((s, p) => s + p.confidence, 0) / series.length;

  const trafficLight = scoreTrafficLight(romDeg, normalRangeDeg);

  return {
    movement,
    cameraView: "sagittal",
    neutralAngleDeg: round1(neutralAngle),
    peakAngleDeg: round1(peak.angleDeg),
    romDeg: round1(romDeg),
    peakFrame: peak.frame,
    neutralFrame,
    angleSeries: series.map((p) => ({ timestampMs: p.timestampMs, angleDeg: round1(p.angleDeg) })),
    confidence: round2(overallConfidence),
    trafficLight,
    normalRangeDeg,
    warnings: [...new Set(warnings)],
  };
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
