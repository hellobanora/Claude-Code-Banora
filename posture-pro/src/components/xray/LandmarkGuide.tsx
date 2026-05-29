'use client';

// ═══════════════════════════════════════════════════════════════
// SpineView — LandmarkGuide Component
//
// Step-by-step guided landmark placement panel.
// Shows the current landmark to place, progress through the
// sequence, and anatomical descriptions.
//
// TODO: Claude Code — implement in Phase 1, Session 3.
// ═══════════════════════════════════════════════════════════════

import React from 'react';
import type { LandmarkDefinition, LandmarkMap } from '@/lib/xray/types';
import { BRAND } from '@/lib/xray/constants';

interface LandmarkGuideProps {
  /** Ordered sequence of landmarks for the current view */
  landmarks: LandmarkDefinition[];
  /** Currently placed landmarks */
  placedLandmarks: LandmarkMap;
  /** Index of the current landmark to place */
  currentIndex: number;
  /** Callback to undo the last placed landmark */
  onUndo: () => void;
  /** Callback to reset all landmarks */
  onReset: () => void;
  /** Whether all landmarks have been placed */
  isComplete: boolean;
  /** Callback when "View Report" is clicked */
  onViewReport: () => void;
}

/**
 * LandmarkGuide — guides the practitioner through landmark placement.
 *
 * Implementation guide for Claude Code:
 *
 * 1. PROGRESS BAR
 *    - Show fraction complete: "Step 5 of 17"
 *    - Visual progress bar in gold (#FFD232) on navy background
 *
 * 2. CURRENT LANDMARK
 *    - Large label of the current landmark (e.g. "C4 Superior-Posterior")
 *    - Description text explaining where to click
 *    - Gold highlight colour for the current step
 *
 * 3. LANDMARK LIST
 *    - Scrollable list of all landmarks in sequence
 *    - Placed landmarks: green checkmark, muted text
 *    - Current landmark: gold highlight, bold
 *    - Future landmarks: grey text, dimmed
 *
 * 4. CONTROLS
 *    - "Undo" button: removes last placed landmark, steps back
 *    - "Reset" button: clears all landmarks, goes to step 1
 *    - "View Report" button: appears when all landmarks are placed
 *      (gold background, prominent, centred)
 *
 * 5. REFERENCE DIAGRAM (optional enhancement)
 *    - Small anatomical diagram showing where the current landmark sits
 *    - Highlight the target area
 *    - This is a Phase 3 nice-to-have
 */
export default function LandmarkGuide({
  landmarks,
  placedLandmarks,
  currentIndex,
  onUndo,
  onReset,
  isComplete,
  onViewReport,
}: LandmarkGuideProps) {
  const totalCount = landmarks.length;
  const placedCount = Object.keys(placedLandmarks).length;
  const current = landmarks[currentIndex] ?? null;
  const progressPercent = (placedCount / totalCount) * 100;

  return (
    <div className="flex flex-col h-full bg-[#0F1A2E] text-white">
      {/* Progress header */}
      <div className="p-4 border-b border-[#1E3455]">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-[#8BA4C4]">Landmark Placement</span>
          <span className="text-sm font-semibold text-[#FFD232]">
            {placedCount} / {totalCount}
          </span>
        </div>
        <div className="w-full h-2 bg-[#162440] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#FFD232] rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Current landmark instruction */}
      {current && !isComplete && (
        <div className="p-4 bg-[#162440] border-b border-[#1E3455]">
          <h3 className="text-[#FFD232] font-semibold text-lg mb-1">
            Step {currentIndex + 1}: {current.label}
          </h3>
          <p className="text-[#8BA4C4] text-sm leading-relaxed">
            {current.description}
          </p>
        </div>
      )}

      {/* Completion state */}
      {isComplete && (
        <div className="p-4 bg-[#162440] border-b border-[#1E3455] text-center">
          <p className="text-[#2ECC71] font-semibold text-lg mb-3">
            All landmarks placed ✓
          </p>
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
        {landmarks.map((lm, i) => {
          const isPlaced = !!placedLandmarks[lm.id];
          const isCurrent = i === currentIndex && !isComplete;

          return (
            <div
              key={lm.id}
              className={`px-3 py-2 rounded-lg mb-1 flex items-center gap-3 text-sm transition-colors ${
                isCurrent
                  ? 'bg-[#1B3A5C] border border-[#FFD232]'
                  : isPlaced
                    ? 'bg-transparent'
                    : 'bg-transparent opacity-40'
              }`}
            >
              {/* Status indicator */}
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  isPlaced
                    ? 'bg-[#2ECC71] text-white'
                    : isCurrent
                      ? 'bg-[#FFD232] text-[#1B3A5C]'
                      : 'bg-[#1E3455] text-[#8BA4C4]'
                }`}
              >
                {isPlaced ? '✓' : i + 1}
              </div>

              {/* Label */}
              <span
                className={
                  isCurrent
                    ? 'text-[#FFD232] font-semibold'
                    : isPlaced
                      ? 'text-[#8BA4C4]'
                      : 'text-[#5B7A9E]'
                }
              >
                {lm.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="p-4 border-t border-[#1E3455] flex gap-3">
        <button
          onClick={onUndo}
          disabled={placedCount === 0}
          className="flex-1 py-2 bg-[#1E3455] text-[#8BA4C4] rounded-lg hover:bg-[#2C5F8A] hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-sm"
        >
          ← Undo
        </button>
        <button
          onClick={onReset}
          disabled={placedCount === 0}
          className="flex-1 py-2 bg-[#1E3455] text-[#8BA4C4] rounded-lg hover:bg-[#E74C3C] hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-sm"
        >
          Reset All
        </button>
      </div>
    </div>
  );
}
