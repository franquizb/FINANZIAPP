// Piezas compartidas por anuncios.js y video.js: marcos de portátil y móvil,
// tarjetas, chips, logotipo, estilos base y maquetación dentro del escenario.
const path = require('path');

const RAIZ = __dirname;

// ─── Piezas visuales ─────────────────────────────────────────────────────────
// Cada pieza ocupa una caja máxima dentro del escenario, en fracciones de su
// ancho (w) y alto (h); se escala para caber sin deformarse. (x, y) es el punto
// de anclaje: ax = l | c | r, ay = t | c | b. `recorte` = [x0, y0, x1, y1] en
// fracciones de la captura. colocar() (en la página) calcula los píxeles.
const img = (lang, f) => 'file://' + path.join(RAIZ, 'capturas', lang, f);
const datos = (o) => `data-x="${o.x}" data-y="${o.y}" data-w="${o.w}" data-h="${o.h || 9}" data-ax="${o.ax || 'l'}" data-ay="${o.ay || 't'}" data-recorte="${(o.recorte || [0, 0, 1, 1]).join(',')}"`;
const portatil = (lang, f, o) => `
  <div class="portatil" data-tipo="portatil" ${datos(o)} style="z-index:${o.z || 1};transform:perspective(2200px) rotateY(${o.rot || 0}deg)">
    <div class="barra"><i style="background:#f87171"></i><i style="background:#fbbf24"></i><i style="background:#34d399"></i><span class="url">🔒 finanziapp.com</span></div>
    <div class="vista"><img src="${img(lang, f)}"></div>
  </div>`;
const movil = (lang, f, o) => `
  <div class="movil" data-tipo="movil" ${datos(o)} style="z-index:${o.z || 3};transform:rotate(${o.rot || 0}deg)">
    <div class="estado"><b>9:41</b><span class="isla"></span><span class="iconos">▂▄▆ ◉ ▮</span></div>
    <div class="vista"><img src="${img(lang, f)}"></div>
  </div>`;
const tarjeta = (lang, f, o) => `
  <div class="tarjeta" data-tipo="tarjeta" ${datos(o)} style="z-index:${o.z || 2};transform:rotate(${o.rot || 0}deg)"><div class="vista"><img src="${img(lang, f)}"></div></div>`;
const chip = (texto, o) => `
  <div class="chip" ${datos({ w: 1, ...o })} style="z-index:${o.z || 6}"><span class="punto" style="background:${o.color || '#2dd4bf'}"></span>${texto}</div>`;

// Se ejecuta en la página: dimensiona y coloca cada pieza dentro del escenario.
const COLOCAR = `
  function colocar() {
    const st = document.querySelector('.escenario');
    const SW = st.clientWidth, SH = st.clientHeight;
    const MARCO = { portatil: [18, 43], movil: [22, 57], tarjeta: [0, 0] };
    document.querySelectorAll('.escenario [data-x]').forEach(el => {
      const [cw, ch] = MARCO[el.dataset.tipo] || [0, 0];
      const im = el.querySelector('img');
      let w, h;
      if (im) {
        const r = el.dataset.recorte.split(',').map(Number);
        const natW = im.naturalWidth * (r[2] - r[0]), natH = im.naturalHeight * (r[3] - r[1]);
        const asp = natW / natH;
        const iw = Math.min(+el.dataset.w * SW - cw, (+el.dataset.h * SH - ch) * asp);
        const ih = iw / asp, k = iw / natW;
        const vista = el.querySelector('.vista');
        vista.style.width = iw + 'px'; vista.style.height = ih + 'px';
        im.style.width = (im.naturalWidth * k) + 'px';
        im.style.marginLeft = -(r[0] * im.naturalWidth * k) + 'px';
        im.style.marginTop = -(r[1] * im.naturalHeight * k) + 'px';
        w = iw + cw; h = ih + ch;
        el.style.width = w + 'px';
      } else { w = el.offsetWidth; h = el.offsetHeight; }
      let x = +el.dataset.x * SW, y = +el.dataset.y * SH;
      if (el.dataset.ax === 'c') x -= w / 2; else if (el.dataset.ax === 'r') x -= w;
      if (el.dataset.ay === 'c') y -= h / 2; else if (el.dataset.ay === 'b') y -= h;
      el.style.left = x + 'px'; el.style.top = y + 'px';
    });
  }`;

const LOGO = `<div class="logo"><span class="icono"><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg></span><span class="marca">Finanzi<b>App</b></span></div>`;

// Estilos comunes. F = { w, h, pad, titulo, sub }; fmt = nombre del formato.
const cssBase = (F, fmt) => `
  * { box-sizing: border-box; margin: 0; }
  html, body { width: ${F.w}px; height: ${F.h}px; overflow: hidden; }
  body { font-family: 'Inter', sans-serif; color: #f8fafc; -webkit-font-smoothing: antialiased;
    background: radial-gradient(1100px 760px at 88% 6%, rgba(45,212,191,.24), transparent 62%),
                radial-gradient(900px 700px at -5% 96%, rgba(56,189,248,.20), transparent 60%),
                linear-gradient(180deg, #0a1120 0%, #0f172a 55%, #0b1324 100%); }
  .rejilla { position: absolute; inset: 0; background-image: linear-gradient(rgba(148,163,184,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,.07) 1px, transparent 1px);
    background-size: 54px 54px; -webkit-mask-image: radial-gradient(ellipse 70% 55% at 50% 45%, #000 20%, transparent 80%); }
  .lienzo { position: absolute; inset: 0; padding: ${F.pad.map(p => p + 'px').join(' ')}; display: flex; flex-direction: column; }
  .cabecera { display: flex; justify-content: space-between; align-items: center; }
  .logo { display: flex; align-items: center; gap: 14px; }
  .icono { width: 58px; height: 58px; border-radius: 16px; display: inline-flex; align-items: center; justify-content: center; color: #fff;
    background: linear-gradient(135deg, #2dd4bf, #14b8a6); box-shadow: 0 10px 30px rgba(45,212,191,.35); }
  .marca { font-family: 'Inter Display', 'Inter'; font-size: 36px; font-weight: 800; letter-spacing: -.02em; }
  .marca b { color: #2dd4bf; font-weight: 800; }
  .web { font-size: 22px; font-weight: 600; color: #94a3b8; }
  .kicker { align-self: flex-start; margin-top: ${fmt === 'carrusel-1x1' ? 34 : 46}px; padding: 10px 18px; border-radius: 999px; font-size: 19px; font-weight: 800;
    letter-spacing: .16em; color: #5eead4; background: rgba(45,212,191,.10); border: 1px solid rgba(45,212,191,.35); }
  .kicker:empty { display: none; }
  h1 { margin-top: 22px; font-family: 'Inter Display', 'Inter'; font-size: ${F.titulo}px; font-weight: 900; line-height: 1.02; letter-spacing: -.035em; }
  h1 em { font-style: normal; background: linear-gradient(90deg, #2dd4bf 0%, #38bdf8 100%); -webkit-background-clip: text; background-clip: text; color: transparent; }
  .sub { margin-top: 20px; font-size: ${F.sub}px; line-height: 1.38; color: #cbd5e1; max-width: 920px; font-weight: 500; }
  .escenario { position: relative; flex: 1; margin: 34px -${F.pad[1]}px 0; min-height: 0; }
  .portatil, .movil, .tarjeta, .chip { position: absolute; }
  .portatil { border-radius: 18px; background: #0b1020; padding: 34px 9px 9px; box-shadow: 0 50px 90px rgba(0,0,0,.6), 0 0 0 1px rgba(148,163,184,.22); transform-origin: left center; }
  .portatil .barra { position: absolute; top: 0; left: 0; right: 0; height: 34px; display: flex; align-items: center; gap: 8px; padding: 0 16px; }
  .portatil .barra i { width: 11px; height: 11px; border-radius: 50%; display: block; }
  .portatil .url { margin-left: 16px; width: 45%; height: 20px; border-radius: 6px; background: #1e293b; color: #94a3b8; font-size: 12px; display: flex; align-items: center; justify-content: center; }
  .vista { overflow: hidden; }
  .vista img { display: block; max-width: none; }
  .portatil .vista { border-radius: 8px; }
  .movil { border-radius: 52px; background: #04060b; padding: 0 11px 11px; box-shadow: 0 50px 90px rgba(0,0,0,.65), 0 0 0 2px #2a3446, inset 0 0 0 1px #111827; }
  .movil .estado { height: 46px; display: flex; align-items: center; justify-content: space-between; padding: 0 26px; color: #f8fafc; font-size: 15px; position: relative; }
  .movil .isla { position: absolute; left: 50%; top: 11px; transform: translateX(-50%); width: 32%; height: 25px; border-radius: 20px; background: #000; }
  .movil .iconos { font-size: 11px; letter-spacing: 2px; color: #e2e8f0; }
  .movil .vista { border-radius: 0 0 42px 42px; }
  .tarjeta { border-radius: 16px; overflow: hidden; box-shadow: 0 40px 80px rgba(0,0,0,.55), 0 0 0 1px rgba(148,163,184,.18); }
  .chip { display: inline-flex; align-items: center; gap: 12px; padding: 14px 22px; border-radius: 999px; font-size: 22px; font-weight: 700; color: #e2e8f0;
    background: rgba(15,23,42,.88); border: 1px solid rgba(148,163,184,.3); box-shadow: 0 20px 40px rgba(0,0,0,.45); backdrop-filter: blur(6px); }
  .chip .punto { width: 10px; height: 10px; border-radius: 50%; box-shadow: 0 0 12px currentColor; }
`;

module.exports = { RAIZ, img, portatil, movil, tarjeta, chip, COLOCAR, LOGO, cssBase };
