// ═══════════════════════════════════════════════════════════════
// SpineView — Ideal Spine Diagrams
// SVG path and shape data for rendering ideal spine comparisons.
// ═══════════════════════════════════════════════════════════════

/**
 * Ideal cervical lateral spine SVG data.
 *
 * All coordinates in a 200×400 viewBox.
 * The lordotic arc follows a smooth C-curve with ~42° total curvature.
 *
 * Used in the comparison panel: ideal (green) vs patient (red/amber).
 */
export const IDEAL_CERVICAL_LATERAL = {
  viewBox: '0 0 200 400',

  /** Smooth lordotic arc path (green) */
  arcPath: 'M 120 40 Q 100 120, 85 200 Q 80 280, 100 360',

  /** Vertebral body rectangles (C2–C7) */
  bodies: [
    { level: 'C2', x: 83, y: 60,  width: 48,  height: 28, rx: 4 },
    { level: 'C3', x: 81, y: 110, width: 51,  height: 28, rx: 4 },
    { level: 'C4', x: 79, y: 160, width: 54,  height: 28, rx: 4 },
    { level: 'C5', x: 77, y: 210, width: 57,  height: 28, rx: 4 },
    { level: 'C6', x: 75, y: 260, width: 60,  height: 28, rx: 4 },
    { level: 'C7', x: 73, y: 310, width: 63,  height: 28, rx: 4 },
  ],

  /** Label positions for level numbers */
  labels: [
    { level: 'C2', x: 170, y: 78 },
    { level: 'C3', x: 170, y: 128 },
    { level: 'C4', x: 170, y: 178 },
    { level: 'C5', x: 170, y: 228 },
    { level: 'C6', x: 170, y: 278 },
    { level: 'C7', x: 170, y: 328 },
  ],

  /** Summary text position */
  summaryPosition: { x: 100, y: 390 },
  summaryText: '42° lordosis',
};

/**
 * Generate a patient cervical spine arc path based on measured ARA.
 *
 * The ideal ARA is -42°. As ARA approaches 0° (loss of lordosis),
 * the curve straightens. Positive ARA = kyphotic reversal.
 *
 * @param ara - Measured ARA value
 * @param idealAra - Ideal ARA value (default -42)
 * @returns SVG path string for the patient's arc
 */
export function generatePatientCervicalArc(
  ara: number,
  idealAra: number = -42,
): string {
  // Normalise: 1.0 = perfect lordosis, 0 = straight, <0 = kyphotic
  const curveFactor = Math.max(-1, Math.min(1, ara / idealAra));

  // Adjust the control point x-position based on curve factor
  // Perfect lordosis: control points shift left (posterior curve)
  // Straight: control points stay at x=100 (vertical)
  // Kyphotic: control points shift right (reversed curve)
  const q1x = 100 + (1 - curveFactor) * 15;
  const q2x = q1x + 5;

  return `M 100 40 Q ${q1x} 120, ${q2x} 200 Q ${q2x + 3} 280, 100 360`;
}

/**
 * Ideal lumbar lateral spine SVG data.
 */
export const IDEAL_LUMBAR_LATERAL = {
  viewBox: '0 0 200 400',

  arcPath: 'M 100 30 Q 75 120, 70 200 Q 75 300, 110 370',

  bodies: [
    { level: 'L1', x: 70, y: 50,  width: 60, height: 35, rx: 4 },
    { level: 'L2', x: 68, y: 110, width: 64, height: 35, rx: 4 },
    { level: 'L3', x: 66, y: 170, width: 68, height: 35, rx: 4 },
    { level: 'L4', x: 68, y: 230, width: 68, height: 35, rx: 4 },
    { level: 'L5', x: 72, y: 290, width: 66, height: 35, rx: 4 },
  ],

  labels: [
    { level: 'L1', x: 165, y: 72 },
    { level: 'L2', x: 165, y: 132 },
    { level: 'L3', x: 165, y: 192 },
    { level: 'L4', x: 165, y: 252 },
    { level: 'L5', x: 165, y: 312 },
  ],

  sacrum: {
    path: 'M 80 340 L 120 340 L 115 380 Q 100 395, 85 380 Z',
  },

  summaryPosition: { x: 100, y: 395 },
  summaryText: '40–60° lordosis',
};
