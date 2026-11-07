// Reels hablados (9:16): voz en off, subtítulos grandes y una metáfora animada.
// Uso: node reel-voz.js <slug> [en|es…] [--vista] [--sin-voz]
// Salida: out-reels/<slug>/<idioma>/reel.mp4 · portada.jpg · texto.txt
//
// El guion (reels-voz/<slug>.js) es una lista de frases [escena, texto]; las
// palabras entre *asteriscos* salen resaltadas en los subtítulos, las
// [etiquetas] dirigen la voz (no salen en pantalla) y cada § marca un momento
// que la animación puede usar (e.seg[i].marcas, en segundos). Cada frase se
// sintetiza aparte (voz.cjs), así que las escenas y los subtítulos van al ritmo
// real de la voz. Cada escena puede tener una animación anim(s, e, el) que se
// ejecuta en la página con el tiempo local s (segundos) y e.seg = inicio y
// duración de sus frases. Los elementos con class="a" entran uno tras otro.
// La voz necesita la credencial (variables FBT y SA); sin ella, o con
// --sin-voz, sale reel-sin-voz.mp4 con silencios de duración estimada.
const { chromium } = require('playwright');
const { spawn, execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const { C, css, firma } = require('./comun');
const { sintetizar } = require('./voz.cjs');

const FPS = 30, PAUSA = 0.2, CAMBIO = 0.12, INICIO = 0.25, COLA = 1.8, FUNDIDO = 0.3;
const F = { w: 1080, h: 1920, arriba: 210, abajo: 420, lado: 84, h1: 78, txt: 40, centrar: false };

// Trocea una frase en golpes de subtítulo (2–4 palabras) con su parte del tiempo.
function trozos(texto, ini, dur) {
  texto = texto.replace(/\[[^\]]*\]\s*/g, '').replace(/§/g, '');
  const palabras = [];
  let resaltada = false;
  for (const p of texto.split(/\s+/).filter(Boolean)) {
    const abre = p.startsWith('*'), cierra = p.replace(/[.,!?¿¡:;]+$/, '').endsWith('*');
    if (abre) resaltada = true;
    palabras.push({ txt: p.replace(/\*/g, ''), res: resaltada });
    if (cierra) resaltada = false;
  }
  const grupos = [];
  let g = [];
  for (const w of palabras) {
    g.push(w);
    const largo = g.map(x => x.txt).join(' ').length;
    if (largo >= 15 || /[.,!?:;]$/.test(w.txt) || g.length === 4) { grupos.push(g); g = []; }
  }
  if (g.length) grupos.push(g);
  const peso = grupos.map(x => x.map(w => w.txt).join(' ').length + 3), suma = peso.reduce((a, b) => a + b, 0);
  let t = ini;
  return grupos.map((x, i) => {
    const d = dur * peso[i] / suma, s = { ini: t, fin: t + d, html: x.map(w => w.res ? `<span class="c">${w.txt}</span>` : w.txt).join(' ') };
    t += d; return s;
  });
}

function linea(reel, lang, voces) {
  const t = reel.T[lang];
  let tt = INICIO;
  const frases = t.guion.map(([esc, texto], i) => {
    if (i > 0 && esc !== t.guion[i - 1][0]) tt += CAMBIO;
    // Marcas §: posición en el texto hablado → momento aproximado dentro de la frase.
    const limpio = texto.replace(/\[[^\]]*\]\s*/g, '').replace(/\*/g, ''), largo = limpio.replace(/§/g, '').length;
    const marcas = [];
    limpio.split('§').slice(0, -1).reduce((pos, trozo) => { pos += trozo.length; marcas.push(tt + voces[i].dur * pos / largo); return pos; }, 0);
    const f = { esc, texto, ini: tt, dur: voces[i].dur, marcas };
    tt += voces[i].dur + PAUSA;
    return f;
  });
  const total = frases[frases.length - 1].ini + frases[frases.length - 1].dur + COLA;
  const escenas = reel.escenas.map((_, k) => {
    const fs_ = frases.filter(f => f.esc === k);
    return { ini: k === 0 ? 0 : fs_[0].ini - 0.25, seg: fs_ };
  });
  escenas.forEach((e, k) => {
    e.fin = k < escenas.length - 1 ? escenas[k + 1].ini + FUNDIDO : total;
    e.seg = e.seg.map(f => ({ ini: f.ini - e.ini, dur: f.dur, marcas: f.marcas.map(m => m - e.ini) }));
  });
  const subs = frases.flatMap(f => trozos(f.texto, f.ini, f.dur));
  return { frases, escenas, subs, total };
}

function pagina(reel, lang, L) {
  const t = reel.T[lang];
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><style>${css(F)}
    .escena { position: absolute; left: 0; right: 0; top: 290px; height: 900px; padding: 0 ${F.lado}px; }
    .arriba .firma { font-size: 24px; color: ${C.suave}; }
    #sub { position: absolute; left: 70px; right: 70px; top: 1215px; height: 270px; display: flex; align-items: center; justify-content: center; text-align: center;
      font-size: 68px; line-height: 1.12; font-weight: 800; letter-spacing: -.02em; color: #fff; text-shadow: 0 4px 22px rgba(0,0,0,.55); }
    #sub .c { color: ${C.acento}; }
    h1 { font-size: ${F.h1}px; }
    ${reel.css || ''}
  </style></head><body>
  ${reel.cabecera ? `<div class="pag"><div class="arriba"><span class="kicker">${t.kicker}</span>${firma()}</div></div>` : ''}
  ${reel.escenas.map((e, i) => `<div class="escena" data-n="${i}">${e.html(t, lang)}</div>`).join('')}
  <div id="sub"></div>
  <script>
  const LANG = ${JSON.stringify(lang)}, D = ${JSON.stringify(reel.datos ? reel.datos(lang) : {})};
  const ESC = ${JSON.stringify(L.escenas.map(e => ({ ini: e.ini, fin: e.fin, seg: e.seg })))};
  const SUB = ${JSON.stringify(L.subs)};
  const FUND = ${FUNDIDO};
  const tramo = (t, a, b) => Math.min(1, Math.max(0, (t - a) / (b - a)));
  const sale = (x) => 1 - Math.pow(1 - x, 3);
  const rebote = (x) => { const c = 1.70158, d = c + 1; return x <= 0 ? 0 : x >= 1 ? 1 : 1 + d * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
  const lerp = (a, b, p) => a + (b - a) * p;
  const dinero = (n) => { const e = String(Math.round(Math.abs(n))).replace(/\\B(?=(\\d{3})+(?!\\d))/g, LANG === 'en' ? ',' : '.'); return (n < 0 ? '−' : '') + (LANG === 'en' ? '$' + e : e + '\\u00a0€'); };
  ${reel.script || ''}
  const ANIM = [${reel.escenas.map(e => (e.anim ? e.anim.toString() : 'null')).join(',\n')}];
  const nodos = [...document.querySelectorAll('.escena')], sub = document.getElementById('sub');
  let subActual = -1;
  function pintar(t) {
    nodos.forEach((el, i) => {
      const e = ESC[i], ultima = i === nodos.length - 1;
      const op = Math.min(i === 0 ? 1 : tramo(t, e.ini, e.ini + FUND), ultima ? 1 : 1 - tramo(t, e.fin - FUND, e.fin));
      el.style.opacity = op; el.style.visibility = op > 0 ? 'visible' : 'hidden';
      if (op <= 0) return;
      const s = t - e.ini;
      el.querySelectorAll('.a').forEach((a, k) => {
        const p = sale(tramo(s, 0.15 + k * 0.3, 0.7 + k * 0.3));
        a.style.opacity = p; a.style.transform = 'translateY(' + ((1 - p) * 30) + 'px)';
      });
      if (ANIM[i]) ANIM[i](s, e, el);
    });
    const k = SUB.findIndex(x => t >= x.ini && t < x.fin + 0.12);
    if (k !== subActual) { sub.innerHTML = k >= 0 ? '<div>' + SUB[k].html + '</div>' : ''; subActual = k; }
    if (k >= 0) { const p = rebote(tramo(t, SUB[k].ini, SUB[k].ini + 0.18)); sub.style.transform = 'scale(' + (0.86 + 0.14 * p) + ')'; sub.style.opacity = Math.min(1, p * 1.5); }
  }
  </script></body></html>`;
}

async function grabar(browser, reel, lang, { vista, sinVoz }) {
  const t = reel.T[lang];
  const dir = path.join(__dirname, 'out-reels', reel.slug, lang);
  fs.mkdirSync(dir, { recursive: true });
  const cred = !sinVoz && process.env.FBT && process.env.SA ? { fbt: process.env.FBT, sa: process.env.SA } : null;
  const voces = await sintetizar(t.guion.map(([, x]) => x), reel.voz[lang], cred);
  const real = voces.every(v => v.real);
  const L = linea(reel, lang, voces);
  const tmp = path.join(dir, '.tmp.html');
  fs.writeFileSync(tmp, pagina(reel, lang, L));
  const page = await browser.newPage({ viewport: { width: F.w, height: F.h }, deviceScaleFactor: 1 });
  page.on('pageerror', (e) => console.log('⚠ error en la página:', e.message));
  await page.goto('file://' + tmp, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const desborda = await page.evaluate(() => [...document.querySelectorAll('.escena')].map((c, i) => c.scrollHeight > c.clientHeight + 2 ? i + 1 : 0).filter(Boolean));
  if (desborda.length) console.log(`⚠ ${reel.slug} ${lang}: no caben las escenas ${desborda.join(', ')}`);
  for (const f of fs.readdirSync(dir)) if (f.startsWith('vista-')) fs.unlinkSync(path.join(dir, f));
  if (vista) {
    // Un fotograma al final de cada frase y otro al final del vídeo.
    const momentos = [...L.frases.map(f => f.ini + f.dur - 0.05), L.total - 0.05];
    for (const [i, m] of momentos.entries()) {
      await page.evaluate((x) => pintar(x), m);
      await page.screenshot({ path: path.join(dir, `vista-${String(i + 1).padStart(2, '0')}.jpg`), type: 'jpeg', quality: 85 });
    }
    await page.close(); fs.unlinkSync(tmp);
    return { total: L.total, real };
  }
  const video = path.join(dir, '.video.mp4'), musica = path.join(dir, '.musica.wav'), audio = path.join(dir, '.audio.wav'), spec = path.join(dir, '.mezcla.json');
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p', '-r', String(FPS), video]);
  let err = ''; ff.stderr.on('data', d => { err += d; });
  for (let i = 0; i < Math.round(L.total * FPS); i++) {
    await page.evaluate((x) => pintar(x), i / FPS);
    const buf = await page.screenshot({ type: 'jpeg', quality: 93 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  }
  ff.stdin.end();
  await new Promise((ok, mal) => ff.on('close', c => (c === 0 ? ok() : mal(new Error('ffmpeg: ' + err)))));
  // Portada: el gancho, con su primera frase entera en pantalla.
  await page.evaluate((x) => pintar(x), L.frases[0].ini + L.frases[0].dur - 0.1);
  await page.screenshot({ path: path.join(dir, 'portada.jpg'), type: 'jpeg', quality: 92 });
  await page.close();
  execFileSync('python3', [path.join(__dirname, 'musica.py'), String(L.total), musica]);
  fs.writeFileSync(spec, JSON.stringify({ total: L.total, musica, salida: audio, frases: L.frases.map((f, i) => ({ archivo: voces[i].archivo, ini: f.ini })) }));
  execFileSync('python3', [path.join(__dirname, 'mezcla.py'), spec]);
  const salida = path.join(dir, real ? 'reel.mp4' : 'reel-sin-voz.mp4');
  // Volumen al nivel de las redes (unos −14 LUFS).
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', video, '-i', audio, '-c:v', 'copy', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-ar', '44100', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', salida]);
  for (const f of [tmp, video, musica, audio, spec]) fs.unlinkSync(f);
  if (real && fs.existsSync(path.join(dir, 'reel-sin-voz.mp4'))) fs.unlinkSync(path.join(dir, 'reel-sin-voz.mp4'));
  fs.writeFileSync(path.join(dir, 'texto.txt'), reel.texto[lang]);
  return { total: L.total, real };
}

(async () => {
  const args = process.argv.slice(2);
  const reel = require(`./reels-voz/${args[0]}.js`);
  const idiomas = args.filter(a => ['en', 'es'].includes(a));
  const op = { vista: args.includes('--vista'), sinVoz: args.includes('--sin-voz') };
  const browser = await chromium.launch();
  for (const lang of idiomas.length ? idiomas : ['en', 'es']) {
    const ini = Date.now();
    const { total, real } = await grabar(browser, reel, lang, op);
    console.log(`✓ ${reel.slug} ${lang}: ${total.toFixed(1)} s ${real ? 'con voz' : '(sin voz: duraciones estimadas)'} (${((Date.now() - ini) / 1000).toFixed(0)} s)`);
  }
  await browser.close();
})().catch(e => { console.error(e.response?.data?.error?.message || e); process.exit(1); });
