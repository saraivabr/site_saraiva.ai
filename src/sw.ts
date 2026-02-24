/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope;

const CACHE_NAME = 'saraiva-ai-v1';
const RUNTIME_CACHE = 'saraiva-ai-runtime-v1';
const IMAGE_CACHE = 'saraiva-ai-images-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
];

// ============================================================================
// INSTALL EVENT - Pre-cache static assets
// ============================================================================
self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// ============================================================================
// ACTIVATE EVENT - Clean up old caches
// ============================================================================
self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      console.log('[SW] Cleaning up old caches');
      return Promise.all(
        cacheNames
          .filter(
            (name) =>
              name !== CACHE_NAME &&
              name !== RUNTIME_CACHE &&
              name !== IMAGE_CACHE
          )
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// ============================================================================
// FETCH EVENT - Cache strategies by resource type
// ============================================================================
self.addEventListener('fetch', (event: FetchEvent) => {
  const { request } = event;
  const url = new URL(request.url);

  // Navigation requests - Network-first, fallback to cache
  if (request.mode === 'navigate') {
    event.respondWith(networkFirstNav(request));
    return;
  }

  // API calls - Network-first with timeout
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstAPI(request));
    return;
  }

  // Images - Stale-while-revalidate
  if (request.destination === 'image') {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  // Static assets (JS, CSS, fonts) - Cache-first
  if (
    request.destination === 'script' ||
    request.destination === 'style' ||
    request.destination === 'font'
  ) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Default - Network-first
  event.respondWith(networkFirst(request));
});

// ============================================================================
// CACHE STRATEGIES
// ============================================================================

/**
 * Cache-first: Return cached response if available, otherwise fetch from network
 * Best for: Static assets that rarely change
 */
function cacheFirst(request: Request): Promise<Response> {
  return caches.match(request).then((cached) => {
    if (cached) {
      console.log(`[SW] Cache hit: ${request.url}`);
      return cached;
    }

    return fetch(request)
      .then((response) => {
        // Only cache successful responses
        if (!response || response.status !== 200) {
          return response;
        }

        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, clone);
        });
        return response;
      })
      .catch(() => {
        console.log(`[SW] Fetch failed for: ${request.url}`);
        return new Response('Offline - Resource not cached', {
          status: 503,
          statusText: 'Service Unavailable',
        });
      });
  });
}

/**
 * Network-first: Try to fetch from network, fall back to cache if offline
 * Best for: Content that should be fresh when possible
 */
function networkFirst(request: Request): Promise<Response> {
  return fetch(request)
    .then((response) => {
      // Only cache successful responses
      if (!response || response.status !== 200) {
        return response;
      }

      const clone = response.clone();
      caches.open(RUNTIME_CACHE).then((cache) => {
        cache.put(request, clone);
      });
      return response;
    })
    .catch(() => {
      console.log(`[SW] Network failed, trying cache: ${request.url}`);
      return caches.match(request).then((cached) => {
        if (cached) {
          return cached;
        }
        return new Response('Offline - Resource not cached', {
          status: 503,
          statusText: 'Service Unavailable',
        });
      });
    });
}

/**
 * Network-first for navigation requests with offline page fallback
 */
function networkFirstNav(request: Request): Promise<Response> {
  return fetch(request)
    .then((response) => {
      if (!response || response.status !== 200) {
        return response;
      }

      const clone = response.clone();
      caches.open(RUNTIME_CACHE).then((cache) => {
        cache.put(request, clone);
      });
      return response;
    })
    .catch(() => {
      console.log(`[SW] Navigation failed, trying cache: ${request.url}`);
      return caches.match(request).then((cached) => {
        if (cached) {
          return cached;
        }
        // Return offline page
        return caches.match('/index.html').then((offlinePage) => {
          if (offlinePage) {
            return offlinePage;
          }
          return new Response(
            '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Saraiva.AI - Offline</title><style>body{font-family:system-ui,-apple-system,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#000;color:#fff;text-align:center}h1{font-size:1.5rem;margin-bottom:.5rem}p{color:#999}</style></head><body><div><h1>Você está offline</h1><p>Verifique sua conexão e tente novamente.</p></div></body></html>',
            {
              headers: { 'Content-Type': 'text/html' },
              status: 503,
              statusText: 'Service Unavailable',
            }
          );
        });
      });
    });
}

/**
 * Network-first for API calls with 5 second timeout
 */
function networkFirstAPI(request: Request): Promise<Response> {
  return Promise.race([
    fetch(request),
    new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error('API timeout')), 5000)
    ),
  ])
    .then((response) => {
      if (!response || response.status !== 200) {
        return response;
      }

      const clone = response.clone();
      caches.open(RUNTIME_CACHE).then((cache) => {
        cache.put(request, clone);
      });
      return response;
    })
    .catch(() => {
      console.log(`[SW] API failed, trying cache: ${request.url}`);
      return caches.match(request).then((cached) => {
        if (cached) {
          return cached;
        }
        return new Response(
          JSON.stringify({ error: 'Offline - API not cached' }),
          {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'application/json' },
          }
        );
      });
    });
}

/**
 * Stale-while-revalidate: Return cached response immediately, update in background
 * Best for: Images and non-critical resources
 */
function staleWhileRevalidate(request: Request): Promise<Response> {
  return caches.match(request).then((cached) => {
    const fetchPromise = fetch(request)
      .then((response) => {
        if (!response || response.status !== 200) {
          return response;
        }

        const clone = response.clone();
        caches.open(IMAGE_CACHE).then((cache) => {
          cache.put(request, clone);
        });
        return response;
      })
      .catch(() => {
        console.log(`[SW] Fetch failed for image: ${request.url}`);
        return cached || new Response('Image not available', { status: 503 });
      });

    return cached || fetchPromise;
  });
}

// ============================================================================
// BACKGROUND SYNC - Queue actions when offline
// ============================================================================
self.addEventListener('sync', (event: any) => {
  if (event.tag === 'sync-analytics') {
    event.waitUntil(syncAnalytics());
  }
});

async function syncAnalytics(): Promise<void> {
  try {
    const cache = await caches.open(RUNTIME_CACHE);
    const keys = await cache.keys();
    const analyticKeys = keys.filter((req) =>
      req.url.includes('/api/analytics')
    );

    console.log(`[SW] Syncing ${analyticKeys.length} analytics events`);

    for (const key of analyticKeys) {
      const request = new Request(key.url, {
        method: 'POST',
      });

      try {
        await fetch(request);
        await cache.delete(key);
      } catch (error) {
        console.log(`[SW] Failed to sync analytics: ${error}`);
      }
    }
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

// ============================================================================
// MESSAGE HANDLING - Communicate with clients
// ============================================================================
self.addEventListener('message', (event: ExtendableMessageEvent) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLIENTS_CLAIM') {
    self.clients.claim();
  }
});

export {};
