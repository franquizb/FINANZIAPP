# Perfil de Instagram de FinanziApp

Todo lo necesario para abrir la cuenta y llenar las tres primeras semanas.
Los anuncios de pago están en README.md; esto es el contenido **orgánico**.

## Qué hay

| Ruta | Qué es |
|---|---|
| `out/perfil/foto-perfil.png` | Foto de perfil (1080 × 1080; Instagram la recorta en círculo). Mismo símbolo que la app y la web |
| `out/perfil/destacadas/*.png` | Portadas de las 5 historias destacadas, en orden |
| `out/perfil/portada-facebook-{en,es}.png` | Portadas de las páginas de Facebook (1640 × 624), con los muñecos de los Reels (`portada-facebook.js`) |
| `out/perfil/vista-es.jpg`, `vista-en.jpg` | Cómo quedará el perfil con los 9 posts publicados |
| `out/<idioma>/posts/` | 9 posts (5 de ellos carruseles), 1080 × 1350 |
| `out/<idioma>/historias/<destacada>/` | 26 historias, 1080 × 1920, agrupadas por destacada |
| `out/<idioma>/textos.md` | Pie de foto con hashtags, texto alternativo y stickers de cada pieza |

Además, los anuncios (`out/<idioma>/feed-4x5`, `stories-9x16`, `carrusel-1x1`)
y los dos vídeos sirven como posts y Reels cuando se acabe este material.

## ¿Una cuenta o dos?

**Una sola cuenta, `@finanziapp`, en inglés**, con los archivos de `out/en/`.
El lanzamiento es en EE. UU.: quien vea un anuncio y toque el perfil tiene que
encontrarlo en su idioma, con dólares en las capturas. El juego en español
(`out/es/`) queda listo para una segunda cuenta (`@finanziapp.es`) cuando
lances en España.

## Antes de publicar

- **Compra finanziapp.com.** Aparece en todas las imágenes y en la bio; hoy no
  existe y quien lo escriba no llegará a ninguna parte.
- Despliega el hosting: la pantalla de registro y el icono de la web ya están en
  turquesa, igual que en las capturas.

## Configurar la cuenta (15 minutos)

1. Crea la cuenta con un correo tuyo (cuando exista, `hello@finanziapp.com`).
2. Usuario: `finanziapp`. Si está cogido: `finanziapp.app` o `usefinanziapp`.
3. Configuración → Tipo de cuenta → **Cuenta profesional → Empresa**, categoría
   **Aplicación** (*App page*). Da estadísticas, botón de contacto y permite
   anunciarte con la cuenta.
4. Nombre, bio y enlace: copia los bloques de abajo.
5. Foto de perfil: `out/perfil/foto-perfil.png`.
6. Conecta la cuenta a una página de Facebook en Meta Business Suite: es lo que
   permite que los anuncios salgan con el nombre y la foto de @finanziapp.
7. Botón de contacto: correo de soporte.
8. Activa la verificación en dos pasos.

### Nombre (sale en las búsquedas; máximo 30 caracteres)

```
FinanziApp: finanzas y ahorro
```
```
FinanziApp: Budget & Savings
```

### Bio (máximo 150 caracteres)

```
📊 Tu dinero, claro y en un solo sitio
💸 Presupuesto, gastos y patrimonio
💡 Trucos para ahorrar cada semana
👇 15 días gratis, sin tarjeta
```
```
📊 All your money, clear and in one place
💸 Budget, spending & net worth
💡 Money tips every week
👇 Free for 15 days, no card
```

Enlace: `https://finanziapp.com`

## Historias destacadas

Publica las historias de cada grupo (calendario de abajo) y, desde la propia
historia, **Destacar** → nueva destacada con su nombre y su portada:

| Portada | Nombre | Historias |
|---|---|---|
| `01-novedades.png` | Novedades / News | `historias/novedades/` |
| `02-como-funciona.png` | Cómo funciona / How it works | `historias/como-funciona/` |
| `03-calculadoras.png` | Calculadoras / Calculators | `historias/calculadoras/` |
| `04-consejos.png` | Consejos / Tips | `historias/consejos/` |
| `05-preguntas.png` | Preguntas / FAQ | `historias/preguntas/` |

Las historias con hueco libre (enlace, encuesta, cuestionario y preguntas)
llevan el sticker indicado en `textos.md`: se añade en Instagram al subirlas.

## Calendario de las tres primeras semanas

Posts en el orden numerado (el 1 queda abajo a la derecha y la cuadrícula sale
en damero oscuro/claro). Fija arriba el 1 y el 3 (presentación y «Empieza en 3
pasos»).

| Día | Post | Historias |
|---|---|---|
| Semana 1 · lunes | 1 · Presentación | Novedades 1–3 |
| miércoles | 2 · Regla 50/30/20 | Consejos 2 |
| viernes | 3 · Empieza en 3 pasos | Cómo funciona 1–3 |
| sábado | | Cómo funciona 4–6 |
| Semana 2 · lunes | 4 · Fondo de emergencia | Consejos 1 (encuesta) |
| martes | | Consejos 3 |
| miércoles | 5 · Salud financiera | Consejos 4 |
| jueves | | Consejos 6 (cuestionario) |
| viernes | 6 · Interés compuesto | Consejos 7 (respuesta) |
| sábado | | Calculadoras 1–2 |
| Semana 3 · lunes | 7 · Patrimonio | Calculadoras 3–4 |
| miércoles | 8 · Sin conectar tu banco | Preguntas 1–3 |
| viernes | 9 · Calculadoras | Preguntas 4–5 · Novedades 4 (preguntas) |
| domingo | | Consejos 5 (efecto café) |

A partir de la semana 4: los vídeos de los anuncios como Reels, comparte en
historias cada post nuevo y responde a lo que te pregunten en el sticker de
«¿Qué te gustaría ver?» (es contenido para nuevos posts).

## Buenas costumbres

- Programa las publicaciones (Meta Business Suite o la programación de la
  propia app) en horario de EE. UU. Para empezar, prueba las 12:00–13:00 o las
  19:00–21:00 hora del Este (18:00–19:00 o 01:00–03:00 en España) y, tras dos
  semanas, mira en Estadísticas cuándo está conectada tu audiencia.
- Contesta los comentarios en la primera hora: Instagram lo premia.
- Pon el texto alternativo de cada post (está en `textos.md`).
- En historias y Reels, la música se añade desde la biblioteca de Instagram.
- Los consejos llevan «contenido educativo, no es asesoramiento financiero»:
  no lo quites, sobre todo en los de inversión.
- Si un día publicas contenido patrocinado, márcalo con la etiqueta de
  colaboración pagada de Instagram.

## Regenerar (si cambian la app o los textos)

Con el modo demo sirviéndose en el puerto 4300 (pasos en README.md):

```bash
node capturar.js http://localhost:4300   # capturas reales de la app
node perfil.js --web                     # foto, portadas y, con --web, iconos de la web
node organico.js                         # posts, historias y textos.md
node vista.js                            # vista previa del perfil
node portada-facebook.js                 # portadas de las páginas de Facebook
```

Los textos y las composiciones están en `organico.js` (`POSTS` e
`HISTORIAS`); los de la vista previa, en `vista.js`. Las cifras de los
ejemplos (interés compuesto, 50/30/20, fondo de emergencia) se calculan en el
propio script.

## Páginas de Facebook

Las dos páginas van iguales salvo el idioma (puestas por API el 8 nov 2026):

| Página | Cuenta de Instagram | Descripción |
|---|---|---|
| FinanziApp | @finanziapp (EE. UU.) | Money, made simple 💸 Short videos on prices, saving and money milestones. 15 days free ↓ |
| Finanziapp ES | @finanziapp.es (España) | Tu dinero, explicado fácil 💸 Vídeos cortos sobre precios, ahorro y tu nómina. 15 días gratis ↓ |

Foto de perfil `out/perfil/foto-perfil.png`, portada `out/perfil/portada-facebook-<idioma>.png`
y web https://finanziapp.com. El nombre de la página solo se puede cambiar desde Facebook (no por API).
Los Reels se publican con `marketing/educativo/publicar-facebook.cjs`.
