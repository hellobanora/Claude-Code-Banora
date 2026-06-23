// src/lib/rom/analysers/rotation.ts
// Cervical and lumbar rotation analysis (frontal/face-on camera view).
//
// ACCURACY NOTE — read this before using results clinically:
// A single 2D frontal camera cannot directly observe rotation around the
// vertical axis. This module uses the "foreshortening" method: as the
// patient rotates, the visible horizontal separation between a paired
// landmark (ear-to-ear for cervical, shoulder-to-shoulder for lumbar)
// compresses proportionally to cos(rotation angle).
//
//   rotation_angle = arccos(current_width / neutral_width)
//
// This is reasonably reliable from 0-60 degrees. Above that, the cosine
// curve flattens — small further width changes correspond to large
// angle changes — so precision degrades. Width compression alone also
// cannot tell you WHICH WAY the patient rotated (left vs right look the
// same from directly in front), so a second landmark (nose position
// relative to the shoulder/ear midpoint) is used to disambiguate
// direction. This is a screening-grade method, not goniometer-grade —
// see Section 3.4 of the ROM Module Technical Spec for the full
// limitations writeup that should accompany this in any patient-facing
// report or UI.

import {
  LandmarkFrame,
  MovementResult,
  MovementType,
  PoseFrame,
  Side,
} from "../types";
import { averageVisibility, horizontalSeparation, midpoint, KalmanAngleFilter, clamp, radiansToDegrees } from "../geometry";
import {
  MIN_LANDMARK_VISIBILITY,
  NORMAL_RANGES,
  PEAK_STABILITY_VELOCITY_THRESHOLD_DEG_PER_S,
  PEAK_STABILITY_WINDOW_MS,
} from "../constants";
import { scoreTrafficLight } from "../scoring";

/** Above this rotation estimate, flag a confidence warning — the cosine
 *  method gets unreliable as it approaches 90 degrees. */
const HIGH_ANGLE_WARNING_THRESHOLD_DEG = 60;

interface RotationRawSample {
  /** Signed rotation in degrees: positive = rotated to patient's right,
   *  negative = rotated to patient's left. Magnitude from foreshortening,
   *  sign from the disambiguation landmark. */
  signedAngleDeg: number;
  /** True if disambiguation landmark was within tolerance of centre,
   *  meaning direction is uncertain (patient near neutral). */
  nearNeutral: boolean;
}

/**
 * Cervical rotation raw sample for a single frame.
 * Foreshortening pair: left_ear <-> right_ear.
 * Disambiguation: nose x-position relative to the ear midpoint.
 */
function cervicalRotationSample(
  frame: LandmarkFrame,
  neutralEarWidth: number
): RotationRawSample | null {
  const leftEar = frame["left_ear"];
  const rightEar = frame["right_ear"];
  const nose = frame["nose"];
  if (!leftEar || !rightEar || !nose) return null;

  const currentWidth = horizontalSeparation(leftEar, rightEar);
  const magnitude = foreshorteningAngle(currentWidth, neutralEarWidth);

  const earMid = midpoint(leftEar, rightEar);
  const noseOffset = nose.x - earMid.x;
  // Small offset = direction is genuinely ambiguous (patient near neutral),
  // not a measurement problem — flag it rather than guess a sign.
  const nearNeutral = Math.abs(noseOffset) < 0.01;
  const sign = noseOffset >= 0 ? 1 : -1;

  return { signedAngleDeg: sign * magnitude, nearNeutral };
}

/**
 * Lumbar rotation raw sample for a single frame.
 * Foreshortening pair: left_shoulder <-> right_shoulder.
 * Disambiguation: relative fore-aft position isn't available in 2D, so
 * we use the shoulder-hip horizontal offset instead — as the trunk
 * rotates, the shoulder midpoint shifts relative to the (more stable)
 * hip midpoint in the direction of rotation.
 */
function lumbarRotationSample(
  frame: LandmarkFrame,
  neutralShoulderWidth: number
): RotationRawSample | null {
  const leftShoulder = frame["left_shoulder"];
  const rightShoulder = frame["right_shoulder"];
  const leftHip = frame["left_hip"];
  const rightHip = frame["right_hip"];
  if (!leftShoulder || !rightShoulder || !leftHip || !rightHip) return null;

  const currentWidth = horizontalSeparation(leftShoulder, rightShoulder);
  const magnitude = foreshorteningAngle(currentWidth, neutralShoulderWidth);

  const shoulderMid = midpoint(leftShoulder, rightShoulder);
  const hipMid = midpoint(leftHip, rightHip);
  const offset = shoulderMid.x - hipMid.x;
  const nearNeutral = Math.abs(offset) < 0.01;
  const sign = offset >= 0 ? 1 : -1;

  return { signedAngleDeg: sign * magnitude, nearNeutral };
}

/**
 * Core foreshortening formula: rotation_angle = arccos(current/neutral),
 * clamped defensively since landmark noise can occasionally push the
 * ratio fractionally above 1.0 (which would otherwise produce NaN).
 */
function foreshorteningAngle(currentWidth: number, neutralWidth: number): number {
  if (neutralWidth <= 0) return 0;
  const ratio = clamp(currentWidth / neutralWidth, 0, 1);
  return radiansToDegrees(Math.acos(ratio));
}

export interface RotationAnalysisOptions {
  movement: "cervical_rotation" | "lumbar_rotation";
  frames: PoseFrame[];
  processNoise?: number;
  measurementNoise?: number;
}

export function analyseRotation(opts: RotationAnalysisOptions): MovementResult[] {
  const { movement, frames } = opts;
  const isCervical = movement === "cervical_rotation";
  const requiredLandmarks = isCervical
    ? ["left_ear", "right_ear", "nose"]
    : ["left_shoulder", "right_shoulder", "left_hip", "right_hip"];

  // Step 1: establish neutral width from the first few frames, assuming
  // (per capture protocol) the patient starts facing the camera directly.
  const neutralSampleFrames = frames.slice(0, Math.min(5, frames.length));
  const neutralWidth = computeNeutralWidth(neutralSampleFrames, isCervical);

  if (neutralWidth <= 0) {
    throw new Error(
      `Could not establish a neutral reference width for ${movement} — check that the patient is facing the camera in the opening frames and required landmarks (${requiredLandmarks.join(", ")}) are detected.`
    );
  }

  // Kalman tuning note: rotation's foreshortening signal has sharper
  // transitions than the sagittal flex/ext angle, and the stable-peak
  // detector requires angular velocity to settle within a ~400ms window.
  // A slower-converging filter (e.g. processNoise=0.5, measurementNoise=4,
  // as used for sagittal movements) never fully settles within that
  // window even during a genuinely held peak — it keeps "creeping" toward
  // the true value for 300ms+, which permanently exceeds the velocity
  // threshold and causes real held end-ranges to go undetected. These
  // defaults converge to within ~0.1 degree by roughly the 6th frame
  // (~200ms at 30fps) of a held position, which reliably clears the
  // stability check while still smoothing out single-frame jitter.
  const filter = new KalmanAngleFilter(opts.processNoise ?? 2, opts.measurementNoise ?? 3);
  const warnings: string[] = [];
  const series: {
    timestampMs: number;
    angleDeg: number; // signed, smoothed
    frame: PoseFrame;
    confidence: number;
  }[] = [];

  let highAngleWarningIssued = false;
  let nearNeutralAmbiguityCount = 0;

  for (const frame of frames) {
    const sample = isCervical
      ? cervicalRotationSample(frame.landmarks, neutralWidth)
      : lumbarRotationSample(frame.landmarks, neutralWidth);
    const confidence = averageVisibility(frame.landmarks, requiredLandmarks);

    if (!sample) continue;
    if (confidence < MIN_LANDMARK_VISIBILITY) {
      warnings.push(`Low landmark confidence (${confidence.toFixed(2)}) at frame ${frame.frameIndex}`);
    }
    if (sample.nearNeutral) nearNeutralAmbiguityCount++;
    if (!highAngleWarningIssued && Math.abs(sample.signedAngleDeg) > HIGH_ANGLE_WARNING_THRESHOLD_DEG) {
      warnings.push(
        `Rotation estimate exceeded ${HIGH_ANGLE_WARNING_THRESHOLD_DEG}° — the foreshortening method becomes less precise at high angles; treat this value as approximate.`
      );
      highAngleWarningIssued = true;
    }

    const smoothed = filter.next(sample.signedAngleDeg);
    series.push({ timestampMs: frame.timestampMs, angleDeg: smoothed, frame, confidence });
  }

  if (series.length === 0) {
    throw new Error(
      `No usable frames for ${movement}: required landmarks (${requiredLandmarks.join(", ")}) were not detected in any frame.`
    );
  }

  if (nearNeutralAmbiguityCount > series.length * 0.5) {
    warnings.push(
      "Direction (left vs right) was ambiguous for more than half the recording — the patient may not have rotated far enough from centre for reliable direction detection."
    );
  }

  const neutralFrame = series[0].frame;

  // Rightward rotation = positive signed angle, leftward = negative.
  const rightPeak = findStablePeak(series, "max");
  const leftPeak = findStablePeak(series, "min");

  const results: MovementResult[] = [];

  if (rightPeak) {
    results.push(buildResult({ movement, side: "right", neutralFrame, peak: rightPeak, series, warnings }));
  }
  if (leftPeak) {
    results.push(buildResult({ movement, side: "left", neutralFrame, peak: leftPeak, series, warnings }));
  }

  if (results.length === 0) {
    throw new Error(
      `Could not detect a stable left or right rotation peak for ${movement}. Check the patient performed a full rotation and held briefly at end-range.`
    );
  }

  return results;
}

function computeNeutralWidth(frames: PoseFrame[], isCervical: boolean): number {
  const widths: number[] = [];
  for (const frame of frames) {
    if (isCervical) {
      const l = frame.landmarks["left_ear"];
      const r = frame.landmarks["right_ear"];
      if (l && r) widths.push(horizontalSeparation(l, r));
    } else {
      const l = frame.landmarks["left_shoulder"];
      const r = frame.landmarks["right_shoulder"];
      if (l && r) widths.push(horizontalSeparation(l, r));
    }
  }
  if (widths.length === 0) return 0;
  return widths.reduce((s, w) => s + w, 0) / widths.length;
}

interface SeriesPoint {
  timestampMs: number;
  angleDeg: number;
  frame: PoseFrame;
  confidence: number;
}

function findStablePeak(series: SeriesPoint[], direction: "max" | "min"): SeriesPoint | null {
  const candidates = [...series].sort((a, b) =>
    direction === "max" ? b.angleDeg - a.angleDeg : a.angleDeg - b.angleDeg
  );

  for (const candidate of candidates) {
    if (direction === "max" && candidate.angleDeg < 5) break;
    if (direction === "min" && candidate.angleDeg > -5) break;

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
  neutralFrame: PoseFrame;
  peak: SeriesPoint;
  series: SeriesPoint[];
  warnings: string[];
}): MovementResult {
  const { movement, side, neutralFrame, peak, series, warnings } = args;

  const romDeg = Math.abs(peak.angleDeg);
  const direction = side === "right" ? "rotation_right" : "rotation_left";
  const normalRangeEntry = NORMAL_RANGES.find((r) => r.movement === movement && r.direction === direction);
  const normalRangeDeg: [number, number] = normalRangeEntry
    ? [normalRangeEntry.normalMinDeg, normalRangeEntry.normalMaxDeg]
    : [0, 0];

  const overallConfidence = series.reduce((s, p) => s + p.confidence, 0) / series.length;
  const trafficLight = scoreTrafficLight(romDeg, normalRangeDeg);

  return {
    movement,
    cameraView: "frontal",
    side,
    neutralAngleDeg: 0, // by definition for rotation — neutral is 0 degrees of twist
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
