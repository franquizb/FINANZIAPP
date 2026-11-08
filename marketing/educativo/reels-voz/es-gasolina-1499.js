// Píldora SOLO para @finanziapp.es (España): la milésima de la gasolinera (efecto del dígito izquierdo).
// Arranque lleno: el cartel de la gasolinera, el muñeco y el título se ven desde el fotograma 0.
// Fuentes: Thomas y Morwitz (2005), dígito izquierdo; Lacetera, Pope y Sydnor (2012), 22 millones de coches usados.
const { C, VOZ, CSS, cierreCon, muneco, SCRIPT_MUNECO } = require('./_comun');
const { cuadra } = require('../reels/_comun');
const base = require('./precio-999.js');
const { nube } = base.piezas;

cuadra('50 litros × 0,001 €', +(50 * 0.001).toFixed(3), 0.05);

const T = {
  es: {
    titulo: 'La milésima de la gasolinera <span class="c">no es casualidad</span>.',
    retencion: 'Espera a <span class="c">lo de los coches</span>',
    l: { coches: '22 millones de ventas de coches usados · Lacetera, Pope y Sydnor (2012)', millas: 'millas', mas: '+200 $', termino: 'Efecto del dígito izquierdo', fuente: 'Thomas y Morwitz, 2005',
      redondea: 'Redondea hacia arriba', pares: [['1,499 €', '1,50 €'], ['9,99 €', '10 €']], sep: '.' },
    guion: [
      [0, 'Esa milésima de la gasolinera §*no está ahí por casualidad*.'],
      [0, 'Ves 1,499 y tu cabeza lee §«uno coma cuatro». [short pause] ¿Lo que te ahorras en un depósito de 50 litros? §*Cinco céntimos*.'],
      [1, 'Es el §*efecto del dígito izquierdo*: el primer número pesa más que todo lo demás. Por eso casi todo cuesta 9,99.'],
      [2, 'Y está medido: en 22 millones de ventas de coches usados en Estados Unidos,§ los de *79.900 millas* se vendían por unos *200 dólares más*§ que los de 80.000.'],
      [3, 'Tu defensa: §*redondea hacia arriba*. 1,499 es 1,50. 9,99 son 10.'],
      [4, '¿Y por qué funciona el «antes 199, ahora 99» aunque sepas que es inventado? [short pause] Si te pica, *síguenos*.']
    ],
    cierre: '¿Por qué funciona el «antes 199 €»? <span class="c">Síguenos</span> para no perdértelo.'
  }
};

module.exports = {
  slug: 'es-gasolina-1499',
  cuenta: 'es',
  arranque: 'lleno',
  inicio: 0.1,
  suelo: true,
  voz: VOZ,
  T,
  datos: () => ({ sep: '.' }),
  script: SCRIPT_MUNECO,
  css: CSS + `
    .escena { height: 1250px; }
    .sello-top { position: absolute; left: 0; right: 0; top: 10px; text-align: center; }
  `,
  escenas: [
    // 0 · Gancho (ya completo en el fotograma 0): cartel de la gasolinera a 1,499 y el muñeco pensando.
    {
      html: (t) => `<div class="gancho" style="position:relative"><h1 class="a">${t.titulo}</h1></div>
        <svg viewBox="0 0 1080 1250" width="1080" height="1250" style="position:absolute;left:0;top:0;overflow:visible;font-family:Inter,sans-serif">
          <rect x="752" y="300" width="26" height="600" fill="#33415c"/>
          <g class="cartel-g"><rect x="590" y="250" width="350" height="300" rx="26" fill="#0b1222" stroke="#33415c" stroke-width="6"/>
            <rect x="590" y="250" width="350" height="62" rx="26" fill="${C.necesidades}"/><rect x="590" y="290" width="350" height="22" fill="${C.necesidades}"/>
            <text x="765" y="294" text-anchor="middle" font-size="34" font-weight="900" fill="#fff" letter-spacing="2">GASOLINERA</text>
            <text x="620" y="370" font-size="26" font-weight="800" fill="#94a3b8">SIN PLOMO 95</text>
            <text x="765" y="480" text-anchor="middle" font-size="104" font-weight="900" fill="#fbbf24" letter-spacing="-2"><tspan class="d14">1,4</tspan><tspan class="d99">99</tspan></text>
            <text x="910" y="525" text-anchor="end" font-size="24" font-weight="800" fill="#94a3b8">€/litro</text></g>
          ${muneco(300, 660, 1.6, '', 'm1')}
          ${nube('n0', 470, 380, 105, 64)}
          <text class="n0t" x="470" y="400" text-anchor="middle" font-size="44" font-weight="900" fill="${C.acento}" opacity="0">«1,4…»</text>
          <g class="ahorro-g" opacity="0"><rect x="560" y="610" width="420" height="190" rx="26" fill="${C.superficie}" stroke="${C.borde}" stroke-width="2"/>
            <text x="770" y="665" text-anchor="middle" font-size="26" font-weight="700" fill="#cbd5e1">Depósito de 50 litros</text>
            <text x="770" y="745" text-anchor="middle" font-size="70" font-weight="900" fill="${C.caprichos}">0,05 €</text>
            <text x="770" y="782" text-anchor="middle" font-size="22" font-weight="600" fill="#94a3b8">lo que te ahorra la milésima</text></g>
        </svg>`,
      anim: function (s, e, el) {
        const g = el.querySelector('.m1');
        posar(g, POSES.pensando);   // desde el fotograma 0
        el.querySelector('.cartel-g').setAttribute('transform', 'rotate(' + (Math.sin(s * 1.8) * 0.8) + ' 765 300)');
        const d99 = el.querySelector('.d99'), m1 = e.seg[1].marcas;
        d99.setAttribute('opacity', 0.5 + 0.5 * Math.abs(Math.sin(s * 5)));   // la milésima parpadea: algo se mueve desde el inicio
        const n = rebote(tramo(s, m1[0] - 0.2, m1[0] + 0.25)); el.querySelector('.n0').setAttribute('opacity', Math.min(1, n * 1.4)); el.querySelector('.n0t').setAttribute('opacity', Math.min(1, n * 1.4));
        if (s > m1[0]) { d99.setAttribute('opacity', 0.25); el.querySelector('.d14').setAttribute('fill', '#5eead4'); }
        const a = rebote(tramo(s, m1[1] - 0.2, m1[1] + 0.3)), ag = el.querySelector('.ahorro-g');
        ag.setAttribute('opacity', Math.min(1, a * 1.4)); ag.setAttribute('transform', 'translate(770,705) scale(' + (0.7 + 0.3 * a) + ') translate(-770,-705)');
      }
    },
    // 1 · El nombre: etiquetas 9,99 / 10 y el sello del efecto.
    {
      html: (t) => `<div class="sello-top"><div class="sello" style="opacity:0;font-size:52px">${t.l.termino}</div><div class="fuente" style="margin-top:10px;font-size:26px;color:${C.suave};font-weight:600;opacity:0">${t.l.fuente}</div></div>
        <svg viewBox="0 0 1080 1250" width="1080" height="1250" style="position:absolute;left:0;top:0;overflow:visible;font-family:Inter,sans-serif">
          ${[[300, ['9', ',99']], [780, ['10', '']]].map(([x, [a, b]], i) => `<g class="tg tg-${i}"><line x1="${x}" y1="250" x2="${x}" y2="330" stroke="#64748b" stroke-width="4"/>
            <g transform="translate(${x},330)"><rect x="-150" y="0" width="300" height="170" rx="24" fill="#f1f5f9"/><circle cx="0" cy="24" r="11" fill="${C.fondo}"/>
            <text x="0" y="128" text-anchor="middle" font-size="88" font-weight="900" fill="#0f172a" letter-spacing="-2"><tspan class="p1">${a}</tspan><tspan class="p2">${b}</tspan><tspan font-size="50"> €</tspan></text></g></g>`).join('')}
          ${muneco(540, 660, 1.6, '', 'm1')}
        </svg>`,
      anim: function (s, e, el) {
        const m = e.seg[0].marcas[0], q = rebote(tramo(s, m, m + 0.45)), st = el.querySelector('.sello');
        st.style.opacity = Math.min(1, q * 1.5); st.style.transform = 'rotate(-3deg) scale(' + (1.8 - 0.8 * q) + ')';
        el.querySelector('.fuente').style.opacity = tramo(s, m + 0.4, m + 0.9);
        [0, 1].forEach(i => { const p = rebote(tramo(s, 0.1 + i * 0.2, 0.5 + i * 0.2)), tg = el.querySelector('.tg-' + i), x = i ? 780 : 300;
          tg.setAttribute('opacity', Math.min(1, p * 1.4)); tg.setAttribute('transform', 'rotate(' + (Math.sin(s * 2 + i) * 4 + (1 - p) * 20) + ' ' + x + ' 250)'); });
        const r = sale(tramo(s, m + 0.3, m + 0.8)); el.querySelector('.tg-0 .p1').setAttribute('fill', r > 0.5 ? '#0f9f8f' : '#0f172a'); el.querySelector('.tg-0 .p2').setAttribute('opacity', 1 - 0.7 * r);
        posar(el.querySelector('.m1'), mezclaPose(POSES.pie, POSES.pensando, sale(tramo(s, 0.2, 0.7))));
      }
    },
    // 2 · La prueba: los coches de 79.900 frente a 80.000 millas (escena de la píldora 9,99).
    base.escenas[2],
    // 3 · La defensa: el rotulador redondea 1,499 → 1,50 y 9,99 → 10.
    base.escenas[3],
    // 4 · Cierre: monedas al tarro, con la pregunta del «antes 199 €».
    cierreCon('tarro')
  ],
  texto: {
    es: `Esa milésima de la gasolinera no está ahí por casualidad. ⛽

Ves 1,499 y tu cabeza lee «uno coma cuatro». ¿Lo que te ahorras de verdad en un depósito de 50 litros? Cinco céntimos.

Se llama efecto del dígito izquierdo (Thomas y Morwitz, 2005): el primer número pesa más que todo lo demás, y por eso casi todo cuesta 9,99. Está medido hasta con coches: en 22 millones de ventas de coches usados en EE. UU., los de 79.900 millas se vendían por unos 200 $ más que los de 80.000 (Lacetera, Pope y Sydnor, 2012).

Tu defensa: redondea hacia arriba. 1,499 es 1,50; 9,99 son 10.

¿Y tú, te fijas en la milésima o ya llenas sin mirar? 👇

Y la siguiente: ¿por qué funciona el «antes 199 €, ahora 99 €» aunque sepas que el «antes» es inventado? Síguenos para no perdértelo.

#finanzaspersonales #ahorro #gasolina #dinero #educacionfinanciera`
  }
};
