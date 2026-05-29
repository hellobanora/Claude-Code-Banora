// ═══════════════════════════════════════════════════════════════
// SpineView — Cervical Lateral Analyser
// Takes placed landmarks → returns complete MeasurementResult.
// ═══════════════════════════════════════════════════════════════

import type { Point, LandmarkMap, MeasurementResult, SegmentAngle, Severity } from './types';
import {
  CERVICAL_IDEAL_ANGLES,
  CERVICAL_IDEAL_ARA,
  CERVICAL_SEGMENT_PAIRS,
} from './constants';
import {
  posteriorTangentAngle,
  segmentalAngle,
  horizontalOffset,
  gradeSeverity,
  lossPercentage,
  angleFromHorizontal,
} from './geometry';

/**
 * Get a landmark point, returning null if not placed.
 */
function get(landmarks: LandmarkMap, id: string): Point | null {
  return landmarks[id] ?? null;
}

/**
 * Analyse cervical lateral landmarks and compute all measurements.
 *
 * Can be called with partial landmarks (during placement) —
 * measurements that don't have enough landmarks return null values.
 */
export function analyseCervicalLateral(landmarks: LandmarkMap): MeasurementResult {
  const segments: SegmentAngle[] = [];

  // ─── C1/C2 Segment ──────────────────────────────────────
  const c1Post = get(landmarks, 'C1_post');
  const c2SupPost = get(landmarks, 'C2_sup_post');
  const c2InfPost = get(landmarks, 'C2_inf_post');

  if (c1Post && c2SupPost && c2InfPost) {
    // C1/C2 angle: angle between C1_post→C2_sup and C2 body line
    const lineC1C2 = angleFromHorizontal(c1Post, c2SupPost);
    const lineC2Body = angleFromHorizontal(c2SupPost, c2InfPost);
    const angle = lineC2Body - lineC1C2;
    const ideal = CERVICAL_IDEAL_ANGLES['C1/C2'];
    const deviation = lossPercentage(angle, ideal);
    segments.push({
      segment: 'C1/C2',
      measured: angle,
      ideal,
      deviationPercent: deviation,
      severity: gradeSeverity(angle, ideal),
    });
  } else {
    segments.push({
      segment: 'C1/C2',
      measured: null,
      ideal: CERVICAL_IDEAL_ANGLES['C1/C2'],
      deviationPercent: null,
      severity: null,
    });
  }

  // ─── C2/C3 through C6/C7 Segments ──────────────────────
  for (const pair of CERVICAL_SEGMENT_PAIRS) {
    const sup = get(landmarks, pair.supPost);
    const inf = get(landmarks, pair.infPost);
    const nextSup = get(landmarks, pair.nextSupPost);
    const nextInf = pair.nextInfPost ? get(landmarks, pair.nextInfPost) : null;

    if (sup && inf && nextSup && nextInf) {
      const angle = segmentalAngle(sup, inf, nextSup, nextInf);
      const ideal = CERVICAL_IDEAL_ANGLES[pair.segment];
      const deviation = lossPercentage(angle, ideal);
      segments.push({
        segment: pair.segment,
        measured: angle,
        ideal,
        deviationPercent: deviation,
        severity: gradeSeverity(angle, ideal),
      });
    } else {
      segments.push({
        segment: pair.segment,
        measured: null,
        ideal: CERVICAL_IDEAL_ANGLES[pair.segment],
        deviationPercent: null,
        severity: null,
      });
    }
  }

  // ─── C7/T1 Segment ─────────────────────────────────────
  const c7SupPost = get(landmarks, 'C7_sup_post');
  const c7InfPost = get(landmarks, 'C7_inf_post');
  const t1SupPost = get(landmarks, 'T1_sup_post');

  if (c7SupPost && c7InfPost && t1SupPost) {
    // Use C7 body line and C7inf→T1sup line
    const lineC7 = angleFromHorizontal(c7SupPost, c7InfPost);
    const lineT1 = angleFromHorizontal(c7InfPost, t1SupPost);
    const angle = lineT1 - lineC7;
    const ideal = CERVICAL_IDEAL_ANGLES['C7/T1'];
    const deviation = lossPercentage(angle, ideal);
    segments.push({
      segment: 'C7/T1',
      measured: angle,
      ideal,
      deviationPercent: deviation,
      severity: gradeSeverity(angle, ideal),
    });
  } else {
    segments.push({
      segment: 'C7/T1',
      measured: null,
      ideal: CERVICAL_IDEAL_ANGLES['C7/T1'],
      deviationPercent: null,
      severity: null,
    });
  }

  // ─── ARA (C2–C7 Cobb Angle) ────────────────────────────
  // Posterior tangent method: angle between C2 body line and C7 body line
  const c2Sup = get(landmarks, 'C2_sup_post');
  const c2Inf = get(landmarks, 'C2_inf_post');
  const c7Sup = get(landmarks, 'C7_sup_post');
  const c7Inf = get(landmarks, 'C7_inf_post');

  let ara: MeasurementResult['ara'] = undefined;

  if (c2Sup && c2Inf && c7Sup && c7Inf) {
    const measured = posteriorTangentAngle(c2Sup, c2Inf, c7Sup, c7Inf);
    const loss = lossPercentage(measured, CERVICAL_IDEAL_ARA);
    ara = {
      measured,
      ideal: CERVICAL_IDEAL_ARA,
      lossPercent: loss,
      severity: gradeSeverity(measured, CERVICAL_IDEAL_ARA),
    };
  }

  // ─── Anterior Head Carriage ────────────────────────────
  // Horizontal offset between C2 superior and C7 inferior
  let anteriorHeadCarriage: MeasurementResult['anteriorHeadCarriage'] = undefined;

  if (c2Sup && c7Inf) {
    const pixels = horizontalOffset(c2Sup, c7Inf);
    anteriorHeadCarriage = {
      pixels,
      mm: null, // Needs calibration to convert
      severity: gradeSeverity(pixels, 0), // Uses absolute thresholds
    };
  }

  return {
    viewType: 'cervical_lateral',
    ara,
    segments,
    anteriorHeadCarriage,
  };
}

/**
 * Get all posterior points that have been placed (for George's Line rendering).
 * Returns points in anatomical order (C1 → T1).
 */
export function getCervicalPosteriorPoints(landmarks: LandmarkMap): Point[] {
  const ids = [
    'C1_post',
    'C2_sup_post', 'C2_inf_post',
    'C3_sup_post', 'C3_inf_post',
    'C4_sup_post', 'C4_inf_post',
    'C5_sup_post', 'C5_inf_post',
    'C6_sup_post', 'C6_inf_post',
    'C7_sup_post', 'C7_inf_post',
    'T1_sup_post',
  ];

  return ids
    .map((id) => landmarks[id])
    .filter((pt): pt is Point => pt !== undefined && pt !== null);
}

/**
 * Get vertebral body pairs for endplate line rendering.
 * Each pair is [superiorPost, inferiorPost] for a vertebral body.
 */
export function getCervicalVertebralBodies(
  landmarks: LandmarkMap,
): Array<{ level: string; sup: Point; inf: Point; index: number }> {
  const levels = ['C2', 'C3', 'C4', 'C5', 'C6', 'C7'];
  const bodies: Array<{ level: string; sup: Point; inf: Point; index: number }> = [];

  levels.forEach((level, i) => {
    const sup = get(landmarks, `${level}_sup_post`);
    const inf = get(landmarks, `${level}_inf_post`);
    if (sup && inf) {
      bodies.push({ level, sup, inf, index: i + 2 }); // C2=2, C3=3, etc.
    }
  });

  return bodies;
}
