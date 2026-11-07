// Carrusel educativo: el fondo de emergencia (cuánto, cómo calcularlo, dónde guardarlo).
// Ejemplo en dólares (EE. UU.) y en euros (España). Las sumas se comprueban al cargar.
const { C, icono, barra } = require('../comun');

const T = {
  en: {
    kicker: 'SAVING BASICS', desliza: 'Swipe →',
    s1: { t: 'Your emergency fund: <span class="c">how much do you really need?</span>', l: 'The money that turns a crisis into an inconvenience. Here’s how to size it in 3 steps.', meses: 'months of essential expenses' },
    s2: { t: 'What it’s for (and what it isn’t)',
      si: ['Losing your job', 'A medical bill', 'An urgent car repair', 'A last-minute flight home'], siT: 'Real emergencies',
      no: ['A vacation', 'Holiday gifts', 'A great sale', 'A new phone'], noT: 'Not emergencies' },
    s3: { t: 'Step 1: add up your <span class="c">essentials</span>', l: 'Only what you’d still pay if your income stopped tomorrow.',
      filas: [['Rent', 1200], ['Groceries', 400], ['Utilities & phone', 200], ['Insurance', 250], ['Transportation', 250], ['Minimum debt payments', 200]], total: 'Essentials per month', nota: 'Example numbers. Use last month’s statements.' },
    s4: { t: 'Step 2: pick your <span class="c">target</span>', opciones: [[3, 'Stable job, or two incomes at home'], [6, 'One income, freelance, or kids at home']], mes: 'months' },
    s5: { t: 'Step 3: build it <span class="c">in stages</span>', l: 'A big number feels impossible. Small milestones don’t.',
      hitos: [['Starter fund', 1000], ['1 month', 2500], ['3 months', 7500], ['6 months', 15000]] },
    s6: { t: 'Where to keep it', l: 'Safe, separate and easy to reach, but not too easy.',
      si: [['escudo', 'A high-yield savings account', 'FDIC-insured up to $250,000 per bank'], ['tarro', 'Separate from your checking', 'Out of sight, out of your daily spending']],
      no: [['sube', 'Not in the stock market', 'It can drop right when you need it'], ['tarjeta', 'Not in your checking account', 'Too easy to spend without noticing']] },
    s7: { t: 'How long will it take?', l: 'Goal: 3 months ($7,500). It depends on what you set aside each month:',
      ritmos: [[300], [500], [750]], porMes: '/mo', meses: 'months',
      final: 'Automate it on payday, and refill it every time you use it.' }
  },
  es: {
    kicker: 'AHORRO BÁSICO', desliza: 'Desliza →',
    s1: { t: 'Tu fondo de emergencia: <span class="c">¿cuánto necesitas de verdad?</span>', l: 'El dinero que convierte una crisis en un contratiempo. Así se calcula en 3 pasos.', meses: 'meses de gastos básicos' },
    s2: { t: 'Para qué es (y para qué no)',
      si: ['Quedarte sin trabajo', 'Una factura médica', 'Una avería urgente del coche', 'Un viaje urgente a casa'], siT: 'Emergencias de verdad',
      no: ['Unas vacaciones', 'Regalos de Navidad', 'Una oferta buenísima', 'Un móvil nuevo'], noT: 'No son emergencias' },
    s3: { t: 'Paso 1: suma tus <span class="c">gastos básicos</span>', l: 'Solo lo que seguirías pagando si mañana dejaras de cobrar.',
      filas: [['Alquiler', 800], ['Comida', 350], ['Luz, agua, gas y móvil', 150], ['Seguros', 150], ['Transporte', 150], ['Cuotas mínimas de deudas', 200]], total: 'Gastos básicos al mes', nota: 'Cifras de ejemplo. Usa los movimientos del mes pasado.' },
    s4: { t: 'Paso 2: elige tu <span class="c">objetivo</span>', opciones: [[3, 'Trabajo estable o dos sueldos en casa'], [6, 'Un solo sueldo, autónomo o con hijos']], mes: 'meses' },
    s5: { t: 'Paso 3: constrúyelo <span class="c">por etapas</span>', l: 'Una cifra grande parece imposible. Las metas pequeñas, no.',
      hitos: [['Colchón inicial', 1000], ['1 mes', 1800], ['3 meses', 5400], ['6 meses', 10800]] },
    s6: { t: 'Dónde guardarlo', l: 'Seguro, separado y fácil de usar, pero no demasiado fácil.',
      si: [['escudo', 'Una cuenta remunerada', 'Cubierta por el Fondo de Garantía de Depósitos hasta 100.000 €'], ['tarro', 'Separada de tu cuenta del día a día', 'Fuera de la vista, fuera del gasto diario']],
      no: [['sube', 'No en bolsa', 'Puede bajar justo cuando lo necesitas'], ['tarjeta', 'No en tu cuenta corriente', 'Demasiado fácil gastarlo sin darte cuenta']] },
    s7: { t: '¿Cuánto vas a tardar?', l: 'Objetivo: 3 meses (5.400 €). Depende de lo que apartes cada mes:',
      ritmos: [[200], [300], [450]], porMes: '/mes', meses: 'meses',
      final: 'Automatízalo el día de cobro y repónlo cada vez que lo uses.' }
  }
};

const agrupar = (n, sep) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, sep);
const dinero = (n, lang) => (lang === 'en' ? '$' + agrupar(n, ',') : agrupar(n, '.') + ' €');
// Comprobaciones: los gastos suman lo que dicen los hitos y el objetivo.
for (const lang of ['en', 'es']) {
  const t = T[lang], mes = t.s3.filas.reduce((s, [, v]) => s + v, 0);
  if (t.s5.hitos[1][1] !== mes || t.s5.hitos[2][1] !== 3 * mes || t.s5.hitos[3][1] !== 6 * mes) throw new Error('fondo-de-emergencia: cifras incoherentes ' + lang);
  t.mes = mes;
}

const fondo = (c) => c + '26';
const ok = '<path d="m5 12.5 4.5 4.5L19 7.5"/>', ko = '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>';
const marca = (d, color) => `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;

module.exports = {
  slug: 'fondo-de-emergencia',
  T,
  diapositivas: [
    (t) => `<h1 class="grande">${t.s1.t}</h1><p class="lead">${t.s1.l}</p>
      <div class="tarjeta" style="margin-top:60px;padding:44px 40px">
        <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:12px">${[1, 2, 3, 4, 5, 6].map(i =>
          `<div style="height:120px;border-radius:16px;${i <= 3 ? `background:${C.necesidades}` : `border:3px dashed ${C.necesidades}88`};display:flex;align-items:flex-end;justify-content:center;padding-bottom:12px;font-size:26px;font-weight:800;color:${i <= 3 ? '#04111c' : C.acento}">${i}</div>`).join('')}</div>
        <div style="margin-top:22px;font-size:30px;font-weight:700"><span style="color:${C.acento}">3–6</span> <span style="color:${C.texto};font-weight:550">${t.s1.meses}</span></div></div>`,
    (t) => `<h1>${t.s2.t}</h1>
      <div style="margin-top:52px;display:grid;grid-template-columns:1fr 1fr;gap:20px">
        ${[[t.s2.siT, t.s2.si, C.necesidades, ok], [t.s2.noT, t.s2.no, '#e66767', ko]].map(([tit, lista, color, d]) => `<div class="tarjeta" style="padding:30px 28px">
          <div style="font-size:24px;font-weight:800;letter-spacing:.06em;color:${color};margin-bottom:18px">${tit.toUpperCase()}</div>
          ${lista.map(x => `<div style="display:flex;gap:14px;align-items:center;padding:14px 0;border-top:1px solid ${C.borde};font-size:29px;font-weight:600">${marca(d, color)}<span>${x}</span></div>`).join('')}</div>`).join('')}
      </div>`,
    (t, lang) => `<h1>${t.s3.t}</h1><p class="lead">${t.s3.l}</p>
      <div class="tarjeta" style="margin-top:44px">${t.s3.filas.map(([a, v]) => `<div class="fila"><span class="eti">${a}</span><span class="val">${dinero(v, lang)}</span></div>`).join('')}
        <div class="fila" style="border-top:2px solid ${C.necesidades};margin-top:6px;padding-top:22px"><span class="eti" style="color:${C.tinta};font-weight:700">${t.s3.total}</span><span class="val" style="color:${C.acento};font-size:46px">${dinero(t.mes, lang)}</span></div>
      </div><p class="nota">${t.s3.nota}</p>`,
    (t, lang) => `<h1>${t.s4.t}</h1>
      <div style="margin-top:56px;display:flex;flex-direction:column;gap:22px">${t.s4.opciones.map(([m, desc]) => `<div class="tarjeta">
        <div style="display:flex;justify-content:space-between;align-items:baseline"><span style="font-size:36px;font-weight:800">${m} ${t.s4.mes}</span><span style="font-size:52px;font-weight:800;letter-spacing:-.03em;color:${C.acento}">${dinero(m * t.mes, lang)}</span></div>
        <div style="margin:18px 0 20px">${barra([{ valor: m, color: C.necesidades }, { valor: 6 - m || 0.0001, color: 'rgba(148,163,184,.14)' }], { alto: 28, radio: 10 })}</div>
        <div style="font-size:28px;color:${C.texto}">${desc}</div></div>`).join('')}</div>`,
    (t, lang) => `<h1>${t.s5.t}</h1><p class="lead">${t.s5.l}</p>
      <div style="margin-top:56px;position:relative;padding-left:78px">
        <div style="position:absolute;left:19px;top:20px;bottom:20px;width:4px;border-radius:2px;background:linear-gradient(${C.necesidades},rgba(15,159,143,.25))"></div>
        ${t.s5.hitos.map(([a, v], i) => `<div style="position:relative;display:flex;justify-content:space-between;align-items:center;padding:22px 0">
          <span style="position:absolute;left:-80px;width:46px;height:46px;border-radius:50%;background:${i === 0 ? C.necesidades : C.fondo};border:4px solid ${C.necesidades};"></span>
          <span style="font-size:32px;font-weight:700">${a}</span><span style="font-size:36px;font-weight:800;font-variant-numeric:tabular-nums;color:${i === 0 ? C.acento : C.tinta}">${dinero(v, lang)}</span></div>`).join('')}
      </div>`,
    (t) => `<h1>${t.s6.t}</h1><p class="lead">${t.s6.l}</p>
      <div style="margin-top:44px;display:flex;flex-direction:column;gap:16px">
        ${t.s6.si.map(([ic, a, b]) => `<div class="item"><span class="ic" style="background:${fondo(C.necesidades)}">${icono(ic, C.necesidades, 42)}</span><span>${a}<small>${b}</small></span></div>`).join('')}
        ${t.s6.no.map(([ic, a, b]) => `<div class="item" style="opacity:.92"><span class="ic" style="background:rgba(230,103,103,.15)">${icono(ic, '#e66767', 42)}</span><span>${a}<small>${b}</small></span></div>`).join('')}
      </div>`,
    (t, lang) => `<h1>${t.s7.t}</h1><p class="lead">${t.s7.l}</p>
      <div class="tarjeta" style="margin-top:44px">${t.s7.ritmos.map(([r]) => { const meses = Math.ceil(3 * t.mes / r); return `<div style="padding:16px 0">
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:12px"><span style="font-size:32px;font-weight:700;font-variant-numeric:tabular-nums">${dinero(r, lang)}${t.s7.porMes}</span><span style="font-size:34px;font-weight:800;color:${C.acento}">${meses} ${t.s7.meses}</span></div>
        ${barra([{ valor: meses, color: C.necesidades }, { valor: 30 - meses, color: 'rgba(148,163,184,.12)' }], { alto: 22, radio: 8 })}</div>`; }).join('')}</div>
      <p class="lead" style="margin-top:36px"><b>${t.s7.final}</b></p>`
  ],
  texto: {
    en: `An emergency fund is the money that turns a crisis into an inconvenience. Here's how to size yours. 🛟

1️⃣ Add up your essentials: only what you'd still pay if your income stopped (rent, groceries, utilities, insurance, transportation, minimum debt payments). In our example that's $2,500 a month.

2️⃣ Pick a target: 3 months if your job is stable or there are two incomes at home ($7,500), 6 months if you have one income, freelance or have kids ($15,000).

3️⃣ Build it in stages: $1,000 first for small surprises, then 1 month, 3 months, 6 months.

Where to keep it: a high-yield savings account, separate from your checking. FDIC insurance covers up to $250,000 per depositor, per bank. Not in the stock market: it can drop right when you need the money.

How long? Saving $300 a month, 3 months of essentials takes 25 months. At $500 a month, 15.

Automate it on payday, and refill it every time you use it.

FinanziApp shows how many months your savings cover, so you always know where you stand (free for 15 days, link in bio).

#emergencyfund #personalfinance #savingmoney #moneytips #financialliteracy`,
    es: `Un fondo de emergencia es el dinero que convierte una crisis en un contratiempo. Así se calcula el tuyo. 🛟

1️⃣ Suma tus gastos básicos: solo lo que seguirías pagando si dejaras de cobrar (vivienda, comida, suministros, seguros, transporte y cuotas mínimas de deudas). En nuestro ejemplo, 1.800 € al mes.

2️⃣ Elige tu objetivo: 3 meses si tu trabajo es estable o hay dos sueldos en casa (5.400 €), 6 meses si hay un solo sueldo, eres autónomo o tienes hijos (10.800 €).

3️⃣ Constrúyelo por etapas: primero 1.000 € para imprevistos pequeños, luego 1 mes, 3 meses y 6 meses.

Dónde guardarlo: en una cuenta remunerada, separada de la del día a día. El Fondo de Garantía de Depósitos cubre hasta 100.000 € por titular y entidad. No en bolsa: puede bajar justo cuando necesites el dinero.

¿Cuánto tardarás? Apartando 200 € al mes, 3 meses de gastos básicos son 27 meses. Con 300 € al mes, 18.

Automatízalo el día de cobro y repónlo cada vez que lo uses.

FinanziApp te dice cuántos meses cubren tus ahorros, para que siempre sepas dónde estás (gratis 15 días, enlace en la bio).

#fondodeemergencia #finanzaspersonales #ahorro #educacionfinanciera #colchonfinanciero`
  }
};
