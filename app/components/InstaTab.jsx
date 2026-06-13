'use client';

import { useState } from 'react';
import { ExternalLink, Link as LinkIcon, CheckCircle, ShieldAlert } from 'lucide-react';

export default function InstaTab() {
  const [username, setUsername] = useState('bercaius.dev'); // Default creator
  const [connected, setConnected] = useState(false);

  const connectInsta = (e) => {
    e.preventDefault();
    setConnected(true);
    // Simüle edilmiş bağlantı. Gerçek API onayı olmadan iFrame çalışmaz.
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative z-10" style={{ maxHeight: 'calc(100vh - 4rem)' }}>
      <div className="max-w-3xl mx-auto mt-10">
        
        <div className="glass-panel rounded-2xl p-8 shadow-xl border border-[var(--glass-border)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500 opacity-5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500 opacity-5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Instagram className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 tracking-tight">
                Sosyal Hub
              </h2>
              <p className="text-[var(--text-muted)] text-sm mt-1">
                Instagram profilini bağla, grind paylaşımlarını senkronize et.
              </p>
            </div>
          </div>

          {!connected ? (
            <div className="bg-black/20 border border-zinc-800/50 rounded-xl p-6">
              <form onSubmit={connectInsta} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-500 uppercase mb-2">Instagram Kullanıcı Adı</label>
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-500 font-bold">@</span>
                    <input 
                      type="text" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="kullanici_adi"
                      className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:border-pink-500 outline-none transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 flex gap-3">
                  <ShieldAlert className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                  <p className="text-xs text-yellow-500/80 leading-relaxed">
                    Güvenlik Politikası: ChadFocus hiçbir zaman şifrenizi istemez. Bu bağlantı sadece profilinizi (herkese açık) görüntülemek ve web sürümünde direkt link sağlamak içindir.
                  </p>
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black hover:opacity-90 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <LinkIcon className="w-4 h-4" />
                  HESABI BAĞLA
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Bağlantı Başarılı</h3>
                <p className="text-zinc-400 text-sm mb-4">
                  @{username} hesabı sisteme tanımlandı.
                </p>
                <a 
                  href={`https://instagram.com/${username}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-800 text-white font-bold rounded-lg hover:bg-zinc-700 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  Profili Aç <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Sahte/Placeholder Post Alanı (API kısıtlamaları yüzünden iframe zor) */}
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="aspect-square bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden relative group cursor-pointer hover:border-pink-500 transition-colors">
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    </div>
                    {/* Sadece estetik görünüm için placeholder gradientler */}
                    <div className={`w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900`}></div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}
