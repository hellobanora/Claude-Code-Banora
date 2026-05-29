'use client';

// ═══════════════════════════════════════════════════════════════
// SpineView — XrayCanvas Component
//
// The primary interaction surface. Renders the X-ray image on
// an HTML Canvas, handles landmark placement (click/tap),
// landmark dragging, zoom/pan, and overlay rendering.
//
// TODO: Claude Code — implement in Phase 1, Session 3.
// ═══════════════════════════════════════════════════════════════

import React, { useRef, useEffect, useCallback, useState } from 'react';
import type { Point, LandmarkMap, MeasurementResult, OverlayConfig, ViewType } from '@/lib/xray/types';
import { DEFAULT_OVERLAY_CONFIG } from '@/lib/xray/constants';
import { renderOverlays } from '@/lib/xray/overlay-renderer';
import { toImageCoords } from '@/lib/xray/geometry';
import { getCervicalPosteriorPoints, getCervicalVertebralBodies } from '@/lib/xray/cervical-lateral';
import { CERVICAL_POSTERIOR_SEQUENCE } from '@/lib/xray/constants';

interface XrayCanvasProps {
  /** Base64 data URL of the X-ray image */
  imageDataUrl: string;
  /** Original image dimensions */
  imageDimensions: { w: number; h: number };
  /** Currently placed landmarks */
  landmarks: LandmarkMap;
  /** Callback when a landmark is placed or moved */
  onLandmarkPlace: (id: string, point: Point) => void;
  /** The current landmark ID to place (from the guide sequence) */
  currentLandmarkId: string | null;
  /** Computed measurements (for overlay rendering) */
  measurements: MeasurementResult | null;
  /** Which view type */
  viewType: ViewType;
  /** Overlay visibility config */
  overlayConfig?: OverlayConfig;
}

/**
 * XrayCanvas — renders X-ray image with interactive landmark placement
 * and measurement overlay rendering.
 *
 * Implementation guide for Claude Code:
 *
 * 1. CANVAS SETUP
 *    - Create a <canvas> element that fills its container
 *    - Load the X-ray image from imageDataUrl into an Image object
 *    - Draw the image scaled to fit the canvas (maintain aspect ratio)
 *    - Store the scale factor for coordinate conversion
 *
 * 2. LANDMARK PLACEMENT
 *    - On click/tap, convert canvas coordinates to image coordinates
 *      using toImageCoords()
 *    - Call onLandmarkPlace(currentLandmarkId, imageCoords)
 *    - Show a gold dot at the click location immediately
 *
 * 3. LANDMARK DRAGGING
 *    - On mousedown/touchstart, check if click is near an existing landmark
 *      (within OVERLAY_SIZES.landmarkRadius * 2)
 *    - If so, enter drag mode: update landmark position on mousemove/touchmove
 *    - On mouseup/touchend, finalise the position
 *
 * 4. ZOOM & PAN
 *    - Track zoom level (1.0 = fit to canvas, max 4.0)
 *    - Pinch gesture or +/- buttons to zoom
 *    - When zoomed, track pan offset (drag with two fingers or middle mouse)
 *    - Apply transform before drawing: ctx.translate(panX, panY); ctx.scale(zoom, zoom)
 *
 * 5. OVERLAY RENDERING
 *    - After drawing the image, call renderOverlays() from overlay-renderer.ts
 *    - Pass the current landmarks, measurements, and overlay config
 *    - Redraw on every landmark change or config toggle
 *
 * 6. SNAPSHOT
 *    - Expose a getAnnotatedImage() method via ref/callback
 *    - Returns canvas.toDataURL('image/png') for PDF generation
 */
export default function XrayCanvas({
  imageDataUrl,
  imageDimensions,
  landmarks,
  onLandmarkPlace,
  currentLandmarkId,
  measurements,
  viewType,
  overlayConfig = DEFAULT_OVERLAY_CONFIG,
}: XrayCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1.0);

  // TODO: Claude Code — implement canvas rendering loop
  // TODO: Claude Code — implement click handler for landmark placement
  // TODO: Claude Code — implement drag handler for landmark repositioning
  // TODO: Claude Code — implement zoom/pan controls

  return (
    <div className="relative w-full h-full bg-gray-900 rounded-lg overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair"
        // onClick, onMouseDown, onMouseMove, onMouseUp, onTouchStart, etc.
      />

      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <button
          onClick={() => setZoom((z) => Math.min(4, z + 0.25))}
          className="w-10 h-10 bg-[#1B3A5C] text-white rounded-lg flex items-center justify-center hover:bg-[#2C5F8A] transition-colors"
          title="Zoom in"
        >
          +
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
          className="w-10 h-10 bg-[#1B3A5C] text-white rounded-lg flex items-center justify-center hover:bg-[#2C5F8A] transition-colors"
          title="Zoom out"
        >
          −
        </button>
        <button
          onClick={() => setZoom(1.0)}
          className="w-10 h-10 bg-[#1B3A5C] text-white rounded-lg flex items-center justify-center hover:bg-[#2C5F8A] transition-colors text-xs"
          title="Reset zoom"
        >
          Fit
        </button>
      </div>

      {/* Current landmark indicator */}
      {currentLandmarkId && (
        <div className="absolute top-4 left-4 bg-[#1B3A5C]/90 text-white px-3 py-2 rounded-lg text-sm">
          Click to place: <span className="text-[#FFD232] font-semibold">{currentLandmarkId}</span>
        </div>
      )}
    </div>
  );
}
