'use client';

import React from 'react';
import type { Country, AnswerState } from '@/types';

interface AnswerOptionProps {
  country: Country;
  index: number;
  correctIndex: number;
  selectedIndex: number | null;
  onSelect: (index: number) => void;
}

const stateClasses: Record<AnswerState, string> = {
  idle: 'border-border bg-bg-card text-text-primary hover:border-accent-blue hover:bg-bg-secondary',
  correct: 'border-correct bg-correct/10 text-correct animate-correct-flash',
  wrong: 'border-wrong bg-wrong/10 text-wrong animate-wrong-shake',
};

function deriveState(
  index: number,
  correctIndex: number,
  selectedIndex: number | null,
): AnswerState {
  if (selectedIndex === null) return 'idle';
  if (index === correctIndex) return 'correct';
  if (index === selectedIndex) return 'wrong';
  return 'idle';
}

export function AnswerOption({
  country,
  index,
  correctIndex,
  selectedIndex,
  onSelect,
}: AnswerOptionProps) {
  const state = deriveState(index, correctIndex, selectedIndex);
  const isDimmed =
    selectedIndex !== null && state === 'idle' && index !== correctIndex;

  return (
    <button
      onClick={() => {
        if (selectedIndex === null) onSelect(index);
      }}
      disabled={selectedIndex !== null}
      className={[
        'w-full min-h-[3.5rem] px-4 py-3 rounded-btn border-2 font-semibold text-sm text-left transition-all duration-150 cursor-pointer',
        stateClasses[state],
        isDimmed ? 'opacity-40' : '',
        selectedIndex !== null ? 'cursor-default' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {country.name}
    </button>
  );
}
