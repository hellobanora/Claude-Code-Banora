'use client';

// ═══════════════════════════════════════════════════════════════
// SpineView — IdealComparison Component
//
// Side-by-side comparison: ideal cervical X-ray (real image)
// vs patient's annotated X-ray or generated SVG.
//
// The ideal image is a real lateral cervical X-ray showing
// a healthy lordotic curve with George's Line overlay.
// ═══════════════════════════════════════════════════════════════

import React from 'react';
import type { MeasurementResult, ViewType } from '@/lib/xray/types';
import { SEVERITY_COLOURS, SEVERITY_LABELS } from '@/lib/xray/constants';
import {
  IDEAL_CERVICAL_LATERAL,
  generatePatientCervicalArc,
} from '@/lib/xray/ideal-spines';

interface IdealComparisonProps {
  measurements: MeasurementResult;
  viewType: ViewType;
  /** Optional: patient's annotated X-ray snapshot from canvas */
  patientImageUrl?: string;
}

export default function IdealComparison({
  measurements,
  viewType,
  patientImageUrl,
}: IdealComparisonProps) {
  if (viewType === 'cervical_lateral') {
    return (
      <CervicalComparison
        measurements={measurements}
        patientImageUrl={patientImageUrl}
      />
    );
  }

  // TODO: Claude Code — add lumbar comparison views in Phase 2
  return (
    <div className="text-[#8BA4C4] text-sm italic p-4">
      Comparison diagram for this view coming in Phase 2.
    </div>
  );
}

function CervicalComparison({
  measurements,
  patientImageUrl,
}: {
  measurements: MeasurementResult;
  patientImageUrl?: string;
}) {
  const ideal = IDEAL_CERVICAL_LATERAL;
  const ara = measurements.ara;
  const patientColour = ara
    ? SEVERITY_COLOURS[ara.severity]
    : SEVERITY_COLOURS.normal;

  // Generate patient arc for SVG fallback (when no annotated image)
  const patientArc = ara
    ? generatePatientCervicalArc(ara.measured)
    : generatePatientCervicalArc(0);

  return (
    <div className="space-y-4">
      {/* Side-by-side comparison */}
      <div className="flex gap-4 items-stretch justify-center p-4">
        {/* Ideal spine — real X-ray image */}
        <div className="flex-1 text-center max-w-[240px]">
          <h4 className="text-[#2ECC71] text-sm mb-3 font-semibold">
            Normal Cervical Lordosis
          </h4>
          <div className="relative rounded-lg overflow-hidden border-2 border-[#2ECC71]/30 bg-black">
            <img
              src="/xray/ideal-cervical-lateral.jpg"
              alt="Normal cervical lateral X-ray showing healthy lordotic curve"
              className="w-full h-auto"
            />
            {/* Label overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-2">
              <span className="text-[#2ECC71] text-xs font-semibold">
                Ideal: 42° lordosis
              </span>
            </div>
          </div>
        </div>

        {/* VS divider */}
        <div className="flex items-center">
          <div className="text-[#5B7A9E] text-lg font-bold px-2">vs</div>
        </div>

        {/* Patient spine */}
        <div className="flex-1 text-center max-w-[240px]">
          <h4
            className="text-sm mb-3 font-semibold"
            style={{ color: patientColour }}
          >
            Your Cervical Spine
          </h4>
          <div
            className="relative rounded-lg overflow-hidden bg-black"
            style={{ border: `2px solid ${patientColour}30` }}
          >
            {patientImageUrl ? (
              /* Annotated X-ray snapshot from canvas */
              <img
                src={patientImageUrl}
                alt="Patient cervical lateral X-ray with measurements"
                className="w-full h-auto"
              />
            ) : (
              /* SVG fallback — schematic patient arc */
              <div className="bg-[#0D1520] flex items-center justify-center" style={{ aspectRatio: '3/4' }}>
                <svg
                  viewBox={ideal.viewBox}
                  className="w-40 h-56"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Patient arc */}
                  <path
                    d={patientArc}
                    fill="none"
                    stroke={patientColour}
                    strokeWidth="3"
                  />
                  {/* Vertebral bodies */}
                  {ideal.bodies.map((body) => (
                    <rect
                      key={body.level}
                      x={body.x}
                      y={body.y}
                      width={body.width}
                      height={body.height}
                      rx={body.rx}
                      fill="none"
                      stroke={patientColour}
                      strokeWidth="1.5"
                      opacity="0.5"
                    />
                  ))}
                  {/* Level labels */}
                  {ideal.labels.map((label) => (
                    <text
                      key={label.level}
                      x={label.x}
                      y={label.y}
                      fill="#8BA4C4"
                      fontSize="14"
                      textAnchor="start"
                    >
                      {label.level}
                    </text>
                  ))}
                </svg>
              </div>
            )}

            {/* ARA overlay */}
            {ara && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-2">
                <span
                  className="text-xs font-semibold"
                  style={{ color: patientColour }}
                >
                  ARA: {ara.measured.toFixed(1)}° ({ara.lossPercent.toFixed(0)}% loss)
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary comparison card */}
      {ara && (
        <div className="mx-4 p-4 rounded-lg bg-[#0F1A2E] border border-[#1E3455]">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <span className="text-[#8BA4C4] text-xs block mb-1">Normal</span>
              <span className="text-[#2ECC71] text-xl font-bold">42°</span>
            </div>
            <div>
              <span className="text-[#8BA4C4] text-xs block mb-1">Yours</span>
              <span
                className="text-xl font-bold"
                style={{ color: patientColour }}
              >
                {ara.measured.toFixed(1)}°
              </span>
            </div>
            <div>
              <span className="text-[#8BA4C4] text-xs block mb-1">Status</span>
              <span
                className="text-sm font-semibold"
                style={{ color: patientColour }}
              >
                {SEVERITY_LABELS[ara.severity]}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
