'use client';

import React from 'react';
import type { ViewType } from '@/lib/xray/types';

interface ViewSelectorProps {
  selected: ViewType;
  onChange: (view: ViewType) => void;
}

const VIEW_OPTIONS: { value: ViewType; label: string; phase: string }[] = [
  { value: 'cervical_lateral', label: 'Cervical Lateral', phase: '' },
  { value: 'lumbar_lateral', label: 'Lumbar Lateral', phase: 'Phase 2' },
  { value: 'lumbar_ap', label: 'Lumbar AP / Pelvis', phase: 'Phase 2' },
];

export default function ViewSelector({ selected, onChange }: ViewSelectorProps) {
  return (
    <div className="flex gap-2">
      {VIEW_OPTIONS.map((opt) => {
        const isSelected = selected === opt.value;
        const isDisabled = opt.phase === 'Phase 2';

        return (
          <button
            key={opt.value}
            onClick={() => !isDisabled && onChange(opt.value)}
            disabled={isDisabled}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isSelected
                ? 'bg-[#FFD232] text-[#1B3A5C]'
                : isDisabled
                  ? 'bg-[#1E3455] text-[#5B7A9E] cursor-not-allowed opacity-50'
                  : 'bg-[#1E3455] text-[#8BA4C4] hover:bg-[#2C5F8A] hover:text-white'
            }`}
          >
            {opt.label}
            {isDisabled && (
              <span className="ml-1.5 text-xs opacity-60">({opt.phase})</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
