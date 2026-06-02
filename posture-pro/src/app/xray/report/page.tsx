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
import { ReportView } from '@/components/xray';

export default function ReportPage() {
  const router = useRouter();
  const [analysis, setAnalysis] = useState<XrayAnalysis | null>(null);
  const [patientName, setPatientName] = useState('');

  useEffect(() => {
    const sessionRaw = sessionStorage.getItem('spineview_session');
    const resultsRaw = sessionStorage.getItem('spineview_results');

    if (!sessionRaw || !resultsRaw) {
      router.push('/xray');
      return;
    }

    const session = JSON.parse(sessionRaw) as {
      patientName: string;
      examDate: string;
      viewType: ViewType;
      clinicId: ClinicId;
      imageDataUrl: string;
    };

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
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-neutral-500">Loading report...</div>
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
