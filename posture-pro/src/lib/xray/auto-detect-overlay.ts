// ═══════════════════════════════════════════════════════════════
// SpineView — Auto-Detect Canvas Overlay Helpers
//
// Additional overlay rendering for draft vs confirmed landmarks.
// Extends overlay-renderer.ts with auto-detect visual states.
// ═══════════════════════════════════════════════════════════════

import type { Point, LandmarkMap } from './types';
import type { LandmarkStatusMap } from './auto-detect';
import { toCanvasCoords } from './geometry';

/** Colours for landmark status on canvas */
export const LANDMARK_STATUS_COLOURS = {
  draft: {
    fill: '#F39C12',        // Orange fill
    stroke: '#E67E22',      // Darker orange stroke
    ring: '#F39C1240',      // Pulsing ring (semi-transparent)
  },
  confirmed: {
    fill: '#2ECC71',        // Green fill
    stroke: '#27AE60',      // Darker green stroke
    ring: 'transparent',
  },
  manual: {
    fill: '#FFD232',        // Gold fill (same as default)
    stroke: '#1B3A5C',      // Navy stroke
    ring: 'transparent',
  },
} as const;

/**
 * Draw landmarks with status-aware colours.
 * Replaces the default drawLandmarkDots when auto-detect is active.
 *
 * - Draft: orange with animated pulse ring
 * - Confirmed: green (solid)
 * - Manual: gold (same as default)
 * - Selected: larger with highlight ring
 */
export function drawStatusLandmarks(
  ctx: CanvasRenderingContext2D,
  landmarks: LandmarkMap,
  statuses: LandmarkStatusMap,
  selectedId: string | null,
  imageWidth: number,
  imageHeight: number,
  canvasWidth: number,
  canvasHeight: number,
  animationPhase: number = 0, // 0–1 for pulse animation
): void {
  ctx.save();

  for (const [id, pt] of Object.entries(landmarks)) {
    if (!pt) continue;

    const cp = toCanvasCoords(pt, imageWidth, imageHeight, canvasWidth, canvasHeight);
    const status = statuses[id] ?? 'manual';
    const colours = LANDMARK_STATUS_COLOURS[status];
    const isSelected = id === selectedId;
    const radius = isSelected ? 8 : 5;

    // Pulse ring for draft landmarks
    if (status === 'draft') {
      const pulseRadius = radius + 4 + Math.sin(animationPhase * Math.PI * 2) * 3;
      const pulseAlpha = 0.3 + Math.sin(animationPhase * Math.PI * 2) * 0.15;
      ctx.beginPath();
      ctx.arc(cp.x, cp.y, pulseRadius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(243, 156, 18, ${pulseAlpha})`;
      ctx.fill();
    }

    // Selection highlight ring
    if (isSelected) {
      ctx.beginPath();
      ctx.arc(cp.x, cp.y, radius + 4, 0, Math.PI * 2);
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Main dot
    ctx.beginPath();
    ctx.arc(cp.x, cp.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = colours.fill;
    ctx.fill();
    ctx.strokeStyle = colours.stroke;
    ctx.lineWidth = isSelected ? 2.5 : 1.5;
    ctx.stroke();

    // Label for selected landmark
    if (isSelected) {
      const shortId = id.replace(/_/g, ' ').replace(/sup |inf /, '');
      ctx.font = 'bold 11px sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'left';

      // Background for label
      const labelWidth = ctx.measureText(shortId).width + 8;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(cp.x + 12, cp.y - 8, labelWidth, 16);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(shortId, cp.x + 16, cp.y + 4);
    }
  }

  ctx.restore();
}

/**
 * Find which landmark (if any) is near a given canvas point.
 * Used for click-to-select and drag-to-adjust.
 *
 * @param canvasPoint - Click/touch position in canvas coordinates
 * @param landmarks - All landmark positions (image coordinates)
 * @param statuses - Status map (used to prioritise draft landmarks)
 * @param hitRadius - Distance threshold in canvas pixels
 * @returns Landmark ID if found, null otherwise
 */
export function findLandmarkAtPoint(
  canvasPoint: Point,
  landmarks: LandmarkMap,
  statuses: LandmarkStatusMap,
  imageWidth: number,
  imageHeight: number,
  canvasWidth: number,
  canvasHeight: number,
  hitRadius: number = 15,
): string | null {
  let closestId: string | null = null;
  let closestDist = Infinity;

  for (const [id, pt] of Object.entries(landmarks)) {
    if (!pt) continue;

    const cp = toCanvasCoords(pt, imageWidth, imageHeight, canvasWidth, canvasHeight);
    const dx = cp.x - canvasPoint.x;
    const dy = cp.y - canvasPoint.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < hitRadius && dist < closestDist) {
      closestDist = dist;
      closestId = id;
    }
  }

  return closestId;
}
