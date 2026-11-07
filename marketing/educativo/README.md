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
