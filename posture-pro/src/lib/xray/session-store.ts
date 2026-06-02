import type { ViewType, ClinicId } from './types';

export interface SpineViewSession {
  patientName: string;
  examDate: string;
  viewType: ViewType;
  clinicId: ClinicId;
  imageDataUrl: string;
}

let currentSession: SpineViewSession | null = null;

export function setSpineViewSession(session: SpineViewSession) {
  currentSession = session;
}

export function getSpineViewSession(): SpineViewSession | null {
  return currentSession;
}

export function clearSpineViewSession() {
  currentSession = null;
}
