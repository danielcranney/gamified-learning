'use client';

import React from 'react';
import type { AccentColor } from '@/types';

interface ProgressBarProps {
  value: number;
  max?: number;
  accent?: AccentColor;
  showLabel?: boolean;
  className?: string;
}

const accentBg: Record<AccentColor, string> = {
  purple: 'var(--color-accent-purple)',
  blue: 'var(--color-accent-blue)',
  green: 'var(--color-accent-green)',
  yellow: 'var(--color-accent-yellow)',
  orange: 'var(--color-accent-orange)',
};

export function ProgressBar({
  value,
  max = 100,
  accent = 'blue',
  showLabel = false,
  className = '',
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={['w-full', className].join(' ')}>
      <div className="w-full h-2.5 rounded-pill bg-border overflow-hidden">
        <div
          className="h-full rounded-pill transition-all duration-500 ease-out"
          style={{ width: `${pct}%`, backgroundColor: accentBg[accent] }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-text-muted mt-1 text-right">
          {value} / {max}
        </p>
      )}
    </div>
  );
}
