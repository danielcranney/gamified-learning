'use client';

import { useRef, useCallback } from 'react';
import { AudioEngine } from '@/lib/audioEngine';
import { NOTE_FREQUENCIES } from '@/lib/noteFrequencies';

export function useAudioEngine() {
  const engineRef = useRef<AudioEngine | null>(null);

  const getEngine = useCallback((): AudioEngine => {
    if (!engineRef.current) engineRef.current = new AudioEngine();
    return engineRef.current;
  }, []);

  /**
   * Call this synchronously inside the pointer/click handler BEFORE
   * calling playNote — unlock() must run within the user gesture.
   */
  const unlock = useCallback(() => {
    getEngine().unlock();
  }, [getEngine]);

  const playNote = useCallback(
    (noteId: string) => {
      const freq = NOTE_FREQUENCIES[noteId];
      if (freq) getEngine().playNote(freq);
    },
    [getEngine],
  );

  const playWrong = useCallback(() => {
    getEngine().playWrong();
  }, [getEngine]);

  const playFanfare = useCallback(() => {
    getEngine().playFanfare();
  }, [getEngine]);

  return { unlock, playNote, playWrong, playFanfare };
}
