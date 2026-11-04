// Vídeo para Reels/Stories (9:16) y feed (4:5) a partir de las capturas reales.
// Uso: node video.js [idioma…]   (por defecto en y es)
// Salida: out/<idioma>/video-9x16.mp4 y out/<idioma>/video-4x5.mp4
// Cada fotograma se pinta en Chromium (pintar(t)) y se envía a ffmpeg por una
// tubería: no se guardan imágenes intermedias.
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const { RAIZ, portatil, movil, tarjeta, chip, COLOCAR, LOGO, cssBase } = require('./comun');

const FPS = 30;
const DURACION = 16;   // segundos
const FORMATOS = {
  '9x16': { w: 1080, h: 1920, pad: [230, 64, 330, 64], titulo: 96, sub: 34 },
  '4x5': { w: 1080, h: 1350, pad: [60, 64, 64, 64], titulo: 80, sub: 30 }
};

const TXT = {
  en: {
    gancho: ['Your', 'money,', '<em>finally</em>', '<em>clear.</em>'],
    escenas: ['All your money.<br><em>One dashboard.</em>', 'Is your money<br><em>actually healthy?</em>', 'Watch your<br><em>net worth grow.</em>', 'Plan smarter with<br><em>6 pro calculators.</em>'],
    final: ['Start your free<br><em>15-day trial.</em>', 'No credit card required'],
    cta: 'Try FinanziApp free →', ejemplo: 'Mortgage: +$200/mo → 6 years sooner', sincro: 'Synced on all your devices'
  },
  es: {
    gancho: ['Tu', 'dinero,', '<em>por fin</em>', '<em>claro.</em>'],
    escenas: ['Todo tu dinero.<br><em>Un solo panel.</em>', '¿Tus finanzas<br><em>están sanas?</em>', 'Mira crecer<br><em>tu patrimonio.</em>', 'Decide mejor con<br><em>6 calculadoras pro.</em>'],
    final: ['Pruébala gratis<br><em>15 días.</em>', 'Sin tarjeta de crédito'],
    cta: 'Prueba FinanziApp gratis →', ejemplo: 'Hipoteca: +200 €/mes → 6 años antes', sincro: 'Sincronizado en todos tus dispositivos'
  }
};

// Escenas: [inicio, fin] en segundos y piezas (con data-anim para la animación).
const TIEMPOS = { gancho: [0, 2.6], s1: [2.4, 5.8], s2: [5.6, 8.6], s3: [8.4, 11.2], s4: [11, 13.8], final: [13.6, DURACION] };

const escenaHTML = (lang, t, fmt) => {
  const alto = fmt === '9x16';
  const anim = (html, a) => html.replace(/^(\s*<div class="[^"]+")/, `$1 data-anim="${a}"`);
  return `
    <div class="escena" data-escena="s1">
      ${anim(portatil(lang, 'd-dashboard.png', { x: .03, y: .5, ay: 'c', w: alto ? .9 : .8, h: .92, rot: 6 }), 'subir')}
      ${anim(movil(lang, 'm-dashboard.png', { x: .97, y: .5, ax: 'r', ay: 'c', w: .34, h: alto ? .9 : 1 }), 'derecha:0.35')}
      ${anim(chip('✓ ' + t.sincro, { x: .05, y: .97, ay: 'b' }), 'aparecer:0.9')}
    </div>
    <div class="escena" data-escena="s2">
      ${anim(tarjeta(lang, 'w-kpis.png', { x: .5, y: alto ? .05 : 0, ax: 'c', w: .94, h: .2 }), 'subir')}
      ${anim(tarjeta(lang, 'w-salud.png', { x: .5, y: alto ? .27 : .22, ax: 'c', w: .94, h: .32, z: 3 }), 'zoom:0.25')}
      ${anim(tarjeta(lang, 'w-ahorro-acumulado.png', { x: .03, y: alto ? .95 : 1, ay: 'b', w: .46, h: .42 }), 'revelar:0.55')}
      ${anim(tarjeta(lang, 'w-objetivo.png', { x: .97, y: alto ? .95 : 1, ax: 'r', ay: 'b', w: .46, h: .42 }), 'subir:0.7')}
    </div>
    <div class="escena" data-escena="s3">
      ${anim(tarjeta(lang, 'w-patrimonio.png', { x: .02, y: .02, w: .66, h: .56, rot: -2 }), 'revelar')}
      ${anim(tarjeta(lang, 'w-prestamos.png', { x: .05, y: .98, ay: 'b', w: .58, h: .42, rot: 1.5 }), 'subir:0.45')}
      ${anim(movil(lang, 'm-patrimonio.png', { x: .97, y: .5, ax: 'r', ay: 'c', w: .34, h: alto ? .9 : 1 }), 'derecha:0.25')}
    </div>
    <div class="escena" data-escena="s4">
      ${anim(tarjeta(lang, 'w-calc-compuesto-grafico.png', { x: .5, y: 0, ax: 'c', w: .94, h: .38 }), 'revelar')}
      ${anim(portatil(lang, 'd-calc-hipoteca.png', { x: .5, y: alto ? .97 : 1, ax: 'c', ay: 'b', w: .9, h: .58, recorte: [0.167, 0.07, 1, 0.815] }), 'subir:0.4')}
      ${anim(chip(t.ejemplo, { x: .5, y: alto ? .405 : .4, ax: 'c', ay: 'c', color: '#10b981', z: 8 }), 'aparecer:1.1')}
    </div>
    <div class="escena" data-escena="final">
      ${anim(movil(lang, 'm-dashboard.png', alto ? { x: .5, y: -.2, ax: 'c', w: .42, h: .62, rot: -4 } : { x: .5, y: -.25, ax: 'c', w: .42, h: .74, rot: -4 }), 'subir:0.2')}
    </div>`;
};

const pagina = (lang, fmt) => {
  const F = FORMATOS[fmt];
  const t = TXT[lang];
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><style>
  ${cssBase(F, fmt)}
  .lienzo { padding-bottom: ${F.pad[2]}px; }
  .titulos { position: relative; height: ${Math.round(F.titulo * 2.15 + 30)}px; margin-top: 34px; }
  .titulos h1 { position: absolute; left: 0; right: 0; top: 0; margin: 0; }
  .escenario { margin-top: 36px; }
  .escena { position: absolute; inset: 0; }
  .gancho { position: absolute; left: ${F.pad[1]}px; right: ${F.pad[1]}px; top: 50%; transform: translateY(-50%); font-family: 'Inter Display', 'Inter'; font-weight: 900;
    font-size: ${Math.round(F.titulo * 1.55)}px; line-height: 1.0; letter-spacing: -.04em; }
  .gancho span { display: inline-block; margin-right: .22em; }
  .gancho em, .final em { font-style: normal; background: linear-gradient(90deg, #2dd4bf, #38bdf8); -webkit-background-clip: text; background-clip: text; color: transparent; }
  .final-txt { position: absolute; left: ${F.pad[1]}px; right: ${F.pad[1]}px; bottom: ${F.pad[2] + 24}px; text-align: center; }
  .final-txt h2 { font-family: 'Inter Display', 'Inter'; font-size: ${Math.round(F.titulo * 1.05)}px; font-weight: 900; line-height: 1.02; letter-spacing: -.035em; }
  .final-txt .cta { margin-top: 38px; display: inline-flex; align-items: center; padding: 28px 54px; border-radius: 999px; font-size: ${fmt === '9x16' ? 38 : 34}px; font-weight: 800;
    color: #04111c; background: linear-gradient(90deg, #2dd4bf, #22d3ee); box-shadow: 0 22px 50px rgba(45,212,191,.4); white-space: nowrap; }
  .final-txt .nota { text-align: center; margin-top: 22px; font-size: 24px; color: #94a3b8; font-weight: 600; line-height: 1.45; }
  .final-txt .nota b { display: block; color: #e2e8f0; font-size: 27px; }
  .marca-final { position: absolute; left: 0; right: 0; top: ${F.pad[0] + 10}px; display: flex; justify-content: center; }
  .marca-final .icono { width: 84px; height: 84px; border-radius: 24px; }
  .marca-final .icono svg { width: 48px; height: 48px; }
  .marca-final .marca { font-size: 52px; }
  </style></head><body><div class="rejilla"></div>
  <div class="lienzo" id="principal">
    <div class="cabecera">${LOGO}<span class="web">finanziapp.com</span></div>
    <div class="titulos">${t.escenas.map((h, i) => `<h1 data-titulo="s${i + 1}">${h}</h1>`).join('')}</div>
    <div class="escenario">${escenaHTML(lang, t, fmt)}</div>
  </div>
  <div class="gancho" id="gancho">${t.gancho.map(p => `<span>${p}</span>`).join('')}</div>
  <div id="final" style="position:absolute;inset:0">
    <div class="marca-final">${LOGO}</div>
    <div class="final-txt"><h2>${t.final[0]}</h2><div class="cta">${t.cta}</div><div class="nota"><b>${t.final[1]}</b>finanziapp.com</div></div>
  </div>
  <script>${COLOCAR}
  const T = ${JSON.stringify(TIEMPOS)};
  const sale = (x) => 1 - Math.pow(1 - x, 3);                 // easeOutCubic
  const entra = (x) => x * x * x;                              // easeInCubic
  const tramo = (t, a, b) => Math.min(1, Math.max(0, (t - a) / (b - a)));
  function vida(t, [a, b], dentro = 0.55, fuera = 0.35) {      // 0→1 al entrar, 1→0 al salir
    return sale(tramo(t, a, a + dentro)) * (1 - entra(tramo(t, b - fuera, b)));
  }
  function pintar(t) {
    // Gancho: palabra a palabra
    const g = document.getElementById('gancho');
    const vg = 1 - entra(tramo(t, T.gancho[1] - 0.35, T.gancho[1]));
    [...g.children].forEach((s, i) => {
      const p = sale(tramo(t, 0.15 + i * 0.32, 0.65 + i * 0.32));
      s.style.opacity = p * vg; s.style.translate = '0 ' + ((1 - p) * 60) + 'px';
      s.style.filter = 'blur(' + ((1 - p) * 10) + 'px)';
    });
    // Cabecera y títulos: visibles durante las escenas 1-4
    const vp = vida(t, [T.s1[0], T.s4[1]], 0.5, 0.4);
    document.querySelector('.cabecera').style.opacity = vp;
    document.querySelectorAll('[data-titulo]').forEach(h => {
      const v = vida(t, T[h.dataset.titulo], 0.5, 0.3);
      h.style.opacity = v; h.style.translate = '0 ' + ((1 - v) * 40) + 'px';
    });
    // Escenas
    document.querySelectorAll('[data-escena]').forEach(e => {
      const [a, b] = T[e.dataset.escena];
      const activa = t >= a - 0.01 && t <= b + 0.01;
      e.style.visibility = activa ? 'visible' : 'hidden';
      if (!activa) return;
      const salida = 1 - entra(tramo(t, b - 0.35, b));
      e.querySelectorAll('[data-anim]').forEach(el => {
        const [tipo, retardo = 0] = el.dataset.anim.split(':');
        const p = sale(tramo(t, a + +retardo, a + +retardo + 0.75));
        const lento = (t - a) / (b - a);                         // deriva suave durante la escena
        el.style.opacity = Math.min(p * 1.4, 1) * salida;
        el.style.clipPath = '';
        if (tipo === 'subir') { el.style.translate = '0 ' + ((1 - p) * 120 - lento * 18) + 'px'; el.style.scale = String(0.96 + 0.04 * p + 0.015 * lento); }
        else if (tipo === 'derecha') { el.style.translate = ((1 - p) * 260) + 'px ' + (-lento * 14) + 'px'; }
        else if (tipo === 'zoom') { el.style.scale = String(0.86 + 0.14 * p + 0.02 * lento); }
        else if (tipo === 'revelar') { el.style.opacity = salida; el.style.clipPath = 'inset(0 ' + ((1 - p) * 100) + '% 0 0 round 16px)'; el.style.translate = '0 ' + (-lento * 12) + 'px'; }
        else if (tipo === 'aparecer') { el.style.scale = String(0.8 + 0.2 * p); }
      });
    });
    // Cierre
    const f = document.getElementById('final');
    const pf = sale(tramo(t, T.final[0] + 0.1, T.final[0] + 0.8));
    f.style.opacity = pf;
    f.querySelector('.final-txt').style.translate = '0 ' + ((1 - pf) * 60) + 'px';
    const cta = f.querySelector('.cta');
    const pulso = t > T.final[0] + 1.2 ? 1 + 0.035 * Math.sin((t - T.final[0]) * 5) : 1;
    cta.style.scale = String(pulso);
  }
  </script></body></html>`;
};

async function grabar(browser, lang, fmt) {
  const F = FORMATOS[fmt];
  const salida = path.join(RAIZ, 'out', lang, `video-${fmt}.mp4`);
  fs.mkdirSync(path.dirname(salida), { recursive: true });
  const page = await browser.newPage({ viewport: { width: F.w, height: F.h }, deviceScaleFactor: 1 });
  const tmp = path.join(path.dirname(salida), `.video-${fmt}.html`);
  fs.writeFileSync(tmp, pagina(lang, fmt));
  await page.goto('file://' + tmp, { waitUntil: 'load' });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map(i => i.decode().catch(() => {})));
    colocar();
  });
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', String(FPS), '-movflags', '+faststart', salida]);
  let errorFF = '';
  ff.stderr.on('data', d => { errorFF += d; });
  const total = Math.round(DURACION * FPS);
  for (let i = 0; i < total; i++) {
    await page.evaluate((t) => pintar(t), i / FPS);
    const buf = await page.screenshot({ type: 'jpeg', quality: 95 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  }
  ff.stdin.end();
  await new Promise((ok, mal) => ff.on('close', c => (c === 0 ? ok() : mal(new Error('ffmpeg: ' + errorFF)))));
  await page.close();
  fs.unlinkSync(tmp);
  return salida;
}

(async () => {
  const idiomas = process.argv.slice(2).filter(a => TXT[a]);
  const formatos = process.argv.slice(2).filter(a => FORMATOS[a]);
  const browser = await chromium.launch();
  for (const lang of idiomas.length ? idiomas : ['en', 'es']) {
    for (const fmt of formatos.length ? formatos : Object.keys(FORMATOS)) {
      const inicio = Date.now();
      const f = await grabar(browser, lang, fmt);
      console.log(`✓ ${path.relative(RAIZ, f)} (${((Date.now() - inicio) / 1000).toFixed(0)} s)`);
    }
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
