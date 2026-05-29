// ═══════════════════════════════════════════════════════════════
// SpineView — Canvas Overlay Renderer
// Draws measurement lines, curves, labels on top of X-ray image.
// ═══════════════════════════════════════════════════════════════

import type { Point, LandmarkMap, OverlayConfig, MeasurementResult, SegmentAngle } from './types';
import {
  OVERLAY_COLOURS,
  OVERLAY_SIZES,
  SEVERITY_COLOURS,
  CERVICAL_IDEAL_ARA,
} from './constants';
import {
  toCanvasCoords,
  smoothCurveControlPoints,
  perpendicularDirection,
} from './geometry';

interface RenderContext {
  ctx: CanvasRenderingContext2D;
  imageWidth: number;
  imageHeight: number;
  canvasWidth: number;
  canvasHeight: number;
}

/**
 * Convert a landmark point to canvas coordinates.
 */
function tc(rc: RenderContext, pt: Point): Point {
  return toCanvasCoords(pt, rc.imageWidth, rc.imageHeight, rc.canvasWidth, rc.canvasHeight);
}

/**
 * Try to get a landmark and convert to canvas coords.
 */
function getC(rc: RenderContext, landmarks: LandmarkMap, id: string): Point | null {
  const pt = landmarks[id];
  if (!pt) return null;
  return tc(rc, pt);
}

// ─── Main Render Function ────────────────────────────────────

/**
 * Render all overlay layers onto the canvas.
 *
 * Call this after drawing the X-ray image.
 * The canvas should already have the image rendered at (0,0).
 *
 * @param ctx - Canvas 2D rendering context
 * @param landmarks - All placed landmarks (image coordinates)
 * @param measurements - Computed measurement results
 * @param config - Which overlays to show
 * @param posteriorPointIds - Ordered IDs for George's Line / Arc of Life
 * @param vertebralBodies - Array of {level, sup, inf, index} for endplate lines
 * @param imageDims - Original image dimensions
 * @param canvasDims - Canvas element dimensions
 */
export function renderOverlays(
  ctx: CanvasRenderingContext2D,
  landmarks: LandmarkMap,
  measurements: MeasurementResult,
  config: OverlayConfig,
  posteriorPointIds: string[],
  vertebralBodies: Array<{ level: string; sup: Point; inf: Point; index: number }>,
  imageDims: { w: number; h: number },
  canvasDims: { w: number; h: number },
): void {
  const rc: RenderContext = {
    ctx,
    imageWidth: imageDims.w,
    imageHeight: imageDims.h,
    canvasWidth: canvasDims.w,
    canvasHeight: canvasDims.h,
  };

  // Layer 1: Endplate reference lines
  if (config.showEndplateLines) {
    drawEndplateLines(rc, vertebralBodies);
  }

  // Layer 2: George's Line
  if (config.showGeorgesLine) {
    const posteriorPoints = posteriorPointIds
      .map((id) => landmarks[id])
      .filter((pt): pt is Point => pt != null);
    drawGeorgesLine(rc, posteriorPoints);
  }

  // Layer 3: Arc of Life
  if (config.showArcOfLife) {
    const posteriorPoints = posteriorPointIds
      .map((id) => landmarks[id])
      .filter((pt): pt is Point => pt != null);
    drawArcOfLife(rc, posteriorPoints);
  }

  // Layer 4: Level numbers
  if (config.showLevelNumbers) {
    drawLevelNumbers(rc, vertebralBodies);
  }

  // Layer 5: Angle values
  if (config.showAngleValues) {
    drawAngleValues(rc, vertebralBodies, measurements.segments);
  }

  // Layer 6: Landmark dots
  if (config.showLandmarkDots) {
    drawLandmarkDots(rc, landmarks);
  }

  // Layer 7: ARA overlay text
  if (config.showARAOverlay && measurements.ara) {
    drawARAOverlay(rc, measurements.ara);
  }
}

// ─── Layer Drawing Functions ─────────────────────────────────

function drawEndplateLines(
  rc: RenderContext,
  bodies: Array<{ level: string; sup: Point; inf: Point; index: number }>,
): void {
  const { ctx } = rc;

  ctx.save();
  ctx.setLineDash(OVERLAY_SIZES.endplateDash);
  ctx.strokeStyle = OVERLAY_COLOURS.endplateLines;
  ctx.lineWidth = OVERLAY_SIZES.endplateLineWidth;

  for (const body of bodies) {
    const sup = tc(rc, body.sup);
    const inf = tc(rc, body.inf);

    // Calculate perpendicular direction to extend the endplate line
    const perp = perpendicularDirection(sup, inf);
    const ext = OVERLAY_SIZES.endplateExtension;

    // Draw superior endplate line (extended)
    ctx.beginPath();
    ctx.moveTo(sup.x - perp.x * ext, sup.y - perp.y * ext);
    ctx.lineTo(sup.x + perp.x * ext, sup.y + perp.y * ext);
    ctx.stroke();
  }

  ctx.restore();
}

function drawGeorgesLine(rc: RenderContext, points: Point[]): void {
  if (points.length < 2) return;

  const { ctx } = rc;
  const canvasPoints = points.map((pt) => tc(rc, pt));

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(canvasPoints[0].x, canvasPoints[0].y);
  for (let i = 1; i < canvasPoints.length; i++) {
    ctx.lineTo(canvasPoints[i].x, canvasPoints[i].y);
  }
  ctx.strokeStyle = OVERLAY_COLOURS.georgesLine;
  ctx.lineWidth = OVERLAY_SIZES.georgesLineWidth;
  ctx.stroke();
  ctx.restore();
}

function drawArcOfLife(rc: RenderContext, points: Point[]): void {
  if (points.length < 3) return;

  const { ctx } = rc;
  const canvasPoints = points.map((pt) => tc(rc, pt));
  const curves = smoothCurveControlPoints(canvasPoints);

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(canvasPoints[0].x, canvasPoints[0].y);

  for (const curve of curves) {
    ctx.quadraticCurveTo(curve.control.x, curve.control.y, curve.end.x, curve.end.y);
  }

  ctx.strokeStyle = OVERLAY_COLOURS.arcOfLife;
  ctx.lineWidth = OVERLAY_SIZES.arcOfLifeWidth;
  ctx.stroke();
  ctx.restore();
}

function drawLevelNumbers(
  rc: RenderContext,
  bodies: Array<{ level: string; sup: Point; inf: Point; index: number }>,
): void {
  const { ctx } = rc;

  ctx.save();
  ctx.font = OVERLAY_SIZES.levelNumberFont;
  ctx.fillStyle = OVERLAY_COLOURS.levelNumbers;

  for (const body of bodies) {
    const sup = tc(rc, body.sup);
    const inf = tc(rc, body.inf);
    const midX = (sup.x + inf.x) / 2 + 25;
    const midY = (sup.y + inf.y) / 2;
    ctx.fillText(`${body.index}`, midX, midY + 5);
  }

  ctx.restore();
}

function drawAngleValues(
  rc: RenderContext,
  bodies: Array<{ level: string; sup: Point; inf: Point; index: number }>,
  segments: SegmentAngle[],
): void {
  const { ctx } = rc;

  ctx.save();
  ctx.font = OVERLAY_SIZES.measurementFont;

  for (const seg of segments) {
    if (seg.measured === null || seg.severity === null) continue;

    // Find the corresponding vertebral body to position the text
    const levelNum = parseInt(seg.segment.split('/')[0].replace('C', '').replace('L', ''));
    const body = bodies.find((b) => b.index === levelNum);
    if (!body) continue;

    const inf = tc(rc, body.inf);
    const colour = SEVERITY_COLOURS[seg.severity];
    ctx.fillStyle = colour;

    const text = `${seg.segment} ${seg.measured.toFixed(1)}° (${seg.ideal}°) ${seg.deviationPercent?.toFixed(0)}%`;
    ctx.fillText(text, inf.x - 200, inf.y + 15);
  }

  ctx.restore();
}

function drawLandmarkDots(rc: RenderContext, landmarks: LandmarkMap): void {
  const { ctx } = rc;

  ctx.save();
  for (const [, pt] of Object.entries(landmarks)) {
    if (!pt) continue;
    const cp = tc(rc, pt);
    ctx.beginPath();
    ctx.arc(cp.x, cp.y, OVERLAY_SIZES.landmarkRadius, 0, Math.PI * 2);
    ctx.fillStyle = OVERLAY_COLOURS.landmarkFill;
    ctx.fill();
    ctx.strokeStyle = OVERLAY_COLOURS.landmarkStroke;
    ctx.lineWidth = OVERLAY_SIZES.landmarkStrokeWidth;
    ctx.stroke();
  }
  ctx.restore();
}

function drawARAOverlay(
  rc: RenderContext,
  ara: NonNullable<MeasurementResult['ara']>,
): void {
  const { ctx } = rc;
  const colour = SEVERITY_COLOURS[ara.severity];

  ctx.save();

  // Background panel
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.fillRect(8, 8, 320, 55);

  // ARA value
  ctx.font = 'bold 16px sans-serif';
  ctx.fillStyle = OVERLAY_COLOURS.araText;
  ctx.fillText(`ARA: ${ara.measured.toFixed(1)}° (ideal: ${CERVICAL_IDEAL_ARA}°)`, 16, 28);

  // Loss percentage
  ctx.font = '13px sans-serif';
  ctx.fillStyle = colour;
  ctx.fillText(`${ara.lossPercent.toFixed(1)}% loss from normal`, 16, 50);

  ctx.restore();
}
