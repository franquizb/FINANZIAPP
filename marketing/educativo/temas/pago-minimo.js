// Carrusel educativo: la trampa del pago mínimo en las tarjetas de crédito.
// Inglés: 3.000 $ al 22% APR (interés mensual = APR ÷ 12). Español: 3.000 € en
// una tarjeta revolving al 20% TAE (interés mensual equivalente a la TAE).
// Regla de cuota mínima de ejemplo (la misma en los dos idiomas y dicha en la
// diapositiva 2): los intereses del mes + el 1% de la deuda, con un mínimo de
// 25. Todo se simula mes a mes aquí y las comprobaciones lanzan un error si
// algo no cuadra.
const { C, icono } = require('../comun');

const ROJO = '#e66767';
const agrupar = (n, sep) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, sep);
const dinero = (n, lang) => (lang === 'en' ? '$' + agrupar(n, ',') : agrupar(n, '.') + ' €');

const EJ = {
  en: { saldo: 3000, tasa: 0.22, tasaMes: 0.22 / 12, fijo: 150 },
  es: { saldo: 3000, tasa: 0.20, tasaMes: Math.pow(1.20, 1 / 12) - 1, fijo: 150 }
};
const PISO = 25, PCT = 0.01;

// Simulación mes a mes: se cobran los intereses y después se paga la cuota
// (la mínima según la regla, o una cantidad fija). Guarda el detalle de cada mes.
function simular(saldo0, tm, fijo) {
  let s = saldo0, interes = 0, pagado = 0;
  const meses = [];
  while (s > 0.005) {
    if (meses.length > 600) throw new Error('pago-minimo: la simulación no termina');
    const i = s * tm, base = s;
    s += i; interes += i;
    const cuota = Math.min(s, fijo || Math.max(PISO, i + PCT * base));
    s -= cuota; pagado += cuota;
    meses.push({ cuota, interes: i, capital: cuota - i, saldo: s });
  }
  if (Math.abs(pagado - saldo0 - interes) > 0.01) throw new Error('pago-minimo: pagos e intereses no cuadran');
  return { n: meses.length, interes, pagado, meses };
}

const R = {};
for (const lang of ['en', 'es']) {
  const e = EJ[lang];
  const minimo = simular(e.saldo, e.tasaMes);
  const p1 = minimo.meses[0];
  const congelada = Math.round(p1.cuota);                 // seguir pagando la primera cuota mínima
  const congelar = simular(e.saldo, e.tasaMes, congelada);
  const fijo = simular(e.saldo, e.tasaMes, e.fijo);
  // Cuota para saldarla en 3 años (redondeada al alza) y comprobación.
  const a36 = Math.ceil(e.tasaMes * e.saldo / (1 - Math.pow(1 + e.tasaMes, -36)));
  const tres = simular(e.saldo, e.tasaMes, a36);
  if (tres.n > 36 || simular(e.saldo, e.tasaMes, a36 - 1).n <= 36) throw new Error('pago-minimo: cuota a 3 años ' + lang);
  // La primera cuota se enseña desglosada en unidades enteras: tiene que sumar.
  if (Math.round(p1.interes) + Math.round(p1.capital) !== congelada) throw new Error('pago-minimo: desglose de la primera cuota ' + lang);
  if (!(minimo.n > congelar.n && congelar.n > fijo.n && minimo.interes > congelar.interes && congelar.interes > fijo.interes)) throw new Error('pago-minimo: orden de los planes ' + lang);
  R[lang] = { ...e, minimo, congelar, plan: fijo, congelada, a36, tres, p1, pctInt: Math.round(p1.interes / p1.cuota * 100) };
}

// Tiempo legible: menos de 3 años en meses; si no, años (y meses).
const tiempo = (m, lang) => {
  if (m < 36) return lang === 'en' ? `${m} months` : `${m} meses`;
  const a = Math.floor(m / 12), r = m % 12;
  if (lang === 'en') return r ? `${a} years ${r} months` : `${a} years`;
  return r ? `${a} años y ${r} meses` : `${a} años`;
};
const pctTxt = (x, lang) => (lang === 'en' ? `${+(x * 100).toFixed(2)}%` : `${String(+(x * 100).toFixed(2)).replace('.', ',')}%`);

const T = {
  en: {
    kicker: 'DEBT BASICS', desliza: 'Swipe →',
    s1: { t: 'The <span class="c">minimum payment</span> trap', l: (r) => `${dinero(r.saldo, 'en')} on a credit card at 22% APR: the minimum payment vs. a fixed ${dinero(r.fijo, 'en')} a month.`,
      min: 'Minimum only', fijo: (f) => `${f} a month`, int: 'in interest' },
    s2: { t: 'How the minimum <span class="c">is&nbsp;calculated</span>', l: 'Every card has its own rule. In this example: that month’s interest plus 1% of the balance, or $25 if that’s higher.',
      primera: 'Your first minimum payment', interes: 'Interest', capital: 'Lowers your balance', de: (p) => `<b style="color:${C.tinta}">${p}%</b> of it is interest. Only the rest lowers what you owe.`,
      nota: 'Example rule. Your card’s rule is in your cardholder agreement. Interest calculated monthly (APR ÷ 12).' },
    s3: { t: 'Why it takes <span class="c">so long</span>', l: 'As the balance goes down, so does the minimum. You pay less each month, and the balance falls slowly.',
      eje: 'Year', titulo: 'Minimum payment, first month of each year' },
    s4: { t: 'Your balance, <span class="c">month&nbsp;by&nbsp;month</span>', l: 'Same balance, same rate. Only the payment&nbsp;changes.', hoy: 'Today', anos: 'yrs', min: 'Minimum only', fijo: (f) => `${f} a month` },
    s5: { t: 'What it <span class="c">really costs</span>', planes: ['Minimum only', (c) => `Keep paying ${c}`, (f) => `${f} a month`], sub: ['The payment shrinks over time', 'Your first minimum, frozen', 'A fixed amount you choose'],
      cols: ['Time', 'Interest'] },
    s6: { t: 'How to <span class="c">get out</span>', items: [
      ['candado', (c, t) => `Freeze your payment at ${c}`, (c, t, m) => `Done in ${t}, not ${m}`],
      ['tarjeta', () => 'Stop adding new charges', () => 'Use debit or cash while you pay it down'],
      ['calendario', () => 'Set autopay to a fixed amount', () => 'Not to “minimum payment due”'],
      ['lupa', () => 'Look for a lower rate', () => 'Ask your issuer; 0% transfers usually have a fee']] },
    s7: { t: 'Find your <span class="c">3‑year number</span>', l: 'It’s on your statement. Since the Credit CARD Act of 2009, card statements include a “Minimum Payment Warning”: how long the minimum takes, and the monthly payment to pay it off in 3 years.',
      ej: 'In our example', meses: '36 months', int: 'in interest', final: 'Pay that or more every month, and the trap closes.' }
  },
  es: {
    kicker: 'DEUDAS', desliza: 'Desliza →',
    s1: { t: 'La trampa del <span class="c">pago&nbsp;mínimo</span>', l: (r) => `${dinero(r.saldo, 'es')} en una tarjeta revolving al 20% TAE: la cuota mínima frente a una cuota fija de ${dinero(r.fijo, 'es')}.`,
      min: 'Solo la cuota mínima', fijo: (f) => `${f} al mes`, int: 'de intereses' },
    s2: { t: 'Cómo se calcula <span class="c">la&nbsp;cuota&nbsp;mínima</span>', l: 'Cada tarjeta tiene su regla. En este ejemplo: los intereses del mes más el 1% de la deuda, con un mínimo de 25 €.',
      primera: 'Tu primera cuota mínima', interes: 'Intereses', capital: 'Lo que baja tu deuda', de: (p) => `El <b style="color:${C.tinta}">${p}%</b> son intereses. Solo el resto reduce lo que debes.`,
      nota: (r) => `Regla de ejemplo: la de tu tarjeta está en el contrato y en el extracto. Interés mensual del ${pctTxt(r.tasaMes, 'es')} (20% TAE).` },
    s3: { t: 'Por qué tarda <span class="c">tanto</span>', l: 'Cuando baja la deuda, baja también la cuota mínima. Pagas menos cada mes y la deuda baja muy despacio.',
      eje: 'Año', titulo: 'Cuota mínima, primer mes de cada año' },
    s4: { t: 'Tu deuda, <span class="c">mes a mes</span>', l: 'Misma deuda, mismo interés. Solo cambia la cuota.', hoy: 'Hoy', anos: 'años', min: 'Solo la cuota mínima', fijo: (f) => `${f} al mes` },
    s5: { t: 'Lo que <span class="c">cuesta de verdad</span>', planes: ['Solo la cuota mínima', (c) => `Seguir pagando ${c}`, (f) => `${f} al mes`], sub: ['La cuota baja con el tiempo', 'Tu primera cuota, congelada', 'Una cuota fija que eliges tú'],
      cols: ['Tiempo', 'Intereses'] },
    s6: { t: 'Cómo <span class="c">salir</span>', items: [
      ['candado', (c, t) => `Congela tu cuota en ${c}`, (c, t, m) => `En ${t}, no en ${m}`],
      ['tarjeta', () => 'No sigas comprando con ella', () => 'Mientras la saldas, paga con débito o efectivo'],
      ['calendario', () => 'Sube la cuota en tu banco', () => 'Normalmente se cambia en la app o llamando'],
      ['lupa', () => 'Busca un interés más bajo', () => 'Un préstamo más barato para cancelarla, y no volver a usarla']] },
    s7: { t: 'Calcula tu <span class="c">cuota a 3 años</span>', l: 'Es la cuota fija con la que la deuda desaparece en 36 meses. Pregunta a tu banco cuánto debes y a qué TAE, y calcúlala.',
      ej: 'En nuestro ejemplo', meses: '36 meses', int: 'de intereses', final: 'Paga eso o más cada mes y la trampa se cierra.' }
  }
};

const fondo = (c) => c + '26';
// Evita palabras sueltas al final de títulos y textos (solo en estas diapositivas).
const PULIDO = '<style>h1,.lead,.nota{text-wrap:pretty}</style>';
const SVG = { candado: '<rect x="4.5" y="10.5" width="15" height="10" rx="2.2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/><path d="M12 14.5v2.5"/>' };
const ico = (n, color, tam = 40) => SVG[n]
  ? `<svg width="${tam}" height="${tam}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${SVG[n]}</svg>`
  : icono(n, color, tam);

// Barras por año: la primera cuota mínima de cada año, dividida en intereses y capital.
function barrasAnuales(t, lang) {
  const r = R[lang], anos = Math.ceil(r.minimo.n / 12);
  const W = 860, H = 380, pt = 50, pb = 46, slot = W / anos, bw = Math.round(slot * 0.62);
  const max = r.minimo.meses[0].cuota, y = (v) => (v / max) * (H - pt - pb);
  const etiquetas = new Set([1, 5, 10, anos]);
  return `<svg width="100%" viewBox="0 0 ${W} ${H}">${Array.from({ length: anos }, (_, k) => {
    const m = r.minimo.meses[k * 12], x = k * slot + (slot - bw) / 2, base = H - pb;
    const hi = y(m.interes), hc = y(m.capital);
    return `<rect x="${x}" y="${base - hc}" width="${bw}" height="${hc}" rx="4" fill="${C.necesidades}"/>
      <rect x="${x}" y="${base - hc - hi - 2}" width="${bw}" height="${hi}" rx="4" fill="${ROJO}"/>
      ${etiquetas.has(k + 1) ? `<text x="${x + bw / 2}" y="${base - hc - hi - 14}" fill="${C.tinta}" font-size="26" font-weight="800" text-anchor="middle">${dinero(m.cuota, lang)}</text>
      <text x="${k === 0 ? x : x + bw / 2}" y="${H - 8}" fill="${C.suave}" font-size="24" font-weight="600" text-anchor="${k === 0 ? 'start' : 'middle'}">${k === 0 ? t.s3.eje + ' 1' : k + 1}</text>` : ''}`;
  }).join('')}</svg>`;
}

// Curvas del saldo pendiente: solo la mínima frente a la cuota fija.
function curvas(t, lang) {
  const r = R[lang], W = 860, H = 500, pl = 8, pr = 8, pt = 24, pb = 46;
  const maxM = Math.ceil(r.minimo.n / 60) * 60;          // eje en tramos de 5 años
  const x = (m) => pl + (m / maxM) * (W - pl - pr), y = (v) => pt + (1 - v / r.saldo) * (H - pt - pb);
  const ruta = (sim) => `M${x(0)},${y(r.saldo)} ` + sim.meses.map((p, i) => `L${x(i + 1).toFixed(1)},${y(p.saldo).toFixed(1)}`).join(' ');
  const rej = [0.5, 1].map(f => `<line x1="${pl}" x2="${W - pr}" y1="${y(r.saldo * f)}" y2="${y(r.saldo * f)}" stroke="rgba(148,163,184,.12)"/>
    <text x="${W - pr}" y="${y(r.saldo * f) + 30}" fill="${C.suave}" font-size="22" text-anchor="end">${dinero(r.saldo * f, lang)}</text>`).join('');
  const marcas = Array.from({ length: maxM / 60 + 1 }, (_, k) => k * 5);
  const ejes = marcas.map((a, k) => `<text x="${x(a * 12)}" y="${H - 10}" fill="${C.suave}" font-size="22" text-anchor="${k === 0 ? 'start' : k === marcas.length - 1 ? 'end' : 'middle'}">${a ? `${a} ${t.s4.anos}` : t.s4.hoy}</text>`).join('');
  const mMin = 60, pMin = r.minimo.meses[mMin - 1].saldo;
  return `<svg width="100%" viewBox="0 0 ${W} ${H}">${rej}
    <line x1="${pl}" x2="${W - pr}" y1="${y(0)}" y2="${y(0)}" stroke="rgba(148,163,184,.3)"/>
    <path d="${ruta(r.minimo)}" fill="none" stroke="${ROJO}" stroke-width="4" stroke-linejoin="round"/>
    <path d="${ruta(r.plan)}" fill="none" stroke="${C.acento}" stroke-width="4" stroke-linejoin="round"/>
    <circle cx="${x(r.plan.n)}" cy="${y(0)}" r="7" fill="${C.acento}"/>
    <circle cx="${x(r.minimo.n)}" cy="${y(0)}" r="7" fill="${ROJO}"/>
    <text x="${x(mMin)}" y="${y(pMin) - 52}" fill="${ROJO}" font-size="26" font-weight="800">${t.s4.min}<tspan x="${x(mMin)}" dy="32" font-weight="650">${tiempo(r.minimo.n, lang)}</tspan></text>
    <text x="${x(r.plan.n) + 18}" y="${y(0) - 22}" fill="${C.acento}" font-size="26" font-weight="800">${t.s4.fijo(dinero(r.fijo, lang))}: ${tiempo(r.plan.n, lang)}</text>
    ${ejes}</svg>`;
}

module.exports = {
  slug: 'pago-minimo',
  T,
  diapositivas: [
    // 1 · Portada: el tiempo que se tarda con cada forma de pagar
    (t, lang) => { const r = R[lang]; return `<h1 class="grande">${t.s1.t}</h1><p class="lead">${t.s1.l(r)}</p>
      <div class="tarjeta" style="margin-top:56px;padding:36px 38px">${[[t.s1.min, r.minimo, ROJO], [t.s1.fijo(dinero(r.fijo, lang)), r.plan, C.necesidades]].map(([n, sim, col], i) => `<div style="${i ? 'margin-top:34px' : ''}">
        <div style="display:flex;justify-content:space-between;align-items:baseline"><span style="font-size:30px;font-weight:700;color:${C.texto}">${n}</span><span style="font-size:40px;font-weight:800;letter-spacing:-.02em;color:${col === ROJO ? ROJO : C.acento}">${tiempo(sim.n, lang)}</span></div>
        <div style="margin:14px 0 12px;height:28px;border-radius:9px;background:rgba(148,163,184,.12)"><div style="height:100%;border-radius:9px;background:${col};width:${(sim.n / r.minimo.n * 100).toFixed(1)}%"></div></div>
        <div style="font-size:27px;color:${C.suave}"><b style="color:${C.tinta}">${dinero(sim.interes, lang)}</b> ${t.s1.int}</div></div>`).join('')}</div>`; },
    // 2 · Cómo se calcula la mínima: la primera cuota desglosada
    (t, lang) => { const r = R[lang], i = Math.round(r.p1.interes), k = Math.round(r.p1.capital); return `<h1>${t.s2.t}</h1><p class="lead">${t.s2.l}</p>
      <div class="tarjeta" style="margin-top:44px;padding:36px 38px">
        <div style="display:flex;justify-content:space-between;align-items:baseline"><span style="font-size:30px;font-weight:700;color:${C.texto}">${t.s2.primera}</span><span style="font-size:54px;font-weight:800;letter-spacing:-.03em">${dinero(r.congelada, lang)}</span></div>
        <div class="barra" style="height:56px;margin-top:22px"><span style="flex:${i};background:${ROJO};border-radius:14px 4px 4px 14px"></span><span style="flex:${k};background:${C.necesidades};border-radius:4px 14px 14px 4px"></span></div>
        <div style="display:flex;gap:3px;margin-top:18px">${[[i, t.s2.interes, ROJO], [k, t.s2.capital, C.necesidades]].map(([v, n, col]) => `<div style="flex:${v}"><div style="font-size:40px;font-weight:800;color:${col === ROJO ? ROJO : C.acento}">${dinero(v, lang)}</div><div style="font-size:26px;color:${C.texto};font-weight:600;margin-top:4px">${n}</div></div>`).join('')}</div>
        <p style="margin-top:26px;padding-top:22px;border-top:1px solid ${C.borde};font-size:29px;line-height:1.45;color:${C.texto}">${t.s2.de(r.pctInt)}</p>
      </div><p class="nota">${typeof t.s2.nota === 'function' ? t.s2.nota(r) : t.s2.nota}</p>`; },
    // 3 · Por qué tarda tanto: la cuota mínima de cada año
    (t, lang) => `<h1>${t.s3.t}</h1><p class="lead">${t.s3.l}</p>
      <div class="tarjeta" style="margin-top:40px;padding:30px 32px 22px">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px 24px;margin-bottom:8px">
          <span style="font-size:26px;font-weight:700;color:${C.texto}">${t.s3.titulo}</span>
          <span style="display:flex;gap:22px;font-size:26px;color:${C.texto}">${[[ROJO, t.s2.interes], [C.necesidades, t.s2.capital]].map(([c, n]) => `<span style="display:flex;align-items:center;gap:10px"><span class="punto" style="background:${c}"></span>${n}</span>`).join('')}</span></div>
        ${barrasAnuales(t, lang)}</div>`,
    // 4 · El saldo mes a mes
    (t, lang) => `<h1>${t.s4.t}</h1><p class="lead">${t.s4.l}</p>
      <div class="tarjeta" style="margin-top:44px;padding:30px 32px 20px">${curvas(t, lang)}</div>`,
    // 5 · Lo que cuesta cada plan
    (t, lang) => { const r = R[lang], planes = [[r.minimo, ROJO], [r.congelar, C.caprichos], [r.plan, C.necesidades]];
      const nombres = [t.s5.planes[0], t.s5.planes[1](dinero(r.congelada, lang)), t.s5.planes[2](dinero(r.fijo, lang))];
      return `<h1>${t.s5.t}</h1>
      <div style="margin-top:48px;display:flex;flex-direction:column;gap:18px">${planes.map(([sim, col], i) => `<div class="tarjeta" style="padding:28px 34px">
        <div style="display:flex;justify-content:space-between;align-items:baseline;gap:20px"><span style="font-size:32px;font-weight:800">${nombres[i]}</span><span style="font-size:30px;font-weight:800;color:${C.tinta};white-space:nowrap">${tiempo(sim.n, lang)}</span></div>
        <div style="font-size:26px;color:${C.suave};margin-top:4px">${t.s5.sub[i]}</div>
        <div style="display:grid;grid-template-columns:1fr 150px;gap:18px;align-items:center;margin-top:18px">
          <div style="height:22px;border-radius:8px;background:rgba(148,163,184,.12)"><div style="height:100%;border-radius:8px;background:${col};width:${(sim.interes / r.minimo.interes * 100).toFixed(1)}%"></div></div>
          <span style="font-size:32px;font-weight:800;text-align:right;font-variant-numeric:tabular-nums;color:${i === 0 ? ROJO : C.tinta}">${dinero(sim.interes, lang)}</span></div>
        </div>`).join('')}</div>
      <p class="nota" style="margin-top:22px">${lang === 'en' ? 'Bars: total interest paid on the same $3,000.' : 'Barras: intereses totales pagados por los mismos 3.000 €.'}</p>`; },
    // 6 · Cómo salir
    (t, lang) => { const r = R[lang], c = dinero(r.congelada, lang), tc = tiempo(r.congelar.n, lang), tm = tiempo(r.minimo.n, lang);
      return `<h1>${t.s6.t}</h1>
      <div style="margin-top:48px;display:flex;flex-direction:column;gap:16px">${t.s6.items.map(([ic, a, b], i) => `<div class="item"><span class="ic" style="background:${fondo(C.necesidades)}">${ico(ic, C.necesidades, 42)}</span><span>${a(c, tc, tm)}<small style="font-size:26px">${b(c, tc, tm)}</small></span></div>`).join('')}</div>`; },
    // 7 · La cuota a 3 años
    (t, lang) => { const r = R[lang]; return `<h1>${t.s7.t}</h1><p class="lead">${t.s7.l}</p>
      <div class="tarjeta" style="margin-top:40px;border-color:rgba(15,159,143,.5)">
        <div style="font-size:24px;font-weight:800;letter-spacing:.06em;color:${C.suave}">${t.s7.ej.toUpperCase()}</div>
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-top:14px"><span style="font-size:58px;font-weight:800;letter-spacing:-.03em;color:${C.acento}">${dinero(r.a36, lang)}<span style="font-size:30px;color:${C.texto};font-weight:600;letter-spacing:0">${lang === 'en' ? ' a month' : ' al mes'}</span></span><span style="font-size:32px;font-weight:800">${t.s7.meses}</span></div>
        <div style="margin-top:10px;font-size:28px;color:${C.texto}"><b style="color:${C.tinta}">${dinero(r.tres.interes, lang)}</b> ${t.s7.int} · ${lang === 'en' ? 'vs.' : 'frente a'} <b style="color:${ROJO}">${dinero(r.minimo.interes, lang)}</b></div>
      </div>
      <p class="lead" style="margin-top:36px"><b>${t.s7.final}</b></p>`; }
  ].map(d => (t, lang) => PULIDO + d(t, lang)),
  texto: (() => { const e = R.en, s = R.es; const tx = {
    en: `Paying only the minimum on a credit card feels manageable. The catch is how long it takes. 💳

Our example: ${dinero(e.saldo, 'en')} at 22% APR. The minimum rule in this example: that month's interest plus 1% of the balance, or $25 if that's higher. Each card sets its own, so check your cardholder agreement.

The first minimum is ${dinero(e.congelada, 'en')}: ${dinero(e.p1.interes, 'en')} of interest and only ${dinero(e.p1.capital, 'en')} that lowers your balance. As the balance goes down, the minimum goes down too, so the balance falls very slowly.

Minimum only: ${tiempo(e.minimo.n, 'en')} and ${dinero(e.minimo.interes, 'en')} in interest (${dinero(e.minimo.pagado, 'en')} paid in total).
Keep paying your first minimum (${dinero(e.congelada, 'en')}) every month: ${tiempo(e.congelar.n, 'en')} and ${dinero(e.congelar.interes, 'en')} in interest.
A fixed ${dinero(e.fijo, 'en')} a month: ${tiempo(e.plan.n, 'en')} and ${dinero(e.plan.interes, 'en')} in interest.

How to get out:
• Freeze your payment instead of letting it shrink
• Stop adding new charges to the card
• Set autopay to a fixed amount, not the minimum
• Look for a lower rate: ask your issuer, or compare a 0% balance transfer (they usually charge a fee)

Your statement already shows your 3-year number: since the Credit CARD Act of 2009, statements include a Minimum Payment Warning with how long the minimum takes and the monthly payment to pay it off in 3 years. In our example that's ${dinero(e.a36, 'en')} a month and ${dinero(e.tres.interes, 'en')} in interest.

Illustrative example: interest calculated monthly (APR ÷ 12), no new charges or fees. This is education, not financial advice.

FinanziApp lets you track a debt month by month and see when it will be paid off (free for 15 days, link in bio).

#creditcarddebt #debtfree #personalfinance #moneytips #financialliteracy`,
    es: `Pagar solo la cuota mínima de una tarjeta parece cómodo. El problema es lo que tarda. 💳

Nuestro ejemplo: ${dinero(s.saldo, 'es')} en una tarjeta revolving al 20% TAE (un ${pctTxt(s.tasaMes, 'es')} al mes). La regla de cuota mínima que usamos: los intereses del mes más el 1% de la deuda, con un mínimo de 25 €. Cada tarjeta tiene la suya: mírala en tu contrato o en el extracto.

La primera cuota es de ${dinero(s.congelada, 'es')}: ${dinero(s.p1.interes, 'es')} de intereses y solo ${dinero(s.p1.capital, 'es')} que reducen tu deuda. Cuando la deuda baja, la cuota también, así que la deuda baja muy despacio.

Solo la cuota mínima: ${tiempo(s.minimo.n, 'es')} y ${dinero(s.minimo.interes, 'es')} de intereses (${dinero(s.minimo.pagado, 'es')} pagados en total).
Seguir pagando la primera cuota (${dinero(s.congelada, 'es')}) todos los meses: ${tiempo(s.congelar.n, 'es')} y ${dinero(s.congelar.interes, 'es')} de intereses.
Una cuota fija de ${dinero(s.fijo, 'es')}: ${tiempo(s.plan.n, 'es')} y ${dinero(s.plan.interes, 'es')} de intereses.

Cómo salir:
• Congela tu cuota en lugar de dejar que baje
• No sigas comprando con la tarjeta mientras la saldas
• Sube la cuota: normalmente se cambia en la app del banco o llamando
• Busca un interés más bajo: un préstamo más barato para cancelarla, sin volver a usarla

Calcula tu cuota a 3 años: la cuota fija con la que la deuda desaparece en 36 meses. En nuestro ejemplo son ${dinero(s.a36, 'es')} al mes y ${dinero(s.tres.interes, 'es')} de intereses.

Ejemplo ilustrativo, sin compras nuevas ni comisiones. Esto es educación financiera, no asesoramiento.

Con FinanziApp puedes seguir una deuda mes a mes y ver cuándo terminarás de pagarla (gratis 15 días, enlace en la bio).

#tarjetasrevolving #deudas #finanzaspersonales #educacionfinanciera #ahorro`
  }; for (const k in tx) tx[k] = tx[k].replace(/ /g, ' '); return tx; })()
};
