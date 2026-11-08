// Píldora (~40 s) de la serie «Trampas de precio»: por qué casi todo cuesta 9,99 (efecto del dígito izquierdo).
// Responde a la pregunta con la que terminaba la píldora del señuelo y deja abierta la del «antes 199 €».
// Fuentes: Thomas y Morwitz (2005), «Penny Wise and Pound Foolish: The Left-Digit Effect in Price Cognition»,
// Journal of Consumer Research; Lacetera, Pope y Sydnor (2012), «Heuristic Thinking and Limited Attention in the
// Car Market», American Economic Review: más de 22 millones de ventas de coches usados, el precio cae de golpe
// en cada umbral de 10.000 millas (unos 200 $ entre 79.900 y 80.000).
const { C, VOZ, CSS, cierreCon, muneco, SCRIPT_MUNECO } = require('./_comun');

const T = {
  en: {
    titulo: 'Why does everything cost <span class="c">$9.99</span>?',
    retencion: 'Wait for the <span class="c">used-car part</span>',
    l: { tag: ['$9', '.99'], lectura: ['$9', '.99'], diez: '$10', lee: ['“nine-something”', '“ten”'], real: 'Real difference', siente: 'Feels like', centimo: '$0.01', euro: '$1',
      termino: 'Left-digit effect', fuente: 'Thomas & Morwitz, 2005', coches: '22 million used-car sales · Lacetera, Pope & Sydnor (2012)', millas: 'miles', mas: '+$200',
      redondea: 'Round up', pares: [['$9.99', '$10'], ['$49.90', '$50'], ['$199', '$200']], sep: ',' },
    guion: [
      [0, '[curiosity] Why does almost everything cost *$9.99* and not $10? [short pause] Because your brain gets stuck on §the *first number*.'],
      [1, 'You see $9.99 and your head says §“nine-something.” You see $10 and it says §“ten.” [short pause] One cent apart… that *feels* like a whole dollar.'],
      [1, 'It’s called the §*left-digit effect*, and it’s been studied a lot.'],
      [2, '[enthusiasm] And it’s not just prices: in 22 million used-car sales,§ cars at *79,900 miles* sold for about *$200 more*§ than cars at 80,000. [short pause] A hundred miles. Two hundred dollars.'],
      [3, 'Your defense: §*round up*. $9.99 is ten. $49.90 is fifty. [short pause] And always compare the round number.'],
      [4, 'One question: why does “was $199, now $99” work… even when you know the “was” is made up? [short pause] If you’re curious, *follow* so you don’t miss it.']
    ],
    cierre: 'Why does “was $199” work? <span class="c">Follow</span> so you don’t miss it.'
  },
  es: {
    titulo: '¿Por qué casi todo cuesta <span class="c">9,99</span>?',
    retencion: 'Lo de los coches <span class="c">no te lo esperas</span>',
    l: { tag: ['9', ',99'], lectura: ['9', ',99 €'], diez: '10 €', lee: ['«nueve y pico»', '«diez»'], real: 'Diferencia real', siente: 'Se siente como', centimo: '0,01 €', euro: '1 €',
      termino: 'Efecto del dígito izquierdo', fuente: 'Thomas y Morwitz, 2005', coches: '22 millones de ventas de coches usados · Lacetera, Pope y Sydnor (2012)', millas: 'millas', mas: '+200 $',
      redondea: 'Redondea hacia arriba', pares: [['9,99 €', '10 €'], ['49,90 €', '50 €'], ['199 €', '200 €']], sep: '.' },
    guion: [
      [0, '[curiosity] ¿Por qué casi todo cuesta *9,99* y no 10? [short pause] Porque tu cerebro se queda con §el *primer número*.'],
      [1, 'Ves 9,99 y tu cabeza dice §«nueve y pico». Ves 10 y dice §«diez». [short pause] Un céntimo de diferencia… que se *siente* como un euro.'],
      [1, 'Se llama §*efecto del dígito izquierdo*, y está más que estudiado.'],
      [2, '[enthusiasm] Y no pasa solo con precios: en 22 millones de ventas de coches usados en Estados Unidos,§ los de *79.900 millas* se vendían por unos *200 dólares más*§ que los de 80.000. [short pause] Cien millas. Doscientos dólares.'],
      [3, 'Tu defensa: §*redondea hacia arriba*. 9,99 son 10. 49,90 son 50. [short pause] Y compara siempre con el número redondo.'],
      [4, 'Y una pregunta: ¿por qué funciona el «antes 199, ahora 99»… aunque sepas que el «antes» es inventado? [short pause] Si te pica la curiosidad, *síguenos* para no perdértelo.']
    ],
    cierre: '¿Por qué funciona el «antes 199 €»? <span class="c">Síguenos</span> para no perdértelo.'
  }
};

const ROJO_T = '#e66767';
// Nube de pensamiento centrada en (cx, cy) con su estela hacia abajo a la izquierda.
const nube = (clase, cx, cy, rx, ry) => `<g class="${clase}" opacity="0" fill="#f1f5f9">
  <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/><circle cx="${cx - rx * 0.55}" cy="${cy - ry * 0.55}" r="${ry * 0.6}"/><circle cx="${cx + rx * 0.5}" cy="${cy - ry * 0.6}" r="${ry * 0.55}"/>
  <circle cx="${cx - rx * 0.75}" cy="${cy + ry * 1.05}" r="${ry * 0.2}"/><circle cx="${cx - rx * 0.95}" cy="${cy + ry * 1.45}" r="${ry * 0.12}"/></g>`;
// Coche de perfil (origen: suelo, centro entre ruedas). El cuentakilómetros va en la puerta (.km).
const coche = (color, etiqueta) => `<path d="M-185 -40 L-185 -100 Q-180 -125 -145 -128 L-105 -130 L-62 -186 Q-52 -196 -32 -196 L62 -196 Q82 -196 97 -181 L137 -130 L162 -128 Q188 -122 188 -95 L188 -40 Z" fill="${color}"/>
  <path d="M-88 -136 L-55 -178 L-10 -178 L-10 -136 Z M6 -136 L6 -178 L57 -178 L92 -136 Z" fill="#0b1222" opacity=".85"/>
  <rect x="-80" y="-122" width="160" height="62" rx="12" fill="#0b1222"/><text class="km" x="0" y="-82" text-anchor="middle" font-size="36" font-weight="900" fill="#f1f5f9" letter-spacing="1">0</text>
  <text x="0" y="-66" text-anchor="middle" font-size="14" font-weight="700" fill="#94a3b8">${etiqueta}</text>
  ${[-112, 112].map(x => `<g transform="translate(${x},-32)"><g class="rueda"><circle r="40" fill="#1e293b" stroke="#64748b" stroke-width="8"/><line x1="0" y1="-30" x2="0" y2="30" stroke="#94a3b8" stroke-width="6"/><line x1="-30" y1="0" x2="30" y2="0" stroke="#94a3b8" stroke-width="6"/></g><circle r="10" fill="#cbd5e1"/></g>`).join('')}`;

module.exports = {
  slug: 'precio-999',
  serie: 'Trampas de precio',
  voz: VOZ,
  T,
  datos: (lang) => ({ sep: T[lang].l.sep, diez: T[lang].l.diez, lee1: T[lang].l.lee[1] }),
  suelo: true,
  script: SCRIPT_MUNECO,
  css: CSS + `
    .escena { height: 1250px; }
    .sello-top { position: absolute; left: 0; right: 0; top: 10px; text-align: center; }
  `,
  escenas: [
    // 0 · Gancho: el muñeco piensa delante de dos etiquetas; se queda con el primer número.
    {
      html: (t) => `<div class="gancho" style="position:relative"><h1 class="a">${t.titulo}</h1></div>
        <svg viewBox="0 0 1080 1250" width="1080" height="1250" style="position:absolute;left:0;top:0;overflow:visible;font-family:Inter,sans-serif">
          ${[[215, t.l.tag], [865, [t.l.diez, '']]].map(([x, [a, b]], i) => `<g class="tag tag-${i}" data-x="${x}" opacity="0">
            <line x1="${x}" y1="190" x2="${x}" y2="240" stroke="#64748b" stroke-width="4"/>
            <g transform="translate(${x},240)"><rect x="-135" y="0" width="270" height="155" rx="24" fill="#f1f5f9"/><circle cx="0" cy="22" r="10" fill="${C.fondo}"/>
              <text x="0" y="118" text-anchor="middle" font-size="80" font-weight="900" fill="#0f172a" letter-spacing="-2"><tspan class="d1">${a}</tspan><tspan class="resto">${b}</tspan></text></g></g>`).join('')}
          ${muneco(540, 660, 1.6, '', 'm1')}
          ${nube('n0', 560, 290, 115, 72)}
          <text class="n0t" x="560" y="318" text-anchor="middle" font-size="80" font-weight="900" fill="${C.acento}" opacity="0">${t.l.tag[0]}…</text>
        </svg>`,
      anim: function (s, e, el) {
        const m = e.seg[0].marcas[0], g = el.querySelector('.m1');
        posar(g, mezclaPose(POSES.pie, POSES.pensando, sale(tramo(s, 0.4, 1.0))));
        [0, 1].forEach(i => { const tg = el.querySelector('.tag-' + i), x = +tg.dataset.x, p = rebote(tramo(s, 0.2 + i * 0.25, 0.7 + i * 0.25));
          tg.setAttribute('opacity', Math.min(1, p * 1.4)); tg.setAttribute('transform', 'rotate(' + (Math.sin(s * 2 + i) * 5 + (1 - p) * 25) + ' ' + x + ' 190)'); });
        const q = sale(tramo(s, m, m + 0.4)), d1 = el.querySelector('.tag-0 .d1'), r = el.querySelector('.tag-0 .resto');
        d1.setAttribute('fill', q > 0.5 ? '#0f9f8f' : '#0f172a'); r.setAttribute('opacity', 1 - 0.7 * q);
        const n = rebote(tramo(s, m + 0.1, m + 0.5)); el.querySelector('.n0').setAttribute('opacity', Math.min(1, n * 1.4)); el.querySelector('.n0t').setAttribute('opacity', Math.min(1, n * 1.4));
        el.querySelector('.n0').setAttribute('transform', 'translate(560,290) scale(' + (0.6 + 0.4 * n) + ') translate(-560,-290)');
      }
    },
    // 1 · El dato: piensa «nueve y pico» / «diez»; en la balanza, un céntimo pesa como un euro. Y su nombre.
    {
      html: (t) => `<div class="sello-top"><div class="sello" style="opacity:0;font-size:52px">${t.l.termino}</div><div class="fuente" style="margin-top:10px;font-size:26px;color:${C.suave};font-weight:600;opacity:0">${t.l.fuente}</div></div>
        <svg viewBox="0 0 1080 1250" width="1080" height="1250" style="position:absolute;left:0;top:0;overflow:visible;font-family:Inter,sans-serif">
          ${muneco(250, 660, 1.6, '', 'm1')}
          ${nube('n1', 560, 340, 250, 120)}
          <g class="n1t" opacity="0"><text class="pre" x="560" y="318" text-anchor="middle" font-size="44" font-weight="800" fill="${C.suave}">${t.l.tag.join('')}</text>
            <text class="lee" x="560" y="390" text-anchor="middle" font-size="62" font-weight="900" fill="${C.acento}">${t.l.lee[0]}</text></g>
          <g class="balanza" opacity="0">
            <rect x="785" y="560" width="30" height="330" rx="10" fill="#33415c"/><rect x="700" y="880" width="200" height="22" rx="8" fill="#33415c"/>
            <g class="viga"><rect x="620" y="548" width="360" height="22" rx="11" fill="#64748b"/></g>
            ${[0, 1].map(i => `<g class="plato plato-${i}"><line x1="0" y1="0" x2="0" y2="110" stroke="#64748b" stroke-width="4"/><path d="M-80 110 Q0 160 80 110 Z" fill="#475569"/>
              <circle cx="0" cy="${i ? 70 : 96}" r="${i ? 40 : 14}" fill="#e9c46a" stroke="#b8902e" stroke-width="4"/>
              <text x="0" y="200" text-anchor="middle" font-size="${i ? 44 : 34}" font-weight="900" fill="${i ? C.caprichos : C.suave}">${i ? t.l.euro : t.l.centimo}</text></g>`).join('')}
            <circle cx="800" cy="559" r="16" fill="#94a3b8"/></g>
        </svg>`,
      anim: function (s, e, el) {
        const m = e.seg[0].marcas, f = e.seg[0], m2 = e.seg[1].marcas[0], g = el.querySelector('.m1');
        posar(g, POSES.pensando);
        const n = rebote(tramo(s, m[0] - 0.3, m[0] + 0.1)), nb = el.querySelector('.n1'), nt = el.querySelector('.n1t');
        nb.setAttribute('opacity', Math.min(1, n * 1.4)); nt.setAttribute('opacity', Math.min(1, n * 1.4));
        if (s > m[1]) { nt.querySelector('.pre').textContent = D.diez; nt.querySelector('.lee').textContent = D.lee1; }
        const pulso = tramo(s, m[1], m[1] + 0.35); nt.setAttribute('transform', 'translate(560,350) scale(' + (1 + 0.12 * Math.sin(pulso * Math.PI)) + ') translate(-560,-350)');
        const b = el.querySelector('.balanza'), pb = sale(tramo(s, f.ini + f.dur * 0.68, f.ini + f.dur * 0.68 + 0.4)); b.setAttribute('opacity', pb);
        const ang = 16 * sale(tramo(s, f.ini + f.dur * 0.78, f.ini + f.dur * 0.78 + 0.8)) + Math.sin(s * 3) * 1.2 * pb, rad = ang * Math.PI / 180;
        el.querySelector('.viga').setAttribute('transform', 'rotate(' + ang + ' 800 559)');
        [0, 1].forEach(i => { const sg = i ? 1 : -1; el.querySelector('.plato-' + i).setAttribute('transform', 'translate(' + (800 + sg * 170 * Math.cos(rad)) + ',' + (559 + sg * 170 * Math.sin(rad)) + ')'); });
        const q = rebote(tramo(s, m2, m2 + 0.45)), st = el.querySelector('.sello');
        st.style.opacity = Math.min(1, q * 1.5); st.style.transform = 'rotate(-3deg) scale(' + (1.8 - 0.8 * q) + ')';
        el.querySelector('.fuente').style.opacity = tramo(s, m2 + 0.4, m2 + 0.9);
      }
    },
    // 2 · La sorpresa: entran dos coches; el comprador del de 79.900 millas levanta el cartel de +200 $ y el otro se encoge.
    {
      html: (t) => `<div style="position:absolute;left:0;right:0;top:0;text-align:center;font-size:26px;font-weight:650;color:${C.suave}">${t.l.coches}</div>
        <svg viewBox="0 0 1080 1250" width="1080" height="1250" style="position:absolute;left:0;top:0;overflow:visible;font-family:Inter,sans-serif">
          ${muneco(250, 660, 1.6, '', 'mA')}${muneco(840, 660, 1.6, '', 'mB')}
          <g class="cartel" opacity="0"><line x1="0" y1="0" x2="0" y2="-40" stroke="#94a3b8" stroke-width="8"/><rect x="-130" y="-170" width="260" height="130" rx="20" fill="#f1f5f9" stroke="${C.acento}" stroke-width="6"/>
            <text x="0" y="-82" text-anchor="middle" font-size="64" font-weight="900" fill="#0f766e">${t.l.mas}</text></g>
          ${[[0, C.necesidades, '79'], [1, '#475569', '80']].map(([i, color]) => `<g class="coche coche-${i}">${coche(color, t.l.millas.toUpperCase())}</g>`).join('')}
        </svg>`,
      anim: function (s, e, el) {
        const m = e.seg[0].marcas, fmt = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, D.sep);
        [[0, -400, 270, 79890, 79900], [1, 1480, 810, 79990, 80000]].forEach(([i, x0, x1, a, b]) => {
          const p = sale(tramo(s, m[0] - 1.0 + i * 0.25, m[0] + 0.2 + i * 0.25)), x = lerp(x0, x1, p), c = el.querySelector('.coche-' + i);
          c.setAttribute('transform', 'translate(' + x + ',890)');
          c.querySelectorAll('.rueda').forEach(r => r.setAttribute('transform', 'rotate(' + (x * 1.6) + ')'));
          c.querySelector('.km').textContent = fmt(lerp(a, b, sale(tramo(s, m[0] + 0.2, m[0] + 1.2))));
        });
        const gA = el.querySelector('.mA'), gB = el.querySelector('.mB'), up = sale(tramo(s, m[1] - 0.4, m[1]));
        const PA = mezclaPose(POSES.pie, POSES.cartel, up); PA.y = -Math.abs(Math.sin(s * 6)) * 8 * up; posar(gA, PA);
        posar(gB, mezclaPose(POSES.pie, POSES.encoge, sale(tramo(s, m[1] + 0.3, m[1] + 0.7))));
        const [hx, hy] = mano(gA, PA, 'a'), ca = el.querySelector('.cartel');
        ca.setAttribute('opacity', up); ca.setAttribute('transform', 'translate(' + hx + ',' + hy + ') rotate(' + (Math.sin(s * 6) * 4) + ')');
      }
    },
    // 3 · La defensa: el muñeco tacha el «,99» con un rotulador gigante y escribe el número redondo.
    {
      html: (t) => `<div class="sello-top"><div class="sello" style="opacity:0;font-size:54px">↑ ${t.l.redondea}</div></div>
        <svg viewBox="0 0 1080 1250" width="1080" height="1250" style="position:absolute;left:0;top:0;overflow:visible;font-family:Inter,sans-serif">
          ${t.l.pares.slice(0, 2).map(([a, b], i) => `<g class="pt pt-${i}" opacity="0" transform="translate(720,${330 + i * 270})">
            <rect x="-230" y="-80" width="460" height="170" rx="26" fill="#f1f5f9"/><circle cx="-200" cy="-50" r="11" fill="${C.fondo}"/>
            <text x="0" y="40" text-anchor="middle" font-size="96" font-weight="900" fill="#0f172a" letter-spacing="-2">${a}</text>
            <line class="tacha" x1="-170" y1="10" x2="190" y2="10" stroke="${ROJO_T}" stroke-width="16" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>
            <text class="nuevo" x="0" y="-100" text-anchor="middle" font-size="84" font-weight="900" fill="${C.acento}" font-style="italic" opacity="0">${b}</text></g>`).join('')}
          ${muneco(250, 660, 1.6, '', 'm1')}
          <g class="rotu"><rect x="-14" y="-90" width="28" height="110" rx="8" fill="${ROJO_T}"/><rect x="-14" y="-90" width="28" height="30" rx="6" fill="#f1f5f9"/></g>
        </svg>`,
      anim: function (s, e, el) {
        const m = e.seg[0].marcas[0], f = e.seg[0], g = el.querySelector('.m1');
        const q = rebote(tramo(s, m, m + 0.45)), st = el.querySelector('.sello'); st.style.opacity = Math.min(1, q * 1.5); st.style.transform = 'scale(' + (1.6 - 0.6 * q) + ')';
        const tiempos = [m + 0.5, f.ini + f.dur * 0.55];
        let P = POSES.pie;
        tiempos.forEach((a, i) => {
          const pt = el.querySelector('.pt-' + i), ap = sale(tramo(s, a - 0.6, a - 0.2)); pt.setAttribute('opacity', ap);
          const tacha = sale(tramo(s, a, a + 0.5)); pt.querySelector('.tacha').setAttribute('stroke-dashoffset', 1 - tacha);
          pt.querySelector('.nuevo').setAttribute('opacity', tramo(s, a + 0.45, a + 0.8));
          if (s > a - 0.4) { const sw = tramo(s, a - 0.3, a + 0.5); P = { ...POSES.pie, ba: -150 + 90 * sw - 35 * i, ba2: -20, y: 0 }; }
        });
        posar(g, P);
        const [hx, hy] = mano(g, P, 'a'); el.querySelector('.rotu').setAttribute('transform', 'translate(' + hx + ',' + hy + ') rotate(' + (P.ba + 200) + ')');
      }
    },
    // 4 · Cierre con la pregunta del «antes 199 €» (la moneda al bolsillo).
    cierreCon('moneda')
  ],
  texto: {
    en: `Why does almost everything cost $9.99 and not $10? 🧠

Because your brain reads left to right and gets stuck on the first digit: $9.99 feels like "nine-something", $10 feels like "ten". It's called the left-digit effect (Thomas & Morwitz, 2005).

It even happens with cars: in more than 22 million used-car sales, prices drop sharply at every 10,000-mile mark. Cars at 79,900 miles sold for about $200 more than cars just over 80,000 (Lacetera, Pope & Sydnor, 2012).

Your defense: round up. $9.99 is $10, $49.90 is $50. Always compare the round number.

Next question: why does "was $199, now $99" work even when you know the "was" is made up? If you're curious, follow so you don't miss it. 👀

#personalfinance #moneytips #psychology #savingmoney #financialliteracy`,
    es: `¿Por qué casi todo cuesta 9,99 y no 10? 🧠

Porque tu cerebro lee de izquierda a derecha y se queda con el primer número: 9,99 se siente como «nueve y pico» y 10 como «diez». Se llama efecto del dígito izquierdo (Thomas y Morwitz, 2005).

Pasa hasta con los coches: en más de 22 millones de ventas de coches usados en EE. UU., el precio cae de golpe en cada umbral de 10.000 millas. Los de 79.900 millas se vendían por unos 200 $ más que los que pasaban de 80.000 (Lacetera, Pope y Sydnor, 2012).

Tu defensa: redondea hacia arriba. 9,99 son 10; 49,90 son 50. Compara siempre con el número redondo.

Y la siguiente pregunta: ¿por qué funciona el «antes 199 €, ahora 99 €» aunque sepas que el «antes» es inventado? Si te pica la curiosidad, síguenos para no perdértelo. 👀

#finanzaspersonales #ahorro #dinero #educacionfinanciera #psicologia`
  }
};

// Piezas reutilizables (versiones por cuenta: es-gasolina-1499, en-millas-79900).
module.exports.piezas = { coche, nube, ROJO_T };
