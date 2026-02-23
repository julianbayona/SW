const CACHE_NAME = 'cacheApp';
const animals = ['cat.svg', 'dog.svg', 'x.svg'];

let changeImage = false;
let currentIndex = 0; 

self.addEventListener('install', event => {
  console.log('SW installing');

  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(animals);
    })
  );
});

self.addEventListener('activate', event => {
  console.log('SW ready');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('message', event => {
  if (event.data.action === 'changeAnimal') {
    changeImage = true;
  }
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  if (url.pathname.includes('dog.svg') && changeImage) {


    const nextAnimal = animals[currentIndex];

    console.log("Imagen:", nextAnimal);

    currentIndex = (currentIndex + 1) % animals.length;

    changeImage = false;

    event.respondWith(
      caches.match(nextAnimal)
    );

  } else {
    event.respondWith(fetch(event.request));
  }
});