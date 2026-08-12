// Service worker: le info chiave restano consultabili anche senza segnale.
const CACHE = 'tg-guida-v17';
const ASSETS = [
  './', './index.html', './styles.css', './content.js', './tracks.js', './poi.js', './icons.js',
  './icons/icon-192.png', './icons/icon-512.png', './icons/sprite.svg',
  './fonts/bebas-neue-400.woff2', './fonts/barlow-condensed-700.woff2',
  './fonts/barlow-condensed-800.woff2', './fonts/dm-sans-400.woff2',
  './fonts/dm-mono-400.woff2', './fonts/dm-mono-500.woff2',
  './assets/logo-light.svg', './assets/logo-forest.svg',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // le tile mappa non si cachano (troppe); tutto il resto cache-first con aggiornamento in rete
  if (url.hostname.includes('arcgisonline') || url.hostname.includes('openstreetmap') ||
      url.hostname.includes('opentopomap') || url.hostname.includes('stay22') ||
      url.hostname.includes('open-meteo')) return;
  e.respondWith(
    caches.match(e.request).then(hit => {
      const net = fetch(e.request).then(res => {
        if (res.ok && (url.origin === location.origin || url.hostname === 'unpkg.com')) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => hit);
      return hit || net;
    })
  );
});

self.addEventListener('push', e => {
  let data = { title: 'Trentino Gravel', body: '' };
  try { data = e.data.json(); } catch (err) {}
  e.waitUntil(self.registration.showNotification(data.title || 'Trentino Gravel', {
    body: data.body || '',
    icon: './icons/icon-192.png',
    badge: './icons/icon-192.png'
  }));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if ('focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('./');
    })
  );
});
