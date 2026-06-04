/**
 * Maps MediaPipe PoseLandmarker results to our clinical landmark model.
 *
 * MediaPipe Pose provides 33 landmarks (BlazePose topology). We map the subset
 * that corresponds to our 20 clinical landmarks.
 *
 * Reference: https://ai.google.dev/edge/mediapipe/solutions/vision/pose_landmarker
 *
 * MediaPipe indices (BlazePose):
 *   0  nose               11 left_shoulder      23 left_hip
 *   1  left_eye_inner     12 right_shoulder     24 right_hip
 *   2  left_eye           13 left_elbow         25 left_knee
 *   3  left_eye_outer     14 right_elbow        26 right_knee
 *   4  right_eye_inner    15 left_wrist         27 left_ankle
 *   5  right_eye          16 right_wrist        28 right_ankle
 *   6  right_eye_outer    17 left_pinky         29 left_heel
 *   7  left_ear           18 right_pinky        30 right_heel
 *   8  right_ear          19 left_index         31 left_foot_index
 *   9  mouth_left         20 right_index        32 right_foot_index
 *   10 mouth_right        21 left_thumb
 *                         22 right_thumb
 */
import type { Landmark, LandmarkID, PostureView } from '../models/landmark';
import { LANDMARK_VIEW } from '../models/landmark';

interface MediaPipeLandmark {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

interface LateralMapping {
  landmarkId: LandmarkID;
  mpIndex: number | number[];
  /** When multiple indices, take the midpoint */
  midpoint?: boolean;
}

interface APMapping {
  landmarkId: LandmarkID;
  mpIndex: number | number[];
  midpoint?: boolean;
}

// Lateral view: patient standing side-on. We pick whichever side is visible.
// MediaPipe landmarks are bilateral — for lateral, we use the side facing camera.
// The caller tells us which side is visible (left or right body side).
const LATERAL_MAPPINGS_LEFT: LateralMapping[] = [
  { landmarkId: 'tragus', mpIndex: 7 },           // left_ear
  { landmarkId: 'acromionLat', mpIndex: 11 },      // left_shoulder
  { landmarkId: 'greaterTrochanter', mpIndex: 23 }, // left_hip (proxy)
  { landmarkId: 'lateralKnee', mpIndex: 25 },       // left_knee
  { landmarkId: 'lateralMalleolus', mpIndex: 27 },  // left_ankle
];

const LATERAL_MAPPINGS_RIGHT: LateralMapping[] = [
  { landmarkId: 'tragus', mpIndex: 8 },           // right_ear
  { landmarkId: 'acromionLat', mpIndex: 12 },      // right_shoulder
  { landmarkId: 'greaterTrochanter', mpIndex: 24 }, // right_hip
  { landmarkId: 'lateralKnee', mpIndex: 26 },       // right_knee
  { landmarkId: 'lateralMalleolus', mpIndex: 28 },  // right_ankle
];

const AP_MAPPINGS: APMapping[] = [
  { landmarkId: 'eyeOuterL', mpIndex: 3 },            // left_eye_outer
  { landmarkId: 'eyeOuterR', mpIndex: 6 },            // right_eye_outer
  { landmarkId: 'acromionL', mpIndex: 11 },            // left_shoulder
  { landmarkId: 'acromionR', mpIndex: 12 },            // right_shoulder
  { landmarkId: 'suprasternalNotch', mpIndex: [11, 12], midpoint: true }, // midpoint of shoulders, shifted up
  { landmarkId: 'iliacCrestL', mpIndex: 23 },          // left_hip
  { landmarkId: 'iliacCrestR', mpIndex: 24 },          // right_hip
  { landmarkId: 'asisL', mpIndex: 23 },                // left_hip (proxy)
  { landmarkId: 'asisR', mpIndex: 24 },                // right_hip (proxy)
  { landmarkId: 'kneeCentreL', mpIndex: 25 },          // left_knee
  { landmarkId: 'kneeCentreR', mpIndex: 26 },          // right_knee
  { landmarkId: 'ankleCentreL', mpIndex: 27 },         // left_ankle
  { landmarkId: 'ankleCentreR', mpIndex: 28 },         // right_ankle
];

function resolvePosition(
  mpLandmarks: MediaPipeLandmark[],
  mapping: { mpIndex: number | number[]; midpoint?: boolean }
): { x: number; y: number; visibility: number } | undefined {
  const indices = Array.isArray(mapping.mpIndex) ? mapping.mpIndex : [mapping.mpIndex];
  const points = indices.map((i) => mpLandmarks[i]).filter(Boolean);
  if (points.length === 0) return undefined;

  if (mapping.midpoint && points.length >= 2) {
    const x = points.reduce((s, p) => s + p.x, 0) / points.length;
    const y = points.reduce((s, p) => s + p.y, 0) / points.length;
    const vis = Math.min(...points.map((p) => p.visibility ?? 0));
    return { x, y, visibility: vis };
  }

  const p = points[0];
  return { x: p.x, y: p.y, visibility: p.visibility ?? 0 };
}

export type VisibleSide = 'left' | 'right';

/**
 * Guess which body side faces the camera in a lateral photo.
 * If the left shoulder is more visible and further from centre, left side faces camera.
 */
export function guessVisibleSide(mpLandmarks: MediaPipeLandmark[]): VisibleSide {
  const leftShoulder = mpLandmarks[11];
  const rightShoulder = mpLandmarks[12];
  if (!leftShoulder || !rightShoulder) return 'left';
  const leftVis = leftShoulder.visibility ?? 0;
  const rightVis = rightShoulder.visibility ?? 0;
  return leftVis >= rightVis ? 'left' : 'right';
}

export function mapMediaPipeToLandmarks(
  mpLandmarks: MediaPipeLandmark[],
  view: PostureView,
  visibleSide?: VisibleSide
): Landmark[] {
  if (!mpLandmarks || mpLandmarks.length < 33) return [];

  const results: Landmark[] = [];

  if (view === 'lateral') {
    const side = visibleSide ?? guessVisibleSide(mpLandmarks);
    const mappings = side === 'left' ? LATERAL_MAPPINGS_LEFT : LATERAL_MAPPINGS_RIGHT;

    // Track which landmark IDs we've already placed (hip is mapped 3 times)
    const placed = new Set<LandmarkID>();
    for (const mapping of mappings) {
      if (placed.has(mapping.landmarkId)) continue;
      const pos = resolvePosition(mpLandmarks, mapping);
      if (!pos) continue;
      let { x, y } = pos;
      if (mapping.landmarkId === 'greaterTrochanter') {
        // Greater trochanter sits slightly below and lateral to hip centre
        y += 0.01;
      }
      results.push({
        id: mapping.landmarkId,
        position: { x: clamp01(x), y: clamp01(y) },
        confidence: Math.max(0.1, Math.min(1.0, pos.visibility)),
      });
      placed.add(mapping.landmarkId);
    }
  } else {
    for (const mapping of AP_MAPPINGS) {
      const pos = resolvePosition(mpLandmarks, mapping);
      if (!pos) continue;
      let { x, y } = pos;
      // Suprasternal notch is above the shoulder midpoint
      if (mapping.landmarkId === 'suprasternalNotch') {
        y -= 0.02;
      }
      results.push({
        id: mapping.landmarkId,
        position: { x: clamp01(x), y: clamp01(y) },
        confidence: Math.max(0.1, Math.min(1.0, pos.visibility)),
      });
    }
  }

  return results;
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}
