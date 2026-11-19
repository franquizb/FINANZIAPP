// Formato extenso (45–60 s) · @finanziapp.es (España), en 3D (reels-voz/tres.js), serie «Hacemos la cuenta».
// es-agricultor · «Pagas de media 1,73 euros por un kilo de patatas. Al agricultor le pagaron 28 céntimos.»
// Guion final y verificado: guiones/2026-11-es-agricultor.md (tabla de escenas, cuentas, fuentes, texto y portada).
// Validez: mientras el último IPOD publicado de COAG sea el de octubre de 2026 (el de noviembre sale a primeros de diciembre).
//
// Fuentes de cada dato (consultadas el 18-nov-2026):
// - COAG, Índice de Precios en Origen y Destino (IPOD), patata, origen → destino en €/kg («destino» = precio medio en
//   supermercados y grandes superficies). PDF originales de COAG enlazados por Hortoinfo (coag.org no responde desde aquí):
//   · octubre de 2026: 0,28 → 1,73 (6,18 veces; 518 %). https://chil.me/download-file/526406d0-f45f-4774-a060-a9dc83d4a55c
//     Hortoinfo, 04/11/2026: https://hortoinfo.es/en-octubre-el-precio-del-melon-subio-un-457-del-campo-al-mercado-el-calabacin-un-444-y-la-berenjena-un-440/
//   · julio de 2026: 0,36 → 1,69. https://chil.me/download-file/b775c77b-919a-4f25-a27f-b416d1f64712
//   · abril de 2026: 0,61 → 1,93. https://chil.me/download-file/6cb3f8f5-5e3e-463d-b87c-d73b239a097c
//     Hortoinfo, 06/05/2026: https://hortoinfo.es/el-precio-del-calabacin-se-multiplico-casi-por-cinco-en-abril-desde-el-agricultor-al-consumidor/
//   · marzo de 2026: 0,40 → 1,98. https://chil.me/download-file/d7e09b7a-f6ac-4264-ac07-3f521fd69920
//   · febrero de 2026: 0,33 → 1,90. https://chil.me/download-file/3dbe5021-978b-4da8-8c2a-e9a82bbe221f
//   · enero de 2026: 0,35 → 1,91. https://chil.me/download-file/614e007a-2eed-419a-ae4e-cfd0ae6ee07a
//   · diciembre de 2025: 0,36 → 1,93. https://chil.me/download-file/b351623f-bfa2-4d6c-be7a-c25ad2890888
//   Mayo, junio, agosto y septiembre de 2026 no se han abierto y no se usan.
// - Ministerio de Agricultura, Pesca y Alimentación (MAPA), precios medios nacionales semanales en origen de 2026, patata
//   (€/100 kg, a granel): semana 18 = 76,18 (máximo), semana 35 = 30,58 (mínimo), semana 43 (19–25/10) = 39,38 (las 44 y 45
//   repiten 39,38 en todos los productos: arrastradas). Leído en la recopilación de la Generalitat de Catalunya («Font: MAPA»):
//   https://agricultura.gencat.cat/web/.content/de_departament/de02_estadistiques_observatoris/20_observatori_agroalimentari_de_preus/03_preus/01_preus_en_origen/01_preus_en_llotges_i_mercats/fitxers_estatics_nou/pllotja_agricoles/espanya/PO_Esp_Agricoles_2026.xls
// - Estructura de la cadena de valor de la patata (solo el ORDEN de las partidas y el TAMAÑO RELATIVO de los trozos rojos; en
//   pantalla no hay cifras de este estudio): Hidalgo Pérez, M. A. (Universidad Pablo de Olavide), «Análisis de la cadena de
//   valor agroalimentaria…», resumen ejecutivo, p. 16, datos 2010-2011 del MAPA «actualizados a 2024» (encargado por ASEDAS y
//   CAEA, 28/04/2026): origen 0,24 → almacenista 0,287 → envasador 0,512 → tienda 0,722 €/kg.
//   https://asedas.org/wp-content/uploads/2026/04/Estudio-Manuel-Hidalgo.pdf
// - IVA del 4 % para tubérculos naturales: Ley 37/1992, art. 91.Dos.1.1.º f) (BOE, consolidado, act. 07/10/2026).
//   https://www.boe.es/buscar/act.php?id=BOE-A-1992-28740
// - Precio por unidad de medida obligatorio: Real Decreto 3423/2000, arts. 3.2, 3.4 y 4.1 (BOE, consolidado).
//   https://www.boe.es/buscar/pdf/2000/BOE-A-2000-24118-consolidado.pdf
// - NO confirmado con la fuente primaria: los estudios de la cadena de valor del MAPA de 2010 y 2011 (mapa.gob.es no responde) y
//   la tabla original del MAPA (solo la recopilación de la Generalitat). El 1,73 € es de COAG y así se dice: el MAPA ya no
//   publica un precio en tienda reciente.
const { pildora3d } = require('./tres');
const { cuadra } = require('../reels/_comun');

// ——— cuentas (todas las del guion: guiones/2026-11-es-agricultor.md, «Cuentas (cuadra)») ———
const r2 = (v) => Math.round(v * 100) / 100;
const pct = (v) => Math.round(v * 1000) / 10;   // a un decimal
// ——— COAG, IPOD mensual de la patata (PDF de COAG; €/kg) ———
const IPOD = {                      // [origen, destino, veces que publica COAG, diferencia % que publica COAG]
  'dic-2025': [0.36, 1.93, 5.36, 436], 'ene-2026': [0.35, 1.91, 5.46, 446], 'feb-2026': [0.33, 1.90, 5.76, 476],
  'mar-2026': [0.40, 1.98, 4.95, 395], 'abr-2026': [0.61, 1.93, 3.16, 216], 'jul-2026': [0.36, 1.69, 4.69, 369],
  'oct-2026': [0.28, 1.73, 6.18, 518]
};
for (const [m, [o, d, v, p]] of Object.entries(IPOD)) {      // las cifras de COAG son coherentes entre sí
  cuadra(`COAG ${m}: veces`, r2(d / o), v);
  cuadra(`COAG ${m}: diferencia %`, Math.round((d - o) / o * 100), p);
}
const [O, D] = IPOD['oct-2026'];
cuadra('gancho: «1,73 euros»', D, 1.73);
cuadra('gancho: «28 céntimos»', Math.round(O * 100), 28);
cuadra('al agricultor llega el 16 % (COAG)', pct(O / D), 16.2);
cuadra('COAG: 1 de cada 6', Math.round(D / O), 6);
// ——— MAPA: precio medio nacional en origen, patata, 2026 (€/100 kg, a granel; recopilación de la Generalitat, «Font: MAPA») ———
const MAPA = { 's18 (27/04–03/05)': 76.18, 's35 (24–30/08)': 30.58, 's43 (19–25/10)': 39.38 };
const M = MAPA['s43 (19–25/10)'] / 100;
cuadra('Ministerio: «39 céntimos»', Math.round(M * 100), 39);
cuadra('el Ministerio «da más» que COAG', M > O, true);
cuadra('con el Ministerio llega el 22,8 %', pct(M / D), 22.8);
cuadra('«de cada 4 euros, la patata no llega a 1» con COAG', 4 * O / D < 1, true);
cuadra('«… no llega a 1» con el Ministerio', 4 * M / D < 1, true);
cuadra('pantalla: losa ámbar con COAG (de 1 €)', r2(4 * O / D), 0.65);
cuadra('pantalla: marca del Ministerio (de 1 €)', r2(4 * M / D), 0.91);
cuadra('texto: Ministerio 2026 de 76 a 31 céntimos', [Math.round(MAPA['s18 (27/04–03/05)']), Math.round(MAPA['s35 (24–30/08)'])].join(), '76,31');
cuadra('texto: de 76 a 31 = menos de la mitad', MAPA['s35 (24–30/08)'] / MAPA['s18 (27/04–03/05)'] < 0.5, true);
// ——— IVA superreducido del 4 % (Ley 37/1992, art. 91.Dos.1.1.º f) ———
const IVA = r2(D * 0.04 / 1.04);
cuadra('IVA de 1,73 al 4 %: «unos 7 céntimos»', IVA, 0.07);
cuadra('IVA exacto', Math.round(D * 0.04 / 1.04 * 10000) / 10000, 0.0665);
const DIF = r2(D - O);
cuadra('diferencia campo → tienda', DIF, 1.45);
const VIAJE = r2(D - O - IVA);
cuadra('«el viaje» (lo que no es patata ni IVA)', VIAJE, 1.38);
cuadra('reparto 0,28 + 1,38 + 0,07 = 1,73', r2(O + VIAJE + IVA), D);
cuadra('«casi todo lo demás es el viaje»: 95 % de lo que no es patata', Math.round(VIAJE / DIF * 100), 95);
cuadra('pantalla IVA: alturas 16 / 80 / 4 %', [O, VIAJE, IVA].map(v => Math.round(v / D * 100)).join(), '16,80,4');
// ——— PICO (COAG, abril → octubre de 2026) ———
const [oA, dA] = IPOD['abr-2026'];
cuadra('«en abril, 61 céntimos»', Math.round(oA * 100), 61);
cuadra('«en octubre, menos de la mitad»', O / oA < 0.5, true);
cuadra('campo: −54 %', Math.round((O - oA) / oA * 100), -54);
cuadra('tienda: de 1,93 a 1,73', [dA, D].join(), '1.93,1.73');
cuadra('tienda: «un 10 %» menos', Math.round((D - dA) / dA * 100), -10);
cuadra('si la tienda hubiera bajado los 33 céntimos enteros: −17 %', Math.round((O - oA) / dA * 100), -17);
cuadra('en euros: campo −0,33, tienda −0,20', [r2(O - oA), r2(D - dA)].join(), '-0.33,-0.2');
cuadra('en abril llegaba el 32 % al campo', Math.round(oA / dA * 100), 32);
// ——— Estructura del Ministerio (cadena 2010-2011 «actualizada a 2024», tal como la recoge Hidalgo, 2026) ———
const H = { origen: 0.24, almacen: 0.287, envasado: 0.512, tienda: 0.722 };
const sAlm = H.almacen - H.origen, sEnv = H.envasado - H.almacen, sTie = H.tienda - H.envasado, sTot = H.tienda - H.origen;
cuadra('Hidalgo: valor añadido total 0,482', Math.round(sTot * 1000) / 1000, 0.482);
cuadra('Hidalgo: almacén ≈ 10 %', Math.round(sAlm / sTot * 100), 10);
cuadra('Hidalgo: envasado ≈ 47 % (el que más)', Math.round(sEnv / sTot * 100), 47);
cuadra('Hidalgo: tienda ≈ 44 %', Math.round(sTie / sTot * 100), 44);
cuadra('Hidalgo: multiplicador 3,01 (el estudio pone 3,06)', r2(H.tienda / H.origen), 3.01);
// Tamaño de los trozos rojos en pantalla (ilustrativo: 1,38 € repartidos con esa estructura; NO se rotulan cifras)
const trozo = (s) => VIAJE * s / sTot;
cuadra('pantalla: trozo clasificar/almacén', r2(trozo(sAlm)), 0.13);
cuadra('pantalla: trozo lavar y embolsar', r2(trozo(sEnv)), 0.64);
cuadra('pantalla: trozo camión y tienda', r2(trozo(sTie)), 0.6);
cuadra('pantalla: los trozos (sin redondear) suman 1,38', r2(trozo(sAlm) + trozo(sEnv) + trozo(sTie)), VIAJE);
// ——— texto de la publicación: lo que ha bailado en 2026 (meses de COAG abiertos: ene, feb, mar, abr, jul, oct) ———
const a26 = ['ene-2026', 'feb-2026', 'mar-2026', 'abr-2026', 'jul-2026', 'oct-2026'].map(m => IPOD[m]);
cuadra('texto: campo 2026 entre 28 y 61 céntimos', [Math.min(...a26.map(v => v[0])), Math.max(...a26.map(v => v[0]))].join(), '0.28,0.61');
cuadra('texto: tienda 2026 entre 1,69 y 1,98', [Math.min(...a26.map(v => v[1])), Math.max(...a26.map(v => v[1]))].join(), '1.69,1.98');
cuadra('texto: «de 33 céntimos en febrero a 61 en abril»', [IPOD['feb-2026'][0], IPOD['abr-2026'][0]].join(), '0.33,0.61');
// ——— lo que sale en pantalla además de las frases (alturas a escala) ———
// Gancho y viaje: los 1,45 € que no son patata, en 4 trozos rojos con la estructura del Ministerio (camión y tienda a medias,
// solo para el dibujo: el estudio no separa el transporte).
const FR = [sAlm / sTot, sEnv / sTot, sTie / sTot / 2, sTie / sTot / 2];
const TROZOS = FR.map(f => DIF * f);
cuadra('pantalla: los 4 trozos rojos del gancho suman 1,45', r2(TROZOS.reduce((a, b) => a + b, 0)), 1.45);
cuadra('pantalla: el trozo ámbar es el 16 % de la columna', Math.round(O / D * 100), 16);
cuadra('pantalla: lavar y embolsar, el trozo más grande', TROZOS.indexOf(Math.max(...TROZOS)), 1);
cuadra('pantalla: losa de abajo, ámbar al 65 % (COAG)', Math.round(4 * O / D * 100), 65);
cuadra('pantalla: raya del Ministerio al 91 %', Math.round(4 * M / D * 100), 91);
cuadra('pantalla pico: CAMPO de 0,61 a 0,28 (alturas)', [oA, O].join(), '0.61,0.28');
cuadra('pantalla explicación: la punta baja de 1,93 a 1,73 (−0,20)', r2(dA - D), 0.2);
cuadra('pantalla explicación: la parte roja sube de 1,32 a 1,45', [r2(dA - oA), r2(D - O)].join(), '1.32,1.45');

const TEXTO = `Pagas de media 1,73 € por un kilo de patatas. Al agricultor le pagaron 28 céntimos. 🥔

Lo que no cabía en el vídeo:
• Son las medias de octubre de 2026 del índice de precios en origen y destino de COAG. El Ministerio de Agricultura mide el precio en origen de otra forma y da más: 39 céntimos el kilo la semana del 19 al 25 de octubre. Con cualquiera de las dos cifras, al campo llega menos de 1 de cada 4 euros.
• El precio del campo baila mucho más que el de la tienda. En los informes de COAG de este año que hemos consultado, en origen ha ido de 33 céntimos en febrero a 61 en abril y a 28 en octubre; en la tienda, entre 1,69 y 1,98 €. El Ministerio vio la patata en origen a 76 céntimos a finales de abril (la temprana) y a 31 a finales de agosto.
• De los 1,45 € de diferencia, unos 7 céntimos son IVA: la patata paga el tipo más bajo, el 4 %. El resto se va en el viaje: clasificar, lavar, embolsar, transportar, la tienda y la parte que se estropea por el camino. En el último desglose de la cadena del Ministerio (con datos de 2010-2011), lavar y envasar era el paso que más sumaba, casi tanto como la tienda.

Para hoy: cuando compres patatas, no compares bolsas, compara el precio por kilo. Por ley (Real Decreto 3423/2000) tiene que estar en la etiqueta, junto al precio y bien legible, también en lo que se vende a granel.

¿Cuánto creías que le llegaba al agricultor? 👇

Contenido educativo, no es asesoramiento financiero.

Fuentes: COAG, Índice de Precios en Origen y Destino (IPOD), patata: enero, febrero, marzo, abril, julio y octubre de 2026 (informes mensuales); Ministerio de Agricultura, Pesca y Alimentación, precios medios nacionales en origen de 2026, semanas 18, 35 y 43 (recopilados por la Generalitat de Catalunya); estudio de la cadena de valor de la patata del Ministerio (datos de 2010-2011, tal como los recoge M. A. Hidalgo, Universidad Pablo de Olavide, 2026); Ley 37/1992 del IVA, art. 91; Real Decreto 3423/2000. Cálculos propios, consultados el 18/11/2026.

#finanzaspersonales #educacionfinanciera #dinero #ahorro #compra`;

const GUION = [
  [0, 'Pagas de media 1,73 euros por un kilo de patatas. §Al agricultor §{pop}le pagaron *28 céntimos*.'],
  [1, 'Es la media de octubre, según COAG. §El Ministerio da más: §*39 céntimos*.'],
  [2, 'Con cualquiera de las dos, §de cada 4 euros en patatas, §{ding}*la patata no llega a 1*. §¿En qué se va *el resto*?'],
  [3, 'En el viaje: §la *clasifican*, la *lavan* y la *embolsan*, §la lleva un *camión*, §la tienda pone *local y personal* §y una parte *se estropea*.'],
  [4, 'Hacienda se lleva poco: §el IVA de la patata es del 4 %, §{caja}unos *7 céntimos*.'],
  [5, 'Lo curioso: §en abril, al agricultor le pagaban *61 céntimos*; §en octubre, *menos de la mitad*. §{tic}Y en la tienda, solo bajó *un 10 %*.'],
  [6, 'La patata es la parte pequeña: §aunque se hunda, §el total *se mueve mucho menos*.'],
  [7, 'Hoy, en el súper, §compara formatos por el *precio por kilo*, §que es obligatorio, §*no por bolsa*.'],
  [8, 'De cada 4 euros en patatas, §la patata no llega a 1. §{pop}*Casi todo lo demás es el viaje*.']
];

const MONO = `'DejaVu Sans Mono', 'Liberation Mono', monospace`;
const CSS = `
  .hud.i.fmt { letter-spacing: .14em; }
  .rt { position: absolute; left: 50%; top: 1335px; padding: 10px 30px 15px; border-radius: 20px; background: rgba(9,14,27,.9); border: 3px solid #e2e8f0;
    color: #fff; font-size: 64px; line-height: 1.1; font-weight: 900; letter-spacing: -.015em; white-space: nowrap; opacity: 0; font-variant-numeric: tabular-nums;
    box-shadow: 0 10px 40px rgba(0,0,0,.45); }
  .rt.p { font-size: 52px; } .rt.pp { font-size: 46px; } .rt.amb { border-color: #f5b94a; } .rt.roja { border-color: #f87171; } .rt.turq { border-color: #5eead4; }
  .rt .a { color: #f5b94a; } .rt .r { color: #f87171; } .rt .t { color: #5eead4; }
  /* Notas de fuente: una sola línea, por encima de los 1.500 px (debajo, Instagram pinta el usuario y el texto). */
  .nota { position: absolute; left: 70px; top: 1450px; margin: 0; max-width: 850px; font: 600 22px/1.3 ${MONO}; color: #b6c2d4; background: rgba(7,11,22,.8);
    border-radius: 10px; padding: 5px 14px; opacity: 0; white-space: nowrap; }
`;

// Mundo 3D propio (se añade al de tres.js): estantería, malla de patatas, bloques de la etiqueta-columna, carretera con las
// cuatro paradas (tienda, camión, máquina de lavar y embolsar, cinta clasificadora), campo, cubo de merma, losas de 1 €,
// paneles de texto, destellos y luces ámbar y roja. Todo se apaga al principio de cada fotograma (X3.apagar()).
const SCRIPT = `
function ver(n, s, a, b) { if (!n) return; let p = a < -0.5 ? 1 : rebote(tramo(s, a - 0.1, a + 0.25)); if (b != null) p *= 1 - tramo(s, b - 0.12, b); aparece3(n, p); }
const PI = Math.PI, AMBH = 0xf5b94a, ROJOH = 0xef4444, TURQH = 0x2dd4bf, BLANCOH = 0xe6ebf2;
const mezcla = (P, Q, u) => P.map((v, j) => v + (Q[j] - v) * u);
const suave = (x) => x * x * (3 - 2 * x);
const angulo = (a, b, g) => a + ((((b - a + PI) % (2 * PI)) + 2 * PI) % (2 * PI) - PI) * g;
// Cámara por fotogramas clave [[t, [px, py, pz, lx, ly, lz]]…] (spline de Hermite: no se para entre medias) y órbita alrededor
// del punto al que mira (los dos, de desmentido-en.js).
const ruta = (K, x) => {
  if (x <= K[0][0]) return K[0][1];
  if (x >= K[K.length - 1][0]) return K[K.length - 1][1];
  let j = 0; while (x > K[j + 1][0]) j++;
  const [t0, P0] = K[j], [t1, P1] = K[j + 1], dt = t1 - t0, u = (x - t0) / dt;
  const vel = (n) => n === 0 ? K[1][1].map((v, c) => (v - K[0][1][c]) / (K[1][0] - K[0][0])) : n === K.length - 1 ? P0.map(() => 0)
    : K[n + 1][1].map((v, c) => (v - K[n - 1][1][c]) / (K[n + 1][0] - K[n - 1][0]));
  const V0 = vel(j), V1 = vel(j + 1), u2 = u * u, u3 = u2 * u;
  return P0.map((v, c) => (2 * u3 - 3 * u2 + 1) * v + (u3 - 2 * u2 + u) * dt * V0[c] + (-2 * u3 + 3 * u2) * P1[c] + (u3 - u2) * dt * V1[c]);
};
const orbita = (C, ang) => { const dx = C[0] - C[3], dz = C[2] - C[5], c = Math.cos(ang), s_ = Math.sin(ang); return [C[3] + dx * c + dz * s_, C[1], C[5] - dx * s_ + dz * c, C[3], C[4], C[5]]; };

// Precios (D sale de datos(): COAG oct-2026, Ministerio s43, IVA, viaje, COAG abr-2026 y los 4 trozos rojos de 1,45 €).
const PR = D;
// Escala de la etiqueta-columna: metros por euro.
const KC = 0.68;
// Sitios del mundo: estantería en el origen; la carretera va hacia −z con las paradas a los lados; el campo al fondo.
const LAY = { YB: 1.05, BX: -0.32, CX: 0.32, CW: 0.34, CD: 0.15, TIE: [2.15, -4.2], CAM: [-2.2, -8.0], LAV: [2.15, -11.8], CIN: [-1.9, -15.2], AGR: [0.75, -16.9] };

const X3 = (() => {
  const W = W3, T = W.T, S = W.S, objs = [];
  const grupo = () => { const g = new T.Group(); g.visible = false; S.add(g); objs.push(g); return g; };
  const mat = (c, o) => new T.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.55, metalness: 0.08 }, o || {}));
  const pieza = (g, geo, m, x, y, z) => { const o = new T.Mesh(geo, m); o.position.set(x, y, z); o.castShadow = true; o.receiveShadow = true; g.add(o); return o; };
  const lienzo = (w, h, pintar) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); if (pintar) pintar(x, w, h);
    const tx = new T.CanvasTexture(c); tx.encoding = T.sRGBEncoding; tx.anisotropy = 4; return { c, x, tx }; };
  const TXC = {};
  const txTexto = (clave, w, h, pintar) => TXC[clave] || (TXC[clave] = lienzo(w, h, pintar).tx);
  const haloTx = lienzo(256, 256, (x) => { const g = x.createRadialGradient(128, 128, 0, 128, 128, 128); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.3, 'rgba(255,255,255,.4)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 256, 256); }).tx;

  // ——— patatas (esferas achatadas) ———
  const geoPat = new T.SphereGeometry(0.11, 14, 10);
  const mPat = mat(0xb08850, { roughness: 0.9, metalness: 0, emissive: 0x4a3016, emissiveIntensity: 0.5 });
  const patata = (g, x, y, z, r) => { const p = pieza(g, geoPat, mPat, x, y, z); p.scale.set(1.3, 0.95, 1.0); p.rotation.set(r, r * 1.7, r * 0.6); return p; };
  // Patatas sueltas (merma, la del agricultor, las de las cajas): pool.
  const sueltas = Array.from({ length: 16 }, () => { const p = new T.Mesh(geoPat, mPat); p.scale.set(1.3, 0.95, 1.0); p.castShadow = true; p.visible = false; S.add(p); return p; });
  function suelta(i, o) { const p = sueltas[i]; p.visible = true; p.position.set(o.x, o.y, o.z); p.rotation.set(o.rx || 0, o.ry || 0, o.rz || 0); const e = o.esc || 1; p.scale.set(1.3 * e, 0.95 * e, e); }

  // ——— malla de 1 kg: caja translúcida con red y 12 patatas (pivote en el centro) ———
  const geoBolsa = new T.BoxGeometry(1, 1, 1, 7, 8, 4);
  function hazMalla() {
    const g = grupo();
    const mCaja = new T.MeshStandardMaterial({ color: 0xdbe3ee, transparent: true, opacity: 0.22, roughness: 0.4, depthWrite: false });
    const mRed = new T.MeshBasicMaterial({ color: 0xe8eef6, wireframe: true, transparent: true, opacity: 0.6 });
    const caja = new T.Mesh(geoBolsa, mCaja), red = new T.Mesh(geoBolsa, mRed);
    caja.scale.set(0.8, 0.9, 0.42); red.scale.copy(caja.scale); g.add(caja); g.add(red);
    pieza(g, new T.TorusGeometry(0.09, 0.025, 8, 20), mat(0xe8eef6), 0, 0.52, 0);
    let k = 0; for (let fy = 0; fy < 4; fy++) for (let fx = 0; fx < 3; fx++) { patata(g, (fx - 1) * 0.255 + 0.02 * Math.sin(k * 2.1), (fy - 1.5) * 0.205, 0.06 * ((k % 2) ? 1 : -1), k * 0.9); k++; }
    return { g };
  }
  const mallas = [hazMalla(), hazMalla(), hazMalla()];
  // o = { x, y (centro), z, rx, ry, rz, esc, sy (aplastado: alto relativo; ensancha un poco) }
  function malla(i, o) { const m = mallas[i]; m.g.visible = true; m.g.position.set(o.x, o.y, o.z); m.g.rotation.set(o.rx || 0, o.ry || 0, o.rz || 0);
    const e = o.esc || 1, sy = o.sy || 1, sx = 1 + (1 - sy) * 0.5; m.g.scale.set(e * sx, e * sy, e * sx); return m; }

  // ——— bloques (trozos de la etiqueta-columna, columnas, franjas): caja con texto opcional en la cara de delante ———
  const geoB = new T.BoxGeometry(1, 1, 1);
  const bloques = Array.from({ length: 44 }, () => {
    const m = mat(0xffffff, { roughness: 0.45, transparent: true }), f = mat(0xffffff, { roughness: 0.45, transparent: true });
    const o = new T.Mesh(geoB, [m, m, m, m, f, m]); o.castShadow = true; o.receiveShadow = true; o.visible = false; S.add(o); return { o, m, f };
  });
  // o = { x, y, z (centro), w, h, d, color, brillo, rx, ry, rz, op, txt, txtColor }
  function bloque(i, o) {
    const b = bloques[i], op = o.op == null ? 1 : o.op; b.o.visible = op > 0.01 && o.h > 0.0005 && o.w > 0.0005; if (!b.o.visible) return b.o;
    const c = W.color(o.color == null ? BLANCOH : o.color), br = o.brillo == null ? 0.15 : o.brillo;
    b.m.color.copy(c); b.m.emissive.copy(c).multiplyScalar(br); b.m.opacity = op; b.m.depthWrite = op > 0.99;
    if (o.txt) {
      const hex = '#' + c.getHexString(), rr = Math.round(Math.max(0.5, Math.min(4, o.w / o.h)) * 4) / 4, fg = o.txtColor || '#1a1205';
      const tx = txTexto('B|' + o.txt + '|' + hex + '|' + fg + '|' + rr, Math.round(256 * rr), 256, (x, w, h) => {
        x.fillStyle = hex; x.fillRect(0, 0, w, h); x.fillStyle = fg; x.textAlign = 'center'; x.textBaseline = 'middle';
        let fs = Math.round(h * 0.6); x.font = '900 ' + fs + 'px Inter, sans-serif'; const mw = x.measureText(o.txt).width;
        if (mw > w * 0.84) { fs = Math.floor(fs * w * 0.84 / mw); x.font = '900 ' + fs + 'px Inter, sans-serif'; } x.fillText(o.txt, w / 2, h / 2 + fs * 0.06); });
      if (b.f.map !== tx) { b.f.map = tx; b.f.emissiveMap = tx; b.f.needsUpdate = true; }
      b.f.color.set(0xffffff); b.f.emissive.setRGB(br + 0.12, br + 0.12, br + 0.12);
    } else {
      if (b.f.map) { b.f.map = null; b.f.emissiveMap = null; b.f.needsUpdate = true; }
      b.f.color.copy(c); b.f.emissive.copy(b.m.emissive);
    }
    b.f.opacity = op; b.f.depthWrite = op > 0.99;
    b.o.scale.set(o.w, o.h, o.d); b.o.rotation.set(o.rx || 0, o.ry || 0, o.rz || 0); b.o.position.set(o.x, o.y, o.z);
    return b.o;
  }

  // ——— paneles de texto (planos con lienzo; el texto se pinta una vez por clave) ———
  const geoPl = new T.PlaneGeometry(1, 1);
  const planos = Array.from({ length: 8 }, () => { const m = new T.Mesh(geoPl, new T.MeshBasicMaterial({ transparent: true, side: T.DoubleSide, toneMapped: false, depthWrite: false })); m.visible = false; S.add(m); return m; });
  // Panel genérico: lineas = [[texto, tamaño px, color, peso]…] sobre fondo oscuro con borde de color.
  function pintaPanel(lineas, borde) { return (x, w, h) => {
    x.fillStyle = 'rgba(9,14,27,.93)'; x.beginPath(); x.roundRect(8, 8, w - 16, h - 16, 36); x.fill(); x.strokeStyle = borde; x.lineWidth = 10; x.stroke();
    const tot = lineas.reduce((a, l) => a + l[1] * 1.22, 0); let y = (h - tot) / 2;
    x.textAlign = 'center'; x.textBaseline = 'top';
    for (const [txt, tam, col, peso] of lineas) { x.fillStyle = col; x.font = (peso || 800) + ' ' + tam + 'px ' + (peso === 600 ? 'DejaVu Sans Mono, monospace' : 'Inter, sans-serif'); x.fillText(txt, w / 2, y + tam * 0.1); y += tam * 1.22; }
  }; }
  // o = { clave, lw, lh (px del lienzo), pintar, ancho (m), x, y, z, ry, rx, op, mira: [x,y,z] }
  function plano(i, o) {
    const m = planos[i], op = o.op == null ? 1 : o.op; m.visible = op > 0.01; if (!m.visible) return m;
    const tx = txTexto('P|' + o.clave, o.lw, o.lh, o.pintar); if (m.material.map !== tx) { m.material.map = tx; m.material.needsUpdate = true; }
    m.material.opacity = op; m.scale.set(o.ancho, o.ancho * o.lh / o.lw, 1); m.position.set(o.x, o.y, o.z);
    if (o.mira) { m.rotation.set(0, 0, 0); m.lookAt(o.mira[0], o.mira[1], o.mira[2]); } else m.rotation.set(o.rx || 0, o.ry || 0, o.rz || 0);
    return m;
  }

  // ——— destellos (sprites aditivos) y luces ámbar y roja (siempre en la escena: intensidad 0 cuando no se usan) ———
  const destellos = Array.from({ length: 8 }, () => { const s = new T.Sprite(new T.SpriteMaterial({ map: haloTx, color: 0xffffff, blending: T.AdditiveBlending, depthWrite: false, transparent: true })); s.visible = false; S.add(s); return s; });
  function destello(i, o) { const s = destellos[i], op = o.op || 0; s.visible = op > 0.01; if (!s.visible) return; s.position.set(o.x, o.y, o.z); s.scale.setScalar(o.esc || 1); s.material.opacity = op; s.material.color.copy(W.color(o.color == null ? 0xffffff : o.color)); }
  const luzA = new T.PointLight(0xf5b94a, 0, 7, 1.6); S.add(luzA);
  const luzR = new T.PointLight(0xf87171, 0, 7, 1.6); S.add(luzR);
  function luzAmbar(o) { luzA.position.set(o.x, o.y, o.z); luzA.intensity = o.i || 0; }
  function luzRoja(o) { luzR.position.set(o.x, o.y, o.z); luzR.intensity = o.i || 0; }

  // ——— estantería (baldas grises; la de arriba, en LAY.YB) ———
  const estG = grupo(), mEst = mat(0x5b6b86, { roughness: 0.6 }), mEst2 = mat(0x2f3a50, { roughness: 0.75 });
  pieza(estG, new T.BoxGeometry(3.6, 0.08, 0.72), mEst, 0, LAY.YB - 0.04, 0);
  pieza(estG, new T.BoxGeometry(3.6, 0.08, 0.72), mEst, 0, 0.28, 0);
  [-1.8, 1.8].forEach(x => pieza(estG, new T.BoxGeometry(0.08, 1.7, 0.72), mEst, x, 0.85, 0));
  pieza(estG, new T.BoxGeometry(3.6, 1.7, 0.04), mEst2, 0, 0.85, -0.35);
  pieza(estG, new T.BoxGeometry(3.6, 0.075, 0.02), mat(0xcbd5e1, { emissive: 0xcbd5e1, emissiveIntensity: 0.25 }), 0, LAY.YB - 0.06, 0.37);
  [[-1.2, 0.33], [-0.55, 0.3], [0.4, 0.36], [1.15, 0.31]].forEach(([x, h]) => pieza(estG, new T.BoxGeometry(0.5, h, 0.4), mat(0x8391a8, { roughness: 0.7 }), x, 0.32 + h / 2, 0));
  function estanteria(o) { o = o || {}; estG.visible = true; estG.position.set(o.x || 0, o.vib || 0, o.z || 0); estG.rotation.y = o.ry || 0; }

  // ——— carretera oscura hacia el campo ———
  const carG = grupo();
  pieza(carG, new T.PlaneGeometry(2.4, 15.5), mat(0x080c17, { roughness: 0.95, metalness: 0 }), 0, 0.008, -8.6).rotation.x = -PI / 2;
  const mRaya = new T.MeshBasicMaterial({ color: 0xcbd5e1, toneMapped: false });
  for (let j = 0; j < 11; j++) { const r = pieza(carG, new T.PlaneGeometry(0.11, 0.65), mRaya, 0, 0.012, -1.6 - 1.3 * j); r.rotation.x = -PI / 2; r.castShadow = false; }
  [-1.17, 1.17].forEach(x => { const r = pieza(carG, new T.PlaneGeometry(0.05, 15.5), new T.MeshBasicMaterial({ color: 0x475569 }), x, 0.011, -8.6); r.rotation.x = -PI / 2; r.castShadow = false; });
  function carretera() { carG.visible = true; }

  // ——— tienda (caseta sin marca: toldo gris y mostrador) ———
  const tdaG = grupo();
  pieza(tdaG, new T.BoxGeometry(1.8, 2.0, 1.3), mat(0x6e7d96), 0, 1.0, 0);
  pieza(tdaG, new T.BoxGeometry(1.4, 0.95, 0.02), mat(0x0d1424, { emissive: 0x1e293b, emissiveIntensity: 0.4 }), 0, 1.1, 0.66);
  pieza(tdaG, new T.BoxGeometry(1.85, 0.1, 0.5), mat(0xcbd5e1), 0, 0.98, 0.85);
  const toldo = new T.Group(); toldo.position.set(0, 2.05, 0.75); toldo.rotation.x = 0.38; tdaG.add(toldo);
  for (let j = 0; j < 6; j++) pieza(toldo, new T.BoxGeometry(0.33, 0.05, 0.8), mat(j % 2 ? 0x94a3b8 : 0xe2e8f0), -0.83 + j * 0.333, 0, 0);
  pieza(tdaG, new T.BoxGeometry(1.5, 0.32, 0.06), mat(0x334155), 0, 2.38, 0.5);
  function tienda(o) { tdaG.visible = true; tdaG.position.set(o.x, 0, o.z); tdaG.rotation.y = o.ry || 0; }

  // ——— camión: cabina, caja abierta y 6 ruedas que giran (mira hacia +z) ———
  const camG = grupo(), mCab = mat(0xdfe6ef, { roughness: 0.4 }), mCaj = mat(0x64748b, { roughness: 0.6 }), mNeg = mat(0x151b28, { roughness: 0.8 });
  pieza(camG, new T.BoxGeometry(1.25, 1.1, 1.0), mCab, 0, 1.0, 1.55);
  pieza(camG, new T.BoxGeometry(1.1, 0.42, 0.02), mat(0x1e293b, { emissive: 0x334155, emissiveIntensity: 0.5 }), 0, 1.25, 2.06);
  pieza(camG, new T.BoxGeometry(1.15, 0.2, 3.7), mNeg, 0, 0.5, 0.2);
  pieza(camG, new T.BoxGeometry(1.45, 0.12, 2.5), mCaj, 0, 0.68, -0.3);
  [[0.06, 0.8, 2.5, 0.695, 1.14, -0.3], [0.06, 0.8, 2.5, -0.695, 1.14, -0.3], [1.45, 0.8, 0.06, 0, 1.14, 0.92], [1.45, 0.8, 0.06, 0, 1.14, -1.52]]
    .forEach(([w, h, d, x, y, z]) => pieza(camG, new T.BoxGeometry(w, h, d), mCaj, x, y, z));
  const ruedas = []; const geoRu = new T.CylinderGeometry(0.3, 0.3, 0.22, 20);
  [1.45, -0.45, -1.1].forEach(z => [-0.7, 0.7].forEach(x => { const r = pieza(camG, geoRu, mNeg, x, 0.3, z); r.rotation.z = PI / 2; ruedas.push(r);
    const tapa = pieza(r, new T.BoxGeometry(0.1, 0.24, 0.2), mat(0x94a3b8), 0, 0, 0); tapa.position.y = 0; }));
  function camion(o) { camG.visible = true; camG.position.set(o.x, 0, o.z); camG.rotation.y = o.ry || 0; ruedas.forEach(r => { r.rotation.x = o.rueda || 0; }); }

  // ——— máquina de lavar y embolsar: cuerpo, tolva (la boca), ojo de buey y gotas que caen en la boca ———
  const lavG = grupo();
  pieza(lavG, new T.BoxGeometry(1.6, 1.5, 1.4), mat(0x8794aa, { roughness: 0.5 }), 0, 0.75, 0);
  const tolva = pieza(lavG, new T.CylinderGeometry(0.62, 0.32, 0.5, 4, 1, true), new T.MeshStandardMaterial({ color: 0xa5b1c4, roughness: 0.5, side: T.DoubleSide }), 0, 1.75, 0); tolva.rotation.y = PI / 4;
  pieza(lavG, new T.CircleGeometry(0.33, 32), mat(0x0b1730, { emissive: 0x1d4ed8, emissiveIntensity: 0.25 }), 0, 0.8, 0.705);
  pieza(lavG, new T.TorusGeometry(0.34, 0.04, 10, 36), mat(0xcbd5e1), 0, 0.8, 0.71);
  pieza(lavG, new T.CylinderGeometry(0.05, 0.05, 0.9, 10), mat(0x64748b), 0.35, 2.3, 0);
  pieza(lavG, new T.CylinderGeometry(0.05, 0.05, 0.4, 10), mat(0x64748b), 0.18, 2.72, 0).rotation.z = PI / 2;
  const mGota = new T.MeshStandardMaterial({ color: 0xbfe3ff, emissive: 0x7dd3fc, emissiveIntensity: 0.6, roughness: 0.2 });
  const gotas = Array.from({ length: 9 }, (_, j) => pieza(lavG, new T.SphereGeometry(0.045, 8, 6), mGota, 0, 2.5, 0));
  function lavadora(o) { lavG.visible = true; lavG.position.set(o.x, 0, o.z); lavG.rotation.y = o.ry || 0;
    gotas.forEach((g, j) => { const f = ((o.t || 0) * 1.6 + j / gotas.length) % 1; g.position.set(0.02 + 0.12 * Math.sin(j * 2.3), 2.55 - 0.95 * f * f, 0.1 * Math.cos(j * 1.7)); g.scale.setScalar(1 - 0.4 * f); }); }

  // ——— cinta clasificadora (a lo largo de x): banda oscura con listones que avanzan, barandas, patas y separador de dos carriles ———
  const cinG = grupo(), LC = 3.4;
  pieza(cinG, new T.BoxGeometry(LC, 0.1, 0.8), mat(0x1b2438, { roughness: 0.7 }), 0, 0.85, 0);
  [-0.43, 0.43].forEach(z => pieza(cinG, new T.BoxGeometry(LC, 0.12, 0.05), mat(0x64748b), 0, 0.94, z));
  [[-1.55, -0.33], [-1.55, 0.33], [1.55, -0.33], [1.55, 0.33]].forEach(([x, z]) => pieza(cinG, new T.BoxGeometry(0.08, 0.8, 0.08), mat(0x334155), x, 0.4, z));
  [-LC / 2, LC / 2].forEach(x => { const r = pieza(cinG, new T.CylinderGeometry(0.08, 0.08, 0.86, 14), mat(0x94a3b8), x, 0.85, 0); r.rotation.x = PI / 2; });
  pieza(cinG, new T.BoxGeometry(1.2, 0.12, 0.04), mat(0xcbd5e1), -1.1, 0.96, 0);
  const listones = Array.from({ length: 14 }, () => pieza(cinG, new T.BoxGeometry(0.05, 0.014, 0.76), mat(0x3b4a66), 0, 0.905, 0));
  function cinta(o) { cinG.visible = true; cinG.position.set(o.x, 0, o.z); cinG.rotation.y = o.ry || 0;
    listones.forEach((l, j) => { l.position.x = LC / 2 - (((j / listones.length) * LC + (o.t || 0) * 0.9) % LC); }); }

  // ——— campo: surcos (cajas bajas alargadas) y cajas de madera con patatas ———
  const campoG = grupo(), mSur = mat(0x3d2b1c, { roughness: 0.95, metalness: 0 }), mMad = mat(0x8a6a43, { roughness: 0.8, metalness: 0 });
  for (let j = 0; j < 7; j++) pieza(campoG, new T.BoxGeometry(10, 0.26, 0.5), mSur, 0, 0.13, -1.2 - 0.95 * j);
  [[1.9, -0.25], [-0.9, -0.45], [2.75, -0.55]].forEach(([x, z], j) => { pieza(campoG, new T.BoxGeometry(0.75, 0.42, 0.5), mMad, x, 0.21, z);
    for (let p = 0; p < 3; p++) patata(campoG, x - 0.22 + p * 0.22, 0.48, z + 0.04 * (p % 2 ? 1 : -1), j + p); });
  function campo(o) { campoG.visible = true; campoG.position.set(o.x, 0, o.z); }

  // ——— cubo de merma (rojo, abierto) ———
  const cuboG = grupo(), mCubo = new T.MeshStandardMaterial({ color: 0xef4444, emissive: 0xef4444, emissiveIntensity: 0.35, roughness: 0.5, side: T.DoubleSide });
  pieza(cuboG, new T.CylinderGeometry(0.42, 0.34, 0.62, 28, 1, true), mCubo, 0, 0.31, 0);
  pieza(cuboG, new T.CircleGeometry(0.34, 28), mCubo, 0, 0.02, 0).rotation.x = -PI / 2;
  pieza(cuboG, new T.TorusGeometry(0.42, 0.03, 8, 30), mCubo, 0, 0.62, 0).rotation.x = PI / 2;
  function cubo(o) { cuboG.visible = true; cuboG.position.set(o.x, 0, o.z); }

  // ——— losas de 1 € (cilindros gruesos): la de abajo se llena de ámbar (65 % = COAG) y lleva la raya del 91 % (Ministerio) ———
  const losG = grupo(), RL = 0.62, HL = 0.3, geoL = new T.CylinderGeometry(RL, RL, HL, 44);
  const losas = Array.from({ length: 4 }, () => { const m = mat(0xcbd5e1, { roughness: 0.35, metalness: 0.25 }); const o = new T.Mesh(geoL, m); o.castShadow = true; o.receiveShadow = true; losG.add(o); return { o, m }; });
  const geoR = new T.CylinderGeometry(RL + 0.012, RL + 0.012, 1, 44);
  const mRA = mat(AMBH, { emissive: AMBH, emissiveIntensity: 0.35 }), mRR = mat(ROJOH, { emissive: ROJOH, emissiveIntensity: 0.35 });
  const rellA = new T.Mesh(geoR, mRA), rellR = new T.Mesh(geoR, mRR); losG.add(rellA); losG.add(rellR);
  // Raya del Ministerio (91 %): gruesa y encendida para que se distinga del relleno de COAG (65 %).
  const raya = new T.Mesh(new T.TorusGeometry(RL + 0.035, 0.03, 10, 64), mat(0xffd27a, { emissive: 0xffc35a, emissiveIntensity: 1.4 })); losG.add(raya);
  const ROJO_C = new T.Color(ROJOH), GRIS_L = new T.Color(0xcbd5e1);
  // o = { x, z, pos: [[dx, dy, dz, rx, rz] × 4] respecto a su sitio en la torre, roja: [0..1 × 4], relleno: 0..1 (del 65 %),
  //       rojaArriba: 0..1 (el 35 % de arriba de la losa de abajo), raya: 0..1, brillo (de lo rojo) }  → devuelve el sitio de cada losa
  function losasF(o) {
    losG.visible = true; losG.position.set(o.x || 0, 0, o.z || 0);
    const br = o.brillo == null ? 0.3 : o.brillo, sitios = [];
    losas.forEach((l, j) => { const p = (o.pos && o.pos[j]) || [0, 0, 0, 0, 0], y = HL / 2 + j * (HL + 0.02);
      l.o.position.set(p[0], y + p[1], p[2]); l.o.rotation.set(p[3] || 0, 0, p[4] || 0);
      const r = (o.roja && o.roja[j]) || 0; l.m.color.copy(GRIS_L).lerp(ROJO_C, r); l.m.emissive.copy(ROJO_C).multiplyScalar(br * r); sitios.push([p[0], y + p[1], p[2]]); });
    const b = losas[0].o.position, rel = o.relleno || 0, ra = o.rojaArriba || 0;
    rellA.visible = rel > 0.005; rellA.scale.y = Math.max(0.001, HL * 0.65 * rel); rellA.position.set(b.x, b.y - HL / 2 + HL * 0.65 * rel / 2, b.z);
    rellR.visible = ra > 0.005; rellR.scale.set(1, HL * 0.35, 1); rellR.position.set(b.x, b.y - HL / 2 + HL * 0.65 + HL * 0.175, b.z);
    mRR.opacity = 1; mRR.color.copy(GRIS_L).lerp(ROJO_C, ra); mRR.emissive.copy(ROJO_C).multiplyScalar(br * ra);
    raya.visible = (o.raya || 0) > 0.01; raya.scale.setScalar(Math.max(0.001, o.raya || 0)); raya.position.set(b.x, b.y - HL / 2 + HL * 0.91, b.z); raya.rotation.x = PI / 2;
    return { sitios, HL, RL };
  }

  // ——— cinta de fechas corta y fija delante de las columnas (abril → octubre de 2026), inclinada hacia la cámara, con un punto
  //     ámbar que recorre los meses: o.mes = 0 (abril) … 6 (octubre). Cabe entera en el cuadro y queda por encima de los rótulos 2D.
  const fechaG = grupo(), PFW = 1.6, PFH = 0.234, FT = -PI / 2 + 0.45, FX0 = 150 / 2048, FY0 = 0.74;
  const fTx = lienzo(2048, 300, (x, w, h) => {
    x.fillStyle = 'rgba(9,14,27,.92)'; x.beginPath(); x.roundRect(4, 4, w - 8, h - 8, 40); x.fill();
    const y0 = h * FY0, xa = w * FX0, xb = w - w * FX0;
    x.strokeStyle = '#64748b'; x.lineWidth = 10; x.beginPath(); x.moveTo(xa, y0); x.lineTo(xb, y0); x.stroke();
    for (let i = 0; i < 7; i++) { const cx = xa + (xb - xa) * i / 6, k = i === 0 || i === 6; x.fillStyle = k ? '#f5b94a' : '#94a3b8'; x.beginPath(); x.arc(cx, y0, k ? 22 : 12, 0, 2 * PI); x.fill(); }
    x.fillStyle = '#f5b94a'; x.font = '900 112px Inter, sans-serif'; x.textBaseline = 'middle';
    x.textAlign = 'left'; x.fillText('ABR 2026', 56, h * 0.33); x.textAlign = 'right'; x.fillText('OCT 2026', w - 56, h * 0.33);
    x.fillStyle = '#94a3b8'; x.textAlign = 'center'; x.font = '800 100px Inter, sans-serif'; x.fillText('→', w / 2, h * 0.33); }).tx;
  const fPl = new T.Mesh(new T.PlaneGeometry(PFW, PFH), new T.MeshBasicMaterial({ map: fTx, transparent: true, depthWrite: false, toneMapped: false })); fPl.rotation.x = FT; fechaG.add(fPl);
  function fechas(o) {
    fechaG.visible = true; fechaG.position.set(o.x, 0.07, o.z);
    const u = Math.max(0, Math.min(1, (o.mes || 0) / 6)), lx = (FX0 + (1 - 2 * FX0) * u - 0.5) * PFW, ly = (0.5 - FY0) * PFH;
    const nx = 0, ny = -Math.sin(FT), nz = Math.cos(FT), px = o.x + lx, py = 0.07 + ly * Math.cos(FT) + ny * 0.012, pz = o.z + ly * Math.sin(FT) + nz * 0.012;
    bloque(43, { x: px + nx, y: py, z: pz, w: 0.07, h: 0.02, d: 0.07, rx: FT + PI / 2, color: 0xffd27a, brillo: 1.2 });
    destello(7, { x: px, y: py + 0.03, z: pz + 0.05, esc: 0.3, op: 0.5, color: 0xffc35a });
  }

  function apagar() {
    objs.forEach(g => { g.visible = false; }); [bloques.map(b => b.o), planos, destellos, sueltas].forEach(a => a.forEach(m => { m.visible = false; }));
    luzA.intensity = 0; luzR.intensity = 0;
  }
  return { malla, bloque, plano, pintaPanel, destello, luzAmbar, luzRoja, estanteria, carretera, tienda, camion, lavadora, cinta, campo, cubo, suelta, losas: losasF, fechas, apagar };
})();
W3.X = X3;

// ——— brazos y manos de un maniquí (de extenso-loteria-es.js). qa: 0 = como los pone andar(), 1 = pose; qp: 0 = brazos arriba, 1 = sujetar al pecho ———
function brazos(a, qa, qp) {
  const ax = -2.75 * (1 - qp) - 0.95 * qp, az = -0.1 * (1 - qp) - 0.2 * qp, cx = -0.15 * (1 - qp) - 1.15 * qp;
  [[a.izq, -1], [a.der, 1]].forEach(([b, sg]) => {
    b.hombro.rotation.x = lerp(b.hombro.rotation.x, ax, qa); b.hombro.rotation.z = lerp(b.hombro.rotation.z, sg * az, qa); b.codo.rotation.x = lerp(b.codo.rotation.x, cx, qa);
  });
}
function manos(hx, hz, g, qp, esc, y) { const ly = (2.2 * (1 - qp) + 1.5 * qp) * (esc || 1.06) / 1.06, lz = (0.3 * (1 - qp) + 0.62 * qp) * (esc || 1.06) / 1.06; return [hx + Math.sin(g) * lz, ly + (y || 0), hz + Math.cos(g) * lz]; }
// El agricultor: W.heroe sin luz (la luz de W.heroe lo vuelve turquesa) y más blanco; su brillo ámbar lo ponen luzAmbar y un halo.
function agricultor(W, o) { W.heroe(Object.assign({ luz: 0 }, o)); W.H.mat.color.set(0xe6ebf2); W.H.mat.emissive.set(0x000000); }

// ——— etiqueta-columna: trozo ámbar abajo y encima los trozos rojos (alturas proporcionales a los importes) ———
// Trozo j de la columna del gancho: 0 = ámbar (0,28) y 1..4 = rojos (clasificar, lavar y embolsar, camión, tienda).
const VAL_G = [PR.O, PR.TROZOS[0], PR.TROZOS[1], PR.TROZOS[2], PR.TROZOS[3]];
const Y_G = VAL_G.map((v, j) => VAL_G.slice(0, j).reduce((a, b) => a + b, 0) * KC);   // base de cada trozo (m desde la base)
// Paradas de los trozos rojos (de cerca a lejos: tienda, camión, lavar y embolsar, cinta) y cuándo llegan.
const DEST_G = { 1: [LAY.CIN[0] + 0.25, 1.02, LAY.CIN[1], 1.45], 2: [LAY.LAV[0], 1.95, LAY.LAV[1], 1.3], 3: [LAY.CAM[0], 1.25, LAY.CAM[1] - 0.3, 1.15], 4: [LAY.TIE[0] - 0.1, 1.15, LAY.TIE[1] + 0.85, 1.0] };
const G0 = { TC: 0.5, TD: 0.65 };

// La columna del gancho en un instante: base (bx, by, bz), latigazo rx (gira sobre la base), escala e. Entre trozo y trozo, una
// rendija de 2 cm (las bases siguen a escala) para que se vean los 4 trozos rojos.
function columnaGancho(X, tau, bx, by, bz, rx, e, iBase, brilloA) {
  for (let j = 0; j < 5; j++) {
    if (j > 0 && tau >= G0.TD) continue;
    const h = Math.max(0.01, VAL_G[j] * KC - 0.02) * e, yc = Y_G[j] * e + h / 2;
    X.bloque(iBase + j, { x: bx, y: by + yc * Math.cos(rx), z: bz + yc * Math.sin(rx), w: LAY.CW * e, h, d: LAY.CD * e, rx,
      color: j === 0 ? AMBH : ROJOH, brillo: j === 0 ? (brilloA == null ? 0.25 : brilloA) : 0.32, txt: j === 0 ? '0,28 €' : null });
  }
  return by + (Y_G[4] + VAL_G[4] * KC) * e;
}
// Trozo rojo j en vuelo con estela de 3 copias; al llegar a su parada, destello y la parada se lo traga (encoge en 0,25 s).
function trozoVuela(X, tau, j, P0, iB) {
  const d = DEST_G[j], A = d[3], h = Math.max(0.01, VAL_G[j] * KC - 0.02);
  const pos = (x) => { const u = Math.min(1, Math.max(0, (x - G0.TD) / (A - G0.TD))), p = mezcla(P0, [d[0], d[1], d[2]], u); p[1] += (0.9 + 0.25 * j) * 4 * u * (1 - u); return [p, u]; };
  const [p, u] = pos(tau);
  const giro = (Math.min(tau, A) - G0.TD) * (7 + j), traga = 1 - tramo(tau, A + 0.05, A + 0.3);
  X.bloque(iB, { x: p[0], y: p[1], z: p[2], w: LAY.CW * traga, h: h * traga, d: LAY.CD * traga, rx: giro, ry: giro * 0.6, color: ROJOH, brillo: 0.45 });
  if (u < 1) for (let k = 1; k <= 3; k++) { const [q] = pos(tau - k * 0.035); X.bloque(iB + k, { x: q[0], y: q[1], z: q[2], w: LAY.CW * (1 - 0.12 * k), h: h * (1 - 0.12 * k), d: LAY.CD, rx: giro - k * 0.2, ry: (giro - k * 0.2) * 0.6, color: ROJOH, brillo: 0.8, op: 0.42 - 0.12 * k }); }
  return { p, llega: tau - A };
}
// Pegatina «1,73 €» en la cara de delante de la malla (precio de la bolsa de 1 kg).
const PEGA = { clave: 'pega173', lw: 512, lh: 300, pintar: (x, w, h) => {
  x.fillStyle = '#f8fafc'; x.beginPath(); x.roundRect(6, 6, w - 12, h - 12, 30); x.fill(); x.strokeStyle = '#94a3b8'; x.lineWidth = 8; x.stroke();
  x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = '#64748b'; x.font = '700 40px DejaVu Sans Mono, monospace'; x.fillText('PATATAS · 1 KG', w / 2, 64);
  x.fillStyle = '#0f172a'; x.font = '900 150px Inter, sans-serif'; x.fillText('1,73 €', w / 2, 185); } };

// ——— el gancho (escena 0). tau = tiempo de la escena 0 (negativo en la cola: la malla viene de más arriba) ———
function gancho(W, X, tau, m0v, m1v) {
  const m0 = Math.max(m0v, 3.05), m1 = Math.max(m1v, m0 + 0.4), cam = (C) => W.camara(C[0], C[1], C[2], C[3], C[4], C[5]);
  const YB = LAY.YB, BZ = 0.02;
  X.estanteria({ vib: tau > G0.TC && tau < G0.TC + 0.4 ? 0.025 * Math.exp(-(tau - G0.TC) * 12) * Math.sin((tau - G0.TC) * 70) : 0 });
  X.carretera();
  X.tienda({ x: LAY.TIE[0], z: LAY.TIE[1], ry: -PI / 2 + 0.35 });
  X.camion({ x: LAY.CAM[0], z: LAY.CAM[1], ry: 0.25, rueda: Math.max(0, tau - 2.0) * 6 });
  X.lavadora({ x: LAY.LAV[0], z: LAY.LAV[1], ry: -0.5, t: tau });
  X.cinta({ x: LAY.CIN[0], z: LAY.CIN[1], t: Math.max(0, tau) });
  X.campo({ x: 0, z: LAY.AGR[1] });
  // Caída: la malla cae a plomo girando, choca con la balda en TC, se aplasta un 8 % y rebota.
  const dt = G0.TC - tau;
  let dy = dt > 0 ? 1.5 * dt + 3.4 * dt * dt : 0, sy = 1, rz = dt > 0 ? 0.55 * dt : 0, ry = dt > 0 ? 1.5 * dt : 0;
  if (dt <= 0) { const u = tramo(tau, G0.TC, G0.TC + 0.12); sy = 1 - 0.08 * Math.sin(PI * u); dy = 0.09 * Math.sin(PI * tramo(tau, G0.TC + 0.1, G0.TC + 0.32)); }
  const bolsaY = YB + 0.45 * sy + dy;
  X.malla(0, { x: LAY.BX, y: bolsaY, z: BZ, rz, ry, sy });
  X.plano(0, Object.assign({ ancho: 0.56, x: LAY.BX + Math.sin(ry) * 0.235, y: bolsaY - 0.1, z: BZ + Math.cos(ry) * 0.235, ry, rz }, PEGA));
  // Latigazo de la etiqueta tras el choque.
  const dC = tau - G0.TC, rx = dC > 0 ? -0.32 * Math.exp(-dC * 7) * Math.sin(dC * 24) : 0;
  columnaGancho(X, tau, LAY.CX, YB + dy, BZ + 0.02, rx, 1, 0, tau >= G0.TD ? 0.25 + 0.5 * sale(tramo(tau, G0.TD, G0.TD + 0.2)) : 0.25);
  // Los 4 trozos rojos salen disparados hacia el fondo en abanico y cada parada atrapa el suyo (con destello rojo).
  if (tau >= G0.TD) {
    let ultimo = null;
    const fp = Math.exp(-(tau - G0.TD) * 9);   // fogonazo del despegue
    X.destello(4, { x: LAY.CX, y: YB + 0.75, z: BZ + 0.2, esc: 2.4, op: 0.8 * fp, color: 0xff8a8a });
    for (let j = 1; j <= 4; j++) {
      const P0 = [LAY.CX, YB + (Y_G[j] + VAL_G[j] * KC / 2), BZ + 0.02];
      const r = trozoVuela(X, tau, j, P0, 5 + (j - 1) * 4);
      if (r.llega > -0.02) { const f = Math.exp(-Math.max(0, r.llega) * 5); X.destello(j - 1, { x: r.p[0], y: r.p[1], z: r.p[2], esc: 4.2 * f + 0.8, op: 0.95 * f, color: 0xff6b6b }); if (f > 0.05) ultimo = [r.p, f]; }
    }
    if (ultimo) X.luzRoja({ x: ultimo[0][0], y: ultimo[0][1] + 0.6, z: ultimo[0][2] + 0.8, i: 6 * ultimo[1] });
    // El trozo ámbar se queda en la balda y se enciende.
    const fa = sale(tramo(tau, G0.TD, G0.TD + 0.2));
    if (tau < 1.4) { X.destello(5, { x: LAY.CX, y: YB + 0.12, z: BZ + 0.15, esc: 1.6, op: 0.6 * fa, color: 0xffc35a }); X.luzAmbar({ x: LAY.CX, y: YB + 0.8, z: BZ + 0.9, i: 3.5 * fa }); }
  }
  // El agricultor en el campo: recibe su trozo ámbar «0,28 €» (llega rodando por la carretera) y lanza la patata a la cinta.
  const AX = LAY.AGR[0], AZ = LAY.AGR[1], gCin = Math.atan2(LAY.CIN[0] + 0.6 - AX, LAY.CIN[1] - AZ);
  const enPlano = tau >= m0 - 0.1;   // primer plano del agricultor (corte en «Al agricultor»)
  let g = 0, qa = 0, qp = 1;
  if (!enPlano) {
    g = angulo(0, gCin, suave(tramo(tau, 1.98, 2.18)));
    qa = suave(tramo(tau, 1.7, 1.86)); qp = tau < 2.15 ? 1 : 1 - 0.5 * suave(tramo(tau, 2.15, 2.3));
  } else { g = 0.15; qa = 1; qp = 1; }
  agricultor(W, { x: AX, z: AZ, gira: g });
  brazos(W.H, qa, qp);
  const MA = manos(AX, AZ, g, qp, 1.06, 0);
  if (tau > 1.4 || enPlano) { const i = enPlano ? 1.6 : 3 * sale(tramo(tau, 1.5, 1.8)); X.luzAmbar({ x: AX + 0.4, y: 2.6, z: AZ + 1.4, i }); X.destello(6, { x: AX, y: 1.2, z: AZ - 0.2, esc: 3.2, op: 0.18 * Math.min(1, i / 3), color: 0xffc35a }); }
  // trozo ámbar del agricultor
  const WA = LAY.CW, HA = PR.O * KC;
  if (enPlano) {
    const pop = 1 + 0.1 * rebote(tramo(tau, m1, m1 + 0.35)), br = 0.18 + 0.3 * sale(tramo(tau, m1, m1 + 0.25));
    X.bloque(25, { x: MA[0], y: MA[1] + 0.04, z: MA[2], w: WA * 1.05 * pop, h: HA * 1.05 * pop, d: LAY.CD, ry: g, rx: -0.12, color: AMBH, brillo: br, txt: '0,28 €' });
    X.destello(7, { x: MA[0], y: MA[1] + 0.05, z: MA[2] + 0.1, esc: 0.9 + 0.5 * sale(tramo(tau, m1, m1 + 0.3)), op: 0.08 + 0.22 * sale(tramo(tau, m1, m1 + 0.3)), color: 0xffc35a });
  } else if (tau > 1.42 && tau < 2.3) {
    let p, rxA = 0;
    if (tau < 1.8) { const u = tramo(tau, 1.42, 1.8); p = [AX - 0.25 + 0.15 * u, HA / 2, -12.6 + (AZ + 0.55 + 12.6) * (1 - Math.pow(1 - u, 1.4))]; rxA = -u * 9; p[1] += Math.abs(Math.sin(u * 9)) * 0.08; }
    else if (tau < 1.95) { const u = suave(tramo(tau, 1.8, 1.95)), P0 = [AX - 0.1, HA / 2, AZ + 0.55]; p = mezcla(P0, MA, u); p[1] += 0.35 * Math.sin(u * PI); rxA = -9 * (1 - u); }
    else p = MA;
    if (tau < 2.22) X.bloque(25, { x: p[0], y: p[1], z: p[2], w: WA, h: HA, d: LAY.CD, rx: rxA, ry: g, color: AMBH, brillo: 0.35, txt: '0,28 €' });
  }
  // La patata (con su etiqueta: el trozo ámbar en pequeño) vuela a la cinta y su etiqueta gana el primer trozo rojo.
  if (!enPlano && tau > 2.2) {
    const PC = [LAY.CIN[0] + 0.6, 0.98, LAY.CIN[1]], u = tramo(tau, 2.2, 2.52);
    let pp;
    if (u < 1) { pp = mezcla(MA, PC, u); pp[1] += 0.9 * Math.sin(u * PI); }
    else pp = [PC[0] - (tau - 2.52) * 0.9, PC[1], PC[2]];
    X.suelta(0, { x: pp[0], y: pp[1], z: pp[2], rx: tau * 5 * (u < 1 ? 1 : 0), esc: 1.25 });
    const ew = 0.3, ha = PR.O * 0.5, hr = PR.TROZOS[0] * 0.5 * sale(tramo(tau, 2.58, 2.78));
    const ex = pp[0], ey = pp[1] + 0.2, ez = pp[2] - 0.02;
    X.bloque(26, { x: ex, y: ey + ha / 2, z: ez, w: ew, h: ha, d: 0.08, ry: PI, color: AMBH, brillo: 0.35, txt: '0,28' });
    if (hr > 0.002) X.bloque(27, { x: ex, y: ey + ha + 0.012 + hr / 2, z: ez, w: ew, h: hr, d: 0.08, ry: PI, color: ROJOH, brillo: 0.5 });
    if (tau > 2.58) X.destello(4, { x: ex, y: ey + ha + 0.05, z: ez - 0.05, esc: 1.2, op: 0.7 * Math.exp(-(tau - 2.58) * 5), color: 0xff6b6b });
  }
  // ——— cámara ———
  const CEN = -0.1;
  let C;
  if (tau < G0.TC) {
    // Contrapicado que persigue la caída sin alcanzarla (la malla baja en el cuadro) con dolly-in y un arco lateral.
    const u = tramo(tau, -0.7, G0.TC), sig = 0.8 + 0.2 * Math.min(1, Math.max(0, -tau / 0.55)), L = [CEN, YB + 0.62 + sig * dy, BZ], dd = 4.15 - 0.65 * u, a = 0.42 - 0.3 * u;
    C = [L[0] + Math.sin(a) * dd, L[1] - 0.5 - 0.15 * u, L[2] + Math.cos(a) * dd, L[0], L[1], L[2]];
  } else if (tau < 0.86) {
    const a = 0.12, A0 = [CEN + Math.sin(a) * 3.5, YB + 0.62 - 0.65, BZ + Math.cos(a) * 3.5, CEN, YB + 0.62, BZ];
    const A1 = [CEN + 0.55, YB + 0.15, BZ + 3.4, CEN + 0.1, YB + 0.62, BZ];
    const A2 = [0.6, 2.35, 4.3, 0.05, 1.7, -1.6];
    C = tau < G0.TD ? mezcla(A0, A1, suave(tramo(tau, G0.TC, G0.TD))) : mezcla(A1, A2, sale(tramo(tau, G0.TD, 0.86)));
    const sh = 0.07 * Math.exp(-Math.max(0, dC) * 9); C = [C[0] + sh * Math.sin(tau * 83), C[1] + sh * Math.cos(tau * 71), C[2], C[3], C[4], C[5]];
  } else if (tau < 2.0) {
    C = ruta([[0.86, [0.6, 2.35, 4.3, 0.05, 1.7, -1.6]], [1.05, [0.7, 2.6, 0.9, 0.9, 1.2, -6.5]],
      [1.3, [0.0, 2.7, -4.6, -0.3, 1.2, -12.5]], [1.55, [1.1, 2.3, -10.9, 0.3, 1.25, -16.8]], [2.0, [2.35, 1.65, -13.6, AX - 0.1, 1.3, AZ]]], tau);
  } else if (tau < 2.52) {
    C = ruta([[2.0, [2.35, 1.65, -13.6, AX - 0.1, 1.3, AZ]], [2.25, orbita([AX, 2.1, AZ + 4.0, AX - 0.6, 1.1, AZ + 0.3], 1.25)],
      [2.52, [AX + 2.0, 2.8, AZ - 3.3, LAY.CIN[0] + 0.5, 0.92, LAY.CIN[1]]]], tau);
  } else if (!enPlano) {
    const px = LAY.CIN[0] + 0.6 - (tau - 2.52) * 0.9, u = tramo(tau, 2.52, m0);
    C = mezcla([AX + 2.0, 2.8, AZ - 3.3, LAY.CIN[0] + 0.5, 0.92, LAY.CIN[1]], [px + 0.75, 1.5, LAY.CIN[1] - 1.85, px - 0.05, 1.05, LAY.CIN[1]], sale(tramo(tau, 2.52, 2.85)));
    C[0] -= 0.15 * u;
  } else {
    const u = suave(tramo(tau, m0 - 0.1, m1 + 1.6)), a = -0.55 + 1.05 * u, r = 2.6 - 0.25 * u;
    C = orbita([AX + Math.sin(g) * 0.2, 1.68, AZ + r, AX + Math.sin(g) * 0.3, 1.55, AZ + 0.3], a);
  }
  cam(C);
}

// ——— escenas 1–8 ———
const AMB = '#f5b94a', ROJO = '#f87171', BLANCO = '#e2e8f0', TURQ = '#5eead4';
// Rótulo 3D que se pinta siempre por delante (sin prueba de profundidad): ninguna pieza lo tapa aunque la cámara gire.
function rotuloEncima(W, clave, texto, x, y, z, op, css, alto) {
  W.rotulo(clave, texto, x, y, z, op, css, alto);
  for (const o of W.S.children) if (o.isSprite && o.position.x === x && o.position.y === y && o.position.z === z) { o.material.depthTest = false; o.renderOrder = 20; }
}
function rotuloLado(W, clave, texto, x, y, z, lado, op, css, alto) { alto = alto || 0.4; const w = W.anchoRotulo(texto) * alto / 0.352; W.rotulo(clave, texto, x + lado * w / 2, y, z, op, css, alto); }
const eur = (v) => v.toFixed(2).replace('.', ',') + ' €';
// Columna de trozos apilados. o = { x, y, z, vals, cols, q (crecido de cada trozo, 0..1), kc, w, d, ry, txt, br, gap, wig, t } → altura de arriba
function columna(X, iB, o) {
  let y = o.y || 0; const gap = o.gap == null ? 0.02 : o.gap;
  o.vals.forEach((v, j) => {
    const q = o.q ? o.q[j] : 1; if (q <= 0.001) return;
    const h = Math.max(0.004, v * o.kc - gap) * q, wg = o.wig ? o.wig * Math.sin((o.t || 0) * 13 + j * 2.1) : 0;
    X.bloque(iB + j, { x: o.x + wg * 0.025, y: y + h / 2 + Math.abs(wg) * 0.01, z: o.z, w: o.w, h, d: o.d, ry: (o.ry || 0) + wg * 0.07, color: o.cols[j], brillo: o.br ? o.br[j] : 0.3, txt: o.txt ? o.txt[j] : null });
    y += v * o.kc * q;
  });
  return y;
}
// Los 1,38 € del viaje repartidos con la estructura del Ministerio (clasificar, lavar y embolsar, camión, tienda).
const VJ = PR.TROZOS.map(v => v * PR.VIAJE / PR.TROZOS.reduce((a, b) => a + b, 0));

// 1 · «Es la media de octubre, según COAG. El Ministerio da más: 39 céntimos.»
function escena1(W, X, s, e, mk) {
  const D = e.fin - e.ini, m0 = mk(0, 2.2), m1 = mk(1, 3.2), q = (a, d) => sale(tramo(s, a, a + (d || 0.45)));
  const AX = LAY.AGR[0], AZ = LAY.AGR[1], K1 = 1.7, BZ = AZ + 2.4, B1 = AX - 0.5, B2 = AX + 0.42, h1 = PR.O * K1, h2 = PR.M * K1;
  X.campo({ x: 0, z: AZ });
  agricultor(W, { x: AX + 0.1, z: AZ - 0.9, gira: PI + 0.2 });
  X.luzAmbar({ x: AX - 0.1, y: 2.0, z: BZ + 1.3, i: 2.0 });
  const ent = sale(tramo(s, 0, 0.6));
  X.bloque(0, { x: B1, y: h1 / 2 + 1.3 * Math.pow(1 - ent, 2), z: BZ, w: 0.5, h: h1, d: 0.24, ry: 0.9 * (1 - ent), color: AMBH, brillo: 0.3, txt: '0,28 €' });
  const cae = tramo(s, m0, m0 + 0.32), bote = s > m0 + 0.32 ? 0.06 * Math.sin(PI * tramo(s, m0 + 0.32, m0 + 0.5)) : 0;
  if (s > m0 - 0.02) X.bloque(1, { x: B2, y: h2 / 2 + 3.2 * (1 - cae * cae) + bote, z: BZ, w: 0.5, h: h2, d: 0.24, color: AMBH, brillo: 0.3 + 0.25 * q(m1, 0.2), txt: '0,39 €' });
  if (cae >= 1) X.destello(0, { x: B2, y: 0.1, z: BZ + 0.2, esc: 2.5, op: 0.6 * Math.exp(-(s - m0 - 0.32) * 5), color: 0xffc35a });
  W.rotulo('coag1', 'COAG', B1, h1 + 0.25, BZ, q(0.3, 0.3), AMB, 0.24);
  W.rotulo('mapa1', 'MINISTERIO', B2, h2 + 0.25, BZ, q(m0 + 0.35, 0.3), AMB, 0.24);
  const L = [AX - 0.04, 0.62, BZ - 0.2];
  let C;
  if (s < m0) C = mezcla([AX - 2.2, 0.95, BZ + 3.9, L[0] - 0.7, L[1], L[2]], [AX - 0.55, 1.0, BZ + 3.8, L[0], L[1], L[2]], suave(s / m0));
  else { const u = sale(tramo(s, m0, D + 0.3)); C = orbita(mezcla([AX - 0.55, 1.0, BZ + 3.8, L[0], L[1], L[2]], [AX - 0.3, 2.1, BZ + 3.9, L[0], 0.42, L[2]], u), 0.5 * u); }
  W.camara(...C);
}

// 2 · «Con cualquiera de las dos, de cada 4 euros en patatas, la patata no llega a 1. ¿En qué se va el resto?»
function escena2(W, X, s, e, mk) {
  const D = e.fin - e.ini, m0 = mk(0, 1.4), m1 = mk(1, 3.0), m2 = mk(2, 4.6), q = (a, d) => sale(tramo(s, a, a + (d || 0.45)));
  if (s < m2) {
    const pos = [0, 1, 2, 3].map(j => { const tj = 0.05 + 0.2 * j, u = tramo(s, tj, tj + 0.3), b = u >= 1 ? 0.05 * Math.sin(PI * tramo(s, tj + 0.3, tj + 0.46)) : 0; return [0, 3.4 * (1 - u * u) + b, 0, (1 - u) * 1.1, (1 - u) * 0.4]; });
    const roja = q(m1 + 0.12, 0.4);
    const L = X.losas({ x: 0, z: 0, pos, roja: [0, roja, roja, roja], relleno: q(m1, 0.45), rojaArriba: roja, raya: q(m1 + 0.3, 0.25), brillo: 0.3 });
    rotuloEncima(W, 'cuatro', '4 × 1 €', 0, 0.62, 0.78, q(0.95, 0.3) * (1 - q(m1, 0.2)), BLANCO, 0.3);
    // COAG a la altura del relleno ámbar (65 %) y MINISTERIO junto a la raya (91 %): por delante de las losas y sin fundidos largos.
    rotuloEncima(W, 'coag65', 'COAG', -0.3, 0.12, 0.8, q(m1 + 0.25, 0.18), AMB, 0.14);
    rotuloEncima(W, 'mapa91', 'MINISTERIO', 0.24, 0.355, 0.8, q(m1 + 0.4, 0.18), AMB, 0.14);
    const u = suave(tramo(s, 0, m2)), a = -0.55 + 1.0 * u;
    W.camara(...orbita([0, 0.75 + 0.75 * u, 4.6 - 0.5 * u, 0, 0.42, 0], a));
  } else {
    // La pregunta: las 3 losas rojas flotan y giran sobre un maniquí comprador, que levanta la vista; dolly-out rápido.
    const HX = 0.0, HZ = 1.3, u = tramo(s, m2, D), fl = sale(tramo(s, m2, m2 + 0.5));
    const pos = [[0, 0, 0, 0, 0], [-0.95 * fl, 2.15 * fl + 0.06 * Math.sin(s * 2.1), 0.35 * fl, 0.5 * Math.sin(s * 0.9) * fl, 0.3 * fl],
      [0.15 * fl, 2.45 * fl - 0.32 + 0.06 * Math.sin(s * 1.7 + 1), 0.15 * fl, 0.6 * fl, -0.5 * Math.sin(s * 0.8) * fl], [1.0 * fl, 2.05 * fl - 0.64 + 0.06 * Math.sin(s * 2.4 + 2), 0.4 * fl, -0.4 * fl, 0.6 * Math.sin(s * 1.1) * fl]];
    X.losas({ x: 0, z: 0, pos, roja: [0, 1, 1, 1], relleno: 1, rojaArriba: 1, raya: 1, brillo: 0.35 });
    agricultor(W, { x: HX, z: HZ, gira: 0.25 * Math.sin(s * 1.3) });
    brazos(W.H, q(m2 + 0.15, 0.4), 0.55);
    W.camara(...mezcla([HX + 0.25, 1.75, HZ + 1.7, HX, 1.85, HZ - 0.3], [HX + 0.8, 2.15, HZ + 6.0, HX, 1.75, HZ - 0.3], sale(u)));
  }
}

// 3 · El viaje: clasificar (cinta), lavar y embolsar (máquina), camión, tienda (el que repone) y merma (cubo).
function escena3(W, X, s, e, mk) {
  const D = e.fin - e.ini, m0 = mk(0, 0.6), m1 = mk(1, 2.9), m2 = mk(2, 4.3), m3 = mk(3, 5.7), res = e.seg[0].res, q = (a, d) => sale(tramo(s, a, a + (d || 0.35)));
  const rT = (i, def) => (res[i] ? res[i].ini : def);
  const tL = rT(1, 1.6) - 0.1;
  const qv = [1, q(rT(0, 0.8)), q(rT(2, 2.3)), q(rT(3, m1 + 0.4)), q(rT(4, m2 + 0.6))];
  const K3 = 0.42, COL = { vals: [PR.O, VJ[0], VJ[1], VJ[2], VJ[3]], cols: [AMBH, ROJOH, ROJOH, ROJOH, ROJOH], q: qv, kc: K3, w: 0.24, d: 0.1, txt: ['0,28', null, null, null, null], br: [0.3, 0.45, 0.45, 0.45, 0.45], t: s };
  const flashChunk = (x, y, z, t0) => { if (s > t0 && s < t0 + 0.6) X.destello(5, { x, y, z, esc: 1.3, op: 0.75 * Math.exp(-(s - t0) * 6), color: 0xff6b6b }); };
  if (s < tL) {
    // a) cinta clasificadora: la patata con su etiqueta avanza; las demás se separan en dos carriles.
    const CX = LAY.CIN[0], CZ = LAY.CIN[1], px = CX + 1.35 - 0.9 * s;
    X.cinta({ x: CX, z: CZ, t: s + 3 }); X.campo({ x: 0, z: LAY.AGR[1] });
    X.suelta(0, { x: px, y: 0.98, z: CZ, esc: 1.25 });
    for (let i = 1; i <= 7; i++) { const x = px + (i - 3.5) * 0.48, lado = i % 2 ? 1 : -1, dz = x < CX - 0.5 ? lado * 0.2 * Math.min(1, (CX - 0.5 - x) / 0.4) : 0; if (x > CX - 1.65 && x < CX + 1.65) X.suelta(i, { x, y: 0.97, z: CZ + dz, ry: i, esc: i % 2 ? 1.15 : 0.85 }); }
    columna(X, 0, Object.assign({ x: px, y: 1.16, z: CZ + 0.03 }, COL));
    flashChunk(px, 1.16 + PR.O * K3 + 0.05, CZ + 0.1, rT(0, 0.8));
    W.camara(px + 0.6 - 0.1 * s, 1.38, CZ + 1.6, px - 0.25, 1.1, CZ);
  } else if (s < m1) {
    // b) máquina de lavar y embolsar: la patata cae en la boca, caen gotas y sale embolsada por delante.
    const LX = LAY.LAV[0], LZ = LAY.LAV[1], tE = rT(2, (tL + m1) / 2);
    X.lavadora({ x: LX, z: LZ, ry: 0, t: s * 1.5 }); X.campo({ x: 0, z: LAY.AGR[1] });
    const uc = tramo(s, tL, tL + 0.4); if (uc < 1) X.suelta(0, { x: LX, y: 3.0 - 1.3 * uc * uc, z: LZ, rx: s * 6, esc: 1.25 });
    const sb = sale(tramo(s, tE - 0.1, tE + 0.45));
    if (s > tE - 0.1) X.malla(1, { x: LX + 0.15 * sb, y: 0.8 - 0.55 * sb + 0.25, z: LZ + 0.75 + 0.75 * sb, esc: 0.5, rx: -0.3 * (1 - sb) });
    const cx = LX - 1.2, top = columna(X, 0, Object.assign({ x: cx, y: 0.75, z: LZ + 0.5 }, COL));
    flashChunk(cx, top - 0.1, LZ + 0.6, tE);
    const u = suave(tramo(s, tL, m1));
    W.camara(...mezcla([LX - 3.1, 2.6, LZ + 4.9, LX - 0.55, 1.25, LZ + 0.2], [LX - 2.0, 1.7, LZ + 4.1, LX - 0.6, 0.95, LZ + 0.4], u));
  } else if (s < m2) {
    // c) camión: la malla en la caja; arranca con las ruedas girando; travelling paralelo a la altura de las ruedas.
    const d = s - m1, TXc = -1.6 + 0.7 * d + 0.9 * d * d, TZ = 6.0;
    X.camion({ x: TXc, z: TZ, ry: PI / 2, rueda: -(0.7 * d + 0.9 * d * d) / 0.3 });
    X.malla(1, { x: TXc - 0.3, y: 0.74 + 0.25, z: TZ, esc: 0.5, ry: PI / 2 });
    const top = columna(X, 0, Object.assign({ x: TXc - 0.3, y: 1.72, z: TZ + 0.1 }, COL));
    flashChunk(TXc - 0.3, top - 0.08, TZ + 0.2, rT(3, m1 + 0.4));
    W.camara(TXc + 0.5 - 0.2 * d, 1.0, TZ + 5.9, TXc + 0.1, 1.5, TZ);
  } else if (s < m3) {
    // d) tienda: el que repone deja la malla en la balda; la etiqueta gana el último trozo grande; grúa que sube.
    X.estanteria({});
    const d = s - m2, pon = sale(tramo(d, 0, 0.7)), RX = -1.35, RZ = 0.8, rot = Math.atan2(-0.45 - RX, 0 - RZ);
    const MP = manos(RX, RZ, rot, 1, 1.0, 0), dest = [-0.45, LAY.YB + 0.225, 0.02], bp = mezcla(MP, dest, pon);
    X.malla(1, { x: bp[0], y: bp[1] + 0.12 * Math.sin(pon * PI), z: bp[2], esc: 0.5 });
    W.multitud(0, { directo: (i) => i === 0 ? { x: RX, z: RZ, rot, amp: 0, color: '#f8fafc', cq: 0.4, brillo: 0.05 } : { x: -60, z: -60, esc: 0 } });
    brazos(W.gente[0], 1 - 0.6 * tramo(d, 0.7, 1.1), 1);
    const top = columna(X, 0, Object.assign({ x: 0.05, y: LAY.YB, z: 0.05 }, COL));
    flashChunk(0.05, top - 0.08, 0.2, rT(4, m2 + 0.6));
    const u = suave(tramo(s, m2, m3));
    W.camara(...mezcla([0.25, 0.85, 4.3, -0.35, 0.95, 0.2], [0.35, 2.0, 4.1, -0.35, 1.35, 0.2], u));
    return true;
  } else {
    // e) merma: unas cuantas patatas caen de la balda al cubo rojo; los trozos de la etiqueta se mueven (se reparte entre todos).
    X.estanteria({}); X.cubo({ x: 1.35, z: 0.95 });
    X.malla(1, { x: -0.35, y: LAY.YB + 0.225, z: 0.02, esc: 0.5 });
    for (let i = 0; i < 5; i++) {
      const t0 = m3 + 0.05 + 0.18 * i, u = tramo(s, t0, t0 + 0.55), x0 = 0.95 + 0.17 * i, z0 = 0.1;
      let p;
      if (u <= 0) p = [x0, LAY.YB + 0.08, z0];
      else { const ex = 1.35 + 0.12 * Math.sin(i * 2.3), ez = 0.95 + 0.1 * Math.cos(i * 1.7); p = mezcla([x0, LAY.YB + 0.08, z0], [ex, 0.12 + 0.05 * i, ez], u); p[1] = LAY.YB + 0.08 + (0.12 + 0.05 * i - LAY.YB - 0.08) * u * u + 0.25 * Math.sin(u * PI) * (1 - u); }
      X.suelta(i, { x: p[0], y: p[1], z: p[2], rx: u * 7, ry: i, esc: 1.15 });
    }
    columna(X, 0, Object.assign({ x: 0.15, y: LAY.YB, z: 0.05 }, COL, { wig: tramo(s, m3, m3 + 0.2) * (1 - 0.6 * tramo(s, m3 + 0.8, D)) }));
    const u = sale(tramo(s, m3, D + 0.3));
    W.camara(...mezcla([2.2, 3.1, 3.2, 1.0, 0.65, 0.55], [1.75, 3.7, 2.5, 0.95, 0.45, 0.6], u));
  }
}

// 4 · «Hacienda se lleva poco: el IVA de la patata es del 4 %, unos 7 céntimos.»
function escena4(W, X, s, e, mk) {
  const D = e.fin - e.ini, m0 = mk(0, 1.3), m1 = mk(1, 3.0), q = (a, d) => sale(tramo(s, a, a + (d || 0.4)));
  const K4 = 0.95, h0 = PR.O * K4, h1 = PR.VIAJE * K4, h2 = PR.IVA * K4, W4 = 0.62, D4 = 0.32;
  columna(X, 0, { x: 0, y: 0, z: 0, vals: [PR.O, PR.VIAJE], cols: [AMBH, ROJOH], kc: K4, w: W4, d: D4, txt: ['0,28 €', null], br: [0.3, 0.3], gap: 0.02 });
  const sep = suave(tramo(s, m0 + 0.1, m0 + 1.1)), yI = h0 + h1 + h2 / 2;
  const SP = [0.55 * sep, yI + 0.22 * sep, 0.6 * sep];
  X.bloque(5, { x: SP[0], y: SP[1], z: SP[2], w: W4, h: Math.max(0.006, h2 - 0.012), d: D4, ry: -0.3 * sep, color: ROJOH, brillo: 0.35 + 0.45 * q(m1 - 0.05, 0.25) });
  if (sep > 0.3) X.destello(0, { x: SP[0], y: SP[1], z: SP[2] + 0.1, esc: 1.2, op: 0.2 + 0.3 * q(m1 - 0.05, 0.25), color: 0xff6b6b });
  // La etiqueta va algo a la derecha del eje para que, con la cámara a la derecha, quede centrada en el cuadro.
  W.rotulo('via4', 'EL VIAJE · 1,38 €', 0.14, h0 + h1 * 0.68, D4 / 2 + 0.25, q(0.4, 0.3) * (1 - q(m1 - 0.2, 0.3)), ROJO, 0.15);
  W.rotulo('iva4', 'IVA · 0,07 €', SP[0], SP[1] + 0.16, SP[2] + 0.1, q(m0 + 0.6, 0.3), ROJO, 0.15);
  let C;
  // Grúa: empieza con la columna entera en cuadro (la punta por debajo de los subtítulos, ~520 px) y sube y se acerca hasta la punta.
  if (s < m0) { const u = suave(tramo(s, 0, m0)); C = mezcla([0.45, 0.6, 4.4, 0.02, 0.82, 0], [1.0, 1.75, 2.7, 0.05, 1.62, 0], u); }
  else if (s < m1) { const u = suave(tramo(s, m0, m1)); C = mezcla([1.0, 1.75, 2.7, 0.05, 1.62, 0], [1.35, 1.6, 4.7, 0.15, 1.12, 0.1], u); }
  else { const u = sale(tramo(s, m1, D + 0.3)); C = mezcla([1.35, 1.6, 4.7, 0.15, 1.12, 0.1], [SP[0] + 0.55, SP[1] + 0.2, SP[2] + 1.55, SP[0], SP[1] - 0.05, SP[2]], u); }
  W.camara(...C);
}

// 5 · El pico: «en abril, 61 céntimos; en octubre, menos de la mitad. Y en la tienda, solo bajó un 10 %.»
function escena5(W, X, s, e, mk) {
  const D = e.fin - e.ini, m0 = mk(0, 0.8), m1 = mk(1, 3.3), m2 = mk(2, 5.0), q = (a, d) => sale(tramo(s, a, a + (d || 0.4)));
  const K5 = 0.85, XC = -0.58, XT = 0.58, WC = 0.6, DC = 0.5;
  const bC = sale(tramo(s, m1 + 0.05, m1 + 0.95)), vC = lerp(PR.oA, PR.O, bC), bT = sale(tramo(s, m2 + 0.1, m2 + 0.75)), vT = lerp(PR.dA, PR.D, bT);
  X.bloque(0, { x: XC, y: vC * K5 / 2, z: 0, w: WC, h: vC * K5, d: DC, color: AMBH, brillo: 0.3 });
  X.bloque(1, { x: XT, y: vT * K5 / 2, z: 0, w: WC, h: vT * K5, d: DC, color: BLANCOH, brillo: 0.1 });
  // Marcas finas del nivel de abril (lo que bajó cada una).
  X.bloque(2, { x: XC, y: PR.oA * K5, z: 0, w: WC + 0.08, h: 0.015, d: DC + 0.08, color: AMBH, brillo: 0.9, op: 0.6 * bC });
  X.bloque(3, { x: XT, y: PR.dA * K5, z: 0, w: WC + 0.08, h: 0.015, d: DC + 0.08, color: BLANCOH, brillo: 0.9, op: 0.6 * bT });
  // Solo las cifras de verdad (abril y octubre): la etiqueta cambia a mitad de la bajada, sin cifras intermedias.
  W.rotulo('vC', eur(bC < 0.5 ? PR.oA : PR.O), XC, vC * K5 + 0.17, 0.28, q(m0, 0.3), AMB, 0.19);
  W.rotulo('vT', eur(bT < 0.5 ? PR.dA : PR.D), 0, vT * K5 - 0.12, 0.3, q(0.1, 0.3), BLANCO, 0.19);
  W.rotulo('campo5', 'CAMPO', XC, 0.18, 0.42, 1, AMB, 0.14);
  W.rotulo('tienda5', 'TIENDA', XT, 0.18, 0.42, 1, BLANCO, 0.14);
  X.fechas({ x: 0, z: 0.7, mes: 6 * suave(tramo(s, m1 - 0.25, m1 + 0.9)) });
  // Encuadre abierto: las dos columnas, sus etiquetas y la cinta de fechas caben enteras en todo el plano (la punta de la tienda
  // por debajo de los subtítulos y su borde derecho antes de los botones de Instagram); la cinta queda por encima de los rótulos 2D.
  let C;
  if (s < m2) { const u = suave(tramo(s, 0, m2)); C = mezcla([-1.35, 1.25, 5.9, 0.05, 0.64, 0.2], [-0.75, 1.15, 5.45, -0.02, 0.62, 0.2], u); }
  else { const u = sale(tramo(s, m2, D)); C = mezcla([-0.75, 1.15, 5.45, -0.02, 0.62, 0.2], [0.35, 1.5, 5.7, 0.1, 0.66, 0.2], u); }
  W.camara(...C);
}

// 6 · «La patata es la parte pequeña: aunque se hunda, el total se mueve mucho menos.»
function escena6(W, X, s, e, mk) {
  const D = e.fin - e.ini, m0 = mk(0, 1.6), m1 = mk(1, 2.6), q = (a, d) => sale(tramo(s, a, a + (d || 0.4)));
  const K6 = 0.8, b = sale(tramo(s, m0, m0 + 1.2)), vA = lerp(PR.oA, PR.O, b), tot = lerp(PR.dA, PR.D, b);
  const top = columna(X, 0, { x: 0, y: 0, z: 0, vals: [vA, tot - vA], cols: [AMBH, ROJOH], kc: K6, w: 0.7, d: 0.7, br: [0.32, 0.3], gap: 0.02, txt: ['PATATA', null] });
  X.bloque(3, { x: 0, y: PR.dA * K6, z: 0, w: 0.82, h: 0.015, d: 0.82, color: BLANCOH, brillo: 0.9, op: 0.65 * q(m0, 0.3) });
  X.bloque(4, { x: 0, y: PR.oA * K6, z: 0, w: 0.82, h: 0.015, d: 0.82, color: AMBH, brillo: 0.9, op: 0.65 * q(m0, 0.3) });
  const u = suave(s / D), C6 = orbita([0, 1.0 + 0.2 * u, 4.6 - 0.3 * u, 0, 0.55, 0], -0.75 + 1.5 * u);
  W.camara(...C6);
  // Las etiquetas van delante de la columna, del lado de la cámara (la columna gira y taparía un rótulo fijo).
  const dl = Math.hypot(C6[0], C6[2]), fx = 0.62 * C6[0] / dl, fz = 0.62 * C6[2] / dl;
  W.rotulo('m54', 'CAMPO −54 %', fx, PR.oA * K6 + 0.12, fz, q(m0 + 0.7, 0.3), AMB, 0.16);
  W.rotulo('m10', 'TOTAL −10 %', fx, top - 0.15, fz, q(m1, 0.3), BLANCO, 0.16);
}

// 7 · «Hoy, en el súper, compara formatos por el precio por kilo, que es obligatorio, no por bolsa.»
// Etiquetas sin cifras inventadas: el precio grande es una barra gris con «€»; la línea «€/kg» se enciende en turquesa.
function pintaEtiqueta(est) { return (x, w, h) => {
  x.fillStyle = '#f8fafc'; x.beginPath(); x.roundRect(6, 6, w - 12, h - 12, 22); x.fill();
  x.globalAlpha = est === 'solo' ? 0.22 : 1; x.fillStyle = '#94a3b8'; x.beginPath(); x.roundRect(36, 44, w * 0.5, h * 0.36, 18); x.fill();
  x.fillStyle = '#0f172a'; x.font = '900 130px Inter, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('€', w * 0.78, 44 + h * 0.18 + 6); x.globalAlpha = 1;
  const kg = est !== 'normal'; x.fillStyle = kg ? '#2dd4bf' : '#e2e8f0'; x.fillRect(6, h * 0.66, w - 12, h * 0.3);
  x.fillStyle = kg ? '#06121a' : '#64748b'; x.beginPath(); x.roundRect(36, h * 0.72, w * 0.36, h * 0.18, 10); x.fill();
  x.font = '900 70px Inter, sans-serif'; x.fillText('€/kg', w * 0.72, h * 0.81 + 3); }; }
function escena7(W, X, s, e, mk) {
  const D = e.fin - e.ini, m0 = mk(0, 0.9), m1 = mk(1, 2.9), m2 = mk(2, 3.9), res = e.seg[0].res, q = (a, d) => sale(tramo(s, a, a + (d || 0.4)));
  const tKg = res[0] ? res[0].ini : m0 + 1.0, tSolo = res[1] ? res[1].ini : m2 + 0.1, YB = LAY.YB;
  X.estanteria({});
  X.malla(1, { x: -0.8, y: YB + 0.45 * 0.62, z: 0.0, esc: 0.62 });
  X.malla(2, { x: 0.55, y: YB + 0.45 * 1.0, z: 0.02, esc: 1.0 });
  const est = s < tKg ? 'normal' : s < tSolo ? 'kg' : 'solo';
  [[-0.8, 1], [0.55, 2]].forEach(([x, i]) => X.plano(i, { clave: 'etq|' + est, lw: 512, lh: 330, pintar: pintaEtiqueta(est), ancho: 0.6, x, y: YB - 0.27, z: 0.4 }));
  if (s > tKg - 0.05) [[-0.8, 1], [0.55, 2]].forEach(([x, i]) => X.destello(i, { x, y: YB - 0.33, z: 0.45, esc: 0.9, op: 0.35 * Math.exp(-(s - tKg) * 2.5) + 0.12, color: 0x5eead4 }));
  W.heroe({ x: -0.12, z: 1.2, gira: PI, luz: q(0.15, 0.6) });
  const u = suave(s / D);
  W.camara(...mezcla([2.1, 1.45, 4.6, -0.15, 1.0, 0.3], [-0.12, 1.85, 5.2, -0.12, 0.98, 0.3], u));
}

// 8 · Cierre: «De cada 4 euros en patatas, la patata no llega a 1. Casi todo lo demás es el viaje.» Cola: el fotograma 0.
function escena8(W, X, s, e, mk) {
  const D = e.fin - e.ini, m0 = mk(0, 1.4), m1 = mk(1, 2.6), q = (a, d) => sale(tramo(s, a, a + (d || 0.4))), cola = D - 0.55;
  if (s >= cola) { gancho(W, X, s - D, 3.3, 4.2); return; }
  const pos = [0, 1, 2, 3].map(j => { const tj = 0.02 + 0.12 * j, u = tramo(s, tj, tj + 0.28); return [0, 2.6 * (1 - u * u), 0, (1 - u) * 0.9, 0]; });
  const brR = 0.3 + 0.45 * q(m1, 0.3) * (0.85 + 0.15 * Math.sin(s * 9));
  X.losas({ x: 0, z: 0, pos, roja: [0, 1, 1, 1], relleno: 1, rojaArriba: 1, raya: 1, brillo: brR });
  W.rotulo('pat8', 'PATATA', 0, 0.1, 0.8, q(m0, 0.3), AMB, 0.16);
  W.rotulo('via8', 'VIAJE', 0, 0.82, 0.8, q(m1, 0.3), ROJO, 0.24);
  if (s > m1) X.luzRoja({ x: 0.3, y: 1.6, z: 1.4, i: 2.5 * q(m1, 0.3) });
  const u = suave(tramo(s, 0, cola));
  W.camara(...orbita(mezcla([0, 1.7, 6.2, 0, 0.5, 0], [0, 1.0, 4.1, 0, 0.42, 0], u), 0.35 - 0.5 * u));
}
`;

// Capa 2D: rótulos de 2–4 palabras en el tercio central-bajo (y ≈ 1.290–1.395 px), una nota pequeña abajo a la izquierda.
const nota = (txt, cls = '') => `<div class="nota ${cls}">${txt}</div>`;
const ESCENAS = [
  // 0 · Gancho: «PAGAS 1,73 €» ya puesto; a los 0,65 s, «AL CAMPO: 0,28 €»; en la cinta, «+ CLASIFICAR»; en el primer plano, «0,28 € / KG».
  { html: () => `<div class="rt" data-t="translateX(-50%)" style="top:1395px">PAGAS <span>1,73 €</span></div>
      <div class="rt amb" data-t="translateX(-50%)" style="top:1395px">AL CAMPO: <span class="a">0,28 €</span></div>
      <div class="rt roja p" data-t="translateX(-50%)" style="top:1395px">+ CLASIFICAR</div>
      <div class="rt amb" data-t="translateX(-50%)" style="top:1395px"><span class="a">0,28 €</span> / KG</div>`,
    anim: function (s, e, el) { const M = e.seg[0].marcas, m0 = Math.max(M[0] != null ? M[0] : 3.3, 3.05), r = el.querySelectorAll('.rt');
      ver(r[0], s, -1, 0.66); ver(r[1], s, 0.66, 2.45); ver(r[2], s, 2.6, m0 - 0.1); ver(r[3], s, m0 - 0.05); } },
  // 1 · «SEGÚN COAG» y, en «39 céntimos», «COAG 0,28 · MINISTERIO 0,39».
  { html: () => `<div class="rt amb" data-t="translateX(-50%)">SEGÚN <span class="a">COAG</span></div>
      <div class="rt amb pp" data-t="translateX(-50%)">COAG <span class="a">0,28</span> · MINISTERIO <span class="a">0,39</span></div>
      ${nota('COAG (organización agraria): media de octubre de 2026')}
      ${nota('Ministerio de Agricultura: semana del 19 al 25 oct. 2026')}`,
    anim: function (s, e, el) { const M = e.seg[0].marcas, m0 = M[0] != null ? M[0] : 2.2, m1 = M[1] != null ? M[1] : 3.2, r = el.querySelectorAll('.rt'), n = el.querySelectorAll('.nota');
      ver(r[0], s, 0.25, m1 - 0.05); ver(r[1], s, m1); ver(n[0], s, 0.4, m0 - 0.05); ver(n[1], s, m0); } },
  // 2 · «NI 1 DE CADA 4 €» en el «ding»; «¿Y EL RESTO?» en la pregunta.
  { html: () => `<div class="rt amb" data-t="translateX(-50%)">NI <span class="a">1</span> DE CADA 4 €</div>
      <div class="rt roja" data-t="translateX(-50%)">¿Y EL <span class="r">RESTO</span>?</div>
      ${nota('De cada 4 €, al campo: 0,65 € (COAG) · 0,91 € (Ministerio)')}`,
    anim: function (s, e, el) { const M = e.seg[0].marcas, m1 = M[1] != null ? M[1] : 3.0, m2 = M[2] != null ? M[2] : 4.6, r = el.querySelectorAll('.rt');
      ver(r[0], s, m1 + 0.05, m2 - 0.05); ver(r[1], s, m2 + 0.25); ver(el.querySelector('.nota'), s, m1 + 0.4, m2 - 0.05); } },
  // 3 · El viaje: un rótulo por parada.
  { html: () => `<div class="rt roja p" data-t="translateX(-50%)">CLASIFICAR</div>
      <div class="rt roja p" data-t="translateX(-50%)">LAVAR Y EMBOLSAR</div>
      <div class="rt roja p" data-t="translateX(-50%)">TRANSPORTE</div>
      <div class="rt roja p" data-t="translateX(-50%)">TIENDA</div>
      <div class="rt roja p" data-t="translateX(-50%)">MERMA</div>`,
    anim: function (s, e, el) { const M = e.seg[0].marcas, R = e.seg[0].res, r = el.querySelectorAll('.rt');
      const m1 = M[1] != null ? M[1] : 2.9, m2 = M[2] != null ? M[2] : 4.3, m3 = M[3] != null ? M[3] : 5.7, t0 = R[0] ? R[0].ini : 0.8, t1 = R[1] ? R[1].ini : 1.6;
      ver(r[0], s, t0, t1 - 0.1); ver(r[1], s, t1 - 0.05, m1); ver(r[2], s, m1 + 0.05, m2); ver(r[3], s, m2 + 0.05, m3); ver(r[4], s, m3 + 0.05); } },
  // 4 · «IVA 4 % ≈ 0,07 €» en la «caja».
  { html: () => `<div class="rt roja" data-t="translateX(-50%)">IVA 4 % ≈ <span class="r">0,07 €</span></div>
      ${nota('Ley 37/1992, art. 91: IVA del 4 % en hortalizas y tubérculos')}`,
    anim: function (s, e, el) { const M = e.seg[0].marcas, m0 = M[0] != null ? M[0] : 1.3, m1 = M[1] != null ? M[1] : 3.0;
      ver(el.querySelector('.rt'), s, m1 + 0.05); ver(el.querySelector('.nota'), s, m1 + 0.2); } },
  // 5 · «SEGÚN COAG»; «CAMPO: −54 %» en «menos de la mitad»; «TIENDA: −10 %» en «un 10 %» (los dos se quedan: la portada).
  // Los dos rótulos caben por encima de 1.500 px (la cinta de fechas y las columnas quedan por encima de 1.300).
  { html: () => `<div class="rt amb p" data-t="translateX(-50%)" style="top:1310px">SEGÚN <span class="a">COAG</span></div>
      <div class="rt amb p" data-t="translateX(-50%)" style="top:1310px">CAMPO: <span class="a">−54 %</span></div>
      <div class="rt p" data-t="translateX(-50%)" style="top:1408px">TIENDA: −10 %</div>
      ${nota('COAG, precios en origen y destino: patata, abr. y oct. 2026')}`,
    anim: function (s, e, el) { const M = e.seg[0].marcas, R = e.seg[0].res, r = el.querySelectorAll('.rt');
      const m1 = M[1] != null ? M[1] : 3.3, m2 = M[2] != null ? M[2] : 5.0, tM = R[1] ? R[1].ini : m1 + 0.6, tD = R[2] ? R[2].ini : m2 + 1.0;
      ver(r[0], s, 0.2, tM - 0.05); ver(r[1], s, tM); ver(r[2], s, tD); ver(el.querySelector('.nota'), s, 0.3, tD - 0.05); } },
  // 6 · «LA PATATA: LA PARTE PEQUEÑA».
  { html: () => `<div class="rt amb pp" data-t="translateX(-50%)">LA PATATA: <span class="a">LA PARTE PEQUEÑA</span></div>`,
    anim: function (s, e, el) { ver(el.querySelector('.rt'), s, 0.35); } },
  // 7 · «PRECIO POR KILO» y, en «que es obligatorio», «PRECIO POR KILO · OBLIGATORIO».
  { html: () => `<div class="rt turq" data-t="translateX(-50%)">MIRA EL <span class="t">€/KG</span></div>
      <div class="rt turq" data-t="translateX(-50%)"><span class="t">€/KG</span> OBLIGATORIO</div>
      ${nota('Real Decreto 3423/2000: €/kg obligatorio, también a granel')}`,
    anim: function (s, e, el) { const M = e.seg[0].marcas, R = e.seg[0].res, r = el.querySelectorAll('.rt'), m1 = M[1] != null ? M[1] : 2.9, t0 = R[0] ? R[0].ini : 1.5;
      ver(r[0], s, t0, m1); ver(r[1], s, m1 + 0.05); ver(el.querySelector('.nota'), s, m1 + 0.1); } },
  // 8 · Cierre: «LA PATATA: NI 1 DE CADA 4 €»; cola: «PAGAS 1,73 €» como en el fotograma 0.
  { html: () => `<div class="rt amb pp" data-t="translateX(-50%)">LA PATATA: NI <span class="a">1</span> DE CADA 4 €</div>
      <div class="rt" data-t="translateX(-50%)" style="top:1395px">PAGAS <span>1,73 €</span></div>`,
    anim: function (s, e, el) { const M = e.seg[0].marcas, m0 = M[0] != null ? M[0] : 1.4, D = e.fin - e.ini, cola = D - 0.55, r = el.querySelectorAll('.rt');
      ver(r[0], s, m0, cola); r[1].style.opacity = s >= cola ? 1 : 0; r[1].style.transform = 'translateX(-50%)'; } }
];

const TRES = function (t, k, s, e, W) {
  const X = W.X; X.apagar();
  const M = e.seg.flatMap(g => g.marcas), mk = (j, def) => (M[j] != null ? M[j] : def);
  const fuera = () => ({ x: -60, z: -60, esc: 0 });
  let gente = false;
  if (k === 0) gancho(W, X, s, mk(0, 3.3), mk(1, 4.2));
  else if (k === 1) escena1(W, X, s, e, mk);
  else if (k === 2) escena2(W, X, s, e, mk);
  else if (k === 3) gente = escena3(W, X, s, e, mk);
  else if (k === 4) escena4(W, X, s, e, mk);
  else if (k === 5) escena5(W, X, s, e, mk);
  else if (k === 6) escena6(W, X, s, e, mk);
  else if (k === 7) escena7(W, X, s, e, mk);
  else escena8(W, X, s, e, mk);
  if (!gente) W.multitud(t, { directo: fuera });
};

const pildoras = {
  'es-agricultor': pildora3d({
    slug: 'es-agricultor', cuenta: 'es',
    T: { es: { titulo: 'Pagas de media 1,73 € por un kilo de patatas. Al agricultor le pagaron 28 céntimos', guion: GUION } },
    fijo: () => `<div class="hud i fmt">HACEMOS LA CUENTA</div><div class="hud d"><i></i><span id="reloj">00:00</span></div>`,
    cssExtra: CSS, scriptExtra: SCRIPT,
    datos: () => ({ O, D, M, IVA, VIAJE, oA, dA, TROZOS }),
    escenas: ESCENAS, tres: TRES,
    // Como es-iva-sobre-impuesto y es-loteria-navidad: cola corta (el bucle vuelve pronto al gancho) y la capa 2D se va con el corte seco.
    cola: 0.8, corte2d: 'seco',
    texto: { es: TEXTO }
  })
};

module.exports = { pildoras };
