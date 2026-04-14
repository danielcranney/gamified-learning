'use client';

import { NOTE_COLORS } from '@/lib/noteColors';
import { NOTE_LABELS } from '@/lib/noteFrequencies';

interface Props {
  notes: string[];
  currentIndex: number;
}

const BLOCK_W = 52;   // px — width of each note block
const BLOCK_H = 52;   // px
const GAP = 8;        // px — gap between blocks
const STEP = BLOCK_W + GAP;
const ANCHOR = 24;    // px — how far from the left edge the active block sits

export function NoteScroller({ notes, currentIndex }: Props) {
  // Translate the whole row so the active block lands at ANCHOR
  const translateX = ANCHOR - currentIndex * STEP;

  return (
    <div className="relative w-full overflow-hidden" style={{ height: BLOCK_H + 24 }}>
      {/* Static "slot" highlight at the anchor position */}
      <div
        className="absolute top-3 rounded-xl border-2 border-white/40 pointer-events-none"
        style={{
          left: ANCHOR,
          width: BLOCK_W,
          height: BLOCK_H,
          boxShadow: '0 0 24px 6px rgba(255,255,255,0.15)',
        }}
      />

      {/* Scrolling note row */}
      <div
        className="absolute top-3 flex"
        style={{
          gap: GAP,
          transform: `translateX(${translateX}px)`,
          transition: 'transform 0.28s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          willChange: 'transform',
        }}
      >
        {notes.map((note, i) => {
          const color = NOTE_COLORS[note];
          const isPast = i < currentIndex;
          const isCurrent = i === currentIndex;

          return (
            <div
              key={i}
              className="flex-shrink-0 flex items-center justify-center font-black text-lg rounded-xl transition-opacity duration-200"
              style={{
                width: BLOCK_W,
                height: BLOCK_H,
                backgroundColor: isPast
                  ? `${color.hex}30`
                  : isCurrent
                    ? color.hex
                    : `${color.hex}55`,
                boxShadow: isCurrent
                  ? `0 0 20px 4px ${color.hex}70`
                  : 'none',
                color: isPast ? `${color.hex}60` : '#fff',
                transform: isCurrent ? 'scale(1.08)' : 'scale(1)',
              }}
            >
              {isPast ? (
                <span className="text-base opacity-60">✓</span>
              ) : (
                <span>{NOTE_LABELS[note]}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
