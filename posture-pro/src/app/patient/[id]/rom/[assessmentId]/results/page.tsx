'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePatientStore } from '@/lib/storage/use-patient-store';
import { patientFullName } from '@/lib/models/patient';
import { loadRomAssessment } from '@/lib/rom/rom-store';
import { buildRomReportPdf } from '@/lib/rom/report';
import { RomTrafficLightBadge, RomTrafficLightDots } from '@/components/rom/RomTrafficLightBadge';
import type { RomAssessment } from '@/lib/rom/types';

export default function RomResultsPage({
  params,
}: {
  params: { id: string; assessmentId: string };
}) {
  const { id, assessmentId } = params;
  const store = usePatientStore();
  const patient = store.patient(id);

  const [assessment, setAssessment] = useState<RomAssessment | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRomAssessment(assessmentId)
      .then(setAssessment)
      .finally(() => setLoading(false));
  }, [assessmentId]);

  const handleDownloadPdf = useCallback(() => {
    if (!assessment || !patient) return;
    const doc = buildRomReportPdf(assessment, patientFullName(patient));
    doc.save(`ROM-Assessment-${patient.lastName}-${assessment.date.slice(0, 10)}.pdf`);
  }, [assessment, patient]);

  if (store.isLoading || loading) {
    return <main className="p-8 text-neutral-500">Loading…</main>;
  }
  if (!patient || !assessment) {
    return <main className="p-8 text-neutral-500">Assessment not found.</main>;
  }

  const anyRed = assessment.results.some((r) => r.trafficLight === 'red');
  const anyYellow = assessment.results.some((r) => r.trafficLight === 'yellow');
  const overall = anyRed ? 'red' : anyYellow ? 'yellow' : 'green';

  return (
    <main className="mx-auto max-w-3xl space-y-5 p-4 md:p-8">
      <Link href={`/patient/${id}`} className="text-sm text-midblue hover:underline">
        ← Back to {patientFullName(patient)}
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-navy">Range of Motion Results</h1>
          <p className="text-sm text-neutral-600">
            {new Date(assessment.date).toLocaleDateString('en-AU')} · {assessment.practitioner}
          </p>
        </div>
        <RomTrafficLightDots active={overall} />
      </div>

      <button
        type="button"
        onClick={handleDownloadPdf}
        className="rounded-md bg-gold px-4 py-2 text-sm font-semibold text-navy hover:bg-goldlight"
      >
        Download PDF report
      </button>

      <div className="space-y-2">
        {assessment.results.map((result, i) => (
          <RomTrafficLightBadge key={`${result.movement}-${result.side ?? ''}-${i}`} result={result} />
        ))}
      </div>

      <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-xs text-neutral-500">
        These measurements are a screening and progress-tracking tool, derived from video-based motion
        tracking, and do not constitute a diagnosis. Please discuss these findings with your practitioner.
      </div>
    </main>
  );
}
