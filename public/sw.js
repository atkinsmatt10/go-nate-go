// Minimal service worker to prevent 404 errors
// This can be expanded later if you want to add offline functionality

self.addEventListener("install", function () {
  console.log("Service Worker installed")
})

self.addEventListener("activate", function () {
  console.log("Service Worker activated")
})

self.addEventListener("fetch", function () {
  // For now, just let all requests pass through normally
  // You can add caching strategies here later if needed
})
