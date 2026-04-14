'use client';

import { useState, useCallback, useRef } from 'react';
import type { KeyAnimState } from '@/types';

export function useAnimationState() {
  const [states, setStates] = useState<Record<string, KeyAnimState>>({});
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const clearTimer = (id: string) => {
    if (timers.current[id]) {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
  };

  /** Mark one note as active (glowing), everything else idle. */
  const setActive = useCallback((noteId: string) => {
    setStates(prev => {
      const next: Record<string, KeyAnimState> = {};
      for (const k of Object.keys(prev)) next[k] = 'idle';
      next[noteId] = 'active';
      return next;
    });
  }, []);

  /** Flash a note as correct, then call onDone after the animation. */
  const setCorrect = useCallback((noteId: string, onDone: () => void) => {
    clearTimer(noteId);
    setStates(prev => ({ ...prev, [noteId]: 'correct' }));
    timers.current[noteId] = setTimeout(() => {
      setStates(prev => ({ ...prev, [noteId]: 'idle' }));
      onDone();
    }, 340);
  }, []);

  /** Shake a note as wrong, then auto-restore to idle. */
  const setWrong = useCallback((noteId: string) => {
    clearTimer(noteId);
    setStates(prev => ({ ...prev, [noteId]: 'wrong' }));
    timers.current[noteId] = setTimeout(() => {
      setStates(prev => ({ ...prev, [noteId]: 'idle' }));
    }, 420);
  }, []);

  const resetAll = useCallback(() => {
    setStates({});
  }, []);

  return { states, setActive, setCorrect, setWrong, resetAll };
}
