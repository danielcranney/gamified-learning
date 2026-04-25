'use client';

import React from 'react';
import { Avatar } from '@/components/ui/Avatar';

interface PlayerBarProps {
  totalScore: number;
}

export function PlayerBar({ totalScore }: PlayerBarProps) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-playerbar-bg border-t border-playerbar-border"
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
    >
      <div className="flex items-center gap-3">
        <Avatar size="sm" initial="B" />
        <span className="font-bold text-text-primary text-sm">Bella</span>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="text-lg" aria-hidden="true">⭐</span>
        <span className="font-bold text-text-primary text-sm tabular-nums">
          {totalScore.toLocaleString()}
        </span>
        <span className="text-text-muted text-xs">pts</span>
      </div>
    </div>
  );
}
