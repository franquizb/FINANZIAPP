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

Estructura de cada guion: gancho → intro → cuerpo 1 (algo útil que no
sabían) → bucle («eso no es lo más loco…», deja una pregunta abierta) →
cuerpo 2 → bucle → final. Tono: amigo listo, seco y sarcástico.

- `reels-voz/<slug>.js`: guion por frases `[escena, texto]` en EN y ES.
  `*palabra*` sale resaltada en los subtítulos, `[sarcasm]`, `[short pause]`…
  dirigen la voz (no salen en pantalla) y `§` marca momentos para la animación.
- **Voz oficial** (aprobada por el propietario, no cambiar sin que lo pida):
  `reels-voz/_comun.js` → `VOZ` (Gemini 3.1 Flash TTS, voz Charon, tono seco y
  sarcástico, acento peninsular estándar en español, ritmo 1,1× con pausas de
  0,42 s como máximo). Cada Reel nuevo usa `voz: VOZ`, más las escenas comunes
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
- Revisar una animación: `node reel-voz.js <slug> es --escena=N` (8 fotogramas).
- Subir: carpeta «Reels hablados (publícalos cuando quieras)» en Drive;
  `publicar-drive.cjs reel … --reemplazar` actualiza los vídeos sin cambiar el enlace.
