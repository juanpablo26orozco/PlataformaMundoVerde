/**
 * Service Worker para Mundo Verde
 * Cachea assets estáticos para mejorar velocidad de carga
 */

const CACHE_VERSION = 'mundoverde-v1.0.0';
const CACHE_NAME = `mundoverde-cache-${CACHE_VERSION}`;

// Assets críticos que se cachean inmediatamente al instalar
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico'
];

// Patrones de URLs que deben cachearse
const CACHE_PATTERNS = {
  images: /\.(png|jpg|jpeg|svg|webp|gif|ico)$/i,
  static: /\.(js|css)$/i,
  fonts: /\.(woff|woff2|ttf|eot)$/i,
  json: /\.(json)$/i,
  docs: /\.(pdf|xlsx|xls)$/i
};

// Estrategias de caché
const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  CACHE_ONLY: 'cache-only',
  NETWORK_ONLY: 'network-only'
};

// Tiempo de expiración por tipo de recurso (en milisegundos)
const CACHE_EXPIRATION = {
  images: 7 * 24 * 60 * 60 * 1000,    // 7 días
  static: 24 * 60 * 60 * 1000,        // 1 día
  fonts: 30 * 24 * 60 * 60 * 1000,    // 30 días
  json: 24 * 60 * 60 * 1000,          // 1 día
  docs: 7 * 24 * 60 * 60 * 1000       // 7 días
};

/**
 * Instalación del Service Worker
 */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => {
        return self.skipWaiting();
      })
      .catch(() => {
        // Ignorar errores de instalación
      })
  );
});

/**
 * Activación del Service Worker
 */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName.startsWith('mundoverde-cache-') && cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

/**
 * Determina la estrategia de caché según el tipo de recurso
 */
function getCacheStrategy(url) {
  if (url.includes('/api/')) return CACHE_STRATEGIES.NETWORK_ONLY;
  if (CACHE_PATTERNS.images.test(url)) return CACHE_STRATEGIES.CACHE_FIRST;
  if (CACHE_PATTERNS.static.test(url)) return CACHE_STRATEGIES.CACHE_FIRST;
  if (CACHE_PATTERNS.fonts.test(url)) return CACHE_STRATEGIES.CACHE_FIRST;
  if (CACHE_PATTERNS.json.test(url)) return CACHE_STRATEGIES.NETWORK_FIRST;
  if (CACHE_PATTERNS.docs.test(url)) return CACHE_STRATEGIES.CACHE_FIRST;
  if (url.endsWith('.html') || url.endsWith('/')) return CACHE_STRATEGIES.NETWORK_FIRST;
  return CACHE_STRATEGIES.NETWORK_FIRST;
}

/**
 * Obtiene el tiempo de expiración según el tipo de recurso
 */
function getExpirationTime(url) {
  if (CACHE_PATTERNS.images.test(url)) return CACHE_EXPIRATION.images;
  if (CACHE_PATTERNS.static.test(url)) return CACHE_EXPIRATION.static;
  if (CACHE_PATTERNS.fonts.test(url)) return CACHE_EXPIRATION.fonts;
  if (CACHE_PATTERNS.json.test(url)) return CACHE_EXPIRATION.json;
  if (CACHE_PATTERNS.docs.test(url)) return CACHE_EXPIRATION.docs;
  return CACHE_EXPIRATION.static;
}

/**
 * Verifica si un recurso en caché ha expirado
 */
async function isCacheExpired(response) {
  if (!response) return true;
  
  const dateHeader = response.headers.get('date');
  if (!dateHeader) return false;
  
  const cacheDate = new Date(dateHeader).getTime();
  const now = Date.now();
  const url = response.url;
  const expirationTime = getExpirationTime(url);
  
  return (now - cacheDate) > expirationTime;
}

/**
 * Estrategia CACHE_FIRST: Buscar en caché primero, red si falla
 */
async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  
  if (cached) {
    const expired = await isCacheExpired(cached);
    if (!expired) {
      return cached;
    }
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    if (cached) {
      return cached;
    }
    return createFallbackResponse(request);
  }
}

/**
 * Estrategia NETWORK_FIRST: Intentar red primero, caché si falla
 */
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    return createFallbackResponse(request);
  }
}

/**
 * Crea una respuesta fallback para cuando falla todo
 */
function createFallbackResponse(request) {
  const url = request.url;
  
  // Para imágenes, retornar un placeholder SVG
  if (CACHE_PATTERNS.images.test(url)) {
    const svg = `
      <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="#f0f0f0"/>
        <text x="50%" y="50%" text-anchor="middle" fill="#999" font-family="Arial" font-size="16">
          Imagen no disponible
        </text>
      </svg>
    `;
    return new Response(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'no-store'
      }
    });
  }
  
  // Para otros recursos, retornar error genérico
  return new Response('Recurso no disponible', {
    status: 503,
    statusText: 'Service Unavailable'
  });
}

/**
 * Interceptor de fetch
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = request.url;
  
  // Ignorar requests que no sean GET
  if (request.method !== 'GET') {
    return;
  }
  
  // Ignorar chrome extensions
  if (url.startsWith('chrome-extension://')) {
    return;
  }
  
  const strategy = getCacheStrategy(url);
  
  if (strategy === CACHE_STRATEGIES.CACHE_FIRST) {
    event.respondWith(cacheFirst(request));
  } else if (strategy === CACHE_STRATEGIES.NETWORK_FIRST) {
    event.respondWith(networkFirst(request));
  } else if (strategy === CACHE_STRATEGIES.NETWORK_ONLY) {
    event.respondWith(fetch(request));
  } else if (strategy === CACHE_STRATEGIES.CACHE_ONLY) {
    event.respondWith(caches.match(request));
  }
});

/**
 * Manejo de mensajes
 */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName.startsWith('mundoverde-cache-')) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  }
});
