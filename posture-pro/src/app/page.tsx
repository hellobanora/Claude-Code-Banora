'use client';

import Link from 'next/link';
import { PatientListView } from '@/components/patients/PatientListView';

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl p-4 md:p-8">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-navy">PostureProClinic</h1>
          <p className="text-sm text-neutral-600">
            In-clinic posture analysis · select a patient or add a new one
          </p>
        </div>
        <Link
          href="/xray"
          className="rounded-lg bg-[#1B3A5C] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#2C5F8A] transition-colors"
        >
          SpineView X-Ray Analysis
        </Link>
      </header>
      <PatientListView />
    </main>
  );
}
