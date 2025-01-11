const CACHE_NAME = 'theoldeway-cache-v1';
const urlsToCache = [
  '/'
  // '/index.html',
  // '/styles/main.css',
  // '/js/app.js',
  // '/assets/vid/smoke-loop.mp4',
  // '/assets/icons/white-knight192.png',
  // Add other assets to cache
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  console.log('Service Worker: Fetch event for', event.request.url);
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          console.log('Service Worker: Found in cache', event.request.url);
          return response;
        }
        console.log('Service Worker: Network request for', event.request.url);
        return fetch(event.request).then(networkResponse => {
          if (networkResponse.status === 404) {
            console.error('Service Worker: Resource not found', event.request.url);
            return caches.match('/404.html');
          }
          if (networkResponse.status === 200) {
            return caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request.url, networkResponse.clone());
              return networkResponse;
            });
          }
          return networkResponse;
        });
      }).catch(error => {
        console.error('Service Worker: Fetch error', error);
        return caches.match('/offline.html');
      })
  );
});