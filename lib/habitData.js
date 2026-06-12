// Zinciri Kır — Veri Çekirdeği
// Her şey buradan başlar.

export const DEFAULT_HABITS = [
  { id: 1, name: 'Sabah 5\'te kalk', done: false, streak: 0, bestStreak: 0, cat: 'discipline', diff: 'hard' },
  { id: 2, name: '20 dk kitap', done: false, streak: 0, bestStreak: 0, cat: 'mind', diff: 'medium' },
  { id: 3, name: 'Meditasyon', done: false, streak: 0, bestStreak: 0, cat: 'mind', diff: 'medium' },
  { id: 4, name: '30 dk egzersiz', done: false, streak: 0, bestStreak: 0, cat: 'body', diff: 'hard' },
  { id: 5, name: '2L su iç', done: false, streak: 0, bestStreak: 0, cat: 'health', diff: 'easy' },
  { id: 6, name: 'Günlük yaz', done: false, streak: 0, bestStreak: 0, cat: 'mind', diff: 'medium' },
  { id: 7, name: 'Max 2 saat ekran', done: false, streak: 0, bestStreak: 0, cat: 'discipline', diff: 'hard' },
  { id: 8, name: '22\'de yat', done: false, streak: 0, bestStreak: 0, cat: 'health', diff: 'medium' },
];

export const CATS = [
  { id: 'discipline', label: 'Disiplin', color: '#FF5252', icon: '⚔️' },
  { id: 'mind', label: 'Zihin', color: '#BB86FC', icon: '🧠' },
  { id: 'body', label: 'Fizik', color: '#00E676', icon: '💪' },
  { id: 'health', label: 'Sağlık', color: '#00B0FF', icon: '❤️' },
];

export const DIFFS = [
  { id: 'easy', label: 'Kolay', points: 1 },
  { id: 'medium', label: 'Orta', points: 2 },
  { id: 'hard', label: 'Zor', points: 3 },
];

export const THEMES = [
  { id: 'cyberpunk', label: 'Siberpunk', icon: '🌃', desc: 'Neon geceler, yeşil ışıklar' },
  { id: 'dark', label: 'Karanlık', icon: '🌑', desc: 'Minimum göz yorgunluğu' },
  { id: 'matrix', label: 'Matrix', icon: '💚', desc: 'Yeşilin binbir tonu' },
  { id: 'amber', label: 'Kehribar', icon: '🔥', desc: 'Sıcak ve gösterişli' },
];

export const ACHIEVEMENTS = [
  { id: 'a1', title: 'İlk Kırılış', desc: 'İlk alışkanlığını yap', icon: '🌱', check: s => s.totalDone >= 1, xp: 10 },
  { id: 'a2', title: 'Haftalık', desc: '7 gün pes etme', icon: '🔥', check: s => s.maxStreak >= 7, xp: 50 },
  { id: 'a3', title: 'Ay Aslanı', desc: '30 gün boyunca devam', icon: '⚡', check: s => s.maxStreak >= 30, xp: 200 },
  { id: 'a4', title: 'Centurion', desc: '100 gün, çelik gibi', icon: '🏆', check: s => s.maxStreak >= 100, xp: 1000 },
  { id: 'a5', title: 'Mükemmel Hafta', desc: '7 gün full completion', icon: '💎', check: s => s.perfectWeeks >= 1, xp: 100 },
  { id: 'a6', title: 'Mükemmel Ay', desc: '30 gün full completion', icon: '👑', check: s => s.perfectMonths >= 1, xp: 500 },
  { id: 'a7', title: '7\'li Kıvılcım', desc: '7 habitte 7+ streak', icon: '🦍', check: s => s.h7 >= 7, xp: 150 },
  { id: 'a8', title: '1000 XP', desc: 'Toplam 1000 XP kazan', icon: '🧬', check: s => s.xp >= 1000, xp: 300 },
  { id: 'a9', title: 'Sigma', desc: 'Tüm habitlerde 30+ streak', icon: '🗿', check: s => s.h30 >= 8, xp: 1000 },
  { id: 'a10', title: 'Ölümsüz', desc: '365 gün bitmeyen yol', icon: '♾️', check: s => s.maxStreak >= 365, xp: 10000 },
];

export const LEVELS = [
  { min: 0, img: '/images/bg_chad_1.png', title: 'Toz', sub: 'Yeni başladın, potansiyel yüksek', pos: '50% 40%' },
  { min: 7, img: '/images/bg_chad_2.png', title: 'Çelik', sub: 'Disiplin yerleşiyor, devam et', pos: '50% 35%' },
  { min: 21, img: '/images/bg_chad_3.png', title: 'Savaşçı', sub: 'Alışkanlık makinesine dönüşüyorsun', pos: '50% 30%' },
  { min: 30, img: '/images/chad_focus_1.png', title: 'Odak', sub: 'Zinciri kırdın, sıra dünyada', pos: '50% 25%' },
  { min: 60, img: '/images/chad_success.png', title: 'Şampiyon', sub: 'Sen artık %1\'lik dilimde yaşıyorsun', pos: '50% 30%' },
  { min: 100, img: '/images/chad_success_2.png', title: 'Efsane', sub: 'Tarih yazıyorsun. Kelimenin tam anlamıyla.', pos: '50% 30%' },
];

export const LEVELS_DATA = LEVELS;