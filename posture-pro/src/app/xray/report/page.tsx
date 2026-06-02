'use client';

// ═══════════════════════════════════════════════════════════════
// SpineView — Report Page (/xray/report)
//
// Displays full analysis report and handles PDF export.
//
// TODO: Claude Code — wire up IndexedDB save in Session 5.
// ═══════════════════════════════════════════════════════════════

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { XrayAnalysis, ViewType, ClinicId, MeasurementResult, LandmarkMap } from '@/lib/xray/types';
import { generateId } from '@/lib/xray/geometry';
import { downloadReport } from '@/lib/xray/pdf-builder';
import { getSpineViewSession } from '@/lib/xray/session-store';
import { ReportView } from '@/components/xray';

export default function ReportPage() {
  const router = useRouter();
  const [analysis, setAnalysis] = useState<XrayAnalysis | null>(null);
  const [patientName, setPatientName] = useState('');

  useEffect(() => {
    const session = getSpineViewSession();
    const resultsRaw = sessionStorage.getItem('spineview_results');

    if (!session || !resultsRaw) {
      router.push('/xray');
      return;
    }

    const results = JSON.parse(resultsRaw) as {
      landmarks: LandmarkMap;
      measurements: MeasurementResult;
      annotatedImageDataUrl: string | null;
    };

    setPatientName(session.patientName);

    // Build the analysis record
    const img = new Image();
    img.onload = () => {
      const record: XrayAnalysis = {
        id: generateId(),
        patientId: '', // TODO: link to actual patient
        createdAt: new Date().toISOString(),
        examDate: session.examDate,
        viewType: session.viewType,
        imageDataUrl: session.imageDataUrl,
        imageDimensions: { w: img.naturalWidth, h: img.naturalHeight },
        landmarks: results.landmarks,
        measurements: results.measurements,
        annotatedImageDataUrl: results.annotatedImageDataUrl ?? undefined,
        clinicId: session.clinicId,
      };
      setAnalysis(record);
    };
    img.src = session.imageDataUrl;
  }, [router]);

  const handleDownloadPdf = useCallback(async () => {
    if (!analysis) return;
    try {
      await downloadReport({
        analysis,
        patientName,
      });
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('PDF generation failed. Please try again.');
    }
  }, [analysis, patientName]);

  const handleSaveToPatient = useCallback(() => {
    if (!analysis) return;
    // TODO: Claude Code — save to IndexedDB via PatientRepository
    alert('Save to patient record — coming in Phase 1, Session 5.');
  }, [analysis]);

  const handleBack = useCallback(() => {
    router.push('/xray/analyse');
  }, [router]);

  if (!analysis) {
    return (
      <div className="min-h-screen bg-[#0F1A2E] flex items-center justify-center">
        <div className="text-[#8BA4C4]">Loading report...</div>
      </div>
    );
  }

  return (
    <ReportView
      analysis={analysis}
      patientName={patientName}
      onDownloadPdf={handleDownloadPdf}
      onSaveToPatient={handleSaveToPatient}
      onBack={handleBack}
    />
  );
}
