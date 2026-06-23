'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePatientStore } from '@/lib/storage/use-patient-store';
import { patientFullName } from '@/lib/models/patient';
import { RomCaptureFlow } from '@/components/rom/RomCaptureFlow';
import { saveRomAssessment, saveRomVideo } from '@/lib/rom/rom-store';
import type { MovementResult, RomAssessment } from '@/lib/rom/types';

export default function RomCapturePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const store = usePatientStore();
  const patient = store.patient(id);

  const [clinicId, setClinicId] = useState<'banora' | 'palmbeach'>('banora');
  const [practitioner, setPractitioner] = useState('');
  const [started, setStarted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleComplete = useCallback(
    async (results: MovementResult[], videoBlobsByMovement: Map<string, Blob>) => {
      if (!patient) return;
      setSaving(true);
      setSaveError(null);

      try {
        // Persist each recorded clip so it can be reviewed later if needed.
        for (const [, blob] of videoBlobsByMovement) {
          await saveRomVideo(blob, patient.id, 'rom-clip');
        }

        const assessment: RomAssessment = {
          id: crypto.randomUUID(),
          patientId: patient.id,
          clinicId,
          practitioner: practitioner.trim() || 'Unspecified',
          date: new Date().toISOString(),
          results,
        };
        await saveRomAssessment(assessment);
        router.push(`/patient/${patient.id}/rom/${assessment.id}/results`);
      } catch (err) {
        setSaveError(err instanceof Error ? err.message : 'Failed to save assessment.');
        setSaving(false);
      }
    },
    [patient, clinicId, practitioner, router]
  );

  const handleCancel = useCallback(() => {
    router.push(`/patient/${id}`);
  }, [router, id]);

  if (store.isLoading) {
    return <main className="p-8 text-neutral-500">Loading…</main>;
  }
  if (!patient) {
    return <main className="p-8 text-neutral-500">Patient not found.</main>;
  }

  if (saving) {
    return (
      <main className="mx-auto max-w-2xl p-4 md:p-8">
        <div className="rounded-lg border border-neutral-200 bg-white p-8 text-center text-sm text-neutral-600">
          Saving assessment…
        </div>
      </main>
    );
  }

  if (!started) {
    return (
      <main className="mx-auto max-w-2xl space-y-4 p-4 md:p-8">
        <Link href={`/patient/${id}`} className="text-sm text-midblue hover:underline">
          ← Back to {patientFullName(patient)}
        </Link>
        <h1 className="text-2xl font-semibold text-navy">New ROM Assessment</h1>
        <p className="text-sm text-neutral-600">
          Six movements across three camera stages, ~5 minutes total. Position the patient and camera
          per the on-screen instructions before each recording.
        </p>

        {saveError && (
          <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">{saveError}</div>
        )}

        <div className="space-y-3 rounded-lg border border-neutral-200 bg-white p-4">
          <div>
            <label className="block text-sm font-medium text-navy">Practitioner</label>
            <input
              type="text"
              value={practitioner}
              onChange={(e) => setPractitioner(e.target.value)}
              placeholder="e.g. Dr James Shipway"
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy">Clinic</label>
            <div className="mt-1 flex gap-2">
              <button
                type="button"
                onClick={() => setClinicId('banora')}
                className={`flex-1 rounded-md px-3 py-2 text-sm font-medium ${clinicId === 'banora' ? 'bg-navy text-white' : 'border border-neutral-300 text-neutral-700'}`}
              >
                Banora
              </button>
              <button
                type="button"
                onClick={() => setClinicId('palmbeach')}
                className={`flex-1 rounded-md px-3 py-2 text-sm font-medium ${clinicId === 'palmbeach' ? 'bg-navy text-white' : 'border border-neutral-300 text-neutral-700'}`}
              >
                Palm Beach
              </button>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setStarted(true)}
          className="w-full rounded-md bg-gold px-4 py-3 text-sm font-semibold text-navy hover:bg-goldlight"
        >
          Start assessment
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl p-4 md:p-8">
      <RomCaptureFlow onComplete={handleComplete} onCancel={handleCancel} />
    </main>
  );
}
