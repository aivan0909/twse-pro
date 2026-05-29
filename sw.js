// ── 每次更新 index.html 時，把版本號加一，瀏覽器就會自動清除舊快取 ──
const CACHE = 'twse-pro-v7';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.svg',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS).catch(()=>{}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  // 清除所有舊版快取
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => {
        console.log('[SW] 刪除舊快取:', k);
        return caches.delete(k);
      }))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  const isAPI = url.hostname.includes('twse.com.tw') || url.hostname.includes('fugle.tw');
  const isFont = url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com');

  if(isAPI){
    // API：永遠從網路取得最新資料
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
  } else if(isFont){
    // 字型：快取優先
    e.respondWith(caches.match(e.request).then(cached => cached || fetch(e.request)));
  } else {
    // 本地資源（index.html 等）：網路優先，確保永遠是最新版
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
          return res;
        })
        .catch(() => caches.match(e.request))
    );
  }
});

self.addEventListener('push', e => {
  const data = e.data?.json() || {};
  e.waitUntil(
    self.registration.showNotification(data.title || '台股PRO', {
      body: data.body || '到價警報觸發',
      icon: './icon-192.svg',
    })
  );
});
