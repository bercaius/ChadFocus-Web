'use client';

export default function StudioTab() {
  return (
    <div className="relative min-h-[500px] rounded-3xl overflow-hidden glass-card p-6 md:p-12 flex flex-col justify-between">
      {/* Studio Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#1A0F00] via-[#0B0F19] to-[#111827] z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(253,186,116,0.06),transparent_50%)] z-0" />

      {/* Header and Content */}
      <div className="relative z-10 max-w-2xl space-y-6 mt-4">
        <div className="flex items-center gap-4 p-2 rounded-2xl bg-white/5 border border-white/5 w-fit">
          <img src="/images/turcodevelop_logo.png" alt="Turco Develop Logo" className="w-16 h-16 rounded-full object-cover border border-orange-500/20" />
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-white">
              Turco Develop Studio
            </h1>
            <p className="text-[10px] text-orange-400 font-bold tracking-[0.2em] uppercase">Digital Creators & Craftsmanship</p>
          </div>
        </div>

        <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.15] text-zinc-100">
          Geleceğin Yazılım Çözümlerini <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">Bugünden İnşa Ediyoruz.</span>
        </h2>

        <p className="text-sm md:text-base text-zinc-300 leading-relaxed font-light">
          Turco Develop Studio, sıradanlıktan uzak, yüksek performanslı ve estetik arayüzlerle güçlendirilmiş dijital ürünler tasarlar. ChadFocus disiplin protokolünden kurumsal otomasyonlara kadar her projede kod kalitesini ve mükemmel kullanıcı deneyimini hedefleriz.
        </p>

        {/* Studio Projects Grid */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          {[
            { tag: '🔱 CHADFOCUS', desc: 'Verimlilik & Disiplin Merkezi' },
            { tag: '🛡️ SIBER-INTEGRATION', desc: 'Güvenli CI/CD & Derleme' },
            { tag: '🌐 CLOUD ARCHITECTURE', desc: 'PostgreSQL & Sync Engine' },
            { tag: '🎨 MODERN UI/UX', desc: 'Akıcı & Dinamik Animasyonlar' }
          ].map((proj, i) => (
            <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-orange-500/20 transition-colors">
              <div className="text-[10px] font-extrabold text-orange-400 tracking-wider mb-1">{proj.tag}</div>
              <div className="text-[11px] text-zinc-300 font-light">{proj.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Studio Redirect Button */}
      <div className="relative z-10 mt-8 pt-6 border-t border-zinc-800/40">
        <a 
          href="https://turcodevelopstudio.web.app/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-3 w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold p-4 rounded-2xl hover:brightness-110 active:scale-95 transition-all shadow-[0_8px_24px_rgba(239,120,47,0.15)] group"
        >
          <span className="text-xl">🌐</span>
          <div className="text-left">
            <div className="text-xs uppercase tracking-wider font-extrabold">Stüdyomuzu Ziyaret Et</div>
            <div className="text-[10px] text-orange-100 font-normal">turcodevelopstudio.web.app</div>
          </div>
          <span className="ml-auto text-lg group-hover:translate-x-1 transition-transform">→</span>
        </a>
      </div>
    </div>
  );
}
