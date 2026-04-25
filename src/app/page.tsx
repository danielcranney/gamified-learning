'use client';

import React, { useReducer, useEffect } from 'react';
import type { AppState, AppEvent } from '@/types';
import { usePlayerScore } from '@/hooks/usePlayerScore';
import { PlayerBar } from '@/components/layout/PlayerBar';
import { LobbyScreen } from '@/components/screens/LobbyScreen';
import { GameScreen } from '@/components/screens/GameScreen';
import { ResultsScreen } from '@/components/screens/ResultsScreen';

const initialState: AppState = {
  screen: 'lobby',
  activeGameId: null,
  lastRoundScore: null,
};

function reducer(state: AppState, event: AppEvent): AppState {
  switch (event.type) {
    case 'START_GAME':
      return { screen: 'game', activeGameId: event.gameId, lastRoundScore: null };
    case 'FINISH_GAME':
      return { ...state, screen: 'results', lastRoundScore: event.score };
    case 'QUIT_GAME':
      return { screen: 'lobby', activeGameId: null, lastRoundScore: null };
    case 'PLAY_AGAIN':
      return { ...state, screen: 'game', lastRoundScore: null };
    case 'BACK_TO_LOBBY':
      return { screen: 'lobby', activeGameId: null, lastRoundScore: null };
    default:
      return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { totalScore, addScore } = usePlayerScore();

  function handleFinishGame(score: number) {
    addScore(score);
    dispatch({ type: 'FINISH_GAME', score });
  }

  // Scroll to top on screen change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [state.screen]);

  return (
    <main className="min-h-dvh bg-bg-primary pb-24">
      <div className="max-w-lg mx-auto px-4 py-6">
        {state.screen === 'lobby' && (
          <LobbyScreen onStartGame={(gameId) => dispatch({ type: 'START_GAME', gameId })} />
        )}

        {state.screen === 'game' && state.activeGameId && (
          <GameScreen
            gameId={state.activeGameId}
            onFinish={handleFinishGame}
            onQuit={() => dispatch({ type: 'QUIT_GAME' })}
          />
        )}

        {state.screen === 'results' && state.lastRoundScore !== null && (
          <ResultsScreen
            score={state.lastRoundScore}
            onPlayAgain={() => dispatch({ type: 'PLAY_AGAIN' })}
            onBackToLobby={() => dispatch({ type: 'BACK_TO_LOBBY' })}
          />
        )}
      </div>

      <PlayerBar totalScore={totalScore} />
    </main>
  );
}
