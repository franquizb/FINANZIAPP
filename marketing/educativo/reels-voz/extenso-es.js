// Formato extenso (prueba, 45–60 s) · @finanziapp.es (España), en 3D (reels-voz/tres.js), serie «Hacemos la cuenta».
// es-iva-sobre-impuesto · «La rebaja de 20 céntimos en la gasolina no son 20 céntimos. Son 24.»
// Guion final y verificado: guiones/2026-11-extenso-es.md (tabla de escenas, cuentas, fuentes, texto y portada).
// Validez: solo mientras la rebaja de noviembre de 2026 sea de 20 céntimos (publicar antes del 30/11/2026).
// Cifras: península y Baleares, gasolina sin plomo 95, noviembre de 2026.
//
// Fuentes de cada dato (consultadas el 14-nov-2026):
// - Impuesto de hidrocarburos de ley, gasolina 95: Ley 38/1992 de Impuestos Especiales, art. 50, epígrafe 1.2.2:
//   400,69 + 72 = 472,69 €/1.000 l (47 céntimos por litro). Gasóleo, epígrafe 1.3: 307 + 72 = 379 (solo en el texto).
//   https://www.boe.es/buscar/act.php?id=BOE-A-1992-28741
// - Tipo de noviembre de 2026, gasolina 95: AEAT, TIPOSIHNOV26.xlsx: 231,15 + 41,54 = 272,69 €/1.000 l (27 céntimos).
//   https://sede.agenciatributaria.gob.es/static_files/Sede/Tema/Aduanas/TIPOSIHNOV26.xlsx
// - Rebaja de 20 céntimos en noviembre (gasolinas sin plomo y gasóleo de uso general): AEAT, novedad del 20/10/2026, y
//   noticia sobre el RDL 25/2026 (30/09/2026, actualizada el 05/11/2026; calendario de la rebaja).
// - El IVA se calcula con el impuesto dentro: Ley 37/1992 del IVA, art. 78.Dos.4.º (la base «comprenderá los impuestos
//   especiales»); tipo general del 21 %: art. 90. https://www.boe.es/buscar/act.php?id=BOE-A-1992-28740
// - Para toda la UE: Directiva 2006/112/CE, art. 78 a) (la base incluye impuestos, derechos, tasas y exacciones, salvo el
//   propio IVA). DOUE L 347, 11/12/2006.
// - Precio de referencia (solo para las proporciones de la columna; no se dice): Comisión Europea, Boletín Petrolero,
//   España, gasolina 95, 02/11/2026 (repetido el 09/11): 1.729,89 €/1.000 l con impuestos y 1.156,97 sin impuestos.
// - Luz, tabaco y alcohol: impuestos especiales (Ley 38/1992), dentro de la base del IVA (Ley 37/1992, art. 78.Dos.4.º).
//   En la factura de la luz NO se muestra el tipo de IVA: el RDL 25/2026 lo deja al 10 % con condiciones.
//
// Respecto al guion solo se han añadido marcas § (no se leen ni cambian la toma de voz): frase 1 «§en el impuesto»,
// frase 2 «§se calcula» y «§son 4», frase 4 «§y no solo aquí», frase 5 «§aunque», «§sin refinería» y «§sin gasolinera»,
// frase 6 «§Este mes», frase 7 «§el tabaco», «§y el alcohol» y «§el IVA también», frase 8 «§multiplicado» y «§el litro».
const { pildora3d } = require('./tres');
const { cuadra } = require('../reels/_comun');

// ——— cuentas (todas las del guion) ———
cuadra('tipo ley gasolina 95 (€/1.000 l)', +(400.69 + 72).toFixed(2), 472.69);
cuadra('tipo noviembre 2026 (€/1.000 l)', +(231.15 + 41.54).toFixed(2), 272.69);
cuadra('rebaja (€/1.000 l)', +(472.69 - 272.69).toFixed(2), 200);
cuadra('IVA de la rebaja: 4 cts', +(0.20 * 0.21).toFixed(3), 0.042);
cuadra('rebaja con IVA: 24 cts', +(0.20 * 1.21).toFixed(3), 0.242);
cuadra('Boletín Petrolero 02/11 (rep. 09/11)', +((1.15697 + 0.27269) * 1.21).toFixed(5), 1.72989);
cuadra('impuesto implícito Boletín', +(1729.89 / 1.21 - 1156.97).toFixed(2), 272.69);
cuadra('sin rebaja (no se dice)', +((1.15697 + 0.47269) * 1.21).toFixed(5), 1.97189);
cuadra('gasolina gratis: 57 cts', +(0.47269 * 1.21).toFixed(5), 0.57195);
cuadra('IVA sobre el impuesto: casi 10 cts', +(0.47269 * 0.21).toFixed(5), 0.09926);
cuadra('50 l con tipo ley: unos 5 €', +(0.47269 * 0.21 * 50).toFixed(2), 4.96);
cuadra('50 l este mes: casi 3 €', +(0.27269 * 0.21 * 50).toFixed(2), 2.86);
cuadra('47 y 27 redondeados', [Math.round(47.269), Math.round(27.269)].join('/'), '47/27');
cuadra('gasóleo gratis: 46 cts (comentarios)', Math.round(0.379 * 1.21 * 100), 46);
cuadra('diciembre si 13: casi 16', +(0.13 * 1.21).toFixed(4), 0.1573);
cuadra('diciembre si 13: tipo 34', +(472.69 - 130).toFixed(2), 342.69);
cuadra('dos saltos suman 24', +((0.20 - 0.13) * 1.21 + 0.13 * 1.21).toFixed(3), 0.242);
// Las que salen en pantalla además de las del guion.
const BASE = 1.15697, IMP_LEY = 0.47269, IMP_NOV = 0.27269, TIPO = 0.21;
cuadra('pantalla: 0,47 × 1,21 = 0,57', +(Math.round(IMP_LEY * 100) / 100 * 1.21).toFixed(2), 0.57);
cuadra('pantalla: 9,9 cts', +(IMP_LEY * TIPO * 100).toFixed(1), 9.9);
cuadra('pantalla: 20 + 4 = 24', Math.round(20 + 20 * TIPO), 24);

const TEXTO = `La rebaja de 20 céntimos en la gasolina no son 20 céntimos. Son 24.

Lo que no cabía en el vídeo:
• La regla está en el art. 78 de la Ley del IVA: la base del IVA incluye los impuestos especiales (hidrocarburos, electricidad, tabaco, alcohol).
• Con el gasóleo pasa lo mismo: misma rebaja de 20, que en el surtidor son 24. Y con su impuesto de ley (37,9 céntimos), el gasóleo «gratis» costaría unos 46 céntimos el litro.
• En Canarias no hay IVA ni este impuesto (allí hay IGIC y un impuesto propio), y en Ceuta y Melilla tampoco hay IVA. Las cifras del vídeo son para la península y Baleares, gasolina 95, noviembre de 2026.

¿Sabías que pagabas IVA sobre un impuesto? 👇

Fuentes: Ley 38/1992 (art. 50) y Ley 37/1992 del IVA (art. 78), BOE; tabla de tipos de noviembre de 2026 y RDL 25/2026, Agencia Tributaria; Directiva 2006/112/CE; Boletín Petrolero de la Comisión Europea (02/11/2026). Consultadas el 14/11/2026.

#gasolina #impuestos #IVA`;

const GUION = [
  [0, 'La rebaja de 20 céntimos en la gasolina §*no son 20 céntimos*. §{pop}Son *24*.'],
  [1, 'Esa rebaja es §en el impuesto de la gasolina: §una *cantidad fija* por cada litro.'],
  [2, 'Y el IVA, el 21 %, §se calcula *con ese impuesto dentro*: §{ding}20 céntimos menos de impuesto §son *4 menos de IVA*.'],
  [3, 'Espera. §¿Pagamos *IVA sobre un impuesto*? §¿Eso es legal?'],
  [4, 'Es legal, §y no solo aquí: §lo manda *una directiva europea* para toda la UE.'],
  [5, 'Ahora, la cuenta al revés. §Con el impuesto que fija la ley, 47 céntimos, §aunque la gasolina saliera *gratis*, §sin petróleo, §sin refinería y §sin gasolinera, §{caja}pagarías *57 céntimos* por litro.'],
  [6, 'Casi diez de esos céntimos son *IVA sobre el impuesto*: §unos *cinco euros* cada 50 litros. §Este mes, casi tres.'],
  [7, 'La luz, §el tabaco §y el alcohol, igual. §Mira hoy tu factura de la luz: §el IVA también se calcula *sobre el impuesto eléctrico*.'],
  [8, 'En el surtidor, todo te llega §*multiplicado por 1,21*. §Cuando acabe la rebaja, solo por el impuesto, §el litro no subirá 20 céntimos: §{pop}subirá *24*.']
];

const MONO = `'DejaVu Sans Mono', 'Liberation Mono', monospace`;
const CSS = `
  .hud.i.fmt { letter-spacing: .14em; }
  .tj { position: absolute; left: 50%; background: rgba(9,14,27,.9); border: 2px solid rgba(148,163,184,.32); border-radius: 24px;
    padding: 14px 38px 18px; text-align: center; opacity: 0; white-space: nowrap; }
  .tj small { display: block; font: 700 23px/1.35 ${MONO}; letter-spacing: .14em; color: #94a3b8; margin-bottom: 4px; }
  .tj .l { display: block; font-size: 52px; line-height: 1.15; font-weight: 850; letter-spacing: -.015em; color: #fff; font-variant-numeric: tabular-nums; }
  .tj .l.p { font-size: 34px; font-weight: 750; color: #cbd5e1; }
  .tj .t { color: #5eead4; } .tj .r { color: #f87171; } .tj .a { color: #f5b94a; }
  .tj.amb { border-color: rgba(245,185,74,.65); } .tj.roja { border-color: rgba(248,113,113,.6); }
  .fuente { position: absolute; left: 50%; transform: translateX(-50%); top: 1462px; text-align: center; font: 600 24px/1.3 ${MONO}; letter-spacing: .01em;
    color: #b6c2d4; white-space: nowrap; background: rgba(7,11,22,.78); border-radius: 10px; padding: 5px 14px; }
  .nota { position: absolute; left: 50%; transform: translateX(-50%); top: 1404px; text-align: center; font-size: 27px; line-height: 1.2; font-weight: 700;
    color: #e2e8f0; white-space: nowrap; background: rgba(9,14,27,.84); border: 1px solid rgba(148,163,184,.35); border-radius: 12px; padding: 7px 16px; }
  .chip { position: absolute; left: 50%; font-size: 40px; font-weight: 850; color: #fff; background: rgba(9,14,27,.9); border: 3px solid #e2e8f0;
    border-radius: 18px; padding: 10px 24px; opacity: 0; white-space: nowrap; }
  .chip.amb { border-color: #f5b94a; color: #f5b94a; }
  .rot2 { position: absolute; left: 50%; padding: 14px 30px; border-radius: 16px; background: #f5b94a; color: #1a1205; font-size: 48px; font-weight: 900;
    letter-spacing: -.01em; opacity: 0; white-space: nowrap; }
  .grande { position: absolute; left: 50%; font-size: 150px; line-height: 1; font-weight: 900; letter-spacing: -.04em; color: #f5b94a;
    text-shadow: 0 6px 40px rgba(0,0,0,.75); opacity: 0; white-space: nowrap; font-variant-numeric: tabular-nums; }
  .grande.rojo { color: #f87171; }
  .mini { position: absolute; left: 50%; font-size: 40px; font-weight: 850; color: #fff; background: rgba(9,14,27,.88); border: 2px solid rgba(245,185,74,.6);
    border-radius: 14px; padding: 8px 20px; opacity: 0; white-space: nowrap; }
  .mini b { color: #f5b94a; }
  .iconos { position: absolute; left: 70px; display: flex; gap: 22px; }
  .iconos .ic { width: 150px; text-align: center; background: rgba(9,14,27,.82); border: 2px solid rgba(226,232,240,.45); border-radius: 20px; padding: 14px 0 10px; opacity: 0; }
  .iconos .ic svg { width: 78px; height: 78px; display: block; margin: 0 auto 6px; }
  .iconos .ic span { font-size: 28px; font-weight: 800; color: #e2e8f0; }
  .factura { position: absolute; left: 70px; width: 560px; background: #f8fafc; border-radius: 22px; padding: 20px 26px 22px 70px; opacity: 0;
    box-shadow: 0 18px 50px rgba(0,0,0,.55); color: #0f172a; }
  .factura small { display: block; font: 700 21px/1.3 ${MONO}; letter-spacing: .12em; color: #475569; margin: 0 0 10px -44px; }
  .factura .fl { position: relative; font-size: 38px; font-weight: 750; line-height: 1.05; padding: 9px 12px; border-radius: 10px; border-bottom: 2px dashed #cbd5e1; }
  .factura .fl.ie { color: #0f172a; }
  .factura .fl.ie i { position: absolute; inset: 0; border-radius: 10px; background: #f5b94a; transform-origin: left center; transform: scaleX(0); z-index: -1; }
  .factura .lista { position: relative; z-index: 0; }
  .factura .llave { position: absolute; left: -44px; top: 6px; bottom: 6px; width: 26px; border: 6px solid #f5b94a; border-right: none; border-radius: 14px 0 0 14px; opacity: 0; }
  .factura .base { margin-top: 12px; font-size: 38px; font-weight: 900; padding: 9px 12px; border-radius: 10px; background: #e2e8f0; color: #334155; }
  .factura .iva { margin-top: 8px; font-size: 38px; font-weight: 750; padding: 6px 12px; color: #334155; }
  .contador { position: absolute; left: 50%; font-size: 170px; line-height: 1; font-weight: 900; letter-spacing: -.04em; color: #f87171;
    text-shadow: 0 6px 40px rgba(0,0,0,.8); opacity: 0; white-space: nowrap; font-variant-numeric: tabular-nums; }
`;

// Mundo 3D propio de este vídeo (se añade al de tres.js): surtidor gigante con pantalla, la columna de un litro, lupa,
// mapa de la UE en losas, balancín de petróleo, refinería, bidones, billete y la factura de la mano. Todo se apaga al
// principio de cada fotograma (X.apagar()) para que no se cuele en otra escena.
const SCRIPT = `
const BASE = ${BASE}, IMP_LEY = ${IMP_LEY}, IMP_NOV = ${IMP_NOV}, TIPO = ${TIPO}, KM = 2.4;   // KM: metros de columna por euro
const H_VASO = (BASE + IMP_LEY) * (1 + TIPO) * KM + 0.1;
// data-m="k": aparece en la marca k de la escena (-1 = al empezar); data-hasta="k": se va en la marca k; data-d: retraso (s).
function aparecen(s, e, el) {
  const M = e.seg.flatMap(g => g.marcas);
  el.querySelectorAll('[data-m]').forEach(n => {
    const k = +n.dataset.m, at = (k < 0 ? 0.12 : (M[k] != null ? M[k] : 1 + k)) + (+n.dataset.d || 0);
    let p = rebote(tramo(s, at - 0.1, at + 0.3));
    if (n.dataset.hasta != null) { const h = M[+n.dataset.hasta]; if (h != null) p *= 1 - tramo(s, h - 0.25, h); }
    aparece3(n, p);
  });
}
const X3 = (() => {
  const W = W3, T = W.T, S = W.S, objs = [];
  const grupo = () => { const g = new T.Group(); g.visible = false; S.add(g); objs.push(g); return g; };
  const mat = (c, o) => new T.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.55, metalness: 0.08 }, o || {}));
  const pieza = (g, geo, m, x, y, z) => { const o = new T.Mesh(geo, m); o.position.set(x, y, z); o.castShadow = true; o.receiveShadow = true; g.add(o); return o; };
  const caja = (g, w, h, d, m, x, y, z) => pieza(g, new T.BoxGeometry(w, h, d), m, x, y, z);
  const cil = (g, r1, r2, h, m, x, y, z, n) => pieza(g, new T.CylinderGeometry(r1, r2, h, n || 28), m, x, y, z);
  const lienzo = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const tx = new T.CanvasTexture(c); tx.encoding = T.sRGBEncoding; tx.anisotropy = 4; return { c, x: c.getContext('2d'), tx, clave: null }; };
  // Funde un grupo (op 0..1) respetando la opacidad propia de cada material.
  const fundir = (g, op) => g.traverse(o => { if (!o.material) return; (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => {
    if (m.userData.op0 == null) m.userData.op0 = m.opacity; m.transparent = true; m.opacity = op * m.userData.op0; m.depthWrite = op > 0.99 && m.userData.op0 >= 1; }); });
  const r40 = (v) => Math.round(v * 40) / 40;

  // ——— surtidor gigante: cuerpo, pantalla con el precio, cabecera «SIN PLOMO 95», manguera y boquerel ———
  const surG = grupo();
  const mCuerpo = mat(0xd3dae4, { roughness: 0.42 }), mOsc = mat(0x1e293b, { roughness: 0.6, metalness: 0.2 }), mNegro = mat(0x0b1020, { roughness: 0.7 });
  caja(surG, 2.15, 0.22, 1.3, mOsc, 0, 0.11, 0);
  caja(surG, 1.85, 3.1, 0.95, mCuerpo, 0, 1.77, 0);
  caja(surG, 1.86, 0.1, 0.96, mat(0x64748b), 0, 0.95, 0);
  caja(surG, 1.68, 1.32, 0.05, mOsc, 0, 2.5, 0.48);
  const pant = lienzo(1024, 768);
  const mPant = new T.MeshBasicMaterial({ map: pant.tx, toneMapped: false });
  pieza(surG, new T.PlaneGeometry(1.58, 1.185), mPant, 0, 2.5, 0.512).castShadow = false;
  caja(surG, 2.0, 0.46, 1.08, mOsc, 0, 3.55, 0);
  const cab = lienzo(1024, 220);
  cab.x.fillStyle = '#1e293b'; cab.x.fillRect(0, 0, 1024, 220); cab.x.fillStyle = '#e2e8f0'; cab.x.font = '900 120px Inter, sans-serif';
  cab.x.textAlign = 'center'; cab.x.textBaseline = 'middle'; cab.x.fillText('SIN PLOMO 95', 512, 116); cab.tx.needsUpdate = true;
  pieza(surG, new T.PlaneGeometry(1.92, 0.412), new T.MeshBasicMaterial({ map: cab.tx, toneMapped: false }), 0, 3.55, 0.545).castShadow = false;
  caja(surG, 0.16, 0.6, 0.36, mOsc, 1.0, 1.75, 0.12);
  const boq = new T.Group(); boq.position.set(1.13, 1.78, 0.12); surG.add(boq);
  caja(boq, 0.11, 0.42, 0.16, mNegro, 0, 0, 0); caja(boq, 0.08, 0.08, 0.36, mNegro, 0, 0.17, 0.2);
  const curva = new T.CatmullRomCurve3([new T.Vector3(0.93, 2.55, 0.28), new T.Vector3(1.28, 2.0, 0.42), new T.Vector3(1.36, 0.7, 0.46), new T.Vector3(1.25, 0.32, 0.32), new T.Vector3(1.15, 1.56, 0.14)]);
  pieza(surG, new T.TubeGeometry(curva, 48, 0.05, 8), mNegro, 0, 0, 0);
  const luzSur = new T.PointLight(0xf5b94a, 0, 7, 1.6); luzSur.position.set(0, 2.5, 1.6); surG.add(luzSur);
  // Pantalla: título, fila 1 (gris, tachable) y fila 2 (ámbar, con flecha ▼ o ▲). Se redibuja solo si cambia.
  function dibPantalla(o) {
    const op1 = r40(o.op1 == null ? 1 : o.op1), tach = r40(o.tach || 0), op2 = r40(o.op2 == null ? 1 : o.op2), esc2 = r40(o.esc2 || 1), br = r40(o.brillo || 0);
    const clave = [o.titulo, o.f1, o.f2, o.flecha, op1, tach, op2, esc2, br].join('|');
    if (clave === pant.clave) return; pant.clave = clave;
    const x = pant.x, w = 1024, h = 768;
    x.clearRect(0, 0, w, h); x.fillStyle = '#0a1120'; x.beginPath(); x.roundRect(4, 4, w - 8, h - 8, 30); x.fill(); x.strokeStyle = '#334155'; x.lineWidth = 8; x.stroke();
    x.textAlign = 'center'; x.textBaseline = 'alphabetic';
    x.fillStyle = '#94a3b8'; x.font = '800 60px Inter, sans-serif'; x.fillText(o.titulo, w / 2, 96);
    x.globalAlpha = op1; x.fillStyle = '#cbd5e1'; x.font = '900 178px Inter, sans-serif'; x.fillText(o.f1, w / 2, 300);
    const w1 = x.measureText(o.f1).width;
    if (tach > 0) { x.strokeStyle = '#f87171'; x.lineWidth = 18; x.lineCap = 'round'; x.beginPath(); const xa = w / 2 - w1 / 2 - 16; x.moveTo(xa, 244); x.lineTo(xa + (w1 + 32) * tach, 244 - 30 * tach); x.stroke(); }
    x.globalAlpha = op2;
    x.font = '900 250px Inter, sans-serif'; const k0 = Math.min(1, 900 / (x.measureText(o.f2).width + (o.flecha ? 0.62 * 250 : 0)));
    const fs = Math.round(250 * k0 * esc2); x.font = '900 ' + fs + 'px Inter, sans-serif';
    const w2 = x.measureText(o.f2).width, fl = fs * 0.36, x2 = w / 2 + (o.flecha ? fl * 0.62 : 0), yb = 600 + (esc2 - 1) * 60;
    x.shadowColor = 'rgba(245,185,74,' + (0.25 + 0.6 * br) + ')'; x.shadowBlur = 20 + 50 * br; x.fillStyle = '#f5b94a';
    x.fillText(o.f2, x2, yb);
    if (o.flecha) { const ax = x2 - w2 / 2 - fl * 0.8, ay = yb - fs * 0.36; x.beginPath();
      if (o.flecha < 0) { x.moveTo(ax - fl / 2, ay - fl / 2); x.lineTo(ax + fl / 2, ay - fl / 2); x.lineTo(ax, ay + fl / 2); }
      else { x.moveTo(ax - fl / 2, ay + fl / 2); x.lineTo(ax + fl / 2, ay + fl / 2); x.lineTo(ax, ay - fl / 2); }
      x.closePath(); x.fill(); }
    x.shadowBlur = 0; x.globalAlpha = 1; pant.tx.needsUpdate = true;
  }
  function surtidor(o) {
    surG.visible = true; surG.position.set(o.x || 0, 0, o.z || 0); surG.rotation.y = o.rot || 0;
    const op = o.op == null ? 1 : o.op, hund = 1 - op;
    surG.scale.set(o.esc || 1, (o.esc || 1) * (1 - 0.6 * hund), o.esc || 1); fundir(surG, op); surG.visible = op > 0.01;
    luzSur.intensity = (o.luz || 0) * 3; if (o.pantalla) dibPantalla(o.pantalla);
  }

  // ——— columna de un litro: vaso; dentro, gasolina (blanca), impuesto (rojo), su hueco (ámbar), IVA (rosa) y el hueco del IVA ———
  const colG = grupo(); const Y0 = 0.07;
  const vaso = new T.Mesh(new T.CylinderGeometry(0.7, 0.7, H_VASO, 48, 1, true), new T.MeshStandardMaterial({ color: 0xa5b8d8, roughness: 0.15, metalness: 0.1, transparent: true, opacity: 0.16, side: T.DoubleSide, depthWrite: false }));
  vaso.position.y = Y0 + H_VASO / 2; colG.add(vaso);
  const mAro = new T.MeshStandardMaterial({ color: 0xcbd5e1, emissive: 0x94a3b8, emissiveIntensity: 0.3, roughness: 0.4 });
  [Y0 + 0.01, Y0 + H_VASO].forEach(y => { const a = new T.Mesh(new T.TorusGeometry(0.7, 0.035, 8, 48), mAro); a.rotation.x = Math.PI / 2; a.position.y = y; colG.add(a); });
  cil(colG, 0.78, 0.8, Y0, mat(0x334155), 0, Y0 / 2, 0, 48);
  const cilU = new T.CylinderGeometry(1, 1, 1, 44);
  const tramoC = (col, r, op, emi) => { const m = new T.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: emi, roughness: 0.35, transparent: op < 1, opacity: op, depthWrite: op >= 1 });
    const o = new T.Mesh(cilU, m); o.scale.set(r, 1, r); o.castShadow = op >= 1; o.userData.col = col; o.userData.emi = emi; colG.add(o); return o; };
  const hueco = (r) => { const o = new T.Mesh(cilU, new T.MeshStandardMaterial({ color: 0xf5b94a, emissive: 0xf5b94a, emissiveIntensity: 0.85, roughness: 0.4, transparent: true, opacity: 0.6, depthWrite: false })); o.scale.set(r, 1, r); colG.add(o); return o; };
  const sG = tramoC(0xe6ebf2, 0.6, 0.94, 0.14), sI = tramoC(0xef4444, 0.6, 1, 0.38), sFI = hueco(0.6), sV = tramoC(0xfb7185, 0.645, 0.92, 0.36), sFV = hueco(0.645);
  const env = new T.Mesh(new T.CylinderGeometry(1, 1, 1, 44, 1, true), new T.MeshBasicMaterial({ color: 0xfb7185, transparent: true, opacity: 0.2, side: T.DoubleSide, depthWrite: false, blending: T.AdditiveBlending }));
  env.scale.set(0.645, 1, 0.645); colG.add(env);
  const AMB = new T.Color(0xf5b94a);
  const resaltar = (m, q) => { m.material.emissive.setHex(m.userData.col).lerp(AMB, q); m.material.emissiveIntensity = m.userData.emi + 0.5 * q; };
  // o = { x, z, g (gasolina 0..1), imp (€), fi (hueco del impuesto, €), iva (0..1), fv (hueco del IVA, €), env (envoltura 0..1), resI, resV, op }
  // Devuelve los tramos [y0, y1] de cada parte para colocar los rótulos.
  function columna(o) {
    colG.visible = true; colG.position.set(o.x || 0, 0, o.z || 0);
    const g = o.g == null ? 1 : o.g, imp = o.imp == null ? IMP_LEY : o.imp, vq = o.iva || 0;
    let y = Y0;
    const pon = (m, h) => { const y0 = y; m.visible = h > 0.004; m.scale.y = Math.max(h, 0.001); m.position.y = y + h / 2; y += h; return [y0, y]; };
    const r = { g: pon(sG, BASE * g * KM), i: pon(sI, imp * KM), fi: pon(sFI, (o.fi || 0) * KM), v: pon(sV, TIPO * (BASE * g + imp) * KM * vq), fv: pon(sFV, (o.fv || 0) * KM) };
    const ev = o.env || 0, alto = r.i[1] - Y0; env.visible = ev > 0.01; env.scale.y = Math.max(0.001, alto); env.position.y = Y0 + alto / 2; env.material.opacity = 0.24 * ev;
    resaltar(sI, o.resI || 0); resaltar(sV, o.resV || 0);
    return r;
  }

  // ——— lupa ámbar ———
  const lupaG = grupo();
  const mL = new T.MeshStandardMaterial({ color: 0xf5b94a, emissive: 0xf5b94a, emissiveIntensity: 0.6, roughness: 0.35, metalness: 0.3 });
  pieza(lupaG, new T.TorusGeometry(0.52, 0.075, 14, 48), mL, 0, 0, 0);
  pieza(lupaG, new T.CircleGeometry(0.52, 40), new T.MeshBasicMaterial({ color: 0xf5b94a, transparent: true, opacity: 0.18, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide }), 0, 0, 0).castShadow = false;
  const mango = pieza(lupaG, new T.CylinderGeometry(0.075, 0.09, 0.95, 16), mL, 0.66, -0.66, 0); mango.rotation.z = Math.PI / 4;
  function lupa(o) { lupaG.visible = true; lupaG.position.set(o.x, o.y, o.z); lupaG.lookAt(W.cam.position); lupaG.scale.setScalar(Math.max(0.001, o.esc == null ? 1 : o.esc)); }

  // ——— mapa de la UE en losas (un cuadrado por país, en su sitio aproximado) ———
  const mapaG = grupo();
  const PAISES = [['FI',5,0],['SE',4,1],['EE',5,1],['IE',0,2],['DK',3,2],['LV',5,2],['NL',2,3],['DE',3,3],['PL',4,3],['LT',5,3],['BE',1,4],['LU',2,4],['CZ',3,4],['SK',4,4],
    ['FR',1,5],['AT',3,5],['HU',4,5],['RO',5,5],['PT',0,6],['ES',1,6],['IT',2,6],['SI',3,6],['HR',4,6],['BG',5,6],['MT',2,7],['GR',4,7],['CY',6,7]];
  const PASO = 1.05, NC = 7, NF = 8;
  const losas = PAISES.map(([c, col, fil]) => ({ c, col, fil, o: caja(mapaG, 0.92, 0.24, 0.92, mat(0x334155, { roughness: 0.5 }), (col - (NC - 1) / 2) * PASO, 0.12, (fil - (NF - 1) / 2) * PASO) }));
  const rot = lienzo(NC * 128, NF * 128);
  const capa = new T.Mesh(new T.PlaneGeometry(NC * PASO, NF * PASO), new T.MeshBasicMaterial({ map: rot.tx, transparent: true, depthWrite: false, toneMapped: false }));
  capa.rotation.x = -Math.PI / 2; capa.position.set(0, 0.37, 0); mapaG.add(capa);
  const BLANCO = new T.Color(0xf1f5f9), PIZARRA = new T.Color(0x334155), NEGRO3 = new T.Color(0x000000);
  function mapa(o) {
    mapaG.visible = true; mapaG.position.set(o.x || 0, 0, o.z || 0);
    const luces = losas.map(l => Math.max(0, Math.min(1, o.luz(l.c))));
    losas.forEach((l, i) => { const m = l.o.material, q = luces[i]; m.color.copy(PIZARRA).lerp(BLANCO, q); m.emissive.copy(NEGRO3).lerp(BLANCO, 0.45 * q); l.o.position.y = 0.12 + 0.12 * q; });
    const clave = luces.map(q => q > 0.5 ? 1 : 0).join('');
    if (clave !== rot.clave) { rot.clave = clave; const x = rot.x; x.clearRect(0, 0, NC * 128, NF * 128); x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = '900 52px Inter, sans-serif';
      losas.forEach((l, i) => { x.fillStyle = luces[i] > 0.5 ? '#0a1120' : '#cbd5e1'; x.fillText(l.c, (l.col + 0.5) * 128, (l.fil + 0.5) * 128 + 3); }); rot.tx.needsUpdate = true; }
  }

  // ——— balancín de petróleo ———
  const balG = grupo(); const mB = mat(0x7b8aa3), mB2 = mat(0x3c4a63);
  caja(balG, 2.8, 0.16, 0.9, mB2, 0.2, 0.08, 0);
  [-0.24, 0.24].forEach(z => { caja(balG, 0.1, 2.2, 0.1, mB, -0.18, 1.15, z).rotation.z = 0.14; caja(balG, 0.1, 2.2, 0.1, mB, 0.38, 1.15, z).rotation.z = -0.14; });
  const viga = new T.Group(); viga.position.set(0.1, 2.25, 0); balG.add(viga);
  caja(viga, 3.1, 0.2, 0.22, mB, 0.25, 0, 0); caja(viga, 0.34, 0.8, 0.26, mB, 1.85, -0.2, 0); caja(viga, 0.5, 0.34, 0.34, mB2, -1.2, -0.12, 0);
  const varilla = caja(balG, 0.045, 1.7, 0.045, mB2, 2.08, 0.95, 0); caja(balG, 0.34, 0.44, 0.34, mB2, 2.08, 0.38, 0);
  const contra = cil(balG, 0.5, 0.5, 0.16, mB2, -0.95, 0.95, 0.34); contra.rotation.x = Math.PI / 2;
  function balancin(o) { const op = o.op == null ? 1 : o.op; balG.visible = op > 0.01; balG.position.set(o.x || 0, 0, o.z || 0); balG.rotation.y = o.rot || 0;
    const e_ = o.esc || 1; balG.scale.set(e_, e_ * (1 - 0.6 * (1 - op)), e_); const a = 0.2 * Math.sin((o.t || 0) * 2.4); viga.rotation.z = a; varilla.position.y = 0.95 - a * 1.9; fundir(balG, op); }

  // ——— refinería: torres, depósito, chimenea con llama y tuberías ———
  const refG = grupo(); const mR = mat(0xa3b1c6), mR2 = mat(0x64748b);
  cil(refG, 0.34, 0.38, 3.7, mR, -0.7, 1.85, 0); [0.9, 1.8, 2.7, 3.6].forEach(y => cil(refG, 0.43, 0.43, 0.08, mR2, -0.7, y, 0));
  cil(refG, 0.48, 0.52, 2.6, mR, 0.3, 1.3, -0.35); [1.2, 2.5].forEach(y => cil(refG, 0.56, 0.56, 0.08, mR2, 0.3, y, -0.35));
  cil(refG, 0.85, 0.85, 1.15, mR2, 1.45, 0.58, 0.4, 36); cil(refG, 0.86, 0.6, 0.25, mR, 1.45, 1.27, 0.4, 36);
  cil(refG, 0.13, 0.17, 4.8, mR2, -1.55, 2.4, -0.55);
  const llama = pieza(refG, new T.ConeGeometry(0.16, 0.55, 12), new T.MeshBasicMaterial({ color: 0xf5b94a, transparent: true, opacity: 0.95 }), -1.55, 5.08, -0.55); llama.castShadow = false;
  caja(refG, 1.0, 0.11, 0.11, mR2, -0.2, 2.3, -0.18); caja(refG, 1.2, 0.11, 0.11, mR2, 0.9, 0.95, 0.05);
  function refineria(o) { const op = o.op == null ? 1 : o.op; refG.visible = op > 0.01; refG.position.set(o.x || 0, 0, o.z || 0); refG.rotation.y = o.rot || 0;
    const e_ = o.esc || 1; refG.scale.set(e_, e_ * (1 - 0.6 * (1 - op)), e_); llama.scale.set(1, 0.8 + 0.3 * Math.abs(Math.sin((o.t || 0) * 9)), 1); fundir(refG, op); }

  // ——— cinco bidones de 10 litros ———
  const bidG = grupo(); const mBid = mat(0xd3dae4, { roughness: 0.45 }), mTap = mat(0x475569);
  const bids = [0, 1, 2, 3, 4].map(() => { const g = new T.Group(); bidG.add(g);
    caja(g, 0.46, 0.62, 0.24, mBid, 0, 0.31, 0); caja(g, 0.28, 0.07, 0.08, mTap, -0.03, 0.67, 0); cil(g, 0.055, 0.055, 0.1, mTap, 0.15, 0.66, 0);
    caja(g, 0.3, 0.3, 0.02, mat(0xb4bdcb), 0, 0.3, 0.125); return g; });
  function bidones(o) { bidG.visible = true; bidG.position.set(o.x || 0, 0, o.z || 0); bidG.rotation.y = o.rot || 0;
    bids.forEach((g, i) => { const q = o.q ? o.q(i) : 1; g.visible = q > 0.01; g.position.set((i - 2) * 0.62, 0.25 * (1 - q), 0); g.scale.setScalar(Math.max(0.001, q)); }); }

  // ——— billete rojo de 5 € (el IVA que se va) ———
  const bil = lienzo(512, 256), bx = bil.x;
  bx.fillStyle = '#ef4444'; bx.beginPath(); bx.roundRect(4, 4, 504, 248, 26); bx.fill(); bx.strokeStyle = 'rgba(255,255,255,.7)'; bx.lineWidth = 8; bx.beginPath(); bx.roundRect(22, 22, 468, 212, 18); bx.stroke();
  bx.fillStyle = '#fff'; bx.font = '900 150px Inter, sans-serif'; bx.textAlign = 'center'; bx.textBaseline = 'middle'; bx.fillText('5 €', 256, 136); bil.tx.needsUpdate = true;
  const bilG = grupo(); const bm = new T.Mesh(new T.PlaneGeometry(0.96, 0.48), new T.MeshBasicMaterial({ map: bil.tx, side: T.DoubleSide, transparent: true, toneMapped: false })); bilG.add(bm);
  function billete(o) { bilG.visible = (o.op == null ? 1 : o.op) > 0.01; bilG.position.set(o.x, o.y, o.z); bilG.rotation.set(o.rx || 0, o.ry || 0, o.rz || 0); bilG.scale.setScalar(o.esc || 1); bm.material.opacity = o.op == null ? 1 : o.op; }

  // ——— la factura que sostiene el maniquí (esquema: líneas y una en ámbar) ———
  const hoj = lienzo(256, 360), hx = hoj.x;
  hx.fillStyle = '#f8fafc'; hx.fillRect(0, 0, 256, 360); hx.fillStyle = '#0f172a'; hx.font = '900 30px Inter, sans-serif'; hx.fillText('LUZ', 22, 46);
  [90, 130, 170, 250].forEach(y => { hx.fillStyle = '#94a3b8'; hx.fillRect(22, y, 212, 14); }); hx.fillStyle = '#f5b94a'; hx.fillRect(16, 204, 224, 26); hx.fillStyle = '#334155'; hx.fillRect(22, 300, 120, 22); hoj.tx.needsUpdate = true;
  const hojaG = grupo(); const hm = new T.Mesh(new T.PlaneGeometry(0.44, 0.62), new T.MeshStandardMaterial({ map: hoj.tx, roughness: 0.8, side: T.DoubleSide, emissive: 0xffffff, emissiveMap: hoj.tx, emissiveIntensity: 0.25 })); hojaG.add(hm);
  function hoja(o) { hojaG.visible = true; hojaG.position.set(o.x, o.y, o.z); hojaG.rotation.set(o.rx || 0, o.ry || 0, 0); }

  function apagar() { objs.forEach(g => { g.visible = false; }); luzSur.intensity = 0; }
  return { surtidor, columna, lupa, mapa, balancin, refineria, bidones, billete, hoja, apagar };
})();
W3.X = X3;
`;

const an = function (s, e, el) { aparecen(s, e, el); };
const fuente = (txt) => `<div class="fuente">${txt}</div>`;
const NOTA = '<div class="nota">Península y Baleares · gasolina 95 · noviembre de 2026</div>';
const FUENTE_GANCHO = fuente('AEAT · RDL 25/2026 · Ley del IVA, arts. 78 y 90');
const SVG = (d) => `<svg viewBox="0 0 64 64" fill="none" stroke="#e2e8f0" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const ICONOS = [
  ['Luz', SVG('<path d="M32 8a16 16 0 0 0-9 29c2 2 3 4 3 7h12c0-3 1-5 3-7A16 16 0 0 0 32 8z"/><path d="M26 50h12M28 56h8"/>')],
  ['Tabaco', SVG('<rect x="6" y="28" width="44" height="10" rx="2"/><path d="M40 28v10"/><path d="M54 26c0-4 3-5 3-9M60 26c0-4 3-5 3-9" stroke-width="3"/>')],
  ['Alcohol', SVG('<path d="M20 8h24l-2 18a10 10 0 0 1-20 0z"/><path d="M32 36v16M22 56h20"/><path d="M22 18h20"/>')]
];

const ESCENAS = [
  // 0 · Gancho (fotograma 0 lleno): surtidor gigante con «−20 cts» tachado y «−24 cts» en ámbar; en el {pop}, el 24 salta.
  { html: () => `${NOTA}${FUENTE_GANCHO}`, anim: null },
  // 1 · La rebaja es en el impuesto: el bloque rojo (47 cts, ley) encoge hasta 27 (noviembre). Tarjeta: fijo por litro.
  { html: () => `<div class="tj roja" data-t="translateX(-50%)" data-m="1" style="top:1262px"><small>IMPUESTO DE HIDROCARBUROS</small>
        <span class="l">Fijo <span class="r">por litro</span></span></div>
      ${fuente('Ley 38/1992, art. 50 · AEAT, tipos de nov. de 2026')}`, anim: an },
  // 2 · El IVA (21 %) envuelve la columna, también el impuesto: 20 menos de impuesto = 4 menos de IVA → 20 + 4 = 24.
  { html: () => `<div class="tj amb" data-t="translateX(-50%)" data-m="2" style="top:1262px"><small>REBAJA EN EL SURTIDOR</small>
        <span class="l"><span class="r">20</span> + <span class="a">4</span> = <span class="a">24</span> cts</span></div>
      ${fuente('Ley del IVA, art. 78 (base) y art. 90 (21 %)')}`, anim: an },
  // 3 · ¿IVA sobre un impuesto? El maniquí mira a cámara, «?» ámbar y la lupa sobre el impuesto envuelto por el IVA.
  { html: () => `<div class="rot2" data-t="translateX(-50%)" data-m="0" style="top:1180px;left:66%">IVA sobre impuesto</div>
      ${fuente('Ley del IVA, art. 78.Dos.4.º')}`, anim: an },
  // 4 · Es legal y no solo aquí: España se enciende y después toda la UE a la vez.
  { html: () => `<div class="chip" data-t="translateX(-50%)" data-m="-1" style="top:500px">✓ Es legal</div>
      <div class="tj" data-t="translateX(-50%)" data-m="1" style="top:1300px"><small>PARA TODA LA UE</small>
        <span class="l">Directiva 2006/112/CE · art. 78</span></div>
      ${fuente('DOUE L 347, 11/12/2006')}`, anim: an },
  // 5 · PICO: la cuenta al revés. Desaparecen petróleo, refinería y gasolinera; la gasolina se vacía; quedan 47 + su IVA = 0,57 €.
  { html: () => `<div class="chip amb" data-t="translateX(-50%)" data-m="-1" data-hasta="5" style="top:500px;left:64%">La cuenta al revés</div>
      <div class="contador" data-t="translateX(-50%)" style="top:500px">0,00 €</div>
      <div class="tj roja" data-t="translateX(-50%)" data-m="5" data-d="0.5" style="top:690px"><small>GASOLINA GRATIS</small>
        <span class="l">0,47 × 1,21 = <span class="r">0,57 €</span></span></div>
      ${fuente('Ley 38/1992, art. 50 · Ley del IVA, art. 90 (21 %)')}`,
    anim: function (s, e, el) {
      aparecen(s, e, el);
      const M = e.seg.flatMap(g => g.marcas), m = M[5] != null ? M[5] : 7, c = el.querySelector('.contador');
      const p = rebote(tramo(s, m - 0.1, m + 0.3)), v = 0.57 * sale(tramo(s, m - 0.05, m + 0.55));
      c.style.opacity = Math.min(1, p * 1.5); c.style.transform = 'translateX(-50%) scale(' + (0.7 + 0.3 * p) + ')';
      c.textContent = v.toFixed(2).replace('.', ',') + ' €';
    } },
  // 6 · Casi 10 de esos céntimos son IVA sobre el impuesto: unos 5 € cada 50 litros (sale un billete); este mes, 2,86 €.
  { html: () => `<div class="tj amb" data-t="" data-m="-1" style="top:496px;left:70px;transform-origin:left center"><small>IVA SOBRE EL IMPUESTO DE LEY</small>
        <span class="l"><span class="a">9,9 cts</span> por litro</span></div>
      <div class="tj roja" data-t="" data-m="0" style="top:668px;left:70px;transform-origin:left center"><small>CADA 50 LITROS</small>
        <span class="l">≈ <span class="r">5 €</span> <span style="font-size:34px;color:#cbd5e1;font-weight:750">(4,96 €)</span></span></div>
      <div class="mini" data-t="" data-m="1" style="top:842px;left:70px;transform-origin:left center">Este mes: <b>2,86 €</b></div>
      ${fuente('Impuesto: ley 47,269 cts/l · nov. 27,269 · IVA 21 %')}`, anim: an },
  // 7 · Luz, tabaco y alcohol, igual. La factura de la luz: el impuesto eléctrico entra en la base del IVA.
  { html: () => `<div class="iconos" style="top:496px">${ICONOS.map(([n, svg], i) => `<div class="ic" data-t="" data-m="${i - 1}">${svg}<span>${n}</span></div>`).join('')}</div>
      <div class="factura" data-t="" data-m="2" style="top:742px"><small>FACTURA DE LA LUZ · ESQUEMA</small>
        <div class="lista"><div class="llave"></div><div class="fl">Potencia</div><div class="fl">Energía</div><div class="fl ie"><i></i>Impuesto eléctrico</div></div>
        <div class="base">Base del IVA</div><div class="iva">IVA</div></div>
      ${fuente('Ley del IVA, art. 78.Dos.4.º (impuestos especiales)')}`,
    anim: function (s, e, el) {
      aparecen(s, e, el);
      const M = e.seg.flatMap(g => g.marcas), m = M[3] != null ? M[3] : 3.5;
      el.querySelector('.fl.ie i').style.transform = 'scaleX(' + sale(tramo(s, m, m + 0.7)) + ')';
      const b = sale(tramo(s, m + 0.8, m + 1.3)); el.querySelector('.llave').style.opacity = b;
      const base = el.querySelector('.base'); base.style.background = b > 0.5 ? '#f5b94a' : '#e2e8f0'; base.style.color = b > 0.5 ? '#1a1205' : '#334155';
    } },
  // 8 · Cierre (vuelve al encuadre del principio): «× 1,21»; al acabar la rebaja, +20 → +24 en el {pop}. Sin tarjeta final.
  { html: () => `<div class="grande" data-t="translateX(-50%)" data-m="0" data-hasta="1" style="top:540px">× 1,21</div>
      ${NOTA}${FUENTE_GANCHO}`, anim: an }
];

const TRES = function (t, k, s, e, W) {
  const X = W.X; X.apagar();
  const p = Math.min(1, s / (e.fin - e.ini)), M = e.seg.flatMap(g => g.marcas);
  const mk = (j, def) => e.ini + (M[j] != null ? M[j] : def);   // marca j de esta escena, en tiempo global
  const q = (a, d) => sale(tramo(t, a, a + (d || 0.45)));
  const AMB = '#f5b94a', ROJO = '#f87171', ROSA = '#fb7185', GRIS = '#94a3b8', BLANCO = '#e2e8f0';
  const fuera = { x: -60, z: -60, esc: 0 };
  const ang = (a, b, g) => a + ((((b - a + Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI) - Math.PI) * g;
  // Paseantes al fondo por dos aceras (dan vida al plano). Con `parar`, en ese instante se paran y miran hacia (mx, mz).
  const aceras = (i, a, n, z0, parar, mx, mz) => {
    if (i >= n) return fuera;
    const dir = i % 2 ? 1 : -1, tt = parar != null ? Math.min(t, parar) : t, u = (((tt * a.vel + a.u0) % 26) + 26) % 26 - 13;
    const x = dir * u, z = z0 - (i % 3) * 1.5; let rot = dir > 0 ? Math.PI / 2 : -Math.PI / 2, amp = 1;
    if (parar != null && t > parar) { const g = sale(tramo(t, parar, parar + 0.7)); rot = ang(rot, Math.atan2(mx - x, mz - z), g); amp = 1 - g; }
    return { x, z, rot, amp, fase: tt * a.vel * 4.5, esc: Math.min(1, (13 - Math.abs(u)) / 2) };
  };
  let directo = (i, a) => aceras(i, a, 10, -5);
  const mezcla = (P, Q, u) => P.map((v, j) => v + (Q[j] - v) * u);
  const camLerp = (P, Q, u) => W.camara(...mezcla(P, Q, u));
  // Rótulo pegado a la derecha (lado 1) o a la izquierda (lado -1) de un punto.
  const rotuloLado = (clave, texto, x, y, z, lado, op, css, alto) => { alto = alto || 0.4; const w = W.anchoRotulo(texto) * alto / 0.352; W.rotulo(clave, texto, x + lado * w / 2, y, z, op, css, alto); };

  // Surtidor y maniquí del gancho (escenas 0 y 8); A = encuadre del fotograma 0 y del último (bucle).
  const PX = 0.75, PZ = -0.3, PR = -0.12, PE = 1.2, HX = -0.95, HZ = 1.4;
  const A = [-0.15, 2.8, 8.9, 0.45, 2.7, 0], B = [0.15, 2.75, 7.9, 0.55, 2.75, 0];
  if (k === 0) {
    const m1 = mk(1, 2.6), pop = q(m1 - 0.04, 0.3) * (1 - 0.6 * tramo(t, m1 + 0.4, m1 + 1.2));
    X.surtidor({ x: PX, z: PZ, rot: PR, esc: PE, luz: pop,
      pantalla: { titulo: 'REBAJA', f1: '−20 cts', tach: 1, f2: '−24 cts', flecha: -1, esc2: 1 + 0.03 * Math.sin(t * 5) + 0.12 * pop, brillo: 0.3 + 0.2 * Math.sin(t * 5) + 0.5 * pop } });
    W.heroe({ x: HX, z: HZ, gira: 0.7 + 0.08 * Math.sin(t * 0.9), senala: 0.85 * q(m1 - 0.25, 0.35) * (1 - tramo(t, m1 + 1.0, m1 + 1.5)) });
    camLerp(A, B, p);
  } else if (k === 1) {
    // La columna (un litro) a la izquierda y los rótulos a la derecha.
    const CX = -0.75, m0 = mk(0, 0.8), m1 = mk(1, 2.2), enc = q(m1 + 0.25, 0.9), imp = IMP_LEY - 0.2 * enc;
    const r = X.columna({ x: CX, z: 0, imp, iva: 0 });
    const yI = (r.i[0] + r.i[1]) / 2, ap = q(m0 - 0.1, 0.3);
    rotuloLado('imp', 'IMPUESTO', CX + 0.85, yI + 0.26, 0, 1, ap, ROJO, 0.42);
    rotuloLado('cts', enc < 0.5 ? '47 cts · ley' : '27 cts · noviembre', CX + 0.85, yI - 0.24, 0, 1, ap, enc < 0.5 ? BLANCO : ROJO, 0.42);
    rotuloLado('gas', 'GASOLINA', CX + 0.85, (r.g[0] + r.g[1]) / 2 + 0.5, 0, 1, 1, GRIS, 0.38);
    W.niebla(16, 50);
    camLerp([0.55, 3.15, 10.2, 0.4, 2.85, 0], [0.45, 3.15, 9.5, 0.4, 2.9, 0], p);
  } else if (k === 2) {
    const CX = -0.6, m0 = mk(0, 1.2), m1 = mk(1, 2.6), m2 = mk(2, 4);
    const sube = q(e.ini + 0.05, 0.8), ev = q(m0 - 0.1, 0.5), enc = q(m1, 0.8);
    const r = X.columna({ x: CX, z: 0, imp: IMP_LEY - 0.2 * enc, fi: 0.2 * enc, iva: sube, fv: TIPO * 0.2 * enc, env: ev, resV: 0.3 * ev * (1 - enc) });
    const L = CX + 0.88;
    rotuloLado('iva', 'IVA 21 %', L, (r.v[0] + r.v[1]) / 2, 0, 1, sube, ROSA, 0.42);
    rotuloLado('imp2', 'IMPUESTO', L, (r.i[0] + r.i[1]) / 2, 0, 1, 1, ROJO, 0.42);
    rotuloLado('m20', '−20 cts', L, (r.fi[0] + r.fi[1]) / 2, 0, 1, q(m1 + 0.3, 0.3), AMB, 0.42);
    rotuloLado('m4', '−4 cts', L, r.fv[1] + 0.2, 0, 1, q(m2 - 0.05, 0.3), AMB, 0.42);
    W.niebla(14, 46);
    camLerp([0.35, 3.6, 8.3, 0.25, 3.45, 0], [0.3, 3.65, 7.8, 0.25, 3.5, 0], p);
  } else if (k === 3) {
    const CX = 0.45, m0 = mk(0, 0.8), m1 = mk(1, 2.0);
    const r = X.columna({ x: CX, z: 0, imp: IMP_NOV, iva: 1, env: 1, resI: 0.55 * q(m0 + 0.2, 0.4) * (0.75 + 0.25 * Math.sin(t * 7)) });
    const gira = 1.2 * (1 - q(e.ini, 0.6)), HX3 = -1.05, HZ3 = 1.6;
    W.heroe({ x: HX3, z: HZ3, gira });
    const preg = rebote(tramo(t, e.ini + 0.15, e.ini + 0.5)), preg2 = rebote(tramo(t, m1 - 0.1, m1 + 0.25));
    W.rotulo('preg', '?', HX3, 2.5 + 0.04 * Math.sin(t * 5), HZ3, Math.min(1, preg * 1.4), AMB, 0.6 + 0.2 * preg2);
    const yL = r.i[1] - 0.1, ll = q(m0 - 0.15, 0.6);
    X.lupa({ x: CX - 0.25 + 1.6 * (1 - ll), y: yL + 0.04 * Math.sin(t * 2.6), z: 1.0, esc: 0.72 * ll });
    W.niebla(14, 46);
    camLerp([-0.35, 3.15, 8.6, -0.1, 2.95, 0], [-0.3, 3.1, 8.0, -0.1, 2.95, 0], p);
  } else if (k === 4) {
    const m0 = mk(0, 0.6), m1 = mk(1, 1.6), todos = q(m1 - 0.05, 0.35);
    X.mapa({ luz: (c) => c === 'ES' ? 0.55 + 0.45 * q(m0 - 0.1, 0.3) * (0.85 + 0.15 * Math.sin(t * 7)) : todos });
    W.niebla(20, 60);
    const a = -0.07 + 0.14 * p; W.camara(Math.sin(a) * 11.6, 13.6 - 0.6 * p, Math.cos(a) * 11.6 + 1.2, 0, 0, 1.15);
  } else if (k === 5) {
    // La columna a la izquierda; a la derecha, la cadena que se aleja: gasolinera, refinería y petróleo. Desaparecen una a una.
    const CX = -1.25, CZ = 1.0;
    const m0 = mk(0, 1.2), m1 = mk(1, 3), m2 = mk(2, 4.5), m3 = mk(3, 5.2), m4 = mk(4, 5.9), m5 = mk(5, 7);
    const vac = (q(m2, 0.6) + q(m3, 0.6) + q(m4, 0.6)) / 3;
    const r = X.columna({ x: CX, z: CZ, imp: IMP_LEY, g: 1 - vac, iva: 1, env: 0.5, resV: 0.6 * q(m5, 0.4) });
    const SUR = [1.6, 1.2], REF = [0.3, -4.0], BAL = [3.0, -9.5];
    X.balancin({ x: BAL[0], z: BAL[1], rot: -0.2, esc: 1.0, t, op: 1 - q(m2, 0.5) });
    X.refineria({ x: REF[0], z: REF[1], rot: -0.2, esc: 0.85, t, op: 1 - q(m3, 0.5) });
    X.surtidor({ x: SUR[0], z: SUR[1], rot: -0.35, esc: 0.65, op: 1 - q(m4, 0.5), pantalla: { titulo: 'SIN PLOMO 95', f1: '', f2: '', flecha: 0 } });
    W.rotulo('t-pet', 'PETRÓLEO', BAL[0], 3.15, BAL[1], 1 - q(m2, 0.35), GRIS, 0.6);
    W.rotulo('t-ref', 'REFINERÍA', REF[0] + 1.35, 3.0, REF[1], 1 - q(m3, 0.35), GRIS, 0.5);
    W.rotulo('t-sur', 'GASOLINERA', SUR[0], 2.85, SUR[1], 1 - q(m4, 0.35), GRIS, 0.42);
    // Rótulos de la columna, delante de cada tramo.
    const ZR = CZ + 0.8, cer0 = q(m5 - 0.3, 1.3);
    W.rotulo('t-imp', 'IMPUESTO · 47 cts', CX, (r.i[0] + r.i[1]) / 2, ZR, q(m0 - 0.1, 0.3), ROJO, 0.4 - 0.15 * cer0);
    if (r.g[1] - r.g[0] > 0.45) W.rotulo('t-gas', 'GASOLINA: 0 €', CX, (r.g[0] + r.g[1]) / 2, ZR, q(m1 - 0.1, 0.3) * (1 - q(m4, 0.3)), BLANCO, 0.4);
    W.rotulo('t-iva', 'IVA', CX, r.v[1] + 0.22, ZR, q(m5, 0.3), ROSA, 0.4 - 0.15 * cer0);
    // Un maniquí rojo cobra (en el {caja}) y los del fondo se paran a mirar.
    const RX = CX + 1.35, RZ = CZ + 1.2, cobra = q(m5 - 0.15, 0.35);
    directo = (i, a) => i === 0 ? { x: RX, z: RZ, rot: -0.7, color: 0xef4444, cq: 0.2 + 0.8 * cobra, brillo: 0.4 } : aceras(i - 1, a, 10, -6.5, m5, CX, CZ);
    W.multitud(t, { directo });
    const ga = W.gente[0]; ga.der.hombro.rotation.x = -1.3 * cobra; ga.der.codo.rotation.x = -0.25;
    // Plano general que se acerca despacio y, en el {caja}, se cierra sobre la columna y el que cobra.
    const cer = q(m5 - 0.3, 1.3), P5 = mezcla([-0.75, 6.0, 12.9, -0.1, 2.35, -1.5], [-0.7, 5.8, 12.2, -0.1, 2.3, -1.5], p);
    camLerp(P5, [CX + 0.55, 2.05, CZ + 6.8, CX + 0.5, 1.2, CZ], cer);
    return;
  } else if (k === 6) {
    const CX = -0.9, CZ = 0, m0 = mk(0, 2.3);
    const r = X.columna({ x: CX, z: CZ, imp: IMP_LEY, g: 0, iva: 1, env: 0.5, resV: 0.85 * (0.8 + 0.2 * Math.sin(t * 6)) });
    const BX = 1.15, BZ = 1.3;
    X.bidones({ x: BX, z: BZ, rot: -0.5, q: (i) => rebote(tramo(t, m0 - 0.15 + i * 0.09, m0 + 0.2 + i * 0.09)) });
    W.rotulo('l50', '50 litros', BX, 1.15, BZ, q(m0 + 0.35, 0.3), BLANCO, 0.34);
    const yV = (r.v[0] + r.v[1]) / 2, v = tramo(t, m0 + 0.1, m0 + 1.4), ev = sale(v);
    X.billete({ x: CX + 0.1 + 1.95 * ev, y: yV + 1.1 * Math.sin(ev * Math.PI * 0.85) + 0.75 * ev, z: CZ + 0.6 + 0.5 * ev, rx: -0.2, ry: -0.3 + 0.3 * ev + 0.15 * Math.sin(t * 2), rz: 4 * Math.PI * ev + 0.12 * Math.sin(t * 3),
      esc: 0.3 + 0.55 * sale(tramo(t, m0 + 0.1, m0 + 0.5)), op: v > 0 ? 1 : 0 });
    W.niebla(14, 46);
    camLerp([0.05, 2.4, 8.6, 0.0, 1.55, 0], [0.05, 2.3, 8.0, 0.0, 1.5, 0], p);
  } else if (k === 7) {
    const m2 = mk(2, 2.4), HX7 = 1.0, HZ7 = 0.9, g7 = -0.38 + 0.06 * Math.sin(t * 0.8);
    W.heroe({ x: HX7, z: HZ7, gira: g7, luz: 1 });
    const H = W.H, sube = q(m2 - 0.3, 0.45);
    H.izq.hombro.rotation.x = H.der.hombro.rotation.x = -0.72 * sube; H.izq.codo.rotation.x = H.der.codo.rotation.x = -0.22 - 1.0 * sube;
    H.izq.hombro.rotation.z = 0.1 - 0.28 * sube; H.der.hombro.rotation.z = -0.1 + 0.28 * sube;
    if (sube > 0.05) X.hoja({ x: HX7 + Math.sin(g7) * 0.62, y: 1.0 + 0.42 * sube, z: HZ7 + Math.cos(g7) * 0.62, rx: -0.25, ry: g7 });
    directo = (i, a) => aceras(i, a, 8, -5.5);
    W.niebla(12, 40);
    camLerp([0.0, 1.95, 7.1, 0.15, 1.5, 0], [0.05, 1.9, 6.5, 0.2, 1.5, 0], p);
  } else {
    const m0 = mk(0, 1.4), m1 = mk(1, 2.6), m3 = mk(3, 5.5), sub = t > m1 - 0.05, pop = q(m3 - 0.04, 0.3) * (1 - 0.6 * tramo(t, m3 + 0.4, m3 + 1.2));
    const x121 = q(m0 - 0.05, 0.3) * (1 - q(m1 - 0.2, 0.3));
    const pantalla = sub ? { titulo: 'AL ACABAR LA REBAJA', f1: '+20 cts', tach: q(m3 - 0.04, 0.35), f2: '+24 cts', flecha: 1, op2: q(m3 - 0.04, 0.25), esc2: 1 + 0.12 * pop + 0.03 * Math.sin(t * 5) * q(m3, 0.3), brillo: 0.3 + 0.5 * pop }
      : { titulo: 'REBAJA', f1: '−20 cts', tach: 1, f2: '−24 cts', flecha: -1, esc2: 1 + 0.03 * Math.sin(t * 5) + 0.1 * x121, brillo: 0.3 + 0.2 * Math.sin(t * 5) + 0.4 * x121 };
    X.surtidor({ x: PX, z: PZ, rot: PR, esc: PE, luz: Math.max(pop, 0.6 * x121), pantalla });
    W.heroe({ x: HX, z: HZ, gira: 0.7 + 0.08 * Math.sin(t * 0.9), senala: 0.85 * q(m3 - 0.25, 0.35) * (1 - tramo(t, m3 + 0.9, m3 + 1.4)) });
    camLerp([0.35, 2.7, 7.6, 0.6, 2.75, 0], A, sale(p));
  }
  W.multitud(t, { directo });
};

const pildoras = {
  'es-iva-sobre-impuesto': pildora3d({
    slug: 'es-iva-sobre-impuesto', cuenta: 'es',
    T: { es: { titulo: 'La rebaja de 20 céntimos en la gasolina no son 20: son 24', guion: GUION } },
    fijo: () => `<div class="hud i fmt">HACEMOS LA CUENTA</div><div class="hud d"><i></i><span id="reloj">00:00</span></div>`,
    cssExtra: CSS, scriptExtra: SCRIPT,
    escenas: ESCENAS, tres: TRES,
    texto: { es: TEXTO }
  })
};

module.exports = { pildoras };
