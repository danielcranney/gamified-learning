'use client';

import { NoteScroller } from '@/components/NoteScroller';
import { PianoKeyboard } from '@/components/piano/PianoKeyboard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useGameLogic } from '@/hooks/useGameLogic';
import type { Song, GameScore } from '@/types';

interface Props {
  song: Song | null;
  onComplete: (score: GameScore) => void;
  onHome: () => void;
}

export function GameScreen({ song, onComplete, onHome }: Props) {
  const {
    currentIndex,
    mistakes,
    keyStates,
    handleKeyPress,
    progress,
  } = useGameLogic({ song, onComplete });

  const isFreePlay = !song;

  return (
    <div className="flex flex-col h-dvh bg-[#0a0a14] overflow-hidden">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-4 pt-4 pb-2 shrink-0">
        <button
          onClick={onHome}
          className="text-white/50 hover:text-white transition-colors text-2xl font-bold px-1 leading-none touch-manipulation"
          aria-label="Go home"
        >
          ←
        </button>
        <h2 className="text-sm sm:text-base font-bold text-white/80 truncate mx-2">
          {song ? `${song.emoji} ${song.title}` : '🎸 Free Play'}
        </h2>
        <div className="text-xs text-white/40 min-w-[40px] text-right tabular-nums">
          {!isFreePlay && mistakes > 0 && `✗ ${mistakes}`}
        </div>
      </header>

      {/* ── Progress bar ───────────────────────────────────────────────────── */}
      {!isFreePlay && song && (
        <div className="px-4 pb-1 shrink-0">
          <ProgressBar
            value={progress}
            current={currentIndex}
            total={song.notes.length}
          />
        </div>
      )}

      {/* ── Note scroller ──────────────────────────────────────────────────── */}
      <div className="shrink-0 px-0 pt-2 pb-1">
        {!isFreePlay && song ? (
          <NoteScroller notes={song.notes} currentIndex={currentIndex} />
        ) : (
          <div className="flex items-center justify-center h-[76px] text-white/25 text-sm">
            Tap any key to play
          </div>
        )}
      </div>

      {/* ── Spacer + hint ──────────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center">
        {!isFreePlay && song && (
          <p className="text-white/20 text-xs tracking-widest uppercase">
            tap the highlighted key ↓
          </p>
        )}
      </div>

      {/* ── Piano keyboard ─────────────────────────────────────────────────── */}
      <div className="shrink-0 pb-6 px-1 sm:px-2">
        <PianoKeyboard keyStates={keyStates} onKeyPress={handleKeyPress} />
      </div>
    </div>
  );
}
