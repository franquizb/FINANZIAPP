// Long format (30–45 s) · @finanziapp (US), in 3D (reels-voz/tres.js), series «Money, explained».
// en-thanksgiving-dinner · «Thanksgiving dinner for ten averages $58.63 this year. The turkey alone is $23.68.»
// Final, verified script: guiones/2026-11-en-thanksgiving-dinner.md (visual hook, scenes, cuadra(), sources, post, cover).
// To publish Tuesday Nov 24, 2026, 11:00 New York (Thanksgiving is Thursday Nov 26).
//
// Sources (checked 23 Nov 2026, as given in the script):
// - American Farm Bureau Federation (AFBF), news release «Cost of Thanksgiving Dinner Increases, Remains Below 2022 Record High»,
//   Nov 18, 2026 (41st survey): classic dinner for 10 $58.63, about $5.86 per person, «more than a 6% increase from 2025»; 16-lb
//   frozen turkey $23.68 ($1.48/lb, up 10.1%), the largest increase; item list (pie mix 4.24, milk 4.05, veggie tray 1.31, misc.
//   3.84, rolls 3.81, pie crusts 3.28, peas 1.99, cranberries 2.48, whipping cream 1.84, sweet potatoes 4.20, stuffing 3.91).
//   Volunteer shoppers checked prices «the first week of November… without taking advantage of special promotional coupons or
//   combined purchase deals». https://www.fb.org/news-release/cost-of-thanksgiving-dinner-increases-remains-below-2022-record-high
// - AFBF Market Intel «Thanksgiving Dinner Cost Ticks Upward in 2026», Nov 18, 2026 (same totals; its «+$2.38» for the turkey is a
//   typo: with 2025's $21.50 it is +$2.18, which is what «up 10.1%» gives). https://www.fb.org/intel/markets/thanksgiving-dinner-cost-ticks-upward-in-2026
// - AFBF news release «Cost of Thanksgiving Dinner Declines», Nov 19, 2025: 2025 total $55.18, turkey $21.50 and the other 11
//   prices (they add up to $55.18 and give every 2026 percentage). https://www.fb.org/news-release/cost-of-thanksgiving-dinner-declines
// - USDA AMS, «Weekly Grocery Store Turkey Feature Activity», Fri Nov 20, 2026 (week of Mon Nov 16; ads ending Nov 14–26):
//   national «Whole Turkey > 16 Lbs · Conventional · Frozen», 33,348 stores, weighted average advertised price $1.11/lb; «Most of
//   the cheapest whole frozen turkeys on offer this week were offered as loss leaders with an additional purchase of 20.00-50.00
//   required.» https://www.ams.usda.gov/mnreports/ams_2867.pdf (also https://mymarketnews.ams.usda.gov/viewReport/2867)
// - 16 lb × $1.11 = $17.76 is our own example (labelled on screen). No store names or brands; no politics.
const { pildora3d } = require('./tres');
const { VOZ_NARRADOR } = require('./_comun');
const { cuadra } = require('../reels/_comun');

// ——— all the checks in the script (guiones/2026-11-en-thanksgiving-dinner.md, «Cuentas a comprobar con cuadra()») ———
const R2 = x => Math.round(x * 100) / 100, R1 = x => Math.round(x * 10) / 10, R0 = Math.round;
const P26 = { turkey: 2368, pieMix: 424, milk: 405, veggie: 131, misc: 384, rolls: 381, crusts: 328, peas: 199, cranberries: 248, cream: 184, sweetPotatoes: 420, stuffing: 391 };
const P25 = { turkey: 2150, pieMix: 416, milk: 373, veggie: 136, misc: 361, rolls: 356, crusts: 337, peas: 203, cranberries: 228, cream: 187, sweetPotatoes: 400, stuffing: 371 };
const suma = o => Object.values(o).reduce((a, b) => a + b, 0);
cuadra('total 2026 = suma de los 12', suma(P26), 5863);
cuadra('total 2025 = suma de los 12', suma(P25), 5518);
cuadra('por persona 2026', R2(5863 / 10 / 100), 5.86);
cuadra('subida total', 5863 - 5518, 345);
cuadra('subida % total', R1((5863 / 5518 - 1) * 100), 6.3);
cuadra('pavo por libra', R2(2368 / 16 / 100), 1.48);
cuadra('pavo % subida', R1((2368 / 2150 - 1) * 100), 10.1);
cuadra('pavo subida $', 2368 - 2150, 218);
cuadra('pavo parte de la subida', R0(218 / 345 * 100), 63);
cuadra('pavo > mitad de la subida', 218 > 345 / 2, true);
cuadra('resto de la subida', 345 - 218, 127);
cuadra('pavo parte de la cena', R1(2368 / 5863 * 100), 40.4);
cuadra('resto de la cena', 5863 - 2368, 3495);
cuadra('2022 récord menos 2026', 6405 - 5863, 542);
cuadra('2022 % menos', R1((6405 - 5863) / 6405 * 100), 8.5);
const pct = k => R1((P26[k] / P25[k] - 1) * 100);
cuadra('% individuales', ['pieMix', 'milk', 'veggie', 'misc', 'rolls', 'crusts', 'peas', 'cranberries', 'cream', 'sweetPotatoes', 'stuffing'].map(pct).join('/'), '1.9/8.6/-3.7/6.4/7/-2.7/-2/8.8/-1.6/5/5.4');
cuadra('16 lb a 1,11', R2(16 * 1.11), 17.76);
cuadra('16 lb a 1,48', R2(16 * 1.48), 23.68);
cuadra('diferencia por pavo', R2(23.68 - 17.76), 5.92);
cuadra('1,11 frente a 1,48', R0((1 - 1.11 / 1.48) * 100), 25);
cuadra('cena con el pavo anunciado', R2(58.63 - 23.68 + 17.76), 52.71);
cuadra('16 lb a 1,15 (<16 lb)', R2(16 * 1.15), 18.4);

// ——— what is on screen besides the script's checks ———
// Hook: the order the dishes land in and the counter (cents). Two dishes are already on the table on frame 0.
const ORDEN = ['milk', 'pieMix', 'sweetPotatoes', 'veggie', 'turkey', 'rolls', 'crusts', 'peas', 'cranberries', 'cream', 'stuffing', 'misc'];
const ATERRIZA = [-0.8, -0.55, -0.3, 0.2, 0.62, 0.88, 1.08, 1.28, 1.48, 1.68, 1.88, 2.08];
cuadra('pantalla: orden con los 12 platos', ORDEN.slice().sort().join(), Object.keys(P26).sort().join());
cuadra('pantalla: contador en el fotograma 0 «$12.49»', P26.milk + P26.pieMix + P26.sweetPotatoes, 1249);
cuadra('pantalla: contador a 0,5 s «$13.80»', P26.milk + P26.pieMix + P26.sweetPotatoes + P26.veggie, 1380);
cuadra('pantalla: contador final', ORDEN.reduce((a, k) => a + P26[k], 0), 5863);
cuadra('pantalla: barra 40 % (fracción del pavo)', R2(2368 / 5863), 0.4);
cuadra('pantalla: barra de la subida, parte roja', R2(218 / 345), 0.63);
cuadra('pantalla: pavo ×1,10 (escala de 21,50 a 23,68)', R2(2368 / 2150), 1.1);
const ETIQ = Object.fromEntries(Object.entries(P26).map(([k, v]) => [k, '$' + (v / 100).toFixed(2)]));
cuadra('pantalla: etiquetas', [ETIQ.turkey, ETIQ.milk, ETIQ.misc].join(' '), '$23.68 $4.05 $3.84');

const TEXTO = `Thanksgiving dinner for 10 averages $58.63 this year. The turkey alone is $23.68.

That's $5.86 per person and about 6% more than last year, the first increase since 2022. The 16-pound turkey went up $2.18, almost two-thirds of the $3.45 jump (American Farm Bureau Federation survey, Nov 18).

But the survey's shoppers checked prices in early November without coupons or deals. USDA's grocery-ad report for the week of Nov 16 shows the average advertised frozen turkey (over 16 lb) at $1.11 a pound, not $1.48. At that price, a 16-pound bird is $17.76.

The catch, per USDA: most of the cheapest whole frozen turkeys this week were loss leaders that require an extra $20–$50 purchase. Worth it only if you were buying those groceries anyway.

Today: compare price per pound and read the fine print. If you save $6 on the bird, move it to savings the same day so it doesn't vanish into the cart.

Prices vary by store and region. Example uses USDA's national weighted average ad price.
Sources: American Farm Bureau Federation, 2026 Thanksgiving Dinner Cost Survey · USDA AMS Weekly Grocery Store Turkey Feature Activity (Nov 20, 2026).
Educational only, not financial advice.

#thanksgiving #thanksgivingdinner #groceryprices #personalfinance #budgeting`;
cuadra('texto: ≤ 1.800 caracteres', TEXTO.length <= 1800, true);
cuadra('texto: 5 hashtags', (TEXTO.match(/#\w+/g) || []).length, 5);

const GUION = [
  [0, 'Thanksgiving dinner for ten averages *$58.63* this year. §{pop}The turkey alone is *$23.68*.'],
  [1, 'That\'s up *6%* from last year, §and most of the jump is the bird: §{ding}turkey is up *10%*.'],
  [2, 'But that survey skipped coupons and deals. §So what are stores *advertising* now?'],
  [3, 'In USDA\'s latest count of grocery ads, §the average frozen turkey was *$1.11 a pound*, §not *$1.48*.'],
  [4, 'The catch: §most of the cheapest birds §{caja}require spending *$20 to $50 more*.'],
  [5, 'Today, compare the price per pound *and* the fine print. §At $1.11, §{pop}that 16-pound bird is *$17.76*.']
];

const MONO = `'DejaVu Sans Mono', 'Liberation Mono', monospace`;
const CSS = `
  .hud.i.fmt { letter-spacing: .14em; }
  .vin { background: radial-gradient(130% 80% at 50% 46%, transparent 52%, rgba(3,5,12,.62) 100%),
      linear-gradient(rgba(7,11,22,.92) 0%, rgba(7,11,22,.76) 13%, rgba(7,11,22,.68) 24.5%, rgba(7,11,22,.22) 29.5%, transparent 33%, transparent 76%, rgba(7,11,22,.8) 100%); }
  .rt { position: absolute; left: 50%; top: 1335px; padding: 10px 28px 14px; border-radius: 20px; background: rgba(9,14,27,.9); border: 3px solid #e2e8f0;
    color: #fff; font-size: 58px; line-height: 1.12; font-weight: 900; letter-spacing: -.015em; white-space: nowrap; opacity: 0; font-variant-numeric: tabular-nums;
    box-shadow: 0 10px 40px rgba(0,0,0,.45); text-align: center; }
  .rt.p { font-size: 46px; } .rt.p2 { font-size: 40px; } .rt.g { font-size: 76px; } .rt.g2 { font-size: 64px; } .rt.amb { border-color: #f5b94a; } .rt.roja { border-color: #f87171; } .rt.turq { border-color: #5eead4; }
  .rt .a { color: #f5b94a; } .rt .r { color: #f87171; } .rt .t { color: #5eead4; } .rt .x { color: #94a3b8; text-decoration: line-through; text-decoration-color: #f87171; text-decoration-thickness: 6px; }
  .rt small { display: block; font: 700 26px/1.5 ${MONO}; letter-spacing: .08em; color: #cbd5e1; }
  .nota { position: absolute; left: 70px; top: 1436px; max-width: 820px; font: 600 22px/1.25 ${MONO}; color: #b6c2d4; background: rgba(7,11,22,.84);
    border-radius: 10px; padding: 4px 12px; opacity: 0; }
  .chip { position: absolute; top: 505px; background: rgba(9,14,27,.9); border: 3px solid #cbd5e1; border-radius: 20px; padding: 6px 22px 10px;
    font-variant-numeric: tabular-nums; white-space: nowrap; }
  .chip small { display: block; font: 700 22px/1.35 ${MONO}; letter-spacing: .14em; color: #94a3b8; }
  .chip b { display: block; font-size: 62px; line-height: 1.02; font-weight: 900; color: #fff; letter-spacing: -.01em; }
  .chip.izq { left: 66px; } .chip.der { right: 66px; text-align: right; }
  .chip.roja { border-color: #f87171; } .chip.roja b { color: #f87171; } .chip.turq { border-color: #5eead4; } .chip.turq b { color: #5eead4; }
  .chip b .g { color: #94a3b8; } .chip b .r { color: #f87171; }
`;

// 3D world of this video (added to tres.js): the table, the 12 dishes of the survey, the 16-lb turkey on its platter, the paper
// receipt, generic «WEEKLY AD» flyers, boxes and glowing strips (bars), halos. Everything is switched off at the start of each
// frame (X3.apagar()). The gas-station sign (W.cartel), the cart (W.caja) and the turquoise mannequin (W.heroe) come from tres.js.
const SCRIPT = `
const PI = Math.PI, TY = 0.78, TURQH = 0x2dd4bf, ROJOH = 0xdc2626, AMBH = 0xf5b94a;
const suave = (x) => x * x * (3 - 2 * x);
const angulo = (a, b, g) => a + ((((b - a + PI) % (2 * PI)) + 2 * PI) % (2 * PI) - PI) * g;
function ver(n, s, a, b) { if (!n) return; let p = a < -0.5 ? 1 : rebote(tramo(s, a - 0.1, a + 0.25)); if (b != null) p *= 1 - tramo(s, b - 0.12, b); aparece3(n, p); }
// Camera along keyframes [[time, [px, py, pz, lx, ly, lz]]…] (Hermite spline, never stops in between) and orbit (desmentido-en.js).
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

// The 12 survey items: where each sits on the table, its price (cents) and when it lands in the hook (same as cuadra()).
const PLATOS = {
  milk:          { x: -1.85, z: -0.42, c: 405 },  pieMix:      { x: 1.85, z: -0.42, c: 424 },
  sweetPotatoes: { x: -1.12, z: 0.5,  c: 420 },  veggie:      { x: 1.12, z: 0.5,  c: 131 },
  turkey:        { x: 0,     z: 0,     c: 2368 }, rolls:       { x: -1.12, z: -0.5, c: 381 },
  crusts:        { x: 1.12,  z: -0.5,  c: 328 },  peas:        { x: -1.85, z: 0.48, c: 199 },
  cranberries:   { x: 1.85,  z: 0.48,  c: 248 },  cream:       { x: -0.62, z: 0.72, c: 184 },
  stuffing:      { x: 0.62,  z: 0.72,  c: 391 },  misc:        { x: 0,     z: -0.8, c: 384 }
};
const ORDEN = ${JSON.stringify(ORDEN)}, ATERRIZA = ${JSON.stringify(ATERRIZA)};
const TAV = ATERRIZA[ORDEN.indexOf('turkey')];
const CAE = 0.3;
// Total on the counter at instant s of the hook (cents of the dishes already landed).
const totalG = (s) => ORDEN.reduce((a, k, i) => a + (s >= ATERRIZA[i] ? PLATOS[k].c : 0), 0);
const precio = (c) => '$' + (c / 100).toFixed(2);

const X3 = (() => {
  const W = W3, T = W.T, S = W.S, objs = [], sueltos = [];
  const grupo = () => { const g = new T.Group(); g.visible = false; S.add(g); objs.push(g); return g; };
  const mat = (c, o) => new T.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.6, metalness: 0.05 }, o || {}));
  const lienzo = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const tx = new T.CanvasTexture(c); tx.encoding = T.sRGBEncoding; tx.anisotropy = 4; return { c, x: c.getContext('2d'), tx }; };
  const haloTx = (() => { const l = lienzo(256, 256), g = l.x.createRadialGradient(128, 128, 0, 128, 128, 128); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.3, 'rgba(255,255,255,.4)'); g.addColorStop(1, 'rgba(255,255,255,0)'); l.x.fillStyle = g; l.x.fillRect(0, 0, 256, 256); l.tx.needsUpdate = true; return l.tx; })();
  const LUCES = S.children.filter(o => o.isHemisphereLight || o.isDirectionalLight).map(l => [l, l.intensity]);
  function apagon(f) { LUCES.forEach(([l, i0]) => { l.intensity = i0 * f; }); }
  const malla = (geo, m, x, y, z, padre) => { const o = new T.Mesh(geo, m); o.position.set(x || 0, y || 0, z || 0); o.castShadow = true; o.receiveShadow = true; padre.add(o); return o; };

  // ——— the table: dark top, a cream runner along it and four legs ———
  const mesaG = grupo();
  malla(new T.BoxGeometry(4.7, 0.08, 2.1), mat(0x3a2a20, { roughness: 0.7 }), 0, TY - 0.04, 0, mesaG);
  malla(new T.BoxGeometry(4.5, 0.012, 1.0), mat(0xbdb39e, { roughness: 0.95 }), 0, TY + 0.006, 0, mesaG);
  [[-2.2, -0.9], [2.2, -0.9], [-2.2, 0.9], [2.2, 0.9]].forEach(([x, z]) => malla(new T.BoxGeometry(0.1, TY - 0.08, 0.1), mat(0x2a1d15), x, (TY - 0.08) / 2, z, mesaG));
  function mesa(o) { mesaG.visible = true; mesaG.position.set(0, (o && o.dy) || 0, 0); mesaG.rotation.z = (o && o.rz) || 0; }

  // ——— the dishes: a plate plus simple food shapes. Every food material is registered so the dishes can be dimmed together ———
  const ATEN = [], OSCURO = new T.Color(0x1b2233);
  const matA = (c, o) => { const m = mat(c, o); m.userData.base = new T.Color(c); ATEN.push(m); return m; };
  function atenuar(q) { ATEN.forEach(m => { m.color.copy(m.userData.base).lerp(OSCURO, 0.7 * q); }); }
  const PLATO = matA(0xe8ecf2, { roughness: 0.35 });
  const geoPlato = new T.CylinderGeometry(0.27, 0.22, 0.03, 32), esf = new T.SphereGeometry(1, 18, 12);
  const PL = {};
  function hazPlato(k, fn, r) {
    const g = grupo(), p = malla(geoPlato, PLATO, 0, 0.015, 0, g); if (r) p.scale.set(r, 1, r);
    fn(g); PL[k] = g;
  }
  const bol = (g, col) => { malla(new T.CylinderGeometry(0.17, 0.11, 0.1, 24), matA(0xdfe5ee, { roughness: 0.3 }), 0, 0.08, 0, g); const s = malla(esf, matA(col, { roughness: 0.75 }), 0, 0.13, 0, g); s.scale.set(0.15, 0.06, 0.15); };
  hazPlato('milk', g => { malla(new T.BoxGeometry(0.17, 0.3, 0.17), matA(0xf4f6fa, { roughness: 0.4 }), 0, 0.18, 0, g); malla(new T.CylinderGeometry(0.035, 0.035, 0.05, 12), matA(0x2563eb), 0, 0.355, 0, g);
    const asa = malla(new T.TorusGeometry(0.055, 0.016, 8, 16, PI), matA(0xf4f6fa), 0.1, 0.24, 0, g); asa.rotation.z = -PI / 2; });
  hazPlato('pieMix', g => { malla(new T.CylinderGeometry(0.09, 0.09, 0.21, 24), matA(0xd9822b, { metalness: 0.2 }), 0, 0.135, 0, g); malla(new T.CylinderGeometry(0.092, 0.092, 0.02, 24), matA(0x9aa3b2, { metalness: 0.5 }), 0, 0.25, 0, g); });
  hazPlato('sweetPotatoes', g => { [[-0.08, 0.02, 0.6], [0.07, -0.05, -0.4], [0.0, 0.09, 1.5]].forEach(([x, z, r]) => { const m = malla(new T.CapsuleGeometry(0.045, 0.14, 4, 10), matA(0xb5562a), x, 0.07, z, g); m.rotation.set(PI / 2, 0, r); }); });
  hazPlato('veggie', g => { for (let i = 0; i < 9; i++) { const m = malla(new T.BoxGeometry(0.025, 0.025, 0.2), matA(i % 3 === 2 ? 0x7cc36a : 0xf28c28), -0.12 + i * 0.03, 0.05, 0, g); m.rotation.y = 0.15 * Math.sin(i * 2); } });
  hazPlato('rolls', g => { [[-0.08, -0.06], [0.08, -0.06], [-0.08, 0.07], [0.08, 0.07], [0, 0]].forEach(([x, z]) => { const m = malla(esf, matA(0xd9a35f), x, 0.07, z, g); m.scale.set(0.075, 0.055, 0.075); }); });
  hazPlato('crusts', g => { [0, 1].forEach(i => { malla(new T.CylinderGeometry(0.2, 0.17, 0.045, 28), matA(0xe0b070), 0, 0.05 + i * 0.05, 0, g); }); malla(new T.CylinderGeometry(0.16, 0.16, 0.01, 28), matA(0xc8792e), 0, 0.123, 0, g); });
  hazPlato('peas', g => bol(g, 0x5fb84a));
  hazPlato('cranberries', g => bol(g, 0xb3123a));
  hazPlato('stuffing', g => bol(g, 0x9a6a3a));
  hazPlato('cream', g => { malla(new T.BoxGeometry(0.1, 0.15, 0.1), matA(0xf4f6fa), 0, 0.1, 0, g); const t = malla(new T.ConeGeometry(0.075, 0.06, 4), matA(0xf4f6fa), 0, 0.205, 0, g); t.rotation.y = PI / 4; }, 0.75);
  hazPlato('misc', g => { malla(new T.CylinderGeometry(0.05, 0.05, 0.13, 16), matA(0x8a5a2b), -0.06, 0.08, 0, g); malla(new T.CylinderGeometry(0.052, 0.052, 0.03, 16), matA(0xe5e7eb), -0.06, 0.16, 0, g);
    malla(new T.CylinderGeometry(0.04, 0.045, 0.11, 16), matA(0xf4f6fa), 0.07, 0.07, 0, g); }, 0.7);
  // o = { x, z, dy (height over the table), rx, rz, esc, hop }
  function plato(k, o) { const g = PL[k]; if (!g) return; g.visible = true; g.position.set(o.x, TY + (o.dy || 0), o.z); g.rotation.set(o.rx || 0, o.ry || 0, o.rz || 0); g.scale.setScalar(1.2 * Math.max(0.001, o.esc == null ? 1 : o.esc)); }

  // ——— the 16-lb turkey on its platter (the body glows red, turquoise or amber with tinte(color, q)) ———
  const pavoG = grupo(), cuerpoP = new T.Group(); pavoG.add(cuerpoP);
  malla(new T.CylinderGeometry(0.56, 0.48, 0.035, 40), matA(0xe8ecf2, { roughness: 0.3 }), 0, 0.018, 0, pavoG);
  const mPavo = mat(0xc27c3a, { roughness: 0.45, metalness: 0.05 }), mHueso = mat(0xf3efe6, { roughness: 0.5 });
  const cuerpo = malla(esf, mPavo, 0, 0.25, 0, cuerpoP); cuerpo.scale.set(0.46, 0.26, 0.36);
  const pecho = malla(esf, mPavo, 0.06, 0.33, 0, cuerpoP); pecho.scale.set(0.34, 0.2, 0.3);
  [-1, 1].forEach(sz => {
    const ala = malla(esf, mPavo, -0.05, 0.27, sz * 0.3, cuerpoP); ala.scale.set(0.2, 0.1, 0.09);
    const muslo = malla(new T.CapsuleGeometry(0.09, 0.2, 4, 12), mPavo, 0.3, 0.27, sz * 0.17, cuerpoP); muslo.rotation.z = -1.0; muslo.rotation.x = -sz * 0.25;
    const hueso = malla(new T.CapsuleGeometry(0.025, 0.08, 4, 8), mHueso, 0.45, 0.4, sz * 0.2, cuerpoP); hueso.rotation.z = -1.0;
  });
  const BASEP = new T.Color(0xc27c3a);
  function pavo(o) {
    pavoG.visible = true; pavoG.position.set(o.x || 0, TY + (o.dy || 0), o.z || 0); pavoG.rotation.set(o.rx || 0, o.ry || 0, o.rz || 0);
    const e = Math.max(0.001, o.esc == null ? 1 : o.esc); pavoG.scale.setScalar(e);
    cuerpoP.scale.set(1 + (o.aplasta || 0) * 0.12, 1 - (o.aplasta || 0) * 0.18, 1 + (o.aplasta || 0) * 0.12);
    const q = o.q || 0, c = o.color == null ? BASEP : W.color(o.color);
    mPavo.color.copy(BASEP).lerp(c, q); mPavo.emissive.copy(c).multiplyScalar(0.45 * q);
  }

  // ——— the paper receipt: stands up in the middle of the table; the turkey squashes it (aplasta 0..1) ———
  const tk = lienzo(256, 512);
  (function () { const x = tk.x; x.fillStyle = '#f8fafc'; x.fillRect(0, 0, 256, 512); x.fillStyle = '#0f172a'; x.font = '800 34px DejaVu Sans Mono, monospace'; x.textAlign = 'center'; x.fillText('RECEIPT', 128, 52);
    x.fillStyle = '#94a3b8'; for (let i = 0; i < 11; i++) { x.fillRect(26, 84 + i * 30, 120 + (i * 37) % 60, 10); x.fillRect(190, 84 + i * 30, 40, 10); }
    x.fillStyle = '#0f172a'; x.fillRect(20, 420, 216, 4); x.font = '900 40px DejaVu Sans Mono, monospace'; x.fillText('TOTAL', 128, 474);
    x.fillStyle = '#e2e8f0'; for (let i = 0; i < 16; i++) { x.beginPath(); x.moveTo(i * 16, 512); x.lineTo(i * 16 + 8, 500); x.lineTo(i * 16 + 16, 512); x.fill(); } tk.tx.needsUpdate = true; })();
  const ticketG = grupo(), ticketP = new T.Group(); ticketG.add(ticketP);
  const ticketM = new T.Mesh(new T.PlaneGeometry(0.3, 0.6), new T.MeshStandardMaterial({ map: tk.tx, emissive: 0xffffff, emissiveMap: tk.tx, emissiveIntensity: 0.25, roughness: 0.8, side: T.DoubleSide }));
  ticketM.position.y = 0.3; ticketM.castShadow = true; ticketP.add(ticketM);
  function ticket(o) { ticketG.visible = true; ticketG.position.set(o.x || 0, TY + 0.01, o.z || 0); ticketG.rotation.y = o.ry || 0;
    const a = o.aplasta || 0; ticketP.rotation.x = -1.45 * a; ticketP.rotation.z = 0.25 * a; ticketP.scale.set(1 + 0.15 * a, 1 - 0.3 * a, 1); ticketP.position.y = 0.005 * a; }

  // ——— generic weekly-ad flyers (no store names): a pool of 10 cards ———
  const fl = lienzo(256, 340);
  (function () { const x = fl.x; x.fillStyle = '#fff7ed'; x.fillRect(0, 0, 256, 340); x.fillStyle = '#dc2626'; x.fillRect(0, 0, 256, 74); x.fillStyle = '#fff'; x.font = '900 38px Inter, sans-serif'; x.textAlign = 'center'; x.fillText('WEEKLY AD', 128, 50);
    x.fillStyle = '#c27c3a'; x.beginPath(); x.ellipse(128, 160, 78, 48, 0, 0, 2 * PI); x.fill(); x.fillStyle = '#0f172a'; x.font = '900 54px Inter, sans-serif'; x.fillText('$?.??', 128, 272); x.font = '800 26px Inter, sans-serif'; x.fillStyle = '#64748b'; x.fillText('PER LB', 128, 312); fl.tx.needsUpdate = true; })();
  const mFol = new T.MeshStandardMaterial({ map: fl.tx, emissive: 0xffffff, emissiveMap: fl.tx, emissiveIntensity: 0.3, roughness: 0.8, side: T.DoubleSide });
  const folletos = Array.from({ length: 10 }, () => { const m = new T.Mesh(new T.PlaneGeometry(0.4, 0.53), mFol); m.castShadow = true; m.visible = false; S.add(m); sueltos.push(m); return m; });
  function folleto(i, o) { const m = folletos[i]; m.visible = true; m.position.set(o.x, o.y, o.z); m.rotation.set(o.rx || 0, o.ry || 0, o.rz || 0); m.scale.setScalar(Math.max(0.001, o.esc || 1)); }

  // ——— generic boxes (lit) and glowing strips (unlit): a pool reused every frame ———
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
  const halos = Array.from({ length: 4 }, () => { const s = new T.Sprite(new T.SpriteMaterial({ map: haloTx, color: 0xffffff, blending: T.AdditiveBlending, depthWrite: false, transparent: true })); s.visible = false; S.add(s); sueltos.push(s); return s; });
  let nh = 0;
  function halo(o) { if (nh >= halos.length) return; const s = halos[nh++]; s.visible = (o.op || 0) > 0.01; s.position.set(o.x, o.y, o.z); s.scale.setScalar(o.esc || 1); s.material.opacity = o.op || 0; s.material.color.set(o.color || '#ffffff'); }

  function apagar() { objs.forEach(g => { g.visible = false; }); sueltos.forEach(m => { m.visible = false; }); nc = 0; nb = 0; nh = 0; apagon(1); atenuar(0); }
  return { mesa, plato, pavo, ticket, folleto, bloque, brillo, halo, atenuar, apagon, apagar };
})();
W3.X = X3;

// A dish of the hook at instant s: on the table (with a short bounce and the hop when the turkey lands), falling, or not yet out.
function caida(i, s) {
  const T0 = ATERRIZA[i];
  if (s < T0 - CAE) return null;
  if (s < T0) { const u = (s - T0 + CAE) / CAE; return { dy: 3.2 * (1 - u * u), rx: 0.7 * (1 - u) * (i % 2 ? 1 : -1), rz: 0.5 * (1 - u), cae: true }; }
  const d = s - T0, rebota = 0.06 * Math.exp(-d * 14) * Math.abs(Math.sin(d * 26));
  const salto = s > TAV && i !== 4 && T0 < TAV ? 0.16 * Math.exp(-(s - TAV) * 9) * Math.abs(Math.sin((s - TAV) * 18)) : 0;
  return { dy: rebota + salto, rx: 0, rz: salto * 0.6 * (i % 2 ? 1 : -1) };
}
`;

// 2D layer: chips at the top (y ≈ 505), 2–4 word labels in the lower-middle third (y ≈ 1.335), a small note at the bottom left.
const nota = (txt) => `<div class="nota">${txt}</div>`;
const rt = (cls, html, top) => `<div class="rt ${cls}" data-t="translateX(-50%)"${top ? ` style="top:${top}px"` : ''}>${html}</div>`;
const ESCENAS = [
  // 0 · Hook: dishes rain onto the table with their price tags, the counter runs; the turkey lands at 0.62 s and squashes the
  //     receipt: «TURKEY: $23.68». At 2.08 s the last dish lands ($58.63); on {pop} the turkey glows red: 40% of the bill.
  { html: () => `<div class="chip izq"><small>DINNER FOR 10</small><b>2026</b></div>
      <div class="chip der roja"><small>TOTAL</small><b class="c">$12.49</b></div>
      ${rt('roja', 'TURKEY: <span class="r">$23.68</span>')}${rt('', '<span class="r">$58.63</span> · $5.86 A PERSON')}${rt('roja p', 'TURKEY = <span class="r">40%</span> OF THE BILL')}
      ${nota('AFBF Thanksgiving survey, Nov 18, 2026<br>classic menu for 10 · national average')}`,
    anim: function (s, e, el) {
      const M = e.seg[0].marcas, m0 = Math.max(M[0] != null ? M[0] : 3.6, 2.9), r = el.querySelectorAll('.rt'), ch = el.querySelectorAll('.chip');
      ch[1].querySelector('.c').textContent = precio(totalG(s));
      const salto = ORDEN.reduce((a, k, i) => Math.max(a, s >= ATERRIZA[i] ? Math.exp(-(s - ATERRIZA[i]) * (i === 4 ? 6 : 12)) * (i === 4 ? 1 : 0.4) : 0), 0);
      ch[1].style.transform = 'scale(' + (1 + 0.16 * salto) + ')'; ch[1].style.transformOrigin = '100% 0';
      ch[1].style.boxShadow = '0 0 ' + Math.round(60 * salto) + 'px rgba(248,113,113,' + (0.9 * salto).toFixed(2) + ')';
      ver(r[0], s, TAV + 0.06, 2.3); ver(r[1], s, 2.45, m0 - 0.05); ver(r[2], s, m0 + 0.25);
      el.querySelector('.nota').style.opacity = 1;
    } },
  // 1 · The jump: «2025 $55.18 → 2026 $58.63» and the «+$3.45» bar above the table that splits 63% red (turkey) / 37% grey;
  //     on {ding} the turkey swells ×1.10.
  { html: () => `<div class="chip izq"><small>2025 → 2026</small><b><span class="g">$55.18</span> → $58.63</b></div>
      ${rt('roja', 'UP <span class="r">6%</span>')}${rt('roja p', 'OF THE <span class="r">+$3.45</span>: TURKEY <span class="r">+$2.18</span><br><span style="color:#94a3b8">11 OTHER ITEMS +$1.27</span>')}${rt('roja', 'TURKEY <span class="r">+10%</span><small>$21.50 → $23.68</small>')}`,
    anim: function (s, e, el) { const M = e.seg[0].marcas, m0 = M[0] != null ? M[0] : 1.6, m1 = M[1] != null ? M[1] : 3.6, r = el.querySelectorAll('.rt');
      ver(el.querySelector('.chip'), s, 0.1); ver(r[0], s, 0.35, m0 + 0.1); ver(r[1], s, m0 + 0.25, m1 - 0.05); ver(r[2], s, m1 + 0.1); } },
  // 2 · The question: the receipt stands up again with «NO COUPONS · NO DEALS»; generic weekly-ad flyers rain down and the
  //     turquoise mannequin walks up to the table.
  { html: () => `${rt('amb p2', 'SURVEY: <span class="a">NO COUPONS, NO DEALS</span>')}${rt('turq p2', 'WHAT ARE STORES <span class="t">ADVERTISING?</span>')}
      ${nota('AFBF: volunteer shoppers, first week of November,<br>without promotional coupons or combined deals')}`,
    anim: function (s, e, el) { const M = e.seg[0].marcas, m0 = M[0] != null ? M[0] : 2.3, r = el.querySelectorAll('.rt');
      ver(r[0], s, 0.3, m0); ver(r[1], s, m0 + 0.2); ver(el.querySelector('.nota'), s, 0.4, m0); } },
  // 3 · The ads: the price sign behind the turkey rolls from $1.48 to $1.11 (turquoise); the turkey turns turquoise.
  { html: () => `${rt('turq', 'ADS: <span class="t">$1.11/LB</span> · <span class="x">$1.48</span>')}
      ${nota('USDA AMS turkey feature report, Nov 20, 2026 · frozen<br>whole turkey over 16 lb, weighted avg ad price')}`,
    anim: function (s, e, el) { const M = e.seg[0].marcas, m1 = M[1] != null ? M[1] : 4.4;
      ver(el.querySelector('.rt'), s, m1 + 0.05); ver(el.querySelector('.nota'), s, 0.3); } },
  // 4 · The catch: the cheapest bird is chained to a cart that has to fill up first: «+$20–50 PURCHASE REQUIRED» (amber).
  { html: () => `${rt('amb p', '<span class="a">+$20–50</span> PURCHASE REQUIRED')}
      ${nota('USDA: most of the cheapest whole frozen turkeys<br>this week were loss leaders')}`,
    anim: function (s, e, el) { const M = e.seg[0].marcas, m1 = M[1] != null ? M[1] : 2.3;
      ver(el.querySelector('.rt'), s, m1 + 0.1); ver(el.querySelector('.nota'), s, 0.4); } },
  // 5 · Close: «16 LB × $1.48 = $23.68» → on {pop} «16 LB × $1.11 = $17.76» (turquoise). Hard cut on that image.
  { html: () => `${rt('roja', '16 LB × $1.48 = <span class="r">$23.68</span>')}${rt('turq g2', '16 LB × $1.11 = <span class="t">$17.76</span>')}
      ${nota('Example · USDA national average ad price<br>prices vary by store and region')}`,
    anim: function (s, e, el) { const M = e.seg[0].marcas, m1 = M[1] != null ? M[1] : 4.2, r = el.querySelectorAll('.rt');
      ver(r[0], s, 0.4, m1 - 0.05); ver(r[1], s, m1 + 0.05); ver(el.querySelector('.nota'), s, 0.5); } }
];

const TRES = function (t, k, s, e, W) {
  const X = W.X; X.apagar();
  const D = e.fin - e.ini, M = e.seg.flatMap(g => g.marcas);
  const mk = (j, def) => (M[j] != null ? M[j] : def);
  const q = (a, d) => sale(tramo(s, a, a + (d || 0.45)));
  const bote = (a, d) => rebote(tramo(s, a, a + (d || 0.35)));
  const cam = (C) => W.camara(C[0], C[1], C[2], C[3], C[4], C[5]);
  const ROJ = '#f87171', TQ = '#5eead4', AMB = '#f5b94a', BLANCO = '#e2e8f0';
  // every dish in its place (after the hook)
  const servida = (sin) => { X.mesa(); ORDEN.forEach((kk) => { if (kk !== 'turkey' && !(sin && sin[kk])) X.plato(kk, PLATOS[kk]); }); };
  let directo = () => ({ x: -60, z: -60, esc: 0 });

  if (k === 0) {
    // ——— the hook ———
    const m0 = Math.max(mk(0, 3.6), 2.9), tv = TAV, golpe = s > tv ? Math.exp(-(s - tv) * 7) : 0;
    X.mesa({ dy: -0.03 * golpe * Math.abs(Math.sin((s - tv) * 30)), rz: 0.01 * golpe * Math.sin((s - tv) * 24) });
    ORDEN.forEach((kk, i) => {
      if (kk === 'turkey') return; const c = caida(i, s); if (!c) return;
      const P = PLATOS[kk]; X.plato(kk, { x: P.x, z: P.z, dy: c.dy, rx: c.rx, rz: c.rz });
      // price tag: pops when it lands; the side tags fade on «The turkey alone»
      const op = c.cae ? 0 : Math.min(1, 1.4 * bote(ATERRIZA[i], 0.3)) * (1 - tramo(s, m0 - 0.1, m0 + 0.25));
      if (op > 0.01) W.rotulo('p' + kk, precio(P.c), P.x, TY + 0.62 + c.dy, P.z + 0.1, op, BLANCO, 0.17 * (1 + 0.4 * (1 - Math.min(1, bote(ATERRIZA[i], 0.3)))));
    });
    // the turkey: falls from high, lands at 0.62 s on the receipt (squash and stretch), then glows red on {pop}
    const ut = tramo(s, tv - 0.42, tv), cae = s < tv, aplasta = s >= tv ? 0.9 * Math.exp(-(s - tv) * 10) * Math.cos((s - tv) * 20) : -0.25 * ut;
    const rojo = q(m0, 0.35), hin = 1 + 0.08 * Math.sin(PI * tramo(s, m0, m0 + 0.35));
    if (s > tv - 0.42) X.pavo({ dy: cae ? 5.2 * (1 - ut * ut) : 0, rx: cae ? 0.5 * (1 - ut) : 0, ry: -0.35, esc: hin, aplasta, color: ROJOH, q: rojo });
    X.ticket({ x: 0.08, z: 0.05, ry: -0.2, aplasta: suave(tramo(s, tv - 0.05, tv + 0.12)) });
    if (s > tv) W.rotulo('pT', '$23.68', 0, TY + 0.62 + 0.25 * (1 - Math.min(1, bote(tv, 0.3))), 0.15, Math.min(1, 1.5 * bote(tv, 0.3)), ROJ, 0.3 * (1 + 0.6 * (1 - Math.min(1, bote(tv, 0.3)))));
    if (s > tv && s < tv + 0.4) X.halo({ x: 0, y: TY + 0.3, z: 0.2, esc: 4.5, op: 0.7 * Math.sin(PI * tramo(s, tv, tv + 0.4)), color: '#fed7aa' });
    // on {pop}: the side dishes dim and a 40/60 bar lights up along the front edge of the table
    X.atenuar(0.85 * q(m0, 0.4));
    const g = sale(tramo(s, m0 + 0.1, m0 + 0.8)), L = 4.2, x0 = -L / 2, f = 2368 / 5863;
    if (g > 0.01) {
      X.brillo({ x: x0 + L * f * g / 2, y: TY + 0.04, z: 0.86, w: L * f * g, h: 0.08, d: 0.24, color: '#ef4444' });
      X.brillo({ x: x0 + L * f + 0.03 + L * (1 - f) * g / 2, y: TY + 0.04, z: 0.86, w: L * (1 - f) * g, h: 0.08, d: 0.24, color: '#64748b' });
    }
    if (s > 2.4) X.halo({ x: 0, y: TY + 0.4, z: 0, esc: 3.5, op: 0.35 * Math.sin(PI * tramo(s, 2.4, 2.8)), color: '#fecaca' });
    // camera: low travelling right → left rising, a shake on the landing, three-quarter orbit, crane up over the full table, push
    // on the turkey on {pop}. Never still.
    const C = ruta(orden([[0, [4.0, 3.3, 5.2, 0.1, 0.8, 0]], [0.6, [2.9, 3.5, 5.4, 0.0, 0.8, 0]], [1.2, orbita([0, 3.6, 5.9, 0, 1.05, 0], -0.38)],
      [1.9, orbita([0, 4.2, 5.8, 0, 1.0, 0], -0.18)], [2.6, [0.5, 4.5, 5.7, 0, 1.0, 0.1]], [m0, orbita([0, 3.1, 5.4, 0, 1.1, 0.1], 0.2)],
      [m0 + 0.9, orbita([0, 2.3, 4.4, 0, 1.15, 0.2], 0.32)], [D + 0.6, orbita([0, 2.2, 4.1, 0, 1.15, 0.2], 0.45)]]), s);
    const sh = 0.07 * golpe;
    cam([C[0] + sh * Math.sin(s * 83), C[1] + sh * Math.cos(s * 71), C[2], C[3], C[4], C[5]]);
  } else if (k === 1) {
    // ——— the jump: «+$3.45» block floats above the table and splits; on {ding} the turkey swells ×1.10 ———
    const m0 = mk(0, 1.6), m1 = mk(1, 3.6);
    servida(); X.atenuar(0.55);
    const hin = 1 + 0.1 * sale(tramo(s, m1, m1 + 0.4)) + 0.05 * Math.sin(PI * tramo(s, m1, m1 + 0.3));
    X.pavo({ ry: -0.35 + 0.25 * s / D, esc: hin, color: ROJOH, q: 0.25 + 0.6 * q(m0, 0.4) });
    const ent = q(0.15, 0.5), parte = q(m0 + 0.1, 0.5), BY = TY + 0.68, L = 1.7, BZ = -0.95, fr = 218 / 345;
    if (ent > 0.01) {
      const sep = 0.25 * parte, xr = -L / 2 + L * fr / 2 - sep, xg = -L / 2 + L * fr + L * (1 - fr) / 2 + sep;
      X.bloque({ x: xr, y: BY + 0.3 * (1 - ent), z: BZ, w: L * fr * ent, h: 0.24, d: 0.24, color: parte > 0.3 ? '#ef4444' : '#e2e8f0', brillo: 0.15 + 0.35 * parte, op: ent });
      X.bloque({ x: xg, y: BY + 0.3 * (1 - ent) - 0.1 * parte, z: BZ, w: L * (1 - fr) * ent, h: 0.24, d: 0.24, color: parte > 0.3 ? '#64748b' : '#e2e8f0', brillo: 0.1, op: ent * (1 - 0.6 * q(m1, 0.4)) });
      W.rotulo('j345', '+$3.45', 0, BY + 0.36, BZ, ent * (1 - parte), BLANCO, 0.26);
      W.rotulo('j218', '+$2.18', xr, BY + 0.36, BZ, parte, ROJ, 0.24);
      W.rotulo('j127', '+$1.27', xg, BY + 0.3, BZ, parte * (1 - q(m1, 0.4)), '#94a3b8', 0.2);
      // the red piece drops into the turkey on {ding}
    }
    if (s > m1 - 0.05 && s < m1 + 0.4) X.halo({ x: 0, y: TY + 0.35, z: 0.1, esc: 3.6, op: 0.55 * Math.sin(PI * tramo(s, m1 - 0.05, m1 + 0.4)), color: '#fecaca' });
    cam(ruta(orden([[0, orbita([0, 1.9, 5.4, 0, 1.35, 0], -0.5)], [m0, orbita([0, 2.2, 5.2, 0, 1.45, 0], -0.25)], [m1, orbita([0, 1.9, 4.4, 0, 1.2, 0], 0.0)],
      [D + 0.5, orbita([0, 1.8, 4.0, 0, 1.1, 0], 0.25)]]), s));
  } else if (k === 2) {
    // ——— the question: the receipt stands up with its stamp; flyers rain; the mannequin walks to the table ———
    const m0 = mk(0, 2.3);
    servida(); X.pavo({ ry: -0.1 });
    const lev = q(0.05, 0.45); X.ticket({ x: 0.55, z: 0.15, ry: -0.3, aplasta: 1 - lev });
    for (let i = 0; i < 10; i++) {
      const t0 = m0 - 0.2 + 0.11 * i, u = tramo(s, t0, t0 + 0.9); if (u <= 0) continue;
      const a = i * 2.39, x0 = -2.6 + (i * 0.57) % 5.2, z0 = -0.6 + ((i * 0.83) % 2.4);
      const y = u < 1 ? 4.5 * (1 - u) + TY + 0.05 : TY + 0.02;
      const enMesa = Math.abs(x0) < 2.3 && Math.abs(z0) < 1.0;
      X.folleto(i, { x: x0 + 0.3 * Math.sin(a + s * 3) * (1 - u), y: enMesa ? Math.max(y, TY + 0.25) : Math.max(y, 0.02), z: z0, rx: u < 1 ? 1.2 + 0.8 * Math.sin(s * 5 + a) : -PI / 2 + 0.25, ry: a, rz: 0.4 * Math.sin(s * 4 + a) * (1 - u) });
    }
    const H0 = [-3.0, 2.4], H1 = [-1.4, 1.6], u = tramo(s, 0.0, 1.5), hx = lerp(H0[0], H1[0], sale(u)), hz = lerp(H0[1], H1[1], sale(u));
    W.heroe({ x: hx, z: hz, gira: angulo(Math.atan2(H1[0] - H0[0], H1[1] - H0[1]), PI + 0.4, suave(tramo(s, m0 + 0.3, m0 + 0.9))), amp: u < 1 ? 1 : 0, fase: s * 8.5, luz: 0.8 });
    cam(ruta(orden([[0, [1.6, 1.4, 4.4, 0.6, 1.0, 0]], [m0 - 0.3, [0.6, 1.9, 5.2, -0.2, 1.0, 0.2]], [m0 + 0.6, [1.4, 1.7, 5.4, -0.6, 1.1, 0.4]], [D + 0.5, [1.9, 1.6, 5.0, -0.6, 1.15, 0.4]]]), s));
  } else if (k === 3) {
    // ——— the ads: the price sign behind the table rolls from $1.48 to $1.11 (turquoise); the turkey turns turquoise ———
    const m0 = mk(0, 2.1), m1 = mk(1, 4.4);
    servida(); X.atenuar(0.5);
    const gira = tramo(s, m0 + 0.05, m0 + 0.55), tq = q(m0 + 0.3, 0.4);
    X.pavo({ ry: -0.2 + 0.2 * s / D, color: TURQH, q: tq, esc: 1 - 0.06 * Math.sin(PI * tramo(s, m0 + 0.3, m0 + 0.7)) });
    const pre = gira < 0.5 ? '$1.48' : '$1.11';
    W.cartel({ x: 0, z: -1.6, esc: 0.62, titulo: 'FROZEN TURKEY · AD AVG', precio: pre, frac: '/lb', fracEsc: 0.8, fracColor: '#94a3b8', color: gira < 0.5 ? '#ffffff' : '#5eead4', op: 1 - Math.sin(PI * gira) * 0.85 });
    if (gira > 0 && gira < 1) X.halo({ x: 0, y: 2.1, z: -1.4, esc: 3.4, op: 0.5 * Math.sin(PI * gira), color: TQ });
    W.rotulo('usda', 'USDA · WEEK OF NOV 16', 0, 2.95, -1.5, q(0.3, 0.3), TQ, 0.17);
    if (s > m1 - 0.1) W.rotulo('ant', 'AFBF, NO DEALS: $1.48', 1.3, TY + 0.85, 0.3, q(m1 - 0.1, 0.3), ROJ, 0.17);
    cam(ruta(orden([[0, orbita([0, 0.95, 4.3, 0, 1.4, -0.6], 0.35)], [m0, orbita([0, 1.15, 4.6, 0, 1.55, -0.8], 0.12)], [m0 + 1.2, orbita([0, 1.4, 4.9, 0, 1.5, -0.7], -0.08)],
      [D + 0.5, orbita([0, 1.5, 5.2, 0, 1.4, -0.5], -0.25)]]), s));
  } else if (k === 4) {
    // ——— the catch: the cheapest bird on a plinth beside the table, a glowing chain to a cart that fills up first ———
    const m0 = mk(0, 0.8), m1 = mk(1, 2.3);
    X.mesa(); ['milk', 'pieMix', 'peas', 'cranberries', 'rolls', 'crusts'].forEach(kk => X.plato(kk, PLATOS[kk])); X.atenuar(0.6);
    const PX = -1.25, PZ = 2.2;
    X.bloque({ x: PX, y: 0.45, z: PZ, w: 0.9, h: 0.9, d: 0.9, color: '#1e293b', brillo: 0.05 });
    const lu = q(m0, 0.4);
    X.pavo({ x: PX, z: PZ, dy: 0.12 + 0.03 * Math.sin(s * 3), ry: 0.4 + 0.3 * s / D, color: AMBH, q: 0.35 * lu });
    W.rotulo('chp', 'CHEAPEST AD', PX, 1.65, PZ, lu, AMB, 0.2);
    const CX = 1.3, CZ = 2.4, llena = sale(tramo(s, m1 - 0.1, m1 + 1.4)), ok = q(m1 + 1.3, 0.3);
    W.caja({ x: CX, z: CZ, rot: -0.3, luz: 0.4 + 0.6 * ok, item: { y: 0.1 + 0.4 * llena, op: llena, color: '#f5b94a' } });
    // the chain: dashes of light from the plinth to the cart, amber, running
    const ch = q(m0 + 0.2, 0.5);
    for (let i = 0; i < 12; i++) { const f = (i + (s * 2.5) % 1) / 12; if (f > ch) continue; X.brillo({ x: lerp(PX + 0.5, CX - 0.7, f), y: 0.12, z: lerp(PZ, CZ, f), w: 0.16, h: 0.03, d: 0.05, ry: -Math.atan2(CZ - PZ, CX - PX - 1.2), color: AMB, op: 0.9 }); }
    // groceries drop into the cart (each a box), then the amber flash
    for (let i = 0; i < 8; i++) { const t0 = m1 - 0.05 + 0.16 * i, u = tramo(s, t0, t0 + 0.3); if (u <= 0 || u >= 1) continue; X.bloque({ x: CX + ((i % 3) - 1) * 0.25, y: 0.5 + 2.5 * (1 - u * u), z: CZ + ((i % 2) - 0.5) * 0.25, w: 0.2, h: 0.24, d: 0.18, color: ['#94a3b8', '#f5b94a', '#e2e8f0', '#7cc36a'][i % 4], brillo: 0.25, ry: i }); }
    W.rotulo('mas', '+$20–50', CX, 1.35, CZ, Math.min(1, 1.4 * bote(m1 + 0.05, 0.3)), AMB, 0.3);
    if (s > m1 && s < m1 + 0.4) X.halo({ x: CX, y: 0.7, z: CZ, esc: 3.4, op: 0.55 * Math.sin(PI * tramo(s, m1, m1 + 0.4)), color: '#fde68a' });
    cam(ruta(orden([[0, [-1.2, 2.3, 10.4, 0.1, 0.95, 2.2]], [m0 + 0.4, [-0.4, 2.6, 10.6, 0.1, 0.9, 2.2]], [m1, [0.5, 3.0, 10.5, 0.15, 0.85, 2.2]], [D + 0.5, [1.1, 3.3, 10.1, 0.2, 0.8, 2.2]]]), s));
  } else {
    // ——— close: the mannequin at the table; the turkey's sum goes from $23.68 (red) to $17.76 (turquoise) on {pop}. Hard cut. ———
    const m1 = mk(1, 4.2);
    servida(); X.atenuar(0.5);
    const tq = q(m1, 0.35), hin = 1 + 0.08 * Math.sin(PI * tramo(s, m1, m1 + 0.35));
    X.pavo({ ry: -0.3 + 0.2 * s / D, color: tq > 0.01 ? TURQH : ROJOH, q: tq > 0.01 ? tq : 0.35, esc: hin * (1 - 0.06 * tq) });
    W.rotulo('l16', '16 LB', 0, TY + 0.85, 0.15, q(0.3, 0.3), BLANCO, 0.2);
    if (s > m1 && s < m1 + 0.45) X.halo({ x: 0, y: TY + 0.4, z: 0.2, esc: 4, op: 0.6 * Math.sin(PI * tramo(s, m1, m1 + 0.45)), color: TQ });
    cam(ruta(orden([[0, orbita([-0.6, 2.0, 5.8, -0.6, 1.05, 0.2], -0.35)], [m1 - 0.6, orbita([-0.4, 1.8, 5.0, -0.4, 1.05, 0.2], -0.1)], [D + 0.6, orbita([-0.2, 1.7, 4.4, -0.2, 1.05, 0.2], 0.1)]]), s));
  }
  W.multitud(t, { directo });
};

const pildoras = {
  'en-thanksgiving-dinner': pildora3d({
    slug: 'en-thanksgiving-dinner', cuenta: 'en',
    T: { en: { titulo: 'Thanksgiving dinner for 10 averages $58.63. The turkey alone is $23.68', guion: GUION } },
    // Narrator voice of reto-en.js / extenso-en.js (never VOZ_SECA), slower, as in en-mortgage-rate (2.6–3.2 words/s).
    voz: { ...VOZ_NARRADOR, en: { ...VOZ_NARRADOR.en, tempo: 1.12, pausaMax: 0.3 } },
    sub: { max: 4, largo: 20, sinSuelta: true },
    fijo: () => `<div class="hud i fmt">MONEY, EXPLAINED</div><div class="hud d"><i></i><span id="reloj">00:00</span></div>`,
    cssExtra: CSS, scriptExtra: SCRIPT,
    escenas: ESCENAS, tres: TRES,
    cola: 0.8, corte2d: 'seco',
    texto: { en: TEXTO }
  })
};

module.exports = { pildoras };
