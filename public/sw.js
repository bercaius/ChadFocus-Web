// ChadFocus Service Worker — Offline + Notifications
const CACHE_NAME = 'chadfocus-v1';
const STATIC_ASSETS = ['/', '/manifest.json', '/images/app_logo.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(STATIC_ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => {
    const clone = res.clone();
    caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
    return res;
  })));
});

// Bildirim tıklama
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window' }).then(clients => {
    if (clients.length > 0) return clients[0].focus();
    return self.clients.openWindow('/');
  }));
});

// Periyodik bildirim (her saat başı kontrol)
self.addEventListener('periodicsync', (e) => {
  if (e.tag === 'chadfocus-check') {
    e.waitUntil(sendReminder());
  }
});

async function sendReminder() {
  const now = new Date();
  if (now.getHours() >= 9 && now.getHours() <= 22) {
    self.registration.showNotification('ChadFocus 🔥', {
      body: 'Bugünkü alışkanlıklarını tamamlamayı unutma!',
      icon: '/images/app_logo.png',
      badge: '/images/app_logo.png',
      tag: 'chadfocus-reminder',
      requireInteraction: false,
    });
  }
}