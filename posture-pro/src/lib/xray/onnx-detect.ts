// ═══════════════════════════════════════════════════════════════
// SpineView — ONNX In-Browser Landmark Detection
//
// Runs a trained HRNet keypoint model directly in the browser
// using ONNX Runtime Web. No API calls, no server, fully private.
//
// Usage:
//   const result = await detectLandmarksONNX(imageDataUrl, viewType, dims);
// ═══════════════════════════════════════════════════════════════

import type { Point, ViewType, LandmarkMap } from './types';
import type { LandmarkStatusMap, AutoDetectResult } from './auto-detect';
import {
  CERVICAL_LATERAL_LANDMARKS,
  LUMBAR_LATERAL_LANDMARKS,
  LUMBAR_AP_LANDMARKS,
} from './constants';

// Model metadata (must match training config)
const MODEL_CONFIG = {
  cervical_lateral: {
    modelPath: '/models/spine_landmarks_cervical.onnx',
    inputSize: 384,
    heatmapSize: 96,
  },
  // Add lumbar models when trained:
  // lumbar_lateral: { ... },
  // lumbar_ap: { ... },
};

const IMAGENET_MEAN = [0.485, 0.456, 0.406];
const IMAGENET_STD = [0.229, 0.224, 0.225];

function getLandmarkSequence(viewType: ViewType) {
  switch (viewType) {
    case 'cervical_lateral': return CERVICAL_LATERAL_LANDMARKS;
    case 'lumbar_lateral': return LUMBAR_LATERAL_LANDMARKS;
    case 'lumbar_ap': return LUMBAR_AP_LANDMARKS;
  }
}

/**
 * Check if an ONNX model is available for this view type.
 */
export function hasONNXModel(viewType: ViewType): boolean {
  return viewType in MODEL_CONFIG;
}

/**
 * Preprocess image for model input: resize, normalise, convert to NCHW tensor.
 */
function preprocessImage(
  imageDataUrl: string,
  inputSize: number,
): Promise<Float32Array> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = inputSize;
      canvas.height = inputSize;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, inputSize, inputSize);

      const imageData = ctx.getImageData(0, 0, inputSize, inputSize);
      const { data } = imageData;

      // Convert to NCHW Float32Array with ImageNet normalisation
      const tensor = new Float32Array(3 * inputSize * inputSize);
      const channelSize = inputSize * inputSize;

      for (let i = 0; i < channelSize; i++) {
        const r = data[i * 4] / 255;
        const g = data[i * 4 + 1] / 255;
        const b = data[i * 4 + 2] / 255;

        tensor[i] = (r - IMAGENET_MEAN[0]) / IMAGENET_STD[0];                    // R channel
        tensor[channelSize + i] = (g - IMAGENET_MEAN[1]) / IMAGENET_STD[1];       // G channel
        tensor[2 * channelSize + i] = (b - IMAGENET_MEAN[2]) / IMAGENET_STD[2];   // B channel
      }

      resolve(tensor);
    };
    img.onerror = () => reject(new Error('Failed to load image for preprocessing'));
    img.src = imageDataUrl;
  });
}

/**
 * Extract keypoint coordinates from heatmaps using argmax.
 * Returns normalised [0,1] coordinates.
 */
function heatmapsToCoords(
  heatmaps: Float32Array,
  numKeypoints: number,
  heatmapSize: number,
): Array<{ x: number; y: number; confidence: number }> {
  const coords: Array<{ x: number; y: number; confidence: number }> = [];
  const mapSize = heatmapSize * heatmapSize;

  for (let k = 0; k < numKeypoints; k++) {
    const offset = k * mapSize;
    let maxVal = -Infinity;
    let maxIdx = 0;

    for (let i = 0; i < mapSize; i++) {
      if (heatmaps[offset + i] > maxVal) {
        maxVal = heatmaps[offset + i];
        maxIdx = i;
      }
    }

    const y = Math.floor(maxIdx / heatmapSize);
    const x = maxIdx % heatmapSize;

    coords.push({
      x: (x + 0.5) / heatmapSize,  // Centre of the cell
      y: (y + 0.5) / heatmapSize,
      confidence: Math.max(0, Math.min(1, maxVal)),
    });
  }

  return coords;
}

/**
 * Run ONNX landmark detection in the browser.
 * Falls back to null if the model isn't available.
 */
export async function detectLandmarksONNX(
  imageDataUrl: string,
  viewType: ViewType,
  imageDimensions: { w: number; h: number },
): Promise<AutoDetectResult | null> {
  const config = MODEL_CONFIG[viewType as keyof typeof MODEL_CONFIG];
  if (!config) return null;

  // Dynamic import of ONNX Runtime Web — must use variable to prevent
  // Next.js from statically analysing and bundling it server-side
  const ortModuleName = 'onnxruntime-web';
  const ort = await (Function('m', 'return import(m)')(ortModuleName) as Promise<typeof import('onnxruntime-web')>);

  // Load the model
  const session = await ort.InferenceSession.create(config.modelPath, {
    executionProviders: ['wasm'],
  });

  // Preprocess
  const inputTensor = await preprocessImage(imageDataUrl, config.inputSize);
  const feeds = {
    image: new ort.Tensor('float32', inputTensor, [1, 3, config.inputSize, config.inputSize]),
  };

  // Infer
  const results = await session.run(feeds);
  const heatmaps = results.heatmaps.data as Float32Array;

  // Decode coordinates
  const landmarks = getLandmarkSequence(viewType);
  const coords = heatmapsToCoords(heatmaps, landmarks.length, config.heatmapSize);

  // Build result
  const landmarkMap: LandmarkMap = {};
  const statuses: LandmarkStatusMap = {};
  const warnings: string[] = [];
  let totalConf = 0;

  for (let i = 0; i < landmarks.length; i++) {
    const id = landmarks[i].id;
    const { x, y, confidence } = coords[i];

    landmarkMap[id] = {
      x: Math.round(x * imageDimensions.w),
      y: Math.round(y * imageDimensions.h),
    };
    statuses[id] = 'draft';
    totalConf += confidence;

    if (confidence < 0.3) {
      warnings.push(`${id}: low confidence (${(confidence * 100).toFixed(0)}%) — review carefully`);
    }
  }

  return {
    landmarks: landmarkMap,
    statuses,
    confidence: totalConf / landmarks.length,
    warnings,
  };
}
