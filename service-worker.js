self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open("evcalc-v1").then(cache => {
      return cache.addAll(["index.html", "manifest.json", "icon.png"]);
    })
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const clone = response.clone();
        caches.open("evcalc-v1").then(cache => {
          cache.put(event.request, clone);
        });
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
