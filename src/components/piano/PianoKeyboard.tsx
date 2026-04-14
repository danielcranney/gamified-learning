'use client';

import { NOTE_ORDER } from '@/lib/noteFrequencies';
import { PianoKey } from './PianoKey';
import type { KeyAnimState } from '@/types';

interface Props {
  keyStates: Record<string, KeyAnimState>;
  onKeyPress: (noteId: string) => void;
}

export function PianoKeyboard({ keyStates, onKeyPress }: Props) {
  return (
    <div className="flex flex-row w-full max-w-2xl mx-auto gap-[3px] sm:gap-[5px] px-2">
      {NOTE_ORDER.map(noteId => (
        <PianoKey
          key={noteId}
          noteId={noteId}
          animState={keyStates[noteId] ?? 'idle'}
          onPress={onKeyPress}
        />
      ))}
    </div>
  );
}
