'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Search, Download, Music, Plus, Library, X, Edit2 } from 'lucide-react';
import { useLocalStorage } from '@/lib/useLocalStorage';

export default function MusicTab() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('workout');
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Playlist State
  const [playlists, setPlaylists] = useLocalStorage('cf-playlists', []);
  const [activeView, setActiveView] = useState('discover'); // 'discover' | 'playlists' | 'playlist_detail'
  const [activePlaylist, setActivePlaylist] = useState(null);
  
  const audioRef = useRef(null);

  const fetchMusic = async (searchQuery) => {
    setLoading(true);
    try {
      // Jamendo API for royalty-free music
      const res = await fetch(`https://api.jamendo.com/v3.0/tracks/?client_id=56d30c95&format=jsonpretty&limit=20&tags=${searchQuery}&include=musicinfo`);
      if (!res.ok) throw new Error("API Limit");
      const data = await res.json();
      if (data.results) setTracks(data.results);
    } catch (err) {
      console.error('Music fetch error:', err);
      // Fallback dummy tracks if Jamendo is blocking or offline
      setTracks([
        { id: '1', name: 'Sigma Grindset Theme', artist_name: 'ChadBeats', image: '/images/app_logo.png?v=3', audio: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_24847f9f30.mp3?filename=phonk-brazilian-114259.mp3', audiodownload: '#' },
        { id: '2', name: 'Discipline Over Motivation', artist_name: 'GymPhonk', image: '/images/wallpaper_1.png?v=3', audio: 'https://cdn.pixabay.com/download/audio/2022/01/21/audio_403c9c676d.mp3?filename=aggressive-phonk-106456.mp3', audiodownload: '#' }
      ]);
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
      setTimeout(() => audioRef.current?.play(), 100);
    }
  };

  const nextTrack = () => {
    if (!currentTrack) return;
    const listToPlay = activeView === 'playlist_detail' && activePlaylist ? activePlaylist.tracks : tracks;
    const idx = listToPlay.findIndex(t => t.id === currentTrack.id);
    if (idx < listToPlay.length - 1) playTrack(listToPlay[idx + 1]);
    else if (listToPlay.length > 0) playTrack(listToPlay[0]); // loop back
  };

  const prevTrack = () => {
    if (!currentTrack) return;
    const listToPlay = activeView === 'playlist_detail' && activePlaylist ? activePlaylist.tracks : tracks;
    const idx = listToPlay.findIndex(t => t.id === currentTrack.id);
    if (idx > 0) playTrack(listToPlay[idx - 1]);
  };

  // Playlist Functions
  const createPlaylist = () => {
    const name = prompt('Çalma Listesi Adı:');
    if (!name) return;
    const newPl = { id: Date.now().toString(), name, cover: '/images/app_logo.png?v=3', tracks: [] };
    setPlaylists([...playlists, newPl]);
  };

  const addToPlaylist = (track, playlistId) => {
    const updated = playlists.map(p => {
      if (p.id === playlistId) {
        if (!p.tracks.find(t => t.id === track.id)) {
          return { ...p, tracks: [...p.tracks, track], cover: p.tracks.length === 0 ? track.image : p.cover };
        }
      }
      return p;
    });
    setPlaylists(updated);
    if (activePlaylist && activePlaylist.id === playlistId) {
      setActivePlaylist(updated.find(p => p.id === playlistId));
    }
    alert('Şarkı eklendi!');
  };

  const removeFromPlaylist = (trackId, playlistId) => {
    const updated = playlists.map(p => {
      if (p.id === playlistId) return { ...p, tracks: p.tracks.filter(t => t.id !== trackId) };
      return p;
    });
    setPlaylists(updated);
    if (activePlaylist && activePlaylist.id === playlistId) {
      setActivePlaylist(updated.find(p => p.id === playlistId));
    }
  };

  const deletePlaylist = (playlistId) => {
    if (confirm('Bu listeyi silmek istediğine emin misin?')) {
      setPlaylists(playlists.filter(p => p.id !== playlistId));
      setActiveView('playlists');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative z-10" style={{ maxHeight: 'calc(100vh - 4rem)' }}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="glass-panel rounded-2xl p-6 shadow-xl relative overflow-hidden border border-[var(--glass-border)] min-h-[500px]">
          <div className="absolute top-0 left-0 w-64 h-64 bg-[var(--accent-color)] opacity-5 rounded-full blur-3xl -ml-20 -mt-20 pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[var(--text-color)] to-[var(--accent-color)] tracking-tight">
                Gelişmiş Müzik Yöneticisi
              </h2>
              <div className="flex gap-4 mt-3">
                <button 
                  onClick={() => setActiveView('discover')} 
                  className={`text-sm font-bold pb-1 border-b-2 ${activeView==='discover'?'border-[var(--accent-color)] text-[var(--accent-color)]':'border-transparent text-zinc-500 hover:text-zinc-300'}`}
                >
                  Keşfet
                </button>
                <button 
                  onClick={() => setActiveView('playlists')} 
                  className={`text-sm font-bold pb-1 border-b-2 flex items-center gap-1 ${(activeView==='playlists'||activeView==='playlist_detail')?'border-[var(--accent-color)] text-[var(--accent-color)]':'border-transparent text-zinc-500 hover:text-zinc-300'}`}
                >
                  <Library className="w-4 h-4" /> Kütüphanem
                </button>
              </div>
            </div>

            {activeView === 'discover' && (
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
            )}
          </div>

          {/* PLAYER BANNER */}
          {currentTrack && (
            <div className="bg-zinc-900/80 border border-[var(--accent-color)]/50 rounded-2xl p-4 mb-8 flex flex-col md:flex-row items-center gap-6 shadow-[0_0_30px_rgba(212,175,55,0.15)] backdrop-blur-md">
              <img src={currentTrack.image} alt="cover" className="w-20 h-20 rounded-xl object-cover shadow-lg" />
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
            </div>
          )}
          <audio ref={audioRef} src={currentTrack?.audio} onEnded={nextTrack} className="hidden" />

          {/* VIEWS */}
          {activeView === 'discover' && (
            <>
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <Music className="w-10 h-10 text-[var(--accent-color)] animate-bounce" />
                  <p className="text-[var(--text-muted)] animate-pulse font-mono text-sm tracking-widest">KÜTÜPHANE TARANIYOR...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tracks.map(track => (
                    <div key={track.id} className={`flex flex-col p-3 rounded-xl border transition-all group ${currentTrack?.id === track.id ? 'bg-[var(--accent-color)]/10 border-[var(--accent-color)]/50' : 'bg-[var(--glass-bg)] border-[var(--glass-border)] hover:border-[var(--accent-color)]/30'}`}>
                      <div className="flex items-center gap-4 cursor-pointer" onClick={() => playTrack(track)}>
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
                      {/* Playlist Add Buttons */}
                      <div className="mt-3 pt-3 border-t border-zinc-800/50 flex flex-wrap gap-2">
                        {playlists.map(pl => (
                          <button key={pl.id} onClick={() => addToPlaylist(track, pl.id)} className="text-[9px] font-bold px-2 py-1 bg-zinc-800 hover:bg-zinc-700 rounded-md text-zinc-300 transition-colors">
                            + {pl.name}
                          </button>
                        ))}
                        {playlists.length === 0 && <span className="text-[9px] text-zinc-600">Önce kütüphaneden liste oluştur</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeView === 'playlists' && (
            <div className="space-y-6">
              <button onClick={createPlaylist} className="flex items-center gap-2 px-6 py-3 bg-[var(--accent-color)] text-black font-black rounded-xl hover:scale-105 transition-transform shadow-lg">
                <Plus className="w-5 h-5" /> YENİ LİSTE OLUŞTUR
              </button>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {playlists.map(pl => (
                  <div key={pl.id} onClick={() => { setActivePlaylist(pl); setActiveView('playlist_detail'); }} className="group cursor-pointer">
                    <div className="aspect-square rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden mb-3 relative shadow-xl group-hover:border-[var(--accent-color)] transition-colors">
                      <img src={pl.cover} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Play className="w-12 h-12 text-white" />
                      </div>
                    </div>
                    <h3 className="font-bold text-white text-lg">{pl.name}</h3>
                    <p className="text-xs text-zinc-500 font-mono">{pl.tracks.length} Şarkı</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeView === 'playlist_detail' && activePlaylist && (
            <div>
              <div className="flex items-end gap-6 mb-8 border-b border-zinc-800 pb-6">
                <img src={activePlaylist.cover} className="w-32 h-32 rounded-2xl shadow-2xl object-cover border border-zinc-700" />
                <div className="flex-1">
                  <p className="text-xs font-black tracking-widest text-zinc-500 uppercase mb-1">Çalma Listesi</p>
                  <h2 className="text-4xl font-black text-white mb-4">{activePlaylist.name}</h2>
                  <div className="flex gap-3">
                    <button onClick={() => { if(activePlaylist.tracks.length > 0) playTrack(activePlaylist.tracks[0]); }} className="px-8 py-3 bg-[var(--accent-color)] text-black font-black rounded-xl hover:scale-105 transition-transform shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                      Hepsini Çal
                    </button>
                    <button onClick={() => deletePlaylist(activePlaylist.id)} className="px-4 py-3 bg-red-500/10 text-red-500 font-bold rounded-xl hover:bg-red-500/20 transition-colors">
                      Sil
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {activePlaylist.tracks.length === 0 ? (
                  <p className="text-zinc-500 text-center py-10 font-mono">Bu liste şu an boş. Keşfet'ten şarkı ekle.</p>
                ) : (
                  activePlaylist.tracks.map((track, i) => (
                    <div key={track.id} className="flex items-center gap-4 p-3 hover:bg-zinc-900/50 rounded-xl group transition-colors">
                      <div className="w-8 text-center text-zinc-600 font-mono text-xs">{i + 1}</div>
                      <img src={track.image} className="w-10 h-10 rounded-md object-cover" />
                      <div className="flex-1 cursor-pointer" onClick={() => playTrack(track)}>
                        <h4 className={`font-bold text-sm ${currentTrack?.id === track.id ? 'text-[var(--accent-color)]' : 'text-white'}`}>{track.name}</h4>
                        <p className="text-xs text-zinc-500">{track.artist_name}</p>
                      </div>
                      <button onClick={() => removeFromPlaylist(track.id, activePlaylist.id)} className="p-2 text-zinc-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
