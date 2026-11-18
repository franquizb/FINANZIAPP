// «Money, explained» · debunks for @finanziapp (US), in 3D (reels-voz/tres.js) with the narrator voice (VOZ_NARRADOR.en).
//
// en-debunk-psychology · «Are stock prices just psychology? Half true.» A viral Reel uses a movie clip where a character says
// share prices aren't based on how a company works but on mass psychology. Half true: in the short run mood moves prices; in the
// long run, profits (and dividends) do. We correct the idea, not anyone: no account name and no footage from the film on screen,
// only the quote in a card. Planned as a sequential Remix (owner adds it after the original clip; see the script's note).
// Final, verified script: guiones/2026-11-desmentido-psicologia-en.md (scenes, on-screen labels, cuadra(), sources, post, cover).
//
// Sources (as given in the script, checked 14 Nov 2026):
// - Limitless (2011), subtitle transcript (checked 14 Nov 2026): «Share prices aren't really based on how a company works. It's
//   about how mass psychology works.»; «Well, from 12,000 to–»; «At the end of the week… over two million dollars».
//   https://www.springfieldspringfield.co.uk/movie_script.php?movie=limitless
// - AP via PBS NewsHour (18 Aug 2020): S&P 500 record close 3,389.78 vs 3,386.15 on Feb 19; «nearly 34% plunge… from Feb. 19
//   through March 23». https://www.pbs.org/newshour/economy/sp-500-closes-at-a-record-erasing-last-of-pandemic-losses
// - S&P 500 daily closes 19 Feb – 18 Aug 2020 for the chart of scene 1: FRED, series SP500 (S&P Dow Jones Indices LLC),
//   downloaded 14 Nov 2026 (https://fred.stlouisfed.org/series/SP500). Every other trading day (65 of 127), keeping Feb 19,
//   Mar 23 and Aug 18. They match AP: 3,386.15 · 2,237.40 · 3,389.78. Zero-based axis (heights ∝ index level).
// - Robert Shiller, U.S. stock market data (ie_data.xls, downloaded 5 Oct 2026): EPS 1.24 (Dec 1926) and 240.634 (Dec 2025);
//   price 13.49 and 6,853.03; dividends reinvested monthly. https://shillerdata.com/
//   Decomposition 1926–2025 (script, decomp.py): 10.41%/yr = 5.47 EPS growth + 3.62 dividends + 0.98 P/E; in logs ≈ 90.2%.
// - Warren Buffett, 1993 Berkshire Hathaway shareholder letter (dated 1 Mar 1994): «As Ben Graham said: "In the short-run, the
//   market is a voting machine… but in the long-run, the market is a weighing machine."»
//   https://www.berkshirehathaway.com/letters/1993.html · Quote Investigator (9 Jan 2020) on the attribution.
//
// Compared with the script, only § marks were added (they are not read and don't change the voice takes): line 1 «§*nearly»,
// «§fear» and «§S&P» (v3: the plunge hits the floor on «fear», «−34%» on «S&P 500 down»), line 3 «§*190-fold*» and
// «§*nine-tenths*», line 4 «§into». Educational only: no product, broker or brand on screen.
// On screen «≈ ×190» (the voice says «about 190-fold»; the exact ratio is ×194.1).
// The bars of the 2020 chart are the real closes; the trembling lines of scenes 0 and 6 are illustrative (no axis, no data).
const { pildora3d } = require('./tres');
const { cuadra } = require('../reels/_comun');

// ——— all the checks in the script ———
const R1 = x => Math.round(x * 10) / 10, R2 = x => Math.round(x * 100) / 100;
const dias = (a, b) => Math.round((new Date(b) - new Date(a)) / 864e5);
const MAX = 3386.15, SUELO = 2237.40, REC = 3389.78;
cuadra('caída 2020 %', R2((SUELO / MAX - 1) * 100), -33.92);         // «nearly 34%»
cuadra('casi 34', Math.round(-(SUELO / MAX - 1) * 100), 34);
cuadra('días de caída', dias('2020-02-19', '2020-03-23'), 33);        // «in 33 days»
cuadra('suelo → récord, días', dias('2020-03-23', '2020-08-18'), 148);
cuadra('≈ meses', R1(148 / 30.44), 4.9);                               // «about five months later» (from the low)
cuadra('nuevo récord', REC > MAX, true);                               // «it hit a new record»
const E0 = 1.24, E1 = 240.634;
cuadra('BPA ×', R1(E1 / E0), 194.1);                                   // «about 190-fold»
cuadra('PER inicio → fin', [R1(13.49 / E0), R1(6853.03 / E1)].join('→'), '10.9→28.5'); // «P/E 11 → 28»
const TOT = 10.41, G = 5.47, DY = 3.62, LOG = 90.2;
cuadra('beneficios+div / total (arit.)', R1((G + DY) / TOT * 100), 87.3);
cuadra('≈ nueve décimas (logs)', LOG >= 85 && LOG <= 95, true);        // «about nine-tenths of the total return»
cuadra('×2,3M', R1(2300000 / 12000), 191.7);
cuadra('×2M', R1(2000000 / 12000), 166.7);
cuadra('BPA llegó a ese múltiplo en ~un siglo', E0 * 166.7 < E1 && E0 * 191.7 < E1, true); // «took about a century to grow that much»
cuadra('~100 años', 2025 - 1926, 99);                                  // scene 4 label «in ~100 years»

// S&P 500 closes, 19 Feb – 18 Aug 2020, every other trading day + the low (FRED SP500).
const SP20 = [3386.15, 3337.75, 3128.21, 2978.76, 3090.23, 3130.12, 2972.37, 2882.23, 2480.64, 2386.13, 2398.1, 2304.92, 2237.4,
  2447.33, 2630.07, 2626.65, 2470.5, 2488.65, 2659.41, 2789.82, 2846.06, 2799.55, 2823.16, 2799.31, 2836.74, 2863.39, 2912.43,
  2842.74, 2848.42, 2929.8, 2870.12, 2852.5, 2953.91, 2971.61, 2955.45, 3036.13, 3044.31, 3080.82, 3112.35, 3232.39, 3190.14,
  3041.31, 3124.74, 3115.34, 3117.86, 3050.33, 3009.05, 3100.29, 3130.01, 3145.32, 3152.05, 3155.22, 3226.56, 3224.73, 3257.3,
  3235.66, 3239.41, 3258.44, 3271.12, 3306.51, 3349.16, 3360.47, 3380.35, 3372.85, 3389.78];
// What is on screen besides the script.
cuadra('gráfica: empieza en el máximo', SP20[0], MAX);
cuadra('gráfica: el suelo es el 23 mar', Math.min(...SP20), SUELO);
cuadra('gráfica: acaba en récord', SP20[SP20.length - 1], REC);
cuadra('gráfica: nada supera el récord antes', SP20.slice(0, -1).every(v => v <= MAX), true);
cuadra('pantalla: 3,386 / 2,237 / 3,390', [MAX, SUELO, REC].map(Math.round).join('/'), '3386/2237/3390');
cuadra('pantalla: ≈ ×190', Math.round(E1 / E0 / 10) * 10, 190);
cuadra('pantalla: $240.63', R2(E1), 240.63);

const TEXTO = `Are stock prices just psychology? Half true.

Short run, mood moves prices fast: in 2020 the S&P 500 fell nearly 34% in 33 days (Feb 19 to Mar 23), then closed at a new record on Aug 18.

Long run, profits do the heavy lifting: since 1926, S&P 500 earnings per share grew about 190-fold, and earnings growth plus dividends account for roughly nine-tenths of the total return. The rest came from investors paying more for each dollar of profit.

"In the short-run, the market is a voting machine… but in the long-run, the market is a weighing machine." Warren Buffett, crediting Ben Graham (1993 letter).

What's the biggest market swing you've lived through, and what did you do?

Sources: S&P Dow Jones Indices · AP, Aug 18, 2020 · Robert Shiller, U.S. stock market data (nominal, dividends reinvested, S&P Composite before 1957) · Berkshire Hathaway 1993 shareholder letter.
Past performance doesn't guarantee future results. Educational only, not financial advice.

#investing #stockmarket #financialliteracy`;

const GUION = [
  [0, 'That clip says stock prices aren’t about the company, §just psychology. §{pop}*Half true.*'],
  [1, 'In 2020, pandemic §fear sent the §S&P 500 down §*nearly 34%* in 33 days. §About five months later, §{ding}it hit a *new record*.'],
  [2, 'So what decides the price in the *end*?'],
  [3, '§{pop}*Profits.* §Since 1926, S&P 500 earnings per share grew about §*190-fold*, §and that growth plus dividends explains about §*nine-tenths* of the total return.'],
  [4, 'And turning $12,000 §into millions in days? §Real profits took about *a century* to grow that much. §{caja}No formula does that *reliably*.'],
  [5, 'Warren Buffett credits his teacher, Benjamin Graham: §in the short run, the market is a *voting machine*; §{ding}in the long run, a *weighing machine*.'],
  [6, 'Every day, prices get *voted* on. §Over years, profits get *weighed*. §So don’t react to every swing.']
];

const MONO = `'DejaVu Sans Mono', 'Liberation Mono', monospace`;
const CSS = `
  .hud.i.fmt { letter-spacing: .14em; }
  .tj { position: absolute; left: 50%; background: rgba(9,14,27,.9); border: 2px solid rgba(148,163,184,.32); border-radius: 24px;
    padding: 12px 34px 16px; text-align: center; opacity: 0; white-space: nowrap; }
  .tj small { display: block; font: 700 23px/1.35 ${MONO}; letter-spacing: .14em; color: #94a3b8; margin-bottom: 4px; }
  .tj .l { display: block; font-size: 48px; line-height: 1.15; font-weight: 850; letter-spacing: -.015em; color: #fff; font-variant-numeric: tabular-nums; }
  .tj .l.p { font-size: 32px; font-weight: 750; color: #cbd5e1; line-height: 1.25; }
  .tj .l.big { font-size: 74px; line-height: 1.05; }
  .tj .t { color: #5eead4; } .tj .r { color: #f87171; } .tj .a { color: #f5b94a; } .tj .g { color: #94a3b8; }
  .tj.turq { border-color: rgba(94,234,212,.6); } .tj.amb { border-color: rgba(245,185,74,.65); } .tj.roja { border-color: rgba(248,113,113,.6); }
  .tj.dos .l:not(.p) { font-size: 42px; }
  /* source line: centred at x=470 and lines of ≤ 54 characters, so it ends before x≈830 (Instagram's buttons start at x≈940) */
  .fuente { position: absolute; left: 470px; transform: translateX(-50%); bottom: 420px; text-align: center; font: 600 21px/1.35 ${MONO};
    color: #b6c2d4; white-space: nowrap; background: rgba(7,11,22,.82); border-radius: 10px; padding: 5px 14px; }
  .chip { position: absolute; left: 50%; font-size: 38px; font-weight: 850; color: #e2e8f0; background: rgba(9,14,27,.92); border: 3px solid #94a3b8;
    border-radius: 18px; padding: 9px 22px; opacity: 0; white-space: nowrap; letter-spacing: .01em; }
  .chip.turq { border-color: #5eead4; color: #5eead4; } .chip.amb { border-color: #f5b94a; color: #f5b94a; } .chip.roja { border-color: #f87171; color: #f87171; }
  .contador { position: absolute; left: 50%; font-size: 124px; line-height: 1; font-weight: 900; letter-spacing: -.04em; color: #f87171;
    text-shadow: 0 6px 40px rgba(0,0,0,.85); opacity: 0; white-space: nowrap; font-variant-numeric: tabular-nums; }
  .contador small { font-size: 50px; font-weight: 800; letter-spacing: -.01em; color: #fca5a5; }
  /* scene 1: «−34%» over «in 33 days», pinned (from the 3D) just right of the drop arrow, so it slams in next to the plunge */
  .contador.dos { left: 0; transform-origin: 0 50%; }
  .contador.dos small { display: block; font-size: 46px; margin-top: 2px; }
  /* scene 0 (visual hook): a small headline with the quote slams in over a stampede, then «= JUST PSYCHOLOGY?»; on «Half true»
     the frame freezes, the HALF TRUE stamp falls on the seam and the screen splits: left, short run (mood); right, long run (profits) */
  .titular { position: absolute; left: 540px; top: 486px; width: 860px; box-sizing: border-box; background: rgba(9,14,27,.94); border: 3px solid rgba(148,163,184,.55);
    border-radius: 24px; padding: 12px 34px 16px; text-align: center; }
  .titular small { display: block; font: 700 22px/1.35 ${MONO}; letter-spacing: .16em; color: #94a3b8; margin-bottom: 4px; }
  .titular .q { display: block; font-size: 40px; line-height: 1.14; font-weight: 850; letter-spacing: -.015em; color: #fff; }
  .psico { position: absolute; left: 540px; top: 640px; font-size: 64px; line-height: 1; font-weight: 900; letter-spacing: -.02em; color: #f87171; white-space: nowrap;
    background: rgba(9,14,27,.92); border: 4px solid #f87171; border-radius: 20px; padding: 12px 30px 16px; opacity: 0; box-shadow: 0 0 40px rgba(248,113,113,.35); }
  .flash { position: absolute; inset: 0; background: radial-gradient(90% 60% at 50% 55%, rgba(239,68,68,0) 35%, rgba(239,68,68,.55) 100%); opacity: 0; }
  /* the stamp lands on the quote (the claim), above «= JUST PSYCHOLOGY?», so «PSYCHOLOGY?» stays readable and «JUST» is struck out */
  .hsello { position: absolute; left: 540px; top: 566px; border: 8px solid #f5b94a; color: #f5b94a; background: rgba(9,14,27,.94); border-radius: 20px;
    padding: 8px 30px 12px; font-size: 82px; line-height: 1; font-weight: 900; letter-spacing: .02em; white-space: nowrap; opacity: 0;
    box-shadow: 0 0 50px rgba(245,185,74,.35); z-index: 3; }
  .psico .tacha { position: relative; display: inline-block; }
  .psico .tacha i { position: absolute; left: -10px; right: -10px; top: 46%; height: 10px; border-radius: 5px; background: #f5b94a;
    box-shadow: 0 0 16px rgba(245,185,74,.7); transform: scaleX(0) rotate(-4deg); transform-origin: 0 50%; }
  .panel { position: absolute; left: 544px; top: 780px; width: 540px; height: 470px; box-sizing: border-box; background: rgba(6,10,20,.93);
    border-left: 4px solid #e2e8f0; box-shadow: -10px 0 40px rgba(226,232,240,.25); }
  .panel svg { position: absolute; left: 24px; top: 120px; width: 380px; height: 320px; overflow: visible; }
  .velo { position: absolute; left: 0; top: 780px; width: 540px; height: 470px; background: linear-gradient(rgba(239,68,68,.16), rgba(239,68,68,.05)); opacity: 0; }
  .mitadT.cero { top: 800px; z-index: 2; font-size: 27px; padding: 10px 26px 12px; }
  .mitadT.cero b { font-size: 56px; }
  .pregunta { position: absolute; left: 70px; right: 70px; top: 500px; text-align: center; font-size: 86px; line-height: 1.05; font-weight: 900;
    letter-spacing: -.03em; color: #fff; text-shadow: 0 6px 40px rgba(0,0,0,.85); opacity: 0; }
  .pregunta b { color: #5eead4; }
  /* scene 3: where the total return came from */
  .barras { position: absolute; left: 50%; width: 900px; margin-left: -450px; top: 1128px; background: rgba(9,14,27,.92); border: 2px solid rgba(148,163,184,.32);
    border-radius: 24px; padding: 14px 28px 18px; opacity: 0; box-sizing: border-box; }
  .barras small { display: block; font: 700 22px/1.35 ${MONO}; letter-spacing: .12em; color: #94a3b8; margin-bottom: 8px; text-align: center; }
  .barras .b { display: flex; height: 66px; border-radius: 14px; overflow: hidden; background: rgba(148,163,184,.14); }
  .barras .b span { display: flex; align-items: center; justify-content: center; white-space: nowrap; font-size: 36px; font-weight: 900; overflow: hidden; }
  .barras .tq { background: #2dd4bf; color: #06201c; width: 0; } .barras .am { background: #f5b94a; color: #1f1406; width: 0; }
  .barras .ley { margin-top: 10px; font-size: 29px; font-weight: 750; color: #e2e8f0; line-height: 1.35; white-space: nowrap; }
  .barras .ley i { display: inline-block; width: 22px; height: 22px; border-radius: 6px; margin-right: 10px; vertical-align: -2px; }
  .barras .ley .a2 { opacity: 0; }
  /* scene 5: split screen and the literal quote (labels 12 px lower and a shorter card, so the cover frame — portadas.json,
     encuadre_y 482 — shows the labels clear of its fade and the whole quote card) */
  .mitadT { position: absolute; top: 500px; transform: translateX(-50%); text-align: center; font: 700 24px/1.3 ${MONO}; letter-spacing: .14em;
    padding: 10px 22px 12px; border-radius: 18px; background: rgba(9,14,27,.9); border: 3px solid; opacity: 0; white-space: nowrap; }
  .mitadT b { display: block; font: 900 40px/1.1 Inter, sans-serif; letter-spacing: -.01em; margin-top: 2px; }
  .mitadT.r { border-color: #f87171; color: #fca5a5; } .mitadT.r b { color: #f87171; }
  .mitadT.t { border-color: #5eead4; color: #99f6e4; } .mitadT.t b { color: #5eead4; }
  .divisor { position: absolute; left: 539px; top: 640px; width: 2px; height: 610px; background: linear-gradient(transparent, rgba(148,163,184,.55) 18%, rgba(148,163,184,.55) 82%, transparent); }
  .citaB { position: absolute; left: 70px; width: 860px; top: 1262px; box-sizing: border-box; background: rgba(9,14,27,.93); border: 2px solid rgba(148,163,184,.4);
    border-radius: 24px; padding: 16px 34px 14px; text-align: center; font-size: 37px; line-height: 1.22; font-weight: 750; color: #fff; opacity: 0; }
  .citaB .r { color: #f87171; } .citaB .t { color: #5eead4; }
  .citaB small { display: block; margin-top: 8px; font: 600 21px/1.35 ${MONO}; color: #94a3b8; white-space: nowrap; }
  /* scene 6: the line to remember */
  .final { position: absolute; left: 60px; right: 60px; top: 492px; text-align: center; }
  .final span { display: block; font-size: 88px; line-height: 1.08; font-weight: 900; letter-spacing: -.03em; color: #fff; text-shadow: 0 6px 40px rgba(0,0,0,.85); opacity: 0; }
  .final .r { color: #f87171; } .final .t { color: #5eead4; }
`;

// 3D world of this video (added to tres.js): the price chart (line + columns on a dark board, a dashed level and a glowing head),
// a balance scale with its pointer and the turquoise profit blocks on the right pan, the ballot box and its ballots, a price
// gauge, the red slot machine (the «formula») with its rolling screen and lever, and the turquoise calendar whose pages flip.
// Everything is switched off at the start of each frame (X.apagar()).
const SCRIPT = `
const SP20 = ${JSON.stringify(SP20)};
// data-m="k": appears at mark k of the scene (-1 = at the start); data-hasta="k": leaves at mark k; data-d: delay (s).
function aparecen(s, e, el) {
  const M = e.seg.flatMap(g => g.marcas);
  el.querySelectorAll('[data-m]').forEach(n => {
    const k = +n.dataset.m, at = (k < 0 ? 0.12 : (M[k] != null ? M[k] : 1 + k)) + (+n.dataset.d || 0);
    let p = rebote(tramo(s, at - 0.1, at + 0.3));
    if (n.dataset.hasta != null) { const h = M[+n.dataset.hasta]; if (h != null) p *= 1 - tramo(s, h - 0.25, h); }
    aparece3(n, p);
  });
}
const X3 = (() => {
  const W = W3, T = W.T, S = W.S, objs = [], pools = [], luces = [];
  const grupo = () => { const g = new T.Group(); g.visible = false; S.add(g); objs.push(g); return g; };
  const mat = (c, o) => new T.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.55, metalness: 0.08 }, o || {}));
  const pieza = (g, geo, m, x, y, z) => { const o = new T.Mesh(geo, m); o.position.set(x, y, z); o.castShadow = true; o.receiveShadow = true; g.add(o); return o; };
  const caja = (g, w, h, d, m, x, y, z) => pieza(g, new T.BoxGeometry(w, h, d), m, x, y, z);
  const lienzo = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const tx = new T.CanvasTexture(c); tx.encoding = T.sRGBEncoding; tx.anisotropy = 4; return { c, x: c.getContext('2d'), tx }; };
  const texto = (l, txt, col, fs, x, y, peso) => { l.x.fillStyle = col; l.x.font = (peso || 900) + ' ' + fs + 'px Inter, sans-serif'; l.x.textAlign = 'center'; l.x.textBaseline = 'middle'; l.x.fillText(txt, x, y); };
  const pool = (n, crear) => { const a = Array.from({ length: n }, () => { const o = crear(); o.visible = false; S.add(o); return o; }); a.i = 0; pools.push(a); return a; };
  const tomar = (a) => { const o = a[a.i++]; if (o) o.visible = true; return o; };
  const ORO = 0xf5b94a, TURQ = 0x2dd4bf, ROJO = 0xef4444;
  const situa = (g, o) => { g.position.set(o.x || 0, o.y || 0, o.z || 0); g.rotation.set(o.rx || 0, o.ry || 0, o.rz || 0); g.scale.setScalar(Math.max(0.001, o.esc == null ? 1 : o.esc)); };
  const mMet = mat(0xcbd5e1, { metalness: 0.55, roughness: 0.32 }), mOsc = mat(0x334155, { roughness: 0.6 });
  const geoU = new T.BoxGeometry(1, 1, 1);
  const basico = (c, o) => new T.MeshBasicMaterial(Object.assign({ color: c, toneMapped: false }, o || {}));

  // ——— price chart: line of segments, faint columns down to zero, dark board, dashed level and a glowing head ———
  const NG = 72, graG = grupo();
  const tab = new T.Mesh(new T.PlaneGeometry(1, 1), basico(0x0b1222, { transparent: true, opacity: 0.85, depthWrite: false })); graG.add(tab);
  const bordes = [0, 1, 2, 3].map(() => { const m = new T.Mesh(geoU, basico(0x334155)); graG.add(m); return m; });
  const base0 = new T.Mesh(geoU, basico(0x64748b)); graG.add(base0);
  const segs = [], cols = [];
  for (let i = 0; i < NG; i++) {
    const s = new T.Mesh(geoU, basico(0xffffff)); graG.add(s); segs.push(s);
    const c = new T.Mesh(geoU, basico(0xffffff, { transparent: true, opacity: 0.17, depthWrite: false })); graG.add(c); cols.push(c);
  }
  const NR = 24, rayas = Array.from({ length: NR }, () => { const m = new T.Mesh(geoU, basico(0xcbd5e1, { transparent: true, opacity: 0.7 })); graG.add(m); return m; });
  const cabeza = new T.Mesh(new T.SphereGeometry(1, 18, 12), basico(0xffffff)); graG.add(cabeza);
  const luzG = new T.PointLight(0xffffff, 0, 6, 1.6); graG.add(luzG); luces.push(luzG);
  // o = { x, y, z, ancho, alto, vals: [0..1 of alto], hasta (float index; default: all), color(i) → css, grosor, tablero 0..1,
  //       columnas 0..1, nivel (0..1 of alto) + nivelOp, cabeza 0..1 } → p(i) = world position [x, y, z] of point i
  function grafica(o) {
    graG.visible = true; graG.position.set(o.x, o.y, o.z);
    const v = o.vals, n = v.length, A = o.ancho, H = o.alto, dx = A / (n - 1), g = o.grosor || 0.065;
    const hasta = Math.max(0, Math.min(n - 1, o.hasta == null ? n - 1 : o.hasta)), X = (i) => -A / 2 + i * dx;
    const colOp = o.columnas == null ? 1 : o.columnas;
    let hx = X(0), hy = v[0] * H, hc = o.color ? o.color(0) : '#ffffff';
    for (let i = 0; i < NG; i++) {
      const s = segs[i], c = cols[i];
      if (i >= n - 1 || i >= hasta) { s.visible = false; c.visible = false; continue; }
      const fr = Math.min(1, hasta - i), x0 = X(i), y0 = v[i] * H, x1 = x0 + dx * fr, y1 = (v[i] + (v[i + 1] - v[i]) * fr) * H;
      const L = Math.hypot(x1 - x0, y1 - y0), col = o.color ? o.color(i) : '#ffffff';
      s.visible = true; s.position.set((x0 + x1) / 2, (y0 + y1) / 2, 0); s.scale.set(L + g * 0.5, g, g); s.rotation.set(0, 0, Math.atan2(y1 - y0, x1 - x0)); s.material.color.set(col);
      const hm = (y0 + y1) / 2; c.visible = colOp > 0.01 && hm > 0.01;
      c.position.set((x0 + x1) / 2, hm / 2, -0.05); c.scale.set(Math.max(0.001, dx * fr * 0.78), Math.max(0.001, hm), 0.02); c.material.color.set(col); c.material.opacity = 0.17 * colOp;
      hx = x1; hy = y1; hc = col;
    }
    const tb = o.tablero || 0, TW = A + 0.6, TH = H + 0.5;
    tab.visible = tb > 0.01; tab.material.opacity = 0.85 * tb; tab.scale.set(TW, TH, 1); tab.position.set(0, H / 2 + 0.05, -0.14);
    [[0, H / 2 + 0.05 + TH / 2, TW, 0.035], [0, H / 2 + 0.05 - TH / 2, TW, 0.035], [-TW / 2, H / 2 + 0.05, 0.035, TH], [TW / 2, H / 2 + 0.05, 0.035, TH]]
      .forEach(([x, y, w, h], j) => { const b = bordes[j]; b.visible = tb > 0.01; b.position.set(x, y, -0.13); b.scale.set(w, h, 0.02); });
    base0.visible = true; base0.position.set(0, -0.01, -0.02); base0.scale.set(A + 0.1, 0.025, 0.02);
    const nv = o.nivel, nop = o.nivelOp == null ? 1 : o.nivelOp;
    rayas.forEach((m, j) => { m.visible = nv != null && nop > 0.01; if (!m.visible) return; const w = A / NR; m.position.set(-A / 2 + (j + 0.5) * w, nv * H, -0.03); m.scale.set(w * 0.55, 0.022, 0.02); m.material.opacity = 0.7 * nop; });
    const cb = o.cabeza == null ? 1 : o.cabeza; cabeza.visible = cb > 0.01; cabeza.position.set(hx, hy, 0.02); cabeza.scale.setScalar(0.085 * Math.max(0.001, cb)); cabeza.material.color.set(hc);
    luzG.position.set(hx, hy, 0.7); luzG.color.set(hc); luzG.intensity = 1.6 * cb;
    return (i) => [o.x + X(i), o.y + v[i] * H, o.z];
  }

  // ——— red drop arrow: a tick at y0, a bar and a head pointing down that grows to y1 as q goes 0 → 1 ———
  const flG = grupo(), mFl = basico(0xf87171);
  const flB = new T.Mesh(geoU, mFl), flT = new T.Mesh(geoU, mFl), flP = new T.Mesh(new T.ConeGeometry(1, 1, 18), mFl);
  flP.rotation.z = Math.PI; [flB, flT, flP].forEach(m => flG.add(m));
  // o = { x, z, y0, y1, q, grosor }
  function flecha(o) {
    const q = Math.max(0, Math.min(1, o.q == null ? 1 : o.q)); if (q < 0.01) return;
    flG.visible = true; flG.position.set(o.x, 0, o.z);
    const g = o.grosor || 0.045, cab = Math.min(0.16, (o.y0 - o.y1) * 0.3) * q, yh = o.y0 - (o.y0 - o.y1) * q, lb = Math.max(0.001, o.y0 - yh - cab);
    flB.position.set(0, o.y0 - lb / 2, 0); flB.scale.set(g, lb, g);
    flP.position.set(0, yh + cab / 2, 0); flP.scale.set(g * 2.3, Math.max(0.001, cab), g * 2.3);
    flT.position.set(0, o.y0, 0); flT.scale.set(g * 5, g * 0.8, g);
  }

  // ——— balance scale (pans on posts, so the blocks can stack high); amber pointer on the beam and a fixed dial above ———
  const balG = grupo(), PIV = 1.45, BR = 1.2, POST = 0.32;
  caja(balG, 1.05, 0.14, 0.72, mOsc, 0, 0.07, 0);
  pieza(balG, new T.CylinderGeometry(0.08, 0.11, PIV - 0.14, 18), mMet, 0, 0.14 + (PIV - 0.14) / 2, 0);
  const brG = new T.Group(); brG.position.set(0, PIV, 0); balG.add(brG);
  caja(brG, 2 * BR + 0.14, 0.09, 0.12, mMet, 0, 0, 0);
  pieza(brG, new T.SphereGeometry(0.12, 16, 12), mMet, 0, 0, 0);
  const aguja = new T.Mesh(new T.BoxGeometry(0.05, 0.74, 0.03), basico(ORO)); aguja.position.set(0, 0.42, 0.1); brG.add(aguja);
  const arcoD = new T.Mesh(new T.TorusGeometry(0.86, 0.016, 6, 40, 1.2), basico(0x64748b)); arcoD.rotation.z = Math.PI / 2 - 0.6; arcoD.position.set(0, PIV, 0.06); balG.add(arcoD);
  [-0.5, 0, 0.5].forEach(a => { const m = new T.Mesh(new T.BoxGeometry(0.022, a ? 0.08 : 0.13, 0.02), basico(a ? 0x64748b : 0xe2e8f0)); m.position.set(-Math.sin(a) * 0.88, PIV + Math.cos(a) * 0.88, 0.06); m.rotation.z = a; balG.add(m); });
  const platos = [-1, 1].map(() => { const g = new T.Group(); balG.add(g);
    pieza(g, new T.CylinderGeometry(0.035, 0.035, POST, 10), mMet, 0, -POST / 2, 0);
    pieza(g, new T.CylinderGeometry(0.56, 0.48, 0.07, 36), mMet, 0, 0.035, 0); return g; });
  const mBlq = mat(TURQ, { emissive: TURQ, emissiveIntensity: 0.38, roughness: 0.42 }), geoBlq = new T.BoxGeometry(0.44, 0.145, 0.44);
  const blqs = Array.from({ length: 16 }, () => { const m = new T.Mesh(geoBlq, mBlq); m.castShadow = true; m.receiveShadow = true; m.visible = false; platos[1].add(m); return m; });
  const BY = (i) => 0.07 + 0.0725 + i * 0.152;
  // o = { x, z, esc, ry, incl (−1..1, + = right pan down), n (blocks on the right pan; the fraction is one falling), cae (m) }
  function balanza(o) {
    balG.visible = true; situa(balG, { x: o.x, z: o.z, ry: o.ry, esc: o.esc });
    const a = (o.incl || 0) * 0.2; brG.rotation.z = -a;
    platos.forEach((g, j) => { const sx = j ? 1 : -1; g.position.set(sx * BR * Math.cos(a), PIV - sx * BR * Math.sin(a) + POST, 0); });
    const n = Math.max(0, o.n || 0), lleno = Math.floor(n), fr = n - lleno;
    blqs.forEach((m, i) => {
      if (i < lleno) { m.visible = true; m.position.set(0.014 * Math.sin(i * 2.1), BY(i), 0.014 * Math.cos(i * 1.7)); m.rotation.set(0, 0.22 * Math.sin(i * 1.3), 0); }
      else if (i === lleno && fr > 0.02) { m.visible = true; m.position.set(0, BY(i) + (o.cae || 2.4) * Math.pow(1 - fr, 2), 0); m.rotation.set(0.25 * (1 - fr), 0.22 * Math.sin(i * 1.3) + 0.8 * (1 - fr), 0); }
      else m.visible = false;
    });
    balG.updateMatrixWorld(true);
    const top = new T.Vector3(0, BY(Math.max(0, lleno - 1)) + 0.0725, 0); platos[1].localToWorld(top);
    const pl = new T.Vector3(0, 0.07, 0); platos[0].localToWorld(pl);
    const dl = new T.Vector3(0, PIV + 0.95, 0); balG.localToWorld(dl);
    return { tope: [top.x, top.y, top.z], platoL: [pl.x, pl.y, pl.z], dial: [dl.x, dl.y, dl.z] };
  }

  // ——— ballot box (glass, «VOTES»), its pile of ballots and the flying ballots ———
  const urnG = grupo(), UW = 0.95, UH = 0.78, UD = 0.62, u2 = UW / 2, d2 = UD / 2;
  pieza(urnG, new T.BoxGeometry(UW, UH, UD), new T.MeshStandardMaterial({ color: 0xa5b8d8, roughness: 0.1, metalness: 0.1, transparent: true, opacity: 0.15, side: T.DoubleSide, depthWrite: false }), 0, UH / 2 + 0.04, 0).castShadow = false;
  const mAr = mat(0xcbd5e1, { emissive: 0x94a3b8, emissiveIntensity: 0.3, roughness: 0.4 }), ar = 0.022;
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz]) => caja(urnG, ar, UH, ar, mAr, sx * u2, UH / 2 + 0.04, sz * d2));
  caja(urnG, UW + 0.08, 0.04, UD + 0.08, mOsc, 0, 0.02, 0);
  caja(urnG, UW + 0.06, 0.07, UD + 0.06, mOsc, 0, UH + 0.075, 0);
  caja(urnG, 0.42, 0.012, 0.07, basico(0x000000), 0, UH + 0.112, 0);
  const lv = lienzo(256, 96); lv.x.fillStyle = '#dc2626'; lv.x.beginPath(); lv.x.roundRect(4, 4, 248, 88, 18); lv.x.fill(); texto(lv, 'VOTES', '#ffffff', 58, 128, 52); lv.tx.needsUpdate = true;
  const etU = new T.Mesh(new T.PlaneGeometry(0.5, 0.1875), basico(0xffffff, { map: lv.tx, transparent: true })); etU.position.set(0, UH * 0.62, d2 + 0.006); urnG.add(etU);
  const pilaU = pieza(urnG, geoU, mat(0xf1f5f9, { emissive: 0xffffff, emissiveIntensity: 0.12 }), 0, 0, 0); pilaU.scale.set(UW - 0.08, 0.01, UD - 0.08);
  function urna(o) { urnG.visible = true; situa(urnG, o); const n = o.nivel || 0; pilaU.visible = n > 0.005; pilaU.scale.y = Math.max(0.001, n); pilaU.position.y = 0.04 + n / 2;
    return { ranura: [o.x || 0, (o.y || 0) + UH + 0.13, o.z || 0] }; }
  const papP = pool(16, () => { const m = new T.Mesh(new T.BoxGeometry(0.2, 0.006, 0.13), mat(0xf8fafc, { emissive: 0xffffff, emissiveIntensity: 0.3 })); m.castShadow = true; return m; });
  function papeleta(o) { const m = tomar(papP); if (m) situa(m, o); }

  // ——— price gauge (a half dial with a needle) ———
  const diaG = grupo(), ld = lienzo(512, 300), dx_ = ld.x;
  dx_.fillStyle = 'rgba(9,14,27,.95)'; dx_.beginPath(); dx_.roundRect(6, 6, 500, 288, 34); dx_.fill(); dx_.strokeStyle = '#475569'; dx_.lineWidth = 8; dx_.stroke();
  dx_.lineWidth = 16; dx_.lineCap = 'round'; dx_.strokeStyle = '#334155'; dx_.beginPath(); dx_.arc(256, 236, 170, Math.PI * 1.08, Math.PI * 1.92); dx_.stroke();
  for (let j = 0; j <= 8; j++) { const a = Math.PI * (1.12 + 0.76 * j / 8); dx_.strokeStyle = '#94a3b8'; dx_.lineWidth = 6; dx_.beginPath(); dx_.moveTo(256 + Math.cos(a) * 138, 236 + Math.sin(a) * 138); dx_.lineTo(256 + Math.cos(a) * 158, 236 + Math.sin(a) * 158); dx_.stroke(); }
  texto(ld, 'PRICE', '#e2e8f0', 46, 256, 262, 800); ld.tx.needsUpdate = true;
  diaG.add(new T.Mesh(new T.PlaneGeometry(0.9, 0.527), basico(0xffffff, { map: ld.tx, transparent: true })));
  const ejeD = new T.Group(); ejeD.position.set(0, -0.152, 0.01); diaG.add(ejeD);
  const agD = new T.Mesh(new T.BoxGeometry(0.022, 0.29, 0.01), basico(0xf87171)); agD.position.y = 0.145; ejeD.add(agD);
  const cuD = new T.Mesh(new T.CircleGeometry(0.03, 16), basico(0xe2e8f0)); cuD.position.set(0, -0.152, 0.02); diaG.add(cuD);
  function dial(o) { diaG.visible = true; situa(diaG, o); ejeD.rotation.z = o.ang || 0; agD.material.color.set(o.color || '#f87171'); }

  // ——— slot machine: the «formula» (red cabinet, rolling screen, lever, amber frame when it is caught) ———
  const traG = grupo();
  const mCab = mat(ROJO, { emissive: ROJO, emissiveIntensity: 0.25, roughness: 0.45 }), mCab2 = mat(0x991b1b, { roughness: 0.5 });
  const C_CAB = new T.Color(ROJO), C_CAB2 = new T.Color(0x991b1b), C_GRIS = new T.Color(0x4b5563);
  caja(traG, 1.15, 1.45, 0.7, mCab, 0, 0.725, 0);
  caja(traG, 1.25, 0.28, 0.78, mCab2, 0, 1.59, 0);
  caja(traG, 0.9, 0.12, 0.25, mCab2, 0, 0.42, 0.44);
  const lp = lienzo(512, 320);
  const pant = new T.Mesh(new T.PlaneGeometry(0.97, 0.606), basico(0xffffff, { map: lp.tx })); pant.position.set(0, 1.02, 0.352); traG.add(pant);
  const lcr = lienzo(512, 112); texto(lcr, '$  $  $', '#fde68a', 84, 256, 60); lcr.tx.needsUpdate = true;
  const corona = new T.Mesh(new T.PlaneGeometry(1.15, 0.2516), basico(0xffffff, { map: lcr.tx, transparent: true })); corona.position.set(0, 1.59, 0.392); traG.add(corona);
  const palG = new T.Group(); palG.position.set(0.64, 0.95, 0); traG.add(palG);
  pieza(palG, new T.CylinderGeometry(0.03, 0.03, 0.62, 10), mMet, 0, 0.31, 0);
  const bolaM = mat(ROJO, { emissive: ROJO, emissiveIntensity: 0.45 }); pieza(palG, new T.SphereGeometry(0.09, 16, 12), bolaM, 0, 0.64, 0);
  pieza(traG, new T.CylinderGeometry(0.075, 0.075, 0.08, 14), mCab2, 0.6, 0.95, 0).rotation.z = Math.PI / 2;
  // amber frame, a little narrower on the left (MX) so it closes inside the shot
  const mMar = basico(ORO, { transparent: true }), MW = 1.56, MH = 2.05, MY = 0.9, MX = 0.03;
  [[MX, MY + MH / 2, MW + 0.07, 0.07], [MX, MY - MH / 2, MW + 0.07, 0.07], [MX + MW / 2, MY, 0.07, MH], [MX - MW / 2, MY, 0.07, MH]]
    .forEach(([x, y, w, h]) => { const b = new T.Mesh(new T.BoxGeometry(w, h, 0.05), mMar); b.position.set(x, y, 0.5); traG.add(b); });
  const luzTr = new T.PointLight(0xf87171, 0, 5, 1.6); luzTr.position.set(0, 1.1, 1.0); traG.add(luzTr); luces.push(luzTr);
  function pintaPantalla(giro, gris) {
    const x = lp.x;
    x.clearRect(0, 0, 512, 320); x.fillStyle = '#0a1120'; x.beginPath(); x.roundRect(4, 4, 504, 312, 26); x.fill(); x.strokeStyle = '#7f1d1d'; x.lineWidth = 6; x.stroke();
    texto(lp, '$12,000 →', '#e2e8f0', 52, 256, 58, 800);
    if (giro != null) {
      const cols = 7, cw = 60, x0 = 256 - cols * cw / 2, y0 = 104, hh = 124;
      x.save(); x.beginPath(); x.rect(x0 - 6, y0, cols * cw + 12, hh); x.clip();
      x.font = '900 108px Inter, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = '#f87171';
      for (let c = 0; c < cols; c++) { const u = giro * (7 + c * 1.9) + c * 0.37, off = u - Math.floor(u), d = (Math.floor(u) + c * 3) % 10;
        x.fillText(String(d), x0 + c * cw + cw / 2, y0 + hh / 2 + off * hh); x.fillText(String((d + 1) % 10), x0 + c * cw + cw / 2, y0 + hh / 2 + (off - 1) * hh); }
      x.restore();
    } else texto(lp, 'MILLIONS', '#f87171', 104, 256, 166, 900);
    texto(lp, 'IN DAYS', '#fca5a5', 42, 256, 268, 800);
    if (gris > 0) { x.fillStyle = 'rgba(28,32,40,' + (0.72 * gris) + ')'; x.fillRect(0, 0, 512, 320); }
    lp.tx.needsUpdate = true;
  }
  // o = { x, z, ry, esc, giro (number while it spins; null = stopped on MILLIONS), apaga 0..1, marco 0..1, palanca 0..1, luz 0..1 }
  function tragaperras(o) {
    traG.visible = true; situa(traG, o);
    const ap = o.apaga || 0; mCab.color.copy(C_CAB).lerp(C_GRIS, ap); mCab.emissiveIntensity = 0.25 * (1 - ap); mCab2.color.copy(C_CAB2).lerp(C_GRIS, ap * 0.8);
    bolaM.emissiveIntensity = 0.45 * (1 - ap); palG.rotation.x = 1.05 * (o.palanca || 0);
    pintaPantalla(o.giro, ap);
    const mc = o.marco || 0; mMar.opacity = mc; mMar.visible = mc > 0.01; luzTr.intensity = 2.2 * (o.luz || 0) * (1 - ap);
  }

  // ——— calendar: big turquoise wall calendar on a stand; pages flip over and the year advances ———
  const calG = grupo(), CW = 1.0, CH = 1.12, CY = 0.64 + CH / 2;
  caja(calG, 0.62, 0.64, 0.42, mOsc, 0, 0.32, 0);
  caja(calG, CW + 0.08, CH + 0.08, 0.1, mat(0x0f766e, { emissive: TURQ, emissiveIntensity: 0.22 }), 0, CY, -0.04);
  const pintaHoja = (l, ano) => { const x = l.x; x.clearRect(0, 0, 512, 576); x.fillStyle = '#f8fafc'; x.fillRect(0, 0, 512, 576);
    x.fillStyle = '#14b8a6'; x.fillRect(0, 0, 512, 128); texto(l, 'YEAR', '#06201c', 56, 256, 70, 900);
    if (ano != null) texto(l, String(ano), '#0f172a', 176, 256, 352, 900); l.tx.needsUpdate = true; };
  const lca = lienzo(512, 576), lvo = lienzo(512, 576);
  const hoja = new T.Mesh(new T.PlaneGeometry(CW, CH), new T.MeshStandardMaterial({ map: lca.tx, emissive: 0xffffff, emissiveMap: lca.tx, emissiveIntensity: 0.4, roughness: 0.8 })); hoja.position.set(0, CY, 0.016); calG.add(hoja);
  const bisG = new T.Group(); bisG.position.set(0, CY + CH / 2, 0.03); calG.add(bisG);
  const vuela = new T.Mesh(new T.PlaneGeometry(CW, CH), new T.MeshStandardMaterial({ map: lvo.tx, emissive: 0xffffff, emissiveMap: lvo.tx, emissiveIntensity: 0.4, roughness: 0.8, side: T.DoubleSide, transparent: true }));
  vuela.position.y = -CH / 2; bisG.add(vuela);
  [-0.28, 0.28].forEach(x => { const r = new T.Mesh(new T.TorusGeometry(0.06, 0.016, 8, 20), mMet); r.position.set(x, CY + CH / 2, 0.04); calG.add(r); });
  let claveC = '', claveV = '';
  // o = { x, z, ry, esc, ano, anoPrev, flip 0..1 (the previous page lifting away) }
  function calendario(o) {
    calG.visible = true; situa(calG, o);
    if (String(o.ano) !== claveC) { claveC = String(o.ano); pintaHoja(lca, o.ano); }
    if (String(o.anoPrev) !== claveV) { claveV = String(o.anoPrev); pintaHoja(lvo, o.anoPrev); }
    const f = o.flip || 0; vuela.visible = o.anoPrev != null && f > 0.005 && f < 0.995;
    bisG.rotation.x = -Math.PI * 0.5 * sale(f); vuela.material.opacity = 1 - tramo(f, 0.2, 0.7);
    return { alto: (o.y || 0) + (CY + CH / 2) * (o.esc || 1) };
  }

  function apagar() { objs.forEach(g => { g.visible = false; }); pools.forEach(a => { a.forEach(o => { o.visible = false; }); a.i = 0; }); luces.forEach(l => { l.intensity = 0; }); }
  return { grafica, flecha, balanza, urna, papeleta, dial, tragaperras, calendario, apagar };
})();
W3.X = X3;
`;

const an = function (s, e, el) { aparecen(s, e, el); };
// Scene 0, right half: an illustrative line of profits that climbs with small wobbles (no axis, no data), in a 380 × 320 box.
const LINEA_LARGA = Array.from({ length: 23 }, (_, i) => {
  const u = i / 22, y = 300 - 280 * (Math.exp(2.6 * u) - 1) / (Math.exp(2.6) - 1) - 7 * Math.sin(i * 1.9) * (i > 0 && i < 22 ? 1 : 0);
  return Math.round(u * 380) + ',' + Math.round(y);
}).join(' ');
const fuente = (txt) => `<div class="fuente">${txt}</div>`;

const ESCENAS = [
  // 0 · Hook, visual (owner, 17 Nov 2026: the hook has to work with the sound off). Frame 0 is mid-crash: a live price ticker
  //     dives and rebounds like mad while a stampede of mannequins runs with it (left when it falls, red and arms up; right when it
  //     rises), and the camera pulls back fast from inside the crowd. The quote slams in as a small headline, then «= JUST
  //     PSYCHOLOGY?» (≈0.45 s, with a red flash at the bottom of the first crash). On «just psychology» a second crash and a push-in.
  //     On «Half true» ({pop}) everything freezes, the amber HALF TRUE stamp falls and the screen splits: left, the frozen
  //     stampede, SHORT RUN · MOOD; right, a turquoise line of profits that keeps climbing, LONG RUN · PROFITS (illustrative, no data).
  { html: () => `<div class="flash"></div><div class="velo"></div>
      <div class="panel"><svg viewBox="0 0 380 320"><polyline points="${LINEA_LARGA}" fill="none" stroke="#2dd4bf" stroke-width="9" stroke-linejoin="round" stroke-linecap="round"/></svg></div>
      <div class="titular"><small>A VIRAL MOVIE CLIP</small><span class="q">“Share prices aren’t really based on how a company works”</span></div>
      <div class="psico">= <span class="tacha">JUST<i></i></span> PSYCHOLOGY?</div>
      <div class="mitadT r cero" style="left:262px">SHORT RUN<b>MOOD</b></div><div class="mitadT t cero" style="left:782px">LONG RUN<b>PROFITS</b></div>
      <div class="hsello">HALF TRUE</div>`,
    anim: function (s, e, el) {
      const M = e.seg.flatMap(g => g.marcas), m0 = M[0] != null ? M[0] : 2.6, m1 = M[1] != null ? M[1] : 3.6;
      const golpe = (a, d) => Math.exp(-Math.pow((s - a) / d, 2));
      // headline: already slamming in on frame 0
      const pt = rebote(tramo(s, -0.12, 0.24)), ti = el.querySelector('.titular');
      ti.style.opacity = Math.min(1, 0.45 + pt); ti.style.transform = 'translateX(-50%) translateY(' + (-70 * (1 - pt)) + 'px) scale(' + (1.22 - 0.22 * pt) + ')';
      // «= JUST PSYCHOLOGY?»: slams at ~0.4 s, kicks again on «just psychology»
      const pp = tramo(s, 0.36, 0.6), ps = el.querySelector('.psico'), kick = golpe(m0 + 0.1, 0.12);
      ps.style.opacity = Math.min(1, pp * 3);
      ps.style.transform = 'translateX(-50%) rotate(' + (-5 * (1 - sale(pp)) + 2.5 * kick * Math.sin(s * 60)) + 'deg) scale(' + (2.3 - 1.3 * sale(pp) + 0.14 * kick) + ')';
      // red flash at the bottom of each crash
      el.querySelector('.flash').style.opacity = 0.8 * golpe(0.5, 0.14) + 0.6 * golpe(m0 + 0.62, 0.14);
      // «Half true»: the stamp lands on the quote with the {pop} (a hair early, so the split screen gets as long as the cut allows),
      // «JUST» is struck out, the right half slides in over the frozen stampede with its line already half drawn, the labels pop
      const sp = tramo(s, m1 - 0.16, m1 + 0.04), st = el.querySelector('.hsello'), choque = s > m1 + 0.04 ? Math.exp(-(s - m1 - 0.04) * 14) * Math.sin((s - m1 - 0.04) * 70) : 0;
      st.style.opacity = Math.min(1, sp * 4);
      st.style.transform = 'translate(-50%,-50%) translateY(' + (6 * choque) + 'px) rotate(' + (-6 + 14 * (1 - sale(sp))) + 'deg) scale(' + (2.4 - 1.4 * sale(sp)) + ')';
      el.querySelector('.psico .tacha i').style.transform = 'scaleX(' + sale(tramo(s, m1 + 0.02, m1 + 0.2)) + ') rotate(-4deg)';
      const pa = sale(tramo(s, m1 - 0.1, m1 + 0.14)), pn = el.querySelector('.panel');
      pn.style.transform = 'translateX(' + (520 * (1 - pa)) + 'px)'; pn.style.opacity = pa > 0.005 ? 1 : 0;
      el.querySelector('.velo').style.opacity = pa;
      const pl = el.querySelector('.panel polyline'), L = 900; pl.style.strokeDasharray = L; pl.style.strokeDashoffset = L * (1 - 0.45 - 0.55 * sale(tramo(s, m1 - 0.1, m1 + 0.45)));
      el.querySelectorAll('.mitadT.cero').forEach((n, j) => { const p = rebote(tramo(s, m1 - 0.04 + 0.06 * j, m1 + 0.18 + 0.06 * j)); n.style.opacity = Math.min(1, p * 1.5); n.style.transform = 'translateX(-50%) scale(' + (0.7 + 0.3 * p) + ')'; });
    } },
  // 1 · Short run: the chart becomes the real 2020 S&P 500 tape. On the cut it is already plunging in red from 3,386 (Feb 19),
  //     the camera diving with it; it hits the floor, 2,237 (Mar 23), on «fear» (red flash, camera shake). The camera pulls back
  //     to show the crowd jumping back in red; «−34% in 33 days» slams in on «S&P 500 down» and on «nearly 34%» a red arrow
  //     measures the drop from the Feb 19 level. Then it climbs in turquoise and on {ding} sets a new record (Aug 18).
  { html: () => `<div class="flash"></div>
      <div class="contador dos" style="top:730px;left:600px">−34%<small>in 33 days</small></div>
      <div class="chip turq" data-t="translateX(-50%)" data-m="4" style="top:790px;left:640px;font-size:52px">NEW RECORD</div>
      ${fuente('Feb 19, 2020: 3,386 → Mar 23: 2,237 → Aug 18: 3,390<br>S&P 500 closes · S&P Dow Jones Indices (via FRED) · AP')}`,
    anim: function (s, e, el) {
      aparecen(s, e, el);
      const M = e.seg.flatMap(g => g.marcas), mF = M[0] != null ? M[0] : 1.5, mS = M[1] != null ? M[1] : 2.2, mN = M[2] != null ? M[2] : 3.4, m1 = M[3] != null ? M[3] : 6.1;
      const golpe = (a, d) => Math.exp(-Math.pow((s - a) / d, 2));
      el.querySelector('.flash').style.opacity = 0.75 * golpe(mF + 0.06, 0.13);
      // «−34%»: slams in on «S&P 500 down», kicks on «nearly 34%», leaves when the climb starts (left/top come from the 3D)
      const c = el.querySelector('.contador'), p = tramo(s, mS - 0.08, mS + 0.16);
      c.style.opacity = Math.min(1, p * 4) * (1 - tramo(s, m1 - 0.25, m1));
      c.style.transform = 'translateY(-50%) rotate(' + (-8 * (1 - sale(p))) + 'deg) scale(' + (1.75 - 0.75 * sale(p) + 0.14 * golpe(mN + 0.1, 0.1)) + ')';
    } },
  // 2 · Open question: the crowd walks away; the turquoise mannequin alone in front of a huge, empty balance scale.
  { html: () => `<div class="pregunta" data-t="" data-m="-1">What decides the price <b>in the end?</b></div>`, anim: an },
  // 3 · Long run: on {pop} profit blocks start falling onto the pan; EPS $1.24 (1926) → $240.63 (2025), «≈ ×190» next to the
  //     column. Then the total-return bar: ~9/10 earnings growth + dividends (turquoise), ~1/10 a higher P/E (amber).
  { html: () => `<div class="tj turq" data-t="translateX(-50%)" data-m="1" style="top:484px"><small>S&P 500 EARNINGS PER SHARE</small>
        <span class="l"><span class="g">1926:</span> $1.24 <span data-t="" data-m="2" style="display:inline-block;opacity:0">→ <span class="g">2025:</span> <span class="t">$240.63</span></span></span></div>
      <div class="barras" data-t="" data-m="3"><small>TOTAL RETURN SINCE 1926: WHERE IT CAME FROM</small>
        <div class="b"><span class="tq">≈ 9/10</span><span class="am"></span></div>
        <div class="ley"><i style="background:#2dd4bf"></i>Earnings growth + dividends</div>
        <div class="ley a2"><i style="background:#f5b94a"></i>≈ 1/10: paying more per $1 of profit (P/E 11 → 28)</div></div>
      ${fuente('Robert Shiller data · Dec 1926–Dec 2025 · nominal<br>dividends reinvested · S&P Composite before 1957<br>Past performance, not a promise')}`,
    anim: function (s, e, el) {
      aparecen(s, e, el);
      const M = e.seg.flatMap(g => g.marcas), m3 = M[3] != null ? M[3] : 5, m4 = M[4] != null ? M[4] : 6.5;
      const llena = sale(tramo(s, m3 + 0.1, m4 + 0.1)), am = sale(tramo(s, m4 + 0.15, m4 + 0.55));
      el.querySelector('.barras .tq').style.width = (90 * llena) + '%'; el.querySelector('.barras .am').style.width = (10 * am) + '%';
      el.querySelector('.barras .a2').style.opacity = am;
      // slow zoom on the bar card while it fills, up to the cut
      el.querySelector('.barras').style.transform += ' scale(' + (1 + 0.04 * tramo(s, m3 + 0.6, m4 + 1.8)) + ')';
    } },
  // 4 · The «formula»: left, the red slot machine rolling «$12,000 → MILLIONS · IN DAYS» (movie); right, the turquoise calendar
  //     whose pages flip 1926 → 2025 (real profits: ≈ ×190 in ~100 years). On {caja} the slot machine goes dark inside an amber
  //     frame: NO RELIABLE FORMULA.
  { html: () => `<div class="tj roja dos" data-t="translateX(-50%)" data-m="-1" style="top:484px;left:285px"><small>IN THE MOVIE</small>
        <span class="l">$12,000 → <span class="r">millions</span></span><span class="l p">in days</span></div>
      <div class="tj turq dos" data-t="translateX(-50%)" data-m="1" style="top:484px;left:790px"><small>REAL PROFITS</small>
        <span class="l"><span class="t">≈ ×190</span></span><span class="l p">in ~100 years</span></div>
      ${fuente('S&P 500 EPS $1.24 (1926) → $240.63 (2025)<br>Robert Shiller data, nominal · Movie: subtitle transcript')}`,
    anim: function (s, e, el) {
      aparecen(s, e, el);
      const M = e.seg.flatMap(g => g.marcas), m2 = M[2] != null ? M[2] : 5;
      const r = el.querySelector('.tj.roja'); r.style.opacity = Math.min(+r.style.opacity || 0, 1 - 0.55 * tramo(s, m2, m2 + 0.4));
    } },
  // 5 · Voting vs weighing (split screen). Left, SHORT RUN · VOTING MACHINE: mannequins drop ballots into a box and keep switching
  //     colour; the price needle is nervous. Right, LONG RUN · WEIGHING MACHINE: the profit blocks come down onto the pan and on
  //     {ding} the pointer settles. The literal quote in a card.
  { html: () => `<div class="mitadT r" data-t="translateX(-50%)" data-m="0" style="left:285px">SHORT RUN<b>VOTING MACHINE</b></div>
      <div class="mitadT t" data-t="translateX(-50%)" data-m="1" style="left:790px">LONG RUN<b>WEIGHING MACHINE</b></div>
      <div class="divisor"></div>
      <div class="citaB" data-t="" data-m="-1">“In the short-run, the market is a <span class="r">voting machine</span>… but in the long-run, the market is a <span class="t">weighing machine</span>.”
        <small>Warren Buffett, crediting Ben Graham (1993 Berkshire letter)</small></div>`, anim: an },
  // 6 · Close: the crowd sways from side to side with the trembling chart; the turquoise mannequin stands still next to the
  //     balance. «Prices get voted. Profits get weighed.» No series card, no «follow».
  { html: () => `<div class="final"><span data-t="" data-m="-1">Prices get <b class="r">voted</b>.</span><span data-t="" data-m="0">Profits get <b class="t">weighed</b>.</span></div>`, anim: an }
];

const TRES = function (t, k, s, e, W) {
  const X = W.X; X.apagar(); W.gente.forEach(a => { a.g.rotation.z = 0; });
  const p = Math.min(1, s / (e.fin - e.ini)), M = e.seg.flatMap(g => g.marcas);
  const mk = (j, def) => e.ini + (M[j] != null ? M[j] : def);   // mark j of this scene, in global time
  const q = (a, d) => sale(tramo(t, a, a + (d || 0.45)));
  const bote = (a, d) => rebote(tramo(t, a, a + (d || 0.35)));
  const TQ = '#5eead4', AMB = '#f5b94a', ROJ = '#f87171', GRIS = '#94a3b8', BLANCO = '#e2e8f0';
  const fuera = { x: -60, z: -60, esc: 0 };
  const mezcla = (P, Q, u) => P.map((v, j) => v + (Q[j] - v) * u);
  const camLerp = (P, Q, u) => W.camara(...mezcla(P, Q, u));
  const despues = [];
  let directo = () => fuera;
  // Illustrative trembling chart (no data): a few sines at different speeds.
  const ruido = (i, A) => 0.55 + A * (0.5 * Math.sin(i * 0.55 + t * 2.3) + 0.33 * Math.sin(i * 1.37 - t * 3.1) + 0.2 * Math.sin(i * 2.9 + t * 5.3) + 0.12 * Math.sin(i * 4.7 - t * 7.9));
  const VR = (A, n) => Array.from({ length: n }, (_, i) => ruido(i, A));
  // The crowd that watches the chart (backs to the camera).
  const PUB = [[-1.5, -1.5], [-0.5, -1.56], [0.5, -1.47], [1.5, -1.55], [-1.95, -0.85], [-1.0, -0.9], [0.02, -0.83], [1.02, -0.9], [1.95, -0.84],
    [-1.45, -0.42], [-0.45, -0.46], [0.55, -0.38], [1.5, -0.44]];
  const blanco = { color: '#f8fafc', cq: 0.4, brillo: 0.05 };
  const GX = 0, GY = 1.75, GZ = -2.6, GA = 4.4, GH = 2.85;   // chart of scenes 0 and 1

  // Camera along keyframes [[time, [px, py, pz, lx, ly, lz]]…] (Hermite spline, never stops in between; it starts already moving
  // with the speed of the first leg and eases into the last keyframe).
  const ruta = (K, x) => {
    if (x <= K[0][0]) return K[0][1];
    if (x >= K[K.length - 1][0]) return K[K.length - 1][1];
    let j = 0; while (x > K[j + 1][0]) j++;
    const [t0, P0] = K[j], [t1, P1] = K[j + 1], dt = t1 - t0, u = (x - t0) / dt;
    const vel = (n) => n === 0 ? K[1][1].map((v, c) => (v - K[0][1][c]) / (K[1][0] - K[0][0])) : n === K.length - 1 ? P0.map(() => 0)
      : K[n + 1][1].map((v, c) => (v - K[n - 1][1][c]) / (K[n + 1][0] - K[n - 1][0]));
    const V0 = vel(j), V1 = vel(j + 1), u2 = u * u, u3 = u2 * u;
    return P0.map((v, c) => (2 * u3 - 3 * u2 + 1) * v + (u3 - 2 * u2 + u) * dt * V0[c] + (-2 * u3 + 3 * u2) * P1[c] + (u3 - u2) * dt * V1[c]);
  };
  // Orbit: turns the camera position by `ang` (rad) around the vertical axis through the point it looks at.
  const orbita = (C, ang) => { const dx = C[0] - C[3], dz = C[2] - C[5], c = Math.cos(ang), s_ = Math.sin(ang); return [C[3] + dx * c + dz * s_, C[1], C[5] - dx * s_ + dz * c, C[3], C[4], C[5]]; };

  if (k === 0) {
    // A live ticker that crashes and rebounds like mad (illustrative: no axis, no data). h(x) = level 0..1 at time x; frame 0 is
    // mid-dive, the first bottom at 0.5 s, a second crash on «just psychology» (m0) and everything freezes on «Half true» (m1).
    const m0 = mk(0, 2.6), m1 = mk(1, 3.6), tt = Math.min(t, m1);
    const KF = [[-3.3, 0.5], [-2.7, 0.74], [-2.1, 0.38], [-1.45, 0.8], [-0.85, 0.48], [-0.25, 0.92], [0.5, 0.07], [1.25, 0.9], [1.95, 0.3],
      [m0 - 0.08, 0.88], [m0 + 0.62, 0.08], [m1 + 0.35, 0.62]];
    const h = (x) => { if (x <= KF[0][0]) return KF[0][1]; let j = 0; while (j < KF.length - 2 && x > KF[j + 1][0]) j++;
      const u = Math.min(1, (x - KF[j][0]) / (KF[j + 1][0] - KF[j][0])), w = u * u * (3 - 2 * u); return KF[j][1] + (KF[j + 1][1] - KF[j][1]) * w; };
    const nz = (x) => 0.04 * Math.sin(x * 31) + 0.028 * Math.sin(x * 57 + 1.3) + 0.02 * Math.sin(x * 83 + 0.4);
    const NT = 48, DT = 0.055, xs = Array.from({ length: NT }, (_, i) => tt - (NT - 1 - i) * DT);
    const vals = xs.map(x => Math.max(0.03, Math.min(0.97, h(x) + nz(x))));
    X.grafica({ x: GX, y: GY, z: GZ, ancho: GA, alto: GH, vals, color: (i) => h(xs[i + 1]) < h(xs[i]) ? ROJ : BLANCO, tablero: 1, columnas: 0.8 });
    // The stampede runs with the price (left when it falls: red, arms up; right when it rises), each one a little late.
    const FILAS = [-1.75, -1.1, -0.45, 0.2], NC = 22, SW = 3.6;
    const CR = Array.from({ length: NC }, (_, i) => { const f = i % 4, c = Math.floor(i / 4);
      return { x: -2.35 + c * 0.9 + 0.45 * (f % 2) + 0.18 * Math.sin(i * 2.7), z: FILAS[f] + 0.12 * Math.sin(i * 1.9), lag: 0.03 + 0.2 * ((i * 0.618) % 1) }; });
    directo = (i) => {
      if (i >= NC) return fuera;
      const c = CR[i], x0 = tt - c.lag, v = SW * (h(x0) - h(x0 - 0.06)) / 0.06, baja = Math.max(0, Math.min(1, -v / 2.2));
      return Object.assign({ x: c.x + SW * (h(x0) - 0.5), z: c.z, rot: (Math.PI / 2) * Math.tanh(v / 1.1), amp: Math.min(1.25, Math.abs(v) / 2), fase: tt * 13,
        brazos: 0.45 * baja, color2: '#f87171', c2q: 0.9 * baja }, blanco);
    };
    // Camera: frame 0 inside the stampede, pulling back fast; drift; push-in on the second crash; on «Half true» the stampede
    // freezes but the camera keeps pushing in slowly up to the cut (no still frames under the split screen).
    W.camara(...ruta([[0, [2.3, 1.85, 5.9, 0.3, 2.8, -2.2]], [1.7, [0.35, 3.0, 10.6, 0, 2.85, -1.6]], [m0, [-0.5, 3.1, 10.1, 0, 2.9, -1.6]],
      [m0 + 0.75, [-0.15, 3.2, 8.6, 0, 3.0, -2.0]], [m1, [-0.05, 3.22, 8.3, 0, 3.0, -2.0]], [m1 + 0.9, [-0.3, 3.14, 7.2, -0.25, 2.95, -2.0]]], t));
  } else if (k === 1) {
    // Marks: «fear» (the floor), «S&P» (−34%), «nearly» (the drop arrow), «About» (the climb), «it hit» (the record).
    const mF = mk(0, 1.5), mS = mk(1, 2.2), mN = mk(2, 3.4), m1 = mk(3, 6.1), m2 = mk(4, 7.15);
    const N = SP20.length, IT = SP20.indexOf(Math.min(...SP20)), vals = SP20.map(v => v / 3500);
    // Already falling on the cut and accelerating into the floor on «fear»; the climb runs from «About» to the record.
    const hasta = IT * (0.1 + 0.9 * Math.pow(tramo(t, e.ini, mF + 0.03), 1.45)) + (N - 1 - IT) * tramo(t, m1, m2);
    // Camera (set first: the labels and «−34%» are placed from it): tight on Feb 19, diving with the plunge; a shake on the floor;
    // a fast pull-back that reveals the red crowd jumping back (and «−34%»); a slower drift while the drop is measured; then wide,
    // tracking right with the climb and rising a little on the record. The plunge fills the frame instead of a quarter of the board.
    const C = ruta([[e.ini, [-2.25, 4.75, 0.6, -2.15, 4.45, -2.6]], [Math.min(e.ini + 0.75, (e.ini + mF) / 2), [-2.0, 4.45, 1.3, -1.95, 4.15, -2.6]],
      [mF, [-1.6, 4.2, 2.0, -1.75, 3.95, -2.6]], [mS + 0.06, [-1.2, 3.5, 4.6, -1.35, 3.3, -2.2]], [mN, [-0.8, 3.3, 6.4, -1.0, 3.15, -2.0]],
      [m1, [0.35, 3.0, 10.0, 0.15, 2.85, -1.5]], [m2 + 0.4, [0.85, 3.25, 9.5, 0.55, 3.0, -1.6]], [e.fin, [1.0, 3.3, 9.3, 0.62, 3.05, -1.6]]], t);
    const dF = t - mF, sacude = dF > 0 ? 0.07 * Math.exp(-dF * 7) : 0;
    W.camara(C[0] + sacude * Math.sin(dF * 41), C[1] + sacude * Math.sin(dF * 53 + 1), C[2], C[3], C[4] + 0.5 * sacude * Math.sin(dF * 47), C[5]);
    // Labels, line and glowing head keep about the same size on screen while the camera travels from ~3 m to ~12 m.
    const dC = W.cam.position.distanceTo(new W.T.Vector3(-1.8, 4.0, GZ)), sc = Math.min(1, Math.max(0.42, dC / 10));
    const G = X.grafica({ x: GX, y: GY, z: GZ, ancho: GA, alto: GH, vals, hasta, color: (i) => i < IT ? ROJ : TQ, tablero: 1, grosor: 0.065 * Math.max(0.7, sc),
      nivel: vals[0], nivelOp: 0.8 * q(mN - 0.05, 0.35), cabeza: (1 - q(m2 + 0.6, 0.4)) * Math.max(0.5, sc) });
    const P0 = G(0), PT = G(IT), PN = G(N - 1);
    W.rotulo('f19', 'Feb 19 · 3,386', P0[0] + 0.62 * sc, P0[1] + 0.4 * sc, P0[2] + 0.1, 1, BLANCO, 0.34 * sc);
    W.rotulo('m23', 'Mar 23 · 2,237', PT[0] + 0.2 * sc, PT[1] - 0.42 * sc, PT[2] + 0.1, Math.min(1, 1.3 * bote(mF - 0.02, 0.3)), ROJ, 0.34 * sc);
    W.rotulo('a18', 'Aug 18 · 3,390', PN[0] - 0.62 * sc, PN[1] + 0.4 * sc, PN[2] + 0.1, q(m2 - 0.05, 0.3), TQ, 0.34 * sc);
    // «nearly 34%»: a red arrow from the Feb 19 level down to the floor (it goes before the climb passes there); «−34%» sits right of it.
    const FX = PT[0] + 0.16;
    X.flecha({ x: FX, z: GZ + 0.04, y0: P0[1], y1: PT[1] + 0.03, q: sale(tramo(t, mN - 0.05, mN + 0.4)) * (1 - tramo(t, m1 - 0.25, m1 + 0.05)) });
    const A = W.pantalla(FX, (P0[1] + PT[1]) / 2, GZ), cont = document.querySelector('.escena[data-n="1"] .contador');
    if (cont) { cont.style.left = Math.round(A.x + 42) + 'px'; cont.style.top = Math.round(A.y) + 'px'; }
    // The crowd jumps back in red when the tape hits the floor, then shakes in panic; calm on the way up, arms up on the record.
    const panico = q(mF - 0.04, 0.25) * (1 - q(m1 + 0.2, 0.9)), fiesta = q(m2, 0.35), atras = sale(tramo(t, mF, mF + 0.45)) * (1 - q(m1, 1.2));
    const salto = (i) => Math.sin(Math.PI * tramo(t, mF + 0.02 + 0.012 * i, mF + 0.5 + 0.012 * i));
    directo = (i) => i < PUB.length ? Object.assign({ x: PUB[i][0] + 0.05 * panico * Math.sin(t * 13 + i), z: PUB[i][1] + 0.3 * atras,
      rot: Math.PI + 0.14 * Math.sin(i * 2.3) + 0.3 * panico * Math.sin(t * 5 + i * 1.7), amp: 0,
      brazos: Math.min(1, 0.22 * panico * (1 + Math.sin(t * 9 + i * 2)) + 0.75 * salto(i) + 0.8 * fiesta * (0.85 + 0.15 * Math.sin(t * 8 + i))),
      color2: '#f87171', c2q: 0.85 * panico }, blanco) : fuera;
    despues.push(() => PUB.forEach((_, i) => { const g = W.gente[i].g; g.rotation.z = (0.04 + 0.08 * panico) * Math.sin(t * (2.6 + 4 * panico) + i * 1.3); g.position.y = 0.3 * salto(i); }));
  } else if (k === 2) {
    const BX = 0.25, BZ = -0.9;
    X.balanza({ x: BX, z: BZ, esc: 1.3, incl: 0.04 * Math.sin(t * 1.7) });
    // The crowd parts and leaves the frame.
    directo = (i) => { if (i >= 10) return fuera; const lado = i % 2 ? 1 : -1, u = sale(tramo(t, e.ini + 0.03 * i, e.ini + 1.25 + 0.03 * i));
      const x0 = -1.7 + (i % 5) * 0.85, z0 = 0.35 + Math.floor(i / 5) * 0.75, x1 = lado * (3.9 + 0.3 * (i % 3)), z1 = z0 - 0.4;
      return Object.assign({ x: x0 + (x1 - x0) * u, z: z0 + (z1 - z0) * u, rot: Math.atan2(x1 - x0, z1 - z0), amp: u > 0.01 && u < 0.99 ? 1 : 0, fase: t * 7, esc: 1 - tramo(u, 0.88, 1) }, blanco); };
    W.heroe({ x: -0.75, z: 1.25, gira: Math.PI - 0.45, luz: 0.6 + 0.3 * q(e.ini + 0.6, 0.5) });
    camLerp([-0.55, 2.55, 10.6, 0.15, 2.0, -0.9], [0.5, 2.25, 8.9, 0.15, 2.0, -0.9], p);   // push-in with a sideways arc
  } else if (k === 3) {
    const m0 = mk(0, 0.1), m1 = mk(1, 1.0), m2 = mk(2, 4.0), m3 = mk(3, 4.9);
    const BX = 0, BZ = -0.9, NB = 9, D = 0.32;
    const tB = (j) => j === 0 ? Math.max(e.ini + 0.02, m0 - 0.3) : m1 - 0.1 + (m2 + 0.15 - D - (m1 - 0.1)) * (j - 1) / (NB - 2);
    let n = 0, choque = 0;
    for (let j = 0; j < NB; j++) { const t0 = tB(j); n += tramo(t, t0, t0 + D); const dt = t - (t0 + D); if (dt > 0) choque += Math.exp(-dt * 4.5) * Math.sin(dt * 15) * 0.16; }
    const B = X.balanza({ x: BX, z: BZ, esc: 1.05, n, incl: Math.min(1, 0.25 + 0.75 * Math.min(1, n / 4)) * Math.min(1, n * 1.5) + choque });
    W.rotulo('x190', '≈ ×190', B.tope[0] - 0.95, B.tope[1] - 0.2, B.tope[2] + 0.3, Math.min(1, 1.4 * bote(m2 + 0.15, 0.35)), TQ, 0.42);
    W.rotulo('eps', 'PROFITS', B.tope[0], B.tope[1] + 0.32, B.tope[2] + 0.3, Math.min(1, 1.4 * bote(m0 + 0.2, 0.3)) * (1 - q(m2 - 0.2, 0.3)), TQ, 0.3);
    W.heroe({ x: -1.6, z: 0.6, gira: 1.1, luz: 0.85 });
    // Camera on a spline that never stops: push-in on the falling blocks; when the bar card comes in it rises so the card sits under
    // the scale; then, while the bar fills (≈ 9/10, then the amber 1/10), it keeps pushing in (about a quarter closer) and orbits ~12° more around the
    // balance up to the cut (the last keyframe lies after the cut, so it is still moving there).
    W.camara(...ruta([[e.ini, orbita([0, 2.35, 9.6, 0, 1.9, -0.9], 0)], [e.ini + 4, orbita([0, 2.3, 8.6, 0, 1.92, -0.9], -0.1)],
      [m3 - 0.3, orbita([0, 2.3, 8.2, 0, 1.95, -0.9], -0.15)], [m3 + 0.6, orbita([0, 3.1, 10.8, 0, 1.65, -0.9], -0.2)],
      [e.fin + 0.8, orbita([0, 2.75, 7.6, 0, 2.0, -0.9], -0.4)]], t));
  } else if (k === 4) {
    const m0 = mk(0, 1.0), m1 = mk(1, 2.4), m2 = mk(2, 4.8);
    const SX = -1.08, CX = 1.2;   // slot machine far enough right for its amber frame to close inside the shot
    const gira = t < m0 + 0.55;   // rolling until «into millions»
    X.tragaperras({ x: SX, z: -0.3, ry: 0.2, giro: gira ? (t - e.ini) * 1.3 : null, apaga: q(m2, 0.35), marco: q(m2, 0.3),
      palanca: Math.sin(Math.PI * tramo(t, e.ini + 0.05, e.ini + 0.55)), luz: bote(m0 + 0.55, 0.3) * (1 - tramo(t, m0 + 0.9, m0 + 1.6)) + 0.4 });
    const NF = 24, pos = NF * tramo(t, m1 - 0.1, m2 - 0.2), fi = Math.min(NF, Math.floor(pos)), ano = (j) => 1926 + Math.round(99 * j / NF);
    X.calendario({ x: CX, z: -0.3, ry: -0.2, ano: ano(fi), anoPrev: fi > 0 ? ano(fi - 1) : null, flip: fi >= NF ? 1 : Math.min(1, (pos - fi) * 1.6) });
    W.rotulo('nof', 'NO RELIABLE FORMULA', SX + 0.2, 2.05, 0.15, q(m2, 0.3), AMB, 0.26);
    // The gambler (in front of the machine, back to the camera) cheers while it rolls and slumps when it is caught.
    const cae = q(m2, 0.4);
    directo = (i) => i === 0 ? { x: SX + 0.88, z: 0.35, rot: -Math.PI / 2 - 0.25, amp: 0, brazos: (1 - cae) * (0.55 + 0.35 * Math.sin(t * 7)), color: '#f87171', cq: 0.7 * (1 - cae), brillo: 0.2 } : fuera;
    W.heroe({ x: 0.45, z: 0.65, gira: 1.2, luz: 0.5 + 0.5 * q(m1 - 0.1, 0.4) });
    W.camara(...orbita(mezcla([0, 2.05, 9.5, 0, 1.15, -0.3], [0, 1.95, 8.4, 0, 1.15, -0.3], p), 0.1 - 0.2 * p));   // push-in with a slow orbit
  } else if (k === 5) {
    const m0 = mk(0, 2.4), m1 = mk(1, 4.6);
    const UX = -1.1, UZ = -0.2, BX = 1.05, BZ = -0.45;
    // Voters around the box take turns; each one switches colour every time they vote.
    const VOT = [[UX - 0.62, UZ - 0.3], [UX - 0.2, UZ - 0.72], [UX + 0.25, UZ - 0.7], [UX + 0.66, UZ - 0.28]];
    const PER = 0.92, U = X.urna({ x: UX, z: UZ, nivel: 0.12 + 0.18 * tramo(t, e.ini, e.fin) });
    const turno = (j) => { const t0 = e.ini + 0.15 + j * PER / 4, c = Math.floor((t - t0) / PER); return { c, f: ((t - t0) % PER + PER) % PER / PER, t0 }; };
    directo = (i) => { if (i >= VOT.length) return fuera; const v = VOT[i], T_ = turno(i), rojo = ((T_.c + i) % 2 + 2) % 2 === 0;
      const lanza = Math.sin(Math.PI * tramo(T_.f, 0.05, 0.45));
      return { x: v[0], z: v[1], rot: Math.atan2(UX - v[0], UZ - v[1]), amp: 0, brazos: 0.35 * lanza, color: rojo ? '#f87171' : '#2dd4bf', cq: 0.85, brillo: 0.3 }; };
    VOT.forEach((v, j) => { const T_ = turno(j); if (t < T_.t0 || T_.f > 0.62) return; const w = tramo(T_.f, 0.18, 0.62);
      if (w <= 0) return; const R = U.ranura;
      X.papeleta({ x: v[0] + (R[0] - v[0]) * w, y: 1.45 * (1 - w) + R[1] * w + 0.45 * Math.sin(Math.PI * w), z: v[1] + (R[2] - v[1]) * w, rx: 0.4, ry: w * 6, rz: 0.3 * w }); });
    X.dial({ x: UX, y: 2.12, z: UZ - 1.25, esc: 1.15, ang: 0.75 * Math.sin(t * 6.1) * Math.cos(t * 2.3) + 0.35 * Math.sin(t * 13.7), color: ROJ });
    // Weighing: blocks come down one by one; the pointer swings and settles on {ding}.
    const NB = 7, tB = (j) => e.ini + 0.2 + (m1 - 0.35 - (e.ini + 0.2)) * j / (NB - 1);
    let n = 0, osc = 0; for (let j = 0; j < NB; j++) { const t0 = tB(j); n += tramo(t, t0, t0 + 0.35); const dt = t - (t0 + 0.35); if (dt > 0 && j < NB - 1) osc += Math.exp(-dt * 1.5) * Math.sin(dt * 11) * 0.3; }
    const quieta = q(m1, 0.5), ultimo = t - (tB(NB - 1) + 0.35);
    const fin = ultimo > 0 ? Math.exp(-ultimo * 6) * Math.sin(ultimo * 16) * 0.2 : 0;
    X.balanza({ x: BX, z: BZ, esc: 0.56, ry: -0.8, n, cae: 2.0, incl: 0.85 + osc * (1 - quieta) + fin });
    camLerp([0, 2.05, 8.9, 0, 1.05, -0.4], [0, 1.85, 7.9, 0, 1.05, -0.4], p);   // straight push-in (the split screen stays on the centre line)
  } else {
    const m0 = mk(0, 1.8), m1 = mk(1, 3.6);
    const CHX = -0.85, CHY = 1.3, CHZ = -3.4, vals = VR(0.2, 36);
    X.grafica({ x: CHX, y: CHY, z: CHZ, ancho: 3.0, alto: 1.6, vals, color: () => BLANCO, tablero: 1 });
    // The crowd sways with the last value of the chart (each one a little late); the hero doesn't move.
    const CROWD = [[-2.05, -1.55], [-1.2, -1.6], [-0.35, -1.5], [0.45, -1.62], [-1.65, -0.85], [-0.8, -0.9], [0.05, -0.82], [-1.25, -0.15], [-0.4, -0.2]];
    const fuerza = 0.1 + 0.08 * q(m1 - 0.1, 0.5);
    directo = (i) => i < CROWD.length ? Object.assign({ x: CROWD[i][0], z: CROWD[i][1], rot: Math.PI + 0.12 * Math.sin(i * 2.1), amp: 0 }, blanco) : fuera;
    despues.push(() => CROWD.forEach((_, i) => { const d = ruido(35 - i * 0.6, 0.2) - 0.55; W.gente[i].g.rotation.z = fuerza * d / 0.2 * 1.4; }));
    // Balance, hero and camera shifted so the right pan stays left of x≈900 px (Instagram's buttons start at x≈940).
    X.balanza({ x: 1.1, z: -0.45, esc: 0.6, n: 7, incl: 0.85 });
    W.heroe({ x: 0.55, z: 0.55, gira: -0.25, luz: 1 });
    W.camara(...orbita(mezcla([0.3, 3.0, 10.6, 0.25, 1.9, -1.2], [0.3, 3.6, 12.2, 0.25, 1.92, -1.2], p), 0.1 - 0.2 * p));   // crane up and pull back, orbiting
  }
  W.multitud(t, { directo });
  despues.forEach(f => f());
};

const pildoras = {
  'en-debunk-psychology': pildora3d({
    slug: 'en-debunk-psychology', cuenta: 'en',
    T: { en: { titulo: 'Are stock prices just psychology? Half true.', guion: GUION } },
    fijo: () => `<div class="hud i fmt">MONEY, EXPLAINED</div><div class="hud d"><i></i><span id="reloj">00:00</span></div>`,
    cssExtra: CSS, scriptExtra: SCRIPT,
    escenas: ESCENAS, tres: TRES,
    // Short tail after the last line; the 2D layer of each scene leaves on the same frame as the hard cut of the 3D.
    cola: 0.9, corte2d: 'seco',
    texto: { en: TEXTO }
  })
};

module.exports = { pildoras };
