const CACHE_NAME = 'bodycheck-v17-layout';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/supabase-cdn.min.js',
  '/js/supabase.js',
  '/js/inspection.js',
  '/js/bodyDiagram.js',
  '/js/selfcare.js',
  '/js/storage.js',
  '/js/pdf.js',
  '/js/app.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // 認証APIリクエストはキャッシュしない
  if (event.request.url.includes('supabase.co')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // ネットワーク優先、失敗時にキャッシュ（常に最新を取得）
  event.respondWith(
    fetch(event.request)
      .then(fetchResponse => {
        if (fetchResponse && fetchResponse.status === 200) {
          const responseClone = fetchResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return fetchResponse;
      })
      .catch(() => caches.match(event.request).then(r => r || caches.match('/index.html')))
  );
});
