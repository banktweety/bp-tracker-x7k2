const CACHE_NAME = 'bp-tracker-v4';

self.addEventListener('install', function(e) {
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.map(function(key) { return caches.delete(key); }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  // ข้าม API calls ทั้งหมด — ให้ผ่านตรงๆ ไม่ cache
  if (e.request.url.includes('googleapis.com') || e.request.url.includes('sheets.googleapis')) {
    return;
  }
  // ไฟล์ app — ดึงจาก network ก่อน ถ้าไม่ได้ค่อยใช้ cache
  e.respondWith(
    fetch(e.request).catch(function() {
      return caches.match(e.request);
    })
  );
});
