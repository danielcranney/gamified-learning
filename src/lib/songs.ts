import type { Song } from '@/types';

export const SONGS: Song[] = [
  {
    id: 'twinkle',
    title: 'Twinkle Twinkle',
    emoji: '⭐',
    color: '#EAB308',
    notes: [
      'C4','C4','G4','G4','A4','A4','G4',
      'F4','F4','E4','E4','D4','D4','C4',
    ],
  },
  {
    id: 'mary',
    title: 'Mary Had a Little Lamb',
    emoji: '🐑',
    color: '#22C55E',
    notes: [
      'E4','D4','C4','D4','E4','E4','E4',
      'D4','D4','D4',
      'E4','G4','G4',
    ],
  },
  {
    id: 'hotcross',
    title: 'Hot Cross Buns',
    emoji: '🍞',
    color: '#F97316',
    notes: [
      'E4','D4','C4',
      'E4','D4','C4',
      'C4','C4','C4','C4',
      'D4','D4','D4','D4',
      'E4','D4','C4',
    ],
  },
  {
    id: 'rowrow',
    title: 'Row Your Boat',
    emoji: '🚣',
    color: '#06B6D4',
    notes: [
      'C4','C4','C4','D4','E4',
      'E4','D4','E4','F4','G4',
    ],
  },
  {
    id: 'ode',
    title: 'Ode to Joy',
    emoji: '🎵',
    color: '#8B5CF6',
    notes: [
      'E4','E4','F4','G4',
      'G4','F4','E4','D4',
      'C4','C4','D4','E4',
      'E4','D4','D4',
    ],
  },
  {
    id: 'birthday',
    title: 'Happy Birthday',
    emoji: '🎂',
    color: '#EC4899',
    notes: [
      'G4','G4','A4','G4','C5','B4',
      'G4','G4','A4','G4','D4','C5',
    ],
  },
];
