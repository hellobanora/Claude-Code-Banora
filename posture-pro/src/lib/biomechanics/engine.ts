import type { Patient, PostureSession } from '../models/patient';
import type { PostureAnalysis, PostureSeverity } from '../models/analysis';
import { emptyAnalysis } from '../models/analysis';
import { analyseLateral } from './lateral-analyser';
import { analyseAP } from './ap-analyser';
import { estimateHeadWeightKg } from './cervical-load';

/** Run the right analysers for a session and assemble a unified PostureAnalysis. */
export function runPostureAnalysis(
  session: PostureSession,
  patient: Patient
): PostureAnalysis {
  const result = emptyAnalysis();
  const neutralHeadKg = estimateHeadWeightKg(patient.weightKg);

  if (session.lateralCapture) {
    const lat = analyseLateral(session.lateralCapture.landmarks, patient.heightCm, neutralHeadKg);
    result.forwardHeadAngleDeg = lat.forwardHeadAngleDeg;
    result.cervicalLoadKg = lat.cervicalLoadKg;
    result.shoulderProtractionDeg = lat.shoulderProtractionDeg;
    result.pelvicTiltLateralDeg = lat.pelvicTiltDeg;
    result.plumbLineDeviations = lat.plumbDeviations;
  }

  if (session.apCapture) {
    const ap = analyseAP(session.apCapture.landmarks, patient.heightCm);
    result.headTiltDeg = ap.headTiltDeg;
    result.shoulderUnlevelingMm = ap.shoulderUnlevelingMm;
    result.pelvicUnlevelingMm = ap.pelvicUnlevelingMm;
    result.qAngleLDeg = ap.qAngleLDeg;
    result.qAngleRDeg = ap.qAngleRDeg;
    result.lateralSwayMm = ap.lateralSwayMm;
    result.headLateralShiftMm = ap.headLateralShiftMm;
    result.shoulderLateralShiftMm = ap.shoulderLateralShiftMm;
    result.hipLateralShiftMm = ap.hipLateralShiftMm;
  }

  result.inputCompleteness = completeness(session);
  return result;
}

function completeness(session: PostureSession): number {
  const placed =
    (session.lateralCapture?.landmarks.length ?? 0) +
    (session.apCapture?.landmarks.length ?? 0);
  // 7 lateral landmarks + 13 AP landmarks = 20 if both done.
  const expected = 20;
  return Math.min(1, placed / expected);
}

// ─── Severity grading ────────────────────────────────────────────────────

/**
 * Grade forward head angle into a clinical severity band. Bands are conventions
 * used across multiple posture-analysis programs; refine against clinical preference.
 */
export function forwardHeadSeverity(angleDeg: number | undefined): PostureSeverity | undefined {
  if (angleDeg === undefined) return undefined;
  if (angleDeg < 5) return 'ideal';
  if (angleDeg < 15) return 'mild';
  if (angleDeg < 25) return 'moderate';
  return 'marked';
}

export function headTiltSeverity(deg: number | undefined): PostureSeverity | undefined {
  if (deg === undefined) return undefined;
  const mag = Math.abs(deg);
  if (mag < 2) return 'ideal';
  if (mag < 5) return 'mild';
  if (mag < 10) return 'moderate';
  return 'marked';
}

export function shoulderUnlevelingSeverity(mm: number | undefined): PostureSeverity | undefined {
  if (mm === undefined) return undefined;
  const mag = Math.abs(mm);
  if (mag < 5) return 'ideal';
  if (mag < 10) return 'mild';
  if (mag < 20) return 'moderate';
  return 'marked';
}
