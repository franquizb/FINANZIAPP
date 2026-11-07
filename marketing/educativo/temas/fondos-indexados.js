// Carrusel educativo: los fondos indexados, explicados (qué es un índice, qué hace
// el fondo, comisiones, pasivo frente a activo, ETF frente a fondo, cómo empezar).
// Inglés en dólares (EE. UU.), español en euros (España). Las cifras se calculan aquí.
const { C, barra } = require('../comun');

const agrupar = (n, sep) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, sep);
const dinero = (n, lang) => (lang === 'en' ? '$' + agrupar(n, ',') : agrupar(n, '.') + ' €');
const pct = (x, lang) => String(x).replace('.', lang === 'en' ? '.' : ',') + '%';

// Comisiones: mismas aportaciones (200 al mes, 30 años) y la misma rentabilidad
// ilustrativa del 7% anual antes de comisiones; la comisión se resta de la rentabilidad.
const R = 0.07, MES = 200, ANOS = 30;
const vf = (anual) => { const r = anual / 12, n = ANOS * 12; return MES * (Math.pow(1 + r, n) - 1) / r; };
const COMISIONES = [0.1, 1.5];
const [bajo, alto] = COMISIONES.map(c => vf(R - c / 100));
const aportado = MES * 12 * ANOS;
const diferencia = bajo - alto, menos = Math.round((1 - alto / bajo) * 100);
if (!(bajo > alto && alto > aportado) || aportado !== 72000 || Math.round(bajo) !== 239234 || Math.round(alto) !== 182722 || menos !== 24)
  throw new Error('fondos-indexados: cifras de comisiones incoherentes');

// Pesos ilustrativos del índice: las empresas grandes pesan más (no son datos reales).
const pesos = Array.from({ length: 16 }, (_, i) => Math.pow(0.84, i));

const T = {
  en: {
    kicker: 'INVESTING BASICS', desliza: 'Swipe →',
    s1: { t: 'Index funds, <span class="c">explained simply</span>', l: 'Instead of trying to pick the winners, you buy a small piece of the whole market, all at once.',
      una: '1 stock', unaSub: '1 company', fondo: '1 index fund', fondoSub: 'Hundreds or thousands of companies' },
    s2: { t: 'An index is <span class="c">a list</span>', l: 'Companies chosen by a rule, used to measure how a market is doing. You can’t buy an index, but you can buy a fund that copies it.',
      filas: [['30', 'Dow Jones Industrial Average', '30 large US companies'], ['500', 'S&P 500', '500 large US companies'], ['1,000+', 'MSCI World', 'Large and mid‑size companies in 23 developed countries']],
      nota: 'Index providers: S&P Dow Jones Indices and MSCI. Examples to explain the idea, not recommendations.' },
    s3: { t: 'What an index fund <span class="c">does</span>', l: 'It holds the companies on the list and follows the list when it changes. No guessing.',
      indice: 'The index', fondo: 'Your index fund',
      puntos: ['The same companies', 'In roughly the same proportions', 'Your result ≈ the index’s, minus a small yearly fee'], nota: 'Bigger companies weigh more in the index. Bar widths are illustrative.' },
    s4: { t: 'Passive vs. <span class="c">active</span>',
      pasivo: ['Index fund', 'Passive', ['Copies an index', 'Aims to match the market', 'Low yearly fees']],
      activo: ['Active fund', 'Active', ['A manager picks stocks', 'Tries to beat the market', 'Higher yearly fees']],
      dato: 'Over long periods, most active funds have ended up behind their index after fees.', fuente: 'Source: S&P Dow Jones Indices, SPIVA U.S. Scorecard.' },
    s5: { t: 'Small fees,<br><span class="c">big difference</span>', l: '$200 a month for 30 years, at the same 7% average yearly return before fees. Only the fee changes:',
      ano: 'a year in fees', dif: 'Difference', menos: (p) => `${p}% less`, puesto: 'You put in, in both cases',
      nota: 'Illustrative example: returns are not guaranteed. Simplified: the fee is subtracted from the yearly return.' },
    s6: { t: 'ETF or mutual fund?<br><span class="c">Two wrappers</span>', l: 'The same idea inside: both can hold the same index. What changes is how you buy them.',
      tipos: [['ETF', ['Trades all day on the stock exchange, like a stock', 'Many brokers let you buy fractions of a share']],
        ['Index mutual fund', ['Bought and sold once a day, at the price set after the market closes', 'Some have a minimum first investment']]],
      final: 'What matters most: the index it tracks and its cost.' },
    s7: { t: 'How people <span class="c">usually start</span>',
      items: [['Build your safety net first', 'Emergency fund, and no high‑interest debt'], ['Choose a broad index', 'Hundreds or thousands of companies in one fund'], ['Compare the yearly cost', 'The expense ratio of similar funds'], ['Automate a small monthly amount', 'Often inside a 401(k) or an IRA'], ['Think in years, not months', 'And don’t sell just because the market drops']],
      nota: 'Index funds go down when the market goes down, and returns are not guaranteed. This is education, not financial advice: we don’t recommend specific funds.' }
  },
  es: {
    kicker: 'INVERSIÓN BÁSICA', desliza: 'Desliza →',
    s1: { t: 'Fondos indexados, <span class="c">explicados fácil</span>', l: 'En lugar de intentar adivinar qué empresas ganarán, compras un trocito de todo el mercado de una vez.',
      una: '1 acción', unaSub: '1 empresa', fondo: '1 fondo indexado', fondoSub: 'Cientos o miles de empresas' },
    s2: { t: 'Un índice es <span class="c">una lista</span>', l: 'Empresas elegidas con una regla, que sirven para medir cómo va un mercado. Un índice no se compra, pero sí un fondo que lo copia.',
      filas: [['35', 'IBEX 35', '35 de las empresas más negociadas de la bolsa española'], ['500', 'S&P 500', '500 grandes empresas de EE. UU.'], ['+1.000', 'MSCI World', 'Grandes y medianas empresas de 23 países desarrollados']],
      nota: 'Proveedores de los índices: BME, S&P Dow Jones Indices y MSCI. Ejemplos para explicar la idea, no recomendaciones.' },
    s3: { t: 'Qué hace un <span class="c">fondo indexado</span>', l: 'Compra las empresas de la lista y la sigue cuando cambia. Sin adivinar.',
      indice: 'El índice', fondo: 'Tu fondo indexado',
      puntos: ['Las mismas empresas', 'En casi las mismas proporciones', 'Tu resultado ≈ el del índice, menos una pequeña comisión'], nota: 'En el índice, las empresas grandes pesan más. El ancho de cada tramo es ilustrativo.' },
    s4: { t: 'Pasivo frente a <span class="c">activo</span>',
      pasivo: ['Fondo indexado', 'Pasivo', ['Copia un índice', 'Busca igualar al mercado', 'Comisiones bajas']],
      activo: ['Fondo activo', 'Activo', ['Un gestor elige las acciones', 'Intenta ganar al mercado', 'Comisiones más altas']],
      dato: 'A largo plazo, la mayoría de los fondos activos han quedado por detrás de su índice después de comisiones.', fuente: 'Fuente: S&P Dow Jones Indices, informes SPIVA (EE. UU. y Europa).' },
    s5: { t: 'Comisiones pequeñas,<br><span class="c">gran diferencia</span>', l: '200 € al mes durante 30 años, con la misma rentabilidad media del 7% anual antes de comisiones. Solo cambia la comisión:',
      ano: 'de comisión al año', dif: 'Diferencia', menos: (p) => `un ${p}% menos`, puesto: 'Lo que aportas en los dos casos',
      nota: 'Ejemplo ilustrativo: la rentabilidad no está garantizada. Simplificado: la comisión se resta de la rentabilidad de cada año.' },
    s6: { t: '¿Fondo indexado o ETF?<br><span class="c">Dos envoltorios</span>', l: 'Dentro, la misma idea: pueden seguir el mismo índice. Cambia cómo se compran y cómo tributan.',
      tipos: [['Fondo indexado', ['Se compra y se vende una vez al día, a su valor liquidativo', 'Puedes traspasarlo a otro fondo sin pagar impuestos hasta que vendes']],
        ['ETF', ['Cotiza en bolsa todo el día, como una acción', 'Sin esa ventaja: si cambias de ETF, tributas por la ganancia']]],
      final: 'Lo que más importa: el índice y su coste anual.',
      fuente: 'Traspasos: art. 94 de la Ley 35/2006 del IRPF.' },
    s7: { t: 'Cómo se <span class="c">suele empezar</span>',
      items: [['Primero, tu colchón', 'Fondo de emergencia y sin deudas caras'], ['Elige un índice amplio', 'Cientos o miles de empresas en un solo fondo'], ['Compara el coste anual', 'Los gastos corrientes de fondos parecidos'], ['Automatiza una aportación pequeña', 'El mismo día, cada mes'], ['Piensa en años, no en meses', 'Y no vendas solo porque la bolsa baje']],
      nota: 'Un fondo indexado baja cuando baja el mercado y la rentabilidad no está garantizada. Esto es educación financiera, no asesoramiento: no recomendamos fondos concretos.' }
  }
};

const ok = '<path d="m5 12.5 4.5 4.5L19 7.5"/>';
const marca = (d, color, tam = 30) => `<svg width="${tam}" height="${tam}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" style="flex:0 0 auto">${d}</svg>`;
const etiqueta = (txt, color = C.suave) => `<div style="font-size:24px;font-weight:800;letter-spacing:.08em;color:${color}">${txt.toUpperCase()}</div>`;

module.exports = {
  slug: 'fondos-indexados',
  T,
  diapositivas: [
    // 1 · Portada: una acción frente a un fondo que lleva cientos de empresas
    (t) => `<h1 class="grande">${t.s1.t}</h1><p class="lead">${t.s1.l}</p>
      <div class="tarjeta" style="margin-top:60px;padding:40px 40px 36px;display:grid;grid-template-columns:190px 1fr;grid-template-rows:auto 1fr auto;column-gap:44px;row-gap:22px">
        ${etiqueta(t.s1.una)}${etiqueta(t.s1.fondo, C.acento)}
        <div style="display:flex;align-items:center"><div style="width:100px;height:100px;border-radius:18px;background:${C.caprichos}"></div></div>
        <div style="display:grid;grid-template-columns:repeat(16,1fr);gap:7px">${Array.from({ length: 128 }, () => `<span style="aspect-ratio:1;border-radius:5px;background:${C.necesidades}"></span>`).join('')}</div>
        ${[t.s1.unaSub, t.s1.fondoSub].map(x => `<div style="font-size:28px;font-weight:600;color:${C.texto}">${x}</div>`).join('')}
      </div>`,
    // 2 · Qué es un índice
    (t) => `<h1>${t.s2.t}</h1><p class="lead">${t.s2.l}</p>
      <div class="tarjeta" style="margin-top:44px;padding:10px 36px">${t.s2.filas.map(([n, nombre, desc], i) =>
        `<div style="display:grid;grid-template-columns:190px 1fr;align-items:center;gap:20px;padding:26px 0;${i ? `border-top:1px solid ${C.borde}` : ''}">
          <span style="font-size:58px;font-weight:800;letter-spacing:-.03em;color:${C.acento};font-variant-numeric:tabular-nums">${n}</span>
          <span><span style="display:block;font-size:32px;font-weight:700">${nombre}</span><span style="display:block;font-size:27px;color:${C.suave};margin-top:4px;line-height:1.35">${desc}</span></span></div>`).join('')}</div>
      <p class="nota">${t.s2.nota}</p>`,
    // 3 · Qué hace el fondo: copia la lista en las mismas proporciones
    (t) => `<h1>${t.s3.t}</h1><p class="lead">${t.s3.l}</p>
      <div class="tarjeta" style="margin-top:44px;padding:36px 36px 38px">
        ${etiqueta(t.s3.indice)}<div style="margin:14px 0 28px">${barra(pesos.map(v => ({ valor: v, color: 'rgba(148,163,184,.55)' })), { alto: 40, radio: 10 })}</div>
        ${etiqueta(t.s3.fondo, C.acento)}<div style="margin-top:14px">${barra(pesos.map(v => ({ valor: v, color: C.necesidades })), { alto: 40, radio: 10 })}</div>
      </div>
      <div style="margin-top:22px">${t.s3.puntos.map((p, i) => `<div style="display:flex;gap:18px;align-items:flex-start;padding:16px 4px;${i ? `border-top:1px solid ${C.borde}` : ''};font-size:30px;font-weight:600;line-height:1.35">${marca(ok, C.acento, 34)}<span>${p}</span></div>`).join('')}</div>
      <p class="nota">${t.s3.nota}</p>`,
    // 4 · Pasivo frente a activo
    (t) => `<h1>${t.s4.t}</h1>
      <div style="margin-top:48px;display:grid;grid-template-columns:1fr 1fr;gap:20px">
        ${[[t.s4.pasivo, C.necesidades], [t.s4.activo, C.caprichos]].map(([[nombre, tipo, lista], color]) => `<div class="tarjeta" style="padding:30px 28px">
          ${etiqueta(tipo, color)}<div style="font-size:36px;font-weight:750;margin:12px 0 16px">${nombre}</div>
          ${lista.map(x => `<div style="padding:20px 0;border-top:1px solid ${C.borde};font-size:28px;font-weight:550;line-height:1.35;color:${C.texto}">${x}</div>`).join('')}</div>`).join('')}
      </div>
      <div class="tarjeta" style="margin-top:20px;display:flex;gap:22px;align-items:flex-start;border-color:rgba(15,159,143,.45)">
        <span style="flex:0 0 auto;width:12px;align-self:stretch;border-radius:6px;background:${C.necesidades}"></span>
        <p style="font-size:31px;line-height:1.4;font-weight:600">${t.s4.dato}</p></div>
      <p class="nota">${t.s4.fuente}</p>`,
    // 5 · Comisiones: 0,1% frente a 1,5% con las mismas aportaciones
    (t, lang) => `<h1>${t.s5.t}</h1><p class="lead">${t.s5.l}</p>
      <div class="tarjeta" style="margin-top:40px;padding:34px 36px">
        ${[[COMISIONES[0], bajo, C.necesidades], [COMISIONES[1], alto, C.caprichos]].map(([c, v, color], i) => `<div style="${i ? 'margin-top:30px' : ''}">
          <div style="display:flex;justify-content:space-between;align-items:baseline"><span style="font-size:30px;font-weight:650;color:${C.texto}"><b style="color:${C.tinta};font-size:34px">${pct(c, lang)}</b> ${t.s5.ano}</span><span style="font-size:46px;font-weight:800;letter-spacing:-.02em;font-variant-numeric:tabular-nums">${dinero(v, lang)}</span></div>
          <div style="display:flex;gap:3px;margin-top:14px;height:30px"><span style="width:${(v / bajo * 100).toFixed(2)}%;background:${color};border-radius:9px"></span>${v < bajo ? `<span style="flex:1;border:2px dashed #e66767;border-radius:9px"></span>` : ''}</div></div>`).join('')}
        <div class="fila" style="margin-top:26px;border-top:1px solid ${C.borde};padding-top:24px"><span class="eti">${t.s5.dif}</span><span class="val" style="color:#e66767">−${dinero(diferencia, lang)} <span style="font-weight:600;font-size:28px">(${t.s5.menos(menos)})</span></span></div>
        <div class="fila" style="padding-bottom:4px"><span class="eti">${t.s5.puesto}</span><span class="val">${dinero(aportado, lang)}</span></div>
      </div><p class="nota">${t.s5.nota}</p>`,
    // 6 · ETF frente a fondo
    (t) => `<h1>${t.s6.t}</h1><p class="lead">${t.s6.l}</p>
      <div style="margin-top:40px;display:flex;flex-direction:column;gap:18px">${t.s6.tipos.map(([nombre, lista], i) => `<div class="tarjeta" style="padding:28px 34px">
        <div style="font-size:34px;font-weight:750;color:${i ? C.tinta : C.acento};margin-bottom:6px">${nombre}</div>
        ${lista.map(x => `<div style="display:flex;gap:16px;align-items:flex-start;padding:14px 0;font-size:29px;line-height:1.38;color:${C.texto}"><span class="punto" style="flex:0 0 auto;margin-top:12px;background:${i ? C.ahorro : C.necesidades}"></span><span>${x}</span></div>`).join('')}</div>`).join('')}</div>
      <p class="lead" style="margin-top:36px"><b>${t.s6.final}</b></p>${t.s6.fuente ? `<p class="nota">${t.s6.fuente}</p>` : ''}`,
    // 7 · Cómo se suele empezar
    (t) => `<h1>${t.s7.t}</h1>
      <div style="margin-top:44px;display:flex;flex-direction:column;gap:14px">${t.s7.items.map(([a, b], i) => `<div class="item"><span class="ic" style="background:rgba(15,159,143,.15);font-size:30px;font-weight:800;color:${C.acento}">${i + 1}</span><span>${a}<small>${b}</small></span></div>`).join('')}</div>
      <p class="nota" style="margin-top:28px">${t.s7.nota}</p>`
  ],
  texto: {
    en: `An index fund is one of the simplest ways to invest: instead of trying to pick the winners, you own a small piece of the whole market. 🧺

What's an index? A list of companies chosen by a rule. The Dow Jones Industrial Average follows 30 large US companies, the S&P 500 follows 500, and the MSCI World more than 1,000 large and mid-size companies across 23 developed countries. You can't buy an index, but you can buy a fund that copies it.

What the fund does: it holds the companies on the list, in roughly the same proportions, and follows the list when it changes. Your result ≈ the index's result, minus a small yearly fee.

Passive vs. active: an active fund pays a manager to pick stocks and try to beat the market, usually with higher fees. Over long periods, most active funds have ended up behind their index after fees (S&P Dow Jones Indices, SPIVA U.S. Scorecard).

Why fees matter: $200 a month for 30 years, at a 7% average yearly return before fees, grows to about ${dinero(bajo, 'en')} with a 0.1% yearly fee and about ${dinero(alto, 'en')} with 1.5%. Same ${dinero(aportado, 'en')} put in, ${dinero(diferencia, 'en')} less (${menos}%), just from the fee.

ETF or mutual fund? Same idea, two wrappers. An ETF trades all day like a stock; a mutual fund is priced once a day after the market closes, and some have a minimum first investment. Both can track the same index, so look at which index it follows and at its expense ratio.

How people usually start: emergency fund first, a broad index, a low expense ratio compared with similar funds, a small automatic monthly amount (often inside a 401(k) or an IRA), and years of patience.

Returns are not guaranteed: index funds go down when the market goes down, and 7% is only an illustration. This is education, not financial advice, and we don't recommend specific funds.

Want to see what a fee does to your own numbers? In FinanziApp's compound interest calculator, subtract the fee from the expected return (free for 15 days, link in bio).

If you haven't started yet, what's holding you back? 👇

#indexfunds #investingforbeginners #personalfinance #financialliteracy #etf`,
    es: `Un fondo indexado es una de las formas más sencillas de invertir: en lugar de intentar adivinar qué empresas ganarán, tienes un trocito de todo el mercado. 🧺

¿Qué es un índice? Una lista de empresas elegidas con una regla. El IBEX 35 sigue a 35 de las empresas más negociadas de la bolsa española, el S&P 500 a 500 grandes empresas de EE. UU. y el MSCI World a más de 1.000 grandes y medianas empresas de 23 países desarrollados. Un índice no se compra, pero sí un fondo que lo copia.

Qué hace el fondo: compra las empresas de la lista, en casi las mismas proporciones, y la sigue cuando cambia. Tu resultado ≈ el del índice, menos una pequeña comisión anual.

Pasivo frente a activo: en un fondo activo, un gestor elige acciones e intenta ganar al mercado, normalmente con comisiones más altas. A largo plazo, la mayoría de los fondos activos han quedado por detrás de su índice después de comisiones (S&P Dow Jones Indices, informes SPIVA).

Por qué importan las comisiones: 200 € al mes durante 30 años, con una rentabilidad media del 7% anual antes de comisiones, se convierten en unos ${dinero(bajo, 'es')} con un 0,1% de comisión anual y en unos ${dinero(alto, 'es')} con un 1,5%. Aportas lo mismo (${dinero(aportado, 'es')}) y acabas con ${dinero(diferencia, 'es')} menos (un ${menos}%), solo por la comisión.

¿Fondo indexado o ETF? Misma idea, dos envoltorios. El fondo se compra y se vende una vez al día, a su valor liquidativo, y en España puedes traspasarlo a otro fondo sin tributar hasta que vendes (art. 94 de la Ley del IRPF). El ETF cotiza en bolsa todo el día, como una acción, pero no tiene esa ventaja: si cambias de ETF, tributas por la ganancia. Los dos pueden seguir el mismo índice, así que mira qué índice sigue y sus gastos corrientes.

Cómo se suele empezar: primero el fondo de emergencia, un índice amplio, un coste anual bajo comparado con fondos parecidos, una aportación automática pequeña cada mes y años de paciencia.

La rentabilidad no está garantizada: un fondo indexado baja cuando baja el mercado, y el 7% es solo un ejemplo. Esto es educación financiera, no asesoramiento, y no recomendamos fondos concretos.

¿Quieres ver qué hace una comisión con tus números? En la calculadora de interés compuesto de FinanziApp, resta la comisión a la rentabilidad esperada (gratis 15 días, enlace en la bio).

Si todavía no has empezado, ¿qué es lo que te frena? 👇

#fondosindexados #invertirdesdecero #finanzaspersonales #educacionfinanciera #inversionpasiva`
  }
};
