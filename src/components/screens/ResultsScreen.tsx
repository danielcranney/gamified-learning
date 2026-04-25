'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { usePlayerScore } from '@/hooks/usePlayerScore';

interface ResultsScreenProps {
  score: number;
  onPlayAgain: () => void;
  onBackToLobby: () => void;
}

function starCount(score: number): number {
  if (score >= 80) return 3;
  if (score >= 50) return 2;
  if (score >= 20) return 1;
  return 0;
}

const messages: Record<number, string> = {
  3: "Amazing! You're a geography genius! 🎉",
  2: 'Great job! You know your flags! 👏',
  1: 'Good effort! Keep practising! 💪',
  0: "Don't give up — try again! 🌟",
};

export function ResultsScreen({ score, onPlayAgain, onBackToLobby }: ResultsScreenProps) {
  const stars = starCount(score);
  const { totalScore } = usePlayerScore();

  return (
    <div className="flex flex-col items-center gap-8 py-6 animate-fade-up">
      {/* Stars */}
      <div className="flex items-center gap-3">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="text-5xl"
            style={{
              animationDelay: `${i * 150}ms`,
              animation:
                i < stars
                  ? `star-pop var(--duration-pop) cubic-bezier(0.34,1.56,0.64,1) ${i * 150}ms forwards`
                  : 'none',
              opacity: i < stars ? 0 : 0.2,
              display: 'inline-block',
            }}
          >
            ⭐
          </span>
        ))}
      </div>

      {/* Score */}
      <div className="text-center">
        <p
          className="text-6xl font-black tabular-nums"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-accent-blue)' }}
        >
          {score}
          <span className="text-3xl text-text-muted font-bold"> / 100</span>
        </p>
        <p className="text-text-secondary mt-2 font-medium">{messages[stars]}</p>
      </div>

      {/* Total score */}
      <div className="w-full rounded-card bg-bg-secondary border border-border px-5 py-4 text-center">
        <p className="text-text-muted text-sm">Total score</p>
        <p className="text-text-primary font-bold text-xl tabular-nums mt-0.5">
          ⭐ {totalScore.toLocaleString()} pts
        </p>
      </div>

      {/* Actions */}
      <div className="w-full flex flex-col gap-3">
        <Button variant="primary" size="lg" fullWidth onClick={onPlayAgain}>
          Play Again
        </Button>
        <Button variant="secondary" size="lg" fullWidth onClick={onBackToLobby}>
          Back to Lobby
        </Button>
      </div>
    </div>
  );
}
