# $3,000 on a card, minimum payments only: 15 years and $4,515 in interest

Cuenta: **@finanziapp (EE. UU., inglés de EE. UU., dólares)**. Formato extenso corto: gancho → respuesta → pregunta del espectador → dato que casi nadie sabe (último tercio) → cierre que se repite, con una acción para hoy. Sin anunciar otro vídeo, sin «follow», sin «Comment WORD».
Slug: **`en-credit-card-minimum`** · `pildora3d` (reels-voz/tres.js) · `arranque: 'lleno'` · serie `money-explained` (HUD «MONEY, EXPLAINED»).
Archivo del Reel: **`reels-voz/extenso-tarjeta-en.js`** (nuevo).
Publicación prevista: **domingo 29-nov-2026, 11:00 NY** (después del Black Friday, 27-nov, y del fin de semana del Cyber Monday). Duración objetivo 35–50 s; prevista **~42 s**.
Modelo directo: `en-mortgage-rate` (1.884 vistas, 10 guardados): una cifra de intereses que crece delante de ti y una segunda pila roja que supera a la tuya.

## Fuentes (consultadas el 26-nov-2026)

- **Reserva Federal, G.19 Consumer Credit**, publicación del **6-nov-2026** (datos de septiembre de 2026), tabla «Terms of Credit», «Commercial bank interest rates · Credit card plans · **Accounts assessed interest**»: **2026 Q3 (p) = 22,36 %** (Q2 21,52 → 22,15 %; Q1 21,52 %; 2025 Q4 22,30 %; media de 2025 22,32 %). «All accounts»: 21,19 % (Q3 2026). El dato del trimestre es el del mes central (agosto). Nota de la tabla: «The rate for accounts assessed interest is the annualized ratio of total finance charges at all reporting banks to the total average daily balances against which the finance charges were assessed». (p) = preliminar. Siguiente publicación a principios de diciembre: el 29-nov sigue siendo el último dato. https://www.federalreserve.gov/releases/g19/current/default.htm (descargado el 26-11-2026, `scratchpad/lote-1127/en-credit-card-minimum/fuentes/g19.htm`).
- **Credit CARD Act of 2009**, Public Law 111-24 (firmada el **22-may-2009**), **Sec. 201 «Payoff timing disclosures»**, que reescribe TILA §127(b)(11) (15 U.S.C. 1637(b)(11)): el extracto debe llevar «Minimum Payment Warning: Making only the minimum payment will increase the amount of interest you pay and the time it takes to repay your balance» (o la fórmula que fije la Fed tras pruebas con consumidores), los meses para pagarlo solo con el mínimo, el coste total, **«the monthly payment amount that would be required for the consumer to eliminate the outstanding balance in 36 months»** y su coste total. https://www.govinfo.gov/content/pkg/PLAW-111publ24/html/PLAW-111publ24.htm
- **eCFR, 12 CFR 1026.7(b)(12)** (Regulation Z, extracto periódico de tarjeta), versión del 20-nov-2026 leída por la API del eCFR: en cada extracto, con encabezado en negrita, **«Minimum Payment Warning: If you make only the minimum payment each period, you will pay more in interest and it will take you longer to pay off your balance»**; el plazo estimado pagando el mínimo (en años redondeados si pasa de 2), el coste total estimado, **la cuota estimada para pagarlo en 36 meses**, su coste total y **el ahorro** («savings estimate for repayment in 36 months»), y un teléfono gratuito de asesoramiento de crédito. Excepciones: las líneas de 36 meses no salen si el plazo pagando el mínimo es de 3 años o menos, o si la cuota de 36 meses es menor que el mínimo ((b)(12)(i)(F)(2)); nada de (b)(12) en tarjetas de pago total (charge cards), tras dos ciclos pagados enteros o con saldo cero, o si el mínimo ya liquida el saldo ((b)(12)(v)). Si el mínimo no amortiza nunca, el aviso dice «you will never pay off the balance» ((b)(12)(ii)). Formato como los modelos G-18(C) del apéndice G y junto al pago mínimo ((b)(13)). https://www.ecfr.gov/current/title-12/chapter-X/subchapter-B/part-1026/subpart-B/section-1026.7
- **eCFR, apéndice M1 a la parte 1026**: el banco calcula con **la fórmula de mínimo que se aplica a tu cuenta** (cada emisor tiene la suya; el ejemplo del propio apéndice usa «2 percent of the outstanding balance or $20, whichever is greater»). https://www.ecfr.gov/current/title-12/chapter-X/subchapter-B/part-1026/appendix-Appendix%20M1%20to%20Part%201026
- **CFPB**, «A box on my credit card bill says that I will pay off the balance in three years if I pay a certain amount…» (revisada el 22-ene-2024): «Card issuers are required to let you know how long it will take you to pay off your current balance» si pagas solo el mínimo y, en cada extracto, cuánto pagar al mes para liquidarlo en 36 meses; se calcula con el saldo actual, sin compras futuras; **no estás obligado a pagar más que el mínimo**. https://www.consumerfinance.gov/ask-cfpb/a-box-on-my-credit-card-bill-says-that-i-will-pay-off-the-balance-in-three-years-if-i-pay-a-certain-amount-what-does-that-mean-do-i-have-to-pay-that-much-if-i-pay-that-much-and-make-new-purchases-will-i-still-owe-nothing-after-three-years-en-36/
- **Todas las cifras del ejemplo** son **cálculo propio** (amortización mes a mes en `cuadra()`): saldo de **$3,000**, APR **22,36 %** (la media de la Fed de arriba), interés mensual = APR / 12 sobre el saldo (simplificación: los bancos usan el saldo medio diario), sin compras nuevas ni comisiones, **mínimo de ejemplo = 1 % del saldo + los intereses del mes, con un suelo de $25**. Es un **ejemplo**: cada banco fija su fórmula (con suelo de $35 serían 12 años y ~$4,084; con «2 % o $25», ~9 años y ~$2,437). Se rotula «Example» en pantalla y en el texto.
- Fórmula «1 % + intereses»: **no he encontrado una fuente primaria que diga que es la más común**; se presenta solo como ejemplo («each issuer sets its own formula»).

## Gancho visual, de 0 a 3 s (medio segundo a medio segundo)

**Idea sin sonido:** una torre blanca de 30 bloques con la etiqueta **«$3,000»** (1 bloque = $100: lo que compraste) y, a su lado, bloques rojos que **llueven** y levantan una torre roja de intereses. Un **contador rojo enorme** («INTEREST PAID») sube sin parar y un chip «YEAR» corre de 3 a 15, mientras la torre blanca (lo que aún debes) solo pierde bloques muy despacio (los pagados se quedan como contorno). A los ~0,6 s el contador pasa de **$3,000**: la torre roja **iguala la altura de la blanca** (destello, rótulo «INTEREST > $3,000»). Sigue creciendo hasta **45 bloques**, una vez y media la blanca, y a los 2,5 s un sello: **«15 YEARS · $4,515»**.

| Tiempo | Qué se ve | Cámara | Rótulo / sonido |
|---|---|---|---|
| **0,0 s** (en acción) | Año 3 (pago 36): torre blanca con 21 bloques sólidos y 9 en contorno (ya pagados); torre roja con 17 bloques y 5–6 en el aire cayendo. Contador enorme «$1,697» subiendo; chip «YEAR 3»; chip «STILL OWE $2,089» bajando. Etiqueta 3D «$3,000» sobre la torre blanca. | Travelling bajo de derecha a izquierda que ya va en marcha, subiendo. | whoosh · «$3,000» |
| **0,5 s** | Año 5,5: la roja casi a la altura de la blanca. | Sigue el travelling, grúa arriba. | — |
| **0,6–0,7 s** (el acontecimiento) | Pago 77: el contador pasa de **$3,000**; la roja llega a la altura de la blanca (30 bloques): destello, la roja se hincha, la blanca se inclina. | Sacudida corta. | pop · **INTEREST > $3,000** |
| **1,0–2,0 s** | Años 8 → 12: la roja sube a 40; la blanca casi vacía (contorno). | Órbita a tres cuartos y grúa. | tic |
| **2,5 s** | Pago 180: el contador frena en **$4,515**; sello «15 YEARS» en la torre roja. | Golpe de zoom. | pop · **15 YEARS** |
| **3,0 s** | Plano doble: blanca (contorno, «$3,000») y roja (45 bloques). | Retroceso en órbita. | — |

**Por qué se entiende sin sonido:** una cifra grande que sube (rojo) y una torre roja que supera a la de «$3,000». Lo que se mueve son los bloques, las torres y la cámara.

## Guion final (formato del motor)

```
[0, '$3,000 on a card, §paying only the minimum: §{pop}*15 years*, §and *$4,515* in interest.'],
[1, 'That\'s more interest than you spent, §because the minimum *shrinks* §with the balance.'],
[2, '§After three years of payments, §you still owe *over $2,000*.'],
[3, 'So what should you pay? §A 2009 federal law §puts the answer on your statement: §{caja}the *Minimum Payment Warning*.'],
[4, 'It shows how long the minimum takes, §and the payment to finish in *three years*: §{ding}here, about *$115 a month*, §and about *$1,145* in interest.'],
[5, 'Today, find that box §and, if you can, §pay at least that much. §The minimum is the slowest way out; §{pop}what you stop paying in interest §can *start your savings*.']
```

Funciones: 0 gancho (cifra + contradicción); 1 respuesta (por qué); 2 lo que no se ve (casi no baja); 3 pregunta del espectador + dato que casi nadie sabe (la ley y la caja); 4 el pico (36 meses: $115 y $1,145 frente a $4,515); 5 acción para hoy + cierre repetible («the minimum is the slowest way out») + ahorro (EN_CTX), corta sobre la cifra «−$3,370».

## Palabras y duración prevista

~110 palabras (las cifras habladas suman más). A 2,6–3,0 palabras/s: **38–44 s** + cola 0,8 s.

## Rótulos obligatorios (pantalla, no voz)

- Nota fija del gancho y de las escenas de cálculo: «Example: $3,000 · 22.36% APR (Fed avg.) · minimum = 1% + interest, at least $25».
- Escena 3–4: tarjeta «EXAMPLE STATEMENT» con el formato del modelo G-18(C) (genérico, sin banco).
- Escena 4: «APR 22.36% = Fed G.19, Q3 2026, accounts assessed interest».

## Escena → qué se ve (animación 3D)

| Escena | Voz | Qué se ve | Cámara |
|---|---|---|---|
| 0 | gancho | Lo de la tabla de 0–3 s; luego, en «and $4,515 in interest», el sello se queda y el contador en $4,515; la blanca en contorno. | travelling → órbita → grúa → retroceso |
| 1 | the minimum shrinks | Una escalera de 90 barras en el suelo (un pago cada 2 meses, alto ∝ pago): roja abajo (intereses del mes) y turquesa arriba (capital). Empieza en **$86** y baja hasta **$25** (suelo desde el pago 124). Rótulos «MONTH 1: $86» → «$25». | travelling a lo largo de la escalera (de 1 a 180) |
| 2 | after three years | Torre blanca de 30 de nuevo; chip «MONTH» 0 → 36; el maniquí turquesa lanza pagos; la blanca solo pierde 9 bloques (→ 21) y la roja sube a 17. Rótulos «PAID $2,608» → «STILL OWE $2,089». | órbita que se acerca al maniquí y sube |
| 3 | the Minimum Payment Warning | Torres atenuadas; entra la tarjeta «EXAMPLE STATEMENT» (2D, en movimiento: zoom y giro lentos); chip «CREDIT CARD ACT · 2009»; en {caja} la caja ámbar recorre «Minimum Payment Warning». | push lento detrás |
| 4 | $115 a month · $1,145 | Tabla de la tarjeta: fila «Only the minimum payment · 15 years · $7,515», fila «$115 · 3 years · $4,145», «Savings: $3,370». Se ilumina cada fila con su frase. Sale la tarjeta y en «$1,145» la torre roja (45) pierde 34 bloques → 11. Rótulo «INTEREST $4,515 → $1,145». | retroceso y órbita |
| 5 | start your savings | Los 34 bloques rojos vuelven turquesa y levantan una pila «SAVINGS» junto al maniquí. Corte seco sobre «−$3,370 INTEREST». | órbita baja que sube con la pila |

## Cuentas a comprobar con `cuadra()`

```js
const APR = 22.36, i = APR / 1200, B = 3000, SUELO = 25, PCT = 0.01;
const H = [{ m: 0, s: B, int: 0, pag: 0, p: 0 }]; { let s = B, int = 0, pag = 0, m = 0;
  while (s > 1e-9) { m++; const it = s * i; const p = Math.min(Math.max(s * PCT + it, SUELO), s + it); int += it; pag += p; s = s + it - p; H.push({ m, s, int, pag, p, it }); } }
const N = H.length - 1, INT = H[N].int;
cuadra('meses pagando el mínimo', N, 180);                 // «15 years»
cuadra('años', N / 12, 15);
cuadra('intereses', Math.round(INT), 4515);                // «$4,515»
cuadra('más intereses que lo comprado', INT > B, true);
cuadra('total pagado', Math.round(H[N].pag), 7515);        // tarjeta: «$7,515»
cuadra('primer pago', Math.round(H[1].p * 100) / 100, 85.9);   // «$86»
cuadra('suelo de 25 desde el pago', H.find(h => h.m > 0 && h.p === SUELO).m, 124);
cuadra('intereses pasan de 3.000 en el pago', H.find(h => h.int > B).m, 77);
cuadra('saldo a 3 años', Math.round(H[36].s), 2089);       // «over $2,000»
cuadra('más de 2.000', H[36].s > 2000, true);
cuadra('pagado en 3 años', Math.round(H[36].pag), 2608);
cuadra('intereses en 3 años', Math.round(H[36].int), 1697);
const c36 = B * i / (1 - Math.pow(1 + i, -36));
cuadra('cuota a 36 meses', Math.round(c36 * 100) / 100, 115.13);   // «about $115 a month»
cuadra('intereses a 36 meses', Math.round(c36 * 36 - B), 1145);     // «about $1,145»
cuadra('total a 36 meses', Math.round(c36 * 36), 4145);
cuadra('ahorro', Math.round(INT - (c36 * 36 - B)), 3370);           // «−$3,370»
cuadra('bloques: 30 / 45 / 11 / 34', [B / 100, Math.round(INT / 100), Math.round((c36 * 36 - B) / 100), Math.round(INT / 100) - Math.round((c36 * 36 - B) / 100)].join('/'), '30/45/11/34');
```
(Comprobadas con node el 26-11-2026: todas pasan; ver la cabecera de `reels-voz/extenso-tarjeta-en.js`.) Con $150/mes: 26 pagos y ~$789 de intereses (solo en el texto).

## Texto de la publicación (inglés de EE. UU.)

```
$3,000 on a card, paying only the minimum: 15 years and $4,515 in interest.

A minimum set as a percentage of the balance shrinks as the balance does, so the debt barely moves. In this example, after 3 years of minimum payments you've paid $2,608 and still owe $2,089.

Under the Credit CARD Act of 2009, your statement must show a "Minimum Payment Warning": how long the minimum takes, what it costs, and the monthly payment that clears the balance in 36 months (when paying the minimum would take longer than 3 years). In this example: about $115 a month, $1,145 in interest. A fixed $150 a month: 26 months, about $789.

Today: find that box on your statement and, if you can, pay at least the 36-month amount. Once the card is paid off, that same monthly payment can build an emergency fund and then long-term savings and investing. Investment returns aren't guaranteed.

Example: $3,000 balance, 22.36% APR, no new charges or fees; minimum = 1% of balance + interest, at least $25. Each issuer sets its own formula.
Sources: Federal Reserve G.19 (Q3 2026, accounts assessed interest: 22.36%) · Regulation Z, 12 CFR 1026.7(b)(12) · CFPB.
Educational only, not financial advice.

#creditcards #debtfree #personalfinance
```

## Portada

- titulo: «$3,000 on a card. 15 years to pay it off.» · destacado: «15 years» · color: rojo · serie money-explained · etiqueta «Credit cards» · fotograma: el sello «15 YEARS» (≈2,8 s).

## Verificación (26-nov-2026, revisión escéptica del propio guionista)

- **APR 22,36 %**: abierto en la G.19 del 6-nov-2026; columna «2026 Q3 p» de «Accounts assessed interest» (preliminar). No es «el APR de tu tarjeta»: es la media de las cuentas que pagan intereses en bancos comerciales. Se rotula «Fed avg.».
- **«15 years» y «$4,515»** dependen de la fórmula de mínimo del ejemplo (1 % + intereses, suelo de $25): con suelo de $35 serían 12,25 años y $4,084; con «2 % o $25», 9,3 años y $2,437. Por eso la nota «Example … minimum = 1% of balance + interest, at least $25» está en pantalla **desde el fotograma 0** y en el texto («Each issuer sets its own formula»). No encontré fuente primaria de que «1 % + intereses» sea la fórmula más habitual: no se dice.
- **Simplificación**: interés mensual = APR/12 sobre el saldo de inicio de mes; los bancos usan el saldo medio diario y meses de 28–31 días. Cambia céntimos, no el orden de magnitud.
- **«A 2009 federal law»**: CARD Act firmada el 22-may-2009; los avisos rigen desde el 22-feb-2010 (Reg Z). La voz dice «a 2009 federal law», no «since 2009».
- **«puts the answer on your statement»**: vale si arrastras saldo; no aplica a charge cards, tras dos ciclos pagados enteros o si el mínimo ya liquida el saldo; las líneas de 36 meses no salen si el mínimo lo paga en ≤ 3 años. Matiz en el texto («when paying the minimum would take longer than 3 years»).
- **«pay at least that much»**: la CFPB recuerda que no es obligatorio; la voz dice «if you can».
- **Ahorro/inversión**: «can start your savings» (posibilidad, sin promesa); el texto añade fondo de emergencia primero y «Investment returns aren't guaranteed».
- **Tarjeta del extracto**: genérica («EXAMPLE STATEMENT»), formato del modelo G-18(C) de Reg Z; sin bancos ni marcas. Cifras de la tarjeta = las del ejemplo ($7,515; $115; $4,145; ahorro $3,370), todas en `cuadra()`.
- Cambios tras la verificación: el texto ya no dice que el mínimo «suele» ser 1 % + intereses («A minimum set as a percentage of the balance shrinks…»); «Since the Credit CARD Act» → «Under the Credit CARD Act».
