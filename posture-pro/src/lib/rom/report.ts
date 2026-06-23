// src/lib/rom/report.ts
// PDF report generation for ROM assessments — follows the same jsPDF
// pattern established in SpineView's pdf-builder, so the visual language
// is consistent across all Posture Pro reports (clinic letterhead by
// location, AHPRA-compliant phrasing, navy/gold brand palette).

import jsPDF from "jspdf";
import { MovementResult, RomAssessment } from "./types";
import { TRAFFIC_LIGHT_COLOURS, percentOfNormal } from "./scoring";
import { CLINICS } from "../xray/constants";

const BRAND = {
  navy: "#1B3A5C",
  midBlue: "#2C5F8A",
  lightBlue: "#5B9EC9",
  gold: "#FFD232",
  darkGold: "#D4A017",
};

const MOVEMENT_LABELS: Record<string, string> = {
  cervical_flexion_extension: "Cervical Flexion / Extension",
  cervical_lateral_flexion: "Cervical Lateral Flexion",
  cervical_rotation: "Cervical Rotation",
  lumbar_flexion_extension: "Lumbar Flexion / Extension",
  lumbar_lateral_flexion: "Lumbar Lateral Flexion",
  lumbar_rotation: "Lumbar Rotation",
};

function resultLabel(result: MovementResult): string {
  const base = MOVEMENT_LABELS[result.movement] ?? result.movement;
  if (!result.side) return base;
  const side = result.side.charAt(0).toUpperCase() + result.side.slice(1);
  return `${base} (${side})`;
}

/**
 * AHPRA-compliant narrative phrasing — describes findings, never
 * diagnoses or prescribes. Mirrors the disclaimer pattern used in the
 * existing posture report generator.
 */
function narrativeForResult(result: MovementResult): string {
  const label = resultLabel(result);
  const pct = percentOfNormal(result.romDeg, result.normalRangeDeg);

  if (result.trafficLight === "green") {
    return `${label}: measured range was within the expected range for this movement (${pct}% of typical).`;
  }
  if (result.trafficLight === "yellow") {
    return `${label}: measured range was somewhat reduced compared to the typical expected range (${pct}% of typical). This finding may be discussed further with your practitioner.`;
  }
  return `${label}: measured range was notably reduced compared to the typical expected range (${pct}% of typical). Your practitioner will discuss this finding and any recommended next steps with you.`;
}

export function buildRomReportPdf(assessment: RomAssessment, patientName: string): jsPDF {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 48;
  const clinic = CLINICS[assessment.clinicId] ?? CLINICS.banora;

  // --- Page 1: Cover / summary -----------------------------------
  doc.setFillColor(BRAND.navy);
  doc.rect(0, 0, pageWidth, 90, "F");
  doc.setTextColor("#FFFFFF");
  doc.setFontSize(20);
  doc.text(clinic.name, margin, 40);
  doc.setFontSize(11);
  doc.text(clinic.address, margin, 58);
  doc.text(`${clinic.phone}${clinic.website ? "  |  " + clinic.website : ""}`, margin, 72);

  doc.setTextColor(BRAND.navy);
  doc.setFontSize(22);
  doc.text("Range of Motion Assessment", margin, 130);

  doc.setFontSize(11);
  doc.setTextColor("#333333");
  doc.text(`Patient: ${patientName}`, margin, 155);
  doc.text(`Date: ${new Date(assessment.date).toLocaleDateString("en-AU")}`, margin, 172);
  doc.text(`Practitioner: ${assessment.practitioner}`, margin, 189);

  // Traffic-light summary strip
  let y = 225;
  doc.setFontSize(14);
  doc.setTextColor(BRAND.navy);
  doc.text("Summary", margin, y);
  y += 20;

  for (const result of assessment.results) {
    const colours = TRAFFIC_LIGHT_COLOURS[result.trafficLight];
    const label = resultLabel(result);
    const pct = percentOfNormal(result.romDeg, result.normalRangeDeg);

    doc.setFillColor(colours.bg);
    doc.circle(margin + 6, y - 4, 6, "F");

    doc.setFontSize(11);
    doc.setTextColor("#222222");
    doc.text(`${label}`, margin + 22, y);
    doc.setTextColor(colours.bg);
    doc.text(`${result.romDeg}°  (${pct}% of typical) — ${colours.label}`, margin + 230, y);

    y += 22;
    if (y > 740) {
      doc.addPage();
      y = 60;
    }
  }

  doc.setFontSize(8);
  doc.setTextColor("#888888");
  doc.text(
    "This report presents objective movement measurements for tracking purposes and does not constitute a diagnosis.",
    margin,
    800,
    { maxWidth: pageWidth - margin * 2 }
  );
  doc.text(
    "Please discuss these findings with your practitioner. Measurements are derived from video-based motion tracking and",
    margin,
    812,
    { maxWidth: pageWidth - margin * 2 }
  );
  doc.text("are intended as a screening and progress-tracking tool, not a substitute for clinical examination.", margin, 824, {
    maxWidth: pageWidth - margin * 2,
  });

  // --- Page 2+: Detailed findings ----------------------------------
  doc.addPage();
  y = 60;
  doc.setFontSize(16);
  doc.setTextColor(BRAND.navy);
  doc.text("Detailed Findings", margin, y);
  y += 30;

  for (const result of assessment.results) {
    if (y > 700) {
      doc.addPage();
      y = 60;
    }
    const label = resultLabel(result);
    const colours = TRAFFIC_LIGHT_COLOURS[result.trafficLight];

    doc.setFontSize(13);
    doc.setTextColor(BRAND.navy);
    doc.text(label, margin, y);
    y += 16;

    doc.setFillColor(colours.bg);
    doc.roundedRect(margin, y, 90, 20, 4, 4, "F");
    doc.setTextColor(colours.text);
    doc.setFontSize(10);
    doc.text(colours.label, margin + 12, y + 14);

    doc.setTextColor("#333333");
    doc.setFontSize(10);
    doc.text(
      `Measured: ${result.romDeg}°   |   Expected: ${result.normalRangeDeg[0]}-${result.normalRangeDeg[1]}°   |   Confidence: ${Math.round(
        result.confidence * 100
      )}%`,
      margin + 100,
      y + 14
    );
    y += 32;

    doc.setFontSize(10);
    doc.setTextColor("#444444");
    const narrative = narrativeForResult(result);
    const wrapped = doc.splitTextToSize(narrative, pageWidth - margin * 2);
    doc.text(wrapped, margin, y);
    y += wrapped.length * 13 + 16;
  }

  return doc;
}
