const CACHE = 'sleeper-v1'
const URLS = ['/', '/manifest.json']

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(URLS))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  e.waitUntil(clients.claim())
})

self.addEventListener('fetch', (e) => {
  if (e.request.url.includes('api.sleeper.app')) {
    e.respondWith(fetch(e.request))
    return
  }
  e.respondWith(
    caches.match(e.request).then((r) => r || fetch(e.request))
  )
})
