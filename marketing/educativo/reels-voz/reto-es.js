// Serie «30 días para ordenar tu dinero» · @finanziapp.es (España), en 3D (reels-voz/tres.js).
// Cada día: una sola acción concreta, en ~30 s, y al final «Mañana: …» (da el motivo para seguir la cuenta).
// La metáfora de toda la serie: los maniquíes grises son tu dinero yendo por libre; lo que controlas se enciende.
// Texto de la publicación: gancho + resumen que NO repite el guion + qué hacer hoy (petición del propietario).
// Día 1: no lleva datos externos (es un método: apuntar los gastos 7 días y etiquetarlos).
const { pildora3d, hud, finSerie } = require('./tres');
const { cuadra } = require('../reels/_comun');

// Día 3: sin datos externos; es un ejemplo inventado y se presenta como tal («si cobras 1.600…»).
const SUELDO = 1600, HORAS = 160, PRECIO = 120, HORA = SUELDO / HORAS;
// Día 5: ejemplo (no estadística). 5 % de 1.600 € = 80 € al mes; × 12 = 960 € al año; la nómina en pantalla son 20 maniquíes de 80 €.
const PCT = 5, MES5 = SUELDO * PCT / 100;
cuadra('reto-05 mes', MES5, 80);
cuadra('reto-05 año', MES5 * 12, 960);
cuadra('reto-05 maniquíes', SUELDO / 20, MES5);
cuadra('reto-03 hora', HORA, 10);
cuadra('reto-03 horas', PRECIO / HORA, 12);

// Día 7 · El coste por uso, la semana antes del Black Friday (27-nov-2026). Ejemplos (no estadística): camiseta de 15 € × 5 usos
// = 3 €/uso; zapatillas de 120 € × 300 usos = 0,40 €/uso. Dato: Comisión Europea, COM(2022) 141 (30-3-2022): entre 1996 y 2018
// los precios de la ropa en la UE bajaron más de un 30 % en relación con la inflación y el gasto de los hogares en ropa subió
// (+14 % real 2000–2018, nota 8, JRC 2021, p. 27). Comprobado con Eurostat prc_hicp_aind (IPCA anual, CP031/CP00): UE 1996–2018
// −32,7 % real; España −18,3 % (1996–2018) y −31,3 % (1996–2025). La voz dice «en la Unión Europea».
// Guion: guiones/2026-11-es-reto-07.md. Sin «Mañana» ni «Síguenos».
// Fuentes (consultadas el 18-11-2026):
// - Comisión Europea, Estrategia para la circularidad y sostenibilidad de los productos textiles, COM(2022) 141 final (30/3/2022),
//   versión española remitida al Consejo (ST 7851/22), Introducción, p. 1, y notas 7 y 8:
//   https://data.consilium.europa.eu/doc/document/ST-7851-2022-INIT/es/pdf
// - JRC (2021), Circular Economy Perspectives in the EU Textile sector, EUR 30734 EN, p. 27 (+14 % real del gasto total de los
//   hogares de la EU-27 en ropa, 2000–2018): https://publications.jrc.ec.europa.eu/repository/bitstream/JRC125110/jrc125110_ce_perspectives_for_eu_textiles_tr_10.06.2021_final.pdf
// - Eurostat, prc_hicp_aind (IPCA anual, 2015 = 100), CP031 ropa y CP00 general, UE y España:
//   https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/prc_hicp_aind?format=JSON&unit=INX_A_AVG&coicop=CP00&coicop=CP031&geo=EU&geo=ES&sinceTimePeriod=1996
// - Eurostat, nama_10_co3_p3 (gasto de los hogares en ropa con los datos de hoy; solo en los comentarios).
// - Real Decreto Legislativo 1/2007 (TRLGDCU), arts. 68.2, 102, 103, 104.b y 108.1 (BOE, act. 04/11/2026), solo en el texto de la
//   publicación: https://www.boe.es/buscar/act.php?id=BOE-A-2007-20555
const r2 = (v) => Math.round(v * 100) / 100;
// Día 7 · ejemplos (no estadística): camiseta de 15 € que te pones 5 veces; zapatillas de 120 € que te pones 300 veces.
const CAMI = 15, USOS_C = 5, ZAPA = 120, USOS_Z = 300;
const PU_C = CAMI / USOS_C, PU_Z = ZAPA / USOS_Z;
cuadra('reto-07 camiseta: «3 euros por uso»', PU_C, 3);
cuadra('reto-07 zapatillas: «40 céntimos»', PU_Z, 0.4);
cuadra('reto-07 zapatillas en céntimos', Math.round(PU_Z * 100), 40);
cuadra('reto-07 la camiseta sale 7,5 veces más cara por uso', PU_C / PU_Z, 7.5);
cuadra('reto-07 «más cara»: por uso, la de 15 € pasa a la de 120 €', PU_C > PU_Z, true);
cuadra('reto-07 en precio de tienda, la de 120 € es 8 veces la de 15 €', ZAPA / CAMI, 8);
// Gancho: el cruce. Uso n en el que las zapatillas (120/n) bajan de los 3 € por uso de la camiseta.
const CRUCE = ZAPA / PU_C;
cuadra('reto-07 cruce en el uso 40', CRUCE, 40);
cuadra('reto-07 en el uso 40, las dos a 3 €', ZAPA / CRUCE, PU_C);
cuadra('reto-07 uso 41: zapatillas ya más baratas', ZAPA / 41 < PU_C, true);
// Contador del gancho: 3 → 40 entre 0 y 0,65 s (exponencial) y 40 → 300 entre 0,65 y 2,5 s.
const usos7 = (t) => t <= 0.65 ? 3 * Math.pow(40 / 3, t / 0.65) : 40 * Math.pow(300 / 40, Math.min(1, (t - 0.65) / 1.85));
cuadra('reto-07 contador en 0 s', usos7(0), 3);
cuadra('reto-07 contador en 0,65 s', r2(usos7(0.65)), 40);
cuadra('reto-07 contador en 2,5 s', r2(usos7(2.5)), 300);
cuadra('reto-07 la camiseta se para en 5 usos hacia 0,13 s', r2(0.65 * Math.log(5 / 3) / Math.log(40 / 3)), 0.13);
// Lo que se ve en la etiqueta: USOS = Math.floor(usos7(t) + 1e-9) y 120 / USOS con dos decimales.
const usosVis7 = (t) => Math.floor(usos7(t) + 1e-9);
cuadra('reto-07 en 0,5 s: 22 usos', usosVis7(0.5), 22);
cuadra('reto-07 en 0,5 s: 5,45 €', r2(ZAPA / usosVis7(0.5)), 5.45);
cuadra('reto-07 en 0,65 s: uso 40 (no 39)', usosVis7(0.65), 40);
cuadra('reto-07 en 1 s: 58 usos, 2,07 €', [usosVis7(1), r2(ZAPA / usosVis7(1))].join('|'), '58|2.07');
cuadra('reto-07 en 1,5 s: 100 usos, 1,20 €', [usosVis7(1.5), r2(ZAPA / usosVis7(1.5))].join('|'), '100|1.2');
cuadra('reto-07 en 2 s: 174 usos, 0,69 €', [usosVis7(2), r2(ZAPA / usosVis7(2))].join('|'), '174|0.69');
cuadra('reto-07 el uso 42 (cambio de color) llega antes de 0,7 s', 0.65 + 1.85 * Math.log(42 / 40) / Math.log(300 / 40) < 0.7, true);
cuadra('reto-07 rótulo 120 € en el uso 1', ZAPA / 1, 120);
cuadra('reto-07 rótulo de la camiseta en el uso 3 (fotograma 0)', CAMI / 3, 5);
// Pregunta: zapatillas que no te pones = 120 € «por nada» (0 usos: el precio entero sin ningún uso).
cuadra('reto-07 «120 euros por nada»', ZAPA - 0 * PU_Z, 120);
// Texto de la publicación (ejemplos)
cuadra('reto-07 usos para que la camiseta iguale a las zapatillas', Math.ceil(CAMI / PU_Z), 38);
cuadra('reto-07 (exacto 37,5)', CAMI / PU_Z, 37.5);
const ANTES = 40, REBAJA = 50, AHORA = ANTES * (1 - REBAJA / 100), USOS_R = 2;
cuadra('reto-07 rebaja del 50 %: 40 → 20 €', AHORA, 20);
cuadra('reto-07 rebaja usada 2 veces: 10 € por uso', AHORA / USOS_R, 10);
cuadra('reto-07 10 € por uso = 25 veces las zapatillas', AHORA / USOS_R / PU_Z, 25);
// Dato (Comisión Europea, COM(2022) 141): precios de la ropa 1996–2018; gasto de los hogares en ropa +14 % real 2000–2018 (JRC 2021).
cuadra('reto-07 años del dato de precios', 2018 - 1996, 22);
cuadra('reto-07 años del dato de gasto', 2018 - 2000, 18);
// Comprobación con Eurostat, IPCA anual (prc_hicp_aind, 2015 = 100), CP031 ropa y CP00 general, consultado el 18-11-2026.
const IPCA7 = { UE: { r96: 101.45, r18: 100.92, g96: 70.26, g18: 103.89 }, ES: { r96: 79.05, r18: 102.9, r25: 105.99, g96: 64.93, g18: 103.46, g25: 126.65 } };
const real7 = (r0, r1, g0, g1) => Math.round(((r1 / r0) / (g1 / g0) - 1) * 1000) / 10;
cuadra('reto-07 UE 1996–2018: ropa descontada la inflación −32,7 % («más de un 30 %»)', real7(IPCA7.UE.r96, IPCA7.UE.r18, IPCA7.UE.g96, IPCA7.UE.g18), -32.7);
cuadra('reto-07 España 1996–2018: −18,3 % (por eso la voz dice «en la Unión Europea»)', real7(IPCA7.ES.r96, IPCA7.ES.r18, IPCA7.ES.g96, IPCA7.ES.g18), -18.3);
cuadra('reto-07 España 1996–2025: −31,3 % (texto de la publicación)', real7(IPCA7.ES.r96, IPCA7.ES.r25, IPCA7.ES.g96, IPCA7.ES.g25), -31.3);
cuadra('reto-07 España 1996–2025: la ropa +34 %', Math.round((IPCA7.ES.r25 / IPCA7.ES.r96 - 1) * 100), 34);
cuadra('reto-07 España 1996–2025: los precios en general +95 %', Math.round((IPCA7.ES.g25 / IPCA7.ES.g96 - 1) * 100), 95);
// Fechas: publicación jueves 19-nov-2026; Black Friday viernes 27-nov-2026 (día después del cuarto jueves de noviembre).
const f7 = (s) => new Date(s + 'T12:00:00Z');
cuadra('reto-07 19-nov-2026 es jueves', f7('2026-11-19').getUTCDay(), 4);
cuadra('reto-07 27-nov-2026 es viernes', f7('2026-11-27').getUTCDay(), 5);
const jueves = [...Array(30)].map((_, i) => f7('2026-11-' + String(i + 1).padStart(2, '0'))).filter(x => x.getUTCDay() === 4);
cuadra('reto-07 cuarto jueves de noviembre = 26', jueves[3].getUTCDate(), 26);
cuadra('reto-07 días de la publicación al Black Friday', Math.round((f7('2026-11-27') - f7('2026-11-19')) / 864e5), 8);
// Desistimiento en compras a distancia (TRLGDCU, art. 104): 14 días naturales desde que lo recibes.
cuadra('reto-07 desistimiento: 14 días naturales', 14, 14);
// Lo que sale en pantalla además de las frases (gancho y escenas):
// alturas del gancho = √(coste por uso), normalizadas a 3,2 m entre las dos (el área es proporcional al coste por uso).
const alto7 = (pc, pz) => [3.2 * Math.sqrt(pc) / (Math.sqrt(pc) + Math.sqrt(pz)), 3.2 * Math.sqrt(pz) / (Math.sqrt(pc) + Math.sqrt(pz))].map(r2).join('|');
cuadra('reto-07 alturas en el uso 3', alto7(5, 40), '0.84|2.36');
cuadra('reto-07 alturas en el uso 40', alto7(3, 3), '1.6|1.6');
cuadra('reto-07 alturas en el uso 300', alto7(3, 0.4), '2.34|0.86');
cuadra('reto-07 insignia ×7,5 = 3 € ÷ 0,40 €', PU_C / PU_Z, 7.5);
cuadra('reto-07 tarjeta: 15 € ÷ 5 usos = 3 €/uso', CAMI / USOS_C, 3);
cuadra('reto-07 tarjeta: 120 € ÷ 300 usos = 0,40 €/uso', ZAPA / USOS_Z, 0.4);
cuadra('reto-07 la etiqueta «ROPA» encoge un 30 % (2,0 → 1,4 m)', r2(2.0 * (1 - 0.3)), 1.4);
cuadra('reto-07 línea de tiempo 1996 → 2018 (22 años)', 2018 - 1996, 22);

const SERIE = '30 DÍAS PARA ORDENAR TU DINERO', TOTAL = 30;

// ——— Día 7 · mundo 3D propio (se añade al de tres.js; solo existe en la página de este Reel) ———
// Etiquetas de precio colgadas de su cordón (textura que se redibuja solo cuando cambia el texto), la línea ámbar del cruce,
// las huellas turquesa, el cajón gris del armario (lo que no usas; no vale W.caja, que es turquesa), las etiquetas pequeñas que
// llueven, el polvo y las barras de la línea de tiempo. X7.apagar() al principio de cada fotograma: nada se cuela en otra escena.
const SCRIPT7 = `
function ver7(n, s, a, b) { if (!n) return; let p = a < -0.5 ? 1 : rebote(tramo(s, a - 0.1, a + 0.25)); if (b != null) p *= 1 - tramo(s, b - 0.12, b); aparece3(n, p); }
const PI7 = Math.PI, suave7 = (x) => x * x * (3 - 2 * x), mezcla7 = (P, Q, u) => P.map((v, j) => v + (Q[j] - v) * u);
const usos7 = (t) => t <= 0.65 ? 3 * Math.pow(40 / 3, Math.max(0, t) / 0.65) : 40 * Math.pow(300 / 40, Math.min(1, (t - 0.65) / 1.85));
const usosVis7 = (t) => Math.floor(usos7(t) + 1e-9);
const num7 = (v) => v.toFixed(2).replace('.', ',');
// Estilos de etiqueta: [fondo, tinta, texto secundario]. Rojo = lo que se escapa, turquesa = lo que controlas, ámbar = lo detectado.
const EST7 = { blanco: ['#f8fafc', '#0f172a', '#334155'], rojo: ['#dc2626', '#ffffff', '#fde2e2'], turq: ['#2dd4bf', '#042f2e', '#0b4a44'],
  ambar: ['#f5b94a', '#2a1a02', '#4a3008'], gris: ['#64748b', '#f1f5f9', '#cbd5e1'] };
const hex7 = (h) => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const mezHex7 = (a, b, u) => { const A = hex7(a), B = hex7(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * u).toString(16).padStart(2, '0')).join(''); };

// Dibujo de una etiqueta (lienzo 512 × 768). Modo normal: título, precio (tachable), cifra por uso enorme, unidad y «USOS n».
// Modo 'regla': PRECIO / barra / USOS REALES. o.insignia (0..1): pegatina ámbar «×7,5 POR USO» abajo a la derecha.
function pinta7(x, o) {
  const w = 512, h = 768;
  x.clearRect(0, 0, w, h);
  x.fillStyle = o.fondo; x.beginPath(); x.roundRect(4, 4, w - 8, h - 8, 50); x.fill();
  x.strokeStyle = o.sub; x.globalAlpha = 0.45; x.lineWidth = 7; x.beginPath(); x.roundRect(22, 22, w - 44, h - 44, 34); x.stroke(); x.globalAlpha = 1;
  x.save(); x.globalCompositeOperation = 'destination-out'; x.beginPath(); x.arc(256, 62, 22, 0, 2 * PI7); x.fill(); x.restore();
  x.strokeStyle = o.sub; x.lineWidth = 6; x.beginPath(); x.arc(256, 62, 31, 0, 2 * PI7); x.stroke();
  x.textAlign = 'center'; x.textBaseline = 'alphabetic';
  const fit = (txt, peso, max, ancho, fam) => { let f = max; x.font = peso + ' ' + f + 'px ' + (fam || 'Inter, sans-serif'); const a = x.measureText(txt).width; if (a > ancho) f = Math.floor(f * ancho / a); x.font = peso + ' ' + f + 'px ' + (fam || 'Inter, sans-serif'); return f; };
  if (o.modo === 'regla') {
    fit('ANTES DE PAGAR', '800', 46, 430); x.fillStyle = o.sub; x.fillText('ANTES DE PAGAR', 256, 168);
    fit('PRECIO', '900', 122, 440); x.fillStyle = o.tinta; x.fillText('PRECIO', 256, 318);
    if (o.div > 0) { x.fillStyle = o.tinta; x.fillRect(256 - 200 * o.div, 362, 400 * o.div, 16); }
    if (o.amb > 0) { x.globalAlpha = o.amb; x.fillStyle = '#f5b94a'; x.beginPath(); x.roundRect(48, 412, 416, 252, 30); x.fill(); x.globalAlpha = 1; }
    x.fillStyle = o.amb > 0.5 ? '#2a1a02' : o.tinta;
    fit('USOS', '900', 118, 420); x.fillText('USOS', 256, 518); fit('REALES', '900', 104, 400); x.fillText('REALES', 256, 630);
    return;
  }
  if (o.titulo) { fit(o.titulo, '900', 62, 430); x.fillStyle = o.sub; x.fillText(o.titulo, 256, 168); }
  if (o.precio) {
    fit(o.precio, '900', 118, 430); x.fillStyle = o.tinta; x.fillText(o.precio, 256, 286);
    if (o.tachado > 0) { const a = x.measureText(o.precio).width + 30; x.strokeStyle = o.fondo === EST7.rojo[0] ? '#ffffff' : '#ef4444'; x.lineWidth = 15; x.lineCap = 'round';
      x.beginPath(); x.moveTo(256 - a / 2, 268); x.lineTo(256 - a / 2 + a * o.tachado, 268 - 40 * o.tachado); x.stroke(); }
  }
  x.globalAlpha = 0.35; x.fillStyle = o.sub; x.fillRect(64, 322, 384, 6); x.globalAlpha = 1;
  if (o.porUso) { fit(o.porUso, '900', 196 * (o.pop || 1), 452 * Math.min(1.08, o.pop || 1)); x.fillStyle = o.colPor || o.tinta; x.fillText(o.porUso, 256, 482); }
  if (o.unidad) { fit(o.unidad, '800', 54, 430); x.fillStyle = o.sub; x.fillText(o.unidad, 256, 590); }
  if (o.usos) { x.globalAlpha = 0.16; x.fillStyle = o.tinta; x.beginPath(); x.roundRect(86, 624, 340, 90, 45); x.fill(); x.globalAlpha = 1;
    fit(o.usos, '700', 56, 300, 'DejaVu Sans Mono, monospace'); x.fillStyle = o.tinta; x.fillText(o.usos, 256, 688); }
}

const X7 = (() => {
  const W = W3, T = W.T, S = W.S, objs = [];
  const lienzo = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const tx = new T.CanvasTexture(c); tx.encoding = T.sRGBEncoding; tx.anisotropy = 8; return { c, x: c.getContext('2d'), tx, clave: null }; };
  const haloTx = (() => { const L = lienzo(128, 128), g = L.x.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.5, 'rgba(255,255,255,.6)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    L.x.fillStyle = g; L.x.fillRect(0, 0, 128, 128); L.tx.needsUpdate = true; return L.tx; })();

  // ——— etiquetas de precio: caja fina (3 cm) con el pivote arriba (el agujero) y el cordón hacia arriba ———
  const geoE = new T.BoxGeometry(1, 1, 0.03); geoE.translate(0, -0.5, 0);
  const geoCord = new T.CylinderGeometry(0.009, 0.009, 1, 6); geoCord.translate(0, 0.5, 0);
  const matCord = new T.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.6 });
  const tags = Array.from({ length: 4 }, () => {
    const g = new T.Group(); g.visible = false; S.add(g); objs.push(g);
    const L = lienzo(512, 768), frente = new T.MeshBasicMaterial({ map: L.tx, transparent: true, alphaTest: 0.05, toneMapped: false });
    const lado = new T.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 }), dorso = new T.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.7 });
    const m = new T.Mesh(geoE, [lado, lado, lado, lado, frente, dorso]); m.castShadow = true; g.add(m);
    const cord = new T.Mesh(geoCord, matCord); g.add(cord);
    return { g, m, L, frente, lado, dorso, cord };
  });
  // o = { x, y (arriba), z, rx, ry, rz, alto, estilo, estilo2, cq, titulo, precio, porUso, unidad, usos, pop, tachado, insignia, modo, div, amb, colPor, op, cordon }
  function etiqueta(i, o) {
    const E = tags[i], op = o.op == null ? 1 : o.op; if (op < 0.01) return;
    E.g.visible = true; E.g.position.set(o.x, o.y, o.z || 0); E.g.rotation.set(o.rx || 0, o.ry || 0, o.rz || 0);
    const alto = Math.max(0.02, o.alto); E.m.scale.set(alto * 2 / 3, alto, 1);
    E.cord.visible = o.cordon !== false; E.cord.scale.y = Math.max(0.01, 11 - o.y);
    E.frente.opacity = op; [E.lado, E.dorso].forEach(m => { m.transparent = op < 0.99; m.opacity = op; });
    const a = EST7[o.estilo || 'blanco'], b = EST7[o.estilo2 || o.estilo || 'blanco'], cq = Math.round(Math.max(0, Math.min(1, o.cq || 0)) * 12) / 12;
    const fondo = mezHex7(a[0], b[0], cq), tinta = cq < 0.5 ? a[1] : b[1], sub = cq < 0.5 ? a[2] : b[2];
    E.dorso.color.set(fondo);
    const r = (v, n) => Math.round((v || 0) * n) / n;
    const d = { modo: o.modo, titulo: o.titulo, precio: o.precio, porUso: o.porUso, unidad: o.unidad, usos: o.usos, colPor: o.colPor, fondo, tinta, sub,
      pop: r(o.pop == null ? 1 : o.pop, 40), tachado: r(o.tachado, 20), div: r(o.div, 20), amb: r(o.amb, 20) };
    const clave = JSON.stringify(d);
    if (clave !== E.L.clave) { E.L.clave = clave; pinta7(E.L.x, d); E.L.tx.needsUpdate = true; }
  }

  // ——— barras sueltas (la línea ámbar del cruce, la línea de tiempo y sus marcas) ———
  const barras = Array.from({ length: 6 }, () => { const m = new T.Mesh(new T.BoxGeometry(1, 1, 1), new T.MeshBasicMaterial({ color: 0xf5b94a, transparent: true, toneMapped: false })); m.visible = false; S.add(m); return m; });
  function barra(i, o) { const m = barras[i], op = o.op == null ? 1 : o.op; m.visible = op > 0.01; if (!m.visible) return;
    m.position.set(o.x, o.y, o.z || 0); m.scale.set(o.sx, o.sy, o.sz); m.material.color.set(o.color == null ? 0xf5b94a : o.color); m.material.opacity = op; m.material.depthWrite = op > 0.99; }

  // ——— huellas turquesa en el suelo ———
  const geoH = new T.PlaneGeometry(0.14, 0.3);
  const huellas = Array.from({ length: 24 }, () => { const m = new T.Mesh(geoH, new T.MeshBasicMaterial({ map: haloTx, color: 0x2dd4bf, transparent: true, depthWrite: false, blending: T.AdditiveBlending, toneMapped: false })); m.visible = false; S.add(m); return m; });
  function huella(i, o) { const m = huellas[i]; m.visible = o.op > 0.01; if (!m.visible) return; m.position.set(o.x, 0.016, o.z); m.rotation.set(-PI7 / 2, 0, o.rz || 0); m.material.opacity = o.op; }

  // ——— cajón gris del armario: cinco cajas (fondo, trasera, delantera baja y dos laterales), sin emisión ———
  const cajG = new T.Group(); cajG.visible = false; S.add(cajG); objs.push(cajG);
  const matCaj = new T.MeshStandardMaterial({ color: 0x475569, roughness: 0.75, metalness: 0.05 });
  [[2.0, 0.08, 1.2, 0, 0.04, 0], [2.0, 0.95, 0.08, 0, 0.475, -0.56], [2.0, 0.5, 0.08, 0, 0.25, 0.56], [0.08, 0.95, 1.2, -0.96, 0.475, 0], [0.08, 0.95, 1.2, 0.96, 0.475, 0]]
    .forEach(([w, h, d, x, y, z]) => { const m = new T.Mesh(new T.BoxGeometry(w, h, d), matCaj); m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; cajG.add(m); });
  function armario(o) { cajG.visible = true; cajG.position.set(o.x, 0, o.z); cajG.rotation.y = o.rot || 0; cajG.scale.setScalar(o.esc || 1); }

  // ——— etiquetas pequeñas (lluvia sobre el cajón): 3 texturas fijas ———
  const miniTx = ['9,99 €', '15 €', '19,99 €'].map(txt => { const L = lienzo(128, 192), x = L.x;
    x.fillStyle = '#f1f5f9'; x.beginPath(); x.roundRect(3, 3, 122, 186, 16); x.fill();
    x.save(); x.globalCompositeOperation = 'destination-out'; x.beginPath(); x.arc(64, 22, 9, 0, 2 * PI7); x.fill(); x.restore();
    x.fillStyle = '#0f172a'; x.font = '900 ' + (txt.length > 4 ? 34 : 46) + 'px Inter, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(txt, 64, 106);
    x.fillStyle = '#94a3b8'; x.fillRect(26, 150, 76, 8); L.tx.needsUpdate = true; return L.tx; });
  const geoMini = new T.PlaneGeometry(0.3, 0.45);
  const minis = Array.from({ length: 72 }, (_, i) => { const m = new T.Mesh(geoMini, new T.MeshStandardMaterial({ map: miniTx[i % 3], emissiveMap: miniTx[i % 3], emissive: 0xffffff, emissiveIntensity: 0.35, transparent: true, alphaTest: 0.1, side: T.DoubleSide, roughness: 0.6 }));
    m.castShadow = true; m.visible = false; S.add(m); return m; });
  const BLANCO_C = new T.Color(0xffffff), ROJO_C = new T.Color(0xef4444);
  function mini(i, o) { const m = minis[i]; m.visible = true; m.position.set(o.x, o.y, o.z); m.rotation.set(o.rx || 0, o.ry || 0, o.rz || 0);
    m.material.color.copy(BLANCO_C).lerp(ROJO_C, o.rojo || 0); m.material.emissive.copy(BLANCO_C).lerp(ROJO_C, o.rojo || 0); }

  // ——— polvo gris ———
  const polvos = Array.from({ length: 40 }, () => { const m = new T.Mesh(new T.BoxGeometry(0.03, 0.03, 0.03), new T.MeshStandardMaterial({ color: 0x94a3b8, transparent: true, roughness: 1 })); m.visible = false; S.add(m); return m; });
  function polvo(i, o) { const m = polvos[i]; m.visible = o.op > 0.01; if (!m.visible) return; m.position.set(o.x, o.y, o.z); m.rotation.set(o.y * 3, o.y * 2, 0); m.material.opacity = o.op; }

  // ——— insignia ámbar «×7,5 POR USO» (sprite: siempre de cara a la cámara) ———
  const insL = lienzo(256, 256); { const x = insL.x; x.fillStyle = '#f5b94a'; x.beginPath(); x.arc(128, 128, 122, 0, 2 * PI7); x.fill(); x.strokeStyle = '#2a1a02'; x.lineWidth = 6; x.stroke();
    x.fillStyle = '#2a1a02'; x.textAlign = 'center'; x.font = '900 84px Inter, sans-serif'; x.fillText('×7,5', 128, 140); x.font = '800 31px Inter, sans-serif'; x.fillText('POR USO', 128, 186); insL.tx.needsUpdate = true; }
  const insS = new T.Sprite(new T.SpriteMaterial({ map: insL.tx, transparent: true, depthWrite: false, toneMapped: false })); insS.visible = false; S.add(insS); objs.push(insS);
  function insignia(o) { insS.visible = o.esc > 0.01; insS.position.set(o.x, o.y, o.z || 0); insS.scale.setScalar(Math.max(0.001, o.esc)); insS.material.rotation = o.rot || 0; }

  function apagar() { objs.forEach(g => { g.visible = false; }); [barras, huellas, minis, polvos].forEach(a => a.forEach(m => { m.visible = false; })); }
  return { etiqueta, barra, huella, armario, mini, polvo, insignia, apagar };
})();
W3.X7 = X7;

// ——— el gancho (escena 0) ———
// Las dos etiquetas cuelgan con la parte de arriba a la misma altura (YT). Altura ∝ √(coste por uso) y la suma de las dos, 3,2 m:
// el área es proporcional a lo que cuesta cada uso. tau = tiempo de la escena 0.
const G7 = { XC: -0.92, XZ: 0.92, YT: 4.65, Z: 0 };
// tau < −0,15 solo se usa en la cola del cierre: las etiquetas bajan desde arriba y frenan donde empieza la caída del fotograma 0.
function caida7(tau) { return tau < -0.15 ? 0.9 + 14 * Math.pow(tau + 0.15, 2) : tau < 0.45 ? 0.9 * (1 - Math.pow((tau + 0.15) / 0.6, 2)) : -0.2 * Math.exp(-(tau - 0.45) / 0.28) * Math.sin((tau - 0.45) * 2 * PI7 * 2.3); }
function altos7(pc, pz) { const a = Math.sqrt(pc), b = Math.sqrt(pz); return [3.2 * a / (a + b), 3.2 * b / (a + b)]; }
function estado7(tau) {
  const u = usos7(tau), nZ = usosVis7(Math.max(0, tau)), nC = Math.min(5, nZ), [hC, hZ] = altos7(15 / Math.min(5, u), 120 / u);
  return { nC, nZ, hC, hZ, cq: sale(tramo(tau, 0.695, 0.8)) };
}
// Huellas del que camina: una por paso (cada π de fase), salen de sus pies y se quedan atrás apagándose.
function huellas7(X, hx, hz, g, fase, ritmo, tau, desde) {
  const atras = [-Math.sin(g), -Math.cos(g)], lado = [Math.cos(g), -Math.sin(g)], n = Math.floor(fase / PI7);
  for (let j = 0; j < 24; j++) {
    const jj = n - j; if (jj < 0) break;
    const dt = (fase - jj * PI7) / ritmo; if (tau - dt < desde) continue;
    const op = Math.max(0, 1 - dt / 1.1) * 0.9, d = 0.25 + 1.5 * dt, sl = jj % 2 ? 0.11 : -0.11;
    X.huella(j, { x: hx + atras[0] * d + lado[0] * sl, z: hz + atras[1] * d + lado[1] * sl, rz: g, op });
  }
}
function gancho7(W, X, tau, mPop, fin) {
  const st = estado7(tau), dy = caida7(tau), y = G7.YT + dy;
  const swC = 0.2 * Math.sin(6.2 * tau + 0.6) * Math.exp(-Math.max(0, tau) / 0.6) * (tau < 0.13 ? 1 : Math.exp(-(tau - 0.13) / 0.22)) + 0.035 * Math.sin(2.3 * tau) * tramo(tau, 0.8, 1.4);
  const swZ = 0.15 * Math.sin(5.1 * tau + 2.1) * Math.exp(-Math.max(0, tau) / 1.1);
  const golpe = tau > 2.5 ? 0.09 * Math.exp(-(tau - 2.5) / 0.16) * Math.sin((tau - 2.5) * 32) : 0;
  const popC = tau > 0.13 ? 1 + 0.16 * Math.sin(Math.min(1, (tau - 0.13) / 0.22) * PI7) : 1;
  const ins = tau < 2.5 ? 0 : sale(tramo(tau, 2.5, 2.68)) * (1 + 0.2 * Math.sin(tramo(tau, mPop, mPop + 0.35) * PI7)) * (1 - tramo(tau, 2.98, 3.12));
  X.etiqueta(0, { x: G7.XC, y, z: G7.Z, rz: swC, alto: st.hC, estilo: 'blanco', estilo2: 'rojo', cq: st.cq, titulo: 'CAMISETA', precio: '15 €',
    porUso: num7(15 / st.nC), unidad: '€ POR USO', usos: 'USOS ' + st.nC, pop: popC, tachado: sale(tramo(tau, 2.95, 3.25)) });
  X.insignia({ x: 0.27, y: G7.YT - 1.42 + dy, z: 0.2, esc: 0.62 * ins, rot: -0.18 });
  X.etiqueta(1, { x: G7.XZ, y: y + golpe, z: G7.Z, rz: swZ, alto: st.hZ, estilo: 'blanco', estilo2: 'turq', cq: st.cq, titulo: 'ZAPATILLAS', precio: '120 €',
    porUso: num7(120 / st.nZ), unidad: '€ POR USO', usos: 'USOS ' + st.nZ, tachado: sale(tramo(tau, fin - 0.7, fin - 0.4)) });
  // El cruce (uso 40, 0,65 s): una línea ámbar une las dos etiquetas a la misma altura.
  const pico = tramo(tau, 0.6, 0.66) * (1 - tramo(tau, 0.85, 1.05));
  X.barra(0, { x: 0, y: y - 1.6, z: 0.06, sx: 3.2, sy: 0.05, sz: 0.05, op: pico });
  // Maniquíes: el de las zapatillas camina en el sitio (cada paso, usos); el de la camiseta, quieto y algo más oscuro.
  const g = 0.35, ritmo = tau < 1 ? 11 : 16, fase = 11 * Math.max(0, tau) + 5 * Math.max(0, tau - 1);
  W.heroe({ x: G7.XZ, z: 0.15, gira: g, amp: 1, fase });
  huellas7(X, G7.XZ, 0.15, g, fase, ritmo, tau, 1.3);
  return { st, y };
}
function camGancho7(tau, fin, y) {
  // Hermite por fotogramas clave (no se para nunca); sacudida corta en el cruce.
  const K = [[0, [-3.3, 6.5, 6.9, -0.25, 3.55, 0]], [0.5, [-1.9, 4.9, 6.6, -0.05, 3.45, 0]], [0.9, [0.5, 4.4, 7.3, -0.05, 3.4, 0]],
    [1.3, [3.7, 4.0, 6.3, -0.1, 3.4, 0]], [1.7, [4.1, 3.2, 5.7, -0.2, 3.5, 0]], [2.1, [2.6, 5.6, 7.4, -0.25, 3.05, 0]],
    [2.5, [0.8, 4.8, 8.2, -0.25, 2.95, 0]], [2.85, [1.6, 4.3, 7.7, -0.2, 3.05, 0]], [3.15, [-1.6, 3.75, 6.0, -0.92, 3.3, 0]],
    [Math.max(3.3, fin - 0.95), [-1.0, 3.7, 5.6, -0.92, 3.32, 0]], [Math.max(3.45, fin - 0.75), [1.95, 4.25, 2.7, 0.95, 4.15, 0]], [fin + 0.3, [1.25, 4.2, 2.55, 0.92, 4.15, 0]]];
  // tau < 0 (cola del cierre): la cámara llega al primer fotograma clave con su misma velocidad, para que el bucle encadene.
  const C = tau < 0 ? K[0][1].map((v, c) => v + (K[1][1][c] - v) / K[1][0] * tau) : ruta7(K, tau);
  const dyc = 0.85 * Math.min(0.9, caida7(tau)) * (1 - tramo(tau, 0.45, 0.95)), sh = tau > 0.65 ? 0.07 * Math.exp(-(tau - 0.65) * 10) : 0;
  return [C[0] + sh * Math.sin(tau * 83), C[1] + dyc + sh * Math.cos(tau * 71), C[2], C[3], C[4] + dyc, C[5]];
}
// Cámara por fotogramas clave [[t, [px, py, pz, lx, ly, lz]]…] (spline de Hermite que nunca se para; de desmentido-en.js).
function ruta7(K, x) {
  if (x <= K[0][0]) return K[0][1];
  if (x >= K[K.length - 1][0]) return K[K.length - 1][1];
  let j = 0; while (x > K[j + 1][0]) j++;
  const [t0, P0] = K[j], [t1, P1] = K[j + 1], dt = t1 - t0, u = (x - t0) / dt;
  const vel = (n) => n === 0 ? K[1][1].map((v, c) => (v - K[0][1][c]) / (K[1][0] - K[0][0])) : n === K.length - 1 ? P0.map(() => 0)
    : K[n + 1][1].map((v, c) => (v - K[n - 1][1][c]) / (K[n + 1][0] - K[n - 1][0]));
  const V0 = vel(j), V1 = vel(j + 1), u2 = u * u, u3 = u2 * u;
  return P0.map((v, c) => (2 * u3 - 3 * u2 + 1) * v + (u3 - 2 * u2 + u) * dt * V0[c] + (-2 * u3 + 3 * u2) * P1[c] + (u3 - u2) * dt * V1[c]);
}
// Órbita: gira la posición de la cámara «ang» (rad) alrededor del eje vertical que pasa por el punto al que mira.
function orbita7(C, ang) { const dx = C[0] - C[3], dz = C[2] - C[5], c = Math.cos(ang), s_ = Math.sin(ang); return [C[3] + dx * c + dz * s_, C[1], C[5] - dx * s_ + dz * c, C[3], C[4], C[5]]; }
`;

const CSS7 = `
  .rt7 { position: absolute; left: 50%; top: 1330px; padding: 10px 30px 15px; border-radius: 20px; background: rgba(9,14,27,.9); border: 3px solid #e2e8f0;
    color: #fff; font-size: 62px; line-height: 1.1; font-weight: 900; letter-spacing: -.015em; white-space: nowrap; opacity: 0; font-variant-numeric: tabular-nums;
    box-shadow: 0 10px 40px rgba(0,0,0,.45); }
  .rt7.p { font-size: 50px; } .rt7.roja { border-color: #f87171; } .rt7.amb { border-color: #f5b94a; } .rt7.turq { border-color: #5eead4; }
  .rt7 .r { color: #f87171; } .rt7 .a { color: #f5b94a; } .rt7 .t { color: #5eead4; }
  .cu7 { position: absolute; left: 50%; top: 1290px; background: rgba(9,14,27,.9); border: 2px solid rgba(148,163,184,.35); border-radius: 22px;
    padding: 10px 34px 14px; text-align: center; white-space: nowrap; opacity: 0; box-shadow: 0 10px 40px rgba(0,0,0,.45); }
  .cu7 small { display: block; font: 700 22px/1.35 'DejaVu Sans Mono', monospace; letter-spacing: .14em; color: #94a3b8; }
  .cu7 .l { display: block; font-size: 48px; line-height: 1.15; font-weight: 900; color: #fff; font-variant-numeric: tabular-nums; letter-spacing: -.01em; }
  .cu7 .r { color: #f87171; } .cu7 .t { color: #5eead4; } .cu7 .a { color: #f5b94a; }
  .cu7 .fte { display: block; margin-top: 6px; font: 600 20px/1.3 'DejaVu Sans Mono', monospace; color: #94a3b8; }
  .nota7 { position: absolute; left: 70px; top: 1460px; max-width: 800px; font: 600 23px/1.32 'DejaVu Sans Mono', monospace; color: #b6c2d4; background: rgba(7,11,22,.8);
    border-radius: 10px; padding: 6px 14px; opacity: 0; }
  .fin .manana { max-width: 780px; } .fin .sigue { font-size: 48px; line-height: 1.2; } .fin .sigue .mala7 { color: #f87171; }`;

// Capa 2D del día 7: rótulos de 2–4 palabras en el tercio central-bajo (y ≈ 1.330 px) y tarjetas de cuenta (y ≈ 1.290 px).
const ESC7 = [
  // 0 · Gancho: «PRECIO ÷ USOS» ya puesto; en el cruce (0,65 s, mismo fotograma), «LA BARATA, MÁS CARA».
  { html: () => `<div class="rt7" data-t="translateX(-50%)">PRECIO ÷ USOS</div>
      <div class="rt7 roja" data-t="translateX(-50%)">LA BARATA, <span class="r">MÁS CARA</span></div>`,
    anim: function (s, e, el) { const r = el.querySelectorAll('.rt7'); r[0].style.opacity = s < 0.65 ? 1 : 0; r[0].style.transform = 'translateX(-50%)';
      const p = s < 0.65 ? 0 : 0.85 + 0.15 * rebote(tramo(s, 0.65, 0.85)); r[1].style.opacity = s < 0.65 ? 0 : 1; r[1].style.transform = 'translateX(-50%) scale(' + p + ')'; } },
  // 1 · La cuenta de los dos ejemplos (el resultado sale con el tic y con el ding).
  { html: () => `<div class="cu7" data-t="translateX(-50%)"><small>EJEMPLO</small><span class="l">${CAMI} € ÷ ${USOS_C} usos = <span class="r">${PU_C} €/uso</span></span></div>
      <div class="cu7" data-t="translateX(-50%)"><small>EJEMPLO</small><span class="l">${ZAPA} € ÷ ${USOS_Z} usos = <span class="t">${String(PU_Z.toFixed(2)).replace('.', ',')} €/uso</span></span></div>`,
    anim: function (s, e, el) { const M = e.seg[0].marcas, m0 = M[0] != null ? M[0] : 1.3, m1 = M[1] != null ? M[1] : 2.2, m2 = M[2] != null ? M[2] : 3.6, c = el.querySelectorAll('.cu7');
      ver7(c[0], s, 0.15, m1 - 0.05); ver7(c[1], s, m1 + 0.15);
      const r0 = c[0].querySelector('.r'), r1 = c[1].querySelector('.t'); r0.style.opacity = tramo(s, m0 - 0.05, m0 + 0.15); r1.style.opacity = tramo(s, m2 - 0.05, m2 + 0.15); } },
  // 2 · ¿Siempre lo caro? → 0 usos = 120 € por nada.
  { html: () => `<div class="rt7" data-t="translateX(-50%)">¿SIEMPRE LO CARO?</div>
      <div class="rt7 roja p" data-t="translateX(-50%)">0 USOS = <span class="r">120 € POR NADA</span></div>`,
    anim: function (s, e, el) { const M = e.seg[0].marcas, m0 = M[0] != null ? M[0] : 1.4, m2 = M[2] != null ? M[2] : 3.6, r = el.querySelectorAll('.rt7');
      ver7(r[0], s, 0.25, m0 + 0.6); ver7(r[1], s, m2 + 0.1); } },
  // 3 · La acción del día: antes de pagar, precio ÷ usos reales.
  { html: () => `<div class="cu7 amb" data-t="translateX(-50%)" style="border-color:rgba(245,185,74,.7)"><small>ANTES DE PAGAR</small><span class="l">PRECIO ÷ <span class="a">USOS REALES</span></span></div>`,
    anim: function (s, e, el) { const M = e.seg[0].marcas, m1 = M[1] != null ? M[1] : 2.4; ver7(el.querySelector('.cu7'), s, m1 + 0.05); } },
  // 4 · El dato (Comisión Europea; comprobado con Eurostat) y el gasto de los hogares (JRC 2021, citado por la Comisión).
  { html: () => `<div class="rt7 amb p" data-t="translateX(-50%)">ROPA EN LA UE: <span class="a">−30 % REAL</span></div>
      <div class="nota7">UE · 1996–2018 · precios descontada la inflación<br>Comisión Europea, COM(2022) 141 · Eurostat (IPCA)</div>
      <div class="cu7" data-t="translateX(-50%)" style="border-color:rgba(248,113,113,.6)"><small>UE · GASTO DE LOS HOGARES EN ROPA</small><span class="l"><span class="r">+14 %</span> (real, 2000–2018)</span>
        <span class="fte">JRC 2021, citado por la Comisión Europea</span></div>`,
    anim: function (s, e, el) { const M = e.seg.flatMap(g => g.marcas), R = e.seg.flatMap(g => g.res), m2 = M[2] != null ? M[2] : 4.6;
      const t30 = R[0] ? R[0].ini : 1.6, tG = R[1] ? R[1].ini : m2 + 1.3;
      ver7(el.querySelector('.rt7'), s, t30, m2 - 0.05); ver7(el.querySelector('.nota7'), s, 0.3, m2 - 0.05); ver7(el.querySelector('.cu7'), s, tG); } },
  // 5 · Tarjeta final de la serie: lo que se lleva el espectador (sin «Mañana» ni «Síguenos»). La frase va en dos líneas (no llega a
  // los botones de Instagram) y la parte mala, en rojo (lo que se escapa). Es la animación de finSerie más el fundido de la tarjeta en
  // los últimos 0,55 s, para que la cola enseñe las etiquetas del arranque y el bucle encadene.
  { html: (t, lang) => finSerie({ dia: 7, total: TOTAL, serie: SERIE, etiquetaManana: 'HOY · DÍA 7', manana: 'Antes de comprar: precio ÷ usos reales',
      sigue: '<span class="mala7">Lo barato que no usas</span><br>es lo más caro' }).html(t, lang) + '<div class="rt7" data-t="translateX(-50%)">PRECIO ÷ USOS</div>',
    anim: function (s, e, el) {
      const m = e.seg[0].marcas[0] != null ? e.seg[0].marcas[0] : 1.2, D = e.fin - e.ini;
      const n = el.querySelector('.num'); n.style.transform = 'scale(' + (0.8 + 0.2 * rebote(tramo(s, 0, 0.4))) + ')';
      const ma = el.querySelector('.manana'), p = sale(tramo(s, m - 0.1, m + 0.4)); ma.style.opacity = p; ma.style.transform = 'translateY(' + (1 - p) * 40 + 'px)';
      el.querySelector('.sigue').style.opacity = tramo(s, m + 0.9, m + 1.4);
      el.querySelector('.fin').style.opacity = 1 - tramo(s, D - 0.55, D - 0.15);
      const r = el.querySelector('.rt7'); r.style.opacity = tramo(s, D - 0.4, D - 0.2); r.style.transform = 'translateX(-50%)';   // el rótulo del fotograma 0
    } }
];

// Coreografía 3D del día 7 (una escena = un plano, corte seco; la cámara no se para nunca).
const TRES7 = function (t, k, s, e, W) {
  const X = W.X7; X.apagar();
  const D = e.fin - e.ini, p = Math.min(1, s / D), M = e.seg.flatMap(g => g.marcas), R = e.seg.flatMap(g => g.res);
  const mk = (j, def) => (M[j] != null ? M[j] : def);
  const q = (a, d) => sale(tramo(s, a, a + (d || 0.45)));
  const cam = (C) => W.camara(C[0], C[1], C[2], C[3], C[4], C[5]);
  const fuera = { x: -60, z: -60, esc: 0 };
  let directo = () => fuera;
  const XC = G7.XC, XZ = G7.XZ, YT = G7.YT;

  if (k === 0) {
    const fin = ESC[1].ini;
    const g0 = gancho7(W, X, s, mk(1, 2.6), fin);
    directo = (i) => i === 0 ? { x: XC, z: 0.1, rot: 0.15, amp: 0, color: 0x6b7280, cq: 0.45, brillo: 0 } : fuera;
    cam(camGancho7(s, fin, g0.y));
  } else if (k === 1) {
    // Parte A: cinco maniquíes pasan bajo la camiseta (cada uno, un uso; se encienden en rojo al pasar) y la fila se para.
    // Parte B (desde «Las zapatillas»): una fila continua pasa bajo las zapatillas y el contador sube de 5 a 300 hasta el ding.
    const m0 = mk(0, 1.3), m1 = mk(1, 2.2), m2 = mk(2, 3.6), paso = Math.max(0.17, (m0 - 0.3) / 4.2), pasa = (j) => 0.05 + j * paso, para = pasa(4) + 0.35, V = 2.3;
    const nC = Math.max(1, Math.min(5, 1 + Math.floor((s - 0.05) / paso + 1e-9)));
    const uZ = 5 * Math.pow(60, tramo(s, m1 + 0.1, m2)), nZ = Math.floor(uZ + 1e-9);
    const [hC, hZ] = altos7(15 / nC, 120 / uZ), cq = sale(tramo(uZ, 40, 52));
    // En la parte A las etiquetas cuelgan más bajas (3,35 m) para que la de la camiseta llene el plano con la fila debajo;
    // mientras la cámara cruza al lado de las zapatillas, suben a su altura (4,2 m).
    const sw = (a, f) => a * Math.sin(f * s), Y1 = 3.35 + 0.85 * suave7(tramo(s, m1 - 0.2, m1 + 0.6));
    X.etiqueta(0, { x: XC, y: Y1, rz: sw(0.03, 2.1), alto: hC, estilo: 'blanco', estilo2: 'rojo', cq, titulo: 'CAMISETA', precio: '15 €', porUso: num7(15 / nC), unidad: '€ POR USO', usos: 'USOS ' + nC,
      pop: 1 + 0.12 * Math.sin(Math.min(1, ((s - 0.05) % paso) / 0.15) * PI7) * (s < para ? 1 : 0) });
    // La de las zapatillas no está en la parte A (ni su sombra): aparece cuando la cámara empieza a cruzar hacia ella.
    X.etiqueta(1, { x: XZ, y: Y1, rz: sw(0.025, 1.7), alto: hZ, estilo: 'blanco', estilo2: 'turq', cq, titulo: 'ZAPATILLAS', precio: '120 €', porUso: num7(120 / nZ), unidad: '€ POR USO', usos: 'USOS ' + nZ,
      op: tramo(s, m1 - 0.6, m1 - 0.25) });
    X.barra(0, { x: 0, y: Y1 - 1.6, z: 0.06, sx: 3.2, sy: 0.05, sz: 0.05, op: tramo(uZ, 38, 40) * (1 - tramo(uZ, 46, 70)) });
    directo = (i, a) => {
      if (i < 5) {   // la fila de la camiseta, de derecha a izquierda
        const tt = Math.min(s, para), x = XC - V * (tt - pasa(i)), pasado = sale(tramo(s, pasa(i) - 0.04, pasa(i) + 0.12));
        return { x, z: 1.0, rot: -PI7 / 2, amp: s < para ? 1 : Math.max(0, 1 - (s - para) * 4), fase: tt * 13, color: 0xef4444, cq: 0.9 * pasado, brillo: 0.25, esc: Math.min(1, Math.max(0, (x + 4.2) / 0.8)) };
      }
      if (i < 17) {  // la fila continua de las zapatillas, de izquierda a derecha (en bucle)
        const L = 4.8, j = i - 5, u = (((s - m1 + 1.2) * 2.6 + j * L / 12) % L + L) % L, x = XZ - 2.2 + u;
        return { x, z: 1.3, rot: PI7 / 2, amp: 1, fase: s * 13, esc: (s > m1 - 0.4 ? 1 : 0) * Math.min(1, u / 0.6, (L - u) / 0.6), color: 0x2dd4bf, cq: 0.6 * sale(tramo(x, XZ - 0.05, XZ + 0.2)), brillo: 0.25 };
      }
      return fuera;
    };
    // Parte A: picado pegado al lado de la camiseta (la etiqueta de las zapatillas, con su 24,00, queda fuera de cuadro hasta el
    // cruce; la fila entera se ve debajo de la tarjeta) con travelling a la izquierda siguiendo la fila. En «Las zapatillas» cruza al otro lado y se abre para que quepan las
    // dos etiquetas enteras (desde ahí sus alturas se comparan); después, subida.
    const A = ruta7([[0, [-0.85, 6.1, 4.1, -0.75, 2.65, 0.3]], [1.1, [-1.25, 5.9, 3.7, -1.0, 2.62, 0.3]], [m1 - 0.4, [-1.55, 5.7, 3.6, -1.2, 2.6, 0.3]],
      [m1 + 0.5, [1.0, 3.05, 7.3, 0.15, 2.8, 0]], [m2, [1.2, 3.4, 7.8, 0.0, 2.8, 0]], [D + 0.2, [0.5, 3.8, 8.5, -0.2, 2.75, 0]]], s);
    cam(A);
  } else if (k === 2) {
    // El héroe mira las zapatillas grandes; en «No:» deja de andar y el contador baja a 0 (el coste por uso sube) y se vuelve
    // roja; en «son 120 euros por nada», la etiqueta se suelta y cae dentro del cajón gris del armario.
    const m0 = mk(0, 1.4), m2 = mk(2, 3.6), TX = 0.0, TY = 4.9, AL = 2.25, HX = 0.0, HZ = 1.7, BX = 1.85, BZ = 0.9;
    const v = tramo(s, m0 + 0.1, m2 - 0.2), n = v >= 1 ? 0 : Math.max(0, Math.round(300 * Math.pow(1 - v, 2.4)));
    const nada = n === 0, roja = sale(tramo(s, m0 + 0.15, m0 + 0.55)), cae = tramo(s, m2 + 0.05, m2 + 0.75), ec = cae * cae;
    const P0 = [TX, TY, 0], P1 = [BX - 0.35, 0.95, BZ], pc = mezcla7(P0, P1, ec); pc[1] += 0.15 * Math.sin(cae * PI7);
    X.armario({ x: BX, z: BZ, rot: -0.35 });
    X.etiqueta(1, { x: pc[0], y: pc[1], z: pc[2], rz: 0.03 * Math.sin(s * 1.9) + 1.3 * ec, rx: -1.2 * ec, alto: AL * (1 - 0.45 * ec), estilo: 'turq', estilo2: 'rojo', cq: roja,
      titulo: 'ZAPATILLAS', precio: '120 €', porUso: nada ? '120 €' : num7(120 / n), unidad: nada ? 'POR NADA' : '€ POR USO', usos: 'USOS ' + n, cordon: cae <= 0,
      pop: nada ? 1 + 0.15 * Math.sin(tramo(s, m2 - 0.2, m2 + 0.15) * PI7) : 1 });
    for (let i = 0; i < 40; i++) {   // polvo que cae sobre la etiqueta que nadie usa
      const t0 = m0 + 0.35 + (i % 20) * 0.11, u = (s - t0) / 2.2; if (u < 0 || u > 1 || cae > 0) continue;
      X.polvo(i, { x: TX + ((i * 0.618) % 1 - 0.5) * 1.4, y: TY + 1.4 - 2.6 * u, z: 0.25 + ((i * 0.37) % 1) * 0.3, op: 0.8 * Math.min(1, u * 5, (1 - u) * 3) });
    }
    const anda = 1 - tramo(s, m0 - 0.1, m0 + 0.25);
    W.heroe({ x: HX, z: HZ, gira: PI7 + 0.12, amp: anda, fase: s * 7 });
    let C;
    const O = orbita7([0.2, 2.5, 6.6, TX, 3.6, 0], -0.7);
    if (s < m0) C = ruta7([[0, [0.55, 1.0, 6.4, TX, 3.75, 0]], [m0 + 0.6, [0.4, 1.1, 5.7, TX, 3.7, 0]]], s);
    else if (s < m2) { const u = suave7(tramo(s, m0, m2)); C = orbita7(mezcla7([0.4, 1.1, 5.7, TX, 3.7, 0], [0.2, 2.5, 6.6, TX, 3.6, 0], u), -0.7 * u); }
    else {
      // Picado que sigue la caída: la cámara sube y baja hacia el cajón mientras mira al centro de la etiqueta (un poco hacia el
      // centro del cajón), así que la etiqueta no sale nunca del cuadro, no sube a los subtítulos y acaba entera dentro del cajón.
      const rx = -1.2 * ec, rz = 0.03 * Math.sin(s * 1.9) + 1.3 * ec, h2 = AL * (1 - 0.45 * ec) / 2;
      const cen = [pc[0] + Math.sin(rz) * h2, pc[1] - Math.cos(rz) * Math.cos(rx) * h2, pc[2] - Math.cos(rz) * Math.sin(rx) * h2];
      const P = ruta7([[m2, O.slice(0, 3)], [m2 + 0.55, [-1.0, 5.3, 7.4]], [D + 0.15, [2.55, 4.9, 5.6]]], s);
      const L = mezcla7(O.slice(3), [cen[0] - 0.2, cen[1] - 0.15, cen[2]], suave7(tramo(s, m2, m2 + 0.4)));
      C = [...P, ...L];
    }
    cam(C);
  } else if (k === 3) {
    // Día 7: la multitud corre hacia la puerta roja del Black Friday y el héroe se queda quieto y se enciende; delante de él,
    // la etiqueta de la regla (PRECIO ÷ USOS REALES): la barra sale en el tic y «USOS REALES» se enciende en ámbar en «de verdad».
    const m0 = mk(0, 0.9), m1 = mk(1, 2.4), tV = R[1] ? R[1].ini : m1 + 2, HX = 0, HZ = 1.5, DZ = -8;
    W.puerta({ x: 0, z: DZ, luz: 1 });
    W.rotulo('bf7', 'BLACK FRIDAY · 27 NOV', 0, 3.35, DZ, 1, '#f87171', 0.42);
    W.heroe({ x: HX, z: HZ, gira: 0, luz: 0.8 * sale(tramo(s, m0 - 0.35, m0 + 0.2)) });
    const CARR = [-3.3, -2.5, -1.75, 1.75, 2.5, 3.3];
    directo = (i, a) => {
      if (i >= 30) return fuera;
      const c = CARR[i % 6], L = 13, u = ((s * 2.9 + (i * 2.37) % L) % L + L) % L, z = HZ + 4.2 - u, x = c + 0.25 * Math.sin(i * 1.7);
      return { x, z, rot: PI7, amp: 1.2, fase: s * 13 + i, esc: Math.min(1, u / 1.2, Math.max(0, (z - DZ - 0.2) / 1.3)) };
    };
    const fl = 0.05 * Math.sin(s * 2.4);
    X.etiqueta(2, { modo: 'regla', x: HX + 0.9, y: 2.8 + fl, z: HZ + 0.2, rz: 0.04 * Math.sin(s * 1.6), alto: 1.2, estilo: 'blanco', div: q(m1 - 0.05, 0.3), amb: q(tV - 0.05, 0.3), cordon: false,
      op: q(m1 - 0.35, 0.3) });
    let C;
    if (s < m1) C = ruta7([[0, [0.55, 1.75, HZ + 4.0, HX, 1.55, HZ - 3]], [m1 + 0.5, [0.75, 2.05, HZ + 5.2, HX, 1.65, HZ - 3]]], s);
    else { const u = suave7(tramo(s, m1 - 0.1, D)); C = orbita7(mezcla7([0.75, 2.05, HZ + 5.6, HX + 0.45, 1.85, HZ], [0.6, 2.3, HZ + 5.4, HX + 0.45, 1.95, HZ], u), 0.15 - 0.95 * u); }
    cam(C);
  } else if (k === 4) {
    const m2 = mk(2, 4.6), t30 = R[0] ? R[0].ini : 1.6, f30 = R[0] ? R[0].fin : 2.4, tG = R[1] ? R[1].ini : m2 + 1.3;
    if (s < m2 - 0.02) {
      // Línea de tiempo 1996 → 2018 en el suelo; la etiqueta «ROPA» la recorre y encoge un 30 % en ámbar (precio descontada la inflación).
      const u = suave7(tramo(s, 0.25, f30 + 0.15)), tx = -2.6 + 5.2 * u, alto = 2.0 - 0.6 * u, ZL = 0.9;
      X.barra(0, { x: 0, y: 0.02, z: ZL, sx: 5.4, sy: 0.03, sz: 0.08, color: 0x64748b });
      X.barra(1, { x: -2.6, y: 0.02, z: ZL, sx: 0.07, sy: 0.04, sz: 0.5, color: 0xcbd5e1 });
      X.barra(2, { x: 2.6, y: 0.02, z: ZL, sx: 0.07, sy: 0.04, sz: 0.5, color: 0xcbd5e1 });
      X.barra(3, { x: (-2.6 + tx) / 2, y: 0.03, z: ZL, sx: Math.max(0.01, tx + 2.6), sy: 0.035, sz: 0.1, color: 0xf5b94a });
      W.rotulo('a96', '1996', -2.6, 0.2, ZL + 0.3, 1, '#cbd5e1', 0.3);
      W.rotulo('a18', '2018', 2.6, 0.2, ZL + 0.3, q(f30 - 0.35, 0.3), '#cbd5e1', 0.3);
      X.etiqueta(3, { x: tx, y: 3.45, z: 0, rz: 0.06 * Math.sin(s * 3.1) * (1 - u), alto, estilo: 'blanco', estilo2: 'ambar', cq: u, titulo: 'UNIÓN EUROPEA', precio: 'ROPA',
        porUso: u > 0.985 ? '−30 %' : '', unidad: 'PRECIO REAL', usos: String(Math.round(1996 + 22 * u)) });
      const C = ruta7([[0, [-2.1, 2.45, 7.4, -2.5, 2.1, 0.3]], [f30 + 0.15, [2.95, 2.55, 7.2, 2.55, 2.15, 0.3]], [m2, [3.3, 2.75, 6.6, 2.6, 2.2, 0.3]]], s);
      cam(C);
    } else {
      // «Y aun así»: llueven etiquetas pequeñas sobre el cajón gris, que se llena y desborda; en «gastaron más», se tiñen de rojo de abajo arriba.
      const BX = 0, BZ = 0, rojo0 = tG - 0.15;
      X.armario({ x: BX, z: BZ, rot: 0 });
      for (let i = 0; i < 72; i++) {
        const capa = Math.floor(i / 12), j = i % 12, fuera_ = capa >= 5;
        const px = fuera_ ? -0.9 + (j % 6) * 0.36 + 0.1 * Math.sin(i) : -0.75 + (j % 4) * 0.5 + 0.08 * Math.sin(i * 2.1), pz = fuera_ ? 0.78 + Math.floor(j / 6) * 0.32 : -0.4 + Math.floor(j / 4) * 0.4 + 0.06 * Math.cos(i * 1.3);
        const py = fuera_ ? 0.03 + 0.03 * (j % 3) : 0.12 + capa * 0.17 + 0.02 * Math.sin(i * 3.3);
        const t0 = m2 + 0.05 + i * 0.03, u = tramo(s, t0, t0 + 0.45); if (u <= 0) continue;
        const y = py + (6 - py) * (1 - u * u);
        const rojo = sale(tramo(s, rojo0 + py * 0.9, rojo0 + py * 0.9 + 0.3));
        X.mini(i, { x: px, y, z: pz, rx: -PI7 / 2 + 0.35 * Math.sin(i * 1.7) + (1 - u) * 3, ry: 0, rz: i * 0.9 + (1 - u) * 2, rojo });
      }
      const u = sale(tramo(s, m2, tG + 0.3));
      let C = mezcla7([2.4, 1.7, 4.8, 0, 0.7, 0], [1.6, 4.4, 4.6, 0, 0.6, 0.1], u);
      C = orbita7(C, -0.9 * sale(tramo(s, tG - 0.2, D)));
      cam(C);
    }
  } else if (s > D - 0.6) {
    // Cola (la tarjeta se funde en los últimos 0,55 s): las etiquetas blancas del fotograma 0 bajan desde arriba y la cámara llega
    // al encuadre del arranque. El último fotograma es casi el primero: al repetirse, el vídeo encadena.
    const fin = ESC[1].ini, g0 = gancho7(W, X, s - D, 2.6, fin);
    directo = (i) => i === 0 ? { x: XC, z: 0.1, rot: 0.15, amp: 0, color: 0x6b7280, cq: 0.45, brillo: 0 } : fuera;
    cam(camGancho7(s - D, fin, g0.y));
  } else {
    // Cierre (bajo la tarjeta de la serie): las dos etiquetas del final del gancho y el héroe turquesa caminando debajo.
    const [hC, hZ] = altos7(3, 0.4), fase = s * 9;
    X.etiqueta(0, { x: XC, y: YT, rz: 0.03 * Math.sin(s * 2), alto: hC, estilo: 'rojo', titulo: 'CAMISETA', precio: '15 €', porUso: num7(3), unidad: '€ POR USO', usos: 'USOS 5' });
    X.etiqueta(1, { x: XZ, y: YT, rz: 0.03 * Math.sin(s * 1.7 + 1), alto: hZ, estilo: 'turq', titulo: 'ZAPATILLAS', precio: '120 €', porUso: num7(0.4), unidad: '€ POR USO', usos: 'USOS 300' });
    W.heroe({ x: XZ, z: 0.15, gira: 0.35, amp: 1, fase, luz: 1 });
    huellas7(X, XZ, 0.15, 0.35, fase, 9, s, -1);
    directo = (i) => i === 0 ? { x: XC, z: 0.1, rot: 0.15, amp: 0, color: 0x6b7280, cq: 0.45, brillo: 0 } : fuera;
    cam(orbita7(mezcla7([0.3, 3.6, 7.6, 0, 2.9, 0], [0.2, 4.6, 8.4, 0, 2.8, 0], p), 0.25 - 0.5 * p));
  }
  W.multitud(t, { directo });
};

const pildoras = {
  'es-reto-01': pildora3d({
    slug: 'es-reto-01', cuenta: 'es',
    T: { es: {
      titulo: 'Día 1/30 · ¿A dónde se va tu sueldo?',
      guion: [
        [0, 'Cada mes entra tu sueldo… §y se te va *por todas partes*.'],
        [0, '¿Sabes exactamente a dónde? §Si la respuesta es «más o menos», *quédate*.'],
        [1, 'Porque lo que no ves, §*no lo puedes cambiar*.'],
        [2, '*Día uno*. Solo una cosa: §durante siete días, §*apunta cada gasto*. Sin cambiar nada. Solo mirar.'],
        [3, 'Y ponle una de tres etiquetas: §{pop}*fijo*, §{pop}*capricho* §{pop}o *ahorro*.'],
        [4, 'En una semana vas a ver §{ding}*el dibujo completo*. Y te va a sorprender.'],
        [5, 'Día uno de treinta para *ordenar tu dinero*. §Mañana: el gasto que se te escapa *sin darte cuenta*.']
      ]
    } },
    fijo: () => hud(1, TOTAL),
    escenas: [
      // 0 · Cenital: el caos. Tarjeta «dinero controlado: 0 %».
      { html: () => `<div class="dato" data-t="translateX(-50%)" style="top:1240px"><small>DINERO CONTROLADO</small><b class="rojo">0 %</b></div>`,
        anim: function (s, e, el) { const m = e.seg[0].marcas[0]; aparece3(el.querySelector('.dato'), rebote(tramo(s, m - 0.1, m + 0.3))); } },
      // 1 · A ras de suelo, entre los que pasan.
      { html: () => '', anim: null },
      // 2 · El héroe se enciende; rótulo con la tarea.
      { html: () => `<div class="rotulo" data-t="translateX(-50%)" style="top:580px">Apunta cada gasto · 7 días</div>`,
        anim: function (s, e, el) { const m = e.seg[0].marcas[1]; aparece3(el.querySelector('.rotulo'), rebote(tramo(s, m - 0.1, m + 0.3))); } },
      // 3 · Las tres zonas se encienden y cada uno va a la suya.
      { html: () => '', anim: null },
      // 4 · Grúa hacia arriba: el dibujo completo.
      { html: () => '', anim: null },
      // 5 · Tarjeta de la serie y el avance de mañana.
      finSerie({ dia: 1, total: TOTAL, serie: SERIE, etiquetaManana: 'MAÑANA · DÍA 2', manana: 'El gasto que se te escapa sin darte cuenta', sigue: '<b>Síguenos</b> para no perderte ningún día' })
    ],
    tres: function (t, k, s, e, W) {
      const p = Math.min(1, s / (e.fin - e.ini)), E3 = ESC[3], M3 = E3.seg[0].marcas, HX = 0, HZ = 7.4;
      // Cada grupo deja de vagar cuando se dice su etiqueta (escena 3).
      const orden = (i, a) => E3.ini + (M3[a.grupo] != null ? M3[a.grupo] : 1 + a.grupo * 0.6) + (i % 9) * 0.06;
      if (k === 0) {
        W.multitud(t);
        const a = -0.35 + 0.55 * p; W.camara(Math.sin(a) * 7, 25 - 5 * p, 3 + Math.cos(a) * 7, 0, 0, 0);
      } else if (k === 1) {
        W.multitud(t); W.niebla(7, 28);
        W.camara(-2.4 + 1.6 * p, 1.1, 5.4, 0.8, 1.25, -4);
      } else if (k === 2) {
        // Nadie pasa pegado a la cámara ni al héroe (sí por delante, a media distancia: da profundidad).
        const a = 0.6 - 0.85 * p, cx = HX + Math.sin(a) * 5.4, cz = HZ + Math.cos(a) * 5.4;
        W.multitud(t, { evita: [[HX, HZ, 2.3], [cx, cz, 3.4]] }); W.niebla(9, 32);
        W.heroe({ x: HX, z: HZ, luz: sale(tramo(s, 0.05, 0.6)) });
        W.camara(cx, 1.7, cz, HX, 1.62, HZ);
      } else if (k === 3) {
        W.multitud(t, { orden, evita: [[HX, HZ, 1.2]] });
        W.zonas([0, 1, 2].map(g => sale(tramo(s, (M3[g] != null ? M3[g] : 1) - 0.2, (M3[g] != null ? M3[g] : 1) + 0.3))));
        W.heroe({ x: HX, z: HZ, luz: 1, gira: Math.PI });
        W.camara(0, 19.6 - 0.6 * p, 15.5 - 0.5 * p, 0, 0, 1);
      } else if (k === 4) {
        const m = e.seg[0].marcas[0] != null ? e.seg[0].marcas[0] : 1, q = sale(p);
        W.multitud(t, { orden }); W.zonas([1, 1, 1]);
        const arriba = sale(tramo(s, m, m + 0.45));
        W.heroe({ x: HX, z: HZ, luz: 1, gira: Math.PI * (1 - sale(tramo(s, 0.2, 0.9))), brazos: arriba, y: Math.abs(Math.sin(s * 7)) * 0.12 * arriba });
        W.camara(0, 3.4 + 15.6 * q, 16.5 - 1.5 * q, 0, 1.4 - 1.4 * q, 2.2 - 1.2 * q);
      } else {
        W.multitud(t, { orden }); W.zonas([1, 1, 1]);
        W.heroe({ x: HX, z: HZ, luz: 1, brazos: 1 });
        const a = 0.28 * p; W.camara(Math.sin(a) * 14, 19 + 2 * p, 1 + Math.cos(a) * 14, 0, 0, 1);
      }
    },
    texto: { es: `Tu sueldo entra… y se te va por todas partes. ¿Sabes exactamente a dónde? 👀

Día 1 de 30 para ordenar tu dinero. Hoy, solo una cosa: durante 7 días apunta cada gasto y ponle una etiqueta: fijo, capricho o ahorro. Sin cambiar nada todavía. Solo mirar.

💾 Guárdalo y empieza hoy.
👉 Mañana, día 2: el gasto que se te escapa sin darte cuenta. Síguenos para no perderte ningún día.

#finanzaspersonales #ahorro #retodeahorro #educacionfinanciera #dinero` }
  }),

  // Día 2 · Suscripciones y cargos que se repiten: una fila que sale por una puerta roja sin que la mires.
  'es-reto-02': pildora3d({
    slug: 'es-reto-02', cuenta: 'es',
    T: { es: {
      titulo: 'Día 2/30 · El gasto que se te escapa sin darte cuenta',
      guion: [
        [0, 'Hay un gasto que sale de tu cuenta *todos los meses*… §y ni lo miras.'],
        [1, 'Suscripciones, apps, el gimnasio al que no vas. §Se cobran solas, §{tic}*una a una*.'],
        [2, 'Son pequeñas. §Por eso *nunca las revisas*.'],
        [3, '*Día dos*. §Abre tu banco §y busca los cargos que *se repiten*. Apúntalos todos.'],
        [4, 'Y hoy, §{ding}*cancela uno* que no uses. Solo uno.'],
        [5, 'Día dos de treinta para *ordenar tu dinero*. §Mañana: lo que vale de verdad *una hora de tu trabajo*.']
      ]
    } },
    fijo: () => hud(2, TOTAL),
    escenas: [
      { html: () => `<div class="dato" data-t="translateX(-50%)" style="top:1230px;left:69%"><small>SALE SOLO</small><b class="rojo">cada mes</b></div>`,
        anim: function (s, e, el) { const m = e.seg[0].marcas[0]; aparece3(el.querySelector('.dato'), rebote(tramo(s, m - 0.1, m + 0.3))); } },
      { html: () => '', anim: null },
      // Contador de cobros: sube cada vez que uno cruza la puerta (mismo ritmo que la fila: 1,3 m/s y 24,5/9 m entre ellos).
      { html: () => `<div class="dato" data-t="translateX(-50%)" style="top:540px"><small>COBROS AUTOMÁTICOS</small><b class="rojo">0</b></div>`,
        anim: function (s, e, el) { const d = el.querySelector('.dato'), paso = 24.5 / 9; aparece3(d, rebote(tramo(s, 0.1, 0.45)));
          d.querySelector('b').textContent = '+' + (1 + Math.floor((e.ini + s) * 1.3 / paso) - Math.floor(e.ini * 1.3 / paso)); } },
      { html: () => `<div class="rotulo" data-t="translateX(-50%)" style="top:580px">Busca lo que se repite</div>`,
        anim: function (s, e, el) { const m = e.seg[0].marcas[1]; aparece3(el.querySelector('.rotulo'), rebote(tramo(s, m - 0.1, m + 0.3))); } },
      { html: () => `<div class="rotulo" data-t="translateX(-50%)" style="top:580px">Hoy: cancela uno</div>`,
        anim: function (s, e, el) { const m = e.seg[0].marcas[0]; aparece3(el.querySelector('.rotulo'), rebote(tramo(s, m - 0.1, m + 0.3))); } },
      finSerie({ dia: 2, total: TOTAL, serie: SERIE, etiquetaManana: 'MAÑANA · DÍA 3', manana: 'Lo que vale de verdad una hora de tu trabajo', sigue: '<b>Síguenos</b> para no perderte ningún día' })
    ],
    tres: function (t, k, s, e, W) {
      const p = Math.min(1, s / (e.fin - e.ini)), NF = 9, LARGO = 24.5, PASO = LARGO / NF, VEL = 1.3, PZ = -7, HX = 2.3;
      const E3 = ESC[3], E4 = ESC[4];
      const tA = E3.ini + (E3.seg[0].marcas[1] != null ? E3.seg[0].marcas[1] : 2);     // la fila se para: «busca los cargos»
      const tC = E4.ini + (E4.seg[0].marcas[0] != null ? E4.seg[0].marcas[0] : 0.8);   // «cancela uno»
      const zFila = (i, tt) => 16 - (((tt * VEL + i * PASO) % LARGO) + LARGO) % LARGO;
      let kc = 0, mejor = 1e9; for (let i = 0; i < NF; i++) { const d = Math.abs(zFila(i, tA) - 2.5); if (d < mejor) { mejor = d; kc = i; } }
      const HZ = zFila(kc, tA);
      const EN = typeof LANG !== 'undefined' && LANG === 'en';   // la misma coreografía sirve al día 2 en inglés (reto-en.js)
      const NOMBRES = EN ? ['STREAMING', 'GYM', 'APP', 'CLOUD', 'MUSIC', 'GAMES', 'NEWS', 'INSURANCE', 'FREE TRIAL']
        : ['STREAMING', 'GIMNASIO', 'APP', 'NUBE', 'MÚSICA', 'JUEGOS', 'REVISTA', 'SEGURO', 'PRUEBA GRATIS'];
      const fila = (i) => {   // estado de cada uno de la fila en este instante
        const z = zFila(i, Math.min(t, tA)), parado = t > tA, retraso = 0.1 * Math.max(0, (HZ + 6 - z) / PASO);
        const visto = parado ? sale(tramo(t, tA + retraso, tA + retraso + 0.45)) : 0, fuera = i === kc ? sale(tramo(t, tC + 0.25, tC + 1.1)) : 0;
        return { z, parado, visto, fuera, esc: Math.min(1, Math.max(0, (z - PZ + 1.3) / 1.3)) * Math.min(1, (16 - z) / 1.5) * (1 - fuera) };
      };
      const directo = (i, a) => {
        if (i >= NF) {   // los demás van por dos «aceras» paralelas y no cruzan la fila
          const lado = i % 2 ? 1 : -1, dir = i % 3 ? -1 : 1, u = (((t * a.vel + a.u0) % 30) + 30) % 30 - 15;
          return { x: lado > 0 ? 7.6 + ((i * 2.37) % 7.5) : -(3.6 + ((i * 2.37) % 8)), z: dir * u, rot: dir > 0 ? 0 : Math.PI, amp: 1, fase: t * a.vel * 4.5, esc: Math.min(1, (15 - Math.abs(u)) / 2.5) };
        }
        const f = fila(i), giro = f.parado ? sale(tramo(t, tA, tA + 0.5)) : 0;
        return { x: 0, z: f.z, rot: Math.PI - (Math.PI / 2) * giro, amp: f.parado ? Math.max(0, 1 - (t - tA) * 3) : 1, fase: Math.min(t, tA) * VEL * 4.5, esc: f.esc,
          color: 0xef4444, cq: 0.92, brillo: 0.2, color2: i === kc && t > tC ? 0x475569 : 0xe2a336, c2q: i === kc && t > tC ? 1 : f.visto };
      };
      const rotulos = (alto) => { for (let i = 0; i < NF; i++) { const f = fila(i); if (f.esc > 0.6) W.etiqueta('f' + i, NOMBRES[i], 0, alto || 2.28, f.z, (f.esc - 0.6) / 0.4, f.visto > 0.5 ? '#e2a336' : '#f87171'); } };
      // En inglés (en-reto-02): como mucho 4 rótulos a la vez, los de los maniquíes más cercanos, enteros dentro del cuadro
      // (márgenes de 60 px), sin pisarse y todos con el mismo tamaño de letra (W.rotulo). Se llama después de W.camara.
      const rotulosEN = () => {
        const y = 2.28, cand = [];
        for (let i = 0; i < NF; i++) { const f = fila(i); if (f.esc > 0.6) cand.push({ i, f }); }
        cand.sort((a, b) => W.cam.position.distanceTo(new W.T.Vector3(0, y, a.f.z)) - W.cam.position.distanceTo(new W.T.Vector3(0, y, b.f.z)));
        const ok = [];
        for (const c of cand) {
          if (ok.length >= 4) break;
          const P = W.pantalla(0, y, c.f.z), d = W.cam.position.distanceTo(new W.T.Vector3(0, y, c.f.z));
          if (P.z > 1) continue;
          const ppm = 1920 / (2 * d * Math.tan(23 * Math.PI / 180)), ancho = W.anchoRotulo(NOMBRES[c.i]) * ppm / 2, alto = 0.352 * ppm / 2;
          if (P.x - ancho < 60 || P.x + ancho > 1020 || P.y - alto < 480 || P.y + alto > 1500) continue;
          if (ok.some(o => Math.abs(o.x - P.x) < o.w + ancho + 10 && Math.abs(o.y - P.y) < o.h + alto + 8)) continue;
          ok.push({ x: P.x, y: P.y, w: ancho, h: alto });
          W.rotulo('f' + c.i, NOMBRES[c.i], 0, y, c.f.z, (c.f.esc - 0.6) / 0.4, c.f.visto > 0.5 ? '#e2a336' : '#f87171');
        }
      };
      const luzPuerta = t > tC ? 1 - 0.5 * sale(tramo(t, tC, tC + 0.6)) : 1;
      W.puerta({ x: 0, z: PZ, luz: luzPuerta }); W.multitud(t, { directo });
      if (k === 0) {
        W.camara(5.4 - 1.4 * p, 6.4 - p, 13.5 - 2.5 * p, 0, 1.2, -3);
      } else if (k === 1) {
        if (!EN) rotulos(); W.niebla(11, 36);
        const cz = 5 - 0.9 * s; W.camara(4.4, 2.5, cz + 6, 0, 1.55, cz - 2.5);   // tres cuartos, acompañando a la fila
        if (EN) rotulosEN();
      } else if (k === 2) {
        W.niebla(9, 30);
        W.camara(-3.7 + 0.5 * p, 2.0, -0.8 - 0.6 * p, 0.2, 1.75, -7.2);
      } else if (k === 3) {
        if (!EN) rotulos(); W.heroe({ x: HX, z: HZ, luz: sale(tramo(s, 0.05, 0.55)), gira: -Math.PI / 2 });
        W.camara(6.4 - 0.8 * p, 4.3, HZ + 9 - p, 0.9, 1.5, HZ - 2.2);
        if (EN) rotulosEN();
      } else if (k === 4) {
        if (!EN) rotulos(); W.heroe({ x: HX, z: HZ, luz: 1, gira: -Math.PI / 2, senala: sale(tramo(t, tC - 0.4, tC - 0.05)) });
        W.etiqueta('hecho', EN ? 'CANCELED ✓' : 'CANCELADA ✓', 0, 1.5, HZ, sale(tramo(t, tC + 0.7, tC + 1.1)), '#5eead4');
        W.camara(3.3 - 0.3 * p, 2.05, HZ + 8 - 0.5 * p, 1.05, 1.9, HZ);
        if (EN) rotulosEN();
      } else {
        W.heroe({ x: HX, z: HZ, luz: 1, gira: -Math.PI / 2 + 0.9 * sale(tramo(s, 0, 0.8)) });
        const a = 0.25 * p; W.camara(4 + Math.sin(a) * 3, 8.5 + p, HZ + 10.5, 0, 0.6, HZ - 3.5);
      }
    },
    texto: { es: `Hay un gasto que sale de tu cuenta todos los meses… y ni lo miras. 👻

Día 2 de 30 para ordenar tu dinero: abre la app de tu banco, busca los cargos que se repiten (suscripciones, apps, cuotas) y apúntalos todos. Y hoy cancela uno que no uses. Solo uno.

💾 Guárdalo para hacerlo esta noche.
👉 Mañana, día 3: lo que vale de verdad una hora de tu trabajo. Síguenos para no perderte ningún día.

#finanzaspersonales #ahorro #suscripciones #retodeahorro #educacionfinanciera` }
  }),

  // Día 3 · Lo que vale una hora de tu trabajo: los precios, pasados a horas. Los maniquíes son aquí tus horas de trabajo.
  // El gancho: una fila de doce que se va por la puerta roja (120 € = 12 h). Al final, las mismas doce horas, detectadas
  // (ámbar), esperando delante de la puerta: ¿las dejas ir por unas zapatillas?
  'es-reto-03': pildora3d({
    slug: 'es-reto-03', cuenta: 'es',
    T: { es: {
      titulo: 'Día 3/30 · Lo que vale de verdad una hora de tu trabajo',
      guion: [
        [0, 'Ese capricho no cuesta 120 euros. §Cuesta *doce horas de tu vida*.'],
        [1, 'Haz la cuenta: tu sueldo neto, §entre las horas que trabajas al mes. §{ding}Eso vale *una hora tuya*.'],
        [2, 'Si cobras 1.600 y trabajas 160 horas, §{caja}son *diez euros la hora*.'],
        [3, '*Día tres*. §Calcula tu hora. §Y antes de comprar algo, *pásalo a horas*.'],
        [4, 'Unas zapatillas de 120: §{pop}doce horas trabajando. ¿Las siguen valiendo?'],
        [5, 'Día tres de treinta para *ordenar tu dinero*. §Mañana: el truco de las *24 horas* antes de comprar.']
      ]
    } },
    fijo: () => hud(3, TOTAL),
    cssExtra: `
      .cuenta { position: absolute; left: 50%; background: rgba(9,14,27,.88); border: 2px solid rgba(148,163,184,.3); border-radius: 24px;
        padding: 18px 44px 22px; text-align: center; white-space: nowrap; opacity: 0; }
      .cuenta small { display: block; font: 700 22px/1.3 'DejaVu Sans Mono', monospace; letter-spacing: .16em; color: #94a3b8; margin-bottom: 4px; }
      .cuenta .l { display: block; font-size: 56px; line-height: 1.18; font-weight: 900; letter-spacing: -.015em; color: #fff; font-variant-numeric: tabular-nums; }
      .cuenta .l.res { font-size: 80px; color: #5eead4; }
      .cuenta .l.ambar { color: #f5b94a; }`,
    escenas: [
      // 0 · La fila de doce se va por la puerta roja; «120 €» encima y la traducción a horas.
      { html: () => `<div class="dato" data-t="translateX(-50%)" style="top:1250px"><small>EN HORAS DE TRABAJO</small><b class="rojo">${PRECIO / HORA} HORAS</b></div>`,
        anim: function (s, e, el) { const m = e.seg[0].marcas[0]; aparece3(el.querySelector('.dato'), rebote(tramo(s, m - 0.1, m + 0.3))); } },
      // 1 · La cuenta, paso a paso; el héroe (una hora tuya) se enciende en el «ding».
      { html: () => `<div class="cuenta" data-t="translateX(-50%)" style="top:520px"><small>LA CUENTA</small>
          <span class="l">Sueldo neto</span><span class="l">÷ horas al mes</span><span class="l res">= 1 hora tuya</span></div>`,
        anim: function (s, e, el) { const M = e.seg[0].marcas, c = el.querySelector('.cuenta'), l = c.querySelectorAll('.l');
          aparece3(c, rebote(tramo(s, 0.15, 0.5)));
          [-1, M[0], M[1]].forEach((m, i) => { const q = i === 0 ? 1 : sale(tramo(s, m - 0.1, m + 0.25)); l[i].style.opacity = q; l[i].style.transform = 'translateY(' + (1 - q) * 18 + 'px)'; }); } },
      // 2 · El ejemplo: 1.600 € ÷ 160 h = 10 €/h.
      { html: () => `<div class="cuenta" data-t="translateX(-50%)" style="top:520px"><small>EJEMPLO</small>
          <span class="l">${SUELDO.toLocaleString('es-ES', { useGrouping: 'always' })} € ÷ ${HORAS} h</span><span class="l res">= ${HORA} €/h</span></div>`,
        anim: function (s, e, el) { const m = e.seg[0].marcas[0], c = el.querySelector('.cuenta'), l = c.querySelectorAll('.l');
          aparece3(c, rebote(tramo(s, 0.1, 0.45))); const q = rebote(tramo(s, m - 0.1, m + 0.3)); l[1].style.opacity = Math.min(1, q * 1.5); l[1].style.transform = 'scale(' + (0.7 + 0.3 * q) + ')'; } },
      // 3 · La tarea del día.
      { html: () => `<div class="rotulo" data-t="translateX(-50%)" style="top:540px">Calcula tu hora</div>
          <div class="rotulo" data-t="translateX(-50%)" style="top:640px">Antes de comprar: pásalo a horas</div>`,
        anim: function (s, e, el) { const M = e.seg[0].marcas, r = el.querySelectorAll('.rotulo');
          aparece3(r[0], rebote(tramo(s, M[0] - 0.1, M[0] + 0.3))); aparece3(r[1], rebote(tramo(s, M[1] - 0.1, M[1] + 0.3))); } },
      // 4 · Zapatillas de 120 €: doce horas se separan del mes y esperan delante de la puerta.
      { html: () => `<div class="cuenta" data-t="translateX(-50%)" style="top:520px"><small>ZAPATILLAS</small>
          <span class="l">${PRECIO} € ÷ ${HORA} €/h</span><span class="l res ambar">= ${PRECIO / HORA} horas</span></div>`,
        anim: function (s, e, el) { const m = e.seg[0].marcas[0], c = el.querySelector('.cuenta'), l = c.querySelectorAll('.l');
          aparece3(c, rebote(tramo(s, 0.1, 0.45))); const q = rebote(tramo(s, m - 0.1, m + 0.3)); l[1].style.opacity = Math.min(1, q * 1.5); l[1].style.transform = 'scale(' + (0.7 + 0.3 * q) + ')'; } },
      finSerie({ dia: 3, total: TOTAL, serie: SERIE, etiquetaManana: 'MAÑANA · DÍA 4', manana: 'El truco de las 24 horas antes de comprar', sigue: '<b>Síguenos</b> para no perderte ningún día' })
    ],
    tres: function (t, k, s, e, W) {
      // Mundo del día: un bloque de 7 × 6 maniquíes grises (tus horas del mes) con el héroe delante; las columnas 5 y 6
      // son las doce horas del gancho (i 0..11). La puerta roja, a la derecha y al fondo.
      const p = Math.min(1, s / (e.fin - e.ini)), BX = -0.6, DX = 3.4, DZ = -5.4, HX = -0.6, HZ = 3.3, NQ = 12;
      const E4 = ESC[4], tP = E4.ini + (E4.seg[0].marcas[0] != null ? E4.seg[0].marcas[0] : 1.4);   // «doce horas»
      const enBloque = (i) => { const c = i < NQ ? 5 + i % 2 : (i - NQ) % 5, r = i < NQ ? Math.floor(i / 2) : Math.floor((i - NQ) / 5); return [BX + (c - 3) * 0.8, 1 - r * 0.95]; };
      const enFila = (j) => [DX + (j % 2 - 0.5) * 0.8, 1 - Math.floor(j / 2) * 0.95];
      const aceras = (i, a) => { const lado = i % 2 ? 1 : -1, dir = i % 3 ? -1 : 1, u = (((t * a.vel + a.u0) % 30) + 30) % 30 - 15;
        return { x: DX + (lado > 0 ? 7.6 + ((i * 2.37) % 7.5) : -(4.6 + ((i * 2.37) % 8))), z: DZ + 7 + dir * u, rot: dir > 0 ? 0 : Math.PI, amp: 1, fase: t * a.vel * 4.5, esc: Math.min(1, (15 - Math.abs(u)) / 2.5) }; };
      let directo;
      if (k === 0) {
        // Gancho: las doce en fila india hacia la puerta (en bucle: siempre hay doce en la fila).
        const LARGO = 15, PASO = LARGO / NQ, VEL = 1.2;
        directo = (i, a) => {
          if (i >= NQ) return aceras(i, a);
          const z = DZ + LARGO - (((t * VEL + i * PASO) % LARGO) + LARGO) % LARGO;
          return { x: DX, z, rot: Math.PI, amp: 1, fase: t * VEL * 4.5, color: 0xef4444, cq: 0.92, brillo: 0.2,
            esc: Math.min(1, Math.max(0, (z - DZ + 0.2) / 1.2)) * Math.min(1, (DZ + LARGO - z) / 1.5) };
        };
      } else {
        directo = (i, a) => {
          if (i >= 42) return { x: -40, z: -40, esc: 0 };
          const [bx, bz] = enBloque(i), mece = 0.06 * Math.sin(t * 0.8 + i * 1.7);
          if (i >= NQ || t < tP) return { x: bx, z: bz, rot: mece };
          // Las doce horas de las zapatillas: se separan del bloque hacia la puerta y se quedan esperando (ámbar: detectadas).
          const t0 = tP + (i % 2) * 0.12 + Math.floor(i / 2) * 0.07, q = tramo(t, t0, t0 + 1.7), ee = q * q * (3 - 2 * q), [fx, fz] = enFila(i);
          const rot = q < 0.15 ? giro(0, Math.PI / 2, q / 0.15) : q < 0.85 ? Math.PI / 2 : giro(Math.PI / 2, Math.PI, (q - 0.85) / 0.15);
          return { x: bx + (fx - bx) * ee, z: bz + (fz - bz) * ee, rot, amp: q < 1 ? Math.min(1, (1 - q) * 6, q * 8) : 0, fase: (t - t0) * 7,
            color: 0xe2a336, cq: sale(tramo(t, t0 - 0.1, t0 + 0.4)), brillo: 0.3 };
        };
      }
      const giro = (a, b, q) => a + (b - a) * q;
      W.multitud(t, { directo });
      W.puerta({ x: DX, z: DZ, luz: k === 0 ? 1 : 0.8 });
      if (k === 0) {
        W.etiqueta('precio', '120 €', DX, 3.5, DZ, 1, '#f87171', 2.3);
        W.niebla(12, 40);
        W.camara(DX + 5.4 - 1.4 * p, 6.4 - p, DZ + 20.5 - 2.5 * p, DX, 1.2, DZ + 4);
      } else if (k === 1) {
        const M = e.seg[0].marcas, luz = sale(tramo(s, (M[1] != null ? M[1] : 3) - 0.1, (M[1] != null ? M[1] : 3) + 0.5));
        W.heroe({ x: HX, z: HZ, luz, y: 0.05 * luz * Math.max(0, Math.sin((s - (M[1] || 3)) * 9)) });
        W.niebla(10, 34);
        W.camara(HX + 1.8 - 0.5 * p, 3.0, HZ + 7.8 - 0.6 * p, HX + 0.2, 1.75, HZ - 1.5);
      } else if (k === 2) {
        const m = e.seg[0].marcas[0] != null ? e.seg[0].marcas[0] : 2;
        W.heroe({ x: HX, z: HZ, luz: 1 });
        W.etiqueta('hora', '10 €/h', HX, 2.3, HZ, sale(tramo(s, m - 0.05, m + 0.35)), '#5eead4', 0.95);
        W.niebla(8, 28);
        W.camara(HX + 2.2 - 0.5 * p, 2.1, HZ + 6.4 - 0.6 * p, HX + 0.2, 2.05, HZ - 0.6);
      } else if (k === 3) {
        W.heroe({ x: HX, z: HZ, luz: 1, brazos: 0 });
        W.etiqueta('hora', '10 €/h', HX, 2.3, HZ, 1, '#5eead4', 0.95);
        W.niebla(10, 34);
        const a = -0.55 + 0.75 * p; W.camara(HX + Math.sin(a) * 7, 2.4, HZ + Math.cos(a) * 7, HX, 1.9, HZ - 1.5);
      } else if (k === 4) {
        const q = sale(tramo(t, tP + 1.4, tP + 2.4));
        W.heroe({ x: HX, z: HZ, luz: 1, gira: (Math.PI / 2) * 0.6 * q });
        W.etiqueta('hora', '10 €/h', HX, 2.35, HZ, 1, '#5eead4', 1.05);
        W.etiqueta('doce', '12 HORAS', DX, 2.65, -1.4, sale(tramo(t, tP + 1.5, tP + 2)), '#e2a336', 1.8);
        W.niebla(14, 46);
        W.camara(1.0 + 0.3 * p, 4.6 - 0.2 * p, 15.5 - 0.8 * p, 1.1, 2.0, -1.5);
      } else {
        W.heroe({ x: HX, z: HZ, luz: 1, gira: Math.PI / 2 * 0.6 });
        const a = 0.2 * p; W.camara(4.4 + Math.sin(a) * 6, 9 + p, 12.5, 0.3, 0.4, -2);
      }
    },
    texto: { es: `Ese capricho de 120 € no cuesta 120 €. Cuesta 12 horas de tu vida. ⏳

Día 3 de 30 para ordenar tu dinero. Hoy, una cuenta: tu sueldo neto ÷ las horas que trabajas al mes = lo que vale tu hora. Y desde hoy, antes de comprar algo, divide el precio entre tu hora: eso es lo que te cuesta en tiempo de tu vida.

💾 Guárdalo y haz la cuenta hoy.
👉 Mañana, día 4: el truco de las 24 horas antes de comprar. Síguenos para no perderte ningún día.

#finanzaspersonales #ahorro #retodeahorro #educacionfinanciera #dinero` }
  }),

  // Día 4 · La regla de las 24 horas: las ganas de comprar llegan en segundos y muchas veces se van solas.
  // Sin datos ni estadísticas: es una regla práctica. Enlaza con el día 3 (pasar el precio a horas de trabajo).
  'es-reto-04': pildora3d({
    slug: 'es-reto-04', cuenta: 'es',
    T: { es: {
      titulo: 'Día 4/30 · El truco de las 24 horas antes de comprar',
      guion: [
        [0, '¿Lo quieres, §o lo quieres *ahora*? No es lo mismo.'],
        [1, 'Las ganas de comprar llegan en segundos. §Y muchas veces, §{pop}se van solas *en un día*.'],
        [2, '*Día cuatro*. §Si no es comida ni una urgencia, §{tic}espera *24 horas* antes de pagar.'],
        [3, 'Déjalo en el carrito y §pásalo a horas de trabajo, como ayer. §{ding}Si mañana lo sigues queriendo, *cómpralo tranquilo*.'],
        [4, 'Y si mañana ni te acuerdas, §{caja}ese dinero *se queda contigo*.'],
        [5, 'Día cuatro de treinta para *ordenar tu dinero*. §Mañana: *págate a ti primero*, el mismo día que cobras.']
      ]
    } },
    fijo: () => hud(4, TOTAL),
    cssExtra: `
      .reloj24 { position: absolute; left: 50%; top: 520px; text-align: center; background: rgba(9,14,27,.88); border: 3px solid rgba(245,185,74,.7);
        border-radius: 26px; padding: 14px 44px 20px; white-space: nowrap; opacity: 0; }
      .reloj24 small { display: block; font: 700 23px/1.35 'DejaVu Sans Mono', monospace; letter-spacing: .14em; color: #f5b94a; }
      .reloj24 b { display: block; font: 800 112px/1.05 'DejaVu Sans Mono', monospace; color: #fff; letter-spacing: -.02em; }`,
    escenas: [
      // 0 · El héroe ante la puerta roja: «LO QUIERO» → «LO QUIERO YA».
      { html: () => '', anim: null },
      // 1 · Las ganas (rojas) corren hacia la puerta; en el pop se apagan y se dispersan.
      { html: () => '', anim: null },
      // 2 · Reloj de 24 horas que empieza a correr en el tic.
      { html: () => `<div class="reloj24" data-t="translateX(-50%)"><small>SI NO ES COMIDA NI UNA URGENCIA</small><b>24:00:00</b></div>
          <div class="rotulo" data-t="translateX(-50%)" style="top:790px">Espera 24 horas antes de pagar</div>`,
        anim: function (s, e, el) {
          const M = e.seg[0].marcas, m0 = M[0] != null ? M[0] : 0.8, m1 = M[1] != null ? M[1] : 2.5, r = el.querySelector('.reloj24');
          aparece3(r, rebote(tramo(s, m0 - 0.1, m0 + 0.3))); aparece3(el.querySelector('.rotulo'), rebote(tramo(s, m1 - 0.1, m1 + 0.3)));
          const q = Math.max(0, 24 * 3600 - Math.max(0, s - m1) * 900), h = Math.floor(q / 3600), mi = Math.floor(q / 60) % 60, se = Math.floor(q) % 60;
          r.querySelector('b').textContent = [h, mi, se].map(x => String(x).padStart(2, '0')).join(':'); } },
      // 3 · El carrito (caja turquesa) guarda la compra: «= 12 horas de trabajo»; en el ding la puerta se vuelve turquesa.
      { html: () => `<div class="rotulo" data-t="translateX(-50%)" style="top:560px">= 12 horas de trabajo</div>
          <div class="rotulo" data-t="translateX(-50%)" style="top:660px">¿Mañana lo quieres? Cómpralo tranquilo</div>`,
        anim: function (s, e, el) { const M = e.seg[0].marcas, r = el.querySelectorAll('.rotulo');
          aparece3(r[0], rebote(tramo(s, (M[0] != null ? M[0] : 1.5) - 0.1, (M[0] != null ? M[0] : 1.5) + 0.3)));
          aparece3(r[1], rebote(tramo(s, (M[1] != null ? M[1] : 3.5) - 0.1, (M[1] != null ? M[1] : 3.5) + 0.3))); } },
      // 4 · La compra se desvanece y las doce horas de ayer vuelven contigo, en turquesa.
      { html: () => `<div class="dato" data-t="translateX(-50%)" style="top:540px"><small>SE QUEDA CONTIGO</small><b>12 horas</b></div>`,
        anim: function (s, e, el) { const m = e.seg[0].marcas[0] != null ? e.seg[0].marcas[0] : 1.2; aparece3(el.querySelector('.dato'), rebote(tramo(s, m + 0.4, m + 0.8))); } },
      finSerie({ dia: 4, total: TOTAL, serie: SERIE, etiquetaManana: 'MAÑANA · DÍA 5', manana: 'Págate a ti primero, el mismo día que cobras', sigue: '<b>Síguenos</b> para no perderte ningún día' })
    ],
    tres: function (t, k, s, e, W) {
      const p = Math.min(1, s / (e.fin - e.ini)), DZ = -6, HX = 0, HZ = 1.5, CX = 1.7, CZ = 2.3, NQ = 12;
      const mk = (kk, j, def) => ESC[kk].ini + (ESC[kk].seg[0].marcas[j] != null ? ESC[kk].seg[0].marcas[j] : def);
      const ROJO = 0xef4444, TURQ = 0x2dd4bf, AMBAR = 0xe2a336;
      const fuera = { x: -60, z: -60, esc: 0 };
      let directo = () => fuera;
      W.puerta({ x: 0, z: DZ, luz: k === 2 ? 0.55 : 1 });
      if (k === 0) {
        const m0 = mk(0, 0, 1);
        W.heroe({ x: HX, z: HZ, gira: Math.PI, luz: 0.15, senala: sale(tramo(t, m0, m0 + 0.4)) });
        const ya = sale(tramo(t, m0 - 0.05, m0 + 0.3));
        W.etiqueta('quiero', 'LO QUIERO', 0, 3.35, DZ, 1 - ya, '#f87171', 1.7);
        W.etiqueta('quieroya', 'LO QUIERO YA', 0, 3.35, DZ, ya, '#f87171', 1.7 * (1 + 0.06 * Math.sin(t * 9) * ya));
        W.camara(1.5 - 0.3 * p, 2.3, 6.6 - 0.8 * p, 0, 1.7, DZ + 1);
      } else if (k === 1) {
        const tP = mk(1, 1, 2.6);
        directo = (i, a) => {
          if (i >= 9) return fuera;
          const x0 = (i % 3 - 1) * 0.9, z0 = 4.6 + Math.floor(i / 3) * 1.1, tt = Math.min(t, tP) - e.ini, z = z0 - 3.1 * tt;
          const d = sale(tramo(t, tP, tP + 1.2)), lado = i % 2 ? 1 : -1, ang = lado * (0.6 + (i % 3) * 0.35);
          return { x: x0 + Math.sin(ang) * 3.2 * d, z: z - Math.cos(ang) * 0.4 * d, rot: Math.PI - ang * d, amp: 1 - 0.75 * d, fase: t * 10 * (1 - 0.6 * d),
            esc: 1 - 0.85 * sale(tramo(t, tP + 0.6, tP + 1.6)), color: ROJO, cq: 0.92 * (1 - d), brillo: 0.25 };
        };
        W.niebla(10, 40);
        W.camara(4.4 - 0.8 * p, 3.4, 11 - 0.6 * p, 0, 1.0, -2.4);
      } else if (k === 2) {
        W.heroe({ x: HX, z: HZ, gira: Math.PI * (1 - sale(tramo(s, 0.1, 0.9))), luz: 0.4 + 0.6 * sale(tramo(s, 0.3, 1)) });
        W.niebla(9, 34);
        W.camara(1.8 - 0.4 * p, 2.0, HZ + 6 - 0.6 * p, 0, 2.25, HZ - 2);
      } else if (k === 3) {
        const m0 = mk(3, 0, 1.5), m1 = mk(3, 1, 3.5), ca = sale(tramo(s, 0.15, 0.85)), va = tramo(t, m1 + 0.3, m1 + 4.5);
        W.caja({ x: CX, z: CZ, rot: -0.3, luz: 1, item: { y: 0.45 + 2.2 * (1 - ca) * (1 - ca) } });
        W.etiqueta('doceh', '12 HORAS', CX, 1.75, CZ, sale(tramo(t, m0 - 0.05, m0 + 0.3)), '#e2a336', 1.2);
        W.puerta({ x: 0, z: DZ, luz: 1, color: TURQ, cq: sale(tramo(t, m1 - 0.05, m1 + 0.5)) });
        W.heroe({ x: HX, z: HZ + (DZ - 0.5 - HZ) * va, gira: va > 0 ? Math.PI : -0.4, luz: 1, amp: va > 0 && va < 1 ? 0.75 : 0, fase: t * 6 });
        W.camara(6.2 - 0.8 * p, 4.6, 11.8 - 0.8 * p, 0.2, 1.2, -2.2);
      } else if (k === 4) {
        const tC = mk(4, 0, 1.2);
        W.caja({ x: CX, z: CZ, rot: -0.3, luz: 1, item: { op: 1 - sale(tramo(s, 0.1, 0.9)) } });
        W.heroe({ x: HX, z: HZ, gira: 0, luz: 1 });
        directo = (i, a) => {
          if (i >= NQ) return fuera;
          const x0 = 1.3 + (i % 2) * 0.8, z0 = DZ + 1.4 + Math.floor(i / 2) * 0.9, x1 = -1.6 - (i % 2) * 0.8, z1 = 0.9 - Math.floor(i / 2) * 0.9;
          const t0 = tC + (i % 2) * 0.1 + Math.floor(i / 2) * 0.08, q = tramo(t, t0, t0 + 2.2), ee = q * q * (3 - 2 * q);
          return { x: x0 + (x1 - x0) * ee, z: z0 + (z1 - z0) * ee, rot: q <= 0 ? 0 : q < 1 ? Math.atan2(x1 - x0, z1 - z0) : 0, amp: q > 0 && q < 1 ? 1 : 0, fase: (t - t0) * 7,
            color: AMBAR, cq: 0.9, brillo: 0.3, color2: TURQ, c2q: sale(tramo(t, t0, t0 + 0.6)) };
        };
        W.etiqueta('doce', '12 HORAS', -2, 2.6, -1.6, sale(tramo(t, tC + 2.2, tC + 2.7)), '#5eead4', 1.2);
        W.camara(0.4 - 0.3 * p, 6.8, 12.6 - 0.6 * p, -0.2, 0.4, -2);
      } else {
        W.heroe({ x: HX, z: HZ, luz: 1 });
        directo = (i, a) => i >= NQ ? fuera : { x: -1.6 - (i % 2) * 0.8, z: 0.9 - Math.floor(i / 2) * 0.9, color: TURQ, cq: 0.9, brillo: 0.3 };
        const a = 0.25 * p; W.camara(3 + Math.sin(a) * 3, 8 + p, 11, -0.5, 0.4, -2);
      }
      W.multitud(t, { directo });
    },
    texto: { es: `¿Lo quieres, o lo quieres ahora? No es lo mismo. ⏳

Día 4 de 30 para ordenar tu dinero. La regla de hoy: si no es comida ni una urgencia, espera 24 horas antes de pagar. Déjalo en el carrito y pásalo a horas de trabajo, con la cuenta de ayer (precio ÷ lo que vale tu hora).
Un truco para que funcione: borra la tarjeta guardada en las tiendas online. Tener que sacarla otra vez te da esos segundos para pensarlo.

💾 Guárdalo para tu próxima compra.
👉 Mañana, día 5: págate a ti primero, el mismo día que cobras. Síguenos para no perderte ningún día.

#finanzaspersonales #ahorro #retodeahorro #educacionfinanciera #dinero` }
  }),

  // Día 5 · Págate a ti primero: transferencia automática el mismo día que cobras. Ejemplo (no estadística): si cobras
  // 1.600 €, un 5 % son 80 € al mes y 960 € al año. En pantalla, la nómina son 20 maniquíes: cada uno, 80 € (el 5 %).
  'es-reto-05': pildora3d({
    slug: 'es-reto-05', cuenta: 'es',
    T: { es: {
      titulo: 'Día 5/30 · Págate a ti primero, el mismo día que cobras',
      guion: [
        [0, 'Si ahorras lo que te sobra a final de mes, §ya sabes cuánto te sobra: §{pop}*nada*.'],
        [1, 'El truco es darle la vuelta. §El día que cobras la nómina, §lo primero que pagas *eres tú*.'],
        [2, '*Día cinco*. §Programa una transferencia automática a otra cuenta §{tic}*el mismo día que cobras*.'],
        [3, 'Empieza pequeño: §un 5 % del sueldo. §Si cobras 1.600 euros, §{caja}*80 al mes*.'],
        [4, 'Lo que no ves en tu cuenta, §{ding}*no te lo gastas*. §Y en un año son *960 euros*.'],
        [5, 'Día cinco de treinta para *ordenar tu dinero*. §Mañana: *las comisiones del banco* que puedes dejar de pagar.']
      ]
    } },
    fijo: () => hud(5, TOTAL),
    cssExtra: `
      .cal { position: absolute; left: 50%; top: 510px; text-align: center; background: rgba(9,14,27,.9); border: 3px solid rgba(245,185,74,.75);
        border-radius: 24px; padding: 12px 40px 18px; white-space: nowrap; opacity: 0; }
      .cal small { display: block; font: 700 23px/1.35 'DejaVu Sans Mono', monospace; letter-spacing: .14em; color: #f5b94a; }
      .cal b { display: block; font-size: 66px; line-height: 1.1; font-weight: 900; color: #fff; letter-spacing: -.02em; }
      .cuenta5 { position: absolute; left: 50%; top: 510px; background: rgba(9,14,27,.9); border: 2px solid rgba(94,234,212,.5); border-radius: 24px;
        padding: 14px 42px 18px; text-align: center; white-space: nowrap; opacity: 0; }
      .cuenta5 small { display: block; font: 700 23px/1.35 'DejaVu Sans Mono', monospace; letter-spacing: .14em; color: #94a3b8; }
      .cuenta5 .l { display: block; font-size: 54px; line-height: 1.18; font-weight: 900; color: #fff; font-variant-numeric: tabular-nums; }
      .cuenta5 .t { color: #5eead4; }`,
    escenas: [
      // 0 · Fin de mes: la nómina se ha ido por la puerta; el héroe mira la caja de «lo que sobra»: 0 €.
      { html: () => '', anim: null },
      // 1 · Día de cobro: entra la nómina (20 maniquíes) y el primero se vuelve turquesa y se aparta: eres tú.
      { html: () => '', anim: null },
      // 2 · La caja «AHORRO», el calendario ámbar «DÍA DE COBRO» y, en el tic, «AUTOMÁTICO».
      { html: () => `<div class="cal" data-t="translateX(-50%)"><small>CADA MES</small><b>DÍA DE COBRO</b></div>
          <div class="rotulo" data-t="translateX(-50%)" style="top:700px">Transferencia AUTOMÁTICA</div>`,
        anim: function (s, e, el) { const M = e.seg[0].marcas, m0 = M[0] != null ? M[0] : 0.6, m1 = M[1] != null ? M[1] : 3;
          aparece3(el.querySelector('.cal'), rebote(tramo(s, m0 - 0.1, m0 + 0.3))); aparece3(el.querySelector('.rotulo'), rebote(tramo(s, m1 - 0.1, m1 + 0.3))); } },
      // 3 · La cuenta: 5 % de 1.600 € = 80 € al mes (uno de los 20 maniquíes).
      { html: () => `<div class="cuenta5" data-t="translateX(-50%)"><small>SI COBRAS ${SUELDO.toLocaleString('es-ES', { useGrouping: 'always' })} €</small>
          <span class="l">${SUELDO.toLocaleString('es-ES', { useGrouping: 'always' })} € × ${PCT} %</span><span class="l t">= ${MES5} € al mes</span></div>`,
        anim: function (s, e, el) { const M = e.seg[0].marcas, c = el.querySelector('.cuenta5'), l = c.querySelectorAll('.l');
          aparece3(c, rebote(tramo(s, (M[1] != null ? M[1] : 1.2) - 0.1, (M[1] != null ? M[1] : 1.2) + 0.3)));
          const m = M[2] != null ? M[2] : 2.4, q = rebote(tramo(s, m - 0.1, m + 0.3)); l[1].style.opacity = Math.min(1, q * 1.5); l[1].style.transform = 'scale(' + (0.7 + 0.3 * q) + ')'; } },
      // 4 · El turquesa entra en la caja y el resto se va al mes; contador «12 meses → 960 €».
      { html: () => `<div class="cuenta5" data-t="translateX(-50%)"><small>EN UN AÑO</small><span class="l"><span class="mes">1 mes</span> → <span class="t eur">80 €</span></span></div>`,
        anim: function (s, e, el) { const M = e.seg[0].marcas, m = M[1] != null ? M[1] : 2.2, c = el.querySelector('.cuenta5');
          aparece3(c, rebote(tramo(s, m - 0.1, m + 0.3))); const n = 1 + Math.round(11 * tramo(s, m + 0.1, m + 1.4));
          c.querySelector('.mes').textContent = n + (n === 1 ? ' mes' : ' meses'); c.querySelector('.eur').textContent = (n * 80).toLocaleString('es-ES') + ' €'; } },
      finSerie({ dia: 5, total: TOTAL, serie: SERIE, etiquetaManana: 'MAÑANA · DÍA 6', manana: 'Las comisiones del banco que puedes dejar de pagar', sigue: '<b>Síguenos</b> para no perderte ningún día' })
    ],
    tres: function (t, k, s, e, W) {
      const p = Math.min(1, s / (e.fin - e.ini)), N = 20, DX = -1.4, DZ = -7.5, HX = 0.7, HZ = 2.9, CX = 2.3, CZ = 1.6;
      const mk = (kk, j, def) => ESC[kk].ini + (ESC[kk].seg[0].marcas[j] != null ? ESC[kk].seg[0].marcas[j] : def);
      const TURQ = 0x2dd4bf, ROJO = 0xef4444;
      const fuera = { x: -60, z: -60, esc: 0 };
      const rejilla = (i) => [-2.6 + (i % 4) * 0.8, 0.6 - Math.floor(i / 4) * 0.9];
      const yo = [1.45, 2.35];   // el «tú» turquesa, junto al héroe y la caja
      let directo = () => fuera, cajaItem = null;
      W.puerta({ x: DX, z: DZ, luz: k === 0 || k === 4 ? 1 : 0.5 });
      const tYo = mk(1, 1, 3);   // «lo primero que pagas eres tú»
      if (k === 0) {
        const m1 = mk(0, 1, 2.6);
        directo = (i, a) => {   // la nómina, en fila india hacia la puerta (en bucle)
          if (i >= 10) return fuera;
          const L = 12, z = DZ + L - (((t * 1.3 + i * L / 10) % L) + L) % L;
          return { x: DX, z, rot: Math.PI, amp: 1, fase: t * 6, color: ROJO, cq: 0.85, brillo: 0.2, esc: Math.min(1, Math.max(0, (z - DZ + 0.2) / 1.2)) * Math.min(1, (DZ + L - z) / 1.5) };
        };
        W.heroe({ x: HX, z: HZ, luz: 0.15, gira: 1.15 });
        W.caja({ x: CX, z: CZ, rot: -0.3, luz: 0.4 });
        W.etiqueta('sobra', 'LO QUE SOBRA', CX, 1.55, CZ, 1, '#e2a336', 1.1);
        W.etiqueta('cero', '0 €', CX, 2.15, CZ, sale(tramo(t, m1 - 0.05, m1 + 0.3)), '#f87171', 1.3 + 0.15 * rebote(tramo(t, m1, m1 + 0.4)));
        W.camara(5.0 - 0.5 * p, 3.6, 10.2 - 0.5 * p, 0.0, 1.3, -1.5);
      } else if (k === 1) {
        directo = (i, a) => {
          if (i >= N) return fuera;
          const [gx, gz] = rejilla(i), t0 = e.ini + 0.1 + (i % 4) * 0.05 + Math.floor(i / 4) * 0.18, q = tramo(t, t0, t0 + 1.6), ee = q * q * (3 - 2 * q), x0 = gx - 7;
          let x = x0 + (gx - x0) * ee, z = gz, rot = Math.PI / 2, amp = q < 1 ? 1 : 0;
          if (q >= 1) rot = giro(Math.PI / 2, 0, tramo(t, t0 + 1.6, t0 + 1.9));
          if (i === 0) { const v = tramo(t, tYo + 0.2, tYo + 1.5), ev = v * v * (3 - 2 * v); if (v > 0) { x = gx + (yo[0] - gx) * ev; z = gz + (yo[1] - gz) * ev; rot = v < 1 ? Math.atan2(yo[0] - gx, yo[1] - gz) : 0; amp = v < 1 ? 1 : 0; } }
          return { x, z, rot, amp, fase: (t - t0) * 7, color: i === 0 ? TURQ : null, cq: i === 0 ? sale(tramo(t, tYo - 0.05, tYo + 0.4)) : 0, brillo: 0.35 };
        };
        W.heroe({ x: HX, z: HZ, luz: 0.3 + 0.7 * sale(tramo(t, tYo, tYo + 0.6)), gira: -0.6 });
        W.caja({ x: CX, z: CZ, rot: -0.3, luz: 0.4 });
        W.etiqueta('nomina', 'NÓMINA', -1.4, 2.6, -1.2, sale(tramo(t, mk(1, 0, 1.5) - 0.05, mk(1, 0, 1.5) + 0.3)), '#cbd5e1', 1.2);
        W.camara(2.6 - 0.4 * p, 6.4, 11.4 - 0.6 * p, -0.4, 0.4, -1);
      } else if (k === 2) {
        directo = (i, a) => i >= N ? fuera : i === 0 ? { x: yo[0], z: yo[1], rot: 0.3, color: TURQ, cq: 1, brillo: 0.35 } : { x: rejilla(i)[0], z: rejilla(i)[1], rot: 0 };
        W.heroe({ x: HX, z: HZ, luz: 1, gira: 0.5 });
        W.caja({ x: CX, z: CZ, rot: -0.3, luz: 1 });
        W.etiqueta('ahorro', 'AHORRO', CX, 1.45, CZ, 1, '#5eead4', 0.9);
        W.camara(4.6 - 0.5 * p, 2.4, 7.2 - 0.6 * p, 1.4, 1.35, 1.0);
      } else if (k === 3) {
        const m2 = mk(3, 2, 2.4);
        directo = (i, a) => i >= N ? fuera : i === 0 ? { x: yo[0], z: yo[1], rot: 0.3, color: TURQ, cq: 1, brillo: 0.35 } : { x: rejilla(i)[0], z: rejilla(i)[1], rot: 0.04 * Math.sin(t + i) };
        W.heroe({ x: HX, z: HZ, luz: 1, gira: -0.5 });
        W.caja({ x: CX, z: CZ, rot: -0.3, luz: 1 });
        W.etiqueta('mil6', '1.600 €', -1.4, 2.55, -1.2, sale(tramo(s, 0.2, 0.6)), '#cbd5e1', 1.2);
        W.etiqueta('ochenta', '80 €', yo[0], 2.3, yo[1], sale(tramo(t, m2 - 0.05, m2 + 0.3)), '#5eead4', 1.1);
        W.camara(1.2 - 0.4 * p, 7.0, 12.2 - 0.5 * p, -0.4, 2.2, -0.4);
      } else if (k === 4) {
        const tD = mk(4, 0, 1.2), entra = tramo(s, 0.1, 1.2);
        directo = (i, a) => {
          if (i >= N) return fuera;
          if (i === 0) { const ee = entra * entra * (3 - 2 * entra); return { x: yo[0] + (CX - yo[0]) * ee, z: yo[1] + (CZ - yo[1]) * ee, rot: Math.atan2(CX - yo[0], CZ - yo[1]), amp: entra < 1 ? 1 : 0, fase: t * 7, esc: 1 - sale(tramo(s, 0.8, 1.3)), color: TURQ, cq: 1, brillo: 0.35 }; }
          const [gx, gz] = rejilla(i), t0 = e.ini + 0.4 + i * 0.08, q = tramo(t, t0, t0 + 3), ee = q * q * (3 - 2 * q);
          const x = gx + (DX - gx) * ee, z = gz + (DZ - gz) * ee;
          return { x, z, rot: q > 0 ? Math.atan2(DX - gx, DZ - gz) : 0, amp: q > 0 && q < 1 ? 1 : 0, fase: (t - t0) * 7, esc: 1 - sale(tramo(t, t0 + 2.4, t0 + 3)) };
        };
        cajaItem = { y: 0.42, op: sale(tramo(s, 1.0, 1.4)), color: TURQ };
        W.heroe({ x: HX, z: HZ, luz: 1, gira: 0.9, brazos: sale(tramo(t, tD, tD + 0.4)) });
        W.caja({ x: CX, z: CZ, rot: -0.3, luz: 1, item: cajaItem });
        W.camara(5.4 - 0.6 * p, 4.4, 9.6 - 0.6 * p, 0.2, 1.0, -1.6);
      } else {
        W.heroe({ x: HX, z: HZ, luz: 1, brazos: 1 });
        W.caja({ x: CX, z: CZ, rot: -0.3, luz: 1, item: { y: 0.42, color: TURQ } });
        const a = 0.25 * p; W.camara(3 + Math.sin(a) * 3, 6 + p, 9.5, 0.8, 0.8, 0);
      }
      function giro(a, b, q) { return a + (b - a) * q; }
      W.multitud(t, { directo });
    },
    texto: { es: `Si ahorras lo que te sobra a final de mes, ya sabes cuánto te sobra. 🫠

Día 5 de 30 para ordenar tu dinero. Hoy: programa una transferencia automática a otra cuenta el mismo día que cobras la nómina. Empieza por un 5 %: si cobras 1.600 €, son 80 € al mes.
Ponle nombre a esa cuenta («Colchón», «Viaje»…), así sabes para qué es. Y si cobras en fecha variable, prográmala para el día siguiente al que suele llegar la nómina.

💾 Guárdalo y prográmala hoy.
👉 Mañana, día 6: las comisiones del banco que puedes dejar de pagar. Síguenos para no perderte ningún día.

#ahorro #finanzaspersonales #retodeahorro` }
  }),

  // Día 6 · Las comisiones del banco. Fuentes: ASUFIN, VII Barómetro de comisiones bancarias (18-may-2026): comisión media
  // de mantenimiento no bonificada 167,27 €/año (160 € en el VI, may-2025; recogido por Finantres e Infobae/Europa Press).
  // Orden ECE/228/2019, art. 3: cuenta de pago básica, máximo 3 €/mes. RD 164/2019: gratuita para personas vulnerables.
  // RDL 19/2017 (cap. III) y Orden ECE/228/2019: traslado de cuentas, lo gestiona el banco receptor, máx. 13 días hábiles
  // (Banco de España, Portal del Cliente Bancario). Primer día de la serie sin anuncio del siguiente (petición del propietario).
  'es-reto-06': pildora3d({
    slug: 'es-reto-06', cuenta: 'es',
    T: { es: {
      titulo: 'Día 6/30 · Las comisiones del banco que puedes dejar de pagar',
      guion: [
        [0, 'Tu banco puede cobrarte *solo por tener la cuenta*. §Si no cumples sus condiciones, §{pop}de media, *más de 160 euros al año*.'],
        [1, 'Es la comisión de mantenimiento. §Muchos bancos la quitan §si *domicilias la nómina* o pagas recibos con ellos.'],
        [2, '*Día seis*. §Abre tu extracto, §{tic}busca *mantenimiento* y *tarjeta*, §y suma lo de este año.'],
        [3, 'Si te cobran, §pide que te lo quiten §o cámbiate: §{ding}por ley, el *banco nuevo* se encarga de trasladar tus recibos.'],
        [4, 'Y si no puedes cumplir condiciones, §existe la *cuenta de pago básica*: §como mucho, *3 euros al mes*.'],
        [5, 'Día seis de treinta. §El dinero que no se va en comisiones §{pop}*también es ahorro*.']
      ]
    } },
    fijo: () => hud(6, TOTAL),
    cssExtra: `
      .com6 { position: absolute; left: 50%; top: 520px; background: rgba(9,14,27,.9); border: 2px solid rgba(245,185,74,.7); border-radius: 24px;
        padding: 14px 42px 18px; text-align: center; white-space: nowrap; opacity: 0; }
      .com6 small { display: block; font: 700 23px/1.35 'DejaVu Sans Mono', monospace; letter-spacing: .14em; color: #94a3b8; }
      .com6 .l { display: block; font-size: 58px; line-height: 1.16; font-weight: 900; color: #fff; }
      .com6 .r { color: #f87171; } .com6 .t { color: #5eead4; } .com6 .a { color: #f5b94a; }
      .com6 .fte { display: block; margin-top: 8px; font: 600 21px/1.3 'DejaVu Sans Mono', monospace; color: #94a3b8; letter-spacing: .02em; }`,
    escenas: [
      // 0 · La cuenta cobra: monedas rojas que se van por la puerta del banco; «MANTENIMIENTO» y, en el pop, «+160 € al año».
      { html: () => `<div class="com6" data-t="translateX(-50%)"><small>SI NO CUMPLES CONDICIONES</small><span class="l">más de <span class="r">160 € al año</span></span>
          <span class="fte">Media de mantenimiento · ASUFIN, 2026</span></div>`,
        anim: function (s, e, el) { const M = e.seg[0].marcas, m = M[1] != null ? M[1] : 2.6, c = el.querySelector('.com6');
          aparece3(c, 1); const q = rebote(tramo(s, m - 0.1, m + 0.35)); c.querySelector('.r').style.transform = 'scale(' + (1 + 0.18 * Math.sin(Math.PI * q)) + ')'; c.querySelector('.r').style.display = 'inline-block'; } },
      // 1 · Las condiciones: «NÓMINA» y «RECIBOS»; la puerta se vuelve turquesa y deja de salir dinero.
      { html: () => '', anim: null },
      // 2 · Día 6: busca en el extracto «mantenimiento» y «tarjeta».
      { html: () => `<div class="com6" data-t="translateX(-50%)"><small>EN TU EXTRACTO, BUSCA</small><span class="l a">Mantenimiento</span><span class="l a">Tarjeta</span></div>`,
        anim: function (s, e, el) { const M = e.seg[0].marcas, c = el.querySelector('.com6'), l = c.querySelectorAll('.l'), m = M[1] != null ? M[1] : 1.6;
          aparece3(c, rebote(tramo(s, m - 0.2, m + 0.2))); l[1].style.opacity = tramo(s, m + 0.5, m + 0.9); } },
      // 3 · Pide que te lo quiten o cámbiate: el héroe lleva la caja de recibos a la puerta turquesa (el banco nuevo).
      { html: () => `<div class="rotulo" data-t="translateX(-50%)" style="top:560px">El banco nuevo traslada tus recibos</div>`,
        anim: function (s, e, el) { const M = e.seg[0].marcas, m = M[2] != null ? M[2] : 3; aparece3(el.querySelector('.rotulo'), rebote(tramo(s, m - 0.1, m + 0.3))); } },
      // 4 · La cuenta de pago básica: como mucho 3 € al mes.
      { html: () => `<div class="com6" data-t="translateX(-50%)" style="border-color:rgba(94,234,212,.6)"><small>CUENTA DE PAGO BÁSICA</small><span class="l">como mucho <span class="t">3 € al mes</span></span>
          <span class="fte">Orden ECE/228/2019 · gratis para personas vulnerables (RD 164/2019)</span></div>`,
        anim: function (s, e, el) { const M = e.seg[0].marcas, m = M[0] != null ? M[0] : 1.2; aparece3(el.querySelector('.com6'), rebote(tramo(s, m - 0.1, m + 0.3))); } },
      finSerie({ dia: 6, total: TOTAL, serie: SERIE, etiquetaManana: 'HOY · DÍA 6', manana: 'Revisa mantenimiento y tarjeta en tu extracto', sigue: '<b>Síguenos</b> para no perderte ningún día' })
    ],
    tres: function (t, k, s, e, W) {
      const p = Math.min(1, s / (e.fin - e.ini)), DX = -1.2, DZ = -6.5, HX = 1.2, HZ = 2.6, CX = 2.4, CZ = 1.2;
      const TURQ = 0x2dd4bf, ROJO = 0xef4444, fuera = { x: -60, z: -60, esc: 0 };
      const mk = (j, def) => e.ini + (e.seg[0].marcas[j] != null ? e.seg[0].marcas[j] : def);
      // Monedas rojas en fila hacia la puerta del banco (en bucle): el dinero que se va en comisiones.
      const fila = (n, vel) => (i) => {
        if (i >= n) return fuera;
        const L = 10, z = DZ + L - (((t * vel + i * L / n) % L) + L) % L;
        return { x: DX + 0.25 * Math.sin(i * 1.7), z, rot: Math.PI, amp: 1, fase: t * 6, color: ROJO, cq: 0.85, brillo: 0.2, esc: 0.62 * Math.min(1, Math.max(0, (z - DZ + 0.2) / 1.2)) * Math.min(1, (DZ + L - z) / 1.5) };
      };
      let directo = () => fuera;
      if (k === 0) {
        directo = fila(9, 1.4);
        W.puerta({ x: DX, z: DZ, luz: 1 });
        W.etiqueta('mant', 'MANTENIMIENTO', DX, 3.2, DZ, 1, '#f87171', 1.8);
        W.heroe({ x: HX, z: HZ, luz: 0.25, gira: 2.6 });
        W.camara(4.6 - 0.5 * p, 3.4, 9.6 - 0.6 * p, -0.4, 1.4, -2.2);
      } else if (k === 1) {
        const mN = mk(1, 2.4), cambia = sale(tramo(t, mN + 0.6, mN + 1.4));
        directo = (i) => { const d = fila(9, 1.4 * (1 - cambia))(i); return d === fuera ? d : { ...d, esc: d.esc * (1 - cambia) }; };
        W.puerta({ x: DX, z: DZ, luz: 1, color: TURQ, cq: cambia });
        W.etiqueta('nomina6', 'NÓMINA', DX - 1.5, 2.4, DZ + 2.5, sale(tramo(t, mN - 0.05, mN + 0.3)), '#5eead4', 1.6);
        W.etiqueta('recibos6', 'RECIBOS', DX + 1.6, 2.4, DZ + 2.5, sale(tramo(t, mN + 0.5, mN + 0.8)), '#5eead4', 1.6);
        W.heroe({ x: HX, z: HZ, luz: 0.4 + 0.6 * cambia, gira: 2.6 });
        W.camara(3.6 - 0.4 * p, 3.2, 8.8 - 0.4 * p, -0.8, 1.6, -2.6);
      } else if (k === 2) {
        W.puerta({ x: DX, z: DZ, luz: 0.6, color: TURQ, cq: 1 });
        W.heroe({ x: HX, z: HZ, luz: 1, gira: 0.3 });
        W.caja({ x: CX, z: CZ, rot: -0.3, luz: 0.8 });
        W.camara(3.4 - 0.4 * p, 2.3, 7.6 - 0.5 * p, 1.4, 1.3, 0.8);
      } else if (k === 3) {
        const mL = mk(3, 3.2), v = tramo(t, mL - 0.4, mL + 1.6), ev = v * v * (3 - 2 * v);
        const hx = HX + (DX + 0.9 - HX) * ev, hz = HZ + (DZ + 1.6 - HZ) * ev;
        W.puerta({ x: DX, z: DZ, luz: 1, color: TURQ, cq: 1 });
        W.etiqueta('nuevo6', 'BANCO NUEVO', DX, 3.2, DZ, sale(tramo(t, mL - 0.1, mL + 0.3)), '#5eead4', 1.8);
        W.heroe({ x: hx, z: hz, luz: 1, gira: v > 0 && v < 1 ? Math.atan2(DX - HX, DZ - HZ) : 2.6 });
        W.caja({ x: hx + 0.9, z: hz + 0.2, rot: -0.3, luz: 1, item: { y: 0.42, color: TURQ } });
        W.etiqueta('rec6', 'RECIBOS', hx + 0.9, 1.45, hz + 0.2, sale(tramo(s, 0.3, 0.7)), '#cbd5e1', 1.4);
        W.camara(4.8 - 0.4 * p, 3.6, 8.6 - 0.8 * p, -0.2, 1.2, -2.0);
      } else if (k === 4) {
        W.puerta({ x: DX, z: DZ, luz: 1, color: TURQ, cq: 1 });
        W.heroe({ x: HX, z: HZ, luz: 1, gira: 0.6, brazos: sale(tramo(s, 0.6, 1.0)) });
        W.camara(3.2 - 0.3 * p, 2.6, 7.4 - 0.4 * p, 0.6, 1.2, -1.2);
      } else {
        W.puerta({ x: DX, z: DZ, luz: 0.5, color: TURQ, cq: 1 });
        W.heroe({ x: HX, z: HZ, luz: 1, brazos: 1 });
        const a = 0.25 * p; W.camara(3 + Math.sin(a) * 3, 6 + p, 9.5, 0.4, 0.8, -1);
      }
      W.multitud(t, { directo });
    },
    texto: { es: `Tu banco puede cobrarte solo por tener la cuenta. 🏦

Día 6 de 30 para ordenar tu dinero. Hoy: abre el extracto, busca «mantenimiento» y «tarjeta» y suma lo que te han cobrado este año. Si no cumples las condiciones del banco, la comisión media de mantenimiento pasa de 160 € al año (ASUFIN, 2026).
Si te cobran, pide que te la quiten o cámbiate: por ley, el banco nuevo se encarga de trasladar tus recibos (como mucho, 13 días hábiles). Y si no puedes cumplir condiciones, la cuenta de pago básica cuesta como mucho 3 € al mes, y es gratis para personas en situación de vulnerabilidad.

¿Cuánto te ha salido la cuenta? 👇

Fuentes: ASUFIN, Barómetro de comisiones (mayo de 2026) · Orden ECE/228/2019 · RD 164/2019 · RDL 19/2017 · Banco de España, Portal del Cliente Bancario.

#ahorro #comisionesbancarias #retodeahorro` }
  }),

  // Día 7 · El coste por uso (guion: guiones/2026-11-es-reto-07.md; fuentes y cuentas, arriba). Gancho visual: dos etiquetas que
  // caen, un contador de usos que corre y el cruce en el uso 40 (0,65 s): la de 15 € pasa a ser la grande y la roja.
  'es-reto-07': pildora3d({
    slug: 'es-reto-07', cuenta: 'es',
    T: { es: {
      titulo: 'Día 7/30 · Lo barato que no usas es lo más caro',
      guion: [
        [0, 'Esa camiseta de 15 euros §puede salirte *más cara* §{pop}que unas zapatillas de 120.'],
        [1, 'Si te la pones cinco veces, §{tic}*3 euros por uso*. §Las zapatillas, 300 veces: §{ding}*40 céntimos*.'],
        [2, '¿Entonces, siempre lo caro? §No: §unas zapatillas que no te pones §{pop}son *120 euros por nada*.'],
        [3, '*Día siete*. §Antes del Black Friday, §{tic}divide cada precio §entre las veces que *de verdad* lo vas a usar.'],
        [4, 'En la Unión Europea, §la ropa se abarató *más de un 30 %* §en 22 años, descontada la inflación. §{caja}Y aun así, los hogares *gastaron más* en ropa.'],
        [5, 'Día siete. §Lo barato que no usas §{pop}*es lo más caro*.']
      ]
    } },
    fijo: () => hud(7, TOTAL),
    cssExtra: CSS7, scriptExtra: SCRIPT7,
    escenas: ESC7, tres: TRES7,
    cola: 0.8, corte2d: 'seco',
    texto: { es: `Esa camiseta de 15 € puede salirte más cara que unas zapatillas de 120. 🏷️

Día 7 de 30 para ordenar tu dinero. En España, el Black Friday cae este año el viernes 27. Antes de pagar nada, haz una cuenta: precio ÷ veces que de verdad lo vas a usar. Eso es lo que te cuesta cada uso.

Lo que no cabía en el vídeo:
• ¿Y en España? Según el IPCA de Eurostat, de 1996 a 2025 la ropa ha subido un 34 % y los precios en general, un 95 %: descontada la inflación, la ropa es un 31 % más barata que entonces.
• Un 50 % de descuento no arregla nada si no lo usas: algo de 40 € rebajado a 20 € que te pones dos veces son 10 € por uso, 25 veces más que las zapatillas.
• Si compras online a una empresa, por ley tienes 14 días naturales desde que te llega para echarte atrás sin dar explicaciones (con excepciones, como lo hecho a medida; el envío de vuelta puede correr de tu cuenta). En tienda física, solo si la tienda lo ofrece: pregúntalo antes de pagar.

💾 Guárdalo para el Black Friday.

¿Qué es lo más barato que te ha salido más caro? 👇

Contenido educativo, no es asesoramiento financiero.

Fuentes: Comisión Europea, Estrategia para la circularidad y sostenibilidad de los productos textiles, COM(2022) 141 (30/03/2022): entre 1996 y 2018 los precios de la ropa en la UE bajaron más de un 30 % en relación con la inflación, y el gasto de los hogares en ropa subió un 14 % en términos reales entre 2000 y 2018 (JRC, 2021, p. 27). Eurostat, IPCA anual (prc_hicp_aind), ropa y general, UE y España. Real Decreto Legislativo 1/2007 (TRLGDCU), arts. 68, 102, 103, 104 y 108. Los precios y usos del vídeo son ejemplos. Consultado el 18/11/2026.

#blackfriday #ahorro #retodeahorro` }
  })
};




module.exports = { pildoras };
