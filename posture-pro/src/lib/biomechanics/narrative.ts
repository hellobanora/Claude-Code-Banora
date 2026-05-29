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

  // Head: lateral shift (mm) and tilt (degrees). Sign → direction word.
  if (a.headTiltDeg !== undefined) {
    const dir = a.headTiltDeg > 0 ? 'right' : 'left';
    out.push(`Head is tilted ${Math.abs(a.headTiltDeg).toFixed(1)}° ${dir}.`);
  }

  // Shoulder unleveling. + = right side higher in this convention.
  if (a.shoulderUnlevelingMm !== undefined) {
    const mm = a.shoulderUnlevelingMm;
    const dir = mm > 0 ? 'right' : 'left';
    out.push(`Shoulders are unlevel by ${Math.abs(mm / 10).toFixed(2)} cm, ${dir} side higher.`);
  }

  // Pelvic unleveling.
  if (a.pelvicUnlevelingMm !== undefined) {
    const mm = a.pelvicUnlevelingMm;
    const dir = mm > 0 ? 'right' : 'left';
    out.push(`Hips are unlevel by ${Math.abs(mm / 10).toFixed(2)} cm, ${dir} side higher.`);
  }

  // Lateral postural sway — torso shift relative to pelvic midline.
  if (a.lateralSwayMm !== undefined) {
    const mm = a.lateralSwayMm;
    const dir = mm > 0 ? 'right' : 'left';
    out.push(`Ribcage is shifted ${Math.abs(mm / 10).toFixed(2)} cm ${dir} of midline.`);
  }

  return out;
}

function buildLateralBullets(a: PostureAnalysis, neutralHead: number): string[] {
  const out: string[] = [];

  // The signature finding — same sentence shape as PostureScreen.
  if (a.forwardHeadAngleDeg !== undefined && a.cervicalLoadKg !== undefined) {
    out.push(
      `Head weighs approximately ${neutralHead.toFixed(1)} kg. ` +
        `It is angled ${a.forwardHeadAngleDeg.toFixed(1)}° forward of vertical.`
    );
    out.push(
      `Based on physics, the head now effectively weighs ${a.cervicalLoadKg.toFixed(
        1
      )} kg instead of ${neutralHead.toFixed(1)} kg — ${plainLanguageEquivalent(
        a.cervicalLoadKg
      )}.`
    );
  }

  // Shoulder protraction (forward roll). + value here = acromion forward of ear.
  if (a.shoulderProtractionDeg !== undefined) {
    const v = a.shoulderProtractionDeg;
    const dir = v > 0 ? 'forward' : 'backward';
    out.push(`Shoulders sit ${Math.abs(v).toFixed(1)}° ${dir} of vertical through the ear.`);
  }

  // Pelvic tilt — anterior vs posterior.
  if (a.pelvicTiltLateralDeg !== undefined) {
    const v = a.pelvicTiltLateralDeg;
    const dir = v > 0 ? 'anterior' : 'posterior';
    out.push(`Pelvis shows ${Math.abs(v).toFixed(1)}° of ${dir} tilt.`);
  }

  // Plumb-line summaries for each measured landmark.
  for (const dev of a.plumbLineDeviations) {
    if (dev.horizontalOffsetMm === 0) continue;
    const cm = Math.abs(dev.horizontalOffsetMm / 10).toFixed(2);
    const dir = dev.horizontalOffsetMm > 0 ? 'forward' : 'backward';
    const label = humanLandmarkLabel(dev.landmark);
    out.push(`${label} sits ${cm} cm ${dir} of the plumb line.`);
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
