// Service Worker for Dating App Free PWA
// Caches static assets for instant loading and 100% offline usage on iOS & Android.
// Note: App data (streaks, apps, motivations) lives in persistent client storage
// and is NEVER altered or removed by service worker updates.

const CACHE_NAME = 'dating-free-v1.0.17';
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

// Install: Cache initial shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
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

// Fetch: Stale-While-Revalidate strategy for lightning fast launches & seamless updates
self.addEventListener('fetch', (event) => {
  // Only cache GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Avoid caching foreign cross-origin resources like Google Fonts dynamically or handle gracefully
  if (url.origin === location.origin) {
    event.respondWith(
      caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
        if (cachedResponse) {
          // Serve from cache immediately; update in background if online
          fetch(event.request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseClone);
              });
            }
          }).catch(() => {
            // Silently ignore background fetch failure when offline
          });
          return cachedResponse;
        }

        // Not in cache: fetch from network
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        }).catch(async () => {
          // Offline navigation fallback: return index.html for app shell
          if (event.request.mode === 'navigate') {
            const fallback = await caches.match('./index.html') || await caches.match('./');
            if (fallback) return fallback;
          }
          return cachedResponse;
        });
      })
    );
  } else {
    // For external fonts or resources, cache with fallback
    event.respondWith(
      caches.match(event.request).then((cached) => {
        return cached || fetch(event.request).then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clone);
            });
          }
          return response;
        }).catch(() => cached);
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
