'use client';

import React from 'react';
import type { ViewType } from '@/lib/xray/types';

interface ViewSelectorProps {
  selected: ViewType;
  onChange: (view: ViewType) => void;
}

const VIEW_OPTIONS: { value: ViewType; label: string; description: string }[] = [
  { value: 'cervical_lateral', label: 'Cervical Lateral', description: 'C-spine lordosis & ARA' },
  { value: 'lumbar_lateral', label: 'Lumbar Lateral', description: 'Lumbar lordosis & sacral base' },
  { value: 'lumbar_ap', label: 'Lumbar AP / Pelvis', description: 'Scoliosis & pelvic leveling' },
];

export default function ViewSelector({ selected, onChange }: ViewSelectorProps) {
  return (
    <div className="flex gap-2">
      {VIEW_OPTIONS.map((opt) => {
        const isSelected = selected === opt.value;

        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-4 py-3 rounded-lg text-sm font-medium transition-all flex flex-col items-start border ${
              isSelected
                ? 'bg-navy text-white border-navy shadow-sm'
                : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-navy/40 hover:text-navy'
            }`}
          >
            <span>{opt.label}</span>
            <span className={`text-xs mt-0.5 ${isSelected ? 'text-white/60' : 'text-neutral-400'}`}>
              {opt.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}
