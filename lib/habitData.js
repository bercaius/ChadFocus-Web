// Zinciri Kır — Veri Çekirdeği
// Her şey buradan başlar.

export const DEFAULT_HABITS = [
  { id: 1, name: 'Sabah 5\'te kalk (Demir Disiplin)', done: false, streak: 0, bestStreak: 0, cat: 'discipline', diff: 'hard' },
  { id: 2, name: '20 dk kitap (Zihinsel Pump)', done: false, streak: 0, bestStreak: 0, cat: 'mind', diff: 'medium' },
  { id: 3, name: 'Meditasyon (Odak)', done: false, streak: 0, bestStreak: 0, cat: 'mind', diff: 'medium' },
  { id: 4, name: 'Antrenman / Egzersiz (Bas)', done: false, streak: 0, bestStreak: 0, cat: 'body', diff: 'hard' },
  { id: 5, name: '2.5L su iç (Dehidrasyon Önleyici)', done: false, streak: 0, bestStreak: 0, cat: 'health', diff: 'easy' },
  { id: 6, name: 'Günlük yaz (Gelişim Notları)', done: false, streak: 0, bestStreak: 0, cat: 'mind', diff: 'medium' },
  { id: 7, name: 'Maksimum 2 saat boş ekran', done: false, streak: 0, bestStreak: 0, cat: 'discipline', diff: 'hard' },
  { id: 8, name: '22\'de yatakta ol (Growth Hormone)', done: false, streak: 0, bestStreak: 0, cat: 'health', diff: 'medium' },
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
  { id: 'cyberpunk', label: 'Siberpunk', icon: '🌃', desc: 'Neon geceler, sarı ışıklar' },
  { id: 'dark', label: 'Karanlık', icon: '🌑', desc: 'Minimum göz yorgunluğu' },
  { id: 'matrix', label: 'Matrix', icon: '💚', desc: 'Yeşilin binbir tonu' },
  { id: 'amber', label: 'Kehribar', icon: '🔥', desc: 'Sıcak ve gösterişli' },
];

export const ACHIEVEMENTS = [
  { id: 'a1', title: 'İlk Adım', desc: 'İlk alışkanlığını yap', icon: '🌱', check: s => s.totalDone >= 1, xp: 10 },
  { id: 'a2', title: 'Haftalık Seri', desc: '7 gün boyunca pes etme', icon: '🔥', check: s => s.maxStreak >= 7, xp: 50 },
  { id: 'a3', title: 'Ay Aslanı', desc: '30 gün boyunca durmaksızın devam', icon: '⚡', check: s => s.maxStreak >= 30, xp: 200 },
  { id: 'a4', title: 'Demir İrade', desc: '100 gün boyunca çelik gibi bas', icon: '🏆', check: s => s.maxStreak >= 100, xp: 1000 },
  { id: 'a5', title: 'Kusursuz Hafta', desc: '7 gün boyunca tüm görevleri tamamla', icon: '💎', check: s => s.perfectWeeks >= 1, xp: 100 },
  { id: 'a6', title: 'Kusursuz Ay', desc: '30 gün boyunca tüm görevleri tamamla', icon: '👑', check: s => s.perfectMonths >= 1, xp: 500 },
  { id: 'a7', title: 'Demir Setler', desc: '7 farklı alışkanlıkta 7+ seri yap', icon: '🦍', check: s => s.h7 >= 7, xp: 150 },
  { id: 'a8', title: 'Pump Ustası', desc: 'Toplam 1000 XP barajını aş', icon: '🧬', check: s => s.xp >= 1000, xp: 300 },
  { id: 'a9', title: 'Kare Pijamalı Badici', desc: 'Tüm alışkanlıklarda 30+ seri tamamla', icon: '🗿', check: s => s.h30 >= 8, xp: 1000 },
  { id: 'a10', title: 'Giga-Badici Efsanesi', desc: '365 gün süren bitmeyen disiplin', icon: '♾️', check: s => s.maxStreak >= 365, xp: 10000 },
];

export const LEVELS = [
  { min: 0, img: '/images/bg_chad_1.png', title: 'Çömez Badici', sub: 'Yeni başladın, potansiyel yüksek aslanım', pos: '50% 40%' },
  { min: 7, img: '/images/bg_chad_2.png', title: 'Plaka Hırsızı', sub: 'Disiplin oturuyor, salonun tozunu yutuyorsun', pos: '50% 35%' },
  { min: 21, img: '/images/bg_chad_3.png', title: 'Kare Pijamalı Badici', sub: 'Antrenmana pijama ile gelecek kıvama ulaştın', pos: '50% 30%' },
  { min: 30, img: '/images/chad_focus_1.png', title: 'Definasyon Canavarı', sub: 'Damarlar belirdi, disiplin artık hücrelerinde', pos: '50% 25%' },
  { min: 60, img: '/images/chad_success.png', title: 'Podyum Aslanı', sub: 'Sen artık zirvedeki %1\'lik dilimdesin', pos: '50% 30%' },
  { min: 100, img: '/images/chad_success_2.png', title: 'Kare Pijamalı Giga-Badici', sub: 'Salonun sahibi oldun, tarih yazıyorsun.', pos: '50% 30%' },
];

export const LEVELS_DATA = LEVELS;