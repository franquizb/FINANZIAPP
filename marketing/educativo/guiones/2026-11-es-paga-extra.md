# Tu paga extra: 2.000 € brutos, igual que tu nómina… y te llegan 152 € más

- Slug: `es-paga-extra` · cuenta `es` (@finanziapp.es) · archivo `reels-voz/extenso-paga-extra-es.js`
- Publicación prevista: miércoles 25/11/2026 por la mañana (España). Vale hasta pasada la paga de diciembre.
- Formato extenso en 3D (tres.js), píldora «Hacemos la cuenta». Duración objetivo 35–50 s.
- Tema: «algo que te cobran sin que lo sepas»: la Seguridad Social de tus pagas extra la pagas a plazos en cada nómina.

## Fuentes (todas consultadas el 23/11/2026)

| Dato | Fuente primaria | URL |
|---|---|---|
| Las pagas extra se prorratean en la base de cotización de los 12 meses («Las percepciones de vencimiento superior al mensual se prorratearán a lo largo de los doce meses del año») | Real Decreto Legislativo 8/2015, Ley General de la Seguridad Social, art. 147.1 (texto consolidado, última actualización publicada el 11/11/2026) | https://www.boe.es/buscar/act.php?id=BOE-A-2015-11724#a147 |
| Cómo se calcula la base de cada mes en 2026: remuneración devengada en el mes + parte proporcional de las gratificaciones extraordinarias (si el sueldo es mensual, importe anual estimado ÷ 12) | Orden PJC/297/2026, de 30 de marzo (BOE n.º 79, 31/03/2026), art. 1.1, normas primera y segunda | https://www.boe.es/boe/dias/2026/03/31/pdfs/BOE-A-2026-7296.pdf |
| Tipos del trabajador 2026: contingencias comunes 4,70 % (art. 4.a); MEI 0,15 % (art. 16); desempleo 1,55 % contrato indefinido / 1,60 % duración determinada (art. 33.2.a); formación profesional 0,10 % (art. 33.2.c). Base máxima 5.101,20 €/mes | Orden PJC/297/2026 (misma URL) | https://www.boe.es/boe/dias/2026/03/31/pdfs/BOE-A-2026-7296.pdf |
| La retención es el tipo × la cuantía total de cada pago (el mismo tipo para nóminas y pagas extra), con las regularizaciones del art. 87 | Real Decreto 439/2007, Reglamento del IRPF, arts. 80.1 y 82.5.ª; art. 86.1 (tipo = cuota ÷ retribución anual, dos decimales); art. 87 (regularización) | https://www.boe.es/buscar/act.php?id=BOE-A-2007-6820#a82 |
| Cálculo del tipo del ejemplo (nota del texto): base = retribución − cotizaciones − 2.000 € de otros gastos (art. 83.3 RIRPF; art. 19.2.f LIRPF); escala de retención 19/24/30/37 % (art. 85.1 RIRPF); mínimo del contribuyente 5.550 € (art. 57 LIRPF; art. 84 RIRPF) | RIRPF y Ley 35/2006 del IRPF | https://www.boe.es/buscar/act.php?id=BOE-A-2007-6820#a85 · https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764#a19 |

Lo que NO se afirma: que todas las pagas extra sean iguales al sueldo mensual (depende del convenio: a veces es solo salario base + antigüedad); que nunca haya ajustes (si la extra real difiere de la estimada, la empresa regulariza; si la empresa cambia tu retención en diciembre, cambia el IRPF de ese mes). Por eso el vídeo habla de un ejemplo y el texto lo matiza.

## Gancho visual, de 0 a 3 s (medio segundo a medio segundo)

Dos nóminas de papel (1,3 × 1,8 m) caen girando sobre el suelo oscuro: la izquierda dice «NÓMINA», la derecha «PAGA EXTRA»; las dos, «BRUTO 2.000 €» en grande. Rótulo 2D desde el fotograma 0: «MISMO BRUTO: 2.000 €».

- 0,0–0,5 s: las dos hojas ya están cayendo y girando (fotograma 0 en acción); la cámara baja hacia ellas con un giro.
- 0,5 s: aterrizan de pie con rebote y un destello; la cámara frena delante de las dos.
- 0,6–1,0 s: a la NÓMINA se le arranca la franja roja «SEG. SOCIAL −152 €»: se rompe en trozos rojos que salen volando. A la PAGA EXTRA no le pasa nada (su línea dice «SEG. SOCIAL 0 €» en turquesa). Rótulo: «SEG. SOCIAL: −152 €».
- 1,0–1,5 s: latigazo de cámara hacia la extra; a las dos se les corta a la vez la franja gris «IRPF 15 % −300 €».
- 1,5–2,5 s: suben dos columnas de monedas: 1.548 € (gris) y 1.700 € (turquesa); la de la extra sobresale.
- 2,2–3,0 s: el remate turquesa de 152 € salta encima de la columna de la extra con un destello (rótulo «+152 € EN LA EXTRA»); plano general en movimiento.

Sin sonido: mismo bruto → a una le arrancan un trozo rojo → la otra acaba más alta, +152 €.

## Guion final (formato del motor)

```js
[0, 'Tu paga extra: 2.000 euros brutos, §igual que tu nómina. §{pop}Y te llegan *152 euros más*.'],
[1, 'En España, §la paga extra *no lleva Seguridad Social*. §Solo §{ding}*IRPF*, al mismo tipo que cada mes.'],
[2, 'Con 2.000 brutos, catorce pagas y un 15 % de retención, §tu nómina se queda en *1.548 euros*. §{caja}La extra, en *1.700*.'],
[3, '¿Te libras de pagarla? §{tic}*No*: ya la has pagado, a plazos.'],
[4, 'La ley reparte tus dos pagas extra §entre los doce meses: §cada nómina cotiza por *2.333 euros*, no por 2.000. §Son *22 euros al mes* que pagas por adelantado.'],
[5, 'Mira hoy tu nómina §y busca la *base de cotización*: §si supera tu bruto, ahí están tus pagas extra. §{pop}*La extra no es un regalo: ya la cotizaste*.']
```

Estructura: gancho con cifra y contradicción (0) → respuesta corta (1) → la cuenta (2) → la pregunta del espectador (3) → el dato que casi nadie sabe, en el último tercio: tu base de cotización es más alta que tu sueldo y pagas 22 € al mes por adelantado (4) → acción para hoy y cierre repetible (5).

## Palabras y duración

~118 palabras habladas. Con VOZ_NARRADOR (~3,4 palabras/s) ≈ 35 s de voz + cortes y cola ≈ 40–44 s.

## Escenas 3D frase a frase

| Escena | Frase | Qué se ve | Cámara |
|---|---|---|---|
| 0 | «Tu paga extra… 152 euros más» | Gancho de arriba. Al final, «+152 €» turquesa sobre la columna de la extra | Bajada en giro, frenada, latigazo, general |
| 1 | «En España… al mismo tipo que cada mes» | Un bloque rojo «SEG. SOCIAL» baja hacia la paga extra y rebota en una barrera turquesa; en el ding, dos fichas grises «IRPF 15 %» iguales caen a la vez sobre las dos hojas | Travelling lateral de la extra a las dos |
| 2 | «Con 2.000 brutos… La extra, en 1.700» | Las columnas de monedas crecen de nuevo con su cifra; el trozo de más de la extra brilla en turquesa | Barrido bajo por las columnas |
| 3 | «¿Te libras de pagarla? No…» | El maniquí mira la columna; en el tic el trozo de +152 se vuelve rojo y se parte | Empuje rápido |
| 4 | «La ley reparte… por adelantado» | Doce nóminas pequeñas en arco (ENE…DIC). Cada una lleva un bloque de 2.000 y encima una loncha ámbar de 333 → «BASE 2.333 €». De cada mes sale una ficha roja «22 €» que vuela a las dos pagas extra (JUN y DIC), que se llenan | Grúa que recorre el arco y se abre al general |
| 5 | «Mira hoy tu nómina… ya la cotizaste» | El maniquí turquesa sostiene su nómina; la línea «BASE DE COTIZACIÓN 2.333,33» se enciende en ámbar frente a «BRUTO 2.000». Al final, sello turquesa «YA COTIZADA» sobre la paga extra; la cola vuelve al encuadre del gancho | Sobre el hombro → general → bucle |

## Cuentas (cuadra)

```js
const B = 2000, PAGAS = 14, TIPO = { cc: 4.70, desempleo: 1.55, fp: 0.10, mei: 0.15 };
const r2 = (x) => Math.round(x * 100) / 100;
const t = (TIPO.cc + TIPO.desempleo + TIPO.fp + TIPO.mei) / 100;
cuadra('tipo del trabajador 2026 (contrato indefinido)', r2(t * 100), 6.5);
const BASE = B * PAGAS / 12;
cuadra('base de cotización mensual (2.000 × 14 ÷ 12)', r2(BASE), 2333.33);
cuadra('«2.333 euros»', Math.round(BASE), 2333);
const SS = BASE * t;
cuadra('Seguridad Social de cada nómina', r2(SS), 151.67);
const RET = 0.15, IRPF = B * RET;
cuadra('IRPF 15 % de 2.000', IRPF, 300);
const NOMINA = B - SS - IRPF, EXTRA = B - IRPF;
cuadra('neto nómina', r2(NOMINA), 1548.33);
cuadra('«1.548 euros»', Math.round(NOMINA), 1548);
cuadra('neto extra', EXTRA, 1700);
cuadra('«152 euros más» (= SS de la nómina)', Math.round(EXTRA - NOMINA), 152);
cuadra('152 también con las cifras redondeadas', 1700 - 1548, 152);
cuadra('diferencia = SS, sea cual sea la retención', r2((B - B * 0.1559) - (B - SS - B * 0.1559)), 151.67);
cuadra('SS de la nómina por su sueldo (2.000 × 6,5 %)', B * t, 130);
cuadra('«22 euros al mes» (prorrata de las extras)', r2((BASE - B) * t), 21.67);
cuadra('22 redondeado', Math.round((BASE - B) * t), 22);
cuadra('12 meses de prorrata = SS de dos extras', r2(12 * (BASE - B) * t), r2(2 * B * t));
cuadra('130 + 21,67 = 151,67', r2(B * t + (BASE - B) * t), 151.67);
cuadra('loncha de cada mes = 2.000 × 2 ÷ 12', r2(B * 2 / 12), 333.33);
cuadra('bruto anual', B * PAGAS, 28000);
// Tipo real del ejemplo (soltero, sin hijos, indefinido, sin otras circunstancias): RIRPF arts. 83–86
const anual = B * PAGAS, base = anual - SS * 12 - 2000;
cuadra('cotizaciones del año', r2(SS * 12), 1820);
cuadra('base para el tipo de retención', r2(base), 24180);
const escala = (b) => { let c = 0, r = b; for (const [w, p] of [[12450, .19], [7750, .24], [15000, .30], [24800, .37]]) { const x = Math.min(r, w); c += x * p; r -= x; if (r <= 0) break; } return c; };
cuadra('cuota de retención', r2(escala(base) - escala(5550)), 4365);
cuadra('tipo de retención del ejemplo', r2((escala(base) - escala(5550)) / anual * 100), 15.59);
cuadra('debajo del límite del 43 % (art. 85.4), mínimo excluido 15.876 €', r2(escala(base) - escala(5550)) < 0.43 * (anual - 15876), true);
cuadra('base por debajo de la máxima de 2026', BASE < 5101.20, true);
```

Comprobadas con node el 23/11/2026 (todas pasan).

## Texto de la publicación

```
Tu paga extra de diciembre: 2.000 € brutos, igual que tu nómina… y te llegan 152 € más. No es un regalo. 💶

• En España, las pagas extra se reparten entre los 12 meses para cotizar a la Seguridad Social (art. 147 de la Ley General de la Seguridad Social). Por eso la paga extra normalmente no lleva descuento de Seguridad Social: lo has ido pagando en cada nómina.
• Sí lleva IRPF, al mismo tipo de retención que el resto del año, salvo que tu empresa lo regularice ese mes.
• El ejemplo: 2.000 € brutos al mes en 14 pagas (28.000 € al año), contrato indefinido. En 2026 el trabajador cotiza un 6,50 % (4,70 contingencias comunes + 1,55 desempleo + 0,10 formación + 0,15 MEI) sobre una base de 2.333,33 €: 151,67 € al mes. Con un 15 % de retención, la nómina queda en 1.548,33 € y la extra en 1.700 €. Para una persona soltera y sin hijos con ese sueldo, el cálculo de Hacienda da una retención de en torno al 15,6 %, y la diferencia sigue siendo de 151,67 €: el IRPF es el mismo en las dos.
• Si cobras las pagas prorrateadas, no hay extra en diciembre: cada nómina ya es de 2.333,33 € brutos. Cuánto vale tu extra (el sueldo entero o solo el salario base) lo dice tu convenio.

Para hoy: abre tu última nómina y busca la base de cotización por contingencias comunes. Si es más alta que tu bruto del mes, ahí está la parte de tus pagas extra.

Guárdalo 🔖 y mándaselo a quien cree que la extra es un regalo.

¿Tú cobras 14 pagas o las tienes prorrateadas? 👇

Contenido educativo, no es asesoramiento financiero.

Fuentes: Real Decreto Legislativo 8/2015 (Ley General de la Seguridad Social), art. 147.1; Orden PJC/297/2026 de cotización (BOE 31/03/2026), arts. 1, 4, 16 y 33; Reglamento del IRPF (RD 439/2007), arts. 80–87; Ley 35/2006 del IRPF, arts. 19 y 57. Cifras: ejemplo. Consultado el 23/11/2026.

#nomina #pagaextra #finanzaspersonales #educacionfinanciera #dinero
```

## Portada (portadas.json)

```json
"es-paga-extra": { "titulo": "Paga extra: +152 € y no es un regalo", "destacado": "+152 €", "color": "turq", "serie": "hacemos-la-cuenta", "fotograma_ms": 2900, "encuadre_y": 700 }
```

## Para los comentarios

- «A mí me la descuentan»: si tu empresa paga la extra prorrateada, o regulariza la retención en diciembre, el recibo cambia; lo normal con 14 pagas es que la extra no lleve línea de Seguridad Social.
- «Mi extra es más pequeña»: el importe lo fija el convenio (muchas veces, salario base + antigüedad); la regla de cotización es la misma.

## Verificación (23/11/2026, auto-verificación escéptica)

Fuentes reabiertas en el BOE (descargadas y leídas, no resúmenes de terceros):
- LGSS art. 147.1 (consolidado, actualización publicada el 11/11/2026): la frase del prorrateo está literal. ✔
- Orden PJC/297/2026 (PDF del BOE): art. 1.1 normas 1.ª y 2.ª (prorrata ÷ 12 con sueldo mensual), art. 4.a (4,70 %), art. 16 (MEI 0,15 %), art. 33.2.a.1.º (desempleo 1,55 % indefinido; 1,60 % duración determinada, art. 33.2.a.2.º), art. 33.2.c (FP 0,10 %), base máxima 5.101,20 €. ✔ Con contrato temporal el trabajador pagaría 6,55 % y la diferencia sería 152,83 € (sigue redondeando a 153; el vídeo dice «ejemplo» y el texto dice «contrato indefinido»).
- RIRPF arts. 80.1, 82.5.ª, 86.1, 87: mismo tipo para todos los pagos, salvo regularización. ✔ Arts. 81 (15.876 € «otras situaciones», incluye soltero sin hijos), 83.3, 84, 85.1 y LIRPF arts. 19.2.f y 57 para el 15,59 % del texto. ✔ La reducción del art. 20 LIRPF no aplica (rendimiento neto 26.180 € > 19.747,5 €) y la minoración del art. 85.3 tampoco (28.000 € > 23.171,89 €).

Cuentas rehechas con node desde cero: 6,50 %; 2.333,33; 151,67; 1.548,33; 1.700; 152; 21,67 → 22; 12 × 21,67 = 260 = 2 × 130; 15,59 %. Todas cuadran (el archivo del Reel no carga si alguna falla).

Frases revisadas:
- «La paga extra no lleva Seguridad Social»: cierto con 14 pagas porque su cotización va en la base de cada mes; el texto añade «normalmente», el caso de las pagas prorrateadas y que el importe de la extra depende del convenio.
- «22 euros al mes que pagas por adelantado»: la prorrata se paga cada mes con la parte anual de las dos extras; a 30 de junio ya has pagado 6 × 21,67 = 130 € (la cotización de la extra de junio) y a 31 de diciembre 260 € (las dos). Siempre vas igual o por delante de lo que cobras: se sostiene.
- «Si supera tu bruto, ahí están tus pagas extra»: con 14 pagas, sí; con pagas prorrateadas la base coincide con el bruto (lo explica el texto). Sin otras excepciones relevantes para el ejemplo (por debajo de la base máxima).
- Sin marcas, sin política, sin «si te pica», sin anunciar el siguiente vídeo. «En España» en la voz y en el rótulo de la escena 1; euros y nómina en el gancho.
- Texto de la publicación: 1.872 caracteres (≤ 1.900), con «Contenido educativo, no es asesoramiento financiero» y fuentes al final.

Veredicto: correcto. Cambio único: el texto de la publicación se acortó una línea para quedar por debajo de 1.900 caracteres.
