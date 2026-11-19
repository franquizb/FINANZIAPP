// Series «30 days to get your money in order» · @finanziapp (US), in 3D (reels-voz/tres.js), narrator voice.
// Same choreography as the Spanish series (reto-es.js): the 3D function and the scene timings are shared; the script is
// written for a US audience (paycheck, purchases), not translated. Grey mannequins = your money going its own way;
// what you control lights up. Zone names (NEEDS / WANTS / SAVINGS) come from tres.js according to the language.
// Day 1: no external data (it's a method: write down every purchase for 7 days and label it).
//
// Day 3 (en-reto-03) · «These $150 sneakers don't cost $150. They cost six and a half hours.» Final, verified script:
// guiones/2026-11-en-reto-03.md (hook, scenes, cuadra(), post text, cover). No series card, no «Follow», no «Day 4 tomorrow»:
// it cuts on the number (6.5 HOURS on the clock). Sources (checked 18 Nov 2026, as given in the script):
// - BLS, Usual Weekly Earnings of Wage and Salary Workers, Third Quarter 2026 (USDL-26-1604, 21 Oct 2026): median usual weekly
//   earnings of full-time wage and salary workers $1,232 (not seasonally adjusted), «before taxes and other deductions»;
//   full time = usually 35 h or more. https://www.bls.gov/news.release/wkyeng.nr0.htm · https://www.bls.gov/news.release/wkyeng.tn.htm
//   Confirmed with FRED, series LEU0252881500Q (2026-07-01 = 1232). https://fred.stlouisfed.org/series/LEU0252881500Q
// - Census Bureau, Commuting at a glance, ACS 2025 1-year (table S0801): mean one-way travel time 27.4 min (workers who did not
//   work at home, per the ACS subject definitions). https://www.census.gov/topics/employment/commuting/guidance/acs-1yr.html
// - IRS Rev. Proc. 2025-32, §.14 and table 3: 2026 standard deduction (single) $16,100; brackets 10 % to $12,400, $1,240 + 12 %
//   to $50,400. https://www.irs.gov/pub/irs-drop/rp-25-32.pdf
// - IRS Topic No. 751 (updated 9 Nov 2026): Social Security 6.2 % up to $184,500 (2026), Medicare 1.45 %, Additional Medicare
//   0.9 % above $200,000. https://www.irs.gov/taxtopics/tc751
// Example assumptions (not statistics; said on screen and in the post): single filer, standard deduction, 40 h/week, 5 days,
// 52 weeks, no 401(k) or health deductions, no state or local income tax. The $150 sneakers are an example, no brand.
// Compared with the script, only § marks were added or given a sound (they are not read and don't change the voice takes):
// line 6 «§{whoosh}Those sneakers?» (the cut back to the frame-0 framing). Voice: VOZ_NARRADOR.en (same voice and prompt),
// with less speed-up (tempo, see VOZ_R3) so it lands in 2.6–3 words/s, as the script asks.
const { pildora3d, hud, finSerie } = require('./tres');
const { pildoras: ES } = require('./reto-es');
const { cuadra } = require('../reels/_comun');
const { VOZ_NARRADOR } = require('./_comun');

// ——— en-reto-03 · all the checks in the script (guiones/2026-11-en-reto-03.md, «Cuentas») ———
const R0 = x => Math.round(x), R1 = x => Math.round(x * 10) / 10, R2 = x => Math.round(x * 100) / 100;
const SEMANA = 1232;          // BLS, Usual Weekly Earnings, Q3 2026: median weekly, full time (not seasonally adjusted)
const IDA = 27.4;             // Census Bureau, ACS 2025 1-year: mean one-way commute (min), workers who don't work at home
const DEDUCCION = 16100;      // IRS Rev. Proc. 2025-32, §.14: 2026 standard deduction, single
const SS = 0.062, MEDICARE = 0.0145, BASE_SS = 184500;   // IRS Topic No. 751 (2026)
const HORAS = 40, DIAS = 5, PRECIO = 150;                // example assumptions
const federal = (b) => b <= 12400 ? 0.10 * b : b <= 50400 ? 1240 + 0.12 * (b - 12400) : b <= 105700 ? 5800 + 0.22 * (b - 50400) : NaN;
const ANUAL = SEMANA * 52;
cuadra('bruto anual', ANUAL, 64064);
const BASE = ANUAL - DEDUCCION;
cuadra('base imponible federal', BASE, 47964);
cuadra('tramo: dentro del 12 %', BASE > 12400 && BASE <= 50400, true);
const FED = R2(federal(BASE));
cuadra('impuesto federal', FED, 5507.68);
cuadra('salario por debajo de la base de SS', ANUAL < BASE_SS, true);
cuadra('sin Additional Medicare Tax', ANUAL <= 200000, true);
const FICA = R2(ANUAL * (SS + MEDICARE));
cuadra('FICA 7,65 %', FICA, 4900.9);
const NETO = R2(ANUAL - FED - FICA);
cuadra('neto anual', NETO, 53655.42);
const NETO_SEM = R2(NETO / 52);
cuadra('neto semanal (pantalla $1,032)', R0(NETO_SEM), 1032);
cuadra('neto semanal exacto', NETO_SEM, 1031.84);
const PCT_IMP = R1((FED + FICA) / ANUAL * 100);
cuadra('impuestos sobre el bruto %', PCT_IMP, 16.2);
cuadra('«about a sixth» (1/6 = 16,7 %)', Math.abs(PCT_IMP - 100 / 6) < 1, true);
cuadra('pantalla: −16 %', R0((FED + FICA) / ANUAL * 100), 16);
const HORA_RECIBO = R2(SEMANA / HORAS);
cuadra('hora del recibo $30.80', HORA_RECIBO, 30.8);
cuadra('«about $31 an hour»', R0(HORA_RECIBO), 31);
cuadra('$150 a la hora del recibo ≈ 4,9 h («why not five?»)', R1(PRECIO / HORA_RECIBO), 4.9);
cuadra('redondeado: 5 h', R0(PRECIO / HORA_RECIBO), 5);
const MIN_SEM = IDA * 2 * DIAS;
cuadra('desplazamiento semanal (min)', R1(MIN_SEM), 274);
cuadra('pantalla: 4 h 34 min', `${Math.floor(MIN_SEM / 60)} h ${R0(MIN_SEM % 60)} min`, '4 h 34 min');
cuadra('«four and a half unpaid hours»', Math.round(MIN_SEM / 60 * 2) / 2, 4.5);
cuadra('pantalla: 27.4 MIN EACH WAY', IDA, 27.4);
const HORAS_REALES = HORAS + MIN_SEM / 60;
cuadra('horas reales por semana', R2(HORAS_REALES), 44.57);
cuadra('pantalla: 44 h 34 min', `${Math.floor(HORAS_REALES)} h ${R0((HORAS_REALES % 1) * 60)} min`, '44 h 34 min');
const HORA_REAL = NETO_SEM / HORAS_REALES;
cuadra('hora real (pantalla $23.15)', R2(HORA_REAL), 23.15);
cuadra('«about $23»', R0(HORA_REAL), 23);
cuadra('«a quarter less» (−24,8 %)', R1((1 - HORA_REAL / HORA_RECIBO) * 100), 24.8);
cuadra('pantalla: −25 %', R0((1 - HORA_REAL / HORA_RECIBO) * 100), 25);
cuadra('$150 ÷ $23.15 = 6,5 h', R1(PRECIO / HORA_REAL), 6.5);
cuadra('con $23 redondeado también 6,5', R1(PRECIO / 23), 6.5);
cuadra('6,5 h = 6 h 29 min (pantalla «6.5 HOURS»)', `${Math.floor(PRECIO / HORA_REAL)} h ${R0((PRECIO / HORA_REAL % 1) * 60)} min`, '6 h 29 min');
cuadra('sector del reloj: 6,5/12 de vuelta (grados)', 6.5 / 12 * 360, 195);
cuadra('44 maniquíes = 40 + 4', 40 + 4, 44);
cuadra('gancho: 6 maniquíes + medio = 6,5 h', 6 + 0.5, R1(PRECIO / HORA_REAL));
cuadra('5 HRS?: 5 maniquíes ámbar', R0(PRECIO / HORA_RECIBO), 5);
cuadra('−25 %: 10 de 40 se apagan', 40 * 0.25, 10);
// On-screen strings, from the checks above.
const usd = (n, d = 0) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
const P3 = {
  precio: usd(PRECIO), horas: R1(PRECIO / HORA_REAL).toFixed(1), horasRecibo: R1(PRECIO / HORA_RECIBO).toFixed(1),
  semana: usd(SEMANA), recibo: usd(HORA_RECIBO, 2), neto: usd(R0(NETO_SEM)), real: usd(R2(HORA_REAL), 2),
  imp: R0((FED + FICA) / ANUAL * 100), ida: IDA.toFixed(1), commute: `${Math.floor(MIN_SEM / 60)} h ${R0(MIN_SEM % 60)} min`,
  semanaReal: `${Math.floor(HORAS_REALES)} h ${R0((HORAS_REALES % 1) * 60)} min`, menos: R0((1 - HORA_REAL / HORA_RECIBO) * 100),
  cinco: R0(PRECIO / HORA_RECIBO)
};
cuadra('pantalla: textos', [P3.precio, P3.horas, P3.horasRecibo, P3.semana, P3.recibo, P3.neto, P3.real, P3.imp, P3.menos].join(' '),
  '$150 6.5 4.9 $1,232 $30.80 $1,032 $23.15 16 25');
// Narrator voice, slower: same voice (Iapetus) and prompt as VOZ_NARRADOR.en; only the speed-up after synthesis changes.
const VOZ_R3 = { en: { ...VOZ_NARRADOR.en, tempo: 1.0 } };

const SERIE = '30 DAYS TO GET YOUR MONEY IN ORDER', TOTAL = 30, SIGUE = '<b>Follow</b> so you don’t miss a day';

// ——— en-reto-03 · 2D layers ———
const MONO3 = `'DejaVu Sans Mono', 'Liberation Mono', monospace`;
const CSS_R3 = `
  .tit0 { position: absolute; left: 540px; top: 486px; white-space: nowrap; font-size: 76px; line-height: 1.05; font-weight: 900; letter-spacing: -.02em;
    color: #fff; background: rgba(9,14,27,.92); border: 3px solid rgba(148,163,184,.55); border-radius: 22px; padding: 10px 30px 14px; opacity: 0; }
  .tit0 b { color: #f87171; font-weight: 900; }
  .tit0.b2 { border-color: rgba(248,113,113,.8); box-shadow: 0 0 44px rgba(248,113,113,.35); }
  .cont0 { position: absolute; left: 540px; top: 1236px; background: rgba(9,14,27,.9); border: 3px solid rgba(248,113,113,.55); border-radius: 22px;
    padding: 12px 36px 14px; text-align: center; opacity: 0; white-space: nowrap; }
  .cont0 small { display: block; font: 700 22px/1.3 ${MONO3}; letter-spacing: .16em; color: #fca5a5; }
  .cont0 b { display: block; font-size: 96px; line-height: 1.02; font-weight: 900; letter-spacing: -.03em; color: #f87171; font-variant-numeric: tabular-nums; }
  .cont0 i { display: block; font: 600 22px/1.3 ${MONO3}; font-style: normal; color: #94a3b8; opacity: 0; }
  .tj { position: absolute; left: 50%; background: rgba(9,14,27,.92); border: 2px solid rgba(148,163,184,.34); border-radius: 24px;
    padding: 12px 34px 16px; text-align: center; opacity: 0; white-space: nowrap; }
  .tj small { display: block; font: 700 22px/1.35 ${MONO3}; letter-spacing: .14em; color: #94a3b8; margin-bottom: 4px; }
  .tj .l { display: block; font-size: 50px; line-height: 1.16; font-weight: 850; letter-spacing: -.015em; color: #fff; font-variant-numeric: tabular-nums; }
  .tj .l.p { font-size: 30px; font-weight: 750; color: #cbd5e1; }
  .tj .t { color: #5eead4; } .tj .r { color: #f87171; } .tj .a { color: #f5b94a; } .tj .g { color: #94a3b8; }
  .tj.turq { border-color: rgba(94,234,212,.65); } .tj.amb { border-color: rgba(245,185,74,.7); } .tj.roja { border-color: rgba(248,113,113,.65); }
  .fuente { position: absolute; left: 470px; transform: translateX(-50%); bottom: 420px; text-align: center; font: 600 21px/1.35 ${MONO3};
    color: #b6c2d4; white-space: nowrap; background: rgba(7,11,22,.82); border-radius: 10px; padding: 5px 14px; }
  .chip3 { position: absolute; left: 0; top: 0; font-size: 46px; font-weight: 900; color: #e2e8f0; background: rgba(9,14,27,.92); border: 3px solid #94a3b8;
    border-radius: 18px; padding: 6px 22px 9px; white-space: nowrap; letter-spacing: -.01em; opacity: 0; font-variant-numeric: tabular-nums; }
  .chip3.turq { border-color: #5eead4; color: #5eead4; } .chip3.amb { border-color: #f5b94a; color: #f5b94a; }
  .chip3 .tacha { position: absolute; left: 12px; right: 12px; top: 50%; height: 8px; border-radius: 4px; background: #f87171; box-shadow: 0 0 14px rgba(248,113,113,.7);
    transform: scaleX(0) rotate(-6deg); transform-origin: 0 50%; }
  /* scene 3: the weekly pay bar loses its red sixth */
  .nomina { position: absolute; left: 70px; width: 860px; top: 486px; box-sizing: border-box; background: rgba(9,14,27,.92); border: 2px solid rgba(148,163,184,.34);
    border-radius: 24px; padding: 12px 26px 14px; opacity: 0; text-align: center; }
  .nomina small { display: block; font: 700 22px/1.35 ${MONO3}; letter-spacing: .12em; color: #94a3b8; margin-bottom: 8px; }
  .nomina .b { position: relative; height: 78px; }
  .nomina .tq, .nomina .rj { position: absolute; top: 0; height: 78px; display: flex; align-items: center; justify-content: center; font-size: 46px; font-weight: 900; white-space: nowrap; }
  .nomina .tq { left: 0; width: 84%; background: #2dd4bf; color: #06201c; border-radius: 14px 0 0 14px; }
  .nomina .rj { left: 84%; width: 16%; background: #ef4444; color: #fff; border-radius: 0 14px 14px 0; font-size: 34px; }
  .nomina .tq span { position: absolute; }
  .nomina .ley { margin-top: 10px; font-size: 30px; font-weight: 750; color: #fca5a5; white-space: nowrap; }
  .nomina .ley span { color: #94a3b8; font: 600 23px/1.3 ${MONO3}; }
  /* scene 4: on paper vs real */
  .barras3 { position: absolute; left: 70px; width: 860px; top: 486px; box-sizing: border-box; background: rgba(9,14,27,.92); border: 2px solid rgba(148,163,184,.34);
    border-radius: 24px; padding: 16px 26px 18px; opacity: 0; }
  .barras3 .f { display: flex; align-items: center; gap: 18px; margin: 6px 0; }
  .barras3 .et { width: 190px; flex: none; text-align: right; font: 700 25px/1.2 ${MONO3}; letter-spacing: .08em; color: #94a3b8; }
  .barras3 .et.t { color: #5eead4; }
  .barras3 .b { height: 64px; border-radius: 12px; display: flex; align-items: center; padding-left: 18px; box-sizing: border-box; font-size: 40px; font-weight: 900; white-space: nowrap; }
  .barras3 .b.g { width: 560px; background: #475569; color: #e2e8f0; } .barras3 .b.t { width: 560px; background: #2dd4bf; color: #06201c; }
  .sello3 { position: absolute; right: 26px; top: -34px; border: 7px solid #f5b94a; color: #f5b94a; background: rgba(9,14,27,.95); border-radius: 18px;
    padding: 4px 22px 8px; font-size: 64px; line-height: 1; font-weight: 900; opacity: 0; box-shadow: 0 0 40px rgba(245,185,74,.35); }
  .rot3 { position: absolute; left: 50%; padding: 12px 30px 14px; border-radius: 16px; background: #2dd4bf; color: #06121a; font-size: 46px; font-weight: 900;
    letter-spacing: -.01em; opacity: 0; white-space: nowrap; }
  .lista3 { position: absolute; left: 50%; background: rgba(9,14,27,.9); border: 2px solid rgba(94,234,212,.5); border-radius: 18px; padding: 10px 26px 12px;
    font-size: 34px; font-weight: 800; color: #e2e8f0; white-space: nowrap; opacity: 0; }
  .lista3 b { color: #5eead4; }
`;
const fuente3 = (txt) => `<div class="fuente">${txt}</div>`;

// ——— en-reto-03 · 3D objects added to tres.js: the price tag that turns into a clock (with its eyelet and string), a red ring
// flash, the dashed floor slot for the unpaid commute hours, the dashed commute path and a turquoise floor ring. Everything is
// switched off at the start of each frame (W.X3R.apagar()).
const SCRIPT_R3 = `
const R3V = ${JSON.stringify({ H: +P3.horas, H5: +P3.horasRecibo, recibo: P3.recibo + '/h', real: P3.real + '/h', commute: '+' + P3.commute + ' UNPAID', cinco: P3.cinco + ' HRS?' })};
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
// The two hook headlines: «$150 SNEAKERS» until the tag flips, then «$150 = 6.5 HOURS» (with a pop). a = when the 1st appears
// (−1 = already on frame 0), b = when it swaps (seconds of the scene).
function titulares(el, s, a, b) {
  const [t1, t2] = el.querySelectorAll('.tit0');
  const p1 = a < 0 ? 1 : rebote(tramo(s, a - 0.08, a + 0.22)), p2 = rebote(tramo(s, b - 0.04, b + 0.24));
  t1.style.opacity = s < b - 0.04 ? Math.min(1, p1 * 1.5) : 0; t1.style.transform = 'translateX(-50%) scale(' + (0.75 + 0.25 * p1) + ')';
  t2.style.opacity = s >= b - 0.04 ? Math.min(1, p2 * 1.6) : 0; t2.style.transform = 'translateX(-50%) scale(' + (0.7 + 0.3 * p2) + ')';
}
const X3R = (() => {
  const W = W3, T = W.T, S = W.S, objs = [];
  const grupo = () => { const g = new T.Group(); g.visible = false; S.add(g); objs.push(g); return g; };
  const lienzo = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const tx = new T.CanvasTexture(c); tx.encoding = T.sRGBEncoding; tx.anisotropy = 4; return { c, x: c.getContext('2d'), tx }; };
  // ——— price tag (1.5 × 0.85 m, pointed end with a real hole). Front: «$150». Back: a clock whose red sector fills up. ———
  const TW = 1.5, TH = 0.85, PU = 0.32, GR = 0.04, HX = TW / 2 - 0.2, HR = 0.06;
  const forma = (sx) => { const s = new T.Shape();
    s.moveTo(sx * (-TW / 2 + PU), TH / 2); s.lineTo(sx * TW / 2, TH / 2); s.lineTo(sx * TW / 2, -TH / 2); s.lineTo(sx * (-TW / 2 + PU), -TH / 2); s.lineTo(sx * -TW / 2, 0); s.closePath();
    const h = new T.Path(); h.absarc(sx * -HX, 0, HR, 0, Math.PI * 2, true); s.holes.push(h); return s; };
  const uvs = (g) => { const p = g.attributes.position, uv = g.attributes.uv; for (let i = 0; i < p.count; i++) uv.setXY(i, (p.getX(i) + TW / 2) / TW, (p.getY(i) + TH / 2) / TH); uv.needsUpdate = true; return g; };
  const CW = 1024, CH = Math.round(1024 * TH / TW), px = (x) => (x + TW / 2) / TW * CW, py = (y) => (TH / 2 - y) / TH * CH;
  const fr = lienzo(CW, CH), dt = lienzo(CW, CH);
  const ojal = (x, cx) => { x.strokeStyle = '#94a3b8'; x.lineWidth = 16; x.beginPath(); x.arc(cx, CH / 2, HR / TW * CW + 10, 0, 7); x.stroke(); };
  (() => { const x = fr.x; x.fillStyle = '#f8fafc'; x.fillRect(0, 0, CW, CH);
    x.setLineDash([22, 14]); x.strokeStyle = '#cbd5e1'; x.lineWidth = 6; x.beginPath();
    x.moveTo(px(-TW / 2 + PU + 0.03), py(TH / 2 - 0.05)); x.lineTo(px(TW / 2 - 0.05), py(TH / 2 - 0.05)); x.lineTo(px(TW / 2 - 0.05), py(-TH / 2 + 0.05));
    x.lineTo(px(-TW / 2 + PU + 0.03), py(-TH / 2 + 0.05)); x.lineTo(px(-TW / 2 + 0.09), py(0)); x.closePath(); x.stroke(); x.setLineDash([]);
    ojal(x, px(-HX));
    x.fillStyle = '#ef4444'; x.font = '900 290px Inter, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('$150', px(0.17), py(0.02));
    fr.tx.needsUpdate = true; })();
  let claveR = null;
  function pintaReloj(h, preg) {
    const clave = h.toFixed(1) + (preg ? '?' : ''); if (clave === claveR) return; claveR = clave;
    const x = dt.x, cx = 404, cy = CH / 2, R = 240;
    x.fillStyle = '#0b1222'; x.fillRect(0, 0, CW, CH);
    x.fillStyle = '#16213b'; x.beginPath(); x.arc(cx, cy, R, 0, 7); x.fill();
    if (h > 0.01) { x.fillStyle = preg ? '#f5b94a' : '#ef4444'; x.beginPath(); x.moveTo(cx, cy); x.arc(cx, cy, R - 14, -Math.PI / 2, -Math.PI / 2 + h / 12 * 2 * Math.PI); x.closePath(); x.fill(); }
    x.strokeStyle = '#e2e8f0'; x.lineWidth = 12; x.beginPath(); x.arc(cx, cy, R, 0, 7); x.stroke();
    for (let j = 0; j < 12; j++) { const a = j / 12 * 2 * Math.PI; x.strokeStyle = '#e2e8f0'; x.lineWidth = j % 3 ? 7 : 13; x.beginPath();
      x.moveTo(cx + Math.sin(a) * (R - 10), cy - Math.cos(a) * (R - 10)); x.lineTo(cx + Math.sin(a) * (R - (j % 3 ? 38 : 50)), cy - Math.cos(a) * (R - (j % 3 ? 38 : 50))); x.stroke(); }
    x.fillStyle = '#0b1222'; x.beginPath(); x.arc(cx, cy, 142, 0, 7); x.fill();
    x.fillStyle = '#ffffff'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = '900 ' + (preg ? 104 : 124) + 'px Inter, sans-serif';
    x.fillText(h.toFixed(1) + (preg ? '?' : ''), cx, cy - 16);
    x.fillStyle = preg ? '#f5b94a' : '#f87171'; x.font = '800 42px Inter, sans-serif'; x.fillText('HOURS', cx, cy + 64);
    ojal(x, px(HX));
    dt.tx.needsUpdate = true;
  }
  const mFr = new T.MeshBasicMaterial({ map: fr.tx, toneMapped: false, transparent: true }), mDt = new T.MeshBasicMaterial({ map: dt.tx, toneMapped: false, transparent: true });
  const mCanto = new T.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.5, transparent: true }), mMet = new T.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.6, roughness: 0.3, transparent: true });
  const etG = grupo();
  const caraF = new T.Mesh(uvs(new T.ShapeGeometry(forma(1), 12)), mFr); caraF.position.z = GR / 2 + 0.002; caraF.castShadow = true; etG.add(caraF);
  const caraD = new T.Mesh(uvs(new T.ShapeGeometry(forma(-1), 12)), mDt); caraD.rotation.y = Math.PI; caraD.position.z = -GR / 2 - 0.002; caraD.castShadow = true; etG.add(caraD);
  const canto = new T.Mesh(new T.ExtrudeGeometry(forma(1), { depth: GR, bevelEnabled: false, curveSegments: 12 }), [new T.MeshBasicMaterial({ visible: false }), mCanto]);
  canto.position.z = -GR / 2; etG.add(canto);
  [1, -1].forEach(sz => { const o = new T.Mesh(new T.TorusGeometry(HR + 0.014, 0.014, 8, 24), mMet); o.position.set(-HX, 0, sz * (GR / 2 + 0.006)); etG.add(o); });
  const cordel = new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3([new T.Vector3(-HX, 0, 0), new T.Vector3(-0.86, -0.1, 0.03), new T.Vector3(-1.0, -0.34, 0.02), new T.Vector3(-0.96, -0.6, 0)]), 24, 0.013, 6), mMet);
  cordel.castShadow = true; etG.add(cordel);
  // o = { x, y, z, rx, ry, rz, esc, horas, preg, op, cordel }
  function etiqueta(o) {
    etG.visible = true; etG.position.set(o.x, o.y, o.z); etG.rotation.set(o.rx || 0, o.ry || 0, o.rz || 0); etG.scale.setScalar(Math.max(0.001, o.esc == null ? 1 : o.esc));
    pintaReloj(Math.max(0, Math.min(12, o.horas || 0)), !!o.preg);
    const op = o.op == null ? 1 : o.op; [mFr, mDt, mCanto, mMet].forEach(m => { m.opacity = op; m.depthWrite = op > 0.99; });
    cordel.visible = o.cordel !== false;
  }
  // ——— ring flash (additive sprite) ———
  const an = lienzo(256, 256); { const x = an.x, g = x.createRadialGradient(128, 128, 30, 128, 128, 128); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.6, 'rgba(255,255,255,0)');
    g.addColorStop(0.8, 'rgba(255,255,255,1)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 256, 256); an.tx.needsUpdate = true; }
  const flashes = Array.from({ length: 4 }, () => { const sp = new T.Sprite(new T.SpriteMaterial({ map: an.tx, color: 0xf87171, blending: T.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0 })); sp.visible = false; S.add(sp); return sp; });
  let nf = 0;
  // p 0..1: the ring grows from esc0 to esc1 and fades out
  function destello(x, y, z, p, esc0, esc1, color) { if (p <= 0 || p >= 1) return; const sp = flashes[nf++]; if (!sp) return; sp.visible = true; sp.position.set(x, y, z);
    sp.scale.setScalar(esc0 + (esc1 - esc0) * sale(p)); sp.material.opacity = 0.95 * (1 - p); sp.material.color.set(color || 0xf87171); }
  // ——— dashed floor slot (amber) ———
  const hl = lienzo(256, 768); { const x = hl.x; x.fillStyle = 'rgba(245,185,74,.13)'; x.beginPath(); x.roundRect(10, 10, 236, 748, 30); x.fill();
    x.setLineDash([34, 22]); x.strokeStyle = '#f5b94a'; x.lineWidth = 12; x.beginPath(); x.roundRect(10, 10, 236, 748, 30); x.stroke(); hl.tx.needsUpdate = true; }
  const huecoM = new T.Mesh(new T.PlaneGeometry(1, 1), new T.MeshBasicMaterial({ map: hl.tx, transparent: true, depthWrite: false, toneMapped: false }));
  huecoM.rotation.x = -Math.PI / 2; huecoM.visible = false; S.add(huecoM);
  function hueco(o) { huecoM.visible = (o.op == null ? 1 : o.op) > 0.01; huecoM.position.set(o.x, 0.016, o.z); huecoM.scale.set(o.w, o.d, 1); huecoM.material.opacity = o.op == null ? 1 : o.op; }
  // ——— dashed path on the floor (amber), from (x0, z0) to (x1, z1); q 0..1 draws it from the start ———
  const cl = lienzo(128, 32); { const x = cl.x; x.fillStyle = '#f5b94a'; x.fillRect(0, 6, 76, 20); cl.tx.needsUpdate = true; } cl.tx.wrapS = T.RepeatWrapping;
  const caminoM = new T.Mesh(new T.PlaneGeometry(1, 1), new T.MeshBasicMaterial({ map: cl.tx, transparent: true, depthWrite: false, toneMapped: false }));
  caminoM.visible = false; S.add(caminoM);
  function camino(o) { const q = o.q == null ? 1 : o.q; if (q < 0.01) return; const L = Math.hypot(o.x1 - o.x0, o.z1 - o.z0) * q;
    caminoM.visible = true; caminoM.position.set(o.x0 + (o.x1 - o.x0) * q / 2, 0.018, o.z0 + (o.z1 - o.z0) * q / 2);
    caminoM.rotation.set(-Math.PI / 2, 0, -Math.atan2(o.z1 - o.z0, o.x1 - o.x0)); caminoM.scale.set(L, o.ancho || 0.16, 1);
    cl.tx.repeat.set(L / 0.55, 1); caminoM.material.opacity = o.op == null ? 1 : o.op; }
  // ——— turquoise ring on the floor ———
  const aroM = new T.Mesh(new T.PlaneGeometry(1, 1), new T.MeshBasicMaterial({ map: an.tx, color: 0x2dd4bf, blending: T.AdditiveBlending, transparent: true, depthWrite: false }));
  aroM.rotation.x = -Math.PI / 2; aroM.visible = false; S.add(aroM);
  function aro(o) { aroM.visible = (o.op || 0) > 0.01; aroM.position.set(o.x, 0.02, o.z); aroM.scale.set(o.r * 2.5, o.r * 2.5, 1); aroM.material.opacity = o.op || 0; }
  // The lit hero's point light and glow sprite (tres.js) tint the whole block cyan when the camera is close: damp them after W.heroe.
  const luzH0 = S.children.find(o => o.isPointLight && o.distance === 11), aura0 = S.children.find(o => o.isSprite && Math.abs(o.scale.x - 5.2) < 0.01);
  function suaviza(fl, fa) { if (luzH0) luzH0.intensity *= fl; if (aura0) aura0.material.opacity *= fa; }
  function apagar() { objs.forEach(g => { g.visible = false; }); flashes.forEach(f => { f.visible = false; }); nf = 0; huecoM.visible = false; caminoM.visible = false; aroM.visible = false; }
  return { etiqueta, destello, hueco, camino, aro, suaviza, apagar };
})();
W3.X3R = X3R;
`;

// ——— en-reto-03 · 2D layer of each scene ———
const tit0 = (m1, m2) => `<div class="tit0" data-a="${m1}">${P3.precio} SNEAKERS</div><div class="tit0 b2" data-a="${m2}">${P3.precio} = <b>${P3.horas} HOURS</b></div>`;
const ESC_R3 = [
  // 0 · Hook (visual, by absolute time): the giant $150 tag is already falling and spinning onto the box on frame 0; it lands
  //     (0.5 s), flips (0.65 s) and the back is a clock whose red sector fills to 6.5 HOURS. Red mannequins (your hours) jump out
  //     of the box from 0.95 s and run in single file through the red door; the counter goes 1 → 6, then 6.5 with the half one.
  { html: () => `${tit0(-1, 0.77)}<div class="cont0"><small>HOURS OF WORK</small><b>0</b><i>typical full-time worker</i></div>`,
    anim: function (s, e, el) {
      titulares(el, s, -1, 0.77);
      // crossings of the door: tc(i) = 0.95 + 0.48 i + 0.35 + LS / 2.4 (same numbers as the 3D function)
      const LS = Math.hypot(2.9, -3.2) - 0.75, tc = (i) => 0.95 + 0.48 * i + 0.35 + LS / 2.4;
      let n = 0; for (let i = 0; i < 7; i++) if (s >= tc(i)) n = i < 6 ? i + 1 : 6.5;
      const c = el.querySelector('.cont0'), p = rebote(tramo(s, tc(0) - 0.12, tc(0) + 0.2));
      c.style.opacity = Math.min(1, p * 1.5);
      const golpe = Math.max(...[0, 1, 2, 3, 4, 5, 6].map(i => Math.exp(-Math.pow((s - tc(i) - 0.06) / 0.09, 2))));
      c.style.transform = 'translateX(-50%) scale(' + (0.75 + 0.25 * p + 0.1 * golpe) + ')';
      c.querySelector('b').textContent = n === 6.5 ? '6.5' : String(n);
      c.querySelector('i').style.opacity = tramo(s, tc(6) + 0.25, tc(6) + 0.6);
    } },
  // 1 · The week: 40 grey mannequins (your paid hours) walk in and form an 8 × 5 block; to the right, an empty dashed amber slot «?».
  { html: () => `<div class="tj" data-t="translateX(-50%)" data-m="-1" style="top:486px"><small>YOUR REAL HOUR</small>
      <span class="l">Take-home pay</span><span class="l a" data-t="" data-m="0" style="opacity:0">÷ every hour work takes</span></div>`,
    anim: function (s, e, el) { aparecen(s, e, el); } },
  // 2 · Pay on paper: $30.80/h over the hero. «So why not five hours?»: the clock comes back and shrinks to 4.9?, five front-row
  //     mannequins light up amber with «5 HRS?».
  { html: () => `<div class="tj" data-t="translateX(-50%)" data-m="-1" data-hasta="1" style="top:486px"><small>MEDIAN FULL-TIME PAY (BEFORE TAXES)</small>
      <span class="l">${P3.semana}/week ÷ ${HORAS} h = <span class="t">${P3.recibo}</span></span></div>
      <div class="tj amb" data-t="translateX(-50%)" data-m="1" style="top:486px"><small>ON PAPER</small>
      <span class="l">${P3.precio} ÷ ${P3.recibo} ≈ <span class="a">${P3.cinco} h?</span></span></div>
      ${fuente3('BLS, Usual Weekly Earnings, Q3 2026<br>median, full-time workers, before taxes')}`,
    anim: function (s, e, el) { aparecen(s, e, el); } },
  // 3 · Federal tax + FICA take the red 16 % of the weekly pay bar (it falls off: $1,232 → $1,032). Then four amber mannequins
  //     walk in along a dashed path and fill the slot: +4 h 34 min UNPAID (27.4 min each way).
  { html: () => `<div class="nomina" data-t="" data-m="-1" data-hasta="1"><small>WEEKLY PAY, BEFORE TAXES: ${P3.semana}</small>
        <div class="b"><div class="tq"><span class="v1">${P3.semana}</span><span class="v2" style="opacity:0">${P3.neto}</span></div><div class="rj">−${P3.imp}%</div></div>
        <div class="ley">−${P3.imp}% federal tax + FICA <span>· state tax not included</span></div></div>
      <div class="tj amb" data-t="translateX(-50%)" data-m="1" style="top:486px"><small>AVERAGE COMMUTE</small>
        <span class="l"><span class="a">${P3.ida} min</span> each way</span></div>
      ${fuente3('Tax: IRS 2026, single, standard deduction<br>Commute: Census Bureau, ACS 2025 (mean one-way)')}`,
    anim: function (s, e, el) {
      aparecen(s, e, el);
      const M = e.seg.flatMap(g => g.marcas), m0 = M[0] != null ? M[0] : 0.1, u = tramo(s, m0 + 0.1, m0 + 0.75);
      const rj = el.querySelector('.nomina .rj');
      rj.style.transform = 'translate(' + (40 * u) + 'px,' + (520 * u * u) + 'px) rotate(' + (38 * u) + 'deg)'; rj.style.opacity = 1 - tramo(u, 0.6, 1);
      const tq = el.querySelector('.nomina .tq'), w = sale(tramo(s, m0 + 0.35, m0 + 0.7));
      tq.style.borderRadius = w > 0.5 ? '14px' : '14px 0 0 14px';
      tq.querySelector('.v1').style.opacity = 1 - w; tq.querySelector('.v2').style.opacity = w;
    } },
  // 4 · The hero lights up: $30.80/h is struck out and $23.15/h rises (2D chips pinned over his head from the 3D). Then the two bars
  //     and the amber −25 % stamp; a quarter of the block (10 mannequins) dims for a moment.
  { html: () => `<div class="tj turq" data-t="translateX(-50%)" data-m="-1" data-hasta="1" style="top:486px"><small>YOUR REAL HOUR</small>
        <span class="l">${P3.neto} ÷ ${P3.semanaReal} = <span class="t">${P3.real}</span></span></div>
      <div class="chip3 c1">${P3.recibo}/h<i class="tacha"></i></div><div class="chip3 turq c2">${P3.real}/h</div>
      <div class="barras3" data-t="" data-m="1"><div class="f"><span class="et">ON PAPER</span><div class="b g">${P3.recibo}</div></div>
        <div class="f"><span class="et t">REAL</span><div class="b t">${P3.real}</div></div><div class="sello3">−${P3.menos}%</div></div>
      ${fuente3(`${P3.neto} take-home ÷ (${HORAS} h + ${P3.commute} commute)<br>before state tax and payroll deductions`)}`,
    anim: function (s, e, el) {
      aparecen(s, e, el);
      const M = e.seg.flatMap(g => g.marcas), R = e.seg.flatMap(g => g.res), m0 = M[0] != null ? M[0] : 0.1, m1 = M[1] != null ? M[1] : 2.2;
      const r23 = R[0] ? R[0].ini : m0 + 1.2;
      const c1 = el.querySelector('.c1'), c2 = el.querySelector('.c2'), fuera = 1 - tramo(s, m1 - 0.25, m1);
      c1.style.opacity = Math.min(1, 1.5 * rebote(tramo(s, 0.05, 0.35))) * fuera;
      c1.querySelector('.tacha').style.transform = 'scaleX(' + sale(tramo(s, r23 - 0.35, r23 - 0.05)) + ') rotate(-6deg)';
      const p2 = rebote(tramo(s, r23 - 0.1, r23 + 0.25)); c2.style.opacity = Math.min(1, 1.5 * p2) * fuera;
      c2.dataset.p = p2;
      const b = el.querySelector('.barras3 .b.t'); b.style.width = (560 - 140 * sale(tramo(s, m1 + 0.15, m1 + 0.75))) + 'px';
      const st = el.querySelector('.sello3'), ps = tramo(s, m1 + 0.55, m1 + 0.75);
      st.style.opacity = Math.min(1, ps * 4); st.style.transform = 'rotate(' + (-8 + 12 * (1 - sale(ps))) + 'deg) scale(' + (2.2 - 1.2 * sale(ps)) + ')';
    } },
  // 5 · Skip it, invest it: the box with the tag sinks away; the six red hours turn turquoise and circle the hero (illustrative).
  { html: () => `<div class="rot3" data-t="translateX(-50%)" data-m="-1" style="top:500px">Skip it → invest it</div>
      <div class="lista3" data-t="translateX(-50%)" data-m="1" style="top:600px"><b>1.</b> Cash cushion · <b>2.</b> Long-term investing</div>
      ${fuente3('Illustrative. No guaranteed returns.')}`,
    anim: function (s, e, el) { aparecen(s, e, el); } },
  // 6 · Today's action; then «Those sneakers?»: cut back to the frame-0 framing, the tag falls again and on «Six and a half» it
  //     flips to the full clock. It cuts on the number.
  { html: () => `<div class="rot3" data-t="translateX(-50%)" data-m="-1" data-hasta="1" style="top:500px">Today: find your real hour</div>
      <div class="rot3" data-t="translateX(-50%)" data-m="0" data-hasta="1" style="top:604px">Price treats in hours</div>
      ${tit0(0, 0)}`,
    anim: function (s, e, el) {
      aparecen(s, e, el);
      const M = e.seg.flatMap(g => g.marcas), m1 = M[1] != null ? M[1] : 3.2, m2 = M[2] != null ? M[2] : 4.3;
      titulares(el, s, m1 + 0.05, m2 + 0.12);
    } }
];

// ——— en-reto-03 · 3D choreography ———
const TRES_R3 = function (t, k, s, e, W) {
  const X = W.X3R; X.apagar();
  const V = R3V, M = e.seg.flatMap(g => g.marcas), mk = (j, def) => e.ini + (M[j] != null ? M[j] : def);
  const q = (a, d) => sale(tramo(t, a, a + (d || 0.45)));
  const bote = (a, d) => rebote(tramo(t, a, a + (d || 0.35)));
  const suave = (x) => x * x * (3 - 2 * x);
  const mezcla = (P, Q, u) => P.map((v, j) => v + (Q[j] - v) * u);
  // Camera along keyframes [[time, [px, py, pz, lx, ly, lz]]…] (Hermite spline: it starts already moving and never stops in between).
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
  const orbita = (C, ang) => { const dx = C[0] - C[3], dz = C[2] - C[5], c = Math.cos(ang), s_ = Math.sin(ang); return [C[3] + dx * c + dz * s_, C[1], C[5] - dx * s_ + dz * c, C[3], C[4], C[5]]; };
  const cam = (C, sac) => { sac = sac || 0; W.camara(C[0] + sac * Math.sin(t * 61), C[1] + sac * Math.sin(t * 53 + 1), C[2], C[3], C[4] + 0.5 * sac * Math.sin(t * 47), C[5]); };
  const fuera = { x: -60, z: -60, esc: 0 }, despues = [];
  let directo = () => fuera;
  const ROJ = 0xef4444, AMB = 0xe2a336, TQ = 0x2dd4bf, cRoj = '#f87171', cAmb = '#f5b94a', cTq = '#5eead4', cBl = '#e2e8f0';
  // ——— hook world: box B with the shoebox, the tag resting on it, the red door DP, the path of the hours ———
  const B = [0, 1.5], YR = 1.175, DP = [2.9, -1.7], LT = Math.hypot(DP[0] - B[0], DP[1] - B[1]), U = [(DP[0] - B[0]) / LT, (DP[1] - B[1]) / LT];
  const ROT = Math.atan2(U[0], U[1]), B0 = [0.16, 1.2], S0 = [B[0] + U[0] * 0.75, B[1] + U[1] * 0.75], LS = LT - 0.75;
  const T0 = 0.95, DTH = 0.48, JS = 0.35, VEL = 2.4, tcruce = (i) => T0 + DTH * i + JS + LS / VEL;
  // Grey crowd: rows walking across far behind the door and two sidewalks on the sides (nobody crosses the path or the camera).
  const acera = (i, a) => {
    const g = i % 3, dir = i % 2 ? 1 : -1;
    if (g === 0) { const u = ((t * a.vel + a.u0) % 28 + 28) % 28 - 14, r = Math.floor(i / 3) % 3;
      return { x: dir * u, z: -6.6 - r * 1.0, rot: dir > 0 ? Math.PI / 2 : -Math.PI / 2, amp: 1, fase: t * a.vel * 4.5, esc: Math.min(1, (14 - Math.abs(u)) / 2) }; }
    const u = ((t * a.vel + a.u0) % 26 + 26) % 26 - 13;
    return { x: g === 1 ? -3.9 - (i % 4) * 0.8 : 7.8 + (i % 4) * 0.8, z: dir * u - 1, rot: dir > 0 ? 0 : Math.PI, amp: 1, fase: t * a.vel * 4.5, esc: Math.min(1, (13 - Math.abs(u)) / 2) };
  };
  // Hour i of the hook (0–5 full, 6 = the half hour): jumps out of the box, runs to the door and vanishes through it.
  const hora = (i, tt) => {
    const tp = T0 + DTH * i, e0 = i === 6 ? 0.46 : 0.82; if (tt < tp) return null;
    const u = tt - tp;
    if (u < JS) { const w = u / JS; return { x: B0[0] + (S0[0] - B0[0]) * w, z: B0[1] + (S0[1] - B0[1]) * w, y: 0.8 * Math.sin(Math.PI * w), rot: ROT, amp: 0.4, fase: u * 9,
      esc: e0 * (0.35 + 0.65 * sale(w)), color: ROJ, cq: 0.92, brillo: 0.25 }; }
    const d = (u - JS) * VEL, pas = d - LS;
    if (pas > 0.5) return null;
    return { x: S0[0] + U[0] * d, z: S0[1] + U[1] * d, y: 0, rot: ROT, amp: 1.2, fase: u * 11, esc: pas > 0 ? e0 * (1 - pas / 0.5) : e0, color: ROJ, cq: 0.92, brillo: 0.25 };
  };
  // The tag in the hook: falls spinning (lands at tl), bounces, flips at tf and the clock fills to 6.5 by tlleno.
  const caida = (tt, tl, tf, tlleno, ryFin) => {
    let y = YR, ry = 0, rz = 0, esc = 1;
    // falling: it flutters like a dropped card (the «$150» face always towards the camera and readable; the clock stays hidden)
    if (tt < tl) { const u = Math.max(0, (tt - (tl - 0.75)) / 0.75), k = (1 - u) / 0.667; y = YR + 1.45 * (1 - u * u);
      rz = 0.42 * Math.sin(9 * (tt - tl) + 2.3) * k; ry = 0.45 * Math.sin(12 * (tt - tl) + 1.1) * k; }
    else if (tt < tf) { const w = (tt - tl) / Math.max(0.01, tf - tl); esc = 1 + 0.07 * Math.sin(Math.PI * w); y = YR + 0.06 * Math.sin(Math.PI * w); }
    else { const w = tramo(tt, tf, tf + 0.25); ry = (ryFin == null ? Math.PI : ryFin) * sale(w) + 0.05 * Math.sin(2 * tt) * w; y = YR + 0.16 * Math.sin(Math.PI * w); }
    const horas = V.H * Math.pow(tramo(tt, tf + 0.08, tlleno), 0.85);
    return { x: B[0], y, z: B[1], ry, rz, esc, horas };
  };
  const cajaHook = () => W.caja({ x: B[0], z: B[1], luz: 1, item: { y: 0.45, color: AMB } });
  // ——— week world (scenes 1–4): 8 × 5 block of paid hours, the commute column (4) and the hero in front ———
  const BX = -0.4, Z0 = 1.0, PX = 0.8, PZ = 0.85, CX = BX + 3 * PX + 0.3, HB = [BX, Z0 + 2.1];
  const slot = (i) => i < 40 ? [BX + (i % 5 - 2) * PX, Z0 - Math.floor(i / 5) * PZ] : [CX, Z0 - (i - 40) * PZ];
  const HZC = Z0 - 1.5 * PZ, HD = 3 * PZ + 0.95;   // the dashed commute slot (centre z, depth)
  const quieto = (i, extra) => { const [x, z] = slot(i); return Object.assign({ x, z, rot: 0.05 * Math.sin(t * 0.8 + i * 1.7), amp: 0 }, extra || {}); };
  const PUERTA2 = { x: 4.3, z: -4.8, rot: Math.atan2(-4.7, 2.8) };

  if (k === 0) {
    const m0 = mk(0, 4.4), cB = 2.9, cC = Math.max(cB + 1.2, m0);
    cajaHook();
    // tag: in the last shot (from beyond the door) it turns to show the clock to that camera
    const CC = [DP[0] + U[0] * 4.3 + 0.35, 2.35, DP[1] + U[1] * 4.3 - 0.2];
    const ryC = Math.atan2(-(CC[0] - B[0]), -(CC[2] - B[1]));
    const E = caida(t, 0.5, 0.65, 2.0, t >= cC ? ryC : Math.PI);
    X.etiqueta(E);
    X.destello(B[0], YR + 0.05, B[1] + 0.25, tramo(t, 0.72, 1.15), 1.2, 4.6);
    // door: a red pulse each time an hour goes through
    let pulso = 0; for (let i = 0; i < 7; i++) { const d = t - tcruce(i); if (d > 0) pulso += Math.exp(-d * 5); X.destello(DP[0], 1.3, DP[1], tramo(t, tcruce(i), tcruce(i) + 0.45), 0.8, 3.2); }
    W.puerta({ x: DP[0], z: DP[1], rot: Math.atan2(-U[0], -U[1]), luz: 0.9 + 0.8 * Math.min(1, pulso) });
    const H = Array.from({ length: 7 }, (_, i) => hora(i, t));
    directo = (i, a) => i < 7 ? (H[i] || fuera) : acera(i, a);
    despues.push(() => H.forEach((h, i) => { if (h) W.gente[i].g.position.y = h.y; }));
    // «½ HR» over the half hour
    if (H[6] && H[6].esc > 0.05) W.rotulo('half', '½ HR', H[6].x, 1.25, H[6].z, Math.min(1, H[6].esc * 2), cRoj, 0.3);
    if (t < cB) {
      // A: chasing the falling tag down, a shake on the flip, a 25° orbit up and then a crane back over the whole path.
      const sac = t > 0.66 ? 0.07 * Math.exp(-(t - 0.66) * 10) : 0;
      cam(ruta([[0, [0.2, 3.6, 5.6, 0, 2.38, 1.5]], [0.5, [0.25, 2.85, 5.5, 0, 1.05, 1.5]], [0.95, [-0.3, 2.75, 5.45, 0, 1.05, 1.45]],
        [1.6, [-1.7, 3.3, 5.3, 0.25, 1.05, 1.1]], [2.45, [-3.0, 6.0, 10.0, 1.15, 1.05, -0.1]], [3.4, [-3.4, 6.4, 11.0, 1.2, 1.05, -0.2]]], t), sac);
    } else if (t < cC) {
      // B: following the line of hours from behind and to the side, towards the door (the box stays out of the frame, on the left).
      const d = 0.3 + 1.0 * (t - cB), P = [S0[0] + U[0] * d, S0[1] + U[1] * d], N = [-U[1], U[0]];
      cam([P[0] - U[0] * 3.0 + N[0] * 2.2, 2.3 - 0.25 * (t - cB), P[1] - U[1] * 3.0 + N[1] * 2.2, DP[0] - 0.3, 1.15, DP[1] + 0.3]);
    } else {
      // C: reverse shot from beyond the door: the half hour comes towards us; the clock (6.5) over the box behind.
      const u = tramo(t, cC, e.fin);
      cam(mezcla(CC.concat([B[0] + 0.5, 1.2, B[1] - 0.3]), [CC[0] - U[0] * 0.9, CC[1] - 0.2, CC[2] - U[1] * 0.9, B[0] + 0.5, 1.2, B[1] - 0.3], u));
    }
    // the 2D counter sits just above the door (clamped inside the safe area: under the headline, left of Instagram's buttons)
    const P = W.pantalla(DP[0], 3.05, DP[1]), cont = document.querySelector('.escena[data-n="0"] .cont0');
    if (cont) { cont.style.left = Math.round(Math.max(250, Math.min(760, P.x))) + 'px'; cont.style.top = Math.round(Math.max(640, Math.min(1180, P.y - 190))) + 'px'; }
  } else if (k >= 1 && k <= 4) {
    W.puerta({ x: PUERTA2.x, z: PUERTA2.z, rot: PUERTA2.rot, luz: k === 3 ? 0.7 + 1.0 * Math.exp(-Math.max(0, t - mk(0, 0.1) - 0.15) * 4) * (t > mk(0, 0.1) ? 1 : 0) : 0.55 });
    if (k === 1) {
      // 40 walk in from the back, row by row, and stop in their slot; the commute slot stays empty («?»).
      const m0 = mk(0, 2.2);
      directo = (i) => {
        if (i >= 40) return fuera;
        const r = Math.floor(i / 5), c = i % 5, ta = e.ini + 1.0 + 0.18 * r + 0.05 * Math.abs(c - 2), falta = Math.max(0, (ta - t) * 2.3), [x, z] = slot(i);
        return falta > 0 ? { x, z: z - falta, rot: 0, amp: 1, fase: t * 10 + i } : quieto(i);
      };
      X.hueco({ x: CX, z: HZC, w: 0.9, d: HD, op: q(e.ini + 0.4, 0.4) });
      W.rotulo('q', '?', CX, 1.2, HZC, q(m0 - 0.1, 0.35), cAmb, 0.5);
      W.heroe({ x: HB[0], z: HB[1], gira: 0, luz: 0 });
      cam(ruta([[e.ini, [-2.6, 2.6, 8.4, 0.0, 1.1, -1.2]], [e.ini + 2.2, [-0.6, 7.8, 9.4, 0.3, 0.2, -1.6]], [e.fin + 0.6, [1.6, 10.2, 7.8, 0.5, 0.0, -1.7]]], t));
    } else if (k === 2) {
      const m1 = mk(1, 3.5);
      // the five front-row hours that «$150 at $30.80/h» would cost (amber, «5 HRS?»)
      directo = (i) => i >= 40 ? fuera : quieto(i, i < 5 ? { color: AMB, cq: q(m1 + 0.15 + 0.06 * i, 0.3), brillo: 0.35 } : null);
      X.hueco({ x: CX, z: HZC, w: 0.9, d: HD, op: 1 });
      W.rotulo('q', '?', CX, 1.2, HZC, 1 - q(m1 - 0.1, 0.3), cAmb, 0.5);
      W.heroe({ x: HB[0], z: HB[1], gira: 0, luz: 0 });
      W.rotulo('rec', V.recibo, HB[0], 2.3, HB[1], Math.min(1, 1.4 * bote(e.ini + 0.5, 0.3)), cBl, 0.34);
      const f5 = q(m1 + 0.2, 0.3); W.rotulo('h5', V.cinco, BX, 2.25, Z0, f5, cAmb, 0.36);
      // the clock comes back, beside the block, and its sector shrinks from 6.5 to 4.9?
      const ve = sale(tramo(t, m1 - 0.1, m1 + 0.35));
      if (ve > 0) X.etiqueta({ x: CX - 0.45 + 2.5 * (1 - ve), y: 2.2, z: Z0 + 0.9, ry: Math.PI - 0.2 + 3 * (1 - ve), esc: 0.78, horas: V.H - (V.H - V.H5) * sale(tramo(t, m1 + 0.3, m1 + 0.9)), preg: t > m1 + 0.3, cordel: false });
      // push in on the hero; on «So why not…» a sideways sweep to the amber hours and the clock
      if (t < m1) cam(ruta([[e.ini, [1.8, 2.9, 9.6, HB[0], 1.5, HB[1] - 0.8]], [m1 + 0.4, [1.0, 2.25, 7.2, HB[0], 1.65, HB[1] - 0.6]]], t));
      else cam(ruta([[m1, [0.2, 3.9, 10.4, 0.8, 1.15, 0.5]], [e.fin + 0.6, [1.5, 4.5, 11.0, 0.85, 1.1, 0.4]]], t));
    } else if (k === 3) {
      const m0 = mk(0, 0.1), m1 = mk(1, 2.2), m2 = mk(2, 3.4), tA = m2 + 0.45;
      // the four commute hours: single file along the path, then forward into the slot; they arrive together at tA
      const P0 = [CX + 3.2, -8.6], P1 = [CX, Z0 - 4 * PZ], L1 = Math.hypot(P1[0] - P0[0], P1[1] - P0[1]), VA = 2.3;
      const ambar = (j) => {
        const resto = (tA - t) * VA, L2 = (Z0 - j * PZ) - P1[1], d = L1 + L2 - resto;   // distance walked along the path
        if (resto <= 0) return quieto(40 + j, { color: AMB, cq: 0.95, brillo: 0.32 });
        let x, z, rot;
        if (d < L1) { const w = d / L1; x = P0[0] + (P1[0] - P0[0]) * w; z = P0[1] + (P1[1] - P0[1]) * w; rot = Math.atan2(P1[0] - P0[0], P1[1] - P0[1]); }
        else { x = P1[0]; z = P1[1] + (d - L1); rot = 0; }
        return { x, z, rot, amp: 1, fase: t * 10 + j * 1.3, color: AMB, cq: 0.95, brillo: 0.32 };
      };
      directo = (i) => i < 40 ? quieto(i) : ambar(i - 40);
      X.hueco({ x: CX, z: HZC, w: 0.9, d: HD, op: 1 - 0.6 * q(tA, 0.4) });
      W.rotulo('q', '?', CX, 1.2, HZC, 1 - q(m2 - 0.3, 0.3), cAmb, 0.5);
      X.camino({ x0: P0[0], z0: P0[1], x1: P1[0], z1: P1[1], q: sale(tramo(t, m1 - 0.05, m1 + 0.6)) });
      W.rotulo('com', V.commute, CX - 0.55, 2.45, HZC, q(m2 + 0.1, 0.3), cAmb, 0.36);
      W.heroe({ x: HB[0], z: HB[1], gira: 0, luz: 0 });
      if (t < m1) cam(ruta([[e.ini, [2.4, 4.4, 9.8, -0.1, 0.6, -0.7]], [m1 + 0.5, [1.2, 9.4, 7.4, 0.1, 0.0, -0.9]]], t));
      else {
        // tracking the amber hours on the path, then opening out to show the 44
        cam(ruta([[m1, [CX + 4.4, 2.7, 0.2, CX + 0.6, 1.0, -3.4]], [m2 + 0.35, [CX + 3.4, 4.3, 6.8, CX - 0.7, 0.9, -1.0]], [e.fin + 0.6, [CX + 1.4, 6.2, 10.6, 0.3, 0.7, -1.3]]], t));
      }
    } else {
      const m0 = mk(0, 0.1), m1 = mk(1, 2.3);
      // a quarter of the block (the two back rows: 10 hours) dims for a moment on «A quarter less»
      const apaga = q(m1 + 0.2, 0.3) * (1 - q(m1 + 1.3, 0.4));
      directo = (i) => i < 40 && i >= 30 ? quieto(i, { color2: 0x1e293b, c2q: 0.85 * apaga }) : quieto(i, i >= 40 ? { color: AMB, cq: 0.95, brillo: 0.32 } : null);
      X.hueco({ x: CX, z: HZC, w: 0.9, d: HD, op: 0.4 });
      const luz = q(m0 - 0.05, 0.4);
      W.heroe({ x: HB[0], z: HB[1], gira: 0, luz, y: 0.06 * luz * Math.max(0, Math.sin((t - m0) * 9)) * (t < m0 + 0.7 ? 1 : 0) }); X.suaviza(0.3, 0.3);
      if (t < m1) cam(orbita(mezcla([0.6, 2.9, 9.4, HB[0], 2.05, HB[1] - 0.4], [0.2, 2.45, 7.0, HB[0], 2.15, HB[1] - 0.2], sale(tramo(t, e.ini, m1))), 0.12 - 0.3 * tramo(t, e.ini, m1)));
      else cam(ruta([[m1, orbita([0.2, 2.45, 7.0, HB[0], 2.15, HB[1] - 0.2], -0.18)], [e.fin + 0.5, [1.0, 6.6, 12.0, 0.2, 0.9, -0.9]]], t));
      // the 2D chips over the hero's head (scene 4): $30.80/h, then $23.15/h below it
      const P = W.pantalla(HB[0], 2.25, HB[1]), sc = document.querySelector('.escena[data-n="4"]');
      if (sc) { const c1 = sc.querySelector('.c1'), c2 = sc.querySelector('.c2'), p2 = +(c2.dataset.p || 0);
        c1.style.transform = 'translate(' + Math.round(P.x) + 'px,' + Math.round(P.y - 80) + 'px) translate(-50%,-50%)';
        c2.style.transform = 'translate(' + Math.round(P.x) + 'px,' + Math.round(P.y + 85 - 40 * p2) + 'px) translate(-50%,-50%) scale(' + (0.7 + 0.3 * p2) + ')'; }
    }
  } else if (k === 5) {
    const m0 = mk(0, 1.3), m1 = mk(1, 2.6), HX = 0, HZ = 0.6, RC = 1.7;
    // the box with the tag sinks away («Skip that treat»)
    const va = sale(tramo(t, e.ini + 0.25, e.ini + 1.0));
    W.caja({ x: 1.9, z: 1.5, luz: 1, op: 1 - va, item: { y: 0.45, color: AMB, op: 1 - va } });
    if (va < 0.98) X.etiqueta({ x: 1.9, y: YR - 1.2 * va, z: 1.5, ry: -0.35, esc: 0.75 * (1 - 0.5 * va), op: 1 - va, cordel: true });
    // six red hours stand in line by the box, turn turquoise and start circling the hero on «can grow»
    const gira = Math.max(0, t - m0), ga = q(m0 - 0.05, 0.5);
    directo = (i, a) => {
      if (i >= 6) return acera(i, a);
      const fila = [1.0 + i * 0.0, 0], ang0 = -0.4 + i * Math.PI / 3, ang = ang0 + 0.9 * gira;
      const lx = 1.15 + (i % 3) * 0.72, lz = -0.35 - Math.floor(i / 3) * 0.8;   // a 3 × 2 group behind the box
      const cx = HX + RC * Math.sin(ang), cz = HZ + RC * Math.cos(ang);
      const x = lx + (cx - lx) * ga, z = lz + (cz - lz) * ga;
      return { x, z, rot: ga > 0.5 ? ang + Math.PI / 2 : -Math.PI / 2 * ga, amp: ga > 0.02 ? 1 : 0, fase: t * 8 + i, color: ROJ, cq: 0.92 * (1 - ga), color2: 0x0f9488, c2q: 0.95 * ga, brillo: 0.22,
        esc: 1 + 0.12 * q(m1, 0.5) };
    };
    X.aro({ x: HX, z: HZ, r: RC * (0.6 + 0.6 * q(m0, 0.8)), op: 0.5 * q(m0, 0.4) });
    W.heroe({ x: HX, z: HZ, gira: 0, luz: 1 }); X.suaviza(0.3, 0.35);
    cam(orbita(mezcla([0.8, 5.4, 9.2, 0.6, 1.0, 0.3], [0.8, 6.4, 10.4, 0.6, 0.9, 0.3], sale(tramo(t, e.ini, e.fin))), 0.3 - 0.6 * tramo(t, e.ini, e.fin)));
  } else {
    const m1 = mk(1, 3.0), m2 = mk(2, 4.0);
    if (t < m1) {
      // today's action: the hero with his real hour; the turquoise hours keep circling
      const HX = 0, HZ = 0.6, RC = 1.7;
      directo = (i, a) => { if (i >= 6) return acera(i, a); const ang = -0.4 + i * Math.PI / 3 + 0.9 * (t - e.ini + 2.5);
        return { x: HX + RC * Math.sin(ang), z: HZ + RC * Math.cos(ang), rot: ang + Math.PI / 2, amp: 1, fase: t * 8 + i, color: 0x0f9488, cq: 0.95, brillo: 0.22, esc: 1.12 }; };
      X.aro({ x: HX, z: HZ, r: RC * 1.2, op: 0.4 });
      W.heroe({ x: HX, z: HZ, gira: 0, luz: 1 }); X.suaviza(0.3, 0.35);
      W.rotulo('real', V.real, HX, 2.3, HZ, Math.min(1, 1.4 * bote(e.ini + 0.2, 0.3)), cTq, 0.36);
      cam(orbita(mezcla([0.0, 4.4, 8.6, 0, 1.75, 0.5], [0.0, 5.4, 9.4, 0, 1.6, 0.5], sale(tramo(t, e.ini, m1))), -0.3 + 0.45 * tramo(t, e.ini, m1)));
    } else {
      // «Those sneakers?»: the frame-0 framing again; it lands just before «Six and a half» and flips on it.
      const tl = Math.min(m1 + 0.55, m2 - 0.1), d0 = tl - 0.5;   // d0: shift so the same camera path as the hook can be used
      cajaHook();
      const E = caida(t, tl, m2, m2 + 0.4, Math.PI); X.etiqueta(E);
      X.destello(B[0], YR + 0.05, B[1] + 0.25, tramo(t, m2 + 0.07, m2 + 0.5), 1.2, 4.6);
      W.puerta({ x: DP[0], z: DP[1], rot: Math.atan2(-U[0], -U[1]), luz: 0.9 });
      directo = (i, a) => i < 7 ? fuera : acera(i, a);
      const sac = t > m2 + 0.01 ? 0.07 * Math.exp(-(t - m2 - 0.01) * 10) : 0;
      cam(ruta([[d0 - 0.1, [0.2, 3.75, 5.6, 0, 2.5, 1.5]], [d0 + 0.5, [0.25, 2.85, 5.5, 0, 1.05, 1.5]], [Math.max(d0 + 0.9, m2 + 0.3), [-0.3, 2.75, 5.45, 0, 1.05, 1.45]], [e.fin + 1.0, [-0.75, 2.6, 5.0, 0, 1.07, 1.4]]], t), sac);
    }
  }
  W.multitud(t, { directo });
  despues.forEach(f => f());
};

const pildoras = {
  'en-reto-01': pildora3d({
    slug: 'en-reto-01', cuenta: 'en',
    T: { en: {
      titulo: 'Day 1/30 · Where does your paycheck actually go?',
      guion: [
        [0, 'Your paycheck comes in… §and it’s gone *in every direction*.'],
        [0, 'Do you know exactly where? §If the answer is “kind of,” *stick around*.'],
        [1, 'Because what you can’t see, §*you can’t change*.'],
        [2, '*Day one*. Just one thing: §for seven days, §*write down every purchase*. Don’t change anything. Just look.'],
        [3, 'Give each one a label: §{pop}*need*, §{pop}*want*, §{pop}or *savings*.'],
        [4, 'In a week, you’ll see §{ding}*the whole picture* of your money.'],
        [5, 'Day one of thirty to *get your money in order*. §Tomorrow: the charges that hit your account *every month*.']
      ]
    } },
    fijo: () => hud(1, TOTAL, 'DAY'),
    escenas: [
      // 0 · Bird's-eye: chaos. Card «money tracked: 0%».
      { html: () => `<div class="dato" data-t="translateX(-50%)" style="top:1240px"><small>MONEY TRACKED</small><b class="rojo">0%</b></div>`,
        anim: ES['es-reto-01'].escenas[0].anim },
      { html: () => '', anim: null },
      // 2 · The hero lights up; today's task.
      { html: () => `<div class="rotulo" data-t="translateX(-50%)" style="top:580px">Write down every purchase · 7 days</div>`,
        anim: ES['es-reto-01'].escenas[2].anim },
      { html: () => '', anim: null },
      { html: () => '', anim: null },
      finSerie({ dia: 1, total: TOTAL, serie: SERIE, etiquetaManana: 'TOMORROW · DAY 2', manana: 'The charges that hit your account every month', sigue: SIGUE })
    ],
    tres: ES['es-reto-01'].tres,
    texto: { en: `Your paycheck comes in… and it’s gone in every direction. 👀

Day 1 of 30 to get your money in order. Today, just one thing: for 7 days, write down every purchase and tag it need, want or savings. Don’t change anything yet. Just look.
Easiest way to keep it up: check your bank app every night and add what you missed. Card taps and autopays are the ones people forget.

What do you think will surprise you most? 👇

💾 Save this and start today.
👉 Tomorrow, day 2: the charges that hit your account every month. Follow so you don’t miss a day.

#budgeting #moneychallenge #spendingtracker` }
  }),

  // Day 2 · Subscriptions and charges that repeat: a red line walking out the red door while you don't look; cancel one.
  // Same choreography as es-reto-02 (its 3D function picks the English labels by language). No external data.
  'en-reto-02': pildora3d({
    slug: 'en-reto-02', cuenta: 'en',
    T: { en: {
      titulo: 'Day 2/30 · The charges that hit your account every month',
      guion: [
        [0, 'There’s money leaving your account *every single month*… §and you never even look.'],
        [1, 'Streaming, apps, a free trial that never ended, the gym you don’t go to. §They charge you on their own, §{tic}*one by one*.'],
        [2, 'They’re small. §That’s exactly why *you never check them*.'],
        [3, '*Day two*. §Open your bank app §and find every charge that *repeats*. Write them all down.'],
        [4, 'And today, §{ding}*cancel one* you don’t use. Just one.'],
        [5, 'Day two of thirty. §One canceled charge is money back *every single month*, §without earning a cent more.']
      ]
    } },
    fijo: () => hud(2, TOTAL, 'DAY'),
    escenas: [
      { html: () => `<div class="dato" data-t="translateX(-50%)" style="top:1230px;left:69%"><small>CHARGES ITSELF</small><b class="rojo">every month</b></div>`,
        anim: ES['es-reto-02'].escenas[0].anim },
      { html: () => '', anim: null },
      { html: () => `<div class="dato" data-t="translateX(-50%)" style="top:540px"><small>AUTOMATIC CHARGES</small><b class="rojo">0</b></div>`,
        anim: ES['es-reto-02'].escenas[2].anim },
      { html: () => `<div class="rotulo" data-t="translateX(-50%)" style="top:580px">Find what repeats</div>`,
        anim: ES['es-reto-02'].escenas[3].anim },
      { html: () => `<div class="rotulo" data-t="translateX(-50%)" style="top:580px">Today: cancel one</div>`,
        anim: ES['es-reto-02'].escenas[4].anim },
      finSerie({ dia: 2, total: TOTAL, serie: SERIE, etiquetaManana: 'TODAY · DAY 2', manana: 'Cancel one charge you don’t use', sigue: SIGUE })
    ],
    tres: ES['es-reto-02'].tres,
    texto: { en: `There’s money leaving your account every month… and you never even look. 👻

Day 2 of 30 to get your money in order: open your bank app, find every charge that repeats (subscriptions, apps, memberships) and write them all down. Then cancel one you don’t use. Just one.
Free trials are the sneaky ones: when you sign up, set a reminder for the day before the first charge.

Which one are you canceling? 👇

💾 Save this for tonight.
👉 Day 2 of 30. Follow so you don’t miss a day.

#subscriptions #budgeting #moneychallenge` }
  }),

  // Day 3 · What one hour of your work is really worth: a $150 treat, priced in hours of your life (guiones/2026-11-en-reto-03.md).
  'en-reto-03': pildora3d({
    slug: 'en-reto-03', cuenta: 'en',
    voz: VOZ_R3,
    T: { en: {
      titulo: 'Day 3/30 · These $150 sneakers don’t cost $150',
      guion: [
        [0, 'These $150 sneakers don’t cost $150. §{pop}They cost *six and a half hours*.'],
        [1, 'Your real hour is take-home pay §divided by *every hour work takes*.'],
        [2, 'Typical full-time pay, before taxes: §about *$31 an hour*. §So why not *five hours*?'],
        [3, '§{caja}Federal taxes take about *a sixth*. §And the average commute §{tic}adds *four and a half unpaid hours* a week.'],
        [4, '§{ding}Your real hour: about *$23*. §*A quarter less* than you thought.'],
        [5, 'Skip that treat, §and that money can grow, §*invested for the long run*.'],
        [6, 'Today, find *your real hour* §and price your next treat in hours. §{whoosh}Those sneakers? §{pop}*Six and a half.*']
      ]
    } },
    fijo: () => hud(3, TOTAL, 'DAY'),
    cssExtra: CSS_R3, scriptExtra: SCRIPT_R3,
    escenas: ESC_R3, tres: TRES_R3,
    // It cuts on the number: short tail; the 2D layer of each scene leaves on the same frame as the hard cut of the 3D.
    cola: 0.4, corte2d: 'seco',
    texto: { en: `These $150 sneakers don’t cost $150. They cost 6.5 hours of your life. ⏳

Your real hour = take-home pay ÷ every hour work takes, commute included. With the typical full-time pay, $1,232 a week before taxes, that’s about $1,032 after federal income tax and FICA, over 40 hours plus 4 h 34 min of commuting: about $23 an hour, not the $30.80 on paper.

Today: grab your last pay stub, find your real hour, and price your next treat in hours. Whatever you don’t spend can go to your cash cushion first and then, invested for the long run, it can keep growing without you clocking in.

What did the last thing you bought cost you in hours? 👇

Day 3 of 30 to get your money in order.
Example: single filer, 2026 standard deduction, 40-hour week, no state or local income tax, no 401(k) or health deductions. State taxes and payroll deductions lower your real hour. Illustrative. Investing involves risk; returns aren’t guaranteed.
Sources: BLS, Usual Weekly Earnings, Q3 2026 (Oct 21, 2026) · U.S. Census Bureau, American Community Survey 2025 (average one-way commute: 27.4 min) · IRS Rev. Proc. 2025-32 · IRS Topic No. 751.
Educational only, not financial advice.

#personalfinance #budgeting #moneytips` }
  })
};

module.exports = { pildoras };
