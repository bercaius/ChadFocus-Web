'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { DEFAULT_HABITS, ACHIEVEMENTS, THEMES, LEVELS } from '@/lib/habitData';
import { calcStats, getLevel, updateChart } from '@/lib/statsEngine';
// next-auth/react importu kaldırıldı, local-first mock auth yapısına geçildi
import HomeTab from '@/app/components/HomeTab';
import DashboardTab from '@/app/components/DashboardTab';
import HabitsTab from '@/app/components/HabitsTab';
import AnalyticsTab from '@/app/components/AnalyticsTab';
import AchievementsTab from '@/app/components/AchievementsTab';
import StudioTab from '@/app/components/StudioTab';
import SettingsTab from '@/app/components/SettingsTab';
import ShareModal from '@/app/components/ShareModal';

const TABS = [
  { 
    id: 'home', 
    label: 'Ana Sayfa', 
    tooltip: 'Ana Sayfa',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )
  },
  { 
    id: 'dash', 
    label: 'Kontrol Paneli', 
    tooltip: 'Durum',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
      </svg>
    )
  },
  { 
    id: 'habits', 
    label: 'Alışkanlıklar', 
    tooltip: 'Winler',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    )
  },
  { 
    id: 'analytics', 
    label: 'İstatistik', 
    tooltip: 'Analiz',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10a2 2 0 01-2 2h-2a2 2 0 01-2-2zm9-10v10a2 2 0 002 2h2a2 2 0 002-2V9a2 2 0 00-2-2h-2a2 2 0 00-2 2z" />
      </svg>
    )
  },
  { 
    id: 'achieve', 
    label: 'Başarımlar', 
    tooltip: 'Başarımlar',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 019.5 3H9a2 2 0 00-2 2v1m10-1.5A2.5 2.5 0 0114.5 6H14a2 2 0 002-2V3.5M3 9h18M3 9a2 2 0 002 2h14a2 2 0 002-2M3 9v9a2 2 0 002 2h14a2 2 0 002-2V9" />
      </svg>
    )
  },
  { 
    id: 'studio', 
    label: 'Turco Develop', 
    tooltip: 'Stüdyo',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  },
  { 
    id: 'settings', 
    label: 'Ayarlar', 
    tooltip: 'Ayarlar',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  }
];

function makeChart() {
  const d = [];
  const t = new Date();
  for (let i = 13; i >= 0; i--) {
    const z = new Date(t); z.setDate(z.getDate() - i);
    d.push({ day: z.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }), date: z.toISOString().slice(0,10), completed: 0, total: DEFAULT_HABITS.length, percent: 0 });
  }
  return d;
}

export default function Home() {
  const [session, setSession] = useLocalStorage('cf-session', null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    setStatus(session ? 'authenticated' : 'unauthenticated');
  }, [session]);
  const [habits, setHabits] = useLocalStorage('cf-habits', DEFAULT_HABITS);
  const [chart, setChart] = useLocalStorage('cf-chart', makeChart());
  const [achi, setAchi] = useLocalStorage('cf-achi', ACHIEVEMENTS.map(a => ({ ...a, unlocked: false })));
  const [theme, setTheme] = useLocalStorage('cf-theme', 'cyberpunk');
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState('home');
  const [share, setShare] = useState(false);

  // macOS Dock Büyütme Efekti için Hover State
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => { 
    setMounted(true); 
    document.documentElement.setAttribute('data-theme', theme); 
  }, [theme]);

  const stats = useMemo(() => calcStats(habits, chart, achi), [habits, chart, achi]);
  const chad = useMemo(() => getLevel(stats.maxStreak, LEVELS), [stats.maxStreak]);

  const toggle = useCallback((id) => {
    setHabits(p => {
      const u = p.map(h => h.id === id ? { ...h, done: !h.done } : h);
      const all = u.every(h => h.done);
      const r = all ? u.map(h => ({ ...h, streak: h.done ? h.streak + 1 : 0, bestStreak: h.done ? Math.max(h.streak + 1, h.bestStreak) : h.bestStreak })) : u;
      setTimeout(() => { setChart(c => updateChart(r, c)); }, 0);
      return r;
    });
  }, [setHabits, setChart]);

  const rename = useCallback((id, name) => setHabits(p => p.map(h => h.id === id ? { ...h, name } : h)), [setHabits]);

  const resetAll = useCallback(() => {
    setHabits(DEFAULT_HABITS);
    setChart(makeChart());
    setAchi(ACHIEVEMENTS.map(a => ({ ...a, unlocked: false })));
  }, [setHabits, setChart, setAchi]);

  const changeTheme = useCallback((t) => {
    setTheme(t);
    document.documentElement.setAttribute('data-theme', t);
  }, [setTheme]);

  // Tab indeksini bul
  const activeIndex = useMemo(() => TABS.findIndex(t => t.id === tab), [tab]);

  if (!mounted || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <p className="text-sm font-bold text-zinc-400 animate-pulse">ChadFocus Yükleniyor...</p>
      </div>
    );
  }

  // === GOOGLE AUTH WALL (Bariyer) ===
  if (status === 'unauthenticated') {
    return (
      <div 
        className="min-h-screen bg-cover bg-center flex items-center justify-center relative p-4"
        style={{ backgroundImage: "url('/images/chad_collage_bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-[#0B0F19]/85 z-0" />
        
        <div className="relative z-10 w-full max-w-md p-8 bg-zinc-950/80 border border-zinc-800 backdrop-blur-md rounded-3xl text-center shadow-[0_20px_80px_rgba(0,0,0,0.55)] space-y-6">
          <div className="flex flex-col items-center">
            <img src="/images/app_logo.png?v=3" alt="ChadFocus Logo" className="w-20 h-20 rounded-2xl object-cover mb-4" />
            <h1 className="text-3xl font-black tracking-tight" style={{ background: 'linear-gradient(90deg, #FFD700, #CD7F32)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              CHADFOCUS
            </h1>
            <p className="text-[10px] text-[#FFE082] font-bold tracking-[0.25em] uppercase mt-1">Pijamalı Badici Protokolü</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">Gelişime İlk Adımı At</h2>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-xs mx-auto">
              Disiplinini görselleştirmek ve verilerini mobil/masaüstü cihazlarınla eşitlemek için Google hesabınla güvenli giriş yap.
            </p>
          </div>

          <button 
            type="button" 
            onClick={() => {
              const mockUser = { 
                user: { 
                  name: 'Pijamalı Badici', 
                  email: 'badici@turcodevelop.com', 
                  image: '/images/app_logo.png?v=3' 
                } 
              };
              setSession(mockUser);
            }} 
            className="flex items-center justify-center gap-3 w-full p-4 rounded-2xl bg-gradient-to-r from-[#FFD700] to-[#CD7F32] hover:brightness-110 active:scale-95 text-black font-extrabold text-sm transition-all cursor-pointer shadow-[0_8px_24px_rgba(255,215,0,0.15)]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.113-5.111 4.113-3.418 0-6.19-2.772-6.19-6.19 0-3.418 2.772-6.19 6.19-6.19 1.57 0 2.996.59 4.095 1.548l3.155-3.155C19.123 2.012 15.932 1 12.24 1 5.922 1 1 5.922 1 12.24s4.922 11.24 11.24 11.24c6.318 0 11.24-4.922 11.24-11.24 0-.795-.078-1.57-.217-2.315H12.24z"/>
            </svg>
            Google ile Giriş Yap / Kaydol (Tek Tıkla Giriş)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }} className="pb-16">
      <div className="max-w-5xl mx-auto px-4 py-6">
        
        {/* Header */}
        <header className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-900/30">
          <div className="flex items-center gap-3">
            <img src="/images/app_logo.png?v=3" alt="ChadFocus Logo" className="w-8 h-8 rounded-lg object-cover" />
            <div>
              <h1 className="text-lg font-black tracking-tight" style={{ background: 'linear-gradient(90deg, #FFD700, #CD7F32)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                CHADFOCUS
              </h1>
              <p className="text-[9px] font-bold tracking-wider" style={{ color: 'var(--text-muted)' }}>Pijamalı Badici Protokolü</p>
            </div>
          </div>

          {/* Profil ve Oturumu Kapatma Butonu */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/5 border border-white/5 px-3 py-1.5 rounded-2xl">
              {session?.user?.image && (
                <img src={session.user.image} alt={session.user.name} className="w-7 h-7 rounded-full border border-[#FFD700]/30" />
              )}
              <div className="hidden md:block text-left">
                <div className="text-[9px] text-zinc-400 font-medium">Hoş Geldin</div>
                <div className="text-[10px] font-bold text-zinc-100 leading-none">{session?.user?.name}</div>
              </div>
            </div>

            <button 
              onClick={() => setSession(null)}
              className="bg-white/5 hover:bg-white/10 text-[#FFD700] border border-[#FFD700]/25 text-[10px] font-extrabold px-3 py-2 rounded-xl transition-all cursor-pointer"
            >
              HESAP DEĞİŞTİR / ÇIK
            </button>
          </div>
        </header>

        {/* macOS / Linux Dock Style Tab Menu */}
        <nav className="mb-8">
          <div className="mac-dock-container">
            {TABS.map((t, idx) => {
              let scaleClass = 'scale-100';
              if (hoveredIndex === idx) {
                scaleClass = 'scale-130 -translate-y-2';
              } else if (hoveredIndex !== null && Math.abs(hoveredIndex - idx) === 1) {
                scaleClass = 'scale-115 -translate-y-1';
              }

              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`mac-dock-item ${scaleClass} ${tab === t.id ? 'active' : ''}`}
                >
                  {t.icon}
                  <span className="tooltip">{t.tooltip}</span>
                  {tab === t.id && <span className="mac-dock-indicator" />}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Content with Horizontal Slide Animation */}
        <div className="tab-transition-wrapper">
          <div 
            className="tab-transition-container" 
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {/* Panel 0: Home */}
            <div className={`tab-panel ${tab === 'home' ? 'active' : ''}`}>
              <HomeTab />
            </div>

            {/* Panel 1: Dashboard */}
            <div className={`tab-panel ${tab === 'dash' ? 'active' : ''}`}>
              <DashboardTab habits={habits} chart={chart} stats={stats} chad={chad} onToggle={toggle} onShare={() => setShare(true)} />
            </div>

            {/* Panel 2: Habits */}
            <div className={`tab-panel ${tab === 'habits' ? 'active' : ''}`}>
              <HabitsTab habits={habits} onToggle={toggle} onRename={rename} />
            </div>

            {/* Panel 3: Analytics */}
            <div className={`tab-panel ${tab === 'analytics' ? 'active' : ''}`}>
              <AnalyticsTab habits={habits} chart={chart} stats={stats} />
            </div>

            {/* Panel 4: Achievements */}
            <div className={`tab-panel ${tab === 'achieve' ? 'active' : ''}`}>
              <AchievementsTab habits={habits} chart={chart} stats={stats} achi={achi} chad={chad} />
            </div>

            {/* Panel 5: Studio */}
            <div className={`tab-panel ${tab === 'studio' ? 'active' : ''}`}>
              <StudioTab />
            </div>

            {/* Panel 6: Settings */}
            <div className={`tab-panel ${tab === 'settings' ? 'active' : ''}`}>
              <SettingsTab theme={theme} themes={THEMES} onChangeTheme={changeTheme} onReset={resetAll} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-8 mt-12 border-t border-zinc-900/10">
          <p className="text-[10px] tracking-[4px] uppercase" style={{ color: 'var(--text-dim)' }}>
            yapımcı · <a href="https://www.instagram.com/bercaius.dev/" target="_blank" rel="noopener" className="hover:text-amber-500 transition-colors font-bold">@bercaius.dev</a>
          </p>
          <p className="text-[10px] tracking-[3px] uppercase mt-2" style={{ color: 'var(--text-dim)' }}>
            stüdyo · <a href="https://turcodevelopstudio.web.app/" target="_blank" rel="noopener" className="hover:text-orange-500 transition-colors font-bold">@turcodevelopstudio</a>
          </p>
          <p className="text-[8px] mt-4" style={{ color: 'var(--text-dim)' }}>ChadFocus · Disiplin bir kas gibidir.</p>
        </footer>
      </div>

      {share && <ShareModal habits={habits} chart={chart} stats={stats} onClose={() => setShare(false)} />}
    </div>
  );
}