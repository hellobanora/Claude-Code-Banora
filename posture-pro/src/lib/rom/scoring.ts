// src/lib/rom/scoring.ts
// Traffic-light scoring for ROM results.
//
// Design intent (per James's brief): if ROM is markedly reduced, it should
// show RED at a glance — this drives the visual report and is meant to be
// readable by a patient with zero clinical background.

import { TrafficLight } from "./types";
import { TRAFFIC_LIGHT_THRESHOLDS } from "./constants";

/**
 * Score a measured ROM value against its normal range, returning a
 * traffic-light classification.
 *
 * Method: compare measured ROM to the MIDPOINT of the normal range
 * (rather than just the minimum), because "just barely within normal"
 * still represents a meaningful restriction worth flagging as yellow
 * rather than green. This is intentionally a bit more conservative than
 * a simple "in range / out of range" binary.
 *
 *   >= 85% of midpoint  -> green  (normal / minimal restriction)
 *   60-85% of midpoint  -> yellow (mild-moderate restriction)
 *   < 60% of midpoint   -> red    (marked restriction)
 *
 * Also handles the (clinically meaningful) case of HYPERmobility —
 * ROM well above the normal max is flagged yellow, not green, since
 * excessive ROM can itself be a finding worth noting.
 */
export function scoreTrafficLight(measuredDeg: number, normalRangeDeg: [number, number]): TrafficLight {
  const [min, max] = normalRangeDeg;
  const midpoint = (min + max) / 2;

  if (midpoint <= 0) {
    // No valid reference range configured — fail safe to yellow so it
    // gets a human look rather than silently reporting green or red.
    return "yellow";
  }

  const pctOfMidpoint = measuredDeg / midpoint;

  // Hypermobility check: more than ~140% of the normal max is flagged,
  // not celebrated as "extra green."
  const hypermobilityCeiling = (max / midpoint) * 1.4;
  if (pctOfMidpoint >= hypermobilityCeiling) {
    return "yellow";
  }

  if (pctOfMidpoint >= TRAFFIC_LIGHT_THRESHOLDS.green) return "green";
  if (pctOfMidpoint >= TRAFFIC_LIGHT_THRESHOLDS.yellow) return "yellow";
  return "red";
}

/** Hex colours matching the Banora Chiropractic brand system where possible,
 *  with standard traffic-light semantics taking priority for clarity. */
export const TRAFFIC_LIGHT_COLOURS: Record<TrafficLight, { bg: string; text: string; label: string }> = {
  green: { bg: "#1E8449", text: "#FFFFFF", label: "Normal" },
  yellow: { bg: "#D4A017", text: "#1B3A5C", label: "Reduced" }, // reuses brand Dark Gold
  red: { bg: "#C0392B", text: "#FFFFFF", label: "Restricted" },
};

/**
 * Convenience: percentage of normal (midpoint-based) for display purposes,
 * e.g. "72% of expected range" under the traffic-light badge.
 */
export function percentOfNormal(measuredDeg: number, normalRangeDeg: [number, number]): number {
  const [min, max] = normalRangeDeg;
  const midpoint = (min + max) / 2;
  if (midpoint <= 0) return 0;
  return Math.round((measuredDeg / midpoint) * 100);
}
