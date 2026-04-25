'use client';

import React from 'react';

interface AvatarProps {
  initial?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-9 h-9 text-base',
  md: 'w-12 h-12 text-xl',
  lg: 'w-16 h-16 text-2xl',
};

export function Avatar({ initial = 'B', size = 'md', className = '' }: AvatarProps) {
  return (
    <div
      className={[
        'rounded-full flex items-center justify-center font-bold text-white select-none flex-shrink-0',
        sizeClasses[size],
        className,
      ].join(' ')}
      style={{
        background: 'linear-gradient(135deg, var(--color-accent-purple), var(--color-accent-blue))',
      }}
    >
      {initial}
    </div>
  );
}
