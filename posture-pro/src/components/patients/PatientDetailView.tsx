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
import { plainLanguageEquivalent } from '@/lib/biomechanics/cervical-load';
import type { PostureAnalysis } from '@/lib/models/analysis';

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

  // Stable per-view callbacks passed to LandmarkWorkflow — stable references
  // prevent LandmarkEditor's useEffect from firing on every unrelated re-render.
  const onLateralChange = useCallback(
    (landmarks: Landmark[]) => handleLandmarksChange('lateral', landmarks),
    [handleLandmarksChange]
  );
  const onApChange = useCallback(
    (landmarks: Landmark[]) => handleLandmarksChange('ap', landmarks),
    [handleLandmarksChange]
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
          onLateralChange={onLateralChange}
          onApChange={onApChange}
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

  // Track live landmark positions in local state so the analysis updates
  // immediately as dots are dragged — without waiting for the IndexedDB
  // round-trip through the store.
  const [liveLateral, setLiveLateral] = useState<Landmark[]>(
    session.lateralCapture?.landmarks ?? []
  );
  const [liveAp, setLiveAp] = useState<Landmark[]>(
    session.apCapture?.landmarks ?? []
  );

  // Build a synthetic session from the live landmark state so
  // runPostureAnalysis always reflects the current dot positions.
  const liveSession: PostureSession = {
    ...session,
    lateralCapture: session.lateralCapture
      ? { ...session.lateralCapture, landmarks: liveLateral }
      : undefined,
    apCapture: session.apCapture
      ? { ...session.apCapture, landmarks: liveAp }
      : undefined,
  };
  const analysis = runPostureAnalysis(liveSession, patient);

  // Stable callbacks — won't cause LandmarkEditor's useEffect to re-fire
  // just because PatientDetailView re-rendered.
  const handleLateralChange = useCallback(
    (landmarks: Landmark[]) => {
      setLiveLateral(landmarks);
      onLateralChange(landmarks);
    },
    [onLateralChange]
  );

  const handleApChange = useCallback(
    (landmarks: Landmark[]) => {
      setLiveAp(landmarks);
      onApChange(landmarks);
    },
    [onApChange]
  );

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
          <>
            <LandmarkEditor
              capture={session.lateralCapture}
              patientId={patient.id}
              onLandmarksChange={handleLateralChange}
            />
            {/* Live key metrics — updates as dots are placed/dragged */}
            <LiveMetrics analysis={analysis} landmarks={liveLateral} />
          </>
        )}
        {activeTab === 'ap' && session.apCapture && (
          <LandmarkEditor
            capture={session.apCapture}
            patientId={patient.id}
            onLandmarksChange={handleApChange}
          />
        )}
        {activeTab === 'findings' && <FindingsPanel analysis={analysis} />}
      </div>
    </section>
  );
}

/**
 * DEBUG: shows raw landmark coords + calculated values so we can see
 * exactly what the engine is receiving. Remove once bug is confirmed fixed.
 */
function LiveMetrics({ analysis, landmarks }: { analysis: PostureAnalysis; landmarks: import('@/lib/models/landmark').Landmark[] }) {
  const tragus = landmarks.find(l => l.id === 'tragus');
  const acromion = landmarks.find(l => l.id === 'acromionLat');

  return (
    <div className="mt-3 rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs font-mono space-y-1">
      <div className="font-bold text-amber-800 text-sm">Debug — landmark state</div>
      <div>tragus: {tragus ? `x=${tragus.position.x.toFixed(3)} y=${tragus.position.y.toFixed(3)}` : 'NOT PLACED'}</div>
      <div>acromion: {acromion ? `x=${acromion.position.x.toFixed(3)} y=${acromion.position.y.toFixed(3)}` : 'NOT PLACED'}</div>
      <div>FHC angle: {analysis.forwardHeadAngleDeg !== undefined ? `${analysis.forwardHeadAngleDeg.toFixed(2)}°` : 'undefined'}</div>
      <div>Effective load: {analysis.cervicalLoadKg !== undefined ? `${analysis.cervicalLoadKg.toFixed(2)} kg` : 'undefined'}</div>
      <div>Total landmarks in state: {landmarks.length}</div>
    </div>
  );
}
