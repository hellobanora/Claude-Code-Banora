/**
 * Checks whether a just-captured posture photo has good enough framing to
 * support the app's cm/mm conversion, which relies on the patient's known
 * height plus the head and ankle landmarks being visible in the shot (see
 * lateral-analyser.ts / ap-analyser.ts — mmPerUnit needs both).
 *
 * This runs MediaPipe pose detection (already used for landmark auto-detect)
 * against the freshly captured frame, purely as a framing sanity check —
 * it does not place any landmarks itself.
 */
import type { Landmark, PostureView } from '../models/landmark';
import { detectPoseFromBlob } from './detect-pose';
import { withTimeout } from '../utils/with-timeout';

/** Below this MediaPipe visibility score, treat a landmark as "not confidently seen". */
export const FRAMING_CONFIDENCE_THRESHOLD = 0.4;

/**
 * MediaPipe's first run downloads a ~5MB WASM/model bundle from a CDN and can hang
 * (rather than reject) on a slow clinic connection or a stuck GPU delegate init.
 * Cap the wait so the practitioner never gets stuck on "Checking photo…".
 */
export const FRAMING_CHECK_TIMEOUT_MS = 6000;

export interface FramingCheckResult {
  ok: boolean;
  /** Plain-language list of what wasn't clearly visible, e.g. ["head", "feet"]. */
  missing: string[];
}

/**
 * Pure evaluation over already-detected landmarks — no DOM/model access, so
 * it's straightforward to unit test independently of MediaPipe.
 */
export function evaluateFraming(
  landmarks: Landmark[],
  view: PostureView,
  threshold: number = FRAMING_CONFIDENCE_THRESHOLD
): FramingCheckResult {
  if (landmarks.length === 0) {
    return { ok: false, missing: ['Your whole body'] };
  }

  const seen = (id: string): boolean => {
    const lm = landmarks.find((l) => l.id === id);
    return !!lm && lm.confidence >= threshold;
  };

  const missing: string[] = [];

  if (view === 'lateral') {
    if (!seen('tragus')) missing.push('head');
    if (!seen('lateralMalleolus')) missing.push('feet');
  } else {
    if (!seen('eyeOuterL') && !seen('eyeOuterR')) missing.push('head');
    if (!seen('ankleCentreL') && !seen('ankleCentreR')) missing.push('feet');
  }

  return { ok: missing.length === 0, missing };
}

/**
 * Runs pose detection on a freshly captured image blob and evaluates framing.
 * Fails open (ok: true) if detection throws, or if it doesn't finish within
 * FRAMING_CHECK_TIMEOUT_MS — a model/network hiccup shouldn't block the
 * practitioner from proceeding.
 */
export async function checkFraming(
  blob: Blob,
  view: PostureView,
  threshold: number = FRAMING_CONFIDENCE_THRESHOLD,
  timeoutMs: number = FRAMING_CHECK_TIMEOUT_MS
): Promise<FramingCheckResult> {
  try {
    const { landmarks } = await withTimeout(
      detectPoseFromBlob(blob, view),
      timeoutMs,
      'Framing check timed out'
    );
    return evaluateFraming(landmarks, view, threshold);
  } catch {
    return { ok: true, missing: [] };
  }
}
