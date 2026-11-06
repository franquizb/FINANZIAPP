// Contenido orgánico de Instagram (no anuncios): posts del feed (algunos en
// carrusel) e historias para las destacadas, a partir de las capturas reales.
// Uso: node organico.js [idioma…]   (por defecto en y es)
// Salida: out/<idioma>/posts/*.jpg, out/<idioma>/historias/<grupo>/*.jpg,
//         out/<idioma>/textos.md (pies de foto, texto alternativo y stickers)
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const { RAIZ, portatil, movil, tarjeta, chip, COLOCAR, LOGO, cssBase } = require('./comun');

const FORMATOS = {
  post: { w: 1080, h: 1350, pad: [64, 72, 58, 72], titulo: 86, sub: 32 },
  historia: { w: 1080, h: 1920, pad: [250, 72, 330, 72], titulo: 104, sub: 38 }   // zonas seguras de Stories
};

// ─── Cifras de los ejemplos (calculadas, no escritas a mano) ─────────────────
const LOCALE = { es: 'es-ES', en: 'en-US' };
const MONEDA = { es: 'EUR', en: 'USD' };
const dinero = (lang, v) => v.toLocaleString(LOCALE[lang], { style: 'currency', currency: MONEDA[lang], maximumFractionDigits: 0, useGrouping: 'always' });
const pct = (lang, v) => (lang === 'es' ? `${v} %` : `${v}%`);
// Interés compuesto: 200 al mes, 7 % anual, capitalización mensual.
const APORTACION = 200, TIPO = 0.07, ANIOS = 30;
const capital = (anios) => { const r = TIPO / 12; return APORTACION * ((1 + r) ** (anios * 12) - 1) / r; };
const aportado = (anios) => APORTACION * 12 * anios;
const mil = (v) => Math.round(v / 1000) * 1000;
const FINAL = mil(capital(ANIOS)), PUESTO = aportado(ANIOS), INTERES = FINAL - PUESTO;
// 50/30/20 y fondo de emergencia, con importes típicos de cada mercado.
const SUELDO = { es: 2000, en: 4000 };
const ESENCIALES = { es: 1200, en: 2500 };
const CAFE = { es: 3, en: 5 };

const SIN_MENU = [0.167, 0, 1, 1];

// ─── Bloques de diseño ───────────────────────────────────────────────────────
const COLORES = ['#2dd4bf', '#38bdf8', '#818cf8'];
const reparto = (lang, t, resalta = -1) => `
  <div class="reparto">
    <div class="barra">${[50, 30, 20].map((p, i) => `<div style="flex:${p};background:${COLORES[i]};opacity:${resalta < 0 || resalta === i ? 1 : .22}"><b>${pct(lang, p)}</b><small>${t.reparto[i]}</small></div>`).join('')}</div>
    ${resalta < 0
    ? `<div class="ejemplo">${t.conSueldo(dinero(lang, SUELDO[lang]))} <b>${[.5, .3, .2].map(k => dinero(lang, SUELDO[lang] * k)).join(' · ')}</b></div>`
    : `<div class="enorme"><em>${dinero(lang, SUELDO[lang] * [.5, .3, .2][resalta])}</em></div><div class="ejemplo">${t.deSueldo(dinero(lang, SUELDO[lang]))}</div>`}
  </div>`;
const enorme = (texto, pie = '') => `<div class="enorme">${texto}</div>${pie ? `<div class="ejemplo">${pie}</div>` : ''}`;
const ecuacion = (partes, pie) => `<div class="ecuacion">${partes.map(p => (['×', '=', '−', '+'].includes(p) ? `<span class="op">${p}</span>` : `<span>${p}</span>`)).join('')}</div><div class="ejemplo">${pie}</div>`;
const opciones = (lista) => `<div class="opciones">${lista.map((o, i) => `<div class="opcion"><span class="letra">${'ABC'[i]}</span>${o}</div>`).join('')}</div>`;
const checks = (lista) => `<ul class="checks">${lista.map(x => `<li><span class="ok">✓</span>${x}</li>`).join('')}</ul>`;
const respuesta = (texto) => `<div class="respuesta">${texto}</div>`;
const etiquetas = (lista) => `<div class="etiquetas">${lista.map(x => `<span>${x}</span>`).join('')}</div>`;
const grafico = (lang, t) => {
  const anios = [5, 10, 15, 20, 25, 30];
  const max = capital(ANIOS);
  return `<div class="grafico">${anios.map(a => {
    const total = capital(a), puesto = aportado(a);
    return `<div class="col">${a === ANIOS ? `<b class="tope">≈ ${dinero(lang, FINAL)}</b>` : ''}<div class="pila" style="height:${(total / max * 100).toFixed(1)}%"><div class="int" style="flex:${total - puesto}"></div><div class="apo" style="flex:${puesto}"></div></div><span>${t.anio(a)}</span></div>`;
  }).join('')}</div>
  <div class="leyenda"><i class="apo"></i>${t.loQueAportas}<i class="int"></i>${t.intereses}</div>
  <div class="aviso">${t.avisoInteres}</div>`;
};
const ICONO_GRANDE = `<div class="logo-xl"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg></div>`;

// ─── Textos ──────────────────────────────────────────────────────────────────
const TXT = {
  es: {
    web: 'finanziapp.com', desliza: 'Desliza', guarda: 'Guárdalo para luego',
    reparto: ['Necesidades', 'Deseos', 'Ahorro'],
    conSueldo: (s) => `Con ${s} al mes:`, deSueldo: (s) => `de cada ${s} al mes`,
    anio: (a) => `${a} años`, loQueAportas: 'Lo que aportas', intereses: 'Intereses',
    avisoInteres: 'Ejemplo ilustrativo: rentabilidad constante del 7 % anual y aportación mensual. Las inversiones reales suben y bajan. No es una recomendación de inversión.',
    hipoteca: 'Ej.: +200 €/mes → la terminas 6 años y 5 meses antes',
    sincro: 'Sincronizado en todos tus dispositivos',
    pilares: ['Presupuesto', 'Gastos', 'Patrimonio', 'Préstamos', 'Calculadoras']
  },
  en: {
    web: 'finanziapp.com', desliza: 'Swipe', guarda: 'Save it for later',
    reparto: ['Needs', 'Wants', 'Savings'],
    conSueldo: (s) => `On ${s} a month:`, deSueldo: (s) => `out of every ${s} a month`,
    anio: (a) => `${a} yrs`, loQueAportas: 'What you put in', intereses: 'Interest',
    avisoInteres: 'Illustrative example: constant 7% annual return and monthly contributions. Real investments go up and down. Not investment advice.',
    hipoteca: 'E.g. +$200/month → paid off 6 years 5 months sooner',
    sincro: 'Synced on all your devices',
    pilares: ['Budget', 'Spending', 'Net worth', 'Loans', 'Calculators']
  }
};

// ─── Posts del feed (orden de publicación) ───────────────────────────────────
// tema: oscuro (capturas) o claro (consejos). Alternan para que la cuadrícula
// del perfil quede en damero. Cada diapositiva: kicker, titulo, sub y escena
// (capturas) o bloque (diseño). texto = pie de foto; alt = texto alternativo.
const POSTS = {
  es: [
    {
      id: 'presentacion', tema: 'oscuro',
      diapos: [{ kicker: 'NUEVA APP', titulo: 'Te presentamos<br><em>FinanziApp.</em>', sub: 'Presupuesto, gastos, patrimonio, préstamos y calculadoras. Todo tu dinero, claro y en un solo sitio.',
        escena: (l, t) => portatil(l, 'd-dashboard.png', { x: .02, y: .5, ay: 'c', w: .8, h: .95, rot: 6 }) + movil(l, 'm-dashboard.png', { x: .97, y: .5, ax: 'r', ay: 'c', w: .31, h: 1 }) + chip('✓ ' + t.sincro, { x: .04, y: .97, ay: 'b' }) }],
      alt: 'Panel de FinanziApp en un portátil y en un móvil, con ingresos, gastos, ahorro y gráficos.',
      texto: `Hola 👋 Somos FinanziApp.

Una app para tener tus finanzas claras sin pelearte con hojas de cálculo: presupuesto, gastos, patrimonio, préstamos y 6 calculadoras, todo en un mismo sitio y sincronizado en el móvil y el ordenador.

La estamos construyendo con mucho cariño y aquí te iremos contando novedades y trucos para ahorrar más.

👉 Pruébala gratis 15 días, sin tarjeta: enlace en la bio.

#finanzaspersonales #ahorro #presupuesto #educacionfinanciera #finanzas #dinero #organizacionfinanciera #app`
    },
    {
      id: 'regla-50-30-20', tema: 'claro',
      diapos: [
        { kicker: 'CONSEJO', titulo: 'La regla<br><em>50 / 30 / 20.</em>', sub: 'La forma más sencilla de repartir tu sueldo cada mes.', bloque: (l, t) => reparto(l, t) },
        { kicker: '50 % · NECESIDADES', titulo: 'Lo que <em>no puedes</em><br>dejar de pagar.', sub: 'Vivienda, comida, facturas, transporte y seguros.', bloque: (l, t) => reparto(l, t, 0) },
        { kicker: '30 % · DESEOS', titulo: 'Lo que te hace<br><em>la vida mejor.</em>', sub: 'Restaurantes, ocio, viajes, caprichos y suscripciones.', bloque: (l, t) => reparto(l, t, 1) },
        { kicker: '20 % · AHORRO', titulo: '<em>Tu yo del futuro</em><br>te lo agradecerá.', sub: 'Fondo de emergencia, inversión y pagar deudas antes de tiempo.', bloque: (l, t) => reparto(l, t, 2) },
        { kicker: 'EN FINANZIAPP', titulo: 'Tu presupuesto<br><em>ya viene así.</em>', sub: 'Gastos esenciales, discrecionales, ahorro e inversión y pago de deudas: ves al momento si cumples la regla.',
          escena: (l) => portatil(l, 'd-presupuesto.png', { x: .5, y: .5, ax: 'c', ay: 'c', w: .92, h: 1, recorte: [0.167, 0.25, 1, 0.83] }) }
      ],
      alt: 'Carrusel sobre la regla 50/30/20: 50 % necesidades, 30 % deseos y 20 % ahorro, con un ejemplo de 2.000 € al mes y el presupuesto de FinanziApp.',
      texto: `¿No sabes cuánto deberías gastar y cuánto ahorrar? Empieza por la regla 50/30/20 👇

🏠 50 % necesidades: vivienda, comida, facturas.
🎉 30 % deseos: ocio, restaurantes, viajes.
🌱 20 % ahorro: fondo de emergencia, inversión y deudas.

No es una ley, es un punto de partida: ajústala a tu vida. En FinanziApp tu presupuesto ya viene dividido así y ves al momento si la cumples.

💾 Guárdalo para tu próximo sueldo.

#regla503020 #presupuesto #ahorro #finanzaspersonales #educacionfinanciera #ahorrardinero #consejosfinancieros`
    },
    {
      id: 'empieza', tema: 'oscuro',
      diapos: [
        { kicker: 'GUÍA RÁPIDA', titulo: 'Empieza en<br><em>3 pasos.</em>', sub: 'En cinco minutos tienes tus finanzas en orden.',
          escena: (l, t) => movil(l, 'm-dashboard.png', { x: .5, y: .5, ax: 'c', ay: 'c', w: .4, h: 1, rot: -4 }) + chip(t.pilares[0], { x: .06, y: .2, color: '#2dd4bf' }) + chip(t.pilares[1], { x: .94, y: .45, ax: 'r', color: '#38bdf8' }) + chip(t.pilares[2], { x: .08, y: .72, color: '#818cf8' }) },
        { kicker: 'PASO 1', titulo: 'Crea tu <em>cuenta.</em>', sub: '15 días gratis, sin tarjeta. Con tu correo o con Google.',
          escena: (l) => movil(l, 'm-registro.png', { x: .5, y: .5, ax: 'c', ay: 'c', w: .4, h: 1 }) },
        { kicker: 'PASO 2', titulo: 'Pon tu <em>presupuesto.</em>', sub: 'Tus ingresos y gastos previstos del año. Una vez y listo.',
          escena: (l) => portatil(l, 'd-presupuesto.png', { x: .5, y: .5, ax: 'c', ay: 'c', w: .94, h: 1, recorte: SIN_MENU }) },
        { kicker: 'PASO 3', titulo: 'Apunta y <em>compara.</em>', sub: 'Registra cada gasto en segundos y mira previsto frente a real, mes a mes.',
          escena: (l) => portatil(l, 'd-seguimiento.png', { x: .02, y: .5, ay: 'c', w: .8, h: .95, rot: 6 }) + movil(l, 'm-seguimiento.png', { x: .97, y: .5, ax: 'r', ay: 'c', w: .31, h: 1 }) }
      ],
      alt: 'Carrusel en tres pasos: registro gratuito, presupuesto anual y seguimiento mensual de previsto frente a real en FinanziApp.',
      texto: `Ordenar tus finanzas no tiene por qué llevarte un fin de semana. Con FinanziApp son 3 pasos:

1️⃣ Crea tu cuenta (15 días gratis, sin tarjeta).
2️⃣ Pon tu presupuesto del año.
3️⃣ Apunta tus gastos y compara previsto y real cada mes.

¿Te animas? Enlace en la bio 🔗

#finanzaspersonales #presupuesto #controldegastos #ahorro #organizacionfinanciera #finanzas`
    },
    {
      id: 'fondo-emergencia', tema: 'claro',
      diapos: [
        { kicker: 'CONSEJO', titulo: '¿Cuánto debería tener en mi <em>fondo de emergencia?</em>', sub: 'El colchón que te salva de un imprevisto sin tirar de deudas.', bloque: () => enorme('🛟') },
        { kicker: 'LA REGLA', titulo: 'Entre <em>3 y 6 meses</em><br>de gastos esenciales.', sub: '3 si tus ingresos son estables. 6 si eres autónomo, tienes hijos o hay un solo sueldo en casa.', bloque: () => enorme('<em>3–6</em>', 'meses') },
        { kicker: 'CÓMO CALCULARLO', titulo: 'Gastos esenciales<br>× <em>meses.</em>', sub: 'Solo lo imprescindible: vivienda, comida, facturas, transporte y seguros.',
          bloque: (l) => ecuacion([dinero(l, ESENCIALES.es), '×', '6', '=', `<b>${dinero(l, ESENCIALES.es * 6)}</b>`], 'gastos esenciales al mes × meses = tu objetivo') },
        { kicker: 'DÓNDE GUARDARLO', titulo: 'A mano, <em>sin riesgo</em><br>y aparte.', sub: 'En una cuenta separada de la del día a día. FinanziApp te dice cuántos meses cubres ahora mismo.',
          escena: (l) => movil(l, 'm-salud.png', { x: .5, y: .5, ax: 'c', ay: 'c', w: .42, h: 1 }) }
      ],
      alt: 'Carrusel sobre el fondo de emergencia: de 3 a 6 meses de gastos esenciales, cómo calcularlo y el chequeo de FinanziApp.',
      texto: `El fondo de emergencia es lo primero que deberías construir, antes incluso de invertir 🛟

📏 Entre 3 y 6 meses de gastos esenciales.
🧮 Gastos esenciales al mes × meses.
🏦 En una cuenta aparte, disponible y sin riesgo.

FinanziApp te dice cuántos meses cubres ahora mismo en tu chequeo financiero.

¿Cuántos meses tienes tú? Te leemos 👇

Contenido educativo, no es asesoramiento financiero.

#fondodeemergencia #ahorro #finanzaspersonales #educacionfinanciera #colchonfinanciero #dinero`
    },
    {
      id: 'salud', tema: 'oscuro',
      diapos: [{ kicker: 'CHEQUEO FINANCIERO', titulo: '¿Tus finanzas<br><em>están sanas?</em>', sub: 'Tasa de ahorro, fondo de emergencia y carga de deuda, calculados solos cada mes.',
        escena: (l) => tarjeta(l, 'w-kpis.png', { x: .5, y: 0, ax: 'c', w: .94, h: .2 }) + tarjeta(l, 'w-salud.png', { x: .5, y: .215, ax: 'c', w: .94, h: .32, z: 3 }) +
          tarjeta(l, 'w-ahorro-acumulado.png', { x: .03, y: 1, ay: 'b', w: .46, h: .44 }) + tarjeta(l, 'w-objetivo.png', { x: .97, y: 1, ax: 'r', ay: 'b', w: .46, h: .44 }) }],
      alt: 'Chequeo financiero de FinanziApp con tasa de ahorro, meses de fondo de emergencia, carga de deuda y objetivo de ahorro anual.',
      texto: `¿Cómo saber si tus finanzas van bien? Mira tres números:

📈 Tasa de ahorro: qué parte de lo que ganas te queda.
🛟 Fondo de emergencia: cuántos meses aguantarías sin ingresos.
⚖️ Carga de deuda: cuánto de tu sueldo se va en cuotas.

FinanziApp los calcula solos cada mes con lo que apuntas.

#saludfinanciera #finanzaspersonales #ahorro #deudas #educacionfinanciera #presupuesto`
    },
    {
      id: 'interes-compuesto', tema: 'claro',
      diapos: [
        { kicker: 'PREGUNTA', titulo: `${dinero('es', APORTACION)} al mes durante 30 años. <em>¿Cuánto tendrías?</em>`, sub: 'Con una rentabilidad media del 7 % anual.',
          bloque: (l) => opciones([`≈ ${dinero(l, PUESTO)}`, `≈ ${dinero(l, 140000)}`, `≈ ${dinero(l, FINAL)}`]) },
        { kicker: 'LO QUE APORTAS', titulo: `${dinero('es', APORTACION)} × 12 meses<br>× <em>30 años.</em>`, sub: 'Ni un euro más.', bloque: (l) => enorme(`<em>${dinero(l, PUESTO)}</em>`) },
        { kicker: 'LO QUE TENDRÍAS', titulo: `<em>≈ ${dinero('es', FINAL)}</em>`, sub: `<b>${dinero('es', INTERES)}</b> son intereses. Eso es el interés compuesto: tus ganancias generan más ganancias.`, bloque: (l, t) => grafico(l, t) },
        { kicker: 'HAZ TUS NÚMEROS', titulo: 'Pruébalo con<br><em>tus cifras.</em>', sub: 'La calculadora de FinanziApp: aportaciones diarias, semanales o mensuales y escenarios con altibajos.',
          escena: (l) => tarjeta(l, 'w-calc-compuesto-grafico.png', { x: .02, y: .5, ay: 'c', w: .72, h: .62, rot: -2 }) + movil(l, 'm-calc-compuesto.png', { x: .97, y: .5, ax: 'r', ay: 'c', w: .34, h: 1 }) }
      ],
      alt: `Carrusel sobre el interés compuesto: 200 € al mes durante 30 años al 7 % anual suman unos ${dinero('es', FINAL)}, de los que ${dinero('es', PUESTO)} son aportaciones.`,
      texto: `${dinero('es', APORTACION)} al mes durante 30 años. ¿Cuánto tendrías? 🤔

Tú pones ${dinero('es', PUESTO)}. Con una rentabilidad media del 7 % anual, acabarías con unos ${dinero('es', FINAL)}: ${dinero('es', INTERES)} serían intereses.

Eso es el interés compuesto: tus ganancias generan más ganancias. Y el ingrediente más importante es el tiempo ⏳

Haz tus propios números en la calculadora de FinanziApp (enlace en la bio).

Ejemplo ilustrativo con rentabilidad constante; las inversiones reales suben y bajan y pueden perder valor. No es una recomendación de inversión.

#interescompuesto #inversion #ahorro #finanzaspersonales #libertadfinanciera #educacionfinanciera #invertir`
    },
    {
      id: 'patrimonio', tema: 'oscuro',
      diapos: [{ kicker: 'PATRIMONIO NETO', titulo: '¿Sabes cuánto<br><em>tienes de verdad?</em>', sub: 'Lo que tienes menos lo que debes. FinanziApp lo calcula y te enseña cómo evoluciona mes a mes.',
        escena: (l) => tarjeta(l, 'w-patrimonio.png', { x: .02, y: .02, w: .64, h: .55, rot: -2 }) + tarjeta(l, 'w-prestamos.png', { x: .06, y: .99, ay: 'b', w: .56, h: .44, rot: 1.5 }) +
          movil(l, 'm-patrimonio.png', { x: .97, y: .5, ax: 'r', ay: 'c', w: .33, h: 1 }) }],
      alt: 'Evolución del patrimonio neto y resumen de préstamos en FinanziApp, en el ordenador y en el móvil.',
      texto: `Tu sueldo no dice cuánto tienes. Tu patrimonio neto, sí 💡

Patrimonio neto = lo que tienes (cuentas, inversiones, casa…) − lo que debes (hipoteca, préstamos, tarjetas).

Si sube mes a mes, vas por buen camino aunque no lo notes en el día a día. FinanziApp lo calcula y te enseña su evolución.

#patrimonioneto #finanzaspersonales #ahorro #inversion #libertadfinanciera #educacionfinanciera`
    },
    {
      id: 'sin-banco', tema: 'claro',
      diapos: [{ kicker: 'PRIVACIDAD', titulo: 'Sin conectar<br><em>tu banco.</em>', sub: 'Tú decides qué apuntas y con cuánto detalle.',
        bloque: () => checks(['No te pedimos claves ni acceso a tus cuentas', 'Conexión cifrada (HTTPS)', 'Cada cuenta solo ve sus propios datos', 'Nunca vendemos tu información']) }],
      alt: 'FinanziApp funciona sin conectar tu banco: sin claves bancarias, con conexión cifrada y sin vender tus datos.',
      texto: `Sin conectar tu banco. Sin darnos tus claves. 🔒

En FinanziApp tú decides qué apuntas y cuánto detalle quieres. La conexión va cifrada, cada cuenta solo ve sus propios datos y nunca vendemos tu información.

¿Es algo que te importa al elegir una app de finanzas? Cuéntanos 👇

#privacidad #finanzaspersonales #seguridad #presupuesto #controldegastos`
    },
    {
      id: 'calculadoras', tema: 'oscuro',
      diapos: [{ kicker: 'INCLUIDO', titulo: '6 calculadoras.<br><em>Cero hojas de cálculo.</em>', sub: 'Interés compuesto, hipoteca, FIRE, VPN/TIR, precio medio y valor intrínseco.',
        escena: (l) => portatil(l, 'd-calculadoras.png', { x: .5, y: 0, ax: 'c', w: .94, h: .66, recorte: [0.167, 0, 1, 0.7] }) + tarjeta(l, 'w-calc-compuesto-grafico.png', { x: .5, y: 1, ax: 'c', ay: 'b', w: .88, h: .42, z: 4 }) }],
      alt: 'Panel de calculadoras de FinanziApp: interés compuesto, hipoteca, independencia financiera, VPN/TIR, precio medio y valor intrínseco.',
      texto: `6 calculadoras para tomar mejores decisiones con tu dinero 🧮

• Interés compuesto
• Hipoteca y pagos anticipados
• Independencia financiera (FIRE)
• VPN / TIR
• Precio medio (DCA)
• Valor intrínseco

Todas incluidas en FinanziApp. ¿Cuál quieres que expliquemos primero? 👇

#calculadora #hipoteca #fire #inversion #interescompuesto #finanzaspersonales`
    }
  ],
  en: [
    {
      id: 'presentacion', tema: 'oscuro',
      diapos: [{ kicker: 'NEW APP', titulo: 'Meet<br><em>FinanziApp.</em>', sub: 'Budget, spending, net worth, loans and calculators. All your money, clear and in one place.',
        escena: (l, t) => portatil(l, 'd-dashboard.png', { x: .02, y: .5, ay: 'c', w: .8, h: .95, rot: 6 }) + movil(l, 'm-dashboard.png', { x: .97, y: .5, ax: 'r', ay: 'c', w: .31, h: 1 }) + chip('✓ ' + t.sincro, { x: .04, y: .97, ay: 'b' }) }],
      alt: 'FinanziApp dashboard on a laptop and a phone, with income, spending, savings and charts.',
      texto: `Hi 👋 We're FinanziApp.

An app to get your finances clear without wrestling with spreadsheets: budget, spending, net worth, loans and 6 calculators, all in one place and synced across your phone and computer.

We're building it with a lot of care, and here we'll share what's new plus tips to save more.

👉 Try it free for 15 days, no card needed: link in bio.

#personalfinance #budgeting #savingmoney #moneytips #financialliteracy #budget #money #finance`
    },
    {
      id: 'regla-50-30-20', tema: 'claro',
      diapos: [
        { kicker: 'MONEY TIP', titulo: 'The<br><em>50 / 30 / 20</em> rule.', sub: 'The simplest way to split your paycheck every month.', bloque: (l, t) => reparto(l, t) },
        { kicker: '50% · NEEDS', titulo: 'What you <em>can\'t</em><br>skip paying.', sub: 'Rent or mortgage, groceries, bills, transportation and insurance.', bloque: (l, t) => reparto(l, t, 0) },
        { kicker: '30% · WANTS', titulo: 'What makes<br><em>life better.</em>', sub: 'Eating out, fun, travel, treats and subscriptions.', bloque: (l, t) => reparto(l, t, 1) },
        { kicker: '20% · SAVINGS', titulo: '<em>Future you</em><br>will thank you.', sub: 'Emergency fund, investing and paying off debt early.', bloque: (l, t) => reparto(l, t, 2) },
        { kicker: 'IN FINANZIAPP', titulo: 'Your budget<br><em>comes ready.</em>', sub: 'Essentials, discretionary, savings & investing and debt payments: see at a glance if you\'re on track.',
          escena: (l) => portatil(l, 'd-presupuesto.png', { x: .5, y: .5, ax: 'c', ay: 'c', w: .92, h: 1, recorte: [0.167, 0.25, 1, 0.83] }) }
      ],
      alt: 'Carousel about the 50/30/20 rule: 50% needs, 30% wants and 20% savings, with a $4,000 a month example and the FinanziApp budget.',
      texto: `Not sure how much to spend and how much to save? Start with the 50/30/20 rule 👇

🏠 50% needs: housing, groceries, bills.
🎉 30% wants: fun, eating out, travel.
🌱 20% savings: emergency fund, investing and debt.

It's not a law, it's a starting point: tweak it to fit your life. In FinanziApp your budget is already split this way, so you can see right away if you're on track.

💾 Save this for your next paycheck.

#503020rule #budgeting #savingmoney #personalfinance #moneytips #financialliteracy #budget`
    },
    {
      id: 'empieza', tema: 'oscuro',
      diapos: [
        { kicker: 'QUICK START', titulo: 'Get started in<br><em>3 steps.</em>', sub: 'Your finances in order in five minutes.',
          escena: (l, t) => movil(l, 'm-dashboard.png', { x: .5, y: .5, ax: 'c', ay: 'c', w: .4, h: 1, rot: -4 }) + chip(t.pilares[0], { x: .06, y: .2, color: '#2dd4bf' }) + chip(t.pilares[1], { x: .94, y: .45, ax: 'r', color: '#38bdf8' }) + chip(t.pilares[2], { x: .08, y: .72, color: '#818cf8' }) },
        { kicker: 'STEP 1', titulo: 'Create your <em>account.</em>', sub: 'Free for 15 days, no credit card. With your email or Google.',
          escena: (l) => movil(l, 'm-registro.png', { x: .5, y: .5, ax: 'c', ay: 'c', w: .4, h: 1 }) },
        { kicker: 'STEP 2', titulo: 'Set your <em>budget.</em>', sub: 'Your planned income and expenses for the year. Do it once and you\'re set.',
          escena: (l) => portatil(l, 'd-presupuesto.png', { x: .5, y: .5, ax: 'c', ay: 'c', w: .94, h: 1, recorte: SIN_MENU }) },
        { kicker: 'STEP 3', titulo: 'Log it and <em>compare.</em>', sub: 'Log each expense in seconds and see budget vs. actual, month by month.',
          escena: (l) => portatil(l, 'd-seguimiento.png', { x: .02, y: .5, ay: 'c', w: .8, h: .95, rot: 6 }) + movil(l, 'm-seguimiento.png', { x: .97, y: .5, ax: 'r', ay: 'c', w: .31, h: 1 }) }
      ],
      alt: 'Three-step carousel: free sign-up, yearly budget and monthly budget vs. actual tracking in FinanziApp.',
      texto: `Getting your finances in order doesn't have to take a whole weekend. With FinanziApp it's 3 steps:

1️⃣ Create your account (free for 15 days, no card).
2️⃣ Set your budget for the year.
3️⃣ Log your spending and compare budget vs. actual every month.

Ready? Link in bio 🔗

#personalfinance #budgeting #expensetracker #savingmoney #moneymanagement #budget`
    },
    {
      id: 'fondo-emergencia', tema: 'claro',
      diapos: [
        { kicker: 'MONEY TIP', titulo: 'How big should your <em>emergency fund</em> be?', sub: 'The cushion that gets you through a surprise without going into debt.', bloque: () => enorme('🛟') },
        { kicker: 'THE RULE', titulo: '<em>3 to 6 months</em><br>of essential expenses.', sub: '3 if your income is steady. 6 if you\'re self-employed, have kids or there\'s a single income at home.', bloque: () => enorme('<em>3–6</em>', 'months') },
        { kicker: 'HOW TO WORK IT OUT', titulo: 'Essential expenses<br>× <em>months.</em>', sub: 'Only the must-haves: housing, food, bills, transportation and insurance.',
          bloque: (l) => ecuacion([dinero(l, ESENCIALES.en), '×', '6', '=', `<b>${dinero(l, ESENCIALES.en * 6)}</b>`], 'monthly essentials × months = your target') },
        { kicker: 'WHERE TO KEEP IT', titulo: 'Easy to reach,<br><em>no risk,</em> separate.', sub: 'In an account apart from your everyday one. FinanziApp tells you how many months you cover right now.',
          escena: (l) => movil(l, 'm-salud.png', { x: .5, y: .5, ax: 'c', ay: 'c', w: .42, h: 1 }) }
      ],
      alt: 'Carousel about the emergency fund: 3 to 6 months of essential expenses, how to calculate it and the FinanziApp health check.',
      texto: `An emergency fund is the first thing you should build, even before investing 🛟

📏 3 to 6 months of essential expenses.
🧮 Monthly essentials × months.
🏦 In a separate account, easy to reach and risk-free.

FinanziApp shows how many months you cover right now in your financial health check.

How many months do you have? Tell us 👇

Educational content, not financial advice.

#emergencyfund #savingmoney #personalfinance #financialliteracy #moneytips #budgeting`
    },
    {
      id: 'salud', tema: 'oscuro',
      diapos: [{ kicker: 'FINANCIAL HEALTH CHECK', titulo: 'Is your money<br><em>actually healthy?</em>', sub: 'Your savings rate, emergency fund and debt load, scored automatically every month.',
        escena: (l) => tarjeta(l, 'w-kpis.png', { x: .5, y: 0, ax: 'c', w: .94, h: .2 }) + tarjeta(l, 'w-salud.png', { x: .5, y: .215, ax: 'c', w: .94, h: .32, z: 3 }) +
          tarjeta(l, 'w-ahorro-acumulado.png', { x: .03, y: 1, ay: 'b', w: .46, h: .44 }) + tarjeta(l, 'w-objetivo.png', { x: .97, y: 1, ax: 'r', ay: 'b', w: .46, h: .44 }) }],
      alt: 'FinanziApp financial health check with savings rate, months of emergency fund, debt load and yearly savings goal.',
      texto: `How do you know if your finances are on track? Check three numbers:

📈 Savings rate: how much of what you earn you keep.
🛟 Emergency fund: how many months you'd last with no income.
⚖️ Debt load: how much of your paycheck goes to payments.

FinanziApp works them out every month from what you log.

#financialhealth #personalfinance #savingmoney #debtfree #financialliteracy #budgeting`
    },
    {
      id: 'interes-compuesto', tema: 'claro',
      diapos: [
        { kicker: 'QUICK QUESTION', titulo: `${dinero('en', APORTACION)} a month for 30 years. <em>How much would you have?</em>`, sub: 'At an average 7% annual return.',
          bloque: (l) => opciones([`≈ ${dinero(l, PUESTO)}`, `≈ ${dinero(l, 140000)}`, `≈ ${dinero(l, FINAL)}`]) },
        { kicker: 'WHAT YOU PUT IN', titulo: `${dinero('en', APORTACION)} × 12 months<br>× <em>30 years.</em>`, sub: 'Not a dollar more.', bloque: (l) => enorme(`<em>${dinero(l, PUESTO)}</em>`) },
        { kicker: 'WHAT YOU\'D HAVE', titulo: `<em>≈ ${dinero('en', FINAL)}</em>`, sub: `<b>${dinero('en', INTERES)}</b> is interest. That's compounding: your gains earn more gains.`, bloque: (l, t) => grafico(l, t) },
        { kicker: 'RUN YOUR NUMBERS', titulo: 'Try it with<br><em>your numbers.</em>', sub: 'The FinanziApp calculator: daily, weekly or monthly contributions and scenarios with ups and downs.',
          escena: (l) => tarjeta(l, 'w-calc-compuesto-grafico.png', { x: .02, y: .5, ay: 'c', w: .72, h: .62, rot: -2 }) + movil(l, 'm-calc-compuesto.png', { x: .97, y: .5, ax: 'r', ay: 'c', w: .34, h: 1 }) }
      ],
      alt: `Carousel about compound interest: $200 a month for 30 years at 7% a year grows to about ${dinero('en', FINAL)}, of which ${dinero('en', PUESTO)} is contributions.`,
      texto: `${dinero('en', APORTACION)} a month for 30 years. How much would you have? 🤔

You put in ${dinero('en', PUESTO)}. At an average 7% annual return, you'd end up with about ${dinero('en', FINAL)}: ${dinero('en', INTERES)} of it would be interest.

That's compound interest: your gains earn more gains. And the most important ingredient is time ⏳

Run your own numbers with the FinanziApp calculator (link in bio).

Illustrative example with a constant return; real investments go up and down and can lose value. Not investment advice.

#compoundinterest #investing #savingmoney #personalfinance #financialfreedom #financialliteracy #moneytips`
    },
    {
      id: 'patrimonio', tema: 'oscuro',
      diapos: [{ kicker: 'NET WORTH', titulo: 'Do you know<br><em>what you\'re worth?</em>', sub: 'What you own minus what you owe. FinanziApp works it out and shows how it changes month after month.',
        escena: (l) => tarjeta(l, 'w-patrimonio.png', { x: .02, y: .02, w: .64, h: .55, rot: -2 }) + tarjeta(l, 'w-prestamos.png', { x: .06, y: .99, ay: 'b', w: .56, h: .44, rot: 1.5 }) +
          movil(l, 'm-patrimonio.png', { x: .97, y: .5, ax: 'r', ay: 'c', w: .33, h: 1 }) }],
      alt: 'Net worth trend and loan summary in FinanziApp, on desktop and on mobile.',
      texto: `Your paycheck doesn't tell you what you have. Your net worth does 💡

Net worth = what you own (accounts, investments, home…) − what you owe (mortgage, loans, credit cards).

If it goes up month after month, you're on the right track even when you don't feel it day to day. FinanziApp works it out and shows you the trend.

#networth #personalfinance #savingmoney #investing #financialfreedom #financialliteracy`
    },
    {
      id: 'sin-banco', tema: 'claro',
      diapos: [{ kicker: 'PRIVACY', titulo: 'No need to link<br><em>your bank.</em>', sub: 'You decide what to log and how much detail to add.',
        bloque: () => checks(['We never ask for bank logins or account access', 'Encrypted connection (HTTPS)', 'Each account only sees its own data', 'We never sell your information']) }],
      alt: 'FinanziApp works without linking your bank: no bank logins, encrypted connection and no selling of your data.',
      texto: `No bank linking. No handing over your logins. 🔒

In FinanziApp you decide what to log and how much detail you want. The connection is encrypted, each account only sees its own data and we never sell your information.

Does this matter to you when picking a money app? Let us know 👇

#privacy #personalfinance #security #budgeting #expensetracker`
    },
    {
      id: 'calculadoras', tema: 'oscuro',
      diapos: [{ kicker: 'BUILT IN', titulo: '6 calculators.<br><em>Zero spreadsheets.</em>', sub: 'Compound interest, mortgage, FIRE, NPV/IRR, dollar-cost averaging and intrinsic value.',
        escena: (l) => portatil(l, 'd-calculadoras.png', { x: .5, y: 0, ax: 'c', w: .94, h: .66, recorte: [0.167, 0, 1, 0.7] }) + tarjeta(l, 'w-calc-compuesto-grafico.png', { x: .5, y: 1, ax: 'c', ay: 'b', w: .88, h: .42, z: 4 }) }],
      alt: 'FinanziApp calculators: compound interest, mortgage, financial independence, NPV/IRR, dollar-cost averaging and intrinsic value.',
      texto: `6 calculators to make better money decisions 🧮

• Compound interest
• Mortgage and extra payments
• Financial independence (FIRE)
• NPV / IRR
• Dollar-cost averaging
• Intrinsic value

All included in FinanziApp. Which one should we break down first? 👇

#calculator #mortgage #fire #investing #compoundinterest #personalfinance`
    }
  ]
};

// ─── Historias (por destacada) ───────────────────────────────────────────────
// tema: oscuro | claro | marca (turquesa, para las interactivas).
// sticker = qué añadir en Instagram (encuesta, cuestionario, enlace…); la
// imagen deja el hueco libre debajo del texto.
// El móvil sale por abajo (sin pie de página): marcado con `sangra`.
const telefono = (f) => Object.assign((l) => movil(l, f, { x: .5, y: 0, ax: 'c', w: .74, h: 1.42 }), { sangra: true });
const pantalla = (f, recorte = SIN_MENU) => (l) => portatil(l, f, { x: .5, y: .1, ax: 'c', w: .98, h: .8, recorte });
const HISTORIAS = {
  es: {
    novedades: [
      { id: 'hola', tema: 'marca', antes: ICONO_GRANDE, titulo: 'Hola, somos<br><em>FinanziApp.</em>', sub: 'La app para tener tus finanzas claras, sin hojas de cálculo.', bloque: (l, t) => etiquetas(t.pilares) },
      { id: 'que-es', tema: 'oscuro', kicker: 'QUÉ ES', titulo: 'Todo tu dinero.<br><em>Un solo panel.</em>', sub: 'En el móvil y en el ordenador, siempre sincronizado.',
        escena: (l) => portatil(l, 'd-dashboard.png', { x: .02, y: .5, ay: 'c', w: .88, h: .95, rot: 6 }) + movil(l, 'm-dashboard.png', { x: .97, y: .55, ax: 'r', ay: 'c', w: .42, h: .9 }) },
      { id: 'prueba', tema: 'marca', kicker: 'EMPIEZA HOY', titulo: '15 días gratis.<br><em>Sin tarjeta.</em>', sub: 'Toca el enlace y crea tu cuenta en un minuto 👇', hueco: true,
        sticker: 'Enlace → https://finanziapp.com · texto «Pruébala gratis»' },
      { id: 'construccion', tema: 'claro', kicker: 'EN CONSTRUCCIÓN', titulo: 'La hacemos<br><em>contigo.</em>', sub: 'Cada mes sumamos mejoras. ¿Qué te gustaría ver en FinanziApp? 👇', hueco: true,
        sticker: 'Preguntas → «¿Qué te gustaría ver en FinanziApp?»' }
    ],
    'como-funciona': [
      { id: 'panel', tema: 'oscuro', kicker: 'PANEL', titulo: 'Todo de un <em>vistazo.</em>', sub: 'Ingresos, gastos, ahorro y salud financiera.', escena: telefono('m-dashboard.png') },
      { id: 'presupuesto', tema: 'oscuro', kicker: 'PRESUPUESTO', titulo: 'Planifica <em>el año.</em>', sub: 'Ingresos y gastos previstos por categoría, una vez y listo.', escena: pantalla('d-presupuesto.png', [0.167, 0.1, 1, 0.83]) },
      { id: 'seguimiento', tema: 'oscuro', kicker: 'SEGUIMIENTO', titulo: 'Apunta en <em>segundos.</em>', sub: 'Previsto frente a real, mes a mes.', escena: telefono('m-seguimiento.png') },
      { id: 'salud', tema: 'oscuro', kicker: 'CHEQUEO', titulo: 'Tu salud <em>financiera.</em>', sub: 'Tasa de ahorro, fondo de emergencia y deuda.', escena: telefono('m-salud.png') },
      { id: 'patrimonio', tema: 'oscuro', kicker: 'PATRIMONIO', titulo: 'Tu patrimonio <em>neto.</em>', sub: 'Cuentas, inversiones y préstamos en un sitio.', escena: telefono('m-patrimonio.png') },
      { id: 'prestamos', tema: 'oscuro', kicker: 'PRÉSTAMOS', titulo: 'Deudas, <em>bajo control.</em>', sub: 'Cuotas, intereses y cuándo terminas cada préstamo.', escena: telefono('m-prestamos.png') }
    ],
    calculadoras: [
      { id: 'todas', tema: 'oscuro', kicker: 'CALCULADORAS', titulo: '6 calculadoras <em>pro.</em>', sub: 'Incluidas en tu cuenta, sin hojas de cálculo.', escena: pantalla('d-calculadoras.png', [0.167, 0, 1, 0.85]) },
      { id: 'interes-compuesto', tema: 'oscuro', kicker: 'INTERÉS COMPUESTO', titulo: 'Mira crecer <em>tu dinero.</em>', sub: 'Aportaciones diarias, semanales o mensuales y escenarios.', escena: telefono('m-calc-compuesto.png') },
      { id: 'fire', tema: 'oscuro', kicker: 'INDEPENDENCIA FINANCIERA', titulo: '¿Cuándo podrás <em>parar?</em>', sub: 'Tu número FIRE y la edad a la que llegas.', escena: telefono('m-calc-fire.png') },
      { id: 'hipoteca', tema: 'oscuro', kicker: 'HIPOTECA', titulo: 'Págala <em>antes.</em>', sub: 'Cuánto tiempo e intereses te ahorra cada pago extra.',
        escena: (l, t) => portatil(l, 'd-calc-hipoteca.png', { x: .5, y: .05, ax: 'c', w: .98, h: .78, recorte: [0.167, 0.07, 1, 0.815] }) + chip(t.hipoteca, { x: .5, y: .95, ax: 'c', ay: 'b', color: '#10b981' }) }
    ],
    consejos: [
      { id: 'encuesta', tema: 'marca', kicker: 'ENCUESTA', titulo: '¿Sabes cuánto gastaste <em>el mes pasado?</em>', sub: 'Sin mirar el banco 👀', hueco: true,
        sticker: 'Encuesta → «Al céntimo 💯» / «Ni idea 🙈»' },
      { id: 'regla-50-30-20', tema: 'claro', kicker: 'CONSEJO', titulo: 'La regla<br><em>50 / 30 / 20.</em>', sub: 'Necesidades, deseos y ahorro: un punto de partida para repartir tu sueldo.', bloque: (l, t) => reparto(l, t) },
      { id: 'fondo-emergencia', tema: 'claro', kicker: 'CONSEJO', titulo: 'Fondo de emergencia:<br><em>3–6 meses</em><br>de gastos esenciales.', sub: 'En una cuenta aparte, disponible y sin riesgo.',
        bloque: (l) => ecuacion([dinero(l, ESENCIALES.es), '×', '6', '=', `<b>${dinero(l, ESENCIALES.es * 6)}</b>`], 'gastos esenciales al mes × meses') },
      { id: 'pagate-primero', tema: 'claro', kicker: 'TRUCO', titulo: 'Págate a ti<br><em>primero.</em>', sub: 'El día que cobras, mueve tu ahorro a otra cuenta antes de gastar nada. Lo que no ves, no lo gastas.', bloque: () => enorme('💸') },
      { id: 'efecto-cafe', tema: 'claro', kicker: 'EL EFECTO CAFÉ', titulo: `${dinero('es', CAFE.es)} al día son<br><em>${dinero('es', CAFE.es * 365)} al año.</em>`, sub: 'No hace falta dejar el café: basta con saber cuánto suma cada pequeño gasto.', bloque: () => enorme('☕') },
      { id: 'quiz', tema: 'marca', kicker: 'PON A PRUEBA TU INSTINTO', titulo: `${dinero('es', APORTACION)} al mes, 30 años, al 7 %.<br><em>¿Cuánto tendrías?</em>`, sub: 'Responde y mañana te contamos 👇', hueco: true,
        sticker: `Cuestionario → A ≈ ${dinero('es', PUESTO)} · B ≈ ${dinero('es', 140000)} · C ≈ ${dinero('es', FINAL)} (correcta: C)` },
      { id: 'quiz-respuesta', tema: 'claro', kicker: 'RESPUESTA: C', titulo: `<em>≈ ${dinero('es', FINAL)}</em>`, sub: `Solo ${dinero('es', PUESTO)} los pones tú. El resto es interés compuesto.`, bloque: (l, t) => grafico(l, t) }
    ],
    preguntas: [
      { id: 'precio', tema: 'oscuro', kicker: 'PREGUNTAS FRECUENTES', titulo: '¿Cuánto <em>cuesta?</em>', bloque: () => respuesta('Los primeros <b>15 días son gratis</b> y no pedimos tarjeta. Después, una suscripción mensual a precio de lanzamiento, que puedes cancelar cuando quieras. Lo tienes en <b>finanziapp.com</b>.') },
      { id: 'banco', tema: 'oscuro', kicker: 'PREGUNTAS FRECUENTES', titulo: '¿Tengo que conectar <em>mi banco?</em>', bloque: () => respuesta('<b>No.</b> Tú apuntas lo que quieras, en segundos. Nunca te pedimos claves ni acceso a tus cuentas.') },
      { id: 'datos', tema: 'oscuro', kicker: 'PREGUNTAS FRECUENTES', titulo: '¿Mis datos están <em>seguros?</em>', bloque: () => respuesta('La conexión va <b>cifrada</b>, cada cuenta <b>solo ve sus propios datos</b> y <b>nunca vendemos</b> tu información.') },
      { id: 'movil', tema: 'oscuro', kicker: 'PREGUNTAS FRECUENTES', titulo: '¿Funciona en <em>el móvil?</em>', bloque: () => respuesta('<b>Sí.</b> En el navegador del móvil, la tablet o el ordenador, siempre sincronizado. Sin instalar nada.') },
      { id: 'idiomas', tema: 'oscuro', kicker: 'PREGUNTAS FRECUENTES', titulo: '¿Idiomas y <em>monedas?</em>', bloque: () => respuesta('<b>Español, inglés y alemán.</b> Euros, dólares y nueve monedas más: la eliges en Configuración.') }
    ]
  },
  en: {
    novedades: [
      { id: 'hola', tema: 'marca', antes: ICONO_GRANDE, titulo: 'Hi, we\'re<br><em>FinanziApp.</em>', sub: 'The app that makes your finances clear, no spreadsheets needed.', bloque: (l, t) => etiquetas(t.pilares) },
      { id: 'que-es', tema: 'oscuro', kicker: 'WHAT IT IS', titulo: 'All your money.<br><em>One dashboard.</em>', sub: 'On your phone and computer, always in sync.',
        escena: (l) => portatil(l, 'd-dashboard.png', { x: .02, y: .5, ay: 'c', w: .88, h: .95, rot: 6 }) + movil(l, 'm-dashboard.png', { x: .97, y: .55, ax: 'r', ay: 'c', w: .42, h: .9 }) },
      { id: 'prueba', tema: 'marca', kicker: 'START TODAY', titulo: 'Free for 15 days.<br><em>No card.</em>', sub: 'Tap the link and create your account in a minute 👇', hueco: true,
        sticker: 'Link → https://finanziapp.com · text "Try it free"' },
      { id: 'construccion', tema: 'claro', kicker: 'WORK IN PROGRESS', titulo: 'Built<br><em>with you.</em>', sub: 'We ship improvements every month. What would you like to see in FinanziApp? 👇', hueco: true,
        sticker: 'Questions → "What would you like to see in FinanziApp?"' }
    ],
    'como-funciona': [
      { id: 'panel', tema: 'oscuro', kicker: 'DASHBOARD', titulo: 'Everything at <em>a glance.</em>', sub: 'Income, spending, savings and financial health.', escena: telefono('m-dashboard.png') },
      { id: 'presupuesto', tema: 'oscuro', kicker: 'BUDGET', titulo: 'Plan <em>your year.</em>', sub: 'Planned income and expenses by category. Set it once.', escena: pantalla('d-presupuesto.png', [0.167, 0.1, 1, 0.83]) },
      { id: 'seguimiento', tema: 'oscuro', kicker: 'TRACKING', titulo: 'Log it in <em>seconds.</em>', sub: 'Budget vs. actual, month by month.', escena: telefono('m-seguimiento.png') },
      { id: 'salud', tema: 'oscuro', kicker: 'HEALTH CHECK', titulo: 'Your financial <em>health.</em>', sub: 'Savings rate, emergency fund and debt load.', escena: telefono('m-salud.png') },
      { id: 'patrimonio', tema: 'oscuro', kicker: 'NET WORTH', titulo: 'Your net <em>worth.</em>', sub: 'Accounts, investments and loans in one place.', escena: telefono('m-patrimonio.png') },
      { id: 'prestamos', tema: 'oscuro', kicker: 'LOANS', titulo: 'Debt, <em>under control.</em>', sub: 'Payments, interest and the date each loan ends.', escena: telefono('m-prestamos.png') }
    ],
    calculadoras: [
      { id: 'todas', tema: 'oscuro', kicker: 'CALCULATORS', titulo: '6 pro <em>calculators.</em>', sub: 'Included in your account, no spreadsheets.', escena: pantalla('d-calculadoras.png', [0.167, 0, 1, 0.85]) },
      { id: 'interes-compuesto', tema: 'oscuro', kicker: 'COMPOUND INTEREST', titulo: 'Watch your <em>money grow.</em>', sub: 'Daily, weekly or monthly contributions and scenarios.', escena: telefono('m-calc-compuesto.png') },
      { id: 'fire', tema: 'oscuro', kicker: 'FINANCIAL INDEPENDENCE', titulo: 'When can you <em>stop?</em>', sub: 'Your FIRE number and the age you get there.', escena: telefono('m-calc-fire.png') },
      { id: 'hipoteca', tema: 'oscuro', kicker: 'MORTGAGE', titulo: 'Pay it off <em>sooner.</em>', sub: 'How much time and interest each extra payment saves.',
        escena: (l, t) => portatil(l, 'd-calc-hipoteca.png', { x: .5, y: .05, ax: 'c', w: .98, h: .78, recorte: [0.167, 0.07, 1, 0.815] }) + chip(t.hipoteca, { x: .5, y: .95, ax: 'c', ay: 'b', color: '#10b981' }) }
    ],
    consejos: [
      { id: 'encuesta', tema: 'marca', kicker: 'POLL', titulo: 'Do you know what you spent <em>last month?</em>', sub: 'Without checking your bank 👀', hueco: true,
        sticker: 'Poll → "To the cent 💯" / "No idea 🙈"' },
      { id: 'regla-50-30-20', tema: 'claro', kicker: 'MONEY TIP', titulo: 'The<br><em>50 / 30 / 20</em> rule.', sub: 'Needs, wants and savings: a starting point for splitting your paycheck.', bloque: (l, t) => reparto(l, t) },
      { id: 'fondo-emergencia', tema: 'claro', kicker: 'MONEY TIP', titulo: 'Emergency fund:<br><em>3–6 months</em><br>of essentials.', sub: 'In a separate account, easy to reach and risk-free.',
        bloque: (l) => ecuacion([dinero(l, ESENCIALES.en), '×', '6', '=', `<b>${dinero(l, ESENCIALES.en * 6)}</b>`], 'monthly essentials × months') },
      { id: 'pagate-primero', tema: 'claro', kicker: 'TRICK', titulo: 'Pay yourself<br><em>first.</em>', sub: 'On payday, move your savings to another account before you spend anything. Out of sight, out of mind.', bloque: () => enorme('💸') },
      { id: 'efecto-cafe', tema: 'claro', kicker: 'THE LATTE EFFECT', titulo: `${dinero('en', CAFE.en)} a day is<br><em>${dinero('en', CAFE.en * 365)} a year.</em>`, sub: 'No need to quit coffee: just know how much every small expense adds up to.', bloque: () => enorme('☕') },
      { id: 'quiz', tema: 'marca', kicker: 'TEST YOUR GUT', titulo: `${dinero('en', APORTACION)} a month, 30 years, at 7%.<br><em>How much would you have?</em>`, sub: 'Answer and we\'ll tell you tomorrow 👇', hueco: true,
        sticker: `Quiz → A ≈ ${dinero('en', PUESTO)} · B ≈ ${dinero('en', 140000)} · C ≈ ${dinero('en', FINAL)} (correct: C)` },
      { id: 'quiz-respuesta', tema: 'claro', kicker: 'ANSWER: C', titulo: `<em>≈ ${dinero('en', FINAL)}</em>`, sub: `Only ${dinero('en', PUESTO)} comes from you. The rest is compound interest.`, bloque: (l, t) => grafico(l, t) }
    ],
    preguntas: [
      { id: 'precio', tema: 'oscuro', kicker: 'FAQ', titulo: 'How much does <em>it cost?</em>', bloque: () => respuesta('The first <b>15 days are free</b> and we don\'t ask for a card. After that, a monthly subscription at an early-access price that you can cancel anytime. Details at <b>finanziapp.com</b>.') },
      { id: 'banco', tema: 'oscuro', kicker: 'FAQ', titulo: 'Do I need to link <em>my bank?</em>', bloque: () => respuesta('<b>No.</b> You log whatever you want, in seconds. We never ask for bank logins or account access.') },
      { id: 'datos', tema: 'oscuro', kicker: 'FAQ', titulo: 'Is my data <em>safe?</em>', bloque: () => respuesta('The connection is <b>encrypted</b>, each account <b>only sees its own data</b> and we <b>never sell</b> your information.') },
      { id: 'movil', tema: 'oscuro', kicker: 'FAQ', titulo: 'Does it work <em>on my phone?</em>', bloque: () => respuesta('<b>Yes.</b> In your phone, tablet or computer browser, always in sync. Nothing to install.') },
      { id: 'idiomas', tema: 'oscuro', kicker: 'FAQ', titulo: 'Languages and <em>currencies?</em>', bloque: () => respuesta('<b>English, Spanish and German.</b> Dollars, euros and nine more currencies: pick yours in Settings.') }
    ]
  }
};

// Nombres de las destacadas (en el mismo orden que las portadas de perfil.js).
const DESTACADAS = {
  es: { novedades: 'Novedades', 'como-funciona': 'Cómo funciona', calculadoras: 'Calculadoras', consejos: 'Consejos', preguntas: 'Preguntas' },
  en: { novedades: 'News', 'como-funciona': 'How it works', calculadoras: 'Calculators', consejos: 'Tips', preguntas: 'FAQ' }
};

// ─── Página ──────────────────────────────────────────────────────────────────
const CSS_ORGANICO = (F) => `
  .indice { font-size: 22px; font-weight: 800; letter-spacing: .08em; color: #94a3b8; }
  .bloque { position: relative; flex: 1; min-height: 0; display: flex; flex-direction: column; justify-content: center; margin-top: 30px; }
  .pie { position: relative; z-index: 10; display: flex; justify-content: space-between; align-items: center; margin-top: 30px; font-size: 24px; font-weight: 700; color: #94a3b8; min-height: 30px; }
  .pie .desliza { color: #5eead4; }
  h1 { font-size: ${F.titulo}px; }
  .enorme { font-family: 'Inter Display', 'Inter'; font-weight: 900; letter-spacing: -.05em; line-height: .95; font-size: ${F.h > 1500 ? 230 : 190}px; }
  .enorme em { font-style: normal; background: linear-gradient(90deg, #2dd4bf 0%, #38bdf8 100%); -webkit-background-clip: text; background-clip: text; color: transparent; }
  .ejemplo { margin-top: 18px; font-size: ${F.sub}px; font-weight: 600; color: #cbd5e1; }
  .ejemplo b { color: inherit; font-weight: 900; }
  .reparto .barra { display: flex; height: ${F.h > 1500 ? 190 : 150}px; border-radius: 28px; overflow: hidden; margin-bottom: 30px; box-shadow: 0 24px 50px rgba(15,23,42,.18); }
  .reparto .barra div { display: flex; flex-direction: column; justify-content: center; padding: 0 22px; color: #04111c; min-width: 0; }
  .reparto .barra b { font-size: 44px; font-weight: 900; letter-spacing: -.02em; }
  .reparto .barra small { font-size: 21px; font-weight: 800; opacity: .75; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ecuacion { display: flex; flex-wrap: wrap; align-items: baseline; gap: 6px 22px; font-family: 'Inter Display', 'Inter'; font-size: ${F.h > 1500 ? 92 : 78}px; font-weight: 800; letter-spacing: -.03em; }
  .ecuacion .op { color: #14b8a6; font-weight: 600; }
  .ecuacion b { font-weight: 900; background: linear-gradient(transparent 60%, rgba(45,212,191,.55) 60%); padding: 0 8px; margin: 0 -8px; }
  .opciones { display: grid; gap: 20px; }
  .opcion { display: flex; align-items: center; gap: 26px; padding: 28px 32px; border-radius: 24px; background: #fff; font-size: 46px; font-weight: 800; letter-spacing: -.02em; color: #0b1324;
    box-shadow: 0 18px 40px rgba(15,23,42,.10), 0 0 0 1px rgba(15,23,42,.06); }
  .opcion .letra { width: 64px; height: 64px; flex: none; border-radius: 50%; background: #0f766e; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 30px; }
  .checks { list-style: none; padding: 0; display: grid; gap: 22px; }
  .checks li { display: flex; align-items: center; gap: 24px; padding: 26px 30px; border-radius: 24px; background: #fff; font-size: 34px; font-weight: 700; line-height: 1.25; color: #0b1324;
    box-shadow: 0 18px 40px rgba(15,23,42,.10), 0 0 0 1px rgba(15,23,42,.06); }
  .checks .ok { width: 58px; height: 58px; flex: none; border-radius: 50%; background: #2dd4bf; color: #04111c; display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: 900; }
  .respuesta { position: relative; padding: 52px 50px; border-radius: 36px; font-size: 48px; line-height: 1.38; font-weight: 500; color: #e2e8f0;
    background: linear-gradient(160deg, rgba(45,212,191,.14), rgba(30,41,59,.65)); border: 1px solid rgba(45,212,191,.35); box-shadow: 0 40px 80px rgba(0,0,0,.4); }
  .respuesta b { color: #5eead4; font-weight: 800; }
  .etiquetas { display: flex; flex-wrap: wrap; gap: 16px; }
  .etiquetas span { padding: 18px 28px; border-radius: 999px; font-size: 34px; font-weight: 800; background: rgba(4,17,28,.88); color: #5eead4; }
  .grafico { flex: 1; min-height: 0; display: flex; align-items: flex-end; gap: 20px; padding-top: 70px; }
  .grafico .col { flex: 1; min-width: 0; height: 100%; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; position: relative; }
  .grafico .pila { width: 100%; display: flex; flex-direction: column; border-radius: 14px 14px 6px 6px; overflow: hidden; }
  .grafico .int { background: linear-gradient(180deg, #2dd4bf, #14b8a6); }
  .grafico .apo { background: #94a3b8; }
  .grafico .col span { margin-top: 12px; font-size: 22px; font-weight: 700; color: #475569; white-space: nowrap; }
  .grafico .tope { align-self: flex-end; margin-bottom: 10px; white-space: nowrap; font-size: 32px; font-weight: 900; color: #0f766e; }
  .leyenda { display: flex; align-items: center; gap: 14px; margin-top: 22px; font-size: 24px; font-weight: 700; color: #334155; }
  .leyenda i { width: 22px; height: 22px; border-radius: 6px; display: inline-block; margin-left: 14px; }
  .leyenda i:first-child { margin-left: 0; }
  .leyenda .apo { background: #94a3b8; } .leyenda .int { background: #14b8a6; }
  .aviso { margin-top: 14px; font-size: 18px; line-height: 1.4; color: #64748b; }
  .logo-xl { width: 230px; height: 230px; border-radius: 60px; display: flex; align-items: center; justify-content: center; margin-top: 40px;
    background: #04111c; color: #2dd4bf; box-shadow: 0 30px 60px rgba(4,47,46,.35); }
  .logo-xl svg { width: 150px; height: 150px; }

  /* Tema claro: consejos */
  body.claro { color: #0b1324; background: radial-gradient(900px 700px at 92% 4%, rgba(45,212,191,.30), transparent 60%), radial-gradient(800px 600px at 0% 100%, rgba(56,189,248,.16), transparent 60%), linear-gradient(180deg, #f0fdfa 0%, #ecfeff 100%); }
  body.claro .rejilla { background-image: linear-gradient(rgba(15,118,110,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(15,118,110,.07) 1px, transparent 1px); }
  body.claro .marca { color: #0b1324; } body.claro .marca b { color: #0d9488; }
  body.claro .kicker { color: #0f766e; background: rgba(13,148,136,.10); border-color: rgba(13,148,136,.4); }
  body.claro h1 em, body.marca h1 em { color: #0b1324; background: linear-gradient(transparent 60%, rgba(45,212,191,.6) 60%); -webkit-background-clip: border-box; background-clip: border-box;
    -webkit-box-decoration-break: clone; box-decoration-break: clone; padding: 0 6px; margin: 0 -6px; }
  body.claro .enorme em { background: linear-gradient(90deg, #0d9488, #0284c7); -webkit-background-clip: text; background-clip: text; color: transparent; }
  body.claro .sub, body.claro .ejemplo { color: #334155; }
  body.claro .sub b { color: #0f766e; }
  body.claro .pie, body.claro .indice { color: #64748b; } body.claro .pie .desliza { color: #0d9488; }

  /* Tema marca: turquesa, para lo interactivo */
  body.marca { color: #04111c; background: radial-gradient(900px 700px at 85% 8%, rgba(255,255,255,.38), transparent 60%), linear-gradient(160deg, #5eead4 0%, #2dd4bf 45%, #0d9488 100%); }
  body.marca .rejilla { background-image: linear-gradient(rgba(4,17,28,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(4,17,28,.06) 1px, transparent 1px); }
  body.marca .marca { color: #04111c; } body.marca .marca b { color: #fff; }
  body.marca .icono { background: #04111c; color: #2dd4bf; box-shadow: none; }
  body.marca .kicker { color: #04111c; background: rgba(255,255,255,.4); border-color: rgba(4,17,28,.25); }
  body.marca h1 em { background: linear-gradient(transparent 60%, rgba(255,255,255,.65) 60%); }
  body.marca .sub { color: #06323a; font-weight: 600; }
  body.marca .pie, body.marca .indice { color: #06323a; }
`;

const pagina = ({ F, lang, tema, indice, kicker, titulo, sub, escena, bloque, antes = '', pie = '', cabecera = true }) => `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><style>
  ${cssBase(F, 'organico')}
  ${CSS_ORGANICO(F)}
</style></head><body class="${tema}"><div class="rejilla"></div><div class="lienzo">
  ${cabecera ? `<div class="cabecera">${LOGO}<span class="indice">${indice || ''}</span></div>` : ''}
  ${antes}
  ${kicker ? `<div class="kicker">${kicker}</div>` : ''}
  ${titulo ? `<h1>${titulo}</h1>` : ''}
  ${sub ? `<div class="sub">${sub}</div>` : ''}
  ${escena ? `<div class="escenario">${escena}</div>` : `<div class="bloque">${bloque || ''}</div>`}
  <div class="pie">${pie}</div>
</div><script>${COLOCAR}</script></body></html>`;

async function render(browser, html, F, salida) {
  const page = await browser.newPage({ viewport: { width: F.w, height: F.h }, deviceScaleFactor: 1 });
  const tmp = path.join(path.dirname(salida), `.${path.basename(salida)}.html`);
  fs.writeFileSync(tmp, html);
  await page.goto('file://' + tmp, { waitUntil: 'load' });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map(i => i.decode().catch(() => {})));
    if (document.querySelector('.escenario')) colocar();
  });
  await page.waitForTimeout(100);
  // Aviso si algún texto se sale de su caja (títulos demasiado largos).
  const desborda = await page.evaluate(() => {
    const l = document.querySelector('.lienzo');
    const b = document.querySelector('.bloque, .escenario');
    return (b && b.getBoundingClientRect().height < 40) || l.scrollHeight > l.clientHeight + 2;
  });
  if (desborda) console.warn(`  ⚠ revisar (poco espacio): ${path.relative(RAIZ, salida)}`);
  await page.screenshot({ path: salida, type: 'jpeg', quality: 94 });
  await page.close();
  fs.unlinkSync(tmp);
}

const md = (lang) => (lang === 'es'
  ? { titulo: 'Textos para Instagram (español)', posts: 'Posts del feed', orden: 'Publica en este orden (el 1 queda abajo a la derecha de la cuadrícula).', archivos: 'Imágenes', pie: 'Pie de foto', alt: 'Texto alternativo (Configuración avanzada → Accesibilidad)', historias: 'Historias', destacada: 'Destacada', sticker: 'Sticker', sinSticker: 'Opcional: sticker de enlace a finanziapp.com.' }
  : { titulo: 'Instagram copy (English)', posts: 'Feed posts', orden: 'Publish in this order (post 1 ends up bottom right of the grid).', archivos: 'Images', pie: 'Caption', alt: 'Alt text (Advanced settings → Accessibility)', historias: 'Stories', destacada: 'Highlight', sticker: 'Sticker', sinSticker: 'Optional: link sticker to finanziapp.com.' });

(async () => {
  const idiomas = process.argv.slice(2).length ? process.argv.slice(2) : ['en', 'es'];
  const browser = await chromium.launch();
  for (const lang of idiomas) {
    const t = TXT[lang], m = md(lang);
    const base = path.join(RAIZ, 'out', lang);
    const doc = [`# ${m.titulo}`, '', `## ${m.posts}`, '', m.orden, ''];

    // Posts
    const dirPosts = path.join(base, 'posts');
    fs.rmSync(dirPosts, { recursive: true, force: true });
    fs.mkdirSync(dirPosts, { recursive: true });
    for (const [i, post] of POSTS[lang].entries()) {
      const n = String(i + 1).padStart(2, '0');
      const archivos = [];
      for (const [k, d] of post.diapos.entries()) {
        const total = post.diapos.length;
        const ultimo = k === total - 1;
        const pie = total > 1
          ? `<span>${t.web}</span><span class="desliza">${ultimo ? '' : `${t.desliza} →`}</span>`
          : `<span>${t.web}</span><span></span>`;
        const html = pagina({ F: FORMATOS.post, lang, tema: post.tema, indice: '',
          kicker: d.kicker, titulo: d.titulo, sub: d.sub, escena: d.escena && d.escena(lang, t), bloque: d.bloque && d.bloque(lang, t), pie });
        const nombre = `${n}-${post.id}${total > 1 ? `-${k + 1}` : ''}.jpg`;
        await render(browser, html, FORMATOS.post, path.join(dirPosts, nombre));
        archivos.push(nombre);
      }
      doc.push(`### ${i + 1}. ${post.id}`, '', `**${m.archivos}:** ${archivos.map(a => `\`posts/${a}\``).join(', ')}`, '', `**${m.pie}:**`, '', '```', post.texto, '```', '', `**${m.alt}:** ${post.alt}`, '');
    }

    // Historias
    doc.push(`## ${m.historias}`, '');
    const dirHist = path.join(base, 'historias');
    fs.rmSync(dirHist, { recursive: true, force: true });
    for (const [grupo, lista] of Object.entries(HISTORIAS[lang])) {
      const dir = path.join(dirHist, grupo);
      fs.mkdirSync(dir, { recursive: true });
      doc.push(`### ${m.destacada}: ${DESTACADAS[lang][grupo]}`, '');
      for (const [i, h] of lista.entries()) {
        const nombre = `${String(i + 1).padStart(2, '0')}-${h.id}.jpg`;
        const html = pagina({ F: FORMATOS.historia, lang, tema: h.tema, kicker: h.kicker, titulo: h.titulo, sub: h.sub, antes: h.antes || '',
          escena: h.escena && h.escena(lang, t), bloque: h.hueco ? '' : (h.bloque && h.bloque(lang, t)), pie: h.escena?.sangra ? '' : `<span>${t.web}</span>`, cabecera: !h.antes });
        await render(browser, html, FORMATOS.historia, path.join(dir, nombre));
        doc.push(`- \`historias/${grupo}/${nombre}\` — ${h.sticker ? `**${m.sticker}:** ${h.sticker}` : m.sinSticker}`);
      }
      doc.push('');
    }
    fs.writeFileSync(path.join(base, 'textos.md'), doc.join('\n'));
    console.log(`✓ orgánico ${lang}`);
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
