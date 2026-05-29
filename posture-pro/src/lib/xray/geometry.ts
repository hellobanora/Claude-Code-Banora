// ═══════════════════════════════════════════════════════════════
// SpineView — Geometry Engine
// Pure functions for all angle/distance calculations.
// No DOM access, no side effects, fully unit-testable.
// ═══════════════════════════════════════════════════════════════

import type { Point, Severity, SeverityThresholds } from './types';
import { DEFAULT_THRESHOLDS } from './constants';

// ─── Angle Calculations ──────────────────────────────────────

/**
 * Calculate the angle of a line segment from horizontal (degrees).
 * Positive = clockwise from positive x-axis.
 * Returns value in range [-180, 180].
 */
export function angleFromHorizontal(p1: Point, p2: Point): number {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);
}

/**
 * Calculate the angle between two line segments using the
 * posterior tangent method.
 *
 * Each line is defined by two points (superior and inferior
 * corners of the posterior vertebral body).
 *
 * Returns the angular difference in degrees.
 * Negative values indicate lordosis (normal for cervical/lumbar).
 * Positive values indicate kyphosis.
 */
export function posteriorTangentAngle(
  upperSup: Point,
  upperInf: Point,
  lowerSup: Point,
  lowerInf: Point,
): number {
  const upperAngle = angleFromHorizontal(upperSup, upperInf);
  const lowerAngle = angleFromHorizontal(lowerSup, lowerInf);
  return lowerAngle - upperAngle;
}

/**
 * Calculate Cobb angle between two endplates.
 *
 * Uses the intersection of perpendicular lines to the endplates.
 * In practice this is the angle between the two endplate lines,
 * which equals the posteriorTangentAngle when using posterior
 * body lines.
 *
 * @param topLeft - Left/anterior point of superior endplate
 * @param topRight - Right/posterior point of superior endplate
 * @param bottomLeft - Left/anterior point of inferior endplate
 * @param bottomRight - Right/posterior point of inferior endplate
 */
export function cobbAngle(
  topLeft: Point,
  topRight: Point,
  bottomLeft: Point,
  bottomRight: Point,
): number {
  const topAngle = angleFromHorizontal(topLeft, topRight);
  const bottomAngle = angleFromHorizontal(bottomLeft, bottomRight);
  return Math.abs(bottomAngle - topAngle);
}

/**
 * Calculate segmental angle between two adjacent vertebral bodies.
 *
 * Uses the posterior body lines (sup-post to inf-post corners).
 * Returns the angular difference in degrees.
 */
export function segmentalAngle(
  aboveSup: Point,
  aboveInf: Point,
  belowSup: Point,
  belowInf: Point,
): number {
  const aboveAngle = angleFromHorizontal(aboveSup, aboveInf);
  const belowAngle = angleFromHorizontal(belowSup, belowInf);
  return belowAngle - aboveAngle;
}

/**
 * Calculate the endplate angle for a single vertebral body.
 * This is the tilt of the line connecting the sup and inf
 * posterior corners relative to vertical.
 */
export function endplateAngle(sup: Point, inf: Point): number {
  return angleFromHorizontal(sup, inf);
}

// ─── Distance Calculations ───────────────────────────────────

/**
 * Horizontal distance between two points (pixels).
 * Used for anterior head carriage (C2 to C7 SVA).
 */
export function horizontalOffset(p1: Point, p2: Point): number {
  return Math.abs(p1.x - p2.x);
}

/**
 * Vertical distance between two points (pixels).
 * Used for pelvic/sacral unleveling.
 * Returns the difference and which side is higher.
 */
export function verticalOffset(
  leftPoint: Point,
  rightPoint: Point,
): { pixels: number; highSide: 'L' | 'R' } {
  const diff = leftPoint.y - rightPoint.y;
  // In image coordinates, lower y = higher on screen
  return {
    pixels: Math.abs(diff),
    highSide: diff < 0 ? 'L' : 'R',
  };
}

/**
 * Euclidean distance between two points.
 * Used for calibration reference distances.
 */
export function distance(p1: Point, p2: Point): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Convert pixel distance to mm using calibration factor.
 */
export function pixelsToMm(pixels: number, pixelsPerMm: number): number {
  if (pixelsPerMm <= 0) return 0;
  return pixels / pixelsPerMm;
}

// ─── Severity Grading ────────────────────────────────────────

/**
 * Grade the severity of a measurement deviation.
 *
 * @param measured - The actual measured value
 * @param ideal - The ideal/normal value
 * @param thresholds - Percentage thresholds (default: 25/50/75%)
 */
export function gradeSeverity(
  measured: number,
  ideal: number,
  thresholds: SeverityThresholds = DEFAULT_THRESHOLDS,
): Severity {
  if (ideal === 0) {
    // For ideal = 0 (e.g. AHC), use absolute comparison
    const absMeasured = Math.abs(measured);
    if (absMeasured <= 5) return 'normal';
    if (absMeasured <= 15) return 'mild';
    if (absMeasured <= 25) return 'moderate';
    return 'marked';
  }

  const deviation = Math.abs(measured - ideal) / Math.abs(ideal);

  if (deviation <= thresholds.normal) return 'normal';
  if (deviation <= thresholds.mild) return 'mild';
  if (deviation <= thresholds.moderate) return 'moderate';
  return 'marked';
}

/**
 * Calculate percentage loss from ideal.
 */
export function lossPercentage(measured: number, ideal: number): number {
  if (ideal === 0) return Math.abs(measured) * 100;
  return (Math.abs(measured - ideal) / Math.abs(ideal)) * 100;
}

// ─── Curve Rendering Helpers ─────────────────────────────────

/**
 * Generate control points for a smooth quadratic Bézier curve
 * through an array of points (for Arc of Life rendering).
 *
 * Returns an array of {control, end} pairs for use with
 * ctx.quadraticCurveTo().
 */
export function smoothCurveControlPoints(
  points: Point[],
): Array<{ control: Point; end: Point }> {
  if (points.length < 2) return [];

  const result: Array<{ control: Point; end: Point }> = [];

  for (let i = 0; i < points.length - 1; i++) {
    const current = points[i];
    const next = points[i + 1];

    if (i < points.length - 2) {
      const afterNext = points[i + 2];
      result.push({
        control: next,
        end: {
          x: (next.x + afterNext.x) / 2,
          y: (next.y + afterNext.y) / 2,
        },
      });
    } else {
      // Last segment: straight line to final point
      result.push({
        control: {
          x: (current.x + next.x) / 2,
          y: (current.y + next.y) / 2,
        },
        end: next,
      });
    }
  }

  return result;
}

/**
 * Calculate the perpendicular direction to a line segment.
 * Used for extending endplate lines beyond the landmark points.
 *
 * Returns a unit vector perpendicular to the line from p1 to p2.
 */
export function perpendicularDirection(
  p1: Point,
  p2: Point,
): { x: number; y: number } {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len === 0) return { x: 0, y: -1 };
  // Perpendicular: rotate 90° (swap and negate one)
  return { x: -dy / len, y: dx / len };
}

// ─── Utility ─────────────────────────────────────────────────

/**
 * Generate a UUID v4 (for analysis record IDs).
 */
export function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Scale a point from original image coordinates to canvas coordinates.
 */
export function toCanvasCoords(
  point: Point,
  imageWidth: number,
  imageHeight: number,
  canvasWidth: number,
  canvasHeight: number,
): Point {
  return {
    x: (point.x / imageWidth) * canvasWidth,
    y: (point.y / imageHeight) * canvasHeight,
  };
}

/**
 * Scale a point from canvas coordinates back to original image coordinates.
 */
export function toImageCoords(
  point: Point,
  imageWidth: number,
  imageHeight: number,
  canvasWidth: number,
  canvasHeight: number,
): Point {
  return {
    x: (point.x / canvasWidth) * imageWidth,
    y: (point.y / canvasHeight) * imageHeight,
  };
}
