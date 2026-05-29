import { describe, expect, it } from 'vitest';
import { analyseLateral } from '@/lib/biomechanics/lateral-analyser';
import type { Landmark, LandmarkID } from '@/lib/models/landmark';

function lm(id: LandmarkID, x: number, y: number): Landmark {
  return { id, position: { x, y }, confidence: 1 };
}

function neutralLateral(tragusOffset = 0): Landmark[] {
  return [
    lm('tragus', 0.5 + tragusOffset, 0.1),
    lm('acromionLat', 0.5, 0.3),
    lm('greaterTrochanter', 0.5, 0.55),
    lm('lateralKnee', 0.5, 0.78),
    lm('lateralMalleolus', 0.5, 0.95),
  ];
}

describe('analyseLateral', () => {
  it('returns ~0° forward head angle when tragus sits directly above acromion', () => {
    const r = analyseLateral(neutralLateral(), 175);
    expect(r.forwardHeadAngleDeg).toBeDefined();
    expect(Math.abs(r.forwardHeadAngleDeg ?? 99)).toBeLessThan(0.5);
  });

  it('reports increasing forward head angle as the tragus moves forward', () => {
    const a = analyseLateral(neutralLateral(0), 175).forwardHeadAngleDeg ?? 0;
    const b = analyseLateral(neutralLateral(0.03), 175).forwardHeadAngleDeg ?? 0;
    const c = analyseLateral(neutralLateral(0.08), 175).forwardHeadAngleDeg ?? 0;
    expect(b).toBeGreaterThan(a);
    expect(c).toBeGreaterThan(b);
    expect(c).toBeGreaterThan(10); // marked offset registers as significant
  });

  it('produces a cervical load consistent with the forward head angle', () => {
    const r = analyseLateral(neutralLateral(0.05), 175);
    expect(r.cervicalLoadKg).toBeDefined();
    expect(r.cervicalLoadKg ?? 0).toBeGreaterThan(5);
  });

  it('detects anterior pelvic tilt when ASIS sits below PSIS', () => {
    const ls: Landmark[] = [
      lm('asisLat', 0.55, 0.6),
      lm('psisLat', 0.45, 0.58),
    ];
    const r = analyseLateral(ls, 175);
    expect(r.pelvicTiltDeg).toBeDefined();
    expect(r.pelvicTiltDeg ?? 0).toBeGreaterThan(0);
  });

  it('returns undefined fields when required landmarks are missing', () => {
    const r = analyseLateral([], 175);
    expect(r.forwardHeadAngleDeg).toBeUndefined();
    expect(r.shoulderProtractionDeg).toBeUndefined();
    expect(r.pelvicTiltDeg).toBeUndefined();
    expect(r.plumbDeviations).toEqual([]);
  });
});
