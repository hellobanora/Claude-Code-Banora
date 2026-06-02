// ═══════════════════════════════════════════════════════════════
// SpineView — Barrel Export
// ═══════════════════════════════════════════════════════════════

export * from './types';
export * from './constants';
export * from './geometry';
export * from './cervical-lateral';
export * from './lumbar-lateral';
export * from './lumbar-ap';
export * from './overlay-renderer';
export * from './ideal-spines';
export { generateReport, downloadReport } from './pdf-builder';
export type { PdfOptions } from './pdf-builder';
export {
  autoDetectLandmarks,
  confirmLandmark,
  confirmAllLandmarks,
  adjustLandmark,
  allLandmarksConfirmed,
  countByStatus,
} from './auto-detect';
export type { LandmarkStatus, LandmarkStatusMap, AutoDetectResult } from './auto-detect';
export { drawStatusLandmarks, findLandmarkAtPoint, LANDMARK_STATUS_COLOURS } from './auto-detect-overlay';
