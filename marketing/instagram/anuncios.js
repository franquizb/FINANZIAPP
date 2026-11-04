// Anuncios estáticos de Instagram a partir de las capturas reales (capturas/).
// Uso: node anuncios.js [idioma…]   (por defecto en y es)
// Salida: out/<idioma>/feed-4x5/*.png, out/<idioma>/stories-9x16/*.png,
//         out/<idioma>/carrusel-1x1/*.png
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const { RAIZ, portatil, movil, tarjeta, chip, COLOCAR, LOGO, cssBase } = require('./comun');
const FORMATOS = {
  'feed-4x5': { w: 1080, h: 1350, pad: [64, 64, 70, 64], titulo: 84, sub: 31 },
  'stories-9x16': { w: 1080, h: 1920, pad: [230, 64, 330, 64], titulo: 92, sub: 34 },   // zonas seguras de Stories/Reels
  'carrusel-1x1': { w: 1080, h: 1080, pad: [56, 60, 56, 60], titulo: 70, sub: 28 }
};

// ─── Textos ──────────────────────────────────────────────────────────────────
const TXT = {
  en: {
    cta: 'Start your free 15-day trial', ctaSub: 'No credit card required', web: 'finanziapp.com',
    sincro: 'Synced on all your devices', ejemploHipoteca: 'Example: +$200/month → paid off 6 years sooner', desliza: 'Swipe', ultimo: 'Try it free for 15 days',
    etiquetasSalud: ['Savings rate', 'Emergency fund', 'Debt load'],
    conceptos: {
      hero: ['PERSONAL FINANCE, SIMPLIFIED', 'All your money.<br><em>One dashboard.</em>', 'Budget, track spending, grow your net worth and plan your future, all in one beautiful app.'],
      salud: ['FINANCIAL HEALTH CHECK', 'Is your money<br><em>actually healthy?</em>', 'Your savings rate, emergency fund and debt load, scored automatically every month.'],
      patrimonio: ['NET WORTH', 'Watch your<br><em>net worth grow.</em>', 'Every account, investment and loan in one place, with the trend month after month.'],
      gastos: ['SPENDING', 'Know exactly where<br><em>your money goes.</em>', 'Every expense in its category. Spot the leaks and see your top spending at a glance.'],
      hipoteca: ['MORTGAGE & LOANS', 'Pay off your mortgage<br><em>years sooner.</em>', 'See exactly how much time and interest every extra payment saves you.'],
      fire: ['FINANCIAL INDEPENDENCE', 'When can you<br><em>stop working?</em>', 'Find your FIRE number and the age you reach it, then track your progress.'],
      calculadoras: ['BUILT IN', '6 pro calculators.<br><em>Zero spreadsheets.</em>', 'Compound interest, mortgage, FIRE, NPV/IRR, dollar-cost averaging and intrinsic value.'],
      presupuesto: ['BUDGET & TRACKING', 'A budget that<br><em>actually works.</em>', 'Plan your year, log expenses in seconds and compare budget vs. actual every month.']
    },
    carrusel: [
      ['', 'Your finances,<br><em>finally clear.</em>', 'Budget · Spending · Net worth · Loans · Calculators'],
      ['01 · DASHBOARD', 'Everything at<br><em>a glance.</em>', 'Income, expenses, savings and financial health in one view.'],
      ['02 · BUDGET', 'Budget vs. actual,<br><em>every month.</em>', 'Click a number to log it. The app does the math.'],
      ['03 · NET WORTH', 'Assets, loans<br><em>and the big picture.</em>', 'Watch your net worth climb as your debts shrink.'],
      ['', 'Try it free<br><em>for 15 days.</em>', 'No credit card required.']
    ]
  },
  es: {
    cta: 'Pruébala gratis 15 días', ctaSub: 'Sin tarjeta de crédito', web: 'finanziapp.com',
    sincro: 'Sincronizado en todos tus dispositivos', ejemploHipoteca: 'Ejemplo: +200 €/mes → la terminas 6 años antes', desliza: 'Desliza', ultimo: 'Pruébala gratis 15 días',
    etiquetasSalud: ['Tasa de ahorro', 'Fondo de emergencia', 'Carga de deuda'],
    conceptos: {
      hero: ['TUS FINANZAS, SIN LÍOS', 'Todo tu dinero.<br><em>Un solo panel.</em>', 'Presupuesto, gastos, patrimonio y planes de futuro en una sola app, clara y bonita.'],
      salud: ['CHEQUEO FINANCIERO', '¿Tus finanzas<br><em>están sanas?</em>', 'Tasa de ahorro, fondo de emergencia y carga de deuda, calculados solos cada mes.'],
      patrimonio: ['PATRIMONIO NETO', 'Mira crecer<br><em>tu patrimonio.</em>', 'Cuentas, inversiones y préstamos en un solo sitio, con su evolución mes a mes.'],
      gastos: ['GASTOS', 'Descubre a dónde<br><em>se va tu dinero.</em>', 'Cada gasto en su categoría. Detecta las fugas y ve en qué gastas más de un vistazo.'],
      hipoteca: ['HIPOTECA Y PRÉSTAMOS', 'Paga tu hipoteca<br><em>años antes.</em>', 'Mira cuánto tiempo e intereses te ahorra cada pago extra.'],
      fire: ['INDEPENDENCIA FINANCIERA', '¿Cuándo podrás<br><em>dejar de trabajar?</em>', 'Calcula tu número FIRE y a qué edad lo alcanzas, y sigue tu progreso.'],
      calculadoras: ['INCLUIDO', '6 calculadoras pro.<br><em>Cero hojas de cálculo.</em>', 'Interés compuesto, hipoteca, FIRE, VPN/TIR, precio medio (DCA) y valor intrínseco.'],
      presupuesto: ['PRESUPUESTO Y SEGUIMIENTO', 'Un presupuesto<br><em>que sí funciona.</em>', 'Planifica el año, apunta en segundos y compara previsto y real cada mes.']
    },
    carrusel: [
      ['', 'Tus finanzas,<br><em>por fin claras.</em>', 'Presupuesto · Gastos · Patrimonio · Préstamos · Calculadoras'],
      ['01 · PANEL', 'Todo de<br><em>un vistazo.</em>', 'Ingresos, gastos, ahorro y salud financiera en una sola vista.'],
      ['02 · PRESUPUESTO', 'Previsto y real,<br><em>mes a mes.</em>', 'Pulsa una cifra para apuntarla. La app hace las cuentas.'],
      ['03 · PATRIMONIO', 'Activos, préstamos<br><em>y la foto completa.</em>', 'Mira subir tu patrimonio mientras bajan tus deudas.'],
      ['', 'Pruébala gratis<br><em>15 días.</em>', 'Sin tarjeta de crédito.']
    ]
  }
};

const SIN_MENU = [0.167, 0, 1, 1];   // captura de escritorio sin el menú lateral
const ESCENAS = {
  hero: (l, t, k = 1) => portatil(l, 'd-dashboard.png', { x: .02, y: .5, ay: 'c', w: .8 * k, h: .95, rot: 6 }) +
    movil(l, 'm-dashboard.png', { x: .97, y: .5, ax: 'r', ay: 'c', w: .31, h: 1 }) + chip('✓ ' + t.sincro, { x: .04, y: .97, ay: 'b' }),
  salud: (l) => tarjeta(l, 'w-kpis.png', { x: .5, y: 0, ax: 'c', w: .94, h: .2 }) + tarjeta(l, 'w-salud.png', { x: .5, y: .215, ax: 'c', w: .94, h: .32, z: 3 }) +
    tarjeta(l, 'w-ahorro-acumulado.png', { x: .03, y: 1, ay: 'b', w: .46, h: .44 }) + tarjeta(l, 'w-objetivo.png', { x: .97, y: 1, ax: 'r', ay: 'b', w: .46, h: .44 }),
  patrimonio: (l) => tarjeta(l, 'w-patrimonio.png', { x: .02, y: .02, w: .64, h: .55, rot: -2 }) + tarjeta(l, 'w-prestamos.png', { x: .06, y: .99, ay: 'b', w: .56, h: .44, rot: 1.5 }) +
    movil(l, 'm-patrimonio.png', { x: .97, y: .5, ax: 'r', ay: 'c', w: .33, h: 1 }),
  gastos: (l) => tarjeta(l, 'w-top-gastos.png', { x: .02, y: .02, w: .64, h: .55, rot: -1.5 }) + tarjeta(l, 'w-distribucion.png', { x: .06, y: .99, ay: 'b', w: .56, h: .46, rot: 1.5 }) +
    movil(l, 'm-seguimiento.png', { x: .97, y: .5, ax: 'r', ay: 'c', w: .33, h: 1 }),
  hipoteca: (l, t) => portatil(l, 'd-calc-hipoteca.png', { x: .5, y: .45, ax: 'c', ay: 'c', w: .94, h: .9, recorte: [0.167, 0.07, 1, 0.815] }) +
    chip(t.ejemploHipoteca, { x: .5, y: 1, ax: 'c', ay: 'b', color: '#10b981' }),
  fire: (l, t, k = 1) => portatil(l, 'd-calc-fire.png', { x: .02, y: .5, ay: 'c', w: .78 * k, h: .92, rot: 6, recorte: SIN_MENU }) +
    movil(l, 'm-calc-fire.png', { x: .97, y: .5, ax: 'r', ay: 'c', w: .32, h: 1 }),
  calculadoras: (l) => portatil(l, 'd-calculadoras.png', { x: .5, y: 0, ax: 'c', w: .94, h: .66, recorte: [0.167, 0, 1, 0.7] }) +
    tarjeta(l, 'w-calc-compuesto-grafico.png', { x: .5, y: 1, ax: 'c', ay: 'b', w: .88, h: .42, z: 4 }),
  presupuesto: (l, t, k = 1) => portatil(l, 'd-seguimiento.png', { x: .02, y: .5, ay: 'c', w: .8 * k, h: .95, rot: 6 }) +
    movil(l, 'm-seguimiento.png', { x: .97, y: .5, ax: 'r', ay: 'c', w: .31, h: 1 })
};
const ESCENAS_CARRUSEL = [
  (l) => portatil(l, 'd-dashboard.png', { x: .03, y: .5, ay: 'c', w: .78, h: .95, rot: 6 }) + movil(l, 'm-dashboard.png', { x: .97, y: .5, ax: 'r', ay: 'c', w: .28, h: 1 }),
  (l) => tarjeta(l, 'w-kpis.png', { x: .5, y: 0, ax: 'c', w: .96, h: .24 }) + tarjeta(l, 'w-flujo.png', { x: .02, y: 1, ay: 'b', w: .47, h: .72 }) + tarjeta(l, 'w-distribucion.png', { x: .98, y: 1, ax: 'r', ay: 'b', w: .47, h: .72 }),
  (l) => portatil(l, 'd-seguimiento.png', { x: .5, y: .5, ax: 'c', ay: 'c', w: .94, h: 1, recorte: [0.167, 0, 1, 0.78] }),
  (l) => tarjeta(l, 'w-patrimonio.png', { x: .02, y: 0, w: .6, h: .64, rot: -1.5 }) + tarjeta(l, 'w-prestamos.png', { x: .98, y: 1, ax: 'r', ay: 'b', w: .58, h: .6, rot: 1.5, z: 3 }),
  (l) => movil(l, 'm-dashboard.png', { x: .5, y: .5, ax: 'c', ay: 'c', w: .4, h: 1, rot: -4 })
];

const pagina = ({ fmt, lang, kicker, titulo, sub, escena, cta = true, pie = '', extraClase = '' }) => {
  const F = FORMATOS[fmt];
  const t = TXT[lang];
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><style>
  ${cssBase(F, fmt)}
  .pie { position: relative; z-index: 10; display: flex; align-items: center; justify-content: space-between; gap: 24px; margin-top: 34px; }
  .cta { display: inline-flex; align-items: center; gap: 14px; padding: 26px 44px; border-radius: 999px; font-size: ${fmt === 'carrusel-1x1' ? 28 : 32}px; font-weight: 800;
    color: #04111c; background: linear-gradient(90deg, #2dd4bf, #22d3ee); box-shadow: 0 22px 50px rgba(45,212,191,.38); white-space: nowrap; }
  .nota { font-size: 21px; color: #94a3b8; font-weight: 600; text-align: right; line-height: 1.4; }
  .nota b { color: #e2e8f0; display: block; font-size: 23px; }
  .desliza { font-size: 24px; font-weight: 700; color: #5eead4; }
  .final .escenario { margin-top: 10px; }
  </style></head><body class="${extraClase}"><div class="rejilla"></div><div class="lienzo">
    <div class="cabecera">${LOGO}<span class="web">${t.web}</span></div>
    <div class="kicker">${kicker}</div>
    <h1>${titulo}</h1>
    <div class="sub">${sub}</div>
    <div class="escenario">${escena}</div>
    ${cta ? `<div class="pie"><span class="cta">${t.cta} →</span><span class="nota"><b>${t.ctaSub}</b>${t.web}</span></div>` : pie}
  </div><script>${COLOCAR}</script></body></html>`;
};

async function render(browser, html, fmt, salida) {
  const F = FORMATOS[fmt];
  const page = await browser.newPage({ viewport: { width: F.w, height: F.h }, deviceScaleFactor: 1 });
  const tmp = path.join(path.dirname(salida), `.${path.basename(salida)}.html`);
  fs.writeFileSync(tmp, html);
  await page.goto('file://' + tmp, { waitUntil: 'load' });
  await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(i => i.decode().catch(() => {}))); colocar(); });
  await page.waitForTimeout(100);
  await page.screenshot({ path: salida });
  await page.close();
  fs.unlinkSync(tmp);
}

(async () => {
  const idiomas = process.argv.slice(2).length ? process.argv.slice(2) : ['en', 'es'];
  const browser = await chromium.launch();
  for (const lang of idiomas) {
    const t = TXT[lang];
    for (const fmt of ['feed-4x5', 'stories-9x16']) {
      const dir = path.join(RAIZ, 'out', lang, fmt);
      fs.mkdirSync(dir, { recursive: true });
      for (const [i, [id, [kicker, titulo, sub]]] of Object.entries(Object.entries(t.conceptos))) {
        const html = pagina({ fmt, lang, kicker, titulo, sub, escena: ESCENAS[id](lang, t, fmt === 'stories-9x16' ? 1.1 : 1) });
        await render(browser, html, fmt, path.join(dir, `${String(+i + 1).padStart(2, '0')}-${id}.png`));
      }
    }
    const dir = path.join(RAIZ, 'out', lang, 'carrusel-1x1');
    fs.mkdirSync(dir, { recursive: true });
    for (const [i, [kicker, titulo, sub]] of t.carrusel.entries()) {
      const ultimo = i === t.carrusel.length - 1;
      const pie = ultimo
        ? `<div class="pie"><span class="cta">${t.cta} →</span><span class="nota"><b>${t.ctaSub}</b>${t.web}</span></div>`
        : `<div class="pie"><span class="nota" style="text-align:left">${t.web}</span><span class="desliza">${t.desliza} →</span></div>`;
      const html = pagina({ fmt: 'carrusel-1x1', lang, kicker, titulo, sub, escena: ESCENAS_CARRUSEL[i](lang), cta: false, pie, extraClase: ultimo ? 'final' : '' });
      await render(browser, html, 'carrusel-1x1', path.join(dir, `${String(i + 1).padStart(2, '0')}.png`));
    }
    console.log(`✓ anuncios ${lang}`);
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
