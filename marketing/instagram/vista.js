// Vista previa del perfil: foto, nombre, bio, destacadas y la cuadrícula tal
// como quedará tras publicar los 9 posts (el último publicado, arriba a la
// izquierda; Instagram recorta las miniaturas a 3:4).
// Uso: node vista.js   (después de perfil.js y organico.js) → out/perfil/vista-<idioma>.jpg
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const RAIZ = __dirname;
const url = (...p) => 'file://' + path.join(RAIZ, 'out', ...p);

// Textos del perfil (los mismos que en PERFIL.md).
const PERFIL = {
  es: {
    usuario: 'finanziapp', nombre: 'FinanziApp: finanzas y ahorro', categoria: 'Aplicación',
    bio: ['📊 Tu dinero, claro y en un solo sitio', '💸 Presupuesto, gastos y patrimonio', '💡 Trucos para ahorrar cada semana', '👇 15 días gratis, sin tarjeta'],
    enlace: 'finanziapp.com', publicaciones: '9 publicaciones',
    destacadas: ['Novedades', 'Cómo funciona', 'Calculadoras', 'Consejos', 'Preguntas']
  },
  en: {
    usuario: 'finanziapp', nombre: 'FinanziApp: Budget & Savings', categoria: 'App page',
    bio: ['📊 All your money, clear and in one place', '💸 Budget, spending & net worth', '💡 Money tips every week', '👇 Free for 15 days, no card'],
    enlace: 'finanziapp.com', publicaciones: '9 posts',
    destacadas: ['News', 'How it works', 'Calculators', 'Tips', 'FAQ']
  }
};

const pagina = (lang) => {
  const p = PERFIL[lang];
  const portadas = fs.readdirSync(path.join(RAIZ, 'out', 'perfil', 'destacadas')).filter(f => f.endsWith('.png')).sort();
  const posts = fs.readdirSync(path.join(RAIZ, 'out', lang, 'posts')).filter(f => f.endsWith('.jpg')).sort();
  // Portada de cada post (primera diapositiva) y si es carrusel.
  const portadasPosts = [];
  for (const f of posts) {
    const n = f.slice(0, 2);
    if (!portadasPosts.find(x => x.n === n)) portadasPosts.push({ n, f, carrusel: posts.some(g => g.startsWith(n) && /-\d+\.jpg$/.test(g)) });
  }
  const cuadricula = portadasPosts.reverse();
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><style>
    * { box-sizing: border-box; margin: 0; }
    body { width: 1080px; font-family: 'Inter', sans-serif; background: #fff; color: #0f172a; -webkit-font-smoothing: antialiased; }
    .usuario { padding: 34px 40px 0; font-size: 34px; font-weight: 800; }
    .cab { display: flex; gap: 44px; align-items: center; padding: 30px 40px 0; }
    .foto { width: 210px; height: 210px; border-radius: 50%; padding: 7px; background: linear-gradient(45deg, #2dd4bf, #38bdf8); flex: none; }
    .foto img { width: 100%; height: 100%; border-radius: 50%; border: 6px solid #fff; display: block; }
    .nombre { font-size: 30px; font-weight: 800; }
    .categoria { font-size: 26px; color: #64748b; margin-top: 6px; }
    .cuenta { font-size: 26px; color: #475569; margin-top: 10px; font-weight: 600; }
    .bio { padding: 26px 40px 0; font-size: 28px; line-height: 1.45; }
    .bio a { color: #0369a1; font-weight: 700; text-decoration: none; }
    .destacadas { display: flex; gap: 34px; padding: 34px 40px 30px; }
    .destacada { width: 150px; text-align: center; font-size: 22px; font-weight: 600; }
    .destacada span { display: block; width: 136px; height: 136px; margin: 0 auto 10px; border-radius: 50%; border: 3px solid #e2e8f0; padding: 5px; }
    .destacada i { display: block; width: 100%; height: 100%; border-radius: 50%; background-size: cover; background-position: center; }
    .rejilla { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; border-top: 1px solid #e2e8f0; padding-top: 4px; }
    .celda { position: relative; aspect-ratio: 3 / 4; background-size: cover; background-position: center; }
    .celda.carrusel::after { content: ''; position: absolute; top: 16px; right: 16px; width: 26px; height: 26px; border-radius: 5px; border: 3px solid #fff;
      box-shadow: 5px -5px 0 -1px rgba(255,255,255,.9), 0 2px 8px rgba(0,0,0,.35); }
  </style></head><body>
    <div class="usuario">@${p.usuario}</div>
    <div class="cab">
      <div class="foto"><img src="${url('perfil', 'foto-perfil.png')}"></div>
      <div><div class="nombre">${p.nombre}</div><div class="categoria">${p.categoria}</div><div class="cuenta">${p.publicaciones}</div></div>
    </div>
    <div class="bio">${p.bio.join('<br>')}<br><a>🔗 ${p.enlace}</a></div>
    <div class="destacadas">${portadas.map((f, i) => `<div class="destacada"><span><i style="background-image:url('${url('perfil', 'destacadas', f)}')"></i></span>${p.destacadas[i]}</div>`).join('')}</div>
    <div class="rejilla">${cuadricula.map(c => `<div class="celda${c.carrusel ? ' carrusel' : ''}" style="background-image:url('${url(lang, 'posts', c.f)}')"></div>`).join('')}</div>
  </body></html>`;
};

(async () => {
  const browser = await chromium.launch();
  for (const lang of Object.keys(PERFIL)) {
    const page = await browser.newPage({ viewport: { width: 1080, height: 800 }, deviceScaleFactor: 1 });
    const tmp = path.join(RAIZ, 'out', 'perfil', `.vista-${lang}.html`);
    fs.writeFileSync(tmp, pagina(lang));
    await page.goto('file://' + tmp, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(RAIZ, 'out', 'perfil', `vista-${lang}.jpg`), type: 'jpeg', quality: 90, fullPage: true });
    await page.close();
    fs.unlinkSync(tmp);
  }
  await browser.close();
  console.log('✓ vista previa del perfil: out/perfil/vista-{es,en}.jpg');
})().catch(e => { console.error(e); process.exit(1); });
