// Pill ONLY for @finanziapp (US): 79,900 vs 80,000 miles (left-digit effect).
// Full first frame: both cars, odometers and the title are on screen from frame 0.
// Sources: Lacetera, Pope & Sydnor (2012), AER, 22M used-car sales; Thomas & Morwitz (2005), JCR.
const { C, VOZ, CSS, cierreCon, muneco, SCRIPT_MUNECO } = require('./_comun');
const base = require('./precio-999.js');
const { coche } = base.piezas;

const T = {
  en: {
    titulo: '100 miles apart. <span class="c">$200 difference.</span>',
    retencion: 'Wait for <span class="c">the $9.99 part</span>',
    l: { coches: '22 million used-car sales · Lacetera, Pope & Sydnor (2012)', mas: '+$200', termino: 'Left-digit effect', fuente: 'Lacetera, Pope & Sydnor (2012) · Thomas & Morwitz (2005)',
      redondea: 'Round up', pares: [['$9.99', '$10'], ['$49.90', '$50']], sep: ',' },
    guion: [
      [0, 'A car with *79,900 miles* sells for about §*$200 more* than one with 80,000.'],
      [0, 'A hundred miles. [short pause] Two hundred dollars. [short pause] Why?'],
      [1, 'Your brain reads the §*first digit* and stops: 79 feels way smaller than 80.'],
      [1, 'It’s called the §*left-digit effect*. And it’s exactly why everything costs §*$9.99*.'],
      [2, 'Your defense: §*round up*. $9.99 is ten. $49.90 is fifty.'],
      [3, 'Now: why does “was $199, now $99” work, even when you know it’s made up? [short pause] If you’re curious, *follow*.']
    ],
    cierre: 'Why does “was $199” work? <span class="c">Follow</span> so you don’t miss it.'
  }
};

module.exports = {
  slug: 'en-millas-79900',
  cuenta: 'en',
  arranque: 'lleno',
  inicio: 0.1,
  suelo: true,
  voz: VOZ,
  T,
  datos: () => ({ sep: ',' }),
  script: SCRIPT_MUNECO,
  css: CSS + `
    .escena { height: 1250px; }
    .sello-top { position: absolute; left: 0; right: 0; top: 10px; text-align: center; }
    .digitos { font-size: 170px; font-weight: 900; letter-spacing: -.04em; line-height: 1; font-variant-numeric: tabular-nums; text-align: center; }
  `,
  escenas: [
    // 0 · Hook (complete at frame 0): two cars with their odometers; the +$200 sign pops up.
    {
      html: (t) => `<div class="gancho" style="position:relative"><h1 class="a">${t.titulo}</h1></div>
        <svg viewBox="0 0 1080 1250" width="1080" height="1250" style="position:absolute;left:0;top:0;overflow:visible;font-family:Inter,sans-serif">
          ${muneco(250, 660, 1.6, '', 'mA')}${muneco(840, 660, 1.6, '', 'mB')}
          <g class="cartel" opacity="0"><line x1="0" y1="0" x2="0" y2="-40" stroke="#94a3b8" stroke-width="8"/><rect x="-130" y="-170" width="260" height="130" rx="20" fill="#f1f5f9" stroke="${C.acento}" stroke-width="6"/>
            <text x="0" y="-82" text-anchor="middle" font-size="64" font-weight="900" fill="#0f766e">${t.l.mas}</text></g>
          ${[[0, C.necesidades, 270, '79,900'], [1, '#475569', 810, '80,000']].map(([i, color, x, km]) => `<g class="coche coche-${i}" transform="translate(${x},890)">${coche(color, 'MILES').replace('>0</text>', `>${km}</text>`)}</g>`).join('')}
        </svg>`,
      anim: function (s, e, el) {
        const m = e.seg[0].marcas[0], gA = el.querySelector('.mA'), gB = el.querySelector('.mB');
        const up = sale(tramo(s, m - 0.3, m + 0.1));
        const PA = mezclaPose(POSES.pie, POSES.cartel, up); PA.y = -Math.abs(Math.sin(s * 6)) * 8 * up; posar(gA, PA);
        posar(gB, mezclaPose(POSES.pie, POSES.encoge, sale(tramo(s, e.seg[1].ini, e.seg[1].ini + 0.5))));
        const [hx, hy] = mano(gA, PA, 'a'), ca = el.querySelector('.cartel');
        ca.setAttribute('opacity', up); ca.setAttribute('transform', 'translate(' + hx + ',' + hy + ') rotate(' + (Math.sin(s * 6) * 4) + ')');
        // Something moves from frame 0: the cars idle (a small bounce).
        [0, 1].forEach(i => el.querySelector('.coche-' + i).setAttribute('transform', 'translate(' + (i ? 810 : 270) + ',' + (890 - Math.abs(Math.sin(s * 9 + i)) * 3) + ')'));
      }
    },
    // 1 · Why: the first digit wins (79 vs 80), the name, and $9.99.
    {
      html: (t) => `<div class="sello-top"><div class="sello" style="opacity:0;font-size:52px">${t.l.termino}</div><div class="fuente" style="margin-top:10px;font-size:26px;color:${C.suave};font-weight:600;opacity:0">${t.l.fuente}</div></div>
        <div style="position:absolute;left:0;right:0;top:230px">
          <div class="digitos" style="margin-right:160px"><span class="a79" style="color:${C.acento}">79</span><span class="r79" style="color:${C.suave}">,900</span></div>
          <div class="digitos" style="margin-top:20px;margin-right:160px"><span class="a80" style="color:${C.caprichos}">80</span><span class="r80" style="color:${C.suave}">,000</span></div>
        </div>
        <svg viewBox="0 0 1080 1250" width="1080" height="1250" style="position:absolute;left:0;top:0;overflow:visible;font-family:Inter,sans-serif">
          <g class="tag999" opacity="0" transform="translate(470,640)"><rect x="-160" y="0" width="320" height="170" rx="24" fill="#f1f5f9"/><circle cx="0" cy="24" r="11" fill="${C.fondo}"/>
            <text x="0" y="128" text-anchor="middle" font-size="92" font-weight="900" fill="#0f172a" letter-spacing="-2"><tspan fill="#0f9f8f">$9</tspan>.99</text></g>
          ${muneco(900, 660, 1.6, '', 'm1')}
        </svg>`,
      anim: function (s, e, el) {
        const m0 = e.seg[0].marcas[0], m1 = e.seg[1].marcas;
        const f = sale(tramo(s, m0, m0 + 0.5));
        ['r79', 'r80'].forEach(c => { el.querySelector('.' + c).style.opacity = 1 - 0.75 * f; });
        el.querySelector('.a79').style.fontSize = (170 + 30 * f) + 'px'; el.querySelector('.a80').style.fontSize = (170 + 30 * f) + 'px';
        const q = rebote(tramo(s, m1[0], m1[0] + 0.45)), st = el.querySelector('.sello');
        st.style.opacity = Math.min(1, q * 1.5); st.style.transform = 'rotate(-3deg) scale(' + (1.8 - 0.8 * q) + ')';
        el.querySelector('.fuente').style.opacity = tramo(s, m1[0] + 0.4, m1[0] + 0.9);
        const tg = rebote(tramo(s, m1[1] - 0.2, m1[1] + 0.3)), g9 = el.querySelector('.tag999');
        g9.setAttribute('opacity', Math.min(1, tg * 1.4)); g9.setAttribute('transform', 'translate(470,640) rotate(' + (Math.sin(s * 2) * 4) + ' 0 0) scale(' + (0.6 + 0.4 * tg) + ')');
        posar(el.querySelector('.m1'), POSES.pensando);
      }
    },
    // 2 · Defense: the marker rounds $9.99 → $10 and $49.90 → $50.
    base.escenas[3],
    // 3 · Closing: coins into the jar, with the "was $199" question.
    cierreCon('tarro')
  ],
  texto: {
    en: `A car with 79,900 miles sells for about $200 more than one with 80,000. A hundred miles. Two hundred dollars. 🚗

That's the left-digit effect: your brain reads the first digit and stops, so 79 feels way smaller than 80. Researchers measured it in 22 million used-car sales (Lacetera, Pope & Sydnor, 2012), and it's exactly why almost everything costs $9.99 (Thomas & Morwitz, 2005).

Your defense: round up. $9.99 is $10. $49.90 is $50.

Would you have paid the extra $200 for the 79,900 car? Be honest 👇

Next up: why does "was $199, now $99" work even when you know the "was" is made up? Follow so you don't miss it.

#personalfinance #moneytips #psychology #cars #financialliteracy`
  }
};
