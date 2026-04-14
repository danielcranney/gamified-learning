import { SONGS } from '@/lib/songs';
import { SongCard } from '@/components/ui/SongCard';
import type { Song } from '@/types';

interface Props {
  onSelectSong: (song: Song) => void;
  onFreePlay: () => void;
}

export function HomeScreen({ onSelectSong, onFreePlay }: Props) {
  return (
    <div className="flex flex-col min-h-dvh bg-[#0F0F1A] px-4 pt-10 pb-6 overflow-y-auto">
      {/* Header */}
      <header className="text-center mb-8">
        <div className="text-5xl mb-3">🎹</div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Melody Magic
        </h1>
        <p className="text-white/40 mt-2 text-sm sm:text-base">
          Pick a song and tap the glowing keys!
        </p>
      </header>

      {/* Song grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
        {SONGS.map(song => (
          <SongCard key={song.id} song={song} onClick={onSelectSong} />
        ))}
      </div>

      {/* Free play */}
      <button
        onClick={onFreePlay}
        className="w-full mt-2 py-4 rounded-2xl border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] active:scale-[0.98] transition-all duration-200 text-white font-bold text-base flex items-center justify-center gap-2"
      >
        <span className="text-xl">🎸</span> Free Play
      </button>
    </div>
  );
}
