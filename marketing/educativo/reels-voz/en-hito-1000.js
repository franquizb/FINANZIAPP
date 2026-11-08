// Pill ONLY for @finanziapp (US): what changes when you save your first $1,000 (milestone series).
// Word-by-word captions and sound effects (§{sound} in the script).
// Sources: Bankrate Emergency Savings Report (January 2026): 30% of U.S. adults would pay a $1,000 emergency
//   expense from savings. Credit card APRs above 20%: Federal Reserve G.19 (interest on accounts assessed interest).
//   $20 × 52 weeks = $1,040.
const { C, VOZ, CSS, cierreCon, muneco, SCRIPT_MUNECO } = require('./_comun');
const { cuadra } = require('../reels/_comun');
const { coche } = require('./precio-999.js').piezas;

cuadra('$20 × 52 weeks', 20 * 52, 1040);
const ROJO = '#e66767';

// Jar of coins (origin: floor center). The level rises with .nivel.
const tarro = (clase, x, y, esc, texto) => `<g class="${clase}" transform="translate(${x},${y}) scale(${esc})">
  <defs><clipPath id="clip-${clase}"><rect x="-105" y="-230" width="210" height="228" rx="38"/></clipPath></defs>
  <rect x="-77" y="-262" width="154" height="34" rx="10" fill="#33415c"/>
  <g clip-path="url(#clip-${clase})"><rect class="nivel" x="-105" y="-140" width="210" height="160" fill="${C.necesidades}"/>
    ${[[-55, -118], [0, -128], [55, -116], [-28, -86], [30, -88], [-60, -60], [5, -55], [60, -58]].map(([cx, cy]) => `<circle cx="${cx}" cy="${cy}" r="20" fill="#e9c46a" stroke="#b8902e" stroke-width="4"/>`).join('')}</g>
  <rect x="-105" y="-230" width="210" height="228" rx="38" fill="none" stroke="${C.acento}" stroke-width="8"/>
  <rect x="-88" y="-205" width="176" height="62" rx="14" fill="#f1f5f9"/><text x="0" y="-160" text-anchor="middle" font-size="42" font-weight="900" fill="#0f766e">${texto}</text>
</g>`;
// Little person icon for the "3 in 10" row.
const persona = (x, y, color, clase) => `<g class="${clase}" transform="translate(${x},${y})"><circle cx="0" cy="-58" r="16" fill="${color}"/><rect x="-15" y="-38" width="30" height="46" rx="12" fill="${color}"/></g>`;

const T = {
  en: {
    titulo: 'Your first <span class="c">$1,000</span> changes 3 things.',
    retencion: 'Number 3 is <span class="c">the sneaky one</span>',
    guion: [
      [0, 'Only *3 in 10 Americans* would pay a §*$1,000 emergency* from savings. [short pause] Get there, and §{ding}three things change.'],
      [1, 'One: §{pop}a flat tire stops being a crisis. [short pause] §It’s just *a Tuesday*.'],
      [2, 'Two: no more §swiping a card at *20% interest* §{pop}just to get through the month.'],
      [3, 'Three, the sneaky one: §you stop feeling *one bill away from panic*. [short pause] §{ding}And saving starts to feel *possible*.'],
      [4, 'How? §*$20 a week*. §{caja}That’s $1,040 in a year.'],
      [5, 'Next: why your 401(k) match might be the *best return* you’ll ever get. [short pause] *Follow* so you don’t miss it.']
    ],
    cierre: 'The best return you’ll ever get? <span class="c">Follow</span> so you don’t miss it.'
  }
};

module.exports = {
  slug: 'en-hito-1000',
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
  `,
  escenas: [
    // 0 · Hook (complete at frame 0): 10 people, 3 lit up; the $1,000 jar and a person next to it; "3 things" badge.
    {
      html: (t) => `<div class="gancho" style="position:relative"><h1 class="a">${t.titulo}</h1></div>
        <svg viewBox="0 0 1080 1250" width="1080" height="1250" style="position:absolute;left:0;top:0;overflow:visible;font-family:Inter,sans-serif">
          <g class="fila">${Array.from({ length: 10 }, (_, i) => persona(440 + i * 56, 360, i < 3 ? C.acento : '#334155', 'p' + i)).join('')}</g>
          <text x="692" y="412" text-anchor="middle" font-size="34" font-weight="800" fill="#cbd5e1"><tspan fill="${C.acento}">3 in 10</tspan> could pay it from savings</text>
          ${tarro('t0', 760, 900, 1.15, '$1,000')}
          ${muneco(200, 660, 1.6, '', 'm1')}
          <g class="tres" opacity="0"><rect x="500" y="440" width="400" height="84" rx="42" fill="${C.acento}"/><text x="700" y="496" text-anchor="middle" font-size="42" font-weight="900" fill="#0b1222">3 things change</text></g>
        </svg>`,
      anim: function (s, e, el) {
        const m = e.seg[0].marcas;
        for (let i = 0; i < 3; i++) el.querySelector('.p' + i).setAttribute('transform', 'translate(' + (440 + i * 56) + ',' + (360 - Math.abs(Math.sin(s * 4 + i)) * 10) + ')');
        el.querySelector('.t0').setAttribute('transform', 'translate(760,900) scale(1.15) rotate(' + (Math.sin(s * 2.4) * 2) + ' 0 0)');
        const up = sale(tramo(s, m[1] - 0.3, m[1] + 0.2)), P = mezclaPose(POSES.pensando, { pa: -10, pb: 10, pa2: 4, pb2: -4, ba: -150, ba2: -20, bb: 150, bb2: 18, y: -6 }, up);
        P.y = (P.y || 0) - Math.abs(Math.sin(s * 7)) * 8 * up; posar(el.querySelector('.m1'), P);
        const q = rebote(tramo(s, m[1] - 0.1, m[1] + 0.35)), g = el.querySelector('.tres');
        g.setAttribute('opacity', Math.min(1, q * 1.4)); g.setAttribute('transform', 'translate(700,482) scale(' + (0.6 + 0.4 * q) + ') translate(-700,-482)');
      }
    },
    // 1 · One: the flat tire. The car sags, the person shrugs, then a calendar card "TUE".
    {
      html: (t) => `<div class="sello-top"><div class="sello" style="font-size:56px">1 · Flat tire</div></div>
        <svg viewBox="0 0 1080 1250" width="1080" height="1250" style="position:absolute;left:0;top:0;overflow:visible;font-family:Inter,sans-serif">
          <g class="auto" transform="translate(640,900)">${coche('#475569', '').replace('>0</text>', '></text>')}</g>
          <g class="pinchazo" opacity="0"><path d="M540 830 l20 -30 l10 26 l24 -20 l-6 30" fill="none" stroke="#f0b45a" stroke-width="6" stroke-linejoin="round"/></g>
          ${muneco(220, 660, 1.5, '', 'm1')}
          <g class="cal" opacity="0"><rect x="280" y="250" width="230" height="210" rx="24" fill="#f1f5f9"/><rect x="280" y="250" width="230" height="64" rx="24" fill="${C.necesidades}"/><rect x="280" y="290" width="230" height="24" fill="${C.necesidades}"/>
            <text x="395" y="300" text-anchor="middle" font-size="38" font-weight="900" fill="#fff">TUE</text><text x="395" y="420" text-anchor="middle" font-size="84" font-weight="900" fill="#0f172a">😌</text></g>
        </svg>`,
      anim: function (s, e, el) {
        const m = e.seg[0].marcas;
        const pin = tramo(s, m[0], m[0] + 0.4), a = el.querySelector('.auto');
        a.setAttribute('transform', 'translate(700,' + (900 + 10 * sale(pin)) + ') scale(1.35) rotate(' + (-4 * sale(pin)) + ')');
        el.querySelector('.pinchazo').setAttribute('opacity', pin > 0 && pin < 1 ? 1 : pin >= 1 ? 0.6 : 0);
        const enc = sale(tramo(s, m[0] + 0.1, m[0] + 0.5)), calma = sale(tramo(s, m[1] - 0.2, m[1] + 0.3));
        posar(el.querySelector('.m1'), mezclaPose(mezclaPose(POSES.pie, POSES.encoge, enc), POSES.pie, calma));
        const c = rebote(tramo(s, m[1], m[1] + 0.4)), g = el.querySelector('.cal');
        g.setAttribute('opacity', Math.min(1, c * 1.4)); g.setAttribute('transform', 'translate(395,355) rotate(' + (-6 + Math.sin(s * 3) * 3) + ') scale(' + (0.6 + 0.4 * c) + ') translate(-395,-355)');
      }
    },
    // 2 · Two: the 20% credit card gets pushed away by the $1,000 sign.
    {
      html: (t) => `<div class="sello-top"><div class="sello" style="font-size:56px">2 · No more 20% debt</div></div>
        <svg viewBox="0 0 1080 1250" width="1080" height="1250" style="position:absolute;left:0;top:0;overflow:visible;font-family:Inter,sans-serif">
          <g class="tarjeta"><rect x="-190" y="-120" width="380" height="240" rx="26" fill="#7c6cf0"/><rect x="-190" y="-70" width="380" height="44" fill="#0b1222" opacity=".55"/>
            <rect x="-150" y="0" width="70" height="52" rx="10" fill="#e9c46a"/><text x="160" y="90" text-anchor="end" font-size="52" font-weight="900" fill="#fff">20% APR</text></g>
          <g class="equis" opacity="0"><line x1="-170" y1="-140" x2="170" y2="140" stroke="${ROJO}" stroke-width="22" stroke-linecap="round"/><line x1="170" y1="-140" x2="-170" y2="140" stroke="${ROJO}" stroke-width="22" stroke-linecap="round"/></g>
          ${muneco(260, 660, 1.5, '', 'm1')}
          <g class="cartel" opacity="0"><line x1="0" y1="0" x2="0" y2="-36" stroke="#94a3b8" stroke-width="8"/><rect x="-120" y="-150" width="240" height="114" rx="20" fill="#f1f5f9" stroke="${C.acento}" stroke-width="6"/>
            <text x="0" y="-74" text-anchor="middle" font-size="56" font-weight="900" fill="#0f766e">$1,000</text></g>
        </svg>`,
      anim: function (s, e, el) {
        const m = e.seg[0].marcas;
        const fuera = sale(tramo(s, m[1], m[1] + 0.5));
        const tx = 720 + 260 * fuera, ty = 470 + Math.sin(s * 2) * 8;
        el.querySelector('.tarjeta').setAttribute('transform', 'translate(' + tx + ',' + ty + ') rotate(' + (-8 + 25 * fuera) + ')');
        const x = rebote(tramo(s, m[1] - 0.05, m[1] + 0.3)), g = el.querySelector('.equis');
        g.setAttribute('opacity', Math.min(1, x * 1.4) * (1 - fuera * 0.8)); g.setAttribute('transform', 'translate(' + tx + ',' + ty + ') scale(' + (0.5 + 0.5 * x) + ')');
        const up = sale(tramo(s, m[0] - 0.3, m[0] + 0.1)), P = mezclaPose(POSES.pie, POSES.cartel, up), gm = el.querySelector('.m1');
        P.y = -Math.abs(Math.sin(s * 6)) * 6 * up; posar(gm, P);
        const [hx, hy] = mano(gm, P, 'a'), ca = el.querySelector('.cartel');
        ca.setAttribute('opacity', up); ca.setAttribute('transform', 'translate(' + hx + ',' + hy + ') rotate(' + (Math.sin(s * 6) * 4) + ')');
      }
    },
    // 3 · Three: the panic meter drops from red to green, the person relaxes.
    {
      html: (t) => `<div class="sello-top"><div class="sello" style="font-size:56px">3 · Panic mode: off</div></div>
        <svg viewBox="0 0 1080 1250" width="1080" height="1250" style="position:absolute;left:0;top:0;overflow:visible;font-family:Inter,sans-serif">
          <g transform="translate(700,560)">
            <path d="M-240 0 A240 240 0 0 1 -120 -207.8" fill="none" stroke="#199e70" stroke-width="44"/>
            <path d="M-120 -207.8 A240 240 0 0 1 120 -207.8" fill="none" stroke="#c98500" stroke-width="44"/>
            <path d="M120 -207.8 A240 240 0 0 1 240 0" fill="none" stroke="${ROJO}" stroke-width="44"/>
            <text x="-250" y="60" text-anchor="middle" font-size="32" font-weight="800" fill="#94a3b8">calm</text><text x="250" y="60" text-anchor="middle" font-size="32" font-weight="800" fill="#94a3b8">panic</text>
            <g class="aguja"><line x1="0" y1="0" x2="0" y2="-200" stroke="#f1f5f9" stroke-width="14" stroke-linecap="round"/></g><circle r="26" fill="#f1f5f9"/>
          </g>
          ${muneco(210, 660, 1.5, '', 'm1')}
        </svg>`,
      anim: function (s, e, el) {
        const m = e.seg[0].marcas;
        const baja = sale(tramo(s, m[0], m[0] + 1.2)), temblor = (1 - baja) * Math.sin(s * 30) * 4;
        el.querySelector('.aguja').setAttribute('transform', 'rotate(' + (lerp(70, -70, baja) + temblor) + ')');
        const P = mezclaPose(POSES.encoge, { pa: -10, pb: 10, pa2: 4, pb2: -4, ba: -150, ba2: -20, bb: 150, bb2: 18, y: -6 }, sale(tramo(s, m[1] - 0.2, m[1] + 0.3)));
        P.x = (1 - baja) * Math.sin(s * 25) * 3; posar(el.querySelector('.m1'), P);
      }
    },
    // 4 · How: $20 a week, coins drop into the jar and the counter hits $1,040.
    {
      html: (t) => `<div class="sello-top"><div style="font-size:64px;font-weight:900;color:#f1f5f9"><span style="color:${C.acento}">$20</span> × 52 weeks</div></div>
        <svg viewBox="0 0 1080 1250" width="1080" height="1250" style="position:absolute;left:0;top:0;overflow:visible;font-family:Inter,sans-serif">
          ${tarro('t4', 700, 900, 1.25, '$1,040')}
          ${Array.from({ length: 6 }, (_, i) => `<g class="mon mon-${i}" opacity="0"><circle r="30" fill="#e9c46a" stroke="#b8902e" stroke-width="5"/><text y="11" text-anchor="middle" font-size="30" font-weight="900" fill="#8a6a1f">$</text></g>`).join('')}
          <text class="cuenta" x="700" y="330" text-anchor="middle" font-size="110" font-weight="900" fill="#f1f5f9">$0</text>
          ${muneco(230, 660, 1.5, '', 'm1')}
        </svg>`,
      anim: function (s, e, el) {
        const m = e.seg[0].marcas;
        const p = tramo(s, 0.2, m[1]);
        for (let i = 0; i < 6; i++) { const c = tramo(p, i / 6, i / 6 + 0.25), g = el.querySelector('.mon-' + i);
          g.setAttribute('opacity', c > 0 && c < 1 ? 1 : 0); g.setAttribute('transform', 'translate(' + (680 + (i % 3) * 20) + ',' + lerp(380, 700, c * c) + ')'); }
        const v = Math.round(1040 * sale(p) / 20) * 20, f = s >= m[1] ? 1040 : v;
        el.querySelector('.cuenta').textContent = '$' + f.toLocaleString('en-US');
        el.querySelector('.cuenta').setAttribute('fill', s >= m[1] ? '#5eead4' : '#f1f5f9');
        const lleno = s >= m[1] ? rebote(tramo(s, m[1], m[1] + 0.4)) : 0;
        el.querySelector('.t4').setAttribute('transform', 'translate(700,900) scale(' + (1.25 + 0.06 * lleno * Math.sin(Math.min(1, s - m[1]) * Math.PI)) + ')');
        el.querySelector('.t4 .nivel').setAttribute('y', lerp(-40, -150, sale(p)));
        posar(el.querySelector('.m1'), mezclaPose(POSES.pie, POSES.cartel, 0.35 * Math.abs(Math.sin(s * 3))));
      }
    },
    // 5 · Closing: jump with confetti, with the 401(k) question.
    cierreCon('salto')
  ],
  texto: {
    en: `Only 3 in 10 Americans would pay a $1,000 emergency from savings (Bankrate, 2026). Get there and 3 things change: 💸

1️⃣ A flat tire stops being a crisis. It’s just a Tuesday.
2️⃣ No more swiping a card at 20%+ interest just to get through the month.
3️⃣ The sneaky one: you stop feeling one bill away from panic, and saving starts to feel possible.

How? $20 a week = $1,040 in a year.

What changed for you when you hit your first $1,000? Or are you on your way? 👇

Next up: why your 401(k) match might be the best return you’ll ever get. Follow so you don’t miss it.

#personalfinance #emergencyfund #savingmoney #moneytips #financialliteracy`
  }
};
