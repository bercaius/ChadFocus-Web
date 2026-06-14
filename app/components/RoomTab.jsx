'use client';

import { useState, useEffect, useRef } from 'react';
import { db } from '@/lib/firebase';
import { doc, setDoc, onSnapshot, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/app/components/AuthProvider';
import { Users, Send, LogOut, Copy, Check, Tv, Play, Pause, MessageSquare, Bot, Settings, Shield, Mic, Video, MonitorUp, ArrowLeft } from 'lucide-react';
import { JitsiMeeting } from '@jitsi/react-sdk';
import ReactPlayer from 'react-player';

export default function RoomTab({ onBack }) {
  const { user } = useAuth();
  const [roomId, setRoomId] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [roomData, setRoomData] = useState(null);
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [inVoiceChannel, setInVoiceChannel] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Otomatik mesaj kaydırma
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [roomData?.messages]);

  // Odayı dinle
  useEffect(() => {
    if (!roomId) return;
    const unsubscribe = onSnapshot(doc(db, 'rooms', roomId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setRoomData(data);
        if (data.botWebhook) setWebhookUrl(data.botWebhook);
      } else {
        setRoomId('');
        setRoomData(null);
        setInVoiceChannel(false);
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
        roles: {
          [user.uid]: 'admin'
        },
        youtubeVideoId: null,
        youtubePlaying: false,
        botWebhook: null,
        messages: []
      });
      setRoomId(newCode);
    } catch (error) {
      console.error("Oda kurma hatası:", error);
      alert("Oda kurulamadı! Firebase veritabanı kurallarını kontrol edin.");
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
    setInVoiceChannel(false);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !roomId || !user) return;

    const newMsg = {
      id: Date.now().toString(),
      text: message.trim(),
      sender: user.name,
      senderId: user.uid,
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    };

    // Firebase'e kaydet
    await updateDoc(doc(db, 'rooms', roomId), {
      messages: arrayUnion(newMsg)
    });

    // Harici Bot Webhook (Sunucu Yükünü Başka Siteye Aktarma)
    if (roomData?.botWebhook) {
      try {
        fetch(roomData.botWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event: 'message_create', room: roomId, message: newMsg }),
          mode: 'no-cors' // CORS hatalarını yok saymak için tek yönlü istek
        }).catch(err => console.log("Bot Webhook başarısız:", err));
      } catch (e) {
        // Hata bastır
      }
    }

    setMessage('');
  };

  const syncYoutubeVideo = async (e) => {
    e.preventDefault();
    if (!youtubeUrl.trim() || !roomId) return;
    
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = youtubeUrl.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;

    if (videoId) {
      await updateDoc(doc(db, 'rooms', roomId), {
        youtubeVideoId: videoId,
        youtubePlaying: true
      });
      setYoutubeUrl('');
    } else {
      alert("Geçersiz YouTube Linki");
    }
  };

  const toggleYoutubePlay = async () => {
    if (!roomId || !roomData) return;
    await updateDoc(doc(db, 'rooms', roomId), {
      youtubePlaying: !roomData.youtubePlaying
    });
  };

  const saveSettings = async () => {
    await updateDoc(doc(db, 'rooms', roomId), {
      botWebhook: webhookUrl.trim() || null
    });
    setShowSettings(false);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isModOrAdmin = roomData?.hostId === user?.uid || roomData?.roles?.[user?.uid] === 'mod' || roomData?.roles?.[user?.uid] === 'admin';
  const isAdmin = roomData?.hostId === user?.uid || roomData?.roles?.[user?.uid] === 'admin';

  // ==================== 1. LOBİ ====================
  if (!roomId) {
    return (
      <div className="absolute inset-0 z-50 w-full h-screen bg-[#2B2D31] flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
        <div className="max-w-5xl mx-auto space-y-6 pt-10">
          <button onClick={onBack} className="text-zinc-400 hover:text-white flex items-center gap-2 mb-6 font-bold text-sm bg-black/20 px-4 py-2 rounded-xl w-max transition-colors">
            <ArrowLeft className="w-5 h-5" /> Ana Menüye Dön
          </button>
          
          <div className="glass-panel rounded-2xl p-8 shadow-xl relative overflow-hidden border border-[var(--glass-border)] flex flex-col md:flex-row md:items-center justify-between bg-gradient-to-r from-[#2B2D31] to-[#1E1F22]">
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                <Users className="w-8 h-8 text-indigo-400" />
                ChadSocial
              </h2>
              <p className="text-[var(--text-muted)] mt-2 font-mono text-sm">Bot destekli, ekran paylaşımlı ve Discord kalitesinde elit odalar.</p>
            </div>
            <div className="hidden md:flex gap-4">
               <button onClick={createRoom} className="px-6 py-3 bg-indigo-500 text-white font-bold rounded-xl hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-500/20">
                 SUNUCU KUR
               </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-8 rounded-2xl border border-[var(--glass-border)] text-center flex flex-col justify-center bg-black/20 hover:bg-black/40 transition-colors">
              <MonitorUp className="w-16 h-16 text-indigo-400 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold text-white mb-2">Ortak Yayın Başlat</h3>
              <p className="text-sm text-zinc-500 mb-6">Senkronize Youtube, Görüntülü ve Sesli sohbet için kendi krallığını kur.</p>
              <button onClick={createRoom} className="w-full py-4 bg-zinc-800 text-white font-black text-sm uppercase tracking-wider rounded-xl hover:bg-zinc-700 transition-colors">
                 YENİ ODA KUR
              </button>
            </div>

            <div className="glass-panel p-8 rounded-2xl border border-[var(--glass-border)] flex flex-col justify-center bg-black/20 hover:bg-black/40 transition-colors">
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

  // ==================== 2. ODA YÜKLENİYOR ====================
  if (!roomData) {
    return (
      <div className="absolute inset-0 z-50 w-full h-screen bg-[#313338] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-zinc-500 font-mono tracking-widest text-xs uppercase">ODAYA BAĞLANILIYOR...</p>
        </div>
      </div>
    );
  }

  // ==================== 3. CHADSOCIAL ARAYÜZÜ ====================
  return (
    <div className="absolute inset-0 z-50 w-full h-screen bg-[#313338] flex flex-col overflow-hidden">
      <div className="w-full h-full flex flex-col overflow-hidden bg-[#313338]">
        
        {/* Header */}
        <div className="p-3 md:p-4 border-b border-zinc-900 flex justify-between items-center bg-[#2B2D31]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center shadow-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-zinc-100 font-bold flex items-center gap-2 text-sm">
                {roomData.host} - ChadSocial
                {isAdmin && <span className="bg-red-500/20 text-red-400 text-[9px] px-1.5 py-0.5 rounded font-black tracking-widest">ADMİN</span>}
              </h3>
              <p className="text-[11px] text-zinc-400 font-mono flex items-center gap-2 mt-0.5">
                KOD: <span className="bg-black/30 px-2 py-0.5 rounded text-white tracking-widest">{roomId}</span>
                <button onClick={copyCode} className="hover:text-white transition-colors">
                  {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                </button>
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isAdmin && (
              <button onClick={() => setShowSettings(!showSettings)} className="p-2 bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-colors">
                <Settings className="w-4 h-4" />
              </button>
            )}
            <button 
              onClick={leaveRoom}
              className="px-3 py-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-2"
            >
              Ayrıl <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bot & Webhook Settings Modal (Sadece Admin) */}
        {showSettings && isAdmin && (
          <div className="p-4 bg-[#1E1F22] border-b border-zinc-800 flex flex-col gap-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2"><Bot className="w-4 h-4 text-indigo-400"/> Bot & Entegrasyon Ayarları</h4>
            <p className="text-xs text-zinc-400">Harici botlarının sunucu yükünü kendi sitene/makinene yönlendirmek için Webhook URL'sini gir. (Gelen mesajlar POST edilir)</p>
            <div className="flex gap-2">
              <input 
                type="url" 
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://senin-bot-sunucun.com/webhook"
                className="flex-1 bg-[#2B2D31] text-zinc-200 border border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
              />
              <button onClick={saveSettings} className="bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-indigo-600 transition-colors">Kaydet</button>
            </div>
          </div>
        )}

        {/* Ana İçerik: 3 Kolonlu Discord Yapısı */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#313338]">
          
          {/* Sol Kolon: Sesli Kanal & Katılımcılar (A/V WebRTC Jitsi) */}
          <div className="w-full md:w-64 bg-[#2B2D31] border-r border-zinc-800 flex flex-col">
            <div className="p-4 border-b border-zinc-800/50">
              <h4 className="text-zinc-400 font-bold text-xs uppercase tracking-wider mb-3">Sesli Kanallar</h4>
              {!inVoiceChannel ? (
                <button 
                  onClick={() => setInVoiceChannel(true)}
                  className="w-full py-2 bg-[#1E1F22] hover:bg-indigo-500 hover:text-white text-zinc-300 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  <Mic className="w-4 h-4" /> Kanala Katıl
                </button>
              ) : (
                <button 
                  onClick={() => setInVoiceChannel(false)}
                  className="w-full py-2 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Bağlantıyı Kes
                </button>
              )}
            </div>
            
            {/* Jitsi Meeting (Sıfır Sunucu Maliyeti, Ekran+Kamera) */}
            <div className="flex-1 relative bg-black/20">
              {inVoiceChannel ? (
                <JitsiMeeting
                  domain="meet.jit.si"
                  roomName={`ChadSocial-Room-${roomId}`}
                  configOverwrite={{
                    startWithAudioMuted: false,
                    startWithVideoMuted: false,
                    prejoinPageEnabled: false,
                    disableDeepLinking: true,
                  }}
                  interfaceConfigOverwrite={{
                    DISABLE_DOMINANT_SPEAKER_INDICATOR: true,
                    SHOW_JITSI_WATERMARK: false,
                    SHOW_PROMOTIONAL_CLOSE_PAGE: false,
                  }}
                  userInfo={{
                    displayName: user?.name || "Misafir"
                  }}
                  getIFrameRef={(iframeRef) => { 
                    iframeRef.style.height = '100%'; 
                    iframeRef.style.width = '100%'; 
                    iframeRef.allow = 'camera; microphone; display-capture; autoplay; clipboard-write';
                  }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-zinc-600 opacity-50 p-4 text-center">
                  <Video className="w-12 h-12 mb-2" />
                  <p className="text-[10px] uppercase font-bold tracking-widest">Kamera ve Ekran Paylaşımı İçin Kanala Katıl</p>
                </div>
              )}
            </div>
          </div>

          {/* Orta Kolon: YouTube Senkronizasyonu */}
          <div className="flex-1 flex flex-col border-b md:border-b-0 md:border-r border-zinc-800/50 bg-black relative">
            <div className="flex-1 flex items-center justify-center relative group p-2 md:p-4">
              {roomData.youtubeVideoId ? (
                <div className="w-full max-w-4xl aspect-video rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10 pointer-events-none">
                  {/* ReactPlayer ile tam senkronizasyon (Pointer-events-none ile iframe tıklamaları engellendi, sadece yetkili yönetir) */}
                  <ReactPlayer 
                    url={`https://www.youtube.com/watch?v=${roomData.youtubeVideoId}`}
                    playing={roomData.youtubePlaying}
                    controls={false}
                    width="100%"
                    height="100%"
                    config={{ youtube: { playerVars: { origin: typeof window !== 'undefined' ? window.location.origin : 'https://youtube.com', autoplay: 1, disablekb: 1 } } }}
                  />
                </div>
              ) : (
                <div className="text-center text-zinc-500 flex flex-col items-center">
                  <Tv className="w-16 h-16 mb-4 opacity-30" />
                  <p className="text-sm font-medium uppercase tracking-widest text-zinc-400">Yayın Yok</p>
                </div>
              )}
            </div>

            {/* Video Controls (Sadece Admin veya Mod) */}
            <div className="p-3 bg-[#2B2D31] border-t border-zinc-800 flex flex-col sm:flex-row gap-2">
              <button 
                onClick={toggleYoutubePlay}
                disabled={!isModOrAdmin || !roomData.youtubeVideoId}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-white font-bold rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
              >
                {roomData.youtubePlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              </button>
              
              <form onSubmit={syncYoutubeVideo} className="flex-1 flex gap-2">
                <input 
                  type="text" 
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  disabled={!isModOrAdmin}
                  placeholder={isModOrAdmin ? "Youtube video linki yapıştır (Senkronize açılır)..." : "Sadece yetkililer video açabilir."}
                  className="flex-1 bg-[#1E1F22] border border-zinc-800/50 rounded-lg px-4 py-2 text-xs md:text-sm text-zinc-200 focus:outline-none disabled:opacity-50"
                />
                <button 
                  type="submit" 
                  disabled={!isModOrAdmin}
                  className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-zinc-800 text-white font-bold rounded-lg text-xs md:text-sm transition-colors flex items-center gap-2"
                >
                  AÇ
                </button>
              </form>
            </div>
          </div>

          {/* Sağ Kolon: Chat Panel */}
          <div className="w-full md:w-80 flex flex-col bg-[#313338]">
            <div className="p-4 border-b border-zinc-800/50 bg-[#2B2D31] flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-zinc-400" />
              <h4 className="text-zinc-200 font-bold text-sm">Sohbet {roomData.botWebhook && <span className="text-[9px] bg-green-500/20 text-green-400 px-1 rounded ml-1">BOT AKTİF</span>}</h4>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-5">
              {roomData.messages && roomData.messages.map((msg, i) => {
                const isGrouped = i > 0 && roomData.messages[i-1].senderId === msg.senderId;
                const msgRole = roomData.roles?.[msg.senderId] || 'guest';
                
                return (
                  <div key={msg.id} className={`flex gap-3 hover:bg-white/5 p-1 rounded-lg transition-colors ${isGrouped ? 'mt-1' : ''}`}>
                    {!isGrouped ? (
                       <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0 text-white font-bold text-lg border border-zinc-700">
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
                          <span className={`font-bold text-sm ${msgRole === 'admin' ? 'text-red-400' : msgRole === 'mod' ? 'text-blue-400' : 'text-zinc-200'}`}>
                            {msg.sender}
                          </span>
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
                  placeholder="Mesaj gönder..."
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
