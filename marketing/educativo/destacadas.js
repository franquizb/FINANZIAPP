// Portadas de las historias destacadas de Instagram (1080×1920). Instagram las
// recorta en un círculo en el centro: el icono va dentro de ese círculo y sin
// texto (el nombre se escribe en Instagram). Valen para las dos cuentas.
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { C, icono } = require('./comun');

const PORTADAS = [
  ['01-empieza', 'brujula', C.acento], ['02-presupuesto', 'tarta', C.necesidades], ['03-ahorro', 'tarro', C.caprichos],
  ['04-deudas', 'menos', C.ahorro], ['05-invertir', 'sube', '#3b82c4'], ['06-la-app', 'movil', C.acento]
];

(async () => {
  const dir = path.join(__dirname, 'out', 'perfil', 'destacadas');
  fs.mkdirSync(dir, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  for (const [nombre, ic, color] of PORTADAS) {
    await page.setContent(`<!doctype html><html><head><style>
      html,body{margin:0;width:1080px;height:1920px;background:${C.superficie};}
      .c{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);}
    </style></head><body><div class="c">${icono(ic, color, 500)}</div></body></html>`);
    await page.screenshot({ path: path.join(dir, nombre + '.png') });
  }
  await browser.close();
  console.log('✓', PORTADAS.length, 'portadas en', path.relative(__dirname, dir));
})().catch(e => { console.error(e); process.exit(1); });
