import type { Country, FlagQuestion, QuestionResult } from '@/types';
import { COUNTRIES } from '@/data/flags/countries';

function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function generateFlagQuestions(): FlagQuestion[] {
  const shuffled = shuffleArray(COUNTRIES);
  const selected = shuffled.slice(0, 10);
  const remaining = shuffled.slice(10);

  return selected.map((country, index) => {
    const distractors = shuffleArray(remaining).slice(0, 3);
    const options = shuffleArray([country, ...distractors]);
    const correctIndex = options.findIndex((o: Country) => o.code === country.code);

    return {
      id: `q-${index}`,
      country,
      options,
      correctIndex,
    };
  });
}

export function calculateScore(results: QuestionResult[]): number {
  const correct = results.filter((r) => r.answeredCorrectly).length;
  return correct * 10;
}
