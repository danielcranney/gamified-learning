'use client';

import React, { useState, useEffect, useRef } from 'react';
import type { FlagQuestion, QuestionResult } from '@/types';
import { generateFlagQuestions, calculateScore } from '@/lib/flagGame';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { FlagQuestion as FlagQuestionComponent } from './FlagQuestion';

interface FlagQuizGameProps {
  onFinish: (score: number) => void;
  onQuit: () => void;
}

export function FlagQuizGame({ onFinish, onQuit }: FlagQuizGameProps) {
  const [questions] = useState<FlagQuestion[]>(() => generateFlagQuestions());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function handleAnswer(selected: number) {
    if (selectedIndex !== null) return;

    const correct = selected === questions[currentIndex].correctIndex;
    const newResult: QuestionResult = {
      questionId: questions[currentIndex].id,
      answeredCorrectly: correct,
    };
    const updatedResults = [...results, newResult];
    setResults(updatedResults);
    setSelectedIndex(selected);

    timerRef.current = setTimeout(() => {
      if (currentIndex < 9) {
        setCurrentIndex((i) => i + 1);
        setSelectedIndex(null);
      } else {
        onFinish(calculateScore(updatedResults));
      }
    }, 1400);
  }

  const question = questions[currentIndex];
  const progressValue = (currentIndex / 10) * 100;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onQuit}
          className="flex items-center gap-1.5 text-text-secondary hover:text-text-primary transition-colors text-sm font-medium cursor-pointer"
          aria-label="Quit game"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Quit
        </button>

        <span className="text-text-secondary text-sm font-medium tabular-nums">
          {currentIndex + 1} <span className="text-text-muted">/ 10</span>
        </span>

        <div className="w-12" />
      </div>

      {/* Progress bar */}
      <ProgressBar value={progressValue} accent="blue" />

      {/* Question */}
      <FlagQuestionComponent
        key={question.id}
        question={question}
        onAnswer={handleAnswer}
        selectedIndex={selectedIndex}
      />
    </div>
  );
}
