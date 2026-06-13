'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { DEFAULT_HABITS, ACHIEVEMENTS, THEMES, LEVELS } from '@/lib/habitData';
import { calcStats, getLevel, updateChart } from '@/lib/statsEngine';
import { useAuth } from '@/app/components/AuthProvider';
import { db } from '@/lib/firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';

import DashboardTab from '@/app/components/DashboardTab';
import HabitsTab from '@/app/components/HabitsTab';
import AnalyticsTab from '@/app/components/AnalyticsTab';
import AchievementsTab from '@/app/components/AchievementsTab';
import StudioTab from '@/app/components/StudioTab';
import SettingsTab from '@/app/components/SettingsTab';
import ShareModal from '@/app/components/ShareModal';

const TABS = [
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

const WALLPAPERS = [
  { id: 'w1', img: '/images/wallpaper_1.png?v=3', name: 'Efsane Klasik' },
  { id: 'w2', img: '/images/wallpaper_2.png?v=3', name: 'Hit Kürü' },
  { id: 'w3', img: '/images/wallpaper_3.png?v=3', name: 'Disiplin Profili' },
  { id: 'w4', img: '/images/wallpaper_4.png?v=3', name: 'Kusursuz Zafer' }
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
  const { user, loading: authLoading, signInWithGoogle, logout } = useAuth();
  const [habits, setHabits] = useState(DEFAULT_HABITS);
  const [chart, setChart] = useState(makeChart());
  const [achi, setAchi] = useState(ACHIEVEMENTS.map(a => ({ ...a, unlocked: false })));
  const [theme, setTheme] = useLocalStorage('cf-theme', 'cyberpunk');
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState('dash');
  const [share, setShare] = useState(false);
  
  // Elit Landing Arayüzü Durumu (showWeb=false iken landing gösterilir)
  const [showWeb, setShowWeb] = useState(false);

  // Kalıcı Duvar Kağıdı Seçimi
  const [wallpaper, setWallpaper] = useLocalStorage('cf-wallpaper', '/images/wallpaper_1.png?v=3');

  // macOS Dock Büyütme Efekti
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => { 
    setMounted(true); 
    document.documentElement.setAttribute('data-theme', theme); 
  }, [theme]);

  // Firestore Eşitleme Dinleyicisi
  useEffect(() => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.habits) setHabits(data.habits);
        if (data.chart) setChart(data.chart);
        if (data.achi) setAchi(data.achi);
      } else {
        const initialAchi = ACHIEVEMENTS.map(a => ({ ...a, unlocked: false }));
        const initialChart = makeChart();
        setDoc(userDocRef, {
          habits: DEFAULT_HABITS,
          chart: initialChart,
          achi: initialAchi
        });
        setHabits(DEFAULT_HABITS);
        setChart(initialChart);
        setAchi(initialAchi);
      }
    });
    return () => unsubscribe();
  }, [user]);

  // Firestore Veri Kaydetme Fonksiyonu
  const saveData = async (updatedHabits, updatedChart, updatedAchi) => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.uid);
    try {
      await setDoc(userDocRef, {
        habits: updatedHabits || habits,
        chart: updatedChart || chart,
        achi: updatedAchi || achi
      }, { merge: true });
    } catch (error) {
      console.error("Bulut senkronizasyon hatası:", error);
    }
  };

  const stats = useMemo(() => calcStats(habits, chart, achi), [habits, chart, achi]);
  const chad = useMemo(() => getLevel(stats.maxStreak, LEVELS), [stats.maxStreak]);

  // Checkbox Tik Atma
  const toggle = useCallback((id) => {
    const updatedHabits = habits.map(h => h.id === id ? { ...h, done: !h.done } : h);
    const all = updatedHabits.every(h => h.done);
    const finalHabits = all ? updatedHabits.map(h => ({ 
      ...h, 
      streak: h.done ? h.streak + 1 : 0, 
      bestStreak: h.done ? Math.max(h.streak + 1, h.bestStreak) : h.bestStreak 
    })) : updatedHabits;
    
    const finalChart = updateChart(finalHabits, chart);
    saveData(finalHabits, finalChart, null);
  }, [habits, chart, user]);

  // Alışkanlık Ekleme (Rutin Oluşturma)
  const addHabit = useCallback((name, cat) => {
    const newHabit = {
      id: 'h_' + Date.now(),
      name,
      cat,
      done: false,
      streak: 0,
      bestStreak: 0
    };
    const updated = [...habits, newHabit];
    saveData(updated, null, null);
  }, [habits, user]);

  // Alışkanlık Silme
  const deleteHabit = useCallback((id) => {
    const updated = habits.filter(h => h.id !== id);
    saveData(updated, null, null);
  }, [habits, user]);

  // Ad Değiştirme
  const rename = useCallback((id, name) => {
    const updated = habits.map(h => h.id === id ? { ...h, name } : h);
    saveData(updated, null, null);
  }, [habits, user]);

  // Reset
  const resetAll = useCallback(() => {
    const initialChart = makeChart();
    const initialAchi = ACHIEVEMENTS.map(a => ({ ...a, unlocked: false }));
    setHabits(DEFAULT_HABITS);
    setChart(initialChart);
    setAchi(initialAchi);
    saveData(DEFAULT_HABITS, initialChart, initialAchi);
  }, [user]);

  const changeTheme = useCallback((t) => {
    setTheme(t);
    document.documentElement.setAttribute('data-theme', t);
  }, [setTheme]);

  // Tab indeks bul
  const activeIndex = useMemo(() => TABS.findIndex(t => t.id === tab), [tab]);

  if (!mounted || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <p className="text-xs font-black tracking-widest text-zinc-500 animate-pulse">CHADFOCUS YÜKLENİYOR...</p>
      </div>
    );
  }

  // ==================== 1. GOOGLE AUTH BARİYERİ (GOOGLE LOGIN) ====================
  if (!user) {
    return (
      <div 
        className="min-h-screen bg-cover bg-center flex items-center justify-center relative p-4 transition-all duration-1000"
        style={{ backgroundImage: "url('/images/wallpaper_1.png?v=3')" }}
      >
        <div className="absolute inset-0 bg-black/90 backdrop-blur-md z-0" />
        
        <div className="relative z-10 w-full max-w-sm p-8 bg-zinc-950/70 border border-zinc-900 backdrop-blur-xl rounded-3xl text-center shadow-[0_20px_100px_rgba(0,0,0,0.85)] space-y-6">
          <div className="flex flex-col items-center">
            {/* Elit Siyah-Beyaz Logo */}
            <img 
              src="/images/app_logo.png?v=3" 
              alt="ChadFocus Logo" 
              className="w-24 h-24 object-cover mb-4 filter grayscale brightness-90 hover:grayscale-0 transition-all duration-500" 
            />
            <h1 className="text-2xl font-black tracking-widest text-white uppercase">
              CHADFOCUS
            </h1>
            <p className="text-[9px] text-zinc-500 font-bold tracking-[0.25em] uppercase mt-1">Pijamalı Badici Protokolü</p>
          </div>

          <div className="space-y-1">
            <h2 className="text-md font-bold text-zinc-200">Gelişime İlk Adımı At</h2>
            <p className="text-[11px] text-zinc-500 leading-relaxed max-w-xs mx-auto">
              Disiplinini takip etmek ve tüm cihazlarınla bulut üzerinden senkronize olmak için Google hesabınla güvenli giriş yap.
            </p>
          </div>

          <button 
            type="button" 
            onClick={signInWithGoogle} 
            className="flex items-center justify-center gap-3 w-full p-4 rounded-2xl bg-zinc-100 hover:bg-white text-black font-black text-xs transition-all cursor-pointer shadow-lg active:scale-95"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.113-5.111 4.113-3.418 0-6.19-2.772-6.19-6.19 0-3.418 2.772-6.19 6.19-6.19 1.57 0 2.996.59 4.095 1.548l3.155-3.155C19.123 2.012 15.932 1 12.24 1 5.922 1 1 5.922 1 12.24s4.922 11.24 11.24 11.24c6.318 0 11.24-4.922 11.24-11.24 0-.795-.078-1.57-.217-2.315H12.24z"/>
            </svg>
            GOOGLE İLE GİRİŞ YAP
          </button>
        </div>
      </div>
    );
  }

  // ==================== 2. ELİT TEK EKRAN LANDİNG / GİRİŞ EKRANI ====================
  if (!showWeb) {
    return (
      <div 
        className="min-h-screen bg-cover bg-center flex flex-col justify-between relative p-6 md:p-12 transition-all duration-1000"
        style={{ backgroundImage: `url('${wallpaper}')` }}
      >
        {/* Karartma degrade kaplama */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/90 z-0" />

        {/* Header (Sol Logo, Sağ Profil) */}
        <header className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/images/app_logo.png?v=3" 
              alt="Logo" 
              className="w-12 h-12 object-cover filter grayscale contrast-125" 
            />
            <div>
              <h1 className="text-md font-black tracking-widest text-zinc-100 uppercase">CHADFOCUS</h1>
              <p className="text-[8px] text-zinc-500 font-bold tracking-wider uppercase">Pijamalı Badici Protokolü</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/5 border border-white/5 px-3 py-1.5 rounded-2xl backdrop-blur-md">
              {user.image && (
                <img src={user.image} alt={user.name} className="w-6 h-6 rounded-full border border-white/20 filter grayscale" />
              )}
              <div className="hidden sm:block text-left">
                <div className="text-[8px] text-zinc-500 font-bold uppercase">Badici</div>
                <div className="text-[10px] font-black text-zinc-200">{user.name}</div>
              </div>
            </div>
            <button 
              onClick={logout}
              className="bg-white/5 hover:bg-white/10 text-zinc-400 border border-white/10 text-[9px] font-black px-3 py-2 rounded-xl transition-all cursor-pointer"
            >
              ÇIK
            </button>
          </div>
        </header>

        {/* Center Main Content */}
        <main className="relative z-10 max-w-4xl mx-auto text-center my-auto py-12 space-y-8">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase leading-none max-w-3xl mx-auto">
            ORTALAMA YAŞAMDAN KURTUL, <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-500">POTANSİYELİNİ ZİRVEYE TAŞ.</span>
          </h2>
          
          <p className="text-xs md:text-sm text-zinc-500 max-w-lg mx-auto font-medium leading-relaxed">
            Grind ritmini her an yanında taşı. Gereksiz her şeyi dışarıda bırak; sadece hedeflerin, rutinlerin ve demir gibi bir irade.
          </p>

          {/* Elit Butonlar Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto pt-4">
            <a 
              href="https://github.com/bercaius/ChadFocus/raw/main/web/ChadFocus.exe" 
              className="group flex flex-col justify-center items-center p-5 rounded-2xl bg-zinc-950/50 border border-white/5 hover:border-white/20 hover:bg-zinc-900/40 transition-all duration-300 active:scale-95 shadow-xl backdrop-blur-sm"
            >
              <svg className="w-6 h-6 mb-2 text-zinc-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              <span className="text-xs font-black text-white uppercase tracking-wider">MASAÜSTÜ SÜRÜMÜ</span>
              <span className="text-[9px] text-zinc-500 font-bold mt-1">Windows EXE / MSI indir</span>
            </a>

            <a 
              href="https://github.com/bercaius/ChadFocus/raw/main/web/ChadFocus.apk" 
              className="group flex flex-col justify-center items-center p-5 rounded-2xl bg-zinc-950/50 border border-white/5 hover:border-white/20 hover:bg-zinc-900/40 transition-all duration-300 active:scale-95 shadow-xl backdrop-blur-sm"
            >
              <svg className="w-6 h-6 mb-2 text-zinc-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
              </svg>
              <span className="text-xs font-black text-white uppercase tracking-wider">MOBİL SÜRÜMÜ</span>
              <span className="text-[9px] text-zinc-500 font-bold mt-1">Android APK yükle</span>
            </a>

            <button 
              onClick={() => setShowWeb(true)}
              className="group flex flex-col justify-center items-center p-5 rounded-2xl bg-gradient-to-r from-zinc-100 to-zinc-300 hover:brightness-110 transition-all duration-300 active:scale-95 shadow-xl shadow-white/5 cursor-pointer"
            >
              <svg className="w-6 h-6 mb-2 text-zinc-800" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
              </svg>
              <span className="text-xs font-black text-black uppercase tracking-wider">WEB SÜRÜMÜNÜ KULLAN</span>
              <span className="text-[9px] text-zinc-800 font-bold mt-1">Tarayıcıda anında başla</span>
            </button>
          </div>
        </main>

        {/* Footer (Motivasyon Duvar Kağıtları Seçici) */}
        <footer className="relative z-10 w-full max-w-4xl mx-auto pt-6 border-t border-white/5 space-y-3">
          <div className="flex justify-between items-center px-1">
            <span className="text-[9px] font-black tracking-widest text-zinc-500 uppercase">MOTİVASYON DUVAR KAĞITLARI</span>
            <span className="text-[9px] text-zinc-600 font-bold">Arka Planı Değiştir</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {WALLPAPERS.map((w) => (
              <button 
                key={w.id} 
                onClick={() => setWallpaper(w.img)}
                className={`group relative h-16 rounded-xl overflow-hidden border transition-all duration-500 cursor-pointer ${
                  wallpaper === w.img ? 'border-zinc-300 scale-98 shadow-md' : 'border-white/5 hover:border-white/20 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={w.img} alt={w.name} className="absolute inset-0 w-full h-full object-cover filter grayscale contrast-125 transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors duration-500" />
                <span className="relative z-10 text-[9px] font-black text-zinc-300 group-hover:text-white uppercase tracking-wider">{w.name}</span>
              </button>
            ))}
          </div>
        </footer>
      </div>
    );
  }

  // ==================== 3. WEB SÜRÜMÜ TAKİP ARAYÜZÜ (KONTROL PANELİ) ====================
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }} className="pb-16 transition-all duration-500">
      <div className="max-w-5xl mx-auto px-4 py-6">
        
        {/* Header */}
        <header className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-900/30">
          <div className="flex items-center gap-3">
            <img src="/images/app_logo.png?v=3" alt="ChadFocus Logo" className="w-8 h-8 rounded-lg object-cover filter grayscale" />
            <div>
              <h1 className="text-lg font-black tracking-tight" style={{ background: 'linear-gradient(90deg, #FFD700, #CD7F32)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                CHADFOCUS
              </h1>
              <p className="text-[9px] font-bold tracking-wider" style={{ color: 'var(--text-muted)' }}>Pijamalı Badici Protokolü</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Landing Ekranına Dön Butonu (Web'i Kapat) */}
            <button 
              onClick={() => setShowWeb(false)}
              className="bg-zinc-900/80 hover:bg-zinc-800 border border-white/5 text-zinc-300 text-[10px] font-black px-4 py-2 rounded-xl transition-all cursor-pointer"
            >
              ← ANA SAYFAYA DÖN
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
            {/* Panel 0: Dashboard */}
            <div className={`tab-panel ${tab === 'dash' ? 'active' : ''}`}>
              <DashboardTab habits={habits} chart={chart} stats={stats} chad={chad} onToggle={toggle} onShare={() => setShare(true)} />
            </div>

            {/* Panel 1: Habits */}
            <div className={`tab-panel ${tab === 'habits' ? 'active' : ''}`}>
              <HabitsTab habits={habits} onToggle={toggle} onAdd={addHabit} onDelete={deleteHabit} />
            </div>

            {/* Panel 2: Analytics */}
            <div className={`tab-panel ${tab === 'analytics' ? 'active' : ''}`}>
              <AnalyticsTab habits={habits} chart={chart} stats={stats} />
            </div>

            {/* Panel 3: Achievements */}
            <div className={`tab-panel ${tab === 'achieve' ? 'active' : ''}`}>
              <AchievementsTab habits={habits} chart={chart} stats={stats} achi={achi} chad={chad} />
            </div>

            {/* Panel 4: Studio */}
            <div className={`tab-panel ${tab === 'studio' ? 'active' : ''}`}>
              <StudioTab />
            </div>

            {/* Panel 5: Settings */}
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