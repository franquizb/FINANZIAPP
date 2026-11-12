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
  })
};

module.exports = { pildoras };
