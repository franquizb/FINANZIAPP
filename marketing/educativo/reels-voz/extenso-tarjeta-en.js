// Long format (35–50 s) · @finanziapp (US), in 3D (reels-voz/tres.js), series «Money, explained».
// en-credit-card-minimum · «$3,000 on a card, paying only the minimum: 15 years and $4,515 in interest.» (example)
// Script: guiones/2026-11-en-credit-card-minimum.md (visual hook, scenes, cuadra(), sources, post, cover).
// To publish Sunday Nov 29, 2026, 11:00 New York (after Black Friday and the Cyber weekend).
// Model: reels-voz/extenso-hipoteca-en.js (en-mortgage-rate): an interest counter that climbs in front of you and a red pile
// that outgrows yours.
//
// Sources (checked 26 Nov 2026):
// - Federal Reserve, G.19 Consumer Credit, release of Nov 6, 2026 (September 2026 data), «Terms of Credit», commercial bank
//   interest rates, credit card plans, «Accounts assessed interest»: 2026 Q3 (p) 22.36% (Q2 22.15%, Q1 21.52%, 2025 avg 22.32%).
//   https://www.federalreserve.gov/releases/g19/current/default.htm
// - Credit CARD Act of 2009, Pub. L. 111-24 (May 22, 2009), Sec. 201 «Payoff timing disclosures» (TILA 127(b)(11), 15 U.S.C.
//   1637(b)(11)): «Minimum Payment Warning…», months to repay with minimum payments, total cost, «the monthly payment amount that
//   would be required … to eliminate the outstanding balance in 36 months». https://www.govinfo.gov/content/pkg/PLAW-111publ24/html/PLAW-111publ24.htm
// - eCFR, 12 CFR 1026.7(b)(12) (Regulation Z), version of Nov 20, 2026: bold heading «Minimum Payment Warning: If you make only the
//   minimum payment each period, you will pay more in interest and it will take you longer to pay off your balance»; minimum payment
//   repayment estimate (years), total cost estimate, estimated monthly payment for repayment in 36 months, its total cost and the
//   savings estimate; the 36-month lines are left out when the minimum pays it off in 3 years or less ((b)(12)(i)(F)(2)); exemptions
//   in (b)(12)(v). https://www.ecfr.gov/current/title-12/chapter-X/subchapter-B/part-1026/subpart-B/section-1026.7
// - eCFR, Appendix M1 to Part 1026: estimates use the minimum payment formula of the account (each issuer has its own).
// - CFPB, «A box on my credit card bill says that I will pay off the balance in three years…» (reviewed Jan 22, 2024): based on the
//   current balance, no future purchases; you only have to pay the minimum. https://www.consumerfinance.gov/ask-cfpb/a-box-on-my-credit-card-bill-says-that-i-will-pay-off-the-balance-in-three-years-if-i-pay-a-certain-amount-what-does-that-mean-do-i-have-to-pay-that-much-if-i-pay-that-much-and-make-new-purchases-will-i-still-owe-nothing-after-three-years-en-36/
// - Every figure of the card is OUR EXAMPLE, month-by-month amortization below: $3,000, APR 22.36%, monthly interest = APR / 12 on
//   the balance (banks use the average daily balance), no new charges or fees, example minimum = 1% of the balance + that month's
//   interest, at least $25. Labelled «Example» on screen and in the post; the statement card is a generic format («Example statement»),
//   no issuer or brand.
const { pildora3d } = require('./tres');
const { VOZ_NARRADOR } = require('./_comun');
const { cuadra } = require('../reels/_comun');

// ——— checks (guiones/2026-11-en-credit-card-minimum.md, «Cuentas») ———
const APR = 22.36, I = APR / 1200, B = 3000, SUELO = 25, PCT = 0.01;
const H = [{ m: 0, s: B, int: 0, pag: 0, p: 0, it: 0 }];
{ let s = B, int = 0, pag = 0, m = 0;
  while (s > 1e-9) { m++; const it = s * I; const p = Math.min(Math.max(s * PCT + it, SUELO), s + it); int += it; pag += p; s = s + it - p; H.push({ m, s, int, pag, p, it }); } }
const N = H.length - 1, INT = H[N].int;
cuadra('meses pagando el mínimo', N, 180);                                  // «15 years»
cuadra('años', N / 12, 15);
cuadra('intereses', Math.round(INT), 4515);                                 // «$4,515»
cuadra('más intereses que lo comprado', INT > B, true);                     // «more interest than you spent»
cuadra('total pagado', Math.round(H[N].pag), 7515);                         // statement: «$7,515»
cuadra('primer pago', Math.round(H[1].p * 100) / 100, 85.9);                // «$86»
cuadra('suelo de 25 desde el pago', H.find(h => h.m > 0 && h.p === SUELO).m, 124);
cuadra('intereses pasan de 3.000 en el pago', H.find(h => h.int > B).m, 77); // «INTEREST > $3,000»
cuadra('saldo a 3 años', Math.round(H[36].s), 2089);                        // «over $2,000»
cuadra('más de 2.000', H[36].s > 2000, true);
cuadra('pagado en 3 años', Math.round(H[36].pag), 2608);
cuadra('intereses en 3 años', Math.round(H[36].int), 1697);
const c36 = B * I / (1 - Math.pow(1 + I, -36));
cuadra('cuota a 36 meses', Math.round(c36 * 100) / 100, 115.13);            // «about $115 a month»
cuadra('intereses a 36 meses', Math.round(c36 * 36 - B), 1145);             // «about $1,145»
cuadra('total a 36 meses', Math.round(c36 * 36), 4145);
cuadra('ahorro', Math.round(INT - (c36 * 36 - B)), 3370);                   // «−$3,370»
cuadra('bloques: 30 / 45 / 11 / 34', [B / 100, Math.round(INT / 100), Math.round((c36 * 36 - B) / 100), Math.round(INT / 100) - Math.round((c36 * 36 - B) / 100)].join('/'), '30/45/11/34');
// on screen besides the script
cuadra('pantalla: 36 pagos de 115,13 cuadran', (() => { let s = B; for (let k = 0; k < 36; k++) s = s * (1 + I) - c36; return Math.abs(s) < 1e-6; })(), true);
cuadra('pantalla: bloques blancos a 3 años (debes)', Math.round(H[36].s / 100), 21);
cuadra('pantalla: bloques rojos a 3 años', Math.round(H[36].int / 100), 17);
cuadra('pantalla: 9 + 17 = 26 bloques pagados ≈ $2,608', (30 - 21) + 17, 26);
cuadra('pantalla: el bloque 46 es una lámina (0,15)', Math.round((INT / 100 - 45) * 100) / 100, 0.15);
cuadra('pantalla: «$25» desde el pago 124 hasta el 179', [H[124].p, H[179].p].join('/'), '25/25');
const pago150 = (() => { let s = B, m = 0, int = 0; while (s > 1e-9) { m++; const it = s * I; int += it; s = s + it - Math.min(150, s + it); } return [m, Math.round(int)]; })();
cuadra('texto: 150 $/mes', pago150.join('/'), '26/789');

// Month-by-month history for the page (same numbers as above): [balance, interest so far, paid so far, payment, interest of the month]
const HIST = H.map(h => [h.s, h.int, h.pag, h.p, h.it].map(x => Math.round(x * 100) / 100));

const TEXTO = `$3,000 on a card, paying only the minimum: 15 years and $4,515 in interest.

A minimum set as a percentage of the balance shrinks as the balance does, so the debt barely moves. In this example, after 3 years of minimum payments you've paid $2,608 and still owe $2,089.

Under the Credit CARD Act of 2009, your statement must show a "Minimum Payment Warning": how long the minimum takes, what it costs, and the monthly payment that clears the balance in 36 months (when paying the minimum would take longer than 3 years). In this example: about $115 a month, $1,145 in interest. A fixed $150 a month: 26 months, about $789.

Today: find that box on your statement and, if you can, pay at least the 36-month amount. Once the card is paid off, that same monthly payment can build an emergency fund and then long-term savings and investing. Investment returns aren't guaranteed.

Example: $3,000 balance, 22.36% APR, no new charges or fees; minimum = 1% of balance + interest, at least $25. Each issuer sets its own formula.
Sources: Federal Reserve G.19 (Q3 2026, accounts assessed interest: 22.36%) · Regulation Z, 12 CFR 1026.7(b)(12) · CFPB.
Educational only, not financial advice.

#creditcards #debtfree #personalfinance`;
cuadra('texto ≤ 1.600 caracteres', TEXTO.length <= 1600, true);

const GUION = [
  [0, '$3,000 on a card, §paying only the minimum: §{pop}*15 years*, §and *$4,515* in interest.'],
  [1, 'That\'s more interest than you spent, §because the minimum *shrinks* §with the balance.'],
  [2, '§After three years of payments, §you still owe *over $2,000*.'],
  [3, 'So what should you pay? §A 2009 federal law §puts the answer on your statement: §{caja}the *Minimum Payment Warning*.'],
  [4, 'It shows how long the minimum takes, §and the payment to finish in *three years*: §{ding}here, about *$115 a month*, §and about *$1,145* in interest.'],
  [5, 'Today, find that box §and, if you can, §pay at least that much. §The minimum is the slowest way out; §{pop}what you stop paying in interest §can *start your savings*.']
];

const MONO = `'DejaVu Sans Mono', 'Liberation Mono', monospace`;
const CSS = `
  .hud.i.fmt { letter-spacing: .14em; }
  .vin { background: radial-gradient(130% 80% at 50% 46%, transparent 52%, rgba(3,5,12,.62) 100%),
      linear-gradient(rgba(7,11,22,.92) 0%, rgba(7,11,22,.76) 13%, rgba(7,11,22,.68) 24.5%, rgba(7,11,22,.22) 29.5%, transparent 33%, transparent 76%, rgba(7,11,22,.8) 100%); }
  .rt { position: absolute; left: 50%; top: 1335px; padding: 10px 28px 14px; border-radius: 20px; background: rgba(9,14,27,.9); border: 3px solid #e2e8f0;
    color: #fff; font-size: 58px; line-height: 1.12; font-weight: 900; letter-spacing: -.015em; white-space: nowrap; opacity: 0; font-variant-numeric: tabular-nums;
    box-shadow: 0 10px 40px rgba(0,0,0,.45); text-align: center; }
  .rt.p { font-size: 46px; } .rt.amb { border-color: #f5b94a; } .rt.roja { border-color: #f87171; } .rt.turq { border-color: #5eead4; }
  .rt .a { color: #f5b94a; } .rt .r { color: #f87171; } .rt .t { color: #5eead4; } .rt small { display: block; font: 700 26px/1.5 ${MONO}; letter-spacing: .08em; color: #cbd5e1; }
  .nota { position: absolute; left: 70px; top: 1436px; max-width: 900px; font: 600 22px/1.25 ${MONO}; color: #b6c2d4; background: rgba(7,11,22,.84);
    border-radius: 10px; padding: 4px 12px; opacity: 0; }
  /* the hook's counter: ONE big red figure under the subtitles */
  .cont { position: absolute; left: 50%; top: 492px; transform: translateX(-50%); text-align: center; white-space: nowrap; font-variant-numeric: tabular-nums; }
  .cont small { display: block; font: 700 26px/1.3 ${MONO}; letter-spacing: .16em; color: #fca5a5; }
  .cont b { display: block; font-size: 150px; line-height: .98; font-weight: 900; letter-spacing: -.035em; color: #f87171; text-shadow: 0 6px 40px rgba(220,38,38,.45); }
  .cont i { display: block; font-style: normal; font: 700 30px/1.3 ${MONO}; letter-spacing: .08em; color: #e2e8f0; margin-top: 4px; }
  .chip { position: absolute; top: 505px; background: rgba(9,14,27,.9); border: 3px solid #cbd5e1; border-radius: 20px; padding: 6px 22px 10px;
    font-variant-numeric: tabular-nums; white-space: nowrap; opacity: 0; }
  .chip small { display: block; font: 700 22px/1.35 ${MONO}; letter-spacing: .14em; color: #94a3b8; }
  .chip b { display: block; font-size: 62px; line-height: 1.02; font-weight: 900; color: #fff; letter-spacing: -.01em; }
  .chip.izq { left: 66px; } .chip.der { right: 66px; text-align: right; }
  /* generic statement (format of Reg Z sample G-18(C)), no issuer */
  .ext { position: absolute; left: 50%; top: 540px; width: 900px; background: #f8fafc; color: #0f172a; border-radius: 26px; padding: 26px 34px 30px;
    box-shadow: 0 30px 80px rgba(0,0,0,.6); opacity: 0; transform-origin: 50% 40%; }
  .ext .cab { display: flex; justify-content: space-between; align-items: baseline; font: 700 23px/1.3 ${MONO}; letter-spacing: .12em; color: #64748b;
    border-bottom: 3px solid #e2e8f0; padding-bottom: 12px; }
  .ext .f { display: flex; justify-content: space-between; font-size: 34px; font-weight: 650; padding: 8px 6px; color: #334155; }
  .ext .f b { font-weight: 850; color: #0f172a; }
  .ext .mpw { margin-top: 12px; border: 5px solid transparent; border-radius: 16px; padding: 12px 16px; font-size: 27px; line-height: 1.28; color: #334155; }
  .ext .mpw b { display: block; font-size: 36px; font-weight: 900; color: #0f172a; margin-bottom: 2px; }
  .ext table { width: 100%; border-collapse: separate; border-spacing: 0 6px; margin-top: 8px; font-variant-numeric: tabular-nums; }
  .ext th { font: 700 18px/1.25 ${MONO}; letter-spacing: .02em; color: #64748b; text-align: left; vertical-align: bottom; padding: 0 10px 4px; }
  .ext td { font-size: 33px; font-weight: 800; color: #0f172a; padding: 10px; border-top: 4px solid transparent; border-bottom: 4px solid transparent; }
  .ext td:first-child { border-left: 4px solid transparent; border-radius: 12px 0 0 12px; } .ext td:last-child { border-right: 4px solid transparent; border-radius: 0 12px 12px 0; }
  .ext td small { display: block; font: 700 19px/1.2 ${MONO}; color: #0f766e; }
  .mini { position: absolute; left: 50%; top: 560px; width: 760px; background: #f8fafc; color: #0f172a; border-radius: 22px; padding: 18px 26px 22px; opacity: 0;
    box-shadow: 0 24px 70px rgba(0,0,0,.6); border: 6px solid #f5b94a; }
  .mini b { display: block; font-size: 38px; font-weight: 900; }
  .mini .fila { display: flex; justify-content: space-between; font-size: 34px; font-weight: 800; margin-top: 10px; padding: 6px 12px; border-radius: 12px; background: rgba(45,212,191,.18); }
`;

const SCRIPT = `
const PI = Math.PI, ROJOH = 0xdc2626, TURQH = 0x2dd4bf, GRISH = 0xb4bac6, BLANCOH = 0xe6ebf2;
const HIST = ${JSON.stringify(HIST)};
const WX = -1.45, RX = 1.45;
const mezcla = (P, Q, u) => P.map((v, j) => v + (Q[j] - v) * u);
const suave = (x) => x * x * (3 - 2 * x);
const angulo = (a, b, g) => a + ((((b - a + PI) % (2 * PI)) + 2 * PI) % (2 * PI) - PI) * g;
const pl = (x, P) => { if (x <= P[0][0]) return P[0][1]; for (let j = 0; j < P.length - 1; j++) if (x <= P[j + 1][0]) return P[j][1] + (P[j + 1][1] - P[j][1]) * (x - P[j][0]) / (P[j + 1][0] - P[j][0]); return P[P.length - 1][1]; };
function ver(n, s, a, b) { if (!n) return; let p = a < -0.5 ? 1 : rebote(tramo(s, a - 0.1, a + 0.25)); if (b != null) p *= 1 - tramo(s, b - 0.12, b); aparece3(n, p); }
// Camera along keyframes (Hermite spline, never stops) and orbit (from extenso-hipoteca-en.js / desmentido-en.js).
const ruta = (K, x) => {
  if (x <= K[0][0]) { const v = K[1][1].map((c, j) => (c - K[0][1][j]) / (K[1][0] - K[0][0])); return K[0][1].map((c, j) => c + v[j] * (x - K[0][0])); }
  if (x >= K[K.length - 1][0]) return K[K.length - 1][1];
  let j = 0; while (x > K[j + 1][0]) j++;
  const [t0, P0] = K[j], [t1, P1] = K[j + 1], dt = t1 - t0, u = (x - t0) / dt;
  const vel = (n) => n === 0 ? K[1][1].map((v, c) => (v - K[0][1][c]) / (K[1][0] - K[0][0])) : n === K.length - 1 ? P0.map(() => 0)
    : K[n + 1][1].map((v, c) => (v - K[n - 1][1][c]) / (K[n + 1][0] - K[n - 1][0]));
  const V0 = vel(j), V1 = vel(j + 1), u2 = u * u, u3 = u2 * u;
  return P0.map((v, c) => (2 * u3 - 3 * u2 + 1) * v + (u3 - 2 * u2 + u) * dt * V0[c] + (-2 * u3 + 3 * u2) * P1[c] + (u3 - u2) * dt * V1[c]);
};
const orbita = (C, ang) => { const dx = C[0] - C[3], dz = C[2] - C[5], c = Math.cos(ang), s_ = Math.sin(ang); return [C[3] + dx * c + dz * s_, C[1], C[5] - dx * s_ + dz * c, C[3], C[4], C[5]]; };
const orden = (K) => { for (let j = 1; j < K.length; j++) if (K[j][0] <= K[j - 1][0] + 0.05) K[j][0] = K[j - 1][0] + 0.05; return K; };
// The example card at a (fractional) month m: interpolated between whole months (same numbers as cuadra()).
const EN = (m) => { m = Math.max(0, Math.min(180, m)); const a = Math.floor(m), b = Math.min(180, a + 1), u = m - a; return HIST[a].map((v, j) => v + (HIST[b][j] - v) * u); };
// Hook clock: payment number at each instant of scene 0 (payment 36 on frame 0, payment 77 at 0.62 s, payment 180 at TS).
const mesG = (s, TS) => pl(s, [[0, 36], [0.62, 77], [0.62 + (TS - 0.62) * 0.45, 128], [TS, 180]]);
// Red blocks settled = floor(interest / $100): block 30 lands exactly when interest passes $3,000 (payment 77); the 46th, a thin
// slab ($15 of $100), lands with payment 180.
const rojosG = (s, TS) => { const m = mesG(s, TS); return m >= 179.999 ? 46 : Math.min(45, Math.floor(EN(m)[1] / 100)); };
const TLG_ = {};
function TLG(TS) { const k = TS.toFixed(3); if (TLG_[k]) return TLG_[k];
  const t = new Array(46).fill(99), n0 = rojosG(0, TS); for (let j = 0; j < n0; j++) t[j] = -1;
  for (let i = 0; i <= 4000; i++) { const s = i / 1000, n = rojosG(s, TS); for (let j = n0; j < n; j++) if (t[j] === 99) t[j] = s; }
  return (TLG_[k] = t); }
const CAIDA = 0.28;
function bloqueG(j, s, TS) {
  const T0 = TLG(TS)[j]; if (T0 > 50) return null;
  if (s >= T0) { const d = s - T0; return { color: ROJOH, brillo: 0.32, dy: T0 < 0 ? 0 : 0.14 * Math.exp(-d * 15) * Math.sin(d * 32) }; }
  if (s < T0 - CAIDA) return null;
  const u = (s - T0 + CAIDA) / CAIDA; return { color: ROJOH, brillo: 0.4, dy: 3.0 * (1 - u * u), rz: 0.8 * (1 - u) * (j % 2 ? 1 : -1), rx: 0.5 * (1 - u) };
}

// highlight a table row of the statement card: 0..1 border and tint
function filaEstilo(tr, q, color) {
  tr.querySelectorAll('td').forEach(td => { td.style.borderColor = 'rgba(' + color + ',' + q.toFixed(2) + ')'; td.style.background = 'rgba(' + color + ',' + (0.2 * q).toFixed(2) + ')'; });
}
const X3 = (() => {
  const W = W3, T = W.T, S = W.S, objs = [], sueltos = [];
  const grupo = () => { const g = new T.Group(); g.visible = false; S.add(g); objs.push(g); return g; };
  const mat = (c, o) => new T.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.55, metalness: 0.08 }, o || {}));
  const lienzo = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const tx = new T.CanvasTexture(c); tx.encoding = T.sRGBEncoding; tx.anisotropy = 4; return { c, x: c.getContext('2d'), tx }; };
  const haloTx = (() => { const l = lienzo(256, 256), g = l.x.createRadialGradient(128, 128, 0, 128, 128, 128); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.3, 'rgba(255,255,255,.4)'); g.addColorStop(1, 'rgba(255,255,255,0)'); l.x.fillStyle = g; l.x.fillRect(0, 0, 256, 256); l.tx.needsUpdate = true; return l.tx; })();
  const LUCES = S.children.filter(o => o.isHemisphereLight || o.isDirectionalLight).map(l => [l, l.intensity]);
  function apagon(f) { LUCES.forEach(([l, i0]) => { l.intensity = i0 * f; }); }

  // ——— towers of $100 blocks, 5 wide, filled bottom up row by row (serpentine) ———
  const LB = 0.42, geoB = new T.BoxGeometry(LB * 0.9, LB * 0.9, LB * 1.3), POS = [];
  for (let r = 0; r < 12; r++) for (let c = 0; c < 5; c++) { const cc = r % 2 ? 4 - c : c; POS.push([(cc - 2) * LB, r * LB + LB / 2, 1]); }
  function hazTorre(n) {
    const g = grupo(), piv = new T.Group(); g.add(piv); const bl = [];
    for (let j = 0; j < n; j++) { const m = new T.Mesh(geoB, mat(GRISH, { transparent: true })); m.castShadow = true; m.receiveShadow = true; piv.add(m); bl.push(m); }
    return { g, piv, bl };
  }
  const TORRES = { blanca: hazTorre(30), roja: hazTorre(46), ahorro: hazTorre(34) };
  const ALTO = { roja: (j) => j === 45 ? 0.15 : 1 };   // the 46th red block is a thin slab: $15 of $100
  // o = { x, z, rot, esc, pulso, inclina, bloque: (j) => null | { color, brillo, op, dx, dy, dz, rx, ry, rz, s } }
  function torre(id, o) {
    const C = TORRES[id]; C.g.visible = true; C.g.position.set(o.x || 0, o.y || 0, o.z || 0); C.g.rotation.y = o.rot || 0;
    C.g.scale.setScalar((o.esc || 1) * (o.pulso || 1)); C.piv.rotation.z = o.inclina || 0;
    C.bl.forEach((m, j) => {
      const d = o.bloque ? o.bloque(j) : {}; if (!d) { m.visible = false; return; }
      const p = POS[j], mt = m.material, op = d.op == null ? 1 : d.op; m.visible = op > 0.01; if (!m.visible) return;
      const h = ALTO[id] ? ALTO[id](j) : 1;
      mt.color.set(d.color == null ? GRISH : d.color); mt.emissive.set(d.color == null ? 0x000000 : d.color).multiplyScalar(d.brillo == null ? 0.25 : d.brillo);
      mt.opacity = op; mt.depthWrite = op > 0.99;
      m.position.set(p[0] + (d.dx || 0), p[1] - (1 - h) * LB * 0.45 + (d.dy || 0), d.dz || 0); m.rotation.set(d.rx || 0, d.ry || 0, d.rz || 0);
      const sc = Math.max(0.001, d.s == null ? 1 : d.s); m.scale.set(sc, sc * h, sc);
    });
  }
  function dondeB(o, j) { const p = POS[j], e = o.esc || 1; return [(o.x || 0) + p[0] * e, p[1] * e, (o.z || 0)]; }

  // ——— generic boxes (lit) and glowing strips: a pool reused every frame ———
  const geoU = new T.BoxGeometry(1, 1, 1), cajas = []; let nc = 0;
  function bloque(o) {
    if (nc >= cajas.length) { const m = new T.Mesh(geoU, mat(0xffffff, { transparent: true })); m.castShadow = true; m.receiveShadow = true; S.add(m); cajas.push(m); sueltos.push(m); }
    const m = cajas[nc++], mt = m.material, op = o.op == null ? 1 : o.op; m.visible = op > 0.01;
    mt.color.set(o.color || '#e2e8f0'); mt.emissive.set(o.color || '#e2e8f0').multiplyScalar(o.brillo == null ? 0.15 : o.brillo); mt.opacity = op; mt.depthWrite = op > 0.99;
    m.position.set(o.x, o.y, o.z); m.rotation.set(o.rx || 0, o.ry || 0, o.rz || 0); m.scale.set(Math.max(0.001, o.w), Math.max(0.001, o.h), Math.max(0.001, o.d));
    return m;
  }
  // ——— halos (flashes) ———
  const halos = Array.from({ length: 4 }, () => { const s = new T.Sprite(new T.SpriteMaterial({ map: haloTx, color: 0xffffff, blending: T.AdditiveBlending, depthWrite: false, transparent: true })); s.visible = false; S.add(s); sueltos.push(s); return s; });
  let nh = 0;
  function halo(o) { if (nh >= halos.length) return; const s = halos[nh++]; s.visible = (o.op || 0) > 0.01; s.position.set(o.x, o.y, o.z); s.scale.setScalar(o.esc || 1); s.material.opacity = o.op || 0; s.material.color.set(o.color || '#ffffff'); }

  function apagar() { objs.forEach(g => { g.visible = false; }); sueltos.forEach(m => { m.visible = false; }); nc = 0; nh = 0; apagon(1); }
  return { torre, dondeB, bloque, halo, apagon, apagar, LB };
})();
W3.X = X3;

// ——— arms of the mannequin (from extenso-hipoteca-en.js). qa: 0 = as andar() leaves them, 1 = pose; qp: 0 = arms up, 1 = at the chest ———
function brazos(a, qa, qp) {
  const ax = -2.75 * (1 - qp) - 0.95 * qp, az = -0.1 * (1 - qp) - 0.2 * qp, cx = -0.15 * (1 - qp) - 1.15 * qp;
  [[a.izq, -1], [a.der, 1]].forEach(([b, sg]) => {
    b.hombro.rotation.x = lerp(b.hombro.rotation.x, ax, qa); b.hombro.rotation.z = lerp(b.hombro.rotation.z, sg * az, qa); b.codo.rotation.x = lerp(b.codo.rotation.x, cx, qa);
  });
}
function manos(hx, hz, g, qp) { const ly = 2.2 * (1 - qp) + 1.5 * qp, lz = 0.3 * (1 - qp) + 0.62 * qp; return [hx + Math.sin(g) * lz, ly, hz + Math.cos(g) * lz]; }

// Subtitles: a short last word of a sentence (≤ 3 letters) never stays alone in its beat (from extenso-hipoteca-en.js).
for (let i = 1; i < SUB.length; i++) {
  const g = SUB[i], p = SUB[i - 1], w = g.palabras[0].txt;
  if (g.palabras.length === 1 && /[.!?;]$/.test(w) && w.replace(/[.,;:!?]+$/, '').length <= 3 && p.palabras.length >= 3 && Math.abs(p.fin - g.ini) < 1e-6) {
    g.palabras.unshift(p.palabras.pop()); g.ini = g.palabras[0].ini; p.fin = g.ini;
  }
}
`;

// The hook's stamp time: the counter stops on «15 years» (mark 1 of scene 0), between 2.3 and 3.2 s.
const TSDE = 'Math.min(3.2, Math.max(2.3, e.seg[0].marcas[1] != null ? e.seg[0].marcas[1] : 2.8))';

const nota = (txt) => `<div class="nota">${txt}</div>`;
const rt = (cls, html, top) => `<div class="rt ${cls}" data-t="translateX(-50%)"${top ? ` style="top:${top}px"` : ''}>${html}</div>`;
const EJ = 'Example: $3,000 · 22.36% APR (Fed avg.) · no new charges<br>minimum = 1% of balance + interest, at least $25';
const EXTRACTO = (cls) => `<div class="ext ${cls}" data-t="translateX(-50%)"><div class="cab"><span>EXAMPLE STATEMENT</span><span>CREDIT CARD</span></div>
    <div class="f"><span>New balance</span><b>$3,000.00</b></div>
    <div class="f"><span>Minimum payment due</span><b>$85.90</b></div>
    <div class="mpw"><b>Minimum Payment Warning:</b>If you make only the minimum payment each period, you will pay more in interest and it will take you longer to pay off your balance.</div>
    <table><tr><th>If you make no additional charges and each month you pay…</th><th>You will pay off the balance in about…</th><th>And you will end up paying an estimated total of…</th></tr>
      <tr class="r1"><td>Only the minimum payment</td><td>15 years</td><td>$7,515</td></tr>
      <tr class="r2"><td>$115</td><td>3 years</td><td>$4,145<small>(Savings = $3,370)</small></td></tr></table></div>`;

const ESCENAS = [
  // 0 · Hook: the big red INTEREST counter runs from frame 0 (payment 36) while red $100 blocks rain onto a second tower; the white
  //     $3,000 tower loses its blocks only slowly (paid ones stay as an outline). At payment 77 (0.62 s) interest passes $3,000 and the
  //     red tower is as tall as the white one: «INTEREST > $3,000». At payment 180 (on «15 years») the counter stops at $4,515.
  { html: () => `<div class="cont"><small>INTEREST PAID · YEAR <span class="y">3</span></small><b class="c">$1,697</b><i>still owe <span class="o">$2,089</span></i></div>
      ${rt('roja', 'INTEREST <span class="r">&gt;</span> $3,000')}${rt('roja p', '<span class="r">15 YEARS</span> TO PAY OFF $3,000<small>$7,515 PAID IN TOTAL</small>')}
      ${nota(EJ)}`,
    anim: new Function('s', 'e', 'el', `
      const TS = ${TSDE}, M = e.seg[0].marcas, m2 = Math.max(M[2] != null ? M[2] : TS + 0.8, TS + 0.4), r = el.querySelectorAll('.rt');
      const mes = mesG(s, TS), h = mes >= 179.999 ? HIST[180] : EN(mes), c = el.querySelector('.cont');
      c.querySelector('.c').textContent = dinero(mes >= 179.999 ? 4515 : h[1]); c.querySelector('.o').textContent = dinero(h[0]);
      c.querySelector('.y').textContent = Math.max(1, Math.min(15, Math.ceil(mes / 12 - 1e-6)));
      const TC = TLG(TS)[29], fl = s > TC ? Math.exp(-(s - TC) * 6) : 0, fs = s > TS ? Math.exp(-(s - TS) * 5) : 0;
      c.style.transform = 'translateX(-50%) scale(' + (1 + 0.12 * Math.sin(PI * tramo(s, TC, TC + 0.3)) + 0.16 * Math.sin(PI * tramo(s, TS, TS + 0.35)) + 0.06 * Math.sin(PI * tramo(s, m2, m2 + 0.4))) + ')';
      c.querySelector('b').style.textShadow = '0 6px ' + Math.round(40 + 60 * Math.max(fl, fs)) + 'px rgba(248,113,113,' + (0.45 + 0.5 * Math.max(fl, fs)).toFixed(2) + ')';
      ver(r[0], s, TC + 0.1, m2); ver(r[1], s, m2 + 0.15);
      el.querySelector('.nota').style.opacity = 1;
    `) },
  // 1 · The minimum shrinks: a staircase of 90 payments on the floor (one bar every 2 months), red = interest of the month,
  //     turquoise = principal; $86 at the start, $25 (the floor) from payment 124.
  { html: () => `${rt('roja', 'THE MINIMUM <span class="r">SHRINKS</span>')}${rt('p', 'MONTH 1: <span class="r">$86</span> → MONTH 124: <span class="r">$25</span>')}
      ${nota('Each bar = one minimum payment · <span style="color:#f87171">red = interest</span> · <span style="color:#5eead4">turquoise = principal</span><br>' + EJ.split('<br>')[1])}`,
    anim: function (s, e, el) { const M = e.seg[0].marcas, m0 = M[0] != null ? M[0] : 1.5, m1 = M[1] != null ? M[1] : 2.4, r = el.querySelectorAll('.rt');
      ver(r[0], s, m0 + 0.1, m1 + 0.4); ver(r[1], s, m1 + 0.5); ver(el.querySelector('.nota'), s, 0.3); } },
  // 2 · Three years: the white tower is whole again; 36 payments go in, it loses only 9 blocks (→ 21) while 17 red ones pile up.
  { html: () => `<div class="chip izq"><small>MONTH</small><b class="y">0</b></div>
      ${rt('', 'PAID <span class="t">$2,608</span>')}${rt('', 'STILL OWE <span class="a">$2,089</span>')}${nota(EJ)}`,
    anim: function (s, e, el) { const M = e.seg[0].marcas, m1 = M[1] != null ? M[1] : 1.6, r = el.querySelectorAll('.rt'), T36 = Math.max(1.0, m1 - 0.25);
      el.querySelector('.y').textContent = Math.round(36 * sale(tramo(s, 0.1, T36)));
      ver(el.querySelector('.chip'), s, 0.05); ver(r[0], s, T36 - 0.1, m1 + 0.05); ver(r[1], s, m1 + 0.1); ver(el.querySelector('.nota'), s, 0.2); } },
  // 3 · The law: a generic statement card comes in (it never stands still); on {caja} the amber box wipes over the warning.
  { html: () => `${EXTRACTO('e3')}${rt('amb p', 'CREDIT CARD ACT OF <span class="a">2009</span><small>12 CFR 1026.7(b)(12)</small>')}`,
    anim: function (s, e, el) { const M = e.seg[0].marcas, m0 = M[0] != null ? M[0] : 1.3, m2 = M[2] != null ? M[2] : 3.4, c = el.querySelector('.ext');
      const ent = sale(tramo(s, 0.05, 0.6)), dr = tramo(s, 0.3, e.fin - e.ini);
      c.style.opacity = Math.min(1, ent * 1.4);
      c.style.transform = 'translateX(' + (-50 + 60 * (1 - ent)) + '%) perspective(1400px) rotateY(' + (-50 * (1 - ent) + 5 - 8 * dr) + 'deg) rotateZ(' + (2 - 3 * dr) + 'deg) scale(' + ((0.8 + 0.2 * ent) * (0.92 + 0.07 * dr)) + ')';
      c.querySelectorAll('tr.r1, tr.r2, table').forEach(x => { x.style.opacity = 0.35; });
      const mp = c.querySelector('.mpw'), a = rebote(tramo(s, m2 - 0.05, m2 + 0.3)), wp = Math.round(100 * sale(tramo(s, m2 - 0.05, m2 + 0.6)));
      mp.style.borderColor = 'rgba(245,185,74,' + Math.min(1, a).toFixed(2) + ')';
      mp.style.background = 'linear-gradient(90deg, rgba(245,185,74,.28) ' + wp + '%, rgba(245,185,74,0) ' + Math.min(100, wp + 4) + '%)';
      mp.style.transform = 'scale(' + (1 + 0.05 * Math.sin(PI * tramo(s, m2, m2 + 0.4))) + ')';
      ver(el.querySelector('.rt'), s, m0 + 0.05); } },
  // 4 · The table: the minimum row (15 years · $7,515), then the 36-month row ($115 · 3 years · $4,145); the card leaves and the red
  //     tower loses 34 blocks (45 → 11): «$4,515 → $1,145».
  { html: () => `${EXTRACTO('e4')}${rt('turq', 'INTEREST <span class="r">$4,515</span> → <span class="t">$1,145</span>')}
      ${nota('36-month payment: $3,000 at 22.36% repaid in 36 equal payments of $115.13 (example)')}`,
    anim: function (s, e, el) { const M = e.seg[0].marcas, m0 = M[0] != null ? M[0] : 1.7, m1 = M[1] != null ? M[1] : 3.3, m2 = M[2] != null ? M[2] : 4.8, c = el.querySelector('.ext');
      const va = suave(tramo(s, m2 - 0.45, m2 + 0.05)), dr = tramo(s, 0, m2);
      c.style.opacity = 1 - tramo(s, m2 - 0.15, m2 + 0.05);
      c.style.top = '490px';
      c.style.transform = 'translateX(' + (-50 - 130 * va) + '%) perspective(1400px) rotateY(' + (-6 + 9 * dr) + 'deg) rotateZ(' + (-1.2 + 2 * dr - 8 * va) + 'deg) scale(' + (1.06 + 0.06 * dr) + ')';
      c.querySelector('.mpw').style.borderColor = 'rgba(245,185,74,.8)';
      const q1 = rebote(tramo(s, 0.1, 0.45)) * (1 - 0.6 * tramo(s, m0, m0 + 0.3)), q2 = rebote(tramo(s, m0, m0 + 0.35));
      filaEstilo(c.querySelector('tr.r1'), Math.min(1, q1), '220,38,38'); filaEstilo(c.querySelector('tr.r2'), Math.min(1, q2), '13,148,136');
      const td = c.querySelector('tr.r2 td'); td.style.transform = 'scale(' + (1 + 0.18 * Math.sin(PI * tramo(s, m1, m1 + 0.45))) + ')'; td.style.display = 'table-cell';
      ver(el.querySelector('.rt'), s, m2 + 0.3); ver(el.querySelector('.nota'), s, m1 + 0.1, m2 + 0.15); } },
  // 5 · Today: a mini statement box («$115 / 3 years»); then the 34 red blocks you no longer pay come back turquoise and build a
  //     savings stack by the mannequin. Hard cut on «−$3,370 INTEREST».
  { html: () => `<div class="mini" data-t="translateX(-50%)"><b>Minimum Payment Warning</b><div class="fila"><span>$115 / month</span><span>3 years</span></div></div>
      ${rt('turq', '<span class="t">−$3,370</span> INTEREST<small>→ YOUR SAVINGS</small>')}
      ${nota('Example · investment returns aren’t guaranteed · emergency fund first')}`,
    anim: function (s, e, el) { const M = e.seg[0].marcas, m1 = M[1] != null ? M[1] : 1.6, m2 = M[2] != null ? M[2] : 2.9, m3 = M[3] != null ? M[3] : 4.6, mi = el.querySelector('.mini');
      const ent = rebote(tramo(s, 0, 0.4)), sal = suave(tramo(s, m2 - 0.1, m2 + 0.35));
      mi.style.opacity = Math.min(1, ent * 1.4) * (1 - sal);
      mi.style.transform = 'translateX(-50%) translateY(' + (-40 * sal) + 'px) rotate(' + (-3 + 2.5 * tramo(s, 0, m2) + 6 * sal) + 'deg) scale(' + ((0.7 + 0.3 * ent) * (1 + 0.08 * Math.sin(PI * tramo(s, m1, m1 + 0.45)))) + ')';
      ver(el.querySelector('.rt'), s, m3 + 0.35); ver(el.querySelector('.nota'), s, m3 + 0.5); } }
];

const TRES = new Function('t', 'k', 's', 'e', 'W', `
  const X = W.X; X.apagar();
  const D = e.fin - e.ini, M = e.seg.flatMap(g => g.marcas);
  const mk = (j, def) => (M[j] != null ? M[j] : def);
  const q = (a, d) => sale(tramo(s, a, a + (d || 0.45)));
  const bote = (a, d) => rebote(tramo(s, a, a + (d || 0.35)));
  const cam = (C) => W.camara(C[0], C[1], C[2], C[3], C[4], C[5]);
  const ROJ = '#f87171', TQ = '#5eead4', AMB = '#f5b94a', BLANCO = '#e2e8f0';
  const blanca = (o) => X.torre('blanca', Object.assign({ x: WX, z: 0 }, o));
  const roja = (o) => X.torre('roja', Object.assign({ x: RX, z: 0 }, o));
  const rojoB = (extra) => Object.assign({ color: ROJOH, brillo: 0.32 }, extra);
  const blancoB = (extra) => Object.assign({ color: BLANCOH, brillo: 0.06 }, extra);
  const fantB = (c, op) => ({ color: c, brillo: 0.6, op: op == null ? 0.13 : op });
  const LB = X.LB;

  if (k === 0) {
    // ——— the hook ———
    const TS = ${TSDE}, m2 = Math.max(mk(2, TS + 0.8), TS + 0.4), TC = TLG(TS)[29];
    const mes = mesG(s, TS), deb = Math.round(EN(mes)[0] / 100);
    const hincha = 1 + 0.07 * Math.sin(PI * tramo(s, TC, TC + 0.32)) + 0.05 * Math.sin(PI * tramo(s, TS, TS + 0.4));
    blanca({ inclina: 0.05 * Math.sin(PI * tramo(s, TC + 0.02, TC + 0.42)), bloque: (j) => j < deb ? blancoB() : fantB(BLANCOH, 0.12) });
    roja({ pulso: hincha, bloque: (j) => bloqueG(j, s, TS) });
    W.rotulo('t3000', '$3,000', WX, 2.52 + 0.45, 0.4, 1, BLANCO, 0.5);
    // stamp «15 YEARS» on the red tower when the counter stops
    const st = bote(TS, 0.32);
    if (s > TS - 0.05) {
      W.rotulo('s15', '15 YEARS', RX, 1.9, 0.95, Math.min(1, st * 1.3), ROJ, 0.5 * (1 + 0.5 * (1 - Math.min(1, st))));
      if (s < TS + 0.3) X.halo({ x: RX, y: 1.9, z: 1.0, esc: 4.5, op: 0.55 * Math.sin(PI * tramo(s, TS, TS + 0.3)), color: '#fca5a5' });
    }
    if (s > TC && s < TC + 0.35) X.halo({ x: RX, y: 2.6, z: 0.5, esc: 3.6, op: 0.6 * Math.sin(PI * tramo(s, TC, TC + 0.35)), color: '#fecaca' });
    // the line of $3,000: a thin white strip at the white tower's height, across both towers, lit at the crossing
    const lin = 0.35 + 0.65 * Math.exp(-Math.max(0, s - TC) * 3) * (s > TC ? 1 : 0);
    X.bloque({ x: 0, y: 6 * LB + 0.03, z: 0.35, w: 5.6, h: 0.03, d: 0.03, color: '#e2e8f0', brillo: 0.8, op: 0.35 + 0.6 * lin });
    // camera: low travelling right → left with crane up, orbit to three quarters, crane, push on the stamp, pull back. Never still.
    const C = ruta(orden([[0, [2.6, 1.5, 13.4, 0.2, 2.7, 0]], [0.62, [1.3, 2.1, 13.9, 0.1, 2.7, 0]],
      [1.3, orbita([0.3, 2.8, 14.2, 0.3, 2.7, 0], 0.28)], [2.0, orbita([0.4, 3.8, 14.4, 0.4, 2.8, 0], 0.4)],
      [TS, orbita([0.7, 3.1, 13.2, 0.7, 2.8, 0], 0.16)], [TS + 0.7, orbita([0.4, 2.9, 14.0, 0.4, 2.7, 0], -0.05)],
      [m2, orbita([0.2, 2.7, 14.6, 0.2, 2.6, 0], -0.2)], [D + 0.6, orbita([0.1, 2.5, 15.0, 0.1, 2.5, 0], -0.34)]]), s);
    const sh = s > TC ? 0.06 * Math.exp(-(s - TC) * 11) : 0, sh2 = s > TS ? 0.05 * Math.exp(-(s - TS) * 12) : 0;
    cam([C[0] + (sh + sh2) * Math.sin(s * 83), C[1] + (sh + sh2) * Math.cos(s * 71), C[2], C[3], C[4], C[5]]);
  } else if (k === 1) {
    // ——— the staircase of minimum payments: 90 bars (payments 1, 3, … 179), they rise in a wave from the left ———
    const m0 = mk(0, 1.5), m1 = mk(1, 2.4), X0 = -3.0, PASO = 6.0 / 89, Y = 0.026;
    for (let b = 0; b < 90; b++) {
      const m = 1 + 2 * b, h = HIST[m], u = sale(tramo(s, 0.02 + 0.011 * b, 0.32 + 0.011 * b)), x = X0 + b * PASO;
      if (u <= 0) continue;
      const hi = h[4] * Y * u, hp = (h[3] - h[4]) * Y * u, br = m >= 124 ? 0.25 + 0.35 * q(m1 + 0.2, 0.3) : 0.25;
      X.bloque({ x, y: hi / 2, z: 0, w: PASO * 0.72, h: hi, d: 0.5, color: '#ef4444', brillo: 0.35 });
      X.bloque({ x, y: hi + hp / 2 + 0.005, z: 0, w: PASO * 0.72, h: hp, d: 0.5, color: '#2dd4bf', brillo: br });
    }
    W.rotulo('p86', '$86', X0, HIST[1][3] * Y + 0.4, 0.2, q(0.5, 0.3), ROJ, 0.42);
    W.rotulo('p25', '$25', X0 + 75 * PASO, 25 * Y + 0.4, 0.2, q(m1 + 0.1, 0.3), ROJ, 0.42);
    W.rotulo('mm1', 'MONTH 1', X0 + 0.2, 0.12, 0.75, q(0.3, 0.3), '#94a3b8', 0.2);
    W.rotulo('mm180', 'MONTH 180', X0 + 89 * PASO - 0.6, 0.12, 0.75, q(1.0, 0.3), '#94a3b8', 0.2);
    // camera: from the first bars (low, close) along the staircase to the flat end, then up and back to see the whole slope
    cam(ruta(orden([[0, [X0 - 1.0, 1.6, 7.8, X0 + 1.8, 1.1, 0]], [m0, [X0 + 0.2, 1.9, 8.8, X0 + 2.6, 0.95, 0]],
      [m1, [1.4, 2.3, 9.6, 0.2, 0.9, 0]], [D + 0.5, orbita([0.0, 2.7, 10.4, 0.0, 0.9, 0], -0.24)]]), s));
  } else if (k === 2) {
    // ——— three years: the white tower whole again, 36 payments go in (12 turquoise cubes from the mannequin), it keeps 21 of its
    //     30 blocks; the red tower climbs to 17 ———
    const m1 = mk(1, 1.6), T36 = Math.max(1.0, m1 - 0.25), mes = 36 * sale(tramo(s, 0.1, T36)), h = EN(mes);
    const deb = Math.round(h[0] / 100), nr = Math.round(h[1] / 100);
    blanca({ bloque: (j) => j < deb ? blancoB({ brillo: j >= 21 ? 0.06 : 0.06 + 0.25 * q(m1, 0.3) * (0.5 + 0.5 * Math.sin(s * 11)) }) : fantB(BLANCOH, 0.12) });
    roja({ bloque: (j) => j < nr ? rojoB() : (j < 45 ? fantB(ROJOH, 0.06) : null) });
    const HX = 0.0, HZ = 2.6;
    W.heroe({ x: HX, z: HZ, gira: 0, luz: 0.85, visible: s < m1 + 0.2 });
    brazos(W.H, 1, 1 - 0.6 * Math.abs(Math.sin(s * 6)) * (1 - tramo(s, T36, T36 + 0.2)));
    const mp = manos(HX, HZ, 0, 1);
    for (let i = 0; i < 12; i++) {
      const t0 = 0.12 + i * (T36 - 0.2) / 12, v = tramo(s, t0, t0 + 0.45); if (v <= 0 || v >= 1) continue;
      const dest = i % 2 ? [WX + 0.2, 6 * LB + 0.2, 0.3] : [RX - 0.2, 4 * LB, 0.3];
      const p = mezcla(mp, dest, suave(v)); p[1] += 0.9 * Math.sin(PI * v);
      X.bloque({ x: p[0], y: p[1], z: p[2], w: 0.2, h: 0.2, d: 0.2, color: '#2dd4bf', brillo: 0.5, rx: 4 * v, ry: 3 * v, op: 1 - tramo(v, 0.8, 1) });
    }
    W.rotulo('t3000b', '$3,000', WX, 2.52 + 0.45, 0.4, 1, BLANCO, 0.42);
    cam(ruta(orden([[0, orbita([0.0, 1.7, 12.6, 0.0, 1.45, 0.8], 0.35)], [T36, orbita([0.0, 2.4, 12.8, 0.0, 1.45, 0.5], 0.1)],
      [m1 + 0.3, orbita([WX + 0.5, 2.0, 10.0, WX + 0.3, 1.3, 0], -0.12)], [D + 0.5, orbita([WX + 0.4, 1.9, 9.4, WX + 0.2, 1.25, 0], -0.24)]]), s));
  } else if (k === 3) {
    // ——— the law: dimmed towers (white outline + red 45) behind the statement card, slow push and turn ———
    X.apagon(0.55);
    blanca({ bloque: () => fantB(BLANCOH, 0.12) });
    roja({ bloque: (j) => rojoB({ brillo: 0.32 + 0.15 * Math.sin(s * 3 + j * 0.3) }) });
    cam(ruta(orden([[0, orbita([0.2, 2.2, 12.6, 0.2, 2.0, 0], 0.4)], [D + 0.5, orbita([0.2, 2.6, 10.6, 0.2, 2.1, 0], 0.05)]]), s));
  } else if (k === 4) {
    // ——— the table, then the red tower loses 34 blocks (45 → 11) on «$1,145»: they fly off and fade ———
    const m2 = mk(2, 4.8);
    X.apagon(1 - 0.45 * (1 - tramo(s, m2 - 0.4, m2)));
    blanca({ bloque: () => fantB(BLANCOH, 0.12) });
    roja({ bloque: (j) => {
      if (j < 11) return rojoB();
      const tj = m2 + 0.1 + 0.012 * (45 - j), w = tramo(s, tj, tj + 0.6);
      if (w <= 0) return rojoB();
      if (w >= 1) return fantB(ROJOH, 0.1);
      const a = (j * 2.4) % (2 * PI);
      return rojoB({ dx: 2.2 * Math.cos(a) * w + 1.0 * w, dy: 2.4 * Math.sin(PI * Math.min(1, w * 1.3)) - 3 * w * w, dz: 2.0 * Math.abs(Math.sin(a)) * w, rx: 5 * w, rz: 4 * w, op: 1 - tramo(w, 0.7, 1) });
    } });
    if (s > m2 + 0.1 && s < m2 + 0.6) X.halo({ x: RX, y: 2.6, z: 0.6, esc: 4, op: 0.5 * Math.sin(PI * tramo(s, m2 + 0.1, m2 + 0.6)), color: '#99f6e4' });
    cam(ruta(orden([[0, orbita([0.3, 2.6, 11.0, 0.3, 2.2, 0], -0.3)], [m2 - 0.3, orbita([0.3, 2.4, 11.8, 0.3, 2.1, 0], -0.08)],
      [m2 + 0.6, orbita([0.6, 2.2, 11.0, 0.6, 1.9, 0], 0.16)], [D + 0.5, orbita([0.6, 2.0, 10.2, 0.6, 1.7, 0], 0.3)]]), s));
  } else {
    // ——— today: the mannequin walks to the red tower (11 blocks, 34 in outline); on {pop} the 34 come back turquoise and build the
    //     savings stack where the white tower was; the mannequin turns to it and raises its arms ———
    const m2 = mk(2, 2.9), m3 = mk(3, 4.6), m4 = mk(4, 5.6);
    roja({ bloque: (j) => j < 11 ? rojoB() : (j < 45 ? fantB(ROJOH, 0.1 + 0.12 * q(m2, 0.3) * (0.5 + 0.5 * Math.sin(s * 10))) : null) });
    const AH = { x: WX, z: 0 };
    X.torre('ahorro', Object.assign({}, AH, { bloque: (j) => {
      const tj = m3 + 0.05 + 0.02 * j, v = tramo(s, tj, tj + 0.4);
      if (v <= 0) return null;
      const src = X.dondeB({ x: RX, z: 0 }, 11 + j), dst = X.dondeB(AH, j);
      const p = mezcla(src, dst, suave(v)); p[1] += 1.6 * Math.sin(PI * v);
      return { color: TURQH, brillo: 0.4 + 0.3 * (1 - v), dx: p[0] - dst[0], dy: p[1] - dst[1], dz: p[2] - dst[2] + 0.6 * Math.sin(PI * v), rx: 4 * (1 - v), ry: 3 * (1 - v) };
    } }));
    const H0 = [3.6, 3.2], H1 = [0.0, 2.0], u = sale(tramo(s, 0, Math.max(1.2, m2 - 0.2))), hx = lerp(H0[0], H1[0], u), hz = lerp(H0[1], H1[1], u);
    const anda = u < 0.99, gAnda = Math.atan2(H1[0] - H0[0], H1[1] - H0[1]);
    W.heroe({ x: hx, z: hz, gira: anda ? gAnda : angulo(gAnda, PI + 0.5, q(m3 - 0.2, 0.4)), amp: anda ? 1 : 0, fase: s * 8, luz: 0.9 });
    brazos(W.H, q(m4 - 0.1, 0.35), 0);
    if (s > m3 && s < m3 + 0.5) X.halo({ x: WX, y: 1.2, z: 0.6, esc: 4, op: 0.5 * Math.sin(PI * tramo(s, m3, m3 + 0.5)), color: TQ });
    if (s > m3 + 0.6) W.rotulo('sav', 'SAVINGS', WX, 7 * LB + 0.45, 0.4, q(m3 + 0.7, 0.3), TQ, 0.42);
    cam(ruta(orden([[0, [4.6, 1.4, 10.0, 1.4, 1.4, 1.2]], [m2, orbita([0.5, 1.7, 10.6, 0.5, 1.6, 0.6], 0.25)],
      [m3 + 0.2, orbita([-0.2, 2.3, 12.0, -0.2, 1.8, 0.4], 0.05)], [D + 0.6, orbita([-0.4, 2.7, 12.8, -0.4, 1.8, 0.4], -0.22)]]), s));
  }
  W.multitud(t, { directo: () => ({ x: -60, z: -60, esc: 0 }) });
`);

const pildoras = {
  'en-credit-card-minimum': pildora3d({
    slug: 'en-credit-card-minimum', cuenta: 'en',
    T: { en: { titulo: '$3,000 on a card, paying only the minimum: 15 years and $4,515 in interest', guion: GUION } },
    // Narrator voice of reto-en.js / extenso-en.js (never VOZ_SECA), slower as in en-mortgage-rate (tempo 1.12, pauses ≤ 0.3 s).
    voz: { ...VOZ_NARRADOR, en: { ...VOZ_NARRADOR.en, tempo: 1.12, pausaMax: 0.3 } },
    fijo: () => `<div class="hud i fmt">MONEY, EXPLAINED</div><div class="hud d"><i></i><span id="reloj">00:00</span></div>`,
    cssExtra: CSS, scriptExtra: SCRIPT,
    escenas: ESCENAS, tres: TRES,
    cola: 0.8, corte2d: 'seco',
    texto: { en: TEXTO }
  })
};

module.exports = { pildoras };
