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
      const engine = getEngine();
      engine.init(); // safe to call inside pointer event
      const freq = NOTE_FREQUENCIES[noteId];
      if (freq) engine.playNote(freq);
    },
    [getEngine],
  );

  const playWrong = useCallback(() => {
    const engine = getEngine();
    engine.init();
    engine.playWrong();
  }, [getEngine]);

  const playFanfare = useCallback(() => {
    const engine = getEngine();
    engine.init();
    engine.playFanfare();
  }, [getEngine]);

  return { playNote, playWrong, playFanfare };
}
