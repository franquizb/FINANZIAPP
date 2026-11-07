// Carrusel educativo: cómo leer la nómina. Contenido distinto por país con la
// misma estructura: inglés con un pay stub de EE. UU. (dólares), español con una
// nómina española (euros). Todo se calcula en céntimos y se comprueba al cargar.
const { C, icono } = require('../comun');

const ROJO = '#e66767', NEUTRO = 'rgba(148,163,184,.45)';

// ── Cifras de ejemplo ─────────────────────────────────────────────────────────
// EE. UU.: 52.000 $ al año cobrados cada dos semanas (26 pagas).
const US = { anual: 52000, pagas: 26, k401: 0.05, salud: 10000, federal: 14000, estatal: 6000, ss: 0.062, medicare: 0.0145 };
US.bruto = US.anual * 100 / US.pagas;                       // céntimos
US.k = Math.round(US.bruto * US.k401);
US.baseRenta = US.bruto - US.k - US.salud;                   // lo que tributa en el impuesto sobre la renta
US.baseFica = US.bruto - US.salud;                           // la prima sanitaria antes de impuestos también reduce FICA; el 401(k), no
US.cSS = Math.round(US.baseFica * US.ss);
US.cMed = Math.round(US.baseFica * US.medicare);
US.fica = US.cSS + US.cMed;
US.impuestos = US.federal + US.estatal + US.fica;
US.neto = US.bruto - US.k - US.salud - US.impuestos;
// España: 28.800 € al año en 12 pagas.
const ES = { anual: 28800, base: 210000, complementos: 30000, irpf: 0.16, ss: 0.065 };
ES.bruto = ES.base + ES.complementos;
ES.cIrpf = Math.round(ES.bruto * ES.irpf);
ES.cSS = Math.round(ES.bruto * ES.ss);
ES.neto = ES.bruto - ES.cIrpf - ES.cSS;
ES.mes14 = ES.anual * 100 / 14;

const comprobar = (ok, msg) => { if (!ok) throw new Error('leer-tu-nomina: ' + msg); };
comprobar(Number.isInteger(US.bruto) && US.bruto === 200000, 'bruto EE. UU.');
comprobar(US.cSS === 11780 && US.cMed === 2755 && US.neto === 145465, 'FICA o neto EE. UU.');
comprobar(US.bruto - US.k - US.salud - US.federal - US.estatal - US.cSS - US.cMed === US.neto, 'la nómina EE. UU. no suma');
comprobar(ES.bruto * 12 === ES.anual * 100, 'bruto anual España');
comprobar(ES.cIrpf === 38400 && ES.cSS === 15600 && ES.neto === 186000, 'nómina España');
// La portada usa cifras redondeadas: tienen que seguir sumando.
const r = (c) => Math.round(c / 100);
comprobar(r(US.bruto) - r(US.k) - r(US.salud) - r(US.impuestos) === r(US.neto), 'portada EE. UU. no suma redondeada');
comprobar(r(ES.bruto) - r(ES.cIrpf) - r(ES.cSS) === r(ES.neto), 'portada España no suma redondeada');

const agrupar = (n, sep) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, sep);
// Dinero a partir de céntimos; dec = 0 redondea a unidades.
function dinero(cent, lang, dec = 2) {
  const neg = cent < 0, a = Math.abs(cent);
  const ent = dec ? Math.floor(Math.round(a) / 100) : Math.round(a / 100), cts = String(Math.round(a) % 100).padStart(2, '0');
  const num = lang === 'en' ? agrupar(ent, ',') + (dec ? '.' + cts : '') : agrupar(ent, '.') + (dec ? ',' + cts : '');
  return (neg ? '−' : '') + (lang === 'en' ? '$' + num : num + ' €');
}
const pctTxt = (p, lang) => String(Math.round(p * 10000) / 100).replace('.', lang === 'en' ? '.' : ',') + '%';

const T = {
  en: {
    kicker: 'MONEY BASICS', desliza: 'Swipe →',
    s1: { t: 'How to read your <span class="c">pay&nbsp;stub</span>', l: 'What happens between your gross pay and what actually lands in your account.',
      cascada: [['Gross', US.bruto, NEUTRO, 'total'], ['401(k)', -US.k, C.ahorro], ['Health', -US.salud, ROJO], ['Taxes', -US.impuestos, ROJO], ['Net pay', US.neto, C.necesidades, 'total']] },
    s2: { t: 'Line 1: <span class="c">gross&nbsp;pay</span>', l: `Your salary divided by the number of paychecks in the year. Same ${dinero(US.anual * 100, 'en', 0)} salary:`,
      filas: [['Weekly', 52], ['Every two weeks', 26], ['Twice a month', 24], ['Monthly', 12]], pagas: 'paychecks', ejemplo: 'example',
      nota: 'Paid every two weeks? Most years, two months bring a third&nbsp;paycheck.' },
    s3: { t: 'Line 2: <span class="c">pre‑tax&nbsp;deductions</span>', l: 'They come out before income tax is calculated, so they shrink the pay you’re taxed on.',
      filas: [['Gross pay', null, US.bruto, null], [`401(k) · ${pctTxt(US.k401, 'en')}`, 'Your retirement savings', -US.k, C.ahorro], ['Health insurance', 'Your share of the premium', -US.salud, ROJO]],
      total: ['Taxable pay for income tax', US.baseRenta],
      nota: 'Your 401(k) is still your money. A Roth 401(k) is after‑tax, so it doesn’t lower this&nbsp;line.' },
    s4: { t: 'Line 3: <span class="c">income&nbsp;tax</span>', l: 'Your employer withholds part of each paycheck as a prepayment of your yearly income tax.',
      items: [['lupa', 'Federal: based on your W‑4', 'Filing status, dependents, other income and IRS tables'], ['brujula', 'State: depends on where you live', 'Some states, like Texas and Florida, have none'], ['calendario', 'Settled when you file', 'Too much withheld: refund. Too little: you owe']],
      nota: `In the example (illustrative): ${dinero(US.federal, 'en')} federal and ${dinero(US.estatal, 'en')} state. Source: IRS&nbsp;Publication&nbsp;15‑T.` },
    s5: { t: 'Line 4: <span class="c">FICA</span>', pct: pctTxt(US.ss + US.medicare, 'en'), pctL: 'Social Security and Medicare. Your employer pays the same again on top.',
      cab: `On ${dinero(US.baseFica, 'en', 0)} of pay`,
      filas: [[`Social Security · ${pctTxt(US.ss, 'en')}`, 'Retirement, disability and survivor benefits', -US.cSS], [`Medicare · ${pctTxt(US.medicare, 'en')}`, 'Health insurance from age 65', -US.cMed]],
      total: ['FICA', -US.fica],
      nota: 'Why $1,900? Pre‑tax health premiums also lower FICA wages; 401(k) contributions don’t. Source: IRS Topic 751.' },
    s6: { t: 'Example: <span class="c">one&nbsp;paycheck</span>',
      filas: [['Gross pay', US.bruto, null, 'negrita'], [`401(k) · ${pctTxt(US.k401, 'en')}`, -US.k, C.ahorro], ['Health insurance', -US.salud, ROJO], ['Federal income tax', -US.federal, ROJO], ['State income tax', -US.estatal, ROJO], [`Social Security · ${pctTxt(US.ss, 'en')}`, -US.cSS, ROJO], [`Medicare · ${pctTxt(US.medicare, 'en')}`, -US.cMed, ROJO]],
      total: 'Net pay', parte: (p) => `${p}% of gross`,
      nota: `Illustrative: ${dinero(US.anual * 100, 'en', 0)} salary paid every two weeks. Your withholding depends on your W‑4 and your state.` },
    s7: { t: 'Check it <span class="c">every&nbsp;payday</span>', items: [['Gross pay is right', 'Especially after a raise or a change in hours'], ['Withholding fits your life', 'Update your W‑4 when your situation changes'], ['You get the full 401(k) match', 'If your employer offers one, it’s part of your pay'], ['Read the YTD column', 'Year‑to‑date totals: the whole year so far']],
      final: 'Build your budget on net pay, not on your&nbsp;salary.' }
  },
  es: {
    kicker: 'FINANZAS BÁSICAS', desliza: 'Desliza →',
    s1: { t: 'Cómo leer tu <span class="c">nómina</span>', l: 'Qué pasa entre tu salario bruto y lo que de verdad llega a tu cuenta.',
      cascada: [['Bruto', ES.bruto, NEUTRO, 'total'], ['IRPF', -ES.cIrpf, ROJO], ['Seg. Social', -ES.cSS, ROJO], ['Neto', ES.neto, C.necesidades, 'total']] },
    s2: { t: 'El bruto: <span class="c">12 o 14&nbsp;pagas</span>', l: `Tu sueldo anual, repartido en 12 o en 14 pagas. Mismo salario de ${dinero(ES.anual * 100, 'es', 0)} al año:`,
      p12: '12 pagas', p14: '14 pagas', alMes: 'al mes', extra: '+ 2 extra', meses: 'EFMAMJJASOND',
      nota: 'El Estatuto de los Trabajadores fija dos pagas extra al año: una en Navidad y otra según tu convenio (a menudo en verano). Pueden prorratearse en&nbsp;12.' },
    s3: { t: 'Devengos: <span class="c">lo que ganas</span>', l: 'La parte de arriba de la nómina: todo lo que ganas en el mes, antes de descuentos.',
      filas: [['Salario base', 'El que fija tu convenio para tu categoría', ES.base], ['Complementos', 'Antigüedad, pluses, horas extra…', ES.complementos]],
      total: ['Total devengado (bruto)', ES.bruto],
      nota: 'Con 14 pagas prorrateadas, aquí aparece también la parte proporcional de las pagas extra.' },
    s4: { t: 'Deducción 1: <span class="c">el&nbsp;IRPF</span>', l: 'Tu empresa adelanta cada mes a Hacienda una parte de tu impuesto sobre la renta.',
      items: [['barras', 'Depende de cuánto ganas', 'Cuanto más alto el salario, mayor el porcentaje'], ['casa', 'Y de tu situación personal', 'Hijos, discapacidad… Se comunica con el modelo 145'], ['calendario', 'Se ajusta en la declaración de la renta', 'Si te retuvieron de más, te devuelven; si no, pagas']],
      nota: `En el ejemplo, ${pctTxt(ES.irpf, 'es')} de ${dinero(ES.bruto, 'es', 0)} = ${dinero(ES.cIrpf, 'es', 0)}: un porcentaje ilustrativo. El tuyo aparece en tu nómina. Fuente: Agencia Tributaria.` },
    s5: { t: 'Deducción 2: <span class="c">la&nbsp;Seguridad&nbsp;Social</span>', pct: '≈' + pctTxt(ES.ss, 'es'), pctL: 'del bruto, aproximadamente. Cambia un poco cada año.',
      cab: `Sobre ${dinero(ES.bruto, 'es', 0)} brutos`,
      filas: [['Contingencias comunes', 'Pensiones y bajas, entre otras'], ['Desempleo', 'La prestación por paro'], ['Formación profesional', 'Formación para el empleo'], ['MEI', 'Mecanismo de Equidad Intergeneracional']],
      total: ['Total', -ES.cSS],
      nota: 'La empresa paga además su propia parte, bastante mayor. Fuente: Seguridad Social, bases y tipos de cotización.' },
    s6: { t: 'Ejemplo: <span class="c">una&nbsp;nómina</span>',
      filas: [['Salario base', ES.base, null], ['Complementos', ES.complementos, null], ['Total devengado', ES.bruto, null, 'subtotal'], [`IRPF · ${pctTxt(ES.irpf, 'es')}`, -ES.cIrpf, ROJO], [`Seguridad Social · ${pctTxt(ES.ss, 'es')}`, -ES.cSS, ROJO]],
      total: 'Líquido a percibir', parte: (p) => `${p}% del bruto`,
      nota: `Ejemplo ilustrativo: ${dinero(ES.anual * 100, 'es', 0)} brutos al año en 12 pagas. Tu IRPF depende de tu situación personal.` },
    s7: { t: 'Revísala <span class="c">cada&nbsp;mes</span>', items: [['Tu categoría y salario base', 'Compáralos con tu convenio colectivo'], ['Tu porcentaje de IRPF', 'Si cambia tu situación, actualiza el modelo 145'], ['Las pagas extra', 'Si van prorrateadas o aparte, y cuándo llegan'], ['Guarda tus nóminas', 'Te las pedirán para un alquiler o una hipoteca']],
      final: 'Haz tu presupuesto con el neto, no con el&nbsp;bruto.' }
  }
};
// Las cascadas de la portada tienen que cerrar en el neto.
for (const lang of ['en', 'es']) {
  const c = T[lang].s1.cascada;
  comprobar(c.slice(0, -1).reduce((s, x) => s + x[1], 0) === c[c.length - 1][1], 'cascada ' + lang);
}

const estilo = '<style>@media (max-height:1400px){.item small{font-size:26px}}</style>';
const fondo = (c) => c + '26';
const punto = (color) => `<span class="punto" style="background:${color || 'transparent'};flex:0 0 auto"></span>`;

// Cascada: del bruto al neto, con etiquetas directas encima (importe) y debajo (concepto).
function cascada(cols, lang) {
  const W = 900, H = 470, pt = 60, pb = 58, alto = H - pt - pb;
  const max = cols[0][1], y = (v) => pt + (1 - v / max) * alto;
  const slot = W / cols.length, bw = Math.min(132, slot * 0.62);
  let nivel = 0; const piezas = [];
  cols.forEach(([nombre, v, color, tipo], i) => {
    const x = i * slot + (slot - bw) / 2;
    const [a, b] = tipo === 'total' ? [v, 0] : [nivel, nivel + v];
    const top = y(Math.max(a, b)), h = Math.max(4, y(Math.min(a, b)) - top);
    piezas.push(`<rect x="${x.toFixed(1)}" y="${top.toFixed(1)}" width="${bw.toFixed(1)}" height="${h.toFixed(1)}" rx="4" fill="${color}"/>`);
    piezas.push(`<text x="${(x + bw / 2).toFixed(1)}" y="${(top - 16).toFixed(1)}" text-anchor="middle" font-size="31" font-weight="800" fill="${C.tinta}">${dinero(v, lang, 0)}</text>`);
    piezas.push(`<text x="${(x + bw / 2).toFixed(1)}" y="${H - 12}" text-anchor="middle" font-size="28" font-weight="600" fill="${C.texto}">${nombre}</text>`);
    const fin = tipo === 'total' ? v : nivel + v;
    if (i < cols.length - 1) piezas.push(`<line x1="${(x + bw).toFixed(1)}" x2="${((i + 1) * slot + (slot - bw) / 2).toFixed(1)}" y1="${y(fin).toFixed(1)}" y2="${y(fin).toFixed(1)}" stroke="${C.suave}" stroke-opacity=".6" stroke-width="2" stroke-dasharray="6 6"/>`);
    nivel = fin;
  });
  return `<svg width="100%" viewBox="0 0 ${W} ${H}" style="display:block">
    <line x1="0" x2="${W}" y1="${y(0)}" y2="${y(0)}" stroke="rgba(148,163,184,.25)" stroke-width="2"/>${piezas.join('')}</svg>`;
}

// Fila de importe con concepto, subtítulo opcional y punto de color.
const fila = (nombre, sub, valor, color, lang, extra = '') => `<div class="fila" style="align-items:center;padding:17px 0;${extra}">
  <span class="eti">${color !== undefined ? punto(color) : ''}<span>${nombre}${sub ? `<small style="display:block;font-size:26px;color:${C.suave};margin-top:2px">${sub}</small>` : ''}</span></span>
  <span class="val" style="color:${valor < 0 ? C.texto : C.tinta}">${dinero(valor, lang)}</span></div>`;
const filaTotal = (nombre, valor, lang, color = C.acento) => `<div class="fila" style="border-top:2px solid ${C.necesidades};margin-top:6px;padding-top:22px">
  <span class="eti" style="color:${C.tinta};font-weight:700">${nombre}</span><span class="val" style="color:${color};font-size:44px">${dinero(valor, lang)}</span></div>`;
const cabecera = (txt) => `<div style="font-size:24px;font-weight:800;letter-spacing:.06em;color:${C.suave};margin-bottom:4px">${txt.toUpperCase()}</div>`;

// Paso 2 en español: 12 pagas frente a 14 (dos extra en junio y diciembre).
function pagas(t, lang) {
  const W = 900, H = 168, max = 2 * ES.mes14, slot = W / 12, bw = slot - 12;
  const bloque = (titulo, valorTxt, cols) => `<div style="margin-top:6px">
    <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:10px"><span style="font-size:30px;font-weight:800">${titulo}</span><span style="font-size:30px;font-weight:800;font-variant-numeric:tabular-nums">${valorTxt}</span></div>
    <svg width="100%" viewBox="0 0 ${W} ${H + 40}" style="display:block">${cols.map(([v, extra], i) => {
      const x = i * slot + 6, h = v / max * H, he = extra / max * H;
      return `<rect x="${x}" y="${H - h}" width="${bw}" height="${h}" rx="4" fill="${C.necesidades}"/>${extra ? `<rect x="${x}" y="${H - h - he - 3}" width="${bw}" height="${he}" rx="4" fill="${C.acento}"/>` : ''}
        <text x="${x + bw / 2}" y="${H + 34}" text-anchor="middle" font-size="26" font-weight="600" fill="${C.suave}">${t.s2.meses[i]}</text>`; }).join('')}</svg></div>`;
  const doce = Array.from({ length: 12 }, () => [ES.anual * 100 / 12, 0]);
  const catorce = Array.from({ length: 12 }, (_, i) => [ES.mes14, i === 5 || i === 11 ? ES.mes14 : 0]);
  return `<div class="tarjeta" style="margin-top:40px;padding:32px 36px 22px">
    ${bloque(t.s2.p12, `${dinero(ES.anual * 100 / 12, lang)} <span style="font-size:26px;color:${C.suave};font-weight:600">${t.s2.alMes}</span>`, doce)}
    <div style="height:18px"></div>
    ${bloque(t.s2.p14, `${dinero(ES.mes14, lang)} <span style="font-size:26px;color:${C.suave};font-weight:600">${t.s2.alMes}</span> <span style="font-size:26px;color:${C.acento};font-weight:700">${t.s2.extra}</span>`, catorce)}
  </div>`;
}

module.exports = {
  slug: 'leer-tu-nomina',
  T,
  diapositivas: [
    // 1 · Portada: cascada del bruto al neto
    (t, lang) => `<h1 class="grande">${t.s1.t}</h1><p class="lead">${t.s1.l}</p>
      <div class="tarjeta" style="margin-top:52px;padding:34px 34px 26px">${cascada(t.s1.cascada, lang)}</div>`,
    // 2 · El bruto (EN: frecuencia de pago · ES: 12 o 14 pagas)
    (t, lang) => lang === 'en'
      ? `<h1>${t.s2.t}</h1><p class="lead">${t.s2.l}</p>
        <div class="tarjeta" style="margin-top:44px">${t.s2.filas.map(([n, p], i) => { const v = US.anual * 100 / p, ej = p === US.pagas;
          return `<div class="fila" style="align-items:center;padding:18px 0"><span class="eti"><span>${n}<small style="display:block;font-size:26px;color:${C.suave};margin-top:2px">${p} ${t.s2.pagas}</small></span>${ej ? `<span style="font-size:22px;font-weight:800;letter-spacing:.06em;color:${C.acento};border:1px solid ${C.necesidades};border-radius:999px;padding:4px 14px">${t.s2.ejemplo.toUpperCase()}</span>` : ''}</span>
            <span class="val" style="color:${ej ? C.acento : C.tinta}">${dinero(v, lang)}</span></div>`; }).join('')}</div>
        <p class="nota">${t.s2.nota}</p>`
      : `<h1>${t.s2.t}</h1><p class="lead">${t.s2.l}</p>${pagas(t, lang)}<p class="nota">${t.s2.nota}</p>`,
    // 3 · EN: deducciones antes de impuestos · ES: devengos
    (t, lang) => `<h1>${t.s3.t}</h1><p class="lead">${t.s3.l}</p>
      <div class="tarjeta" style="margin-top:44px">${t.s3.filas.map(([n, sub, v, color]) => fila(n, sub, v, color, lang)).join('')}${filaTotal(t.s3.total[0], t.s3.total[1], lang)}</div>
      <p class="nota">${t.s3.nota}</p>`,
    // 4 · Retención del impuesto sobre la renta
    (t) => `${estilo}<h1>${t.s4.t}</h1><p class="lead">${t.s4.l}</p>
      <div style="margin-top:40px;display:flex;flex-direction:column;gap:16px">${t.s4.items.map(([ic, a, b]) => `<div class="item"><span class="ic" style="background:${fondo(C.necesidades)}">${icono(ic, C.necesidades, 42)}</span><span>${a}<small>${b}</small></span></div>`).join('')}</div>
      <p class="nota" style="margin-top:26px">${t.s4.nota}</p>`,
    // 5 · Cotizaciones (EN: FICA · ES: Seguridad Social)
    (t, lang) => `<h1>${t.s5.t}</h1>
      <div style="margin-top:30px;display:flex;align-items:center;gap:30px"><span class="pct" style="color:${ROJO};flex:0 0 auto">${t.s5.pct}</span><span style="font-size:30px;line-height:1.4;color:${C.texto};font-weight:500">${t.s5.pctL}</span></div>
      <div class="tarjeta" style="margin-top:34px;padding:28px 36px">${cabecera(t.s5.cab)}
        ${t.s5.filas.map(([n, sub, v]) => v === undefined
          ? `<div class="fila" style="padding:15px 0"><span class="eti"><span>${n}<small style="display:block;font-size:26px;color:${C.suave};margin-top:2px">${sub}</small></span></span></div>`
          : fila(n, sub, v, undefined, lang)).join('')}
        ${filaTotal(t.s5.total[0], t.s5.total[1], lang, C.tinta)}</div>
      <p class="nota">${t.s5.nota}</p>`,
    // 6 · La nómina completa
    (t, lang) => { const bruto = lang === 'en' ? US.bruto : ES.bruto, neto = lang === 'en' ? US.neto : ES.neto;
      return `<h1>${t.s6.t}</h1>
      <div class="tarjeta" style="margin-top:40px;padding:22px 36px 26px">${t.s6.filas.map(([n, v, color, estiloFila]) =>
        `<div class="fila" style="align-items:center;padding:${lang === 'en' ? 14 : 18}px 0;${estiloFila === 'subtotal' ? `border-top:1px solid ${C.suave};` : ''}"><span class="eti" style="${estiloFila ? `color:${C.tinta};font-weight:700` : ''}">${punto(color)}${n}</span><span class="val" style="color:${v < 0 ? C.texto : C.tinta}">${dinero(v, lang)}</span></div>`).join('')}
        ${filaTotal(t.s6.total, neto, lang)}
        <div style="text-align:right;font-size:26px;color:${C.suave};font-weight:600;margin-top:2px">${t.s6.parte(Math.round(neto / bruto * 100))}</div></div>
      <p class="nota">${t.s6.nota}</p>`; },
    // 7 · Qué revisar
    (t) => `${estilo}<h1>${t.s7.t}</h1>
      <div style="margin-top:44px;display:flex;flex-direction:column;gap:14px">${t.s7.items.map(([a, b], i) => `<div class="item"><span class="ic" style="background:${fondo(C.necesidades)};font-size:30px;font-weight:800;color:${C.acento}">${i + 1}</span><span>${a}<small>${b}</small></span></div>`).join('')}</div>
      <p class="lead" style="margin-top:40px"><b>${t.s7.final}</b></p>`
  ],
  texto: {
    en: `Your salary and your paycheck are two different numbers. Here's how to read the pay stub in between. 🧾

Line 1, gross pay: your salary divided by the number of paychecks. ${dinero(US.anual * 100, 'en', 0)} a year paid every two weeks is ${dinero(US.bruto, 'en', 0)} per paycheck (26 a year). Paid biweekly? Most years, two months bring a third paycheck.

Line 2, pre-tax deductions: in our example, ${pctTxt(US.k401, 'en')} to a traditional 401(k) (${dinero(US.k, 'en', 0)}) and ${dinero(US.salud, 'en', 0)} for health insurance. They come out before income tax, so you're taxed on ${dinero(US.baseRenta, 'en', 0)}.

Line 3, income tax: federal withholding depends on your W-4 and the IRS tables; state withholding depends on where you live (Texas and Florida, for example, have no state income tax). It's a prepayment that gets settled when you file.

Line 4, FICA: Social Security ${pctTxt(US.ss, 'en')} and Medicare ${pctTxt(US.medicare, 'en')}, ${pctTxt(US.ss + US.medicare, 'en')} in total, and your employer pays the same again. Here: ${dinero(US.cSS, 'en')} + ${dinero(US.cMed, 'en')} = ${dinero(US.fica, 'en')}, calculated on ${dinero(US.baseFica, 'en', 0)}, because pre-tax health premiums also lower FICA wages but 401(k) contributions don't.

Result: ${dinero(US.bruto, 'en')} gross → ${dinero(US.neto, 'en')} net, about ${Math.round(US.neto / US.bruto * 100)}%. The federal (${dinero(US.federal, 'en', 0)}) and state (${dinero(US.estatal, 'en', 0)}) amounts are illustrative; yours depend on your W-4 and your state.

Every payday, check your gross pay, your withholding, your 401(k) match and the year-to-date totals. And build your budget on net pay, not on your salary.

Sources: IRS Topic No. 751 (Social Security and Medicare withholding rates) and IRS Publication 15-T.

In FinanziApp you log the pay that actually reaches your account and plan your budget from there (free for 15 days, link in bio).

#paystub #personalfinance #moneybasics #financialliteracy #budgeting`,
    es: `Tu salario y lo que cobras cada mes son dos cifras distintas. Así se lee la nómina que hay en medio. 🧾

El bruto: tu sueldo anual repartido en 12 o en 14 pagas. Con ${dinero(ES.anual * 100, 'es', 0)} al año son ${dinero(ES.bruto, 'es', 0)} al mes en 12 pagas, o ${dinero(ES.mes14, 'es')} al mes en 14 pagas, con dos pagas extra. El Estatuto de los Trabajadores fija dos al año: una en Navidad y otra según tu convenio. Pueden prorratearse en 12.

Devengos: lo que ganas en el mes (salario base, complementos…). En el ejemplo, ${dinero(ES.base, 'es', 0)} + ${dinero(ES.complementos, 'es', 0)} = ${dinero(ES.bruto, 'es', 0)} brutos.

IRPF: tu empresa adelanta cada mes a Hacienda una parte de tu impuesto sobre la renta. El porcentaje depende de lo que ganas y de tu situación personal (hijos, discapacidad…), que comunicas con el modelo 145, y se ajusta en la declaración de la renta. En el ejemplo, un ${pctTxt(ES.irpf, 'es')} ilustrativo: ${dinero(ES.cIrpf, 'es', 0)}.

Seguridad Social: alrededor del ${pctTxt(ES.ss, 'es')} del bruto, entre contingencias comunes, desempleo, formación profesional y el MEI, que cambia un poco cada año. En el ejemplo, ${dinero(ES.cSS, 'es', 0)}. La empresa paga además su propia parte, bastante mayor.

Resultado: ${dinero(ES.bruto, 'es', 0)} brutos → ${dinero(ES.neto, 'es', 0)} netos (el «líquido a percibir»).

Revisa cada mes tu categoría y tu salario base según el convenio, tu porcentaje de IRPF y las pagas extra, y guarda tus nóminas. Y haz tu presupuesto con el neto, no con el bruto.

Fuentes: Seguridad Social (bases y tipos de cotización), Agencia Tributaria y Estatuto de los Trabajadores (art. 31).

En FinanziApp apuntas lo que de verdad llega a tu cuenta y planificas tu presupuesto a partir de ahí (gratis 15 días, enlace en la bio).

#nomina #finanzaspersonales #educacionfinanciera #sueldo #ahorro`
  }
};
