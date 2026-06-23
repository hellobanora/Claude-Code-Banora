// src/lib/rom/analysers/lateralFlexion.ts
// Cervical and lumbar lateral flexion analysis (frontal/face-on camera view).
//
// Shares the same smoothing + stable-peak-detection pattern as sagittal.ts,
// but tracks deviation from HORIZONTAL rather than vertical, since the
// reference segment (eye-line or shoulder-line) is naturally horizontal
// at neutral standing posture when viewed face-on.

import {
  LandmarkFrame,
  MovementResult,
  MovementType,
  PoseFrame,
  Side,
} from "../types";
import { angleFromHorizontal, averageVisibility, KalmanAngleFilter } from "../geometry";
import {
  MIN_LANDMARK_VISIBILITY,
  NORMAL_RANGES,
  PEAK_STABILITY_VELOCITY_THRESHOLD_DEG_PER_S,
  PEAK_STABILITY_WINDOW_MS,
} from "../constants";
import { scoreTrafficLight } from "../scoring";

/**
 * Cervical lateral flexion angle for a single frame.
 * Vector: left_eye -> right_eye. At neutral, this is horizontal (0°).
 * As the head tilts toward a shoulder, the eye-line tilts with it.
 *
 * Sign convention: positive = tilt toward the patient's right (their
 * right eye drops lower in the image, i.e. larger y), negative = tilt
 * toward the left. angleFromHorizontal(left, right) returns NEGATIVE
 * when the right point has a larger y (lower in image, since image y
 * increases downward but the function treats "up" as positive per its
 * own convention) — so we negate it here to get the right tilt = positive
 * convention used throughout this module's peak-direction logic.
 */
function cervicalLateralAngleForFrame(frame: LandmarkFrame): number | null {
  const leftEye = frame["left_eye"];
  const rightEye = frame["right_eye"];
  if (!leftEye || !rightEye) return null;
  return -angleFromHorizontal(leftEye, rightEye);
}

/**
 * Lumbar lateral flexion angle for a single frame.
 * Vector: left_shoulder -> right_shoulder. At neutral, horizontal.
 * As the trunk side-bends, the shoulder line tilts.
 * Same sign convention and negation rationale as the cervical function above.
 */
function lumbarLateralAngleForFrame(frame: LandmarkFrame): number | null {
  const leftShoulder = frame["left_shoulder"];
  const rightShoulder = frame["right_shoulder"];
  if (!leftShoulder || !rightShoulder) return null;
  return -angleFromHorizontal(leftShoulder, rightShoulder);
}

export interface LateralFlexionAnalysisOptions {
  movement: "cervical_lateral_flexion" | "lumbar_lateral_flexion";
  frames: PoseFrame[];
  processNoise?: number;
  measurementNoise?: number;
}

/**
 * Full pipeline: raw frames -> smoothed angle series -> neutral/peak
 * detection for BOTH sides -> two MovementResults (left + right), since
 * a single recording typically captures the patient tilting both ways.
 */
export function analyseLateralFlexion(opts: LateralFlexionAnalysisOptions): MovementResult[] {
  const { movement, frames } = opts;
  const angleFn = movement === "cervical_lateral_flexion" ? cervicalLateralAngleForFrame : lumbarLateralAngleForFrame;
  const requiredLandmarks =
    movement === "cervical_lateral_flexion" ? ["left_eye", "right_eye"] : ["left_shoulder", "right_shoulder"];

  // Kalman tuning note: see sagittal.ts / rotation.ts for the full
  // explanation — these defaults converge fast enough (~200ms) to
  // satisfy the stable-peak detector's ~400ms window during a genuinely
  // held end-range, unlike a slower-converging filter which would never
  // settle and cause real held positions to go undetected.
  const filter = new KalmanAngleFilter(opts.processNoise ?? 2, opts.measurementNoise ?? 3);
  const warnings: string[] = [];

  const series: { timestampMs: number; angleDeg: number; frame: PoseFrame; confidence: number }[] = [];

  for (const frame of frames) {
    const rawAngle = angleFn(frame.landmarks);
    const confidence = averageVisibility(frame.landmarks, requiredLandmarks);

    if (rawAngle === null) continue;
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

  const neutralSampleCount = Math.min(5, series.length);
  const neutralAngle =
    series.slice(0, neutralSampleCount).reduce((s, p) => s + p.angleDeg, 0) / neutralSampleCount;
  const neutralFrame = series[0].frame;

  // Right tilt = positive excursion, left tilt = negative excursion
  // (per the sign convention documented on the per-frame angle functions).
  const rightPeak = findStablePeak(series, neutralAngle, "max");
  const leftPeak = findStablePeak(series, neutralAngle, "min");

  const results: MovementResult[] = [];

  if (rightPeak) {
    results.push(
      buildResult({ movement, side: "right", neutralAngle, neutralFrame, peak: rightPeak, series, warnings })
    );
  }
  if (leftPeak) {
    results.push(
      buildResult({ movement, side: "left", neutralAngle, neutralFrame, peak: leftPeak, series, warnings })
    );
  }

  if (results.length === 0) {
    throw new Error(
      `Could not detect a stable left or right peak for ${movement}. Check the patient performed a full tilt and held briefly at end-range.`
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

function findStablePeak(
  series: SeriesPoint[],
  neutralAngle: number,
  direction: "max" | "min"
): SeriesPoint | null {
  const candidates = [...series].sort((a, b) =>
    direction === "max" ? b.angleDeg - a.angleDeg : a.angleDeg - b.angleDeg
  );

  for (const candidate of candidates) {
    const excursion = candidate.angleDeg - neutralAngle;
    if (direction === "max" && excursion < 3) break;
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
  side: Side;
  neutralAngle: number;
  neutralFrame: PoseFrame;
  peak: SeriesPoint;
  series: SeriesPoint[];
  warnings: string[];
}): MovementResult {
  const { movement, side, neutralAngle, neutralFrame, peak, series, warnings } = args;

  const romDeg = Math.abs(peak.angleDeg - neutralAngle);
  const normalRangeEntry = NORMAL_RANGES.find((r) => r.movement === movement && r.direction === side);
  const normalRangeDeg: [number, number] = normalRangeEntry
    ? [normalRangeEntry.normalMinDeg, normalRangeEntry.normalMaxDeg]
    : [0, 0];

  const overallConfidence = series.reduce((s, p) => s + p.confidence, 0) / series.length;
  const trafficLight = scoreTrafficLight(romDeg, normalRangeDeg);

  return {
    movement,
    cameraView: "frontal",
    side,
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
