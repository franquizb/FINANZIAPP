// Reels educativos (Instagram y TikTok, 9:16) con la estética de los carruseles.
// Uso: node reel.js <slug> [en|es…] [--vista]
// Salida: out-reels/<slug>/<idioma>/reel.mp4 · portada.jpg · texto.txt
// Con --vista solo saca un fotograma por escena (vista-NN.jpg) para revisar rápido.
//
// Un reel es una lista de escenas (reels/<slug>.js). En cada escena, los
// elementos con class="a" aparecen uno tras otro (suben y se funden); los que
// llevan data-ancho="NN" crecen hasta NN % y los que llevan data-cuenta="N"
// cuentan hasta N con el formato de su texto. Entre escenas, fundido suave.
// Música: colchón original (musica.py) a volumen bajo, sin derechos de terceros.
const { chromium } = require('playwright');
const { spawn, execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const { C, css, firma } = require('./comun');

const FPS = 30, FUNDIDO = 0.45;
const F = { w: 1080, h: 1920, arriba: 210, abajo: 420, lado: 84, h1: 86, txt: 40, centrar: true };

function pagina(reel, t, lang) {
  let ini = 0;
  const escenas = reel.escenas.map((e, i) => {
    const dur = (reel.duraciones && reel.duraciones[i]) || 4.5;
    const s = { ini, fin: ini + dur, html: e(t, lang) };
    ini += dur - FUNDIDO;
    return s;
  });
  const total = escenas[escenas.length - 1].fin;
  return { total, escenas, html: `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><style>${css(F)}
    .escena { position: absolute; inset: 0; }
    .arriba .firma { font-size: 24px; color: ${C.suave}; }
    .cuerpo h1 { font-size: ${F.h1}px; }
    .grande-num { font-size: 150px; font-weight: 800; letter-spacing: -.04em; line-height: 1; }
    .linea-barra { height: 34px; border-radius: 10px; }
  </style></head><body>
  ${escenas.map((s, i) => `<div class="escena" data-ini="${s.ini}" data-fin="${s.fin}" data-n="${i}"><div class="pag">
    <div class="arriba"><span class="kicker">${t.kicker}</span>${firma()}</div>
    <div class="cuerpo">${s.html}</div><div class="abajo"></div></div></div>`).join('')}
  <script>
  const FUND = ${FUNDIDO};
  const sale = (x) => 1 - Math.pow(1 - x, 3);
  const tramo = (t, a, b) => Math.min(1, Math.max(0, (t - a) / (b - a)));
  const agrupa = (n, sep) => String(Math.round(n)).replace(/\\B(?=(\\d{3})+(?!\\d))/g, sep);
  document.querySelectorAll('[data-cuenta]').forEach(el => { el.dataset.plantilla = el.textContent; });
  function pintar(t) {
    document.querySelectorAll('.escena').forEach((e, idx, todas) => {
      const ini = +e.dataset.ini, fin = +e.dataset.fin, ultima = idx === todas.length - 1;
      const op = Math.min(tramo(t, ini, ini + FUND), ultima ? 1 : 1 - tramo(t, fin - FUND, fin));
      e.style.opacity = op; e.style.visibility = op > 0 ? 'visible' : 'hidden';
      if (op <= 0) return;
      e.querySelectorAll('.a').forEach((el, k) => {
        const p = sale(tramo(t, ini + 0.25 + k * 0.42, ini + 0.95 + k * 0.42));
        el.style.opacity = p; el.style.transform = 'translateY(' + ((1 - p) * 34) + 'px)';
        el.querySelectorAll('[data-ancho]').forEach(b => { const q = sale(tramo(t, ini + 0.55 + k * 0.42, ini + 1.6 + k * 0.42)); b.style.width = (q * +b.dataset.ancho) + '%'; });
        el.querySelectorAll('[data-cuenta]').forEach(c => {
          const q = sale(tramo(t, ini + 0.45 + k * 0.42, ini + 1.9 + k * 0.42)), pl = c.dataset.plantilla;
          const sep = /\\d,\\d{3}/.test(pl) ? ',' : '.';
          c.textContent = pl.replace(/[0-9][0-9.,]*/, agrupa(q * +c.dataset.cuenta, sep));
        });
      });
    });
  }
  </script></body></html>` };
}

async function grabar(browser, reel, lang, vista) {
  const t = reel.T[lang];
  const dir = path.join(__dirname, 'out-reels', reel.slug, lang);
  fs.mkdirSync(dir, { recursive: true });
  const { total, escenas, html } = pagina(reel, t, lang);
  const tmp = path.join(dir, '.tmp.html'), video = path.join(dir, '.video.mp4'), audio = path.join(dir, '.musica.wav');
  fs.writeFileSync(tmp, html);
  const page = await browser.newPage({ viewport: { width: F.w, height: F.h }, deviceScaleFactor: 1 });
  await page.goto('file://' + tmp, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const desborda = await page.evaluate(() => [...document.querySelectorAll('.cuerpo')].map((c, i) => c.scrollHeight > c.clientHeight + 2 ? i + 1 : 0).filter(Boolean));
  if (desborda.length) console.log(`⚠ ${reel.slug} ${lang}: no caben las escenas ${desborda.join(', ')}`);
  if (vista) {
    for (const [i, s] of escenas.entries()) {
      await page.evaluate((x) => pintar(x), i === escenas.length - 1 ? total - 0.05 : s.fin - FUNDIDO - 0.05);
      await page.screenshot({ path: path.join(dir, `vista-${String(i + 1).padStart(2, '0')}.jpg`), type: 'jpeg', quality: 85 });
    }
    await page.close(); fs.unlinkSync(tmp);
    return total;
  }
  for (const f of fs.readdirSync(dir)) if (f.startsWith('vista-')) fs.unlinkSync(path.join(dir, f));
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p', '-r', String(FPS), video]);
  let err = ''; ff.stderr.on('data', d => { err += d; });
  for (let i = 0; i < Math.round(total * FPS); i++) {
    await page.evaluate((x) => pintar(x), i / FPS);
    const buf = await page.screenshot({ type: 'jpeg', quality: 93 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  }
  ff.stdin.end();
  await new Promise((ok, mal) => ff.on('close', c => (c === 0 ? ok() : mal(new Error('ffmpeg: ' + err)))));
  // Portada: la primera escena completa.
  await page.evaluate(() => pintar(3.2));
  await page.screenshot({ path: path.join(dir, 'portada.jpg'), type: 'jpeg', quality: 92 });
  await page.close();
  execFileSync('python3', [path.join(__dirname, 'musica.py'), String(total), audio]);
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', video, '-i', audio, '-c:v', 'copy', '-c:a', 'aac', '-b:a', '160k', '-shortest', '-movflags', '+faststart', path.join(dir, 'reel.mp4')]);
  for (const f of [tmp, video, audio]) fs.unlinkSync(f);
  fs.writeFileSync(path.join(dir, 'texto.txt'), reel.texto[lang]);
  return total;
}

(async () => {
  const args = process.argv.slice(2);
  const reel = require(`./reels/${args[0]}.js`);
  const idiomas = args.filter(a => ['en', 'es'].includes(a)), vista = args.includes('--vista');
  const browser = await chromium.launch();
  for (const lang of idiomas.length ? idiomas : ['en', 'es']) {
    const ini = Date.now();
    const total = await grabar(browser, reel, lang, vista);
    console.log(`✓ ${reel.slug} ${lang}: ${total.toFixed(1)} s (${((Date.now() - ini) / 1000).toFixed(0)} s de render)`);
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
