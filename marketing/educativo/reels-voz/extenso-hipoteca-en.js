// Long format (30–45 s) · @finanziapp (US), in 3D (reels-voz/tres.js), series «Money, explained».
// en-mortgage-rate · «A $300,000 mortgage at 6.5%: the interest alone is more than you borrowed.» (example, 30-year fixed)
// Final, verified script: guiones/2026-11-en-mortgage-rate.md (visual hook, scenes, cuadra(), sources, post, cover).
// Expiry: scene 2 and the post text carry Freddie Mac's rate of THIS week (7.11% on Nov 12, 2026). Before publishing on
// Nov 21, update both with the PMMS of Thursday Nov 19 (and the 7.11% checks below); the voice does not change.
//
// Sources (as given in the script, checked 18 Nov 2026):
// - Freddie Mac, Primary Mortgage Market Survey (PMMS): 30-year fixed 7.11% on Nov 12, 2026 (7.18% the week before; 6.24% a
//   year ago). Published Thursdays at 12:00 ET. https://www.freddiemac.com/pmms
// - Freddie Mac, PMMS history (CSV, downloaded 18 Nov 2026): 2021 average 2.958% (52 weeks; low 2.65% on Jan 7, 2021);
//   2026 average up to Nov 12, 6.544% (45 weeks). https://www.freddiemac.com/pmms/docs/PMMS_history.csv
// - eCFR, 12 CFR 1026.41(d)(7)(iv) (Regulation Z, periodic mortgage statement), version of Nov 13, 2026: the statement must
//   show «The existence of any prepayment penalty… that may be charged» (exemptions in (e): reverse mortgages, timeshares,
//   small servicers). https://www.ecfr.gov/current/title-12/chapter-X/part-1026/subpart-E/section-1026.41
// - eCFR, 12 CFR 1026.37(b)(4) and 1026.38(b): Loan Estimate and Closing Disclosure show a «Prepayment Penalty» line.
//   https://www.ecfr.gov/current/title-12/chapter-X/part-1026/subpart-E/section-1026.37
// - eCFR, 12 CFR 1026.43(g): prepayment penalties only on fixed-rate, qualified, non-higher-priced covered loans; never after
//   3 years; at most 2% (years 1–2) and 1% (year 3). https://www.ecfr.gov/current/title-12/chapter-X/part-1026/subpart-E/section-1026.43
// - CFPB, «What is a prepayment penalty?» (reviewed Sep 11, 2024): «Not all mortgages have a prepayment penalty».
//   https://www.consumerfinance.gov/ask-cfpb/what-is-a-prepayment-penalty-en-1957/
// - CFPB, «Checklist for making your monthly mortgage payment» (PDF): ask the servicer to apply the extra to principal.
//   https://files.consumerfinance.gov/f/documents/cfpb_checklist_monthly_mortgage_payment.pdf
// - CFPB, Loan Estimate explainer (post text only): https://www.consumerfinance.gov/owning-a-home/loan-estimate/
// - Every mortgage figure (payment, interest, balance, year 1, 10 years, extra payment) is our own calculation with the
//   standard amortization formula: $300,000, 30 years, monthly payments, principal and interest only (no taxes, insurance or
//   PMI). It is an EXAMPLE, labelled as such on screen and in the post. All checks below (cuadra) are the script's.
//
// Compared with the script: the voice lines are unchanged (§ marks as in the script). On screen: the white house is labelled
// by a «LOAN $300,000» chip at the top left and the red counter «INTEREST» at the top right from frame 0 (one fixed pair that
// reads with the sound off, instead of a 3D tag that leaves the frame during the travelling); the year runs inside the red
// chip. The 28-block annex is a tower 4 wide × 7 high instead of a 7 × 4 garage: it grows upward and stays inside the vertical
// frame (the garage ran into Instagram's buttons on the right). The red blocks the extra payments save come off that annex (fill
// order 128 → 107, the annex goes from 28 to 7), so the red house never gets smaller than the white one. The ghost of the 6.5%
// house in scene 1 stays in place (not beside it). «THIS WEEK» is a 3D tag over the 7.11% drum (with the Freddie Mac date in the
// note) instead of a 2D label that covered the drum. Educational only: no lender, servicer or brand on screen; the statement card
// is a generic format marked «Example statement».
const { pildora3d } = require('./tres');
const { VOZ_NARRADOR } = require('./_comun');
const { cuadra } = require('../reels/_comun');

// ——— all the checks in the script (guiones/2026-11-en-mortgage-rate.md, «Cuentas a comprobar con cuadra()») ———
const R0 = Math.round, R1 = x => Math.round(x * 10) / 10, R2 = x => Math.round(x * 100) / 100;
// hipoteca a tipo fijo, 30 años, pago mensual (fórmula de anualidad, sin redondear la cuota)
const P = 300000, N = 360;
const cuota = (r, n = N, p = P) => { const i = r / 1200; return p * i / (1 - Math.pow(1 + i, -n)); };
const saldo = (r, k, p = P) => { const i = r / 1200, c = cuota(r, N, p), f = Math.pow(1 + i, k); return p * f - c * (f - 1) / i; };
const intereses = (r, k = N) => cuota(r) * k - (P - saldo(r, k));          // intereses pagados en los k primeros meses
const conExtra = (r, extra) => { const i = r / 1200, c = cuota(r); let s = P, m = 0, int = 0;
  while (s > 1e-6) { m++; const it = s * i; int += it; s -= Math.min(s, c + extra - it); } return { meses: m, int }; };
const conExtraDesde = (r, extra, desde) => { const i = r / 1200, c = cuota(r); let s = P, m = 0, int = 0;
  while (s > 1e-6) { m++; const it = s * i; int += it; s -= Math.min(s, c + (m >= desde ? extra : 0) - it); } return { meses: m, int }; };

// GANCHO · los dos totales del encargo
cuadra('cuota 6,5 %', R2(cuota(6.5)), 1896.20);
cuadra('intereses 6,5 %', R0(intereses(6.5)), 382633);                     // «$382,633»
cuadra('cuota 3 %', R2(cuota(3)), 1264.81);
cuadra('intereses 3 %', R0(intereses(3)), 155332);                         // «$155,332»
cuadra('intereses > casa', intereses(6.5) > P, true);                      // «the interest alone is more than you borrowed»
cuadra('3 % / 6,5 %', R1(intereses(3) / intereses(6.5) * 100), 40.6);       // «less than half»
cuadra('menos de la mitad', intereses(3) < intereses(6.5) / 2, true);
cuadra('total pagado 6,5 %', R0(cuota(6.5) * N), 682633);                  // rótulo «360 payments of $1,896 · $682,633 paid»
cuadra('año en que los intereses pasan de 300.000', [18, 19].map(a => intereses(6.5, a * 12) > P).join(), 'false,true'); // chip «YEAR 19»
const B = 3000;   // 1 bloque = 3.000 $; la casa de 300.000 son 100
cuadra('bloques casa', P / B, 100);
cuadra('bloques intereses 6,5 %', R0(intereses(6.5) / B), 128);
cuadra('bloques intereses 3 %', R0(intereses(3) / B), 52);
// Tipos de referencia (Freddie Mac PMMS, CSV histórico descargado el 18-11-2026)
cuadra('media 2021 → «3%»', R1(2.958), 3.0);
cuadra('media 2026 hasta el 12-nov → «6.5%»', R1(6.544), 6.5);
cuadra('esta semana lejos del 3 %', 7.11 - 3 > 4, true);                   // «nowhere near 3%» (7,11 % el 12-11-2026)
cuadra('intereses al 7,11 %', R0(intereses(7.11)), 426523);
cuadra('cuota al 7,11 %', R2(cuota(7.11)), 2018.12);
// Cada punto (rótulo «Each +1 point ≈ +$200/month»)
cuadra('+1 punto (6,5 → 7,5) cuota', R2(cuota(7.5) - cuota(6.5)), 201.44);
cuadra('−1 punto (6,5 → 5,5) cuota', R2(cuota(6.5) - cuota(5.5)), 192.84);
cuadra('≈ 200 $/mes', [cuota(7.5) - cuota(6.5), cuota(6.5) - cuota(5.5)].every(d => Math.abs(d - 200) < 10), true);
cuadra('+1 punto intereses', R0(intereses(7.5) - intereses(6.5)), 72518);
cuadra('−1 punto intereses', R0(intereses(6.5) - intereses(5.5)), 69421);
// EL PICO · primer año y diez años
const pagado1 = cuota(6.5) * 12, int1 = intereses(6.5, 12);
cuadra('intereses año 1', R0(int1), 19401);
cuadra('capital año 1', R0(pagado1 - int1), 3353);
cuadra('85 céntimos de cada dólar', R0(int1 / pagado1 * 100), 85);           // «about 85 cents of every dollar»
cuadra('1.er pago: intereses', R2(P * 0.065 / 12), 1625);
cuadra('pagado en 10 años', R0(cuota(6.5) * 120), 227544);
cuadra('saldo a 10 años', R0(saldo(6.5, 120)), 254328);                     // «you still owe over $250,000»
cuadra('más de 250.000', saldo(6.5, 120) > 250000, true);
cuadra('capital amortizado en 10 años', R0(P - saldo(6.5, 120)), 45672);
cuadra('intereses en 10 años', R0(intereses(6.5, 120)), 181873);
cuadra('bloques a 10 años: casa propia / casa de intereses', [R0((P - saldo(6.5, 120)) / B), R0(intereses(6.5, 120) / B)].join('/'), '15/61');
const cruce = Array.from({ length: N }, (_, k) => k + 1).find(m => { const s0 = saldo(6.5, m - 1), it = s0 * 0.065 / 12; return cuota(6.5) - it > it; });
cuadra('mes en que el capital pasa a los intereses', cruce, 233);
// LA ACCIÓN · 100 $ más al mes desde el principio
const x100 = conExtra(6.5, 100);
cuadra('meses con +100', x100.meses, 312);
cuadra('años antes', (N - x100.meses) / 12, 4);                             // «four years»
cuadra('intereses con +100', R0(x100.int), 321639);
cuadra('ahorro con +100', R0(intereses(6.5) - x100.int), 60995);            // «about $61,000»
cuadra('≈ 61.000', R0((intereses(6.5) - x100.int) / 1000), 61);
cuadra('bloques con +100', R0(x100.int / B), 107);
cuadra('extra aportado', 100 * x100.meses, 31200);
const INT_ANO = Array.from({ length: 31 }, (_, a) => R0(intereses(6.5, a * 12)));
cuadra('contador: año 11 / 17 / 19 / 30', [11, 17, 19, 30].map(a => INT_ANO[a]).join('/'), '198215/286176/310822/382633');
cuadra('contador: bloques año 11 / 30', [R0(INT_ANO[11] / B), R0(INT_ANO[30] / B)].join('/'), '66/128');
const mesCruce = Array.from({ length: N }, (_, k) => k + 1).find(m => intereses(6.5, m) > P);
cuadra('pago en que los intereses pasan de 300.000', mesCruce, 218);
cuadra('floor bloques año 11/17/18/19/25/30', [11, 17, 18, 19, 25, 30].map(a => Math.floor(INT_ANO[a] / B)).join('/'), '66/95/99/103/121/127');
cuadra('round cerraría el tejado antes del cruce', R0(INT_ANO[18] / B) === 100 && INT_ANO[18] < P, true);
cuadra('anexo: bloques sobre la casa', 128 - 100, 28);
cuadra('último bloque (medio)', R0(intereses(6.5) - 127 * B), 1633);
const int10extra = (() => { const i = 6.5 / 1200, c = cuota(6.5); let s = P, int = 0; for (let m = 1; m <= 120; m++) { const it = s * i; int += it; s -= c + 100 - it; } return int; })();
cuadra('ahorro de intereses en 10 años con +100', R0(intereses(6.5, 120) - int10extra), 4840);
cuadra('100 $ extra desde el año 11: pagos', conExtraDesde(6.5, 100, 121).meses, 337);
cuadra('100 $ extra desde el año 11: ahorro', R0(intereses(6.5) - conExtraDesde(6.5, 100, 121).int), 22166);

// ——— what is on screen besides the script's checks ———
cuadra('pantalla: «$1,896» (cuota sin céntimos)', Math.floor(cuota(6.5)), 1896);
cuadra('pantalla: extracto «$1,896.20»', R2(cuota(6.5)).toFixed(2), '1896.20');
cuadra('pantalla: escena 1, se van 128 − 52 bloques', 128 - R0(intereses(3) / B), 76);
cuadra('pantalla: escena 2, 142 bloques al 7,11 %', R0(intereses(7.11) / B), 142);
cuadra('pantalla: escena 2, la casa roja crece ×1,06 (√ del área)', R2(Math.sqrt(intereses(7.11) / intereses(6.5))), 1.06);
cuadra('pantalla: escena 3, 85 fichas rojas + 15 turquesa', [R0(int1 / pagado1 * 100), 100 - R0(int1 / pagado1 * 100)].join('+'), '85+15');
cuadra('pantalla: escena 4, bloques que aún se deben (gris)', R0(saldo(6.5, 120) / B), 85);
cuadra('pantalla: escena 4, 15 + 85 = 100', 15 + 85, 100);
cuadra('pantalla: escena 4, pagado = capital + intereses', R0(P - saldo(6.5, 120)) + R0(intereses(6.5, 120)), 227545);   // 227.544 sin redondear por partes
cuadra('pantalla: escena 5, el anexo pierde 21 bloques (28 → 7)', [128 - R0(x100.int / B), R0(x100.int / B) - 100].join('/'), '21/7');
cuadra('pantalla: escena 5, «30 → 26 years»', x100.meses / 12, 26);
cuadra('pantalla: cierre «−$61,000 · 4 years sooner»', [R0((intereses(6.5) - x100.int) / 1000) * 1000, (N - x100.meses) / 12].join('/'), '61000/4');
// Year-by-year interest for the hook counter and scene 4 (also computed in the page with the same formula)
const SALDO_ANO = Array.from({ length: 31 }, (_, a) => R0(saldo(6.5, a * 12)));
cuadra('escena 4: saldo año 10 (página)', SALDO_ANO[10], 254328);

const TEXTO = `A $300,000 mortgage at 6.5% costs $382,633 in interest. At 3%, $155,332.

Same loan, same 30 years. Each 1-point change in the rate moves this payment by about $200 a month, roughly $70,000 over the loan. Freddie Mac's weekly average for a 30-year fixed was 7.11% on Nov 12, 2026.

In year one, about 85% of the principal-and-interest payment goes to interest. That's why extra principal works best early: $100 more a month from the start saves about $61,000 in interest and ends the loan 4 years sooner, if you keep it to the end. Ask your servicer to apply it to principal.

Each extra dollar of principal avoids interest at your loan's rate. Money you save or invest grows at its own rate, and investment returns aren't guaranteed. Keep an emergency cushion first, then compare the two.

Does your statement say whether you have a prepayment penalty?

Example: $300,000, 30-year fixed, principal and interest only (no taxes, insurance or PMI). 3% ≈ 2021 average, 6.5% ≈ 2026 average so far.
Sources: Freddie Mac Primary Mortgage Market Survey · CFPB · Regulation Z (12 CFR 1026.41, 1026.43).
Educational only, not financial advice.

#mortgage #homebuying #personalfinance`;

const GUION = [
  [0, 'A $300,000 mortgage §at 6.5%: §{pop}the interest alone §is *more than you borrowed*.'],
  [1, 'The rate is why: §at 3%, §{ding}the interest is *less than half*.'],
  [2, 'Rates today are *nowhere near 3%*. §So can you still shrink that *second house*?'],
  [3, 'Few people see this: §in year one, §about *85 cents of every dollar* §goes to interest.'],
  [4, '§{caja}After ten years of payments, §you still owe *over $250,000*.'],
  [5, 'So extra payments to principal work best *early*: §{ding}*$100 more a month* §saves about *$61,000* §and *four years*.'],
  [6, 'Today, look for *prepayment penalty* §on your mortgage statement. §The rate builds the second house; §{pop}extra payments *shrink it*.']
];

const MONO = `'DejaVu Sans Mono', 'Liberation Mono', monospace`;
const CSS = `
  .hud.i.fmt { letter-spacing: .14em; }
  /* Darker band behind the subtitles (262–470 px): the houses and the white chips reach that band in several shots */
  .vin { background: radial-gradient(130% 80% at 50% 46%, transparent 52%, rgba(3,5,12,.62) 100%),
      linear-gradient(rgba(7,11,22,.92) 0%, rgba(7,11,22,.76) 13%, rgba(7,11,22,.68) 24.5%, rgba(7,11,22,.22) 29.5%, transparent 33%, transparent 76%, rgba(7,11,22,.8) 100%); }
  .rt { position: absolute; left: 50%; top: 1390px; padding: 10px 28px 14px; border-radius: 20px; background: rgba(9,14,27,.9); border: 3px solid #e2e8f0;
    color: #fff; font-size: 58px; line-height: 1.12; font-weight: 900; letter-spacing: -.015em; white-space: nowrap; opacity: 0; font-variant-numeric: tabular-nums;
    box-shadow: 0 10px 40px rgba(0,0,0,.45); text-align: center; }
  .rt.p { font-size: 46px; } .rt.r48 { font-size: 48px; } .rt.g { font-size: 76px; } .rt.amb { border-color: #f5b94a; } .rt.roja { border-color: #f87171; } .rt.turq { border-color: #5eead4; }
  .rt .a { color: #f5b94a; } .rt .r { color: #f87171; } .rt .t { color: #5eead4; } .rt small { display: block; font: 700 26px/1.5 ${MONO}; letter-spacing: .08em; color: #cbd5e1; }
  .nota { position: absolute; left: 70px; top: 1505px; max-width: 820px; font: 600 24px/1.32 ${MONO}; color: #b6c2d4; background: rgba(7,11,22,.8);
    border-radius: 10px; padding: 6px 14px; opacity: 0; }
  .chip { position: absolute; top: 505px; background: rgba(9,14,27,.9); border: 3px solid #cbd5e1; border-radius: 20px; padding: 6px 22px 10px;
    font-variant-numeric: tabular-nums; white-space: nowrap; }
  .chip small { display: block; font: 700 22px/1.35 ${MONO}; letter-spacing: .14em; color: #94a3b8; }
  .chip b { display: block; font-size: 62px; line-height: 1.02; font-weight: 900; color: #fff; letter-spacing: -.01em; }
  .chip.izq { left: 66px; } .chip.der { right: 66px; text-align: right; }
  .chip.roja { border-color: #f87171; } .chip.roja b { color: #f87171; } .chip.turq { border-color: #5eead4; } .chip.turq b { color: #5eead4; }
  .ext { position: absolute; left: 50%; top: 610px; width: 820px; background: #f8fafc; color: #0f172a; border-radius: 26px; padding: 30px 40px 36px;
    box-shadow: 0 30px 80px rgba(0,0,0,.6); opacity: 0; transform-origin: 50% 50%; }
  .ext .cab { display: flex; justify-content: space-between; align-items: baseline; font: 700 24px/1.3 ${MONO}; letter-spacing: .12em; color: #64748b;
    border-bottom: 3px solid #e2e8f0; padding-bottom: 14px; }
  .ext h3 { margin: 22px 0 12px; font-size: 46px; font-weight: 900; letter-spacing: -.01em; }
  .ext .f { display: flex; justify-content: space-between; font-size: 36px; font-weight: 650; padding: 13px 18px; border-radius: 14px; color: #334155; }
  .ext .f b { font-weight: 850; color: #0f172a; }
  .ext .f.pp { margin-top: 8px; border: 5px solid transparent; font-weight: 850; color: #0f172a; }
  .ext .f.pp b { letter-spacing: .1em; color: #94a3b8; }
`;

// 3D world of this video (added to tres.js): two houses with the same 100-block layout as W.casa (the red one with a 28-block
// annex), the rate drum, the payment slab and its 100 chips, generic boxes and glowing strips (tape of 360 payments, term bar,
// 85/15 bar, arrow), the «+$100» block and halos. Everything is switched off at the start of each frame (X3.apagar()).
const SCRIPT = `
const PI = Math.PI, ROJOH = 0xdc2626, TURQH = 0x2dd4bf, GRISH = 0xb4bac6, BLANCOH = 0xe6ebf2, AMBH = 0xf5b94a;
const WX = -1.4, RX = 1.4, ESCC = 0.5;
const mezcla = (P, Q, u) => P.map((v, j) => v + (Q[j] - v) * u);
const suave = (x) => x * x * (3 - 2 * x);
const angulo = (a, b, g) => a + ((((b - a + PI) % (2 * PI)) + 2 * PI) % (2 * PI) - PI) * g;
const pl = (x, P) => { if (x <= P[0][0]) return P[0][1]; for (let j = 0; j < P.length - 1; j++) if (x <= P[j + 1][0]) return P[j][1] + (P[j + 1][1] - P[j][1]) * (x - P[j][0]) / (P[j + 1][0] - P[j][0]); return P[P.length - 1][1]; };
function ver(n, s, a, b) { if (!n) return; let p = a < -0.5 ? 1 : rebote(tramo(s, a - 0.1, a + 0.25)); if (b != null) p *= 1 - tramo(s, b - 0.12, b); aparece3(n, p); }
// Camera along keyframes [[time, [px, py, pz, lx, ly, lz]]…] (Hermite spline, never stops in between) and orbit (from desmentido-en.js).
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
// Keyframes kept in order even if a mark of the voice comes early or late.
const orden = (K) => { for (let j = 1; j < K.length; j++) if (K[j][0] <= K[j - 1][0] + 0.05) K[j][0] = K[j - 1][0] + 0.05; return K; };
// The example loan (same formulas as cuadra()): payment, interest paid in the first m months (m can be fractional), balance.
const HIP = (() => { const P = 300000, i = 6.5 / 1200, c = P * i / (1 - Math.pow(1 + i, -360));
  const saldo = (m) => { const f = Math.pow(1 + i, m); return P * f - c * (f - 1) / i; };
  return { c, saldo, int: (m) => c * m - (P - saldo(m)) }; })();
// Hook clock: payments made at each instant of scene 0 (year 11 on frame 0, payment 218 at 0.65 s, payment 360 at 2.5 s).
const mesG = (s) => pl(s, [[0, 132], [0.5, 204], [0.65, 218], [1.0, 258], [1.5, 300], [2.0, 342], [2.5, 360]]);
// Settled red blocks = floor(interest / $3,000) (floor, not round: block 100 lands exactly when interest passes $300,000);
// at payment 360 the last half block (the $1,633 left) lands: 128.
const bloquesG = (s) => { const m = mesG(s); return m >= 359.999 ? 128 : Math.min(127, Math.floor(HIP.int(m) / 3000)); };
const TLG = (() => { const t = new Array(128).fill(99), n0 = bloquesG(0); for (let j = 0; j < n0; j++) t[j] = -1;
  for (let k = 0; k <= 2700; k++) { const s = k / 1000, n = bloquesG(s); for (let j = n0; j < n; j++) if (t[j] === 99) t[j] = s; } return t; })();
const TCRUCE = TLG[99];
const CAIDA = 0.26;
// Red block j of the hook at instant s: settled (with a short bounce), falling (deterministic, no physics) or not out yet.
function bloqueG(j, s, extra) {
  const T0 = TLG[j]; if (T0 > 50) return null;
  if (s >= T0) { const d = s - T0; return Object.assign({ color: ROJOH, brillo: 0.32, dy: T0 < 0 ? 0 : 0.16 * Math.exp(-d * 15) * Math.sin(d * 32) }, extra); }
  if (s < T0 - CAIDA) return null;
  const u = (s - T0 + CAIDA) / CAIDA; return Object.assign({ color: ROJOH, brillo: 0.4, dy: 6.0 * (1 - u * u), rz: 0.8 * (1 - u) * (j % 2 ? 1 : -1), rx: 0.5 * (1 - u) }, extra);
}

const X3 = (() => {
  const W = W3, T = W.T, S = W.S, objs = [], sueltos = [];
  const grupo = () => { const g = new T.Group(); g.visible = false; S.add(g); objs.push(g); return g; };
  const mat = (c, o) => new T.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.55, metalness: 0.08 }, o || {}));
  const lienzo = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const tx = new T.CanvasTexture(c); tx.encoding = T.sRGBEncoding; tx.anisotropy = 4; return { c, x: c.getContext('2d'), tx }; };
  const haloTx = (() => { const l = lienzo(256, 256), g = l.x.createRadialGradient(128, 128, 0, 128, 128, 128); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.3, 'rgba(255,255,255,.4)'); g.addColorStop(1, 'rgba(255,255,255,0)'); l.x.fillStyle = g; l.x.fillRect(0, 0, 256, 256); l.tx.needsUpdate = true; return l.tx; })();
  const LUCES = S.children.filter(o => o.isHemisphereLight || o.isDirectionalLight).map(l => [l, l.intensity]);
  function apagon(f) { LUCES.forEach(([l, i0]) => { l.intensity = i0 * f; }); }

  // ——— houses: blocks in FILL order (bottom up, row by row, serpentine), same layout as W.casa: wall 8 × 10, roof 8-6-4-2;
  //     the red one adds a 28-block annex against its right wall, a tower 4 wide × 7 high (the 128th block, on top, is a half
  //     block: $1,633 of $3,000) ———
  const LB = 0.5, geoB = new T.BoxGeometry(LB * 0.9, LB * 0.9, LB * 1.8), POS = [];
  for (let r = 0; r < 8; r++) for (let c = 0; c < 10; c++) { const cc = r % 2 ? 9 - c : c; POS.push([(cc - 4.5) * LB, r * LB + LB / 2, 1]); }
  [8, 6, 4, 2].forEach((n, k) => { const r = 8 + k; for (let c = 0; c < n; c++) { const cc = r % 2 ? n - 1 - c : c; POS.push([(cc - (n - 1) / 2) * LB, r * LB + LB / 2, 1]); } });
  for (let r = 0; r < 7; r++) for (let c = 0; c < 4; c++) { const cc = r % 2 ? 3 - c : c; POS.push([5.5 * LB + cc * LB, r * LB + LB / 2, 1]); }
  POS[127] = [POS[127][0], 6 * LB + LB * 0.28, 0.5];
  function hazCasa(n) {
    const g = grupo(), piv = new T.Group(); g.add(piv); const bl = [];
    for (let j = 0; j < n; j++) { const m = new T.Mesh(geoB, mat(GRISH, { roughness: 0.55, metalness: 0.05, transparent: true })); m.castShadow = true; m.receiveShadow = true; piv.add(m); bl.push(m); }
    return { g, piv, bl };
  }
  const CASAS = { blanca: hazCasa(100), roja: hazCasa(128) };
  // o = { x, z, rot, esc, pulso, inclina, bloque: (j) => null | { color, brillo, op, dx, dy, dz, rx, ry, rz, s } } (local units: ×esc in the world)
  function casa(id, o) {
    const C = CASAS[id]; C.g.visible = true; C.g.position.set(o.x || 0, o.y || 0, o.z || 0); C.g.rotation.y = o.rot || 0;
    C.g.scale.setScalar((o.esc || ESCC) * (o.pulso || 1)); C.piv.rotation.z = o.inclina || 0;
    C.bl.forEach((m, j) => {
      const d = o.bloque ? o.bloque(j) : {}; if (!d) { m.visible = false; return; }
      const p = POS[j], mt = m.material, op = d.op == null ? 1 : d.op; m.visible = op > 0.01; if (!m.visible) return;
      mt.color.set(d.color == null ? GRISH : d.color); mt.emissive.set(d.color == null ? 0x000000 : d.color).multiplyScalar(d.brillo == null ? 0.25 : d.brillo);
      mt.opacity = op; mt.depthWrite = op > 0.99;
      m.position.set(p[0] + (d.dx || 0), p[1] + (d.dy || 0), d.dz || 0); m.rotation.set(d.rx || 0, d.ry || 0, d.rz || 0);
      const sc = Math.max(0.001, d.s == null ? 1 : d.s); m.scale.set(sc, sc * p[2], sc);
    });
  }
  // World position of block j of a house drawn with o (no pulse or tilt).
  function dondeB(o, j) { const p = POS[j], e = o.esc || ESCC, r = o.rot || 0; return [(o.x || 0) + p[0] * Math.cos(r) * e, p[1] * e, (o.z || 0) - p[0] * Math.sin(r) * e]; }

  // ——— rate drum: a cylinder lying on its axis (x) with «6.5%», «3%», «7.11%» around it, like an odometer wheel ———
  const dialG = grupo(), DR = 0.5, DL = 1.5, dl = lienzo(2048, 1024);
  (function () { const x = dl.x; x.fillStyle = '#0b1222'; x.fillRect(0, 0, 2048, 1024);
    x.strokeStyle = 'rgba(148,163,184,.4)'; x.lineWidth = 8; [0, 1 / 3, 2 / 3].forEach(u => { const cx = ((u + 0.5 + 1 / 6) % 1) * 2048; x.beginPath(); x.moveTo(cx, 30); x.lineTo(cx, 994); x.stroke(); });
    [['6.5%', '#f87171', 0.5], ['3%', '#5eead4', 0.5 + 1 / 3], ['7.11%', '#f87171', 0.5 + 2 / 3]].forEach(([t, c, u]) => {
      const cx = (u % 1) * 2048; x.save(); x.translate(cx, 512); x.rotate(-PI / 2); x.fillStyle = c; x.font = '900 290px Inter, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(t, 0, 12); x.restore(); });
    dl.tx.needsUpdate = true; })();
  const mDial = new T.MeshStandardMaterial({ map: dl.tx, emissive: 0xffffff, emissiveMap: dl.tx, emissiveIntensity: 0.6, roughness: 0.5, metalness: 0.1 });
  const mTapa = mat(0x1e293b, { roughness: 0.5, metalness: 0.3 });
  const tambor = new T.Mesh(new T.CylinderGeometry(DR, DR, DL, 72, 1, false, PI), [mDial, mTapa, mTapa]);
  tambor.rotation.z = -PI / 2; tambor.castShadow = true;
  const giroD = new T.Group(); giroD.add(tambor); giroD.position.y = DR; dialG.add(giroD);
  const mAro = mat(0xef4444, { emissive: 0xef4444, emissiveIntensity: 0.9, roughness: 0.4 });
  [-1, 1].forEach(sx => { const a = new T.Mesh(new T.TorusGeometry(DR + 0.012, 0.04, 10, 72), mAro); a.rotation.y = PI / 2; a.position.x = sx * DL / 2; giroD.add(a); });
  // o = { x, y, z, esc, ry, num (0 = 6.5%, 1 = 3%, 2 = 7.11%; fractional while it turns), rueda (extra turn in rad), turq 0..1 }
  function dial(o) {
    dialG.visible = true; dialG.position.set(o.x || 0, o.y || 0, o.z || 0); dialG.scale.setScalar(o.esc || 1); dialG.rotation.y = o.ry || 0;
    giroD.rotation.x = (o.rueda || 0) - 2 * PI * (o.num || 0) / 3;
    mAro.color.set(0xef4444).lerp(W.color(TURQH), o.turq || 0); mAro.emissive.copy(mAro.color);
  }

  // ——— the monthly payment slab «$1,896» and its 100 chips (1 chip = 1 cent of each dollar) ———
  const losaG = grupo(), ll = lienzo(768, 320);
  (function () { const x = ll.x; x.fillStyle = '#f8fafc'; x.fillRect(0, 0, 768, 320); x.strokeStyle = '#94a3b8'; x.lineWidth = 10; x.strokeRect(10, 10, 748, 300);
    x.fillStyle = '#0f172a'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = '900 170px Inter, sans-serif'; x.fillText('$1,896', 384, 140);
    x.fillStyle = '#64748b'; x.font = '800 44px DejaVu Sans Mono, monospace'; x.fillText('PER MONTH', 384, 262); ll.tx.needsUpdate = true; })();
  const mLado = mat(0xcbd5e1), mLosa = new T.MeshStandardMaterial({ map: ll.tx, emissive: 0xffffff, emissiveMap: ll.tx, emissiveIntensity: 0.25, roughness: 0.5 });
  const losaM = new T.Mesh(new T.BoxGeometry(1.2, 0.5, 0.12), [mLado, mLado, mLado, mLado, mLosa, mLado]); losaM.castShadow = true; losaG.add(losaM);
  function losa(o) { losaG.visible = true; losaG.position.set(o.x, o.y, o.z); losaG.rotation.set(o.rx || 0, o.ry || 0, o.rz || 0); losaG.scale.setScalar(o.esc || 1); }
  const geoF = new T.BoxGeometry(0.17, 0.17, 0.05);
  const mF = { b: mat(0xe2e8f0, { emissive: 0xffffff, emissiveIntensity: 0.1 }), r: mat(ROJOH, { emissive: ROJOH, emissiveIntensity: 0.5 }), t: mat(TURQH, { emissive: TURQH, emissiveIntensity: 0.5 }) };
  const fichas = Array.from({ length: 100 }, () => { const m = new T.Mesh(geoF, mF.b); m.castShadow = true; m.visible = false; S.add(m); sueltos.push(m); return m; });
  function ficha(i, o) { const m = fichas[i]; m.visible = true; m.material = mF[o.c || 'b']; m.position.set(o.x, o.y, o.z); m.rotation.set(o.rx || 0, o.ry || 0, o.rz || 0); m.scale.setScalar(Math.max(0.001, o.esc || 1)); }

  // ——— generic boxes (lit, with shadows) and glowing strips (unlit): a pool reused every frame ———
  const geoU = new T.BoxGeometry(1, 1, 1), cajas = [], brillos = [];
  let nc = 0, nb = 0;
  function bloque(o) {
    if (nc >= cajas.length) { const m = new T.Mesh(geoU, mat(0xffffff, { transparent: true })); m.castShadow = true; m.receiveShadow = true; S.add(m); cajas.push(m); sueltos.push(m); }
    const m = cajas[nc++], mt = m.material, op = o.op == null ? 1 : o.op; m.visible = op > 0.01;
    mt.color.set(o.color || '#e2e8f0'); mt.emissive.set(o.color || '#e2e8f0').multiplyScalar(o.brillo == null ? 0.15 : o.brillo); mt.opacity = op; mt.depthWrite = op > 0.99;
    m.position.set(o.x, o.y, o.z); m.rotation.set(o.rx || 0, o.ry || 0, o.rz || 0); m.scale.set(Math.max(0.001, o.w), Math.max(0.001, o.h), Math.max(0.001, o.d));
    return m;
  }
  function brillo(o) {
    if (nb >= brillos.length) { const m = new T.Mesh(geoU, new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, toneMapped: false })); S.add(m); brillos.push(m); sueltos.push(m); }
    const m = brillos[nb++], op = o.op == null ? 1 : o.op; m.visible = op > 0.01; m.material.color.set(o.color || '#ffffff'); m.material.opacity = op; m.material.depthWrite = op > 0.99;
    m.position.set(o.x, o.y, o.z); m.rotation.set(o.rx || 0, o.ry || 0, o.rz || 0); m.scale.set(Math.max(0.001, o.w), Math.max(0.001, o.h), Math.max(0.001, o.d));
    return m;
  }
  // ——— tape of 360 payments on the floor (ticks every payment, a longer one every year) ———
  const cinG = grupo(), cl = lienzo(4096, 96);
  (function () { const x = cl.x; x.fillStyle = 'rgba(9,14,27,.92)'; x.fillRect(0, 0, 4096, 96); x.fillStyle = '#f87171';
    for (let i = 0; i < 360; i++) { const px = 8 + i * (4080 / 360), alto = i % 12 === 11 ? 78 : 44; x.fillRect(px, (96 - alto) / 2, 5, alto); } cl.tx.needsUpdate = true; })();
  cl.tx.wrapS = T.ClampToEdgeWrapping;
  const cinM = new T.Mesh(new T.PlaneGeometry(1, 1), new T.MeshBasicMaterial({ map: cl.tx, transparent: true, toneMapped: false, depthWrite: false }));
  cinM.rotation.x = -PI / 2; cinG.add(cinM);
  // o = { x0, z, largo (full length), u 0..1 (unrolled share), ancho }
  function cinta(o) { cinG.visible = o.u > 0.001; const L = o.largo * o.u, an = o.ancho || 0.28; cinM.scale.set(Math.max(0.001, L), an, 1); cinM.position.set(o.x0 + L / 2, 0.012, o.z);
    cl.tx.repeat.set(Math.max(0.001, o.u), 1); cl.tx.offset.set(0, 0); }
  // ——— «+$100» block (turquoise, with its label on the front and the back) ———
  const cienL = lienzo(256, 256); (function () { const x = cienL.x; x.fillStyle = '#2dd4bf'; x.fillRect(0, 0, 256, 256); x.fillStyle = '#06121a'; x.font = '900 86px Inter, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('+$100', 128, 132); cienL.tx.needsUpdate = true; })();
  const mCien = new T.MeshStandardMaterial({ map: cienL.tx, emissive: 0xffffff, emissiveMap: cienL.tx, emissiveIntensity: 0.35, roughness: 0.45 }), mCienL = mat(TURQH, { emissive: TURQH, emissiveIntensity: 0.4 });
  const cienG = grupo(), cienM = new T.Mesh(new T.BoxGeometry(0.42, 0.42, 0.42), [mCienL, mCienL, mCienL, mCienL, mCien, mCien]); cienM.castShadow = true; cienG.add(cienM);
  function cien(o) { cienG.visible = true; cienG.position.set(o.x, o.y, o.z); cienG.rotation.set(o.rx || 0, o.ry || 0, o.rz || 0); cienG.scale.setScalar(Math.max(0.001, o.esc || 1)); }
  // ——— halos (flashes) ———
  const halos = Array.from({ length: 4 }, () => { const s = new T.Sprite(new T.SpriteMaterial({ map: haloTx, color: 0xffffff, blending: T.AdditiveBlending, depthWrite: false, transparent: true })); s.visible = false; S.add(s); sueltos.push(s); return s; });
  let nh = 0;
  function halo(o) { if (nh >= halos.length) return; const s = halos[nh++]; s.visible = (o.op || 0) > 0.01; s.position.set(o.x, o.y, o.z); s.scale.setScalar(o.esc || 1); s.material.opacity = o.op || 0; s.material.color.set(o.color || '#ffffff'); }
  // ——— arrow (shaft + head), red ———
  const flG = grupo(), mFl = mat(0xef4444, { emissive: 0xef4444, emissiveIntensity: 0.7 });
  const flC = new T.Mesh(new T.BoxGeometry(1, 0.09, 0.09), mFl), flP = new T.Mesh(new T.ConeGeometry(0.17, 0.36, 18), mFl); flP.rotation.z = -PI / 2; flG.add(flC); flG.add(flP);
  function flecha(o) { const L = Math.max(0.001, o.largo * o.q); flG.visible = o.q > 0.01; flG.position.set(o.x0, o.y, o.z); flG.rotation.z = o.rz || 0; flC.scale.x = L; flC.position.x = L / 2; flP.position.x = L + 0.12; flP.visible = o.q > 0.15; }

  function apagar() { objs.forEach(g => { g.visible = false; }); sueltos.forEach(m => { m.visible = false; }); nc = 0; nb = 0; nh = 0; apagon(1); }
  return { casa, dondeB, dial, losa, ficha, bloque, brillo, cinta, cien, halo, flecha, apagon, apagar };
})();
W3.X = X3;

// ——— arms and hands of a mannequin (from extenso-loteria-es.js). qa: 0 = as andar() leaves them, 1 = pose; qp: 0 = arms up, 1 = holding at the chest ———
function brazos(a, qa, qp) {
  const ax = -2.75 * (1 - qp) - 0.95 * qp, az = -0.1 * (1 - qp) - 0.2 * qp, cx = -0.15 * (1 - qp) - 1.15 * qp;
  [[a.izq, -1], [a.der, 1]].forEach(([b, sg]) => {
    b.hombro.rotation.x = lerp(b.hombro.rotation.x, ax, qa); b.hombro.rotation.z = lerp(b.hombro.rotation.z, sg * az, qa); b.codo.rotation.x = lerp(b.codo.rotation.x, cx, qa);
  });
}
function manos(hx, hz, g, qp, esc, y) { const ly = (2.2 * (1 - qp) + 1.5 * qp) * (esc || 1.06) / 1.06, lz = (0.3 * (1 - qp) + 0.62 * qp) * (esc || 1.06) / 1.06; return [hx + Math.sin(g) * lz, ly + (y || 0), hz + Math.cos(g) * lz]; }
`;

// 2D layer: 2–4 word labels in the lower-middle third (y ≈ 1.390 px), a small note at the bottom left (y ≈ 1.505), two chips at the
// top (y ≈ 505) in the hook, and the generic statement card in scene 6.
const nota = (txt) => `<div class="nota">${txt}</div>`;
const rt = (cls, html, top) => `<div class="rt ${cls}" data-t="translateX(-50%)"${top ? ` style="top:${top}px"` : ''}>${html}</div>`;
const ESCENAS = [
  // 0 · Hook: «LOAN $300,000» (white) and the red INTEREST counter running from frame 0 while red blocks rain onto the second
  //     house; when the counter passes $300,000 (0.64 s) the red roof closes, identical to the white one: «INTEREST > LOAN».
  { html: () => `<div class="chip izq"><small>LOAN</small><b>$300,000</b></div>
      <div class="chip der roja"><small>INTEREST · YEAR <i class="y">11</i></small><b class="c">$198,215</b></div>
      ${rt('roja', 'INTEREST <span class="r">&gt;</span> LOAN')}${rt('roja p', '360 PAYMENTS OF $1,896<br><span class="r">$682,633</span> PAID')}
      ${nota('Example: $300,000 loan · 30-year fixed · 6.5%<br>principal &amp; interest only')}`,
    anim: function (s, e, el) {
      const M = e.seg[0].marcas, m1 = Math.max(M[1] != null ? M[1] : 3.4, 3.05), m2 = Math.max(M[2] != null ? M[2] : 5.0, m1 + 0.8), r = el.querySelectorAll('.rt');
      const mes = mesG(s), I = mes >= 359.999 ? 382633 : HIP.int(mes), ch = el.querySelectorAll('.chip');
      ch[1].querySelector('.c').textContent = dinero(I); ch[1].querySelector('.y').textContent = Math.max(1, Math.ceil(mes / 12 - 1e-6));   // payment 218 is in year 19
      const fl = s > TCRUCE ? Math.exp(-(s - TCRUCE) * 6) : 0;
      ch[1].style.transform = 'scale(' + (1 + 0.14 * Math.sin(PI * tramo(s, TCRUCE, TCRUCE + 0.3))) + ')'; ch[1].style.transformOrigin = '100% 0';
      ch[1].style.boxShadow = '0 0 ' + Math.round(60 * fl) + 'px rgba(248,113,113,' + (0.9 * fl).toFixed(2) + ')';
      const sale_ = 1 - tramo(s, m1 - 0.2, m1 + 0.02); ch.forEach(c => { c.style.opacity = sale_; });
      ver(r[0], s, TCRUCE, m2); ver(r[1], s, m2 + 0.15);
      el.querySelector('.nota').style.opacity = 1;
    } },
  // 1 · The rate: the drum spins from 6.5% to 3% (turquoise) and 76 red blocks fly off: 52 left, «$155,332».
  { html: () => `${rt('turq', 'AT 3%: LESS THAN <span class="t">HALF</span>')}
      ${nota('3% ≈ 2021 average · 6.5% ≈ 2026 average so far<br>Freddie Mac PMMS, 30-year fixed')}`,
    anim: function (s, e, el) { const M = e.seg[0].marcas, m0 = M[0] != null ? M[0] : 1.2, m1 = M[1] != null ? M[1] : 2.4, r = el.querySelectorAll('.rt');
      ver(r[0], s, m1 + 0.3); ver(el.querySelector('.nota'), s, m0 + 0.2); } },
  // 2 · Today: the drum spins on to 7.11% (red), the red house rebuilds and swells ×1.06; the turquoise mannequin walks up to it.
  { html: () => `<div class="chip izq roja" style="opacity:0"><small>EACH +1 POINT</small><b>≈ +$200/mo</b></div>
      ${rt('turq', 'CAN YOU <span class="t">SHRINK IT?</span>')}
      ${nota('Freddie Mac PMMS · 30-year fixed average<br>week of Nov 12, 2026')}`,
    anim: function (s, e, el) { const M = e.seg[0].marcas, m0 = M[0] != null ? M[0] : 2.9, r = el.querySelectorAll('.rt');
      ver(r[0], s, m0 + 0.15); ver(el.querySelector('.chip'), s, 1.3); ver(el.querySelector('.nota'), s, 0.35); } },
  // 3 · Year one: the $1,896 slab breaks into 100 chips; 85 go red to the red house, 15 turquoise to the white one.
  { html: () => `<div class="chip izq" style="opacity:0"><small>YEAR</small><b>1</b></div>
      ${rt('roja', '<span class="r">85¢</span> OF EVERY $1')}${rt('roja p', 'YEAR 1: <span class="r">$19,401</span> INTEREST<br><span class="t">$3,353</span> PRINCIPAL')}
      ${nota('Example: $300,000 · 30-year fixed · 6.5%<br>principal &amp; interest only')}`,
    anim: function (s, e, el) { const M = e.seg[0].marcas, m0 = M[0] != null ? M[0] : 1.2, m1 = M[1] != null ? M[1] : 2.3, m2 = M[2] != null ? M[2] : 4.4, r = el.querySelectorAll('.rt');
      ver(el.querySelector('.chip'), s, m0); ver(r[0], s, m1 + 0.2, m2); ver(r[1], s, m2 + 0.1); ver(el.querySelector('.nota'), s, 0.2); } },
  // 4 · Ten years: the white house is still mostly grey (owed), 15 turquoise blocks paid; the red one has 61 of its 128.
  { html: () => `<div class="chip izq"><small>YEAR</small><b class="y">1</b></div>
      ${rt('', 'PAID <span class="a">$227,544</span>')}${rt('', 'STILL OWE <span class="a">$254,328</span>')}`,
    anim: function (s, e, el) { const M = e.seg[0].marcas, m1 = M[1] != null ? M[1] : 2.1, r = el.querySelectorAll('.rt');
      const t10 = Math.max(0.9, m1 - 0.7); el.querySelector('.y').textContent = Math.max(1, Math.min(10, Math.floor(1 + 9 * tramo(s, 0.1, t10) + 1e-6)));
      ver(r[0], s, t10 + 0.08, m1); ver(r[1], s, m1 + 0.05); } },
  // 5 · Extra payments: «+$100» blocks into the white house; red blocks jump off the annex (128 → 107); the 30-year bar loses 4.
  { html: () => `${rt('turq p', '<span class="t">+$100</span>/MONTH FROM DAY ONE')}${rt('turq', '<span class="t">−$60,995</span> INTEREST<small>IF KEPT 30 YEARS</small>')}
      ${rt('turq g', '30 → <span class="t">26</span> YEARS')}
      ${nota('Example: 6.5% · extra applied to principal<br>no prepayment penalty')}`,
    anim: function (s, e, el) { const M = e.seg[0].marcas, m0 = M[0] != null ? M[0] : 2.6, m1 = M[1] != null ? M[1] : 4.2, m2 = M[2] != null ? M[2] : 5.8, r = el.querySelectorAll('.rt');
      ver(r[0], s, m0, m1); ver(r[1], s, m1 + 0.15, m2 + 0.55); ver(r[2], s, m2 + 0.65); ver(el.querySelector('.nota'), s, 0.3); } },
  // 6 · Close: a generic statement card with the «Prepayment penalty» line in amber; then the red house builds back to 128 and,
  //     on {pop}, loses 21 at once: «−$61,000 · 4 YEARS SOONER». Hard cut on that image.
  { html: () => `<div class="ext" data-t="translateX(-50%)"><div class="cab"><span>EXAMPLE STATEMENT</span><span>MORTGAGE</span></div>
        <h3>Account information</h3>
        <div class="f"><span>Interest rate</span><b>6.500%</b></div>
        <div class="f"><span>Payment due</span><b>$1,896.20</b></div>
        <div class="f pp"><span>Prepayment penalty</span><b>_____</b></div></div>
      ${rt('turq r48', '<span class="t">−$61,000</span> · 4 YEARS SOONER')}`,
    anim: function (s, e, el) { const M = e.seg[0].marcas, m0 = M[0] != null ? M[0] : 1.9, m2 = M[2] != null ? M[2] : 5.4, g = e.seg[0];
      const tpp = g.res[0] ? g.res[0].ini : 0.8, c = el.querySelector('.ext'), ent = sale(tramo(s, 0, 0.5)), va = suave(tramo(s, m0 + 0.35, m0 + 0.95));
      c.style.opacity = Math.min(1, ent * 1.4) * (1 - tramo(s, m0 + 0.8, m0 + 0.95));
      c.style.transform = 'translateX(' + (-50 - 140 * va) + '%) perspective(1400px) rotateY(' + (65 * (1 - ent)) + 'deg) rotateZ(' + (-9 * va) + 'deg) scale(' + (0.75 + 0.25 * ent) + ')';
      const pp = el.querySelector('.pp'), a = rebote(tramo(s, tpp - 0.05, tpp + 0.3));
      pp.style.borderColor = 'rgba(245,185,74,' + Math.min(1, a).toFixed(2) + ')'; pp.style.background = 'rgba(245,185,74,' + (0.22 * Math.min(1, a)).toFixed(2) + ')';
      pp.style.transform = 'scale(' + (1 + 0.06 * Math.sin(PI * tramo(s, tpp, tpp + 0.4))) + ')';
      ver(el.querySelector('.rt'), s, m2 + 0.3); } }
];

const TRES = function (t, k, s, e, W) {
  const X = W.X; X.apagar();
  const D = e.fin - e.ini, M = e.seg.flatMap(g => g.marcas), res = e.seg.flatMap(g => g.res);
  const mk = (j, def) => (M[j] != null ? M[j] : def);
  const q = (a, d) => sale(tramo(s, a, a + (d || 0.45)));
  const bote = (a, d) => rebote(tramo(s, a, a + (d || 0.35)));
  const cam = (C) => W.camara(C[0], C[1], C[2], C[3], C[4], C[5]);
  const fuera = { x: -60, z: -60, esc: 0 };
  const ROJ = '#f87171', TQ = '#5eead4', AMB = '#f5b94a', BLANCO = '#e2e8f0';
  const BLANCA = { x: WX, z: 0, esc: ESCC }, ROJA = { x: RX, z: 0, esc: ESCC };
  const blanca = (o) => X.casa('blanca', Object.assign({}, BLANCA, o));
  const roja = (o) => X.casa('roja', Object.assign({}, ROJA, o));
  const rojoB = (extra) => Object.assign({ color: ROJOH, brillo: 0.32 }, extra);
  const blancoB = (extra) => Object.assign({ color: BLANCOH, brillo: 0.06 }, extra);
  let directo = () => fuera;

  if (k === 0) {
    // ——— the hook ———
    const m1 = Math.max(mk(1, 3.4), 3.05), m2 = Math.max(mk(2, 5.0), m1 + 0.8), tc = TCRUCE, TS = 2.5;
    const hincha = 1 + 0.08 * Math.sin(PI * tramo(s, tc, tc + 0.32)) + 0.05 * Math.sin(PI * tramo(s, m1, m1 + 0.4));
    blanca({ inclina: 0.052 * Math.sin(PI * tramo(s, tc + 0.02, tc + 0.42)), bloque: () => blancoB() });
    roja({ pulso: hincha, bloque: (j) => bloqueG(j, s) });
    // the stamp «$382,633 INTEREST» hits the red facade when the counter stops (2.5 s); «6.5% · 30 YEARS» under it
    const st = bote(TS, 0.32), va = tramo(s, m1, m1 + 0.25);
    if (s > TS - 0.05 && va < 1) {
      const tam = 0.46 * (1 + 0.5 * (1 - Math.min(1, st)));
      W.rotulo('s382', '$382,633 INTEREST', RX + 0.42, 1.35, 0.62, Math.min(1, st * 1.3) * (1 - va), ROJ, tam);
      W.rotulo('s65', '6.5% · 30 YEARS', RX + 0.42, 0.93, 0.62, Math.min(1, st * 1.3) * (1 - va), '#fca5a5', 0.26);
      if (s < TS + 0.3) X.halo({ x: RX + 0.4, y: 1.4, z: 0.7, esc: 4.5, op: 0.55 * Math.sin(PI * tramo(s, TS, TS + 0.3)), color: '#fca5a5' });
    }
    // on {pop} «the interest alone»: «$300,000» over the white house and «$382,633» over the red one (they grow), a red arrow
    // from one to the other; the red house swells again
    if (s > m1 - 0.05) {
      const fu = 1 - tramo(s, m2 - 0.3, m2 + 0.0), a = Math.min(1, 1.3 * bote(m1, 0.35)) * fu, b = Math.min(1, 1.3 * bote(m1 + 0.12, 0.35)) * fu, cr = 1 + 0.25 * sale(tramo(s, m1 + 0.3, m1 + 1.1));
      W.rotulo('w300', '$300,000', WX, 3.5, 0.3, a, BLANCO, 0.42 * cr);
      W.rotulo('r382', '$382,633', RX + 0.35, 3.65 + 0.15 * (cr - 1), 0.3, b, ROJ, 0.48 * cr);
      X.flecha({ x0: WX + 0.62 * cr, y: 3.55, z: 0.3, largo: 2.35 - 1.1 * cr + 0.2, q: sale(tramo(s, m1 + 0.15, m1 + 0.55)) * fu });
    }
    // on «is more than you borrowed»: the tape of 360 payments unrolls on the floor in front of the houses
    X.cinta({ x0: -3.0, z: 1.3, largo: 7.6, u: sale(tramo(s, m2, m2 + 1.3)), ancho: 0.5 });
    if (s > m2) for (let y = 0; y <= 30; y += 5) { const xx = -3.0 + 7.6 * (y * 12) / 360; if (tramo(s, m2, m2 + 1.3) * 360 >= y * 12) W.rotulo('cy' + y, y === 0 ? 'YEAR 0' : 'YEAR ' + y, xx + (y === 0 ? 0.15 : 0), 0.14, 1.78, 1, '#94a3b8', 0.19); }
    if (s > tc && s < tc + 0.35) X.halo({ x: RX, y: 2.9, z: 0.4, esc: 3.2, op: 0.6 * Math.sin(PI * tramo(s, tc, tc + 0.35)), color: '#fecaca' });
    // camera: low travelling right → left with crane up (both houses in frame at the crossing) → orbit to three quarters on the
    // red side while the annex grows → crane up → 5% push on the stamp → pull back sweeping round to the double shot → down to the
    // floor along the tape. Never still.
    const C = ruta(orden([[0, [3.3, 1.2, 9.6, 0.8, 1.5, 0]], [0.5, [2.2, 1.65, 10.9, 0.35, 1.6, 0]], [tc, [1.2, 1.95, 12.3, 0.1, 1.6, 0]],
      [1.0, orbita([1.0, 2.2, 12.6, 1.0, 1.5, 0], 0.26)], [1.5, orbita([1.15, 2.8, 12.4, 1.15, 1.6, 0], 0.4)], [2.0, [4.6, 4.5, 12.2, 1.1, 1.9, 0]],
      [TS, [2.4, 3.0, 10.8, 1.3, 1.55, 0]], [3.0, orbita([0.9, 3.0, 13.4, 0.9, 1.6, 0], 0.18)], [m1, orbita([0.8, 3.0, 13.2, 0.8, 1.65, 0], -0.12)],
      [m1 + 0.7, orbita([0.55, 2.7, 13.0, 0.55, 1.6, 0], -0.24)], [m2, orbita([0.6, 1.5, 10.8, 0.6, 1.15, 0.4], -0.36)], [m2 + 1.0, [-3.9, 1.7, 5.6, 0.4, 0.3, 1.3]],
      [D + 0.6, [-2.6, 1.55, 5.4, 1.4, 0.35, 1.3]]]), s);
    const sh = s > tc ? 0.06 * Math.exp(-(s - tc) * 11) : 0, sh2 = s > TS ? 0.04 * Math.exp(-(s - TS) * 12) : 0;
    cam([C[0] + (sh + sh2) * Math.sin(s * 83), C[1] + (sh + sh2) * Math.cos(s * 71), C[2], C[3], C[4], C[5]]);
  } else if (k === 1) {
    // ——— the rate: the drum drops in spinning and lands on 6.5% in front of the gap; at «3%» it rolls on to 3% and turns
    //     turquoise, and the top 76 red blocks fly off (128 → 52); on {ding} the ghost of the 6.5% house stays in place ———
    const m0 = mk(0, 1.2), m1 = mk(1, 2.4);
    const ud = tramo(s, -0.12, 0.42), bo = ud >= 1 ? 0.07 * Math.exp(-(s - 0.42) * 9) * Math.abs(Math.sin((s - 0.42) * 16)) : 0, giro = sale(tramo(s, m0 + 0.02, m0 + 0.55));
    X.dial({ x: 0, y: 2.6 * (1 - ud * ud) + bo, z: 1.9, esc: 0.85, num: giro, rueda: 0.35 * Math.sin(s * 9) * (1 - tramo(s, 0.3, 0.8)), turq: giro });
    if (giro > 0 && giro < 1) X.halo({ x: 0, y: 0.45, z: 2.3, esc: 2.6, op: 0.45 * Math.sin(PI * giro), color: TQ });
    blanca({ bloque: () => blancoB() });
    const fant = 0.14 * q(m1 - 0.1, 0.4);
    roja({ bloque: (j) => {
      if (j < 52) return rojoB();
      const tj = m0 + 0.1 + 0.0095 * (127 - j), u = tramo(s, tj, tj + 0.55);
      if (u >= 1) return fant > 0.01 ? { color: ROJOH, brillo: 0.6, op: fant } : null;
      return rojoB({ dy: 8 * u * u, dx: (((j * 7) % 5) - 2) * 0.9 * u, rx: 4 * u, rz: 3 * u * (j % 2 ? 1 : -1), op: 1 - tramo(u, 0.55, 1) });
    } });
    if (s > m1 - 0.05) W.rotulo('s155', '$155,332', RX, 1.0, 0.62, Math.min(1, 1.3 * bote(m1, 0.32)), ROJ, 0.42 * (1 + 0.4 * (1 - Math.min(1, bote(m1, 0.32)))));
    cam(ruta(orden([[0, [0.4, 0.55, 6.7, 0.1, 1.2, 0.6]], [m0, [0.15, 0.85, 6.2, 0.2, 1.35, 0.6]], [m0 + 0.9, orbita([0.9, 2.5, 11.2, 0.9, 1.45, 0], -0.32)],
      [m1 + 0.4, orbita([1.1, 2.1, 9.9, 1.15, 1.1, 0], -0.22)], [D + 0.5, orbita([1.15, 2.0, 9.3, 1.2, 1.0, 0], -0.12)]]), s));
  } else if (k === 2) {
    // ——— today: the drum rolls on to 7.11% (red); the 76 blocks fall back and the red house swells ×1.06 (at 7.11% it would be
    //     142 blocks); on «So can you…» the turquoise mannequin walks up to it and looks up ———
    const m0 = mk(0, 2.9), giro = sale(tramo(s, 0.15, 0.75));
    X.dial({ x: 0, z: 1.9, esc: 0.85, num: 1 + giro, turq: 1 - giro });
    W.rotulo('tw', 'THIS WEEK', 0, 1.2, 1.9, Math.min(1, 1.3 * bote(0.7, 0.3)) * (1 - tramo(s, m0 - 0.3, m0)), ROJ, 0.24);
    blanca({ bloque: () => blancoB() });
    const hin = 1 + 0.06 * sale(tramo(s, 1.5, 2.1)) + 0.03 * Math.sin(PI * tramo(s, 1.5, 1.85));
    roja({ pulso: hin, bloque: (j) => {
      if (j < 52) return rojoB();
      const tj = 0.4 + 0.014 * (j - 52), u = tramo(s, tj - 0.24, tj);
      if (u <= 0) return { color: ROJOH, brillo: 0.6, op: 0.14 };
      return rojoB({ dy: 6 * (1 - u * u) + (u >= 1 ? 0.14 * Math.exp(-(s - tj) * 15) * Math.sin((s - tj) * 32) : 0) });
    } });
    if (s > 1.45 && s < 2.1) X.halo({ x: RX, y: 1.6, z: 0.6, esc: 5, op: 0.4 * Math.sin(PI * tramo(s, 1.5, 2.1)), color: '#fca5a5' });
    if (s > m0 - 0.7) {
      const H0 = [RX + 2.5, 3.5], H1 = [RX - 0.3, 2.6], u = tramo(s, m0 - 0.7, m0 + 0.8), e_ = sale(u), hx = lerp(H0[0], H1[0], e_), hz = lerp(H0[1], H1[1], e_);
      const gAnda = Math.atan2(H1[0] - H0[0], H1[1] - H0[1]);
      W.heroe({ x: hx, z: hz, gira: angulo(gAnda, PI, suave(tramo(s, m0 + 0.45, m0 + 1.05))), amp: 1 - tramo(s, m0 + 0.55, m0 + 0.85), fase: s * 8.5, luz: 0.8 });
    }
    cam(ruta(orden([[0, orbita([0.1, 0.8, 6.6, 0.1, 1.15, 1.2], 0.3)], [1.4, orbita([0.4, 0.95, 7.4, 0.5, 1.45, 0.8], 0.05)], [m0 - 0.2, orbita([0.7, 1.15, 8.2, 0.8, 1.6, 0.3], -0.12)],
      [m0 + 0.9, [RX + 0.95, 0.75, 7.6, RX - 0.1, 1.7, 0]], [D + 0.5, [RX + 0.2, 0.62, 7.0, RX, 1.8, 0]]]), s));
  } else if (k === 3) {
    // ——— year one: the $1,896 slab falls into the mannequin's arms; on «in year one» it breaks into 100 chips in a 10 × 10 grid;
    //     on «85 cents» 85 turn red and fly to the red house, 15 turquoise to the white one; then the 85/15 bar on the floor ———
    const m0 = mk(0, 1.2), m1 = mk(1, 2.3), m2 = mk(2, 4.4);
    blanca({ bloque: () => blancoB() }); roja({ bloque: () => rojoB() });
    const HX = -0.95, HZ = 2.7, HG = 0.25, qp = 1, mp = manos(HX, HZ, HG, 1, 1.06, 0);
    W.heroe({ x: HX, z: HZ, gira: HG, luz: 0.8 }); brazos(W.H, sale(tramo(s, 0.0, 0.35)) * (1 - q(m0 + 0.3, 0.4)), qp);
    const GX = 0.45, GY = 4.35, GZ = 2.05, PASO = 0.21;
    const celda = (i) => [GX + ((i % 10) - 4.5) * PASO, GY + (4.5 - Math.floor(i / 10)) * PASO, GZ];
    if (s < m0) {
      const u = tramo(s, -0.1, 0.42), y = mp[1] + 3.2 * (1 - u * u), rb = u >= 1 ? 0.05 * Math.exp(-(s - 0.42) * 10) * Math.sin((s - 0.42) * 25) : 0;
      X.losa({ x: mp[0], y: y + rb + 0.12, z: mp[2] + 0.05, ry: HG, rx: -0.15 + 0.6 * (1 - u), rz: 0.4 * (1 - u) });
    } else {
      // the 100 chips: from the slab to their cell, colour wave on «85 cents», then the flights (shuffled order)
      const tinte = (i) => q(m1 + 0.02 * Math.floor(i / 10), 0.25);
      for (let i = 0; i < 100; i++) {
        const c0 = [mp[0] + ((i % 10) - 4.5) * 0.12, mp[1] + 0.12 + (4.5 - Math.floor(i / 10)) * 0.05, mp[2] + 0.05], c1 = celda(i), u = sale(tramo(s, m0, m0 + 0.55 + 0.003 * i));
        let p = mezcla(c0, c1, u); p[2] += 0.5 * Math.sin(PI * u);
        const rojo = i < 85, col = tinte(i) > 0.5 ? (rojo ? 'r' : 't') : 'b';
        const ord = (i * 37) % 100, tf = m1 + 0.45 + 0.013 * ord, v = tramo(s, tf, tf + 0.6);
        if (v >= 1) continue;
        if (v > 0) {
          const dest = rojo ? [RX + (((i * 13) % 9) - 4) * 0.26, 0.35 + ((i * 7) % 10) * 0.27, 0.35] : [WX + (((i * 5) % 9) - 4) * 0.26, 0.2 + ((i * 3) % 3) * 0.2, 0.35];
          const ev = suave(v); p = mezcla(c1, dest, ev); p[1] += 1.4 * Math.sin(PI * v);
          X.ficha(i, { x: p[0], y: p[1], z: p[2], c: col, rx: 5 * v, ry: 3 * v, esc: 1 - 0.6 * tramo(v, 0.7, 1) });
        } else X.ficha(i, { x: p[0], y: p[1], z: p[2], c: col, ry: (1 - u) * 1.2 });
      }
      if (s > m1 + 0.4) { X.halo({ x: RX, y: 1.4, z: 0.6, esc: 3.5, op: 0.3 * tramo(s, m1 + 0.6, m1 + 1.0) * (1 - tramo(s, m1 + 1.9, m1 + 2.3)), color: '#fca5a5' }); }
    }
    // the 85/15 bar on the floor: turquoise under the white house, red under the red one
    const g = sale(tramo(s, m2, m2 + 0.7)), LT = 5.0, x0 = -2.5;
    if (g > 0.01) {
      X.bloque({ x: x0 + LT * 0.15 * g / 2, y: 0.07, z: 1.55, w: LT * 0.15 * g, h: 0.14, d: 0.42, color: '#2dd4bf', brillo: 0.4 });
      X.bloque({ x: x0 + LT * 0.15 + 0.04 + LT * 0.85 * g / 2, y: 0.07, z: 1.55, w: LT * 0.85 * g, h: 0.14, d: 0.42, color: '#ef4444', brillo: 0.4 });
      W.rotulo('b15', '15¢', x0 + LT * 0.075, 0.42, 1.75, q(m2 + 0.4, 0.3), TQ, 0.28);
      W.rotulo('b85', '85¢', x0 + LT * 0.15 + LT * 0.425, 0.42, 1.75, q(m2 + 0.5, 0.3), ROJ, 0.28);
    }
    cam(ruta(orden([[0, orbita([HX + 0.1, 1.6, HZ + 4.8, HX + 0.1, 1.5, HZ], 0.38)], [m0, orbita([HX + 0.15, 1.95, HZ + 4.6, HX + 0.15, 1.85, HZ], 0.12)],
      [m0 + 0.45, orbita([0.1, 2.9, 8.6, 0.1, 3.3, 2.2], 0.0)], [m0 + 0.8, orbita([0.4, 3.7, 8.7, 0.4, 4.25, 2.0], -0.08)], [m1 + 0.45, orbita([0.4, 3.55, 9.0, 0.4, 4.1, 2.0], -0.2)],
      [m1 + 1.7, orbita([0.3, 2.3, 11.6, 0.3, 1.45, 0.6], -0.3)], [m2, orbita([0.2, 2.2, 11.8, 0.2, 1.25, 0.6], -0.2)], [D + 0.5, orbita([0.2, 2.3, 11.3, 0.2, 1.15, 0.6], 0.05)]]), s));
  } else if (k === 4) {
    // ——— ten years: the year chip runs 1 → 10; in the white house only the paid principal lights up (15 turquoise blocks), the
    //     rest is grey and see-through (owed); the red house fills to 61 of its 128 (interest paid); on «you still owe» the 85 grey
    //     blocks blink ———
    const m1 = mk(1, 2.1), ano = 1 + 9 * tramo(s, 0.1, Math.max(0.9, m1 - 0.7)), mes = 12 * ano;
    const nT = Math.round((300000 - HIP.saldo(mes)) / 3000), nR = Math.round(HIP.int(mes) / 3000), parpa = q(m1, 0.3);
    blanca({ bloque: (j) => j < nT ? { color: TURQH, brillo: 0.45 } : { color: GRISH, brillo: 0.05 + 0.25 * parpa * (0.5 + 0.5 * Math.sin(s * 11)), op: 0.36 + 0.3 * parpa * (0.5 + 0.5 * Math.sin(s * 11)) } });
    roja({ bloque: (j) => j < nR ? rojoB() : { color: ROJOH, brillo: 0.6, op: 0.12 } });
    cam(ruta(orden([[0, orbita([0.5, 2.4, 12.8, 0.5, 1.5, 0], 0.24)], [m1, orbita([0.3, 2.2, 12.0, 0.3, 1.5, 0], 0.04)],
      [D + 0.5, orbita([WX + 0.25, 1.65, 7.0, WX + 0.1, 1.45, 0], -0.16)]]), s));
  } else if (k === 5) {
    // ——— extra payments: back to year 0. The mannequin carries a «+$100» block into the white house; then one turquoise block
    //     per beat (faster and faster) and, for each, a red block jumps off the annex (128 → 107); the 30-year bar loses 4 ———
    const m0 = mk(0, 2.6), m1 = mk(1, 4.2), m2 = mk(2, 5.8);
    const HZ = 1.45, H0x = WX - 2.4, H1x = WX + 0.95, TA = Math.max(0.8, m0 - 0.6), hxA = (x) => lerp(H0x, H1x, sale(tramo(x, 0, TA)));
    const ua = sale(tramo(s, 0, TA)), vete = tramo(s, m1 + 0.25, m1 + 1.6), hx = vete > 0 ? lerp(H1x, WX - 3.2, vete) : hxA(s), anda = ua < 0.99 || (vete > 0 && vete < 1);
    const HG = vete > 0 ? angulo(PI - 0.35, -PI / 2, q(m1 + 0.2, 0.25)) : ua < 0.99 ? PI / 2 : angulo(PI / 2, PI - 0.35, q(m0 - 0.6, 0.4));
    W.heroe({ x: hx, z: HZ, gira: HG, amp: anda ? 1 : 0, fase: s * 8, luz: 0.9, visible: vete < 0.98 }); brazos(W.H, 1 - q(m1 + 0.2, 0.3), 1);
    const mp = manos(hx, HZ, HG, 1, 1.06, 0), DESTW = [WX + 0.3, 0.9, 0.42];
    // the first «+$100» goes in at m0 − 0.3; then 21 beats between m0 and m1 − 0.15
    const NB = 21, tb = (i) => m0 + (m1 - 0.15 - m0) * Math.pow(i / (NB - 1), 0.62);
    const ent = tramo(s, m0 - 0.35, m0 - 0.05);
    if (ent < 1) { const p = mezcla(mp, DESTW, suave(ent)); p[1] += 0.3 * Math.sin(PI * ent); X.cien({ x: p[0], y: p[1] + 0.15 * (1 - ent), z: p[2] + 0.1, ry: 0.2 * Math.sin(s * 3), esc: 1 - 0.3 * ent }); }
    if (s > m0 - 0.05 && s < m0 + 0.3) X.halo({ x: DESTW[0], y: DESTW[1], z: 0.5, esc: 2.4, op: 0.6 * Math.sin(PI * tramo(s, m0 - 0.05, m0 + 0.3)), color: TQ });
    let quedan = 128;
    for (let i = 0; i < NB; i++) {
      const t0 = tb(i), v = tramo(s, t0 - 0.28, t0);
      if (v > 0 && v < 1) { const p = mezcla(mp, [DESTW[0] + ((i % 3) - 1) * 0.3, DESTW[1] + ((i % 4) - 1.5) * 0.25, DESTW[2]], suave(v)); p[1] += 0.35 * Math.sin(PI * v); X.bloque({ x: p[0], y: p[1], z: p[2], w: 0.2, h: 0.2, d: 0.2, color: '#2dd4bf', brillo: 0.5, ry: 3 * v }); }
      if (s >= t0) quedan--;
    }
    blanca({ bloque: () => ({ color: GRISH, brillo: 0.06 }) });
    roja({ bloque: (j) => {
      if (j < 107) return rojoB();
      const i = 127 - j, t0 = tb(i), w = tramo(s, t0, t0 + 0.7);
      if (w <= 0) return rojoB();
      if (w >= 1) return null;
      return rojoB({ dx: 2.2 * w, dy: 2.4 * Math.sin(PI * Math.min(1, w * 1.4)) - 5 * w * w, dz: 1.2 * w, rx: 5 * w, rz: -4 * w, op: 1 - tramo(w, 0.75, 1) });
    } });
    // the 30-year bar on the floor: appears after «saves», and on «four years» its last 4 years turn red, break off and fall
    const ab = sale(tramo(s, m1 + 0.3, m1 + 0.9)), x0 = -2.6, LT = 5.2, Y1 = LT / 30, corta = sale(tramo(s, m2 + 0.05, m2 + 0.5)), cae = tramo(s, m2 + 0.35, m2 + 1.1);
    if (ab > 0.01) {
      const tq = q(m2 + 0.4, 0.4);
      X.bloque({ x: x0 + 26 * Y1 * ab / 2, y: 0.09, z: 1.75, w: 26 * Y1 * ab, h: 0.18, d: 0.42, color: tq > 0.5 ? '#2dd4bf' : '#cbd5e1', brillo: 0.15 + 0.3 * tq });
      if (ab > 26 / 30) X.bloque({ x: x0 + 26 * Y1 + 0.03 + (ab * LT - 26 * Y1) / 2 + 0.5 * corta + 0.6 * cae, y: 0.09 + 0.2 * Math.sin(PI * Math.min(1, cae * 1.5)) - 0.5 * cae * cae, z: 1.75 + 0.5 * cae,
        w: ab * LT - 26 * Y1, h: 0.18, d: 0.42, color: corta > 0.3 ? '#ef4444' : '#cbd5e1', brillo: 0.15 + 0.35 * corta, rz: -0.9 * cae, op: 1 - tramo(cae, 0.7, 1) });
      for (let y = 0; y <= 30; y += 5) W.rotulo('yb' + y, String(y), x0 + y * Y1, 0.42, 1.98, ab * (y <= 26 ? 1 : 1 - corta), '#94a3b8', 0.2);
      W.rotulo('b30', '30 YRS', 0, 0.62, 2.05, ab * (1 - q(m2, 0.3)), BLANCO, 0.32);
      W.rotulo('b26', '26 YRS', x0 + 13 * Y1, 0.62, 2.05, tq, TQ, 0.32);
    }
    const sig = (x) => [hxA(x) + 0.05, 1.9 + 0.05 * x, HZ + 6.3 + 0.1 * x, hxA(x) + 0.3, 1.6, HZ - 0.15 * x / TA];   // camera on the walking mannequin
    cam(ruta(orden([[0, sig(0)], [TA * 0.5, sig(TA * 0.5)], [m0 - 0.3, sig(TA)], [m1 - 0.2, orbita([0.7, 2.3, 10.8, 0.7, 1.45, 0], 0.25)],
      [m1 + 0.8, [2.0, 5.0, 9.4, 1.5, 1.25, 0]], [m2 + 0.2, [0.1, 1.3, 9.4, 0.1, 1.0, 1.75]], [D + 0.5, [-0.2, 1.15, 8.8, -0.1, 0.95, 1.75]]]), s));
  } else {
    // ——— close: the statement card (2D) over the dimmed houses; then the 6.5% drum drops in front of the red house and the 21
    //     blocks fall back on (107 → 128): «the rate builds the second house»; on {pop} turquoise blocks go into the white house
    //     and the red one loses 21 at once (128 → 107). Hard cut on that image with «−$61,000 · 4 YEARS SOONER» ———
    const m0 = mk(0, 1.9), m1 = mk(1, 3.1), m2 = mk(2, 5.4);
    X.apagon(1 - 0.5 * (1 - tramo(s, m0 + 0.6, m0 + 1.1)));
    blanca({ bloque: (j) => { const tq = j < 20 ? q(m2 - 0.1 + 0.01 * j, 0.25) : 0; return tq > 0.02 ? { color: TURQH, brillo: 0.45 * tq } : blancoB(); } });
    roja({ bloque: (j) => {
      if (j < 107) return rojoB();
      const tj = m1 + 0.25 + 0.035 * (j - 107), u = tramo(s, tj - 0.24, tj), w = tramo(s, m2 + 0.05, m2 + 0.85);
      if (u <= 0) return null;
      if (w > 0) { if (w >= 1) return null; const a = (j * 2.4) % (2 * PI); return rojoB({ dx: 2.6 * Math.cos(a) * w + 1.2 * w, dy: 3 * Math.sin(PI * Math.min(1, w * 1.3)) - 4 * w * w, dz: 2.4 * Math.abs(Math.sin(a)) * w, rx: 6 * w, rz: 4 * w, op: 1 - tramo(w, 0.7, 1) }); }
      return rojoB({ dy: 6 * (1 - u * u) });
    } });
    if (s > m1 - 0.1) { const ud = tramo(s, m1 - 0.1, m1 + 0.3); X.dial({ x: RX - 0.25, y: 2.4 * (1 - ud * ud), z: 1.8, esc: Math.max(0.001, 0.8 * (1 - sale(tramo(s, m2 + 0.05, m2 + 0.4)))), num: 0, rueda: 0.3 * Math.sin(s * 9) * (1 - tramo(s, m1 + 0.2, m1 + 0.7)), turq: 0 }); }
    for (let i = 0; i < 5; i++) { const v = tramo(s, m2 - 0.35 + 0.05 * i, m2 - 0.05 + 0.05 * i); if (v > 0 && v < 1) { const p = mezcla([WX - 1.4 + 0.3 * i, 1.6, 2.2], [WX - 0.8 + 0.4 * i, 0.4, 0.4], suave(v)); X.bloque({ x: p[0], y: p[1] + 0.5 * Math.sin(PI * v), z: p[2], w: 0.22, h: 0.22, d: 0.22, color: '#2dd4bf', brillo: 0.5, ry: 4 * v }); } }
    if (s > m2 && s < m2 + 0.5) X.halo({ x: RX + 1.4, y: 1.4, z: 0.6, esc: 4, op: 0.5 * Math.sin(PI * tramo(s, m2, m2 + 0.5)), color: '#fca5a5' });
    cam(ruta(orden([[0, orbita([0.5, 2.3, 12.4, 0.5, 1.6, 0], 0.35)], [m0 + 0.9, orbita([0.6, 2.2, 11.0, 0.6, 1.5, 0], 0.15)], [m1 + 0.2, orbita([0.8, 2.5, 11.6, 0.8, 1.45, 0], -0.05)],
      [m2, orbita([0.7, 2.4, 11.3, 0.7, 1.5, 0], -0.22)], [D + 0.6, orbita([0.4, 2.8, 13.4, 0.4, 1.6, 0], -0.32)]]), s));
  }
  W.multitud(t, { directo });
};

const pildoras = {
  'en-mortgage-rate': pildora3d({
    slug: 'en-mortgage-rate', cuenta: 'en',
    T: { en: { titulo: 'A $300,000 mortgage at 6.5% costs $382,633 in interest', guion: GUION } },
    // Narrator voice of reto-en.js / extenso-en.js (never VOZ_SECA), slower than theirs (default tempo 1.17): tempo 1.05 and
    // pauses up to 0.4 s, as in extenso-coche-en.js (with 1.0 that one measured 2.51 words/s, under the 2.6–3.2 target).
    voz: { ...VOZ_NARRADOR, en: { ...VOZ_NARRADOR.en, tempo: 1.05, pausaMax: 0.4 } },
    fijo: () => `<div class="hud i fmt">MONEY, EXPLAINED</div><div class="hud d"><i></i><span id="reloj">00:00</span></div>`,
    cssExtra: CSS, scriptExtra: SCRIPT,
    escenas: ESCENAS, tres: TRES,
    // Short tail after «shrink it» (the cut lands on the −$61,000 image); the 2D layer leaves on the same frame as the hard cut.
    cola: 0.8, corte2d: 'seco',
    texto: { en: TEXTO }
  })
};

module.exports = { pildoras };
