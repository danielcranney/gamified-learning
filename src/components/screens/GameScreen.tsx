'use client';

import React from 'react';
import { FlagQuizGame } from '@/components/games/flag-quiz/FlagQuizGame';

interface GameScreenProps {
  gameId: string;
  onFinish: (score: number) => void;
  onQuit: () => void;
}

export function GameScreen({ gameId, onFinish, onQuit }: GameScreenProps) {
  switch (gameId) {
    case 'flag-quiz':
      return <FlagQuizGame onFinish={onFinish} onQuit={onQuit} />;
    default:
      return (
        <div className="text-center py-12">
          <p className="text-text-secondary">Game not found: {gameId}</p>
        </div>
      );
  }
}
