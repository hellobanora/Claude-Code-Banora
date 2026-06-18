'use client';

// ═══════════════════════════════════════════════════════════════
// SpineView — Combined Report Page (/xray/combined-report)
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
import { ReferenceComparison } from '@/components/xray';

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
    if (!raw) { router.push('/xray'); return; }
    const ids = JSON.parse(raw) as string[];
    Promise.all(ids.map((id) => loadXrayAnalysis(id)))
      .then((results) => {
        const valid = results.filter((a): a is XrayAnalysis => a !== undefined);
        const order = ['cervical_lateral', 'lumbar_lateral', 'lumbar_ap'];
        valid.sort((a, b) => order.indexOf(a.viewType) - order.indexOf(b.viewType));
        setAnalyses(valid);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [router]);

  const handlePrint = useCallback(() => { window.print(); }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1B3A5C] flex items-center justify-center">
        <div className="text-white/60">Loading combined report…</div>
      </div>
    );
  }

  if (analyses.length === 0) {
    return (
      <div className="min-h-screen bg-[#1B3A5C] flex flex-col items-center justify-center gap-4">
        <div className="text-white/60">No analyses found.</div>
        <button onClick={() => router.push('/xray')} className="text-[#FFD232] hover:underline font-medium">
          Back to SpineView
        </button>
      </div>
    );
  }

  const patientName = analyses[0].patientId.replace(/-/g, ' ');
  const clinic = CLINICS[analyses[0].clinicId] ?? CLINICS.banora;
  const examDate = analyses[0].examDate;

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Screen-only toolbar */}
      <div className="print:hidden bg-[#1B3A5C] border-b-2 border-[#FFD232] px-6 py-3 flex items-center justify-between">
        <button
          onClick={() => router.push('/xray')}
          className="text-white/60 hover:text-white transition-colors text-sm"
        >
          ← Back
        </button>
        <h1 className="text-white font-semibold">
          <span className="text-[#FFD232]">SpineView</span> Combined Report
        </h1>
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-[#FFD232] text-[#1B3A5C] font-bold rounded-lg hover:bg-[#D4A017] transition-colors text-sm"
        >
          Print / Save PDF
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8 print:px-0 print:py-0 print:max-w-none">

        {/* ── Cover / Summary Page ── */}
        <article className="report-page bg-white rounded-xl shadow-md p-8 print:rounded-none print:shadow-none print:break-after-page">

          {/* Clinic letterhead */}
          <div className="flex items-start justify-between border-b-2 border-[#1B3A5C] pb-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-[#1B3A5C]">{clinic.name}</h1>
              <p className="text-sm text-neutral-500 mt-0.5">{clinic.address} · {clinic.phone}</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold uppercase tracking-widest text-[#FFD232] bg-[#1B3A5C] px-2 py-1 rounded">
                SpineView
              </span>
            </div>
          </div>

          <h2 className="text-xl font-bold text-[#1B3A5C]">Spinal X-Ray Analysis Report</h2>
          <p className="text-sm text-neutral-600 mt-1 mb-4">
            Patient: <strong className="capitalize text-[#1B3A5C]">{patientName}</strong>
            &nbsp;·&nbsp;
            Exam: {new Date(examDate).toLocaleDateString('en-AU')}
          </p>

          <p className="text-sm text-neutral-700 leading-relaxed rounded border-l-4 border-[#5B9EC9] bg-[#5B9EC9]/5 py-2 pl-3 pr-2 mb-8">
            This report presents findings from {analyses.length} x-ray view{analyses.length > 1 ? 's' : ''}.
            All measurements are objective and based on standard radiographic analysis methods.
            Results should be interpreted in clinical context.
          </p>

          {/* Summary cards */}
          <div className="grid gap-3">
            {analyses.map((a) => {
              const severity =
                a.measurements.ara?.severity ??
                a.measurements.lumbarLordosis?.severity ??
                a.measurements.cobbAngle?.severity ??
                'normal';
              const headline =
                a.measurements.ara
                  ? `ARA: ${a.measurements.ara.measured.toFixed(1)}° (ideal: ${a.measurements.ara.ideal}°)`
                  : a.measurements.lumbarLordosis
                    ? `Lordosis: ${a.measurements.lumbarLordosis.measured.toFixed(1)}° (ideal: ${a.measurements.lumbarLordosis.ideal}°)`
                    : a.measurements.cobbAngle
                      ? `Cobb: ${a.measurements.cobbAngle.measured.toFixed(1)}° convex ${a.measurements.cobbAngle.convexity}`
                      : 'Analysis complete';

              return (
                <div
                  key={a.id}
                  className="flex items-center gap-4 p-4 rounded-lg border-2"
                  style={{ borderColor: SEVERITY_COLOURS[severity] + '60' }}
                >
                  {a.annotatedImageDataUrl && (
                    <img
                      src={a.annotatedImageDataUrl}
                      alt={VIEW_LABELS[a.viewType]}
                      className="w-20 h-28 object-cover rounded border border-neutral-200"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-[#1B3A5C]">{VIEW_LABELS[a.viewType] ?? a.viewType}</h3>
                      <span
                        className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded"
                        style={{
                          backgroundColor: SEVERITY_COLOURS[severity] + '20',
                          color: SEVERITY_COLOURS[severity],
                        }}
                      >
                        {SEVERITY_LABELS[severity]}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-700">{headline}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </article>

        {/* ── Detailed View Pages ── */}
        {analyses.map((a) => (
          <article
            key={a.id}
            className="report-page bg-white rounded-xl shadow-md p-8 print:rounded-none print:shadow-none print:break-after-page"
          >
            {/* Section header — navy gradient like PostureReport */}
            <div className="rounded-t bg-gradient-to-r from-[#1B3A5C] to-[#2C5F8A] px-4 py-2 -mx-8 -mt-8 mb-6">
              <h2 className="text-white font-bold">{VIEW_LABELS[a.viewType] ?? a.viewType}</h2>
            </div>

            {/* Patient vs Normal comparison */}
            {a.annotatedImageDataUrl && (
              <div className="mb-6">
                <ReferenceComparison
                  patientImageUrl={a.annotatedImageDataUrl}
                  viewType={a.viewType}
                  patientLabel={patientName}
                />
              </div>
            )}

            {/* Key findings — navy/gold stat boxes */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {a.measurements.ara && (
                <StatBox
                  label="ARA (C2–C7 Cobb)"
                  value={`${a.measurements.ara.measured.toFixed(1)}°`}
                  sub={`${a.measurements.ara.lossPercent.toFixed(0)}% loss · ideal ${a.measurements.ara.ideal}°`}
                  severity={a.measurements.ara.severity}
                />
              )}
              {a.measurements.anteriorHeadCarriage && (
                <StatBox
                  label="Anterior Head Carriage"
                  value={`${a.measurements.anteriorHeadCarriage.pixels.toFixed(0)}px`}
                  sub="horizontal offset"
                />
              )}
              {a.measurements.lumbarLordosis && (
                <StatBox
                  label="Lumbar Lordosis (L1–S1)"
                  value={`${a.measurements.lumbarLordosis.measured.toFixed(1)}°`}
                  sub={`${a.measurements.lumbarLordosis.lossPercent.toFixed(0)}% loss · ideal ${a.measurements.lumbarLordosis.ideal}°`}
                  severity={a.measurements.lumbarLordosis.severity}
                />
              )}
              {a.measurements.sacralBaseAngle && (
                <StatBox
                  label="Sacral Base Angle"
                  value={`${a.measurements.sacralBaseAngle.measured.toFixed(1)}°`}
                  sub="Ferguson's angle"
                />
              )}
              {a.measurements.cobbAngle && (
                <StatBox
                  label="Scoliosis (Cobb)"
                  value={`${a.measurements.cobbAngle.measured.toFixed(1)}°`}
                  sub={`convex ${a.measurements.cobbAngle.convexity}`}
                  severity={a.measurements.cobbAngle.severity}
                />
              )}
              {a.measurements.pelvicUnleveling && (
                <StatBox
                  label="Pelvic Unleveling"
                  value={`${a.measurements.pelvicUnleveling.pixels.toFixed(0)}px`}
                  sub={`${a.measurements.pelvicUnleveling.highSide} side high`}
                  severity={a.measurements.pelvicUnleveling.severity}
                />
              )}
              {a.measurements.femurHeadHeight && (
                <StatBox
                  label="Femoral Head Height"
                  value={`${a.measurements.femurHeadHeight.pixels.toFixed(0)}px`}
                  sub={`${a.measurements.femurHeadHeight.highSide} side high`}
                  severity={a.measurements.femurHeadHeight.severity}
                />
              )}
            </div>

            {/* Segmental angles table */}
            {a.measurements.segments.length > 0 && (
              <div>
                <div className="bg-gradient-to-r from-[#1B3A5C] to-[#2C5F8A] px-3 py-1.5 rounded-t">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#FFD232]">
                    Segmental Angles
                  </span>
                </div>
                <table className="w-full text-sm border border-t-0 border-neutral-200 rounded-b overflow-hidden">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-200">
                      <th className="text-left px-3 py-2 font-semibold text-[#1B3A5C] text-xs">Segment</th>
                      <th className="text-right px-3 py-2 font-semibold text-[#1B3A5C] text-xs">Ideal</th>
                      <th className="text-right px-3 py-2 font-semibold text-[#1B3A5C] text-xs">Measured</th>
                      <th className="text-right px-3 py-2 font-semibold text-[#1B3A5C] text-xs">Deviation</th>
                      <th className="text-right px-3 py-2 font-semibold text-[#1B3A5C] text-xs">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {a.measurements.segments.map((seg, i) => (
                      <tr key={seg.segment} className={i % 2 === 0 ? 'bg-white' : 'bg-neutral-50/50'}>
                        <td className="px-3 py-1.5 font-medium text-[#1B3A5C]">{seg.segment}</td>
                        <td className="px-3 py-1.5 text-right text-neutral-400 text-xs">{seg.ideal}°</td>
                        <td className="px-3 py-1.5 text-right font-mono font-semibold text-[#1B3A5C]">
                          {seg.measured !== null ? `${seg.measured.toFixed(1)}°` : '—'}
                        </td>
                        <td className="px-3 py-1.5 text-right text-neutral-500 text-xs">
                          {seg.deviationPercent !== null ? `${seg.deviationPercent.toFixed(0)}%` : '—'}
                        </td>
                        <td className="px-3 py-1.5 text-right">
                          {seg.severity && (
                            <span
                              className="text-xs font-bold"
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
          </article>
        ))}

        {/* ── Disclaimer ── */}
        <article className="report-page bg-white rounded-xl shadow-md p-8 print:rounded-none print:shadow-none">
          <div className="rounded-t bg-gradient-to-r from-[#1B3A5C] to-[#2C5F8A] px-4 py-2 -mx-8 -mt-8 mb-6">
            <h2 className="text-white font-bold">Important Information</h2>
          </div>
          <div className="text-sm text-neutral-600 space-y-3 leading-relaxed">
            <p>
              This report is a clinical assessment tool and is not a diagnostic device.
              All measurements are calculated from manually placed anatomical landmarks
              and may be subject to operator variability.
            </p>
            <p>
              Results should be interpreted in conjunction with clinical examination
              and patient history. Individual results may vary.
            </p>
            <p className="text-xs text-neutral-400 border-t border-neutral-100 pt-3 mt-3">
              Generated by SpineView X-Ray Analysis · {clinic.name} · {clinic.website}
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}

// ── Navy/gold stat box matching PostureReport PostureIndexBox style ──
function StatBox({
  label,
  value,
  sub,
  severity,
}: {
  label: string;
  value: string;
  sub?: string;
  severity?: string;
}) {
  const severityColour = severity ? SEVERITY_COLOURS[severity as keyof typeof SEVERITY_COLOURS] : undefined;
  return (
    <div className="overflow-hidden rounded-lg shadow-md">
      <div className="bg-gradient-to-r from-[#1B3A5C] to-[#2C5F8A] px-3 py-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#FFD232]">{label}</span>
      </div>
      <div className="bg-gradient-to-br from-[#1B3A5C] to-[#2C5F8A] px-3 py-3">
        <div className="font-mono text-2xl font-bold leading-none"
          style={{ color: severityColour ?? '#FFD232' }}
        >
          {value}
        </div>
        {sub && <p className="text-[11px] text-white/60 mt-1">{sub}</p>}
      </div>
    </div>
  );
}
