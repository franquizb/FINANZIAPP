# Guion · «Why paying the minimum takes 15 years» (formato extenso, EE. UU.)

Reel para @finanziapp (EE. UU., inglés americano, dólares), 3D con maniquíes, voz de narrador grave y tranquilo.
Slug propuesto: `en-minimum-15-years`. Serie: `money-explained`.

**Por qué este formato (petición del propietario, 14-11-2026):** probamos un vídeo más largo y con más sustancia que los
de un dato. Estructura: gancho → respuesta → pregunta abierta (en medio) → dato relevante (pico en el último tercio) →
cierre que se pueda repetir. Quitamos el «lo que viene después»: no se anuncia ningún vídeo, no hay «parte 2» ni «síguenos»
en la voz. Si se invita a seguir, se hace solo en el texto de la publicación, y aquí no se hace.

**Cambios frente al guion ganador (mejoras de los jueces que no rompen la exactitud):**
- Bajado de unas 211 a **198 palabras escritas (199 habladas)**. Fuera «on five thousand», «a year» y «Ninety-three a month»
  de la escena 1. La frase legal de la escena 6 pasa de 34 a 29 palabras y mantiene la condición de «más de tres años» que
  pidió el verificador y el «since 2010»; «must show» deja claro que es obligatorio sin decir «by law».
- Escena 2: el reparto se dice en voz («ninety-three is interest, only fifty lowers the debt»). Es lo que se aprende.
- «usually» → «often». Los emisores usan varias fórmulas y el rótulo recoge los supuestos.
- Pregunta abierta enlazada con el gancho: «So where do fifteen years come from?».
- «Not even close» → «The catch». Así no se repite con tax-bracket si salen la misma semana.
- Escena 6: el pico se anuncia antes de que llegue («Most people miss this»). Se dice «three-year payment», no «three» suelto.
- Escena 7: termina en la cifra más grande, con el {ding} sobre «fifty-seven hundred».
- Cierre: «and compare the rows», para que el espectador sepa qué mirar. Se mantiene «The minimum isn't a plan. It's the
  slowest way out.», que no se contradice.

## Guion final (voz)

```js
[0, 'Five thousand dollars on a credit card doesn’t cost five thousand. §Pay only the minimum: *about twelve and a half thousand*. §{pop}And *fifteen years*.'],
[1, 'Carry a balance, and the rate averages about *twenty-two percent*. §Interest builds daily: §about *three dollars a day*.'],
[2, 'The minimum is often *one percent* of the balance, §plus that month’s interest. §A hundred forty-three: ninety-three is interest. §{ding}Only *fifty* lowers the debt.'],
[3, 'Fifty a month off five thousand: §a hundred months. §So where do *fifteen years* come from?'],
[4, '{pop}The catch: §each month, the one percent comes from a *smaller balance*. §The payment *shrinks with the debt*, §so the debt shrinks slower and slower.'],
[5, 'Five years in, §you’ve paid about six and a half thousand, §*more than you borrowed*. §{caja}And you still owe *more than half*.'],
[6, 'Most people miss this: §the fix is on your *statement*. §Since 2010, if the minimum takes over three years, §it must show the *three-year payment*. §Here: a hundred ninety-two.'],
[7, 'About fifty more a month at first. §*Three years*, not fifteen. §{ding}And *fifty-seven hundred dollars* less in interest.'],
[8, 'Tonight, find *Minimum Payment Warning* on your statement and compare the rows. §The minimum isn’t a plan. §{pop}It’s the *slowest* way out.'],
```

Papel de cada línea: 0 gancho · 1–2 respuesta · 3 pregunta abierta · 4–5 desarrollo (fondo en la 5) · 6–7 dato
relevante (pico) · 8 cierre con acción para hoy.

**Palabras y duración (a 3,4 palabras/s):** 199 palabras habladas («2010» se lee «twenty ten»), unos **58,5 s** de voz; con
las pausas §, el render debería quedar en 60–63 s. Por escena (palabras · inicio aproximado): 0: 24 · 0,0 s | 1: 18 · 7,1 s |
2: 24 · 12,4 s | 3: 16 · 19,4 s | 4: 25 · 24,1 s | 5: 22 · 31,5 s | 6: 30 · 37,9 s | 7: 18 · 46,8 s | 8: 22 · 52,1 s.
Si la locución pasa de 63 s, recortar en este orden: «Most people miss this:» (escena 6, pero entonces el pico llega sin
aviso) y «each month,» (escena 4). No tocar el reparto 143 = 93 + 50 ni la última frase.

## Rótulos obligatorios (pantalla, no voz)

- **Fijo y pequeño, desde el fotograma 0:** «Example: $5,000 · 22.36% APR (Fed G.19, Q3 2026, preliminary) · min = 1% +
  interest, $40 floor · no new charges or fees · illustrative».
- **Fotograma 0, grande:** «$5,000 → ~$12,600 · 15 years». El giro se entiende sin sonido.
- **Escena 6:** «Credit CARD Act (2009) · on statements since Feb 2010 · Reg Z 1026.7(b)(12)» y «3-year figure assumes no
  new charges».
- **Escena 8 (cierre):** «Pay the full statement balance by the due date → usually no interest on purchases». También le
  sirve a quien no arrastra saldo.

## Escena → qué se ve (animación 3D)

Código de color: turquesa = lo que controlas (tu pago a la deuda, la cuota de 3 años), rojo = lo que se escapa (intereses),
ámbar = lo detectado (el 1 % que encoge, el recuadro del extracto). Cada 2–3 s cambia algo.

| Escena | Qué se ve |
|---|---|
| 0 · Gancho | **Fotograma 0 lleno:** maniquí blanco con una tarjeta en la mano, cartel de precio blanco «$5,000» ya en cuadro y rótulo grande «$5,000 → ~$12,600 · 15 years». El cartel se estira y se vuelve rojo: «$12,596». En el {pop}, un calendario sube de golpe hasta «15 YEARS». Rótulo fijo de supuestos abajo. |
| 1 · Respuesta | Un bloque «22.36% / year» se parte en 365 baldosas de «0.061%». Cada día cae una moneda roja de «$3.06» junto al maniquí. |
| 2 · Respuesta | El maniquí entrega un bloque «$143» que se parte en dos: el trozo rojo de «$93» se lo traga una boca de intereses y solo el turquesa de «$50» golpea la pila de deuda: 5,000 → 4,950 ({ding}). |
| 3 · Pregunta | Tarjeta-calculadora en turquesa: «$5,000 ÷ $50 = 100 months». Al lado, «15 years?» con la interrogación en ámbar. El maniquí mira una escalera de 100 peldaños. |
| 4 · Desarrollo | En el {pop} aparece una barra roja que se alarga hasta «184 months». Tres meses seguidos: la pila de deuda baja y el bloque turquesa del pago también encoge (50 → 49.50 → 49.01), con la etiqueta ámbar «1% of a smaller balance». El maniquí camina hacia una puerta «PAID OFF» que se aleja. |
| 5 · Desarrollo (fondo) | Contador «Year 5». A la izquierda, la columna «Paid $6,483» supera el contorno «Borrowed $5,000». A la derecha, la deuda roja «$2,736» sigue por encima de la línea «half» ({caja}). El maniquí se sienta. |
| 6 · Dato | Un extracto en 3D gira y entra en cuadro. Foco ámbar sobre el recuadro «Minimum Payment Warning» con dos filas: «Only the minimum: 15 years · $12,596» y «$192/month: 3 years · $6,908». Rótulo de la ley y de «no new charges». |
| 7 · Dato (pico) | Dos líneas de tiempo: una roja de 15 años y otra turquesa de 3 años. La roja se encoge hasta la turquesa. En el {ding}, cartel grande «−$5,688 interest» con «+$49/month» pequeño encima. |
| 8 · Cierre | El maniquí da la vuelta a su extracto, el recuadro se ilumina en ámbar y las dos filas se marcan con un check. Frase final a pantalla completa: «The minimum isn't a plan. It's the slowest way out.» Rótulo «Pay the full statement balance…» y logo. Sin tarjeta de serie ni «follow». |

## Cuentas a comprobar con `cuadra()`

Supuestos: saldo de 5.000 $, APR del 22,36 %, interés mensual = saldo × APR/12, mínimo = 1 % del saldo + intereses del mes
con suelo de 40 $, sin compras nuevas ni comisiones. Simulación mes a mes; todas pasan (comprobado el 14-11-2026).

```js
const { cuadra } = require('../reels/_comun');
const S = 5000, APR = 0.2236, r = APR / 12, F = 40, R = x => Math.round(x * 100) / 100;
let b = S, m = 0, paid = 0, int = 0, p60, b60, b100, floorM = null;
while (b > 0.005) {
  m++; const i = b * r; let p = Math.max(0.01 * b + i, F); if (p > b + i) p = b + i;
  if (floorM === null && 0.01 * b + i < F) floorM = m;
  b = b + i - p; paid += p; int += i;
  if (m === 60) { p60 = paid; b60 = b; } if (m === 100) b100 = b;
}
cuadra('interés diario', R(S * APR / 365), 3.06);          // «about three dollars a day» (/360: 3,11)
cuadra('interés mes 1', R(S * r), 93.17);                   // «ninety-three is interest»
cuadra('mínimo mes 1', R(0.01 * S + S * r), 143.17);        // «a hundred forty-three»
cuadra('reparto mes 1', R(143.17 - 93.17), 50);             // «only fifty lowers the debt»
cuadra('cuenta ingenua', S / 50, 100);                      // «a hundred months»
cuadra('pagado 5 años', R(p60), 6483.21);                   // «about six and a half thousand»
cuadra('más de lo prestado', p60 > S, true);                // «more than you borrowed»
cuadra('pendiente 5 años', R(b60), 2735.78);
cuadra('más de la mitad', b60 > S / 2, true);               // «more than half»
cuadra('pendiente mes 100', R(b100), 1830.16);
cuadra('entra el suelo', floorM, 128);
cuadra('meses al mínimo', m, 184);                          // 15,3 años → «fifteen years»
cuadra('intereses al mínimo', R(int), 7595.94);
cuadra('total al mínimo', R(paid), 12595.94);               // «about twelve and a half thousand»
const q = S * r / (1 - Math.pow(1 + r, -36));
cuadra('cuota 36', R(q), 191.88);                           // «a hundred ninety-two»
cuadra('intereses 36', R(q * 36 - S), 1907.85);             // total 6.907,85
cuadra('ahorro', R(int - (q * 36 - S)), 5688.09);           // «fifty-seven hundred dollars»
cuadra('cuota extra', R(q - 143.17), 48.71);                // «about fifty more a month at first»
```

Comprobación con capitalización diaria (APR/365 sumado al saldo cada día, ciclos de 30,42 días): 185 meses (15,4 años),
7.672,69 $ de intereses, 12.672,69 $ en total, 6.521 $ pagados a los 5 años con 2.736 $ pendientes y unos 5.740 $ de
ahorro. Todas las frases siguen siendo ciertas.

Sensibilidad (para responder en comentarios): con el APR de «all accounts» (21,19 %) salen 12.154 $. Con suelo de 50 $,
12.166 $ en 162 meses (13,5 años). Con suelo de 35 $, 12.811 $ en 198 meses (16,5 años). Con suelo de 25 $, 231 meses
(19,2 años). «About twelve and a half thousand» vale en todo el rango razonable (12,2k–12,8k). Si el mínimo fuera el 2 %
del saldo con suelo de 40 $, saldrían unos 56 años: el ejemplo es el escenario prudente.

## Fuentes (con fecha)

- Federal Reserve, G.19 Consumer Credit (publicado el 6-11-2026): tipo de las tarjetas de crédito en bancos comerciales,
  3T 2026 provisional. «Accounts assessed interest» 22,36 %; «all accounts» 21,19 %.
  https://www.federalreserve.gov/releases/g19/current/default.htm
- CFPB, *The Consumer Credit Card Market* (diciembre de 2025), sección 4.1.1, págs. 69-70: la mayoría de emisores fijan el
  mínimo en el 1 % del saldo más cargos financieros; suelos de 15 a 50 $, el más común de 40 $. Resumen ejecutivo: un 15 %
  de titulares pagó solo el mínimo en 2024 (lo más alto desde al menos 2015) y el saldo medio fue de unos 5.300 $.
  https://files.consumerfinance.gov/f/documents/cfpb_consumer-credit-card-market-report_2025.pdf
- CFPB, Ask CFPB, «What is a credit card APR?» (revisado el 23-9-2024): tasa diaria = APR / 360 o 365.
  https://www.consumerfinance.gov/ask-cfpb/what-is-a-credit-card-apr-en-46/
- Reg Z, 12 CFR 1026.7(b)(12) (norma vigente, consultada el 14-11-2026): «Minimum Payment Warning», plazo y coste pagando
  el mínimo, cuota a 36 meses y ahorro. No se exige la parte de 36 meses si el plazo redondeado es de 3 años o menos.
  https://www.consumerfinance.gov/rules-policy/regulations/1026/7/
- Credit CARD Act, Pub. L. 111-24, sección 201 (22-5-2009).
  https://www.govinfo.gov/content/pkg/PLAW-111publ24/html/PLAW-111publ24.htm
- Federal Reserve, nota de prensa del 12-1-2010: cumplimiento obligatorio desde el 22-2-2010.
  https://www.federalreserve.gov/newsevents/pressreleases/bcreg20100112a.htm

Nota: el dato del G.19 es provisional y puede revisarse en la próxima publicación. Si alguien cita el 25,2 % de la CFPB
(APR asignado en tarjetas de uso general, 2024), es otra medida. Usamos el 22 % porque es la cifra prudente.

## Texto de la publicación

```
$5,000 on a credit card, minimum payments only: about $12,600 and 15 years. 💳

You're not alone: about 15% of cardholders paid only the minimum in 2024, the highest share since at least 2015 (CFPB). The 22% rate we use is the cautious figure: the CFPB puts the average APR on general-purpose cards at about 25% in 2024, which would make the example worse.

No balance? Paying the full statement balance by the due date usually means no interest on purchases. And if you see no 3-year row in the warning box, that's usually because the minimum would already clear your balance in 3 years or less.

Have you ever read the Minimum Payment Warning box on your statement? 👇

Example: $5,000, 22.36% APR, minimum = 1% + interest with a $40 floor, no new charges or fees. Illustrative, not advice.
Sources: Federal Reserve G.19 (Nov 2026, Q3 preliminary) · CFPB, The Consumer Credit Card Market (Dec 2025) · Reg Z 12 CFR 1026.7(b)(12) · Credit CARD Act of 2009.

#creditcarddebt #personalfinance #debtfree
```

## Portada (para `portadas.json`)

```json
"en-minimum-15-years": {
  "titulo": "$5,000 on minimums: 15 years",
  "destacado": "15 years",
  "color": "rojo",
  "serie": "money-explained",
  "etiqueta": "Credit",
  "fotograma_ms": 42000
}
```

Titular de 5 palabras, destacado «15 years». `fotograma_ms` es aproximado (escena 6, el recuadro «Minimum Payment Warning» con las dos filas): completa el titular sin
repetirlo. Ajustarlo cuando esté el render.
