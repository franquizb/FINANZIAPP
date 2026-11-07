// Carrusel educativo: riesgo y plazo (cuándo necesitas el dinero decide dónde va).
// Inglés en dólares (EE. UU.), español en euros (España). Rentabilidades ilustrativas,
// no datos reales de mercado. Todas las cifras se calculan y se comprueban aquí.
const { C, icono } = require('../comun');

const agrupar = (n, sep) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, sep);
const dinero = (n, lang) => (lang === 'en' ? '$' + agrupar(n, ',') : agrupar(n, '.') + ' €');
const pct = (x, lang) => (x > 0 ? '+' : x < 0 ? '−' : '') + String(Math.abs(x)).replace('.', lang === 'en' ? '.' : ',') + '%';
const ROJO = '#e66767';

// Rentabilidades anuales ilustrativas de la bolsa (10 años) y del ahorro (2 % fijo).
const BOLSA = [15, 8, -25, 20, 10, -5, 18, 12, -10, 15], AHORRO = 2, INICIO = 10000, VENDE = 3;
const camino = (rs) => rs.reduce((p, r) => [...p, p[p.length - 1] * (1 + r / 100)], [INICIO]);
const bolsa = camino(BOLSA), ahorro = camino(BOLSA.map(() => AHORRO));
const vendio = bolsa.map((v, a) => (a <= VENDE ? v : bolsa[VENDE]));   // vende tras el año 3 y se queda en efectivo al 0 %
const peorAno = Math.min(...BOLSA);
if (!BOLSA.includes(20) || Math.round(bolsa[10]) !== 15978 || Math.round(bolsa[VENDE]) !== 9315 || Math.round(ahorro[10]) !== 12190 || peorAno !== -25 || BOLSA[VENDE - 1] !== peorAno)
  throw new Error('riesgo-y-plazo: cifras de los caminos incoherentes');

// Dinero que necesitas dentro de 12 meses: ahorro al 2 %, un año bueno (+20 %) y uno malo (−30 %).
const META = 10000;
const corto = [['ahorro', AHORRO], ['bueno', 20], ['malo', -30]].map(([k, r]) => ({ k, r, v: META * (1 + r / 100) }));
const falta = META - corto[2].v;
if (corto[0].v !== 10200 || corto[1].v !== 12000 || corto[2].v !== 7000 || falta !== 3000) throw new Error('riesgo-y-plazo: cifras del corto plazo incoherentes');

// Mezclas ilustrativas por plazo (efectivo, renta fija, acciones). No son una recomendación.
const COL = { efectivo: C.ahorro, bonos: C.caprichos, acciones: C.necesidades };
const MEZCLA = { corto: { efectivo: 100 }, medio: { efectivo: 40, bonos: 35, acciones: 25 }, largo: { bonos: 20, acciones: 80 } };
const plazo = (anos) => (anos < 2 ? 'corto' : anos < 5 ? 'medio' : 'largo');
for (const m of Object.values(MEZCLA)) if (Object.values(m).reduce((s, v) => s + v, 0) !== 100) throw new Error('riesgo-y-plazo: mezcla que no suma 100');

const T = {
  en: {
    kicker: 'INVESTING BASICS', desliza: 'Swipe →', anos: 'years',
    plazos: { corto: ['0–2 years', 'Savings'], medio: ['2–5 years', 'A mix'], largo: ['5+ years', 'Mostly stocks'] },
    leyenda: { efectivo: 'Cash & savings', bonos: 'Bonds', acciones: 'Stocks' },
    s1: { t: 'When do you<br><span class="c">need this money?</span>', l: 'Risk and time horizon, explained. That one question decides how much risk your money can take.', nota: 'Illustrative mixes, not a recommendation.' },
    s2: { t: 'Three horizons,<br><span class="c">three homes</span>',
      filas: { corto: ['Under 2 years', 'Keep it safe', 'Emergency fund, next year’s trip or car', 'High‑yield savings, CDs, Treasury bills'],
        medio: ['2 to 5 years', 'A careful mix', 'A home down payment in 3 or 4 years', 'Savings and bonds, with some stocks'],
        largo: ['5+ years', 'Room to grow', 'Retirement, your kids’ college', 'Mostly diversified stocks, like index funds'] },
      nota: 'Illustrative mixes, not a recommendation: the right one depends on your situation and on how you’d handle a drop.' },
    s3: { t: 'Volatility:<br><span class="c">the ups and downs</span>', l: 'How much the value swings along the way. More expected growth usually comes with bigger swings.',
      bolsa: 'Stocks', ahorro: 'Savings', peor: 'Worst year', nota: 'Illustrative paths, not real market data: savings at 2% a year, stocks with made‑up yearly returns.' },
    s4: { t: 'Need it next year?<br><span class="c">Keep it safe</span>', l: 'Say you need $10,000 in 12 months for a down payment. Where it sits changes what you’d have:',
      filas: { ahorro: 'Savings account', bueno: 'Stocks, a good year', malo: 'Stocks, a bad year' }, meta: 'Goal',
      final: (f) => `A bad year would leave you ${f} short.`,
      nota: 'Illustrative returns. Real bad years can be worse: the S&P 500 fell more than 30% in 2008 (S&P Dow Jones Indices).' },
    s5: { t: 'Selling in a drop<br><span class="c">locks in the loss</span>', l: 'Same $10,000, same bumpy years. One investor sells after the big drop in year 3; the other stays.',
      quedo: 'Stayed', vendio: 'Sold in year 3', aqui: 'Sells here',
      final: 'A long horizon gives bad years time to be offset by good ones.',
      nota: 'Illustrative returns. Not a guarantee: markets can stay down for years. After selling, the money sits in cash at 0%.' },
    s6: { t: 'First the safety net,<br><span class="c">then invest</span>', l: 'So a surprise bill never forces you to sell your investments at a bad moment.',
      items: [['paraguas', 'A starter emergency fund', 'Around $1,000 for small surprises'], ['menos', 'Pay off high‑interest debt', 'Credit cards first'], ['escudo', 'A full emergency fund', '3–6 months of essential expenses'], ['sube', 'Invest for goals 5+ years away', 'Diversified, automatic and patient']] },
    s7: { t: 'Give every goal <span class="c">a date</span>', l: 'Then let the date decide where the money goes.',
      metas: [['Emergency fund', 'Any day', 0], ['New car', 'In 18 months', 1.5], ['Home down payment', 'In 4 years', 4], ['Retirement', 'In 30 years', 30]],
      nota: 'Returns are not guaranteed and investing can lose money. This is education, not financial advice.' }
  },
  es: {
    kicker: 'INVERSIÓN BÁSICA', desliza: 'Desliza →', anos: 'años',
    plazos: { corto: ['0-2 años', 'Ahorro'], medio: ['2-5 años', 'Mixto'], largo: ['+5 años', 'Sobre todo acciones'] },
    leyenda: { efectivo: 'Efectivo y ahorro', bonos: 'Renta fija', acciones: 'Acciones' },
    s1: { t: '¿Para cuándo<br><span class="c">es ese dinero?</span>', l: 'El riesgo y el plazo, explicados. Esa pregunta decide cuánto riesgo puede asumir tu dinero.', nota: 'Mezclas ilustrativas, no una recomendación.' },
    s2: { t: 'Tres plazos, <span class="c">tres sitios</span>',
      filas: { corto: ['Menos de 2 años', 'Que esté seguro', 'Fondo de emergencia, el viaje o el coche del año que viene', 'Cuenta remunerada, depósitos, Letras del Tesoro'],
        medio: ['De 2 a 5 años', 'Una mezcla prudente', 'La entrada de un piso dentro de 3 o 4 años', 'Ahorro y renta fija, con algo de bolsa'],
        largo: ['Más de 5 años', 'Margen para crecer', 'La jubilación, los estudios de tus hijos', 'Sobre todo bolsa diversificada, como fondos indexados'] },
      nota: 'Mezclas ilustrativas, no una recomendación: la tuya depende de tu situación y de cómo llevarías una caída.' },
    s3: { t: 'Volatilidad: <span class="c">los altibajos</span>', l: 'Cuánto sube y baja el valor por el camino. Más crecimiento esperado suele venir con más altibajos.',
      bolsa: 'Bolsa', ahorro: 'Ahorro', peor: 'Peor año', nota: 'Caminos ilustrativos, no datos reales: ahorro al 2% anual y bolsa con rentabilidades anuales inventadas.' },
    s4: { t: '¿Es a corto plazo?<br><span class="c">Mejor a salvo</span>', l: 'Necesitas 10.000 € dentro de 12 meses para la entrada de un piso. Según dónde estén, tendrías:',
      filas: { ahorro: 'Cuenta remunerada', bueno: 'Bolsa, un año bueno', malo: 'Bolsa, un año malo' }, meta: 'Objetivo',
      final: (f) => `En un año malo, te faltarían ${f}.`,
      nota: 'Rentabilidades ilustrativas. Los años malos reales pueden ser peores: el S&P 500 cayó más de un 30% en 2008 (S&P Dow Jones Indices).' },
    s5: { t: 'Vender en la caída<br><span class="c">consolida la pérdida</span>', l: 'Los mismos 10.000 € y los mismos años. Uno vende tras la gran caída del año 3; el otro se queda.',
      quedo: 'Se quedó', vendio: 'Vendió en el año 3', aqui: 'Vende aquí',
      final: 'Un plazo largo da tiempo a que los años buenos compensen los malos.',
      nota: 'Cifras ilustrativas. No es una garantía: la bolsa puede pasar años en negativo. Tras vender, el dinero queda en efectivo al 0%.' },
    s6: { t: 'Primero el colchón,<br><span class="c">después invertir</span>', l: 'Para que un imprevisto nunca te obligue a vender tus inversiones en mal momento.',
      items: [['paraguas', 'Un colchón inicial', 'Unos 1.000 € para imprevistos pequeños'], ['menos', 'Salda las deudas caras', 'Primero las tarjetas'], ['escudo', 'El fondo de emergencia completo', '3-6 meses de gastos básicos'], ['sube', 'Invierte para metas a más de 5 años', 'Diversificado, automático y con paciencia']] },
    s7: { t: 'Ponle <span class="c">fecha</span><br>a cada objetivo', l: 'Y deja que la fecha decida dónde va el dinero.',
      metas: [['Fondo de emergencia', 'Cualquier día', 0], ['Coche nuevo', 'En 18 meses', 1.5], ['Entrada del piso', 'En 4 años', 4], ['Jubilación', 'En 30 años', 30]],
      nota: 'La rentabilidad no está garantizada e invertir puede hacerte perder dinero. Esto es educación financiera, no asesoramiento.' }
  }
};

// Barra de la mezcla: tramos de efectivo, renta fija y acciones, con 3 px de separación.
function mezcla(k, alto = 28, radio = 9) {
  const tramos = Object.entries(MEZCLA[k]);
  return `<div style="display:flex;gap:3px;height:${alto}px">${tramos.map(([a, v], i) => {
    const izq = i === 0 ? radio : 4, der = i === tramos.length - 1 ? radio : 4;
    return `<span style="flex:${v};background:${COL[a]};border-radius:${izq}px ${der}px ${der}px ${izq}px"></span>`; }).join('')}</div>`;
}
const leyenda = (t) => `<div style="display:flex;gap:28px;flex-wrap:wrap;font-size:26px;color:${C.texto};font-weight:550">${Object.keys(COL).map(a =>
  `<span style="display:flex;align-items:center;gap:10px"><span class="punto" style="background:${COL[a]}"></span>${t.leyenda[a]}</span>`).join('')}</div>`;

// Gráfico de líneas con etiquetas directas al final de cada serie.
function grafico(t, lang, series, marca) {
  const W = 900, H = 430, pl = 8, pr = 14, pt = 20, pb = 54, min = 8000, max = 18000;
  const x = (a) => pl + (a / 10) * (W - pl - pr), y = (v) => pt + (1 - (v - min) / (max - min)) * (H - pt - pb);
  const rejilla = [10000, 12000, 14000, 16000, 18000].map(v => `<line x1="${pl}" x2="${W - pr}" y1="${y(v)}" y2="${y(v)}" stroke="rgba(148,163,184,.12)" stroke-width="1"/>`).join('');
  const ejes = [0, 5, 10].map(a => `<text x="${x(a)}" y="${H - 12}" fill="${C.suave}" font-size="27" text-anchor="${a === 0 ? 'start' : a === 10 ? 'end' : 'middle'}">${a === 0 ? '0' : a + ' ' + t.anos}</text>`).join('');
  const lineas = series.map(s => `<path d="${s.puntos.map((v, a) => `${a ? 'L' : 'M'}${x(a).toFixed(1)},${y(v).toFixed(1)}`).join(' ')}" fill="none" stroke="${s.color}" stroke-width="${s.ancho || 4}" stroke-linejoin="round" stroke-linecap="round"/>
    <circle cx="${x(10)}" cy="${y(s.puntos[10])}" r="8" fill="${s.color}" stroke="${C.superficie}" stroke-width="2"/>
    <text x="${x(10) - 18}" y="${y(s.puntos[10]) + (s.abajo ? 42 : -20)}" fill="${C.tinta}" font-size="28" font-weight="750" text-anchor="end">${s.etiqueta}</text>`).join('');
  return `<svg width="100%" viewBox="0 0 ${W} ${H}">${rejilla}${lineas}${marca || ''}${ejes}</svg>`;
}

module.exports = {
  slug: 'riesgo-y-plazo',
  T,
  diapositivas: [
    // 1 · Portada: el plazo decide la mezcla
    (t) => `<h1 class="grande">${t.s1.t}</h1><p class="lead">${t.s1.l}</p>
      <div class="tarjeta" style="margin-top:56px;padding:38px 36px 34px">
        <div style="display:flex;gap:16px">${['corto', 'medio', 'largo'].map((k, i) => `<div style="flex:${[2, 3, 5][i]};min-width:0">
          <div style="font-size:30px;font-weight:800;color:${C.tinta};margin-bottom:16px;white-space:nowrap">${t.plazos[k][0]}</div>
          ${mezcla(k, 110, 16)}
          <div style="font-size:28px;font-weight:600;color:${C.texto};margin-top:16px;line-height:1.3">${t.plazos[k][1]}</div></div>`).join('')}</div>
        <div style="margin-top:30px;padding-top:24px;border-top:1px solid ${C.borde}">${leyenda(t)}</div>
      </div><p class="nota">${t.s1.nota}</p>`,
    // 2 · Tres plazos, tres sitios
    (t) => `<h1>${t.s2.t}</h1>
      <div style="margin-top:40px;display:flex;flex-direction:column;gap:16px">${['corto', 'medio', 'largo'].map(k => { const [p, lema, ej, donde] = t.s2.filas[k]; return `<div class="tarjeta" style="padding:26px 32px 28px">
        <div style="display:flex;justify-content:space-between;align-items:baseline;gap:20px"><span style="font-size:34px;font-weight:800">${p}</span><span style="font-size:26px;font-weight:700;color:${C.suave};letter-spacing:.02em">${lema}</span></div>
        <div style="font-size:26px;color:${C.suave};margin-top:8px;line-height:1.35">${ej}</div>
        <div style="font-size:29px;color:${C.tinta};font-weight:600;margin:10px 0 16px;line-height:1.35">→ ${donde}</div>
        ${mezcla(k, 20, 7)}</div>`; }).join('')}</div>
      <div style="margin-top:22px">${leyenda(t)}</div>
      <p class="nota">${t.s2.nota}</p>`,
    // 3 · Volatilidad
    (t, lang) => { const x = (a) => 8 + (a / 10) * 878, y = (v) => 20 + (1 - (v - 8000) / 10000) * 356;
      const marca = `<circle cx="${x(VENDE)}" cy="${y(bolsa[VENDE])}" r="9" fill="${ROJO}" stroke="${C.superficie}" stroke-width="2"/>
        <text x="${x(VENDE) + 20}" y="${y(bolsa[VENDE]) + 9}" fill="${ROJO}" font-size="28" font-weight="800">${pct(peorAno, lang)}</text>`;
      return `<h1>${t.s3.t}</h1><p class="lead">${t.s3.l}</p>
      <div class="tarjeta" style="margin-top:40px;padding:26px 26px 18px">${grafico(t, lang, [
        { puntos: ahorro, color: C.ahorro, etiqueta: t.s3.ahorro, abajo: true },
        { puntos: bolsa, color: C.necesidades, etiqueta: t.s3.bolsa }], marca)}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:18px">${[[t.s3.ahorro, AHORRO, C.ahorro], [t.s3.bolsa, peorAno, C.necesidades]].map(([n, v, col]) => `<div class="tarjeta" style="padding:22px 28px">
        <div style="display:flex;align-items:center;gap:12px;font-size:26px;color:${C.texto};font-weight:600"><span class="punto" style="background:${col}"></span>${n} · ${t.s3.peor}</div>
        <div style="font-size:46px;font-weight:800;letter-spacing:-.02em;margin-top:6px;color:${v < 0 ? ROJO : C.tinta}">${pct(v, lang)}</div></div>`).join('')}</div>
      <p class="nota">${t.s3.nota}</p>`; },
    // 4 · Dinero que necesitas pronto
    (t, lang) => { const tope = 12000, colores = { ahorro: C.ahorro, bueno: C.necesidades, malo: ROJO };
      return `<h1>${t.s4.t}</h1><p class="lead">${t.s4.l}</p>
      <div class="tarjeta" style="margin-top:40px;padding:30px 34px 34px">
        <div style="display:flex;justify-content:flex-end;align-items:center;gap:12px;font-size:26px;color:${C.suave};font-weight:600"><span style="width:0;height:26px;border-left:3px dashed ${C.tinta}"></span>${t.s4.meta}: ${dinero(META, lang)}</div>
        ${corto.map(({ k, r, v }) => `<div style="margin-top:22px">
          <div style="display:flex;justify-content:space-between;align-items:baseline"><span style="font-size:29px;font-weight:650;color:${C.texto}">${t.s4.filas[k]} <span style="color:${C.suave};font-weight:600">(${pct(r, lang)})</span></span><span style="font-size:40px;font-weight:800;font-variant-numeric:tabular-nums;color:${k === 'malo' ? ROJO : C.tinta}">${dinero(v, lang)}</span></div>
          <div style="position:relative;height:28px;margin-top:12px;border-radius:9px;background:rgba(148,163,184,.10)">
            <span style="position:absolute;left:0;top:0;bottom:0;width:${(v / tope * 100).toFixed(2)}%;border-radius:9px;background:${colores[k]}"></span>
            <span style="position:absolute;left:${(META / tope * 100).toFixed(2)}%;top:-8px;bottom:-8px;border-left:3px dashed ${C.tinta}"></span></div></div>`).join('')}
      </div>
      <p class="lead" style="margin-top:32px"><b>${t.s4.final(dinero(falta, lang))}</b></p>
      <p class="nota">${t.s4.nota}</p>`; },
    // 5 · El tiempo invertido
    (t, lang) => { const x = (a) => 8 + (a / 10) * 878, y = (v) => 20 + (1 - (v - 8000) / 10000) * 356;
      const marca = `<circle cx="${x(VENDE)}" cy="${y(bolsa[VENDE])}" r="9" fill="${C.caprichos}" stroke="${C.superficie}" stroke-width="2"/>
        <text x="${x(VENDE)}" y="${y(bolsa[VENDE]) + 48}" fill="${C.texto}" font-size="26" font-weight="700" text-anchor="middle">${t.s5.aqui}</text>`;
      return `<h1>${t.s5.t}</h1><p class="lead">${t.s5.l}</p>
      <div class="tarjeta" style="margin-top:40px;padding:26px 26px 18px">${grafico(t, lang, [
        { puntos: vendio, color: C.caprichos, etiqueta: `${t.s5.vendio}: ${dinero(vendio[10], lang)}`, abajo: true },
        { puntos: bolsa, color: C.necesidades, etiqueta: `${t.s5.quedo}: ${dinero(bolsa[10], lang)}` }], marca)}</div>
      <p class="lead" style="margin-top:32px"><b>${t.s5.final}</b></p>
      <p class="nota">${t.s5.nota}</p>`; },
    // 6 · Primero el colchón
    (t) => `<h1>${t.s6.t}</h1><p class="lead">${t.s6.l}</p>
      <div style="margin-top:40px;display:flex;flex-direction:column;gap:16px">${t.s6.items.map(([ic, a, b], i) =>
        `<div class="item"><span class="ic" style="background:rgba(15,159,143,.15);font-size:28px;font-weight:800;color:${C.acento}">${i + 1}</span><span class="ic" style="width:auto;height:auto">${icono(ic, C.necesidades, 36)}</span><span>${a}<small>${b}</small></span></div>`).join('')}</div>`,
    // 7 · Ponle fecha a cada objetivo
    (t) => `<h1>${t.s7.t}</h1><p class="lead">${t.s7.l}</p>
      <div class="tarjeta" style="margin-top:40px;padding:8px 34px">${t.s7.metas.map(([meta, cuando, anos], i) => { const k = plazo(anos); return `<div style="display:grid;grid-template-columns:1fr 290px;gap:24px;align-items:center;padding:24px 0;${i ? `border-top:1px solid ${C.borde}` : ''}">
        <span><span style="display:block;font-size:31px;font-weight:700">${meta}</span><span style="display:block;font-size:26px;color:${C.suave};margin-top:4px">${cuando}</span></span>
        <span><span style="display:block;font-size:26px;font-weight:650;color:${C.texto};margin-bottom:10px;text-align:right">${t.plazos[k][1]}</span>${mezcla(k, 18, 6)}</span></div>`; }).join('')}</div>
      <div style="margin-top:22px">${leyenda(t)}</div>
      <p class="nota" style="margin-top:22px">${t.s7.nota}</p>`
  ],
  texto: {
    en: `Before asking "what should I invest in?", ask "when do I need this money?" 🗓️

The time horizon decides how much risk your money can take:
• Under 2 years (emergency fund, next year's trip or car): keep it safe, in high-yield savings, CDs or Treasury bills.
• 2 to 5 years (a down payment in 3 or 4 years): a careful mix of savings and bonds, with some stocks.
• 5+ years (retirement, your kids' college): room to grow, usually mostly diversified stocks, like index funds.

Risk here mostly means volatility: how much the value swings along the way. In our illustrative example, savings grow 2% every year, while stocks have years like +20% and ${pct(peorAno, 'en')}.

Why short-term money stays out of stocks: if you need ${dinero(META, 'en')} in 12 months, a savings account at 2% gives you ${dinero(corto[0].v, 'en')}. Stocks might give you ${dinero(corto[1].v, 'en')} in a good year or ${dinero(corto[2].v, 'en')} in a bad one, and you'd be ${dinero(falta, 'en')} short right when you need it. Bad years happen: the S&P 500 fell more than 30% in 2008 (S&P Dow Jones Indices).

Why time in the market matters: same ${dinero(INICIO, 'en')}, same illustrative years. The investor who sold after the year-3 drop ended with ${dinero(vendio[10], 'en')}; the one who stayed, ${dinero(bolsa[10], 'en')}. A long horizon gives bad years time to be offset by good ones, but it's not a guarantee: markets can stay down for years.

The order: a starter emergency fund, pay off high-interest debt, a full emergency fund (3–6 months of essentials), then invest for goals 5+ years away.

Returns are not guaranteed, and investing can lose money. This is education, not financial advice.

FinanziApp shows how many months of expenses your savings cover, and its compound interest calculator has a volatile mode that simulates ups and downs, with a pessimistic and an optimistic range (free for 15 days, link in bio).

#investingforbeginners #personalfinance #financialliteracy #emergencyfund #moneytips`,
    es: `Antes de preguntarte «¿en qué invierto?», pregúntate «¿para cuándo es este dinero?» 🗓️

El plazo decide cuánto riesgo puede asumir tu dinero:
• Menos de 2 años (fondo de emergencia, el viaje o el coche del año que viene): que esté seguro, en una cuenta remunerada, depósitos o Letras del Tesoro.
• De 2 a 5 años (la entrada de un piso dentro de 3 o 4 años): una mezcla prudente de ahorro y renta fija, con algo de bolsa.
• Más de 5 años (la jubilación, los estudios de tus hijos): margen para crecer, normalmente sobre todo acciones diversificadas, como fondos indexados.

Aquí riesgo significa sobre todo volatilidad: cuánto sube y baja el valor por el camino. En nuestro ejemplo ilustrativo, el ahorro crece un 2% cada año, mientras que la bolsa tiene años de +20% y de ${pct(peorAno, 'es')}.

Por qué el dinero a corto plazo no va a bolsa: si necesitas ${dinero(META, 'es')} dentro de 12 meses, una cuenta remunerada al 2% te deja ${dinero(corto[0].v, 'es')}. La bolsa podría dejarte ${dinero(corto[1].v, 'es')} en un año bueno o ${dinero(corto[2].v, 'es')} en uno malo, y te faltarían ${dinero(falta, 'es')} justo cuando los necesitas. Los años malos existen: el S&P 500 cayó más de un 30% en 2008 (S&P Dow Jones Indices).

Por qué importa el tiempo invertido: los mismos ${dinero(INICIO, 'es')}, los mismos años ilustrativos. Quien vendió tras la caída del año 3 acabó con ${dinero(vendio[10], 'es')}; quien se quedó, con ${dinero(bolsa[10], 'es')}. Un plazo largo da tiempo a que los años buenos compensen los malos, pero no es una garantía: la bolsa puede pasar años en negativo.

El orden: un colchón inicial, saldar las deudas caras, el fondo de emergencia completo (3-6 meses de gastos básicos) y después invertir para metas a más de 5 años.

La rentabilidad no está garantizada e invertir puede hacerte perder dinero. Esto es educación financiera, no asesoramiento.

FinanziApp te dice cuántos meses de gastos cubren tus ahorros, y su calculadora de interés compuesto tiene un modo volátil que simula altibajos, con un escenario pesimista y uno optimista (gratis 15 días, enlace en la bio).

#invertirdesdecero #finanzaspersonales #educacionfinanciera #fondodeemergencia #ahorro`
  }
};
