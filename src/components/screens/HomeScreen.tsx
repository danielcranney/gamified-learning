'use client';

import { useState, useRef } from 'react';
import { SONGS } from '@/lib/songs';
import type { Song } from '@/types';

interface Props {
  onSelectSong: (song: Song) => void;
  onFreePlay: () => void;
}

export function HomeScreen({ onSelectSong, onFreePlay }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const song = SONGS[activeIdx];
  const prev = () => setActiveIdx(i => (i - 1 + SONGS.length) % SONGS.length);
  const next = () => setActiveIdx(i => (i + 1) % SONGS.length);

  // Swipe gesture support
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta < -40) next();
    else if (delta > 40) prev();
    touchStartX.current = null;
  };

  return (
    <div className="flex flex-col h-dvh bg-[#0a0a14] overflow-hidden">
      {/* Header */}
      <div className="text-center pt-8 pb-2 shrink-0">
        <span className="text-4xl">🎹</span>
        <h1 className="text-2xl font-black text-white mt-1 tracking-tight">
          Melody Magic
        </h1>
        <p className="text-white/30 text-xs mt-1">Swipe or tap to choose a song</p>
      </div>

      {/* Song carousel */}
      <div
        className="flex-1 flex flex-col items-center justify-center px-6 select-none"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Card */}
        <div
          className="w-full max-w-xs relative rounded-3xl overflow-hidden border border-white/10"
          style={{ boxShadow: `0 0 60px -10px ${song.color}60` }}
        >
          {/* Radial glow background */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at 50% 40%, ${song.color}50 0%, transparent 70%)`,
            }}
          />
          <div className="relative flex flex-col items-center justify-center gap-3 py-12 px-6">
            <span className="text-8xl leading-none">{song.emoji}</span>
            <h2 className="text-xl font-black text-white text-center mt-2">
              {song.title}
            </h2>
            <span className="text-white/35 text-sm">{song.notes.length} notes</span>
          </div>
        </div>

        {/* Navigation row */}
        <div className="flex items-center gap-6 mt-6">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 active:scale-95 transition-all touch-manipulation"
          >
            ‹
          </button>

          {/* Dot indicators */}
          <div className="flex gap-2">
            {SONGS.map((s, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className="touch-manipulation transition-all duration-200"
              >
                <div
                  className="rounded-full transition-all duration-200"
                  style={{
                    width: i === activeIdx ? 20 : 6,
                    height: 6,
                    backgroundColor: i === activeIdx ? song.color : 'rgba(255,255,255,0.25)',
                  }}
                />
              </button>
            ))}
          </div>

          <button
            onClick={next}
            className="w-10 h-10 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 active:scale-95 transition-all touch-manipulation"
          >
            ›
          </button>
        </div>
      </div>

      {/* Action buttons */}
      <div className="shrink-0 px-6 pb-8 flex flex-col gap-3">
        <button
          onClick={() => onSelectSong(song)}
          className="w-full py-4 rounded-2xl font-black text-white text-lg active:scale-[0.97] transition-transform touch-manipulation"
          style={{ backgroundColor: song.color }}
        >
          Play {song.title}
        </button>
        <button
          onClick={onFreePlay}
          className="w-full py-3 rounded-2xl border border-white/15 bg-white/[0.04] font-bold text-white/65 text-base active:scale-[0.97] transition-transform touch-manipulation flex items-center justify-center gap-2"
        >
          <span>🎸</span> Free Play
        </button>
      </div>
    </div>
  );
}
