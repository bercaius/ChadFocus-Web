// Zinciri Kır — İstatistik Motoru
// Ham veriyi anlamlı sayılara dönüştürür.

export function calcStats(habits, chartData, achievements) {
  const totalDone = chartData.reduce((s, d) => s + d.completed, 0);
  const totalPossible = chartData.reduce((s, d) => s + d.total, 0);
  const maxStreak = Math.max(...habits.map(h => h.streak), 0);
  const avgStreak = habits.length ? (habits.reduce((s, h) => s + h.streak, 0) / habits.length) : 0;
  const consistency = totalPossible > 0 ? Math.round((totalDone / totalPossible) * 100) : 0;
  const perfectDays = chartData.filter(d => d.completed === d.total).length;
  const xp = (achievements || []).reduce((sum, a) => sum + (a.unlocked ? a.xp : 0), 0);
  const level = Math.floor(Math.sqrt(xp / 100)) + 1;

  const categoryStats = {};
  habits.forEach(h => {
    if (!categoryStats[h.cat]) categoryStats[h.cat] = { total: 0, done: 0, streakSum: 0 };
    categoryStats[h.cat].total++;
    if (h.done) categoryStats[h.cat].done++;
    categoryStats[h.cat].streakSum += h.streak;
  });

  return {
    totalDone, totalPossible, maxStreak,
    avgStreak: Math.round(avgStreak * 10) / 10,
    consistency,
    perfectDays, perfectWeeks: Math.floor(perfectDays / 7),
    perfectMonths: Math.floor(perfectDays / 30),
    h7: habits.filter(h => h.streak >= 7).length,
    h30: habits.filter(h => h.streak >= 30).length,
    doneToday: habits.filter(h => h.done).length,
    xp, level, categoryStats,
    daysLeft: Math.ceil((new Date('2026-12-31') - new Date()) / 86400000),
  };
}

export function getLevel(maxStreak, LEVELS) {
  let lv = LEVELS[0];
  for (const l of LEVELS) if (maxStreak >= l.min) lv = l;
  return lv;
}

export function updateChart(habits, old) {
  const today = new Date().toISOString().slice(0, 10);
  const done = habits.filter(h => h.done).length;
  const pct = habits.length ? Math.round((done / habits.length) * 100) : 0;
  const data = [...old];
  const i = data.findIndex(d => d.date === today);
  const entry = { day: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }), date: today, completed: done, total: habits.length, percent: pct };
  if (i >= 0) data[i] = entry; else data.push(entry);
  return data;
}