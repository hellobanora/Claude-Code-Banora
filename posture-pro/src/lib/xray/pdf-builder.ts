// ═══════════════════════════════════════════════════════════════
// SpineView — PDF Report Builder
// Client-side PDF generation using jsPDF + html2canvas.
// No patient data leaves the browser.
// ═══════════════════════════════════════════════════════════════

import type { XrayAnalysis, ClinicBranding, Severity } from './types';
import { CLINICS, SEVERITY_COLOURS, SEVERITY_LABELS, EDUCATION_TEXT } from './constants';

/**
 * Generate a branded PDF report for an X-ray analysis.
 *
 * TODO: Claude Code — implement using jsPDF + html2canvas.
 * Install: npm install jspdf html2canvas
 *
 * The report should have 4 pages:
 *
 * PAGE 1 — Cover
 * - Clinic logo (if available) centred at top
 * - Title: "Spinal X-Ray Analysis Report"
 * - Patient name, DOB, exam date
 * - Practitioner name
 * - Clinic name, address, phone
 * - Navy header bar, gold accent line
 *
 * PAGE 2 — Annotated X-Ray
 * - Full annotated X-ray (analysis.annotatedImageDataUrl)
 * - ARA / primary measurement summary card below image
 * - Navy background card with white text, gold accent
 *
 * PAGE 3 — Ideal vs Patient Comparison
 * - Two-column layout:
 *   Left: Ideal spine SVG diagram (green)
 *   Right: Patient's annotated view or generated patient SVG (severity colour)
 * - Measurement comparison table below:
 *   Columns: Measurement | Ideal | Yours | Status
 *   Status uses severity colour badges
 * - Include all segments + ARA/lordosis + AHC if applicable
 *
 * PAGE 4 — Patient Education
 * - "What This Means" heading
 * - Auto-generated text from EDUCATION_TEXT based on overall severity
 * - Keep language simple, no clinical jargon
 * - Connect to phases-of-care messaging
 * - Disclaimer footer: "This analysis is for patient education purposes only.
 *   All measurements are derived from manually placed anatomical landmarks.
 *   Clinical interpretation should be made by a qualified healthcare practitioner."
 * - Clinic branding footer on every page
 *
 * Colour scheme:
 * - Headers: Navy #1B3A5C
 * - Accents: Gold #FFD232
 * - Background: White
 * - Text: Dark grey #333333
 * - Severity badges: use SEVERITY_COLOURS
 *
 * Typography:
 * - Headings: Arial Bold
 * - Body: Arial Regular
 * - jsPDF doesn't support custom web fonts without embedding,
 *   so stick to Arial/Helvetica which are built in.
 */

export interface PdfOptions {
  analysis: XrayAnalysis;
  patientName: string;
  patientDOB?: string;
  practitionerName?: string;
}

export async function generateReport(options: PdfOptions): Promise<Blob> {
  // Dynamic import so jsPDF isn't bundled unless PDF is generated
  const { default: jsPDF } = await import('jspdf');

  const { analysis, patientName, patientDOB, practitionerName } = options;
  const clinic = CLINICS[analysis.clinicId] ?? CLINICS.banora;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  // ─── PAGE 1: Cover ──────────────────────────────────────
  drawCoverPage(doc, clinic, patientName, patientDOB, analysis.examDate, practitionerName, pageWidth, pageHeight, margin);

  // ─── PAGE 2: Annotated X-Ray ────────────────────────────
  doc.addPage();
  drawAnnotatedPage(doc, analysis, pageWidth, pageHeight, margin, contentWidth);

  // ─── PAGE 3: Comparison ─────────────────────────────────
  doc.addPage();
  drawComparisonPage(doc, analysis, pageWidth, pageHeight, margin, contentWidth);

  // ─── PAGE 4: Education ──────────────────────────────────
  doc.addPage();
  drawEducationPage(doc, analysis, clinic, pageWidth, pageHeight, margin, contentWidth);

  // Add page numbers and footer to all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawFooter(doc, clinic, i, totalPages, pageWidth, pageHeight, margin);
  }

  return doc.output('blob');
}

// ─── Page Drawing Functions (stubs for Claude Code) ──────────

function drawCoverPage(
  doc: any,
  clinic: ClinicBranding,
  patientName: string,
  patientDOB: string | undefined,
  examDate: string,
  practitionerName: string | undefined,
  pageWidth: number,
  pageHeight: number,
  margin: number,
): void {
  // Navy header bar
  doc.setFillColor(27, 58, 92); // #1B3A5C
  doc.rect(0, 0, pageWidth, 40, 'F');

  // Gold accent line
  doc.setFillColor(255, 210, 50); // #FFD232
  doc.rect(0, 40, pageWidth, 2, 'F');

  // Title
  doc.setTextColor(27, 58, 92);
  doc.setFontSize(28);
  doc.text('Spinal X-Ray', pageWidth / 2, 80, { align: 'center' });
  doc.text('Analysis Report', pageWidth / 2, 95, { align: 'center' });

  // Gold divider
  doc.setDrawColor(212, 160, 23);
  doc.setLineWidth(0.5);
  doc.line(pageWidth / 2 - 40, 105, pageWidth / 2 + 40, 105);

  // Patient info
  doc.setFontSize(14);
  doc.setTextColor(50, 50, 50);
  const infoY = 130;
  doc.text(`Patient: ${patientName}`, pageWidth / 2, infoY, { align: 'center' });
  if (patientDOB) {
    doc.text(`Date of Birth: ${patientDOB}`, pageWidth / 2, infoY + 10, { align: 'center' });
  }
  doc.text(`Examination Date: ${examDate}`, pageWidth / 2, infoY + 20, { align: 'center' });
  if (practitionerName) {
    doc.text(`Practitioner: ${practitionerName}`, pageWidth / 2, infoY + 30, { align: 'center' });
  }

  // Clinic info at bottom
  doc.setFontSize(12);
  doc.setTextColor(44, 95, 138); // Mid blue
  doc.text(clinic.name, pageWidth / 2, pageHeight - 50, { align: 'center' });
  doc.setFontSize(10);
  doc.text(clinic.address, pageWidth / 2, pageHeight - 42, { align: 'center' });
  doc.text(clinic.phone, pageWidth / 2, pageHeight - 35, { align: 'center' });
}

function drawAnnotatedPage(
  doc: any,
  analysis: XrayAnalysis,
  pageWidth: number,
  pageHeight: number,
  margin: number,
  contentWidth: number,
): void {
  // Page title
  doc.setFontSize(16);
  doc.setTextColor(27, 58, 92);
  doc.text('Annotated X-Ray', margin, 25);

  // TODO: Claude Code — add the annotated X-ray image
  // Use: doc.addImage(analysis.annotatedImageDataUrl, 'PNG', x, y, w, h)
  // Calculate aspect-ratio-correct dimensions within contentWidth

  if (analysis.annotatedImageDataUrl) {
    // Placeholder: Claude Code will implement proper image sizing
    const imgHeight = (pageHeight - 80) * 0.7;
    try {
      doc.addImage(analysis.annotatedImageDataUrl, 'PNG', margin, 35, contentWidth, imgHeight);
    } catch {
      doc.setFontSize(12);
      doc.setTextColor(150, 150, 150);
      doc.text('[Annotated X-ray image]', pageWidth / 2, 100, { align: 'center' });
    }
  }

  // ARA summary card (if cervical)
  if (analysis.measurements.ara) {
    const { ara } = analysis.measurements;
    const cardY = pageHeight - 55;
    doc.setFillColor(27, 58, 92);
    doc.roundedRect(margin, cardY, contentWidth, 30, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text(`ARA: ${ara.measured.toFixed(1)}° (ideal: ${ara.ideal}°)`, margin + 10, cardY + 12);
    doc.setFontSize(11);
    doc.text(`${ara.lossPercent.toFixed(1)}% loss from normal — ${SEVERITY_LABELS[ara.severity]}`, margin + 10, cardY + 22);
  }
}

function drawComparisonPage(
  doc: any,
  analysis: XrayAnalysis,
  pageWidth: number,
  pageHeight: number,
  margin: number,
  contentWidth: number,
): void {
  doc.setFontSize(16);
  doc.setTextColor(27, 58, 92);
  doc.text('Normal vs. Patient Comparison', margin, 25);

  // TODO: Claude Code — render ideal vs patient SVG comparison
  // Use ideal-spines.ts data to draw the ideal and patient diagrams

  // Measurement comparison table
  const tableTop = 140;
  const colWidths = [40, 30, 30, 40, 30];
  const headers = ['Segment', 'Ideal', 'Yours', 'Deviation', 'Status'];

  // Header row
  doc.setFillColor(27, 58, 92);
  doc.rect(margin, tableTop, contentWidth, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  let xPos = margin + 2;
  headers.forEach((h, i) => {
    doc.text(h, xPos, tableTop + 5.5);
    xPos += colWidths[i];
  });

  // Data rows
  doc.setFontSize(9);
  let rowY = tableTop + 8;
  for (const seg of analysis.measurements.segments) {
    const isAlt = analysis.measurements.segments.indexOf(seg) % 2 === 1;
    if (isAlt) {
      doc.setFillColor(245, 248, 252);
      doc.rect(margin, rowY, contentWidth, 7, 'F');
    }
    doc.setTextColor(50, 50, 50);
    xPos = margin + 2;
    doc.text(seg.segment, xPos, rowY + 5); xPos += colWidths[0];
    doc.text(`${seg.ideal}°`, xPos, rowY + 5); xPos += colWidths[1];
    doc.text(seg.measured !== null ? `${seg.measured.toFixed(1)}°` : '—', xPos, rowY + 5); xPos += colWidths[2];
    doc.text(seg.deviationPercent !== null ? `${seg.deviationPercent.toFixed(0)}%` : '—', xPos, rowY + 5); xPos += colWidths[3];
    if (seg.severity) {
      doc.text(SEVERITY_LABELS[seg.severity], xPos, rowY + 5);
    }
    rowY += 7;
  }
}

function drawEducationPage(
  doc: any,
  analysis: XrayAnalysis,
  clinic: ClinicBranding,
  pageWidth: number,
  pageHeight: number,
  margin: number,
  contentWidth: number,
): void {
  doc.setFontSize(16);
  doc.setTextColor(27, 58, 92);
  doc.text('What This Means', margin, 25);

  // Determine overall severity for education text
  let overallSeverity: Severity = 'normal';
  if (analysis.measurements.ara) {
    overallSeverity = analysis.measurements.ara.severity;
  } else if (analysis.measurements.lumbarLordosis) {
    overallSeverity = analysis.measurements.lumbarLordosis.severity;
  }

  // Select education text
  const viewKey = analysis.viewType.includes('cervical') ? 'cervical' : 'lumbar';
  const educationTexts = EDUCATION_TEXT[viewKey as keyof typeof EDUCATION_TEXT];
  const text = educationTexts?.[overallSeverity] ?? '';

  doc.setFontSize(11);
  doc.setTextColor(50, 50, 50);
  const lines = doc.splitTextToSize(text, contentWidth);
  doc.text(lines, margin, 45);

  // Disclaimer
  const disclaimerY = pageHeight - 60;
  doc.setFillColor(245, 248, 252);
  doc.roundedRect(margin, disclaimerY, contentWidth, 35, 2, 2, 'F');
  doc.setFontSize(8);
  doc.setTextColor(130, 130, 130);
  const disclaimer = 'This analysis is for patient education purposes only. All measurements are derived from manually placed anatomical landmarks. Clinical interpretation should be made by a qualified healthcare practitioner.';
  const disclaimerLines = doc.splitTextToSize(disclaimer, contentWidth - 10);
  doc.text(disclaimerLines, margin + 5, disclaimerY + 8);
}

function drawFooter(
  doc: any,
  clinic: ClinicBranding,
  pageNum: number,
  totalPages: number,
  pageWidth: number,
  pageHeight: number,
  margin: number,
): void {
  // Gold line
  doc.setDrawColor(212, 160, 23);
  doc.setLineWidth(0.3);
  doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);

  // Clinic info + page number
  doc.setFontSize(7);
  doc.setTextColor(130, 130, 130);
  doc.text(`${clinic.name} — ${clinic.address} — ${clinic.phone}`, margin, pageHeight - 10);
  doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
}

/**
 * Trigger download of the generated PDF.
 */
export async function downloadReport(options: PdfOptions, filename?: string): Promise<void> {
  const blob = await generateReport(options);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename ?? `xray-report-${options.analysis.examDate}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
