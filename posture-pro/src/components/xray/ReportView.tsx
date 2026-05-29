'use client';

// ═══════════════════════════════════════════════════════════════
// SpineView — ReportView Component
//
// Full-page analysis report with measurements table,
// ideal comparison, and patient education text.
//
// TODO: Claude Code — implement PDF export button in Session 4.
// ═══════════════════════════════════════════════════════════════

import React from 'react';
import type { XrayAnalysis, ClinicBranding } from '@/lib/xray/types';
import { CLINICS, SEVERITY_COLOURS, SEVERITY_LABELS, EDUCATION_TEXT } from '@/lib/xray/constants';
import SeverityBadge from './SeverityBadge';
import IdealComparison from './IdealComparison';
import MeasurementsPanel from './MeasurementsPanel';

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

  // Determine overall severity for education text
  const overallSeverity = measurements.ara?.severity
    ?? measurements.lumbarLordosis?.severity
    ?? 'normal';

  const viewKey = analysis.viewType.includes('cervical') ? 'cervical' : 'lumbar';
  const educationTexts = EDUCATION_TEXT[viewKey as keyof typeof EDUCATION_TEXT];
  const educationText = educationTexts?.[overallSeverity] ?? '';

  return (
    <div className="min-h-screen bg-[#0F1A2E] text-white">
      {/* Header */}
      <div className="bg-[#1B3A5C] border-b border-[#FFD232]">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-[#8BA4C4] hover:text-white transition-colors text-sm"
          >
            ← Back to Analysis
          </button>
          <h1 className="text-xl font-semibold">X-Ray Analysis Report</h1>
          <div className="text-sm text-[#8BA4C4]">{clinic.name}</div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Patient Info Card */}
        <div className="bg-[#162440] rounded-xl p-6 border border-[#1E3455]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="text-[#8BA4C4] text-xs block mb-1">Patient</span>
              <span className="text-white font-semibold">{patientName}</span>
            </div>
            {patientDOB && (
              <div>
                <span className="text-[#8BA4C4] text-xs block mb-1">Date of Birth</span>
                <span className="text-white">{patientDOB}</span>
              </div>
            )}
            <div>
              <span className="text-[#8BA4C4] text-xs block mb-1">Exam Date</span>
              <span className="text-white">{analysis.examDate}</span>
            </div>
            <div>
              <span className="text-[#8BA4C4] text-xs block mb-1">View</span>
              <span className="text-white capitalize">
                {analysis.viewType.replace(/_/g, ' ')}
              </span>
            </div>
          </div>
        </div>

        {/* Annotated X-Ray Image */}
        {analysis.annotatedImageDataUrl && (
          <div className="bg-[#162440] rounded-xl p-6 border border-[#1E3455]">
            <h2 className="text-lg font-semibold text-[#FFD232] mb-4">
              Annotated X-Ray
            </h2>
            <div className="flex justify-center">
              <img
                src={analysis.annotatedImageDataUrl}
                alt="Annotated X-ray"
                className="max-h-[500px] rounded-lg"
              />
            </div>
          </div>
        )}

        {/* Ideal vs Patient Comparison */}
        <div className="bg-[#162440] rounded-xl p-6 border border-[#1E3455]">
          <h2 className="text-lg font-semibold text-[#FFD232] mb-4">
            Normal vs. Your Spine
          </h2>
          <IdealComparison
            measurements={measurements}
            viewType={analysis.viewType}
          />
        </div>

        {/* Measurements */}
        <div className="bg-[#162440] rounded-xl border border-[#1E3455]">
          <h2 className="text-lg font-semibold text-[#FFD232] p-6 pb-0">
            Detailed Measurements
          </h2>
          <MeasurementsPanel measurements={measurements} />
        </div>

        {/* Patient Education */}
        <div className="bg-[#162440] rounded-xl p-6 border border-[#1E3455]">
          <h2 className="text-lg font-semibold text-[#FFD232] mb-4">
            What This Means
          </h2>
          <p className="text-[#E8EDF3] leading-relaxed">{educationText}</p>
        </div>

        {/* Disclaimer */}
        <div className="bg-[#0D1520] rounded-lg p-4 border border-[#1E3455] text-center">
          <p className="text-[#5B7A9E] text-xs leading-relaxed">
            This analysis is for patient education purposes only. All measurements
            are derived from manually placed anatomical landmarks. Clinical
            interpretation should be made by a qualified healthcare practitioner.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center pb-8">
          <button
            onClick={onDownloadPdf}
            className="px-8 py-3 bg-[#FFD232] text-[#1B3A5C] font-bold rounded-lg hover:bg-[#D4A017] transition-colors"
          >
            Download PDF Report
          </button>
          <button
            onClick={onSaveToPatient}
            className="px-8 py-3 bg-[#2C5F8A] text-white font-bold rounded-lg hover:bg-[#5B9EC9] transition-colors"
          >
            Save to Patient Record
          </button>
        </div>
      </div>
    </div>
  );
}
