'use client';

import React from 'react';
import type { FlagQuestion as FlagQuestionType } from '@/types';
import { AnswerOption } from './AnswerOption';

interface FlagQuestionProps {
  question: FlagQuestionType;
  onAnswer: (selectedIndex: number) => void;
  selectedIndex: number | null;
}

export function FlagQuestion({ question, onAnswer, selectedIndex }: FlagQuestionProps) {
  return (
    <div className="flex flex-col items-center gap-6 animate-fade-up">
      {/* Flag image */}
      <div className="w-full max-w-xs mx-auto">
        <img
          src={`https://flagcdn.com/w320/${question.country.code}.png`}
          alt={`Flag of ${question.country.name}`}
          width={320}
          height={213}
          loading="eager"
          className="w-full rounded-xl shadow-card object-cover"
          style={{ aspectRatio: '320/213' }}
        />
      </div>

      <p className="text-text-secondary text-base font-medium text-center">
        Which country does this flag belong to?
      </p>

      {/* 2×2 answer grid */}
      <div className="w-full grid grid-cols-2 gap-3">
        {question.options.map((country, idx) => (
          <AnswerOption
            key={country.code}
            country={country}
            index={idx}
            correctIndex={question.correctIndex}
            selectedIndex={selectedIndex}
            onSelect={onAnswer}
          />
        ))}
      </div>
    </div>
  );
}
