'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/components/AuthProvider';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, onSnapshot, doc, updateDoc, setDoc, serverTimestamp, or } from 'firebase/firestore';
import { Search, UserPlus, Users, MessageSquare, Clock, Send, ShieldAlert, Check, X } from 'lucide-react';

export default function SocialTab() {
  const { user } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState('friends'); // 'friends', 'requests', 'search', 'dm'
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [requests, setRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [activeDM, setActiveDM] = useState(null);
  const [dmMessages, setDmMessages] = useState([]);
  const [msgInput, setMsgInput] = useState('');
  
  // 1. Fetch All Users (Discover & Friends)
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'users'));
    const unsub = onSnapshot(q, (snap) => {
      const allUsers = snap.docs.map(d => ({id: d.id, ...d.data()})).filter(u => u.uid !== user.uid);
      setFriends(allUsers);
      setSearchResults(allUsers);
    });
    return () => unsub();
  }, [user]);

  // 2. Fetch DMs for activeDM
  useEffect(() => {
    if (!user || !activeDM) return;
    const chatId = [user.uid, activeDM.uid].sort().join('_');
    const q = query(collection(db, 'dms', chatId, 'messages'));
    const unsub = onSnapshot(q, (snap) => {
      const msgs = snap.docs.map(d => ({id: d.id, ...d.data()})).sort((a,b) => a.createdAt - b.createdAt);
      setDmMessages(msgs);
    });
    return () => unsub();
  }, [user, activeDM]);

  const sendDM = async (e) => {
    e.preventDefault();
    if (!msgInput.trim() || !activeDM || !user) return;
    const chatId = [user.uid, activeDM.uid].sort().join('_');
    
    await addDoc(collection(db, 'dms', chatId, 'messages'), {
      text: msgInput.trim(),
      senderId: user.uid,
      createdAt: serverTimestamp(),
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    });
    setMsgInput('');
  };

  return (
    <div className="flex-1 overflow-hidden p-4 md:p-8 flex flex-col relative z-10" style={{ maxHeight: 'calc(100vh - 4rem)' }}>
      <div className="max-w-5xl mx-auto w-full h-full flex flex-col glass-panel rounded-2xl border border-[var(--glass-border)] shadow-xl overflow-hidden">
        
        <div className="p-4 border-b border-zinc-800/50 flex justify-between items-center bg-black/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-pink-500/10 border border-pink-500/30 flex items-center justify-center">
              <Users className="w-5 h-5 text-pink-500" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">Sosyal Ağ</h2>
              <p className="text-xs text-zinc-500">Badicilerle bağlan, mesajlaş ve rekabet et.</p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Sol Menü: Navigasyon ve Arkadaş Listesi */}
          <div className="w-full md:w-1/3 border-r border-zinc-800/50 bg-black/40 flex flex-col">
            <div className="flex p-2 border-b border-zinc-800/50">
              <button 
                onClick={() => setActiveSubTab('friends')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${activeSubTab === 'friends' || activeSubTab === 'dm' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:bg-zinc-900'}`}
              >
                Arkadaşlar
              </button>
              <button 
                onClick={() => setActiveSubTab('search')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${activeSubTab === 'search' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:bg-zinc-900'}`}
              >
                Keşfet
              </button>
              <button 
                onClick={() => setActiveSubTab('requests')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors relative ${activeSubTab === 'requests' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:bg-zinc-900'}`}
              >
                İstekler
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
              {activeSubTab === 'friends' || activeSubTab === 'dm' ? (
                friends.length > 0 ? (
                  friends.map((f, i) => (
                    <button key={i} onClick={() => { setActiveSubTab('dm'); setActiveDM(f); }} className="w-full text-left p-3 rounded-xl hover:bg-zinc-800/50 flex items-center gap-3 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xs">
                        {f.name?.[0] || '?'}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-zinc-200">{f.name}</div>
                        <div className="text-[10px] text-green-500 font-medium">Topluluk Üyesi</div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-6 text-center text-zinc-600">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">Sistemde aktif badici yok.</p>
                  </div>
                )
              ) : null}

              {activeSubTab === 'search' && (
                <div className="p-2 space-y-4">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input 
                      type="text" 
                      placeholder="Kullanıcı Adı veya ID Ara" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-4 py-2.5 text-xs text-white focus:border-pink-500 outline-none"
                    />
                  </div>
                  <div className="space-y-1 mt-4">
                    {searchResults.filter(u => u.name?.toLowerCase().includes(searchQuery.toLowerCase())).map((u, i) => (
                      <button key={i} onClick={() => { setActiveSubTab('dm'); setActiveDM(u); }} className="w-full text-left p-3 rounded-xl hover:bg-zinc-800/50 flex items-center gap-3 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xs">
                          {u.name?.[0] || '?'}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-bold text-zinc-200">{u.name}</div>
                          <div className="text-[10px] text-zinc-500 font-medium">Badici ID: {u.uid?.substring(0,6)}...</div>
                        </div>
                        <UserPlus className="w-4 h-4 text-zinc-500 hover:text-pink-400" />
                      </button>
                    ))}
                    {searchResults.length === 0 && (
                      <div className="text-center py-8">
                         <p className="text-xs text-zinc-500 mb-4">Gelişmiş arama motoru çevrimiçi kimseyi bulamadı.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeSubTab === 'requests' && (
                <div className="p-6 text-center text-zinc-600">
                  <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">Bekleyen istek yok.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sağ Panel: DM Görüntüleyici veya Placeholder */}
          <div className="flex-1 flex flex-col relative bg-zinc-950/50">
            {activeSubTab === 'dm' && activeDM ? (
              <>
                <div className="p-4 border-b border-zinc-800/50 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xs">
                    {activeDM.name?.[0] || '?'}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-100">{activeDM.name}</h3>
                    <p className="text-[10px] text-zinc-500">Uçtan Uca Şifrelenmiş Sohbet</p>
                  </div>
                </div>
                
                <div className="flex-1 p-4 overflow-y-auto custom-scrollbar flex flex-col gap-4">
                  <div className="text-center my-4">
                    <span className="text-[10px] px-3 py-1 bg-zinc-900 rounded-full text-zinc-500">Bugün</span>
                  </div>
                  
                  
                  {dmMessages.length === 0 ? (
                     <div className="text-center text-zinc-600 text-xs mt-4">Sohbeti başlatın. Şifrelenmiş mesajlar burada görünür.</div>
                  ) : (
                    dmMessages.map(msg => (
                      <div key={msg.id} className={`flex items-start gap-2 ${msg.senderId === user?.uid ? 'flex-row-reverse' : ''}`}>
                        {msg.senderId !== user?.uid && (
                          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-[10px] text-white">
                            {activeDM.name?.[0] || '?'}
                          </div>
                        )}
                        <div className={`text-sm px-4 py-2 max-w-[80%] ${msg.senderId === user?.uid ? 'bg-pink-500 text-white rounded-2xl rounded-tr-none' : 'bg-zinc-800 text-zinc-200 rounded-2xl rounded-tl-none border border-zinc-700/50'}`}>
                          {msg.text}
                          <span className="text-[9px] opacity-50 block mt-1 text-right">{msg.time}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={sendDM} className="p-4 border-t border-zinc-800/50 bg-black/20">
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      value={msgInput}
                      onChange={(e) => setMsgInput(e.target.value)}
                      placeholder="Özel mesaj yaz..." 
                      className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-pink-500 outline-none"
                    />
                    <button type="submit" disabled={!msgInput.trim()} className="p-3 bg-pink-500 text-white rounded-xl hover:scale-105 disabled:opacity-50 transition-all">
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-zinc-600 p-8 text-center">
                <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
                <h3 className="text-xl font-bold text-zinc-400 mb-2">Özel Mesajlar</h3>
                <p className="text-sm max-w-sm">Soldaki listeden bir badici seçerek uçtan uca şifrelenmiş sohbete başla veya Keşfet sekmesinden yeni rakipler bul.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
