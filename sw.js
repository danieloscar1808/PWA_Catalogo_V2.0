const CACHE_NAME = "cat-cache";

// Archivos básicos mínimos
const CORE_FILES = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.json"
];

// Instalación
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CORE_FILES))
  );
  self.skipWaiting();
});

// Activación
self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

// Estrategia Stale While Revalidate
self.addEventListener("fetch", event => {

  if (event.request.method !== "GET") return;

  event.respondWith(

    caches.match(event.request).then(cachedResponse => {

      const networkFetch = fetch(event.request)
        .then(networkResponse => {

          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });

        })
        .catch(() => cachedResponse);

      // Devuelve primero cache (si existe)
      return cachedResponse || networkFetch;

    })

  );

});
