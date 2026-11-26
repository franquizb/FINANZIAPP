// Píldora (≈40 s) · @finanziapp.es (España), en 3D (reels-voz/tres.js), «Tus derechos».
// es-devolucion-tienda-internet (el slug es-devolucion-14-dias ya era de un Reel publicado en lote1-es.js) · «Lo compras en una tienda y no te gusta: no te lo tienen que devolver. Por internet: 14 días.»
// Guion final y verificado: guiones/2026-11-es-devolucion-14-dias.md (fuentes, gancho, escenas, cuentas, texto y portada).
// Publicación prevista: viernes 27/11/2026 (Black Friday), hacia las 12:30 de Madrid.
//
// Fuentes de cada dato (todas consultadas el 26-nov-2026):
// - Real Decreto Legislativo 1/2007 (TRLGDCU), texto consolidado del BOE (última actualización publicada el 25/11/2026):
//   https://www.boe.es/buscar/act.php?id=BOE-A-2007-20555
//   · art. 92.1: contratos a distancia («Internet, el teléfono…»), sin presencia física simultánea.
//   · art. 102.1: «catorce días naturales sin indicar el motivo». · art. 103: excepciones (personalizados, perecederos…).
//   · art. 104.b): desde que el consumidor «adquiera la posesión material de los bienes».
//   · art. 105.1: si no informan, el plazo «finalizará doce meses después de la fecha de expiración del periodo de desistimiento inicial».
//   · art. 106: comunicar la decisión antes de que venza el plazo (formulario o «declaración inequívoca»).
//   · art. 107.1: reembolso de «todo pago recibido […], incluidos, en su caso, los costes de entrega», antes de 14 días naturales
//     desde que se le informa; 107.2: solo la entrega ordinaria menos costosa; 107.3: puede retener el reembolso hasta recibir
//     los bienes o la prueba de la devolución.
//   · art. 108.1: el consumidor devuelve el bien en 14 días desde su aviso y solo paga el envío de vuelta si se le informó.
// - Código Civil, art. 5: el día de partida no cuenta; los meses, de fecha a fecha. https://www.boe.es/buscar/act.php?id=BOE-A-1889-4763#a5
// - Tienda física sin obligación de admitir devoluciones: Centro Europeo del Consumidor en España (Ministerio de Derechos Sociales,
//   Consumo y Agenda 2030), folleto «Derecho de desistimiento», julio de 2026, p. 12.
//   https://portal-cec.consumo.gob.es/sites/default/files/documentos/FOLLETO_DERECHO_DESISTIMIENTO_JULIO_2026.pdf
//   Y Comunidad de Madrid, consumo: https://www.comunidad.madrid/consumo/derecho-desistimiento
// Las fechas del vídeo son un EJEMPLO (rótulo «EJEMPLO»): pagas el vie 27/11/2026, lo recibes el lun 30/11, último día el
// lun 14/12/2026; sin información, el 14/12/2027.
const { pildora3d } = require('./tres');
const { VOZ_NARRADOR } = require('./_comun');
// Misma voz de narrador (Charon, peninsular) con tempo 1,08 en vez de 1,2: a 1,2 estas frases salían a 3,84 palabras/s (objetivo 3,2–3,6).
const VOZ = { ...VOZ_NARRADOR, es: { ...VOZ_NARRADOR.es, tempo: 1.08 } };
const { cuadra } = require('../reels/_comun');

// ——— cuentas (las del guion) ———
const DIA_MS = 86400000, f = (s) => Date.UTC(...s.split('-').map((n, i) => i === 1 ? n - 1 : +n));
const iso = (ms) => new Date(ms).toISOString().slice(0, 10), wd = (s) => new Date(f(s)).getUTCDay();
const jueves = [...Array(30)].map((_, i) => f('2026-11-' + (i + 1))).filter(ms => new Date(ms).getUTCDay() === 4);
cuadra('Black Friday 2026 = viernes 27-nov', iso(jueves[3] + DIA_MS), '2026-11-27');
cuadra('27-nov-2026 es viernes', wd('2026-11-27'), 5);
cuadra('28-nov sábado y 29-nov domingo (días naturales: cuentan)', [wd('2026-11-28'), wd('2026-11-29')].join(), '6,0');
cuadra('30-nov-2026 es lunes (lo recibes)', wd('2026-11-30'), 1);
cuadra('día 1 del plazo = el siguiente a recibirlo (CC 5.1)', iso(f('2026-11-30') + DIA_MS), '2026-12-01');
cuadra('día 14 = 14-dic-2026', iso(f('2026-11-30') + 14 * DIA_MS), '2026-12-14');
cuadra('14-dic-2026 es lunes', wd('2026-12-14'), 1);
cuadra('hojas del 30-nov al 14-dic', (f('2026-12-14') - f('2026-11-30')) / DIA_MS, 14);
cuadra('sin información: 12 meses después del 14-dic-2026, de fecha a fecha', iso(Date.UTC(2027, 11, 14)), '2027-12-14');
cuadra('14-dic-2027 es martes', wd('2027-12-14'), 2);
cuadra('plazo total sin información en el ejemplo (días)', (f('2027-12-14') - f('2026-11-30')) / DIA_MS, 379);
// Hojas del calendario: d = 0…17 → 27-nov…14-dic-2026; d = 100 + m → 14 del mes m después de dic-2026 (m = 1…12).
const MESES = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'], SEM = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
const hojaDia = (d) => {
  if (d >= 100) { const m = d - 100, ms = Date.UTC(2026, 11 + m, 14), x = new Date(ms); return { cab: MESES[x.getUTCMonth()] + ' ' + x.getUTCFullYear(), num: 14, eti: '+' + m + (m === 1 ? ' MES' : ' MESES'), tipo: m === 12 ? 'amb' : 'gris' }; }
  const x = new Date(f('2026-11-27') + d * DIA_MS);
  const eti = d === 0 ? 'PAGAS' : d === 3 ? 'LO RECIBES' : d >= 4 ? 'DÍA ' + (d - 3) : '';
  return { cab: SEM[x.getUTCDay()] + ' · ' + MESES[x.getUTCMonth()], num: x.getUTCDate(), eti: d === 17 ? 'ÚLTIMO DÍA' : eti, tipo: d === 3 ? 'turq' : d === 17 ? 'amb' : d === 0 ? 'roja' : 'gris', finde: x.getUTCDay() === 0 || x.getUTCDay() === 6 };
};
const HOJAS = {}; [...Array(18).keys(), ...Array.from({ length: 12 }, (_, i) => 101 + i)].forEach(d => { HOJAS[d] = hojaDia(d); });
cuadra('pantalla: hoja 0 = VIE 27 NOV · PAGAS', HOJAS[0].cab + ' ' + HOJAS[0].num + ' ' + HOJAS[0].eti, 'VIE · NOV 27 PAGAS');
cuadra('pantalla: hoja 3 = LUN 30 NOV · LO RECIBES', HOJAS[3].cab + ' ' + HOJAS[3].num + ' ' + HOJAS[3].eti, 'LUN · NOV 30 LO RECIBES');
cuadra('pantalla: hoja 4 = DÍA 1 (1 DIC)', HOJAS[4].num + ' ' + HOJAS[4].eti, '1 DÍA 1');
cuadra('pantalla: hoja 17 = LUN 14 DIC · ÚLTIMO DÍA (día 14)', HOJAS[17].cab + ' ' + HOJAS[17].num + ' ' + HOJAS[17].eti + ' ' + (17 - 3), 'LUN · DIC 14 ÚLTIMO DÍA 14');
cuadra('pantalla: hojas 28 y 29 NOV en fin de semana', HOJAS[1].finde && HOJAS[2].finde && HOJAS[1].cab + '/' + HOJAS[2].cab, 'SÁB · NOV/DOM · NOV');
cuadra('pantalla: hoja 112 = DIC 2027 · 14 · +12 MESES', HOJAS[112].cab + ' ' + HOJAS[112].num + ' ' + HOJAS[112].eti, 'DIC 2027 14 +12 MESES');
cuadra('pantalla: hoja 101 = ENE 2027', HOJAS[101].cab, 'ENE 2027');

const TEXTO = `Lo compras en una tienda y no te gusta: no te lo tienen que devolver. Lo mismo por internet: tienes 14 días. 📦

• En España, si compras a una empresa por internet o por teléfono, puedes desistir en 14 días naturales sin dar explicaciones. Cuentan desde el día siguiente a recibirlo (si el pedido llega en varios paquetes, desde el último).
• Avisa por escrito antes de que acabe el plazo: sirve el formulario de desistimiento o un mensaje claro. Después tienes otros 14 días para enviar el producto.
• Te devuelven lo que pagaste, también el envío estándar de ida, en 14 días como mucho desde tu aviso y por el mismo medio de pago. Pueden esperar a recibir el producto o una prueba de que lo has enviado.
• El envío de vuelta lo pagas tú solo si te lo avisaron.
• Si la tienda no te informó de este derecho, el plazo se alarga 12 meses más.
• Hay excepciones: productos personalizados, que caducan rápido, de higiene o programas desprecintados, entre otros.
• En una tienda física la devolución por cambio de opinión no es obligatoria: solo si la tienda la ofrece, y entonces tiene que informar de sus condiciones. Si el producto falla, eso es otra cosa: la garantía.

Para hoy: guarda el correo de confirmación de lo que compres en el Black Friday y apunta el día que te llega.

Guárdalo 🔖 y mándaselo a quien hoy está llenando el carrito.

Contenido educativo, no es asesoramiento financiero.

Fuentes: Real Decreto Legislativo 1/2007 (Ley General para la Defensa de los Consumidores y Usuarios), arts. 92 y 102 a 108, BOE, texto consolidado; Código Civil, art. 5; Centro Europeo del Consumidor en España (Ministerio de Derechos Sociales, Consumo y Agenda 2030), folleto «Derecho de desistimiento», julio de 2026. Fechas del vídeo: ejemplo. Consultado el 26/11/2026.

#blackfriday #consumo #derechosdelconsumidor #finanzaspersonales #compras`;
cuadra('texto de la publicación ≤ 1.900 caracteres', TEXTO.length <= 1900, true);

const GUION = [
  [0, 'Lo compras en una tienda y no te gusta: §no te lo tienen que devolver. §{pop}Lo compras por internet: *tienes 14 días*.'],
  [1, 'En España, §comprar por internet o por teléfono te da el *derecho de desistimiento*: §{ding}lo devuelves *sin dar explicaciones*.'],
  [2, 'Los 14 días son naturales §y empiezan *cuando lo recibes*, §no cuando pagas. §Avisa por escrito *antes de que acaben*.'],
  [3, '¿Y el dinero? §Tienen 14 días para devolvértelo, §{caja}*envío estándar incluido*, §aunque pueden esperar a que se lo devuelvas.'],
  [4, 'Y si la tienda no te informó de este derecho, §el plazo no acaba a los 14 días: §{tic}*se alarga 12 meses más*.'],
  [5, 'Hoy guarda el *correo de confirmación* §y apunta *la fecha de entrega*. §En la tienda, decide la tienda. §{pop}Por internet, *decides tú*.']
];

const MONO = `'DejaVu Sans Mono', 'Liberation Mono', monospace`;
const CSS = `
  .hud.i.fmt { letter-spacing: .14em; }
  .rt { position: absolute; left: 50%; top: 1300px; padding: 10px 30px 15px; border-radius: 20px; background: rgba(9,14,27,.9); border: 3px solid #e2e8f0;
    color: #fff; font-size: 62px; line-height: 1.1; font-weight: 900; letter-spacing: -.015em; white-space: nowrap; opacity: 0; font-variant-numeric: tabular-nums;
    text-align: center; box-shadow: 0 10px 40px rgba(0,0,0,.45); }
  .rt.g { font-size: 112px; line-height: 1.02; padding: 12px 40px 20px; } .rt.p { font-size: 52px; }
  .rt small { display: block; font: 800 28px/1.3 ${MONO}; letter-spacing: .16em; color: #cbd5e1; margin-bottom: 2px; }
  .rt.amb { border-color: #f5b94a; } .rt.roja { border-color: #f87171; } .rt.turq { border-color: #5eead4; }
  .rt .a { color: #f5b94a; } .rt .r { color: #f87171; } .rt .t { color: #5eead4; }
  .nota { position: absolute; left: 70px; top: 1470px; max-width: 820px; font: 600 24px/1.32 ${MONO}; color: #b6c2d4; background: rgba(7,11,22,.8);
    border-radius: 10px; padding: 6px 14px; opacity: 0; }
`;

// Mundo 3D propio: mostrador con placa «NO OBLIGADOS», bolsa de tienda, caja de cartón con el sello «14 DÍAS», taco de calendario,
// monedas del reembolso, carta de aviso, móvil con el correo y halos. Todo se apaga al principio de cada fotograma (X3.apagar()).
const SCRIPT = `
function ver(n, s, a, b) { if (!n) return; let p = a < -0.5 ? 1 : rebote(tramo(s, a - 0.1, a + 0.25)); if (b != null) p *= 1 - tramo(s, b - 0.12, b); aparece3(n, p); }
const PI = Math.PI, AMBH = 0xf5b94a, ROJOH = 0xef4444, TURQH = 0x2dd4bf;
const mezcla = (P, Q, u) => P.map((v, j) => v + (Q[j] - v) * u);
const suave = (x) => x * x * (3 - 2 * x);
const angulo = (a, b, g) => a + ((((b - a + PI) % (2 * PI)) + 2 * PI) % (2 * PI) - PI) * g;
// Cámara por fotogramas clave (Hermite, de desmentido-en.js / extenso-black-friday-es.js).
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
function rutas(KK, x) { let K = KK[0]; for (const k of KK) if (x >= k[0][0]) K = k; return ruta(K, x); }
function camR(W, C, roll) { const r = roll || 0; W.cam.up.set(Math.sin(r), Math.cos(r), 0); W.camara(C[0], C[1], C[2], C[3], C[4], C[5]); }
function brazos(a, qa, qp) {
  const ax = -2.75 * (1 - qp) - 0.95 * qp, az = -0.1 * (1 - qp) - 0.2 * qp, cx = -0.15 * (1 - qp) - 1.15 * qp;
  [[a.izq, -1], [a.der, 1]].forEach(([b, sg]) => {
    b.hombro.rotation.x = lerp(b.hombro.rotation.x, ax, qa); b.hombro.rotation.z = lerp(b.hombro.rotation.z, sg * az, qa); b.codo.rotation.x = lerp(b.codo.rotation.x, cx, qa);
  });
}
function manos(hx, hz, g, qp, esc, y) { const ly = (2.2 * (1 - qp) + 1.5 * qp) * (esc || 1.06) / 1.06, lz = (0.3 * (1 - qp) + 0.62 * qp) * (esc || 1.06) / 1.06; return [hx + Math.sin(g) * lz, ly + (y || 0), hz + Math.cos(g) * lz]; }
// Paso de hojas por una lista: la hoja de encima sube y deja ver la siguiente.
function pasa(s, seq, t0, per) {
  const n = seq.length - 1; if (s < t0) return { abajo: seq[0], hoja: null, a: 0, j: 0 };
  const k = (s - t0) / per, j = Math.floor(k);
  if (j >= n) return { abajo: seq[n], hoja: null, a: 0, j: n };
  return { abajo: seq[j + 1], hoja: seq[j], a: k - j, j };
}
const rango = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

const X3 = (() => {
  const W = W3, T = W.T, S = W.S, objs = [];
  const grupo = () => { const g = new T.Group(); g.visible = false; S.add(g); objs.push(g); return g; };
  const mat = (c, o) => new T.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.55, metalness: 0.08 }, o || {}));
  const pieza = (g, geo, m, x, y, z) => { const o = new T.Mesh(geo, m); o.position.set(x, y, z); o.castShadow = true; o.receiveShadow = true; g.add(o); return o; };
  const lienzo = (w, h, pintar) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); if (pintar) pintar(x, w, h);
    const tx = new T.CanvasTexture(c); tx.encoding = T.sRGBEncoding; tx.anisotropy = 4; return { c, x, tx, clave: null }; };
  const haloTx = lienzo(256, 256, (x) => { const g = x.createRadialGradient(128, 128, 0, 128, 128, 128); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.3, 'rgba(255,255,255,.4)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 256, 256); }).tx;
  const basico = (tx, o) => new T.MeshBasicMaterial(Object.assign({ map: tx, toneMapped: false, transparent: true }, o || {}));
  const caraTx = (tx) => new T.MeshBasicMaterial({ map: tx, toneMapped: false });

  // ——— mostrador (1,9 × 1,05 × 0,7 m; origen en el suelo, centro) con la placa roja «NO OBLIGADOS» ———
  const MW = 1.9, MH = 1.05, MD = 0.7;
  const mosG = grupo();
  const mCuerpo = mat(0x334155, { roughness: 0.6 }), frenteTx = lienzo(760, 420, (x, w, h) => { x.fillStyle = '#3b4a61'; x.fillRect(0, 0, w, h);
    x.fillStyle = '#2b384c'; for (let k = 0; k < 6; k++) x.fillRect(0, 40 + k * 66, w, 8); x.strokeStyle = '#64748b'; x.lineWidth = 10; x.strokeRect(5, 5, w - 10, h - 10); }).tx;
  pieza(mosG, new T.BoxGeometry(MW, MH, MD), [mCuerpo, mCuerpo, mCuerpo, mCuerpo, caraTx(frenteTx), mCuerpo], 0, MH / 2, 0);
  pieza(mosG, new T.BoxGeometry(MW + 0.14, 0.07, MD + 0.12), mat(0xe2e8f0, { roughness: 0.35 }), 0, MH + 0.035, 0);
  // Caja registradora genérica (sin marca) encima.
  pieza(mosG, new T.BoxGeometry(0.46, 0.26, 0.36), mat(0x1f2937, { roughness: 0.4 }), -0.5, MH + 0.2, -0.05);
  const pantR = pieza(mosG, new T.BoxGeometry(0.34, 0.2, 0.03), mat(0x0f172a, { emissive: 0x7f1d1d, emissiveIntensity: 0.6 }), -0.5, MH + 0.45, -0.14); pantR.rotation.x = -0.3;
  const placaTx = lienzo(800, 216, (x, w, h) => { x.fillStyle = '#dc2626'; x.beginPath(); x.roundRect(4, 4, w - 8, h - 8, 26); x.fill();
    x.strokeStyle = 'rgba(255,255,255,.9)'; x.lineWidth = 9; x.beginPath(); x.roundRect(20, 20, w - 40, h - 40, 18); x.stroke();
    x.fillStyle = '#ffffff'; x.font = '900 104px Inter, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('NO OBLIGADOS', w / 2, h / 2 + 6); }).tx;
  const placaG = new T.Group(); mosG.add(placaG);
  const mPl = mat(0x991b1b);
  const placa = new T.Mesh(new T.BoxGeometry(1.6, 0.43, 0.05), [mPl, mPl, mPl, mPl, caraTx(placaTx), mPl]); placa.castShadow = true; placaG.add(placa);
  // o = { x, z, ry, dx (temblor), placa: { y, rz, op } | null }
  function mostrador(o) {
    mosG.visible = true; mosG.position.set(o.x + (o.dx || 0), 0, o.z); mosG.rotation.set(0, o.ry || 0, 0);
    const p = o.placa; placaG.visible = !!p;
    if (p) { placaG.position.set(0, p.y == null ? 0.56 : p.y, MD / 2 + 0.035 + (p.dz || 0)); placaG.rotation.set(p.rx || 0, 0, p.rz || 0); placaG.scale.setScalar(p.esc || 1); }
  }

  // ——— bolsa de tienda (0,5 × 0,6 × 0,22 m; origen en el centro) con asas y franja roja ———
  const bolG = grupo();
  const bolTx = lienzo(400, 480, (x, w, h) => { x.fillStyle = '#f1f5f9'; x.fillRect(0, 0, w, h); x.fillStyle = '#ef4444'; x.fillRect(0, h * 0.58, w, h * 0.16);
    x.fillStyle = '#cbd5e1'; x.fillRect(0, 0, w, 14); x.strokeStyle = '#e2e8f0'; x.lineWidth = 6; x.strokeRect(3, 3, w - 6, h - 6); }).tx;
  const mBol = mat(0xe2e8f0, { roughness: 0.8 });
  pieza(bolG, new T.BoxGeometry(0.5, 0.6, 0.22), [mBol, mBol, mBol, mBol, caraTx(bolTx), caraTx(bolTx)], 0, 0, 0);
  [-0.06, 0.06].forEach(z => { const a = pieza(bolG, new T.TorusGeometry(0.11, 0.014, 6, 16, PI), mat(0xef4444), 0, 0.3, z); });
  function bolsa(o) { bolG.visible = true; bolG.position.set(o.x, o.y, o.z); bolG.rotation.set(o.rx || 0, o.ry || 0, o.rz || 0); bolG.scale.setScalar(o.esc || 1); }

  // ——— caja de cartón (0,7 × 0,5 × 0,5 m; origen en el centro) con etiqueta de envío y el sello «14 DÍAS» ———
  const CW = 0.7, CH = 0.5, CD = 0.5;
  const cajG = grupo();
  const mCart = mat(0xb98a55, { roughness: 0.85 });
  const cajTx = lienzo(560, 400, (x, w, h) => { x.fillStyle = '#c4935c'; x.fillRect(0, 0, w, h); x.fillStyle = '#d9b383'; x.fillRect(w / 2 - 40, 0, 80, h);
    x.fillStyle = '#f8fafc'; x.fillRect(40, 236, 200, 130); x.fillStyle = '#0f172a'; for (let k = 0; k < 16; k++) x.fillRect(56 + k * 11, 300, k % 3 ? 5 : 8, 52);
    x.font = '800 30px DejaVu Sans Mono, monospace'; x.fillText('PEDIDO', 60, 280); }).tx;
  const topTx = lienzo(560, 400, (x, w, h) => { x.fillStyle = '#c4935c'; x.fillRect(0, 0, w, h); x.fillStyle = '#d9b383'; x.fillRect(0, h / 2 - 34, w, 68); }).tx;
  pieza(cajG, new T.BoxGeometry(CW, CH, CD), [mCart, mCart, caraTx(topTx), mCart, caraTx(cajTx), caraTx(cajTx)], 0, 0, 0);
  // Sello «14 DÍAS» (turquesa) como hijo de la caja: o.sello = { x, y, z, rz, sz } en coordenadas de la caja, o null.
  const selloTx = lienzo(256, 256, (x) => { x.fillStyle = '#2dd4bf'; x.beginPath(); x.arc(128, 128, 126, 0, 2 * PI); x.fill(); x.strokeStyle = '#04201c'; x.lineWidth = 7; x.beginPath(); x.arc(128, 128, 112, 0, 2 * PI); x.stroke();
    x.fillStyle = '#04201c'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = '900 110px Inter, sans-serif'; x.fillText('14', 128, 112); x.font = '900 40px Inter, sans-serif'; x.fillText('DÍAS', 128, 186); }).tx;
  const selG = new T.Group(); cajG.add(selG);
  const selC = pieza(selG, new T.CylinderGeometry(0.22, 0.22, 0.05, 40), mat(0x14b8a6, { metalness: 0.3, roughness: 0.35, emissive: 0x0f766e, emissiveIntensity: 0.6 }), 0, 0, 0); selC.rotation.x = PI / 2;
  const selF = new T.Mesh(new T.CircleGeometry(0.215, 40), basico(selloTx, { transparent: false })); selF.position.z = 0.026; selG.add(selF);
  function caja(o) {
    cajG.visible = true; cajG.position.set(o.x, o.y, o.z); cajG.rotation.set(o.rx || 0, o.ry || 0, o.rz || 0); cajG.scale.setScalar(Math.max(0.001, o.esc || 1));
    const s = o.sello; selG.visible = !!s; if (s) { selG.position.set(s.x || 0, s.y || 0, s.z == null ? CD / 2 + 0.026 : s.z); selG.rotation.set(0, 0, s.rz || 0); selG.scale.set(1, 1, Math.max(0.05, s.sz || 1)); selG.scale.multiplyScalar(s.esc || 1); }
  }
  const SELLO_EN = { x: 0.12, y: 0.0 };

  // ——— taco de calendario (de extenso-black-friday-es.js) con las hojas de este vídeo (D.HOJAS) y una cruz roja ———
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
  const mCruz = new T.MeshBasicMaterial({ color: 0xef4444, toneMapped: false });
  const cruz = [0.32, -0.32].map(a => { const m = new T.Mesh(new T.BoxGeometry(0.78, 0.06, 0.01), mCruz); m.position.set(0, -0.985, 0.02); m.rotation.z = a; calG.add(m); return m; });
  const TXH = {};
  const COL = { turq: ['#2dd4bf', '#04201c'], amb: ['#f5b94a', '#1a1205'], roja: ['#ef4444', '#ffffff'] };
  function texHoja(m, d) {
    let tx = TXH[d];
    if (!tx) tx = TXH[d] = lienzo(512, 590, (x, w, h) => {
      const H = D.HOJAS[d]; x.fillStyle = '#f8fafc'; x.fillRect(0, 0, w, h);
      x.fillStyle = H.finde ? '#991b1b' : d >= 100 ? '#0f766e' : '#dc2626'; x.fillRect(0, 0, w, 118);
      x.fillStyle = '#ffffff'; x.font = '800 60px DejaVu Sans Mono, monospace'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(H.cab, w / 2, 62);
      x.fillStyle = '#0f172a'; x.font = '900 268px Inter, sans-serif'; x.fillText(String(H.num), w / 2, 300);
      if (H.eti) { const c = COL[H.tipo]; if (c) { x.fillStyle = c[0]; x.beginPath(); x.roundRect(36, 446, 440, 116, 26); x.fill(); }
        x.fillStyle = c ? c[1] : '#64748b'; x.font = '900 ' + (H.eti.length > 8 ? 70 : 88) + 'px Inter, sans-serif'; x.fillText(H.eti, w / 2, 506); }
    }).tx;
    if (m.material.map !== tx) { m.material.map = tx; m.material.needsUpdate = true; }
  }
  // o = { x, y, z, ry, esc, abajo, hoja, a (1 = arriba, 0 = posada), halo, haloColor, cruz (0..1) }
  function calendario(o) {
    calG.visible = true; calG.position.set(o.x, o.y, o.z); calG.rotation.set(0, o.ry || 0, 0); calG.scale.setScalar(o.esc || 1);
    texHoja(hojaFija, o.abajo);
    const v = o.hoja != null; hojaVuela.visible = dorso.visible = v;
    if (v) { texHoja(hojaVuela, o.hoja); piv.rotation.x = -PI * o.a; }
    calHalo.material.opacity = o.halo || 0; calHalo.material.color.set(o.haloColor || 0xffc35a);
    const q = o.cruz || 0; cruz.forEach(m => { m.visible = q > 0.01; m.scale.x = Math.max(0.001, q); });
  }

  // ——— monedas del reembolso (hasta 8; la 7 es la ámbar del envío) ———
  const monTx = (bg, fg, t) => lienzo(256, 256, (x) => { x.fillStyle = bg; x.beginPath(); x.arc(128, 128, 126, 0, 2 * PI); x.fill(); x.strokeStyle = fg; x.lineWidth = 8; x.beginPath(); x.arc(128, 128, 108, 0, 2 * PI); x.stroke();
    x.fillStyle = fg; x.font = '900 ' + (t.length > 2 ? 64 : 130) + 'px Inter, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(t, 128, 136); }).tx;
  const mMonT = mat(0x14b8a6, { metalness: 0.45, roughness: 0.3, emissive: 0x0f766e, emissiveIntensity: 0.5 }), mMonA = mat(0xd99a2b, { metalness: 0.45, roughness: 0.3, emissive: 0x5a3a08, emissiveIntensity: 0.6 });
  const caraT = basico(monTx('#2dd4bf', '#04201c', '€'), { transparent: false }), caraA = basico(monTx('#f5b94a', '#1a1205', 'ENVÍO'), { transparent: false });
  const monedas = Array.from({ length: 8 }, (_, i) => { const g = new T.Group(); g.visible = false; S.add(g);
    const c = new T.Mesh(new T.CylinderGeometry(0.2, 0.2, 0.07, 36), i === 7 ? mMonA : mMonT); c.castShadow = true; g.add(c);
    [1, -1].forEach(sg => { const fz = new T.Mesh(new T.CircleGeometry(0.195, 36), i === 7 ? caraA : caraT); fz.rotation.x = -sg * PI / 2; fz.position.y = sg * 0.0355; g.add(fz); });
    return g; });
  function moneda(i, o) { const g = monedas[i]; g.visible = true; g.position.set(o.x, o.y, o.z); g.rotation.set(o.rx || 0, o.ry || 0, o.rz || 0); g.scale.setScalar(Math.max(0.001, o.esc || 1)); }

  // ——— carta de aviso (desistimiento) ———
  const carTx = lienzo(400, 260, (x, w, h) => { x.fillStyle = '#ffffff'; x.fillRect(0, 0, w, h); x.strokeStyle = '#2dd4bf'; x.lineWidth = 14; x.strokeRect(7, 7, w - 14, h - 14);
    x.strokeStyle = '#94a3b8'; x.lineWidth = 5; x.beginPath(); x.moveTo(14, 14); x.lineTo(w / 2, h * 0.55); x.lineTo(w - 14, 14); x.stroke();
    x.fillStyle = '#0f766e'; x.font = '900 46px Inter, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('AVISO', w / 2, h * 0.78); }).tx;
  const carM = new T.Mesh(new T.PlaneGeometry(0.62, 0.4), basico(carTx, { side: T.DoubleSide, transparent: false })); carM.castShadow = true; carM.visible = false; S.add(carM);
  function carta(o) { carM.visible = true; carM.position.set(o.x, o.y, o.z); carM.rotation.set(o.rx || 0, o.ry || 0, o.rz || 0); carM.scale.setScalar(Math.max(0.001, o.esc || 1)); }

  // ——— móvil genérico con el correo de confirmación ———
  const movG = grupo();
  pieza(movG, new T.BoxGeometry(0.36, 0.7, 0.035), mat(0x0f172a, { roughness: 0.35, metalness: 0.3 }), 0, 0, 0);
  const pan = lienzo(360, 700); const panM = new T.Mesh(new T.PlaneGeometry(0.33, 0.64), new T.MeshBasicMaterial({ map: pan.tx, toneMapped: false })); panM.position.z = 0.0185; movG.add(panM);
  function pintaPantalla(q) {
    const cl = Math.round(q * 20); if (cl === pan.clave) return; pan.clave = cl;
    const x = pan.x, w = 360, h = 700;
    x.fillStyle = '#0b1222'; x.fillRect(0, 0, w, h); x.fillStyle = '#1e293b'; x.fillRect(0, 0, w, 54); x.fillStyle = '#475569'; x.beginPath(); x.roundRect(30, 16, 300, 22, 11); x.fill();
    x.fillStyle = '#2dd4bf'; x.beginPath(); x.arc(180, 150, 54, 0, 2 * PI); x.fill(); x.strokeStyle = '#04201c'; x.lineWidth = 14; x.beginPath(); x.moveTo(152, 150); x.lineTo(174, 172); x.lineTo(210, 128); x.stroke();
    x.fillStyle = '#f1f5f9'; x.font = '900 36px Inter, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('PEDIDO', 180, 248); x.fillText('CONFIRMADO', 180, 292);
    x.fillStyle = '#334155'; for (let k = 0; k < 3; k++) x.fillRect(46, 344 + k * 30, 268 - k * 40, 12);
    const a = q; x.fillStyle = 'rgba(245,185,74,' + (0.15 + 0.85 * a) + ')'; x.beginPath(); x.roundRect(28, 470, 304, 150, 20); x.fill();
    x.fillStyle = a > 0.5 ? '#1a1205' : '#cbd5e1'; x.font = '800 32px Inter, sans-serif'; x.fillText('ENTREGA', 180, 512); x.font = '900 64px Inter, sans-serif'; x.fillText('30 NOV', 180, 576);
    pan.tx.needsUpdate = true;
  }
  function movil(o) { movG.visible = true; movG.position.set(o.x, o.y, o.z); movG.rotation.set(o.rx || 0, o.ry || 0, o.rz || 0); movG.scale.setScalar(Math.max(0.001, o.esc || 1)); pintaPantalla(o.ent || 0); }

  // ——— halos (destellos) ———
  const halos = Array.from({ length: 6 }, () => { const s = new T.Sprite(new T.SpriteMaterial({ map: haloTx, color: 0xffd166, blending: T.AdditiveBlending, depthWrite: false, transparent: true })); s.visible = false; S.add(s); return s; });
  function halo(i, o) { const s = halos[i]; s.visible = (o.op || 0) > 0.01; s.position.set(o.x, o.y, o.z); s.scale.setScalar(o.esc || 1); s.material.opacity = Math.min(1, o.op || 0); s.material.color.set(o.color || 0xffd166); }

  function apagar() { objs.forEach(g => { g.visible = false; }); [monedas, halos].forEach(a => a.forEach(m => { m.visible = false; })); carM.visible = false; }
  return { mostrador, bolsa, caja, calendario, moneda, carta, movil, halo, apagar, MW, MH, MD, CW, CH, CD, SELLO_EN };
})();
W3.X = X3;

// ——— el gancho (escena 0) y la cola del bucle. tau = tiempo de la escena 0 (negativo en la cola) ———
// Mostrador en (MX, MZ); puerta en (PX, PZ). La bolsa choca a TB, la placa cae a TP, la caja vuela de TC0 a TC1 y el sello la golpea a TS.
const G0 = { MX: -2.3, MZ: -0.6, PX: 2.3, PZ: -1.4, TB: 0.4, TP: 0.62, TC0: 1.15, TS: 1.8, TC1: 2.55 };
const BOLSA_A = [G0.MX + 2.9, 2.35, G0.MZ + 3.3], BOLSA_H = [G0.MX + 0.25, 0.92, G0.MZ + 0.62];
// Bolsa: vuela (tau < TB), rebota y cae al suelo (aterriza a TB + tl) y se queda tumbada.
function bolsaVuelo(tau, t0) {
  t0 = t0 == null ? G0.TB : t0; const ti = tau - t0;
  if (ti < 0) { const u = tramo(tau, t0 - 1.2, t0), p = mezcla(BOLSA_A, BOLSA_H, u); p[1] += 0.55 * Math.sin(u * PI);
    return { x: p[0], y: p[1], z: p[2], rx: -0.9 * (1 - u) + 0.15, ry: 0.6 + 2.2 * (1 - u), rz: -0.5 * (1 - u) }; }
  const vx = 1.7, vy = 1.7, vz = 0.75, g = 9.8, y0 = BOLSA_H[1], yS = 0.12;
  const tl = (vy + Math.sqrt(vy * vy + 2 * g * (y0 - yS))) / g;
  if (ti < tl) return { x: BOLSA_H[0] + vx * ti, y: y0 + vy * ti - 0.5 * g * ti * ti, z: BOLSA_H[2] + vz * ti, rx: 0.15 - 5 * ti, ry: 0.6 + 2 * ti, rz: 3 * ti };
  const r = Math.min(1, (ti - tl) * 3), sl = 0.18 * sale(r);
  return { x: BOLSA_H[0] + vx * tl + sl, y: yS, z: BOLSA_H[2] + vz * tl + sl * 0.6, rx: -PI / 2, ry: 0.6 + 2 * tl, rz: 0.3 };
}
function placaVuelo(tau, t0) {
  t0 = t0 == null ? G0.TP : t0; const t1 = t0 - 0.2;
  if (tau < t1) return null;
  if (tau < t0) { const u = tramo(tau, t1, t0); return { y: 0.56 + 1.9 * (1 - u * u), rz: 0.4 * (1 - u), dz: 0.25 * (1 - u) }; }
  const d = tau - t0; return { y: 0.56 - 0.03 * Math.exp(-d * 9) * Math.sin(d * 30), rz: 0.12 * Math.exp(-d * 5) * Math.sin(d * 22), rx: -0.25 * Math.exp(-d * 8) * Math.sin(d * 26) };
}
const CAJA_A = [G0.PX - 3.0, 1.5, G0.PZ + 3.9], CAJA_B = [G0.PX - 0.15, 0.25, G0.PZ + 0.85];
function cajaVuelo(tau, t0, t1) {
  t0 = t0 == null ? G0.TC0 : t0; t1 = t1 == null ? G0.TC1 : t1;
  const u = tramo(tau, t0, t1), e_ = u < 1 ? u * (2 - u) * 0.15 + u * 0.85 : 1, p = mezcla(CAJA_A, CAJA_B, e_); p[1] += 0.9 * Math.sin(e_ * PI);
  const tt = tau - t1, rebota = tt > 0 ? 0.12 * Math.exp(-tt * 6) * Math.abs(Math.sin(tt * 14)) : 0;
  return { x: p[0], y: p[1] + rebota, z: p[2], rx: 0.5 * Math.sin(u * PI) , ry: -0.35 + 0.9 * (1 - u) + 0.08 * Math.sin(tau * 1.4), rz: 0.25 * Math.sin(u * PI * 2) };
}
function selloVuelo(tau, ts) {
  ts = ts == null ? G0.TS : ts; const S0 = X3.SELLO_EN;
  if (tau < ts - 0.32) return null;
  if (tau < ts) { const u = tramo(tau, ts - 0.32, ts); return { x: S0.x + 0.9 * (1 - u), y: S0.y + 1.3 * (1 - u * u), z: X3.CD / 2 + 0.026 + 0.9 * (1 - u), rz: 4 * (1 - u), esc: 1.3 - 0.3 * u }; }
  const d = tau - ts; return { x: S0.x, y: S0.y, rz: 0.15 * Math.exp(-d * 6) * Math.sin(d * 20), sz: 1 - 0.45 * Math.exp(-d * 14), esc: 1 + 0.25 * Math.exp(-d * 9) };
}
function gancho(W, X, tau, m1, Dv) {
  const mP = Math.max(m1, 3.35);
  // Mostrador, placa y bolsa.
  const dx = tau > G0.TB && tau < G0.TB + 0.6 ? 0.05 * Math.exp(-(tau - G0.TB) * 9) * Math.sin((tau - G0.TB) * 60) : 0;
  X.mostrador({ x: G0.MX, z: G0.MZ, ry: 0.18, dx, placa: placaVuelo(tau) });
  X.bolsa(bolsaVuelo(tau));
  if (tau > G0.TB && tau < G0.TB + 0.5) { const u = tramo(tau, G0.TB, G0.TB + 0.5); X.halo(0, { x: BOLSA_H[0], y: BOLSA_H[1], z: BOLSA_H[2] + 0.1, esc: 0.5 + 2.8 * sale(u), op: 0.9 * (1 - u), color: 0xf87171 }); }
  if (tau > G0.TP && tau < G0.TP + 0.45) { const u = tramo(tau, G0.TP, G0.TP + 0.45); X.halo(1, { x: G0.MX + 0.1, y: 0.56, z: G0.MZ + 0.5, esc: 0.6 + 3 * sale(u), op: 0.8 * (1 - u), color: 0xef4444 }); }
  // Puerta: roja hasta que llega la caja; turquesa después. En el pop (m1) destella.
  const cq = suave(tramo(tau, G0.TC1 - 0.2, G0.TC1 + 0.3)), fl = tau > m1 ? Math.exp(-(tau - m1) * 3) : 0;
  W.puerta({ x: G0.PX, z: G0.PZ, rot: -0.2, luz: 0.7 + 0.3 * cq + 0.5 * fl, color: 0x2dd4bf, cq });
  // Caja con el sello.
  if (tau > G0.TC0 - 0.05) {
    const c = cajaVuelo(tau), pop = tau > m1 ? 1 + 0.18 * Math.sin(tramo(tau, m1, m1 + 0.35) * PI) : 1;
    X.caja(Object.assign(c, { esc: pop, sello: selloVuelo(tau) }));
    if (tau > G0.TS && tau < G0.TS + 0.5) { const u = tramo(tau, G0.TS, G0.TS + 0.5); X.halo(2, { x: c.x, y: c.y, z: c.z + 0.3, esc: 0.5 + 2.6 * sale(u), op: 0.95 * (1 - u), color: 0x5eead4 }); }
    if (tau > m1 && tau < m1 + 0.6) { const u = tramo(tau, m1, m1 + 0.6); X.halo(3, { x: c.x, y: c.y + 0.1, z: c.z + 0.3, esc: 0.8 + 2.4 * sale(u), op: 0.8 * (1 - u), color: 0x5eead4 }); }
  }
  // Cámara: dolly-in al mostrador, empuje a la placa, órbita, latigazo a la caja (la sigue), grúa atrás al general y deriva.
  const MX = G0.MX, MZ = G0.MZ;
  const K1 = [
    [-0.8, [MX + 2.2, 2.7, MZ + 6.6, MX + 0.6, 1.2, MZ]],
    [0.0, [MX + 1.6, 2.0, MZ + 4.9, MX + 0.2, 0.95, MZ]],
    [G0.TB, [MX + 1.2, 1.7, MZ + 4.3, MX + 0.05, 0.8, MZ + 0.1]],
    [G0.TP + 0.1, [MX + 0.75, 1.3, MZ + 3.95, MX, 0.62, MZ + 0.3]],
    [1.12, [MX - 0.45, 1.6, MZ + 4.2, MX + 0.25, 0.6, MZ + 0.4]]
  ];
  const K2 = [
    [1.12, [MX - 0.45, 1.6, MZ + 4.2, MX + 0.25, 0.6, MZ + 0.4]],
    [1.42, [G0.PX - 2.2, 2.0, G0.PZ + 6.4, G0.PX - 2.6, 1.9, G0.PZ + 3.4]],
    [G0.TS, [G0.PX - 1.6, 1.85, G0.PZ + 5.6, G0.PX - 1.6, 2.0, G0.PZ + 2.3]],
    [G0.TC1, [G0.PX - 1.0, 1.6, G0.PZ + 4.3, G0.PX - 0.2, 0.75, G0.PZ + 0.7]],
    [2.95, [MX + 1.35, 1.65, MZ + 4.7, MX + 0.2, 0.55, MZ + 0.4]],
    [mP - 0.15, [MX + 0.75, 1.4, MZ + 4.25, MX + 0.2, 0.5, MZ + 0.4]]
  ];
  // En «Lo compras por internet» (m1), latigazo de vuelta a la caja con el sello y órbita lenta.
  const K3 = [
    [mP - 0.15, [MX + 0.75, 1.4, MZ + 4.25, MX + 0.2, 0.5, MZ + 0.4]],
    [mP + 0.2, [G0.PX - 1.3, 1.5, G0.PZ + 4.0, G0.PX - 0.15, 0.12, G0.PZ + 0.85]],
    [Math.max(Dv, mP + 1.0), [G0.PX + 0.7, 1.8, G0.PZ + 4.3, G0.PX - 0.15, 0.15, G0.PZ + 0.85]]
  ];
  const C = rutas([K1, K2, K3], tau).slice();
  // Entre el latigazo y la llegada, la mirada sigue a la caja.
  if (tau > 1.3 && tau < 3.0) { const c = cajaVuelo(tau), w = suave(tramo(tau, 1.3, 1.55)) * (1 - suave(tramo(tau, 2.5, 2.8))) * 0.75; C[3] = lerp(C[3], c.x, w); C[4] = lerp(C[4], c.y, w); C[5] = lerp(C[5], c.z, w); }
  let sh = 0; if (tau > G0.TB && tau < G0.TB + 0.4) sh = 0.06 * Math.exp(-(tau - G0.TB) * 10); if (tau > G0.TS && tau < G0.TS + 0.35) sh = 0.05 * Math.exp(-(tau - G0.TS) * 11);
  C[0] += sh * Math.sin(tau * 83); C[1] += sh * Math.cos(tau * 71);
  camR(W, C, 0.12 * (1 - suave(tramo(tau, -0.4, 0.5))) - 0.08 * Math.sin(tramo(tau, 1.12, 1.6) * PI));
}

// ——— escena 1 · «En España, §comprar por internet o por teléfono te da el derecho de desistimiento: §{ding}lo devuelves sin dar explicaciones» ———
const G1 = { HX: -0.3, HZ: 1.0, PX: 1.9, PZ: -2.8 };
function esc1(W, X, s, Dv, mk, res) {
  const mA = mk(0, 0.8), mB = mk(1, 3.3), tD = res[0] ? res[0].ini : mB - 1.0;
  const g = 0.25, luz = suave(tramo(s, mA, mA + 0.5));
  W.heroe({ x: G1.HX, z: G1.HZ, gira: g, luz });
  const qa = s < mB ? 1 : 1 - suave(tramo(s, mB + 0.3, mB + 0.8)); brazos(W.H, qa, 1);
  const mp = manos(G1.HX, G1.HZ, g, 1, 1.06, 0), HAND = [mp[0], mp[1] + 0.12, mp[2] + 0.05];
  W.puerta({ x: G1.PX, z: G1.PZ, rot: -0.3, luz: 0.8 + (s > mB + 0.8 ? 0.6 * Math.exp(-(s - mB - 0.8) * 3) : 0), color: 0x2dd4bf, cq: 1 });
  // La caja cae del cielo a las manos (0–0,55 s), se queda y en el ding sale volando a la puerta.
  let c;
  if (s < 0.55) { const u = tramo(s, 0, 0.55); c = { x: HAND[0] + 0.3 * (1 - u), y: HAND[1] + 3.2 * (1 - u * u), z: HAND[2], rx: 1.5 * (1 - u), ry: g + 2 * (1 - u), rz: 0.6 * (1 - u) }; }
  else if (s < mB) { const d = s - 0.55; c = { x: HAND[0], y: HAND[1] - 0.09 * Math.exp(-d * 8) * Math.abs(Math.sin(d * 18)), z: HAND[2], ry: g }; }
  else { const u = tramo(s, mB, mB + 0.85), p = mezcla(HAND, [G1.PX, 0.9, G1.PZ + 0.2], suave(u)); p[1] += 1.2 * Math.sin(u * PI); c = { x: p[0], y: p[1], z: p[2], rx: -2.5 * u, ry: g + 1.5 * u, esc: 1 - 0.35 * u }; }
  if (s < mB + 0.85) X.caja(Object.assign(c, { sello: { x: X.SELLO_EN.x, y: X.SELLO_EN.y } }));
  // Halo turquesa en «derecho de desistimiento».
  if (s > tD - 0.1 && s < tD + 0.9) { const u = tramo(s, tD - 0.1, tD + 0.9); X.halo(0, { x: G1.HX, y: 1.2, z: G1.HZ, esc: 1 + 4 * sale(u), op: 0.7 * (1 - u), color: 0x5eead4 }); }
  // «¿MOTIVO?» rojo encima de la cabeza: aparece después del halo y revienta en el ding.
  const tM = Math.min(tD + 0.4, mB - 0.6);
  if (s > tM && s < mB + 0.15) { const p = rebote(tramo(s, tM, tM + 0.3)), q = s > mB ? 1 + 2 * tramo(s, mB, mB + 0.15) : 1;
    W.rotulo('mot', '¿MOTIVO?', G1.HX + 0.1, 1.9 + 0.04 * Math.sin(s * 5), G1.HZ + 0.75, s > mB ? 1 - tramo(s, mB, mB + 0.15) : Math.min(1, p * 1.5), '#f87171', 0.3 * p * q); }
  if (s > mB && s < mB + 0.5) { const u = tramo(s, mB, mB + 0.5); X.halo(1, { x: G1.HX + 0.1, y: 1.9, z: G1.HZ + 0.75, esc: 0.5 + 2.6 * sale(u), op: 0.9 * (1 - u), color: 0xf87171 }); }
  // Cámara: órbita de frente-izquierda a frente-derecha, empuje y, tras el ding, sigue la caja hacia la puerta.
  const K = [[0, [-2.2, 1.7, 4.5, G1.HX, 1.3, G1.HZ]], [mA + 0.4, [-1.1, 1.8, 4.8, G1.HX, 1.35, G1.HZ]],
    [mB - 0.1, [1.0, 2.0, 4.5, G1.HX, 1.45, G1.HZ]], [mB + 0.5, [1.4, 2.4, 4.6, 0.6, 1.4, -0.8]], [Math.max(Dv, mB + 1.1), [0.5, 2.8, 5.6, 1.3, 1.3, -2.0]]];
  camR(W, ruta(K, s));
}

// ——— escena 2 · «Los 14 días son naturales §y empiezan cuando lo recibes, §no cuando pagas. §Avisa por escrito antes de que acaben» ———
const G2 = { CX: -0.75, CY: 2.65, CZ: 0, HX: 0.95, HZ: 0.9, PX: 2.6, PZ: -3.2 };
function esc2(W, X, s, Dv, mk, res) {
  const m0 = mk(0, 1.6), m1 = mk(1, 3.0), m2 = mk(2, 3.9);
  // Hojas: 27 (PAGAS) → 28, 29, 30 (LO RECIBES) en m0; 30 → 14 DIC (ÚLTIMO DÍA) en m2.
  const tR = m0 + 0.08, per1 = 0.17, tL = tR + 3 * per1, per2 = Math.min(0.075, Math.max(0.05, (Dv - m2 - 0.9) / 14));
  const c = s < m2 ? pasa(s, [0, 1, 2, 3], tR, per1) : pasa(s, rango(3, 17), m2 + 0.1, per2), tF = m2 + 0.1 + 14 * per2;
  const halo = (s > tL && s < m2 + 0.1) ? 0.85 * tramo(s, tL, tL + 0.12) : s > tF ? 0.9 * tramo(s, tF, tF + 0.12) : 0;
  X.calendario({ x: G2.CX, y: G2.CY, z: G2.CZ, esc: 1.15, ry: 0.12, abajo: c.abajo, hoja: c.hoja, a: c.a, halo, haloColor: s > tF ? 0xffc35a : 0x5eead4 });
  if (s > m2 + 0.1 && s < tF + 0.5) W.rotulo('dia', 'DÍA ' + Math.min(14, c.j + (s >= tF ? 0 : 1)), G2.CX - 0.95, G2.CY - 0.45, G2.CZ + 0.2, 1, '#f5b94a', 0.27);
  // Maniquí a la derecha: la caja le cae en las manos al llegar el 30 (lo recibes); en m2 suelta la carta hacia la puerta.
  const g = -0.55; W.heroe({ x: G2.HX, z: G2.HZ, gira: g, luz: 0.25 + 0.75 * suave(tramo(s, m2, m2 + 0.4)) });
  const qa = s < tL - 0.4 ? 0 : s < m2 ? suave(tramo(s, tL - 0.4, tL - 0.1)) : 1; brazos(W.H, qa, 1);
  const mp = manos(G2.HX, G2.HZ, g, 1, 1.06, 0), HAND = [mp[0], mp[1] + 0.12, mp[2] + 0.05];
  if (s > tL - 0.45) { let cc;
    if (s < tL) { const u = tramo(s, tL - 0.45, tL); cc = { x: HAND[0], y: HAND[1] + 3 * (1 - u * u), z: HAND[2], rx: 1.2 * (1 - u), ry: g + 1.5 * (1 - u) }; }
    else if (s < m2) { const d = s - tL; cc = { x: HAND[0], y: HAND[1] - 0.09 * Math.exp(-d * 8) * Math.abs(Math.sin(d * 18)), z: HAND[2], ry: g }; }
    else { const u = sale(tramo(s, m2, m2 + 0.4)); cc = { x: HAND[0] + 0.55 * u, y: 0.25 + (HAND[1] - 0.25) * (1 - u), z: HAND[2] + 0.25 * u, ry: g }; }
    X.caja(cc);
    if (s > tL && s < tL + 0.45) { const u = tramo(s, tL, tL + 0.45); X.halo(0, { x: HAND[0], y: HAND[1], z: HAND[2], esc: 0.5 + 2.4 * sale(u), op: 0.85 * (1 - u), color: 0x5eead4 }); }
  }
  if (s > m2 + 0.15) { const u = tramo(s, m2 + 0.15, Math.min(m2 + 1.3, Dv - 0.1)), p = mezcla([mp[0], mp[1] + 0.3, mp[2]], [G2.PX, 1.4, G2.PZ + 0.2], suave(u)); p[1] += 0.8 * Math.sin(u * PI);
    if (u < 0.999) X.carta({ x: p[0], y: p[1], z: p[2], ry: -0.4 + 0.4 * Math.sin(u * 6), rz: 0.3 * Math.sin(u * 9), rx: -0.2, esc: 1 - 0.4 * u }); }
  W.puerta({ x: G2.PX, z: G2.PZ, rot: -0.4, luz: s > m2 ? 0.9 : 0.35, color: 0x2dd4bf, cq: 1 });
  const K = [[0, [G2.CX + 0.55, 2.05, 3.5, G2.CX, 1.82, 0]], [m0, [G2.CX + 0.1, 2.0, 3.7, G2.CX + 0.15, 1.8, 0]],
    [tL + 0.2, [0.6, 2.1, 5.0, 0.1, 1.45, 0.3]], [m2, [0.1, 2.05, 4.7, -0.2, 1.55, 0.2]], [Math.max(Dv, m2 + 1.3), [0.8, 2.6, 6.3, 0.0, 1.45, -0.6]]];
  camR(W, ruta(K, s));
}
const qq = (s, a, d) => sale(tramo(s, a, a + (d || 0.45)));

// ——— escena 3 · «¿Y el dinero? §Tienen 14 días para devolvértelo, §{caja}envío estándar incluido, §aunque pueden esperar a que se lo devuelvas» ———
const G3 = { HX: -1.5, HZ: 1.25, PX: 1.45, PZ: -1.9, SX: 0.2, SZ: -1.35 };
function esc3(W, X, s, Dv, mk, res) {
  const m0 = mk(0, 0.9), m1 = mk(1, 2.4), m2 = mk(2, 3.6);
  const g = 0.75; W.heroe({ x: G3.HX, z: G3.HZ, gira: g, luz: 1 });
  const tT = m2 + 0.25, tE = tT + 0.75;                        // la caja sale de las manos (tT) y entra por la puerta (tE)
  const tV = Math.min(tE + 0.15, Dv - 1.1), tV1 = Math.min(tV + 1.0, Dv - 0.1);   // las monedas vuelan al maniquí
  const qa = s < tT ? 1 : s < tV ? 1 - suave(tramo(s, tT, tT + 0.4)) : suave(tramo(s, tV, tV + 0.5)); brazos(W.H, qa, 1);
  const mp = manos(G3.HX, G3.HZ, g, 1, 1.06, 0), HAND = [mp[0], mp[1] + 0.12, mp[2] + 0.05];
  if (s < tE) { let c;
    if (s < tT) c = { x: HAND[0], y: HAND[1], z: HAND[2], ry: g };
    else { const u = tramo(s, tT, tE), p = mezcla(HAND, [G3.PX, 0.9, G3.PZ], suave(u)); p[1] += 1.0 * Math.sin(u * PI); c = { x: p[0], y: p[1], z: p[2], rx: -2 * u, ry: g + u, esc: 1 - 0.4 * u }; }
    X.caja(Object.assign(c, { sello: { x: X.SELLO_EN.x, y: X.SELLO_EN.y } }));
  }
  const fl = s > tE ? Math.exp(-(s - tE) * 3) : 0;
  W.puerta({ x: G3.PX, z: G3.PZ, rot: -0.25, luz: 0.85 + 0.6 * fl, color: 0x2dd4bf, cq: 1 });
  if (s > tE && s < tE + 0.5) { const u = tramo(s, tE, tE + 0.5); X.halo(2, { x: G3.PX, y: 1.2, z: G3.PZ + 0.3, esc: 0.8 + 3 * sale(u), op: 0.8 * (1 - u), color: 0x5eead4 }); }
  // Monedas: 7 turquesa caen en pila junto a la puerta desde m0; la ámbar «ENVÍO» en m1; esperan (flotan) y en tV vuelan a las manos.
  for (let i = 0; i < 8; i++) {
    const t0 = i < 7 ? m0 + 0.08 * i : m1 - 0.05, top = [G3.SX, 0.04 + 0.075 * i, G3.SZ];
    if (s < t0 - 0.35) continue;
    let o;
    const espera = s > m2 && s < tV ? 0.06 * Math.sin((s - m2) * 6 + i * 0.6) + 0.12 * suave(tramo(s, m2, m2 + 0.3)) : s >= tV ? 0.12 : 0;
    if (s < t0) { const u = tramo(s, t0 - 0.35, t0); o = { x: top[0], y: top[1] + 2.4 * (1 - u * u), z: top[2], rx: 2 * (1 - u) }; }
    else if (s < tV) { const d = s - t0; o = { x: top[0], y: top[1] + espera + 0.05 * Math.exp(-d * 9) * Math.abs(Math.sin(d * 20)), z: top[2], ry: i * 0.4, esc: i === 7 ? 1 + 0.35 * Math.sin(tramo(s, t0, t0 + 0.35) * PI) : 1 }; }
    else { const tv0 = tV + 0.05 * (7 - i), u = tramo(s, tv0, Math.min(tv0 + 0.75, Dv)), p = mezcla([top[0], top[1] + 0.12, top[2]], [HAND[0], HAND[1] + 0.02 + 0.06 * i, HAND[2]], suave(u)); p[1] += 0.9 * Math.sin(u * PI);
      o = { x: p[0], y: p[1], z: p[2], rx: 3 * Math.sin(u * PI), ry: i * 0.4 + 2 * u }; }
    X.moneda(i, o);
  }
  if (s > m1 - 0.05 && s < m1 + 0.45) { const u = tramo(s, m1 - 0.05, m1 + 0.45); X.halo(3, { x: G3.SX, y: 0.6, z: G3.SZ + 0.1, esc: 0.6 + 2.4 * sale(u), op: 0.9 * (1 - u), color: 0xffc35a }); }
  const sobre = s < tV ? 1 : 1 - tramo(s, tV, tV + 0.3);
  W.rotulo('env', 'ENVÍO', G3.SX + 0.55, 0.95, G3.SZ + 0.1, qq(s, m1 + 0.05, 0.25) * sobre, '#f5b94a', 0.22);
  W.rotulo('esp', 'EN ESPERA', G3.SX, 1.45, G3.SZ, qq(s, m2 + 0.1, 0.25) * (1 - tramo(s, tE - 0.1, tE + 0.1)), '#f5b94a', 0.24);
  const K = [[0, [-3.0, 2.0, 5.0, G3.HX + 0.1, 1.25, G3.HZ]], [m0, [1.3, 1.55, 2.3, G3.SX - 0.1, 0.55, G3.SZ]],
    [m1, [0.95, 1.2, 1.25, G3.SX, 0.45, G3.SZ]], [m2 + 0.2, [-0.4, 3.0, 5.0, -0.1, 0.8, -0.5]], [Math.max(Dv, m2 + 1.2), [-1.8, 3.2, 5.6, -0.5, 0.9, -0.2]]];
  camR(W, ruta(K, s));
}

// ——— escena 4 · «Y si la tienda no te informó de este derecho, §el plazo no acaba a los 14 días: §{tic}se alarga 12 meses más» ———
const G4 = { CX: 0.2, CY: 2.6, CZ: -0.4, HX: -1.9, HZ: 0.6 };
function esc4(W, X, s, Dv, mk, res) {
  const m0 = mk(0, 1.9), m1 = mk(1, 3.4);
  const per = Math.min(0.13, Math.max(0.08, (Dv - m1 - 0.7) / 12)), c = pasa(s, [17, ...rango(101, 112)], m1 + 0.05, per), tF = m1 + 0.05 + 12 * per;
  X.calendario({ x: G4.CX, y: G4.CY, z: G4.CZ, esc: 1.0, ry: -0.1, abajo: c.abajo, hoja: c.hoja, a: c.a, cruz: s < m1 + 0.05 ? sale(tramo(s, m0 + 0.05, m0 + 0.3)) : 0,
    halo: s > tF ? 0.95 * tramo(s, tF, tF + 0.15) : 0.25 + 0.1 * Math.sin(s * 4), haloColor: 0xffc35a });
  if (s > m1 + 0.05) W.rotulo('mes', '+' + Math.min(12, c.j + (s >= tF ? 0 : 1)) + ' MESES', G4.CX - 0.9, G4.CY - 0.35, G4.CZ + 0.25, 1, '#f5b94a', 0.3);
  if (s > tF && s < tF + 0.6) { const u = tramo(s, tF, tF + 0.6); X.halo(0, { x: G4.CX, y: G4.CY - 0.7, z: G4.CZ + 0.3, esc: 1 + 3.5 * sale(u), op: 0.8 * (1 - u), color: 0xffc35a }); }
  const g = Math.atan2(G4.CX - G4.HX, G4.CZ - G4.HZ);
  W.heroe({ x: G4.HX + 0.6 * (1 - sale(tramo(s, 0, 0.9))), z: G4.HZ + 0.5 * (1 - sale(tramo(s, 0, 0.9))), gira: g, amp: 1 - tramo(s, 0.6, 0.9), fase: s * 8, luz: s > tF ? 1 : 0, brazos: s > tF ? 0.35 * qq(s, tF, 0.3) : 0 });
  const K = [[0, [-1.3, 1.7, 3.9, G4.CX - 0.4, 1.85, G4.CZ]], [m0 - 0.1, [-0.2, 1.95, 3.25, G4.CX, 1.9, G4.CZ]], [m1, [0.45, 2.0, 2.95, G4.CX - 0.1, 1.95, G4.CZ]],
    [Math.min(tF, Dv - 0.4), [1.3, 2.9, 6.0, -0.2, 1.6, -0.2]], [Math.max(Dv, tF + 0.5), [0.8, 3.1, 6.5, -0.3, 1.6, -0.2]]];
  camR(W, ruta(K, s));
}

// ——— escena 5 · «Hoy guarda el correo de confirmación §y apunta la fecha de entrega. §En la tienda, decide la tienda. §{pop}Por internet, decides tú» ———
const G5 = { HX: -0.2, HZ: 1.7 };
function esc5(W, X, s, Dv, mk, res) {
  const m0 = mk(0, 1.5), m1 = mk(1, 3.0), m2 = mk(2, 4.6);
  // Maniquí con el móvil (por encima del hombro); en m1 latigazo al mostrador (la bolsa rebota otra vez); en m2 a la puerta (la caja entra).
  const g = 0.35; W.heroe({ x: G5.HX, z: G5.HZ, gira: g, luz: s > m2 ? suave(tramo(s, m2, m2 + 0.4)) : 0.6 });
  const qp = 0.3; brazos(W.H, s < m1 + 0.2 ? 1 : 1 - suave(tramo(s, m1 + 0.2, m1 + 0.6)), qp);
  const mp = manos(G5.HX, G5.HZ, g, qp, 1.06, 0);
  if (s < m1 + 0.6) X.movil({ x: mp[0], y: mp[1] + 0.06, z: mp[2], ry: g + PI, rx: 0.1, esc: s < m1 + 0.2 ? 1 : 1 - tramo(s, m1 + 0.2, m1 + 0.6), ent: suave(tramo(s, m0, m0 + 0.35)) });
  // Mostrador y bolsa (rebota de nuevo: choca en m1 + 0.25); placa ya puesta.
  const tB = m1 + 0.25, dx = s > tB && s < tB + 0.6 ? 0.05 * Math.exp(-(s - tB) * 9) * Math.sin((s - tB) * 60) : 0;
  const pl = s > tB ? { y: 0.56 - 0.03 * Math.exp(-(s - tB) * 9) * Math.sin((s - tB) * 30), rz: 0.1 * Math.exp(-(s - tB) * 5) * Math.sin((s - tB) * 22) } : {};
  X.mostrador({ x: G0.MX, z: G0.MZ, ry: 0.18, dx, placa: pl });
  if (s > tB - 0.75 && s < m2 + 0.3) X.bolsa(bolsaVuelo(s, tB));
  if (s > tB && s < tB + 0.5) { const u = tramo(s, tB, tB + 0.5); X.halo(0, { x: BOLSA_H[0], y: BOLSA_H[1], z: BOLSA_H[2] + 0.1, esc: 0.5 + 2.8 * sale(u), op: 0.9 * (1 - u), color: 0xf87171 }); }
  // Caja con el sello: vuela a la puerta desde m2 − 0.1.
  const tc0 = m2 - 0.1, tc1 = Math.min(m2 + 1.05, Dv - 1.0);
  const fl = s > tc1 ? Math.exp(-(s - tc1) * 3) : 0;
  W.puerta({ x: G0.PX, z: G0.PZ, rot: -0.2, luz: 0.85 + 0.6 * fl, color: 0x2dd4bf, cq: 1 });
  if (s > tc0) { const c = cajaVuelo(s, tc0, tc1); X.caja(Object.assign(c, { sello: { x: X.SELLO_EN.x, y: X.SELLO_EN.y } }));
    if (s > tc1 && s < tc1 + 0.6) { const u = tramo(s, tc1, tc1 + 0.6); X.halo(1, { x: c.x, y: c.y + 0.1, z: c.z + 0.3, esc: 0.8 + 2.6 * sale(u), op: 0.85 * (1 - u), color: 0x5eead4 }); } }
  // Cámara: por encima del hombro al móvil → latigazo al mostrador → latigazo a la puerta → general hasta la cola.
  const MX = G0.MX, MZ = G0.MZ, PX = G0.PX, PZ = G0.PZ;
  const K = [[0, [G5.HX + 0.15, 2.95, G5.HZ - 1.15, mp[0] + 0.05, mp[1] - 0.2, mp[2] + 0.4]], [m1 - 0.05, [G5.HX + 0.35, 2.8, G5.HZ - 0.9, mp[0], mp[1] - 0.22, mp[2] + 0.3]]];
  const K2 = [[m1 - 0.05, [G5.HX + 0.35, 2.8, G5.HZ - 0.9, mp[0], mp[1] - 0.22, mp[2] + 0.3]], [m1 + 0.3, [MX + 1.6, 1.8, MZ + 4.3, MX + 0.3, 0.7, MZ + 0.4]], [m2 - 0.15, [MX + 0.9, 1.5, MZ + 3.6, MX + 0.4, 0.5, MZ + 0.7]]];
  const K3 = [[m2 - 0.15, [MX + 0.9, 1.5, MZ + 3.6, MX + 0.4, 0.5, MZ + 0.7]], [m2 + 0.25, [PX - 2.0, 2.1, PZ + 6.0, PX - 1.8, 1.6, PZ + 2.6]], [tc1, [PX - 1.0, 1.7, PZ + 4.4, PX - 0.2, 0.8, PZ + 0.7]],
    [Math.max(Dv - 0.8, tc1 + 0.3), [0.3, 3.6, 9.0, 0.0, 1.0, -0.6]]];
  const C = rutas([K, K2, K3], s).slice();
  if (s > m2 + 0.15 && s < tc1 + 0.3) { const c = cajaVuelo(s, tc0, tc1), w = suave(tramo(s, m2 + 0.15, m2 + 0.4)) * (1 - suave(tramo(s, tc1 - 0.1, tc1 + 0.3))) * 0.7; C[3] = lerp(C[3], c.x, w); C[4] = lerp(C[4], c.y, w); C[5] = lerp(C[5], c.z, w); }
  camR(W, C);
}
`;

// Capa 2D: rótulos de 2–4 palabras en el tercio central-bajo (y ≈ 1.300 px); una nota pequeña abajo a la izquierda.
const nota = (txt) => `<div class="nota">${txt}</div>`;
const rt = (cls, txt, top) => `<div class="rt ${cls}" data-t="translateX(-50%)"${top ? ` style="top:${top}px"` : ''}>${txt}</div>`;
const R_TIENDA = rt('g roja', '<small>EN TIENDA, POR LEY</small><span class="r">0 DÍAS</span>', 1250);
const ESCENAS = [
  // 0 · Gancho: «0 DÍAS» (tienda) ya puesto → «14 DÍAS» (internet) en el latigazo → los dos juntos en el pop.
  { html: () => R_TIENDA + rt('g turq', '<small>POR INTERNET</small><span class="t">14 DÍAS</span>', 1250) + R_TIENDA +
      rt('p', 'TIENDA: <span class="r">0 DÍAS</span><br>INTERNET: <span class="t">14 DÍAS</span>', 1270),
    anim: function (s, e, el) { const M = e.seg[0].marcas, mP = Math.max(M[1] != null ? M[1] : 3.4, 3.35), r = el.querySelectorAll('.rt');
      ver(r[0], s, -1, 1.42); ver(r[1], s, 1.42, 2.8); ver(r[2], s, 2.85, mP); ver(r[3], s, mP + 0.05); } },
  // 1 · EN ESPAÑA → DERECHO DE DESISTIMIENTO → SIN DAR EXPLICACIONES (+ nota de excepciones).
  { html: () => rt('turq', 'EN <span class="t">ESPAÑA</span>') + rt('turq p', 'DERECHO DE<br><span class="t">DESISTIMIENTO</span>') + rt('turq p', 'SIN DAR<br><span class="t">EXPLICACIONES</span>') +
      nota('Compras a una empresa por internet o por teléfono.<br>Hay excepciones: personalizados, perecederos… (art. 103)'),
    anim: function (s, e, el) { const g = e.seg[0], M = g.marcas, mA = M[0] != null ? M[0] : 0.8, mB = M[1] != null ? M[1] : 3.3, tD = g.res[0] ? g.res[0].ini : mB - 1, r = el.querySelectorAll('.rt');
      ver(r[0], s, 0.05, tD - 0.05); ver(r[1], s, tD, mB); ver(r[2], s, mB + 0.05); ver(el.querySelector('.nota'), s, mA + 0.2); } },
  // 2 · 14 DÍAS NATURALES → DESDE QUE LO RECIBES → NO DESDE QUE PAGAS → AVISA ANTES DEL 14 DIC.
  { html: () => rt('turq', '14 DÍAS <span class="t">NATURALES</span>') + rt('turq p', 'EMPIEZAN AL<br><span class="t">RECIBIRLO</span>') + rt('roja', '<span class="r">NO</span> AL PAGAR') +
      rt('amb p', 'AVISA POR ESCRITO<br>ANTES DEL <span class="a">14 DIC</span>') + nota('Ejemplo. El día de la entrega no cuenta: el día 1 es el siguiente<br>(Código Civil, art. 5). Sábados y festivos, sí.'),
    anim: function (s, e, el) { const M = e.seg[0].marcas, m0 = M[0] != null ? M[0] : 1.6, m1 = M[1] != null ? M[1] : 3.0, m2 = M[2] != null ? M[2] : 3.9, r = el.querySelectorAll('.rt');
      ver(r[0], s, 0.1, m0); ver(r[1], s, m0 + 0.6, m1); ver(r[2], s, m1 + 0.05, m2); ver(r[3], s, m2 + 0.2); ver(el.querySelector('.nota'), s, 0.4); } },
  // 3 · ¿Y EL DINERO? → EN 14 DÍAS → + ENVÍO ESTÁNDAR → PUEDEN ESPERAR A QUE SE LO DEVUELVAS.
  { html: () => rt('', '¿Y EL <span class="t">DINERO</span>?') + rt('turq', 'TE LO DEVUELVEN<br>EN <span class="t">14 DÍAS</span>') + rt('amb', '+ <span class="a">ENVÍO</span> ESTÁNDAR') +
      rt('amb p', 'PUEDEN ESPERAR<br>A QUE <span class="a">SE LO DEVUELVAS</span>') + nota('Desde que les avisas. Por el mismo medio de pago (art. 107).<br>La vuelta la pagas tú solo si te lo avisaron (art. 108).'),
    anim: function (s, e, el) { const M = e.seg[0].marcas, m0 = M[0] != null ? M[0] : 0.9, m1 = M[1] != null ? M[1] : 2.4, m2 = M[2] != null ? M[2] : 3.6, r = el.querySelectorAll('.rt');
      ver(r[0], s, 0.05, m0); ver(r[1], s, m0 + 0.05, m1); ver(r[2], s, m1 + 0.05, m2); ver(r[3], s, m2 + 0.1); ver(el.querySelector('.nota'), s, m0 + 0.3); } },
  // 4 · ¿NO TE INFORMARON? → NO ACABA AQUÍ → +12 MESES.
  { html: () => rt('roja', '¿NO TE <span class="r">INFORMARON</span>?', 1400) + rt('roja', '<span class="r">NO</span> ACABA EL 14 DIC', 1400) + rt('g amb', '<small>EL PLAZO SE ALARGA</small><span class="a">+12 MESES</span>', 1250) +
      nota('Ley General para la Defensa de los Consumidores<br>y Usuarios (RDL 1/2007), art. 105. Ejemplo: hasta el 14-12-2027.'),
    anim: function (s, e, el) { const M = e.seg[0].marcas, m0 = M[0] != null ? M[0] : 1.9, m1 = M[1] != null ? M[1] : 3.4, r = el.querySelectorAll('.rt');
      ver(r[0], s, 0.1, m0); ver(r[1], s, m0 + 0.1, m1); ver(r[2], s, m1 + 0.25); ver(el.querySelector('.nota'), s, m1 + 0.4); } },
  // 5 · GUARDA EL CORREO → APUNTA LA ENTREGA → EN TIENDA: DECIDEN ELLOS → POR INTERNET: DECIDES TÚ. Cola: el rótulo del fotograma 0.
  { html: () => rt('turq', 'GUARDA EL <span class="t">CORREO</span>') + rt('amb', 'APUNTA LA <span class="a">ENTREGA</span>') + rt('roja', 'EN TIENDA: <span class="r">DECIDEN ELLOS</span>') +
      rt('turq', 'POR INTERNET: <span class="t">DECIDES TÚ</span>') + R_TIENDA,
    anim: function (s, e, el) { const M = e.seg[0].marcas, m0 = M[0] != null ? M[0] : 1.5, m1 = M[1] != null ? M[1] : 3.0, m2 = M[2] != null ? M[2] : 4.6, r = el.querySelectorAll('.rt');
      const cola = e.fin - e.ini - 0.8; ver(r[0], s, 0.1, m0); ver(r[1], s, m0 + 0.05, m1); ver(r[2], s, m1 + 0.05, m2); ver(r[3], s, m2 + 0.05, cola);
      r[4].style.opacity = s >= cola ? 1 : 0; r[4].style.transform = 'translateX(-50%)'; } }
];

const TRES = function (t, k, s, e, W) {
  const X = W.X; X.apagar();
  const ultima = k === ESC.length - 1, Dv = (e.fin - e.ini) - (ultima ? 0 : 0.3);
  const M = e.seg.flatMap(g => g.marcas), res = e.seg.flatMap(g => g.res);
  const mk = (j, def) => (M[j] != null ? M[j] : def);
  W.cam.up.set(0, 1, 0);
  if (k === 0) gancho(W, X, s, mk(1, 3.4), Dv);
  else if (ultima && s >= Dv - 0.8) gancho(W, X, s - Dv, 9, 4);   // cola: el encuadre del fotograma 0 (bucle)
  else [null, esc1, esc2, esc3, esc4, esc5][k](W, X, s, Dv, mk, res);
  W.multitud(t, { directo: () => ({ x: -60, z: -60, esc: 0 }) });
};

const pildoras = {
  'es-devolucion-tienda-internet': pildora3d({
    slug: 'es-devolucion-tienda-internet', cuenta: 'es',
    T: { es: { titulo: 'En la tienda no te lo tienen que devolver. Por internet, 14 días', guion: GUION } },
    fijo: () => `<div class="hud i fmt">TUS DERECHOS</div><div class="hud d"><i></i><span id="reloj">00:00</span></div>`,
    cssExtra: CSS, scriptExtra: SCRIPT,
    datos: () => ({ HOJAS }),
    escenas: ESCENAS, tres: TRES,
    voz: VOZ, cola: 0.8, corte2d: 'seco',
    texto: { es: TEXTO }
  })
};

module.exports = { pildoras };
