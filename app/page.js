'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { DEFAULT_HABITS, ACHIEVEMENTS, THEMES, LEVELS } from '@/lib/habitData';
import { calcStats, getLevel, updateChart } from '@/lib/statsEngine';
import DashboardTab from '@/app/components/DashboardTab';
import HabitsTab from '@/app/components/HabitsTab';
import AnalyticsTab from '@/app/components/AnalyticsTab';
import AchievementsTab from '@/app/components/AchievementsTab';
import SettingsTab from '@/app/components/SettingsTab';
import ShareModal from '@/app/components/ShareModal';

const TABS = [
  { id: 'dash', label: 'Kontrol Paneli', icon: '◈' },
  { id: 'habits', label: 'Alışkanlıklar', icon: '◇' },
  { id: 'analytics', label: 'İstatistik', icon: '◆' },
  { id: 'achieve', label: 'Başarımlar', icon: '◉' },
  { id: 'settings', label: 'Ayarlar', icon: '◎' },
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
  const [habits, setHabits] = useLocalStorage('cf-habits', DEFAULT_HABITS);
  const [chart, setChart] = useLocalStorage('cf-chart', makeChart());
  const [achi, setAchi] = useLocalStorage('cf-achi', ACHIEVEMENTS.map(a => ({ ...a, unlocked: false })));
  const [theme, setTheme] = useLocalStorage('cf-theme', 'cyberpunk');
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState('dash');
  const [share, setShare] = useState(false);

  useEffect(() => { setMounted(true); document.documentElement.setAttribute('data-theme', theme); }, [theme]);

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

  if (!mounted) return <div className="min-h-screen flex items-center justify-center"><p style={{color:'var(--text-muted)'}}>Yükleniyor...</p></div>;

  const render = () => {
    switch(tab) {
      case 'dash': return <DashboardTab habits={habits} chart={chart} stats={stats} chad={chad} onToggle={toggle} onShare={() => setShare(true)} />;
      case 'habits': return <HabitsTab habits={habits} onToggle={toggle} onRename={rename} />;
      case 'analytics': return <AnalyticsTab habits={habits} chart={chart} stats={stats} />;
      case 'achieve': return <AchievementsTab habits={habits} chart={chart} stats={stats} achi={achi} chad={chad} />;
      case 'settings': return <SettingsTab theme={theme} themes={THEMES} onChangeTheme={changeTheme} onReset={resetAll} />;
      default: return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <div className="max-w-5xl mx-auto px-3 py-3">
        {/* Header */}
        <header className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-lg font-bold" style={{ background: 'linear-gradient(90deg, #FFD700, #CD7F32)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              ◈ ChadFocus
            </h1>
            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Disiplin Takip Sistemi</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: '#FFD700' }}>S{stats.level}</span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{stats.xp}XP</span>
          </div>
        </header>

        {/* Tabs */}
        <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`tab-btn ${tab === t.id ? 'active' : ''}`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="tab-content">{render()}</div>

        {/* Footer with credits */}
        <footer className="text-center py-6 mt-8">
          <p className="text-[9px] tracking-[3px] uppercase" style={{ color: 'var(--text-dim)' }}>
            yapımcı · <a href="https://www.instagram.com/bercaius.dev/" target="_blank" rel="noopener" style={{ color: '#FFD700' }}>@bercaius.dev</a>
          </p>
          <p className="text-[9px] tracking-[2px] uppercase mt-1" style={{ color: 'var(--text-dim)' }}>
            stüdyo · <a href="https://www.instagram.com/turcodevelopstudio/" target="_blank" rel="noopener" style={{ color: '#CD7F32' }}>@turcodevelopstudio</a>
          </p>
          <p className="text-[8px] mt-3" style={{ color: 'var(--text-dim)' }}>ChadFocus · Disiplin bir kas gibidir.</p>
        </footer>
      </div>

      {share && <ShareModal habits={habits} chart={chart} stats={stats} onClose={() => setShare(false)} />}
    </div>
  );
}