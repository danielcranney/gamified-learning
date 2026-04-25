'use client';

import React from 'react';
import type { AccentColor } from '@/types';

interface BadgeProps {
  label: string;
  accent?: AccentColor;
  size?: 'sm' | 'md';
}

const accentClasses: Record<AccentColor, string> = {
  purple: 'bg-accent-purple/15 text-accent-purple',
  blue: 'bg-accent-blue/15 text-accent-blue',
  green: 'bg-accent-green/15 text-accent-green',
  yellow: 'bg-accent-yellow/15 text-accent-yellow',
  orange: 'bg-accent-orange/15 text-accent-orange',
};

export function Badge({ label, accent = 'blue', size = 'sm' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center font-semibold rounded-pill',
        accentClasses[accent],
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm',
      ].join(' ')}
    >
      {label}
    </span>
  );
}
