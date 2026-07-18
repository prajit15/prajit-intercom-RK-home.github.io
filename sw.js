// sw.js - Service Worker for Background Handling
const CACHE_NAME = 'doorbell-cache-v1';
const ASSETS = [
  './',
  './index.html'
];

// Install stage: cache our interface
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Activate stage
self.addEventListener('activate', (event) => {
  console.log('Service Worker activated successfully.');
});

// Listen for push events from the browser's background sync
self.addEventListener('push', (event) => {
  let title = 'Smart Doorbell Alert!';
  let options = {
    body: 'Someone is ringing your doorbell right now!',
    icon: './icon.png', // We will set this up next
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      { action: 'open', title: 'Answer Video Call' },
      { action: 'close', title: 'Dismiss' }
    ]
  };

  if (event.data) {
    options.body = event.data.text();
  }

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Handle notification clicks (Open the app when you tap it!)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow('./index.html')
    );
  }
});
