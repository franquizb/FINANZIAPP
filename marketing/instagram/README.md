# Anuncios de Instagram

Imágenes y vídeos para anuncios de FinanziApp en Instagram (feed, Stories y
Reels), en inglés (USD, para EE. UU.) y en español (EUR). Todo sale de la
interfaz **real** de la app con datos de ejemplo ficticios: dos perfiles,
«Alex Morgan» (inglés, dólares) y «Lucía Romero» (español, euros).

El perfil de Instagram (foto, destacadas, 9 posts, 26 historias, bio y
calendario) está en **PERFIL.md**; aquí, los anuncios de pago.

## Qué hay en `out/`

| Carpeta | Formato | Uso en Meta Ads |
|---|---|---|
| `out/<idioma>/feed-4x5/` | 1080 × 1350 (4:5) | Feed de Instagram y Facebook (el formato que más espacio ocupa en el feed) |
| `out/<idioma>/stories-9x16/` | 1080 × 1920 (9:16) | Stories y Reels. Texto y botón fuera del 14 % superior y del 17 % inferior, que tapa la interfaz de Instagram |
| `out/<idioma>/carrusel-1x1/` | 1080 × 1080 (1:1) | Anuncio por secuencia (carrusel) de 5 tarjetas, en orden |
| `out/<idioma>/video-9x16.mp4` | 1080 × 1920, 16 s, 30 fps, H.264 | Reels y Stories |
| `out/<idioma>/video-4x5.mp4` | 1080 × 1350, 16 s, 30 fps, H.264 | Vídeo en el feed |

Los vídeos no llevan audio: en el Administrador de anuncios se puede añadir
música de la biblioteca de Meta.

Conceptos (mismo número en 4:5 y 9:16, para usar «personalización de recursos
por ubicación»: la versión 4:5 en el feed y la 9:16 en Stories/Reels):

1. `hero` — Todo tu dinero en un solo panel (portátil + móvil).
2. `salud` — Chequeo financiero: tasa de ahorro, fondo de emergencia, deuda.
3. `patrimonio` — Patrimonio neto y préstamos.
4. `gastos` — A dónde se va el dinero.
5. `hipoteca` — Pagar la hipoteca antes (ejemplo real de la calculadora:
   180.000 al 3,2 % a 25 años, +200 al mes → 6 años y 5 meses antes).
6. `fire` — Independencia financiera.
7. `calculadoras` — Las 6 calculadoras.
8. `presupuesto` — Presupuesto y seguimiento mensual.

## Textos para el Administrador de anuncios

Botón: **Registrarte** (*Sign Up*) o **Más información** (*Learn More*).
URL: `https://finanziapp.com`.

**Titular** — EN: `Try FinanziApp free for 15 days` · ES: `Prueba FinanziApp gratis 15 días`
**Descripción** — EN: `No credit card required` · ES: `Sin tarjeta de crédito`

**Texto principal** (lo primero que se lee; ~125 caracteres antes de «más»):

| Concepto | Inglés | Español |
|---|---|---|
| hero | Budget, spending, net worth and loans, finally in one place. Try FinanziApp free for 15 days, no card needed. | Presupuesto, gastos, patrimonio y préstamos, por fin en un solo sitio. Prueba FinanziApp gratis 15 días, sin tarjeta. |
| salud | Is your money actually healthy? FinanziApp scores your savings rate, emergency fund and debt load every month. | ¿Tus finanzas están sanas? FinanziApp calcula cada mes tu tasa de ahorro, tu fondo de emergencia y tu carga de deuda. |
| patrimonio | Track every account, investment and loan, and watch your net worth climb month after month. | Controla cuentas, inversiones y préstamos, y mira cómo crece tu patrimonio mes a mes. |
| gastos | Stop wondering where your paycheck went. See every expense by category and spot the leaks in seconds. | Deja de preguntarte a dónde se fue la nómina. Ve cada gasto por categoría y detecta las fugas en segundos. |
| hipoteca | How much would an extra $200 a month save on your mortgage? Find out in seconds with FinanziApp. | ¿Cuánto te ahorrarías pagando 200 € más al mes de hipoteca? Descúbrelo en segundos con FinanziApp. |
| fire | When could you stop working? Calculate your FIRE number and track your progress toward it. | ¿Cuándo podrías dejar de trabajar? Calcula tu número FIRE y sigue tu progreso hacia él. |
| calculadoras | Compound interest, mortgage, FIRE, NPV/IRR, DCA and intrinsic value: 6 pro calculators, zero spreadsheets. | Interés compuesto, hipoteca, FIRE, VPN/TIR, precio medio y valor intrínseco: 6 calculadoras pro, cero hojas de cálculo. |
| presupuesto | A budget you'll actually stick to: plan the year, log in seconds and compare budget vs. actual every month. | Un presupuesto que sí vas a cumplir: planifica el año, apunta en segundos y compara previsto y real cada mes. |

## Antes de lanzar la campaña

- **Promesas que la app debe seguir cumpliendo**: «15 días gratis» y «sin
  tarjeta de crédito» (hoy es así: el registro no pide tarjeta). Si cambia,
  hay que regenerar los anuncios.
- **Cobro**: la prueba dura 15 días. Stripe tiene que estar activo (ver
  `app-financiera/STRIPE.md`, interruptor `STRIPE_ACTIVO`) antes de que
  terminen las pruebas de los primeros usuarios que lleguen por los anuncios.
- **Moneda**: la app detecta la moneda por la región del navegador (USD en
  EE. UU.), así que quien llega desde el anuncio en inglés ve dólares, igual
  que en las capturas. El precio no aparece en los anuncios.
- Los datos de las capturas son ficticios. La interfaz es la real.

## Regenerar (cuando cambie la app o los textos)

Requisitos: Node 18+, `npm i -g playwright && npx playwright install chromium`
(o el Playwright que ya tengas), `ffmpeg` con libx264 y la fuente **Inter**
instalada (también *Inter Display*).

1. Build de la app en **modo demo** (la ruta `/demo` solo existe con esta
   variable; el build de producción no la incluye):

   ```bash
   cd app-financiera
   REACT_APP_DEMO=1 BUILD_PATH=build-demo npx react-scripts build
   npx serve -s build-demo -l 4300
   ```

2. En otra terminal, desde `marketing/instagram/`:

   ```bash
   node capturar.js http://localhost:4300   # capturas/<idioma>/*.png (~3 min)
   node anuncios.js                         # out/<idioma>/{feed-4x5,stories-9x16,carrusel-1x1}
   node video.js                            # out/<idioma>/video-*.mp4 (~5 min)
   node perfil.js --web && node organico.js && node vista.js   # perfil orgánico (PERFIL.md)
   ```

   `node anuncios.js en` o `node video.js es 9x16` generan solo una parte.

Los textos de los anuncios están al principio de `anuncios.js` (objeto `TXT`)
y de `video.js`; las composiciones, en `ESCENAS`. Los datos de ejemplo de la
app están en `app-financiera/src/demo/datosDemo.js`.
