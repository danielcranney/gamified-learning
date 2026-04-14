'use client';

import { useMemo } from 'react';
import { StarRating } from '@/components/ui/StarRating';
import type { Song, GameScore } from '@/types';

interface Props {
  song: Song;
  score: GameScore;
  onReplay: () => void;
  onHome: () => void;
}

function starsForMistakes(mistakes: number): number {
  if (mistakes === 0) return 3;
  if (mistakes <= 3) return 2;
  return 1;
}

const MESSAGES: Record<number, string[]> = {
  3: ['Perfect! 🎉', 'Flawless! 🌟', "You're a star! ⭐"],
  2: ['Great job! 👏', 'Well done! 🎊', 'Awesome! 🥳'],
  1: ['Keep going! 💪', 'Nice try! 🎵', "You'll get it! 🎹"],
};

export function CompletionScreen({ song, score, onReplay, onHome }: Props) {
  const stars = starsForMistakes(score.mistakes);
  const message = useMemo(() => {
    const pool = MESSAGES[stars];
    return pool[Math.floor(Math.random() * pool.length)];
  }, [stars]);

  return (
    <div className="flex flex-col h-dvh bg-[#0F0F1A] items-center justify-center px-6 text-center">
      <div
        className="flex flex-col items-center gap-5"
        style={{ animation: 'bounceIn 0.55s ease forwards' }}
      >
        {/* Song emoji */}
        <span className="text-6xl">{song.emoji}</span>

        {/* Headline */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">{message}</h2>
          <p className="text-white/40 text-sm mt-1">{song.title} complete!</p>
        </div>

        {/* Stars */}
        <div className="py-2">
          <StarRating stars={stars} />
          {score.mistakes > 0 && (
            <p className="text-white/25 text-xs mt-4">
              {score.mistakes} {score.mistakes === 1 ? 'mistake' : 'mistakes'}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 w-full max-w-xs mt-2">
          <button
            onClick={onReplay}
            className="py-4 rounded-2xl font-bold text-white text-base sm:text-lg active:scale-95 transition-transform"
            style={{ backgroundColor: song.color }}
          >
            Play Again
          </button>
          <button
            onClick={onHome}
            className="py-4 rounded-2xl border border-white/20 font-bold text-white/65 text-base sm:text-lg hover:bg-white/[0.06] active:scale-95 transition-all"
          >
            Choose Song
          </button>
        </div>
      </div>
    </div>
  );
}
