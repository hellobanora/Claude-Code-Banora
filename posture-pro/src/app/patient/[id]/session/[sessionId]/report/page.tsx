'use client';

import { usePatientStore } from '@/lib/storage/use-patient-store';
import { useImageUrl } from '@/lib/storage/use-image-url';
import { runPostureAnalysis } from '@/lib/biomechanics/engine';
import { PostureReport } from '@/components/report/PostureReport';

export default function ReportPage({
  params,
}: {
  params: { id: string; sessionId: string };
}) {
  const { id, sessionId } = params;
  const store = usePatientStore();
  const patient = store.patient(id);
  const session = patient?.sessions.find((s) => s.id === sessionId);

  const lateralUrl = useImageUrl(id, session?.lateralCapture?.imageKey);
  const apUrl = useImageUrl(id, session?.apCapture?.imageKey);

  if (store.isLoading) {
    return <main className="p-8 text-neutral-500">Loading…</main>;
  }
  if (!patient || !session) {
    return <main className="p-8 text-neutral-500">Report not found.</main>;
  }

  const analysis = runPostureAnalysis(session, patient);

  return (
    <main className="bg-neutral-100 py-6 print:bg-white print:py-0">
      <PostureReport
        patient={patient}
        session={session}
        analysis={analysis}
        lateralImageUrl={lateralUrl}
        apImageUrl={apUrl}
      />
    </main>
  );
}
