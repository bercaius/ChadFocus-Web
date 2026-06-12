'use client';

export default function SettingsTab({ theme, themes, onChangeTheme, onReset }) {
  return (
    <div className="space-y-4">
      {/* Profil */}
      <div className="glass-card rounded-xl p-4">
        <span className="text-xs font-semibold tracking-wider" style={{color:'var(--text-muted)'}}>PROFİL</span>
        <div className="flex items-center gap-3 mt-3 p-3 rounded-lg" style={{background:'var(--text-dim)'}}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm" style={{background:'linear-gradient(135deg, #FFD700, #CD7F32)', color:'#000'}}>
            CF
          </div>
          <div>
            <div className="text-sm font-semibold">ChadFocus</div>
            <div className="text-[10px]" style={{color:'var(--text-muted)'}}>Disiplin yolcusu</div>
          </div>
        </div>
      </div>

      {/* Tema */}
      <div className="glass-card rounded-xl p-4">
        <span className="text-xs font-semibold tracking-wider" style={{color:'var(--text-muted)'}}>TEMA</span>
        <div className="grid grid-cols-2 gap-2 mt-3">
          {themes.map(t => (
            <button key={t.id} onClick={() => onChangeTheme(t.id)} className="p-3 rounded-xl text-left border transition-all" style={{
              background: theme === t.id ? 'rgba(255,215,0,0.08)' : 'var(--text-dim)',
              borderColor: theme === t.id ? 'rgba(255,215,0,0.3)' : 'transparent',
            }}>
              <span className="text-sm">{t.icon}</span>
              <div className="text-xs font-semibold mt-1" style={{color: theme === t.id ? '#FFD700' : 'var(--text-secondary)'}}>{t.label}</div>
              <div className="text-[9px] mt-0.5" style={{color:'var(--text-muted)'}}>{t.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Veri */}
      <div className="glass-card rounded-xl p-4" style={{borderColor:'rgba(255,82,82,0.2)'}}>
        <span className="text-xs font-semibold tracking-wider" style={{color:'var(--text-muted)'}}>VERİ YÖNETİMİ</span>
        <div className="space-y-2 mt-3">
          <button onClick={() => {
            const data = { habits: JSON.parse(localStorage.getItem('cf-habits')), chart: JSON.parse(localStorage.getItem('cf-chart')), achi: JSON.parse(localStorage.getItem('cf-achi')) };
            const b = new Blob([JSON.stringify(data,null,2)], { type: 'application/json' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(b);
            a.download = `chadfocus-yedek-${new Date().toISOString().slice(0,10)}.json`;
            a.click();
          }} className="w-full p-3 rounded-xl text-xs text-left border" style={{background:'var(--text-dim)', borderColor:'transparent', color:'#CD7F32'}}>
            💾 Verileri Dışa Aktar
          </button>
          <button onClick={onReset} className="w-full p-3 rounded-xl text-xs text-left border" style={{background:'var(--text-dim)', borderColor:'transparent', color:'var(--neon-red)'}}>
            ⚠️ Her Şeyi Sıfırla
          </button>
        </div>
      </div>

      {/* Hakkında + Krediler */}
      <div className="glass-card rounded-xl p-4">
        <span className="text-xs font-semibold tracking-wider" style={{color:'var(--text-muted)'}}>HAKKINDA</span>
        <p className="text-xs mt-2 leading-relaxed" style={{color:'var(--text-secondary)'}}>
          Disiplin bir yetenek değil, kas gibidir. Her gün çalışırsan güçlenirsin.
          ChadFocus tam da o kası çalıştırmak için var.
        </p>
        <div className="mt-3 pt-3 space-y-1" style={{borderTop:'1px solid var(--border)'}}>
          <p className="text-[9px] tracking-wider uppercase" style={{color:'var(--text-dim)'}}>
            yapımcı · <a href="https://www.instagram.com/bercaius.dev/" target="_blank" rel="noopener" style={{color:'#FFD700'}}>@bercaius.dev</a>
          </p>
          <p className="text-[9px] tracking-wider uppercase" style={{color:'var(--text-dim)'}}>
            stüdyo · <a href="https://www.instagram.com/turcodevelopstudio/" target="_blank" rel="noopener" style={{color:'#CD7F32'}}>@turcodevelopstudio</a>
          </p>
          <p className="text-[8px] mt-2" style={{color:'var(--text-dim)'}}>ChadFocus Web Demo · v1.0 · 2026</p>
        </div>
      </div>
    </div>
  );
}