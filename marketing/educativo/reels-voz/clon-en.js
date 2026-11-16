// Experimento «clon de estructura» · @finanziapp (EE. UU.), en 3D (reels-voz/tres.js), formato «fábula explicada».
// en-hsa-vs-fsa · «HSA versus FSA.» El esqueleto copiado es la variante B de investigacion/2026-11-esqueleto-viral.md
// (beats en los mismos segundos, respuesta guardada hasta el ~80 %, rótulos en lugar de subtítulos, voz seca, pausa de ~8 s
// sin voz con zumbido, sin música ni HUD y final mudo que empalma con el fotograma 0).
// Guion, tabla de montaje, rótulos, cuentas, fuentes, texto y portada: guiones/2026-11-clon-estructura.md (sección «EE. UU.»).
// No cambia ninguna palabra de la voz ni ningún dato del guion. Ajustes de montaje con la locución real: ver PAUSA_S y COLA_S.
// Revisión v2 (15-11-2026, solo encuadre y sonido): plano de «milk», diagrama y reloj fuera de los botones de Instagram, línea de
// EBRI más baja y estrecha, y zumbido 'zumbido-movil'. Detalle en «Ajustes de montaje» del guion.
// Caducidad: publicar durante el periodo de inscripción de beneficios y siempre antes del 31-dic-2026 (desde enero, el pie
// del arrastre tiene que pasar a los 700 $ del dinero de 2027). EBRI: abrir la nota primaria antes de publicar (dio 502).
//
// Fuentes (con fecha):
// - IRS, Publication 969 (2025), página revisada el 30-abr-2026: «FSAs are generally "use-it-or-lose-it" plans»; periodo de
//   gracia de hasta 2½ meses y no a la vez periodo de gracia y arrastre; las ganancias de la HSA no pagan impuestos; lo que se
//   aporta a la FSA no paga impuesto federal sobre la renta ni impuestos de empleo. https://www.irs.gov/publications/p969
// - IRS, Rev. Proc. 2026-35 (PDF del 5-nov-2026), §3.16: FSA de 2027, límite 3.500 $ y arrastre máximo 700 $.
//   https://www.irs.gov/pub/irs-drop/rp-26-35.pdf
// - IRS, Rev. Proc. 2025-32 (9-oct-2025): FSA de 2026, límite 3.400 $; del dinero de 2026 pasan a 2027 como máximo 680 $.
// - IRS, Rev. Proc. 2026-24 (mayo de 2026): HSA de 2027, 4.500 $ individual y 9.000 $ familiar; HDHP con franquicia mínima
//   de 1.750 $ / 3.500 $ y gasto máximo de bolsillo de 8.700 $ / 17.400 $. https://www.irs.gov/pub/irs-drop/rp-26-24.pdf
// - IRS, Notice 2026-5 (9-dic-2025): desde el 1-ene-2026, los planes bronze y catastrophic del mercado ACA permiten aportar
//   a una HSA (ley OBBBA). https://www.irs.gov/pub/irs-drop/n-26-05.pdf
// - EBRI, «About Four in 10 FSA Accountholders Forfeited Unused Funds to Employers, EBRI Finds» (21-oct-2026; datos de 2024):
//   pérdida media de 404 $ entre quienes perdieron dinero (436 $ en 2023), más de 3,3 M de cuentas. La primaria dio 502 el
//   14-nov-2026; cifras confirmadas por PSCA, InsuranceNewsNet y Money.com.
//   https://www.ebri.org/content/about-four-in-10-fsa-accountholders-forfeited-unused-funds-to-employers--ebri-finds
// - Devenir, «HSA Assets Reach Nearly $192 Billion at Midyear 2026, With More Than Half Now Invested» (13-oct-2026; datos a
//   30-jun-2026): 42,6 M de cuentas; 4,7 M (el 11 %) tienen inversiones.
//   https://www.devenir.com/hsa-assets-reach-nearly-192-billion-at-midyear-2026-with-more-than-half-now-invested/
// - California Franchise Tax Board, 2025 Instructions for Schedule CA (540): California no sigue la deducción federal de la HSA.
//   https://www.ftb.ca.gov/forms/2025/2025-540-ca-instructions.html
// - NJ Division of Taxation, Gross Income Tax Overview (consultada el 14-nov-2026): sin deducción por HSA; el A2634 (2026–27)
//   está presentado, no aprobado. https://www.nj.gov/treasury/taxation/git_over.shtml · https://pub.njleg.gov/Bills/2026/A3000/2634_I1.HTM
// Chistes del decorado que no son datos: «Your Benefits, Simplified · 64 pages», la taza «I READ THE PAMPHLET (page 1)», las
// 6 fichas de vacaciones, las notas del tablón y las tazas «HSA»/«FSA» de los compañeros.
const { pildora3d } = require('./tres');
const { VOZ_SECA } = require('./_comun');
const { cuadra } = require('../reels/_comun');

// ——— cuentas (las del guion) ———
const R = (x, d = 2) => Math.round(x * 10 ** d) / 10 ** d;
// Devenir, midyear 2026 (datos a 30-jun-2026)
cuadra('1 de cada 9 HSA invertidas', Math.round(42.6 / 4.7), 9);   // 4,7 M de 42,6 M
cuadra('11 % invertidas', Math.round(4.7 / 42.6 * 100), 11);
cuadra('1/9 (%)', R(100 / 9, 1), 11.1);
cuadra('52 % del dinero invertido', Math.round(100 / 192 * 100), 52);
// IRS: arrastre de la FSA = 20 % del límite del año
cuadra('arrastre del dinero de 2026 (Rev. Proc. 2025-32)', R(0.2 * 3400), 680);
cuadra('arrastre del dinero de 2027 (Rev. Proc. 2026-35)', R(0.2 * 3500), 700);
cuadra('FSA 2027 vs 2026', 3500 - 3400, 100);
cuadra('HSA individual 2027 vs 2026', 4500 - 4400, 100);
cuadra('HSA familiar 2027 vs 2026', 9000 - 8750, 250);
cuadra('HSA familiar = 2 × individual', 2 * 4500, 9000);
cuadra('franquicia HDHP familiar = 2 × individual', 2 * 1750, 3500);
cuadra('gasto máximo de bolsillo familiar = 2 × individual', 2 * 8700, 17400);
// EBRI (21-oct-2026; datos de 2024)
cuadra('pérdida media 2023 → 2024', 436 - 404, 32);
cuadra('contador en pantalla', 404 - 404, 0);                       // $404 → $0
// Lo que sale en pantalla, sacado de las cuentas:
const UNO_DE = Math.round(42.6 / 4.7), ARR26 = R(0.2 * 3400), ARR27 = R(0.2 * 3500), PERD = 404;
const FSA27 = 3500, HSA27 = 4500, HSA27F = 2 * 4500, HDHP = 1750, HDHPF = 2 * 1750;
const usd = (n) => '$' + n.toLocaleString('en-US');
cuadra('pie del arrastre', usd(ARR26) + '/' + usd(ARR27), '$680/$700');
cuadra('pie de límites', [FSA27, HSA27, HSA27F, HDHP, HDHPF].map(usd).join(' '), '$3,500 $4,500 $9,000 $1,750 $3,500');
// Tiempos del guion (estimados a 2,5 palabras/s, duración 55,5 s), tal como se verificaron:
const D = 55.5;
cuadra('pausa (s)', 39 - 31, 8);
cuadra('pausa (% inicio)', Math.round(31 / D * 100), 56);
cuadra('pausa (% fin)', Math.round(39 / D * 100), 70);
cuadra('adelanto (%)', R(11 / D * 100, 1), 19.8);
cuadra('contador a $0 (%)', Math.round(41.2 / D * 100), 74);
cuadra('tarjeta (%)', R(43 / D * 100, 1), 77.5);
cuadra('cola (s)', R(D - 53.5, 1), 2);
cuadra('voz (s)', D - 8 - 2, 45.5);
cuadra('palabras/s hablando', R(115 / 45.5), 2.53);
cuadra('palabras/s contando la pausa', R(115 / D), 2.07);
// Con la locución real (VOZ_SECA, tempo 1,3; marcas por palabra de Whisper) la escena 6 acaba a los 31,9 s y la frase de la
// escena 7 dura 4,2 s: con los 8 s del guion la tarjeta (escena 8) caía a los 44,3 s, 1,3 s después que en el molde (43,0).
// Ajustes de montaje (no cambian la voz ni las palabras):
// - PAUSA_S: 7,6 s del corte a la voz (con los bordes de las tomas, ~7,8 s sin voz). La tarjeta cae a los 43,88 s (+0,88).
// - COLA_S: 2,8 s de final mudo (la cara muda de la variante B dura ~3 s). Con 2,0 s, «USE IT OR LOSE IT» caía al 82,1 %;
//   con 2,8 s la tarjeta «FSA =» cae al 78,1 % y la respuesta, al 80,9 % (el guion pide entre el 78 y el 81 %). Total: 56,17 s.
const PAUSA_S = 7.6;
const COLA_S = 2.8;
cuadra('pausa recortada (s)', R(8 - 0.4, 1), PAUSA_S);
cuadra('tarjeta «FSA =» con la locución real (%)', R(43.883 / (53.368 + COLA_S) * 100, 1), 78.1);
cuadra('«USE IT OR LOSE IT» («name») con la locución real (%)', R(45.453 / (53.368 + COLA_S) * 100, 1), 80.9);
cuadra('«name» con la cola del guion (%)', R(45.453 / (53.368 + 2.0) * 100, 1), 82.1);

const TEXTO = `HSA vs FSA: one of them has an expiration date 👀

An HSA can be invested, not just spent. Yet only about 1 in 9 HSA accounts holds any investments; the rest just hold cash (Devenir, June 30, 2026).

Before 65, HSA money spent on non-medical things is generally taxed, plus a 20% penalty. After 65, no penalty, just regular income tax.

An HSA needs an HSA-eligible health plan (a high-deductible plan or, since 2026, an ACA bronze or catastrophic plan), and you generally can't add to one while you also have a regular health FSA.

Today: open your benefits portal and check your FSA balance, its deadline, and whether your plan has a carryover (up to $680 of 2026 money into 2027) or a grace period (up to 2½ months).

2027 limits: health FSA $3,500 · HSA $4,500 self-only / $9,000 family. California and New Jersey don't give the HSA state tax break.
Sources: IRS Publication 969 · IRS Rev. Proc. 2025-32, 2026-24 and 2026-35 · IRS Notice 2026-5 · EBRI (Oct 21, 2026; 2024 data) · Devenir Midyear 2026 HSA Research Report.
Educational only, not financial advice.

#HSA #FSA #openenrollment #personalfinance`;

// Guion verificado, sin tocar (en este formato *resaltado* = palabra en la que entra un rótulo; § = corte o capa nueva).
const GUION = [
  [0, 'HSA §versus FSA.'],
  [1, 'At work, they sound §like the §*same thing*.'],
  [2, 'Both pay for the §*doctor*. §Both skip §*taxes*.'],
  [3, 'But §one of them has an §*expiration* date.'],
  [4, 'FSA money §*expires*. §HSA money *doesn’t*. If the FSA is §*milk*, the HSA is §*honey*.'],
  [5, 'Both can come out of your §*paycheck* §before taxes. That’s called §*pre-tax*.'],
  [5, '§The more you put in, §the less tax you owe. But only HSA money can be §*invested*, and grow §*tax-free*.'],
  [6, 'Glasses bought. §Taxes skipped. §Total peace.'],
  [7, 'About four in ten §FSA users §*lost money* in 2024.'],   // va después de PAUSA_S s sin voz (pausas[7])
  [8, 'The IRS has a §name for it: §*use it* or §*lose it*.'],
  [9, 'An FSA is like §*vacation days* that §don’t roll over. §HSA money *does*.']
];

const CSS = `
  .carta { position: absolute; left: 50%; top: 600px; transform: translateX(-50%); transform-origin: 50% 50%; }
  .r2 { position: absolute; left: 50%; transform: translateX(-50%); white-space: nowrap; padding: 8px 34px 14px; border-radius: 28px;
    background: rgba(9,14,27,.93); border: 6px solid #e2e8f0; color: #fff; font-size: 72px; line-height: 1.1; font-weight: 900; letter-spacing: -.015em; opacity: 0; }
  .r2.tq { border-color: #5eead4; } .r2.rj { border-color: #f87171; }
  .amb { color: #f5b94a; } .tqc { color: #5eead4; } .rjc { color: #f87171; }
  .cols { position: absolute; left: 70px; right: 70px; display: flex; justify-content: space-between; }
  .col { width: 430px; box-sizing: border-box; background: rgba(9,14,27,.88); border-radius: 26px; border: 4px solid rgba(226,232,240,.45); padding: 14px 30px 20px; }
  .col b { display: block; font-size: 84px; line-height: 1.05; font-weight: 900; letter-spacing: -.02em; color: #fff; margin-bottom: 6px; }
  .col i { display: block; font-style: normal; font-size: 54px; line-height: 1.3; font-weight: 800; color: #fff; opacity: 0; }
  .col i u { text-decoration: none; color: #5eead4; }
  .pie { position: absolute; left: 46px; width: 850px; box-sizing: border-box; font-size: 25px; line-height: 1.32; font-weight: 600; color: #dbe3ec;
    background: rgba(7,11,22,.76); border-radius: 14px; padding: 9px 16px 11px; opacity: 0; }
  .pie p { margin: 0; } .pie p + p { margin-top: 6px; }
  .cita { position: absolute; left: 70px; right: 70px; text-align: center; font-size: 36px; line-height: 1.28; font-weight: 750; color: #e2e8f0; opacity: 0;
    text-shadow: 0 2px 14px rgba(0,0,0,.9); }
  .inv { position: absolute; left: 0; top: 0; width: 300px; box-sizing: border-box; transform: translate(-50%, -50%); text-align: center; background: rgba(9,14,27,.94);
    border: 5px solid #5eead4; border-radius: 24px; padding: 4px 10px 10px; opacity: 0; }
  .inv b { display: block; font-size: 52px; line-height: 1.12; font-weight: 900; letter-spacing: -.015em; color: #fff; }
  .inv span { display: block; font-size: 23px; line-height: 1.2; font-weight: 700; color: #cbd5e1; }
`;

// Tarjetas 2D «a mano» (título y respuesta): mismo papel, trazo y tamaño. Se redibujan solo cuando cambian.
const SCRIPT_2D = `
function aManoEN(x, x0, y0, x1, y1, col, lw, sem) {
  const r = (k) => Math.sin(k * 12.9898 + sem * 78.233) * 5;
  x.save(); x.strokeStyle = col; x.lineWidth = lw; x.lineCap = 'round'; x.lineJoin = 'round'; x.beginPath();
  x.moveTo(x0 + r(1), y0 + r(2)); x.quadraticCurveTo((x0 + x1) / 2 + r(9), y0 + r(10), x1 + r(3), y0 + r(4));
  x.quadraticCurveTo(x1 + r(11), (y0 + y1) / 2 + r(12), x1 + r(5), y1 + r(6));
  x.quadraticCurveTo((x0 + x1) / 2 + r(13), y1 + r(14), x0 + r(7), y1 + r(8));
  x.quadraticCurveTo(x0 + r(15), (y0 + y1) / 2 + r(16), x0 + r(1), y0 + r(2) + 3); x.stroke(); x.restore();
}
// Una línea de texto con trozos de colores, centrada en cx (trazo grueso para que parezca rotulador). prog 0..1 = cuánto se ha escrito.
function lineaEN(x, trozos, cx, cy, px, prog) {
  x.save(); x.font = '900 ' + px + 'px Inter, sans-serif'; x.textBaseline = 'middle'; x.lineJoin = 'round';
  const anchos = trozos.map(t => x.measureText(t[0]).width), total = anchos.reduce((a, b) => a + b, 0);
  if (prog != null && prog < 1) { x.beginPath(); x.rect(cx - total / 2 - 10, cy - px, (total + 20) * Math.max(0, prog), px * 2); x.clip(); }
  let xx = cx - total / 2;
  trozos.forEach((t, i) => { x.fillStyle = t[1]; x.strokeStyle = t[1]; x.lineWidth = px * 0.05; x.strokeText(t[0], xx, cy); x.fillText(t[0], xx, cy); xx += anchos[i]; });
  x.restore(); return total;
}
function cartaEN(cv, o) {
  const clave = JSON.stringify(o); if (cv._clave === clave) return; cv._clave = clave;
  const x = cv.getContext('2d'), W_ = cv.width, H_ = cv.height, TQ = '#5eead4', ROJO = '#f87171', BL = '#f1f5f9';
  x.clearRect(0, 0, W_, H_);
  x.fillStyle = '#0d1424'; x.beginPath(); x.roundRect(6, 6, W_ - 12, H_ - 12, 30); x.fill();
  aManoEN(x, 30, 30, W_ - 30, H_ - 30, '#e2e8f0', 10, 3);
  if (o.tipo === 'titulo') {
    lineaEN(x, [['H', TQ], ['SA', BL]], W_ / 2, 200, 205);
    lineaEN(x, [['vs', '#94a3b8']], W_ / 2, 372, 108);
    lineaEN(x, [['F', ROJO], ['SA', BL]], W_ / 2, 548, 205);
  } else {
    lineaEN(x, [['F', ROJO], ['SA =', BL]], W_ / 2, 150, 150);
    const e = o.esc || 0, p1 = Math.min(1, e / 0.42), p2 = Math.max(0, Math.min(1, (e - 0.42) / 0.16)), p3 = Math.max(0, Math.min(1, (e - 0.58) / 0.42));
    let w1 = 0;
    if (p1 > 0) w1 = lineaEN(x, [['USE IT', BL]], W_ / 2, 338, 124, p1);
    if (p2 > 0) lineaEN(x, [['OR', '#94a3b8']], W_ / 2, 462, 84, p2);
    if (p3 > 0) lineaEN(x, [['LOSE IT', BL]], W_ / 2, 586, 124, p3);
    if (o.sub > 0) { x.save(); x.strokeStyle = TQ; x.lineWidth = 15; x.lineCap = 'round'; x.beginPath(); const a = W_ / 2 - w1 / 2 - 6;
      x.moveTo(a, 410); x.quadraticCurveTo(W_ / 2, 402 + 6, a + (w1 + 12) * o.sub, 404); x.stroke(); x.restore(); }
  }
}
`;

// Mundo de la sala de descanso (se añade al de tres.js): nevera con puerta, encimera con cafetera, armario alto, la caja
// «2027», papelera, calendario que pasa hojas, reloj digital, sofá y tablón de corcho; el decorado del diagrama (pizarra,
// nómina, monedas, bloque TAX, deslizador); los accesorios: cordón y gafas del protagonista, tazas, tarros, cartón de leche
// «FSA», tarro de miel «HSA», folleto, formulario y fichas de vacaciones. Todo se apaga al principio de cada fotograma.
const SCRIPT = SCRIPT_2D + `
const X3 = (() => {
  const W = W3, T = W.T, S = W.S, H = W.H, objs = [], props = [];
  const grupo = () => { const g = new T.Group(); g.visible = false; S.add(g); objs.push(g); return g; };
  const prop = () => { const g = new T.Group(); g.visible = false; S.add(g); props.push(g); return g; };
  const mat = (c, o) => new T.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.62, metalness: 0.05 }, o || {}));
  const pieza = (g, geo, m, x, y, z) => { const o = new T.Mesh(geo, m); o.position.set(x || 0, y || 0, z || 0); o.castShadow = true; o.receiveShadow = true; g.add(o); return o; };
  const caja = (g, w, h, d, m, x, y, z) => pieza(g, new T.BoxGeometry(w, h, d), m, x, y, z);
  const cil = (g, r1, r2, h, m, x, y, z, n) => pieza(g, new T.CylinderGeometry(r1, r2, h, n || 24), m, x, y, z);
  const lienzo = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const tx = new T.CanvasTexture(c); tx.encoding = T.sRGBEncoding; tx.anisotropy = 8; return { c, x: c.getContext('2d'), tx, clave: null }; };
  const pinta = (w, h, f) => { const lz = lienzo(w, h); f(lz.x, w, h); lz.tx.needsUpdate = true; return lz; };
  const plano = (g, w, h, lz, x, y, z, propia, brillo) => {
    const m = propia ? new T.MeshBasicMaterial({ map: lz.tx, toneMapped: false, transparent: true, side: T.DoubleSide })
      : new T.MeshStandardMaterial({ map: lz.tx, roughness: 0.85, transparent: true, emissive: 0xffffff, emissiveMap: lz.tx, emissiveIntensity: brillo == null ? 0.3 : brillo });
    const p = new T.Mesh(new T.PlaneGeometry(w, h), m); p.position.set(x || 0, y || 0, z || 0); g.add(p); return p; };
  const TQ = '#5eead4', ROJO = '#f87171', AMB = '#f5b94a', BL = '#f1f5f9';
  const F = (peso, px) => peso + ' ' + px + 'px Inter, sans-serif';
  function texto(x, txt, cx, cy, px, col, o) {
    o = o || {}; x.save(); x.font = F(o.peso || 900, px); x.textAlign = o.al || 'center'; x.textBaseline = 'middle'; x.fillStyle = col;
    x.translate(cx, cy); if (o.rot) x.rotate(o.rot);
    if (o.trazo) { x.lineJoin = 'round'; x.strokeStyle = col; x.lineWidth = px * o.trazo; x.strokeText(txt, 0, 0); }
    x.fillText(txt, 0, 0); x.restore();
  }
  function ruido(x, w, h, col, n, sem) { let k = sem; x.fillStyle = col; for (let i = 0; i < n; i++) { k = (k * 9301 + 49297) % 233280; const a = k / 233280; k = (k * 9301 + 49297) % 233280; x.fillRect(a * w, (k / 233280) * h, 3, 2); } }
  const vTmp = new T.Vector3(), V3 = (x, y, z) => new T.Vector3(x, y, z);
  function tira(g, a, b, r, m) { const d = new T.Vector3().subVectors(b, a), L = d.length(); const c = new T.Mesh(new T.CylinderGeometry(r, r, L, 6), m);
    c.position.copy(a).add(b).multiplyScalar(0.5); c.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), d.normalize()); g.add(c); return c; }

  // ——— luces: de día (las del mundo + dos lámparas del techo) y de noche (solo la nevera) ———
  const lucesG = S.children.filter(o => o.isHemisphereLight || o.isDirectionalLight), baseL = lucesG.map(l => l.intensity);
  const salaG = grupo();
  const luzDia = [[-1.7, 2.9, -0.2], [2.1, 2.9, -0.2]].map(p => { const l = new T.PointLight(0xfff0d8, 1.0, 9, 1.5); l.position.set(p[0], p[1], p[2]); salaG.add(l); return l; });
  function noche(q) { lucesG.forEach((l, i) => { l.intensity = baseL[i] * (1 - q * (l.isHemisphereLight ? 0.86 : 0.97)); }); luzDia.forEach(l => { l.intensity = 1.0 * (1 - q); }); }

  // ——— la sala: suelo, paredes ———
  const lzSuelo = pinta(256, 256, (x, w, h) => { x.fillStyle = '#4c5466'; x.fillRect(0, 0, w, h); ruido(x, w, h, 'rgba(0,0,0,.14)', 700, 5); x.strokeStyle = 'rgba(22,27,38,.75)'; x.lineWidth = 6; x.strokeRect(0, 0, w, h); });
  lzSuelo.tx.wrapS = lzSuelo.tx.wrapT = T.RepeatWrapping; lzSuelo.tx.repeat.set(15, 12.5); lzSuelo.tx.needsUpdate = true;
  const suelo = new T.Mesh(new T.PlaneGeometry(9.2, 7.5), new T.MeshStandardMaterial({ map: lzSuelo.tx, roughness: 0.7, metalness: 0.05 }));
  suelo.rotation.x = -Math.PI / 2; suelo.position.set(0, 0.008, 0.8); suelo.receiveShadow = true; salaG.add(suelo);
  const lzPared = pinta(1840, 660, (x, w, h) => {
    x.fillStyle = '#3d5269'; x.fillRect(0, 0, w, h); ruido(x, w, h, 'rgba(0,0,0,.08)', 3000, 9);
    const z0 = h - 200; x.fillStyle = '#2b3a4e'; x.fillRect(0, z0, w, 200);
    for (let k = 60; k < w; k += 110) { x.fillStyle = 'rgba(0,0,0,.2)'; x.fillRect(k, z0 + 16, 3, 160); }
    x.fillStyle = '#62788f'; x.fillRect(0, z0 - 10, w, 14); x.fillStyle = '#18212e'; x.fillRect(0, h - 22, w, 22); });
  const mLadoP = mat(0x2b3a4e, { roughness: 0.9 });
  const pared = new T.Mesh(new T.BoxGeometry(9.2, 3.3, 0.2), [mLadoP, mLadoP, mLadoP, mLadoP, new T.MeshStandardMaterial({ map: lzPared.tx, roughness: 0.9, emissive: 0xffffff, emissiveMap: lzPared.tx, emissiveIntensity: 0.05 }), mLadoP]);
  pared.position.set(0, 1.65, -3.05); pared.receiveShadow = true; salaG.add(pared);
  [-4.7, 4.7].forEach(px => caja(salaG, 0.2, 3.3, 7.5, mat(0x34475d, { roughness: 0.9 }), px, 1.65, 0.8));

  // ——— nevera (x −3,55…−2,7): puerta con bisagra a la izquierda, baldas de cristal y luz interior ———
  const NX0 = -3.55, NX1 = -2.7, NZ0 = -2.95, NZ1 = -2.25, NH = 1.9, NCX = (NX0 + NX1) / 2, NCZ = (NZ0 + NZ1) / 2;
  const mAcero = mat(0xc9d1db, { roughness: 0.32, metalness: 0.4 });
  const mDentro = mat(0xb9cad8, { roughness: 0.6, emissive: 0xe0f2fe, emissiveIntensity: 0.03 });
  caja(salaG, 0.04, NH, NZ1 - NZ0, mAcero, NX0 + 0.02, NH / 2, NCZ); caja(salaG, 0.04, NH, NZ1 - NZ0, mAcero, NX1 - 0.02, NH / 2, NCZ);
  caja(salaG, NX1 - NX0, 0.05, NZ1 - NZ0, mAcero, NCX, NH - 0.025, NCZ); caja(salaG, NX1 - NX0, 0.12, NZ1 - NZ0, mAcero, NCX, 0.06, NCZ);
  caja(salaG, NX1 - NX0 - 0.08, NH - 0.17, 0.03, mDentro, NCX, NH / 2 + 0.035, NZ0 + 0.03);
  caja(salaG, 0.012, NH - 0.17, NZ1 - NZ0 - 0.04, mDentro, NX0 + 0.046, NH / 2 + 0.035, NCZ); caja(salaG, 0.012, NH - 0.17, NZ1 - NZ0 - 0.04, mDentro, NX1 - 0.046, NH / 2 + 0.035, NCZ);
  const mVidrio = new T.MeshStandardMaterial({ color: 0xd8f0ff, transparent: true, opacity: 0.4, roughness: 0.1 });
  const BALDA = [0.62, 1.02, 1.42];
  BALDA.forEach(y => { const b = caja(salaG, NX1 - NX0 - 0.1, 0.012, NZ1 - NZ0 - 0.08, mVidrio, NCX, y, NCZ - 0.02); b.castShadow = false; });
  const puertaN = new T.Group(); puertaN.position.set(NX0, 0, NZ1); salaG.add(puertaN);
  caja(puertaN, NX1 - NX0, NH - 0.02, 0.06, mAcero, (NX1 - NX0) / 2, NH / 2, 0.03);
  caja(puertaN, 0.03, 0.55, 0.035, mat(0x64748b, { metalness: 0.6, roughness: 0.3 }), NX1 - NX0 - 0.08, 1.2, 0.08);
  caja(puertaN, NX1 - NX0 - 0.1, NH - 0.24, 0.02, mDentro, (NX1 - NX0) / 2, NH / 2, -0.008);
  const luzN = new T.PointLight(0xe3f4ff, 0, 7.5, 1.3); luzN.position.set(NCX + 0.1, 1.3, NZ1 + 0.25); salaG.add(luzN);
  function nevera(abre, luz) { puertaN.rotation.y = -1.95 * abre; luzN.intensity = luz || 0; mDentro.emissiveIntensity = 0.03 + 0.3 * Math.min(1, (luz || 0) / 2.4); }

  // ——— encimera (x −2,7…−0,1), salpicadero y cafetera ———
  const CX0 = -2.7, CX1 = -0.1, CZ0 = -2.95, CZ1 = -2.33, TOPE = 0.91, CCX = (CX0 + CX1) / 2, CCZ = (CZ0 + CZ1) / 2;
  const lzMueble = pinta(1040, 344, (x, w, h) => { x.fillStyle = '#33465d'; x.fillRect(0, 0, w, h); const n = 4, dw = w / n;
    for (let k = 0; k < n; k++) { x.strokeStyle = 'rgba(10,16,26,.85)'; x.lineWidth = 6; x.strokeRect(k * dw + 8, 10, dw - 16, h - 20); x.fillStyle = '#c0c9d4'; x.fillRect(k * dw + (k % 2 ? 26 : dw - 40), 40, 12, 70); } });
  const mMuebleL = mat(0x2a3a4e);
  const mueble = new T.Mesh(new T.BoxGeometry(CX1 - CX0, TOPE - 0.05, CZ1 - CZ0), [mMuebleL, mMuebleL, mMuebleL, mMuebleL, new T.MeshStandardMaterial({ map: lzMueble.tx, roughness: 0.6 }), mMuebleL]);
  mueble.position.set(CCX, (TOPE - 0.05) / 2, CCZ); mueble.castShadow = mueble.receiveShadow = true; salaG.add(mueble);
  caja(salaG, CX1 - CX0 + 0.04, 0.05, CZ1 - CZ0 + 0.05, mat(0xa47e57, { roughness: 0.5 }), CCX, TOPE - 0.025, CCZ + 0.01);
  const lzAzul = pinta(1040, 236, (x, w, h) => { x.fillStyle = '#c9d3dc'; x.fillRect(0, 0, w, h); x.fillStyle = '#2f4f5a'; for (let r = 0; r * 40 < h; r++) for (let c = -1; c * 80 < w; c++) x.fillRect(c * 80 + (r % 2) * 40 + 3, r * 40 + 3, 74, 34); });
  plano(salaG, CX1 - CX0, 0.59, lzAzul, CCX, TOPE + 0.295, -2.938, false, 0.12);
  const mNegro = mat(0x1a2130, { roughness: 0.4, metalness: 0.2 });
  const cafG = new T.Group(); salaG.add(cafG); cafG.position.set(-2.3, TOPE, -2.72);
  caja(cafG, 0.3, 0.05, 0.3, mNegro, 0, 0.025, 0); caja(cafG, 0.3, 0.46, 0.12, mNegro, 0, 0.23, -0.09); caja(cafG, 0.3, 0.09, 0.3, mNegro, 0, 0.43, 0);
  cil(cafG, 0.072, 0.082, 0.17, new T.MeshStandardMaterial({ color: 0xcfe8f5, transparent: true, opacity: 0.35, roughness: 0.1 }), 0, 0.14, 0.05, 20);
  cil(cafG, 0.074, 0.08, 0.08, mat(0x3b2412, { roughness: 0.3 }), 0, 0.095, 0.05, 20);
  const led = new T.Mesh(new T.SphereGeometry(0.012, 8, 6), new T.MeshBasicMaterial({ color: 0xff4d4d })); led.position.set(0.1, 0.3, -0.025); cafG.add(led);

  // ——— armario alto (x −2,0…−0,6): la puerta derecha se abre (tarro de miel dentro) ———
  const AX0 = -2.0, AX1 = -0.6, AY0 = 1.55, AY1 = 2.25, AZ0 = -2.95, AZ1 = -2.59, ACX = (AX0 + AX1) / 2, ACY = (AY0 + AY1) / 2, ACZ = (AZ0 + AZ1) / 2;
  const mArm = mat(0x33465d, { roughness: 0.6 }), mArmD = mat(0x8a99ab, { roughness: 0.75 });
  caja(salaG, AX1 - AX0, 0.03, AZ1 - AZ0, mArm, ACX, AY0 + 0.015, ACZ); caja(salaG, AX1 - AX0, 0.03, AZ1 - AZ0, mArm, ACX, AY1 - 0.015, ACZ);
  caja(salaG, 0.03, AY1 - AY0, AZ1 - AZ0, mArm, AX0 + 0.015, ACY, ACZ); caja(salaG, 0.03, AY1 - AY0, AZ1 - AZ0, mArm, AX1 - 0.015, ACY, ACZ);
  caja(salaG, AX1 - AX0 - 0.06, AY1 - AY0 - 0.06, 0.02, mArmD, ACX, ACY, AZ0 + 0.02); caja(salaG, AX1 - AX0 - 0.06, 0.02, AZ1 - AZ0 - 0.04, mArmD, ACX, ACY + 0.05, ACZ);
  const mPomo = mat(0xc0c9d4, { metalness: 0.6, roughness: 0.3 });
  caja(salaG, 0.69, 0.69, 0.025, mArm, AX0 + 0.35, ACY, AZ1 + 0.0125); cil(salaG, 0.012, 0.012, 0.04, mPomo, AX0 + 0.64, ACY - 0.22, AZ1 + 0.04, 8).rotation.x = Math.PI / 2;
  const puertaA = new T.Group(); puertaA.position.set(AX1, 0, AZ1); salaG.add(puertaA);
  caja(puertaA, 0.69, 0.69, 0.025, mArm, -0.35, ACY, 0.0125); cil(puertaA, 0.012, 0.012, 0.04, mPomo, -0.64, ACY - 0.22, 0.04, 8).rotation.x = Math.PI / 2;
  const luzA = new T.PointLight(0xffe7c2, 0, 2.4, 1.6); luzA.position.set(-0.95, 1.98, -2.3); salaG.add(luzA);
  function armario(abre) { puertaA.rotation.y = 1.85 * abre; luzA.intensity = 1.1 * abre; }

  // ——— caja «2027» sobre la encimera (x −1,72…−1,3): su puerta es la cara derecha ———
  const BX0 = -1.72, BX1 = -1.3, BY0 = TOPE, BY1 = TOPE + 0.36, BZ0 = -2.9, BZ1 = -2.42, BCX = (BX0 + BX1) / 2, BCY = (BY0 + BY1) / 2, BCZ = (BZ0 + BZ1) / 2;
  const mCajon = mat(0x8b6440, { roughness: 0.65 }), mCajonD = mat(0x3a2a1c, { roughness: 0.9 });
  caja(salaG, BX1 - BX0, 0.02, BZ1 - BZ0, mCajon, BCX, BY0 + 0.01, BCZ); caja(salaG, BX1 - BX0, 0.02, BZ1 - BZ0, mCajon, BCX, BY1 - 0.01, BCZ);
  caja(salaG, 0.02, BY1 - BY0, BZ1 - BZ0, mCajon, BX0 + 0.01, BCY, BCZ); caja(salaG, BX1 - BX0, BY1 - BY0, 0.02, mCajon, BCX, BCY, BZ0 + 0.01);
  caja(salaG, BX1 - BX0, BY1 - BY0, 0.02, mCajon, BCX, BCY, BZ1 - 0.01); caja(salaG, BX1 - BX0 - 0.04, BY1 - BY0 - 0.04, 0.01, mCajonD, BCX, BCY, BZ0 + 0.03);
  const puertaD = new T.Group(); puertaD.position.set(BX1, BY1, BCZ); salaG.add(puertaD);
  caja(puertaD, 0.02, BY1 - BY0, BZ1 - BZ0, mCajon, 0.01, -(BY1 - BY0) / 2, 0);
  const lz2027 = pinta(400, 220, (x, w, h) => { x.fillStyle = '#f8fafc'; x.beginPath(); x.roundRect(6, 6, w - 12, h - 12, 22); x.fill(); x.strokeStyle = '#0f766e'; x.lineWidth = 10; x.stroke(); texto(x, '2027', w / 2, h / 2 + 6, 130, '#0f766e'); });
  const et27 = plano(puertaD, 0.3, 0.165, lz2027, 0.022, -(BY1 - BY0) / 2 + 0.02, 0, false, 0.35); et27.rotation.y = Math.PI / 2;
  plano(salaG, 0.24, 0.132, lz2027, BCX, BCY + 0.02, BZ1 + 0.002, false, 0.35);
  function despensa(abre) { puertaD.rotation.z = 1.25 * abre; }

  // ——— papelera (x 0,25), calendario y reloj digital en la pared, sofá y tablón de corcho ———
  const PAP = [0.25, -2.62];
  const mPap = mat(0x5b6678, { roughness: 0.5, metalness: 0.3, side: T.DoubleSide });
  pieza(salaG, new T.CylinderGeometry(0.17, 0.14, 0.42, 28, 1, true), mPap, PAP[0], 0.21, PAP[1]);
  const fondoP = new T.Mesh(new T.CircleGeometry(0.14, 24), mat(0x2b3240)); fondoP.rotation.x = -Math.PI / 2; fondoP.position.set(PAP[0], 0.012, PAP[1]); salaG.add(fondoP);
  const bordeP = new T.Mesh(new T.TorusGeometry(0.17, 0.008, 6, 32), mat(0x94a3b8, { metalness: 0.5 })); bordeP.rotation.x = Math.PI / 2; bordeP.position.set(PAP[0], 0.42, PAP[1]); salaG.add(bordeP);
  const CAL = { x: -0.25, y: 1.9, z: -2.935, w: 0.5, h: 0.66 };
  const MESES = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
  const lzCal = lienzo(500, 660), lzHojaC = lienzo(500, 660);
  function dibCal(lz, mes, circ) {
    const c = Math.round((circ || 0) * 30) / 30, clave = mes + '|' + c; if (lz.clave === clave) return; lz.clave = clave;
    const x = lz.x, w = 500, h = 660; x.clearRect(0, 0, w, h); x.fillStyle = '#f8fafc'; x.fillRect(0, 0, w, h);
    x.fillStyle = '#0f766e'; x.fillRect(0, 0, w, 132); texto(x, MESES[mes], w / 2, 64, 70, '#ffffff'); texto(x, '2026', w / 2, 112, 30, '#ccfbf1', { peso: 700 });
    ['S', 'M', 'T', 'W', 'T', 'F', 'S'].forEach((d, i) => texto(x, d, 39 + i * 70.3, 162, 26, '#64748b', { peso: 800 }));
    const ini = new Date(2026, mes, 1).getDay(), n = new Date(2026, mes + 1, 0).getDate();
    x.strokeStyle = '#e2e8f0'; x.lineWidth = 2; for (let r = 0; r <= 5; r++) { x.beginPath(); x.moveTo(8, 186 + r * 90); x.lineTo(w - 8, 186 + r * 90); x.stroke(); }
    for (let d = 1; d <= n; d++) { const k = ini + d - 1, cx = 39 + (k % 7) * 70.3, cy = 231 + Math.floor(k / 7) * 90; texto(x, String(d), cx, cy, 40, mes === 11 && d === 31 ? '#b91c1c' : '#0f172a', { peso: 800 }); }
    if (c > 0 && mes === 11) { const k = ini + 30, cx = 39 + (k % 7) * 70.3, cy = 231 + Math.floor(k / 7) * 90;
      x.save(); x.strokeStyle = '#dc2626'; x.lineWidth = 10; x.lineCap = 'round'; x.beginPath(); x.ellipse(cx + 1, cy + 1, 40, 36, -0.2, -2.2, -2.2 + Math.PI * 2.15 * c); x.stroke(); x.restore(); }
    lz.tx.needsUpdate = true;
  }
  const calG = new T.Group(); calG.position.set(CAL.x, CAL.y + CAL.h / 2, CAL.z); salaG.add(calG);
  const mCal = new T.MeshStandardMaterial({ map: lzCal.tx, roughness: 0.85, emissive: 0xffffff, emissiveMap: lzCal.tx, emissiveIntensity: 0.3 });
  const calBase = new T.Mesh(new T.PlaneGeometry(CAL.w, CAL.h), mCal); calBase.position.y = -CAL.h / 2; calG.add(calBase);
  const pivH = new T.Group(); pivH.position.z = 0.006; calG.add(pivH);
  const mHojaC = new T.MeshStandardMaterial({ map: lzHojaC.tx, roughness: 0.85, emissive: 0xffffff, emissiveMap: lzHojaC.tx, emissiveIntensity: 0.3 });
  const hojaC = new T.Mesh(new T.PlaneGeometry(CAL.w, CAL.h), mHojaC); hojaC.position.y = -CAL.h / 2; pivH.add(hojaC);
  const dorsoC = new T.Mesh(new T.PlaneGeometry(CAL.w, CAL.h), mat(0xe9eef3, { emissive: 0xffffff, emissiveIntensity: 0.15 })); dorsoC.rotation.y = Math.PI; dorsoC.position.set(0, -CAL.h / 2, -0.001); pivH.add(dorsoC);
  const anilla = new T.Mesh(new T.CylinderGeometry(0.008, 0.008, CAL.w * 0.9, 8), mat(0x94a3b8, { metalness: 0.6 })); anilla.rotation.z = Math.PI / 2; anilla.position.set(0, -0.005, 0.012); calG.add(anilla);
  // mes: el que queda debajo; hoja 0..1: la página del mes anterior levantándose; circ 0..1: el 31 de diciembre rodeado.
  function calendario(mes, hoja, circ) { dibCal(lzCal, mes, circ); pivH.visible = hoja > 0 && hoja < 1; if (pivH.visible) { dibCal(lzHojaC, mes - 1, 0); pivH.rotation.x = -Math.PI * 0.97 * sale(hoja); } }
  const lzReloj = lienzo(512, 176);
  function dibReloj(txt) { if (lzReloj.clave === txt) return; lzReloj.clave = txt; const x = lzReloj.x; x.fillStyle = '#05070c'; x.fillRect(0, 0, 512, 176);
    x.save(); x.shadowColor = '#ff3b3b'; x.shadowBlur = 16; texto(x, txt, 256, 92, 88, '#ff5a5a', { peso: 800 }); x.restore(); lzReloj.tx.needsUpdate = true; }   // 88 px (v1: 98): en el plano de las 12:00 la «M» tocaba los botones
  const relojG = new T.Group(); salaG.add(relojG); relojG.position.set(CAL.x, 2.62, -2.92);
  caja(relojG, 0.54, 0.21, 0.05, mat(0x111827, { roughness: 0.4 }), 0, 0, 0);
  plano(relojG, 0.5, 0.172, lzReloj, 0, 0, 0.026, true);
  const SOX = 1.65, SOZ = -2.4; const mSofa = mat(0x4b6075, { roughness: 0.85 }), mCojin = mat(0x587089, { roughness: 0.9 });
  caja(salaG, 1.9, 0.3, 0.82, mSofa, SOX, 0.19, SOZ); [-0.47, 0.47].forEach(dx => caja(salaG, 0.92, 0.14, 0.78, mCojin, SOX + dx, 0.4, SOZ + 0.02));
  caja(salaG, 1.9, 0.82, 0.22, mSofa, SOX, 0.62, -2.82); [-1, 1].forEach(s => caja(salaG, 0.2, 0.62, 0.86, mSofa, SOX + s * 1.04, 0.34, SOZ));
  const CORK = { x: 3.45, y: 1.6, z: -2.935, w: 1.1, h: 0.78 };
  const lzCorcho = pinta(880, 624, (x, w, h) => { x.fillStyle = '#6b4a2b'; x.fillRect(0, 0, w, h); x.fillStyle = '#b8894f'; x.fillRect(22, 22, w - 44, h - 44); ruido(x, w, h, 'rgba(90,55,20,.35)', 2600, 3);
    const nota = (nx, ny, nw, nh, col, rot, lineas) => { x.save(); x.translate(nx, ny); x.rotate(rot); x.fillStyle = col; x.fillRect(-nw / 2, -nh / 2, nw, nh);
      lineas.forEach((l, i) => texto(x, l, 0, -nh / 2 + 34 + i * 34, 27, '#1e293b', { peso: 700 })); x.fillStyle = '#dc2626'; x.beginPath(); x.arc(0, -nh / 2 + 10, 8, 0, 7); x.fill(); x.restore(); };
    nota(130, 150, 190, 150, '#fde68a', -0.06, ['Who took', 'my yogurt?']); nota(745, 140, 190, 150, '#bfdbfe', 0.05, ['Fridge', 'cleanout:', 'FRIDAY']);
    nota(745, 470, 180, 130, '#fecaca', -0.04, ['Cake in', 'the kitchen']); nota(130, 470, 170, 120, '#ffffff', 0.04, ['Parking', 'lot B']); });
  plano(salaG, CORK.w, CORK.h, lzCorcho, CORK.x, CORK.y, CORK.z, false, 0.25);
  const HOJA = { x: 3.43, y: 1.68, w: 0.3, h: 0.36 };
  const lzHoja = pinta(600, 720, (x, w, h) => { x.fillStyle = '#ffffff'; x.fillRect(0, 0, w, h); x.fillStyle = '#0f766e'; x.fillRect(0, 0, w, 110); texto(x, 'VACATION', w / 2, 58, 70, '#ffffff');
    texto(x, 'Vacation days left:', w / 2, 210, 46, '#0f172a', { peso: 800 }); texto(x, '6', w / 2, 320, 150, '#0f172a');
    texto(x, 'Expire: Dec 31', w / 2, 470, 54, '#b91c1c', { peso: 850 }); texto(x, 'Taken: 0', w / 2, 590, 54, '#0f172a', { peso: 850 }); });
  plano(salaG, HOJA.w, HOJA.h, lzHoja, HOJA.x, HOJA.y, CORK.z + 0.004, false, 0.32);
  const chincheta = new T.Mesh(new T.SphereGeometry(0.012, 10, 8), mat(0xdc2626, { emissive: 0x7f1d1d, emissiveIntensity: 0.3 })); chincheta.position.set(HOJA.x, HOJA.y + HOJA.h / 2 - 0.004, CORK.z + 0.012); salaG.add(chincheta);
  // Las 6 fichas de días, en fila bajo la hoja (caen en «don’t»).
  const lzFicha = pinta(160, 160, (x, w, h) => { x.fillStyle = '#f5b94a'; x.beginPath(); x.roundRect(4, 4, w - 8, h - 8, 18); x.fill(); texto(x, '1', w / 2, 62, 74, '#422006'); texto(x, 'DAY', w / 2, 122, 38, '#422006', { peso: 800 }); });
  const mFicha = new T.MeshStandardMaterial({ map: lzFicha.tx, roughness: 0.6, emissive: 0xffffff, emissiveMap: lzFicha.tx, emissiveIntensity: 0.25 });
  const fichas = Array.from({ length: 6 }, (_, i) => { const m = new T.Mesh(new T.BoxGeometry(0.062, 0.062, 0.01), [mCajon, mCajon, mCajon, mCajon, mFicha, mCajon]); m.castShadow = true; S.add(m); m.userData.x0 = HOJA.x - 0.085 + (i % 3) * 0.085; m.userData.y0 = HOJA.y - HOJA.h / 2 - 0.065 - Math.floor(i / 3) * 0.08; return m; });
  function caenFichas(t0, t) {   // t0 = cuándo empieza a caer la primera (null: en su sitio)
    fichas.forEach((m, i) => { m.visible = true; const u = t0 == null ? -1 : t - t0 - [3, 0, 4, 1, 5, 2][i] * 0.06; const y0 = m.userData.y0;
      if (u <= 0) { m.position.set(m.userData.x0, y0, CORK.z + 0.01); m.rotation.set(0, 0, (i % 2 ? 0.05 : -0.04)); }
      else { m.position.set(m.userData.x0 + ((i % 3) - 1) * 0.08 * u, y0 - 4.9 * u * u, CORK.z + 0.01 + 0.18 * u); m.rotation.set(1.8 * u, 0.6 * u, (i % 2 ? 3 : -3) * u); } });
  }

  // ——— protagonista: cabeza articulada, gafas de leer (con etiqueta de precio si son nuevas) y cordón turquesa ———
  const cabeza = H.cuerpo.children[3];
  const cabG = new T.Group(); cabG.position.set(0, 1.6, 0); H.cuerpo.add(cabG);
  cabeza.position.set(0, 0.14, 0); cabG.add(cabeza);
  const gafas = new T.Group(); gafas.position.set(0, 0.15, 0.158); cabG.add(gafas);
  const mGaf = mat(0x0b1020, { roughness: 0.3, metalness: 0.4 });
  [-1, 1].forEach(s => {
    const aro = new T.Mesh(new T.TorusGeometry(0.043, 0.0085, 8, 24), mGaf); aro.position.set(s * 0.056, 0, 0); gafas.add(aro);
    const cri = new T.Mesh(new T.CircleGeometry(0.041, 20), new T.MeshBasicMaterial({ color: 0xbff4ff, transparent: true, opacity: 0.28, depthWrite: false })); cri.position.set(s * 0.056, 0, 0.001); gafas.add(cri);
    const pat = new T.Mesh(new T.BoxGeometry(0.007, 0.007, 0.15), mGaf); pat.position.set(s * 0.1, 0.006, -0.07); gafas.add(pat);
  });
  const puente = new T.Mesh(new T.BoxGeometry(0.03, 0.007, 0.007), mGaf); puente.position.set(0, 0.012, 0); gafas.add(puente);
  const etqG = new T.Group(); gafas.add(etqG);
  tira(etqG, V3(-0.1, 0.004, -0.02), V3(-0.112, -0.07, 0.0), 0.0018, mat(0xf8fafc));
  const lzEtq = pinta(120, 170, (x, w, h) => { x.fillStyle = '#ffffff'; x.beginPath(); x.roundRect(4, 4, w - 8, h - 8, 12); x.fill(); x.fillStyle = '#0f172a'; x.beginPath(); x.arc(w / 2, 26, 9, 0, 7); x.fill(); texto(x, '$', w / 2, 100, 84, '#0f766e'); });
  const etq = plano(etqG, 0.034, 0.048, lzEtq, -0.114, -0.094, 0.004, false, 0.4); etq.material.side = T.DoubleSide; etq.rotation.y = -0.5;
  const mCord = mat(0x2dd4bf, { emissive: 0x2dd4bf, emissiveIntensity: 0.55, roughness: 0.6 });
  const cordG = new T.Group(); H.cuerpo.add(cordG);
  tira(cordG, V3(-0.088, 1.57, 0.105), V3(-0.022, 1.255, 0.178), 0.011, mCord); tira(cordG, V3(0.088, 1.57, 0.105), V3(0.022, 1.255, 0.178), 0.011, mCord);
  tira(cordG, V3(-0.088, 1.57, 0.105), V3(0.0, 1.6, -0.09), 0.011, mCord); tira(cordG, V3(0.088, 1.57, 0.105), V3(0.0, 1.6, -0.09), 0.011, mCord);
  const lzBadge = pinta(200, 280, (x, w, h) => { x.fillStyle = '#f8fafc'; x.beginPath(); x.roundRect(0, 0, w, h, 18); x.fill(); x.fillStyle = '#14b8a6'; x.fillRect(0, 0, w, 70);
    x.fillStyle = '#94a3b8'; x.beginPath(); x.arc(w / 2, 140, 40, 0, 7); x.fill(); x.fillStyle = '#334155'; x.fillRect(40, 205, 120, 16); x.fillRect(55, 235, 90, 12); });
  plano(cordG, 0.078, 0.11, lzBadge, 0, 1.19, 0.182, false, 0.35);
  function cab(o) { cabG.rotation.set(o.x || 0, o.y || 0, o.z || 0); }
  function ponGafas(q, etiqueta) { gafas.visible = q > 0.01; gafas.position.y = 0.15 + 0.32 * (1 - q); gafas.scale.setScalar(0.6 + 0.4 * q); etqG.visible = !!etiqueta; }
  // Posturas (después de W.heroe): 'folleto' (folleto en la mano izquierda), 'encoge' (encogerse de hombros, q 0..1),
  // 'taza' (taza a la altura del pecho, mano derecha), 'sentado'.
  function pose(nombre, q) {
    q = q == null ? 1 : q; const A = H.izq, B = H.der;
    if (nombre === 'folleto') { A.hombro.rotation.x = -0.32 * q; A.hombro.rotation.z = 0.12 + 0.1 * q; A.codo.rotation.x = -0.22 - 1.0 * q; }
    else if (nombre === 'encoge') { [A, B].forEach((L, i) => { const s = i ? -1 : 1; L.hombro.rotation.x = -0.12 * q; L.hombro.rotation.z = s * (0.1 + 0.28 * q); L.hombro.rotation.y = s * 0.75 * q; L.codo.rotation.x = -0.22 - 1.3 * q; }); H.cuerpo.position.y += 0.03 * q; }
    else if (nombre === 'taza') { B.hombro.rotation.x = -0.3 * q; B.hombro.rotation.z = -0.1 + 0.06 * q; B.hombro.rotation.y = 0.62 * q; B.codo.rotation.x = -0.22 - 1.45 * q; }
    else if (nombre === 'sentado') { [A, B].forEach(L => { L.cadera.rotation.x = -1.5; L.rodilla.rotation.x = 1.5; }); A.cadera.rotation.z = 0.06; B.cadera.rotation.z = -0.06; }
  }
  const manoW = (fig, L) => { fig.g.updateMatrixWorld(true); return L.codo.localToWorld(vTmp.set(0, -0.36, 0)).clone(); };

  // ——— tazas (texto impreso de cara a la cámara) ———
  function taza(lineas, cols, tam) {
    const g = prop(), r = 0.072, h = 0.15;
    const lz = pinta(720, 256, (x, w, hh) => { x.fillStyle = '#f8fafc'; x.fillRect(0, 0, w, hh); const n = lineas.length;
      lineas.forEach((l, i) => texto(x, l, w / 2, hh / 2 + 6 + (i - (n - 1) / 2) * tam[i] * 1.08, tam[i], cols[i] || '#0f172a')); });
    const cuerpo = new T.Mesh(new T.CylinderGeometry(r, r * 0.94, h, 36, 1, true), new T.MeshStandardMaterial({ map: lz.tx, roughness: 0.4, emissive: 0xffffff, emissiveMap: lz.tx, emissiveIntensity: 0.14, side: T.DoubleSide }));
    cuerpo.rotation.y = Math.PI; cuerpo.castShadow = true; g.add(cuerpo);
    const blanco = mat(0xf1f5f9, { roughness: 0.4 });
    const fondo = new T.Mesh(new T.CircleGeometry(r * 0.94, 24), blanco); fondo.rotation.x = Math.PI / 2; fondo.position.y = -h / 2; g.add(fondo);
    const cafe = new T.Mesh(new T.CircleGeometry(r * 0.97, 24), mat(0x3b2412, { roughness: 0.3 })); cafe.rotation.x = -Math.PI / 2; cafe.position.y = h / 2 - 0.02; g.add(cafe);
    const asa = new T.Mesh(new T.TorusGeometry(0.036, 0.011, 8, 16, Math.PI), blanco); asa.rotation.z = -Math.PI / 2; asa.position.set(r, 0, 0); g.add(asa);
    const borde = new T.Mesh(new T.TorusGeometry(r, 0.0045, 6, 36), blanco); borde.rotation.x = Math.PI / 2; borde.position.y = h / 2; g.add(borde);
    return g;
  }
  const tazaH = taza(['I READ THE', 'PAMPHLET', '(page 1)'], ['#0f172a', '#0f766e', '#64748b'], [34, 42, 30]);
  const tazasC = [['HSA', '#0f766e'], ['FSA', '#b91c1c'], ['HSA', '#0f766e']].map(([l, c]) => taza([l], [c], [128]));
  function ponTaza(g, p, esc, ry) { g.visible = true; g.position.copy(p); g.rotation.set(0, ry || 0, 0); g.scale.setScalar(esc || 1); }

  // ——— tarros de cristal «HSA» y «FSA» (escena 2) y lo que cae dentro: gafas, frasco de pastillas, diente ———
  const mCristal = new T.MeshStandardMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.26, roughness: 0.08, metalness: 0.1, side: T.DoubleSide, depthWrite: false });
  function tarro(txt, col) {
    const g = prop(), r = 0.078, h = 0.18;
    const v = new T.Mesh(new T.CylinderGeometry(r, r, h, 32, 1, true), mCristal); v.position.y = h / 2; g.add(v);
    const fo = new T.Mesh(new T.CircleGeometry(r, 24), mCristal); fo.rotation.x = -Math.PI / 2; fo.position.y = 0.004; g.add(fo);
    const bo = new T.Mesh(new T.TorusGeometry(r, 0.006, 6, 32), mat(0xe2e8f0, { roughness: 0.3 })); bo.rotation.x = Math.PI / 2; bo.position.y = h; g.add(bo);
    const lz = pinta(512, 160, (x, w, hh) => { x.fillStyle = '#f8fafc'; x.fillRect(0, 0, w, hh); x.strokeStyle = col; x.lineWidth = 10; x.strokeRect(5, 5, w - 10, hh - 10); texto(x, txt, w / 2, hh / 2 + 6, 112, col); });
    const et = new T.Mesh(new T.CylinderGeometry(r + 0.002, r + 0.002, 0.05, 32, 1, true, -1.05, 2.1), new T.MeshStandardMaterial({ map: lz.tx, roughness: 0.6, emissive: 0xffffff, emissiveMap: lz.tx, emissiveIntensity: 0.25, side: T.DoubleSide }));
    et.position.y = h - 0.04; g.add(et);
    return g;
  }
  const tarros = [tarro('HSA', '#0f766e'), tarro('FSA', '#b91c1c')];
  function cosas() {   // gafas, frasco, diente (un juego por tarro)
    const g = prop(), out = [];
    const gf = new T.Group(); [-1, 1].forEach(s => { const a = new T.Mesh(new T.TorusGeometry(0.017, 0.004, 6, 16), mGaf); a.position.x = s * 0.021; gf.add(a); }); g.add(gf); out.push(gf);
    const fr = new T.Group(); const fb = new T.Mesh(new T.CylinderGeometry(0.016, 0.016, 0.044, 14), mat(0xf59e0b, { roughness: 0.3, transparent: true, opacity: 0.92 })); fr.add(fb);
    const ft = new T.Mesh(new T.CylinderGeometry(0.018, 0.018, 0.014, 14), mat(0xf8fafc)); ft.position.y = 0.029; fr.add(ft); g.add(fr); out.push(fr);
    const di = new T.Group(); const dc = new T.Mesh(new T.SphereGeometry(0.018, 12, 10), mat(0xfaf7ef, { roughness: 0.35, emissive: 0xffffff, emissiveIntensity: 0.1 })); dc.scale.set(1.1, 0.85, 0.9); di.add(dc);
    [-1, 1].forEach(s => { const rz = new T.Mesh(new T.ConeGeometry(0.008, 0.026, 8), dc.material); rz.rotation.z = Math.PI; rz.position.set(s * 0.008, -0.022, 0); di.add(rz); }); g.add(di); out.push(di);
    out.forEach(o => o.traverse(m => { if (m.isMesh) m.castShadow = true; }));
    return { g, out };
  }
  const cosasT = [cosas(), cosas()];
  // Coloca los tarros (x de cada uno) y deja caer las cosas: t0 = cuándo empieza a caer la primera.
  const POS_COSA = [[-0.026, 0.03, 0.01, 1.35, 0.3], [0.03, 0.03, -0.01, 0, 0], [0.0, 0.028, 0.03, 0.2, 0.4]];
  function ponTarros(xs, y, z, t0, t) {
    tarros.forEach((g, j) => { g.visible = true; g.position.set(xs[j], y, z); });
    cosasT.forEach((c, j) => { c.g.visible = true; c.g.position.set(xs[j], y, z);
      c.out.forEach((o, i) => { const u = t0 == null ? -1 : t - t0 - i * 0.16 - j * 0.04, P = POS_COSA[i];
        o.visible = u > 0; if (u <= 0) return; const caida = Math.min(1, u / 0.32), yy = P[1] + (0.5 - P[1]) * (1 - caida * caida), bote = u > 0.32 ? Math.max(0, Math.sin((u - 0.32) / 0.16 * Math.PI)) * 0.012 * (u < 0.48 ? 1 : 0) : 0;
        o.position.set(P[0], yy + bote, P[2]); o.rotation.set(P[3] + (1 - caida) * 2, P[4] + (1 - caida), 0); }); });
  }

  // ——— cartón de leche «FSA» (con la pegatina EXP 12/31 y el contador «$404 left») ———
  const lecheG = prop(), cuerpoL = new T.Group(); lecheG.add(cuerpoL);
  const LW = 0.14, LH = 0.24;
  const lzLeche = pinta(420, 720, (x, w, h) => { x.fillStyle = '#f8fafc'; x.fillRect(0, 0, w, h); x.fillStyle = '#1d4ed8'; x.fillRect(0, 0, w, 40);
    x.fillStyle = '#dbeafe'; x.fillRect(0, h - 330, w, 330); texto(x, 'MILK', w / 2, h - 270, 86, '#1d4ed8'); texto(x, 'FSA', w / 2, h - 135, 170, '#0f172a'); });
  const lzDorso = pinta(420, 720, (x, w, h) => { x.fillStyle = '#f1f5f9'; x.fillRect(0, 0, w, h); x.strokeStyle = 'rgba(100,116,139,.35)'; x.lineWidth = 4; x.beginPath(); x.moveTo(w - 30, 0); x.lineTo(w - 30, h); x.stroke(); ruido(x, w, h, 'rgba(0,0,0,.05)', 500, 7); });
  const mLat = mat(0xdbeafe, { roughness: 0.7 }), mBlancoL = mat(0xf8fafc, { roughness: 0.7 });
  const mFrente = new T.MeshStandardMaterial({ map: lzLeche.tx, roughness: 0.7, emissive: 0xffffff, emissiveMap: lzLeche.tx, emissiveIntensity: 0.12 });
  const mDorso = new T.MeshStandardMaterial({ map: lzDorso.tx, roughness: 0.7 });
  const cuerpoM = new T.Mesh(new T.BoxGeometry(LW, LH, LW), [mLat, mLat, mBlancoL, mBlancoL, mFrente, mDorso]); cuerpoM.position.y = LH / 2; cuerpoM.castShadow = true; cuerpoL.add(cuerpoM);
  const techo = new T.Group(); techo.position.y = LH; cuerpoL.add(techo);
  [1, -1].forEach(s => { const sl = new T.Mesh(new T.BoxGeometry(LW, 0.004, 0.087), mBlancoL); sl.position.set(0, 0.025, s * 0.035); sl.rotation.x = s * 0.62; sl.castShadow = true; techo.add(sl);
    const tri = new T.Shape(); tri.moveTo(-LW / 2, 0); tri.lineTo(LW / 2, 0); tri.lineTo(0, 0.05); const tm = new T.Mesh(new T.ShapeGeometry(tri), new T.MeshStandardMaterial({ color: 0xdbeafe, side: T.DoubleSide, roughness: 0.7 }));
    tm.rotation.y = Math.PI / 2; tm.position.x = s * LW / 2; techo.add(tm); });
  const aleta = new T.Mesh(new T.BoxGeometry(LW, 0.026, 0.006), mBlancoL); aleta.position.y = 0.063; techo.add(aleta);
  const lzExp = pinta(360, 140, (x, w, h) => { x.fillStyle = '#f5b94a'; x.beginPath(); x.roundRect(4, 4, w - 8, h - 8, 26); x.fill(); x.strokeStyle = '#92400e'; x.lineWidth = 6; x.stroke(); texto(x, 'EXP 12/31', w / 2, h / 2 + 4, 58, '#422006'); });
  const expF = plano(cuerpoL, 0.118, 0.046, lzExp, 0, 0.212, LW / 2 + 0.002, false, 0.35);
  const expD = plano(cuerpoL, 0.118, 0.046, lzExp, 0, 0.17, -LW / 2 - 0.002, false, 0.35); expD.rotation.y = Math.PI;
  const lzCuenta = lienzo(320, 170);
  function dibCuenta(n) { const clave = String(n); if (lzCuenta.clave === clave) return; lzCuenta.clave = clave; const x = lzCuenta.x, w = 320, h = 170;
    x.clearRect(0, 0, w, h); x.fillStyle = '#fef9c3'; x.beginPath(); x.roundRect(4, 4, w - 8, h - 8, 14); x.fill(); x.strokeStyle = '#a16207'; x.lineWidth = 5; x.stroke();
    texto(x, '$' + n, w / 2, 74, 96, n === 0 ? '#dc2626' : '#b91c1c'); texto(x, 'left', w / 2, 140, 40, '#422006', { peso: 800 }); lzCuenta.tx.needsUpdate = true; }
  dibCuenta(${PERD});
  const cuentaP = plano(cuerpoL, 0.118, 0.063, lzCuenta, 0, 0.152, LW / 2 + 0.004, false, 0.45);
  // o = { x, y, z, ry, esc, expF, expD (0..1 = pegatina estampándose), cuenta: n | null, desinfla 0..1 }
  function leche(o) {
    lecheG.visible = true; lecheG.position.set(o.x, o.y, o.z); lecheG.rotation.set(0, o.ry || 0, o.rz || 0); lecheG.scale.setScalar(o.esc || 1);
    const pega = (pl, v, sgn) => { pl.visible = v != null && v > 0; if (!pl.visible) return; const k = 1 + 0.6 * (1 - v); pl.scale.set(k, k, 1); pl.position.z = sgn * (LW / 2 + 0.002 + 0.05 * (1 - v)); };
    pega(expF, o.expF == null ? 1 : o.expF, 1); pega(expD, o.expD == null ? 0 : o.expD, -1);
    cuentaP.visible = o.cuenta != null; if (o.cuenta != null) dibCuenta(o.cuenta);
    const d = o.desinfla || 0; cuerpoL.scale.set(1 + 0.14 * d, 1 - 0.42 * d, 1 + 0.1 * d); cuerpoL.rotation.z = -0.07 * d;
  }

  // ——— tarro de miel turquesa «HSA» (etiqueta «EXP: no.» y la ramita que crece) ———
  const mielG = prop(), mielC = new T.Group(); mielG.add(mielC);
  const mMiel = mat(0x2dd4bf, { emissive: 0x0d9488, emissiveIntensity: 0.38, roughness: 0.22 });
  const cuerpoMi = new T.Mesh(new T.CylinderGeometry(0.07, 0.07, 0.15, 32), mMiel); cuerpoMi.position.y = 0.075; cuerpoMi.castShadow = true; mielC.add(cuerpoMi);
  const tapa = new T.Mesh(new T.CylinderGeometry(0.074, 0.074, 0.034, 32), mat(0xd4a017, { roughness: 0.35, metalness: 0.3 })); tapa.position.y = 0.167; tapa.castShadow = true; mielC.add(tapa);
  const lzMiel = pinta(512, 200, (x, w, h) => { x.fillStyle = '#f8fafc'; x.fillRect(0, 0, w, h); texto(x, 'HSA', w / 2, 86, 120, '#0f766e'); texto(x, 'honey', w / 2, 168, 40, '#475569', { peso: 700 }); });
  const etMi = new T.Mesh(new T.CylinderGeometry(0.0712, 0.0712, 0.078, 32, 1, true, -1.15, 2.3), new T.MeshStandardMaterial({ map: lzMiel.tx, roughness: 0.6, emissive: 0xffffff, emissiveMap: lzMiel.tx, emissiveIntensity: 0.22 }));
  etMi.position.y = 0.072; mielC.add(etMi);
  const tagMi = new T.Group(); mielC.add(tagMi);
  tira(tagMi, V3(0.06, 0.168, 0.04), V3(0.085, 0.118, 0.07), 0.0015, mat(0x1e293b));
  const lzNo = pinta(260, 130, (x, w, h) => { x.fillStyle = '#f5b94a'; x.beginPath(); x.roundRect(4, 4, w - 8, h - 8, 18); x.fill(); x.fillStyle = '#422006'; x.beginPath(); x.arc(24, h / 2, 8, 0, 7); x.fill(); texto(x, 'EXP: no.', w / 2 + 12, h / 2 + 3, 50, '#422006'); });
  const noP = plano(tagMi, 0.085, 0.042, lzNo, 0.11, 0.1, 0.075, false, 0.35); noP.material.side = T.DoubleSide; noP.rotation.set(0, -0.25, -0.12);
  const ramaG = new T.Group(); ramaG.position.y = 0.184; mielC.add(ramaG);
  const mRama = mat(0x2dd4bf, { emissive: 0x2dd4bf, emissiveIntensity: 0.7, roughness: 0.5 });
  const tallo = new T.Mesh(new T.CylinderGeometry(0.0045, 0.006, 0.15, 8), mRama); tallo.position.y = 0.075; ramaG.add(tallo);
  [[0.05, 0.6, 1], [0.09, -0.7, -1], [0.135, 0.4, 1]].forEach(([y, rz, s]) => { const h = new T.Mesh(new T.SphereGeometry(0.026, 12, 8), mRama); h.scale.set(1, 0.32, 0.55); h.position.set(s * 0.024, y, 0); h.rotation.z = rz; ramaG.add(h); });
  // o = { x, y, z, ry, esc, rama 0..1+, etiqueta, rueda (ángulo de vaivén), giro }
  function miel(o) {
    mielG.visible = true; mielG.position.set(o.x, o.y, o.z); mielG.rotation.set(0, o.ry || 0, 0); mielG.scale.setScalar(o.esc || 1);
    mielC.rotation.set(0, 0, o.rueda || 0); const r = o.rama || 0; ramaG.visible = r > 0.01; ramaG.scale.set(Math.max(0.001, r), Math.max(0.001, r), Math.max(0.001, r)); tagMi.visible = !!o.etiqueta;
  }

  // ——— folleto «Your Benefits, Simplified · 64 pages» y formulario de impuestos ———
  const lzFolleto = pinta(420, 560, (x, w, h) => { x.fillStyle = '#f8fafc'; x.fillRect(0, 0, w, h); x.fillStyle = '#0f766e'; x.fillRect(0, 0, w, 230);
    texto(x, 'Your Benefits,', w / 2, 84, 50, '#ffffff'); texto(x, 'Simplified', w / 2, 152, 58, '#ccfbf1');
    x.fillStyle = '#cbd5e1'; [270, 300, 330, 360, 390, 420].forEach((y, i) => x.fillRect(40, y, i % 3 === 2 ? 200 : 340, 12));
    x.fillStyle = '#0f172a'; x.beginPath(); x.roundRect(220, 466, 170, 66, 14); x.fill(); texto(x, '64 pages', 305, 500, 34, '#ffffff', { peso: 800 }); });
  const folletoG = prop(); const fol = new T.Mesh(new T.BoxGeometry(0.21, 0.28, 0.008), [mBlancoL, mBlancoL, mBlancoL, mBlancoL, new T.MeshStandardMaterial({ map: lzFolleto.tx, roughness: 0.7, emissive: 0xffffff, emissiveMap: lzFolleto.tx, emissiveIntensity: 0.18 }), mBlancoL]);
  fol.castShadow = true; folletoG.add(fol);
  function folleto(p, rx, ry, rz, esc) { folletoG.visible = true; folletoG.position.copy(p); folletoG.rotation.set(rx || 0, ry || 0, rz || 0, 'YXZ'); folletoG.scale.setScalar(esc || 1); }
  const lzForm = pinta(400, 520, (x, w, h) => { x.fillStyle = '#ffffff'; x.fillRect(0, 0, w, h); x.fillStyle = '#b91c1c'; x.fillRect(0, 0, w, 90); texto(x, 'TAX FORM', w / 2, 48, 54, '#ffffff');
    x.strokeStyle = '#94a3b8'; x.lineWidth = 3; for (let r = 0; r < 9; r++) { x.strokeRect(30, 120 + r * 42, 240, 30); x.strokeRect(290, 120 + r * 42, 80, 30); } });
  const formG = prop(); const formM = new T.Mesh(new T.PlaneGeometry(0.2, 0.26), new T.MeshStandardMaterial({ map: lzForm.tx, roughness: 0.8, side: T.DoubleSide, emissive: 0xffffff, emissiveMap: lzForm.tx, emissiveIntensity: 0.15 }));
  formM.castShadow = true; formG.add(formM);
  function formulario(p, rx, ry, rz, esc) { formG.visible = true; formG.position.copy(p); formG.rotation.set(rx || 0, ry || 0, rz || 0, 'YXZ'); formG.scale.setScalar(esc || 1); }

  // ——— el diagrama (x = 40): pizarra, balda, nómina, bloque TAX con su montón de monedas, deslizador y monedas que saltan ———
  const DX = 40, DZ = -0.95;
  const diaG = grupo();
  caja(diaG, 7, 4.4, 0.2, mat(0x2b3a4e, { roughness: 0.9 }), DX, 2.2, -1.35);
  const sueloD = new T.Mesh(new T.PlaneGeometry(7, 6), new T.MeshStandardMaterial({ map: lzSuelo.tx, roughness: 0.7 })); sueloD.rotation.x = -Math.PI / 2; sueloD.position.set(DX, 0.008, 1.5); sueloD.receiveShadow = true; diaG.add(sueloD);
  const curva = (s, u, yFin) => { const P0 = [s * 0.06, 1.8], P1 = [s * 0.34, 2.14], P2 = [s * 0.3, yFin], k = 1 - u; return [k * k * P0[0] + 2 * k * u * P1[0] + u * u * P2[0], k * k * P0[1] + 2 * k * u * P1[1] + u * u * P2[1]]; };
  const lzPiz = lienzo(1120, 1040);
  function dibPiz(arcos) {
    const a = Math.round(arcos * 30) / 30, clave = String(a); if (lzPiz.clave === clave) return; lzPiz.clave = clave;
    const x = lzPiz.x, w = 1120, h = 1040; x.fillStyle = '#e8edf2'; x.fillRect(0, 0, w, h);
    x.save(); x.globalAlpha = 0.07; texto(x, 'Q4 ideas?', 230, 120, 60, '#334155', { peso: 700, rot: -0.05 }); texto(x, 'coffee = fuel', 880, 930, 50, '#334155', { peso: 700, rot: 0.04 }); x.restore();
    if (a > 0) { // flechas a rotulador: el camino de las monedas, por encima del bloque TAX
      const B = (s, u) => curva(s, u, 1.3);
      const px = (p) => [560 + p[0] * 1.12 * 400, 520 - (1.56 + (p[1] - 1.56) * 1.12 - 1.6) * 400];   // ×1,12: la pizarra está detrás de las monedas
      [-1, 1].forEach(s => { x.save(); x.strokeStyle = '#0d9488'; x.lineWidth = 9; x.lineCap = 'round'; x.setLineDash([22, 18]); x.beginPath();
        for (let i = 0; i <= 40 * a; i++) { const q = px(B(s, i / 40)); i ? x.lineTo(q[0], q[1]) : x.moveTo(q[0], q[1]); } x.stroke(); x.restore();
        if (a > 0.97) { const e = px(B(s, 1)), d = px(B(s, 0.94)), an = Math.atan2(e[1] - d[1], e[0] - d[0]); x.save(); x.strokeStyle = '#0d9488'; x.lineWidth = 9; x.lineCap = 'round'; x.beginPath();
          x.moveTo(e[0] - 30 * Math.cos(an - 0.5), e[1] - 30 * Math.sin(an - 0.5)); x.lineTo(e[0], e[1]); x.lineTo(e[0] - 30 * Math.cos(an + 0.5), e[1] - 30 * Math.sin(an + 0.5)); x.stroke(); x.restore(); } }); }
    lzPiz.tx.needsUpdate = true;
  }
  dibPiz(0);
  const mMarco = mat(0xb6c0cc, { metalness: 0.6, roughness: 0.35 });
  plano(diaG, 2.8, 2.6, lzPiz, DX, 1.6, -1.235, false, 0.12).material.transparent = false;
  [[2.88, 0.05, 0, 2.925], [2.88, 0.05, 0, 0.275], [0.05, 2.7, -1.425, 1.6], [0.05, 2.7, 1.425, 1.6]].forEach(([w, h, dx, y]) => caja(diaG, w, h, 0.05, mMarco, DX + dx, y, -1.22));
  caja(diaG, 1.3, 0.04, 0.34, mat(0x8b6440, { roughness: 0.6 }), DX, 0.98, DZ);
  [-0.55, 0.55].forEach(dx => caja(diaG, 0.04, 0.1, 0.3, mMarco, DX + dx, 0.91, DZ - 0.02));
  const lzNomina = pinta(620, 280, (x, w, h) => { x.fillStyle = '#ecfdf5'; x.fillRect(0, 0, w, h); x.strokeStyle = '#0f766e'; x.lineWidth = 8; x.strokeRect(10, 10, w - 20, h - 20);
    texto(x, 'PAY TO THE ORDER OF', 40, 62, 26, '#334155', { al: 'left', peso: 800 }); texto(x, 'YOU', 40, 112, 54, '#0f172a', { al: 'left' });
    x.fillStyle = '#ffffff'; x.fillRect(390, 70, 190, 70); x.strokeStyle = '#334155'; x.lineWidth = 3; x.strokeRect(390, 70, 190, 70); texto(x, '$ ••••', 485, 106, 40, '#0f172a', { peso: 800 });
    x.fillStyle = '#94a3b8'; x.fillRect(40, 176, 320, 6); x.fillRect(40, 220, 220, 6); x.fillRect(400, 220, 180, 6); texto(x, 'memo: salary', 40, 200, 24, '#64748b', { al: 'left', peso: 700 }); });
  const nominaG = new T.Group(); diaG.add(nominaG); nominaG.position.set(DX, 1.9, DZ); nominaG.rotation.z = 0.03; nominaG.scale.setScalar(0.75);
  const nomina = new T.Mesh(new T.BoxGeometry(0.58, 0.26, 0.01), [mBlancoL, mBlancoL, mBlancoL, mBlancoL, new T.MeshStandardMaterial({ map: lzNomina.tx, roughness: 0.7, emissive: 0xffffff, emissiveMap: lzNomina.tx, emissiveIntensity: 0.2 }), mBlancoL]); nomina.castShadow = true; nominaG.add(nomina);
  const lzTax = pinta(400, 240, (x, w, h) => { x.fillStyle = '#dc2626'; x.fillRect(0, 0, w, h); x.strokeStyle = '#7f1d1d'; x.lineWidth = 12; x.strokeRect(6, 6, w - 12, h - 12); texto(x, 'TAX', w / 2, h / 2 + 6, 150, '#ffffff'); });
  const mRojo = mat(0xb91c1c, { roughness: 0.5 });
  const taxM = new T.Mesh(new T.BoxGeometry(0.34, 0.2, 0.1), [mRojo, mRojo, mRojo, mRojo, new T.MeshStandardMaterial({ map: lzTax.tx, roughness: 0.5, emissive: 0xffffff, emissiveMap: lzTax.tx, emissiveIntensity: 0.25 }), mRojo]);
  taxM.position.set(DX, 1.5, DZ); taxM.scale.setScalar(0.8); taxM.castShadow = true; diaG.add(taxM);
  const mOro = mat(0xf5c542, { emissive: 0x8a6400, emissiveIntensity: 0.45, metalness: 0.55, roughness: 0.3 });
  const geoMon = new T.CylinderGeometry(0.048, 0.048, 0.012, 22);
  const pila = Array.from({ length: 8 }, (_, i) => { const m = new T.Mesh(geoMon, mOro); m.position.set(DX + 0.05 + Math.sin(i * 2.3) * 0.008, 1.586 + i * 0.0125, DZ + Math.cos(i * 1.7) * 0.006); m.castShadow = true; diaG.add(m); return m; });
  const pista = caja(diaG, 0.03, 0.26, 0.02, mNegro, DX + 0.4, 1.9, DZ);
  const mTq = mat(0x2dd4bf, { emissive: 0x2dd4bf, emissiveIntensity: 0.6, roughness: 0.4 });
  const relleno = caja(diaG, 0.02, 1, 0.024, mTq, DX + 0.4, 1.77, DZ + 0.004);
  const pomo = caja(diaG, 0.09, 0.04, 0.05, mTq, DX + 0.4, 1.8, DZ + 0.01);
  const monedas = Array.from({ length: 24 }, () => { const m = new T.Mesh(geoMon, mOro); m.visible = false; m.castShadow = true; S.add(m); return m; });
  // o = { t0: empiezan a saltar, t1: chorro más rápido, desliza 0..1, pila 0..1 (cuánto queda del montón), arcos 0..1 }
  function diagrama(t, o) {
    dibPiz(o.arcos || 0);
    const sl = o.desliza || 0; pomo.position.y = 1.8 + 0.2 * sl; relleno.scale.y = Math.max(0.001, 0.03 + 0.2 * sl); relleno.position.y = 1.77 + relleno.scale.y / 2;
    const quedan = Math.round(3 + 5 * (o.pila == null ? 1 : o.pila)); pila.forEach((m, i) => { m.visible = i < quedan; });
    let k = 0;
    if (o.t0 != null && t > o.t0) {
      const tiempos = []; let ts = o.t0, n = 0;
      while (ts <= t && n < 400) { tiempos.push(ts); ts += (o.t1 != null && ts >= o.t1) ? 0.19 : 0.42; n++; }
      tiempos.forEach((t0, i) => { const u = (t - t0) / 1.05; if (u < 0 || u >= 1) return; const s = i % 2 ? 1 : -1, P = curva(s, u, s < 0 ? 1.36 : 1.22);
        const m = monedas[k++ % monedas.length]; m.visible = true; m.position.set(DX + P[0], P[1], DZ + 0.02); m.rotation.set(Math.PI / 2, 0, t * 9 + i); });
    }
  }

  function apagar() {
    objs.forEach(g => { g.visible = false; }); props.forEach(g => { g.visible = false; }); monedas.forEach(m => { m.visible = false; }); fichas.forEach(m => { m.visible = false; });
    cab({}); ponGafas(0); H.cuerpo.rotation.set(0, 0, 0); H.izq.hombro.rotation.y = H.der.hombro.rotation.y = 0; noche(0); nevera(0, 0); armario(0); despensa(0); calendario(10, 0, 0); dibReloj('12:30 PM');
  }
  const ver = (g) => { g.visible = true; };
  return { sala: () => ver(salaG), dia: () => ver(diaG), noche, nevera, armario, despensa, calendario, dibReloj, caenFichas, cab, ponGafas, pose, manoW,
    tazaH, tazasC, ponTaza, ponTarros, leche, miel, folleto, formulario, diagrama, apagar,
    NCX, NCZ, BALDA, TOPE, CZ1, BX1, BCY, BZ1, PAP, CAL, SOX, SOZ, CORK, HOJA, DX, DZ, AX1, ACY };
})();
W3.X = X3;
`;

const PIE5 = `Federal tax. California and New Jersey don't follow the HSA tax break · Investing can lose value, not a promise · 2027 limits: FSA ${usd(FSA27)} · HSA ${usd(HSA27)} self / ${usd(HSA27F)} family (IRS)`;

const ESCENAS = [
  // 0 · tarjeta-título «HSA vs FSA» delante del protagonista (fotograma 0 lleno); golpe de zoom del 4 % en «versus».
  { html: () => `<canvas class="carta" width="620" height="740"></canvas>`,
    anim: function (s, e, el) {
      const c = el.querySelector('canvas'); cartaEN(c, { tipo: 'titulo' });
      const m = e.seg[0].marcas[0] != null ? e.seg[0].marcas[0] : 0.9, z = 1 + 0.04 * sale(tramo(s, m - 0.04, m + 0.1));
      c.style.transform = 'translateX(-50%) scale(' + z + ')';
    } },
  // 1 · mundo y creencia: «HSA = FSA?» en «same thing» (el «=» en ámbar).
  { html: () => `<div class="r2" style="top:1215px">HSA <span class="amb">=</span> FSA?</div>`,
    anim: function (s, e, el) { const r = e.seg[0].res[0], a = r ? r.ini : 1.6, p = sale(tramo(s, a - 0.05, a + 0.2)), n = el.querySelector('.r2');
      n.style.opacity = p; n.style.transform = 'translateX(-50%) scale(' + (0.85 + 0.15 * p) + ')'; } },
  // 2 · espejo: dos columnas; cada ✓ sale en su palabra.
  { html: () => `<div class="cols" style="top:540px"><div class="col"><b><span class="tqc">H</span>SA</b><i><u>✓</u> doctor</i><i><u>✓</u> taxes</i></div>
      <div class="col"><b><span class="rjc">F</span>SA</b><i><u>✓</u> doctor</i><i><u>✓</u> taxes</i></div></div>`,
    anim: function (s, e, el) { el.style.opacity = 1; const R = e.seg[0].res, a = [R[0] ? R[0].ini : 0.9, R[1] ? R[1].ini : 2.2];
      el.querySelectorAll('.col').forEach(c => c.querySelectorAll('i').forEach((n, j) => { const p = sale(tramo(s, a[j] - 0.04, a[j] + 0.18)); n.style.opacity = p; n.style.transform = 'translateX(' + (1 - p) * -24 + 'px)'; })); } },
  { html: () => '', anim: null },   // 3 · giro con accesorio (la pegatina va en 3D)
  // 4 · adelanto: «FSA → expires» / «HSA → stays» en su palabra y el pie pequeño del IRS; en «honey», corte al diagrama.
  { html: () => `<div class="r2 rj" style="top:430px">FSA → <span class="rjc">expires</span></div><div class="r2 tq" style="top:552px">HSA → <span class="tqc">stays</span></div>
      <div class="pie p4" style="top:1420px"><p>Generally, calendar-year plans. Some plans: carry over up to ${usd(ARR26)} of 2026 money (${usd(ARR27)} of 2027 money) or a grace period up to 2½ months, not both · IRS</p>
      <p>HSA needs an HSA-eligible plan: high-deductible (2027: ≥ ${usd(HDHP)} self / ${usd(HDHPF)} family) or, since 2026, an ACA bronze or catastrophic plan · IRS</p></div>
      <div class="pie p5" style="top:196px">${PIE5}</div>`,
    anim: function (s, e, el) {
      const R = e.seg[0].res, M = e.seg[0].marcas, hon = M[3] != null ? M[3] : 5.6, rs = el.querySelectorAll('.r2');
      [R[0] ? R[0].ini : 0.6, R[1] ? R[1].ini : 1.9].forEach((a, j) => { const p = sale(tramo(s, a - 0.05, a + 0.2)) * (s < hon ? 1 : 0); rs[j].style.opacity = p; rs[j].style.transform = 'translateX(-50%) scale(' + (0.85 + 0.15 * p) + ')'; });
      el.querySelector('.p4').style.opacity = s < hon ? Math.min(1, tramo(s, 0.15, 0.5)) : 0; el.querySelector('.p5').style.opacity = s >= hon ? 1 : 0;
    } },
  // 5 · cómo funciona: el pie fijo y el aparte de «INVESTED» (lo coloca TRES junto al rótulo).
  { html: () => `<div class="pie" style="top:196px;opacity:1">${PIE5}</div><div class="inv" id="inv"><b>INVESTED</b><span>(only ~1 in ${UNO_DE} HSAs are<br>· Devenir, Jun 2026)</span></div>`,
    anim: function (s, e, el) { el.style.opacity = 1; } },
  { html: () => '', anim: null },   // 6 · todo va bien (3 golpes; la taza va en 3D)
  // 7 · pausa: línea pequeña de EBRI; en «lost money», la línea larga.
  // La línea de la pausa va arriba a la derecha: abajo tapaba la nota «$404 left» del cartón en el acercamiento.
  // v2: 40 px más abajo y más estrecha (empieza en x = 680 px): al final del acercamiento el reloj sale por arriba y la
  // caja ya no le tapa el «PM».
  { html: () => `<div class="pie e1" style="top:224px;left:auto;right:36px;width:364px;font-size:23px">Avg. lost by FSA users who forfeited, 2024: ${usd(PERD)} · EBRI</div>
      <div class="pie e2" style="top:1450px">EBRI FSA Database · 3.3M+ accounts · 2024 data (Oct 21, 2026) · ${usd(PERD)} = average among those who forfeited</div>`,
    anim: function (s, e, el) { const M = e.seg[0].marcas, lost = M[1] != null ? M[1] : 10.6, pz = e.pausa || { sonido: 0.6 };
      el.querySelector('.e1').style.opacity = s < lost ? tramo(s, pz.sonido + 0.6, pz.sonido + 1.1) : 0; el.querySelector('.e2').style.opacity = s >= lost ? 1 : 0; } },
  // 8 · respuesta: la tarjeta (mismo trazo, papel y tamaño que la del título) «FSA =» → «USE IT OR LOSE IT» en «name»,
  // subrayado turquesa en «use it» y, en «lose it», se ladea 3° y entra la cita del IRS.
  { html: () => `<canvas class="carta" width="620" height="740"></canvas><div class="cita" style="top:1365px">IRS Publication 969: “FSAs are generally<br>use-it-or-lose-it plans.”</div>`,
    anim: function (s, e, el) {
      el.style.opacity = 1;   // corte seco: la tarjeta está entera desde el primer fotograma de la escena
      const M = e.seg[0].marcas, m0 = M[0] != null ? M[0] : 1.0, m1 = M[1] != null ? M[1] : 1.9, m2 = M[2] != null ? M[2] : 2.6, c = el.querySelector('canvas');
      cartaEN(c, { tipo: 'cuenta', esc: Math.round(tramo(s, m0, m0 + 0.9) * 45) / 45, sub: Math.round(tramo(s, m1, m1 + 0.28) * 20) / 20 });
      c.style.transform = 'translateX(-50%) rotate(' + (3 * sale(tramo(s, m2, m2 + 0.18))) + 'deg)';
      el.querySelector('.cita').style.opacity = sale(tramo(s, m2 + 0.05, m2 + 0.35));
    } },
  { html: () => '', anim: null }    // 9 · analogía (tablón y tarro que rueda) y final mudo
];

// Coreografía 3D. Cada escena tiene varios planos (cortes en sus marcas §), como pide el esqueleto.
const TRES = function (t, k, s, e, W) {
  const X = W.X; X.apagar();
  const cv = document.getElementById('c3d'), fl = k === 8 ? 'blur(9px) brightness(.58)' : ''; if (cv.style.filter !== fl) cv.style.filter = fl;
  const M = e.seg.flatMap(g => g.marcas), mk = (j, d) => e.ini + (M[j] != null ? M[j] : d);
  const q = (a, d) => sale(tramo(t, a, a + (d || 0.45)));
  const mez = (P, Q, u) => P.map((v, j) => v + (Q[j] - v) * u);
  const cam = (P, Q, u) => W.camara(...(Q ? mez(P, Q, Math.max(0, Math.min(1, u))) : P));
  const TQ = '#5eead4', ROJO = '#f87171', AMB = '#f5b94a', BL = '#e2e8f0';
  const fuera = { x: -60, z: -60, esc: 0 };
  let directo = () => fuera, tras = null;
  const heroe = (o) => W.heroe(Object.assign({ luz: 0 }, o));
  const V = (x, y, z) => new W.T.Vector3(x, y, z);
  // Plano del fotograma 0 y del final mudo (mismo encuadre: el bucle empalma).
  const HX = -1.62, HZ = -1.35, P0 = [HX, 1.2, HZ + 3.0, HX, 1.12, HZ];
  const plano0 = (o) => { X.sala(); heroe({ x: HX, z: HZ, gira: 0 }); X.pose('folleto'); const p = X.manoW(W.H, W.H.izq); X.folleto(V(p.x + 0.02, p.y + 0.1, p.z + 0.05), -0.12, 0, 0.1); X.cab(o || {}); cam(P0); };
  const sentadoSofa = (gx) => { heroe({ x: X.SOX - 0.5, z: X.SOZ + 0.1, y: -0.5, gira: gx || 0 }); X.pose('sentado'); };
  const LX = -0.52, MX = -0.27;   // el cartón y la miel en la encimera (debajo del calendario)
  // La caja de las cosas del diagrama: milk y honey en la balda, más grandes.
  const DX = X.DX, DZ = X.DZ;
  const dia = (tIni, o) => {
    X.dia(); W.niebla(6, 20); X.diagrama(t, o);
    X.leche({ x: DX - 0.3, y: 1.0, z: DZ, esc: 1.25, expF: 1 }); X.miel({ x: DX + 0.3, y: 1.0, z: DZ, esc: 1.25, rama: o.rama || 0 });
    // Encuadre 5,5 cm a la derecha y 6 cm más abierto que en la v1: todo el diagrama queda ~60 px más a la izquierda y la
    // miel con su ramita ya no entra en la zona de los botones de Instagram (x ≥ 920 px).
    const u = sale(tramo(t, tIni, tIni + 12.6)), CXd = DX + 0.055;
    cam([CXd, 1.57, 1.41, CXd, 1.55, DZ], [CXd, 1.56, 1.26, CXd, 1.55, DZ], u);
  };

  if (k === 0) {
    plano0();
  } else if (k === 1) {
    // 1 · Mundo y creencia: junto a la cafetera, tres compañeros brindan con sus tazas «HSA» y «FSA» y asienten; en «like»,
    // plano medio del protagonista encogiéndose de hombros (el rótulo «HSA = FSA?» es 2D).
    const m0 = mk(0, 1.0); X.sala();
    if (t < m0) {
      const C0 = [-2.1, -1.7], sitios = [[-2.78, -1.5, 1.0], [-1.42, -1.5, -1.0], [-1.92, -1.92, 0.2]];
      directo = (i) => i < 3 ? { x: sitios[i][0], z: sitios[i][1], rot: sitios[i][2], amp: 0 } : fuera;
      tras = () => { const br = sale(tramo(t, e.ini + 0.05, e.ini + 0.5)), cl = Math.max(0, Math.sin(tramo(t, e.ini + 0.5, e.ini + 0.75) * Math.PI));
        for (let i = 0; i < 3; i++) { const a = W.gente[i];
          a.der.hombro.rotation.x = -0.4 - 0.75 * br; a.der.hombro.rotation.z = -0.1 - 0.15 * br; a.der.codo.rotation.x = -1.1 + 0.35 * br + 0.1 * cl;
          a.cuerpo.rotation.x = 0.04 + Math.max(0, Math.sin(tramo(t, e.ini + 0.8, e.ini + 1.5) * Math.PI * 2)) * 0.12;
          const p = X.manoW(a, a.der); X.ponTaza(X.tazasC[i], V(p.x, p.y + 0.05, p.z), 1.15, 0); } };
      cam([C0[0], 1.55, 2.35, C0[0], 1.25, -1.8], [C0[0], 1.55, 2.2, C0[0], 1.25, -1.8], tramo(t, e.ini, m0));
    } else {
      heroe({ x: -0.95, z: -1.4, gira: 0.1 }); const en = sale(tramo(t, m0, m0 + 0.35)); X.pose('encoge', en); X.cab({ z: 0.16 * en, x: -0.05 * en });
      cam([-0.95, 1.5, 0.9, -0.95, 1.47, -1.4], [-0.95, 1.5, 0.8, -0.95, 1.47, -1.4], tramo(t, m0, e.fin));
    }
  } else if (k === 2) {
    // 2 · Espejo: dos tarros idénticos «HSA» y «FSA»; en «doctor» caen en los dos unas gafas, un frasco y un diente. En el
    // segundo «Both», inserto del folleto; en «taxes», un formulario cae encima, rebota y sale del cuadro.
    const m0 = mk(0, 0.9), m1 = mk(1, 1.5), m2 = mk(2, 2.1); X.sala();
    if (t < m1) {
      X.ponTarros([-0.95, -0.65], X.TOPE, -2.62, m0 - 0.05, t);
      cam([-0.8, 1.27, -1.38, -0.8, 1.06, -2.62], [-0.8, 1.27, -1.46, -0.8, 1.06, -2.62], tramo(t, e.ini, m1));
    } else {
      X.folleto(V(-0.25, X.TOPE + 0.005, -2.6), -Math.PI / 2, 0.08, 0);
      if (t > m2 - 0.12) { const u = t - (m2 - 0.12), cae = Math.min(1, u / 0.16), bote = u > 0.16 ? Math.max(0, Math.sin(tramo(u, 0.16, 0.34) * Math.PI)) * 0.05 : 0, sal = sale(tramo(u, 0.3, 0.65));
        X.formulario(V(-0.25 + 0.42 * sal, X.TOPE + 0.012 + 0.32 * (1 - cae * cae) + bote, -2.58 - 0.05 * sal), -Math.PI / 2 + 0.6 * (1 - cae) + 0.3 * sal, -0.3 + 0.9 * sal, 0); }
      W.camara(-0.25, X.TOPE + 0.74, -2.5, -0.25, X.TOPE, -2.67);
    }
  } else if (k === 3) {
    // 3 · Giro con accesorio: primer plano; en «one» se pone las gafas de leer y se inclina. En «expiration», inserto: la
    // pegatina «EXP 12/31» se estampa en un recipiente de espaldas (no se ve cuál es).
    const m0 = mk(0, 0.4), m1 = mk(1, 1.1); X.sala();
    if (t < m1) {
      heroe({ x: 2.05, z: -1.05, gira: -0.05 }); X.ponGafas(sale(tramo(t, m0 - 0.1, m0 + 0.35))); const inc = q(m0 + 0.15, 0.45);
      W.H.cuerpo.rotation.x = 0.1 * inc; X.cab({ x: 0.1 * inc });
      cam([2.05, 1.72, 0.45, 2.05, 1.66, -1.05], [2.05, 1.71, 0.3, 2.05, 1.65, -1.05], tramo(t, e.ini, m1));
    } else {
      const est = sale(tramo(t, m1 + 0.04, m1 + 0.16));
      X.leche({ x: LX, y: X.TOPE, z: -2.62, ry: Math.PI, expF: 0, expD: t > m1 + 0.04 ? est : 0 });
      const sac = t > m1 + 0.16 ? Math.sin((t - m1) * 70) * 0.004 * Math.max(0, 1 - (t - m1 - 0.16) / 0.25) : 0;
      W.camara(LX + sac, X.TOPE + 0.19, -1.92, LX, X.TOPE + 0.17, -2.62);
    }
  } else if (k === 4) {
    // 4 · Adelanto: la nevera abierta (era el cartón de leche «FSA» con «EXP 12/31»); en «HSA money», el armario: el tarro de
    // miel «HSA» con la etiqueta «EXP: no.»; en «milk», los dos juntos en la encimera; en «honey», corte seco al diagrama.
    const m1 = mk(1, 1.3), m2 = mk(2, 3.4), m3 = mk(3, 4.6); X.sala();
    if (t < m1) {
      X.nevera(0.82 + 0.18 * sale(tramo(t, e.ini, e.ini + 0.35)), 0.7);
      X.leche({ x: X.NCX + 0.05, y: X.BALDA[1] + 0.006, z: -2.55, ry: -0.12 });
      cam([X.NCX + 0.05, 1.36, -1.35, X.NCX + 0.05, 1.24, -2.6], [X.NCX + 0.05, 1.35, -1.45, X.NCX + 0.05, 1.24, -2.6], tramo(t, e.ini, m1));
    } else if (t < m2) {
      X.armario(0.85 + 0.15 * sale(tramo(t, m1, m1 + 0.3)));
      X.miel({ x: -0.95, y: 1.57, z: -2.76, ry: -0.15, etiqueta: true });
      cam([-0.9, 1.78, -1.75, -0.95, 1.73, -2.76], [-0.9, 1.77, -1.85, -0.95, 1.73, -2.76], tramo(t, m1, m2));
    } else if (t < m3) {
      // Cámara 7 cm a la derecha y 21 cm más atrás que en la v1: la etiqueta «EXP: no.» de la miel quedaba en x ≈ 900–1.060 px,
      // donde van los botones de Instagram; ahora acaba antes de los 880 px y la leche sigue entera por la izquierda.
      X.leche({ x: LX, y: X.TOPE, z: -2.62, ry: 0.15 }); X.miel({ x: MX, y: X.TOPE, z: -2.62, ry: -0.2, etiqueta: true });
      cam([-0.325, 1.2, -1.17, -0.325, 1.12, -2.62], [-0.325, 1.2, -1.24, -0.325, 1.12, -2.62], tramo(t, m2, m3));
    } else dia(m3, {});
  } else if (k === 5) {
    // 5 · Cómo funciona: una toma sin cortes desde «honey» con un acercamiento muy lento a la pizarra. La nómina suelta
    // monedas que saltan por encima del bloque TAX y caen en la leche y en la miel; una capa nueva en cada palabra.
    const E4 = ESC[4], M4 = E4.seg.flatMap(g => g.marcas), tIni = E4.ini + (M4[3] != null ? M4[3] : 5.9);
    const m = (j, d) => mk(j, d);
    const o = { t0: m(0, 0.9) - 0.2, t1: m(3, 5.2), desliza: 0.15 + 0.85 * q(m(3, 5.2) - 0.05, 0.6), pila: 1 - q(m(4, 6.3) - 0.05, 0.9), arcos: tramo(t, m(1, 1.5) - 0.05, m(1, 1.5) + 0.7),
      rama: 1.0 * sale(tramo(t, m(5, 8.5) - 0.05, m(5, 8.5) + 2.6)) };
    dia(tIni, o);
    W.rotulo('pay', 'PAYCHECK', DX, 2.05, DZ + 0.05, q(m(0, 0.9) - 0.05, 0.25), BL, 0.075);
    W.rotulo('bef', 'before taxes', DX - 0.3, 1.98, DZ + 0.06, q(m(1, 1.5) - 0.05, 0.25) * (1 - q(m(2, 3.2) - 0.1, 0.3)), BL, 0.066);
    W.rotulo('pre', 'PRE-TAX', DX, 1.74, DZ + 0.08, q(m(2, 3.2) - 0.05, 0.25), TQ, 0.085);
    W.rotulo('more', 'more in ↑', DX + 0.38, 2.06, DZ + 0.06, q(m(3, 5.2) - 0.05, 0.25), TQ, 0.07);
    W.rotulo('owe', 'tax owed ↓', DX + 0.38, 1.69, DZ + 0.06, q(m(4, 6.3) - 0.05, 0.25), ROJO, 0.07);
    W.rotulo('free', 'TAX-FREE', DX, 1.31, DZ + 0.08, q(m(6, 9.6) - 0.05, 0.25), TQ, 0.085);
    // «INVESTED» con su aparte (2D, encima de la ramita de la miel).
    const iv = document.getElementById('inv');
    if (iv) { const P = W.pantalla(DX + 0.32, 1.5, DZ + 0.1), a = q(m(5, 8.5) - 0.05, 0.25); iv.style.left = P.x + 'px'; iv.style.top = P.y + 'px'; iv.style.opacity = a;
      iv.style.transform = 'translate(-50%, -50%) scale(' + (0.85 + 0.15 * a) + ')'; iv.querySelector('span').style.opacity = q(m(5, 8.5) + 0.3, 0.3); }
  } else if (k === 6) {
    // 6 · Todo va bien, tres golpes: gafas nuevas con la etiqueta colgando; «Taxes»: el formulario encogido en la papelera;
    // «Total»: en el sofá con la taza «I READ THE PAMPHLET (page 1)», inmóvil.
    const m0 = mk(0, 1.1), m1 = mk(1, 2.2); X.sala();
    if (t < m0) {
      heroe({ x: 2.6, z: -1.1, gira: -0.25 }); X.ponGafas(1, true); X.cab({ y: 0.12, x: -0.04 });
      cam([2.5, 1.84, 0.05, 2.58, 1.8, -1.1], [2.5, 1.84, -0.05, 2.58, 1.8, -1.1], tramo(t, e.ini, m0));
    } else if (t < m1) {
      X.formulario(V(X.PAP[0] + 0.01, 0.03, X.PAP[1] + 0.01), -Math.PI / 2, 0.5, 0, 0.42);
      W.camara(X.PAP[0], 0.74, X.PAP[1] + 0.14, X.PAP[0], 0.0, X.PAP[1]);
    } else {
      sentadoSofa(0); X.pose('taza'); const p = X.manoW(W.H, W.H.der); X.ponTaza(X.tazaH, V(p.x + 0.02, p.y + 0.07, p.z + 0.05), 1.45, 0);
      cam([X.SOX - 0.58, 1.12, -0.35, X.SOX - 0.58, 1.02, -2.3]);
    }
  } else if (k === 7) {
    // 7 · Pausa: la misma sala de noche, solo con la luz de la nevera abierta. Silencio, después zumbido y un único zoom lento
    // desde el sofá hasta el calendario, que pasa hojas solo hasta DECEMBER (31 rodeado en rojo); al fondo, el cartón con
    // «$404 left» y el reloj hacia las 11:59. Vuelve la voz sobre el final del zoom. «FSA users»: el reloj a las 12:00;
    // «lost money»: el contador baja de $404 a $0 y el cartón se desinfla; la miel, al lado, no cambia. El zumbido se corta en $0.
    const pz = e.pausa || { ini: 0, voz: 7.6, sonido: 0.6, fin: 10.5 }, T0 = e.ini, m0 = mk(0, 8.7), m1 = mk(1, 9.8);
    X.sala(); X.noche(1); X.nevera(1, 2.4);
    const cuenta = t < m1 ? D.perd : Math.round(D.perd * (1 - tramo(t, m1, m1 + 0.75)));
    X.leche({ x: LX, y: X.TOPE, z: -2.62, ry: 0.15, cuenta, desinfla: sale(tramo(t, m1 + 0.55, m1 + 1.15)) });
    X.miel({ x: MX, y: X.TOPE, z: -2.62, ry: -0.2, rama: 1.0 });
    if (t < m0) {
      const h = (a) => tramo(t, T0 + a, T0 + a + 0.55), f1 = h(1.4), f2 = h(2.6), f3 = h(3.8);
      const mes = f3 > 0 ? 11 : f2 > 0 ? 10 : f1 > 0 ? 9 : 8, hoja = f3 > 0 ? f3 : f2 > 0 ? f2 : f1;
      X.calendario(mes, hoja >= 1 ? 0 : hoja, mes === 11 ? tramo(t, T0 + 5.0, T0 + 5.7) : 0);
      X.dibReloj(t < T0 + 6.3 ? '11:58 PM' : '11:59 PM');
      sentadoSofa(-0.3); X.cab({ y: -0.45, x: -0.12 });
      // Acercamiento lineal (lento y continuo): el calendario, el reloj y el cartón «$404 left» siguen juntos en cuadro casi todo el hueco.
      cam([0.7, 1.45, 3.9, 0.3, 1.4, -2.7], [-0.23, 1.88, -1.15, -0.25, 1.86, -2.93], tramo(t, T0 + pz.sonido, T0 + pz.voz + 0.3) * 0.97 + 0.03 * tramo(t, T0, T0 + pz.sonido));
    } else if (t < m1) {
      // El reloj, centrado en vertical y 3 cm a la izquierda del centro (v1: y = 2,7 y centrado): «12:00 AM» queda entre
      // x ≈ 80 y 880 px e y ≈ 880–1.040 px, lejos de los botones de Instagram.
      X.calendario(11, 0, 1); X.dibReloj('12:00 AM');
      W.camara(X.CAL.x + 0.03, 2.62, -1.72, X.CAL.x + 0.03, 2.62, -2.92);
    } else {
      X.calendario(11, 0, 1); X.dibReloj('12:00 AM');
      W.camara(-0.4, 1.18, -1.6, -0.4, 1.1, -2.62);
    }
  } else if (k === 8) {
    // 8 · Respuesta: la tarjeta (2D) sobre la sala de día, desenfocada.
    X.sala(); W.camara(-0.4, 1.5, 3.6, -0.6, 1.3, -2.9);
  } else if (k === 9) {
    // 9 · Analogía: el tablón de corcho con el protagonista delante; en «vacation days», inserto de la hoja; en «don’t», las
    // seis fichas caen al suelo; en «HSA», el tarro de miel rueda por la encimera hasta la puerta «2027» y entra intacto, con
    // la ramita algo más larga («rolls over» en «does»). Final mudo: el plano del fotograma 0 sin la tarjeta; leve giro de
    // cabeza y corte seco a mitad del gesto.
    const m0 = mk(0, 0.7), m1 = mk(1, 1.9), m2 = mk(2, 3.1), vozFin = e.ini + e.seg[0].ini + e.seg[0].dur;
    const RS = e.seg[0].res, does = e.ini + (RS[1] ? RS[1].ini : 3.9);
    X.sala();
    if (t < m0) {
      X.caenFichas(null, t); heroe({ x: X.CORK.x - 0.66, z: -2.2, gira: 2.45 }); X.cab({ x: -0.1 });
      cam([3.3, 1.55, 0.35, 3.22, 1.45, -2.9], [3.3, 1.55, 0.2, 3.22, 1.45, -2.9], tramo(t, e.ini, m0));
    } else if (t < m2) {
      X.caenFichas(m1 - 0.02, t);
      cam([X.HOJA.x, X.HOJA.y - 0.1, -2.1, X.HOJA.x, X.HOJA.y - 0.1, -2.93], [X.HOJA.x, X.HOJA.y - 0.1, -2.18, X.HOJA.x, X.HOJA.y - 0.1, -2.93], tramo(t, m0, m2));
    } else if (t < vozFin) {
      const x0 = MX, x1 = X.BX1 + 0.085, u = tramo(t, m2 + 0.05, m2 + 1.05), xx = x0 + (x1 - x0) * sale(u), enUso = u > 0 && u < 1;
      const abre = sale(tramo(t, m2 + 0.45, m2 + 0.8)), entra = sale(tramo(t, m2 + 1.05, m2 + 1.4));
      X.despensa(abre);
      const jx = xx - 0.24 * entra;
      X.miel({ x: jx, y: X.TOPE, z: -2.64, ry: 0, rama: 1.0 + 0.35 * u, rueda: enUso ? Math.sin(t * 15) * 0.14 : 0 });
      W.rotulo('roll', 'rolls over', xx + 0.02, X.TOPE + 0.43, -2.55, q(does - 0.05, 0.22), TQ, 0.07);
      const lx = Math.max(-1.12, xx - 0.12);
      W.camara(lx + 0.42, 1.32, -1.45, lx, 1.07, -2.62);
    } else {
      const giro = sale(tramo(t, e.fin - 0.55, e.fin + 0.3));
      plano0({ y: 0.32 * giro, z: -0.06 * giro });
    }
  }
  W.multitud(t, { directo });
  if (tras) tras();
};

const pildoras = {
  'en-hsa-vs-fsa': pildora3d({
    slug: 'en-hsa-vs-fsa', cuenta: 'en',
    T: { en: { titulo: 'HSA vs FSA', guion: GUION } },
    voz: VOZ_SECA,                       // voz seca y pausada: el propietario la aceptó solo para este experimento
    sub: false, musica: false,           // sin subtítulos (rótulos en su palabra) y sin música bajo la voz
    sonidos: { escena: null },           // sin whoosh en los cortes: el único sonido es el zumbido de la pausa
    // ~8 s sin voz; el zumbido se corta en seco al llegar a $0 (marca «lost money» + 0,8 s). vol 0,3 y −3 dB mientras suena
    // la voz encima (J-cut), como en es-tin-vs-tae: con 0,5 tapaba la voz.
    // v2: 'zumbido-movil' (sfx.py) = el mismo zumbido con el fundamental ~2,9 dB más bajo y un armónico suave en 180–350 Hz
    // (+7 dB en 200–400 Hz), para que la pausa no suene casi muda en el altavoz del móvil.
    pausas: { 7: { dur: PAUSA_S, silencio: 0.6, sonido: 'zumbido-movil', fin: { marca: 1, mas: 0.8 }, vol: 0.3, baja: { db: -3, antes: 0.25 } } },
    cola: COLA_S, corte2d: 'seco',       // final mudo que empalma con el fotograma 0
    cssExtra: CSS, scriptExtra: SCRIPT,
    escenas: ESCENAS, tres: TRES,
    datos: () => ({ perd: PERD }),     // la cifra del cartón ($404 → $0), sacada de las cuentas
    texto: { en: TEXTO }
  })
};

module.exports = { pildoras };
