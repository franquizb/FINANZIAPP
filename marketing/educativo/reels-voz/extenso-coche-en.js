// Long format (45–60 s) · @finanziapp (US), in 3D (reels-voz/tres.js), series «Money, explained».
// en-car-84-months · «This $35,000 car really costs $47,302.» (84-month loan at 9% APR, example).
// Final, verified script: guiones/2026-11-en-car-84-months.md (visual hook, scenes, cuadra(), sources, post, cover).
// Expiry: Edmunds figures are Q3 2026. If the Q4 report is out (≈ 1 Jan 2027) before publishing, update the note of scene 3
// and the post text, not the voice.
//
// Sources (as given in the script, checked 18 Nov 2026):
// - Edmunds, press release «New car financing records pile up in Q3 as buyers borrow more and stretch loans longer» (1 Oct 2026):
//   new car, Q3 2026, average APR 7.0%; average term 70.5 months; 84+ month loans 25.5% of financed new-vehicle purchases;
//   used car APR 10.6%. https://www.edmunds.com/press/new-car-financing-records-pile-up-in-q3-as-buyers-borrow-more-and-stretch-loans-longer-according-to-edmunds.html
//   (403 from here; figures checked in Auto Remarketing, 1 Oct 2026, and Click2Houston, 19 Oct 2026. The 70.5 months come from
//   Edmunds' table as the search engine shows it: no outlet we could open repeats it.)
// - Edmunds via CarPro (27 Oct 2026): 29.1% of trade-ins with outstanding loans toward new-vehicle purchases were underwater in
//   Q3 2026, by $7,107 on average. https://www.carpro.com/blog/edmunds-car-buyers-are-getting-deeper-upside-down (post text only)
// - Federal Reserve, G.19 Consumer Credit (6 Nov 2026): commercial banks, new car, Q3 2026 (preliminary): 7.54% at 60 months,
//   7.17% at 72 months. https://www.federalreserve.gov/releases/g19/current/default.htm (the 9% example is reasonable)
// - 12 CFR 1026.18 (Regulation Z, Truth in Lending), eCFR version of 13 Nov 2026: (b) «Amount financed… the amount of credit
//   provided to you or on your behalf»; (d) «Finance charge… “the dollar amount the credit will cost you.”»; (e) «Annual
//   percentage rate… “the cost of your credit as a yearly rate.”»; (h) «Total of payments. The total of payments, using that
//   term, and a descriptive explanation such as “the amount you will have paid when you have made all scheduled payments.”»
//   https://www.ecfr.gov/current/title-12/chapter-X/part-1026/subpart-C/section-1026.18 · https://www.consumerfinance.gov/rules-policy/regulations/1026/18/
// - CFPB, 12 CFR 1026.17: disclosures «clearly and conspicuously in writing», «grouped together»; «finance charge» and «annual
//   percentage rate» «more conspicuous than any other disclosure»; given «before consummation».
//   https://www.consumerfinance.gov/rules-policy/regulations/1026/17/
// - Federal Register 2025-22814 (Federal Reserve and CFPB, Dec 2025): from 1 Jan 2026 Regulation Z covers consumer credit up to
//   $73,400 (was $71,900). https://public-inspection.federalregister.gov/2025-22814.pdf
// - CFPB, «Take control of your auto loan» (Mar 2024) and «Auto loan key terms» (28 Dec 2022): total cost, not just the monthly
//   payment; longer loans, more interest and negative equity risk. https://files.consumerfinance.gov/f/documents/cfpb_auto_loan_guide.pdf
// - Experian, «How Much Do Cars Depreciate per Year?» (20 May 2025), Kelley Blue Book table: −16, −12, −11, −9, −7% of the price in
//   years 1–5 (45% left at 5 years); an average. https://www.experian.com/blogs/ask-experian/how-much-do-cars-depreciate-per-year/
//
// Compared with the script: the voice lines are unchanged (§ marks as in the script). On screen, the hook replaces the separate
// white «ghost» tag (3.0 s) with the same comparison inside the red tag: its lower 74% turns white («$35,000 CAR») and its top
// 26% stays red («$12,302 INTEREST») before the seam opens (one object, so it fits the vertical frame). Scene 2 compares two
// cost towers (same white $35,000 base, different red interest cap) instead of two walls plus towers. Educational only: no
// lender, dealer, carmaker or brand on screen; the disclosure sheet is a generic format marked EXAMPLE.
const { pildora3d } = require('./tres');
const { VOZ_NARRADOR } = require('./_comun');
const { cuadra } = require('../reels/_comun');

// ——— all the checks in the script (guiones/2026-11-en-car-84-months.md, «Cuentas») ———
const r2 = (v) => Math.round(v * 100) / 100;
// ——— Préstamo del ejemplo: 35.000 $ financiados, 9 % APR (0,75 % al mes), cuotas mensuales, sin entrada ni tasas ———
const L = 35000, APR = 0.09, r = APR / 12;
const cuotaExacta = (n) => L * r / (1 - Math.pow(1 + r, -n));
const C84 = r2(cuotaExacta(84)), C60 = r2(cuotaExacta(60));
cuadra('cuota 84 meses (exacta 563,1177)', C84, 563.12);
cuadra('cuota 60 meses (exacta 726,5424)', C60, 726.54);
const TOT84 = r2(C84 * 84), TOT60 = r2(C60 * 60);
cuadra('Total of Payments 84 (84 × 563,12)', TOT84, 47302.08);
cuadra('gancho y cierre: «$47,302»', Math.floor(TOT84), 47302);
cuadra('Total of Payments 60 (60 × 726,54)', TOT60, 43592.4);
cuadra('pantalla: «$43,592»', Math.floor(TOT60), 43592);
const INT84 = r2(TOT84 - L), INT60 = r2(TOT60 - L);
cuadra('Finance Charge 84', INT84, 12302.08);
cuadra('voz: «over $12,000 in interest»', INT84 > 12000, true);
cuadra('Finance Charge 60', INT60, 8592.4);
const DIF = r2(TOT84 - TOT60);
cuadra('84 − 60 meses', DIF, 3709.68);
cuadra('voz: «about $3,700 less»', Math.round(DIF / 100) * 100, 3700);
cuadra('pantalla: «−$3,710»', Math.round(DIF), 3710);
cuadra('pantalla: cuota «$727 → $563»', [Math.round(C60), Math.round(C84)].join('→'), '727→563');
cuadra('cuota baja 163 $ al mes', r2(C60 - C84), 163.42);
// Calendario real con redondeo al céntimo (como un prestamista): la última cuota se ajusta
const calendario = (C, n) => { let b = L, pagado = 0, interes = 0; const saldo = [L], intAc = [0];
  for (let m = 1; m <= n; m++) { const i = r2(b * r); interes = r2(interes + i); let c = C; if (m === n) c = r2(b + i); b = r2(b + i - c); pagado = r2(pagado + c); saldo.push(b); intAc.push(interes); }
  return { saldo, intAc, pagado, interes }; };
const K84 = calendario(C84, 84), K60 = calendario(C60, 60);
cuadra('84: última cuota ajustada → total 47.301,78', K84.pagado, 47301.78);
cuadra('84: con o sin ajuste, «$47,302» al dólar', Math.round(K84.pagado), 47302);
cuadra('84: saldo final 0', K84.saldo[84], 0);
cuadra('60: total con ajuste 43.592,58', K60.pagado, 43592.58);
cuadra('60: «$43,592» / «$43,593» → «about $3,700 less» igual', Math.round((K84.pagado - K60.pagado) / 100) * 100, 3700);
// Etiqueta del gancho: precio + intereses acumulados hasta el mes m (los intereses pesan más al principio)
const etiqueta = (m) => Math.round(L + K84.intAc[m]);
cuadra('etiqueta mes 0', etiqueta(0), 35000);
cuadra('etiqueta mes 84', etiqueta(84), 47302);
cuadra('etiqueta mes 42 (mitad de plazo, más de la mitad del interés)', etiqueta(42) - L > (47302 - L) / 2, true);
// Cada baldosa de la pared: parte roja = interés de ese mes (pesa más al principio)
const intMes = (m) => r2(K84.intAc[m] - K84.intAc[m - 1]);
cuadra('baldosa 1: interés 262,50 $ de 563,12 (47 %)', [intMes(1), Math.round(intMes(1) / C84 * 100)].join('/'), '262.5/47');
cuadra('baldosa 84: interés 4,19 $', intMes(84), 4.19);
cuadra('interés del 1.er año', K84.intAc[12], 2997.43);
cuadra('interés de los 3 primeros años (casi 2/3 del total)', [K84.intAc[36], Math.round(K84.intAc[36] / K84.interes * 100)].join('/'), '7900.99/64');
// Torres y paredes de cuotas
cuadra('pared 84 = 7 columnas × 12', 7 * 12, 84);
cuadra('pared 60 = 5 columnas × 12', 5 * 12, 60);
cuadra('torre 84: parte roja (interés) 26 %', Math.round(INT84 / TOT84 * 100), 26);
cuadra('torre 60: parte roja (interés) 20 %', Math.round(INT60 / TOT60 * 100), 20);
cuadra('alto torre 60 / torre 84', Math.round(TOT60 / TOT84 * 100), 92);
// ——— Datos de mercado (Edmunds, T3 2026; Reserva Federal G.19, 6-nov-2026) ———
const P84 = 25.5;
cuadra('voz: «1 in 4» (25,5 %)', Math.round(100 / P84), 4);
cuadra('multitud: 11 de 44 en rojo = 25 %', 11 / 44, 0.25);
cuadra('ejemplo 9 % entre nuevo (7,0) y usado (10,6) de Edmunds', 7.0 < 9 && 9 < 10.6, true);
cuadra('plazo medio nuevo 70,5 meses < 84', 70.5 < 84, true);
// ——— Patrimonio negativo (ejemplo): depreciación media de Kelley Blue Book citada por Experian (16, 12, 11, 9, 7 % del precio) ———
const DEP = [16, 12, 11, 9, 7];
cuadra('a 5 años queda el 45 %', 100 - DEP.reduce((a, b) => a + b, 0), 45);
const V = [1]; DEP.forEach((d, k) => V.push(r2(V[k] - d / 100)));
cuadra('valor por año (fracción del precio)', V.join(','), '1,0.84,0.72,0.61,0.52,0.45');
const valor = (m) => { const y = Math.floor(m / 12), f = (m % 12) / 12; return y >= 5 ? L * V[5] : L * (V[y] + (V[y + 1] - V[y]) * f); };
const bajoAgua = (K, n) => { const meses = []; for (let m = 1; m <= n; m++) if (K.saldo[m] > valor(m)) meses.push(m); return meses; };
const A84 = bajoAgua(K84, 84), A60 = bajoAgua(K60, 60);
cuadra('84: bajo el agua del mes 1 al 44 sin cortes', [A84[0], A84[A84.length - 1], A84.length].join('-'), '1-44-44');
cuadra('voz: «for over three years» (44 meses > 36)', A84.length > 36, true);
cuadra('84: al cumplir 3 años (saldo 22.629 > valor 21.350)', [Math.round(K84.saldo[36]), Math.round(valor(36))].join('>'), '22629>21350');
cuadra('84: hueco máximo ≈ 1.940 $ hacia el mes 21', (() => { let mx = 0, mm = 0; for (const m of A84) { const g = K84.saldo[m] - valor(m); if (g > mx) { mx = g; mm = m; } } return Math.round(mx / 10) * 10 + '@' + mm; })(), '1940@21');
cuadra('60: solo 2 meses y unos 3 $ con interpolación lineal (no robusto: no va en pantalla)', [A60.length, Math.round(K60.saldo[1] - valor(1))].join('/'), '2/3');
// ——— Regulation Z ———
cuadra('el ejemplo entra en la Reg. Z (≤ 73.400 $ en 2026)', L <= 73400, true);
// ——— Añadido en la verificación (18-nov-2026) ———
cuadra('gancho: etiqueta mes 3', etiqueta(3), 35781);
cuadra('gancho: etiqueta mes 18 (≈ $39,400)', etiqueta(18), 39366);
cuadra('gancho: etiqueta mes 40', etiqueta(40), 43562);
cuadra('gancho: etiqueta mes 63 (≈ $46,400)', etiqueta(63), 46380);
cuadra('etiqueta = pagado + saldo (mes 18)', r2(18 * C84 + K84.saldo[18]), r2(L + K84.intAc[18]));
// Supuesto más duro: más de un 10 % perdido el 1.er mes (lo dice la misma página de Experian) y luego la tabla de KBB
const valor2 = (m) => m >= 12 ? valor(m) : L * (0.90 + (0.84 - 0.90) * (m - 1) / 11);
const B2 = []; for (let m = 1; m <= 84; m++) if (K84.saldo[m] > valor2(m)) B2.push(m);
cuadra('84: con un 10 % perdido el 1.er mes, también 44 meses', [B2[0], B2[B2.length - 1], B2.length].join('-'), '1-44-44');
const B6 = []; for (let m = 1; m <= 60; m++) if (K60.saldo[m] > valor2(m)) B6.push(m);
cuadra('60: con ese 10 %, 11 meses (por eso no va «about even» en pantalla)', B6.length, 11);
cuadra('voz 5: «early on» (el hueco crece hasta el mes 21 y luego se cierra)', K84.saldo[21] - valor(21) > K84.saldo[44] - valor(44), true);

// ——— what is on screen besides the script's checks ———
const ETQ = Array.from({ length: 85 }, (_, m) => etiqueta(m));            // hook tag, month by month
const SALDO = K84.saldo.map(v => Math.round(v));                           // scene 5: owed
const VALOR = Array.from({ length: 85 }, (_, m) => Math.round(valor(m)));  // scene 5: worth (average depreciation)
const FRAC = Array.from({ length: 84 }, (_, j) => r2(intMes(j + 1) / C84 * 1000) / 1000); // scene 1: red share of tile j
cuadra('pantalla: torre 84 → blanco 74 % (35.000 / 47.302)', Math.round(L / 47302 * 100), 74);
cuadra('pantalla: «$12,302 INTEREST» = 47.302 − 35.000', 47302 - L, 12302);
cuadra('pantalla: contador de intereses termina en «$12,302»', Math.round(K84.intAc[84]), 12302);
cuadra('pantalla: rojo de la pared = interés total en cuotas (≈ 21,85)', r2(FRAC.reduce((a, b) => a + b, 0)), 21.85);
cuadra('pantalla: hoja federal 9.00% · $12,302 · $35,000 · $47,302', [APR * 100, Math.round(INT84), L, Math.floor(TOT84)].join('·'), '9·12302·35000·47302');
cuadra('pantalla: la barra roja va por encima del valor del mes 1 al 44', SALDO.slice(1, 45).every((v, i) => v > VALOR[i + 1]) && SALDO[45] <= VALOR[45], true);

const TEXTO = `That $35,000 car, at 9% for 84 months, really costs $47,302.

Same car, same rate, over 60 months: $43,592. The payment goes from $563 to $727 a month, and you keep $3,710.

Before you sign, find the box labeled "Total of Payments": every scheduled payment, added up. Under the Truth in Lending Act (Regulation Z), lenders must show it in writing before you're bound by the loan. The rule covers consumer loans up to $73,400 in 2026. Next to it, "Finance Charge" is the interest and fees in dollars.

On a long loan you can owe more than the car is worth for years. Per Edmunds, 29.1% of trade-ins that still had a loan, toward new cars, were underwater in Q3 2026, by $7,107 on average.

Once the loan is paid off, keep "paying" the same amount to yourself: into savings, or invested in a retirement account, where it can grow over time, with ups and downs.

What's the longest car loan you've been offered?

Example: $35,000 financed at 9% APR, no down payment, taxes or fees. Q3 2026 averages: 7.0% for new cars and 10.6% for used, and 25.5% of new-car loans ran 84 months or more. The underwater estimate uses average depreciation (Kelley Blue Book, via Experian).
Sources: Edmunds (Q3 2026) · Federal Reserve G.19 (Nov 6, 2026) · CFPB, 12 CFR 1026.17–1026.18 · Federal Register, Dec 2025 · CFPB auto loan guide (Mar 2024).
Educational only, not financial advice.

#carloan #personalfinance #carbuying #financialliteracy`;

const GUION = [
  [0, 'This $35,000 car §really costs §{pop}*$47,302*.'],
  [1, 'Because you pay it off over §*84 months*, §and the interest adds up to §{tic}*over $12,000*.'],
  [2, 'Same car, same rate, §over 60 months: §{ding}about *$3,700 less*.'],
  [3, 'So why are §*1 in 4* new-car loans §now *seven years or longer*?'],
  [4, 'Because many of us shop by the *monthly payment*, §{tic}and a longer loan *shrinks it*.'],
  [5, 'Early on, the car loses value faster than you pay it down: §you’d owe *more than it’s worth* §for over three years.'],
  [6, 'Easy to miss: §by federal law, §your loan papers must add up *every payment you’ll make* §in one box: §{caja}*Total of Payments*.'],
  [7, 'Before you sign, §look past the payment. §Read that box. §{pop}For this car: *$47,302*.']
];

const MONO = `'DejaVu Sans Mono', 'Liberation Mono', monospace`;
const CSS = `
  .hud.i.fmt { letter-spacing: .14em; }
  .rt { position: absolute; left: 50%; top: 1290px; padding: 10px 28px 14px; border-radius: 20px; background: rgba(9,14,27,.9); border: 3px solid #e2e8f0;
    color: #fff; font-size: 58px; line-height: 1.1; font-weight: 900; letter-spacing: -.015em; white-space: nowrap; opacity: 0; font-variant-numeric: tabular-nums;
    box-shadow: 0 10px 40px rgba(0,0,0,.45); }
  .rt.p { font-size: 48px; } .rt.g { font-size: 76px; } .rt.amb { border-color: #f5b94a; } .rt.roja { border-color: #f87171; } .rt.turq { border-color: #5eead4; }
  .rt .a { color: #f5b94a; } .rt .r { color: #f87171; } .rt .t { color: #5eead4; }
  .nota { position: absolute; left: 70px; top: 1452px; max-width: 820px; font: 600 24px/1.32 ${MONO}; color: #b6c2d4; background: rgba(7,11,22,.8);
    border-radius: 10px; padding: 6px 14px; opacity: 0; }
  .mes { position: absolute; left: 66px; top: 505px; background: rgba(9,14,27,.9); border: 3px solid #94a3b8; border-radius: 20px; padding: 6px 22px 10px;
    font-variant-numeric: tabular-nums; white-space: nowrap; }
  .mes small { display: block; font: 700 22px/1.35 ${MONO}; letter-spacing: .16em; color: #94a3b8; }
  .mes b { font-size: 62px; line-height: 1; font-weight: 900; color: #fff; } .mes span { font-size: 38px; font-weight: 800; color: #94a3b8; }
  .mes.roja { border-color: #f87171; } .mes.roja b { color: #f87171; }
  .ow { position: absolute; left: 66px; top: 505px; background: rgba(9,14,27,.9); border: 3px solid rgba(148,163,184,.45); border-radius: 20px; padding: 6px 24px 10px;
    font-variant-numeric: tabular-nums; white-space: nowrap; opacity: 0; }
  .ow small { display: block; font: 700 22px/1.35 ${MONO}; letter-spacing: .16em; color: #94a3b8; }
  .ow .f { display: flex; justify-content: space-between; gap: 30px; font-size: 42px; line-height: 1.2; font-weight: 850; }
  .ow .f.r { color: #f87171; } .ow .f.w { color: #e2e8f0; } .ow .f i { font-style: normal; font: 700 26px/1.9 ${MONO}; letter-spacing: .1em; }
`;

// 3D world of this video (added to tres.js): a generic car (boxes, no logo or grille), the price tag and its string, the
// «$563» payment tiles (sprites in the hook, instanced boxes in the wall), generic boxes and glowing strips (towers, road, bars,
// parking lines, ribbons, frames), small dynamic labels, the disclosure sheet and the amber box. Everything is switched off at
// the start of each frame (X3.apagar()) so nothing leaks into another scene.
const SCRIPT = `
const ETQ = ${JSON.stringify(ETQ)}, SALDO = ${JSON.stringify(SALDO)}, VALOR = ${JSON.stringify(VALOR)}, FRAC = ${JSON.stringify(FRAC)};
const INTAC = ${JSON.stringify(K84.intAc)};
const PI = Math.PI;
const mezcla = (P, Q, u) => P.map((v, j) => v + (Q[j] - v) * u);
const suave = (x) => x * x * (3 - 2 * x);
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
// Hook clock: the stamp falls on the {pop} of the voice, never before 2.5 s (the counter is at 84) nor after 2.9 s.
const selloG = (e) => { const m = e.seg[0].marcas[1]; return Math.max(2.5, Math.min(m != null ? m : 2.9, 2.9)); };
// Month shown in the hook (0 → 84): 0.7 s → 3, 1.0 → 18, 1.5 → 40, 2.0 → 63, 2.5 → 84 (then it waits).
const mesG = (s) => pl(s, [[0.5, 0], [0.7, 3], [1.0, 18], [1.5, 40], [2.0, 63], [2.5, 84]]);

const X3 = (() => {
  const W = W3, T = W.T, S = W.S, objs = [], pools = [];
  const grupo = () => { const g = new T.Group(); g.visible = false; S.add(g); objs.push(g); return g; };
  const mat = (c, o) => new T.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.55, metalness: 0.08 }, o || {}));
  const basico = (c, o) => new T.MeshBasicMaterial(Object.assign({ color: c, toneMapped: false }, o || {}));
  const pieza = (g, geo, m, x, y, z) => { const o = new T.Mesh(geo, m); o.position.set(x, y, z); o.castShadow = true; o.receiveShadow = true; g.add(o); return o; };
  const caja = (g, w, h, d, m, x, y, z) => pieza(g, new T.BoxGeometry(w, h, d), m, x, y, z);
  const lienzo = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const tx = new T.CanvasTexture(c); tx.encoding = T.sRGBEncoding; tx.anisotropy = 4; return { c, x: c.getContext('2d'), tx, clave: null }; };
  const geoU = new T.BoxGeometry(1, 1, 1);
  const haloTx = (() => { const l = lienzo(256, 256), g = l.x.createRadialGradient(128, 128, 0, 128, 128, 128); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.3, 'rgba(255,255,255,.4)'); g.addColorStop(1, 'rgba(255,255,255,0)'); l.x.fillStyle = g; l.x.fillRect(0, 0, 256, 256); l.tx.needsUpdate = true; return l.tx; })();
  const ajusta = (x, txt, peso, tam, max) => { x.font = peso + ' ' + tam + 'px Inter, sans-serif'; const w = x.measureText(txt).width; if (w > max) { tam = Math.floor(tam * max / w); x.font = peso + ' ' + tam + 'px Inter, sans-serif'; } return tam; };
  // Lights of the world (for the blackout of scene 6) and the floor grid.
  const LUCES = S.children.filter(o => o.isHemisphereLight || o.isDirectionalLight).map(l => [l, l.intensity]);
  const SUELO_REJ = S.children.find(o => o.type === 'GridHelper');
  function apagon(f) { LUCES.forEach(([l, i0]) => { l.intensity = i0 * f; }); if (SUELO_REJ) SUELO_REJ.visible = f > 0.5; }

  // ——— car: boxes, local front = −x (it drives right to left); wheels with 5-spoke hubcaps so the spin shows ———
  const coG = grupo(), coE = new T.Group(), coB = new T.Group(); coG.add(coE); coE.add(coB); coB.position.y = 0.62;
  const C_PINT = new T.Color(0xcfd6e1), C_VIEJO = new T.Color(0x5b6475);
  const mPint = mat(0xcfd6e1, { metalness: 0.6, roughness: 0.3 }), mVid = mat(0x0b1220, { metalness: 0.5, roughness: 0.12 });
  const mOsc = mat(0x1e293b, { roughness: 0.6 }), mFaro = mat(0xfff7dd, { emissive: 0xfff3c4, emissiveIntensity: 1.4 }), mPil = mat(0xef4444, { emissive: 0xef4444, emissiveIntensity: 1.0 });
  // body (hood and trunk edges slightly bevelled) and a tapered cabin towards the rear, with inclined windshield and rear window
  const afila = (geo, f) => { const a = geo.attributes.position; for (let i = 0; i < a.count; i++) if (a.getY(i) > 0) a.setX(i, f(a.getX(i))); a.needsUpdate = true; geo.computeVertexNormals(); return geo; };
  pieza(coB, afila(new T.BoxGeometry(4.2, 0.56, 1.8), x => x < 0 ? x + 0.09 : x - 0.06), mPint, 0, 0.02, 0);
  pieza(coB, afila(new T.BoxGeometry(2.3, 0.58, 1.6), x => x < 0 ? x + 0.35 : x - 0.2), mPint, 0.3, 0.59, 0);
  [-1, 1].forEach(sz => [-0.12, 0.78].forEach(cx => { const v = new T.Mesh(new T.PlaneGeometry(0.8, 0.33), mVid); v.position.set(cx, 0.6, sz * 0.801); v.rotation.y = sz > 0 ? 0 : PI; coB.add(v); }));
  const parab = new T.Mesh(new T.PlaneGeometry(1.42, 0.6), mVid); parab.position.set(-0.685, 0.59, 0); parab.rotation.order = 'ZYX'; parab.rotation.set(0, -PI / 2, -0.543); coB.add(parab);
  const luna = new T.Mesh(new T.PlaneGeometry(1.42, 0.52), mVid); luna.position.set(1.36, 0.59, 0); luna.rotation.order = 'ZYX'; luna.rotation.set(0, PI / 2, 0.332); coB.add(luna);
  caja(coB, 0.14, 0.2, 1.84, mOsc, -2.12, -0.17, 0); caja(coB, 0.14, 0.2, 1.84, mOsc, 2.12, -0.17, 0);   // bumpers
  [-1, 1].forEach(sz => { caja(coB, 0.05, 0.13, 0.42, mFaro, -2.11, 0.14, sz * 0.56); caja(coB, 0.05, 0.12, 0.38, mPil, 2.11, 0.15, sz * 0.58); });
  const halos = [-1, 1].map(sz => { const s = new T.Sprite(new T.SpriteMaterial({ map: haloTx, color: 0xfff1c2, blending: T.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.6 })); s.position.set(-2.2, 0.16, sz * 0.56); s.scale.setScalar(0.9); coB.add(s); return s; });
  // windshield sticker «$563/mo» (scene 7)
  const lpeg = lienzo(256, 128); lpeg.x.fillStyle = '#fde047'; lpeg.x.beginPath(); lpeg.x.roundRect(6, 6, 244, 116, 18); lpeg.x.fill();
  lpeg.x.fillStyle = '#111827'; lpeg.x.font = '900 64px Inter, sans-serif'; lpeg.x.textAlign = 'center'; lpeg.x.textBaseline = 'middle'; lpeg.x.fillText('$563/mo', 128, 68); lpeg.tx.needsUpdate = true;
  const peg = new T.Mesh(new T.PlaneGeometry(0.62, 0.31), basico(0xffffff, { map: lpeg.tx, transparent: true, side: T.DoubleSide })); coB.add(peg);
  // wheels: holder (flattens in y) → spinner (rotation.z) → tire + hubcap
  const lta = lienzo(256, 256); (() => { const x = lta.x; x.fillStyle = '#1f2937'; x.beginPath(); x.arc(128, 128, 126, 0, 2 * PI); x.fill();
    x.fillStyle = '#d1d5db'; x.beginPath(); x.arc(128, 128, 104, 0, 2 * PI); x.fill(); x.fillStyle = '#1f2937'; x.beginPath(); x.arc(128, 128, 90, 0, 2 * PI); x.fill();
    x.fillStyle = '#e5e7eb'; for (let j = 0; j < 5; j++) { x.save(); x.translate(128, 128); x.rotate(j * 2 * PI / 5); x.fillRect(-13, -96, 26, 96); x.restore(); }
    x.beginPath(); x.arc(128, 128, 30, 0, 2 * PI); x.fill(); x.fillStyle = '#9ca3af'; x.beginPath(); x.arc(128, 128, 12, 0, 2 * PI); x.fill(); lta.tx.needsUpdate = true; })();
  const mGoma = mat(0x111318, { roughness: 0.85 }), mTapa = mat(0xffffff, { map: lta.tx, metalness: 0.5, roughness: 0.35 });
  const geoR = new T.CylinderGeometry(0.38, 0.38, 0.24, 28), geoT = new T.CircleGeometry(0.31, 32);
  const ruedas = [[-1.35, 0.86], [-1.35, -0.86], [1.35, 0.86], [1.35, -0.86]].map(([x, z]) => {
    const h = new T.Group(); h.position.set(x, 0.38, z); coE.add(h); const g = new T.Group(); h.add(g);
    const ti = new T.Mesh(geoR, mGoma); ti.rotation.x = PI / 2; ti.castShadow = true; g.add(ti);
    const ta = new T.Mesh(geoT, mTapa); ta.position.z = z > 0 ? 0.121 : -0.121; if (z < 0) ta.rotation.y = PI; g.add(ta); return { h, g };
  });
  const _v = new T.Vector3();
  // o = { x, z, ry, esc, dist (m driven: wheel spin), cabeceo (+ = nose down), viejo 0..1, faros 0..1, aplasta 0..1, peg: { op, dy, rz, dx } }
  function coche(o) {
    coG.visible = true; coG.position.set(o.x || 0, 0, o.z || 0); coG.rotation.y = o.ry || 0; coE.scale.setScalar(o.esc || 1);
    const vj = o.viejo || 0, ap = o.aplasta || 0;
    coB.rotation.z = o.cabeceo || 0; coB.scale.y = 1 - 0.1 * ap; coB.position.y = 0.62 - 0.03 * ap;
    mPint.color.copy(C_PINT).lerp(C_VIEJO, vj); mPint.metalness = 0.6 - 0.45 * vj; mPint.roughness = 0.3 + 0.4 * vj;
    const fa = o.faros == null ? 1 : o.faros; mFaro.emissiveIntensity = 1.4 * fa; mPil.emissiveIntensity = 1.0 * fa; halos.forEach(h => { h.material.opacity = 0.6 * fa; });
    ruedas.forEach(w => { w.g.rotation.z = (o.dist || 0) / 0.38; w.h.scale.y = 1 - 0.1 * vj; w.h.position.y = 0.38 * (1 - 0.1 * vj); });
    const p = o.peg; peg.visible = !!p && (p.op == null || p.op > 0.01);
    if (p) { peg.position.set(-0.72 + (p.dx || 0), 0.62 + (p.dy || 0), 0.3); peg.rotation.order = 'ZYX'; peg.rotation.set(0, -PI / 2, -0.543 + (p.rz || 0)); peg.material.opacity = p.op == null ? 1 : p.op; }
    coG.updateMatrixWorld(true);
    _v.set(0.375, 0.88, 0); coB.localToWorld(_v); return { techo: [_v.x, _v.y, _v.z] };
  }

  // ——— price tag (classic shape: pointed left end with a hole), its pieces when it splits, the stamp and the string ———
  const TW = 1024, TH = 512, PUNTA = TH * 0.36, AGX = PUNTA * 0.55;
  function forma(x, w, h) { const p = h * 0.36, r = h * 0.12, m = 10; x.beginPath(); x.moveTo(p, m); x.lineTo(w - m - r, m); x.arcTo(w - m, m, w - m, m + r, r); x.lineTo(w - m, h - m - r); x.arcTo(w - m, h - m, w - m - r, h - m, r); x.lineTo(p, h - m); x.lineTo(m, h / 2); x.closePath(); }
  function agujero(x, h) { x.save(); x.globalCompositeOperation = 'destination-out'; x.beginPath(); x.arc(AGX, h / 2, h * 0.075, 0, 2 * PI); x.fill(); x.restore(); }
  const ROJO_T = [239, 68, 68], BLANCO_T = [248, 250, 252];
  function pintaTag(l, txt, rojo) {
    const x = l.x, w = TW, h = TH, mix = (a, b) => a.map((v, j) => Math.round(v + (b[j] - v) * rojo));
    x.clearRect(0, 0, w, h); forma(x, w, h); x.fillStyle = 'rgb(' + mix(BLANCO_T, ROJO_T).join(',') + ')'; x.fill();
    x.lineWidth = 14; x.strokeStyle = rojo > 0.5 ? '#fecaca' : '#94a3b8'; x.stroke();
    const tam = ajusta(x, txt, 900, h * 0.5, w - PUNTA - 70); x.fillStyle = rojo > 0.5 ? '#ffffff' : '#0f172a'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.fillText(txt, PUNTA + (w - PUNTA) / 2, h / 2 + tam * 0.04); agujero(x, h); l.tx.needsUpdate = true;
  }
  const lTag = lienzo(TW, TH), lPar = lienzo(TW, TH);
  // split canvas: lower 74% white «$35,000 / CAR PRICE», upper 26% red «$12,302 INTEREST» (heights ∝ dollars)
  (() => { const x = lPar.x, w = TW, h = TH, cut = h * (1 - 0.74);
    x.clearRect(0, 0, w, h); x.save(); forma(x, w, h); x.clip();
    x.fillStyle = '#ef4444'; x.fillRect(0, 0, w, cut); x.fillStyle = '#f8fafc'; x.fillRect(0, cut, w, h - cut); x.restore();
    forma(x, w, h); x.lineWidth = 14; x.strokeStyle = '#94a3b8'; x.stroke();
    x.textAlign = 'center'; x.textBaseline = 'middle'; const cx = PUNTA + (w - PUNTA) / 2;
    let t = ajusta(x, '$12,302 INTEREST', 900, cut * 0.62, w - PUNTA - 90); x.fillStyle = '#ffffff'; x.fillText('$12,302 INTEREST', cx, cut / 2 + t * 0.05);
    t = ajusta(x, '$35,000', 900, h * 0.36, w - PUNTA - 90); x.fillStyle = '#0f172a'; x.fillText('$35,000', cx, cut + (h - cut) * 0.44);
    ajusta(x, 'CAR PRICE', 800, h * 0.11, 600); x.fillStyle = '#475569'; x.fillText('CAR PRICE', cx, cut + (h - cut) * 0.8); agujero(x, h); lPar.tx.needsUpdate = true; })();
  const tagG = grupo();
  const mTag = basico(0xffffff, { map: lTag.tx, transparent: true, side: T.DoubleSide }), tagM = new T.Mesh(new T.PlaneGeometry(1, 1), mTag); tagG.add(tagM);
  const geoPieza = (v0, v1) => { const g = new T.PlaneGeometry(1, v1 - v0), uv = g.attributes.uv; uv.setY(0, v1); uv.setY(1, v1); uv.setY(2, v0); uv.setY(3, v0); uv.needsUpdate = true; return g; };
  const mPar = basico(0xffffff, { map: lPar.tx, transparent: true, side: T.DoubleSide });
  const pzArr = new T.Mesh(geoPieza(0.74, 1), mPar), pzAba = new T.Mesh(geoPieza(0, 0.74), mPar); tagG.add(pzArr); tagG.add(pzAba);
  const lSel = lienzo(512, 176); (() => { const x = lSel.x; x.strokeStyle = '#dc2626'; x.lineWidth = 14; x.beginPath(); x.roundRect(10, 10, 492, 156, 26); x.stroke();
    x.fillStyle = '#dc2626'; x.font = '900 92px Inter, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('TOTAL PAID', 256, 92); lSel.tx.needsUpdate = true; })();
  const sello = new T.Mesh(new T.PlaneGeometry(1, 0.344), basico(0xffffff, { map: lSel.tx, transparent: true, side: T.DoubleSide, depthTest: false })); sello.renderOrder = 5; tagG.add(sello);
  const hilo = new T.Mesh(new T.CylinderGeometry(0.014, 0.014, 1, 6), basico(0xcbd5e1)); hilo.visible = false; S.add(hilo); objs.push(hilo);
  const _a = new T.Vector3(), _b = new T.Vector3(), _up = new T.Vector3(0, 1, 0);
  // o = { x, y, z (centre), k (height in m; width 2k), rz (sway), txt, rojo 0..1, op, yaw (default: faces the camera),
  //       partido (null = one piece; 0..1 = split pieces, the seam opening), sello 0..1, techo: [x, y, z] (string to the roof) }
  function tag(o) {
    tagG.visible = true; const k = o.k, cam = W.cam.position;
    const yaw = o.yaw != null ? o.yaw : Math.atan2(cam.x - o.x, cam.z - o.z);
    tagG.position.set(o.x, o.y, o.z); tagG.rotation.set(0, yaw, o.rz || 0);
    const par = o.partido != null;
    tagM.visible = !par; pzArr.visible = pzAba.visible = par;
    if (!par) { tagM.scale.set(2 * k, k, 1); mTag.opacity = o.op == null ? 1 : o.op;
      const rq = Math.round((o.rojo || 0) * 8) / 8, clave = o.txt + '|' + rq; if (lTag.clave !== clave) { lTag.clave = clave; pintaTag(lTag, o.txt, rq); } }
    else { const g = o.partido * 0.22 * k; pzAba.scale.set(2 * k, k, 1); pzAba.position.set(0, -0.13 * k, 0); pzArr.scale.set(2 * k, k, 1); pzArr.position.set(0.04 * o.partido * k, 0.37 * k + g, 0.002); mPar.opacity = o.op == null ? 1 : o.op; }
    const se = o.sello || 0; sello.visible = se > 0.01; sello.material.opacity = Math.min(1, se * 1.4);
    sello.scale.setScalar(1.05 * k * (1 + 1.4 * (1 - sale(Math.min(1, se))))); sello.position.set(0.2 * k, 0.66 * k, 0.03); sello.rotation.z = -0.1 + 0.3 * (1 - sale(Math.min(1, se)));
    tagG.updateMatrixWorld(true); _a.set(-k + 2 * k * AGX / TW, 0, 0); tagG.localToWorld(_a);
    if (o.techo) { _b.set(o.techo[0], o.techo[1], o.techo[2]); const d = _a.clone().sub(_b), len = d.length(); hilo.visible = len > 0.05;
      hilo.position.copy(_b).addScaledVector(d, 0.5); hilo.scale.set(1, len, 1); hilo.quaternion.setFromUnitVectors(_up, d.normalize()); }
    return { agujero: [_a.x, _a.y, _a.z] };
  }

  // ——— «$563» payment tiles: sprites (hook) and instanced boxes (the wall of scene 1, white part + red interest part) ———
  const lBal = lienzo(256, 128); (() => { const x = lBal.x; x.fillStyle = '#f8fafc'; x.beginPath(); x.roundRect(6, 6, 244, 116, 18); x.fill(); x.strokeStyle = '#ef4444'; x.lineWidth = 10; x.stroke();
    x.fillStyle = '#0f172a'; x.font = '900 70px Inter, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('$563', 128, 68); lBal.tx.needsUpdate = true; })();
  const balP = Array.from({ length: 44 }, () => { const s = new T.Sprite(new T.SpriteMaterial({ map: lBal.tx, transparent: true, depthWrite: false })); s.visible = false; S.add(s); return s; }); balP.i = 0; pools.push(balP);
  function baldosa(o) { const s = balP[balP.i++]; if (!s) return; s.visible = true; s.position.set(o.x, o.y, o.z); s.scale.set(0.62 * o.esc, 0.31 * o.esc, 1); s.material.opacity = o.op == null ? 1 : o.op; s.material.rotation = o.rz || 0; }
  const NB = 84, mBl = mat(0xe2e8f0, { roughness: 0.5 }), mRo = mat(0xef4444, { emissive: 0xef4444, emissiveIntensity: 0.35, roughness: 0.45 });
  const insB = new T.InstancedMesh(geoU, mBl, NB), insR = new T.InstancedMesh(geoU, mRo, NB);
  [insB, insR].forEach(m => { m.castShadow = true; m.receiveShadow = true; m.visible = false; m.frustumCulled = false; S.add(m); objs.push(m); });
  const _m = new T.Matrix4(), _q = new T.Quaternion(), _e = new T.Euler(), _p = new T.Vector3(), _s = new T.Vector3();
  function pone(ins, i, d) { if (!d) { _m.makeScale(1e-4, 1e-4, 1e-4); _m.setPosition(0, -50, 0); ins.setMatrixAt(i, _m); return; }
    _e.set(d[6] || 0, d[7] || 0, d[8] || 0); _q.setFromEuler(_e); _p.set(d[0], d[1], d[2]); _s.set(Math.max(1e-4, d[3]), Math.max(1e-4, d[4]), Math.max(1e-4, d[5])); _m.compose(_p, _q, _s); ins.setMatrixAt(i, _m); }
  // f(i) → { b: [x, y, z, sx, sy, sz, rx, ry, rz] | null, r: same | null }
  function pared(f) { insB.visible = insR.visible = true; for (let i = 0; i < NB; i++) { const d = f(i) || {}; pone(insB, i, d.b); pone(insR, i, d.r); } insB.instanceMatrix.needsUpdate = insR.instanceMatrix.needsUpdate = true; }

  // ——— generic boxes (lit, with shadows) and glowing strips (unlit) ———
  const bloP = Array.from({ length: 30 }, () => { const m = new T.Mesh(geoU, mat(0xffffff, { transparent: true })); m.castShadow = true; m.receiveShadow = true; m.visible = false; S.add(m); return m; }); bloP.i = 0; pools.push(bloP);
  // o = { x, y, z, w, h, d, color, brillo, op, rx, ry, rz }
  function bloque(o) { const m = bloP[bloP.i++]; if (!m) return; m.visible = true; m.position.set(o.x, o.y, o.z); m.scale.set(Math.max(1e-4, o.w), Math.max(1e-4, o.h), Math.max(1e-4, o.d)); m.rotation.set(o.rx || 0, o.ry || 0, o.rz || 0);
    m.material.color.set(o.color || '#e2e8f0'); m.material.emissive.set(o.color || '#e2e8f0'); m.material.emissiveIntensity = o.brillo || 0; m.material.opacity = o.op == null ? 1 : o.op; m.material.depthWrite = m.material.opacity > 0.99; }
  const luzP = Array.from({ length: 150 }, () => { const m = new T.Mesh(geoU, basico(0xffffff, { transparent: true })); m.visible = false; S.add(m); return m; }); luzP.i = 0; pools.push(luzP);
  function brillo(o) { const m = luzP[luzP.i++]; if (!m) return; m.visible = true; m.position.set(o.x, o.y, o.z); m.scale.set(Math.max(1e-4, o.w), Math.max(1e-4, o.h), Math.max(1e-4, o.d)); m.rotation.set(o.rx || 0, o.ry || 0, o.rz || 0);
    m.material.color.set(o.color || '#ffffff'); m.material.opacity = o.op == null ? 1 : o.op; m.material.depthWrite = m.material.opacity > 0.99; m.material.blending = o.suma ? T.AdditiveBlending : T.NormalBlending; }
  const haloP = Array.from({ length: 6 }, () => { const s = new T.Sprite(new T.SpriteMaterial({ map: haloTx, blending: T.AdditiveBlending, depthWrite: false, transparent: true })); s.visible = false; S.add(s); return s; }); haloP.i = 0; pools.push(haloP);
  function halo(o) { const s = haloP[haloP.i++]; if (!s) return; s.visible = (o.op || 0) > 0.01; s.position.set(o.x, o.y, o.z); s.scale.setScalar(o.esc || 1); s.material.color.set(o.color || '#ffffff'); s.material.opacity = o.op || 0; }

  // ——— small dynamic labels (one canvas each, redrawn only when the text changes) ———
  const etqP = Array.from({ length: 8 }, () => { const l = lienzo(1024, 160), s = new T.Sprite(new T.SpriteMaterial({ map: l.tx, transparent: true, depthWrite: false })); s.visible = false; S.add(s); return { l, s, w: 1 }; }); etqP.i = 0;
  // o = { txt, x, y, z, alto (m), css (border/text colour), op, fondo }
  function letrero(o) { const e = etqP[etqP.i++]; if (!e) return; const clave = o.txt + '|' + (o.css || '') + '|' + (o.fondo || '');
    if (e.l.clave !== clave) { e.l.clave = clave; const x = e.l.x; x.clearRect(0, 0, 1024, 160); x.font = '900 92px Inter, sans-serif'; const w = Math.min(1004, Math.ceil(x.measureText(o.txt).width) + 90);
      x.fillStyle = o.fondo || 'rgba(9,14,27,.94)'; x.strokeStyle = o.css || '#e2e8f0'; x.lineWidth = 9; x.beginPath(); x.roundRect((1024 - w) / 2, 8, w, 144, 44); x.fill(); x.stroke();
      x.fillStyle = o.tinta || '#ffffff'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(o.txt, 512, 84); e.l.tx.needsUpdate = true; }
    const a = o.alto || 0.4; e.s.visible = (o.op == null ? 1 : o.op) > 0.01; e.s.position.set(o.x, o.y, o.z); e.s.scale.set(a * 1024 / 160, a, 1); e.s.material.opacity = o.op == null ? 1 : o.op; }

  // ——— Truth-in-Lending disclosure sheet (generic format, «EXAMPLE»): the four federal boxes in a row ———
  const HW = 6.4, HH = HW * 860 / 2048, CAJ = { x0: 40, bw: 492, y0: 170, bh: 560 };
  const lHoja = lienzo(2048, 860); (() => { const x = lHoja.x;
    x.fillStyle = '#f8fafc'; x.fillRect(0, 0, 2048, 860); x.strokeStyle = '#0f172a'; x.lineWidth = 8; x.strokeRect(14, 14, 2020, 832);
    x.fillStyle = '#0f172a'; x.font = '900 62px Inter, sans-serif'; x.textAlign = 'left'; x.textBaseline = 'alphabetic'; x.fillText('TRUTH-IN-LENDING DISCLOSURE', 56, 118);
    x.save(); x.translate(1772, 96); x.rotate(-0.05); x.strokeStyle = '#b45309'; x.lineWidth = 9; x.strokeRect(-190, -54, 380, 100); x.fillStyle = '#b45309'; x.font = '900 66px Inter, sans-serif'; x.textAlign = 'center'; x.fillText('EXAMPLE', 0, 24); x.restore();
    const C = [[['ANNUAL', 'PERCENTAGE RATE'], ['The cost of your credit', 'as a yearly rate.'], '9.00%', 1], [['FINANCE', 'CHARGE'], ['The dollar amount the', 'credit will cost you.'], '$12,302', 1],
      [['Amount', 'Financed'], ['The amount of credit', 'provided to you or on', 'your behalf.'], '$35,000', 0], [['Total of', 'Payments'], ['The amount you will', 'have paid when you have', 'made all scheduled', 'payments.'], '$47,302', 0]];
    C.forEach(([tit, des, val, fuerte], i) => { const bx = CAJ.x0 + i * CAJ.bw, cx = bx + CAJ.bw / 2;
      x.lineWidth = fuerte ? 13 : 5; x.strokeStyle = '#0f172a'; x.strokeRect(bx + 8, CAJ.y0, CAJ.bw - 16, CAJ.bh);
      x.fillStyle = '#0f172a'; x.textAlign = 'center'; x.textBaseline = 'alphabetic';
      tit.forEach((t, j) => { ajusta(x, t, fuerte ? 900 : 700, fuerte ? 50 : 46, CAJ.bw - 60); x.fillText(t, cx, CAJ.y0 + 70 + j * 56); });
      x.fillStyle = '#334155'; des.forEach((t, j) => { ajusta(x, t, 500, 31, CAJ.bw - 50); x.fillText(t, cx, CAJ.y0 + 205 + j * 40); });
      x.fillStyle = '#0f172a'; ajusta(x, val, fuerte ? 900 : 700, fuerte ? 118 : 92, CAJ.bw - 56); x.fillText(val, cx, CAJ.y0 + CAJ.bh - 52); });
    x.fillStyle = '#475569'; x.font = '600 30px Inter, sans-serif'; x.textAlign = 'left'; x.fillText('Example · $35,000 financed at 9% APR for 84 months · no down payment, taxes or fees · not a real lender’s form', 56, 808);
    lHoja.tx.needsUpdate = true; })();
  const hojaG = grupo(), hoja = new T.Mesh(new T.PlaneGeometry(HW, HH), basico(0xffffff, { map: lHoja.tx })); hoja.position.y = HH / 2; hojaG.add(hoja);
  const dorso = new T.Mesh(new T.BoxGeometry(HW + 0.06, HH + 0.06, 0.05), mat(0x334155)); dorso.position.set(0, HH / 2, -0.04); dorso.castShadow = true; hojaG.add(dorso);
  const cajaX = (i) => (CAJ.x0 + CAJ.bw * (i + 0.5)) / 2048 * HW - HW / 2, cajaY = HH - (CAJ.y0 + CAJ.bh / 2) / 860 * HH, cajaW = CAJ.bw / 2048 * HW, cajaH = CAJ.bh / 860 * HH;
  const velos = [0, 1, 2, 3].map(i => { const m = new T.Mesh(new T.PlaneGeometry(cajaW - 0.02, cajaH), basico(0x020617, { transparent: true, opacity: 0, depthWrite: false })); m.position.set(cajaX(i), cajaY, 0.012); hojaG.add(m); return m; });
  const lBarr = lienzo(256, 16); (() => { const g = lBarr.x.createLinearGradient(0, 0, 256, 0); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.5, 'rgba(255,255,255,1)'); g.addColorStop(1, 'rgba(255,255,255,0)'); lBarr.x.fillStyle = g; lBarr.x.fillRect(0, 0, 256, 16); lBarr.tx.needsUpdate = true; })();
  const barrido = new T.Mesh(new T.PlaneGeometry(1.1, HH * 0.98), basico(0xfff1c2, { map: lBarr.tx, transparent: true, blending: T.AdditiveBlending, depthWrite: false })); barrido.position.z = 0.02; hojaG.add(barrido);
  const mMarco = basico(0xf5b94a, { transparent: true }), marco = new T.Group(); hojaG.add(marco);
  [[0, 1, 1, 0], [0, -1, 1, 0], [1, 0, 0, 1], [-1, 0, 0, 1]].forEach(([sx, sy, hw, hh]) => { const b = new T.Mesh(geoU, mMarco); b.userData = { sx, sy, hw, hh }; marco.add(b); });
  const pulso = new T.Mesh(new T.PlaneGeometry(cajaW * 0.9, cajaH * 0.32), basico(0xf5b94a, { transparent: true, opacity: 0, blending: T.AdditiveBlending, depthWrite: false })); pulso.position.set(cajaX(3), cajaY - cajaH * 0.33, 0.03); hojaG.add(pulso);
  // o = { x, y, z, rx, ry, velos: [4 × 0..1], barrido: x (local, null = off), marco 0..1 (closing), pulso 0..1 }
  function hojaTIL(o) {
    hojaG.visible = true; hojaG.position.set(o.x || 0, o.y || 0, o.z || 0); hojaG.rotation.set(o.rx || 0, o.ry || 0, 0);
    velos.forEach((v, i) => { v.material.opacity = (o.velos && o.velos[i]) || 0; v.visible = v.material.opacity > 0.01; });
    barrido.visible = o.barrido != null; if (o.barrido != null) barrido.position.set(o.barrido, HH / 2, 0.02);
    const mc = o.marco || 0; marco.visible = mc > 0.01; mMarco.opacity = Math.min(1, mc * 2);
    const ex = 1 + 0.45 * (1 - rebote(Math.min(1, mc))), FW = cajaW + 0.1, FH = cajaH + 0.1;
    marco.position.set(cajaX(3), cajaY, 0.05); marco.children.forEach(b => { const u = b.userData; b.position.set(u.sx * FW / 2 * ex, u.sy * FH / 2 * ex, 0); b.scale.set(u.hw ? FW * ex + 0.07 : 0.07, u.hh ? FH * ex + 0.07 : 0.07, 0.04); });
    pulso.material.opacity = 0.55 * (o.pulso || 0); pulso.visible = (o.pulso || 0) > 0.01;
    return { caja: (i) => [o.x + cajaX(i), (o.y || 0) + cajaY, o.z], cajaW, cajaH, HW, HH };
  }

  // ——— the small amber box «TOTAL OF PAYMENTS $47,302» (scene 7) ———
  const lCaj = lienzo(512, 300); (() => { const x = lCaj.x; x.fillStyle = 'rgba(9,14,27,.96)'; x.beginPath(); x.roundRect(8, 8, 496, 284, 28); x.fill(); x.strokeStyle = '#f5b94a'; x.lineWidth = 14; x.stroke();
    x.fillStyle = '#f5b94a'; x.font = '800 44px Inter, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('Total of Payments', 256, 82);
    x.fillStyle = '#ffffff'; x.font = '900 104px Inter, sans-serif'; x.fillText('$47,302', 256, 190); lCaj.tx.needsUpdate = true; })();
  const cajita = new T.Mesh(new T.PlaneGeometry(1.4, 0.82), basico(0xffffff, { map: lCaj.tx, transparent: true, side: T.DoubleSide })); cajita.visible = false; S.add(cajita); objs.push(cajita);
  function cajaAmbar(o) { cajita.visible = (o.op == null ? 1 : o.op) > 0.01; cajita.position.set(o.x, o.y, o.z); cajita.scale.setScalar(o.esc || 1); cajita.material.opacity = o.op == null ? 1 : o.op;
    const cam = W.cam.position; cajita.rotation.set(0, Math.atan2(cam.x - o.x, cam.z - o.z), o.rz || 0); }

  function apagar() { objs.forEach(g => { g.visible = false; }); pools.forEach(a => { a.forEach(o => { (o.s || o).visible = false; }); a.i = 0; }); etqP.forEach(e => { e.s.visible = false; }); etqP.i = 0; apagon(1); }
  return { coche, tag, baldosa, pared, bloque, brillo, halo, letrero, hojaTIL, cajaAmbar, apagon, apagar };
})();
W3.X = X3;
`;

// 2D layer: 2–4 word labels in the lower-middle third, a small note at the bottom left, the month chip at the top left.
const nota = (txt) => `<div class="nota">${txt}</div>`;
const rt = (cls, html, top) => `<div class="rt ${cls}" data-t="translateX(-50%)"${top ? ` style="top:${top}px"` : ''}>${html}</div>`;
const ESCENAS = [
  // 0 · Hook (visual, works with the sound off): the car comes in already rolling with a white «$35,000» tag over it; it brakes,
  //     the tag swings forward and at 0.7 s it swells and turns red, months run 0 → 84 and «$563» tiles fly out of the car; the car
  //     shrinks and dims; at 84/84 the tag stops at «$47,302» and the TOTAL PAID stamp falls. Then the tag shows its own split:
  //     lower 74% white «$35,000 CAR PRICE», upper 26% red «$12,302 INTEREST», and the seam opens.
  { html: () => `<div class="mes"><small>MONTH</small><b>0</b><span>/84</span></div>
      ${rt('', '$35,000 CAR', 1385)}${rt('roja', '84 MONTHLY PAYMENTS', 1385)}${rt('roja', 'REALLY COSTS <span class="r">$47,302</span>', 1385)}
      <div class="nota" style="top:1500px">Example: $35,000 financed · 9% APR<br>no down payment, taxes or fees</div>`,
    anim: function (s, e, el) {
      const st = selloG(e), r = el.querySelectorAll('.rt'), mes = el.querySelector('.mes');
      ver(r[0], s, -1, 0.7); ver(r[1], s, 0.7, st - 0.05); ver(r[2], s, st);
      mes.querySelector('b').textContent = Math.floor(mesG(s)); mes.classList.toggle('roja', s > 0.7);
      mes.style.opacity = 1 - tramo(s, st + 0.9, st + 1.2);
      el.querySelector('.nota').style.opacity = 1;
    } },
  // 1 · 84 tiles rain into a wall of 7 columns × 12 (one column per year); each tile is $563: red = that month's interest
  //     (47% of the first tile, 0.7% of the last). Then the red parts fly out and stack in a red column: «$12,302».
  { html: () => `${rt('', '<span class="r">$563</span> × 84')}${rt('roja', 'INTEREST: <span class="r">$12,302</span>')}`,
    anim: function (s, e, el) { const M = e.seg[0].marcas, m1 = M[1] != null ? M[1] : 3.4, m2 = M[2] != null ? M[2] : 5.2, r = el.querySelectorAll('.rt');
      ver(r[0], s, -1, m1); ver(r[1], s, m2); } },
  // 2 · Two cost towers, same white $35,000 base: 84 months (red cap $12,302) and 60 months (turquoise, red cap $8,592). On {ding}
  //     the slice of the 84 tower above the 60 one breaks off, turns turquoise and floats: −$3,710.
  { html: () => `${rt('turq', '60 MONTHS: <span class="t">$43,592</span>')}${rt('turq g', '<span class="t">−$3,710</span>')}`,
    anim: function (s, e, el) { const M = e.seg[0].marcas, m0 = M[0] != null ? M[0] : 1.8, m1 = M[1] != null ? M[1] : 3.3, r = el.querySelectorAll('.rt');
      ver(r[0], s, m0 + 0.2, m1); ver(r[1], s, m1); } },
  // 3 · Dark parking lot, 44 mannequins in 4 rows of 11 next to their spots; 11 (one in four) turn red and a long red ribbon
  //     «84+ MONTHS» unrolls from each of them.
  { html: () => `${rt('roja g', '<span class="r">1 IN 4</span>')}${rt('roja', '1 IN 4: <span class="r">84+ MONTHS</span>')}
      ${nota('Edmunds, Q3 2026: 25.5% of financed new-vehicle<br>purchases · average term 70.5 months')}`,
    anim: function (s, e, el) { const M = e.seg[0].marcas, m0 = M[0] != null ? M[0] : 0.9, m1 = M[1] != null ? M[1] : 2.6, r = el.querySelectorAll('.rt');
      ver(r[0], s, m0 + 0.1, m1 + 0.1); ver(r[1], s, m1 + 0.1); ver(el.querySelector('.nota'), s, m0); } },
  // 4 · The price board: PER MONTH $727 (60 months); the digits roll down to $563 (84 months) and the mannequin cheers; behind
  //     the board the red «$47,302» tag rises: what the board doesn't show.
  { html: () => `${rt('', 'PER MONTH: $727', 1555)}${rt('roja p', '$727 → <span class="r">$563</span> A MONTH', 1555)}`,
    anim: function (s, e, el) { const M = e.seg[0].marcas, m0 = M[0] != null ? M[0] : 2.6, r = el.querySelectorAll('.rt');
      ver(r[0], s, -1, m0); ver(r[1], s, m0 + 0.1); } },
  // 5 · Time line: the car drives along YEAR 0…7; OWED (loan balance) vs WORTH (average depreciation). The road under it turns
  //     red while it owes more than it's worth; at month 44 they cross.
  { html: () => `<div class="ow"><small>MONTH <b class="m">0</b></small><div class="f r"><i>OWED</i><span class="o">$35,000</span></div><div class="f w"><i>WORTH</i><span class="v">$35,000</span></div></div>
      ${rt('', 'OWED <span class="r">vs.</span> WORTH')}${rt('roja p', 'OWE <span class="r">MORE</span> THAN IT’S WORTH')}${rt('roja p', 'UNDERWATER: <span class="r">44 MONTHS</span>')}
      ${nota('Example · average depreciation: Kelley Blue Book<br>via Experian · no down payment, taxes or fees')}`,
    anim: function (s, e, el) { const M = e.seg[0].marcas, m0 = M[0] != null ? M[0] : 3.3, m1 = M[1] != null ? M[1] : 5.6, r = el.querySelectorAll('.rt');
      const mes = Math.min(84, Math.floor(mesR(s, m1))); ver(r[0], s, -1, m0); ver(r[1], s, m0 + 0.05, m1 + 0.25); ver(r[2], s, m1 + 0.3);
      const ow = el.querySelector('.ow'); ow.style.opacity = 1; ow.querySelector('.m').textContent = mes;
      ow.querySelector('.o').textContent = dinero(SALDO[mes]); ow.querySelector('.v').textContent = dinero(VALOR[mes]);
      ver(el.querySelector('.nota'), s, 0.2); } },
  // 6 · Blackout: a huge generic disclosure sheet falls standing, «TRUTH-IN-LENDING DISCLOSURE · EXAMPLE»; the light runs over the
  //     four boxes, the two big ones dim and the amber frame closes on «Total of Payments $47,302».
  { html: () => `${rt('', 'TRUTH IN LENDING ACT')}${rt('amb', '<span class="a">TOTAL OF PAYMENTS</span>')}
      ${nota('Reg. Z, 12 CFR 1026.18(h) · consumer loans<br>up to $73,400 (2026)')}`,
    anim: function (s, e, el) { const M = e.seg[0].marcas, m0 = M[0] != null ? M[0] : 1.0, m3 = M[3] != null ? M[3] : 6.5, r = el.querySelectorAll('.rt');
      ver(r[0], s, m0, m3); ver(r[1], s, m3); ver(el.querySelector('.nota'), s, m0 + 0.6); } },
  // 7 · Close: the turquoise mannequin in front of the car; the «$563/mo» sticker falls off the windshield; the amber box comes
  //     back; on {pop} its figure rises and becomes the red tag over the car (the hook's frame, now «$47,302»). Hard cut.
  { html: () => `${rt('', 'LOOK PAST <span class="a">$563/MO</span>')}${rt('amb', 'READ <span class="a">THIS BOX</span>')}${rt('roja g', '<span class="r">$47,302</span>')}`,
    anim: function (s, e, el) { const M = e.seg[0].marcas, m0 = M[0] != null ? M[0] : 1.0, m1 = M[1] != null ? M[1] : 2.6, m2 = M[2] != null ? M[2] : 3.6, r = el.querySelectorAll('.rt');
      ver(r[0], s, m0 + 0.1, m1); ver(r[1], s, m1 + 0.05, m2); ver(r[2], s, m2 + 0.35); } }
];

// Month on the time line of scene 5: linear, month 44 (the crossing) lands 0.5 s after «for over three years».
const SCRIPT2 = `
const mesR = (s, m1) => Math.max(0, 44 * s / (m1 + 0.5));
`;

const TRES = function (t, k, s, e, W) {
  const X = W.X; X.apagar();
  const D = e.fin - e.ini, M = e.seg.flatMap(g => g.marcas);
  const mk = (j, def) => (M[j] != null ? M[j] : def);
  const q = (a, d) => sale(tramo(s, a, a + (d || 0.45)));
  const bote = (a, d) => rebote(tramo(s, a, a + (d || 0.35)));
  const cam = (C) => W.camara(C[0], C[1], C[2], C[3], C[4], C[5]);
  const fuera = { x: -60, z: -60, esc: 0 };
  const ROJ = '#f87171', TQ = '#5eead4', AMB = '#f5b94a', BLANCO = '#e2e8f0';
  let directo = () => fuera;

  if (k === 0) {
    // ——— the hook ———
    const st = selloG(e), mf = mesG(s), mes = Math.floor(mf);
    // car: already rolling on frame 0 (≈ 7 m/s), brakes onto its mark at 0.5 s
    const XS = 2.6, u = Math.min(1, s / 0.5), cx = XS * (1 - u) * (1 - u), dist = XS - cx + 1.2;
    const sb = s - 0.3, cab = sb > 0 ? 0.075 * Math.exp(-sb * 4.5) * Math.sin(Math.min(PI / 2, sb * 9) + Math.max(0, sb - 0.17) * 9) : 0;
    const viejo = sale(tramo(s, 1.3, 2.15)), esc = 1 - 0.22 * viejo;
    const C = X.coche({ x: cx, z: 0, esc, dist, cabeceo: cab, viejo, faros: 1 - 0.75 * viejo, aplasta: viejo });
    // tag: swings like a damped pendulum (forward on the brake), swells ×1.35 at 0.7 s and grows with the months; red from 0.7 s
    const tb = Math.max(0, s - 0.3), th = s < 0.3 ? 0.16 : Math.exp(-1.8 * tb) * (0.16 * Math.cos(5.5 * tb) - 0.62 * Math.sin(5.5 * tb));
    const pop = rebote(tramo(s, 0.7, 0.95)), golpe = s > st ? Math.exp(-(s - st) * 7) * Math.sin((s - st) * 26) : 0;
    const kk = 0.95 * (1 + 0.35 * pop + 0.85 * Math.max(0, mf - 3) / 81) * (1 + 0.06 * golpe);
    const ty = C.techo[1] + 0.42 + kk * 0.5, tx = C.techo[0] + Math.sin(th) * (0.6 + kk * 0.5);
    // camera: low travelling alongside → sweep around the nose → crane up and orbit → pull back → 5% push on the stamp → crane back;
    // it looks between the car and the tag so both stay in frame
    const P = ruta([[0, [1.0, 0.8, 8.9, 0.6, 1.45, 0]], [0.5, [-0.6, 1.0, 8.4, 0.1, 1.55, 0]], [0.78, [-3.3, 1.55, 7.8, 0.1, 1.75, 0]],
      [1.05, [-4.7, 2.35, 7.4, 0, 1.95, 0]], [1.5, [-7.3, 3.0, 5.7, 0, 2.05, 0]], [2.0, [-8.4, 3.3, 7.5, 0, 2.1, 0]], [st, [-7.7, 3.3, 8.2, 0, 2.15, 0]],
      [st + 0.25, [-7.3, 3.25, 7.8, 0, 2.2, 0]], [st + 1.3, [-5.1, 3.5, 10.5, 0, 2.35, 0]], [D + 0.6, [-2.4, 4.3, 8.0, 0, 3.0, 0]]], s);
    const sh = s > 0.7 ? 0.06 * Math.exp(-(s - 0.7) * 10) : 0, mira = 0.45;
    cam([P[0] + sh * Math.sin(s * 83), P[1] + sh * Math.cos(s * 71), P[2], P[3] + (tx + 0.4 * kk - P[3]) * mira, P[4], P[5]]);
    const par = s > st + 0.75 ? sale(tramo(s, st + 1.15, st + 1.6)) : null;
    X.tag({ x: tx, y: ty - Math.abs(th) * 0.12, z: 0, k: kk, rz: -th * 0.55, txt: dinero(ETQ[mes]), rojo: tramo(s, 0.7, 0.82), techo: C.techo,
      sello: tramo(s, st - 0.12, st + 0.08) * (1 - tramo(s, st + 0.6, st + 0.75)), partido: par });
    if (s > st + 0.6 && s < st + 0.8) X.halo({ x: tx, y: ty, z: 0.1, esc: 5 * kk, op: 0.5 * Math.sin(PI * tramo(s, st + 0.6, st + 0.8)), color: '#ffffff' });
    // lane dashes and a kerb: the ground reference that shows the speed (they stay put while the camera travels)
    for (let j = -9; j <= 9; j++) X.brillo({ x: j * 1.7, y: 0.006, z: 1.75, w: 0.85, h: 0.01, d: 0.13, color: '#94a3b8', op: 0.55 });
    X.brillo({ x: 0, y: 0.006, z: -1.6, w: 34, h: 0.01, d: 0.09, color: '#64748b', op: 0.5 });
    // «$563» tiles: one per month from month 3, fanned out sideways and up (deterministic, no physics), each lives 0.75 s
    for (let j = 3; j <= 84; j += (j < 4 ? 1 : 2)) {
      const sj = pl(j, [[3, 0.7], [18, 1.0], [40, 1.5], [63, 2.0], [84, 2.5]]), d = s - sj;
      if (d < 0 || d > 0.7) continue;
      const lado = j === 3 ? -1 : (j / 2) % 2 ? 1 : -1, a = lado * (1.0 + 0.45 * ((j * 0.618) % 1)), v = 5.4 + 1.8 * ((j * 0.37) % 1);
      const ox = C.techo[0] + lado * 0.9 * esc, oy = C.techo[1] - 0.5 * esc;
      X.baldosa({ x: ox + Math.sin(a) * v * d, y: oy + Math.cos(a) * v * d - 3.2 * d * d, z: 0.95 + (1.4 + 2.4 * ((j * 0.29) % 1)) * d, esc: (j === 3 ? 1.3 : 1.0) * (0.55 + 0.45 * tramo(d, 0, 0.12)), rz: -a * 0.4 + d * 2.5 * lado, op: 1 - tramo(d, 0.5, 0.7) });
    }
  } else if (k === 1) {
    // ——— the wall: 84 tiles (7 columns × 12, one column per year) rain in; red = that month's interest; then the red parts fly
    //     out into a red column and the counter climbs to $12,302 ———
    const m0 = mk(0, 1.47), m1 = mk(1, 2.93), m2 = mk(2, 4.41);
    const TW_ = 0.56, TH_ = 0.3, TD_ = 0.14, PX = 0.64, PY = 0.33, X0 = -2.75, CXr = X0 + 6 * PX + TW_ / 2 + 0.3 + 0.5, CW = 1.0;
    const slab = (j) => TW_ * TH_ * FRAC[j] / CW;
    let base = 0, llegadas = 0; const bases = []; for (let j = 0; j < 84; j++) { bases.push(base); base += slab(j); }
    X.pared((j) => {
      const c = Math.floor(j / 12), r = j % 12, x = X0 + c * PX, y = 0.17 + r * PY, f = FRAC[j];
      const sj = -0.18 + 1.45 * j / 83, uf = tramo(s, sj, sj + 0.3), caida = 3.6 * (1 - uf * uf), bo = uf >= 1 ? 0.05 * Math.exp(-(s - sj - 0.3) * 14) * Math.sin((s - sj - 0.3) * 30) : 0;
      if (s < sj) return {};
      const yy = y + caida + bo, rx = 0.5 * (1 - uf), hw = TH_ * (1 - f), hr = TH_ * f;
      const b = [x, yy - TH_ / 2 + hw / 2, 0, TW_, hw, TD_, rx, 0, 0];
      const fj = m1 + 0.1 + 1.25 * Math.pow(j / 83, 0.85), uv = sale(tramo(s, fj, fj + 0.5));
      if (uv >= 1) llegadas++;
      const y0 = yy + TH_ / 2 - hr / 2, y1 = bases[j] + slab(j) / 2, xr_ = x + (CXr - x) * uv, yr_ = y0 + (y1 - y0) * uv + 1.1 * Math.sin(PI * uv);
      return { b, r: [xr_, yr_, 0.03 * Math.sin(PI * uv), TW_ + (CW - TW_) * uv, hr + (slab(j) - hr) * uv, TD_, rx, 0, 0.6 * Math.sin(PI * uv)] };
    });
    for (let c = 0; c < 7; c++) { const done = -0.18 + 1.45 * (c * 12 + 11) / 83 + 0.3; W.rotulo('yr' + c, 'YEAR ' + (c + 1), X0 + c * PX, 0.1, 0.6, Math.min(1, 1.3 * bote(done, 0.3)), '#94a3b8', 0.19); }
    const tope = bases[Math.max(0, llegadas - 1)] + (llegadas ? slab(llegadas - 1) : 0);
    if (s > m1) X.letrero({ txt: dinero(INTAC[llegadas]), x: CXr, y: tope + 0.42, z: 0.2, alto: 0.4, css: ROJ, op: q(m1, 0.3) });
    if (s > m1) W.rotulo('int', 'INTEREST', CXr, tope + 0.9, 0.2, q(m1 + 0.3, 0.3), ROJ, 0.26);
    cam(ruta([[0, [-3.7, 1.75, 5.8, -2.25, 1.5, 0]], [1.5, [-1.0, 2.25, 8.4, -0.6, 1.9, 0]], [m1, [0.5, 2.6, 10.7, 0.0, 2.0, 0]],
      [m2, [0.7, 3.0, 12.3, 0.0, 2.05, 0]], [D + 0.5, [-0.1, 3.4, 12.9, -0.05, 2.15, 0]]], s));
  } else if (k === 2) {
    // ——— two cost towers, same white $35,000 base: 84 months (red cap $12,302) vs 60 months (red cap $8,592, turquoise edges).
    //     On {ding} the slice of the 84 tower above the 60 one breaks off, turns turquoise and floats: −$3,710 ———
    const m0 = mk(0, 1.9), m1 = mk(1, 3.05);
    const E = 3.6 / 47302, HB = 35000 * E, H84 = 47302 * E, H60 = 43592 * E, TA = 1.3, XA = -1.0, XB = 1.0;
    X.bloque({ x: XA, y: HB / 2, z: 0, w: TA, h: HB, d: TA, color: '#e2e8f0' });
    const corte = sale(tramo(s, m1, m1 + 0.6)), lo = H60;
    X.bloque({ x: XA, y: (HB + lo) / 2, z: 0, w: TA, h: lo - HB, d: TA, color: '#ef4444', brillo: 0.3 });
    const sl = H84 - H60, sx = XA + 1.0 * corte, sy = H60 + sl / 2 - 1.15 * corte + 0.05 * Math.sin(s * 3) * corte, sz = 1.5 * corte;
    X.bloque({ x: sx, y: sy, z: sz, w: TA, h: sl, d: TA, color: corte > 0.5 ? '#2dd4bf' : '#ef4444', brillo: 0.3 + 0.5 * corte, ry: 0.5 * corte, rz: -0.12 * corte });
    if (corte > 0.02) X.halo({ x: sx, y: sy, z: sz + 0.3, esc: 2.4, op: 0.45 * corte, color: TQ });
    // 60-month tower rises from its glowing footprint on «over 60 months»
    const g = sale(tramo(s, m0, m0 + 0.9)), H = H60 * g, hw = Math.min(H, HB), hr = Math.max(0, H - HB);
    if (hw > 0.01) X.bloque({ x: XB, y: hw / 2, z: 0, w: TA, h: hw, d: TA, color: '#e2e8f0' });
    if (hr > 0.005) X.bloque({ x: XB, y: HB + hr / 2, z: 0, w: TA, h: hr, d: TA, color: '#ef4444', brillo: 0.3 });
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => { X.brillo({ x: XB + a * TA / 2, y: 0.008, z: b * TA / 2, w: a ? 0.06 : TA, h: 0.012, d: 0.06, color: TQ, op: 0.9 });
      if (H > 0.02) X.brillo({ x: XB + a * (TA / 2 + 0.02), y: H / 2, z: b * (TA / 2 + 0.02), w: 0.045, h: H, d: 0.045, color: TQ, op: 0.95 }); });
    [-1, 1].forEach(a => { X.brillo({ x: XB, y: 0.008, z: a * TA / 2, w: TA, h: 0.012, d: 0.06, color: TQ, op: 0.9 }); if (H > 0.02) X.brillo({ x: XB, y: H + 0.02, z: a * (TA / 2 + 0.02), w: TA + 0.08, h: 0.045, d: 0.045, color: TQ, op: 0.95 }); });
    W.rotulo('m84', '84 MONTHS', XA, 1.3, TA / 2 + 0.3, 1, BLANCO, 0.26);
    W.rotulo('m60', '60 MONTHS', XB, 1.3, TA / 2 + 0.3, Math.min(1, 1.3 * bote(m0 + 0.3, 0.3)), TQ, 0.26);
    X.letrero({ txt: '$47,302', x: XA, y: H84 + 0.42, z: 0, alto: 0.4, css: ROJ });
    if (g > 0.6) X.letrero({ txt: '$43,592', x: XB, y: H + 0.42, z: 0, alto: 0.4, css: TQ, op: tramo(g, 0.6, 1) });
    cam(ruta([[0, [-1.1, 2.3, 9.4, -0.3, 2.15, 0]], [m0, [0.2, 2.35, 9.9, 0, 2.2, 0]], [m1, orbita([0.2, 2.5, 10.1, 0, 2.25, 0], -0.15)], [D + 0.5, orbita([0.2, 2.6, 9.6, 0.1, 2.35, 0], -0.55)]], s));
  } else if (k === 3) {
    // ——— parking lot: 44 mannequins walk to 4 rows of 11 spots; 11 (one in four) turn red; red ribbons «84+ MONTHS» unroll ———
    const m0 = mk(0, 1.11), m1 = mk(1, 2.73), PXp = 0.74, RZ = (r) => 1.0 - r * 1.7;
    const ROJOS = [1, 5, 9, 14, 18, 22, 26, 30, 35, 39, 43];   // one in four, spread over the rows
    const esRojo = (i) => ROJOS.indexOf(i);
    for (let r = 0; r < 4; r++) { for (let c = 0; c <= 11; c++) X.brillo({ x: (c - 5.5) * PXp, y: 0.007, z: RZ(r) - 0.45, w: 0.05, h: 0.012, d: 1.3, color: '#cbd5e1', op: 0.5 });
      X.brillo({ x: 0, y: 0.007, z: RZ(r) - 1.1, w: 12 * PXp, h: 0.012, d: 0.05, color: '#cbd5e1', op: 0.5 }); }
    directo = (i) => {
      if (i >= 44) return fuera;
      const r = Math.floor(i / 11), c = i % 11, x1 = (c - 5) * PXp, z1 = RZ(r) + 0.15;
      const az = (n) => ((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1;
      const x0 = x1 + (az(1) - 0.5) * 1.8, z0 = z1 + 0.6 + az(2) * 0.9, t1 = 0.75 + 0.45 * az(3), u = sale(tramo(s, -0.2, t1));
      const jr = esRojo(i), rq = jr >= 0 ? q(m0 + 0.04 * jr, 0.3) : 0;
      return { x: x0 + (x1 - x0) * u, z: z0 + (z1 - z0) * u, rot: u < 0.97 ? Math.atan2(x1 - x0, z1 - z0) : 0, amp: u < 0.97 ? 1 : 0, fase: s * 9, color2: '#ef4444', c2q: rq, brillo: 0.3, color: '#f8fafc', cq: 0.3 * (1 - rq) };
    };
    ROJOS.forEach((i, jr) => { const r = Math.floor(i / 11), c = i % 11, Lc = 6.6 * sale(tramo(s, m1 + 0.05 * jr, m1 + 0.9 + 0.05 * jr)); if (Lc < 0.02) return;
      const z0 = RZ(r) + 0.45; X.brillo({ x: (c - 5) * PXp + 0.3, y: 0.016, z: z0 + Lc / 2, w: 0.2, h: 0.014, d: Lc, color: '#ef4444', op: 0.95 });
      if (jr === 1) X.letrero({ txt: '84+ MONTHS', x: (c - 5) * PXp + 0.3, y: 0.35, z: z0 + Lc + 0.25, alto: 0.5, css: ROJ, op: tramo(Lc, 2, 4) }); });
    cam(ruta([[0, [-4.3, 1.45, 4.9, -1.2, 0.95, -1.3]], [m0, [-1.4, 4.4, 8.9, 0, 0.4, -1.4]], [m1, [-0.2, 9.2, 9.4, 0, 0, -0.7]], [D + 0.5, [0.2, 14.5, 7.4, 0, 0, 0.2]]], s));
  } else if (k === 4) {
    // ——— the price board: PER MONTH $727 → the digits roll down to $563; the mannequin cheers; the red «$47,302» tag rises behind ———
    const m0 = mk(0, 2.71);
    const v = Math.round(727 - (727 - 563) * sale(tramo(s, m0, m0 + 0.75)));
    W.cartel({ x: 0, z: 0, titulo: 'PER MONTH', precio: '$' + v, color: v < 727 ? '#ffffff' : '#ffffff' });
    const viva = q(m0 + 0.55, 0.3);
    W.heroe({ x: 0.85, z: 2.0, gira: PI + 0.35, luz: 0, brazos: viva * (0.85 + 0.15 * Math.sin(s * 9)), amp: 0 });
    const ct = cam;   // camera first (the tag faces it)
    ct(ruta([[0, [0.7, 2.0, 11.6, 0, 3.0, 0]], [m0, [0.3, 2.35, 10.2, 0, 3.15, 0]], [D + 0.5, orbita([0.3, 2.9, 10.8, 0, 3.45, -0.6], -0.75)]], s));
    const sube = sale(tramo(s, m0 + 0.05, m0 + 1.25)), kk = 0.75 + 0.7 * sube;
    if (s > m0 + 0.05) X.tag({ x: -0.15, y: 2.6 + 2.35 * sube, z: -1.4, k: kk, txt: '$47,302', rojo: 1 });
  } else if (k === 5) {
    // ——— time line: the car drives YEAR 0 → 4+; OWED (loan balance) vs WORTH (average depreciation) bars ride behind it; the road
    //     under it turns red while it owes more than it's worth; at month 44 they cross ———
    const m0 = mk(0, 3.63), m1 = mk(1, 4.99), Y = 2.6 / 12, mf = Math.min(84, mesR(s, m1)), mes = Math.floor(mf), xc = mf * Y;
    X.coche({ x: xc, z: 0, ry: PI, dist: xc, esc: 0.78 });
    X.bloque({ x: 8.5, y: 0.006, z: 0, w: 23, h: 0.012, d: 2.5, color: '#1e293b' });
    for (let n = 0; n <= 7; n++) { X.brillo({ x: n * 12 * Y, y: 0.016, z: 0, w: 0.06, h: 0.01, d: 2.5, color: '#94a3b8', op: 0.7 }); W.rotulo('yr' + n, 'YEAR ' + n, n * 12 * Y, 0.12, 1.75, 1, '#94a3b8', 0.24); }
    const vis = q(m0 - 0.1, 0.4), hasta = Math.min(mf, 44);
    if (vis > 0.01 && hasta > 1) X.brillo({ x: (Y + hasta * Y) / 2, y: 0.02, z: 0, w: (hasta - 1) * Y, h: 0.012, d: 2.1, color: '#ef4444', op: 0.6 * vis });
    if (vis > 0.01) W.rotulo('uw', 'UNDERWATER', Math.max(Y * 3, Math.min(hasta * Y, xc) - 0.75), 0.14, 1.3, vis, ROJ, 0.3);
    const SC = 2.3 / 35000, xb = xc + 1.55, hO = SALDO[mes] * SC, hV = VALOR[mes] * SC;
    X.bloque({ x: xb - 0.32, y: hO / 2, z: -1.85, w: 0.5, h: hO, d: 0.5, color: '#ef4444', brillo: 0.35 });
    X.bloque({ x: xb + 0.32, y: hV / 2, z: -1.85, w: 0.5, h: hV, d: 0.5, color: '#e2e8f0' });
    W.rotulo('o', 'OWED', xb - 0.32, hO + 0.25, -1.85, 1, ROJ, 0.22); W.rotulo('w', 'WORTH', xb + 0.32, hV + 0.25, -1.85, 1, BLANCO, 0.22);
    if (mf >= 44) { const x44 = 44 * Y, p44 = bote(44 * (m1 + 0.5) / 44 - 0.0, 0.3);
      X.brillo({ x: x44, y: 0.02, z: 0, w: 0.09, h: 0.014, d: 2.5, color: '#ffffff', op: 1 }); X.letrero({ txt: '44 MONTHS', x: x44, y: 0.75, z: 1.15, alto: 0.42, css: ROJ, op: Math.min(1, p44 * 1.3) }); }
    const xf = xc + (44 * Y + 0.4 - xc) * sale(tramo(s, m1 + 0.2, D));
    cam(ruta([[0, [xf - 1.0, 3.9, 8.6, xf + 0.6, 0.75, -0.5]], [m0, [xf - 0.3, 5.0, 9.0, xf + 0.8, 0.55, -0.6]], [m1, [xf + 0.3, 6.0, 9.4, xf + 0.8, 0.45, -0.7]], [D + 0.5, [xf - 0.4, 6.4, 9.9, xf + 0.2, 0.45, -0.7]]], s));
  } else if (k === 6) {
    // ——— blackout; a huge generic disclosure sheet falls standing; light runs over the four boxes; the amber frame closes on
    //     «Total of Payments» ———
    const m0 = mk(0, 1.41), m1 = mk(1, 2.67), m2 = mk(2, 5.53), m3 = mk(3, 6.91);
    X.apagon(0.22); W.niebla(8, 24);
    const uc = tramo(s, -0.1, 0.5), yc = 5.5 * (1 - uc * uc), bo = uc >= 1 ? 0.06 * Math.exp(-(s - 0.5) * 9) * Math.sin((s - 0.5) * 24) : 0;
    const bx = -3.7 + 7.4 * sale(tramo(s, m1 - 0.1, m2 + 0.4)), CX = [-2.31, -0.77, 0.77, 2.31];
    const velo = (i, a) => a * tramo(bx, CX[i] + 0.6, CX[i] + 1.2);
    const pulso = Math.sin(PI * tramo(s, m3 + 0.15, m3 + 0.75));
    const Hh = X.hojaTIL({ x: 0, y: yc + bo, z: 0, rx: -0.3 * (1 - uc), velos: [velo(0, 0.6), velo(1, 0.6), velo(2, 0.4), 0], barrido: s > m1 - 0.1 && s < m2 + 0.4 ? bx : null, marco: q(m3 - 0.06, 0.4), pulso });
    X.halo({ x: 0, y: 1.4, z: -0.6, esc: 11, op: 0.35, color: '#fff1c2' });
    X.brillo({ x: 0, y: 0.004, z: 0.9, w: 7.2, h: 0.01, d: 1.6, color: '#fff1c2', op: 0.12 });
    const cy = 1.25;
    cam(ruta([[0, [-1.1, 5.4, 8.6, -0.7, 3.4, 0]], [0.55, [-1.3, 3.0, 7.7, -0.9, 1.9, 0]], [m0, [-1.7, 2.1, 6.9, -1.4, cy, 0]], [m1, [-2.31, 1.65, 6.0, -2.31, cy, 0]],
      [m2, [2.31, 1.65, 6.0, 2.31, cy, 0]], [m3, [2.31, 1.6, 5.35, 2.31, cy, 0]], [D + 0.5, [2.25, 1.58, 5.05, 2.29, cy, 0]]], s));
  } else {
    // ——— close: the turquoise mannequin in front of the car; the «$563/mo» sticker falls; the amber box comes back; on {pop} its
    //     figure rises and becomes the red tag over the car; low travelling like frame 0 ———
    const m0 = mk(0, 1.63), m1 = mk(1, 3.27), m2 = mk(2, 4.63);
    const fall = tramo(s, m0 + 0.1, m0 + 0.95);
    const Cc = X.coche({ x: 0, z: 0, dist: 0.6, peg: { op: 1 - tramo(fall, 0.55, 1), dy: -0.9 * fall * fall, dx: -0.5 * fall, rz: 1.6 * fall } });
    W.heroe({ x: -1.15, z: 2.0, gira: 0.5, luz: q(0, 0.7), brazos: 0 });
    cam(ruta([[0, [-4.0, 1.9, 5.8, -1.0, 1.35, 1.0]], [m0, [-2.6, 2.1, 4.9, -0.6, 1.3, 0.3]], [m1, [0.2, 2.3, 7.4, 0.6, 1.6, 0.3]], [m2, [2.5, 1.25, 8.4, 1.1, 1.75, 0]], [D, [0.3, 0.8, 9.1, 0.35, 1.55, 0]]], s));
    const BX = 1.15, BY = 2.0, BZ = 1.2, ab = bote(m1, 0.35) * (1 - tramo(s, m2 + 0.2, m2 + 0.6));
    if (ab > 0.01) X.cajaAmbar({ x: BX, y: BY, z: BZ, esc: 0.2 + 0.8 * ab, op: Math.min(1, ab * 1.5) });
    if (s > m2) { const u = sale(tramo(s, m2, m2 + 0.85)), kk = 0.22 + (1.35 - 0.22) * u;
      const T1 = [Cc.techo[0], Cc.techo[1] + 0.42 + kk / 2, 0], P0 = [BX, BY, BZ], Pm = mezcla(P0, T1, u);
      X.tag({ x: Pm[0], y: Pm[1] + 0.6 * Math.sin(PI * u), z: Pm[2], k: kk, txt: '$47,302', rojo: 1, techo: u > 0.85 ? Cc.techo : null, rz: 0.09 * Math.sin((s - m2) * 3.2) * u }); }
  }

  W.multitud(t, { directo });
};

const pildoras = {
  'en-car-84-months': pildora3d({
    slug: 'en-car-84-months', cuenta: 'en',
    T: { en: { titulo: 'That $35,000 car really costs $47,302', guion: GUION } },
    // Narrator voice of reto-en.js / extenso-en.js, slower than theirs (default tempo 1.17), as the US study asks (≈ 2.6–3 words/s):
    // tempo 1.05 and pauses up to 0.4 s. With the script's 1.0, ritmo.py measured 2.51 words/s (it counts «$47,302» as one word),
    // under the 2.6–3.2 target; 1.05 brings it into range (≈ 3.0 spoken words/s).
    voz: { ...VOZ_NARRADOR, en: { ...VOZ_NARRADOR.en, tempo: 1.05, pausaMax: 0.4 } },
    fijo: () => `<div class="hud i fmt">MONEY, EXPLAINED</div><div class="hud d"><i></i><span id="reloj">00:00</span></div>`,
    cssExtra: CSS, scriptExtra: SCRIPT + SCRIPT2,
    escenas: ESCENAS, tres: TRES,
    // Short tail after «$47,302» so the loop goes back to the hook soon; the 2D layer leaves on the same frame as the hard cut.
    cola: 0.8, corte2d: 'seco',
    texto: { en: TEXTO }
  })
};

module.exports = { pildoras };
