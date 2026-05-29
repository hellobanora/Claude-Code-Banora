import type { PostureAnalysis } from '../models/analysis';

/**
 * Aggregated single-number trend metrics, modelled on PostureScreen's "Posture Index"
 * (Total Shifts and Total Tilts) so each session has two headline numbers you can
 * compare across visits. Useful for re-assessment conversations.
 *
 * Total Shifts: sum of absolute horizontal displacements at each anatomical
 *   landmark (cm).
 * Total Tilts: sum of absolute angular deviations (°).
 *
 * Separate values for anterior (AP) and right-side (lateral) views, since they
 * measure different things and you want patients to see both worsen/improve
 * independently.
 */
export interface PostureIndex {
  anterior: { totalShiftsCm: number; totalTiltsDeg: number };
  lateral: { totalShiftsCm: number; totalTiltsDeg: number };
}

export function computePostureIndex(a: PostureAnalysis): PostureIndex {
  // Anterior (front view) — head, shoulder, ribcage, and hip shifts and tilts.
  // We map shoulderUnlevelingMm to a "shift" magnitude for now; in a full impl
  // each segment's centre would have its own midline offset.
  const anteriorShiftMm =
    Math.abs(analysisValueOr0(a.shoulderUnlevelingMm)) +
    Math.abs(analysisValueOr0(a.pelvicUnlevelingMm)) +
    Math.abs(analysisValueOr0(a.lateralSwayMm));

  const anteriorTiltDeg =
    Math.abs(analysisValueOr0(a.headTiltDeg)) +
    Math.abs(analysisValueOr0(a.qAngleLDeg)) +
    Math.abs(analysisValueOr0(a.qAngleRDeg));

  // Lateral — plumb-line deviations at tragus, acromion, hip, knee + their angles.
  const lateralShiftMm = a.plumbLineDeviations.reduce(
    (sum, d) => sum + Math.abs(d.horizontalOffsetMm),
    0
  );

  const lateralTiltDeg =
    Math.abs(analysisValueOr0(a.forwardHeadAngleDeg)) +
    Math.abs(analysisValueOr0(a.shoulderProtractionDeg)) +
    Math.abs(analysisValueOr0(a.pelvicTiltLateralDeg));

  return {
    anterior: {
      totalShiftsCm: anteriorShiftMm / 10,
      totalTiltsDeg: anteriorTiltDeg,
    },
    lateral: {
      totalShiftsCm: lateralShiftMm / 10,
      totalTiltsDeg: lateralTiltDeg,
    },
  };
}

function analysisValueOr0(v: number | undefined): number {
  return v ?? 0;
}
