'use client';

// ═══════════════════════════════════════════════════════════════
// SpineView — Combined Report Page (/xray/combined-report)
//
// Displays multiple x-ray analyses for the same patient in a
// single printable report. Loads analysis IDs from sessionStorage,
// fetches full records from IndexedDB.
// ═══════════════════════════════════════════════════════════════

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { XrayAnalysis } from '@/lib/xray/types';
import { loadXrayAnalysis } from '@/lib/xray/xray-store';
import {
  SEVERITY_COLOURS,
  SEVERITY_LABELS,
  CLINICS,
} from '@/lib/xray/constants';
import { SeverityBadge, ReferenceComparison } from '@/components/xray';

const VIEW_LABELS: Record<string, string> = {
  cervical_lateral: 'Cervical Lateral',
  lumbar_lateral: 'Lumbar Lateral',
  lumbar_ap: 'Lumbar AP / Pelvis',
};

export default function CombinedReportPage() {
  const router = useRouter();
  const [analyses, setAnalyses] = useState<XrayAnalysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = sessionStorage.getItem('spineview_combined');
    if (!raw) {
      router.push('/xray');
      return;
    }

    const ids = JSON.parse(raw) as string[];

    Promise.all(ids.map((id) => loadXrayAnalysis(id)))
      .then((results) => {
        const valid = results.filter((a): a is XrayAnalysis => a !== undefined);
        // Sort: cervical first, then lumbar lateral, then lumbar AP
        const order = ['cervical_lateral', 'lumbar_lateral', 'lumbar_ap'];
        valid.sort((a, b) => order.indexOf(a.viewType) - order.indexOf(b.viewType));
        setAnalyses(valid);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [router]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-neutral-500">Loading combined report...</div>
      </div>
    );
  }

  if (analyses.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center flex-col gap-4">
        <div className="text-neutral-500">No analyses found.</div>
        <button
          onClick={() => router.push('/xray')}
          className="text-navy hover:underline font-medium"
        >
          Back to SpineView
        </button>
      </div>
    );
  }

  const patientName = analyses[0].patientId.replace(/-/g, ' ');
  const clinic = CLINICS[analyses[0].clinicId] ?? CLINICS.banora;
  const examDate = analyses[0].examDate;

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Screen-only header */}
      <div className="print:hidden bg-navy border-b-2 border-goldlight px-6 py-3 flex items-center justify-between">
        <button
          onClick={() => router.push('/xray')}
          className="text-white/60 hover:text-white transition-colors text-sm"
        >
          &larr; Back
        </button>
        <h1 className="text-white font-semibold">
          <span className="text-goldlight">SpineView</span> Combined Report
        </h1>
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-goldlight text-navy font-bold rounded-lg hover:bg-gold transition-colors text-sm"
        >
          Print / Save PDF
        </button>
      </div>

      {/* ─── Printable Report ─────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8 print:px-0 print:py-0 print:max-w-none">

        {/* Cover / Summary Page */}
        <div className="report-page bg-white text-gray-900 rounded-xl p-8 print:rounded-none print:shadow-none print:break-after-page">
          {/* Clinic header */}
          <div className="border-b-2 border-[#1B3A5C] pb-4 mb-6">
            <h1 className="text-2xl font-bold text-[#1B3A5C]">{clinic.name}</h1>
            <p className="text-sm text-gray-500">
              {clinic.address} &middot; {clinic.phone}
            </p>
          </div>

          <h2 className="text-xl font-bold text-[#1B3A5C] mb-1">
            Spinal X-Ray Analysis Report
          </h2>
          <p className="text-gray-600 mb-6">
            Patient: <strong className="capitalize">{patientName}</strong>
            &nbsp;&middot;&nbsp;Exam: {new Date(examDate).toLocaleDateString('en-AU')}
          </p>

          <p className="text-sm text-gray-700 mb-8">
            This report presents findings from {analyses.length} x-ray view{analyses.length > 1 ? 's' : ''}.
            All measurements are objective and based on standard radiographic analysis methods.
            Results may vary between individuals and should be interpreted in clinical context.
          </p>

          {/* Summary cards for each view */}
          <div className="grid gap-4">
            {analyses.map((a) => {
              const headline =
                a.measurements.ara
                  ? `ARA: ${a.measurements.ara.measured.toFixed(1)}° (ideal: ${a.measurements.ara.ideal}°)`
                  : a.measurements.lumbarLordosis
                    ? `Lordosis: ${a.measurements.lumbarLordosis.measured.toFixed(1)}° (ideal: ${a.measurements.lumbarLordosis.ideal}°)`
                    : a.measurements.cobbAngle
                      ? `Cobb: ${a.measurements.cobbAngle.measured.toFixed(1)}°`
                      : 'Analysis complete';

              const severity =
                a.measurements.ara?.severity ??
                a.measurements.lumbarLordosis?.severity ??
                a.measurements.cobbAngle?.severity ??
                'normal';

              return (
                <div
                  key={a.id}
                  className="flex items-center gap-4 p-4 rounded-lg border"
                  style={{ borderColor: SEVERITY_COLOURS[severity] + '40' }}
                >
                  {a.annotatedImageDataUrl && (
                    <img
                      src={a.annotatedImageDataUrl}
                      alt={VIEW_LABELS[a.viewType]}
                      className="w-20 h-28 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#1B3A5C]">
                      {VIEW_LABELS[a.viewType] ?? a.viewType}
                    </h3>
                    <p className="text-sm text-gray-600">{headline}</p>
                    <p className="text-sm mt-1">
                      <span
                        className="inline-block px-2 py-0.5 rounded text-xs font-medium"
                        style={{
                          backgroundColor: SEVERITY_COLOURS[severity] + '20',
                          color: SEVERITY_COLOURS[severity],
                        }}
                      >
                        {SEVERITY_LABELS[severity]}
                      </span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── Detailed View Pages ─────────────────────────── */}
        {analyses.map((a) => (
          <div
            key={a.id}
            className="report-page bg-white text-gray-900 rounded-xl p-8 print:rounded-none print:shadow-none print:break-after-page"
          >
            <h2 className="text-lg font-bold text-[#1B3A5C] mb-4 border-b pb-2">
              {VIEW_LABELS[a.viewType] ?? a.viewType}
            </h2>

            {/* Patient vs. Normal comparison */}
            {a.annotatedImageDataUrl && (
              <div className="mb-6">
                <ReferenceComparison
                  patientImageUrl={a.annotatedImageDataUrl}
                  viewType={a.viewType}
                  patientLabel={patientName.replace(/-/g, ' ')}
                />
              </div>
            )}

            {/* Measurements table */}
            {a.measurements.segments.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-sm text-[#1B3A5C] mb-2">Segmental Angles</h3>
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="text-left px-3 py-2 font-medium">Segment</th>
                      <th className="text-right px-3 py-2 font-medium">Ideal</th>
                      <th className="text-right px-3 py-2 font-medium">Measured</th>
                      <th className="text-right px-3 py-2 font-medium">Deviation</th>
                      <th className="text-right px-3 py-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {a.measurements.segments.map((seg, i) => (
                      <tr key={seg.segment} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-3 py-1.5">{seg.segment}</td>
                        <td className="px-3 py-1.5 text-right text-gray-500">{seg.ideal}°</td>
                        <td className="px-3 py-1.5 text-right font-medium">
                          {seg.measured !== null ? `${seg.measured.toFixed(1)}°` : '—'}
                        </td>
                        <td className="px-3 py-1.5 text-right text-gray-500">
                          {seg.deviationPercent !== null ? `${seg.deviationPercent.toFixed(0)}%` : '—'}
                        </td>
                        <td className="px-3 py-1.5 text-right">
                          {seg.severity && (
                            <span
                              className="text-xs font-medium"
                              style={{ color: SEVERITY_COLOURS[seg.severity] }}
                            >
                              {SEVERITY_LABELS[seg.severity]}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Key findings */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              {a.measurements.ara && (
                <div className="p-3 rounded bg-gray-50">
                  <span className="text-gray-500 text-xs">ARA (C2-C7 Cobb)</span>
                  <p className="font-semibold" style={{ color: SEVERITY_COLOURS[a.measurements.ara.severity] }}>
                    {a.measurements.ara.measured.toFixed(1)}° ({a.measurements.ara.lossPercent.toFixed(0)}% loss)
                  </p>
                </div>
              )}
              {a.measurements.anteriorHeadCarriage && (
                <div className="p-3 rounded bg-gray-50">
                  <span className="text-gray-500 text-xs">Anterior Head Carriage</span>
                  <p className="font-semibold">{a.measurements.anteriorHeadCarriage.pixels.toFixed(0)}px</p>
                </div>
              )}
              {a.measurements.lumbarLordosis && (
                <div className="p-3 rounded bg-gray-50">
                  <span className="text-gray-500 text-xs">Lumbar Lordosis (L1-S1)</span>
                  <p className="font-semibold" style={{ color: SEVERITY_COLOURS[a.measurements.lumbarLordosis.severity] }}>
                    {a.measurements.lumbarLordosis.measured.toFixed(1)}° ({a.measurements.lumbarLordosis.lossPercent.toFixed(0)}% loss)
                  </p>
                </div>
              )}
              {a.measurements.sacralBaseAngle && (
                <div className="p-3 rounded bg-gray-50">
                  <span className="text-gray-500 text-xs">Sacral Base Angle</span>
                  <p className="font-semibold">{a.measurements.sacralBaseAngle.measured.toFixed(1)}°</p>
                </div>
              )}
              {a.measurements.pelvicUnleveling && (
                <div className="p-3 rounded bg-gray-50">
                  <span className="text-gray-500 text-xs">Pelvic Unleveling</span>
                  <p className="font-semibold">{a.measurements.pelvicUnleveling.pixels.toFixed(0)}px {a.measurements.pelvicUnleveling.highSide} high</p>
                </div>
              )}
              {a.measurements.cobbAngle && (
                <div className="p-3 rounded bg-gray-50">
                  <span className="text-gray-500 text-xs">Scoliosis (Cobb)</span>
                  <p className="font-semibold" style={{ color: SEVERITY_COLOURS[a.measurements.cobbAngle.severity] }}>
                    {a.measurements.cobbAngle.measured.toFixed(1)}° convex {a.measurements.cobbAngle.convexity}
                  </p>
                </div>
              )}
              {a.measurements.femurHeadHeight && (
                <div className="p-3 rounded bg-gray-50">
                  <span className="text-gray-500 text-xs">Femoral Head Height</span>
                  <p className="font-semibold">{a.measurements.femurHeadHeight.pixels.toFixed(0)}px {a.measurements.femurHeadHeight.highSide} high</p>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Disclaimer page */}
        <div className="report-page bg-white text-gray-900 rounded-xl p-8 print:rounded-none print:shadow-none">
          <h2 className="text-lg font-bold text-[#1B3A5C] mb-4">Important Information</h2>
          <div className="text-sm text-gray-600 space-y-3">
            <p>
              This report is a clinical assessment tool and is not a diagnostic device.
              All measurements are calculated from manually placed anatomical landmarks
              and may be subject to operator variability.
            </p>
            <p>
              Results should be interpreted in conjunction with clinical examination
              and patient history. Individual results may vary.
            </p>
            <p>
              Generated by SpineView X-Ray Analysis &middot; {clinic.name} &middot; {clinic.website}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
