# Correo de finanziapp.com, newsletter y aportaciones

Lo que se hace en consolas y en el DNS (no desde el código). La compra del
dominio, el alias de Workspace y el remitente de Firebase están explicados en
BRANDING-GOOGLE.md (apartados 1 a 3); aquí va lo que falta para que **todo
el correo de FinanziApp entre y salga por finanziapp.com** sin caer en spam.

## Qué direcciones usar

| Dirección | Para qué | Cómo se crea |
|---|---|---|
| `noreply@finanziapp.com` | Verificación del correo y «restablecer contraseña» (los envía Firebase) | Firebase → Authentication → Templates → Personalizar dominio |
| `soporte@finanziapp.com` | Contacto de la web, páginas legales, ventana de Google | Grupo de Google en Workspace (gratis; puedes añadir a alguien más un día) |
| `hola@finanziapp.com` | Remitente de la newsletter (las respuestas te llegan) | Alias de tu usuario en Workspace |
| `brian@finanziapp.com` | Tu correo personal de la marca | Automática con el alias de dominio |

Todo llega a tu Gmail de Workspace. No hace falta pagar más licencias.

## Registros DNS (en el registrador, una vez comprado el dominio)

Copia siempre los valores exactos que muestre cada consola; estos son los tipos
que vas a ver:

1. **Hosting** (Firebase): TXT de verificación y registros A.
2. **Recibir correo** (Workspace): un **MX** `smtp.google.com` con prioridad 1
   y el TXT `google-site-verification=…`. Sin el MX, nada de lo que te escriban
   a @finanziapp.com llega.
3. **SPF: un único TXT** que empiece por `v=spf1`. Es la trampa habitual: si
   pones uno para Workspace y otro para Firebase, los dos dejan de valer y tus
   correos van a spam. Júntalos así:

   ```
   v=spf1 include:_spf.google.com include:_spf.firebasemail.com ~all
   ```

   Si Brevo te pide SPF, añade `include:spf.brevo.com` dentro del mismo registro.
4. **DKIM** (firma de cada servicio, todos conviven):
   - Workspace: admin.google.com → Aplicaciones → Gmail → Autenticar correo →
     generar → TXT `google._domainkey`.
   - Firebase: dos CNAME `firebase1._domainkey` y `firebase2._domainkey`.
   - Brevo: los CNAME `brevo1._domainkey` y `brevo2._domainkey` (y su TXT `brevo-code`).
5. **DMARC**: un TXT en `_dmarc` para empezar en modo observación:

   ```
   v=DMARC1; p=none; rua=mailto:soporte@finanziapp.com
   ```

   Cuando lleves unas semanas sin problemas, cambia `p=none` por `p=quarantine`.
   Gmail y Yahoo exigen SPF, DKIM y DMARC a quien envía newsletters.

Comprueba el resultado mandándote un correo desde cada servicio a
https://www.mail-tester.com (objetivo: 9/10 o más).

## Después, en el código (2 minutos, lo hago yo)

En `src/marca.js`: `CORREO_SOPORTE = 'soporte@finanziapp.com'` y desplegar.
Cambia a la vez el contacto de la portada, de Privacidad y de Términos.
Los correos de Firebase ya salen en el idioma de la app (es/en/de).

## Newsletter

**Qué hace ya la app**

- Casilla **sin marcar** al registrarse (con correo y con Google) e interruptor
  en Configuración → Newsletter para apuntarse o darse de baja en un clic.
- Se guarda en el perfil la fecha, el idioma y el origen (registro o
  Configuración): es la prueba del consentimiento que pide el RGPD. Como el
  correo de la cuenta está verificado, el alta queda probada.
- Gestión → **Newsletter**: lista de suscritos, número de bajas y botón
  **Exportar CSV** (columnas EMAIL, FIRSTNAME, LANGUAGE, OPT_IN_DATE, SOURCE).
- La política de privacidad ya explica la newsletter y que puede incluir
  alguna recomendación patrocinada, siempre señalada.

**Para enviarla (recomendado: Brevo)**

Brevo es europeo (servidores en la UE, cumple el RGPD) y su plan gratuito da
para empezar (unos 300 correos al día; comprueba los límites actuales).

1. Crea la cuenta con `hola@finanziapp.com` y autentica el dominio
   (Remitentes y dominios → registros del apartado DNS de arriba).
2. Crea tres listas: `Newsletter ES`, `Newsletter EN`, `Newsletter DE`.
3. Importa el CSV de Gestión → Newsletter en la lista de su idioma (filtra
   por la columna LANGUAGE). Al importar **no marques** la opción de quitar
   contactos de la lista de bloqueo: así quien se dio de baja desde un correo
   sigue de baja aunque vuelva a aparecer en el CSV.
4. Cada envío lleva el enlace de baja de Brevo y una dirección postal en el
   pie (obligatoria en EE. UU.; vale un apartado de correos o la de tu
   actividad, no hace falta la de tu casa).
5. Repite la importación antes de cada envío (o pídeme que sincronice Brevo
   automáticamente con una Cloud Function cuando tengas la cuenta).

**Publicidad en la newsletter**: marca cada bloque patrocinado como
«Patrocinado» / «Publicidad». Nunca se comparten datos de los suscriptores
con los anunciantes (así lo dice la política de privacidad).

**Más adelante**: un formulario en la portada para quien aún no tiene cuenta.
Usa el formulario incrustable de Brevo con **doble confirmación** (doble
opt-in): así nadie puede apuntar el correo de otro.

## Aportaciones voluntarias

**Qué hace ya la app**: una tarjeta discreta al final de Configuración
(«FinanziApp está en construcción…», con la suscripción por delante; quien ya
paga ve un agradecimiento) y una línea en el pie de la portada. Sin ventanas
emergentes ni avisos. Está **oculta** hasta que haya un enlace oficial.

**Canal oficial: un Payment Link de Stripe** (la misma cuenta que cobra la
suscripción; los pagos y los recibos quedan en un solo sitio):

1. Stripe → Payment Links → Nuevo → producto «Apoyo a FinanziApp» →
   **«Los clientes eligen el importe»** (importe sugerido 5, mínimo 1).
2. Descripción: «Aportación voluntaria para el desarrollo de FinanziApp. No da
   acceso a funciones adicionales».
3. Copia el enlace (`https://buy.stripe.com/…`) en `URL_APOYO` de
   `src/marca.js` y despliega. Solo se aceptan enlaces de Stripe, Ko-fi, Buy Me
   a Coffee o GitHub Sponsors; cualquier otro se ignora.

**Fiscalidad**: no es una ONG, así que no se llama «donación» (en España una
donación a una persona tributa por el Impuesto de Donaciones y no desgrava al
que la hace). Es un ingreso de tu actividad, igual que la suscripción.
Confírmalo con tu gestor antes de activarla.
