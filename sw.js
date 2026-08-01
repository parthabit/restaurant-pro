/* HIGH GARDEN — minimal service worker (demo offline shell cache)
   Note: this is a lightweight starter. For production offline support,
   add a proper versioned cache strategy and register this from each page:
   if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js');
*/
const CACHE = 'high-garden-v1';
const SHELL = [
  './index.html',
  './menu.html',
  './gallery.html',
  './events.html',
  './reservation.html',
  './contact.html',
  './assets/css/style.css',
  './assets/js/main.js',
  './manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request).catch(() => cached))
  );
});
