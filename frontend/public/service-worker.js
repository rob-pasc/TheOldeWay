self.addEventListener('install', event => {
  console.log('Service Worker: Install event'); // Debug log
  self.skipWaiting();
  event.waitUntil(
    caches.open('pwa-cache').then(cache => {
      console.log('Service Worker: Caching files'); // Debug log
      return cache.addAll([
        '/',
        './index.html',
        './styles/main.css',
        './js/app.js',
      ]);
    }).catch(error => {
      console.error('Service Worker: Caching failed', error); // Debug log
    })
  );
});

self.addEventListener('activate', event => {
  console.log('Service Worker: Activate event'); // Debug log
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== 'pwa-cache') {
            console.log('Service Worker: Deleting old cache', cacheName); // Debug log
            return caches.delete(cacheName);
          }
        })
      );
    }).catch(error => {
      console.error('Service Worker: Activation failed', error); // Debug log
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  console.log('Service Worker: Fetch event for', event.request.url); // Debug log
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        console.log('Service Worker: Found in cache', event.request.url); // Debug log
        return response;
      }
      console.log('Service Worker: Network request for', event.request.url); // Debug log
      return fetch(event.request);
    }).catch(error => {
      console.error('Service Worker: Fetch failed', error); // Debug log
    })
  );
});