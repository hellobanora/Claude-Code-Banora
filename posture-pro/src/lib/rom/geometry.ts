// src/lib/rom/geometry.ts
// Pure geometry functions — no side effects, fully unit-testable.
// All angle math operates on normalised MediaPipe landmark coordinates.

import { Landmark, LandmarkFrame } from "./types";

export interface Point2D {
  x: number;
  y: number;
}

/** Euclidean distance between two landmarks (2D, ignores z). */
export function distance2D(a: Landmark, b: Landmark): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/**
 * Angle (degrees) of the vector from `from` to `to`, measured from
 * vertical (0° = straight up), increasing clockwise. This is the
 * convention used throughout the sagittal flexion/extension calculations
 * so that "leaning forward" reads as a positive, increasing angle.
 */
export function angleFromVertical(from: Landmark, to: Landmark): number {
  const dx = to.x - from.x;
  const dy = to.y - from.y; // image y increases downward
  // atan2(dx, -dy): 0° when pointing straight up (-y), positive clockwise
  const radians = Math.atan2(dx, -dy);
  return radiansToDegrees(radians);
}

/**
 * Angle (degrees) of the vector from `from` to `to`, measured from
 * horizontal (0° = pointing right), increasing counter-clockwise in
 * standard image coordinates. Used for lateral flexion (frontal view).
 */
export function angleFromHorizontal(from: Landmark, to: Landmark): number {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const radians = Math.atan2(-dy, dx);
  return radiansToDegrees(radians);
}

/**
 * Classic three-point joint angle: angle at vertex `b`, formed by rays
 * b->a and b->c. Returns 0-180°. This is the standard "joint angle"
 * formula used for knee/hip/elbow-style angles.
 */
export function threePointAngle(a: Landmark, b: Landmark, c: Landmark): number {
  const ab = { x: a.x - b.x, y: a.y - b.y };
  const cb = { x: c.x - b.x, y: c.y - b.y };
  const dot = ab.x * cb.x + ab.y * cb.y;
  const magAB = Math.hypot(ab.x, ab.y);
  const magCB = Math.hypot(cb.x, cb.y);
  if (magAB === 0 || magCB === 0) return 0;
  const cosAngle = clamp(dot / (magAB * magCB), -1, 1);
  return radiansToDegrees(Math.acos(cosAngle));
}

export function radiansToDegrees(rad: number): number {
  return (rad * 180) / Math.PI;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function midpoint(a: Landmark, b: Landmark): Point2D {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

/**
 * Horizontal pixel-space separation between two landmarks (x-distance
 * only — ignores vertical offset). Used for the rotation foreshortening
 * method, where we track how much a paired landmark's apparent width
 * compresses as the body rotates away from the camera.
 */
export function horizontalSeparation(a: Landmark, b: Landmark): number {
  return Math.abs(a.x - b.x);
}

/**
 * Average visibility/confidence across a set of named landmarks in a frame.
 * Returns 0 if any required landmark is missing entirely.
 */
export function averageVisibility(frame: LandmarkFrame, names: string[]): number {
  const visibilities: number[] = [];
  for (const name of names) {
    const lm = frame[name];
    if (!lm) return 0; // missing landmark = zero confidence for this frame
    visibilities.push(lm.visibility ?? 1);
  }
  if (visibilities.length === 0) return 0;
  return visibilities.reduce((s, v) => s + v, 0) / visibilities.length;
}

// --- Smoothing -------------------------------------------------------

/**
 * Simple moving average smoothing over a numeric time series.
 * windowSize is in samples (frames), not milliseconds — caller should
 * pick a window appropriate to the recording frame rate.
 */
export function movingAverageSmooth(values: number[], windowSize: number): number[] {
  if (windowSize <= 1) return values;
  const half = Math.floor(windowSize / 2);
  const out: number[] = [];
  for (let i = 0; i < values.length; i++) {
    const start = Math.max(0, i - half);
    const end = Math.min(values.length - 1, i + half);
    let sum = 0;
    let count = 0;
    for (let j = start; j <= end; j++) {
      sum += values[j];
      count++;
    }
    out.push(sum / count);
  }
  return out;
}

/**
 * One-dimensional Kalman filter for smoothing a noisy angle series.
 * Better than a moving average for real-time/online smoothing because it
 * doesn't need a look-ahead window — useful if you later want a live
 * angle readout during recording, not just post-hoc analysis.
 *
 * processNoise: how much we expect the true angle to change frame-to-frame
 * measurementNoise: how much we distrust each raw landmark-derived angle
 */
export class KalmanAngleFilter {
  private estimate: number | null = null;
  private errorCovariance = 1;

  constructor(
    private readonly processNoise = 0.5,
    private readonly measurementNoise = 4
  ) {}

  next(measurement: number): number {
    if (this.estimate === null) {
      this.estimate = measurement;
      return this.estimate;
    }
    // Predict
    const predictedEstimate = this.estimate;
    const predictedCovariance = this.errorCovariance + this.processNoise;

    // Update
    const kalmanGain = predictedCovariance / (predictedCovariance + this.measurementNoise);
    this.estimate = predictedEstimate + kalmanGain * (measurement - predictedEstimate);
    this.errorCovariance = (1 - kalmanGain) * predictedCovariance;

    return this.estimate;
  }

  reset(): void {
    this.estimate = null;
    this.errorCovariance = 1;
  }
}
