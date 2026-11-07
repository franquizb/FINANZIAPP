// Carrusel educativo: métodos de presupuesto más allá del 50/30/20 (sobres,
// base cero y págate primero). Un mismo hogar de ejemplo en todo el carrusel:
// inglés en dólares (EE. UU.), español en euros (España). Las cifras se
// calculan y se comprueban aquí al cargar.
const { C, icono, barra } = require('../comun');

const ROJO = '#e66767';
const agrupar = (n, sep) => String(Math.round(Math.abs(n))).replace(/\B(?=(\d{3})+(?!\d))/g, sep);
const dinero = (n, lang) => (n < 0 ? '−' : '') + (lang === 'en' ? '$' + agrupar(n, ',') : agrupar(n, '.') + ' €');
const plano = (s) => s.replace(/ /g, ' ');
// Une las dos últimas palabras con un espacio de no separación (evita palabras sueltas en la última línea).
const nb = (s) => s.replace(/ (?=(?:<[^>]*>)?[^ <>]*(?:<\/[^>]+>)?$)/, ' ');
const fondo = (c) => c + '26';

// Iconos propios con el mismo trazo que los de comun.js.
const DIBUJOS = {
  sobre: '<rect x="3" y="5.5" width="18" height="13" rx="2.2"/><path d="m3.8 7.2 8.2 6 8.2-6"/>',
  cero: '<path d="M4.5 9.5h5.5M4.5 14.5h5.5"/><ellipse cx="16.2" cy="12" rx="3.3" ry="5.2"/>'
};
const ico = (nombre, color, tam = 40) => DIBUJOS[nombre]
  ? `<svg width="${tam}" height="${tam}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${DIBUJOS[nombre]}</svg>`
  : icono(nombre, color, tam);
const M = { sobres: ['sobre', C.caprichos], cero: ['cero', C.necesidades], primero: ['tarro', C.ahorro] };

const T = {
  en: {
    kicker: 'BUDGETING BASICS', desliza: 'Swipe →',
    nombre: { sobres: 'Envelopes', cero: 'Zero‑based', primero: 'Pay yourself first' },
    s1: { t: '3 budgeting methods <span class="c">beyond 50/30/20</span>', l: 'If one system didn’t click for you, another might. How each one works, and who it suits.',
      desc: { sobres: 'Money per category', cero: 'Every dollar has a job', primero: 'Save before you spend' } },
    s2: { t: 'The <span class="c">envelope</span> method', l: 'Each spending category gets its own envelope. When one is empty, that category is done for the month.',
      dia: 'Day 20 of the month', queda: 'left', de: (x) => `of ${x}`, vacio: 'Empty: stop, or move money from another envelope',
      gastado: { Groceries: 280, Transportation: 120, 'Eating out & fun': 300 },
      digital: ['Digital envelopes', 'Same idea without cash: separate savings accounts, or categories in a budgeting app'] },
    s3: { t: 'Zero‑based <span class="c">budgeting</span>', l: 'Before the month starts, give every dollar a job, until income minus your plan equals zero.',
      ingreso: 'Monthly take‑home pay', resto: 'Left to assign',
      nota: 'Zero doesn’t mean spending it all: savings and debt get their dollars too. The method comes from business budgeting (Peter Pyhrr, Harvard Business Review, 1970).' },
    s4: { t: 'Pay <span class="c">yourself first</span>', l: 'On payday, move your savings out first, automatically. Then live on what’s left.',
      orden: [['Usual order', ['Income', 'Spend', 'Save what’s left']], ['Pay yourself first', ['Income', 'Save', 'Spend what’s left']]],
      ahorro: 'Savings, moved on payday', resto: 'Bills and spending',
      nota: 'The idea goes back at least to George S. Clason’s “The Richest Man in Babylon” (1926): “A part of all you earn is yours to keep.”' },
    s5: { t: 'Pros and <span class="c">cons</span>',
      pc: { sobres: ['Hard to overspend: when it’s gone, it’s gone', 'Cash is less practical, and bills don’t fit in envelopes'],
        cero: ['You know where every dollar goes', 'Takes the most time: a new plan every month'],
        primero: ['Low effort: saving happens automatically', 'Doesn’t tell you how to spend the rest'] } },
    s6: { t: 'Which one <span class="c">suits you?</span>',
      si: [['sobres', 'Your day‑to‑day spending tends to run over'], ['cero', 'You like detail and want a plan for every dollar'], ['primero', 'You want something simple, and saving comes first']],
      final: 'They also combine well: pay yourself first, then use envelopes for groceries and fun.' },
    s7: { t: 'Try one for <span class="c">30 days</span>',
      items: [['Pick the one for your biggest problem', 'Overspending, no plan, or no savings'], ['Set it up on payday', 'Envelopes, a zero‑based plan or an automatic transfer'], ['Review it after a month', 'What worked, and what felt hard?'], ['Keep it, adjust it or switch', 'The best method is the one you’ll stick with']] },
    ej: {
      ingreso: 3200,
      plan: [['Rent', 1250], ['Groceries', 450], ['Bills & phone', 250], ['Transportation', 200], ['Eating out & fun', 300], ['Extra debt payment', 250], ['Savings', 500]],
      sobres: ['Groceries', 'Transportation', 'Eating out & fun'], ahorro: 'Savings'
    }
  },
  es: {
    kicker: 'PRESUPUESTO BÁSICO', desliza: 'Desliza →',
    nombre: { sobres: 'Sobres', cero: 'Base cero', primero: 'Págate primero' },
    s1: { t: '3 métodos de presupuesto <span class="c">más allá del 50/30/20</span>', l: 'Si un sistema no te ha funcionado, quizá otro sí. Cómo funciona cada uno y a quién le va mejor.',
      desc: { sobres: 'Dinero por categoría', cero: 'Cada euro tiene una tarea', primero: 'Ahorra antes de gastar' } },
    s2: { t: 'El método de los <span class="c">sobres</span>', l: 'Cada categoría de gasto tiene su sobre. Cuando uno se vacía, esa categoría se acaba hasta el mes siguiente.',
      dia: 'Día 20 del mes', queda: 'quedan', de: (x) => `de ${x}`, vacio: 'Vacío: para, o pasa dinero de otro sobre',
      gastado: { Comida: 210, Transporte: 70, 'Ocio y comer fuera': 200 },
      digital: ['Sobres digitales', 'La misma idea sin efectivo: cuentas de ahorro separadas o categorías en una app de presupuesto'] },
    s3: { t: 'Presupuesto <span class="c">base cero</span>', l: 'Antes de que empiece el mes, da una tarea a cada euro, hasta que ingresos menos plan sea cero.',
      ingreso: 'Ingresos netos del mes', resto: 'Sin asignar',
      nota: 'Cero no significa gastarlo todo: el ahorro y las deudas también reciben sus euros. El método viene de la gestión de empresas (Peter Pyhrr, Harvard Business Review, 1970).' },
    s4: { t: 'Págate <span class="c">primero</span>', l: 'El día de cobro, aparta primero tu ahorro, de forma automática. Después, vive con lo que queda.',
      orden: [['Lo habitual', ['Cobras', 'Gastas', 'Ahorras lo que sobra']], ['Págate primero', ['Cobras', 'Ahorras', 'Gastas lo que queda']]],
      ahorro: 'Ahorro, apartado el día de cobro', resto: 'Recibos y gastos',
      nota: 'La idea ya aparece en «El hombre más rico de Babilonia», de George S. Clason (1926): guarda para ti una parte de todo lo que ganas.' },
    s5: { t: 'Pros y <span class="c">contras</span>',
      pc: { sobres: ['Difícil pasarse: cuando se acaba, se acaba', 'El efectivo es menos práctico y los recibos no caben en un sobre'],
        cero: ['Sabes a dónde va cada euro', 'Lleva más tiempo: un plan nuevo cada mes'],
        primero: ['Poco esfuerzo: el ahorro se hace solo', 'No te dice cómo gastar el resto'] } },
    s6: { t: '¿Cuál te <span class="c">va mejor?</span>',
      si: [['sobres', 'Tu gasto del día a día suele pasarse'], ['cero', 'Te gusta el detalle y quieres un plan para cada euro'], ['primero', 'Quieres algo sencillo y lo primero es ahorrar']],
      final: 'También se combinan bien: págate primero y usa sobres para la comida y el ocio.' },
    s7: { t: 'Prueba uno <span class="c">30 días</span>',
      items: [['Elige el que ataca tu mayor problema', 'Gastar de más, no tener plan o no ahorrar'], ['Prepáralo el día de cobro', 'Sobres, un plan base cero o una transferencia automática'], ['Revísalo al cabo de un mes', '¿Qué funcionó y qué te costó?'], ['Mantenlo, ajústalo o cambia', 'El mejor método es el que puedes mantener']] },
    ej: {
      ingreso: 2200,
      plan: [['Alquiler', 800], ['Comida', 350], ['Facturas y móvil', 180], ['Transporte', 120], ['Ocio y comer fuera', 200], ['Deudas (pago extra)', 150], ['Ahorro', 400]],
      sobres: ['Comida', 'Transporte', 'Ocio y comer fuera'], ahorro: 'Ahorro'
    }
  }
};

// Cálculos y comprobaciones: el plan base cero suma exactamente los ingresos, y los
// sobres y el «págate primero» salen de ese mismo plan.
for (const lang of ['en', 'es']) {
  const t = T[lang], e = t.ej, fallo = (m) => { throw new Error(`metodos-presupuesto (${lang}): ${m}`); };
  const importe = (n) => { const f = e.plan.find(([x]) => x === n); if (!f) fallo('falta en el plan: ' + n); return f[1]; };
  e.asignado = e.plan.reduce((s, [, v]) => s + v, 0); e.resto = e.ingreso - e.asignado;
  if (e.resto !== 0) fallo(`el plan base cero no suma los ingresos (${e.asignado} de ${e.ingreso})`);
  e.env = e.sobres.map(n => { const tope = importe(n), gastado = t.s2.gastado[n]; if (gastado == null || gastado > tope) fallo('sobre ' + n); return [n, tope, gastado, tope - gastado]; });
  if (!e.env.some(s => s[3] === 0)) fallo('falta un sobre vacío para ilustrar la regla');
  e.ahorroMes = importe(e.ahorro); e.restoPrimero = e.ingreso - e.ahorroMes;
}

const marca = (d, color) => `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.6" stroke-linecap="round">${d}</svg>`;
const MAS = '<path d="M12 5.5v13M5.5 12h13"/>', MENOS = '<path d="M5.5 12h13"/>';
const caja = (m, tam = 76, ic = 42) => `<span style="flex:0 0 auto;width:${tam}px;height:${tam}px;border-radius:20px;background:${fondo(M[m][1])};display:inline-flex;align-items:center;justify-content:center">${ico(M[m][0], M[m][1], ic)}</span>`;
const flecha = `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="${C.suave}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`;

module.exports = {
  slug: 'metodos-presupuesto',
  T,
  diapositivas: [
    // 1 · Portada
    (t) => `<h1 class="grande">${t.s1.t}</h1><p class="lead">${nb(t.s1.l)}</p>
      <div class="tarjeta" style="margin-top:60px;padding:8px 36px">${['sobres', 'cero', 'primero'].map((m, i) => `<div style="display:flex;align-items:center;gap:28px;padding:24px 0;${i ? `border-top:1px solid ${C.borde}` : ''}">
        ${caja(m, 92, 52)}<div><div style="font-size:34px;font-weight:750">${t.nombre[m]}</div><div style="font-size:28px;color:${C.suave};margin-top:6px">${t.s1.desc[m]}</div></div></div>`).join('')}</div>`,
    // 2 · Sobres
    (t, lang) => `<h1>${t.s2.t}</h1><p class="lead">${nb(t.s2.l)}</p>
      <div class="tarjeta" style="margin-top:40px;padding:28px 34px 12px">
        <div style="font-size:23px;font-weight:800;letter-spacing:.08em;color:${C.suave};margin-bottom:6px">${t.s2.dia.toUpperCase()}</div>
        ${t.ej.env.map(([n, tope, , queda], i) => `<div style="display:grid;grid-template-columns:76px 1fr 215px;gap:22px;align-items:center;padding:18px 0;${i ? `border-top:1px solid ${C.borde}` : ''}">
          ${caja('sobres')}
          <div><div style="font-size:30px;font-weight:650">${n}</div>
            <div style="margin-top:12px;height:12px;border-radius:6px;background:rgba(148,163,184,.16);position:relative">${queda ? `<span style="position:absolute;left:0;top:0;bottom:0;width:${(queda / tope * 100).toFixed(1)}%;border-radius:6px;background:${C.caprichos}"></span>` : ''}</div>
            ${queda ? '' : `<div style="font-size:25px;color:${ROJO};margin-top:8px;font-weight:600">${nb(t.s2.vacio)}</div>`}</div>
          <div style="text-align:right"><div style="font-size:36px;font-weight:800;font-variant-numeric:tabular-nums;color:${queda ? C.tinta : ROJO}">${dinero(queda, lang)}<span style="font-size:24px;font-weight:600;color:${C.suave}"> ${t.s2.queda}</span></div>
            <div style="font-size:24px;color:${C.suave};margin-top:4px">${t.s2.de(dinero(tope, lang))}</div></div></div>`).join('')}
      </div>
      <div class="item" style="margin-top:18px">${caja('sobres')}<span>${t.s2.digital[0]}<small>${nb(t.s2.digital[1])}</small></span></div>`,
    // 3 · Base cero
    (t, lang) => { const e = t.ej; return `<h1>${t.s3.t}</h1><p class="lead">${nb(t.s3.l)}</p>
      <div class="tarjeta" style="margin-top:40px;padding:30px 36px 26px">
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:18px"><span style="font-size:30px;font-weight:650;color:${C.texto}">${t.s3.ingreso}</span><span style="font-size:40px;font-weight:800;font-variant-numeric:tabular-nums">${dinero(e.ingreso, lang)}</span></div>
        ${barra(e.plan.map(([, v]) => ({ valor: v, color: C.necesidades })), { alto: 40, radio: 12 })}
        <div style="display:grid;grid-template-columns:1fr 1fr;column-gap:36px;margin-top:14px">${e.plan.map(([n, v]) => `<div style="display:flex;justify-content:space-between;align-items:baseline;padding:12px 0;border-bottom:1px solid ${C.borde};font-size:27px">
          <span style="display:flex;align-items:center;gap:12px;color:${C.texto}"><span class="punto" style="background:${C.necesidades};width:12px;height:12px;border-radius:4px"></span>${n}</span><span style="font-weight:700;font-variant-numeric:tabular-nums">${dinero(v, lang)}</span></div>`).join('')}</div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:20px">
          <span><span style="display:block;font-size:31px;font-weight:750">${t.s3.resto}</span><span style="display:block;font-size:26px;color:${C.suave};margin-top:4px;font-variant-numeric:tabular-nums">${dinero(e.ingreso, lang)} − ${dinero(e.asignado, lang)}</span></span>
          <span style="font-size:58px;font-weight:800;letter-spacing:-.03em;color:${C.acento}">${dinero(e.resto, lang)}</span></div>
      </div><p class="nota">${nb(t.s3.nota)}</p>`; },
    // 4 · Págate primero
    (t, lang) => { const e = t.ej; return `<h1>${t.s4.t}</h1><p class="lead">${nb(t.s4.l)}</p>
      <div class="tarjeta" style="margin-top:40px;padding:26px 34px">${t.s4.orden.map(([tit, pasos], k) => `<div style="padding:16px 0;${k ? `border-top:1px solid ${C.borde}` : ''}">
        <div style="font-size:23px;font-weight:800;letter-spacing:.08em;color:${k ? C.ahorro : C.suave};margin-bottom:14px">${tit.toUpperCase()}</div>
        <div style="display:flex;align-items:center;gap:12px">${pasos.map((p, i) => { const destaca = k === 1 && i === 1; return `${i ? flecha : ''}<span style="padding:12px 18px;border-radius:14px;font-size:27px;font-weight:650;white-space:nowrap;${destaca ? `background:${C.ahorro};color:#fff` : `border:1.5px solid ${C.borde};color:${C.texto}`}">${p}</span>`; }).join('')}</div></div>`).join('')}</div>
      <div class="tarjeta" style="margin-top:18px;padding:30px 34px">
        ${barra([{ valor: e.ahorroMes, color: C.ahorro }, { valor: e.restoPrimero, color: 'rgba(148,163,184,.32)' }], { alto: 40, radio: 12 })}
        <div style="display:flex;justify-content:space-between;gap:20px;margin-top:18px">
          <div><div style="font-size:40px;font-weight:800;color:${C.tinta};font-variant-numeric:tabular-nums">${dinero(e.ahorroMes, lang)}</div><div style="font-size:26px;color:${C.texto};margin-top:4px;display:flex;align-items:center;gap:10px"><span class="punto" style="background:${C.ahorro}"></span>${t.s4.ahorro}</div></div>
          <div style="text-align:right"><div style="font-size:40px;font-weight:800;color:${C.tinta};font-variant-numeric:tabular-nums">${dinero(e.restoPrimero, lang)}</div><div style="font-size:26px;color:${C.texto};margin-top:4px">${t.s4.resto}</div></div></div>
      </div><p class="nota">${nb(t.s4.nota)}</p>`; },
    // 5 · Ventajas e inconvenientes
    (t) => `<h1>${t.s5.t}</h1>
      <div style="margin-top:48px;display:flex;flex-direction:column;gap:18px">${['sobres', 'cero', 'primero'].map(m => `<div class="tarjeta" style="padding:26px 32px">
        <div style="display:flex;align-items:center;gap:18px;margin-bottom:8px">${caja(m, 60, 34)}<span style="font-size:32px;font-weight:750">${t.nombre[m]}</span></div>
        ${[[MAS, C.acento, t.s5.pc[m][0]], [MENOS, ROJO, t.s5.pc[m][1]]].map(([d, col, txt]) => `<div style="display:flex;gap:14px;align-items:flex-start;padding:10px 0 2px;font-size:28px;line-height:1.35;color:${C.texto}"><span style="flex:0 0 auto;margin-top:2px">${marca(d, col)}</span><span>${nb(txt)}</span></div>`).join('')}</div>`).join('')}</div>`,
    // 6 · Cuál te va mejor
    (t) => `<h1>${t.s6.t}</h1>
      <div style="margin-top:48px;display:flex;flex-direction:column;gap:18px">${t.s6.si.map(([m, txt]) => `<div class="tarjeta" style="padding:28px 32px">
        <div style="font-size:31px;font-weight:650;line-height:1.35">${nb(txt)}</div>
        <div style="display:flex;align-items:center;gap:14px;margin-top:16px">${flecha}${caja(m, 52, 30)}<span style="font-size:30px;font-weight:800;color:${C.tinta}">${t.nombre[m]}</span></div></div>`).join('')}</div>
      <p class="lead" style="margin-top:36px"><b>${nb(t.s6.final)}</b></p>`,
    // 7 · Prueba uno 30 días
    (t) => `<h1>${t.s7.t}</h1>
      <div style="margin-top:48px;display:flex;flex-direction:column;gap:16px">${t.s7.items.map(([a, b], i) => `<div class="item"><span class="ic" style="background:${fondo(C.necesidades)};font-size:30px;font-weight:800;color:${C.acento}">${i + 1}</span><span>${a}<small>${b}</small></span></div>`).join('')}</div>`
  ],
  texto: {}
};

const D = (n) => plano(dinero(n, 'en')), E = (n) => plano(dinero(n, 'es'));
const en = T.en.ej, es = T.es.ej;
const lista = (plan, f, y) => plan.map(([n, v], i) => `${i === plan.length - 1 ? y + ' ' : ''}${n[0].toLowerCase() + n.slice(1)} ${f(v)}`).join(', ').replace(/, (and|y) /, ` $1 `);
module.exports.texto.en = `If 50/30/20 didn't click for you, here are three other ways to budget, and who each one suits.

✉️ Envelopes: each spending category gets its own envelope, in cash or as digital envelopes (separate savings accounts or categories in a budgeting app). When one is empty, that category is done for the month, or you consciously move money from another envelope. It suits you if day-to-day spending tends to run over.

Zero-based budgeting: before the month starts, give every dollar a job until income minus your plan equals zero. With ${D(en.ingreso)} of take-home pay: ${lista(en.plan, D, 'and')}. That's ${D(en.asignado)}, so ${D(en.resto)} left to assign. Zero doesn't mean spending it all: savings and debt get their dollars too. The method comes from business budgeting (Peter Pyhrr, Harvard Business Review, 1970).

Pay yourself first: on payday, move your savings out automatically, then live on what's left. In the same example, ${D(en.ahorroMes)} goes to savings and ${D(en.restoPrimero)} is left for bills and spending. The idea goes back at least to George S. Clason's "The Richest Man in Babylon" (1926): "A part of all you earn is yours to keep."

Pros and cons: envelopes make it hard to overspend, but cash is less practical. Zero-based gives you the most control, and takes the most time. Pay yourself first is low effort, but doesn't tell you how to spend the rest. They also combine well: pay yourself first, then use envelopes for groceries and fun.

Pick the one that fixes your biggest problem, try it for 30 days and adjust. The best method is the one you'll stick with.

Whichever you choose, FinanziApp lets you set a budget by category and track it month by month (free for 15 days, link in bio).

#budgeting #personalfinance #moneytips #financialliteracy #budgetingtips`;
module.exports.texto.es = `Si el 50/30/20 no te ha funcionado, aquí tienes otras tres formas de hacer un presupuesto, y a quién le va mejor cada una.

✉️ Sobres: cada categoría de gasto tiene su sobre, en efectivo o en sobres digitales (cuentas de ahorro separadas o categorías en una app de presupuesto). Cuando uno se vacía, esa categoría se acaba hasta el mes siguiente, o pasas dinero de otro sobre de forma consciente. Te va bien si tu gasto del día a día suele pasarse.

Presupuesto base cero: antes de que empiece el mes, da una tarea a cada euro hasta que ingresos menos plan sea cero. Con ${E(es.ingreso)} netos al mes: ${lista(es.plan, E, 'y')}. Suman ${E(es.asignado)}, así que quedan ${E(es.resto)} sin asignar. Cero no significa gastarlo todo: el ahorro y las deudas también reciben sus euros. El método viene de la gestión de empresas (Peter Pyhrr, Harvard Business Review, 1970).

Págate primero: el día de cobro, aparta tu ahorro de forma automática y vive con lo que queda. En el mismo ejemplo, ${E(es.ahorroMes)} van al ahorro y quedan ${E(es.restoPrimero)} para recibos y gastos. La idea ya aparece en «El hombre más rico de Babilonia», de George S. Clason (1926): guarda para ti una parte de todo lo que ganas.

Pros y contras: con los sobres es difícil pasarse, pero el efectivo es menos práctico. El base cero da el mayor control y lleva más tiempo. Págate primero cuesta poco esfuerzo, pero no te dice cómo gastar el resto. Y se combinan bien: págate primero y usa sobres para la comida y el ocio.

Elige el que ataca tu mayor problema, pruébalo 30 días y ajusta. El mejor método es el que puedes mantener.

Elijas el que elijas, en FinanziApp puedes hacer un presupuesto por categorías y seguirlo mes a mes (gratis 15 días, enlace en la bio).

#finanzaspersonales #presupuesto #ahorro #educacionfinanciera #organizacionfinanciera`;
