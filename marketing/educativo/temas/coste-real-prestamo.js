// Carrusel educativo: el coste real de un préstamo (tipo nominal frente a coste
// efectivo, cuota, comisión de apertura y plazo). Inglés: APR (EE. UU.), dólares.
// Español: TIN y TAE (España), euros. Todas las cifras se calculan aquí con la
// fórmula de la cuota constante (sistema francés) y se comprueban al cargar.
const { C, barra } = require('../comun');

const ROJO = '#e66767';
const RAYADO = `repeating-linear-gradient(135deg, ${ROJO} 0 7px, rgba(230,103,103,.36) 7px 13px)`;   // comisiones

// ── Cálculos ──────────────────────────────────────────────────────────────────
const P = 10000, TIN = 0.08, ANOS = 5, COMISION = 0.03;
const cuotaExacta = (capital, tasa, n) => { const r = tasa / 12; return capital * r / (1 - Math.pow(1 + r, -n)); };
const cent = (x) => Math.round(x * 100) / 100;
const plazo = (anos) => { const n = anos * 12, cuota = cent(cuotaExacta(P, TIN, n)); return { anos, n, cuota, total: cuota * n, interes: cuota * n - P }; };
const L = plazo(ANOS);                                  // el préstamo del ejemplo
const plazos = [3, 5, 7].map(plazo);
const fee = P * COMISION;
// Tasa mensual que iguala lo recibido con las cuotas (bisección): base del APR y de la TAE.
const va = (cuota, n, i) => cuota * (1 - Math.pow(1 + i, -n)) / i;
function tasaMensual(recibido) {
  let lo = 1e-6, hi = 0.05;
  for (let k = 0; k < 200; k++) { const m = (lo + hi) / 2; if (va(L.cuota, L.n, m) > recibido) lo = m; else hi = m; }
  return (lo + hi) / 2;
}
const iSin = tasaMensual(P), iCon = tasaMensual(P - fee);
const apr = { sin: iSin * 12, con: iCon * 12 };                                       // EE. UU.: tasa periódica × 12
const tae = { sin: Math.pow(1 + iSin, 12) - 1, con: Math.pow(1 + iCon, 12) - 1 };     // España: (1 + i)^12 − 1
// Cuadro de amortización (con la cuota exacta, para el gráfico).
const cuadro = []; { const r = TIN / 12, c = cuotaExacta(P, TIN, L.n); let s = P; for (let k = 1; k <= L.n; k++) { const i = s * r; cuadro.push({ k, i, p: c - i }); s -= c - i; } }

const comprobar = (ok, msg) => { if (!ok) throw new Error('coste-real-prestamo: ' + msg); };
const r0 = Math.round;
comprobar(L.cuota === 202.76, 'cuota');
comprobar(r0(P) + r0(L.interes) === r0(L.total), 'prestado + intereses ≠ total (redondeado)');
comprobar(Math.abs(apr.sin - TIN) < 0.0001, 'APR sin comisión debería ser el TIN');
comprobar(Math.abs(tae.sin - (Math.pow(1 + TIN / 12, 12) - 1)) < 0.0001, 'TAE sin comisión');
comprobar(Math.abs(va(L.cuota, L.n, iCon) - (P - fee)) < 0.01, 'APR/TAE con comisión no cuadra');
comprobar(apr.con > apr.sin && tae.con > tae.sin, 'la comisión debería encarecer');
comprobar(Math.abs(cuadro.reduce((s, x) => s + x.p, 0) - P) < 0.01, 'el cuadro no amortiza el capital');
const parte1 = cuadro[0].i / L.cuota; comprobar(parte1 > 0.3 && parte1 < 0.36, '«un tercio» de intereses en la primera cuota');
comprobar(cent(cuadro[0].i) === 66.67 && cent(cuadro[L.n - 1].i) === 1.34, 'intereses primera/última cuota');
comprobar(plazos.every((x, k) => !k || (x.cuota < plazos[k - 1].cuota && x.interes > plazos[k - 1].interes)), 'plazos');
const [p3, , p7] = plazos;
const menosAlMes = cent(p3.cuota - p7.cuota), masInteres = p7.interes - p3.interes;
comprobar(r0(masInteres) === r0(p7.interes) - r0(p3.interes), 'diferencia de intereses redondeada');

// ── Formato ───────────────────────────────────────────────────────────────────
const agrupar = (n, sep) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, sep);
function dinero(x, lang, dec = 0) {
  const c = Math.round(Math.abs(x) * 100), ent = dec ? Math.floor(c / 100) : Math.round(c / 100), cts = String(c % 100).padStart(2, '0');
  const num = lang === 'en' ? agrupar(ent, ',') + (dec ? '.' + cts : '') : agrupar(ent, '.') + (dec ? ',' + cts : '');
  return (x < 0 ? '−' : '') + (lang === 'en' ? '$' + num : num + '\u00a0€');   // espacio que no se parte
}
const pct = (x, lang) => (x * 100).toFixed(2).replace('.', lang === 'en' ? '.' : ',') + '%';

const T = {
  en: {
    kicker: 'LOAN BASICS', desliza: 'Swipe →',
    s1: { t: 'What a loan <span class="c">really&nbsp;costs</span>', l: `The rate in the ad is only part of the price. Example: ${dinero(P, 'en')} at 8% over ${ANOS} years.`,
      prestado: 'Borrowed', interes: 'Interest', total: 'You pay back' },
    s2: { t: 'Interest rate vs. <span class="c">APR</span>', l: 'Two percentages that look alike but measure different&nbsp;things.',
      a: ['Interest rate', 'The yearly price of the money you borrow. Nothing else.', TIN, 0],
      b: ['APR · Annual percentage rate', `Interest plus fees (here, a ${COMISION * 100}% origination fee) as one yearly rate. Use it to compare.`, apr.sin, apr.con - apr.sin],
      nota: 'Lenders must show the APR before you sign, under the Truth in Lending Act. Source: CFPB.' },
    s3: { t: 'Example: the <span class="c">monthly&nbsp;payment</span>', l: `${dinero(P, 'en')} at 8% for ${ANOS} years, with the same payment every month (a standard amortizing loan).`,
      alMes: 'a month', filas: [['Payments', String(L.n)], ['Total you pay back', dinero(L.total, 'en')], ['Of which, interest', dinero(L.interes, 'en'), true]],
      nota: `Payment = P × r ÷ (1 − (1 + r)<sup>−n</sup>), with P&nbsp;=&nbsp;${dinero(P, 'en')}, r&nbsp;=&nbsp;8%&nbsp;÷&nbsp;12 and n&nbsp;=&nbsp;${L.n}.` },
    s4: { t: 'Where each <span class="c">payment&nbsp;goes</span>', l: 'The payment stays the same, but its mix changes: at first about a third is interest; by the end, almost&nbsp;none.',
      ley: ['Interest', 'Principal (pays down the loan)'], pago: (k) => `Payment ${k}`, int: 'interest',
      nota: 'That’s why extra payments early in the loan save the most interest.' },
    s5: { t: 'A small fee, <span class="c">a higher real&nbsp;cost</span>', l: `Same loan with a ${COMISION * 100}% origination fee (${dinero(fee, 'en')}). You receive ${dinero(P - fee, 'en')}, but repay the payments on ${dinero(P, 'en')}.`,
      casos: [['No fee', 0, apr.sin], [`${COMISION * 100}% fee`, fee, apr.con]], coste: 'Total cost', tasa: 'APR', ley: ['Interest', 'Fee'],
      nota: `APR assumes you keep the loan for the full ${ANOS} years.` },
    s6: { t: 'Longer term, <span class="c">more&nbsp;interest</span>', l: `A longer loan lowers the payment, but you pay interest for more months. ${dinero(P, 'en')} at 8%:`,
      anos: 'years', alMes: '/mo', int: 'interest',
      final: `7 years instead of 3: ${dinero(menosAlMes, 'en', 2)} less a month, but ${dinero(masInteres, 'en')} more&nbsp;interest.` },
    s7: { t: 'Before you <span class="c">sign</span>', items: [['Compare APRs, not just rates', 'It’s the number that includes fees'], ['Ask about every fee', 'Origination, late payment, prepayment'], ['Look at the total cost', 'Not only the monthly payment'], ['Pick the shortest term you can afford', 'A payment that fits, without stretching it out']],
      final: 'Read the Truth in Lending disclosure: it shows the APR, the finance charge and the total of&nbsp;payments.', nota: 'Example for education only. Your rate and fees depend on the lender and your credit.' }
  },
  es: {
    kicker: 'PRÉSTAMOS', desliza: 'Desliza →',
    s1: { t: 'El coste real de <span class="c">un&nbsp;préstamo</span>', l: `El tipo del anuncio es solo una parte del precio. Ejemplo: ${dinero(P, 'es')} al 8% TIN a ${ANOS} años.`,
      prestado: 'Te prestan', interes: 'Intereses', total: 'Devuelves en total' },
    s2: { t: 'TIN y TAE: <span class="c">no son lo&nbsp;mismo</span>', l: 'Dos porcentajes que se parecen, pero miden cosas&nbsp;distintas.',
      a: ['TIN · Tipo de interés nominal', 'El precio del dinero que te prestan. Sin comisiones.', TIN, 0],
      b: ['TAE · Tasa anual equivalente', `Suma las comisiones (aquí, una de apertura del ${COMISION * 100}%) y la frecuencia de pago. Es la que sirve para comparar.`, tae.sin, tae.con - tae.sin],
      nota: `Sin comisiones, la TAE ya sería ${pct(tae.sin, 'es')}: pagar cada mes encarece un poco el TIN. Fuente: Banco de España.` },
    s3: { t: 'Ejemplo: <span class="c">la&nbsp;cuota</span>', l: `${dinero(P, 'es')} al 8% TIN durante ${ANOS} años, con la misma cuota cada mes (sistema francés, el más habitual).`,
      alMes: 'al mes', filas: [['Número de cuotas', String(L.n)], ['Total que devuelves', dinero(L.total, 'es')], ['De eso, intereses', dinero(L.interes, 'es'), true]],
      nota: `Cuota = C × i ÷ (1 − (1 + i)<sup>−n</sup>), con C&nbsp;=&nbsp;${dinero(P, 'es')}, i&nbsp;=&nbsp;8%&nbsp;÷&nbsp;12 y n&nbsp;=&nbsp;${L.n}.` },
    s4: { t: 'A dónde va <span class="c">cada&nbsp;cuota</span>', l: 'La cuota no cambia, pero su reparto sí: al principio, un tercio son intereses; al final, casi&nbsp;nada.',
      ley: ['Intereses', 'Capital (lo que reduce la deuda)'], pago: (k) => `Cuota ${k}`, int: 'de intereses',
      nota: 'Por eso amortizar anticipadamente al principio es lo que más intereses&nbsp;ahorra.' },
    s5: { t: 'Una comisión pequeña, <span class="c">un coste&nbsp;mayor</span>', l: `El mismo préstamo con una comisión de apertura del ${COMISION * 100}% (${dinero(fee, 'es')}). Recibes ${dinero(P - fee, 'es')}, pero pagas las cuotas de&nbsp;${dinero(P, 'es')}.`,
      casos: [['Sin comisión', 0, tae.sin], [`Comisión del ${COMISION * 100}%`, fee, tae.con]], coste: 'Coste total', tasa: 'TAE', ley: ['Intereses', 'Comisión'],
      nota: `La TAE supone que mantienes el préstamo los ${ANOS} años.` },
    s6: { t: 'Más plazo, <span class="c">más&nbsp;intereses</span>', l: `Un plazo largo baja la cuota, pero pagas intereses durante más meses. ${dinero(P, 'es')} al 8%:`,
      anos: 'años', alMes: '/mes', int: 'intereses',
      final: `A 7 años en vez de 3: ${dinero(menosAlMes, 'es', 2)} menos al mes, pero ${dinero(masInteres, 'es')} más de&nbsp;intereses.` },
    s7: { t: 'Antes de <span class="c">firmar</span>', items: [['Compara la TAE, no solo el TIN', 'Es la que incluye las comisiones'], ['Pregunta por todas las comisiones', 'Apertura, estudio, amortización anticipada'], ['Mira el coste total', 'No solo la cuota mensual'], ['Elige el plazo más corto que puedas pagar', 'Una cuota cómoda, sin alargarla de más']],
      final: 'Pide la Información Normalizada Europea: resume la TAE, las cuotas, las comisiones y el coste&nbsp;total.', nota: 'Ejemplo con fines educativos. Tu tipo y tus comisiones dependen de la entidad.' }
  }
};

const estilo = '<style>@media (max-height:1400px){.item small{font-size:26px}}</style>';
const leyenda = (pares) => `<div style="display:flex;gap:30px;font-size:26px;color:${C.texto};font-weight:600">${pares.map(([color, txt]) =>
  `<span style="display:flex;align-items:center;gap:12px"><span style="width:22px;height:22px;border-radius:6px;background:${color}"></span>${txt}</span>`).join('')}</div>`;

// Gráfico de las 60 cuotas: intereses (abajo) y capital (arriba), separados por 2 px.
function grafico() {
  const W = 900, H = 300, slot = W / L.n, bw = slot - 4, c = cuotaExacta(P, TIN, L.n), y = (v) => v / c * (H - 6);
  return `<svg width="100%" viewBox="0 0 ${W} ${H}" style="display:block">${cuadro.map(({ k, i, p }) => {
    const x = (k - 1) * slot + 2, hi = y(i), hp = y(p) - 2;
    return `<rect x="${x.toFixed(1)}" y="${(H - hi).toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(hi, 1.5).toFixed(1)}" rx="2" fill="${ROJO}"/><rect x="${x.toFixed(1)}" y="${(H - hi - 2 - hp).toFixed(1)}" width="${bw.toFixed(1)}" height="${hp.toFixed(1)}" rx="2" fill="${C.necesidades}"/>`; }).join('')}</svg>`;
}

module.exports = {
  slug: 'coste-real-prestamo',
  T,
  diapositivas: [
    // 1 · Portada: lo prestado frente a los intereses
    (t, lang) => `<h1 class="grande">${t.s1.t}</h1><p class="lead">${t.s1.l}</p>
      <div class="tarjeta" style="margin-top:60px;padding:46px 42px 38px">
        ${barra([{ valor: P, color: C.necesidades }, { valor: L.interes, color: ROJO }], { alto: 110, radio: 18 })}
        <div style="display:flex;justify-content:space-between;margin-top:24px">
          <div><div style="font-size:64px;font-weight:800;letter-spacing:-.03em;color:${C.necesidades}">${dinero(P, lang)}</div><div style="font-size:28px;color:${C.texto};margin-top:4px;font-weight:600">${t.s1.prestado}</div></div>
          <div style="text-align:right"><div style="font-size:64px;font-weight:800;letter-spacing:-.03em;color:${ROJO}">+${dinero(L.interes, lang)}</div><div style="font-size:28px;color:${C.texto};margin-top:4px;font-weight:600">${t.s1.interes}</div></div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:baseline;border-top:1px solid ${C.borde};margin-top:30px;padding-top:24px">
          <span style="font-size:32px;font-weight:700">${t.s1.total}</span><span style="font-size:48px;font-weight:800;font-variant-numeric:tabular-nums">${dinero(L.total, lang)}</span></div>
      </div>`,
    // 2 · Tipo nominal frente a coste efectivo (APR / TAE)
    (t, lang) => `<h1>${t.s2.t}</h1><p class="lead">${t.s2.l}</p>
      <div style="margin-top:44px;display:flex;flex-direction:column;gap:20px">${[t.s2.a, t.s2.b].map(([nombre, desc, base, extra]) => `<div class="tarjeta" style="padding:30px 36px">
        <div style="display:flex;justify-content:space-between;align-items:baseline;gap:20px"><span style="font-size:24px;font-weight:800;letter-spacing:.06em;color:${C.suave}">${nombre.toUpperCase()}</span><span style="font-size:56px;font-weight:800;letter-spacing:-.03em;font-variant-numeric:tabular-nums">${pct(base + extra, lang)}</span></div>
        <div style="margin:16px 0 18px;width:${((base + extra) / 0.10 * 100).toFixed(1)}%">${barra(extra ? [{ valor: base, color: ROJO }, { valor: extra, color: RAYADO }] : [{ valor: 1, color: ROJO }], { alto: 26, radio: 8 })}</div>
        <div style="font-size:28px;line-height:1.4;color:${C.texto}">${desc}</div></div>`).join('')}</div>
      <p class="nota" style="margin-top:24px">${t.s2.nota}</p>`,
    // 3 · La cuota: fórmula y totales
    (t, lang) => `<h1>${t.s3.t}</h1><p class="lead">${t.s3.l}</p>
      <div class="tarjeta" style="margin-top:44px;padding:34px 38px">
        <div style="display:flex;align-items:baseline;gap:18px;padding-bottom:22px;border-bottom:1px solid ${C.borde}"><span class="pct" style="color:${C.acento}">${dinero(L.cuota, lang, 2)}</span><span style="font-size:32px;color:${C.texto};font-weight:600">${t.s3.alMes}</span></div>
        ${t.s3.filas.map(([a, b, rojo]) => `<div class="fila"><span class="eti">${rojo ? `<span class="punto" style="background:${ROJO}"></span>` : ''}${a}</span><span class="val">${b}</span></div>`).join('')}
      </div><p class="nota" style="margin-top:22px">${t.s3.nota}</p>`,
    // 4 · A dónde va cada cuota (cuadro de amortización)
    (t, lang) => `<h1>${t.s4.t}</h1><p class="lead">${t.s4.l}</p>
      <div class="tarjeta" style="margin-top:40px;padding:30px 34px 28px">
        ${leyenda([[ROJO, t.s4.ley[0]], [C.necesidades, t.s4.ley[1]]])}
        <div style="margin-top:24px">${grafico()}</div>
        <div style="display:flex;justify-content:space-between;margin-top:18px">${[[1, cuadro[0].i, 'left'], [L.n, cuadro[L.n - 1].i, 'right']].map(([k, i, al]) =>
          `<div style="text-align:${al}"><div style="font-size:26px;color:${C.suave};font-weight:600">${t.s4.pago(k)}</div><div style="font-size:32px;font-weight:800;margin-top:2px;font-variant-numeric:tabular-nums">${dinero(i, lang, 2)} <span style="font-size:26px;color:${C.texto};font-weight:600">${t.s4.int}</span></div></div>`).join('')}</div>
      </div><p class="nota" style="margin-top:22px">${t.s4.nota}</p>`,
    // 5 · Una comisión de apertura sube el coste real
    (t, lang) => { const max = L.interes + fee; return `<h1>${t.s5.t}</h1><p class="lead">${t.s5.l}</p>
      <div class="tarjeta" style="margin-top:44px;padding:34px 38px 30px">${t.s5.casos.map(([nombre, f, tasa], k) => `<div style="${k ? `margin-top:30px;padding-top:28px;border-top:1px solid ${C.borde}` : ''}">
        <div style="display:flex;justify-content:space-between;align-items:baseline"><span style="font-size:32px;font-weight:800">${nombre}</span><span style="font-size:30px;font-weight:700;color:${C.texto}">${t.s5.tasa} <b style="color:${C.tinta};font-weight:800">${pct(tasa, lang)}</b></span></div>
        <div style="margin-top:16px;width:${((L.interes + f) / max * 100).toFixed(1)}%">${barra(f ? [{ valor: L.interes, color: ROJO }, { valor: f, color: RAYADO }] : [{ valor: 1, color: ROJO }], { alto: 30, radio: 9 })}</div>
        <div style="margin-top:12px;font-size:28px;color:${C.texto}">${t.s5.coste} <b style="color:${C.tinta};font-weight:800;font-variant-numeric:tabular-nums">${dinero(L.interes + f, lang)}</b></div></div>`).join('')}
        <div style="margin-top:28px">${leyenda([[ROJO, t.s5.ley[0]], [RAYADO, t.s5.ley[1]]])}</div>
      </div><p class="nota" style="margin-top:22px">${t.s5.nota}</p>`; },
    // 6 · El plazo: 3, 5 y 7 años
    (t, lang) => { const max = p7.interes; return `<h1>${t.s6.t}</h1><p class="lead">${t.s6.l}</p>
      <div class="tarjeta" style="margin-top:44px;padding:30px 38px">${plazos.map((x, k) => `<div style="padding:18px 0;${k ? `border-top:1px solid ${C.borde}` : ''}">
        <div style="display:flex;justify-content:space-between;align-items:baseline"><span style="font-size:32px;font-weight:800">${x.anos} ${t.s6.anos}</span><span style="font-size:30px;font-weight:700;font-variant-numeric:tabular-nums">${dinero(x.cuota, lang, 2)}<span style="font-size:26px;color:${C.suave};font-weight:600">${t.s6.alMes}</span></span></div>
        <div style="display:grid;grid-template-columns:1fr 250px;gap:18px;align-items:center;margin-top:12px">
          <div style="height:24px;border-radius:8px;background:${ROJO};width:${(x.interes / max * 100).toFixed(1)}%"></div>
          <span style="font-size:28px;text-align:right;color:${C.texto}"><b style="color:${C.tinta};font-weight:800;font-variant-numeric:tabular-nums">${dinero(x.interes, lang)}</b> ${t.s6.int}</span></div></div>`).join('')}</div>
      <p class="lead" style="margin-top:34px"><b>${t.s6.final}</b></p>`; },
    // 7 · Antes de firmar
    (t) => `${estilo}<h1>${t.s7.t}</h1>
      <div style="margin-top:44px;display:flex;flex-direction:column;gap:14px">${t.s7.items.map(([a, b], i) => `<div class="item"><span class="ic" style="background:rgba(15,159,143,.15);font-size:30px;font-weight:800;color:${C.acento}">${i + 1}</span><span>${a}<small>${b}</small></span></div>`).join('')}</div>
      <p class="lead" style="margin-top:36px"><b>${t.s7.final}</b></p><p class="nota">${t.s7.nota}</p>`
  ],
  texto: {
    en: `The rate in the ad is only part of what a loan costs. Here's how to see the full price. 🧮

Example: ${dinero(P, 'en')} at 8% over ${ANOS} years, with a fixed monthly payment (a standard amortizing loan):
• Monthly payment: ${dinero(L.cuota, 'en', 2)}
• ${L.n} payments: ${dinero(L.total, 'en')} in total
• Interest: ${dinero(L.interes, 'en')}

The payment never changes, but its mix does: the first one carries ${dinero(cuadro[0].i, 'en', 2)} of interest, the last one just ${dinero(cuadro[L.n - 1].i, 'en', 2)}. That's why extra payments early on save the most.

Interest rate vs. APR: the interest rate is the price of the money. The APR adds fees, like an origination fee, and turns everything into one yearly rate. With a ${COMISION * 100}% fee (${dinero(fee, 'en')}), you receive ${dinero(P - fee, 'en')}, the total cost rises to ${dinero(L.interes + fee, 'en')} and the APR to ${pct(apr.con, 'en')}. Lenders must show the APR before you sign (Truth in Lending Act).

The term matters too. At 8%:
${plazos.map(x => `• ${x.anos} years: ${dinero(x.cuota, 'en', 2)} a month, ${dinero(x.interes, 'en')} of interest`).join('\n')}

Before you sign: compare APRs, ask about every fee (origination, late payment, prepayment), look at the total cost and pick the shortest term whose payment fits your budget.

Example for education only; your rate and fees depend on the lender and your credit. Source: Consumer Financial Protection Bureau (CFPB).

FinanziApp tracks your loans with their full amortization schedule, extra payments included (free for 15 days, link in bio).

#personalloans #APR #debtfree #personalfinance #financialliteracy`,
    es: `El tipo del anuncio es solo una parte de lo que cuesta un préstamo. Así se ve el precio completo. 🧮

Ejemplo: ${dinero(P, 'es')} al 8% TIN a ${ANOS} años, con cuota fija mensual (sistema francés):
• Cuota: ${dinero(L.cuota, 'es', 2)} al mes
• ${L.n} cuotas: ${dinero(L.total, 'es')} en total
• Intereses: ${dinero(L.interes, 'es')}

La cuota no cambia, pero su reparto sí: la primera lleva ${dinero(cuadro[0].i, 'es', 2)} de intereses y la última, solo ${dinero(cuadro[L.n - 1].i, 'es', 2)}. Por eso amortizar anticipadamente al principio es lo que más intereses ahorra.

TIN y TAE: el TIN es el precio del dinero. La TAE suma las comisiones y la frecuencia de pago, y es la que sirve para comparar. Sin comisiones, este préstamo ya tiene una TAE del ${pct(tae.sin, 'es')} por pagarse cada mes. Con una comisión de apertura del ${COMISION * 100}% (${dinero(fee, 'es')}) recibes ${dinero(P - fee, 'es')}, el coste total sube a ${dinero(L.interes + fee, 'es')} y la TAE, al ${pct(tae.con, 'es')}.

El plazo también cuenta. Al 8%:
${plazos.map(x => `• ${x.anos} años: ${dinero(x.cuota, 'es', 2)} al mes y ${dinero(x.interes, 'es')} de intereses`).join('\n')}

Antes de firmar: compara la TAE, pregunta por todas las comisiones (apertura, estudio, amortización anticipada), mira el coste total y elige el plazo más corto cuya cuota te encaje. En los préstamos al consumo tienes 14 días naturales para desistir, y la comisión por amortización anticipada tiene un máximo legal del 1% (0,5% si queda menos de un año).

Ejemplo con fines educativos; tu tipo y tus comisiones dependen de la entidad. Fuente: Banco de España (Portal del Cliente Bancario).

FinanziApp sigue tus préstamos con su cuadro de amortización completo, también con amortizaciones anticipadas (gratis 15 días, enlace en la bio).

#prestamos #TAE #finanzaspersonales #educacionfinanciera #deudas`
  }
};
