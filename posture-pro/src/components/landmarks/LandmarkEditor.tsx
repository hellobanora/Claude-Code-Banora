'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { PostureCapture } from '@/lib/models/patient';
import type { Landmark, LandmarkID, NormalisedPoint } from '@/lib/models/landmark';
import { LANDMARK_LABEL, LANDMARK_VIEW } from '@/lib/models/landmark';
import { useImageUrl } from '@/lib/storage/use-image-url';
import { detectPose } from '@/lib/pose-detection/detect-pose';

interface LandmarkEditorProps {
  capture: PostureCapture;
  patientId: string;
  onLandmarksChange: (landmarks: Landmark[]) => void;
}

export function LandmarkEditor({ capture, patientId, onLandmarksChange }: LandmarkEditorProps) {
  const imageUrl = useImageUrl(patientId, capture.imageKey);
  const containerRef = useRef<HTMLDivElement>(null);
  const [landmarks, setLandmarks] = useState<Landmark[]>(capture.landmarks);
  const [activeLandmark, setActiveLandmark] = useState<LandmarkID | null>(null);
  const [dragging, setDragging] = useState<LandmarkID | null>(null);
  const [detecting, setDetecting] = useState(false);
  const [detectError, setDetectError] = useState<string | null>(null);

  const availableLandmarks = (Object.keys(LANDMARK_VIEW) as LandmarkID[]).filter(
    (id) => LANDMARK_VIEW[id] === capture.view
  );
  const placedIds = new Set(landmarks.map((l) => l.id));
  const unplacedLandmarks = availableLandmarks.filter((id) => !placedIds.has(id));

  useEffect(() => {
    onLandmarksChange(landmarks);
  }, [landmarks, onLandmarksChange]);

  const toNormalised = useCallback(
    (clientX: number, clientY: number): NormalisedPoint | null => {
      const el = containerRef.current?.querySelector('img');
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
      return { x, y };
    },
    []
  );

  const handleImageClick = useCallback(
    (e: React.PointerEvent) => {
      if (dragging) return;
      if (!activeLandmark) return;
      const pos = toNormalised(e.clientX, e.clientY);
      if (!pos) return;

      const newLandmark: Landmark = { id: activeLandmark, position: pos, confidence: 1.0 };
      setLandmarks((prev) => {
        const filtered = prev.filter((l) => l.id !== activeLandmark);
        return [...filtered, newLandmark];
      });

      const currentIdx = unplacedLandmarks.indexOf(activeLandmark);
      const nextUnplaced = unplacedLandmarks[currentIdx + 1] ?? null;
      setActiveLandmark(nextUnplaced);
    },
    [activeLandmark, dragging, toNormalised, unplacedLandmarks]
  );

  const handleDragStart = useCallback((id: LandmarkID) => {
    setDragging(id);
  }, []);

  const handleDragMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging) return;
      const pos = toNormalised(e.clientX, e.clientY);
      if (!pos) return;
      setLandmarks((prev) =>
        prev.map((l) => (l.id === dragging ? { ...l, position: pos } : l))
      );
    },
    [dragging, toNormalised]
  );

  const handleDragEnd = useCallback(() => {
    setDragging(null);
  }, []);

  const removeLandmark = useCallback((id: LandmarkID) => {
    setLandmarks((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const handleAutoDetect = useCallback(async () => {
    const img = containerRef.current?.querySelector('img');
    if (!img) return;
    setDetecting(true);
    setDetectError(null);
    try {
      const result = await detectPose(img, capture.view);
      if (result.landmarks.length === 0) {
        setDetectError('No pose detected. Ensure the full body is visible in the photo.');
        return;
      }
      setLandmarks(result.landmarks);
      setActiveLandmark(null);
    } catch (err) {
      setDetectError(
        err instanceof Error ? err.message : 'Auto-detection failed. Place landmarks manually.'
      );
    } finally {
      setDetecting(false);
    }
  }, [capture.view]);

  if (!imageUrl) {
    return <div className="p-4 text-sm text-neutral-500">Loading image…</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_240px]">
      {/* Photo + overlay area */}
      <div
        ref={containerRef}
        className="relative select-none overflow-hidden rounded-lg border border-neutral-300 bg-black"
        onPointerMove={handleDragMove}
        onPointerUp={handleDragEnd}
        onPointerLeave={handleDragEnd}
      >
        <img
          src={imageUrl}
          alt={`${capture.view} posture photo`}
          className="block w-full"
          draggable={false}
          onPointerDown={handleImageClick}
        />
        <svg
          viewBox="0 0 1 1"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 h-full w-full"
        >
          {landmarks.map((lm) => (
            <LandmarkMarker
              key={lm.id}
              landmark={lm}
              isActive={activeLandmark === lm.id}
              isDragging={dragging === lm.id}
              onDragStart={() => handleDragStart(lm.id)}
            />
          ))}
        </svg>
        {activeLandmark && (
          <div className="absolute bottom-2 left-2 right-2 rounded bg-navy/80 px-3 py-1.5 text-center text-xs text-white">
            Tap to place: <strong>{LANDMARK_LABEL[activeLandmark]}</strong>
          </div>
        )}
      </div>

      {/* Landmark palette */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={handleAutoDetect}
          disabled={detecting}
          className="w-full rounded-md bg-gradient-to-r from-midblue to-lightblue px-3 py-2 text-sm font-medium text-white shadow-sm hover:from-navy hover:to-midblue disabled:opacity-50"
        >
          {detecting ? 'Detecting…' : 'Auto-detect landmarks'}
        </button>
        {detectError && (
          <p className="rounded bg-red-50 px-2 py-1 text-xs text-red-600">{detectError}</p>
        )}
        <div>
          <h4 className="mb-1 text-xs font-bold uppercase tracking-wide text-neutral-500">
            Unplaced
          </h4>
          <div className="space-y-1">
            {unplacedLandmarks.length === 0 ? (
              <p className="text-xs text-green-600">All landmarks placed</p>
            ) : (
              unplacedLandmarks.map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveLandmark(id)}
                  className={`block w-full rounded px-2 py-1 text-left text-xs transition ${
                    activeLandmark === id
                      ? 'bg-gold text-navy font-medium'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {LANDMARK_LABEL[id]}
                </button>
              ))
            )}
          </div>
        </div>

        {landmarks.length > 0 && (
          <div>
            <h4 className="mb-1 text-xs font-bold uppercase tracking-wide text-neutral-500">
              Placed
            </h4>
            <div className="space-y-1">
              {landmarks.map((lm) => (
                <div
                  key={lm.id}
                  className="flex items-center justify-between rounded bg-green-50 px-2 py-1 text-xs"
                >
                  <span className="text-green-800">{LANDMARK_LABEL[lm.id]}</span>
                  <button
                    type="button"
                    onClick={() => removeLandmark(lm.id)}
                    className="text-red-400 hover:text-red-600"
                    aria-label={`Remove ${LANDMARK_LABEL[lm.id]}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function LandmarkMarker({
  landmark,
  isActive,
  isDragging,
  onDragStart,
}: {
  landmark: Landmark;
  isActive: boolean;
  isDragging: boolean;
  onDragStart: () => void;
}) {
  const { x, y } = landmark.position;
  const r = isDragging ? 0.007 : 0.005;

  return (
    <g
      className="pointer-events-auto cursor-grab"
      onPointerDown={(e) => {
        e.stopPropagation();
        onDragStart();
      }}
    >
      <circle
        cx={x} cy={y} r={r + 0.004}
        fill="none"
        stroke={isActive ? '#FFD232' : 'rgba(255,255,255,0.3)'}
        strokeWidth="0.0015"
      />
      <circle
        cx={x} cy={y} r={r}
        fill="#FFD232"
        stroke="#806400"
        strokeWidth="0.0015"
      />
      <text
        x={x + 0.008} y={y + 0.003}
        fill="white"
        stroke="rgba(0,0,0,0.5)"
        strokeWidth="0.002"
        paintOrder="stroke"
        fontSize="0.01"
        className="select-none"
      >
        {LANDMARK_LABEL[landmark.id]}
      </text>
    </g>
  );
}
