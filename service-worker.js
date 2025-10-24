const CACHE_NAME = 'contaauto-v1';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './contaauto.jpeg',
  './logo_tesla.png',
  './logo_mercedes.png',
  './logo_bmw.png',
  './logo_audi.png',
  './logo_fiat.png',
  './logo_porsche.png',
  './logo_land.png',
  './logo_jeep.png',
  './logo_renault.png',
  './logo_peugeot.png',
  './logo_citroen.png',
  './logo_alfa.png',
  './logo_ferrari.png',
  './logo_jaguar.png',
  './logo_lamborghini.png',
  './logo_maserati.png',
  './logo_mini.png',
  './logo_toyota.png',
  './logo_volvo.png',
  './logo_volkswagen.png',
  './logo_smart.png',
  './logo_ford.png',
  './logo_honda.png',
  './logo_dacia.png',
  './logo_hyundai.png',
  './logo_kia.png',
  './logo_opel.png',
  './logo_skoda.png',
  './logo_suzuki.png',
  './logo_nissan.png',
  './logo_seat.png',
  './logo_lancia.png',
  './logo_byd.png',
  './logo_mg.png',
  './logo_dr.png',
  './logo_altro.png',
  './logo_reset.png'
];

// Installazione del service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aperta');
        return cache.addAll(urlsToCache);
      })
  );
});

// Attivazione e pulizia delle cache vecchie
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Cancellazione cache vecchia:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Gestione delle richieste - strategia Cache First
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - ritorna la risorsa dalla cache
        if (response) {
          return response;
        }

        // Clona la richiesta
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(response => {
          // Controlla se è una risposta valida
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clona la risposta
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
  );
});
