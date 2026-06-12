'use client';

import { LEVELS } from '@/lib/habitData';

export default function AchievementsTab({ habits, chart, stats, achi, chad }) {
  const lvlIdx = LEVELS.findIndex(l => l.title === chad.title);
  const next = LEVELS[lvlIdx + 1];
  const unlocked = achi.filter(a => a.unlocked).length;

  return (
    <div className="space-y-4">
      {/* Chad Level Progression */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-xl overflow-hidden border-2" style={{ borderColor: 'var(--neon-green)', boxShadow: '0 0 12px var(--glow-green)' }}>
            <img src={chad.img} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <h2 className="text-base font-bold">{chad.title}</h2>
            <p className="text-xs" style={{color:'var(--text-muted)'}}>{chad.sub}</p>
            <div className="flex gap-1 mt-2">
              {LEVELS.map((l, i) => (
                <div key={i} className="stage-dot" style={{ background: i <= lvlIdx ? 'var(--neon-green)' : 'var(--text-dim)' }} />
              ))}
            </div>
          </div>
        </div>
        {next && (
          <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
            <div className="flex justify-between text-[10px] mb-1">
              <span style={{color:'var(--text-muted)'}}>Sıradaki: {next.title}</span>
              <span style={{color:'var(--neon-green)'}}>{stats.maxStreak}/{next.min}g</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{background:'var(--text-dim)'}}>
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min((stats.maxStreak/next.min)*100,100)}%`, background: 'linear-gradient(90deg, var(--neon-green), var(--neon-blue))' }} />
            </div>
          </div>
        )}
      </div>

      {/* Achievements */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex justify-between mb-3">
          <span className="text-xs font-semibold tracking-wider" style={{color:'var(--text-muted)'}}>BAŞARIMLAR</span>
          <span className="text-xs" style={{color:'var(--neon-green)'}}>{unlocked}/{achi.length}</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden mb-4" style={{background:'var(--text-dim)'}}>
          <div className="h-full rounded-full transition-all duration-700" style={{width:`${(unlocked/achi.length)*100}%`, background:'linear-gradient(90deg, var(--neon-purple), var(--neon-blue))'}} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {achi.map(a => (
            <div key={a.id} className="p-3 rounded-xl flex items-start gap-3 border" style={{
              background: a.unlocked ? 'rgba(0,230,118,0.05)' : 'var(--text-dim)',
              borderColor: a.unlocked ? 'rgba(0,230,118,0.2)' : 'transparent',
              opacity: a.unlocked ? 1 : 0.4,
            }}>
              <span className={`text-lg ${a.unlocked ? '' : 'grayscale'}`}>{a.icon}</span>
              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="text-xs font-semibold">{a.title}</span>
                  {a.unlocked && <span className="text-[10px]" style={{color:'var(--neon-green)'}}>✓</span>}
                </div>
                <p className="text-[10px]" style={{color:'var(--text-muted)'}}>{a.desc}</p>
                <span className="text-[9px]" style={{color:'var(--neon-purple)'}}>+{a.xp} XP</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="glass-card rounded-xl p-4">
        <span className="text-xs font-semibold tracking-wider" style={{color:'var(--text-muted)'}}>ÖZET</span>
        <div className="grid grid-cols-2 gap-2 mt-3">
          {[
            { label: 'Toplam XP', value: stats.xp, clr: 'var(--neon-green)' },
            { label: 'Seviye', value: stats.level, clr: 'var(--neon-blue)' },
            { label: 'Mük. Gün', value: stats.perfectDays, clr: 'var(--neon-purple)' },
            { label: 'Mük. Hafta', value: stats.perfectWeeks, clr: 'var(--neon-orange)' },
          ].map((s,i) => (
            <div key={i} className="flex justify-between p-2 rounded-lg text-xs" style={{background:'var(--text-dim)'}}>
              <span style={{color:'var(--text-muted)'}}>{s.label}</span>
              <span style={{color:s.clr}}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}