// src/lib/rom/capture-flow.ts
// Defines the fixed 6-movement capture sequence, grouped into 3 camera
// stages per Section 9 of the ROM Module Technical Spec — the practitioner
// repositions the camera/tripod twice per patient, not six times.

import type { CameraView, MovementType, Region } from './types';

export interface CaptureStep {
  movement: MovementType;
  region: Region;
  cameraView: CameraView;
  label: string;
  instruction: string;
}

export interface CaptureStage {
  stage: number;
  cameraView: CameraView;
  cameraInstruction: string;
  steps: CaptureStep[];
}

export const CAPTURE_STAGES: CaptureStage[] = [
  {
    stage: 1,
    cameraView: 'sagittal',
    cameraInstruction: 'Side-on (sagittal). Camera at hip height, ~2.5–3m back. Patient standing, side-on to camera, arms relaxed.',
    steps: [
      {
        movement: 'cervical_flexion_extension',
        region: 'cervical',
        cameraView: 'sagittal',
        label: 'Cervical Flexion / Extension',
        instruction: 'Patient nods chin to chest (flexion), holds briefly, returns to neutral, then tips head back (extension) and holds briefly.',
      },
      {
        movement: 'lumbar_flexion_extension',
        region: 'lumbar',
        cameraView: 'sagittal',
        label: 'Lumbar Flexion / Extension',
        instruction: 'Patient bends forward at the waist (flexion), holds briefly, returns to standing, then leans back (extension) and holds briefly.',
      },
    ],
  },
  {
    stage: 2,
    cameraView: 'frontal',
    cameraInstruction: 'Face-on (frontal). Camera at chest height, ~2.5–3m back. Patient standing, facing camera directly.',
    steps: [
      {
        movement: 'cervical_lateral_flexion',
        region: 'cervical',
        cameraView: 'frontal',
        label: 'Cervical Lateral Flexion',
        instruction: 'Patient tilts head toward right shoulder, holds briefly, returns to neutral, then tilts toward left shoulder and holds briefly.',
      },
      {
        movement: 'lumbar_lateral_flexion',
        region: 'lumbar',
        cameraView: 'frontal',
        label: 'Lumbar Lateral Flexion',
        instruction: 'Patient side-bends toward the right, holds briefly, returns to standing, then side-bends toward the left and holds briefly.',
      },
    ],
  },
  {
    stage: 3,
    cameraView: 'frontal',
    cameraInstruction: 'Face-on (frontal), same position as Stage 2. Patient standing, facing camera, rotate as instructed.',
    steps: [
      {
        movement: 'cervical_rotation',
        region: 'cervical',
        cameraView: 'frontal',
        label: 'Cervical Rotation',
        instruction: 'Patient turns head to look over their right shoulder, holds briefly, returns to centre, then turns to look over their left shoulder and holds briefly.',
      },
      {
        movement: 'lumbar_rotation',
        region: 'lumbar',
        cameraView: 'frontal',
        label: 'Lumbar Rotation',
        instruction: 'Patient rotates trunk to the right (feet planted), holds briefly, returns to centre, then rotates to the left and holds briefly.',
      },
    ],
  },
];

export const ALL_CAPTURE_STEPS: CaptureStep[] = CAPTURE_STAGES.flatMap((s) => s.steps);
