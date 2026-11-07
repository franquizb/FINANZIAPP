// Piezas compartidas por los reels: filas con barra que crece, listas numeradas y cierre.
const { C, icono } = require('../comun');

const din = (n, lang, dec = 0) => {
  const [e, d] = Math.abs(n).toFixed(dec).split('.');
  const ent = e.replace(/\B(?=(\d{3})+(?!\d))/g, lang === 'en' ? ',' : '.');
  const s = (n < 0 ? '−' : '') + (lang === 'en' ? '$' + ent + (d ? '.' + d : '') : ent + (d ? ',' + d : '') + ' €');
  return s;
};
// Fila con etiqueta, valor (opcionalmente con cuenta) y barra que crece hasta `ancho` %.
const fila = (eti, valor, ancho, color, cuenta) => `<div class="a" style="margin-top:28px">
  <div style="display:flex;justify-content:space-between;align-items:baseline;font-size:36px;margin-bottom:14px"><span style="color:${C.texto};font-weight:600">${eti}</span><span style="font-weight:800;font-variant-numeric:tabular-nums" ${cuenta != null ? `data-cuenta="${Math.round(cuenta)}"` : ''}>${valor}</span></div>
  <div style="background:rgba(148,163,184,.12);border-radius:10px"><div class="linea-barra" data-ancho="${Math.max(2, ancho).toFixed(1)}" style="width:0;background:${color}"></div></div></div>`;
const lista = (items) => `<div style="margin-top:40px;display:flex;flex-direction:column;gap:18px">${items.map((x, i) =>
  `<div class="item a" style="font-size:36px"><span class="ic" style="background:rgba(15,159,143,.15);font-size:34px;font-weight:800;color:${C.acento}">${i + 1}</span><span>${x}</span></div>`).join('')}</div>`;
const listaIconos = (items, color = C.necesidades) => `<div style="margin-top:40px;display:flex;flex-direction:column;gap:18px">${items.map(([ic, a, b]) =>
  `<div class="item a" style="font-size:34px"><span class="ic" style="background:${color}26">${icono(ic, color, 44)}</span><span>${a}${b ? `<small style="font-size:27px">${b}</small>` : ''}</span></div>`).join('')}</div>`;
const cifra = (valor, cuenta, sub) => `<div class="tarjeta a" style="margin-top:44px;text-align:center;padding:48px 36px">
  <div class="grande-num" style="color:${C.acento}" ${cuenta != null ? `data-cuenta="${Math.round(cuenta)}"` : ''}>${valor}</div>
  <div style="margin-top:18px;font-size:34px;color:${C.texto};font-weight:600">${sub}</div></div>`;
const cierre = (t) => `<div class="a" style="display:flex;justify-content:center;margin-bottom:40px"><span style="width:150px;height:150px;border-radius:40px;background:${C.necesidades};display:inline-flex;align-items:center;justify-content:center"><svg width="86" height="86" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg></span></div>
  <h1 class="a" style="text-align:center">${t.cierre[0]}</h1><p class="lead a" style="text-align:center;margin-left:auto;margin-right:auto">${t.cierre[1]}</p>`;
// Dos tarjetas lado a lado para el gancho («hoy / dentro de…»); la segunda puede ir resaltada.
const dos = ([e1, v1, s1], [e2, v2, s2], resalta = true) => `<div class="a" style="margin-top:56px;display:grid;grid-template-columns:1fr 1fr;gap:20px">
  ${[[e1, v1, s1, false], [e2, v2, s2, resalta]].map(([e, v, s, r]) => `<div class="tarjeta" style="text-align:center;padding:40px 20px${r ? ';border-color:rgba(94,234,212,.4)' : ''}"><div style="font-size:30px;color:${C.suave};font-weight:600">${e}</div><div style="font-size:${String(v).length > 7 ? 76 : 96}px;font-weight:800;letter-spacing:-.03em;margin-top:8px${r ? ';color:' + C.acento : ''}">${v}</div>${s ? `<div style="font-size:30px;color:${C.texto};font-weight:600;margin-top:6px">${s}</div>` : ''}</div>`).join('')}</div>`;
// Fila de tarjetas con icono y nombre (gancho visual).
const tarjetasIconos = (items) => `<div class="a" style="margin-top:56px;display:grid;grid-template-columns:repeat(${items.length},1fr);gap:20px">${items.map(([ic, n]) =>
  `<div class="tarjeta" style="text-align:center;padding:40px 12px"><span style="width:110px;height:110px;border-radius:30px;background:rgba(15,159,143,.15);display:inline-flex;align-items:center;justify-content:center">${icono(ic, C.acento, 64)}</span><div style="margin-top:20px;font-size:32px;font-weight:700;color:${C.tinta}">${n}</div></div>`).join('')}</div>`;
// Cita en una tarjeta con bocadillo.
const cita = (txt) => `<div class="tarjeta a" style="margin-top:40px;display:flex;gap:28px;align-items:flex-start;padding:40px 40px">
  <span style="flex:0 0 auto;width:84px;height:84px;border-radius:22px;background:rgba(15,159,143,.15);display:inline-flex;align-items:center;justify-content:center">${icono('bocadillo', C.acento, 50)}</span>
  <span style="font-size:36px;line-height:1.45;color:${C.tinta};font-weight:550;font-style:italic">${txt}</span></div>`;
// Comprobación de cuentas: si un dato del texto no cuadra, no se renderiza.
const cuadra = (nombre, a, b) => { if (typeof a === 'number' ? !(Math.abs(a - b) < 1e-9) : a !== b) throw new Error(`${nombre}: ${a} ≠ ${b}`); };
const CIERRE = {
  en: ['Money, <span class="c">explained simply.</span>', 'Save this and follow for more guides.'],
  es: ['El dinero, <span class="c">explicado fácil.</span>', 'Guárdalo y síguenos para más guías.']
};
module.exports = { C, icono, din, fila, lista, listaIconos, cifra, cierre, CIERRE, dos, tarjetasIconos, cita, cuadra };
