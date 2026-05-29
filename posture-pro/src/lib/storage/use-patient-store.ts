'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Patient } from '../models/patient';
import type { PatientRepository } from './patient-repository';
import { IndexedDBPatientRepository } from './indexed-db-repository';

/**
 * Singleton repository instance for the browser session. Swap to a different
 * implementation by reassigning this — useful for tests or for adding a
 * cloud-backed repository later without touching consumers.
 */
let repoInstance: PatientRepository | undefined;

function getRepo(): PatientRepository {
  if (!repoInstance) repoInstance = new IndexedDBPatientRepository();
  return repoInstance;
}

interface StoreApi {
  patients: Patient[];
  isLoading: boolean;
  lastError: string | undefined;
  reload: () => Promise<void>;
  patient: (id: string) => Patient | undefined;
  upsert: (patient: Patient) => Promise<void>;
  remove: (id: string) => Promise<void>;
  saveImage: (blob: Blob, patientId: string, hint: string) => Promise<string | undefined>;
  loadImage: (key: string, patientId: string) => Promise<Blob | undefined>;
}

/**
 * React hook wrapping the patient repository. Components subscribe and re-render
 * when the in-memory cache changes. The cache is the source of truth at the UI
 * layer; writes are mirrored through the repository.
 */
export function usePatientStore(): StoreApi {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastError, setLastError] = useState<string | undefined>(undefined);
  const repo = useMemo(() => getRepo(), []);

  const reload = useCallback(async () => {
    setIsLoading(true);
    try {
      setPatients(await repo.loadAll());
      setLastError(undefined);
    } catch (err) {
      setLastError(err instanceof Error ? err.message : 'Unknown storage error');
    } finally {
      setIsLoading(false);
    }
  }, [repo]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const patient = useCallback(
    (id: string) => patients.find((p) => p.id === id),
    [patients]
  );

  const upsert = useCallback(
    async (next: Patient) => {
      try {
        await repo.save(next);
        setPatients((prev) => {
          const idx = prev.findIndex((p) => p.id === next.id);
          const updated = idx >= 0
            ? prev.map((p, i) => (i === idx ? next : p))
            : [...prev, next];
          return updated.sort((a, b) => a.lastName.localeCompare(b.lastName));
        });
      } catch (err) {
        setLastError(err instanceof Error ? err.message : 'Save failed');
      }
    },
    [repo]
  );

  const remove = useCallback(
    async (id: string) => {
      try {
        await repo.delete(id);
        setPatients((prev) => prev.filter((p) => p.id !== id));
      } catch (err) {
        setLastError(err instanceof Error ? err.message : 'Delete failed');
      }
    },
    [repo]
  );

  const saveImage = useCallback(
    async (blob: Blob, patientId: string, hint: string) => {
      try {
        return await repo.saveImage(blob, patientId, hint);
      } catch (err) {
        setLastError(err instanceof Error ? err.message : 'Image save failed');
        return undefined;
      }
    },
    [repo]
  );

  const loadImage = useCallback(
    (key: string, patientId: string) => repo.loadImage(key, patientId),
    [repo]
  );

  return { patients, isLoading, lastError, reload, patient, upsert, remove, saveImage, loadImage };
}
