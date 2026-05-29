'use client';

// ═══════════════════════════════════════════════════════════════
// SpineView — IdealComparison Component
//
// Side-by-side SVG rendering of ideal spine vs patient's spine.
// Uses data from ideal-spines.ts.
//
// TODO: Claude Code — enhance in Phase 3 with overlay option.
// ═══════════════════════════════════════════════════════════════

import React from 'react';
import type { MeasurementResult, ViewType } from '@/lib/xray/types';
import { SEVERITY_COLOURS } from '@/lib/xray/constants';
import {
  IDEAL_CERVICAL_LATERAL,
  generatePatientCervicalArc,
  IDEAL_LUMBAR_LATERAL,
} from '@/lib/xray/ideal-spines';

interface IdealComparisonProps {
  measurements: MeasurementResult;
  viewType: ViewType;
}

export default function IdealComparison({ measurements, viewType }: IdealComparisonProps) {
  if (viewType === 'cervical_lateral') {
    return <CervicalComparison measurements={measurements} />;
  }

  // TODO: Claude Code — add lumbar comparison views
  return (
    <div className="text-[#8BA4C4] text-sm italic p-4">
      Comparison diagram for this view coming in Phase 2.
    </div>
  );
}

function CervicalComparison({ measurements }: { measurements: MeasurementResult }) {
  const ideal = IDEAL_CERVICAL_LATERAL;
  const ara = measurements.ara;
  const patientArc = ara
    ? generatePatientCervicalArc(ara.measured)
    : generatePatientCervicalArc(0); // Straight if no ARA

  const patientColour = ara ? SEVERITY_COLOURS[ara.severity] : SEVERITY_COLOURS.normal;

  return (
    <div className="flex gap-6 items-center justify-center p-4">
      {/* Ideal spine */}
      <div className="text-center">
        <h4 className="text-[#8BA4C4] text-sm mb-3 font-medium">Normal</h4>
        <svg
          viewBox={ideal.viewBox}
          className="w-32 h-64"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Arc of Life */}
          <path
            d={ideal.arcPath}
            fill="none"
            stroke="#2ECC71"
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
              stroke="#2ECC71"
              strokeWidth="1.5"
              opacity="0.6"
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
          {/* Summary */}
          <text
            x={ideal.summaryPosition.x}
            y={ideal.summaryPosition.y}
            fill="#2ECC71"
            fontSize="14"
            textAnchor="middle"
            fontWeight="bold"
          >
            {ideal.summaryText}
          </text>
        </svg>
      </div>

      {/* VS divider */}
      <div className="text-[#5B7A9E] text-lg font-bold">vs</div>

      {/* Patient spine */}
      <div className="text-center">
        <h4 className="text-[#8BA4C4] text-sm mb-3 font-medium">Yours</h4>
        <svg
          viewBox={ideal.viewBox}
          className="w-32 h-64"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Patient arc */}
          <path
            d={patientArc}
            fill="none"
            stroke={patientColour}
            strokeWidth="3"
          />
          {/* Vertebral bodies (same positions, patient colour) */}
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
              opacity="0.6"
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
          {/* Patient ARA */}
          {ara && (
            <text
              x={ideal.summaryPosition.x}
              y={ideal.summaryPosition.y}
              fill={patientColour}
              fontSize="14"
              textAnchor="middle"
              fontWeight="bold"
            >
              {ara.measured.toFixed(1)}° ({ara.lossPercent.toFixed(0)}% loss)
            </text>
          )}
        </svg>
      </div>
    </div>
  );
}
