import { findLandmark, type Landmark } from '../models/landmark';

export interface APFindings {
  headTiltDeg?: number;
  shoulderUnlevelingMm?: number;
  pelvicUnlevelingMm?: number;
  qAngleLDeg?: number;
  qAngleRDeg?: number;
  lateralSwayMm?: number;
  /** Lateral shift of each structure's midpoint relative to the pelvic plumb line.
   *  Positive = shifted image-right. Requires patient height for mm conversion. */
  headLateralShiftMm?: number;
  shoulderLateralShiftMm?: number;
  hipLateralShiftMm?: number;
}

export function analyseAP(
  landmarks: Landmark[],
  patientHeightCm: number | undefined
): APFindings {
  const mmPerUnit = millimetersPerNormalisedUnit(landmarks, patientHeightCm);
  const plumbX = computeApPlumbX(landmarks);

  return {
    headTiltDeg: computeHeadTiltDeg(landmarks),
    shoulderUnlevelingMm: heightDifferenceMm(
      findLandmark(landmarks, 'acromionL'),
      findLandmark(landmarks, 'acromionR'),
      mmPerUnit
    ),
    pelvicUnlevelingMm: heightDifferenceMm(
      findLandmark(landmarks, 'iliacCrestL'),
      findLandmark(landmarks, 'iliacCrestR'),
      mmPerUnit
    ),
    qAngleLDeg: computeQAngleDeg(
      findLandmark(landmarks, 'asisL'),
      findLandmark(landmarks, 'kneeCentreL'),
      findLandmark(landmarks, 'ankleCentreL')
    ),
    qAngleRDeg: computeQAngleDeg(
      findLandmark(landmarks, 'asisR'),
      findLandmark(landmarks, 'kneeCentreR'),
      findLandmark(landmarks, 'ankleCentreR')
    ),
    lateralSwayMm: computeLateralSwayMm(landmarks, mmPerUnit),
    headLateralShiftMm: lateralShiftMm(
      midX(findLandmark(landmarks, 'eyeOuterL'), findLandmark(landmarks, 'eyeOuterR')),
      plumbX,
      mmPerUnit
    ),
    shoulderLateralShiftMm: lateralShiftMm(
      midX(findLandmark(landmarks, 'acromionL'), findLandmark(landmarks, 'acromionR')),
      plumbX,
      mmPerUnit
    ),
    hipLateralShiftMm: lateralShiftMm(
      midX(findLandmark(landmarks, 'iliacCrestL'), findLandmark(landmarks, 'iliacCrestR')),
      plumbX,
      mmPerUnit
    ),
  };
}

/** The X coordinate of the vertical plumb line for the AP view (pelvic midpoint). */
function computeApPlumbX(landmarks: Landmark[]): number {
  const asisL = findLandmark(landmarks, 'asisL');
  const asisR = findLandmark(landmarks, 'asisR');
  if (asisL && asisR) return (asisL.position.x + asisR.position.x) / 2;
  const ankleL = findLandmark(landmarks, 'ankleCentreL');
  const ankleR = findLandmark(landmarks, 'ankleCentreR');
  if (ankleL && ankleR) return (ankleL.position.x + ankleR.position.x) / 2;
  return 0.5;
}

/** Normalised X midpoint of two paired landmarks. */
function midX(a: Landmark | undefined, b: Landmark | undefined): number | undefined {
  if (!a || !b) return undefined;
  return (a.position.x + b.position.x) / 2;
}

/** Lateral shift (mm) of a structure midpoint from the plumb line X. */
function lateralShiftMm(
  structureMidX: number | undefined,
  plumbX: number,
  mmPerUnit: number | undefined
): number | undefined {
  if (structureMidX === undefined || mmPerUnit === undefined) return undefined;
  return (structureMidX - plumbX) * mmPerUnit;
}

/** Eye-line tilt vs true horizontal. */
function computeHeadTiltDeg(landmarks: Landmark[]): number | undefined {
  const l = findLandmark(landmarks, 'eyeOuterL');
  const r = findLandmark(landmarks, 'eyeOuterR');
  if (!l || !r) return undefined;
  const dx = r.position.x - l.position.x;
  const dy = r.position.y - l.position.y;
  return (Math.atan2(dy, dx) * 180) / Math.PI;
}

/**
 * Difference in vertical position between paired left/right landmarks, in mm.
 * Positive = left side physically higher (more cranial).
 */
function heightDifferenceMm(
  left: Landmark | undefined,
  right: Landmark | undefined,
  mmPerUnit: number | undefined
): number | undefined {
  if (!left || !right || mmPerUnit === undefined) return undefined;
  // Image Y grows downward, so smaller y = higher physically. Difference is
  // (right.y - left.y): positive when left.y is smaller, i.e. left is higher.
  return (right.position.y - left.position.y) * mmPerUnit;
}

/**
 * Q angle proxy from ASIS → patella centre → ankle centre. Returns the deviation
 * from a straight femur-tibia line (0° = perfectly aligned).
 */
function computeQAngleDeg(
  hip: Landmark | undefined,
  knee: Landmark | undefined,
  ankle: Landmark | undefined
): number | undefined {
  if (!hip || !knee || !ankle) return undefined;

  const femurDx = hip.position.x - knee.position.x;
  const femurDy = hip.position.y - knee.position.y;
  const tibiaDx = ankle.position.x - knee.position.x;
  const tibiaDy = ankle.position.y - knee.position.y;

  const dot = femurDx * tibiaDx + femurDy * tibiaDy;
  const magFemur = Math.hypot(femurDx, femurDy);
  const magTibia = Math.hypot(tibiaDx, tibiaDy);
  if (magFemur === 0 || magTibia === 0) return undefined;

  const cosTheta = Math.max(-1, Math.min(1, dot / (magFemur * magTibia)));
  const angleBetweenDeg = (Math.acos(cosTheta) * 180) / Math.PI;

  // Q angle = deviation from straight line, so 180° (perfectly straight) = 0° Q.
  return 180 - angleBetweenDeg;
}

/**
 * Horizontal offset of the suprasternal notch from a vertical line through the
 * midpoint of the two ASIS landmarks.
 */
function computeLateralSwayMm(
  landmarks: Landmark[],
  mmPerUnit: number | undefined
): number | undefined {
  const notch = findLandmark(landmarks, 'suprasternalNotch');
  const asisL = findLandmark(landmarks, 'asisL');
  const asisR = findLandmark(landmarks, 'asisR');
  if (!notch || !asisL || !asisR || mmPerUnit === undefined) return undefined;
  const pelvicMidX = (asisL.position.x + asisR.position.x) / 2;
  return (notch.position.x - pelvicMidX) * mmPerUnit;
}

/**
 * Real-world mm per one unit of normalised image coordinate. Needs patient
 * height plus visible head-to-ankle landmarks.
 */
function millimetersPerNormalisedUnit(
  landmarks: Landmark[],
  patientHeightCm: number | undefined
): number | undefined {
  if (!patientHeightCm) return undefined;
  const headYs = [
    findLandmark(landmarks, 'eyeOuterL')?.position.y,
    findLandmark(landmarks, 'eyeOuterR')?.position.y,
  ].filter((y): y is number => y !== undefined);
  const ankleYs = [
    findLandmark(landmarks, 'ankleCentreL')?.position.y,
    findLandmark(landmarks, 'ankleCentreR')?.position.y,
  ].filter((y): y is number => y !== undefined);
  if (headYs.length === 0 || ankleYs.length === 0) return undefined;
  const headY = Math.min(...headYs);
  const ankleY = Math.max(...ankleYs);
  if (ankleY - headY <= 0.5) return undefined;
  return (patientHeightCm * 10) / (ankleY - headY);
}
