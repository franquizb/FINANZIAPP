// Capturas de la interfaz real de FinanziApp (modo demo) para los anuncios.
// Uso: node capturar.js [url-demo]   (por defecto http://localhost:4300)
// Requisitos y pasos en README.md. Escribe en capturas/<idioma>/.
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE = (process.argv[2] || process.env.DEMO_URL || 'http://localhost:4300').replace(/\/$/, '');
const SALIDA = path.join(__dirname, 'capturas');
// Fecha simulada: mediados de diciembre, para que los gráficos muestren el año completo.
const FECHA = new Date('2026-12-18T10:00:00');
const IDIOMAS = [
  { lang: 'en', locale: 'en-US', tz: 'America/New_York' },
  { lang: 'es', locale: 'es-ES', tz: 'Europe/Madrid' }
];
const WIDGETS = ['kpis', 'salud', 'flujo', 'distribucion', 'ahorro-acumulado', 'objetivo', 'patrimonio', 'top-gastos', 'comparativa', 'categoria', 'prestamos', 'ahorro-mensual'];

const ESPERA_GRAFICOS = 2200;
const CSS_LIMPIO = `
  ::-webkit-scrollbar { display: none !important; }
  * { scrollbar-width: none !important; caret-color: transparent !important; }
`;

// Escribe en el campo numérico que sigue a la etiqueta (Stepper de las calculadoras).
const rellenar = (page, etiquetas, valor) => page.evaluate(([etqs, v]) => {
  const label = [...document.querySelectorAll('label')].find(l => etqs.some(e => l.textContent.trim().startsWith(e)));
  const input = label && label.parentElement.querySelector('input[type=number]');
  if (!input) return false;
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, String(v));
  input.dispatchEvent(new Event('input', { bubbles: true }));
  return true;
}, [etiquetas, valor]);

async function abrir(ctx, ruta) {
  const page = await ctx.newPage();
  await page.clock.setFixedTime(FECHA);
  const errores = [];
  page.on('pageerror', e => errores.push(e.message));
  await page.goto(`${BASE}/demo${ruta}`, { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: CSS_LIMPIO });
  await page.waitForTimeout(ESPERA_GRAFICOS);
  if (errores.length) throw new Error(`Errores en ${ruta}: ${errores.join(' | ')}`);
  return page;
}

async function capturarEscritorio(browser, { lang, locale, tz }) {
  const dir = path.join(SALIDA, lang);
  const ctx = await browser.newContext({ locale, timezoneId: tz, viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(([l]) => { localStorage.setItem('appLanguage', l); localStorage.setItem('appTheme', 'dark'); }, [lang]);

  let page = await abrir(ctx, '?v=dashboard');
  await page.screenshot({ path: path.join(dir, 'd-dashboard.png') });
  for (const w of WIDGETS) {
    const el = page.locator(`[data-widget="${w}"]`);
    if (await el.count()) await el.screenshot({ path: path.join(dir, `w-${w}.png`) });
  }
  await page.close();

  const vistas = [
    ['d-seguimiento', '?v=monthly&mes=noviembre'],
    ['d-presupuesto', '?v=monthly&modo=presupuesto'],
    ['d-patrimonio', '?v=networth'],
    ['d-prestamos', '?v=loans'],
    ['d-calculadoras', '?v=analysis'],
    ['d-calc-fire', '?v=analysis&calc=fire'],
    ['d-calc-intrinseco', '?v=analysis&calc=intrinseco']
  ];
  for (const [nombre, ruta] of vistas) {
    page = await abrir(ctx, ruta);
    await page.screenshot({ path: path.join(dir, `${nombre}.png`) });
    await page.close();
  }

  // Interés compuesto con el modelo volátil (bandas de escenarios).
  page = await abrir(ctx, '?v=analysis&calc=compuesto');
  await page.locator('select:has(option[value="volatil"])').selectOption('volatil');
  await page.waitForTimeout(ESPERA_GRAFICOS);
  await page.screenshot({ path: path.join(dir, 'd-calc-compuesto.png') });
  const grafico = page.locator('.chart-card').first();
  await grafico.screenshot({ path: path.join(dir, 'w-calc-compuesto-grafico.png') });
  await page.close();

  // Hipoteca con 200 de pago extra al mes.
  page = await abrir(ctx, '?v=analysis&calc=hipoteca');
  await rellenar(page, ['Extra payment every month', 'Pago extra cada mes'], 200);
  await page.waitForTimeout(ESPERA_GRAFICOS);
  await page.screenshot({ path: path.join(dir, 'd-calc-hipoteca.png') });
  await page.close();
  await ctx.close();
}

async function capturarMovil(browser, { lang, locale, tz }) {
  const dir = path.join(SALIDA, lang);
  const ctx = await browser.newContext({ locale, timezoneId: tz, viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  await ctx.addInitScript(([l]) => { localStorage.setItem('appLanguage', l); localStorage.setItem('appTheme', 'dark'); }, [lang]);
  const vistas = [
    ['m-dashboard', '?v=dashboard&menu=0'],
    ['m-seguimiento', '?v=monthly&mes=noviembre&menu=0'],
    ['m-patrimonio', '?v=networth&menu=0'],
    ['m-prestamos', '?v=loans&menu=0'],
    ['m-calc-fire', '?v=analysis&calc=fire&menu=0'],
    ['m-menu', '?v=dashboard']
  ];
  for (const [nombre, ruta] of vistas) {
    const page = await abrir(ctx, ruta);
    await page.screenshot({ path: path.join(dir, `${nombre}.png`) });
    await page.close();
  }
  // Móvil: interés compuesto volátil y salud financiera desplazada.
  let page = await abrir(ctx, '?v=analysis&calc=compuesto&menu=0');
  await page.locator('select:has(option[value="volatil"])').selectOption('volatil');
  await page.waitForTimeout(ESPERA_GRAFICOS);
  await page.locator('.chart-card').first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(dir, 'm-calc-compuesto.png') });
  await page.close();
  page = await abrir(ctx, '?v=dashboard&menu=0');
  await page.locator('[data-widget="salud"]').scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(dir, 'm-salud.png') });
  await page.close();
  await ctx.close();
}

(async () => {
  const browser = await chromium.launch();
  for (const idioma of IDIOMAS) {
    fs.mkdirSync(path.join(SALIDA, idioma.lang), { recursive: true });
    await capturarEscritorio(browser, idioma);
    await capturarMovil(browser, idioma);
    console.log(`✓ capturas ${idioma.lang}: ${fs.readdirSync(path.join(SALIDA, idioma.lang)).length} ficheros`);
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
