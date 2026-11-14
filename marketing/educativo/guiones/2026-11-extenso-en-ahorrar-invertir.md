# Guion · «Same dollar: +50¢ or under half a cent» (formato extenso, EE. UU.)

Reel para @finanziapp (EE. UU., inglés americano, dólares), 3D con maniquíes, voz de narrador grave y tranquilo.
Slug propuesto: `en-save-invest-one-plan`. Serie: `money-explained`.

**Idea del propietario (14-11-2026):** «En EE. UU. el ahorro no es solo guardar dinero, es invertir; fusionar los dos es lo
importante.» El vídeo la cuenta como una escalera de 5 pasos: colchón de efectivo (guardar) → match del 401(k) → tarjetas →
cuentas con ventajas fiscales → inversión normal. Cierre: «saving and investing aren't two goals, they're one plan».

**Formato:** gancho → respuesta → pregunta abierta (en medio) → dato relevante (pico en el último tercio) → cierre que se
pueda repetir, con una acción para hoy. No se anuncia ningún vídeo, no hay «parte 2» ni «follow» en la voz.

**Cambios frente al guion verificado («The same dollar: 50% or 0.4%»), que era el único candidato:**
- **Gancho en centavos, no en porcentajes.** «Can gain *fifty cents* the day you save it, or *under half a cent* in a year».
  Las dos cifras son las mismas (match del 50 % y ahorro medio de la FDIC del 0,38 %), pero dichas en centavos de un dólar
  se ven sin calcular, y el contraste 50 ¢ frente a <0,5 ¢ es más fuerte que 50 % frente a 0,4 %, que suena a dos tipos
  parecidos. Se quita «earn», porque el match no es rentabilidad.
- **Fuera de la voz los límites del IRS** («The 2026 limits: $24,500… $7,500…»). Ahora son rótulo en la escena 5. Con
  ellos el guion salía en unas 232 palabras habladas (68 s, demasiado largo). Además, los límites de 2027 pueden salir
  cualquier día: en rótulo se cambian sin volver a grabar la voz.
- «The second, the average savings account» sin repetir el 0,4 % en voz: ya lo dice el gancho («under half a cent») y
  queda en el rótulo con su fuente.
- «Usually, not before the match»: el orden queda como regla general (escena 2: «The usual rule of thumb»), no como
  instrucción personal.
- Paso 5 con «*invested*»: es la palabra de la idea del propietario y se oye.
- Dato: «Skip it on a $60,000 salary…». Se dice quién pierde los 1.800 $ (quien no se apunta), así que no hay
  contradicción lógica.
- Cierre en dos frases cortas que se pueden repetir: «saving and investing aren't two goals. They're one plan.»
- Se mantienen todas las correcciones del verificador: «common» (no «typical»), «private-sector», «once it vests»,
  «clear the cards, fast», «before any growth» y «Where it goes first».

## Guion final (voz)

```js
[0, 'The same dollar can gain *fifty cents* the day you save it, §or *under half a cent* in a year. §{pop}The difference? *Where it goes first.*'],
[1, 'The first is a common *401(k) match*: §fifty cents per dollar you put in, up to a cap. §The second, the average *savings account*.'],
[2, 'The usual rule of thumb: both, in order. §One: a small *cash cushion*, §so surprises don’t land on a card. §Two: enough to get the *full match*.'],
[3, 'But cards charging interest average about *22%*. §Shouldn’t you pay those off first?'],
[4, 'Usually, not before the match: §{ding}an instant *50%*, free money once it vests. §Then three: clear the cards, *fast*.'],
[5, 'Four: more into accounts with *tax breaks*, §up to the yearly limits. §Five: the rest, *invested* in a regular brokerage account.'],
[6, 'Yet over *1 in 4* private-sector workers offered a plan don’t join. §Skip it on a $60,000 salary with a 50% match up to 6%, §and that’s *$1,800* a year left on the table. §{caja}Ten years: *$18,000*, §before any growth.'],
[7, 'In America, saving and investing aren’t two goals. §They’re *one plan*. §Today, check you’re getting your *full match*.'],
```

Papel de cada línea: 0 gancho · 1 respuesta (el porqué) · 2 el orden, pasos 1 y 2 · 3 pregunta abierta · 4 respuesta y
paso 3 · 5 pasos 4 y 5 · 6 dato relevante (pico) · 7 cierre con acción para hoy.

**Palabras y duración (a 3,4 palabras/s):** 188 palabras escritas (~55 s) y unas **202 habladas** («401(k)» se lee
«four-oh-one-k»; «$60,000», «sixty thousand dollar»; «22%», «twenty-two percent»), es decir, **~59 s** de voz. Con las
pausas §, el render debería quedar en 60–63 s.

Por escena (palabras habladas · inicio aproximado): 0: 26 · 0,0 s | 1: 27 · 7,6 s | 2: 27 · 15,6 s | 3: 15 · 23,5 s |
4: 20 · 27,9 s | 5: 21 · 33,8 s | 6: 48 · 40,0 s | 7: 18 · 54,1 s.

La pregunta cae entre el 40 y el 47 % del vídeo. El dato va del 68 al 91 %, ya en el último tercio.

Si la locución pasa de 63 s, recortar en este orden: «so surprises don’t land on a card» (escena 2, 7 palabras) y
«up to the yearly limits» (escena 5, 5 palabras). No tocar «private-sector», porque sin ello la cifra deja de ser cierta,
ni el paso 5 («invested»), que es la idea del propietario.

## Rótulos obligatorios (pantalla, no voz)

- **Fijo y pequeño, desde el fotograma 0:** «Example · common 401(k) match: 50¢ per $1, up to 6% of pay · avg savings
  0.38% APY (FDIC, Oct 19 2026) · illustrative, not advice».
- **Fotograma 0, grande:** «$1 → $1.50 vs $1.004». El giro se entiende sin sonido.
- **Escena 4:** «Match may vest over time · 401(k) withdrawals before 59½: usually tax + 10% penalty». Explica por qué el
  colchón va primero y por qué el 401(k) no sirve para pagar la tarjeta.
- **Escena 5:** «2026 limits: 401(k) $24,500 · IRA $7,500 · more at 50+ (IRS, Nov 13 2025)». **Revisar irs.gov/newsroom
  el día de publicar.** Si ya están los de 2027 (previsión de 25.500 $ para el 401(k), aún no oficial), cambiar el rótulo
  a 2027.
- **Escena 6:** «BLS, March 2026: 72% of private-sector workers with a plan take part · example assumes flat salary, no
  returns».

## Escena → qué se ve (animación 3D)

Código de color: turquesa = lo que controlas (tu dólar, la hucha del 401(k), los peldaños), rojo = lo que se escapa
(intereses de la tarjeta, el match que no se cobra), ámbar = lo detectado (la tarjeta del 22 %, el maniquí que no se
apunta). Cada 2–3 s cambia algo. Sin marcas ni logotipos de bancos o brókers.

| Escena | Qué se ve |
|---|---|
| 0 · Gancho | **Fotograma 0 lleno:** maniquí blanco en el centro con una moneda dorada «$1» en la mano, ya en cuadro. A la izquierda, una hucha turquesa «401(k)» con un segundo maniquí al lado (el empleador, con acreditación) que sostiene media moneda. A la derecha, una caja de cristal «Savings». Arriba, rótulo grande «$1 → $1.50 vs $1.004». Rótulo fijo de supuestos abajo. Cae la moneda en la hucha y el empleador añade la media moneda: «+50¢» rebota con el {pop}. En la caja de ahorro aparece un «+0.4¢» diminuto y la moneda casi no brilla. |
| 1 · Respuesta | El empleador mete media moneda por cada moneda del maniquí hasta una línea marcada «CAP · 6% of pay» en la hucha, y ahí se para aunque el maniquí siga metiendo. La caja de ahorro apenas sube; etiqueta pequeña «avg 0.38%». |
| 2 · Orden 1-2 | Aparece una escalera de 5 peldaños numerados y el maniquí la sube. Peldaño 1: un cojín turquesa «CASH» recoge una factura que cae antes de que toque una tarjeta roja. Peldaño 2: la hucha se llena hasta la línea «FULL MATCH». |
| 3 · Pregunta | Entra una tarjeta roja gigante con «22%» que se traga monedas. Se marca en ámbar (detectada) y el maniquí duda entre la tarjeta y la hucha, con un signo de interrogación ámbar encima. |
| 4 · Paso 3 | En el {ding}, la hucha se ilumina en turquesa con «+50% · FREE MONEY» y, pequeño, «once it vests». Después el maniquí rompe la cadena roja que lo ata a la tarjeta, la tarjeta se apaga y se enciende el peldaño 3. Rótulo del vesting y de la penalización. |
| 5 · Pasos 4-5 | Peldaño 4: dos cajas turquesa con un escudo de impuestos, «401(k)» e «IRA», y el rótulo de los límites del IRS. Peldaño 5: una explanada abierta «INVESTED · brokerage» donde siguen entrando monedas que se apilan. |
| 6 · Dato (pico) | Cuatro maniquíes blancos en fila ante una puerta «Retirement plan». Uno se vuelve ámbar, da media vuelta y se va: «Over 1 in 4 don't join». Sobre él, un contador «$1,800/yr» apila 10 bloques hasta «$18,000» ({caja}) mientras las medias monedas del empleador se alejan en rojo. Debajo, pequeño: «before any growth». |
| 7 · Cierre | Los 5 peldaños se encienden en turquesa y se funden en una sola línea: «SAVE + INVEST = ONE PLAN». El maniquí mira un móvil que dice «FULL MATCH: YES». Último plano quieto, sin rótulo de «follow». |

## Cuentas a comprobar con `cuadra()`

Todas pasan (comprobado el 14-11-2026 con `reels/_comun.js`).

```js
const { cuadra } = require('../reels/_comun');
const R2 = x => Math.round(x * 100) / 100;
cuadra('match por dólar', 1 + 1 * 0.5, 1.5);                 // «gain fifty cents» → $1.50
cuadra('ahorro 1 año', R2((1 * 1.0038 - 1) * 100) / 100, 0.0038); // 0,38 ¢ en un año
cuadra('menos de medio centavo', 1 * 0.0038 < 0.005, true);  // «under half a cent»
cuadra('0,38 redondeado', Math.round(0.38 * 10) / 10, 0.4);  // rótulo «$1.004» / «0.4¢»
cuadra('tope del match', R2(0.5 * 6), 3);                    // como mucho, 3 % del sueldo («up to a cap»)
cuadra('aportación', 60000 * 0.06, 3600);
cuadra('match anual', 3600 * 0.5, 1800);                     // «$1,800 a year»
cuadra('= 3 % del sueldo', 60000 * 0.03, 1800);
cuadra('10 años', 1800 * 10, 18000);                         // «$18,000, before any growth» (sueldo fijo, sin rentabilidad)
cuadra('no se apuntan', 100 - 72, 28);                       // BLS, sector privado, adhesión 72 %
cuadra('más de 1 de 4', 28 > 25, true);                      // «over 1 in 4»
cuadra('civiles: justo 1 de 4', 100 - 75, 25);               // por eso «private-sector», no «workers»
cuadra('22 %', Math.round(22.36), 22);                       // «about 22%»
cuadra('mediana BLS anual', 1232 * 52, 64064);
cuadra('60k < mediana', 60000 < 64064, true);                // el ejemplo es prudente
const be = Math.log(1.5) / Math.log(1.2236);
cuadra('equilibrio match/tarjeta (APR)', R2(be), 2.01);      // años
const tae = Math.pow(1 + 0.2236 / 12, 12) - 1;
cuadra('TAE tarjeta', R2(tae * 100), 24.8);
cuadra('equilibrio (mensual)', R2(Math.log(1.5) / Math.log(1 + tae)), 1.83); // → «clear the cards, fast»
cuadra('match frente a ahorro al 4 %', 0.5 > 0.04, true);    // respuesta al «my savings pays 4%»
```

Por qué el match va antes que la tarjeta: 1 $ al match suma 0,50 $ en el momento, y 1 $ que se queda en la tarjeta cuesta
unos 0,22 $ al año. El match solo gana si la tarjeta se paga en menos de unos 2 años (1,8 con capitalización mensual). Por
eso la voz dice «Usually» y «clear the cards, fast», y no dice «beats».

## Fuentes (con fecha)

- FDIC, National Rates and Rate Caps (19-10-2026): savings 0,38 % (APY, media nacional ponderada); CD a 12 meses 1,76 %.
  https://www.fdic.gov/national-rates-and-rate-caps
- Federal Reserve, G.19 Consumer Credit (6-11-2026): tarjetas, 3T 2026 provisional. «Accounts assessed interest» 22,36 %;
  «all accounts» 21,19 %. https://www.federalreserve.gov/releases/g19/current/
- BLS, Employee Benefits in the United States, tabla 1 (marzo de 2026; modificada el 12-11-2026). Sector privado: acceso
  72 %, participación 52 %, adhesión 72 %. Civiles: 75/56/75. https://www.bls.gov/news.release/ebs2.t01.htm
- IRS, IR-2025-111 (13-11-2025): 401(k) 24.500 $ (8.000 $ adicionales a partir de 50 años; 11.250 $ entre 60 y 63); IRA
  7.500 $ (1.100 $ adicionales a partir de 50 años).
  https://www.irs.gov/newsroom/401k-limit-increases-to-24500-for-2026-ira-limit-increases-to-7500
- Vanguard, How America Saves 2026, figs. 5-7, pp. 21-22: fórmula más común, 0,50 $ por 1 $ hasta el 6 % (12 % de los
  planes con match); match prometido medio 4,7 %, mediana 4,0 %. Solo como fuente; no se nombra en voz ni en rótulos.
  https://workplace.vanguard.com/content/dam/inst/iig-transformation/insights/pdf/has/how-america-saves-2026.pdf
- BLS, Usual Weekly Earnings (21-10-2026): mediana a tiempo completo, 1.232 $/semana en el 3T 2026.
  https://www.bls.gov/news.release/wkyeng.nr0.htm
- FINRA, «Why Leave Money on the Table?» (1-8-2023, actualizado el 27-2-2025): «passing up free money».
  https://www.finra.org/investors/alerts/why-leave-money-make-most-employers-401k-match
- Federal Reserve, SHED 2025 (mayo de 2026): el 63 % cubriría 400 $ con efectivo o equivalente; el 45 % de quienes tienen
  tarjeta arrastró saldo al menos una vez en 12 meses.
  https://www.federalreserve.gov/newsevents/pressreleases/other20260513a.htm

**Caducidad:** los límites de 2027 no son oficiales a 14-11-2026 (previsión de 25.500 $, Milliman/Marsh). El G.19 es
provisional. Comprobar los dos el día de publicar.

**Respuesta preparada para comentarios («my savings pays 4%»):** el 0,38 % es la media nacional de la FDIC y las cuentas de
alto rendimiento pagan más. Aun así, 4 centavos al año frente a 50 centavos al momento: el colchón sigue en efectivo
(paso 1) y el match sigue ganando.

## Texto de la publicación

```
The same dollar: +50¢ the day you save it, or under half a cent in a year. 💵

Check two things in your plan documents (the Summary Plan Description): your exact match formula, since many aren't 50¢ up to 6%, and your vesting schedule. If you leave before you're vested, part of the match can disappear.

Why the cash cushion comes first: pulling money out of a 401(k) before 59½ usually means income tax plus a 10% penalty. And if you're 50 or older, the IRS lets you put in more: an extra $8,000 in a 401(k) for 2026 ($11,250 if you're 60–63).

Do you know your employer's match formula? 👇

Example: $60,000 salary, 50% match up to 6% of pay, flat salary, no returns. Illustrative.
Sources: FDIC National Rates (Oct 19, 2026) · Federal Reserve G.19 (Nov 2026, Q3 preliminary) · BLS Employee Benefits (March 2026) · IRS IR-2025-111.
Educational only, not financial advice.

#401k #investing #personalfinance
```

## Portada (para `portadas.json`)

```json
"en-save-invest-one-plan": {
  "titulo": "Same dollar: +50¢ or 0.4¢",
  "destacado": "+50¢",
  "color": "turquesa",
  "serie": "money-explained",
  "etiqueta": "Saving + Investing",
  "fotograma_ms": 2500
}
```

Titular de 5 palabras con el destacado «+50¢». `fotograma_ms` es aproximado: el {pop} del gancho, con la hucha «+50¢» y la
caja «+0.4¢» en el mismo plano. Ajustarlo cuando esté el render.

## Orden frente al ganador de la otra tanda (`en-minimum-15-years`)

Debería ir **antes**: caduca (los límites de 2027 del IRS pueden salir cualquier día y noviembre es temporada de elegir
aportaciones para el año siguiente), mientras que el de la tarjeta no caduca. El gancho del de la tarjeta es algo más fuerte
(una sola historia y una cifra), así que puede publicarse justo después.
