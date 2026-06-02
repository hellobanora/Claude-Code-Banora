'use client';

// ═══════════════════════════════════════════════════════════════
// SpineView — MeasurementsPanel Component
//
// Live readout of calculated angles and measurements.
// Light theme matching PostureProClinic aesthetic.
// ═══════════════════════════════════════════════════════════════

import React from 'react';
import type { MeasurementResult } from '@/lib/xray/types';
import { SEVERITY_COLOURS, SEVERITY_LABELS } from '@/lib/xray/constants';
import SeverityBadge from './SeverityBadge';

interface MeasurementsPanelProps {
  measurements: MeasurementResult | null;
}

export default function MeasurementsPanel({ measurements }: MeasurementsPanelProps) {
  if (!measurements) {
    return (
      <div className="p-4 text-neutral-400 text-sm italic">
        Place landmarks to see measurements...
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* ARA Summary (cervical) */}
      {measurements.ara && (
        <div
          className="p-4 rounded-lg border bg-white"
          style={{ borderColor: SEVERITY_COLOURS[measurements.ara.severity] + '60' }}
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-navy font-semibold">ARA (C2–C7 Cobb)</h4>
            <SeverityBadge severity={measurements.ara.severity} />
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className="text-3xl font-bold"
              style={{ color: SEVERITY_COLOURS[measurements.ara.severity] }}
            >
              {measurements.ara.measured.toFixed(1)}°
            </span>
            <span className="text-neutral-500 text-sm">
              ideal: {measurements.ara.ideal}°
            </span>
          </div>
          <div className="text-sm text-neutral-500 mt-1">
            {measurements.ara.lossPercent.toFixed(0)}% deviation from normal
          </div>
        </div>
      )}

      {/* Lumbar Lordosis (lumbar lateral) */}
      {measurements.lumbarLordosis && (
        <div
          className="p-4 rounded-lg border bg-white"
          style={{ borderColor: SEVERITY_COLOURS[measurements.lumbarLordosis.severity] + '60' }}
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-navy font-semibold">Lumbar Lordosis (L1–S1)</h4>
            <SeverityBadge severity={measurements.lumbarLordosis.severity} />
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className="text-3xl font-bold"
              style={{ color: SEVERITY_COLOURS[measurements.lumbarLordosis.severity] }}
            >
              {measurements.lumbarLordosis.measured.toFixed(1)}°
            </span>
            <span className="text-neutral-500 text-sm">
              ideal: {measurements.lumbarLordosis.ideal}°
            </span>
          </div>
        </div>
      )}

      {/* Segmental Angles Table */}
      {measurements.segments.length > 0 && (
        <div>
          <h4 className="text-navy font-semibold mb-2">Segmental Angles</h4>
          <div className="overflow-hidden rounded-lg border border-neutral-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-navy">
                  <th className="text-left px-3 py-2 text-white/70 font-medium">Segment</th>
                  <th className="text-right px-3 py-2 text-white/70 font-medium">Ideal</th>
                  <th className="text-right px-3 py-2 text-white/70 font-medium">Measured</th>
                  <th className="text-right px-3 py-2 text-white/70 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {measurements.segments.map((seg, i) => (
                  <tr
                    key={seg.segment}
                    className={i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}
                  >
                    <td className="px-3 py-2 text-neutral-900">{seg.segment}</td>
                    <td className="px-3 py-2 text-right text-neutral-400">{seg.ideal}°</td>
                    <td className="px-3 py-2 text-right text-neutral-900 font-medium">
                      {seg.measured !== null ? `${seg.measured.toFixed(1)}°` : '—'}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {seg.severity ? <SeverityBadge severity={seg.severity} size="sm" /> : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Anterior Head Carriage */}
      {measurements.anteriorHeadCarriage && (
        <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200">
          <div className="flex items-center justify-between">
            <span className="text-neutral-500 text-sm">Anterior Head Carriage</span>
            <SeverityBadge severity={measurements.anteriorHeadCarriage.severity} size="sm" />
          </div>
          <span className="text-neutral-900 font-semibold">
            {measurements.anteriorHeadCarriage.pixels.toFixed(0)}px
            {measurements.anteriorHeadCarriage.mm !== null
              ? ` (${measurements.anteriorHeadCarriage.mm.toFixed(1)}mm)`
              : ''}
          </span>
        </div>
      )}

      {/* Sacral Base Angle (lumbar lateral) */}
      {measurements.sacralBaseAngle && (
        <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200">
          <div className="flex items-center justify-between">
            <span className="text-neutral-500 text-sm">Sacral Base Angle (Ferguson&apos;s)</span>
            <SeverityBadge severity={measurements.sacralBaseAngle.severity} size="sm" />
          </div>
          <span className="text-neutral-900 font-semibold">
            {measurements.sacralBaseAngle.measured.toFixed(1)}°
          </span>
          <span className="text-neutral-400 text-xs ml-2">
            ideal: {measurements.sacralBaseAngle.ideal}°
          </span>
        </div>
      )}

      {/* Pelvic Unleveling (AP) */}
      {measurements.pelvicUnleveling && (
        <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200">
          <div className="flex items-center justify-between">
            <span className="text-neutral-500 text-sm">Pelvic Unleveling</span>
            <SeverityBadge severity={measurements.pelvicUnleveling.severity} size="sm" />
          </div>
          <span className="text-neutral-900 font-semibold">
            {measurements.pelvicUnleveling.pixels.toFixed(0)}px
            — {measurements.pelvicUnleveling.highSide} high
          </span>
        </div>
      )}

      {/* Sacral Base Unleveling (AP) */}
      {measurements.sacralBaseUnleveling && (
        <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200">
          <div className="flex items-center justify-between">
            <span className="text-neutral-500 text-sm">Sacral Base Unleveling</span>
            <SeverityBadge severity={measurements.sacralBaseUnleveling.severity} size="sm" />
          </div>
          <span className="text-neutral-900 font-semibold">
            {measurements.sacralBaseUnleveling.pixels.toFixed(0)}px
            — {measurements.sacralBaseUnleveling.highSide} high
          </span>
        </div>
      )}

      {/* Femur Head Height (AP) */}
      {measurements.femurHeadHeight && (
        <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200">
          <div className="flex items-center justify-between">
            <span className="text-neutral-500 text-sm">Femoral Head Height</span>
            <SeverityBadge severity={measurements.femurHeadHeight.severity} size="sm" />
          </div>
          <span className="text-neutral-900 font-semibold">
            {measurements.femurHeadHeight.pixels.toFixed(0)}px
            — {measurements.femurHeadHeight.highSide} high
          </span>
        </div>
      )}

      {/* Scoliosis Cobb Angle (AP) */}
      {measurements.cobbAngle && (
        <div
          className="p-4 rounded-lg border bg-white"
          style={{ borderColor: SEVERITY_COLOURS[measurements.cobbAngle.severity] + '60' }}
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-navy font-semibold">Scoliosis (Cobb)</h4>
            <SeverityBadge severity={measurements.cobbAngle.severity} />
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className="text-3xl font-bold"
              style={{ color: SEVERITY_COLOURS[measurements.cobbAngle.severity] }}
            >
              {measurements.cobbAngle.measured.toFixed(1)}°
            </span>
            <span className="text-neutral-500 text-sm">
              convex {measurements.cobbAngle.convexity}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
