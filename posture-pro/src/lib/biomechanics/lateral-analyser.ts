import { findLandmark, type Landmark, type LandmarkID } from '../models/landmark';
import type { PlumbLineDeviation } from '../models/analysis';
import { effectiveCervicalLoad } from './cervical-load';

export interface LateralFindings {
  forwardHeadAngleDeg?: number;
  cervicalLoadKg?: number;
  shoulderProtractionDeg?: number;
  plumbDeviations: PlumbLineDeviation[];
}

/**
 * Compute all lateral-view postural findings from a set of landmarks. Missing
 * landmarks just mean their dependent measurements come back undefined — the
 * function never throws.
 */
export function analyseLateral(
  landmarks: Landmark[],
  patientHeightCm: number | undefined,
  neutralHeadWeightKg?: number
): LateralFindings {
  const result: LateralFindings = { plumbDeviations: [] };

  const fwd = computeForwardHeadAngleDeg(landmarks);
  if (fwd !== undefined) {
    // Use magnitude so the calculation works regardless of whether the
    // patient faces left or right in the photo. Forward head carriage
    // is always a positive deviation from neutral.
    const magnitude = Math.abs(fwd);
    result.forwardHeadAngleDeg = magnitude;
    result.cervicalLoadKg = effectiveCervicalLoad(magnitude, { neutralHeadWeightKg });
  }

  const prot = computeShoulderProtractionDeg(landmarks);
  result.shoulderProtractionDeg = prot !== undefined ? Math.abs(prot) : undefined;
  result.plumbDeviations = computePlumbDeviations(landmarks, patientHeightCm);

  return result;
}

/**
 * Angle (degrees) between vertical and the line from acromion-to-tragus.
 * Positive = head forward of shoulders. Negative = head behind shoulders.
 */
function computeForwardHeadAngleDeg(landmarks: Landmark[]): number | undefined {
  const tragus = findLandmark(landmarks, 'tragus');
  const lowerRef = findLandmark(landmarks, 'acromionLat');
  if (!tragus || !lowerRef) return undefined;

  // Image coordinates have Y growing downward. The angle between
  // (lowerRef → tragus) and "true up" (negative-Y direction).
  const dx = tragus.position.x - lowerRef.position.x;
  const dy = tragus.position.y - lowerRef.position.y; // negative if tragus above ref

  // atan2(dx, -dy): positive when tragus sits forward of (greater x than) the reference.
  const radians = Math.atan2(dx, -dy);
  return (radians * 180) / Math.PI;
}

/** Acromion forward of plumb line through the ear, in degrees. */
function computeShoulderProtractionDeg(landmarks: Landmark[]): number | undefined {
  const tragus = findLandmark(landmarks, 'tragus');
  const acromion = findLandmark(landmarks, 'acromionLat');
  if (!tragus || !acromion) return undefined;

  const dx = acromion.position.x - tragus.position.x;
  const dy = acromion.position.y - tragus.position.y; // expect positive — acromion below ear
  if (dy <= 0) return undefined; // sanity check on placement

  const radians = Math.atan2(dx, dy);
  return (radians * 180) / Math.PI;
}


/**
 * Horizontal distance each landmark sits from a plumb line through the lateral
 * malleolus, converted to mm if patient height is known.
 */
function computePlumbDeviations(
  landmarks: Landmark[],
  patientHeightCm: number | undefined
): PlumbLineDeviation[] {
  const ankle = findLandmark(landmarks, 'lateralMalleolus');
  if (!ankle) return [];
  const plumbX = ankle.position.x;

  // Image-to-real-world scale needs visible head-to-ankle + known height.
  let mmPerUnit: number | undefined;
  if (patientHeightCm) {
    const headY = findLandmark(landmarks, 'tragus')?.position.y;
    if (headY !== undefined) {
      const visibleFraction = ankle.position.y - headY;
      if (visibleFraction > 0.5) {
        mmPerUnit = (patientHeightCm * 10) / visibleFraction;
      }
    }
  }

  const interesting: LandmarkID[] = [
    'tragus',
    'acromionLat',
    'greaterTrochanter',
    'lateralKnee',
  ];

  const deviations: PlumbLineDeviation[] = [];
  for (const id of interesting) {
    const lm = findLandmark(landmarks, id);
    if (!lm) continue;
    const offsetNormalised = lm.position.x - plumbX;
    deviations.push({
      landmark: id,
      horizontalOffsetMm: mmPerUnit ? mmPerUnit * offsetNormalised : 0,
      normalisedOffset: offsetNormalised,
    });
  }
  return deviations;
}
