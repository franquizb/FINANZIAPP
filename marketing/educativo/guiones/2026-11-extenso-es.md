# La rebaja de 20 céntimos que en realidad son 24 (y por qué la gasolina gratis costaría 57)

Cuenta: @finanziapp.es (España, euros). Formato extenso de prueba: gancho, respuesta, pregunta abierta, dato relevante y cierre. Sin «lo que viene después» y sin anunciar el siguiente vídeo.
Slug propuesto: `es-iva-sobre-impuesto` · `arranque: 'lleno'` · serie `hacemos-la-cuenta`.

**Validez: publicar antes del 30/11/2026.** El gancho, «20 → 24» y «este mes, casi tres» solo valen mientras la rebaja sea de 20 céntimos (noviembre de 2026). Ver las variantes al final.

## Guion final (formato del motor)

```js
guion: [
  [0, 'La rebaja de 20 céntimos en la gasolina §*no son 20 céntimos*. §{pop}Son *24*.'],                                            // GANCHO
  [1, 'Esa rebaja es en el impuesto de la gasolina: §una *cantidad fija* por cada litro.'],                                         // RESPUESTA
  [2, 'Y el IVA, el 21 %, se calcula *con ese impuesto dentro*: §{ding}20 céntimos menos de impuesto son *4 menos de IVA*.'],         // RESPUESTA
  [3, 'Espera. §¿Pagamos *IVA sobre un impuesto*? §¿Eso es legal?'],                                                                 // PREGUNTA ABIERTA
  [4, 'Es legal, y no solo aquí: §lo manda *una directiva europea* para toda la UE.'],                                               // DESARROLLO
  [5, 'Ahora, la cuenta al revés. §Con el impuesto que fija la ley, 47 céntimos, aunque la gasolina saliera *gratis*, §sin petróleo, sin refinería y sin gasolinera, §{caja}pagarías *57 céntimos* por litro.'], // DATO (pico)
  [6, 'Casi diez de esos céntimos son *IVA sobre el impuesto*: §unos *cinco euros* cada 50 litros. Este mes, casi tres.'],            // DATO (segundo pico)
  [7, 'La luz, el tabaco y el alcohol, igual. §Mira hoy tu factura de la luz: el IVA también se calcula *sobre el impuesto eléctrico*.'], // ACCIÓN
  [8, 'En el surtidor, todo te llega *multiplicado por 1,21*. §Cuando acabe la rebaja, solo por el impuesto, el litro no subirá 20 céntimos: §{pop}subirá *24*.'] // CIERRE (vuelve al gancho: bucle)
]
```

Cambios frente al guion ganador (mejoras de los jueces que no tocan la exactitud):
- Frase 2: el 47 y el 27 salen de la voz y van en pantalla. El 47 se dice en la frase 6, justo donde hace falta para el 57.
- Frase 3: el 21 % va delante, para que no pasen 7-8 s sin cifra nueva.
- Frase 5: la respuesta legal es corta y sorprende («no solo aquí: lo manda una directiva europea»). La Ley del IVA (art. 78.Dos.4.º) pasa a la descripción.
- Cierre reordenado: primero la acción (factura de la luz) y como última frase la memorable. El vídeo acaba en «24» y, al repetirse, suena «…no son 20 céntimos. Son 24»: bucle natural.
- Se mantienen las correcciones del verificador: «por ley», «este mes, casi tres» y «solo por el impuesto».
- No se aplican las mejoras de los jueces que hablaban de IRPF y nómina (35.200, 19,55 %, tramos). Eran de otro guion.

## Palabras y duración

| Frase | Escritas | Leídas en voz alta | Empieza (aprox.) |
|---|---|---|---|
| 0 Gancho | 14 | 14 | 0,0 s |
| 1 Respuesta | 15 | 15 | 4,1 s |
| 2 Respuesta | 21 | 23 | 8,5 s |
| 3 Pregunta | 9 | 9 | 15,3 s |
| 4 Desarrollo | 15 | 16 | 17,9 s |
| 5 Dato (57) | 31 | 35 | 22,6 s («57» hacia los 31 s, un 57 % del vídeo) |
| 6 Dato (5 €) | 20 | 20 | 32,9 s |
| 7 Acción | 24 | 24 | 38,8 s |
| 8 Cierre | 25 | 27 | 45,9 s |
| **Total** | **174** | **183** | **≈ 54 s a 3,4 palabras/s; con las pausas §, unos 56-58 s** |

Si la locución real pasa de 60 s, recortar en este orden: «Espera.» (frase 3) y después «por cada litro» → «por litro» (frase 1). No tocar el «sin petróleo, sin refinería y sin gasolinera» ni la última frase.

## Escena → qué se ve (animación 3D)

Colores: blanco = neutro, turquesa = lo que controlas, rojo = lo que se escapa, ámbar = lo detectado.

| Escena | Voz | Qué se ve |
|---|---|---|
| 0 (fotograma 0 lleno) | «La rebaja de 20 céntimos… Son 24» | Desde el primer fotograma: maniquí blanco junto a un surtidor gigante, cartel de precio con «−20 cts» tachado y, al lado, «−24» en ámbar. Rótulo pequeño abajo: «Península y Baleares · gasolina 95 · noviembre de 2026». En {pop} el «−24» da un salto y brilla. |
| 1 | «una cantidad fija por cada litro» | Una columna transparente es un litro. Dentro, un bloque rojo sólido con la etiqueta «47 cts (ley)», que encoge hasta «27 cts (noviembre)». El resto de la columna es gasolina blanca. Tarjeta: «Impuesto de hidrocarburos: fijo por litro». |
| 2 | «el 21 %… 4 menos de IVA» | Una capa roja fina (IVA 21 %) envuelve toda la columna, también el bloque rojo. Cuando el bloque encoge 20, la capa encoge 4. En {ding}, tarjeta en ámbar: «20 + 4 = 24». |
| 3 | «¿IVA sobre un impuesto?» | El maniquí se gira a cámara y aparece un «?» ámbar. Una lupa ámbar enfoca justo donde la capa del IVA tapa al bloque del impuesto. Rótulo: «IVA sobre impuesto». |
| 4 | «lo manda una directiva europea» | Un mapa de la UE en el que todos los países se iluminan a la vez en blanco. Tarjeta pequeña: «Directiva 2006/112/CE, art. 78». Tono neutro, sin rojo. |
| 5 (PICO) | «…pagarías 57 céntimos» | El petróleo, la refinería y el surtidor se desvanecen uno por uno al ritmo de «sin petróleo, sin refinería, sin gasolinera», y la gasolina blanca se vacía. Solo quedan el bloque rojo «47» y su capa. Un maniquí rojo cobra y el contador marca «0,57 €» con el golpe de {caja}. La multitud del fondo se para y mira. Plano cerrado. Tarjeta: «0,47 × 1,21 = 0,57». |
| 6 | «unos cinco euros cada 50 litros. Este mes, casi tres» | Cinco bidones de 10 l en fila. De la capa roja sale volando un billete rojo de 5 €. Debajo, pequeño y rápido: «Este mes: 2,86 €». |
| 7 | «Mira hoy tu factura de la luz» | El maniquí, ahora turquesa, sostiene una factura de la luz. Un resaltado ámbar recorre la línea «Impuesto eléctrico» y la mete dentro de la «Base del IVA». Iconos pequeños de bombilla, cigarrillo y copa, en blanco. |
| 8 (fin) | «multiplicado por 1,21… subirá 24» | Vuelve el surtidor del fotograma 0 (mismo encuadre, para que el bucle encaje). Encima aparece «× 1,21» en ámbar. Dos flechas, una abajo y otra arriba, salen multiplicadas. En el {pop} final, el contador pasa de «+20» a «+24» en ámbar. Fin limpio: sin cartel de «síguenos» ni de «parte 2». |

## Cuentas (cuadra)

```js
const { cuadra } = require('../reels/_comun');
cuadra('tipo ley gasolina 95 (€/1.000 l)', +(400.69 + 72).toFixed(2), 472.69);
cuadra('tipo noviembre 2026 (€/1.000 l)', +(231.15 + 41.54).toFixed(2), 272.69);
cuadra('rebaja (€/1.000 l)', +(472.69 - 272.69).toFixed(2), 200);
cuadra('IVA de la rebaja: 4 cts', +(0.20 * 0.21).toFixed(3), 0.042);
cuadra('rebaja con IVA: 24 cts', +(0.20 * 1.21).toFixed(3), 0.242);
cuadra('Boletín Petrolero 02/11 (rep. 09/11)', +((1.15697 + 0.27269) * 1.21).toFixed(5), 1.72989);
cuadra('impuesto implícito Boletín', +(1729.89 / 1.21 - 1156.97).toFixed(2), 272.69);
cuadra('sin rebaja (no se dice)', +((1.15697 + 0.47269) * 1.21).toFixed(5), 1.97189);
cuadra('gasolina gratis: 57 cts', +(0.47269 * 1.21).toFixed(5), 0.57195);
cuadra('IVA sobre el impuesto: casi 10 cts', +(0.47269 * 0.21).toFixed(5), 0.09926);
cuadra('50 l con tipo ley: unos 5 €', +(0.47269 * 0.21 * 50).toFixed(2), 4.96);
cuadra('50 l este mes: casi 3 €', +(0.27269 * 0.21 * 50).toFixed(2), 2.86);
cuadra('47 y 27 redondeados', [Math.round(47.269), Math.round(27.269)].join('/'), '47/27');
cuadra('gasóleo gratis: 46 cts (comentarios)', Math.round(0.379 * 1.21 * 100), 46);
cuadra('diciembre si 13: casi 16', +(0.13 * 1.21).toFixed(4), 0.1573);
cuadra('diciembre si 13: tipo 34', +(472.69 - 130).toFixed(2), 342.69);
cuadra('dos saltos suman 24', +((0.20 - 0.13) * 1.21 + 0.13 * 1.21).toFixed(3), 0.242);
```

Todas pasan (comprobado el 14/11/2026).

## Fuentes

- Ley 38/1992 de Impuestos Especiales, art. 50, epígrafe 1.2.2: 400,69 + 72 = 472,69 €/1.000 l (gasóleo, 1.3: 307 + 72 = 379). BOE, texto consolidado, consultado el 14/11/2026. https://www.boe.es/buscar/act.php?id=BOE-A-1992-28741
- AEAT, tipos del impuesto de hidrocarburos de noviembre de 2026 (TIPOSIHNOV26.xlsx, descargada el 14/11/2026): gasolina sin plomo 95, 231,15 + 41,54 = 272,69; 98 octanos, 303,92; gasóleo de uso general, 179. https://sede.agenciatributaria.gob.es/static_files/Sede/Tema/Aduanas/TIPOSIHNOV26.xlsx
- AEAT, novedad del 20/10/2026: rebaja de 20 céntimos en noviembre para gasolinas sin plomo y gasóleo de uso general. https://sede.agenciatributaria.gob.es/Sede/impuestos-especiales-medioambientales/novedades-impuestos-especiales-medioambientales/2026/octubre/20/medidas-tributarias-impuesto-sobre-hidrocarburos-medio_.html
- AEAT, noticia sobre el RDL 25/2026 (30/09/2026, actualizada el 05/11/2026): calendario de la rebaja y cláusulas del IPC; IVA de la luz al 10 % e impuesto eléctrico rebajado, condicionados. https://sede.agenciatributaria.gob.es/Sede/todas-noticias/2026/septiembre/30/nuevas-medidas-marco-plan-integral-medio.html
- Ley 37/1992 del IVA, art. 78.Dos.4.º: la base «comprenderá los impuestos especiales» (salvo el de determinados medios de transporte). Art. 90: tipo general del 21 %. BOE, consultado el 14/11/2026. https://www.boe.es/buscar/act.php?id=BOE-A-1992-28740
- Directiva 2006/112/CE, art. 78 a): la base imponible incluye impuestos, derechos, tasas y exacciones, salvo el propio IVA. DOUE L 347, 11/12/2006. https://www.boe.es/doue/2006/347/L00001-00118.pdf
- Comisión Europea, Boletín Petrolero, España, gasolina 95, datos del 02/11/2026 (repetidos el 09/11): 1.729,89 €/1.000 l con impuestos y 1.156,97 sin impuestos. Histórico descargado el 14/11/2026. https://energy.ec.europa.eu/data-and-analysis/weekly-oil-bulletin_en
- Contraste en prensa de consumo (secundaria): Selectra, 26/10/2026. https://selectra.es/energia/noticias/carburantes-2026-noviembre-rebaja-impuesto-litro

## Texto de la publicación

```
La rebaja de 20 céntimos en la gasolina no son 20 céntimos. Son 24.

Lo que no cabía en el vídeo:
• La regla está en el art. 78 de la Ley del IVA: la base del IVA incluye los impuestos especiales (hidrocarburos, electricidad, tabaco, alcohol).
• Con el gasóleo pasa lo mismo: misma rebaja de 20, que en el surtidor son 24. Y con su impuesto de ley (37,9 céntimos), el gasóleo «gratis» costaría unos 46 céntimos el litro.
• En Canarias no hay IVA ni este impuesto (allí hay IGIC y un impuesto propio), y en Ceuta y Melilla tampoco hay IVA. Las cifras del vídeo son para la península y Baleares, gasolina 95, noviembre de 2026.

¿Sabías que pagabas IVA sobre un impuesto? 👇

Fuentes: Ley 38/1992 (art. 50) y Ley 37/1992 del IVA (art. 78), BOE; tabla de tipos de noviembre de 2026 y RDL 25/2026, Agencia Tributaria; Directiva 2006/112/CE; Boletín Petrolero de la Comisión Europea (02/11/2026). Consultadas el 14/11/2026.

#gasolina #impuestos #IVA
```

## Portada (portadas.json)

```json
"es-iva-sobre-impuesto": {
  "titulo": "La rebaja de ~20~ 24 céntimos",
  "destacado": "24 céntimos",
  "color": "ambar",
  "serie": "hacemos-la-cuenta",
  "fotograma_ms": 31000
}
```

Titular de 6 palabras; la palabra destacada es «24 céntimos». `fotograma_ms` apunta al pico del «0,57 €» (escena 5), que completa el titular sin repetirlo. Hay que ajustarlo con la locución real.

## Para los comentarios y las variantes

- Gasolina 98: tipo de ley 431,92 + 72 = 503,92 (50 céntimos); en noviembre, 303,92. La rebaja es la misma, así que el gancho vale.
- El precio final también depende del crudo y del margen de cada gasolinera. El «subirá 24» es solo el efecto del impuesto, con el resto igual (por eso la frase dice «solo por el impuesto»).
- Si en diciembre la rebaja baja a 13, la subida llega en dos saltos (unos 8,5 y 15,7 céntimos), pero el total frente a noviembre sigue siendo 24.
- Variante para diciembre, si la rebaja queda en 13: «no son 13, son casi 16»; el impuesto de diciembre, 34 céntimos; «casi 3 menos de IVA»; «subirá casi 16». Antes hay que comprobar en el texto del RDL 25/2026 qué IPC de octubre cuenta.
- Si la rebaja desaparece, gancho fijo: «Al llenar el depósito pagas IVA… sobre un impuesto».
