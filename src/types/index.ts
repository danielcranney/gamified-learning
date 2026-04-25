export type AccentColor = 'purple' | 'blue' | 'green' | 'yellow' | 'orange';

export interface GameDefinition {
  id: string;
  title: string;
  description: string;
  category: string;
  emoji: string;
  accent: AccentColor;
  available: boolean;
  questionCount: number;
}

export interface Country {
  name: string;
  code: string;
}

export interface FlagQuestion {
  id: string;
  country: Country;
  options: Country[];
  correctIndex: number;
}

export type AnswerState = 'idle' | 'correct' | 'wrong';

export interface QuestionResult {
  questionId: string;
  answeredCorrectly: boolean;
}

export type AppScreen = 'lobby' | 'game' | 'results';

export interface AppState {
  screen: AppScreen;
  activeGameId: string | null;
  lastRoundScore: number | null;
}

export type AppEvent =
  | { type: 'START_GAME'; gameId: string }
  | { type: 'FINISH_GAME'; score: number }
  | { type: 'QUIT_GAME' }
  | { type: 'PLAY_AGAIN' }
  | { type: 'BACK_TO_LOBBY' };
