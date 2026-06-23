// src/lib/rom/pose-extraction.ts
//
// Turns a recorded movement video (Blob) into the PoseFrame[] sequence the
// ROM analysers expect. Runs MediaPipe Pose (BlazePose) client-side, in the
// browser — no video data leaves the device.
//
// Approach: "record then analyse" rather than true real-time streaming.
// We seek a hidden <video> element through the clip at a fixed sample rate
// and run PoseLandmarker.detect() on each frame. This is simpler and more
// robust than threading video timestamps through detectForVideo(), and is
// fine for this workflow since the capture UI already records a complete
// 10-15s clip per movement (per Section 9 of the ROM spec) before analysis
// runs — there's no requirement for a live numeric readout during capture,
// only the live skeleton overlay, which is handled separately in the
// capture UI via its own streaming PoseLandmarker instance.
//
// Landmark key mapping note: the analysers (sagittal.ts, lateralFlexion.ts,
// rotation.ts) only ever read named keys (e.g. "left_eye", "shoulder",
// "ear_tragus") from LandmarkFrame — they don't care whether the value
// came from MediaPipe Pose or Face Mesh. The current rom/constants.ts
// MEDIAPIPE_LANDMARK_INDEX table sources every required key from Pose's
// 33-point model already, which is enough to pass the delivered analyser
// tests. Face Mesh (mentioned in spec Section 2 for extra cervical
// precision) is not wired in this v1 — flagged as a follow-up, not a
// blocker, since no analyser currently requires it.

import { PoseLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import type { LandmarkFrame, PoseFrame, Region, CameraView } from './types';
import { MEDIAPIPE_LANDMARK_INDEX } from './constants';

let landmarkerInstance: PoseLandmarker | null = null;
let initPromise: Promise<PoseLandmarker> | null = null;

async function getOrCreateLandmarker(): Promise<PoseLandmarker> {
  if (landmarkerInstance) return landmarkerInstance;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const vision = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
    );
    const landmarker = await PoseLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/latest/pose_landmarker_full.task',
        delegate: 'GPU',
      },
      runningMode: 'IMAGE',
      numPoses: 1,
    });
    landmarkerInstance = landmarker;
    return landmarker;
  })();

  return initPromise;
}

/** Frames per second to sample the recorded clip at during analysis. */
const SAMPLE_FPS = 15;

export interface ExtractPoseFramesOptions {
  videoBlob: Blob;
  region: Region;
  cameraView: CameraView;
  /** Sagittal (side-on) movements only: which way the patient faces. */
  facingRight?: boolean;
  /** Override the default sample rate — lower for faster, less precise analysis. */
  sampleFps?: number;
}

/**
 * Extract a PoseFrame[] sequence from a recorded movement video.
 * Seeks through the clip at `sampleFps`, running pose detection on each
 * sampled frame, and maps MediaPipe's 33-point output onto the named
 * landmark keys each ROM analyser expects.
 */
export async function extractPoseFrames(opts: ExtractPoseFramesOptions): Promise<PoseFrame[]> {
  const { videoBlob, region, cameraView, facingRight = true, sampleFps = SAMPLE_FPS } = opts;

  const landmarker = await getOrCreateLandmarker();
  const video = await loadVideo(videoBlob);
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not create canvas context for pose extraction');

  const durationMs = video.duration * 1000;
  const stepMs = 1000 / sampleFps;
  const frames: PoseFrame[] = [];

  let frameIndex = 0;
  for (let t = 0; t < durationMs; t += stepMs) {
    await seekTo(video, t / 1000);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const result = landmarker.detect(canvas);
    if (!result.landmarks || result.landmarks.length === 0) {
      frameIndex++;
      continue; // no pose detected this frame — analysers tolerate gaps
    }

    const mpLandmarks = result.landmarks[0];
    const landmarks = mapToNamedLandmarks(mpLandmarks, region, cameraView, facingRight);

    frames.push({ frameIndex, timestampMs: t, landmarks });
    frameIndex++;
  }

  URL.revokeObjectURL(video.src);

  if (frames.length === 0) {
    throw new Error('No poses were detected in this recording. Check the patient is fully visible in frame.');
  }

  return frames;
}

function loadVideo(blob: Blob): Promise<HTMLVideoElement> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    video.src = URL.createObjectURL(blob);
    video.onloadedmetadata = () => resolve(video);
    video.onerror = () => reject(new Error('Failed to load recorded video for pose extraction'));
  });
}

function seekTo(video: HTMLVideoElement, timeSeconds: number): Promise<void> {
  return new Promise((resolve) => {
    const onSeeked = () => {
      video.removeEventListener('seeked', onSeeked);
      resolve();
    };
    video.addEventListener('seeked', onSeeked);
    video.currentTime = Math.min(timeSeconds, video.duration - 0.001);
  });
}

interface MpLandmark {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

/**
 * Maps MediaPipe Pose's 33-point output to the named keys each ROM
 * analyser reads from LandmarkFrame.
 *
 * - Sagittal (side-on) movements use generic keys ("shoulder", "ear_tragus",
 *   "hip") for whichever body side faces the camera — same "pick the
 *   visible side" approach as the existing posture lateral-photo mapper.
 * - Frontal movements use explicit left_/right_ keys since both sides
 *   are visible to the camera.
 */
function mapToNamedLandmarks(
  mp: MpLandmark[],
  region: Region,
  cameraView: CameraView,
  facingRight: boolean
): LandmarkFrame {
  const idx = MEDIAPIPE_LANDMARK_INDEX;
  const get = (i: number): MpLandmark | undefined => mp[i];

  const frame: LandmarkFrame = {};
  const set = (key: string, mpIndex: number) => {
    const lm = get(mpIndex);
    if (lm) frame[key] = { x: lm.x, y: lm.y, z: lm.z, visibility: lm.visibility };
  };

  if (cameraView === 'sagittal') {
    // Sagittal: only one body side is visible to the camera. facingRight
    // tells us which side of the BODY faces the camera lens, i.e. which
    // MediaPipe side landmarks to read — not the sign convention used by
    // angleFromVertical (that's handled inside the analyser itself).
    const earIdx = facingRight ? idx.right_ear : idx.left_ear;
    const shoulderIdx = facingRight ? idx.right_shoulder : idx.left_shoulder;
    const hipIdx = facingRight ? idx.right_hip : idx.left_hip;
    set('ear_tragus', earIdx);
    set('shoulder', shoulderIdx);
    set('hip', hipIdx);
  } else {
    // Frontal: both sides visible, use explicit left/right keys.
    set('nose', idx.nose);
    set('left_eye', idx.left_eye);
    set('right_eye', idx.right_eye);
    set('left_ear', idx.left_ear);
    set('right_ear', idx.right_ear);
    set('left_shoulder', idx.left_shoulder);
    set('right_shoulder', idx.right_shoulder);
    set('left_hip', idx.left_hip);
    set('right_hip', idx.right_hip);
  }

  // region is currently unused for landmark selection (both cervical and
  // lumbar movements draw from the same Pose keypoints), but kept as a
  // parameter since a future Face Mesh precision pass will likely need it
  // to decide whether to run the extra model.
  void region;

  return frame;
}
