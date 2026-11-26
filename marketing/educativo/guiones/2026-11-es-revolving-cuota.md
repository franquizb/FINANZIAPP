# 1.000 € de Black Friday en la tarjeta, pagando 20 al mes: más de 7 años y 742 € de intereses

Cuenta: **@finanziapp.es (España, español de España, euros)**. Serie «Hacemos la cuenta» (HUD «HACEMOS LA CUENTA»).
Slug: **`es-revolving-cuota`** (comprobado el 26-nov-2026 con grep: no existe en publicados.json, cuaderno.json, portadas.json,
reels-voz/ ni out-reels/). Archivo del Reel: **`reels-voz/extenso-revolving-es.js`** (nuevo) · `pildora3d` · `arranque: 'lleno'`.
Publicación prevista: **lunes 30-nov-2026 por la mañana (Madrid)**, el lunes después del Black Friday (27-nov). Duración
objetivo 35–50 s; prevista **≈40 s**.
Modelo: `en-mortgage-rate` (1.884 vistas, 10 guardados: una cifra de intereses que crece delante de ti) y su derivado
`reels-voz/extenso-tarjeta-en.js` (en-credit-card-minimum, mismo mundo de torres de bloques). Lo que falló y se evita:
es-paga-extra (abría con documentos llenos de texto pequeño): aquí, en 0–0,7 s, un objeto grande (la torre «1.000 €») y una
cifra enorme que cambia (el contador rojo de intereses).

## Fuentes (todas consultadas el 26-nov-2026)

- **Tipo medio** — Banco de España, Boletín Estadístico, cuadro **19.4** «Tipos de interés (TEDR) de nuevas operaciones.
  Préstamos y créditos a hogares e ISFLSH», columna 7 «Tarjetas de crédito y tarjetas "revolving"» (nota b: «tarjetas para las
  que los titulares han solicitado el pago aplazado y tarjetas "revolving"»): **septiembre de 2026 (provisional) = 18,27 %**
  (ago 18,22; jul 18,26; jun 18,30; media de 2024 18,54). PDF generado el 30-oct-2026.
  https://www.bde.es/webbe/es/estadisticas/compartido/datos/pdf/a1904.pdf (mismo dato en el cuadro 19.3, col. 4:
  https://www.bde.es/webbe/es/estadisticas/compartido/datos/pdf/a1903.pdf).
  Matiz: el Banco de España publica el **TEDR** (tipo efectivo sin comisiones ni seguros), **no una TAE**, para estas tarjetas.
  El vídeo dice «el tipo medio de estas tarjetas en España» y la nota de pantalla «18,27 % TEDR, Banco de España, sept. 2026».
- **La norma** — Orden EHA/2899/2011, de transparencia y protección del cliente de servicios bancarios, texto consolidado del
  BOE (última actualización publicada el 27/07/2020): https://www.boe.es/buscar/act.php?id=BOE-A-2011-17015
  - **Art. 33 bis**: crédito revolvente = crédito al consumo de duración indefinida o prorrogable «en el que el crédito
    dispuesto no se satisface en su totalidad al final del período de liquidación pactado».
  - **Art. 33 quinquies.1**: la entidad debe suministrar al cliente «con periodicidad **al menos trimestral**»: a) el crédito
    dispuesto; b) el tipo deudor; c) la modalidad de pago, «señalando expresamente el término "revolving"» y la cuota;
    d) la **fecha estimada en la que terminará de pagar** con la cuota actual y «la cuantía total, desglosando principal e
    intereses, que acabaría pagando» si no hay más disposiciones ni cambia la cuota.
  - **Art. 33 quinquies.3**: cuando la cuota sea inferior al porcentaje del art. 18.2.e) (que las cuotas anuales tengan
    por objetivo amortizar al menos el **25 % del límite** al año), la entidad añade: a) escenarios con la cuota subida un
    20, 50 y 100 %, y b) **«el importe de la cuota mensual que permitiría liquidar toda la deuda en el plazo de un año»**.
  - **Art. 18.2.e)**: evaluación de solvencia del revolving con cuotas que amorticen al menos el 25 % anual del límite.
  - **Art. 33 sexies.1**: a petición del cliente, en 5 días hábiles, cuadro de amortización y desglose (solo en el texto).
- **Desde cuándo** — Orden ETD/699/2020, de 24 de julio (BOE 27-07-2020), art. 3.6 (añade el 33 quinquies) y disposición
  final segunda d): **en vigor desde el 27-01-2021**; solo los escenarios del 33 quinquies.3.a) quedan aplazados (disp. final
  2.ª b). https://www.boe.es/boe/dias/2020/07/27/pdfs/BOE-A-2020-8583.pdf · nota del consolidado: «Se añade, con efectos de 27
  de enero de 2021, por el art. 3.6 de la Orden ETD/699/2020».
- **Comprobación de vigencia** — Orden ECM/531/2026 (BOE 29-05-2026, BOE-A-2026-11586): recuerda que la STS 519/2025 anuló los
  artículos **primero y segundo** de la Orden ETD/699/2020 (Central de Riesgos y publicidad) y los vuelve a introducir; el
  artículo **tercero** (el que cambia la Orden EHA/2899/2011 y crea el 33 quinquies) **no se anuló**.
  https://www.boe.es/boe/dias/2026/05/29/pdfs/BOE-A-2026-11586.pdf
- **No se menciona** la futura ley de contratos de crédito al consumo: a 26-nov-2026 es un anteproyecto (Consejo de Ministros,
  7-ene-2026; informe de la CNMC de sept. 2026), no está en el BOE. Tampoco sentencias de usura.
- **Todas las cifras de la tarjeta son un EJEMPLO** (cálculo propio, amortización mes a mes en `cuadra()`): 1.000 € dispuestos,
  sin más compras ni comisiones ni seguros, cuota fija de 20 €/mes, tipo 18,27 % tomado como efectivo anual → interés mensual
  (1,1827)^(1/12) − 1 = 1,408 %. (Si se tomara 18,27 % como nominal /12 = 1,5225 % mensual, saldría peor: 94 cuotas y 825 €;
  usamos la versión más prudente.) Rótulo «EJEMPLO» en pantalla desde el fotograma 0 y en el texto.

## Gancho visual, de 0 a 3 s (medio segundo a medio segundo)

**Idea sin sonido:** una torre blanca de 20 bloques con la etiqueta **«1.000 €»** (1 bloque = 50 €: lo que compraste) y, al
lado, bloques rojos que **llueven** y levantan la torre de intereses. Un **contador rojo enorme** («INTERESES PAGADOS») sube sin
parar, un chip «MES» corre de 6 a 88 y otro fijo dice «CUOTA 20 €/MES», mientras la torre blanca apenas pierde bloques (los
pagados quedan en contorno).

| Tiempo | Qué se ve | Cámara | Rótulo / sonido |
|---|---|---|---|
| **0,0 s** (en acción) | Mes 6: blanca con 19 bloques sólidos y 1 en contorno; roja con 1 bloque y otro cayendo. Contador enorme «83 €» subiendo; «aún debes 963 €». Etiqueta 3D «1.000 €». Chip «CUOTA 20 €/MES». | Travelling bajo de derecha a izquierda ya en marcha. | whoosh |
| **0,5 s** | Mes 34: la roja va por 8 bloques; la blanca, 15. | Sigue, grúa arriba. | — |
| **0,62 s** (el acontecimiento) | Mes 42: el contador pasa de **500 €**; cae el bloque 10 (la roja = media blanca): destello, la roja se hincha. | Sacudida corta. | **INTERESES > 500 €** |
| **1,0–1,6 s** | Meses 50 → 62: la blanca casi vacía (contorno). | **Corte** a plano de tres cuartos desde la izquierda. | tic |
| **2,0–2,6 s** | Meses 70 → 88: el contador frena en **742 €**; sello **«7 AÑOS»** en la roja. | **Corte** a contrapicado y golpe de zoom en el sello. | pop · **7 AÑOS Y 4 MESES** |
| **3,0 s** | Plano doble: blanca en contorno y roja con 14 bloques y una lámina. | Retroceso en órbita. | — |

**Por qué se entiende sin sonido:** «1.000 €» + «CUOTA 20 €/MES» + una cifra roja enorme que sube + «7 AÑOS». Lo que se mueve
son los bloques, las torres, el contador y la cámara (dos cortes antes de los 3 s).

## Guion final (formato del motor)

```
[0, '1.000 euros de Black Friday en la tarjeta, §pagando 20 al mes: §{pop}*más de 7 años* §y *742 euros* de intereses.'],
[1, '¿Por qué tanto? §Al tipo medio de estas tarjetas en España, §de tus primeros 20 euros, §*14 son intereses*.'],
[2, '§Tras dos años pagando, §has puesto 480 euros §y aún debes *832*.'],
[3, '¿Y cómo sabes cuánto te queda? §Desde 2021, una norma obliga al banco §a decírtelo *al menos cada trimestre*: §{caja}cuándo terminarás §y cuánto pagarás en intereses.'],
[4, '§{ding}Y si tu cuota es muy baja, §también qué cuota lo liquida en un año: §aquí, *91 euros al mes* §y *94* de intereses, §no 742.'],
[5, 'Hoy, §mira en tu banca cómo pagas la tarjeta: §a fin de mes o aplazado, §y qué cuota tienes. §{pop}Una cuota pequeña no abarata la compra: §*la alarga*.']
```

Funciones: 0 gancho (cifra + contradicción: cuota pequeña, deuda eterna); 1 respuesta (por qué: 14 de 20 € son intereses);
2 lo que no se ve (casi no baja); 3 pregunta del espectador + dato que casi nadie sabe (la información trimestral obligatoria);
4 el pico (cuota para liquidarlo en un año: 91 € y 94 € frente a 742 €); 5 acción para hoy + cierre repetible («una cuota
pequeña no abarata la compra: la alarga»).

## Palabras y duración prevista

≈122 palabras habladas (las cifras se leen como palabras). A 3,2–3,6 palabras/s: **34–38 s** de voz + pausas y cola 0,8 s ≈
**38–42 s**.

## Rótulos obligatorios (pantalla, no voz)

- Nota del gancho y de las escenas de cálculo: «Ejemplo: 1.000 € · cuota fija 20 €/mes · 18,27 % (tipo medio, Banco de España,
  sept. 2026) · sin más compras ni comisiones».
- Escena 3: tarjeta genérica «EJEMPLO · INFORMACIÓN TRIMESTRAL · CRÉDITO REVOLVING» con los campos del art. 33 quinquies
  (sin banco ni marca) y chip «ORDEN EHA/2899/2011 · ART. 33 QUINQUIES».

## Escena → qué se ve (animación 3D)

| Escena | Voz | Qué se ve | Cámara |
|---|---|---|---|
| 0 | gancho | Lo de la tabla de 0–3 s; al final, «742 €» y el sello se quedan. | travelling → corte → órbita → corte → retroceso |
| 1 | 14 son intereses | Una fila de 88 barras iguales en el suelo (una por cuota de 20 €): roja abajo (intereses del mes) y turquesa arriba (lo que baja la deuda). La primera: 14,08 rojo / 5,92 turquesa; el rojo encoge muy despacio. Rótulo «DE 20 €: 14 € INTERESES». Corte a mitad de frase. | travelling bajo junto a la fila → corte → grúa a vista general |
| 2 | dos años | Torre blanca entera de nuevo; chip «MES» 0 → 24; el maniquí turquesa lanza pagos; la blanca solo pierde 3 bloques (→ 17) y la roja sube a 6. «HAS PAGADO 480 €» → «AÚN DEBES 832 €». | órbita que se acerca y sube |
| 3 | al menos cada trimestre | Torres atenuadas; entra la tarjeta del ejemplo (en movimiento); en {caja} la caja ámbar recorre «Terminarías de pagar · marzo de 2034» y «Total: 1.741,60 € (intereses 741,60 €)». | push lento |
| 4 | 91 euros al mes | Se ilumina en la tarjeta «Cuota para liquidarlo en 1 año: 91,16 €/mes» (fila turquesa) frente a «Cuota actual 20 €: 7 años y 4 meses · 741,60 €» (fila roja). Sale la tarjeta y la torre roja (15) pierde 13 bloques → 2. Rótulo «INTERESES 742 € → 94 €». | retroceso y órbita |
| 5 | la alarga | Mini tarjeta «¿FIN DE MES O APLAZADO? · CUOTA» que entra; luego los 13 bloques rojos vuelven turquesa a la pila del maniquí. Corte seco sobre «UNA CUOTA PEQUEÑA LA ALARGA». | órbita baja que sube |

## Cuentas a comprobar con `cuadra()` (copiadas en la cabecera de `reels-voz/extenso-revolving-es.js`)

```js
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
// fecha estimada (tarjeta de la escena 3): primera cuota en diciembre de 2026 → cuota 88 en marzo de 2034
cuadra('fin de pago', (() => { const d = new Date(Date.UTC(2026, 11, 1)); d.setUTCMonth(d.getUTCMonth() + N - 1); return d.toISOString().slice(0, 7); })(), '2034-03');
// 25 % del límite: con un límite de 1.000 €, 20 €/mes amortiza el primer año muchísimo menos de 250 €
cuadra('amortizado el primer año', Math.round(B - H[12].s), 77);
```

Comprobadas con node el 26-11-2026 (todas pasan). Con 30 €/mes: 46 cuotas y 360 € de intereses (solo en el texto).

## Texto de la publicación (≤ 1.900 caracteres)

```
1.000 € de Black Friday en la tarjeta, pagando 20 € al mes: más de 7 años y 742 € de intereses.

Con una cuota fija tan baja, de tus primeros 20 €, 14 se van en intereses. En este ejemplo, a los 2 años has pagado 480 € y aún debes 832 €. Con 30 € al mes serían casi 4 años y 360 €; pagado en 3 meses (343 € al mes), unos 28 €.

Lo que casi nadie sabe: en España, si tu tarjeta es revolving (pago aplazado), el banco tiene que informarte al menos cada trimestre de la cuota, la fecha estimada en la que terminarás de pagar y lo que pagarás en total, con los intereses desglosados. Si tu cuota no llega a amortizar el 25 % del límite al año, además tiene que decirte qué cuota liquidaría la deuda en un año (aquí, 91 € al mes y 94 € de intereses). Y puedes pedirle el cuadro de amortización: te lo da en 5 días hábiles.

Hoy: entra en tu banca, mira la modalidad de pago de tu tarjeta (a fin de mes o aplazado) y qué cuota tienes.

Ejemplo: 1.000 € dispuestos, cuota fija de 20 €/mes, tipo del 18,27 %, sin más compras, comisiones ni seguros. Cada contrato tiene sus condiciones.
Fuentes: Banco de España, Boletín Estadístico, cuadro 19.4 (tarjetas de pago aplazado y revolving, TEDR, septiembre de 2026: 18,27 %) · Orden EHA/2899/2011, arts. 18.2.e), 33 quinquies y 33 sexies (en la redacción de la Orden ETD/699/2020), BOE.
Contenido educativo, no es asesoramiento financiero.

#finanzaspersonales #tarjetadecredito #ahorro
```

## Portada

- titulo: **«1.000 € a 20 al mes: 7 años pagando»** · destacado: «7 años» · color: rojo · serie hacemos-la-cuenta ·
  fotograma: el sello «7 AÑOS» (≈3,7 s) · encuadre_y 600.

## Verificación (26-nov-2026, revisión escéptica)

- **18,27 %**: reabierto el PDF del cuadro 19.4 (generado el 30-oct-2026); columna 7, fila «Sep P». Es provisional y es **TEDR**,
  no TAE: no incluye comisiones ni seguros (nota a del cuadro). El brief pedía «TAE»: el Banco de España no publica TAE de estas
  tarjetas; se dice «tipo medio» y la nota lo llama TEDR. Las TAE reales de los contratos suelen ser más altas (comisiones,
  seguros), así que el ejemplo no exagera.
- **Cálculo**: interés mensual equivalente al 18,27 % efectivo anual (la opción prudente). Los bancos liquidan con días reales y
  su propio tipo nominal: cambia céntimos o algún mes, no el orden de magnitud. Todo rotulado «EJEMPLO».
- **«Más de 7 años»**: 88 cuotas = 7 años y 4 meses (la última, 1,60 €). Correcto.
- **«De tus primeros 20 euros, 14 son intereses»**: 14,08 € (primer mes). Correcto.
- **«Desde 2021, una norma obliga al banco a decírtelo al menos cada trimestre: cuándo terminarás y cuánto pagarás en intereses»**:
  art. 33 quinquies.1 d) (fecha estimada + cuantía total desglosando principal e intereses), en vigor el 27-01-2021. «Una norma»
  (es una orden ministerial, no una ley): no se dice «ley». Solo aplica al crédito revolvente (tarjeta en pago aplazado que no se
  liquida entera a fin de mes), que es el caso del vídeo.
- **«Y si tu cuota es muy baja, también qué cuota lo liquida en un año»**: art. 33 quinquies.3.b). «Muy baja» simplifica «inferior
  al porcentaje del art. 18.2.e)» (25 % del límite al año); el texto de la publicación lo dice exacto. Con 20 €/mes el primer año
  amortizas 77 € de 1.000: por debajo con cualquier límite ≥ 308 €. Los escenarios del 33 quinquies.3.a) (subir la cuota un 20/50/100 %)
  no se mencionan porque su entrada en vigor quedó aplazada (disp. final 2.ª b).
- **91 € y 94 €**: cuota constante a 12 meses al mismo interés: 91,16 € y 93,88 €. Correcto.
- **«A fin de mes o aplazado»**: neutral; no se afirma que fin de mes sea siempre gratis.
- Sin bancos ni marcas («Black Friday» es el nombre del día de rebajas, no una marca), sin política, sin «si te pica», sin anunciar
  otro vídeo. España: «en España» en la frase 1 y en el texto, euros.
