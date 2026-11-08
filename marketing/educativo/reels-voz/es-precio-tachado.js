// Píldora SOLO para @finanziapp.es (España): el «antes 199 €, ahora 99 €» (efecto ancla).
// Responde a la pregunta con la que acababa «La milésima de la gasolinera» y deja abierta la del precio del súper.
// Primera píldora con subtítulos palabra a palabra y efectos de sonido (§{sonido} en el guion).
// Fuentes: Tversky y Kahneman (1974), «Judgment under Uncertainty: Heuristics and Biases», Science 185:
//   ruleta trucada que solo daba 10 o 65; medianas del % de países africanos en la ONU: 25 y 45.
//   Ley 7/1996 de Ordenación del Comercio Minorista, art. 20 (redactado por el RDL 24/2021): al anunciar una
//   reducción de precio, el precio anterior es el más bajo aplicado en los 30 días anteriores.
const { C, VOZ, CSS, cierreCon, muneco, SCRIPT_MUNECO } = require('./_comun');
const { cuadra } = require('../reels/_comun');
const { nube } = require('./precio-999.js').piezas;

cuadra('45 − 25 puntos', 45 - 25, 20);
const ROJO = '#e66767', AMBAR = '#f0b45a';

// Etiqueta de precio (origen: agujero del cordel). tachado: la línea roja sobre el «199 €».
const etiqueta = (x, y, esc = 1) => `<g class="etq" transform="translate(${x},${y}) scale(${esc})">
  <line x1="0" y1="-90" x2="0" y2="0" stroke="#64748b" stroke-width="5"/>
  <rect x="-250" y="0" width="500" height="340" rx="30" fill="#f1f5f9"/><circle cx="0" cy="30" r="13" fill="${C.fondo}"/>
  <text x="-205" y="112" font-size="36" font-weight="800" fill="#64748b">ANTES</text>
  <text class="t199" x="210" y="122" text-anchor="end" font-size="84" font-weight="900" fill="#475569" letter-spacing="-2">199 €</text>
  <line class="tacha" x1="-10" y1="93" x2="218" y2="93" stroke="${ROJO}" stroke-width="12" stroke-linecap="round"/>
  <text x="-205" y="200" font-size="36" font-weight="800" fill="#0f766e">AHORA</text>
  <text x="210" y="305" text-anchor="end" font-size="128" font-weight="900" fill="#0f9f8f" letter-spacing="-4">99 €</text>
  <g class="pegatina" opacity="0"><rect x="-30" y="40" width="270" height="110" rx="10" fill="#fde68a" transform="rotate(-4 105 95)"/>
    <text x="105" y="112" text-anchor="middle" font-size="40" font-weight="900" fill="#92400e" transform="rotate(-4 105 95)">¿?</text></g>
</g>`;
const ancla = `<g class="ancla"><line x1="0" y1="-900" x2="0" y2="-64" stroke="#94a3b8" stroke-width="6" stroke-dasharray="14 10"/>
  <circle cx="0" cy="-48" r="17" fill="none" stroke="#cbd5e1" stroke-width="10"/><line x1="0" y1="-31" x2="0" y2="62" stroke="#cbd5e1" stroke-width="13" stroke-linecap="round"/>
  <line x1="-34" y1="-8" x2="34" y2="-8" stroke="#cbd5e1" stroke-width="12" stroke-linecap="round"/>
  <path d="M-60 18 Q-56 70 0 74 Q56 70 60 18" fill="none" stroke="#cbd5e1" stroke-width="13" stroke-linecap="round"/>
  <path d="M-72 30 L-60 4 L-46 28 Z M72 30 L60 4 L46 28 Z" fill="#cbd5e1"/></g>`;
// Ruleta trucada: solo tiene 10 y 65 (8 casillas de 45°).
const ruleta = (clase, x, y) => `<g transform="translate(${x},${y})"><g class="${clase}">
  ${Array.from({ length: 8 }, (_, i) => { const a0 = (i * 45 - 90) * Math.PI / 180, a1 = ((i + 1) * 45 - 90) * Math.PI / 180, r = 150, am = (i * 45 + 22.5 - 90) * Math.PI / 180;
    return `<path d="M0 0 L${(r * Math.cos(a0)).toFixed(1)} ${(r * Math.sin(a0)).toFixed(1)} A${r} ${r} 0 0 1 ${(r * Math.cos(a1)).toFixed(1)} ${(r * Math.sin(a1)).toFixed(1)}Z" fill="${i % 2 ? '#c27c0e' : '#0f9f8f'}" stroke="#0b1222" stroke-width="4"/>
      <text x="${(105 * Math.cos(am)).toFixed(1)}" y="${(105 * Math.sin(am) + 14).toFixed(1)}" text-anchor="middle" font-size="40" font-weight="900" fill="#fff" transform="rotate(${i * 45 + 22.5} ${(105 * Math.cos(am)).toFixed(1)} ${(105 * Math.sin(am)).toFixed(1)})">${i % 2 ? 65 : 10}</text>`; }).join('')}
  <circle r="24" fill="#f1f5f9"/></g><path d="M-22 -178 L22 -178 L0 -140 Z" fill="#f1f5f9"/></g>`;

const T = {
  es: {
    titulo: 'Black Friday: el «antes 199 €» <span class="c">te engaña aunque lo sepas</span>.',
    retencion: 'Lo de la ley <span class="c">casi nadie lo sabe</span>',
    guion: [
      [0, 'Sabes que ese «antes 199» §{pop}*seguramente es inventado*. [short pause] Y aun así, §te parece un chollo.'],
      [0, '¿Por qué? Porque tu cabeza §{pop}*se agarra al primer número* que ve.'],
      [1, 'En 1974, Tversky y Kahneman giraron una §*ruleta trucada*: §{tic}solo podía salir 10 o 65.'],
      [1, 'Luego preguntaron: ¿qué parte de los países de la ONU son africanos?'],
      [1, '§{pop}Los del 10 dijeron *25 %*. §{pop}Los del 65, *45 %*.'],
      [2, 'Un número al azar §movió la respuesta *20 puntos*. [short pause] Se llama §{ding}*efecto ancla*, y el «antes 199» es eso: un ancla.'],
      [3, 'Y apúntatelo para el Black Friday: en España, §*por ley*, el «antes» tiene que ser §{caja}*el precio más bajo de los últimos 30 días*.'],
      [3, 'Si lo subieron justo antes de rebajarlo, §{pop}*es ilegal*, y puedes reclamar.'],
      [4, 'Tu defensa: §tapa el precio tachado y pregúntate: §{pop}*¿pagaría 99 si no viera el 199?*'],
      [5, '¿Y sabes qué parte de lo que pagas en el súper le llega de verdad al agricultor? [short pause] Si te pica, *síguenos*.']
    ],
    cierre: '¿Cuánto le llega al agricultor? <span class="c">Síguenos</span> para no perdértelo.'
  }
};

module.exports = {
  slug: 'es-precio-tachado',
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
    // 0 · Gancho (entero en el fotograma 0): la etiqueta «antes 199 / ahora 99» y el muñeco encantado; cae un ancla sobre el 199.
    {
      html: (t) => `<div class="gancho" style="position:relative"><h1 class="a">${t.titulo}</h1></div>
        <svg viewBox="0 0 1080 1250" width="1080" height="1250" style="position:absolute;left:0;top:0;overflow:visible;font-family:Inter,sans-serif">
          ${etiqueta(640, 440, 0.86)}
          <g class="anc0" opacity="0">${ancla}</g>
          ${muneco(210, 660, 1.6, '', 'm1')}
          ${nube('n0', 360, 330, 110, 62)}<text class="n0t" x="360" y="346" text-anchor="middle" font-size="40" font-weight="900" fill="#0f9f8f" opacity="0">¡Chollo!</text>
        </svg>`,
      anim: function (s, e, el) {
        const m0 = e.seg[0].marcas, m1 = e.seg[1].marcas;
        el.querySelector('.etq').setAttribute('transform', 'translate(640,440) scale(0.86) rotate(' + (Math.sin(s * 2) * 2.5) + ' 0 -90)');
        // El muñeco pasa de mirar a «¡chollo!» (brazos arriba de alegría).
        const alegre = sale(tramo(s, m0[1] - 0.2, m0[1] + 0.3));
        const P = mezclaPose(POSES.pie, { pa: -6, pb: 8, pa2: 0, pb2: 0, ba: -150, ba2: -20, bb: 150, bb2: 18, y: -6 }, alegre);
        P.y = (P.y || 0) - Math.abs(Math.sin(s * 7)) * 8 * alegre; posar(el.querySelector('.m1'), P);
        const n = rebote(tramo(s, m0[1] - 0.1, m0[1] + 0.3));
        el.querySelector('.n0').setAttribute('opacity', Math.min(1, n * 1.4)); el.querySelector('.n0t').setAttribute('opacity', Math.min(1, n * 1.4));
        // El ancla cae y se engancha en el 199.
        const c = tramo(s, m1[0] - 0.15, m1[0] + 0.35), a = el.querySelector('.anc0');
        a.setAttribute('opacity', c > 0 ? 1 : 0);
        const y = lerp(-500, 420, sale(c)) + (c >= 1 ? Math.sin((s - m1[0] - 0.35) * 9) * 6 * Math.exp(-(s - m1[0] - 0.35) * 2) : 0);
        a.setAttribute('transform', 'translate(735,' + y + ') rotate(' + (Math.sin(s * 3) * 3) + ')');
        el.querySelector('.t199').setAttribute('fill', c > 0.9 ? '#e66767' : '#475569');
      }
    },
    // 1 · El experimento: dos muñecos, dos ruletas trucadas (10 y 65) y lo que contesta cada uno.
    {
      html: (t) => `<div class="sello-top"><div class="fuente" style="font-size:30px;color:${C.suave};font-weight:700">Tversky y Kahneman, 1974</div>
          <div style="margin-top:8px;font-size:42px;font-weight:850;color:#f1f5f9">¿% de países de la ONU africanos?</div></div>
        <svg viewBox="0 0 1080 1250" width="1080" height="1250" style="position:absolute;left:0;top:0;overflow:visible;font-family:Inter,sans-serif">
          ${ruleta('rA', 250, 345)}${ruleta('rB', 830, 345)}
          ${muneco(250, 724, 1.15, '', 'mA')}${muneco(830, 724, 1.15, '', 'mB')}
          ${nube('nA', 430, 560, 95, 56)}<text class="nAt" x="430" y="578" text-anchor="middle" font-size="50" font-weight="900" fill="#0f9f8f" opacity="0">25 %</text>
          ${nube('nB', 650, 560, 95, 56)}<text class="nBt" x="650" y="578" text-anchor="middle" font-size="50" font-weight="900" fill="#c27c0e" opacity="0">45 %</text>
        </svg>`,
      anim: function (s, e, el) {
        const m0 = e.seg[0].marcas, m1 = e.seg[2].marcas, para = m0[1];
        // Giran deprisa y se paran justo en el «tic»: la izquierda en un 10 y la derecha en un 65.
        [['.rA', -22.5], ['.rB', -67.5]].forEach(([c, fin], i) => {
          const p = tramo(s, 0, para), ang = fin - 360 * 4 * (1 - sale(p)) - i * 20 * (1 - p);
          el.querySelector(c).setAttribute('transform', 'rotate(' + ang + ')');
        });
        posar(el.querySelector('.mA'), mezclaPose(POSES.pie, POSES.pensando, sale(tramo(s, m1[0] - 0.4, m1[0]))));
        posar(el.querySelector('.mB'), mezclaPose(POSES.pie, POSES.pensando, sale(tramo(s, m1[1] - 0.4, m1[1]))));
        [['nA', m1[0]], ['nB', m1[1]]].forEach(([c, m]) => { const n = rebote(tramo(s, m - 0.1, m + 0.3));
          el.querySelector('.' + c).setAttribute('opacity', Math.min(1, n * 1.4)); el.querySelector('.' + c + 't').setAttribute('opacity', Math.min(1, n * 1.4)); });
      }
    },
    // 2 · El nombre: dos barras (25 y 45), la diferencia de 20 puntos y el sello «efecto ancla».
    {
      html: (t) => `<div class="sello-top"><div class="sello" style="opacity:0;font-size:60px">Efecto ancla</div></div>
        <svg viewBox="0 0 1080 1250" width="1080" height="1250" style="position:absolute;left:0;top:0;overflow:visible;font-family:Inter,sans-serif">
          <g class="bA"><rect x="330" y="0" width="170" height="0" rx="14" fill="#0f9f8f"/><text x="415" y="0" text-anchor="middle" font-size="56" font-weight="900" fill="#f1f5f9">25 %</text>
            <text x="415" y="950" text-anchor="middle" font-size="30" font-weight="700" fill="#94a3b8">ruleta en 10</text></g>
          <g class="bB"><rect x="620" y="0" width="170" height="0" rx="14" fill="#c27c0e"/><text x="705" y="0" text-anchor="middle" font-size="56" font-weight="900" fill="#f1f5f9">45 %</text>
            <text x="705" y="950" text-anchor="middle" font-size="30" font-weight="700" fill="#94a3b8">ruleta en 65</text></g>
          <g class="dif" opacity="0"><line x1="830" y1="0" x2="830" y2="0" stroke="#f1f5f9" stroke-width="6"/><text x="856" y="0" font-size="58" font-weight="900" fill="#5eead4">+20</text>
            <text x="856" y="0" font-size="30" font-weight="700" fill="#cbd5e1">puntos</text></g>
          ${muneco(160, 704, 1.3, '', 'm1')}
        </svg>`,
      anim: function (s, e, el) {
        const m0 = e.seg[0].marcas, base = 900, alto = (v) => v * 12;
        [['.bA', 25, 0.1], ['.bB', 45, 0.35]].forEach(([c, v, d]) => {
          const p = sale(tramo(s, d, d + 0.7)), h = alto(v) * p, g = el.querySelector(c), r = g.querySelector('rect'), tx = g.querySelectorAll('text')[0];
          r.setAttribute('y', base - h); r.setAttribute('height', h); tx.setAttribute('y', base - h - 20); tx.setAttribute('opacity', p);
        });
        const d = sale(tramo(s, m0[0], m0[0] + 0.5)), g = el.querySelector('.dif'), y1 = base - alto(25), y2 = base - alto(45);
        g.setAttribute('opacity', d); const l = g.querySelector('line'); l.setAttribute('y1', y1); l.setAttribute('y2', lerp(y1, y2, d));
        const ts = g.querySelectorAll('text'); ts[0].setAttribute('y', (y1 + y2) / 2 + 10); ts[1].setAttribute('y', (y1 + y2) / 2 + 48);
        const q = rebote(tramo(s, m0[1], m0[1] + 0.45)), st = el.querySelector('.sello');
        st.style.opacity = Math.min(1, q * 1.5); st.style.transform = 'rotate(-3deg) scale(' + (1.8 - 0.8 * q) + ')';
        posar(el.querySelector('.m1'), mezclaPose(POSES.pie, POSES.encoge, sale(tramo(s, m0[0], m0[0] + 0.5))));
      }
    },
    // 3 · La ley: 30 días de precios; lo «legal» es el más bajo (119 €), no el 199 que se subió justo antes.
    {
      html: (t) => `<div class="sello-top"><div style="font-size:30px;color:${C.suave};font-weight:700">Ley de Comercio Minorista, art. 20</div>
          <div style="margin-top:8px;font-size:44px;font-weight:850;color:#f1f5f9">El «antes» = el más bajo de <span style="color:${C.acento}">30 días</span></div></div>
        <svg viewBox="0 0 1080 1250" width="1080" height="1250" style="position:absolute;left:0;top:0;overflow:visible;font-family:Inter,sans-serif">
          <line x1="90" y1="760" x2="800" y2="760" stroke="#33415c" stroke-width="4"/>
          <text x="90" y="805" font-size="28" font-weight="700" fill="#94a3b8">hace 30 días</text><text x="800" y="805" text-anchor="end" font-size="28" font-weight="700" fill="#94a3b8">hoy</text>
          <path class="linea" d="M90 500 L655 500 L680 300 L775 300 L800 600" fill="none" stroke="#f1f5f9" stroke-width="8" stroke-linejoin="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>
          <circle class="hoy" cx="800" cy="600" r="16" fill="#0f9f8f" opacity="0"/><text class="hoyt" x="800" y="660" text-anchor="middle" font-size="40" font-weight="900" fill="#5eead4" opacity="0">99 €</text>
          <text class="pico" x="727" y="270" text-anchor="middle" font-size="44" font-weight="900" fill="#f1f5f9" opacity="0">199 €</text>
          <g class="legal" opacity="0"><line x1="90" y1="500" x2="800" y2="500" stroke="#5eead4" stroke-width="5" stroke-dasharray="14 10"/>
            <rect x="110" y="410" width="400" height="70" rx="16" fill="rgba(94,234,212,.15)" stroke="#5eead4" stroke-width="3"/>
            <text x="310" y="458" text-anchor="middle" font-size="38" font-weight="900" fill="#5eead4">Lo legal: «antes 119 €»</text></g>
          <g class="ilegal" opacity="0"><rect x="590" y="330" width="280" height="96" rx="14" fill="none" stroke="${ROJO}" stroke-width="8"/>
            <text x="730" y="396" text-anchor="middle" font-size="56" font-weight="900" fill="${ROJO}" letter-spacing="4">ILEGAL</text></g>
          ${muneco(950, 718, 1.2, '', 'm1')}
          <g class="cartel" opacity="0"><line x1="0" y1="0" x2="0" y2="-34" stroke="#94a3b8" stroke-width="7"/><rect x="-80" y="-120" width="160" height="86" rx="16" fill="#f1f5f9" stroke="${C.acento}" stroke-width="5"/>
            <text x="0" y="-62" text-anchor="middle" font-size="40" font-weight="900" fill="#0f766e">LEY</text></g>
        </svg>`,
      anim: function (s, e, el) {
        const m0 = e.seg[0].marcas, m1 = e.seg[1].marcas;
        el.querySelector('.linea').setAttribute('stroke-dashoffset', 1 - sale(tramo(s, 0.1, 1.6)));
        const pk = tramo(s, 1.1, 1.4); el.querySelector('.pico').setAttribute('opacity', pk);
        const h = rebote(tramo(s, 1.5, 1.8)); el.querySelector('.hoy').setAttribute('opacity', h); el.querySelector('.hoyt').setAttribute('opacity', h);
        const lg = sale(tramo(s, m0[1], m0[1] + 0.5)); el.querySelector('.legal').setAttribute('opacity', lg);
        const il = rebote(tramo(s, m1[0], m1[0] + 0.4)), g = el.querySelector('.ilegal');
        g.setAttribute('opacity', Math.min(1, il * 1.5)); g.setAttribute('transform', 'rotate(-8 730 378) translate(730,378) scale(' + (1.6 - 0.6 * il) + ') translate(-730,-378)');
        const up = sale(tramo(s, m0[0] - 0.3, m0[0] + 0.1)), P = mezclaPose(POSES.pie, POSES.cartel, up), gm = el.querySelector('.m1');
        P.y = -Math.abs(Math.sin(s * 5)) * 6 * up; posar(gm, P);
        const [hx, hy] = mano(gm, P, 'a'), ca = el.querySelector('.cartel');
        ca.setAttribute('opacity', up); ca.setAttribute('transform', 'translate(' + hx + ',' + hy + ') rotate(' + (Math.sin(s * 5) * 4) + ')');
      }
    },
    // 4 · La defensa: una pegatina tapa el precio tachado y queda la pregunta.
    {
      html: (t) => `<div class="sello-top"><div class="sello" style="opacity:0;font-size:52px">Tapa el tachado</div></div>
        <svg viewBox="0 0 1080 1250" width="1080" height="1250" style="position:absolute;left:0;top:0;overflow:visible;font-family:Inter,sans-serif">
          ${etiqueta(620, 290, 0.9)}
          ${muneco(200, 670, 1.5, '', 'm1')}
          <g class="preg" opacity="0"><rect x="380" y="700" width="560" height="120" rx="30" fill="#151f33" stroke="#5eead4" stroke-width="5"/>
            <text x="660" y="778" text-anchor="middle" font-size="50" font-weight="900" fill="#f1f5f9">¿Pagarías <tspan fill="#5eead4">99 €</tspan>?</text></g>
        </svg>`,
      anim: function (s, e, el) {
        const m = e.seg[0].marcas;
        const q = rebote(tramo(s, m[0], m[0] + 0.45)), st = el.querySelector('.sello');
        st.style.opacity = Math.min(1, q * 1.5); st.style.transform = 'rotate(-3deg) scale(' + (1.8 - 0.8 * q) + ')';
        const pg = sale(tramo(s, m[0] + 0.1, m[0] + 0.5)), p = el.querySelector('.pegatina');
        p.setAttribute('opacity', pg > 0 ? 1 : 0); p.setAttribute('transform', 'translate(' + (1 - pg) * 420 + ',' + (1 - pg) * -120 + ')');
        const pr = rebote(tramo(s, m[1] - 0.1, m[1] + 0.35)), g = el.querySelector('.preg');
        g.setAttribute('opacity', Math.min(1, pr * 1.4)); g.setAttribute('transform', 'translate(660,760) scale(' + (0.7 + 0.3 * pr) + ') translate(-660,-760)');
        el.querySelector('.etq').setAttribute('transform', 'translate(620,290) scale(0.9) rotate(' + (Math.sin(s * 2) * 2) + ' 0 -90)');
        posar(el.querySelector('.m1'), mezclaPose(POSES.pie, POSES.pensando, sale(tramo(s, m[1] - 0.3, m[1] + 0.2))));
      }
    },
    // 5 · Cierre: el muñeco caza una moneda, con la pregunta del precio del súper.
    cierreCon('moneda')
  ],
  texto: {
    es: `Sabes que ese «antes 199 €» seguramente es inventado… y aun así te parece un chollo. 🏷️

Es el efecto ancla: tu cabeza se agarra al primer número que ve. En 1974, Tversky y Kahneman giraron una ruleta trucada que solo daba 10 o 65 y luego preguntaron qué porcentaje de países de la ONU eran africanos. Los del 10 dijeron 25 %; los del 65, 45 %. Un número al azar movió la respuesta 20 puntos.

Lo que casi nadie sabe: en España, cuando una tienda anuncia una rebaja, el «antes» tiene que ser el precio más bajo que tuvo en los 30 días anteriores (artículo 20 de la Ley de Ordenación del Comercio Minorista). Si lo subieron justo antes de rebajarlo, no vale, y puedes reclamar.

Tu defensa: tapa el precio tachado y pregúntate si pagarías 99 € sin ver el 199.

Guárdalo para el Black Friday 🛍️ y cuéntanos: ¿te ha pasado con alguna «oferta»? 👇

Y la siguiente: ¿qué parte de lo que pagas en el súper le llega de verdad al agricultor? Síguenos para no perdértelo.

#blackfriday #finanzaspersonales #ahorro #rebajas #educacionfinanciera`
  }
};
