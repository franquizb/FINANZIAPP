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
- Revisar una animación: `node reel-voz.js <slug> es --escena=N` (8 fotogramas).
- Subir: carpeta «Reels hablados (publícalos cuando quieras)» en Drive;
  `publicar-drive.cjs reel … --reemplazar` actualiza los vídeos sin cambiar el enlace.

# Estadísticas, cuaderno y publicación por API

- **Web privada**: https://estadisticas.franquizb.com (sitio de Hosting
  `finanziapp-estadisticas`, carpeta `estadisticas-web/`). Solo la ve el
  propietario: inicia sesión y lee `estadisticas/instagram`, que las reglas de
  Firestore solo dejan leer al propietario. Muestra el **cuaderno**
  (`cuaderno.json`: próximas subidas y temas pendientes por cuenta, más las
  preguntas abiertas de `reels-voz/REGISTRO.md`), las conclusiones
  (`estadisticas-notas.json`), la retención de cada Reel, todas las
  publicaciones y los referentes.
- **Actualizar** (cuando lo pida el propietario; sin procesos en la nube):
  `node estadisticas-instagram.cjs --json propias.json`,
  `node referentes-instagram.cjs --json referentes.json` y
  `node estadisticas-subir.cjs <…> <…> propias.json referentes.json`.
  Para cambiar la página: `firebase deploy --only hosting` desde `estadisticas-web/`.
- **Publicar** (solo si el propietario lo pide, vídeo a vídeo):
  `node publicar-instagram.cjs <…> <…> es|en reel <video.mp4> <texto.txt> [--portada portada.jpg]`
  hace un ensayo; con `--publicar` publica. Los archivos pasan un momento por el
  bucket privado `finanziapp-publicar` (us-central1, se vacía solo a 1 día).
  En Facebook: `node publicar-facebook.cjs es|en <video.mp4> <texto.txt> [--publicar] [--programar fecha ISO]`
  (página «FinanziApp» = en, «Finanziapp ES» = es). El ensayo lo sube como borrador y lo borra;
  `--programar` deja que Facebook lo publique a esa hora (los de EE. UU., por la tarde de allí).
  Los dos scripts anotan en `publicados.json` qué vídeo es cada publicación.
- **Token de Meta**: lo inyecta el proxy del entorno en `graph.facebook.com`
  (formulario seguro, nunca en el código) y está también en Secret Manager como `META_TOKEN`.
  Es un token del usuario del sistema del negocio: no caduca. Tiene las dos cuentas de
  Instagram y las dos páginas de Facebook asignadas.
