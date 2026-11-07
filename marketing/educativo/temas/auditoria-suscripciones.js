// Carrusel educativo: auditoría de suscripciones en 10 minutos (encontrarlas,
// clasificarlas y actuar). Ejemplo con 7 suscripciones típicas: inglés en
// dólares, español en euros. Las cuentas se hacen en céntimos y se comprueban
// al cargar: si algo no suma, se lanza un error.
const { C, icono } = require('../comun');

const ROJO = '#e66767';
const agrupar = (n, sep) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, sep);
// Dinero con céntimos a partir de un entero en céntimos: $1,337.16 · 1.337,16 €
const dinero = (cts, lang) => {
  const e = Math.floor(cts / 100), d = String(cts % 100).padStart(2, '0');
  return lang === 'en' ? `$${agrupar(e, ',')}.${d}` : `${agrupar(e, '.')},${d} €`;
};
const PAUSA_MESES = 6;   // «pausar» = darla de baja 6 meses al año (rotar)

const SUBS = {
  en: [
    ['pantalla', 'Streaming service', 1799, 'k'], ['pantalla', '2nd streaming service', 1549, 'p'], ['musica', 'Music', 1199, 'k'],
    ['nube', 'Cloud storage', 299, 'k'], ['pesa', 'Gym (rarely used)', 3999, 'x'], ['bocadillo', 'Language app (old trial)', 1299, 'x'], ['periodico', 'News app', 999, 'x']],
  es: [
    ['pantalla', 'Plataforma de vídeo', 1399, 'k'], ['pantalla', '2.ª plataforma de vídeo', 999, 'p'], ['musica', 'Música', 1099, 'k'],
    ['nube', 'Almacenamiento en la nube', 299, 'k'], ['pesa', 'Gimnasio (casi sin usar)', 3990, 'x'], ['bocadillo', 'App de idiomas (prueba olvidada)', 1299, 'x'], ['periodico', 'Prensa digital', 999, 'x']]
};
const ANUAL = { en: [999, 9999], es: [999, 9999] };     // ejemplo de plan mensual frente a anual

const R = {};
for (const lang of ['en', 'es']) {
  const subs = SUBS[lang], suma = (f) => subs.filter(f).reduce((s, x) => s + x[2], 0);
  const mes = suma(() => true), ano = mes * 12;
  const k = suma(x => x[3] === 'k'), p = suma(x => x[3] === 'p'), x = suma(x => x[3] === 'x');
  const ahorroCancelar = x * 12, ahorroPausar = p * PAUSA_MESES, ahorro = ahorroCancelar + ahorroPausar;
  const sigues = k * 12 + p * (12 - PAUSA_MESES);
  if (k + p + x !== mes || sigues + ahorro !== ano) throw new Error('auditoria-suscripciones: las cuentas no cuadran ' + lang);
  const [m, a] = ANUAL[lang], m12 = m * 12, difAnual = m12 - a;
  if (difAnual <= 0) throw new Error('auditoria-suscripciones: plan anual ' + lang);
  R[lang] = { subs, mes, ano, k, p, x, nx: subs.filter(s => s[3] === 'x').length, ahorroCancelar, ahorroPausar, ahorro, sigues,
    m, a, m12, difAnual, pctAnual: Math.round(difAnual / m12 * 100) };
}

const T = {
  en: {
    kicker: 'BUDGETING BASICS', desliza: 'Swipe →', mes: 'a month', ano: 'a year', min: 'min',
    tag: { k: 'Keep', p: 'Pause', x: 'Cancel' },
    s1: { t: 'The 10‑minute <span class="c">subscription audit</span>', l: 'Small monthly charges are easy to forget. Find them, sort them, and keep only what you really use.', pie: (n) => `${n} subscriptions in our example` },
    s2: { t: 'Step 1: <span class="c">find them</span>', items: [
      ['tarjeta', 'Bank and card statements', 'Last 3 months: look for repeating charges'],
      ['movil', 'iPhone', 'Settings → your name → Subscriptions'],
      ['movil', 'Android', 'Play Store → profile → Payments & subscriptions'],
      ['sobre', 'Your email inbox', 'Search: subscription, renewal, trial, receipt'],
      ['calendario', 'Yearly charges', 'Check 12 months: annual renewals hide']] },
    s3: { t: 'Step 2: <span class="c">sort them</span>', l: 'Ask one question for each: would I sign up again today, at this price?',
      grupos: [['k', 'Yes, and I use it every week'], ['p', 'Only some months of the year: rotate it'], ['x', 'No: unused, a duplicate, or a forgotten trial']] },
    s4: { t: 'Our example: <span class="c">7&nbsp;subscriptions</span>', total: 'Total', nota: 'Illustrative prices. Check your own statements.' },
    s5: { t: 'What you <span class="c">save in a year</span>',
      filas: (r) => [[`Cancel ${r.nx}`, `${dinero(r.x, 'en')} × 12`, r.ahorroCancelar, ROJO], [`Pause 1 for ${PAUSA_MESES} months`, `${dinero(r.p, 'en')} × ${PAUSA_MESES}`, r.ahorroPausar, C.caprichos]],
      total: 'Saved in a year', antes: 'Before', sigues: 'Still paying', ahorras: 'Saved' },
    s6: { t: 'Step 3: <span class="c">act</span>', items: [
      ['lupa', 'Cancel where you signed up', 'Deleting the app doesn’t cancel the subscription'],
      ['calendario', 'Set a reminder before trials end', 'Two days before the first charge'],
      ['tarro', 'Go annual only for what you use all year', (r) => `12 × ${dinero(r.m, 'en')} = ${dinero(r.m12, 'en')} vs. ${dinero(r.a, 'en')} a year: ${r.pctAnual}% less`],
      ['casa', 'Share a family plan', 'Split the cost at home, if the terms allow it']] },
    s7: { t: 'Repeat it <span class="c">every 3 months</span>', pasos: [['lupa', 'Find', 4], ['tarta', 'Sort', 3], ['escudo', 'Act', 3]],
      l: 'Put a 10‑minute reminder in your calendar. New subscriptions sneak in, and prices change.',
      final: 'Keep only what you’d sign up for again today.' }
  },
  es: {
    kicker: 'PRESUPUESTO BÁSICO', desliza: 'Desliza →', mes: 'al mes', ano: 'al año', min: 'min',
    tag: { k: 'Conservar', p: 'Pausar', x: 'Cancelar' },
    s1: { t: 'Revisa tus suscripciones <span class="c">en&nbsp;10&nbsp;minutos</span>', l: 'Los cargos pequeños de cada mes se olvidan fácil. Encuéntralos, clasifícalos y quédate solo con lo que usas.', pie: (n) => `${n} suscripciones en nuestro ejemplo` },
    s2: { t: 'Paso 1: <span class="c">encuéntralas</span>', items: [
      ['tarjeta', 'Extractos del banco y la tarjeta', 'Últimos 3 meses: busca cargos que se repiten'],
      ['movil', 'iPhone', 'Ajustes → tu nombre → Suscripciones'],
      ['movil', 'Android', 'Google Play → perfil → Pagos y suscripciones'],
      ['sobre', 'Tu correo', 'Busca: suscripción, renovación, prueba, recibo'],
      ['calendario', 'Cargos anuales', 'Revisa 12 meses: las renovaciones anuales se esconden']] },
    s3: { t: 'Paso 2: <span class="c">clasifícalas</span>', l: 'Hazte una pregunta con cada una: ¿me daría de alta hoy, a este precio?',
      grupos: [['k', 'Sí, y la uso cada semana'], ['p', 'Solo algunos meses al año: ve rotándola'], ['x', 'No: sin uso, repetida o una prueba olvidada']] },
    s4: { t: 'Nuestro ejemplo: <span class="c">7&nbsp;suscripciones</span>', total: 'Total', nota: 'Precios de ejemplo. Revisa tus propios extractos.' },
    s5: { t: 'Lo que <span class="c">ahorras en&nbsp;un&nbsp;año</span>',
      filas: (r) => [[`Cancelar ${r.nx}`, `${dinero(r.x, 'es')} × 12`, r.ahorroCancelar, ROJO], [`Pausar 1 durante ${PAUSA_MESES} meses`, `${dinero(r.p, 'es')} × ${PAUSA_MESES}`, r.ahorroPausar, C.caprichos]],
      total: 'Ahorro en un año', antes: 'Antes', sigues: 'Sigues pagando', ahorras: 'Ahorras' },
    s6: { t: 'Paso 3: <span class="c">actúa</span>', items: [
      ['lupa', 'Cancela donde te diste de alta', 'Borrar la app no cancela la suscripción'],
      ['calendario', 'Pon un aviso antes de que acabe la prueba', 'Dos días antes del primer cargo'],
      ['tarro', 'Plan anual solo si lo usas todo el año', (r) => `12 × ${dinero(r.m, 'es')} = ${dinero(r.m12, 'es')}, frente a ${dinero(r.a, 'es')} al año (−${r.pctAnual}%)`],
      ['casa', 'Comparte un plan familiar', 'Divide el coste en casa, si las condiciones lo permiten']] },
    s7: { t: 'Repítelo <span class="c">cada 3 meses</span>', pasos: [['lupa', 'Encontrar', 4], ['tarta', 'Clasificar', 3], ['escudo', 'Actuar', 3]],
      l: 'Pon un aviso de 10 minutos en tu calendario. Se cuelan suscripciones nuevas y los precios cambian.',
      final: 'Quédate solo con lo que volverías a contratar hoy.' }
  }
};

const COLOR = { k: C.necesidades, p: C.caprichos, x: ROJO };
const fondo = (c) => c + '26';
// Evita palabras sueltas al final de títulos y textos (solo en estas diapositivas).
const PULIDO = '<style>h1,.lead,.nota{text-wrap:pretty}</style>';
const SVG = {
  nube: '<path d="M7 18.5h10.5a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.6 9.6 4.5 4.5 0 0 0 7 18.5z"/>',
  pesa: '<path d="M6.5 7.5v9M17.5 7.5v9M3.5 10v4M20.5 10v4M6.5 12h11"/>',
  periodico: '<rect x="3.5" y="4.5" width="17" height="15" rx="2"/><path d="M7 8.5h10M7 12h4.5M7 15.5h4.5M14 12h3v3.5h-3z"/>',
  sobre: '<rect x="3" y="5.5" width="18" height="13" rx="2.2"/><path d="m3.5 7 8.5 6.5L20.5 7"/>',
  k: '<path d="m5 12.5 4.5 4.5L19 7.5"/>', p: '<path d="M9 6v12M15 6v12"/>', x: '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>'
};
const ico = (n, color, tam = 40, grosor = 1.9) => SVG[n]
  ? `<svg width="${tam}" height="${tam}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${grosor}" stroke-linecap="round" stroke-linejoin="round">${SVG[n]}</svg>`
  : icono(n, color, tam);
const etiqueta = (t, k) => `<span style="display:inline-flex;align-items:center;gap:8px;padding:6px 14px 6px 10px;border-radius:999px;background:${fondo(COLOR[k])};color:${k === 'x' ? ROJO : k === 'p' ? '#e0a33a' : C.acento};font-size:26px;font-weight:750;white-space:nowrap">${ico(k, COLOR[k], 24, 2.6)}${t.tag[k]}</span>`;
const lista = (items, r) => `<div style="margin-top:48px;display:flex;flex-direction:column;gap:14px">${items.map(([ic, a, b]) => `<div class="item" style="padding:22px 26px"><span class="ic" style="width:68px;height:68px;background:${fondo(C.necesidades)}">${ico(ic, C.necesidades, 38)}</span><span>${a}<small style="font-size:26px">${typeof b === 'function' ? b(r) : b}</small></span></div>`).join('')}</div>`;
const minutos = (t, n) => `<span style="font-size:26px;font-weight:700;color:${C.suave};border:1px solid ${C.borde};border-radius:999px;padding:6px 16px;white-space:nowrap">${icono('reloj', C.suave, 22)} ${n} ${t.min}</span>`;
const cabecera = (t, titulo, n) => `<div style="display:flex;justify-content:space-between;align-items:center;gap:20px"><h1>${titulo}</h1>${minutos(t, n).replace('<svg', '<svg style="vertical-align:-3px"')}</div>`;

module.exports = {
  slug: 'auditoria-suscripciones',
  T,
  diapositivas: [
    // 1 · Portada: lo que suman 7 cargos pequeños
    (t, lang) => { const r = R[lang]; return `<h1 class="grande">${t.s1.t}</h1><p class="lead">${t.s1.l}</p>
      <div class="tarjeta" style="margin-top:52px;padding:34px 32px">
        <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:10px">${r.subs.map(([ic, , c]) => `<div style="display:flex;flex-direction:column;align-items:center;gap:12px;padding:20px 0 16px;border-radius:18px;background:rgba(148,163,184,.07);border:1px solid ${C.borde}">
          ${ico(ic, C.texto, 40)}<span style="font-size:26px;font-weight:700;font-variant-numeric:tabular-nums">${dinero(c, lang)}</span></div>`).join('')}</div>
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-top:28px;padding-top:24px;border-top:1px solid ${C.borde}">
          <span style="font-size:28px;color:${C.texto};font-weight:600">${t.s1.pie(r.subs.length)}</span>
          <span style="text-align:right"><span style="display:block;font-size:56px;font-weight:800;letter-spacing:-.03em;color:${C.acento}">${dinero(r.ano, lang)}</span><span style="font-size:27px;color:${C.texto};font-weight:600">${t.ano} · ${dinero(r.mes, lang)} ${t.mes}</span></span></div>
      </div>`; },
    // 2 · Paso 1: dónde encontrarlas
    (t) => `${cabecera(t, t.s2.t, 4)}${lista(t.s2.items)}`,
    // 3 · Paso 2: conservar, pausar o cancelar
    (t) => `${cabecera(t, t.s3.t, 3)}<p class="lead">${t.s3.l}</p>
      <div style="margin-top:44px;display:flex;flex-direction:column;gap:18px">${t.s3.grupos.map(([k, txt]) => `<div class="tarjeta" style="display:flex;align-items:center;gap:26px;padding:28px 30px;border-color:${COLOR[k]}55">
        <span style="flex:0 0 auto;width:76px;height:76px;border-radius:20px;background:${fondo(COLOR[k])};display:inline-flex;align-items:center;justify-content:center">${ico(k, COLOR[k], 40, 2.6)}</span>
        <div><div style="font-size:34px;font-weight:800;color:${k === 'x' ? ROJO : k === 'p' ? '#e0a33a' : C.acento}">${t.tag[k]}</div><div style="font-size:29px;color:${C.texto};margin-top:6px;line-height:1.35">${txt}</div></div></div>`).join('')}</div>`,
    // 4 · El ejemplo, clasificado
    (t, lang) => { const r = R[lang]; return `<h1>${t.s4.t}</h1>
      <div class="tarjeta" style="margin-top:44px;padding:16px 32px">${r.subs.map(([ic, n, c, k]) => `<div style="display:grid;grid-template-columns:44px 1fr auto auto;gap:18px;align-items:center;padding:17px 0;border-bottom:1px solid ${C.borde}">
        ${ico(ic, C.texto, 34)}<span style="font-size:28px;font-weight:600;color:${C.tinta}">${n}</span>
        <span style="font-size:28px;font-weight:700;font-variant-numeric:tabular-nums;text-align:right">${dinero(c, lang)}</span>${etiqueta(t, k)}</div>`).join('')}
        <div style="display:flex;justify-content:space-between;align-items:baseline;padding:20px 0 12px"><span style="font-size:29px;font-weight:700">${t.s4.total}</span><span style="font-size:36px;font-weight:800;font-variant-numeric:tabular-nums">${dinero(r.mes, lang)} <span style="font-size:26px;color:${C.texto};font-weight:600">${t.mes}</span></span></div>
      </div><p class="nota">${t.s4.nota}</p>`; },
    // 5 · El ahorro en un año
    (t, lang) => { const r = R[lang]; return `<h1>${t.s5.t}</h1>
      <div class="tarjeta" style="margin-top:48px;padding:30px 34px">
        ${t.s5.filas(r).map(([a, calc, v, col]) => `<div class="fila"><span class="eti"><span class="punto" style="background:${col}"></span><span>${a}<small style="display:block;font-size:26px;color:${C.suave};margin-top:4px">${calc}</small></span></span><span class="val">${dinero(v, lang)}</span></div>`).join('')}
        <div class="fila" style="border-top:2px solid ${C.ahorro};margin-top:6px;padding-top:22px"><span class="eti" style="color:${C.tinta};font-weight:700">${t.s5.total}</span><span class="val" style="color:${C.acento};font-size:48px">${dinero(r.ahorro, lang)}</span></div>
      </div>
      <div class="tarjeta" style="margin-top:20px;padding:30px 34px">
        <div style="display:flex;justify-content:space-between;font-size:27px;color:${C.texto};font-weight:600;margin-bottom:14px"><span>${t.s5.antes}</span><span style="font-weight:800;color:${C.tinta}">${dinero(r.ano, lang)} ${t.ano}</span></div>
        <div class="barra" style="height:34px"><span style="flex:${r.sigues};background:${C.necesidades};border-radius:10px 4px 4px 10px"></span><span style="flex:${r.ahorro};background:${C.ahorro};border-radius:4px 10px 10px 4px"></span></div>
        <div style="display:flex;justify-content:space-between;margin-top:14px;font-size:27px;color:${C.texto}"><span><span class="punto" style="background:${C.necesidades};margin-right:10px"></span>${t.s5.sigues} <b style="color:${C.tinta}">${dinero(r.sigues, lang)}</b></span><span><span class="punto" style="background:${C.ahorro};margin-right:10px"></span>${t.s5.ahorras} <b style="color:${C.tinta}">${dinero(r.ahorro, lang)}</b></span></div>
      </div>`; },
    // 6 · Paso 3: actuar
    (t, lang) => `${cabecera(t, t.s6.t, 3)}${lista(t.s6.items, R[lang])}`,
    // 7 · Repetirlo
    (t) => `<h1>${t.s7.t}</h1>
      <div style="margin-top:48px;display:flex;align-items:center;gap:12px">${t.s7.pasos.map(([ic, n, m], i) => `${i ? `<span style="color:${C.suave};font-size:34px">→</span>` : ''}<div class="tarjeta" style="flex:1;display:flex;flex-direction:column;align-items:center;gap:12px;padding:30px 10px">
        ${icono(ic, C.necesidades, 46)}<span style="font-size:30px;font-weight:800">${n}</span><span style="font-size:26px;color:${C.suave};font-weight:600">${m} ${t.min}</span></div>`).join('')}</div>
      <p class="lead" style="margin-top:44px">${t.s7.l}</p>
      <p class="lead" style="margin-top:28px"><b>${t.s7.final}</b></p>`
  ].map(d => (t, lang) => PULIDO + d(t, lang)),
  texto: (() => { const e = R.en, s = R.es; const tx = {
    en: `Small monthly charges are easy to forget, and they add up. Here's a subscription audit you can do in 10 minutes. 🔍

Step 1 · Find them (4 min)
• Bank and card statements: look for charges that repeat over the last 3 months
• iPhone: Settings → your name → Subscriptions
• Android: Play Store → profile → Payments & subscriptions
• Your email: search "subscription", "renewal", "trial", "receipt"
• Check 12 months for yearly charges: annual renewals are the easiest to miss

Step 2 · Sort them (3 min)
Ask one question: would I sign up again today, at this price?
• Keep: yes, and I use it every week
• Pause: only some months of the year, so rotate it
• Cancel: unused, a duplicate, or a forgotten free trial

Our example: 7 subscriptions add up to ${dinero(e.mes, 'en')} a month, ${dinero(e.ano, 'en')} a year. Cancel 3 (${dinero(e.x, 'en')} a month × 12 = ${dinero(e.ahorroCancelar, 'en')}) and pause a second streaming service for 6 months (${dinero(e.p, 'en')} × 6 = ${dinero(e.ahorroPausar, 'en')}): that's ${dinero(e.ahorro, 'en')} saved in a year.

Step 3 · Act (3 min)
• Cancel where you signed up: deleting the app doesn't cancel the subscription
• Set a reminder two days before a free trial ends
• Go annual only for what you use all year: ${dinero(e.m, 'en')} a month is ${dinero(e.m12, 'en')} a year, vs. ${dinero(e.a, 'en')} on an annual plan
• Share a family plan at home, if the terms allow it

Then repeat it every 3 months. Prices in the example are illustrative.

Track your spending by category in FinanziApp and recurring charges are easier to spot each month (free for 15 days, link in bio).

#subscriptions #budgeting #personalfinance #moneytips #savemoney`,
    es: `Los cargos pequeños de cada mes se olvidan fácil, y suman. Aquí tienes una revisión de suscripciones que puedes hacer en 10 minutos. 🔍

Paso 1 · Encuéntralas (4 min)
• Extractos del banco y la tarjeta: busca cargos que se repiten en los últimos 3 meses
• iPhone: Ajustes → tu nombre → Suscripciones
• Android: Google Play → perfil → Pagos y suscripciones
• Tu correo: busca «suscripción», «renovación», «prueba», «recibo»
• Revisa 12 meses para ver los cargos anuales: son los que más se escapan

Paso 2 · Clasifícalas (3 min)
Hazte una pregunta: ¿me daría de alta hoy, a este precio?
• Conservar: sí, y la uso cada semana
• Pausar: solo algunos meses al año, así que ve rotándola
• Cancelar: sin uso, repetida o una prueba gratis olvidada

Nuestro ejemplo: 7 suscripciones suman ${dinero(s.mes, 'es')} al mes, ${dinero(s.ano, 'es')} al año. Cancelando 3 (${dinero(s.x, 'es')} al mes × 12 = ${dinero(s.ahorroCancelar, 'es')}) y pausando una segunda plataforma de vídeo 6 meses (${dinero(s.p, 'es')} × 6 = ${dinero(s.ahorroPausar, 'es')}), ahorras ${dinero(s.ahorro, 'es')} en un año.

Paso 3 · Actúa (3 min)
• Cancela donde te diste de alta: borrar la app no cancela la suscripción
• Pon un aviso dos días antes de que acabe una prueba gratis
• Plan anual solo si lo usas todo el año: ${dinero(s.m, 'es')} al mes son ${dinero(s.m12, 'es')} al año, frente a ${dinero(s.a, 'es')} con el plan anual
• Comparte un plan familiar en casa, si las condiciones lo permiten

Y repítelo cada 3 meses. Los precios del ejemplo son ilustrativos.

Si apuntas tus gastos por categorías en FinanziApp, los cargos que se repiten se ven mejor cada mes (gratis 15 días, enlace en la bio).

#suscripciones #presupuesto #finanzaspersonales #ahorro #educacionfinanciera`
  }; for (const k in tx) tx[k] = tx[k].replace(/ /g, ' '); return tx; })()
};
