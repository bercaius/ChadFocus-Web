'use client';

import { useState, useEffect } from 'react';
import { Timer, Droplets, BookOpen, Play, Pause, RotateCcw, Check, Moon, Flame, Activity, HeartPulse } from 'lucide-react';
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

  // 3. SLEEP TRACKER
  const [sleepHours, setSleepHours] = useLocalStorage('cf-sleep', 0);
  const SLEEP_GOAL = 8;

  // 4. CALORIES / MACRO TRACKER
  const [calories, setCalories] = useLocalStorage('cf-cal', 0);
  const CALORIE_GOAL = 2500;

  // 5. STEPS TRACKER
  const [steps, setSteps] = useLocalStorage('cf-steps', 0);
  const STEPS_GOAL = 10000;

  // 6. DAILY JOURNAL
  const [journal, setJournal] = useLocalStorage('cf-journal', '');
  const [savedStatus, setSavedStatus] = useState(false);

  const saveJournal = (e) => {
    e.preventDefault();
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative z-10" style={{ maxHeight: 'calc(100vh - 4rem)' }}>
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="glass-panel rounded-2xl p-8 shadow-xl relative overflow-hidden border border-[var(--glass-border)]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 opacity-5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 tracking-tight flex items-center gap-3">
            <HeartPulse className="w-8 h-8 text-blue-400" />
            Sağlık & Gelişim Merkezi
          </h2>
          <p className="text-[var(--text-muted)] mt-2 font-mono text-sm uppercase tracking-widest">Sistem Durumu: Stabil | v0.0.5 Biyometrik Çekirdek Aktif</p>
        </div>

        {/* TOP ROW: Odak & Jurnal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* POMODORO WIDGET */}
          <div className="glass-panel rounded-2xl p-6 border border-[var(--glass-border)] relative overflow-hidden group">
            <div className={`absolute inset-0 opacity-10 transition-colors duration-1000 ${isBreak ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
            <div className="relative z-10 flex flex-col items-center justify-center h-full">
              <div className="flex items-center gap-2 mb-4 w-full">
                <Timer className={`w-5 h-5 ${isBreak ? 'text-emerald-400' : 'text-red-400'}`} />
                <span className="font-bold text-sm text-zinc-300">{isBreak ? 'MOLA VAKTİ' : 'ODAK SEANSI'}</span>
              </div>
              
              <div className={`text-5xl lg:text-6xl font-black tracking-tighter mb-6 ${isBreak ? 'text-emerald-400' : 'text-red-400'} drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]`}>
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

          {/* JOURNAL WIDGET */}
          <div className="glass-panel rounded-2xl p-6 border border-[var(--glass-border)] md:col-span-2 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-400" />
                <span className="font-bold text-sm text-zinc-300">SAVAŞ GÜNLÜĞÜ</span>
              </div>
              {savedStatus && <span className="text-xs font-bold text-green-500 flex items-center gap-1"><Check className="w-3 h-3"/> KAYDEDİLDİ</span>}
            </div>
            
            <form onSubmit={saveJournal} className="flex flex-col flex-1 gap-3">
              <textarea 
                value={journal}
                onChange={(e) => setJournal(e.target.value)}
                placeholder="Bugün fiziksel ve mental hedeflerine ulaştın mı? Disiplin zafiyetlerin nelerdi? Analizini buraya kaydet..."
                className="flex-1 w-full bg-zinc-950/80 border border-zinc-800/50 rounded-xl p-4 text-sm text-zinc-300 focus:border-purple-500/50 focus:bg-zinc-900 transition-all outline-none resize-none custom-scrollbar"
              />
              <button type="submit" className="w-full py-3 bg-purple-500/20 border border-purple-500/30 text-purple-400 font-black tracking-widest text-xs rounded-xl hover:bg-purple-500 hover:text-white transition-all">
                VERİYİ SİSTEME İŞLE
              </button>
            </form>
          </div>
        </div>

        {/* MIDDLE ROW: Health Metrics (Samsung Health Style) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* WATER */}
          <div className="glass-panel rounded-2xl p-6 border border-blue-900/30 flex flex-col justify-between relative overflow-hidden bg-gradient-to-b from-transparent to-blue-900/10">
            <div className="absolute bottom-0 left-0 w-full bg-blue-500/20 transition-all duration-1000 ease-out" style={{ height: `${Math.min(100, (waterCups/WATER_GOAL)*100)}%` }}></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Droplets className="w-5 h-5 text-blue-400" />
                <span className="font-bold text-xs tracking-wider text-zinc-300">HİDRASYON</span>
              </div>
              <div className="text-center mb-6">
                <div className="text-4xl font-black text-blue-400 mb-1">{waterCups}</div>
                <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Bardak (Hedef: {WATER_GOAL})</p>
              </div>
              <div className="flex justify-center gap-2">
                <button onClick={() => setWaterCups(Math.max(0, waterCups - 1))} className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-bold hover:bg-zinc-800 transition-colors">-</button>
                <button onClick={() => setWaterCups(waterCups + 1)} className="flex-1 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400 font-black hover:bg-blue-500 hover:text-white transition-all">+</button>
              </div>
            </div>
          </div>

          {/* SLEEP */}
          <div className="glass-panel rounded-2xl p-6 border border-indigo-900/30 flex flex-col justify-between relative overflow-hidden bg-gradient-to-b from-transparent to-indigo-900/10">
            <div className="absolute bottom-0 left-0 w-full bg-indigo-500/20 transition-all duration-1000 ease-out" style={{ height: `${Math.min(100, (sleepHours/SLEEP_GOAL)*100)}%` }}></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Moon className="w-5 h-5 text-indigo-400" />
                <span className="font-bold text-xs tracking-wider text-zinc-300">UYKU DÖNGÜSÜ</span>
              </div>
              <div className="text-center mb-6">
                <div className="text-4xl font-black text-indigo-400 mb-1">{sleepHours}</div>
                <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Saat (Hedef: {SLEEP_GOAL})</p>
              </div>
              <div className="flex justify-center gap-2">
                <button onClick={() => setSleepHours(Math.max(0, sleepHours - 1))} className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-bold hover:bg-zinc-800 transition-colors">-</button>
                <button onClick={() => setSleepHours(sleepHours + 1)} className="flex-1 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 font-black hover:bg-indigo-500 hover:text-white transition-all">+</button>
              </div>
            </div>
          </div>

          {/* CALORIES */}
          <div className="glass-panel rounded-2xl p-6 border border-orange-900/30 flex flex-col justify-between relative overflow-hidden bg-gradient-to-b from-transparent to-orange-900/10">
            <div className="absolute bottom-0 left-0 w-full bg-orange-500/20 transition-all duration-1000 ease-out" style={{ height: `${Math.min(100, (calories/CALORIE_GOAL)*100)}%` }}></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Flame className="w-5 h-5 text-orange-400" />
                <span className="font-bold text-xs tracking-wider text-zinc-300">BESLENME (KCAL)</span>
              </div>
              <div className="text-center mb-6">
                <div className="text-4xl font-black text-orange-400 mb-1">{calories}</div>
                <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Kcal (Hedef: {CALORIE_GOAL})</p>
              </div>
              <div className="flex justify-center gap-2">
                <button onClick={() => setCalories(Math.max(0, calories - 100))} className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-bold hover:bg-zinc-800 transition-colors">-</button>
                <button onClick={() => setCalories(calories + 100)} className="flex-1 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 text-orange-400 font-black hover:bg-orange-500 hover:text-white transition-all">+100</button>
              </div>
            </div>
          </div>

          {/* STEPS */}
          <div className="glass-panel rounded-2xl p-6 border border-emerald-900/30 flex flex-col justify-between relative overflow-hidden bg-gradient-to-b from-transparent to-emerald-900/10">
            <div className="absolute bottom-0 left-0 w-full bg-emerald-500/20 transition-all duration-1000 ease-out" style={{ height: `${Math.min(100, (steps/STEPS_GOAL)*100)}%` }}></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-xs tracking-wider text-zinc-300">AKTİVİTE (ADIM)</span>
              </div>
              <div className="text-center mb-6">
                <div className="text-4xl font-black text-emerald-400 mb-1">{steps}</div>
                <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Adım (Hedef: {STEPS_GOAL})</p>
              </div>
              <div className="flex justify-center gap-2">
                <button onClick={() => setSteps(Math.max(0, steps - 500))} className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-bold hover:bg-zinc-800 transition-colors">-</button>
                <button onClick={() => setSteps(steps + 500)} className="flex-1 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-black hover:bg-emerald-500 hover:text-white transition-all">+500</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
