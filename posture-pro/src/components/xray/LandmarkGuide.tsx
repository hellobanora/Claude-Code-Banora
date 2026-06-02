'use client';

// ═══════════════════════════════════════════════════════════════
// SpineView — LandmarkGuide Component
//
// Step-by-step guided landmark placement panel.
// Light theme matching PostureProClinic aesthetic.
// ═══════════════════════════════════════════════════════════════

import React from 'react';
import type { LandmarkDefinition, LandmarkMap } from '@/lib/xray/types';

interface LandmarkGuideProps {
  landmarks: LandmarkDefinition[];
  placedLandmarks: LandmarkMap;
  currentIndex: number;
  onUndo: () => void;
  onReset: () => void;
  isComplete: boolean;
  onViewReport: () => void;
}

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
    <div className="flex flex-col h-full bg-white text-neutral-900">
      {/* Progress header */}
      <div className="p-4 border-b border-neutral-200">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-neutral-500">Landmark Placement</span>
          <span className="text-sm font-semibold text-navy">
            {placedCount} / {totalCount}
          </span>
        </div>
        <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-goldlight rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Current landmark instruction */}
      {current && !isComplete && (
        <div className="p-4 bg-navy/5 border-b border-neutral-200">
          <h3 className="text-navy font-semibold text-lg mb-1">
            Step {currentIndex + 1}: {current.label}
          </h3>
          <p className="text-neutral-500 text-sm leading-relaxed">
            {current.description}
          </p>
        </div>
      )}

      {/* Completion state */}
      {isComplete && (
        <div className="p-4 bg-green-50 border-b border-neutral-200 text-center">
          <p className="text-green-700 font-semibold text-lg mb-3">
            All landmarks placed ✓
          </p>
          <button
            onClick={onViewReport}
            className="w-full py-3 bg-goldlight text-navy font-bold rounded-lg hover:bg-gold transition-colors text-lg shadow-sm"
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
                  ? 'bg-navy/10 border border-navy/30'
                  : isPlaced
                    ? 'bg-transparent'
                    : 'bg-transparent opacity-40'
              }`}
            >
              {/* Status indicator */}
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  isPlaced
                    ? 'bg-green-500 text-white'
                    : isCurrent
                      ? 'bg-navy text-white'
                      : 'bg-neutral-200 text-neutral-400'
                }`}
              >
                {isPlaced ? '✓' : i + 1}
              </div>

              {/* Label */}
              <span
                className={
                  isCurrent
                    ? 'text-navy font-semibold'
                    : isPlaced
                      ? 'text-neutral-500'
                      : 'text-neutral-400'
                }
              >
                {lm.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="p-4 border-t border-neutral-200 flex gap-3">
        <button
          onClick={onUndo}
          disabled={placedCount === 0}
          className="flex-1 py-2 bg-neutral-100 text-neutral-600 rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-sm border border-neutral-200"
        >
          ← Undo
        </button>
        <button
          onClick={onReset}
          disabled={placedCount === 0}
          className="flex-1 py-2 bg-neutral-100 text-neutral-600 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-sm border border-neutral-200"
        >
          Reset All
        </button>
      </div>
    </div>
  );
}
