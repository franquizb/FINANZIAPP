// Horas de publicación que no parezcan de máquina: nunca en punto ni a y media, y distintas cada día.
// Instagram pidió al propietario dos veces la prueba de «no soy un robot» (11 nov 2026) cuando todo salía a las
// 7:30, 13:00, 17:30 y 20:30 exactas, cuatro veces al día y a la vez en Instagram y en Facebook.

const MIN = 60e3;
const entero = (a, b) => a + Math.floor(Math.random() * (b - a + 1));

// Mueve una hora dentro de una ventana alrededor de la franja (por defecto de 8 minutos antes a 38 después) y la deja en
// un minuto que no sea múltiplo de 5, con segundos sueltos.
function alAzar(fecha, { antes = 8, despues = 38 } = {}) {
  const base = new Date(fecha).getTime();
  let t;
  do { t = base + entero(-antes, despues) * MIN; } while (new Date(t).getUTCMinutes() % 5 === 0);
  return new Date(t + entero(3, 56) * 1000);
}

// La hora de Facebook: unos minutos después de la de Instagram (nunca las dos a la vez), tampoco en múltiplo de 5.
function despuesDe(fecha, { min = 6, max = 23 } = {}) {
  const base = new Date(fecha).getTime();
  let t;
  do { t = base + entero(min, max) * MIN; } while (new Date(t).getUTCMinutes() % 5 === 0);
  return new Date(Math.floor(t / MIN) * MIN + entero(3, 56) * 1000);
}

// Elige n franjas del día al azar (en orden), para que no salgan siempre las mismas.
function elegir(franjas, n) {
  const copia = franjas.slice();
  for (let i = copia.length - 1; i > 0; i--) { const j = entero(0, i); [copia[i], copia[j]] = [copia[j], copia[i]]; }
  return copia.slice(0, Math.max(1, Math.min(n, franjas.length))).sort();
}

const iso = (f) => new Date(f).toISOString().replace(/\.\d{3}Z$/, 'Z');

module.exports = { alAzar, despuesDe, elegir, iso };
