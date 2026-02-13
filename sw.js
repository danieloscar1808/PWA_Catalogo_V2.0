const CACHE_VERSION = "v2"; // Cambiar número cada vez que modifiques la app
const CACHE_NAME = "cat-cache-" + CACHE_VERSION;

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./splash.png"
];

// Instalación
self.addEventListener("install", event => {
  self.skipWaiting(); // Activa inmediatamente el nuevo SW

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
  );
});

// Activación
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key); // Borra versiones viejas
          }
        })
      );
    })
  );

  return self.clients.claim(); // Toma control inmediato
});

// Fetch
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
