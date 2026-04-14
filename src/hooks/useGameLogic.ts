'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Song, GameScore } from '@/types';
import { useAudioEngine } from './useAudioEngine';
import { useAnimationState } from './useAnimationState';

interface Props {
  song: Song | null; // null = free play
  onComplete: (score: GameScore) => void;
}

export function useGameLogic({ song, onComplete }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mistakes, setMistakes] = useState(0);

  const { playNote, playWrong, playFanfare } = useAudioEngine();
  const { states: keyStates, setActive, setCorrect, setWrong, resetAll } =
    useAnimationState();

  // Illuminate the first note when the song loads
  useEffect(() => {
    if (song?.notes.length) {
      setActive(song.notes[0]);
    } else {
      resetAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [song]);

  // Illuminate the current note whenever the index advances
  useEffect(() => {
    if (song?.notes[currentIndex]) {
      setActive(song.notes[currentIndex]);
    }
  }, [currentIndex, song, setActive]);

  const handleKeyPress = useCallback(
    (noteId: string) => {
      // ── Free play ──────────────────────────────────────────────────────
      if (!song) {
        playNote(noteId);
        setCorrect(noteId, () => {});
        return;
      }

      const target = song.notes[currentIndex];

      if (noteId === target) {
        // ── Correct ──────────────────────────────────────────────────────
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
        // ── Wrong ────────────────────────────────────────────────────────
        playWrong();
        setMistakes(m => m + 1);
        setWrong(noteId);
      }
    },
    [
      song,
      currentIndex,
      mistakes,
      playNote,
      playWrong,
      playFanfare,
      setCorrect,
      setWrong,
      onComplete,
    ],
  );

  const upcomingNotes =
    song ? song.notes.slice(currentIndex + 1, currentIndex + 4) : [];

  return {
    currentIndex,
    mistakes,
    keyStates,
    handleKeyPress,
    currentNote: song ? song.notes[currentIndex] ?? null : null,
    upcomingNotes,
    progress: song ? currentIndex / song.notes.length : 0,
  };
}
