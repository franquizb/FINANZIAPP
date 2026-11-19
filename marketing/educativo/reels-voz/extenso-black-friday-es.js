// Formato extenso (≈45 s) · @finanziapp.es (España), en 3D (reels-voz/tres.js), píldora «Tus derechos».
// es-black-friday-30-dias · «Antes 199 euros, ahora 99. Pero hace una semana ya estuvo a 99.»
// Guion final y verificado: guiones/2026-11-es-black-friday-30-dias.md (tabla de escenas, cuentas, fuentes, texto y portada).
// Publicación prevista: sábado 21/11 o domingo 22/11/2026 (Madrid). Vale hasta pasado el Cyber Monday (30/11/2026).
//
// Fuentes de cada dato (todas consultadas el 18-nov-2026):
// - La regla: Ley 7/1996, de Ordenación del Comercio Minorista (LORCOM), art. 20.1: «Se entenderá por precio anterior el menor
//   que hubiese sido aplicado sobre productos idénticos en los treinta días precedentes». Art. 20.2 (sin % mínimo o máximo).
//   BOE, texto consolidado. https://www.boe.es/buscar/act.php?id=BOE-A-1996-1072#a20
// - Desde cuándo: Real Decreto-ley 24/2021, art. 85 (nueva redacción del art. 20.1) y disposición final 10.ª c): en vigor el
//   28/05/2022. El preámbulo dice que transpone la Directiva (UE) 2019/2161 («Ómnibus»). https://www.boe.es/buscar/act.php?id=BOE-A-2021-17910
// - «También por internet»: LORCOM, art. 1.2 (venta a destinatarios finales «utilizando o no un establecimiento»).
//   https://www.boe.es/buscar/act.php?id=BOE-A-1996-1072#a1
// - Ministerio de Derechos Sociales, Consumo y Agenda 2030, preguntas frecuentes (Black Friday en tienda online): el precio
//   anterior es «el precio más bajo aplicado al mismo producto durante los 30 días anteriores a la reducción»; se puede
//   reclamar a la tienda y avisar a consumo; no da automáticamente derecho al precio más bajo.
//   https://www.dsca.gob.es/ca/consumo/preguntas-frecuentes/he-comprado-ordenador-black-friday-tienda-online-pero-segun-me-ha
// - Quién sanciona: LORCOM, arts. 63.1 (las comunidades autónomas), 64.d, 64.h y 65.1.i. Sin cifra de multa en el vídeo.
//   https://www.boe.es/buscar/act.php?id=BOE-A-1996-1072#a63
// - Dónde reclamar (ejemplo de una comunidad): Comunidad de Madrid, «Black Friday y Cyber Monday: precaución en sus compras»
//   (act. 03/11/2026). https://www.comunidad.madrid/servicios/consumo/black-friday-ciberlunes-precaucion-compras
// - Reclamar a una tienda online (solo en el texto): Real Decreto Legislativo 1/2007 (TRLGDCU), art. 21.2.
//   https://www.boe.es/buscar/act.php?id=BOE-A-2007-20555#a21
// - Fechas: Black Friday 2026 = viernes 27/11; los 30 días anteriores a una rebaja del 27 van del 28/10 al 26/11; «hace una
//   semana» = 20/11 (calendario, comprobado con cuadra() abajo).
// Los precios del vídeo son EJEMPLOS (rótulo «EJEMPLO» en la etiqueta y en las columnas), no estadística:
// - Ejemplo 1 (gancho): 199 € hasta el 17/11, 99 € del 18 al 20/11, 199 € del 21 al 26/11 y el 27 «antes 199, ahora 99».
// - Ejemplo 2 (pico): 149 € del 28/10 al 13/11, 199 € del 14 al 26/11 y el 27 «antes 199, ahora 99» → «antes» legal 149.
// - La captura del cierre («HOY: 149 €») es otro ejemplo: un precio guardado antes de la rebaja, más bajo que el «antes» del 27.
//
// Respecto al guion: el texto de la voz es el del documento, sin cambios (solo se han añadido marcas § que no se leen).
const { pildora3d } = require('./tres');
const { cuadra } = require('../reels/_comun');

// ——— cuentas (todas las del guion: guiones/2026-11-es-black-friday-30-dias.md, «Cuentas») ———
const DIA_MS = 86400000, f = (s) => Date.UTC(...s.split('-').map((n, i) => i === 1 ? n - 1 : +n));
const iso = (ms) => new Date(ms).toISOString().slice(0, 10);
const jueves = [...Array(30)].map((_, i) => f('2026-11-' + (i + 1))).filter(ms => new Date(ms).getUTCDay() === 4);
cuadra('cuarto jueves de noviembre de 2026', iso(jueves[3]), '2026-11-26');
cuadra('Black Friday 2026 = viernes 27-nov', iso(jueves[3] + DIA_MS), '2026-11-27');
cuadra('27-nov-2026 es viernes', new Date(f('2026-11-27')).getUTCDay(), 5);
const R = f('2026-11-27');
cuadra('primer día de la ventana («desde el 28 de octubre»)', iso(R - 30 * DIA_MS), '2026-10-28');
cuadra('último día de la ventana', iso(R - DIA_MS), '2026-11-26');
cuadra('días de la ventana', (f('2026-11-26') - f('2026-10-28')) / DIA_MS + 1, 30);
cuadra('«hace una semana» = 20-nov', iso(R - 7 * DIA_MS), '2026-11-20');
cuadra('21-nov dentro de la ventana', f('2026-11-21') >= R - 30 * DIA_MS && f('2026-11-21') < R, true);
cuadra('22-nov dentro de la ventana', f('2026-11-22') >= R - 30 * DIA_MS && f('2026-11-22') < R, true);
cuadra('subida que ya no cuenta: el 27-oct o antes', iso(R - 31 * DIA_MS), '2026-10-27');
cuadra('vigente desde 28-may-2022, años hasta este Black Friday', Math.floor((R - f('2022-05-28')) / (365.25 * DIA_MS)), 4);
cuadra('quinto Black Friday con la regla (2022…2026)', 2026 - 2022 + 1, 5);
const pct = (antes, ahora) => (antes - ahora) / antes * 100;
cuadra('rebaja anunciada: 199 → 99 (exacto)', Math.round(pct(199, 99) * 100) / 100, 50.25);
cuadra('«−50 %» de la insignia', Math.round(pct(199, 99)), 50);
cuadra('euros de rebaja anunciada', 199 - 99, 100);
const H1 = [...Array(30)].map((_, i) => (i >= 21 && i <= 23) ? 99 : 199);   // ejemplo 1, del 28-oct (i=0) al 26-nov (i=29)
cuadra('ejemplo 1: el 18-nov es el índice 21', iso(f('2026-10-28') + 21 * DIA_MS), '2026-11-18');
cuadra('ejemplo 1: el 20-nov es el índice 23', iso(f('2026-10-28') + 23 * DIA_MS), '2026-11-20');
cuadra('ejemplo 1: días a 99 € (18–20 nov)', H1.filter(p => p === 99).length, 3);
cuadra('ejemplo 1: días a 199 €', H1.filter(p => p === 199).length, 27);
cuadra('ejemplo 1: el 26-nov estaba a 199 (el 27 es una rebaja nueva)', H1[29], 199);
cuadra('ejemplo 1: hojas 21–26 nov a 199 (las que rebobina el gancho)', H1.slice(24).every(p => p === 199) && H1.slice(24).length, 6);
cuadra('ejemplo 1: «antes» legal = mínimo de 30 días', Math.min(...H1), 99);
cuadra('ejemplo 1: «esa rebaja es de cero»', pct(Math.min(...H1), 99), 0);
cuadra('rebaja continua desde el 20: su ventana empieza el 21-oct', iso(f('2026-11-20') - 30 * DIA_MS), '2026-10-21');
const H2 = [...Array(30)].map((_, i) => i < 17 ? 149 : 199);                // ejemplo 2
cuadra('ejemplo 2: el 14-nov es el índice 17', iso(f('2026-10-28') + 17 * DIA_MS), '2026-11-14');
cuadra('ejemplo 2: días a 149 € (28-oct–13-nov)', H2.filter(p => p === 149).length, 17);
cuadra('ejemplo 2: días a 199 € (14–26 nov)', H2.filter(p => p === 199).length, 13);
cuadra('ejemplo 2: «antes» legal', Math.min(...H2), 149);
cuadra('ejemplo 2: rebaja real, 149 → 99 (redondeada; texto de la publicación)', Math.round(pct(149, 99)), 34);
cuadra('ejemplo 2: rebaja real en euros', 149 - 99, 50);
cuadra('ejemplo 2: la mitad de lo anunciado (50 € de 100)', (149 - 99) / (199 - 99), 0.5);
// Lo que sale en pantalla además de las frases
const DIA = (i) => i < 0 ? { mes: 'MAY 2022', num: 28 } : i < 4 ? { mes: 'OCT', num: 28 + i } : { mes: 'NOV', num: i - 3 };   // igual que en la página
const rotDia = (i) => { const d = new Date(f('2026-10-28') + i * DIA_MS); return { mes: d.getUTCMonth() === 9 ? 'OCT' : 'NOV', num: d.getUTCDate() }; };
cuadra('pantalla: hojas del calendario = fechas reales (28-oct … 27-nov)', [...Array(31)].every((_, i) => JSON.stringify(DIA(i)) === JSON.stringify(rotDia(i))), true);
cuadra('pantalla: «HACE 7 DÍAS» = hoja 20 NOV (índice 23)', DIA(30 - 7).num + ' ' + DIA(30 - 7).mes, '20 NOV');
cuadra('pantalla: la hoja del 20 NOV enseña 99 € (ejemplo 1)', H1[23], 99);
cuadra('pantalla: «REBAJA REAL: 0 %»', Math.round(pct(Math.min(...H1), 99)), 0);
cuadra('pantalla: rebobinado de la escena 5 = 30 hojas (27 NOV → 28 OCT)', 30 - 0, 30);
cuadra('pantalla: «14 NOV: SUBE A 199 €»', DIA(17).num + ' ' + DIA(17).mes + ' ' + H2[17], '14 NOV 199');
cuadra('pantalla: altura de columna ∝ precio (199/99 sin cortar el eje)', Math.round(199 * 0.008 / (99 * 0.008) * 1e6) / 1e6, Math.round(199 / 99 * 1e6) / 1e6);
cuadra('pantalla: captura de ejemplo (149) más baja que el «antes» del 27 (199)', 149 < 199, true);

const TEXTO = `«Antes 199 €, ahora 99 €»… y hace una semana ya estuvo a 99. Esa rebaja es de cero. 🏷️

• En España, el precio anterior que enseña una rebaja tiene que ser el más bajo que esa tienda aplicó al mismo producto en los 30 días previos. Rige desde el 28 de mayo de 2022: este es el quinto Black Friday con esta regla.
• Tiene excepciones. No se aplica a productos que se ponen a la venta por primera vez, ni a los alimentos que se rebajan porque están a punto de caducar. Y si la tienda no enseña ningún «antes», compáralo igual con lo que costaba.
• Los 30 días se cuentan hacia atrás desde que empieza la rebaja. Si una oferta empezó el día 20 y sigue sin cortes, puede seguir enseñando el precio de antes del 20.
• Si el precio estaba a 149 desde finales de octubre y subió a 199 a mediados de noviembre, el «antes» del día 27 sigue siendo 149. Ese «−50 %» es, como mucho, un 34 %.
• Reclamar no te da automáticamente el precio más bajo, pero puedes pedirlo en la reclamación. En una tienda física, pide la hoja de reclamaciones. Si es por internet, usa su servicio de atención al cliente: tiene que darte un número de reclamación y un justificante. Si no se resuelve, acude a la oficina de consumo de tu ayuntamiento o de tu comunidad autónoma.

Para hoy: haz una captura del precio de lo que quieres comprar, con la fecha visible. El 27, compara. Si te anuncian como rebaja nueva un «antes» más alto que el precio de tu captura, ya sabes qué decir.

Guárdalo para el viernes 🔖 y mándaselo a quien está esperando al Black Friday para comprar algo.

¿Qué tienes apuntado para el 27? 👇

Contenido educativo, no es asesoramiento financiero.

Fuentes: Ley 7/1996 de Ordenación del Comercio Minorista, arts. 1, 20, 63, 64 y 65, con la redacción del art. 20.1 dada por el Real Decreto-ley 24/2021 (art. 85 y disposición final 10.ª c: en vigor el 28/05/2022); Real Decreto Legislativo 1/2007, art. 21.2; Ministerio de Derechos Sociales, Consumo y Agenda 2030; Comunidad de Madrid, consumo (03/11/2026). Precios del vídeo: ejemplos. Consultado el 18/11/2026.

#blackfriday #consumo #finanzaspersonales #educacionfinanciera #dinero`;

const GUION = [
  [0, 'Antes 199 euros, §ahora 99. §{pop}Pero hace una semana *ya estuvo a 99*.'],
  [1, 'Esa rebaja es *de cero*, §y en España §{ding}*la ley no lo permite*.'],
  [2, 'Desde 2022, §el «antes» de una rebaja tiene que ser §{caja}*el precio más bajo de los 30 días anteriores*. §También *por internet*.'],
  [3, 'Si te enseñan un «antes» inflado, §pide la *hoja de reclamaciones* §o reclama en *consumo de tu comunidad*.'],
  [4, '¿Y si lo suben a mediados de noviembre §para rebajarlo el Black Friday?'],
  [5, '*No les sirve*: §vale el precio *más bajo*, no el último. §Para una rebaja del 27, §{tic}la ley mira *desde el 28 de octubre*.'],
  [6, 'Haz hoy captura del precio §y compáralo el 27. §El «antes» no lo eligen ellos: §{pop}*es el más bajo de los 30 días anteriores*.']
];

const MONO = `'DejaVu Sans Mono', 'Liberation Mono', monospace`;
const CSS = `
  .hud.i.fmt { letter-spacing: .14em; }
  .rt { position: absolute; left: 50%; top: 1300px; padding: 10px 30px 15px; border-radius: 20px; background: rgba(9,14,27,.9); border: 3px solid #e2e8f0;
    color: #fff; font-size: 62px; line-height: 1.1; font-weight: 900; letter-spacing: -.015em; white-space: nowrap; opacity: 0; font-variant-numeric: tabular-nums;
    text-align: center; box-shadow: 0 10px 40px rgba(0,0,0,.45); }
  .rt.p { font-size: 52px; } .rt.amb { border-color: #f5b94a; } .rt.roja { border-color: #f87171; } .rt.turq { border-color: #5eead4; }
  .rt .a { color: #f5b94a; } .rt .r { color: #f87171; } .rt .t { color: #5eead4; }
  .nota { position: absolute; left: 70px; top: 1452px; max-width: 820px; font: 600 24px/1.32 ${MONO}; color: #b6c2d4; background: rgba(7,11,22,.8);
    border-radius: 10px; padding: 6px 14px; opacity: 0; }
`;

// Mundo 3D propio (se añade al de tres.js): etiqueta colgante con pegatinas de precio, insignia −50 % / 0 %, sello, trozos,
// taco de calendario que rebobina, columnas de 30 días, escáner, corchete, barrera, móvil, hoja de reclamaciones y captura.
// Todo se apaga al principio de cada fotograma (X3.apagar()) para que no se cuele en otra escena.
const SCRIPT = `
function ver(n, s, a, b) { if (!n) return; let p = a < -0.5 ? 1 : rebote(tramo(s, a - 0.1, a + 0.25)); if (b != null) p *= 1 - tramo(s, b - 0.12, b); aparece3(n, p); }
const PI = Math.PI, AMBH = 0xf5b94a, ROJOH = 0xef4444, TURQH = 0x2dd4bf, GRISC = 0xcbd5e1;
const mezcla = (P, Q, u) => P.map((v, j) => v + (Q[j] - v) * u);
const suave = (x) => x * x * (3 - 2 * x);
const angulo = (a, b, g) => a + ((((b - a + PI) % (2 * PI)) + 2 * PI) % (2 * PI) - PI) * g;
// Cámara por fotogramas clave [[t, [px, py, pz, lx, ly, lz]]…] (Hermite: no se para entre medias). De desmentido-en.js.
function ruta(K, x) {
  if (x <= K[0][0]) return K[0][1];
  if (x >= K[K.length - 1][0]) return K[K.length - 1][1];
  let j = 0; while (x > K[j + 1][0]) j++;
  const t0 = K[j][0], P0 = K[j][1], t1 = K[j + 1][0], P1 = K[j + 1][1], dt = t1 - t0, u = (x - t0) / dt;
  const vel = (n) => n === 0 ? K[1][1].map((v, c) => (v - K[0][1][c]) / (K[1][0] - K[0][0])) : n === K.length - 1 ? P0.map(() => 0)
    : K[n + 1][1].map((v, c) => (v - K[n - 1][1][c]) / (K[n + 1][0] - K[n - 1][0]));
  const V0 = vel(j), V1 = vel(j + 1), u2 = u * u, u3 = u2 * u;
  return P0.map((v, c) => (2 * u3 - 3 * u2 + 1) * v + (u3 - 2 * u2 + u) * dt * V0[c] + (-2 * u3 + 3 * u2) * P1[c] + (u3 - u2) * dt * V1[c]);
}
// Varias rutas seguidas: cada una acaba parada (sin pasarse tras un latigazo) y la siguiente arranca en ese punto.
function rutas(KK, x) { let K = KK[0]; for (const k of KK) if (x >= k[0][0]) K = k; return ruta(K, x); }
// Órbita: gira la posición de la cámara «ang» radianes alrededor del eje vertical que pasa por el punto al que mira.
function orbita(C, ang) { const dx = C[0] - C[3], dz = C[2] - C[5], c = Math.cos(ang), s_ = Math.sin(ang); return [C[3] + dx * c + dz * s_, C[1], C[5] - dx * s_ + dz * c, C[3], C[4], C[5]]; }
// Paso suave (empieza y acaba parado) de la cámara A a la B entre a y b; fuera de ese tramo, null.
function paso(A, B, s, a, b) { return s >= a && s <= b ? mezcla(A, B, suave(tramo(s, a, b))) : null; }
// Cámara con giro (roll) alrededor de la mirada.
function camR(W, C, roll) { const r = roll || 0; W.cam.up.set(Math.sin(r), Math.cos(r), 0); W.camara(C[0], C[1], C[2], C[3], C[4], C[5]); }
// Días del calendario: 0 = 28 OCT … 30 = 27 NOV (Black Friday); −1 = 28 MAY 2022 (entrada en vigor de la regla).
const DIA = (i) => i < 0 ? { mes: 'MAY 2022', num: 28 } : i < 4 ? { mes: 'OCT', num: 28 + i } : { mes: 'NOV', num: i - 3 };
// Fila de 30 columnas (una por día, del 28 OCT al 26 NOV): altura ∝ precio, sin cortar el eje.
const FILA = { x0: -2.61, paso: 0.18, w: 0.13, k: 0.008 };
const xCol = (i) => FILA.x0 + FILA.paso * i;
const hCol = (p) => p * FILA.k;
// Brazos y manos de un maniquí (de extenso-loteria-es.js). qa: 0 = como andar(), 1 = pose; qp: 0 = brazos arriba, 1 = al pecho.
function brazos(a, qa, qp) {
  const ax = -2.75 * (1 - qp) - 0.95 * qp, az = -0.1 * (1 - qp) - 0.2 * qp, cx = -0.15 * (1 - qp) - 1.15 * qp;
  [[a.izq, -1], [a.der, 1]].forEach(([b, sg]) => {
    b.hombro.rotation.x = lerp(b.hombro.rotation.x, ax, qa); b.hombro.rotation.z = lerp(b.hombro.rotation.z, sg * az, qa); b.codo.rotation.x = lerp(b.codo.rotation.x, cx, qa);
  });
}
function manos(hx, hz, g, qp, esc, y) { const ly = (2.2 * (1 - qp) + 1.5 * qp) * (esc || 1.06) / 1.06, lz = (0.3 * (1 - qp) + 0.62 * qp) * (esc || 1.06) / 1.06; return [hx + Math.sin(g) * lz, ly + (y || 0), hz + Math.cos(g) * lz]; }
// Rebobinar el calendario de «desde» a «hasta» (índices de día) desde t0, una hoja cada «per» s: la hoja nueva baja desde arriba.
function rebobina(s, desde, hasta, t0, per) {
  const n = desde - hasta; if (s < t0) return { abajo: desde, hoja: null, a: 0 };
  const k = (s - t0) / per, j = Math.floor(k);
  if (j >= n) { const r = s - t0 - n * per; return r < 0.32 ? { abajo: hasta + 1, hoja: hasta, a: 0.1 * Math.sin(tramo(r, 0, 0.32) * PI) * (1 - tramo(r, 0, 0.32)) } : { abajo: hasta, hoja: null, a: 0 }; }
  return { abajo: desde - j, hoja: desde - j - 1, a: 1 - (k - j) };
}
// Avanzar (la hoja de encima sube y deja ver la siguiente).
function avanza(s, desde, hasta, t0, per) {
  const n = hasta - desde; if (s < t0) return { abajo: desde, hoja: null, a: 0 };
  const k = (s - t0) / per, j = Math.floor(k);
  if (j >= n) return { abajo: hasta, hoja: null, a: 0 };
  return { abajo: desde + j + 1, hoja: desde + j, a: k - j };
}

const X3 = (() => {
  const W = W3, T = W.T, S = W.S, objs = [];
  const grupo = () => { const g = new T.Group(); g.visible = false; S.add(g); objs.push(g); return g; };
  const mat = (c, o) => new T.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.55, metalness: 0.08 }, o || {}));
  const pieza = (g, geo, m, x, y, z) => { const o = new T.Mesh(geo, m); o.position.set(x, y, z); o.castShadow = true; o.receiveShadow = true; g.add(o); return o; };
  const lienzo = (w, h, pintar) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); if (pintar) pintar(x, w, h);
    const tx = new T.CanvasTexture(c); tx.encoding = T.sRGBEncoding; tx.anisotropy = 4; return { c, x, tx, clave: null }; };
  const haloTx = lienzo(256, 256, (x) => { const g = x.createRadialGradient(128, 128, 0, 128, 128, 128); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.3, 'rgba(255,255,255,.4)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 256, 256); }).tx;
  const basico = (tx, o) => new T.MeshBasicMaterial(Object.assign({ map: tx, toneMapped: false, transparent: true }, o || {}));

  // ——— etiqueta colgante (1,6 × 1,0 m) de un cordel; origen del grupo = punto del que cuelga ———
  const LC = 0.45, TW = 1.6, TH = 1.0, SX = 0.3, SY = 0.131, SW = 0.86, SH = 0.27;
  const etiG = grupo(), cara = new T.Group(); cara.position.set(0, -LC - TH / 2, 0); etiG.add(cara);
  const etiTx = lienzo(1024, 640, (x, w, h) => {
    x.fillStyle = '#f1f5f9'; x.fillRect(0, 0, w, h); x.strokeStyle = '#cbd5e1'; x.lineWidth = 10; x.strokeRect(5, 5, w - 10, h - 10);
    x.fillStyle = '#334155'; x.beginPath(); x.arc(512, 77, 28, 0, 2 * PI); x.fill();
    x.fillStyle = '#94a3b8'; x.font = '700 30px DejaVu Sans Mono, monospace'; x.textAlign = 'left'; x.textBaseline = 'middle'; x.fillText('EJEMPLO', 46, 62);
    x.fillStyle = '#475569'; x.font = '800 70px Inter, sans-serif'; x.fillText('ANTES', 46, 238);
    x.fillStyle = '#cbd5e1'; x.fillRect(46, 366, 932, 6);
    x.fillStyle = '#475569'; x.fillText('AHORA', 46, 502);
    x.fillStyle = '#0f172a'; x.font = '900 176px Inter, sans-serif'; x.textAlign = 'center'; x.fillText('99 €', 704, 508);
  }).tx;
  const mPapel = mat(0xdfe5ec, { roughness: 0.75 });
  const tagM = new T.Mesh(new T.BoxGeometry(TW, TH, 0.04), [mPapel, mPapel, mPapel, mPapel, new T.MeshBasicMaterial({ map: etiTx, toneMapped: false }), mPapel]);
  tagM.castShadow = true; cara.add(tagM);
  pieza(etiG, new T.CylinderGeometry(0.011, 0.011, LC + 0.12, 8), mat(0x94a3b8), 0, -(LC + 0.12) / 2, 0);
  // Pegatinas del precio «antes»: roja 199 €, ámbar 99 € y ámbar 149 €.
  function pintaPeg(txt, bg, fg) { return lienzo(640, 200, (x, w, h) => { x.fillStyle = bg; x.beginPath(); x.roundRect(6, 6, w - 12, h - 12, 34); x.fill();
    x.strokeStyle = 'rgba(255,255,255,.85)'; x.lineWidth = 8; x.beginPath(); x.roundRect(22, 22, w - 44, h - 44, 24); x.stroke();
    x.fillStyle = fg; x.font = '900 150px Inter, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(txt, w / 2, h / 2 + 8); }).tx; }
  const PEG = { r199: pintaPeg('199 €', '#ef4444', '#ffffff'), a99: pintaPeg('99 €', '#f5b94a', '#1a1205'), a149: pintaPeg('149 €', '#f5b94a', '#1a1205') };
  const geoPeg = new T.PlaneGeometry(SW, SH), pegs = {};
  ['a99', 'a149', 'r199'].forEach((k, j) => { const m = new T.Mesh(geoPeg, basico(PEG[k])); m.position.set(SX, SY, 0.023 + 0.003 * j); cara.add(m); pegs[k] = m; });
  // Grietas sobre la pegatina roja (desde el punto del golpe).
  const geoGr = new T.BoxGeometry(1, 0.016, 0.004); geoGr.translate(0.5, 0, 0);
  // Cada grieta son dos tramos con un quiebro: [ángulo 1, largo 1, ángulo 2, largo 2].
  const GR0 = [[0.15, 0.22, 0.55, 0.26], [0.85, 0.14, 0.4, 0.16], [2.3, 0.2, 2.75, 0.22], [3.0, 0.16, 3.5, 0.2], [3.95, 0.12, 4.4, 0.16], [5.35, 0.18, 4.95, 0.2]];
  const GR = [], mGr = new T.MeshBasicMaterial({ color: 0xfff1f2, toneMapped: false }), G0x = SX - 0.05, G0y = SY + 0.01;
  GR0.forEach(([a1, l1, a2, l2]) => { GR.push([a1, l1, G0x, G0y]); GR.push([a2, l2, G0x + Math.cos(a1) * l1, G0y + Math.sin(a1) * l1, l1]); });
  const grietas = GR.map(([a, l, x, y]) => { const g = new T.Mesh(geoGr, mGr); g.position.set(x, y, 0.034); g.rotation.z = a; cara.add(g); return g; });
  // Insignia: −50 % (roja) por delante y 0 % (ámbar) por detrás.
  const pintaIns = (txt, bg, fg, fs) => lienzo(256, 256, (x) => { x.fillStyle = bg; x.beginPath(); x.arc(128, 128, 124, 0, 2 * PI); x.fill();
    x.strokeStyle = 'rgba(255,255,255,.9)'; x.lineWidth = 8; x.beginPath(); x.arc(128, 128, 108, 0, 2 * PI); x.stroke();
    x.fillStyle = fg; x.font = '900 ' + fs + 'px Inter, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(txt, 128, 134); }).tx;
  // Dentro del ancho de la etiqueta (antes sobresalía por la derecha y salía cortada en los primeros planos del gancho).
  const IX = 0.6, IY = 0.44, IR = 0.2;
  const insG = new T.Group(); insG.position.set(IX, IY, 0.04); cara.add(insG);
  const insF = new T.Mesh(new T.CircleGeometry(IR, 44), basico(pintaIns('−50 %', '#ef4444', '#ffffff', 64))); insF.position.z = 0.007; insG.add(insF);
  const insB = new T.Mesh(new T.CircleGeometry(IR, 44), basico(pintaIns('0 %', '#f5b94a', '#1a1205', 92))); insB.position.z = -0.007; insB.rotation.y = PI; insG.add(insB);
  const insC = new T.Mesh(new T.CylinderGeometry(IR, IR, 0.012, 44, 1, true), mat(0x7f1d1d)); insC.rotation.x = PI / 2; insG.add(insC);
  // o = { x, y, z, rx, ry, rz, esc, peg: { r199, a99, a149 } (opacidad), pegEsc: { … }, grietas (0..1), ins (ángulo), insOp, insEsc }
  function etiqueta(o) {
    etiG.visible = true; etiG.position.set(o.x, o.y, o.z); etiG.rotation.set(o.rx || 0, o.ry || 0, o.rz || 0); etiG.scale.setScalar(Math.max(0.001, o.esc == null ? 1 : o.esc));
    const pg = o.peg || {}, pe = o.pegEsc || {};
    for (const k in pegs) { const m = pegs[k], op = pg[k] || 0, e = pe[k] || 1; m.visible = op > 0.01; m.material.opacity = Math.min(1, op); m.scale.set(e, e, 1); }
    grietas.forEach((g, j) => { const q = o.grietas || 0, d = GR[j], qq = d.length > 4 ? Math.max(0, (q - 0.45) / 0.55) : Math.min(1, q / 0.45);
      g.visible = qq > 0.01; g.scale.x = Math.max(0.001, qq * d[1]); g.scale.y = 0.8 + 0.9 * q; });
    const io = o.insOp == null ? 1 : o.insOp; insG.visible = io > 0.01; insG.rotation.y = o.ins || 0; insG.scale.setScalar(Math.max(0.001, (o.insEsc || 1) * Math.min(1, io * 1.4)));
    [insF, insB].forEach(m => { m.material.opacity = Math.min(1, io); });
  }
  function ptEti(lx, ly, lz) { etiG.updateMatrixWorld(true); return cara.localToWorld(new T.Vector3(lx, ly, lz)); }
  // Trozos de la pegatina roja (4 × 2), cada uno con su parte de la textura.
  const trozos = [], casaT = [];
  for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) {
    const g = new T.PlaneGeometry(SW / 4, SH / 2), uv = g.attributes.uv;
    for (let k = 0; k < uv.count; k++) uv.setXY(k, (c + uv.getX(k)) / 4, (uv.getY(k) + 1 - r) / 2);
    const m = new T.Mesh(g, basico(PEG.r199, { side: T.DoubleSide })); m.castShadow = true; m.visible = false; S.add(m); trozos.push(m);
    casaT.push([SX - SW / 2 + SW / 8 + c * SW / 4, SY + SH / 4 - r * SH / 2]);
  }
  function trozo(i, o) { const m = trozos[i], op = o.op == null ? 1 : o.op; m.visible = op > 0.01; if (!m.visible) return; m.position.set(o.x, o.y, o.z); m.rotation.set(o.rx || 0, o.ry || 0, o.rz || 0); m.scale.setScalar(o.esc || 1); m.material.opacity = op; }
  const casasTrozos = () => casaT.map(([lx, ly]) => ptEti(lx, ly, 0.035));
  // Pegatinas sueltas que vuelan (mismo tamaño que en la etiqueta con esc 1).
  const pegV = Array.from({ length: 4 }, () => { const m = new T.Mesh(geoPeg, basico(PEG.a99, { side: T.DoubleSide })); m.visible = false; m.castShadow = true; S.add(m); return m; });
  function pegVuela(i, tipo, o) { const m = pegV[i], op = o.op == null ? 1 : o.op; m.visible = op > 0.01; if (!m.visible) return;
    if (m.material.map !== PEG[tipo]) { m.material.map = PEG[tipo]; m.material.needsUpdate = true; }
    m.position.set(o.x, o.y, o.z); m.rotation.set(o.rx || 0, o.ry || 0, o.rz || 0); m.scale.setScalar(Math.max(0.001, o.esc || 1)); m.material.opacity = op; }

  // ——— sello ámbar «99 €» (moneda gruesa con la cara hacia la cámara) ———
  const selG = grupo();
  const selC = pieza(selG, new T.CylinderGeometry(0.25, 0.25, 0.09, 44), mat(0xd99a2b, { metalness: 0.35, roughness: 0.35, emissive: 0x5a3a08, emissiveIntensity: 0.6 }), 0, 0, 0); selC.rotation.x = PI / 2;
  const selTx = lienzo(256, 256, (x) => { x.fillStyle = '#f5b94a'; x.beginPath(); x.arc(128, 128, 126, 0, 2 * PI); x.fill(); x.strokeStyle = '#1a1205'; x.lineWidth = 7; x.beginPath(); x.arc(128, 128, 110, 0, 2 * PI); x.stroke();
    x.fillStyle = '#1a1205'; x.font = '900 92px Inter, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('99 €', 128, 134); }).tx;
  const selF = new T.Mesh(new T.CircleGeometry(0.245, 44), basico(selTx, { transparent: false })); selF.position.z = 0.047; selG.add(selF);
  function sello(o) { selG.visible = true; selG.position.set(o.x, o.y, o.z); selG.rotation.set(o.rx || 0, o.ry || 0, o.rz || 0); selG.scale.set(1, 1, Math.max(0.05, o.sz || 1)); }

  // ——— taco de calendario: barra arriba, dos anillas, bloque de papel, hoja fija y hoja que gira por el borde de arriba ———
  const calG = grupo();
  pieza(calG, new T.BoxGeometry(1.18, 0.2, 0.32), mat(0x1f2937, { roughness: 0.5 }), 0, 0.1, -0.06);
  [-0.3, 0.3].forEach(x => { const r = pieza(calG, new T.TorusGeometry(0.075, 0.018, 8, 22), mat(0xaab4c3, { metalness: 0.6, roughness: 0.3 }), x, 0.0, 0.02); r.rotation.y = PI / 2; });
  pieza(calG, new T.BoxGeometry(1.0, 1.15, 0.07), mat(0xd5dbe3), 0, -0.575, -0.045);
  const geoHoja = new T.PlaneGeometry(1.0, 1.15); geoHoja.translate(0, -0.575, 0);
  const hojaFija = new T.Mesh(geoHoja, new T.MeshBasicMaterial({ toneMapped: false })); hojaFija.position.z = -0.008; calG.add(hojaFija);
  const piv = new T.Group(); piv.position.z = 0.004; calG.add(piv);
  const hojaVuela = new T.Mesh(geoHoja, new T.MeshBasicMaterial({ toneMapped: false })); piv.add(hojaVuela);
  const dorso = new T.Mesh(geoHoja, mat(0xcfd6df)); dorso.rotation.y = PI; piv.add(dorso);
  const calHalo = new T.Sprite(new T.SpriteMaterial({ map: haloTx, color: 0xffc35a, blending: T.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0 }));
  calHalo.position.set(0, -0.55, -0.25); calHalo.scale.setScalar(2.4); calG.add(calHalo);
  const TXH = {};
  function precioHoja(i, ej) {
    if (i < 0) return null;
    if (i === 30) return { t: '−50 %', bg: '#ef4444', fg: '#ffffff' };
    const p = ej === 2 ? D.H2[i] : D.H1[i];
    if (ej === 2) return i === 0 ? { t: '149 €', bg: '#f5b94a', fg: '#1a1205' } : p === 199 ? { t: '199 €', bg: '#ef4444', fg: '#ffffff' } : { t: '149 €', fg: '#64748b' };
    return p === 99 ? { t: '99 €', bg: '#f5b94a', fg: '#1a1205' } : { t: '199 €', fg: '#64748b' };
  }
  function texHoja(m, i, ej, sin) {
    const k = i + '|' + ej + '|' + (sin ? 0 : 1); let tx = TXH[k];
    if (!tx) tx = TXH[k] = lienzo(512, 590, (x, w, h) => {
      const d = DIA(i); x.fillStyle = '#f8fafc'; x.fillRect(0, 0, w, h);
      x.fillStyle = i < 0 ? '#0f766e' : '#dc2626'; x.fillRect(0, 0, w, 118);
      x.fillStyle = '#ffffff'; x.font = '800 66px DejaVu Sans Mono, monospace'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(d.mes, w / 2, 62);
      x.fillStyle = '#0f172a'; x.font = '900 268px Inter, sans-serif'; x.fillText(String(d.num), w / 2, 300);
      const p = sin ? null : precioHoja(i, ej);
      if (p) { if (p.bg) { x.fillStyle = p.bg; x.beginPath(); x.roundRect(86, 448, 340, 112, 26); x.fill(); } x.fillStyle = p.fg; x.font = '900 96px Inter, sans-serif'; x.fillText(p.t, w / 2, 508); }
    }).tx;
    if (m.material.map !== tx) { m.material.map = tx; m.material.needsUpdate = true; }
  }
  // o = { x, y, z, ry, esc, abajo, hoja, a (1 = arriba, 0 = posada), ej, sinPrecio, halo, haloColor }
  function calendario(o) {
    calG.visible = true; calG.position.set(o.x, o.y, o.z); calG.rotation.set(0, o.ry || 0, 0); calG.scale.setScalar(o.esc || 1);
    texHoja(hojaFija, o.abajo, o.ej || 1, o.sinPrecio && o.hoja == null);
    const v = o.hoja != null; hojaVuela.visible = dorso.visible = v;
    if (v) { texHoja(hojaVuela, o.hoja, o.ej || 1, o.sinPrecio); piv.rotation.x = -PI * o.a; }
    calHalo.material.opacity = o.halo || 0; calHalo.material.color.set(o.haloColor || 0xffc35a);
  }

  // ——— columnas de los 30 días (y una más para el cierre) ———
  const geoCol = new T.BoxGeometry(1, 1, 1); geoCol.translate(0, 0.5, 0);
  const cols = Array.from({ length: 31 }, () => { const m = new T.Mesh(geoCol, mat(GRISC, { roughness: 0.5, transparent: true })); m.castShadow = true; m.receiveShadow = true; m.visible = false; S.add(m); return m; });
  function columna(i, o) { const m = cols[i], op = o.op == null ? 1 : o.op; m.visible = op > 0.01 && o.h > 0.003; if (!m.visible) return;
    m.position.set(o.x, o.y || 0, o.z); m.scale.set(o.w || FILA.w, o.h, o.w || FILA.w);
    const c = m.material.color.copy(W.color(o.color == null ? GRISC : o.color)); if (o.color2 != null) c.lerp(W.color(o.color2), o.cq || 0);
    m.material.emissive.copy(c).multiplyScalar(o.brillo == null ? 0.06 : o.brillo); m.material.opacity = op; m.material.depthWrite = op > 0.99; }

  // ——— escáner turquesa (lámina vertical que recorre la fila) ———
  const escG = grupo();
  const mEsc = new T.MeshBasicMaterial({ color: 0x5eead4, transparent: true, opacity: 0.22, depthWrite: false, side: T.DoubleSide, blending: T.AdditiveBlending });
  const escL = new T.Mesh(new T.PlaneGeometry(0.9, 2.4), mEsc); escL.rotation.y = PI / 2; escL.position.y = 1.2; escG.add(escL);
  const escN = pieza(escG, new T.BoxGeometry(0.035, 2.4, 0.035), new T.MeshBasicMaterial({ color: 0x99f6e4, toneMapped: false }), 0, 1.2, 0.45);
  function escaner(o) { escG.visible = true; escG.position.set(o.x, 0, o.z); escG.scale.set(1, o.h || 1, o.d || 1); mEsc.opacity = 0.22 * (o.op == null ? 1 : o.op); }

  // ——— corchete turquesa de la ventana de 30 días ———
  const corG = grupo(), mCor = mat(TURQH, { emissive: TURQH, emissiveIntensity: 0.7 });
  const corH = pieza(corG, new T.BoxGeometry(1, 0.05, 0.05), mCor, 0, 0, 0), corA = pieza(corG, new T.BoxGeometry(0.05, 0.3, 0.05), mCor, 0, -0.15, 0), corB = pieza(corG, new T.BoxGeometry(0.05, 0.3, 0.05), mCor, 0, -0.15, 0);
  function corchete(o) { corG.visible = true; corG.position.set(0, o.y, o.z); const xm = (o.x0 + o.x1) / 2, L = Math.max(0.001, (o.x1 - o.x0) * o.abre);
    corH.position.x = xm; corH.scale.x = L; corA.position.x = xm - L / 2; corB.position.x = xm + L / 2; corA.visible = corB.visible = o.abre > 0.05; }

  // ——— barrera turquesa (la ley) ———
  const barG = grupo();
  const mBar = new T.MeshBasicMaterial({ color: 0x2dd4bf, transparent: true, opacity: 0.2, depthWrite: false, side: T.DoubleSide });
  pieza(barG, new T.PlaneGeometry(2.1, 1.7), mBar, 0, 0, 0).castShadow = false;
  const mBarB = mat(TURQH, { emissive: TURQH, emissiveIntensity: 0.8 });
  [[0, 0.85, 2.14, 0.05], [0, -0.85, 2.14, 0.05], [-1.05, 0, 0.05, 1.74], [1.05, 0, 0.05, 1.74]].forEach(([x, y, w, h]) => pieza(barG, new T.BoxGeometry(w, h, 0.05), mBarB, x, y, 0));
  function barrera(o) { barG.visible = true; barG.position.set(o.x, o.y, o.z); barG.rotation.set(0, o.ry || 0, 0); mBar.opacity = 0.2 + 0.25 * (o.flash || 0); }

  // ——— móvil genérico (sin marcas) con la pantalla dibujada en un lienzo ———
  const movG = grupo();
  pieza(movG, new T.BoxGeometry(0.36, 0.7, 0.035), mat(0x0f172a, { roughness: 0.35, metalness: 0.3 }), 0, 0, 0);
  const pan = lienzo(360, 700); const panM = new T.Mesh(new T.PlaneGeometry(0.33, 0.64), new T.MeshBasicMaterial({ map: pan.tx, toneMapped: false })); panM.position.z = 0.0185; movG.add(panM);
  function pintaPantalla(p) {
    const u = Math.round((p.u || 0) * 40) / 40, cl = (p.tipo || 'nada') + '|' + u + '|' + Math.round((p.eti == null ? 1 : p.eti) * 20);
    if (cl === pan.clave) return; pan.clave = cl;
    const x = pan.x, w = 360, h = 700;
    x.fillStyle = '#0b1222'; x.fillRect(0, 0, w, h); x.fillStyle = '#1e293b'; x.fillRect(0, 0, w, 54); x.fillStyle = '#475569'; x.beginPath(); x.roundRect(30, 16, 300, 22, 11); x.fill();
    if (p.tipo === 'vivo' || p.tipo === 'captura') {
      if (p.tipo === 'captura') { x.fillStyle = '#2dd4bf'; x.beginPath(); x.roundRect(110, 90, 140, 58, 29); x.fill(); x.fillStyle = '#06121a'; x.font = '900 38px Inter, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('HOY', 180, 120); }
      x.fillStyle = '#f1f5f9'; x.beginPath(); x.roundRect(36, 200, 288, 280, 20); x.fill();
      x.fillStyle = '#475569'; x.font = '800 34px Inter, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('PRECIO', 180, 255);
      x.fillStyle = '#0f172a'; x.font = '900 104px Inter, sans-serif'; x.fillText('149 €', 180, 365);
      x.fillStyle = '#94a3b8'; x.font = '700 24px DejaVu Sans Mono, monospace'; x.fillText('EJEMPLO', 180, 445);
      if (p.tipo === 'vivo') { x.strokeStyle = 'rgba(255,255,255,.7)'; x.lineWidth = 5; [[30, 170, 1, 1], [330, 170, -1, 1], [30, 510, 1, -1], [330, 510, -1, -1]].forEach(([a, b, sx, sy]) => { x.beginPath(); x.moveTo(a, b + sy * 40); x.lineTo(a, b); x.lineTo(a + sx * 40, b); x.stroke(); }); }
    }
    if (p.tipo === 'escaneo') {
      x.globalAlpha = p.eti == null ? 1 : p.eti; x.fillStyle = '#f1f5f9'; x.beginPath(); x.roundRect(28, 84, 304, 196, 18); x.fill();
      x.fillStyle = '#475569'; x.font = '800 30px Inter, sans-serif'; x.textAlign = 'left'; x.textBaseline = 'middle'; x.fillText('ANTES', 46, 134); x.fillText('AHORA', 46, 228);
      x.fillStyle = '#f5b94a'; x.beginPath(); x.roundRect(162, 102, 154, 62, 12); x.fill(); x.fillStyle = '#1a1205'; x.font = '900 44px Inter, sans-serif'; x.textAlign = 'center'; x.fillText('99 €', 239, 135);
      x.fillStyle = '#0f172a'; x.fillText('99 €', 239, 230); x.globalAlpha = 1;
      const base = 640;
      for (let i = 0; i < 30; i++) { const pr = D.H1[i], hh = pr * 1.15, xx = 30 + i * 10, pasado = (i + 0.5) / 30 <= u;
        x.fillStyle = pasado && pr === 99 ? '#f5b94a' : pasado ? '#94a3b8' : '#475569'; x.fillRect(xx, base - hh, 8, hh); }
      if (u > 0 && u < 1) { const sx = 30 + u * 300; x.fillStyle = 'rgba(94,234,212,.25)'; x.fillRect(sx - 12, 360, 24, 290); x.fillStyle = '#99f6e4'; x.fillRect(sx - 2, 360, 4, 290); }
    }
    pan.tx.needsUpdate = true;
  }
  function movil(o) { movG.visible = true; movG.position.set(o.x, o.y, o.z); movG.rotation.set(o.rx || 0, o.ry || 0, o.rz || 0); movG.scale.setScalar(Math.max(0.001, o.esc || 1)); pintaPantalla(o.pant || {}); }

  // ——— hoja de reclamaciones y captura (planos con textura) ———
  const recTx = lienzo(310, 430, (x, w, h) => { x.fillStyle = '#ffffff'; x.fillRect(0, 0, w, h); x.strokeStyle = '#2dd4bf'; x.lineWidth = 14; x.strokeRect(7, 7, w - 14, h - 14);
    x.fillStyle = '#0f172a'; x.font = '900 36px Inter, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('HOJA DE', w / 2, 62); x.font = '900 30px Inter, sans-serif'; x.fillText('RECLAMACIONES', w / 2, 102);
    x.fillStyle = '#cbd5e1'; for (let k = 0; k < 7; k++) x.fillRect(36, 150 + k * 36, w - 72, 6); }).tx;
  const recM = new T.Group(); recM.visible = false; S.add(recM);
  const recF = new T.Mesh(new T.PlaneGeometry(0.62, 0.86), basico(recTx, { transparent: false })); recF.castShadow = true; recM.add(recF);
  const recB = new T.Mesh(new T.PlaneGeometry(0.62, 0.86), basico(lienzo(62, 86, (x, w, h) => { x.fillStyle = '#e2e8f0'; x.fillRect(0, 0, w, h); x.strokeStyle = '#2dd4bf'; x.lineWidth = 4; x.strokeRect(2, 2, w - 4, h - 4); }).tx, { transparent: false }));
  recB.rotation.y = PI; recM.add(recB);
  function hojaRec(o) { recM.visible = true; recM.position.set(o.x, o.y, o.z); recM.rotation.set(o.rx || 0, o.ry || 0, o.rz || 0); recM.scale.setScalar(Math.max(0.001, o.esc || 1)); }
  const capTx = lienzo(372, 660, (x, w, h) => { x.fillStyle = '#0b1222'; x.fillRect(0, 0, w, h); x.strokeStyle = '#2dd4bf'; x.lineWidth = 12; x.strokeRect(6, 6, w - 12, h - 12);
    x.fillStyle = '#2dd4bf'; x.beginPath(); x.roundRect(96, 44, 180, 70, 35); x.fill(); x.fillStyle = '#06121a'; x.font = '900 46px Inter, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('HOY', w / 2, 81);
    x.fillStyle = '#f1f5f9'; x.beginPath(); x.roundRect(34, 170, 304, 300, 20); x.fill();
    x.fillStyle = '#475569'; x.font = '800 36px Inter, sans-serif'; x.fillText('PRECIO', w / 2, 230); x.fillStyle = '#0f172a'; x.font = '900 112px Inter, sans-serif'; x.fillText('149 €', w / 2, 345);
    x.fillStyle = '#94a3b8'; x.font = '700 26px DejaVu Sans Mono, monospace'; x.fillText('EJEMPLO', w / 2, 430);
    x.fillStyle = '#64748b'; x.font = '700 30px DejaVu Sans Mono, monospace'; x.fillText('CAPTURA', w / 2, 560); }).tx;
  const capM = new T.Mesh(new T.PlaneGeometry(0.62, 1.1), basico(capTx, { transparent: false })); capM.castShadow = true; capM.visible = false; S.add(capM);
  function captura(o) { capM.visible = true; capM.position.set(o.x, o.y, o.z); capM.rotation.set(o.rx || 0, o.ry || 0, o.rz || 0); capM.scale.setScalar(Math.max(0.001, o.esc || 1)); }

  // ——— línea ámbar entre dos puntos ———
  const geoLin = new T.CylinderGeometry(0.022, 0.022, 1, 10); geoLin.rotateX(PI / 2);
  const linM = new T.Mesh(geoLin, mat(AMBH, { emissive: AMBH, emissiveIntensity: 0.9 })); linM.visible = false; S.add(linM);
  function linea(A, B, u) { const P = mezcla(A, B, u); const L = Math.hypot(P[0] - A[0], P[1] - A[1], P[2] - A[2]); linM.visible = L > 0.01; if (!linM.visible) return;
    linM.position.set((A[0] + P[0]) / 2, (A[1] + P[1]) / 2, (A[2] + P[2]) / 2); linM.lookAt(P[0], P[1], P[2]); linM.scale.set(1, 1, L); }

  // ——— halos (destellos) ———
  const halos = Array.from({ length: 6 }, () => { const s = new T.Sprite(new T.SpriteMaterial({ map: haloTx, color: 0xffd166, blending: T.AdditiveBlending, depthWrite: false, transparent: true })); s.visible = false; S.add(s); return s; });
  function halo(i, o) { const s = halos[i]; s.visible = (o.op || 0) > 0.01; s.position.set(o.x, o.y, o.z); s.scale.setScalar(o.esc || 1); s.material.opacity = Math.min(1, o.op || 0); s.material.color.set(o.color || 0xffd166); }

  function apagar() { objs.forEach(g => { g.visible = false; }); [trozos, pegV, cols, halos].forEach(a => a.forEach(m => { m.visible = false; })); recM.visible = capM.visible = linM.visible = false; }
  return { etiqueta, ptEti, casasTrozos, trozo, pegVuela, sello, calendario, columna, escaner, corchete, barrera, movil, hojaRec, captura, linea, halo, apagar,
    SX, SY, SW, SH, LC, TH, IX, IY };
})();
W3.X = X3;

// ——— el gancho (escena 0) y la cola del bucle. tau = tiempo de la escena 0 (negativo en la cola: la etiqueta viene de más arriba) ———
// Etiqueta colgada en (PX, PY, PZ); calendario con la barra en (CX, CY, CZ); maniquí en (HX, HZ); fila de columnas en z = FZ.
// T20: la hoja del 20 NOV aterriza (rebobinado 26→21 a 0,045 s por hoja) y la cámara se queda frenando en ella hasta 0,54 s.
const G0 = { PX: 0.5, PY: 3.15, PZ: 0, CX: -1.05, CY: 2.95, CZ: -0.45, CE: 0.9, HX: 1.55, HZ: 1.25, TI: 0.7, TR: 1.5, TF: 2.0, FZ: -2.8, T20: -0.02 + 7 * 0.045 };
function etiGancho(tau) {
  const u = tramo(tau, -0.8, 0.5), e_ = 1 - (1 - u) * (1 - u), tt = tau + 0.8;
  const y = G0.PY + 1.4 * (1 - e_) - 0.07 * Math.sin(tramo(tau, 0.5, 0.95) * PI);
  let rz = 0.2 * Math.exp(-0.8 * tt) * Math.sin(4.2 * tt + 0.5) + 0.025 * Math.sin(1.3 * tau), rx = 0;
  const ry = 0.36 * (1 - suave(tramo(tau, -0.1, 0.65))) + 0.04 * Math.sin(1.1 * tau + 0.4);
  const ti = tau - G0.TI;
  if (ti > 0) { rx = -0.3 * Math.exp(-4.5 * ti) * Math.sin(10 * ti); rz += 0.1 * Math.exp(-3 * ti) * Math.sin(8 * ti); }
  // Entre el golpe y la rotura la etiqueta tiembla cada vez más (el 199 está a punto de romperse).
  if (tau > 0.95 && tau < G0.TR) rz += 0.016 * tramo(tau, 0.95, G0.TR) * Math.sin(tau * 61);
  return { x: G0.PX, y, z: G0.PZ, rx, ry, rz };
}
// Trozo i de la pegatina roja: sale de P0 (su sitio en la etiqueta) d s después de romperse; cae girando y se queda en el suelo.
function trozoVuelo(i, P0, d) {
  const c = i % 4, r = Math.floor(i / 4);
  const vx = (c - 1.5) * 1.25 + 0.2 * Math.sin(i * 2.3), vy = 1.1 + 0.7 * (1 - r) + 0.25 * Math.sin(i * 1.7), vz = 1.3 + 0.8 * ((i * 0.618) % 1), g = 9.8;
  const tl = (vy + Math.sqrt(vy * vy + 2 * g * (P0.y - 0.02))) / g;
  if (d < tl) return { x: P0.x + vx * d, y: P0.y + vy * d - 0.5 * g * d * d, z: P0.z + vz * d, rx: d * (6 + i), ry: d * (3 + 0.7 * i), rz: d * (4 + i * 0.5) };
  const r2 = Math.min(1, (d - tl) * 4), sl = 0.12 * (1 - (1 - r2) * (1 - r2));
  return { x: P0.x + vx * (tl + sl), y: 0.02, z: P0.z + vz * (tl + sl), rx: -PI / 2, ry: 0, rz: i * 0.8 };
}
function casasGancho(X) { X.etiqueta(etiGancho(G0.TR)); return X.casasTrozos(); }
function gancho(W, X, tau, m1, r0, Dv) {
  const mP = Math.max(m1, 3.35), tLand = Math.max(r0 + 0.3, mP + 0.7), tFly = tLand - 0.6;
  // —— etiqueta: cae balanceándose; el sello la golpea a TI; la pegatina 199 se raja y se rompe a TR; la insignia gira a TF ——
  const P0s = tau >= G0.TR ? casasGancho(X) : null;
  const st = etiGancho(tau);
  const gr = tau < G0.TI ? 0 : 0.62 * sale(tramo(tau, G0.TI, G0.TI + 0.14)) + 0.38 * tramo(tau, 0.86, G0.TR);
  // El 199 se hincha y tiembla cada vez más hasta reventar en TR.
  const tiembla = tau > 0.9 && tau < G0.TR ? 1 + 0.13 * suave(tramo(tau, 0.9, G0.TR)) + 0.04 * tramo(tau, 0.95, G0.TR) * Math.sin(tau * 53) : 1;
  // La insignia da vuelta y media (−50 % → 0 %) y rebota al quedarse en 0 %.
  const giro = 3 * PI * sale(tramo(tau, G0.TF, G0.TF + 0.6)), insEsc = 1 + 0.22 * Math.sin(tramo(tau, G0.TF + 0.45, G0.TF + 0.8) * PI);
  const a99 = tau < G0.TR ? 0 : tau < tLand ? 0.5 : 1, pop = tau >= tLand ? 1 + 0.2 * Math.sin(tramo(tau, tLand, tLand + 0.3) * PI) : 1;
  const tt = tau + 0.8, wob = 0.5 * Math.exp(-0.7 * tt) * Math.sin(5.2 * tt);
  X.etiqueta(Object.assign({}, st, { peg: { r199: tau < G0.TR ? 1 : 0, a99 }, pegEsc: { a99: pop, r199: tiembla }, grietas: tau < G0.TR ? gr : 0, ins: wob + giro, insEsc }));
  if (P0s) for (let i = 0; i < 8; i++) X.trozo(i, trozoVuelo(i, P0s[i], tau - G0.TR));
  const slot = X.ptEti(X.SX - 0.04, X.SY, 0.07);
  // —— sello: entra en arco desde arriba a la derecha, golpea a TI, se aplasta, rebota y sale del plano ——
  if (tau > 0.36 && tau < 1.4) {
    let p, rz = 0, sz = 1;
    const S0 = [slot.x + 1.3, slot.y + 1.5, slot.z + 1.7], SL = [slot.x, slot.y, slot.z];
    if (tau < G0.TI) { const u = tramo(tau, 0.36, G0.TI); p = mezcla(S0, SL, u * u); p[1] += 0.35 * Math.sin(u * PI); rz = 4 * (1 - u); }
    else if (tau < 0.86) { p = SL; sz = 1 - 0.4 * Math.sin(tramo(tau, G0.TI, 0.86) * PI); }
    else { const u = tramo(tau, 0.86, 1.4); p = mezcla([slot.x, slot.y, slot.z + 0.05], [slot.x + 1.7, slot.y + 1.3, slot.z + 2.3], sale(u)); rz = -3 * u * u; }
    X.sello({ x: p[0], y: p[1], z: p[2], ry: st.ry, rz, sz });
  }
  if (tau > G0.TI && tau < G0.TI + 0.45) { const u = tramo(tau, G0.TI, G0.TI + 0.45); X.halo(0, { x: slot.x, y: slot.y, z: slot.z + 0.05, esc: 0.4 + 2.6 * sale(u), op: 0.95 * (1 - u), color: 0xffc35a }); }
  if (tau > G0.TF + 0.4 && tau < G0.TF + 0.9) { const u = tramo(tau, G0.TF + 0.4, G0.TF + 0.9), b = X.ptEti(X.IX, X.IY, 0.06); X.halo(1, { x: b.x, y: b.y, z: b.z, esc: 0.6 + 1.4 * sale(u), op: 0.8 * (1 - u), color: 0xffc35a }); }
  // —— calendario: rebobina 27 → 20 (aterriza a T20 ≈ 0,3 s y se queda con el halo ámbar), avanza otra vez hasta el 27 y vuelve a
  //    rebobinar hasta el 20 en «Pero» ——
  const tB = mP - 7 * 0.07, tFF1 = Math.min(2.85, tB - 0.03), tFF0 = tFF1 - 7 * 0.055;
  const c = tau < tFF0 ? rebobina(tau, 30, 23, -0.02, 0.045) : tau < tB ? avanza(tau, 23, 30, tFF0, 0.055) : rebobina(tau, 30, 23, tB, 0.07);
  const enVeinte = (tau >= G0.T20 && tau < tFF0) || tau >= mP;
  const hl = enVeinte ? 0.9 * (0.78 + 0.22 * Math.sin(tau * 9)) * (tau >= mP ? tramo(tau, mP, mP + 0.12) : tramo(tau, G0.T20, G0.T20 + 0.08)) : 0;
  X.calendario({ x: G0.CX, y: G0.CY, z: G0.CZ, esc: G0.CE, ej: 1, abajo: c.abajo, hoja: c.hoja, a: c.a, halo: hl, sinPrecio: tau > tFly && c.abajo === 23 && c.hoja == null });
  // —— «ya estuvo a 99»: el 99 € de la hoja del 20 vuela a la línea ANTES de la etiqueta ——
  if (tau > tFly && tau < tLand) {
    const u = tramo(tau, tFly, tLand), e_ = suave(u), A = [G0.CX, G0.CY - 0.99 * G0.CE, G0.CZ + 0.03], B = X.ptEti(X.SX, X.SY, 0.05);
    const p = mezcla(A, [B.x, B.y, B.z], e_); p[1] += 0.45 * Math.sin(u * PI);
    X.pegVuela(0, 'a99', { x: p[0], y: p[1], z: p[2], esc: 0.42 + 0.58 * e_, rz: 0.5 * Math.sin(u * PI), ry: st.ry * e_ });
  }
  // —— maniquí: entra andando por la derecha a 2,1 s y se queda mirando la etiqueta ——
  if (tau > 2.1) { const u = sale(tramo(tau, 2.1, 2.8)), hx = lerp(3.7, G0.HX, u), hz = lerp(2.0, G0.HZ, u);
    const gA = Math.atan2(G0.HX - 3.7, G0.HZ - 2.0), gM = Math.atan2(G0.PX - G0.HX, G0.PZ - G0.HZ);
    W.heroe({ x: hx, z: hz, gira: angulo(gA, gM, suave(tramo(tau, 2.5, 2.9))), amp: 1 - tramo(tau, 2.6, 2.8), fase: tau * 8 }); }
  // —— columnas del ejemplo 1 detrás (27 grises a 199 € y 3 ámbar a 99 €, del 18 al 20 nov) ——
  if (tau > 2.3) for (let i = 0; i < 30; i++) { const tc = 2.35 + 0.012 * i, p = D.H1[i];
    X.columna(i, { x: xCol(i) * 1.15, z: G0.FZ, h: hCol(p) * sale(tramo(tau, tc, tc + 0.35)), color: p === 99 ? AMBH : GRISC, brillo: p === 99 ? 0.35 : 0.06 }); }
  // —— cámara ——
  // Dolly-in que frena en la hoja del 20 (KA), empuje lento mientras brilla el «99 €» (KH) y latigazo a la etiqueta para el sello (KB).
  const C20 = [-0.5, 2.55, 2.45, -1.05, 2.25, -0.45], C20b = [-0.6, 2.5, 2.27, -1.05, 2.22, -0.45];
  const KA = [
    [-0.8, [2.6, 4.9, 8.4, -0.15, 2.9, -0.3]],
    [0.0, [1.0, 3.3, 5.0, -0.02, 2.28, -0.2]],
    [G0.T20, C20]
  ], KH = [[G0.T20, C20], [0.54, C20b]], K = [
    [0.54, C20b],
    [0.70, [0.55, 2.4, 3.75, 0.7, 2.17, 0]],
    [1.10, [1.0, 2.38, 3.62, 0.72, 2.16, 0]],
    [1.50, [1.55, 2.33, 3.38, 0.74, 2.12, 0]],
    [1.85, [1.05, 2.25, 3.95, 0.66, 1.82, 0.2]],
    [2.18, [1.72, 2.45, 3.75, 0.8, 2.15, 0]],
    [2.50, [-0.1, 2.6, 4.0, 0.7, 2.05, 0]],
    [2.95, [-0.6, 4.2, 7.8, 0.6, 1.75, -0.8]],
    [mP - 0.32, [-0.5, 2.55, 2.35, -1.05, 2.25, -0.45]]
  ], K2 = [
    [mP - 0.32, [-0.5, 2.55, 2.35, -1.05, 2.25, -0.45]],
    [mP + 0.45, [-0.75, 2.4, 1.8, -1.05, 2.15, -0.45]],
    [tLand + 0.1, [0.6, 2.45, 3.5, 0.5, 1.95, 0]],
    [Math.max(Dv, tLand + 0.7), [0.95, 2.35, 3.3, 0.5, 1.95, 0]]
  ];
  const C = rutas([KA, KH, K, K2], tau).slice();
  const sh = tau > G0.TI && tau < 1.05 ? 0.07 * Math.exp(-(tau - G0.TI) * 10) : 0;
  C[0] += sh * Math.sin(tau * 83); C[1] += sh * Math.cos(tau * 71);
  camR(W, C, 0.17 * (1 - suave(tramo(tau, -0.2, G0.T20))));
}
const qq = (s, a, d) => sale(tramo(s, a, a + (d || 0.45)));
const blanco = { color: '#f8fafc', cq: 0.4, brillo: 0.05 };

// ——— escena 1 · «Esa rebaja es de cero, §y en España §{ding}la ley no lo permite» ———
// Primer plano de la insignia 0 %; los trozos del 199 suben del suelo y se recomponen delante de la etiqueta; el 199 vuela
// hacia la línea ANTES y en el ding baja una barrera turquesa: rebota y cae.
function esc1(W, X, s, Dv, mk, res) {
  const mA = mk(0, 1.8), mB = mk(1, 2.3), tC = res[0] ? res[0].ini : 1.2;
  const P0s = casasGancho(X);
  const st = { x: G0.PX, y: G0.PY, z: G0.PZ, rx: 0, ry: 0.04 * Math.sin(1.1 * s + 0.4), rz: 0.03 * Math.sin(1.3 * s + 1) };
  X.etiqueta(Object.assign({}, st, { peg: { a99: 1 }, ins: PI + 0.1 * Math.sin(s * 3.2), insEsc: 1 + 0.25 * Math.sin(tramo(s, tC - 0.05, tC + 0.35) * PI) }));
  const slot = X.ptEti(X.SX, X.SY, 0.03), A = [slot.x + 0.8, slot.y + 0.1, slot.z + 1.15], tAs = Math.min(1.3, mB - 0.55);
  if (s < tAs) for (let i = 0; i < 8; i++) {
    const F = trozoVuelo(i, P0s[i], 99), c = i % 4, r = Math.floor(i / 4);
    const Tg = [A[0] - X.SW / 2 + X.SW / 8 + c * X.SW / 4, A[1] + X.SH / 4 - r * X.SH / 2, A[2]];
    const t0 = 0.05 + 0.06 * i, u = tramo(s, t0, Math.min(tAs - 0.02, t0 + 0.75)), e_ = suave(u);
    const p = mezcla([F.x, F.y, F.z], Tg, e_); p[1] += 0.5 * Math.sin(u * PI);
    X.trozo(i, { x: p[0], y: p[1], z: p[2], rx: -PI / 2 * (1 - e_), ry: 2 * PI * e_, rz: F.rz * (1 - e_) });
  } else {
    const tGo = mB - 0.4, zB = 0.62; let p, rx = 0, rz = 0;
    if (s < tGo) p = [A[0], A[1] + 0.05 * Math.sin((s - tAs) * 7), A[2]];
    else if (s < mB) { const u = tramo(s, tGo, mB); p = mezcla(A, [slot.x, slot.y, zB], u * u); }
    else { const d = s - mB, y = slot.y + 1.3 * d - 4.9 * d * d; p = [slot.x + 0.35 * d, Math.max(0.02, y), zB + Math.min(1.1 * d, 0.9)]; rx = y > 0.02 ? -7 * d : -PI / 2; rz = 3 * d; }
    X.pegVuela(0, 'r199', { x: p[0], y: p[1], z: p[2], rx, rz });
  }
  if (s > mB - 0.32) {
    const u = tramo(s, mB - 0.32, mB - 0.04), v = tramo(s, mB - 0.04, mB + 0.35);
    X.barrera({ x: G0.PX, y: 2.2 + 2.8 * Math.pow(1 - u, 2) + 0.07 * Math.sin(v * PI) * (1 - v), z: 0.55, flash: s > mB ? Math.exp(-(s - mB) * 5) : 0 });
  }
  if (s > mB && s < mB + 0.45) { const u = tramo(s, mB, mB + 0.45); X.halo(0, { x: slot.x, y: slot.y, z: 0.62, esc: 0.5 + 2.6 * sale(u), op: 0.9 * (1 - u), color: 0x5eead4 }); }
  const b = X.ptEti(X.IX, X.IY, 0.05);
  const K = [[0, [b.x + 0.25, b.y + 0.05, b.z + 1.5, b.x - 0.1, b.y - 0.15, b.z]], [Math.max(0.9, mA - 0.4), [2.65, 2.4, 3.3, 0.85, 1.9, 0.5]],
    [mB, [2.15, 2.3, 4.0, 0.7, 1.95, 0.45]], [Math.max(Dv, mB + 0.5), [1.0, 2.4, 4.35, 0.6, 1.95, 0.35]]];
  camR(W, ruta(K, s));
}

// ——— escena 2 · «Desde 2022, §el «antes» de una rebaja tiene que ser §{caja}el precio más bajo de los 30 días anteriores. §También por internet» ———
const G2 = { PX: 1.1, PY: 3.95, PZ: -0.9, CX: -3.25, CY: 2.95, CZ: 0.7, HX: 2.0, HZ: 2.25 };
function esc2(W, X, s, Dv, mk, res) {
  const m0 = mk(0, 1.5), m1 = mk(1, 3.5), m2 = mk(2, 5.9);
  // La hoja «28 MAY 2022» baja sobre el taco (la regla entra en vigor).
  const a = s < 0.45 ? 1 - sale(tramo(s, 0.05, 0.45)) : 0.1 * Math.sin(tramo(s, 0.45, 0.75) * PI) * (1 - tramo(s, 0.45, 0.75));
  // Se va (encoge girando) cuando la cámara pasa a las columnas, para que su «2022» no se lea junto al «28 OCT» de la fila.
  const vaCal = suave(tramo(s, m0 - 0.05, m0 + 0.3));
  if (vaCal < 0.99) X.calendario({ x: G2.CX, y: G2.CY + 0.4 * vaCal, z: G2.CZ, ry: 0.4 + 1.2 * vaCal, esc: Math.max(0.001, 1 - vaCal), abajo: 30, hoja: -1, a, halo: 0.55 * qq(s, 0.42, 0.3) * (1 - vaCal), haloColor: 0x5eead4 });
  // 30 columnas del ejemplo 1; el escáner las recorre en «el precio…» y las 3 más bajas (18–20 nov) se quedan en ámbar.
  const tS0 = m1, tS1 = m1 + 1.3, x0 = xCol(0) - 0.25, x1 = xCol(29) + 0.25, xs = lerp(x0, x1, tramo(s, tS0, tS1));
  for (let i = 0; i < 30; i++) {
    const p = D.H1[i], x = xCol(i), tc = 0.3 + 0.03 * i, tp = tS0 + 1.3 * (x - x0) / (x1 - x0);
    const pasa = s > tS0 && s < tS1 + 0.1 && Math.abs(x - xs) < 0.22 ? 1 - Math.abs(x - xs) / 0.22 : 0, amb = p === 99 ? qq(s, tp, 0.2) : 0;
    X.columna(i, { x, z: 0, h: hCol(p) * sale(tramo(s, tc, tc + 0.4)), color: GRISC, color2: amb > 0 ? AMBH : TURQH, cq: amb > 0 ? amb : 0.7 * pasa, brillo: 0.06 + 0.3 * amb + 0.45 * pasa });
  }
  if (s > tS0 - 0.05 && s < tS1 + 0.1) X.escaner({ x: xs, z: 0 });
  const lab = qq(s, m0 + 0.3, 0.3) * (1 - tramo(s, m2 - 0.2, m2));
  W.rotulo('o28', '28 OCT', xCol(0) + 0.2, 1.95, 0, lab, '#94a3b8', 0.27); W.rotulo('n26', '26 NOV', xCol(29) - 0.2, 1.95, 0, lab, '#94a3b8', 0.27);
  W.rotulo('ej', 'EJEMPLO', xCol(3) + 0.3, 2.4, 0, lab, '#94a3b8', 0.22);
  W.rotulo('n1820', '18–20 NOV', xCol(22), hCol(99) + 0.28, 0.1, qq(s, tS0 + 1.0, 0.25) * (1 - tramo(s, m2 - 0.2, m2)), '#f5b94a', 0.2);
  // El 99 sube a la etiqueta; la pegatina 199 se cae y la insignia gira a 0 %.
  const tL = Math.min(m1 + 2.05, m2 - 0.2), tF = tL - 0.7;
  const sway = { rx: 0, ry: -0.12 + 0.04 * Math.sin(1.1 * s), rz: 0.03 * Math.sin(1.4 * s) };
  const pop = s >= tL ? 1 + 0.2 * Math.sin(tramo(s, tL, tL + 0.3) * PI) : 1;
  const encoge = suave(tramo(s, m2, m2 + 0.5)), escE = 1 - 0.82 * encoge;
  // Maniquí con el móvil (entra por la derecha antes de «También»).
  const gH = -0.32, ent = sale(tramo(s, m2 - 0.7, m2 - 0.1)), hx = lerp(3.3, G2.HX, ent), hz = lerp(2.6, G2.HZ, ent);
  const mp = manos(hx, hz, gH, 1, 1.06, 0), PM = [mp[0] + Math.sin(gH) * 0.04, mp[1] + 0.06, mp[2] + Math.cos(gH) * 0.04];
  if (s > m2 - 0.7) {
    W.heroe({ x: hx, z: hz, gira: angulo(Math.atan2(G2.HX - 3.3, G2.HZ - 2.6), gH, suave(tramo(s, m2 - 0.35, m2))), amp: 1 - tramo(s, m2 - 0.25, m2 - 0.05), fase: s * 8 });
    brazos(W.H, suave(tramo(s, m2 - 0.3, m2)), 1);
    // La pantalla enseña la etiqueta en miniatura (se enciende mientras la de verdad encoge y entra) y las 30 barras.
    X.movil({ x: PM[0], y: PM[1], z: PM[2], ry: gH, rx: -0.12, esc: suave(tramo(s, m2 - 0.3, m2)), pant: { tipo: 'escaneo', u: tramo(s, m2 + 0.55, m2 + 1.35), eti: 0.35 + 0.65 * tramo(s, m2 + 0.2, m2 + 0.5) } });
  }
  // La etiqueta no se dibuja hasta que empieza a bajar (en el plano general de la fila asomaba por arriba, sobre el HUD).
  if (s > m1 + 0.45 && s < m2 + 0.5) {
    const C0 = [G2.PX, G2.PY - 0.95, G2.PZ], Q = [PM[0], PM[1] + 0.02, PM[2] + 0.03], c = mezcla(C0, Q, encoge);
    const baja = 2.6 * Math.pow(1 - sale(tramo(s, m1 + 0.55, m1 + 1.05)), 2);
    X.etiqueta(Object.assign({}, sway, { x: c[0], y: c[1] + 0.95 * escE + baja, z: c[2], ry: lerp(sway.ry, gH, encoge), esc: escE, peg: { r199: s < tL ? 1 : 0, a99: s >= tL ? 1 : 0 }, pegEsc: { a99: pop },
      ins: 0.15 * Math.sin(s * 3) + PI * rebote(tramo(s, tL + 0.15, tL + 0.55)) }));
  }
  if (s > tF && s < tL) { const slot = X.ptEti(X.SX, X.SY, 0.05), u = tramo(s, tF, tL), e_ = suave(u), A = [xCol(22), hCol(99) + 0.25, 0.05];
    const p = mezcla(A, [slot.x, slot.y, slot.z], e_); p[1] += 0.5 * Math.sin(u * PI); X.pegVuela(0, 'a99', { x: p[0], y: p[1], z: p[2], esc: 0.4 + 0.6 * e_, ry: sway.ry * e_ }); }
  if (s > tL && s < m2) { const C0 = [G2.PX, G2.PY - 0.95, G2.PZ], d = s - tL, y = C0[1] + 0.13 + 0.8 * d - 4.9 * d * d;
    X.pegVuela(1, 'r199', { x: C0[0] + 0.3 + 0.6 * d, y: Math.max(0.02, y), z: C0[2] + 0.9 * d, rx: y > 0.02 ? -6 * d : -PI / 2, rz: 3 * d }); }
  const CC = [-2.5, 2.55, 4.4, -3.1, 2.22, 0.7], FF = [-1.2, 2.5, 11.2, -0.2, 1.0, 0], tC0 = Math.min(0.75, m0 - 0.6), tC1 = m0 + 0.3;
  const K0 = [[0, [-2.6, 2.6, 3.9, -3.2, 2.28, 0.7]], [tC0, CC]];
  const K = [[tC1, FF], [m1 + 0.2, [0.6, 2.8, 11.8, 0.3, 1.0, 0]],
    [m1 + 1.45, [-1.1, 5.4, 8.6, 0.4, 2.0, -0.4]], [Math.max(m1 + 1.6, m2 - 0.05), [0.6, 3.6, 7.0, 1.4, 2.1, 0.2]], [Math.max(Dv, m2 + 0.8), [1.4, 2.1, 4.9, 1.85, 1.6, 2.3]]];
  camR(W, s < tC0 ? ruta(K0, s) : paso(CC, FF, s, tC0, tC1) || ruta(K, s));
}

// ——— escena 3 · «Si te enseñan un «antes» inflado, §pide la hoja de reclamaciones §o reclama en consumo de tu comunidad» ———
const G3 = { DX: 0.95, DZ: -3.6, HX: -0.6, HZ: 1.2, CX: -3.3, CZ: -1.5 };
function esc3(W, X, s, Dv, mk, res) {
  const m0 = mk(0, 2.2), m1 = mk(1, 3.4);
  W.puerta({ x: G3.DX, z: G3.DZ, luz: 1 });
  const esc = 0.78 + 0.2 * (0.5 - 0.5 * Math.cos(s * 5.5));   // la etiqueta «antes 199» se hincha y deshincha como un globo
  X.etiqueta({ x: G3.DX, y: 3.6 + 0.95 * esc, z: G3.DZ - 0.15, ry: 0.06 * Math.sin(s * 1.7), rz: 0.05 * Math.sin(s * 2.3), esc, peg: { r199: 1 }, ins: 0.35 * Math.sin(s * 4) });
  const hz = lerp(2.6, G3.HZ, sale(tramo(s, 0, m0))), g = angulo(PI, 0.55, suave(tramo(s, m0 - 0.1, m0 + 0.35)));
  W.heroe({ x: G3.HX, z: hz, gira: g, amp: 1 - tramo(s, m0 - 0.3, m0), fase: s * 7.5 });
  brazos(W.H, suave(tramo(s, m0 + 0.25, m0 + 0.55)), 1);
  const mp = manos(G3.HX, G3.HZ, 0.55, 1, 1.06, 0);
  if (s > m0 - 0.05 && s < m1 + 0.95) {
    let p, rx = -0.15, ry = 0.55, rz = 0, e = 1;
    if (s < m0 + 0.6) { const u = tramo(s, m0 - 0.05, m0 + 0.6), e_ = sale(u); p = mezcla([mp[0] + 0.35, 3.9, mp[2] + 0.25], mp, e_); ry = 0.55 + 3 * PI * (1 - e_); rz = 0.6 * (1 - e_) * Math.sin(u * 9); rx = -0.15 * e_; }
    else if (s < m1 + 0.05) p = mp;
    else { const u = tramo(s, m1 + 0.05, m1 + 0.9), e_ = suave(u), F = [G3.CX + 0.25, 1.0, G3.CZ + 0.85]; p = mezcla(mp, F, e_); p[1] += 0.9 * Math.sin(u * PI); ry = 0.55 + 2 * PI * e_; e = 1 - 0.55 * e_; }
    X.hojaRec({ x: p[0], y: p[1], z: p[2], rx, ry, rz, esc: e });
  }
  const lit = suave(tramo(s, m1 + 0.2, m1 + 0.6));
  W.casitas([{ x: G3.CX, z: G3.CZ, rot: 0.55, esc: 1.15, color: 0x2dd4bf, q: 0.3 + 0.7 * lit }]);
  W.rotulo('cons', 'CONSUMO', G3.CX + 0.45, 0.75, G3.CZ + 0.85, qq(s, m1 + 0.3, 0.3), '#5eead4', 0.3);
  if (lit > 0) X.halo(0, { x: G3.CX, y: 1.0, z: G3.CZ + 0.6, esc: 3.2, op: 0.5 * lit * (1 - 0.5 * tramo(s, m1 + 1.1, m1 + 1.6)), color: 0x5eead4 });
  const K = [[0, [0.3, 2.75, 6.3, 0.85, 2.05, -3.4]], [m0 - 0.2, [0.35, 2.5, 4.7, 0.75, 2.0, -3.0]], [m0 + 0.25, [1.15, 2.0, 4.3, -0.55, 1.45, 1.2]]];
  const K2 = [[m0 + 0.25, [1.15, 2.0, 4.3, -0.55, 1.45, 1.2]], [m1, [-1.1, 1.9, 4.5, -0.6, 1.5, 1.2]], [Math.max(Dv, m1 + 0.6), [-0.7, 2.7, 5.4, -3.0, 1.3, -1.3]]];
  camR(W, rutas([K, K2], s));
  // La gente camina hacia la puerta roja de la tienda (por la derecha del protagonista) y entra.
  return (i) => {
    if (i >= 10) return { x: -60, z: -60, esc: 0 };
    const LP = 5.6, v = 1.15, u = ((s + 7.3) * v + i * 0.56 + (i * 1.7) % 0.4) % LP, z0 = 2.0, z = z0 - u, w = u / LP;
    const lane = G3.DX + ((i % 4) - 1.5) * 0.62 + 0.15 * Math.sin(i * 2.1), x = lerp(lane + 0.45, G3.DX, w * w);
    const e = Math.min(1, u / 0.5) * Math.min(1, Math.max(0, (z - G3.DZ) / 0.6));
    return Object.assign({ x, z, rot: Math.atan2(G3.DX - x, G3.DZ - z), amp: 1, fase: s * 8 + i, esc: Math.max(0.001, e) }, blanco);
  };
}

// ——— escena 4 · «¿Y si lo suben a mediados de noviembre §para rebajarlo el Black Friday?» ———
const G4 = { PX: 1.6, PY: 4.05, PZ: -0.8, HX: 0.15, HZ: 1.75 };
function esc4(W, X, s, Dv, mk, res) {
  const m0 = mk(0, 1.7);
  for (let i = 0; i < 30; i++) {
    const tc = 0.012 * i, h0 = hCol(149) * (0.55 + 0.45 * sale(tramo(s, tc, tc + 0.3)));
    let h = h0, cq = 0;
    if (i >= 17) { const tu = 0.55 + 0.045 * (i - 17), u = tramo(s, tu, tu + 0.25); h = h0 + (hCol(199) - hCol(149)) * rebote(u); cq = sale(u); }
    X.columna(i, { x: xCol(i), z: 0, h, color: GRISC, color2: ROJOH, cq, brillo: 0.06 + 0.3 * cq });
  }
  W.rotulo('o28', '28 OCT', xCol(0) + 0.1, 0.85, 0.25, qq(s, 0.35, 0.3), '#94a3b8', 0.2);
  W.rotulo('n14', '14 NOV', xCol(17) + 0.1, 1.15, 0.25, qq(s, 0.6, 0.3), '#f87171', 0.2);
  W.rotulo('ej', 'EJEMPLO', xCol(3), 0.5, 0.25, qq(s, 0.35, 0.3), '#94a3b8', 0.18);
  const td = m0 - 0.2, tt = s - td;
  if (s > td) X.etiqueta({ x: G4.PX, y: G4.PY + 1.9 * Math.pow(1 - sale(tramo(s, td, td + 0.5)), 2), z: G4.PZ, rz: 0.15 * Math.exp(-2 * tt) * Math.sin(7 * tt), ry: -0.15, peg: { r199: 1 }, ins: 0.4 * Math.exp(-tt) * Math.sin(6 * tt) });
  if (s > m0 - 0.25) W.heroe({ x: G4.HX, z: G4.HZ, gira: Math.atan2(G4.PX - G4.HX, G4.PZ - G4.HZ), brazos: 0.32 * qq(s, m0 + 0.45, 0.3) });
  const K = [[0, [-3.4, 2.1, 6.2, -0.9, 0.9, 0]], [m0 - 0.1, [-0.1, 1.55, 4.3, 1.7, 1.1, -0.1]], [m0 + 0.4, [-1.4, 2.5, 6.4, 1.0, 2.3, -0.5]], [Math.max(Dv, m0 + 0.8), [1.7, 2.75, 6.5, 0.95, 2.35, -0.5]]];
  camR(W, ruta(K, s));
}

// ——— escena 5 · «No les sirve: §vale el precio más bajo, no el último. §Para una rebaja del 27, §{tic}la ley mira desde el 28 de octubre» ———
const G5 = { CX: -2.0, CY: 3.85, CZ: 1.2 };
function esc5(W, X, s, Dv, mk, res) {
  const m0 = mk(0, 1.0), m1 = mk(1, 3.2), m2 = mk(2, 4.5);
  const tS0 = m0, tS1 = m0 + 1.1, x0 = xCol(0) - 0.25, x1 = xCol(29) + 0.25, xs = lerp(x0, x1, tramo(s, tS0, tS1));
  for (let i = 0; i < 30; i++) {
    const x = xCol(i), p = D.H2[i], tp = tS0 + 1.1 * (x - x0) / (x1 - x0), pasa = s > tS0 && s < tS1 + 0.1 && Math.abs(x - xs) < 0.22 ? 1 - Math.abs(x - xs) / 0.22 : 0;
    const amb = p === 149 ? qq(s, tp, 0.2) : 0;
    X.columna(i, { x, z: 0, h: hCol(p), color: p === 199 ? ROJOH : GRISC, color2: amb > 0 ? AMBH : TURQH, cq: amb > 0 ? amb : 0.6 * pasa, brillo: (p === 199 ? 0.3 : 0.06) + 0.3 * amb + 0.45 * pasa });
  }
  if (s > tS0 - 0.05 && s < tS1 + 0.1) X.escaner({ x: xs, z: 0 });
  // El 149 sube a la etiqueta del 27: la pegatina 199 se cae y la insignia −50 % se va.
  const tL = Math.min(m0 + 2.0, m1 - 0.1), tF = tL - 0.75;
  const st = { x: G4.PX, y: G4.PY, z: G4.PZ, ry: -0.15 + 0.04 * Math.sin(s * 1.1), rz: 0.03 * Math.sin(s * 1.4) };
  const pop = s >= tL ? 1 + 0.2 * Math.sin(tramo(s, tL, tL + 0.3) * PI) : 1;
  X.etiqueta(Object.assign({}, st, { peg: { r199: s < tL ? 1 : 0, a149: s >= tL ? 1 : 0 }, pegEsc: { a149: pop }, ins: 0.12 * Math.sin(s * 3), insOp: 1 - tramo(s, tL, tL + 0.3) }));
  const slot = X.ptEti(X.SX, X.SY, 0.05);
  if (s > tF && s < tL) { const u = tramo(s, tF, tL), e_ = suave(u), A = [xCol(8), hCol(149) + 0.3, 0.05]; const p = mezcla(A, [slot.x, slot.y, slot.z], e_); p[1] += 0.6 * Math.sin(u * PI);
    X.pegVuela(0, 'a149', { x: p[0], y: p[1], z: p[2], esc: 0.45 + 0.55 * e_, ry: st.ry * e_ }); }
  if (s > tL && s < tL + 1.3) { const d = s - tL, y = slot.y + 0.8 * d - 4.9 * d * d;
    X.pegVuela(1, 'r199', { x: slot.x + 0.5 * d, y: Math.max(0.02, y), z: slot.z + 0.9 * d, rx: y > 0.02 ? -6 * d : -PI / 2, rz: 3 * d }); }
  // El taco con la hoja del 27 y, en el tic, 30 hojas hacia atrás hasta el 28 OCT; el corchete de 30 días sobre las columnas.
  const fin = m2 + 30 * 0.04;
  if (s > m1 - 0.25) {
    const c = rebobina(s, 30, 0, m2, 0.04);
    X.calendario({ x: G5.CX, y: G5.CY, z: G5.CZ, esc: 0.85, ry: 0.18, ej: 2, abajo: c.abajo, hoja: c.hoja, a: c.a, halo: s > fin ? 0.8 * tramo(s, fin, fin + 0.15) : 0 });
    if (s > m2 && s < fin + 0.6) W.rotulo('dias', '−' + Math.min(30, Math.floor((s - m2) / 0.04)) + ' DÍAS', G5.CX + 0.95, G5.CY - 0.55, G5.CZ, 1, '#f5b94a', 0.26);
  }
  if (s > m2 + 0.15) {
    X.corchete({ x0: xCol(0) - 0.08, x1: xCol(29) + 0.08, y: 2.0, z: 0, abre: sale(tramo(s, m2 + 0.15, m2 + 1.25)) });
    W.rotulo('c28', '28 OCT', xCol(0) + 0.25, 2.3, 0, qq(s, fin, 0.3), '#f5b94a', 0.24); W.rotulo('c26', '26 NOV', xCol(29) - 0.25, 2.3, 0, qq(s, fin + 0.1, 0.3), '#5eead4', 0.24);
  }
  const K = [[0, [1.4, 2.7, 11.0, 0.6, 1.1, 0]], [m0, [-1.0, 2.6, 11.0, -0.3, 1.05, 0]], [m0 + 1.1, [-1.6, 2.6, 6.6, 0.35, 1.65, 0]], [m1 - 0.25, [-0.2, 4.4, 8.1, 0.7, 2.55, -0.4]],
    [m1 + 0.2, [-1.6, 3.6, 4.4, -1.95, 3.3, 1.2]]];
  // En el tic la cámara se aleja mientras rebobina y llega al plano general antes de que aterrice el 28 OCT; después, deriva lenta.
  const PG = [-0.62, 4.5, 11.0, -0.45, 2.05, 0.4], PG2 = [-0.25, 4.62, 11.55, -0.38, 2.05, 0.4], tG = Math.min(m2 + 1.0, Dv - 1.0);
  const K2 = [[m1 + 0.2, [-1.6, 3.6, 4.4, -1.95, 3.3, 1.2]], [m2, [-1.8, 3.45, 3.85, -1.95, 3.3, 1.2]], [tG, PG]];
  const K3 = [[tG, PG], [Math.max(Dv, tG + 0.6), PG2]];
  camR(W, rutas([K, K2, K3], s));
}

// ——— escena 6 · «Haz hoy captura del precio §y compáralo el 27. §El «antes» no lo eligen ellos: §{pop}es el más bajo de los 30 días anteriores» ———
const G6 = { HX: -1.1, HZ: 1.5, PX: 0.85, PY: 4.05, PZ: 0.1, CX: -1.45, CY: 3.45, CZ: -0.9, FZ: -1.5, MX: 2.0, MZ: -0.4, CAP: [-0.45, 2.55, 1.55] };
function esc6(W, X, s, Dv, mk, res) {
  const m0 = mk(0, 1.4), m1 = mk(1, 3.0), m2 = mk(2, 4.8);
  const gT = Math.atan2(G6.PX - G6.HX, G6.PZ - G6.HZ);
  W.heroe({ x: G6.HX, z: G6.HZ, gira: gT, luz: qq(s, 0.05, 0.5) });
  // Levanta el móvil por encima de la cabeza (apunta a la etiqueta, que cuelga alta): así la cabeza no tapa la pantalla.
  const qp = 0.25 + 0.15 * (1 - suave(tramo(s, 0, 0.6))); brazos(W.H, 1, qp);
  const mp = manos(G6.HX, G6.HZ, gT, qp, 1.06, 0), tFl = 0.9;
  X.movil({ x: mp[0], y: mp[1] + 0.06, z: mp[2], ry: gT + PI, rx: 0.08, pant: { tipo: s > tFl ? 'captura' : 'vivo' } });
  if (s > tFl && s < tFl + 0.5) { const u = tramo(s, tFl, tFl + 0.5); X.halo(2, { x: mp[0], y: mp[1] + 0.1, z: mp[2], esc: 0.6 + 2.6 * sale(u), op: (1 - u), color: 0xffffff }); }
  if (s > tFl + 0.05) { const u = tramo(s, tFl + 0.05, tFl + 0.6), e_ = sale(u), p = mezcla(mp, G6.CAP, e_); X.captura({ x: p[0], y: p[1], z: p[2], ry: 0.25 * e_, esc: 0.3 + 0.7 * e_ }); }
  // Calendario hasta el 27 y la etiqueta del 27 («antes 199»); línea ámbar de la captura al «antes».
  if (s > m0 - 0.3) { const c = avanza(s, 24, 30, m0, 0.07); X.calendario({ x: G6.CX, y: G6.CY, z: G6.CZ, esc: 0.72, ry: 0.3, ej: 2, abajo: c.abajo, hoja: c.hoja, a: c.a }); }
  // tA: el 149 llega a la línea ANTES; queda más de 1 s a la vista antes del latigazo al bucle (Dv − 0,8).
  const td = m0 + 0.1, tt = s - td, tA = Math.min(m2 + 0.95, Dv - 1.85);
  if (s > td) {
    const pop = s >= tA ? 1 + 0.22 * Math.sin(tramo(s, tA, tA + 0.3) * PI) : 1;
    X.etiqueta({ x: G6.PX, y: G6.PY + 1.9 * Math.pow(1 - sale(tramo(s, td, td + 0.5)), 2), z: G6.PZ, rz: 0.14 * Math.exp(-2 * tt) * Math.sin(7 * tt) + 0.02 * Math.sin(s * 1.3), ry: -0.2,
      // La insignia «−50 %» se va girando con el 199 («no lo eligen ellos»): con el 149 sería un −34 %.
      peg: { r199: s < m1 + 0.1 ? 1 : 0, a149: s >= tA ? 1 : 0 }, pegEsc: { a149: pop }, ins: 0.35 * Math.exp(-tt) * Math.sin(6 * tt) + 4 * sale(tramo(s, m1 + 0.12, m1 + 0.42)), insOp: 1 - tramo(s, m1 + 0.12, m1 + 0.42) });
    const slot = X.ptEti(X.SX, X.SY, 0.05);
    if (s > m0 + 0.55 && s < m2) X.linea([G6.CAP[0] + 0.05, G6.CAP[1] - 0.02, G6.CAP[2] + 0.02], [slot.x - 0.3, slot.y, slot.z], sale(tramo(s, m0 + 0.55, m0 + 1.05)) * (1 - tramo(s, m2 - 0.3, m2)));
    // «no lo eligen ellos»: el 199 se despega hacia arriba y se deshace en el aire.
    if (s > m1 + 0.1 && s < m1 + 1.3) { const d = s - (m1 + 0.1), H = X.casasTrozos();
      for (let i = 0; i < 8; i++) { const c = i % 4, r = Math.floor(i / 4); X.trozo(i, { x: H[i].x + (c - 1.5) * 0.5 * d, y: H[i].y + 0.25 * Math.min(1, d * 6) + (0.7 + 0.2 * r) * d, z: H[i].z + 0.35 * d, rx: d * (2 + i), rz: d * (3 - i * 0.5), esc: 1 - 0.4 * d, op: 1 - tramo(d, 0.35, 1.1) }); } }
    // Las 30 columnas se juntan en una sola, la más baja (149 €), que sube hasta la línea ANTES.
    if (s > m2 - 0.15) {
      const tJ = tA - 0.35, sube = suave(tramo(s, tJ, tA)), yTop = slot.y;
      for (let i = 0; i < 30; i++) { const p = D.H2[i], u = suave(tramo(s, m2 + 0.05 + 0.006 * i, tJ)), h = lerp(hCol(p), hCol(149), u) * sale(tramo(s, m2 - 0.15, m2 + 0.2));
        if (u < 0.999) X.columna(i, { x: lerp(xCol(i), G6.MX, u), z: lerp(G6.FZ, G6.MZ, u), h, color: p === 199 ? ROJOH : AMBH, color2: AMBH, cq: u, brillo: 0.3 }); }
      if (s > tJ - 0.05) { X.columna(30, { x: G6.MX, z: G6.MZ, y: (yTop - hCol(149) + 0.12) * sube, h: hCol(149), w: 0.32, color: AMBH, brillo: 0.4 });
        W.rotulo('m149', '149 €', G6.MX, (yTop - hCol(149) + 0.12) * sube + hCol(149) + 0.28, G6.MZ, qq(s, tJ, 0.25), '#f5b94a', 0.26); }
    }
  }
  // Por encima del hombro derecho y desde arriba: se ve la pantalla del móvil (antes la tapaba la cabeza). Paso al general más suave.
  const O2 = [-1.72, 2.88, 2.48, -0.76, 2.06, 1.2], GW = [-0.7, 2.85, 7.9, 0.05, 2.7, 0.2], tO = m0 - 0.2, tW = m0 + 0.4;
  const K = [[0, [-1.95, 2.78, 2.7, -0.8, 2.02, 1.25]], [tO, O2]];
  // Cierre: llega al plano general cuando el 149 entra en la línea ANTES y después deriva despacio hasta el bucle.
  const PB = [0.0, 3.9, 8.5, 0.66, 2.5, -0.3], PC = [-0.4, 4.05, 9.2, 0.62, 2.47, -0.36];
  const K2 = [[tW, GW], [m1, [0.85, 2.9, 7.8, 0.15, 2.75, 0.2]], [m2, [0.6, 3.4, 6.2, 0.6, 2.9, 0.0]], [tA, PB]];
  const K3 = [[tA, PB], [Math.max(Dv - 0.8, tA + 0.5), PC]];
  camR(W, s < tO ? ruta(K, s) : paso(O2, GW, s, tO, tW) || rutas([K2, K3], s));
}
`;

// Capa 2D: rótulos de 2–4 palabras en el tercio central-bajo (y ≈ 1.300 px); una nota pequeña abajo a la izquierda.
const nota = (txt) => `<div class="nota">${txt}</div>`;
const rt = (cls, txt, top) => `<div class="rt ${cls}" data-t="translateX(-50%)"${top ? ` style="top:${top}px"` : ''}>${txt}</div>`;
const ESCENAS = [
  // 0 · Gancho: «¿REBAJA DEL 50 %?» ya puesto; con el sello, «HACE 7 DÍAS: 99 €»; con la insignia, «REBAJA REAL: 0 %»; con la hoja, «20 NOV: 99 €».
  { html: () => rt('', '¿REBAJA DEL <span class="r">50 %</span>?', 1330) + rt('amb', 'HACE 7 DÍAS: <span class="a">99 €</span>', 1330) +
      rt('amb', 'REBAJA REAL: <span class="a">0 %</span>', 1330) + rt('amb', '20 NOV: <span class="a">99 €</span>', 1330),
    anim: function (s, e, el) { const M = e.seg[0].marcas, m1 = Math.max(M[1] != null ? M[1] : 3.4, 3.35), r = el.querySelectorAll('.rt');
      ver(r[0], s, -1, 0.7); ver(r[1], s, 0.7, 2.0); ver(r[2], s, 2.0, m1 - 0.05); ver(r[3], s, m1); } },
  // 1 · «EN ESPAÑA» y, en el ding, «NO SE PUEDE ANUNCIAR ASÍ».
  { html: () => rt('turq', 'EN <span class="t">ESPAÑA</span>') + rt('turq p', 'NO SE PUEDE<br>ANUNCIAR ASÍ'),
    anim: function (s, e, el) { const M = e.seg[0].marcas, mA = M[0] != null ? M[0] : 1.8, mB = M[1] != null ? M[1] : 2.3, r = el.querySelectorAll('.rt');
      ver(r[0], s, mA - 0.1, mB); ver(r[1], s, mB); } },
  // 2 · La regla: desde 2022; «ANTES = EL MÁS BAJO DE 30 DÍAS»; «TAMBIÉN POR INTERNET».
  { html: () => rt('turq', 'DESDE EL <span class="t">28-5-2022</span>') + rt('amb p', '«ANTES» = EL MÁS BAJO<br>DE <span class="a">30 DÍAS</span>') + rt('turq p', 'TAMBIÉN <span class="t">POR INTERNET</span>') +
      nota('Ley 7/1996 de Comercio Minorista, art. 20.1<br>(RDL 24/2021: en vigor el 28-5-2022)'),
    anim: function (s, e, el) { const M = e.seg[0].marcas, m1 = M[1] != null ? M[1] : 3.5, m2 = M[2] != null ? M[2] : 5.9, r = el.querySelectorAll('.rt');
      ver(r[0], s, 0.25, m1 - 0.1); ver(r[1], s, m1 + 0.1, m2); ver(r[2], s, m2 + 0.05); ver(el.querySelector('.nota'), s, 0.4, m2); } },
  // 3 · «ANTES» INFLADO → HOJA DE RECLAMACIONES → CONSUMO DE TU COMUNIDAD.
  { html: () => rt('roja', '«ANTES» <span class="r">INFLADO</span>') + rt('turq p', 'HOJA DE <span class="t">RECLAMACIONES</span>') + rt('turq p', 'CONSUMO DE<br><span class="t">TU COMUNIDAD</span>'),
    anim: function (s, e, el) { const M = e.seg[0].marcas, m0 = M[0] != null ? M[0] : 2.2, m1 = M[1] != null ? M[1] : 3.4, r = el.querySelectorAll('.rt');
      ver(r[0], s, 0.6, m0); ver(r[1], s, m0 + 0.1, m1); ver(r[2], s, m1 + 0.4); } },
  // 4 · «14 NOV: SUBE A 199 €» y «¿ANTES 199 €?».
  { html: () => rt('roja', '14 NOV: SUBE A <span class="r">199 €</span>') + rt('roja', '¿ANTES <span class="r">199 €</span>?'),
    anim: function (s, e, el) { const M = e.seg[0].marcas, m0 = M[0] != null ? M[0] : 1.7, r = el.querySelectorAll('.rt');
      ver(r[0], s, 0.65, m0); ver(r[1], s, m0 + 0.25); } },
  // 5 · «NO LES SIRVE» → «ANTES: 149 €» → «DESDE EL 28 DE OCTUBRE».
  { html: () => rt('turq', 'NO LES SIRVE') + rt('amb', 'ANTES: <span class="a">149 €</span>') + rt('amb p', 'DESDE EL <span class="a">28 DE OCTUBRE</span>'),
    anim: function (s, e, el) { const M = e.seg[0].marcas, m0 = M[0] != null ? M[0] : 1.0, m1 = M[1] != null ? M[1] : 3.2, m2 = M[2] != null ? M[2] : 4.5, r = el.querySelectorAll('.rt');
      const g = e.seg[0], t28 = g.res[2] ? g.res[2].ini : m2 + 0.5, tL = Math.min(m0 + 2.0, m1 - 0.1);
      ver(r[0], s, 0.15, m0); ver(r[1], s, tL, m1); ver(r[2], s, t28); } },
  // 6 · Cierre: HAZ CAPTURA HOY → Y COMPÁRALO EL 27 → «ANTES» = EL MÁS BAJO DE 30 DÍAS. Cola: el rótulo del fotograma 0.
  { html: () => rt('turq', 'HAZ <span class="t">CAPTURA</span> HOY') + rt('turq', 'Y COMPÁRALO EL <span class="t">27</span>') + rt('amb p', '«ANTES» = EL MÁS BAJO<br>DE <span class="a">30 DÍAS</span>') +
      rt('', '¿REBAJA DEL <span class="r">50 %</span>?', 1330),
    anim: function (s, e, el) { const M = e.seg[0].marcas, m0 = M[0] != null ? M[0] : 1.4, m1 = M[1] != null ? M[1] : 3.0, m2 = M[2] != null ? M[2] : 4.8, r = el.querySelectorAll('.rt');
      const cola = e.fin - e.ini - 0.8; ver(r[0], s, 0.2, m0); ver(r[1], s, m0 + 0.05, m1); ver(r[2], s, m2, cola); r[3].style.opacity = s >= cola ? 1 : 0; r[3].style.transform = 'translateX(-50%)'; } }
];

const TRES = function (t, k, s, e, W) {
  const X = W.X; X.apagar();
  const ultima = k === ESC.length - 1, Dv = (e.fin - e.ini) - (ultima ? 0 : 0.3);
  const M = e.seg.flatMap(g => g.marcas), res = e.seg.flatMap(g => g.res);
  const mk = (j, def) => (M[j] != null ? M[j] : def);
  W.cam.up.set(0, 1, 0);
  let directo = null;
  if (k === 0) gancho(W, X, s, mk(1, 3.4), res[0] ? res[0].ini : mk(1, 3.4) + 1.3, Dv);
  else if (ultima && s >= Dv - 0.8) gancho(W, X, s - Dv, 3.36, 4.2, 5.55);   // cola: el encuadre del fotograma 0 (bucle)
  else directo = [null, esc1, esc2, esc3, esc4, esc5, esc6][k](W, X, s, Dv, mk, res);
  W.multitud(t, { directo: directo || (() => ({ x: -60, z: -60, esc: 0 })) });
};

const pildoras = {
  'es-black-friday-30-dias': pildora3d({
    slug: 'es-black-friday-30-dias', cuenta: 'es',
    T: { es: { titulo: '«Antes 199 €, ahora 99»… y hace una semana ya estuvo a 99', guion: GUION } },
    fijo: () => `<div class="hud i fmt">TUS DERECHOS</div><div class="hud d"><i></i><span id="reloj">00:00</span></div>`,
    cssExtra: CSS, scriptExtra: SCRIPT,
    datos: () => ({ H1, H2 }),
    escenas: ESCENAS, tres: TRES,
    // Como es-loteria-navidad: cola corta (el bucle vuelve pronto al gancho) y la capa 2D se va con el corte seco del 3D.
    cola: 0.8, corte2d: 'seco',
    texto: { es: TEXTO }
  })
};

module.exports = { pildoras };
