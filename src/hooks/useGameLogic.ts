'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Song, GameScore } from '@/types';
import { useAudioEngine } from './useAudioEngine';
import { useAnimationState } from './useAnimationState';

interface Props {
  song: Song | null;
  onComplete: (score: GameScore) => void;
}

export function useGameLogic({ song, onComplete }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mistakes, setMistakes] = useState(0);

  const { unlock, playNote, playWrong, playFanfare } = useAudioEngine();
  const { states: keyStates, setActive, setCorrect, setWrong, resetAll } =
    useAnimationState();

  useEffect(() => {
    if (song?.notes.length) {
      setActive(song.notes[0]);
    } else {
      resetAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [song]);

  useEffect(() => {
    if (song?.notes[currentIndex]) {
      setActive(song.notes[currentIndex]);
    }
  }, [currentIndex, song, setActive]);

  const handleKeyPress = useCallback(
    (noteId: string) => {
      // unlock() MUST be called first — it runs synchronously within the
      // user gesture and satisfies the browser's audio autoplay policy.
      unlock();

      if (!song) {
        playNote(noteId);
        setCorrect(noteId, () => {});
        return;
      }

      const target = song.notes[currentIndex];

      if (noteId === target) {
        playNote(noteId);
        setCorrect(noteId, () => {
          const next = currentIndex + 1;
          if (next >= song.notes.length) {
            playFanfare();
            onComplete({ total: song.notes.length, mistakes });
          } else {
            setCurrentIndex(next);
          }
        });
      } else {
        playWrong();
        setMistakes(m => m + 1);
        setWrong(noteId);
      }
    },
    [
      song,
      currentIndex,
      mistakes,
      unlock,
      playNote,
      playWrong,
      playFanfare,
      setCorrect,
      setWrong,
      onComplete,
    ],
  );

  return {
    currentIndex,
    mistakes,
    keyStates,
    handleKeyPress,
    currentNote: song ? (song.notes[currentIndex] ?? null) : null,
    upcomingNotes: song ? song.notes.slice(currentIndex + 1, currentIndex + 4) : [],
    progress: song ? currentIndex / song.notes.length : 0,
  };
}
