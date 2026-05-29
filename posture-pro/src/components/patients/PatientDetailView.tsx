'use client';

import Link from 'next/link';
import { useCallback, useState } from 'react';
import type { Patient, PostureCapture, PostureSession } from '@/lib/models/patient';
import type { Landmark } from '@/lib/models/landmark';
import { patientFullName } from '@/lib/models/patient';
import type { usePatientStore } from '@/lib/storage/use-patient-store';
import { CaptureFlow } from '@/components/capture/CaptureFlow';
import { LandmarkEditor } from '@/components/landmarks/LandmarkEditor';
import { FindingsPanel } from '@/components/analysis/FindingsPanel';
import { runPostureAnalysis } from '@/lib/biomechanics/engine';

type StoreApi = ReturnType<typeof usePatientStore>;
type ActivePhase = 'idle' | 'capture' | 'landmarks';

export function PatientDetailView({ patient, store }: { patient: Patient; store: StoreApi }) {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [phase, setPhase] = useState<ActivePhase>('idle');

  const activeSession = patient.sessions.find((s) => s.id === activeSessionId);

  const handleNewSession = useCallback(async () => {
    const session: PostureSession = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      clinicianName: '',
      clinicianNotes: '',
    };
    const updated: Patient = { ...patient, sessions: [...patient.sessions, session] };
    await store.upsert(updated);
    setActiveSessionId(session.id);
    setPhase('capture');
  }, [patient, store]);

  const handleCaptureComplete = useCallback(
    async (lateral: PostureCapture, ap: PostureCapture) => {
      const updated: Patient = {
        ...patient,
        sessions: patient.sessions.map((s) =>
          s.id === activeSessionId
            ? { ...s, lateralCapture: lateral, apCapture: ap }
            : s
        ),
      };
      await store.upsert(updated);
      setPhase('landmarks');
    },
    [patient, activeSessionId, store]
  );

  const handleLandmarksChange = useCallback(
    async (view: 'lateral' | 'ap', landmarks: Landmark[]) => {
      const updated: Patient = {
        ...patient,
        sessions: patient.sessions.map((s) => {
          if (s.id !== activeSessionId) return s;
          const captureKey = view === 'lateral' ? 'lateralCapture' : 'apCapture';
          const capture = s[captureKey];
          if (!capture) return s;
          return { ...s, [captureKey]: { ...capture, landmarks } };
        }),
      };
      await store.upsert(updated);
    },
    [patient, activeSessionId, store]
  );

  const handleResumeSession = useCallback(
    (sessionId: string) => {
      const s = patient.sessions.find((sess) => sess.id === sessionId);
      if (!s) return;
      setActiveSessionId(sessionId);
      if (!s.lateralCapture || !s.apCapture) {
        setPhase('capture');
      } else {
        setPhase('landmarks');
      }
    },
    [patient.sessions]
  );

  return (
    <div className="space-y-6">
      <Link href="/" className="text-sm text-midblue hover:underline">
        ← All patients
      </Link>

      <header>
        <h1 className="text-3xl font-semibold text-navy">{patientFullName(patient)}</h1>
        <p className="text-sm text-neutral-600">
          {patient.heightCm ? `${patient.heightCm} cm` : ''}
          {patient.weightKg ? ` · ${patient.weightKg} kg` : ''}
        </p>
        {!patient.consentSigned && (
          <p className="mt-2 inline-block rounded bg-amber-100 px-2 py-1 text-xs text-amber-800">
            ⚠ Patient consent not yet signed
          </p>
        )}
      </header>

      {/* Active session workflow */}
      {activeSessionId && phase === 'capture' && (
        <section className="rounded-lg border border-neutral-200 bg-white p-4">
          <CaptureFlow
            patient={patient}
            sessionId={activeSessionId}
            onCaptureComplete={handleCaptureComplete}
            saveImage={store.saveImage}
            upsertPatient={store.upsert}
          />
        </section>
      )}

      {activeSessionId && phase === 'landmarks' && activeSession && (
        <LandmarkWorkflow
          patient={patient}
          session={activeSession}
          onLateralChange={(lm) => handleLandmarksChange('lateral', lm)}
          onApChange={(lm) => handleLandmarksChange('ap', lm)}
        />
      )}

      {/* Sessions list */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Sessions</h2>
          <div className="flex gap-2">
            {patient.sessions.filter((s) => s.lateralCapture && s.apCapture).length >= 2 && (
              <Link
                href={`/patient/${patient.id}/compare`}
                className="rounded-md border border-midblue px-4 py-2 text-sm font-medium text-midblue hover:bg-midblue/5"
              >
                Compare sessions
              </Link>
            )}
            <button
              type="button"
              onClick={handleNewSession}
              className="rounded-md bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-midblue"
            >
              + New session
            </button>
          </div>
        </div>

        {patient.sessions.length === 0 ? (
          <p className="rounded-md border border-dashed border-neutral-300 p-8 text-center text-sm text-neutral-500">
            No sessions yet. Start a new posture assessment to capture lateral and AP photos.
          </p>
        ) : (
          <ul className="divide-y divide-neutral-200 rounded-md border border-neutral-200 bg-white">
            {patient.sessions.map((s) => (
              <li key={s.id} className="flex items-center justify-between p-4">
                <div>
                  <div className="font-medium">
                    {new Date(s.date).toLocaleString('en-AU')}
                  </div>
                  <div className="text-xs text-neutral-500">
                    {s.lateralCapture ? '✓ Lateral' : '· no lateral'} ·{' '}
                    {s.apCapture ? '✓ AP' : '· no AP'}
                    {s.lateralCapture && s.apCapture && (
                      <>
                        {' · '}
                        {s.lateralCapture.landmarks.length + s.apCapture.landmarks.length} landmarks
                      </>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleResumeSession(s.id)}
                    className="rounded px-3 py-1 text-xs text-midblue hover:bg-neutral-100"
                  >
                    {s.lateralCapture && s.apCapture ? 'Edit landmarks' : 'Continue'}
                  </button>
                  {s.lateralCapture && s.apCapture && (
                    <Link
                      href={`/patient/${patient.id}/session/${s.id}/report`}
                      className="rounded bg-gold px-3 py-1 text-xs font-medium text-navy hover:bg-goldlight"
                    >
                      View report
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function LandmarkWorkflow({
  patient,
  session,
  onLateralChange,
  onApChange,
}: {
  patient: Patient;
  session: PostureSession;
  onLateralChange: (landmarks: Landmark[]) => void;
  onApChange: (landmarks: Landmark[]) => void;
}) {
  const [activeTab, setActiveTab] = useState<'lateral' | 'ap' | 'findings'>('lateral');
  const analysis = runPostureAnalysis(session, patient);

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-navy">Place landmarks</h2>
        {session.lateralCapture && session.apCapture && (
          <Link
            href={`/patient/${patient.id}/session/${session.id}/report`}
            className="rounded-md bg-gold px-4 py-2 text-sm font-semibold text-navy hover:bg-goldlight"
          >
            View report →
          </Link>
        )}
      </div>

      <div className="flex gap-1 rounded-lg bg-neutral-100 p-1">
        {(['lateral', 'ap', 'findings'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition ${
              activeTab === tab
                ? 'bg-white text-navy shadow-sm'
                : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            {tab === 'lateral' ? 'Lateral' : tab === 'ap' ? 'Anterior' : 'Findings'}
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white p-4">
        {activeTab === 'lateral' && session.lateralCapture && (
          <LandmarkEditor
            capture={session.lateralCapture}
            patientId={patient.id}
            onLandmarksChange={onLateralChange}
          />
        )}
        {activeTab === 'ap' && session.apCapture && (
          <LandmarkEditor
            capture={session.apCapture}
            patientId={patient.id}
            onLandmarksChange={onApChange}
          />
        )}
        {activeTab === 'findings' && <FindingsPanel analysis={analysis} />}
      </div>
    </section>
  );
}
