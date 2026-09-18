// Chu Gia Technology - Progressive Web App Service Worker
const CACHE_NAME = 'chugia-pwa-v20260918_1945';
const PRECACHE_URLS = [
  './',
  './index.html',
  './trang-chu.html',
  './css/landing.css',
  './css/product-modal.css',
  './images/logo_chugia_horizontal.svg',
  './images/favicon.svg',
  './images/pwa-icon-192.png',
  './images/pwa-icon-512.png',
  './manifest.webmanifest'
];

// Install: Cache core assets & activate immediately
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS).catch((err) => {
        console.warn('[PWA SW] Precache warning:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate: Clean up older caches & take control of clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('[PWA SW] Deleting obsolete cache:', name);
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Strategy depending on request type
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // 1. Bypass non-GET and API / Dynamic endpoints
  if (req.method !== 'GET' || url.pathname.startsWith('/api/') || url.hostname.includes('deepseek.com')) {
    return;
  }

  // 2. Navigation / HTML requests: Network First, fallback to cached HTML
  if (req.mode === 'navigate' || (req.headers.get('accept') && req.headers.get('accept').includes('text/html'))) {
    event.respondWith(
      fetch(req)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const copy = networkRes.clone();
            caches.open(CACHE_NAME).then((c) => c.put(req, copy));
          }
          return networkRes;
        })
        .catch(() => {
          return caches.match(req).then((cached) => cached || caches.match('./index.html'));
        })
    );
    return;
  }

  // 3. Static Assets (CSS, JS, Images, Fonts): Cache First with background revalidation
  event.respondWith(
    caches.match(req).then((cachedRes) => {
      const fetchPromise = fetch(req)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const copy = networkRes.clone();
            caches.open(CACHE_NAME).then((c) => c.put(req, copy));
          }
          return networkRes;
        })
        .catch(() => cachedRes);

      return cachedRes || fetchPromise;
    })
  );
});
