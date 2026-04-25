'use client';

import React from 'react';
import type { AccentColor } from '@/types';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  accent?: AccentColor;
  clickable?: boolean;
  onClick?: () => void;
}

const accentColors: Record<AccentColor, string> = {
  purple: '#8b5cf6',
  blue: '#3b82f6',
  green: '#22c55e',
  yellow: '#eab308',
  orange: '#f97316',
};

export function Card({
  children,
  className = '',
  accent,
  clickable = false,
  onClick,
}: CardProps) {
  return (
    <div
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        clickable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') onClick?.();
            }
          : undefined
      }
      style={
        accent
          ? {
              borderTop: `3px solid ${accentColors[accent]}`,
              boxShadow: 'var(--shadow-card)',
            }
          : { boxShadow: 'var(--shadow-card)' }
      }
      className={[
        'bg-bg-card rounded-card p-5',
        clickable
          ? 'cursor-pointer transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98]'
          : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}
