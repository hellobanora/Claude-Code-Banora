'use client';

import type { Patient, PostureSession } from '@/lib/models/patient';
import type { PostureAnalysis } from '@/lib/models/analysis';
import { patientFullName } from '@/lib/models/patient';
import { buildNarrative } from '@/lib/biomechanics/narrative';
import { computePostureIndex } from '@/lib/biomechanics/posture-index';
import { estimateHeadWeightKg } from '@/lib/biomechanics/cervical-load';
import { NormalSilhouette } from './NormalSilhouette';
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
          <div className="grid grid-cols-[80px_1fr] gap-3 rounded-b border border-t-0 border-neutral-200 p-3">
            <div className="flex flex-col items-center">
              <span className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-500">Normal</span>
              <NormalSilhouette view="ap" />
            </div>
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
              {narrative.anteriorBullets.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {narrative.anteriorBullets.map((b, i) => (
                    <li key={i} className="flex gap-1.5 text-sm leading-snug text-neutral-800">
                      <span className="mt-0.5 text-gold">●</span>
                      {b}
                    </li>
                  ))}
                </ul>
              )}
              <PostureIndexBox
                label="Posture Index — Front View"
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
          <div className="grid grid-cols-[80px_1fr] gap-3 rounded-b border border-t-0 border-neutral-200 p-3">
            <div className="flex flex-col items-center">
              <span className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-500">Normal</span>
              <NormalSilhouette view="lateral" />
            </div>
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
              {narrative.lateralBullets.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {narrative.lateralBullets.map((b, i) => (
                    <li key={i} className="flex gap-1.5 text-sm leading-snug text-neutral-800">
                      <span className="mt-0.5 text-gold">●</span>
                      {b}
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-2 grid grid-cols-2 gap-2">
                <PostureIndexBox
                  label="Posture Index — Side View"
                  shiftsCm={index.lateral.totalShiftsCm}
                  tiltsDeg={index.lateral.totalTiltsDeg}
                />
                {analysis.cervicalLoadKg !== undefined && (
                  <EffectiveHeadWeightCallout loadKg={analysis.cervicalLoadKg} />
                )}
              </div>
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

function EffectiveHeadWeightCallout({ loadKg }: { loadKg: number }) {
  return (
    <div className="mt-3 flex flex-col items-center justify-center rounded bg-gradient-to-br from-navy to-midblue px-3 py-3 text-white shadow-sm">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-gold">
        Effective Head Weight
      </span>
      <span className="text-3xl font-bold leading-none">
        {loadKg.toFixed(1)}
        <span className="ml-1 text-sm font-normal opacity-80">kg</span>
      </span>
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
