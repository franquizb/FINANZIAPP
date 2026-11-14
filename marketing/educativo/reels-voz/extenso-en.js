// Long format (test, 45–63 s) · @finanziapp (US), in 3D (reels-voz/tres.js), series «Money, explained».
// en-save-invest-one-plan · «The same dollar can gain fifty cents the day you save it, or under half a cent in a year.»
// Final, verified script: guiones/2026-11-extenso-en-ahorrar-invertir.md (scenes, on-screen labels, cuadra(), sources, post, cover).
// Owner's idea (14 Nov 2026): in the US, saving isn't only putting money aside, it's investing; merging both is what matters.
// Expiry: the 2026 IRS limits are in a label (scene 5), not in the voice. Check irs.gov/newsroom on the day it's published:
// if the 2027 limits are out, change the label to 2027 (no new voice needed).
//
// Sources (as given in the script, checked 14 Nov 2026):
// - FDIC, National Rates and Rate Caps (19 Oct 2026): savings 0.38% APY (national weighted average); 12-month CD 1.76%.
//   https://www.fdic.gov/national-rates-and-rate-caps
// - Federal Reserve, G.19 Consumer Credit (6 Nov 2026): credit cards, Q3 2026 preliminary. «Accounts assessed interest» 22.36%;
//   «all accounts» 21.19%. https://www.federalreserve.gov/releases/g19/current/
// - BLS, Employee Benefits in the United States, table 1 (March 2026; modified 12 Nov 2026). Private industry: access 72%,
//   participation 52%, take-up 72%. Civilian: 75/56/75. https://www.bls.gov/news.release/ebs2.t01.htm
// - IRS, IR-2025-111 (13 Nov 2025): 401(k) $24,500 ($8,000 catch-up at 50+; $11,250 at 60–63); IRA $7,500 ($1,100 catch-up
//   at 50+). https://www.irs.gov/newsroom/401k-limit-increases-to-24500-for-2026-ira-limit-increases-to-7500
// - Vanguard, How America Saves 2026, figs. 5-7, pp. 21-22: most common formula, 50¢ per $1 up to 6% (12% of plans with a
//   match). Source only: not named in the voice or on screen.
// - BLS, Usual Weekly Earnings (21 Oct 2026): full-time median $1,232/week in Q3 2026 (the $60,000 example is below it).
// - FINRA, «Why Leave Money on the Table?» (1 Aug 2023, updated 27 Feb 2025): «passing up free money».
//   https://www.finra.org/investors/alerts/why-leave-money-make-most-employers-401k-match
// - Federal Reserve, SHED 2025 (May 2026): 63% would cover $400 with cash or its equivalent (post text / comments only).
//
// Compared with the script, only § marks were added (they are not read and don't change the voice takes): line 1 «§fifty»
// and «§Where», line 2 «§up to a cap», line 3 «§both», line 4 «§22%», line 5 «§free money» and «§clear», line 7 «§don’t join»,
// line 8 «§aren’t two goals». Educational only: no product, bank, broker or brand on screen.
const { pildora3d } = require('./tres');
const { cuadra } = require('../reels/_comun');

// ——— all the checks in the script ———
const R2 = x => Math.round(x * 100) / 100;
cuadra('match por dólar', 1 + 1 * 0.5, 1.5);                 // «gain fifty cents» → $1.50
cuadra('ahorro 1 año', R2((1 * 1.0038 - 1) * 100) / 100, 0.0038); // 0.38¢ in a year
cuadra('menos de medio centavo', 1 * 0.0038 < 0.005, true);  // «under half a cent»
cuadra('0,38 redondeado', Math.round(0.38 * 10) / 10, 0.4);  // label «$1.004» / «0.4¢»
cuadra('tope del match', R2(0.5 * 6), 3);                    // at most 3% of pay («up to a cap»)
cuadra('aportación', 60000 * 0.06, 3600);
cuadra('match anual', 3600 * 0.5, 1800);                     // «$1,800 a year»
cuadra('= 3 % del sueldo', 60000 * 0.03, 1800);
cuadra('10 años', 1800 * 10, 18000);                         // «$18,000, before any growth» (flat salary, no returns)
cuadra('no se apuntan', 100 - 72, 28);                       // BLS, private industry, take-up 72%
cuadra('más de 1 de 4', 28 > 25, true);                      // «over 1 in 4»
cuadra('civiles: justo 1 de 4', 100 - 75, 25);               // hence «private-sector», not «workers»
cuadra('22 %', Math.round(22.36), 22);                       // «about 22%»
cuadra('mediana BLS anual', 1232 * 52, 64064);
cuadra('60k < mediana', 60000 < 64064, true);                // the example is conservative
const be = Math.log(1.5) / Math.log(1.2236);
cuadra('equilibrio match/tarjeta (APR)', R2(be), 2.01);      // years
const tae = Math.pow(1 + 0.2236 / 12, 12) - 1;
cuadra('TAE tarjeta', R2(tae * 100), 24.8);
cuadra('equilibrio (mensual)', R2(Math.log(1.5) / Math.log(1 + tae)), 1.83); // → «clear the cards, fast»
cuadra('match frente a ahorro al 4 %', 0.5 > 0.04, true);    // answer to «my savings pays 4%»
// What is on screen besides the script.
cuadra('pantalla: $1.004', +(1 * 1.0038).toFixed(3), 1.004);
cuadra('pantalla: 10 bloques = $18,000', 10 * 1800, 18000);
cuadra('pantalla: el match se para en el 6.º dólar (3 %)', Math.min(8, 6) * 0.5, 3);

const TEXTO = `The same dollar: +50¢ the day you save it, or under half a cent in a year. 💵

Check two things in your plan documents (the Summary Plan Description): your exact match formula, since many aren't 50¢ up to 6%, and your vesting schedule. If you leave before you're vested, part of the match can disappear.

Why the cash cushion comes first: pulling money out of a 401(k) before 59½ usually means income tax plus a 10% penalty. And if you're 50 or older, the IRS lets you put in more: an extra $8,000 in a 401(k) for 2026 ($11,250 if you're 60–63).

Do you know your employer's match formula? 👇

Example: $60,000 salary, 50% match up to 6% of pay, flat salary, no returns. Illustrative.
Sources: FDIC National Rates (Oct 19, 2026) · Federal Reserve G.19 (Nov 2026, Q3 preliminary) · BLS Employee Benefits (March 2026) · IRS IR-2025-111.
Educational only, not financial advice.

#401k #investing #personalfinance`;

const GUION = [
  [0, 'The same dollar can gain §*fifty cents* the day you save it, §or *under half a cent* in a year. §{pop}The difference? §*Where it goes first.*'],
  [1, 'The first is a common *401(k) match*: §fifty cents per dollar you put in, §up to a cap. §The second, the average *savings account*.'],
  [2, 'The usual rule of thumb: §both, in order. §One: a small *cash cushion*, §so surprises don’t land on a card. §Two: enough to get the *full match*.'],
  [3, 'But cards charging interest average about §*22%*. §Shouldn’t you pay those off first?'],
  [4, 'Usually, not before the match: §{ding}an instant *50%*, §free money once it vests. §Then three: §clear the cards, *fast*.'],
  [5, 'Four: more into accounts with *tax breaks*, §up to the yearly limits. §Five: the rest, *invested* in a regular brokerage account.'],
  [6, 'Yet over *1 in 4* private-sector workers offered a plan §don’t join. §Skip it on a $60,000 salary with a 50% match up to 6%, §and that’s *$1,800* a year left on the table. §{caja}Ten years: *$18,000*, §before any growth.'],
  [7, 'In America, saving and investing §aren’t two goals. §They’re *one plan*. §Today, check you’re getting your *full match*.']
];

const MONO = `'DejaVu Sans Mono', 'Liberation Mono', monospace`;
const CSS = `
  .hud.i.fmt { letter-spacing: .14em; }
  .titular { position: absolute; left: 50%; top: 492px; transform: translateX(-50%); white-space: nowrap; background: rgba(9,14,27,.88);
    border: 2px solid rgba(148,163,184,.32); border-radius: 26px; padding: 12px 34px 16px; font-size: 76px; line-height: 1.1; font-weight: 900;
    letter-spacing: -.025em; color: #fff; font-variant-numeric: tabular-nums; }
  .titular .t { display: inline-block; color: #5eead4; }
  .titular .vs { font-size: 40px; font-weight: 750; color: #94a3b8; margin: 0 18px; letter-spacing: 0; }
  .titular .g { color: #94a3b8; }
  .tj { position: absolute; left: 50%; background: rgba(9,14,27,.9); border: 2px solid rgba(148,163,184,.32); border-radius: 24px;
    padding: 12px 34px 16px; text-align: center; opacity: 0; white-space: nowrap; }
  .tj small { display: block; font: 700 23px/1.35 ${MONO}; letter-spacing: .14em; color: #94a3b8; margin-bottom: 4px; }
  .tj .l { display: block; font-size: 48px; line-height: 1.15; font-weight: 850; letter-spacing: -.015em; color: #fff; font-variant-numeric: tabular-nums; }
  .tj .l.p { font-size: 34px; font-weight: 750; color: #e2e8f0; line-height: 1.22; }
  .tj .t { color: #5eead4; } .tj .r { color: #f87171; } .tj .a { color: #f5b94a; } .tj .g { color: #94a3b8; }
  .tj.turq { border-color: rgba(94,234,212,.6); } .tj.amb { border-color: rgba(245,185,74,.65); } .tj.roja { border-color: rgba(248,113,113,.6); }
  .fuente { position: absolute; left: 50%; transform: translateX(-50%); bottom: 420px; text-align: center; font: 600 22px/1.35 ${MONO};
    color: #b6c2d4; white-space: nowrap; background: rgba(7,11,22,.8); border-radius: 10px; padding: 5px 14px; }
  .chip { position: absolute; left: 50%; font-size: 40px; font-weight: 850; color: #fff; background: rgba(9,14,27,.9); border: 3px solid #e2e8f0;
    border-radius: 18px; padding: 10px 24px; opacity: 0; white-space: nowrap; }
  .chip.amb { border-color: #f5b94a; color: #f5b94a; }
  .chip.turq { border-color: #5eead4; color: #5eead4; }
  .contador { position: absolute; left: 50%; font-size: 120px; line-height: 1; font-weight: 900; letter-spacing: -.04em; color: #f87171;
    text-shadow: 0 6px 40px rgba(0,0,0,.8); opacity: 0; white-space: nowrap; font-variant-numeric: tabular-nums; }
  .contador small { font-size: 46px; font-weight: 800; letter-spacing: -.01em; color: #fca5a5; }
  .mini { position: absolute; left: 50%; font-size: 34px; font-weight: 800; color: #e2e8f0; background: rgba(9,14,27,.88); border: 2px solid rgba(148,163,184,.4);
    border-radius: 14px; padding: 6px 18px; opacity: 0; white-space: nowrap; }
`;

// 3D world of this video (added to tres.js): $1 coins and 50¢ half coins, the 401(k) jar (glass, turquoise lid, your money
// in gold and the match in turquoise), the glass savings box, a 5-step staircase with a line that joins it, the cash cushion,
// a bill, the 22% card with its amber frame and a red chain, the two tax-advantaged accounts, the brokerage stacks, the 10
// red blocks, the phone and the employer's badge. Everything is switched off at the start of each frame (X.apagar()).
const SCRIPT = `
const PW = 1.4, PH = 0.42, PD = 2.0, PX0 = -2.8;   // steps: width, rise, depth, x of the first one
const pelX = (i) => PX0 + i * PW, pelY = (i) => (i + 1) * PH;
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
  const situa = (g, o) => { g.position.set(o.x, o.y, o.z); g.rotation.set(o.rx || 0, o.ry || 0, o.rz || 0); g.scale.setScalar(Math.max(0.001, o.esc == null ? 1 : o.esc)); };

  // ——— $1 coins (face to camera) and 50¢ half coins ———
  const R_M = 0.17, E_M = 0.045;
  const mOro = () => mat(ORO, { metalness: 0.6, roughness: 0.3, emissive: ORO, emissiveIntensity: 0.22 });
  const geoM = new T.CylinderGeometry(R_M, R_M, E_M, 40); geoM.rotateX(Math.PI / 2);
  const l1 = lienzo(256, 256); l1.x.strokeStyle = '#8a5a0c'; l1.x.lineWidth = 10; l1.x.beginPath(); l1.x.arc(128, 128, 110, 0, Math.PI * 2); l1.x.stroke();
  texto(l1, '$1', '#8a5a0c', 128, 128, 138); l1.tx.needsUpdate = true;
  const geoCara = new T.PlaneGeometry(R_M * 1.92, R_M * 1.92), mCara = new T.MeshBasicMaterial({ map: l1.tx, transparent: true, depthWrite: false });
  function nueva(m) { const g = new T.Group(), mm = m || mOro(); const c = new T.Mesh(geoM, mm); c.castShadow = true; g.add(c);
    const f = new T.Mesh(geoCara, mCara); f.position.z = E_M / 2 + 0.002; g.add(f); const b = new T.Mesh(geoCara, mCara); b.position.z = -E_M / 2 - 0.002; b.rotation.y = Math.PI; g.add(b); return g; }
  const monedasP = pool(18, () => nueva());
  function moneda(o) { const g = tomar(monedasP); if (g) situa(g, o); }
  const geoMM = new T.CylinderGeometry(R_M, R_M, E_M, 24, 1, false, 0, Math.PI); geoMM.rotateX(Math.PI / 2); geoMM.rotateZ(Math.PI / 2);
  const l50 = lienzo(256, 128); texto(l50, '50¢', '#8a5a0c', 84, 128, 76); l50.tx.needsUpdate = true;
  const C_ORO = new T.Color(ORO), C_ROJO = new T.Color(ROJO);
  const mediasP = pool(10, () => { const g = new T.Group(), mm = mOro(); const c = new T.Mesh(geoMM, mm); c.castShadow = true; g.add(c);
    const fondo = new T.Mesh(new T.BoxGeometry(R_M * 2, 0.006, E_M), mm); fondo.position.y = 0.003; g.add(fondo);
    const cm = new T.MeshBasicMaterial({ map: l50.tx, transparent: true, depthWrite: false });
    const f = new T.Mesh(new T.PlaneGeometry(R_M * 1.6, R_M * 0.8), cm); f.position.set(0, R_M * 0.44, E_M / 2 + 0.002); g.add(f);
    const b = new T.Mesh(f.geometry, cm); b.position.set(0, R_M * 0.44, -E_M / 2 - 0.002); b.rotation.y = Math.PI; g.add(b);
    g.userData = { mm, cm }; return g; });
  function media(o) { const g = tomar(mediasP); if (!g) return; situa(g, o);
    const r = o.rojo || 0, op = o.op == null ? 1 : o.op, u = g.userData;
    u.mm.color.copy(C_ORO).lerp(C_ROJO, r); u.mm.emissive.copy(C_ORO).lerp(C_ROJO, r); u.mm.transparent = op < 1; u.mm.opacity = op; u.mm.depthWrite = op >= 1; u.cm.opacity = op; }

  // ——— the 401(k) jar: glass, base, turquoise lid with the label and a slot; inside, your money (gold) and the match (turquoise) ———
  const jarG = grupo(), JR = 0.42, JH = 1.15, LH = 0.22, Y0 = 0.07;
  const vidrio = new T.Mesh(new T.CylinderGeometry(JR, JR, JH, 48, 1, true), new T.MeshStandardMaterial({ color: 0xa5b8d8, roughness: 0.15, metalness: 0.1, transparent: true, opacity: 0.17, side: T.DoubleSide, depthWrite: false }));
  vidrio.position.y = 0.04 + JH / 2; jarG.add(vidrio);
  pieza(jarG, new T.CylinderGeometry(JR + 0.03, JR + 0.04, 0.05, 48), mat(0x334155), 0, 0.025, 0);
  const mTapa = mat(TURQ, { emissive: TURQ, emissiveIntensity: 0.3, roughness: 0.4 });
  const tapa = pieza(jarG, new T.CylinderGeometry(JR + 0.04, JR + 0.04, LH, 48), mTapa, 0, 0.04 + JH + LH / 2, 0);
  const le = lienzo(512, 128); texto(le, '401(k)', '#062a26', 92, 256, 70); le.tx.needsUpdate = true;
  const banda = new T.Mesh(new T.CylinderGeometry(JR + 0.046, JR + 0.046, LH * 0.92, 48, 1, true, -1.15, 2.3), new T.MeshBasicMaterial({ map: le.tx, transparent: true, depthWrite: false }));
  banda.position.y = tapa.position.y; jarG.add(banda);
  caja(jarG, 0.38, 0.02, 0.07, mat(0x0b1020), 0, 0.04 + JH + LH + 0.006, 0);
  const aroM = new T.MeshStandardMaterial({ color: 0xcbd5e1, emissive: 0x94a3b8, emissiveIntensity: 0.3, roughness: 0.4 });
  const aroJ = new T.Mesh(new T.TorusGeometry(JR, 0.022, 8, 48), aroM); aroJ.rotation.x = Math.PI / 2; aroJ.position.y = 0.06; jarG.add(aroJ);
  const rayas = (c1, c2) => { const l = lienzo(64, 64); l.x.fillStyle = c1; l.x.fillRect(0, 0, 64, 64); l.x.fillStyle = c2; l.x.fillRect(0, 52, 64, 12); l.tx.wrapS = l.tx.wrapT = T.RepeatWrapping; l.tx.needsUpdate = true; return l.tx; };
  const txO = rayas('#f5b94a', '#b7791f'), txT = rayas('#2dd4bf', '#0f766e');
  const geoU = new T.CylinderGeometry(1, 1, 1, 44);
  const rO = new T.Mesh(geoU, new T.MeshStandardMaterial({ map: txO, emissive: ORO, emissiveIntensity: 0.16, roughness: 0.4, metalness: 0.3 }));
  const rT = new T.Mesh(geoU, new T.MeshStandardMaterial({ map: txT, emissive: TURQ, emissiveIntensity: 0.3, roughness: 0.4, metalness: 0.2 }));
  [rO, rT].forEach(m => { m.scale.set(JR - 0.05, 1, JR - 0.05); m.castShadow = true; jarG.add(m); });
  const lineasJ = [0, 1].map(() => { const m = new T.Mesh(new T.TorusGeometry(JR + 0.022, 0.016, 8, 56), new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, toneMapped: false })); m.rotation.x = Math.PI / 2; jarG.add(m); return m; });
  const luzJ = new T.PointLight(0x5eead4, 0, 5, 1.6); luzJ.position.set(0, 0.9, 0.9); jarG.add(luzJ); luces.push(luzJ);
  // o = { x, y, z, yo (m of gold), match (m of turquoise), lineas: [{ h, color, op }], brillo } → heights for labels
  function jarra(o) {
    jarG.visible = true; const y = o.y || 0; jarG.position.set(o.x, y, o.z); jarG.rotation.y = o.rot || 0;
    const yo = Math.max(0, o.yo || 0), mt = Math.max(0, o.match || 0);
    rO.visible = yo > 0.004; rO.scale.y = Math.max(yo, 0.001); rO.position.y = Y0 + yo / 2; txO.repeat.set(5, Math.max(1, yo / 0.045));
    rT.visible = mt > 0.004; rT.scale.y = Math.max(mt, 0.001); rT.position.y = Y0 + yo + mt / 2; txT.repeat.set(5, Math.max(1, mt / 0.045));
    lineasJ.forEach((l, j) => { const d = (o.lineas || [])[j]; l.visible = !!d && (d.op == null || d.op > 0.01); if (!l.visible) return;
      l.position.y = Y0 + d.h; l.material.color.set(d.color || '#ffffff'); l.material.opacity = d.op == null ? 1 : d.op; });
    const b = o.brillo || 0; mTapa.emissiveIntensity = 0.3 + 0.9 * b; rT.material.emissiveIntensity = 0.3 + 0.8 * b; luzJ.intensity = 3 * b;
    return { y0: y + Y0, tope: y + Y0 + yo + mt, ranura: y + 0.04 + JH + LH + 0.01, alto: y + 0.04 + JH + LH };
  }

  // ——— the savings box: a glass cube with a lone coin that barely shines ———
  const ahoG = grupo(), AL = 0.72, a2 = AL / 2;
  pieza(ahoG, new T.BoxGeometry(AL, AL, AL), new T.MeshStandardMaterial({ color: 0xa5b8d8, roughness: 0.1, metalness: 0.1, transparent: true, opacity: 0.13, side: T.DoubleSide, depthWrite: false }), 0, a2 + 0.03, 0).castShadow = false;
  const mAr = mat(0xcbd5e1, { emissive: 0x94a3b8, emissiveIntensity: 0.35, roughness: 0.4 }), ar = 0.022;
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz]) => caja(ahoG, ar, AL, ar, mAr, sx * a2, a2 + 0.03, sz * a2));
  [0.03, AL + 0.03].forEach(y => { [-1, 1].forEach(sz => caja(ahoG, AL, ar, ar, mAr, 0, y, sz * a2)); [-1, 1].forEach(sx => caja(ahoG, ar, ar, AL, mAr, sx * a2, y, 0)); });
  caja(ahoG, AL + 0.08, 0.03, AL + 0.08, mat(0x334155), 0, 0.015, 0);
  const mAho = mOro(), monAho = nueva(mAho); monAho.position.set(0, 0.24, 0); ahoG.add(monAho);
  const capaA = pieza(ahoG, new T.BoxGeometry(AL - 0.04, 1, AL - 0.04), mat(ORO, { emissive: ORO, emissiveIntensity: 0.3 }), 0, 0, 0);
  function ahorro(o) {
    ahoG.visible = true; const y = o.y || 0; ahoG.position.set(o.x, y, o.z); ahoG.rotation.y = o.rot || 0;
    const b = o.brillo || 0; mAho.emissiveIntensity = 0.04 + 0.7 * b; mAho.color.setHex(ORO).multiplyScalar(0.5 + 0.5 * Math.min(1, b * 2));
    const n = o.nivel || 0; capaA.visible = n > 0.0005; capaA.scale.y = Math.max(n, 0.0005); capaA.position.y = 0.04 + n / 2;
    monAho.rotation.y = o.giro || 0; return { alto: y + AL + 0.03 };
  }

  // ——— staircase of 5 numbered steps; the steps light up and a line joins them (the «one plan») ———
  const escG = grupo();
  const C_PEL = new T.Color(0x334155), C_ON = new T.Color(0x0f766e), C_T = new T.Color(TURQ), C_NEG = new T.Color(0x000000);
  const pels = [0, 1, 2, 3, 4].map(i => {
    const m = mat(0x334155, { roughness: 0.6 }), h = pelY(i);
    caja(escG, PW - 0.04, h, PD, m, pelX(i), h / 2, 0);
    const nl = lienzo(128, 128); nl.x.fillStyle = 'rgba(9,14,27,.92)'; nl.x.beginPath(); nl.x.roundRect(6, 6, 116, 116, 24); nl.x.fill();
    texto(nl, String(i + 1), '#ffffff', 84, 64, 70); nl.tx.needsUpdate = true;
    const num = new T.Mesh(new T.PlaneGeometry(0.3, 0.3), new T.MeshBasicMaterial({ map: nl.tx, transparent: true, toneMapped: false, depthWrite: false }));
    num.position.set(pelX(i), h - 0.2, PD / 2 + 0.006); escG.add(num);
    const borde = new T.Mesh(new T.BoxGeometry(PW - 0.04, 0.045, 0.045), new T.MeshBasicMaterial({ color: 0x5eead4, transparent: true, toneMapped: false }));
    borde.position.set(pelX(i), h + 0.01, PD / 2 - 0.01); escG.add(borde);
    return { m, num, borde };
  });
  const L0 = new T.Vector3(PX0 - PW / 2, 0.03, PD / 2 + 0.05), L1 = new T.Vector3(PX0 + 4.5 * PW, 5 * PH + 0.03, PD / 2 + 0.05);
  const largoL = L0.distanceTo(L1), dirL = L1.clone().sub(L0).normalize();
  const linea = new T.Mesh(new T.CylinderGeometry(0.06, 0.06, 1, 16), new T.MeshBasicMaterial({ color: 0x5eead4, toneMapped: false }));
  linea.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), dirL); escG.add(linea);
  // o = { luz: [5 × 0..1], nums: (i) → 0..1 (scale of the number), linea: 0..1 }
  function escalera(o) {
    escG.visible = true;
    pels.forEach((p, i) => { const q = Math.max(0, Math.min(1, (o.luz || [])[i] || 0)); p.m.color.copy(C_PEL).lerp(C_ON, q); p.m.emissive.copy(C_NEG).lerp(C_T, 0.32 * q);
      const n = o.nums ? o.nums(i) : 1; p.num.visible = n > 0.01; p.num.scale.setScalar(Math.max(0.001, n));
      p.borde.visible = q > 0.01; p.borde.material.opacity = q; });
    const l = o.linea || 0; linea.visible = l > 0.005; linea.scale.y = Math.max(0.001, largoL * l); linea.position.copy(L0).addScaledVector(dirL, largoL * l / 2);
  }

  // ——— cash cushion (step 1) ———
  const cojG = grupo(), mCoj = mat(TURQ, { emissive: TURQ, emissiveIntensity: 0.35, roughness: 0.75 });
  const coj = pieza(cojG, new T.SphereGeometry(1, 32, 16), mCoj, 0, 0, 0);
  function cojin(o) { const e = Math.max(0.001, o.esc == null ? 1 : o.esc), a = o.aplasta || 0; cojG.visible = e > 0.01; cojG.position.set(o.x, o.y, o.z);
    coj.scale.set(0.56 * e * (1 + 0.14 * a), 0.17 * e * (1 - 0.35 * a), 0.42 * e * (1 + 0.14 * a)); coj.position.y = coj.scale.y; return { tope: o.y + 2 * coj.scale.y }; }

  // ——— a bill (paper) ———
  const facG = grupo(), lf = lienzo(256, 340), fx = lf.x;
  fx.fillStyle = '#f8fafc'; fx.fillRect(0, 0, 256, 340); texto(lf, 'BILL', '#0f172a', 62, 128, 54);
  [110, 146, 182, 218].forEach((y, j) => { fx.fillStyle = '#94a3b8'; fx.fillRect(28, y, j === 3 ? 120 : 200, 14); });
  fx.fillStyle = '#ef4444'; fx.fillRect(28, 262, 200, 40); texto(lf, 'DUE', '#ffffff', 34, 128, 284); lf.tx.needsUpdate = true;
  facG.add(new T.Mesh(new T.PlaneGeometry(0.42, 0.56), new T.MeshStandardMaterial({ map: lf.tx, side: T.DoubleSide, roughness: 0.8, emissive: 0xffffff, emissiveMap: lf.tx, emissiveIntensity: 0.3 })));
  function factura(o) { facG.visible = true; situa(facG, o); }

  // ——— credit card «22%» with its amber frame (detected) ———
  const tarG = grupo(), TW = 1.7, TH = 1.07, lt = lienzo(1024, 644), tx_ = lt.x;
  const gt = tx_.createLinearGradient(0, 0, 1024, 644); gt.addColorStop(0, '#f05252'); gt.addColorStop(1, '#a51d1d');
  tx_.fillStyle = gt; tx_.beginPath(); tx_.roundRect(0, 0, 1024, 644, 56); tx_.fill();
  tx_.fillStyle = '#e8c36a'; tx_.beginPath(); tx_.roundRect(86, 214, 150, 112, 18); tx_.fill(); tx_.strokeStyle = '#a9842d'; tx_.lineWidth = 5; tx_.strokeRect(120, 236, 82, 68);
  tx_.fillStyle = 'rgba(255,255,255,.85)'; tx_.font = '800 52px Inter, sans-serif'; tx_.textAlign = 'left'; tx_.textBaseline = 'middle'; tx_.fillText('INTEREST', 86, 120);
  tx_.fillStyle = '#ffffff'; tx_.font = '900 300px Inter, sans-serif'; tx_.textAlign = 'right'; tx_.fillText('22%', 960, 430);
  tx_.fillStyle = 'rgba(255,255,255,.55)'; [0, 1, 2, 3].forEach(j => tx_.fillRect(86 + j * 120, 560, 92, 22)); lt.tx.needsUpdate = true;
  const mFrente = new T.MeshStandardMaterial({ map: lt.tx, roughness: 0.4, metalness: 0.1, emissive: 0xffffff, emissiveMap: lt.tx, emissiveIntensity: 0.35 });
  const mCanto = mat(0x991b1b, { roughness: 0.4 });
  const tar = new T.Mesh(new T.BoxGeometry(TW, TH, 0.05), [mCanto, mCanto, mCanto, mCanto, mFrente, mCanto]); tar.castShadow = true; tarG.add(tar);
  const mMarco = new T.MeshBasicMaterial({ color: 0xf5b94a, transparent: true, toneMapped: false });
  [[0, TH / 2 + 0.05, TW + 0.2, 0.06], [0, -TH / 2 - 0.05, TW + 0.2, 0.06], [TW / 2 + 0.07, 0, 0.06, TH + 0.04], [-TW / 2 - 0.07, 0, 0.06, TH + 0.04]]
    .forEach(([x, y, w, h]) => { const b = new T.Mesh(new T.BoxGeometry(w, h, 0.03), mMarco); b.position.set(x, y, 0.03); tarG.add(b); });
  const luzT = new T.PointLight(0xf87171, 0, 6, 1.6); luzT.position.set(0, 0, 1.3); tarG.add(luzT); luces.push(luzT);
  const BL = new T.Color(0xffffff), GRo = new T.Color(0x3a3f4a);
  function tarjeta(o) { const op = o.op == null ? 1 : o.op; tarG.visible = op > 0.01; situa(tarG, o);
    const ap = o.apaga || 0; mFrente.color.copy(BL).lerp(GRo, ap); mFrente.emissiveIntensity = 0.35 * (1 - ap);
    mMarco.opacity = o.ambar || 0; mMarco.visible = (o.ambar || 0) > 0.01; luzT.intensity = 2 * (o.luz || 0) * (1 - ap); return tarG; }

  // ——— red chain between two points (it breaks in the middle with rota 0..1) ———
  const cadG = grupo(), NC = 12, mCad = mat(ROJO, { emissive: ROJO, emissiveIntensity: 0.45, roughness: 0.35, metalness: 0.4 });
  const geoEsl = new T.TorusGeometry(0.075, 0.02, 8, 18);
  const esl = Array.from({ length: NC }, () => { const m = new T.Mesh(geoEsl, mCad); m.castShadow = true; cadG.add(m); return m; });
  const vA = new T.Vector3(), vB = new T.Vector3(), vD = new T.Vector3(), EJE_X = new T.Vector3(1, 0, 0);
  function cadena(o) {
    cadG.visible = true; vA.set(o.a[0], o.a[1], o.a[2]); vB.set(o.b[0], o.b[1], o.b[2]); vD.copy(vB).sub(vA); const L = vD.length(); vD.normalize();
    const r = o.rota || 0, op = 1 - tramo(r, 0.6, 1); mCad.transparent = op < 1; mCad.opacity = op; cadG.visible = op > 0.01;
    esl.forEach((m, j) => { let u = (j + 0.5) / NC; const izq = j < NC / 2;
      if (r > 0) u = izq ? u * (1 - 0.4 * r) : 1 - (1 - u) * (1 - 0.4 * r);
      m.position.copy(vA).addScaledVector(vD, L * u);
      m.position.y -= 0.12 * Math.sin(u * Math.PI) * (1 - r) + r * r * 1.3 * Math.max(0, 1 - Math.abs(u - 0.5) * 1.7);
      m.quaternion.setFromUnitVectors(EJE_X, vD); if (j % 2) m.rotateX(Math.PI / 2); m.scale.set(1.35, 1, 1); });
  }

  // ——— the two accounts with tax breaks: 401(k) and IRA, each with a shield ———
  const cueG = grupo();
  const tCuenta = (nombre) => { const l = lienzo(256, 256), x = l.x; const g = x.createLinearGradient(0, 0, 0, 256); g.addColorStop(0, '#14b8a6'); g.addColorStop(1, '#0f766e');
    x.fillStyle = g; x.fillRect(0, 0, 256, 256); x.strokeStyle = 'rgba(255,255,255,.8)'; x.lineWidth = 8; x.strokeRect(10, 10, 236, 236);
    x.fillStyle = '#ffffff'; x.beginPath(); x.moveTo(128, 28); x.lineTo(188, 50); x.lineTo(184, 100); x.quadraticCurveTo(172, 138, 128, 156); x.quadraticCurveTo(84, 138, 72, 100); x.lineTo(68, 50); x.closePath(); x.fill();
    texto(l, '%', '#0f766e', 64, 128, 92); texto(l, nombre, '#ffffff', nombre.length > 4 ? 54 : 66, 128, 204); l.tx.needsUpdate = true; return l.tx; };
  const cubos = ['401(k)', 'IRA'].map(n => { const tx = tCuenta(n); const mf = new T.MeshStandardMaterial({ map: tx, emissive: 0xffffff, emissiveMap: tx, emissiveIntensity: 0.3, roughness: 0.5 });
    const ml = mat(0x0f766e, { emissive: TURQ, emissiveIntensity: 0.25 }); const m = new T.Mesh(new T.BoxGeometry(0.58, 0.58, 0.58), [ml, ml, ml, ml, mf, ml]); m.castShadow = true; cueG.add(m); return m; });
  function cuentas(o) { cueG.visible = true; cueG.position.set(o.x, o.y, o.z);
    cubos.forEach((m, j) => { const q = Math.max(0.001, (o.q || [1, 1])[j]); m.visible = q > 0.01; m.scale.setScalar(q); m.position.set((j - 0.5) * 0.7, 0.29 * q, 0); m.rotation.y = 0.12 - 0.24 * j; }); }

  // ——— step 5: open, turquoise-framed area with coin stacks that keep growing ———
  const plaG = grupo(), lp = lienzo(256, 360);
  lp.x.fillStyle = 'rgba(45,212,191,.14)'; lp.x.strokeStyle = '#5eead4'; lp.x.lineWidth = 10; lp.x.beginPath(); lp.x.roundRect(8, 8, 240, 344, 28); lp.x.fill(); lp.x.stroke(); lp.tx.needsUpdate = true;
  const mPla = new T.MeshBasicMaterial({ map: lp.tx, transparent: true, depthWrite: false, toneMapped: false });
  const pla = new T.Mesh(new T.PlaneGeometry(PW - 0.16, PD - 0.2), mPla); pla.rotation.x = -Math.PI / 2; plaG.add(pla);
  function plataforma(o) { plaG.visible = true; plaG.position.set(o.x, o.y + 0.012, o.z); mPla.opacity = o.op == null ? 1 : o.op; }
  const mDisco = mat(ORO, { metalness: 0.6, roughness: 0.3, emissive: ORO, emissiveIntensity: 0.22 });
  const geoD = new T.CylinderGeometry(0.15, 0.15, 0.055, 28);
  const discosP = pool(40, () => { const m = new T.Mesh(geoD, mDisco); m.castShadow = true; m.receiveShadow = true; return m; });
  // o = { x, y, z, n: [n0, n1, n2] } coins per stack (the decimal part is the coin falling onto the stack)
  function pilas(o) { (o.n || []).forEach((n, j) => { const x = o.x + (j - 1) * 0.36, z = o.z + (j === 1 ? -0.12 : 0.08), lleno = Math.floor(n), fr = n - lleno;
    for (let i = 0; i < lleno; i++) { const d = tomar(discosP); if (d) { d.position.set(x, o.y + 0.03 + i * 0.058, z); d.rotation.set(0, i * 0.7, 0); } }
    if (fr > 0.02 && lleno < 12) { const d = tomar(discosP); if (d) { d.position.set(x, o.y + 0.03 + lleno * 0.058 + 1.4 * Math.pow(1 - fr, 2), z); d.rotation.set(0.5 * (1 - fr), 0, 0.3 * (1 - fr)); } } }); }

  // ——— 10 red blocks (a year of match each) ———
  const bloG = grupo(), mBlo = mat(ROJO, { emissive: ROJO, emissiveIntensity: 0.35, roughness: 0.45 });
  const blqs = Array.from({ length: 10 }, (_, i) => caja(bloG, 0.62, 0.19, 0.42, mBlo, 0, 0.1 + i * 0.205, 0));
  function bloques(o) { bloG.visible = true; bloG.position.set(o.x, 0, o.z); bloG.rotation.y = o.rot || 0;
    blqs.forEach((m, i) => { const q = Math.max(0, Math.min(1, (o.n || 0) - i)); m.visible = q > 0.01; m.scale.setScalar(Math.max(0.001, q)); m.position.y = 0.1 + i * 0.205 + 0.45 * (1 - q); }); }

  // ——— phone «FULL MATCH: YES» ———
  const movG = grupo(), lm = lienzo(256, 480), mx = lm.x;
  mx.fillStyle = '#0a1120'; mx.beginPath(); mx.roundRect(0, 0, 256, 480, 30); mx.fill();
  texto(lm, '401(k)', '#94a3b8', 30, 128, 52, 800); texto(lm, 'FULL MATCH', '#ffffff', 34, 128, 112);
  mx.fillStyle = '#2dd4bf'; mx.beginPath(); mx.arc(128, 248, 78, 0, Math.PI * 2); mx.fill();
  mx.strokeStyle = '#06201c'; mx.lineWidth = 20; mx.lineCap = 'round'; mx.lineJoin = 'round'; mx.beginPath(); mx.moveTo(90, 250); mx.lineTo(118, 280); mx.lineTo(170, 214); mx.stroke();
  texto(lm, 'YES', '#5eead4', 76, 128, 400); lm.tx.needsUpdate = true;
  caja(movG, 0.2, 0.37, 0.024, mat(0x0b1020, { roughness: 0.3, metalness: 0.4 }), 0, 0, 0);
  const pantM = new T.Mesh(new T.PlaneGeometry(0.18, 0.34), new T.MeshBasicMaterial({ map: lm.tx, toneMapped: false })); pantM.position.z = 0.0135; movG.add(pantM);
  function movil(o) { movG.visible = true; situa(movG, o); }

  // ——— employer's badge ———
  const creG = grupo(), lc = lienzo(96, 128); lc.x.fillStyle = '#f8fafc'; lc.x.fillRect(0, 0, 96, 128); lc.x.fillStyle = '#14b8a6'; lc.x.fillRect(0, 0, 96, 30);
  lc.x.fillStyle = '#94a3b8'; lc.x.fillRect(14, 74, 68, 10); lc.x.fillRect(14, 94, 46, 10); lc.x.fillStyle = '#cbd5e1'; lc.x.beginPath(); lc.x.arc(48, 52, 14, 0, Math.PI * 2); lc.x.fill(); lc.tx.needsUpdate = true;
  creG.add(new T.Mesh(new T.PlaneGeometry(0.12, 0.16), new T.MeshStandardMaterial({ map: lc.tx, emissive: 0xffffff, emissiveMap: lc.tx, emissiveIntensity: 0.35, roughness: 0.6, side: T.DoubleSide })));
  function credencial(o) { creG.visible = true; creG.position.set(o.x, o.y, o.z); creG.rotation.set(0, o.ry || 0, 0); }

  function apagar() { objs.forEach(g => { g.visible = false; }); pools.forEach(a => { a.forEach(o => { o.visible = false; }); a.i = 0; }); luces.forEach(l => { l.intensity = 0; }); }
  return { moneda, media, jarra, ahorro, escalera, cojin, factura, tarjeta, cadena, cuentas, plataforma, pilas, bloques, movil, credencial, apagar };
})();
W3.X = X3;
`;

const an = function (s, e, el) { aparecen(s, e, el); };
const fuente = (txt) => `<div class="fuente">${txt}</div>`;
const SUPUESTOS = fuente('Example · common 401(k) match: 50¢ per $1, up to 6% of pay ·<br>avg savings 0.38% APY (FDIC, Oct 19 2026) · illustrative, not advice');
const EDU = fuente('Educational only · not financial advice');

const ESCENAS = [
  // 0 · Hook (full frame 0): «$1 → $1.50 vs $1.004» on top; the $1 goes into the 401(k) jar and the employer adds 50¢ (+50¢);
  //     the savings box gets a tiny +0.4¢. In the {pop}, the +50¢ bounces again.
  { html: () => `<div class="titular">$1 → <b class="t">$1.50</b><span class="vs">vs</span><b class="g">$1.004</b></div>${SUPUESTOS}`,
    anim: function (s, e, el) {
      const M = e.seg.flatMap(g => g.marcas), m0 = M[0] != null ? M[0] : 1.3, m2 = M[2] != null ? M[2] : 5.4;
      const p = Math.max(rebote(tramo(s, m0 - 0.05, m0 + 0.3)) * (1 - tramo(s, m0 + 0.45, m0 + 1.1)), rebote(tramo(s, m2 - 0.05, m2 + 0.3)) * (1 - tramo(s, m2 + 0.5, m2 + 1.3)));
      const b = el.querySelector('.titular .t'); b.style.transform = 'scale(' + (1 + 0.16 * p) + ')'; b.style.textShadow = '0 0 ' + (8 + 30 * p) + 'px rgba(94,234,212,' + (0.25 + 0.55 * p) + ')';
    } },
  // 1 · Answer: a common match (50¢ per $1, up to 6% of pay). The employer adds half a coin per coin up to the CAP line and stops.
  //     Then the savings box: avg 0.38% → $1.004.
  { html: () => `<div class="tj turq" data-t="translateX(-50%)" data-m="0" data-hasta="2" style="top:478px"><small>COMMON 401(k) MATCH</small>
        <span class="l">50¢ per $1 · up to <span class="t">6% of pay</span></span></div>
      <div class="tj" data-t="translateX(-50%)" data-m="2" style="top:478px"><small>AVERAGE SAVINGS ACCOUNT</small>
        <span class="l">0.38% a year · $1 → <span class="g">$1.004</span></span></div>${SUPUESTOS}`, anim: an },
  // 2 · The usual order: 5 numbered steps. Step 1: cash cushion catches a bill before it lands on the card. Step 2: full match.
  { html: () => `<div class="chip turq" data-t="translateX(-50%)" data-m="-1" style="top:500px">The usual order</div>${EDU}`, anim: an },
  // 3 · Open question: a giant 22% card swallows coins; amber frame (detected) and the hero hesitates («?»).
  { html: () => fuente('Federal Reserve G.19 · Q3 2026 (preliminary):<br>22.36% on card accounts assessed interest'), anim: null },
  // 4 · Answer and step 3: +50% · FREE MONEY · once it vests; then he breaks the red chain, the card goes out, step 3 lights up.
  { html: () => `<div class="tj amb" data-t="translateX(-50%)" data-m="1" style="top:478px"><small>GOOD TO KNOW</small>
        <span class="l p">Match may vest over time</span><span class="l p">401(k) withdrawals before 59½: <span class="a">usually tax + 10% penalty</span></span></div>
      ${fuente('Example match: 50¢ per $1 · FINRA, “Why Leave Money on the Table?”')}`, anim: an },
  // 5 · Steps 4 and 5: two accounts with tax breaks (401(k), IRA) and the IRS limits in a label; then INVESTED, coins stacking.
  { html: () => `<div class="tj turq" data-t="translateX(-50%)" data-m="0" style="top:478px"><small>2026 LIMITS · IRS, NOV 13 2025</small>
        <span class="l">401(k) <span class="t">$24,500</span> · IRA <span class="t">$7,500</span></span><span class="l p">more at 50+</span></div>${EDU}`, anim: an },
  // 6 · PEAK: four in a row in front of «Retirement plan»; one turns amber and leaves. $1,800 a year → 10 blocks → $18,000.
  { html: () => `<div class="chip amb" data-t="translateX(-50%)" data-m="-1" data-hasta="1" style="top:500px">Over 1 in 4 don’t join</div>
      <div class="contador" data-t="translateX(-50%)" style="top:486px">$1,800<small>/yr</small></div>
      <div class="mini" data-t="translateX(-50%)" data-m="4" style="top:622px">before any growth</div>
      <div class="tj" data-t="translateX(-50%)" data-m="1" data-hasta="2" style="top:478px"><small>EXAMPLE</small><span class="l p">$60,000 salary · 50% match up to 6%</span></div>
      ${fuente('BLS, March 2026: 72% of private-sector workers with a plan take part<br>example assumes flat salary, no returns')}`,
    anim: function (s, e, el) {
      aparecen(s, e, el);
      const M = e.seg.flatMap(g => g.marcas), m2 = M[2] != null ? M[2] : 7, m3 = M[3] != null ? M[3] : 9.5;
      const c = el.querySelector('.contador'), p = rebote(tramo(s, m2 - 0.1, m2 + 0.3)), u = sale(tramo(s, m3 - 0.05, m3 + 1.1));
      const anos = 1 + Math.round(9 * u), fin = rebote(tramo(s, m3 + 1.05, m3 + 1.35)) * (1 - tramo(s, m3 + 1.5, m3 + 2.2));
      c.style.opacity = Math.min(1, p * 1.5); c.style.transform = 'translateX(-50%) scale(' + (0.7 + 0.3 * p + 0.1 * fin) + ')';
      c.innerHTML = '$' + (1800 * anos).toLocaleString('en-US') + '<small>' + (s < m3 - 0.05 ? '/yr' : ' · ' + anos + (anos > 1 ? ' years' : ' year')) + '</small>';
    } },
  // 7 · Close: the 5 steps light up and a single line joins them: SAVE + INVEST = ONE PLAN. Today: the phone says FULL MATCH: YES.
  //     The last shot is the hero next to the 401(k) jar, like frame 0 (loop). No «follow» card.
  { html: () => `<div class="rotulo" data-t="translateX(-50%)" data-m="1" style="top:500px">SAVE + INVEST = ONE PLAN</div>
      <div class="tj turq" data-t="translateX(-50%)" data-m="2" style="top:1328px"><small>TODAY</small><span class="l">Check you’re getting your <span class="t">full match</span></span></div>`, anim: an }
];

const TRES = function (t, k, s, e, W) {
  const X = W.X, T = W.T; X.apagar();
  const p = Math.min(1, s / (e.fin - e.ini)), M = e.seg.flatMap(g => g.marcas);
  const mk = (j, def) => e.ini + (M[j] != null ? M[j] : def);   // mark j of this scene, in global time
  const q = (a, d) => sale(tramo(t, a, a + (d || 0.45)));
  const bote = (a, d) => rebote(tramo(t, a, a + (d || 0.35)));
  const TQ = '#5eead4', AMB = '#f5b94a', GRIS = '#94a3b8', BLANCO = '#e2e8f0';
  const fuera = { x: -60, z: -60, esc: 0 };
  const mezcla = (P, Q, u) => P.map((v, j) => v + (Q[j] - v) * u);
  const camLerp = (P, Q, u) => W.camara(...mezcla(P, Q, u));
  const arco = (P, Q, h, u) => [P[0] + (Q[0] - P[0]) * u, P[1] + (Q[1] - P[1]) * u + 4 * h * u * (1 - u), P[2] + (Q[2] - P[2]) * u];
  const manoDe = (m, lado) => { m.g.updateMatrixWorld(true); const v = new T.Vector3(); (lado === 'izq' ? m.izq : m.der).codo.children[2].getWorldPosition(v); return v; };
  const pecho = (m) => { m.g.updateMatrixWorld(true); const v = new T.Vector3(0, 1.3, 0.2); m.g.localToWorld(v); return { x: v.x, y: v.y, z: v.z, ry: m.g.rotation.y }; };
  const ang = (a, b, g) => a + ((((b - a + Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI) - Math.PI) * g;
  // Walkers far behind (they give life to the shot).
  const aceras = (i, a, n, z0) => { if (i >= n) return fuera; const dir = i % 2 ? 1 : -1, u = (((t * a.vel + a.u0) % 26) + 26) % 26 - 13;
    return { x: dir * u, z: z0 - (i % 3) * 1.5, rot: dir > 0 ? Math.PI / 2 : -Math.PI / 2, amp: 1, fase: t * a.vel * 4.5, esc: Math.min(1, (13 - Math.abs(u)) / 2) }; };
  let directo = (i, a) => aceras(i, a, 5, -9);
  const despues = [];   // what depends on the mannequins' pose (after W.multitud)
  const salto = (A, B, t0, d) => { const u = tramo(t, t0, t0 + (d || 0.5)), v = sale(u); return { x: A[0] + (B[0] - A[0]) * v, y: A[1] + (B[1] - A[1]) * v + 0.32 * Math.sin(Math.PI * u), z: A[2] + (B[2] - A[2]) * v, u }; };
  // Scenes 0 and 1: 401(k) jar on the left, savings box on the right, hero in front, employer behind the jar.
  const JX = -1.1, JZ = 0.15, BX = 1.25, BZ = 0.1, HX = 0.3, HZ = 1.3, EX = -0.55, EZ = -0.22, ER = -0.67;
  const empleado = (i, a) => i === 0 ? { x: EX, z: EZ, rot: ER, amp: 0, color: '#f8fafc', cq: 0.35, brillo: 0.06 } : aceras(i - 1, a, 5, -9);
  // Staircase (scenes 2–5 and 7): the jar on step 2 and the hero to its right; what stays on each step.
  const J2 = [pelX(1) - 0.33, pelY(1), -0.3], H2 = [pelX(1) + 0.36, pelY(1), 0.45], CJ = [pelX(0) - 0.32, pelY(0), -0.05];
  const jarraLlena = (o) => X.jarra(Object.assign({ x: J2[0], y: J2[1], z: J2[2], yo: 0.42, match: 0.21, lineas: [{ h: 0.63, color: TQ, op: 0.8 }] }, o || {}));
  const pelda1 = () => { const C = X.cojin({ x: CJ[0], y: CJ[1] + 0.02, z: CJ[2] }); X.factura({ x: CJ[0] + 0.04, y: C.tope + 0.012, z: CJ[2], rx: -Math.PI / 2 + 0.06, rz: 0.35 }); return C; };

  if (k === 0) {
    const m0 = mk(0, 1.3), m1 = mk(1, 3.2), m2 = mk(2, 5.4), m3 = mk(3, 6.2);
    const tT = e.ini + 0.3, tL = tT + 0.55, tD = Math.max(tL + 0.1, m0 - 0.4), tD2 = tD + 0.35;
    const pop = bote(m2 - 0.05, 0.3) * (1 - 0.45 * tramo(t, m2 + 0.5, m2 + 1.3));
    const J = X.jarra({ x: JX, z: JZ, yo: 0.34 * q(tL, 0.3), match: 0.17 * q(tD2, 0.3),
      brillo: 0.3 * bote(tD2, 0.3) * (1 - tramo(t, tD2 + 0.4, tD2 + 1)) + 0.55 * q(m3 - 0.1, 0.4) + 0.3 * pop });
    const A = X.ahorro({ x: BX, z: BZ, brillo: 0.14 * bote(m1 + 0.15, 0.3) * (1 - tramo(t, m1 + 0.6, m1 + 1.4)), giro: 0.35 * Math.sin(t * 0.8) });
    // The hero tosses his dollar into the jar.
    const g0 = -0.55 + 0.04 * Math.sin(t * 0.9);
    W.heroe({ x: HX, z: HZ, gira: g0, luz: 0 });
    const H = W.H, sw = Math.sin(Math.PI * tramo(t, tT - 0.3, tT + 0.12)), baja = q(tL, 0.5);
    H.der.hombro.rotation.x = (-0.9 - 0.5 * sw) * (1 - baja); H.der.codo.rotation.x = -0.8 * (1 - baja) - 0.22 * baja;
    const mano = manoDe(H), R = [JX, J.ranura, JZ];
    if (t < tT) X.moneda({ x: mano.x, y: mano.y + 0.1, z: mano.z + 0.05, ry: 0.25 * Math.sin(t * 2.2) });
    else if (t < tL) { const u = (t - tT) / (tL - tT), P = arco([mano.x, mano.y + 0.1, mano.z], [R[0], R[1] - 0.1, R[2]], 0.55, u); X.moneda({ x: P[0], y: P[1], z: P[2], rz: -u * 6.28 }); }
    directo = empleado;
    despues.push(() => {
      const E = W.gente[0], sube = 1 - q(tD2 + 0.1, 0.5);
      E.der.hombro.rotation.x = -1.25 * sube; E.der.codo.rotation.x = -0.35 * sube - 0.2;
      const mE = manoDe(E, 'der');
      if (t < tD) X.media({ x: mE.x, y: mE.y + 0.05, z: mE.z, ry: 0.2 });
      else if (t < tD2) { const u = (t - tD) / (tD2 - tD), P = arco([mE.x, mE.y + 0.05, mE.z], [JX, J.ranura - 0.1, JZ], 0.1, u); X.media({ x: P[0], y: P[1], z: P[2] }); }
      X.credencial(pecho(E));
    });
    W.rotulo('m50', '+50¢', JX - 0.1, J.alto + 0.45 + 0.03 * Math.sin(t * 4), JZ + 0.2, Math.min(1, 1.4 * bote(tD2, 0.3)), TQ, 0.4 + 0.16 * pop);
    W.rotulo('emp', 'EMPLOYER', EX + 0.1, 2.25, EZ, 1, GRIS, 0.19);
    W.rotulo('aho', 'SAVINGS', BX, A.alto + 0.25, BZ, 1, GRIS, 0.27);
    W.rotulo('m04', '+0.4¢', BX, A.alto + 0.62, BZ, Math.min(1, 1.4 * bote(m1 + 0.15, 0.3)), GRIS, 0.16);
    camLerp([0.08, 1.75, 8.4, 0.08, 1.42, 0], [0.05, 1.72, 8.0, 0.05, 1.42, 0], p);
  } else if (k === 1) {
    const m0 = mk(0, 1.6), m1 = mk(1, 3.4), m2 = mk(2, 4.6);
    // 8 coins of yours (1% of pay each); the employer adds half a coin for each of the first 6 (the 6th lands at «a cap»).
    const t0 = e.ini + 0.3, DV = 0.5, N = 8, U = 0.075, dt = Math.max(0.34, (m1 + 0.3 - 0.4 - DV - t0) / 5);
    const lanz = Array.from({ length: N }, (_, j) => t0 + j * dt), llega = (j) => lanz[j] + DV, cae = (j) => llega(j) + 0.04, cae2 = (j) => cae(j) + 0.34;
    let yo = 0, mt = 0; lanz.forEach((_, j) => { yo += U * q(llega(j), 0.18); if (j < 6) mt += U / 2 * q(cae2(j), 0.18); });
    const tope = cae2(5), cap = bote(tope, 0.35) * (1 - 0.4 * tramo(t, tope + 0.5, tope + 1.2));
    const J = X.jarra({ x: JX, z: JZ, yo, match: mt, lineas: [{ h: 6 * U, color: '#ffffff', op: 0.35 + 0.65 * q(m0, 0.4) }], brillo: 0.35 * cap });
    const A = X.ahorro({ x: BX, z: BZ, nivel: 0.006 * q(m2 + 0.3, 1.2), brillo: 0.12 * bote(m2 + 0.4, 0.3) * (1 - tramo(t, m2 + 0.9, m2 + 1.6)), giro: 0.35 * Math.sin(t * 0.8) });
    W.heroe({ x: HX, z: HZ, gira: -0.55, luz: 0 });
    const H = W.H; let sw = 0; lanz.forEach(tj => { sw = Math.max(sw, Math.sin(Math.PI * tramo(t, tj - 0.25, tj + 0.08))); });
    const baja = q(lanz[N - 1] + 0.3, 0.45);
    H.der.hombro.rotation.x = (-0.9 - 0.45 * sw) * (1 - baja); H.der.codo.rotation.x = -0.8 * (1 - baja) - 0.22 * baja;
    const mano = manoDe(H), R = [JX, J.ranura, JZ];
    lanz.forEach((tj) => { if (t >= tj && t < tj + DV) { const u = (t - tj) / DV, P = arco([mano.x, mano.y + 0.1, mano.z], [R[0], R[1] - 0.1, R[2]], 0.28, u); X.moneda({ x: P[0], y: P[1], z: P[2], rz: -u * 6.28 }); } });
    const sig = lanz.findIndex(tj => tj > t); if (sig >= 0 && (sig === 0 || t > lanz[sig - 1] + 0.12)) X.moneda({ x: mano.x, y: mano.y + 0.1, z: mano.z + 0.05 });
    directo = empleado;
    despues.push(() => {
      // After the 6th he stops: lowers his arm and folds his arms, even though the hero keeps putting money in.
      const E = W.gente[0], fin = q(tope + 0.1, 0.45);
      E.der.hombro.rotation.x = -1.25 * (1 - fin) - 0.75 * fin; E.der.codo.rotation.x = -0.35 * (1 - fin) - 1.75 * fin; E.der.hombro.rotation.z = -0.1 + 0.42 * fin;
      E.izq.hombro.rotation.x = -0.75 * fin; E.izq.codo.rotation.x = -0.2 - 1.55 * fin; E.izq.hombro.rotation.z = 0.1 - 0.42 * fin;
      const mE = manoDe(E, 'der');
      for (let j = 0; j < 6; j++) if (t >= cae(j) && t < cae2(j)) { const u = (t - cae(j)) / (cae2(j) - cae(j)), P = arco([mE.x, mE.y + 0.05, mE.z], [JX, J.ranura - 0.1, JZ], 0.1, u); X.media({ x: P[0], y: P[1], z: P[2] }); }
      const sigM = [0, 1, 2, 3, 4, 5].findIndex(j => cae(j) > t);
      if (sigM >= 0 && (sigM === 0 || t > cae2(sigM - 1) - 0.12)) X.media({ x: mE.x, y: mE.y + 0.05, z: mE.z, ry: 0.2 });
      X.credencial(pecho(E));
    });
    W.rotulo('cap', 'CAP', JX, J.y0 + 6 * U, JZ + 0.55, Math.min(1, 0.35 + 0.65 * q(m0, 0.4)), BLANCO, 0.24 * (1 + 0.25 * cap));
    W.rotulo('emp', 'EMPLOYER', EX + 0.1, 2.12, EZ, 1, GRIS, 0.17);
    W.rotulo('aho', 'SAVINGS', BX, A.alto + 0.22, BZ, 1, GRIS, 0.22);
    W.rotulo('a038', '+0.4¢ a year', BX, A.alto + 0.5, BZ, q(m2 + 0.35, 0.35), GRIS, 0.15);
    const pan = sale(tramo(t, m2 - 0.15, m2 + 0.85));
    camLerp(mezcla([-0.3, 1.6, 6.9, -0.32, 1.22, 0], [-0.25, 1.58, 6.5, -0.28, 1.2, 0], Math.min(1, s / 4)), [1.05, 1.35, 5.2, 1.15, 0.95, 0], pan);
  } else if (k === 2) {
    const m0 = mk(0, 1.3), m1 = mk(1, 2.4), m2 = mk(2, 4.0), m3 = mk(3, 6.0);
    X.escalera({ luz: [q(m1 + 0.1, 0.4), q(m3 + 0.55, 0.4), 0, 0, 0], nums: (i) => bote(m0 - 0.1 + i * 0.13, 0.3) });
    // Step 2: the jar fills up to the full match on «Two».
    const lleno = q(m3 + 0.55, 0.9);
    const J = X.jarra({ x: J2[0], y: J2[1], z: J2[2], yo: 0.42, match: 0.21 * lleno, lineas: [{ h: 0.63, color: TQ, op: q(m3 + 0.15, 0.4) }],
      brillo: 0.5 * bote(m3 + 1.4, 0.3) * (1 - tramo(t, m3 + 1.8, m3 + 2.4)) });
    // Step 1: a red card; the cushion pops over it on «One» and catches the bill on «so surprises».
    X.tarjeta({ x: CJ[0], y: CJ[1] + 0.03, z: CJ[2] + 0.1, rx: -Math.PI / 2, rz: 0.25, esc: 0.36 });
    const cae = tramo(t, m2 + 0.05, m2 + 0.6), toca = bote(m2 + 0.6, 0.22) * (1 - tramo(t, m2 + 0.82, m2 + 1.2));
    const C = X.cojin({ x: CJ[0], y: CJ[1] + 0.02, z: CJ[2], esc: bote(m1 - 0.05, 0.35), aplasta: toca });
    if (t > m2 - 0.05) X.factura({ x: CJ[0] + 0.04, y: C.tope + 0.012 + 3.3 * (1 - cae * cae), z: CJ[2], rx: (-Math.PI / 2 + 0.06) * Math.min(1, cae * 1.3), ry: 0.4 * Math.sin(cae * 7) * (1 - cae), rz: 0.35 });
    W.rotulo('cash', 'CASH', CJ[0], C.tope + 0.34, CJ[2] + 0.25, Math.min(1, 1.4 * bote(m1, 0.3)), TQ, 0.3);
    W.rotulo('full', 'FULL MATCH', J2[0], J.y0 + 0.63, J2[2] + 0.55, q(m3 + 0.15, 0.4), TQ, 0.19);
    // The hero walks to step 1, steps up on «One» and up to step 2 on «Two».
    const W0 = [pelX(0) - 1.7, 0, 1.45], W1 = [pelX(0) - 0.98, 0, 1.45], P1 = [pelX(0) + 0.38, pelY(0), 0.45];
    let pos, amp = 0, gira = 0.55;
    if (t < m1) { const u = tramo(t, e.ini, m1 - 0.2); pos = { x: W0[0] + (W1[0] - W0[0]) * u, y: 0, z: W0[2] }; amp = u < 1 ? 1 : 0; gira = 1.45 - 0.9 * q(m1 - 0.3, 0.3); }
    else if (t < m3) pos = salto(W1, P1, m1, 0.5); else pos = salto(P1, H2, m3, 0.5);
    W.heroe({ x: pos.x, y: pos.y, z: pos.z, gira, amp, fase: t * 7, luz: 0.15 + 0.2 * q(m1, 0.4) + 0.2 * q(m3 + 0.5, 0.4) });
    camLerp([-1.85, 2.7, 9.3, -1.8, 1.6, 0], [-1.6, 2.75, 8.7, -1.55, 1.65, 0], p);
  } else if (k === 3) {
    const m0 = mk(0, 1.9), m1 = mk(1, 2.6);
    X.escalera({ luz: [1, 1, 0, 0, 0] }); jarraLlena(); pelda1();
    const CX = 0.4, CY = pelY(1) + 1.5, CZ = -0.15, entra = sale(tramo(t, e.ini + 0.02, e.ini + 0.6)), amb = q(m1 - 0.05, 0.3);
    const pop22 = bote(m0 - 0.05, 0.3) * (1 - 0.5 * tramo(t, m0 + 0.4, m0 + 1));
    X.tarjeta({ x: CX + 3.2 * (1 - entra), y: CY + 0.04 * Math.sin(t * 2), z: CZ, ry: -0.28, rz: 0.06 * Math.sin(t * 1.3) + 0.25 * (1 - entra), esc: 0.98 + 0.08 * pop22, ambar: amb * (0.75 + 0.25 * Math.sin(t * 8)), luz: 0.6 });
    // Coins that the card swallows.
    for (let j = 0; j < 4; j++) { const per = 1.3, t0 = e.ini + 0.45 + j * per / 4; if (t < t0) continue; const u = ((t - t0) % per) / per;
      const Pi = [CX + 1.3 - 0.3 * j, 4.1, 0.5], Pf = [CX - 0.1, CY + 0.05, CZ + 0.06];
      X.moneda({ x: Pi[0] + (Pf[0] - Pi[0]) * u, y: Pi[1] + (Pf[1] - Pi[1]) * u, z: Pi[2] + (Pf[2] - Pi[2]) * u, rz: u * 8, ry: 0.4, esc: 0.85 * (1 - tramo(u, 0.72, 1)) }); }
    // He hesitates: looks at the jar and at the card, with an amber «?».
    const duda = q(m1 - 0.1, 0.3), osc = Math.sin((t - m1) * 3.4);
    W.heroe({ x: H2[0], y: H2[1], z: H2[2], gira: 0.15 + duda * 0.95 * osc, luz: 0.5 });
    W.rotulo('preg', '?', H2[0], H2[1] + 2.35 + 0.04 * Math.sin(t * 5), H2[2], Math.min(1, 1.4 * bote(m1 - 0.1, 0.35)), AMB, 0.55 + 0.1 * Math.abs(osc) * duda);
    camLerp([-0.4, 2.65, 8.7, -0.45, 2.3, 0], [-0.35, 2.62, 8.1, -0.4, 2.32, 0], p);
  } else if (k === 4) {
    const m0 = mk(0, 1.5), m1 = mk(1, 2.4), m2 = mk(2, 3.6), m3 = mk(3, 4.3);
    X.escalera({ luz: [1, 1, q(m3 + 0.35, 0.4), 0, 0] }); pelda1();
    const ding = bote(m0 - 0.05, 0.3), luzJ = q(m0 - 0.05, 0.3);
    const J = jarraLlena({ brillo: luzJ * (0.75 + 0.25 * Math.sin(t * 6)) * (1 - 0.45 * q(m2, 0.5)) + 0.3 * ding });
    const CX = 0.4, CY = pelY(1) + 1.5, CZ = -0.15, rompe = q(m3, 0.45), va = tramo(t, m3 + 0.15, m3 + 0.8);
    const tg = X.tarjeta({ x: CX + 0.6 * va, y: CY - 3.4 * va * va, z: CZ, ry: -0.28 + 0.6 * va, rz: 0.06 * Math.sin(t * 1.3) - 1.2 * va, esc: 0.98 * (1 - 0.4 * va),
      ambar: 0.7 * (1 - q(m2, 0.4)), apaga: q(m3 + 0.05, 0.3), luz: 0.6, op: 1 - tramo(va, 0.75, 1) });
    // He turns to the card on «Then three» and breaks the chain on «clear the cards».
    const gira = 0.15 + 0.75 * q(m2 - 0.05, 0.35);
    W.heroe({ x: H2[0], y: H2[1], z: H2[2], gira, luz: 0.6 + 0.2 * rompe });
    const H = W.H, jala = Math.sin(Math.PI * tramo(t, m3 - 0.3, m3 + 0.35));
    H.der.hombro.rotation.x = H.izq.hombro.rotation.x = 0.55 * jala; H.der.codo.rotation.x = H.izq.codo.rotation.x = -0.3 - 0.9 * jala;
    tg.updateMatrixWorld(true); const vb = new T.Vector3(-0.78, -0.48, 0); tg.localToWorld(vb);
    X.cadena({ a: [H2[0] + 0.1 + 0.06 * jala, H2[1] + 0.98, H2[2] + 0.02], b: [vb.x, vb.y, vb.z], rota: rompe });
    W.rotulo('p50', '+50%', J2[0] + 0.05, J.alto + 1.0, J2[2], Math.min(1, 1.4 * ding), TQ, 0.5 + 0.08 * ding * (1 - tramo(t, m0 + 0.3, m0 + 0.8)));
    W.rotulo('free', 'FREE MONEY', J2[0] + 0.05, J.alto + 0.58, J2[2], Math.min(1, 1.4 * bote(m1 - 0.05, 0.3)), TQ, 0.27);
    W.rotulo('vest', 'once it vests', J2[0] + 0.05, J.alto + 0.3, J2[2], q(m1 + 0.35, 0.35), GRIS, 0.17);
    camLerp([-0.55, 2.65, 8.6, -0.6, 2.3, 0], [-0.45, 2.62, 8.0, -0.5, 2.32, 0], p);
  } else if (k === 5) {
    const m0 = mk(0, 2.0), m1 = mk(1, 3.2);
    X.escalera({ luz: [1, 1, 1, q(e.ini + 0.4, 0.4), q(m1 + 0.15, 0.4)] }); jarraLlena(); pelda1();
    const P3 = [pelX(2) + 0.2, pelY(2), 0.45], P4 = [pelX(3) + 0.42, pelY(3), 0.55];
    const pos = salto(P3, P4, e.ini + 0.05, 0.5), mira = q(m1 - 0.1, 0.4);
    W.heroe({ x: pos.x, y: pos.y, z: pos.z, gira: 0.5 + 0.75 * mira, luz: 0.75 + 0.25 * q(m1, 0.4), senala: 0.9 * mira });
    X.cuentas({ x: pelX(3) - 0.22, y: pelY(3), z: -0.35, q: [bote(e.ini + 0.45, 0.35), bote(e.ini + 0.65, 0.35)] });
    W.rotulo('tax', 'TAX BREAKS', pelX(3) - 0.22, pelY(3) + 0.98, -0.35, q(e.ini + 0.85, 0.35), TQ, 0.27);
    // Step 5: invested, coins that keep stacking up.
    X.plataforma({ x: pelX(4), y: pelY(4), z: 0, op: q(m1 + 0.1, 0.4) });
    const cre = (j) => 9 * tramo(t, m1 + 0.35 + 0.2 * j, m1 + 3.2 + 0.2 * j);
    X.pilas({ x: pelX(4) + 0.2, y: pelY(4), z: -0.35, n: [cre(0), cre(1), cre(2)] });
    W.rotulo('inv', 'INVESTED', pelX(4) + 0.2, pelY(4) + 1.3, -0.35, q(m1 + 0.25, 0.35), TQ, 0.33);
    W.rotulo('brk', 'brokerage account', pelX(4) + 0.2, pelY(4) + 0.98, -0.35, q(m1 + 0.4, 0.35), GRIS, 0.18);
    const pan = sale(tramo(t, m1 - 0.2, m1 + 1.0));
    camLerp(mezcla([0.8, 3.0, 8.6, 0.8, 2.55, 0], [0.9, 3.0, 8.3, 0.9, 2.6, 0], Math.min(1, s / 3)), [2.0, 3.3, 8.5, 2.0, 2.75, 0], pan);
  } else if (k === 6) {
    const m0 = mk(0, 2.4), m1 = mk(1, 3.4), m2 = mk(2, 7.0), m3 = mk(3, 9.6);
    const DX = 0.25, DZ = -2.6;
    W.puerta({ x: DX, z: DZ, color: 0x2dd4bf, cq: 1, luz: 0.85 + 0.15 * Math.sin(t * 3) });
    W.rotulo('plan', 'RETIREMENT PLAN', DX, 2.98, DZ, 1, TQ, 0.27);
    // Four in a row in front of the plan; the first one turns amber, turns around and walks away; the other three join (turquoise).
    const FILA = [-1.3, -0.45, 0.4, 1.25], FZ = -0.35, SAL = [-1.7, 0.6];
    const vuelta = q(m0 - 0.05, 0.5), anda = tramo(t, m0 + 0.35, m0 + 2.1), ambar = q(m0 - 0.15, 0.3);
    const haciaSal = Math.atan2(SAL[0] - FILA[0], SAL[1] - FZ);
    directo = (i, a) => {
      if (i === 0) { const v = sale(anda), rot = anda >= 1 ? ang(haciaSal, 0.45, q(m0 + 2.1, 0.4)) : ang(Math.PI, haciaSal, vuelta);
        return { x: FILA[0] + (SAL[0] - FILA[0]) * v, z: FZ + (SAL[1] - FZ) * v, rot, amp: anda > 0 && anda < 1 ? 1 : 0, fase: t * 6.5, color: '#f5b94a', cq: ambar, brillo: 0.35 }; }
      if (i < 4) { const unido = q(m0 + 0.5 + 0.15 * i, 0.4); return { x: FILA[i], z: FZ - 0.3 * unido, rot: Math.PI, amp: 0, color: '#2dd4bf', cq: unido, brillo: 0.3 }; }
      return aceras(i - 4, a, 4, -9);
    };
    // $1,800 a year (1 block) and, on {caja}, ten years: 10 blocks. The employer's half coins drift away in red.
    X.bloques({ x: -0.95, z: 0.95, rot: 0.2, n: bote(m2 + 0.1, 0.3) + 9 * sale(tramo(t, m3 - 0.05, m3 + 1.1)) });
    if (t > m2 - 0.2) for (let j = 0; j < 6; j++) { const per = 2.4, t0 = m2 - 0.2 + j * per / 6; if (t < t0) continue; const u = ((t - t0) % per) / per;
      X.media({ x: -1.35 + (DX + 1.35) * u + 0.25 * Math.sin(j * 1.7 + u * 3), y: 1.9 + 0.9 * u + 0.15 * Math.sin(j), z: 0.8 + (DZ - 1.2 - 0.8) * u, rojo: 1, op: (1 - u) * Math.min(1, u * 6), esc: 1.15, rz: u * 3 * (j % 2 ? 1 : -1) }); }
    camLerp([-0.3, 2.1, 8.6, -0.4, 1.75, -0.4], [-0.42, 2.05, 7.9, -0.5, 1.75, -0.4], p);
  } else {
    const m0 = mk(0, 1.0), m1 = mk(1, 2.1), m2 = mk(2, 3.3);
    const enc = (i) => q(m1 + 0.05 + i * 0.13, 0.3);
    X.escalera({ luz: [0, 1, 2, 3, 4].map(i => 0.35 + 0.65 * enc(i)), linea: sale(tramo(t, m1, m1 + 0.9)) });
    jarraLlena({ brillo: 0.4 * q(m2, 0.4) }); pelda1();
    X.cuentas({ x: pelX(3) - 0.22, y: pelY(3), z: -0.35 });
    X.plataforma({ x: pelX(4), y: pelY(4), z: 0 }); X.pilas({ x: pelX(4) + 0.2, y: pelY(4), z: -0.35, n: [9, 9, 9] });
    // «aren't two goals»: SAVE over steps 1–2 and INVEST over 4–5; on «one plan» they fade into the line.
    const dos = q(m0 - 0.05, 0.35) * (1 - q(m1 + 0.3, 0.4));
    W.rotulo('save', 'SAVE', pelX(0) + 0.7, pelY(1) + 2.6, 0, dos, BLANCO, 0.42);
    W.rotulo('invest', 'INVEST', pelX(4) - 0.7, pelY(4) + 2.6, 0, dos, BLANCO, 0.42);
    // Today: he raises the phone «FULL MATCH: YES» and the camera closes in on him and the jar (like frame 0).
    W.heroe({ x: H2[0], y: H2[1], z: H2[2], gira: 0.2, luz: 1 });
    const H = W.H, sube = q(m2 - 0.1, 0.45);
    H.der.hombro.rotation.x = -0.7 * sube; H.der.codo.rotation.x = -0.2 - 1.3 * sube;
    if (sube > 0.02) { const mm = manoDe(H); X.movil({ x: mm.x - 0.04, y: mm.y + 0.14, z: mm.z + 0.06, rx: -0.12, ry: 0.15, esc: Math.max(0.001, sube) }); }
    const cerca = sale(tramo(t, m2 - 0.1, m2 + 1.7));
    camLerp(mezcla([0.05, 3.6, 17.0, 0.05, 2.35, 0], [0.05, 3.5, 16.2, 0.05, 2.35, 0], Math.min(1, s / 3)), [-0.95, 2.35, 6.4, -1.1, 2.1, 0], cerca);
  }
  W.multitud(t, { directo });
  despues.forEach(f => f());
};

const pildoras = {
  'en-save-invest-one-plan': pildora3d({
    slug: 'en-save-invest-one-plan', cuenta: 'en',
    T: { en: { titulo: 'Same dollar: +50¢ or under half a cent. Saving and investing are one plan', guion: GUION } },
    fijo: () => `<div class="hud i fmt">MONEY, EXPLAINED</div><div class="hud d"><i></i><span id="reloj">00:00</span></div>`,
    cssExtra: CSS, scriptExtra: SCRIPT,
    escenas: ESCENAS, tres: TRES,
    // Short tail (~0.8 s after «full match») so the loop goes back to the hook soon; the 2D layer of each scene leaves on the
    // same frame as the hard cut of the 3D (no text from the previous scene over the next one).
    cola: 0.8, corte2d: 'seco',
    texto: { en: TEXTO }
  })
};

module.exports = { pildoras };
