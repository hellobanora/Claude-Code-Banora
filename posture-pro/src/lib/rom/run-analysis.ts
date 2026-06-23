// src/lib/rom/run-analysis.ts
// Single entry point: recorded video blob + movement type -> MovementResult[].
// Dispatches to the correct analyser (sagittal / lateralFlexion / rotation)
// after extracting pose frames from the clip.

import type { MovementResult, MovementType } from './types';
import { extractPoseFrames } from './pose-extraction';
import { analyseSagittalMovement } from './analysers/sagittal';
import { analyseLateralFlexion } from './analysers/lateralFlexion';
import { analyseRotation } from './analysers/rotation';
import type { CaptureStep } from './capture-flow';

export async function runMovementAnalysis(
  step: CaptureStep,
  videoBlob: Blob,
  facingRight: boolean
): Promise<MovementResult[]> {
  const frames = await extractPoseFrames({
    videoBlob,
    region: step.region,
    cameraView: step.cameraView,
    facingRight,
  });

  switch (step.movement) {
    case 'cervical_flexion_extension':
    case 'lumbar_flexion_extension':
      return analyseSagittalMovement({ movement: step.movement, frames, facingRight });

    case 'cervical_lateral_flexion':
    case 'lumbar_lateral_flexion':
      return analyseLateralFlexion({ movement: step.movement, frames });

    case 'cervical_rotation':
    case 'lumbar_rotation':
      return analyseRotation({ movement: step.movement, frames });

    default: {
      const _exhaustive: never = step.movement;
      throw new Error(`Unhandled movement type: ${_exhaustive}`);
    }
  }
}

/** Type guard helper for narrowing MovementType in switch statements elsewhere. */
export function isSagittalMovement(m: MovementType): boolean {
  return m === 'cervical_flexion_extension' || m === 'lumbar_flexion_extension';
}
