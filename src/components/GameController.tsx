'use client';

import { useState } from 'react';
import type { Screen, GameScore } from '@/types';
import type { Song } from '@/types';
import { HomeScreen } from './screens/HomeScreen';
import { GameScreen } from './screens/GameScreen';
import { CompletionScreen } from './screens/CompletionScreen';

export function GameController() {
  const [screen, setScreen] = useState<Screen>('home');
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [finalScore, setFinalScore] = useState<GameScore | null>(null);
  // Incrementing this key forces GameScreen to fully remount on replay
  const [gameKey, setGameKey] = useState(0);

  const handleSelectSong = (song: Song) => {
    setSelectedSong(song);
    setScreen('game');
  };

  const handleFreePlay = () => {
    setSelectedSong(null);
    setScreen('game');
  };

  const handleComplete = (score: GameScore) => {
    setFinalScore(score);
    setScreen('completion');
  };

  const handleReplay = () => {
    setGameKey(k => k + 1);
    setScreen('game');
  };

  const handleHome = () => {
    setScreen('home');
    setSelectedSong(null);
    setFinalScore(null);
  };

  return (
    <>
      {screen === 'home' && (
        <HomeScreen onSelectSong={handleSelectSong} onFreePlay={handleFreePlay} />
      )}

      {screen === 'game' && (
        <GameScreen
          key={gameKey}
          song={selectedSong}
          onComplete={handleComplete}
          onHome={handleHome}
        />
      )}

      {screen === 'completion' && selectedSong && finalScore && (
        <CompletionScreen
          song={selectedSong}
          score={finalScore}
          onReplay={handleReplay}
          onHome={handleHome}
        />
      )}
    </>
  );
}
