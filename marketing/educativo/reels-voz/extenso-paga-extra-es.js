// Formato extenso (≈40 s) · @finanziapp.es (España), en 3D (reels-voz/tres.js), píldora «Hacemos la cuenta».
// es-paga-extra · «Tu paga extra: 2.000 euros brutos, igual que tu nómina. Y te llegan 152 euros más.»
// Guion final y verificado: guiones/2026-11-es-paga-extra.md (tabla de escenas, cuentas, fuentes, texto y portada).
// Publicación prevista: miércoles 25/11/2026 por la mañana (Madrid). Vale hasta pasada la paga extra de diciembre.
//
// Fuentes de cada dato (todas consultadas el 23-nov-2026):
// - Prorrateo de las pagas extra en la base de cotización: Real Decreto Legislativo 8/2015 (Ley General de la Seguridad Social),
//   art. 147.1: «Las percepciones de vencimiento superior al mensual se prorratearán a lo largo de los doce meses del año».
//   https://www.boe.es/buscar/act.php?id=BOE-A-2015-11724#a147
// - Base de cada mes en 2026 = remuneración del mes + parte proporcional de las gratificaciones extraordinarias (sueldo mensual:
//   importe anual estimado ÷ 12): Orden PJC/297/2026, de 30 de marzo (BOE 31/03/2026), art. 1.1, normas primera y segunda.
//   Tipos del trabajador en 2026: contingencias comunes 4,70 % (art. 4.a), MEI 0,15 % (art. 16), desempleo 1,55 % con contrato
//   indefinido (art. 33.2.a.1.º; 1,60 % de duración determinada), formación profesional 0,10 % (art. 33.2.c). Base máxima 5.101,20 €.
//   https://www.boe.es/boe/dias/2026/03/31/pdfs/BOE-A-2026-7296.pdf
// - Retención de IRPF: el mismo tipo se aplica a la cuantía total de cada pago (nóminas y pagas extra), con las regularizaciones
//   que procedan: Real Decreto 439/2007 (Reglamento del IRPF), arts. 80.1, 82.5.ª, 86.1 y 87. https://www.boe.es/buscar/act.php?id=BOE-A-2007-6820#a82
// - Tipo de retención real del ejemplo (solo en el texto): RIRPF arts. 81, 83.3, 84, 85.1 y 86.1; Ley 35/2006, arts. 19.2.f y 57.
//   https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764#a19
// Las cifras del vídeo son un EJEMPLO (rótulo «EJEMPLO» en las nóminas): 2.000 € brutos al mes, 14 pagas, contrato indefinido,
// retención del 15 % (para una persona soltera sin hijos el cálculo da 15,59 %; la diferencia de 152 € no depende de la retención).
const { pildora3d } = require('./tres');
const { cuadra } = require('../reels/_comun');

// ——— cuentas (todas las del guion: guiones/2026-11-es-paga-extra.md, «Cuentas») ———
const B = 2000, PAGAS = 14, TIPO = { cc: 4.70, desempleo: 1.55, fp: 0.10, mei: 0.15 };
const r2 = (x) => Math.round(x * 100) / 100;
const t = (TIPO.cc + TIPO.desempleo + TIPO.fp + TIPO.mei) / 100;
cuadra('tipo del trabajador 2026 (contrato indefinido)', r2(t * 100), 6.5);
const BASE = B * PAGAS / 12;
cuadra('base de cotización mensual (2.000 × 14 ÷ 12)', r2(BASE), 2333.33);
cuadra('«2.333 euros»', Math.round(BASE), 2333);
const SS = BASE * t;
cuadra('Seguridad Social de cada nómina', r2(SS), 151.67);
const RET = 0.15, IRPF = B * RET;
cuadra('IRPF 15 % de 2.000', IRPF, 300);
const NOMINA = B - SS - IRPF, EXTRA = B - IRPF;
cuadra('neto nómina', r2(NOMINA), 1548.33);
cuadra('«1.548 euros»', Math.round(NOMINA), 1548);
cuadra('neto extra', EXTRA, 1700);
cuadra('«152 euros más» (= SS de la nómina)', Math.round(EXTRA - NOMINA), 152);
cuadra('152 también con las cifras redondeadas', 1700 - 1548, 152);
cuadra('diferencia = SS, sea cual sea la retención', r2((B - B * 0.1559) - (B - SS - B * 0.1559)), 151.67);
cuadra('SS de la nómina por su sueldo (2.000 × 6,5 %)', B * t, 130);
cuadra('«22 euros al mes» (prorrata de las extras)', r2((BASE - B) * t), 21.67);
cuadra('22 redondeado', Math.round((BASE - B) * t), 22);
cuadra('12 meses de prorrata = SS de dos extras', r2(12 * (BASE - B) * t), r2(2 * B * t));
cuadra('130 + 21,67 = 151,67', r2(B * t + (BASE - B) * t), 151.67);
cuadra('loncha de cada mes = 2.000 × 2 ÷ 12', r2(B * 2 / 12), 333.33);
cuadra('bruto anual', B * PAGAS, 28000);
const anual = B * PAGAS, baseRet = anual - SS * 12 - 2000;
cuadra('cotizaciones del año', r2(SS * 12), 1820);
cuadra('base para el tipo de retención', r2(baseRet), 24180);
const escala = (b) => { let c = 0, r = b; for (const [w, p] of [[12450, .19], [7750, .24], [15000, .30], [24800, .37]]) { const x = Math.min(r, w); c += x * p; r -= x; if (r <= 0) break; } return c; };
cuadra('cuota de retención', r2(escala(baseRet) - escala(5550)), 4365);
cuadra('tipo de retención del ejemplo', r2((escala(baseRet) - escala(5550)) / anual * 100), 15.59);
cuadra('debajo del límite del 43 % (art. 85.4), mínimo excluido 15.876 €', r2(escala(baseRet) - escala(5550)) < 0.43 * (anual - 15876), true);
cuadra('base por debajo de la máxima de 2026', BASE < 5101.20, true);
// Lo que sale en pantalla
const eur = (x) => Math.round(x).toLocaleString('es-ES', { useGrouping: 'always' }) + ' €';
cuadra('pantalla: «−152 €» de la franja roja', '−' + eur(SS), '−152 €');
cuadra('pantalla: «−300 €» de la franja IRPF', '−' + eur(IRPF), '−300 €');
cuadra('pantalla: netos', [eur(NOMINA), eur(EXTRA)].join(' | '), '1.548 € | 1.700 €');
cuadra('pantalla: «+152 €»', '+' + eur(EXTRA - NOMINA), '+152 €');
cuadra('pantalla: «2.333,33»', BASE.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: 'always' }), '2.333,33');
cuadra('pantalla: «22 €»', eur((BASE - B) * t), '22 €');
cuadra('pantalla: columnas ∝ neto (sin cortar el eje)', r2(EXTRA * 0.0015 / (NOMINA * 0.0015)), r2(EXTRA / NOMINA));

const TEXTO = `Tu paga extra de diciembre: 2.000 € brutos, igual que tu nómina… y te llegan 152 € más. No es un regalo. 💶

• En España, las pagas extra se reparten entre los 12 meses para cotizar a la Seguridad Social (art. 147 de la Ley General de la Seguridad Social). Por eso la paga extra normalmente no lleva descuento de Seguridad Social: lo has ido pagando en cada nómina.
• Sí lleva IRPF, al mismo tipo de retención que el resto del año, salvo que tu empresa lo regularice ese mes.
• El ejemplo: 2.000 € brutos al mes en 14 pagas (28.000 € al año), contrato indefinido. En 2026 el trabajador cotiza un 6,50 % (4,70 contingencias comunes + 1,55 desempleo + 0,10 formación + 0,15 MEI) sobre una base de 2.333,33 €: 151,67 € al mes. Con un 15 % de retención, la nómina queda en 1.548,33 € y la extra en 1.700 €. Para una persona soltera y sin hijos con ese sueldo, el cálculo de Hacienda da una retención de en torno al 15,6 %, y la diferencia sigue siendo de 151,67 €: el IRPF es el mismo en las dos.
• Si cobras las pagas prorrateadas, no hay extra en diciembre: cada nómina ya es de 2.333,33 € brutos. Cuánto vale tu extra (el sueldo entero o solo el salario base) lo dice tu convenio.

Para hoy: abre tu última nómina y busca la base de cotización por contingencias comunes. Si es más alta que tu bruto del mes, ahí está la parte de tus pagas extra.

Guárdalo 🔖 y mándaselo a quien cree que la extra es un regalo.

¿Tú cobras 14 pagas o las tienes prorrateadas? 👇

Contenido educativo, no es asesoramiento financiero.

Fuentes: Real Decreto Legislativo 8/2015 (Ley General de la Seguridad Social), art. 147.1; Orden PJC/297/2026 de cotización (BOE 31/03/2026), arts. 1, 4, 16 y 33; Reglamento del IRPF (RD 439/2007), arts. 80–87; Ley 35/2006 del IRPF, arts. 19 y 57. Cifras: ejemplo. Consultado el 23/11/2026.

#nomina #pagaextra #finanzaspersonales #educacionfinanciera #dinero`;

const GUION = [
  [0, 'Tu paga extra: 2.000 euros brutos, §igual que tu nómina. §{pop}Y te llegan *152 euros más*.'],
  [1, 'En España, §la paga extra *no lleva Seguridad Social*. §Solo §{ding}*IRPF*, al mismo tipo que cada mes.'],
  [2, 'Con 2.000 brutos, catorce pagas y un 15 % de retención, §tu nómina se queda en *1.548 euros*. §{caja}La extra, en *1.700*.'],
  [3, '¿Te libras de pagarla? §{tic}*No*: ya la has pagado, a plazos.'],
  [4, 'La ley reparte tus dos pagas extra §entre los doce meses: §cada nómina cotiza por *2.333 euros*, no por 2.000. §Son *22 euros al mes* que pagas por adelantado.'],
  [5, 'Mira hoy tu nómina §y busca la *base de cotización*: §si supera tu bruto, ahí están tus pagas extra. §{pop}*La extra no es un regalo: ya la cotizaste*.']
];

const CSS = `
  .hud.i.fmt { letter-spacing: .14em; }
  .rt { position: absolute; left: 50%; top: 1300px; padding: 10px 30px 15px; border-radius: 20px; background: rgba(9,14,27,.9); border: 3px solid #e2e8f0;
    color: #fff; font-size: 62px; line-height: 1.1; font-weight: 900; letter-spacing: -.015em; white-space: nowrap; opacity: 0; font-variant-numeric: tabular-nums;
    text-align: center; box-shadow: 0 10px 40px rgba(0,0,0,.45); }
  .rt.p { font-size: 52px; } .rt.amb { border-color: #f5b94a; } .rt.roja { border-color: #f87171; } .rt.turq { border-color: #5eead4; }
  .rt .a { color: #f5b94a; } .rt .r { color: #f87171; } .rt .t { color: #5eead4; }
  .nota { position: absolute; left: 70px; top: 1452px; max-width: 820px; font: 600 24px/1.32 'DejaVu Sans Mono', 'Liberation Mono', monospace; color: #b6c2d4; background: rgba(7,11,22,.8);
    border-radius: 10px; padding: 6px 14px; opacity: 0; }
`;

// Mundo 3D propio: dos nóminas grandes (NÓMINA y PAGA EXTRA) con franjas que se arrancan, netos, columnas de lo que te queda,
// doce nóminas pequeñas con su base de cotización, fichas de 22 €, barrera, nómina en la mano y sello. Todo se apaga en cada fotograma.
const SCRIPT = `
function ver(n, s, a, b) { if (!n) return; let p = a < -0.5 ? 1 : rebote(tramo(s, a - 0.1, a + 0.25)); if (b != null) p *= 1 - tramo(s, b - 0.12, b); aparece3(n, p); }
const PI = Math.PI, AMBH = 0xf5b94a, ROJOH = 0xef4444, TURQH = 0x2dd4bf, GRISC = 0xcbd5e1;
const mezcla = (P, Q, u) => P.map((v, j) => v + (Q[j] - v) * u);
const suave = (x) => x * x * (3 - 2 * x);
const angulo = (a, b, g) => a + ((((b - a + PI) % (2 * PI)) + 2 * PI) % (2 * PI) - PI) * g;
const qq = (s, a, d) => sale(tramo(s, a, a + (d || 0.45)));
// Cámara por fotogramas clave (Hermite), varias rutas seguidas, paso suave y giro (de extenso-black-friday-es.js).
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
function paso(A, B, s, a, b) { return s >= a && s <= b ? mezcla(A, B, suave(tramo(s, a, b))) : null; }
function camR(W, C, roll) { const r = roll || 0; W.cam.up.set(Math.sin(r), Math.cos(r), 0); W.camara(C[0], C[1], C[2], C[3], C[4], C[5]); }
function brazos(a, qa, qp) {
  const ax = -2.75 * (1 - qp) - 0.95 * qp, az = -0.1 * (1 - qp) - 0.2 * qp, cx = -0.15 * (1 - qp) - 1.15 * qp;
  [[a.izq, -1], [a.der, 1]].forEach(([b, sg]) => {
    b.hombro.rotation.x = lerp(b.hombro.rotation.x, ax, qa); b.hombro.rotation.z = lerp(b.hombro.rotation.z, sg * az, qa); b.codo.rotation.x = lerp(b.codo.rotation.x, cx, qa);
  });
}
function manos(hx, hz, g, qp, esc, y) { const ly = (2.2 * (1 - qp) + 1.5 * qp) * (esc || 1.06) / 1.06, lz = (0.3 * (1 - qp) + 0.62 * qp) * (esc || 1.06) / 1.06; return [hx + Math.sin(g) * lz, ly + (y || 0), hz + Math.cos(g) * lz]; }

// Medidas de las nóminas grandes (local: origen en el centro de la hoja) y de las columnas.
const HW = 1.2, HH = 1.7, YSS = 0.0, YIR = -0.25, YNE = -0.585, FW = 1.02, FH = 0.19, KC = 0.0015, RC = 0.4;
const NX = [-0.75, 0.75];

const X3 = (() => {
  const W = W3, T = W.T, S = W.S, objs = [];
  const grupo = () => { const g = new T.Group(); g.visible = false; S.add(g); objs.push(g); return g; };
  const mat = (c, o) => new T.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.55, metalness: 0.08 }, o || {}));
  const lienzo = (w, h, pintar) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); if (pintar) pintar(x, w, h);
    const tx = new T.CanvasTexture(c); tx.encoding = T.sRGBEncoding; tx.anisotropy = 4; return tx; };
  const haloTx = lienzo(256, 256, (x) => { const g = x.createRadialGradient(128, 128, 0, 128, 128, 128); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.3, 'rgba(255,255,255,.4)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 256, 256); });
  const basico = (tx, o) => new T.MeshBasicMaterial(Object.assign({ map: tx, toneMapped: false, transparent: true }, o || {}));
  const PXM = 400;   // píxeles por metro en las texturas de las hojas
  const yPx = (ly) => (HH / 2 - ly) * PXM;
  const tFont = (x, peso, tam) => { x.font = peso + ' ' + tam + 'px Inter, sans-serif'; };

  // ——— textura de una nómina grande ———
  function pintaHoja(tipo) {
    return lienzo(HW * PXM, HH * PXM, (x, w, h) => {
      x.fillStyle = '#f1f5f9'; x.fillRect(0, 0, w, h); x.strokeStyle = '#cbd5e1'; x.lineWidth = 10; x.strokeRect(5, 5, w - 10, h - 10);
      x.fillStyle = tipo === 'ext' ? '#0f766e' : '#1e293b'; x.fillRect(0, 0, w, 118);
      x.fillStyle = '#ffffff'; tFont(x, 900, 66); x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(tipo === 'ext' ? 'PAGA EXTRA' : 'NÓMINA', w / 2, 62);
      x.fillStyle = '#94a3b8'; x.font = '700 24px DejaVu Sans Mono, monospace'; x.fillText('EJEMPLO · 14 PAGAS', w / 2, 146);
      x.fillStyle = '#475569'; tFont(x, 800, 38); x.textAlign = 'left'; x.fillText('BRUTO', 40, 190);
      x.fillStyle = '#0f172a'; tFont(x, 900, 108); x.textAlign = 'center'; x.fillText('2.000 €', w / 2, 256);
      // Huecos de las franjas: debajo queda la marca del corte (línea discontinua).
      const hueco = (ly, txt, col) => { const y = yPx(ly), hh = FH * PXM; x.setLineDash([14, 10]); x.strokeStyle = '#cbd5e1'; x.lineWidth = 4; x.strokeRect((w - FW * PXM) / 2, y - hh / 2, FW * PXM, hh); x.setLineDash([]);
        if (txt) { x.fillStyle = col; tFont(x, 800, 36); x.textAlign = 'left'; x.fillText(txt[0], (w - FW * PXM) / 2 + 22, y + 2); x.textAlign = 'right'; tFont(x, 900, 44); x.fillText(txt[1], (w + FW * PXM) / 2 - 22, y + 2); } };
      hueco(YSS, tipo === 'ext' ? ['SEG. SOCIAL', '0 €'] : null, '#0d9488');
      hueco(YIR, null);
      x.fillStyle = '#475569'; tFont(x, 800, 34); x.textAlign = 'left'; x.fillText('NETO', 40, yPx(YNE) - 82);
    });
  }
  // Franja (SEG. SOCIAL / IRPF), placa de neto, ficha de 22 € y sello.
  function pintaFranja(t1, t2, bg, fg, w0, h0) { return lienzo(w0 || 816, h0 || 152, (x, w, h) => { x.fillStyle = bg; x.beginPath(); x.roundRect(4, 4, w - 8, h - 8, 22); x.fill();
    x.strokeStyle = 'rgba(255,255,255,.75)'; x.lineWidth = 6; x.beginPath(); x.roundRect(16, 16, w - 32, h - 32, 16); x.stroke();
    x.fillStyle = fg; x.textBaseline = 'middle'; tFont(x, 800, Math.round(h * 0.3)); x.textAlign = 'left'; x.fillText(t1, 40, h / 2 + 3); x.textAlign = 'right'; tFont(x, 900, Math.round(h * 0.42)); x.fillText(t2, w - 40, h / 2 + 4); }); }
  const TX = {
    nom: pintaHoja('nom'), ext: pintaHoja('ext'),
    ss: pintaFranja('SEG. SOCIAL', '−152 €', '#ef4444', '#ffffff'),
    ir: pintaFranja('IRPF 15 %', '−300 €', '#64748b', '#ffffff'),
    n0: pintaFranja('', '1.548 €', '#e2e8f0', '#0f172a', 816, 220),
    n1: pintaFranja('', '1.700 €', '#2dd4bf', '#05201c', 816, 220),
    chip: lienzo(256, 160, (x, w, h) => { x.fillStyle = '#ef4444'; x.beginPath(); x.roundRect(4, 4, w - 8, h - 8, 26); x.fill(); x.fillStyle = '#fff'; tFont(x, 900, 84); x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('22 €', w / 2, h / 2 + 5); }),
    sello: lienzo(640, 260, (x, w, h) => { x.strokeStyle = '#2dd4bf'; x.lineWidth = 16; x.beginPath(); x.roundRect(12, 12, w - 24, h - 24, 30); x.stroke(); x.lineWidth = 6; x.beginPath(); x.roundRect(34, 34, w - 68, h - 68, 18); x.stroke();
      x.fillStyle = '#2dd4bf'; tFont(x, 900, 92); x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('YA COTIZADA', w / 2, h / 2 + 6); })
  };
  const mPapel = mat(0xdfe5ec, { roughness: 0.75 });
  // ——— dos nóminas grandes: 0 = NÓMINA, 1 = PAGA EXTRA ———
  const geoH = new T.BoxGeometry(HW, HH, 0.035), geoF = new T.PlaneGeometry(FW, FH), geoN = new T.PlaneGeometry(FW, FW * 220 / 816), geoS = new T.PlaneGeometry(0.95, 0.95 * 260 / 640);
  const hojas = [0, 1].map(i => {
    const g = grupo();
    const m = new T.Mesh(geoH, [mPapel, mPapel, mPapel, mPapel, new T.MeshBasicMaterial({ map: i ? TX.ext : TX.nom, toneMapped: false }), mPapel]); m.castShadow = true; g.add(m);
    const ss = new T.Mesh(geoF, basico(TX.ss)); ss.position.set(0, YSS, 0.021); g.add(ss);
    const ir = new T.Mesh(geoF, basico(TX.ir)); ir.position.set(0, YIR, 0.022); g.add(ir);
    const ne = new T.Mesh(geoN, basico(i ? TX.n1 : TX.n0)); ne.position.set(0, YNE, 0.023); g.add(ne);
    const se = new T.Mesh(geoS, basico(TX.sello)); se.position.set(0, 0.05, 0.03); g.add(se);
    return { g, ss, ir, ne, se };
  });
  // o = { x, y, z, rx, ry, rz, esc, ss, ir (opacidad de la franja pegada; esc con ssE/irE), ne (0..1), se (0..1) }
  function hoja(i, o) {
    const h = hojas[i]; h.g.visible = true; h.g.position.set(o.x, o.y == null ? HH / 2 + 0.02 : o.y, o.z || 0); h.g.rotation.set(o.rx || 0, o.ry || 0, o.rz || 0); h.g.scale.setScalar(Math.max(0.001, o.esc || 1));
    [['ss', o.ss, o.ssE], ['ir', o.ir, o.irE]].forEach(([k, op, e]) => { const m = h[k]; op = op || 0; m.visible = op > 0.01 && !(i === 1 && k === 'ss' && !o.ssExtra); m.material.opacity = Math.min(1, op); m.scale.setScalar(e || 1); });
    const ne = o.ne || 0; h.ne.visible = ne > 0.01; h.ne.scale.setScalar(Math.max(0.001, ne));
    const se = o.se || 0; h.se.visible = se > 0.01; h.se.material.opacity = Math.min(1, se); h.se.scale.setScalar(1 + 1.2 * (1 - Math.min(1, se))); h.se.rotation.z = -0.18;
  }
  function ptHoja(i, lx, ly, lz) { hojas[i].g.updateMatrixWorld(true); return hojas[i].g.localToWorld(new T.Vector3(lx, ly, lz)); }
  // Trozos de una franja (4 por franja), cada uno con su parte de la textura; 4 geometrías (una por columna) y 16 mallas.
  const geoT = [0, 1, 2, 3].map(c => { const g = new T.PlaneGeometry(FW / 4, FH), uv = g.attributes.uv; for (let k = 0; k < uv.count; k++) uv.setX(k, (c + uv.getX(k)) / 4); return g; });
  const trozos = Array.from({ length: 16 }, (_, j) => { const m = new T.Mesh(geoT[j % 4], basico(TX.ss, { side: T.DoubleSide })); m.castShadow = true; m.visible = false; S.add(m); return m; });
  function trozo(j, tx, o) { const m = trozos[j], op = o.op == null ? 1 : o.op; m.visible = op > 0.01; if (!m.visible) return;
    if (m.material.map !== TX[tx]) { m.material.map = TX[tx]; m.material.needsUpdate = true; }
    m.position.set(o.x, o.y, o.z); m.rotation.set(o.rx || 0, o.ry || 0, o.rz || 0); m.scale.setScalar(o.esc || 1); m.material.opacity = op; }
  // Franjas sueltas que vuelan (enteras).
  const vuel = Array.from({ length: 4 }, () => { const m = new T.Mesh(geoF, basico(TX.ss, { side: T.DoubleSide })); m.visible = false; m.castShadow = true; S.add(m); return m; });
  function vuela(j, tx, o) { const m = vuel[j], op = o.op == null ? 1 : o.op; m.visible = op > 0.01; if (!m.visible) return;
    if (m.material.map !== TX[tx]) { m.material.map = TX[tx]; m.material.needsUpdate = true; }
    m.position.set(o.x, o.y, o.z); m.rotation.set(o.rx || 0, o.ry || 0, o.rz || 0); m.scale.setScalar(Math.max(0.001, o.esc || 1)); m.material.opacity = op; }

  // ——— columnas de lo que te queda (cuerpo + remate; con anillos de moneda) ———
  const geoC = new T.CylinderGeometry(RC, RC, 1, 40); geoC.translate(0, 0.5, 0);
  const geoAn = new T.TorusGeometry(RC + 0.005, 0.012, 6, 40); geoAn.rotateX(PI / 2);
  const cols = [0, 1].map(() => { const g = grupo(); const cu = new T.Mesh(geoC, mat(GRISC, { metalness: 0.35, roughness: 0.35 })); cu.castShadow = true; g.add(cu);
    const re = new T.Mesh(geoC, mat(TURQH, { emissive: TURQH, emissiveIntensity: 0.5, metalness: 0.3, roughness: 0.35 })); re.castShadow = true; g.add(re);
    const an = Array.from({ length: 24 }, () => { const a = new T.Mesh(geoAn, mat(0x94a3b8, { metalness: 0.5, roughness: 0.3 })); g.add(a); return a; }); return { g, cu, re, an }; });
  // o = { x, z, h (cuerpo), top (alto del remate), topColor, topBrillo }
  function columna(i, o) { const c = cols[i]; c.g.visible = o.h > 0.003; if (!c.g.visible) return; c.g.position.set(o.x, 0, o.z);
    c.cu.scale.set(1, o.h, 1); c.cu.material.color.set(o.color == null ? GRISC : o.color);
    const tp = o.top || 0; c.re.visible = tp > 0.003; c.re.position.y = o.h; c.re.scale.set(1, Math.max(0.001, tp), 1);
    c.re.material.color.set(o.topColor == null ? TURQH : o.topColor); c.re.material.emissive.set(o.topColor == null ? TURQH : o.topColor); c.re.material.emissiveIntensity = o.topBrillo == null ? 0.5 : o.topBrillo;
    c.an.forEach((a, k) => { const y = 0.1 * (k + 1); a.visible = y < o.h - 0.02; a.position.y = y; }); }
  // Lonchas del remate que se van (12).
  const geoL = new T.CylinderGeometry(RC, RC, 1, 32);
  const lonchas = Array.from({ length: 12 }, () => { const m = new T.Mesh(geoL, mat(ROJOH, { emissive: ROJOH, emissiveIntensity: 0.5 })); m.visible = false; m.castShadow = true; S.add(m); return m; });
  function loncha(j, o) { const m = lonchas[j]; m.visible = (o.op == null ? 1 : o.op) > 0.01; if (!m.visible) return; m.position.set(o.x, o.y, o.z); m.rotation.set(o.rx || 0, 0, o.rz || 0); m.scale.set(o.esc || 1, o.h, o.esc || 1); m.material.color.set(o.color || ROJOH); m.material.emissive.set(o.color || ROJOH); }

  // ——— doce nóminas pequeñas (con su mes) y dos pagas extra medianas ———
  const MESES = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
  const pintaMini = (txt, sub, bg) => lienzo(330, 450, (x, w, h) => { x.fillStyle = '#f1f5f9'; x.fillRect(0, 0, w, h); x.strokeStyle = '#cbd5e1'; x.lineWidth = 8; x.strokeRect(4, 4, w - 8, h - 8);
    x.fillStyle = bg; x.fillRect(0, 0, w, 120); x.fillStyle = '#fff'; tFont(x, 900, txt.length > 4 ? 52 : 84); x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(txt, w / 2, 64);
    x.fillStyle = '#475569'; tFont(x, 800, 34); x.fillText(sub, w / 2, 190); x.fillStyle = '#0f172a'; tFont(x, 900, 72); x.fillText('2.000 €', w / 2, 270);
    x.fillStyle = '#cbd5e1'; for (let k = 0; k < 3; k++) x.fillRect(40, 330 + k * 34, w - 80, 8); });
  const geoMini = new T.BoxGeometry(0.5, 0.68, 0.025), geoBl = new T.BoxGeometry(0.42, 1, 0.26), geoChip = new T.PlaneGeometry(0.34, 0.21);
  const minis = MESES.map((mes) => { const g = grupo(); const m = new T.Mesh(geoMini, [mPapel, mPapel, mPapel, mPapel, new T.MeshBasicMaterial({ map: pintaMini(mes, 'BRUTO', '#1e293b'), toneMapped: false }), mPapel]); m.castShadow = true; m.position.y = 0.36; g.add(m);
    const bl = new T.Mesh(geoBl, mat(GRISC)); bl.castShadow = true; g.add(bl); const am = new T.Mesh(geoBl, mat(AMBH, { emissive: AMBH, emissiveIntensity: 0.45 })); am.castShadow = true; g.add(am); return { g, bl, am }; });
  const KB = 0.0005;
  // o = { x, z, ry, esc, bl (0..1 alto del bloque de 2.000), am (0..1 loncha de 333), amY (caída) }
  function mini(i, o) { const n = minis[i]; n.g.visible = (o.esc == null ? 1 : o.esc) > 0.01; if (!n.g.visible) return; n.g.position.set(o.x, 0, o.z); n.g.rotation.y = o.ry || 0; n.g.scale.setScalar(Math.max(0.001, o.esc == null ? 1 : o.esc));
    const hb = 2000 * KB * (o.bl || 0); n.bl.visible = hb > 0.005; n.bl.scale.y = Math.max(0.001, hb); n.bl.position.y = 0.72 + hb / 2;
    const ha = 333.33 * KB; n.am.visible = (o.am || 0) > 0.01; n.am.scale.set(1, ha, 1); n.am.position.y = 0.72 + hb + ha / 2 + (o.amY || 0); }
  function ptMini(i, ly) { minis[i].g.updateMatrixWorld(true); return minis[i].g.localToWorld(new T.Vector3(0, ly, 0.14)); }
  const geoMed = new T.BoxGeometry(0.72, 0.98, 0.03);
  const extras = ['PAGA EXTRA', 'PAGA EXTRA'].map((t_, i) => { const g = grupo(); const m = new T.Mesh(geoMed, [mPapel, mPapel, mPapel, mPapel, new T.MeshBasicMaterial({ map: pintaMini(i ? 'EXTRA DIC' : 'EXTRA JUN', 'BRUTO', '#0f766e'), toneMapped: false }), mPapel]);
    m.castShadow = true; m.position.y = 0.5; g.add(m); return g; });
  function extraMed(i, o) { const g = extras[i]; g.visible = true; g.position.set(o.x, 0, o.z); g.rotation.y = o.ry || 0; g.scale.setScalar(Math.max(0.001, o.esc || 1)); }
  const chips = Array.from({ length: 12 }, () => { const m = new T.Mesh(geoChip, basico(TX.chip, { side: T.DoubleSide })); m.visible = false; S.add(m); return m; });
  function chip(j, o) { const m = chips[j]; m.visible = (o.op == null ? 1 : o.op) > 0.01; if (!m.visible) return; m.position.set(o.x, o.y, o.z); m.rotation.set(o.rx || 0, o.ry || 0, o.rz || 0); m.scale.setScalar(Math.max(0.001, o.esc || 1)); }

  // ——— barrera turquesa ———
  const barG = grupo();
  const mBar = new T.MeshBasicMaterial({ color: 0x2dd4bf, transparent: true, opacity: 0.2, depthWrite: false, side: T.DoubleSide });
  barG.add(new T.Mesh(new T.PlaneGeometry(1.4, 0.9), mBar));
  const mBarB = mat(TURQH, { emissive: TURQH, emissiveIntensity: 0.8 });
  [[0, 0.45, 1.44, 0.04], [0, -0.45, 1.44, 0.04], [-0.7, 0, 0.04, 0.94], [0.7, 0, 0.04, 0.94]].forEach(([x, y, w, h]) => { const p = new T.Mesh(new T.BoxGeometry(w, h, 0.04), mBarB); p.position.set(x, y, 0); barG.add(p); });
  function barrera(o) { barG.visible = true; barG.position.set(o.x, o.y, o.z); barG.scale.setScalar(Math.max(0.001, o.esc || 1)); mBar.opacity = 0.2 + 0.3 * (o.flash || 0); }

  // ——— nómina en la mano (base de cotización), con el recuadro ámbar que se enciende ———
  const pintaMia = (luz) => lienzo(500, 700, (x, w, h) => { x.fillStyle = '#f8fafc'; x.fillRect(0, 0, w, h); x.fillStyle = '#1e293b'; x.fillRect(0, 0, w, 96);
    x.fillStyle = '#fff'; tFont(x, 900, 56); x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('TU NÓMINA', w / 2, 50);
    x.fillStyle = '#94a3b8'; x.font = '700 22px DejaVu Sans Mono, monospace'; x.fillText('EJEMPLO', w / 2, 122);
    x.textAlign = 'left'; x.fillStyle = '#475569'; tFont(x, 800, 34); x.fillText('BRUTO', 34, 186); x.textAlign = 'right'; x.fillStyle = '#0f172a'; tFont(x, 900, 46); x.fillText('2.000,00', w - 34, 188);
    x.fillStyle = '#cbd5e1'; for (let k = 0; k < 3; k++) x.fillRect(34, 236 + k * 30, w - 68, 7);
    if (luz) { x.fillStyle = 'rgba(245,185,74,.28)'; x.fillRect(16, 352, w - 32, 190); x.strokeStyle = '#f5b94a'; x.lineWidth = 9; x.strokeRect(16, 352, w - 32, 190); }
    x.textAlign = 'left'; x.fillStyle = '#475569'; tFont(x, 800, 32); x.fillText('BASE DE COTIZACIÓN', 34, 398);
    x.textAlign = 'right'; x.fillStyle = luz ? '#b45309' : '#0f172a'; tFont(x, 900, 78); x.fillText('2.333,33', w - 34, 482);
    x.fillStyle = '#cbd5e1'; for (let k = 0; k < 3; k++) x.fillRect(34, 590 + k * 30, w - 68, 7); });
  const TXM = [pintaMia(false), pintaMia(true)];
  const miaG = grupo();
  const miaM = new T.Mesh(new T.PlaneGeometry(0.5, 0.7), new T.MeshBasicMaterial({ map: TXM[0], toneMapped: false, side: T.DoubleSide })); miaM.castShadow = true; miaG.add(miaM);
  function mia(o) { miaG.visible = true; miaG.position.set(o.x, o.y, o.z); miaG.rotation.set(o.rx || 0, o.ry || 0, o.rz || 0); miaG.scale.setScalar(Math.max(0.001, o.esc || 1));
    const tx = TXM[o.luz ? 1 : 0]; if (miaM.material.map !== tx) { miaM.material.map = tx; miaM.material.needsUpdate = true; } }

  // ——— halos ———
  const halos = Array.from({ length: 6 }, () => { const s = new T.Sprite(new T.SpriteMaterial({ map: haloTx, color: 0xffd166, blending: T.AdditiveBlending, depthWrite: false, transparent: true })); s.visible = false; S.add(s); return s; });
  function halo(i, o) { const s = halos[i]; s.visible = (o.op || 0) > 0.01; s.position.set(o.x, o.y, o.z); s.scale.setScalar(o.esc || 1); s.material.opacity = Math.min(1, o.op || 0); s.material.color.set(o.color || 0xffd166); }

  function apagar() { objs.forEach(g => { g.visible = false; }); [trozos, vuel, lonchas, chips, halos].forEach(a => a.forEach(m => { m.visible = false; })); }
  return { hoja, ptHoja, trozo, vuela, columna, loncha, mini, ptMini, extraMed, chip, barrera, mia, halo, apagar };
})();
W3.X = X3;

// Trozo c (0..3) de una franja que se arranca: sale de P0 d s después; cae girando y se queda en el suelo.
function trozoVuelo(j, P0, d, lado) {
  const c = j % 4, vx = (c - 1.5) * 0.9 + (lado || 0) * 0.9 + 0.15 * Math.sin(j * 2.3), vy = 1.6 + 0.5 * Math.sin(j * 1.7 + 1), vz = 1.6 + 0.7 * ((j * 0.618) % 1), g = 9.8;
  const tl = (vy + Math.sqrt(vy * vy + 2 * g * Math.max(0.01, P0.y - 0.02))) / g;
  if (d < tl) return { x: P0.x + vx * d, y: P0.y + vy * d - 0.5 * g * d * d, z: P0.z + vz * d, rx: d * (6 + j), ry: d * (3 + 0.7 * j), rz: d * (4 + j * 0.5) };
  const r2 = Math.min(1, (d - tl) * 4), sl = 0.12 * (1 - (1 - r2) * (1 - r2));
  return { x: P0.x + vx * (tl + sl), y: 0.02, z: P0.z + vz * (tl + sl), rx: -PI / 2, ry: 0, rz: j * 0.8 };
}
// Arranca la franja k ('ss' o 'ir', en YSS o YIR) de la hoja i en el instante tA (trozos j0..j0+3).
function arranca(X, i, tx, ly, s, tA, j0, lado) {
  if (s < tA) return;
  for (let c = 0; c < 4; c++) { const P0 = X.ptHoja(i, -FW / 2 + FW / 8 + c * FW / 4, ly, 0.03); X.trozo(j0 + c, tx, trozoVuelo(j0 + c, P0, s - tA, lado)); }
}
// Nóminas cayendo en el gancho (tau < 0.5) y quietas después; un balanceo leve las mantiene vivas.
const TL = 0.5;
function caida(i, tau) {
  const u = tramo(tau, -0.9, TL), e_ = u * u, sg = i ? 1 : -1, rb = tau > TL ? Math.exp(-6 * (tau - TL)) * Math.sin(16 * (tau - TL)) : 0;
  return { x: NX[i] + sg * 0.35 * (1 - e_), y: HH / 2 + 0.02 + 3.4 * (1 - e_) + 0.05 * Math.abs(rb), z: 0, rx: 0.5 * (1 - e_) * (i ? 1 : -0.7) + 0.05 * rb,
    ry: (i ? -1 : 1) * (1.3 * (1 - e_) + 0.05) + 0.03 * Math.sin(1.2 * tau + i), rz: sg * 0.6 * (1 - e_) + 0.04 * rb };
}
const T0 = { SS: 0.58, IR: 1.15, C0: 1.45, C1: 1.85, TOP: 2.25 };
function gancho(W, X, tau, mP, Dv) {
  const h0 = caida(0, tau), h1 = caida(1, tau);
  const ssOn = tau < T0.SS ? 1 : 0, irOn = tau < T0.IR ? 1 : 0;
  // La franja roja tiembla justo antes de arrancarse.
  const tiem = tau > 0.42 && tau < T0.SS ? 1 + 0.06 * Math.sin(tau * 70) : 1;
  const ne0 = qq(tau, T0.C0 + 0.1, 0.35), ne1 = qq(tau, T0.C1 + 0.1, 0.35);
  X.hoja(0, Object.assign({}, h0, { ss: ssOn, ssE: tiem, ir: irOn, ne: ne0 }));
  X.hoja(1, Object.assign({}, h1, { ss: 0, ir: irOn, ne: ne1 }));
  arranca(X, 0, 'ss', YSS, tau, T0.SS, 0, -0.6);
  arranca(X, 0, 'ir', YIR, tau, T0.IR, 4, -0.4); arranca(X, 1, 'ir', YIR, tau, T0.IR, 8, 0.4);
  if (tau > T0.SS && tau < T0.SS + 0.4) { const u = tramo(tau, T0.SS, T0.SS + 0.4), P = X.ptHoja(0, 0, YSS, 0.05); X.halo(0, { x: P.x, y: P.y, z: P.z, esc: 0.5 + 2.4 * sale(u), op: 0.95 * (1 - u), color: 0xff6b6b }); }
  if (tau > TL && tau < TL + 0.35) { const u = tramo(tau, TL, TL + 0.35); X.halo(1, { x: 0, y: 0.1, z: 0.3, esc: 1 + 3.5 * sale(u), op: 0.5 * (1 - u), color: 0xcbd5e1 }); }
  // Columnas de lo que queda, detrás de cada hoja: 1.548 (gris) y 1.700 (la de la extra con el remate turquesa de 152).
  const z = -0.62, hN = D.NOM * 0.0015, hE = D.NOM * 0.0015, top = (D.EXT - D.NOM) * 0.0015;
  const g0 = sale(tramo(tau, T0.C0, T0.C0 + 0.5)), g1 = sale(tramo(tau, T0.C1, T0.C1 + 0.5)), gt = rebote(tramo(tau, T0.TOP, T0.TOP + 0.35));
  const pop = mP != null && tau > mP ? 1 + 0.25 * Math.sin(tramo(tau, mP, mP + 0.3) * PI) : 1;
  X.columna(0, { x: NX[0], z, h: hN * g0 });
  X.columna(1, { x: NX[1], z, h: hE * g1, top: top * gt * pop, topBrillo: 0.5 + 0.5 * Math.sin(tramo(tau, T0.TOP, T0.TOP + 0.6) * PI) });
  W.rotulo('c0', '1.548 €', NX[0], hN + 0.32, z, qq(tau, T0.C0 + 0.35, 0.3), '#cbd5e1', 0.3);
  W.rotulo('c1', '1.700 €', NX[1], hE + top + 0.32, z, qq(tau, T0.C1 + 0.35, 0.3), '#5eead4', 0.3);
  if (tau > T0.TOP && tau < T0.TOP + 0.5) { const u = tramo(tau, T0.TOP, T0.TOP + 0.5); X.halo(2, { x: NX[1], y: hE + top, z, esc: 0.6 + 2.6 * sale(u), op: 0.9 * (1 - u), color: 0x5eead4 }); }
  // Cámara: baja en giro mientras caen; frena con un golpe al aterrizar; empuja a la NÓMINA (franja roja); latigazo a la extra
  // (IRPF a las dos); se abre para las columnas; deriva lenta.
  const K = [
    [-0.9, [2.4, 6.2, 8.8, 0.1, 2.4, 0]],
    [0.0, [1.2, 3.6, 7.0, 0.0, 1.7, 0]],
    [TL, [0.15, 2.0, 5.9, 0.0, 1.15, 0]],
    [0.85, [-0.45, 1.6, 4.7, -0.45, 1.05, 0]],
    [1.12, [-0.15, 1.55, 4.8, -0.1, 1.0, 0]],
    [1.4, [0.7, 1.7, 5.1, 0.15, 1.0, 0]],
    [1.95, [-0.6, 2.4, 6.6, 0.0, 1.55, -0.3]],
    [2.6, [0.5, 2.7, 6.4, 0.25, 1.9, -0.4]],
    [Math.max(Dv, 3.4), [1.0, 2.55, 6.1, 0.35, 1.85, -0.4]]
  ];
  const C = ruta(K, tau).slice();
  const sh = tau > TL && tau < TL + 0.3 ? 0.06 * Math.exp(-(tau - TL) * 12) : 0;
  C[0] += sh * Math.sin(tau * 83); C[1] += sh * Math.cos(tau * 71);
  camR(W, C, 0.14 * (1 - suave(tramo(tau, -0.4, TL))));
}

// ——— escena 1 · «En España, §la paga extra no lleva Seguridad Social. §Solo §{ding}IRPF, al mismo tipo que cada mes» ———
function esc1(W, X, s, Dv, mk, res) {
  const m0 = mk(0, 0.8), m1 = mk(1, 2.9), m2 = mk(2, 3.3), tHit = Math.max(m0 + 0.55, res[0] ? res[0].ini + 0.35 : m0 + 0.6);
  const ir = s >= m2 ? 1 : 0, irE = s >= m2 ? 1 + 0.5 * (1 - sale(tramo(s, m2, m2 + 0.25))) : 1;
  X.hoja(0, { x: NX[0], ry: 0.03 * Math.sin(s * 1.1), ss: 1, ir, irE });
  X.hoja(1, { x: NX[1], ry: -0.03 * Math.sin(s * 1.2), ss: 0, ir, irE });
  if (s > m2 && s < m2 + 0.45) { const u = tramo(s, m2, m2 + 0.45); [0, 1].forEach(i => { const P = X.ptHoja(i, 0, YIR, 0.05); X.halo(i, { x: P.x, y: P.y, z: P.z, esc: 0.5 + 2.2 * sale(u), op: 0.85 * (1 - u), color: 0xcbd5e1 }); }); }
  // Un bloque rojo «SEG. SOCIAL» baja hacia la extra, choca con la barrera turquesa, rebota y cae.
  const P = X.ptHoja(1, 0, YSS, 0.05), zB = 0.45, t0 = m0 - 0.1;
  if (s > t0) {
    let p, rx = 0, rz = 0;
    if (s < tHit) { const u = tramo(s, t0, tHit); p = mezcla([P.x + 0.6, P.y + 1.9, zB + 1.0], [P.x, P.y, zB + 0.05], u * u); rz = 0.5 * (1 - u); }
    else { const d = s - tHit, y = P.y + 1.4 * d - 4.9 * d * d; p = [P.x + 0.5 * d, Math.max(0.02, y), zB + 0.1 + Math.min(1.2 * d, 1.1)]; rx = y > 0.02 ? -7 * d : -PI / 2; rz = 3 * d; }
    X.vuela(0, 'ss', { x: p[0], y: p[1], z: p[2], rx, rz, esc: 1.15 });
  }
  if (s > tHit - 0.35) { const u = tramo(s, tHit - 0.35, tHit - 0.05); X.barrera({ x: P.x, y: P.y + 0.1 + 1.6 * Math.pow(1 - u, 2), z: zB, flash: s > tHit ? Math.exp(-(s - tHit) * 5) : 0 }); }
  if (s > tHit && s < tHit + 0.45) { const u = tramo(s, tHit, tHit + 0.45); X.halo(3, { x: P.x, y: P.y, z: zB, esc: 0.5 + 2.6 * sale(u), op: 0.9 * (1 - u), color: 0x5eead4 }); }
  const K = [[0, [1.6, 1.25, 2.6, 0.75, 1.0, 0]], [tHit, [1.3, 1.35, 3.1, 0.7, 1.0, 0]], [m1 + 0.1, [-0.3, 1.8, 5.6, 0.0, 1.1, 0]], [Math.max(Dv, m1 + 0.6), [0.35, 2.0, 5.5, 0.0, 1.1, 0]]];
  camR(W, ruta(K, s));
}

// ——— escena 2 · «Con 2.000 brutos, catorce pagas y un 15 % de retención, §tu nómina se queda en 1.548 euros. §{caja}La extra, en 1.700» ———
function esc2(W, X, s, Dv, mk, res) {
  const m0 = mk(0, 3.4), m1 = mk(1, 5.2), tI = 0.9, tS = 1.6;
  X.hoja(0, { x: NX[0], ss: s < tS ? 1 : 0, ir: s < tI ? 1 : 0, ne: qq(s, m0 - 0.1, 0.35) });
  X.hoja(1, { x: NX[1], ss: 0, ir: s < tI ? 1 : 0, ne: qq(s, m1 - 0.1, 0.35) });
  arranca(X, 0, 'ir', YIR, s, tI, 4, -0.4); arranca(X, 1, 'ir', YIR, s, tI, 8, 0.4); arranca(X, 0, 'ss', YSS, s, tS, 0, -0.6);
  const z = -0.62, hN = D.NOM * 0.0015, top = (D.EXT - D.NOM) * 0.0015;
  const g0 = sale(tramo(s, m0 - 0.15, m0 + 0.5)), g1 = sale(tramo(s, m1 - 0.15, m1 + 0.5)), gt = rebote(tramo(s, m1 + 0.4, m1 + 0.75));
  X.columna(0, { x: NX[0], z, h: hN * g0 });
  X.columna(1, { x: NX[1], z, h: hN * g1, top: top * gt, topBrillo: 0.6 + 0.4 * Math.sin(s * 5) });
  W.rotulo('c0', '1.548 €', NX[0], hN + 0.32, z, qq(s, m0 + 0.3, 0.3), '#cbd5e1', 0.3);
  W.rotulo('c1', '1.700 €', NX[1], hN + top + 0.32, z, qq(s, m1 + 0.3, 0.3), '#5eead4', 0.3);
  // Las fichas de 2.000 / 14 / 15 % (a la izquierda) entran mientras dice los datos del ejemplo.
  W.rotulo('d1', '2.000 € BRUTOS', -2.0, 2.3, -0.2, qq(s, 0.15, 0.3) * (1 - tramo(s, m0 - 0.4, m0 - 0.1)), '#cbd5e1', 0.27);
  W.rotulo('d2', '14 PAGAS', -2.0, 1.85, -0.2, qq(s, 0.6, 0.3) * (1 - tramo(s, m0 - 0.4, m0 - 0.1)), '#cbd5e1', 0.27);
  W.rotulo('d3', 'IRPF 15 %', -2.0, 1.4, -0.2, qq(s, 1.1, 0.3) * (1 - tramo(s, m0 - 0.4, m0 - 0.1)), '#cbd5e1', 0.27);
  const K = [[0, [-2.9, 1.8, 4.9, -1.5, 1.65, -0.3]], [m0 - 0.5, [-2.2, 1.4, 4.5, -0.9, 1.5, -0.4]], [m0 + 0.4, [-1.6, 1.15, 4.4, -0.6, 1.7, -0.5]],
    [m1 + 0.3, [1.7, 1.15, 4.4, 0.6, 1.8, -0.5]], [Math.max(Dv, m1 + 1.0), [0.9, 2.3, 6.3, 0.15, 1.8, -0.4]]];
  camR(W, ruta(K, s));
}

// ——— escena 3 · «¿Te libras de pagarla? §{tic}No: ya la has pagado, a plazos» ———
function esc3(W, X, s, Dv, mk, res) {
  const m0 = mk(0, 1.3);
  X.hoja(0, { x: NX[0], ne: 1 }); X.hoja(1, { x: NX[1], ne: 1 });
  const z = -0.62, hN = D.NOM * 0.0015, top = (D.EXT - D.NOM) * 0.0015;
  X.columna(0, { x: NX[0], z, h: hN });
  const rojo = s > m0 - 0.05, pre = tramo(s, 0.2, m0);
  X.columna(1, { x: NX[1], z, h: hN, top: rojo ? 0 : top * (1 + 0.08 * pre * Math.sin(s * 40)), topColor: TURQH, topBrillo: 0.5 + 0.5 * pre });
  // En el tic el remate se parte en 12 lonchas rojas que vuelan hacia atrás (a los meses).
  if (rojo) for (let j = 0; j < 12; j++) { const d = Math.max(0, s - m0 - 0.12 - 0.035 * j), hl = top / 12, y0 = hN + hl * (j + 0.5);
    const u = sale(Math.min(1, d / 0.9)); X.loncha(j, { x: NX[1] + 0.25 * Math.sin(j * 1.9) * u, y: y0 + 1.6 * u + 0.12 * j * u, z: z - 6 * u * u, h: hl * 0.85, rx: 0.8 * u * Math.sin(j), rz: 0.6 * u * Math.cos(j), color: ROJOH, op: 1 - tramo(d, 0.7, 0.9) }); }
  if (s > m0 && s < m0 + 0.45) { const u = tramo(s, m0, m0 + 0.45); X.halo(0, { x: NX[1], y: hN + top / 2, z, esc: 0.6 + 2.5 * sale(u), op: 0.9 * (1 - u), color: 0xff6b6b }); }
  W.rotulo('c1q', '+152 €', NX[1], hN + top + 0.32, z, (1 - tramo(s, m0 - 0.1, m0 + 0.1)), '#5eead4', 0.3);
  W.rotulo('c0', '1.548 €', NX[0], hN + 0.32, z, 1, '#cbd5e1', 0.3);
  // El maniquí entra por la izquierda y mira el remate.
  const hx = lerp(-2.6, -0.05, sale(tramo(s, 0, 0.9))), hz = 1.35, gM = Math.atan2(NX[1] - hx, z - hz);
  W.heroe({ x: hx, z: hz, gira: angulo(PI / 2, gM, suave(tramo(s, 0.6, 1.0))), amp: 1 - tramo(s, 0.7, 0.95), fase: s * 8, brazos: 0.25 * qq(s, m0 + 0.1, 0.3) });
  const K = [[0, [-1.6, 1.5, 4.4, 0.2, 2.0, -0.4]], [m0 - 0.1, [0.15, 2.0, 3.3, 0.75, 2.45, -0.6]], [m0 + 0.3, [0.25, 2.15, 3.1, 0.75, 2.55, -0.6]],
    [Math.max(Dv, m0 + 1.1), [0.8, 3.6, 6.2, 0.6, 2.2, -2.2]]];
  camR(W, ruta(K, s));
}

// ——— escena 4 · «La ley reparte tus dos pagas extra §entre los doce meses: §cada nómina cotiza por 2.333 euros, no por 2.000. §Son 22 euros al mes que pagas por adelantado» ———
const ARC = { R: 2.7, A: 1.32, Z0: 0.9 };
const posMes = (i) => { const a = -ARC.A + 2 * ARC.A * i / 11; return { x: ARC.R * Math.sin(a), z: ARC.Z0 - ARC.R * Math.cos(a), ry: -a }; };
const EXX = [-0.55, 0.55], EXZ = 0.25;
function esc4(W, X, s, Dv, mk, res) {
  const m0 = mk(0, 1.5), m1 = mk(1, 2.8), m2 = mk(2, 5.6);
  for (let i = 0; i < 12; i++) {
    const p = posMes(i), ta = -0.3 + (m0 + 0.6) * i / 11, tb = m1 + 0.05 * i, tc = m2 + 0.12 * i;
    const amY = 1.2 * Math.pow(1 - sale(tramo(s, tb, tb + 0.35)), 2);
    X.mini(i, { x: p.x, z: p.z, ry: p.ry, esc: rebote(tramo(s, ta, ta + 0.3)), bl: sale(tramo(s, ta + 0.1, ta + 0.5)), am: s > tb ? 1 : 0, amY });
    // De cada loncha sale una ficha roja de 22 € que vuela a una de las dos pagas extra y se apila delante.
    if (s > tc) { const d = s - tc, u = suave(Math.min(1, d / 0.75)), A = X.ptMini(i, 0.72 + 1.0 + 0.0833), k = i % 2, n = Math.floor(i / 2);
      const Bp = [EXX[k] + (n % 2 ? 0.17 : -0.17), 0.75 - 0.23 * Math.floor(n / 2), EXZ + 0.035], q = mezcla([A.x, A.y, A.z], Bp, u); q[1] += 0.9 * Math.sin(u * PI);
      X.chip(i, { x: q[0], y: q[1], z: q[2], ry: (1 - u) * p.ry + u * 0, rz: 0.4 * Math.sin(u * PI) * (k ? 1 : -1), esc: 1 - 0.25 * u }); }
  }
  [0, 1].forEach(k => X.extraMed(k, { x: EXX[k], z: EXZ, ry: 0, esc: rebote(tramo(s, m0 - 0.3, m0 + 0.1)) }));
  const lab = qq(s, m1 + 0.35, 0.3) * (1 - tramo(s, m2 - 0.25, m2));
  [0, 5, 11].forEach(i => { const p = posMes(i); W.rotulo('b' + i, '2.333 €', p.x, 0.72 + 1.0 + 0.167 + 0.3, p.z, lab, '#f5b94a', 0.24); });
  const ca = qq(s, m2 + 0.4, 0.3);
  if (s > m2 + 0.8) [0, 1].forEach(k => X.halo(k, { x: EXX[k], y: 0.6, z: EXZ, esc: 2.2, op: 0.35 * ca * (0.8 + 0.2 * Math.sin(s * 6)), color: 0xff6b6b }));
  const K = [[0, [-0.9, 2.5, 4.4, -1.9, 1.0, -0.7]], [m0, [0.0, 2.7, 4.6, -0.2, 1.0, -1.4]], [m0 + 0.8, [0.9, 2.6, 4.4, 1.8, 1.05, -0.8]],
    [m1 + 0.2, [0.6, 3.2, 4.9, 1.2, 1.4, -1.2]], [m2 - 0.1, [0.0, 7.2, 6.2, 0.0, 0.7, -0.6]], [m2 + 1.1, [0.0, 3.6, 3.9, 0.0, 0.75, 0.0]], [Math.max(Dv, m2 + 1.8), [0.3, 3.3, 3.6, 0.0, 0.75, 0.0]]];
  camR(W, ruta(K, s));
}

// ——— escena 5 · «Mira hoy tu nómina §y busca la base de cotización: §si supera tu bruto, ahí están tus pagas extra. §{pop}La extra no es un regalo: ya la cotizaste» ———
const G5 = { HX: -1.1, HZ: 1.5, X0: 0.15, X1: 1.65, Z: -0.95 };
function esc5(W, X, s, Dv, mk, res) {
  const m0 = mk(0, 1.0), m1 = mk(1, 2.6), m2 = mk(2, 4.6);
  const gT = Math.atan2((G5.X0 + G5.X1) / 2 - G5.HX, G5.Z - G5.HZ);
  W.heroe({ x: G5.HX, z: G5.HZ, gira: gT, luz: qq(s, 0.05, 0.5) });
  const qp = 0.25 + 0.15 * (1 - suave(tramo(s, 0, 0.6))); brazos(W.H, 1, qp);
  const mp = manos(G5.HX, G5.HZ, gT, qp, 1.06, 0);
  X.mia({ x: mp[0], y: mp[1] + 0.12, z: mp[2], ry: gT + PI, rx: 0.1, luz: s > m0 + 0.15 });
  if (s > m0 + 0.15 && s < m0 + 0.6) { const u = tramo(s, m0 + 0.15, m0 + 0.6); X.halo(0, { x: mp[0], y: mp[1] + 0.05, z: mp[2], esc: 0.5 + 1.8 * sale(u), op: 0.8 * (1 - u), color: 0xffc35a }); }
  X.hoja(0, { x: G5.X0, z: G5.Z, ry: -0.15, ne: 1 });
  const se = s > m2 ? 1 - Math.pow(1 - tramo(s, m2, m2 + 0.22), 2) : 0;
  X.hoja(1, { x: G5.X1, z: G5.Z, ry: -0.25, ne: 1, se });
  if (s > m2 + 0.15 && s < m2 + 0.6) { const u = tramo(s, m2 + 0.15, m2 + 0.6), P = X.ptHoja(1, 0, 0.05, 0.05); X.halo(1, { x: P.x, y: P.y, z: P.z, esc: 0.6 + 2.8 * sale(u), op: 0.9 * (1 - u), color: 0x5eead4 }); }
  const O2 = [-1.75, 2.85, 2.5, -0.8, 2.0, 1.15], GW = [-0.6, 2.4, 5.4, 0.7, 1.35, -0.6], tO = m1 - 0.3, tW = m1 + 0.5;
  const K = [[0, [-2.0, 2.78, 2.75, -0.85, 2.0, 1.2]], [tO, O2]];
  const K2 = [[tW, GW], [m2, [0.3, 1.9, 4.4, 1.2, 1.2, -0.8]], [Math.max(Dv - 0.8, m2 + 0.6), [0.8, 1.75, 3.9, 1.5, 1.15, -0.9]]];
  camR(W, s < tO ? ruta(K, s) : paso(O2, GW, s, tO, tW) || rutas([K2], s));
}
`;

// Capa 2D: rótulos de 2–4 palabras en el tercio central-bajo (y ≈ 1.300 px).
const nota = (txt) => `<div class="nota">${txt}</div>`;
const rt = (cls, txt, top) => `<div class="rt ${cls}" data-t="translateX(-50%)"${top ? ` style="top:${top}px"` : ''}>${txt}</div>`;
const ESCENAS = [
  // 0 · Gancho: MISMO BRUTO → A LA NÓMINA: −152 € → +152 € EN LA EXTRA.
  { html: () => rt('', 'MISMO BRUTO: 2.000 €', 1450) + rt('roja', 'SEG. SOCIAL: <span class="r">−152 €</span>', 1450) + rt('turq', '<span class="t">+152 €</span> EN LA EXTRA', 1450),
    anim: function (s, e, el) { const r = el.querySelectorAll('.rt'); ver(r[0], s, -1, 0.62); ver(r[1], s, 0.62, 2.2); ver(r[2], s, 2.2); } },
  // 1 · EN ESPAÑA → EXTRA: 0 € DE SEG. SOCIAL → IRPF: EL MISMO %.
  { html: () => rt('turq', 'EN <span class="t">ESPAÑA</span>') + rt('turq p', 'EXTRA: <span class="t">0 €</span> SEG. SOCIAL') + rt('', 'IRPF: EL MISMO %'),
    anim: function (s, e, el) { const M = e.seg[0].marcas, m0 = M[0] != null ? M[0] : 0.8, m2 = M[2] != null ? M[2] : 3.3, r = el.querySelectorAll('.rt');
      ver(r[0], s, 0.1, m0 + 0.3); ver(r[1], s, m0 + 0.35, m2); ver(r[2], s, m2); } },
  // 2 · NETO NÓMINA 1.548 € → NETO EXTRA 1.700 €.
  { html: () => rt('', 'EJEMPLO: 2.000 € · 14 PAGAS') + rt('', 'NÓMINA: 1.548 €') + rt('turq', 'EXTRA: <span class="t">1.700 €</span>'),
    anim: function (s, e, el) { const M = e.seg[0].marcas, m0 = M[0] != null ? M[0] : 3.4, m1 = M[1] != null ? M[1] : 5.2, r = el.querySelectorAll('.rt');
      ver(r[0], s, 0.1, m0); ver(r[1], s, m0, m1); ver(r[2], s, m1); } },
  // 3 · ¿TE LIBRAS? → YA LA PAGASTE.
  { html: () => rt('', '¿TE LIBRAS?') + rt('roja', 'YA LA <span class="r">PAGASTE</span>'),
    anim: function (s, e, el) { const M = e.seg[0].marcas, m0 = M[0] != null ? M[0] : 1.3, r = el.querySelectorAll('.rt'); ver(r[0], s, 0.1, m0); ver(r[1], s, m0); } },
  // 4 · 2 PAGAS ÷ 12 MESES → BASE: 2.333 € → 22 € AL MES.
  { html: () => rt('amb', '2 EXTRAS ÷ <span class="a">12 MESES</span>') + rt('amb', 'COTIZAS POR <span class="a">2.333 €</span>') + rt('roja', '<span class="r">22 €</span> AL MES') +
      nota('Ley General de la Seguridad Social, art. 147.1<br>Orden PJC/297/2026: trabajador 6,50 %'),
    anim: function (s, e, el) { const M = e.seg[0].marcas, m0 = M[0] != null ? M[0] : 1.5, m1 = M[1] != null ? M[1] : 2.8, m2 = M[2] != null ? M[2] : 5.6, r = el.querySelectorAll('.rt');
      ver(r[0], s, m0 - 0.2, m1); ver(r[1], s, m1 + 0.1, m2); ver(r[2], s, m2 + 0.05); ver(el.querySelector('.nota'), s, m1, m2); } },
  // 5 · BUSCA: BASE DE COTIZACIÓN → ¿MÁS QUE TU BRUTO? → YA LA COTIZASTE. Cola: el rótulo del fotograma 0.
  { html: () => rt('amb p', 'BUSCA: <span class="a">BASE DE COTIZACIÓN</span>') + rt('amb', '2.333 € &gt; 2.000 €') + rt('turq', 'YA LA <span class="t">COTIZASTE</span>') +
      rt('', 'MISMO BRUTO: 2.000 €', 1450),
    anim: function (s, e, el) { const M = e.seg[0].marcas, m0 = M[0] != null ? M[0] : 1.0, m1 = M[1] != null ? M[1] : 2.6, m2 = M[2] != null ? M[2] : 4.6, r = el.querySelectorAll('.rt');
      const cola = e.fin - e.ini - 0.8; ver(r[0], s, m0, m1); ver(r[1], s, m1, m2); ver(r[2], s, m2, cola); r[3].style.opacity = s >= cola ? 1 : 0; r[3].style.transform = 'translateX(-50%)'; } }
];

const TRES = function (t, k, s, e, W) {
  const X = W.X; X.apagar();
  const ultima = k === ESC.length - 1, Dv = (e.fin - e.ini) - (ultima ? 0 : 0.3);
  const M = e.seg.flatMap(g => g.marcas), res = e.seg.flatMap(g => g.res);
  const mk = (j, def) => (M[j] != null ? M[j] : def);
  W.cam.up.set(0, 1, 0);
  if (k === 0) gancho(W, X, s, mk(1, 3.0), Dv);
  else if (ultima && s >= Dv - 0.8) gancho(W, X, s - Dv, null, 4.0);   // cola: el encuadre del fotograma 0 (bucle)
  else [null, esc1, esc2, esc3, esc4, esc5][k](W, X, s, Dv, mk, res);
  W.multitud(t, { directo: () => ({ x: -60, z: -60, esc: 0 }) });
};

const pildoras = {
  'es-paga-extra': pildora3d({
    slug: 'es-paga-extra', cuenta: 'es',
    T: { es: { titulo: 'Tu paga extra: mismo bruto que tu nómina… y 152 € más', guion: GUION } },
    fijo: () => `<div class="hud i fmt">HACEMOS LA CUENTA</div><div class="hud d"><i></i><span id="reloj">00:00</span></div>`,
    cssExtra: CSS, scriptExtra: SCRIPT,
    datos: () => ({ NOM: r2(NOMINA), EXT: EXTRA }),
    escenas: ESCENAS, tres: TRES,
    cola: 0.8, corte2d: 'seco',
    texto: { es: TEXTO }
  })
};

module.exports = { pildoras };
