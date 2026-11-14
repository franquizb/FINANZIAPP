# Guion · «Are stock prices just psychology? Half true.» (desmentido, Remix secuencial, EE. UU.)

Reel para @finanziapp (EE. UU., inglés americano, dólares), 3D con maniquíes, voz de narrador grave (`VOZ_NARRADOR`,
~3,4 palabras/s), subtítulos palabra a palabra arriba y HUD «MONEY, EXPLAINED».
Slug: `en-debunk-psychology`. Serie: `money-explained`.

**Qué desmiente:** un Reel viral con un fragmento de *Limitless* (2011) en el que el personaje dice «Share prices aren't
really based on how a company works. It's about how mass psychology works» y presume de multiplicar su dinero en días.
Es medio verdad: a corto plazo mandan las emociones; a largo plazo, los beneficios (y los dividendos). Se corrige la idea,
no a nadie: no se nombra la cuenta ni se usan imágenes de la película.

**Por qué este guion (elegido entre «caida-2020» y «burbuja»):**
- **Base: «caida-2020».** La cita de la tarjeta está comprobada en la transcripción de la película; las cifras de 2020 y del
  siglo de beneficios salen de datos primarios (cierres del S&P 500 y tabla de Shiller) recalculados aquí. El caso de 2020
  lo recuerda todo el mundo y la vuelta a récords en cinco meses enseña la «votación» en una sola frase.
- **De «burbuja» tomamos el «reliably»** en la frase de la fórmula: lo falso no es que alguien acierte una apuesta, sino que
  exista un método repetible. El caso del Nasdaq de 1999 queda para comentarios (abajo, cifras comprobadas).
- **Quitado lo que no está confirmado:** la frase de la fórmula ya no dice «$2.3 million», «ten days» ni «also 190-fold».
  La transcripción solo confirma «Well, from 12,000 to–» y «At the end of the week… over two million dollars». La voz dice
  «$12,000 into millions in days», que vale con 2 o con 2,3 millones y con «una semana».
- Cambios de redacción del verificador: «nearly 34%», «190-fold» (no «190 times»), «total return», «since 1926», y
  «Warren Buffett credits his teacher, Benjamin Graham» (no «Graham said»).

## Guion final (voz)

```js
[0, 'That clip says stock prices aren’t about the company, §just psychology. §{pop}*Half true.*'],
[1, 'In 2020, pandemic fear sent the S&P 500 down *nearly 34%* in 33 days. §About five months later, §{ding}it hit a *new record*.'],
[2, 'So what decides the price in the *end*?'],
[3, '§{pop}*Profits.* §Since 1926, S&P 500 earnings per share grew about *190-fold*, §and that growth plus dividends explains about *nine-tenths* of the total return.'],
[4, 'And turning $12,000 into millions in days? §Real profits took about *a century* to grow that much. §{caja}No formula does that *reliably*.'],
[5, 'Warren Buffett credits his teacher, Benjamin Graham: §in the short run, the market is a *voting machine*; §{ding}in the long run, a *weighing machine*.'],
[6, 'Every day, prices get *voted* on. §Over years, profits get *weighed*. §So don’t react to every swing.'],
```

Papel de cada línea: 0 gancho (afirmación + giro) · 1 la parte verdadera (corto plazo, caso real) · 2 pregunta abierta ·
3 dato que sorprende (largo plazo) · 4 la «fórmula» · 5 votación frente a balanza · 6 cierre que se repite + idea práctica.
Sin anuncio de otro vídeo, sin «follow», sin tarjeta de serie.

**Lectura para la voz:** «S&P 500» = «S and P five hundred»; «2020» = «twenty twenty»; «1926» = «nineteen twenty-six»;
«190-fold» = «a hundred ninety-fold»; «$12,000» = «twelve thousand dollars». `revisar-voz.cjs` debe aceptar esas lecturas.

**Recambio de la línea 4** (solo si el fragmento que se remezcla no incluye la escena del dinero o da otra cantidad
inicial): `[4, 'And turning thousands of dollars into millions in days? §Real profits took decades to grow like that. §{caja}No formula does that *reliably*.'],`
Misma longitud (23 palabras); en la escena 4 el contador rojo pasa a «$ thousands → $ millions · days (movie)».

## Palabras y duración (a 3,4 palabras/s)

130 palabras escritas (las de los subtítulos) y unas **143 habladas** (los números se alargan) → unos **42 s** de voz;
con las pausas §, el render debería quedar en 43–45 s.

| Escena | Palabras habladas | Inicio aprox. |
|---|---|---|
| 0 · Gancho | 13 | 0,0 s («Half true» hacia 3,3 s) |
| 1 · Corto plazo | 28 | 3,8 s |
| 2 · Pregunta | 8 | 12,1 s |
| 3 · Largo plazo | 29 | 14,4 s |
| 4 · La «fórmula» | 24 | 22,9 s |
| 5 · Votación y balanza | 24 | 30,0 s |
| 6 · Cierre | 17 | 37,0 s → fin ≈ 42 s |

Si la locución pasa de 45 s, recortar en este orden: «his teacher,» (línea 5) y «about» delante de «a century» (línea 4).
No tocar «since 1926», «total return» ni «nearly».

## Rótulos obligatorios (pantalla, no voz)

- **Fotograma 0, tarjeta grande:** «A viral movie clip: "Share prices aren't really based on how a company works"».
  Texto literal de la película (sin «The» delante). Sin nombre de cuenta.
- **Escena 1:** «S&P 500 closes · Feb 19, 2020: 3,386 → Mar 23: 2,237 → Aug 18: 3,390 · S&P Dow Jones Indices, AP».
- **Escena 3:** «S&P Composite before 1957 · nominal · dividends reinvested · Dec 1926–Dec 2025 · Robert Shiller data ·
  Past performance, not a promise».
- **Escena 5, tarjeta de cita (texto literal, no la paráfrasis de la voz):** «"In the short-run, the market is a voting
  machine… but in the long-run, the market is a weighing machine." Warren Buffett, crediting Ben Graham (1993 Berkshire
  letter)».

## Escena → qué se ve (animación 3D)

Código de color: turquesa = lo que controlas (tu calma, el largo plazo), rojo = lo que se escapa (pánico, la apuesta),
ámbar = lo detectado (el sello «HALF TRUE», la parte del PER). Algo cambia cada 2–3 s. Sin caras, sin imágenes de la
película, sin gestos de burla.

| Escena | Qué se ve |
|---|---|
| 0 · Gancho (0–4 s) | **Fotograma 0 lleno:** la tarjeta de la cita ya en cuadro, delante de una gran gráfica de precio 3D que tiembla arriba y abajo; detrás, una multitud de maniquíes blancos la mira y se balancea. Con «Half true» ({pop}), un sello ámbar «HALF TRUE» parte la tarjeta en dos: una mitad se enciende en turquesa («short run: true») y la otra queda gris («long run: no»). |
| 1 · Corto plazo (4–12 s) | La gráfica se convierte en la cinta del S&P 500 de 2020. Se desploma en rojo de «3,386 · Feb 19» a «2,237 · Mar 23» y aparece «−34% in 33 days» grande; la multitud se agita bajo un brillo rojo. Después la cinta sube en turquesa y, en el {ding}, marca «New record · Aug 18 · 3,390». |
| 2 · Pregunta (12–14 s) | La multitud se aparta. El maniquí turquesa, solo, delante de una balanza enorme y vacía. Texto: «What decides the price in the end?». Medio segundo de silencio musical. |
| 3 · Largo plazo (14–23 s) | En el {pop}, bloques de beneficio caen en el platillo de la balanza y forman una columna que crece de «$1.24 (1926)» a «$240.63 (2025)»; aparece «×190» en turquesa. Luego una barra de rentabilidad total: ~9/10 en turquesa, «Earnings growth + dividends», y ~1/10 en ámbar, «Paying more per $1 of profit (P/E 11 → 28)». Rótulo de Shiller abajo. |
| 4 · La «fórmula» (23–30 s) | Dos contadores. Izquierda, en rojo, girando como una tragaperras: «$12,000 → $ millions · days (movie)». Derecha, en turquesa, con hojas de calendario que pasan despacio: «Real profits: ×190 · ~100 years». En el {caja}, el contador rojo se apaga dentro de un recuadro ámbar con el rótulo «No reliable formula». |
| 5 · Votación y balanza (30–37 s) | Pantalla partida. Izquierda, «SHORT RUN: VOTING MACHINE»: los maniquíes echan papeletas en una urna y cambian de color sin parar; la aguja del precio va nerviosa. Derecha, «LONG RUN: WEIGHING MACHINE»: los bloques de beneficio de la escena 3 bajan al platillo y, en el {ding}, la aguja se asienta. Tarjeta de cita literal. |
| 6 · Cierre (37–43 s) | La multitud se balancea de un lado a otro siguiendo la gráfica que tiembla; el maniquí turquesa, quieto junto a la balanza, no se mueve. Texto final grande: «Prices get voted. Profits get weighed.». Fin sin tarjeta de serie. |

## Cuentas a comprobar con `cuadra()`

Todas pasan (comprobado el 14-11-2026 con `reels/_comun.js`).

```js
const { cuadra } = require('../reels/_comun');
const R1 = x => Math.round(x * 10) / 10, R2 = x => Math.round(x * 100) / 100;
const dias = (a, b) => Math.round((new Date(b) - new Date(a)) / 864e5);
// 2020 (cierres del S&P 500)
const MAX = 3386.15, SUELO = 2237.40, REC = 3389.78;
cuadra('caída 2020 %', R2((SUELO / MAX - 1) * 100), -33.92);         // «nearly 34%»
cuadra('casi 34', Math.round(-(SUELO / MAX - 1) * 100), 34);
cuadra('días de caída', dias('2020-02-19', '2020-03-23'), 33);        // «in 33 days»
cuadra('suelo → récord, días', dias('2020-03-23', '2020-08-18'), 148);
cuadra('≈ meses', R1(148 / 30.44), 4.9);                               // «about five months later» (desde el suelo)
cuadra('nuevo récord', REC > MAX, true);                               // «it hit a new record»
// Shiller: BPA dic-1926 → dic-2025
const E0 = 1.24, E1 = 240.634;
cuadra('BPA ×', R1(E1 / E0), 194.1);                                   // «about 190-fold»
cuadra('PER inicio → fin', [R1(13.49 / E0), R1(6853.03 / E1)].join('→'), '10.9→28.5'); // «P/E 11 → 28»
// Descomposición (decomp.py): 10,41 %/año = 5,47 BPA + 3,62 dividendo + 0,98 PER
const TOT = 10.41, G = 5.47, DY = 3.62, LOG = 90.2;
cuadra('beneficios+div / total (arit.)', R1((G + DY) / TOT * 100), 87.3);
cuadra('≈ nueve décimas (logs)', LOG >= 85 && LOG <= 95, true);        // «about nine-tenths of the total return»
// Película: «from 12,000 to–» … «over two million» al final de la semana
cuadra('×2,3M', R1(2300000 / 12000), 191.7);
cuadra('×2M', R1(2000000 / 12000), 166.7);
cuadra('BPA llegó a ese múltiplo en ~un siglo', E0 * 166.7 < E1 && E0 * 191.7 < E1, true); // «took about a century to grow that much»
```

Notas para comentarios:
- La caída de 2020 no fue solo miedo: el BPA de Shiller bajó de 139,47 (dic-2019) a 94,13 (dic-2020), −32 %. Por eso la voz
  dice «pandemic fear» y no «pure emotion». El récord de agosto llegó con el BPA aún un 29 % por debajo (98,56): el precio
  se adelantó a los beneficios, que es justo la «votación».
- «Nine-tenths» depende del punto de partida: desde 1871, 1900 o 1960 sale ~93 %; desde 1980 (PER muy bajo), ~75 %. Por eso
  se dice «since 1926». ×194 es nominal; sin inflación son unas 8 veces. La comparación con la película es coherente porque
  las dos cifras son nominales.
- Confirmación independiente: Bogle (West Point, 2006), siglo XX: 10,4 %/año = 9,8 de «investment return» (5,0 dividendo +
  4,8 crecimiento de beneficios) + 0,6 de «speculative return» (PER de 12,5 a 30).
- Caso de reserva (burbuja): Nasdaq +85,59 % en 1999 (2.192,69 → 4.069,31) con el 76 % de las OPV de 1999 en pérdidas
  (Ritter), y −77,93 % del 10-3-2000 (5.048,62) al 9-10-2002 (1.114,11), cierres de FRED.

## Fuentes (con fecha)

- Transcripción de subtítulos de *Limitless* (2011), consultada el 14-11-2026: «Sure. Share prices aren't really based on
  how a company works. It's about how mass psychology works.»; «Well, from 12,000 to–»; «At the end of the week… over two
  million dollars». https://www.springfieldspringfield.co.uk/movie_script.php?movie=limitless
- AP vía PBS NewsHour (18-8-2020): el S&P 500 cierra en récord, 3.389,78 frente a 3.386,15 del 19-2; «nearly 34% plunge…
  from Feb. 19 through March 23». https://www.pbs.org/newshour/economy/sp-500-closes-at-a-record-erasing-last-of-pandemic-losses
- Robert Shiller, U.S. stock market data (ie_data.xls, descargado el 5-10-2026): BPA 1,24 (dic-1926) y 240,634 (dic-2025);
  precio 13,49 y 6.853,03; dividendos reinvertidos cada mes. https://shillerdata.com/
- Warren Buffett, carta a los accionistas de Berkshire Hathaway de 1993 (fechada el 1-3-1994): «As Ben Graham said: "In the
  short-run, the market is a voting machine… but in the long-run, the market is a weighing machine."»
  https://www.berkshirehathaway.com/letters/1993.html
- Quote Investigator (9-1-2020): en *Security Analysis* (1934) solo aparece «voting machine rather than weighing machine»;
  la versión corto/largo plazo es de Buffett (1973–74), que se la atribuye a Graham en la carta de 1994.
  https://quoteinvestigator.com/2020/01/09/market/
- John C. Bogle, «Investment Wisdom and Human Values», West Point (6-4-2006).
  https://boglecenter.net/wp-content/uploads/JCB_West-Point-4-06.pdf
- FRED, NASDAQCOM (consultado el 14-11-2026) y Jay R. Ritter, IPO statistics, tabla 9 (actualizada el 30-12-2025), solo
  para comentarios. https://fred.stlouisfed.org/series/NASDAQCOM · https://site.warrington.ufl.edu/ritter/files/IPOs-Tech.pdf

## Texto de la publicación (inglés de EE. UU.)

```
Are stock prices just psychology? Half true.

Short run, mood moves prices fast: in 2020 the S&P 500 fell nearly 34% in 33 days (Feb 19 to Mar 23), then closed at a new record on Aug 18.

Long run, profits do the heavy lifting: since 1926, S&P 500 earnings per share grew about 190-fold, and earnings growth plus dividends account for roughly nine-tenths of the total return. The rest came from investors paying more for each dollar of profit.

"In the short-run, the market is a voting machine… but in the long-run, the market is a weighing machine." Warren Buffett, crediting Ben Graham (1993 letter).

What's the biggest market swing you've lived through, and what did you do?

Sources: S&P Dow Jones Indices · AP, Aug 18, 2020 · Robert Shiller, U.S. stock market data (nominal, dividends reinvested, S&P Composite before 1957) · Berkshire Hathaway 1993 shareholder letter.
Past performance doesn't guarantee future results. Educational only, not financial advice.

#investing #stockmarket #financialliteracy
```

## Portada

Entrada propuesta para `portadas.json`:

```json
"en-debunk-psychology": {
  "titulo": "Stock prices are just psychology? Half true.",
  "destacado": "Half true.",
  "color": "ambar",
  "serie": "money-explained",
  "fotograma_ms": 34000
}
```

Titular de 7 palabras; destacado en ámbar como el sello. El fotograma (~34 s) es la pantalla partida urna/balanza, que
completa el titular en vez de repetirlo.

## Nota para el propietario: cómo hacer el Remix secuencial

1. **Antes de nada, mira el fragmento.** Comprueba dos cosas: que la frase dice «Share prices aren't really based on how a
   company works» (si no, cambia la tarjeta de la escena 0) y que el fragmento incluye la escena de los 12.000 $. Si no la
   incluye o da otra cantidad, usa el **recambio de la línea 4** de arriba antes de renderizar.
2. Renderiza nuestro vídeo como siempre (`node reel-voz.js en-debunk-psychology en`) y pásalo al móvil.
3. En Instagram, abre el Reel original, toca el icono de Remix (o «…» → Remix) y elige la opción de **añadir tu vídeo al
   final** (Remix secuencial, «Add to end»), no la de pantalla dividida.
4. Recorta el original al trozo de la cita (unos 10–15 s): así el espectador oye la frase y llega enseguida a nuestro
   «That clip says…». Luego elige nuestro vídeo de la galería como segunda parte.
5. Pega el texto de la publicación de arriba y la portada. Instagram añade solo el crédito al Reel original: no hace falta
   (ni conviene) nombrar la cuenta en el texto.
6. Si el autor tiene el Remix desactivado o la opción no aparece, publica nuestro vídeo solo: se entiende sin el fragmento
   gracias a la tarjeta del fotograma 0.

Recordatorio: solo es el guion. No se ha publicado, programado ni hecho commit, y no se ha llamado a ninguna API de Meta.
