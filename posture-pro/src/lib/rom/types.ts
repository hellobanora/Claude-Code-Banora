// src/lib/rom/types.ts
// Core type definitions for the Range of Motion (ROM) module.
// Extends the existing Posture Pro / SpineView architecture.

export type Region = "cervical" | "lumbar";

export type MovementType =
  | "cervical_flexion_extension"
  | "cervical_lateral_flexion"
  | "cervical_rotation"
  | "lumbar_flexion_extension"
  | "lumbar_lateral_flexion"
  | "lumbar_rotation";

export type CameraView = "sagittal" | "frontal";

export type TrafficLight = "green" | "yellow" | "red";

export type Side = "left" | "right";

// A single tracked landmark at a point in time.
export interface Landmark {
  x: number; // normalised 0-1 (MediaPipe convention)
  y: number;
  z?: number;
  visibility?: number; // MediaPipe confidence 0-1
}

export type LandmarkFrame = Record<string, Landmark>;

// One processed frame of a recorded movement.
export interface PoseFrame {
  frameIndex: number;
  timestampMs: number;
  landmarks: LandmarkFrame;
}

// Result of analysing a single rep of a single movement.
export interface MovementResult {
  movement: MovementType;
  cameraView: CameraView;
  side?: Side; // for lateral flexion / rotation, which direction this result covers
  neutralAngleDeg: number;
  peakAngleDeg: number;
  romDeg: number; // peakAngleDeg - neutralAngleDeg (signed where relevant)
  peakFrame: PoseFrame;
  neutralFrame: PoseFrame;
  angleSeries: { timestampMs: number; angleDeg: number }[]; // smoothed series for charting
  confidence: number; // 0-1, derived from landmark visibility + tracking stability
  trafficLight: TrafficLight;
  normalRangeDeg: [number, number];
  warnings: string[]; // e.g. "low landmark confidence", "excessive frame jitter"
}

// Full assessment session — may contain multiple movements in one visit.
export interface RomAssessment {
  id: string;
  patientId: string;
  clinicId: "banora" | "palmbeach"; // matches ClinicId in lib/xray/types.ts
  practitioner: string;
  date: string; // ISO date
  results: MovementResult[];
  notes?: string;
}

// Reference normal ranges used for traffic-light scoring.
// Conservative, commonly cited clinical ranges — see docs for sourcing.
export interface NormalRange {
  movement: MovementType;
  direction?: "flexion" | "extension" | Side | "rotation_left" | "rotation_right";
  normalMinDeg: number;
  normalMaxDeg: number;
}

// Config for a single movement's capture + analysis pipeline.
export interface MovementConfig {
  movement: MovementType;
  region: Region;
  cameraView: CameraView;
  requiresFaceMesh: boolean;
  landmarksRequired: string[];
  normalRange: NormalRange[];
}
