// Biblioteca de escenas para hacer píldoras en serie con la misma calidad (muñecos a pantalla completa).
// Cada plantilla devuelve una escena { html, anim } para reel-voz.js. Regla común: cada § del guion de esa escena
// revela el siguiente elemento (1.ª marca → 1.er elemento…); si faltan marcas, se reparten por la escena.
// Los parámetros viajan en un <script type="application/json" class="cfg"> porque anim se ejecuta en la página.
//
//   gancho({ titulo, objeto, burbuja })      1.ª escena, entera en el fotograma 0: título, objeto y muñeco que reacciona
//   versus({ titulo, izq, der, fuente })      dos muñecos con su cartel; cada uno enseña su valor en su marca
//   barras({ titulo, fuente, items })         hasta 4 barras que crecen (valor, texto, color)
//   contador({ titulo, hasta, prefijo, sufijo, tarro })  número que cuenta hasta un valor y tarro que se llena
//   sello({ texto, fuente, objeto })          sello del concepto con un objeto y el muñeco pensando
//   lista({ titulo, items })                  hasta 4 tarjetas numeradas que aparecen una a una
//   mito({ mito, realidad })                  tarjeta «mito» tachada y tarjeta «realidad» con ✓
//   linea({ titulo, puntos, desde, hasta, destacar, unidad })  gráfica que se dibuja con un punto destacado
//   pregunta({ texto, opciones })             pregunta grande con dos opciones (de acuerdo / no)
// Objetos (para gancho y sello): { tipo: 'cartel'|'etiqueta'|'tarro'|'tarjeta'|'billete'|'recibo', … }
const { C, CSS, muneco, SCRIPT_MUNECO } = require('./_comun');
const { nube } = require('./precio-999.js').piezas;

const ROJO = '#e66767', AMBAR = '#c27c0e', VIOLETA = '#7c6cf0';
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const cfg = (o) => `<script type="application/json" class="cfg">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`;
const tam = (txt, base, ancho) => Math.min(base, Math.floor(ancho / Math.max(1, String(txt).length) * 1.75));
const SVG = (cuerpo) => `<svg viewBox="0 0 1080 1250" width="1080" height="1250" style="position:absolute;left:0;top:0;overflow:visible;font-family:Inter,sans-serif">${cuerpo}</svg>`;
const SUELO = 900, CADERA = (k) => SUELO - 142 * k - 12;

// ——— objetos (origen: centro abajo, apoyados en el suelo o colgados) ———
function objeto(o = {}) {
  const t = o.texto || '';
  switch (o.tipo) {
    case 'etiqueta': return `<g><line x1="0" y1="-430" x2="0" y2="-340" stroke="#64748b" stroke-width="5"/>
      <rect x="-250" y="-340" width="500" height="340" rx="30" fill="#f1f5f9"/><circle cx="0" cy="-310" r="13" fill="${C.fondo}"/>
      <text x="-205" y="-228" font-size="36" font-weight="800" fill="#64748b">${esc(o.antesTxt || (o.lang === 'en' ? 'WAS' : 'ANTES'))}</text>
      <text x="210" y="-218" text-anchor="end" font-size="84" font-weight="900" fill="#475569" letter-spacing="-2">${esc(o.antes)}</text>
      <line x1="-10" y1="-247" x2="218" y2="-247" stroke="${ROJO}" stroke-width="12" stroke-linecap="round"/>
      <text x="-205" y="-140" font-size="36" font-weight="800" fill="#0f766e">${esc(o.ahoraTxt || (o.lang === 'en' ? 'NOW' : 'AHORA'))}</text>
      <text x="210" y="-35" text-anchor="end" font-size="128" font-weight="900" fill="#0f9f8f" letter-spacing="-4">${esc(o.ahora)}</text></g>`;
    case 'tarro': return `<g><defs><clipPath id="clip-t${o.id || 0}"><rect x="-105" y="-230" width="210" height="228" rx="38"/></clipPath></defs>
      <rect x="-77" y="-262" width="154" height="34" rx="10" fill="#33415c"/>
      <g clip-path="url(#clip-t${o.id || 0})"><rect class="nivel" x="-105" y="${-40 - 110 * (o.nivel ?? 0.7)}" width="210" height="260" fill="${C.necesidades}"/>
        ${[[-55, -118], [0, -128], [55, -116], [-28, -86], [30, -88], [-60, -60], [5, -55], [60, -58]].map(([cx, cy]) => `<circle cx="${cx}" cy="${cy}" r="20" fill="#e9c46a" stroke="#b8902e" stroke-width="4"/>`).join('')}</g>
      <rect x="-105" y="-230" width="210" height="228" rx="38" fill="none" stroke="${C.acento}" stroke-width="8"/>
      ${t ? `<rect x="-95" y="-205" width="190" height="62" rx="14" fill="#f1f5f9"/><text x="0" y="-160" text-anchor="middle" font-size="${tam(t, 42, 170)}" font-weight="900" fill="#0f766e">${esc(t)}</text>` : ''}</g>`;
    case 'tarjeta': return `<g transform="translate(0,-260)"><rect x="-200" y="-125" width="400" height="250" rx="26" fill="${o.color || VIOLETA}"/>
      <rect x="-200" y="-72" width="400" height="46" fill="#0b1222" opacity=".55"/><rect x="-160" y="0" width="72" height="54" rx="10" fill="#e9c46a"/>
      <text x="168" y="92" text-anchor="end" font-size="${tam(t, 52, 320)}" font-weight="900" fill="#fff">${esc(t)}</text></g>`;
    case 'billete': return `<g transform="translate(0,-230)"><rect x="-230" y="-110" width="460" height="220" rx="18" fill="#2f9e6e" stroke="#1d6b49" stroke-width="8"/>
      <rect x="-200" y="-82" width="400" height="164" rx="12" fill="none" stroke="#bfe8d4" stroke-width="4"/><ellipse cx="0" cy="0" rx="160" ry="62" fill="#bfe8d4"/>
      <text x="0" y="22" text-anchor="middle" font-size="${tam(t, 64, 280)}" font-weight="900" fill="#1d6b49">${esc(t)}</text></g>`;
    case 'recibo': {
      const lineas = o.lineas || [], h = 120 + lineas.length * 58 + 90;
      return `<g transform="translate(0,${-h - 30})"><path d="M-200 0 H200 V${h} l-25 18 l-25 -18 l-25 18 l-25 -18 l-25 18 l-25 -18 l-25 18 l-25 -18 l-25 18 l-25 -18 l-25 18 l-25 -18 l-25 18 l-25 -18 l-25 18 l-25 -18 Z" fill="#f8fafc"/>
        <text x="0" y="62" text-anchor="middle" font-size="34" font-weight="900" fill="#0f172a" letter-spacing="3">${esc(o.titulo || (o.lang === 'en' ? 'RECEIPT' : 'TICKET'))}</text>
        ${lineas.map(([a, b], i) => `<text x="-170" y="${132 + i * 58}" font-size="32" font-weight="700" fill="#334155">${esc(a)}</text><text x="170" y="${132 + i * 58}" text-anchor="end" font-size="32" font-weight="800" fill="#0f172a">${esc(b)}</text>`).join('')}
        <line x1="-170" y1="${110 + lineas.length * 58}" x2="170" y2="${110 + lineas.length * 58}" stroke="#94a3b8" stroke-width="3" stroke-dasharray="10 8"/>
        <text x="-170" y="${168 + lineas.length * 58}" font-size="38" font-weight="900" fill="#0f172a">TOTAL</text><text x="170" y="${168 + lineas.length * 58}" text-anchor="end" font-size="44" font-weight="900" fill="#0f9f8f">${esc(o.total || '')}</text></g>`;
    }
    case 'cartel':
    default: return `<g><rect x="-13" y="-320" width="26" height="320" fill="#33415c"/>
      <rect x="-230" y="-560" width="460" height="260" rx="26" fill="#0b1222" stroke="#33415c" stroke-width="6"/>
      <rect x="-230" y="-560" width="460" height="62" rx="26" fill="${o.color || C.necesidades}"/><rect x="-230" y="-520" width="460" height="22" fill="${o.color || C.necesidades}"/>
      <text x="0" y="-516" text-anchor="middle" font-size="32" font-weight="900" fill="#fff" letter-spacing="2">${esc(o.cabecera || '')}</text>
      <text x="0" y="-372" text-anchor="middle" font-size="${tam(t, 110, 400)}" font-weight="900" fill="#fbbf24" letter-spacing="-2">${esc(t)}</text></g>`;
  }
}

// ——— funciones de página comunes (van en reel.script) ———
const SCRIPT = SCRIPT_MUNECO + `
POSES.alegre = { pa: -10, pb: 10, pa2: 4, pb2: -4, ba: -150, ba2: -20, bb: 150, bb2: 18, y: -6 };
POSES.senala = { pa: -6, pb: 8, pa2: 0, pb2: 0, ba: -88, ba2: -4, bb: 10, bb2: -12, y: 0 };
function cfgDe(el) { return JSON.parse(el.querySelector('.cfg').textContent); }
// Momento del paso k de n: la k-ésima marca § de la escena o, si no hay, repartido por la escena.
function pasoDe(e, k, n) {
  const M = e.seg.flatMap(x => x.marcas);
  if (M[k] != null) return M[k];
  const u = e.seg.length ? e.seg[e.seg.length - 1].ini + e.seg[e.seg.length - 1].dur : 3;
  return 0.3 + (u - 0.3) * (k + 1) / (n + 1);
}
function aparece(nodo, p, modo) {
  if (!nodo) return;
  const q = Math.min(1, p * 1.4);
  if (nodo instanceof SVGElement) nodo.setAttribute('opacity', q); else nodo.style.opacity = q;
  if (modo === 'pop') { const b = nodo.getBBox ? nodo.getBBox() : null; if (b) { const cx = b.x + b.width / 2, cy = b.y + b.height / 2; nodo.setAttribute('transform', 'translate(' + cx + ',' + cy + ') scale(' + (0.6 + 0.4 * p) + ') translate(' + (-cx) + ',' + (-cy) + ')'); } else nodo.style.transform = 'scale(' + (0.6 + 0.4 * p) + ')'; }
  if (modo === 'sube') { if (nodo instanceof SVGElement) nodo.setAttribute('transform', 'translate(0,' + (1 - p) * 40 + ')'); else nodo.style.transform = 'translateY(' + (1 - p) * 40 + 'px)'; }
}
function selloAnim(st, s, m) { const q = rebote(tramo(s, m, m + 0.45)); st.style.opacity = Math.min(1, q * 1.5); st.style.transform = 'rotate(-3deg) scale(' + (1.8 - 0.8 * q) + ')'; }
`;

const CSS_P = CSS + `
  .escena { height: 1250px; }
  .sello-top { position: absolute; left: 0; right: 0; top: 10px; text-align: center; }
  .tit-esc { font-size: 46px; font-weight: 850; color: #f1f5f9; letter-spacing: -.01em; line-height: 1.12; padding: 0 30px; }
  .fuente-esc { font-size: 28px; color: ${C.suave}; font-weight: 700; margin-bottom: 8px; }
  .tarj { position: absolute; left: 330px; right: 40px; background: #151f33; border: 3px solid #24324d; border-radius: 26px; padding: 22px 26px 22px 96px; font-size: 40px; font-weight: 800; line-height: 1.15; color: #f1f5f9; opacity: 0; }
  .tarj .num { position: absolute; left: 20px; top: 50%; transform: translateY(-50%); width: 58px; height: 58px; border-radius: 50%; background: ${C.acento}; color: #0b1222; font-size: 34px; font-weight: 900; display: grid; place-items: center; }
  .mito-c { position: absolute; left: 60px; right: 250px; border-radius: 30px; padding: 30px 34px; font-size: 46px; font-weight: 850; line-height: 1.15; opacity: 0; }
  .mito-c small { display: block; font-size: 28px; letter-spacing: .12em; text-transform: uppercase; margin-bottom: 8px; font-weight: 900; }
  .opc { position: absolute; width: 380px; top: 640px; border-radius: 26px; padding: 26px; text-align: center; font-size: 46px; font-weight: 900; opacity: 0; }
`;

// 1 · Gancho: entero en el fotograma 0 (arranque lleno); el muñeco pasa de pensar a reaccionar en la 1.ª marca.
const gancho = ({ titulo, objeto: ob = {}, burbuja, reaccion = 'alegre', x = 720 }) => ({
  html: (t, lang) => `<div class="gancho" style="position:relative"><h1 class="a">${titulo}</h1></div>
    ${SVG(`<g class="obj" transform="translate(${x},${SUELO})">${objeto({ ...ob, lang })}</g>
      ${muneco(220, 660, 1.6, '', 'm1')}
      ${burbuja ? `${nube('nb', 380, 330, 120, 64)}<text class="nbt" x="380" y="346" text-anchor="middle" font-size="${tam(burbuja, 40, 210)}" font-weight="900" fill="#0f9f8f" opacity="0">${esc(burbuja)}</text>` : ''}`)}
    ${cfg({ reaccion, x })}`,
  anim: function (s, e, el) {
    const c = cfgDe(el), m = pasoDe(e, 0, 2), m2 = pasoDe(e, 1, 2);
    el.querySelector('.obj').setAttribute('transform', 'translate(' + c.x + ',900) rotate(' + (Math.sin(s * 2) * 1.5) + ' 0 -300)');
    const r = sale(tramo(s, m - 0.2, m + 0.3)), P = mezclaPose(POSES.pensando, POSES[c.reaccion] || POSES.alegre, r);
    P.y = (P.y || 0) - (c.reaccion === 'alegre' ? Math.abs(Math.sin(s * 7)) * 8 * r : 0); posar(el.querySelector('.m1'), P);
    const n = rebote(tramo(s, m2 - 0.1, m2 + 0.3));
    ['.nb', '.nbt'].forEach(q => { const nd = el.querySelector(q); if (nd) nd.setAttribute('opacity', Math.min(1, n * 1.4)); });
  }
});

// 2 · Versus: dos muñecos con cartel; el izquierdo enseña su valor en la 1.ª marca y el derecho en la 2.ª.
const versus = ({ titulo, fuente, izq, der }) => ({
  html: () => `<div class="sello-top">${fuente ? `<div class="fuente-esc">${fuente}</div>` : ''}${titulo ? `<div class="tit-esc">${titulo}</div>` : ''}</div>
    ${SVG(`${[[izq, 270, 'A'], [der, 810, 'B']].map(([o, x, k]) => `${muneco(x, CADERA(1.3), 1.3, '', 'm' + k)}
      <g class="c${k}" opacity="0"><line x1="0" y1="0" x2="0" y2="-36" stroke="#94a3b8" stroke-width="8"/>
        <rect x="-170" y="-200" width="340" height="164" rx="22" fill="#f1f5f9" stroke="${o.color || C.acento}" stroke-width="6"/>
        <text x="0" y="-150" text-anchor="middle" font-size="${tam(o.etiqueta, 34, 300)}" font-weight="800" fill="#475569">${esc(o.etiqueta)}</text>
        <text x="0" y="-70" text-anchor="middle" font-size="${tam(o.valor, 72, 300)}" font-weight="900" fill="${o.color === ROJO ? '#b91c1c' : '#0f766e'}">${esc(o.valor)}</text></g>`).join('')}`)}`,
  anim: function (s, e, el) {
    ['A', 'B'].forEach((k, i) => {
      const m = pasoDe(e, i, 2), up = sale(tramo(s, m - 0.35, m + 0.05)), g = el.querySelector('.m' + k);
      const P = mezclaPose(POSES.pie, POSES.cartel, up); P.y = -Math.abs(Math.sin(s * 6 + i)) * 6 * up; posar(g, P);
      const [hx, hy] = mano(g, P, 'a'), ca = el.querySelector('.c' + k);
      ca.setAttribute('opacity', up); ca.setAttribute('transform', 'translate(' + hx + ',' + hy + ') rotate(' + (Math.sin(s * 5 + i) * 4) + ') scale(' + (0.7 + 0.3 * rebote(tramo(s, m - 0.1, m + 0.35))) + ')');
    });
  }
});

// 3 · Barras: crecen una a una (en su marca); el muñeco se encoge con la última.
const barras = ({ titulo, fuente, items, max }) => {
  const tope = max || Math.max(...items.map(x => x.valor)) * 1.1, n = items.length, ancho = Math.min(190, 640 / n - 30);
  return {
    html: () => `<div class="sello-top">${fuente ? `<div class="fuente-esc">${fuente}</div>` : ''}${titulo ? `<div class="tit-esc">${titulo}</div>` : ''}</div>
      ${SVG(`${items.map((x, i) => { const cx = 360 + i * (640 / n) + (640 / n) / 2; return `<g class="b b${i}" data-h="${(560 * x.valor / tope).toFixed(1)}" data-cx="${cx}">
        <rect x="${cx - ancho / 2}" y="${SUELO}" width="${ancho}" height="0" rx="14" fill="${x.color || [C.necesidades, AMBAR, VIOLETA, '#3987e5'][i % 4]}"/>
        <text class="v" x="${cx}" y="${SUELO}" text-anchor="middle" font-size="${tam(x.texto || x.valor, 54, ancho + 60)}" font-weight="900" fill="#f1f5f9" opacity="0">${esc(x.texto || x.valor)}</text>
        <text x="${cx}" y="${SUELO + 46}" text-anchor="middle" font-size="${tam(x.etiqueta, 28, ancho + 70)}" font-weight="700" fill="#94a3b8">${esc(x.etiqueta)}</text></g>`; }).join('')}
        ${muneco(170, CADERA(1.3), 1.3, '', 'm1')}`)}
      ${cfg({ n })}`,
    anim: function (s, e, el) {
      const c = cfgDe(el);
      for (let i = 0; i < c.n; i++) {
        const g = el.querySelector('.b' + i), m = pasoDe(e, i, c.n), p = sale(tramo(s, m - 0.15, m + 0.55)), h = +g.dataset.h * p;
        const r = g.querySelector('rect'); r.setAttribute('y', 900 - h); r.setAttribute('height', h);
        const v = g.querySelector('.v'); v.setAttribute('y', 900 - h - 18); v.setAttribute('opacity', p);
      }
      const ult = pasoDe(e, c.n - 1, c.n);
      posar(el.querySelector('.m1'), mezclaPose(POSES.senala, POSES.encoge, sale(tramo(s, ult, ult + 0.5))));
    }
  };
};

// 4 · Contador: el número sube hasta «hasta» en la 1.ª marca (o al final) y el tarro se llena; monedas cayendo.
const contador = ({ titulo, hasta, desde = 0, prefijo = '', sufijo = '', tarro, sep = '.' }) => ({
  html: () => `<div class="sello-top">${titulo ? `<div class="tit-esc">${titulo}</div>` : ''}</div>
    ${SVG(`<g class="tr" transform="translate(700,${SUELO}) scale(1.25)">${objeto({ tipo: 'tarro', texto: tarro || '', nivel: 0.05, id: 'c' })}</g>
      ${Array.from({ length: 6 }, (_, i) => `<g class="mon mon-${i}" opacity="0"><circle r="30" fill="#e9c46a" stroke="#b8902e" stroke-width="5"/><text y="11" text-anchor="middle" font-size="30" font-weight="900" fill="#8a6a1f">${esc((prefijo || sufijo).trim().slice(0, 1) || '€')}</text></g>`).join('')}
      <text class="cuenta" x="700" y="330" text-anchor="middle" font-size="110" font-weight="900" fill="#f1f5f9">${esc(prefijo)}0${esc(sufijo)}</text>
      ${muneco(230, 660, 1.5, '', 'm1')}`)}
    ${cfg({ hasta, desde, prefijo, sufijo, sep })}`,
  anim: function (s, e, el) {
    const c = cfgDe(el), M = e.seg.flatMap(x => x.marcas), fin = M.length ? M[M.length - 1] : pasoDe(e, 0, 1);
    const p = tramo(s, 0.2, fin);
    for (let i = 0; i < 6; i++) { const q = tramo(p, i / 6, i / 6 + 0.25), g = el.querySelector('.mon-' + i);
      g.setAttribute('opacity', q > 0 && q < 1 ? 1 : 0); g.setAttribute('transform', 'translate(' + (680 + (i % 3) * 20) + ',' + lerp(380, 700, q * q) + ')'); }
    const v = s >= fin ? c.hasta : c.desde + (c.hasta - c.desde) * sale(p), paso = Math.abs(c.hasta) >= 1000 ? 10 : 1;
    const txt = String(Math.round(v / paso) * paso).replace(/\B(?=(\d{3})+(?!\d))/g, c.sep);
    const t = el.querySelector('.cuenta'); t.textContent = c.prefijo + txt + c.sufijo; t.setAttribute('fill', s >= fin ? '#5eead4' : '#f1f5f9');
    el.querySelector('.tr .nivel').setAttribute('y', lerp(-45, -150, sale(p)));
    posar(el.querySelector('.m1'), s >= fin ? POSES.alegre : mezclaPose(POSES.pie, POSES.cartel, 0.35 * Math.abs(Math.sin(s * 3))));
  }
});

// 5 · Sello: el nombre del concepto cae como un sello en la 1.ª marca; objeto a la derecha y muñeco pensando.
const sello = ({ texto, fuente, objeto: ob, frase }) => ({
  html: (t, lang) => `<div class="sello-top"><div class="sello" style="opacity:0;font-size:${texto.length > 20 ? 48 : 58}px">${texto}</div>${fuente ? `<div class="fuente-esc" style="margin-top:12px;opacity:0" data-f="1">${fuente}</div>` : ''}</div>
    ${SVG(`${ob ? `<g transform="translate(720,${SUELO}) scale(.85)">${objeto({ ...ob, lang })}</g>` : ''}${muneco(ob ? 230 : 860, 660, 1.6, '', 'm1')}`)}
    ${frase ? `<div class="frase-grande" style="position:absolute;${ob ? 'left:60px;right:60px;top:560px' : 'left:60px;right:300px;top:320px;text-align:left'};opacity:0" data-fr="1">${frase}</div>` : ''}`,
  anim: function (s, e, el) {
    const m = pasoDe(e, 0, 2), m2 = pasoDe(e, 1, 2);
    selloAnim(el.querySelector('.sello'), s, m);
    const f = el.querySelector('[data-f]'); if (f) f.style.opacity = tramo(s, m + 0.4, m + 0.9);
    const fr = el.querySelector('[data-fr]'); if (fr) aparece(fr, sale(tramo(s, m2 - 0.1, m2 + 0.4)), 'sube');
    posar(el.querySelector('.m1'), mezclaPose(POSES.pie, POSES.pensando, sale(tramo(s, 0.1, 0.6))));
  }
});

// 6 · Lista: tarjetas numeradas que entran una a una; el muñeco señala.
const lista = ({ titulo, items }) => ({
  html: () => `<div class="sello-top">${titulo ? `<div class="tit-esc">${titulo}</div>` : ''}</div>
    ${items.map((x, i) => `<div class="tarj t${i}" style="top:${200 + i * (640 / items.length)}px"><span class="num">${i + 1}</span>${x}</div>`).join('')}
    ${SVG(muneco(160, CADERA(1.4), 1.4, '', 'm1'))}${cfg({ n: items.length })}`,
  anim: function (s, e, el) {
    const c = cfgDe(el);
    for (let i = 0; i < c.n; i++) { const m = pasoDe(e, i, c.n), p = sale(tramo(s, m - 0.15, m + 0.35)), t = el.querySelector('.t' + i);
      t.style.opacity = p; t.style.transform = 'translateX(' + (1 - p) * 120 + 'px)'; t.style.borderColor = s >= m && (i === c.n - 1 || s < pasoDe(e, i + 1, c.n)) ? '#5eead4' : '#24324d'; }
    const P = mezclaPose(POSES.pie, POSES.senala, sale(tramo(s, 0.1, 0.5))); P.y = -Math.abs(Math.sin(s * 4)) * 4; posar(el.querySelector('.m1'), P);
  }
});

// 7 · Mito o realidad: la tarjeta del mito se tacha en la 1.ª marca y aparece la realidad con ✓ en la 2.ª.
const mito = ({ mito: mt, realidad, lang = 'es' }) => ({
  html: () => `<div class="mito-c cm" style="top:120px;background:rgba(230,103,103,.12);border:4px solid ${ROJO};color:#fecaca"><small style="color:${ROJO}">${lang === 'en' ? 'Myth' : 'Mito'}</small>${mt}
      <svg class="x" viewBox="0 0 100 100" preserveAspectRatio="none" style="position:absolute;inset:0;width:100%;height:100%;opacity:0"><line x1="4" y1="8" x2="96" y2="92" stroke="${ROJO}" stroke-width="3"/><line x1="96" y1="8" x2="4" y2="92" stroke="${ROJO}" stroke-width="3"/></svg></div>
    <div class="mito-c cr" style="top:470px;background:rgba(94,234,212,.1);border:4px solid ${C.acento};color:#f1f5f9"><small style="color:${C.acento}">${lang === 'en' ? 'Reality ✓' : 'Realidad ✓'}</small>${realidad}</div>
    ${SVG(muneco(900, CADERA(1.2), 1.2, '', 'm1'))}`,
  anim: function (s, e, el) {
    const m = pasoDe(e, 0, 2), m2 = pasoDe(e, 1, 2);
    aparece(el.querySelector('.cm'), sale(tramo(s, 0.05, 0.45)), 'sube');
    el.querySelector('.x').style.opacity = tramo(s, m, m + 0.25);
    aparece(el.querySelector('.cr'), sale(tramo(s, m2 - 0.1, m2 + 0.4)), 'sube');
    posar(el.querySelector('.m1'), mezclaPose(POSES.encoge, POSES.alegre, sale(tramo(s, m2, m2 + 0.4))));
  }
});

// 8 · Línea: gráfica que se dibuja; el punto «destacar» se marca en la 1.ª marca; muñeco con cartel a la derecha.
const linea = ({ titulo, fuente, puntos, desde, hasta, destacar, etiqueta, unidad = '' }) => {
  const x0 = 90, x1 = 800, yb = 760, yt = 330, mx = Math.max(...puntos), mn = Math.min(0, ...puntos);
  const X = (i) => x0 + (x1 - x0) * i / (puntos.length - 1), Y = (v) => yb - (yb - yt) * (v - mn) / ((mx - mn) || 1);
  const d = puntos.map((v, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)} ${Y(v).toFixed(1)}`).join(' ');
  const k = destacar ?? puntos.length - 1;
  return {
    html: () => `<div class="sello-top">${fuente ? `<div class="fuente-esc">${fuente}</div>` : ''}${titulo ? `<div class="tit-esc">${titulo}</div>` : ''}</div>
      ${SVG(`<line x1="${x0}" y1="${yb}" x2="${x1}" y2="${yb}" stroke="#33415c" stroke-width="4"/>
        <text x="${x0}" y="${yb + 44}" font-size="28" font-weight="700" fill="#94a3b8">${esc(desde || '')}</text><text x="${x1}" y="${yb + 44}" text-anchor="end" font-size="28" font-weight="700" fill="#94a3b8">${esc(hasta || '')}</text>
        <path class="ln" d="${d}" fill="none" stroke="#f1f5f9" stroke-width="8" stroke-linejoin="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>
        <g class="pt" opacity="0"><circle cx="${X(k)}" cy="${Y(puntos[k])}" r="18" fill="${C.acento}"/><text x="${Math.min(X(k), 700)}" y="${Y(puntos[k]) - 34}" text-anchor="middle" font-size="46" font-weight="900" fill="#5eead4">${esc(etiqueta || puntos[k] + unidad)}</text></g>
        ${muneco(960, CADERA(1.15), 1.15, '', 'm1')}`)}`,
    anim: function (s, e, el) {
      const m = pasoDe(e, 0, 1);
      el.querySelector('.ln').setAttribute('stroke-dashoffset', 1 - sale(tramo(s, 0.1, Math.max(0.6, m - 0.1))));
      aparece(el.querySelector('.pt'), rebote(tramo(s, m - 0.1, m + 0.3)));
      posar(el.querySelector('.m1'), mezclaPose(POSES.pie, POSES.senala, sale(tramo(s, m - 0.3, m))));
    }
  };
};

// 9 · Pregunta: frase grande y dos opciones que aparecen en sus marcas (para «¿de acuerdo o no?»).
const pregunta = ({ texto, opciones = [] }) => ({
  html: () => `<div class="frase-grande a" style="margin-top:20px">${texto}</div>
    ${opciones.map((o, i) => `<div class="opc o${i}" style="left:${i ? 600 : 100}px;background:${i ? 'rgba(230,103,103,.15)' : 'rgba(94,234,212,.12)'};border:4px solid ${i ? ROJO : C.acento};color:#f1f5f9">${o}</div>`).join('')}
    ${SVG(muneco(540, 690, 1.0, '', 'm1'))}${cfg({ n: opciones.length })}`,
  anim: function (s, e, el) {
    const c = cfgDe(el);
    for (let i = 0; i < c.n; i++) { const m = pasoDe(e, i, c.n); aparece(el.querySelector('.o' + i), rebote(tramo(s, m - 0.1, m + 0.35)), 'pop'); }
    posar(el.querySelector('.m1'), mezclaPose(POSES.pie, POSES.encoge, 0.5 + 0.5 * Math.sin(s * 2)));
  }
});

// Base de una píldora hecha con plantillas: arranque lleno, suelo, voz oficial y estilos/escenas comunes.
const pildora = (o) => ({ arranque: 'lleno', inicio: 0.1, suelo: true, voz: require('./_comun').VOZ, script: SCRIPT, css: CSS_P, datos: () => ({}), ...o });

module.exports = { pildora, gancho, versus, barras, contador, sello, lista, mito, linea, pregunta, objeto, SCRIPT, CSS: CSS_P, ROJO, AMBAR, VIOLETA };
