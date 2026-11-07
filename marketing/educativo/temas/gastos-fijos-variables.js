// Carrusel educativo: gastos fijos, variables e irregulares (qué son, cómo
// encontrarlos, un ejemplo con su peso y cómo planificar los anuales).
// Inglés en dólares (EE. UU.), español en euros (España). Las cifras se
// calculan y se comprueban aquí al cargar.
const { C, barra } = require('../comun');

const agrupar = (n, sep) => String(Math.round(Math.abs(n))).replace(/\B(?=(\d{3})+(?!\d))/g, sep);
const dinero = (n, lang) => (n < 0 ? '−' : '') + (lang === 'en' ? '$' + agrupar(n, ',') : agrupar(n, '.') + ' €');
const plano = (s) => s.replace(/ /g, ' ');
// Une las dos últimas palabras con un espacio de no separación (evita palabras sueltas en la última línea).
const nb = (s) => s.replace(/ (?=(?:<[^>]*>)?[^ <>]*(?:<\/[^>]+>)?$)/, ' ');
// Minúscula inicial en listas dentro de una frase (respeta nombres propios como Navidad).
const minus = (n) => /^Navidad/.test(n) ? n : n[0].toLowerCase() + n.slice(1);
const mayus = (s) => s[0].toUpperCase() + s.slice(1);
const suma = (filas) => filas.reduce((s, [, v]) => s + v, 0);
const COL = { f: C.necesidades, v: C.caprichos, i: C.ahorro };

const T = {
  en: {
    kicker: 'BUDGETING BASICS', desliza: 'Swipe →', meses: 'JFMAMJJASOND',
    tipo: { f: 'Fixed', v: 'Variable', i: 'Irregular' },
    s1: { t: 'Fixed, variable and <span class="c">irregular expenses</span>', l: 'Three kinds of spending, each planned a different way. Here’s how to tell them apart.',
      desc: { f: 'Same every month', v: 'Varies every month', i: 'A few times a year' } },
    s2: { t: 'Three kinds of <span class="c">expenses</span>',
      defs: { f: ['Same amount, every month.', 'Rent or mortgage · car payment · phone & internet · subscriptions · loan payments'],
        v: ['Changes from month to month.', 'Groceries · gas · utilities · eating out · shopping'],
        i: ['Once or a few times a year.', 'Vacation · holidays & gifts · car insurance billed every 6 months · car repairs · annual memberships'] } },
    s3: { t: 'How to find them in <span class="c">your statements</span>', l: 'Take last month’s bank and card statements and tag each charge.',
      mov: [['Mar 1', 'Rent', 1350, 'f'], ['Mar 3', 'Supermarket', 86, 'v'], ['Mar 5', 'Gas station', 42, 'v'], ['Mar 8', 'Phone & internet', 130, 'f'], ['Mar 15', 'Car insurance (6 months)', 480, 'i'], ['Mar 21', 'Restaurant', 38, 'v']],
      mes: 3, nota: 'One month misses most irregular costs. For those, look back over the last 12 months.' },
    s4: { t: (x) => `Example: <span class="c">${x}</span> a month`, divide: 'Irregular (÷ 12)', anual: (x) => `${x} a year`,
      nota: 'Example numbers. Irregular costs count as a monthly share: the yearly total ÷ 12.' },
    s5: { t: 'Why this <span class="c">matters</span>', anual: 'a year',
      casos: [['f', 'Where the big savings usually are', (a, b) => `A phone plan ${a} cheaper a month saves ${b} a year, with one call.`, 40, 12, 1],
        ['v', 'Where your daily decisions are', (a, b) => `Spending ${a} less a week on eating out saves ${b} a year, over 52 decisions.`, 10, 52, 52]],
      deci: (n) => n === 1 ? '1 decision' : `${n} decisions`,
      nota: 'Housing and transportation are the two largest spending categories for U.S. households (BLS, Consumer Expenditure Survey).' },
    s6: { t: 'Irregular costs: <span class="c">divide by 12</span>', l: 'Add up what you pay once or a few times a year, and set aside a twelfth every month.',
      cab: ['Per year', 'Per month'], total: 'Total',
      final: (m) => `Move ${m} a month to a separate savings account. When the bill arrives, the money is already there.` },
    s7: { t: 'Put it into <span class="c">practice</span>',
      items: [['f', 'Fixed: review them once a year', 'Compare insurance, phone plans and subscriptions'], ['v', 'Variable: set a monthly limit', 'And check it weekly, while you can still adjust'], ['i', 'Irregular: set aside 1/12 a month', 'In a separate account, ready when the bill comes']],
      letra: { f: 'F', v: 'V', i: 'I' }, final: 'Start with last month’s statements: tag every charge F, V or I.' },
    ej: {
      f: [['Rent', 1350], ['Car payment', 330], ['Phone & internet', 130], ['Student loan', 130], ['Gym & streaming', 60]],
      v: [['Groceries', 500], ['Gas', 150], ['Utilities', 150], ['Eating out', 250], ['Shopping & other', 150]],
      i: [['Vacation', 1200, [7]], ['Car insurance', 960, [3, 9]], ['Holidays & gifts', 840, [12]], ['Car repairs & registration', 360, [5]], ['Annual memberships', 240, [1]]],
      vMeses: [1150, 1080, 1220, 1190, 1260, 1170, 1310, 1240, 1130, 1180, 1200, 1270],
      esperado: { f: 2000, v: 1200, i: 300, total: 3500, pct: [57, 34, 9] }
    }
  },
  es: {
    kicker: 'PRESUPUESTO BÁSICO', desliza: 'Desliza →', meses: 'EFMAMJJASOND',
    tipo: { f: 'Fijos', v: 'Variables', i: 'Irregulares' },
    s1: { t: 'Gastos fijos, variables <span class="c">e irregulares</span>', l: 'Tres tipos de gasto, y cada uno se planifica de una forma. Así se distinguen.',
      desc: { f: 'Igual cada mes', v: 'Cambia cada mes', i: 'Pocas veces al año' } },
    s2: { t: 'Tres tipos de <span class="c">gasto</span>',
      defs: { f: ['La misma cantidad, cada mes.', 'Alquiler o hipoteca · préstamos · seguros mensuales · móvil e internet · suscripciones'],
        v: ['Cambian de un mes a otro.', 'Comida · luz, agua y gas · gasolina · comer fuera · compras'],
        i: ['Una o pocas veces al año.', 'Vacaciones · Navidad y regalos · seguro anual del coche · ITV y revisiones · dentista y gafas'] } },
    s3: { t: 'Cómo encontrarlos en <span class="c">tus extractos</span>', l: 'Coge los movimientos del mes pasado de tu banco y tus tarjetas, y etiqueta cada cargo.',
      mov: [['1 mar', 'Alquiler', 800, 'f'], ['3 mar', 'Supermercado', 64, 'v'], ['5 mar', 'Gasolinera', 45, 'v'], ['8 mar', 'Móvil e internet', 50, 'f'], ['15 mar', 'Seguro del coche (anual)', 420, 'i'], ['21 mar', 'Restaurante', 32, 'v']],
      mes: 3, nota: 'Un solo mes no recoge casi ningún gasto irregular. Para esos, revisa los últimos 12 meses.' },
    s4: { t: (x) => `Ejemplo: <span class="c">${x}</span> al mes`, divide: 'Irregulares (÷ 12)', anual: (x) => `${x} al año`,
      nota: 'Cifras de ejemplo. Los gastos irregulares cuentan por su parte mensual: el total del año ÷ 12.' },
    s5: { t: 'Por qué importa <span class="c">la diferencia</span>', anual: 'al año',
      casos: [['f', 'Donde suele estar el gran ahorro', (a, b) => `Una tarifa de móvil ${a} más barata al mes ahorra ${b} al año, con una sola llamada.`, 20, 12, 1],
        ['v', 'Donde están tus decisiones diarias', (a, b) => `Gastar ${a} menos a la semana en comer fuera ahorra ${b} al año, en 52 decisiones.`, 5, 52, 52]],
      deci: (n) => n === 1 ? '1 decisión' : `${n} decisiones`,
      nota: 'La vivienda, con sus suministros, es el mayor grupo de gasto de los hogares en España (INE, Encuesta de Presupuestos Familiares).' },
    s6: { t: 'Gastos irregulares: <span class="c">divide entre 12</span>', l: 'Suma lo que pagas una o pocas veces al año y aparta la doceava parte cada mes.',
      cab: ['Al año', 'Al mes'], total: 'Total',
      final: (m) => `Pasa ${m} al mes a una cuenta de ahorro aparte. Cuando llegue el recibo, el dinero ya estará ahí.` },
    s7: { t: 'Ponlo en <span class="c">práctica</span>',
      items: [['f', 'Fijos: revísalos una vez al año', 'Compara seguros, tarifas y suscripciones'], ['v', 'Variables: ponles un límite al mes', 'Y míralo cada semana, cuando aún puedes ajustar'], ['i', 'Irregulares: aparta 1/12 cada mes', 'En una cuenta aparte, listo para cuando llegue el recibo']],
      letra: { f: 'F', v: 'V', i: 'I' }, final: 'Empieza con los extractos del mes pasado: marca cada cargo con F, V o I.' },
    ej: {
      f: [['Alquiler', 800], ['Préstamo del coche', 220], ['Seguros de hogar y salud', 90], ['Móvil e internet', 50], ['Gimnasio y plataformas', 40]],
      v: [['Comida', 380], ['Luz, agua y gas', 110], ['Gasolina y transporte', 110], ['Comer fuera', 150], ['Compras y otros', 100]],
      i: [['Vacaciones', 960, [8]], ['Navidad y regalos', 480, [12]], ['Seguro del coche', 420, [3]], ['Revisión e ITV del coche', 300, [10]], ['Dentista y gafas', 240, [4]]],
      vMeses: [820, 780, 860, 840, 880, 830, 910, 900, 800, 840, 850, 890],
      esperado: { f: 1200, v: 850, i: 200, total: 2250, pct: [53, 38, 9] }
    }
  }
};

// Porcentajes enteros que suman 100 (método del mayor resto).
function porcentajes(vals) {
  const tot = vals.reduce((a, b) => a + b, 0), exactos = vals.map(v => v / tot * 100), base = exactos.map(Math.floor);
  let falta = 100 - base.reduce((a, b) => a + b, 0);
  exactos.map((x, i) => [x - base[i], i]).sort((a, b) => b[0] - a[0]).forEach(([, i]) => { if (falta-- > 0) base[i]++; });
  return base;
}

// Cálculos y comprobaciones.
for (const lang of ['en', 'es']) {
  const t = T[lang], e = t.ej, x = e.esperado, fallo = (m) => { throw new Error(`gastos-fijos-variables (${lang}): ${m}`); };
  e.F = suma(e.f); e.V = suma(e.v); e.anualI = suma(e.i); e.I = e.anualI / 12; e.total = e.F + e.V + e.I;
  e.pct = porcentajes([e.F, e.V, e.I]);
  if (e.F !== x.f || e.V !== x.v || e.I !== x.i || e.total !== x.total || e.pct.join() !== x.pct.join()) fallo(`ejemplo ${e.F}/${e.V}/${e.I}=${e.total} ${e.pct}`);
  if (e.i.some(([, v]) => v % 12)) fallo('un gasto anual no se divide en 12 meses exactos');
  if (e.vMeses.length !== 12 || e.vMeses.reduce((a, b) => a + b, 0) !== 12 * e.V) fallo('los meses variables no promedian el gasto variable');
  // Calendario de los irregulares: cada gasto repartido en los meses en que se paga.
  e.iMeses = Array(12).fill(0);
  for (const [, v, ms] of e.i) for (const m of ms) e.iMeses[m - 1] += v / ms.length;
  if (e.iMeses.reduce((a, b) => a + b, 0) !== e.anualI) fallo('calendario de irregulares');
  // El extracto de ejemplo coincide con el ejemplo: alquiler, móvil y el recibo del seguro de ese mes.
  const [alq, , , movil, seguro] = t.s3.mov;
  if (alq[2] !== e.f[0][1] || movil[2] !== e.f.find(([n]) => n === movil[1])[1]) fallo('el extracto no coincide con los fijos');
  if (seguro[2] !== e.iMeses[t.s3.mes - 1]) fallo('el extracto no coincide con el calendario de irregulares');
  // Diapositiva 5: ahorro anual de cada caso.
  for (const c of t.s5.casos) c.push(c[3] * c[4]);                    // [k, tit, texto, cantidad, veces, decisiones, al año]
}

const fondo = (c) => c + '26';
const chip = (k, t) => `<span style="display:inline-block;width:162px;text-align:center;padding:7px 0;border-radius:10px;border:1.5px solid ${COL[k]};background:${fondo(COL[k])};font-size:21px;font-weight:800;letter-spacing:.06em;color:${C.tinta}">${{ en: { f: 'FIXED', v: 'VARIABLE', i: 'IRREGULAR' }, es: { f: 'FIJO', v: 'VARIABLE', i: 'IRREGULAR' } }[t][k]}</span>`;

// Portada: doce meses de cada tipo de gasto, en la misma escala.
function portada(t, lang) {
  const e = t.ej, series = { f: Array(12).fill(e.F), v: e.vMeses, i: e.iMeses };
  const max = Math.max(...Object.values(series).flat()), H = 104;
  const barras = (k) => `<div style="display:flex;gap:7px;align-items:flex-end;height:${H}px">${series[k].map(v =>
    `<span style="flex:1;height:${v ? Math.max(6, Math.round(v / max * H)) : 4}px;border-radius:5px;background:${v ? COL[k] : 'rgba(148,163,184,.22)'}"></span>`).join('')}</div>`;
  return `<div class="tarjeta" style="margin-top:56px;padding:30px 36px 24px">
    ${['f', 'v', 'i'].map(k => `<div style="display:grid;grid-template-columns:270px 1fr;gap:24px;align-items:end;padding:16px 0;border-bottom:1px solid ${C.borde}">
      <div><div style="display:flex;align-items:center;gap:12px;font-size:32px;font-weight:750"><span class="punto" style="background:${COL[k]}"></span>${t.tipo[k]}</div><div style="font-size:26px;color:${C.suave};margin-top:6px;line-height:1.3">${t.s1.desc[k]}</div></div>
      ${barras(k)}</div>`).join('')}
    <div style="display:grid;grid-template-columns:270px 1fr;gap:24px;padding-top:12px"><span></span><div style="display:flex;gap:7px">${[...t.meses].map(m => `<span style="flex:1;text-align:center;font-size:22px;font-weight:650;color:${C.suave}">${m}</span>`).join('')}</div></div>
  </div>`;
}

module.exports = {
  slug: 'gastos-fijos-variables',
  T,
  diapositivas: [
    // 1 · Portada
    (t, lang) => `<h1 class="grande">${t.s1.t}</h1><p class="lead">${nb(t.s1.l)}</p>${portada(t, lang)}`,
    // 2 · Los tres tipos
    (t) => `<h1>${t.s2.t}</h1>
      <div style="margin-top:48px;display:flex;flex-direction:column;gap:18px">${['f', 'v', 'i'].map(k => `<div class="tarjeta" style="padding:30px 34px">
        <div style="display:flex;align-items:center;gap:14px"><span class="punto" style="background:${COL[k]}"></span><span style="font-size:26px;font-weight:800;letter-spacing:.06em;color:${COL[k]}">${t.tipo[k].toUpperCase()}</span></div>
        <div style="font-size:33px;font-weight:700;margin-top:12px">${t.s2.defs[k][0]}</div>
        <div style="font-size:28px;line-height:1.45;color:${C.texto};margin-top:10px">${nb(t.s2.defs[k][1])}</div></div>`).join('')}</div>`,
    // 3 · En los extractos
    (t, lang) => `<h1>${t.s3.t}</h1><p class="lead">${nb(t.s3.l)}</p>
      <div class="tarjeta" style="margin-top:44px;padding:10px 32px">${t.s3.mov.map(([d, n, v, k], i) => `<div style="display:grid;grid-template-columns:96px 1fr auto 170px;gap:16px;align-items:center;padding:17px 0;${i ? `border-top:1px solid ${C.borde}` : ''}">
        <span style="font-size:24px;color:${C.suave};font-weight:600">${d}</span><span style="font-size:29px;color:${C.texto}">${n}</span>
        <span style="font-size:29px;font-weight:700;text-align:right;font-variant-numeric:tabular-nums">${dinero(-v, lang)}</span><span style="text-align:right">${chip(k, lang)}</span></div>`).join('')}</div>
      <p class="nota">${nb(t.s3.nota)}</p>`,
    // 4 · Ejemplo con su peso
    (t, lang) => { const e = t.ej, filas = [['f', t.tipo.f, e.F, e.f], ['v', t.tipo.v, e.V, e.v], ['i', t.s4.divide, e.I, e.i]];
      return `<h1>${t.s4.t(dinero(e.total, lang))}</h1>
      <div class="tarjeta" style="margin-top:52px;padding:40px 38px 22px">
        ${barra(filas.map(([k, , v]) => ({ valor: v, color: COL[k] })), { alto: 70 })}
        <div style="margin-top:16px">${filas.map(([k, nombre, v, items], i) => `<div style="padding:20px 0;${i ? `border-top:1px solid ${C.borde}` : ''}">
          <div style="display:flex;justify-content:space-between;align-items:baseline"><span style="display:flex;align-items:center;gap:14px;font-size:33px;font-weight:700"><span class="punto" style="background:${COL[k]}"></span>${nombre}<span style="color:${C.suave};font-weight:600">· ${e.pct[i]}%</span></span>
            <span style="font-size:40px;font-weight:800;font-variant-numeric:tabular-nums">${dinero(v, lang)}</span></div>
          <div style="font-size:26px;line-height:1.4;color:${C.suave};margin:8px 0 0 30px">${k === 'i' ? t.s4.anual(dinero(e.anualI, lang)) + ': ' : ''}${nb(k === 'i' ? items.map(([n]) => minus(n)).join(', ') : mayus(items.map(([n]) => minus(n)).join(', ')))}</div></div>`).join('')}</div>
      </div><p class="nota">${nb(t.s4.nota)}</p>`; },
    // 5 · Por qué importa
    (t, lang) => `<h1>${t.s5.t}</h1>
      <div style="margin-top:48px;display:flex;flex-direction:column;gap:20px">${t.s5.casos.map(([k, tit, texto, cant, , deci, anual]) => `<div class="tarjeta" style="padding:30px 34px">
        <div style="display:flex;align-items:center;gap:14px"><span class="punto" style="background:${COL[k]}"></span><span style="font-size:26px;font-weight:800;letter-spacing:.06em;color:${COL[k]}">${t.tipo[k].toUpperCase()}</span></div>
        <div style="font-size:33px;font-weight:700;margin-top:10px">${tit}</div>
        <div style="font-size:28px;line-height:1.4;color:${C.texto};margin-top:10px">${nb(texto(dinero(cant, lang), dinero(anual, lang)))}</div>
        <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:24px;margin-top:22px">
          <div><div style="display:grid;grid-template-columns:repeat(26,14px);gap:6px">${Array.from({ length: deci }, () => `<span style="width:14px;height:14px;border-radius:50%;background:${COL[k]}"></span>`).join('')}</div>
            <div style="font-size:26px;color:${C.suave};margin-top:10px;font-weight:600">${t.s5.deci(deci)}</div></div>
          <div style="text-align:right;white-space:nowrap"><span style="font-size:48px;font-weight:800;letter-spacing:-.02em;color:${C.tinta}">${dinero(anual, lang)}</span><span style="font-size:26px;color:${C.suave};font-weight:600"> ${t.s5.anual}</span></div></div></div>`).join('')}</div>
      <p class="nota" style="margin-top:24px">${nb(t.s5.nota)}</p>`,
    // 6 · Irregulares entre 12
    (t, lang) => { const e = t.ej; return `<h1>${t.s6.t}</h1><p class="lead">${nb(t.s6.l)}</p>
      <div class="tarjeta" style="margin-top:40px;padding:16px 34px 20px">
        <div style="display:grid;grid-template-columns:1fr 150px 150px;gap:16px;padding:12px 0;font-size:22px;font-weight:700;letter-spacing:.08em;color:${C.suave}"><span></span><span style="text-align:right">${t.s6.cab[0].toUpperCase()}</span><span style="text-align:right">${t.s6.cab[1].toUpperCase()}</span></div>
        ${e.i.map(([n, v]) => `<div style="display:grid;grid-template-columns:1fr 150px 150px;gap:16px;align-items:baseline;padding:13px 0;border-top:1px solid ${C.borde};font-size:29px;font-variant-numeric:tabular-nums">
          <span style="color:${C.texto}">${n}</span><span style="text-align:right;color:${C.texto}">${dinero(v, lang)}</span><span style="text-align:right;font-weight:750">${dinero(v / 12, lang)}</span></div>`).join('')}
        <div style="display:grid;grid-template-columns:1fr 150px 150px;gap:16px;align-items:baseline;padding:18px 0 0;margin-top:6px;border-top:2px solid ${C.ahorro};font-variant-numeric:tabular-nums">
          <span style="font-size:31px;font-weight:750">${t.s6.total}</span><span style="text-align:right;font-size:31px;font-weight:750">${dinero(e.anualI, lang)}</span><span style="text-align:right;font-size:40px;font-weight:800;color:${C.acento}">${dinero(e.I, lang)}</span></div>
      </div>
      <p class="lead" style="margin-top:36px"><b>${nb(t.s6.final(dinero(e.I, lang)))}</b></p>`; },
    // 7 · Ponlo en práctica
    (t) => `<h1>${t.s7.t}</h1>
      <div style="margin-top:48px;display:flex;flex-direction:column;gap:16px">${t.s7.items.map(([k, a, b]) => `<div class="item"><span class="ic" style="background:${fondo(COL[k])};font-size:32px;font-weight:800;color:${C.tinta};border:1.5px solid ${COL[k]}">${t.s7.letra[k]}</span><span>${a}<small>${b}</small></span></div>`).join('')}</div>
      <p class="lead" style="margin-top:40px"><b>${nb(t.s7.final)}</b></p>`
  ],
  texto: {}
};

const D = (n) => plano(dinero(n, 'en')), E = (n) => plano(dinero(n, 'es'));
const en = T.en.ej, es = T.es.ej, [enF, enV] = T.en.s5.casos, [esF, esV] = T.es.s5.casos;
const lista = (items, f) => items.map(([n, v]) => `${minus(n)} ${f(v)}`).join(', ');
module.exports.texto.en = `Not all expenses are alike, and each kind is planned a different way. 📋

• Fixed: the same amount every month. Rent or mortgage, car payment, phone and internet, subscriptions, loan payments.
• Variable: they change from month to month. Groceries, gas, utilities, eating out, shopping.
• Irregular: once or a few times a year. Vacation, holidays and gifts, car insurance billed every 6 months, car repairs, annual memberships.

How to find them: take last month's bank and card statements and tag each charge as fixed, variable or irregular. For irregular costs, also look back over the last 12 months, since a single month misses most of them.

Example: ${D(en.F)} fixed + ${D(en.V)} variable + ${D(en.I)} irregular (spread over the year) = ${D(en.total)} a month. That's ${en.pct[0]}% fixed, ${en.pct[1]}% variable and ${en.pct[2]}% irregular.

Why it matters: fixed costs are usually where the big savings are, because lowering one is a single decision that pays off every month. A phone plan that costs ${D(enF[3])} less a month saves ${D(enF[6])} a year with one call, while spending ${D(enV[3])} less a week on eating out takes 52 small decisions to save ${D(enV[6])}. Variable costs are where your everyday choices show up. Housing and transportation are the two largest spending categories for U.S. households (BLS, Consumer Expenditure Survey).

Irregular costs: add up the year and divide by 12. In our example they come to ${D(en.anualI)} a year (${lista(en.i, D)}), or ${D(en.I)} a month. Set that amount aside every month in a separate savings account, and the bill never catches you off guard.

In FinanziApp you can set a budget by category and track it month by month, so you can see where each kind of expense goes (free for 15 days, link in bio).

#budgeting #personalfinance #moneytips #financialliteracy #budgetingtips`;
module.exports.texto.es = `No todos los gastos son iguales, y cada tipo se planifica de una forma. 📋

• Fijos: la misma cantidad cada mes. Alquiler o hipoteca, préstamos, seguros mensuales, móvil e internet, suscripciones.
• Variables: cambian de un mes a otro. Comida, luz, agua y gas, gasolina, comer fuera, compras.
• Irregulares: una o pocas veces al año. Vacaciones, Navidad y regalos, seguro anual del coche, ITV y revisiones, dentista y gafas.

Cómo encontrarlos: coge los movimientos del mes pasado de tu banco y tus tarjetas y marca cada cargo como fijo, variable o irregular. Para los irregulares, revisa también los últimos 12 meses: un solo mes no recoge casi ninguno.

Ejemplo: ${E(es.F)} fijos + ${E(es.V)} variables + ${E(es.I)} irregulares (repartidos en el año) = ${E(es.total)} al mes. Es decir, un ${es.pct[0]}% fijos, un ${es.pct[1]}% variables y un ${es.pct[2]}% irregulares.

Por qué importa: en los fijos suele estar el gran ahorro, porque bajar uno es una sola decisión que se nota todos los meses. Una tarifa de móvil ${E(esF[3])} más barata al mes ahorra ${E(esF[6])} al año con una llamada; gastar ${E(esV[3])} menos a la semana en comer fuera son 52 pequeñas decisiones para ahorrar ${E(esV[6])}. En los variables se ven tus decisiones del día a día. La vivienda, con sus suministros, es el mayor grupo de gasto de los hogares en España (INE, Encuesta de Presupuestos Familiares).

Gastos irregulares: suma los del año y divide entre 12. En el ejemplo suman ${E(es.anualI)} al año (${lista(es.i, E)}), es decir, ${E(es.I)} al mes. Aparta esa cantidad cada mes en una cuenta de ahorro separada y el recibo no te pillará por sorpresa.

En FinanziApp puedes hacer un presupuesto por categorías y seguirlo mes a mes, para ver a dónde va cada tipo de gasto (gratis 15 días, enlace en la bio).

#finanzaspersonales #presupuesto #ahorro #educacionfinanciera #gastos`;
