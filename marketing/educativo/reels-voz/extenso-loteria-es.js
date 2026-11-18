// Formato extenso (45–60 s) · @finanziapp.es (España), en 3D (reels-voz/tres.js), serie «Hacemos la cuenta».
// es-loteria-navidad · «Pagas 20 euros por un décimo de Navidad. Antes de que salga la primera bola, ya vale 14.»
// Guion final y verificado: guiones/2026-11-loteria-es.md (tabla de escenas, cuentas, fuentes, texto y portada).
// Validez: hasta el sorteo del 22/12/2026.
//
// Fuentes de cada dato (consultadas el 17-nov-2026):
// - Gravamen especial: Ley 35/2006 del IRPF, disposición adicional 33.ª (BOE, texto consolidado, act. 11/11/2026): por cada
//   décimo (apdo. 1), exentos hasta 40.000 € (apdo. 2, desde el 1-1-2020; en décimos compartidos se prorratea), tipo del 20 %
//   (apdos. 4 y 6). https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764#datrigesimatercera
// - Agencia Tributaria, nota del 15/12/2025 sobre los premios de la Lotería de Navidad (ejemplo de 100.000 €: 12.000 de
//   retención, 88.000 netos; premios compartidos). https://sede.agenciatributaria.gob.es/Sede/todas-noticias/2025/diciembre/15/premios-sorteo-loteria-navidad.html
// - Agencia Tributaria, Manual práctico de Renta 2024, «Gravamen especial sobre los premios de determinadas loterías».
// - Ley 29/1987 del ISD, arts. 5.b y 21 (solo en el texto de la publicación). https://www.boe.es/buscar/act.php?id=BOE-A-1987-28141
// - Banco de España, Portal Cliente Bancario, «Te ha tocado: cinco claves…», 23/12/2025 (reparto por escrito, caduca a los 3 meses).
//   https://clientebancario.bde.es/pcb/es/blog/te-ha-tocado-cinco-claves-para-disfrutar-del-premio-sin-sustos.html
// - Sorteo de Navidad 2026: El Español, 01/07/2026 (décimo a 20 €, 205 series, Gordo de 400.000 € por décimo, 2.º 125.000,
//   3.º 50.000, cuartos 20.000, quintos 6.000). https://www.elespanol.com/sociedad/20260701/loteria-navidad-venta-espana-precio-decimo-premios-fecha-limite-comprar/1003744306016_0.html
// - Sorteo de Navidad 2026: Onda Vasca / Europa Press, 09/07/2026, citando a la SELAE (205 series de 100.000 números,
//   emisión de 4.100 M€, 70 % a premios = 2.870 M€, 98 M€ más que en 2025). https://www.ondavasca.com/los-decimos-de-la-loteria-de-navidad-2026-ya-estan-a-la-venta/
// - Sorteo de Navidad 2026: merca2, 21/10/2026 (2.050 décimos por número, 72.000 € de retención del Gordo, reintegro de 20 €;
//   su «1.800 de pedrea» es un redondeo de 1.794). https://www.merca2.es/2026/10/21/loteria-el-gordo-navidad-2026-2477950/
// - Programa de 2025: Última Hora, 11/12/2025 (198 series, 2.772 M€, 9.999 reintegros de 200 € por serie).
//   https://www.ultimahora.es/noticias/sociedad/2025/12/11/2495821/estos-son-todos-premios-loteria-navidad-mayor-menor-cantidad.html
// - Tabla de premios por serie (Newtral con datos de la SELAE): 15.304 premios y 14.000.000 € por serie. https://datawrapper.dwcdn.net/1hzT8/2/
// - NO confirmado con fuente primaria: el programa oficial de premios de 2026 (loteriasyapuestas.es da 403 desde aquí y no hay
//   resolución en el BOE). El desglose por categorías, y con él el 86/9/5, es el de 2025: así se dice en pantalla y en el texto.
//   El 70 %, los 400.000 € del Gordo, el reintegro de 20 €, las 205 series y la regla fiscal sí son de 2026.
//
// Respecto al guion solo se han añadido marcas § (no se leen ni cambian la toma de voz): frase 2 «§por encima» y «§tributa».
const { pildora3d } = require('./tres');
const { cuadra } = require('../reels/_comun');

// ——— cuentas (todas las del guion: guiones/2026-11-loteria-es.md, «Cuentas») ———
const r2 = (v) => Math.round(v * 100) / 100;
// Programa por serie (estructura de 2025; billete = 10 décimos = 200 €)
const PREMIOS = { gordo: 4e6, segundo: 1.25e6, tercero: 5e5, cuartos: 2 * 2e5, quintos: 8 * 6e4, pedrea: 1794 * 1000,
  aprox: 2 * 20000 + 2 * 12500 + 2 * 9600, centenas: (3 * 99 + 2 * 99) * 1000, dosUltimas: 3 * 999 * 1000, reintegro: 9999 * 200 };
const SERIE = Object.values(PREMIOS).reduce((a, b) => a + b, 0);
cuadra('premios por serie', SERIE, 14000000);
cuadra('número de premios por serie', 1 + 1 + 1 + 2 + 8 + 1794 + 6 + 495 + 2997 + 9999, 15304);
cuadra('emisión por serie', 100000 * 200, 20000000);
cuadra('70 % a premios', SERIE / 20000000, 0.7);
// Emisión 2026 y 2025
cuadra('emisión 2026 (M€)', 205 * 20, 4100);
cuadra('premios 2026 (M€)', 205 * 14, 2870);
cuadra('décimos 2026 (millones)', 205 * 100000 * 10 / 1e6, 205);
cuadra('premios 2025 (M€)', 198 * 14, 2772);
cuadra('diferencia 2026−2025 (M€)', 2870 - 2772, 98);
cuadra('décimos con el Gordo en 2026', 205 * 10, 2050);
// Valor esperado de un décimo de 20 € (1.000.000 de décimos por serie)
const VE = SERIE / 1e6;
cuadra('VE bruto: «ya vale 14»', VE, 14);
cuadra('aporte del Gordo: «4 son el Gordo»', PREMIOS.gordo / 1e6, 4);
cuadra('aporte de los 5 mayores (13 números)', r2((4e6 + 1.25e6 + 5e5 + 4e5 + 4.8e5) / 1e6), 6.63);
cuadra('sin 1.º, 2.º y 3.º (texto)', r2(VE - 4 - 1.25 - 0.5), 8.25);
cuadra('dos últimas cifras de 1.º, 2.º y 3.º (texto: «unos 3»)', r2((PREMIOS.dosUltimas + PREMIOS.centenas + PREMIOS.aprox) / 1e6), 3.58);
cuadra('reintegro (texto: «2»)', r2(PREMIOS.reintegro / 1e6), 2);
cuadra('pedrea (texto: «1,79»)', r2(PREMIOS.pedrea / 1e6), 1.79);
// Gravamen especial (DA 33.ª Ley 35/2006): 20 % de lo que pasa de 40.000 € por décimo
const imp = (p) => Math.max(0, p - 40000) * 0.2;
cuadra('Gordo: impuesto', imp(400000), 72000);
cuadra('Gordo: neto', 400000 - imp(400000), 328000);
cuadra('Gordo: tributan 360.000 (texto)', 400000 - 40000, 360000);
cuadra('2.º: neto', 125000 - imp(125000), 108000);
cuadra('3.º: neto', 50000 - imp(50000), 48000);
cuadra('cuarto exento', imp(20000), 0);
const IMP_ESP = r2((imp(400000) + imp(125000) + imp(50000)) / 100000);
cuadra('impuesto esperado por décimo', IMP_ESP, 0.91);
cuadra('VE neto: «te quedan 13»', r2(VE - IMP_ESP), 13.09);
cuadra('«te quedan 13» redondeado', Math.round(VE - IMP_ESP), 13);
cuadra('coste medio: «7 euros»', r2(20 - (VE - IMP_ESP)), 6.91);
cuadra('«7 euros» redondeado', Math.round(20 - (VE - IMP_ESP)), 7);
cuadra('factor del texto: ×0,35', Math.round((20 - (VE - IMP_ESP)) / 20 * 100) / 100, 0.35);
cuadra('rendimiento neto', r2((VE - IMP_ESP) / 20 * 100), 65.45);
// Lo que sale en pantalla además de las frases
cuadra('pantalla: 6 placas = 20 − 14', 20 - VE, 6);
cuadra('pantalla: 14 fichas de 20 = 70 %', 14 / 20, 0.7);
cuadra('pantalla: línea de 40.000 al 10 % de 400.000', 40000 / 400000, 0.1);
cuadra('pantalla: lámina = 20 % del exceso = 72.000', (400000 - 40000) * 0.2, 72000);
cuadra('pantalla: lámina = 18 % de la columna', 72000 / 400000, 0.18);
cuadra('pantalla: franja roja de la última ficha (0,91)', IMP_ESP, 0.91);
cuadra('pantalla: 13 + 7 = 20', Math.round(VE - IMP_ESP) + Math.round(20 - (VE - IMP_ESP)), 20);
cuadra('pantalla: campo de puntos 400 × 250', 400 * 250, 100000);
// Probabilidades por décimo
cuadra('Gordo: 1 de 100.000', 1 / 100000, 1e-5);
cuadra('terminación del Gordo: 1 de 10', (9999 + 1) / 100000, 0.1);
cuadra('mediana de años hasta el Gordo (comentarios)', Math.round(Math.log(2) / -Math.log(1 - 1e-5)), 69314);
// Décimo compartido entre 4 al 25 % (texto de la publicación)
cuadra('4 al 25 %: exento por persona', 40000 / 4, 10000);
cuadra('4 al 25 %: impuesto por persona', (100000 - 10000) * 0.2, 18000);
cuadra('4 al 25 %: neto por persona', 100000 - 18000, 82000);
cuadra('4 al 25 %: total igual', 4 * 18000, 72000);
// 86 / 9 / 5: 200 sorteos simulados con premios acumulados (semilla fija, reproducible; ~0,2 s)
{
  let sem = 2026; const azar = () => { sem = (sem * 1664525 + 1013904223) % 4294967296; return sem / 4294967296; };
  let nada = 0, solo20 = 0, mas = 0, total = 0; const N = 200;
  for (let s = 0; s < N; s++) {
    const pr = new Float64Array(100000), usados = new Set(), saca = () => { let n; do n = Math.floor(azar() * 100000); while (usados.has(n)); usados.add(n); return n; };
    const g = saca(), s2 = saca(), t3 = saca(), cu = [saca(), saca()], qu = Array.from({ length: 8 }, saca), pe = Array.from({ length: 1794 }, saca);
    pr[g] += 400000; pr[s2] += 125000; pr[t3] += 50000; cu.forEach(n => pr[n] += 20000); qu.forEach(n => pr[n] += 6000); pe.forEach(n => pr[n] += 100);
    [[g, 2000], [s2, 1250], [t3, 960]].forEach(([n, a]) => { pr[(n + 99999) % 100000] += a; pr[(n + 1) % 100000] += a; });
    [g, s2, t3, ...cu].forEach(n => { const h = n - n % 100; for (let k = h; k < h + 100; k++) if (k !== n) pr[k] += 100; });
    [g, s2, t3].forEach(n => { for (let k = n % 100; k < 100000; k += 100) if (k !== n) pr[k] += 100; });
    for (let k = g % 10; k < 100000; k += 10) if (k !== g) pr[k] += 20;
    for (let k = 0; k < 100000; k++) { const p = pr[k]; total += p; if (p === 0) nada++; else if (p === 20) solo20++; else mas++; }
  }
  cuadra('simulación: VE 14 €', Math.round(total / N / 100000 * 100) / 100, 14);
  cuadra('«86 no cobran nada»', Math.round(nada / N / 1000), 86);
  cuadra('«9 recuperan sus 20»', Math.round(solo20 / N / 1000), 9);
  cuadra('«5 cobran algo más»', Math.round(mas / N / 1000), 5);
}
cuadra('86 + 9 + 5', 86 + 9 + 5, 100);
cuadra('reintegro, el premio que más toca', Math.max(9999, 2997, 1794, 495), 9999);
cuadra('pantalla: rejilla de 100 = 86 + 9 + 5', 86 + 9 + 5, 10 * 10);

const TEXTO = `Tu décimo de 20 € vale, de media, 14 antes de que gire el bombo. 🎄

Lo que no cabía en el vídeo:
• Este año hay 205 series de 100.000 números: 205 millones de décimos y 2.870 millones en premios, el 70 % de los 4.100 millones que salen a la venta. Da igual dónde compres el décimo: todos los números tienen la misma probabilidad.
• De los 14 € que vuelven de media, 4 son el Gordo, unos 3 las dos últimas cifras del 1.º, 2.º y 3.º, 2 el reintegro y 1,79 la pedrea. Sin el 1.º, el 2.º y el 3.º, la media baja a 8,25 €.
• Si toca el Gordo (400.000 € al décimo), tributan los 360.000 que pasan de 40.000: quedan 328.000 €. Y los 40.000 € exentos son por décimo, no por persona: si sois cuatro a partes iguales, son 10.000 exentos para cada uno.
• Si compartís décimo, dejad por escrito antes del 22 quién juega y cuánto: una fotocopia con el nombre, el DNI y la parte de cada uno, con fecha y firmada por todos. No publiquéis la foto, porque lleva DNI. Si al cobrar no se acredita que era compartido, el reparto posterior puede tributar como donación.

Para hoy: suma lo que llevas en décimos y participaciones y multiplícalo por 0,35. En las participaciones, lo que sea donativo o recargo súmalo entero. Eso es lo que, de media, te cuesta la tradición este año. Si juegas, decide el tope antes de comprar.

Guárdalo para hacer la cuenta antes del 22 🔖 Y si compartes décimo, mándaselo a quien lo comparte contigo.

¿Habías hecho alguna vez esta cuenta? ¿Te sale más o menos de lo que pensabas? 👇

Contenido educativo, no es asesoramiento financiero.

Fuentes: Sorteo de Navidad 2026 (puesta a la venta el 29/06/2026; datos de la SELAE recogidos en prensa el 01/07 y el 09/07/2026); programa de premios por serie con la estructura de 2025 (15.304 premios y 14 M€ por serie), porque no hemos encontrado publicado el de 2026; Ley 35/2006 del IRPF, disposición adicional 33.ª (BOE, texto consolidado; exención de 40.000 € vigente desde 2020); Agencia Tributaria, nota del 15/12/2025 sobre premios compartidos; Ley 29/1987 del ISD; Banco de España, Portal Cliente Bancario (23/12/2025). El 86/9/5 es la media de 200 sorteos simulados. Cálculos propios, consultados el 17/11/2026.

#loteriadenavidad #finanzaspersonales #educacionfinanciera #dinero`;

const GUION = [
  [0, 'Pagas 20 euros por un décimo de Navidad. §Antes de que salga la primera bola, §{pop}ya *vale 14*.'],
  [1, 'Es la media: §el sorteo reparte en premios *el 70 %* de lo que vende.'],
  [2, 'Y lo que un décimo gana §por encima de 40.000 euros §tributa al 20 %: §{ding}tras impuestos, *te quedan 13*.'],
  [3, 'Entonces, §¿por qué a la mayoría *no le vuelve ni un euro*?'],
  [4, 'Porque esos 14 euros no se reparten: §*se amontonan en unos pocos*. §4 son el Gordo, §y el Gordo toca a *1 décimo de cada 100.000*.'],
  [5, 'De cada 100 décimos, §{caja}unos *86 no cobran nada*. §9 recuperan sus 20 euros: §el reintegro, *el premio que más toca*. §Y solo 5 cobran algo más.'],
  [6, 'Si juegas por tradición, es tu decisión. §Pero haz la cuenta antes del 22: §de media, la ilusión cuesta *7 euros por décimo*. §Y 86 de cada 100 veces, §{pop}*cuesta los 20*.']
];

const MONO = `'DejaVu Sans Mono', 'Liberation Mono', monospace`;
const CSS = `
  .hud.i.fmt { letter-spacing: .14em; }
  .rt { position: absolute; left: 50%; top: 1290px; padding: 10px 30px 15px; border-radius: 20px; background: rgba(9,14,27,.9); border: 3px solid #e2e8f0;
    color: #fff; font-size: 64px; line-height: 1.1; font-weight: 900; letter-spacing: -.015em; white-space: nowrap; opacity: 0; font-variant-numeric: tabular-nums;
    box-shadow: 0 10px 40px rgba(0,0,0,.45); }
  .rt.p { font-size: 52px; } .rt.amb { border-color: #f5b94a; } .rt.roja { border-color: #f87171; } .rt.turq { border-color: #5eead4; }
  .rt .a { color: #f5b94a; } .rt .r { color: #f87171; } .rt .t { color: #5eead4; }
  .nota { position: absolute; left: 70px; top: 1452px; max-width: 820px; font: 600 24px/1.32 ${MONO}; color: #b6c2d4; background: rgba(7,11,22,.8);
    border-radius: 10px; padding: 6px 14px; opacity: 0; }
  .cal { position: absolute; left: 66px; top: 505px; width: 150px; text-align: center; background: #f8fafc; border-radius: 18px; overflow: hidden; opacity: 0;
    box-shadow: 0 10px 34px rgba(0,0,0,.5); }
  .cal small { display: block; background: #ef4444; color: #fff; font: 800 28px/1.5 ${MONO}; letter-spacing: .12em; }
  .cal b { display: block; color: #0f172a; font-size: 86px; line-height: 1.1; font-weight: 900; padding-bottom: 6px; }
`;

// Mundo 3D propio (se añade al de tres.js): bombo dorado con bolas, rampa y cinta; billetes, placas rojas de 1 €, fichas,
// desagüe, la columna de los 400.000 €, el contador del suelo, el campo de 100.000 puntos, las rejillas de décimos y el foco
// del apagón. Todo se apaga al principio de cada fotograma (X3.apagar()) para que no se cuele en otra escena.
const SCRIPT = `
function ver(n, s, a, b) { if (!n) return; let p = a < -0.5 ? 1 : rebote(tramo(s, a - 0.1, a + 0.25)); if (b != null) p *= 1 - tramo(s, b - 0.12, b); aparece3(n, p); }
const PI = Math.PI, AMBH = 0xf5b94a, ROJOH = 0xef4444, TURQH = 0x2dd4bf, BLANCOH = 0xe6ebf2, OROH = 0xffcf5a;
const mezcla = (P, Q, u) => P.map((v, j) => v + (Q[j] - v) * u);
const suave = (x) => x * x * (3 - 2 * x);
const angulo = (a, b, g) => a + ((((b - a + PI) % (2 * PI)) + 2 * PI) % (2 * PI) - PI) * g;
function rotuloLado(W, clave, texto, x, y, z, lado, op, css, alto) { alto = alto || 0.4; const w = W.anchoRotulo(texto) * alto / 0.352; W.rotulo(clave, texto, x + lado * w / 2, y, z, op, css, alto); }
// Bombo: centro de la jaula, radio, boca y rampa (A arriba, B al final).
const BOM = { YC: 2.0, R: 1.05, M: [0, 3.32, 0], A: [0, 1.25, 0.74], B: [0, 0.14, 2.62] };
BOM.RANG = Math.atan2(BOM.A[1] - BOM.B[1], BOM.B[2] - BOM.A[2]);
// Rejilla de 100 décimos: 86 sin premio, 9 solo reintegro y 5 con más (posiciones al azar con semilla fija).
const REJ = (() => { let s = 20261222; const az = () => { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; };
  const o = Array.from({ length: 100 }, (_, i) => i); for (let i = 99; i > 0; i--) { const j = Math.floor(az() * (i + 1)); const x = o[i]; o[i] = o[j]; o[j] = x; }
  const tipo = new Array(100); o.forEach((c, r) => { tipo[c] = r < 86 ? 0 : r < 95 ? 1 : 2; });
  const reint = [], mas = []; tipo.forEach((x, i) => { if (x === 1) reint.push(i); if (x === 2) mas.push(i); });
  return { tipo, reint, mas, caida: Array.from({ length: 100 }, () => az()) }; })();

const X3 = (() => {
  const W = W3, T = W.T, S = W.S, objs = [];
  const grupo = () => { const g = new T.Group(); g.visible = false; S.add(g); objs.push(g); return g; };
  const mat = (c, o) => new T.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.55, metalness: 0.08 }, o || {}));
  const pieza = (g, geo, m, x, y, z) => { const o = new T.Mesh(geo, m); o.position.set(x, y, z); o.castShadow = true; o.receiveShadow = true; g.add(o); return o; };
  const lienzo = (w, h, pintar) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); if (pintar) pintar(x, w, h);
    const tx = new T.CanvasTexture(c); tx.encoding = T.sRGBEncoding; tx.anisotropy = 4; return { c, x, tx, clave: null }; };
  const haloTx = lienzo(256, 256, (x) => { const g = x.createRadialGradient(128, 128, 0, 128, 128, 128); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.3, 'rgba(255,255,255,.4)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 256, 256); }).tx;
  // Luces del mundo (para el apagón) y la rejilla del suelo.
  const LUCES = S.children.filter(o => o.isHemisphereLight || o.isDirectionalLight).map(l => [l, l.intensity]);
  const SUELO_REJ = S.children.find(o => o.type === 'GridHelper');
  const foco = new T.SpotLight(0xffc35a, 0, 24, 0.36, 0.6, 1.1); foco.position.set(0, 9, 1.5); S.add(foco); S.add(foco.target);
  function apagon(f, fi, fx, fz) { LUCES.forEach(([l, i0]) => { l.intensity = i0 * f; }); foco.intensity = fi || 0; foco.target.position.set(fx || 0, 0, fz || 0); foco.position.set(fx || 0, 9, (fz || 0) + 1.5); if (SUELO_REJ) SUELO_REJ.visible = f > 0.5; }

  // ——— bombo: jaula dorada que gira sobre un eje horizontal, patas en A, embudo arriba, rampa delante y 30 bolas ———
  const bomG = grupo(), R = BOM.R, YC = BOM.YC;
  const mOro = mat(0xe0ad45, { metalness: 0.5, roughness: 0.3, emissive: 0x6a4510, emissiveIntensity: 0.5 });
  const mOro2 = new T.MeshStandardMaterial({ color: 0xe0ad45, metalness: 0.5, roughness: 0.3, emissive: 0x6a4510, emissiveIntensity: 0.5, side: T.DoubleSide });
  const mHierro = mat(0x2a3550, { metalness: 0.3, roughness: 0.5 });
  const jaula = new T.Group(); jaula.position.set(0, YC, 0); bomG.add(jaula);
  for (let k = 0; k < 6; k++) { const r = new T.Mesh(new T.TorusGeometry(R, 0.032, 8, 72), mOro); r.rotation.x = k * PI / 6; r.castShadow = true; jaula.add(r); }
  [-0.8, -0.45, 0, 0.45, 0.8].forEach(x => { const r = new T.Mesh(new T.TorusGeometry(Math.sqrt(R * R - x * x), 0.024, 8, 60), mOro); r.rotation.y = PI / 2; r.position.x = x; r.castShadow = true; jaula.add(r); });
  [-1, 1].forEach(sx => { const c = new T.Mesh(new T.CylinderGeometry(0.17, 0.17, 0.09, 24), mOro); c.rotation.z = PI / 2; c.position.x = sx * R; jaula.add(c); });
  pieza(bomG, new T.CylinderGeometry(0.05, 0.05, 2.95, 12), mHierro, 0, YC, 0).rotation.z = PI / 2;
  const LP = Math.hypot(0.75, YC);
  [-1, 1].forEach(sx => [-1, 1].forEach(sz => { pieza(bomG, new T.CylinderGeometry(0.05, 0.068, LP, 10), mOro, sx * 1.38, YC / 2, sz * 0.375).rotation.x = -sz * Math.asin(0.75 / LP); }));
  pieza(bomG, new T.BoxGeometry(3.3, 0.1, 1.8), mHierro, 0, 0.05, 0);
  pieza(bomG, new T.CylinderGeometry(0.44, 0.17, 0.36, 28, 1, true), mOro2, 0, YC + R + 0.13, 0);
  pieza(bomG, new T.TorusGeometry(0.44, 0.05, 10, 40), mOro, 0, YC + R + 0.31, 0).rotation.x = PI / 2;
  const rampa = new T.Group(); bomG.add(rampa);
  const RL = Math.hypot(BOM.A[1] - BOM.B[1], BOM.B[2] - BOM.A[2]);
  rampa.position.set(0, (BOM.A[1] + BOM.B[1]) / 2 - 0.03, (BOM.A[2] + BOM.B[2]) / 2); rampa.rotation.x = BOM.RANG;
  pieza(rampa, new T.BoxGeometry(0.8, 0.05, RL), mOro, 0, 0, 0);
  [-1, 1].forEach(sx => pieza(rampa, new T.BoxGeometry(0.04, 0.13, RL), mOro, sx * 0.4, 0.06, 0));
  const mBola = new T.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3, emissive: 0xffffff, emissiveIntensity: 0.14 });
  const geoBola = new T.SphereGeometry(0.1, 14, 10);
  const bolas = Array.from({ length: 30 }, () => { const b = new T.Mesh(geoBola, mBola); b.castShadow = true; bomG.add(b); return b; });
  const bolaSuelta = new T.Mesh(geoBola, mBola); bolaSuelta.castShadow = true; bomG.add(bolaSuelta);
  const flash = new T.Sprite(new T.SpriteMaterial({ map: haloTx, color: 0xfff3d6, blending: T.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0 }));
  flash.position.set(0, YC + R + 0.1, 0); flash.scale.setScalar(4); bomG.add(flash);
  const luzF = new T.PointLight(0xffe2a8, 0, 10, 1.6); luzF.position.set(0, YC + R + 0.4, 0.7); bomG.add(luzF);
  // o = { t, vel, sacude (0..1), flash (0..1), bola: [x, y, z] (la bola que sale) }
  function bombo(o) {
    bomG.visible = true; bomG.position.set(o.x || 0, 0, o.z || 0);
    const t = o.t, sac = o.sacude || 0;
    jaula.rotation.x = t * (o.vel == null ? 3.4 : o.vel);
    jaula.scale.setScalar(1 + 0.06 * sac); jaula.position.y = YC + 0.05 * sac * Math.sin(t * 55);
    bolas.forEach((b, j) => {
      const fa = 4.6 + (j * 0.37) % 2.9, fb = 5.9 + (j * 0.53) % 3.1, fc = 5.1 + (j * 0.71) % 2.7;
      const x = Math.sin(t * fa + j * 1.3), y = -0.32 + 0.72 * Math.sin(t * fb + j * 2.1) + 0.9 * sac * Math.abs(Math.sin(j * 1.7)), z = Math.sin(t * fc + j * 0.7);
      const n = Math.hypot(x, y, z), rm = R - 0.16, k = n > 1 ? rm / n : rm;
      b.position.set(x * k * 0.92, YC + y * k, z * k);
    });
    flash.material.opacity = 0.95 * (o.flash || 0); luzF.intensity = 8 * (o.flash || 0);
    bolaSuelta.visible = !!o.bola; if (o.bola) bolaSuelta.position.set(o.bola[0], o.bola[1], o.bola[2]);
  }

  // ——— cinta que sube los billetes de 20 hasta la boca ———
  const cinG = grupo();
  const Q0 = new T.Vector3(2.6, 0.55, -3.5), Q1 = new T.Vector3(0.14, 3.5, -0.34);
  const banda = new T.Mesh(new T.BoxGeometry(0.82, 0.1, Q0.distanceTo(Q1)), mat(0x1b2438, { roughness: 0.7 }));
  banda.position.copy(Q0).add(Q1).multiplyScalar(0.5); banda.position.y -= 0.07; banda.lookAt(Q1.x, Q1.y - 0.07, Q1.z); banda.castShadow = true; cinG.add(banda);
  [-1, 1].forEach(sx => { const r = new T.Mesh(new T.BoxGeometry(0.05, 0.12, Q0.distanceTo(Q1)), mat(0x64748b)); r.position.set(sx * 0.43, 0.08, 0); banda.add(r); });
  [0.18, 0.62].forEach(u => { const p = Q0.clone().lerp(Q1, u); pieza(cinG, new T.CylinderGeometry(0.05, 0.05, p.y, 10), mHierro, p.x, p.y / 2 - 0.06, p.z); });
  const NQ = new T.Vector3(0, 1, 0).applyQuaternion(banda.quaternion);
  const qCinta = banda.quaternion.clone().multiply(new T.Quaternion().setFromAxisAngle(new T.Vector3(1, 0, 0), -PI / 2));
  function cinta() { cinG.visible = true; }
  const enCinta = (u) => { const p = Q0.clone().lerp(Q1, u).addScaledVector(NQ, 0.02); return [p.x, p.y, p.z]; };

  // ——— billetes genéricos (no imitan el diseño del euro): plano con la cifra grande ———
  const TXB = {};
  const DEF_B = {
    '20': { bg: '#eef2f7', fg: '#0f172a', txt: '20 €', borde: '#94a3b8', op: 1 },
    '20r': { bg: '#ef4444', fg: '#ffffff', txt: '20 €', borde: 'rgba(255,255,255,.8)', op: 1 },
    '14': { bg: 'rgba(245,185,74,.88)', fg: '#1a1205', txt: '14 €', borde: 'rgba(255,255,255,.9)', media: true, op: 0.86 },
    '13': { bg: 'rgba(245,185,74,.92)', fg: '#1a1205', txt: '13 €', borde: 'rgba(255,255,255,.9)', media: true, op: 0.92 },
    '13p': { bg: 'rgba(245,185,74,.95)', fg: '#1a1205', txt: '13 €', borde: 'rgba(255,255,255,.9)', ancho: 0.65, op: 1 },
    '13o': { bg: 'rgba(71,85,105,.55)', fg: 'rgba(203,213,225,.55)', txt: '13 €', borde: 'rgba(148,163,184,.5)', ancho: 0.65, op: 1 },
    '7p': { bg: '#ef4444', fg: '#ffffff', txt: '7 €', borde: 'rgba(255,255,255,.85)', ancho: 0.35, op: 1 }
  };
  function pintaBillete(tipo) {
    const d = DEF_B[tipo], an = d.ancho || 1, w = Math.round(512 * an), h = 256;
    const L = lienzo(w, h, (x) => {
      x.clearRect(0, 0, w, h); x.fillStyle = d.bg; x.beginPath(); x.roundRect(4, 4, w - 8, h - 8, 22); x.fill();
      x.strokeStyle = d.borde; x.lineWidth = 7; x.beginPath(); x.roundRect(18, 18, w - 36, h - 36, 14); x.stroke();
      x.fillStyle = d.fg; x.textAlign = 'center'; x.textBaseline = 'middle';
      let fs = 150; x.font = '900 ' + fs + 'px Inter, sans-serif'; const mw = x.measureText(d.txt).width; if (mw > w - 70) { fs = Math.floor(fs * (w - 70) / mw); x.font = '900 ' + fs + 'px Inter, sans-serif'; }
      x.fillText(d.txt, w / 2, h / 2 + (d.media ? 22 : 6));
      if (d.media) { x.fillStyle = '#1a1205'; x.beginPath(); x.roundRect(30, 28, 190, 54, 27); x.fill(); x.fillStyle = '#f5b94a'; x.font = '800 38px DejaVu Sans Mono, monospace'; x.fillText('MEDIA', 125, 57); }
    });
    return { tx: L.tx, op: d.op, ax: an };
  }
  const geoBil = new T.PlaneGeometry(1, 0.5);
  const billetes = Array.from({ length: 18 }, () => { const m = new T.Mesh(geoBil, new T.MeshBasicMaterial({ transparent: true, side: T.DoubleSide, toneMapped: false })); m.castShadow = true; m.visible = false; m.rotation.order = 'YXZ'; S.add(m); return m; });
  // o = { tipo, x, y, z, esc, op, color } + orientación: q (cuaternión) | mira [x,y,z] (+ giro, inclina) | rx, ry, rz (orden YXZ)
  function billete(i, o) {
    const m = billetes[i], op = o.op == null ? 1 : o.op; m.visible = op > 0.01; if (!m.visible) return m;
    const tx = TXB[o.tipo] || (TXB[o.tipo] = pintaBillete(o.tipo)); if (m.material.map !== tx.tx) { m.material.map = tx.tx; m.material.needsUpdate = true; }
    m.material.opacity = op * tx.op; m.material.depthWrite = m.material.opacity > 0.99; m.material.color.copy(W.color(o.color == null ? 0xffffff : o.color));
    m.position.set(o.x, o.y, o.z);
    if (o.q) m.quaternion.copy(o.q);
    else if (o.mira) { m.rotation.set(0, 0, 0); m.lookAt(o.mira[0], o.mira[1], o.mira[2]); if (o.giro) m.rotateZ(o.giro); if (o.inclina) m.rotateX(o.inclina); if (o.vuelta) m.rotateY(o.vuelta); }
    else m.rotation.set(o.rx || 0, o.ry || 0, o.rz || 0);
    const e = Math.max(0.001, o.esc || 1); m.scale.set(e * tx.ax, e, 1);
    return m;
  }

  // ——— placas rojas de 1 € (lo que se va) ———
  const plTx = lienzo(128, 76, (x, w, h) => { x.fillStyle = '#ef4444'; x.fillRect(0, 0, w, h); x.fillStyle = '#fff'; x.font = '900 44px Inter, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('1 €', w / 2, h / 2 + 2); }).tx;
  const mPl = mat(0xef4444, { emissive: 0xef4444, emissiveIntensity: 0.55, roughness: 0.4 }), mPlT = new T.MeshStandardMaterial({ map: plTx, emissive: 0xffffff, emissiveMap: plTx, emissiveIntensity: 0.5, roughness: 0.45 });
  const geoPl = new T.BoxGeometry(0.24, 0.142, 0.03);
  const placas = Array.from({ length: 48 }, () => { const m = new T.Mesh(geoPl, [mPl, mPl, mPl, mPl, mPlT, mPlT]); m.castShadow = true; m.visible = false; S.add(m); return m; });
  function placa(i, o) { const m = placas[i]; m.visible = true; m.position.set(o.x, o.y, o.z); m.rotation.set(o.rx || 0, o.ry || 0, o.rz || 0); m.scale.setScalar(o.esc || 1); }

  // ——— fichas (1 ficha = 1 €) ———
  const geoFi = new T.CylinderGeometry(0.26, 0.26, 0.085, 36);
  const fichas = Array.from({ length: 64 }, () => { const m = new T.Mesh(geoFi, mat(BLANCOH, { roughness: 0.38, transparent: true })); m.castShadow = true; m.receiveShadow = true; m.visible = false; S.add(m); return m; });
  // o = { x, y, z, color, color2, cq, brillo, esc, alto, op, rx, rz }
  function ficha(i, o) {
    const m = fichas[i], op = o.op == null ? 1 : o.op; m.visible = op > 0.01; if (!m.visible) return;
    m.position.set(o.x, o.y, o.z); m.rotation.set(o.rx || 0, 0, o.rz || 0); const e = o.esc || 1; m.scale.set(e, e * (o.alto || 1), e);
    const c = m.material.color.copy(W.color(o.color == null ? BLANCOH : o.color)); if (o.color2 != null) c.lerp(W.color(o.color2), o.cq || 0);
    m.material.emissive.copy(c).multiplyScalar(o.brillo == null ? 0.12 : o.brillo); m.material.opacity = op; m.material.depthWrite = op > 0.99;
  }

  // ——— desagüe del suelo ———
  const desG = grupo();
  pieza(desG, new T.CircleGeometry(0.6, 40), new T.MeshBasicMaterial({ color: 0x010205 }), 0, 0.012, 0).rotation.x = -PI / 2;
  pieza(desG, new T.TorusGeometry(0.6, 0.05, 10, 48), mat(ROJOH, { emissive: ROJOH, emissiveIntensity: 0.65 }), 0, 0.02, 0).rotation.x = PI / 2;
  function desague(o) { desG.visible = true; desG.position.set(o.x, 0, o.z); desG.scale.setScalar(Math.max(0.001, o.esc == null ? 1 : o.esc)); }

  // ——— columna del premio de 400.000 € (alto HC = 400.000): tramo exento hasta el 10 % y lámina del 20 % del exceso ———
  const colG = grupo(), HC = 3.4, WC = 1.25, DC = 0.3, YEX = HC * 0.1, LAM = (HC - YEX) * 0.2;
  const mCol = mat(0xe8edf4, { roughness: 0.45, emissive: 0xffffff, emissiveIntensity: 0.05 }), mLam = mat(0xe8edf4, { roughness: 0.45 });
  const cBase = pieza(colG, new T.BoxGeometry(WC, 1, DC), mCol, 0, 0, 0), cMed = pieza(colG, new T.BoxGeometry(WC, 1, DC), mCol, 0, 0, 0), cLam = pieza(colG, new T.BoxGeometry(WC, 1, DC), mLam, 0, 0, 0);
  const lineaC = pieza(colG, new T.BoxGeometry(WC + 0.4, 0.05, DC + 0.22), mat(AMBH, { emissive: AMBH, emissiveIntensity: 0.9 }), 0, YEX, 0);
  function columna(o) {
    colG.visible = true; colG.position.set(o.x || 0, 0, o.z || 0); colG.rotation.y = o.rot || 0;
    const h = Math.max(0.001, o.crece == null ? 1 : o.crece) * HC, yb = Math.min(h, YEX), ym = Math.max(0, Math.min(h, HC - LAM) - YEX), yl = Math.max(0, h - (HC - LAM));
    cBase.scale.y = Math.max(yb, 0.001); cBase.position.y = yb / 2;
    cMed.visible = ym > 0.001; cMed.scale.y = Math.max(ym, 0.001); cMed.position.y = YEX + ym / 2;
    const sep = o.separa || 0, roj = o.roja || 0;
    cLam.visible = yl > 0.001; cLam.scale.y = Math.max(yl, 0.001); cLam.position.set(sep * 0.95, HC - LAM + yl / 2 + sep * 0.12, sep * 0.45); cLam.rotation.z = -sep * 0.22;
    mLam.color.set(0xe8edf4).lerp(W.color(ROJOH), roj); mLam.emissive.set(0x000000).lerp(W.color(ROJOH), 0.55 * roj);
    lineaC.visible = (o.linea || 0) > 0.01; lineaC.scale.x = Math.max(0.001, o.linea || 0);
    return { HC, YEX, LAM, WC };
  }

  // ——— contador del suelo «20 → 14» con los dígitos que ruedan ———
  const conG = grupo(), cont = lienzo(1024, 448);
  const conM = new T.Mesh(new T.PlaneGeometry(3.0, 1.3125), new T.MeshBasicMaterial({ map: cont.tx, transparent: true, depthWrite: false, toneMapped: false }));
  conM.rotation.x = -PI / 2; conG.add(conM);
  function contador(o) {
    conG.visible = true; conG.position.set(o.x, 0.025, o.z); conG.rotation.y = o.rot || 0; conG.scale.setScalar(Math.max(0.001, o.esc == null ? 1 : o.esc));
    conM.material.opacity = o.op == null ? 1 : o.op;
    const v = Math.max(14, Math.min(20, o.v)), ta = Math.round((o.tach || 0) * 20) / 20, cl = v.toFixed(3) + '|' + ta;
    if (cl === cont.clave) return; cont.clave = cl;
    const x = cont.x, w = 1024, h = 448;
    x.clearRect(0, 0, w, h); x.fillStyle = 'rgba(9,14,27,.9)'; x.beginPath(); x.roundRect(8, 8, w - 16, h - 16, 48); x.fill(); x.strokeStyle = '#f5b94a'; x.lineWidth = 12; x.stroke();
    x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = '900 230px Inter, sans-serif'; x.fillStyle = '#cbd5e1'; x.fillText('20', 215, 232);
    if (ta > 0) { x.strokeStyle = '#f87171'; x.lineWidth = 22; x.lineCap = 'round'; x.beginPath(); x.moveTo(85, 300); x.lineTo(85 + 260 * ta, 300 - 150 * ta); x.stroke(); }
    x.fillStyle = '#94a3b8'; x.font = '900 150px Inter, sans-serif'; x.fillText('→', 450, 226);
    const n0 = Math.ceil(v - 1e-6), fr = n0 - v;
    x.save(); x.beginPath(); x.rect(545, 50, 440, 320); x.clip(); x.font = '900 230px Inter, sans-serif'; x.fillStyle = '#f5b94a';
    x.fillText(String(n0), 765, 232 + fr * 250); if (fr > 0.001) x.fillText(String(n0 - 1), 765, 232 + (fr - 1) * 250); x.restore();
    x.fillStyle = '#f5b94a'; x.font = '800 44px DejaVu Sans Mono, monospace'; x.fillText('€ · MEDIA', 765, 392);
    cont.tx.needsUpdate = true;
  }

  // ——— campo de 100.000 puntos (400 × 250, uno cada 25 cm) con el del Gordo en ámbar en el origen ———
  const campoG = grupo(), NXC = 400, NZC = 250, PC = 0.25, OJO = [233, 141]; let campoHecho = false;
  const haloA = new T.Sprite(new T.SpriteMaterial({ map: haloTx, color: 0xffc35a, blending: T.AdditiveBlending, depthWrite: false, transparent: true, fog: false })); haloA.position.y = 0.12; campoG.add(haloA);
  const puntoA = new T.Mesh(new T.CircleGeometry(0.09, 20), new T.MeshBasicMaterial({ color: 0xffc35a, toneMapped: false, fog: false })); puntoA.rotation.x = -PI / 2; puntoA.position.y = 0.02; campoG.add(puntoA);
  function campo(o) {
    if (!campoHecho) {
      campoHecho = true;
      const L = lienzo(4000, 2500, (x) => { x.fillStyle = 'rgba(226,232,240,.95)'; for (let i = 0; i < NXC; i++) for (let j = 0; j < NZC; j++) if (i !== OJO[0] || j !== OJO[1]) x.fillRect(i * 10 + 3, j * 10 + 3, 4, 4); });
      L.tx.anisotropy = 8;
      const m = new T.Mesh(new T.PlaneGeometry(NXC * PC, NZC * PC), new T.MeshBasicMaterial({ map: L.tx, transparent: true, depthWrite: false, toneMapped: false }));
      m.rotation.x = -PI / 2; m.position.set(-((OJO[0] + 0.5) / NXC - 0.5) * NXC * PC, 0.012, -((OJO[1] + 0.5) / NZC - 0.5) * NZC * PC); campoG.add(m);
    }
    campoG.visible = true; campoG.position.set(o.x || 0, 0, o.z || 0);
    haloA.scale.setScalar(o.halo || 1); haloA.material.opacity = o.brillo == null ? 1 : o.brillo; puntoA.material.opacity = 1;
  }

  // ——— décimos: rejilla de 100 (verticales) y los de la multitud (apaisados) ———
  const pintaDec = (w, h, fs) => lienzo(w, h, (x) => { x.fillStyle = '#f1f5f9'; x.fillRect(0, 0, w, h); x.strokeStyle = '#94a3b8'; x.lineWidth = 8; x.strokeRect(9, 9, w - 18, h - 18);
    x.fillStyle = '#0f172a'; x.font = '900 ' + fs + 'px Inter, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('20 €', w / 2, h / 2 + 3);
    x.fillStyle = '#94a3b8'; x.fillRect(28, 30, w - 56, 9); x.fillRect(28, h - 39, w - 56, 9); });
  const decTxV = pintaDec(180, 300, 62), decTxH = pintaDec(300, 180, 84);
  function hazDec(geo, L) { const m = new T.Mesh(geo, new T.MeshBasicMaterial({ map: L.tx, transparent: true, side: T.DoubleSide, toneMapped: false })); m.visible = false; m.castShadow = true; m.rotation.order = 'YXZ'; S.add(m); return m; }
  const geoDV = new T.PlaneGeometry(0.36, 0.6), geoDH = new T.PlaneGeometry(0.38, 0.23);
  const decV = Array.from({ length: 100 }, () => hazDec(geoDV, decTxV)), decH = Array.from({ length: 44 }, () => hazDec(geoDH, decTxH));
  function decimo(arr, i, o) {
    const m = arr[i], op = o.op == null ? 1 : o.op; m.visible = op > 0.01; if (!m.visible) return;
    m.position.set(o.x, o.y, o.z); m.rotation.set(o.rx == null ? -PI / 2 : o.rx, o.ry || 0, o.rz || 0); m.scale.setScalar(Math.max(0.001, o.esc || 1));
    m.material.color.copy(W.color(o.color == null ? 0xffffff : o.color)); if (o.color2 != null) m.material.color.lerp(W.color(o.color2), o.cq || 0);
    m.material.opacity = op; m.material.depthWrite = op > 0.99;
  }
  const decimoV = (i, o) => decimo(decV, i, o), decimoH = (i, o) => decimo(decH, i, o);
  // Halos dorados (los 5 décimos con premio mayor)
  const halos = Array.from({ length: 6 }, () => { const s = new T.Sprite(new T.SpriteMaterial({ map: haloTx, color: 0xffd166, blending: T.AdditiveBlending, depthWrite: false, transparent: true })); s.visible = false; S.add(s); return s; });
  function halo(i, o) { const s = halos[i]; s.visible = (o.op || 0) > 0.01; s.position.set(o.x, o.y, o.z); s.scale.setScalar(o.esc || 1); s.material.opacity = o.op || 0; }

  function apagar() { objs.forEach(g => { g.visible = false; }); [billetes, placas, fichas, decV, decH, halos].forEach(a => a.forEach(m => { m.visible = false; })); apagon(1, 0); }
  return { bombo, cinta, enCinta, qCinta, Q1: [Q1.x, Q1.y, Q1.z], billete, placa, ficha, desague, columna, contador, campo, decimoV, decimoH, halo, apagon, apagar };
})();
W3.X = X3;

// ——— brazos y manos de un maniquí. qa: 0 = como los pone andar(), 1 = pose; qp: 0 = brazos arriba (atrapar), 1 = sujetar al pecho ———
function brazos(a, qa, qp) {
  const ax = -2.75 * (1 - qp) - 0.95 * qp, az = -0.1 * (1 - qp) - 0.2 * qp, cx = -0.15 * (1 - qp) - 1.15 * qp;   // az < 0: manos en los bordes del billete
  [[a.izq, -1], [a.der, 1]].forEach(([b, sg]) => {
    b.hombro.rotation.x = lerp(b.hombro.rotation.x, ax, qa); b.hombro.rotation.z = lerp(b.hombro.rotation.z, sg * az, qa); b.codo.rotation.x = lerp(b.codo.rotation.x, cx, qa);
  });
}
// Punto de las manos en el mundo (maniquí en hx, hz girado g, escala esc, elevado y).
function manos(hx, hz, g, qp, esc, y) { const ly = (2.2 * (1 - qp) + 1.5 * qp) * (esc || 1.06) / 1.06, lz = (0.3 * (1 - qp) + 0.62 * qp) * (esc || 1.06) / 1.06; return [hx + Math.sin(g) * lz, ly + (y || 0), hz + Math.cos(g) * lz]; }

// ——— el gancho: escena 0 y cola del bucle. tau = tiempo de la escena 0 (negativo en la cola: el billete viene de más arriba) ———
const G0 = { TE: 0.48, TA: 0.58, TB: 0.72, TL1: 0.98, TL2: 1.38, TC: 1.8, HX: 2.3, HZ: 4.0, L1: [0.95, 0.03, 3.45], L2: [1.72, 0.03, 3.92], SAL: [-1.95, 0.03, 2.95] };
function billete20(tau) { const d = G0.TE - tau, M = BOM.M; return [M[0] - 1.25 * d, M[1] + 2.3 * d + 1.6 * d * d, M[2] + 1.5 * d]; }
// Placa roja i de un grupo de 6 que sale despedida por la boca d segundos después de entrar el billete.
// frente: salen por delante de la jaula hacia la cámara y caen al suelo (las del billete del héroe); si no, por la boca, hacia atrás.
function placaVuela(X, idx, i, d, esc, frente) {
  if (d < 0) return;
  const M = BOM.M, O = frente ? [0, 1.45, 0.95] : [M[0], M[1] + 0.15, M[2]];
  const vx = frente ? [-2.1, -1.2, -0.45, 0.45, 1.2, 2.1][i] : (i - 2.5) * 0.62, vy = frente ? 2.5 + (i % 3) * 0.45 : 5.4 + (i % 3) * 0.75, vz = frente ? 1.7 + (i % 2) * 0.9 : -(0.55 + (i % 2) * 0.65);
  const g = frente ? 4.9 : 4.4, p = [O[0] + vx * d, O[1] + vy * d - g * d * d, O[2] + vz * d];
  if (p[1] <= 0.016) {
    if (!frente) return;
    const dl = (vy + Math.sqrt(vy * vy + 4 * g * (O[1] - 0.016))) / (2 * g), r = Math.max(0, 1 - (d - dl) * 3);   // en el suelo: patina un poco y se queda
    X.placa(idx, { x: O[0] + vx * (dl + 0.12 * (1 - r * r)), y: 0.016, z: O[2] + vz * (dl + 0.12 * (1 - r * r)), rx: PI / 2, ry: i * 0.9, rz: 0, esc });
    return;
  }
  X.placa(idx, { x: p[0], y: p[1], z: p[2], rx: d * (5 + i), ry: d * 2.2, rz: d * (3 + i * 0.7), esc });
}
// Billetes de la cinta: uno cada PER s desde t0; n huecos (un billete por hueco a la vez). Índices: ib (20), ib14 (14), ip (placas).
function cintaBilletes(X, tau, t0, ib, ib14, ip, n) {
  const PER = 0.42, VIDA = 2.05, E = 0.62, B = BOM.B, A = BOM.A;
  for (let j = 0; j < n; j++) {
    const k = Math.floor((tau - t0 - j * PER) / (n * PER)); if (k < 0) continue;
    const s0 = t0 + (k * n + j) * PER, d = tau - s0; if (d > VIDA) continue;
    if (d < 0.85) { const p = X.enCinta(d / 0.85); X.billete(ib + j, { tipo: '20', x: p[0], y: p[1], z: p[2], q: X.qCinta, esc: E }); }
    else if (d < 0.97) { const u = (d - 0.85) / 0.12, p = mezcla(X.Q1, [BOM.M[0], BOM.M[1] - 0.35, BOM.M[2]], u); X.billete(ib + j, { tipo: '20', x: p[0], y: p[1], z: p[2], q: X.qCinta, esc: E * (1 - 0.5 * u) }); }
    if (d > 0.95) for (let i = 0; i < 6; i++) placaVuela(X, ip + j * 6 + i, i, d - 0.95, 0.72, false);
    if (d > 1.0) {
      let p, rx = -PI / 2 + BOM.RANG, ry = 0, op = 1;
      if (d < 1.12) { const u = (d - 1.0) / 0.12; p = mezcla(A, B, u); p[1] += 0.04; }
      else { const u = sale(tramo(d, 1.12, 1.75)); p = mezcla(B, G0.SAL, u); p[1] += 0.5 * Math.sin(Math.min(1, u * 1.6) * PI); rx = -PI / 2 + BOM.RANG * (1 - u); ry = -1.6 * u; op = 1 - tramo(d, 1.75, 2.05); }
      X.billete(ib14 + j, { tipo: '14', x: p[0], y: p[1], z: p[2], rx, ry, esc: E * 0.7, op });
    }
  }
}
// El billete de 14 del héroe: rampa, vuelo, patinazo, salta y lo atrapa. hp = pose del héroe (para las manos).
function billete14(tau, hp) {
  const A = BOM.A, B = BOM.B, L1 = G0.L1, L2 = G0.L2;
  if (tau < G0.TA) return null;
  if (tau < G0.TB) { const u = Math.pow(tramo(tau, G0.TA, G0.TB), 1.3), p = mezcla(A, B, u); p[1] += 0.04; return { p, rx: -PI / 2 + BOM.RANG, ry: 0, rz: 0.3 * u }; }
  if (tau < G0.TL1) { const u = tramo(tau, G0.TB, G0.TL1), p = mezcla(B, L1, u); p[1] += 0.8 * Math.sin(u * PI); return { p, rx: -PI / 2 + BOM.RANG * (1 - u) + 0.45 * Math.sin(u * PI), ry: 0.35 * u, rz: 0.25 * Math.sin(u * 2 * PI) }; }
  if (tau < G0.TL2) { const u = sale(tramo(tau, G0.TL1, G0.TL2)); return { p: mezcla(L1, L2, u), rx: -PI / 2, ry: 0.35 - 0.6 * u, rz: 0.12 * Math.sin(u * 9) * (1 - u) }; }
  const HB = manos(G0.HX, G0.HZ, -PI / 2, 0, 1.06, 0);
  if (tau < G0.TC) { const u = tramo(tau, G0.TL2, G0.TC), e = suave(u), p = mezcla(L2, HB, e); p[1] += 0.55 * Math.sin(u * PI); return { p, rx: lerp(-PI / 2, -0.15, e), ry: angulo(-0.25, -PI / 2, e), rz: 0.3 * Math.sin(u * PI) }; }
  return { p: manos(hp.hx, hp.hz, hp.g, hp.qp, 1.06, hp.y), rx: lerp(-0.15, -0.5, hp.qp), ry: hp.g, rz: 0 };
}
function heroeGancho(W, tau) {
  if (tau < 1.1) return null;
  let hx, hz, g, amp = 0;
  if (tau < 1.72) { const u = tramo(tau, 1.1, 1.72); hx = 6.4 - (6.4 - G0.HX) * (1 - Math.pow(1 - u, 1.7)); hz = G0.HZ + 0.15 * (1 - u); g = -PI / 2; amp = 1; }
  else { hx = G0.HX; hz = G0.HZ; g = angulo(-PI / 2, 0.42, suave(tramo(tau, 1.95, 2.75))); amp = Math.max(0, 1 - (tau - 1.72) / 0.14); }
  const y = tau > 1.8 && tau < 2.3 ? 0.08 * Math.sin((tau - 1.8) / 0.5 * PI) : 0;
  W.heroe({ x: hx, z: hz, y, gira: g, amp, fase: tau * 15 });
  const qa = suave(tramo(tau, 1.56, 1.8)), qp = suave(tramo(tau, 2.35, 2.85));
  brazos(W.H, qa, qp);
  return { hx, hz, g, y, qa, qp };
}
function gancho(W, X, tau, m0v, m1) {
  const m0 = Math.max(m0v, 2.95), M = BOM.M, cam = (P, L) => W.camara(P[0], P[1], P[2], L[0], L[1], L[2]);
  const ue = tramo(tau, G0.TE, G0.TE + 0.45), sac = ue > 0 && ue < 1 ? Math.sin(ue * PI) * (1 - ue) * 2.2 : 0;
  const fl = tau >= G0.TE - 0.02 && tau < G0.TE + 0.7 ? Math.exp(-Math.max(0, tau - G0.TE) * 8) : 0;
  let bola = null;
  if (tau > m0 + 0.15) { const u = tramo(tau, m0 + 0.15, m0 + 1.35); const v = Math.min(1, u * 1.5), w = Math.max(0, u * 1.5 - 1) / 0.5; bola = w <= 0 ? mezcla(BOM.A, BOM.B, v) : mezcla(BOM.B, [0.5, 0.0, 3.6], w); bola[1] += 0.1; }
  X.bombo({ t: tau + 3, sacude: sac, flash: fl, bola }); X.cinta();
  cintaBilletes(X, tau, 1.05, 2, 8, 6, 6);
  const hp = heroeGancho(W, tau);
  // cámara
  const b20 = billete20(tau), b14 = billete14(tau, hp);
  let P, L;
  if (tau < G0.TE) { const dd = 4.1 - 1.5 * tramo(tau, -0.6, G0.TE); L = mezcla(b20, M, 0.22); L[1] -= 0.15; P = [L[0] + dd * 0.16, L[1] + dd * 0.56, L[2] + dd * 0.81]; }
  else if (tau < 1.0) {
    const PE = [M[0] + 2.6 * 0.16, M[1] - 0.15 + 2.6 * 0.56, M[2] + 2.6 * 0.81], u = suave(tramo(tau, G0.TE, 0.68)), v = tramo(tau, 0.68, 1.0);
    P = mezcla(mezcla(PE, [1.45, 1.35, 5.2], u), [1.25, 1.18, 4.8], v); L = mezcla(mezcla([M[0], M[1] - 0.15, M[2]], [0, 0.95, 2.0], u), [0.25, 0.8, 2.25], v);
    const sh = tau > 0.71 ? 0.08 * Math.exp(-(tau - 0.71) * 9) : 0; P = [P[0] + sh * Math.sin(tau * 83), P[1] + sh * Math.cos(tau * 71), P[2]];
  } else if (tau < 1.48) { const bp = b14 ? b14.p : G0.L2, u = tramo(tau, 1.0, 1.48), a = -0.95 + 1.7 * u, r = 2.2 - 0.3 * u; P = [bp[0] + r * Math.sin(a), 1.7 - 0.55 * u, bp[2] + r * Math.cos(a)]; L = [bp[0], 0.1 + 0.8 * bp[1], bp[2] - 0.25]; }
  else if (tau < 2.0) { const u = suave(tramo(tau, 1.48, 2.0)), a = 0.22 - 0.8 * u; P = [G0.HX + 3.5 * Math.sin(a), 1.4 + 0.4 * u, G0.HZ + 3.5 * Math.cos(a)]; L = [G0.HX - 0.25, 1.55 + 0.15 * u, G0.HZ]; }
  else if (tau < m0) {
    const E0 = [G0.HX + 3.5 * Math.sin(-0.58), 1.8, G0.HZ + 3.5 * Math.cos(-0.58)], LE = [G0.HX - 0.25, 1.7, G0.HZ];
    const u = suave(tramo(tau, 2.0, 2.5)), v = sale(tramo(tau, 2.5, Math.max(3.0, m0)));
    P = mezcla(mezcla(E0, [3.6, 4.0, 10.0], u), [1.2, 6.4, 9.6], v); L = mezcla(mezcla(LE, [0.9, 1.55, 1.6], u), [0.4, 0.0, 4.6], v);
  } else if (tau < m1) {
    const u = suave(tramo(tau, m0, m1)), a = 0.35 + 1.25 * u, r = 0.7 + 2.5 * u, c = mezcla([0, 0, 0.9], [G0.HX, 0, G0.HZ], u);
    P = [c[0] + r * Math.sin(a), 11.2 - 6.2 * u, c[2] + r * Math.cos(a)]; L = [c[0], 0.6, c[2]];
  } else {
    const bp = b14.p, g = hp.g, rx = -0.5, n = [Math.cos(rx) * Math.sin(g), -Math.sin(rx), Math.cos(rx) * Math.cos(g)], la = [Math.cos(g), 0, -Math.sin(g)];
    const u = tramo(tau, m1, m1 + 1.5), lat = -0.28 + 0.56 * u, d = 1.45 - 0.2 * u;
    P = [bp[0] + n[0] * d + la[0] * lat, bp[1] + n[1] * d + la[1] * lat, bp[2] + n[2] * d + la[2] * lat]; L = [bp[0] + la[0] * lat * 0.3, bp[1], bp[2] + la[2] * lat * 0.3];
  }
  cam(P, L);
  // billetes del héroe
  if (tau < G0.TE + 0.09) { const u = tramo(tau, G0.TE, G0.TE + 0.09), p = tau < G0.TE ? b20 : [M[0], M[1] - 0.4 * u, M[2]];
    X.billete(0, { tipo: '20', x: p[0], y: p[1], z: p[2], mira: P, giro: -0.2 + 0.45 * Math.sin(3.5 * tau + 0.6), inclina: 0.4 * Math.sin(4.2 * tau), vuelta: 0.5 * Math.sin(5 * tau + 0.3), esc: 1 - 0.6 * u }); }
  if (b14) X.billete(1, { tipo: '14', x: b14.p[0], y: b14.p[1], z: b14.p[2], rx: b14.rx, ry: b14.ry, rz: b14.rz, esc: 0.7 });
  for (let i = 0; i < 6; i++) placaVuela(X, i, i, tau - 0.62, 1.5, true);
  // contador del suelo: entra a los 2,28 s, rueda de 20 a 14 entre 2,3 y 2,55 s y el 14 se queda quieto 0,4 s antes del corte
  // a la cenital (2,95 s), para que el último número que se lee entero sea el 14.
  if (tau > 2.28 && tau < m1) { const u = tramo(tau, 2.3, 2.55); X.contador({ x: 0.35, z: 4.45, v: 20 - 6 * (1 - (1 - u) * (1 - u)), tach: sale(tramo(tau, 2.34, 2.5)), esc: rebote(tramo(tau, 2.28, 2.48)) }); }
}
`;

// Capa 2D: rótulos de 2–4 palabras en el tercio central-bajo (y ≈ 1.290 px), una nota pequeña abajo a la izquierda.
const nota = (txt, cls = '') => `<div class="nota ${cls}">${txt}</div>`;
const ESCENAS = [
  // 0 · Gancho: «PAGAS 20 €» ya puesto; a los 0,7 s, «VALOR MEDIO: 14 €»; en «vale 14», «14 € DE MEDIA».
  { html: () => `<div class="rt" data-t="translateX(-50%)" style="top:1395px">PAGAS 20 €</div>
      <div class="rt amb" data-t="translateX(-50%)" style="top:1395px">VALOR MEDIO: <span class="a">14 €</span></div>
      <div class="rt amb" data-t="translateX(-50%)" style="top:1395px"><span class="a">14 €</span> DE MEDIA</div>`,
    anim: function (s, e, el) { const M = e.seg[0].marcas, m1 = M[1] != null ? M[1] : 4.5, r = el.querySelectorAll('.rt');
      ver(r[0], s, -1, 0.7); ver(r[1], s, 0.7, m1 - 0.05); ver(r[2], s, m1); } },
  // 1 · Es la media: 20 fichas, 14 se quedan (ámbar) y 6 se van por el desagüe; «70 % A PREMIOS» y «DE MEDIA: 14 € DE 20».
  { html: () => `<div class="rt amb" data-t="translateX(-50%)"><span class="a">70 %</span> A PREMIOS</div>
      <div class="rt amb p" data-t="translateX(-50%)">DE MEDIA: <span class="a">14 €</span> DE 20</div>
      ${nota('Sorteo de Navidad 2026 · SELAE: el 70 % de lo que<br>se vende va a premios')}`,
    anim: function (s, e, el) { const r = el.querySelectorAll('.rt'), g = e.seg[0], t70 = g.res[0] ? g.res[0].ini : 2.3;
      ver(r[0], s, t70, t70 + 1.25); ver(r[1], s, t70 + 1.25); ver(el.querySelector('.nota'), s, t70); } },
  // 2 · Impuesto: columna de 400.000, línea de 40.000 y lámina roja del 20 % del exceso; luego 14 → 13.
  { html: () => `<div class="rt roja" data-t="translateX(-50%)"><span class="r">20 %</span> DEL EXCESO</div>
      <div class="rt amb" data-t="translateX(-50%)">≈ <span class="a">13 €</span> DE MEDIA</div>
      ${nota('Ley 35/2006 (IRPF), disp. adicional 33.ª:<br>20 % de lo que pasa de 40.000 € por décimo')}`,
    anim: function (s, e, el) { const M = e.seg[0].marcas, m0 = M[0] != null ? M[0] : 0.9, m1 = M[1] != null ? M[1] : 2.4, m2 = M[2] != null ? M[2] : 3.6, r = el.querySelectorAll('.rt');
      const t13 = e.seg[0].res[0] ? e.seg[0].res[0].ini : m2 + 0.8; ver(r[0], s, m1, m2); ver(r[1], s, t13); ver(el.querySelector('.nota'), s, m0); } },
  // 3 · La pregunta: la multitud se gira a la vez con su décimo.
  { html: () => `<div class="rt roja" data-t="translateX(-50%)">¿NI UN <span class="r">EURO</span>?</div>`,
    anim: function (s, e, el) { const g = e.seg[0], t = g.res[0] ? g.res[0].ini : 1.2; ver(el.querySelector('.rt'), s, t); } },
  // 4 · Se amontonan en unos pocos; apagón con la torre del Gordo; campo de 100.000 puntos.
  { html: () => `<div class="rt amb" data-t="translateX(-50%)">EN UNOS POCOS</div>
      <div class="rt amb" data-t="translateX(-50%)">1 DE CADA <span class="a">100.000</span></div>`,
    anim: function (s, e, el) { const M = e.seg[0].marcas, m0 = M[0] != null ? M[0] : 1.9, m1 = M[1] != null ? M[1] : 3.3, g = e.seg[0], r = el.querySelectorAll('.rt');
      const t1 = g.res[1] ? g.res[1].ini : (M[2] != null ? M[2] : 4.6) + 0.5; ver(r[0], s, m0, m1); ver(r[1], s, t1); } },
  // 5 · El dato: rejilla de 100 décimos → 86 en rojo, 9 reintegro (ámbar, vuelan al maniquí), 5 más (dorados, suben).
  { html: () => `<div class="rt roja" data-t="translateX(-50%)"><span class="r">86</span> DE 100: 0 €</div>
      <div class="rt amb p" data-t="translateX(-50%)"><span class="a">9</span> DE 100: TUS 20 €</div>
      <div class="rt amb" data-t="translateX(-50%)"><span class="a">5</span> DE 100: MÁS</div>
      ${nota('Media de 200 sorteos simulados · programa de<br>premios por serie: estructura de 2025')}`,
    anim: function (s, e, el) { const M = e.seg.flatMap(g => g.marcas), m0 = M[0] != null ? M[0] : 1.0, m1 = M[1] != null ? M[1] : 2.9, m3 = M[3] != null ? M[3] : 5.6, r = el.querySelectorAll('.rt');
      const g = e.seg[0], t86 = g.res[0] ? g.res[0].ini : m0 + 0.3; ver(r[0], s, t86, m1); ver(r[1], s, m1 + 0.1, m3); ver(r[2], s, m3 + 0.1); ver(el.querySelector('.nota'), s, 0.3); } },
  // 6 · Cierre: el maniquí en turquesa (la decisión es suya), 22-12, el 20 se parte en 13 + 7 y acaba entero en rojo.
  //     Cola: vuelve al encuadre del fotograma 0 con «PAGAS 20 €».
  { html: () => `<div class="cal"><small>DIC</small><b>22</b></div>
      <div class="rt turq" data-t="translateX(-50%)">HAZ LA <span class="t">CUENTA</span></div>
      <div class="rt roja p" data-t="translateX(-50%)">LA ILUSIÓN: <span class="r">7 €</span> DE MEDIA</div>
      <div class="rt roja p" data-t="translateX(-50%)">86 DE 100: CUESTA <span class="r">20 €</span></div>
      <div class="rt" data-t="translateX(-50%)" style="top:1395px">PAGAS 20 €</div>`,
    anim: function (s, e, el) { const M = e.seg.flatMap(g => g.marcas), m0 = M[0] != null ? M[0] : 1.9, m1 = M[1] != null ? M[1] : 3.6, m2 = M[2] != null ? M[2] : 6.0, m3 = M[3] != null ? M[3] : 7.4;
      const D = e.fin - e.ini, cola = D - 0.55, r = el.querySelectorAll('.rt'), g = e.seg[0], t7 = g.res[0] ? g.res[0].ini : m1 + 0.9;
      ver(el.querySelector('.cal'), s, m0, cola); ver(r[0], s, m0, m1); ver(r[1], s, t7, m2); ver(r[2], s, m3, cola); r[3].style.opacity = s >= cola ? 1 : 0; r[3].style.transform = 'translateX(-50%)'; } }
];

const TRES = function (t, k, s, e, W) {
  const X = W.X; X.apagar();
  const D = e.fin - e.ini, p = Math.min(1, s / D), M = e.seg.flatMap(g => g.marcas), res = e.seg.flatMap(g => g.res);
  const mk = (j, def) => (M[j] != null ? M[j] : def);
  const q = (a, d) => sale(tramo(s, a, a + (d || 0.45)));
  const cam = (P, L) => W.camara(P[0], P[1], P[2], L[0], L[1], L[2]);
  const fuera = { x: -60, z: -60, esc: 0 };
  const AMB = '#f5b94a', ROJO = '#f87171', BLANCO = '#e2e8f0', GRIS = '#94a3b8';
  let directo = () => fuera;
  // Multitud de las escenas 3 y 4: 41 en filas de 7 y 3 lejos, al fondo.
  const sitioM = (i) => i < 41 ? [((i % 7) - 3) * 1.08 + ((Math.floor(i / 7) % 2) ? 0.3 : -0.1), 1.6 - Math.floor(i / 7) * 1.25] : [[-2.6, -8.6], [0.4, -9.8], [3.0, -8.2]][i - 41];
  const decEnMano = (i, a, x, z, rot, op, color, color2, cq) => { const lz = 0.6 * a.esc, y = 1.42 * a.esc; X.decimoH(i, { x: x + Math.sin(rot) * lz, y, z: z + Math.cos(rot) * lz, rx: -0.4, ry: rot, op, color, color2, cq }); };

  if (k === 0) {
    gancho(W, X, s, mk(0, 2.9), mk(1, 4.5));
  } else if (k === 1) {
    // 20 fichas caen y se apilan; en «el sorteo» las 14 de abajo se encienden (ámbar) y las 6 de arriba (rojas) se van por el desagüe.
    const CX = 1.5, CZ = 2.0, DX = 2.75, DZ = 2.95, HX = 0.3, HZ = 2.55;
    const tS = Math.max(1.0, mk(0, 1.0) + 0.1), tB = 2.3;
    X.bombo({ t: t + 3 }); X.cinta(); cintaBilletes(X, t, 1.05, 2, 8, 6, 6);
    for (let i = 0; i < 20; i++) {
      const y0 = 0.0425 + i * 0.085, td = 0.03 * i, u = tramo(s, td, td + 0.24), rb = i === 0 ? 0 : 0.03 * Math.sin(tramo(s, td + 0.24, td + 0.44) * PI);
      let x = CX, y = y0 + 1.6 * (1 - u * u) + rb, z = CZ, op = 1, rx = 0;
      const cq = sale(tramo(s, tS + (i < 14 ? 0.03 * i : 0), tS + 0.3 + (i < 14 ? 0.03 * i : 0)));
      if (i >= 14) {
        const j = 19 - i, ts = tS + 0.35 + 0.09 * j, v = tramo(s, ts, ts + 0.6), w = tramo(s, ts + 0.6, ts + 0.9);
        if (v > 0) { const ev = suave(v); x = CX + (DX - CX) * ev; z = CZ + (DZ - CZ) * ev; y = y0 * (1 - ev) + 0.05 + 0.7 * Math.sin(v * PI) - 0.45 * w; rx = 2.2 * v; }
        if (w >= 1) op = 0;
        X.ficha(i, { x, y, z, rx, color: BLANCOH, color2: ROJOH, cq, brillo: 0.15 + 0.35 * cq, op });
      } else X.ficha(i, { x, y, z, color: BLANCOH, color2: AMBH, cq, brillo: 0.12 + 0.3 * cq });
    }
    X.desague({ x: DX, z: DZ, esc: q(tS, 0.3) });
    W.heroe({ x: HX, z: HZ, gira: angulo(0.25, Math.atan2(CX - HX, CZ - HZ), q(tB - 0.3, 0.6)) });
    if (s < tB) { const u = s / tB; cam(mezcla([CX + 0.9, 0.45, CZ + 3.5], [CX + 1.15, 2.25, CZ + 3.9], u), mezcla([CX - 0.05, 0.65, CZ], [CX - 0.05, 1.05, CZ], u)); }
    else { const u = suave(tramo(s, tB, D)), a = 0.62 - 1.6 * u, r = 4.7; cam([0.95 + r * Math.sin(a), 2.35, CZ + r * Math.cos(a)], [0.9, 1.05, CZ - 0.25]); }
  } else if (k === 2) {
    const m0 = mk(0, 0.9), m1 = mk(1, 2.4), m2 = mk(2, 3.6);
    if (s < m2) {
      // La columna del Gordo (400.000 € al décimo): línea de los 40.000 exentos y lámina roja del 20 % del exceso (72.000).
      const CXc = 0.35, cr = sale(tramo(s, 0.0, 0.85)), sep = suave(tramo(s, m1 + 0.25, m1 + 1.15));
      const c = X.columna({ x: CXc, z: 0, crece: cr, linea: q(m0 - 0.1, 0.35), roja: q(m1 - 0.05, 0.3), separa: sep });
      W.rotulo('c400', '400.000 €', CXc, Math.min(c.HC * cr - 0.3, 1.95), 0.3, q(0.2, 0.3), BLANCO, 0.34);
      rotuloLado(W, 'c40', '40.000 € exentos', CXc - 0.72, c.YEX, 0.3, -1, q(m0 - 0.05, 0.3), AMB, 0.24);
      W.rotulo('c72', '−72.000 €', CXc + 0.95 * sep, c.HC - c.LAM / 2 + 0.12 * sep, 0.45 * sep + 0.3, q(m1 + 0.2, 0.3), ROJO, 0.28);
      W.heroe({ x: CXc + 1.2, z: -0.45, gira: -0.5 });
      const u = suave(tramo(s, 0.1, m1 + 0.9));
      cam(mezcla([-0.6, 1.9, 9.4], [0.95, 2.3, 9.6], u), mezcla([0.3, 1.47, 0], [0.3, 1.5, 0], u));
    } else {
      // De 14 a 13: la última ficha pierde su franja roja (0,91 €) y el billete del maniquí da la vuelta y marca 13.
      const CXf = 0.6, HXh = -0.75, HZh = 0.55, gh = 0.38;
      for (let i = 0; i < 13; i++) X.ficha(i, { x: CXf, y: 0.0425 + i * 0.085 + 2.4 * Math.pow(1 - sale(tramo(s, m2 + i * 0.015, m2 + 0.28 + i * 0.015)), 2), z: 0, color: AMBH, brillo: 0.35 });
      const yT = 0.0425 + 13 * 0.085, en = 2.4 * Math.pow(1 - sale(tramo(s, m2 + 0.2, m2 + 0.48)), 2);
      X.ficha(13, { x: CXf, y: yT - 0.0425 + 0.0425 * 0.09 + en, z: 0, color: AMBH, brillo: 0.35, alto: 0.09 });
      const roj = q(m2 + 0.5, 0.3), va = suave(tramo(s, m2 + 0.85, m2 + 1.55));
      X.ficha(14, { x: CXf + 1.3 * va, y: yT + 0.0425 * 0.09 + en + 1.6 * va, z: 0.6 * va, rz: -1.2 * va, color: AMBH, color2: ROJOH, cq: roj, brillo: 0.35 + 0.3 * roj, alto: 0.91, op: 1 - tramo(s, m2 + 1.3, m2 + 1.6) });
      if (roj > 0.05) rotuloLado(W, 'm091', '−0,91 €', CXf + 0.35 + 1.3 * va, yT + 0.25 + 1.6 * va, 0.6 * va, 1, roj * (1 - tramo(s, m2 + 1.3, m2 + 1.6)), ROJO, 0.3);
      W.heroe({ x: HXh, z: HZh, gira: gh }); brazos(W.H, 1, 1);
      const fl = tramo(s, m2 + 0.95, m2 + 1.4), mp = manos(HXh, HZh, gh, 1, 1.06, 0);
      X.billete(0, { tipo: fl < 0.5 ? '14' : '13', x: mp[0], y: mp[1], z: mp[2], rx: -0.5, ry: gh + 2 * PI * suave(fl), esc: 0.7 * (1 + 0.15 * Math.sin(fl * PI)) });
      const u = sale(tramo(s, m2, D));
      cam(mezcla([0.45, 2.0, 5.6], [0.1, 1.72, 4.2], u), mezcla([-0.05, 1.2, 0.15], [-0.15, 1.3, 0.25], u));
    }
  } else if (k === 3 || (k === 4 && s < mk(1, 3.3))) {
    // La multitud con su décimo: de espaldas; en «¿por qué?» se giran todos a la vez (escena 3). Escena 4: las fichas salen de
    // sus décimos y se amontonan sobre tres maniquíes lejanos.
    const P3 = [0.5, 2.6, 5.2];
    let P, L, giro = 1;
    if (k === 3) { const m0 = mk(0, 0.7); giro = suave(tramo(s, m0 - 0.15, m0 + 0.35)); P = mezcla([0.55, 2.3, 9.6], P3, sale(p)); L = mezcla([0.15, 0.55, -2], [0.2, 0.85, -3.2], p); }
    else { const u = suave(tramo(s, 0, mk(1, 3.3))); P = mezcla([-4.4, 2.7, 6.8], [3.5, 3.3, 6.3], u); L = mezcla([-0.6, 1.0, -3.2], [0.6, 1.55, -5.6], u); }
    const pilas = [0, 0, 0];
    directo = (i, a) => {
      const c = sitioM(i), lejos = i >= 41, rot = lejos ? Math.atan2(P3[0] - c[0], P3[2] - c[1]) : angulo(PI, Math.atan2(P3[0] - c[0], P3[2] - c[1]), giro);
      return { x: c[0], z: c[1], rot, brazos: lejos && k === 4 ? 0.85 * q(0.3, 0.6) : 0 };
    };
    W.multitud(t, { directo });
    W.gente.forEach((a, i) => {
      const c = sitioM(i), rot = a.g.rotation.y;
      if (i >= 41 && k === 4) return;
      brazos(a, 1, 1);
      if (i < 41 && k === 4) {
        // la ficha de este maniquí: sale del décimo y vuela a una de las tres pilas (26, 11 y 4)
        const pila = i < 26 ? 0 : i < 37 ? 1 : 2, n = i < 26 ? i : i < 37 ? i - 26 : i - 37, f = sitioM(41 + pila);
        const ti = 0.15 + ((i * 7) % 41) * 0.045, u = tramo(s, ti, ti + 0.85), e_ = suave(u);
        const x0 = c[0] + Math.sin(rot) * 0.6, y0 = 1.62, z0 = c[1] + Math.cos(rot) * 0.6, x1 = f[0], y1 = 2.02 + n * 0.085, z1 = f[1] + 0.05;
        X.ficha(i, { x: x0 + (x1 - x0) * e_, y: y0 + (y1 - y0) * e_ + 1.3 * Math.sin(u * PI), z: z0 + (z1 - z0) * e_, rx: u > 0 && u < 1 ? 6 * u : 0, color: AMBH, brillo: 0.4, op: Math.min(1, tramo(s, ti - 0.15, ti) * 2), esc: 0.85 });
        decEnMano(i, a, c[0], c[1], rot, 1, 0xffffff, 0x64748b, sale(tramo(s, ti, ti + 0.4)));
      } else decEnMano(i, a, c[0], c[1], rot, 1);
    });
    cam(P, L);
    return;
  } else if (k === 4) {
    // Apagón: 4 fichas forman la torre dorada del Gordo bajo un foco ámbar; la cámara se aleja hasta el campo de 100.000 puntos.
    const m1 = mk(1, 3.3), m2 = mk(2, 4.6);
    X.apagon(0.1, 5, 0, 0); X.campo({ halo: 1, brillo: 0 });
    for (let j = 0; j < 4; j++) { const tj = m1 + 0.05 + 0.1 * j, u = tramo(s, tj, tj + 0.32); X.ficha(j, { x: 0, y: 0.1 + j * 0.205 + 3 * (1 - u * u), z: 0, color: AMBH, brillo: 0.45, esc: 2.4, op: u > 0 ? 1 : 0 }); }
    W.rotulo('gordo', 'EL GORDO: 4 €', 0, 1.2, 0, q(m1 + 0.45, 0.3) * (1 - tramo(s, m2 + 0.3, m2 + 0.7)), AMB, 0.3);
    if (s < m2) { const u = tramo(s, m1, m2), a = 0.55 - 0.35 * u; W.niebla(7, 30); cam([4.2 * Math.sin(a), 1.5 + 0.2 * u, 4.2 * Math.cos(a)], [0, 0.45, 0]); }
    else {
      const u = sale(tramo(s, m2 - 0.05, Math.min(D, m2 + 2.4))), a = 0.2 + 1.9 * u + 0.12 * Math.max(0, s - m2 - 2.4), r = 4.2 + 23 * u, h = 1.7 + 46 * u, dist = Math.hypot(r, h);
      W.niebla(8 + 70 * u, 30 + 120 * u); cam([r * Math.sin(a), h, r * Math.cos(a)], [0, 0.45 * (1 - u), 0]);
      X.campo({ halo: 0.6 + 0.03 * dist, brillo: (0.65 + 0.35 * Math.max(0, Math.sin(t * 8))) * q(m2 + 0.2, 0.4) });
    }
  } else if (k === 5) {
    // 100 décimos caen en una rejilla 10 × 10; en «86» una ola apaga 86 en rojo oscuro; los 9 del reintegro (ámbar) vuelan al
    // maniquí, que recibe su billete de 20; los 5 con más premio brillan y suben.
    const m0 = mk(0, 1.0), m1 = mk(1, 2.9), m2 = mk(2, 4.0), m3 = mk(3, 5.6), t86 = res[0] ? res[0].ini : m0 + 0.3;
    const HX5 = -4.4, HZ5 = 0.5, gh = 0.95;
    const sitio = (i) => [(4.5 - Math.floor(i / 10)) * 0.7, (i % 10 - 4.5) * 0.46];
    const mp = manos(HX5, HZ5, gh, 1, 1.06, 0);
    for (let i = 0; i < 100; i++) {
      const [x, z] = sitio(i), tf = 0.05 + 0.8 * REJ.caida[i], u = tramo(s, tf, tf + 0.38), tipo = REJ.tipo[i];
      let y = 0.02 + 5.5 * (1 - u * u), rz = 2.5 * (1 - u), op = u > 0 ? 1 : 0, color = 0xffffff, color2 = null, cq = 0, esc = 1, rx = -PI / 2, ry = -PI / 2, px = x, pz = z;
      if (tipo === 0) { color2 = 0x6b1d1d; cq = sale(tramo(s, t86 - 0.1 + 0.05 * Math.floor(i / 10), t86 + 0.15 + 0.05 * Math.floor(i / 10))); }
      if (tipo === 1) {
        const j = REJ.reint.indexOf(i), tv = m1 + 0.25 + 0.07 * j, v = tramo(s, tv, tv + 0.8), ev = suave(v);
        color2 = AMBH; cq = sale(tramo(s, m1 - 0.05, m1 + 0.25));
        if (v > 0) { px = x + (mp[0] - x) * ev; pz = z + (mp[2] - z) * ev; y = 0.02 + (mp[1] - 0.02) * ev + 1.6 * Math.sin(v * PI); rx = -PI / 2 + 1.1 * ev; ry = -PI / 2 + (gh + PI / 2) * ev; esc = 1 - 0.75 * ev; op = 1 - tramo(s, tv + 0.7, tv + 0.8); }
      }
      if (tipo === 2) {
        const j = REJ.mas.indexOf(i), sube = sale(tramo(s, m3 + 0.05 * j, m3 + 0.6 + 0.05 * j));
        color2 = OROH; cq = sube; y += (1.3 + 0.28 * j) * sube; rx = -PI / 2 + 1.35 * sube; esc = 1 + 0.5 * sube;
        X.halo(j, { x: px, y: y - 0.05, z: pz, esc: 1.6, op: 0.85 * sube });
      }
      X.decimoV(i, { x: px, y, z: pz, rx, ry, rz, op, color, color2, cq, esc });
    }
    const recibe = q(m1 + 1.0, 0.3);
    // El maniquí no sale en la cenital de la rejilla (asomaban sus brazos y su sombra abajo): aparece con el corte de m1.
    W.heroe({ x: HX5, z: HZ5, gira: gh, brazos: 0, visible: s >= m1 - 0.02 }); brazos(W.H, 1, 1);
    if (recibe > 0.01) X.billete(0, { tipo: '20', x: mp[0], y: mp[1], z: mp[2], rx: -0.5, ry: gh, esc: 0.62 * (0.4 + 0.6 * recibe) * (1 + 0.15 * Math.sin(recibe * PI)) });
    if (s < m1) { const u = suave(tramo(s, 0, m1)), a = -0.16 + 0.3 * u; cam([-1.3 * Math.cos(a), 13.6 - 0.9 * u, 1.3 * Math.sin(a)], [0.2, 0, 0]); }
    else if (s < m3) { const u = suave(tramo(s, m1, m3)); cam(mezcla([-1.9, 1.15, 4.6], [-2.6, 1.45, 3.7], u), mezcla([-3.6, 0.85, 0.2], [-4.3, 1.25, 0.5], u)); }
    else { const u = sale(tramo(s, m3, D)); cam(mezcla([-6.0, 2.6, 3.6], [-3.3, 2.2, 2.3], u), mezcla([0.2, 1.1, 0], [0.4, 1.5, 0], u)); }
  } else {
    // Cierre: el maniquí se vuelve turquesa; el billete de 20 se parte en 13 (ámbar) + 7 (rojo), el 7 viene al primer plano,
    // el 13 se apaga y en «cuesta los 20» vuelve a ser un 20 entero, en rojo. Cola: el encuadre del fotograma 0 (bucle).
    const m0 = mk(0, 1.9), m1 = mk(1, 3.6), m2 = mk(2, 6.0), m3 = mk(3, 7.4), cola = D - 0.55;
    if (s >= cola) { gancho(W, X, s - D, 2.9, 4.5); W.multitud(t, { directo }); return; }
    // Arranque del cierre con movimiento (antes, 4 s casi quietos): el billete de 20 entra girando desde arriba, el maniquí
    // entra andando por la derecha y se enciende en «juegas», se para junto al billete, se gira hacia él y lo señala en
    // «es tu decisión» (el billete da un respingo en «decisión»); la órbita de la cámara es el doble de amplia.
    // Los tiempos van referidos a la marca m0 («Pero…»), así que siguen a la voz aunque cambie la toma.
    const HXc = 0.55, HZc = 0.0, BX = -0.3, BY = 1.75, BZ = 0.95, EB = 1.15, flota = 0.05 * Math.sin(t * 2.2);
    const tSen = Math.max(1.0, m0 - 1.0), tPop = Math.max(1.2, m0 - 0.7), tPara = tSen - 0.2;
    const an = sale(tramo(s, 0, tPara)), hx = lerp(2.55, HXc, an), hz = lerp(-0.4, HZc, an);
    const gMira = Math.atan2(BX - HXc, BZ - HZc), gAnda = Math.atan2(HXc - 2.55, HZc + 0.4);
    W.heroe({ x: hx, z: hz, gira: angulo(gAnda, gMira, suave(tramo(s, tPara - 0.3, tSen + 0.1))), amp: 1 - tramo(s, tPara - 0.35, tPara), fase: s * 7.5,
      luz: q(0.3, 0.5), senala: 0.85 * q(tSen, 0.35) * (1 - q(m1 + 0.4, 0.4)) });
    const parte = q(m1 - 0.05, 0.35), gap = 0.28 * parte, viene = suave(tramo(s, m1 + 0.35, m1 + 1.2)), apaga = q(m2 - 0.05, 0.35), junta = q(m3 - 0.08, 0.25);
    if (parte < 0.02 || junta > 0.98) {
      const pop = junta > 0.98 ? 1 + 0.18 * Math.sin(tramo(s, m3 + 0.17, m3 + 0.5) * PI) : 1 + 0.08 * Math.sin(tramo(s, 0.5, 0.75) * PI) + 0.14 * Math.sin(tramo(s, tPop, tPop + 0.35) * PI);
      const ent = sale(tramo(s, 0, 0.6)), pe = mezcla([BX + 0.6, BY + 0.6, BZ - 0.3], [BX, BY + flota, BZ], ent);
      X.billete(0, { tipo: junta > 0.98 ? '20r' : '20', x: pe[0], y: pe[1], z: pe[2], rx: -0.05 + 0.6 * (1 - ent), ry: 0.22 + 2 * PI * (1 - ent), rz: 0.5 * (1 - ent), esc: EB * pop });
    } else {
      // El 7 viene al primer plano a la derecha del 13 (sin taparle el «€»).
      const j1 = 1 - junta, w13 = 0.65 * EB, w7 = 0.35 * EB;
      const p13 = [BX - EB / 2 + w13 / 2 - gap / 2 * j1, BY + flota, BZ], p7 = mezcla([BX + EB / 2 - w7 / 2 + gap / 2 * j1, BY + flota, BZ], [BX + 0.4, BY - 0.08, BZ + 0.75], viene * j1);
      X.billete(0, { tipo: apaga > 0.5 ? '13o' : '13p', x: p13[0], y: p13[1], z: p13[2], rx: -0.05, ry: 0.22, esc: EB, op: 1 - 0.35 * apaga });
      X.billete(1, { tipo: '7p', x: p7[0], y: p7[1], z: p7[2], rx: -0.05, ry: 0.22, esc: EB * (1 + 0.25 * viene * j1) });
    }
    let P, L;
    const orb = (u) => { const a = 0.85 - 0.9 * u, r = 4.9 + 0.65 * u; return [0.3 + r * Math.sin(a), 2.35 - 0.3 * u, 0.5 + r * Math.cos(a)]; };
    // Plano del 13 + 7: más abierto y centrado, para que el 13 entre entero y el maniquí no llegue al borde derecho (botones).
    const P7 = [BX + 0.5, BY + 0.35, BZ + 5.05], L7 = [BX + 0.25, BY - 0.35, BZ + 0.25];
    if (s < m1) { const u = suave(tramo(s, 0, m1)); P = orb(u); L = [0.25, 1.45, 0.45]; }
    else if (s < m2) { const u = suave(tramo(s, m1, m1 + 1.3)); P = mezcla(orb(1), P7, u); L = mezcla([0.25, 1.45, 0.45], L7, u); }
    else { const u = suave(tramo(s, m2, m3 + 0.3)); P = mezcla(P7, [-0.25, 1.9, 5.75], u); L = mezcla(L7, [-0.05, 1.4, 0.8], u); }
    cam(P, L);
  }
  W.multitud(t, { directo });
};

const pildoras = {
  'es-loteria-navidad': pildora3d({
    slug: 'es-loteria-navidad', cuenta: 'es',
    T: { es: { titulo: 'Tu décimo de 20 € vale 14 de media antes de que gire el bombo', guion: GUION } },
    fijo: () => `<div class="hud i fmt">HACEMOS LA CUENTA</div><div class="hud d"><i></i><span id="reloj">00:00</span></div>`,
    cssExtra: CSS, scriptExtra: SCRIPT,
    escenas: ESCENAS, tres: TRES,
    // Como es-iva-sobre-impuesto: cola corta (el bucle vuelve pronto al gancho) y la capa 2D se va con el corte seco del 3D.
    cola: 0.8, corte2d: 'seco',
    texto: { es: TEXTO }
  })
};

module.exports = { pildoras };
