'use client';

import React, { useState } from 'react';
import type { GameDefinition } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import gamesData from '@/data/games.json';

interface LobbyScreenProps {
  onStartGame: (gameId: string) => void;
}

const games = (gamesData as { games: GameDefinition[] }).games;
const allCategories = ['All', ...Array.from(new Set(games.map((g) => g.category)))];

export function LobbyScreen({ onStartGame }: LobbyScreenProps) {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered =
    activeCategory === 'All' ? games : games.filter((g) => g.category === activeCategory);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="relative flex items-start justify-between">
        <div>
          <h1
            className="text-2xl font-black text-text-primary leading-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Hi Bella! 👋
          </h1>
          <p className="text-text-secondary text-sm mt-1">What do you want to learn today?</p>
        </div>
        <ThemeToggle />
      </div>

      {/* Category filter pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
        {allCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={[
              'flex-shrink-0 px-4 py-1.5 rounded-pill text-sm font-semibold transition-all duration-150 cursor-pointer border',
              activeCategory === cat
                ? 'bg-accent-blue text-white border-accent-blue'
                : 'bg-bg-secondary text-text-secondary border-border hover:border-accent-blue hover:text-text-primary',
            ].join(' ')}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Game grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((game, i) => (
          <div
            key={game.id}
            className="animate-card-bounce"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <GameCard game={game} onPlay={onStartGame} />
          </div>
        ))}
      </div>
    </div>
  );
}

function GameCard({
  game,
  onPlay,
}: {
  game: GameDefinition;
  onPlay: (gameId: string) => void;
}) {
  return (
    <Card accent={game.accent} className={game.available ? '' : 'relative overflow-hidden'}>
      <div className={game.available ? '' : 'opacity-50 pointer-events-none select-none'}>
        <div className="text-4xl mb-3" aria-hidden="true">
          {game.emoji}
        </div>
        <div className="flex items-start justify-between gap-2 mb-1">
          <h2 className="font-bold text-text-primary text-base leading-snug">{game.title}</h2>
          <Badge label={game.category} accent={game.accent} />
        </div>
        <p className="text-text-secondary text-sm mb-4">{game.description}</p>
        <Button
          variant="primary"
          size="sm"
          onClick={() => onPlay(game.id)}
          disabled={!game.available}
          style={
            game.available
              ? {
                  background: `linear-gradient(135deg, var(--color-accent-${game.accent}), var(--color-accent-${game.accent}))`,
                }
              : {}
          }
        >
          Play →
        </Button>
      </div>

      {!game.available && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-bg-card/90 text-text-secondary text-xs font-semibold px-3 py-1.5 rounded-pill border border-border">
            Coming soon
          </span>
        </div>
      )}
    </Card>
  );
}
