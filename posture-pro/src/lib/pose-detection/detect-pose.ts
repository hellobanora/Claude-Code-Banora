/**
 * Runs MediaPipe PoseLandmarker on an image element and returns normalised landmarks.
 *
 * The model files are loaded from the CDN on first use (~5MB). After that they're
 * cached by the browser. Detection runs entirely client-side — no data leaves the device.
 */
import { PoseLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import type { PostureView } from '../models/landmark';
import type { Landmark } from '../models/landmark';
import { mapMediaPipeToLandmarks, guessVisibleSide } from './mediapipe-mapper';

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

export interface DetectPoseResult {
  landmarks: Landmark[];
  rawMediaPipe: Array<{ x: number; y: number; z: number; visibility?: number }>;
}

/**
 * Detect pose landmarks from an HTMLImageElement.
 * The image must already be loaded (naturalWidth > 0).
 */
export async function detectPose(
  image: HTMLImageElement,
  view: PostureView
): Promise<DetectPoseResult> {
  const landmarker = await getOrCreateLandmarker();
  const result = landmarker.detect(image);

  if (!result.landmarks || result.landmarks.length === 0) {
    return { landmarks: [], rawMediaPipe: [] };
  }

  // Use the first detected pose
  const mpLandmarks = result.landmarks[0];

  const mapped = mapMediaPipeToLandmarks(mpLandmarks, view);

  return {
    landmarks: mapped,
    rawMediaPipe: mpLandmarks,
  };
}

/**
 * Detect pose from an image blob (e.g. from IndexedDB).
 * Creates a temporary Image element, waits for load, then runs detection.
 */
export async function detectPoseFromBlob(
  blob: Blob,
  view: PostureView
): Promise<DetectPoseResult> {
  const url = URL.createObjectURL(blob);
  try {
    const img = await loadImage(url);
    return detectPose(img, view);
  } finally {
    URL.revokeObjectURL(url);
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image for pose detection'));
    img.src = src;
  });
}
