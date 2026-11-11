// Contraste · «¿Bajaría la vivienda un 30 % quitando impuestos?» · @finanziapp.es (España), en 3D (reels-voz/tres.js).
// Guion: investigacion/2026-11-vivienda-impuestos-30-guion.md (versión 3, verificada). Dosier con todas las fuentes:
// investigacion/2026-11-vivienda-impuestos-30.md. Neutralidad (elecciones del 29-N): solo la paleta de la marca, sin
// logotipos ni colores de partido, sin imágenes de personas reales y sin gestos de burla.
//
// Fuentes de cada dato (consultadas el 11-nov-2026):
// - La propuesta y la cita «al menos un 30 %»: crónicas de prensa de la entrevista en La Revuelta (La 1), 9-nov-2026
//   (El Constitucional, uhnplus, Anécdotas; FormulaTV para «quitar impuestos para la adquisición de la primera vivienda»).
//   La frase completa y el minuto no están comprobados: por eso «según algunas crónicas».
// - IVA del 10 % en vivienda nueva: Ley 37/1992 del IVA, art. 91.Uno.1.7.º. Península y Baleares (Canarias: IGIC;
//   Ceuta y Melilla: IPSI).
// - AJD de la escritura: RDLeg. 1/1993, art. 31.2 (0,5 % si la comunidad no lo fija); hasta el 1,5 % según la comunidad
//   (tabla de Gibobs que cita «Tributación Autonómica 2026» de Hacienda).
// - Transmisiones (segunda mano): RDLeg. 1/1993, art. 11.1.a (6 % por defecto); 6–10 % en casi toda España (misma tabla).
// - Segunda mano, casi 4 de cada 5 compras: INE, Estadística de Transmisiones de Derechos de la Propiedad (dato del guion:
//   21,3 % de obra nueva, «INE, agosto de 2026»).
// - «Hasta un 30 %» por trabas y cargas de la construcción: Vox, Programa económico y de vivienda (2025), pág. 30.
// - «Más del 26 %», IVA incluido: EY para ASPRIMA (promotores de Madrid), junio de 2026.
// - Quién fija cada impuesto: Ley 37/1992 (IVA, Estado); Ley 22/2009 y LOFCA (ITP y AJD cedidos a las comunidades);
//   RDLeg. 2/2004, TRLRHL (ICIO, tasas y plusvalía, ayuntamientos).
// - Reino Unido 2008–2009: Besley, Meads y Surico (2014), J. Public Economics 119: unas 900 £ de bajada de precio por
//   unas 1.500 £ de rebaja → 60 %.
//
// Dos finales: A (`es-contraste-vivienda-30`, el del guion) y B (`es-contraste-vivienda-30b`, sin guiño); solo cambia la
// última frase. Respecto al guion solo se han añadido marcas § (no se leen): «§Entre 21.000…» y «§Las Cortes…».
const { pildora3d } = require('./tres');
const { cuadra } = require('../reels/_comun');

// ——— cuentas (las que lista el guion) ———
const PRECIO = 200000, IVA = 0.10, AJD = [0.005, 0.015];
const IMP = AJD.map(a => Math.round(PRECIO * IVA + PRECIO * a));
cuadra('vivienda IVA', PRECIO * IVA, 20000);
cuadra('vivienda AJD', AJD.map(a => Math.round(PRECIO * a)).join(), '1000,3000');
cuadra('vivienda total', IMP.join(), '21000,23000');
cuadra('vivienda % min', +(IMP[0] / (PRECIO + IMP[0]) * 100).toFixed(1), 9.5);
cuadra('vivienda % max', +(IMP[1] / (PRECIO + IMP[1]) * 100).toFixed(1), 10.3);
cuadra('UK traslado', 900 / 1500, 0.6);
cuadra('segunda mano', +(100 - 21.3).toFixed(1), 78.7);

const mil = (n) => n.toLocaleString('es-ES', { useGrouping: 'always' });

const GUION = [
  [0, '¿Bajaría tu casa *un 30 %* §solo con quitar impuestos? §Vamos a hacer la cuenta.'],
  [1, 'El 9 de noviembre, en La Revuelta, Santiago Abascal propuso §quitar impuestos a la compra de la *primera vivienda*. §Según algunas crónicas, dijo que así sería *al menos un 30 %* más barata.'],
  [2, 'Lo que pagas al comprar una vivienda nueva de 200.000 euros: §IVA del 10 %, §{caja}más actos jurídicos. §Entre *21.000 y 23.000 euros*, según la comunidad.'],
  [2, 'Eso es §{pop}*en torno a un 10 %* de lo que pagas, no un 30.'],
  [3, 'Y casi cuatro de cada cinco compras son de *segunda mano*. §Ahí pagas transmisiones: §en casi toda España, entre un *6 y un 10 %* del precio.'],
  [4, '¿Y de dónde puede salir el 30? §El programa de Vox habla de trabas y cargas en *toda la construcción*: suelo, licencias, obra y venta. §{ding}Los promotores de Madrid lo cifran en *más de un 26 %*, contando también el IVA.'],
  [5, 'Esa cadena pasa por tres manos. §El IVA lo fija el *Estado*. §Transmisiones, las *comunidades*. §Licencias y plusvalía, los *ayuntamientos*. §Las Cortes pueden cambiarlo, pero habría que compensarles.'],
  [6, 'Y cuando baja un impuesto, el precio no baja lo mismo. §En Reino Unido, en 2008 y 2009, §{pop}de cada 100 libras de rebaja, al comprador le llegaron unas *60*. Más de la mitad, pero no todo.'],
  [7, 'El resultado: quitar los impuestos de la compra ahorra, como mucho, *en torno a un 10 %*. §Es mucho dinero, y sale de tus ahorros: la hipoteca normalmente no lo cubre. §Pero para acercarse al 30 habría que tocar *toda la cadena*.']
];
const CIERRES = {
  a: [8, 'Preguntar en directo no es fácil: a cualquiera se le traba la lengua. §Las cuentas, por suerte, se hacen con calma. §{pop}¿Qué te pareció *la entrevista*?'],
  b: [8, 'Nosotros hemos hecho la cuenta. §{pop}¿Y a ti, qué te pareció *la entrevista*? Te leemos.']
};

const TEXTO = `¿Bajaría la vivienda un 30 % solo con quitar impuestos? Hemos hecho la cuenta. 🏠

Lo que se propuso en La Revuelta (9 nov): quitar impuestos a la compra de la primera vivienda. Lo que dicen los números: en obra nueva esos impuestos son en torno a un 10 % de lo que pagas y, en segunda mano, entre un 6 y un 10 % del precio en casi toda España. Es dinero que sale de tus ahorros, porque la hipoteca normalmente no lo cubre. Para acercarse a un 30 % habría que tocar toda la cadena de una vivienda nueva (suelo, licencias, obra y venta): los promotores de Madrid la cifran en más de un 26 %, contando el IVA.

¿Qué te pareció la entrevista? ¿Y qué impuesto bajarías tú primero? 👇 Con respeto, que aquí venimos a hacer cuentas.

Fuentes: Ley 37/1992 del IVA (art. 91) · RDLeg. 1/1993 (ITP y AJD) · programa económico y de vivienda de Vox (2025) · EY para ASPRIMA (junio de 2026) · INE, transmisiones de derechos de la propiedad (agosto de 2026) · Besley, Meads y Surico (2014) · crónicas de la entrevista. En Canarias, Ceuta y Melilla el impuesto de la obra nueva es otro (IGIC, IPSI).

#vivienda #impuestos #finanzaspersonales #hacemoslacuenta #educacionfinanciera`;

const MONO = `'DejaVu Sans Mono', 'Liberation Mono', monospace`;
const CSS = `
  .tj { position: absolute; left: 50%; background: rgba(9,14,27,.9); border: 2px solid rgba(148,163,184,.32); border-radius: 24px;
    padding: 16px 40px 20px; text-align: center; opacity: 0; white-space: nowrap; }
  .tj small { display: block; font: 700 23px/1.35 ${MONO}; letter-spacing: .14em; color: #94a3b8; margin-bottom: 4px; }
  .tj .l { display: block; font-size: 50px; line-height: 1.15; font-weight: 850; letter-spacing: -.015em; color: #fff; font-variant-numeric: tabular-nums; }
  .tj .l.p { font-size: 40px; font-weight: 750; color: #cbd5e1; }
  .tj .t { color: #5eead4; } .tj .r { color: #f87171; } .tj .a { color: #f5b94a; }
  .tj.turq { border-color: rgba(94,234,212,.6); } .tj.amb { border-color: rgba(245,185,74,.6); } .tj.roja { border-color: rgba(248,113,113,.6); }
  .grande { position: absolute; left: 50%; font-size: 150px; line-height: 1; font-weight: 900; letter-spacing: -.04em; color: #f87171;
    text-shadow: 0 6px 40px rgba(0,0,0,.7); opacity: 0; white-space: nowrap; }
  .fuente { position: absolute; left: 70px; right: 70px; top: 1452px; text-align: center; font: 600 25px/1.3 ${MONO}; letter-spacing: .03em;
    color: #a5b4c8; text-shadow: 0 2px 10px rgba(0,0,0,.9); }
  .fuente b { color: #e2e8f0; font-weight: 700; }
  .nota { position: absolute; left: 50%; top: 1400px; text-align: center; font-size: 25px; line-height: 1.2; font-weight: 650; color: #e2e8f0; white-space: nowrap;
    background: rgba(9,14,27,.82); border-radius: 12px; padding: 6px 14px; opacity: 0; }
  .chip { position: absolute; top: 1300px; font-size: 32px; font-weight: 850; letter-spacing: .02em; color: #fff; background: rgba(9,14,27,.92);
    border: 3px solid #5eead4; border-radius: 16px; padding: 8px 18px; opacity: 0; white-space: nowrap; box-shadow: 0 0 22px rgba(94,234,212,.35); }
  .cadena { position: absolute; left: 50%; display: flex; gap: 10px; align-items: center; white-space: nowrap; }
  .cadena span { font-size: 36px; font-weight: 850; color: #fff; background: rgba(9,14,27,.9); border: 2px solid rgba(245,185,74,.55); border-radius: 14px; padding: 8px 16px; opacity: 0; }
  .cadena i { font-style: normal; font-size: 32px; color: #f5b94a; opacity: 0; }
  .pregunta { position: absolute; left: 80px; right: 80px; top: 600px; text-align: center; font-size: 92px; line-height: 1.05; font-weight: 900;
    letter-spacing: -.03em; color: #fff; text-shadow: 0 6px 40px rgba(0,0,0,.8); opacity: 0; }
  .pregunta b { color: #5eead4; }
  .hud.i.fmt { letter-spacing: .14em; }
`;
// Cada elemento con data-m="k" aparece en la marca k de la escena (contando las marcas de todas sus frases; -1 = al empezar)
// y, si lleva data-hasta="k", se va en la marca k.
const SCRIPT = `
function aparecen(s, e, el) {
  const M = e.seg.flatMap(g => g.marcas);
  el.querySelectorAll('[data-m]').forEach(n => {
    const k = +n.dataset.m, at = k < 0 ? 0.12 : (M[k] != null ? M[k] : 1 + k);
    let p = rebote(tramo(s, at - 0.1, at + 0.3));
    if (n.dataset.hasta != null) { const h = M[+n.dataset.hasta]; if (h != null) p *= 1 - tramo(s, h - 0.25, h); }
    aparece3(n, p);
  });
}`;
const an = function (s, e, el) { aparecen(s, e, el); };
const fuente = (txt) => `<div class="fuente">${txt}</div>`;

const ESCENAS = [
  // 0 · Gancho: la casa de 100 bloques con 30 en rojo, y «¿−30 %?».
  { html: () => `<div class="grande" data-t="translateX(-50%)" style="top:540px;opacity:1">¿−30 %?</div>`,
    anim: function (s, e, el) { const g = el.querySelector('.grande'); g.style.transform = 'translateX(-50%) scale(' + (1 + 0.03 * Math.sin(s * 6)) + ')'; } },
  // 1 · La propuesta, con la cita y «según algunas crónicas».
  { html: () => `<div class="tj" data-t="translateX(-50%)" data-m="-1" style="top:500px"><small>LA REVUELTA · 9 NOV 2026</small>
        <span class="l" style="font-size:44px">Quitar impuestos a la compra</span><span class="l" style="font-size:44px">de la primera vivienda</span></div>
      <div class="tj roja" data-t="translateX(-50%)" data-m="1" style="top:682px"><small>SEGÚN ALGUNAS CRÓNICAS</small>
        <span class="l" style="font-size:60px">«al menos un <span class="r">30 %</span>»</span><span class="l p" style="font-size:36px">más barata</span></div>
      ${fuente('Crónicas de prensa de la entrevista, 9 y 10 nov 2026')}`, anim: an },
  // 2 · Obra nueva: IVA + AJD = 21.000–23.000 € → en torno a un 10 %, no un 30.
  { html: () => `<div class="tj" data-t="translateX(-50%)" style="top:492px;opacity:1;transform:translateX(-50%)"><small>VIVIENDA NUEVA</small>
        <span class="l" style="font-size:56px">Precio: ${mil(PRECIO)} €</span>
        <span class="l" data-m="0" data-t="" style="font-size:44px">IVA 10 % → ${mil(PRECIO * IVA)} €</span>
        <span class="l" data-m="1" data-t="" style="font-size:44px">+ AJD 0,5–1,5 % → ${mil(PRECIO * AJD[0])}–${mil(PRECIO * AJD[1])} €</span>
        <span class="l t" data-m="2" data-t="" style="font-size:48px">= ${mil(IMP[0])}–${mil(IMP[1])} €</span>
        <span class="l" data-m="3" data-t="" style="font-size:44px"><span class="t">≈ 10 %</span> de lo que pagas · <span class="r">no 30</span></span></div>
      <div class="nota" data-m="-1" data-t="translateX(-50%)">Península y Baleares. En Canarias, Ceuta y Melilla el impuesto es otro</div>
      ${fuente('Ley del IVA, art. 91 · Ley del ITP y AJD, art. 31')}`, anim: an },
  // 3 · Segunda mano: 4 de cada 5; transmisiones, 6–10 %.
  { html: () => `<div class="tj amb" data-t="translateX(-50%)" data-m="-1" style="top:520px"><small>COMPRAS DE VIVIENDA</small>
        <span class="l">Casi <span class="a">4 de cada 5</span>: segunda mano</span></div>
      <div class="tj" data-t="translateX(-50%)" data-m="1" style="top:700px"><small>TRANSMISIONES (ITP)</small>
        <span class="l"><span class="a">6–10 %</span> del precio</span><span class="l p">en casi toda España</span></div>
      ${fuente('INE, agosto de 2026 · Ley del ITP y AJD, art. 11')}`, anim: an },
  // 4 · De dónde puede salir el 30: toda la cadena de una vivienda nueva.
  { html: () => `<div class="cadena" style="top:492px;transform:translateX(-50%)"><span data-m="0" data-t="">Suelo</span><i data-m="0" data-t="">→</i><span data-m="0" data-t="">Licencias</span><i data-m="0" data-t="">→</i><span data-m="0" data-t="">Obra</span><i data-m="0" data-t="">→</i><span data-m="0" data-t="">Venta</span></div>
      <div class="tj roja" data-t="" data-m="0" style="top:572px;left:auto;right:548px;padding:14px 24px 18px"><small style="font-size:20px">PROGRAMA DE VOX (2025)</small>
        <span class="l" style="font-size:46px"><span class="r">hasta un 30 %</span></span><span class="l p" style="font-size:30px">trabas y cargas</span><span class="l p" style="font-size:30px">de la construcción</span></div>
      <div class="tj amb" data-t="" data-m="1" style="top:572px;left:548px;padding:14px 24px 18px"><small style="font-size:20px">PROMOTORES DE MADRID</small>
        <span class="l" style="font-size:46px"><span class="a">más del 26 %</span></span><span class="l p" style="font-size:30px">EY, 2026</span><span class="l p" style="font-size:30px">IVA incluido</span></div>
      ${fuente('Programa de Vox, 2025 · EY para ASPRIMA, junio de 2026 · IVA incluido')}`, anim: an },
  // 5 · Tres manos: Estado, comunidades, ayuntamientos; las Cortes pueden cambiarlo, compensando.
  { html: () => `<div class="tj" data-t="translateX(-50%)" data-m="3" style="top:510px"><span class="l">Las Cortes pueden cambiarlo,</span><span class="l p">pero habría que compensarles</span></div>
      <div class="chip" data-m="0" data-t="translateX(-50%)" style="left:240px">ESTADO</div>
      <div class="chip" data-m="1" data-t="translateX(-50%)" style="left:540px;top:1374px">COMUNIDADES</div>
      <div class="chip" data-m="2" data-t="translateX(-50%)" style="left:840px">AYUNTAMIENTOS</div>
      ${fuente('Ley del IVA · Ley 22/2009 (impuestos cedidos) · Ley de Haciendas Locales')}`, anim: an },
  // 6 · La rebaja no llega entera: de cada 100 £, unas 60 al comprador.
  { html: () => `<div class="tj" data-t="translateX(-50%)" data-m="0" style="top:520px"><small>REINO UNIDO · 2008–2009</small>
        <span class="l">De cada 100 £ de rebaja</span>
        <span class="l" data-m="1" data-t=""><span class="t">≈ 60 £</span> al comprador</span>
        <span class="l p" data-m="1" data-t=""><span class="a">≈ 40 £</span> se quedan en el precio</span></div>
      ${fuente('Besley, Meads y Surico, 2014')}`, anim: an },
  // 7 · El resultado: ≈ −10 % de tus ahorros frente al −30 % de toda la cadena.
  { html: () => `<div class="tj turq" data-t="translateX(-50%)" data-m="-1" style="top:500px"><small>IMPUESTOS DE LA COMPRA</small>
        <span class="l"><span class="t">≈ −10 %</span> como mucho</span><span class="l p" data-m="0" data-t="" style="font-size:36px">sale de tus ahorros:</span><span class="l p" data-m="0" data-t="" style="font-size:36px">la hipoteca normalmente no lo cubre</span></div>
      <div class="tj amb" data-t="translateX(-50%)" data-m="1" style="top:722px"><small>PARA ACERCARSE AL −30 %</small>
        <span class="l"><span class="a">toda la cadena</span></span></div>
      ${fuente('Ley del IVA · Ley del ITP y AJD · EY para ASPRIMA, 2026')}`, anim: an },
  // 8 · Cierre: el héroe, tranquilo junto a la casa; la pregunta grande en la última marca.
  { html: () => `<div class="pregunta">¿Qué te pareció <b>la entrevista</b>?</div>`,
    anim: function (s, e, el) { const M = e.seg[0].marcas, m = M[M.length - 1], n = el.querySelector('.pregunta'), p = rebote(tramo(s, m - 0.1, m + 0.35));
      n.style.opacity = Math.min(1, p * 1.5); n.style.transform = 'scale(' + (0.8 + 0.2 * p) + ')'; } }
];

const TRES = function (t, k, s, e, W) {
  const p = Math.min(1, s / (e.fin - e.ini)), M = e.seg.flatMap(g => g.marcas);
  const mk = (j, def) => e.ini + (M[j] != null ? M[j] : def);   // marca j de esta escena, en tiempo global
  const ROJO = 0xef4444, TURQ = 0x2dd4bf, AMBAR = 0xe2a336, E = 0.62;   // E: escala de la casa cuando hay tarjetas arriba
  let directo = () => ({ x: -60, z: -60, esc: 0 });
  if (k === 0) {
    W.casa({ bloque: (i) => i < 30 ? { color: ROJO, q: 0.8 + 0.2 * Math.sin(t * 6 + i * 0.15), brillo: 0.25 + 0.2 * Math.sin(t * 6), dz: 0.14 } : null });
    W.niebla(22, 64); const a = 0.45 - 0.3 * p; W.camara(Math.sin(a) * 18, 4.6, Math.cos(a) * 18, 0, 3.95, 0);
  } else if (k === 1) {
    W.casa({ esc: E, bloque: (i) => i < 30 ? { color: ROJO, q: 0.55 + 0.25 * Math.sin(t * 5), brillo: 0.2, dz: 0.14 } : null });
    W.niebla(24, 66);
    const a = -0.3 + 0.2 * p; W.camara(Math.sin(a) * 15, 3.66, Math.cos(a) * 15, 0, 3.16, 0);
  } else if (k === 2) {
    const tP = mk(3, 6), v = sale(tramo(t, tP - 0.05, tP + 0.5));
    W.casa({ esc: E, bloque: (i) => i < 20 ? { color: ROJO, q: 0.9 * (1 - v), brillo: 0.25, dz: 0.14 * (1 - v) } : i < 30 ? { color: v > 0 ? TURQ : ROJO, q: 0.9, brillo: 0.25 + 0.15 * v, dz: 0.14 + 0.3 * v } : null });
    W.niebla(24, 66); W.camara(2.0 - 1.2 * p, 3.45, 15.5, 0, 2.97, 0);
  } else if (k === 3) {
    const SITIO = [[-1.7, -1.2], [0, -1.2], [1.7, -1.2], [-0.85, 0.9], [0.85, 0.9]], NUEVA = 1;
    W.casitas(SITIO.map(([x, z], j) => ({ x, z, color: j === NUEVA ? null : AMBAR, q: sale(tramo(s, 0.3 + j * 0.15, 0.7 + j * 0.15)) })));
    SITIO.forEach(([x, z], j) => { if (j !== NUEVA) W.etiqueta('mano' + j, '2.ª MANO', x, 2.45, z, sale(tramo(s, 0.6 + j * 0.15, 0.9 + j * 0.15)), '#e2a336', 0.85); });
    W.etiqueta('nueva', 'NUEVA', 0, 2.45, -1.2, sale(tramo(s, 0.9, 1.2)), '#94a3b8', 0.75);
    const a = -0.25 + 0.35 * p; W.camara(Math.sin(a) * 15, 3.8, Math.cos(a) * 15, 0, 2.5, 0);
  } else if (k === 4) {
    const t30 = mk(0, 1.5), t26 = mk(1, 5);
    W.casa({ esc: E, bloque: (i) => {
      const r = i < 30 ? sale(tramo(t, t30, t30 + 0.5)) * (1 - sale(tramo(t, t26, t26 + 0.4))) : 0, am = i < 26 ? sale(tramo(t, t26 + i * 0.025, t26 + i * 0.025 + 0.3)) : 0;
      return am > 0 ? { color: AMBAR, q: am, brillo: 0.3, dz: 0.14 * am } : r > 0 ? { color: ROJO, q: 0.7 * r * (0.75 + 0.25 * Math.sin(t * 6)), brillo: 0.2, dz: 0.1 * r } : null; } });
    W.niebla(24, 66); const a = -0.45 + 0.2 * p; W.camara(Math.sin(a) * (13.6 - 0.5 * p), 3.2, Math.cos(a) * (13.6 - 0.5 * p), 0, 2.62, 0);
  } else if (k === 5) {
    W.casa({ esc: E, bloque: (i) => i < 26 ? { color: AMBAR, q: 0.55, brillo: 0.2, dz: 0.14 } : null });
    const MANOS = [[-1.6, 'ESTADO'], [0, 'COMUNIDADES'], [1.6, 'AYUNTAMIENTOS']];
    directo = (i, a) => {
      if (i >= 3) return { x: -60, z: -60, esc: 0 };
      const q = sale(tramo(t, mk(i, 1 + i) - 0.1, mk(i, 1 + i) + 0.4));
      return { x: MANOS[i][0], z: 3.1, rot: 0.05 * Math.sin(t + i), color: TURQ, cq: q, brillo: 0.35 };
    };
    W.niebla(20, 60); W.camara(0, 2.2, 15.1, 0, 1.75, 1.5);   // plano fijo: las etiquetas son 2D, debajo de cada uno
  } else if (k === 6) {
    const CX = -1.35, CZ = -0.8, HX = 1.9, HZ = 2.6, tR = mk(1, 3);
    W.casa({ x: CX, z: CZ, rot: 0.3, esc: 0.5, bloque: (i) => i >= 20 && i < 30 ? { color: AMBAR, q: 0.5, brillo: 0.2 } : null });
    W.heroe({ x: HX, z: HZ, luz: 1, gira: -2.2 });
    directo = (i, a) => {
      if (i >= 10) return { x: -60, z: -60, esc: 0 };
      const x0 = CX + 0.5 + (i % 5 - 2) * 0.32, z0 = CZ + 1.3 + Math.floor(i / 5) * 0.4, llega = i < 6;
      const x1 = llega ? HX - 0.9 + (i % 3 - 1) * 0.42 : (x0 + HX) / 2 - 0.4, z1 = llega ? HZ - 0.8 + Math.floor(i / 3) * 0.5 : (z0 + HZ) / 2;
      const t0 = tR + i * 0.12, q = tramo(t, t0, t0 + 1.7), ee = q * q * (3 - 2 * q);
      let x = x0 + (x1 - x0) * ee, z = z0 + (z1 - z0) * ee, rot = Math.atan2(x1 - x0, z1 - z0), amp = q > 0 && q < 1 ? 1 : 0;
      if (!llega) { const v = tramo(t, t0 + 1.8, t0 + 3.2), ev = v * v * (3 - 2 * v); x = x1 + (x0 - x1) * ev; z = z1 + (z0 - z1) * ev; if (v > 0) { rot = Math.atan2(x0 - x1, z0 - z1); amp = v < 1 ? 1 : 0; } }
      const c = llega ? sale(tramo(t, t0 + 1.2, t0 + 1.8)) : sale(tramo(t, t0 + 1.6, t0 + 2.1));
      return { x, z, rot, amp, fase: (t - t0) * 8, esc: 0.6, color: llega ? TURQ : AMBAR, cq: c, brillo: 0.3 };
    };
    W.camara(0.3, 2.6, 14.5 - 0.6 * p, 0.3, 1.25, 0.8);
  } else if (k === 7) {
    const t2 = mk(1, 5);
    W.casa({ esc: E, bloque: (i) => i < 20 ? { color: AMBAR, q: 0.62 + 0.38 * sale(tramo(t, t2, t2 + 0.5)), brillo: 0.12 + 0.28 * sale(tramo(t, t2, t2 + 0.5)), dz: 0.14 } : i < 30 ? { color: TURQ, q: 0.95, brillo: 0.4, dz: 0.44 } : null });
    W.niebla(24, 66); W.camara(1.2 - 0.8 * p, 3.6, 14.4 + 0.8 * p, 0, 3.1, 0);
  } else {
    const CX = -1.3;
    W.casa({ x: CX, esc: 0.5, bloque: (i) => i >= 20 && i < 30 ? { color: TURQ, q: 0.6, brillo: 0.25, dz: 0.14 } : null });
    W.heroe({ x: 1.5, z: 1.4, luz: 1, gira: -0.35 });
    W.niebla(18, 56); const a = 0.2 - 0.15 * p; W.camara(0.2 + Math.sin(a) * 12.3, 3.0, Math.cos(a) * 12.3, 0.2, 2.67, 0.4);
  }
  W.multitud(t, { directo });
};

const hacer = (slug, cierre) => pildora3d({
  slug, cuenta: 'es',
  T: { es: { titulo: '¿Bajaría la vivienda un 30 % quitando impuestos?', guion: [...GUION, cierre] } },
  fijo: () => `<div class="hud i fmt">HACEMOS LA CUENTA</div><div class="hud d"><i></i><span id="reloj">00:00</span></div>`,
  cssExtra: CSS, scriptExtra: SCRIPT,
  escenas: ESCENAS, tres: TRES,
  texto: { es: TEXTO }
});

const pildoras = {
  'es-contraste-vivienda-30': hacer('es-contraste-vivienda-30', CIERRES.a),
  'es-contraste-vivienda-30b': hacer('es-contraste-vivienda-30b', CIERRES.b)
};

module.exports = { pildoras };
