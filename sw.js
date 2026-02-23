let useCat = false;
let useBlocked = false;
let useOfflineMode = false;

self.addEventListener('install', event => {
  console.log('SW installing modificated versionnnnnnn');

    // Precarga cat.svg y dog.svg en caché
    event.waitUntil(
        caches.open('cacheApp').then(cache => cache.addAll(['cat.svg', 'dog.svg']))
    );
});

self.addEventListener('activate', event => {
    console.log('Service Worker listo para interceptar fetches!');
});

self.addEventListener('message', event => {
    if (event.data.action === 'switchToCat')   useCat = true;
    if (event.data.action === 'toggleBlock')   useBlocked = !useBlocked;
    if (event.data.action === 'toggleOffline') useOfflineMode = !useOfflineMode;
});

// ── Funcionalidad 1: Intercambio dog.svg → cat.svg ──────────────────────────
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    if (url.pathname.includes('dog.svg') && useCat) {
        event.respondWith(caches.match('cat.svg'));
    }
});

// ── Funcionalidad 2: Bloqueo de imágenes SVG ────────────────────────────────
// Cuando useBlocked es true, devuelve un SVG placeholder en lugar del recurso real.
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    if (useBlocked && url.pathname.endsWith('.svg')) {
        const bloqueadoSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
          <rect width="200" height="200" fill="#e0e0e0" rx="12"/>
          <text x="50%" y="45%" text-anchor="middle" font-size="48">🚫</text>
          <text x="50%" y="70%" text-anchor="middle" font-size="16" fill="#555">Bloqueado</text>
        </svg>`;
        event.respondWith(
            new Response(bloqueadoSVG, { headers: { 'Content-Type': 'image/svg+xml' } })
        );
    }
});

// ── Funcionalidad 3: Modo offline — estrategia caché primero ─────────────────
// Cuando useOfflineMode es true, sirve desde caché y guarda nuevas respuestas.
// Si está desactivado, actúa como fallback general con fetch normal.
self.addEventListener('fetch', event => {
    if (useOfflineMode) {
        event.respondWith(
            caches.match(event.request).then(cached => {
                if (cached) return cached;
                return fetch(event.request).then(response => {
                    const clon = response.clone();
                    caches.open('cacheApp').then(cache => cache.put(event.request, clon));
                    return response;
                });
            })
        );
    } else {
        event.respondWith(fetch(event.request));
    }
});