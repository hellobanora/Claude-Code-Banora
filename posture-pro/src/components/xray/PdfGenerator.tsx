'use client';

// ═══════════════════════════════════════════════════════════════
// SpineView — PdfGenerator Component
//
// Wraps pdf-builder.ts functionality into a React component
// with loading state and error handling.
//
// TODO: Claude Code — enhance in Session 4.
// ═══════════════════════════════════════════════════════════════

import React, { useState, useCallback } from 'react';
import type { XrayAnalysis } from '@/lib/xray/types';
import { downloadReport } from '@/lib/xray/pdf-builder';

interface PdfGeneratorProps {
  analysis: XrayAnalysis;
  patientName: string;
  patientDOB?: string;
  practitionerName?: string;
}

export default function PdfGenerator({
  analysis,
  patientName,
  patientDOB,
  practitionerName,
}: PdfGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    setError(null);

    try {
      await downloadReport({
        analysis,
        patientName,
        patientDOB,
        practitionerName,
      });
    } catch (err) {
      console.error('PDF generation failed:', err);
      setError('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [analysis, patientName, patientDOB, practitionerName]);

  return (
    <div className="inline-flex flex-col items-center gap-2">
      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className={`px-8 py-3 font-bold rounded-lg transition-all ${
          isGenerating
            ? 'bg-[#1E3455] text-[#8BA4C4] cursor-wait'
            : 'bg-[#FFD232] text-[#1B3A5C] hover:bg-[#D4A017]'
        }`}
      >
        {isGenerating ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Generating PDF...
          </span>
        ) : (
          'Download PDF Report'
        )}
      </button>
      {error && (
        <span className="text-[#E74C3C] text-sm">{error}</span>
      )}
    </div>
  );
}
