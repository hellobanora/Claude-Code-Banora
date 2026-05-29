'use client';

// ═══════════════════════════════════════════════════════════════
// SpineView — Analysis Page (/xray/analyse)
//
// Split layout: X-ray canvas (left) + landmark guide (right).
// Live measurement updates as landmarks are placed.
//
// TODO: Claude Code — implement in Phase 1, Session 3.
// ═══════════════════════════════════════════════════════════════

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { LandmarkMap, MeasurementResult, ViewType, ClinicId } from '@/lib/xray/types';
import {
  CERVICAL_LATERAL_LANDMARKS,
  LUMBAR_LATERAL_LANDMARKS,
  LUMBAR_AP_LANDMARKS,
  DEFAULT_OVERLAY_CONFIG,
} from '@/lib/xray/constants';
import { analyseCervicalLateral } from '@/lib/xray/cervical-lateral';
import { analyseLumbarLateral } from '@/lib/xray/lumbar-lateral';
import { analyseLumbarAP } from '@/lib/xray/lumbar-ap';
import { XrayCanvas, LandmarkGuide, MeasurementsPanel } from '@/components/xray';

export default function AnalysePage() {
  const router = useRouter();

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

  // Navigate to report
  const handleViewReport = useCallback(() => {
    if (!sessionData || !measurements) return;

    // TODO: Claude Code — capture canvas snapshot for annotatedImageDataUrl
    // For now, store measurements in session and navigate
    sessionStorage.setItem(
      'spineview_results',
      JSON.stringify({
        landmarks,
        measurements,
        annotatedImageDataUrl: null, // Canvas snapshot goes here
      })
    );

    router.push('/xray/report');
  }, [sessionData, measurements, landmarks, router]);

  // Image dimensions (detect on load)
  const [imageDimensions, setImageDimensions] = useState({ w: 0, h: 0 });
  useEffect(() => {
    if (!sessionData?.imageDataUrl) return;
    const img = new Image();
    img.onload = () =>
      setImageDimensions({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = sessionData.imageDataUrl;
  }, [sessionData?.imageDataUrl]);

  if (!sessionData) {
    return (
      <div className="min-h-screen bg-[#0F1A2E] flex items-center justify-center">
        <div className="text-[#8BA4C4]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#0F1A2E] flex flex-col">
      {/* Top bar */}
      <div className="bg-[#1B3A5C] border-b border-[#FFD232] px-4 py-2 flex items-center justify-between flex-shrink-0">
        <button
          onClick={() => router.push('/xray')}
          className="text-[#8BA4C4] hover:text-white transition-colors text-sm"
        >
          ← Back
        </button>
        <div className="text-white font-semibold">
          <span className="text-[#FFD232]">SpineView</span> — {sessionData.patientName}
        </div>
        <div className="text-[#8BA4C4] text-sm capitalize">
          {sessionData.viewType.replace(/_/g, ' ')}
        </div>
      </div>

      {/* Main split layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Canvas */}
        <div className="flex-1 p-2">
          <XrayCanvas
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

        {/* Right: Guide + Measurements */}
        <div className="w-80 flex flex-col border-l border-[#1E3455] flex-shrink-0">
          {/* Landmark guide (top half) */}
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

          {/* Measurements (bottom half, collapsible) */}
          {measurements && (
            <div className="border-t border-[#1E3455] max-h-[40%] overflow-y-auto">
              <MeasurementsPanel measurements={measurements} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
