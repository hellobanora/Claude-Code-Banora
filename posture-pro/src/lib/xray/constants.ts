// ═══════════════════════════════════════════════════════════════
// SpineView — Constants & Configuration
// ═══════════════════════════════════════════════════════════════

import type {
  LandmarkDefinition,
  SeverityThresholds,
  Severity,
  ClinicBranding,
  OverlayConfig,
} from './types';

// ─── Brand Colours ───────────────────────────────────────────

export const BRAND = {
  navy: '#1B3A5C',
  midBlue: '#2C5F8A',
  lightBlue: '#5B9EC9',
  gold: '#FFD232',
  darkGold: '#D4A017',
  white: '#FFFFFF',
  bg: '#0F1A2E',
  cardBg: '#162440',
  border: '#1E3455',
  text: '#E8EDF3',
  textMuted: '#8BA4C4',
} as const;

// ─── Severity Colours ────────────────────────────────────────

export const SEVERITY_COLOURS: Record<Severity, string> = {
  normal: '#2ECC71',
  mild: '#F39C12',
  moderate: '#E67E22',
  marked: '#E74C3C',
};

export const SEVERITY_LABELS: Record<Severity, string> = {
  normal: 'Normal',
  mild: 'Mild Loss',
  moderate: 'Moderate Loss',
  marked: 'Significant Loss',
};

// ─── Default Severity Thresholds ─────────────────────────────

export const DEFAULT_THRESHOLDS: SeverityThresholds = {
  normal: 0.25,   // Within 25% of ideal
  mild: 0.50,     // 25–50% deviation
  moderate: 0.75, // 50–75% deviation
  // > 75% = marked
};

// ─── Overlay Defaults ────────────────────────────────────────

export const DEFAULT_OVERLAY_CONFIG: OverlayConfig = {
  showGeorgesLine: true,
  showArcOfLife: true,
  showEndplateLines: true,
  showLevelNumbers: true,
  showAngleValues: true,
  showLandmarkDots: true,
  showARAOverlay: true,
};

// ─── Canvas Overlay Colours ──────────────────────────────────

export const OVERLAY_COLOURS = {
  georgesLine: '#E74C3C',          // Red
  arcOfLife: '#2ECC71',            // Green
  endplateLines: 'rgba(255,255,255,0.5)',
  landmarkFill: '#FFD232',         // Gold
  landmarkStroke: '#1B3A5C',       // Navy
  levelNumbers: '#FFD232',         // Gold
  measurementText: '#FFFFFF',
  araText: '#FFFFFF',
} as const;

export const OVERLAY_SIZES = {
  georgesLineWidth: 2,
  arcOfLifeWidth: 2.5,
  endplateLineWidth: 1,
  endplateDash: [4, 4] as number[],
  endplateExtension: 60,          // px extension beyond landmark
  landmarkRadius: 5,
  landmarkStrokeWidth: 1.5,
  levelNumberFont: 'bold 14px sans-serif',
  measurementFont: '12px sans-serif',
  araFont: 'bold 16px sans-serif',
} as const;

// ═══════════════════════════════════════════════════════════════
// CERVICAL LATERAL
// ═══════════════════════════════════════════════════════════════

/** Ideal segmental angles for cervical lateral (degrees, negative = lordosis) */
export const CERVICAL_IDEAL_ANGLES: Record<string, number> = {
  'C1/C2': -29.0,
  'C2/C3': -10.0,
  'C3/C4': -8.0,
  'C4/C5': -8.0,
  'C5/C6': -8.0,
  'C6/C7': -8.0,
  'C7/T1': -8.0,
};

/** Ideal ARA (Absolute Rotation Angle / C2–C7 Cobb) */
export const CERVICAL_IDEAL_ARA = -42.0;

/** Ideal anterior head carriage (mm) */
export const CERVICAL_IDEAL_AHC_MM = 0;
export const CERVICAL_AHC_THRESHOLD_MM = 15; // >15mm is significant

/** Cervical lateral landmark placement sequence (17 points) */
export const CERVICAL_LATERAL_LANDMARKS: LandmarkDefinition[] = [
  {
    id: 'C1_post',
    label: 'C1 Posterior Arch',
    level: 'C1',
    position: 'post',
    description: 'Click the posterior tubercle of the atlas (C1). This is the most posterior point of the C1 ring.',
    region: 'upper',
  },
  {
    id: 'C2_sup_post',
    label: 'C2 Superior-Posterior',
    level: 'C2',
    position: 'sup_post',
    description: 'Click the superior-posterior corner of the C2 vertebral body (the dens base, posterior side).',
    region: 'upper',
  },
  {
    id: 'C2_inf_post',
    label: 'C2 Inferior-Posterior',
    level: 'C2',
    position: 'inf_post',
    description: 'Click the inferior-posterior corner of the C2 vertebral body.',
    region: 'upper',
  },
  {
    id: 'C3_sup_post',
    label: 'C3 Superior-Posterior',
    level: 'C3',
    position: 'sup_post',
    description: 'Click the superior-posterior corner of the C3 vertebral body.',
    region: 'mid',
  },
  {
    id: 'C3_inf_post',
    label: 'C3 Inferior-Posterior',
    level: 'C3',
    position: 'inf_post',
    description: 'Click the inferior-posterior corner of the C3 vertebral body.',
    region: 'mid',
  },
  {
    id: 'C4_sup_post',
    label: 'C4 Superior-Posterior',
    level: 'C4',
    position: 'sup_post',
    description: 'Click the superior-posterior corner of the C4 vertebral body.',
    region: 'mid',
  },
  {
    id: 'C4_inf_post',
    label: 'C4 Inferior-Posterior',
    level: 'C4',
    position: 'inf_post',
    description: 'Click the inferior-posterior corner of the C4 vertebral body.',
    region: 'mid',
  },
  {
    id: 'C5_sup_post',
    label: 'C5 Superior-Posterior',
    level: 'C5',
    position: 'sup_post',
    description: 'Click the superior-posterior corner of the C5 vertebral body.',
    region: 'lower',
  },
  {
    id: 'C5_inf_post',
    label: 'C5 Inferior-Posterior',
    level: 'C5',
    position: 'inf_post',
    description: 'Click the inferior-posterior corner of the C5 vertebral body.',
    region: 'lower',
  },
  {
    id: 'C6_sup_post',
    label: 'C6 Superior-Posterior',
    level: 'C6',
    position: 'sup_post',
    description: 'Click the superior-posterior corner of the C6 vertebral body.',
    region: 'lower',
  },
  {
    id: 'C6_inf_post',
    label: 'C6 Inferior-Posterior',
    level: 'C6',
    position: 'inf_post',
    description: 'Click the inferior-posterior corner of the C6 vertebral body.',
    region: 'lower',
  },
  {
    id: 'C7_sup_post',
    label: 'C7 Superior-Posterior',
    level: 'C7',
    position: 'sup_post',
    description: 'Click the superior-posterior corner of the C7 vertebral body.',
    region: 'lower',
  },
  {
    id: 'C7_inf_post',
    label: 'C7 Inferior-Posterior',
    level: 'C7',
    position: 'inf_post',
    description: 'Click the inferior-posterior corner of the C7 vertebral body.',
    region: 'lower',
  },
  {
    id: 'T1_sup_post',
    label: 'T1 Superior-Posterior',
    level: 'T1',
    position: 'sup_post',
    description: 'Click the superior-posterior corner of the T1 vertebral body. This is the lowest point in the analysis.',
    region: 'lower',
  },
  // Anterior points for endplate angle calculations & AHC
  {
    id: 'C2_sup_ant',
    label: 'C2 Superior-Anterior',
    level: 'C2',
    position: 'sup_ant',
    description: 'Click the superior-anterior corner of the C2 vertebral body (front of the dens base).',
    region: 'upper',
  },
  {
    id: 'C2_inf_ant',
    label: 'C2 Inferior-Anterior',
    level: 'C2',
    position: 'inf_ant',
    description: 'Click the inferior-anterior corner of the C2 vertebral body.',
    region: 'upper',
  },
  {
    id: 'C7_inf_ant',
    label: 'C7 Inferior-Anterior',
    level: 'C7',
    position: 'inf_ant',
    description: 'Click the inferior-anterior corner of the C7 vertebral body. This completes the landmark set.',
    region: 'lower',
  },
];

/** Ordered posterior landmark IDs for George's Line / Arc of Life rendering */
export const CERVICAL_POSTERIOR_SEQUENCE = [
  'C1_post',
  'C2_sup_post', 'C2_inf_post',
  'C3_sup_post', 'C3_inf_post',
  'C4_sup_post', 'C4_inf_post',
  'C5_sup_post', 'C5_inf_post',
  'C6_sup_post', 'C6_inf_post',
  'C7_sup_post', 'C7_inf_post',
  'T1_sup_post',
];

/** Segment pairs for angle calculations */
export const CERVICAL_SEGMENT_PAIRS: Array<{
  segment: string;
  supPost: string;
  infPost: string;
  nextSupPost: string;
  nextInfPost?: string;
}> = [
  { segment: 'C2/C3', supPost: 'C2_sup_post', infPost: 'C2_inf_post', nextSupPost: 'C3_sup_post', nextInfPost: 'C3_inf_post' },
  { segment: 'C3/C4', supPost: 'C3_sup_post', infPost: 'C3_inf_post', nextSupPost: 'C4_sup_post', nextInfPost: 'C4_inf_post' },
  { segment: 'C4/C5', supPost: 'C4_sup_post', infPost: 'C4_inf_post', nextSupPost: 'C5_sup_post', nextInfPost: 'C5_inf_post' },
  { segment: 'C5/C6', supPost: 'C5_sup_post', infPost: 'C5_inf_post', nextSupPost: 'C6_sup_post', nextInfPost: 'C6_inf_post' },
  { segment: 'C6/C7', supPost: 'C6_sup_post', infPost: 'C6_inf_post', nextSupPost: 'C7_sup_post', nextInfPost: 'C7_inf_post' },
];

// ═══════════════════════════════════════════════════════════════
// LUMBAR LATERAL
// ═══════════════════════════════════════════════════════════════

export const LUMBAR_IDEAL_LORDOSIS = -50.0; // L1–S1, range 40–60°
export const LUMBAR_IDEAL_SACRAL_BASE_ANGLE = 40.0; // Ferguson's, range 34–45°

export const LUMBAR_IDEAL_ANGLES: Record<string, number> = {
  'L1/L2': -6.0,
  'L2/L3': -8.0,
  'L3/L4': -10.0,
  'L4/L5': -12.0,
  'L5/S1': -14.0,
};

export const LUMBAR_LATERAL_LANDMARKS: LandmarkDefinition[] = [
  { id: 'L1_sup_post', label: 'L1 Superior-Posterior', level: 'L1', position: 'sup_post', description: 'Click the superior-posterior corner of the L1 vertebral body.' },
  { id: 'L1_inf_post', label: 'L1 Inferior-Posterior', level: 'L1', position: 'inf_post', description: 'Click the inferior-posterior corner of the L1 vertebral body.' },
  { id: 'L2_sup_post', label: 'L2 Superior-Posterior', level: 'L2', position: 'sup_post', description: 'Click the superior-posterior corner of the L2 vertebral body.' },
  { id: 'L2_inf_post', label: 'L2 Inferior-Posterior', level: 'L2', position: 'inf_post', description: 'Click the inferior-posterior corner of the L2 vertebral body.' },
  { id: 'L3_sup_post', label: 'L3 Superior-Posterior', level: 'L3', position: 'sup_post', description: 'Click the superior-posterior corner of the L3 vertebral body.' },
  { id: 'L3_inf_post', label: 'L3 Inferior-Posterior', level: 'L3', position: 'inf_post', description: 'Click the inferior-posterior corner of the L3 vertebral body.' },
  { id: 'L4_sup_post', label: 'L4 Superior-Posterior', level: 'L4', position: 'sup_post', description: 'Click the superior-posterior corner of the L4 vertebral body.' },
  { id: 'L4_inf_post', label: 'L4 Inferior-Posterior', level: 'L4', position: 'inf_post', description: 'Click the inferior-posterior corner of the L4 vertebral body.' },
  { id: 'L5_sup_post', label: 'L5 Superior-Posterior', level: 'L5', position: 'sup_post', description: 'Click the superior-posterior corner of the L5 vertebral body.' },
  { id: 'L5_inf_post', label: 'L5 Inferior-Posterior', level: 'L5', position: 'inf_post', description: 'Click the inferior-posterior corner of the L5 vertebral body.' },
  { id: 'S1_sup_post', label: 'S1 Superior-Posterior', level: 'S1', position: 'sup_post', description: 'Click the superior-posterior corner of the S1 sacral base.' },
  { id: 'S1_sup_ant', label: 'S1 Superior-Anterior', level: 'S1', position: 'sup_ant', description: 'Click the superior-anterior corner of the S1 sacral base (sacral promontory).' },
  { id: 'L1_sup_ant', label: 'L1 Superior-Anterior', level: 'L1', position: 'sup_ant', description: 'Click the superior-anterior corner of the L1 vertebral body.' },
];

// ═══════════════════════════════════════════════════════════════
// LUMBAR AP / PELVIS
// ═══════════════════════════════════════════════════════════════

export const LUMBAR_AP_LANDMARKS: LandmarkDefinition[] = [
  // Pelvic landmarks
  { id: 'iliac_crest_L', label: 'Left Iliac Crest', level: 'pelvis', position: 'crest', description: 'Click the highest point of the LEFT iliac crest.' },
  { id: 'iliac_crest_R', label: 'Right Iliac Crest', level: 'pelvis', position: 'crest', description: 'Click the highest point of the RIGHT iliac crest.' },
  { id: 'femur_head_L', label: 'Left Femoral Head', level: 'pelvis', position: 'head', description: 'Click the centre of the LEFT femoral head.' },
  { id: 'femur_head_R', label: 'Right Femoral Head', level: 'pelvis', position: 'head', description: 'Click the centre of the RIGHT femoral head.' },
  { id: 'sacral_base_L', label: 'Left Sacral Base', level: 'S1', position: 'base', description: 'Click the LEFT corner of the S1 sacral base superior endplate.' },
  { id: 'sacral_base_R', label: 'Right Sacral Base', level: 'S1', position: 'base', description: 'Click the RIGHT corner of the S1 sacral base superior endplate.' },
  // Spinous process landmarks for scoliosis
  { id: 'L1_spinous', label: 'L1 Spinous Process', level: 'L1', position: 'spinous', description: 'Click the spinous process of L1.' },
  { id: 'L2_spinous', label: 'L2 Spinous Process', level: 'L2', position: 'spinous', description: 'Click the spinous process of L2.' },
  { id: 'L3_spinous', label: 'L3 Spinous Process', level: 'L3', position: 'spinous', description: 'Click the spinous process of L3.' },
  { id: 'L4_spinous', label: 'L4 Spinous Process', level: 'L4', position: 'spinous', description: 'Click the spinous process of L4.' },
  { id: 'L5_spinous', label: 'L5 Spinous Process', level: 'L5', position: 'spinous', description: 'Click the spinous process of L5.' },
  // Cobb angle endpoints (most tilted superior and inferior endplates)
  { id: 'cobb_upper_L', label: 'Cobb Upper-Left', level: 'cobb', position: 'sup_ant', description: 'Click the LEFT corner of the UPPER end vertebra\'s superior endplate.' },
  { id: 'cobb_upper_R', label: 'Cobb Upper-Right', level: 'cobb', position: 'sup_post', description: 'Click the RIGHT corner of the UPPER end vertebra\'s superior endplate.' },
  { id: 'cobb_lower_L', label: 'Cobb Lower-Left', level: 'cobb', position: 'inf_ant', description: 'Click the LEFT corner of the LOWER end vertebra\'s inferior endplate.' },
  { id: 'cobb_lower_R', label: 'Cobb Lower-Right', level: 'cobb', position: 'inf_post', description: 'Click the RIGHT corner of the LOWER end vertebra\'s inferior endplate.' },
];

// ═══════════════════════════════════════════════════════════════
// CLINIC BRANDING
// ═══════════════════════════════════════════════════════════════

export const CLINICS: Record<string, ClinicBranding> = {
  banora: {
    id: 'banora',
    name: 'Banora Chiropractic',
    address: '2/44 Greenway Drive, Tweed Heads South NSW 2486',
    phone: '(07) 5599 2322',
    website: 'banorachiropractic.com.au',
  },
  palmbeach: {
    id: 'palmbeach',
    name: 'Palm Beach Chiropractic & Remedial',
    address: '1/28 Palm Beach Ave, Palm Beach QLD 4221',
    phone: '(07) 5534 5005',
    website: 'palmbeachchiropractic.com.au',
  },
};

// ═══════════════════════════════════════════════════════════════
// PATIENT EDUCATION TEXT TEMPLATES
// ═══════════════════════════════════════════════════════════════

export const EDUCATION_TEXT = {
  cervical: {
    normal: 'Your cervical spine shows a healthy lordotic curve within the normal range. The natural C-shaped curve of your neck is well maintained, which helps distribute the weight of your head evenly across the spinal joints and discs.',
    mild: 'Your cervical spine shows a mild reduction in the normal lordotic curve. While still within a functional range, this reduction may lead to increased stress on certain spinal segments over time. Maintaining good posture habits and regular spinal care can help preserve and improve this curve.',
    moderate: 'Your cervical spine shows a moderate loss of the normal lordotic curve. This means the natural C-shaped curve of your neck has significantly straightened, placing increased mechanical stress on the discs, joints, and surrounding muscles. This is commonly associated with chronic postural stress, prolonged screen use, or previous injury.',
    marked: 'Your cervical spine shows a significant loss of the normal lordotic curve. The natural C-shape has substantially straightened or may even be reversing, which places considerable mechanical stress on the spinal structures. This level of curve loss is often associated with accelerated spinal degeneration, chronic muscle tension, and may contribute to symptoms such as neck pain, headaches, and reduced range of motion.',
  },
  lumbar: {
    normal: 'Your lumbar spine shows a healthy lordotic curve within the normal range. This curve is essential for proper weight distribution and shock absorption through your lower back.',
    mild: 'Your lumbar spine shows a mild reduction in the normal lordotic curve. Core strengthening and postural awareness can help maintain and improve this curve.',
    moderate: 'Your lumbar spine shows a moderate loss of the normal lordotic curve. This increased straightening places additional stress on the lumbar discs and facet joints, and may contribute to lower back discomfort.',
    marked: 'Your lumbar spine shows a significant loss of the normal lordotic curve. This level of change places substantial stress on the lumbar structures and is commonly associated with disc degeneration, chronic lower back pain, and reduced spinal function.',
  },
} as const;
