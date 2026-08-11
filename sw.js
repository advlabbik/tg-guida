// Service worker: le info chiave restano consultabili anche senza segnale.
const CACHE = 'tg-guida-v10';
const ASSETS = [
  './', './index.html', './content.js', './tracks.js', './poi.js',
  './icons/icon-192.png', './icons/icon-512.png',
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
