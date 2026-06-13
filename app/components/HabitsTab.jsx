'use client';
import { useState } from 'react';

export default function HabitsTab({ habits, onToggle, onAdd, onDelete }) {
  const [newName, setNewName] = useState('');
  const [newCat, setNewCat] = useState('discipline');

  const catColors = { discipline: '#FF5252', mind: '#BB86FC', body: '#00E676', health: '#00B0FF' };
  const catLabels = { discipline: 'Disiplin', mind: 'Zihin', body: 'Fizik', health: 'Sağlık' };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    onAdd(newName.trim(), newCat);
    setNewName('');
  };

  return (
    <div className="space-y-4">
      {/* Rutin Ekleme Formu */}
      <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-4 space-y-3">
        <span className="text-xs font-black tracking-widest text-[#FFD700] uppercase">Yeni Rutin Oluştur</span>
        <div className="flex flex-col md:flex-row gap-2">
          <input 
            type="text" 
            placeholder="Örn: 50 Şınav, Kitap Oku..." 
            value={newName} 
            onChange={e => setNewName(e.target.value)} 
            className="flex-1 bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#FFD700]/50 transition-colors"
          />
          <div className="flex gap-2">
            <select 
              value={newCat} 
              onChange={e => setNewCat(e.target.value)}
              className="bg-zinc-900 border border-white/5 rounded-xl px-3 py-2.5 text-xs text-zinc-300 focus:outline-none focus:border-[#FFD700]/50"
            >
              <option value="discipline">Disiplin</option>
              <option value="mind">Zihin</option>
              <option value="body">Fizik</option>
              <option value="health">Sağlık</option>
            </select>
            <button 
              type="submit" 
              className="bg-gradient-to-r from-[#FFD700] to-[#CD7F32] hover:brightness-110 active:scale-95 text-black font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer"
            >
              EKLE
            </button>
          </div>
        </div>
      </form>

      {/* Rutinler Listesi */}
      <div className="space-y-2">
        {habits.length === 0 ? (
          <p className="text-center text-xs text-zinc-500 py-8">Henüz hiçbir rutin eklenmemiş. Hemen yukarıdan ekle!</p>
        ) : (
          habits.map(h => {
            const done = h.done;
            const streak = h.streak;
            const sColor = streak >= 30 ? 'var(--neon-green)' : streak >= 7 ? 'var(--neon-orange)' : streak >= 1 ? 'var(--neon-purple)' : 'var(--text-dim)';
            return (
              <div key={h.id} className="glass-card rounded-xl px-4 py-3 flex items-center gap-3">
                <input 
                  type="checkbox" 
                  checked={done} 
                  onChange={() => onToggle(h.id)} 
                  className="w-5 h-5 rounded-md border-2 border-zinc-700 bg-transparent text-amber-500 focus:ring-0 focus:ring-offset-0 cursor-pointer" 
                />
                <div className="flex-1 min-w-0">
                  <div className={`text-sm ${done ? 'line-through text-zinc-500' : 'text-zinc-100 font-medium'}`}>
                    {h.name}
                  </div>
                  <div className="flex gap-2 mt-1">
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider" style={{ background: `${catColors[h.cat]}20`, color: catColors[h.cat] }}>
                      {catLabels[h.cat] || h.cat}
                    </span>
                  </div>
                </div>
                <div className="text-right flex items-center gap-3">
                  <div>
                    <div className="text-sm font-bold" style={{ color: sColor }}>{streak}</div>
                    <div className="text-[8px] text-zinc-500">gün</div>
                  </div>
                  {/* Silme Butonu */}
                  <button 
                    onClick={() => onDelete(h.id)} 
                    className="text-zinc-600 hover:text-red-500 p-1 text-sm transition-colors cursor-pointer"
                    title="Sil"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}