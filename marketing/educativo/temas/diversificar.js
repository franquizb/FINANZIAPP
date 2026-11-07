// Carrusel educativo: diversificar (no poner todos los huevos en la misma cesta).
// Inglés en dólares (EE. UU.), español en euros (España). Las cifras se calculan aquí.
const { C, icono } = require('../comun');

const agrupar = (n, sep) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, sep);
const dinero = (n, lang) => (lang === 'en' ? '$' + agrupar(n, ',') : agrupar(n, '.') + ' €');
const pct = (x, lang, signo = false) => (signo && x > 0 ? '+' : x < 0 ? '−' : '') + String(Math.abs(Math.round(x * 10) / 10)).replace('.', lang === 'en' ? '.' : ',') + '%';
const ROJO = '#e66767';

// Ejemplo: una cartera de 10.000 y una empresa que cae un 50 %, cuando es el 100 %
// de la cartera o una de 20 posiciones iguales (5 %). Las otras 19 no se mueven.
const CARTERA = 10000, CAIDA = 0.5, N = 20;
const casos = [1, 1 / N].map(peso => {
  const dentro = CARTERA * peso, pierde = dentro * CAIDA, queda = CARTERA - pierde;
  return { peso, dentro, pierde, queda, var: -pierde / CARTERA * 100 };
});
if (casos[0].queda !== 5000 || casos[1].dentro !== 500 || casos[1].pierde !== 250 || casos[1].queda !== 9750 || casos[1].var !== -2.5 || casos[0].var !== -50)
  throw new Error('diversificar: cifras de la caída incoherentes');

// Correlación: heladería y tienda de paraguas, años de sol y de lluvia (ilustrativo).
const negocio = { helados: { sol: 12, lluvia: -4 }, paraguas: { sol: -4, lluvia: 12 } };
const mitad = (k) => (negocio.helados[k] + negocio.paraguas[k]) / 2;
const vaiven = negocio.helados.sol - negocio.helados.lluvia;
if (mitad('sol') !== 4 || mitad('lluvia') !== 4 || vaiven !== 16 || negocio.paraguas.lluvia - negocio.paraguas.sol !== 16)
  throw new Error('diversificar: cifras de correlación incoherentes');

const T = {
  en: {
    kicker: 'INVESTING BASICS', desliza: 'Swipe →',
    s1: { t: 'Don’t put all your eggs <span class="c">in one basket</span>', l: 'Diversification, explained: how spreading your money limits the damage when one investment goes wrong.',
      si: 'If one company falls 50%…', filas: ['It’s all your money', 'It’s 5% of your money'], nota: 'Illustrative example.' },
    s2: { t: 'Diversifying,<br><span class="c">level by level</span>', l: 'Each level spreads your money a little wider.',
      items: [['uno', 'One company', 'Everything rides on one business'], ['muchos', 'Many companies', 'One bad apple barely moves the total'], ['tarta', 'Different sectors', 'Tech, health, energy… each has its own good and bad years'], ['globo', 'Different countries', 'Not only your home market'], ['capas', 'Different asset classes', 'Stocks, bonds and cash behave differently']] },
    s3: { t: 'Same drop,<br><span class="c">very different damage</span>', l: 'A $10,000 portfolio. One company falls 50%.',
      casos: ['All in one', `Spread across ${N}`], dentro: 'In that company', cae: 'It falls 50%', queda: 'Your portfolio now',
      nota: `Illustrative example: ${N} equal holdings, and the other ${N - 1} don’t move. In real life they move too, up or down.` },
    s4: { t: 'Best when things<br><span class="c">don’t move together</span>', l: 'That’s what “low correlation” means. A classic example: an ice cream stand and an umbrella shop.',
      cols: ['Ice cream', 'Umbrellas', 'Half & half'], filas: ['Sunny year', 'Rainy year'],
      final: (p, m) => `Alone, each one swings ${p} points between good and bad years. Together: ${m} either way.`,
      nota: 'Illustrative numbers. Real investments are rarely perfect opposites, but even partly different movements smooth the ride.' },
    s5: { t: 'What diversifying<br><span class="c">can’t do</span>', l: 'When the whole market falls, a diversified portfolio falls too. That’s market risk, and spreading doesn’t remove it.',
      siT: 'What it does', si: ['Softens one bad company', 'Softens one bad sector or country', 'Makes the ride smoother'],
      noT: 'What it doesn’t', no: ['Stop the whole market from falling', 'Guarantee a profit', 'Work if all your funds own the same things'] },
    s6: { t: 'Diversify <span class="c">without overthinking it</span>',
      items: [['Start with a broad index fund', 'Hundreds or thousands of companies in one purchase'], ['Look beyond your own country', 'Other markets don’t always move in step'], ['Mix in other kinds of assets', 'Bonds and cash for money you’ll need sooner'], ['Keep single stocks small', 'Even your employer’s, or one you love']],
      nota: 'Diversification doesn’t guarantee a profit or protect against every loss, and returns are not guaranteed. This is education, not financial advice.' }
  },
  es: {
    kicker: 'INVERSIÓN BÁSICA', desliza: 'Desliza →',
    s1: { t: 'No lo pongas todo<br><span class="c">en la misma cesta</span>', l: 'La diversificación, explicada: cómo repartir tu dinero limita el daño cuando una inversión sale mal.',
      si: 'Si una empresa cae un 50%…', filas: ['Es todo tu dinero', 'Es el 5% de tu dinero'], nota: 'Ejemplo ilustrativo.' },
    s2: { t: 'Diversificar,<br><span class="c">nivel a nivel</span>', l: 'Cada nivel reparte tu dinero un poco más.',
      items: [['uno', 'Una empresa', 'Todo depende de un solo negocio'], ['muchos', 'Muchas empresas', 'Una manzana podrida apenas mueve el total'], ['tarta', 'Distintos sectores', 'Tecnología, salud, energía… cada uno va a su ritmo'], ['globo', 'Distintos países', 'No solo el mercado de tu país'], ['capas', 'Distintos tipos de activo', 'Acciones, bonos y efectivo se comportan distinto']] },
    s3: { t: 'La misma caída,<br><span class="c">un daño muy distinto</span>', l: 'Una cartera de 10.000 €. Una empresa cae un 50%.',
      casos: ['Todo en una', `Repartido en ${N}`], dentro: 'En esa empresa', cae: 'Cae un 50%', queda: 'Tu cartera ahora',
      nota: `Ejemplo ilustrativo: ${N} posiciones iguales, y las otras ${N - 1} no se mueven. En la vida real también se mueven, para arriba o para abajo.` },
    s4: { t: 'Funciona mejor<br>si <span class="c">no van a la par</span>', l: 'Es lo que significa «baja correlación». Un ejemplo clásico: una heladería y una tienda de paraguas.',
      cols: ['Heladería', 'Paraguas', 'Mitad y mitad'], filas: ['Año de sol', 'Año de lluvia'],
      final: (p, m) => `Por separado, cada una oscila ${p} puntos entre años buenos y malos. Juntas: ${m} pase lo que pase.`,
      nota: 'Cifras ilustrativas. En la vida real casi nunca son opuestos perfectos, pero moverse algo distinto ya suaviza el camino.' },
    s5: { t: 'Lo que diversificar<br><span class="c">no hace</span>', l: 'Cuando cae todo el mercado, una cartera diversificada también cae. Es el riesgo de mercado, y repartir no lo elimina.',
      siT: 'Lo que sí hace', si: ['Amortigua una mala empresa', 'Amortigua un mal sector o país', 'Hace el camino más suave'],
      noT: 'Lo que no hace', no: ['Evitar que caiga todo el mercado', 'Garantizar ganancias', 'Funcionar si todos tus fondos tienen lo mismo'] },
    s6: { t: 'Diversifica <span class="c">sin complicarte</span>',
      items: [['Empieza por un fondo indexado amplio', 'Cientos o miles de empresas de una vez'], ['Mira más allá de tu país', 'Otros mercados no siempre van al mismo paso'], ['Combina distintos tipos de activo', 'Bonos y efectivo para el dinero que necesitarás antes'], ['Que las acciones sueltas pesen poco', 'Incluso la de tu empresa o una que te encante']],
      nota: 'Diversificar no garantiza ganancias ni evita todas las pérdidas, y la rentabilidad no está garantizada. Esto es educación financiera, no asesoramiento.' }
  }
};

// Iconos propios con el mismo trazo que los de comun.js.
const PROPIOS = {
  uno: '<rect x="7.5" y="7.5" width="9" height="9" rx="1.8"/>',
  muchos: '<rect x="4" y="4" width="4.2" height="4.2" rx=".9"/><rect x="9.9" y="4" width="4.2" height="4.2" rx=".9"/><rect x="15.8" y="4" width="4.2" height="4.2" rx=".9"/><rect x="4" y="9.9" width="4.2" height="4.2" rx=".9"/><rect x="9.9" y="9.9" width="4.2" height="4.2" rx=".9"/><rect x="15.8" y="9.9" width="4.2" height="4.2" rx=".9"/><rect x="4" y="15.8" width="4.2" height="4.2" rx=".9"/><rect x="9.9" y="15.8" width="4.2" height="4.2" rx=".9"/><rect x="15.8" y="15.8" width="4.2" height="4.2" rx=".9"/>',
  globo: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.5 2.6 3.7 5.6 3.7 9s-1.2 6.4-3.7 9c-2.5-2.6-3.7-5.6-3.7-9S9.5 5.6 12 3z"/>',
  capas: '<path d="m12 3.5 8.5 4.5-8.5 4.5L3.5 8z"/><path d="m3.5 12 8.5 4.5 8.5-4.5"/><path d="m3.5 16 8.5 4.5 8.5-4.5"/>'
};
const dibujo = (nombre, color, tam = 40) => PROPIOS[nombre]
  ? `<svg width="${tam}" height="${tam}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${PROPIOS[nombre]}</svg>`
  : icono(nombre, color, tam);

const ok = '<path d="m5 12.5 4.5 4.5L19 7.5"/>', ko = '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>';
const marca = (d, color) => `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" style="flex:0 0 auto;margin-top:4px">${d}</svg>`;
const etiqueta = (txt, color = C.suave) => `<div style="font-size:24px;font-weight:800;letter-spacing:.08em;color:${color}">${txt.toUpperCase()}</div>`;

// Cartera como barra: lo que queda en verde azulado y lo perdido en rojo.
function cartera(caso) {
  const tramos = Math.round(1 / caso.peso);
  return `<div style="display:flex;gap:3px;height:44px">${Array.from({ length: tramos }, (_, i) => {
    const r = (a, b) => `${a}px ${b}px ${b}px ${a}px`;
    const radio = tramos === 1 ? 12 : i === 0 ? r(12, 4) : i === tramos - 1 ? r(4, 12) : '4px';
    if (i) return `<span style="flex:1;background:${C.necesidades};border-radius:${tramos > 1 && i === tramos - 1 ? '4px 12px 12px 4px' : '4px'}"></span>`;
    return `<span style="flex:1;display:flex;border-radius:${radio};overflow:hidden"><span style="flex:${1 - CAIDA};background:${C.necesidades}"></span><span style="flex:${CAIDA};background:${ROJO}"></span></span>`;
  }).join('')}</div>`;
}

module.exports = {
  slug: 'diversificar',
  T,
  diapositivas: [
    // 1 · Portada: la misma caída con el 100 % o con el 5 % de la cartera
    (t, lang) => `<h1 class="grande">${t.s1.t}</h1><p class="lead">${t.s1.l}</p>
      <div class="tarjeta" style="margin-top:56px;padding:36px 38px 40px">${etiqueta(t.s1.si)}
        ${casos.map((c, i) => `<div style="margin-top:${i ? 34 : 24}px">
          <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:14px"><span style="font-size:30px;font-weight:650;color:${C.texto}">${t.s1.filas[i]}</span><span style="font-size:52px;font-weight:800;letter-spacing:-.03em;color:${i ? C.tinta : ROJO};font-variant-numeric:tabular-nums">${pct(c.var, lang)}</span></div>
          ${cartera(c)}</div>`).join('')}
      </div><p class="nota">${t.s1.nota}</p>`,
    // 2 · Niveles de diversificación
    (t) => `<h1>${t.s2.t}</h1><p class="lead">${t.s2.l}</p>
      <div style="margin-top:40px;display:flex;flex-direction:column;gap:14px">${t.s2.items.map(([ic, a, b]) =>
        `<div class="item" style="padding:20px 26px"><span class="ic" style="background:${C.necesidades}26">${dibujo(ic, C.necesidades, 42)}</span><span>${a}<small>${b}</small></span></div>`).join('')}</div>`,
    // 3 · El ejemplo en dinero
    (t, lang) => `<h1>${t.s3.t}</h1><p class="lead">${t.s3.l}</p>
      <div style="margin-top:44px;display:grid;grid-template-columns:1fr 1fr;gap:20px">${casos.map((c, i) => `<div class="tarjeta" style="padding:30px 30px 32px">
        ${etiqueta(t.s3.casos[i], i ? C.acento : ROJO)}
        ${[[t.s3.dentro, dinero(c.dentro, lang), C.tinta], [t.s3.cae, '−' + dinero(c.pierde, lang), ROJO]].map(([a, v, col]) => `<div style="margin-top:22px;padding-top:18px;border-top:1px solid ${C.borde}">
          <div style="font-size:26px;color:${C.suave};font-weight:550">${a}</div><div style="font-size:36px;font-weight:750;color:${col};font-variant-numeric:tabular-nums;margin-top:4px">${v}</div></div>`).join('')}
        <div style="margin-top:22px;padding-top:18px;border-top:2px solid ${i ? C.necesidades : ROJO}">
          <div style="font-size:26px;color:${C.texto};font-weight:650">${t.s3.queda}</div>
          <div style="font-size:54px;font-weight:800;letter-spacing:-.03em;font-variant-numeric:tabular-nums;margin-top:4px">${dinero(c.queda, lang)}</div>
          <div style="font-size:28px;font-weight:700;color:${i ? C.texto : ROJO}">${pct(c.var, lang)}</div></div>
      </div>`).join('')}</div>
      <p class="nota">${t.s3.nota}</p>`,
    // 4 · Correlación: heladería y paraguas
    (t, lang) => { const colores = [C.caprichos, C.ahorro, C.necesidades];
      const celda = (v, fuerte) => `<span style="text-align:right;font-size:${fuerte ? 40 : 36}px;font-weight:800;font-variant-numeric:tabular-nums;color:${v < 0 ? ROJO : fuerte ? C.acento : C.tinta}">${pct(v, lang, true)}</span>`;
      return `<h1>${t.s4.t}</h1><p class="lead">${t.s4.l}</p>
      <div class="tarjeta" style="margin-top:40px;padding:22px 34px 10px">
        <div style="display:grid;grid-template-columns:1.25fr 1fr 1fr 1.1fr;gap:12px;align-items:center;padding:12px 0 18px">
          <span></span>${t.s4.cols.map((c, i) => `<span style="display:flex;align-items:center;justify-content:flex-end;gap:10px;font-size:26px;font-weight:650;color:${C.texto}"><span class="punto" style="flex:0 0 auto;background:${colores[i]}"></span>${c}</span>`).join('')}</div>
        ${['sol', 'lluvia'].map((k, i) => `<div style="display:grid;grid-template-columns:1.25fr 1fr 1fr 1.1fr;gap:12px;align-items:center;padding:24px 0;border-top:1px solid ${C.borde}">
          <span style="font-size:30px;font-weight:650">${t.s4.filas[i]}</span>${celda(negocio.helados[k])}${celda(negocio.paraguas[k])}${celda(mitad(k), true)}</div>`).join('')}
      </div>
      <p class="lead" style="margin-top:34px"><b>${t.s4.final(vaiven, pct(mitad('sol'), lang, true))}</b></p>
      <p class="nota">${t.s4.nota}</p>`; },
    // 5 · Lo que no hace
    (t) => `<h1>${t.s5.t}</h1><p class="lead">${t.s5.l}</p>
      <div style="margin-top:44px;display:grid;grid-template-columns:1fr 1fr;gap:20px">
        ${[[t.s5.siT, t.s5.si, C.necesidades, ok], [t.s5.noT, t.s5.no, ROJO, ko]].map(([tit, lista, color, d]) => `<div class="tarjeta" style="padding:30px 28px">
          ${etiqueta(tit, color === ROJO ? ROJO : C.acento)}<div style="margin-top:12px">
          ${lista.map(x => `<div style="display:flex;gap:14px;align-items:flex-start;padding:16px 0;border-top:1px solid ${C.borde};font-size:29px;font-weight:600;line-height:1.35">${marca(d, color)}<span>${x}</span></div>`).join('')}</div></div>`).join('')}
      </div>`,
    // 6 · Cómo diversificar sin complicarse
    (t) => `<h1>${t.s6.t}</h1>
      <div style="margin-top:44px;display:flex;flex-direction:column;gap:14px">${t.s6.items.map(([a, b], i) => `<div class="item"><span class="ic" style="background:rgba(15,159,143,.15);font-size:30px;font-weight:800;color:${C.acento}">${i + 1}</span><span>${a}<small>${b}</small></span></div>`).join('')}</div>
      <p class="nota" style="margin-top:28px">${t.s6.nota}</p>`
  ],
  texto: {
    en: `Don't put all your eggs in one basket: that's diversification in one sentence. 🥚

Imagine a ${dinero(CARTERA, 'en')} portfolio and one company that falls 50%:
• If it's all your money, you lose ${dinero(casos[0].pierde, 'en')} and you're left with ${dinero(casos[0].queda, 'en')} (−50%).
• If it's 5% of your money (${dinero(casos[1].dentro, 'en')}, one of ${N} equal holdings), you lose ${dinero(casos[1].pierde, 'en')} and you're left with ${dinero(casos[1].queda, 'en')} (−2.5%), assuming the other ${N - 1} don't move.

Diversifying works in levels: many companies, different sectors, different countries and different asset classes (stocks, bonds, cash).

It works best when things don't move together. That's what "low correlation" means. Picture an ice cream stand that makes +12% in a sunny year and −4% in a rainy one, and an umbrella shop that does the opposite. Each one swings ${vaiven} points; half and half makes +4% either way. The numbers are illustrative, but the idea is real: investments that move differently smooth the ride.

What it can't do: when the whole market falls, a diversified portfolio falls too. That's market risk, and no amount of spreading removes it. It also doesn't help much if all your funds own the same companies.

Keeping it simple: a broad index fund, a look beyond your own country, bonds and cash for money you'll need sooner, and single stocks kept small (even your employer's).

Diversification doesn't guarantee a profit, and returns are not guaranteed. This is education, not financial advice.

In FinanziApp's net worth view you track your assets by type (cash, savings, stocks, funds, real estate…) month by month, so you can see how spread out your money really is (free for 15 days, link in bio).

#diversification #investingforbeginners #personalfinance #financialliteracy #moneytips`,
    es: `No pongas todos los huevos en la misma cesta: eso es diversificar, en una frase. 🥚

Imagina una cartera de ${dinero(CARTERA, 'es')} y una empresa que cae un 50%:
• Si es todo tu dinero, pierdes ${dinero(casos[0].pierde, 'es')} y te quedan ${dinero(casos[0].queda, 'es')} (−50%).
• Si es el 5% (${dinero(casos[1].dentro, 'es')}, una de ${N} posiciones iguales), pierdes ${dinero(casos[1].pierde, 'es')} y te quedan ${dinero(casos[1].queda, 'es')} (−2,5%), suponiendo que las otras ${N - 1} no se mueven.

Se diversifica por niveles: muchas empresas, distintos sectores, distintos países y distintos tipos de activo (acciones, bonos, efectivo).

Funciona mejor cuando las cosas no se mueven a la vez. Eso es lo que significa «baja correlación». Piensa en una heladería que gana un 12% en un año de sol y pierde un 4% en uno de lluvia, y en una tienda de paraguas a la que le pasa lo contrario. Cada una oscila ${vaiven} puntos; mitad y mitad, +4% pase lo que pase. Las cifras son ilustrativas, pero la idea es real: inversiones que se mueven distinto hacen el camino más suave.

Lo que no hace: cuando cae todo el mercado, una cartera diversificada también cae. Es el riesgo de mercado, y repartir no lo elimina. Tampoco sirve de mucho si todos tus fondos tienen las mismas empresas.

Para no complicarte: un fondo indexado amplio, mirar más allá de tu país, bonos y efectivo para el dinero que necesitarás antes, y que las acciones sueltas pesen poco (incluso la de tu empresa).

Diversificar no garantiza ganancias y la rentabilidad no está garantizada. Esto es educación financiera, no asesoramiento.

En el patrimonio de FinanziApp apuntas tus activos por tipo (efectivo, cuentas, acciones, fondos, inmuebles…) mes a mes, para ver lo repartido que está de verdad tu dinero (gratis 15 días, enlace en la bio).

#diversificacion #invertirdesdecero #finanzaspersonales #educacionfinanciera #inversion`
  }
};
