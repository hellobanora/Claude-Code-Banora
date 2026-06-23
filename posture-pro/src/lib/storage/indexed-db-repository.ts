import { openDB, type IDBPDatabase } from 'idb';
import type { Patient } from '../models/patient';
import type { PatientRepository } from './patient-repository';

/**
 * IndexedDB-backed storage. Patient records sit in one object store, image blobs
 * in another. Patient data stays on the device by default — no network round-trip,
 * no cloud account, and the browser sandboxes the database per origin.
 */
export class IndexedDBPatientRepository implements PatientRepository {
  private readonly dbName = 'posture-pro-clinic';
  private readonly version = 3;

  private async db(): Promise<IDBPDatabase> {
    return openDB(this.dbName, this.version, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('patients')) {
          db.createObjectStore('patients', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('images')) {
          db.createObjectStore('images'); // key = `${patientId}/${imageKey}`
        }
        // v2: x-ray analyses store (shared with xray-store.ts)
        if (!db.objectStoreNames.contains('xray_analyses')) {
          const store = db.createObjectStore('xray_analyses', { keyPath: 'id' });
          store.createIndex('by_patient', 'patientId');
          store.createIndex('by_date', 'examDate');
        }
        // v3: ROM assessments store (shared with rom-store.ts)
        if (!db.objectStoreNames.contains('rom_assessments')) {
          const store = db.createObjectStore('rom_assessments', { keyPath: 'id' });
          store.createIndex('by_patient', 'patientId');
          store.createIndex('by_date', 'date');
        }
      },
    });
  }

  async loadAll(): Promise<Patient[]> {
    const db = await this.db();
    const all = (await db.getAll('patients')) as Patient[];
    return all.sort((a, b) => a.lastName.localeCompare(b.lastName));
  }

  async save(patient: Patient): Promise<void> {
    const db = await this.db();
    await db.put('patients', patient);
  }

  async delete(id: string): Promise<void> {
    const db = await this.db();
    await db.delete('patients', id);

    // Also clear out any orphaned image blobs for this patient.
    const tx = db.transaction('images', 'readwrite');
    let cursor = await tx.store.openCursor();
    while (cursor) {
      if (typeof cursor.key === 'string' && cursor.key.startsWith(`${id}/`)) {
        await cursor.delete();
      }
      cursor = await cursor.continue();
    }
    await tx.done;
  }

  async saveImage(blob: Blob, patientId: string, filenameHint: string): Promise<string> {
    const db = await this.db();
    const key = `${crypto.randomUUID()}_${filenameHint}`;
    await db.put('images', blob, `${patientId}/${key}`);
    return key;
  }

  async loadImage(key: string, patientId: string): Promise<Blob | undefined> {
    const db = await this.db();
    return (await db.get('images', `${patientId}/${key}`)) as Blob | undefined;
  }
}
