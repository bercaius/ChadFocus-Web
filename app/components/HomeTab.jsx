'use client';

import { useState, useEffect } from 'react';

export default function HomeTab() {
  const [downloadStats, setDownloadStats] = useState({ version: '1.0.2', size: '15.8 MB', date: 'Bugün' });

  useEffect(() => {
    async function fetchLatest() {
      try {
        const res = await fetch('https://api.github.com/repos/bercaius/ChadFocus/releases/latest');
        if (res.ok) {
          const data = await res.json();
          const apk = data.assets.find(a => a.name.endsWith('.apk'));
          if (apk) {
            setDownloadStats({
              version: data.tag_name,
              size: (apk.size / (1024 * 1024)).toFixed(1) + ' MB',
              date: new Date(data.published_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })
            });
          }
        }
      } catch (e) {
        console.error('Update stats fetch failed', e);
      }
    }
    fetchLatest();
  }, []);

  return (
    <div className="relative min-h-[500px] rounded-3xl overflow-hidden glass-card p-6 md:p-12 flex flex-col justify-between">
      {/* Background Image with Dark Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 opacity-40 transition-opacity duration-700" 
        style={{ backgroundImage: "url('/images/chad_collage_bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/80 to-transparent z-0" />

      {/* Main Content */}
      <div className="relative z-10 max-w-2xl space-y-6 mt-4">
        <div className="flex items-center gap-4 animate-glow p-2 rounded-2xl bg-white/5 border border-white/5 w-fit">
          <img src="/images/app_logo.png" alt="ChadFocus Logo" className="w-16 h-16 rounded-xl object-cover border border-amber-500/30" />
          <div>
            <h1 className="text-2xl font-black tracking-tight" style={{ background: 'linear-gradient(90deg, #FFD700, #CD7F32)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              CHADFOCUS
            </h1>
            <p className="text-xs text-[#FFE082] font-semibold tracking-[0.15em] uppercase">Ascension Protocol v{downloadStats.version}</p>
          </div>
        </div>

        <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.15]">
          Ortalama Yaşamdan Kurtul, <br />
          <span style={{ color: '#FFD700' }}>Kendi Potansiyelini Zirveye Taşı.</span>
        </h2>

        <p className="text-sm md:text-base text-zinc-300 leading-relaxed font-light">
          Disiplin bir kas gibidir. ChadFocus, Pomodoro odak zamanlayıcısı, win-tracker (zafer listesi) ve çevrimdışı müzik grind altyapısıyla iradeni demir gibi yapar. Android mobil ve Windows masaüstü uygulamalarıyla verilerini her an senkronize tut.
        </p>

        {/* Feature Icons Grid */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          {[
            { icon: '🔥', title: 'Focus Timer', desc: 'Sert Motivasyon' },
            { icon: '🏆', title: 'Win-Tracker', desc: 'Günlük Zaferler' },
            { icon: '🔄', title: 'Auto-Sync', desc: 'Mobil & PC Eşitleme' }
          ].map((f, i) => (
            <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
              <span className="text-xl block mb-1">{f.icon}</span>
              <div className="text-[11px] font-bold text-zinc-200">{f.title}</div>
              <div className="text-[9px] text-zinc-400">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Download Buttons Section */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-6 border-t border-zinc-800/40">
        <a 
          href={`https://github.com/bercaius/ChadFocus/releases/download/${downloadStats.version}/app-release.apk`}
          className="flex items-center justify-between bg-gradient-to-r from-[#FFD700] to-[#CD7F32] text-black font-bold p-4 rounded-2xl hover:brightness-110 active:scale-95 transition-all shadow-[0_8px_24px_rgba(255,215,0,0.15)] group"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🤖</span>
            <div className="text-left">
              <div className="text-xs uppercase tracking-wider font-extrabold">Mobil İndir</div>
              <div className="text-[10px] opacity-75 font-normal">Android APK • {downloadStats.size}</div>
            </div>
          </div>
          <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
        </a>

        <a 
          href="https://github.com/bercaius/ChadFocus-Web/releases/latest"
          className="flex items-center justify-between bg-zinc-900 border border-zinc-700 text-white font-bold p-4 rounded-2xl hover:bg-zinc-800 active:scale-95 transition-all group"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">💻</span>
            <div className="text-left">
              <div className="text-xs uppercase tracking-wider font-extrabold">Masaüstü İndir</div>
              <div className="text-[10px] text-zinc-400 font-normal">Windows EXE / MSI • Otomatik Güncelleme</div>
            </div>
          </div>
          <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
        </a>
      </div>
    </div>
  );
}
