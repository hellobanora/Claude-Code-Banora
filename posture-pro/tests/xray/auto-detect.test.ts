// ═══════════════════════════════════════════════════════════════
// SpineView — Auto-Detect Tests
// ═══════════════════════════════════════════════════════════════

import { describe, it, expect } from 'vitest';
import type { LandmarkMap } from '@/lib/xray/types';
import {
  confirmLandmark,
  confirmAllLandmarks,
  adjustLandmark,
  allLandmarksConfirmed,
  countByStatus,
  type LandmarkStatusMap,
} from '@/lib/xray/auto-detect';

describe('confirmLandmark', () => {
  it('changes a single draft to confirmed', () => {
    const statuses: LandmarkStatusMap = {
      C1_post: 'draft',
      C2_sup_post: 'draft',
      C2_inf_post: 'confirmed',
    };
    const result = confirmLandmark(statuses, 'C1_post');
    expect(result.C1_post).toBe('confirmed');
    expect(result.C2_sup_post).toBe('draft'); // unchanged
    expect(result.C2_inf_post).toBe('confirmed'); // unchanged
  });

  it('does not mutate the original', () => {
    const statuses: LandmarkStatusMap = { C1_post: 'draft' };
    const result = confirmLandmark(statuses, 'C1_post');
    expect(statuses.C1_post).toBe('draft');
    expect(result.C1_post).toBe('confirmed');
  });
});

describe('confirmAllLandmarks', () => {
  it('confirms all draft landmarks', () => {
    const statuses: LandmarkStatusMap = {
      C1_post: 'draft',
      C2_sup_post: 'draft',
      C2_inf_post: 'confirmed',
      C3_sup_post: 'manual',
    };
    const result = confirmAllLandmarks(statuses);
    expect(result.C1_post).toBe('confirmed');
    expect(result.C2_sup_post).toBe('confirmed');
    expect(result.C2_inf_post).toBe('confirmed');
    expect(result.C3_sup_post).toBe('manual'); // manual stays manual
  });
});

describe('adjustLandmark', () => {
  it('updates position and marks as confirmed', () => {
    const landmarks: LandmarkMap = {
      C1_post: { x: 100, y: 200 },
    };
    const statuses: LandmarkStatusMap = {
      C1_post: 'draft',
    };
    const newPos = { x: 110, y: 195 };
    const result = adjustLandmark(landmarks, statuses, 'C1_post', newPos);

    expect(result.landmarks.C1_post).toEqual(newPos);
    expect(result.statuses.C1_post).toBe('confirmed');
  });
});

describe('allLandmarksConfirmed', () => {
  it('returns true when all expected landmarks are confirmed', () => {
    // Create a minimal status map covering all cervical landmarks
    const statuses: LandmarkStatusMap = {};
    const ids = [
      'C1_post', 'C2_sup_post', 'C2_inf_post',
      'C3_sup_post', 'C3_inf_post', 'C4_sup_post', 'C4_inf_post',
      'C5_sup_post', 'C5_inf_post', 'C6_sup_post', 'C6_inf_post',
      'C7_sup_post', 'C7_inf_post', 'T1_sup_post',
      'C2_sup_ant', 'C2_inf_ant', 'C7_inf_ant',
    ];
    for (const id of ids) {
      statuses[id] = 'confirmed';
    }
    expect(allLandmarksConfirmed(statuses, 'cervical_lateral')).toBe(true);
  });

  it('returns false when drafts remain', () => {
    const statuses: LandmarkStatusMap = {
      C1_post: 'confirmed',
      C2_sup_post: 'draft', // Still draft
    };
    expect(allLandmarksConfirmed(statuses, 'cervical_lateral')).toBe(false);
  });
});

describe('countByStatus', () => {
  it('counts correctly', () => {
    const statuses: LandmarkStatusMap = {
      a: 'draft',
      b: 'draft',
      c: 'confirmed',
      d: 'manual',
    };
    const counts = countByStatus(statuses);
    expect(counts.draft).toBe(2);
    expect(counts.confirmed).toBe(1);
    expect(counts.manual).toBe(1);
    expect(counts.total).toBe(4);
  });

  it('returns zeros for empty map', () => {
    const counts = countByStatus({});
    expect(counts.total).toBe(0);
  });
});
