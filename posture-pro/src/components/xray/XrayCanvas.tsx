'use client';

// ═══════════════════════════════════════════════════════════════
// SpineView — XrayCanvas Component
//
// The primary interaction surface. Renders the X-ray image on
// an HTML Canvas, handles landmark placement (click/tap),
// landmark dragging, zoom/pan, and overlay rendering.
// ═══════════════════════════════════════════════════════════════

import React, {
  useRef,
  useEffect,
  useCallback,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import type {
  Point,
  LandmarkMap,
  MeasurementResult,
  OverlayConfig,
  ViewType,
} from '@/lib/xray/types';
import type { LandmarkDefinition } from '@/lib/xray/types';
import {
  DEFAULT_OVERLAY_CONFIG,
  OVERLAY_SIZES,
  CERVICAL_POSTERIOR_SEQUENCE,
  LUMBAR_POSTERIOR_SEQUENCE,
  CERVICAL_LATERAL_LANDMARKS,
  LUMBAR_LATERAL_LANDMARKS,
  LUMBAR_AP_LANDMARKS,
} from '@/lib/xray/constants';
import { renderOverlays } from '@/lib/xray/overlay-renderer';
import { getCervicalVertebralBodies } from '@/lib/xray/cervical-lateral';
import { getLumbarVertebralBodies } from '@/lib/xray/lumbar-lateral';

// ─── Props & Handle ─────────────────────────────────────────

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

export interface XrayCanvasHandle {
  getSnapshot: () => string | null;
}

// ─── Draw info for coordinate transforms ────────────────────

interface DrawInfo {
  dx: number;
  dy: number;
  dw: number;
  dh: number;
}

// ─── Component ──────────────────────────────────────────────

const XrayCanvas = forwardRef<XrayCanvasHandle, XrayCanvasProps>(
  function XrayCanvas(
    {
      imageDataUrl,
      imageDimensions,
      landmarks,
      onLandmarkPlace,
      currentLandmarkId,
      measurements,
      viewType,
      overlayConfig = DEFAULT_OVERLAY_CONFIG,
    },
    ref,
  ) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);

    const [zoom, setZoom] = useState(1.0);
    const [pan, setPan] = useState<Point>({ x: 0, y: 0 });
    const [imageLoaded, setImageLoaded] = useState(false);
    const [flipped, setFlipped] = useState(false);

    // Interaction state (refs to avoid re-render on every mousemove)
    const isDraggingRef = useRef(false);
    const dragLandmarkIdRef = useRef<string | null>(null);
    const isPanningRef = useRef(false);
    const panStartRef = useRef<Point>({ x: 0, y: 0 });
    const didDragRef = useRef(false);
    const mouseDownPosRef = useRef<Point | null>(null);

    // Track drawn image area for coordinate conversion
    const drawInfoRef = useRef<DrawInfo>({ dx: 0, dy: 0, dw: 0, dh: 0 });

    // Keep latest props in refs for use in native event handlers
    const landmarksRef = useRef(landmarks);
    landmarksRef.current = landmarks;
    const imageDimsRef = useRef(imageDimensions);
    imageDimsRef.current = imageDimensions;
    const zoomRef = useRef(zoom);
    zoomRef.current = zoom;
    const panRef = useRef(pan);
    panRef.current = pan;
    const flippedRef = useRef(flipped);
    flippedRef.current = flipped;

    // ─── Load Image ─────────────────────────────────────────
    useEffect(() => {
      if (!imageDataUrl) return;
      setImageLoaded(false);
      const img = new Image();
      img.onload = () => {
        imageRef.current = img;
        setImageLoaded(true);
      };
      img.src = imageDataUrl;
    }, [imageDataUrl]);

    // ─── Coordinate Conversion Helpers ──────────────────────

    /** Convert client (screen) coordinates to image-space coordinates */
    const canvasToImage = useCallback(
      (clientX: number, clientY: number): Point | null => {
        const canvas = canvasRef.current;
        const dims = imageDimsRef.current;
        if (!canvas || dims.w === 0 || dims.h === 0) return null;

        const rect = canvas.getBoundingClientRect();
        const px = clientX - rect.left;
        const py = clientY - rect.top;

        const { dx, dy, dw, dh } = drawInfoRef.current;
        const z = zoomRef.current;
        const p = panRef.current;

        // Invert zoom/pan transform:
        // forward: screenPt = (inputPt - center) * zoom + center + pan
        // inverse: inputPt = (screenPt - pan - center) / zoom + center
        const cx = dx + dw / 2;
        const cy = dy + dh / 2;
        const imgAreaX = (px - p.x - cx) / z + cx;
        const imgAreaY = (py - p.y - cy) / z + cy;

        // Subtract draw offset → position relative to drawn image
        let relX = imgAreaX - dx;
        const relY = imgAreaY - dy;

        // If flipped, mirror the x coordinate within the drawn area
        if (flippedRef.current) {
          relX = dw - relX;
        }

        // Scale from drawn size to original image size
        const imgX = (relX / dw) * dims.w;
        const imgY = (relY / dh) * dims.h;

        // Bounds check
        if (imgX < 0 || imgX > dims.w || imgY < 0 || imgY > dims.h) {
          return null;
        }

        return { x: imgX, y: imgY };
      },
      [],
    );

    /** Convert image-space point to screen (canvas CSS) coordinates */
    const imageToScreen = useCallback(
      (pt: Point): Point => {
        const { dx, dy, dw, dh } = drawInfoRef.current;
        const dims = imageDimsRef.current;
        const z = zoomRef.current;
        const p = panRef.current;

        let relX = (pt.x / dims.w) * dw;
        const relY = (pt.y / dims.h) * dh;

        // If flipped, mirror the x coordinate within the drawn area
        if (flippedRef.current) {
          relX = dw - relX;
        }

        const imgAreaX = relX + dx;
        const imgAreaY = relY + dy;

        const cx = dx + dw / 2;
        const cy = dy + dh / 2;
        return {
          x: (imgAreaX - cx) * z + cx + p.x,
          y: (imgAreaY - cy) * z + cy + p.y,
        };
      },
      [],
    );

    /** Find the nearest placed landmark to a screen position, within hit radius */
    const findNearLandmark = useCallback(
      (clientX: number, clientY: number): string | null => {
        const canvas = canvasRef.current;
        if (!canvas) return null;

        const rect = canvas.getBoundingClientRect();
        const sx = clientX - rect.left;
        const sy = clientY - rect.top;
        const hitRadius = OVERLAY_SIZES.landmarkRadius * 3;

        for (const [id, pt] of Object.entries(landmarksRef.current)) {
          if (!pt) continue;
          const screenPt = imageToScreen(pt);
          const dist = Math.sqrt((sx - screenPt.x) ** 2 + (sy - screenPt.y) ** 2);
          if (dist < hitRadius) return id;
        }

        return null;
      },
      [imageToScreen],
    );

    // ─── Redraw Function ────────────────────────────────────
    const redraw = useCallback(() => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      const img = imageRef.current;
      if (!canvas || !container || !img || !imageLoaded) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Size canvas to container (account for device pixel ratio)
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      const cw = rect.width;
      const ch = rect.height;

      // Clear with dark background
      ctx.fillStyle = '#0F1A2E';
      ctx.fillRect(0, 0, cw, ch);

      // Calculate image draw area (fit to canvas, maintain aspect ratio)
      const imgAspect = img.naturalWidth / img.naturalHeight;
      const canvasAspect = cw / ch;
      let dw: number, dh: number, dx: number, dy: number;

      if (imgAspect > canvasAspect) {
        dw = cw;
        dh = cw / imgAspect;
        dx = 0;
        dy = (ch - dh) / 2;
      } else {
        dh = ch;
        dw = ch * imgAspect;
        dx = (cw - dw) / 2;
        dy = 0;
      }

      drawInfoRef.current = { dx, dy, dw, dh };

      // Apply zoom/pan (centered on image center)
      ctx.save();
      const cx = dx + dw / 2;
      const cy = dy + dh / 2;
      ctx.translate(cx + pan.x, cy + pan.y);
      ctx.scale(zoom, zoom);
      ctx.translate(-cx, -cy);

      // Apply horizontal flip if active
      if (flipped) {
        ctx.translate(dx + dw, 0);
        ctx.scale(-1, 1);
        ctx.translate(-dx, 0);
      }

      // Draw image
      ctx.drawImage(img, dx, dy, dw, dh);

      // Draw overlays
      const hasLandmarks = Object.keys(landmarks).length > 0;

      if (measurements && hasLandmarks) {
        ctx.save();
        ctx.translate(dx, dy);

        // Get overlay helper data based on view type
        let posteriorPointIds: string[] = [];
        let vertebralBodies: Array<{
          level: string;
          sup: Point;
          inf: Point;
          index: number;
        }> = [];

        if (viewType === 'cervical_lateral') {
          posteriorPointIds = CERVICAL_POSTERIOR_SEQUENCE;
          vertebralBodies = getCervicalVertebralBodies(landmarks);
        } else if (viewType === 'lumbar_lateral') {
          posteriorPointIds = LUMBAR_POSTERIOR_SEQUENCE;
          vertebralBodies = getLumbarVertebralBodies(landmarks);
        }
        // lumbar_ap uses landmark dots only (no posterior line)

        renderOverlays(
          ctx,
          landmarks,
          measurements,
          overlayConfig,
          posteriorPointIds,
          vertebralBodies,
          { w: imageDimensions.w, h: imageDimensions.h },
          { w: dw, h: dh },
        );

        ctx.restore();
      } else if (hasLandmarks) {
        // Draw landmark dots even without full measurements
        ctx.save();
        ctx.translate(dx, dy);

        for (const [, pt] of Object.entries(landmarks)) {
          if (!pt) continue;
          const cp = {
            x: (pt.x / imageDimensions.w) * dw,
            y: (pt.y / imageDimensions.h) * dh,
          };
          ctx.beginPath();
          ctx.arc(cp.x, cp.y, OVERLAY_SIZES.landmarkRadius, 0, Math.PI * 2);
          ctx.fillStyle = '#FFD232';
          ctx.fill();
          ctx.strokeStyle = '#1B3A5C';
          ctx.lineWidth = OVERLAY_SIZES.landmarkStrokeWidth;
          ctx.stroke();
        }

        ctx.restore();
      }

      ctx.restore(); // undo zoom/pan
    }, [zoom, pan, landmarks, measurements, overlayConfig, imageDimensions, viewType, imageLoaded, flipped]);

    // ─── Trigger Redraw on Changes ──────────────────────────
    useEffect(() => {
      redraw();
    }, [redraw]);

    // ─── ResizeObserver ─────────────────────────────────────
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;
      const observer = new ResizeObserver(() => redraw());
      observer.observe(container);
      return () => observer.disconnect();
    }, [redraw]);

    // ─── Native Wheel Handler (passive: false for preventDefault) ──
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const handler = (e: WheelEvent) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.15 : 0.15;
        setZoom((z) => {
          const next = Math.max(0.5, Math.min(4.0, z + delta));
          if (next <= 1.0) setPan({ x: 0, y: 0 });
          return next;
        });
      };

      canvas.addEventListener('wheel', handler, { passive: false });
      return () => canvas.removeEventListener('wheel', handler);
    }, []);

    // ─── Mouse Handlers ─────────────────────────────────────

    const handleMouseDown = useCallback(
      (e: React.MouseEvent<HTMLCanvasElement>) => {
        mouseDownPosRef.current = { x: e.clientX, y: e.clientY };
        didDragRef.current = false;

        // Check for landmark drag
        const nearId = findNearLandmark(e.clientX, e.clientY);
        if (nearId) {
          isDraggingRef.current = true;
          dragLandmarkIdRef.current = nearId;
          e.preventDefault();
          return;
        }

        // Pan when zoomed
        if (zoom > 1.0) {
          isPanningRef.current = true;
          panStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
          e.preventDefault();
        }
      },
      [findNearLandmark, zoom, pan],
    );

    const handleMouseMove = useCallback(
      (e: React.MouseEvent<HTMLCanvasElement>) => {
        // Track drag distance for click-vs-drag detection
        if (mouseDownPosRef.current) {
          const mdx = e.clientX - mouseDownPosRef.current.x;
          const mdy = e.clientY - mouseDownPosRef.current.y;
          if (Math.abs(mdx) > 3 || Math.abs(mdy) > 3) {
            didDragRef.current = true;
          }
        }

        if (isDraggingRef.current && dragLandmarkIdRef.current) {
          const point = canvasToImage(e.clientX, e.clientY);
          if (point) {
            onLandmarkPlace(dragLandmarkIdRef.current, point);
          }
        } else if (isPanningRef.current) {
          setPan({
            x: e.clientX - panStartRef.current.x,
            y: e.clientY - panStartRef.current.y,
          });
        }
      },
      [canvasToImage, onLandmarkPlace],
    );

    const handleMouseUp = useCallback(() => {
      isDraggingRef.current = false;
      dragLandmarkIdRef.current = null;
      isPanningRef.current = false;
      mouseDownPosRef.current = null;
    }, []);

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLCanvasElement>) => {
        // Ignore if this was a drag or pan gesture
        if (didDragRef.current) return;
        if (!currentLandmarkId) return;

        const point = canvasToImage(e.clientX, e.clientY);
        if (!point) return;

        onLandmarkPlace(currentLandmarkId, point);
      },
      [currentLandmarkId, canvasToImage, onLandmarkPlace],
    );

    // ─── Touch Handlers (iPad Safari) ───────────────────────

    const lastTouchDistRef = useRef<number | null>(null);

    const handleTouchStart = useCallback(
      (e: React.TouchEvent<HTMLCanvasElement>) => {
        if (e.touches.length === 2) {
          // Pinch-to-zoom start
          const t0 = e.touches[0];
          const t1 = e.touches[1];
          lastTouchDistRef.current = Math.sqrt(
            (t1.clientX - t0.clientX) ** 2 + (t1.clientY - t0.clientY) ** 2,
          );
          e.preventDefault();
          return;
        }

        if (e.touches.length === 1) {
          const touch = e.touches[0];
          mouseDownPosRef.current = { x: touch.clientX, y: touch.clientY };
          didDragRef.current = false;

          const nearId = findNearLandmark(touch.clientX, touch.clientY);
          if (nearId) {
            isDraggingRef.current = true;
            dragLandmarkIdRef.current = nearId;
            e.preventDefault();
          } else if (zoomRef.current > 1.0) {
            isPanningRef.current = true;
            panStartRef.current = {
              x: touch.clientX - panRef.current.x,
              y: touch.clientY - panRef.current.y,
            };
            e.preventDefault();
          }
        }
      },
      [findNearLandmark],
    );

    const handleTouchMove = useCallback(
      (e: React.TouchEvent<HTMLCanvasElement>) => {
        if (e.touches.length === 2) {
          const t0 = e.touches[0];
          const t1 = e.touches[1];
          const dist = Math.sqrt(
            (t1.clientX - t0.clientX) ** 2 + (t1.clientY - t0.clientY) ** 2,
          );
          if (lastTouchDistRef.current !== null) {
            const scale = dist / lastTouchDistRef.current;
            setZoom((z) => Math.max(0.5, Math.min(4.0, z * scale)));
          }
          lastTouchDistRef.current = dist;
          e.preventDefault();
          return;
        }

        if (e.touches.length === 1) {
          const touch = e.touches[0];

          if (mouseDownPosRef.current) {
            const mdx = touch.clientX - mouseDownPosRef.current.x;
            const mdy = touch.clientY - mouseDownPosRef.current.y;
            if (Math.abs(mdx) > 3 || Math.abs(mdy) > 3) {
              didDragRef.current = true;
            }
          }

          if (isDraggingRef.current && dragLandmarkIdRef.current) {
            const point = canvasToImage(touch.clientX, touch.clientY);
            if (point) {
              onLandmarkPlace(dragLandmarkIdRef.current, point);
            }
            e.preventDefault();
          } else if (isPanningRef.current) {
            setPan({
              x: touch.clientX - panStartRef.current.x,
              y: touch.clientY - panStartRef.current.y,
            });
            e.preventDefault();
          }
        }
      },
      [canvasToImage, onLandmarkPlace],
    );

    const handleTouchEnd = useCallback(
      (e: React.TouchEvent<HTMLCanvasElement>) => {
        // Single-finger tap → place landmark (if no drag occurred)
        if (
          e.changedTouches.length === 1 &&
          !didDragRef.current &&
          currentLandmarkId &&
          !isDraggingRef.current
        ) {
          const touch = e.changedTouches[0];
          const point = canvasToImage(touch.clientX, touch.clientY);
          if (point) {
            onLandmarkPlace(currentLandmarkId, point);
          }
        }

        lastTouchDistRef.current = null;
        isDraggingRef.current = false;
        dragLandmarkIdRef.current = null;
        isPanningRef.current = false;
        mouseDownPosRef.current = null;
      },
      [currentLandmarkId, canvasToImage, onLandmarkPlace],
    );

    // ─── Snapshot via useImperativeHandle ────────────────────
    useImperativeHandle(
      ref,
      () => ({
        getSnapshot: (): string | null => {
          const img = imageRef.current;
          if (!img || imageDimensions.w === 0) return null;

          // Create a clean snapshot at full image resolution, no zoom/pan
          const snapCanvas = document.createElement('canvas');
          snapCanvas.width = imageDimensions.w;
          snapCanvas.height = imageDimensions.h;
          const ctx = snapCanvas.getContext('2d');
          if (!ctx) return null;

          ctx.drawImage(img, 0, 0, imageDimensions.w, imageDimensions.h);

          // Render overlays at 1:1 (image coords = canvas coords)
          if (measurements && Object.keys(landmarks).length > 0) {
            let posteriorPointIds: string[] = [];
            let vertebralBodies: Array<{
              level: string;
              sup: Point;
              inf: Point;
              index: number;
            }> = [];

            if (viewType === 'cervical_lateral') {
              posteriorPointIds = CERVICAL_POSTERIOR_SEQUENCE;
              vertebralBodies = getCervicalVertebralBodies(landmarks);
            } else if (viewType === 'lumbar_lateral') {
              posteriorPointIds = LUMBAR_POSTERIOR_SEQUENCE;
              vertebralBodies = getLumbarVertebralBodies(landmarks);
            }

            renderOverlays(
              ctx,
              landmarks,
              measurements,
              overlayConfig,
              posteriorPointIds,
              vertebralBodies,
              { w: imageDimensions.w, h: imageDimensions.h },
              { w: imageDimensions.w, h: imageDimensions.h },
            );
          }

          return snapCanvas.toDataURL('image/png');
        },
      }),
      [landmarks, measurements, overlayConfig, imageDimensions, viewType],
    );

    // ─── Zoom Button Handlers ───────────────────────────────
    const handleZoomIn = useCallback(() => {
      setZoom((z) => Math.min(4, z + 0.25));
    }, []);

    const handleZoomOut = useCallback(() => {
      setZoom((z) => {
        const next = Math.max(0.5, z - 0.25);
        if (next <= 1.0) setPan({ x: 0, y: 0 });
        return next;
      });
    }, []);

    const handleZoomReset = useCallback(() => {
      setZoom(1.0);
      setPan({ x: 0, y: 0 });
    }, []);

    // ─── Render ─────────────────────────────────────────────
    return (
      <div
        ref={containerRef}
        className="relative w-full h-full bg-gray-900 rounded-lg overflow-hidden"
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{
            cursor: isDraggingRef.current
              ? 'grabbing'
              : isPanningRef.current
                ? 'grab'
                : 'crosshair',
            touchAction: 'none',
          }}
          onClick={handleClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />

        {/* Zoom + flip controls */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
          <button
            onClick={() => setFlipped((f) => !f)}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors text-lg ${
              flipped
                ? 'bg-[#FFD232] text-[#1B3A5C]'
                : 'bg-[#1B3A5C] text-white hover:bg-[#2C5F8A]'
            }`}
            title={flipped ? 'Unflip image' : 'Flip image horizontally'}
          >
            ↔
          </button>
          <button
            onClick={handleZoomIn}
            className="w-10 h-10 bg-[#1B3A5C] text-white rounded-lg flex items-center justify-center hover:bg-[#2C5F8A] transition-colors"
            title="Zoom in"
          >
            +
          </button>
          <button
            onClick={handleZoomOut}
            className="w-10 h-10 bg-[#1B3A5C] text-white rounded-lg flex items-center justify-center hover:bg-[#2C5F8A] transition-colors"
            title="Zoom out"
          >
            −
          </button>
          <button
            onClick={handleZoomReset}
            className="w-10 h-10 bg-[#1B3A5C] text-white rounded-lg flex items-center justify-center hover:bg-[#2C5F8A] transition-colors text-xs"
            title="Reset zoom"
          >
            Fit
          </button>
        </div>

        {/* Zoom level indicator */}
        {zoom !== 1.0 && (
          <div className="absolute bottom-4 left-4 bg-[#1B3A5C]/90 text-[#FFD232] px-2 py-1 rounded text-xs font-mono">
            {Math.round(zoom * 100)}%
          </div>
        )}

        {/* Current landmark indicator with label + description */}
        {currentLandmarkId && (() => {
          const allLandmarks: LandmarkDefinition[] =
            viewType === 'cervical_lateral' ? CERVICAL_LATERAL_LANDMARKS :
            viewType === 'lumbar_lateral' ? LUMBAR_LATERAL_LANDMARKS :
            LUMBAR_AP_LANDMARKS;
          const lmDef = allLandmarks.find((l) => l.id === currentLandmarkId);
          return (
            <div className="absolute top-4 left-4 right-20 bg-[#1B3A5C]/95 text-white px-4 py-3 rounded-lg shadow-lg border border-[#FFD232]/30">
              <div className="text-[#FFD232] font-bold text-sm">
                {lmDef?.label ?? currentLandmarkId}
              </div>
              {lmDef?.description && (
                <div className="text-white/80 text-xs mt-1 leading-relaxed">
                  {lmDef.description}
                </div>
              )}
            </div>
          );
        })()}
      </div>
    );
  },
);

export default XrayCanvas;
