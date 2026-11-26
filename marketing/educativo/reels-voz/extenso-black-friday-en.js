// Long format (30–45 s) · @finanziapp (US), in 3D (reels-voz/tres.js), series «Money, explained».
// en-black-friday-was-price · «Was $199, now $99. But three weeks ago, it was already $99.»
// Final, verified script: guiones/2026-11-en-black-friday-was-price.md (visual hook, scenes, cuadra(), sources, post, cover).
// To publish Friday Nov 27, 2026 (Black Friday), 11:00 New York. Model: reels-voz/extenso-black-friday-es.js (es-black-friday-30-dias).
//
// Sources (all checked 26 Nov 2026):
// - FTC, 16 CFR Part 233 «Guides Against Deceptive Pricing», § 233.1 «Former price comparisons» (eCFR API, text in force on 24-11-2026;
//   source 32 FR 15534, Nov. 8, 1967). (a) a former price that is «the actual, bona fide price at which the article was offered to the
//   public on a regular basis for a reasonably substantial period of time» is a legitimate basis; an «artificial, inflated price … established
//   for the purpose of enabling the subsequent offer of a large reduction» makes «the "bargain" being advertised … a false one». (b) «openly
//   and actively offered for sale, for a reasonably substantial period of time, in the recent, regular course of his business, honestly and in
//   good faith». (c) the FTC's own example: a price kept «for only a few days» and then «cut». No number of days anywhere.
//   https://www.ecfr.gov/current/title-16/chapter-I/subchapter-B/part-233/section-233.1
// - 16 CFR 1.5: «Industry guides are administrative interpretations of laws administered by the Commission» (a guide, not a 30-day rule).
//   https://www.ecfr.gov/current/title-16/chapter-I/subchapter-A/part-1/subpart-B/section-1.5
// - Which? (UK consumer group), press release, 25 Nov 2025: 175 home, tech and health appliances from eight retailers, prices tracked May 2024 –
//   May 2025; «83 per cent of products were cheaper or equal in price on at least one occasion outside of the four-week Black Friday sales
//   period» (15 Nov – 12 Dec 2024); «On the day of Black Friday itself … no deals at all that were at their cheapest of the year».
//   https://www.which.co.uk/policy-and-insight/article/dont-believe-the-hype-most-black-friday-deals-the-same-price-or-cheaper-at-other-times-of-the-year-which-finds-a3TbD5x5KADs
// - Tversky & Kahneman (1974), «Judgment under Uncertainty: Heuristics and Biases», Science 185:1124–1131: a number from a wheel of fortune;
//   «median estimates of the percentage of African countries in the United Nations were 25 and 45 for groups that received 10 and 65» ;
//   «Payoffs for accuracy did not reduce the anchoring effect.» https://sites.stat.washington.edu/peter/498.Sp16/Tversky.pdf
// - Prices in the video ($199 / $99 and both 30-day histories) are EXAMPLES, labelled «EXAMPLE» on screen.
const { pildora3d } = require('./tres');
const { VOZ_NARRADOR } = require('./_comun');
const { cuadra } = require('../reels/_comun');

// ——— checks (guiones/2026-11-en-black-friday-was-price.md, «Cuentas») ———
const DIA_MS = 86400000, f = (s) => Date.UTC(...s.split('-').map((n, i) => i === 1 ? n - 1 : +n));
const iso = (ms) => new Date(ms).toISOString().slice(0, 10);
const jueves = [...Array(30)].map((_, i) => f('2026-11-' + (i + 1))).filter(ms => new Date(ms).getUTCDay() === 4);
cuadra('Acción de Gracias 2026', iso(jueves[3]), '2026-11-26');
const BF = jueves[3] + DIA_MS;
cuadra('Black Friday 2026', iso(BF), '2026-11-27');
cuadra('Cyber Monday 2026', iso(BF + 3 * DIA_MS), '2026-11-30');
cuadra('«three weeks ago» = 6-nov', iso(BF - 21 * DIA_MS), '2026-11-06');
cuadra('panel: 30 días antes del viernes empiezan el 28-oct', iso(BF - 30 * DIA_MS), '2026-10-28');
cuadra('panel: el 6-nov es el índice 9', (f('2026-11-06') - f('2026-10-28')) / DIA_MS, 9);
const H1 = [...Array(30)].map((_, i) => (i >= 7 && i <= 11) ? 99 : 199);   // example 1: $99 from Nov 4 to Nov 8
cuadra('ejemplo 1: el 4-nov es el índice 7', iso(f('2026-10-28') + 7 * DIA_MS), '2026-11-04');
cuadra('ejemplo 1: el 6-nov estaba a 99', H1[9], 99);
cuadra('ejemplo 1: días a 99', H1.filter(p => p === 99).length, 5);
cuadra('ejemplo 1: el 26-nov estaba a 199', H1[29], 199);
const pct = (a, b) => (a - b) / a * 100;
cuadra('rebaja anunciada 199 → 99', Math.round(pct(199, 99) * 100) / 100, 50.25);
cuadra('insignia −50 %', Math.round(pct(199, 99)), 50);
cuadra('rebaja real frente al 6-nov', pct(Math.min(...H1), 99), 0);
const H2 = [...Array(30)].map((_, i) => i >= 27 ? 199 : 99);               // example 2 (FTC): $199 for only 3 days
cuadra('ejemplo 2: 199 del 24 al 26-nov', iso(f('2026-10-28') + 27 * DIA_MS), '2026-11-24');
cuadra('ejemplo 2: días a 199', H2.filter(p => p === 199).length, 3);
cuadra('ejemplo 2: días a 99', H2.filter(p => p === 99).length, 27);
cuadra('anclaje: anclas 10 y 65, medianas 25 y 45 → 20 puntos', 45 - 25, 20);
cuadra('Which?: 83 % de 175 ≈ 145 productos', Math.round(175 * 0.83), 145);
cuadra('Which?: 145/175 redondea a 83 %', Math.round(145 / 175 * 100), 83);
cuadra('pared: 83 de 100 etiquetas', 83 + 17, 100);
cuadra('guía de 1967: años hasta 2026', 2026 - 1967, 59);
cuadra('ejemplo FTC de las plumas: 5 $ + 50 %', 5 * 1.5, 7.5);
// on screen
const MES = (i) => { const d = new Date(f('2026-10-28') + i * DIA_MS); return (d.getUTCMonth() === 9 ? 'OCT' : 'NOV') + ' ' + d.getUTCDate(); };
cuadra('pantalla: índice 9 = NOV 6', MES(9), 'NOV 6');
cuadra('pantalla: índice 30 = NOV 27', MES(30), 'NOV 27');
cuadra('pantalla: índice 0 = OCT 28', MES(0), 'OCT 28');
cuadra('pantalla: ejemplo 2, «3 DAYS» = NOV 24–26', MES(27) + '–' + MES(29).split(' ')[1], 'NOV 24–26');
const AMARILLAS = [...Array(100).keys()].sort((a, b) => ((a * 37) % 100) - ((b * 37) % 100)).slice(0, 83);
cuadra('pantalla: pared con 83 ámbar', new Set(AMARILLAS).size, 83);
cuadra('pantalla: columnas ∝ respuestas (25 y 45 sin cortar el eje)', Math.round(45 * 0.036 / (25 * 0.036) * 100) / 100, 1.8);

const TEXTO = `Was $199, now $99. But three weeks ago it was already $99.

Why the crossed-out price still works: anchoring. In Tversky and Kahneman's 1974 study, people saw a spinning wheel land on 10 or 65 before guessing a percentage: the median guesses were 25% and 45%. Paying for accuracy didn't reduce the effect.

What the FTC says: its Guides Against Deceptive Pricing (16 CFR 233.1, on the books since 1967) say a former price should be one the item was openly and actively offered at, in good faith, for a reasonably substantial period, in the recent, regular course of business. A price inflated just so it can be "cut" makes the bargain "a false one." It's a guide that interprets the FTC Act, not a fixed 30-day rule like the EU's.

The data comes from the UK: consumer group Which? tracked 175 products from 8 retailers for a year around Black Friday 2024. 83% were as cheap or cheaper at least once outside the 4-week sale, and none was at its lowest price of the year on Black Friday itself.

Today: before you pay, check the item's price history, or screenshot today's price and compare on Cyber Monday. If it's the same, the "deal" was probably just the regular price. Whatever you don't spend can go straight to savings.

Prices in the video are an example.
Sources: FTC, 16 CFR 233.1 (eCFR) · Which?, Nov 25, 2025 · Tversky & Kahneman, Science, 1974. Checked Nov 26, 2026.
Educational only, not financial advice.

#blackfriday #personalfinance #moneytips #shoppingtips #consumerrights`;
cuadra('texto: ≤ 1.600 caracteres', TEXTO.length <= 1600, true);
cuadra('texto: 5 hashtags', (TEXTO.match(/#\w+/g) || []).length, 5);
cuadra('texto: sin Follow ni Comment', /follow|comment /i.test(TEXTO), false);

const GUION = [
  [0, 'Was $199, now $99. §{pop}But three weeks ago, it was already *$99*.'],
  [1, 'So the real discount is *zero*. §Why does $199 still work §when you *know* it\'s inflated?'],
  [2, 'It\'s called *anchoring*. §In a 1974 study, §{tic}a number from a *spinning wheel* §moved people\'s guesses by *20 points*.'],
  [3, 'FTC guides say a “was” price should have been *openly offered*, §in good faith, §for a *reasonably substantial* time. §{caja}If not, it\'s a *false bargain*.'],
  [4, 'A UK consumer group tracked Black Friday deals for a year: §{ding}*83%* were as cheap or cheaper at another time.'],
  [5, 'Check the price history, §or screenshot today\'s price and compare on Cyber Monday. §Ignore the $199. §{pop}Judge the *$99*.']
];

const MONO = `'DejaVu Sans Mono', 'Liberation Mono', monospace`;
const CSS = `
  .hud.i.fmt { letter-spacing: .14em; }
  .rt { position: absolute; left: 50%; top: 1335px; padding: 10px 28px 14px; border-radius: 20px; background: rgba(9,14,27,.9); border: 3px solid #e2e8f0;
    color: #fff; font-size: 58px; line-height: 1.12; font-weight: 900; letter-spacing: -.015em; white-space: nowrap; opacity: 0; font-variant-numeric: tabular-nums;
    box-shadow: 0 10px 40px rgba(0,0,0,.45); text-align: center; }
  .rt.p { font-size: 46px; } .rt.p2 { font-size: 40px; } .rt.g { font-size: 76px; } .rt.amb { border-color: #f5b94a; } .rt.roja { border-color: #f87171; } .rt.turq { border-color: #5eead4; }
  .rt .a { color: #f5b94a; } .rt .r { color: #f87171; } .rt .t { color: #5eead4; } .rt .x { color: #94a3b8; text-decoration: line-through; text-decoration-color: #f87171; text-decoration-thickness: 6px; }
  .nota { position: absolute; left: 70px; top: 1452px; max-width: 820px; font: 600 22px/1.28 ${MONO}; color: #b6c2d4; background: rgba(7,11,22,.84);
    border-radius: 10px; padding: 4px 12px; opacity: 0; }
`;

// 3D world of this video (added to tres.js): hanging price tag with stickers ($199 red, $99 amber), −50 % / 0 % badge, amber stamp,
// shards, a «PRICE · LAST 30 DAYS» board whose cursor rewinds, a wheel of fortune, a wall of 100 small tags, a «FALSE BARGAIN» stamp,
// a generic phone and a screenshot card. Everything is switched off at the start of each frame (X3.apagar()).
const SCRIPT = `
function ver(n, s, a, b) { if (!n) return; let p = a < -0.5 ? 1 : rebote(tramo(s, a - 0.1, a + 0.25)); if (b != null) p *= 1 - tramo(s, b - 0.12, b); aparece3(n, p); }
const PI = Math.PI, AMBH = 0xf5b94a, ROJOH = 0xef4444, TURQH = 0x2dd4bf;
const mezcla = (P, Q, u) => P.map((v, j) => v + (Q[j] - v) * u);
const suave = (x) => x * x * (3 - 2 * x);
const angulo = (a, b, g) => a + ((((b - a + PI) % (2 * PI)) + 2 * PI) % (2 * PI) - PI) * g;
// Shots with hard cuts: plano(s, [[t0, (u, s) => [px, py, pz, lx, ly, lz]]…]); every shot keeps moving (en-thanksgiving-dinner v2).
const plano = (s, P) => { let j = 0; while (j + 1 < P.length && s >= P[j + 1][0]) j++; return P[j][1](s - P[j][0], s); };
const orb = (cx, cy, cz, r, h, a0, va, u) => [cx + r * Math.sin(a0 + va * u), h, cz + r * Math.cos(a0 + va * u), cx, cy, cz];
const dol = (A, B, dur, u) => mezcla(A, B, Math.min(1, u / dur));
function camR(W, C, roll) { const r = roll || 0; W.cam.up.set(Math.sin(r), Math.cos(r), 0); W.camara(C[0], C[1], C[2], C[3], C[4], C[5]); }
const MESES = (i) => { if (i >= 30) return 'NOV 27'; return i < 4 ? 'OCT ' + (28 + i) : 'NOV ' + (i - 3); };
const precioDia = (ej, i) => i >= 30 ? 99 : (ej === 2 ? D.H2 : D.H1)[Math.max(0, Math.min(29, i))];

const X3 = (() => {
  const W = W3, T = W.T, S = W.S, objs = [];
  const grupo = () => { const g = new T.Group(); g.visible = false; S.add(g); objs.push(g); return g; };
  const mat = (c, o) => new T.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.55, metalness: 0.08 }, o || {}));
  const pieza = (g, geo, m, x, y, z) => { const o = new T.Mesh(geo, m); o.position.set(x, y, z); o.castShadow = true; o.receiveShadow = true; g.add(o); return o; };
  const lienzo = (w, h, pintar) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); if (pintar) pintar(x, w, h);
    const tx = new T.CanvasTexture(c); tx.encoding = T.sRGBEncoding; tx.anisotropy = 4; return { c, x, tx, clave: null }; };
  const haloTx = lienzo(256, 256, (x) => { const g = x.createRadialGradient(128, 128, 0, 128, 128, 128); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.3, 'rgba(255,255,255,.4)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 256, 256); }).tx;
  const basico = (tx, o) => new T.MeshBasicMaterial(Object.assign({ map: tx, toneMapped: false, transparent: true }, o || {}));
  const sueltos = [];

  // ——— hanging tag (1.6 × 1.0 m); group origin = the point it hangs from ———
  const LC = 0.45, TW = 1.6, TH = 1.0, SX = 0.3, SY = 0.131, SW = 0.86, SH = 0.27;
  const etiG = grupo(), cara = new T.Group(); cara.position.set(0, -LC - TH / 2, 0); etiG.add(cara);
  const etiTx = lienzo(1024, 640, (x, w, h) => {
    x.fillStyle = '#f1f5f9'; x.fillRect(0, 0, w, h); x.strokeStyle = '#cbd5e1'; x.lineWidth = 10; x.strokeRect(5, 5, w - 10, h - 10);
    x.fillStyle = '#334155'; x.beginPath(); x.arc(512, 77, 28, 0, 2 * PI); x.fill();
    x.fillStyle = '#94a3b8'; x.font = '700 30px DejaVu Sans Mono, monospace'; x.textAlign = 'left'; x.textBaseline = 'middle'; x.fillText('EXAMPLE', 46, 62);
    x.fillStyle = '#475569'; x.font = '800 84px Inter, sans-serif'; x.fillText('WAS', 46, 238);
    x.fillStyle = '#cbd5e1'; x.fillRect(46, 366, 932, 6);
    x.fillStyle = '#475569'; x.fillText('NOW', 46, 502);
    x.fillStyle = '#0f172a'; x.font = '900 186px Inter, sans-serif'; x.textAlign = 'center'; x.fillText('$99', 690, 510);
  }).tx;
  const mPapel = mat(0xdfe5ec, { roughness: 0.75 });
  const tagM = new T.Mesh(new T.BoxGeometry(TW, TH, 0.04), [mPapel, mPapel, mPapel, mPapel, new T.MeshBasicMaterial({ map: etiTx, toneMapped: false }), mPapel]);
  tagM.castShadow = true; cara.add(tagM);
  pieza(etiG, new T.CylinderGeometry(0.011, 0.011, LC + 0.12, 8), mat(0x94a3b8), 0, -(LC + 0.12) / 2, 0);
  function pintaPeg(txt, bg, fg) { return lienzo(640, 200, (x, w, h) => { x.fillStyle = bg; x.beginPath(); x.roundRect(6, 6, w - 12, h - 12, 34); x.fill();
    x.strokeStyle = 'rgba(255,255,255,.85)'; x.lineWidth = 8; x.beginPath(); x.roundRect(22, 22, w - 44, h - 44, 24); x.stroke();
    x.fillStyle = fg; x.font = '900 156px Inter, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(txt, w / 2, h / 2 + 8); }).tx; }
  const PEG = { r199: pintaPeg('$199', '#ef4444', '#ffffff'), a99: pintaPeg('$99', '#f5b94a', '#1a1205') };
  const geoPeg = new T.PlaneGeometry(SW, SH), pegs = {};
  ['a99', 'r199'].forEach((k, j) => { const m = new T.Mesh(geoPeg, basico(PEG[k])); m.position.set(SX, SY, 0.023 + 0.003 * j); cara.add(m); pegs[k] = m; });
  const geoGr = new T.BoxGeometry(1, 0.016, 0.004); geoGr.translate(0.5, 0, 0);
  const GR0 = [[0.15, 0.22, 0.55, 0.26], [0.85, 0.14, 0.4, 0.16], [2.3, 0.2, 2.75, 0.22], [3.0, 0.16, 3.5, 0.2], [3.95, 0.12, 4.4, 0.16], [5.35, 0.18, 4.95, 0.2]];
  const GR = [], mGr = new T.MeshBasicMaterial({ color: 0xfff1f2, toneMapped: false }), G0x = SX - 0.05, G0y = SY + 0.01;
  GR0.forEach(([a1, l1, a2, l2]) => { GR.push([a1, l1, G0x, G0y]); GR.push([a2, l2, G0x + Math.cos(a1) * l1, G0y + Math.sin(a1) * l1, l1]); });
  const grietas = GR.map(([a, l, x, y]) => { const g = new T.Mesh(geoGr, mGr); g.position.set(x, y, 0.034); g.rotation.z = a; cara.add(g); return g; });
  const pintaIns = (txt, bg, fg, fs) => lienzo(256, 256, (x) => { x.fillStyle = bg; x.beginPath(); x.arc(128, 128, 124, 0, 2 * PI); x.fill();
    x.strokeStyle = 'rgba(255,255,255,.9)'; x.lineWidth = 8; x.beginPath(); x.arc(128, 128, 108, 0, 2 * PI); x.stroke();
    x.fillStyle = fg; x.font = '900 ' + fs + 'px Inter, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(txt, 128, 134); }).tx;
  const IX = 0.6, IY = 0.44, IR = 0.2;
  const insG = new T.Group(); insG.position.set(IX, IY, 0.04); cara.add(insG);
  const insF = new T.Mesh(new T.CircleGeometry(IR, 44), basico(pintaIns('−50%', '#ef4444', '#ffffff', 70))); insF.position.z = 0.007; insG.add(insF);
  const insB = new T.Mesh(new T.CircleGeometry(IR, 44), basico(pintaIns('0%', '#f5b94a', '#1a1205', 104))); insB.position.z = -0.007; insB.rotation.y = PI; insG.add(insB);
  const insC = new T.Mesh(new T.CylinderGeometry(IR, IR, 0.012, 44, 1, true), mat(0x7f1d1d)); insC.rotation.x = PI / 2; insG.add(insC);
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
  const trozos = [], casaT = [];
  for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) {
    const g = new T.PlaneGeometry(SW / 4, SH / 2), uv = g.attributes.uv;
    for (let k = 0; k < uv.count; k++) uv.setXY(k, (c + uv.getX(k)) / 4, (uv.getY(k) + 1 - r) / 2);
    const m = new T.Mesh(g, basico(PEG.r199, { side: T.DoubleSide })); m.castShadow = true; m.visible = false; S.add(m); trozos.push(m); sueltos.push(m);
    casaT.push([SX - SW / 2 + SW / 8 + c * SW / 4, SY + SH / 4 - r * SH / 2]);
  }
  function trozo(i, o) { const m = trozos[i], op = o.op == null ? 1 : o.op; m.visible = op > 0.01; if (!m.visible) return; m.position.set(o.x, o.y, o.z); m.rotation.set(o.rx || 0, o.ry || 0, o.rz || 0); m.scale.setScalar(o.esc || 1); m.material.opacity = op; }
  const casasTrozos = () => casaT.map(([lx, ly]) => ptEti(lx, ly, 0.035));
  const pegV = Array.from({ length: 3 }, () => { const m = new T.Mesh(geoPeg, basico(PEG.a99, { side: T.DoubleSide })); m.visible = false; m.castShadow = true; S.add(m); sueltos.push(m); return m; });
  function pegVuela(i, tipo, o) { const m = pegV[i], op = o.op == null ? 1 : o.op; m.visible = op > 0.01; if (!m.visible) return;
    if (m.material.map !== PEG[tipo]) { m.material.map = PEG[tipo]; m.material.needsUpdate = true; }
    m.position.set(o.x, o.y, o.z); m.rotation.set(o.rx || 0, o.ry || 0, o.rz || 0); m.scale.setScalar(Math.max(0.001, o.esc || 1)); m.material.opacity = op; }

  // ——— amber stamp «$99» (thick coin facing the camera) ———
  const selG = grupo();
  const selC = pieza(selG, new T.CylinderGeometry(0.25, 0.25, 0.09, 44), mat(0xd99a2b, { metalness: 0.35, roughness: 0.35, emissive: 0x5a3a08, emissiveIntensity: 0.6 }), 0, 0, 0); selC.rotation.x = PI / 2;
  const selTx = lienzo(256, 256, (x) => { x.fillStyle = '#f5b94a'; x.beginPath(); x.arc(128, 128, 126, 0, 2 * PI); x.fill(); x.strokeStyle = '#1a1205'; x.lineWidth = 7; x.beginPath(); x.arc(128, 128, 110, 0, 2 * PI); x.stroke();
    x.fillStyle = '#1a1205'; x.font = '900 96px Inter, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('$99', 128, 134); }).tx;
  const selF = new T.Mesh(new T.CircleGeometry(0.245, 44), basico(selTx, { transparent: false })); selF.position.z = 0.047; selG.add(selF);
  function sello(o) { selG.visible = true; selG.position.set(o.x, o.y, o.z); selG.rotation.set(o.rx || 0, o.ry || 0, o.rz || 0); selG.scale.set(o.esc || 1, o.esc || 1, Math.max(0.05, o.sz || 1) * (o.esc || 1)); }

  // ——— price chart drawn on a canvas (the board and the phone use it) ———
  // o = { ej, cur (day index 0..30 or null), dib (0..1 of the line drawn), br (0..1: red «3 DAYS» bracket), mini }
  function grafica(x, w, h, o) {
    const ej = o.ej || 1, mini = !!o.mini, hh = mini ? 150 : 210, L = mini ? 26 : 70, R = w - (mini ? 26 : 40), B = h - (mini ? 70 : 78), Tp = hh + (mini ? 30 : 34);
    const X = (i) => L + (R - L) * i / 30, Y = (p) => B - (B - Tp) * p / 210;
    x.fillStyle = '#0b1222'; x.fillRect(0, 0, w, h);
    x.strokeStyle = '#1e293b'; x.lineWidth = 2; [0, 99, 199].forEach(p => { x.beginPath(); x.moveTo(L, Y(p)); x.lineTo(R, Y(p)); x.stroke(); });
    x.fillStyle = '#64748b'; x.font = '700 ' + (mini ? 20 : 26) + 'px DejaVu Sans Mono, monospace'; x.textAlign = 'left'; x.textBaseline = 'middle';
    if (!mini) { x.fillText('$199', 6, Y(199) - 18); x.fillText('$99', 6, Y(99) - 18); }
    x.textAlign = 'left'; x.fillText('OCT 28', L, h - (mini ? 38 : 40)); x.textAlign = 'right'; x.fillText('NOV 27', R, h - (mini ? 38 : 40));
    const n = Math.max(0, Math.min(30, 30 * (o.dib == null ? 1 : o.dib)));
    x.lineCap = 'round'; x.lineJoin = 'round';
    for (let i = 0; i < Math.ceil(n); i++) {
      const p0 = precioDia(ej, i), p1 = precioDia(ej, i + 1), fr = Math.min(1, n - i);
      const col = i === 29 ? '#5eead4' : ej === 1 ? (p0 === 99 && p1 === 99 ? '#f5b94a' : '#e2e8f0') : (p0 === 199 ? '#f87171' : '#e2e8f0');
      x.strokeStyle = col; x.lineWidth = mini ? 7 : 12; x.beginPath(); x.moveTo(X(i), Y(p0));
      if (p1 !== p0) { const xm = X(i) + (X(i + 1) - X(i)) * Math.min(1, fr * 2); x.lineTo(xm, Y(p0)); if (fr > 0.5) x.lineTo(xm, Y(p0) + (Y(p1) - Y(p0)) * Math.min(1, (fr - 0.5) * 2)); }
      else x.lineTo(X(i) + (X(i + 1) - X(i)) * fr, Y(p0));
      x.stroke();
    }
    if (n >= 30) { x.fillStyle = '#5eead4'; x.beginPath(); x.arc(X(30), Y(99), mini ? 9 : 15, 0, 2 * PI); x.fill(); }
    if (o.br) { const a = X(27), b = X(30), yb = Y(199) - (mini ? 18 : 30), q = o.br; x.globalAlpha = Math.min(1, q * 1.5);
      x.strokeStyle = '#f87171'; x.lineWidth = mini ? 5 : 8; x.beginPath(); x.moveTo(a, yb + 22); x.lineTo(a, yb); x.lineTo(a + (b - a) * q, yb); if (q > 0.98) x.lineTo(b, yb + 22); x.stroke();
      x.fillStyle = '#f87171'; x.font = '900 ' + (mini ? 30 : 56) + 'px Inter, sans-serif'; x.textAlign = 'right'; x.fillText('3 DAYS', b, yb - (mini ? 24 : 40)); x.globalAlpha = 1; }
    // header: big readout of the cursor (date and price)
    x.fillStyle = '#111c33'; x.fillRect(0, 0, w, hh);
    x.fillStyle = '#94a3b8'; x.font = '700 ' + (mini ? 22 : 30) + 'px DejaVu Sans Mono, monospace'; x.textAlign = 'left'; x.fillText(mini ? 'PRICE HISTORY' : 'PRICE · LAST 30 DAYS', mini ? 20 : 36, mini ? 32 : 40);
    x.textAlign = 'right'; x.fillText('EXAMPLE', w - (mini ? 20 : 36), mini ? 32 : 40);
    if (o.cur != null) {
      const ci = Math.round(o.cur), p = precioDia(ej, ci), cx = X(Math.min(30, Math.max(0, o.cur)));
      x.strokeStyle = '#5eead4'; x.lineWidth = mini ? 4 : 6; x.beginPath(); x.moveTo(cx, Tp - 10); x.lineTo(cx, B + 8); x.stroke();
      x.fillStyle = '#5eead4'; x.beginPath(); x.arc(cx, Y(p), mini ? 11 : 20, 0, 2 * PI); x.fill();
      x.fillStyle = '#e2e8f0'; x.font = '900 ' + (mini ? 50 : 104) + 'px Inter, sans-serif'; x.textAlign = 'left'; x.fillText(MESES(ci), mini ? 20 : 36, mini ? 100 : 140);
      const c99 = p === 99 && ci < 30;
      x.fillStyle = c99 ? '#f5b94a' : ci >= 30 ? '#5eead4' : '#e2e8f0'; x.textAlign = 'right'; x.font = '900 ' + (mini ? 64 : 128) + 'px Inter, sans-serif'; x.fillText('$' + p, w - (mini ? 20 : 36), mini ? 102 : 142);
    }
  }
  // ——— the board: dark screen on a stand (1.5 × 1.0 m) ———
  const panG = grupo();
  pieza(panG, new T.BoxGeometry(1.58, 1.08, 0.06), mat(0x1f2937, { roughness: 0.4, metalness: 0.3 }), 0, 0, -0.035);
  [-0.55, 0.55].forEach(x => pieza(panG, new T.CylinderGeometry(0.025, 0.025, 3.2, 8), mat(0x334155, { metalness: 0.5 }), x, -1.6, -0.08));
  const panL = lienzo(1020, 680); const panP = new T.Mesh(new T.PlaneGeometry(1.5, 1.0), new T.MeshBasicMaterial({ map: panL.tx, toneMapped: false })); panP.position.z = 0.0; panG.add(panP);
  const panH = new T.Sprite(new T.SpriteMaterial({ map: haloTx, color: 0xffc35a, blending: T.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0 })); panH.scale.setScalar(1.1); panG.add(panH);
  function panel(o) {
    panG.visible = true; panG.position.set(o.x, o.y, o.z); panG.rotation.set(o.rx || 0, o.ry || 0, o.rz || 0); panG.scale.setScalar(o.esc || 1);
    const k = [o.ej || 1, o.cur == null ? 'n' : Math.round(o.cur * 3), Math.round((o.dib == null ? 1 : o.dib) * 60), Math.round((o.br || 0) * 20)].join('|');
    if (k !== panL.clave) { panL.clave = k; grafica(panL.x, 1020, 680, o); panL.tx.needsUpdate = true; }
    panH.material.opacity = 0;
  }
  // world point of the chart at day i and price p (for things that fly out of it)
  function ptPanel(i, p) { panG.updateMatrixWorld(true); const xc = 70 + (980 - 70) * i / 30, yc = (680 - 78) - ((680 - 78) - 244) * p / 210; return panP.localToWorld(new T.Vector3(-0.75 + 1.5 * xc / 1020, 0.5 - yc / 680, 0.03)); }

  // ——— wheel of fortune (0–95 in 20 slices), pointer on top ———
  const rueG = grupo(), rueD = new T.Group(); rueG.add(rueD);
  const rueTx = lienzo(1024, 1024, (x, w) => { const c = w / 2, r = c - 6;
    for (let k = 0; k < 20; k++) { const a0 = -PI / 2 + (k - 0.5) * PI / 10, a1 = a0 + PI / 10;
      x.fillStyle = k % 2 ? '#1e293b' : '#334155'; if (k === 2) x.fillStyle = '#0f766e'; if (k === 13) x.fillStyle = '#991b1b';
      x.beginPath(); x.moveTo(c, c); x.arc(c, c, r, a0, a1); x.closePath(); x.fill(); x.strokeStyle = '#0b1222'; x.lineWidth = 6; x.stroke();
      const am = -PI / 2 + k * PI / 10; x.save(); x.translate(c + Math.cos(am) * r * 0.78, c + Math.sin(am) * r * 0.78); x.rotate(am + PI / 2);
      x.fillStyle = '#f8fafc'; x.font = '900 66px Inter, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(String(k * 5), 0, 0); x.restore(); }
    x.fillStyle = '#e2e8f0'; x.beginPath(); x.arc(c, c, 60, 0, 2 * PI); x.fill(); x.strokeStyle = '#f5b94a'; x.lineWidth = 14; x.beginPath(); x.arc(c, c, r - 4, 0, 2 * PI); x.stroke(); }).tx;
  const rueF = new T.Mesh(new T.CircleGeometry(0.9, 64), new T.MeshBasicMaterial({ map: rueTx, toneMapped: false })); rueF.position.z = 0.051; rueD.add(rueF);
  const rueC = pieza(rueD, new T.CylinderGeometry(0.92, 0.92, 0.1, 64), mat(0x0f172a, { metalness: 0.4 }), 0, 0, 0); rueC.rotation.x = PI / 2;
  const punt = pieza(rueG, new T.ConeGeometry(0.11, 0.26, 3), mat(AMBH, { emissive: AMBH, emissiveIntensity: 0.8 }), 0, 1.0, 0.12); punt.rotation.z = PI;
  pieza(rueG, new T.CylinderGeometry(0.05, 0.05, 2.2, 10), mat(0x334155, { metalness: 0.5 }), 0, -1.05, -0.1);
  function ruleta(o) { rueG.visible = true; rueG.position.set(o.x, o.y, o.z); rueG.rotation.set(0, o.ry || 0, 0); rueD.rotation.z = o.ang || 0; rueG.scale.setScalar(o.esc || 1); }

  // ——— wall of 100 small tags (10 × 10) ———
  const geoT = new T.BoxGeometry(0.22, 0.3, 0.025); const tags = [];
  for (let i = 0; i < 100; i++) { const m = new T.Mesh(geoT, mat(0x94a3b8, { roughness: 0.5 })); m.castShadow = true; m.visible = false; S.add(m); tags.push(m); sueltos.push(m); }
  function pared(fn) { tags.forEach((m, i) => { const o = fn(i); m.visible = !!o && (o.esc == null || o.esc > 0.01); if (!m.visible) return;
    m.position.set(o.x, o.y, o.z); m.rotation.set(o.rx || 0, o.ry || 0, 0); m.scale.setScalar(o.esc == null ? 1 : o.esc);
    m.material.color.copy(W.color(o.color || '#94a3b8')); m.material.emissive.copy(W.color(o.color || '#94a3b8')).multiplyScalar(o.brillo || 0.05); }); }

  // ——— red stamp «FALSE BARGAIN» ———
  const falTx = lienzo(1024, 300, (x, w, h) => { x.fillStyle = '#7f1d1d'; x.fillRect(0, 0, w, h); x.strokeStyle = '#fecaca'; x.lineWidth = 16; x.strokeRect(18, 18, w - 36, h - 36);
    x.fillStyle = '#fff1f2'; x.font = '900 112px Inter, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('FALSE BARGAIN', w / 2, h / 2 + 6, w - 90); }).tx;
  const mFal = mat(0xb91c1c, { emissive: 0x7f1d1d, emissiveIntensity: 0.4 });
  const falM = new T.Mesh(new T.BoxGeometry(1.3, 0.38, 0.05), [mFal, mFal, mFal, mFal, new T.MeshBasicMaterial({ map: falTx, toneMapped: false }), mFal]); falM.castShadow = true; falM.visible = false; S.add(falM); sueltos.push(falM);
  function falso(o) { falM.visible = true; falM.position.set(o.x, o.y, o.z); falM.rotation.set(o.rx || 0, o.ry || 0, o.rz || 0); falM.scale.set(o.esc || 1, o.esc || 1, (o.sz || 1) * (o.esc || 1)); }

  // ——— generic boxes (columns), pool reused every frame ———
  const geoU = new T.BoxGeometry(1, 1, 1); geoU.translate(0, 0.5, 0); const cajas = []; let nc = 0;
  function bloque(o) {
    if (nc >= cajas.length) { const m = new T.Mesh(geoU, mat(0xffffff, { transparent: true })); m.castShadow = true; m.receiveShadow = true; S.add(m); cajas.push(m); sueltos.push(m); }
    const m = cajas[nc++], mt = m.material, op = o.op == null ? 1 : o.op; m.visible = op > 0.01 && o.h > 0.003;
    mt.color.set(o.color || '#e2e8f0'); mt.emissive.set(o.color || '#e2e8f0').multiplyScalar(o.brillo == null ? 0.15 : o.brillo); mt.opacity = op; mt.depthWrite = op > 0.99;
    m.position.set(o.x, o.y || 0, o.z); m.rotation.set(0, o.ry || 0, 0); m.scale.set(Math.max(0.001, o.w), Math.max(0.001, o.h), Math.max(0.001, o.d || o.w));
  }

  // ——— generic phone (no brands): screen = mini chart, or the screenshot ———
  const movG = grupo();
  pieza(movG, new T.BoxGeometry(0.36, 0.7, 0.035), mat(0x0f172a, { roughness: 0.35, metalness: 0.3 }), 0, 0, 0);
  const pan = lienzo(360, 700); const panM = new T.Mesh(new T.PlaneGeometry(0.33, 0.64), new T.MeshBasicMaterial({ map: pan.tx, toneMapped: false })); panM.position.z = 0.0185; movG.add(panM);
  function pintaHoy(x, w, h, marco) {
    x.fillStyle = '#0b1222'; x.fillRect(0, 0, w, h); if (marco) { x.strokeStyle = '#2dd4bf'; x.lineWidth = 12; x.strokeRect(6, 6, w - 12, h - 12); }
    x.fillStyle = '#2dd4bf'; x.beginPath(); x.roundRect(w / 2 - 95, 60, 190, 70, 35); x.fill(); x.fillStyle = '#06121a'; x.font = '900 44px Inter, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('TODAY', w / 2, 96);
    x.fillStyle = '#f1f5f9'; x.beginPath(); x.roundRect(30, 180, w - 60, 300, 20); x.fill();
    x.fillStyle = '#475569'; x.font = '800 38px Inter, sans-serif'; x.fillText('NOV 27', w / 2, 240); x.fillStyle = '#0f172a'; x.font = '900 128px Inter, sans-serif'; x.fillText('$99', w / 2, 360);
    x.fillStyle = '#94a3b8'; x.font = '700 26px DejaVu Sans Mono, monospace'; x.fillText('EXAMPLE', w / 2, 440);
    x.fillStyle = '#64748b'; x.font = '700 30px DejaVu Sans Mono, monospace'; x.fillText(marco ? 'SCREENSHOT' : 'COMPARE MON', w / 2, 580);
  }
  function movil(o) {
    movG.visible = true; movG.position.set(o.x, o.y, o.z); movG.rotation.set(o.rx || 0, o.ry || 0, o.rz || 0); movG.scale.setScalar(Math.max(0.001, o.esc || 1));
    const p = o.pant || {}, cl = (p.tipo || 'hist') + '|' + Math.round((p.cur == null ? -1 : p.cur) * 2);
    if (cl !== pan.clave) { pan.clave = cl;
      if (p.tipo === 'hoy') pintaHoy(pan.x, 360, 700, false);
      else { const x = pan.x; x.save(); x.translate(0, 120); grafica(x, 360, 480, { ej: 1, cur: p.cur, mini: true }); x.restore(); x.fillStyle = '#0b1222'; x.fillRect(0, 0, 360, 120); x.fillRect(0, 600, 360, 100);
        x.fillStyle = '#f5b94a'; x.font = '900 34px Inter, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('LOW: $99 · NOV 4–8', 180, 650); }
      pan.tx.needsUpdate = true; }
  }
  const capM = new T.Mesh(new T.PlaneGeometry(0.62, 1.2), basico(lienzo(360, 700, (x, w, h) => pintaHoy(x, w, h, true)).tx, { transparent: false })); capM.castShadow = true; capM.visible = false; S.add(capM); sueltos.push(capM);
  function captura(o) { capM.visible = true; capM.position.set(o.x, o.y, o.z); capM.rotation.set(o.rx || 0, o.ry || 0, o.rz || 0); capM.scale.setScalar(Math.max(0.001, o.esc || 1)); }

  // ——— halos ———
  const halos = Array.from({ length: 5 }, () => { const s = new T.Sprite(new T.SpriteMaterial({ map: haloTx, color: 0xffd166, blending: T.AdditiveBlending, depthWrite: false, transparent: true })); s.visible = false; S.add(s); sueltos.push(s); return s; });
  function halo(i, o) { const s = halos[i]; s.visible = (o.op || 0) > 0.01; s.position.set(o.x, o.y, o.z); s.scale.setScalar(o.esc || 1); s.material.opacity = Math.min(1, o.op || 0); s.material.color.set(o.color || 0xffd166); }

  function apagar() { objs.forEach(g => { g.visible = false; }); sueltos.forEach(m => { m.visible = false; }); nc = 0; }
  return { etiqueta, ptEti, casasTrozos, trozo, pegVuela, sello, panel, ptPanel, ruleta, pared, falso, bloque, movil, captura, halo, apagar, SX, SY, SW, SH, IX, IY };
})();
W3.X = X3;

// ——— scene 0 · the hook ———
// Tag hanging at (PX, PY, PZ); board (price chart) at (BX, BY, BZ). Cursor rewinds NOV 27 → NOV 6 by 0.55 s; stamp hits at TI; $199 bursts
// at TR; badge flips to 0 % at TF; on «But» (mP) the cursor rewinds again and the $99 of the dip flies to the WAS line of the tag.
const G0 = { PX: 0.55, PY: 3.15, PZ: 0, BX: -1.15, BY: 2.15, BZ: -0.55, BE: 0.95, TI: 0.72, TR: 1.4, TF: 1.85, HX: 1.7, HZ: 1.4 };
function etiGancho(tau) {
  const u = tramo(tau, -0.8, 0.5), e_ = 1 - (1 - u) * (1 - u), tt = tau + 0.8;
  const y = G0.PY + 1.4 * (1 - e_) - 0.07 * Math.sin(tramo(tau, 0.5, 0.95) * PI);
  let rz = 0.2 * Math.exp(-0.8 * tt) * Math.sin(4.2 * tt + 0.5) + 0.025 * Math.sin(1.3 * tau), rx = 0;
  const ry = 0.36 * (1 - suave(tramo(tau, -0.1, 0.65))) + 0.04 * Math.sin(1.1 * tau + 0.4);
  const ti = tau - G0.TI;
  if (ti > 0) { rx = -0.3 * Math.exp(-4.5 * ti) * Math.sin(10 * ti); rz += 0.1 * Math.exp(-3 * ti) * Math.sin(8 * ti); }
  if (tau > 0.95 && tau < G0.TR) rz += 0.016 * tramo(tau, 0.95, G0.TR) * Math.sin(tau * 61);
  return { x: G0.PX, y, z: G0.PZ, rx, ry, rz };
}
function trozoVuelo(i, P0, d) {
  const c = i % 4, r = Math.floor(i / 4);
  const vx = (c - 1.5) * 1.25 + 0.2 * Math.sin(i * 2.3), vy = 1.1 + 0.7 * (1 - r) + 0.25 * Math.sin(i * 1.7), vz = 1.3 + 0.8 * ((i * 0.618) % 1), g = 9.8;
  const tl = (vy + Math.sqrt(vy * vy + 2 * g * (P0.y - 0.02))) / g;
  if (d < tl) return { x: P0.x + vx * d, y: P0.y + vy * d - 0.5 * g * d * d, z: P0.z + vz * d, rx: d * (6 + i), ry: d * (3 + 0.7 * i), rz: d * (4 + i * 0.5) };
  const r2 = Math.min(1, (d - tl) * 4), sl = 0.12 * (1 - (1 - r2) * (1 - r2));
  return { x: P0.x + vx * (tl + sl), y: 0.02, z: P0.z + vz * (tl + sl), rx: -PI / 2, ry: 0, rz: i * 0.8 };
}
function casasGancho(X) { X.etiqueta(etiGancho(G0.TR)); return X.casasTrozos(); }
// cursor of the board: 30 → 9 (0–0.55 s), stays, forward to 30 before «But», back to 9 on «But»
function cursor0(tau, mP) {
  const tF0 = Math.max(1.0, mP - 0.75), tF1 = mP - 0.12;
  if (tau < 0.55) return 30 - 21 * sale(tramo(tau, -0.05, 0.55));
  if (tau < tF0) return 9;
  if (tau < mP) return 9 + 21 * suave(tramo(tau, tF0, tF1));
  return 30 - 21 * sale(tramo(tau, mP, mP + 0.6));
}
function gancho(W, X, s, mP, Dv) {
  const tLand = Math.max(mP + 1.25, 2.9), tFly = tLand - 0.6;
  const P0s = s >= G0.TR ? casasGancho(X) : null;
  const st = etiGancho(s);
  const gr = s < G0.TI ? 0 : 0.62 * sale(tramo(s, G0.TI, G0.TI + 0.14)) + 0.38 * tramo(s, 0.86, G0.TR);
  const tiembla = s > 0.9 && s < G0.TR ? 1 + 0.13 * suave(tramo(s, 0.9, G0.TR)) + 0.04 * tramo(s, 0.95, G0.TR) * Math.sin(s * 53) : 1;
  const giro = 3 * PI * sale(tramo(s, G0.TF, G0.TF + 0.6)), insEsc = 1 + 0.22 * Math.sin(tramo(s, G0.TF + 0.45, G0.TF + 0.8) * PI);
  const a99 = s < G0.TR ? 0 : s < tLand ? 0.45 : 1, pop = s >= tLand ? 1 + 0.2 * Math.sin(tramo(s, tLand, tLand + 0.3) * PI) : 1;
  const tt = s + 0.8, wob = 0.5 * Math.exp(-0.7 * tt) * Math.sin(5.2 * tt);
  X.etiqueta(Object.assign({}, st, { peg: { r199: s < G0.TR ? 1 : 0, a99 }, pegEsc: { a99: pop, r199: tiembla }, grietas: s < G0.TR ? gr : 0, ins: wob + giro, insEsc }));
  if (P0s) for (let i = 0; i < 8; i++) X.trozo(i, trozoVuelo(i, P0s[i], s - G0.TR));
  const slot = X.ptEti(X.SX - 0.04, X.SY, 0.07);
  // board: the cursor rewinds; amber halo on the dip
  const cur = cursor0(s, mP), en9 = Math.abs(cur - 9) < 0.3;
  X.panel({ x: G0.BX, y: G0.BY, z: G0.BZ, ry: 0.32, esc: G0.BE, ej: 1, cur, halo: 0 });
  if (en9 && s > 0.45) { const p = X.ptPanel(9, 99); X.halo(1, { x: p.x, y: p.y, z: p.z + 0.05, esc: 0.5 + 0.12 * Math.sin(s * 9), op: 0.85, color: 0xffc35a }); }
  // stamp: leaves the dip of the board at 0.36 s in an arc and hits the $199 at TI
  if (s > 0.36 && s < 1.4) {
    let p, rz = 0, sz = 1, e = 1;
    const A = X.ptPanel(9, 99), S0 = [A.x, A.y, A.z + 0.1], SL = [slot.x, slot.y, slot.z];
    if (s < G0.TI) { const u = tramo(s, 0.36, G0.TI); p = mezcla(S0, SL, u * u); p[1] += 0.5 * Math.sin(u * PI); rz = 1.2 * (1 - u); e = 0.6 + 0.4 * u; }
    else if (s < 0.86) { p = SL; sz = 1 - 0.4 * Math.sin(tramo(s, G0.TI, 0.86) * PI); }
    else { const u = tramo(s, 0.86, 1.4); p = mezcla([slot.x, slot.y, slot.z + 0.05], [slot.x + 1.7, slot.y + 1.3, slot.z + 2.3], sale(u)); rz = -3 * u * u; }
    X.sello({ x: p[0], y: p[1], z: p[2], ry: st.ry, rz, sz, esc: e });
  }
  if (s > G0.TI && s < G0.TI + 0.45) { const u = tramo(s, G0.TI, G0.TI + 0.45); X.halo(0, { x: slot.x, y: slot.y, z: slot.z + 0.05, esc: 0.4 + 2.6 * sale(u), op: 0.95 * (1 - u), color: 0xffc35a }); }
  if (s > G0.TF + 0.4 && s < G0.TF + 0.9) { const u = tramo(s, G0.TF + 0.4, G0.TF + 0.9), b = X.ptEti(X.IX, X.IY, 0.06); X.halo(2, { x: b.x, y: b.y, z: b.z, esc: 0.6 + 1.4 * sale(u), op: 0.8 * (1 - u), color: 0xffc35a }); }
  // «already $99»: the $99 of the dip flies to the WAS line of the tag
  if (s > tFly && s < tLand) {
    const u = tramo(s, tFly, tLand), e_ = suave(u), A = X.ptPanel(9, 99), B = X.ptEti(X.SX, X.SY, 0.05);
    const p = mezcla([A.x, A.y, A.z + 0.05], [B.x, B.y, B.z], e_); p[1] += 0.45 * Math.sin(u * PI);
    X.pegVuela(0, 'a99', { x: p[0], y: p[1], z: p[2], esc: 0.42 + 0.58 * e_, rz: 0.5 * Math.sin(u * PI), ry: st.ry * e_ });
  }
  // mannequin walks in from the right at 2.2 s and looks at the tag
  if (s > 2.2) { const u = sale(tramo(s, 2.2, 2.9)), hx = lerp(3.8, G0.HX, u), hz = lerp(2.2, G0.HZ, u);
    const gA = Math.atan2(G0.HX - 3.8, G0.HZ - 2.2), gM = Math.atan2(G0.PX - G0.HX, G0.PZ - G0.HZ);
    W.heroe({ x: hx, z: hz, gira: angulo(gA, gM, suave(tramo(s, 2.6, 3.0))), amp: 1 - tramo(s, 2.7, 2.9), fase: s * 8 }); }
  // camera: dolly with roll onto the board (rewind) → whip to the tag (stamp, burst) → badge → wide crane → board → tag
  const TAG = [G0.PX, 2.25, 0], BRD = [G0.BX + 0.05, G0.BY + 0.05, G0.BZ], b = X.ptEti(X.IX, X.IY, 0);
  const tE = mP + 0.1, tF = Math.max(tE + 0.7, tLand - 0.35);
  const C = plano(s, [
    [0, (u) => dol([1.75, 2.75, 4.0, TAG[0] - 0.05, 2.3, 0], [1.25, 2.55, 3.55, TAG[0] - 0.05, 2.25, 0], 0.36, u)],
    [0.36, (u) => dol([-0.25, 2.35, 2.45, BRD[0], BRD[1], BRD[2]], [-0.55, 2.28, 2.05, BRD[0], BRD[1], BRD[2]], 0.3, u)],
    [0.66, (u) => orb(TAG[0], TAG[1], TAG[2], 3.5 - 0.3 * u, 2.45, 0.42, -0.35, u)],
    [1.55, (u) => dol([b.x + 0.95, b.y + 0.15, b.z + 1.85, b.x - 0.1, b.y - 0.2, b.z], [b.x + 0.5, b.y + 0.05, b.z + 1.5, b.x - 0.1, b.y - 0.2, b.z], 0.9, u)],
    [2.45, (u) => dol([-0.9, 3.9, 7.4, -0.1, 1.85, -0.3], [0.5, 3.1, 6.3, 0.0, 1.95, -0.3], Math.max(0.6, tE - 2.45), u)],
    [tE, (u) => dol([0.25, 2.35, 2.6, BRD[0], BRD[1], BRD[2]], [-0.3, 2.25, 2.25, BRD[0], BRD[1], BRD[2]], tF - tE, u)],
    [tF, (u) => dol([1.35, 2.5, 3.6, TAG[0], 2.15, 0], [0.95, 2.4, 3.15, TAG[0], 2.15, 0], Math.max(1, Dv - tF), u)]
  ]);
  const sh = s > G0.TI && s < 1.05 ? 0.07 * Math.exp(-(s - G0.TI) * 10) : 0;
  C[0] += sh * Math.sin(s * 83); C[1] += sh * Math.cos(s * 71);
  camR(W, C, 0.2 * (1 - suave(tramo(s, -0.1, 0.6))));
}
const blanco = { color: '#f8fafc', cq: 0.4, brillo: 0.05 };

// ——— scene 1 · «So the real discount is zero. §Why does $199 still work §when you know it's inflated?» ———
// Close-up of the 0 % badge; cut: the shards rise and rebuild a giant glowing $199; mannequins turn and walk to it like a magnet.
const G1 = { CX: 0.0, CY: 2.0, CZ: -1.2, E: 3.0 };
function esc1(W, X, s, Dv, mk) {
  const m0 = mk(0, 1.7), m1 = mk(1, 3.2);
  let directo = null;
  if (s < m0) {
    X.etiqueta({ x: G0.PX, y: G0.PY, z: G0.PZ, ry: 0.04 * Math.sin(1.1 * s + 0.4), rz: 0.03 * Math.sin(1.3 * s + 1), peg: { a99: 1 }, ins: PI + 0.12 * Math.sin(s * 3.2), insEsc: 1 + 0.25 * Math.sin(tramo(s, 0.1, 0.5) * PI) });
    const b = X.ptEti(X.IX, X.IY, 0);
    camR(W, orb(b.x, b.y, b.z, 1.55 - 0.25 * s / m0, b.y + 0.15, 0.3, -0.45, s));
  } else {
    const d = s - m0, E = G1.E, arma = suave(tramo(d, 0, 0.75));
    // shards fly up from the floor and lock into the giant sticker
    if (arma < 1) for (let i = 0; i < 8; i++) { const c = i % 4, r = Math.floor(i / 4);
      const F = [ (c - 1.5) * 1.1 + 0.3 * Math.sin(i), 0.02, 0.6 + 0.4 * Math.cos(i * 1.7)], Tg = [G1.CX + (c - 1.5) * X.SW / 4 * E, G1.CY + (0.5 - r) * X.SH / 2 * E, G1.CZ];
      const p = mezcla(F, Tg, arma); p[1] += 0.8 * Math.sin(arma * PI);
      X.trozo(i, { x: p[0], y: p[1], z: p[2], rx: -PI / 2 * (1 - arma), ry: 2 * PI * (1 - arma), esc: 1 + (E - 1) * arma }); }
    else { const late = 1 + 0.05 * Math.sin(s * 7); X.pegVuela(0, 'r199', { x: G1.CX, y: G1.CY + 0.05 * Math.sin(s * 2), z: G1.CZ, esc: E * late, rz: 0.03 * Math.sin(s * 1.5) });
      X.halo(0, { x: G1.CX, y: G1.CY, z: G1.CZ - 0.2, esc: 4.5 + 0.4 * Math.sin(s * 7), op: 0.55, color: 0xff4d4d }); }
    // the crowd: 9 mannequins walk toward the sticker and stop around it
    directo = (i) => { if (i >= 9) return { x: -60, z: -60, esc: 0 };
      const a = (i % 2 ? 1 : -1) * (0.62 + 0.17 * Math.floor(i / 2)), r0 = 3.9 + (i % 3) * 0.45, r1 = 1.85 + (i % 3) * 0.3, u = sale(tramo(d, 0.05 * i, 2.6 + 0.05 * i)), r = lerp(r0, r1, u);
      const x = G1.CX + r * Math.sin(a), z = G1.CZ + r * Math.cos(a);
      return Object.assign({ x, z, rot: Math.atan2(G1.CX - x, G1.CZ - z), amp: u < 0.98 ? 1 : 0, fase: s * 8 + i, esc: 1 }, blanco); };
    const t2 = Math.max(m1, m0 + 1.4);
    camR(W, plano(s, [
      [m0, (u) => dol([0.9, 1.5, 5.9, 0.0, 1.9, -1.2], [0.3, 1.35, 4.9, 0.0, 1.95, -1.2], 1.6, u)],
      [t2, (u) => orb(G1.CX, 2.1, G1.CZ, 5.4 - 0.3 * u, 0.7 + 0.1 * u, -0.25, 0.22, u)]
    ]));
  }
  return directo;
}

// ——— scene 2 · «It's called anchoring. §In a 1974 study, §{tic}a number from a spinning wheel §moved people's guesses by 20 points.» ———
const G2 = { RX: -0.62, RY: 1.9, RZ: -0.4, AX: 0.5, BX: 1.02, CZ: -0.3, K: 0.036, E: 0.8 };
function esc2(W, X, s, Dv, mk) {
  const m0 = mk(0, 1.3), m1 = mk(1, 2.5), m2 = mk(2, 4.2);
  const tA = m1 + 0.95, tB0 = Math.max(tA + 0.5, m2 - 0.35), tB = tB0 + 1.0;
  let ang;
  if (s < tA) ang = 2 * PI * 4 * (1 - sale(tramo(s, -0.3, tA))) + 10 / 5 * PI / 10;          // first spin, stops on 10
  else if (s < tB0) ang = 10 / 5 * PI / 10;
  else ang = 65 / 5 * PI / 10 + (2 * PI * 3 + (10 - 65) / 5 * PI / 10) * (1 - sale(tramo(s, tB0, tB)));   // second spin, stops on 65
  X.ruleta({ x: G2.RX, y: G2.RY, z: G2.RZ, ry: 0.18, ang, esc: G2.E });
  if (s > tA - 0.05 && s < tA + 0.5) X.halo(0, { x: G2.RX, y: G2.RY + 0.8, z: G2.RZ + 0.2, esc: 1.6 * sale(tramo(s, tA, tA + 0.5)) + 0.3, op: 0.9 * (1 - tramo(s, tA, tA + 0.5)), color: 0x5eead4 });
  if (s > tB - 0.05 && s < tB + 0.5) X.halo(1, { x: G2.RX, y: G2.RY + 0.8, z: G2.RZ + 0.2, esc: 1.6 * sale(tramo(s, tB, tB + 0.5)) + 0.3, op: 0.9 * (1 - tramo(s, tB, tB + 0.5)), color: 0xff6b6b });
  // guesses: 25 (after the 10) and 45 (after the 65), height ∝ answer from the floor
  const hA = 25 * G2.K * rebote(tramo(s, tA + 0.1, tA + 0.55)), hB = 45 * G2.K * rebote(tramo(s, tB + 0.1, tB + 0.6));
  X.bloque({ x: G2.AX, z: G2.CZ, w: 0.36, h: hA, color: '#5eead4', brillo: 0.3 });
  X.bloque({ x: G2.BX, z: G2.CZ, w: 0.36, h: hB, color: '#ef4444', brillo: 0.3 });
  W.rotulo('gA', '10 → 25%', G2.AX, hA + 0.3, G2.CZ, sale(tramo(s, tA + 0.3, tA + 0.6)), '#5eead4', 0.24);
  W.rotulo('gB', '65 → 45%', G2.BX, hB + 0.3, G2.CZ, sale(tramo(s, tB + 0.3, tB + 0.6)), '#f87171', 0.24);
  const d20 = sale(tramo(s, tB + 0.7, tB + 1.0));
  if (d20 > 0.01) { X.bloque({ x: G2.BX, z: G2.CZ, y: 25 * G2.K, w: 0.4, h: 20 * G2.K * d20, color: '#f5b94a', brillo: 0.5, op: 0.55 });
    W.rotulo('g20', '+20', G2.BX + 0.42, 35 * G2.K, G2.CZ + 0.2, d20, '#f5b94a', 0.3); }
  const t3 = Math.max(tB - 0.2, m2 + 0.2);
  camR(W, plano(s, [
    [0, (u) => dol([1.0, 2.1, 2.9, G2.RX, G2.RY, G2.RZ], [0.25, 2.0, 2.45, G2.RX, G2.RY, G2.RZ], m1, u)],
    [m1, (u) => orb(-0.4, 1.6, G2.CZ, 4.5, 1.8 - 0.1 * u, -0.2, 0.2, u)],
    [t3, (u) => dol([1.9, 1.0, 5.6, 0.35, 1.35, -0.35], [1.2, 1.25, 6.1, 0.25, 1.4, -0.35], Math.max(1, Dv - t3), u)]
  ]));
}

// ——— scene 3 · «FTC guides say a "was" price should have been openly offered, §in good faith, §for a reasonably substantial time. §{caja}If not, it's a false bargain.» ———
const G3 = { BX: -0.35, BY: 2.0, BZ: -0.4, BE: 1.25, PX: 1.55, PY: 3.5, PZ: 0.3 };
function esc3(W, X, s, Dv, mk) {
  const m0 = mk(0, 2.6), m1 = mk(1, 3.6), m2 = mk(2, 6.0);
  const dib = sale(tramo(s, 0.1, Math.min(2.2, m0)));
  const cur = s < m0 ? 30 * dib : 30 - 2 * suave(tramo(s, m0, m0 + 0.5));
  X.panel({ x: G3.BX, y: G3.BY, z: G3.BZ, ry: 0.12, esc: G3.BE, ej: 2, dib, cur, br: sale(tramo(s, m1 + 0.2, m1 + 0.8)) });
  // the stamp falls on the board
  if (s > m2 - 0.1) { const u = tramo(s, m2 - 0.1, m2 + 0.25), P = X.ptPanel(16, 150);
    const y = P.y + 2.6 * (1 - u * u), sq = s > m2 + 0.25 ? 1 - 0.35 * Math.sin(tramo(s, m2 + 0.25, m2 + 0.45) * PI) : 1;
    X.falso({ x: P.x, y, z: P.z + 0.12, ry: 0.12, rz: -0.12 + 0.6 * (1 - u), sz: sq, esc: 0.85 + 0.6 * (1 - u) });
    if (s > m2 + 0.25 && s < m2 + 0.75) X.halo(0, { x: P.x, y: P.y, z: P.z + 0.2, esc: 1 + 3 * sale(tramo(s, m2 + 0.25, m2 + 0.75)), op: 0.9 * (1 - tramo(s, m2 + 0.25, m2 + 0.75)), color: 0xff6b6b }); }
  const C = plano(s, [
    [0, (u) => dol([1.4, 2.6, 4.6, G3.BX, G3.BY, G3.BZ], [0.6, 2.25, 3.5, G3.BX, G3.BY, G3.BZ], Math.max(1, m1), u)],
    [m1, (u) => orb(G3.BX + 0.2, G3.BY + 0.05, G3.BZ, 4.1, 1.3 + 0.15 * u, 0.5, -0.2, u)],
    [m2 - 0.15, (u) => dol([-1.0, 2.6, 5.1, G3.BX, G3.BY, G3.BZ], [-0.6, 2.5, 4.7, G3.BX, G3.BY, G3.BZ], Math.max(1, Dv - m2), u)]
  ]);
  const sh = s > m2 + 0.25 && s < m2 + 0.7 ? 0.08 * Math.exp(-(s - m2 - 0.25) * 9) : 0;
  C[0] += sh * Math.sin(s * 83); C[1] += sh * Math.cos(s * 71);
  camR(W, C);
}

// ——— scene 4 · «A UK consumer group tracked Black Friday deals for a year: §{ding}83% were as cheap or cheaper at another time.» ———
const AMB = new Set(${JSON.stringify(AMARILLAS)});
function esc4(W, X, s, Dv, mk) {
  const m0 = mk(0, 2.8);
  X.pared((i) => { const c = i % 10, r = Math.floor(i / 10), x = -1.35 + c * 0.3, y = 0.35 + r * 0.36;
    const sube = rebote(tramo(s, 0.05 + 0.03 * (c + (9 - r) * 0.6), 0.5 + 0.03 * (c + (9 - r) * 0.6)));
    const tf = m0 + 0.02 * (c + r * 0.5), fl = tramo(s, tf, tf + 0.35), amb = AMB.has(i) && s > tf + 0.17;
    return { x, y: y * sube, z: -0.4, ry: PI * 2 * suave(fl) + 0.05 * Math.sin(s * 2 + i), esc: Math.max(0.001, sube), color: amb ? '#f5b94a' : '#64748b', brillo: amb ? 0.4 : 0.05 }; });
  if (s > m0 + 0.35 && s < m0 + 0.9) X.halo(0, { x: 0, y: 3.95, z: -0.2, esc: 1 + 3 * sale(tramo(s, m0 + 0.35, m0 + 0.9)), op: 0.8 * (1 - tramo(s, m0 + 0.35, m0 + 0.9)), color: 0xffc35a });
  camR(W, plano(s, [
    [0, (u) => dol([2.7, 1.5, 4.9, 0.2, 2.0, -0.4], [-1.6, 1.8, 5.1, -0.2, 2.1, -0.4], Math.max(1, m0 - 0.2), u)],
    [m0 - 0.2, (u) => dol([0.7, 1.6, 6.4, 0.0, 2.3, -0.4], [-0.3, 2.3, 8.0, 0.0, 2.45, -0.4], Math.max(1, Dv - m0 + 0.2), u)]
  ]));
}

// ——— scene 5 · «Check the price history, §or screenshot today's price and compare on Cyber Monday. §Ignore the $199. §{pop}Judge the $99.» ———
const G5 = { HX: -1.1, HZ: 1.5, PX: 0.85, PY: 3.9, PZ: 0.1, CAP: [-0.2, 2.6, 1.45] };
function brazos(a, qa, qp) {
  const ax = -2.75 * (1 - qp) - 0.95 * qp, az = -0.1 * (1 - qp) - 0.2 * qp, cx = -0.15 * (1 - qp) - 1.15 * qp;
  [[a.izq, -1], [a.der, 1]].forEach(([b, sg]) => { b.hombro.rotation.x = lerp(b.hombro.rotation.x, ax, qa); b.hombro.rotation.z = lerp(b.hombro.rotation.z, sg * az, qa); b.codo.rotation.x = lerp(b.codo.rotation.x, cx, qa); });
}
function manos(hx, hz, g, qp) { const ly = 2.2 * (1 - qp) + 1.5 * qp, lz = 0.3 * (1 - qp) + 0.62 * qp; return [hx + Math.sin(g) * lz, ly, hz + Math.cos(g) * lz]; }
function esc5(W, X, s, Dv, mk) {
  const m0 = mk(0, 1.5), m1 = mk(1, 4.6), m2 = mk(2, 5.7);
  const gT = Math.atan2(G5.PX - G5.HX, G5.PZ - G5.HZ);
  W.heroe({ x: G5.HX, z: G5.HZ, gira: gT, luz: sale(tramo(s, 0.05, 0.5)) });
  const qp = 0.3; brazos(W.H, 1, qp);
  const mp = manos(G5.HX, G5.HZ, gT, qp), tFl = m0 + 0.75;
  X.movil({ x: mp[0], y: mp[1] + 0.06, z: mp[2], ry: gT + PI, rx: 0.08, pant: { tipo: s > tFl ? 'hoy' : 'hist', cur: 30 - 21 * sale(tramo(s, 0.15, Math.min(1.3, m0))) } });
  if (s > tFl && s < tFl + 0.5) { const u = tramo(s, tFl, tFl + 0.5); X.halo(1, { x: mp[0], y: mp[1] + 0.1, z: mp[2], esc: 0.6 + 2.6 * sale(u), op: 1 - u, color: 0xffffff }); }
  if (s > tFl + 0.05 && s < m1) { const u = tramo(s, tFl + 0.05, tFl + 0.6), e_ = sale(u), p = mezcla(mp, G5.CAP, e_); X.captura({ x: p[0], y: p[1], z: p[2], ry: 0.25 * e_, esc: 0.3 + 0.7 * e_ }); }
  // the shop's tag: WAS $199 · NOW $99. «Ignore the $199»: the sticker peels off and falls; on {pop} the $99 lights up
  const td = 0.2, tt = s - td;
  X.etiqueta({ x: G5.PX, y: G5.PY + 1.9 * Math.pow(1 - sale(tramo(s, td, td + 0.5)), 2), z: G5.PZ, ry: -0.2, rz: 0.14 * Math.exp(-2 * Math.max(0, tt)) * Math.sin(7 * tt) + 0.02 * Math.sin(s * 1.3),
    peg: { r199: s < m1 + 0.15 ? 1 : 0 }, ins: 0.3 * Math.sin(s * 3), insOp: 1 - tramo(s, m1 + 0.15, m1 + 0.4) });
  if (s > m1 + 0.15 && s < m1 + 1.6) { const sl = X.ptEti(X.SX, X.SY, 0.05), d = s - m1 - 0.15, y = sl.y + 0.6 * d - 4.9 * d * d;
    X.pegVuela(1, 'r199', { x: sl.x + 0.5 * d, y: Math.max(0.02, y), z: sl.z + 0.8 * d, rx: y > 0.02 ? -6 * d : -PI / 2, rz: 3 * d }); }
  if (s > m2) { const n = X.ptEti(0.18, -0.25, 0.1), q = sale(tramo(s, m2, m2 + 0.35));
    X.halo(2, { x: n.x, y: n.y, z: n.z, esc: 2.2 + 0.6 * Math.sin(tramo(s, m2, m2 + 0.4) * PI), op: 0.4 * q, color: 0x5eead4 });
  }
  const O = [-1.75, 2.85, 2.5, -0.65, 2.1, 1.0];
  camR(W, plano(s, [
    [0, (u) => dol([-1.95, 2.75, 2.75, -0.75, 2.05, 1.1], O, Math.max(1, m0), u)],
    [m0, (u) => dol([1.7, 2.3, 6.4, 0.2, 2.45, 0.5], [1.0, 2.5, 7.0, 0.2, 2.5, 0.5], Math.max(1, m1 - m0), u)],
    [m1 - 0.1, (u) => dol([2.4, 2.7, 5.0, G5.PX + 0.2, 2.85, G5.PZ], [1.9, 2.8, 4.4, G5.PX + 0.2, 2.9, G5.PZ], Math.max(1, Dv - m1), u)]
  ]));
}
`;

// 2D layer: 2–4 word labels in the lower-middle third (y ≈ 1.335 px), a small note at the bottom left.
const nota = (txt) => `<div class="nota">${txt}</div>`;
const rt = (cls, html, top) => `<div class="rt ${cls}" data-t="translateX(-50%)"${top ? ` style="top:${top}px"` : ''}>${html}</div>`;
const ESCENAS = [
  // 0 · Hook: no 2D label while the board rewinds (its readout and the tag are the labels); then «NOV 6: $99», «REAL DISCOUNT: 0%»,
  //     «3 WEEKS AGO: $99».
  { html: () => rt('amb', 'NOV 6: <span class="a">$99</span>') + rt('amb', 'REAL DISCOUNT: <span class="a">0%</span>') + rt('amb', '3 WEEKS AGO: <span class="a">$99</span>'),
    anim: function (s, e, el) { const M = e.seg[0].marcas, mP = M[0] != null ? M[0] : 2.6, r = el.querySelectorAll('.rt');
      ver(r[0], s, 0.62, 1.55); ver(r[1], s, 1.95, mP + 0.6); ver(r[2], s, mP + 0.7); } },
  // 1 · «REAL DISCOUNT: 0%» → «WHY DOES $199 STILL WORK?»
  { html: () => rt('amb', 'REAL DISCOUNT: <span class="a">0%</span>') + rt('roja p', 'WHY DOES <span class="r">$199</span> STILL WORK?'),
    anim: function (s, e, el) { const M = e.seg[0].marcas, m0 = M[0] != null ? M[0] : 1.7, r = el.querySelectorAll('.rt');
      ver(r[0], s, 0.15, m0); ver(r[1], s, m0 + 0.2); } },
  // 2 · ANCHORING → the 1974 wheel.
  { html: () => rt('turq', '<span class="t">ANCHORING</span>') + rt('turq p', 'WHEEL: 10 → GUESS <span class="t">25%</span>') + rt('roja p', 'WHEEL: 65 → GUESS <span class="r">45%</span>') +
      nota('Tversky &amp; Kahneman, Science, 1974 · guesses: % of<br>African countries in the UN (median of each group)'),
    anim: function (s, e, el) { const M = e.seg[0].marcas, m1 = M[1] != null ? M[1] : 2.5, m2 = M[2] != null ? M[2] : 4.2, r = el.querySelectorAll('.rt');
      const tA = m1 + 0.95, tB = Math.max(tA + 0.5, m2 - 0.35) + 1.0;
      ver(r[0], s, 0.15, m1); ver(r[1], s, tA + 0.2, tB - 0.1); ver(r[2], s, tB + 0.2); ver(el.querySelector('.nota'), s, m1 - 0.2); } },
  // 3 · FTC.
  { html: () => rt('turq p', 'FTC: <span class="t">OFFERED OPENLY</span>, IN GOOD FAITH') + rt('roja p', 'FOR A <span class="r">“REASONABLY SUBSTANTIAL”</span> TIME') + rt('roja', '“A <span class="r">FALSE</span> BARGAIN”') +
      nota('FTC Guides Against Deceptive Pricing, 16 CFR 233.1<br>a guide, not a fixed 30-day rule · example prices'),
    anim: function (s, e, el) { const M = e.seg[0].marcas, m1 = M[1] != null ? M[1] : 3.6, m2 = M[2] != null ? M[2] : 6.0, r = el.querySelectorAll('.rt');
      ver(r[0], s, 0.3, m1); ver(r[1], s, m1 + 0.1, m2); ver(r[2], s, m2 + 0.3); ver(el.querySelector('.nota'), s, 0.4); } },
  // 4 · Which? (UK).
  { html: () => rt('p', 'UK · <span class="a">WHICH?</span> · 175 PRODUCTS') + rt('amb g', '<span class="a">83%</span>', 1150) + rt('amb p2', 'AS CHEAP OR CHEAPER ANOTHER TIME') +
      nota('Which? (UK consumer group), Nov 25, 2025 · 8 retailers<br>prices May 2024–May 2025 vs. the Nov 15–Dec 12, 2024 sale'),
    anim: function (s, e, el) { const M = e.seg[0].marcas, m0 = M[0] != null ? M[0] : 2.8, r = el.querySelectorAll('.rt');
      ver(r[0], s, 0.25, m0); ver(r[1], s, m0 + 0.35); ver(r[2], s, m0 + 0.5); ver(el.querySelector('.nota'), s, 0.3); } },
  // 5 · Close: CHECK THE PRICE HISTORY → OR SCREENSHOT → COMPARE MONDAY → IGNORE THE $199 → JUDGE THE $99 (cut on that image).
  { html: () => rt('turq', 'CHECK THE <span class="t">PRICE HISTORY</span>') + rt('turq p2', 'OR <span class="t">SCREENSHOT</span> → COMPARE MONDAY') + rt('roja', 'IGNORE THE <span class="x">$199</span>') + rt('turq g', 'JUDGE THE <span class="t">$99</span>'),
    anim: function (s, e, el) { const M = e.seg[0].marcas, m0 = M[0] != null ? M[0] : 1.5, m1 = M[1] != null ? M[1] : 4.6, m2 = M[2] != null ? M[2] : 5.7, r = el.querySelectorAll('.rt');
      ver(r[0], s, 0.2, m0); ver(r[1], s, m0 + 0.1, m1); ver(r[2], s, m1 + 0.05, m2); ver(r[3], s, m2 + 0.05); } }
];

const TRES = function (t, k, s, e, W) {
  const X = W.X; X.apagar();
  const Dv = e.fin - e.ini, M = e.seg.flatMap(g => g.marcas);
  const mk = (j, def) => (M[j] != null ? M[j] : def);
  W.cam.up.set(0, 1, 0);
  let directo = null;
  if (k === 0) gancho(W, X, s, mk(0, 2.6), Dv);
  else directo = [null, esc1, esc2, esc3, esc4, esc5][k](W, X, s, Dv, mk);
  W.multitud(t, { directo: directo || (() => ({ x: -60, z: -60, esc: 0 })) });
};

const pildoras = {
  'en-black-friday-was-price': pildora3d({
    slug: 'en-black-friday-was-price', cuenta: 'en',
    T: { en: { titulo: 'Was $199, now $99. Three weeks ago it was already $99', guion: GUION } },
    // Narrator voice of reto-en.js / extenso-thanksgiving-en.js (never VOZ_SECA); tempo 1.17 / pauses 0.26 measured 2.65 words/s there.
    voz: { ...VOZ_NARRADOR, en: { ...VOZ_NARRADOR.en, tempo: 1.17, pausaMax: 0.26 } },
    sub: { max: 4, largo: 20, sinSuelta: true },
    fijo: () => `<div class="hud i fmt">MONEY, EXPLAINED</div><div class="hud d"><i></i><span id="reloj">00:00</span></div>`,
    cssExtra: CSS, scriptExtra: SCRIPT,
    datos: () => ({ H1, H2 }),
    escenas: ESCENAS, tres: TRES,
    cola: 0.8, corte2d: 'seco',
    texto: { en: TEXTO }
  })
};

module.exports = { pildoras };
