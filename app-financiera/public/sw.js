// Service worker de FinanziApp: permite instalar la app y abrirla sin conexión.
// - Páginas (navegación): primero la red; sin red, la última copia de la app.
// - /static/ (JS y CSS con hash en el nombre, nunca cambian): primero la caché.
// - Iconos y manifiesto: la copia guardada y se actualiza en segundo plano.
// - No intercepta otros dominios (Firebase, Google, Stripe) ni /__/ (ayudantes
//   de inicio de sesión): los datos siempre van directos al servidor.
// Al cambiar este fichero, sube VERSION para limpiar las cachés antiguas.
const VERSION = 'v1';
const CACHE = `finanziapp-${VERSION}`;
const ESENCIALES = ['/', '/manifest.json', '/logo.svg', '/logo192.png', '/logo512.png'];
const MAX_ESTATICOS = 60;

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ESENCIALES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((claves) => Promise.all(claves.filter((k) => k.startsWith('finanziapp-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Guarda una respuesta válida del propio dominio (nunca redirecciones ni errores).
const guardar = async (clave, respuesta) => {
  if (!respuesta || !respuesta.ok || respuesta.type !== 'basic') return;
  const cache = await caches.open(CACHE);
  await cache.put(clave, respuesta);
};

// Los ficheros de /static/ cambian de nombre en cada versión: se borran los más antiguos.
const recortar = async () => {
  const cache = await caches.open(CACHE);
  const estaticos = (await cache.keys()).filter((r) => new URL(r.url).pathname.startsWith('/static/'));
  await Promise.all(estaticos.slice(0, Math.max(0, estaticos.length - MAX_ESTATICOS)).map((r) => cache.delete(r)));
};

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith('/__/')) return;

  // La copia para la caché se saca en el mismo paso que la respuesta, antes de
  // que el navegador la consuma, y el guardado se registra desde el principio.
  const conCopia = (p) => p.then((res) => ({ res, copia: res.clone() }));

  // Navegación: la red manda (y sigue las redirecciones de dominio); sin red,
  // la app guardada. Todas las rutas sirven el mismo index.html.
  if (req.mode === 'navigate') {
    const red = conCopia(fetch(req));
    e.waitUntil(red.then(({ copia }) => guardar('/', copia)).catch(() => {}));
    e.respondWith(red.then(({ res }) => res).catch(() => caches.match('/')));
    return;
  }

  // /static/: si está guardado, no hace falta la red.
  if (url.pathname.startsWith('/static/')) {
    const guardada = caches.match(req);
    const red = guardada.then((g) => (g ? null : conCopia(fetch(req))));
    e.waitUntil(red.then((r) => r && guardar(req, r.copia).then(recortar)).catch(() => {}));
    e.respondWith(guardada.then((g) => g || red.then((r) => r.res)));
    return;
  }

  // Resto (iconos, manifiesto, logo): copia guardada al instante y se renueva.
  const red = conCopia(fetch(req));
  e.waitUntil(red.then(({ copia }) => guardar(req, copia)).catch(() => {}));
  e.respondWith(caches.match(req).then((g) => g || red.then((r) => r.res)));
});
