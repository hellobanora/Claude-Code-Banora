'use client';

import { PatientListView } from '@/components/patients/PatientListView';

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl p-4 md:p-8">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold text-navy">PostureProClinic</h1>
        <p className="text-sm text-neutral-600">
          In-clinic posture analysis · select a patient or add a new one
        </p>
      </header>
      <PatientListView />
    </main>
  );
}
