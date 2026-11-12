# ¿ElevenLabs para la voz de los Reels? (investigación, 12-11-2026)

Todas las páginas se consultaron el 12-11-2026 (enlaces al final). Lo no comprobado está marcado.

## Recomendación (5 líneas)
1. **Sí merece una prueba ciega, no un cambio a ciegas.** ElevenLabs resuelve de raíz dos de vuestros problemas: acento (se elige una voz nativa peninsular) y subtítulos (devuelve tiempos por carácter, sin Whisper).
2. Modelo: `eleven_v4` (lanzado 28-09-2026) para probar; `eleven_multilingual_v2` como plan B si v4 resulta inestable.
3. Coste casi igual: ~3,4 USD/mes en pago por uso (v4) frente a ~1,4 USD/mes con Gemini 3.1. La diferencia no decide.
4. «La voz de todos» no está probada: ElevenLabs nombra a Brian, Liam y Adam como populares, pero ninguna cuenta de referencia está verificada. No lo afirméis.
5. Antes de pagar: hace falta plan de pago (Starter o más) para uso comercial; la gratuita es solo no comercial. Preferir voces **por defecto** de ElevenLabs a voces de comunidad (pueden retirarse).

## 1. Modelos por API (página de modelos, 12-11-2026)
| Modelo | Idiomas | Límite/petición | Notas |
|---|---|---|---|
| `eleven_v4` | 90+ | 10.000 car. | El más expresivo; etiquetas `[…]` y fonemas IPA `/…/`; admite PVC |
| `eleven_v4_turbo` | 90+ | no consta | ~100 ms; pensado para agentes en tiempo real |
| `eleven_v3` | 70+ | 5.000 car. | Generación anterior expresiva |
| `eleven_multilingual_v2` | 29 (es-ES y es-MX) | 10.000 car. | «Más consistente» en textos largos; lee mejor cifras y moneda |
| `eleven_flash_v2_5` | 32 | 40.000 car. | Barato y rápido; menos natural |
| `eleven_flash_v2` | solo inglés | 30.000 | No sirve para español |
- Para **narración**: v4 (calidad y emoción) o multilingual_v2 (estabilidad). Flash/Turbo no, salvo para abaratar borradores.
- Ritmo: `voice_settings.speed` de 0,7 a 1,2 (docs, 12-11-2026); a vuestro 1,15× casi tocáis el techo. Estabilidad, similitud y estilo también son ajustables.
- Emoción: etiquetas tipo `[whispers]`, `[sighs]` en v4/v3; v4 las sigue mejor. Pausas: en v4/v3 **no** vale `<break>`; usar puntos suspensivos y puntuación.
- No he podido comprobar: modos de estabilidad (creative/natural/robust) de v4 ni si v4 sigue en beta.
- Cifras: normalización de números activada por defecto (`apply_text_normalization`: auto/on/off); importante con «2,50 USD», «15 %».

## 2. Voces (certeza baja/media)
- **Inglés EE. UU.** Su propia ayuda cita como «más populares»: Brian, Liam y Adam (mujeres: Jessica, Matilda, Sarah). Ids (fuente: listas de terceros, 12-11-2026, coinciden entre sí): Adam `pNInz6obpgDQGcFmaJgB` (grave, adulto), Brian `nPczCjzI2devNBz1zQrb` (grave, «narrador»), Liam `TX3LPaxmHKxFdv7VOQHJ` (joven). Daniel `onwK4e9ZLuTAKqWW03F9` es británico. ElevenLabs promociona «Arthur» (narrador americano enérgico); su id no lo he comprobado.
- **Más probable «voz típica de narrador viral» en inglés**: Brian o Adam. Es una hipótesis por popularidad declarada por el proveedor, no una prueba sobre @bigshortmedia ni las demás.
- **Español de España** (todo de comunidad; listado json2video, 12-11-2026): Aaron Abad `t9LRTh3y1ioN00e9wsNh` («nativo castellano, narrador cálido»), Gabo `o0SveC0zgHFuCsEO3vHR` («grave, evocador»), Bosco `0vrPGvXHhDD3rbGURCk8` («grave, matizado»). Otros: Martin Osborne 2 `Vpv1YgvVd6CHIzOTiTt8` (grave, relatos), Arconte `QtPMrakdgePQIUwOX7Ut`, Hernán Cortés `sDuUJMeNJR828mXTRrDh`.
- En español **no encontré ninguna fuente** que diga cuál es «la voz que usa todo el mundo». Para saberlo habría que ordenar la Biblioteca por uso (requiere cuenta; yo no la creo).

## 3. Acento peninsular estable
- La documentación no promete acento regional: recomienda «elegir una voz con el acento que coincida con tu idioma y región». Esa es la palanca: **una voz nativa peninsular**, no un parámetro.
- `language_code` (ISO 639-1, p. ej. `es`) fuerza idioma, no variante; no existe en multilingual_v2. (La falta de variante es mi lectura de los docs, no una frase expresa.)
- ElevenLabs dice que v4 mantiene mejor el acento de la voz entre idiomas (blog v4, actualizado 19-10-2026). Garantía total: **no comprobable sin probar**; mantened el juez automático al principio.
- Consistencia: `seed` (no determinista del todo), `previous_text`/`next_text` para encadenar frases, y repetir idéntico hasta 2 veces sin coste extra si hay distorsión (docs).

## 4. Tiempos (sustituyen a Whisper)
`POST https://api.elevenlabs.io/v1/text-to-speech/{voice_id}/with-timestamps` (consultado 12-11-2026). Respuesta JSON:
```
{ "audio_base64": "...",
  "alignment":            { "characters": ["H","o",…], "character_start_times_seconds": [0.0,…], "character_end_times_seconds": [0.07,…] },
  "normalized_alignment": { …misma estructura sobre el texto normalizado… } }
```
Tres listas alineadas por índice, en segundos, **por carácter**. Hay que agrupar caracteres en palabras (cortar en espacios). Ojo: con `normalized_alignment` («2,50» → «dos con cincuenta») el texto no coincide con el del guion; usar `alignment` y comprobar.

## 5. Precio (EN USD; páginas de precios, 12-11-2026)
- Por uso en API: Flash/Turbo y v4 Turbo 0,04 USD/1.000 car.; multilingual_v2, v3 y v4 0,08 USD/1.000 car.
- Planes: Starter 6 USD (1 USD el primer mes), Creator 22 (11 el primero), Pro 99, Scale 299, Business 990. Créditos: Starter 30.000, Creator 121.000, Pro 600.000 (página de precios general) frente a 75.000 / 275.000 / 1.238.000 caracteres (página API). **Las dos páginas no coinciden y no he podido aclararlo.** v2 multilingüe: 1 crédito/car.; Flash 0,5–1; v3/v4 no consta.
- Gemini TTS (Google, 12-11-2026): 3.1 Flash TTS Preview 1,00 USD/M tokens de texto + 20,00 USD/M de audio; audio a 25 tokens/s (≈0,03 USD/min). 3.8 Flash TTS: 0,50 + 9,00 hasta el 31-12-2026, luego 1,00 + 18,00. 2.5 Flash: 0,50 + 10,00.

**Tabla de costes** (60 × 450 + 4 × 1.400 = 32.600 car.; +30 % = **42.380 car./mes**; ≈47 min de audio a 15 car./s, el cálculo de voz.cjs; a 20 car./s serían ≈35 min):
| Opción | Cálculo | USD/mes |
|---|---|---|
| ElevenLabs v4 / multilingual_v2 / v3, por uso | 42,38 × 0,08 | **≈3,4** |
| ElevenLabs v4 Turbo / Flash, por uso | 42,38 × 0,04 | ≈1,7 |
| ElevenLabs suscripción mínima con uso comercial | Starter 6 (si 75.000 car.) o Creator 22 (si Starter solo da 30.000) | 6–22 |
| Gemini 3.1 Flash TTS (actual) | 70.600 tokens audio × 20/M + texto ~0,02 | **≈1,4** |
| Gemini 3.8 Flash TTS | 70.600 × 9/M (hasta 31-12) / × 18/M (2027) | ≈0,65 / ≈1,3 |
No incluyo el coste del juez que escucha las tomas (Gemini) ni Whisper (local).

## 6. Licencia
- Condiciones de uso (12-11-2026): usuarios gratuitos solo uso **no comercial**; de pago pueden usarlo comercialmente (sec. 1c) y conservan los derechos de la salida (4c); **no aparece obligación de atribución**. La página de precios marca «Commercial license: Sí» desde Starter. Es lectura de resúmenes: confirmad en el texto oficial.
- Voces de la Biblioteca: el propietario puede retirarla. Con «periodo de aviso» sigue usable para quien ya la guardó (mínimo 30 días según una consulta y 3 meses según otra; máximo 2 años); **sin aviso se pierde al instante**. Se detecta con `disable_at_unix` en Get Voice y hay webhook de retirada.
- Riesgo a mitad de serie: real para voces de comunidad. Mitigación: guardar el id y la comprobación de `disable_at_unix` antes de cada lote, conservar el audio en `cache-voz/`, y valorar una voz **por defecto** (Brian/Adam, en inglés) o un clon propio (IVC/PVC, aparte).
- No he podido leer el «Voice Library Addendum»; no sé si añade restricciones comerciales.

## 7. Filtros y límites
- Hay política de uso prohibido (actualizada 09-10-2026) con reglas electorales (campañas, suplantación) y escaneo automático. Una fuente de terceros dice que la API rechaza textos infractores con error; **no confirmado en la documentación**.
- Nada específico sobre dinero o impuestos; sí la prohibición de política electoral: textos neutrales de educación fiscal no deberían chocar, pero no lo he probado. No hay un filtro tipo «usage guidelines» documentado como el de Gemini.
- Concurrencia por plan (precios): Free 2, Starter 3, Creator 5, Pro 10. Para vuestro volumen sobra. Página de límites de la API: 403, no consultada.

## 8. Alternativas (una línea cada una)
- **Azure Neural/HD (es-ES)**: ~15 USD/M car. estándar y ~22 USD/M HD (terceros; la página oficial no cargó). Voces peninsulares nativas estables, barato; menos «viral». Opción seria si ElevenLabs falla en acento.
- **Cartesia Sonic 3/3.6**: 1 crédito/car.; Pro 5 USD/100.000 créditos (cartesia.ai vía terceros). Solo la probaría por precio; no he comprobado su español de España.
- **OpenAI TTS, Hume, Fish Audio, CapCut/TikTok**: no he conseguido datos fiables de precio ni de acento peninsular; no recomiendo ninguna sin verificar. La voz de CapCut/TikTok tampoco comprobada.
- Ninguna es claramente mejor ni más barata para español de España con lo que he podido verificar.

## 9. Integración
- Red: permitir `api.elevenlabs.io` (los docs listan también servidores de residencia EE. UU./UE/India/Singapur; no necesarios). Cabecera: `xi-api-key: <clave>` (formato de autenticación de ElevenLabs que conozco; la página consultada no lo muestra: confirmar). Clave por formulario seguro, nunca en el chat.
- Boceto (en la rama `cliente`, sin tocar `voz.cjs`; devuelve WAV, el resto del motor no cambia). `salida` pcm_24000: la disponibilidad de formatos por plan no está comprobada.
```js
async function sintetizarEleven(texto, voz) {   // voz: { id, modelo, estilo?, idioma?, ritmo?, estab? }
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voz.id}/with-timestamps?output_format=pcm_24000`;
  const cuerpo = {
    text: texto,                                   // limpiar(f, true): admite [etiquetas] en v4/v3
    model_id: voz.modelo || 'eleven_v4',
    ...(voz.idioma ? { language_code: voz.idioma } : {}),   // 'es' | 'en' (no en multilingual_v2)
    voice_settings: { stability: voz.estab ?? 0.5, speed: voz.ritmo || 1 },
    seed: 7, apply_text_normalization: 'auto',
    ...(voz.antes ? { previous_text: voz.antes } : {}), ...(voz.despues ? { next_text: voz.despues } : {})
  };
  const r = await fetch(url, { method: 'POST', headers: { 'xi-api-key': process.env.ELEVEN_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(cuerpo) });
  if (!r.ok) throw new Error(`eleven «${texto}»: ${r.status} ${await r.text()}`);
  const j = await r.json(), a = j.alignment;
  // palabras: agrupar caracteres hasta cada espacio
  const palabras = []; let w = '', t0 = null;
  a.characters.forEach((c, i) => { if (/\s/.test(c)) { if (w) palabras.push({ w, ini: t0, fin: a.character_end_times_seconds[i - 1] }); w = ''; t0 = null; }
    else { if (t0 === null) t0 = a.character_start_times_seconds[i]; w += c; } });
  if (w) palabras.push({ w, ini: t0, fin: a.character_end_times_seconds.at(-1) });
  return { pcm: Buffer.from(j.audio_base64, 'base64'), sr: 24000, palabras };  // aWav(pcm, sr) -> .wav en cache-voz
}
```
- En `sintetizar` habría que añadir `voz.motor === 'eleven'`, incluir id/modelo/ritmo en la clave de caché y guardar `palabras` en un `.json` junto al `.wav`. El juez de dicción y de acento sigue valiendo.

## Fuentes (consultadas 12-11-2026)
- Modelos: https://elevenlabs.io/docs/overview/models
- Precios API: https://elevenlabs.io/pricing/api · planes: https://elevenlabs.io/pricing
- Endpoint con tiempos: https://elevenlabs.io/docs/api-reference/text-to-speech/convert-with-timestamps
- Eleven v4 (28-09-2026, act. 19-10-2026): https://elevenlabs.io/blog/eleven-v4
- Buenas prácticas: https://elevenlabs.io/docs/overview/capabilities/text-to-speech/best-practices · capacidades: https://elevenlabs.io/docs/overview/capabilities/text-to-speech
- Condiciones: https://elevenlabs.io/terms-of-use · uso prohibido: https://elevenlabs.io/use-policy
- Periodo de aviso: https://elevenlabs.io/docs/help-center/product/voices/voice-library/what-is-a-notice-period
- Voces populares: https://elevenlabs.io/docs/help-center/product/voices/voice-library/what-voices-are-popular-on-tik-tok-you-tube-and-social-media.md
- Voces es-ES: https://json2video.com/ai-voices/languages/spanish/spain/ · ids por defecto: https://elevenlabs.io/docs/voices/default-voices
- Gemini TTS precios: https://aistudio.google.com/docs/pricing y https://cloud.google.com/text-to-speech/pricing
- Azure y Cartesia (terceros): https://www.beri.net/article/elevenlabs-vs-cartesia-vs-azure-tts-latency-pricing-voice-cloning-2026 · https://cartesia.ai/pricing

## Lo que no he podido comprobar
- Qué voz usan @resultaaquee, @bigshortmedia, @deepzerr y @montealto.agency (no hay prueba; la hipótesis ElevenLabs es del propietario).
- Créditos reales de Starter/Creator (dos páginas contradictorias) y créditos por carácter de v3/v4.
- Estabilidad de v4 en español peninsular, alucinaciones de palabras y bloqueos reales de frases: solo se sabe probando con clave.
- Límites de peticiones de la API (página 403), cabecera `xi-api-key` en la documentación, formatos PCM por plan, id de «Arthur».
- Notice period: 30 días o 3 meses según la consulta; texto del Voice Library Addendum; precio oficial de Azure; OpenAI, Hume, Fish Audio, CapCut.
