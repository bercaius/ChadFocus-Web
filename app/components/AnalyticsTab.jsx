'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Sector } from 'recharts';
import { useState } from 'react';

export default function AnalyticsTab({ habits, chart, stats }) {
  const [active, setActive] = useState(0);
  const wData = [];
  for (let i = 0; i < chart.length; i += 7) {
    const w = chart.slice(i, i+7);
    const a = w.reduce((s,d) => s+d.percent, 0) / w.length;
    wData.push({ week: `H${Math.floor(i/7)+1}`, avg: Math.round(a), total: w.reduce((s,d) => s+d.completed, 0) });
  }

  const pData = Object.entries(stats.categoryStats || {}).map(([k,v]) => ({ name: k, value: v.done }));
  const COLORS = ['#FF5252','#BB86FC','#00E676','#00B0FF'];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Disiplin Skoru', value: Math.min(100, Math.round((stats.avgStreak / 30) * 100)), unit: '%', clr: 'var(--neon-green)', max: 100 },
          { label: 'Mük. Gün', value: stats.perfectDays, unit: 'G', clr: 'var(--neon-blue)', max: 30 },
          { label: 'Başarı Oranı', value: wData.length ? wData[0].avg : 0, unit: '%', clr: 'var(--neon-purple)', max: 100 },
          { label: 'Ort. Seri', value: stats.avgStreak, unit: 'G', clr: 'var(--neon-orange)', max: 30 },
        ].map((s,i) => {
          const radius = 36;
          const circumference = 2 * Math.PI * radius;
          const strokeDashoffset = circumference - ((s.value / s.max) * circumference);
          
          return (
            <div key={i} className="glass-card rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 opacity-10 transition-opacity group-hover:opacity-20" style={{ background: `radial-gradient(circle at center, ${s.clr} 0%, transparent 70%)` }}></div>
              <div className="relative w-24 h-24 flex items-center justify-center mb-2">
                <svg className="w-full h-full transform -rotate-90">
                  {/* Background Circle */}
                  <circle cx="48" cy="48" r={radius} stroke="var(--text-dim)" strokeWidth="6" fill="transparent" className="opacity-20" />
                  {/* Progress Circle */}
                  <circle 
                    cx="48" cy="48" r={radius} 
                    stroke={s.clr} 
                    strokeWidth="6" 
                    fill="transparent" 
                    strokeDasharray={circumference} 
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                    style={{ filter: `drop-shadow(0 0 6px ${s.clr})` }}
                  />
                </svg>
                <div className="absolute flex items-baseline gap-0.5">
                  <span className="text-xl font-black text-white">{s.value}</span>
                  <span className="text-[10px] font-bold" style={{color:s.clr}}>{s.unit}</span>
                </div>
              </div>
              <div className="text-[10px] font-bold tracking-widest uppercase text-center z-10" style={{color:'var(--text-muted)'}}>{s.label}</div>
            </div>
          );
        })}
      </div>

      <div className="glass-card rounded-xl p-4">
        <span className="text-xs font-semibold tracking-wider" style={{color:'var(--text-muted)'}}>HAFTALIK ORTALAMA</span>
        {wData.length > 0 ? (
          <div className="h-40 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wData} margin={{top:5,right:5,left:-20,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--text-dim)" vertical={false} opacity={0.3} />
                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{fill:'var(--text-muted)',fontSize:9}} />
                <YAxis domain={[0,100]} axisLine={false} tickLine={false} tick={{fill:'var(--text-muted)',fontSize:9}} />
                <Bar dataKey="avg" radius={[4,4,0,0]} animationDuration={800}>
                  {wData.map((e,i) => <Cell key={i} fill={e.avg>=80?'var(--neon-green)':e.avg>=50?'var(--neon-orange)':'var(--neon-red)'} fillOpacity={0.7} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : <div className="py-6 text-center text-xs" style={{color:'var(--text-muted)'}}>Yeterli veri yok</div>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card rounded-xl p-4">
          <span className="text-xs font-semibold tracking-wider" style={{color:'var(--text-muted)'}}>KATEGORİ</span>
          <div className="h-40 mt-3">
            {pData.some(d=>d.value>0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie activeIndex={active} activeShape={(p) => {
                    const {cx,cy,innerRadius,outerRadius,startAngle,endAngle,fill,value} = p;
                    return (<g><text x={cx} y={cy} dy={-8} textAnchor="middle" fill="var(--text-primary)" fontSize={12}>{p.name}</text><text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} fontSize={16} fontWeight="bold">{value}</text><Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius} startAngle={startAngle} endAngle={endAngle} fill={fill} /><Sector cx={cx} cy={cy} innerRadius={outerRadius+4} outerRadius={outerRadius+8} startAngle={startAngle} endAngle={endAngle} fill={fill} /></g>);
                  }} data={pData} cx="50%" cy="50%" innerRadius={35} outerRadius={60} dataKey="value" onMouseEnter={(_,i)=>setActive(i)} animationDuration={800}>
                    {pData.map((_,i) => <Cell key={i} fill={COLORS[i%COLORS.length]} fillOpacity={0.7} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : <div className="py-8 text-center text-xs" style={{color:'var(--text-muted)'}}>Veri yok</div>}
          </div>
        </div>

        <div className="glass-card rounded-xl p-4">
          <span className="text-xs font-semibold tracking-wider" style={{color:'var(--text-muted)'}}>SERİ DURUMU</span>
          <div className="space-y-2 mt-3">
            {[...habits].sort((a,b)=>b.streak-a.streak).map(h => (
              <div key={h.id}>
                <div className="flex justify-between text-[10px] mb-0.5">
                  <span style={{color:'var(--text-secondary)'}} className="truncate max-w-[65%]">{h.name}</span>
                  <span style={{color:'var(--neon-green)'}}>{h.streak}g</span>
                </div>
                <div className="h-1 rounded-full overflow-hidden" style={{background:'var(--text-dim)'}}>
                  <div className="h-full rounded-full transition-all duration-700" style={{width:`${Math.min((h.streak/30)*100,100)}%`, background: h.streak>=30?'linear-gradient(90deg,var(--neon-green),var(--neon-blue))':h.streak>=7?'linear-gradient(90deg,var(--neon-orange),#FFE082)':'var(--text-dim)'}} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}