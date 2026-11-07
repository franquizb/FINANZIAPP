// Carrusel educativo: cómo funciona el interés compuesto. Todas las cifras se
// calculan aquí (7% anual, capitalización mensual en las aportaciones).
const { C, barra } = require('../comun');

const agrupar = (n, sep) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, sep);
const dinero = (n, lang, dec = 0) => {
  const f = (x) => (dec ? x.toFixed(dec).replace('.', lang === 'en' ? '.' : ',').replace(/\B(?=(\d{3})+(?!\d)(?=[.,]|$))/g, '') : x);
  if (dec) { const [e, d] = n.toFixed(dec).split('.'); return lang === 'en' ? '$' + agrupar(+e, ',') + '.' + d : agrupar(+e, '.') + ',' + d + ' €'; }
  return lang === 'en' ? '$' + agrupar(n, ',') : agrupar(n, '.') + ' €';
};
const R = 0.07, r = R / 12;
const vfAportes = (m, meses, tm = r) => m * (Math.pow(1 + tm, meses) - 1) / tm;
const curva = Array.from({ length: 31 }, (_, a) => ({ a, total: vfAportes(200, a * 12), aportado: 200 * 12 * a }));
const final = curva[30];
const ana = vfAportes(200, 120) * Math.pow(1 + r, 360);        // 25→35 aportando, 35→65 sin aportar
const ben = vfAportes(200, 360);                                  // 35→65 aportando
const simple = (a) => 1000 * (1 + R * a), comp = (a) => 1000 * Math.pow(1 + R, a);
const conComision = vfAportes(200, 360, 0.06 / 12);              // mismo ejemplo con un 1% anual de comisiones
const perdida = 1 - conComision / ben;

const T = {
  en: {
    kicker: 'INVESTING BASICS', desliza: 'Swipe →', anos: 'years',
    s1: { t: 'How compound interest <span class="c">really works</span>', l: '$200 a month for 30 years at a 7% average yearly return:', total: 'Total', puesto: 'You put in' },
    s2: { t: 'Simple vs. compound', l: '$1,000 earning 7% a year. Simple interest only pays on the original $1,000. Compound pays on everything.', simple: 'Simple', comp: 'Compound', tras: 'After' },
    s3: { t: 'Interest on your <span class="c">interest</span>', l: '$1,000 at 7%. Each year’s interest is bigger, because it’s calculated on a bigger balance.', ano: 'Year', interes: 'Interest', saldo: 'Balance' },
    s4: { t: 'Time beats <span class="c">amount</span>', l: 'Both invest $200 a month at 7%. Ana starts at 25 and stops at 35. Ben starts at 35 and keeps going until 65.',
      p: [['Ana', 'Invests from 25 to 35, then stops'], ['Ben', 'Invests from 35 to 65']], puso: 'put in', a65: 'at 65' },
    s5: { t: 'The rule of <span class="c">72</span>', l: 'A quick way to estimate how long money takes to double: divide 72 by the yearly rate.', dobla: 'doubles in about', nota: 'It’s an approximation, but a very good one for rates between 4% and 12%.' },
    s6: { t: 'It works <span class="c">against you</span> too', l: 'Credit cards often charge 20% a year or more. At 24%, an unpaid balance doubles in about 3 years (72 ÷ 24).', deuda: 'Unpaid card balance', hoy: 'Today', en3: 'In 3 years', en6: 'In 6 years' },
    s7: { t: 'How to make it <span class="c">work for you</span>', items: [['Start early, even if it’s small', 'Time does most of the work'], ['Automate it', 'The same amount, every month'], ['Watch the fees', null], ['Don’t interrupt it', 'Selling in a dip stops the snowball']],
      fee: (p, a, b) => `A 1% yearly fee cuts this example by ${p}%: ${a} → ${b}`,
      nota: 'Returns are not guaranteed: 7% is a long-term illustration, not a promise. This is education, not financial advice.' }
  },
  es: {
    kicker: 'INVERSIÓN BÁSICA', desliza: 'Desliza →', anos: 'años',
    s1: { t: 'Cómo funciona <span class="c">de verdad</span> el interés compuesto', l: '200 € al mes durante 30 años con una rentabilidad media del 7% anual:', total: 'Total', puesto: 'Lo que aportas' },
    s2: { t: 'Simple frente a compuesto', l: '1.000 € al 7% anual. El interés simple solo paga sobre los 1.000 € iniciales. El compuesto, sobre todo lo acumulado.', simple: 'Simple', comp: 'Compuesto', tras: 'A los' },
    s3: { t: 'Intereses sobre tus <span class="c">intereses</span>', l: '1.000 € al 7%. Cada año el interés es mayor, porque se calcula sobre un saldo mayor.', ano: 'Año', interes: 'Interés', saldo: 'Saldo' },
    s4: { t: 'El tiempo gana a la <span class="c">cantidad</span>', l: 'Los dos invierten 200 € al mes al 7%. Ana empieza a los 25 y para a los 35. Bruno empieza a los 35 y sigue hasta los 65.',
      p: [['Ana', 'Invierte de los 25 a los 35 y para'], ['Bruno', 'Invierte de los 35 a los 65']], puso: 'aportó', a65: 'a los 65' },
    s5: { t: 'La regla del <span class="c">72</span>', l: 'Una forma rápida de estimar cuánto tarda el dinero en duplicarse: divide 72 entre la rentabilidad anual.', dobla: 'se duplica en unos', nota: 'Es una aproximación, pero muy buena para rentabilidades entre el 4% y el 12%.' },
    s6: { t: 'También juega <span class="c">en tu contra</span>', l: 'Las tarjetas revolving suelen superar el 20% TAE. Al 24%, una deuda sin pagar se duplica en unos 3 años (72 ÷ 24).', deuda: 'Deuda de tarjeta sin pagar', hoy: 'Hoy', en3: 'En 3 años', en6: 'En 6 años' },
    s7: { t: 'Cómo hacer que <span class="c">trabaje para ti</span>', items: [['Empieza pronto, aunque sea poco', 'El tiempo hace casi todo el trabajo'], ['Automatízalo', 'La misma cantidad, cada mes'], ['Vigila las comisiones', null], ['No lo interrumpas', 'Vender en una caída frena la bola de nieve']],
      fee: (p, a, b) => `Un 1% anual de comisiones recorta este ejemplo un ${p}%: ${a} → ${b}`,
      nota: 'La rentabilidad no está garantizada: el 7% es un ejemplo a largo plazo, no una promesa. Esto es educación financiera, no asesoramiento.' }
  }
};

// Gráfico de la curva: área del total y línea de lo aportado, con etiquetas directas.
function grafico(t, lang) {
  const W = 900, H = 430, pl = 10, pr = 10, pt = 20, pb = 50;
  const max = Math.ceil(final.total / 50000) * 50000;
  const x = (a) => pl + (a / 30) * (W - pl - pr), y = (v) => pt + (1 - v / max) * (H - pt - pb);
  const linea = (k) => curva.map((p, i) => `${i ? 'L' : 'M'}${x(p.a).toFixed(1)},${y(p[k]).toFixed(1)}`).join(' ');
  const area = `${linea('total')} L${x(30)},${y(0)} L${x(0)},${y(0)} Z`;
  const rejilla = [0.25, 0.5, 0.75, 1].map(f => `<line x1="${pl}" x2="${W - pr}" y1="${y(max * f)}" y2="${y(max * f)}" stroke="rgba(148,163,184,.12)" stroke-width="1"/>`).join('');
  const ejes = [0, 10, 20, 30].map(a => `<text x="${x(a)}" y="${H - 14}" fill="${C.suave}" font-size="22" text-anchor="${a === 0 ? 'start' : a === 30 ? 'end' : 'middle'}">${a} ${t.anos}</text>`).join('');
  return `<svg width="100%" viewBox="0 0 ${W} ${H}">${rejilla}
    <path d="${area}" fill="${C.necesidades}" fill-opacity=".22"/>
    <path d="${linea('total')}" fill="none" stroke="${C.acento}" stroke-width="4" stroke-linejoin="round"/>
    <path d="${linea('aportado')}" fill="none" stroke="${C.suave}" stroke-width="3" stroke-dasharray="10 8"/>
    <circle cx="${x(30)}" cy="${y(final.total)}" r="8" fill="${C.acento}"/>
    <text x="${x(30) - 18}" y="${y(final.total) + 8}" fill="${C.tinta}" font-size="30" font-weight="800" text-anchor="end">${t.s1.total}: ${dinero(final.total, lang)}</text>
    <text x="${x(30) - 6}" y="${y(final.aportado) - 18}" fill="${C.suave}" font-size="24" font-weight="600" text-anchor="end">${t.s1.puesto}: ${dinero(final.aportado, lang)}</text>
    ${ejes}</svg>`;
}

const fila = (a, b, color) => `<div class="fila"><span class="eti">${a}</span><span class="val" style="color:${color || C.tinta}">${b}</span></div>`;

module.exports = {
  slug: 'interes-compuesto',
  T,
  diapositivas: [
    (t, lang) => `<h1 class="grande">${t.s1.t}</h1><p class="lead">${t.s1.l}</p>
      <div class="tarjeta" style="margin-top:44px;padding:30px 28px 20px">${grafico(t, lang)}</div>`,
    (t, lang) => `<h1>${t.s2.t}</h1><p class="lead">${t.s2.l}</p>
      <div style="margin-top:44px;display:flex;flex-direction:column;gap:20px">${[10, 30].map(a => { const mx = comp(30); return `<div class="tarjeta">
        <div style="font-size:26px;font-weight:800;letter-spacing:.06em;color:${C.suave};margin-bottom:14px">${(t.s2.tras + ' ' + a + ' ' + t.anos).toUpperCase()}</div>
        ${[[t.s2.simple, simple(a), C.suave], [t.s2.comp, comp(a), C.acento]].map(([n, v, col]) => `<div style="display:grid;grid-template-columns:200px 1fr 200px;align-items:center;gap:18px;padding:8px 0">
          <span style="font-size:28px;font-weight:650;color:${C.texto}">${n}</span>
          <div style="height:26px;border-radius:8px;background:${col};width:${(v / mx * 100).toFixed(1)}%;opacity:${col === C.suave ? .55 : 1}"></div>
          <span style="font-size:32px;font-weight:800;text-align:right;font-variant-numeric:tabular-nums">${dinero(v, lang)}</span></div>`).join('')}</div>`; }).join('')}</div>`,
    (t, lang) => { let saldo = 1000; const filas = []; for (let a = 1; a <= 10; a++) { const i = saldo * R; saldo += i; if (a <= 3 || a === 10) filas.push([a, i, saldo]); }
      return `<h1>${t.s3.t}</h1><p class="lead">${t.s3.l}</p>
      <div class="tarjeta" style="margin-top:44px">
        <div class="fila" style="font-size:22px;letter-spacing:.08em;color:${C.suave};font-weight:700"><span>${t.s3.ano.toUpperCase()}</span><span style="display:flex;gap:80px"><span>${t.s3.interes.toUpperCase()}</span><span style="width:170px;text-align:right">${t.s3.saldo.toUpperCase()}</span></span></div>
        ${filas.map(([a, i, s], k) => `${k === 3 ? `<div class="fila" style="color:${C.suave};justify-content:center">· · ·</div>` : ''}<div class="fila"><span class="eti">${t.s3.ano} ${a}</span><span style="display:flex;gap:56px;align-items:baseline"><span class="val" style="color:${C.acento}">+${dinero(i, lang, 2)}</span><span class="val" style="width:190px;text-align:right">${dinero(s, lang, 2)}</span></span></div>`).join('')}
      </div>`; },
    (t, lang) => `<h1>${t.s4.t}</h1><p class="lead">${t.s4.l}</p>
      <div style="margin-top:40px;display:flex;flex-direction:column;gap:18px">${[[t.s4.p[0], ana, 24000, C.acento], [t.s4.p[1], ben, 72000, C.ahorro]].map(([[n, d], v, puso, col]) => `<div class="tarjeta">
        <div style="display:flex;justify-content:space-between;align-items:baseline"><span style="font-size:36px;font-weight:800">${n}</span><span style="font-size:48px;font-weight:800;letter-spacing:-.02em;color:${col}">${dinero(v, lang)}</span></div>
        <div style="display:flex;justify-content:space-between;margin-top:8px;font-size:26px;color:${C.suave}"><span>${d}</span><span>${t.s4.a65}</span></div>
        <div style="margin-top:16px;height:22px;border-radius:8px;background:${col};width:${(v / Math.max(ana, ben) * 100).toFixed(1)}%"></div>
        <div style="margin-top:12px;font-size:26px;color:${C.texto}">${t.s4.puso} <b style="color:${C.tinta}">${dinero(puso, lang)}</b></div></div>`).join('')}</div>`,
    (t) => `<h1>${t.s5.t}</h1><p class="lead">${t.s5.l}</p>
      <div class="tarjeta" style="margin-top:44px">${[4, 6, 8, 10].map(p => fila(`<span style="font-weight:800;color:${C.tinta};width:90px;display:inline-block">${p}%</span> ${t.s5.dobla}`, `${String(Math.round(72 / p * 10) / 10).replace('.', t.anos === 'years' ? '.' : ',')} ${t.anos}`, C.acento)).join('')}</div>
      <p class="nota">${t.s5.nota}</p>`,
    (t, lang) => `<h1>${t.s6.t}</h1><p class="lead">${t.s6.l}</p>
      <div class="tarjeta" style="margin-top:44px"><div style="font-size:24px;font-weight:800;letter-spacing:.06em;color:#e66767;margin-bottom:18px">${t.s6.deuda.toUpperCase()}</div>
        ${[[t.s6.hoy, 1000], [t.s6.en3, 2000], [t.s6.en6, 4000]].map(([a, v]) => `<div style="display:grid;grid-template-columns:200px 1fr 170px;gap:18px;align-items:center;padding:10px 0">
          <span style="font-size:28px;color:${C.texto};font-weight:600">${a}</span><div style="height:26px;border-radius:8px;background:#e66767;width:${v / 40}%"></div>
          <span style="font-size:32px;font-weight:800;text-align:right">${dinero(v, lang)}</span></div>`).join('')}</div>`,
    (t, lang) => `<h1>${t.s7.t}</h1>
      <div style="margin-top:44px;display:flex;flex-direction:column;gap:14px">${t.s7.items.map(([a, b], i) => `<div class="item"><span class="ic" style="background:rgba(15,159,143,.15);font-size:30px;font-weight:800;color:${C.acento}">${i + 1}</span><span>${a}<small>${b || t.s7.fee(Math.round(perdida * 100), dinero(ben, lang), dinero(conComision, lang))}</small></span></div>`).join('')}</div>
      <p class="nota" style="margin-top:30px">${t.s7.nota}</p>`
  ],
  texto: {
    en: `Compound interest is returns earning returns, and time is its secret ingredient. ⏳

$200 a month for 30 years at a 7% average yearly return grows to about ${dinero(final.total, 'en')}. You only put in ${dinero(final.aportado, 'en')}; the other ${dinero(final.total - final.aportado, 'en')} is growth.

Why it works: simple interest only pays on your original money. Compound interest pays on everything you've accumulated, so each year's interest is a bit bigger than the last. $1,000 at 7% earns $70 the first year and $128.69 in year 10.

Time beats amount: Ana invests $200 a month from 25 to 35 and stops (${dinero(24000, 'en')} in total). Ben invests the same from 35 to 65 (${dinero(72000, 'en')}). At 65, Ana has about ${dinero(ana, 'en')} and Ben about ${dinero(ben, 'en')}.

The rule of 72: divide 72 by the yearly rate to estimate how long money takes to double (8% → about 9 years).

It works against you too: at a 24% credit card rate, an unpaid balance doubles in about 3 years.

Returns are not guaranteed; 7% is a long-term illustration. This is education, not financial advice.

When did you first hear about compound interest? 👇

Want to try your own numbers? FinanziApp has a compound interest calculator (free for 15 days, link in bio).

#compoundinterest #investingforbeginners #personalfinance #financialliteracy #moneytips`,
    es: `El interés compuesto es rentabilidad que genera rentabilidad, y el tiempo es su ingrediente secreto. ⏳

200 € al mes durante 30 años con una rentabilidad media del 7% anual se convierten en unos ${dinero(final.total, 'es')}. Tú solo aportas ${dinero(final.aportado, 'es')}; los otros ${dinero(final.total - final.aportado, 'es')} son crecimiento.

Por qué funciona: el interés simple solo paga sobre tu dinero inicial. El compuesto paga sobre todo lo acumulado, así que cada año el interés es un poco mayor. 1.000 € al 7% generan 70 € el primer año y 128,69 € el décimo.

El tiempo gana a la cantidad: Ana invierte 200 € al mes de los 25 a los 35 y para (${dinero(24000, 'es')} en total). Bruno invierte lo mismo de los 35 a los 65 (${dinero(72000, 'es')}). A los 65, Ana tiene unos ${dinero(ana, 'es')} y Bruno unos ${dinero(ben, 'es')}.

La regla del 72: divide 72 entre la rentabilidad anual para estimar cuánto tarda el dinero en duplicarse (8% → unos 9 años).

También juega en tu contra: con una tarjeta al 24%, una deuda sin pagar se duplica en unos 3 años.

La rentabilidad no está garantizada; el 7% es un ejemplo a largo plazo. Esto es educación financiera, no asesoramiento.

¿Cuándo oíste hablar por primera vez del interés compuesto? 👇

¿Quieres probar con tus números? FinanziApp tiene una calculadora de interés compuesto (gratis 15 días, enlace en la bio).

#interescompuesto #invertirdesdecero #finanzaspersonales #educacionfinanciera #ahorro`
  }
};
