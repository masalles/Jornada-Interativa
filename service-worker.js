const CACHE_NAME = 'jornada-interativa-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/css/animations.css',
  '/js/app.js',
  '/js/router.js',
  '/js/components/navbar.js',
  '/js/components/home.js',
  '/js/components/login.js',
  '/js/components/register.js',
  '/js/components/welcome.js',
  '/js/components/journey-map.js',
  '/js/components/stage-card.js',
  '/js/components/scripture.js',
  '/js/components/prayer.js',
  '/js/components/activity.js',
  '/js/components/achievements.js',
  '/js/services/storage-service.js',
  '/js/services/content-service.js',
  '/js/services/progress-service.js',
  '/js/services/bible-service.js',
  '/js/services/animation-service.js',
  '/js/services/auth-service.js',
  '/js/data/stages.js',
  '/js/data/activities.js',
  '/js/data/prayers.js',
  '/js/data/achievements.js',
  '/manifest.json',
  // Icons will be added when available
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-512.png'
];

// Install Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching app shell');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

// Activate and clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName !== CACHE_NAME;
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

// Serve cached content when offline
self.addEventListener('fetch', event => {
  // For Bible API requests, use network with cache fallback
  if (event.request.url.includes('bible-api.com')) {
    // Check if the request already has the token
    const url = new URL(event.request.url);
    const hasToken = url.searchParams.has('token');

    // If no token, we need to add it
    if (!hasToken && !event.request.url.includes('token=')) {
      // Create a new request with the token
      const apiToken = 'd9a13d64ab6be72298f24ee82aba3b14';
      url.searchParams.append('token', apiToken);

      const modifiedRequest = new Request(url.toString(), {
        method: event.request.method,
        headers: event.request.headers,
        mode: event.request.mode,
        credentials: event.request.credentials,
        redirect: event.request.redirect
      });

      event.respondWith(
        fetch(modifiedRequest)
          .then(response => {
            // Clone the response to save in cache
            const clonedResponse = response.clone();

            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, clonedResponse);
            });

            return response;
          })
          .catch(() => {
            return caches.match(event.request);
          })
      );
      return;
    }

    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Clone the response to save in cache
          const clonedResponse = response.clone();

          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, clonedResponse);
          });

          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
  } else {
    // For all other requests, try cache first with network fallback
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          return response || fetch(event.request)
            .then(fetchResponse => {
              // Don't cache dynamic API calls or analytics
              if (event.request.url.includes('api') ||
                  event.request.url.includes('analytics')) {
                return fetchResponse;
              }

              // Cache everything else
              const clonedResponse = fetchResponse.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, clonedResponse);
              });

              return fetchResponse;
            });
        })
    );
  }
});