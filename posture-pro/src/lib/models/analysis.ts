import type { LandmarkID } from './landmark';

/** Severity grading shown in reports. Maps numeric values to coloured bands. */
export type PostureSeverity = 'ideal' | 'mild' | 'moderate' | 'marked';

export const SEVERITY_COLOR: Record<PostureSeverity, string> = {
  ideal: '#2C8A3B',
  mild: '#D4A017',
  moderate: '#E07B00',
  marked: '#C0392B',
};

export interface PlumbLineDeviation {
  landmark: LandmarkID;
  /** + = forward of plumb, - = behind. Millimetres if patient height known, else 0. */
  horizontalOffsetMm: number;
  /** Offset as fraction of body height (always available). */
  normalisedOffset: number;
}

/** The complete output of running the engine on a session's landmarks. */
export interface PostureAnalysis {
  // Lateral findings
  forwardHeadAngleDeg?: number;
  cervicalLoadKg?: number;
  shoulderProtractionDeg?: number;
  pelvicTiltLateralDeg?: number;
  plumbLineDeviations: PlumbLineDeviation[];

  // AP findings
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

  // Meta
  generatedAt: string;
  /** Fraction of expected landmarks that were placed (0–1). */
  inputCompleteness: number;
}

export function emptyAnalysis(): PostureAnalysis {
  return {
    plumbLineDeviations: [],
    generatedAt: new Date().toISOString(),
    inputCompleteness: 0,
  };
}
