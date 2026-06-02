// ═══════════════════════════════════════════════════════════════
// SpineView — Lumbar Lateral Analyser (Phase 2)
// Takes placed landmarks → returns MeasurementResult.
// ═══════════════════════════════════════════════════════════════

import type { LandmarkMap, MeasurementResult, Point, Severity } from './types';
import {
  LUMBAR_IDEAL_LORDOSIS,
  LUMBAR_IDEAL_SACRAL_BASE_ANGLE,
  LUMBAR_IDEAL_ANGLES,
} from './constants';
import {
  posteriorTangentAngle,
  segmentalAngle,
  angleFromHorizontal,
  gradeSeverity,
  lossPercentage,
} from './geometry';

function get(landmarks: LandmarkMap, id: string): Point | null {
  return landmarks[id] ?? null;
}

/**
 * Analyse lumbar lateral landmarks.
 *
 * TODO: Claude Code — implement fully in Phase 2.
 * Follow the same pattern as cervical-lateral.ts:
 * 1. Calculate segmental angles L1/L2 through L5/S1
 * 2. Calculate overall lumbar lordosis (L1–S1 Cobb)
 * 3. Calculate sacral base angle (Ferguson's angle)
 * 4. Calculate sagittal balance (L1 to S1 horizontal offset)
 *
 * Landmarks available:
 * - L1_sup_post, L1_inf_post through L5_sup_post, L5_inf_post
 * - S1_sup_post, S1_sup_ant
 * - L1_sup_ant
 */
export function analyseLumbarLateral(landmarks: LandmarkMap): MeasurementResult {
  const segments = Object.keys(LUMBAR_IDEAL_ANGLES).map((seg) => ({
    segment: seg,
    measured: null as number | null,
    ideal: LUMBAR_IDEAL_ANGLES[seg],
    deviationPercent: null as number | null,
    severity: null as Severity | null,
  }));

  // ─── Lumbar Lordosis (L1–S1 Cobb) ─────────────────────
  const l1Sup = get(landmarks, 'L1_sup_post');
  const l1Inf = get(landmarks, 'L1_inf_post');
  const l5Sup = get(landmarks, 'L5_sup_post');
  const l5Inf = get(landmarks, 'L5_inf_post');

  let lumbarLordosis: MeasurementResult['lumbarLordosis'] = undefined;

  if (l1Sup && l1Inf && l5Sup && l5Inf) {
    const measured = posteriorTangentAngle(l1Sup, l1Inf, l5Sup, l5Inf);
    lumbarLordosis = {
      measured,
      ideal: LUMBAR_IDEAL_LORDOSIS,
      lossPercent: lossPercentage(measured, LUMBAR_IDEAL_LORDOSIS),
      severity: gradeSeverity(measured, LUMBAR_IDEAL_LORDOSIS),
    };
  }

  // ─── Sacral Base Angle (Ferguson's) ───────────────────
  const s1Post = get(landmarks, 'S1_sup_post');
  const s1Ant = get(landmarks, 'S1_sup_ant');

  let sacralBaseAngle: MeasurementResult['sacralBaseAngle'] = undefined;

  if (s1Post && s1Ant) {
    const measured = Math.abs(angleFromHorizontal(s1Ant, s1Post));
    sacralBaseAngle = {
      measured,
      ideal: LUMBAR_IDEAL_SACRAL_BASE_ANGLE,
      severity: gradeSeverity(measured, LUMBAR_IDEAL_SACRAL_BASE_ANGLE),
    };
  }

  // ─── Segmental Angles ─────────────────────────────────
  const levels = ['L1', 'L2', 'L3', 'L4', 'L5'];
  const segKeys = Object.keys(LUMBAR_IDEAL_ANGLES);

  for (let i = 0; i < levels.length - 1; i++) {
    const lev = levels[i];
    const nextLev = levels[i + 1];
    const sup = get(landmarks, `${lev}_sup_post`);
    const inf = get(landmarks, `${lev}_inf_post`);
    const nextSup = get(landmarks, `${nextLev}_sup_post`);
    const nextInf = get(landmarks, `${nextLev}_inf_post`);

    if (sup && inf && nextSup && nextInf) {
      const angle = segmentalAngle(sup, inf, nextSup, nextInf);
      const segKey = `${lev}/${nextLev}`;
      const ideal = LUMBAR_IDEAL_ANGLES[segKey] ?? -10;
      const idx = segments.findIndex((s) => s.segment === segKey);
      if (idx >= 0) {
        segments[idx] = {
          segment: segKey,
          measured: angle,
          ideal,
          deviationPercent: lossPercentage(angle, ideal),
          severity: gradeSeverity(angle, ideal),
        };
      }
    }
  }

  // Handle L5/S1 segment
  const l5SupP = get(landmarks, 'L5_sup_post');
  const l5InfP = get(landmarks, 'L5_inf_post');
  const s1SupP = get(landmarks, 'S1_sup_post');
  if (l5SupP && l5InfP && s1SupP) {
    const lineL5 = angleFromHorizontal(l5SupP, l5InfP);
    const lineS1 = angleFromHorizontal(l5InfP, s1SupP);
    const angle = lineS1 - lineL5;
    const ideal = LUMBAR_IDEAL_ANGLES['L5/S1'] ?? -14;
    const idx = segments.findIndex((s) => s.segment === 'L5/S1');
    if (idx >= 0) {
      segments[idx] = {
        segment: 'L5/S1',
        measured: angle,
        ideal,
        deviationPercent: lossPercentage(angle, ideal),
        severity: gradeSeverity(angle, ideal),
      };
    }
  }

  return {
    viewType: 'lumbar_lateral',
    segments,
    lumbarLordosis,
    sacralBaseAngle,
  };
}
