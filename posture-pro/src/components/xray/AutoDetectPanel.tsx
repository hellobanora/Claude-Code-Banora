'use client';

// ═══════════════════════════════════════════════════════════════
// SpineView — AutoDetectPanel Component
//
// Shows AI detection results with per-landmark review controls.
// Draft landmarks (orange) can be confirmed or adjusted.
// Replaces the LandmarkGuide when auto-detect is active.
// ═══════════════════════════════════════════════════════════════

import React, { useMemo } from 'react';
import type { LandmarkDefinition, LandmarkMap, ViewType } from '@/lib/xray/types';
import type { LandmarkStatusMap } from '@/lib/xray/auto-detect';
import { countByStatus } from '@/lib/xray/auto-detect';

interface AutoDetectPanelProps {
  /** Landmark sequence for current view */
  landmarkSequence: LandmarkDefinition[];
  /** Current landmark positions */
  landmarks: LandmarkMap;
  /** Draft/confirmed/manual status per landmark */
  statuses: LandmarkStatusMap;
  /** AI confidence score 0–1 */
  confidence: number;
  /** Any warnings from the AI */
  warnings: string[];
  /** Currently selected landmark for adjustment */
  selectedLandmark: string | null;
  /** Callback when user taps a landmark to select it for adjustment */
  onSelectLandmark: (id: string) => void;
  /** Callback to confirm a single landmark */
  onConfirmLandmark: (id: string) => void;
  /** Callback to confirm ALL remaining draft landmarks */
  onConfirmAll: () => void;
  /** Callback to go back to manual placement mode */
  onSwitchToManual: () => void;
  /** Callback when all are confirmed and ready for report */
  onViewReport: () => void;
  /** Whether detection is in progress */
  isDetecting: boolean;
  /** View type */
  viewType: ViewType;
}

/** Colours for landmark status dots */
const STATUS_COLOURS = {
  draft: '#F39C12',     // Orange — needs review
  confirmed: '#2ECC71', // Green — approved
  manual: '#FFD232',    // Gold — manually placed
} as const;

const STATUS_LABELS = {
  draft: 'AI Draft',
  confirmed: 'Confirmed',
  manual: 'Manual',
} as const;

export default function AutoDetectPanel({
  landmarkSequence,
  landmarks,
  statuses,
  confidence,
  warnings,
  selectedLandmark,
  onSelectLandmark,
  onConfirmLandmark,
  onConfirmAll,
  onSwitchToManual,
  onViewReport,
  isDetecting,
  viewType,
}: AutoDetectPanelProps) {
  const counts = useMemo(() => countByStatus(statuses), [statuses]);
  const allConfirmed = counts.draft === 0 && counts.total > 0;
  const confidencePercent = Math.round(confidence * 100);

  // Loading state
  if (isDetecting) {
    return (
      <div className="flex flex-col h-full bg-[#0F1A2E] text-white items-center justify-center p-8">
        <div className="relative w-16 h-16 mb-4">
          <div className="absolute inset-0 border-4 border-[#1E3455] rounded-full" />
          <div className="absolute inset-0 border-4 border-[#FFD232] rounded-full border-t-transparent animate-spin" />
        </div>
        <p className="text-[#FFD232] font-semibold text-lg mb-1">
          Detecting Landmarks...
        </p>
        <p className="text-[#8BA4C4] text-sm text-center">
          AI is analysing the X-ray and estimating anatomical landmark positions
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#0F1A2E] text-white">
      {/* Status header */}
      <div className="p-4 border-b border-[#1E3455]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-[#8BA4C4]">AI Detection Review</span>
          <span className="text-xs px-2 py-1 rounded-full bg-[#2C5F8A]/30 text-[#5B9EC9]">
            {confidencePercent}% confidence
          </span>
        </div>

        {/* Progress bar */}
        <div className="flex gap-1 mb-2">
          <div className="flex-1">
            <div className="flex justify-between text-xs text-[#8BA4C4] mb-1">
              <span>Confirmed</span>
              <span>{counts.confirmed + counts.manual} / {counts.total}</span>
            </div>
            <div className="w-full h-2 bg-[#162440] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#2ECC71] rounded-full transition-all duration-300"
                style={{ width: `${((counts.confirmed + counts.manual) / Math.max(counts.total, 1)) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Status counts */}
        <div className="flex gap-3 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#F39C12]" />
            {counts.draft} draft
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#2ECC71]" />
            {counts.confirmed} confirmed
          </span>
          {counts.manual > 0 && (
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#FFD232]" />
              {counts.manual} manual
            </span>
          )}
        </div>
      </div>

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="px-4 py-2 bg-[#F39C12]/10 border-b border-[#F39C12]/20">
          <p className="text-[#F39C12] text-xs font-semibold mb-1">
            ⚠ AI Notes:
          </p>
          {warnings.slice(0, 3).map((w, i) => (
            <p key={i} className="text-[#F39C12]/80 text-xs">• {w}</p>
          ))}
          {warnings.length > 3 && (
            <p className="text-[#F39C12]/60 text-xs mt-1">
              +{warnings.length - 3} more...
            </p>
          )}
        </div>
      )}

      {/* Instruction banner */}
      <div className="px-4 py-3 bg-[#162440] border-b border-[#1E3455]">
        {allConfirmed ? (
          <p className="text-[#2ECC71] font-semibold text-center">
            All landmarks confirmed ✓
          </p>
        ) : selectedLandmark ? (
          <p className="text-[#F39C12] text-sm">
            <span className="font-semibold">Adjusting:</span> Tap on the X-ray to
            reposition <span className="text-[#FFD232]">{selectedLandmark}</span>,
            or tap Confirm to accept the AI position.
          </p>
        ) : (
          <p className="text-[#8BA4C4] text-sm">
            Tap a landmark below to review it. Drag on the X-ray to adjust,
            or confirm to accept the AI position.
          </p>
        )}
      </div>

      {/* Confirm All button (when drafts remain) */}
      {counts.draft > 0 && (
        <div className="px-4 py-3 border-b border-[#1E3455]">
          <button
            onClick={onConfirmAll}
            className="w-full py-2.5 bg-[#2ECC71] text-white font-bold rounded-lg hover:bg-[#27AE60] transition-colors text-sm"
          >
            Confirm All {counts.draft} Remaining →
          </button>
        </div>
      )}

      {/* View Report button (when all confirmed) */}
      {allConfirmed && (
        <div className="px-4 py-3 border-b border-[#1E3455]">
          <button
            onClick={onViewReport}
            className="w-full py-3 bg-[#FFD232] text-[#1B3A5C] font-bold rounded-lg hover:bg-[#D4A017] transition-colors text-lg"
          >
            View Report →
          </button>
        </div>
      )}

      {/* Landmark list */}
      <div className="flex-1 overflow-y-auto p-2">
        {landmarkSequence.map((lm) => {
          const status = statuses[lm.id];
          const hasPoint = !!landmarks[lm.id];
          const isSelected = selectedLandmark === lm.id;
          const isDraft = status === 'draft';
          const statusColour = status ? STATUS_COLOURS[status] : '#5B7A9E';

          return (
            <div
              key={lm.id}
              onClick={() => hasPoint && onSelectLandmark(lm.id)}
              className={`px-3 py-2.5 rounded-lg mb-1 flex items-center gap-3 text-sm transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#1B3A5C] border border-[#F39C12]'
                  : hasPoint
                    ? 'bg-transparent hover:bg-[#162440]'
                    : 'bg-transparent opacity-30 cursor-default'
              }`}
            >
              {/* Status dot */}
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{
                  backgroundColor: hasPoint ? statusColour + '30' : '#1E3455',
                  border: `2px solid ${hasPoint ? statusColour : '#5B7A9E'}`,
                  color: hasPoint ? statusColour : '#5B7A9E',
                }}
              >
                {status === 'confirmed' || status === 'manual' ? '✓' : isDraft ? '?' : '·'}
              </div>

              {/* Label */}
              <div className="flex-1 min-w-0">
                <span
                  className={`block truncate ${
                    isSelected
                      ? 'text-[#F39C12] font-semibold'
                      : hasPoint
                        ? 'text-white'
                        : 'text-[#5B7A9E]'
                  }`}
                >
                  {lm.label}
                </span>
                {status && (
                  <span
                    className="text-xs"
                    style={{ color: statusColour }}
                  >
                    {STATUS_LABELS[status]}
                  </span>
                )}
              </div>

              {/* Per-landmark confirm button */}
              {isDraft && !isSelected && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onConfirmLandmark(lm.id);
                  }}
                  className="px-2 py-1 text-xs bg-[#2ECC71]/20 text-[#2ECC71] rounded hover:bg-[#2ECC71]/40 transition-colors flex-shrink-0"
                >
                  ✓
                </button>
              )}

              {/* Confirm button when selected */}
              {isDraft && isSelected && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onConfirmLandmark(lm.id);
                  }}
                  className="px-3 py-1 text-xs bg-[#2ECC71] text-white rounded font-semibold hover:bg-[#27AE60] transition-colors flex-shrink-0"
                >
                  Confirm
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer controls */}
      <div className="p-4 border-t border-[#1E3455]">
        <button
          onClick={onSwitchToManual}
          className="w-full py-2 bg-[#1E3455] text-[#8BA4C4] rounded-lg hover:bg-[#2C5F8A] hover:text-white transition-colors text-sm"
        >
          Switch to Manual Placement
        </button>
      </div>
    </div>
  );
}
