// Carrusel educativo: el patrimonio neto (qué es, qué cuenta, un ejemplo y cada
// cuánto mirarlo). Inglés en dólares (EE. UU.), español en euros (España).
// Todas las cifras se calculan o se comprueban aquí al cargar.
const { C, icono } = require('../comun');

const ROJO = '#e66767';
const agrupar = (n, sep) => String(Math.round(Math.abs(n))).replace(/\B(?=(\d{3})+(?!\d))/g, sep);
const dinero = (n, lang) => (n < 0 ? '−' : '') + (lang === 'en' ? '$' + agrupar(n, ',') : agrupar(n, '.') + ' €');
const plano = (s) => s.replace(/ /g, ' ');   // para la descripción
// Une las dos últimas palabras con un espacio de no separación (evita palabras sueltas en la última línea).
const nb = (s) => s.replace(/ (?=(?:<[^>]*>)?[^ <>]*(?:<\/[^>]+>)?$)/, '\u00a0');
const suma = (filas) => filas.reduce((s, [, v]) => s + v, 0);

const T = {
  en: {
    kicker: 'MONEY BASICS', desliza: 'Swipe →',
    s1: { t: 'Net worth: the number that <span class="c">shows where you stand</span>', l: 'It’s not what you earn. It’s what you own minus what you owe.',
      tiene: 'What you own', debe: 'What you owe', neto: 'Net worth' },
    s2: { t: 'What counts on <span class="c">each side</span>',
      activos: ['Assets', 'What you own', ['Cash & savings', 'Retirement accounts', 'Investments', 'Your home', 'Your car']],
      pasivos: ['Liabilities', 'What you owe', ['Mortgage', 'Car loan', 'Student loans', 'Credit cards', 'Other loans']],
      nota: 'Value things at what they’d sell for today, not what you paid. Leave out everyday stuff like clothes and furniture: it rarely sells for much.' },
    s3: { t: 'Example: <span class="c">one household</span>', tA: 'Assets', tP: 'Liabilities', neto: 'Net worth',
      activos: [['Home (market value)', 320000], ['Car (resale value)', 18000], ['Savings', 9000], ['401(k) retirement', 38000]],
      pasivos: [['Mortgage balance', 250000], ['Car loan', 11000], ['Credit card', 2500]],
      esperado: 121500, nota: 'Example numbers. Assets at today’s value, debts at what’s still owed.' },
    s4: { t: 'Why it matters <span class="c">more than income</span>', l: 'Income is what comes in. Net worth is what you keep.',
      p: [['Sam', 120000, 25000, 40000], ['Jordan', 60000, 70000, 10000]],
      ingresos: 'Income', neto: 'Net worth', porAno: '/yr', tiene: 'Owns', debe: 'owes',
      final: 'A high income doesn’t build wealth on its own. What you keep does.' },
    s5: { t: 'Negative? <span class="c">Normal at the start</span>', l: 'Student loans or a first car loan can put you below zero in your 20s. What matters is the direction.',
      inicio: -28000, base: 900, paso: 90, caidas: { 9: -3500, 18: -2500, 25: -4000 },
      ano: 'Year', inicioT: 'Start', cruce: (a) => `Above zero in year ${a}`,
      nota: 'Illustrative example, one dot per quarter. Households under 35 have the lowest median net worth of any age group (Federal Reserve, Survey of Consumer Finances 2022).' },
    s6: { t: 'How often should you <span class="c">check it?</span>', meses: 'JFMAMJJASOND',
      opciones: [['Monthly', 'Useful if you’re paying off debt or saving for a goal: you see progress sooner.', 1], ['Quarterly', 'Enough for most people. Homes and investments move around, and checking less often filters out the noise.', 3]],
      final: 'Pick a date and stick to it. What matters is the trend over the year.' },
    s7: { t: 'Work out yours in <span class="c">4 steps</span>',
      items: [['List what you own', 'At today’s value: what it would sell for'], ['List what you owe', 'Current balances, from your statements'], ['Subtract', 'Own − owe = your net worth'], ['Repeat every month or quarter', 'Same day each time, so it’s easy to compare']],
      final: 'Compare yourself with your past self, not with others.' }
  },
  es: {
    kicker: 'FINANZAS BÁSICAS', desliza: 'Desliza →',
    s1: { t: 'Patrimonio neto: la cifra que <span class="c">dice dónde estás</span>', l: 'No es lo que ganas. Es lo que tienes menos lo que debes.',
      tiene: 'Lo que tienes', debe: 'Lo que debes', neto: 'Patrimonio neto' },
    s2: { t: 'Qué cuenta en <span class="c">cada lado</span>',
      activos: ['Activos', 'Lo que tienes', ['Cuentas y ahorro', 'Planes de pensiones', 'Inversiones', 'Tu vivienda', 'Tu coche']],
      pasivos: ['Pasivos', 'Lo que debes', ['Hipoteca', 'Préstamo del coche', 'Préstamos personales', 'Tarjetas de crédito', 'Compras a plazos']],
      nota: 'Valora las cosas por lo que sacarías hoy al venderlas, no por lo que pagaste. Deja fuera lo cotidiano, como ropa o muebles: casi nunca se vende por mucho.' },
    s3: { t: 'Ejemplo: <span class="c">un hogar</span>', tA: 'Activos', tP: 'Pasivos', neto: 'Patrimonio neto',
      activos: [['Vivienda (valor de mercado)', 210000], ['Coche (valor de venta)', 12000], ['Ahorro', 8000], ['Plan de pensiones', 20000]],
      pasivos: [['Hipoteca pendiente', 150000], ['Préstamo del coche', 7000], ['Tarjeta de crédito', 1500]],
      esperado: 91500, nota: 'Cifras de ejemplo. Lo que tienes, a su valor actual; las deudas, por lo que queda por pagar.' },
    s4: { t: 'Por qué importa <span class="c">más que el sueldo</span>', l: 'Los ingresos son lo que entra. El patrimonio, lo que conservas.',
      p: [['Sara', 60000, 20000, 32000], ['Jorge', 30000, 45000, 5000]],
      ingresos: 'Ingresos', neto: 'Patrimonio', porAno: '/año', tiene: 'Tiene', debe: 'debe',
      final: 'Un sueldo alto no crea patrimonio por sí solo. Lo crea lo que conservas.' },
    s5: { t: '¿Negativo? <span class="c">Normal al empezar</span>', l: 'Un préstamo para estudiar o para el primer coche puede dejarte por debajo de cero. Lo que importa es la tendencia.',
      inicio: -18000, base: 600, paso: 60, caidas: { 9: -2500, 18: -1500, 25: -3000 },
      ano: 'Año', inicioT: 'Inicio', cruce: (a) => `Por encima de cero en el año ${a}`,
      nota: 'Ejemplo ilustrativo, un punto por trimestre. Los hogares de menores de 35 años son los de menor riqueza neta mediana (Banco de España, Encuesta Financiera de las Familias).' },
    s6: { t: '¿Cada cuánto <span class="c">mirarlo?</span>', meses: 'EFMAMJJASOND',
      opciones: [['Cada mes', 'Útil si estás saldando deudas o ahorrando para un objetivo: ves el avance antes.', 1], ['Cada trimestre', 'Suficiente para la mayoría. La vivienda y las inversiones suben y bajan, y mirarlo menos a menudo filtra el ruido.', 3]],
      final: 'Elige una fecha y mantenla. Lo que importa es la tendencia del año.' },
    s7: { t: 'Calcula el tuyo en <span class="c">4 pasos</span>',
      items: [['Apunta lo que tienes', 'A su valor de hoy: lo que sacarías al venderlo'], ['Apunta lo que debes', 'Lo que queda por pagar, según tus extractos'], ['Resta', 'Tienes − debes = tu patrimonio neto'], ['Repite cada mes o trimestre', 'Siempre el mismo día, para poder comparar']],
      final: 'Compárate con quien eras hace un año, no con los demás.' }
  }
};

// Cálculos y comprobaciones.
for (const lang of ['en', 'es']) {
  const t = T[lang], e = t.s3;
  e.totA = suma(e.activos); e.totP = suma(e.pasivos); e.totN = e.totA - e.totP;
  if (e.totN !== e.esperado) throw new Error(`patrimonio-neto: el ejemplo no cuadra (${lang}): ${e.totA} − ${e.totP} = ${e.totN}`);
  for (const p of t.s4.p) p.push(p[2] - p[3]);                        // [nombre, ingresos, tiene, debe, neto]
  if (!(t.s4.p[0][1] > t.s4.p[1][1] && t.s4.p[0][4] < 0 && t.s4.p[1][4] > 0)) throw new Error('patrimonio-neto: la comparación no ilustra la idea ' + lang);
  // Serie trimestral ilustrativa: ahorro que crece poco a poco y algunas caídas de mercado.
  const s = t.s5, v = [s.inicio];
  for (let q = 1; q <= 32; q++) v.push(v[q - 1] + s.base + s.paso * q + (s.caidas[q] || 0));
  s.serie = v; s.qCruce = v.findIndex(x => x >= 0); s.anoCruce = Math.ceil(s.qCruce / 4);
  if (s.qCruce < 4 || v[32] <= 0 || v.slice(s.qCruce).some(x => x < 0)) throw new Error('patrimonio-neto: la serie ilustrativa no cruza el cero una sola vez ' + lang);
}

const fondo = (c) => c + '26';
const marca = (d, color) => `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.6" stroke-linecap="round">${d}</svg>`;
const MAS = '<path d="M12 5.5v13M5.5 12h13"/>', MENOS = '<path d="M5.5 12h13"/>';

// Barras de la portada: lo que tienes, lo que debes (alineado a la derecha) y la diferencia.
function portada(t, lang) {
  const e = T[lang].s3, pN = e.totN / e.totA * 100, pP = e.totP / e.totA * 100;
  const fila = (eti, val, col, barra) => `<div style="padding:16px 0">
    <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:12px"><span style="font-size:30px;font-weight:650;color:${C.texto}">${eti}</span><span style="font-size:36px;font-weight:800;font-variant-numeric:tabular-nums;color:${col}">${val}</span></div>
    <div style="position:relative;height:34px">${barra}</div></div>`;
  const tramo = (izq, ancho, col) => `<span style="position:absolute;top:0;bottom:0;left:${izq.toFixed(2)}%;width:${ancho.toFixed(2)}%;background:${col};border-radius:10px"></span>`;
  return `<div class="tarjeta" style="margin-top:60px;padding:30px 40px">
    ${fila(t.s1.tiene, dinero(e.totA, lang), C.tinta, tramo(0, 100, C.necesidades))}
    ${fila(t.s1.debe, dinero(-e.totP, lang), ROJO, `<span style="position:absolute;top:0;bottom:0;left:0;width:${pN.toFixed(2)}%;border:2px dashed rgba(148,163,184,.3);border-radius:10px"></span>${tramo(pN + 0.4, pP - 0.4, ROJO)}`)}
    <div style="border-top:2px solid ${C.borde};margin-top:8px"></div>
    ${fila(t.s1.neto, dinero(e.totN, lang), C.acento, tramo(0, pN, C.ahorro))}</div>`;
}

// Diapositiva 3: una sección de la lista (activos o pasivos) con su total en la cabecera.
function seccion(tit, filas, total, color, signo, lang) {
  return `<div style="display:flex;justify-content:space-between;align-items:baseline;padding:14px 0 8px">
      <span style="display:flex;align-items:center;gap:14px;font-size:26px;font-weight:800;letter-spacing:.06em;color:${color}"><span class="punto" style="background:${color}"></span>${tit.toUpperCase()}</span>
      <span style="font-size:36px;font-weight:800;font-variant-numeric:tabular-nums;color:${color === ROJO ? ROJO : C.tinta}">${dinero(signo * total, lang)}</span></div>
    ${filas.map(([a, v]) => `<div style="display:flex;justify-content:space-between;align-items:baseline;padding:9px 0 9px 30px;font-size:29px"><span style="color:${C.texto}">${a}</span><span style="font-weight:650;font-variant-numeric:tabular-nums;color:${C.texto}">${dinero(signo * v, lang)}</span></div>`).join('')}`;
}

// Diapositiva 4: barras de ingresos y patrimonio en la misma escala, con el cero marcado.
function comparacion(t, lang) {
  const ps = t.s4.p, lo = Math.min(0, ...ps.map(p => p[4])), hi = Math.max(...ps.map(p => Math.max(p[1], p[4])));
  const x = (v) => (v - lo) / (hi - lo) * 100, x0 = x(0);
  const barra = (v, col) => { const a = Math.min(x0, x(v)), b = Math.max(x0, x(v)); return `<div style="position:relative;height:24px">
      <span style="position:absolute;top:0;bottom:0;left:${a.toFixed(2)}%;width:${(b - a).toFixed(2)}%;background:${col};border-radius:${v < 0 ? '8px 2px 2px 8px' : '2px 8px 8px 2px'}"></span>
      <span style="position:absolute;top:-8px;bottom:-8px;left:calc(${x0.toFixed(2)}% - 1px);width:2px;background:${C.suave}"></span></div>`; };
  const linea = (eti, v, col, txt, colTxt) => `<div style="display:grid;grid-template-columns:170px 1fr 230px;gap:18px;align-items:center;padding:10px 0">
      <span style="font-size:27px;color:${C.texto};font-weight:600">${eti}</span>${barra(v, col)}
      <span style="font-size:32px;font-weight:800;text-align:right;font-variant-numeric:tabular-nums;color:${colTxt}">${txt}</span></div>`;
  return ps.map(([n, ing, tiene, debe, neto]) => `<div class="tarjeta" style="padding:28px 36px">
      <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:10px"><span style="font-size:36px;font-weight:800">${n}</span><span style="font-size:26px;color:${C.suave}">${t.s4.tiene} ${dinero(tiene, lang)} · ${t.s4.debe} ${dinero(debe, lang)}</span></div>
      ${linea(t.s4.ingresos, ing, 'rgba(148,163,184,.45)', dinero(ing, lang) + `<span style="font-size:24px;color:${C.suave};font-weight:600">${t.s4.porAno}</span>`, C.tinta)}
      ${linea(t.s4.neto, neto, neto < 0 ? ROJO : C.ahorro, dinero(neto, lang), neto < 0 ? ROJO : C.tinta)}</div>`).join('');
}

// Diapositiva 5: curva trimestral ilustrativa; por debajo de cero en rojo, por encima en verde azulado.
function grafico(t, lang) {
  const s = t.s5, v = s.serie, W = 900, H = 470, pl = 14, pr = 14, pt = 64, pb = 56;
  const lo = Math.floor(Math.min(...v) / 10000) * 10000 - 10000, hi = Math.ceil(Math.max(...v) / 10000) * 10000;
  const x = (q) => pl + q / 32 * (W - pl - pr), y = (n) => pt + (1 - (n - lo) / (hi - lo)) * (H - pt - pb);
  const y0 = y(0), off = ((y0 - pt) / (H - pt - pb) * 100).toFixed(2);
  const linea = v.map((n, q) => `${q ? 'L' : 'M'}${x(q).toFixed(1)},${y(n).toFixed(1)}`).join(' ');
  const xc = x(s.qCruce), fin = v[32];
  const ejes = [0, 2, 4, 6, 8].map(a => `<text x="${x(a * 4)}" y="${H - 14}" fill="${C.suave}" font-size="23" text-anchor="${a === 0 ? 'start' : a === 8 ? 'end' : 'middle'}">${a === 0 ? s.inicioT : s.ano + ' ' + a}</text>`).join('');
  return `<svg width="100%" viewBox="0 0 ${W} ${H}">
    <defs><linearGradient id="trazo" gradientUnits="userSpaceOnUse" x1="0" y1="${pt}" x2="0" y2="${H - pb}"><stop offset="${off}%" stop-color="${C.acento}"/><stop offset="${off}%" stop-color="${ROJO}"/></linearGradient>
      <linearGradient id="area" gradientUnits="userSpaceOnUse" x1="0" y1="${pt}" x2="0" y2="${H - pb}"><stop offset="${off}%" stop-color="${C.necesidades}" stop-opacity=".22"/><stop offset="${off}%" stop-color="${ROJO}" stop-opacity=".16"/></linearGradient></defs>
    <path d="${linea} L${x(32)},${y0} L${x(0)},${y0} Z" fill="url(#area)"/>
    <line x1="${pl}" x2="${W - pr}" y1="${y0}" y2="${y0}" stroke="${C.suave}" stroke-width="2"/>
    <text x="${W - pr}" y="${y0 + 32}" fill="${C.suave}" font-size="23" text-anchor="end">0</text>
    <line x1="${xc}" x2="${xc}" y1="${pt - 10}" y2="${y0}" stroke="${C.acento}" stroke-width="2" stroke-dasharray="6 7"/>
    <text x="${xc}" y="${pt - 22}" fill="${C.acento}" font-size="25" font-weight="700" text-anchor="middle">${s.cruce(s.anoCruce)}</text>
    <path d="${linea}" fill="none" stroke="url(#trazo)" stroke-width="4" stroke-linejoin="round"/>
    ${v.map((n, q) => `<circle cx="${x(q).toFixed(1)}" cy="${y(n).toFixed(1)}" r="5" fill="${n < 0 ? ROJO : C.acento}"/>`).join('')}
    <text x="${x(0)}" y="${y(v[0]) + 44}" fill="${ROJO}" font-size="28" font-weight="800">${dinero(v[0], lang)}</text>
    <text x="${x(32) - 16}" y="${y(fin) + 9}" fill="${C.tinta}" font-size="28" font-weight="800" text-anchor="end">${dinero(fin, lang)}</text>
    ${ejes}</svg>`;
}

module.exports = {
  slug: 'patrimonio-neto',
  T,
  diapositivas: [
    // 1 · Portada
    (t, lang) => `<h1 class="grande">${t.s1.t}</h1><p class="lead">${nb(t.s1.l)}</p>${portada(t, lang)}`,
    // 2 · Qué cuenta en cada lado
    (t) => `<h1>${t.s2.t}</h1>
      <div style="margin-top:52px;display:grid;grid-template-columns:1fr 1fr;gap:20px">
        ${[[t.s2.activos, C.necesidades, MAS], [t.s2.pasivos, ROJO, MENOS]].map(([[tit, sub, lista], color, d]) => `<div class="tarjeta" style="padding:30px 28px">
          <div style="font-size:26px;font-weight:800;letter-spacing:.06em;color:${color}">${tit.toUpperCase()}</div>
          <div style="font-size:26px;color:${C.suave};margin:4px 0 16px">${sub}</div>
          ${lista.map(x => `<div style="display:flex;gap:14px;align-items:center;padding:14px 0;border-top:1px solid ${C.borde};font-size:29px;font-weight:600">${marca(d, color)}<span>${x}</span></div>`).join('')}</div>`).join('')}
      </div><p class="nota" style="margin-top:26px">${nb(t.s2.nota)}</p>`,
    // 3 · Ejemplo
    (t, lang) => { const e = t.s3; return `<h1>${e.t}</h1>
      <div class="tarjeta" style="margin-top:44px;padding:22px 36px 28px">
        ${seccion(e.tA, e.activos, e.totA, C.necesidades, 1, lang)}
        <div style="height:14px"></div>
        ${seccion(e.tP, e.pasivos, e.totP, ROJO, -1, lang)}
        <div style="border-top:2px solid ${C.ahorro};margin-top:18px;padding-top:20px;display:flex;justify-content:space-between;align-items:center">
          <span><span style="display:block;font-size:32px;font-weight:750">${e.neto}</span><span style="display:block;font-size:26px;color:${C.suave};margin-top:4px;font-variant-numeric:tabular-nums">${dinero(e.totA, lang)} − ${dinero(e.totP, lang)}</span></span>
          <span style="font-size:54px;font-weight:800;letter-spacing:-.03em;color:${C.acento};font-variant-numeric:tabular-nums">${dinero(e.totN, lang)}</span></div>
      </div><p class="nota">${nb(e.nota)}</p>`; },
    // 4 · Por qué importa más que los ingresos
    (t, lang) => `<h1>${t.s4.t}</h1><p class="lead">${nb(t.s4.l)}</p>
      <div style="margin-top:44px;display:flex;flex-direction:column;gap:18px">${comparacion(t, lang)}</div>
      <p class="lead" style="margin-top:36px"><b>${nb(t.s4.final)}</b></p>`,
    // 5 · Negativo al empezar
    (t, lang) => `<h1>${t.s5.t}</h1><p class="lead">${nb(t.s5.l)}</p>
      <div class="tarjeta" style="margin-top:40px;padding:22px 28px 14px">${grafico(t, lang)}</div>
      <p class="nota">${nb(t.s5.nota)}</p>`,
    // 6 · Cada cuánto mirarlo
    (t) => `<h1>${t.s6.t}</h1>
      <div style="margin-top:52px;display:flex;flex-direction:column;gap:22px">${t.s6.opciones.map(([nombre, desc, cada], k) => { const col = k ? C.ahorro : C.necesidades; return `<div class="tarjeta">
        <div style="font-size:36px;font-weight:800;margin-bottom:20px">${nombre}</div>
        <div style="display:grid;grid-template-columns:repeat(12,1fr);gap:8px">${[...t.s6.meses].map((m, i) => { const si = (i + 1) % cada === 0; return `<span style="height:58px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:23px;font-weight:750;${si ? `background:${col};color:#fff` : `border:2px solid ${C.borde};color:${C.suave}`}">${m}</span>`; }).join('')}</div>
        <div style="font-size:28px;line-height:1.4;color:${C.texto};margin-top:20px">${desc}</div></div>`; }).join('')}</div>
      <p class="lead" style="margin-top:40px"><b>${nb(t.s6.final)}</b></p>`,
    // 7 · En 4 pasos
    (t) => `<h1>${t.s7.t}</h1>
      <div style="margin-top:48px;display:flex;flex-direction:column;gap:16px">${t.s7.items.map(([a, b], i) => `<div class="item"><span class="ic" style="background:${fondo(C.necesidades)};font-size:30px;font-weight:800;color:${C.acento}">${i + 1}</span><span>${a}<small>${b}</small></span></div>`).join('')}</div>
      <p class="lead" style="margin-top:40px"><b>${nb(t.s7.final)}</b></p>`
  ],
  texto: {}
};

const en = T.en, es = T.es, D = (n) => dinero(n, 'en'), E = (n) => dinero(n, 'es');
const eA = en.s3.activos.map(f => f[1]), eP = en.s3.pasivos.map(f => f[1]), [eS, eJ] = en.s4.p;
const sA = es.s3.activos.map(f => f[1]), sP = es.s3.pasivos.map(f => f[1]), [sS, sJ] = es.s4.p;
module.exports.texto.en = plano(`Net worth is one of the clearest ways to see where you stand with money. 🧭

Net worth = what you own (assets) − what you owe (liabilities).
• Assets: cash and savings, retirement accounts, investments, your home and your car, at what they'd sell for today
• Liabilities: mortgage, car loan, student loans, credit card balances, other loans

Example: a home worth ${D(eA[0])}, a car worth ${D(eA[1])}, ${D(eA[2])} in savings and ${D(eA[3])} in a 401(k) add up to ${D(en.s3.totA)} in assets. A ${D(eP[0])} mortgage balance, an ${D(eP[1])} car loan and ${D(eP[2])} on a credit card add up to ${D(en.s3.totP)} in liabilities. Net worth: ${D(en.s3.totN)}.

Why it matters more than income: income is what comes in, net worth is what you keep. Sam earns ${D(eS[1])} a year but owes ${D(eS[3])} and owns ${D(eS[2])}, so his net worth is ${D(eS[4])}. Jordan earns ${eJ[1] * 2 === eS[1] ? 'half that' : D(eJ[1])}, and with ${D(eJ[2])} saved and ${D(eJ[3])} owed, has a net worth of ${D(eJ[4])}.

If yours is negative, especially in your 20s with student loans, that's normal: households under 35 have the lowest median net worth of any age group (Federal Reserve, Survey of Consumer Finances 2022). What matters is the direction. Check it every month or quarter, on the same day, and watch the trend over the year. Compare yourself with your past self, not with others.

FinanziApp has a net worth section that charts how yours changes over time, so the trend is easy to see (free for 15 days, link in bio).

How often do you check yours? 👇

#networth #personalfinance #financialliteracy #moneytips #wealthbuilding`);
module.exports.texto.es = plano(`El patrimonio neto es una de las formas más claras de saber dónde estás con tu dinero. 🧭

Patrimonio neto = lo que tienes (activos) − lo que debes (pasivos).
• Activos: cuentas y ahorro, planes de pensiones, inversiones, tu vivienda y tu coche, por lo que sacarías hoy al venderlos
• Pasivos: hipoteca, préstamo del coche, préstamos personales, tarjetas de crédito, compras a plazos

Ejemplo: una vivienda que vale ${E(sA[0])}, un coche de ${E(sA[1])}, ${E(sA[2])} ahorrados y ${E(sA[3])} en un plan de pensiones suman ${E(es.s3.totA)} en activos. Quedan ${E(sP[0])} de hipoteca, ${E(sP[1])} del préstamo del coche y ${E(sP[2])} de tarjeta: ${E(es.s3.totP)} en pasivos. Patrimonio neto: ${E(es.s3.totN)}.

Por qué importa más que el sueldo: los ingresos son lo que entra; el patrimonio, lo que conservas. Sara gana ${E(sS[1])} al año, pero debe ${E(sS[3])} y tiene ${E(sS[2])}: su patrimonio es de ${E(sS[4])}. Jorge gana ${sJ[1] * 2 === sS[1] ? 'la mitad' : E(sJ[1])} y, con ${E(sJ[2])} ahorrados y ${E(sJ[3])} de deuda, tiene un patrimonio de ${E(sJ[4])}.

Si el tuyo es negativo, sobre todo al empezar a trabajar, es normal: los hogares de menores de 35 años son los de menor riqueza neta mediana (Banco de España, Encuesta Financiera de las Familias). Lo que importa es la tendencia. Revísalo cada mes o cada trimestre, siempre el mismo día, y fíjate en cómo evoluciona a lo largo del año. Compárate con quien eras, no con los demás.

FinanziApp tiene una sección de patrimonio neto con un gráfico de su evolución, para que veas la tendencia de un vistazo (gratis 15 días, enlace en la bio).

¿Cada cuánto miras el tuyo? 👇

#patrimonioneto #finanzaspersonales #educacionfinanciera #ahorro #dinero`);
