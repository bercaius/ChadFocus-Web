'use client';

import { useState, useEffect, useRef } from 'react';
import { db } from '@/lib/firebase';
import { doc, setDoc, onSnapshot, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/app/components/AuthProvider';
import { Users, MessageSquare, Music, Send, LogOut, Copy, Check } from 'lucide-react';

export default function RoomTab() {
  const { user } = useAuth();
  const [roomId, setRoomId] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [roomData, setRoomData] = useState(null);
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);
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
        // Oda bulunamadı veya silindi
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
    if (!user) return;
    const newCode = generateRoomCode();
    await setDoc(doc(db, 'rooms', newCode), {
      createdAt: serverTimestamp(),
      host: user.name,
      hostId: user.uid,
      nowPlaying: null,
      messages: []
    });
    setRoomId(newCode);
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

  const copyCode = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 1. Odaya Katılmamış Durum (Lobi)
  if (!roomId) {
    return (
      <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative z-10" style={{ maxHeight: 'calc(100vh - 4rem)' }}>
        <div className="max-w-xl mx-auto mt-10">
          <div className="glass-panel rounded-2xl p-8 shadow-xl border border-[var(--glass-border)] text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-color)] opacity-5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
            
            <Users className="w-16 h-16 text-[var(--accent-color)] mx-auto mb-6 opacity-80" />
            
            <h2 className="text-3xl font-black text-white mb-2">Chad Odaları</h2>
            <p className="text-[var(--text-muted)] text-sm mb-8">
              Diğer badicilerle senkronize ol, aynı frekansta kal. Müzik ve grind.
            </p>

            <div className="space-y-6">
              <button 
                onClick={createRoom}
                className="w-full py-4 rounded-xl bg-[var(--accent-color)] text-black font-black hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)]"
              >
                YENİ ODA KUR
              </button>
              
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-zinc-800"></div>
                <span className="flex-shrink-0 mx-4 text-zinc-600 font-mono text-xs uppercase">VEYA KATIL</span>
                <div className="flex-grow border-t border-zinc-800"></div>
              </div>

              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="6 HANELİ KOD"
                  maxLength={6}
                  className="flex-1 bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 text-center font-mono text-xl tracking-widest text-white uppercase focus:border-[var(--accent-color)] outline-none"
                />
                <button 
                  onClick={joinRoom}
                  disabled={joinCode.length !== 6}
                  className="px-6 rounded-xl bg-zinc-800 text-white font-bold disabled:opacity-50 hover:bg-zinc-700 transition-colors"
                >
                  GİR
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
        <p className="text-zinc-500 font-mono animate-pulse">Odaya bağlanılıyor...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden p-4 md:p-8 flex flex-col relative z-10" style={{ maxHeight: 'calc(100vh - 4rem)' }}>
      <div className="max-w-4xl mx-auto w-full h-full flex flex-col glass-panel rounded-2xl border border-[var(--glass-border)] shadow-xl overflow-hidden">
        
        {/* Room Header */}
        <div className="p-4 border-b border-zinc-800/50 flex justify-between items-center bg-black/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--accent-color)]/10 border border-[var(--accent-color)]/30 flex items-center justify-center">
              <Users className="w-5 h-5 text-[var(--accent-color)]" />
            </div>
            <div>
              <h3 className="text-white font-bold flex items-center gap-2">
                {roomData.host}'s Room
                <span className="text-[10px] bg-[var(--accent-color)] text-black px-2 py-0.5 rounded-full font-black uppercase">LIVE</span>
              </h3>
              <p className="text-xs text-zinc-500 font-mono flex items-center gap-2 mt-0.5">
                KOD: <span className="text-white">{roomId}</span>
                <button onClick={copyCode} className="hover:text-[var(--accent-color)] transition-colors">
                  {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                </button>
              </p>
            </div>
          </div>
          <button 
            onClick={leaveRoom}
            className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
            title="Odadan Çık"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {/* Room Body: Music Sync & Chat */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Music Status Panel */}
          <div className="md:w-1/3 border-b md:border-b-0 md:border-r border-zinc-800/50 p-6 flex flex-col justify-center items-center bg-black/10">
            <div className="relative w-32 h-32 mb-6 group">
              <div className="absolute inset-0 bg-[var(--accent-color)] rounded-full blur-xl opacity-20 animate-pulse"></div>
              <div className="relative w-full h-full rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden shadow-2xl">
                {roomData.nowPlaying ? (
                  <img src={roomData.nowPlaying.image} alt="cover" className="w-full h-full object-cover animate-[spin_10s_linear_infinite]" />
                ) : (
                  <Music className="w-12 h-12 text-zinc-700" />
                )}
              </div>
            </div>
            
            <div className="text-center w-full">
              <p className="text-[10px] text-[var(--accent-color)] font-bold tracking-widest uppercase mb-1">Şu An Çalıyor</p>
              <h4 className="text-white font-bold truncate px-4">
                {roomData.nowPlaying ? roomData.nowPlaying.name : 'Sessizlik...'}
              </h4>
              <p className="text-xs text-zinc-500 mt-1 truncate">
                {roomData.nowPlaying ? roomData.nowPlaying.artist : 'Ritim sekmesinden müzik başlatın'}
              </p>
            </div>
          </div>

          {/* Chat Panel */}
          <div className="flex-1 flex flex-col bg-black/40 relative">
            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-4">
              {roomData.messages && roomData.messages.map((msg) => {
                const isMe = user && msg.senderId === user.uid;
                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <span className="text-[10px] text-zinc-500 mb-1 px-1">{msg.sender} • {msg.time}</span>
                    <div className={`px-4 py-2 rounded-2xl max-w-[85%] text-sm ${
                      isMe 
                        ? 'bg-[var(--accent-color)] text-black rounded-tr-sm font-medium' 
                        : 'bg-zinc-800 text-zinc-200 rounded-tl-sm border border-zinc-700'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={sendMessage} className="p-4 border-t border-zinc-800/50 bg-black/20">
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Mesaj gönder..."
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-[var(--accent-color)] outline-none transition-colors"
                />
                <button 
                  type="submit"
                  disabled={!message.trim()}
                  className="p-3 bg-[var(--accent-color)] text-black rounded-xl hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 transition-all cursor-pointer"
                >
                  <Send className="w-5 h-5 ml-1" />
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
