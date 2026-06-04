import type { PostureAnalysis } from '../models/analysis';
import { plainLanguageEquivalent } from './cervical-load';

/**
 * Produces plain-English sentences describing each finding, in the same factual,
 * descriptive voice as the PostureScreen reference report.
 *
 * Tone rules (AHPRA-safe):
 *   • Descriptive, not promissory — "shows", "is shifted", "approximately"
 *   • No "fix", "cure", "best", "guaranteed", "expert"
 *   • No comparative claims against other clinics or providers
 *   • Approximations for any body-weight figure (head weight varies by build)
 *
 * Returns sentence arrays so the layout can render each as a separate bullet,
 * matching the PostureScreen format on page 1.
 */
export interface ReportNarrative {
  anteriorBullets: string[];
  lateralBullets: string[];
  /** Headline sentence pair for the Effective Head Weight callout. */
  headWeightHeadline?: { plain: string; physics: string };
}

const DEFAULT_HEAD_WEIGHT_KG = 5.0;

export function buildNarrative(
  a: PostureAnalysis,
  options: { neutralHeadWeightKg?: number } = {}
): ReportNarrative {
  const neutralHead = options.neutralHeadWeightKg ?? DEFAULT_HEAD_WEIGHT_KG;

  return {
    anteriorBullets: buildAnteriorBullets(a),
    lateralBullets: buildLateralBullets(a, neutralHead),
    headWeightHeadline:
      a.cervicalLoadKg !== undefined && a.forwardHeadAngleDeg !== undefined
        ? buildHeadWeightHeadline(a.cervicalLoadKg, a.forwardHeadAngleDeg, neutralHead)
        : undefined,
  };
}

function buildAnteriorBullets(a: PostureAnalysis): string[] {
  const out: string[] = [];

  // Head: prefer lateral shift (cm) if available, fall back to tilt angle.
  if (a.headLateralShiftMm !== undefined) {
    const cm = Math.abs(a.headLateralShiftMm / 10).toFixed(2);
    const dir = a.headLateralShiftMm > 0 ? 'right' : 'left';
    out.push(`Head is shifted ${cm} cm ${dir}.`);
  } else if (a.headTiltDeg !== undefined) {
    const dir = a.headTiltDeg > 0 ? 'right' : 'left';
    out.push(`Head is tilted ${Math.abs(a.headTiltDeg).toFixed(1)}° ${dir}.`);
  }

  // Shoulders: prefer lateral shift (cm) if available.
  if (a.shoulderLateralShiftMm !== undefined) {
    const cm = Math.abs(a.shoulderLateralShiftMm / 10).toFixed(2);
    const dir = a.shoulderLateralShiftMm > 0 ? 'right' : 'left';
    out.push(`Shoulders shifted ${cm} cm ${dir}.`);
  } else if (a.shoulderUnlevelingMm !== undefined) {
    const mm = a.shoulderUnlevelingMm;
    const dir = mm > 0 ? 'right' : 'left';
    out.push(`Shoulders are unlevel by ${Math.abs(mm / 10).toFixed(2)} cm, ${dir} side higher.`);
  }

  // Hips: prefer lateral shift (cm) if available.
  if (a.hipLateralShiftMm !== undefined) {
    const cm = Math.abs(a.hipLateralShiftMm / 10).toFixed(2);
    const dir = a.hipLateralShiftMm > 0 ? 'right' : 'left';
    out.push(`Hips shifted ${cm} cm ${dir}.`);
  } else if (a.pelvicUnlevelingMm !== undefined) {
    const mm = a.pelvicUnlevelingMm;
    const dir = mm > 0 ? 'right' : 'left';
    out.push(`Hips are unlevel by ${Math.abs(mm / 10).toFixed(2)} cm, ${dir} side higher.`);
  }

  return out;
}

function buildLateralBullets(a: PostureAnalysis, neutralHead: number): string[] {
  const out: string[] = [];

  // Head weight — the signature finding.
  if (a.cervicalLoadKg !== undefined) {
    out.push(
      `Head weighs approximately ${a.cervicalLoadKg.toFixed(1)} kg due to forward head posture.`
    );
  }

  // Plumb-line deviations: shoulders, hips, knees (in that order).
  const devMap = new Map(a.plumbLineDeviations.map((d) => [d.landmark, d]));

  const shoulderDev = devMap.get('acromionLat');
  if (shoulderDev && shoulderDev.horizontalOffsetMm !== 0) {
    const cm = Math.abs(shoulderDev.horizontalOffsetMm / 10).toFixed(2);
    const dir = shoulderDev.horizontalOffsetMm > 0 ? 'forward' : 'backward';
    out.push(`Shoulders shifted ${cm} cm ${dir}.`);
  }

  const hipDev = devMap.get('greaterTrochanter');
  if (hipDev && hipDev.horizontalOffsetMm !== 0) {
    const cm = Math.abs(hipDev.horizontalOffsetMm / 10).toFixed(2);
    const dir = hipDev.horizontalOffsetMm > 0 ? 'forward' : 'backward';
    out.push(`Hips shifted ${cm} cm ${dir}.`);
  }

  const kneeDev = devMap.get('lateralKnee');
  if (kneeDev && kneeDev.horizontalOffsetMm !== 0) {
    const cm = Math.abs(kneeDev.horizontalOffsetMm / 10).toFixed(2);
    const dir = kneeDev.horizontalOffsetMm > 0 ? 'forward' : 'backward';
    out.push(`Knees shifted ${cm} cm ${dir}.`);
  }

  return out;
}

function buildHeadWeightHeadline(
  loadKg: number,
  angleDeg: number,
  neutralHead: number
): { plain: string; physics: string } {
  return {
    plain: `Head weighs approximately ${neutralHead.toFixed(1)} kg, angled ${angleDeg.toFixed(
      1
    )}° forward of vertical.`,
    physics: `Based on physics, the head now effectively weighs ${loadKg.toFixed(
      1
    )} kg instead of ${neutralHead.toFixed(1)} kg.`,
  };
}

function humanLandmarkLabel(id: string): string {
  switch (id) {
    case 'tragus':
      return 'Ear';
    case 'acromionLat':
      return 'Shoulder';
    case 'greaterTrochanter':
      return 'Hip';
    case 'lateralKnee':
      return 'Knee';
    default:
      return id;
  }
}
