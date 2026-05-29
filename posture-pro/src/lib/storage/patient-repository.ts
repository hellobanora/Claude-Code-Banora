import type { Patient } from '../models/patient';

/**
 * Abstracts where patient records live. The app talks to this interface only —
 * swap the implementation later for Vercel Postgres, Upstash, or IconPractice
 * without changing the rest of the code.
 */
export interface PatientRepository {
  loadAll(): Promise<Patient[]>;
  save(patient: Patient): Promise<void>;
  delete(id: string): Promise<void>;

  /** Returns the image key you should set on the PostureCapture. */
  saveImage(blob: Blob, patientId: string, filenameHint: string): Promise<string>;
  loadImage(key: string, patientId: string): Promise<Blob | undefined>;
}
