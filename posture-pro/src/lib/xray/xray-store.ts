// ═══════════════════════════════════════════════════════════════
// SpineView — IndexedDB Storage for X-Ray Analyses
//
// Persists completed analyses on-device. Each analysis record
// stores landmarks, measurements, annotated snapshot, and
// metadata. Multiple analyses per patient (different views)
// are supported for combined reporting.
// ═══════════════════════════════════════════════════════════════

import { openDB, type IDBPDatabase } from 'idb';
import type { XrayAnalysis } from './types';

const DB_NAME = 'posture-pro-clinic';
const DB_VERSION = 3; // Bumped from 2 to add rom_assessments store (see rom-store.ts)
const STORE_NAME = 'xray_analyses';

async function getDB(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Original stores from v1
      if (!db.objectStoreNames.contains('patients')) {
        db.createObjectStore('patients', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('images')) {
        db.createObjectStore('images');
      }
      // New in v2
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('by_patient', 'patientId');
        store.createIndex('by_date', 'examDate');
      }
      // New in v3
      if (!db.objectStoreNames.contains('rom_assessments')) {
        const store = db.createObjectStore('rom_assessments', { keyPath: 'id' });
        store.createIndex('by_patient', 'patientId');
        store.createIndex('by_date', 'date');
      }
    },
  });
}

/** Save or update an x-ray analysis. */
export async function saveXrayAnalysis(analysis: XrayAnalysis): Promise<void> {
  const db = await getDB();
  await db.put(STORE_NAME, analysis);
}

/** Load a single analysis by ID. */
export async function loadXrayAnalysis(id: string): Promise<XrayAnalysis | undefined> {
  const db = await getDB();
  return (await db.get(STORE_NAME, id)) as XrayAnalysis | undefined;
}

/** Load all analyses for a patient, sorted newest-first. */
export async function loadPatientXrayAnalyses(patientId: string): Promise<XrayAnalysis[]> {
  const db = await getDB();
  const all = (await db.getAllFromIndex(STORE_NAME, 'by_patient', patientId)) as XrayAnalysis[];
  return all.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** Load all analyses, sorted newest-first. */
export async function loadAllXrayAnalyses(): Promise<XrayAnalysis[]> {
  const db = await getDB();
  const all = (await db.getAll(STORE_NAME)) as XrayAnalysis[];
  return all.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** Delete an analysis by ID. */
export async function deleteXrayAnalysis(id: string): Promise<void> {
  const db = await getDB();
  await db.delete(STORE_NAME, id);
}

/** Delete all analyses for a patient. */
export async function deletePatientXrayAnalyses(patientId: string): Promise<void> {
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
