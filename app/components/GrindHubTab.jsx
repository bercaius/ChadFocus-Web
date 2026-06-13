'use client';

import { useState, useEffect } from 'react';
import { Timer, Droplets, BookOpen, Play, Pause, RotateCcw, Check } from 'lucide-react';
import { useLocalStorage } from '@/lib/useLocalStorage';

export default function GrindHubTab() {
  // 1. POMODORO TIMER
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 mins
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (isActive && timeLeft === 0) {
      // Switch mode
      const audio = new Audio('https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3');
      audio.play().catch(e=>console.log(e));
      setIsBreak(!isBreak);
      setTimeLeft(!isBreak ? 5 * 60 : 25 * 60);
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, isBreak]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(isBreak ? 5 * 60 : 25 * 60);
  };
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // 2. WATER TRACKER
  const [waterCups, setWaterCups] = useLocalStorage('cf-water', 0);
  const WATER_GOAL = 8;

  // 3. DAILY JOURNAL
  const [journal, setJournal] = useLocalStorage('cf-journal', '');
  const [savedStatus, setSavedStatus] = useState(false);

  const saveJournal = (e) => {
    e.preventDefault();
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative z-10" style={{ maxHeight: 'calc(100vh - 4rem)' }}>
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="glass-panel rounded-2xl p-8 shadow-xl relative overflow-hidden border border-[var(--glass-border)]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 opacity-5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 tracking-tight flex items-center gap-3">
            <RotateCcw className="w-8 h-8 text-blue-400" />
            Grind İşletim Sistemi
          </h2>
          <p className="text-[var(--text-muted)] mt-2 font-mono text-sm">Mental ve fiziksel potansiyelini zirveye taşı.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* POMODORO WIDGET */}
          <div className="glass-panel rounded-2xl p-6 border border-[var(--glass-border)] relative overflow-hidden group">
            <div className={`absolute inset-0 opacity-10 transition-colors duration-1000 ${isBreak ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
            <div className="relative z-10 flex flex-col items-center justify-center h-full">
              <div className="flex items-center gap-2 mb-4 w-full">
                <Timer className={`w-5 h-5 ${isBreak ? 'text-emerald-400' : 'text-red-400'}`} />
                <span className="font-bold text-sm text-zinc-300">{isBreak ? 'MOLA VAKTİ' : 'ODAK SEANSI'}</span>
              </div>
              
              <div className={`text-6xl font-black tracking-tighter mb-6 ${isBreak ? 'text-emerald-400' : 'text-red-400'} drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]`}>
                {formatTime(timeLeft)}
              </div>

              <div className="flex gap-4">
                <button onClick={toggleTimer} className={`p-4 rounded-xl text-black font-black hover:scale-105 transition-transform ${isBreak ? 'bg-emerald-400' : 'bg-red-400'}`}>
                  {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                </button>
                <button onClick={resetTimer} className="p-4 rounded-xl bg-zinc-800 text-white hover:bg-zinc-700 transition-colors">
                  <RotateCcw className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          {/* WATER WIDGET */}
          <div className="glass-panel rounded-2xl p-6 border border-[var(--glass-border)] flex flex-col justify-between relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-full bg-blue-500/10 transition-all duration-1000 ease-out" style={{ height: `${(waterCups/WATER_GOAL)*100}%` }}></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Droplets className="w-5 h-5 text-blue-400" />
                <span className="font-bold text-sm text-zinc-300">HİDRASYON</span>
              </div>
              
              <div className="text-center mb-6">
                <div className="text-5xl font-black text-blue-400 mb-2">{waterCups} <span className="text-xl text-zinc-500">/ {WATER_GOAL}</span></div>
                <p className="text-xs text-zinc-500 font-mono">Bardak Su (Hedef: 2 Litre)</p>
              </div>

              <div className="flex justify-center gap-3">
                <button onClick={() => setWaterCups(Math.max(0, waterCups - 1))} className="w-12 h-12 rounded-xl bg-zinc-800 text-white font-bold hover:bg-zinc-700 transition-colors">-</button>
                <button onClick={() => setWaterCups(waterCups + 1)} className="w-12 h-12 rounded-xl bg-blue-500 text-white font-black hover:scale-105 transition-transform shadow-[0_0_15px_rgba(59,130,246,0.3)]">+</button>
              </div>
            </div>
          </div>

          {/* JOURNAL WIDGET (Takes 1 col on LG, 2 on MD) */}
          <div className="glass-panel rounded-2xl p-6 border border-[var(--glass-border)] md:col-span-2 lg:col-span-1 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-400" />
                <span className="font-bold text-sm text-zinc-300">GÜNLÜK RAPOR</span>
              </div>
              {savedStatus && <Check className="w-4 h-4 text-green-500" />}
            </div>
            
            <form onSubmit={saveJournal} className="flex flex-col flex-1 gap-3">
              <textarea 
                value={journal}
                onChange={(e) => setJournal(e.target.value)}
                placeholder="Bugün ne öğrendin? Neyi daha iyi yapabilirdin? Grind notlarını buraya dök..."
                className="flex-1 w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-sm text-white focus:border-purple-500 outline-none resize-none custom-scrollbar"
              />
              <button type="submit" className="w-full py-3 bg-purple-500 text-white font-bold rounded-xl hover:bg-purple-600 transition-colors">
                KAYDET
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
