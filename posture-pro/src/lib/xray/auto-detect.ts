// ═══════════════════════════════════════════════════════════════
// SpineView — AI Auto-Detect Landmarks
//
// Sends the X-ray image to Claude Vision API to automatically
// estimate anatomical landmark positions. Returns coordinates
// that the practitioner can review and adjust.
//
// Privacy: Only the image is sent. No patient name, DOB, or
// identifiable data leaves the browser.
// ═══════════════════════════════════════════════════════════════

import type { Point, ViewType, LandmarkMap, LandmarkDefinition } from './types';
import {
  CERVICAL_LATERAL_LANDMARKS,
  LUMBAR_LATERAL_LANDMARKS,
  LUMBAR_AP_LANDMARKS,
} from './constants';

/** Status of an individual auto-detected landmark */
export type LandmarkStatus = 'draft' | 'confirmed' | 'manual';

/** Map of landmark ID → status */
export type LandmarkStatusMap = Record<string, LandmarkStatus>;

/** Result from the auto-detect API call */
export interface AutoDetectResult {
  landmarks: LandmarkMap;
  statuses: LandmarkStatusMap;
  confidence: number; // 0–1 overall confidence
  warnings: string[];
}

// ─── Landmark Sequence by View ───────────────────────────────

function getLandmarkSequence(viewType: ViewType): LandmarkDefinition[] {
  switch (viewType) {
    case 'cervical_lateral':
      return CERVICAL_LATERAL_LANDMARKS;
    case 'lumbar_lateral':
      return LUMBAR_LATERAL_LANDMARKS;
    case 'lumbar_ap':
      return LUMBAR_AP_LANDMARKS;
  }
}

// ─── System Prompt ───────────────────────────────────────────

function buildSystemPrompt(viewType: ViewType, imageWidth: number, imageHeight: number): string {
  const landmarks = getLandmarkSequence(viewType);
  const landmarkList = landmarks
    .map((lm) => `  - "${lm.id}": ${lm.description}`)
    .join('\n');

  const viewLabel = viewType.replace(/_/g, ' ');

  return `You are a chiropractic X-ray analysis assistant. You are looking at a ${viewLabel} X-ray image.

Your task is to identify anatomical landmark positions on this X-ray. The image dimensions are ${imageWidth}×${imageHeight} pixels. You must return pixel coordinates (x, y) where (0,0) is the top-left corner.

LANDMARKS TO IDENTIFY:
${landmarkList}

ANATOMICAL GUIDANCE:
${viewType === 'cervical_lateral' ? CERVICAL_GUIDANCE : ''}
${viewType === 'lumbar_lateral' ? LUMBAR_LAT_GUIDANCE : ''}
${viewType === 'lumbar_ap' ? LUMBAR_AP_GUIDANCE : ''}

RESPONSE FORMAT:
Respond with ONLY a JSON object. No markdown, no backticks, no explanation.
The JSON must have this exact structure:
{
  "landmarks": {
    "<landmark_id>": { "x": <number>, "y": <number> },
    ...
  },
  "confidence": <number 0-1>,
  "warnings": ["<any issues or uncertainty>"]
}

RULES:
- Return coordinates for EVERY landmark in the list above
- All x values must be between 0 and ${imageWidth}
- All y values must be between 0 and ${imageHeight}
- BE PRECISE: place each point at the exact pixel where the bone corner or edge meets the disc space
- For posterior body corners: place the point where the posterior cortex of the vertebral body meets the endplate (disc space). Do NOT place on the spinous process or lamina — only the vertebral BODY posterior margin
- For anterior body corners: place the point where the anterior cortex meets the endplate
- Superior = top edge of the vertebral body, Inferior = bottom edge
- Vertebral body corners are where two cortical lines meet at a roughly 90° angle
- If you cannot identify a landmark clearly, estimate its most likely position and add a warning
- Confidence should reflect how clearly you can see the vertebral structures
- This is a LATERAL view — posterior is typically on the LEFT side of the image for cervical/lumbar laterals
- The image may be inverted (posterior on right) — adapt accordingly by looking at the natural curvature direction
- Take extra care with C1/C2: C1 posterior tubercle is the small bony bump at the back of the atlas ring, C2 body corners are on the axis body below the dens`;
}

const CERVICAL_GUIDANCE = `
For a cervical lateral X-ray:
- C1 (atlas) has a posterior arch but no traditional vertebral body — mark the posterior tubercle
- C2 (axis) has the odontoid process (dens) — mark the body corners, not the dens tip
- C2 through C7 each have 4 corners: superior-posterior, inferior-posterior, superior-anterior, inferior-anterior
- The posterior body line runs from superior-posterior to inferior-posterior corner
- Vertebral bodies are roughly rectangular, getting slightly larger from C3 to C7
- The posterior vertebral body line should form a smooth lordotic curve (concave posteriorly)
- T1 superior-posterior is the lowest posterior point needed
- Anterior points (C2_sup_ant, C2_inf_ant, C7_inf_ant) are on the front of the vertebral bodies
- The normal cervical spine has a lordotic (backward C-shaped) curve when viewed from the side
- Look for the disc spaces between vertebral bodies to identify individual levels`;

const LUMBAR_LAT_GUIDANCE = `
For a lumbar lateral X-ray:
- L1 through L5 vertebral bodies with superior-posterior and inferior-posterior corners
- Vertebral bodies get progressively larger from L1 to L5
- S1 sacral base: mark the superior-posterior and superior-anterior corners
- The normal lumbar spine has a lordotic (forward C-shaped) curve
- L1_sup_ant is the superior-anterior corner of L1 (front of the body)
- The sacral promontory (S1_sup_ant) is the anterior-superior corner of S1`;

const LUMBAR_AP_GUIDANCE = `
For a lumbar AP (anteroposterior) X-ray:
- Iliac crests: mark the highest point on each side (left and right)
- Femoral heads: mark the centre of each femoral head circle
- Sacral base: mark the left and right corners of the S1 superior endplate
- Spinous processes: mark the midline spinous process of L1 through L5
- Cobb angle endpoints: if scoliosis is visible, mark the most tilted vertebrae
  - If no significant scoliosis, place cobb markers at L1 (upper) and L5 (lower) endplate corners
- Left/Right is from the PATIENT's perspective (anatomical position), which is REVERSED on the X-ray
  - Patient's LEFT appears on the RIGHT side of the image
  - Patient's RIGHT appears on the LEFT side of the image`;

// ─── Image Resizing ─────────────────────────────────────────

const MAX_DIMENSION = 2048;

function resizeImageForApi(
  imageDataUrl: string,
  origW: number,
  origH: number,
): Promise<{ dataUrl: string; w: number; h: number }> {
  return new Promise((resolve) => {
    if (origW <= MAX_DIMENSION && origH <= MAX_DIMENSION) {
      resolve({ dataUrl: imageDataUrl, w: origW, h: origH });
      return;
    }

    const scale = Math.min(MAX_DIMENSION / origW, MAX_DIMENSION / origH);
    const newW = Math.round(origW * scale);
    const newH = Math.round(origH * scale);

    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = newW;
      canvas.height = newH;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, newW, newH);
      resolve({ dataUrl: canvas.toDataURL('image/jpeg', 0.85), w: newW, h: newH });
    };
    img.onerror = () => {
      resolve({ dataUrl: imageDataUrl, w: origW, h: origH });
    };
    img.src = imageDataUrl;
  });
}

// ─── API Call ────────────────────────────────────────────────

/**
 * Send an X-ray image to Claude Vision API for automatic
 * landmark detection.
 *
 * @param imageDataUrl - Base64 data URL of the X-ray image
 * @param viewType - Which X-ray view type
 * @param imageDimensions - Original image width and height
 * @param apiEndpoint - API endpoint URL (default: /api/xray-detect)
 * @returns Detected landmarks with draft status (scaled back to original dimensions)
 */
export async function autoDetectLandmarks(
  imageDataUrl: string,
  viewType: ViewType,
  imageDimensions: { w: number; h: number },
  apiEndpoint: string = '/api/xray-detect',
): Promise<AutoDetectResult> {
  // Resize large images to stay within API limits
  const resized = await resizeImageForApi(imageDataUrl, imageDimensions.w, imageDimensions.h);
  const scaleX = imageDimensions.w / resized.w;
  const scaleY = imageDimensions.h / resized.h;

  // Extract base64 data and media type from data URL
  const match = resized.dataUrl.match(/^data:(image\/\w+);base64,(.+)$/);
  if (!match) {
    throw new Error('Invalid image data URL format');
  }
  const mediaType = match[1];
  const base64Data = match[2];

  const systemPrompt = buildSystemPrompt(viewType, resized.w, resized.h);

  const response = await fetch(apiEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemPrompt,
      imageBase64: base64Data,
      mediaType,
      viewType,
      imageDimensions: { w: resized.w, h: resized.h },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Auto-detect failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();

  // Build status map — all auto-detected landmarks start as 'draft'
  const statuses: LandmarkStatusMap = {};
  const expectedLandmarks = getLandmarkSequence(viewType);

  for (const lm of expectedLandmarks) {
    if (data.landmarks[lm.id]) {
      statuses[lm.id] = 'draft';
    }
  }

  // Validate coordinates are within image bounds
  const warnings = [...(data.warnings || [])];
  const validatedLandmarks: LandmarkMap = {};

  for (const [id, point] of Object.entries(data.landmarks) as [string, Point][]) {
    // Scale coordinates back to original image dimensions
    const scaledX = point.x * scaleX;
    const scaledY = point.y * scaleY;
    const clampedX = Math.max(0, Math.min(imageDimensions.w, scaledX));
    const clampedY = Math.max(0, Math.min(imageDimensions.h, scaledY));

    if (clampedX !== scaledX || clampedY !== scaledY) {
      warnings.push(`${id}: coordinates were outside image bounds and were clamped`);
    }

    validatedLandmarks[id] = { x: Math.round(clampedX), y: Math.round(clampedY) };
  }

  // Check for missing landmarks
  for (const lm of expectedLandmarks) {
    if (!validatedLandmarks[lm.id]) {
      warnings.push(`${lm.id}: not detected by AI — needs manual placement`);
    }
  }

  return {
    landmarks: validatedLandmarks,
    statuses,
    confidence: data.confidence ?? 0.5,
    warnings,
  };
}

// ─── Confirm / Adjust Helpers ────────────────────────────────

/**
 * Confirm a single draft landmark (no position change).
 */
export function confirmLandmark(
  statuses: LandmarkStatusMap,
  landmarkId: string,
): LandmarkStatusMap {
  return { ...statuses, [landmarkId]: 'confirmed' };
}

/**
 * Confirm ALL remaining draft landmarks at once.
 */
export function confirmAllLandmarks(
  statuses: LandmarkStatusMap,
): LandmarkStatusMap {
  const updated = { ...statuses };
  for (const [id, status] of Object.entries(updated)) {
    if (status === 'draft') {
      updated[id] = 'confirmed';
    }
  }
  return updated;
}

/**
 * Adjust a draft landmark's position (marks it as confirmed).
 */
export function adjustLandmark(
  landmarks: LandmarkMap,
  statuses: LandmarkStatusMap,
  landmarkId: string,
  newPosition: Point,
): { landmarks: LandmarkMap; statuses: LandmarkStatusMap } {
  return {
    landmarks: { ...landmarks, [landmarkId]: newPosition },
    statuses: { ...statuses, [landmarkId]: 'confirmed' },
  };
}

/**
 * Check if all landmarks are confirmed (none remain as draft).
 */
export function allLandmarksConfirmed(
  statuses: LandmarkStatusMap,
  viewType: ViewType,
): boolean {
  const expected = getLandmarkSequence(viewType);
  return expected.every(
    (lm) => statuses[lm.id] === 'confirmed' || statuses[lm.id] === 'manual'
  );
}

/**
 * Count landmarks by status.
 */
export function countByStatus(statuses: LandmarkStatusMap): {
  draft: number;
  confirmed: number;
  manual: number;
  total: number;
} {
  const counts = { draft: 0, confirmed: 0, manual: 0, total: 0 };
  for (const status of Object.values(statuses)) {
    counts[status]++;
    counts.total++;
  }
  return counts;
}
