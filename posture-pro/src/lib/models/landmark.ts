/**
 * Every anatomical landmark we can place. Add new ones to this union — never use
 * raw strings elsewhere in the code.
 */
export type LandmarkID =
  // Lateral — head & neck
  | 'tragus'
  // Lateral — shoulder & thorax
  | 'acromionLat'
  // Lateral — pelvis & lower limb
  | 'greaterTrochanter'
  | 'lateralKnee'
  | 'lateralMalleolus'
  // AP — head & neck
  | 'eyeOuterL'
  | 'eyeOuterR'
  // AP — shoulder
  | 'acromionL'
  | 'acromionR'
  | 'suprasternalNotch'
  // AP — pelvis
  | 'iliacCrestL'
  | 'iliacCrestR'
  | 'asisL'
  | 'asisR'
  // AP — knee & ankle
  | 'kneeCentreL'
  | 'kneeCentreR'
  | 'ankleCentreL'
  | 'ankleCentreR';

export type PostureView = 'lateral' | 'ap';

/** Which photo view does this landmark belong on? */
export const LANDMARK_VIEW: Record<LandmarkID, PostureView> = {
  tragus: 'lateral',
  acromionLat: 'lateral',
  greaterTrochanter: 'lateral',
  lateralKnee: 'lateral',
  lateralMalleolus: 'lateral',
  eyeOuterL: 'ap',
  eyeOuterR: 'ap',
  acromionL: 'ap',
  acromionR: 'ap',
  suprasternalNotch: 'ap',
  iliacCrestL: 'ap',
  iliacCrestR: 'ap',
  asisL: 'ap',
  asisR: 'ap',
  kneeCentreL: 'ap',
  kneeCentreR: 'ap',
  ankleCentreL: 'ap',
  ankleCentreR: 'ap',
};

export const LANDMARK_LABEL: Record<LandmarkID, string> = {
  tragus: 'Tragus',
  acromionLat: 'Acromion (lat)',
  greaterTrochanter: 'Greater trochanter',
  lateralKnee: 'Lateral knee',
  lateralMalleolus: 'Lateral malleolus',
  eyeOuterL: 'Left eye (outer)',
  eyeOuterR: 'Right eye (outer)',
  acromionL: 'Left acromion',
  acromionR: 'Right acromion',
  suprasternalNotch: 'Suprasternal notch',
  iliacCrestL: 'Left iliac crest',
  iliacCrestR: 'Right iliac crest',
  asisL: 'Left ASIS',
  asisR: 'Right ASIS',
  kneeCentreL: 'Left knee centre',
  kneeCentreR: 'Right knee centre',
  ankleCentreL: 'Left ankle centre',
  ankleCentreR: 'Right ankle centre',
};

/** Point in normalised image coordinates. 0,0 = top-left, 1,1 = bottom-right. */
export interface NormalisedPoint {
  x: number;
  y: number;
}

export interface Landmark {
  id: LandmarkID;
  position: NormalisedPoint;
  /** 0.0–1.0. Manual placements default to 1.0; auto-detected may be lower. */
  confidence: number;
}

/** Helper to fetch a landmark by ID from an array. */
export function findLandmark(
  landmarks: Landmark[],
  id: LandmarkID
): Landmark | undefined {
  return landmarks.find((l) => l.id === id);
}
