'use client';
import { useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { deleteUser } from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
export default function SettingsTab({ theme, themes, onChangeTheme, onReset, user, wallpaper, setWallpaper, bgOpacity, setBgOpacity }) {
  return (
    <div className="space-y-4">
      {/* Profil */}
      <div className="glass-card rounded-xl p-4">
        <span className="text-xs font-semibold tracking-wider" style={{color:'var(--text-muted)'}}>PROFİL</span>
        <div className="flex items-center gap-3 mt-3 p-3 rounded-lg" style={{background:'var(--text-dim)'}}>
          {user?.image ? (
            <img src={user.image} alt={user.name} className="w-10 h-10 rounded-full object-cover filter grayscale" />
          ) : (
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm" style={{background:'linear-gradient(135deg, #FFD700, #CD7F32)', color:'#000'}}>
              CF
            </div>
          )}
          <div>
            <div className="text-sm font-semibold">{user?.name || 'ChadFocus'}</div>
            <div className="text-[10px]" style={{color:'var(--text-muted)'}}>{user?.email || 'Disiplin yolcusu'}</div>
          </div>
        </div>

        {user?.uid && (
          <div className="mt-3 p-3 rounded-lg border border-white/5 bg-black/20">
            <div className="text-[9px] font-black text-zinc-500 tracking-wider uppercase">Masaüstü Eşitleme Kodu</div>
            <div className="text-xs font-mono select-all text-zinc-300 mt-1 break-all cursor-pointer hover:text-white" title="Kopyalamak için tıklayın" onClick={() => {
              navigator.clipboard.writeText(user.uid);
              alert("Eşitleme kodu kopyalandı! Bunu masaüstü uygulamasındaki Giriş ekranına yapıştır.");
            }}>
              {user.uid}
            </div>
            <p className="text-[8px] text-zinc-600 mt-1">Eşitleme kodunu kopyalayarak Masaüstü uygulamasında Giriş yapabilirsin.</p>
          </div>
        )}
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

      {/* Görünüm & Saydamlık */}
      <div className="glass-card rounded-xl p-4">
        <span className="text-xs font-semibold tracking-wider" style={{color:'var(--text-muted)'}}>GÖRÜNÜM & ARKA PLAN</span>
        
        <div className="mt-4 mb-2">
          <div className="flex justify-between text-xs mb-2">
            <span style={{color:'var(--text-secondary)'}}>Arka Plan Karartması (Opaklık)</span>
            <span style={{color:'var(--accent-color)'}}>{Math.round(bgOpacity * 100)}%</span>
          </div>
          <input 
            type="range" 
            min="0" max="100" 
            value={bgOpacity * 100} 
            onChange={(e) => setBgOpacity(e.target.value / 100)}
            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-yellow-500"
          />
        </div>

        <div className="grid grid-cols-4 gap-2 mt-4">
          {['/images/wallpaper_1.png?v=3', '/images/wallpaper_2.png?v=3', '/images/wallpaper_3.png?v=3', '/images/wallpaper_4.png?v=3'].map((img, i) => (
            <button 
              key={i} 
              onClick={() => setWallpaper(img)}
              className={`h-12 rounded-lg overflow-hidden border transition-all ${wallpaper === img ? 'border-[var(--accent-color)] scale-95 opacity-100' : 'border-transparent opacity-50 hover:opacity-100'}`}
            >
              <img src={img} className="w-full h-full object-cover" />
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
          <button onClick={onReset} className="w-full p-3 rounded-xl text-xs text-left border" style={{background:'var(--text-dim)', borderColor:'transparent', color:'var(--neon-orange)'}}>
            ⚠️ İlerlemeyi Sıfırla
          </button>
          
          <button onClick={async () => {
            if (confirm("Uygulamayı silmek istediğine emin misin? Bu işlem tarayıcıdaki tüm yerel verileri ve önbelleği temizler. Masaüstü sürümündeysen Denetim Masasından kaldırmalısın.")) {
              localStorage.clear();
              sessionStorage.clear();
              if ('serviceWorker' in navigator) {
                const regs = await navigator.serviceWorker.getRegistrations();
                for (let r of regs) await r.unregister();
              }
              window.location.reload();
            }
          }} className="w-full p-3 rounded-xl text-xs text-left border" style={{background:'var(--text-dim)', borderColor:'transparent', color:'var(--neon-red)'}}>
            🗑️ Uygulamayı (Verileri) Sil
          </button>
          
          <button onClick={async () => {
            if (confirm("HESABI SİL: Bu işlem geri alınamaz! Buluttaki tüm verilerin ve hesabın kalıcı olarak silinecek. Emin misin?")) {
              try {
                if (auth.currentUser) {
                  await deleteUser(auth.currentUser);
                  alert("Hesabın başarıyla silindi. Elveda dostum.");
                  window.location.reload();
                } else {
                  alert("Şu an oturum açık değil.");
                }
              } catch (e) {
                console.error("Hesap silme hatası:", e);
                if (e.code === 'auth/requires-recent-login') {
                  alert("Güvenlik nedeniyle hesabını silmeden önce çıkış yapıp tekrar giriş yapmalısın.");
                } else {
                  alert("Hesap silinirken bir hata oluştu: " + e.message);
                }
              }
            }
          }} className="w-full p-3 rounded-xl text-xs text-left border border-red-900/50" style={{background:'rgba(255,0,0,0.1)', color:'var(--neon-red)'}}>
            ☠️ Hesabı Kalıcı Olarak Sil
          </button>
        </div>
      </div>

      {/* Destek / Ticket */}
      <div className="glass-card rounded-xl p-4" style={{borderColor:'rgba(96,165,250,0.2)'}}>
        <span className="text-xs font-semibold tracking-wider" style={{color:'var(--text-muted)'}}>DESTEK & İLETİŞİM</span>
        <div className="mt-3">
          <button onClick={async () => {
            const msg = prompt("Admin'e iletmek istediğin mesajı, bug'ı veya talebi yaz:");
            if (msg && msg.trim()) {
              try {
                await addDoc(collection(db, "tickets"), {
                  uid: user?.uid || 'anonim',
                  email: user?.email || 'Bilinmiyor',
                  message: msg,
                  createdAt: serverTimestamp(),
                  status: 'open'
                });
                alert("Ticket başarıyla Turco Develop stüdyosuna iletildi! En kısa sürede inceleyeceğiz.");
              } catch (e) {
                alert("Ticket gönderilemedi. Hata: " + e.message);
              }
            }
          }} className="w-full p-3 rounded-xl text-xs text-left border border-blue-900/50" style={{background:'rgba(96,165,250,0.1)', color:'var(--neon-blue)'}}>
            📨 Admin'e Ticket (Destek) Aç
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