'use client';

import type { Patient, PostureSession } from '@/lib/models/patient';
import type { PostureAnalysis } from '@/lib/models/analysis';
import { patientFullName } from '@/lib/models/patient';
import { buildNarrative } from '@/lib/biomechanics/narrative';
import { computePostureIndex } from '@/lib/biomechanics/posture-index';
import { estimateHeadWeightKg } from '@/lib/biomechanics/cervical-load';
import { AnnotatedPhoto } from './AnnotatedPhoto';
import { ReportLetterhead } from './ReportLetterhead';
import { DownloadPdfButton } from './DownloadPdfButton';

export function PostureReport({
  patient,
  session,
  analysis,
  lateralImageUrl,
  apImageUrl,
}: {
  patient: Patient;
  session: PostureSession;
  analysis: PostureAnalysis;
  lateralImageUrl?: string;
  apImageUrl?: string;
}) {
  const neutralHeadKg = estimateHeadWeightKg(patient.weightKg);
  const narrative = buildNarrative(analysis, { neutralHeadWeightKg: neutralHeadKg });
  const index = computePostureIndex(analysis);
  const reportDate = new Date(session.date).toLocaleDateString('en-AU');

  return (
    <>
      {/* Page 1 — Summary */}
      <article className="report-page mx-auto max-w-[210mm] bg-white p-8 shadow-md print:p-6 print:shadow-none">
        <ReportLetterhead patientName={patientFullName(patient)} reportDate={reportDate} />

        <p className="mt-4 rounded border-l-4 border-lightblue bg-lightblue/5 py-2 pl-3 pr-2 text-sm leading-relaxed text-neutral-700">
          Good posture is simple and eloquent by design in form and function. The body is designed to
          have the head, rib cage, and pelvis balanced upon one another in both the front and side
          views. When posture deviates from this balanced position, the spine also deviates from a
          neutral, healthy position. Postural deviations have been associated with the development
          and progression of conditions including increased muscle activity, disc loading, back and
          neck symptoms, headaches, and shoulder and ankle discomfort.
        </p>

        {/* Anterior summary block */}
        <section className="mt-5">
          <div className="rounded-t bg-gradient-to-r from-navy to-midblue px-3 py-1.5 text-white">
            <h2 className="text-sm font-semibold tracking-wide">Posture viewed from the front</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 rounded-b border border-t-0 border-neutral-200 p-4">
            {/* Left: photo with plumb line */}
            <div>
              {apImageUrl ? (
                <AnnotatedPhoto
                  imageUrl={apImageUrl}
                  landmarks={session.apCapture?.landmarks ?? []}
                  view="ap"
                  thumbnail
                />
              ) : (
                <PlaceholderPhoto view="Anterior" />
              )}
            </div>
            {/* Right: findings */}
            <div className="flex flex-col justify-center gap-2">
              <FindingRow
                label="Head"
                valueMm={analysis.headLateralShiftMm}
                fallbackAngleDeg={analysis.headTiltDeg}
                axis="lateral"
              />
              <FindingRow
                label="Shoulders"
                valueMm={analysis.shoulderLateralShiftMm}
                axis="lateral"
              />
              <FindingRow
                label="Hips"
                valueMm={analysis.hipLateralShiftMm}
                axis="lateral"
              />
              <PostureIndexBox
                label="Posture Index — Front"
                shiftsCm={index.anterior.totalShiftsCm}
                tiltsDeg={index.anterior.totalTiltsDeg}
              />
            </div>
          </div>
        </section>

        {/* Lateral summary block */}
        <section className="mt-5">
          <div className="rounded-t bg-gradient-to-r from-navy to-midblue px-3 py-1.5 text-white">
            <h2 className="text-sm font-semibold tracking-wide">Posture viewed from the side</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 rounded-b border border-t-0 border-neutral-200 p-4">
            {/* Left: photo with plumb line */}
            <div>
              {lateralImageUrl ? (
                <AnnotatedPhoto
                  imageUrl={lateralImageUrl}
                  landmarks={session.lateralCapture?.landmarks ?? []}
                  view="lateral"
                  thumbnail
                />
              ) : (
                <PlaceholderPhoto view="Lateral" />
              )}
            </div>
            {/* Right: findings */}
            <div className="flex flex-col justify-center gap-2">
              {analysis.cervicalLoadKg !== undefined && (
                <EffectiveHeadWeightCallout
                  loadKg={analysis.cervicalLoadKg}
                  neutralKg={neutralHeadKg}
                />
              )}
              <FindingRow
                label="Shoulders"
                valueMm={getPlumbDevMm(analysis, 'acromionLat')}
                axis="sagittal"
              />
              <FindingRow
                label="Hips"
                valueMm={getPlumbDevMm(analysis, 'greaterTrochanter')}
                axis="sagittal"
              />
              <FindingRow
                label="Knees"
                valueMm={getPlumbDevMm(analysis, 'lateralKnee')}
                axis="sagittal"
              />
              <PostureIndexBox
                label="Posture Index — Side"
                shiftsCm={index.lateral.totalShiftsCm}
                tiltsDeg={index.lateral.totalTiltsDeg}
              />
            </div>
          </div>
        </section>

        <div className="mt-5 rounded border border-neutral-200 bg-neutral-50 px-3 py-2">
          <p className="text-xs leading-relaxed text-neutral-500">
            This posture evaluation indicates the postural patterns observed at the time of assessment.
            Structural deviations may contribute to symptoms or other health concerns over time. A
            thorough clinical evaluation with a chiropractor or other qualified health professional is
            recommended.
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-gold/30 pt-2">
          <img src="/logo-banora.png" alt="" className="h-5 w-auto opacity-40" />
          <span className="text-[9px] text-neutral-400">banorachiropractic.com.au</span>
        </div>
      </article>

      {/* Page 2 — Anterior full-size */}
      {apImageUrl && (
        <article className="report-page mx-auto mt-8 max-w-[210mm] bg-white p-8 shadow-md print:mt-0 print:break-before-page print:p-6 print:shadow-none">
          <ReportLetterhead patientName={patientFullName(patient)} reportDate={reportDate} />
          <h2 className="mt-4 text-center text-2xl font-semibold text-navy">Anterior View</h2>
          <div className="mt-3 overflow-hidden rounded border-2 border-lightblue/40">
            <AnnotatedPhoto
              imageUrl={apImageUrl}
              landmarks={session.apCapture?.landmarks ?? []}
              view="ap"
            />
          </div>
        </article>
      )}

      {/* Page 3 — Lateral full-size */}
      {lateralImageUrl && (
        <article className="report-page mx-auto mt-8 max-w-[210mm] bg-white p-8 shadow-md print:mt-0 print:break-before-page print:p-6 print:shadow-none">
          <ReportLetterhead patientName={patientFullName(patient)} reportDate={reportDate} />
          <h2 className="mt-4 text-center text-2xl font-semibold text-navy">Lateral View</h2>
          <div className="mt-3 overflow-hidden rounded border-2 border-lightblue/40">
            <AnnotatedPhoto
              imageUrl={lateralImageUrl}
              landmarks={session.lateralCapture?.landmarks ?? []}
              view="lateral"
            />
          </div>
        </article>
      )}

      {/* Actions — hidden when printing */}
      <div className="mx-auto mt-6 flex max-w-[210mm] justify-end gap-3 print:hidden">
        <DownloadPdfButton
          filename={`posture-report-${patientFullName(patient).replace(/\s+/g, '-').toLowerCase()}.pdf`}
        />
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-md bg-gradient-to-r from-navy to-midblue px-5 py-2 text-sm font-medium text-white shadow hover:from-midblue hover:to-navy"
        >
          Print
        </button>
      </div>
    </>
  );
}

// ─── Small subcomponents ─────────────────────────────────────────────

function PostureIndexBox({
  label,
  shiftsCm,
  tiltsDeg,
}: {
  label: string;
  shiftsCm: number;
  tiltsDeg: number;
}) {
  return (
    <div className="mt-3 overflow-hidden rounded border border-neutral-200 text-xs">
      <div className="bg-gradient-to-r from-navy/10 to-lightblue/10 px-2 py-1 font-semibold text-navy">{label}</div>
      <div className="flex justify-between border-t border-neutral-100 px-2 py-1">
        <span className="text-neutral-600">Total Shifts</span>
        <span className="font-mono font-medium text-navy">{shiftsCm.toFixed(2)} cm</span>
      </div>
      <div className="flex justify-between border-t border-neutral-100 px-2 py-1">
        <span className="text-neutral-600">Total Tilts</span>
        <span className="font-mono font-medium text-navy">{tiltsDeg.toFixed(1)}°</span>
      </div>
    </div>
  );
}

function EffectiveHeadWeightCallout({ loadKg, neutralKg }: { loadKg: number; neutralKg: number }) {
  return (
    <div className="rounded bg-gradient-to-br from-navy to-midblue px-3 py-3 text-white shadow-sm">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-gold">
        Head Weight
      </span>
      <div className="mt-1.5 flex flex-col gap-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-xs opacity-70">Should be</span>
          <span className="font-mono text-base font-semibold">
            {neutralKg.toFixed(1)}<span className="ml-0.5 text-xs font-normal opacity-70"> kg</span>
          </span>
        </div>
        <div className="flex items-baseline justify-between gap-2 border-t border-white/20 pt-1">
          <span className="text-xs text-gold">With FHP</span>
          <span className="font-mono text-xl font-bold text-gold">
            {loadKg.toFixed(1)}<span className="ml-0.5 text-xs font-normal opacity-80"> kg</span>
          </span>
        </div>
      </div>
    </div>
  );
}

/** Returns the horizontal offset (mm) for a named lateral landmark, or undefined if absent/zero. */
function getPlumbDevMm(analysis: PostureAnalysis, landmarkId: string): number | undefined {
  const dev = analysis.plumbLineDeviations.find((d) => d.landmark === landmarkId);
  if (!dev || dev.horizontalOffsetMm === 0) return undefined;
  return dev.horizontalOffsetMm;
}

/**
 * A single finding row showing e.g. "Head — 2.14 cm right".
 * axis="lateral"  → directions are "left" / "right"
 * axis="sagittal" → directions are "forward" / "backward"
 */
function FindingRow({
  label,
  valueMm,
  fallbackAngleDeg,
  axis,
}: {
  label: string;
  valueMm?: number;
  fallbackAngleDeg?: number;
  axis: 'lateral' | 'sagittal';
}) {
  let valueText: string;
  let dirText: string;

  if (valueMm !== undefined) {
    const cm = Math.abs(valueMm / 10).toFixed(2);
    if (axis === 'lateral') {
      dirText = valueMm > 0 ? 'right' : 'left';
    } else {
      dirText = valueMm > 0 ? 'forward' : 'backward';
    }
    valueText = `${cm} cm`;
  } else if (fallbackAngleDeg !== undefined) {
    dirText = fallbackAngleDeg > 0 ? 'right' : 'left';
    valueText = `${Math.abs(fallbackAngleDeg).toFixed(1)}°`;
  } else {
    return null;
  }

  return (
    <div className="rounded border border-neutral-100 bg-neutral-50 px-3 py-2">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">{label}</div>
      <div className="mt-0.5 text-sm font-medium text-navy">
        {valueText}{' '}
        <span className="font-semibold text-midblue">{dirText}</span>
      </div>
    </div>
  );
}

function PlaceholderPhoto({ view }: { view: string }) {
  return (
    <div className="flex h-48 items-center justify-center rounded border-2 border-dashed border-neutral-200 bg-neutral-50 text-xs text-neutral-400">
      {view} photo not yet captured
    </div>
  );
}
