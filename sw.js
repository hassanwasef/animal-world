const CACHE = 'animal-world-v5';
const FILES = [
  '/', '/index.html', '/manifest.json',
  'https://cdn.jsdelivr.net/npm/tone@14.8.49/build/Tone.js',
  '/sounds/bathroom-faucet-1.mp3',
  '/sounds/shower-1.mp3',
  '/sounds/soap-dispenser-1.mp3',
  '/sounds/soap-in-hands-1.mp3',
  '/sounds/drying-hands-1.mp3',
  '/sounds/11325622-child-laughing-sound-effect-240506.mp3',
  '/sounds/freesound_community-child-laughing-90664.mp3',
  '/sounds/sergequadrado-child-ha-ha-103936.mp3',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      const clone = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, clone));
      return res;
    })).catch(() => caches.match('/index.html'))
  );
});
