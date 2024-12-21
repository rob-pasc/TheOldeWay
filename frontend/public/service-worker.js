self.addEventListener('install', event => {
    self.skipWaiting(); 
    console.log('Service worker installed.');
  });
  self.addEventListener('fetch', event => {
    console.log('Fetching:', event.request.url);
  });
  self.addEventListener('activate', event => {
    console.log('Service worker activated.');
  });
  