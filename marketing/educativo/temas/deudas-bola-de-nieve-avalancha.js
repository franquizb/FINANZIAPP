// Carrusel educativo: bola de nieve frente a avalancha para saldar deudas.
// Ejemplo con 3 deudas y la misma cantidad total cada mes. Todo se calcula aquí
// con una simulación mes a mes: inglés en dólares (APR ÷ 12 al mes), español en
// euros (interés mensual equivalente a la TAE). Las comprobaciones lanzan un
// error si algo no cuadra con lo que dicen las diapositivas.
const { C, icono } = require('../comun');

const ROJO = '#e66767';
const agrupar = (n, sep) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, sep);
const dinero = (n, lang) => (lang === 'en' ? '$' + agrupar(n, ',') : agrupar(n, '.') + '\u00a0€');   // espacio que no parte (en la descripción se cambia por uno normal)
const nb = (s) => s.replace(/-/g, '‑');   // guion que no parte la línea

// Iconos propios con el mismo trazo que comun.js.
const SVG = {
  bola: '<circle cx="14.5" cy="12.5" r="7"/><path d="M2.5 9h4.5M2 12.5h3.5M2.5 16h4.5"/><path d="M5.5 20.5h15"/>',
  avalancha: '<path d="M2.5 20 9.2 8.5l3.6 5.6 2.6-3.6 6.1 9.5z"/><path d="m7.4 11.6 1.8 1.2 1.6-1.6"/>',
  billete: '<rect x="2.5" y="6" width="19" height="12" rx="2.2"/><circle cx="12" cy="12" r="2.6"/><path d="M6 9.5h.01M18 14.5h.01"/>',
  flecha: '<path d="M4 12h15"/><path d="m13.5 6.5 5.5 5.5-5.5 5.5"/>'
};
const ico = (nombre, color, tam = 40) => SVG[nombre]
  ? `<svg width="${tam}" height="${tam}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${SVG[nombre]}</svg>`
  : icono(nombre, color, tam);

// Las 3 deudas del ejemplo. color = identidad de cada deuda en todo el carrusel.
const DEUDAS = {
  en: { extra: 200, tasaMes: (a) => a / 12, deudas: [
    { k: 'p', ic: 'billete', color: C.necesidades, nombre: 'Personal loan', corto: 'Loan', saldo: 2000, tasa: 0.08, min: 60 },
    { k: 't', ic: 'tarjeta', color: C.caprichos, nombre: 'Credit card', corto: 'Card', saldo: 6000, tasa: 0.24, min: 180 },
    { k: 'c', ic: 'coche', color: C.ahorro, nombre: 'Car loan', corto: 'Car', saldo: 8000, tasa: 0.06, min: 200 }] },
  es: { extra: 200, tasaMes: (a) => Math.pow(1 + a, 1 / 12) - 1, deudas: [
    { k: 'p', ic: 'billete', color: C.necesidades, nombre: 'Préstamo personal', corto: 'Préstamo', saldo: 2000, tasa: 0.08, min: 60 },
    { k: 't', ic: 'tarjeta', color: C.caprichos, nombre: 'Tarjeta revolving', corto: 'Tarjeta', saldo: 6000, tasa: 0.20, min: 180 },
    { k: 'c', ic: 'coche', color: C.ahorro, nombre: 'Préstamo del coche', corto: 'Coche', saldo: 8000, tasa: 0.06, min: 200 }] }
};

// Simulación mes a mes: se cobran intereses, se pagan todos los mínimos y lo que
// queda del presupuesto (extra + mínimos de las deudas ya saldadas) va al objetivo.
function simular({ deudas, extra, tasaMes }, criterio) {
  const ds = deudas.map(d => ({ ...d, s: d.saldo, interes: 0, pagado: 0, fin: null }));
  const presupuesto = deudas.reduce((s, d) => s + d.min, 0) + extra;
  const orden = [...ds].sort(criterio);
  let mes = 0;
  while (ds.some(d => d.s > 0.005)) {
    if (++mes > 600) throw new Error('deudas: la simulación no termina');
    for (const d of ds) if (d.s > 0) { const i = d.s * tasaMes(d.tasa); d.s += i; d.interes += i; }
    let disp = presupuesto;
    for (const d of ds) if (d.s > 0) { const p = Math.min(d.min, d.s); d.s -= p; d.pagado += p; disp -= p; }
    for (const d of orden) if (d.s > 0 && disp > 0) { const p = Math.min(disp, d.s); d.s -= p; d.pagado += p; disp -= p; }
    for (const d of ds) if (d.s <= 0.005 && d.fin === null) { d.s = 0; d.fin = mes; }
  }
  for (const d of ds) if (Math.abs(d.pagado - d.saldo - d.interes) > 0.01) throw new Error('deudas: pagos e intereses no cuadran');
  return { meses: mes, interes: ds.reduce((s, d) => s + d.interes, 0), presupuesto, orden: orden.map(d => d.k),
    fin: Object.fromEntries(ds.map(d => [d.k, d.fin])), primero: Math.min(...ds.map(d => d.fin)) };
}
const R = {};
for (const lang of ['en', 'es']) {
  const ej = DEUDAS[lang];
  const bola = simular(ej, (a, b) => a.saldo - b.saldo);
  const aval = simular(ej, (a, b) => b.tasa - a.tasa);
  // Lo que cuentan las diapositivas tiene que ser cierto con estas cifras.
  if (bola.orden.join() !== 'p,t,c' || aval.orden.join() !== 't,p,c') throw new Error('deudas: orden inesperado ' + lang);
  if (!(aval.interes < bola.interes) || !(bola.primero < aval.primero) || aval.meses !== bola.meses - 1) throw new Error('deudas: conclusiones no válidas ' + lang);
  R[lang] = { ...ej, bola, aval, ahorro: bola.interes - aval.interes, antes: aval.primero - bola.primero,
    minimos: ej.deudas.reduce((s, d) => s + d.min, 0) };
  if (R[lang].minimos + ej.extra !== bola.presupuesto) throw new Error('deudas: presupuesto ' + lang);
}

const T = {
  en: {
    kicker: 'DEBT BASICS', desliza: 'Swipe →', tasa: 'APR', mes: 'month', meses: 'months', alMes: 'a month',
    bola: 'Snowball', aval: 'Avalanche', bolaRegla: 'smallest balance first', avalRegla: 'highest rate first',
    s1: { t: 'Snowball or avalanche: <span class="c">which debt goes first?</span>', l: 'Two popular ways to pay off several debts. Same money every month, a different order.' },
    s2: { t: 'Two ways to pick <span class="c">the&nbsp;target</span>', l: 'Both pay every minimum, put all the extra money on one debt, and roll its payment into the next one when it’s gone.',
      bola: 'Order your debts from the smallest balance to the largest. You clear whole debts sooner: quick wins.',
      aval: 'Order your debts from the highest interest rate to the lowest. The most expensive debt goes first: less interest.' },
    s3: { t: 'Our example: <span class="c">3&nbsp;debts</span>', cols: ['Debt', 'Balance', 'APR', 'Minimum'],
      suma: (m, e, p) => `Minimums ${m} + ${e} extra = <b style="color:${C.acento}">${p} a month</b>`,
      nota: 'Illustrative example. Interest is charged monthly (APR ÷ 12) and the minimums stay fixed.' },
    s4: { t: (p) => `Same ${p} a month, <span class="c">two&nbsp;orders</span>`, libre: 'debt‑free' },
    s5: { t: 'The <span class="c">result</span>', filas: ['First debt paid off', 'Debt‑free in', 'Total interest'],
      ahorra: (a) => `The avalanche saves <b style="color:${C.tinta}">${a}</b> in interest.`,
      antes: (n) => `The snowball clears its first debt <b style="color:${C.tinta}">${n} months sooner</b>.` },
    s6: { t: nb('Math vs. <span class="c">motivation</span>'), l: 'On paper, the avalanche saves the most. But a plan only works if you keep going.',
      aval: ['You’re motivated by numbers', 'Your rates are very different', 'You can wait for the first win'],
      bola: ['You need quick wins to keep going', 'Your rates are similar', 'You have several small debts'], elige: 'Pick it if',
      nota: 'In data from a debt-management program, people who closed more accounts were more likely to pay off all their debt (Gal & McShane, Journal of Marketing Research, 2012).' },
    s7: { t: 'Start <span class="c">this week</span>', items: [['List every debt', 'Balance, interest rate and minimum'], ['Set one monthly total', 'An amount you can keep paying'], ['Pick your target', 'Smallest balance or highest rate'], ['Automate and roll it over', 'Each freed payment goes to the next debt']],
      final: 'The best method is the one you’ll stick with.' }
  },
  es: {
    kicker: 'DEUDAS', desliza: 'Desliza →', tasa: 'TAE', mes: 'mes', meses: 'meses', alMes: 'al mes',
    bola: 'Bola de nieve', aval: 'Avalancha', bolaRegla: 'primero la más pequeña', avalRegla: 'primero la más cara',
    s1: { t: 'Bola de nieve o avalancha: <span class="c">¿qué deuda va&nbsp;primero?</span>', l: 'Dos formas populares de saldar varias deudas. El mismo dinero cada mes, en otro orden.' },
    s2: { t: 'Dos formas de elegir <span class="c">el&nbsp;objetivo</span>', l: 'Las dos pagan todas las cuotas mínimas, ponen el dinero extra en una sola deuda y, cuando la saldan, pasan su cuota a la siguiente.',
      bola: 'Ordena tus deudas de menor a mayor saldo. Te quitas deudas enteras antes: victorias rápidas.',
      aval: 'Ordena tus deudas de mayor a menor interés. La deuda más cara va primero: pagas menos intereses.' },
    s3: { t: 'Nuestro ejemplo: <span class="c">3&nbsp;deudas</span>', cols: ['Deuda', 'Saldo', 'TAE', 'Cuota'],
      suma: (m, e, p) => `Cuotas ${m} + ${e} extra = <b style="color:${C.acento}">${p} al mes</b>`,
      nota: 'Ejemplo ilustrativo. Interés mensual equivalente a la TAE y cuotas mínimas fijas.' },
    s4: { t: (p) => `Mismos ${p} al&nbsp;mes, <span class="c">dos&nbsp;órdenes</span>`, libre: 'sin deudas' },
    s5: { t: 'El <span class="c">resultado</span>', filas: ['Primera deuda saldada', 'Sin deudas en', 'Intereses totales'],
      ahorra: (a) => `La avalancha ahorra <b style="color:${C.tinta}">${a}</b> en intereses.`,
      antes: (n) => `La bola de nieve salda su primera deuda <b style="color:${C.tinta}">${n} meses antes</b>.` },
    s6: { t: 'Matemáticas o <span class="c">motivación</span>', l: 'Sobre el papel, la avalancha ahorra más. Pero un plan solo funciona si lo mantienes.',
      aval: ['Te motivan los números', 'Tus intereses son muy distintos', 'Puedes esperar a la primera victoria'],
      bola: ['Necesitas victorias rápidas', 'Tus intereses son parecidos', 'Tienes varias deudas pequeñas'], elige: 'Elígela si',
      nota: 'En datos de un programa de gestión de deudas, quienes cerraban más cuentas tenían más probabilidad de saldarlo todo (Gal y McShane, Journal of Marketing Research, 2012).' },
    s7: { t: 'Empieza <span class="c">esta semana</span>', items: [['Apunta todas tus deudas', 'Saldo, interés y cuota mínima'], ['Fija un total al mes', 'Una cantidad que puedas mantener'], ['Elige tu objetivo', 'La más pequeña o la más cara'], ['Automatiza y encadena', 'Cada cuota liberada va a la siguiente deuda']],
      final: 'El mejor método es el que vas a mantener.' }
  }
};

const pct = (x, lang) => (lang === 'en' ? `${x * 100}%` : `${String(x * 100).replace('.', ',')}%`);
const fondo = (c) => c + '26';
// Evita palabras sueltas al final de títulos y textos (solo en estas diapositivas).
const PULIDO = '<style>h1,.lead,.nota{text-wrap:pretty}</style>';
const deuda = (lang, k) => R[lang].deudas.find(d => d.k === k);
const flecha = ico('flecha', C.suave, 26);

// Cadena de 3 deudas en el orden de un método (portada).
const cadena = (lang, orden, valor) => `<div style="display:flex;align-items:center;gap:10px">${orden.map((k, i) => { const d = deuda(lang, k); return `${i ? flecha : ''}
  <div style="flex:1;display:flex;align-items:center;gap:12px;border-radius:18px;background:${fondo(d.color)};border:1px solid ${d.color}66;padding:16px 16px">
    ${ico(d.ic, d.color, 34)}<div><div style="font-size:26px;color:${C.texto};font-weight:600">${d.corto}</div><div style="font-size:30px;font-weight:800;font-variant-numeric:tabular-nums">${valor(d)}</div></div></div>`; }).join('')}</div>`;

// Línea de tiempo de un método: una barra por deuda, de 0 al mes en que se salda.
const linea = (t, lang, m, icn, nombre) => { const r = R[lang][m], max = R[lang].bola.meses;
  return `<div class="tarjeta" style="padding:28px 32px">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <span style="display:flex;align-items:center;gap:14px;font-size:30px;font-weight:800">${ico(icn, C.acento, 36)}${nombre}</span>
      <span style="font-size:27px;color:${C.texto};font-weight:600">${t.s4.libre}: <b style="color:${C.acento}">${r.meses} ${t.meses}</b></span></div>
    ${r.orden.map(k => { const d = deuda(lang, k); return `<div style="display:grid;grid-template-columns:150px 1fr 130px;gap:16px;align-items:center;padding:9px 0">
      <span style="font-size:26px;color:${C.texto};font-weight:600">${d.corto}</span>
      <div style="height:20px;border-radius:7px;background:rgba(148,163,184,.12)"><div style="height:100%;border-radius:7px;background:${d.color};width:${(r.fin[k] / max * 100).toFixed(1)}%"></div></div>
      <span style="font-size:27px;font-weight:700;text-align:right;font-variant-numeric:tabular-nums">${t.mes} ${r.fin[k]}</span></div>`; }).join('')}</div>`; };

const marca = (color) => `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>`;

module.exports = {
  slug: 'deudas-bola-de-nieve-avalancha',
  T,
  diapositivas: [
    // 1 · Portada: el mismo grupo de deudas en dos órdenes
    (t, lang) => `<h1 class="grande">${t.s1.t}</h1><p class="lead">${t.s1.l}</p>
      <div style="margin-top:56px;display:flex;flex-direction:column;gap:20px">
        ${[['bola', t.bola, t.bolaRegla, R[lang].bola.orden, (d) => dinero(d.saldo, lang)], ['avalancha', t.aval, t.avalRegla, R[lang].aval.orden, (d) => pct(d.tasa, lang)]].map(([icn, n, regla, orden, valor]) => `<div class="tarjeta" style="padding:28px 30px">
          <div style="display:flex;align-items:center;gap:14px;margin-bottom:20px">${ico(icn, C.acento, 38)}<span style="font-size:32px;font-weight:800">${n}</span><span style="font-size:27px;color:${C.suave};font-weight:550">· ${regla}</span></div>
          ${cadena(lang, orden, valor)}</div>`).join('')}</div>`,
    // 2 · Los dos métodos
    (t) => `<h1>${t.s2.t}</h1><p class="lead">${t.s2.l}</p>
      <div style="margin-top:44px;display:flex;flex-direction:column;gap:20px">
        ${[['bola', t.bola, t.bolaRegla, t.s2.bola], ['avalancha', t.aval, t.avalRegla, t.s2.aval]].map(([icn, n, regla, txt]) => `<div class="tarjeta" style="display:flex;gap:26px;align-items:flex-start">
          <span style="flex:0 0 auto;width:76px;height:76px;border-radius:20px;background:${fondo(C.necesidades)};display:inline-flex;align-items:center;justify-content:center">${ico(icn, C.acento, 44)}</span>
          <div><div style="font-size:34px;font-weight:800">${n}</div><div style="font-size:28px;color:${C.acento};font-weight:650;margin-top:4px">${regla}</div>
          <p style="font-size:28px;line-height:1.45;color:${C.texto};margin-top:12px">${txt}</p></div></div>`).join('')}</div>`,
    // 3 · El ejemplo
    (t, lang) => { const r = R[lang], g = 'display:grid;grid-template-columns:1fr 150px 110px 150px;gap:12px;align-items:center';
      return `<h1>${t.s3.t}</h1>
      <div class="tarjeta" style="margin-top:52px;padding:30px 34px">
        <div style="${g};font-size:22px;letter-spacing:.08em;color:${C.suave};font-weight:700;padding-bottom:14px;border-bottom:1px solid ${C.borde}">${t.s3.cols.map((c, i) => `<span style="${i ? 'text-align:right' : ''}">${c.toUpperCase()}</span>`).join('')}</div>
        ${r.deudas.map(d => `<div style="${g};padding:22px 0;border-bottom:1px solid ${C.borde};font-size:30px">
          <span style="display:flex;align-items:center;gap:14px;color:${C.texto};font-weight:600">${ico(d.ic, d.color, 34)}${d.nombre}</span>
          <span style="text-align:right;font-weight:700;font-variant-numeric:tabular-nums">${dinero(d.saldo, lang)}</span>
          <span style="text-align:right;font-weight:700;color:${d.tasa >= 0.2 ? ROJO : C.tinta}">${pct(d.tasa, lang)}</span>
          <span style="text-align:right;font-weight:700;font-variant-numeric:tabular-nums">${dinero(d.min, lang)}</span></div>`).join('')}
        <div style="padding-top:24px;font-size:30px;color:${C.texto};font-weight:600;text-align:right">${t.s3.suma(dinero(r.minimos, lang), dinero(r.extra, lang), dinero(r.bola.presupuesto, lang))}</div>
      </div><p class="nota">${t.s3.nota}</p>`; },
    // 4 · Cuándo se salda cada deuda con cada método
    (t, lang) => `<h1>${t.s4.t(dinero(R[lang].bola.presupuesto, lang))}</h1>
      <div style="margin-top:52px;display:flex;flex-direction:column;gap:20px">${linea(t, lang, 'bola', 'bola', t.bola)}${linea(t, lang, 'aval', 'avalancha', t.aval)}</div>`,
    // 5 · Comparación
    (t, lang) => { const r = R[lang], g = 'display:grid;grid-template-columns:1fr 200px 200px;gap:12px;align-items:baseline';
      const vals = [[`${t.mes} ${r.bola.primero}`, `${t.mes} ${r.aval.primero}`, 0], [`${r.bola.meses} ${t.meses}`, `${r.aval.meses} ${t.meses}`, 1], [dinero(r.bola.interes, lang), dinero(r.aval.interes, lang), 1]];
      return `<h1>${t.s5.t}</h1>
      <div class="tarjeta" style="margin-top:52px;padding:30px 34px">
        <div style="${g};padding-bottom:16px;border-bottom:1px solid ${C.borde}"><span></span>${[['bola', t.bola], ['avalancha', t.aval]].map(([icn, n]) => `<span style="display:flex;flex-direction:column;align-items:flex-end;gap:8px;font-size:26px;font-weight:750">${ico(icn, C.acento, 36)}${n}</span>`).join('')}</div>
        ${t.s5.filas.map((f, i) => `<div style="${g};padding:24px 0;${i < 2 ? `border-bottom:1px solid ${C.borde}` : ''}">
          <span style="font-size:29px;color:${C.texto};font-weight:600">${f}</span>
          ${[0, 1].map(j => `<span style="text-align:right;font-size:34px;font-weight:800;font-variant-numeric:tabular-nums;color:${j === vals[i][2] ? C.acento : C.tinta}">${vals[i][j]}</span>`).join('')}</div>`).join('')}
      </div>
      <div class="tarjeta" style="margin-top:22px;font-size:30px;line-height:1.5;color:${C.texto}">${t.s5.ahorra(dinero(r.ahorro, lang))}<br>${t.s5.antes(r.antes)}</div>`; },
    // 6 · Cuál elegir
    (t) => `<h1>${t.s6.t}</h1><p class="lead">${t.s6.l}</p>
      <div style="margin-top:40px;display:flex;flex-direction:column;gap:18px">
        ${[['avalancha', t.aval, t.s6.aval], ['bola', t.bola, t.s6.bola]].map(([icn, n, lista]) => `<div class="tarjeta" style="padding:26px 32px 14px">
          <div style="display:flex;align-items:center;gap:14px;margin-bottom:8px">${ico(icn, C.acento, 38)}<span style="font-size:32px;font-weight:800">${n}</span><span style="font-size:23px;font-weight:800;letter-spacing:.06em;color:${C.suave};margin-left:6px">${t.s6.elige.toUpperCase()}</span></div>
          ${lista.map(x => `<div style="display:flex;gap:14px;align-items:center;padding:13px 0;border-top:1px solid ${C.borde};font-size:28px;font-weight:600">${marca(C.necesidades)}<span>${x}</span></div>`).join('')}</div>`).join('')}
      </div><p class="nota" style="margin-top:26px">${t.s6.nota}</p>`,
    // 7 · Para empezar
    (t) => `<h1>${t.s7.t}</h1>
      <div style="margin-top:48px;display:flex;flex-direction:column;gap:14px">${t.s7.items.map(([a, b], i) => `<div class="item"><span class="ic" style="background:${fondo(C.necesidades)};font-size:30px;font-weight:800;color:${C.acento}">${i + 1}</span><span>${a}<small style="font-size:26px">${b}</small></span></div>`).join('')}</div>
      <p class="lead" style="margin-top:40px"><b>${t.s7.final}</b></p>`
  ].map(d => (t, lang) => PULIDO + d(t, lang)),
  texto: (() => { const e = R.en, s = R.es, d = (r, k) => r.deudas.find(x => x.k === k); const tx = {
    en: `Snowball or avalanche? Two popular ways to pay off several debts, and both work. ❄️

Both follow the same routine: pay the minimum on every debt, put all your extra money on one target, and when that debt is gone, roll its payment into the next one.
• Snowball: target the smallest balance first. You clear whole debts sooner.
• Avalanche: target the highest interest rate first. You pay less interest.

Our example: a ${dinero(d(e, 'p').saldo, 'en')} personal loan (8% APR, ${dinero(d(e, 'p').min, 'en')} minimum), a ${dinero(d(e, 't').saldo, 'en')} credit card (24%, ${dinero(d(e, 't').min, 'en')}) and an ${dinero(d(e, 'c').saldo, 'en')} car loan (6%, ${dinero(d(e, 'c').min, 'en')}). The minimums add up to ${dinero(e.minimos, 'en')}; with ${dinero(e.extra, 'en')} extra, that's ${dinero(e.bola.presupuesto, 'en')} every month.

Snowball: first debt gone in month ${e.bola.primero}, debt-free in ${e.bola.meses} months, ${dinero(e.bola.interes, 'en')} in interest.
Avalanche: first debt gone in month ${e.aval.primero}, debt-free in ${e.aval.meses} months, ${dinero(e.aval.interes, 'en')} in interest.

So the avalanche saves ${dinero(e.ahorro, 'en')} here, and the snowball gives you your first win ${e.antes} months sooner. If you're driven by the numbers, the avalanche is the better deal. If you need quick wins to keep going, the snowball is a solid choice: in data from a debt-management program, people who closed more accounts were more likely to pay off all their debt (Gal & McShane, 2012). The best method is the one you'll stick with.

Illustrative example: interest charged monthly (APR ÷ 12), minimums kept fixed.

In FinanziApp you can add each loan and follow its amortization month by month (free for 15 days, link in bio).

Which one would you pick: snowball or avalanche?

#debtfree #debtsnowball #personalfinance #moneytips #financialliteracy`,
    es: `¿Bola de nieve o avalancha? Dos formas populares de saldar varias deudas, y las dos funcionan. ❄️

Las dos siguen la misma rutina: pagas la cuota mínima de cada deuda, pones todo el dinero extra en un solo objetivo y, cuando lo saldas, pasas su cuota a la siguiente.
• Bola de nieve: primero la deuda con menos saldo. Te quitas deudas enteras antes.
• Avalancha: primero la deuda con más interés. Pagas menos intereses.

Nuestro ejemplo: un préstamo personal de ${dinero(d(s, 'p').saldo, 'es')} (8% TAE, cuota de ${dinero(d(s, 'p').min, 'es')}), una tarjeta revolving con ${dinero(d(s, 't').saldo, 'es')} (20% TAE, ${dinero(d(s, 't').min, 'es')}) y el préstamo del coche, ${dinero(d(s, 'c').saldo, 'es')} (6% TAE, ${dinero(d(s, 'c').min, 'es')}). Las cuotas suman ${dinero(s.minimos, 'es')}; con ${dinero(s.extra, 'es')} extra, son ${dinero(s.bola.presupuesto, 'es')} cada mes.

Bola de nieve: primera deuda saldada en el mes ${s.bola.primero}, sin deudas en ${s.bola.meses} meses y ${dinero(s.bola.interes, 'es')} de intereses.
Avalancha: primera deuda saldada en el mes ${s.aval.primero}, sin deudas en ${s.aval.meses} meses y ${dinero(s.aval.interes, 'es')} de intereses.

La avalancha ahorra ${dinero(s.ahorro, 'es')} en este caso, y la bola de nieve te da la primera victoria ${s.antes} meses antes. Si te mueven los números, la avalancha sale más a cuenta. Si necesitas victorias rápidas para seguir, la bola de nieve es una buena opción: en datos de un programa de gestión de deudas, quienes cerraban más cuentas tenían más probabilidad de saldarlo todo (Gal y McShane, 2012). El mejor método es el que vas a mantener.

Ejemplo ilustrativo: interés mensual equivalente a la TAE y cuotas mínimas fijas.

En FinanziApp puedes añadir cada préstamo y seguir su amortización mes a mes (gratis 15 días, enlace en la bio).

¿Cuál elegirías tú: bola de nieve o avalancha?

#deudas #finanzaspersonales #educacionfinanciera #ahorro #salirdedeudas`
  }; for (const k in tx) tx[k] = tx[k].replace(/\u00a0/g, ' '); return tx; })()
};
