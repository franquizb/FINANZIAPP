// Píldora (20–30 s) de la serie «Trampas de precio» (sin numerar, a petición del propietario): el efecto señuelo.
// Formato píldora: gancho → dato → remate → pregunta de la SIGUIENTE trampa (gancho al perfil).
// La pregunta final queda apuntada en reels-voz/REGISTRO.md y la responde la píldora de los 9,99.
// Fuentes: Huber, Payne y Puto (1982); Dan Ariely (2008): con estudiantes del MIT, papel + web 84 % con
// la opción señuelo y 32 % sin ella (elección hipotética).
const { C, VOZ, CSS, cierreCon } = require('./_comun');
const largo = require('./efecto-senuelo.js');

const T = {
  en: {
    titulo: 'The medium popcorn <span class="c">is a trap</span>.',
    retencion: 'The price trap <span class="c">almost everyone falls for</span>',
    l: { tallas: ['Small', 'Medium', 'Large'], termino: 'Decoy effect', etiqueta: 'MEDIUM',
      fuente: 'The Economist · MIT students (Ariely, 2008)', con: 'With a silly option next to it', sin: 'Without it', eligen: 'picked the pricey option' },
    guion: [
      [0, '[amusement] The medium popcorn is *not there* for you to buy.'],
      [0, 'It’s there so you buy §*the large*. [short pause] And it works.'],
      [1, 'It’s called the §*decoy effect*: a useless option,§ there to make the other one look like a steal.'],
      [2, '[curiosity] In an MIT experiment, with a silly option next to it,§ *84%* picked the pricey one. [short pause] Without it,§ just *32%*.'],
      [3, 'And why does everything cost *$9.99*? [short pause] If you’ve ever wondered, *follow* so you don’t miss it.']
    ],
    cierre: 'Why does everything cost <span class="c">$9.99</span>? Follow so you don’t miss it.'
  },
  es: {
    titulo: 'Las palomitas medianas <span class="c">son una trampa</span>.',
    retencion: 'La trampa de precio en la que <span class="c">casi todos caen</span>',
    l: { tallas: ['Pequeña', 'Mediana', 'Grande'], termino: 'Efecto señuelo', etiqueta: 'MEDIANA',
      fuente: 'The Economist · estudiantes del MIT (Ariely, 2008)', con: 'Con una opción absurda al lado', sin: 'Sin ella', eligen: 'eligieron la opción cara' },
    guion: [
      [0, '[amusement] Las palomitas medianas *no están ahí* para que las compres.'],
      [0, 'Están ahí para que compres §*las grandes*. [short pause] Y funciona.'],
      [1, 'Se llama §*efecto señuelo*: una opción que nadie quiere,§ puesta ahí para que la otra parezca un chollo.'],
      [2, '[curiosity] En un experimento del MIT, con una opción absurda al lado,§ el *84 %* eligió la cara. [short pause] Sin ella,§ solo el *32 %*.'],
      [3, '¿Y por qué casi todo cuesta *9,99*? [short pause] Si te lo has preguntado alguna vez, *síguenos* para no perdértelo.']
    ],
    cierre: '¿Por qué todo cuesta <span class="c">9,99</span>? Síguenos para no perdértelo.'
  }
};

module.exports = {
  slug: 'trampa-01-senuelo',
  serie: 'Trampas de precio',
  voz: VOZ,
  T,
  datos: (lang) => largo.datos(lang),
  css: CSS + `
    .dato { background: ${C.superficie}; border: 1px solid ${C.borde}; border-radius: 28px; padding: 30px 36px; margin-top: 30px; opacity: 0; }
    .dato .eti { font-size: 34px; font-weight: 700; color: ${C.texto}; }
    .dato .cifra-g { font-size: 140px; font-weight: 850; letter-spacing: -.04em; line-height: 1; margin-top: 6px; font-variant-numeric: tabular-nums; }
    .dato .sub { font-size: 28px; color: ${C.suave}; font-weight: 600; }
    .dato .pista { height: 26px; border-radius: 10px; background: rgba(148,163,184,.14); overflow: hidden; margin-top: 18px; }
    .dato .bar { height: 100%; width: 0; border-radius: 10px; }
  `,
  escenas: [
    // 0 · Gancho: las tres palomitas (escena del banco largo).
    largo.escenas[0],
    // 1 · El nombre: efecto señuelo (el pato de madera atrae a los de verdad).
    largo.escenas[1],
    // 2 · El dato: 84 % con la opción absurda, 32 % sin ella.
    {
      html: (t) => `<div style="text-align:center;font-size:27px;font-weight:650;color:${C.suave}">${t.l.fuente}</div>
        ${[[t.l.con, C.acento], [t.l.sin, C.suave]].map(([eti, color], i) => `<div class="dato d${i}"><div class="eti">${eti}</div>
          <div class="cifra-g" style="color:${color}">0 %</div><div class="sub">${t.l.eligen}</div><div class="pista"><div class="bar" style="background:${color}"></div></div></div>`).join('')}`,
      anim: function (s, e, el) {
        const m = e.seg[0].marcas;
        [[84, m[0]], [32, m[1]]].forEach(([v, a], i) => {
          const d = el.querySelector('.d' + i), p = sale(tramo(s, a - 0.5, a)), q = sale(tramo(s, a - 0.2, a + 0.9));
          d.style.opacity = p; d.style.transform = 'translateY(' + ((1 - p) * 40) + 'px)';
          d.querySelector('.cifra-g').textContent = Math.round(v * q) + ' %'; d.querySelector('.bar').style.width = (v * q) + '%';
        });
      }
    },
    // 3 · Cierre con la pregunta de la siguiente trampa (salto con confeti).
    cierreCon('salto')
  ],
  texto: {
    en: `The medium popcorn isn't there for you to buy. 🍿 It's there so you buy the large.

It's called the decoy effect (Huber, Payne & Puto, 1982): an option almost nobody wants, placed next to another one so that one looks like a steal.

In the classic MIT example with The Economist subscriptions, 84% picked the pricey combo when a silly option sat next to it. Without it, only 32% did (Dan Ariely, "Predictably Irrational", 2008).

Next time you see three sizes, ask yourself: if only two existed, which would I pick?

Another price trap is coming: why does everything cost $9.99? If you've ever wondered, follow so you don't miss it. 👀

#personalfinance #moneytips #psychology #savingmoney #financialliteracy`,
    es: `Las palomitas medianas no están ahí para que las compres. 🍿 Están ahí para que compres las grandes.

Se llama efecto señuelo (Huber, Payne y Puto, 1982): una opción que casi nadie quiere, puesta al lado de otra para que esa parezca un chollo.

En el ejemplo clásico del MIT con las suscripciones de The Economist, el 84 % eligió el combo caro cuando tenía al lado una opción absurda. Sin ella, solo el 32 % (Dan Ariely, «Las trampas del deseo», 2008).

La próxima vez que veas tres tamaños, pregúntate: si solo existieran dos, ¿cuál elegiría?

Viene otra trampa de precio: ¿por qué casi todo cuesta 9,99? Si alguna vez te lo has preguntado, síguenos para no perdértelo. 👀

#finanzaspersonales #ahorro #dinero #educacionfinanciera #psicologia`
  }
};
