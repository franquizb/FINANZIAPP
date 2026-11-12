// «Money, explained» · curiosities for @finanziapp (US), in 3D (reels-voz/tres.js) with the narrator voice.
//
// en-gas-nine-tenths · Why every US gas price ends in 9/10 of a cent. US twin of es-gasolina-1499 (our best Spanish video).
// Sources (checked 12 Nov 2026):
// - First federal gas tax: Revenue Act of 1932, 1¢ per gallon (in force 21 Jun 1932); raised to 1.5¢ on 17 Jun 1933.
//   CRS report RL30304, «The Federal Excise Tax on Gasoline and the Highway Trust Fund: A Short History».
// - Gas was about 20¢ a gallon by 1930; taxes were one factor behind fractional pricing; 0.9¢ pricing has been the rule since
//   the 1970s; Iowa banned fractional pricing in 1985 and repealed the ban in 1989: NACS, «Why Gas Is Priced Using Fractions
//   of a Penny» (19 Jun 2026). (NACS says the 1932 tax was «1/10th of a cent»; CRS, the primary source, says 1¢: we use CRS.)
// - US finished motor gasoline consumed in 2025: 136.53 billion gallons (≈374 million gallons a day). EIA, Energy Kids,
//   «Gasoline» (data: Annual Energy Outlook 2026, April 2026).
// - Licensed drivers in 2024: 240 million. FHWA, «Our Nation's Highways 2026», Drivers.
//   → per driver: 136.53 bn / 240 M ≈ 569 gallons a year × 0.9¢ ≈ $5.12 («about five dollars a year»; 2025 fuel over 2024
//   drivers, the latest of each).
//   → whole country: 136.53 bn × 0.9¢ ≈ $1.23 billion («over a billion»). Both assume the 9/10 is paid on every gallon.
// - Left-digit effect: Thomas & Morwitz (2005), J. Consumer Research; Lacetera, Pope & Sydnor (2012), AER.
// - Federal gas tax today, 18.4¢ a gallon (text of the post only): CRS RL30304 (rate in force since 1 Oct 1993).
const { pildora3d } = require('./tres');
const { cuadra } = require('../reels/_comun');

const GALONES = 136.53e9, CONDUCTORES = 240e6, NUEVE = 0.009;
cuadra('gas: país', +(GALONES * NUEVE / 1e9).toFixed(2), 1.23);
cuadra('gas: galones por conductor', Math.round(GALONES / CONDUCTORES), 569);
cuadra('gas: por conductor', +(GALONES / CONDUCTORES * NUEVE).toFixed(2), 5.12);
cuadra('gas: ejemplo 1933', 20 + 1.5, 21.5);
cuadra('gas: 3.499 redondeado', Math.round(3.499 * 100) / 100, 3.5);

// en-curious-gas-stations · Sources (checked 13 Nov 2026), all NACS (National Association of Convenience Stores), 2025 data:
// - Fuel = 65.0% of total sales dollars but 38.8% of gross profit dollars; in-store sales $341.2 billion; foodservice 28.5% of
//   in-store sales and 38.9% of in-store gross profit: NACS, «U.S. Convenience In-Store Sales Top $340 Billion» (15 Apr 2026).
// - «In 2025, fuel margins averaged over 40 cents per gallon»: NACS Magazine, «5 Key Metrics Defining the Convenience Industry's
//   Health» (June 2026). → example: 15 gal × 40¢ = $6 (gross margin, before costs).
// - «Every transaction inside the store lost 7 cents» in 2025 (after all expenses; +1¢ in 2024); «fuel margins were the reason
//   that stores were profitable in 2025»; basket $7.69; labor $1.60 per in-store transaction: NACS Magazine, «5 Big Takeaways
//   From the 2026 NACS State of the Industry Summit» (June 2026).
// - Average gas price $3.11 in 2025 (sign): NACS via Convenience Store Dive (2026).
// Not claimed (no solid source): that a gallon earns less than a coffee. The data is for convenience stores that sell fuel,
// which the hook calls «gas stations».
const GAS_V = 65.0, GAS_B = 38.8, MARGEN = 0.4;
cuadra('estaciones: dentro ventas', +(100 - GAS_V).toFixed(1), 35);
cuadra('estaciones: dentro beneficio', +(100 - GAS_B).toFixed(1), 61.2);
cuadra('estaciones: depósito', +(15 * MARGEN).toFixed(2), 6);

const MONO = `'DejaVu Sans Mono', 'Liberation Mono', monospace`;
const CSS = `
  .tj { position: absolute; left: 50%; background: rgba(9,14,27,.9); border: 2px solid rgba(148,163,184,.32); border-radius: 24px;
    padding: 14px 38px 18px; text-align: center; opacity: 0; white-space: nowrap; }
  .tj small { display: block; font: 700 23px/1.35 ${MONO}; letter-spacing: .14em; color: #94a3b8; margin-bottom: 4px; }
  .tj .l { display: block; font-size: 52px; line-height: 1.15; font-weight: 850; letter-spacing: -.015em; color: #fff; font-variant-numeric: tabular-nums; }
  .tj .t { color: #5eead4; } .tj .r { color: #f87171; } .tj .a { color: #f5b94a; }
  .tj.turq { border-color: rgba(94,234,212,.6); } .tj.amb { border-color: rgba(245,185,74,.6); } .tj.roja { border-color: rgba(248,113,113,.6); }
  .fuente { position: absolute; left: 70px; right: 70px; top: 1452px; text-align: center; font: 600 25px/1.3 ${MONO}; color: #a5b4c8; text-shadow: 0 2px 10px rgba(0,0,0,.9); }
  .pregunta { position: absolute; left: 70px; right: 70px; top: 540px; text-align: center; font-size: 88px; line-height: 1.05; font-weight: 900;
    letter-spacing: -.03em; color: #fff; text-shadow: 0 6px 40px rgba(0,0,0,.85); opacity: 0; }
  .pregunta b { color: #f87171; }
  .pregunta small { display: block; margin-top: 22px; font-size: 40px; font-weight: 750; letter-spacing: 0; color: #cbd5e1; }
  .pregunta small i { font-style: normal; color: #5eead4; }
  .hud.i { letter-spacing: .14em; }
`;
// data-m="k": aparece en la marca k de la escena (-1 = al empezar); data-hasta="k": se va en la marca k.
const SCRIPT = `
function aparecen(s, e, el) {
  const M = e.seg.flatMap(g => g.marcas);
  el.querySelectorAll('[data-m]').forEach(n => {
    const k = +n.dataset.m, at = k < 0 ? 0.12 : (M[k] != null ? M[k] : 1 + k);
    let p = rebote(tramo(s, at - 0.1, at + 0.3));
    if (n.dataset.hasta != null) { const h = M[+n.dataset.hasta]; if (h != null) p *= 1 - tramo(s, h - 0.25, h); }
    aparece3(n, p);
  });
}`;
const an = function (s, e, el) { aparecen(s, e, el); };
const fuente = (txt) => `<div class="fuente">${txt}</div>`;

const pildoras = {
  'en-gas-nine-tenths': pildora3d({
    slug: 'en-gas-nine-tenths', cuenta: 'en',
    T: { en: {
      titulo: 'Why every gas price ends in 9/10 of a cent',
      guion: [
        [0, 'Every gas station in America charges you *nine-tenths of a cent*. §You can’t even pay it.'],
        [1, 'It goes back to the 1930s. §Gas was about twenty cents a gallon, §and the new federal gas tax went up to *a cent and a half*. §So stations started pricing in fractions of a cent.'],
        [2, 'The tax changed. §{pop}The nine-tenths *never left*.'],
        [3, 'Because three forty-nine and nine-tenths §looks like *three forty-nine*. §{ding}It’s really *three fifty*.'],
        [4, 'For the average driver, that’s about five dollars a year. §For the whole country, §{caja}*over a billion*.'],
        [5, 'So when you see the sign, §*round it up*. §{pop}Had you ever noticed the nine-tenths? Follow for the next one.']
      ]
    } },
    fijo: () => `<div class="hud i">MONEY, EXPLAINED</div><div class="hud d"><i></i><span id="reloj">00:00</span></div>`,
    cssExtra: CSS, scriptExtra: SCRIPT,
    escenas: [
      // 0 · El cartel con «$3.49 9/10»; el 9/10 late en rojo y crece en «You can’t even pay it».
      { html: () => '', anim: null },
      // 1 · Los años 30: 20¢ el galón, el impuesto federal (1¢ en 1932, 1½¢ en 1933) y el ejemplo 20¢ + 1½¢ = 21½¢.
      { html: () => `<div class="tj roja" data-t="translateX(-50%)" data-m="1" style="top:1150px"><small>FEDERAL GAS TAX</small>
            <span class="l">1932: <span class="r">1¢</span> · 1933: <span class="r">1½¢</span></span></div>
          <div class="tj" data-t="translateX(-50%)" data-m="2" style="top:1290px"><small>EXAMPLE · 1933</small>
            <span class="l">20¢ + 1½¢ = 21<span class="r">½</span>¢</span></div>
          ${fuente('CRS, RL30304 (federal gas tax) · NACS, 2026')}`, anim: an },
      // 2 · El impuesto se va; el 9/10 se queda solo.
      { html: () => '', anim: null },
      // 3 · Efecto del dígito izquierdo: 3.49 9/10 parece 3.49; en el ding, 3.50 en turquesa.
      { html: () => `<div class="tj amb" data-t="translateX(-50%)" data-m="0" style="top:1255px"><small>LEFT-DIGIT EFFECT</small>
            <span class="l">Your brain reads <span class="a">$3.49</span></span></div>
          ${fuente('Thomas & Morwitz, 2005 · Lacetera, Pope & Sydnor, 2012')}`, anim: an },
      // 4 · Lo que suma: unos 5 $ al año por conductor; más de mil millones en todo el país.
      { html: () => `<div class="tj" data-t="translateX(-50%)" data-m="-1" style="top:500px"><small>AVERAGE DRIVER</small>
            <span class="l">≈ ${Math.round(GALONES / CONDUCTORES / 10) * 10} gal × 0.9¢ ≈ <span class="t">$5 a year</span></span></div>
          <div class="tj amb" data-t="translateX(-50%)" data-m="1" style="top:660px"><small>WHOLE COUNTRY</small>
            <span class="l">${(GALONES / 1e9).toFixed(1)} billion gal × 0.9¢</span><span class="l"><span class="a">≈ $${(GALONES * NUEVE / 1e9).toFixed(1)} billion</span></span></div>
          <div class="fuente" style="top:905px">EIA, 2025 gasoline use · FHWA, 2024 licensed drivers</div>`, anim: an },
      // 5 · Redondea; la pregunta y «Follow for the next one».
      { html: () => `<div class="rotulo" data-t="translateX(-50%)" data-m="0" style="top:500px">Round it up: $3.49⁹⁄₁₀ → $3.50</div>
          <div class="pregunta" data-t="" data-m="1" style="top:610px">Ever noticed the <b>9/10</b>?<small><i>Follow</i> for the next one</small></div>`, anim: an }
    ],
    tres: function (t, k, s, e, W) {
      const p = Math.min(1, s / (e.fin - e.ini)), M = e.seg.flatMap(g => g.marcas);
      const mk = (j, def) => e.ini + (M[j] != null ? M[j] : def);
      const ROJO = '#f87171', TURQ = '#5eead4';
      const fuera = { x: -60, z: -60, esc: 0 };
      // Paseantes al fondo (dan vida al plano) por dos aceras detrás del cartel.
      const aceras = (i, a, n) => { if (i >= n) return fuera; const dir = i % 2 ? 1 : -1, u = (((t * a.vel + a.u0) % 26) + 26) % 26 - 13;
        return { x: dir * u, z: -4.5 - (i % 3) * 1.6, rot: dir > 0 ? Math.PI / 2 : -Math.PI / 2, amp: 1, fase: t * a.vel * 4.5, esc: Math.min(1, (13 - Math.abs(u)) / 2) }; };
      let directo = (i, a) => aceras(i, a, 10);
      if (k === 0) {
        const m0 = mk(0, 2), g = sale(tramo(t, m0 - 0.05, m0 + 0.4));
        W.cartel({ titulo: 'REGULAR', precio: '$3.49', frac: '9/10', fracColor: ROJO, fracEsc: 1 + 0.45 * g + 0.07 * Math.sin(t * 7) });
        W.camara(1.6 - 0.9 * p, 2.0 + 0.3 * p, 7.6 - 1.4 * p, 0, 3.05, 0);
      } else if (k === 1) {
        const m2 = mk(2, 5), ej = sale(tramo(t, m2 - 0.05, m2 + 0.4));
        W.cartel({ titulo: '1930s', precio: ej > 0.5 ? '21' : '20¢', frac: ej > 0.5 ? '½¢' : '', fracColor: ROJO, fracEsc: 1.2 });
        W.niebla(10, 34);
        W.camara(-4.2 + 1.2 * p, 2.4, 7.4 - 0.5 * p, 0.3, 2.55, 0);
      } else if (k === 2) {
        const m0 = mk(0, 1), g = sale(tramo(t, m0 - 0.05, m0 + 0.4));
        W.cartel({ titulo: 'REGULAR', precio: '$3.49', frac: '9/10', fracColor: ROJO, op: 0.3, fracEsc: 1.2 + 0.35 * g + 0.06 * Math.sin(t * 8) });
        W.camara(2.6 - 0.4 * p, 3.3, 5.6 - 0.6 * p, 0.55, 3.35, 0);
      } else if (k === 3) {
        const m0 = mk(0, 1.4), m1 = mk(1, 2.6), mira = sale(tramo(t, m0 - 0.05, m0 + 0.3)), r = t > m1;
        W.cartel({ titulo: 'REGULAR', precio: r ? '$3.50' : '$3.49', frac: r ? '' : '9/10', fracColor: ROJO, fracOp: 1 - 0.8 * mira, color: r ? TURQ : '#ffffff' });
        directo = () => fuera;
        W.camara(0, 3.5, 8.4 - 0.9 * p, 0, 3.3, 0);
      } else if (k === 4) {
        const m1 = mk(1, 2.6), lit = sale(tramo(t, m1 - 0.05, m1 + 0.5));   // sin cartel: solo la fila y las dos tarjetas
        // Una fila de «monedas» (maniquíes ámbar pequeños) que llega desde el horizonte y no se acaba.
        directo = (i, a) => {
          if (i >= 40) return fuera;
          const u = (((t * 1.6 + i * 1.1) % 44) + 44) % 44, z = u - 41, x = 2.2 + 0.35 * Math.sin(i * 1.7);
          return { x, z, rot: Math.PI * 0, amp: 1, fase: t * 7 + i, esc: 0.55 * Math.min(1, u / 4) * Math.min(1, (44 - u) / 1.5),
            color: '#e2a336', cq: 0.55 + 0.4 * lit, brillo: 0.15 + 0.3 * lit };
        };
        W.niebla(12, 46);
        W.camara(4.6 - 0.6 * p, 1.6, 6.5, 0.6, 2.2, -8);
      } else {
        const m0 = mk(0, 1.2), r = t > m0;
        W.cartel({ titulo: 'REGULAR', precio: r ? '$3.50' : '$3.49', frac: r ? '' : '9/10', fracColor: ROJO, color: r ? TURQ : '#ffffff' });
        W.heroe({ x: -1.6, z: 2.6, luz: 1, gira: Math.PI * 0.82 });
        const a = 0.35 - 0.25 * p; W.camara(-1.6 + Math.sin(a) * 7.5, 2.3, 2.6 + Math.cos(a) * 7.5, -0.2, 3.9, 0);
      }
      W.multitud(t, { directo });
    },
    texto: { en: `That 9/10 of a cent on every gas sign isn’t a typo. ⛽

It started in the 1930s, when the first federal gas tax went from 1¢ to 1.5¢ a gallon. Today it’s 18.4¢, and the 9/10 never left.
Iowa actually banned fractional gas pricing in 1985. Four years later, the ban was gone.

Had you ever noticed it? Do you round up in your head? 👇

Sources: CRS RL30304 (federal gas tax) · NACS (2026) · EIA, gasoline use 2025 · FHWA, licensed drivers 2024 · Thomas & Morwitz (2005).

#gasprices #pricing #moneyfacts` }
  }),

  // en-curious-gas-stations · Where gas stations make their money. On paper (gross profit), most of it is inside; after costs,
  // in 2025 the inside lost money on the average purchase and fuel margins kept stores profitable. Sources in the header.
  'en-curious-gas-stations': pildora3d({
    slug: 'en-curious-gas-stations', cuenta: 'en',
    T: { en: {
      titulo: 'Where gas stations really make their money',
      guion: [
        [0, 'You’d think gas stations make their money on gas. §{pop}On paper, *most of it comes from inside*.'],
        [1, 'In 2025, gas was about *two-thirds* of what U.S. convenience stores sold, §but only *39 percent* of their gross profit.'],
        [2, 'They keep about *forty cents* a gallon. §A fifteen-gallon fill-up: §{caja}about *six dollars*.'],
        [3, 'Inside, it’s the opposite: §about a third of the sales, §{ding}*over sixty percent* of the gross profit.'],
        [4, 'But after wages and every other cost, §the average purchase inside §{pop}*lost seven cents* in 2025. §The pump kept stores profitable.'],
        [5, 'So who pays for whom: §{pop}the store, or the pump? Follow for the next one.']
      ]
    } },
    fijo: () => `<div class="hud i">MONEY, EXPLAINED</div><div class="hud d"><i></i><span id="reloj">00:00</span></div>`,
    cssExtra: CSS + `
      .barras { position: absolute; left: 70px; right: 70px; top: 500px; background: rgba(9,14,27,.9); border: 2px solid rgba(148,163,184,.32);
        border-radius: 24px; padding: 18px 28px 22px; opacity: 0; }
      .barras .bfila { margin: 6px 0 14px; opacity: 0; }
      .barras small { display: block; font: 700 23px/1.35 ${MONO}; letter-spacing: .14em; color: #94a3b8; margin-bottom: 6px; }
      .barras .b { display: flex; height: 72px; border-radius: 14px; overflow: hidden; font-size: 38px; font-weight: 900; }
      .barras .b span { display: flex; align-items: center; justify-content: center; white-space: nowrap; }
      .barras .gas { background: #e2a336; color: #1f1406; } .barras .tienda { background: #2dd4bf; color: #06201c; }
      .leyenda { display: flex; gap: 26px; justify-content: center; font-size: 30px; font-weight: 750; color: #cbd5e1; margin-top: 4px; }
      .leyenda i { display: inline-block; width: 22px; height: 22px; border-radius: 6px; margin-right: 8px; vertical-align: -2px; }`,
    scriptExtra: SCRIPT,
    escenas: [
      // 0 · El cartel y la tienda (puerta turquesa); la gente va de los surtidores a la tienda.
      { html: () => '', anim: null },
      // 1 · Barras: ventas (65 / 35) y, en la marca, beneficio bruto (39 / 61).
      { html: () => `<div class="barras" data-t="" data-m="-1">
            <div class="bfila" data-t="" data-m="-1"><small>SHARE OF SALES</small><div class="b"><span class="gas" style="width:${GAS_V}%">${GAS_V}%</span><span class="tienda" style="width:${100 - GAS_V}%">${100 - GAS_V}%</span></div></div>
            <div class="bfila" data-t="" data-m="0"><small>SHARE OF GROSS PROFIT</small><div class="b"><span class="gas" style="width:${GAS_B}%">${Math.round(GAS_B)}%</span><span class="tienda" style="width:${100 - GAS_B}%">${Math.round(100 - GAS_B)}%</span></div></div>
            <div class="leyenda"><span><i style="background:#e2a336"></i>Fuel</span><span><i style="background:#2dd4bf"></i>Inside the store</span></div></div>
          <div class="fuente" style="top:845px">NACS State of the Industry, 2025 data</div>`, anim: an },
      // 2 · Unos 40¢ por galón; un depósito de 15 galones ≈ 6 $.
      { html: () => `<div class="tj amb" data-t="translateX(-50%)" data-m="0" style="top:1250px"><small>EXAMPLE · 15-GALLON FILL-UP</small>
            <span class="l">15 gal × ${Math.round(MARGEN * 100)}¢ ≈ <span class="a">$${Math.round(15 * MARGEN)}</span></span></div>
          <div class="fuente" style="top:1395px">NACS: fuel margins averaged over 40¢ a gallon in 2025</div>`, anim: an },
      // 3 · Dentro: un tercio de las ventas, más del 60 % del beneficio bruto.
      { html: () => `<div class="tj turq" data-t="translateX(-50%)" data-m="1" style="top:500px"><small>INSIDE THE STORE</small>
            <span class="l">${100 - GAS_V}% of sales → <span class="t">${Math.round(100 - GAS_B)}% of gross profit</span></span></div>
          <div class="fuente" style="top:615px">NACS State of the Industry, 2025 data</div>`, anim: an },
      // 4 · Después de los costes: −7¢ por compra dentro; el surtidor sostiene la tienda.
      { html: () => `<div class="tj roja" data-t="translateX(-50%)" data-m="1" style="top:500px"><small>AFTER ALL COSTS · 2025</small>
            <span class="l">Average inside purchase: <span class="r">−7¢</span></span></div>
          <div class="rotulo" data-t="translateX(-50%)" data-m="2" style="top:680px;background:#e2a336">Fuel kept stores profitable</div>
          <div class="fuente" style="top:780px">NACS State of the Industry Summit, 2026 (2025 data)</div>`, anim: an },
      // 5 · La pregunta y «Follow for the next one».
      { html: () => `<div class="pregunta" data-t="" data-m="0" style="top:520px;font-size:72px">Store pays for the pump, or <b style="color:#f5b94a">pump pays for the store</b>?<small><i>Follow</i> for the next one</small></div>`, anim: an }
    ],
    tres: function (t, k, s, e, W) {
      const p = Math.min(1, s / (e.fin - e.ini)), M = e.seg.flatMap(g => g.marcas);
      const mk = (j, def) => e.ini + (M[j] != null ? M[j] : def);
      const TURQ = 0x2dd4bf, AMB = '#f5b94a', TQ = '#5eead4';
      const SX = -1.4, PX = 1.8, PZ = -1.8;   // cartel a la izquierda; puerta de la tienda (turquesa) a la derecha
      const fuera = { x: -60, z: -60, esc: 0 };
      // Clientes: salen de la zona de surtidores (delante del cartel) y entran en la tienda, en bucle.
      const clientes = (n, brillo) => (i, a) => {
        if (i >= n) return fuera;
        const L = 7.5, u = (((t * 1.1 + i * L / n) % L) + L) % L, q = u / L;
        const x0 = SX + 0.6 + (i % 3) * 0.4, z0 = 2.6 + (i % 2) * 0.6, x = x0 + (PX - x0) * q, z = z0 + (PZ + 0.2 - z0) * q;
        return { x, z, rot: Math.atan2(PX - x0, PZ - z0), amp: 1, fase: t * 6 + i, esc: Math.min(1, q * 6) * Math.min(1, (1 - q) * 6),
          color: TURQ, cq: brillo * q, brillo: 0.3 };
      };
      let directo = clientes(8, 0.8), cart = { titulo: 'REGULAR', precio: '$3.11', frac: '', color: '#ffffff' };
      W.puerta({ x: PX, z: PZ, rot: -0.35, color: TURQ, cq: 1, luz: 1 });
      if (k === 0) {
        const m0 = mk(0, 2), g = sale(tramo(t, m0 - 0.05, m0 + 0.4));
        W.etiqueta('inside', 'INSIDE', PX, 3.25, PZ, g, '#5eead4', 1.5 + 0.1 * Math.sin(t * 7) * g);
        W.cartel({ x: SX, z: 0, rot: 0.3, ...cart });
        W.camara(0.3 - 0.4 * p, 3.2, 14 - 0.8 * p, 0.15, 3.15, -0.5);
      } else if (k === 1) {
        W.cartel({ x: SX, z: 0, rot: 0.3, ...cart });
        W.niebla(10, 34);
        W.camara(-0.3 + 0.5 * p, 2.8, 14.5, 0.15, 3.5, -0.6);
      } else if (k === 2) {
        const m2 = mk(1, 3);
        cart = t > m2 ? { titulo: '15-GALLON FILL-UP', precio: '≈ $6', frac: '', color: AMB } : { titulo: 'STORE KEEPS', precio: '≈ 40¢', frac: '/gal', fracColor: '#cbd5e1', color: AMB };
        W.cartel({ x: 0, z: 0, ...cart });
        directo = () => fuera;
        W.camara(0.4 - 0.5 * p, 3.4, 7.8 - 0.7 * p, 0, 3.1, 0);
      } else if (k === 3) {
        directo = clientes(10, 1);
        W.camara(PX + 3.4 - 0.8 * p, 2.4, PZ + 8.5 - 0.6 * p, PX - 0.6, 2.4, PZ);
      } else if (k === 4) {
        const m1 = mk(1, 2.5), m2 = mk(2, 4), luz = sale(tramo(t, m2 - 0.05, m2 + 0.4));
        W.puerta({ x: PX, z: PZ, rot: -0.35, color: TURQ, cq: 1 - 0.7 * sale(tramo(t, m1 - 0.05, m1 + 0.4)), luz: 1 - 0.5 * sale(tramo(t, m1, m1 + 0.4)) });
        W.etiqueta('menos7', '−7¢', PX, 3.3, PZ, sale(tramo(t, m1 - 0.05, m1 + 0.3)), '#f87171', 1.4);
        W.cartel({ x: SX, z: 0, rot: 0.3, ...cart, color: luz > 0.5 ? AMB : '#ffffff' });
        directo = clientes(8, 0.4);
        W.camara(0.3, 3.0, 14.5 - 0.6 * p, 0.15, 3.6, -0.5);
      } else {
        W.cartel({ x: SX, z: 0, rot: 0.3, ...cart, color: AMB });
        W.heroe({ x: 0.4, z: 1.8, luz: 1, gira: 0.35 * Math.sin(s * 1.2) });
        directo = clientes(6, 0.8);
        const a = 0.12 - 0.24 * p; W.camara(Math.sin(a) * 13.5, 2.6, Math.cos(a) * 13.5, 0.15, 3.9, -0.5);
      }
      W.multitud(t, { directo });
    },
    texto: { en: `Gas stations sell you gas… but where do they actually make their money? ⛽

Food is the star inside: 28.5% of in-store sales, but almost 39% of in-store gross profit.
And the average convenience-store basket was $7.69 in 2025, with labor alone costing about $1.60 per transaction.

So who’s paying for whom: the store for the pump, or the pump for the store? 👇

Sources: NACS State of the Industry (2025 data) and NACS State of the Industry Summit 2026, via NACS and NACS Magazine.

#gasstation #convenience #moneyfacts` }
  })
};


module.exports = { pildoras };
