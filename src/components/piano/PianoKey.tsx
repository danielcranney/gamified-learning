'use client';

import { NOTE_COLORS } from '@/lib/noteColors';
import { NOTE_LABELS } from '@/lib/noteFrequencies';
import type { KeyAnimState } from '@/types';

interface Props {
  noteId: string;
  animState: KeyAnimState;
  onPress: (noteId: string) => void;
}

export function PianoKey({ noteId, animState, onPress }: Props) {
  const color = NOTE_COLORS[noteId];
  const label = NOTE_LABELS[noteId] ?? noteId;

  const isActive = animState === 'active';
  const isCorrect = animState === 'correct';
  const isWrong = animState === 'wrong';

  // Background brightens on correct flash
  const bg = isCorrect ? color.lightHex : color.hex;

  // Glow ring: pulse when active, big burst when correct
  const shadow = isActive
    ? `0 0 18px 5px ${color.hex}88, 0 0 36px 10px ${color.hex}44`
    : isCorrect
      ? `0 0 32px 10px ${color.lightHex}99, 0 0 60px 18px ${color.hex}55`
      : 'none';

  const animClass = isActive
    ? 'animate-key-pulse'
    : isCorrect
      ? 'animate-key-correct'
      : isWrong
        ? 'animate-key-shake'
        : '';

  return (
    <button
      // onPointerDown fires on both mouse and touch with minimal latency
      onPointerDown={e => {
        e.preventDefault();
        onPress(noteId);
      }}
      style={{ backgroundColor: bg, boxShadow: shadow }}
      className={[
        'flex-1',
        // Piano key shape: flat top, rounded bottom
        'rounded-t-sm rounded-b-2xl sm:rounded-b-3xl',
        // Tall enough for easy finger tapping
        'min-h-[90px] sm:min-h-[130px]',
        // Label at the bottom
        'flex items-end justify-center pb-3 sm:pb-4',
        // Touch behaviour
        'touch-none select-none cursor-pointer',
        // Subtle border for depth
        'border border-white/20',
        // Smooth colour transitions
        'transition-colors duration-75',
        // Active scale pop
        isActive ? 'scale-[1.03]' : '',
        // Animation class
        animClass,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="text-sm sm:text-base font-black text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
        {label}
      </span>
    </button>
  );
}
