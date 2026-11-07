// Piezas comunes de los carruseles educativos: estilos editoriales (tranquilos,
// sin brillos), iconos de línea propios y gráficos sencillos.
// Paleta de las categorías validada para fondo oscuro y daltonismo
// (skill dataviz: validate_palette.js, todas las comprobaciones en verde).

const C = {
  fondo: '#0f172a', superficie: '#151f33', borde: 'rgba(148,163,184,.16)',
  tinta: '#f1f5f9', texto: '#cbd5e1', suave: '#94a3b8', acento: '#5eead4',
  necesidades: '#0f9f8f', caprichos: '#c27c0e', ahorro: '#7c6cf0'
};

// Iconos de línea (24×24, trazo redondeado). Dibujos propios.
const ICONOS = {
  casa: '<path d="M3 11 12 4l9 7"/><path d="M5.5 9.5V20h13V9.5"/><path d="M10 20v-5.5h4V20"/>',
  carro: '<path d="M3 4h2l2.4 11h10.4L20 7.5H6.1"/><circle cx="9.5" cy="19" r="1.4"/><circle cx="16.5" cy="19" r="1.4"/>',
  rayo: '<path d="M13 2.5 5 13.5h6.2L10 21.5l9-11.6h-6.3z"/>',
  escudo: '<path d="M12 3 19.5 6v5.6c0 4.4-3.1 8.1-7.5 9.4-4.4-1.3-7.5-5-7.5-9.4V6z"/><path d="m8.8 12.2 2.2 2.2 4.3-4.6"/>',
  coche: '<path d="M4 15.5 5.8 9.6A2 2 0 0 1 7.7 8.2h8.6a2 2 0 0 1 1.9 1.4l1.8 5.9"/><rect x="3" y="15" width="18" height="4.5" rx="1.6"/><circle cx="7.5" cy="19.5" r="1.3"/><circle cx="16.5" cy="19.5" r="1.3"/>',
  tarjeta: '<rect x="3" y="5.5" width="18" height="13" rx="2.2"/><path d="M3 10h18"/><path d="M6.5 14.5h4"/>',
  cubiertos: '<path d="M7 3v18"/><path d="M4.8 3v5.2a2.2 2.2 0 0 0 4.4 0V3"/><path d="M17 21V3c-2.4 2-3.2 5-3.2 8.6 0 1.4.9 2.4 2.2 2.4h1"/>',
  pantalla: '<rect x="3" y="4.5" width="18" height="12.5" rx="2.2"/><path d="m10.2 8.2 4.6 2.6-4.6 2.6z"/><path d="M8 20.5h8"/>',
  avion: '<path d="M21 4 10.5 14.5"/><path d="M21 4 14.5 21l-4-6.5L4 10.5z"/>',
  bolsa: '<path d="M5 8h14l-1.1 12.5H6.1z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',
  musica: '<path d="M9 18V5.5L20 3.5V16"/><circle cx="6.6" cy="18" r="2.4"/><circle cx="17.6" cy="16" r="2.4"/>',
  movil: '<rect x="7" y="2.5" width="10" height="19" rx="2.4"/><path d="M11 18.5h2"/>',
  paraguas: '<path d="M3 12a9 9 0 0 1 18 0z"/><path d="M12 12v6.5a2 2 0 0 1-4 0"/><path d="M12 3v-.5"/>',
  sube: '<path d="m3 17 6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
  barras: '<path d="M4 20h16"/><rect x="5.5" y="12" width="3" height="6" rx=".8"/><rect x="10.5" y="8" width="3" height="10" rx=".8"/><rect x="15.5" y="4.5" width="3" height="13.5" rx=".8"/>',
  menos: '<rect x="3" y="5.5" width="18" height="13" rx="2.2"/><path d="M3 10h18"/><path d="M14 14.8h4"/>',
  reloj: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  lupa: '<circle cx="10.5" cy="10.5" r="6"/><path d="m15 15 5.5 5.5"/>',
  brujula: '<circle cx="12" cy="12" r="9"/><path d="m15.6 8.4-2.1 5.1-5.1 2.1 2.1-5.1z"/>',
  tarta: '<path d="M11 4.1A8 8 0 1 0 19.9 13H11z"/><path d="M14 3.2a8 8 0 0 1 6.8 6.8H14z"/>',
  tarro: '<path d="M7.5 3.5h9"/><path d="M8.5 3.5v2.6C6.6 7.2 5.5 9.2 5.5 11.5v7A2.5 2.5 0 0 0 8 21h8a2.5 2.5 0 0 0 2.5-2.5v-7c0-2.3-1.1-4.3-3-5.4V3.5"/><path d="M9 13.5h6"/><path d="M9 17h6"/>',
  marcador: '<path d="M6.5 3.5h11v17l-5.5-4-5.5 4z"/>',
  bocadillo: '<path d="M4 5h16v11H10l-6 4.5z"/><path d="M8 9.5h8"/><path d="M8 12.5h5"/>',
  calendario: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.2"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/>'
};
const icono = (nombre, color, tam = 40) =>
  `<svg width="${tam}" height="${tam}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${ICONOS[nombre]}</svg>`;

// Barra apilada horizontal: 2 px de separación entre tramos y extremos redondeados.
function barra(tramos, { alto = 64, radio = 14 } = {}) {
  const total = tramos.reduce((s, t) => s + t.valor, 0);
  return `<div class="barra" style="height:${alto}px">${tramos.map((t, i) =>
    `<span style="flex:${t.valor / total};background:${t.color};border-radius:${i === 0 ? `${radio}px 4px 4px ${radio}px` : i === tramos.length - 1 ? `4px ${radio}px ${radio}px 4px` : '4px'}"></span>`).join('')}</div>`;
}

const css = (F) => `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: ${F.w}px; height: ${F.h}px; overflow: hidden; }
  body { font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; color: ${C.tinta};
    background: radial-gradient(900px 600px at 100% 0%, rgba(45,212,191,.07), transparent 70%), ${C.fondo}; }
  .pag { position: absolute; inset: 0; padding: ${F.arriba}px ${F.lado}px ${F.abajo}px; display: flex; flex-direction: column; }
  .arriba { display: flex; justify-content: space-between; align-items: center; font-size: 21px; font-weight: 700; letter-spacing: .14em; }
  .arriba .kicker { color: ${C.acento}; }
  .arriba .num { color: ${C.suave}; letter-spacing: .06em; font-weight: 600; }
  .cuerpo { flex: 1; display: flex; flex-direction: column; justify-content: ${F.centrar ? 'center' : 'flex-start'}; padding: ${F.centrar ? '20px 0 30px' : '56px 0 0'}; }
  h1 { font-size: ${F.h1}px; font-weight: 750; line-height: 1.08; letter-spacing: -.025em; }
  h1 .c { color: ${C.acento}; }
  h1.grande { font-size: ${Math.round(F.h1 * 1.18)}px; }
  .lead { margin-top: 28px; font-size: ${F.txt}px; line-height: 1.45; color: ${C.texto}; font-weight: 450; max-width: 900px; }
  .lead b { color: ${C.tinta}; font-weight: 650; }
  .nota { margin-top: 18px; font-size: ${F.txt - 8}px; line-height: 1.45; color: ${C.suave}; }
  .abajo { display: flex; justify-content: space-between; align-items: center; font-size: 22px; color: ${C.suave}; font-weight: 550; }
  .firma { display: flex; align-items: center; gap: 12px; }
  .firma .ico { width: 34px; height: 34px; border-radius: 10px; background: ${C.necesidades}; display: inline-flex; align-items: center; justify-content: center; }
  .firma b { color: ${C.texto}; font-weight: 700; }
  .barra { display: flex; gap: 3px; width: 100%; }
  .barra span { display: block; height: 100%; }
  .tarjeta { background: ${C.superficie}; border: 1px solid ${C.borde}; border-radius: 26px; padding: 34px 36px; }
  .rejilla { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
  .item { display: flex; align-items: center; gap: 22px; background: ${C.superficie}; border: 1px solid ${C.borde}; border-radius: 24px; padding: 26px 26px; font-size: ${F.txt - 2}px; font-weight: 600; color: ${C.tinta}; }
  .item .ic { flex: 0 0 auto; width: 76px; height: 76px; border-radius: 20px; display: inline-flex; align-items: center; justify-content: center; }
  .item small { display: block; font-size: ${F.txt - 9}px; font-weight: 500; color: ${C.suave}; margin-top: 4px; }
  .fila { display: flex; justify-content: space-between; align-items: baseline; padding: 20px 0; border-bottom: 1px solid ${C.borde}; font-size: ${F.txt}px; }
  .fila:last-child { border-bottom: none; }
  .fila .eti { color: ${C.texto}; display: flex; align-items: center; gap: 14px; }
  .fila .val { font-weight: 700; font-variant-numeric: tabular-nums; }
  .punto { width: 16px; height: 16px; border-radius: 5px; display: inline-block; }
  .pct { font-size: ${Math.round(F.h1 * 1.5)}px; font-weight: 800; letter-spacing: -.04em; line-height: 1; }
`;

const firma = () => `<span class="firma"><span class="ico"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg></span><b>FinanziApp</b></span>`;

// Página completa de una diapositiva.
function pagina({ F, lang, kicker, n, total, contenido, pie }) {
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><style>${css(F)}</style></head><body>
  <div class="pag">
    <div class="arriba"><span class="kicker">${kicker}</span><span class="num">${n} / ${total}</span></div>
    <div class="cuerpo">${contenido}</div>
    <div class="abajo">${firma()}<span>${pie || ''}</span></div>
  </div></body></html>`;
}

module.exports = { C, icono, barra, pagina, css, firma };
