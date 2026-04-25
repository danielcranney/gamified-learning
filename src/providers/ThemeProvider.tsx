'use client';

import { useLayoutEffect } from 'react';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('learn-play-theme');
      if (stored === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  return <>{children}</>;
}
