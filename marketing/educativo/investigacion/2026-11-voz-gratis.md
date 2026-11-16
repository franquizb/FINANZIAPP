# ¿Voz gratis para los Reels? Voice Studio, clonación y alternativas a Gemini (investigación, 16-11-2026)

Todo se comprobó el 16-11-2026 salvo que se diga otra cosa. Las fuentes están al final.
Lo que no está comprobado va marcado como **(supuesto)** o **(dudoso)**.
Nada de lo generado en las pruebas se ha publicado. No se ha clonado la voz de ninguna persona real.

---

## 1. Respuesta corta para el propietario

**Sí se puede prescindir de Gemini para la voz, pero el ahorro es pequeño y en español se pierde algo.**

- **Lo que cuesta hoy la voz (síntesis + revisión): unos 7–24 USD al mes** con 120 Reels al mes (2 al día por cuenta). Es una estimación con precios oficiales, no la factura real.
- **Quitar Gemini TTS (la síntesis) ahorra como mucho 5,5–8,2 USD al mes**, unos 66–98 USD al año. En euros, una cifra parecida o algo menor (no he comprobado el cambio del día).
- Desde el 7-11 hemos gastado en voz **unos 2,6–7,5 USD en total**. Los 139,9 minutos de la carpeta de caché no son todos pagados: solo 57,25 minutos son tomas de Google. El resto lo genera nuestro ordenador.
- **El ahorro más fácil no es cambiar de voz, sino abaratar la revisión.** `revisar-voz.cjs` deja que el modelo juez «piense» en su nivel más alto, que es el que trae por defecto, y ese pensamiento se cobra. Bajándolo al mínimo, la revisión pasaría de 1,8–15,3 USD/mes a unos 0,7–2 USD/mes **(supuesto: hay que medirlo y comprobar que juzga igual de bien)**. En el escenario más caro, esto ahorra más que quitar la voz de Gemini.
- **Inglés (@finanziapp):** Chatterbox Turbo y Pocket TTS, gratis y en nuestra máquina, se quedan algo por debajo de Gemini. Se podrían usar.
- **Español (@finanziapp.es):** ningún motor gratis lo sustituye sin perder algo. El mejor (Chatterbox es-ES) solo trae una voz oficial, de mujer. Para tener un narrador masculino haría falta clonar una voz con permiso, por ejemplo la del propio propietario.
- **Voice Studio, tal como lo enseña @carlosai_, no nos sirve:** su modelo de voz por defecto prohíbe el uso comercial.

**Mi consejo:** primero limitar el «pensamiento» del juez y medir lo que gasta (cuesta una línea de código y no cambia la voz). Después, una prueba piloto en inglés con un motor local. En español, seguir con Gemini salvo que el propietario quiera grabar su voz para clonarla.

---

## 2. Qué es Voice Studio y si nos sirve

### Qué programa es (comprobado)

- Es **VoiceStudio** (antes «OmniVoice-Studio»), de Palash Debnath (@debpalash). Lo mantiene Yupcha Softwares Private Limited.
  - Repositorio: https://github.com/debpalash/VoiceStudio
  - Web: https://voicestudio.sh
- Es el que enlaza @carlosai_: su post del 15-11-2026 (https://www.instagram.com/reel/Dfwv6mroLdk/) dice «ElevenLabs → VoiceStudio: clona tu voz en local. github.com/debpalash/VoiceStudio». Su guía (https://carlossanchezlopez.es/recursos/tu-voz) cita la versión 0.5.7 y el motor OmniVoice. Hay otros programas con nombres parecidos (Voicebox, Voice-Clone-Studio); conviene bajarlo solo de las Releases de GitHub.
- Está activo: última versión estable v0.5.8 (12-11-2026), betas hasta v0.5.9-beta.4 (16-11-2026).
- **@carlosai_ no lo usa.** Sus posts del 10 y 13-11 dicen que sigue pagando la voz «Marcos» de ElevenLabs. Su guía admite: «Todavía no lo he probado en español con mi voz».
- Lo que dice el Reel sobre «10 segundos» de grabación y «sin registrarse» no lo he comprobado instalando el programa.

### Qué modelo usa por dentro

- Por defecto, **OmniVoice** (k2-fsa). Pesos en https://huggingface.co/k2-fsa/OmniVoice (unos 3,3 GB). Basado en Qwen3-0.6B y en el tokenizador de audio de Boson Higgs Audio 2.
- Desde su «Model Manager» se pueden instalar otros motores (Chatterbox, CosyVoice3, Qwen3-TTS, VoxCPM2, IndexTTS-2.5, Kokoro…).

### Licencias

| Pieza | Licencia | ¿Uso comercial? | Fuente |
|---|---|---|---|
| Programa VoiceStudio | AGPL-3.0-only | Sí. El uso interno no obliga a nada. Distribuir el programa (modificado o no) obliga a dar el código; ofrecer por red una versión modificada, también | LICENSE y LICENSE-NOTICE.md del repositorio |
| Pesos de OmniVoice (el modelo por defecto) | **CC BY-NC** («due to constraints from its training data (e.g., Emilia)») | **No.** Unos Reels que promocionan una app de pago tienen fin comercial | Ficha de HF de OmniVoice; definición de «NonCommercial» en https://creativecommons.org/licenses/by-nc/4.0/legalcode.en |
| Tokenizador de audio de OmniVoice | Boson Higgs Audio 2 Community License (basada en Llama 3) | Con condiciones: cumplir la política de uso de Llama 3, no usar las salidas para mejorar otros LLM y pedir licencia por encima de 100.000 usuarios activos al año. El texto «Built with Higgs Materials…» solo se exige al distribuir o poner a disposición los materiales o un producto que los use (es discutible si publicar Reels cuenta) | https://huggingface.co/k2-fsa/OmniVoice/blob/main/audio_tokenizer/LICENSE |
| VoiceStudio Pro (99 USD/año o 199 USD de por vida, precios de lanzamiento) | Licencia comercial del código | No cubre los modelos | https://voicestudio.sh/pro |

El propio VoiceStudio marca OmniVoice como `commercial_use: false` en `backend/config/model_licenses.json`, y su LICENSE-NOTICE.md dice «No commercial clearance is asserted».

### Requisitos y riesgos (según su documentación, sin instalarlo)

- Funciona en Windows, macOS (chip Apple), Linux y Docker. Unos 10 GB de disco. Sin GPU va, pero «just slower»: su documentación habla de 10 a 50 veces más lento que con GPU.
- En un servidor Linux sin pantalla hay que usar su imagen Docker o su CLI contra un backend.
- Instaladores sin firmar (Windows y Mac). En el primer arranque descarga Python, PyTorch, FFmpeg y modelos sin firma del proyecto.
- Telemetría desactivada por defecto; se puede bloquear con `OMNIVOICE_ANALYTICS_DISABLED=1`. La versión Pro sí envía datos de licencia y uso.

### Veredicto

**Tal como lo presenta @carlosai_, no nos sirve:** el modelo por defecto es no comercial.
Solo serviría cambiando a un motor con pesos comerciales (por ejemplo Chatterbox, MIT) y con una voz propia, con permiso o de serie.
Para eso es más sencillo llamar al motor directamente desde nuestro código que instalar VoiceStudio (Electron, servidor y decenas de motores que no necesitamos).

---

## 3. Cuánto cuesta hoy la voz

### Precios oficiales (16-11-2026)

| Concepto | Precio | Nivel gratuito | Fuente |
|---|---|---|---|
| **Gemini 3.1 Flash TTS (Preview)** en Cloud TTS (el que usamos) | 1,00 USD por millón de tokens de texto + 20,00 USD por millón de tokens de audio. 25 tokens por segundo de audio → **0,030 USD por minuto** | **No hay** («Not available»). Estar en preview no lo hace gratis | https://cloud.google.com/text-to-speech/pricing |
| **gemini-3-flash-preview** en Vertex AI (el juez de `revisar-voz.cjs`) | Texto de entrada 0,50; **audio de entrada 1,00**; **salida 3,00 USD por millón de tokens, incluido el «pensamiento»**. El audio cuenta 32 tokens por segundo | No hay en Vertex | https://cloud.google.com/vertex-ai/generative-ai/pricing; https://ai.google.dev/gemini-api/docs/pricing; https://ai.google.dev/gemini-api/docs/audio |
| Pensamiento por defecto de ese juez | Activado, nivel «high» (hay minimal, low, medium y high). `revisar-voz.cjs` no fija `thinkingConfig`, así que usa «high» | | https://ai.google.dev/gemini-api/docs/thinking |

La salida de 3,00 USD sale de la página de la API de Gemini; en la tabla estándar de Vertex no aparece esa fila, pero cuadra con sus precios Priority (5,40) y Flex/Batch (1,50).

### Qué se paga de verdad (recuento de `cache-voz/`, 16-11-2026)

| Tipo de archivo | Cuántos | Minutos | ¿Se paga? |
|---|---|---|---|
| Tomas originales de Google (`<hash>.wav`) | 523 | **57,25** | Sí |
| Versiones con tempo y pausas (`-pXX-tYYY.wav`, `-tYYY.wav`), hechas con ffmpeg | 572 | 51,8 | No |
| Silencios de relleno (`prov-*.wav`) | 336 | 30,9 | No |
| **Total** | **1.431** | **139,9** | |

Los 139,9 minutos del encargo multiplican por 2,4 lo que se paga. Aparte hay 7 `sfx-*.wav` del 15-11 que no son voz.

Hay gastos que no quedan en la caché: tomas que salen demasiado largas y se repiten, silencios de los bordes que se recortan después (Google cobra la toma entera) y tomas que el juez rechaza y se borran. Los rechazos del filtro de contenido supongo que no se cobran **(supuesto: la página de Cloud TTS no lo dice; Vertex sí dice que solo cobra respuestas correctas)**.

### Fórmulas y resultado (USD)

| Concepto | Fórmula | Bajo | Alto |
|---|---|---|---|
| Voz gastada hasta hoy | (57,25 min + bordes recortados) × 1,10–1,40 por tomas borradas + 0–5,8 min de muestras sueltas → minutos × 60 × 25 × 20/10⁶, más ~0,06–0,09 de texto | 1,98 | 2,85 |
| Revisión gastada hasta hoy | 400–900 llamadas × 0,0015–0,0051 | 0,6 | 4,6 |
| **Total gastado desde el 7-11** | | **≈2,6** | **≈7,5** |
| Una llamada de revisión | audio ~6,3 s × 32 × 1/10⁶ + ~230 tokens de texto × 0,5/10⁶ + (80 de respuesta + 300–1.500 de pensamiento) × 3/10⁶ | 0,0015 | 0,0051 |
| Voz de un Reel de ~60 s | ~974 caracteres ÷ 13,3 car/s = 73 s de audio → 73 × 25 × 20/10⁶ + 0,0012 de texto = 0,038 por pasada limpia, × 1,2–1,8 por repeticiones | 0,046 | 0,068 |
| Revisión de un Reel | 10–25 llamadas × 0,0015–0,0051 | 0,015 | 0,13 |
| **Voz al mes** (120 Reels, 175–263 min de audio) | 120 × coste por Reel | **5,5** | **8,2** |
| **Revisión al mes** | 120 × coste por Reel | **1,8** | **15,3** |
| **Total al mes** | | **≈7** | **≈24** |

**Lo que más mueve el resultado son los tokens de «pensamiento» del juez.** He supuesto 300–1.500 por llamada; no está medido, porque `revisar-voz.cjs` no guarda `usageMetadata.thoughtsTokenCount`. La factura real se ve en la consola de Google Cloud: Facturación → Informes, filtrando por «Cloud Text-to-Speech» y «Vertex AI».

### Otras opciones de pago, mismo volumen (140.000–210.000 caracteres o 175–263 min al mes)

| Opción | Precio oficial | USD al mes | Notas |
|---|---|---|---|
| Gemini 3.1 Flash TTS (lo actual) | 0,03 USD/min | 5,5–8,2 | Sin nivel gratuito en Cloud TTS |
| Gemini 3.8 Flash TTS | 0,50 + 9,00 USD/M hasta el 31-12-2026; 1,00 + 18,00 desde el 1-1-2027 | 2,4–3,6 (−55 %); desde 2027, 4,7–7,1 (−10 %) | Otro modelo: la voz aprobada podría sonar distinta (no comprobado). En la API de Gemini (AI Studio) tiene nivel gratuito, pero Google usa esos datos para mejorar sus productos |
| Gemini 3.8 Flash-Lite TTS | 6 USD/M de audio (12 desde 2027) | 1,6–2,4 (3,2–4,7 desde 2027) | No escuchado |
| Google Chirp 3 HD | 30 USD por millón de caracteres, **primer millón al mes gratis** | **0** | No es Gemini. Existe la voz «Charon» (p. ej. `en-US-Chirp3-HD-Charon`) y admite es-ES. Que no admita «estilo» en texto lo dice el informe de coste; **no lo he comprobado ni escuchado** |
| Azure Neural | 15 USD/M (HD 22). Nivel F0: 0,5 M caracteres Neural gratis al mes | **0 con F0** (con límites de concurrencia); 2,1–3,2 en S0; HD 3,1–4,6 (no sé si HD entra en F0) | Cuenta y voces nuevas |
| ElevenLabs por API | 0,08 USD por 1.000 caracteres (Flash/Turbo: 0,04) | 11,2–16,8 (Flash 5,6–8,4) | Más caro |
| ElevenLabs suscripción | Creator 22 USD + minutos extra; Pro 99 USD | ≈25–38; Pro 99 | Más caro |
| OpenAI gpt-4o-mini-tts | 0,60 + 12 USD/M | ≈2,6–3,9 **(supuesto)** | Su página lo marca como «Deprecated» |
| Motor local (sección 4) | 0 USD por uso | 0 | Coste: tiempo de CPU y calidad (sección 5) |

---

## 4. Alternativas gratuitas y licencias

Licencias leídas en los archivos LICENSE y en las fichas de Hugging Face el 16-11-2026.

### Candidatos que permiten uso comercial

| Motor | Código | Pesos | Clona voz | Español de España | Inglés EE. UU. | En nuestra CPU (4 núcleos) |
|---|---|---|---|---|---|---|
| **Chatterbox** (Resemble AI): Multilingual V3 + ajuste «Spain Spanish» (`ResembleAI/Chatterbox-Multilingual-es-es`); Turbo para inglés | MIT | MIT. Todas las salidas llevan la marca de agua inaudible PerTh | Sí (5–10 s de referencia) | Único modelo abierto con ajuste declarado para es-ES. Una sola voz oficial de ejemplo, de mujer | Bueno | Lento: 5,2 s de cálculo por segundo de audio en es-ES; 2,0 en Turbo (medido) |
| **Pocket TTS** (Kyutai, 100M) | MIT | CC-BY-4.0 (citar autoría). Clonar exige aceptar condiciones en HF que prohíben clonar sin consentimiento. Voces de ejemplo: las de donación (voice-zero) son CC0; **las de Expresso y EARS son no comerciales** (evitar «cosette», «jean») | Sí (repositorio con acceso restringido; no probado) | Sí, acento no documentado | Bueno | Muy rápido: 0,5 (medido) |
| **Supertonic 3** (Supertone, ~99M, ONNX) | MIT | BigScience OpenRAIL-M: comercial con restricciones. Obliga a declarar que el contenido lo genera una máquina y prohíbe suplantar a nadie | No (10 voces fijas) | Sí, acento no documentado | Aceptable | Rapidísimo: 0,26 (medido). No necesita PyTorch |
| **Qwen3-TTS** (0.6B Base para clonar; 1.7B VoiceDesign para diseñar voces por texto) | Apache-2.0 | Apache-2.0 | Sí | Admite español, sin voz nativa de serie. Se puede «diseñar» una voz por texto («hombre de Madrid») sin persona real | Bueno | Lento: 4,8 (medido) |

### Reservas

| Motor | Licencia | Por qué solo reserva |
|---|---|---|
| Kokoro-82M | Apache-2.0 | Muy rápido y bueno en inglés; en español solo 3 voces y soporte «absent or thin» |
| Kitten TTS 2 Mini | Apache-2.0, 82M, ONNX | Voces en español (Lucia, Carmen, Javier, Diego) publicadas el 13-11-2026; acento sin comprobar |
| Piper `es_ES-davefx-medium` | Código GPL-3.0 (sin problema si solo se ejecuta); datos CC0 | Peninsular pero de calidad claramente inferior. Ojo: varias voces en_US de Piper vienen de datos no comerciales |
| NeuTTS Nano Spanish | NeuTTS Open License (gratis por debajo de 5 M USD de ingresos) | Acceso restringido; ficha sin leer |
| CosyVoice3, VoxCPM2, IndexTTS-2.5 | Apache-2.0 (CosyVoice3); Apache-2.0 según el registro de VoiceStudio, **sin confirmar** (VoxCPM2); licencia propia de bilibili sin revisar (IndexTTS-2.5) | No probados. **(Dudoso)** si IndexTTS habla español: un informe dice que sí (2.5) y otro que IndexTTS-2 solo hace chino e inglés |

### Descartados

| Motor | Motivo |
|---|---|
| OmniVoice (el de Voice Studio), Coqui XTTS-v2, F5-TTS / F5-Spanish, Fish Speech 1.5, Spark-TTS, Voxtral TTS, Gradium Phonon | Pesos no comerciales (CC-BY-NC, CC-BY-NC-SA o licencia propia no comercial) |
| Higgs Audio, Orpheus 3B, Dia, Sesame CSM, Zonos, Kyutai TTS 1.6B | Pensados para GPU, solo inglés (o inglés y francés), o con licencias de Llama/Boson |
| Microsoft VibeVoice | Su ficha desaconseja el uso comercial |
| OpenVoice v2 + MeloTTS | Estancado (pide torch < 2.0) |
| edge-tts | Usa sin licencia un servicio de Microsoft; su contrato de servicios lo impide. Uso comercial dudoso |
| Clonar «Marcos» u otra voz de persona real | Ilegal sin consentimiento y prohibido por ElevenLabs (sección 6) |
| Clonar nuestras tomas de Gemini (Charon) | Lo prohíben los términos de Google Cloud, §17(b) (sección 6) |

---

## 5. Prueba en nuestra máquina

Máquina: 4 CPU, 15 GB de RAM, sin GPU. 8 frases por idioma, las mismas para todos los motores, cada una con su toma de Gemini en caché.

**Importante:** las «notas a ciegas» no son de personas. Las puso el modelo juez (gemini-3-flash-preview) con nombres de archivo aleatorios y sin saber qué motor era. Una persona todavía no lo ha escuchado.

### Resultados

Notas de 1 a 10: naturalidad / acento / siglas y cifras / artefactos / narrador de Reel · **media**.
«Cálculo» = segundos de cálculo por segundo de audio (menos de 1 = más rápido que el tiempo real).

| Motor | Idioma | Cálculo | Error de Whisper (sin la frase «TIN contra TAE.») | Notas del juez | Disco · RAM | Problemas |
|---|---|---|---|---|---|---|
| Gemini TTS (toma de producción en caché) | ES | API | 8,9 % (0,6 %) | 6,9 / 9,5 / 8,6 / 8,9 / 5,9 · **7,97** | – | El juez la ve «plana» (es la voz seca, a propósito). Según la transcripción automática, también lee «TAE» como «te a e» |
| Pocket TTS (voz bill_boerst, CC0) | ES | 0,50 | **31,4 %** (21,6 %) | 5,1 / 8,6 / 6,4 / 6,4 / 3,9 · **6,07** | 1,1 + 0,21 GB · 1 GB | **No sabe leer cifras** («20 céntimos» → «vacías íntimos»). Con las cifras escritas en letra: error 2,5 % y media 7,94 en las 4 frases con cifras, pero habla lento |
| Chatterbox V3 es-ES (referencia oficial es_es_f1, **mujer**) | ES | 5,2 | 18,2 % (6,5 %) | 7,1 / 9,4 / 8,9 / 8,9 / 6,2 · **8,10** | 1,6 + 3,0 GB · 6,8 GB | Lento. Whisper oye «DIN» y «tazano al», aunque otra transcripción las oye bien. Mejor en frases largas con cifras, peor en frases cortas de siglas. En «TIN contra TAE.» parece comerse las dos siglas **(dudoso: sale de transcripción automática)** |
| Qwen3-TTS 0.6B (clon de una voz diseñada con el 1.7B) | ES | 4,8 | 13,1 % (0,7 %) | 6,6 / 8,8 / 8,3 / 8,7 / 5,4 · **7,58** | 1,6 + 2,4 GB (+4,3 GB del 1.7B) · 6,1 GB (11,5 al diseñar) | Lento. 2 de 21 juicios de acento dicen «latinoamérica». «1,21» → «uno veintiuno» |
| Supertonic 3 (voz M4) | ES | 0,26 | 14,0 % (1,7 %) | 6,7 / 9,5 / 9,0 / 8,7 / 5,6 · **7,89** | 0,16 + 0,39 GB · 0,55 GB | Lee «TIN» y «TAE» letra a letra. No es un fallo exclusivo suyo: la toma de Gemini también dice «te a e» según la transcripción automática, y en España las dos lecturas son corrientes. Voz fija, sin clonación ni estilo |
| Gemini TTS (toma de producción en caché) | EN | API | 0,0 % | 8,4 / 9,9 / 9,9 / 9,6 / 8,0 · **9,13** | – | – |
| Pocket TTS (voz peter_yearsley, CC0) | EN | 0,48 | 0,3 % | 7,7 / 9,8 / 9,9 / 9,2 / 6,9 · **8,68** | igual | Cadencia algo previsible y «cantarina» |
| Chatterbox Turbo (voz integrada) | EN | 2,0 | 1,2 % | 8,0 / 9,8 / 9,6 / 9,2 / 7,5 · **8,82** | 1,6 + 3,8 GB · 6,4 GB | Plano en frases cortas de gancho. En frases largas con dólares iguala a Gemini |
| Qwen3-TTS 0.6B | EN | 4,9 | 0,5 % | 7,6 / 9,7 / 9,4 / 9,3 / 6,9 · **8,59** | igual | Lento. Se come la «s» de «dollars» |
| Supertonic 3 (voz M4) | EN | 0,26 | 18,5 % (2,1 % sin «HSA versus FSA.») | 7,0 / 9,6 / 9,5 / 8,5 / 5,9 · **8,08** | igual | **Lee mal «FSA»**. Pequeño fallo metálico en «salary» |

Las tomas de Gemini ya llevan el tempo (1,15–1,3) y la compresión de pausas de `voz.cjs`; las de los demás van a velocidad natural. Ese mismo tratamiento se les podría aplicar.

Tamaños y RAM se midieron durante la prueba; los modelos grandes ya se han borrado y el verificador no pudo repetir esa medida.

### Qué dicen de verdad estas notas

- **Las diferencias pequeñas son ruido.** El mismo archivo, juzgado dos veces, cambia de media 1,1 puntos (hasta 4,8). Con un análisis por frases:
  - **Español:** Chatterbox es-ES, Gemini y Supertonic **empatan**. Chatterbox − Gemini = +0,13 (margen del 95 %: de −0,6 a +0,85).
  - **Inglés:** Chatterbox Turbo y Pocket **no se distinguen** entre sí y quedan algo por debajo de Gemini (unos 0,3–0,45 puntos, al límite de lo significativo).
  - Lo único que el juez separa con claridad es Pocket en español con cifras en número (6,07).
- Las medias van de 6,1 (Pocket ES) a 9,1 (Gemini EN). Sin los fallos de lectura evidentes, quedan entre 7,6 y 9,1.
- El juez sí detecta un acento claramente latino (con una muestra mexicana de referencia dio acento 1 las dos veces). Un seseo sutil no está garantizado. Además de Qwen, Supertonic ES (1 de 20) y Chatterbox ES (1 de 18) también recibieron un «latinoamérica».
- El juez recibe el guion y tiende a copiarlo, así que infla la nota de siglas y cifras. Los errores de lectura se detectaron con Whisper y con otra transcripción sin guion.
- **Sesgos sin medir:** las tomas de Gemini ya habían pasado el filtro de `revisar-voz.cjs` con el mismo juez; el juez es de la misma familia que la voz de Gemini; las voces de Pocket y Supertonic se eligieron con ese juez sobre dos frases que luego están en la prueba; algunas muestras tuvieron 3 pases y otras 2; la voz de Chatterbox es-ES es de mujer y Charon es de hombre, así que la nota de «narrador» no es comparable.

### Tiempo de cálculo al mes

Con 175–263 minutos de audio al mes (unos 6–9 minutos al día entre las dos cuentas, mitad por idioma), recalculado con los tiempos medidos:

| Motor | Para qué | Cálculo al día |
|---|---|---|
| Supertonic | ES + EN | unos 2 min |
| Pocket TTS | ES + EN | unos 3–5 min |
| Chatterbox Turbo | solo EN | unos 6–9 min |
| Chatterbox es-ES | solo ES | unos 15–23 min |
| Qwen3-TTS | ES + EN | unos 29–43 min |

Más 20–30 s de carga del modelo en Chatterbox y Qwen. Todos caben en esta máquina si se ejecutan de uno en uno.

### Pistas de escucha

- Español: `/tmp/claude-0/-home-user-finanziapp/ecbe874d-651f-5b1f-a876-9043b560763f/scratchpad/voz-gratis/prueba/escucha-es.mp3` (4:56)
- Inglés: `/tmp/claude-0/-home-user-finanziapp/ecbe874d-651f-5b1f-a876-9043b560763f/scratchpad/voz-gratis/prueba/escucha-en.mp3` (4:43)
- Orden y minuto de cada muestra: `/tmp/claude-0/-home-user-finanziapp/ecbe874d-651f-5b1f-a876-9043b560763f/scratchpad/voz-gratis/prueba/orden.txt`
- Datos por muestra: `detalle.json`, `manifiesto.json` y `ciego/notas.json` en esa misma carpeta.

Cada muestra va normalizada a −18 LUFS, con 0,8 s de silencio entre muestras. **Las pistas no están barajadas:** en cada frase el orden es siempre Gemini, Pocket, Chatterbox, Qwen, Supertonic. Para una escucha humana de verdad a ciegas habría que barajarlas. Conviene escuchar en especial 0:00–0:11 de `escucha-es.mp3` («TIN contra TAE.») para confirmar cómo lee cada motor las siglas.

Esa carpeta es temporal y puede borrarse en una limpieza. Si se quieren conservar las pistas, hay que copiarlas a otro sitio.

### Lo que no se pudo probar

- La clonación de Pocket y su versión de 24 capas (acceso restringido, sin token de Hugging Face).
- Chatterbox base en inglés (se probó Turbo).
- Chirp 3 HD y Azure (son de pago o de otro proveedor; no entraban en la prueba).

---

## 6. Legal

### Usar la voz propia o la de otra persona (España)

- Ley Orgánica 1/1982, art. 7.6: es intromisión ilegítima «la utilización del nombre, de la voz o de la imagen de una persona para fines publicitarios, comerciales o de naturaleza análoga» (https://www.boe.es/buscar/act.php?id=BOE-A-1982-11196).
- La ley pide **consentimiento expreso** del titular (art. 2.2), no necesariamente por escrito. Ese consentimiento **se puede revocar** en cualquier momento, indemnizando daños y «expectativas justificadas» (art. 2.3).
- **Recomendación:** ponerlo por escrito como prueba, con alcance, duración y usos comerciales. Vale también para la voz del propietario si la voz pasa a ser de la empresa.
- Si hay intromisión, el perjuicio se presume y la indemnización incluye el daño moral (art. 9.3).
- **Reforma en tramitación:** el Proyecto de LO 121/000103 (BOCG Congreso, Serie A, núm. 104-1, 27-07-2026) añade expresamente la voz «creada, simulada o manipulada tecnológicamente» y su uso publicitario aunque sea simulada. No he comprobado si ya está aprobado.

**Conclusión:** la voz del propietario (con su consentimiento) o voces sintéticas de serie que no imiten a nadie no plantean problema. Clonar a un tercero sin consentimiento expreso, sí.

### Estados Unidos (comprobado en parte)

- No hay derecho federal a la propia imagen; lo regulan los estados.
- Tennessee, ELVIS Act (en vigor desde el 1-7-2024): protege la voz, también la simulada. California (Civ. Code §3344) también protege la voz.
- No he comprobado si el NO FAKES Act federal está aprobado.
- Misma regla: voz propia o de serie, sí; imitar a una persona, no.

### Términos de los servicios

- **ElevenLabs** (Use Policy del 09-10-2026, https://elevenlabs.io/use-policy): el §3 prohíbe clonar la voz de una persona viva sin «explicit and informed consent»; el §12 prohíbe usar sus salidas para entrenar o mejorar otros modelos. Clonar a «Marcos» a partir de vídeos incumple las dos.
- **Google Cloud** (Service Specific Terms, https://cloud.google.com/terms/service-terms, última modificación 11-11-2026): el §17(b) prohíbe usar la salida de sus modelos para «substitute, replace, or circumvent the use of a Google Model» o crear modelos parecidos. **Nuestras tomas de Charon no deben usarse como referencia para clonar.** El §20(a) dice que la salida es nuestra («Customer Data»).
- **Licencias de los modelos:** Supertonic (OpenRAIL-M) obliga por contrato a declarar que el contenido lo genera una máquina; Pocket prohíbe clonar sin consentimiento.

### Etiquetado de IA

- **Instagram/Meta:** la etiqueta «Información de IA» es obligatoria para audio realista generado por IA; el propio Centro de Ayuda pone como ejemplo «a reel narrated with a realistic AI-generated voiceover». **Esto ya se aplica a los Reels actuales con la voz de Gemini**, no solo a una voz nueva. (Comprobado en parte: la página de ayuda no se dejó descargar; me baso en el anuncio oficial y en el resumen del buscador.)
- **Reglamento de IA de la UE** (Reglamento (UE) 2024/1689, https://www.boe.es/buscar/doc.php?id=DOUE-L-2024-81079), aplicable desde el 2-8-2026:
  - Art. 50.2: los **proveedores** de sistemas que generan audio sintético deben marcarlo de forma legible por máquina. Si montamos nuestro propio sistema con un modelo abierto, **podríamos** contar como proveedor (interpretación discutible). Chatterbox ya mete una marca de agua (PerTh).
  - El Reglamento (UE) 2026/1744 («Ómnibus digital», https://www.boe.es/buscar/doc.php?id=DOUE-L-2026-81147, en vigor desde el 27-07-2026) da hasta el **2-12-2026** para cumplir el 50.2, pero **solo a sistemas comercializados antes del 2-8-2026**. Un sistema que montáramos ahora no tendría ese plazo.
  - Art. 50.4: quien publique una «ultrasuplantación» (audio que se parece a una persona real y puede parecer auténtico) debe decir que es artificial. Esto no se aplaza. Una voz de narrador que no se parece a nadie probablemente no lo es; **una voz clonada del propietario sí puede serlo**.
  - Multas: hasta 15 M EUR o el 3 % de la facturación mundial; para pymes y empresas emergentes, la cifra menor de las dos (art. 99.4 y 99.6).

**En la práctica:** etiquetar siempre como IA en Instagram (ya hoy) y, si se monta un motor propio, preferir uno con marca de agua.

---

## 7. Recomendación y siguientes pasos

### Lo que haría, por orden

1. **Abaratar la revisión sin tocar la voz (lo que más puede ahorrar).**
   - En `revisar-voz.cjs`, añadir `thinkingConfig: { thinkingLevel: 'minimal' }` (o `'low'`) y guardar `usageMetadata` (incluido `thoughtsTokenCount`) en el registro.
   - Volver a juzgar un lote ya revisado y comprobar que rechaza lo mismo (sobre todo el acento latino).
   - Comprobar con Whisper (gratis, ya instalado) que la toma dice el texto, y dejar el juez solo para el acento.
2. **Mirar la factura real** en Google Cloud (Facturación → Informes, «Cloud Text-to-Speech» y «Vertex AI»). Solo lo puede hacer el propietario.
3. **Inglés (@finanziapp): piloto con un motor local**, sin publicar.
   - Chatterbox Turbo (MIT, con marca de agua) o Pocket TTS con una voz CC0 (más rápido).
   - Hacer 2 Reels de prueba completos y que una persona los compare a ciegas con Gemini.
4. **Español (@finanziapp.es): seguir con Gemini por ahora.** Ningún motor gratis lo iguala sin perder algo, y el ahorro es de pocos dólares.
5. **Opción barata sin salir de Google:** probar a ciegas Chirp 3 HD (voz Charon), que con nuestro volumen sale gratis. No lo he escuchado ni he comprobado cuánto se puede dirigir.

### Qué tendría que hacer el propietario

- **Decidir si quiere clonar su propia voz.** Solo tiene sentido para @finanziapp.es: el clon sale con el acento de quien graba, así que para la cuenta de EE. UU. no sonaría a inglés americano (supuesto razonable, por cómo funcionan estos modelos).
- **Si decide clonar:**
  - Grabar 1–2 minutos de voz limpia (aunque el modelo pida 5–10 s, conviene tener margen para elegir el mejor trozo): sitio silencioso, sin eco, buen micrófono, WAV sin comprimir, en tono de narrador de Reel y leyendo frases con cifras, euros y siglas.
  - Dejar por escrito que autoriza el uso de su voz para los Reels de FinanziApp (alcance, duración, usos comerciales).
  - Asumir que el resultado puede considerarse «ultrasuplantación» y etiquetarlo siempre como IA.
- **No clonar** la voz de «Marcos» ni de ninguna otra persona, ni usar nuestras tomas de Gemini como referencia.
- **No instalar Voice Studio** con su modelo por defecto para uso comercial.

### Qué cambiaría en `voz.cjs` (si se adopta un motor local; sin tocar todavía)

- Añadir un campo `motor` en la voz: `'gemini'` (lo actual, por defecto) o `'local'`.
- Con `'local'`, en vez de llamar a `texttospeech.googleapis.com`, llamar a un pequeño servidor en la propia máquina (por ejemplo `pocket-tts serve`, un script Python para Chatterbox o el SDK de Node de Supertonic) que devuelva un WAV.
- Incluir en la clave de caché el motor, la voz o el archivo de referencia y sus parámetros, para no mezclar tomas.
- Mantener lo que ya funciona: una frase por llamada, `recortar()`, el tempo y la compresión de pausas, y la alineación con Whisper.
- Quitar para el motor local los reintentos por el filtro de contenido de Gemini.
- Sustituir el «estilo» en texto por los controles del motor (en Chatterbox, `exaggeration` y `cfg`), porque ninguno gratis se dirige con texto salvo Qwen VoiceDesign, que es muy lento.
- Preparar el texto antes de sintetizar: cifras escritas en letra (imprescindible con Pocket) y una lista de siglas con su lectura (TIN, TAE, HSA, FSA). Está sin probar.

---

## Fuentes

Todas consultadas el 16-11-2026.

**Voice Studio y OmniVoice**
- https://github.com/debpalash/VoiceStudio (LICENSE, LICENSE-NOTICE.md, README.md, backend/config/model_licenses.json, docs/electron-privacy.md, docs/install/, docs/code-signing-policy.md, docs/languages.md, docs/performance.md, backend/core/analytics.py)
- https://voicestudio.sh y https://voicestudio.sh/pro
- https://huggingface.co/k2-fsa/OmniVoice (sección License) y https://huggingface.co/k2-fsa/OmniVoice/blob/main/audio_tokenizer/LICENSE
- https://github.com/k2-fsa/OmniVoice
- https://creativecommons.org/licenses/by-nc/4.0/legalcode.en
- Post de @carlosai_: https://www.instagram.com/reel/Dfwv6mroLdk/ (vía Business Discovery, solo lectura) y su guía https://carlossanchezlopez.es/recursos/tu-voz

**Precios**
- https://cloud.google.com/text-to-speech/pricing
- https://cloud.google.com/text-to-speech/docs/chirp3-hd
- https://cloud.google.com/vertex-ai/generative-ai/pricing
- https://ai.google.dev/gemini-api/docs/pricing
- https://ai.google.dev/gemini-api/docs/audio
- https://ai.google.dev/gemini-api/docs/thinking
- https://azure.microsoft.com/en-us/pricing/details/cognitive-services/speech-services/ y https://prices.azure.com/api/retail/prices (eastus)
- https://elevenlabs.io/pricing y https://elevenlabs.io/pricing/api

**Modelos (archivos LICENSE y fichas de Hugging Face)**
- https://github.com/resemble-ai/chatterbox, https://huggingface.co/ResembleAI/chatterbox, https://huggingface.co/ResembleAI/Chatterbox-Multilingual-es-es
- https://github.com/kyutai-labs/pocket-tts, https://huggingface.co/kyutai/pocket-tts-without-voice-cloning, https://huggingface.co/kyutai/tts-voices
- https://huggingface.co/Supertone/supertonic-3, https://github.com/supertone-inc/supertonic
- https://github.com/QwenLM/Qwen3-TTS, https://huggingface.co/Qwen/Qwen3-TTS-12Hz-0.6B-Base, https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign
- Descartados: fichas de Hugging Face de cada modelo; https://coqui.ai/cpml

**Legal y términos**
- Ley Orgánica 1/1982: https://www.boe.es/buscar/act.php?id=BOE-A-1982-11196 (texto consolidado, última actualización 23-06-2010)
- Proyecto de LO 121/000103: https://www.congreso.es/public_oficiales/L15/CONG/BOCG/A/BOCG-15-A-104-1.PDF
- Reglamento (UE) 2024/1689: https://www.boe.es/buscar/doc.php?id=DOUE-L-2024-81079
- Reglamento (UE) 2026/1744: https://www.boe.es/buscar/doc.php?id=DOUE-L-2026-81147
- ELVIS Act (Tennessee): https://legiscan.com/TN/text/HB2091/id/2968555/Tennessee-2023-HB2091-Chaptered.pdf (copia; el texto oficial está en capitol.tn.gov y no lo he descargado)
- ElevenLabs Use Policy: https://elevenlabs.io/use-policy
- Google Cloud Service Specific Terms: https://cloud.google.com/terms/service-terms
- Google, política de uso prohibido de IA generativa: https://policies.google.com/terms/generative-ai/use-policy
- Microsoft Services Agreement: https://www.microsoft.com/en-us/servicesagreement
- Meta, etiqueta de IA: https://www.meta.com/help/artificial-intelligence/1783222608822690/ y https://about.fb.com/news/2024/02/labeling-ai-generated-images-on-facebook-instagram/

**Datos propios**
- Recuento de `/home/user/finanziapp/marketing/educativo/cache-voz/` (16-11-2026).
- Prueba y escucha: `/tmp/claude-0/-home-user-finanziapp/ecbe874d-651f-5b1f-a876-9043b560763f/scratchpad/voz-gratis/prueba/` (carpeta temporal).
