import { describe, expect, it, vi } from 'vitest';
import { evaluateFraming, checkFraming } from '@/lib/pose-detection/framing-check';
import type { Landmark, LandmarkID } from '@/lib/models/landmark';

vi.mock('@/lib/pose-detection/detect-pose', () => ({
  detectPoseFromBlob: vi.fn(),
}));

function lm(id: LandmarkID, confidence: number): Landmark {
  return { id, position: { x: 0.5, y: 0.5 }, confidence };
}

describe('evaluateFraming — lateral view', () => {
  it('passes when head and feet are both confidently detected', () => {
    const result = evaluateFraming(
      [lm('tragus', 0.9), lm('lateralMalleolus', 0.85)],
      'lateral'
    );
    expect(result.ok).toBe(true);
    expect(result.missing).toEqual([]);
  });

  it('flags a missing head when tragus was never detected', () => {
    const result = evaluateFraming([lm('lateralMalleolus', 0.85)], 'lateral');
    expect(result.ok).toBe(false);
    expect(result.missing).toContain('head');
    expect(result.missing).not.toContain('feet');
  });

  it('flags missing feet when lateralMalleolus was never detected', () => {
    const result = evaluateFraming([lm('tragus', 0.9)], 'lateral');
    expect(result.ok).toBe(false);
    expect(result.missing).toContain('feet');
    expect(result.missing).not.toContain('head');
  });

  it('treats a landmark below the confidence threshold as not seen', () => {
    const result = evaluateFraming(
      [lm('tragus', 0.15), lm('lateralMalleolus', 0.9)],
      'lateral',
      0.4
    );
    expect(result.ok).toBe(false);
    expect(result.missing).toContain('head');
  });

  it('fails closed with both missing when no pose was detected at all', () => {
    const result = evaluateFraming([], 'lateral');
    expect(result.ok).toBe(false);
    expect(result.missing.length).toBeGreaterThan(0);
  });
});

describe('checkFraming — timeout', () => {
  it('fails open instead of hanging when pose detection never resolves', async () => {
    const { detectPoseFromBlob } = await import('@/lib/pose-detection/detect-pose');
    vi.mocked(detectPoseFromBlob).mockReturnValue(new Promise(() => {}));

    const result = await checkFraming(new Blob(), 'lateral', 0.4, 50);
    expect(result).toEqual({ ok: true, missing: [] });
  });
});

describe('evaluateFraming — AP view', () => {
  it('passes when at least one eye and one ankle are confidently detected', () => {
    const result = evaluateFraming(
      [lm('eyeOuterL', 0.8), lm('ankleCentreR', 0.7)],
      'ap'
    );
    expect(result.ok).toBe(true);
  });

  it('flags missing head when neither eye landmark is confidently visible', () => {
    const result = evaluateFraming(
      [lm('ankleCentreL', 0.8), lm('ankleCentreR', 0.8)],
      'ap'
    );
    expect(result.ok).toBe(false);
    expect(result.missing).toContain('head');
  });

  it('flags missing feet when neither ankle landmark is confidently visible', () => {
    const result = evaluateFraming(
      [lm('eyeOuterL', 0.8), lm('eyeOuterR', 0.8)],
      'ap'
    );
    expect(result.ok).toBe(false);
    expect(result.missing).toContain('feet');
  });
});
