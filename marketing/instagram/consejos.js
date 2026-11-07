// Consejos de ahorro para TikTok, Reels e Instagram con la estética de la web.
// Uso: node consejos.js [semana] [idioma…]      p. ej.: node consejos.js 1 en
// Salida (out/consejos/semana-<n>/<idioma>/):
//   dia-01-<slug>.mp4          vídeo 9:16 (~15 s) para TikTok y Reels
//   dia-01-<slug>-feed.jpg     imagen 4:5 para el feed de Instagram
//   dia-01-<slug>-portada.jpg  portada 9:16 (miniatura de TikTok / Reels)
//   textos.md                  descripción de cada publicación con hashtags
// Cada fotograma se pinta en Chromium (pintar(t)) y va a ffmpeg por tubería.
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const { RAIZ, img, LOGO, cssBase } = require('./comun');

const FPS = 30;
const T = { gancho: [0, 3.0], pasos: [2.9, 10.0], prueba: [9.9, 13.0], final: [12.9, 15.6] };
const DURACION = T.final[1];
const V = { w: 1080, h: 1920, pad: [210, 150, 380, 64], titulo: 92, sub: 34 };   // zona segura de TikTok: derecha y abajo libres
const F = { w: 1080, h: 1350, pad: [64, 64, 60, 64], titulo: 74, sub: 30 };

// ─── Números ────────────────────────────────────────────────────────────────
const agrupar = (n, sep) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, sep);
const dinero = (n, lang) => (lang === 'en' ? '$' + agrupar(n, ',') : agrupar(n, '.') + ' €');
// Valor futuro de aportaciones mensuales con interés compuesto mensual.
function compuesto({ mensual, interes, anios }) {
  const r = interes / 12, n = anios * 12;
  const total = mensual * (Math.pow(1 + r, n) - 1) / r;
  return { total, aportado: mensual * n, crecimiento: total - mensual * n };
}
function rellenar(c, lang) {
  const t = JSON.parse(JSON.stringify(c[lang]));
  if (c.compuesto) {
    const k = compuesto(c.compuesto);
    const v = { total: dinero(k.total, lang), aportado: dinero(k.aportado, lang), crecimiento: dinero(k.crecimiento, lang) };
    const sust = (s) => s.replace(/\{(total|aportado|crecimiento)\}/g, (_, x) => v[x]);
    t.prueba.cifra = sust(t.prueba.cifra); t.prueba.texto = sust(t.prueba.texto); t.texto = sust(t.texto);
  }
  return t;
}

// Gancho palabra a palabra sin romper el resaltado <em>…</em> entre palabras.
function palabrasGancho(lineas) {
  const out = [];
  lineas.forEach((linea, li) => {
    if (li) out.push('<br>');
    let dentro = false;
    linea.split(/\s+/).forEach(w => {
      const abre = w.includes('<em>'), cierra = w.includes('</em>');
      const limpio = w.replace(/<\/?em>/g, '');
      out.push(`<span>${dentro || abre ? `<em>${limpio}</em>` : limpio}</span>`);
      if (abre) dentro = true;
      if (cierra) dentro = false;
    });
  });
  return out.join('');
}

// ─── Estilos propios de los consejos (sobre cssBase de la web) ─────────────
const cssConsejo = (D) => `
  .pasos { display: flex; flex-direction: column; gap: 22px; }
  .paso { display: flex; align-items: center; gap: 26px; padding: 26px 30px; border-radius: 24px; background: rgba(15,23,42,.82);
    border: 1px solid rgba(148,163,184,.22); box-shadow: 0 24px 50px rgba(0,0,0,.4); }
  .paso .n { flex: 0 0 auto; width: 64px; height: 64px; border-radius: 18px; display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: 900;
    color: #04111c; background: linear-gradient(135deg, #2dd4bf, #22d3ee); box-shadow: 0 10px 26px rgba(45,212,191,.35); }
  .paso .t { font-size: ${D.paso}px; font-weight: 700; line-height: 1.22; color: #f1f5f9; letter-spacing: -.01em; }
  .prueba { border-radius: 30px; padding: 40px 42px; background: linear-gradient(160deg, rgba(45,212,191,.16), rgba(56,189,248,.08) 60%, rgba(15,23,42,.6));
    border: 1px solid rgba(45,212,191,.38); box-shadow: 0 30px 70px rgba(0,0,0,.45); }
  .prueba .eti { font-size: 20px; font-weight: 800; letter-spacing: .16em; color: #5eead4; }
  .prueba .cifra { white-space: nowrap; margin-top: 10px; font-family: 'Inter Display', 'Inter'; font-size: ${D.cifra}px; font-weight: 900; letter-spacing: -.04em; line-height: 1;
    background: linear-gradient(90deg, #2dd4bf, #38bdf8); -webkit-background-clip: text; background-clip: text; color: transparent; }
  .prueba .txt { margin-top: 18px; font-size: ${D.pruebaTxt}px; font-weight: 600; line-height: 1.35; color: #cbd5e1; }
  .barra-prueba { margin-top: 26px; height: 14px; border-radius: 999px; background: rgba(148,163,184,.18); overflow: hidden; }
  .barra-prueba i { display: block; height: 100%; border-radius: 999px; background: linear-gradient(90deg, #2dd4bf, #38bdf8); box-shadow: 0 0 18px rgba(45,212,191,.6); }
  .cta-btn { display: inline-flex; align-items: center; padding: 26px 46px; border-radius: 999px; font-size: ${D.cta}px; font-weight: 800; color: #04111c;
    background: linear-gradient(90deg, #2dd4bf, #22d3ee); box-shadow: 0 22px 50px rgba(45,212,191,.4); white-space: nowrap; }
  .captura { border-radius: 22px; overflow: hidden; box-shadow: 0 40px 90px rgba(0,0,0,.6), 0 0 0 1px rgba(148,163,184,.22); background: #0b1020; }
  .captura img { display: block; width: 100%; }
`;

const TXT_FIJO = {
  en: { prueba: 'THE MATH', gratis: '15 days free · No card needed', guarda: 'Save this for later', con: 'with' },
  es: { prueba: 'LAS CUENTAS', gratis: '15 días gratis · Sin tarjeta', guarda: 'Guárdalo para luego', con: 'con' }
};

// ─── Vídeo 9:16 ─────────────────────────────────────────────────────────────
function paginaVideo(c, lang) {
  const t = rellenar(c, lang), fijo = TXT_FIJO[lang];
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><style>
  ${cssBase(V, '9x16')}
  ${cssConsejo({ paso: 46, cifra: 176, pruebaTxt: 40, cta: 38 })}
  .capa { position: absolute; left: ${V.pad[3]}px; right: ${V.pad[1]}px; }
  .cab { position: absolute; left: ${V.pad[3]}px; right: ${V.pad[3]}px; top: 230px; display: flex; justify-content: space-between; align-items: center; }
  .cab .kicker { margin: 0; }
  .gancho { top: 50%; transform: translateY(-58%); font-family: 'Inter Display', 'Inter'; font-weight: 900; font-size: 112px; line-height: 1.02; letter-spacing: -.045em; }
  .gancho span { display: inline-block; margin-right: .2em; }
  .gancho em, h2 em { font-style: normal; background: linear-gradient(90deg, #2dd4bf, #38bdf8); -webkit-background-clip: text; background-clip: text; color: transparent; }
  .titulo-pasos { top: ${V.pad[0] + 150}px; }
  .titulo-pasos h2 { font-family: 'Inter Display', 'Inter'; font-size: 68px; font-weight: 900; line-height: 1.04; letter-spacing: -.035em; }
  .lista { top: ${V.pad[0] + 450}px; }
  .lista .pasos { gap: 30px; }
  .lista .paso { padding: 34px 34px; }
  .lista .paso .n { width: 76px; height: 76px; font-size: 38px; border-radius: 20px; }
  .zona-prueba { top: 50%; transform: translateY(-50%); }
  .zona-prueba .prueba { padding: 56px 52px; }
  .zona-prueba .barra-prueba { height: 18px; margin-top: 34px; }
  .final { top: ${V.pad[0] + 150}px; bottom: ${V.pad[2] - 60}px; display: flex; flex-direction: column; align-items: flex-start; justify-content: center; }
  .final h2 { font-family: 'Inter Display', 'Inter'; font-size: 74px; font-weight: 900; line-height: 1.02; letter-spacing: -.035em; }
  .final .captura { margin-top: 44px; width: 100%; }
  .final .pie { margin-top: 64px; }
  .final .nota { margin-top: 18px; font-size: 26px; color: #94a3b8; font-weight: 600; }
  </style></head><body><div class="rejilla"></div>
  <div class="cab">${LOGO}<span class="kicker">${t.kicker}</span></div>
  <div class="capa gancho" id="gancho">${palabrasGancho(t.gancho)}</div>
  <div class="capa titulo-pasos" id="tpasos"><h2>${t.gancho.join(' ')}</h2></div>
  <div class="capa lista"><div class="pasos">${t.pasos.map((p, i) => `<div class="paso" data-paso="${i}"><span class="n">${i + 1}</span><span class="t">${p}</span></div>`).join('')}</div></div>
  <div class="capa zona-prueba" id="prueba"><div class="prueba"><div class="eti">${fijo.prueba}</div><div class="cifra" id="cifra">${t.prueba.cifra}</div>
    <div class="txt">${t.prueba.texto}</div><div class="barra-prueba"><i id="barra"></i></div></div></div>
  <div class="capa final" id="final"><h2>${t.cta} ${fijo.con} <em>FinanziApp</em></h2>
    <div class="captura"><img src="${img(lang, c.app)}"></div>
    <div class="pie"><div class="cta-btn">finanziapp.com →</div><div class="nota">${fijo.gratis}</div></div></div>
  <script>
  const T = ${JSON.stringify(T)};
  const CIFRA = ${JSON.stringify(t.prueba.cifra)};
  const sale = (x) => 1 - Math.pow(1 - x, 3), entra = (x) => x * x * x;
  const tramo = (t, a, b) => Math.min(1, Math.max(0, (t - a) / (b - a)));
  const vida = (t, [a, b], d = 0.5, f = 0.35) => sale(tramo(t, a, a + d)) * (1 - entra(tramo(t, b - f, b)));
  // Cuenta hacia arriba manteniendo el formato de la cifra ($1,300 · 1.300 €).
  const num = Number(CIFRA.replace(/[^0-9]/g, ''));
  const sep = CIFRA.includes(',') ? ',' : '.';
  const fmt = (n) => CIFRA.replace(/[0-9][0-9.,]*/, String(Math.round(n)).replace(/\\B(?=(\\d{3})+(?!\\d))/g, sep));
  // La cifra final cabe en una línea: si no, se reduce la letra.
  function ajustarCifra() {
    const c = document.getElementById('cifra'), caja = c.parentElement;
    c.textContent = CIFRA;
    const max = caja.clientWidth - parseFloat(getComputedStyle(caja).paddingLeft) * 2;
    let fs = parseFloat(getComputedStyle(c).fontSize);
    while (c.scrollWidth > max && fs > 60) { fs -= 4; c.style.fontSize = fs + 'px'; }
  }
  function pintar(t) {
    const g = document.getElementById('gancho');
    const vg = 1 - entra(tramo(t, T.gancho[1] - 0.35, T.gancho[1]));
    [...g.querySelectorAll('span')].forEach((s, i) => {
      const p = sale(tramo(t, 0.05 + i * 0.16, 0.45 + i * 0.16));
      s.style.opacity = p * vg; s.style.translate = '0 ' + ((1 - p) * 50) + 'px'; s.style.filter = 'blur(' + ((1 - p) * 8) + 'px)';
    });
    const vp = vida(t, T.pasos, 0.5, 0.35);
    const tp = document.getElementById('tpasos'); tp.style.opacity = vp; tp.style.translate = '0 ' + ((1 - vp) * 30) + 'px';
    document.querySelectorAll('[data-paso]').forEach((el, i) => {
      const a = T.pasos[0] + 0.45 + i * 2.1;
      const p = sale(tramo(t, a, a + 0.6)) * (1 - entra(tramo(t, T.pasos[1] - 0.35, T.pasos[1])));
      el.style.opacity = p; el.style.translate = ((1 - p) * -120) + 'px 0';
      const activo = t >= a && t < a + 2.1 && t < T.pasos[1] - 0.4;
      el.style.borderColor = activo ? 'rgba(45,212,191,.7)' : 'rgba(148,163,184,.22)';
      el.style.scale = String(activo ? 1.02 : 1);
    });
    const pr = document.getElementById('prueba'); const vpr = vida(t, T.prueba, 0.45, 0.35);
    pr.style.opacity = vpr; pr.style.scale = String(0.94 + 0.06 * vpr);
    const k = sale(tramo(t, T.prueba[0] + 0.3, T.prueba[0] + 1.8));
    document.getElementById('cifra').textContent = fmt(num * k);
    document.getElementById('barra').style.width = (k * 100) + '%';
    const fi = document.getElementById('final'); const vf = sale(tramo(t, T.final[0] + 0.1, T.final[0] + 0.8));
    fi.style.opacity = vf; fi.style.translate = '0 ' + ((1 - vf) * 50) + 'px';
    const btn = fi.querySelector('.cta-btn');
    btn.style.scale = String(t > T.final[0] + 1.1 ? 1 + 0.035 * Math.sin((t - T.final[0]) * 5) : 1);
  }
  </script></body></html>`;
}

// ─── Imagen 4:5 para el feed ────────────────────────────────────────────────
function paginaFeed(c, lang) {
  const t = rellenar(c, lang), fijo = TXT_FIJO[lang];
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><style>
  ${cssBase(F, '4x5')}
  ${cssConsejo({ paso: 35, cifra: 124, pruebaTxt: 30, cta: 30 })}
  .lienzo { gap: 0; }
  h1 { font-size: 78px; margin-top: 30px; }
  .pasos { margin-top: 40px; gap: 18px; }
  .paso { padding: 26px 28px; border-radius: 22px; }
  .paso .n { width: 58px; height: 58px; font-size: 30px; border-radius: 16px; }
  .prueba { margin-top: 30px; padding: 34px 38px; }
  .prueba .cifra { display: inline-block; }
  .prueba .linea { display: flex; align-items: baseline; gap: 24px; }
  .prueba .txt { margin-top: 6px; }
  .pie { margin-top: auto; display: flex; justify-content: space-between; align-items: center; }
  .pie .nota { font-size: 22px; color: #94a3b8; font-weight: 600; }
  .barra-prueba { margin-top: 18px; height: 10px; } .barra-prueba i { width: 100%; }
  </style></head><body><div class="rejilla"></div>
  <div class="lienzo">
    <div class="cabecera">${LOGO}<span class="kicker" style="margin:0">${t.kicker}</span></div>
    <h1>${t.gancho.join(' ')}</h1>
    <div class="pasos">${t.pasos.map((p, i) => `<div class="paso"><span class="n">${i + 1}</span><span class="t">${p}</span></div>`).join('')}</div>
    <div class="prueba"><div class="eti">${fijo.prueba}</div><div class="cifra">${t.prueba.cifra}</div><div class="txt">${t.prueba.texto}</div><div class="barra-prueba"><i></i></div></div>
    <div class="pie"><span class="cta-btn">finanziapp.com →</span><span class="nota">${fijo.guarda} 🔖</span></div>
  </div></body></html>`;
}

// ─── Grabación ──────────────────────────────────────────────────────────────
async function cargar(page, html, archivo) {
  fs.writeFileSync(archivo, html);
  await page.goto('file://' + archivo, { waitUntil: 'load' });
  await page.evaluate(async () => {
    await document.fonts.ready; await Promise.all([...document.images].map(i => i.decode().catch(() => {})));
    if (typeof ajustarCifra === 'function') ajustarCifra();
    else document.querySelectorAll('.prueba .cifra').forEach(c => {          // feed: misma regla
      const caja = c.parentElement, max = caja.clientWidth - parseFloat(getComputedStyle(caja).paddingLeft) * 2;
      let fs = parseFloat(getComputedStyle(c).fontSize);
      while (c.scrollWidth > max && fs > 50) { fs -= 4; c.style.fontSize = fs + 'px'; }
    });
  });
}

async function grabarVideo(browser, c, lang, base) {
  const page = await browser.newPage({ viewport: { width: V.w, height: V.h }, deviceScaleFactor: 1 });
  const tmp = base + '.tmp.html';
  await cargar(page, paginaVideo(c, lang), tmp);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p', '-r', String(FPS), '-movflags', '+faststart', base + '.mp4']);
  let err = ''; ff.stderr.on('data', d => { err += d; });
  for (let i = 0; i < Math.round(DURACION * FPS); i++) {
    await page.evaluate((t) => pintar(t), i / FPS);
    const buf = await page.screenshot({ type: 'jpeg', quality: 94 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  }
  ff.stdin.end();
  await new Promise((ok, mal) => ff.on('close', code => (code === 0 ? ok() : mal(new Error('ffmpeg: ' + err)))));
  // Portada: el gancho completo, justo antes de que se vaya.
  await page.evaluate(() => pintar(2.5));
  await page.screenshot({ path: base + '-portada.jpg', type: 'jpeg', quality: 92 });
  await page.close(); fs.unlinkSync(tmp);
}

async function grabarFeed(browser, c, lang, base) {
  const page = await browser.newPage({ viewport: { width: F.w, height: F.h }, deviceScaleFactor: 1 });
  const tmp = base + '.feed.tmp.html';
  await cargar(page, paginaFeed(c, lang), tmp);
  const desborda = await page.evaluate(() => document.querySelector('.lienzo').scrollHeight > window.innerHeight + 2);
  await page.screenshot({ path: base + '-feed.jpg', type: 'jpeg', quality: 92 });
  await page.close(); fs.unlinkSync(tmp);
  return desborda;
}

module.exports = { rellenar, dinero, compuesto };

if (require.main === module) (async () => {
  const args = process.argv.slice(2);
  const semana = args.find(a => /^\d+$/.test(a)) || '1';
  const consejos = require(`./consejos-semana-${semana}.js`);
  const idiomas = args.filter(a => ['en', 'es'].includes(a));
  const browser = await chromium.launch();
  if (args.includes('fotos')) {                     // revisión rápida: fotogramas sueltos
    const dir = path.join(RAIZ, 'out', 'consejos', 'prueba'); fs.mkdirSync(dir, { recursive: true });
    const n = Number((args.find(a => a.startsWith('consejo=')) || 'consejo=1').split('=')[1]) - 1;
    for (const lang of idiomas.length ? idiomas : ['en']) {
      const page = await browser.newPage({ viewport: { width: V.w, height: V.h } });
      await cargar(page, paginaVideo(consejos[n], lang), path.join(dir, 'tmp.html'));
      for (const s of [1.8, 7.8, 12.2, 15]) { await page.evaluate((x) => pintar(x), s); await page.screenshot({ path: path.join(dir, `${lang}-${n + 1}-t${s}.jpg`), type: 'jpeg', quality: 85 }); }
      await page.close();
      const d = await grabarFeed(browser, consejos[n], lang, path.join(dir, `${lang}-${n + 1}`));
      console.log('fotogramas en', dir, d ? '(feed se desborda)' : '');
    }
    await browser.close(); return;
  }
  for (const lang of idiomas.length ? idiomas : ['en', 'es']) {
    const dir = path.join(RAIZ, 'out', 'consejos', `semana-${semana}`, lang);
    fs.mkdirSync(dir, { recursive: true });
    const md = [`# Semana ${semana} · ${lang === 'en' ? 'English (US)' : 'Español'}\n`];
    for (const [i, c] of consejos.entries()) {
      const nombre = `dia-${String(i + 1).padStart(2, '0')}-${c.slug}`;
      const base = path.join(dir, nombre);
      const inicio = Date.now();
      await grabarVideo(browser, c, lang, base);
      const desborda = await grabarFeed(browser, c, lang, base);
      const t = rellenar(c, lang);
      md.push(`## Día ${i + 1} · ${t.kicker}\n\nArchivos: \`${nombre}.mp4\` (TikTok/Reels), \`${nombre}-feed.jpg\` (feed), \`${nombre}-portada.jpg\` (portada)\n\n${t.texto}\n\n${t.hashtags.join(' ')}\n`);
      console.log(`✓ ${lang} ${nombre} (${((Date.now() - inicio) / 1000).toFixed(0)} s)${desborda ? '  ⚠ la imagen del feed se desborda' : ''}`);
    }
    fs.writeFileSync(path.join(dir, 'textos.md'), md.join('\n'));
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
