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

  const bg = isCorrect ? color.lightHex : color.hex;

  const shadow = isActive
    ? `0 0 18px 5px ${color.hex}88, 0 0 36px 10px ${color.hex}44`
    : isCorrect
      ? `0 0 32px 10px ${color.lightHex}99`
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
      // onClick works universally on all mobile browsers as a trusted
      // user gesture for AudioContext unlock. touch-manipulation removes
      // the 300 ms tap delay so it feels as fast as pointerdown.
      onClick={() => onPress(noteId)}
      style={{ backgroundColor: bg, boxShadow: shadow }}
      className={[
        'flex-1',
        'rounded-t-sm rounded-b-2xl sm:rounded-b-3xl',
        'min-h-[90px] sm:min-h-[130px]',
        'flex items-end justify-center pb-3 sm:pb-4',
        // touch-manipulation: no double-tap zoom, instant click
        'touch-manipulation',
        'select-none cursor-pointer',
        'border border-white/20',
        'transition-colors duration-75',
        isActive ? 'scale-[1.03]' : '',
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
