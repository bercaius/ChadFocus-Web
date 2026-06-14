'use client';

import { useState, useEffect, useRef } from 'react';
import { db } from '@/lib/firebase';
import { doc, setDoc, onSnapshot, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/app/components/AuthProvider';
import { Users, Send, LogOut, Copy, Check, Tv, Play, MonitorPlay, MessageSquare } from 'lucide-react';

export default function RoomTab() {
  const { user } = useAuth();
  const [roomId, setRoomId] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [roomData, setRoomData] = useState(null);
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  
  const messagesEndRef = useRef(null);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [roomData?.messages]);

  // Listen to room changes
  useEffect(() => {
    if (!roomId) return;
    const unsubscribe = onSnapshot(doc(db, 'rooms', roomId), (docSnap) => {
      if (docSnap.exists()) {
        setRoomData(docSnap.data());
      } else {
        setRoomId('');
        setRoomData(null);
      }
    });
    return () => unsubscribe();
  }, [roomId]);

  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const createRoom = async () => {
    if (!user) {
      alert("Oda kurmak için giriş yapmalısın.");
      return;
    }
    const newCode = generateRoomCode();
    try {
      await setDoc(doc(db, 'rooms', newCode), {
        createdAt: serverTimestamp(),
        host: user.name || "Anonim Badici",
        hostId: user.uid,
        youtubeVideoId: null,
        messages: []
      });
      setRoomId(newCode);
    } catch (error) {
      console.error("Oda kurma hatası:", error);
      alert("Oda kurulamadı! Firebase veritabanı kurallarını (rules) kontrol edin. Hata: " + error.message);
    }
  };

  const joinRoom = () => {
    if (joinCode.trim().length === 6) {
      setRoomId(joinCode.toUpperCase());
    } else {
      alert("Geçersiz oda kodu!");
    }
  };

  const leaveRoom = () => {
    setRoomId('');
    setRoomData(null);
    setJoinCode('');
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !roomId || !user) return;

    await updateDoc(doc(db, 'rooms', roomId), {
      messages: arrayUnion({
        id: Date.now().toString(),
        text: message.trim(),
        sender: user.name,
        senderId: user.uid,
        time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      })
    });
    setMessage('');
  };

  const syncYoutubeVideo = async (e) => {
    e.preventDefault();
    if (!youtubeUrl.trim() || !roomId) return;
    
    // Basit bir regex ile YouTube ID çekme
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = youtubeUrl.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;

    if (videoId) {
      await updateDoc(doc(db, 'rooms', roomId), {
        youtubeVideoId: videoId
      });
      setYoutubeUrl('');
    } else {
      alert("Geçersiz YouTube Linki");
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 1. Odaya Katılmamış Durum (Lobi)
  if (!roomId) {
    return (
      <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative z-10" style={{ maxHeight: 'calc(100vh - 4rem)' }}>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="glass-panel rounded-2xl p-8 shadow-xl relative overflow-hidden border border-[var(--glass-border)] flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                <Users className="w-8 h-8 text-indigo-400" />
                Odalar
              </h2>
              <p className="text-[var(--text-muted)] mt-2 font-mono text-sm">Discord standartlarında, şifreli ve güvenli badici odak odaları.</p>
            </div>
            <div className="hidden md:flex gap-4">
               <button onClick={createRoom} className="px-6 py-3 bg-indigo-500 text-white font-bold rounded-xl hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-500/20">
                 ODA KUR
               </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-8 rounded-2xl border border-[var(--glass-border)] text-center flex flex-col justify-center bg-black/20">
              <MonitorPlay className="w-16 h-16 text-indigo-400 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold text-white mb-2">Ortak Yayın Başlat</h3>
              <p className="text-sm text-zinc-500 mb-6">Aynı Youtube videosunu veya müziği senkronize olarak izleyin. Kurucu ol ve badicilerini davet et.</p>
              <button onClick={createRoom} className="w-full py-4 bg-zinc-800 text-white font-black text-sm uppercase tracking-wider rounded-xl hover:bg-zinc-700 transition-colors">
                 YENİ ODA KUR
              </button>
            </div>

            <div className="glass-panel p-8 rounded-2xl border border-[var(--glass-border)] flex flex-col justify-center bg-black/20">
              <h3 className="text-xl font-bold text-white mb-2 text-center">Davet Kodu ile Katıl</h3>
              <p className="text-sm text-zinc-500 mb-6 text-center">6 haneli gizli davet kodunu gir ve anında odaya bağlan.</p>
              
              <div className="space-y-4">
                <input 
                  type="text" 
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="KODU GİR (Örn: X8B2L9)"
                  maxLength={6}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-4 text-center font-mono text-2xl tracking-[0.3em] text-white uppercase focus:border-indigo-500 outline-none transition-colors"
                />
                <button 
                  onClick={joinRoom}
                  disabled={joinCode.length !== 6}
                  className="w-full py-4 bg-indigo-500 text-white font-black text-sm uppercase tracking-wider rounded-xl disabled:opacity-50 disabled:bg-zinc-800 transition-colors shadow-lg"
                >
                  ODAYA GİR
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Odaya Katılmış Durum (İçerisi)
  if (!roomData) {
    return (
      <div className="flex-1 flex items-center justify-center relative z-10" style={{ maxHeight: 'calc(100vh - 4rem)' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-zinc-500 font-mono tracking-widest text-xs uppercase">ODAYA BAĞLANILIYOR...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden p-4 md:p-8 flex flex-col relative z-10" style={{ maxHeight: 'calc(100vh - 4rem)' }}>
      <div className="max-w-6xl mx-auto w-full h-full flex flex-col glass-panel rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden bg-[#313338]"> {/* Discord Background Color */}
        
        {/* Room Header */}
        <div className="p-4 border-b border-zinc-900 flex justify-between items-center bg-[#2B2D31]">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center shadow-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-zinc-100 font-bold flex items-center gap-2 text-sm">
                {roomData.host}'s Lair
              </h3>
              <p className="text-[11px] text-zinc-400 font-mono flex items-center gap-2 mt-0.5">
                DAVET KODU: <span className="bg-black/30 px-2 py-0.5 rounded text-white tracking-widest">{roomId}</span>
                <button onClick={copyCode} className="hover:text-white transition-colors" title="Kodu Kopyala">
                  {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                </button>
              </p>
            </div>
          </div>
          <button 
            onClick={leaveRoom}
            className="px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-2"
          >
            Ayrıl <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Room Body: Discord Style Layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#313338]">
          
          {/* Main Content (Video Player) */}
          <div className="flex-1 flex flex-col border-b md:border-b-0 md:border-r border-zinc-800/50 relative">
            <div className="flex-1 bg-black flex items-center justify-center relative group p-4">
              {roomData.youtubeVideoId ? (
                <div className="w-full max-w-3xl aspect-video rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={`https://www.youtube.com/embed/${roomData.youtubeVideoId}?autoplay=1&rel=0`} 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <div className="text-center text-zinc-500 flex flex-col items-center">
                  <Tv className="w-16 h-16 mb-4 opacity-30" />
                  <p className="text-sm font-medium">Video veya müzik oynatılmıyor.</p>
                  <p className="text-xs mt-1">Aşağıdan bir Youtube linki yapıştırın.</p>
                </div>
              )}
            </div>

            {/* Video Controls (Only Host or Anyone can change) */}
            <form onSubmit={syncYoutubeVideo} className="p-4 bg-[#2B2D31] border-t border-zinc-800 flex gap-2">
              <Tv className="w-10 h-10 p-2 bg-red-500/20 text-red-500 rounded-lg flex-shrink-0" />
              <input 
                type="text" 
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="Youtube video linki yapıştır (Senkronize açılır)..."
                className="flex-1 bg-[#1E1F22] border border-zinc-800/50 rounded-lg px-4 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button type="submit" className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-lg text-sm transition-colors flex items-center gap-2">
                <Play className="w-4 h-4 fill-current" /> OYNAT
              </button>
            </form>
          </div>

          {/* Chat Panel (Right Sidebar) */}
          <div className="w-full md:w-80 flex flex-col bg-[#313338]">
            <div className="p-4 border-b border-zinc-800/50 bg-[#2B2D31] flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-zinc-400" />
              <h4 className="text-zinc-200 font-bold text-sm">Sohbet</h4>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-5">
              {roomData.messages && roomData.messages.map((msg, i) => {
                // Determine if we should group messages from the same sender
                const isGrouped = i > 0 && roomData.messages[i-1].senderId === msg.senderId;
                
                return (
                  <div key={msg.id} className={`flex gap-3 hover:bg-white/5 p-1 rounded-lg transition-colors ${isGrouped ? 'mt-1' : ''}`}>
                    {!isGrouped ? (
                       <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0 text-white font-bold text-lg cursor-pointer hover:opacity-80">
                         {msg.sender[0]}
                       </div>
                    ) : (
                       <div className="w-10 flex-shrink-0 flex items-center justify-center text-[9px] text-zinc-600 opacity-0 hover:opacity-100">
                         {msg.time}
                       </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      {!isGrouped && (
                        <div className="flex items-baseline gap-2 mb-0.5">
                          <span className="font-bold text-zinc-200 text-sm">{msg.sender}</span>
                          <span className="text-[10px] text-zinc-500">{msg.time}</span>
                        </div>
                      )}
                      <p className="text-zinc-300 text-sm break-words leading-relaxed">
                        {msg.text}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <form onSubmit={sendMessage} className="p-4 bg-[#313338]">
              <div className="relative flex items-center">
                <input 
                  type="text" 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`Odaya mesaj gönder...`}
                  className="w-full bg-[#383A40] text-zinc-200 rounded-lg pl-4 pr-12 py-3 text-sm focus:outline-none placeholder-zinc-500"
                />
                <button 
                  type="submit"
                  disabled={!message.trim()}
                  className="absolute right-2 p-1.5 text-zinc-400 hover:text-white disabled:opacity-30 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
