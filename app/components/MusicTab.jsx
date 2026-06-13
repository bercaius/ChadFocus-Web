'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Search, Volume2, Download, Music } from 'lucide-react';

export default function MusicTab() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('workout');
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const fetchMusic = async (searchQuery) => {
    setLoading(true);
    try {
      // Jamendo API for royalty-free music
      const res = await fetch(`https://api.jamendo.com/v3.0/tracks/?client_id=56d30c95&format=jsonpretty&limit=20&tags=${searchQuery}&include=musicinfo`);
      const data = await res.json();
      if (data.results) {
        setTracks(data.results);
      }
    } catch (err) {
      console.error('Music fetch error:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMusic(query);
  }, []);

  const playTrack = (track) => {
    if (currentTrack?.id === track.id) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play();
        }
      }, 100);
    }
  };

  const nextTrack = () => {
    if (!currentTrack) return;
    const idx = tracks.findIndex(t => t.id === currentTrack.id);
    if (idx < tracks.length - 1) {
      playTrack(tracks[idx + 1]);
    }
  };

  const prevTrack = () => {
    if (!currentTrack) return;
    const idx = tracks.findIndex(t => t.id === currentTrack.id);
    if (idx > 0) {
      playTrack(tracks[idx - 1]);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative z-10" style={{ maxHeight: 'calc(100vh - 4rem)' }}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="glass-panel rounded-2xl p-6 shadow-xl relative overflow-hidden border border-[var(--glass-border)]">
          <div className="absolute top-0 left-0 w-64 h-64 bg-[var(--accent-color)] opacity-5 rounded-full blur-3xl -ml-20 -mt-20 pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[var(--text-color)] to-[var(--accent-color)] tracking-tight">
                Ritim & Müzik Odası
              </h2>
              <p className="text-[var(--text-muted)] mt-2">
                Telifsiz ve reklamsız antrenman odaklı müzikler
              </p>
            </div>

            <div className="flex items-center bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl px-4 py-2 w-full md:w-auto">
              <Search className="w-5 h-5 text-[var(--text-muted)] mr-2" />
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchMusic(query)}
                placeholder="Tür ara (workout, phonk...)"
                className="bg-transparent border-none outline-none text-white w-full placeholder-zinc-600 font-mono text-sm"
              />
            </div>
          </div>

          {/* Player Banner */}
          {currentTrack && (
            <div className="bg-zinc-900/50 border border-[var(--accent-color)]/30 rounded-2xl p-4 mb-8 flex flex-col md:flex-row items-center gap-6 shadow-[0_0_20px_rgba(212,175,55,0.1)]">
              <img src={currentTrack.image} alt="cover" className="w-24 h-24 rounded-xl object-cover shadow-lg" />
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold text-white line-clamp-1">{currentTrack.name}</h3>
                <p className="text-[var(--accent-color)] font-mono text-sm">{currentTrack.artist_name}</p>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={prevTrack} className="p-3 bg-zinc-800 rounded-full hover:bg-zinc-700 transition-colors">
                  <SkipBack className="w-5 h-5 text-white" />
                </button>
                <button onClick={() => playTrack(currentTrack)} className="p-4 bg-[var(--accent-color)] rounded-full hover:scale-105 transition-transform shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                  {isPlaying ? <Pause className="w-6 h-6 text-black" /> : <Play className="w-6 h-6 text-black ml-1" />}
                </button>
                <button onClick={nextTrack} className="p-3 bg-zinc-800 rounded-full hover:bg-zinc-700 transition-colors">
                  <SkipForward className="w-5 h-5 text-white" />
                </button>
              </div>
              <a href={currentTrack.audiodownload} download target="_blank" rel="noopener noreferrer" className="p-3 border border-zinc-700 rounded-full hover:bg-zinc-800 transition-colors hidden md:block">
                <Download className="w-5 h-5 text-zinc-400" />
              </a>
            </div>
          )}

          {/* Hidden Audio Element */}
          <audio 
            ref={audioRef} 
            src={currentTrack?.audio} 
            onEnded={nextTrack}
            className="hidden"
          />

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Music className="w-10 h-10 text-[var(--accent-color)] animate-bounce" />
              <p className="text-[var(--text-muted)] animate-pulse font-mono text-sm tracking-widest">KÜTÜPHANE TARANIYOR...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tracks.map(track => (
                <div 
                  key={track.id}
                  onClick={() => playTrack(track)}
                  className={`flex items-center gap-4 p-3 rounded-xl border transition-all cursor-pointer group ${currentTrack?.id === track.id ? 'bg-[var(--accent-color)]/10 border-[var(--accent-color)]/50' : 'bg-[var(--glass-bg)] border-[var(--glass-border)] hover:border-[var(--accent-color)]/30'}`}
                >
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <img src={track.image} alt={track.name} className="w-full h-full object-cover rounded-lg" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                      {currentTrack?.id === track.id && isPlaying ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white ml-1" />}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-bold text-sm truncate ${currentTrack?.id === track.id ? 'text-[var(--accent-color)]' : 'text-zinc-200'}`}>{track.name}</h4>
                    <p className="text-xs text-zinc-500 truncate">{track.artist_name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
