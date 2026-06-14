'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Search, Download, Music, Plus, Library, X, Edit2 } from 'lucide-react';
import { useLocalStorage } from '@/lib/useLocalStorage';
import dynamic from 'next/dynamic';

// Next.js client-side only import for ReactPlayer to avoid hydration mismatch
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

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
    // Dev devasa YouTube müzik arşivi (Phonk, Türkçe Pop, Drill, Motivasyon)
    const premiumTracks = [
      // GYM & PHONK & MOTIVATION
      { id: '1', name: 'GigaChad Theme (Phonk)', artist_name: 'g3ox_em', image: 'https://i.ytimg.com/vi/1_zVWkpeGoE/mqdefault.jpg', audio: 'https://www.youtube.com/watch?v=1_zVWkpeGoE', tags: 'phonk workout chad' },
      { id: '2', name: 'Metamorphosis', artist_name: 'Interworld', image: 'https://i.ytimg.com/vi/SjZgE7uPOrk/mqdefault.jpg', audio: 'https://www.youtube.com/watch?v=SjZgE7uPOrk', tags: 'phonk workout dark' },
      { id: '3', name: 'Sahara', artist_name: 'Hensonn', image: 'https://i.ytimg.com/vi/Q281a_sH3kQ/mqdefault.jpg', audio: 'https://www.youtube.com/watch?v=Q281a_sH3kQ', tags: 'phonk' },
      { id: '4', name: 'Neon Blade', artist_name: 'MoonDeity', image: 'https://i.ytimg.com/vi/1mYnU5a0p60/mqdefault.jpg', audio: 'https://www.youtube.com/watch?v=1mYnU5a0p60', tags: 'phonk gym drift' },
      { id: '5', name: 'Murder In My Mind', artist_name: 'Kordhell', image: 'https://i.ytimg.com/vi/y-t-D9_zX9M/mqdefault.jpg', audio: 'https://www.youtube.com/watch?v=y-t-D9_zX9M', tags: 'phonk workout hard' },
      { id: '6', name: 'Disaster', artist_name: 'KSLV', image: 'https://i.ytimg.com/vi/v2dKIn72FXY/mqdefault.jpg', audio: 'https://www.youtube.com/watch?v=v2dKIn72FXY', tags: 'phonk drift dark' },
      { id: '7', name: 'Rave', artist_name: 'Dxrk', image: 'https://i.ytimg.com/vi/PTZcgZaIgNw/mqdefault.jpg', audio: 'https://www.youtube.com/watch?v=PTZcgZaIgNw', tags: 'phonk rave' },
      { id: '8', name: 'Polozhenie', artist_name: 'Zedline', image: 'https://i.ytimg.com/vi/q43n21E-3pE/mqdefault.jpg', audio: 'https://www.youtube.com/watch?v=q43n21E-3pE', tags: 'sigma grindset' },
      { id: '9', name: 'Vendetta', artist_name: 'MUPP', image: 'https://i.ytimg.com/vi/7vQxS_e2rEE/mqdefault.jpg', audio: 'https://www.youtube.com/watch?v=7vQxS_e2rEE', tags: 'phonk angry' },
      { id: '10', name: 'Wake Up', artist_name: 'MoonDeity', image: 'https://i.ytimg.com/vi/h2l0QvM8KCQ/mqdefault.jpg', audio: 'https://www.youtube.com/watch?v=h2l0QvM8KCQ', tags: 'phonk sigma' },
      { id: '11', name: 'Life Is A Highway', artist_name: 'Rascal Flatts', image: 'https://i.ytimg.com/vi/5tXh_MfrMe0/mqdefault.jpg', audio: 'https://www.youtube.com/watch?v=5tXh_MfrMe0', tags: 'cars motivation' },
      
      // TÜRKÇE DRILL & RAP & VIRAL
      { id: '12', name: 'İmdat', artist_name: 'Cakal', image: 'https://i.ytimg.com/vi/A5fM2_5bKjQ/mqdefault.jpg', audio: 'https://www.youtube.com/watch?v=A5fM2_5bKjQ', tags: 'türkçe rap drill' },
      { id: '13', name: 'Bilmem Mi?', artist_name: 'Sefo', image: 'https://i.ytimg.com/vi/WdG9e0T03f0/mqdefault.jpg', audio: 'https://www.youtube.com/watch?v=WdG9e0T03f0', tags: 'türkçe pop rap' },
      { id: '14', name: 'Gecelerin Derdi', artist_name: 'Lvbel C5', image: 'https://i.ytimg.com/vi/U2V_J02e078/mqdefault.jpg', audio: 'https://www.youtube.com/watch?v=U2V_J02e078', tags: 'türkçe drill' },
      { id: '15', name: 'Antidepresan', artist_name: 'Mabel Matiz & Mert Demir', image: 'https://i.ytimg.com/vi/B72h_7J0N0Y/mqdefault.jpg', audio: 'https://www.youtube.com/watch?v=B72h_7J0N0Y', tags: 'türkçe pop' },
      { id: '16', name: 'Bi Tek Ben Anlarım', artist_name: 'KÖFN', image: 'https://i.ytimg.com/vi/3N7V8M1YgH8/mqdefault.jpg', audio: 'https://www.youtube.com/watch?v=3N7V8M1YgH8', tags: 'türkçe pop viral' },
      { id: '17', name: 'İsabelle', artist_name: 'Sefo & Capo', image: 'https://i.ytimg.com/vi/k6k-2N3E4Yg/mqdefault.jpg', audio: 'https://www.youtube.com/watch?v=k6k-2N3E4Yg', tags: 'türkçe pop rap' },
      { id: '18', name: 'Araba', artist_name: 'Sefo', image: 'https://i.ytimg.com/vi/Wb3x1H8_g0Q/mqdefault.jpg', audio: 'https://www.youtube.com/watch?v=Wb3x1H8_g0Q', tags: 'türkçe pop' },
      { id: '19', name: 'NKBİ X YAPAMAM', artist_name: 'Lvbel C5', image: 'https://i.ytimg.com/vi/M7p-w-s6wUo/mqdefault.jpg', audio: 'https://www.youtube.com/watch?v=M7p-w-s6wUo', tags: 'türkçe rap' },
      { id: '20', name: 'Dalgası', artist_name: 'Uzi', image: 'https://i.ytimg.com/vi/5-2XW4_uLz4/mqdefault.jpg', audio: 'https://www.youtube.com/watch?v=5-2XW4_uLz4', tags: 'türkçe rap drill' },
      { id: '21', name: 'Paparazzi', artist_name: 'Uzi', image: 'https://i.ytimg.com/vi/7K2P1P2g7N0/mqdefault.jpg', audio: 'https://www.youtube.com/watch?v=7K2P1P2g7N0', tags: 'türkçe rap' },
      { id: '22', name: 'Mingofal', artist_name: 'Cakal', image: 'https://i.ytimg.com/vi/wA5Y8A5m8W4/mqdefault.jpg', audio: 'https://www.youtube.com/watch?v=wA5Y8A5m8W4', tags: 'türkçe rap drill' },
      { id: '23', name: 'Ali Cabbar', artist_name: 'Emir Can İğrek', image: 'https://i.ytimg.com/vi/f0W-O6jR-18/mqdefault.jpg', audio: 'https://www.youtube.com/watch?v=f0W-O6jR-18', tags: 'türkçe pop slow' },
      { id: '24', name: 'Affetmem', artist_name: 'Bergen', image: 'https://i.ytimg.com/vi/zW2d4A0kQ9I/mqdefault.jpg', audio: 'https://www.youtube.com/watch?v=zW2d4A0kQ9I', tags: 'türkçe arabesk' },

      // LOFI & CHILL (KODLAMA / ÇALIŞMA MÜZİKLERİ)
      { id: '25', name: 'Lofi Girl - Relaxing Beats', artist_name: 'Lofi Girl', image: 'https://i.ytimg.com/vi/jfKfPfyJRdk/mqdefault.jpg', audio: 'https://www.youtube.com/watch?v=jfKfPfyJRdk', tags: 'lofi study chill stream' },
      { id: '26', name: 'Synthwave Radio', artist_name: 'Nightride', image: 'https://i.ytimg.com/vi/4xDzrHKX110/mqdefault.jpg', audio: 'https://www.youtube.com/watch?v=4xDzrHKX110', tags: 'synthwave chill stream' },
      { id: '27', name: 'Coding Music Hacking', artist_name: 'Hacker', image: 'https://i.ytimg.com/vi/M5QY2_8704o/mqdefault.jpg', audio: 'https://www.youtube.com/watch?v=M5QY2_8704o', tags: 'coding cyberpunk' },
      { id: '28', name: 'Chillhop Radio', artist_name: 'Chillhop', image: 'https://i.ytimg.com/vi/5yx6BWlEVcY/mqdefault.jpg', audio: 'https://www.youtube.com/watch?v=5yx6BWlEVcY', tags: 'lofi hiphop stream' },
      
      // YABANCI VIRAL & HIPHOP
      { id: '29', name: 'Starboy', artist_name: 'The Weeknd', image: 'https://i.ytimg.com/vi/34Na4j8HLjc/mqdefault.jpg', audio: 'https://www.youtube.com/watch?v=34Na4j8HLjc', tags: 'yabancı pop viral' },
      { id: '30', name: 'Without Me', artist_name: 'Eminem', image: 'https://i.ytimg.com/vi/YVkUvmDQ3HY/mqdefault.jpg', audio: 'https://www.youtube.com/watch?v=YVkUvmDQ3HY', tags: 'rap classic' },
      { id: '31', name: 'Mockingbird', artist_name: 'Eminem', image: 'https://i.ytimg.com/vi/S9bPNsIqPIA/mqdefault.jpg', audio: 'https://www.youtube.com/watch?v=S9bPNsIqPIA', tags: 'rap emotional' },
      { id: '32', name: 'In Da Club', artist_name: '50 Cent', image: 'https://i.ytimg.com/vi/5qm8Phr18cI/mqdefault.jpg', audio: 'https://www.youtube.com/watch?v=5qm8Phr18cI', tags: 'rap gym classic' },
      { id: '33', name: 'Till I Collapse', artist_name: 'Eminem', image: 'https://i.ytimg.com/vi/ytQ5CYE1VZw/mqdefault.jpg', audio: 'https://www.youtube.com/watch?v=ytQ5CYE1VZw', tags: 'workout rap hard' },
      { id: '34', name: 'Can\'t Hold Us', artist_name: 'Macklemore', image: 'https://i.ytimg.com/vi/2zNSgSzhBfM/mqdefault.jpg', audio: 'https://www.youtube.com/watch?v=2zNSgSzhBfM', tags: 'workout motivation pop' },
      { id: '35', name: 'Lose Yourself', artist_name: 'Eminem', image: 'https://i.ytimg.com/vi/_Yhyp-_hX2s/mqdefault.jpg', audio: 'https://www.youtube.com/watch?v=_Yhyp-_hX2s', tags: 'workout rap motivation' },
      
      // EXTRA TÜRKÇE
      { id: '36', name: 'Yengeniz Çıldırmış Olmalı', artist_name: 'Mode XL', image: 'https://i.ytimg.com/vi/5-E9A0H3f6w/mqdefault.jpg', audio: 'https://www.youtube.com/watch?v=5-E9A0H3f6w', tags: 'türkçe rap classic' },
      { id: '37', name: 'Mekanın Sahibi', artist_name: 'Norm Ender', image: 'https://i.ytimg.com/vi/P11_aQYhTiw/mqdefault.jpg', audio: 'https://www.youtube.com/watch?v=P11_aQYhTiw', tags: 'türkçe rap diss' },
      { id: '38', name: 'Neyim Var Ki', artist_name: 'Ceza ft. Sagopa', image: 'https://i.ytimg.com/vi/A9Hq_QnQnCQ/mqdefault.jpg', audio: 'https://www.youtube.com/watch?v=A9Hq_QnQnCQ', tags: 'türkçe rap efsane' },
      { id: '39', name: 'Fark Var', artist_name: 'Ceza', image: 'https://i.ytimg.com/vi/T1j0_N7Wq7g/mqdefault.jpg', audio: 'https://www.youtube.com/watch?v=T1j0_N7Wq7g', tags: 'türkçe rap hızlı' },
      { id: '40', name: 'Ateşten Gömlek', artist_name: 'Sagopa Kajmer', image: 'https://i.ytimg.com/vi/f0-4Vv4e910/mqdefault.jpg', audio: 'https://www.youtube.com/watch?v=f0-4Vv4e910', tags: 'türkçe rap slow' },
      { id: '41', name: 'Bana Sor', artist_name: 'Müslüm Gürses', image: 'https://i.ytimg.com/vi/R_1Q11v7_W0/mqdefault.jpg', audio: 'https://www.youtube.com/watch?v=R_1Q11v7_W0', tags: 'türkçe arabesk damar' },
      { id: '42', name: 'Paramparça', artist_name: 'Müslüm Gürses', image: 'https://i.ytimg.com/vi/P1-M-z6X8y0/mqdefault.jpg', audio: 'https://www.youtube.com/watch?v=P1-M-z6X8y0', tags: 'türkçe arabesk efsane' },
    ];

    setTimeout(() => {
      const q = searchQuery.toLowerCase();
      const filtered = premiumTracks.filter(t => t.name.toLowerCase().includes(q) || t.tags.includes(q) || t.artist_name.toLowerCase().includes(q));
      setTracks(filtered.length > 0 ? filtered : premiumTracks);
      setLoading(false);
    }, 500); // Simulate network
  };

  useEffect(() => {
    fetchMusic(query);
  }, []);

  const playTrack = (track) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
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
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="glass-panel rounded-2xl p-6 shadow-xl relative overflow-hidden border border-[var(--glass-border)] min-h-[500px]">
          <div className="absolute top-0 left-0 w-64 h-64 bg-[var(--accent-color)] opacity-5 rounded-full blur-3xl -ml-20 -mt-20 pointer-events-none -left-[9999px]"></div>
          
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
              <div className="flex flex-col md:flex-row items-center gap-2">
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
                <button 
                  onClick={() => {
                    const url = prompt("YouTube Linki Yapıştır:");
                    if (!url) return;
                    const match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/);
                    const videoId = (match && match[2].length === 11) ? match[2] : null;
                    if (!videoId) { alert("Geçersiz link"); return; }
                    const newTrack = { id: videoId, name: "Özel Şarkı", artist_name: "Senin Seçimin", image: `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`, audio: url, tags: "özel" };
                    setTracks([newTrack, ...tracks]);
                    playTrack(newTrack);
                  }}
                  className="px-4 py-2 bg-[var(--accent-color)] text-black font-bold rounded-xl text-sm flex items-center gap-2 hover:scale-105 transition-transform"
                >
                  <Plus className="w-4 h-4" /> Özel Ekle
                </button>
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
          
          {/* ReactPlayer running invisibly for Audio */}
          {currentTrack && (
            <ReactPlayer 
              url={currentTrack.audio} 
              playing={isPlaying} 
              onEnded={nextTrack}
              width="1px" 
              height="1px" 
              className="absolute opacity-0 pointer-events-none -left-[9999px]"
              config={{ youtube: { playerVars: { origin: typeof window !== 'undefined' ? window.location.origin : 'https://youtube.com', autoplay: 1 } } }}
            />
          )}

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
