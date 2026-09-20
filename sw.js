// Service Worker for Dating App Free PWA
// Caches static assets for instant loading and 100% offline usage on iOS & Android.
// Note: App data (streaks, apps, motivations) lives in persistent client storage
// and is NEVER altered or removed by service worker updates.

const CACHE_NAME = 'dating-free-v1.0.18';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/styles.css',
  './js/qrcode.js',
  './js/i18n.js',
  './js/storage.js',
  './js/milestones.js',
  './js/app.js',
  './manifest.webmanifest',
  './icons/icon.svg',
  './icons/apple-touch-icon.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/qr-code.png',
  './icons/badoo_logo.svg',
  './icons/bumble_logo.svg',
  './icons/grindr_logo.svg',
  './icons/hinge_logo.svg',
  './icons/tinder_logo.svg'
];

// Safari-safe helper: fetch a URL and cache it using the *final* URL after any redirects.
// This prevents "Response served by service worker has redirections" on iOS Safari,
// which happens when reverse proxies (e.g. Tailscale serve, Caddy, nginx) redirect
// /index.html → / and the redirect response itself gets cached.
async function fetchAndCache(cache, url) {
  try {
    // fetch() with redirect:'follow' is the default, giving us the final response.
    const response = await fetch(url, { redirect: 'follow' });
    if (response.ok && response.type !== 'opaqueredirect') {
      // Always store under the ORIGINAL request URL (not the redirect target),
      // so cache.match(originalUrl) works correctly later.
      await cache.put(url, response.clone());
    }
    return response;
  } catch (_) {
    return null;
  }
}

// Install: Cache initial shell assets, safely handling server-side redirects
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Cache each asset individually so one failure doesn't abort the whole install
      await Promise.all(ASSETS_TO_CACHE.map((url) => fetchAndCache(cache, url)));
    }).then(() => self.skipWaiting())
  );
});

// Activate: Purge obsolete asset caches from older versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[SW] Clearing old cache version:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Cache-first for known assets, network-first with offline fallback for navigation.
// Safari-safe: never return a redirect response (type === 'opaqueredirect') from the SW.
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  if (url.origin === location.origin) {
    event.respondWith(
      caches.match(event.request, { ignoreSearch: true }).then(async (cachedResponse) => {

        // Discard cached redirect responses — Safari will reject them for navigate requests
        const safeCached = (cachedResponse && cachedResponse.type !== 'opaqueredirect')
          ? cachedResponse
          : null;

        if (safeCached) {
          // Serve from cache immediately; silently revalidate in background
          fetch(event.request, { redirect: 'follow' }).then(async (networkResponse) => {
            if (networkResponse && networkResponse.ok && networkResponse.type !== 'opaqueredirect') {
              const cache = await caches.open(CACHE_NAME);
              cache.put(event.request, networkResponse.clone());
            }
          }).catch(() => { /* offline — silently ignore */ });
          return safeCached;
        }

        // Not in cache (or was a cached redirect): fetch from network
        try {
          const networkResponse = await fetch(event.request, { redirect: 'follow' });
          if (networkResponse && networkResponse.ok && networkResponse.type !== 'opaqueredirect') {
            const cache = await caches.open(CACHE_NAME);
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        } catch (_) {
          // Offline fallback for navigation: always return the app shell (index.html)
          if (event.request.mode === 'navigate') {
            const fallback = await caches.match('./index.html', { ignoreSearch: true })
                          || await caches.match('./', { ignoreSearch: true });
            if (fallback && fallback.type !== 'opaqueredirect') return fallback;
          }
          return new Response('Offline — app not yet cached. Please open the app once while online.', {
            status: 503,
            headers: { 'Content-Type': 'text/plain' }
          });
        }
      })
    );
  } else {
    // External resources (Google Fonts, etc.): cache-first, silent failure offline
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached && cached.type !== 'opaqueredirect') return cached;
        return fetch(event.request).then((response) => {
          if (response && response.ok && response.type !== 'opaqueredirect') {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        }).catch(() => cached || new Response('', { status: 503 }));
      })
    );
  }
});

// Handle update trigger from the application UI
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
