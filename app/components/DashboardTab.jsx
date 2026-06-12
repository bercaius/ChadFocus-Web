'use client';

import { LEVELS } from '@/lib/habitData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area } from 'recharts';

export default function DashboardTab({ habits, chart, stats, chad, onToggle, onShare }) {
  const lvlIdx = LEVELS.findIndex(l => l.title === chad.title);
  const catColors = { discipline: '#FF5252', mind: '#BB86FC', body: '#00E676', health: '#00B0FF' };
  const catLabels = { discipline: 'Disiplin', mind: 'Zihin', body: 'Fizik', health: 'Sağlık' };

  const catStats = {};
  habits.forEach(h => {
    if (!catStats[h.cat]) catStats[h.cat] = { total: 0, done: 0 };
    catStats[h.cat].total++;
    if (h.done) catStats[h.cat].done++;
  });

  return (
    <div className="space-y-4">

      {/* Chad Hero — Görsel Düzgün Oturuyor */}
      <div className="glass-card rounded-2xl overflow-hidden relative" style={{ minHeight: 160 }}>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, var(--bg-primary) 30%, transparent 70%)', zIndex: 2 }} />
        <img src={chad.img} alt="" className="absolute inset-0 w-full h-full object-cover opacity-50" style={{ objectPosition: chad.pos || '50% 30%' }} />
        <div className="relative z-10 p-5 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black" style={{ background: 'linear-gradient(135deg, #FFD700, #CD7F32)', color: '#000', boxShadow: '0 0 20px rgba(255,215,0,0.3)' }}>
            {stats.level}
          </div>
          <div>
            <h2 className="text-lg font-bold">{chad.title}</h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{chad.sub}</p>
            <div className="flex items-center gap-1 mt-2">
              {LEVELS.map((l, i) => (
                <div key={i} className="stage-dot" style={{ color: i <= lvlIdx ? '#FFD700' : 'var(--text-dim)', background: i <= lvlIdx ? '#FFD700' : 'var(--text-dim)' }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {[
          { label: 'En Uzun Seri', value: stats.maxStreak, unit: 'gün', color: '#FFD700' },
          { label: 'Süreklilik', value: `%${stats.consistency}`, unit: '', color: '#CD7F32' },
          { label: 'Bugün', value: `${stats.doneToday}/${habits.length}`, unit: '', color: '#FFE082' },
          { label: 'Toplam', value: stats.totalDone, unit: 'adet', color: '#FFB300' },
        ].map((s, i) => (
          <div key={i} className="glass-card rounded-xl p-3 text-center">
            <div className="text-xl font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
            {s.unit && <div className="text-[9px]" style={{ color: 'var(--text-dim)' }}>{s.unit}</div>}
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex justify-between mb-3">
          <span className="text-xs font-semibold tracking-wider" style={{ color: 'var(--text-muted)' }}>İlerleme</span>
          <span className="text-[10px]" style={{ color: 'var(--text-dim)' }}>son {chart.length}g</span>
        </div>
        {chart.length > 0 ? (
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chart} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs><linearGradient id="dGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FFD700" stopOpacity={0.2} /><stop offset="100%" stopColor="#FFD700" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--text-dim)" vertical={false} opacity={0.3} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 9 }} />
                <YAxis domain={[0,100]} axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 9 }} tickFormatter={v=>`${v}%`} />
                <Area type="monotone" dataKey="percent" stroke="none" fill="url(#dGrad)" />
                <Line type="monotone" dataKey="percent" stroke="#FFD700" strokeWidth={2} dot={{ fill:'var(--bg-primary)', stroke:'#FFD700', strokeWidth:2, r:3 }} animationDuration={800} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : <div className="py-8 text-center text-sm" style={{color:'var(--text-muted)'}}>Veri yok. Başlasana kanka.</div>}
      </div>

      {/* Kategori */}
      <div className="glass-card rounded-xl p-4">
        <span className="text-xs font-semibold tracking-wider" style={{ color: 'var(--text-muted)' }}>KATEGORİLER</span>
        <div className="space-y-2 mt-3">
          {Object.entries(catStats).map(([k, v]) => (
            <div key={k}>
              <div className="flex justify-between text-xs mb-1">
                <span style={{ color: catColors[k] || 'var(--text-muted)' }}>{catLabels[k] || k}</span>
                <span style={{ color: 'var(--text-muted)' }}>{v.done}/{v.total}</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--text-dim)' }}>
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(v.done/v.total)*100}%`, background: catColors[k], boxShadow: `0 0 6px ${catColors[k]}40` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Paylaş Butonu */}
      <button onClick={onShare} className="glass-card rounded-xl p-4 w-full flex items-center gap-3 glitch">
        <span className="text-lg">📸</span>
        <div className="text-left">
          <div className="text-sm font-semibold">Serini Paylaş</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Instagram'da göster</div>
        </div>
        <span className="ml-auto text-xs" style={{ color: '#FFD700' }}>→</span>
      </button>
    </div>
  );
}