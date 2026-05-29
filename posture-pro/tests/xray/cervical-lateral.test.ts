// ═══════════════════════════════════════════════════════════════
// SpineView — Cervical Lateral Analyser Tests
// ═══════════════════════════════════════════════════════════════

import { describe, it, expect } from 'vitest';
import {
  analyseCervicalLateral,
  getCervicalPosteriorPoints,
  getCervicalVertebralBodies,
} from '@/lib/xray/cervical-lateral';
import type { LandmarkMap } from '@/lib/xray/types';

/**
 * Helper: create a set of landmarks simulating a healthy cervical spine.
 * Points are arranged to approximate a -42° ARA with normal segmental angles.
 * All coordinates are in a 1000×1200 image space.
 */
function createIdealLandmarks(): LandmarkMap {
  return {
    C1_post:     { x: 430, y: 80 },
    C2_sup_post: { x: 440, y: 130 },
    C2_inf_post: { x: 445, y: 180 },
    C3_sup_post: { x: 450, y: 230 },
    C3_inf_post: { x: 455, y: 280 },
    C4_sup_post: { x: 458, y: 330 },
    C4_inf_post: { x: 460, y: 380 },
    C5_sup_post: { x: 462, y: 430 },
    C5_inf_post: { x: 463, y: 480 },
    C6_sup_post: { x: 464, y: 530 },
    C6_inf_post: { x: 465, y: 580 },
    C7_sup_post: { x: 466, y: 630 },
    C7_inf_post: { x: 467, y: 680 },
    T1_sup_post: { x: 468, y: 730 },
    C2_sup_ant:  { x: 380, y: 130 },
    C2_inf_ant:  { x: 385, y: 180 },
    C7_inf_ant:  { x: 400, y: 680 },
  };
}

describe('analyseCervicalLateral', () => {
  it('returns all 7 segments', () => {
    const landmarks = createIdealLandmarks();
    const result = analyseCervicalLateral(landmarks);
    expect(result.segments).toHaveLength(7);
    expect(result.segments.map((s) => s.segment)).toEqual([
      'C1/C2', 'C2/C3', 'C3/C4', 'C4/C5', 'C5/C6', 'C6/C7', 'C7/T1',
    ]);
  });

  it('calculates ARA when C2 and C7 landmarks are present', () => {
    const landmarks = createIdealLandmarks();
    const result = analyseCervicalLateral(landmarks);
    expect(result.ara).toBeDefined();
    expect(result.ara!.measured).toBeTypeOf('number');
    expect(result.ara!.ideal).toBe(-42);
  });

  it('returns null measurements for missing landmarks', () => {
    // Only place first 3 landmarks
    const partial: LandmarkMap = {
      C1_post:     { x: 430, y: 80 },
      C2_sup_post: { x: 440, y: 130 },
      C2_inf_post: { x: 445, y: 180 },
    };
    const result = analyseCervicalLateral(partial);

    // C1/C2 should be calculated (needs C1_post, C2_sup, C2_inf)
    expect(result.segments[0].measured).toBeTypeOf('number');

    // C2/C3 should be null (missing C3 landmarks)
    expect(result.segments[1].measured).toBeNull();

    // ARA should be undefined (missing C7 landmarks)
    expect(result.ara).toBeUndefined();
  });

  it('calculates anterior head carriage when C2 and C7 are placed', () => {
    const landmarks = createIdealLandmarks();
    const result = analyseCervicalLateral(landmarks);
    expect(result.anteriorHeadCarriage).toBeDefined();
    expect(result.anteriorHeadCarriage!.pixels).toBeTypeOf('number');
  });

  it('handles empty landmarks gracefully', () => {
    const result = analyseCervicalLateral({});
    expect(result.viewType).toBe('cervical_lateral');
    expect(result.segments).toHaveLength(7);
    expect(result.segments.every((s) => s.measured === null)).toBe(true);
    expect(result.ara).toBeUndefined();
    expect(result.anteriorHeadCarriage).toBeUndefined();
  });
});

describe('getCervicalPosteriorPoints', () => {
  it('returns all posterior points in order', () => {
    const landmarks = createIdealLandmarks();
    const points = getCervicalPosteriorPoints(landmarks);
    expect(points).toHaveLength(14); // C1 through T1
    // Points should be in top-to-bottom order (increasing y)
    for (let i = 1; i < points.length; i++) {
      expect(points[i].y).toBeGreaterThan(points[i - 1].y);
    }
  });

  it('skips missing landmarks', () => {
    const partial: LandmarkMap = {
      C1_post:     { x: 430, y: 80 },
      C2_sup_post: { x: 440, y: 130 },
    };
    const points = getCervicalPosteriorPoints(partial);
    expect(points).toHaveLength(2);
  });
});

describe('getCervicalVertebralBodies', () => {
  it('returns body pairs for C2–C7', () => {
    const landmarks = createIdealLandmarks();
    const bodies = getCervicalVertebralBodies(landmarks);
    expect(bodies).toHaveLength(6); // C2, C3, C4, C5, C6, C7
    expect(bodies[0].level).toBe('C2');
    expect(bodies[0].index).toBe(2);
    expect(bodies[5].level).toBe('C7');
    expect(bodies[5].index).toBe(7);
  });

  it('only returns bodies with both sup and inf points placed', () => {
    const partial: LandmarkMap = {
      C2_sup_post: { x: 440, y: 130 },
      // Missing C2_inf_post
      C3_sup_post: { x: 450, y: 230 },
      C3_inf_post: { x: 455, y: 280 },
    };
    const bodies = getCervicalVertebralBodies(partial);
    expect(bodies).toHaveLength(1); // Only C3
    expect(bodies[0].level).toBe('C3');
  });
});
