const staticCacheName = 'static-app-v1'
const dynamicCacheName = 'dynamic-app-v1'
const assetsUrls = [
    'index.html',
    'scripts.js',
    'styles.css',
    'offline.html'
]

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(staticCacheName).then(cache => cache.addAll(assetsUrls))
    )
})

self.addEventListener('activate', async event => {
    const cacheNames = await caches.keys()
    await Promise.all(
        cacheNames
        .filter(name => name !== staticCacheName && name!=dynamicCacheName)
        .map(name => caches.delete(name))
    )
})

self.addEventListener('fetch', event => {
    const { request } = event
    const url = new URL(request.url)
    if (!url.pathname.includes('api')) {
        event.respondWith(cacheFirst(request))
    } else {
        // event.respondWith(networkFirst(request))
    }
})

async function cacheFirst(request) {
    const cached = await caches.match(request)
    return cached ?? await fetch(request)
}

async function networkFirst(request) {
    const cache = await caches.open(dynamicCacheName)
    try {
        const response = await fetch(request)
        cache.put(request, response.clone())
        return response
    } catch(e) {
        const cached = await cache.match(request)
        return cached ?? await caches.match('/offline.html')
    }
}