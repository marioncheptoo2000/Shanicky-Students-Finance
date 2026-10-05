const CACHE = "student-finance-v1";
const FILES = ["./", "./index.html", "./style.css", "./script.js", "./icons/icon-192.png", "./icons/icon-512.png"];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES); }));
});

self.addEventListener("fetch", function (e) {
  e.respondWith(
    caches.match(e.request).then(function (r) { return r || fetch(e.request); })
  );
});