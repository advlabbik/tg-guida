// Service worker: le info chiave restano consultabili anche senza segnale.
const CACHE = 'tg-guida-v18';

// Notifiche push: stessi valori del client (index.html), duplicati qui perche'
// il service worker gira in uno scope separato, senza import dal client.
const SUPABASE_URL = 'https://kqsrtuzeeiljozdnjott.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_kL1z4KhZWlxIpqE55KIQvw_rr3kZbih';
const VAPID_PUBLIC_KEY = 'BM20wU_676VT3P7CjS6j_9kFYXLnFzlODCAMTa6DZi8FftYWn4_hVDBtwAcW1GhiwFDXEi8A1NyR_Kgga90ZyFM';

function urlBase64ToUint8Array(base64String){
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g,'+').replace(/_/g,'/');
  const raw = atob(base64);
  return Uint8Array.from([...raw].map(c => c.charCodeAt(0)));
}
const ASSETS = [
  './', './index.html', './staff.html', './styles.css', './content.js', './tracks.js', './poi.js', './icons.js',
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
        if ('focus' in client) {
          client.postMessage({ type: 'open-live' });
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow('./?tab=live');
    })
  );
});

// Il browser puo' ruotare l'endpoint della subscription nelle settimane tra
// l'opt-in e l'evento (rotazione push service). Ri-sottoscriviamo con la
// stessa chiave e salviamo subito la nuova subscription su Supabase, senza
// passare dal client (potrebbe non essere aperto in quel momento).
self.addEventListener('pushsubscriptionchange', e => {
  e.waitUntil(
    self.registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
    }).then(sub => {
      const subJson = sub.toJSON();
      return fetch(`${SUPABASE_URL}/rest/v1/tg_push_subscriptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ endpoint: subJson.endpoint, p256dh: subJson.keys.p256dh, auth: subJson.keys.auth })
      });
    }).catch(() => {})
  );
});
