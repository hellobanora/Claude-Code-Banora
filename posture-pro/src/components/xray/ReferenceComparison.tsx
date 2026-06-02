'use client';

// ═══════════════════════════════════════════════════════════════
// SpineView — ReferenceComparison Component
//
// Side-by-side: patient's annotated x-ray (left) vs textbook
// normal reference image (right) at the same scale.
// ═══════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import type { ViewType } from '@/lib/xray/types';
import { REFERENCE_XRAY_IMAGES } from '@/lib/xray/constants';

interface ReferenceComparisonProps {
  patientImageUrl: string;
  viewType: ViewType;
  patientLabel?: string;
}

export default function ReferenceComparison({
  patientImageUrl,
  viewType,
  patientLabel = 'Patient',
}: ReferenceComparisonProps) {
  const ref = REFERENCE_XRAY_IMAGES[viewType];
  const [refError, setRefError] = useState(false);

  if (!ref || refError) {
    return (
      <div className="space-y-2">
        <img
          src={patientImageUrl}
          alt={`${patientLabel} annotated x-ray`}
          className="max-h-[55vh] mx-auto object-contain rounded print:max-h-[45vh]"
        />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-4">
        {/* Patient (left) */}
        <div className="flex flex-col items-center">
          <div className="bg-neutral-900 rounded-lg p-2 flex items-center justify-center w-full print:bg-black">
            <img
              src={patientImageUrl}
              alt={`${patientLabel} annotated x-ray`}
              className="max-h-[45vh] object-contain print:max-h-[35vh]"
            />
          </div>
          <span className="text-xs font-semibold mt-2 text-navy print:text-gray-700">
            {patientLabel}
          </span>
        </div>

        {/* Reference (right) */}
        <div className="flex flex-col items-center">
          <div className="bg-neutral-900 rounded-lg p-2 flex items-center justify-center w-full print:bg-black">
            <img
              src={ref.path}
              alt={ref.label}
              className="max-h-[45vh] object-contain print:max-h-[35vh]"
              onError={() => setRefError(true)}
            />
          </div>
          <span className="text-xs font-semibold mt-2 text-green-600 print:text-gray-700">
            {ref.label}
          </span>
        </div>
      </div>

      <p className="text-xs text-center text-neutral-400 italic print:text-gray-500">
        {ref.description}
      </p>
    </div>
  );
}
