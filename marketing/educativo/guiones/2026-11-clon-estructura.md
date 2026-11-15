# Clon de estructura · «TIN vs TAE» (es) y «HSA vs FSA» (en)

- **Qué es:** un experimento que pidió el propietario el 14-11-2026. Copiamos beat a beat, con sus tiempos, el esqueleto de un Reel de millones de visitas: la variante B, la «fábula explicada» de @primateeconomics, descrita en `investigacion/2026-11-esqueleto-viral.md`. El contenido es nuestro y no copiamos ninguna frase de ellos.
- **Qué cambia frente a nuestros Reels:** la respuesta se guarda hasta el 78–80 % del vídeo, la voz es seca a unas 2,6 palabras/s y hay 8 s sin voz. Ponemos rótulos en lugar de subtítulos, quitamos la música y el HUD «MONEY, EXPLAINED», y el final es mudo y empalma en bucle. Rompe a propósito dos reglas nuestras: el gancho con cifra y los subtítulos.
- **Qué medimos en el panel, vídeo a vídeo:** la omisión en los 3 primeros segundos (`reels_skip_rate`), el tiempo medio visto (`ig_reels_avg_watch_time`, también como % de la duración) y el alcance (`reach`), a las 72 h y a los 7 días.
- **Con qué lo comparamos:** con la mediana de los últimos 10 Reels de la misma cuenta en el formato normal (3D con narrador), o con todos si hay menos de 10. Se publica en una franja parecida y sin tocar los hashtags ni el horario.
- **Cuándo es un acierto:** omisión del 30 % o menos (los nuestros que despegaron tenían un 24–30 %) y tiempo visto o alcance de al menos 1,3 veces la mediana. Con un vídeo por cuenta solo es una pista: si sale bien, se repite con dos temas más antes de cambiar el formato.

Guiones de partida verificados el 14-11-2026: las cuentas, las fuentes primarias, las frases que no se copian y las reglas de contenido. Aquí solo se pasan a nuestro formato y se ajusta el montaje. Los cambios están en «Ajustes de montaje» de cada cuenta y no tocan ninguna palabra de la voz ni ningún dato. Las cuentas de abajo las he vuelto a pasar todas con `cuadra()` el 14-11-2026 y cuadran.

## Lo que necesita el motor antes de renderizar (comparte las dos cuentas)

Este formato pide cosas que `reel-voz.js` no hace hoy. No he tocado código.

| Qué pide el esqueleto | En el motor | Estado |
|---|---|---|
| Sin whoosh en los cortes | `sonidos: { escena: null }` | Ya existe |
| Final mudo de 1,8–2 s | `cola: 1.8` (es) y `cola: 2.0` (en) | Ya existe |
| Corte seco de la capa 2D | `corte2d: 'seco'` | Ya existe |
| Sin HUD ni texto de retención | No pasar `fijo` ni `T[lang].retencion` | Ya existe |
| Cortes dentro de un beat | La coreografía `tres` cambia de cámara en `e.seg[i].marcas[j]` | Ya existe (por convención va un plano por escena: aquí no) |
| Sin subtítulos de transcripción | Opción nueva `sub: false` (hoy `golpes()` siempre los genera) | **Falta** |
| Sin música bajo la voz | Opción nueva `musica: false` (hoy `musica.py` siempre suena) | **Falta** |
| Pausa de 8 s sin voz antes de una frase, dentro de la misma escena | Opción nueva por escena, por ejemplo `pausas: { 7: { dur: 8.4, silencio: 0.7, sonido: 'zumbido' } }`. Hoy la escena empieza 0,25 s antes de su primera frase y entre frases solo hay 0,2 s | **Falta** |
| Zumbido grave que sube | Efecto nuevo `zumbido` en `sfx.py`: tono grave sintetizado que sube unos 8 s y se corta en seco, sin cola. Fin en el corte (es) o en una marca + 0,8 s (en) | **Falta** |
| Voz seca y sin entusiasmo, a unas 2,6 palabras/s | Constante nueva `VOZ_SECA`, sin tocar `VOZ` ni `VOZ_NARRADOR`. Mismas voces (Iapetus en EE. UU., Charon peninsular en España), estilo «deadpan, dry, unhurried, matter-of-fact, a short beat between sentences», `tempo` cerca de 1,0 y `pausaMax` cerca de 0,6 | **Falta. Decide el propietario**: la voz no se cambia sin que lo pida |

**En este formato, las marcas del guion significan otra cosa.** Al no haber subtítulos, `*resaltado*` marca la palabra en la que aparece un rótulo. Sirve de guía de montaje y, si se vuelven a poner subtítulos, saldrá resaltada. `§` es un corte o una capa nueva. Bajo la voz no va ningún efecto `§{…}`, porque el esqueleto lo prohíbe. El único sonido es el zumbido de la pausa.

**Riesgo con la voz:** el filtro de Google bloquea a veces las frases muy cortas, y aquí hay dos de 3 palabras («TIN contra TAE.» y «HSA versus FSA.»). Si las bloquea, se juntan las escenas 0 y 1 en una sola toma y el corte a la escena 1 lo hace `tres` en una marca §.

---

## España (`es`)

**Título:** TIN vs TAE: por qué «sin intereses» no siempre es gratis
**Slug:** `es-tin-vs-tae` · 3D · 56,8 s · personaje fijo: el maniquí de la boina turquesa · mundo: el pueblo de Villaplazos, con su plaza, su bar y su tienda.

### Guion (voz)

```js
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
  [7, 'Diez euros de *gastos de gestión*.'],              // va después de 8,4 s sin voz (pausas[7])
  [8, '«Sin intereses» §no siempre es gratis. La §*TAE* es la cuenta.§'],
  [9, 'En el bar, §la caña es *gratis*. §La terraza, no. §Los gastos de gestión son el §*suplemento de terraza*.§']
];
// Opciones: voz: VOZ_SECA, sub: false, musica: false, sonidos: { escena: null },
//           pausas: { 7: { dur: 8.4, silencio: 0.7, sonido: 'zumbido' } }, cola: 1.8, corte2d: 'seco'
```

Tiene 122 palabras habladas (recontadas; el rango del esqueleto es 105–150). Lectura: «TIN» se dice como palabra y «TAE» como «tae». Con `revisar-voz.cjs` hay que comprobar el acento peninsular y que no deletree T-A-E. La única cifra que se dice es «diez euros». Si la locución pasa de 58 s, se quita primero «solo» (escena 4). No se quitan «si son obligatorios» ni «no siempre»: hacen que la frase sea cierta.

### Beat → segundo → qué se ve en 3D

Los tiempos están estimados a unas 2,7 palabras/s. Los cortes van en las marcas § y hay que recalibrarlos con las marcas por palabra de la locución real.

| Beat (molde B) | s | Qué se ve en 3D |
|---|---|---|
| 0 · Tarjeta-título | 0–2 | **Fotograma 0 lleno, sin fundido:** la plaza de Villaplazos de noche, con acento turquesa. El maniquí de la boina sostiene a la altura del pecho la cartulina «TIN vs TAE», entre el 30 y el 70 % de la altura. La voz empieza a 0,1 s. En «TAE» (§, hacia 1,0 s) gira la cabeza de una palabra a la otra. Corte seco a 2,0 s. |
| 1 · Mundo y creencia | 2–5,3 | Plano general: el cartel de entrada del pueblo, que se lee bien, maniquíes que cruzan cargados de cajas y un escaparate con «TODO A PLAZOS». En «creen» (§, hacia 3,6 s), corte a una pared: un vecino termina con tiza el «=» de «TIN = TAE» en «lo mismo» y asiente. |
| 2 · Espejo | 5,3–8,4 | En la barra del bar, el maniquí señala un bocadillo y hay corte en «bocadillo» (§, hacia 6,4 s). Luego señala otro idéntico y hay corte en «bocata» (§, hacia 7,6 s). Dentro de ese plano, un tercer plato con un montadito llega solo, deslizándose por la barra. |
| 3 · Giro con accesorio | 8,4–11,7 | Primer plano del maniquí con la cartulina. En «TAE» (§) se pone unas gafas de leer. En «miden» (§, hacia 10,5 s), inserto: saca una cinta métrica, la estira entre las dos palabras y «TAE» sale más larga. Zoom lento de 1 s. |
| 4 · Adelanto (30 %) | 11,7–17 | Plano cenital del bocadillo en la barra. En «Si» (§) el maniquí lo levanta. En «bocadillo» (§), etiqueta TAE sobre el bocadillo entero. En «pan» (§, hacia 16,9 s), la rebanada de arriba se levanta sola, recibe la etiqueta TIN y hay corte seco. |
| 5 · Cómo funciona | 17–29,4 | **Una toma de 12,4 s sin cortes:** el bocadillo despiezado de perfil, como un diagrama, sobre fondo oscuro. Las capas de relleno caen en sus palabras, una cada 1,2–1,6 s. A su lado, un termómetro «TAE» sube un tramo en «Cuanto» y otro en «más sube». En «tipo» baja la rebanada de arriba y el bocadillo se cierra. En «tasa» la cámara se aleja despacio y se ve entero con sus dos etiquetas. |
| 6 · Todo va bien (3 golpes) | 29,4–32,4 | Tres planos, uno por golpe. 29,4 s: el maniquí sale de la tienda «Electro Villaplazos» con la caja. «A plazos» (§): sentado en el sofá con la tableta encendida. «Sin» (§): de vuelta delante de la tienda, de espaldas, con la caja en brazos y la boina tapando la esquina del cartel donde va la TAE. |
| 7 · Pausa de 8,4 s (57–72 %) | 32,4–43 | **El mismo plano del cartel, sin ningún corte.** De 32,4 a 33,1 s, silencio digital total. A 33,1 s empieza el zumbido y un zoom lento y continuo. A 34,0 s, la etiqueta «10 €» con patitas (el villano) entra por abajo, trepa por la caja y se sienta encima mirando a cámara. A 37,0 s el maniquí gira la cabeza despacio hacia ella. A 39,0 s el foco salta al cartel del fondo. A 40,8 s vuelve la voz sobre el mismo plano (J-cut). El zumbido se corta de golpe en el corte de 43,0 s. |
| 8 · Respuesta completa (76 → 80,6 %) | 43–48 | A 43,0 s, corte al cartel ya enfocado: el maniquí se aparta y el contador llena la pantalla. En «no» (§) la cifra sube en directo. En «TAE» (§, hacia 45,8 s), corte a la cartulina en sus manos, con el mismo trazo que en el fotograma 0. Al acabar la frase (§, hacia 47,0 s), corte: le enseña la cartulina a la etiqueta de 10 €, que se encoge. |
| 9 · Analogía con marca parodiada | 48–55 | 48,0 s: la terraza del bar con el toldo turquesa. «la caña» (§): la caña en la mesa, junto a la pizarra. «La terraza» (§): el camarero maniquí deja el ticket con un golpe seco, solo visual. «Los gastos» (§): primer plano del ticket. Medio segundo después de «suplemento» (§): plano medio del maniquí de la boina leyendo el ticket, con la etiqueta de 10 € sentada a su lado. |
| 10 · Final mudo (cola) | 55–56,8 | Al acabar la voz (§ final), corte a la cara muda: el maniquí sin rasgos se queda 1,0 s inmóvil mirando a cámara, ladea la cabeza y da la vuelta al ticket. Corte en seco a mitad del giro. El reverso, con «TIN vs TAE», empalma con el fotograma 0. |

Hay 21 cortes, unos 3,7 por cada 10 s, y son desiguales: 9 en los primeros 17 s y ninguno ni en el diagrama ni en la pausa. El esqueleto pide 4,1–4,5; el hueco lo llenan las capas nuevas, que aparecen cada 1,3–2 s.

### Rótulos en pantalla (capa 2D, cada uno en su palabra)

No hay música, HUD, logo ni subtítulos en todo el vídeo.

| s | Dónde | Rótulo |
|---|---|---|
| 0,0 | Cartulina | «TIN vs TAE» («TIN» en blanco, «TAE» en turquesa) |
| 2,0 | Cartel del pueblo, en 3D (chiste que no se narra) | «VILLAPLAZOS · 312 vecinos · 1.904 cuotas» |
| ~4,8 «lo mismo» | Pintada de tiza | «TIN = TAE» |
| ~6,4 / ~7,6 | Etiquetas sobre los bocadillos | «BOCADILLO» / «BOCATA» |
| ~7,9 | Junto al tercer plato (no se narra) | «montadito: no abramos ese debate» |
| ~10,5 «miden» | Sobre la cinta métrica | «TIN ≠ TAE» |
| ~15,5 / ~16,9 | Bocadillo entero / rebanada de arriba | «TAE» / «TIN» |
| 18,6 / 19,8 / 21,4 | Capas del diagrama | «comisiones» / «gastos» / «seguro obligatorio» |
| 23,0 / 24,6 | Termómetro | «TAE», que sube dos tramos |
| 26,0 / 28,2 | Pan / bocadillo entero | «TIN · tipo de interés nominal» / «TAE · tasa anual equivalente» |
| 29,5 / 30,5 / 31,5 | Precio, pegatina, cartel | «500 €» / «12 meses» / «SIN INTERESES · 0 % TIN» (la TAE queda tapada) |
| 34,0 / 36,5 | Villano (3D) / rótulo que cuelga de él | «10 €» con patitas / «gastos de gestión» |
| 39,0 | Flecha a rotulador hacia la zona de la TAE (borrosa) | «estaba aquí todo el rato» |
| 43,0 → «no» | Contador grande | «0 %» con «TIN» → sube en directo a «3,81 %» con «TAE» |
| ~45,8 «TAE» | Tarjeta a rotulador | «TAE = LA CUENTA». Letra pequeña: «Ejemplo del Banco de España (2018): 500 € en 12 meses, 0 % TIN y 10 € de gastos de gestión → TAE 3,81 %» |
| 48,0 | Toldo (marca inventada, no se narra) | «Bar El Plazo Fijo» |
| 49,2 / 51,0 / 53,5 | Pizarra / cartelito / ticket | «CAÑA: 0 €» / «terraza +» / «Caña 0,00 € · Suplemento terraza 10,00 €» |
| 55,0 → | Reverso del ticket | «TIN vs TAE» (mismo trazo que en el fotograma 0) |

### Ajustes de montaje frente al guion verificado

- Hay dos cortes nuevos: un inserto de la cinta métrica en «miden» y el corte al camarero en «La terraza». Al recontar el guion verificado salían 19, no los «unos 22» que decía, y ahora son 21.
- El montadito entra dentro del plano de «bocata», no en un inserto aparte: dos cortes a 0,3 s el uno del otro no se leen.
- El maniquí levanta el bocadillo en «Si», no a 13,4 s fijos. Así va con la palabra.
- Con la locución real (VOZ_SECA), la escena 5 dura 14,2 s y no 12,4: de la escena 6 a la 8 todo cae 1,5–2,2 s más tarde que en la tabla. No se tocan ni la voz ni las palabras. Para que los porcentajes sigan siendo los del molde:
  - la pausa baja de 8,4 a 7,9 s, como prevé el guion;
  - el final mudo pasa de 1,8 a 3,3 s, que es lo que dura la cara muda en la variante B (58–61 s). Total: 58,87 s.
  - Así quedan, frente a la tabla: escena 6 al 53,1 % (guion 51,8 %), pausa del 58,8 al 72,2 % (57–72 %), contador al 75,5 % (75,7 %), «no» al 77,7 % y tarjeta «TAE = LA CUENTA» al 80,9 % (80,6 %).
  - Los huecos entre las frases de la escena 5 no se aprietan: son los 0,2 s del motor y solo se ganaría ~0,5 s pegando frases.
- Revisión v2 (15-11-2026):
  - el plano de la etiqueta que encoge dura ~0,7 s, hasta justo antes de «En el bar»;
  - en el ticket, el importe va en la línea de «terraza» porque chocaba con «Suplemento»;
  - el termómetro va más a la izquierda, fuera de los botones de Instagram;
  - el zumbido baja 3 dB desde 0,25 s antes de que vuelva la voz.

### Cuentas para `cuadra()`

Es el ejemplo del Banco de España (2018), recalculado con la fórmula del anexo I de la Ley 16/2011. El Banco de España no dice cuándo se pagan los 10 €; suponemos que al firmar.

```js
const { cuadra } = require('../reels/_comun');
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
cuadra('TAE, gastos en la 1.ª cuota (%)', R(taeDe(P, p2), 4), 3.7993);   // → 3,80 %
cuadra('TAE, cuotas exactas 500/12 (%)', R(taeDe(P - G, Array(12).fill(P / 12)), 4), 3.8113);
cuadra('TAE con 20 € (%)', R(taeDe(P - 20, pagos), 4), 7.8755);  // «cuanto más relleno, más sube»
cuadra('TAE con 0 € (%)', R(taeDe(P, pagos)), 0);                // «si la TAE es 0 %, sí es gratis»
const media = Array.from({ length: 12 }, (_, k) => P * (12 - k) / 12).reduce((a, b) => a + b, 0) / 12;
cuadra('deuda media', R(media), 270.83);                         // texto: «unos 271 €»
cuadra('10 / deuda media (%)', R(G / media * 100, 1), 3.7);      // texto: «cerca de un 3,7 %»
cuadra('10 / 500 (%)', G / P * 100, 2);                          // texto: «el 2 % del precio»
cuadra('TIN 6 % mensual → TAE (%)', R((Math.pow(1 + 0.06 / 12, 12) - 1) * 100), 6.17);
// Tiempos estimados (recalibrar con la locución): duración 56,8 s
const D = 56.8;
cuadra('adelanto «pan» (%)', Math.round(16.9 / D * 100), 30);
cuadra('pausa (s)', R(40.8 - 32.4, 1), 8.4);
cuadra('pausa (% inicio)', Math.round(32.4 / D * 100), 57);
cuadra('pausa (% fin)', Math.round(40.8 / D * 100), 72);
cuadra('contador (%)', Math.round(43.0 / D * 100), 76);
cuadra('tarjeta TAE = LA CUENTA (%)', R(45.8 / D * 100, 1), 80.6);
cuadra('cola (s)', R(D - 55.0, 1), 1.8);
```

En pantalla salen 500 €, 12 meses, 0 % → 3,81 % (la única cifra que cambia en directo) y los 10 € del ticket. Los 10 € del suplemento de terraza son un chiste exagerado para que coincidan con los gastos de gestión, no un precio real. La tarjeta llega al 80,6 %, en el borde alto del 78–80 %. Si con la locución real «TAE» cae después de los 46,5 s, se recorta medio segundo de la pausa.

### Fuentes (con fecha)

- Banco de España, Portal del Cliente Bancario, «¿Publicidad? …siempre nos quedará la TAE» (18/05/2018). Ejemplo de una tableta de 500 € a pagar en un año, «sin intereses» (0 %), con 10 € de gastos de gestión: TAE 3,81 %. No dice cuándo se pagan los gastos. https://clientebancario.bde.es/pcb/es/blog/Publicidad__%25E2%2580%25A6s_e9bdc325cce6361.html
- Banco de España, Portal del Cliente Bancario, «¡Cuidado con el coste de la financiación!» (01/03/2019). Definiciones de TIN y TAE. Un préstamo puede tener un TIN del 0 % y una TAE positiva. https://clientebancario.bde.es/pcb/es/blog/Cuidado_con_el_6edceea38293961.html
- Ley 16/2011, de contratos de crédito al consumo (BOE consolidado; última actualización del 28/03/2014; sin derogar a 14/11/2026). Art. 6 a): coste total del crédito, con los seguros solo si son obligatorios para conseguirlo y sin la notaría. Art. 6 d): la TAE. Art. 32 y anexo I: la fórmula. La Directiva (UE) 2023/2225 se aplica desde el 20/11/2026 y todavía no está transpuesta; el anteproyecto aprobado en primera vuelta el 07/01/2026 mantiene la TAE. https://www.boe.es/buscar/act.php?id=BOE-A-2011-10970
- Circular 4/2020 del Banco de España, sobre publicidad bancaria (BOE núm. 193, de 15/07/2020; en vigor desde el 15/10/2020). Anejo, apartados 2.5 (la TAE, cuando tenga que aparecer, con relevancia frente al TIN) y 2.7 («sin intereses» con gastos: hay que detallarlos y poner la TAE resultante, «que se destacará especialmente»). https://www.boe.es/buscar/act.php?id=BOE-A-2020-7869

**Caducidad:** el texto habla del Black Friday (27-11-2026), así que hay que publicar antes. Antes de publicar, comprobar en el BOE que la Ley 16/2011 no ha cambiado.

### Texto de la publicación

```
TIN vs TAE: el pan y el bocadillo.

El TIN (tipo de interés nominal) es solo el precio del dinero. La TAE (tasa anual equivalente) es el coste total en % al año: intereses, comisiones, gastos y seguros, si son obligatorios. Además, tiene en cuenta cuándo pagas: con un TIN del 6 % en cuotas mensuales y sin gastos, la TAE ya es del 6,17 %. Para comparar, la que cuenta es la TAE.

Un ejemplo del Banco de España (2018): una tableta de 500 € a 12 meses «sin intereses» (0 % TIN), pero con 10 € de gastos de gestión, tiene una TAE del 3,81 %. Pagas 510 €. Los 10 € son el 2 % del precio, pero como vas devolviendo la deuda, de media solo debes unos 271 € durante el año. 10 € sobre 271 € es cerca de un 3,7 %, y con la fórmula oficial sale un 3,81 %.

Si la TAE es 0 %, entonces sí es gratis.

En España, la Circular 4/2020 del Banco de España obliga a que, en los anuncios que tienen que dar la TAE, esta destaque frente al TIN. Y si un crédito «sin intereses» tiene gastos, el anuncio tiene que detallarlos y poner la TAE al lado, bien visible. Con el Black Friday vas a ver muchos: busca esa cifra.

Fuentes: Banco de España, Portal del Cliente Bancario («¿Publicidad? …siempre nos quedará la TAE», 18/05/2018, y «¡Cuidado con el coste de la financiación!», 01/03/2019); Ley 16/2011 de contratos de crédito al consumo, arts. 6 y 32; Circular 4/2020 del Banco de España, anejo, apartados 2.5 y 2.7. La TAE del ejemplo está recalculada con la fórmula de la ley, suponiendo que los gastos se pagan al firmar.

Contenido educativo, no es asesoramiento financiero.

Sé sincero: ¿tú mirabas el TIN o la TAE?

#finanzaspersonales #educacionfinanciera #ahorro #TAE #blackfriday
```

### Portada (para `portadas.json`)

```json
"es-tin-vs-tae": {
  "titulo": "TIN vs TAE: ¿cuál es la cuenta?",
  "destacado": "TAE",
  "color": "ambar",
  "serie": "pildora",
  "etiqueta": "Crédito",
  "fotograma_ms": 39500
}
```

El titular tiene 7 palabras y deja la pregunta abierta, como el vídeo. Va como `pildora` y no como `money-explained`, para que la portada tampoco lleve la firma de la serie. El fotograma es la pausa: la etiqueta de 10 € sentada en la caja y la flecha «estaba aquí todo el rato». Completa el titular sin dar la respuesta. Hay que ajustarlo cuando esté el render.

---

## EE. UU. (`en`)

**Título:** HSA vs FSA
**Slug:** `en-hsa-vs-fsa` · 3D · 55,5 s · personaje fijo: un maniquí con cordón de acreditación turquesa y una taza · mundo: la sala de descanso de una oficina, con nevera, armario, calendario, reloj, pizarra, sofá y tablón de corcho.

### Guion (voz)

```js
const GUION = [
  [0, 'HSA §versus FSA.'],
  [1, 'At work, they sound §like the §*same thing*.'],
  [2, 'Both pay for the §*doctor*. §Both skip §*taxes*.'],
  [3, 'But §one of them has an §*expiration* date.'],
  [4, 'FSA money §*expires*. §HSA money *doesn’t*. If the FSA is §*milk*, the HSA is §*honey*.'],
  [5, 'Both can come out of your §*paycheck* §before taxes. That’s called §*pre-tax*.'],
  [5, '§The more you put in, §the less tax you owe. But only HSA money can be §*invested*, and grow §*tax-free*.'],
  [6, 'Glasses bought. §Taxes skipped. §Total peace.'],
  [7, 'About four in ten §FSA users §*lost money* in 2024.'],   // va después de 8 s sin voz (pausas[7])
  [8, 'The IRS has a §name for it: §*use it* or §*lose it*.'],
  [9, 'An FSA is like §*vacation days* that §don’t roll over. §HSA money *does*.']
];
// Opciones: voz: VOZ_SECA, sub: false, musica: false, sonidos: { escena: null },
//           pausas: { 7: { dur: 8.0, silencio: 0.6, sonido: 'zumbido', fin: 'marca 2 + 0,8 s' } }, cola: 2.0, corte2d: 'seco'
```

Tiene 115 palabras escritas (rango 105–150). Mientras habla va a 2,53 palabras/s, y a 2,07 contando la pausa. Lectura: H-S-A, F-S-A, I-R-S, y «2024» como «twenty twenty-four». La única cifra que se dice es «four in ten», más el año. En EE. UU. ahorrar e invertir van juntos, y eso lo cubre la línea «only HSA money can be invested, and grow tax-free».

### Beat → segundo → qué se ve en 3D

| Beat (molde B) | s | Qué se ve en 3D |
|---|---|---|
| 0 · Tarjeta-título | 0–2 | **Fotograma 0 lleno:** la sala de descanso. El maniquí del cordón turquesa, con el folleto de beneficios en la mano y, delante, la tarjeta «HSA vs FSA» entre el 30 y el 70 % de la altura. En «versus» (§), la tarjeta da un golpe de zoom del 4 %. Corte seco a 2,0 s. |
| 1 · Mundo y creencia | 2–5 | Plano general junto a la cafetera: tres compañeros en gris, con tazas rotuladas «HSA» y «FSA», brindan y asienten. En «like» (§, hacia 3,6 s), corte a plano medio del personaje, que se encoge de hombros. En «same thing» (§), rótulo. |
| 2 · Espejo | 5–8 | Plano simétrico de dos tarros idénticos, «HSA» y «FSA», en la encimera. En «doctor» (§) caen en los dos unas gafas, un frasco de pastillas y un diente. En el segundo «Both» (§, hacia 6,6 s), inserto del folleto «Your Benefits, Simplified · 64 pages». En «taxes» (§) un formulario de impuestos cae sobre él, rebota y sale del cuadro. |
| 3 · Giro con accesorio | 8–11 | Primer plano del personaje. En «one» (§) se pone unas gafas de leer y se inclina. En «expiration» (§, hacia 10,4 s), inserto: la pegatina «EXP 12/31» se estampa en un recipiente que está de espaldas, sin enseñar cuál es. |
| 4 · Adelanto (20 %) | 11–16,5 | La nevera abierta: el recipiente era un cartón de leche «FSA» con «EXP 12/31». En «HSA money» (§, hacia 12,1 s), corte al armario: un tarro de miel turquesa «HSA» con la etiqueta «EXP: no.». En «milk» (§, hacia 15,0 s), corte a los dos juntos en la encimera, la leche a la izquierda y la miel a la derecha. En «honey» (§), corte seco al diagrama. |
| 5 · Cómo funciona | 16,5–28 | **Una toma de 11,5 s sin cortes**, con un acercamiento muy lento a la pizarra. Una nómina en 3D suelta monedas que saltan por encima del icono de impuestos y caen en la leche y en la miel. En «pre-tax» el rótulo se escribe sobre el salto. En «The more» y «the less», un deslizador sube el chorro de monedas y el montón de impuestos encoge. En «invested» brota de la miel una ramita turquesa que crece despacio; la leche no tiene nada parecido. Cada 1,3–2 s aparece una capa nueva. |
| 6 · Todo va bien (3 golpes) | 28–31 | Tres planos. 28,0 s: el personaje con unas gafas nuevas que aún llevan la etiqueta colgando. «Taxes» (§): el formulario encogido dentro de la papelera. «Total» (§): el personaje en el sofá con la taza, inmóvil. |
| 7 · Pausa de 8 s (56–70 %) | 31–43 | 31,0 s: corte a la misma sala de noche, iluminada solo por la nevera abierta. Primero 0,6 s de silencio digital. Después, el zumbido y un único zoom lento desde el sofá hasta el calendario, que pasa hojas solo hasta «DECEMBER», con el 31 rodeado en rojo. Al fondo, el cartón con «$404 left» y el reloj que avanza hacia las 11:59. El personaje mira sin moverse. El villano es la fecha. A 39,0 s vuelve la voz sobre el final del zoom. En «FSA users» (§, hacia 40,0 s), corte al reloj: 12:00. En «lost money» (§, hacia 41,2 s), inserto del cartón: el contador baja de $404 a $0 y el cartón se desinfla. El tarro de miel, al lado, no cambia. El zumbido se corta en seco al llegar a $0. |
| 8 · Respuesta completa (78–80 %) | 43–48 | 43,0 s: corte seco a la tarjeta, con el mismo trazo, papel y tamaño que «HSA vs FSA». Está la sala de día y en la tarjeta pone «FSA =». En «name» (§, hacia 44,6 s, el 80 %) se escribe «USE IT OR LOSE IT». En «use it» (§) se subraya en turquesa. En «lose it» (§) la tarjeta se ladea 3° y entra la cita pequeña. Sin efecto de sonido. |
| 9 · Analogía cotidiana | 48–53,5 | 48,0 s: el tablón de corcho con el personaje delante. En «vacation days» (§, hacia 49,7 s), inserto de la hoja de vacaciones. En «don’t» (§) las seis fichas de días caen al suelo. En «HSA» (§, hacia 52,3 s), corte al tarro de miel, que rueda por la encimera hasta una puerta del armario rotulada «2027» y entra intacto, con la ramita algo más larga. No sale ninguna marca, ni real ni parodiada: es una desviación deliberada del molde, porque nuestras reglas no permiten marcas. |
| 10 · Final mudo (cola) | 53,5–55,5 | Plano medio del personaje con el mismo encuadre y la misma pose que en el fotograma 0, con el folleto y sin la tarjeta. Mira a cámara sin expresión unos 2 s, con un leve giro de cabeza. Corte seco a mitad del gesto. Al repetirse el vídeo, la tarjeta «HSA vs FSA» cae sobre este mismo plano. |

Hay 21 cortes, unos 3,8 por cada 10 s, y ninguno en el diagrama ni en la pausa.

### Rótulos en pantalla (capa 2D, cada uno en su palabra)

No hay HUD «MONEY, EXPLAINED», logo ni subtítulos en todo el vídeo.

| s | Dónde | Rótulo |
|---|---|---|
| 0,0 | Tarjeta | «HSA vs FSA» (la H en turquesa y la F en rojo: es la única letra que cambia) |
| ~4,4 «same thing» | Centro | «HSA = FSA?», con el «=» en ámbar |
| 5,0 → | Dos columnas; cada ✓ sale en su palabra | «HSA ✓ doctor ✓ taxes» \| «FSA ✓ doctor ✓ taxes» |
| ~6,6 | Folleto, en 3D (no se narra) | «Your Benefits, Simplified · 64 pages» |
| ~10,4 «expiration» | Pegatina ámbar | «EXP 12/31» |
| ~11,9 / ~13,0 | Centro | «FSA → expires» (rojo) / «HSA → stays» (turquesa). En 3D: cartón «EXP 12/31» y tarro «EXP: no.» |
| 11,0–16,5 | Pie pequeño | «Generally, calendar-year plans. Some plans: carry over up to $680 of 2026 money ($700 of 2027 money) or a grace period up to 2½ months, not both · IRS» y «HSA needs an HSA-eligible plan: high-deductible (2027: ≥ $1,750 self / $3,500 family) or, since 2026, an ACA bronze or catastrophic plan · IRS» |
| 16,5–28 | Capas del diagrama | «PAYCHECK» → flecha «before taxes» → «PRE-TAX» → deslizador «more in ↑ · tax owed ↓» → «INVESTED», con el aparte «(only ~1 in 9 HSAs are · Devenir, Jun 2026)» → «TAX-FREE» (en espejo con «PRE-TAX») |
| 16,5–28 | Pie fijo pequeño | «Federal tax. California and New Jersey don't follow the HSA tax break · Investing can lose value, not a promise · 2027 limits: FSA $3,500 · HSA $4,500 self / $9,000 family (IRS)» |
| 30,0 | Taza (no se narra) | «I READ THE PAMPHLET» y, debajo, «(page 1)» |
| 31–39 | En el decorado, sin rótulos nuevos | Calendario «DECEMBER» con el 31 en rojo, reloj «11:58 PM» y cartón «$404 left». Línea pequeña: «Avg. lost by FSA users who forfeited, 2024: $404 · EBRI» |
| ~41,2 «lost money» | Contador del cartón | «$404» → «$0», en rojo. Línea pequeña: «EBRI FSA Database · 3.3M+ accounts · 2024 data (Oct 21, 2026) · $404 = average among those who forfeited» |
| 43,0 / ~44,6 | Tarjeta | «FSA =» / se escribe «USE IT OR LOSE IT» |
| «lose it» | Cita pequeña | «IRS Publication 969: "FSAs are generally use-it-or-lose-it plans."» |
| 48,0 | Hoja del tablón (no se narra) | «Vacation days left: 6 · Expire: Dec 31 · Taken: 0» |
| ~53,0 «does» | Junto al tarro | «rolls over» (turquesa) |
| 53,5 → | — | Sin texto |

### Ajustes de montaje frente al guion verificado

Ningún cambio toca la voz ni los datos. Los tiempos fijos del guion verificado no cuadraban con sus palabras a 2,5 palabras/s, así que he atado cada plano a su palabra:

- **Beat 2:** el inserto del folleto pasa al segundo «Both» y el formulario rebota contra el folleto. Antes estaba a 6,5 s, encima de «doctor».
- **Beat 3:** las gafas van en «one» y el inserto de la pegatina en «expiration». «Expiration» cae hacia los 10,4 s, después del corte que estaba a 9,5 s.
- **Beat 4:** la miel entra en «HSA money», hay un corte en «milk» a los dos juntos y otro en «honey» al diagrama. Antes eran 13,8 y 15,3 s, que no caían en ninguna palabra.
- **Beat 8:** la tarjeta entra como «FSA =» y «USE IT OR LOSE IT» se escribe en «name». Antes salía entera a los 43,0 s y se adelantaba 2,8 s a la voz; ahora sale en su palabra y cae hacia el 80 %.
- **Beat 9:** hay un inserto de la hoja en «vacation days» y se quita el plano del personaje mirando las fichas, que a 2,36 palabras/s no cabía.

### Cuentas para `cuadra()`

```js
const { cuadra } = require('../reels/_comun');
const R = (x, d = 2) => Math.round(x * 10 ** d) / 10 ** d;
// Devenir, midyear 2026 (datos a 30-jun-2026)
cuadra('1 de cada 9 HSA invertidas', Math.round(42.6 / 4.7), 9);   // 4,7 M de 42,6 M
cuadra('11 % invertidas', Math.round(4.7 / 42.6 * 100), 11);
cuadra('1/9 (%)', R(100 / 9, 1), 11.1);
cuadra('52 % del dinero invertido', Math.round(100 / 192 * 100), 52);
// IRS: arrastre de la FSA = 20 % del límite del año
cuadra('arrastre del dinero de 2026 (Rev. Proc. 2025-32)', R(0.2 * 3400), 680);
cuadra('arrastre del dinero de 2027 (Rev. Proc. 2026-35)', R(0.2 * 3500), 700);
cuadra('FSA 2027 vs 2026', 3500 - 3400, 100);
cuadra('HSA individual 2027 vs 2026', 4500 - 4400, 100);
cuadra('HSA familiar 2027 vs 2026', 9000 - 8750, 250);
cuadra('HSA familiar = 2 × individual', 2 * 4500, 9000);
cuadra('franquicia HDHP familiar = 2 × individual', 2 * 1750, 3500);
cuadra('gasto máximo de bolsillo familiar = 2 × individual', 2 * 8700, 17400);
// EBRI (21-oct-2026; datos de 2024)
cuadra('pérdida media 2023 → 2024', 436 - 404, 32);
cuadra('contador en pantalla', 404 - 404, 0);                       // $404 → $0
// Tiempos estimados (recalibrar con la locución): duración 55,5 s
const D = 55.5;
cuadra('pausa (s)', 39 - 31, 8);
cuadra('pausa (% inicio)', Math.round(31 / D * 100), 56);
cuadra('pausa (% fin)', Math.round(39 / D * 100), 70);
cuadra('adelanto (%)', R(11 / D * 100, 1), 19.8);
cuadra('contador a $0 (%)', Math.round(41.2 / D * 100), 74);
cuadra('tarjeta (%)', R(43 / D * 100, 1), 77.5);
cuadra('cola (s)', R(D - 53.5, 1), 2);
cuadra('voz (s)', D - 8 - 2, 45.5);
cuadra('palabras/s hablando', R(115 / 45.5), 2.53);
cuadra('palabras/s contando la pausa', R(115 / D), 2.07);
```

«About four in ten» es la frase literal de EBRI, que no da un porcentaje exacto, así que no hay cuenta que hacer. Los 404 $ son la media solo entre quienes perdieron dinero, y así lo dice el rótulo. Las 6 fichas de vacaciones, la taza y el folleto de 64 páginas son chistes del decorado, no datos. El adelanto cae al 19,8 %, como el 11/55 de la tabla de B, aunque el tronco común habla del 25–30 %.

### Fuentes (con fecha)

- IRS, Publication 969 (2025), página revisada el 30-abr-2026. «FSAs are generally "use-it-or-lose-it" plans». Periodo de gracia de hasta 2½ meses, y no puede haber a la vez periodo de gracia y arrastre. Las ganancias de la HSA están libres de impuestos. Lo que se aporta a la FSA no paga impuesto federal sobre la renta ni impuestos de empleo. https://www.irs.gov/publications/p969
- IRS, Rev. Proc. 2026-35 (PDF del 5-nov-2026), §3.16: la FSA de 2027 tiene un límite de 3.500 $ y un arrastre máximo de 700 $. https://www.irs.gov/pub/irs-drop/rp-26-35.pdf
- IRS, Rev. Proc. 2025-32 (9-oct-2025): la FSA de 2026 tiene un límite de 3.400 $, y del dinero de 2026 pueden pasar a 2027 como máximo 680 $.
- IRS, Rev. Proc. 2026-24 (mayo de 2026): HSA de 2027, 4.500 $ individual y 9.000 $ familiar. HDHP con franquicia mínima de 1.750 $ y 3.500 $ y gasto máximo de bolsillo de 8.700 $ y 17.400 $. https://www.irs.gov/pub/irs-drop/rp-26-24.pdf
- IRS, Notice 2026-5 (9-dic-2025): desde el 1-ene-2026, los planes bronze y catastrophic del mercado ACA permiten aportar a una HSA (ley OBBBA). https://www.irs.gov/pub/irs-drop/n-26-05.pdf
- EBRI, «About Four in 10 FSA Accountholders Forfeited Unused Funds to Employers, EBRI Finds» (21-oct-2026; datos de 2024): pérdida media de 404 $ entre quienes perdieron dinero (436 $ en 2023), sobre más de 3,3 M de cuentas. **La primaria dio error 502 el 14-nov-2026.** Las cifras se confirmaron por PSCA, InsuranceNewsNet y Money.com. Hay que abrir la primaria antes de publicar. https://www.ebri.org/content/about-four-in-10-fsa-accountholders-forfeited-unused-funds-to-employers--ebri-finds
- Devenir, «HSA Assets Reach Nearly $192 Billion at Midyear 2026, With More Than Half Now Invested» (13-oct-2026; datos a 30-jun-2026): 42,6 M de cuentas; 4,7 M (el 11 %) tienen inversiones. https://www.devenir.com/hsa-assets-reach-nearly-192-billion-at-midyear-2026-with-more-than-half-now-invested/
- California Franchise Tax Board, 2025 Instructions for Schedule CA (540): California no sigue la deducción federal de la HSA. https://www.ftb.ca.gov/forms/2025/2025-540-ca-instructions.html
- NJ Division of Taxation, Gross Income Tax Overview (consultada el 14-nov-2026): no hay deducción por HSA. El proyecto de ley A2634 (2026–27) está presentado pero no aprobado. https://www.nj.gov/treasury/taxation/git_over.shtml · https://pub.njleg.gov/Bills/2026/A3000/2634_I1.HTM

**Caducidad:** conviene publicarlo durante el periodo de inscripción de beneficios (noviembre y diciembre) y siempre antes del 31-dic-2026. Desde enero, el arrastre que importa pasa a ser el de 700 $, así que habría que cambiar el pie. Si EBRI o Devenir sacan un informe nuevo, hay que revisar las cifras.

### Texto de la publicación

```
HSA vs FSA: one of them has an expiration date 👀

An HSA can be invested, not just spent. Yet only about 1 in 9 HSA accounts holds any investments; the rest just hold cash (Devenir, June 30, 2026).

Before 65, HSA money spent on non-medical things is generally taxed, plus a 20% penalty. After 65, no penalty, just regular income tax.

An HSA needs an HSA-eligible health plan (a high-deductible plan or, since 2026, an ACA bronze or catastrophic plan), and you generally can't add to one while you also have a regular health FSA.

Today: open your benefits portal and check your FSA balance, its deadline, and whether your plan has a carryover (up to $680 of 2026 money into 2027) or a grace period (up to 2½ months).

2027 limits: health FSA $3,500 · HSA $4,500 self-only / $9,000 family. California and New Jersey don't give the HSA state tax break.
Sources: IRS Publication 969 · IRS Rev. Proc. 2025-32, 2026-24 and 2026-35 · IRS Notice 2026-5 · EBRI (Oct 21, 2026; 2024 data) · Devenir Midyear 2026 HSA Research Report.
Educational only, not financial advice.

#HSA #FSA #openenrollment #personalfinance
```

### Portada (para `portadas.json`)

```json
"en-hsa-vs-fsa": {
  "titulo": "HSA vs FSA: which one expires?",
  "destacado": "expires",
  "color": "rojo",
  "serie": "pildora",
  "etiqueta": "Benefits",
  "fotograma_ms": 37000
}
```

El titular tiene 6 palabras y deja abierto cuál de los dos caduca. El fotograma es la pausa: el calendario con el 31 de diciembre rodeado, «$404 left» y el reloj a las 11:58. Completa el titular sin repetirlo. Va como `pildora`, sin la firma de la serie. Hay que ajustarlo cuando esté el render.

---

## Antes de producir (pendiente)

1. Visto bueno del propietario para `VOZ_SECA`, la voz seca y lenta, solo para este experimento.
2. Añadir al motor `sub: false`, `musica: false`, `pausas` y el efecto `zumbido`, y comprobarlo con `--vista --sin-voz` antes de pagar la locución.
3. Crear el mundo 3D de cada vídeo en su `SCRIPT_3D` y apagarlo al principio de cada fotograma. Para es: plaza, bar, bocadillo despiezable, cinta métrica, gafas, boina, tienda, sofá, tableta, etiqueta de 10 € con patitas, termómetro, toldo, caña y ticket. Para en: la sala de descanso, los tarros, el cartón de leche, el tarro de miel, el cordón, la taza, el folleto, la nómina con monedas, el formulario, el calendario y el reloj.
4. Recalibrar cada corte y cada rótulo con las marcas por palabra de la locución real (Whisper, `alinear.py`). La tarjeta de la respuesta tiene que caer entre el 78 y el 81 %.
5. EBRI: abrir la nota primaria antes de publicar el de EE. UU.
6. No publicar ni llamar a Meta desde aquí. Publica el supervisor cuando lo pida el propietario.
