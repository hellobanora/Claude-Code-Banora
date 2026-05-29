/**
 * Calculates the effective load on the cervical spine as a function of forward
 * head flexion angle, based on the Hansraj 2014 model.
 *
 * Hansraj, K. K. (2014). Assessment of stresses in the cervical spine caused by
 * posture and position of the head. Surgical Technology International, 25, 277–279.
 *
 * Published reference values from the original paper:
 *    0°  →  4.5–5.5 kg  (neutral head weight)
 *   15°  → 12 kg
 *   30°  → 18 kg
 *   45°  → 22 kg
 *   60°  → 27 kg
 *
 * This implementation interpolates linearly between those anchors so every
 * patient gets their exact number rather than rounding to the nearest 15° bin.
 */

const ANCHOR_ANGLES = [0, 15, 30, 45, 60] as const;
const ANCHOR_LOADS_DEFAULT = [5, 12, 18, 22, 27] as const;

export interface CervicalLoadOptions {
  /** Average adult head weight, kg. Tunable per patient if known. */
  neutralHeadWeightKg?: number;
}

/**
 * Effective load placed on the cervical spine at a given forward head angle.
 *
 * @param angleDegrees Forward flexion from neutral. Negative = extension, positive = forward.
 * @param options.neutralHeadWeightKg Patient-specific head weight, defaults to 5.0.
 * @returns Effective load in kilograms.
 */
export function effectiveCervicalLoad(
  angleDegrees: number,
  options: CervicalLoadOptions = {}
): number {
  const neutral = options.neutralHeadWeightKg ?? 5.0;

  // Clamp to a sensible physiological range. Beyond 75°, the model breaks down
  // (the patient would be looking near-vertically downward).
  const clamped = Math.max(-15, Math.min(angleDegrees, 75));

  // For extension (negative angle) we return neutral head weight. Clinically the
  // forward-flexion case is what drives intervention; extension load is roughly flat.
  if (clamped <= 0) return neutral;

  // Build the anchor array, scaling the 0° value to the patient-specific head weight.
  const loads = [neutral, ...ANCHOR_LOADS_DEFAULT.slice(1)];

  // Piecewise linear interpolation across the four published intervals.
  for (let i = 0; i < ANCHOR_ANGLES.length - 1; i++) {
    const a = ANCHOR_ANGLES[i];
    const b = ANCHOR_ANGLES[i + 1];
    if (clamped >= a && clamped <= b) {
      const t = (clamped - a) / (b - a);
      return loads[i] + t * (loads[i + 1] - loads[i]);
    }
  }

  // Above 60° — gentle extrapolation. Each additional 15° adds ~5 kg.
  const extra = (clamped - 60) / 15;
  return 27 + extra * 5;
}

/**
 * A short clinical description of what the load means in lay terms.
 * Used in the patient-facing report copy.
 */
/**
 * Estimate neutral head weight from total body weight.
 * The human head is approximately 7–8% of total body weight (Yoganandan et al. 2009).
 * Falls back to 5.0 kg (average adult) when body weight is unavailable.
 */
export function estimateHeadWeightKg(bodyWeightKg: number | undefined): number {
  if (!bodyWeightKg || bodyWeightKg <= 0) return 5.0;
  return bodyWeightKg * 0.075;
}

export function plainLanguageEquivalent(loadKg: number): string {
  if (loadKg < 6) return 'about the weight of a bowling ball';
  if (loadKg < 10) return 'about the weight of a small dog';
  if (loadKg < 15) return 'about the weight of a heavy bag of groceries';
  if (loadKg < 20) return 'about the weight of a four-year-old child';
  if (loadKg < 25) return 'about the weight of an eight-year-old child';
  return 'more than the weight of a typical primary-school child';
}
