'use client';

// ═══════════════════════════════════════════════════════════════
// SpineView — Analysis Page (/xray/analyse)
//
// Split layout: X-ray canvas (left) + landmark guide (right).
// Canvas stays dark for x-ray contrast; chrome is light.
// ═══════════════════════════════════════════════════════════════

import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { LandmarkMap, MeasurementResult, ViewType, ClinicId } from '@/lib/xray/types';
import type { XrayCanvasHandle } from '@/components/xray/XrayCanvas';
import {
  CERVICAL_LATERAL_LANDMARKS,
  LUMBAR_LATERAL_LANDMARKS,
  LUMBAR_AP_LANDMARKS,
  DEFAULT_OVERLAY_CONFIG,
} from '@/lib/xray/constants';
import { analyseCervicalLateral } from '@/lib/xray/cervical-lateral';
import { analyseLumbarLateral } from '@/lib/xray/lumbar-lateral';
import { analyseLumbarAP } from '@/lib/xray/lumbar-ap';
import { saveXrayAnalysis } from '@/lib/xray/xray-store';
import { generateId } from '@/lib/xray/geometry';
import { XrayCanvas, LandmarkGuide, MeasurementsPanel } from '@/components/xray';

export default function AnalysePage() {
  const router = useRouter();
  const canvasRef = useRef<XrayCanvasHandle>(null);

  // Load session data
  const [sessionData, setSessionData] = useState<{
    patientName: string;
    examDate: string;
    viewType: ViewType;
    clinicId: ClinicId;
    imageDataUrl: string;
  } | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem('spineview_session');
    if (raw) {
      setSessionData(JSON.parse(raw));
    } else {
      router.push('/xray');
    }
  }, [router]);

  // Landmark state
  const [landmarks, setLandmarks] = useState<LandmarkMap>({});
  const [placementOrder, setPlacementOrder] = useState<string[]>([]);

  // Get the landmark sequence for the current view
  const landmarkSequence = useMemo(() => {
    if (!sessionData) return [];
    switch (sessionData.viewType) {
      case 'cervical_lateral':
        return CERVICAL_LATERAL_LANDMARKS;
      case 'lumbar_lateral':
        return LUMBAR_LATERAL_LANDMARKS;
      case 'lumbar_ap':
        return LUMBAR_AP_LANDMARKS;
      default:
        return CERVICAL_LATERAL_LANDMARKS;
    }
  }, [sessionData?.viewType]);

  // Current landmark index (next one to place)
  const currentIndex = placementOrder.length;
  const currentLandmarkId =
    currentIndex < landmarkSequence.length
      ? landmarkSequence[currentIndex].id
      : null;
  const isComplete = placementOrder.length >= landmarkSequence.length;

  // Calculate measurements whenever landmarks change
  const measurements = useMemo<MeasurementResult | null>(() => {
    if (!sessionData || Object.keys(landmarks).length === 0) return null;
    switch (sessionData.viewType) {
      case 'cervical_lateral':
        return analyseCervicalLateral(landmarks);
      case 'lumbar_lateral':
        return analyseLumbarLateral(landmarks);
      case 'lumbar_ap':
        return analyseLumbarAP(landmarks);
      default:
        return null;
    }
  }, [landmarks, sessionData?.viewType]);

  // Handle landmark placement
  const handleLandmarkPlace = useCallback(
    (id: string, point: { x: number; y: number }) => {
      setLandmarks((prev) => ({ ...prev, [id]: point }));
      setPlacementOrder((prev) =>
        prev.includes(id) ? prev : [...prev, id]
      );
    },
    []
  );

  // Undo last landmark
  const handleUndo = useCallback(() => {
    setPlacementOrder((prev) => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      setLandmarks((lm) => {
        const next = { ...lm };
        delete next[last];
        return next;
      });
      return prev.slice(0, -1);
    });
  }, []);

  // Reset all landmarks
  const handleReset = useCallback(() => {
    setLandmarks({});
    setPlacementOrder([]);
  }, []);

  // Image dimensions (detect on load)
  const [imageDimensions, setImageDimensions] = useState({ w: 0, h: 0 });
  useEffect(() => {
    if (!sessionData?.imageDataUrl) return;
    const img = new Image();
    img.onload = () =>
      setImageDimensions({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = sessionData.imageDataUrl;
  }, [sessionData?.imageDataUrl]);

  // Save analysis and navigate to report
  const handleViewReport = useCallback(async () => {
    if (!sessionData || !measurements) return;

    const annotatedImageDataUrl = canvasRef.current?.getSnapshot() ?? undefined;

    const analysisId = generateId();
    const patientId = sessionData.patientName.toLowerCase().replace(/\s+/g, '-');

    const analysis = {
      id: analysisId,
      patientId,
      createdAt: new Date().toISOString(),
      examDate: sessionData.examDate,
      viewType: sessionData.viewType,
      imageDataUrl: sessionData.imageDataUrl,
      imageDimensions,
      landmarks,
      measurements,
      annotatedImageDataUrl,
      clinicId: sessionData.clinicId,
    };

    try {
      await saveXrayAnalysis(analysis);
    } catch (err) {
      console.error('Failed to save analysis:', err);
    }

    sessionStorage.setItem(
      'spineview_results',
      JSON.stringify({
        analysisId,
        patientName: sessionData.patientName,
        landmarks,
        measurements,
        annotatedImageDataUrl,
      })
    );

    router.push('/xray/report');
  }, [sessionData, measurements, landmarks, imageDimensions, router]);

  if (!sessionData) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-neutral-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-neutral-100 flex flex-col">
      {/* Top bar */}
      <div className="bg-navy border-b-2 border-goldlight px-4 py-2 flex items-center justify-between flex-shrink-0">
        <button
          onClick={() => router.push('/xray')}
          className="text-white/60 hover:text-white transition-colors text-sm"
        >
          ← Back
        </button>
        <div className="text-white font-semibold">
          <span className="text-goldlight">SpineView</span> — {sessionData.patientName}
        </div>
        <div className="text-white/60 text-sm capitalize">
          {sessionData.viewType.replace(/_/g, ' ')}
        </div>
      </div>

      {/* Main split layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Canvas (dark background for x-ray contrast) */}
        <div className="flex-1 p-2 bg-neutral-900">
          <XrayCanvas
            ref={canvasRef}
            imageDataUrl={sessionData.imageDataUrl}
            imageDimensions={imageDimensions}
            landmarks={landmarks}
            onLandmarkPlace={handleLandmarkPlace}
            currentLandmarkId={currentLandmarkId}
            measurements={measurements}
            viewType={sessionData.viewType}
            overlayConfig={DEFAULT_OVERLAY_CONFIG}
          />
        </div>

        {/* Right: Guide + Measurements (light panel) */}
        <div className="w-80 flex flex-col border-l border-neutral-200 flex-shrink-0 bg-white">
          <div className="flex-1 overflow-y-auto">
            <LandmarkGuide
              landmarks={landmarkSequence}
              placedLandmarks={landmarks}
              currentIndex={currentIndex}
              onUndo={handleUndo}
              onReset={handleReset}
              isComplete={isComplete}
              onViewReport={handleViewReport}
            />
          </div>

          {measurements && (
            <div className="border-t border-neutral-200 max-h-[40%] overflow-y-auto">
              <MeasurementsPanel measurements={measurements} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
