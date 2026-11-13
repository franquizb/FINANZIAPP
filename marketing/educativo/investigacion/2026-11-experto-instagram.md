# Informe final: por qué los Reels se quedan en ~120 y por qué el perfil no engancha (13-nov-2026)

Fusiona los tres borradores (crecimiento, riesgo, experimentos), el análisis de los 34 Reels y el informe paralelo
`2026-11-distribucion-instagram.md`. No he llamado a ninguna API de Meta ni he publicado nada. Grados de evidencia:
**Oficial** (Meta/Instagram/Mosseri en fuente primaria o cita literal), **Medio**, **Débil** (blogs, vendedores, casos sueltos),
**Propio** (nuestros datos; n pequeño, solo 3 despegues).

## (a) Diagnóstico de nuestras cuentas

- **El techo de ~120 es la prueba inicial que Instagram da a cada Reel, no un castigo (~70–75 %).** Es igual en las dos cuentas (mediana 119,5 ES y 113 EE. UU.) y más del 97 % del alcance son no seguidores: **hay recomendaciones**.
- **Lo que abre la puerta son los 3 primeros segundos (indicio fuerte).** Omisión ≤30,3 %: despegaron 3 de 5; por encima: 0 de 29 (Fisher p≈0,002). La retención no compensa un mal arranque (reto01: 85 % de retención, 34,7 % de omisión, 120 de alcance).
- **El gancho decide la omisión (confianza media).** «Afirmación concreta + giro» ~29 % de omisión y 3 despegues; preguntas 56,8 % y 0. La familia «número raro en un precio» dio 3 de las 4 mejores omisiones en los dos idiomas.
- **@finanziapp (EE. UU.) restringida: ~20 %.** Más probable: nunca coincidieron buen gancho, hora de Nueva York y 48 h de margen (millas salió a las 03:44 NY; gas910 se midió con ~11 h). Se resuelve mirando el Estado de la cuenta.
- **El perfil no convierte, y la causa está en nuestro código (confirmado).** `app-financiera/panel-funciones/meta.js` (líneas 257–258) envía `share_to_feed=true` y `thumb_offset`, pero **nunca `cover_url`**. El fotograma sale de `meta.json.portada_ms` (fin de la primera frase, con subtítulos) y la cuadrícula lo recorta a 3:4. Los Reels sí están en la cuadrícula, pero como fotogramas sueltos sin titular. 3 despegues → ~3.855 cuentas → ~2 seguidores (0,05 %). Que esto frene la conversión: ~60 %. Que frene el alcance: poco probable (la prueba inicial llega por la pestaña Reels, donde la portada no se ve).
- **Ya existe un generador de portadas diseñadas sin conectar.** `marketing/educativo/portada.js` + `portadas.json` (sin confirmar en git; parece de otra sesión en curso) crea `portada-diseno.jpg` 1080×1920 con el titular dentro de la franja 3:4 (y=240–1680). Ni `meta.js` ni `encolar-instagram.cjs` lo usan; solo `publicar-instagram.cjs --portada` (manual) envía `cover_url`.
- **Facebook a 0: problema de la página o de la medición (≥80 %), no del vídeo.** Los mismos archivos llegaron a ~1.500 en Instagram.

## (b) Cómo reparte Instagram un Reel hoy

1. **Fuentes de candidatos:** cuentas que sigues y Reels «similares a los que has visto o con los que has interactuado»; un modelo ligero elige ~100 (ficha Reels Chaining, **Oficial**, 11-nov-2025).
2. **Prueba escalonada:** primero a «una audiencia pequeña que creemos que lo disfrutará», sigan o no la cuenta; si rinde, a una mayor, y así (**Oficial**, 30-abr-2024). Nuestro ~120 encaja con ese primer escalón.
3. **Lo que el sistema predice:** ver menos de 3 s (incluido saltar en los 2 primeros segundos y si se ve con sonido), ver más del 95 % comparado con Reels de igual duración, compartir (también fuera de Instagram), seguir al autor (**Oficial**, 11-nov-2025). En Explorar predice además el toque en la cuadrícula, ver más de 11 s, usar el audio y «Me interesa» (**Oficial**, 22-jun-2026).
4. **Las tres señales que más pesan:** tiempo de visualización, me gusta y envíos; los envíos pesan algo más con no seguidores (Mosseri, **Oficial vía medio**, 22-ene-2025). El «un envío vale 3–5 me gusta» no tiene fuente.
5. **Omisión en 3 s:** métrica en Estadísticas desde ago-2025 y en la API (`reels_skip_rate`) desde 3-dic-2025. Instagram no publica qué valor es bueno; Socialinsider da una media del ~65 % en cuentas de 1–5K (otro denominador; **Débil**). Nuestro 24–30 % en los despegues es excelente.
6. **Elegibilidad:** original, sin marcas de agua, sin bordes, no «mayormente texto», ≤3 min; nada de «modelos de negocio engañosos» ni inversiones «sin riesgo» (**Oficial**, 2023–2024). Desde 30-abr-2026 la originalidad cubre también fotos y carruseles (**Oficial**). La animación propia con voz propia es original.
7. **Estado de la cuenta** (cuentas profesionales): dice si la cuenta o publicaciones concretas no se pueden recomendar y permite pedir revisión (**Oficial**). Si la cuenta entera no es apta, nada llega a no seguidores.
8. **País:** la ficha cita el tiempo que pasan con el Reel «los espectadores de tu país», como una señal entre muchas (**Oficial**). No hay ninguna forma oficial de orientar el alcance orgánico hacia un país; el idioma no aparece como señal.
9. **Hashtags:** máximo 5 desde 18-dic-2025; «no funcionan» para el alcance, solo clasifican (Mosseri, **Oficial vía medio**).
10. **Portada:** `cover_url` es «la portada de la pestaña Reels» y gana sobre `thumb_offset` (por defecto 0 = primer fotograma); con imagen no 9:16 toma el 9:16 central; al compartir en el feed usa el cuadrado 1:1 central (texto anterior a la cuadrícula 3:4). La API **no** permite cambiar la portada después de publicar ni ajustar el recorte de la cuadrícula (**Oficial**, v27). Nada oficial dice que la portada influya en el reparto.
11. **Cuadrícula 3:4 vertical desde ene-2025** (Mosseri vía prensa, **Medio**); en la app se puede ajustar la miniatura después de publicar (feb/mar-2026, **Medio**; ruta del menú solo en blogs).
12. **Reels de prueba:** solo a no seguidores y **no salen en el perfil** hasta graduarse; por API con `trial_params` desde 3-dic-2025 (**Oficial**). Umbral: 200 seguidores (profesional) o 1.000 según la fuente. Con 3 y 2 seguidores no nos aplica.
13. **API frente a app:** Meta no documenta ninguna diferencia de reparto. Mosseri habría dicho que programar no afecta (mar-2025, ago-2026), pero solo por blogs de vendedores (**Débil**). Nuestros 3 despegues salieron por la API: la API no impone un techo por sí sola.

## (c) Plan: las 10 acciones (orden = impacto × facilidad)

| # | Acción | Quién | Evidencia | Métrica de éxito |
|---|---|---|---|---|
| 1 | **Revisar el Estado de la cuenta** de @finanziapp y @finanziapp.es (Configuración > Estado de la cuenta > «Qué no se puede recomendar») y el estado de recomendación de las 2 páginas (Panel profesional > Herramientas / Calidad de la Página). Si hay aviso: captura, editar o borrar lo señalado, pedir revisión y no cambiar nada más esa semana. | **Propietario** (10 min, hoy) | Oficial | Las 4 aptas; captura hoy y a los 7 días |
| 2 | **Solo ganchos «afirmación concreta + giro»** con número en los segundos 0–2 y movimiento desde el primer fotograma; la serie «número raro en un precio» como uno de cada dos Reels. Cierre que dé motivo para enviar («para quien esté pagando X»), sin pedir «comparte/comenta» como cebo. | Claude (guiones) | Propio (p≈0,002) + ficha Reels + Mosseri | Omisión mediana ≤30 % y ≥1 de cada 3 Reels con ≥1.000 vistas a 72 h |
| 3 | **Conectar la portada diseñada al publicador**: subir `portada-diseno.jpg` al bucket con URL firmada en `encolar-instagram.cjs` y enviar `cover_url` en `publicarReelIg` de `meta.js`. Primero 1 Reel de prueba y mirar el perfil. Desplegar la función solo con OK expreso del propietario. | Claude (código); **propietario** autoriza el despliegue | Oficial (API v27); cuadrícula 3:4 (Medio) | La cuadrícula muestra el titular; seguidores por 1.000 cuentas alcanzadas de ~0,5 a ≥1,5 en 3 semanas |
| 4 | **Arreglar el escaparate actual a mano**: cambiar la portada o «Ajustar vista previa» de los Reels publicados (primero los 3 virales españoles), fijar 3 publicaciones por cuenta (qué es la cuenta, mejor Reel, la app), archivar los v1 (65–87 % de omisión), bio con palabras clave y para quién es. No borrar ni volver a subir. | **Propietario** en la app; Claude prepara imágenes y textos | API no lo permite (Oficial); Mosseri vía t3n (Medio) | Cuadrícula legible (captura antes/después); seguidores/semana frente a ~2 actuales |
| 5 | **EE. UU.: hora de Nueva York y otra voz.** Publicar solo 11–13 h o 19–21 h ET; 3 Reels de la familia gasolina con narrador grave en vez de Puck. | Claude | Propio (hipótesis) + Sprout/Buffer (Medio) | Omisión ≤30 % en los 3; ver criterio de restricción en (d) |
| 6 | **Registro automático a 24/48/72 h** por Reel: `reels_skip_rate`, `ig_reels_avg_watch_time`, `reach`, `views`, `shares`, `saved`, `likes`, más gancho, voz, hora; y alcance de cuenta por `follow_type`. Despegue = ≥1.000 vistas a 72 h. | Claude | Oficial (referencia de insights) | Tabla semanal sin huecos; sin ella no hay A/B |
| 7 | **Ritmo estable de 1–2 Reels/día por cuenta**, sin ráfagas, en hora local del público: España 08–10 h y 14–15 h; EE. UU. según acción 5. | Claude | Propio: el volumen no cambió el alcance por Reel (confianza media-baja) | Sin nuevas pruebas de «no soy un robot»; alcance base estable |
| 8 | **Declarar la IA** con `is_ai_generated=true` en Instagram y en `video_reels`, tras comprobar con `--ensayo` que la versión de la API de `meta.js` lo acepta (está documentado desde el 22-jun-2026; puede requerir subir de versión). La etiqueta de «perfil generado por IA» no aplica: no hay persona sintética. | Claude; **propietario** decide | Oficial: Meta pide etiquetar «un reel narrado con una voz en off realista generada por IA» y puede sancionar si no | Omisión y alcance 7 días antes/después sin caída >15 % |
| 9 | **Facebook: pausar la cola automática por API y diagnosticar** (ver sección f). | **Propietario** (app, Business Suite) + Claude | Sin documentación oficial | Saber en 7 días si el 0 es real y si es de la página |
| 10 | **Texto para búsqueda**: palabras que la gente busca en la primera línea, 3–5 hashtags específicos (sin genéricos sorteados), sin enlaces; palabra clave en el nombre del perfil. | Claude | Oficial (límite de 5; palabras clave en texto) | Higiene: no se espera subida medible |

**Decisiones donde los borradores chocaban:**
- Facebook: «parar la API» (crecimiento) frente a «comparar manual y API» (experimentos) → se pausa la cola y se hace 1 prueba manual frente a 1 por API; sin datos no tiene sentido seguir enviando a ciegas.
- Etiqueta IA: crecimiento la dejaba en «decides tú»; riesgo y experimentos la recomendaban → se recomienda declararla: el riesgo documentado está en no hacerlo y no hay nada oficial que diga que resta alcance.
- Volumen: el informe paralelo lee «solo despegaba el primero de 4 al día» como efecto del volumen; nuestro análisis lo atribuye a ganchos de pregunta (50–70 % de omisión) en esa etapa → 1–2/día por sostenibilidad y para poder hacer A/B limpios, no porque 4 penalice.
- Collabs (informe paralelo): buena palanca para los primeros seguidores, pero exige socios reales; va como experimento, no en el top 10 inmediato.
- Portada: crecimiento proponía generarla en `encolar`; hoy ya existe `portada.js` → reutilizarlo en vez de crear otro.

## (d) Experimentos de las próximas 2 semanas

1. **A/B de gancho (12 días).** 6 pares por cuenta, mismo tema: pregunta frente a afirmación + número + giro; misma hora local, días seguidos, alternando el orden. *Éxito:* giro con omisión mediana ≤30 % y al menos el doble de despegues. Secundaria: envíos/alcance.
2. **¿`cover_url` cambia la cuadrícula?** Publicar 1 Reel con `cover_url` (por `publicar-instagram.cjs --portada`, ya existe) y mirar perfil, pestaña Reels y feed. *Éxito:* el titular se ve entero en la cuadrícula 3:4. Si no, la portada habrá que fijarla a mano tras publicar. Comprobar también qué queda en el recorte 1:1 del feed (y=420–1500): conviene que el titular entre ahí; la firma de serie en y=300 se pierde.
3. **¿EE. UU. restringida?** Primero el Estado de la cuenta. Después 3 Reels de la familia gasolina, narrador grave, 11–13 h o 19–21 h NY, juzgados a 48 h. *Criterio:* si los 3 bajan del 30 % de omisión, ninguno despega y sus equivalentes españoles sí → tratar como restringida (por azar ~6 %).
4. **Voz en inglés.** Mismo guion con Puck y con narrador grave, días alternos, 4 pares. *Éxito:* −10 puntos de omisión o +3 s de visto medio con la voz ganadora.
5. **Facebook manual frente a API (7 días).** Ver sección f. *Éxito:* saber si el 0 es de la página, del método o de la medición.
6. **`location_id` (Madrid) en España, días alternos.** Hipótesis sin evidencia. *Éxito:* % de alcance desde España (Estadísticas en la app) sube ≥10 puntos frente a los días sin ubicación.
7. **Seguimiento pendiente:** volver a medir gas910 y reto04 a 48–72 h; desglose por país de los 3 despegues (España o México) en la app.
8. **Opcional, API frente a app/Edits.** El informe paralelo cita a Mosseri (SMT, 10-ago-2025) diciendo que Edits «ayuda un poco» al alcance; no lo he contrastado. Solo si sobra tiempo: 3 pares publicados por API y desde Edits, mismo tipo de gancho. *Éxito:* diferencia de alcance >30 % en los 3 pares.
9. **Collabs (arranque cuando haya un socio).** 1–2 Reels con `collaborators` y un creador pequeño real del mismo país. *Éxito:* ≥20 seguidores nuevos por collab.

## (e) Qué dejar de hacer

- Ganchos de pregunta, mito o dato de arranque (0 despegues de 17), salvo como control del A/B.
- Reels de más de 60 s (0 de 4) y volver a 4 al día (sin ganancia medida).
- Publicar para EE. UU. de madrugada en Nueva York.
- Borrar y volver a subir para cambiar la portada: Instagram enseña menos lo ya publicado (Oficial, 2023).
- Juzgar un Reel antes de 48–72 h.
- `trial_params` o `share_to_feed=false`: sacan el Reel de la cuadrícula (hoy se envía `true`; mantenerlo).
- «Comenta PALABRA» como cebo de alcance; material ajeno o con marcas de agua (incluida la de CapCut).
- Más de 5 hashtags y hashtags genéricos (`etiquetas.cjs` ya limita a 5).
- La cola automática a Facebook mientras siga en 0.

## (f) Facebook

- **Hechos:** las 2 páginas (0 seguidores) tienen todos los Reels a 0 reproducciones, publicados y procesados, sin problemas de derechos. Meta permite publicar el mismo contenido en tus propias Páginas (Oficial, 14-jul-2025): la duplicación con Instagram no lo explica. La API de Reels de páginas no menciona efectos en la recomendación (Oficial).
- **Posible fallo de medición:** varias métricas de Video Insights se retiraron con v26 (29-jul-2026); `blue_reels_play_count` y `fb_reels_total_plays` siguen documentadas. Una integración (Improvado, Débil) dice que sin `pages_manage_engagement` la API devuelve ceros en vez de error.
- **Pasos:** (1) **propietario**: mirar las cifras en Meta Business Suite / Panel profesional > Estadísticas > Reels y el estado de recomendación y Calidad de la Página; (2) **propietario**: subir 1 Reel a mano desde la app en cada página, confirmando el público; Claude publica otro por API el mismo día; (3) comparar a 72 h en la interfaz, no solo por API; (4) Claude comprueba qué permisos tiene el token del panel.
- **Lectura:** si el manual también da 0 → es la página (nueva, sin seguidores); prioridad mínima hasta tener seguidores. Si el manual tiene vistas y el de API no → método. Si la interfaz muestra vistas → era el panel.

## (g) Mitos que circulan y son falsos o no están probados

| Mito | Realidad |
|---|---|
| «Los hashtags dan alcance» | Falso: «no funcionan» (Mosseri, 2025); máximo 5 |
| «Publicar por API o programador penaliza» | Sin pruebas; nuestros 3 despegues salieron por API. Lo contrario (que no afecta) solo llega por blogs |
| «Un envío vale 3–5 me gusta» | Sin fuente primaria |
| «Tras el "no soy un robot" pierdes 40–90 % de alcance» | Solo blogs sin datos; Meta dice que la cuenta confirmada funciona con normalidad. En España, reto03 despegó al día siguiente |
| «La etiqueta de IA resta 15–80 %» | Ninguna fuente oficial; el riesgo documentado es no declararla |
| «Las cuentas nuevas tienen un periodo de arranque / cárcel de 200 vistas» | Nada oficial; nuestro ~120 encaja con la prueba inicial normal |
| «Compartir el Reel en Historias da alcance» | Mosseri lo rebajó en abr-2026 («no va a cambiar de forma significativa tu alcance») |
| «Más de 90 s no se recomienda» | Obsoleto: hasta 3 min desde ene-2025 |
| «Comentar una palabra está prohibido» | Matizado: Instagram (jun-2024) aclaró que ManyChat y responder de verdad no es cebo; lo que no recomienda es forzar interacciones para hackear el alcance |
| «La ubicación da alcance local» | No probado (solo blogs) |
| «La portada influye en el reparto» | No probado; sí importa en perfil, Explorar y páginas de hashtag |
| «Publicar más al día reparte menos por Reel» | Nuestros datos no lo muestran: la prueba inicial es por Reel |

## (h) Fuentes (fecha)

- Meta Transparencia: [Reels Chaining](https://transparency.meta.com/features/explaining-ranking/ig-reels-chaining/) (11-nov-2025); [Explorar](https://transparency.meta.com/features/explaining-ranking/ig-explore/) (22-jun-2026).
- Instagram Creators: [recomendaciones y originalidad](https://creators.instagram.com/recommendations-and-originality) (30-abr-2024); [elegibilidad y Estado de la cuenta](https://creators.instagram.com/blog/instagram-recommendations-eligibility-tips-creators) (30-ago-2022, act. 25-abr-2023); [originalidad 2026](https://creators.instagram.com/blog/rewarding-original-creators-on-instagram) (30-abr-2026); [trial reels](https://creators.instagram.com/blog/instagram-trial-reels) (10-dic-2024); [perfil generado por IA](https://creators.instagram.com/blog/ai-generated-profile-label) (31-ago-2026).
- About Instagram: [Ranking Explained](https://about.instagram.com/blog/announcements/instagram-ranking-explained) (31-may-2023); [autenticidad](https://about.instagram.com/blog/announcements/introducing-new-authenticity-measures-on-instagram/) (13-ago-2020).
- Meta for Developers (consultado 13-nov-2026, v27): [IG User Media](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-user/media); [Media Insights](https://developers.facebook.com/docs/instagram-platform/reference/instagram-media/insights); [changelog](https://developers.facebook.com/docs/instagram-platform/changelog) (trial reels y `reels_skip_rate` 3-dic-2025; `is_ai_generated` 22-jun-2026); [Reels de páginas](https://developers.facebook.com/docs/video-api/guides/reels-publishing); [v25](https://developers.facebook.com/docs/graph-api/changelog/version25.0) (18-feb-2026).
- Meta for Creators (Facebook): [contenido no original](https://creators.facebook.com/blog/combating-unoriginal-content) (14-jul-2025); [contenido original](https://creators.facebook.com/blog/supporting-original-content-on-facebook) (13-mar-2026).
- Social Media Today: [señales 2025](https://www.socialmediatoday.com/news/instagram-shares-algorithm-insights-2025/738034/) (22-ene-2025); [Reels de 3 min](https://www.socialmediatoday.com/news/instagram-officially-expands-reels-length-3-minutes/737766/) (18-ene-2025); [tasa de omisión](https://www.socialmediatoday.com/news/instagram-adds-retention-insights-reels/758464/) (24-ago-2025); [límite de hashtags](https://www.socialmediatoday.com/news/instagram-implements-new-limits-on-hashtag-use/808309/) (18-dic-2025); [miniaturas editables](https://www.socialmediatoday.com/news/instagram-introduces-thumbnail-post-editing-for-grids/813444/) (1-mar-2026); [Historias](https://socialmediatoday.com/news/instagram-chief-debunks-popular-engagement-hack/816781/) (6-abr-2026); [palabras clave/ManyChat](https://www.socialmediatoday.com/news/instagram-clarifies-advice-on-single-word-ctas-and-longer-reels/718151/) (5-jun-2024).
- Prensa: [PetaPixel, cuadrícula 3:4](https://petapixel.com/2025/01/23/instagram-swaps-square-profile-grids-for-rectangles/) (23-ene-2025); [TechCrunch, agregadores](https://techcrunch.com/2026/04/30/instagram-restricts-reach-of-content-aggregators-in-new-crackdown/) (30-abr-2026).
- Estudios: [Socialinsider](https://socialinsider.io/blog/instagram-reels-statistics/) (24-jun-2026, act. 6-nov-2026); [Buffer, frecuencia](https://buffer.com/resources/how-often-to-post-on-instagram/) (13-ago-2025); [Metricool 2026](https://metricool.com/press-release-instagram-study-2026/) (16-jun-2026); [Hootsuite, programar](https://blog.hootsuite.com/experiment-third-party-scheduling-instagram/) (30-abr-2025, Débil).
- Informe paralelo: `2026-11-distribucion-instagram.md` (13-nov-2026). Sus citas que no estaban en los hallazgos verificados (Creators 26-feb-2025; SMT 26-may-2026, 10-ago-2025 y 24-sep-2026; Centro de ayuda de trial reels con 200 seguidores) las trato como no contrastadas aquí.

## (i) Lo que no se ha podido comprobar

- Si `cover_url` cambia también la miniatura de la cuadrícula o solo la pestaña Reels, y qué recorte aplica hoy (la doc aún dice 1:1).
- La ruta exacta del menú para editar la portada y «Ajustar vista previa» en la versión actual de la app.
- Si las 2 pruebas de «no soy un robot» (11-nov) dejaron alguna restricción; si alguna cuenta aparece como no recomendable.
- Si el 0 de Facebook es real; qué permisos tiene el token del panel.
- Si `is_ai_generated` funciona con la versión de API que usa `meta.js`, y si Meta etiqueta sola nuestros Reels por la marca SynthID del audio de Gemini TTS.
- El umbral real de los Reels de prueba (200 o 1.000) y qué error da la API por debajo.
- De qué país vinieron las vistas de los 3 despegues.
- Que en la cuadrícula del perfil los Reels nunca se reproducen solos: es la práctica observada, no hay documento oficial.

## Qué falta

- **Ver la cuadrícula real de las dos cuentas** (captura del propietario): sin ella no sabemos qué fotograma ha quedado en cada Reel ni si algún Reel falta del perfil.
- **Estado de la cuenta de las 4 cuentas**: es la única comprobación directa de restricción y lo condiciona todo.
- **Quién es dueño de `portada.js`**: está sin confirmar en git; conectar el publicador sin coordinarse con esa sesión puede pisar trabajo.
- **Conversión del perfil**: la API no da visitas al perfil por Reel; habrá que anotarlas a mano desde Estadísticas o no podremos medir el efecto de las portadas.
- **Por qué España recibe alcance de México** y si `location_id`, hora o vocabulario lo cambian: sin evidencia, solo A/B propio.
- **Envíos**: casi todos los Reels tienen 0–2; no sabemos qué tipo de guion provoca envíos en finanzas sin cara. Falta un experimento específico cuando haya despegues suficientes.
- **Contenido de arranque del perfil**: qué 3 publicaciones fijar (¿un carrusel «qué es FinanziApp»?) no tiene datos; es criterio de diseño.
- **Collabs**: no hay lista de creadores pequeños candidatos en España ni en EE. UU.
- **Muestra**: todo lo propio se apoya en 3 despegues; tras 2 semanas de A/B hay que rehacer el análisis antes de fijar reglas.
