'use client';

import type { PostureAnalysis } from '@/lib/models/analysis';
import { SEVERITY_COLOR } from '@/lib/models/analysis';
import {
  forwardHeadSeverity,
  headTiltSeverity,
  shoulderUnlevelingSeverity,
} from '@/lib/biomechanics/engine';
import { plainLanguageEquivalent } from '@/lib/biomechanics/cervical-load';

/** Live findings panel. Sits beside the editor or inside the report. */
export function FindingsPanel({ analysis }: { analysis: PostureAnalysis }) {
  return (
    <div className="space-y-5 rounded-lg bg-white p-4 shadow-sm">
      <Section title="Cervical">
        <Row
          label="Forward head angle"
          value={fmtDeg(analysis.forwardHeadAngleDeg)}
          severity={forwardHeadSeverity(analysis.forwardHeadAngleDeg)}
        />
        {analysis.cervicalLoadKg !== undefined && (
          <Row
            label="Effective load"
            value={`${analysis.cervicalLoadKg.toFixed(1)} kg`}
            note={plainLanguageEquivalent(analysis.cervicalLoadKg)}
          />
        )}
      </Section>

      <Section title="Shoulders">
        <Row label="Protraction (lat)" value={fmtDeg(analysis.shoulderProtractionDeg)} />
        <Row
          label="Unleveling (AP)"
          value={fmtMm(analysis.shoulderUnlevelingMm)}
          severity={shoulderUnlevelingSeverity(analysis.shoulderUnlevelingMm)}
        />
      </Section>

      <Section title="Pelvis">
        <Row label="Tilt (lat)" value={fmtDeg(analysis.pelvicTiltLateralDeg)} />
        <Row label="Unleveling (AP)" value={fmtMm(analysis.pelvicUnlevelingMm)} />
      </Section>

      <Section title="Lower limb">
        <Row label="Q angle — L" value={fmtDeg(analysis.qAngleLDeg)} />
        <Row label="Q angle — R" value={fmtDeg(analysis.qAngleRDeg)} />
      </Section>

      <Section title="Global">
        <Row
          label="Head tilt (AP)"
          value={fmtDeg(analysis.headTiltDeg)}
          severity={headTiltSeverity(analysis.headTiltDeg)}
        />
        <Row label="Lateral sway" value={fmtMm(analysis.lateralSwayMm)} />
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-xs font-bold uppercase tracking-wide text-neutral-500">
        {title}
      </div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function Row({
  label,
  value,
  severity,
  note,
}: {
  label: string;
  value?: string;
  severity?: ReturnType<typeof forwardHeadSeverity>;
  note?: string;
}) {
  const color = severity ? SEVERITY_COLOR[severity] : undefined;
  return (
    <div className="flex items-baseline justify-between gap-2 border-b border-neutral-100 py-1 last:border-b-0">
      <span className="text-sm text-neutral-700">{label}</span>
      <div className="text-right">
        <span className="font-mono text-sm font-medium" style={color ? { color } : undefined}>
          {value ?? '—'}
        </span>
        {note && <div className="text-xs text-neutral-500">{note}</div>}
      </div>
    </div>
  );
}

function fmtDeg(d?: number): string | undefined {
  return d === undefined ? undefined : `${d.toFixed(1)}°`;
}
function fmtMm(m?: number): string | undefined {
  return m === undefined ? undefined : `${m.toFixed(1)} mm`;
}
