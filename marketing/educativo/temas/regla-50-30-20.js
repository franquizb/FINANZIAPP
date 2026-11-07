// Carrusel educativo: la regla 50/30/20, explicada paso a paso.
// Cifras de ejemplo: inglés en dólares (EE. UU.), español en euros (España).
const { C, icono, barra } = require('../comun');

const T = {
  en: {
    kicker: 'BUDGETING BASICS', desliza: 'Swipe →', guarda: 'Save this for later',
    s1: { t: 'How to split your paycheck: <span class="c">the 50/30/20 rule</span>', l: 'A simple starting point for any budget. No spreadsheets, no guilt.' },
    cat: { n: 'Needs', w: 'Wants', s: 'Savings & debt' },
    s2: { t: 'Step 1: start from your <span class="c">take‑home pay</span>', l: 'Use what actually lands in your account each month, after taxes, health insurance and retirement contributions.',
      filas: [['Gross pay', '$3,750'], ['Taxes', '−$560'], ['Health insurance & 401(k)', '−$190']], neto: ['Take-home pay', '$3,000'], nota: 'Example numbers. Use your own pay stub.' },
    s3: { t: 'Needs', l: 'Bills you’d still have to pay if you lost your job tomorrow.',
      items: [['casa', 'Rent or mortgage'], ['carro', 'Groceries'], ['rayo', 'Utilities'], ['escudo', 'Insurance'], ['coche', 'Getting to work'], ['tarjeta', 'Minimum debt payments']] },
    s4: { t: 'Wants', l: 'What makes life enjoyable, but could be paused if you had to.',
      items: [['cubiertos', 'Eating out'], ['pantalla', 'Streaming'], ['avion', 'Travel'], ['bolsa', 'Shopping'], ['musica', 'Hobbies'], ['movil', 'Upgrades']], nota: 'Wants aren’t bad. The point is to plan them, not to cut them all.' },
    s5: { t: 'Savings & debt', l: 'Paying your future self first. A sensible order:',
      items: [['paraguas', 'A small emergency fund', 'Start with $1,000'], ['menos', 'High-interest debt', 'Credit cards first'], ['escudo', 'A full emergency fund', '3–6 months of needs'], ['sube', 'Long-term investing', 'Retirement accounts']] },
    s6: { t: 'Example: <span class="c">$3,000</span> a month', filas: [['n', 'Needs · 50%', '$1,500'], ['w', 'Wants · 30%', '$900'], ['s', 'Savings & debt · 20%', '$600']], anual: ['Saved in a year', '$7,200'] },
    s7: { t: 'Make it <span class="c">yours</span>', l: '50/30/20 is a guideline, not a law. A few honest adjustments:',
      variantes: [['50 / 30 / 20', 'The classic split', [50, 30, 20]], ['60 / 20 / 20', 'High-rent city', [60, 20, 20]], ['50 / 20 / 30', 'Paying off debt fast', [50, 20, 30]]],
      final: 'Start where you are: track one month, then adjust.',
      fuente: 'Popularized by Elizabeth Warren and Amelia Warren Tyagi in “All Your Worth” (2005).' }
  },
  es: {
    kicker: 'PRESUPUESTO BÁSICO', desliza: 'Desliza →', guarda: 'Guárdalo para luego',
    s1: { t: 'Cómo repartir tu sueldo: <span class="c">la regla 50/30/20</span>', l: 'Un punto de partida sencillo para cualquier presupuesto. Sin hojas de cálculo y sin culpa.' },
    cat: { n: 'Necesidades', w: 'Caprichos', s: 'Ahorro y deudas' },
    s2: { t: 'Paso 1: parte de tu <span class="c">sueldo neto</span>', l: 'Usa lo que de verdad llega a tu cuenta cada mes, después de IRPF y Seguridad Social.',
      filas: [['Sueldo bruto', '2.600 €'], ['IRPF', '−435 €'], ['Seguridad Social', '−165 €']], neto: ['Sueldo neto', '2.000 €'], nota: 'Cifras de ejemplo. Usa las de tu nómina.' },
    s3: { t: 'Necesidades', l: 'Lo que seguirías teniendo que pagar si mañana te quedaras sin trabajo.',
      items: [['casa', 'Alquiler o hipoteca'], ['carro', 'Comida'], ['rayo', 'Luz, agua, gas'], ['escudo', 'Seguros'], ['coche', 'Transporte'], ['tarjeta', 'Cuotas mínimas de deudas']] },
    s4: { t: 'Caprichos', l: 'Lo que hace la vida más agradable, pero podrías pausar si hiciera falta.',
      items: [['cubiertos', 'Comer fuera'], ['pantalla', 'Plataformas'], ['avion', 'Viajes'], ['bolsa', 'Compras'], ['musica', 'Aficiones'], ['movil', 'Renovar cosas']], nota: 'Los caprichos no son malos. La idea es planificarlos, no eliminarlos.' },
    s5: { t: 'Ahorro y deudas', l: 'Pagarte primero a ti en el futuro. Un orden sensato:',
      items: [['paraguas', 'Un pequeño colchón', 'Empieza con 1.000 €'], ['menos', 'Deudas con interés alto', 'Primero las tarjetas'], ['escudo', 'El fondo de emergencia', '3-6 meses de necesidades'], ['sube', 'Inversión a largo plazo', 'Planes y fondos indexados']] },
    s6: { t: 'Ejemplo: <span class="c">2.000 €</span> al mes', filas: [['n', 'Necesidades · 50%', '1.000 €'], ['w', 'Caprichos · 30%', '600 €'], ['s', 'Ahorro y deudas · 20%', '400 €']], anual: ['Ahorrado en un año', '4.800 €'] },
    s7: { t: 'Hazla <span class="c">tuya</span>', l: 'El 50/30/20 es una guía, no una ley. Algunos ajustes honestos:',
      variantes: [['50 / 30 / 20', 'El reparto clásico', [50, 30, 20]], ['60 / 20 / 20', 'Ciudad con alquiler caro', [60, 20, 20]], ['50 / 20 / 30', 'Saldar deudas rápido', [50, 20, 30]]],
      final: 'Empieza donde estás: apunta un mes y luego ajusta.',
      fuente: 'Popularizada por Elizabeth Warren y Amelia Warren Tyagi en «All Your Worth» (2005).' }
  }
};

const colores = { n: C.necesidades, w: C.caprichos, s: C.ahorro };
const fondoIc = (c) => c + '26';   // el color de la categoría al 15 %

const lista = (items, color) => `<div class="rejilla" style="margin-top:48px">${items.map(([ic, txt, sub]) =>
  `<div class="item"><span class="ic" style="background:${fondoIc(color)}">${icono(ic, color, 42)}</span><span>${txt}${sub ? `<small>${sub}</small>` : ''}</span></div>`).join('')}</div>`;

const cabeceraCat = (k, pct, t) => `<div style="display:flex;align-items:flex-end;gap:26px">
  <span class="pct" style="color:${colores[k]}">${pct}%</span><h1 style="padding-bottom:10px">${t}</h1></div>`;

module.exports = {
  slug: 'regla-50-30-20',
  T,
  diapositivas: [
    // 1 · Portada
    (t) => `<h1 class="grande">${t.s1.t}</h1><p class="lead">${t.s1.l}</p>
      <div class="tarjeta" style="margin-top:72px;padding:50px 44px">
        ${barra([{ valor: 50, color: C.necesidades }, { valor: 30, color: C.caprichos }, { valor: 20, color: C.ahorro }], { alto: 120, radio: 18 })}
        <div style="display:flex;gap:3px;margin-top:26px">
          ${[['n', 50], ['w', 30], ['s', 20]].map(([k, v]) => `<div style="flex:${v}"><div style="font-size:68px;font-weight:800;letter-spacing:-.03em;color:${colores[k]}">${v}%</div><div style="font-size:28px;color:${C.texto};margin-top:6px;font-weight:600">${t.cat[k]}</div></div>`).join('')}
        </div></div>`,
    // 2 · Sueldo neto
    (t) => `<h1>${t.s2.t}</h1><p class="lead">${t.s2.l}</p>
      <div class="tarjeta" style="margin-top:52px">
        ${t.s2.filas.map(([a, b]) => `<div class="fila"><span class="eti">${a}</span><span class="val" style="color:${b.startsWith('−') ? C.suave : C.tinta}">${b}</span></div>`).join('')}
        <div class="fila" style="border-top:2px solid ${C.necesidades};margin-top:6px;padding-top:22px"><span class="eti" style="color:${C.tinta};font-weight:700">${t.s2.neto[0]}</span><span class="val" style="color:${C.acento};font-size:46px">${t.s2.neto[1]}</span></div>
      </div><p class="nota">${t.s2.nota}</p>`,
    // 3 · Necesidades
    (t) => `${cabeceraCat('n', 50, t.s3.t)}<p class="lead">${t.s3.l}</p>${lista(t.s3.items, C.necesidades)}`,
    // 4 · Caprichos
    (t) => `${cabeceraCat('w', 30, t.s4.t)}<p class="lead">${t.s4.l}</p>${lista(t.s4.items, C.caprichos)}<p class="nota" style="margin-top:28px">${t.s4.nota}</p>`,
    // 5 · Ahorro y deudas
    (t) => `${cabeceraCat('s', 20, t.s5.t)}<p class="lead">${t.s5.l}</p>
      <div style="margin-top:40px;display:flex;flex-direction:column;gap:16px">${t.s5.items.map(([ic, txt, sub], i) =>
        `<div class="item"><span class="ic" style="background:${fondoIc(C.ahorro)};font-size:28px;font-weight:800;color:${C.ahorro}">${i + 1}</span><span class="ic" style="width:auto;height:auto">${icono(ic, C.ahorro, 34)}</span><span>${txt}<small>${sub}</small></span></div>`).join('')}</div>`,
    // 6 · Ejemplo
    (t) => `<h1>${t.s6.t}</h1>
      <div class="tarjeta" style="margin-top:56px;padding:42px 40px">
        ${barra([{ valor: 50, color: C.necesidades }, { valor: 30, color: C.caprichos }, { valor: 20, color: C.ahorro }], { alto: 70 })}
        <div style="margin-top:28px">${t.s6.filas.map(([k, a, b]) => `<div class="fila"><span class="eti"><span class="punto" style="background:${colores[k]}"></span>${a}</span><span class="val">${b}</span></div>`).join('')}</div>
      </div>
      <div class="tarjeta" style="margin-top:22px;display:flex;justify-content:space-between;align-items:center;border-color:rgba(124,108,240,.45)">
        <span style="font-size:30px;color:${C.texto};font-weight:600">${t.s6.anual[0]}</span><span style="font-size:54px;font-weight:800;letter-spacing:-.03em;color:${C.tinta}">${t.s6.anual[1]}</span></div>`,
    // 7 · Hazla tuya
    (t) => `<h1>${t.s7.t}</h1><p class="lead">${t.s7.l}</p>
      <div style="margin-top:44px;display:flex;flex-direction:column;gap:30px">${t.s7.variantes.map(([nombre, desc, v]) => `<div>
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:12px"><span style="font-size:32px;font-weight:750;font-variant-numeric:tabular-nums">${nombre}</span><span style="font-size:25px;color:${C.suave};font-weight:550">${desc}</span></div>
        ${barra([{ valor: v[0], color: C.necesidades }, { valor: v[1], color: C.caprichos }, { valor: v[2], color: C.ahorro }], { alto: 30, radio: 10 })}</div>`).join('')}</div>
      <p class="lead" style="margin-top:44px"><b>${t.s7.final}</b></p><p class="nota">${t.s7.fuente}</p>`
  ],
  texto: {
    en: `The 50/30/20 rule is one of the simplest ways to start a budget. 🧭

Take your take-home pay (what actually reaches your account) and split it:
• 50% needs: rent, groceries, utilities, insurance, transportation, minimum debt payments
• 30% wants: eating out, streaming, travel, shopping, hobbies
• 20% savings & debt: emergency fund, extra debt payments, investing

On $3,000 a month that's $1,500 / $900 / $600, or $7,200 saved in a year.

It's a guideline, not a law. In a high-rent city 60/20/20 is still progress, and if you're paying off debt you can push savings & debt to 30%. Start by tracking one month and adjust from there.

The rule was popularized by Elizabeth Warren and Amelia Warren Tyagi in "All Your Worth" (2005).

Which of the three is hardest for you to keep in check? Tell us in the comments 👇

Save this for your next payday. If you want your split calculated automatically, that's what we built FinanziApp for (link in bio).

#budgeting #personalfinance #503020rule #moneytips #financialliteracy`,
    es: `La regla 50/30/20 es una de las formas más sencillas de empezar un presupuesto. 🧭

Toma tu sueldo neto (lo que de verdad llega a tu cuenta) y repártelo:
• 50% necesidades: vivienda, comida, facturas, seguros, transporte, cuotas mínimas de deudas
• 30% caprichos: comer fuera, plataformas, viajes, compras, aficiones
• 20% ahorro y deudas: fondo de emergencia, amortizar deudas, invertir

Con 2.000 € al mes son 1.000 € / 600 € / 400 €, es decir, 4.800 € ahorrados en un año.

Es una guía, no una ley. En una ciudad con alquiler caro, 60/20/20 ya es avanzar, y si estás saldando deudas puedes subir ahorro y deudas al 30%. Empieza apuntando un mes y ajusta a partir de ahí.

La popularizaron Elizabeth Warren y Amelia Warren Tyagi en «All Your Worth» (2005).

¿Cuál de los tres te cuesta más mantener a raya? Cuéntanoslo en comentarios 👇

Guárdalo para tu próximo día de cobro. Si quieres que el reparto se calcule solo, para eso hicimos FinanziApp (enlace en la bio).

#finanzaspersonales #presupuesto #regla503020 #ahorro #educacionfinanciera`
  }
};
