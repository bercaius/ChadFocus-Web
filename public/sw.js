// ChadFocus Service Worker — Offline Support & Auto-Updates (Network-First Stale Stratejisi)
const CACHE_NAME = 'chadfocus-v3';
const STATIC_ASSETS = ['/', '/manifest.json', '/images/app_logo.png?v=3'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(STATIC_ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => 
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network-First (Önce Şebeke, Bulamazsa Önbellek) Stratejisi
self.addEventListener('fetch', (e) => {
  // API, Session ve Auth isteklerini önbelleğe alma, doğrudan pas geç
  if (
    e.request.url.includes('/api/') || 
    e.request.url.includes('/auth') || 
    e.request.url.includes('next-auth') ||
    e.request.method !== 'GET'
  ) {
    return;
  }

  e.respondWith(
    fetch(e.request)
      .then(res => {
        // Yanıt başarılıysa önbelleğe kaydet
        if (res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        }
        return res;
      })
      .catch(() => {
        // Şebeke hatası durumunda önbellekten sun
        return caches.match(e.request);
      })
  );
});

// Bildirim Tıklama
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: 'window' }).then(clients => {
      if (clients.length > 0) return clients[0].focus();
      return self.clients.openWindow('/');
    })
  );
});

// Periyodik Hatırlatma
self.addEventListener('periodicsync', (e) => {
  if (e.tag === 'chadfocus-check') {
    e.waitUntil(sendReminder());
  }
});

async function sendReminder() {
  const now = new Date();
  if (now.getHours() >= 9 && now.getHours() <= 22) {
    self.registration.showNotification('ChadFocus 🔥', {
      body: 'Bugünkü alışkanlıklarını tamamlamayı unutma badici!',
      icon: '/images/app_logo.png?v=3',
      badge: '/images/app_logo.png?v=3',
      tag: 'chadfocus-reminder',
      requireInteraction: false,
    });
  }
}