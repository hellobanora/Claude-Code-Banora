'use client';

import type { Patient, PostureSession } from '@/lib/models/patient';
import type { PostureAnalysis } from '@/lib/models/analysis';
import { patientFullName } from '@/lib/models/patient';
import { runPostureAnalysis } from '@/lib/biomechanics/engine';
import { computePostureIndex } from '@/lib/biomechanics/posture-index';
import { ReportLetterhead } from './ReportLetterhead';

interface ComparisonReportProps {
  patient: Patient;
  sessionA: PostureSession;
  sessionB: PostureSession;
}

export function ComparisonReport({ patient, sessionA, sessionB }: ComparisonReportProps) {
  const analysisA = runPostureAnalysis(sessionA, patient);
  const analysisB = runPostureAnalysis(sessionB, patient);
  const indexA = computePostureIndex(analysisA);
  const indexB = computePostureIndex(analysisB);
  const dateA = new Date(sessionA.date).toLocaleDateString('en-AU');
  const dateB = new Date(sessionB.date).toLocaleDateString('en-AU');

  return (
    <article className="report-page mx-auto max-w-[210mm] bg-white p-8 shadow-md print:p-6 print:shadow-none">
      <ReportLetterhead
        patientName={patientFullName(patient)}
        reportDate={`${dateA} → ${dateB}`}
      />

      <div className="mt-4 rounded-sm bg-gradient-to-r from-navy to-midblue px-4 py-2 text-center text-white">
        <h2 className="text-sm font-semibold tracking-wide">Progress Comparison</h2>
      </div>

      <p className="mt-3 text-xs text-neutral-500">
        Comparing assessment from <strong>{dateA}</strong> (initial) to{' '}
        <strong>{dateB}</strong> (follow-up). Arrows indicate direction of change.
      </p>

      {/* Posture Index comparison */}
      <section className="mt-5">
        <SectionHeader title="Posture Index — Front View" />
        <ComparisonRow
          label="Total Shifts"
          valueA={indexA.anterior.totalShiftsCm}
          valueB={indexB.anterior.totalShiftsCm}
          unit="cm"
          decimals={2}
          lowerIsBetter
        />
        <ComparisonRow
          label="Total Tilts"
          valueA={indexA.anterior.totalTiltsDeg}
          valueB={indexB.anterior.totalTiltsDeg}
          unit="°"
          decimals={1}
          lowerIsBetter
        />
      </section>

      <section className="mt-4">
        <SectionHeader title="Posture Index — Side View" />
        <ComparisonRow
          label="Total Shifts"
          valueA={indexA.lateral.totalShiftsCm}
          valueB={indexB.lateral.totalShiftsCm}
          unit="cm"
          decimals={2}
          lowerIsBetter
        />
        <ComparisonRow
          label="Total Tilts"
          valueA={indexA.lateral.totalTiltsDeg}
          valueB={indexB.lateral.totalTiltsDeg}
          unit="°"
          decimals={1}
          lowerIsBetter
        />
      </section>

      {/* Detailed findings */}
      <section className="mt-5">
        <SectionHeader title="Cervical" />
        <ComparisonRow
          label="Forward head angle"
          valueA={analysisA.forwardHeadAngleDeg}
          valueB={analysisB.forwardHeadAngleDeg}
          unit="°"
          decimals={1}
          lowerIsBetter
        />
        <ComparisonRow
          label="Effective cervical load"
          valueA={analysisA.cervicalLoadKg}
          valueB={analysisB.cervicalLoadKg}
          unit="kg"
          decimals={1}
          lowerIsBetter
        />
      </section>

      <section className="mt-4">
        <SectionHeader title="Shoulders" />
        <ComparisonRow
          label="Protraction (lateral)"
          valueA={analysisA.shoulderProtractionDeg}
          valueB={analysisB.shoulderProtractionDeg}
          unit="°"
          decimals={1}
          lowerIsBetter
          useAbsolute
        />
        <ComparisonRow
          label="Unleveling (AP)"
          valueA={analysisA.shoulderUnlevelingMm}
          valueB={analysisB.shoulderUnlevelingMm}
          unit="mm"
          decimals={1}
          lowerIsBetter
          useAbsolute
        />
      </section>

      <section className="mt-4">
        <SectionHeader title="Pelvis" />
        <ComparisonRow
          label="Tilt (lateral)"
          valueA={analysisA.pelvicTiltLateralDeg}
          valueB={analysisB.pelvicTiltLateralDeg}
          unit="°"
          decimals={1}
          lowerIsBetter
          useAbsolute
        />
        <ComparisonRow
          label="Unleveling (AP)"
          valueA={analysisA.pelvicUnlevelingMm}
          valueB={analysisB.pelvicUnlevelingMm}
          unit="mm"
          decimals={1}
          lowerIsBetter
          useAbsolute
        />
      </section>

      <section className="mt-4">
        <SectionHeader title="Head & Global" />
        <ComparisonRow
          label="Head tilt (AP)"
          valueA={analysisA.headTiltDeg}
          valueB={analysisB.headTiltDeg}
          unit="°"
          decimals={1}
          lowerIsBetter
          useAbsolute
        />
        <ComparisonRow
          label="Lateral sway"
          valueA={analysisA.lateralSwayMm}
          valueB={analysisB.lateralSwayMm}
          unit="mm"
          decimals={1}
          lowerIsBetter
          useAbsolute
        />
      </section>

      {/* Summary */}
      <SummaryBox analysisA={analysisA} analysisB={analysisB} indexA={indexA} indexB={indexB} />

      <div className="mt-5 rounded border border-neutral-200 bg-neutral-50 px-3 py-2">
        <p className="text-xs leading-relaxed text-neutral-500">
          This comparison shows postural changes observed between two assessment dates. Changes may
          reflect natural variation, treatment effects, or differences in positioning. A clinical
          evaluation is recommended for interpretation.
        </p>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-gold/30 pt-2">
        <img src="/logo-banora.png" alt="" className="h-5 w-auto opacity-40" />
        <span className="text-[9px] text-neutral-400">banorachiropractic.com.au</span>
      </div>
    </article>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="rounded-t bg-gradient-to-r from-navy/10 to-lightblue/10 px-3 py-1.5">
      <h3 className="text-xs font-semibold tracking-wide text-navy">{title}</h3>
    </div>
  );
}

function ComparisonRow({
  label,
  valueA,
  valueB,
  unit,
  decimals,
  lowerIsBetter,
  useAbsolute = false,
}: {
  label: string;
  valueA?: number;
  valueB?: number;
  unit: string;
  decimals: number;
  lowerIsBetter: boolean;
  useAbsolute?: boolean;
}) {
  const a = valueA !== undefined ? (useAbsolute ? Math.abs(valueA) : valueA) : undefined;
  const b = valueB !== undefined ? (useAbsolute ? Math.abs(valueB) : valueB) : undefined;

  let changeIcon = '';
  let changeColor = 'text-neutral-400';
  let changeText = '';

  if (a !== undefined && b !== undefined) {
    const diff = b - a;
    const absDiff = Math.abs(diff);
    if (absDiff < 0.05) {
      changeIcon = '—';
      changeColor = 'text-neutral-400';
      changeText = 'No change';
    } else {
      const improved = lowerIsBetter ? diff < 0 : diff > 0;
      changeIcon = improved ? '▲' : '▼';
      changeColor = improved ? 'text-green-600' : 'text-red-500';
      changeText = `${improved ? 'Improved' : 'Worsened'} ${absDiff.toFixed(decimals)}${unit}`;
    }
  }

  return (
    <div className="flex items-center justify-between border-b border-neutral-100 px-3 py-2 last:border-b-0">
      <span className="text-sm text-neutral-700">{label}</span>
      <div className="flex items-center gap-4 text-right">
        <span className="w-20 font-mono text-xs text-neutral-500">
          {a !== undefined ? `${a.toFixed(decimals)}${unit}` : '—'}
        </span>
        <span className="text-neutral-300">→</span>
        <span className="w-20 font-mono text-xs font-medium text-navy">
          {b !== undefined ? `${b.toFixed(decimals)}${unit}` : '—'}
        </span>
        <span className={`w-32 text-right text-xs font-medium ${changeColor}`}>
          {changeIcon} {changeText}
        </span>
      </div>
    </div>
  );
}

function SummaryBox({
  analysisA: _aA,
  analysisB: _aB,
  indexA,
  indexB,
}: {
  analysisA: PostureAnalysis;
  analysisB: PostureAnalysis;
  indexA: ReturnType<typeof computePostureIndex>;
  indexB: ReturnType<typeof computePostureIndex>;
}) {
  const totalShiftsA = indexA.anterior.totalShiftsCm + indexA.lateral.totalShiftsCm;
  const totalShiftsB = indexB.anterior.totalShiftsCm + indexB.lateral.totalShiftsCm;
  const totalTiltsA = indexA.anterior.totalTiltsDeg + indexA.lateral.totalTiltsDeg;
  const totalTiltsB = indexB.anterior.totalTiltsDeg + indexB.lateral.totalTiltsDeg;

  const shiftsImproved = totalShiftsB < totalShiftsA;
  const tiltsImproved = totalTiltsB < totalTiltsA;
  const overallImproved = shiftsImproved && tiltsImproved;
  const overallMixed = shiftsImproved !== tiltsImproved;

  return (
    <div
      className={`mt-5 rounded-lg p-4 text-center ${
        overallImproved
          ? 'bg-green-50 text-green-800'
          : overallMixed
            ? 'bg-amber-50 text-amber-800'
            : 'bg-red-50 text-red-800'
      }`}
    >
      <div className="text-xs font-semibold uppercase tracking-widest opacity-70">
        Overall Trend
      </div>
      <div className="mt-1 text-lg font-bold">
        {overallImproved
          ? 'Posture Improved'
          : overallMixed
            ? 'Mixed Results'
            : 'Further Attention Recommended'}
      </div>
      <div className="mt-1 text-xs opacity-80">
        Shifts: {totalShiftsA.toFixed(2)} → {totalShiftsB.toFixed(2)} cm | Tilts:{' '}
        {totalTiltsA.toFixed(1)} → {totalTiltsB.toFixed(1)}°
      </div>
    </div>
  );
}
