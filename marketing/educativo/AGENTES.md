# Manual para agentes (producción y revisión de Reels)

Lo leen los agentes que lanza la sesión supervisora. El supervisor decide el tema, el guion final y **es el único que
publica o programa**. Tú produces, compruebas y entregas un informe.

## Reglas que no se saltan

- No publiques, programes, despliegues ni toques credenciales. No hagas commit ni push: deja los cambios en el árbol y dilo.
- Cada dato lleva su fuente en la cabecera del archivo y cada cuenta se comprueba con `cuadra()` (`reels/_comun.js`).
  Los ejemplos inventados se presentan como ejemplos («si cobras 1.600…»), nunca como estadística.
- Español de España (cuenta `es`) o inglés de EE. UU. (cuenta `en`): son dos cuentas distintas, no traducciones.
  En la cuenta `es` tiene que notarse que es España en el gancho o en el texto de la publicación («en España», euros,
  Hacienda, la nómina, el súper de aquí): sin esas señales Instagram enseña los vídeos sobre todo en México. El hashtag
  `#españa` y la variación de hashtags los pone solo `etiquetas.cjs` al programar.
- Prohibido «si te pica» en cualquier forma. Sin marcas comerciales. Sin promesas de rentabilidad.
- Un solo render a la vez (la máquina tiene 4 núcleos). No lances dos `reel-voz.js` en paralelo.
- Si algo no cuadra (un dato sin fuente, la voz que no pasa la revisión, un plano que no se entiende), dilo en el informe:
  no lo maquilles.

## Dónde está cada cosa (`marketing/educativo/`)

- `README.md`: el motor, la voz, los subtítulos, los efectos, la cola de publicación. Léelo antes de empezar.
- `reel-voz.js`: el motor. `reels-voz/tres.js`: el mundo 3D (API en su cabecera). `reels-voz/reto-es.js`: los días 1 y 2 de
  la serie en 3D; son el mejor ejemplo de coreografía. `reels-voz/plantillas.js`: escenas 2D.
- `reels-voz/REGISTRO.md`: qué se ha publicado y qué anuncia cada vídeo para el siguiente.
- `investigacion/`: dosieres con fuentes para los vídeos de contraste.

## Herramientas de esta sesión

```bash
SP=/tmp/claude-0/-home-user-finanziapp/ecbe874d-651f-5b1f-a876-9043b560763f/scratchpad
```

- `bash $SP/drive.sh $SP/con-credencial.cjs <script.sh>`: ejecuta un script de shell con la credencial de Google en las
  variables `FBT` y `SA` (hace falta para la voz y para revisarla). Ejemplo de script: `$SP/voz-reto.sh`.
- `WHISPER_PY=$SP/venv-whisper/bin/python`: Python con Whisper, para que los subtítulos vayan palabra a palabra.
- `$SP/venv-whisper/bin/python $SP/ritmo.py <reel.mp4>`: palabras por segundo de la voz (objetivo: 3,2–3,6).

## Cómo se hace un Reel `<slug>` de la cuenta `<es|en>`

1. **Escenas sin voz** (gratis y rápido): `node reel-voz.js <slug> <cuenta> --vista --sin-voz` deja un fotograma por frase en
   `out-reels/<slug>/<cuenta>/vista-NN.jpg`. Júntalos en una hoja con PIL y **mírala** (herramienta Read). Para ver una
   animación, `--escena=N` saca 8 fotogramas de esa escena. Repite hasta que cada plano se entienda sin leer.
2. **Voz, revisión y render** (en segundo plano y con margen: un vídeo 3D tarda 15–20 s por segundo de vídeo):
   ```bash
   cd /home/user/finanziapp/marketing/educativo && export WHISPER_PY=$SP/venv-whisper/bin/python
   node reel-voz.js <slug> <cuenta> --vista && node revisar-voz.cjs "$FBT" "$SA" <slug> <cuenta> 5 && node reel-voz.js <slug> <cuenta>
   ```
   `revisar-voz.cjs` hace que Gemini escuche cada toma: repite las que no dicen el texto o suenan con acento de América.
3. **Control de calidad del vídeo final**: 15 fotogramas con ffmpeg en una hoja y mírala entera; volumen
   (`ffmpeg -i reel.mp4 -af ebur128 -f null -`, objetivo −14 LUFS ± 1); duración; ritmo con `ritmo.py`.

## Lo que hay que saber de la voz

- El filtro de Google bloquea a veces frases inocentes: reescribe la frase con otras palabras y vuelve a lanzar.
- Evita frases de una o dos palabras sueltas: únelas a la anterior con `[short pause]`.
- Si `revisar-voz.cjs` repite una toma, borra también sus tiempos de palabras (lo hace solo desde el 11 nov 2026). Para
  comprobar que ningún Reel usa tiempos más viejos que su audio: `node tomas-viejas.cjs "$PWD"` (debe decir 0).
- En el guion: `*resaltado*` marca palabras en los subtítulos; `§` es un momento para la animación; `§{pop}`, `§{ding}`,
  `§{caja}` y `§{tic}` añaden además un efecto de sonido. La voz nunca lee nada de eso.

## Lo que hay que saber del 3D

- Cada escena tiene un solo plano y el corte es seco. La cámara tiene 46° de campo vertical y el cuadro es vertical:
  a una distancia `d` solo caben `d × 0,48` metros de ancho. Calcula el encuadre antes de renderizar.
- Lo importante va entre el 30 % y el 80 % de la altura: arriba están los subtítulos (262–470 px) y abajo y a la derecha,
  los botones de Instagram. Tarjetas y rótulos 2D: entre 480 y 1.500 px de alto.
- Un solo color de acento por idea: turquesa lo que controlas, rojo lo que se escapa, ámbar lo que has detectado.
- Para mover maniquíes a tu manera usa `W.multitud(t, { directo })`. Si necesitas un objeto nuevo, créalo dentro de
  `SCRIPT_3D`, exponlo en `W` y apágalo al principio de `W.fotograma` para que no se cuele en otras escenas.
- Nadie pasa pegado a la cámara ni tapa al protagonista (mira cómo lo resuelve el día 1 con `evita`).

## Formato de cada vídeo

- **Estructura en tres actos** (método que compartió el propietario el 12 nov 2026, de @resueltaestudio): inicio = contexto y
  problema en una sola frase; nudo = la información ordenada de menos a más sorprendente; desenlace = qué hacer + pregunta o
  anuncio del siguiente. Cada frase tiene una función (gancho, problema, mito, dato, giro, acción, cierre): la que no la tiene
  se quita.
- **Cada vídeo lleva al menos un mito desmentido o un dato que casi nadie sabe**, y el más fuerte va en el último tercio. Nuestros
  datos lo confirman: retienen 41–49 % los de «lo que crees es falso» o «un derecho que no sabías» (garantía de 3 años, la
  milésima de la gasolinera, 14 días para devolver, 79.900 millas) y 15–24 % los de manual (fondo de emergencia, 50/30/20,
  Roth, 5 $ al día). Un tema de manual solo entra reformulado como mito («todo el mundo dice X; para ti es Y»).
- En el vídeo de la vivienda (82 s, 24 %) el dato estrella llegó a los 25 s y después la curva bajó: en los largos, el primer
  pico antes de los 5 s y el mayor al final.
- No sirve puntuar el guion con un juez automático solo con el texto: lo probamos con 16 vídeos publicados y no predijo la
  retención (el día 1 de la serie, 86 %, sacó la nota más baja).

- **Arranque lleno**: el fotograma 0 ya tiene la escena completa y la primera frase.
- 25–35 s las píldoras; hasta 90 s un vídeo de contraste si cada 5–8 s pasa algo nuevo en pantalla.
- **Texto de la publicación**: gancho de una línea, 2–3 líneas que aporten algo que no está en el vídeo, qué hacer hoy y
  (en la serie) «Mañana, día N: …». Nunca es la transcripción. Los vídeos con datos llevan las fuentes al final.
- Serie «30 días para ordenar tu dinero»: «DÍA n/30», una sola acción por día y tarjeta final con «Mañana: …».

## El informe que entregas

Qué has hecho, archivos tocados, ruta del vídeo final y de la hoja de fotogramas, duración, volumen y ritmo, qué frases
de voz hubo que repetir, y todo lo que no hayas podido comprobar.
