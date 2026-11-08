// Portadas de las páginas de Facebook (1640 × 624), iguales en las dos cuentas salvo el idioma:
// el mismo fondo, los muñecos de los Reels, el símbolo de la app y finanziapp.com.
// Facebook en el móvil recorta el centro (≈ 1110 × 624), así que lo importante va entre x = 265 y x = 1375.
// Uso: node portada-facebook.js  → out/perfil/portada-facebook-{en,es}.png
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { C, muneco, SCRIPT_MUNECO } = require('../educativo/reels-voz/_comun');

const SALIDA = path.join(__dirname, 'out', 'perfil');
const FLECHA = '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>';
const W = 1640, H = 624, SUELO = 566, K = 1.05, CADERA = SUELO - 142 * K - 12;

const T = {
  en: { titulo: 'Money,<br><span class="c">made simple.</span>', sub: 'Short videos on prices, saving and money milestones.', chip: 'finanziapp.com · 15 days free', cartel: '+$1,000', moneda: '$' },
  es: { titulo: 'Tu dinero,<br><span class="c">explicado fácil.</span>', sub: 'Vídeos cortos sobre precios, ahorro y tu nómina.', chip: 'finanziapp.com · 15 días gratis', cartel: '+1.000 €', moneda: '€' }
};

const moneda = (x, y, s, m, rot = 0) => `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><circle r="34" fill="#e9c46a" stroke="#b8902e" stroke-width="5"/><circle r="22" fill="none" stroke="#b8902e" stroke-width="3"/>
  <text y="12" text-anchor="middle" font-size="32" font-weight="900" fill="#8a6a1f">${m}</text></g>`;

const html = (t) => `<!doctype html><html><head><meta charset="utf-8"><style>
  * { margin: 0; box-sizing: border-box; }
  html, body { width: ${W}px; height: ${H}px; overflow: hidden; font-family: Inter, sans-serif; }
  body { position: relative; color: ${C.tinta};
    background:
      radial-gradient(520px 420px at 1180px 330px, rgba(45,212,191,.20), transparent 70%),
      radial-gradient(700px 500px at 380px 120px, rgba(124,108,240,.12), transparent 70%),
      linear-gradient(160deg, #0b1222 0%, ${C.fondo} 60%, #0b1222 100%); }
  .puntos { position: absolute; inset: 0; background-image: radial-gradient(rgba(148,163,184,.13) 1.6px, transparent 1.6px); background-size: 34px 34px;
    -webkit-mask-image: linear-gradient(90deg, transparent, #000 25%, #000 75%, transparent); }
  .texto { position: absolute; left: 300px; top: 92px; width: 640px; }
  .marca { display: inline-flex; align-items: center; gap: 16px; font-size: 34px; font-weight: 800; letter-spacing: -.01em; }
  .marca .logo { width: 62px; height: 62px; border-radius: 15px; display: flex; align-items: center; justify-content: center;
    background: linear-gradient(135deg, #2dd4bf, #14b8a6); box-shadow: 0 10px 24px rgba(20,184,166,.35); }
  h1 { margin-top: 30px; font-size: 80px; line-height: 1.02; font-weight: 900; letter-spacing: -.035em; }
  .c { color: ${C.acento}; }
  p { margin-top: 22px; font-size: 29px; line-height: 1.3; color: ${C.texto}; font-weight: 500; text-wrap: balance; }
  .chip { margin-top: 28px; display: inline-block; padding: 12px 22px; border-radius: 999px; background: rgba(94,234,212,.12);
    border: 2px solid rgba(94,234,212,.45); color: ${C.acento}; font-size: 25px; font-weight: 800; }
  svg.escena { position: absolute; left: 0; top: 0; overflow: visible; }
</style></head><body>
  <div class="puntos"></div>
  <div class="texto">
    <div class="marca"><span class="logo"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">${FLECHA}</svg></span>FinanziApp</div>
    <h1>${t.titulo}</h1>
    <p>${t.sub}</p>
    <div class="chip">${t.chip}</div>
  </div>
  <svg class="escena" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Inter,sans-serif">
    <line x1="960" y1="${SUELO}" x2="1440" y2="${SUELO}" stroke="#24324d" stroke-width="4" stroke-linecap="round"/>
    <ellipse cx="1015" cy="${SUELO + 2}" rx="80" ry="11" fill="rgba(0,0,0,.35)"/>
    <ellipse cx="1275" cy="${SUELO + 2}" rx="80" ry="11" fill="rgba(0,0,0,.35)"/>
    <!-- Tarro de monedas casi lleno, como en el cierre de los Reels -->
    <g transform="translate(1145,${SUELO}) scale(.7)">
      <defs><clipPath id="tarro"><rect x="-105" y="-230" width="210" height="228" rx="38"/></clipPath></defs>
      <rect x="-77" y="-262" width="154" height="34" rx="10" fill="#33415c"/>
      <g clip-path="url(#tarro)"><rect x="-105" y="-150" width="210" height="160" fill="${C.necesidades}"/>
        ${[[-55, -128], [0, -138], [55, -126], [-28, -96], [30, -98]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="20" fill="#e9c46a" stroke="#b8902e" stroke-width="4"/>`).join('')}</g>
      <rect x="-105" y="-230" width="210" height="228" rx="38" fill="none" stroke="${C.acento}" stroke-width="8"/>
    </g>
    ${moneda(1150, 330, 0.66, t.moneda, -12)}${moneda(1118, 258, 0.55, t.moneda, 10)}
    ${muneco(1005, CADERA, K, '', 'mA')}
    ${muneco(1265, CADERA, K, '', 'mB')}
    <g class="cartel"><line x1="0" y1="0" x2="0" y2="-34" stroke="#94a3b8" stroke-width="7"/>
      <rect x="-92" y="-122" width="184" height="90" rx="16" fill="#f1f5f9" stroke="${C.acento}" stroke-width="5"/>
      <text x="0" y="-62" text-anchor="middle" font-size="40" font-weight="900" fill="#0f766e">${t.cartel}</text></g>
    <!-- chispas de celebración -->
    ${[[925, 230], [1090, 200], [945, 330]].map(([x, y], i) => `<path transform="translate(${x},${y}) scale(${[1, .7, .8][i]})" d="M0 -14 L4 -4 L14 0 L4 4 L0 14 L-4 4 L-14 0 L-4 -4Z" fill="#e9c46a"/>`).join('')}
    <!-- decoración fuera de la zona segura (en el móvil se recorta) -->
    ${moneda(1520, 150, 0.9, t.moneda, 14)}${moneda(1585, 420, 0.65, t.moneda, -8)}${moneda(120, 470, 0.8, t.moneda, -16)}${moneda(190, 130, 0.55, t.moneda, 8)}
  </svg>
  <script>${SCRIPT_MUNECO}
    const arriba = { pa: -10, pb: 10, pa2: 4, pb2: -4, ba: -128, ba2: -22, bb: 150, bb2: 18, y: -6 };
    posar(document.querySelector('.mA'), arriba);
    posar(document.querySelector('.mB'), POSES.cartel);
    const [hx, hy] = mano(document.querySelector('.mB'), POSES.cartel, 'a');
    document.querySelector('.cartel').setAttribute('transform', 'translate(' + hx + ',' + hy + ') rotate(-4)');
  </script>
</body></html>`;

(async () => {
  fs.mkdirSync(SALIDA, { recursive: true });
  const navegador = await chromium.launch();
  for (const lang of Object.keys(T)) {
    const pagina = await navegador.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
    pagina.on('pageerror', (e) => { console.error('error en la página:', e.message); process.exitCode = 1; });
    await pagina.setContent(html(T[lang]), { waitUntil: 'load' });
    await pagina.evaluate(() => document.fonts.ready);
    const archivo = path.join(SALIDA, `portada-facebook-${lang}.png`);
    await pagina.screenshot({ path: archivo });
    console.log('✓', path.relative(process.cwd(), archivo));
    await pagina.close();
  }
  await navegador.close();
})();
