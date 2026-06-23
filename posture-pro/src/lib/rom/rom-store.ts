// ═══════════════════════════════════════════════════════════════
// ROM Module — IndexedDB Storage for Range of Motion Assessments
//
// Mirrors the xray-store.ts pattern: assessments live in their own
// object store, keyed by id with a by_patient index for lookups.
// Recorded video blobs live in the shared 'images' blob store (it's
// just a generic Blob keyspace by `${patientId}/${key}`, despite the
// name) so no new blob store or schema migration is needed for video.
// ═══════════════════════════════════════════════════════════════

import { openDB, type IDBPDatabase } from 'idb';
import type { RomAssessment } from './types';

const DB_NAME = 'posture-pro-clinic';
const DB_VERSION = 3; // Bumped from 2 to add rom_assessments store
const STORE_NAME = 'rom_assessments';

async function getDB(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Stores from v1/v2
      if (!db.objectStoreNames.contains('patients')) {
        db.createObjectStore('patients', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('images')) {
        db.createObjectStore('images');
      }
      if (!db.objectStoreNames.contains('xray_analyses')) {
        const store = db.createObjectStore('xray_analyses', { keyPath: 'id' });
        store.createIndex('by_patient', 'patientId');
        store.createIndex('by_date', 'examDate');
      }
      // New in v3
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('by_patient', 'patientId');
        store.createIndex('by_date', 'date');
      }
    },
  });
}

/** Save or update a ROM assessment. */
export async function saveRomAssessment(assessment: RomAssessment): Promise<void> {
  const db = await getDB();
  await db.put(STORE_NAME, assessment);
}

/** Load a single assessment by ID. */
export async function loadRomAssessment(id: string): Promise<RomAssessment | undefined> {
  const db = await getDB();
  return (await db.get(STORE_NAME, id)) as RomAssessment | undefined;
}

/** Load all assessments for a patient, newest first. */
export async function loadPatientRomAssessments(patientId: string): Promise<RomAssessment[]> {
  const db = await getDB();
  const all = (await db.getAllFromIndex(STORE_NAME, 'by_patient', patientId)) as RomAssessment[];
  return all.sort((a, b) => b.date.localeCompare(a.date));
}

/** Delete an assessment by ID. */
export async function deleteRomAssessment(id: string): Promise<void> {
  const db = await getDB();
  await db.delete(STORE_NAME, id);
}

/** Delete all assessments for a patient (called when a patient is deleted). */
export async function deletePatientRomAssessments(patientId: string): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const index = tx.store.index('by_patient');
  let cursor = await index.openCursor(patientId);
  while (cursor) {
    await cursor.delete();
    cursor = await cursor.continue();
  }
  await tx.done;
}

/** Save a recorded movement video blob. Reuses the shared blob store. */
export async function saveRomVideo(blob: Blob, patientId: string, filenameHint: string): Promise<string> {
  const db = await getDB();
  const key = `${crypto.randomUUID()}_${filenameHint}`;
  await db.put('images', blob, `${patientId}/${key}`);
  return key;
}

/** Load a recorded movement video blob by key. */
export async function loadRomVideo(key: string, patientId: string): Promise<Blob | undefined> {
  const db = await getDB();
  return (await db.get('images', `${patientId}/${key}`)) as Blob | undefined;
}
