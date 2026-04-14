export type Screen = 'home' | 'game' | 'completion';
export type GameMode = 'song' | 'freeplay';
export type KeyAnimState = 'idle' | 'active' | 'correct' | 'wrong';

export interface Song {
  id: string;
  title: string;
  emoji: string;
  color: string;
  notes: string[];
}

export interface GameScore {
  total: number;
  mistakes: number;
}

export interface NoteColorConfig {
  hex: string;
  lightHex: string;
}
