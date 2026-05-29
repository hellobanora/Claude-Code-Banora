'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePatientStore } from '@/lib/storage/use-patient-store';
import { patientFullName } from '@/lib/models/patient';
import { NewPatientForm } from './NewPatientForm';

export function PatientListView() {
  const { patients, isLoading, reload } = usePatientStore();
  const [search, setSearch] = useState('');
  const [showingNew, setShowingNew] = useState(false);

  const filtered = patients.filter((p) =>
    patientFullName(p).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search patients"
          className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-navy focus:outline-none"
        />
        <button
          type="button"
          onClick={() => setShowingNew(true)}
          className="rounded-md bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-midblue"
        >
          + New patient
        </button>
      </div>

      {isLoading ? (
        <p className="text-sm text-neutral-500">Loading…</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-neutral-500">
          {patients.length === 0
            ? 'No patients yet. Add one to begin a posture assessment.'
            : 'No patients match that search.'}
        </p>
      ) : (
        <ul className="divide-y divide-neutral-200 rounded-md border border-neutral-200 bg-white">
          {filtered.map((p) => (
            <li key={p.id}>
              <Link
                href={`/patient/${p.id}`}
                className="flex items-center justify-between p-4 hover:bg-neutral-50"
              >
                <div>
                  <div className="font-medium">{patientFullName(p)}</div>
                  <div className="text-xs text-neutral-500">
                    {p.sessions.length} session{p.sessions.length === 1 ? '' : 's'}
                  </div>
                </div>
                <span className="text-neutral-400">→</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {showingNew && <NewPatientForm onClose={() => { setShowingNew(false); void reload(); }} />}
    </div>
  );
}
