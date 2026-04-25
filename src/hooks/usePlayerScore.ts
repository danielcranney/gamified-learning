'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'bella-total-score';

export function usePlayerScore() {
  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        setTotalScore(parseInt(stored, 10) || 0);
      }
    }
  }, []);

  function addScore(roundScore: number) {
    setTotalScore((prev) => {
      const next = prev + roundScore;
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, String(next));
      }
      return next;
    });
  }

  function resetScore() {
    setTotalScore(0);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  return { totalScore, addScore, resetScore };
}
