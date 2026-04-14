'use client';

import { useRef, useCallback } from 'react';
import { AudioEngine } from '@/lib/audioEngine';
import { NOTE_FREQUENCIES } from '@/lib/noteFrequencies';

export function useAudioEngine() {
  const engineRef = useRef<AudioEngine | null>(null);

  const getEngine = useCallback((): AudioEngine => {
    if (!engineRef.current) {
      engineRef.current = new AudioEngine();
    }
    return engineRef.current;
  }, []);

  const playNote = useCallback(
    (noteId: string) => {
      const freq = NOTE_FREQUENCIES[noteId];
      // playNote is async — void-call is intentional (fire-and-forget).
      // ensureRunning() inside will await ctx.resume() before scheduling audio.
      if (freq) void getEngine().playNote(freq);
    },
    [getEngine],
  );

  const playWrong = useCallback(() => {
    void getEngine().playWrong();
  }, [getEngine]);

  const playFanfare = useCallback(() => {
    getEngine().playFanfare();
  }, [getEngine]);

  return { playNote, playWrong, playFanfare };
}
