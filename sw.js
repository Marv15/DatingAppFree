// Service Worker for Dating App Free PWA
// Caches static assets for instant loading and 100% offline usage on iOS & Android.
// Note: App data (streaks, apps, motivations) lives in persistent client storage
// and is NEVER altered or removed by service worker updates.

const CACHE_NAME = 'dating-free-v1.0.31';

// Only cache the root path (./), NOT ./index.html separately.
// Tailscale serve (and similar reverse proxies) redirect /index.html → /,
// which produces a response with redirected:true that Safari's SW sandbox rejects.
// Fetching ./ directly always returns a clean 200 OK from the Node server.
const ASSETS_TO_CACHE = [
  './',
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

// -----------------------------------------------------------------------------
// Safari-safe fetch + cache helper.
//
// The root problem: Tailscale serve (Go file server) redirects /index.html → /
// fetch(url, {redirect:'follow'}) returns a 200 OK but response.redirected===true.
// WebKit stores this flag in the Cache API and later, when the SW returns this
// cached response to Safari for a navigate request, Safari throws:
//   "Response served by service worker has redirections"
//
// Fix: Reconstruct a *brand-new* Response from the raw bytes + headers.
// The new Response object has redirected===false by definition, which satisfies Safari.
// -----------------------------------------------------------------------------
async function fetchAndCacheSafe(cache, url) {
  try {
    const res = await fetch(url, { redirect: 'follow' });
    if (!res || !res.ok || res.type === 'opaqueredirect') return;

    // Read body as ArrayBuffer and copy headers to strip all redirect metadata.
    const body = await res.arrayBuffer();
    const headers = {};
    res.headers.forEach((val, key) => { headers[key] = val; });

    const cleanResponse = new Response(body, {
      status: res.status,
      statusText: res.statusText,
      headers
    });

    await cache.put(url, cleanResponse);
  } catch (_) {
    // Ignore individual asset failures — don't abort the whole install
  }
}

// Install: Pre-cache all shell assets with redirect-stripped responses
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => Promise.all(ASSETS_TO_CACHE.map((url) => fetchAndCacheSafe(cache, url))))
      .then(() => self.skipWaiting())
  );
});

// Activate: Purge old caches from previous versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.map((name) => {
        if (name !== CACHE_NAME) {
          console.log('[SW] Deleting old cache:', name);
          return caches.delete(name);
        }
      }))
    ).then(() => self.clients.claim())
  );
});

// Fetch: Cache-first with Safari-safe response reconstruction.
// For navigate requests: always serve the app shell from cache (offline-first).
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Skip non-same-origin requests (handled separately below)
  if (url.origin !== location.origin) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((res) => {
          if (res && res.ok) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, res.clone()));
          }
          return res;
        }).catch(() => new Response('', { status: 503 }));
      })
    );
    return;
  }

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);

    // For navigate requests, always try the app shell cache first.
    // This makes the PWA launch instantly offline without hitting the network.
    if (event.request.mode === 'navigate') {
      // Try cache for the exact request URL first
      let appShell = await caches.match(event.request, { ignoreSearch: true });

      // Fall back to the cached root ('./') which contains index.html content
      if (!appShell || appShell.redirected) {
        appShell = await caches.match('./') || await caches.match('./index.html');
      }

      if (appShell && !appShell.redirected) {
        // Revalidate in background if online
        fetchAndCacheSafe(cache, './').catch(() => {});
        return appShell;
      }

      // No cache yet: fetch from network (first launch / after cache clear)
      try {
        const res = await fetch(event.request, { redirect: 'follow' });
        if (res && res.ok) {
          const body = await res.arrayBuffer();
          const headers = {};
          res.headers.forEach((v, k) => { headers[k] = v; });
          const clean = new Response(body, { status: res.status, statusText: res.statusText, headers });
          await cache.put('./', clean.clone());
          return clean;
        }
        return res;
      } catch (_) {
        return new Response('Offline — please open the app once with an internet connection first.', {
          status: 503,
          headers: { 'Content-Type': 'text/plain; charset=UTF-8' }
        });
      }
    }

    // Non-navigate requests: cache-first, revalidate in background
    const cached = await caches.match(event.request, { ignoreSearch: true });
    if (cached && !cached.redirected) {
      fetchAndCacheSafe(cache, event.request.url).catch(() => {});
      return cached;
    }

    // Not cached: fetch, clean, store
    try {
      const res = await fetch(event.request, { redirect: 'follow' });
      if (res && res.ok && res.type !== 'opaqueredirect') {
        const body = await res.arrayBuffer();
        const headers = {};
        res.headers.forEach((v, k) => { headers[k] = v; });
        const clean = new Response(body, { status: res.status, statusText: res.statusText, headers });
        await cache.put(event.request, clean.clone());
        return clean;
      }
      return res;
    } catch (_) {
      return new Response('', { status: 503 });
    }
  })());
});

// Handle update trigger from the application UI
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
