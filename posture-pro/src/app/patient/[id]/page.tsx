'use client';

import { usePatientStore } from '@/lib/storage/use-patient-store';
import { PatientDetailView } from '@/components/patients/PatientDetailView';

export default function PatientPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const store = usePatientStore();
  const patient = store.patient(id);

  if (store.isLoading) {
    return <main className="p-8 text-neutral-500">Loading…</main>;
  }
  if (!patient) {
    return <main className="p-8 text-neutral-500">Patient not found.</main>;
  }
  return (
    <main className="mx-auto max-w-6xl p-4 md:p-8">
      <PatientDetailView patient={patient} store={store} />
    </main>
  );
}
