'use client';

import { NOTE_COLORS } from '@/lib/noteColors';
import { NOTE_LABELS } from '@/lib/noteFrequencies';
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
    currentNote,
    upcomingNotes,
    progress,
  } = useGameLogic({ song, onComplete });

  const isFreePlay = !song;
  const noteColor = currentNote ? NOTE_COLORS[currentNote] : null;
  const noteLabel = currentNote ? NOTE_LABELS[currentNote] : null;

  return (
    <div className="flex flex-col h-dvh bg-[#0F0F1A] overflow-hidden">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-4 pt-4 pb-2 shrink-0">
        <button
          onClick={onHome}
          className="text-2xl text-white/50 hover:text-white transition-colors px-1 leading-none"
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

      {/* ── Progress bar (song mode only) ─────────────────────────────────── */}
      {!isFreePlay && song && (
        <div className="px-4 pb-1 shrink-0">
          <ProgressBar
            value={progress}
            current={currentIndex}
            total={song.notes.length}
          />
        </div>
      )}

      {/* ── Note indicator ────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 gap-4">
        {isFreePlay ? (
          <div className="text-center">
            <div className="text-5xl mb-2">🎹</div>
            <p className="text-white/40 text-sm">Play any note you like!</p>
          </div>
        ) : currentNote ? (
          <>
            {/* Current note badge */}
            <div className="text-center">
              <p className="text-white/35 text-xs font-semibold uppercase tracking-widest mb-3">
                Tap this key
              </p>
              <div
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center text-4xl sm:text-5xl font-black text-white mx-auto animate-key-pulse"
                style={{
                  backgroundColor: noteColor?.hex,
                  boxShadow: `0 0 28px 6px ${noteColor?.hex}70, 0 0 56px 14px ${noteColor?.hex}35`,
                }}
              >
                {noteLabel}
              </div>
            </div>

            {/* Upcoming notes */}
            {upcomingNotes.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-white/25 uppercase tracking-wider">
                  Next
                </span>
                {upcomingNotes.map((note, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white/70"
                    style={{
                      backgroundColor: `${NOTE_COLORS[note]?.hex}55`,
                    }}
                  >
                    {NOTE_LABELS[note]}
                  </div>
                ))}
              </div>
            )}
          </>
        ) : null}
      </div>

      {/* ── Piano keyboard ────────────────────────────────────────────────── */}
      <div className="shrink-0 pb-6 px-1 sm:px-2">
        <PianoKeyboard keyStates={keyStates} onKeyPress={handleKeyPress} />
      </div>
    </div>
  );
}
