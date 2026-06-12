'use client';

import { useState, useRef, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area } from 'recharts';

export default function ShareModal({ habits, chart, stats, onClose }) {
  const [exporting, setExporting] = useState(false);
  const ref = useRef(null);
  const top = [...habits].sort((a,b)=>b.streak-a.streak).slice(0,4);
  const last7 = chart.slice(-7);

  const doExport = useCallback(async () => {
    if (!ref.current) return;
    setExporting(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(ref.current, { scale: 2, backgroundColor: '#0A0A0A', useCORS: true, logging: false, width: 1080, height: 1920 });
      const link = document.createElement('a');
      link.download = `chadfocus-${new Date().toISOString().slice(0,10)}.png`;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link); link.click(); document.body.removeChild(link);
    } catch(e) { console.error(e); }
    finally { setExporting(false); }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{background:'rgba(0,0,0,0.7)', backdropFilter:'blur(4px)'}}>
      <div className="w-full max-w-sm mx-4 glass-card rounded-2xl p-5">
        <h3 className="text-base font-bold mb-1">Serini Göster 📸</h3>
        <p className="text-[10px] mb-4" style={{color:'var(--text-muted)'}}>%9:16 formatında indir, paylaş</p>

        <div ref={ref} className="mx-auto mb-4 overflow-hidden rounded-xl relative" style={{ width: 270, height: 480, background: 'linear-gradient(180deg, #0A0A0A, #1A1A1A, #0D0D0D)', border: '1px solid rgba(255,215,0,0.1)' }}>
          <div className="relative z-10 flex flex-col h-full p-4">
            <div className="text-center mb-2">
              <div className="text-[6px] font-bold tracking-[3px] uppercase" style={{color:'#FFD700'}}>◈ ChadFocus</div>
              <div className="text-[5px]" style={{color:'#666'}}>{new Date().toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric'})}</div>
            </div>
            <div className="h-px mb-2" style={{background:'linear-gradient(90deg, transparent, #333, transparent)'}} />
            <div className="grid grid-cols-3 gap-1 mb-2">
              {[{l:'Seri',v:`${stats.maxStreak}g`,c:'#FFD700'},{l:'Bugün',v:`${stats.doneToday}/${habits.length}`,c:'#CD7F32'},{l:'Süreklilik',v:`%${stats.consistency}`,c:'#FFE082'}].map((s,i)=>(
                <div key={i} className="rounded-lg p-1.5 text-center" style={{background:'rgba(26,26,26,0.8)',border:'1px solid rgba(255,215,0,0.1)'}}>
                  <div className="text-[4px] uppercase tracking-wider" style={{color:'#666'}}>{s.l}</div>
                  <div className="text-[10px] font-bold" style={{color:s.c}}>{s.v}</div>
                </div>
              ))}
            </div>
            {last7.length>0 && <div className="h-16 mb-2"><ResponsiveContainer width="100%" height="100%"><LineChart data={last7} margin={{top:3,right:3,left:-10,bottom:0}}><CartesianGrid strokeDasharray="2 2" stroke="#333" vertical={false} /><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill:'#666',fontSize:5}} /><YAxis domain={[0,100]} axisLine={false} tickLine={false} tick={{fill:'#666',fontSize:5}} width={12} /><Area type="monotone" dataKey="percent" stroke="none" fill="#FFD700" fillOpacity={0.1} /><Line type="monotone" dataKey="percent" stroke="#FFD700" strokeWidth={1.5} dot={{fill:'#0A0A0A',stroke:'#FFD700',r:1.5}} animationDuration={500} /></LineChart></ResponsiveContainer></div>}
            <div className="space-y-1 flex-1">
              {top.map((h,i)=>(
                <div key={h.id} className="flex items-center justify-between rounded-lg px-2 py-1" style={{background:'rgba(26,26,26,0.6)',border:'1px solid rgba(255,215,0,0.05)'}}>
                  <span className="text-[5px]" style={{color:'#999'}}>{i===0?'👑 ':''}{h.name}</span>
                  <span className="text-[7px] font-bold" style={{color:'#FFD700'}}>{h.streak}g</span>
                </div>
              ))}
            </div>
            <div className="text-center mt-2">
              <div className="text-[4px] tracking-[2px] uppercase" style={{color:'#555'}}>bercaius.dev</div>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 p-2.5 rounded-xl text-xs" style={{background:'var(--text-dim)', color:'var(--text-secondary)'}}>Vazgeç</button>
          <button onClick={doExport} disabled={exporting} className="flex-1 p-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1" style={{background:'#FFD700', color:'#000'}}>
            {exporting ? '...' : '↓ İndir'}
          </button>
        </div>
      </div>
    </div>
  );
}