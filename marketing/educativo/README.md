# Carruseles educativos (Instagram y TikTok en modo foto)

Contenido de valor primero: cada carrusel explica un concepto de finanzas
personales con ilustraciones y gráficos propios, en un estilo tranquilo y
editorial con la paleta de la web. La app aparece solo como firma y, al
final de la descripción, como invitación suave.

- `comun.js`: estilos, iconos de línea propios y barra apilada. Colores de las
  categorías validados (fondo oscuro y daltonismo) con la skill dataviz.
- `temas/<slug>.js`: diapositivas (inglés en dólares, español en euros) y la
  descripción de la publicación: explicativa, con fuentes cuando las hay y, de
  vez en cuando, una pregunta sutil para invitar a comentar.
- Generar: `node carrusel.js <slug> [en|es] [4x5|9x16]` → `out/<slug>/<idioma>/<formato>/01.jpg…` y `texto.txt`.
- Subir a Drive (unidad compartida FinanziApp → 1 · Por publicar → Día → publicación):
  `node publicar-drive.cjs <dir con google-auth-library> <credencial.json> carrusel out/<slug> "Día N · …" "N · Carrusel · Título"`.

# Reels educativos (Instagram, Facebook y TikTok, 9:16)

Vídeos de 25 a 30 segundos con la misma estética: escenas que entran una
tras otra, barras que crecen y cifras que cuentan, con fundidos suaves y un
colchón de música original (`musica.py`, sin derechos de terceros, así que
Metricool puede publicarlos solo).

- `reels/<slug>.js`: escenas, duraciones, textos (EN en dólares, ES en euros)
  y la descripción. Las cifras salen de fórmulas y `cuadra()` detiene el
  render si el texto y las cuentas no coinciden.
- `reels/_comun.js`: piezas compartidas (filas con barra, listas, cifra
  grande, dos tarjetas de gancho, cita, cierre).
- Revisar rápido: `node reel.js <slug> --vista` → un fotograma por escena en
  `out-reels/<slug>/<idioma>/vista-NN.jpg` y aviso si algo no cabe.
- Generar: `node reel.js <slug> [en|es]` → `out-reels/<slug>/<idioma>/reel.mp4`,
  `portada.jpg` y `texto.txt` (unos 30 s de render por idioma).
- Subir: `node publicar-drive.cjs <…> <…> reel out-reels/<slug> "Día N · …" "3 · Reel · Título"`.
- Guías y calendario: `publicar-drive.cjs doc|hoja <archivo> raíz "<título>" --reemplazar`
  actualiza el documento sin cambiar su enlace.

# Reels hablados (voz en off + metáfora animada)

**Formato actual: píldoras de 20–30 s** (el propietario vio que en los Reels de
~65 s solo el 2 % llegaba al final): gancho → dato → remate → una pregunta
abierta de otro tema («¿Y por qué casi todo cuesta 9,99? Si te lo has
preguntado alguna vez, síguenos para no perdértelo»), sin numerar partes. Cada
pregunta se apunta en `reels-voz/REGISTRO.md` (y en la hoja «Registro de Reels
hablados» de Drive) y se responde en una píldora posterior.
Los dos primeros Reels (largos) siguen la estructura gancho → intro → cuerpo →
bucle → cuerpo → bucle → final.
Tono: amigo listo con carisma (energía, sonrisa en la voz, ironía ligera).

- `reels-voz/<slug>.js`: guion por frases `[escena, texto]` en EN y ES.
  `*palabra*` sale resaltada en los subtítulos, `[sarcasm]`, `[short pause]`…
  dirigen la voz (no salen en pantalla) y `§` marca momentos para la animación.
- **Voz oficial** (no cambiar sin que lo pida el propietario):
  `reels-voz/_comun.js` → `VOZ`, versión con carisma: Gemini 3.1 Flash TTS,
  Puck en inglés y Charon en español (acento peninsular pedido lo primero),
  ritmo 1,15×. `VOZ_V1` (más seca) se conserva para los dos primeros Reels.
  Palabras que hacen saltar el filtro de Google: «never mean, never like an
  ad», «sarcasmo juguetón», «como un adulto», frases muy cortas. Cada Reel nuevo usa `voz: VOZ`, más las escenas comunes
  `bucle(…)` y `cierre`.
- `voz.cjs`: voz de Google Cloud Text-to-Speech (Gemini TTS, dirigida con un
  `estilo`); cada frase se guarda en `cache-voz/` para no volver a pagarla.
- `reel-voz.js`: escenas al ritmo real de la voz, subtítulos grandes y
  `mezcla.py` baja la música mientras se habla.
- Revisar sin voz: `node reel-voz.js <slug> --vista --sin-voz`.
- Con voz (necesita la credencial en FBT y SA): `node reel-voz.js <slug>`.
- Revisión de la voz (obligatoria antes de renderizar):
  `node revisar-voz.cjs <…> <…> <slug>` hace que Gemini escuche cada frase,
  compruebe que dice exactamente el guion (a veces el modelo se inventa frases)
  y, en español, que el acento sea peninsular (cada toma puede salir con seseo).
  Las tomas malas se repiten solas. La indicación de acento va siempre en
  positivo: si menciona otro acento para descartarlo, el filtro de Google
  bloquea las frases. Las frases muy cortas («De nada») también las bloquea:
  mejor unirlas a la anterior con una pausa.
- Retención: `T[lang].retencion` es un texto fijo arriba que deja una curiosidad
  pendiente («Espera al truco de los 2 toques»); todos los Reels lo llevan.
- Cierre: un muñeco sin cara que cambia en cada vídeo, `cierreCon('moneda' |
  'tarro' | 'salto')` (caza una moneda y se la guarda, llena un tarro y lo
  celebra, o salta con confeti), y siempre acaba saludando con un bocadillo
  (`CIERRE`), sin eslóganes. Cierres usados: cinta-de-correr → moneda,
  dolor-de-pagar → tarro.
- Estilo visual (petición del propietario): escenas a **pantalla completa con
  muñecos que hacen la historia** (cartel, rotulador, coches…), no gráficos ni
  tarjetas arriba. `suelo: true` pone un suelo común que llena la parte de abajo;
  `SCRIPT_MUNECO` (`posar`, `mano`, `POSES`) anima muñecos y lo que llevan en la mano.
- **Subtítulos palabra a palabra**: golpes de 1–3 palabras con la que suena
  resaltada. Los tiempos salen de la voz real con `alinear.py` (Whisper en local,
  gratis; se guardan junto a cada toma en `cache-voz/`). Hace falta
  `pip install faster-whisper` en un entorno de Python y decir cuál con
  `WHISPER_PY=/ruta/al/python`; sin él, el tiempo se reparte por el largo de las
  palabras. Las marcas § caen ahora en el momento exacto de la palabra.
- **Efectos de sonido** (`sfx.py`, sintetizados aquí, sin licencias): cada cambio
  de escena lleva «whoosh» y en el guion se ponen con `§{pop}`, `§{caja}`,
  `§{ding}` o `§{tic}` (la marca sigue sirviendo a la animación). La voz nunca
  lee el nombre del efecto.
- Revisar una animación: `node reel-voz.js <slug> es --escena=N` (8 fotogramas).
- Subir: carpeta «Reels hablados (publícalos cuando quieras)» en Drive;
  `publicar-drive.cjs reel … --reemplazar` actualiza los vídeos sin cambiar el enlace.

# Estadísticas, cuaderno y publicación por API

- **Panel de redes**: https://franquizb.com (carpeta `estadisticas-web/`, sitio de
  Hosting `franquizb-web` del proyecto `franquizb-web`; la página personal de antes
  sigue en `/brian/`, y estadisticas.franquizb.com redirige a la raíz con
  `estadisticas-web/redireccion/`). Solo entra la cuenta de Google del propietario.
  Una pestaña por cuenta (España y EE. UU.) con Instagram y Facebook: KPIs con
  variación, «qué toca ahora», gráficas, todas las publicaciones con su detalle
  (curva de arranque y, en Facebook, curva de retención), comentarios con
  responder y ocultar, el **cuaderno** editable, referentes editables y mis
  conclusiones; y una pestaña de sistema (última lectura, errores, token).
- **Datos**: la función `panelActualizar` (codebase `panel`,
  `app-financiera/panel-funciones/`, europe-west1) lee Meta cada hora con el
  secreto `META_TOKEN` y escribe en Firestore `estadisticas/{en,es,historial_en,
  historial_es,estado,cache}`, que solo puede leer el propietario. `panelAccion`
  hace las acciones del panel (actualizar, responder, ocultar, cuaderno,
  referentes) y solo acepta al propietario.
- **Lo que no sale de Meta** (qué vídeo es cada publicación, conclusiones,
  preguntas abiertas): `node panel-config.cjs <…> <…>` lo sube a
  `estadisticas/config`. Ejecutarlo después de publicar o de cambiar
  `estadisticas-notas.json` o `REGISTRO.md`. `--cuaderno` sobrescribe el cuaderno
  del panel con `cuaderno.json` (solo para empezar: después se edita en el panel).
- **Desplegar** (solo cuando lo pida el propietario):
  `firebase deploy --only functions:panel --project personal-franquizb` desde
  `app-financiera/`, y `firebase deploy --only hosting --project franquizb-web`
  desde `estadisticas-web/`.
- En local, `estadisticas-instagram.cjs` y `referentes-instagram.cjs` siguen
  sirviendo para consultas rápidas desde la terminal.
- **Publicar** (solo si el propietario lo pide, vídeo a vídeo):
  `node publicar-instagram.cjs <…> <…> es|en reel <video.mp4> <texto.txt> [--portada portada.jpg]`
  hace un ensayo; con `--publicar` publica. Los archivos pasan un momento por el
  bucket privado `finanziapp-publicar` (us-central1, se vacía solo a 1 día).
  En Facebook: `node publicar-facebook.cjs es|en <video.mp4> <texto.txt> [--publicar] [--programar fecha ISO]`
  (página «FinanziApp» = en, «Finanziapp ES» = es). El ensayo lo sube como borrador y lo borra;
  `--programar` deja que Facebook lo publique a esa hora (los de EE. UU., por la tarde de allí).
  Los dos scripts anotan en `publicados.json` qué vídeo es cada publicación.
  **Programar en Instagram** (la API no programa): `node encolar-instagram.cjs <…> <…> es|en <video.mp4> <texto.txt> <fecha ISO> [--portada-ms N]`
  deja el vídeo en la cola (`estadisticas/cola`, bucket privado, URL firmada) y la función `panelPublicar`
  lo publica a esa hora (mira cada 15 min). Máximo 23 h antes, porque el bucket borra a las 24 h.
  `--ensayo` lo deja procesado sin publicar. En el panel se ve en «Qué toca ahora» y se puede cancelar.
- **Token de Meta**: lo inyecta el proxy del entorno en `graph.facebook.com`
  (formulario seguro, nunca en el código) y está también en Secret Manager como `META_TOKEN`.
  Es un token del usuario del sistema del negocio: no caduca. Tiene las dos cuentas de
  Instagram y las dos páginas de Facebook asignadas.
