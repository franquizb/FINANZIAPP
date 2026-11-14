# Registro de Reels hablados

Cada vídeo hablado que se sube a Drive, con la pregunta con la que termina. La
pregunta abre la puerta al siguiente vídeo («si te lo has preguntado alguna vez,
síguenos para no perdértelo»): hay que responderla en una píldora posterior,
no hace falta que sea la siguiente. Sin numerar las partes.

Desde el #5 cada cuenta tiene sus propios vídeos (ESTRATEGIA.md) y todos llevan `arranque: 'lleno'` (fotograma 0 completo).

Formato actual: píldoras centradas en la retención (unos 40–60 s si engancha): gancho → dato → sorpresa → defensa → pregunta abierta. Escenas a pantalla completa con muñecos que hacen la historia, no gráficos.
Voz: `VOZ` de `_comun.js` (v3: carisma cercano; la v2 era demasiado sarcástica). Cierres: no repetir el del vídeo anterior.

| # | Tipo | Tema (slug) | Duración EN/ES | Cierre | Pregunta con la que termina | La responde |
|---|------|-------------|----------------|--------|-----------------------------|-------------|
| 1 | Reel largo | La cinta de correr del dinero (`cinta-de-correr`) | 64 / 65 s | moneda | — | — |
| 2 | Reel largo | El dolor de pagar (`dolor-de-pagar`) | 63 / 65 s | tarro | — | — |
| 3 | Píldora · Trampas de precio | Las palomitas medianas: efecto señuelo (`trampa-01-senuelo`) | 32 / 30 s | salto | ¿Por qué casi todo cuesta 9,99? | #4 |
| 4 | Píldora · Trampas de precio | Por qué casi todo cuesta 9,99 (`precio-999`): **no publicada**, sustituida por las versiones por cuenta (#5 y #6) | 59 / 57 s | moneda | — | — |
| 5 | Píldora · solo ES | La milésima de la gasolinera (`es-gasolina-1499`) · publicada 8 nov 2026 en @finanziapp.es y en la página de Facebook Finanziapp ES | 46 s | tarro | ¿Por qué funciona el «antes 199 €, ahora 99 €» aunque sepas que es inventado? | #7 |
| 6 | Píldora · solo EN | 79,900 vs 80,000 miles (`en-millas-79900`) · publicada 8 nov 2026 en @finanziapp y programada en la página de Facebook FinanziApp (8 nov, 19:30 de Nueva York) | 39,5 s | tarro | Why does “was $199, now $99” work even when you know it’s made up? | pendiente: anchoring (EN) |

| 7 | Píldora · solo ES | Black Friday: el «antes 199 €» (`es-precio-tachado`): efecto ancla y la regla de los 30 días · programada 8 nov 2026, 20:30, en Instagram y Facebook | 60 s | moneda | ¿Qué parte de lo que pagas en el súper le llega al agricultor? | pendiente: desmontar un precio del súper (ES) |
| 8 | Píldora · solo EN | Your first $1,000 changes 3 things (`en-hito-1000`): 1.ª de la serie de hitos · Instagram 8 nov 19:00 NY, Facebook 9 nov 19:00 NY | 38 s | salto | Why your 401(k) match might be the best return you’ll ever get | pendiente: 401(k) match (EN) |

Desde el #7: **subtítulos palabra a palabra** (alinear.py con Whisper) y **efectos de sonido** (sfx.py; en el guion, `§{pop}`, `§{caja}`, `§{ding}`, `§{tic}`; los cambios de escena llevan «whoosh»).

## Serie en 3D · «30 días para ordenar tu dinero» (`reto-es.js`, mundo 3D en `tres.js`)

Maniquíes en 3D, voz de narrador (`VOZ_NARRADOR`), subtítulos arriba y «DÍA n/30». Cada día acaba con «Mañana: …», así que
**hay que tener listo el día siguiente antes de publicar uno**. Va en el primer hueco de la mañana (7:30 de Canarias), que es
el único que despega. El texto de la publicación es corto: gancho, qué hacer hoy y «mañana…» (no repite el guion).

| Día | Tema (slug) | Publicación | Mañana anuncia |
|-----|-------------|-------------|----------------|
| 1 | ¿A dónde se va tu sueldo? Apunta cada gasto 7 días y etiquétalo (`es-reto-01`) | 10 nov 2026, 7:30 | El gasto que se te escapa sin darte cuenta |
| 2 | Suscripciones y cargos que se repiten: cancela uno (`es-reto-02`) | 11 nov 2026, 7:30 | Lo que vale de verdad una hora de tu trabajo |
| 3 | Lo que vale de verdad una hora de tu trabajo: calcula tu hora y pasa los precios a horas (`es-reto-03`) | 12 nov 2026, 13:00 (programado) | El truco de las 24 horas antes de comprar |
| 4 | El truco de las 24 horas: si no es comida ni urgencia, espera un día antes de pagar (`es-reto-04`) | 13 nov 2026, 7:30 (programado) | Págate a ti primero, el mismo día que cobras |
| 5 | Págate a ti primero: transferencia automática el día que cobras (`es-reto-05`) | 14 nov 2026, 10:24 Madrid | Las comisiones del banco que puedes dejar de pagar |
| 6 | Las comisiones del banco: busca mantenimiento y tarjeta en el extracto (`es-reto-06`) | 15 nov 2026, ~10:30 Madrid (programado) | — (desde aquí, sin anunciar el siguiente: cierre con lo aprendido) |

Sin «si te pica» en ningún cierre (no le gusta al propietario): «Te lo cuento en el próximo vídeo. Síguenos» o «La respuesta, en el siguiente vídeo».

## Cuenta de EE. UU. desde el 12 nov 2026 (3D, voz de narrador «Iapetus»)

| Serie | Vídeo (slug) | Publicado | Anuncia |
|---|---|---|---|
| Money, explained | Why every gas price ends in 9/10 of a cent (`en-gas-nine-tenths`) | 12 nov 2026, ~18:00 NY (programado) | — |
| 30 days to get your money in order | Day 1: where your paycheck goes (`en-reto-01`) | 13 nov 2026, ~18:00 NY (programado) | The charges that hit your account every month |
| 30 days to get your money in order | Day 2: charges that repeat, cancel one (`en-reto-02`) | 14 nov 2026, ~18:30 NY (programado) | What one hour of your work is really worth |
| Money, explained | Gas stations barely make money on gas… or do they? (`en-curious-gas-stations`) | 15 nov 2026, ~18:00 NY (programado) | — |

## «Hacemos la cuenta» (vídeos de contraste de noticias, España)

Un dato de actualidad de nuestro ámbito, comprobado con fuentes: dosier y guion verificado en `investigacion/`. Se comprueba
la cifra, no se juzga a la persona. No se promocionan como anuncio y no se publica nada de política en jornada de reflexión.

| N.º | Tema (slug) | Publicado | Cierre |
|---|---|---|---|
| 1 | ¿Bajaría la vivienda un 30 % quitando impuestos? (`es-contraste-vivienda-30`; final B sin guiño: `…-30b`) | 12 nov 2026, 7:30 (programado) | «¿Qué te pareció la entrevista?» |
| 2 | La rebaja de 20 céntimos que en realidad son 24: IVA sobre el impuesto de la gasolina (`es-iva-sobre-impuesto`, formato extenso, 55 s) | 15 nov 2026, ~18:00 Madrid (programado) | «¿Sabías que pagabas IVA sobre un impuesto?» |

## Pendientes (preguntas abiertas)

- ES: ¿Qué parte de lo que pagas en el súper le llega de verdad al agricultor? ← abierta en el #7.
- EN: Why does “was $199, now $99” work even when you know it’s made up? (anchoring) ← abierta en el #6; para la semana del Black Friday (27 nov).
- EN: Why your 401(k) match might be the best return you’ll ever get ← abierta en el #8.
