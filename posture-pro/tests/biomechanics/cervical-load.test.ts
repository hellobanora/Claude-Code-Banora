import { describe, expect, it } from 'vitest';
import {
  effectiveCervicalLoad,
  plainLanguageEquivalent,
} from '@/lib/biomechanics/cervical-load';

describe('effectiveCervicalLoad', () => {
  it('returns neutral head weight at 0°', () => {
    expect(effectiveCervicalLoad(0)).toBeCloseTo(5.0, 2);
  });

  it('matches Hansraj published anchor points', () => {
    expect(effectiveCervicalLoad(15)).toBeCloseTo(12, 2);
    expect(effectiveCervicalLoad(30)).toBeCloseTo(18, 2);
    expect(effectiveCervicalLoad(45)).toBeCloseTo(22, 2);
    expect(effectiveCervicalLoad(60)).toBeCloseTo(27, 2);
  });

  it('is monotonically non-decreasing across the working range', () => {
    let prev = -Infinity;
    for (let deg = 0; deg <= 60; deg += 2) {
      const load = effectiveCervicalLoad(deg);
      expect(load).toBeGreaterThanOrEqual(prev - 0.001);
      prev = load;
    }
  });

  it('returns neutral weight for extension (negative angles)', () => {
    expect(effectiveCervicalLoad(-10)).toBeCloseTo(5.0, 2);
  });

  it('clamps extreme inputs to sensible ceilings', () => {
    const huge = effectiveCervicalLoad(200);
    expect(huge).toBeGreaterThan(27);
    expect(huge).toBeLessThan(60); // sanity ceiling
  });

  it('scales with patient-specific head weight', () => {
    expect(effectiveCervicalLoad(0, { neutralHeadWeightKg: 4 })).toBeCloseTo(4, 2);
    expect(effectiveCervicalLoad(0, { neutralHeadWeightKg: 6 })).toBeCloseTo(6, 2);
  });
});

describe('plainLanguageEquivalent', () => {
  it('maps numeric loads to human-friendly phrases', () => {
    expect(plainLanguageEquivalent(4)).toContain('bowling ball');
    expect(plainLanguageEquivalent(18)).toContain('four-year-old');
    expect(plainLanguageEquivalent(27)).toContain('primary-school');
  });
});
