// ═══════════════════════════════════════════════════════════════
// SpineView — Lumbar AP / Pelvis Analyser (Phase 2)
// Takes placed landmarks → returns MeasurementResult.
// ═══════════════════════════════════════════════════════════════

import type { LandmarkMap, MeasurementResult, Point } from './types';
import {
  cobbAngle,
  verticalOffset,
  gradeSeverity,
} from './geometry';

function get(landmarks: LandmarkMap, id: string): Point | null {
  return landmarks[id] ?? null;
}

/**
 * Analyse lumbar AP / pelvis landmarks.
 *
 * Measurements:
 * 1. Pelvic unleveling (iliac crest height difference)
 * 2. Femur head height (leg length inequality)
 * 3. Sacral base unleveling
 * 4. Scoliosis Cobb angle (if end vertebrae marked)
 *
 * TODO: Claude Code — wire up spinous process deviation
 * trace for lateral listhesis detection.
 */
export function analyseLumbarAP(landmarks: LandmarkMap): MeasurementResult {
  // ─── Pelvic Unleveling ────────────────────────────────
  const iliacL = get(landmarks, 'iliac_crest_L');
  const iliacR = get(landmarks, 'iliac_crest_R');

  let pelvicUnleveling: MeasurementResult['pelvicUnleveling'] = undefined;
  if (iliacL && iliacR) {
    const { pixels, highSide } = verticalOffset(iliacL, iliacR);
    pelvicUnleveling = {
      pixels,
      mm: null,
      highSide,
      severity: gradeSeverity(pixels, 0),
    };
  }

  // ─── Femur Head Height ────────────────────────────────
  const femurL = get(landmarks, 'femur_head_L');
  const femurR = get(landmarks, 'femur_head_R');

  let femurHeadHeight: MeasurementResult['femurHeadHeight'] = undefined;
  if (femurL && femurR) {
    const { pixels, highSide } = verticalOffset(femurL, femurR);
    femurHeadHeight = {
      pixels,
      mm: null,
      highSide,
      severity: gradeSeverity(pixels, 0),
    };
  }

  // ─── Sacral Base Unleveling ───────────────────────────
  const sacralL = get(landmarks, 'sacral_base_L');
  const sacralR = get(landmarks, 'sacral_base_R');

  let sacralBaseUnleveling: MeasurementResult['sacralBaseUnleveling'] = undefined;
  if (sacralL && sacralR) {
    const { pixels, highSide } = verticalOffset(sacralL, sacralR);
    sacralBaseUnleveling = {
      pixels,
      mm: null,
      highSide,
      severity: gradeSeverity(pixels, 0),
    };
  }

  // ─── Scoliosis Cobb Angle ─────────────────────────────
  const cobbUL = get(landmarks, 'cobb_upper_L');
  const cobbUR = get(landmarks, 'cobb_upper_R');
  const cobbLL = get(landmarks, 'cobb_lower_L');
  const cobbLR = get(landmarks, 'cobb_lower_R');

  let cobbResult: MeasurementResult['cobbAngle'] = undefined;
  if (cobbUL && cobbUR && cobbLL && cobbLR) {
    const measured = cobbAngle(cobbUL, cobbUR, cobbLL, cobbLR);
    // Determine convexity: if the midpoint of spinous processes
    // deviates left, convexity is right (and vice versa)
    const midUpper = { x: (cobbUL.x + cobbUR.x) / 2, y: (cobbUL.y + cobbUR.y) / 2 };
    const midLower = { x: (cobbLL.x + cobbLR.x) / 2, y: (cobbLL.y + cobbLR.y) / 2 };
    const l3Spinous = get(landmarks, 'L3_spinous');
    let convexity: 'L' | 'R' = 'R';
    if (l3Spinous) {
      const midline = (midUpper.x + midLower.x) / 2;
      convexity = l3Spinous.x < midline ? 'R' : 'L';
    }

    cobbResult = {
      measured,
      severity: gradeSeverity(measured, 0),
      convexity,
    };
  }

  return {
    viewType: 'lumbar_ap',
    segments: [],
    pelvicUnleveling,
    femurHeadHeight,
    sacralBaseUnleveling,
    cobbAngle: cobbResult,
  };
}
