// src/components/rom/RomTrafficLightBadge.tsx
// Visual traffic-light badge for a single movement result.
// Matches the brand system: Navy #1B3A5C, Mid Blue #2C5F8A, Gold #FFD232,
// fonts Cormorant Garamond (display) / Outfit (body) — consistent with
// SpineView's SeverityBadge component pattern.

import React from "react";
import { MovementResult } from "@/lib/rom/types";
import { TRAFFIC_LIGHT_COLOURS, percentOfNormal } from "@/lib/rom/scoring";

const MOVEMENT_LABELS: Record<string, string> = {
  cervical_flexion_extension: "Cervical Flexion / Extension",
  cervical_lateral_flexion: "Cervical Lateral Flexion",
  cervical_rotation: "Cervical Rotation",
  lumbar_flexion_extension: "Lumbar Flexion / Extension",
  lumbar_lateral_flexion: "Lumbar Lateral Flexion",
  lumbar_rotation: "Lumbar Rotation",
};

interface Props {
  result: MovementResult;
}

export function RomTrafficLightBadge({ result }: Props) {
  const colours = TRAFFIC_LIGHT_COLOURS[result.trafficLight];
  const pct = percentOfNormal(result.romDeg, result.normalRangeDeg);
  const label = MOVEMENT_LABELS[result.movement] ?? result.movement;
  const sideLabel = result.side ? result.side.charAt(0).toUpperCase() + result.side.slice(1) : null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 20px",
        borderRadius: 10,
        border: "1px solid #E2E8F0",
        backgroundColor: "#FFFFFF",
        marginBottom: 12,
        fontFamily: "Outfit, sans-serif",
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, color: "#5B9EC9", fontWeight: 600, textTransform: "uppercase" }}>
          {sideLabel ? `${label} — ${sideLabel}` : label}
        </div>
        <div style={{ fontSize: 22, color: "#1B3A5C", fontFamily: "Cormorant Garamond, serif", marginTop: 2 }}>
          {result.romDeg}°{" "}
          <span style={{ fontSize: 14, color: "#64748B", fontFamily: "Outfit, sans-serif" }}>
            (expected {result.normalRangeDeg[0]}–{result.normalRangeDeg[1]}°)
          </span>
        </div>
        {result.warnings.length > 0 && (
          <div style={{ fontSize: 12, color: "#D4A017", marginTop: 4 }}>
            ⚠ {result.warnings.length} tracking note{result.warnings.length > 1 ? "s" : ""} — see appendix
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minWidth: 90,
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            backgroundColor: colours.bg,
            color: colours.text,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 15,
            fontWeight: 700,
          }}
        >
          {pct}%
        </div>
        <div style={{ fontSize: 12, color: colours.bg, fontWeight: 600, marginTop: 4 }}>
          {colours.label}
        </div>
      </div>
    </div>
  );
}

/**
 * Three-dot traffic-light strip (small, for summary/cover-page use)
 * showing which light is "lit" without needing the full card.
 */
export function RomTrafficLightDots({ active }: { active: "green" | "yellow" | "red" }) {
  const order: ("red" | "yellow" | "green")[] = ["red", "yellow", "green"];
  return (
    <div style={{ display: "flex", gap: 6 }}>
      {order.map((colour) => (
        <div
          key={colour}
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            backgroundColor: TRAFFIC_LIGHT_COLOURS[colour].bg,
            opacity: active === colour ? 1 : 0.18,
          }}
        />
      ))}
    </div>
  );
}
