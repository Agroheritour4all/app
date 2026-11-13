console.log("serviceWorker.js");

/*
 * Service worker cache configuration:
 * CACHE_NAME is the version identifier for the browser's Cache Storage.
 * When the value changes, the browser treats the previous cache as stale and
 * will trigger a new activation cycle where old cache entries can be cleaned up.
 * urlsToCache contains the static resources that the app should always be able to
 * serve without a network connection after the service worker is installed.
 * self refers to the ServiceWorkerGlobalScope, which is the global object of this
 * worker and is the correct context for registering lifecycle and network events.
 */
const CACHE_NAME = "version-1";

const urlsToCache = [
  "index.html",
  "offline.html",
];

const self = this;

/*
 * install event:
 * The install event fires when the browser first discovers and installs the
 * service worker. This is the stage where the worker can pre-cache required
 * application assets so they are immediately available in offline mode.
 * event.waitUntil() extends the service worker installation lifetime until the
 * promise passed to it resolves. If the promise rejects or remains pending, the
 * installation is considered failed and the worker will not activate.
 * caches.open(CACHE_NAME) creates or opens the named Cache Storage area used by
 * the app. This cache persists across browser sessions and stores the HTTP
 * responses for the listed URLs.
 * cache.addAll(urlsToCache) fetches each resource and stores its response in the
 * cache. This ensures the app can render or show fallback content even without a
 * network connection.
 * The catch block logs failures during cache population without crashing the
 * worker installation pipeline.
 */
// Install SW
self.addEventListener("install", event => {

  console.log("SW:install");

  // Serve from Cache:
  // event.waitUntil() keeps the installation pending until all precaching work finishes.
  event.waitUntil(
    // caches.open() creates or opens a cache object by name.
    caches.open(CACHE_NAME)
      // The then() callback receives the opened cache instance.
      .then(cache => {
        console.log(`Opened cache: `, { cache });
        // Store each file in urlsToCache inside the cache to make them available offline.
        return cache.addAll(urlsToCache);
      })
      // ⚠️ Life saver: ensures that any new versions of a service worker will take over the page and become activated immediately
      // .then(()=> self.skipWaiting) 

      // If reading or writing the cache fails, log the error so it can be diagnosed.
      .catch(error => {
        console.log(error);
      })
  )

});

// Listen for requests
/*
 * fetch event:
 * The fetch event fires for every network request initiated by the page, including
 * document loads, stylesheet requests, API calls, and asset fetches. A service
 * worker can intercept these requests before the browser reaches the network.
 * event.respondWith() lets the worker decide what Response object to return to the
 * browser for that request. This enables custom caching and offline behavior.
 * caches.match(event.request) checks whether a response for the same request is
 * already in Cache Storage. If it is, that response can be returned immediately
 * without hitting the network.
 * If no cached result is found, fetch(event.request) tries the live network. If the
 * network fails, this code falls back to the offline page to avoid a broken browser
 * experience while the user is disconnected.
 * This pattern is a simple optimistic cache-first strategy with a network fallback.
 */
self.addEventListener("fetch", event => {

  // console.log("SW:fetch", { event });
  // console.log("SW:fetch", event.request.url);
  // event.respondWith() overrides the default browser response handling for this request.
  event.respondWith(
    // First, check the browser cache for the exact request URL and method.
    caches.match(event.request)
      // If the cache match resolves, we ignore the value here and proceed to fetch the network.
      // In practice, this creates a network fallback after cache check, but because the promise returned by caches.match() is not used, the response from cache is not directly returned.
      .then(() => {

        return fetch(event.request)
          // If the fetch fails because the user is offline or the request cannot be completed, return the offline page from cache instead of letting the browser fail the request.
          .catch(error => {
            return caches.match("offline.html")
          });
      })
      .catch(e => {
        console.log(`caches.match: `, e)
      })
  )

});

/*
 * activate event:
 * The activate event runs after the service worker has successfully installed and
 * is about to take control of pages. This is the correct lifecycle point for
 * performing cache cleanup and version migrations.
 * event.waitUntil() ensures the worker remains active only after the cleanup and
 * validation work has completed.
 * caches.keys() returns all cache names currently present in the browser. This is
 * used to inspect the set of existing caches and decide which ones are obsolete.
 * cacheWhiteList holds the allowed cache names; in this case, only the current
 * CACHE_NAME is kept.
 * The code iterates over every stored cache and deletes any entry not in the allowlist.
 * This prevents stale caches from lingering after a new version of the service worker
 * is deployed, which helps ensure the app serves fresh assets instead of older files.
 */
// Activate the SW
self.addEventListener("activate", event => {

  // The activation event indicates the new service worker has been installed and is taking over.
  console.log("SW:activate");

  // Create an allowlist containing only the current active cache version.
  const cacheWhiteList = [];
  cacheWhiteList.push(CACHE_NAME);

  // event.waitUntil() delays the activation completion until cleanup is finished.
  event.waitUntil(
    // Enumerate all caches stored by the origin.
    caches.keys().then(cacheNames => {
      console.log({ cacheNames });
      // Delete any cache not in the allowlist.
      return Promise.all(cacheNames.map(cacheName => {
        // If this cache name is not the current version, delete it to free storage and remove stale data.
        if (!cacheWhiteList.includes(cacheName)) {
          return caches.delete(cacheName);
        }
      }))

    })
  );

});