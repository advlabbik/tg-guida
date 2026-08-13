// Service worker: le info chiave restano consultabili anche senza segnale.
// Strategia: network-first per i file dell'app (chi ha rete vede SEMPRE l'ultima
// versione, senza doppia apertura), cache come rete di salvataggio quando il
// segnale manca. Le tile mappa, il meteo e Stay22 non passano di qui.
const CACHE = 'tg-guida-v20';
const ASSETS = [
  './', './index.html', './content.js', './tracks.js', './poi.js',
  './styles.css', './icons.js', './icons/sprite.svg',
  './assets/tg-logo-full.svg',
  './assets/percorsi/corto.jpg', './assets/percorsi/medio.jpg', './assets/percorsi/lungo.jpg',
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
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  // servizi esterni dinamici: sempre rete diretta, mai cache
  if (url.hostname.includes('arcgisonline') || url.hostname.includes('openstreetmap') ||
      url.hostname.includes('opentopomap') || url.hostname.includes('stay22') ||
      url.hostname.includes('open-meteo')) return;

  const sameApp = url.origin === location.origin;
  if (sameApp) {
    // network-first: la versione online vince sempre, la cache copre l'assenza di segnale
    e.respondWith(
      fetch(e.request).then(res => {
        if (res && res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => caches.match(e.request).then(hit => hit || caches.match('./index.html')))
    );
    return;
  }
  // librerie e font esterni versionati: cache-first, non cambiano mai
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      if (res && res.ok && (url.hostname === 'unpkg.com' ||
          url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com')) {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
      }
      return res;
    }))
  );
});

// ---------- notifiche push (sistema di Francesco, PR #13) ----------
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
        if ('focus' in client) {
          client.postMessage({ type: 'open-live' });
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow('./?tab=live');
    })
  );
});
