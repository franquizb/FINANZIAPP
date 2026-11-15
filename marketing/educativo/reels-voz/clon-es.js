// Experimento «clon de estructura» · @finanziapp.es (España), en 3D (reels-voz/tres.js), formato «fábula explicada».
// es-tin-vs-tae · «TIN contra TAE.» El esqueleto copiado es la variante B de investigacion/2026-11-esqueleto-viral.md
// (beats en los mismos segundos, respuesta guardada hasta el ~80 %, rótulos en lugar de subtítulos, voz seca, pausa de ~8 s
// sin voz con zumbido, sin música ni HUD y final mudo que empalma con el fotograma 0).
// Guion, tabla de montaje, rótulos, cuentas, fuentes, texto y portada: guiones/2026-11-clon-estructura.md (sección «España»).
// Respecto al guion no cambia ninguna palabra de la voz ni ningún dato. Ajuste de montaje aplicado (lo prevé el guion):
// la pausa baja de 8,4 a 7,9 s porque con la locución real «TAE» caía después de los 46,5 s (ver PAUSA_S abajo).
// Caducidad: habla del Black Friday (27-11-2026): publicar antes. Antes de publicar, comprobar en el BOE la Ley 16/2011.
//
// Fuentes (con fecha):
// - Banco de España, Portal del Cliente Bancario, «¿Publicidad? …siempre nos quedará la TAE» (18/05/2018): tableta de 500 €
//   a 12 meses «sin intereses» (0 %) con 10 € de gastos de gestión → TAE 3,81 %. No dice cuándo se pagan los gastos.
//   https://clientebancario.bde.es/pcb/es/blog/Publicidad__%25E2%2580%25A6s_e9bdc325cce6361.html
// - Banco de España, Portal del Cliente Bancario, «¡Cuidado con el coste de la financiación!» (01/03/2019): definiciones de
//   TIN y TAE; un préstamo puede tener TIN 0 % y TAE positiva. https://clientebancario.bde.es/pcb/es/blog/Cuidado_con_el_6edceea38293961.html
// - Ley 16/2011, de contratos de crédito al consumo (BOE consolidado, última actualización 28/03/2014; sin derogar a
//   14/11/2026): art. 6 a) coste total del crédito (seguros solo si son obligatorios), art. 6 d) TAE, art. 32 y anexo I
//   (fórmula). https://www.boe.es/buscar/act.php?id=BOE-A-2011-10970
// - Circular 4/2020 del Banco de España (BOE núm. 193, 15/07/2020; en vigor desde el 15/10/2020), anejo, apartados 2.5 y 2.7.
//   https://www.boe.es/buscar/act.php?id=BOE-A-2020-7869
// Chistes del decorado que no son datos: «312 vecinos · 1.904 cuotas», «montadito: no abramos ese debate», «Bar El Plazo
// Fijo» y los 10 € del suplemento de terraza (exagerados a propósito para que coincidan con los gastos de gestión).
const { pildora3d } = require('./tres');
const { VOZ_SECA } = require('./_comun');
const { cuadra } = require('../reels/_comun');

// ——— cuentas (las del guion: ejemplo del Banco de España recalculado con el anexo I de la Ley 16/2011; gastos al firmar) ———
const R = (x, d = 2) => Math.round(x * 10 ** d) / 10 ** d;
const P = 500, G = 10, n = 12;
const c = R(P / n), u = R(P - 11 * c);
cuadra('cuota', c, 41.67);
cuadra('última cuota', u, 41.63);
cuadra('suma de cuotas', R(11 * c + u), 500);
cuadra('intereses con 0 % TIN', R(11 * c + u - P), 0);
const pagos = Array.from({ length: n }, (_, k) => (k < n - 1 ? c : u));
const va = (i, pg) => pg.reduce((s, x, k) => s + x / Math.pow(1 + i, k + 1), 0);
const tir = (neto, pg) => { let lo = 0, hi = 0.1; for (let j = 0; j < 200; j++) { const m = (lo + hi) / 2; if (va(m, pg) > neto) lo = m; else hi = m; } return (lo + hi) / 2; };
const taeDe = (neto, pg) => (Math.pow(1 + tir(neto, pg), 12) - 1) * 100;
cuadra('neto recibido', P - G, 490);
cuadra('i mensual (%)', R(tir(P - G, pagos) * 100, 4), 0.3122);
cuadra('TAE (%)', R(taeDe(P - G, pagos)), 3.81);                 // = Banco de España; en pantalla «3,81 %»
cuadra('TAE (%, 4 dec.)', R(taeDe(P - G, pagos), 4), 3.8115);
cuadra('total pagado', R(11 * c + u + G), 510);                  // texto: «Pagas 510 €»
const p2 = pagos.slice(); p2[0] = R(p2[0] + G);
cuadra('TAE, gastos en la 1.ª cuota (%)', R(taeDe(P, p2), 4), 3.7993);
cuadra('TAE, cuotas exactas 500/12 (%)', R(taeDe(P - G, Array(12).fill(P / 12)), 4), 3.8113);
cuadra('TAE con 20 € (%)', R(taeDe(P - 20, pagos), 4), 7.8755);  // «cuanto más relleno, más sube»
cuadra('TAE con 0 € (%)', R(taeDe(P, pagos)), 0);                // «si la TAE es 0 %, sí es gratis»
const media = Array.from({ length: 12 }, (_, k) => P * (12 - k) / 12).reduce((a, b) => a + b, 0) / 12;
cuadra('deuda media', R(media), 270.83);                         // texto: «unos 271 €»
cuadra('10 / deuda media (%)', R(G / media * 100, 1), 3.7);      // texto: «cerca de un 3,7 %»
cuadra('10 / 500 (%)', G / P * 100, 2);                          // texto: «el 2 % del precio»
cuadra('TIN 6 % mensual → TAE (%)', R((Math.pow(1 + 0.06 / 12, 12) - 1) * 100), 6.17);
// Lo que sale en pantalla: 500 €, 12 meses, 0 % → 3,81 % (la única cifra que cambia en directo) y los 10 € del ticket.
const TAE_TXT = R(taeDe(P - G, pagos)).toFixed(2).replace('.', ',');
cuadra('contador en pantalla', TAE_TXT, '3,81');
// Pausa sin voz: el guion pide 8,4 s y recortar medio segundo si «TAE» (escena 8) cae después de los 46,5 s con la locución
// real. Con las tomas de VOZ_SECA (tempo 1,15) caía hacia los 48,9 s → 7,9 s.
const PAUSA_S = 7.9;
cuadra('pausa recortada (s)', R(8.4 - 0.5, 1), PAUSA_S);

const TEXTO = `TIN vs TAE: el pan y el bocadillo.

El TIN (tipo de interés nominal) es solo el precio del dinero. La TAE (tasa anual equivalente) es el coste total en % al año: intereses, comisiones, gastos y seguros, si son obligatorios. Además, tiene en cuenta cuándo pagas: con un TIN del 6 % en cuotas mensuales y sin gastos, la TAE ya es del 6,17 %. Para comparar, la que cuenta es la TAE.

Un ejemplo del Banco de España (2018): una tableta de 500 € a 12 meses «sin intereses» (0 % TIN), pero con 10 € de gastos de gestión, tiene una TAE del 3,81 %. Pagas 510 €. Los 10 € son el 2 % del precio, pero como vas devolviendo la deuda, de media solo debes unos 271 € durante el año. 10 € sobre 271 € es cerca de un 3,7 %, y con la fórmula oficial sale un 3,81 %.

Si la TAE es 0 %, entonces sí es gratis.

En España, la Circular 4/2020 del Banco de España obliga a que, en los anuncios que tienen que dar la TAE, esta destaque frente al TIN. Y si un crédito «sin intereses» tiene gastos, el anuncio tiene que detallarlos y poner la TAE al lado, bien visible. Con el Black Friday vas a ver muchos: busca esa cifra.

Fuentes: Banco de España, Portal del Cliente Bancario («¿Publicidad? …siempre nos quedará la TAE», 18/05/2018, y «¡Cuidado con el coste de la financiación!», 01/03/2019); Ley 16/2011 de contratos de crédito al consumo, arts. 6 y 32; Circular 4/2020 del Banco de España, anejo, apartados 2.5 y 2.7. La TAE del ejemplo está recalculada con la fórmula de la ley, suponiendo que los gastos se pagan al firmar.

Contenido educativo, no es asesoramiento financiero.

Sé sincero: ¿tú mirabas el TIN o la TAE?

#finanzaspersonales #educacionfinanciera #ahorro #TAE #blackfriday`;

// Guion verificado, sin tocar (en este formato *resaltado* = palabra en la que entra un rótulo; § = corte o capa nueva).
const GUION = [
  [0, 'TIN contra §TAE.'],
  [1, 'En este pueblo, todos §creen que son §*lo mismo*.'],
  [2, 'Como esto es un §*bocadillo*… y esto, un §*bocata*.'],
  [3, 'Pero el TIN y la §TAE no §*miden* lo mismo.'],
  [4, 'El TIN es solo una parte. §Si la TAE es el §*bocadillo*, el TIN es el §*pan*.'],
  [5, 'Dentro va el relleno: §*comisiones*, §*gastos* y §*seguros*, si son obligatorios.'],
  [5, '§Cuanto más relleno, §más sube la *TAE*.'],
  [5, 'El pan se llama §*tipo de interés nominal*. El bocadillo entero, §*tasa anual equivalente*.'],
  [6, 'Tableta nueva. §A plazos. §Sin intereses.'],
  [7, 'Diez euros de *gastos de gestión*.'],              // va después de PAUSA_S s sin voz (pausas[7])
  [8, '«Sin intereses» §no siempre es gratis. La §*TAE* es la cuenta.§'],
  [9, 'En el bar, §la caña es *gratis*. §La terraza, no. §Los gastos de gestión son el §*suplemento de terraza*.§']
];

const CSS = `
  .cont { position: absolute; left: 50%; transform: translateX(-50%); width: 820px; text-align: center; padding: 34px 0 46px; border-radius: 44px;
    background: rgba(7,11,22,.88); border: 5px solid rgba(226,232,240,.55); opacity: 0; }
  .cont small { display: block; font-size: 76px; line-height: 1.1; font-weight: 900; letter-spacing: .02em; color: #f1f5f9; }
  .cont b { display: block; font-size: 236px; line-height: 1; font-weight: 900; letter-spacing: -.045em; color: #f1f5f9; font-variant-numeric: tabular-nums; white-space: nowrap; }
  .cont.tae { border-color: #5eead4; }
  .cont.tae small, .cont.tae b { color: #5eead4; }
  .letra { position: absolute; left: 70px; right: 70px; text-align: center; font-size: 29px; line-height: 1.32; font-weight: 650; color: #e2e8f0;
    background: rgba(7,11,22,.84); border: 1px solid rgba(148,163,184,.35); border-radius: 14px; padding: 10px 18px; opacity: 0; }
  #flecha { position: absolute; left: 0; top: 0; width: 560px; height: 430px; opacity: 0; pointer-events: none; }
  #flecha svg { position: absolute; inset: 0; overflow: visible; }
  #flecha span { position: absolute; left: 0; top: 0; width: 330px; background: rgba(7,11,22,.7); border-radius: 18px; padding: 10px 16px; font-size: 54px; line-height: 1.02; font-weight: 900; color: #f5b94a;
    transform: rotate(-4deg); transform-origin: left top; text-shadow: 0 3px 14px rgba(0,0,0,.85); letter-spacing: -.01em; }
`;

// Mundo de Villaplazos (se añade al de tres.js): plaza de noche con el bar El Plazo Fijo y su terraza, la pared de la tiza,
// la tienda Electro Villaplazos con su cartel «sin intereses», el bazar «TODO A PLAZOS» y el cartel de entrada; el interior
// del bar (barra, bocadillos, montadito), el bocadillo despiezado con su termómetro, el salón con el sofá; la boina turquesa
// y las gafas del maniquí protagonista, la cartulina/ticket que lleva en la mano, la caja de la tableta y el villano (la
// etiqueta de 10 € con patitas). Todo se apaga al principio de cada fotograma (X.apagar()).
const SCRIPT = `
const X3 = (() => {
  const W = W3, T = W.T, S = W.S, H = W.H, objs = [];
  const grupo = () => { const g = new T.Group(); g.visible = false; S.add(g); objs.push(g); return g; };
  const mat = (c, o) => new T.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.62, metalness: 0.05 }, o || {}));
  const pieza = (g, geo, m, x, y, z) => { const o = new T.Mesh(geo, m); o.position.set(x || 0, y || 0, z || 0); o.castShadow = true; o.receiveShadow = true; g.add(o); return o; };
  const caja = (g, w, h, d, m, x, y, z) => pieza(g, new T.BoxGeometry(w, h, d), m, x, y, z);
  const cil = (g, r1, r2, h, m, x, y, z, n) => pieza(g, new T.CylinderGeometry(r1, r2, h, n || 24), m, x, y, z);
  const lienzo = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const tx = new T.CanvasTexture(c); tx.encoding = T.sRGBEncoding; tx.anisotropy = 8; return { c, x: c.getContext('2d'), tx, clave: null }; };
  const pinta = (w, h, f) => { const lz = lienzo(w, h); f(lz.x, w, h); lz.tx.needsUpdate = true; return lz; };
  // Plano con textura: luz = 'propia' (no le afectan las luces: carteles iluminados), si no, recibe luz con algo de brillo propio.
  const plano = (g, w, h, lz, x, y, z, propia, brillo) => {
    const m = propia ? new T.MeshBasicMaterial({ map: lz.tx, toneMapped: false, transparent: true, side: T.DoubleSide })
      : new T.MeshStandardMaterial({ map: lz.tx, roughness: 0.85, transparent: true, emissive: 0xffffff, emissiveMap: lz.tx, emissiveIntensity: brillo == null ? 0.3 : brillo });
    const p = new T.Mesh(new T.PlaneGeometry(w, h), m); p.position.set(x || 0, y || 0, z || 0); g.add(p); return p; };
  const TQ = '#5eead4', ROJO = '#f87171', AMB = '#f5b94a', BL = '#f1f5f9';
  const F = (peso, px) => peso + ' ' + px + 'px Inter, sans-serif';
  const tramoF = (v, a, b) => Math.min(1, Math.max(0, (v - a) / (b - a)));
  function texto(x, txt, cx, cy, px, col, o) {
    o = o || {}; x.save(); x.font = F(o.peso || 900, px); x.textAlign = o.al || 'center'; x.textBaseline = 'middle'; x.fillStyle = col;
    if (o.blur) x.filter = 'blur(' + o.blur + 'px)';
    x.translate(cx, cy); if (o.rot) x.rotate(o.rot); if (o.ancho) x.scale(o.ancho, 1);
    if (o.trazo) { x.lineJoin = 'round'; x.strokeStyle = col; x.lineWidth = px * o.trazo; x.strokeText(txt, 0, 0); }
    x.fillText(txt, 0, 0); x.restore();
  }
  const medir = (x, txt, px, peso) => { x.font = F(peso || 900, px); return x.measureText(txt).width; };
  // Rectángulo «a rotulador»: lados algo torcidos (siempre el mismo trazo para la misma semilla).
  function aMano(x, x0, y0, x1, y1, col, lw, sem) {
    const r = (k) => Math.sin(k * 12.9898 + sem * 78.233) * 5;
    x.save(); x.strokeStyle = col; x.lineWidth = lw; x.lineCap = 'round'; x.lineJoin = 'round'; x.beginPath();
    x.moveTo(x0 + r(1), y0 + r(2)); x.quadraticCurveTo((x0 + x1) / 2 + r(9), y0 + r(10), x1 + r(3), y0 + r(4));
    x.quadraticCurveTo(x1 + r(11), (y0 + y1) / 2 + r(12), x1 + r(5), y1 + r(6));
    x.quadraticCurveTo((x0 + x1) / 2 + r(13), y1 + r(14), x0 + r(7), y1 + r(8));
    x.quadraticCurveTo(x0 + r(15), (y0 + y1) / 2 + r(16), x0 + r(1), y0 + r(2) + 3); x.stroke(); x.restore();
  }
  function lineaPuntos(x, x0, x1, y, col) { x.save(); x.strokeStyle = col; x.lineWidth = 4; x.setLineDash([10, 9]); x.beginPath(); x.moveTo(x0, y); x.lineTo(x1, y); x.stroke(); x.restore(); }

  // ——— cabeza articulada del protagonista: boina turquesa (su rasgo fijo) y gafas de leer ———
  const cabeza = H.cuerpo.children[3];
  const cabG = new T.Group(); cabG.position.set(0, 1.6, 0); H.cuerpo.add(cabG);
  cabeza.position.set(0, 0.14, 0); cabG.add(cabeza);
  const mBoina = mat(0x2dd4bf, { emissive: 0x2dd4bf, emissiveIntensity: 0.45, roughness: 0.75 });
  const boina = new T.Mesh(new T.SphereGeometry(0.18, 26, 12), mBoina); boina.scale.set(1.1, 0.36, 1.1); boina.position.set(0.035, 0.285, -0.005); boina.rotation.z = -0.3; boina.castShadow = true; cabG.add(boina);
  const rabo = new T.Mesh(new T.CylinderGeometry(0.011, 0.016, 0.055, 8), mBoina); rabo.position.set(0.012, 0.352, 0); rabo.rotation.z = -0.35; cabG.add(rabo);
  const gafas = new T.Group(); gafas.position.set(0, 0.15, 0.158); cabG.add(gafas);
  const mGaf = mat(0x0b1020, { roughness: 0.3, metalness: 0.4 });
  [-1, 1].forEach(s => {
    const aro = new T.Mesh(new T.TorusGeometry(0.043, 0.0085, 8, 24), mGaf); aro.position.set(s * 0.056, 0, 0); gafas.add(aro);
    const cri = new T.Mesh(new T.CircleGeometry(0.041, 20), new T.MeshBasicMaterial({ color: 0xbff4ff, transparent: true, opacity: 0.28, depthWrite: false })); cri.position.set(s * 0.056, 0, 0.001); gafas.add(cri);
    const pat = new T.Mesh(new T.BoxGeometry(0.007, 0.007, 0.15), mGaf); pat.position.set(s * 0.1, 0.006, -0.07); gafas.add(pat);
  });
  const puente = new T.Mesh(new T.BoxGeometry(0.03, 0.007, 0.007), mGaf); puente.position.set(0, 0.012, 0); gafas.add(puente);
  // Lo que lleva en las manos va en manoG (hijo del maniquí: gira y se sienta con él).
  const manoG = new T.Group(); H.g.add(manoG);
  function cab(o) { cabG.rotation.set(o.x || 0, o.y || 0, o.z || 0); }
  function ponGafas(q) { gafas.visible = q > 0.01; gafas.position.y = 0.15 + 0.32 * (1 - q); gafas.scale.setScalar(0.6 + 0.4 * q); }
  // Posturas (después de W.heroe): 'sostener' (tarjeta delante del pecho), 'caja' (caja en brazos), 'lado' (caja en la mano
  // derecha), 'tableta' (sentado, mirando la tableta), 'leer' (sentado, ticket delante), 'sentado' (solo las piernas).
  function pose(nombre, q) {
    q = q == null ? 1 : q; const A = H.izq, B = H.der;
    const brazos = (hx, hz, cx, sx) => { A.hombro.rotation.x = B.hombro.rotation.x = hx * q; A.codo.rotation.x = B.codo.rotation.x = cx * q - 0.22 * (1 - q);
      A.hombro.rotation.z = 0.1 + (sx - 0.1) * q; B.hombro.rotation.z = -0.1 - (sx - 0.1) * q; A.hombro.rotation.y = B.hombro.rotation.y = 0; };
    const sentar = () => { [A, B].forEach(L => { L.cadera.rotation.x = -1.5; L.rodilla.rotation.x = 1.5; }); A.cadera.rotation.z = 0.06; B.cadera.rotation.z = -0.06; };
    if (nombre === 'sostener') brazos(-0.66, 0, -1.15, 0.24);
    else if (nombre === 'caja') brazos(-0.5, 0, -0.85, 0.18);
    else if (nombre === 'lado') { A.hombro.rotation.x = -0.12 * q; A.hombro.rotation.z = 0.1 + 0.32 * q; A.codo.rotation.x = -0.35 * q; }
    else if (nombre === 'tableta') { sentar(); brazos(-0.35, 0, -1.25, 0.16); }
    else if (nombre === 'leer') { sentar(); brazos(-0.55, 0, -1.3, 0.3); }
    else if (nombre === 'sentado') sentar();
  }

  // ——— cartulina / ticket que lleva en la mano (cara y dorso con textura propia) ———
  const CW = 640, CH = 820, TW = 0.52, TH = 0.666;
  function cinta(x, x0, y, w) {
    if (w <= 1) return; x.save(); x.fillStyle = '#f5c518'; x.fillRect(x0, y, w, 36); x.fillStyle = '#1a1205';
    for (let k = 0; k * 16 < w; k++) x.fillRect(x0 + k * 16, y, 3, k % 5 === 0 ? 22 : 12);
    x.fillStyle = '#a3adbb'; x.fillRect(x0 + w - 7, y - 8, 9, 52); x.restore();
  }
  function dibTarjeta(lz, o) {
    const clave = JSON.stringify(o); if (clave === lz.clave) return; lz.clave = clave;
    const x = lz.x; x.clearRect(0, 0, CW, CH);
    if (o.tipo === 'ticket') {
      x.fillStyle = '#f8fafc'; x.fillRect(0, 0, CW, CH - 24);
      x.beginPath(); x.moveTo(0, CH - 24); for (let k = 0; k <= 16; k++) x.lineTo(k * CW / 16, CH - 24 + (k % 2 ? 22 : 0)); x.lineTo(CW, CH - 24); x.closePath(); x.fill();
      texto(x, 'BAR EL PLAZO FIJO', CW / 2, 92, 50, '#0f172a');
      texto(x, 'Villaplazos', CW / 2, 150, 32, '#475569', { peso: 600 });
      lineaPuntos(x, 40, CW - 40, 205, '#94a3b8');
      texto(x, 'Caña', 50, 290, 58, '#0f172a', { al: 'left', peso: 800 }); texto(x, '0,00 €', CW - 50, 290, 58, '#0f172a', { al: 'right', peso: 800 });
      texto(x, 'Suplemento', 50, 412, 58, '#dc2626', { al: 'left', peso: 850 }); texto(x, 'terraza', 50, 476, 58, '#dc2626', { al: 'left', peso: 850 });
      texto(x, '10,00 €', CW - 50, 444, 58, '#dc2626', { al: 'right', peso: 850 });
      lineaPuntos(x, 40, CW - 40, 560, '#94a3b8');
      texto(x, 'TOTAL', 50, 646, 68, '#0f172a', { al: 'left' }); texto(x, '10,00 €', CW - 50, 646, 68, '#0f172a', { al: 'right' });
      texto(x, 'Gracias por su visita', CW / 2, 742, 30, '#64748b', { peso: 600 });
    } else {
      x.fillStyle = '#0d1424'; x.beginPath(); x.roundRect(0, 0, CW, CH, 28); x.fill();
      aMano(x, 30, 30, CW - 30, CH - 30, '#e2e8f0', 10, 3);
      if (o.tipo === 'titulo') {
        const es = 1 + 0.3 * (o.estira || 0);
        texto(x, 'TIN', CW / 2, 212, 205, BL, { trazo: 0.05 });
        texto(x, 'vs', CW / 2, 408, 112, '#94a3b8', { trazo: 0.04, peso: 800 });
        texto(x, 'TAE', CW / 2, 604, 205, TQ, { trazo: 0.05, ancho: es });
        if (o.cinta) { const wa = medir(x, 'TIN', 205), wb = medir(x, 'TAE', 205) * es;
          cinta(x, CW / 2 - wa / 2, 312, wa * tramoF(o.cinta, 0, 0.42)); cinta(x, CW / 2 - wb / 2, 704, wb * tramoF(o.cinta, 0.5, 1)); }
      } else if (o.tipo === 'cuenta') {
        texto(x, 'TAE', CW / 2, 228, 205, TQ, { trazo: 0.05 });
        texto(x, '=', CW / 2, 418, 150, BL, { trazo: 0.05 });
        texto(x, 'LA CUENTA', CW / 2, 600, 104, BL, { trazo: 0.05 });
      }
    }
    lz.tx.needsUpdate = true;
  }
  const tarG = new T.Group(); tarG.visible = false; S.add(tarG);
  const lzF = lienzo(CW, CH), lzD = lienzo(CW, CH);
  const matCara = (lz) => new T.MeshStandardMaterial({ map: lz.tx, roughness: 0.85, transparent: true, emissive: 0xffffff, emissiveMap: lz.tx, emissiveIntensity: 0.42 });
  const caraF = new T.Mesh(new T.PlaneGeometry(TW, TH), matCara(lzF)); caraF.position.z = 0.003; tarG.add(caraF);
  const caraD = new T.Mesh(new T.PlaneGeometry(TW, TH), matCara(lzD)); caraD.rotation.y = Math.PI; caraD.position.z = -0.003; tarG.add(caraD);
  // o = { frente: {tipo…}, dorso: {tipo…}, mano: true (va en manoG, en x,y,z locales) | false (en el mundo), x, y, z, rx, ry, rz, esc }
  function tarjeta(o) {
    (o.mano ? manoG : S).add(tarG); tarG.visible = true;
    dibTarjeta(lzF, o.frente); dibTarjeta(lzD, o.dorso || { tipo: 'titulo' });
    tarG.position.set(o.x || 0, o.y == null ? (o.mano ? 1.25 : 0) : o.y, o.z == null ? (o.mano ? 0.47 : 0) : o.z);
    tarG.rotation.set(o.rx || 0, o.ry || 0, o.rz || 0, 'YXZ'); tarG.scale.setScalar(o.esc || 1);
  }

  // ——— caja de la tableta y la tableta encendida (en la mano) ———
  const cajaT = new T.Group(); manoG.add(cajaT);
  const lzCaja = pinta(512, 360, (x, w, h) => { x.fillStyle = '#f1f5f9'; x.fillRect(0, 0, w, h); x.fillStyle = '#0f172a'; x.beginPath(); x.roundRect(150, 70, 212, 150, 16); x.fill();
    x.fillStyle = '#2dd4bf'; x.fillRect(166, 86, 180, 118); texto(x, 'TABLETA', w / 2, 284, 56, '#0f172a'); });
  const mCajaL = mat(0xe2e8f0);
  const cajaM = new T.Mesh(new T.BoxGeometry(0.44, 0.31, 0.08), [mCajaL, mCajaL, mCajaL, mCajaL, new T.MeshStandardMaterial({ map: lzCaja.tx, roughness: 0.7, emissive: 0xffffff, emissiveMap: lzCaja.tx, emissiveIntensity: 0.2 }), mCajaL]);
  cajaM.castShadow = true; cajaT.add(cajaM);
  const tabG = new T.Group(); manoG.add(tabG);
  caja(tabG, 0.27, 0.19, 0.012, mat(0x0b1020, { roughness: 0.3 }), 0, 0, 0);
  const lzPant = pinta(512, 360, (x, w, h) => { const g = x.createLinearGradient(0, 0, w, h); g.addColorStop(0, '#0f766e'); g.addColorStop(1, '#5eead4'); x.fillStyle = g; x.fillRect(0, 0, w, h);
    x.fillStyle = 'rgba(255,255,255,.85)'; [[40, 40, 200, 120], [270, 40, 200, 120], [40, 190, 430, 40], [40, 250, 300, 40]].forEach(r => { x.beginPath(); x.roundRect(r[0], r[1], r[2], r[3], 14); x.fill(); }); });
  const pantT = plano(tabG, 0.25, 0.17, lzPant, 0, 0, 0.0065, true);
  const luzTab = new T.PointLight(0x5eead4, 0, 2.2, 1.6); luzTab.position.set(0, 0, 0.25); tabG.add(luzTab);
  function enMano(o) {   // o = { caja: [x,y,z,ry,rz] | null, tableta: [x,y,z,rx] | null }
    cajaT.visible = !!o.caja; if (o.caja) { cajaT.position.set(o.caja[0], o.caja[1], o.caja[2]); cajaT.rotation.set(0, o.caja[3] || 0, o.caja[4] || 0); }
    tabG.visible = !!o.tableta; luzTab.intensity = o.tableta ? 1.2 : 0; if (o.tableta) { tabG.position.set(o.tableta[0], o.tableta[1], o.tableta[2]); tabG.rotation.set(o.tableta[3] || 0, 0, 0); }
  }
  const vTmp = new T.Vector3();
  function cajaArriba() { H.g.updateMatrixWorld(true); return cajaT.localToWorld(vTmp.set(0, 0.155, 0)).clone(); }

  // ——— el villano: la etiqueta de «10 €» con patitas y ojos ———
  const villG = new T.Group(); villG.visible = false; S.add(villG);
  const lzVill = pinta(512, 330, (x, w, h) => {
    x.fillStyle = '#ef4444'; x.beginPath(); x.moveTo(90, 20); x.lineTo(w - 24, 20); x.quadraticCurveTo(w - 6, 20, w - 6, 40); x.lineTo(w - 6, h - 40); x.quadraticCurveTo(w - 6, h - 20, w - 24, h - 20);
    x.lineTo(90, h - 20); x.lineTo(14, h / 2); x.closePath(); x.fill(); x.strokeStyle = '#7f1d1d'; x.lineWidth = 8; x.stroke();
    x.fillStyle = '#0b1020'; x.beginPath(); x.arc(78, h / 2, 18, 0, 7); x.fill();
    [[230, 92], [330, 92]].forEach(([cx, cy]) => { x.fillStyle = '#fff'; x.beginPath(); x.ellipse(cx, cy, 30, 34, 0, 0, 7); x.fill(); x.fillStyle = '#0b1020'; x.beginPath(); x.arc(cx + 4, cy + 6, 14, 0, 7); x.fill(); });
    x.strokeStyle = '#0b1020'; x.lineWidth = 9; x.lineCap = 'round'; x.beginPath(); x.moveTo(196, 48); x.lineTo(256, 64); x.moveTo(364, 48); x.lineTo(304, 64); x.stroke();
    texto(x, '10 €', 290, 226, 132, '#fff');
  });
  const villP = new T.Mesh(new T.PlaneGeometry(0.4, 0.258), new T.MeshStandardMaterial({ map: lzVill.tx, transparent: true, side: T.DoubleSide, roughness: 0.6, emissive: 0xffffff, emissiveMap: lzVill.tx, emissiveIntensity: 0.45 }));
  villP.position.y = 0.26; villP.castShadow = true; villG.add(villP);
  const mPata = mat(0x0b1020, { roughness: 0.5 });
  const patas = [-1, 1].map(s => { const pg = new T.Group(); pg.position.set(s * 0.06, 0.135, 0); villG.add(pg);
    const pt = new T.Mesh(new T.CylinderGeometry(0.011, 0.011, 0.12, 8), mPata); pt.position.y = -0.06; pg.add(pt);
    const pie = new T.Mesh(new T.BoxGeometry(0.035, 0.016, 0.05), mPata); pie.position.set(0, -0.122, 0.012); pg.add(pie); return pg; });
  // o = { x, y, z, ry, esc, paso (fase de andar; null = quieto), sentado 0..1, trepa (fase de trepar) }
  function villano(o) {
    villG.visible = true; villG.position.set(o.x, o.y || 0, o.z); villG.rotation.set(0, o.ry || 0, 0); villG.scale.setScalar(Math.max(0.001, o.esc == null ? 1 : o.esc));
    const sen = o.sentado || 0;
    patas.forEach((pg, i) => { const f = o.paso != null ? Math.sin(o.paso + i * Math.PI) * 0.7 : o.trepa != null ? Math.sin(o.trepa + i * Math.PI) * 1.0 - 0.5 : 0; pg.rotation.x = f * (1 - sen) - 1.45 * sen; });
    villP.position.y = 0.26 - 0.1 * sen;
  }

  // ——— la plaza de Villaplazos (de noche): fachadas, farolas, terraza, cartel de entrada ———
  const plazaG = grupo();
  function ventanas(x, w, h, n, sem) {
    const alto = h / 100; let k = sem;
    for (let yy = 3.1; yy + 1.15 < alto; yy += 1.45) for (let c = 0; c < n; c++) {
      const ww = w / n, cx = ww * (c + 0.5), wy = (alto - yy - 1.1) * 100;
      k = (k * 9301 + 49297) % 233280; const r = k / 233280;
      x.fillStyle = '#141a28'; x.fillRect(cx - 45, wy - 5, 90, 120);
      x.fillStyle = r > 0.78 ? '#7ee8d8' : r > 0.38 ? '#f3c97a' : '#0c111c'; x.fillRect(cx - 38, wy, 76, 110);
      x.fillStyle = 'rgba(0,0,0,.4)'; x.fillRect(cx - 2, wy, 4, 110); x.fillRect(cx - 38, wy + 40, 76, 4);
      x.fillStyle = '#0b0f18'; x.fillRect(cx - 52, wy + 110, 104, 9);
    }
  }
  function ruido(x, w, h, col, n, sem) { let k = sem; x.fillStyle = col; for (let i = 0; i < n; i++) { k = (k * 9301 + 49297) % 233280; const a = k / 233280; k = (k * 9301 + 49297) % 233280; x.fillRect(a * w, (k / 233280) * h, 3, 2); } }
  function fachada(x0, x1, alto, fondo, dib) {
    const w = x1 - x0, lz = pinta(Math.round(w * 100), Math.round(alto * 100), (x, W_, H_) => { x.fillStyle = fondo; x.fillRect(0, 0, W_, H_); ruido(x, W_, H_, 'rgba(0,0,0,.18)', 1400, x0 * 7 + 3); dib(x, W_, H_); });
    const lado = mat(0x1c2333);
    const m = new T.Mesh(new T.BoxGeometry(w, alto, 2), [lado, lado, lado, lado, new T.MeshStandardMaterial({ map: lz.tx, roughness: 0.92, emissive: 0xffffff, emissiveMap: lz.tx, emissiveIntensity: 0.16 }), lado]);
    m.position.set((x0 + x1) / 2, alto / 2, -7); m.receiveShadow = true; m.castShadow = true; plazaG.add(m);
    caja(plazaG, w + 0.1, 0.18, 2.2, mat(0x10151f), (x0 + x1) / 2, alto + 0.09, -7);
  }
  // Bar «El Plazo Fijo» (x −10…−4): puerta y ventanales con luz cálida.
  fachada(-10, -4, 5.6, '#6f5a45', (x, w, h) => { ventanas(x, w, h, 4, 11);
    const suelo = h; x.fillStyle = '#2a1d14'; x.fillRect(w / 2 - 58, suelo - 235, 116, 235); x.fillStyle = '#f3c97a'; x.fillRect(w / 2 - 44, suelo - 222, 88, 120);
    [[60, 230], [w - 230, 230]].forEach(([vx, vw]) => { x.fillStyle = '#20160f'; x.fillRect(vx, suelo - 230, 170, 150); const g = x.createLinearGradient(0, suelo - 220, 0, suelo - 90); g.addColorStop(0, '#f6d38f'); g.addColorStop(1, '#b7742f'); x.fillStyle = g; x.fillRect(vx + 8, suelo - 222, 154, 134); }); });
  // Pared de piedra con la tiza (x −4…0).
  fachada(-4, 0, 4.4, '#353b49', (x, w, h) => { x.strokeStyle = 'rgba(10,14,22,.55)'; x.lineWidth = 3;
    for (let r = 0; r * 34 < h; r++) for (let c = -1; c * 70 < w; c++) x.strokeRect(c * 70 + (r % 2) * 35, r * 34, 70, 34); });
  // Tienda «Electro Villaplazos» (x 0…6): puerta (x 0,8–1,8) y escaparate (x 2,4–5,6).
  fachada(0, 6, 6, '#46536b', (x, w, h) => { ventanas(x, w, h, 4, 23);
    x.fillStyle = '#0f1726'; x.fillRect(74, h - 228, 112, 228); x.fillStyle = '#c9d8ea'; x.fillRect(84, h - 218, 92, 208);
    x.fillStyle = '#0f1726'; x.fillRect(232, h - 298, 336, 256); const g = x.createLinearGradient(0, h - 290, 0, h - 50); g.addColorStop(0, '#24324a'); g.addColorStop(1, '#3d5170'); x.fillStyle = g; x.fillRect(240, h - 290, 320, 240); });
  // Bazar «TODO A PLAZOS» (x 6…10).
  fachada(6, 10.5, 5.2, '#6a4a4e', (x, w, h) => { ventanas(x, w, h, 3, 41);
    x.fillStyle = '#1c1416'; x.fillRect(40, h - 250, 300, 210); x.fillStyle = '#e9b872'; x.fillRect(48, h - 242, 284, 194); x.fillStyle = '#1c1416'; x.fillRect(360, h - 230, 70, 230); });
  // Carteles de las fachadas (alta resolución).
  const lzElectro = pinta(1024, 420, (x, w, h) => { x.fillStyle = '#132b4a'; x.beginPath(); x.roundRect(4, 4, w - 8, h - 8, 30); x.fill(); x.strokeStyle = '#5eead4'; x.lineWidth = 10; x.stroke();
    texto(x, 'ELECTRO', w / 2, 140, 150, '#f1f5f9'); texto(x, 'VILLAPLAZOS', w / 2, 300, 118, '#5eead4'); });
  plano(plazaG, 2.2, 0.9, lzElectro, 1.3, 3.0, -5.96, true);
  const lzBazar = pinta(1024, 224, (x, w, h) => { x.fillStyle = '#facc15'; x.fillRect(0, 0, w, h); texto(x, 'TODO A PLAZOS', w / 2, h / 2 + 4, 132, '#b91c1c'); });
  plano(plazaG, 3.4, 0.74, lzBazar, 7.9, 2.95, -5.96, true);
  // El cartel del escaparate: «SIN INTERESES · 0 % TIN» y, arriba a la derecha y en pequeño, la TAE (borrosa).
  const lzCartel = lienzo(1280, 832);
  function dibCartel(blur) {
    const b = Math.round(blur * 4) / 4, clave = String(b); if (clave === lzCartel.clave) return; lzCartel.clave = clave;
    const x = lzCartel.x, w = 1280, h = 832; x.clearRect(0, 0, w, h); x.save(); if (b > 0) x.filter = 'blur(' + b + 'px)';
    x.fillStyle = '#dc2626'; x.fillRect(0, 0, w, h); x.strokeStyle = '#fff'; x.lineWidth = 12; x.strokeRect(26, 26, w - 52, h - 52);
    texto(x, 'SIN INTERESES', 505, 215, 106, '#fff'); texto(x, '0 % TIN', 505, 450, 218, '#fde047');
    texto(x, 'Tableta · 500 € · 12 meses', 505, 670, 58, '#fff', { peso: 800 });
    x.fillStyle = 'rgba(255,255,255,.16)'; x.beginPath(); x.roundRect(1000, 330, 210, 300, 22); x.fill(); x.fillStyle = 'rgba(15,23,42,.55)'; x.fillRect(1024, 356, 162, 220); x.restore();
    x.save(); x.filter = 'blur(' + (4.2 + b) + 'px)'; x.fillStyle = '#fff'; x.fillRect(1080, 52, 168, 74); texto(x, 'TAE 3,81 %', 1164, 90, 30, '#7f1d1d', { peso: 800 }); x.restore();
    lzCartel.tx.needsUpdate = true;
  }
  dibCartel(0);
  const CARTEL = { x: 4.0, y: 1.85, z: -5.955, w: 2.0, h: 1.3 };
  plano(plazaG, CARTEL.w, CARTEL.h, lzCartel, CARTEL.x, CARTEL.y, CARTEL.z, true);
  const ESQUINA = [CARTEL.x - CARTEL.w / 2 + 1164 / 1280 * CARTEL.w, CARTEL.y + CARTEL.h / 2 - 90 / 832 * CARTEL.h, CARTEL.z];
  // Pintada de tiza «TIN = TAE» (la segunda raya del «=» se dibuja con prog 0..1).
  const lzTiza = lienzo(1024, 360);
  function dibTiza(prog) {
    const pr = Math.round(prog * 30) / 30; if (String(pr) === lzTiza.clave) return; lzTiza.clave = String(pr);
    const x = lzTiza.x; x.clearRect(0, 0, 1024, 360); x.save(); x.globalAlpha = 0.92;
    texto(x, 'TIN', 230, 186, 190, '#eef2f7', { peso: 800, rot: -0.03 }); texto(x, 'TAE', 800, 180, 190, '#eef2f7', { peso: 800, rot: 0.02 });
    x.strokeStyle = '#eef2f7'; x.lineWidth = 22; x.lineCap = 'round'; x.beginPath(); x.moveTo(445, 150); x.lineTo(585, 146); x.stroke();
    if (pr > 0) { x.beginPath(); x.moveTo(447, 222); x.lineTo(447 + 140 * pr, 222 - 4 * pr); x.stroke(); }
    x.restore(); lzTiza.tx.needsUpdate = true;
  }
  dibTiza(0);
  plano(plazaG, 1.7, 0.6, lzTiza, -2.2, 2.42, -5.97, false, 0.55);
  // Farolas (luz cálida) y un toque turquesa.
  function farola(x0, z0) { const mF = mat(0x1a2030, { roughness: 0.5, metalness: 0.3 });
    cil(plazaG, 0.05, 0.07, 3.3, mF, x0, 1.65, z0, 10); caja(plazaG, 0.5, 0.05, 0.05, mF, x0 + 0.22, 3.25, z0);
    const bol = new T.Mesh(new T.SphereGeometry(0.13, 14, 10), new T.MeshBasicMaterial({ color: 0xffd9a0 })); bol.position.set(x0 + 0.44, 3.12, z0); plazaG.add(bol);
    const l = new T.PointLight(0xffcf8a, 1.5, 11, 1.6); l.position.set(x0 + 0.44, 3.0, z0); plazaG.add(l); }
  farola(-4.2, -3.2); farola(6.2, -3.0);
  // Toldo turquesa del bar con su faldón «BAR EL PLAZO FIJO», postes y mesas de la terraza.
  const lzToldo = pinta(512, 256, (x, w, h) => { for (let k = 0; k < 8; k++) { x.fillStyle = k % 2 ? '#e6fffb' : '#14b8a6'; x.fillRect(k * w / 8, 0, w / 8, h); } });
  const toldo = new T.Mesh(new T.PlaneGeometry(5.2, 2.5), new T.MeshStandardMaterial({ map: lzToldo.tx, side: T.DoubleSide, roughness: 0.8, emissive: 0x2dd4bf, emissiveIntensity: 0.12 }));
  toldo.position.set(-7, 2.5, -4.85); toldo.rotation.x = -Math.PI / 2 + 0.3; toldo.castShadow = true; plazaG.add(toldo);
  const lzFaldon = pinta(1024, 96, (x, w, h) => { x.fillStyle = '#0f766e'; x.fillRect(0, 0, w, h); texto(x, 'BAR EL PLAZO FIJO', w / 2, h / 2 + 3, 62, '#f1f5f9'); });
  plano(plazaG, 5.2, 0.5, lzFaldon, -7, 1.9, -3.64, true);
  [-9.55, -4.45].forEach(px => cil(plazaG, 0.035, 0.035, 2.15, mat(0x94a3b8, { metalness: 0.5 }), px, 1.07, -3.66, 8));
  const mMesa = mat(0xdfe5ec, { roughness: 0.4 }), mSilla = mat(0x334155);
  function mesa(x0, z0) { cil(plazaG, 0.38, 0.38, 0.035, mMesa, x0, 0.755, z0, 28); cil(plazaG, 0.03, 0.03, 0.74, mMesa, x0, 0.37, z0, 8); cil(plazaG, 0.2, 0.22, 0.03, mMesa, x0, 0.015, z0, 16);
    [[-0.55, 0], [0.55, 0]].forEach(([dx]) => { caja(plazaG, 0.4, 0.04, 0.4, mSilla, x0 + dx, 0.45, z0); caja(plazaG, 0.04, 0.45, 0.4, mSilla, x0 + dx + Math.sign(dx) * 0.2, 0.7, z0); }); }
  const MESA1 = [-8.3, -4.75], MESA2 = [-5.6, -4.75];
  mesa(MESA1[0], MESA1[1]); mesa(MESA2[0], MESA2[1]);
  // La caña (0 €), la pizarra «CAÑA: 0 €» y el cartelito «terraza +».
  const cana = new T.Group(); plazaG.add(cana); cana.position.set(MESA1[0] + 0.12, 0.775, MESA1[1] + 0.08);
  const vaso = new T.Mesh(new T.CylinderGeometry(0.045, 0.038, 0.16, 20), new T.MeshStandardMaterial({ color: 0xf2b134, emissive: 0xf2b134, emissiveIntensity: 0.35, transparent: true, opacity: 0.9, roughness: 0.2 })); vaso.position.y = 0.08; cana.add(vaso);
  const espuma = new T.Mesh(new T.CylinderGeometry(0.047, 0.046, 0.03, 20), mat(0xfaf7ef, { emissive: 0xffffff, emissiveIntensity: 0.25 })); espuma.position.y = 0.175; cana.add(espuma);
  const lzPizarra = pinta(512, 680, (x, w, h) => { x.fillStyle = '#7c5a3a'; x.fillRect(0, 0, w, h); x.fillStyle = '#1c2a24'; x.fillRect(26, 26, w - 52, h - 52);
    texto(x, 'HOY', w / 2, 120, 64, '#dfe7e2', { peso: 700 }); texto(x, 'CAÑA:', w / 2, 300, 120, '#f1f5f9', { peso: 800 }); texto(x, '0 €', w / 2, 470, 170, '#5eead4', { peso: 900 }); });
  const pizG = new T.Group(); plazaG.add(pizG); pizG.position.set(MESA1[0] + 0.75, 0, MESA1[1] + 0.45); pizG.rotation.y = -0.35;
  const piz = plano(pizG, 0.56, 0.74, lzPizarra, 0, 0.82, 0, false, 0.45); piz.rotation.x = -0.12;
  [-0.25, 0.25].forEach(dx => { const pa = caja(pizG, 0.04, 1.2, 0.04, mat(0x7c5a3a), dx, 0.6, -0.04); pa.rotation.x = -0.12; });
  const lzCartelito = pinta(512, 260, (x, w, h) => { x.fillStyle = '#fff'; x.fillRect(0, 0, w, h); x.strokeStyle = '#0f172a'; x.lineWidth = 6; x.strokeRect(10, 10, w - 20, h - 20); texto(x, 'terraza +', w / 2, h / 2 + 4, 92, '#dc2626', { peso: 900, rot: -0.04 }); });
  const cartelito = new T.Group(); plazaG.add(cartelito); cartelito.position.set(MESA1[0] + 0.02, 0.775, MESA1[1] - 0.2);
  const ct = plano(cartelito, 0.24, 0.122, lzCartelito, 0, 0.06, 0.012, false, 0.5); ct.rotation.x = -0.22;
  // Cartel de entrada del pueblo (chiste que no se narra).
  const lzEntrada = pinta(1024, 512, (x, w, h) => { x.fillStyle = '#f8fafc'; x.beginPath(); x.roundRect(6, 6, w - 12, h - 12, 26); x.fill(); x.strokeStyle = '#b91c1c'; x.lineWidth = 22; x.stroke();
    texto(x, 'VILLAPLAZOS', w / 2, 200, 138, '#0f172a'); texto(x, '312 vecinos · 1.904 cuotas', w / 2, 360, 62, '#334155', { peso: 800 }); });
  const entG = new T.Group(); plazaG.add(entG); entG.position.set(7.4, 0, 3.0); entG.rotation.y = -0.42;
  [-0.85, 0.85].forEach(dx => cil(entG, 0.05, 0.05, 2.45, mat(0x94a3b8, { metalness: 0.5 }), dx, 1.22, -0.03, 10));
  plano(entG, 1.9, 0.95, lzEntrada, 0, 2.0, 0.02, false, 0.55);
  // Cajas de cartón de los vecinos que cruzan.
  const cajasV = Array.from({ length: 4 }, () => { const m = new T.Mesh(new T.BoxGeometry(0.42, 0.32, 0.34), mat(0xb98b56, { roughness: 0.9 })); m.castShadow = true; m.visible = false; S.add(m); return m; });
  // La flecha «estaba aquí todo el rato» es 2D (escena 7): se coloca en la esquina del cartel con W.pantalla.

  // ——— interior del bar: barra, estantes con botellas, lámparas y el neón; los dos bocadillos y el montadito ———
  const barG = grupo(); const BX = 30;
  caja(barG, 9, 4.2, 0.3, mat(0x3a2a22, { roughness: 0.8 }), BX, 2.1, -2.7);
  caja(barG, 3.6, 1.04, 0.6, mat(0x5a3a26, { roughness: 0.7 }), BX, 0.52, -0.5);
  caja(barG, 3.8, 0.06, 0.78, mat(0x231710, { roughness: 0.35 }), BX, 1.07, -0.5);
  [1.45, 2.05].forEach(y => caja(barG, 4.4, 0.05, 0.3, mat(0x24170f), BX, y, -2.4));
  [0xf59e0b, 0x22c55e, 0x5eead4, 0xef4444, 0x93c5fd, 0xf59e0b, 0xa3e635, 0xfda4af].forEach((col, i) => [1.45, 2.05].forEach((y, j) => {
    const b = cil(barG, 0.05, 0.055, 0.28, new T.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 0.35, roughness: 0.25, transparent: true, opacity: 0.88 }), BX - 2.0 + i * 0.55 + j * 0.25, y + 0.165, -2.4, 12); b.castShadow = false; }));
  const lzNeon = pinta(1024, 200, (x, w, h) => { x.shadowColor = '#5eead4'; x.shadowBlur = 30; texto(x, 'EL PLAZO FIJO', w / 2, h / 2, 120, '#99f6e4', { peso: 800 }); });
  plano(barG, 2.6, 0.5, lzNeon, BX, 2.8, -2.53, true);
  [-0.8, 0.8].forEach(dx => { cil(barG, 0.008, 0.008, 1.4, mat(0x111111), BX + dx, 3.3, -0.5, 6); cil(barG, 0.06, 0.24, 0.2, mat(0x1e293b, { side: T.DoubleSide }), BX + dx, 2.55, -0.5, 18);
    const l = new T.PointLight(0xffcf8a, 1.6, 6, 1.6); l.position.set(BX + dx, 2.35, -0.4); barG.add(l); });
  // Bocadillo: pan de abajo, capas (comisiones, gastos, seguros) y pan de arriba; ponerBoc los coloca (despiece, capas, tapa).
  const mPan = mat(0xd9a25a, { roughness: 0.85, emissive: 0x6b3d12, emissiveIntensity: 0.15 });
  const COL = [0xe85d4a, 0xf2c14e, 0x6abf5e];
  function hacerBoc(padre, esc) {
    const g = new T.Group(); padre.add(g); g.scale.setScalar(esc);
    const geo = new T.CapsuleGeometry(0.055, 0.3, 6, 16);
    const abajo = new T.Mesh(geo, mPan); abajo.rotation.z = Math.PI / 2; abajo.scale.x = 0.5; abajo.castShadow = true; g.add(abajo);
    const arriba = new T.Group(); g.add(arriba);
    const ar = new T.Mesh(geo, mPan.clone()); ar.rotation.z = Math.PI / 2; ar.scale.x = 0.62; ar.castShadow = true; arriba.add(ar);
    const capas = COL.map(cc => { const m = new T.Mesh(new T.BoxGeometry(0.38, 0.018, 0.105), mat(cc, { roughness: 0.5, emissive: cc, emissiveIntensity: 0.12 })); m.castShadow = true; g.add(m); return m; });
    return { g, abajo, arriba, ar, capas };
  }
  function ponerBoc(b, o) {
    const sep = (o.abre || 0) * (o.alto || 0.07); let y = 0.03;
    b.capas.forEach((cp, i) => { const qq = o.capas ? o.capas[i] : 1; cp.visible = qq > 0.01; cp.position.set(0, y + 0.009 + sep * (i + 1) + (1 - qq) * 0.45, 0); y += 0.018; });
    b.arriba.position.y = y + 0.034 + sep * 4 + (o.tapa || 0) * 0.11; b.arriba.rotation.z = (o.tapa || 0) * 0.22;
    b.ar.material.emissiveIntensity = 0.15 + (o.brilloTapa || 0) * 0.6;
    return { capa: (i) => b.g.localToWorld(vTmp.set(0, b.capas[i].position.y, 0)).clone(), tapa: () => b.g.localToWorld(vTmp.set(0, b.arriba.position.y, 0)).clone() };
  }
  const mPlato = mat(0xf1f5f9, { roughness: 0.35 });
  const platos = [0, 1, 2].map(() => { const p = new T.Mesh(new T.CylinderGeometry(0.17, 0.13, 0.02, 28), mPlato); p.receiveShadow = true; barG.add(p); return p; });
  const bocA = hacerBoc(barG, 1), bocB = hacerBoc(barG, 1), mont = hacerBoc(barG, 0.5);
  const BOC_A = [BX - 0.45, 1.1, -0.45], BOC_B = [BX + 0.45, 1.1, -0.45];
  function barra(o) {   // o = { a: [x,y,z] (bocadillo A), monX: x del montadito, tapaA, abreA }
    const a = o.a || BOC_A;
    platos[0].position.set(BOC_A[0], 1.11, BOC_A[2]); platos[1].position.set(BOC_B[0], 1.11, BOC_B[2]);
    bocA.g.position.set(a[0], a[1] + 0.028, a[2]); bocA.g.rotation.set(0, o.rotA || 0, 0); const rA = ponerBoc(bocA, { tapa: o.tapaA || 0 });
    bocB.g.position.set(BOC_B[0], 1.128, BOC_B[2]); ponerBoc(bocB, {});
    const mx = o.monX == null ? 99 : o.monX; platos[2].visible = mont.g.visible = o.monX != null; platos[2].position.set(mx, 1.11, BOC_A[2]); platos[2].scale.setScalar(0.7);
    mont.g.position.set(mx, 1.124, BOC_A[2]); ponerBoc(mont, {});
    return rA;
  }

  // ——— el bocadillo despiezado (diagrama) y el termómetro de la TAE, sobre fondo oscuro ———
  const diaG = grupo(); const DX = 60;
  const bocD = hacerBoc(diaG, 2.4);
  const termG = new T.Group(); diaG.add(termG); termG.position.set(DX + 0.68, 1.42, 0); termG.scale.setScalar(0.82);
  const tubo = new T.Mesh(new T.CylinderGeometry(0.085, 0.085, 1.5, 24, 1, true), new T.MeshStandardMaterial({ color: 0xcbd5e1, transparent: true, opacity: 0.22, roughness: 0.1, side: T.DoubleSide, depthWrite: false }));
  tubo.position.y = 0.75; termG.add(tubo);
  const mTerm = mat(0x2dd4bf, { emissive: 0x2dd4bf, emissiveIntensity: 0.7, roughness: 0.3 });
  const bulbo = new T.Mesh(new T.SphereGeometry(0.15, 20, 14), mTerm); termG.add(bulbo);
  const nivel = new T.Mesh(new T.CylinderGeometry(0.055, 0.055, 1, 18), mTerm); termG.add(nivel);
  [0.3, 0.6, 0.9, 1.2].forEach(y => caja(termG, 0.09, 0.012, 0.012, mat(0xcbd5e1), 0.14, y, 0.0));
  function diagrama(o) {   // o = { abre, capas: [q…], tapa, brilloTapa, nivel (0..1 de la columna), cierra }
    bocD.g.position.set(DX - 0.17, 1.5, 0); bocD.g.rotation.set(0.1, 0, 0);
    const r = ponerBoc(bocD, { abre: o.abre, alto: 0.1, capas: o.capas, tapa: o.tapa, brilloTapa: o.brilloTapa });
    const h = 0.1 + 1.3 * (o.nivel || 0); nivel.scale.y = h; nivel.position.y = h / 2; return r;
  }

  // ——— el salón: sofá, lámpara y un cuadro ———
  const salG = grupo(); const SX = 90;
  caja(salG, 6, 4, 0.2, mat(0x29324a, { roughness: 0.9 }), SX, 2, -1.9);
  const mSofa = mat(0x4b5a73, { roughness: 0.85 });
  caja(salG, 2.1, 0.42, 0.85, mSofa, SX, 0.25, -1.0); caja(salG, 2.1, 0.78, 0.22, mSofa, SX, 0.66, -1.38); [-1.12, 1.12].forEach(dx => caja(salG, 0.22, 0.62, 0.85, mSofa, SX + dx, 0.36, -1.0));
  cil(salG, 0.02, 0.02, 1.6, mat(0x1e293b), SX + 1.6, 0.8, -1.4, 8); cil(salG, 0.14, 0.24, 0.3, new T.MeshBasicMaterial({ color: 0xffd9a0 }), SX + 1.6, 1.7, -1.4, 18);
  const lSal = new T.PointLight(0xffcf8a, 1.4, 6, 1.6); lSal.position.set(SX + 1.5, 1.6, -1.0); salG.add(lSal);
  const lzCuadro = pinta(400, 300, (x, w, h) => { x.fillStyle = '#e2e8f0'; x.fillRect(0, 0, w, h); x.fillStyle = '#14b8a6'; x.fillRect(20, 20, w - 40, h - 40); x.fillStyle = '#fde68a'; x.beginPath(); x.arc(270, 110, 40, 0, 7); x.fill(); x.fillStyle = '#0f766e'; x.beginPath(); x.moveTo(20, 280); x.lineTo(150, 130); x.lineTo(260, 280); x.fill(); });
  plano(salG, 0.8, 0.6, lzCuadro, SX - 0.5, 1.95, -1.79, false, 0.25);

  function apagar() {
    objs.forEach(g => { g.visible = false; }); tarG.visible = false; villG.visible = false; cajasV.forEach(m => { m.visible = false; });
    cab({}); ponGafas(0); enMano({}); H.cuerpo.rotation.z = 0; manoG.position.set(0, 0, 0);
  }
  const ver = (g) => { g.visible = true; };
  return { plaza: () => ver(plazaG), bar: () => ver(barG), dia: () => ver(diaG), salon: () => ver(salG), cab, ponGafas, pose, tarjeta, enMano, cajaArriba, villano,
    dibCartel, dibTiza, barra, diagrama, cajasV, apagar, CARTEL, ESQUINA, BOC_A, BOC_B, MESA1, MESA2, BX, DX, SX };
})();
W3.X = X3;
`;

const ESCENAS = [
  { html: () => '', anim: null },   // 0 · tarjeta-título (fotograma 0 lleno)
  { html: () => '', anim: null },   // 1 · mundo y creencia
  { html: () => '', anim: null },   // 2 · espejo
  { html: () => '', anim: null },   // 3 · giro con accesorio
  { html: () => '', anim: null },   // 4 · adelanto (pan = TIN)
  { html: () => '', anim: null },   // 5 · cómo funciona (toma larga del diagrama)
  { html: () => '', anim: null },   // 6 · todo va bien (3 golpes)
  // 7 · pausa: la flecha a rotulador «estaba aquí todo el rato» (la coloca TRES sobre la esquina del cartel).
  { html: () => `<div id="flecha"><svg viewBox="0 0 560 430"><path class="tr" d="M300 120 C 420 150, 500 250, 518 392" fill="none" stroke="#f5b94a" stroke-width="13" stroke-linecap="round"/>
      <path class="pu" d="M482 352 L 518 398 L 548 346" fill="none" stroke="#f5b94a" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <span>estaba aquí<br>todo el rato</span></div>`, anim: null },
  // 8 · respuesta: el contador 0 % TIN → 3,81 % TAE (en «no») y la letra pequeña de la tarjeta «TAE = LA CUENTA».
  { html: () => `<div class="cont" style="top:520px"><small>TIN</small><b>0 %</b></div>
      <div class="letra" style="top:290px">Ejemplo del Banco de España (2018): 500 € en 12 meses,<br>0 % TIN y 10 € de gastos de gestión → TAE ${TAE_TXT} %</div>`,
    anim: function (s, e, el) {
      const M = e.seg.flatMap(g => g.marcas), m0 = M[0] != null ? M[0] : 1.2, m1 = M[1] != null ? M[1] : 2.6, m2 = M[2] != null ? M[2] : 3.8;
      const c = el.querySelector('.cont'), ap = rebote(tramo(s, 0.25, 0.6)) * (s < m1 ? 1 : 0);
      c.style.opacity = Math.min(1, ap * 1.4); c.style.transform = 'translateX(-50%) scale(' + (0.8 + 0.2 * ap) + ')';
      const v = 3.81 * sale(tramo(s, m0 - 0.05, m0 + 0.95)), tae = s >= m0;
      c.classList.toggle('tae', tae); c.querySelector('small').textContent = tae ? 'TAE' : 'TIN';
      c.querySelector('b').textContent = (v >= 3.805 ? '3,81' : v.toFixed(2).replace('.', ',').replace(/^0,00$/, '0')) + ' %';
      const l = el.querySelector('.letra'); l.style.opacity = s >= m1 + 0.1 && s < m2 - 0.45 ? 1 : 0;
    } },
  { html: () => '', anim: null }    // 9 · analogía (bar) y final mudo
];

// Coreografía 3D. Cada escena puede tener varios planos (cortes en sus marcas §), como pide el esqueleto.
const TRES = function (t, k, s, e, W) {
  const X = W.X; X.apagar();
  const M = e.seg.flatMap(g => g.marcas), mk = (j, d) => e.ini + (M[j] != null ? M[j] : d);
  const q = (a, d) => sale(tramo(t, a, a + (d || 0.45)));
  const p = Math.min(1, s / (e.fin - e.ini));
  const mez = (P, Q, u) => P.map((v, j) => v + (Q[j] - v) * u);
  const cam = (P, Q, u) => W.camara(...(Q ? mez(P, Q, Math.max(0, Math.min(1, u))) : P));
  const TQ = '#5eead4', ROJO = '#f87171', AMB = '#f5b94a', GRIS = '#94a3b8', BL = '#e2e8f0';
  const fuera = { x: -60, z: -60, esc: 0 };
  let directo = () => fuera, tras = null;
  const heroe = (o) => W.heroe(Object.assign({ luz: 0 }, o));
  // Protagonista en la plaza para el fotograma 0 y el final mudo (mismo encuadre: el bucle empalma).
  const H0 = [-6.6, 0.6], P0 = [-6.6, 1.47, 3.57, -6.6, 1.44, 0.6];
  const paseo = (i, a, n, z0) => { if (i >= n) return fuera; const dir = i % 2 ? 1 : -1, uu = (((t * a.vel * 0.7 + a.u0) % 24) + 24) % 24 - 12;
    return { x: -7 + dir * uu, z: z0 - (i % 2) * 0.8, rot: dir > 0 ? Math.PI / 2 : -Math.PI / 2, amp: 1, fase: t * a.vel * 3.2, esc: Math.min(1, (12 - Math.abs(uu)) / 2) }; };
  // Plano del escaparate (escenas 6–8): el maniquí de espaldas con la caja en la mano izquierda; desde esta cámara baja su
  // boina tapa la esquina del cartel donde va la TAE.
  const HE = [4.85, -3.95], CE0 = [4.96, 1.23, -0.4, 4.1, 1.75, -5.95], CE1 = [4.9, 1.3, -1.5, 4.15, 1.78, -5.95];
  const CAJA_IZQ = [0.37, 0.86, 0.06, Math.PI / 2, 0];

  if (k === 0) {
    // 0 · Tarjeta-título: la plaza de noche, el maniquí de la boina con la cartulina «TIN vs TAE» a la altura del pecho.
    // En «TAE» gira la cabeza de una palabra a la otra.
    const m0 = mk(0, 1.0); X.plaza();
    heroe({ x: H0[0], z: H0[1], gira: 0 }); X.pose('sostener');
    X.tarjeta({ mano: true, frente: { tipo: 'titulo' } });
    const g = q(m0 - 0.12, 0.4); X.cab({ x: 0.28 + 0.2 * g, y: 0.18 - 0.36 * g });
    directo = (i, a) => paseo(i, a, 2, -5.6);
    cam(P0, [-6.6, 1.47, 3.45, -6.6, 1.44, 0.6], p);
  } else if (k === 1) {
    // 1 · Mundo y creencia: el cartel de entrada, vecinos con cajas y el bazar «TODO A PLAZOS»; en «creen», la pared de la tiza:
    // un vecino termina el «=» de «TIN = TAE» en «lo mismo» y asiente.
    const m0 = mk(0, 1.4), m1 = mk(1, 2.4); X.plaza();
    if (t < m0) {
      directo = (i, a) => { if (i >= 4) return fuera; const dir = i % 2 ? 1 : -1, x0 = [3.0, 9.6, 4.6, 10.6][i], vel = 1.05 + 0.1 * i;
        return { x: x0 + dir * vel * (t - e.ini), z: [-2.6, -1.4, -3.4, -0.6][i], rot: dir > 0 ? Math.PI / 2 : -Math.PI / 2, amp: 0.8, fase: (t - e.ini) * vel * 4.2 }; };
      tras = () => { for (let i = 0; i < 4; i++) { const a = W.gente[i], d = a.g.rotation.y, cx = a.g.position.x + Math.sin(d) * 0.34, cz = a.g.position.z + Math.cos(d) * 0.34;
        X.cajasV[i].visible = true; X.cajasV[i].position.set(cx, 1.12, cz); X.cajasV[i].rotation.y = d;
        a.izq.hombro.rotation.x = a.der.hombro.rotation.x = -0.7; a.izq.codo.rotation.x = a.der.codo.rotation.x = -0.7; a.izq.hombro.rotation.z = 0.22; a.der.hombro.rotation.z = -0.22; } };
      cam([9.3, 1.75, 9.6, 6.9, 2.15, -1.5], [9.15, 1.75, 9.3, 6.85, 2.15, -1.5], tramo(t, e.ini, m0));
    } else {
      X.dibTiza(q(m0 + 0.05, Math.max(0.3, m1 - m0 - 0.05)));
      const nod = t > m1 ? Math.sin(tramo(t, m1, m1 + 0.9) * Math.PI * 2) * 0.12 : 0, atras = q(m1 + 0.05, 0.35);
      // De espaldas, a la derecha del «=», con el brazo izquierdo levantado (la tiza está por encima de su cabeza).
      directo = (i) => i === 0 ? { x: -1.93 + 0.2 * atras, z: -5.62 + 0.3 * atras, rot: Math.PI, amp: 0 } : fuera;
      tras = () => { const a = W.gente[0], dib = tramo(t, m0, m1);
        a.izq.hombro.rotation.x = -2.75 * (1 - atras); a.izq.hombro.rotation.z = 0.05 + 0.12 * dib; a.izq.codo.rotation.x = -0.15;
        a.cuerpo.rotation.x = 0.03 + nod; };
      cam([-2.05, 1.5, -1.75, -2.15, 1.92, -6.0], [-2.05, 1.5, -1.95, -2.15, 1.92, -6.0], tramo(t, m0, e.fin));
    }
  } else if (k === 2) {
    // 2 · Espejo, en la barra del bar: señala un bocadillo (corte en «bocadillo») y otro idéntico (corte en «bocata»); dentro de
    // ese plano llega solo, deslizándose, un montadito (rótulo no narrado).
    const m0 = mk(0, 1.4), m1 = mk(1, 2.6), BX = X.BX; X.bar();
    const mon = 1 - sale(tramo(t, m1 + 0.12, m1 + 0.62));
    X.barra({ monX: BX + 1.2 + 1.2 * mon });
    const apunta = t < m1 ? -0.42 : 0.38;
    heroe({ x: BX, z: -1.25, gira: apunta, senala: 0.9 * q(e.ini + 0.15, 0.35) });
    if (t < m0) cam([BX + 0.05, 1.62, 2.05, BX, 1.28, -0.7], [BX + 0.05, 1.6, 1.85, BX, 1.28, -0.7], tramo(t, e.ini, m0));
    else if (t < m1) {
      W.rotulo('boc', 'BOCADILLO', X.BOC_A[0], 1.4, X.BOC_A[2], q(m0 - 0.05, 0.25), TQ, 0.12);
      cam([BX - 0.3, 1.42, 0.62, X.BOC_A[0], 1.2, -0.5], [BX - 0.32, 1.41, 0.5, X.BOC_A[0], 1.2, -0.5], tramo(t, m0, m1));
    } else {
      W.rotulo('bta', 'BOCATA', X.BOC_B[0], 1.4, X.BOC_B[2], q(m1 - 0.05, 0.25), TQ, 0.12);
      W.rotulo('mon', 'montadito: no abramos ese debate', BX + 0.97, 1.27, X.BOC_A[2] + 0.05, q(m1 + 0.55, 0.3), GRIS, 0.06);
      cam([BX + 0.78, 1.43, 0.66, BX + 0.68, 1.2, -0.5], [BX + 0.8, 1.42, 0.55, BX + 0.68, 1.2, -0.5], tramo(t, m1, e.fin));
    }
  } else if (k === 3) {
    // 3 · Giro con accesorio: primer plano con la cartulina; en «TAE» se pone las gafas de leer; en «miden», inserto de la cinta
    // métrica entre las dos palabras: la TAE sale más larga («TIN ≠ TAE»). Zoom lento de 1 s.
    const m0 = mk(0, 1.0), m1 = mk(1, 1.9), BX = X.BX; X.bar(); X.barra({});
    heroe({ x: BX, z: 0.35, gira: 0 }); X.pose('sostener');
    const ci = tramo(t, m1 + 0.05, m1 + 1.25);
    X.tarjeta({ mano: true, frente: { tipo: 'titulo', cinta: Math.round(ci * 40) / 40, estira: Math.round(sale(tramo(ci, 0.5, 1)) * 40) / 40 } });
    X.ponGafas(sale(tramo(t, m0 - 0.1, m0 + 0.35))); X.cab({ x: 0.2 + 0.12 * q(m0 + 0.3, 0.3), y: 0 });
    if (t < m1) cam([BX, 1.48, 3.05, BX, 1.46, 0.35], [BX, 1.48, 2.85, BX, 1.46, 0.35], tramo(t, e.ini, m1));
    else {
      const zt = 0.35 + 0.47 * 1.06, yc = 1.25 * 1.06;
      W.rotulo('neq', 'TIN ≠ TAE', BX, yc, zt + 0.05, q(m1 + 0.25, 0.3), AMB, 0.085);
      const zz = 1 - sale(tramo(t, m1, m1 + 1.0));
      W.camara(BX, yc, zt + 1.0 + 0.16 * zz, BX, yc - 0.01, zt);
    }
  } else if (k === 4) {
    // 4 · Adelanto: plano cenital del bocadillo en la barra; en «Si» el maniquí lo levanta, en «bocadillo» la etiqueta TAE sobre
    // el bocadillo entero y en «pan» la rebanada de arriba se levanta sola con la etiqueta TIN. Corte seco.
    const m0 = mk(0, 1.8), m1 = mk(1, 3.2), m2 = mk(2, 4.6); X.bar();
    const lev = q(m0 - 0.05, 0.55), hz = -1.12;
    const a = [X.BOC_A[0], 1.1 + 0.3 * lev, X.BOC_A[2] - 0.22 * lev];
    const rA = X.barra({ a, tapaA: q(m2 - 0.05, 0.3) });
    heroe({ x: X.BOC_A[0], z: hz, gira: 0 }); X.pose('caja', lev);
    W.rotulo('taeB', 'TAE', a[0], a[1] + 0.12, a[2] - 0.2, q(m1 - 0.05, 0.25), TQ, 0.08);
    const tp = rA.tapa();
    W.rotulo('tinB', 'TIN', a[0] + 0.3, tp.y + 0.1, a[2] + 0.02, q(m2, 0.22), BL, 0.08);
    cam([X.BOC_A[0] + 0.02, 2.55, 0.18, X.BOC_A[0], 1.12, -0.6], [X.BOC_A[0] + 0.02, 2.42, 0.08, X.BOC_A[0], 1.18, -0.62], tramo(t, e.ini, e.fin));
  } else if (k === 5) {
    // 5 · Cómo funciona: una toma sin cortes del bocadillo despiezado; las capas caen en sus palabras, el termómetro de la TAE
    // sube dos tramos («Cuanto», «más sube»), en «tipo» baja el pan y se cierra y en «tasa» la cámara se aleja.
    const m = (j, d) => mk(j, d); X.dia(); W.niebla(5, 16);
    const c0 = q(m(0, 1.6), 0.5), c1 = q(m(1, 2.8), 0.5), c2 = q(m(2, 4.0), 0.5);
    const cierra = q(m(5, 10.3) - 0.05, 0.8), f7 = e.ini + (e.seg[2] ? e.seg[2].ini : 9.0);
    const r = X.diagrama({ abre: 1 - cierra, capas: [c0, c1, c2], tapa: 0, brilloTapa: Math.max(0, Math.sin(tramo(t, f7, f7 + 0.9) * Math.PI)) * (1 - cierra),
      nivel: 0.12 + 0.3 * q(m(3, 6.3) - 0.05, 0.5) + 0.3 * q(m(4, 7.2) - 0.05, 0.5) });
    const DX = X.DX, BXc = DX - 0.17;
    // Cada rótulo, encima de su capa (en el hueco del despiece); se van cuando el bocadillo se cierra.
    const etq = [['comisiones', ROJO], ['gastos', AMB], ['seguro obligatorio', '#86efac']];
    etq.forEach(([txt, col], i) => { const y = r.capa(i).y; W.rotulo('cap' + i, txt, BXc, y + 0.11, 0.3, [c0, c1, c2][i] * (1 - cierra), col, 0.105); });
    W.rotulo('term', 'TAE', DX + 0.68, 2.82, 0.05, q(m(3, 6.3) - 0.1, 0.3), TQ, 0.15);
    const tp = r.tapa();
    W.rotulo('tin5', 'TIN · tipo de interés nominal', BXc, tp.y + 0.2, 0.3, q(m(5, 10.3) + 0.25, 0.3), BL, 0.1);
    W.rotulo('tae5', 'TAE · tasa anual equivalente', BXc, 1.22, 0.35, q(m(6, 12.2) - 0.05, 0.3), TQ, 0.1);
    const aleja = sale(tramo(t, m(6, 12.2) - 0.1, e.fin)), cerca = tramo(t, e.ini, m(5, 10.3));
    W.camara(DX + 0.0, 1.95 - 0.08 * cerca, 3.9 - 0.35 * cerca + 0.75 * aleja, DX + 0.0, 1.9 - 0.08 * cerca - 0.05 * aleja, 0);
  } else if (k === 6) {
    // 6 · Todo va bien, tres golpes: sale de «Electro Villaplazos» con la caja (500 €); «A plazos»: en el sofá con la tableta
    // (12 meses); «Sin»: de espaldas delante del escaparate, la boina tapa la esquina del cartel donde va la TAE.
    const m0 = mk(0, 1.3), m1 = mk(1, 2.4);
    if (t < m0) {
      X.plaza(); const u = tramo(t, e.ini, m0);
      heroe({ x: 1.3 + 0.1 * u, z: -5.75 + 1.25 * u, gira: 0.08, amp: 1, fase: (t - e.ini) * 7 }); X.pose('caja');
      X.enMano({ caja: [0, 1.0, 0.36, 0, 0] });
      W.rotulo('p500', '500 €', 1.92, 1.55, -4.2 + 1.25 * u, q(e.ini + 0.1, 0.25), AMB, 0.19);
      cam([2.05, 1.62, -1.55, 1.35, 1.75, -5.5], [2.05, 1.62, -1.7, 1.35, 1.75, -5.5], u);
    } else if (t < m1) {
      X.salon(); const SX = X.SX;
      heroe({ x: SX - 0.1, z: -0.88, y: -0.5, gira: 0 }); X.pose('tableta');
      X.enMano({ tableta: [0, 1.06, 0.42, -0.75] }); X.cab({ x: 0.5 });
      W.rotulo('m12', '12 meses', SX + 0.22, 1.62, -0.55, q(m0 + 0.08, 0.25), AMB, 0.14);
      cam([SX + 0.4, 1.3, 2.1, SX - 0.05, 0.98, -0.8], [SX + 0.4, 1.3, 1.95, SX - 0.05, 0.98, -0.8], tramo(t, m0, m1));
    } else {
      X.plaza(); X.dibCartel(0);
      heroe({ x: HE[0], z: HE[1], gira: Math.PI }); X.pose('lado'); X.enMano({ caja: CAJA_IZQ });
      cam(CE0, CE1, 0.12 * tramo(t, m1, e.fin));
    }
  } else if (k === 7) {
    // 7 · Pausa (sin cortes, mismo plano del cartel): silencio digital, después zumbido y zoom lento continuo. El villano (10 €
    // con patitas) entra por abajo, trepa por la caja y se sienta mirando a cámara; el maniquí gira la cabeza despacio hacia él;
    // el foco salta al cartel del fondo y la flecha «estaba aquí todo el rato» apunta a la esquina de la TAE (borrosa).
    // La voz vuelve sobre el mismo plano (J-cut) y el zumbido se corta en seco en el corte.
    const pz = e.pausa || { ini: 0, voz: 7.9, sonido: 0.7, fin: 10 }, T0 = e.ini;
    X.plaza();
    const foco = q(T0 + 6.6, 0.18); X.dibCartel(7 * (1 - foco));
    const gira = sale(tramo(t, T0 + 4.6, T0 + 5.9));
    heroe({ x: HE[0], z: HE[1], gira: Math.PI }); X.pose('lado'); X.enMano({ caja: CAJA_IZQ });
    X.cab({ y: 0.8 * gira, x: 0.38 * gira }); W.H.cuerpo.rotation.z = -0.1 * gira;
    // Villano: entra andando desde abajo del cuadro, trepa por la caja y se sienta encima, mirando a cámara.
    const top = X.cajaArriba(), suelo = [top.x + 0.25, -1.35], pie = [top.x, top.z + 0.1];
    const a1 = T0 + 1.6, a2 = T0 + 2.9, a3 = T0 + 3.75, a4 = T0 + 4.0, mira = Math.atan2(CE0[0] - top.x, CE0[2] - top.z);
    let vx, vy, vz, paso = null, trepa = null, sen = 0, ry = mira;
    if (t < a2) { const u = tramo(t, a1, a2); vx = suelo[0] + (pie[0] - suelo[0]) * u; vz = suelo[1] + (pie[1] - suelo[1]) * u; vy = 0; paso = t * 14; ry = Math.atan2(pie[0] - suelo[0], pie[1] - suelo[1]); }
    else if (t < a3) { const u = sale(tramo(t, a2, a3)); vx = pie[0]; vz = pie[1]; vy = (top.y - 0.02) * u; trepa = t * 16; ry = Math.PI; }
    else { const u = sale(tramo(t, a3, a4)); vx = pie[0]; vz = pie[1] - 0.06 * u; vy = top.y - 0.02; sen = u; ry = Math.PI + (mira - Math.PI) * u; }
    if (t >= a1) X.villano({ x: vx, y: vy, z: vz, ry, paso, trepa, sentado: sen, esc: 0.85 });
    W.rotulo('ggest', 'gastos de gestión', vx, vy - 0.07, vz + 0.1, t >= a1 ? q(T0 + 4.1, 0.3) : 0, ROJO, 0.075);
    // Zoom lento y continuo desde que empieza el zumbido hasta el corte.
    cam(mez(CE0, CE1, 0.12), CE1, sale(tramo(t, T0 + pz.sonido, e.fin + 0.3)));
    // Flecha 2D: su punta, en la esquina de la TAE.
    const fl = document.getElementById('flecha');
    if (fl) { const P = W.pantalla(X.ESQUINA[0], X.ESQUINA[1], X.ESQUINA[2]), pr = tramo(t, T0 + 6.6, T0 + 7.15);
      fl.style.left = (P.x - 520) + 'px'; fl.style.top = (P.y - 402) + 'px'; fl.style.opacity = pr > 0 ? 1 : 0;
      const tr = fl.querySelector('.tr'); tr.style.strokeDasharray = 520; tr.style.strokeDashoffset = 520 * (1 - sale(tramo(pr, 0, 0.75)));
      fl.querySelector('.pu').style.opacity = pr > 0.72 ? 1 : 0; fl.querySelector('span').style.opacity = sale(tramo(pr, 0.3, 0.9)); }
  } else if (k === 8) {
    // 8 · Respuesta: corte al cartel ya enfocado, el maniquí se aparta y el contador (2D) sube de 0 % TIN a 3,81 % TAE en «no».
    // En «TAE», corte a la tarjeta «TAE = LA CUENTA» en sus manos (mismo trazo que el fotograma 0). Al acabar la frase, le
    // enseña la tarjeta a la etiqueta de 10 €, que se encoge.
    const m1 = mk(1, 2.6), m2 = mk(2, 3.8); X.plaza(); X.dibCartel(0);
    if (t < m1) {
      const u = tramo(t, e.ini + 0.05, e.ini + 1.0);
      heroe({ x: HE[0] - 2.0 * sale(u), z: HE[1], gira: -Math.PI / 2, amp: u > 0 && u < 1 ? 1 : 0, fase: t * 7 }); X.pose('lado'); X.enMano({ caja: CAJA_IZQ });
      cam([4.0, 1.9, -1.55, 4.0, 1.86, -5.95], [4.0, 1.9, -1.75, 4.0, 1.86, -5.95], tramo(t, e.ini, m1));
    } else if (t < m2 - 0.45) {
      heroe({ x: 2.4, z: -3.4, gira: 0.1 }); X.pose('sostener');
      X.tarjeta({ mano: true, frente: { tipo: 'cuenta' } }); X.ponGafas(1); X.cab({ x: 0.15 });
      const zt = -3.4 + 0.47 * 1.06;
      W.camara(2.45, 1.34, zt + 1.45 - 0.1 * tramo(t, m1, m2), 2.43, 1.33, zt);
    } else {
      // Contraplano por encima del villano (sentado en el suelo): la tarjeta se le acerca y él encoge.
      heroe({ x: 2.4, z: -3.4, gira: 0.1 }); X.pose('sostener'); X.tarjeta({ mano: true, frente: { tipo: 'cuenta' } }); X.ponGafas(1); X.cab({ x: 0.35 });
      const enc = sale(tramo(t, m2 - 0.35, m2 + 0.1));
      X.villano({ x: 2.55, y: 0.0, z: -2.35, ry: Math.PI - 0.15, sentado: 1, esc: 0.95 * (1 - 0.6 * enc) });
      W.camara(2.9, 0.75, -1.2, 2.42, 1.15, -3.3);
    }
  } else if (k === 9) {
    // 9 · Analogía: la terraza del bar «El Plazo Fijo»; «la caña»: la caña en la mesa junto a la pizarra; «La terraza»: el
    // camarero deja el ticket con un golpe seco (solo visual); «Los gastos»: primer plano del ticket; medio segundo después de
    // «suplemento»: el maniquí leyendo el ticket con la etiqueta de 10 € sentada a su lado.
    // Final mudo (cola): al acabar la voz, corte a la cara muda (mismo encuadre que el fotograma 0): 1 s inmóvil, ladea la
    // cabeza y da la vuelta al ticket; corte en seco a mitad del giro; el reverso «TIN vs TAE» empalma con el fotograma 0.
    const m0 = mk(0, 0.9), m1 = mk(1, 2.4), m2 = mk(2, 3.6), m3 = mk(3, 5.2), m4 = mk(4, 6.4);
    X.plaza();
    const M1 = X.MESA1, M2 = X.MESA2, TK = [M1[0] - 0.12, M1[1] + 0.13];
    const ticketMesa = (yy, rx, rz) => X.tarjeta({ frente: { tipo: 'ticket' }, x: TK[0], y: yy, z: TK[1], rx, ry: 0, rz: rz || 0, esc: 0.42 });
    if (t < m0) {
      directo = (i, a) => paseo(i, a, 2, -2.0);
      cam([-6.0, 1.75, 4.2, -7.0, 2.0, -4.2], [-6.05, 1.75, 3.9, -7.0, 2.0, -4.2], tramo(t, e.ini, m0));
    } else if (t < m1) {
      cam([M1[0] + 0.55, 1.15, M1[1] + 1.55, M1[0] + 0.42, 0.95, M1[1] + 0.1], [M1[0] + 0.55, 1.13, M1[1] + 1.42, M1[0] + 0.42, 0.95, M1[1] + 0.1], tramo(t, m0, m1));
    } else if (t < m2) {
      // El camarero (maniquí claro) deja el ticket: cae y golpea la mesa.
      const cae = tramo(t, m1 + 0.05, m1 + 0.32), yy = 0.79 + 0.5 * (1 - cae * cae), bote = Math.max(0, Math.sin(tramo(t, m1 + 0.32, m1 + 0.5) * Math.PI)) * 0.025;
      ticketMesa(yy + bote, -Math.PI / 2 + 0.5 * (1 - cae), 0.2 * (1 - cae));
      directo = (i) => i === 0 ? { x: M1[0] - 0.55, z: M1[1] - 0.45, rot: 0.85, amp: 0, color: 0xe2e8f0, cq: 0.7, brillo: 0.1 } : fuera;
      tras = () => { const a = W.gente[0], baja = tramo(t, m1 - 0.15, m1 + 0.3); a.der.hombro.rotation.x = -1.1 + 0.5 * baja; a.der.codo.rotation.x = -0.3; a.izq.hombro.rotation.x = 0; };
      cam([M1[0] + 0.7, 1.55, M1[1] + 2.0, M1[0] - 0.05, 0.95, M1[1]], [M1[0] + 0.68, 1.53, M1[1] + 1.88, M1[0] - 0.05, 0.95, M1[1]], tramo(t, m1, m2));
    } else if (t < m3 + 0.5) {
      ticketMesa(0.795, -Math.PI / 2, 0);
      const zz = tramo(t, m2, m3 + 0.5);
      W.camara(TK[0], 1.42 - 0.04 * zz, TK[1] + 0.2, TK[0], 0.795, TK[1] - 0.005);
    } else if (t < m4) {
      heroe({ x: M2[0], z: M2[1] - 0.62, y: -0.5, gira: 0 }); X.pose('leer');
      X.tarjeta({ mano: true, frente: { tipo: 'ticket' }, y: 1.22, z: 0.42, rx: -0.25, esc: 0.6 }); X.cab({ x: 0.42 });
      X.villano({ x: M2[0] + 0.28, y: 0.775, z: M2[1] + 0.06, ry: -0.35, sentado: 1, esc: 0.62 });
      cam([M2[0] + 0.15, 1.25, M2[1] + 1.95, M2[0] + 0.05, 1.02, M2[1] - 0.2], [M2[0] + 0.15, 1.24, M2[1] + 1.85, M2[0] + 0.05, 1.02, M2[1] - 0.2], tramo(t, m3 + 0.5, m4));
    } else {
      const u = t - m4, lad = sale(tramo(u, 1.0, 1.35)), giro = tramo(u, 1.3, 1.95);
      heroe({ x: H0[0], z: H0[1], gira: 0 }); X.pose('sostener');
      X.tarjeta({ mano: true, frente: { tipo: 'ticket' }, dorso: { tipo: 'titulo' }, ry: Math.PI * giro * (0.7 + 0.3 * giro) });
      X.cab({ z: 0.3 * lad, x: 0.05 * lad });
      directo = (i, a) => paseo(i, a, 2, -5.6);
      cam(P0);
    }
  }
  W.multitud(t, { directo });
  if (tras) tras();
};

const pildoras = {
  'es-tin-vs-tae': pildora3d({
    slug: 'es-tin-vs-tae', cuenta: 'es',
    T: { es: { titulo: 'TIN vs TAE: por qué «sin intereses» no siempre es gratis', guion: GUION } },
    voz: VOZ_SECA,                       // voz seca y pausada: el propietario la aceptó solo para este experimento
    sub: false, musica: false,           // sin subtítulos (rótulos en su palabra) y sin música bajo la voz
    sonidos: { escena: null },           // sin whoosh en los cortes: el único sonido es el zumbido de la pausa
    pausas: { 7: { dur: PAUSA_S, silencio: 0.7, sonido: 'zumbido' } },   // ~8 s sin voz; el zumbido se corta en seco en el corte
    cola: 1.8, corte2d: 'seco',          // final mudo de 1,8 s que empalma con el fotograma 0
    cssExtra: CSS, scriptExtra: SCRIPT,
    escenas: ESCENAS, tres: TRES,
    texto: { es: TEXTO }
  })
};

module.exports = { pildoras };
