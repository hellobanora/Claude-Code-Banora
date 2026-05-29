import type { Landmark, PostureView } from './landmark';

export type Sex = 'male' | 'female' | 'other' | 'unspecified';

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string; // ISO date
  heightCm?: number; // Used for moment-arm calculations and report scale
  weightKg?: number; // Used for load calculations on lower segments
  sex?: Sex;
  consentSigned: boolean;
  consentDate?: string; // ISO datetime
  notes: string;
  createdAt: string; // ISO datetime
  sessions: PostureSession[];
}

export interface PostureSession {
  id: string;
  date: string; // ISO datetime
  clinicianName: string;
  lateralCapture?: PostureCapture;
  apCapture?: PostureCapture;
  clinicianNotes: string;
}

export interface PostureCapture {
  id: string;
  view: PostureView;
  /** Key into the image blob store. Bytes live separately so the JSON record stays small. */
  imageKey: string;
  imageWidth: number;
  imageHeight: number;
  landmarks: Landmark[];
  capturedAt: string; // ISO datetime
}

export function patientFullName(p: Patient): string {
  return `${p.firstName} ${p.lastName}`.trim();
}

/** Create a new empty patient with sensible defaults. */
export function createPatient(input: {
  firstName: string;
  lastName: string;
  heightCm?: number;
  weightKg?: number;
  sex?: Sex;
}): Patient {
  return {
    id: crypto.randomUUID(),
    firstName: input.firstName,
    lastName: input.lastName,
    heightCm: input.heightCm,
    weightKg: input.weightKg,
    sex: input.sex,
    consentSigned: false,
    notes: '',
    createdAt: new Date().toISOString(),
    sessions: [],
  };
}
