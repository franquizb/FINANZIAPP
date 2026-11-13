#!/usr/bin/env node
/*
 * portada.js · Portada diseñada de un Reel («Titular grande»), para que en la
 * cuadrícula del perfil se entienda de qué va cada vídeo.
 *
 * Uso:
 *   node portada.js <slug> [es|en]   → out-reels/<slug>/<idioma>/portada-diseno.jpg (1080×1920, JPG 90)
 *   node portada.js <slug> --todas   → la de ese vídeo en todos los idiomas que tenga
 *   node portada.js --todas          → todas las de portadas.json (antes pasa las pruebas sintéticas)
 *   node portada.js --prueba         → solo las pruebas sintéticas (deja las imágenes en /tmp/portada-prueba)
 *
 * Los textos salen de portadas.json:
 *   { "<slug>": { "titulo": "…", "destacado": "palabra o cifra en color", "serie": "reto|hacemos-la-cuenta|
 *     money-explained|pildora", "dia": n, "fotograma_ms": n,
 *     opcionales: "color": "turq|rojo|ambar", "etiqueta": "TUS DERECHOS" (píldoras), "encuadre_y": px del vídeo
 *     donde empieza la escena visible, "zoom": n } }
 *   En el titulo, ~texto~ sale en gris tachado en rojo (mitos y correcciones: «Tu garantía dura ~2 años~ 3 años»).
 *   Si un vídeo no está en portadas.json, usa meta.json.tema como titular y avisa.
 *
 * Composición fija: firma de serie arriba (y=300), titular de hasta 3 líneas que se ajusta solo (tamaño base
 * 150 px, la línea del destacado ×1,5 si va sola, nunca por debajo de 110 px: si no cabe, falla y hay que
 * acortarlo) y debajo el fotograma del vídeo, colocado y fundido a partir de donde acaba el titular. Todo queda
 * dentro de la franja 3:4 que enseña la cuadrícula (y=240–1680). Un solo Chromium, portadas en serie.
 */
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const DIR = __dirname;
const REELS = path.join(DIR, 'out-reels');
const DATOS = path.join(DIR, 'portadas.json');
const FRANJA = [240, 1680];      // lo que enseña la cuadrícula del perfil (recorte 3:4)
const MARGEN = 40;               // aire mínimo dentro de la franja
const EXCLUIR = /^(es-contraste-vivienda-30b|muestras)/;

const SERIES = {
  'reto': { es: '30 días para ordenar tu dinero', en: '30 days to get your money in order' },
  'hacemos-la-cuenta': { es: 'Hacemos la cuenta', en: 'Doing the math', ico: '=' },
  'money-explained': { es: 'El dinero, explicado', en: 'Money, explained', ico: '?' },
  'pildora': { es: 'Dato', en: 'Money fact' },
};

// ---------------------------------------------------------------- plantilla
const HTML = `<!doctype html><html><head><meta charset="utf-8"><style>
:root{--tx:#f1f5f9;--sec:#94a3b8;--turq:#5eead4;--rojo:#f87171;--ambar:#f5b13d;--acc:var(--turq);--fondo:#0a1120}
html,body{margin:0;background:#000}
#c{position:relative;width:1080px;height:1920px;overflow:hidden;background:var(--fondo)}
#capa{position:absolute;inset:0;-webkit-mask-image:var(--mask);mask-image:var(--mask)}
#suelo{position:absolute;left:0;right:0;display:none}
#img{position:absolute;left:0;top:0;width:1080px;height:1920px;transform-origin:0 0;filter:var(--filtro)}
/* luz y viñeta encima de todo (también del fotograma), así no aparece ningún borde de recuadro */
#luz{position:absolute;inset:0;pointer-events:none;background:
  radial-gradient(110% 42% at 50% 24%,rgba(30,41,59,.42) 0%,rgba(30,41,59,0) 72%),
  radial-gradient(150% 78% at 50% 55%,rgba(0,0,0,0) 60%,rgba(3,6,14,.5) 100%)}
#firma{position:absolute;left:72px;right:72px;top:300px}
.fila{display:flex;align-items:center;gap:24px;height:88px}
.cap{display:inline-flex;align-items:center;gap:16px;height:88px;box-sizing:border-box;padding:0 32px;border-radius:44px;
  font-family:'Inter';font-weight:800;font-size:44px;letter-spacing:.03em;text-transform:uppercase;white-space:nowrap;line-height:1}
.cap.reto{background:var(--turq);color:#0a1120;font-family:'Inter Display','Inter';font-weight:900;font-size:60px;letter-spacing:0}
.cap.serie{background:var(--ambar);color:#0a1120;font-weight:900;padding-left:18px}
.cap.serie .ico{display:inline-grid;place-items:center;width:58px;height:58px;border-radius:50%;background:#0a1120;color:var(--ambar);font-size:42px}
.cap.pild{border:4px solid #94a3b8;color:#e2e8f0;background:rgba(10,17,32,.55)}
.nombre{font-family:'Inter';font-weight:800;font-size:27px;line-height:1.2;letter-spacing:.05em;text-transform:uppercase;color:#cbd5e1}
.barra{display:grid;grid-template-columns:repeat(30,1fr);gap:7px;height:16px;margin-top:18px}
.barra i{border-radius:3px;background:rgba(148,163,184,.3)}
.barra i.h{background:var(--turq)}
#h{position:absolute;left:72px;right:72px;top:var(--htop);font-family:'Inter Display','Inter';font-weight:900;color:var(--tx);
  letter-spacing:-.035em;line-height:.98;text-shadow:0 6px 30px rgba(4,8,16,.85),0 2px 4px rgba(4,8,16,.6)}
#h .l{display:block;white-space:nowrap}
.a{color:var(--acc)}
.u{font-size:.6em;letter-spacing:0}
.t{color:var(--sec);position:relative;display:inline-block}
.t::after{content:'';position:absolute;left:-.03em;right:-.03em;top:50%;height:.095em;background:var(--rojo);border-radius:.05em;transform:rotate(-7deg)}
</style></head><body>
<div id="c"><div id="capa"><div id="suelo"></div><img id="img" alt=""></div><div id="luz"></div><div id="firma"></div><div id="h"></div></div>
<script>
const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;');
const DEBILES = new Set(('de del la el los las a al y o e en con por para tu tus su sus un una que se te lo le mi ' +
  'the a an of to in on at and or your my for is it').split(' '));

// Parte el titular en palabras; el destacado y cada ~tachado~ son una sola pieza que no se corta.
function piezas(titulo, destacado) {
  const marcas = [];                      // [inicio, fin, tipo]
  const re = /~([^~]+)~/g; let m, limpio = '', ult = 0;
  while ((m = re.exec(titulo))) { limpio += titulo.slice(ult, m.index); marcas.push([limpio.length, limpio.length + m[1].length, 't']); limpio += m[1]; ult = m.index + m[0].length; }
  limpio += titulo.slice(ult);
  let avisoDest = '';
  if (destacado) {
    let i = -1, desde = 0;
    while ((i = limpio.indexOf(destacado, desde)) >= 0 && marcas.some(([a, b]) => i < b && i + destacado.length > a)) desde = i + 1;
    if (i >= 0) marcas.push([i, i + destacado.length, 'a']); else avisoDest = 'el destacado «' + destacado + '» no está en el titular';
  }
  const largoDest = !!destacado && destacado.length > 12;
  const tipo = k => (marcas.find(([a, b]) => k >= a && k < b) || [0, 0, 'n'])[2];
  const palabras = []; let cur = [];
  const meter = (ch, t) => { const u = cur[cur.length - 1]; if (u && u.t === t) u.s += ch; else cur.push({ s: ch, t }); };
  for (let k = 0; k < limpio.length; k++) {
    const ch = limpio[k], t = tipo(k);
    // se corta en los espacios normales; un destacado largo (más de 12 letras) también puede partirse,
    // pero nunca antes de un símbolo de unidad («−30 %», «400 €»)
    const corta = ch === ' ' && !/[%€¢]/.test(limpio[k + 1] || '') && (t === 'n' || (t === 'a' && largoDest));
    if (corta) { if (cur.length) palabras.push(cur); cur = []; }
    else meter(ch === ' ' ? '\\u00a0' : ch, t);
  }
  if (cur.length) palabras.push(cur);
  return { palabras: palabras.map(p => ({
    html: p.map(x => x.t === 'a' ? '<span class="a">' + esc(x.s).replace(/([%¢€$])/g, '<span class="u">$1</span>') + '</span>'
                  : x.t === 't' ? '<span class="t">' + esc(x.s) + '</span>' : esc(x.s)).join(''),
    txt: p.map(x => x.s).join('').replace(/\\u00a0/g, ' '),
    acc: p.some(x => x.t === 'a'), tach: p.some(x => x.t === 't'),
    accTxt: p.filter(x => x.t === 'a').map(x => x.s).join(''),
  })), avisoDest };
}

function composiciones(n, L) {          // todas las formas de repartir n palabras en L líneas
  const out = [];
  const rec = (ini, quedan, cortes) => {
    if (quedan === 1) { out.push([...cortes, n]); return; }
    for (let k = ini + 1; k <= n - quedan + 1; k++) rec(k, quedan - 1, [...cortes, k]);
  };
  if (L <= n) rec(0, L, []);
  return out;
}

window.pintar = async function (d) {
  const r = document.documentElement.style;
  r.setProperty('--acc', 'var(--' + (d.color || 'turq') + ')');
  await document.fonts.load('900 100px "Inter Display"'); await document.fonts.load('800 40px Inter'); await document.fonts.ready;

  // --- firma de serie
  const F = document.getElementById('firma');
  if (d.serie === 'reto') {
    const n = Math.max(1, Math.min(30, d.dia || 1));
    F.innerHTML = '<div class="fila"><span class="cap reto">' + esc(d.diaTxt) + '</span><span class="nombre">' + d.nombreHtml + '</span></div>' +
      '<div class="barra">' + Array.from({ length: 30 }, (_, i) => '<i' + (i < n ? ' class="h"' : '') + '></i>').join('') + '</div>';
  } else if (d.serie === 'hacemos-la-cuenta' || d.serie === 'money-explained') {
    F.innerHTML = '<div class="fila"><span class="cap serie"><span class="ico">' + d.ico + '</span>' + esc(d.nombre) + '</span></div>';
  } else {
    F.innerHTML = '<div class="fila"><span class="cap pild">' + esc(d.nombre) + '</span></div>';
  }
  const fr = F.getBoundingClientRect();
  if (fr.right > 1080 - 72 + 1) throw new Error('la firma no cabe de ancho');

  // --- titular: prueba todos los cortes en 1–3 líneas y se queda con el mejor
  const { palabras: P, avisoDest } = piezas(d.titulo, d.destacado);
  const H = document.getElementById('h');
  // se mide dentro del propio titular (mismos estilos heredados) a 100 px
  const M = document.createElement('span'); M.style.cssText = 'position:absolute;left:0;top:0;visibility:hidden;white-space:nowrap;font-size:100px';
  H.innerHTML = ''; H.appendChild(M);
  const W = H.clientWidth, BASE = d.base || 150, MIN = d.min || 110, MAXL = d.maxLineas || 3, LH = .98;
  const htop = 456; r.setProperty('--htop', htop + 'px');
  const ancho = {};
  const medir = (i, j) => { const k = i + ':' + j; if (!(k in ancho)) { M.innerHTML = P.slice(i, j).map(p => p.html).join(' '); ancho[k] = M.getBoundingClientRect().width; } return ancho[k]; };
  const limpiar = s => s.replace(/[¿?¡!,.:;«»"“”'’\\s]/g, '');
  let mejor = null;
  for (let L = 1; L <= Math.min(MAXL, P.length); L++) for (const cortes of composiciones(P.length, L)) {
    let ini = 0;
    const ls = cortes.map(fin => { const ws = P.slice(ini, fin); const l = { i: ini, j: fin, ws, w: medir(ini, fin) }; ini = fin; return l; });
    for (const l of ls) {
      const txt = l.ws.map(p => p.txt).join(' '), acc = l.ws.find(p => p.acc);
      l.solo = !!acc && l.ws.every(p => p.acc || p.tach) && l.ws.filter(p => p.acc).length === P.filter(p => p.acc).length;
      const entero = !!acc && l.ws.filter(p => p.acc).length === P.filter(p => p.acc).length;   // el destacado no se parte
      l.f = l.solo ? 1.5 : entero && limpiar(acc.accTxt).length / Math.max(1, limpiar(txt).length) >= .6 ? 1.25 : 1;
      l.fit = W * 100 / l.w; l.txt = txt;
    }
    const s = Math.min(BASE, ...ls.map(l => l.fit));
    if (s < MIN) continue;
    const sizes = ls.map(l => Math.floor(Math.min(s * l.f, l.fit)));
    const alto = sizes.reduce((a, b) => a + b, 0) * LH;
    if (htop + alto > FR1 - 160) continue;                   // deja sitio al fotograma
    const normales = ls.filter(l => l.f === 1).map(l => l.w * s / 100 / W);
    const media = normales.reduce((a, b) => a + b, 0) / Math.max(1, normales.length);
    const desv = normales.length > 1 ? Math.sqrt(normales.reduce((a, b) => a + (b - media) ** 2, 0) / normales.length) : 0;
    const debiles = ls.slice(0, -1).filter(l => DEBILES.has(l.ws[l.ws.length - 1].txt.toLowerCase().replace(/[,.:;]/g, ''))).length;
    // una frase que acaba a media línea y sigue la siguiente («pagas? ¿Cuál») se lee mal
    const mezcla = ls.filter(l => l.ws.slice(0, -1).some(p => /[?.:!]$/.test(p.txt))).length;
    const cortas = ls.filter(l => l.f === 1 && l.ws.length === 1 && limpiar(l.txt).length <= 4 && ls.length > 1).length;
    const score = s + (ls.some(l => l.solo) ? 22 : 0) - 70 * desv - 16 * debiles - 40 * mezcla - 10 * cortas
      - .25 * Math.max(0, alto - 540) - (L === 1 && P.length > 2 ? 15 : 0) - 3 * L;
    if (!mejor || score > mejor.score) mejor = { score, ls, sizes, s, alto };
  }
  if (!mejor) throw new Error('el titular no cabe en ' + MAXL + ' líneas a ' + MIN + ' px o más: acórtalo («' + d.titulo + '»)');
  H.innerHTML = mejor.ls.map((l, k) => '<span class="l" style="font-size:' + mejor.sizes[k] + 'px"><span>' + l.ws.map(p => p.html).join(' ') + '</span></span>').join('');
  await document.fonts.ready;
  // red de seguridad: si una línea pintada sale más ancha de lo medido, se ajusta y se avisa
  const anchos = [...H.children].map((el, k) => { const w = el.firstChild.getBoundingClientRect().width;
    if (w > W + 1) { mejor.sizes[k] = Math.floor(mejor.sizes[k] * W / w); el.style.fontSize = mejor.sizes[k] + 'px'; }
    return [Math.round(w), Math.round(mejor.ls[k].w * mejor.sizes[k] / 100)]; });
  const hr = H.getBoundingClientRect();
  const ultima = mejor.sizes[mejor.sizes.length - 1];
  const hb = hr.bottom + .1 * ultima;     // con el aire de los trazos que bajan (g, p, y)

  // --- fotograma: se coloca y se funde a partir de donde acaba el titular
  const img = document.getElementById('img');
  await new Promise((ok, ko) => { img.onload = ok; img.onerror = () => ko(new Error('no carga el fotograma')); img.src = d.frame; });
  const cv = document.createElement('canvas'); cv.width = 1080; cv.height = 1920;
  const cx = cv.getContext('2d'); cx.drawImage(img, 0, 0);
  const bri = d.tres ? .82 : .86;
  const Y0 = hb + 60;                      // donde empieza la escena visible
  let zoom, sTop, mask;
  const m0 = hb + 22, m1 = hb + 140;       // transparente hasta m0 (≥ 40 px bajo los trazos), opaco desde m1
  if (d.tres) {
    sTop = d.encuadre_y ?? 640; zoom = d.zoom ?? 1;
    mask = 'linear-gradient(to bottom,transparent ' + m0 + 'px,#000 ' + m1 + 'px,#000 100%)';
    r.setProperty('--fondo', '#0a1120');
  } else {
    // 2D: escena entre y≈520 (rótulos de arriba) y la línea del suelo (y≈1190); los subtítulos van en y≈1300–1400.
    sTop = d.encuadre_y ?? 520; const sBot = 1195;
    zoom = d.zoom ?? Math.max(.8, Math.min(1.15, (FR1 - 30 - Y0) / (sBot - sTop)));
    const map = y => Y0 + (y - sTop) * zoom;
    mask = 'linear-gradient(to bottom,transparent ' + m0 + 'px,#000 ' + m1 + 'px,#000 ' + map(1215) + 'px,transparent ' + map(1282) + 'px)';
    // fondo idéntico al del vídeo (con el mismo brillo) y el suelo alargado a todo el ancho:
    // el fotograma reducido no deja recuadro
    const rgb = (x, y) => { const p = cx.getImageData(x, y, 1, 1).data; return 'rgb(' + [0, 1, 2].map(k => Math.round(p[k] * bri)).join(',') + ')'; };
    r.setProperty('--fondo', rgb(10, 220));
    const su = document.getElementById('suelo');
    su.style.display = 'block'; su.style.top = map(1190) + 'px'; su.style.bottom = '0';
    su.style.background = 'linear-gradient(to bottom,' + rgb(10, 1192) + ' 0,' + rgb(10, 1192) + ' ' + Math.max(2, 4 * zoom) + 'px,' +
      rgb(10, 1215) + ' ' + Math.max(3, 5 * zoom) + 'px,' + rgb(10, 1280) + ' ' + (90 * zoom) + 'px)';
  }
  const tx = (1080 - 1080 * zoom) / 2, ty = Y0 - sTop * zoom;
  img.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scale(' + zoom + ')';
  r.setProperty('--mask', mask);
  r.setProperty('--filtro', 'blur(' + (d.tres ? .6 : 0) + 'px) brightness(' + bri + ') saturate(1.05)');
  await new Promise(ok => requestAnimationFrame(() => requestAnimationFrame(ok)));
  return {
    firma: [Math.round(fr.top), Math.round(fr.bottom)], top: Math.round(hr.top), bottom: Math.round(hr.bottom),
    lineas: mejor.ls.map((l, k) => mejor.sizes[k] + 'px «' + l.txt + '»'), s: Math.round(mejor.s), zoom: +zoom.toFixed(2),
    escena: Math.round(Y0), avisoDest, anchos,
  };
};
const FR1 = ${FRANJA[1]};
</script></body></html>`;

// ---------------------------------------------------------------- datos
function leerJSON(f) { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return null; } }

function esTres(slug) {
  try { return !!require('./reels-voz/cargar.js')(slug).tres; } catch (e) { return null; }
}

function idiomas(slug) {
  const d = path.join(REELS, slug);
  return ['es', 'en'].filter(l => fs.existsSync(path.join(d, l, 'reel.mp4')));
}

// Datos de una portada: portadas.json o, si falta, meta.json (tema) con aviso.
function datos(slug, lang, tabla) {
  const avisos = [];
  const dir = path.join(REELS, slug, lang);
  const meta = leerJSON(path.join(dir, 'meta.json')) || {};
  let p = tabla[slug];
  if (!p) {
    let tema = meta.tema;
    if (!tema && fs.existsSync(path.join(dir, 'texto.txt'))) tema = fs.readFileSync(path.join(dir, 'texto.txt'), 'utf8').split('\n')[0];
    if (!tema) throw new Error(slug + ': no está en portadas.json y no tiene meta.json');
    tema = tema.replace(/\s*[\u{1F300}-\u{1FAFF}☀-➿]️?/gu, '').trim();
    p = { titulo: tema, serie: 'pildora', relajado: true };
    const mr = tema.match(/^(?:D[ií]a|Day)\s+(\d+)\/30\s*·\s*(.*)$/i);
    if (mr) { p.serie = 'reto'; p.dia = +mr[1]; p.titulo = mr[2]; }
    p.fotograma_ms = meta.portada_ms;
    avisos.push('no está en portadas.json: uso meta.json.tema («' + p.titulo + '»); añádelo con un titular corto');
  }
  for (const k of ['titulo', 'serie']) if (!p[k]) throw new Error(slug + ': falta «' + k + '» en portadas.json');
  if (!SERIES[p.serie]) throw new Error(slug + ': serie desconocida «' + p.serie + '»');
  if (p.serie === 'reto' && !p.dia) throw new Error(slug + ': un reto necesita «dia»');
  const video = path.join(dir, 'reel.mp4');
  if (!fs.existsSync(video)) throw new Error(slug + ': no existe ' + video);
  let tres = p.tipo ? p.tipo === '3d' : esTres(slug);
  const S = SERIES[p.serie];
  const d = {
    titulo: p.titulo, destacado: p.destacado, serie: p.serie, dia: p.dia, color: p.color,
    encuadre_y: p.encuadre_y, zoom: p.zoom, tres,
    nombre: p.serie === 'pildora' ? (p.etiqueta || S[lang]) : S[lang], ico: S.ico,
    diaTxt: (lang === 'es' ? 'Día ' : 'Day ') + p.dia + '/30',
    nombreHtml: S[lang].replace(/^(\S+ \S+ \S+)\s/, '$1<br>'),
    ms: p.fotograma_ms, relajado: p.relajado,
  };
  if (p.relajado) Object.assign(d, { min: 90, maxLineas: 4 });
  return { d, video, avisos };
}

function fotograma(video, ms, tmp) {
  let t = ms != null ? ms / 1000 : null;
  if (t == null) {
    const dur = parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', video]).toString());
    t = dur * .4;
  }
  const out = path.join(tmp, 'f.png');
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-ss', t.toFixed(3), '-i', video, '-frames:v', '1', out]);
  return 'data:image/png;base64,' + fs.readFileSync(out).toString('base64');
}

// ---------------------------------------------------------------- render
async function abrir() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  return { browser, page };
}

async function render(page, d, frame, salida) {
  await page.setContent(HTML);
  if (d.tres == null) {                    // sin guion que lo diga: 3D si el fondo es casi negro
    d.tres = await page.evaluate(async src => {
      const i = new Image(); await new Promise(ok => { i.onload = ok; i.src = src; });
      const c = document.createElement('canvas'); c.width = 1080; c.height = 1920; const x = c.getContext('2d'); x.drawImage(i, 0, 0);
      const p = x.getImageData(10, 220, 1, 1).data; return p[2] < 30;
    }, frame);
  }
  const info = await page.evaluate(x => window.pintar(x), { ...d, frame });
  const fallos = [];
  if (info.firma[0] < FRANJA[0] + MARGEN) fallos.push('firma fuera de la franja');
  if (info.bottom > FRANJA[1] - MARGEN) fallos.push('titular fuera de la franja 3:4 (y=' + info.bottom + ')');
  if (FRANJA[1] - info.escena < 200) fallos.push('apenas queda fotograma en la cuadrícula');
  if (salida) await (await page.$('#c')).screenshot({ path: salida, type: 'jpeg', quality: 90 });
  return { info, fallos };
}

function linea(nombre, info) {
  return `${nombre}: titular y=${info.top}–${info.bottom}, escena desde y=${info.escena}, zoom ${info.zoom} · ${info.lineas.join(' / ')}`;
}

// Pruebas sintéticas: día 28, el titular español más largo del catálogo (2D), uno en inglés (3D) y uno imposible.
async function pruebas(page, tabla, guardar) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'portada-'));
  const out = path.join(os.tmpdir(), 'portada-prueba');
  if (guardar) fs.mkdirSync(out, { recursive: true });
  const marco3d = fotograma(path.join(REELS, 'es-reto-03', 'es', 'reel.mp4'), 1800, tmp);
  const marco2d = fotograma(path.join(REELS, 'es-garantia-3-anos', 'es', 'reel.mp4'), 1000, tmp);
  const largoEs = Object.entries(tabla).filter(([s]) => s.startsWith('es-')).map(([, p]) => p.titulo).sort((a, b) => b.length - a.length)[0]
    || 'El paquete grande no siempre sale más barato';
  const base = { nombre: 'Dato', nombreHtml: '30 días para<br>ordenar tu dinero', ico: '=' };
  const casos = [
    ['dia-28', { ...base, titulo: 'Revisa todas tus suscripciones del año', destacado: 'suscripciones', serie: 'reto', dia: 28, diaTxt: 'Día 28/30', tres: true }, marco3d],
    ['es-largo', { ...base, titulo: largoEs, serie: 'pildora', tres: false }, marco2d],
    ['en-3d', { ...base, nombre: 'Money, explained', titulo: 'Why every gas price ends in 9/10¢', destacado: '9/10¢', color: 'rojo', serie: 'money-explained', ico: '?', tres: true }, marco3d],
    ['tachado', { ...base, titulo: 'Tu garantía dura ~2 años~ 3 años', destacado: '3 años', serie: 'pildora', tres: false }, marco2d],
  ];
  let mal = 0;
  for (const [n, d, f] of casos) {
    try {
      const { info, fallos } = await render(page, d, f, guardar ? path.join(out, n + '.jpg') : null);
      console.log('  prueba ' + linea(n, info) + (fallos.length ? '  ✗ ' + fallos.join('; ') : '  ✓'));
      if (fallos.length) mal++;
    } catch (e) { console.log('  prueba ' + n + ': ✗ ' + e.message); mal++; }
  }
  try {   // un titular imposible tiene que fallar con un mensaje claro, no encogerse sin avisar
    await render(page, { ...base, titulo: 'Este titular es tan exageradamente largo que de ninguna manera debería caber en tres líneas a ciento diez píxeles', serie: 'pildora', tres: false }, marco2d, null);
    console.log('  prueba imposible: ✗ no ha fallado'); mal++;
  } catch (e) { console.log('  prueba imposible: ✓ falla como debe (' + e.message.slice(0, 60) + '…)'); }
  fs.rmSync(tmp, { recursive: true, force: true });
  if (guardar) console.log('  imágenes de prueba en ' + out);
  return mal;
}

(async () => {
  const args = process.argv.slice(2);
  const todas = args.includes('--todas'), prueba = args.includes('--prueba');
  const libres = args.filter(a => !a.startsWith('--'));
  const lang = libres.find(a => a === 'es' || a === 'en');
  const slug = libres.find(a => a !== 'es' && a !== 'en');
  const tabla = leerJSON(DATOS);
  if (!tabla) { console.error('No puedo leer ' + DATOS); process.exit(1); }
  delete tabla._leeme;
  if (!slug && !todas && !prueba) {
    console.error('Uso: node portada.js <slug> [es|en] [--todas]  ·  node portada.js --todas  ·  node portada.js --prueba');
    process.exit(1);
  }

  let trabajos = [];
  if (slug) {
    const ls = todas ? idiomas(slug) : [lang || (/^(es|en)-/.test(slug) ? slug.slice(0, 2) : idiomas(slug)[0])];
    if (!ls.length || !ls[0]) { console.error('No hay reel.mp4 en out-reels/' + slug); process.exit(1); }
    trabajos = ls.map(l => [slug, l]);
  } else if (todas) {
    trabajos = Object.keys(tabla).filter(s => !EXCLUIR.test(s)).map(s => [s, lang || (/^(es|en)-/.test(s) ? s.slice(0, 2) : idiomas(s)[0])]);
    const sin = fs.readdirSync(REELS).filter(s => /^(es|en)-/.test(s) && !EXCLUIR.test(s) && !tabla[s] && idiomas(s).length);
    if (sin.length) console.warn('Aviso: sin titular en portadas.json (no se generan): ' + sin.join(', '));
  }

  const { browser, page } = await abrir();
  let errores = 0;
  try {
    if (prueba || (todas && !slug)) {
      console.log('Pruebas sintéticas:');
      const mal = await pruebas(page, tabla, prueba);
      if (mal) { console.error(mal + ' prueba(s) fallida(s): no genero el lote'); process.exitCode = 1; return; }
    }
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'portada-'));
    for (const [s, l] of trabajos) {
      try {
        const { d, video, avisos } = datos(s, l, tabla);
        const frame = fotograma(video, d.ms, tmp);
        const salida = path.join(REELS, s, l, 'portada-diseno.jpg');
        const { info, fallos } = await render(page, d, frame, salida);
        if (info.avisoDest) avisos.push(info.avisoDest);
        console.log(linea(`${s}/${l}`, info));
        for (const a of avisos) console.warn('  aviso: ' + a);
        if (fallos.length) { errores++; console.error('  ✗ ' + fallos.join('; ')); }
      } catch (e) { errores++; console.error(`${s}/${l}: ✗ ${e.message}`); }
    }
    fs.rmSync(tmp, { recursive: true, force: true });
  } finally { await browser.close(); }
  if (errores) { console.error(errores + ' portada(s) con problemas'); process.exitCode = 1; }
  else if (trabajos.length) console.log(trabajos.length + ' portada(s) en out-reels/<slug>/<idioma>/portada-diseno.jpg');
})();
