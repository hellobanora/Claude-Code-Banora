'use client';

import React from 'react';
import type { Severity } from '@/lib/xray/types';
import { SEVERITY_COLOURS, SEVERITY_LABELS } from '@/lib/xray/constants';

interface SeverityBadgeProps {
  severity: Severity;
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

export default function SeverityBadge({
  severity,
  size = 'md',
  showLabel = true,
}: SeverityBadgeProps) {
  const colour = SEVERITY_COLOURS[severity];
  const label = SEVERITY_LABELS[severity];

  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${sizeClasses}`}
      style={{
        backgroundColor: colour + '20',
        color: colour,
        border: `1px solid ${colour}40`,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: colour }}
      />
      {showLabel && label}
    </span>
  );
}
