'use client';

import { useState, useEffect } from 'react';

const WALLPAPERS = [
  { id: 'default', url: '/images/chad_collage_bg.jpg', label: 'Efsane Klasik' },
  { id: 'wp1', url: '/images/wallpaper_1.png', label: 'Elit Büro' },
  { id: 'wp2', url: '/images/wallpaper_2.png', label: 'Disiplin Profil' },
  { id: 'wp3', url: '/images/wallpaper_3.png', label: 'Sessiz Zafer' },
  { id: 'wp4', url: '/images/wallpaper_4.png', label: 'Kanatlı Zirve' }
];

export default function HomeTab() {
  const [downloadStats, setDownloadStats] = useState({ 
    version: '1.0.2', 
    size: '15.8 MB', 
    date: 'Bugün',
    apkUrl: 'https://github.com/bercaius/ChadFocus/releases',
    exeUrl: 'https://github.com/bercaius/ChadFocus/releases'
  });

  const [bgImage, setBgImage] = useState('/images/chad_collage_bg.jpg');

  // Arka planı localStorage'dan oku
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedBg = localStorage.getItem('cf-wallpaper');
      if (savedBg) setBgImage(savedBg);
    }
  }, []);

  // GitHub Sürümlerini Çek
  useEffect(() => {
    async function fetchLatest() {
      try {
        const res = await fetch('https://api.github.com/repos/bercaius/ChadFocus/releases/latest');
        if (res.ok) {
          const data = await res.json();
          const apk = data.assets.find(a => a.name.endsWith('.apk'));
          const exe = data.assets.find(a => a.name.endsWith('.exe') || a.name.endsWith('.msi'));
          
          setDownloadStats({
            version: data.tag_name,
            size: apk ? (apk.size / (1024 * 1024)).toFixed(1) + ' MB' : '15.8 MB',
            date: new Date(data.published_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' }),
            apkUrl: apk ? apk.browser_download_url : 'https://github.com/bercaius/ChadFocus/releases',
            exeUrl: exe ? exe.browser_download_url : 'https://github.com/bercaius/ChadFocus/releases'
          });
        }
      } catch (e) {
        console.error('Update stats fetch failed', e);
      }
    }
    fetchLatest();
  }, []);

  const changeBackground = (url) => {
    setBgImage(url);
    localStorage.setItem('cf-wallpaper', url);
  };

  return (
    <div className="relative min-h-[600px] rounded-3xl overflow-hidden glass-card p-6 md:p-12 flex flex-col justify-between">
      {/* Dynamic Background Image with Smooth Cross-fade Transition */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 opacity-40 transition-all duration-1000 ease-in-out" 
        style={{ backgroundImage: `url('${bgImage}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/80 to-transparent z-0" />

      {/* Top Header Section (Borderless Logo) */}
      <div className="relative z-10 max-w-2xl space-y-6 mt-4">
        {/* Çerçevesiz, şeffaf logo alanı. Arkadaki fotoğrafın üstünü kapatmaz */}
        <div className="flex items-center gap-4 w-fit">
          <img src="/images/app_logo.png?v=3" alt="ChadFocus Logo" className="w-16 h-16 rounded-2xl object-cover" />
          <div>
            <h1 className="text-2xl font-black tracking-tight" style={{ background: 'linear-gradient(90deg, #FFD700, #CD7F32)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              CHADFOCUS
            </h1>
            <p className="text-[10px] text-[#FFE082] font-bold tracking-[0.2em] uppercase">Pijamalı Badici Protokolü</p>
          </div>
        </div>

        <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.15]">
          Ortalama Yaşamdan Kurtul, <br />
          <span style={{ color: '#FFD700' }}>Kendi Potansiyelini Zirveye Taşı.</span>
        </h2>

        {/* Feature Highlights (Borderless Cards) */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          {[
            { icon: '🔥', title: 'Badici Odağı', desc: 'Zaman Yönetimi' },
            { icon: '🏆', title: 'Win Takibi', desc: 'Günlük Başarı' },
            { icon: '🔄', title: 'Senkronize', desc: 'Mobil & PC Eşit' }
          ].map((f, i) => (
            <div key={i} className="p-3 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm text-center">
              <span className="text-lg block mb-1">{f.icon}</span>
              <div className="text-[10px] font-extrabold text-zinc-100 uppercase tracking-wider">{f.title}</div>
              <div className="text-[9px] text-zinc-400 mt-0.5">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Wallpapers Interactive Selector (Özgün İnteraktif Bölüm) */}
      <div className="relative z-10 my-6">
        <div className="text-[10px] font-extrabold text-[#FFD700] tracking-widest uppercase mb-3">
          Masaüstü / Arka Plan Seçici
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {WALLPAPERS.map(wp => (
            <button
              key={wp.id}
              onClick={() => changeBackground(wp.url)}
              className={`flex-shrink-0 p-1 rounded-xl transition-all duration-300 ${bgImage === wp.url ? 'bg-[#FFD700] scale-105' : 'bg-white/5 hover:bg-white/10'}`}
            >
              <div className="relative w-24 h-14 rounded-lg overflow-hidden">
                <img src={wp.url} alt={wp.label} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-end p-1">
                  <span className="text-[8px] font-bold text-white truncate w-full">{wp.label}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Download Buttons (No 404s, direct links) */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-6 border-t border-zinc-800/40">
        <a 
          href={downloadStats.apkUrl}
          className="flex items-center justify-between bg-gradient-to-r from-[#FFD700] to-[#CD7F32] text-black font-bold p-4 rounded-2xl hover:brightness-110 active:scale-95 transition-all shadow-[0_8px_24px_rgba(255,215,0,0.15)] group"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🤖</span>
            <div className="text-left">
              <div className="text-xs uppercase tracking-wider font-extrabold">Mobil İndir</div>
              <div className="text-[10px] opacity-75 font-normal">Android APK • v{downloadStats.version} • {downloadStats.size}</div>
            </div>
          </div>
          <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
        </a>

        <a 
          href={downloadStats.exeUrl}
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
