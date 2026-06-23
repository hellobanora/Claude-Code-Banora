// src/lib/rom/constants.ts
// Normal ranges, traffic-light thresholds, and movement configuration.
//
// IMPORTANT — clinical sourcing note for James/Paul:
// These default ranges are conservative, commonly cited reference values
// (AMA Guides to Evaluation of Permanent Impairment style figures, cross-
// referenced with commonly used physiotherapy/chiro texts). They are
// defaults, not gospel — review and adjust against your own clinical
// judgement before this goes live. Store as editable config, not hardcoded
// in production, so you and Paul can tune per-population if needed
// (e.g. older patients, post-surgical, athletic population).

import { MovementConfig, NormalRange } from "./types";

export const NORMAL_RANGES: NormalRange[] = [
  // Cervical
  { movement: "cervical_flexion_extension", direction: "flexion", normalMinDeg: 45, normalMaxDeg: 60 },
  { movement: "cervical_flexion_extension", direction: "extension", normalMinDeg: 55, normalMaxDeg: 75 },
  { movement: "cervical_lateral_flexion", direction: "left", normalMinDeg: 35, normalMaxDeg: 45 },
  { movement: "cervical_lateral_flexion", direction: "right", normalMinDeg: 35, normalMaxDeg: 45 },
  { movement: "cervical_rotation", direction: "rotation_left", normalMinDeg: 70, normalMaxDeg: 90 },
  { movement: "cervical_rotation", direction: "rotation_right", normalMinDeg: 70, normalMaxDeg: 90 },

  // Lumbar
  { movement: "lumbar_flexion_extension", direction: "flexion", normalMinDeg: 40, normalMaxDeg: 60 },
  { movement: "lumbar_flexion_extension", direction: "extension", normalMinDeg: 20, normalMaxDeg: 35 },
  { movement: "lumbar_lateral_flexion", direction: "left", normalMinDeg: 15, normalMaxDeg: 25 },
  { movement: "lumbar_lateral_flexion", direction: "right", normalMinDeg: 15, normalMaxDeg: 25 },
  { movement: "lumbar_rotation", direction: "rotation_left", normalMinDeg: 5, normalMaxDeg: 15 },
  { movement: "lumbar_rotation", direction: "rotation_right", normalMinDeg: 5, normalMaxDeg: 15 },
];

// Traffic light thresholds, expressed as % of the normal range MIDPOINT.
// Tunable — this is the single place to adjust scoring sensitivity.
export const TRAFFIC_LIGHT_THRESHOLDS = {
  green: 0.85, // >= 85% of normal midpoint -> green
  yellow: 0.6, // 60-85% -> yellow
  // < 60% -> red
};

export const MOVEMENT_CONFIGS: MovementConfig[] = [
  {
    movement: "cervical_flexion_extension",
    region: "cervical",
    cameraView: "sagittal",
    requiresFaceMesh: true,
    landmarksRequired: ["ear_tragus", "shoulder", "hip"],
    normalRange: NORMAL_RANGES.filter((r) => r.movement === "cervical_flexion_extension"),
  },
  {
    movement: "cervical_lateral_flexion",
    region: "cervical",
    cameraView: "frontal",
    requiresFaceMesh: true,
    landmarksRequired: ["left_eye", "right_eye", "left_shoulder", "right_shoulder"],
    normalRange: NORMAL_RANGES.filter((r) => r.movement === "cervical_lateral_flexion"),
  },
  {
    movement: "cervical_rotation",
    region: "cervical",
    cameraView: "frontal",
    requiresFaceMesh: true,
    landmarksRequired: ["nose", "left_ear", "right_ear", "left_shoulder", "right_shoulder"],
    normalRange: NORMAL_RANGES.filter((r) => r.movement === "cervical_rotation"),
  },
  {
    movement: "lumbar_flexion_extension",
    region: "lumbar",
    cameraView: "sagittal",
    requiresFaceMesh: false,
    landmarksRequired: ["shoulder", "hip", "knee"],
    normalRange: NORMAL_RANGES.filter((r) => r.movement === "lumbar_flexion_extension"),
  },
  {
    movement: "lumbar_lateral_flexion",
    region: "lumbar",
    cameraView: "frontal",
    requiresFaceMesh: false,
    landmarksRequired: ["left_shoulder", "right_shoulder", "left_hip", "right_hip"],
    normalRange: NORMAL_RANGES.filter((r) => r.movement === "lumbar_lateral_flexion"),
  },
  {
    movement: "lumbar_rotation",
    region: "lumbar",
    cameraView: "frontal",
    requiresFaceMesh: false,
    landmarksRequired: ["left_shoulder", "right_shoulder", "left_hip", "right_hip"],
    normalRange: NORMAL_RANGES.filter((r) => r.movement === "lumbar_rotation"),
  },
];

// MediaPipe Pose landmark indices we actually use (BlazePose 33-point model).
// Reference: https://developers.google.com/mediapipe/solutions/vision/pose_landmarker
export const MEDIAPIPE_LANDMARK_INDEX = {
  nose: 0,
  left_eye: 2,
  right_eye: 5,
  left_ear: 7,
  right_ear: 8,
  left_shoulder: 11,
  right_shoulder: 12,
  left_hip: 23,
  right_hip: 24,
  left_knee: 25,
  right_knee: 26,
  left_ankle: 27,
  right_ankle: 28,
} as const;

// Minimum visibility score (MediaPipe confidence) before a frame is flagged
// with a low-confidence warning rather than silently used.
export const MIN_LANDMARK_VISIBILITY = 0.6;

// Peak-detection: angle must be stable (velocity below this threshold,
// degrees/second) for this many milliseconds to be considered a true peak
// rather than a fast transient.
export const PEAK_STABILITY_WINDOW_MS = 400;
export const PEAK_STABILITY_VELOCITY_THRESHOLD_DEG_PER_S = 8;
