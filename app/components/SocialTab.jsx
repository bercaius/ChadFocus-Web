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
                        <div className="text-[10px] text-green-500 font-medium">Çevrimiçi</div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-6 text-center text-zinc-600">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">Henüz kimseyi eklemedin.</p>
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
                  <div className="text-center py-8">
                    <p className="text-xs text-zinc-500 mb-4">Gelişmiş arama ve eşleştirme motoru Alpha statüsünde.</p>
                    <button className="px-6 py-2 bg-pink-500/20 text-pink-400 font-bold text-xs rounded-xl hover:bg-pink-500 hover:text-white transition-colors">
                      SİSTEMDE ARA
                    </button>
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
                  
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-[10px] text-white">
                      {activeDM.name?.[0] || '?'}
                    </div>
                    <div className="bg-zinc-800 text-zinc-200 text-sm px-4 py-2 rounded-2xl rounded-tl-none border border-zinc-700/50 max-w-[80%]">
                      Selam kanka, bugünkü grind nasıl gidiyor? 50 şınav tamam mı?
                    </div>
                  </div>

                  <div className="flex items-start gap-2 flex-row-reverse">
                    <div className="bg-pink-500 text-white text-sm px-4 py-2 rounded-2xl rounded-tr-none max-w-[80%]">
                      Sorma yoruldum ama bitirdim. Sen?
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-zinc-800/50 bg-black/20">
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      placeholder="Özel mesaj yaz..." 
                      className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-pink-500 outline-none"
                    />
                    <button className="p-3 bg-pink-500 text-white rounded-xl hover:scale-105 transition-all">
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
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
