# Guion · «¿Bajaría la vivienda un 30 % quitando impuestos?»

Vídeo de contraste para @finanziapp.es (España), en 3D, de unos 80 s. Dosier con fuentes:
`2026-11-vivienda-impuestos-30.md`. Slug: `es-contraste-vivienda-30`.

**Enfoque (decisión del supervisor):** se comprueba la cifra, no se juzga a la persona ni al partido. Se dice qué parte es
cierta (los impuestos pesan y la propuesta ahorra dinero real, que además sale de los ahorros), qué no sale (un 30 % solo
con los impuestos de la compra) y de dónde puede venir el número (toda la cadena de una vivienda nueva, según el programa
de Vox). Hay elecciones generales el 29-N: neutralidad total. No se promociona como anuncio y no se publica el 28-N.

**Versión 3 (11 nov 2026), tras la verificación independiente.** Cambios: «quitar impuestos» (no «los impuestos»); no se
le atribuye a él el origen del 30 %, se cita el programa; «promotores de Madrid» y que su 26 % ya incluye el IVA; las Cortes
pueden cambiar las leyes; «2008 y 2009» y «más de la mitad, pero no todo»; el argumento de que ese dinero no lo cubre la
hipoteca; aviso de Canarias, Ceuta y Melilla.

**El cierre (decisión del propietario):** guiño sutil a que al presentador se le trabó la lengua y la pregunta «¿qué te
pareció la entrevista?». Las dos revisiones lo desaconsejan (se usó para ridiculizarle desde un bando, puede leerse como
que el entrevistado «se trabó» con la cifra y puede sentar mal a quien tartamudea). Se mantiene porque lo pide el
propietario, con tres condiciones: no se le nombra, la frase habla de **preguntar** en directo (así no se confunde con el
entrevistado) y el tono es de comprensión, nunca de burla. Hay un **cierre B** sin guiño, listo para cambiarlo.

**Sin comprobar:** la frase literal y el minuto (RTVE Play no es accesible desde la máquina). Por eso «según algunas crónicas».

## Guion (voz de narrador)

```js
[0, '¿Bajaría tu casa *un 30 %* §solo con quitar impuestos? §Vamos a hacer la cuenta.'],
[1, 'El 9 de noviembre, en La Revuelta, Santiago Abascal propuso §quitar impuestos a la compra de la *primera vivienda*. §Según algunas crónicas, dijo que así sería *al menos un 30 %* más barata.'],
[2, 'Lo que pagas al comprar una vivienda nueva de 200.000 euros: §IVA del 10 %, §{caja}más actos jurídicos. Entre *21.000 y 23.000 euros*, según la comunidad.'],
[2, 'Eso es §{pop}*en torno a un 10 %* de lo que pagas, no un 30.'],
[3, 'Y casi cuatro de cada cinco compras son de *segunda mano*. §Ahí pagas transmisiones: §en casi toda España, entre un *6 y un 10 %* del precio.'],
[4, '¿Y de dónde puede salir el 30? §El programa de Vox habla de trabas y cargas en *toda la construcción*: suelo, licencias, obra y venta. §{ding}Los promotores de Madrid lo cifran en *más de un 26 %*, contando también el IVA.'],
[5, 'Esa cadena pasa por tres manos. §El IVA lo fija el *Estado*. §Transmisiones, las *comunidades*. §Licencias y plusvalía, los *ayuntamientos*. Las Cortes pueden cambiarlo, pero habría que compensarles.'],
[6, 'Y cuando baja un impuesto, el precio no baja lo mismo. §En Reino Unido, en 2008 y 2009, §{pop}de cada 100 libras de rebaja, al comprador le llegaron unas *60*. Más de la mitad, pero no todo.'],
[7, 'El resultado: quitar los impuestos de la compra ahorra, como mucho, *en torno a un 10 %*. §Es mucho dinero, y sale de tus ahorros: la hipoteca normalmente no lo cubre. §Pero para acercarse al 30 habría que tocar *toda la cadena*.'],
[8, 'Preguntar en directo no es fácil: a cualquiera se le traba la lengua. §Las cuentas, por suerte, se hacen con calma. §{pop}¿Qué te pareció *la entrevista*?']
```

Cierre B (sin guiño, por si el propietario lo prefiere; se renderiza aparte como `es-contraste-vivienda-30b`):

```js
[8, 'Nosotros hemos hecho la cuenta. §{pop}¿Y a ti, qué te pareció *la entrevista*? Te leemos.']
```

Cuentas que hay que comprobar con `cuadra()`: 200.000 × 10 % = 20.000; AJD 0,5 %–1,5 % = 1.000–3.000; total 21.000–23.000;
21.000 / 221.000 ≈ 9,5 % y 23.000 / 223.000 ≈ 10,3 %; 900 / 1.500 = 60 %; 100 − 21,3 = 78,7 % de segunda mano (INE, agosto de 2026).

Rótulo obligatorio en la escena 2 (pequeño, abajo): «Península y Baleares. En Canarias, Ceuta y Melilla el impuesto es otro».

## Texto de la publicación

```
¿Bajaría la vivienda un 30 % solo con quitar impuestos? Hemos hecho la cuenta. 🏠

Lo que se propuso en La Revuelta (9 nov): quitar impuestos a la compra de la primera vivienda. Lo que dicen los números: en obra nueva esos impuestos son en torno a un 10 % de lo que pagas y, en segunda mano, entre un 6 y un 10 % del precio en casi toda España. Es dinero que sale de tus ahorros, porque la hipoteca normalmente no lo cubre. Para acercarse a un 30 % habría que tocar toda la cadena de una vivienda nueva (suelo, licencias, obra y venta): los promotores de Madrid la cifran en más de un 26 %, contando el IVA.

¿Qué te pareció la entrevista? ¿Y qué impuesto bajarías tú primero? 👇 Con respeto, que aquí venimos a hacer cuentas.

Fuentes: Ley 37/1992 del IVA (art. 91) · RDLeg. 1/1993 (ITP y AJD) · programa económico y de vivienda de Vox (2025) · EY para ASPRIMA (junio de 2026) · INE, transmisiones de derechos de la propiedad (agosto de 2026) · Besley, Meads y Surico (2014) · crónicas de la entrevista. En Canarias, Ceuta y Melilla el impuesto de la obra nueva es otro (IGIC, IPSI).

#vivienda #impuestos #finanzaspersonales #hacemoslacuenta #educacionfinanciera
```

## Puesta en escena (ideas para producción)

Protagonista visual: **una casa hecha de 100 bloques** (cada bloque, un 1 % de lo que pagas). Los bloques se encienden por
colores según la cuenta; los maniquíes son quienes deciden o quienes compran. Sin caricaturas ni imágenes de personas reales.

| Escena | Qué se ve |
|---|---|
| 0 · Gancho | La casa de 100 bloques y 30 parpadeando en rojo. Rótulo «¿−30 %?». Entera desde el fotograma 0. |
| 1 · La propuesta | Tarjeta «La Revuelta · 9 nov 2026», «Quitar impuestos a la compra de la primera vivienda» y la cita corta «al menos un 30 %» con «según algunas crónicas». |
| 2 · Obra nueva | Se encienden 10 bloques (turquesa): «IVA 10 % + AJD = 21.000–23.000 €». Los otros 20 rojos se apagan: «≈10 %, no 30». Rótulo pequeño de Canarias, Ceuta y Melilla. |
| 3 · Segunda mano | 5 casas pequeñas, 4 marcadas «segunda mano». «Transmisiones: 6–10 % del precio». |
| 4 · De dónde puede salir el 30 | La cadena: suelo → licencias → obra → venta; se encienden 26 bloques en ámbar. Rótulos «Programa de Vox: hasta un 30 % (trabas y cargas de la construcción)» y «Promotores de Madrid (EY, 2026): más del 26 %, IVA incluido». |
| 5 · Tres manos | Tres maniquíes con rótulo (ESTADO, COMUNIDADES, AYUNTAMIENTOS), cada uno junto a sus bloques. Al final, «Las Cortes pueden cambiarlo, compensando». |
| 6 · La rebaja no llega entera | 10 maniquíes-moneda salen de la rebaja; 6 llegan al comprador (turquesa) y 4 se quedan en el precio (ámbar). «Reino Unido, 2008–09 · Besley, Meads y Surico (2014)». |
| 7 · Resultado | Dos casas o dos barras: «Impuestos de la compra: ≈ −10 % · de tus ahorros» frente a «−30 %: toda la cadena». |
| 8 · Cierre | El héroe turquesa junto a la casa, tranquilo (nada de gestos de burla ni micrófonos caídos). Con la última frase, la pregunta grande «¿Qué te pareció la entrevista?». Sin tarjeta de serie. |
