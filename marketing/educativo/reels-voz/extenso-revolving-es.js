// Formato extenso (35–50 s) · @finanziapp.es (España), en 3D (reels-voz/tres.js), serie «Hacemos la cuenta».
// es-revolving-cuota · «1.000 € de Black Friday en la tarjeta, pagando 20 al mes: más de 7 años y 742 € de intereses.» (ejemplo)
// Guion: guiones/2026-11-es-revolving-cuota.md (gancho visual, escenas, cuadra(), fuentes, texto y portada).
// Publicación prevista: lunes 30-nov-2026 por la mañana (Madrid), el lunes después del Black Friday.
// Modelo: reels-voz/extenso-tarjeta-en.js (en-credit-card-minimum) y extenso-hipoteca-en.js (en-mortgage-rate): un contador de
// intereses que sube delante de ti y una torre roja que crece mientras la tuya casi no baja. Aquí, además, cortes de cámara
// dentro del gancho (cambio de plano cada 1,3–1,8 s en los primeros 8 s).
//
// Fuentes (consultadas el 26-nov-2026):
// - Banco de España, Boletín Estadístico, cuadro 19.4 «Tipos de interés (TEDR) de nuevas operaciones. Préstamos y créditos a
//   hogares e ISFLSH», col. 7 «Tarjetas de crédito y tarjetas "revolving"» (nota b: tarjetas con pago aplazado solicitado y
//   tarjetas revolving): septiembre de 2026 (P) = 18,27 % (ago 18,22; jul 18,26). TEDR: sin comisiones ni seguros (no es TAE).
//   https://www.bde.es/webbe/es/estadisticas/compartido/datos/pdf/a1904.pdf (y cuadro 19.3, col. 4: .../a1903.pdf)
// - Orden EHA/2899/2011, texto consolidado (últ. act. 27/07/2020): art. 33 bis (crédito revolvente), art. 33 quinquies.1
//   (información «con periodicidad al menos trimestral»: crédito dispuesto, tipo deudor, modalidad «revolving» y cuota, fecha
//   estimada de fin de pago y cuantía total desglosando principal e intereses), art. 33 quinquies.3.b) (si la cuota es inferior
//   al porcentaje del art. 18.2.e — amortizar al menos el 25 % del límite al año —, «el importe de la cuota mensual que permitiría
//   liquidar toda la deuda en el plazo de un año»), art. 33 sexies.1 (cuadro de amortización en 5 días hábiles, solo en el texto).
//   https://www.boe.es/buscar/act.php?id=BOE-A-2011-17015
// - Orden ETD/699/2020 (BOE 27-07-2020), art. 3.6 y disp. final 2.ª d): el art. 33 quinquies rige desde el 27-01-2021 (solo
//   los escenarios del 3.a quedan aplazados). https://www.boe.es/boe/dias/2020/07/27/pdfs/BOE-A-2020-8583.pdf
// - Orden ECM/531/2026 (BOE 29-05-2026): la STS 519/2025 anuló solo los arts. primero y segundo de la ETD/699/2020; el tercero
//   (el del 33 quinquies) sigue vigente. https://www.boe.es/boe/dias/2026/05/29/pdfs/BOE-A-2026-11586.pdf
// - Todas las cifras de la tarjeta son NUESTRO EJEMPLO (amortización mes a mes abajo): 1.000 € dispuestos, cuota fija 20 €/mes,
//   18,27 % como tipo efectivo anual → interés mensual (1,1827)^(1/12) − 1 = 1,408 %; sin más compras, comisiones ni seguros.
//   Rótulo «Ejemplo» en pantalla desde el fotograma 0 y en el texto; la tarjeta de la escena 3 es genérica (sin banco ni marca).
const { pildora3d } = require('./tres');
const { cuadra } = require('../reels/_comun');
const { VOZ_NARRADOR } = require('./_comun');

// ——— cuentas (guiones/2026-11-es-revolving-cuota.md, «Cuentas») ———
const TIPO = 18.27, I = Math.pow(1 + TIPO / 100, 1 / 12) - 1, B = 1000, CUOTA = 20, BLOQUE = 50;
const H = [{ m: 0, s: B, int: 0, pag: 0, p: 0, it: 0 }];
{ let s = B, int = 0, pag = 0, m = 0;
  while (s > 1e-9) { m++; const it = s * I; const p = Math.min(CUOTA, s + it); int += it; pag += p; s = s + it - p; H.push({ m, s, int, pag, p, it }); } }
const N = H.length - 1, INT = H[N].int;
cuadra('interés mensual (%)', Math.round(I * 1e5) / 1e3, 1.408);
cuadra('cuotas', N, 88);                                        // «más de 7 años» (7 años y 4 meses)
cuadra('más de 7 años', N > 84 && N < 96, true);
cuadra('intereses', Math.round(INT), 742);                      // «742 euros»
cuadra('total pagado', Math.round(H[N].pag * 100) / 100, 1741.6);
cuadra('intereses del primer mes', Math.round(H[1].it * 100) / 100, 14.08);   // «14 son intereses»
cuadra('baja la deuda el primer mes', Math.round((CUOTA - H[1].it) * 100) / 100, 5.92);
cuadra('pagado en 2 años', Math.round(H[24].pag), 480);
cuadra('debes a los 2 años', Math.round(H[24].s), 832);
cuadra('intereses pasan de 500 en el mes', H.find(h => h.int > 500).m, 42);
const c12 = B * I / (1 - Math.pow(1 + I, -12));
cuadra('cuota para liquidarlo en un año', Math.round(c12 * 100) / 100, 91.16);  // «91 euros al mes»
cuadra('intereses en un año', Math.round(c12 * 12 - B), 94);                   // «94 de intereses»
const c3 = B * I / (1 - Math.pow(1 + I, -3));
cuadra('3 meses: cuota', Math.round(c3 * 100) / 100, 342.76);                  // texto
cuadra('3 meses: intereses', Math.round(c3 * 3 - B), 28);                      // texto
cuadra('ahorro con la cuota de un año', Math.round(INT - (c12 * 12 - B)), 648);
cuadra('fin de pago', (() => { const d = new Date(Date.UTC(2026, 11, 1)); d.setUTCMonth(d.getUTCMonth() + N - 1); return d.toISOString().slice(0, 7); })(), '2034-03');
cuadra('amortizado el primer año', Math.round(B - H[12].s), 77);
const c30 = (() => { let s = B, m = 0, int = 0; while (s > 1e-9) { m++; const it = s * I; int += it; s = s + it - Math.min(30, s + it); } return [m, Math.round(int)]; })();
cuadra('texto: 30 €/mes', c30.join('/'), '46/360');
// en pantalla, además del guion
cuadra('pantalla: 12 cuotas de 91,16 cuadran', (() => { let s = B; for (let k = 0; k < 12; k++) s = s * (1 + I) - c12; return Math.abs(s) < 1e-6; })(), true);
cuadra('pantalla: total de un año', Math.round(c12 * 12 * 100) / 100, 1093.88);
cuadra('pantalla: intereses de un año', Math.round((c12 * 12 - B) * 100) / 100, 93.88);
cuadra('pantalla: bloques blancos (1.000 / 50)', B / BLOQUE, 20);
cuadra('pantalla: bloques rojos al final (14 + lámina 0,83)', [Math.floor(INT / BLOQUE), Math.round((INT / BLOQUE - 14) * 100) / 100].join('/'), '14/0.83');
cuadra('pantalla: el bloque 10 (500 €) cae en el mes 42', Math.floor(H[42].int / BLOQUE), 10);
cuadra('pantalla: a los 2 años, blancos 17 y rojos 6', [Math.round(H[24].s / BLOQUE), Math.round(H[24].int / BLOQUE)].join('/'), '17/6');
cuadra('pantalla: 94 € = 2 bloques; vuelan 13', [Math.round((c12 * 12 - B) / BLOQUE), 15 - 2].join('/'), '2/13');
cuadra('pantalla: mes 6 del fotograma 0', [Math.round(H[6].int), Math.round(H[6].s)].join('/'), '83/963');

// Historial mes a mes para la página: [debes, intereses acumulados, pagado acumulado, cuota, intereses del mes]
const HIST = H.map(h => [h.s, h.int, h.pag, h.p, h.it].map(x => Math.round(x * 100) / 100));

const TEXTO = `1.000 € de Black Friday en la tarjeta, pagando 20 € al mes: más de 7 años y 742 € de intereses.

Con una cuota fija tan baja, de tus primeros 20 €, 14 se van en intereses. En este ejemplo, a los 2 años has pagado 480 € y aún debes 832 €. Con 30 € al mes serían casi 4 años y 360 €; pagado en 3 meses (343 € al mes), unos 28 €.

Lo que casi nadie sabe: en España, si tu tarjeta es revolving (pago aplazado), el banco tiene que informarte al menos cada trimestre de la cuota, la fecha estimada en la que terminarás de pagar y lo que pagarás en total, con los intereses desglosados. Si tu cuota no llega a amortizar el 25 % del límite al año, además tiene que decirte qué cuota liquidaría la deuda en un año (aquí, 91 € al mes y 94 € de intereses). Y puedes pedirle el cuadro de amortización: te lo da en 5 días hábiles.

Hoy: entra en tu banca, mira la modalidad de pago de tu tarjeta (a fin de mes o aplazado) y qué cuota tienes.

Ejemplo: 1.000 € dispuestos, cuota fija de 20 €/mes, tipo del 18,27 %, sin más compras, comisiones ni seguros. Cada contrato tiene sus condiciones.
Fuentes: Banco de España, Boletín Estadístico, cuadro 19.4 (tarjetas de pago aplazado y revolving, TEDR, septiembre de 2026: 18,27 %) · Orden EHA/2899/2011, arts. 18.2.e), 33 quinquies y 33 sexies (en la redacción de la Orden ETD/699/2020), BOE.
Contenido educativo, no es asesoramiento financiero.

#finanzaspersonales #tarjetadecredito #ahorro`;
cuadra('texto ≤ 1.900 caracteres', TEXTO.length <= 1900, true);

const GUION = [
  [0, '1.000 euros de Black Friday en la tarjeta, §pagando 20 al mes: §{pop}*más de 7 años* §y *742 euros* de intereses.'],
  [1, '¿Por qué tanto? §Al tipo medio de estas tarjetas en España, §de tus primeros 20 euros, §*14 son intereses*.'],
  [2, '§Tras dos años pagando, §has puesto 480 euros §y aún debes *832*.'],
  [3, '¿Y cómo sabes cuánto te queda? §Desde 2021, una norma obliga al banco §a decírtelo *al menos cada trimestre*: §{caja}cuándo terminarás §y cuánto pagarás en intereses.'],
  [4, '§{ding}Y si tu cuota es muy baja, §también qué cuota lo liquida en un año: §aquí, *91 euros al mes* §y *94* de intereses, §no 742.'],
  [5, 'Hoy, §mira en tu banca cómo pagas la tarjeta: §a fin de mes o aplazado, §y qué cuota tienes. §{pop}Una cuota pequeña no abarata la compra: §*la alarga*.']
];

const MONO = `'DejaVu Sans Mono', 'Liberation Mono', monospace`;
const CSS = `
  .hud.i.fmt { letter-spacing: .14em; }
  .vin { background: radial-gradient(130% 80% at 50% 46%, transparent 52%, rgba(3,5,12,.62) 100%),
      linear-gradient(rgba(7,11,22,.92) 0%, rgba(7,11,22,.76) 13%, rgba(7,11,22,.68) 24.5%, rgba(7,11,22,.22) 29.5%, transparent 33%, transparent 76%, rgba(7,11,22,.8) 100%); }
  .rt { position: absolute; left: 50%; top: 1335px; padding: 10px 28px 14px; border-radius: 20px; background: rgba(9,14,27,.9); border: 3px solid #e2e8f0;
    color: #fff; font-size: 58px; line-height: 1.12; font-weight: 900; letter-spacing: -.015em; white-space: nowrap; opacity: 0; font-variant-numeric: tabular-nums;
    box-shadow: 0 10px 40px rgba(0,0,0,.45); text-align: center; }
  .rt.p { font-size: 46px; } .rt.amb { border-color: #f5b94a; } .rt.roja { border-color: #f87171; } .rt.turq { border-color: #5eead4; }
  .rt .a { color: #f5b94a; } .rt .r { color: #f87171; } .rt .t { color: #5eead4; } .rt small { display: block; font: 700 26px/1.5 ${MONO}; letter-spacing: .08em; color: #cbd5e1; }
  .nota { position: absolute; left: 70px; top: 1436px; max-width: 830px; font: 600 22px/1.25 ${MONO}; color: #b6c2d4; background: rgba(7,11,22,.84);
    border-radius: 10px; padding: 4px 12px; opacity: 0; }
  /* el contador del gancho: UNA cifra roja enorme bajo los subtítulos */
  .cont { position: absolute; left: 50%; top: 492px; transform: translateX(-50%); text-align: center; white-space: nowrap; font-variant-numeric: tabular-nums; }
  .cont small { display: block; font: 700 26px/1.3 ${MONO}; letter-spacing: .16em; color: #fca5a5; }
  .cont b { display: block; font-size: 160px; line-height: .98; font-weight: 900; letter-spacing: -.035em; color: #f87171; text-shadow: 0 6px 40px rgba(220,38,38,.45); }
  .cont i { display: block; font-style: normal; font: 700 30px/1.3 ${MONO}; letter-spacing: .06em; color: #e2e8f0; margin-top: 4px; }
  .cont i em { font-style: normal; color: #5eead4; }
  .chip { position: absolute; top: 505px; background: rgba(9,14,27,.9); border: 3px solid #cbd5e1; border-radius: 20px; padding: 6px 22px 10px;
    font-variant-numeric: tabular-nums; white-space: nowrap; opacity: 0; }
  .chip small { display: block; font: 700 22px/1.35 ${MONO}; letter-spacing: .14em; color: #94a3b8; }
  .chip b { display: block; font-size: 62px; line-height: 1.02; font-weight: 900; color: #fff; letter-spacing: -.01em; }
  .chip.izq { left: 66px; } .chip.der { right: 66px; text-align: right; }
  /* información trimestral de EJEMPLO (art. 33 quinquies), sin banco */
  .ext { position: absolute; left: 50%; top: 540px; width: 900px; background: #f8fafc; color: #0f172a; border-radius: 26px; padding: 24px 34px 28px;
    box-shadow: 0 30px 80px rgba(0,0,0,.6); opacity: 0; transform-origin: 50% 40%; }
  .ext .cab { display: flex; justify-content: space-between; align-items: baseline; font: 700 22px/1.3 ${MONO}; letter-spacing: .1em; color: #64748b;
    border-bottom: 3px solid #e2e8f0; padding-bottom: 12px; }
  .ext .f { display: flex; justify-content: space-between; font-size: 32px; font-weight: 650; padding: 6px 6px; color: #334155; }
  .ext .f b { font-weight: 850; color: #0f172a; }
  .ext .f b.rv { color: #b91c1c; letter-spacing: .02em; }
  .ext .bx { margin-top: 10px; border: 5px solid transparent; border-radius: 16px; padding: 10px 16px; font-size: 30px; line-height: 1.25; color: #334155; }
  .ext .bx b { display: block; font-size: 42px; font-weight: 900; color: #0f172a; }
  .ext .bx small { display: block; font: 700 21px/1.3 ${MONO}; color: #64748b; }
  .ext table { width: 100%; border-collapse: separate; border-spacing: 0 6px; margin-top: 10px; font-variant-numeric: tabular-nums; }
  .ext th { font: 700 19px/1.25 ${MONO}; letter-spacing: .02em; color: #64748b; text-align: left; vertical-align: bottom; padding: 0 10px 4px; }
  .ext td { font-size: 32px; font-weight: 800; color: #0f172a; padding: 10px; border-top: 4px solid transparent; border-bottom: 4px solid transparent; }
  .ext td:first-child { border-left: 4px solid transparent; border-radius: 12px 0 0 12px; } .ext td:last-child { border-right: 4px solid transparent; border-radius: 0 12px 12px 0; }
  .ext td small { display: block; font: 700 19px/1.2 ${MONO}; color: #64748b; }
  .mini { position: absolute; left: 50%; top: 560px; width: 760px; background: #f8fafc; color: #0f172a; border-radius: 22px; padding: 18px 26px 22px; opacity: 0;
    box-shadow: 0 24px 70px rgba(0,0,0,.6); border: 6px solid #f5b94a; }
  .mini b { display: block; font-size: 38px; font-weight: 900; }
  .mini .fila { display: flex; justify-content: space-between; font-size: 36px; font-weight: 800; margin-top: 10px; padding: 8px 14px; border-radius: 12px; background: rgba(245,185,74,.2); }
  .mini .fila i { font-style: normal; color: #b45309; }
`;

const SCRIPT = `
const PI = Math.PI, ROJOH = 0xdc2626, TURQH = 0x2dd4bf, GRISH = 0xb4bac6, BLANCOH = 0xe6ebf2;
const HIST = ${JSON.stringify(HIST)};
const NM = ${N};
const WX = -1.45, RX = 1.45;
const mezcla = (P, Q, u) => P.map((v, j) => v + (Q[j] - v) * u);
const suave = (x) => x * x * (3 - 2 * x);
const angulo = (a, b, g) => a + ((((b - a + PI) % (2 * PI)) + 2 * PI) % (2 * PI) - PI) * g;
const pl = (x, P) => { if (x <= P[0][0]) return P[0][1]; for (let j = 0; j < P.length - 1; j++) if (x <= P[j + 1][0]) return P[j][1] + (P[j + 1][1] - P[j][1]) * (x - P[j][0]) / (P[j + 1][0] - P[j][0]); return P[P.length - 1][1]; };
function ver(n, s, a, b) { if (!n) return; let p = a < -0.5 ? 1 : rebote(tramo(s, a - 0.1, a + 0.25)); if (b != null) p *= 1 - tramo(s, b - 0.12, b); aparece3(n, p); }
// Cámara por fotogramas clave (spline de Hermite, nunca se para) y órbita (de extenso-hipoteca-en.js / desmentido-en.js).
const ruta = (K, x) => {
  if (x <= K[0][0]) { const v = K[1][1].map((c, j) => (c - K[0][1][j]) / (K[1][0] - K[0][0])); return K[0][1].map((c, j) => c + v[j] * (x - K[0][0])); }
  if (x >= K[K.length - 1][0]) return K[K.length - 1][1];
  let j = 0; while (x > K[j + 1][0]) j++;
  const [t0, P0] = K[j], [t1, P1] = K[j + 1], dt = t1 - t0, u = (x - t0) / dt;
  const vel = (n) => n === 0 ? K[1][1].map((v, c) => (v - K[0][1][c]) / (K[1][0] - K[0][0])) : n === K.length - 1 ? P0.map(() => 0)
    : K[n + 1][1].map((v, c) => (v - K[n - 1][1][c]) / (K[n + 1][0] - K[n - 1][0]));
  const V0 = vel(j), V1 = vel(j + 1), u2 = u * u, u3 = u2 * u;
  return P0.map((v, c) => (2 * u3 - 3 * u2 + 1) * v + (u3 - 2 * u2 + u) * dt * V0[c] + (-2 * u3 + 3 * u2) * P1[c] + (u3 - u2) * dt * V1[c]);
};
const orbita = (C, ang) => { const dx = C[0] - C[3], dz = C[2] - C[5], c = Math.cos(ang), s_ = Math.sin(ang); return [C[3] + dx * c + dz * s_, C[1], C[5] - dx * s_ + dz * c, C[3], C[4], C[5]]; };
const orden = (K) => { for (let j = 1; j < K.length; j++) if (K[j][0] <= K[j - 1][0] + 0.05) K[j][0] = K[j - 1][0] + 0.05; return K; };
// Planos con corte seco: P = [[t0, K0], [t1, K1], …]; en [ti, ti+1) la cámara sigue la ruta Ki (con su propio tiempo absoluto).
// Plano y deriva sobre la cámara de cada escena (para que nunca esté quieta y cambie de plano cada L s): en cada tramo de L s,
// giro alrededor del punto al que mira y distancia distintos (corte seco al cambiar de tramo) más una deriva continua.
const GIROS = [0, 0.85, -0.8, 0.7, -0.9, 0.75, -0.65], DIST = [1, 0.86, 1.16, 0.9, 1.12, 0.86, 1.14];
function deriva(C, s, L) {
  const j = Math.floor(s / L), u = s - j * L, g = GIROS[j % GIROS.length] + (j % 2 ? -1 : 1) * 0.4 * u, d = DIST[j % DIST.length] * (1 - 0.09 * u);
  const O = orbita(C, g); return [O[3] + (O[0] - O[3]) * d, O[4] + (O[1] - O[4]) * d, O[5] + (O[2] - O[5]) * d, O[3], O[4], O[5]];
}
const planos = (P, x) => { let j = 0; while (j + 1 < P.length && x >= P[j + 1][0]) j++; return ruta(orden(P[j][1]), x); };
// La tarjeta del ejemplo en un mes (fraccionario) m: interpolada entre meses enteros (mismas cifras que cuadra()).
const EN = (m) => { m = Math.max(0, Math.min(NM, m)); const a = Math.floor(m), b = Math.min(NM, a + 1), u = m - a; return HIST[a].map((v, j) => v + (HIST[b][j] - v) * u); };
// Reloj del gancho: mes en cada instante de la escena 0 (mes 6 en el fotograma 0, mes 42 a 0,62 s, mes 88 en TS).
const mesG = (s, TS) => pl(s, [[0, 6], [0.62, 42], [0.62 + (TS - 0.62) * 0.45, 66], [TS, NM]]);
// Bloques rojos asentados = floor(intereses / 50 €): el 10.º cae justo al pasar de 500 € (mes 42); el 15.º, una lámina (0,83),
// cae con la última cuota.
const rojosG = (s, TS) => { const m = mesG(s, TS); return m >= NM - 0.001 ? 15 : Math.min(14, Math.floor(EN(m)[1] / 50)); };
const TLG_ = {};
function TLG(TS) { const k = TS.toFixed(3); if (TLG_[k]) return TLG_[k];
  const t = new Array(15).fill(99), n0 = rojosG(0, TS); for (let j = 0; j < n0; j++) t[j] = -1;
  for (let i = 0; i <= 4000; i++) { const s = i / 1000, n = rojosG(s, TS); for (let j = n0; j < n; j++) if (t[j] === 99) t[j] = s; }
  return (TLG_[k] = t); }
const CAIDA = 0.28;
function bloqueG(j, s, TS) {
  const T0 = TLG(TS)[j]; if (T0 > 50) return null;
  if (s >= T0) { const d = s - T0; return { color: ROJOH, brillo: 0.32, dy: T0 < 0 ? 0 : 0.14 * Math.exp(-d * 15) * Math.sin(d * 32) }; }
  if (s < T0 - CAIDA) return null;
  const u = (s - T0 + CAIDA) / CAIDA; return { color: ROJOH, brillo: 0.4, dy: 2.0 * (1 - u * u), rz: 0.8 * (1 - u) * (j % 2 ? 1 : -1), rx: 0.5 * (1 - u) };
}

// resalta una fila de la tabla: 0..1 borde y tinte
function filaEstilo(tr, q, color) {
  tr.querySelectorAll('td').forEach(td => { td.style.borderColor = 'rgba(' + color + ',' + q.toFixed(2) + ')'; td.style.background = 'rgba(' + color + ',' + (0.2 * q).toFixed(2) + ')'; });
}
function cajaEstilo(bx, a, wp) {
  bx.style.borderColor = 'rgba(245,185,74,' + Math.min(1, a).toFixed(2) + ')';
  bx.style.background = 'linear-gradient(90deg, rgba(245,185,74,.28) ' + wp + '%, rgba(245,185,74,0) ' + Math.min(100, wp + 4) + '%)';
}
const X3 = (() => {
  const W = W3, T = W.T, S = W.S, objs = [], sueltos = [];
  const grupo = () => { const g = new T.Group(); g.visible = false; S.add(g); objs.push(g); return g; };
  const mat = (c, o) => new T.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.55, metalness: 0.08 }, o || {}));
  const lienzo = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const tx = new T.CanvasTexture(c); tx.encoding = T.sRGBEncoding; tx.anisotropy = 4; return { c, x: c.getContext('2d'), tx }; };
  const haloTx = (() => { const l = lienzo(256, 256), g = l.x.createRadialGradient(128, 128, 0, 128, 128, 128); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.3, 'rgba(255,255,255,.4)'); g.addColorStop(1, 'rgba(255,255,255,0)'); l.x.fillStyle = g; l.x.fillRect(0, 0, 256, 256); l.tx.needsUpdate = true; return l.tx; })();
  const LUCES = S.children.filter(o => o.isHemisphereLight || o.isDirectionalLight).map(l => [l, l.intensity]);
  function apagon(f) { LUCES.forEach(([l, i0]) => { l.intensity = i0 * f; }); }

  // ——— torres de bloques de 50 €, 4 de ancho, de abajo arriba fila a fila (en zigzag) ———
  const LB = 0.5, geoB = new T.BoxGeometry(LB * 0.9, LB * 0.9, LB * 1.3), POS = [];
  for (let r = 0; r < 12; r++) for (let c = 0; c < 4; c++) { const cc = r % 2 ? 3 - c : c; POS.push([(cc - 1.5) * LB, r * LB + LB / 2, 1]); }
  function hazTorre(n) {
    const g = grupo(), piv = new T.Group(); g.add(piv); const bl = [];
    for (let j = 0; j < n; j++) { const m = new T.Mesh(geoB, mat(GRISH, { transparent: true })); m.castShadow = true; m.receiveShadow = true; piv.add(m); bl.push(m); }
    return { g, piv, bl };
  }
  const TORRES = { blanca: hazTorre(20), roja: hazTorre(15), ahorro: hazTorre(13) };
  const ALTO = { roja: (j) => j === 14 ? 0.83 : 1 };   // el 15.º bloque rojo es una lámina: 41,60 € de 50
  function torre(id, o) {
    const C = TORRES[id]; C.g.visible = true; C.g.position.set(o.x || 0, o.y || 0, o.z || 0); C.g.rotation.y = o.rot || 0;
    C.g.scale.setScalar((o.esc || 1) * (o.pulso || 1)); C.piv.rotation.z = o.inclina || 0;
    C.bl.forEach((m, j) => {
      const d = o.bloque ? o.bloque(j) : {}; if (!d) { m.visible = false; return; }
      const p = POS[j], mt = m.material, op = d.op == null ? 1 : d.op; m.visible = op > 0.01; if (!m.visible) return;
      const h = ALTO[id] ? ALTO[id](j) : 1;
      mt.color.set(d.color == null ? GRISH : d.color); mt.emissive.set(d.color == null ? 0x000000 : d.color).multiplyScalar(d.brillo == null ? 0.25 : d.brillo);
      mt.opacity = op; mt.depthWrite = op > 0.99;
      m.position.set(p[0] + (d.dx || 0), p[1] - (1 - h) * LB * 0.45 + (d.dy || 0), d.dz || 0); m.rotation.set(d.rx || 0, d.ry || 0, d.rz || 0);
      const sc = Math.max(0.001, d.s == null ? 1 : d.s); m.scale.set(sc, sc * h, sc);
    });
  }
  function dondeB(o, j) { const p = POS[j], e = o.esc || 1; return [(o.x || 0) + p[0] * e, p[1] * e, (o.z || 0)]; }

  const geoU = new T.BoxGeometry(1, 1, 1), cajas = []; let nc = 0;
  function bloque(o) {
    if (nc >= cajas.length) { const m = new T.Mesh(geoU, mat(0xffffff, { transparent: true })); m.castShadow = true; m.receiveShadow = true; S.add(m); cajas.push(m); sueltos.push(m); }
    const m = cajas[nc++], mt = m.material, op = o.op == null ? 1 : o.op; m.visible = op > 0.01;
    mt.color.set(o.color || '#e2e8f0'); mt.emissive.set(o.color || '#e2e8f0').multiplyScalar(o.brillo == null ? 0.15 : o.brillo); mt.opacity = op; mt.depthWrite = op > 0.99;
    m.position.set(o.x, o.y, o.z); m.rotation.set(o.rx || 0, o.ry || 0, o.rz || 0); m.scale.set(Math.max(0.001, o.w), Math.max(0.001, o.h), Math.max(0.001, o.d));
    return m;
  }
  const halos = Array.from({ length: 4 }, () => { const s = new T.Sprite(new T.SpriteMaterial({ map: haloTx, color: 0xffffff, blending: T.AdditiveBlending, depthWrite: false, transparent: true })); s.visible = false; S.add(s); sueltos.push(s); return s; });
  let nh = 0;
  function halo(o) { if (nh >= halos.length) return; const s = halos[nh++]; s.visible = (o.op || 0) > 0.01; s.position.set(o.x, o.y, o.z); s.scale.setScalar(o.esc || 1); s.material.opacity = o.op || 0; s.material.color.set(o.color || '#ffffff'); }

  function apagar() { objs.forEach(g => { g.visible = false; }); sueltos.forEach(m => { m.visible = false; }); nc = 0; nh = 0; apagon(1); }
  return { torre, dondeB, bloque, halo, apagon, apagar, LB };
})();
W3.X = X3;

// ——— brazos del maniquí (de extenso-hipoteca-en.js). qa: 0 = como los deja andar(), 1 = pose; qp: 0 = arriba, 1 = al pecho ———
function brazos(a, qa, qp) {
  const ax = -2.75 * (1 - qp) - 0.95 * qp, az = -0.1 * (1 - qp) - 0.2 * qp, cx = -0.15 * (1 - qp) - 1.15 * qp;
  [[a.izq, -1], [a.der, 1]].forEach(([b, sg]) => {
    b.hombro.rotation.x = lerp(b.hombro.rotation.x, ax, qa); b.hombro.rotation.z = lerp(b.hombro.rotation.z, sg * az, qa); b.codo.rotation.x = lerp(b.codo.rotation.x, cx, qa);
  });
}
function manos(hx, hz, g, qp) { const ly = 2.2 * (1 - qp) + 1.5 * qp, lz = 0.3 * (1 - qp) + 0.62 * qp; return [hx + Math.sin(g) * lz, ly, hz + Math.cos(g) * lz]; }

// Subtítulos: una última palabra corta (≤ 3 letras) nunca se queda sola en su golpe (de extenso-hipoteca-en.js).
for (let i = 1; i < SUB.length; i++) {
  const g = SUB[i], p = SUB[i - 1], w = g.palabras[0].txt;
  if (g.palabras.length === 1 && /[.!?;]$/.test(w) && w.replace(/[.,;:!?]+$/, '').length <= 3 && p.palabras.length >= 3 && Math.abs(p.fin - g.ini) < 1e-6) {
    g.palabras.unshift(p.palabras.pop()); g.ini = g.palabras[0].ini; p.fin = g.ini;
  }
}
`;

// El sello del gancho: el contador se para en «más de 7 años» (marca 1 de la escena 0), entre 2,3 y 3,2 s.
const TSDE = 'Math.min(3.2, Math.max(2.3, e.seg[0].marcas[1] != null ? e.seg[0].marcas[1] : 2.8))';

const nota = (txt) => `<div class="nota">${txt}</div>`;
const rt = (cls, html, top) => `<div class="rt ${cls}" data-t="translateX(-50%)"${top ? ` style="top:${top}px"` : ''}>${html}</div>`;
const EJ = 'Ejemplo: 1.000 € · cuota fija 20 €/mes · 18,27 % (tipo medio,<br>Banco de España, sept. 2026) · sin más compras · 1 bloque = 50 €';
const EXTRACTO = (cls) => `<div class="ext ${cls}" data-t="translateX(-50%)"><div class="cab"><span>EJEMPLO · INFORMACIÓN TRIMESTRAL</span><span>TARJETA</span></div>
    <div class="f"><span>Crédito dispuesto</span><b>1.000,00 €</b></div>
    <div class="f"><span>Modalidad de pago</span><b class="rv">REVOLVING</b></div>
    <div class="f"><span>Cuota actual</span><b>20,00 €/mes</b></div>
    <div class="bx b1"><small>TERMINARÍAS DE PAGAR</small><b>marzo de 2034</b></div>
    <div class="bx b2"><small>PAGARÍAS EN TOTAL</small><b>1.741,60 €</b>capital 1.000,00 € + intereses 741,60 €</div>
    <table><tr><th>Cuota</th><th>Terminas en</th><th>Intereses</th></tr>
      <tr class="r1"><td>20,00 €</td><td>7 años y 4 meses</td><td>741,60 €</td></tr>
      <tr class="r2"><td>91,16 €<small>liquidarlo en 1 año</small></td><td>1 año</td><td>93,88 €</td></tr></table></div>`;

const ESCENAS = [
  // 0 · Gancho: el contador rojo de INTERESES corre desde el fotograma 0 (mes 6) mientras llueven bloques rojos de 50 € sobre la
  //     segunda torre; la torre blanca de 1.000 € pierde bloques muy despacio (los pagados quedan en contorno). Mes 42 (0,62 s):
  //     los intereses pasan de 500 € («INTERESES > 500 €»). Mes 88 (en «más de 7 años»): el contador se para en 742 €.
  { html: () => `<div class="cont"><small>INTERESES PAGADOS · MES <span class="y">6</span></small><b class="c">83 €</b><i>cuota <em>20 €/mes</em> · aún debes <span class="o">963 €</span></i></div>
      ${rt('roja', 'INTERESES <span class="r">&gt;</span> 500 €')}${rt('roja', '<span class="r">7 AÑOS Y 4 MESES</span><small>PARA PAGAR 1.000 € · 1.741,60 € EN TOTAL</small>')}
      ${nota(EJ)}`,
    anim: new Function('s', 'e', 'el', `
      const TS = ${TSDE}, M = e.seg[0].marcas, m2 = Math.max(M[2] != null ? M[2] : TS + 0.8, TS + 0.4), r = el.querySelectorAll('.rt');
      const mes = mesG(s, TS), h = mes >= NM - 0.001 ? HIST[NM] : EN(mes), c = el.querySelector('.cont');
      c.querySelector('.c').textContent = dinero(mes >= NM - 0.001 ? 742 : h[1]); c.querySelector('.o').textContent = dinero(h[0]);
      c.querySelector('.y').textContent = Math.max(1, Math.min(NM, Math.round(mes)));
      const TC = TLG(TS)[9], fl = s > TC ? Math.exp(-(s - TC) * 6) : 0, fs = s > TS ? Math.exp(-(s - TS) * 5) : 0;
      c.style.transform = 'translateX(-50%) scale(' + (1 + 0.12 * Math.sin(PI * tramo(s, TC, TC + 0.3)) + 0.16 * Math.sin(PI * tramo(s, TS, TS + 0.35)) + 0.06 * Math.sin(PI * tramo(s, m2, m2 + 0.4))) + ')';
      c.querySelector('b').style.textShadow = '0 6px ' + Math.round(40 + 60 * Math.max(fl, fs)) + 'px rgba(248,113,113,' + (0.45 + 0.5 * Math.max(fl, fs)).toFixed(2) + ')';
      ver(r[0], s, TC + 0.05, m2); ver(r[1], s, m2 + 0.15);
      el.querySelector('.nota').style.opacity = 1;
    `) },
  // 1 · Por qué: 88 barras iguales en el suelo (una por cuota de 20 €): rojo = intereses del mes, turquesa = lo que baja la deuda.
  { html: () => `${rt('amb', 'TIPO MEDIO <span class="a">18,27 %</span><small>BANCO DE ESPAÑA · SEPT. 2026</small>')}${rt('roja', 'DE 20 €: <span class="r">14 €</span> INTERESES')}
      ${nota('Cada barra = una cuota de 20 € · <span style="color:#f87171">rojo = intereses</span> · <span style="color:#5eead4">turquesa = baja la deuda</span><br>Tipo medio TEDR de las tarjetas de pago aplazado y revolving (ejemplo)')}`,
    anim: function (s, e, el) { const M = e.seg[0].marcas, m0 = M[0] != null ? M[0] : 0.9, m2 = M[2] != null ? M[2] : 3.0, r = el.querySelectorAll('.rt');
      ver(r[0], s, m0 + 0.05, m2 - 0.1); ver(r[1], s, m2 + 0.05); ver(el.querySelector('.nota'), s, 0.3); } },
  // 2 · Dos años: la torre blanca entera de nuevo; entran 24 cuotas, pierde solo 3 bloques (→ 17) y la roja sube a 6.
  { html: () => `<div class="chip izq"><small>MES</small><b class="y">0</b></div>
      ${rt('', 'HAS PAGADO <span class="t">480 €</span>')}${rt('', 'AÚN DEBES <span class="a">832 €</span>')}${nota(EJ)}`,
    anim: function (s, e, el) { const M = e.seg[0].marcas, m1 = M[1] != null ? M[1] : 1.2, m2 = M[2] != null ? M[2] : 2.2, r = el.querySelectorAll('.rt'), T24 = Math.max(0.9, m2 - 0.15);
      el.querySelector('.y').textContent = Math.round(24 * sale(tramo(s, 0.05, T24)));
      ver(el.querySelector('.chip'), s, 0.02); ver(r[0], s, m1 + 0.05, m2 + 0.05); ver(r[1], s, m2 + 0.1); ver(el.querySelector('.nota'), s, 0.2); } },
  // 3 · La norma: entra la información trimestral de ejemplo (nunca quieta); en {caja} la caja ámbar recorre «marzo de 2034» y,
  //     con «cuánto pagarás en intereses», «1.741,60 €».
  { html: () => `${EXTRACTO('e3')}${rt('amb p', 'AL MENOS <span class="a">CADA TRIMESTRE</span><small>ORDEN EHA/2899/2011 · ART. 33 QUINQUIES</small>')}`,
    anim: function (s, e, el) { const M = e.seg[0].marcas, m1 = M[1] != null ? M[1] : 2.2, m2 = M[2] != null ? M[2] : 3.6, m3 = M[3] != null ? M[3] : 4.6, c = el.querySelector('.ext');
      const ent = sale(tramo(s, 0.05, 0.6)), dr = tramo(s, 0.3, e.fin - e.ini);
      c.style.opacity = Math.min(1, ent * 1.4);
      c.style.transform = 'translateX(' + (-50 + 60 * (1 - ent)) + '%) perspective(1400px) rotateY(' + (-50 * (1 - ent) + 5 - 8 * dr + 12 * Math.sin(s * 1.9)) + 'deg) rotateZ(' + (2 - 3 * dr) + 'deg) scale(' + ((0.8 + 0.2 * ent) * (0.92 + 0.07 * dr)) + ')';
      c.querySelector('table').style.display = 'none';
      const b1 = c.querySelector('.b1'), b2 = c.querySelector('.b2');
      cajaEstilo(b1, rebote(tramo(s, m2 - 0.05, m2 + 0.3)) * (1 - 0.5 * tramo(s, m3, m3 + 0.3)), Math.round(100 * sale(tramo(s, m2 - 0.05, m2 + 0.6))));
      cajaEstilo(b2, rebote(tramo(s, m3 - 0.05, m3 + 0.3)), Math.round(100 * sale(tramo(s, m3 - 0.05, m3 + 0.6))));
      b1.style.transform = 'scale(' + (1 + 0.05 * Math.sin(PI * tramo(s, m2, m2 + 0.4))) + ')'; b2.style.transform = 'scale(' + (1 + 0.05 * Math.sin(PI * tramo(s, m3, m3 + 0.4))) + ')';
      ver(el.querySelector('.rt'), s, m1 + 0.05); } },
  // 4 · La cuota de un año: la tabla (fila roja 20 € · 7 años y 4 meses · 741,60 €; fila turquesa 91,16 € · 1 año · 93,88 €); sale la
  //     tarjeta y la torre roja (15) pierde 13 bloques → 2: «742 € → 94 €».
  { html: () => `${EXTRACTO('e4')}${rt('turq', 'INTERESES <span class="r">742 €</span> → <span class="t">94 €</span>')}
      ${nota('Cuota para liquidarlo en un año: 1.000 € en 12 cuotas iguales de 91,16 € al mismo tipo (ejemplo)')}`,
    anim: function (s, e, el) { const M = e.seg[0].marcas, m1 = M[1] != null ? M[1] : 1.3, m2 = M[2] != null ? M[2] : 2.9, m3 = M[3] != null ? M[3] : 4.0, c = el.querySelector('.ext');
      const va = suave(tramo(s, m3 - 0.45, m3 + 0.05)), dr = tramo(s, 0, m3);
      c.style.opacity = 1 - tramo(s, m3 - 0.15, m3 + 0.05);
      c.style.top = '470px';
      c.style.transform = 'translateX(' + (-50 - 130 * va) + '%) perspective(1400px) rotateY(' + (-6 + 9 * dr + 12 * Math.sin(s * 1.9)) + 'deg) rotateZ(' + (-1.2 + 2 * dr - 8 * va) + 'deg) scale(' + (1.0 + 0.05 * dr) + ')';
      c.querySelectorAll('.f, .b1').forEach(x => { x.style.display = 'none'; });
      c.querySelector('.b2').style.opacity = 0.45;
      const q1 = rebote(tramo(s, 0.05, 0.4)) * (1 - 0.6 * tramo(s, m1, m1 + 0.3)), q2 = rebote(tramo(s, m1, m1 + 0.35));
      filaEstilo(c.querySelector('tr.r1'), Math.min(1, q1), '220,38,38'); filaEstilo(c.querySelector('tr.r2'), Math.min(1, q2), '13,148,136');
      const td = c.querySelector('tr.r2 td'); td.style.transform = 'scale(' + (1 + 0.18 * Math.sin(PI * tramo(s, m2, m2 + 0.45))) + ')'; td.style.display = 'table-cell';
      ver(el.querySelector('.rt'), s, m3 + 0.3); ver(el.querySelector('.nota'), s, m2 + 0.1, m3 + 0.15); } },
  // 5 · Hoy: mini tarjeta «¿A FIN DE MES O APLAZADO? · CUOTA»; luego los 13 bloques rojos que ya no pagarías vuelven turquesa y
  //     forman una pila junto al maniquí. Corte seco sobre «UNA CUOTA PEQUEÑA LA ALARGA».
  { html: () => `<div class="mini" data-t="translateX(-50%)"><b>Tu tarjeta, en tu banca</b><div class="fila"><span>Modalidad</span><span><i>¿fin de mes o aplazado?</i></span></div><div class="fila"><span>Cuota</span><span><i>¿cuánto?</i></span></div></div>
      ${rt('roja', 'UNA CUOTA PEQUEÑA<br><span class="r">LA ALARGA</span>', 1250)}
      ${nota('Ejemplo · con 91,16 €/mes en vez de 20 €: 648 € menos de intereses')}`,
    anim: function (s, e, el) { const M = e.seg[0].marcas, m1 = M[1] != null ? M[1] : 1.5, m2 = M[2] != null ? M[2] : 2.6, m3 = M[3] != null ? M[3] : 3.6, m4 = M[4] != null ? M[4] : 5.3, mi = el.querySelector('.mini');
      const ent = rebote(tramo(s, 0, 0.4)), sal = suave(tramo(s, m3 - 0.1, m3 + 0.35)), fl = el.querySelectorAll('.fila');
      mi.style.opacity = Math.min(1, ent * 1.4) * (1 - sal);
      mi.style.transform = 'translateX(-50%) translateY(' + (-40 * sal) + 'px) rotate(' + (-3 + 2.5 * tramo(s, 0, m3) + 6 * sal) + 'deg) scale(' + ((0.7 + 0.3 * ent) * (1 + 0.06 * Math.sin(PI * tramo(s, m1, m1 + 0.45)) + 0.06 * Math.sin(PI * tramo(s, m2, m2 + 0.45)))) + ')';
      fl[0].style.background = 'rgba(245,185,74,' + (0.2 + 0.35 * Math.sin(PI * tramo(s, m1, m1 + 0.6))).toFixed(2) + ')';
      fl[1].style.background = 'rgba(245,185,74,' + (0.2 + 0.35 * Math.sin(PI * tramo(s, m2, m2 + 0.6))).toFixed(2) + ')';
      ver(el.querySelector('.rt'), s, m4 - 0.15); ver(el.querySelector('.nota'), s, m3 + 0.5); } }
];

const TRES = new Function('t', 'k', 's', 'e', 'W', `
  const X = W.X; X.apagar();
  const D = e.fin - e.ini, M = e.seg.flatMap(g => g.marcas);
  const mk = (j, def) => (M[j] != null ? M[j] : def);
  const q = (a, d) => sale(tramo(s, a, a + (d || 0.45)));
  const bote = (a, d) => rebote(tramo(s, a, a + (d || 0.35)));
  const LP = k === 0 ? 0 : k === 1 ? 1.7 : 2.3;
  const cam = (C) => { if (LP) C = deriva(C, s, LP); W.camara(C[0], C[1], C[2], C[3], C[4], C[5]); };
  const ROJ = '#f87171', TQ = '#5eead4', AMB = '#f5b94a', BLANCO = '#e2e8f0';
  const blanca = (o) => X.torre('blanca', Object.assign({ x: WX, z: 0 }, o));
  const roja = (o) => X.torre('roja', Object.assign({ x: RX, z: 0 }, o));
  const rojoB = (extra) => Object.assign({ color: ROJOH, brillo: 0.32 }, extra);
  const blancoB = (extra) => Object.assign({ color: BLANCOH, brillo: 0.06 }, extra);
  const fantB = (c, op) => ({ color: c, brillo: 0.6, op: op == null ? 0.13 : op });
  const LB = X.LB, TOP = 5 * LB;

  if (k === 0) {
    // ——— el gancho ———
    const TS = ${TSDE}, m2 = Math.max(mk(2, TS + 0.8), TS + 0.4), TC = TLG(TS)[9];
    const mes = mesG(s, TS), deb = Math.round(EN(mes)[0] / 50);
    const hincha = 1 + 0.08 * Math.sin(PI * tramo(s, TC, TC + 0.32)) + 0.05 * Math.sin(PI * tramo(s, TS, TS + 0.4));
    blanca({ inclina: 0.05 * Math.sin(PI * tramo(s, TC + 0.02, TC + 0.42)), bloque: (j) => j < deb ? blancoB() : fantB(BLANCOH, 0.12) });
    roja({ pulso: hincha, bloque: (j) => bloqueG(j, s, TS) });
    W.rotulo('t1000', '1.000 €', WX, TOP + 0.45, 0.4, 1, BLANCO, 0.5);
    // sello «7 AÑOS» en la torre roja cuando el contador se para
    const st = bote(TS, 0.32);
    if (s > TS - 0.05) {
      W.rotulo('s7', '7 AÑOS', RX, 1.6, 0.95, Math.min(1, st * 1.3), ROJ, 0.5 * (1 + 0.5 * (1 - Math.min(1, st))));
      if (s < TS + 0.3) X.halo({ x: RX, y: 1.6, z: 1.0, esc: 4.5, op: 0.55 * Math.sin(PI * tramo(s, TS, TS + 0.3)), color: '#fca5a5' });
    }
    if (s > TC && s < TC + 0.35) X.halo({ x: RX, y: 1.3, z: 0.5, esc: 3.6, op: 0.6 * Math.sin(PI * tramo(s, TC, TC + 0.35)), color: '#fecaca' });
    // la línea de 500 € (media torre blanca), encendida al cruzarla
    const lin = s > TC ? Math.exp(-(s - TC) * 3) : 0;
    X.bloque({ x: 0, y: 2.5 * LB + 0.03, z: 0.35, w: 5.0, h: 0.03, d: 0.03, color: '#e2e8f0', brillo: 0.8, op: 0.3 + 0.65 * lin });
    // cámara en tres planos con corte seco: travelling bajo → (corte) órbita de tres cuartos desde la izquierda → (corte)
    // contrapicado que empuja hacia el sello y retrocede. Nunca quieta.
    const C1 = Math.min(1.35, TS - 0.9), C2 = TS - 0.12;
    const C = planos([
      [0, [[0, [1.9, 1.0, 11.2, 0.0, 2.35, 0]], [0.62, [0.9, 1.6, 11.5, -0.1, 2.35, 0]], [C1 + 0.4, [-0.2, 2.3, 11.8, 0.0, 2.35, 0]]]],
      [C1, [[C1, orbita([-0.3, 3.6, 12.4, -0.3, 2.4, 0], -0.95)], [C2 + 0.3, orbita([-0.1, 2.6, 10.6, -0.1, 2.3, 0], -0.05)]]],
      [C2, [[C2, [RX + 1.6, 0.7, 9.4, RX - 0.2, 2.6, 0]], [TS + 0.5, [RX + 0.9, 1.0, 8.6, RX - 0.1, 2.4, 0]], [m2 + 0.6, [RX + 0.5, 1.4, 9.4, RX - 0.1, 2.3, 0]]]],
      [m2, [[m2, orbita([0.0, 3.4, 11.0, 0.0, 2.3, 0], -0.9)], [D + 0.6, orbita([0.1, 2.2, 12.6, 0.1, 2.4, 0], 0.55)]]]
    ], s);
    const sh = s > TC ? 0.06 * Math.exp(-(s - TC) * 11) : 0, sh2 = s > TS ? 0.05 * Math.exp(-(s - TS) * 12) : 0;
    cam([C[0] + (sh + sh2) * Math.sin(s * 83), C[1] + (sh + sh2) * Math.cos(s * 71), C[2], C[3], C[4], C[5]]);
  } else if (k === 1) {
    // ——— 88 barras iguales (una por cuota de 20 €), suben en ola desde la izquierda; el rojo encoge muy despacio ———
    const m1 = mk(1, 2.0), m2 = mk(2, 3.0), X0 = -3.0, PASO = 6.0 / (NM - 1), Y = 0.09;
    for (let b = 0; b < NM; b++) {
      const h = HIST[b + 1], u = sale(tramo(s, 0.02 + 0.009 * b, 0.32 + 0.009 * b)), x = X0 + b * PASO;
      if (u <= 0) continue;
      const hi = h[4] * Y * u, hp = (h[3] - h[4]) * Y * u, br = b === 0 ? 0.35 + 0.4 * q(m2, 0.3) * (0.6 + 0.4 * Math.sin(s * 10)) : 0.32;
      X.bloque({ x, y: hi / 2, z: 0, w: PASO * 0.72, h: hi, d: 0.5, color: '#ef4444', brillo: br });
      X.bloque({ x, y: hi + hp / 2 + 0.005, z: 0, w: PASO * 0.72, h: hp, d: 0.5, color: '#2dd4bf', brillo: 0.25 });
    }
    W.rotulo('p14', '14 €', X0 - 0.05, HIST[1][4] * Y * 0.5, 0.45, q(m2 + 0.05, 0.3), ROJ, 0.3);
    W.rotulo('p20', '20 €', X0 + 0.1, 20 * Y + 0.32, 0.2, q(0.5, 0.3), BLANCO, 0.3);
    W.rotulo('mm1', 'CUOTA 1', X0 + 0.2, 0.12, 0.75, q(0.3, 0.3), '#94a3b8', 0.2);
    W.rotulo('mm88', 'CUOTA 88', X0 + (NM - 1) * PASO - 0.5, 0.12, 0.75, q(1.0, 0.3), '#94a3b8', 0.2);
    // dos planos: travelling a lo largo de la fila (de la cuota 88 a la 1) → (corte en «de tus primeros 20 euros») primer plano bajo
    // de la cuota 1, que se abre en grúa a la vista general
    // un solo recorrido (los cortes los pone deriva() cada 1,9 s): de la cuota 88 a la vista general
    cam(ruta(orden([[0, [3.9, 1.4, 8.4, 1.0, 1.1, 0]], [m2, orbita([-0.6, 2.0, 10.0, -1.0, 1.0, 0], 0.3)], [D + 0.5, orbita([-0.6, 2.8, 10.6, -0.6, 1.1, 0], -0.22)]]), s));
  } else if (k === 2) {
    // ——— dos años: torre blanca entera, entran 24 cuotas (12 cubos turquesa del maniquí), se queda con 17 de 20; la roja sube a 6 ———
    const m2 = mk(2, 2.2), T24 = Math.max(0.9, m2 - 0.15), mes = 24 * sale(tramo(s, 0.05, T24)), h = EN(mes);
    const deb = Math.round(h[0] / 50), nr = Math.round(h[1] / 50);
    blanca({ bloque: (j) => j < deb ? blancoB({ brillo: 0.06 + 0.25 * q(m2, 0.3) * (0.5 + 0.5 * Math.sin(s * 11)) }) : fantB(BLANCOH, 0.12) });
    roja({ bloque: (j) => j < nr ? rojoB() : (j < 14 ? fantB(ROJOH, 0.06) : null) });
    const HX = 0.0, HZ = 2.6;
    W.heroe({ x: HX, z: HZ, gira: 0, luz: 0.85, visible: s < m2 + 0.2 });
    brazos(W.H, 1, 1 - 0.6 * Math.abs(Math.sin(s * 6)) * (1 - tramo(s, T24, T24 + 0.2)));
    const mp = manos(HX, HZ, 0, 1);
    for (let i = 0; i < 12; i++) {
      const t0 = 0.08 + i * (T24 - 0.2) / 12, v = tramo(s, t0, t0 + 0.45); if (v <= 0 || v >= 1) continue;
      const dest = i % 2 ? [WX + 0.2, TOP + 0.2, 0.3] : [RX - 0.2, 2 * LB, 0.3];
      const p = mezcla(mp, dest, suave(v)); p[1] += 0.9 * Math.sin(PI * v);
      X.bloque({ x: p[0], y: p[1], z: p[2], w: 0.2, h: 0.2, d: 0.2, color: '#2dd4bf', brillo: 0.5, rx: 4 * v, ry: 3 * v, op: 1 - tramo(v, 0.8, 1) });
    }
    W.rotulo('t1000b', '1.000 €', WX, TOP + 0.45, 0.4, 1, BLANCO, 0.42);
    cam(ruta(orden([[0, orbita([0.0, 1.6, 12.2, 0.0, 1.4, 0.8], 0.4)], [T24, orbita([0.0, 2.4, 12.6, 0.0, 1.4, 0.5], 0.1)],
      [m2 + 0.3, orbita([WX + 0.5, 1.9, 9.6, WX + 0.3, 1.3, 0], -0.14)], [D + 0.5, orbita([WX + 0.4, 1.8, 9.0, WX + 0.2, 1.25, 0], -0.28)]]), s));
  } else if (k === 3) {
    // ——— la norma: torres atenuadas (blanca en contorno + roja de 15) detrás de la tarjeta; corte en «a decírtelo» ———
    const m1 = mk(1, 2.2);
    X.apagon(0.55);
    blanca({ bloque: () => fantB(BLANCOH, 0.12) });
    roja({ bloque: (j) => rojoB({ brillo: 0.32 + 0.15 * Math.sin(s * 3 + j * 0.3) }) });
    cam(ruta(orden([[0, orbita([0.2, 2.0, 12.4, 0.2, 2.0, 0], 0.5)], [m1, orbita([0.2, 2.6, 11.0, 0.2, 1.9, 0], 0.1)], [D + 0.5, orbita([0.3, 2.6, 11.6, 0.3, 1.9, 0], -0.3)]]), s));
  } else if (k === 4) {
    // ——— la tabla y luego la torre roja pierde 13 bloques (15 → 2) en «y 94»: salen volando y se apagan ———
    const m3 = mk(3, 4.0);
    X.apagon(1 - 0.45 * (1 - tramo(s, m3 - 0.4, m3)));
    blanca({ bloque: () => fantB(BLANCOH, 0.12) });
    roja({ bloque: (j) => {
      if (j < 2) return rojoB();
      const tj = m3 + 0.1 + 0.02 * (14 - j), w = tramo(s, tj, tj + 0.6);
      if (w <= 0) return rojoB();
      if (w >= 1) return fantB(ROJOH, 0.1);
      const a = (j * 2.4) % (2 * PI);
      return rojoB({ dx: 2.2 * Math.cos(a) * w + 1.0 * w, dy: 2.4 * Math.sin(PI * Math.min(1, w * 1.3)) - 3 * w * w, dz: 2.0 * Math.abs(Math.sin(a)) * w, rx: 5 * w, rz: 4 * w, op: 1 - tramo(w, 0.7, 1) });
    } });
    if (s > m3 + 0.1 && s < m3 + 0.6) X.halo({ x: RX, y: 1.6, z: 0.6, esc: 4, op: 0.5 * Math.sin(PI * tramo(s, m3 + 0.1, m3 + 0.6)), color: '#99f6e4' });
    cam(ruta(orden([[0, orbita([0.3, 2.6, 11.0, 0.3, 2.2, 0], -0.32)], [m3 - 0.3, orbita([0.3, 2.4, 11.8, 0.3, 2.1, 0], -0.06)],
      [m3 + 0.6, orbita([0.7, 2.0, 10.4, 0.7, 1.6, 0], 0.2)], [D + 0.5, orbita([0.7, 1.8, 9.6, 0.7, 1.4, 0], 0.34)]]), s));
  } else {
    // ——— hoy: el maniquí anda hasta la torre roja (2 bloques, 13 en contorno); en {pop} los 13 vuelven turquesa y forman una pila
    //     donde estaba la blanca; el maniquí se gira hacia ella y levanta los brazos ———
    const m2 = mk(2, 2.6), m3 = mk(3, 3.6), m4 = mk(4, 5.3);
    roja({ bloque: (j) => j < 2 ? rojoB() : (j < 14 ? fantB(ROJOH, 0.1 + 0.12 * q(m2, 0.3) * (0.5 + 0.5 * Math.sin(s * 10))) : null) });
    const AH = { x: WX, z: 0 };
    X.torre('ahorro', Object.assign({}, AH, { bloque: (j) => {
      const tj = m3 + 0.05 + 0.03 * j, v = tramo(s, tj, tj + 0.4);
      if (v <= 0) return null;
      const src = X.dondeB({ x: RX, z: 0 }, 2 + j), dst = X.dondeB(AH, j);
      const p = mezcla(src, dst, suave(v)); p[1] += 1.6 * Math.sin(PI * v);
      return { color: TURQH, brillo: 0.4 + 0.3 * (1 - v), dx: p[0] - dst[0], dy: p[1] - dst[1], dz: p[2] - dst[2] + 0.6 * Math.sin(PI * v), rx: 4 * (1 - v), ry: 3 * (1 - v) };
    } }));
    const H0 = [3.6, 3.2], H1 = [0.0, 2.0], u = sale(tramo(s, 0, Math.max(1.2, m2 - 0.2))), hx = lerp(H0[0], H1[0], u), hz = lerp(H0[1], H1[1], u);
    const anda = u < 0.99, gAnda = Math.atan2(H1[0] - H0[0], H1[1] - H0[1]);
    W.heroe({ x: hx, z: hz, gira: anda ? gAnda : angulo(gAnda, PI + 0.5, q(m3 - 0.2, 0.4)), amp: anda ? 1 : 0, fase: s * 8, luz: 0.9 });
    brazos(W.H, q(m4 - 0.1, 0.35), 0);
    if (s > m3 && s < m3 + 0.5) X.halo({ x: WX, y: 1.0, z: 0.6, esc: 4, op: 0.5 * Math.sin(PI * tramo(s, m3, m3 + 0.5)), color: TQ });
    if (s > m3 + 0.6) W.rotulo('sav', '−648 €', WX, 4 * LB + 0.45, 0.4, q(m3 + 0.7, 0.3), TQ, 0.42);
    cam(ruta(orden([[0, [4.6, 1.4, 10.0, 1.4, 1.4, 1.2]], [m3, orbita([0.5, 1.7, 10.6, 0.5, 1.6, 0.6], 0.3)], [D + 0.6, orbita([-0.4, 2.8, 12.8, -0.4, 1.8, 0.4], -0.05)]]), s));
  }
  W.multitud(t, { directo: () => ({ x: -60, z: -60, esc: 0 }) });
`);

const pildoras = {
  'es-revolving-cuota': pildora3d({
    slug: 'es-revolving-cuota', cuenta: 'es',
    T: { es: { titulo: '1.000 € de Black Friday en la tarjeta, pagando 20 al mes: más de 7 años y 742 € de intereses', guion: GUION } },
    // Voz de narrador de la serie (VOZ_NARRADOR, la de es-iva-sobre-impuesto; nunca VOZ_SECA), un punto más rápida: a 1,2 y
    // pausas de 0,26 s salía a 3,17 palabras/s (objetivo 3,2–3,6). Mismas tomas: el tempo y las pausas se aplican en local.
    voz: { ...VOZ_NARRADOR, es: { ...VOZ_NARRADOR.es, tempo: 1.25, pausaMax: 0.2 } },
    fijo: () => `<div class="hud i fmt">HACEMOS LA CUENTA</div><div class="hud d"><i></i><span id="reloj">00:00</span></div>`,
    cssExtra: CSS, scriptExtra: SCRIPT,
    escenas: ESCENAS, tres: TRES,
    cola: 0.8, corte2d: 'seco',
    texto: { es: TEXTO }
  })
};

module.exports = { pildoras };
