'use client';

// ═══════════════════════════════════════════════════════════════
// SpineView — Analysis Page (/xray/analyse)
//
// Split layout: X-ray canvas (left) + guide panel (right).
// Supports TWO modes:
//   1. Auto-detect: AI places landmarks → practitioner reviews
//   2. Manual: step-by-step guided placement (original flow)
// ═══════════════════════════════════════════════════════════════

import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { LandmarkMap, MeasurementResult, ViewType, ClinicId } from '@/lib/xray/types';
import type { XrayCanvasHandle } from '@/components/xray/XrayCanvas';
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
import { saveXrayAnalysis } from '@/lib/xray/xray-store';
import { generateId } from '@/lib/xray/geometry';
import {
  autoDetectLandmarks,
  confirmLandmark,
  confirmAllLandmarks,
  adjustLandmark,
} from '@/lib/xray/auto-detect';
import { detectLandmarksONNX, hasONNXModel } from '@/lib/xray/onnx-detect';
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
  const canvasRef = useRef<XrayCanvasHandle>(null);

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
      let result;

      // Use ONNX model if available (cervical lateral), otherwise Claude API
      if (hasONNXModel(sessionData.viewType)) {
        console.log('Using ONNX in-browser model...');
        result = await detectLandmarksONNX(
          sessionData.imageDataUrl,
          sessionData.viewType,
          imageDimensions,
        );
      }

      // Fall back to Claude API if ONNX not available or returned null
      if (!result) {
        console.log('Falling back to Claude Vision API...');
        result = await autoDetectLandmarks(
          sessionData.imageDataUrl,
          sessionData.viewType,
          imageDimensions,
        );
      }

      setLandmarks(result.landmarks);
      setStatuses(result.statuses);
      setConfidence(result.confidence);
      setWarnings(result.warnings);
    } catch (err: any) {
      console.error('Auto-detect failed:', err);
      setDetectError(err.message ?? 'Auto-detection failed');
      setMode('choosing');
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
        const result = adjustLandmark(landmarks, statuses, id, point);
        setLandmarks(result.landmarks);
        setStatuses(result.statuses);
        setSelectedLandmark(null);
      } else {
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
    setMode('manual');
    const existing = landmarkSequence
      .filter((lm) => landmarks[lm.id])
      .map((lm) => lm.id);
    setPlacementOrder(existing);
    const newStatuses: LandmarkStatusMap = {};
    for (const id of existing) {
      newStatuses[id] = 'manual';
    }
    setStatuses(newStatuses);
    setSelectedLandmark(null);
  }, [landmarks, landmarkSequence]);

  // ═══════════════════════════════════════════════════════
  // SAVE & NAVIGATE TO REPORT
  // ═══════════════════════════════════════════════════════

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

  // ═══════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════

  if (!sessionData) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-neutral-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-neutral-100 flex flex-col">
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
        <div className="flex items-center gap-3">
          {mode === 'auto' && (
            <span className="text-xs px-2 py-1 rounded-full bg-[#F39C12]/20 text-[#F39C12]">
              AI Mode
            </span>
          )}
          <span className="text-white/60 text-sm capitalize">
            {sessionData.viewType.replace(/_/g, ' ')}
          </span>
        </div>
      </div>

      {/* Mode chooser (shown once on first load) */}
      {mode === 'choosing' && (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-lg w-full space-y-4">
            <h2 className="text-navy text-xl font-bold text-center mb-6">
              How would you like to place landmarks?
            </h2>

            <button
              onClick={() => {
                if (sessionData && hasONNXModel(sessionData.viewType)) {
                  handleAutoDetectConsent();
                } else {
                  setShowConsentModal(true);
                }
              }}
              disabled={imageDimensions.w === 0}
              className="w-full p-6 bg-white border-2 border-neutral-200 rounded-xl hover:border-navy transition-all text-left group disabled:opacity-50 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-navy/10 rounded-xl flex items-center justify-center text-2xl group-hover:bg-navy group-hover:text-white transition-colors">
                  🤖
                </div>
                <div>
                  <h3 className="text-navy font-bold text-lg">AI Auto-Detect</h3>
                  <p className="text-neutral-500 text-sm">
                    {sessionData && hasONNXModel(sessionData.viewType)
                      ? 'Instant in-browser detection — no data leaves your device.'
                      : 'AI estimates all landmark positions. You review and adjust any that need correcting.'}
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setMode('manual')}
              className="w-full p-6 bg-white border-2 border-neutral-200 rounded-xl hover:border-navy transition-all text-left group shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-neutral-100 rounded-xl flex items-center justify-center text-2xl group-hover:bg-navy group-hover:text-white transition-colors">
                  👆
                </div>
                <div>
                  <h3 className="text-navy font-bold text-lg">Manual Placement</h3>
                  <p className="text-neutral-500 text-sm">
                    Step-by-step guided placement. Click each landmark one at a time with anatomical instructions.
                  </p>
                </div>
              </div>
            </button>

            {detectError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                <p className="text-red-600 text-sm">{detectError}</p>
                <p className="text-neutral-500 text-xs mt-1">
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

          {/* Right: Panel */}
          <div className="w-80 flex flex-col border-l border-neutral-200 flex-shrink-0 bg-white">
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
                  <div className="border-t border-neutral-200 max-h-[35%] overflow-y-auto">
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
                  <div className="border-t border-neutral-200 max-h-[40%] overflow-y-auto">
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
