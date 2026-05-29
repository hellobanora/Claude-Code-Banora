import { describe, expect, it } from 'vitest';
import { buildNarrative } from '@/lib/biomechanics/narrative';
import { emptyAnalysis } from '@/lib/models/analysis';

describe('buildNarrative', () => {
  it('produces no bullets when no analysis values are present', () => {
    const n = buildNarrative(emptyAnalysis());
    expect(n.anteriorBullets).toEqual([]);
    expect(n.lateralBullets).toEqual([]);
    expect(n.headWeightHeadline).toBeUndefined();
  });

  it('renders a forward head sentence in the PostureScreen voice', () => {
    const a = emptyAnalysis();
    a.forwardHeadAngleDeg = 12.2;
    a.cervicalLoadKg = 16.4;

    const n = buildNarrative(a, { neutralHeadWeightKg: 5.7 });

    expect(n.lateralBullets[0]).toMatch(/Head weighs approximately 5.7 kg/);
    expect(n.lateralBullets[0]).toMatch(/12\.2°/);
    expect(n.lateralBullets[1]).toMatch(/effectively weighs 16\.4 kg/);
    expect(n.lateralBullets[1]).toMatch(/instead of 5\.7 kg/);
  });

  it('uses descriptive direction words for tilts and shifts', () => {
    const a = emptyAnalysis();
    a.headTiltDeg = 2.6;        // right
    a.shoulderUnlevelingMm = 14.5; // right higher
    a.pelvicUnlevelingMm = -11.3;  // left higher

    const n = buildNarrative(a);

    expect(n.anteriorBullets.join(' ')).toMatch(/tilted .* right/);
    expect(n.anteriorBullets.join(' ')).toMatch(/right side higher/);
    expect(n.anteriorBullets.join(' ')).toMatch(/left side higher/);
  });

  it('avoids therapeutic-claim language (AHPRA s133 list)', () => {
    const a = emptyAnalysis();
    a.forwardHeadAngleDeg = 15;
    a.cervicalLoadKg = 12;
    a.headTiltDeg = 3;
    a.shoulderUnlevelingMm = 8;

    const n = buildNarrative(a);
    const allText = [...n.anteriorBullets, ...n.lateralBullets].join(' ').toLowerCase();

    for (const banned of ['cure', 'fix', 'guarantee', 'best ', 'expert']) {
      expect(allText, `narrative should not contain "${banned}"`).not.toContain(banned);
    }
  });
});
