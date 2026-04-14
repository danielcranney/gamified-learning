import type { Song } from '@/types';

interface Props {
  song: Song;
  onClick: (song: Song) => void;
}

export function SongCard({ song, onClick }: Props) {
  return (
    <button
      onClick={() => onClick(song)}
      className="group relative flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] active:scale-95 transition-all duration-200 aspect-square overflow-hidden"
      style={{ boxShadow: `0 0 24px -6px ${song.color}50` }}
    >
      {/* Radial glow backdrop */}
      <div
        className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 80%, ${song.color}, transparent 70%)`,
        }}
      />

      <span className="text-3xl sm:text-4xl relative">{song.emoji}</span>
      <span className="text-xs sm:text-sm font-bold text-white text-center leading-tight relative">
        {song.title}
      </span>
      <span className="text-[10px] sm:text-xs text-white/30 relative">
        {song.notes.length} notes
      </span>
    </button>
  );
}
