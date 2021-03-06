var staticCacheVersion = 'static-v6'
var dynamicCacheVersion = 'static-v3'

self.addEventListener('install', function (event) {
	console.log('[Service Worker] Installing Service Worker ...', event);
	event.waitUntil(
		caches.open(staticCacheVersion)
			.then(function (cache) {
				console.log('[Service Worker] Precaching app shell');
				cache.addAll([
					'/',
					'/index.html',
					'/src/js/app.js',
					'/src/js/feed.js',
					'/src/js/material.min.js',
					'src/css/app.css',
					'src/css/feed.css',
					'src/images/main-image.jpg',
					'https://fonts.googleapis.com/css?family=Roboto:400,700',
					'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css',
					'https://fonts.googleapis.com/icon?family=Material+Icons'
				])
			})
	)
});

self.addEventListener('activate', function (event) {
	console.log('[Service Worker] Activating Service Worker ....', event);
	event.waitUntil(
		caches.keys()
			.then(function (keyList) {
				return Promise.all(keyList.map(function (key) {
					if (key !== staticCacheVersion && key !== dynamicCacheVersion) {
						console.log('[Sevice Worker] Removing old cache', key);
						return caches.delete(key)
					}
				}))
			})
	)
	return self.clients.claim();
});

self.addEventListener('fetch', function (event) {
	event.respondWith(
		caches.match(event.request)
			.then(function (response) {
				if (response) {
					return response;
				} else {

					return fetch(event.request)
						.then(function (response) {
							caches.open(dynamicCacheVersion)
								.then(function (cache) {
									cache.put(event.request.url, response.clone())
									return response
								})
						})
				}

			})
	);
});