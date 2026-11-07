// Carrusel educativo: objetivos de ahorro con una hucha por meta (sinking funds).
// Cifras de ejemplo: inglés en dólares (EE. UU.), español en euros (España).
// Cuota = objetivo ÷ meses; las sumas y los porcentajes se comprueban al cargar.
const { C, icono, barra } = require('../comun');

const T = {
  en: {
    kicker: 'SAVING BASICS', desliza: 'Swipe →',
    s1: { t: 'Give every goal <span class="c">its&nbsp;own&nbsp;pot</span>', l: 'A simple way to pay for big, expected expenses without debt or last‑minute stress.', de: 'of' },
    s2: { t: 'A big bill, <span class="c">split into small&nbsp;ones</span>', l: 'A sinking fund is money you set aside each month for an expense you know is coming.',
      sin: 'Without a plan', sinV: 'once a year', con: 'With a sinking fund', conV: 'a month',
      final: 'Expected expenses aren’t emergencies. They’re bills you haven’t divided yet.' },
    s3: { t: 'Why <span class="c">one pot per&nbsp;goal</span>&nbsp;works', una: 'One account', unaV: 'but what is it for?', tres: 'Three pots',
      razones: [['marcador', 'Every dollar has a job'], ['barras', 'You see each goal’s progress'], ['escudo', 'The trip money won’t pay for the repair']] },
    s4: { t: 'How much to save <span class="c">each&nbsp;month</span>', l: 'Two numbers: what the goal costs, and how many months until you need it.',
      meta: 'goal', meses: 'months', alMes: 'a month', yaT: 'Already saved some? Subtract it first:', ya: 500,
      nota: 'Use a real price: a quote, last year’s bill or a quick booking search.' },
    s5: { t: 'Example: <span class="c">3 goals</span>, one&nbsp;plan', cab: ['Goal', 'Target', 'Months', 'Monthly'], total: 'Total per month',
      nota: 'Example numbers. Use your own goals and dates.' },
    s6: { t: 'Where to keep them', l: 'Safe, separate from your everyday spending, and easy to label.',
      si: [['tarro', 'Named savings buckets', 'Many banks let you split savings into labeled pots'], ['escudo', 'A high‑yield savings account', 'Your pots earn a little interest while they wait']],
      no: [['sube', 'Not in the stock market', 'For goals a few years away or less, a drop could come right when you need it'], ['paraguas', 'Not in your emergency fund', 'That one is for the unexpected. These are for the expected']] },
    s7: { t: 'Make it <span class="c">stick</span>', items: [['Name each pot', '“Lisbon 2027”, not “Savings 2”'], ['Automate it on payday', 'One transfer per pot, the day you get paid'], ['Celebrate milestones', 'Every 25% is progress you can see']],
      hito: (a, b) => `Vacation · ${a} of ${b}`, final: 'Give each expected expense a pot and a monthly&nbsp;amount.' },
    metas: [['Vacation', 'avion', 2000, 10], ['Car insurance', 'coche', 1200, 12], ['Holidays & gifts', 'bolsa', 600, 8]],
    corto: ['Vacation', 'Car', 'Holidays']
  },
  es: {
    kicker: 'AHORRO BÁSICO', desliza: 'Desliza →',
    s1: { t: 'Dale a cada meta <span class="c">su&nbsp;propia&nbsp;hucha</span>', l: 'Una forma sencilla de pagar gastos grandes y previsibles sin deudas ni agobios de última hora.', de: 'de' },
    s2: { t: 'Un gasto grande, <span class="c">en&nbsp;pasos&nbsp;pequeños</span>', l: 'Se trata de apartar cada mes una cantidad para un gasto que sabes que va a llegar.',
      sin: 'Sin planificar', sinV: 'de golpe, una vez al año', con: 'Con una hucha', conV: 'al mes',
      final: 'Los gastos previsibles no son emergencias. Son facturas que aún no has dividido.' },
    s3: { t: 'Por qué funciona <span class="c">una&nbsp;hucha por&nbsp;meta</span>', una: 'Una sola cuenta', unaV: 'pero ¿para qué es?', tres: 'Tres huchas',
      razones: [['marcador', 'Cada euro tiene una tarea'], ['barras', 'Ves cómo avanza cada meta'], ['escudo', 'El dinero del viaje no paga la avería']] },
    s4: { t: 'Cuánto apartar <span class="c">cada&nbsp;mes</span>', l: 'Dos datos: lo que cuesta la meta y cuántos meses faltan hasta que la necesites.',
      meta: 'meta', meses: 'meses', alMes: 'al mes', yaT: '¿Ya tienes algo ahorrado? Réstalo primero:', ya: 300,
      nota: 'Usa un precio real: un presupuesto, el recibo del año pasado o una búsqueda rápida.' },
    s5: { t: 'Ejemplo: <span class="c">3 metas</span>, un&nbsp;plan', cab: ['Meta', 'Objetivo', 'Meses', 'Al mes'], total: 'Total al mes',
      nota: 'Cifras de ejemplo. Usa tus propias metas y fechas.' },
    s6: { t: 'Dónde guardarlas', l: 'Seguras, separadas del gasto del día a día y fáciles de identificar.',
      si: [['tarro', 'Huchas o espacios con nombre', 'Muchos bancos y apps permiten dividir el ahorro así'], ['escudo', 'Una cuenta remunerada', 'Tus huchas generan algo de interés mientras esperan']],
      no: [['sube', 'No en bolsa', 'Para metas a pocos años vista, una caída podría llegar justo cuando lo necesitas'], ['paraguas', 'No en tu fondo de emergencia', 'Ese es para lo imprevisto. Estas huchas, para lo previsto']] },
    s7: { t: 'Que funcione <span class="c">de verdad</span>', items: [['Ponle nombre a cada hucha', '«Lisboa 2027», no «Ahorro 2»'], ['Automatízalo el día de cobro', 'Una transferencia por hucha, el día que cobras'], ['Celebra cada hito', 'Cada 25% es un avance que se ve']],
      hito: (a, b) => `Vacaciones · ${a} de ${b}`, final: 'Dale a cada gasto previsible una hucha y una cantidad al&nbsp;mes.' },
    metas: [['Vacaciones', 'avion', 1500, 10], ['Seguro del coche', 'coche', 600, 12], ['Navidad y regalos', 'bolsa', 400, 8]],
    corto: ['Vacaciones', 'Seguro', 'Navidad']
  }
};

const agrupar = (n, sep) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, sep);
const dinero = (n, lang) => (lang === 'en' ? '$' + agrupar(n, ',') : agrupar(n, '.') + ' €');
const colores = [C.necesidades, C.caprichos, C.ahorro];
const fondo = (c) => c + '26';
const MESES_HOY = 6;   // la portada muestra las huchas tras 6 meses de aportaciones

// Comprobaciones: cada cuota es exacta, el total suma y las huchas no se pasan del objetivo.
for (const lang of ['en', 'es']) {
  const t = T[lang];
  t.cuotas = t.metas.map(([n, , obj, m]) => { if (obj % m) throw new Error(`objetivos-de-ahorro: ${n} no se divide en ${m} meses`); return obj / m; });
  t.totalMes = t.cuotas.reduce((s, v) => s + v, 0);
  t.ahorrado = t.cuotas.map((c, i) => { const v = c * MESES_HOY; if (v > t.metas[i][2]) throw new Error('objetivos-de-ahorro: hucha por encima del objetivo'); return v; });
  t.totalHoy = t.ahorrado.reduce((s, v) => s + v, 0);
  if (t.ahorrado.reduce((s, v, i) => s + (v - t.cuotas[i] * MESES_HOY), 0) !== 0) throw new Error('objetivos-de-ahorro: total incoherente ' + lang);
  // Paso 2: la factura anual (2.ª meta) partida en 12 cuotas iguales.
  if (t.metas[1][3] !== 12) throw new Error('objetivos-de-ahorro: la factura anual debe ser a 12 meses');
  // Paso 4: fórmula con la 1.ª meta, y con lo ya ahorrado.
  const [, , obj, m] = t.metas[0];
  t.s4.cuota = obj / m; t.s4.cuotaYa = (obj - t.s4.ya) / m;
  if (!Number.isInteger(t.s4.cuotaYa) || t.s4.cuota !== t.cuotas[0]) throw new Error('objetivos-de-ahorro: fórmula incoherente ' + lang);
}

// Viñetas de la descripción, sacadas de las mismas cifras de las diapositivas.
const lineas = (lang, en, meses, alMes) => T[lang].metas.map(([n, , obj, m], i) => `• ${n}: ${dinero(obj, lang)} ${en} ${m} ${meses} → ${dinero(T[lang].cuotas[i], lang)} ${alMes}`).join('\n');

const estilo = '<style>@media (max-height:1400px){.item small{font-size:26px}}</style>';

// Tarro de línea con nivel de llenado (dibujo propio, mismo trazo redondeado).
const CUERPO = 'M70 38V52C44 60 30 80 30 108V244Q30 270 56 270H164Q190 270 190 244V108C190 80 176 60 150 52V38Z';
function tarro(pct, color, id) {
  const tope = 270 - pct * (270 - 84);
  return `<svg width="100%" viewBox="0 0 220 284" style="display:block">
    <defs><clipPath id="${id}"><path d="${CUERPO}"/></clipPath></defs>
    <rect x="60" y="10" width="100" height="26" rx="8" fill="${color}" fill-opacity=".3" stroke="${color}" stroke-width="5"/>
    <rect x="0" y="${tope.toFixed(1)}" width="220" height="${(284 - tope).toFixed(1)}" fill="${color}" clip-path="url(#${id})"/>
    <path d="${CUERPO}" fill="none" stroke="${color}" stroke-width="6" stroke-linejoin="round"/>
    <text x="110" y="248" text-anchor="middle" font-size="40" font-weight="800" fill="#04111c">${Math.round(pct * 100)}%</text></svg>`;
}

const tituloFila = (a, b) => `<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:14px"><span style="font-size:28px;font-weight:700;color:${C.texto}">${a}</span><span style="font-size:30px;font-weight:800;font-variant-numeric:tabular-nums">${b}</span></div>`;

module.exports = {
  slug: 'objetivos-de-ahorro',
  T,
  diapositivas: [
    // 1 · Portada: tres huchas a medio llenar (tras 6 meses de aportaciones)
    (t, lang) => `<h1 class="grande">${t.s1.t}</h1><p class="lead">${t.s1.l}</p>
      <div class="tarjeta" style="margin-top:56px;padding:40px 36px 34px;display:grid;grid-template-columns:repeat(3,1fr);gap:26px">
        ${t.metas.map(([n, , obj], i) => `<div style="text-align:center">
          <div style="padding:0 18px">${tarro(t.ahorrado[i] / obj, colores[i], 'tarro' + i)}</div>
          <div style="margin-top:16px;font-size:28px;font-weight:700">${t.corto[i]}</div>
          <div style="margin-top:4px;font-size:26px;color:${C.suave};font-variant-numeric:tabular-nums">${dinero(t.ahorrado[i], lang)} ${t.s1.de} ${dinero(obj, lang)}</div></div>`).join('')}
      </div>`,
    // 2 · Qué es: una factura anual partida en 12 pasos
    (t, lang) => { const [, , obj, m] = t.metas[1]; return `<h1>${t.s2.t}</h1><p class="lead">${t.s2.l}</p>
      <div class="tarjeta" style="margin-top:48px;padding:38px 36px">
        <div style="font-size:26px;font-weight:800;letter-spacing:.06em;color:${C.suave};margin-bottom:26px">${t.metas[1][0].toUpperCase()}</div>
        ${tituloFila(t.s2.sin, `${dinero(obj, lang)} <span style="font-size:26px;color:${C.suave};font-weight:600">${t.s2.sinV}</span>`)}
        ${barra([{ valor: 1, color: '#e66767' }], { alto: 44, radio: 10 })}
        <div style="height:36px"></div>
        ${tituloFila(t.s2.con, `${m} × ${dinero(obj / m, lang)} <span style="font-size:26px;color:${C.suave};font-weight:600">${t.s2.conV}</span>`)}
        ${barra(Array.from({ length: m }, () => ({ valor: 1, color: C.necesidades })), { alto: 44, radio: 10 })}
      </div>
      <p class="lead" style="margin-top:40px"><b>${t.s2.final}</b></p>`; },
    // 3 · Por qué una hucha por meta
    (t, lang) => `<h1>${t.s3.t}</h1>
      <div class="tarjeta" style="margin-top:48px;padding:38px 36px">
        ${tituloFila(t.s3.una, `${dinero(t.totalHoy, lang)} <span style="font-size:26px;color:${C.suave};font-weight:600">${t.s3.unaV}</span>`)}
        ${barra([{ valor: 1, color: 'rgba(148,163,184,.42)' }], { alto: 44, radio: 10 })}
        <div style="height:36px"></div>
        ${tituloFila(t.s3.tres, dinero(t.totalHoy, lang))}
        ${barra(t.ahorrado.map((v, i) => ({ valor: v, color: colores[i] })), { alto: 44, radio: 10 })}
        <div style="display:flex;gap:3px;margin-top:14px">${t.ahorrado.map((v, i) => `<div style="flex:${v};min-width:0"><div style="font-size:26px;font-weight:650;color:${C.texto};white-space:nowrap">${t.corto[i]}</div><div style="font-size:26px;font-weight:800;font-variant-numeric:tabular-nums">${dinero(v, lang)}</div></div>`).join('')}</div>
      </div>
      <div style="margin-top:30px;display:flex;flex-direction:column">${t.s3.razones.map(([ic, txt], i) => `<div style="display:flex;align-items:center;gap:22px;padding:18px 0;${i ? `border-top:1px solid ${C.borde};` : ''}font-size:31px;font-weight:600">
        <span style="flex:0 0 auto;width:60px;height:60px;border-radius:16px;background:${fondo(C.necesidades)};display:inline-flex;align-items:center;justify-content:center">${icono(ic, C.necesidades, 32)}</span><span>${txt}</span></div>`).join('')}</div>`,
    // 4 · Fórmula: objetivo ÷ meses = cuota
    (t, lang) => { const [, , obj, m] = t.metas[0];
      const caja = (v, et, color) => `<div class="tarjeta" style="flex:1;padding:30px 20px;text-align:center"><div style="font-size:52px;font-weight:800;letter-spacing:-.03em;font-variant-numeric:tabular-nums;color:${color || C.tinta}">${v}</div><div style="margin-top:6px;font-size:26px;color:${C.suave};font-weight:600">${et}</div></div>`;
      const op = (s) => `<span style="flex:0 0 auto;font-size:48px;font-weight:600;color:${C.suave}">${s}</span>`;
      return `<h1>${t.s4.t}</h1><p class="lead">${t.s4.l}</p>
      <div style="margin-top:48px;display:flex;align-items:center;gap:16px">${caja(dinero(obj, lang), t.s4.meta)}${op('÷')}${caja(m, t.s4.meses)}${op('=')}${caja(dinero(t.s4.cuota, lang), t.s4.alMes, C.acento)}</div>
      <div class="tarjeta" style="margin-top:26px;padding:30px 34px">
        <div style="font-size:28px;color:${C.texto};font-weight:600">${t.s4.yaT}</div>
        <div style="margin-top:14px;font-size:38px;font-weight:800;font-variant-numeric:tabular-nums">(${dinero(obj, lang)} − ${dinero(t.s4.ya, lang)}) ÷ ${m} = <span style="color:${C.acento}">${dinero(t.s4.cuotaYa, lang)}</span> <span style="font-size:28px;color:${C.suave};font-weight:600">${t.s4.alMes}</span></div></div>
      <p class="nota" style="margin-top:26px">${t.s4.nota}</p>`; },
    // 5 · Ejemplo con 3 metas: objetivo, meses, cuota y total
    (t, lang) => { const cols = 'grid-template-columns:1fr 150px 110px 150px;gap:12px;align-items:center';
      return `<h1>${t.s5.t}</h1>
      <div class="tarjeta" style="margin-top:48px;padding:38px 36px 26px">
        ${barra(t.cuotas.map((v, i) => ({ valor: v, color: colores[i] })), { alto: 40, radio: 10 })}
        <div style="display:grid;${cols};margin-top:30px;padding-bottom:14px;font-size:24px;font-weight:700;letter-spacing:.06em;color:${C.suave}">${t.s5.cab.map((c, i) => `<span style="${i ? 'text-align:right' : ''}">${c.toUpperCase()}</span>`).join('')}</div>
        ${t.metas.map(([n, , obj, m], i) => `<div style="display:grid;${cols};padding:20px 0;border-top:1px solid ${C.borde};font-size:30px;font-variant-numeric:tabular-nums">
          <span style="display:flex;align-items:center;gap:14px;color:${C.texto}"><span class="punto" style="background:${colores[i]};flex:0 0 auto"></span>${n}</span>
          <span style="text-align:right">${dinero(obj, lang)}</span><span style="text-align:right;color:${C.texto}">${m}</span><span style="text-align:right;font-weight:800">${dinero(t.cuotas[i], lang)}</span></div>`).join('')}
        <div style="display:flex;justify-content:space-between;align-items:baseline;border-top:2px solid ${C.necesidades};margin-top:4px;padding:22px 0 8px"><span style="font-size:32px;font-weight:700">${t.s5.total}</span><span style="font-size:46px;font-weight:800;color:${C.acento};font-variant-numeric:tabular-nums">${dinero(t.totalMes, lang)}</span></div>
      </div><p class="nota">${t.s5.nota}</p>`; },
    // 6 · Dónde guardarlas
    (t) => `${estilo}<h1>${t.s6.t}</h1><p class="lead">${t.s6.l}</p>
      <div style="margin-top:44px;display:flex;flex-direction:column;gap:16px">
        ${t.s6.si.map(([ic, a, b]) => `<div class="item"><span class="ic" style="background:${fondo(C.necesidades)}">${icono(ic, C.necesidades, 42)}</span><span>${a}<small>${b}</small></span></div>`).join('')}
        ${t.s6.no.map(([ic, a, b]) => `<div class="item"><span class="ic" style="background:rgba(230,103,103,.15)">${icono(ic, '#e66767', 42)}</span><span>${a}<small>${b}</small></span></div>`).join('')}
      </div>`,
    // 7 · Que funcione: consejos y un hito visible
    (t, lang) => { const obj = t.metas[0][2], v = t.ahorrado[0];
      return `${estilo}<h1>${t.s7.t}</h1>
      <div style="margin-top:44px;display:flex;flex-direction:column;gap:14px">${t.s7.items.map(([a, b], i) => `<div class="item"><span class="ic" style="background:${fondo(C.necesidades)};font-size:30px;font-weight:800;color:${C.acento}">${i + 1}</span><span>${a}<small>${b}</small></span></div>`).join('')}</div>
      <div class="tarjeta" style="margin-top:22px;padding:30px 36px 26px">
        <div style="font-size:28px;font-weight:700;color:${C.texto};font-variant-numeric:tabular-nums">${t.s7.hito(dinero(v, lang), dinero(obj, lang))}</div>
        <div style="position:relative;margin-top:18px;height:22px;border-radius:8px;background:rgba(148,163,184,.14)">
          <div style="position:absolute;left:0;top:0;bottom:0;width:${(v / obj * 100).toFixed(1)}%;border-radius:8px;background:${C.necesidades}"></div>
          ${[25, 50, 75].map(p => `<div style="position:absolute;left:${p}%;top:-6px;bottom:-6px;width:3px;margin-left:-1.5px;border-radius:2px;background:${C.fondo}"></div>`).join('')}
        </div>
        <div style="position:relative;height:34px;margin-top:10px;font-size:26px;font-weight:700;font-variant-numeric:tabular-nums">${[25, 50, 75, 100].map(p => `<span style="position:absolute;left:${p}%;transform:translateX(${p === 100 ? '-100%' : '-50%'});color:${p <= v / obj * 100 ? C.acento : C.suave}">${p}%</span>`).join('')}</div>
      </div>
      <p class="lead" style="margin-top:34px"><b>${t.s7.final}</b></p>`; }
  ],
  texto: {
    en: `Saving for something specific? Give it its own pot. 🫙

A sinking fund is money you set aside each month for an expense you know is coming: a trip, the yearly car insurance bill, holiday gifts. Expected expenses aren't emergencies. They're bills you haven't divided yet.

How to size each pot: what the goal costs ÷ the months until you need it.
${lineas('en', 'in', 'months', 'a month')}
Total: ${dinero(T.en.totalMes, 'en')} a month. After 6 months you'd already have ${dinero(T.en.ahorrado[0], 'en')}, ${dinero(T.en.ahorrado[1], 'en')} and ${dinero(T.en.ahorrado[2], 'en')} set aside.

Already saved some? Subtract it first: (${dinero(T.en.metas[0][2], 'en')} − ${dinero(T.en.s4.ya, 'en')}) ÷ ${T.en.metas[0][3]} = ${dinero(T.en.s4.cuotaYa, 'en')} a month.

Why separate pots? Every dollar has a job, you can see each goal's progress, and the trip money doesn't quietly end up paying for a car repair.

Where to keep them: named savings buckets (many banks offer them) or a high-yield savings account, separate from checking. Keep goals that are only a few years away out of the stock market, and keep these pots apart from your emergency fund, which is for the unexpected.

Make it stick: name each pot, automate the transfers on payday and celebrate every 25%.

In FinanziApp you can plan each pot as its own savings category, track it month by month and set a yearly savings goal (free for 15 days, link in bio).

What are you saving for right now? 👇

#sinkingfunds #savingmoney #budgeting #personalfinance #moneytips`,
    es: `¿Ahorras para algo concreto? Dale su propia hucha. 🫙

La idea es apartar cada mes una cantidad para un gasto que sabes que va a llegar: un viaje, el seguro del coche, los regalos de Navidad. Los gastos previsibles no son emergencias. Son facturas que aún no has dividido.

Cuánto apartar en cada hucha: lo que cuesta la meta ÷ los meses que faltan.
${lineas('es', 'en', 'meses', 'al mes')}
Total: ${dinero(T.es.totalMes, 'es')} al mes. A los 6 meses ya tendrías ${dinero(T.es.ahorrado[0], 'es')}, ${dinero(T.es.ahorrado[1], 'es')} y ${dinero(T.es.ahorrado[2], 'es')} apartados.

¿Ya tienes algo ahorrado? Réstalo primero: (${dinero(T.es.metas[0][2], 'es')} − ${dinero(T.es.s4.ya, 'es')}) ÷ ${T.es.metas[0][3]} = ${dinero(T.es.s4.cuotaYa, 'es')} al mes.

¿Por qué separarlas? Cada euro tiene una tarea, ves cómo avanza cada meta y el dinero del viaje no acaba pagando, sin que te des cuenta, una avería del coche.

Dónde guardarlas: en huchas o espacios con nombre (muchos bancos y apps los tienen) o en una cuenta remunerada, separadas de la cuenta del día a día. Las metas a pocos años vista, mejor fuera de la bolsa. Y aparte de tu fondo de emergencia, que es para lo imprevisto.

Para que funcione: ponle nombre a cada hucha, automatiza las transferencias el día de cobro y celebra cada 25%.

En FinanziApp puedes planificar cada hucha como su propia categoría de ahorro, seguirla mes a mes y fijar un objetivo de ahorro anual (gratis 15 días, enlace en la bio).

¿Para qué estás ahorrando ahora mismo? 👇

#ahorro #finanzaspersonales #presupuesto #educacionfinanciera #objetivosfinancieros`
  }
};
