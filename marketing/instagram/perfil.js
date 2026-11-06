// Identidad del perfil de Instagram: foto de perfil, portadas de las historias
// destacadas e iconos de la web (favicon y PNG), todos con el mismo símbolo que
// la app (flecha de tendencia sobre turquesa, como en el menú lateral).
// Uso: node perfil.js            → out/perfil/
//      node perfil.js --web      → además app-financiera/public/{logo.svg, logo*.png, favicon.ico}
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');

const RAIZ = __dirname;
const SALIDA = path.join(RAIZ, 'out', 'perfil');
const PUBLICO = path.join(RAIZ, '..', '..', 'app-financiera', 'public');

// Símbolo de la app (el mismo trazo que el menú lateral y los anuncios).
const FLECHA = '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>';
const TURQUESA = ['#2dd4bf', '#14b8a6'];

// Logo de la web: cuadrado redondeado turquesa con la flecha blanca.
const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${TURQUESA[0]}"/><stop offset="1" stop-color="${TURQUESA[1]}"/></linearGradient></defs>
  <rect width="100" height="100" rx="22" fill="url(#g)"/>
  <g transform="translate(14 14) scale(3)" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">${FLECHA}</g>
</svg>
`;

// Foto de perfil: Instagram la recorta en círculo, así que el fondo ocupa todo
// el cuadrado y la flecha va centrada con margen de sobra.
const FOTO_PERFIL = `<!doctype html><html><head><meta charset="utf-8"><style>
  * { margin: 0; } html, body { width: 1080px; height: 1080px; overflow: hidden; }
  body { display: flex; align-items: center; justify-content: center;
    background: radial-gradient(620px 520px at 30% 22%, rgba(255,255,255,.28), transparent 70%), linear-gradient(135deg, ${TURQUESA[0]} 0%, ${TURQUESA[1]} 100%); }
  svg { width: 600px; height: 600px; filter: drop-shadow(0 18px 30px rgba(4,47,46,.35)); }
</style></head><body>
  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${FLECHA}</svg>
</body></html>`;

// Iconos de las destacadas (trazo propio, 24×24).
const ICONOS = {
  'novedades': '<path d="M12 2.5l2 5.6 5.6 2-5.6 2-2 5.6-2-5.6-5.6-2 5.6-2z"/><path d="M19 15.5l.9 2.3 2.3.9-2.3.9-.9 2.3-.9-2.3-2.3-.9 2.3-.9z"/>',
  'como-funciona': '<circle cx="12" cy="12" r="9.5"/><path d="M10 8.2l6 3.8-6 3.8z"/>',
  'calculadoras': '<rect x="4.5" y="2.5" width="15" height="19" rx="2.5"/><rect x="7.5" y="5.5" width="9" height="4" rx="1"/><path d="M8 13.5h.01M12 13.5h.01M16 13.5h.01M8 17.5h.01M12 17.5h.01M16 17.5h.01"/>',
  'consejos': '<path d="M9 18h6"/><path d="M10 21.5h4"/><path d="M12 2.5a6.5 6.5 0 0 0-3.9 11.7c.6.5.9 1.2.9 2V16.5h6v-.3c0-.8.3-1.5.9-2A6.5 6.5 0 0 0 12 2.5z"/>',
  'preguntas': '<circle cx="12" cy="12" r="9.5"/><path d="M9.2 9.2a2.9 2.9 0 0 1 5.6.9c0 2-2.8 2.6-2.8 4.1"/><path d="M12 17.3h.01"/>'
};
const portada = (icono) => `<!doctype html><html><head><meta charset="utf-8"><style>
  * { margin: 0; } html, body { width: 1080px; height: 1920px; overflow: hidden; }
  body { display: flex; align-items: center; justify-content: center;
    background: radial-gradient(520px 520px at 50% 50%, rgba(45,212,191,.22), transparent 70%), linear-gradient(180deg, #0b1324 0%, #0f172a 50%, #0b1324 100%); }
  svg { width: 470px; height: 470px; }
</style></head><body>
  <svg viewBox="0 0 24 24" fill="none" stroke="${TURQUESA[0]}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${icono}</svg>
</body></html>`;

async function foto(browser, html, w, h, salida, transparente = false) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: 'load' });
  await page.screenshot({ path: salida, omitBackground: transparente });
  await page.close();
}

(async () => {
  const conWeb = process.argv.includes('--web');
  fs.mkdirSync(path.join(SALIDA, 'destacadas'), { recursive: true });
  const browser = await chromium.launch();

  await foto(browser, FOTO_PERFIL, 1080, 1080, path.join(SALIDA, 'foto-perfil.png'));
  for (const [i, [id, icono]] of Object.entries(ICONOS).entries()) {
    await foto(browser, portada(icono), 1080, 1920, path.join(SALIDA, 'destacadas', `${String(i + 1).padStart(2, '0')}-${id}.png`));
  }
  fs.writeFileSync(path.join(SALIDA, 'logo.svg'), LOGO_SVG);

  if (conWeb) {
    fs.writeFileSync(path.join(PUBLICO, 'logo.svg'), LOGO_SVG);
    const svg = `data:image/svg+xml;base64,${Buffer.from(LOGO_SVG).toString('base64')}`;
    for (const lado of [120, 192, 512]) {
      const html = `<html><body style="margin:0;background:transparent"><img src="${svg}" width="${lado}" height="${lado}" style="display:block"></body></html>`;
      await foto(browser, html, lado, lado, path.join(PUBLICO, `logo${lado}.png`), true);
    }
    // favicon.ico con 16, 32, 48 y 64 px a partir del PNG de 512.
    execFileSync('python3', ['-I', '-c', [
      'import sys', 'from PIL import Image',
      'im = Image.open(sys.argv[1]).convert("RGBA")',
      'im.save(sys.argv[2], sizes=[(16,16),(32,32),(48,48),(64,64)])'
    ].join('\n'), path.join(PUBLICO, 'logo512.png'), path.join(PUBLICO, 'favicon.ico')]);
  }
  await browser.close();
  console.log(`✓ perfil: ${SALIDA}${conWeb ? ' + iconos de la web' : ''}`);
})().catch(e => { console.error(e); process.exit(1); });
