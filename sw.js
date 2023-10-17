// Todos aquellos archivos que nuestra app utilice
const STATIC = 'staticv2'
const INMUTABLE = 'inmutablev1'
const DYNAMIC = 'dynamicv1'
const APP_SHELL = [
  '/',
  '/index.html',
  'js/app.js',
  'img/gato.jpg',
  'css/style.css',
  'img/oso.jpg',
  '/pages/page2.html',
  '/pages/offline.html',
]

const APP_SHELL_INMUTABLE = [
  'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css',
]

self.addEventListener('install', (e) => {
  console.log('Instalando ')
  //e.skipWaiting();
  const staticCache = caches.open(STATIC).then((cache) => {
    cache.addAll(APP_SHELL)
  })
  const inmutable = caches.open(INMUTABLE).then((cache) => {
    cache.addAll(APP_SHELL_INMUTABLE)
  })
})

self.addEventListener('activate', (e) => {
  console.log('Activado ')
})

self.addEventListener('fetch', (e) => {
  e.respondWith(cachedResponse(e.request));
});

self.addEventListener('fetch', (e) => {
  const { request } = e;

  e.respondWith(
    caches.match(request).then((cacheResponse) => {
      if (cacheResponse) {
        return cacheResponse;
      }
      if (request.url.includes('pages/page2.html') && !navigator.onLine) {
        return caches.match('pages/offline.html');
      }
      return fetch(request).then((networkResponse) => {
        const dynamicCache = caches.open(DYNAMIC).then((cache) => {
          cache.put(request, networkResponse.clone());
        });
        return networkResponse;
      });
    })
  );
});