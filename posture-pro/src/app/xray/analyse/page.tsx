'use client';

// ═══════════════════════════════════════════════════════════════
// SpineView — Analysis Page (/xray/analyse)
//
// Split layout: X-ray canvas (left) + guide panel (right).
// Supports TWO modes:
//   1. Auto-detect: AI places landmarks → practitioner reviews
//   2. Manual: step-by-step guided placement (original flow)
//
// Mode selection happens on first load via auto-detect prompt.
// ═══════════════════════════════════════════════════════════════

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { LandmarkMap, MeasurementResult, ViewType, ClinicId } from '@/lib/xray/types';
import type { LandmarkStatusMap } from '@/lib/xray/auto-detect';
import {
  CERVICAL_LATERAL_LANDMARKS,
  LUMBAR_LATERAL_LANDMARKS,
  LUMBAR_AP_LANDMARKS,
  DEFAULT_OVERLAY_CONFIG,
} from '@/lib/xray/constants';
import { analyseCervicalLateral } from '@/lib/xray/cervical-lateral';
import { analyseLumbarLateral } from '@/lib/xray/lumbar-lateral';
import { analyseLumbarAP } from '@/lib/xray/lumbar-ap';
import {
  autoDetectLandmarks,
  confirmLandmark,
  confirmAllLandmarks,
  adjustLandmark,
} from '@/lib/xray/auto-detect';
import {
  XrayCanvas,
  LandmarkGuide,
  MeasurementsPanel,
  AiConsentModal,
  AutoDetectPanel,
} from '@/components/xray';

type PlacementMode = 'choosing' | 'auto' | 'manual';

export default function AnalysePage() {
  const router = useRouter();

  // ─── Session Data ──────────────────────────────────────
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

  // ─── Mode State ────────────────────────────────────────
  const [mode, setMode] = useState<PlacementMode>('choosing');
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectError, setDetectError] = useState<string | null>(null);

  // ─── Landmark State (shared between modes) ─────────────
  const [landmarks, setLandmarks] = useState<LandmarkMap>({});
  const [placementOrder, setPlacementOrder] = useState<string[]>([]);

  // Auto-detect specific state
  const [statuses, setStatuses] = useState<LandmarkStatusMap>({});
  const [confidence, setConfidence] = useState(0);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [selectedLandmark, setSelectedLandmark] = useState<string | null>(null);

  // ─── Landmark Sequence ─────────────────────────────────
  const landmarkSequence = useMemo(() => {
    if (!sessionData) return [];
    switch (sessionData.viewType) {
      case 'cervical_lateral': return CERVICAL_LATERAL_LANDMARKS;
      case 'lumbar_lateral': return LUMBAR_LATERAL_LANDMARKS;
      case 'lumbar_ap': return LUMBAR_AP_LANDMARKS;
      default: return CERVICAL_LATERAL_LANDMARKS;
    }
  }, [sessionData?.viewType]);

  // Manual mode: current step
  const currentIndex = placementOrder.length;
  const currentLandmarkId =
    mode === 'manual' && currentIndex < landmarkSequence.length
      ? landmarkSequence[currentIndex].id
      : mode === 'auto' && selectedLandmark
        ? selectedLandmark
        : null;
  const isManualComplete =
    mode === 'manual' && placementOrder.length >= landmarkSequence.length;

  // ─── Measurements ──────────────────────────────────────
  const measurements = useMemo<MeasurementResult | null>(() => {
    if (!sessionData || Object.keys(landmarks).length === 0) return null;
    switch (sessionData.viewType) {
      case 'cervical_lateral': return analyseCervicalLateral(landmarks);
      case 'lumbar_lateral': return analyseLumbarLateral(landmarks);
      case 'lumbar_ap': return analyseLumbarAP(landmarks);
      default: return null;
    }
  }, [landmarks, sessionData?.viewType]);

  // ─── Image Dimensions ─────────────────────────────────
  const [imageDimensions, setImageDimensions] = useState({ w: 0, h: 0 });
  useEffect(() => {
    if (!sessionData?.imageDataUrl) return;
    const img = new Image();
    img.onload = () =>
      setImageDimensions({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = sessionData.imageDataUrl;
  }, [sessionData?.imageDataUrl]);

  // ═══════════════════════════════════════════════════════
  // AUTO-DETECT HANDLERS
  // ═══════════════════════════════════════════════════════

  const handleAutoDetectConsent = useCallback(async () => {
    if (!sessionData) return;
    setShowConsentModal(false);
    setMode('auto');
    setIsDetecting(true);
    setDetectError(null);

    try {
      const result = await autoDetectLandmarks(
        sessionData.imageDataUrl,
        sessionData.viewType,
        imageDimensions,
      );

      setLandmarks(result.landmarks);
      setStatuses(result.statuses);
      setConfidence(result.confidence);
      setWarnings(result.warnings);
    } catch (err: any) {
      console.error('Auto-detect failed:', err);
      setDetectError(err.message ?? 'Auto-detection failed');
      // Fall back to manual mode
      setMode('manual');
    } finally {
      setIsDetecting(false);
    }
  }, [sessionData, imageDimensions]);

  const handleConfirmLandmark = useCallback((id: string) => {
    setStatuses((prev) => confirmLandmark(prev, id));
    setSelectedLandmark(null);
  }, []);

  const handleConfirmAll = useCallback(() => {
    setStatuses((prev) => confirmAllLandmarks(prev));
    setSelectedLandmark(null);
  }, []);

  const handleSelectLandmark = useCallback((id: string) => {
    setSelectedLandmark((prev) => (prev === id ? null : id));
  }, []);

  // ═══════════════════════════════════════════════════════
  // MANUAL MODE HANDLERS
  // ═══════════════════════════════════════════════════════

  const handleLandmarkPlace = useCallback(
    (id: string, point: { x: number; y: number }) => {
      if (mode === 'auto') {
        // In auto mode, placing a point adjusts and confirms it
        const result = adjustLandmark(landmarks, statuses, id, point);
        setLandmarks(result.landmarks);
        setStatuses(result.statuses);
        setSelectedLandmark(null);
      } else {
        // Manual mode: sequential placement
        setLandmarks((prev) => ({ ...prev, [id]: point }));
        setPlacementOrder((prev) =>
          prev.includes(id) ? prev : [...prev, id]
        );
        setStatuses((prev) => ({ ...prev, [id]: 'manual' }));
      }
    },
    [mode, landmarks, statuses]
  );

  const handleUndo = useCallback(() => {
    setPlacementOrder((prev) => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      setLandmarks((lm) => {
        const next = { ...lm };
        delete next[last];
        return next;
      });
      setStatuses((s) => {
        const next = { ...s };
        delete next[last];
        return next;
      });
      return prev.slice(0, -1);
    });
  }, []);

  const handleReset = useCallback(() => {
    setLandmarks({});
    setPlacementOrder([]);
    setStatuses({});
    setSelectedLandmark(null);
  }, []);

  const handleSwitchToManual = useCallback(() => {
    // Keep any confirmed/adjusted landmarks, switch to manual guide
    setMode('manual');
    // Build placement order from existing landmarks
    const existing = landmarkSequence
      .filter((lm) => landmarks[lm.id])
      .map((lm) => lm.id);
    setPlacementOrder(existing);
    // Mark all existing as manual
    const newStatuses: LandmarkStatusMap = {};
    for (const id of existing) {
      newStatuses[id] = 'manual';
    }
    setStatuses(newStatuses);
    setSelectedLandmark(null);
  }, [landmarks, landmarkSequence]);

  // ═══════════════════════════════════════════════════════
  // NAVIGATE TO REPORT
  // ═══════════════════════════════════════════════════════

  const handleViewReport = useCallback(() => {
    if (!sessionData || !measurements) return;
    sessionStorage.setItem(
      'spineview_results',
      JSON.stringify({
        landmarks,
        measurements,
        annotatedImageDataUrl: null,
      })
    );
    router.push('/xray/report');
  }, [sessionData, measurements, landmarks, router]);

  // ═══════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════

  if (!sessionData) {
    return (
      <div className="min-h-screen bg-[#0F1A2E] flex items-center justify-center">
        <div className="text-[#8BA4C4]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#0F1A2E] flex flex-col">
      {/* AI Consent Modal */}
      <AiConsentModal
        isOpen={showConsentModal}
        onConsent={handleAutoDetectConsent}
        onCancel={() => {
          setShowConsentModal(false);
          setMode('manual');
        }}
      />

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
        <div className="flex items-center gap-3">
          {mode === 'auto' && (
            <span className="text-xs px-2 py-1 rounded-full bg-[#F39C12]/20 text-[#F39C12]">
              AI Mode
            </span>
          )}
          <span className="text-[#8BA4C4] text-sm capitalize">
            {sessionData.viewType.replace(/_/g, ' ')}
          </span>
        </div>
      </div>

      {/* Mode chooser (shown once on first load) */}
      {mode === 'choosing' && (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-lg w-full space-y-4">
            <h2 className="text-white text-xl font-bold text-center mb-6">
              How would you like to place landmarks?
            </h2>

            {/* Auto-detect option */}
            <button
              onClick={() => setShowConsentModal(true)}
              disabled={imageDimensions.w === 0}
              className="w-full p-6 bg-[#162440] border-2 border-[#2C5F8A] rounded-xl hover:border-[#FFD232] transition-all text-left group disabled:opacity-50"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#2C5F8A] rounded-xl flex items-center justify-center text-2xl group-hover:bg-[#FFD232] transition-colors">
                  🤖
                </div>
                <div>
                  <h3 className="text-[#FFD232] font-bold text-lg">
                    AI Auto-Detect
                  </h3>
                  <p className="text-[#8BA4C4] text-sm">
                    AI estimates all landmark positions. You review and
                    adjust any that need correcting.
                  </p>
                </div>
              </div>
            </button>

            {/* Manual option */}
            <button
              onClick={() => setMode('manual')}
              className="w-full p-6 bg-[#162440] border-2 border-[#1E3455] rounded-xl hover:border-[#FFD232] transition-all text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#1E3455] rounded-xl flex items-center justify-center text-2xl group-hover:bg-[#FFD232] transition-colors">
                  👆
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">
                    Manual Placement
                  </h3>
                  <p className="text-[#8BA4C4] text-sm">
                    Step-by-step guided placement. Click each landmark
                    one at a time with anatomical instructions.
                  </p>
                </div>
              </div>
            </button>

            {detectError && (
              <div className="bg-[#E74C3C]/10 border border-[#E74C3C]/30 rounded-lg p-3 text-center">
                <p className="text-[#E74C3C] text-sm">{detectError}</p>
                <p className="text-[#8BA4C4] text-xs mt-1">
                  You can try again or use manual placement.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main split layout (auto or manual mode) */}
      {(mode === 'auto' || mode === 'manual') && (
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

          {/* Right: Panel */}
          <div className="w-80 flex flex-col border-l border-[#1E3455] flex-shrink-0">
            {mode === 'auto' ? (
              <>
                <div className="flex-1 overflow-y-auto">
                  <AutoDetectPanel
                    landmarkSequence={landmarkSequence}
                    landmarks={landmarks}
                    statuses={statuses}
                    confidence={confidence}
                    warnings={warnings}
                    selectedLandmark={selectedLandmark}
                    onSelectLandmark={handleSelectLandmark}
                    onConfirmLandmark={handleConfirmLandmark}
                    onConfirmAll={handleConfirmAll}
                    onSwitchToManual={handleSwitchToManual}
                    onViewReport={handleViewReport}
                    isDetecting={isDetecting}
                    viewType={sessionData.viewType}
                  />
                </div>
                {measurements && !isDetecting && (
                  <div className="border-t border-[#1E3455] max-h-[35%] overflow-y-auto">
                    <MeasurementsPanel measurements={measurements} />
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto">
                  <LandmarkGuide
                    landmarks={landmarkSequence}
                    placedLandmarks={landmarks}
                    currentIndex={currentIndex}
                    onUndo={handleUndo}
                    onReset={handleReset}
                    isComplete={isManualComplete}
                    onViewReport={handleViewReport}
                  />
                </div>
                {measurements && (
                  <div className="border-t border-[#1E3455] max-h-[40%] overflow-y-auto">
                    <MeasurementsPanel measurements={measurements} />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
