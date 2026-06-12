'use client';

export default function HabitsTab({ habits, onToggle, onRename }) {
  return (
    <div className="space-y-2">
      {habits.map(h => {
        const done = h.done;
        const streak = h.streak;
        const sColor = streak >= 30 ? 'var(--neon-green)' : streak >= 7 ? 'var(--neon-orange)' : streak >= 1 ? 'var(--neon-purple)' : 'var(--text-dim)';
        return (
          <div key={h.id} className="glass-card rounded-xl px-4 py-3 flex items-center gap-3">
            <input type="checkbox" checked={done} onChange={() => onToggle(h.id)} className="neon-checkbox" />
            <div className="flex-1 min-w-0">
              <div className={`text-sm ${done ? 'line-through' : ''}`} style={{ color: done ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                {h.name}
              </div>
              <div className="flex gap-2 mt-1">
                <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: 'var(--text-dim)', color: 'var(--text-muted)' }}>
                  {h.cat}
                </span>
              </div>
            </div>
            <div className="text-right flex items-center gap-2">
              <div>
                <div className="text-sm font-bold" style={{ color: sColor }}>{streak}</div>
                <div className="text-[8px]" style={{ color: 'var(--text-dim)' }}>gün</div>
              </div>
              <div className="w-10 h-1 rounded-full overflow-hidden" style={{ background: 'var(--text-dim)' }}>
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min((streak/30)*100,100)}%`, background: sColor }} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}