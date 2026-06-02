'use client';

// ═══════════════════════════════════════════════════════════════
// SpineView — ReportView Component
//
// Full-page analysis report with measurements table,
// ideal comparison, and patient education text.
// Light theme matching PostureProClinic aesthetic.
// ═══════════════════════════════════════════════════════════════

import React from 'react';
import type { XrayAnalysis, ClinicBranding } from '@/lib/xray/types';
import { CLINICS, SEVERITY_COLOURS, SEVERITY_LABELS, EDUCATION_TEXT } from '@/lib/xray/constants';
import SeverityBadge from './SeverityBadge';
import IdealComparison from './IdealComparison';
import MeasurementsPanel from './MeasurementsPanel';
import ReferenceComparison from './ReferenceComparison';

interface ReportViewProps {
  analysis: XrayAnalysis;
  patientName: string;
  patientDOB?: string;
  onDownloadPdf: () => void;
  onSaveToPatient: () => void;
  onBack: () => void;
}

export default function ReportView({
  analysis,
  patientName,
  patientDOB,
  onDownloadPdf,
  onSaveToPatient,
  onBack,
}: ReportViewProps) {
  const clinic = CLINICS[analysis.clinicId] ?? CLINICS.banora;
  const { measurements } = analysis;

  const overallSeverity = measurements.ara?.severity
    ?? measurements.lumbarLordosis?.severity
    ?? 'normal';

  const viewKey = analysis.viewType.includes('cervical') ? 'cervical' : 'lumbar';
  const educationTexts = EDUCATION_TEXT[viewKey as keyof typeof EDUCATION_TEXT];
  const educationText = educationTexts?.[overallSeverity] ?? '';

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-navy border-b-2 border-goldlight">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-white/60 hover:text-white transition-colors text-sm"
          >
            ← Back to Analysis
          </button>
          <h1 className="text-xl font-semibold text-white">X-Ray Analysis Report</h1>
          <div className="text-sm text-white/60">{clinic.name}</div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        {/* Patient Info Card */}
        <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="text-neutral-400 text-xs block mb-1">Patient</span>
              <span className="text-neutral-900 font-semibold">{patientName}</span>
            </div>
            {patientDOB && (
              <div>
                <span className="text-neutral-400 text-xs block mb-1">Date of Birth</span>
                <span className="text-neutral-900">{patientDOB}</span>
              </div>
            )}
            <div>
              <span className="text-neutral-400 text-xs block mb-1">Exam Date</span>
              <span className="text-neutral-900">{analysis.examDate}</span>
            </div>
            <div>
              <span className="text-neutral-400 text-xs block mb-1">View</span>
              <span className="text-neutral-900 capitalize">
                {analysis.viewType.replace(/_/g, ' ')}
              </span>
            </div>
          </div>
        </div>

        {/* Patient vs Reference Comparison */}
        {analysis.annotatedImageDataUrl && (
          <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm">
            <h2 className="text-lg font-semibold text-navy mb-4">
              Your X-Ray vs. Normal
            </h2>
            <ReferenceComparison
              patientImageUrl={analysis.annotatedImageDataUrl}
              viewType={analysis.viewType}
              patientLabel={patientName}
            />
          </div>
        )}

        {/* Ideal Spine Curve Comparison (SVG diagram) */}
        <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm">
          <h2 className="text-lg font-semibold text-navy mb-4">
            Curve Analysis
          </h2>
          <IdealComparison
            measurements={measurements}
            viewType={analysis.viewType}
          />
        </div>

        {/* Measurements */}
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm">
          <h2 className="text-lg font-semibold text-navy p-6 pb-0">
            Detailed Measurements
          </h2>
          <MeasurementsPanel measurements={measurements} />
        </div>

        {/* Patient Education */}
        <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm">
          <h2 className="text-lg font-semibold text-navy mb-4">
            What This Means
          </h2>
          <p className="text-neutral-700 leading-relaxed">{educationText}</p>
        </div>

        {/* Disclaimer */}
        <div className="bg-neutral-100 rounded-lg p-4 border border-neutral-200 text-center">
          <p className="text-neutral-400 text-xs leading-relaxed">
            This analysis is for patient education purposes only. All measurements
            are derived from manually placed anatomical landmarks. Clinical
            interpretation should be made by a qualified healthcare practitioner.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center pb-8">
          <button
            onClick={onDownloadPdf}
            className="px-8 py-3 bg-goldlight text-navy font-bold rounded-lg hover:bg-gold transition-colors shadow-sm"
          >
            Download PDF Report
          </button>
          <button
            onClick={onSaveToPatient}
            className="px-8 py-3 bg-navy text-white font-bold rounded-lg hover:bg-midblue transition-colors shadow-sm"
          >
            Save to Patient Record
          </button>
        </div>
      </div>
    </div>
  );
}
