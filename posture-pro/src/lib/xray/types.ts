// ═══════════════════════════════════════════════════════════════
// SpineView — Core Type Definitions
// ═══════════════════════════════════════════════════════════════

/** 2D coordinate on the X-ray image (relative to original image dimensions) */
export interface Point {
  x: number;
  y: number;
}

/** Supported X-ray view types */
export type ViewType = 'cervical_lateral' | 'lumbar_lateral' | 'lumbar_ap';

/** Severity grading for measurements */
export type Severity = 'normal' | 'mild' | 'moderate' | 'marked';

/** Which clinic branding to use */
export type ClinicId = 'banora' | 'palmbeach';

// ─── Landmark System ─────────────────────────────────────────

/** Definition of a single landmark in the placement sequence */
export interface LandmarkDefinition {
  /** Unique identifier, e.g. "C2_sup_post" */
  id: string;
  /** Human-readable label, e.g. "C2 Superior-Posterior" */
  label: string;
  /** Spinal level this landmark belongs to */
  level: string;
  /** Position type on the vertebral body */
  position: 'post' | 'sup_post' | 'inf_post' | 'sup_ant' | 'inf_ant' | 'crest' | 'head' | 'spinous' | 'base';
  /** Instruction text for the practitioner */
  description: string;
  /** Optional: anatomical region hint for reference diagram */
  region?: string;
}

/** All placed landmarks for an analysis, keyed by landmark ID */
export type LandmarkMap = Record<string, Point>;

// ─── Measurement Results ─────────────────────────────────────

/** A single segmental angle measurement */
export interface SegmentAngle {
  /** Segment name, e.g. "C2/C3" */
  segment: string;
  /** Measured angle in degrees */
  measured: number | null;
  /** Ideal angle in degrees */
  ideal: number;
  /** Percentage deviation from ideal */
  deviationPercent: number | null;
  /** Severity grading */
  severity: Severity | null;
}

/** Anterior head carriage measurement */
export interface AHCResult {
  /** Horizontal offset in pixels (convert to mm with calibration) */
  pixels: number;
  /** Converted mm value (null if no calibration) */
  mm: number | null;
  severity: Severity;
}

/** Pelvic unleveling measurement (AP view) */
export interface PelvicUnlevelingResult {
  /** Height difference in pixels */
  pixels: number;
  /** Converted mm value (null if no calibration) */
  mm: number | null;
  /** Which side is high */
  highSide: 'L' | 'R';
  severity: Severity;
}

/** Scoliosis Cobb angle (AP view) */
export interface CobbResult {
  measured: number;
  severity: Severity;
  /** Convexity direction */
  convexity: 'L' | 'R';
}

/** Complete measurement result for any view */
export interface MeasurementResult {
  viewType: ViewType;

  // Cervical lateral
  ara?: {
    measured: number;
    ideal: number;
    lossPercent: number;
    severity: Severity;
  };
  segments: SegmentAngle[];
  anteriorHeadCarriage?: AHCResult;

  // Lumbar lateral
  lumbarLordosis?: {
    measured: number;
    ideal: number;
    lossPercent: number;
    severity: Severity;
  };
  sacralBaseAngle?: {
    measured: number;
    ideal: number;
    severity: Severity;
  };

  // AP view
  cobbAngle?: CobbResult;
  pelvicUnleveling?: PelvicUnlevelingResult;
  sacralBaseUnleveling?: {
    pixels: number;
    mm: number | null;
    highSide: 'L' | 'R';
    severity: Severity;
  };
  femurHeadHeight?: {
    pixels: number;
    mm: number | null;
    highSide: 'L' | 'R';
    severity: Severity;
  };
}

// ─── Analysis Record ─────────────────────────────────────────

/** A complete X-ray analysis record, stored in IndexedDB */
export interface XrayAnalysis {
  /** UUID */
  id: string;
  /** Links to Patient record in Posture Pro */
  patientId: string;
  /** When analysis was created */
  createdAt: string;
  /** Date the X-ray was taken */
  examDate: string;
  /** Which view type */
  viewType: ViewType;
  /** Base64 data URL of the uploaded X-ray image */
  imageDataUrl: string;
  /** Original image dimensions */
  imageDimensions: { w: number; h: number };
  /** All placed landmarks */
  landmarks: LandmarkMap;
  /** Computed measurements */
  measurements: MeasurementResult;
  /** Canvas snapshot with overlays drawn (base64) */
  annotatedImageDataUrl?: string;
  /** Which clinic branding */
  clinicId: ClinicId;
  /** Practitioner who performed the analysis */
  practitioner?: string;
  /** Optional calibration: pixels per mm */
  calibration?: {
    pixelsPerMm: number;
    referenceDescription: string;
  };
}

// ─── Severity Thresholds ─────────────────────────────────────

/** Configurable thresholds for severity grading */
export interface SeverityThresholds {
  /** Max deviation % for "normal" (default 0.25 = 25%) */
  normal: number;
  /** Max deviation % for "mild" (default 0.50 = 50%) */
  mild: number;
  /** Max deviation % for "moderate" (default 0.75 = 75%) */
  moderate: number;
  // Anything above moderate = "marked"
}

// ─── Overlay Rendering ───────────────────────────────────────

/** Configuration for canvas overlay rendering */
export interface OverlayConfig {
  showGeorgesLine: boolean;
  showArcOfLife: boolean;
  showEndplateLines: boolean;
  showLevelNumbers: boolean;
  showAngleValues: boolean;
  showLandmarkDots: boolean;
  showARAOverlay: boolean;
}

// ─── Clinic Branding ─────────────────────────────────────────

export interface ClinicBranding {
  id: ClinicId;
  name: string;
  address: string;
  phone: string;
  website: string;
  logoUrl?: string;
}
