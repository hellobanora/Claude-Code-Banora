'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePatientStore } from '@/lib/storage/use-patient-store';
import { ComparisonReport } from '@/components/report/ComparisonReport';

export default function ComparePage({ params }: { params: { id: string } }) {
  const store = usePatientStore();
  const patient = store.patient(params.id);
  const [sessionAId, setSessionAId] = useState<string>('');
  const [sessionBId, setSessionBId] = useState<string>('');

  if (store.isLoading) {
    return <main className="p-8 text-neutral-500">Loading…</main>;
  }
  if (!patient) {
    return <main className="p-8 text-neutral-500">Patient not found.</main>;
  }

  const completeSessions = patient.sessions.filter(
    (s) => s.lateralCapture && s.apCapture
  );

  if (completeSessions.length < 2) {
    return (
      <main className="mx-auto max-w-xl p-8">
        <Link href={`/patient/${patient.id}`} className="text-sm text-midblue hover:underline">
          ← Back to patient
        </Link>
        <div className="mt-6 rounded-lg border border-neutral-200 bg-white p-8 text-center">
          <h1 className="text-xl font-semibold text-navy">Compare Sessions</h1>
          <p className="mt-2 text-sm text-neutral-600">
            At least two completed sessions are needed for comparison.
            This patient has {completeSessions.length} completed session{completeSessions.length !== 1 ? 's' : ''}.
          </p>
          <Link
            href={`/patient/${patient.id}`}
            className="mt-4 inline-block rounded-md bg-navy px-4 py-2 text-sm text-white hover:bg-midblue"
          >
            Back to patient
          </Link>
        </div>
      </main>
    );
  }

  const sessionA = completeSessions.find((s) => s.id === sessionAId);
  const sessionB = completeSessions.find((s) => s.id === sessionBId);

  return (
    <main className="bg-neutral-100 py-6 print:bg-white print:py-0">
      {/* Session selector — hidden when printing */}
      <div className="mx-auto mb-6 max-w-[210mm] print:hidden">
        <Link href={`/patient/${patient.id}`} className="text-sm text-midblue hover:underline">
          ← Back to patient
        </Link>
        <h1 className="mt-3 text-2xl font-semibold text-navy">Compare Sessions</h1>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-600">
              Initial Assessment
            </label>
            <select
              value={sessionAId}
              onChange={(e) => setSessionAId(e.target.value)}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            >
              <option value="">Select session…</option>
              {completeSessions.map((s) => (
                <option key={s.id} value={s.id} disabled={s.id === sessionBId}>
                  {new Date(s.date).toLocaleString('en-AU')}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-600">
              Follow-up Assessment
            </label>
            <select
              value={sessionBId}
              onChange={(e) => setSessionBId(e.target.value)}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            >
              <option value="">Select session…</option>
              {completeSessions.map((s) => (
                <option key={s.id} value={s.id} disabled={s.id === sessionAId}>
                  {new Date(s.date).toLocaleString('en-AU')}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {sessionA && sessionB ? (
        <>
          <ComparisonReport patient={patient} sessionA={sessionA} sessionB={sessionB} />
          <div className="mx-auto mt-6 max-w-[210mm] text-right print:hidden">
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-md bg-gradient-to-r from-navy to-midblue px-5 py-2 text-sm font-medium text-white shadow hover:from-midblue hover:to-navy"
            >
              Print / Save as PDF
            </button>
          </div>
        </>
      ) : (
        <div className="mx-auto max-w-[210mm] rounded-lg border border-dashed border-neutral-300 bg-white p-12 text-center text-sm text-neutral-500">
          Select two sessions above to compare
        </div>
      )}
    </main>
  );
}
