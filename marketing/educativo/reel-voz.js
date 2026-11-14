// Reels hablados (9:16): voz en off, subtítulos grandes y una metáfora animada.
// Uso: node reel-voz.js <slug> [en|es…] [--vista] [--escena=N] [--sin-voz]
// --escena=N saca 8 fotogramas repartidos por la escena N (para revisar una animación).
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
// reel.arranque = 'lleno': fotograma 0 completo (1.ª escena, texto de arriba y 1.ª frase ya visibles),
// porque los datos dicen que la gente se va en los primeros segundos. reel.inicio: cuándo empieza la voz.
// reel.suelo: suelo común a 900 px de la escena (1190 en pantalla) que llena la parte de abajo.
// reel.tres (función): coreografía 3D sobre el mundo de reels-voz/tres.js (maniquíes); reel.fijo: capa fija (HUD);
// reel.sub = { max, largo }: tamaño de los golpes de subtítulo.
// reel.cola: segundos de plano tras la última frase (por defecto COLA). reel.corte2d = 'seco': la capa 2D de la escena
// que sale desaparece en el mismo fotograma del corte (sin el fundido de FUNDIDO s encima de la escena siguiente).
// T[lang].retencion: texto fijo arriba que deja una curiosidad pendiente (sube la
// retención); se oculta en la última escena (el cierre).
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

// Palabras de una frase (sin [etiquetas]; *resaltadas*) y marcas § («§» o «§{sonido}») con la palabra a la que preceden.
function partes(texto) {
  const limpio = texto.replace(/\[[^\]]*\]\s*/g, '');
  const palabras = [], marcas = [];
  let resaltada = false;
  // Se separa por § para saber delante de qué palabra va cada marca.
  const trozosM = limpio.split(/§(?:\{(\w*)\})?/);
  for (let i = 0; i < trozosM.length; i += 2) {
    for (const p of trozosM[i].split(/\s+/).filter(Boolean)) {
      const abre = p.startsWith('*'), cierra = p.replace(/[.,!?¿¡:;»”"…]+$/, '').endsWith('*');
      if (abre) resaltada = true;
      const txt = p.replace(/\*/g, '');
      if (txt) palabras.push({ txt, res: resaltada });
      if (cierra) resaltada = false;
    }
    if (i + 1 < trozosM.length) marcas.push({ idx: palabras.length, sonido: trozosM[i + 1] || null });
  }
  return { palabras, marcas };
}

// Tiempos de cada palabra dentro de su toma: alineados con la voz (alinear.py) o, si no se puede, por su largo.
function tiemposPalabras(voces, frases, lang) {
  const spec = path.join(__dirname, 'cache-voz', `.alinear-${process.pid}.json`);
  const clips = frases.map((p, i) => ({ archivo: voces[i].archivo, palabras: p.palabras.map(w => w.txt) })).filter((c, i) => voces[i].real);
  let ok = false;
  if (clips.length) {
    fs.writeFileSync(spec, JSON.stringify({ idioma: lang, modelo: process.env.WHISPER_MODELO || 'small', clips }));
    try { execFileSync(process.env.WHISPER_PY || 'python3', [path.join(__dirname, 'alinear.py'), spec], { stdio: ['ignore', 'inherit', 'inherit'] }); ok = true; }
    catch (e) { console.log(`· sin alineación con la voz (${e.status === 3 ? 'falta faster-whisper: define WHISPER_PY' : e.message.split('\n')[0]}): reparto por largo`); }
    fs.rmSync(spec, { force: true });
  }
  return frases.map((p, i) => {
    const j = voces[i].archivo + '.palabras.json';
    if (ok && voces[i].real && fs.existsSync(j)) { const t = JSON.parse(fs.readFileSync(j, 'utf8')); if (t.length === p.palabras.length) return t; }
    const peso = p.palabras.map(w => w.txt.length + 1.5), suma = peso.reduce((a, b) => a + b, 0) || 1;
    let t = 0.05; const dur = voces[i].dur - 0.1;
    return peso.map(x => { const d = dur * x / suma, r = [t, t + d * 0.92]; t += d; return r; });
  });
}

// Golpes de subtítulo de 1–3 palabras (cortando en la puntuación), con el momento de cada palabra.
function golpes(p, tiempos, ini, finFrase, op = {}) {
  const maxPal = op.max || 3, maxLargo = op.largo || 13;
  const out = [];
  let g = [];
  p.palabras.forEach((w, k) => {
    g.push({ txt: w.txt, res: w.res, ini: ini + tiempos[k][0], fin: ini + tiempos[k][1] });
    const largo = g.map(x => x.txt).join(' ').length;
    if (largo >= maxLargo || /[.,!?:;…»”]$/.test(w.txt) || g.length === maxPal) { out.push(g); g = []; }
  });
  if (g.length) out.push(g);
  return out.map((ws, i) => ({ ini: ws[0].ini, fin: i < out.length - 1 ? out[i + 1][0].ini : finFrase, palabras: ws }));
}

function linea(reel, lang, voces) {
  const t = reel.T[lang];
  const ps = t.guion.map(([, texto]) => partes(texto));
  const tiempos = tiemposPalabras(voces, ps, lang);
  let tt = reel.inicio != null ? reel.inicio : INICIO;
  const sonidos = [];
  const frases = t.guion.map(([esc, texto], i) => {
    if (i > 0 && esc !== t.guion[i - 1][0]) tt += CAMBIO;
    const p = ps[i], tw = tiempos[i];
    // Marcas §: el momento en que empieza la palabra que sigue (o el final de la frase).
    const marcas = p.marcas.map(m => {
      const at = tt + (m.idx < tw.length ? tw[m.idx][0] : voces[i].dur);
      if (m.sonido) sonidos.push({ sonido: m.sonido, t: at });
      return at;
    });
    const f = { esc, texto, ini: tt, dur: voces[i].dur, marcas, p, tw };
    tt += voces[i].dur + PAUSA;
    return f;
  });
  const total = frases[frases.length - 1].ini + frases[frases.length - 1].dur + (reel.cola != null ? reel.cola : COLA);
  const escenas = reel.escenas.map((_, k) => {
    const fs_ = frases.filter(f => f.esc === k);
    return { ini: k === 0 ? 0 : fs_[0].ini - 0.25, seg: fs_ };
  });
  escenas.forEach((e, k) => {
    e.fin = k < escenas.length - 1 ? escenas[k + 1].ini + FUNDIDO : total;
    e.seg = e.seg.map(f => ({ ini: f.ini - e.ini, dur: f.dur, marcas: f.marcas.map(m => m - e.ini) }));
    // Cambio de escena: «whoosh» (salvo que el Reel diga otra cosa).
    const s_ = (reel.sonidos || {}).escena === undefined ? 'whoosh' : reel.sonidos.escena;
    if (k > 0 && s_) sonidos.push({ sonido: s_, t: Math.max(0, e.ini - 0.12) });
  });
  const subs = frases.flatMap(f => golpes(f.p, f.tw, f.ini, f.ini + f.dur + 0.12, reel.sub));
  return { frases, escenas, subs, total, sonidos };
}

function pagina(reel, lang, L) {
  const t = reel.T[lang];
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><style>${css(F)}
    .escena { position: absolute; left: 0; right: 0; top: 290px; height: 900px; padding: 0 ${F.lado}px; }
    .arriba .firma { font-size: 24px; color: ${C.suave}; }
    #sub { position: absolute; left: 60px; right: 60px; top: 1215px; height: 270px; display: flex; align-items: center; justify-content: center; text-align: center;
      font-size: 80px; line-height: 1.12; font-weight: 900; letter-spacing: -.025em; color: #fff; text-shadow: 0 4px 22px rgba(0,0,0,.55); }
    #sub .w { display: inline-block; padding: 0 10px; margin: 2px -1px; border-radius: 16px; transition: none; }
    #sub .w.c { color: ${C.acento}; }
    #sub .w.luego { opacity: .5; }
    #sub .w.act { background: ${C.acento}; color: #0b1222; text-shadow: none; }
    #retencion { position: absolute; left: 60px; right: 60px; top: 150px; text-align: center; }
    #retencion span.caja { display: inline-block; background: rgba(15,23,42,.82); border: 2px solid rgba(94,234,212,.4); border-radius: 22px; padding: 14px 28px;
      font-size: 44px; line-height: 1.15; font-weight: 800; letter-spacing: -.01em; color: #fff; }
    #retencion .c { color: ${C.acento}; }
    h1 { font-size: ${F.h1}px; }
    ${reel.css || ''}
  </style></head><body>
  ${reel.cabecera ? `<div class="pag"><div class="arriba"><span class="kicker">${t.kicker}</span>${firma()}</div></div>` : ''}
  ${reel.tres ? '<canvas id="c3d" style="position:absolute;left:0;top:0;width:1080px;height:1920px"></canvas><div class="vin"></div>' : ''}
  ${reel.suelo ? `<div style="position:absolute;left:0;right:0;top:1190px;bottom:0;background:linear-gradient(#131c30,#0b1222);border-top:4px solid #24324d"></div>` : ''}
  ${reel.escenas.map((e, i) => `<div class="escena" data-n="${i}">${e.html(t, lang)}</div>`).join('')}
  <div id="sub"></div>
  ${reel.fijo ? reel.fijo(t, lang) : ''}
  ${t.retencion ? `<div id="retencion"><span class="caja">${t.retencion}</span></div>` : ''}
  ${reel.tres ? `<script src="file://${path.join(__dirname, 'node_modules/three/build/three.min.js')}"></script>` : ''}
  <script>
  const LANG = ${JSON.stringify(lang)}, D = ${JSON.stringify(reel.datos ? reel.datos(lang) : {})};
  const ESC = ${JSON.stringify(L.escenas.map(e => ({ ini: e.ini, fin: e.fin, seg: e.seg })))};
  const SUB = ${JSON.stringify(L.subs)};
  const FUND = ${FUNDIDO}, LLENO = ${reel.arranque === 'lleno'}, SECO = ${reel.corte2d === 'seco'};
  const tramo = (t, a, b) => Math.min(1, Math.max(0, (t - a) / (b - a)));
  const sale = (x) => 1 - Math.pow(1 - x, 3);
  const rebote = (x) => { const c = 1.70158, d = c + 1; return x <= 0 ? 0 : x >= 1 ? 1 : 1 + d * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
  const lerp = (a, b, p) => a + (b - a) * p;
  const dinero = (n) => { const e = String(Math.round(Math.abs(n))).replace(/\\B(?=(\\d{3})+(?!\\d))/g, LANG === 'en' ? ',' : '.'); return (n < 0 ? '−' : '') + (LANG === 'en' ? '$' + e : e + '\\u00a0€'); };
  ${reel.script || ''}
  const ANIM = [${reel.escenas.map(e => (e.anim ? e.anim.toString() : 'null')).join(',\n')}];
  const TRES = ${typeof reel.tres === 'function' ? reel.tres.toString() : 'null'};   // coreografía 3D: (t, k, s, e, W3)
  const nodos = [...document.querySelectorAll('.escena')], sub = document.getElementById('sub');
  let subActual = -1;
  function pintar(t) {
    nodos.forEach((el, i) => {
      const e = ESC[i], ultima = i === nodos.length - 1;
      const op = Math.min(i === 0 ? 1 : tramo(t, e.ini, e.ini + FUND), ultima ? 1 : SECO ? (t >= ESC[i + 1].ini ? 0 : 1) : 1 - tramo(t, e.fin - FUND, e.fin));
      el.style.opacity = op; el.style.visibility = op > 0 ? 'visible' : 'hidden';
      if (op <= 0) return;
      const s = t - e.ini;
      el.querySelectorAll('.a').forEach((a, k) => {
        const p = LLENO && i === 0 ? 1 : sale(tramo(s, 0.15 + k * 0.3, 0.7 + k * 0.3));   // arranque lleno: la 1.ª escena ya está entera
        a.style.opacity = p; a.style.transform = 'translateY(' + ((1 - p) * 30) + 'px)';
      });
      if (ANIM[i]) ANIM[i](s, e, el);
    });
    // Mundo 3D (reels-voz/tres.js): un solo plano por escena, con corte seco; después, la capa fija (reloj…).
    if (TRES && typeof W3 !== 'undefined') { let k = 0; ESC.forEach((e, i) => { if (t >= e.ini) k = i; }); W3.fotograma(t, k, t - ESC[k].ini, ESC[k], TRES); }
    if (typeof alPintar === 'function') alPintar(t);
    const ret = document.getElementById('retencion');
    if (ret) ret.style.opacity = Math.min(LLENO ? 1 : tramo(t, 0.15, 0.55), 1 - tramo(t, ESC[ESC.length - 1].ini, ESC[ESC.length - 1].ini + FUND));
    // Subtítulos palabra a palabra: el golpe entero a la vista, la palabra que suena resaltada y las que vienen, más tenues.
    let k = SUB.findIndex(x => t >= x.ini - 0.04 && t < x.fin);
    if (LLENO && k < 0 && t < SUB[0].ini) k = 0;   // la primera frase ya se lee en el fotograma 0
    if (k !== subActual) {
      sub.innerHTML = k >= 0 ? '<div>' + SUB[k].palabras.map(w => '<span class="w' + (w.res ? ' c' : '') + '">' + w.txt + '</span>').join(' ') + '</div>' : '';
      subActual = k;
    }
    if (k >= 0) {
      const g = SUB[k], ws = sub.querySelectorAll('.w');
      g.palabras.forEach((w, j) => {
        const sig = j < g.palabras.length - 1 ? g.palabras[j + 1].ini : g.fin;
        ws[j].classList.toggle('act', t >= w.ini - 0.03 && t < sig - 0.03 && !(LLENO && k === 0 && t < g.ini));
        ws[j].classList.toggle('luego', t < w.ini - 0.03 && !(LLENO && k === 0 && t < g.ini));
      });
      const p = LLENO && k === 0 && t <= g.ini + 0.15 ? 1 : rebote(tramo(t, g.ini - 0.04, g.ini + 0.12));
      sub.style.transform = 'scale(' + (0.88 + 0.12 * p) + ')'; sub.style.opacity = Math.min(1, p * 1.6);
    }
  }
  </script></body></html>`;
}

async function grabar(browser, reel, lang, op) {
  const { vista, sinVoz } = op;
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
  if (op.escena != null) {
    const e = L.escenas[op.escena];
    for (let i = 0; i < 8; i++) {
      await page.evaluate((x) => pintar(x), e.ini + (e.fin - e.ini) * (i + 0.5) / 8);
      await page.screenshot({ path: path.join(dir, `vista-escena${op.escena}-${i + 1}.jpg`), type: 'jpeg', quality: 80 });
    }
    await page.close(); fs.unlinkSync(tmp);
    return { total: L.total, real };
  }
  if (vista) {
    // Un fotograma al final de cada frase y otro al final del vídeo.
    const momentos = [0, ...L.frases.map(f => f.ini + f.dur * 0.6), L.total - 0.05];   // el 1.º es el fotograma 0 (el arranque)
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
  // Datos para programar: duración y el momento de la portada (Instagram la toma de ese fotograma).
  fs.writeFileSync(path.join(dir, 'meta.json'), JSON.stringify({ slug: reel.slug, cuenta: lang, total: +L.total.toFixed(2), portada_ms: Math.round((L.frases[0].ini + L.frases[0].dur - 0.1) * 1000),
    tema: (t.titulo || t.guion[0][1]).replace(/<[^>]+>/g, '').replace(/\[[^\]]*\]\s*/g, '').replace(/[*§]|\{\w*\}/g, '').trim() }));
  execFileSync('python3', [path.join(__dirname, 'musica.py'), String(L.total), musica]);
  // Efectos de sonido (sfx.py, se generan una vez en cache-voz/).
  const dirSfx = path.join(__dirname, 'cache-voz');
  if (!fs.existsSync(path.join(dirSfx, 'sfx-whoosh.wav'))) execFileSync('python3', [path.join(__dirname, 'sfx.py'), dirSfx]);
  const VOL = { whoosh: 0.32, pop: 0.38, ding: 0.3, caja: 0.42, tic: 0.3 };
  const sonidos = L.sonidos.filter(x => VOL[x.sonido] != null).map(x => ({ archivo: path.join(dirSfx, `sfx-${x.sonido}.wav`), ini: x.t, vol: VOL[x.sonido] }));
  fs.writeFileSync(spec, JSON.stringify({ total: L.total, musica, salida: audio, frases: L.frases.map((f, i) => ({ archivo: voces[i].archivo, ini: f.ini })), sonidos }));
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
  const reel = require('./reels-voz/cargar.js')(args[0]);
  const idiomas = args.filter(a => ['en', 'es'].includes(a));
  const esc = args.find(a => a.startsWith('--escena='));
  const op = { vista: args.includes('--vista'), sinVoz: args.includes('--sin-voz'), escena: esc ? +esc.split('=')[1] : null };
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });   // WebGL por software para las escenas 3D
  for (const lang of idiomas.length ? idiomas : Object.keys(reel.T)) {   // cada Reel puede ser de una sola cuenta
    const ini = Date.now();
    const { total, real } = await grabar(browser, reel, lang, op);
    console.log(`✓ ${reel.slug} ${lang}: ${total.toFixed(1)} s ${real ? 'con voz' : '(sin voz: duraciones estimadas)'} (${((Date.now() - ini) / 1000).toFixed(0)} s)`);
  }
  await browser.close();
})().catch(e => { console.error(e.response?.data?.error?.message || e); process.exit(1); });
