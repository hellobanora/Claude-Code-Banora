// ═══════════════════════════════════════════════════════════════
// SpineView — Geometry Engine Tests
// ═══════════════════════════════════════════════════════════════

import { describe, it, expect } from 'vitest';
import {
  angleFromHorizontal,
  posteriorTangentAngle,
  cobbAngle,
  segmentalAngle,
  horizontalOffset,
  verticalOffset,
  distance,
  gradeSeverity,
  lossPercentage,
  smoothCurveControlPoints,
  toCanvasCoords,
  toImageCoords,
  generateId,
} from '@/lib/xray/geometry';

describe('angleFromHorizontal', () => {
  it('returns 0 for a horizontal line going right', () => {
    expect(angleFromHorizontal({ x: 0, y: 0 }, { x: 100, y: 0 })).toBeCloseTo(0);
  });

  it('returns 90 for a vertical line going down', () => {
    expect(angleFromHorizontal({ x: 0, y: 0 }, { x: 0, y: 100 })).toBeCloseTo(90);
  });

  it('returns -90 for a vertical line going up', () => {
    expect(angleFromHorizontal({ x: 0, y: 0 }, { x: 0, y: -100 })).toBeCloseTo(-90);
  });

  it('returns 45 for a 45-degree line', () => {
    expect(angleFromHorizontal({ x: 0, y: 0 }, { x: 100, y: 100 })).toBeCloseTo(45);
  });
});

describe('posteriorTangentAngle', () => {
  it('returns 0 for parallel lines', () => {
    const result = posteriorTangentAngle(
      { x: 10, y: 0 }, { x: 10, y: 50 },
      { x: 10, y: 100 }, { x: 10, y: 150 },
    );
    expect(result).toBeCloseTo(0);
  });

  it('returns negative for lordotic (converging posteriorly) lines', () => {
    // Upper body line tilts right, lower tilts left
    const result = posteriorTangentAngle(
      { x: 100, y: 0 }, { x: 95, y: 50 },   // Upper: slight left tilt
      { x: 100, y: 100 }, { x: 105, y: 150 }, // Lower: slight right tilt
    );
    expect(result).toBeLessThan(0); // Negative = lordotic curve
  });
});

describe('cobbAngle', () => {
  it('returns 0 for parallel endplates', () => {
    const result = cobbAngle(
      { x: 0, y: 0 }, { x: 100, y: 0 },
      { x: 0, y: 100 }, { x: 100, y: 100 },
    );
    expect(result).toBeCloseTo(0);
  });

  it('returns positive angle for converging endplates', () => {
    const result = cobbAngle(
      { x: 0, y: 0 }, { x: 100, y: 10 },    // Top: tilts down-right
      { x: 0, y: 100 }, { x: 100, y: 90 },   // Bottom: tilts up-right
    );
    expect(result).toBeGreaterThan(0);
  });
});

describe('horizontalOffset', () => {
  it('returns 0 for vertically aligned points', () => {
    expect(horizontalOffset({ x: 50, y: 0 }, { x: 50, y: 100 })).toBe(0);
  });

  it('returns absolute horizontal distance', () => {
    expect(horizontalOffset({ x: 30, y: 0 }, { x: 80, y: 0 })).toBe(50);
    expect(horizontalOffset({ x: 80, y: 0 }, { x: 30, y: 0 })).toBe(50);
  });
});

describe('verticalOffset', () => {
  it('identifies left-high when left point is higher on screen', () => {
    const result = verticalOffset({ x: 0, y: 50 }, { x: 100, y: 80 });
    expect(result.highSide).toBe('L'); // Lower y = higher on screen
    expect(result.pixels).toBe(30);
  });

  it('identifies right-high when right point is higher', () => {
    const result = verticalOffset({ x: 0, y: 80 }, { x: 100, y: 50 });
    expect(result.highSide).toBe('R');
    expect(result.pixels).toBe(30);
  });
});

describe('distance', () => {
  it('calculates Euclidean distance', () => {
    expect(distance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBeCloseTo(5);
  });

  it('returns 0 for same point', () => {
    expect(distance({ x: 50, y: 50 }, { x: 50, y: 50 })).toBe(0);
  });
});

describe('gradeSeverity', () => {
  it('grades normal within 25% of ideal', () => {
    expect(gradeSeverity(-38, -42)).toBe('normal'); // ~9.5% deviation
  });

  it('grades mild at 25-50% deviation', () => {
    expect(gradeSeverity(-25, -42)).toBe('mild'); // ~40% deviation
  });

  it('grades moderate at 50-75% deviation', () => {
    expect(gradeSeverity(-14, -42)).toBe('moderate'); // ~67% deviation
  });

  it('grades marked above 75% deviation', () => {
    expect(gradeSeverity(-5, -42)).toBe('marked'); // ~88% deviation
  });

  it('handles zero ideal using absolute thresholds', () => {
    expect(gradeSeverity(3, 0)).toBe('normal');
    expect(gradeSeverity(10, 0)).toBe('mild');
    expect(gradeSeverity(20, 0)).toBe('moderate');
    expect(gradeSeverity(30, 0)).toBe('marked');
  });
});

describe('lossPercentage', () => {
  it('returns 0 when measured equals ideal', () => {
    expect(lossPercentage(-42, -42)).toBeCloseTo(0);
  });

  it('returns 50 for 50% deviation', () => {
    expect(lossPercentage(-21, -42)).toBeCloseTo(50);
  });

  it('returns 100 for complete loss', () => {
    expect(lossPercentage(0, -42)).toBeCloseTo(100);
  });
});

describe('smoothCurveControlPoints', () => {
  it('returns empty for fewer than 2 points', () => {
    expect(smoothCurveControlPoints([{ x: 0, y: 0 }])).toHaveLength(0);
  });

  it('returns one entry for 2 points', () => {
    const result = smoothCurveControlPoints([
      { x: 0, y: 0 },
      { x: 100, y: 100 },
    ]);
    expect(result).toHaveLength(1);
    expect(result[0].end).toEqual({ x: 100, y: 100 });
  });

  it('returns n-1 entries for n points', () => {
    const points = [
      { x: 0, y: 0 },
      { x: 50, y: 30 },
      { x: 100, y: 80 },
      { x: 150, y: 100 },
    ];
    expect(smoothCurveControlPoints(points)).toHaveLength(3);
  });
});

describe('coordinate conversion', () => {
  it('toCanvasCoords scales correctly', () => {
    const result = toCanvasCoords({ x: 500, y: 250 }, 1000, 500, 800, 400);
    expect(result.x).toBeCloseTo(400);
    expect(result.y).toBeCloseTo(200);
  });

  it('toImageCoords is inverse of toCanvasCoords', () => {
    const original = { x: 350, y: 175 };
    const canvas = toCanvasCoords(original, 1000, 500, 800, 400);
    const back = toImageCoords(canvas, 1000, 500, 800, 400);
    expect(back.x).toBeCloseTo(original.x);
    expect(back.y).toBeCloseTo(original.y);
  });
});

describe('generateId', () => {
  it('generates UUID v4 format', () => {
    const id = generateId();
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });

  it('generates unique IDs', () => {
    const ids = new Set(Array.from({ length: 100 }, generateId));
    expect(ids.size).toBe(100);
  });
});
