'use client';

// ═══════════════════════════════════════════════════════════════
// SpineView — Landing Page (/xray)
//
// Patient selection, exam date, view type, image upload.
// Modern white + blue/gold design matching PostureProClinic.
// ═══════════════════════════════════════════════════════════════

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { ViewType, ClinicId, XrayAnalysis } from '@/lib/xray/types';
import { SEVERITY_COLOURS } from '@/lib/xray/constants';
import { loadAllXrayAnalyses, deleteXrayAnalysis } from '@/lib/xray/xray-store';
import { ViewSelector } from '@/components/xray';

export default function XrayLandingPage() {
  const router = useRouter();
  const [patientName, setPatientName] = useState('');
  const [examDate, setExamDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [viewType, setViewType] = useState<ViewType>('cervical_lateral');
  const [clinicId, setClinicId] = useState<ClinicId>('banora');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    },
    []
  );

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith('image/')) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleStart = useCallback(() => {
    if (!imagePreview || !patientName.trim()) return;

    sessionStorage.setItem(
      'spineview_session',
      JSON.stringify({
        patientName,
        examDate,
        viewType,
        clinicId,
        imageDataUrl: imagePreview,
      })
    );

    router.push('/xray/analyse');
  }, [imagePreview, patientName, examDate, viewType, clinicId, router]);

  // ─── Saved Analyses ──────────────────────────────────────
  const [savedAnalyses, setSavedAnalyses] = useState<XrayAnalysis[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(true);

  useEffect(() => {
    loadAllXrayAnalyses()
      .then(setSavedAnalyses)
      .catch(console.error)
      .finally(() => setLoadingSaved(false));
  }, []);

  // Group by patient
  const patientGroups = savedAnalyses.reduce<Record<string, XrayAnalysis[]>>(
    (acc, a) => {
      const key = a.patientId;
      if (!acc[key]) acc[key] = [];
      acc[key].push(a);
      return acc;
    },
    {},
  );

  const handleDelete = useCallback(async (id: string) => {
    await deleteXrayAnalysis(id);
    setSavedAnalyses((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const handleOpenReport = useCallback(
    (analysis: XrayAnalysis) => {
      sessionStorage.setItem(
        'spineview_results',
        JSON.stringify({
          analysisId: analysis.id,
          patientName: analysis.patientId,
          landmarks: analysis.landmarks,
          measurements: analysis.measurements,
          annotatedImageDataUrl: analysis.annotatedImageDataUrl ?? null,
        }),
      );
      router.push('/xray/report');
    },
    [router],
  );

  const handleCombinedReport = useCallback(
    (analyses: XrayAnalysis[]) => {
      sessionStorage.setItem(
        'spineview_combined',
        JSON.stringify(analyses.map((a) => a.id)),
      );
      router.push('/xray/combined-report');
    },
    [router],
  );

  const isReady = imagePreview && patientName.trim();

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-navy border-b-2 border-goldlight">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">
            <span className="text-goldlight">SpineView</span>{' '}
            <span className="text-white/60 font-normal text-lg">
              X-Ray Analysis
            </span>
          </h1>
          <div className="flex items-center gap-4">
            <Link
              href="/xray/guide"
              className="text-[#FFD232]/70 hover:text-[#FFD232] transition-colors text-sm"
            >
              Landmark Guide
            </Link>
            <Link
              href="/"
              className="text-white/60 hover:text-white transition-colors text-sm"
            >
              ← Posture Pro
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Patient Details */}
        <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm">
          <h2 className="text-navy font-semibold mb-4">Patient Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-neutral-500 text-sm block mb-1">
                Patient Name
              </label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Enter patient name"
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 placeholder:text-neutral-400 focus:border-navy focus:ring-1 focus:ring-navy/20 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-neutral-500 text-sm block mb-1">
                Exam Date
              </label>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:border-navy focus:ring-1 focus:ring-navy/20 focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* View Selection */}
        <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm">
          <h2 className="text-navy font-semibold mb-4">X-Ray View</h2>
          <ViewSelector selected={viewType} onChange={setViewType} />
        </div>

        {/* Clinic Branding */}
        <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm">
          <h2 className="text-navy font-semibold mb-4">Clinic</h2>
          <div className="flex gap-3">
            <button
              onClick={() => setClinicId('banora')}
              className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all border ${
                clinicId === 'banora'
                  ? 'bg-navy text-white border-navy'
                  : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-navy/40 hover:text-navy'
              }`}
            >
              Banora Chiropractic
            </button>
            <button
              onClick={() => setClinicId('palmbeach')}
              className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all border ${
                clinicId === 'palmbeach'
                  ? 'bg-navy text-white border-navy'
                  : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-navy/40 hover:text-navy'
              }`}
            >
              Palm Beach Chiropractic
            </button>
          </div>
        </div>

        {/* Image Upload */}
        <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm">
          <h2 className="text-navy font-semibold mb-4">
            Upload X-Ray Image
          </h2>

          {!imagePreview ? (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-neutral-300 rounded-xl p-12 text-center hover:border-navy transition-colors cursor-pointer bg-neutral-50"
            >
              <input
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleImageUpload}
                className="hidden"
                id="xray-upload"
              />
              <label htmlFor="xray-upload" className="cursor-pointer">
                <div className="text-navy text-4xl mb-3">📁</div>
                <p className="text-neutral-900 font-medium mb-1">
                  Drop X-ray image here or click to upload
                </p>
                <p className="text-neutral-400 text-sm">
                  JPEG or PNG exported from your PACS viewer
                </p>
              </label>
            </div>
          ) : (
            <div className="relative bg-neutral-100 rounded-lg p-4">
              <img
                src={imagePreview}
                alt="Uploaded X-ray"
                className="max-h-64 mx-auto rounded-lg"
              />
              <button
                onClick={() => {
                  setImageFile(null);
                  setImagePreview(null);
                }}
                className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                ×
              </button>
            </div>
          )}
        </div>

        {/* Start Analysis */}
        <div className="text-center pb-4">
          <button
            onClick={handleStart}
            disabled={!isReady}
            className={`px-12 py-4 rounded-xl text-lg font-bold transition-all ${
              isReady
                ? 'bg-goldlight text-navy hover:bg-gold hover:scale-105 shadow-md'
                : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
            }`}
          >
            Start Analysis →
          </button>
        </div>

        {/* ─── Saved Analyses ──────────────────────────────── */}
        <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm">
          <h2 className="text-navy font-semibold mb-4">Saved Analyses</h2>

          {loadingSaved ? (
            <p className="text-neutral-500 text-sm">Loading...</p>
          ) : savedAnalyses.length === 0 ? (
            <p className="text-neutral-400 text-sm italic">
              No saved analyses yet. Complete an analysis above and it will appear here.
            </p>
          ) : (
            <div className="space-y-6">
              {Object.entries(patientGroups).map(([pid, analyses]) => {
                const firstName = analyses[0].patientId.replace(/-/g, ' ');
                const hasMultipleViews = new Set(analyses.map((a) => a.viewType)).size > 1;

                return (
                  <div key={pid} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-neutral-900 font-medium capitalize">{firstName}</h3>
                      {hasMultipleViews && (
                        <button
                          onClick={() => handleCombinedReport(analyses)}
                          className="px-3 py-1.5 bg-goldlight text-navy text-xs font-bold rounded-lg hover:bg-gold transition-colors"
                        >
                          Combined Report
                        </button>
                      )}
                    </div>

                    {analyses.map((a) => {
                      const overallSeverity =
                        a.measurements.ara?.severity ??
                        a.measurements.lumbarLordosis?.severity ??
                        a.measurements.cobbAngle?.severity ??
                        null;

                      return (
                        <div
                          key={a.id}
                          className="flex items-center gap-3 bg-neutral-50 rounded-lg p-3 border border-neutral-200 group hover:border-neutral-300 transition-colors"
                        >
                          {/* Thumbnail */}
                          {a.annotatedImageDataUrl && (
                            <img
                              src={a.annotatedImageDataUrl}
                              alt=""
                              className="w-12 h-16 object-cover rounded border border-neutral-200"
                            />
                          )}

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-neutral-900 text-sm font-medium capitalize">
                                {a.viewType.replace(/_/g, ' ')}
                              </span>
                              {overallSeverity && (
                                <span
                                  className="text-xs px-1.5 py-0.5 rounded font-medium"
                                  style={{
                                    backgroundColor: SEVERITY_COLOURS[overallSeverity] + '20',
                                    color: SEVERITY_COLOURS[overallSeverity],
                                  }}
                                >
                                  {overallSeverity}
                                </span>
                              )}
                            </div>
                            <span className="text-neutral-400 text-xs">
                              {new Date(a.examDate).toLocaleDateString('en-AU')} · {Object.keys(a.landmarks).length} landmarks
                            </span>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleOpenReport(a)}
                              className="px-3 py-1.5 bg-navy text-white text-xs rounded hover:bg-midblue transition-colors"
                            >
                              Report
                            </button>
                            <button
                              onClick={() => handleDelete(a.id)}
                              className="px-2 py-1.5 text-red-500 text-xs rounded hover:bg-red-50 transition-colors"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="pb-8" />
      </div>
    </div>
  );
}
