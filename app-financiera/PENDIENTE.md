# Pendiente (lo que solo puedes hacer tú) — 3/11/2026

Estado: producción en finanzas.franquizb.com funciona, incluido el acceso con
Google (con el dominio de Firebase). Todo el código está en GitHub.

## 1. Ventana de Google con tu dominio (2 minutos, Google Cloud Console)

Google no permite cambiar esto por API; va en la consola, proyecto
**personal-franquizb**:

1. APIs y servicios → **Credenciales** → "IDs de cliente de OAuth 2.0" →
   abre **Web client (auto created by Google Service)**.
2. "Orígenes autorizados de JavaScript": añade
   `https://finanzas.franquizb.com` y `https://finanziapp.com`.
3. "URIs de redireccionamiento autorizados": añade
   `https://finanzas.franquizb.com/__/auth/handler` y
   `https://finanziapp.com/__/auth/handler`.
4. Guardar (tarda de 5 minutos a unas horas en aplicarse).

Después avísame: lo compruebo, pongo `USAR_DOMINIO_PROPIO = true` en
`src/firebase.js` y despliego. Hasta entonces, si se activa sin este paso,
Google da `redirect_uri_mismatch` y nadie puede entrar con Google.

## 2. Nombre, logo y correo de asistencia en la ventana de Google

Google Cloud Console → **Google Auth Platform → Branding** (antes "Pantalla
de consentimiento de OAuth"): nombre de la app **FinanziApp**, correo de
asistencia (una cuenta o grupo de Google tuyo: `brian@franquizb.com` hoy,
`soporte@finanziapp.com` cuando exista), logo 120×120, página principal,
dominios autorizados `finanziapp.com` y `franquizb.com`. Con el nombre puesto
la ventana dirá "Ir a FinanziApp"; el logo aparece tras la verificación de
marca de Google. Detalle en BRANDING-GOOGLE.md.

## 3. Dominio finanziapp.com

1. Comprarlo.
2. Firebase Console → Hosting → Añadir dominio personalizado → poner el TXT y
   los A que indique en el DNS.
3. Workspace: añadir finanziapp.com como alias de dominio (gratis) →
   no-reply@ y soporte@.
4. Firebase Console → Authentication → Templates → Personalizar dominio del
   remitente → registros DNS → los correos de verificación y contraseña
   salen de `noreply@finanziapp.com`.
Pasos completos en BRANDING-GOOGLE.md; los registros de correo (MX, un
solo SPF, DKIM, DMARC), la newsletter con Brevo y las aportaciones, en
CORREO.md.

## 4. Roles y permisos

Mi test borró tu configuración (Trading quitado a prueba, pago e invitado).
Vuelve a ponerla en **Gestión → Roles y permisos** y guarda. El test ya la
respeta.

## 5. Stripe (suscripción 2,50 USD)

Cuenta de Stripe, producto con precio recurrente de 2,50 USD (`price_…`),
webhook en `https://europe-west1-personal-franquizb.cloudfunctions.net/stripeWebhook`
y los secretos `STRIPE_SECRET_KEY` y `STRIPE_WEBHOOK_SECRET` en Secret Manager.
Con eso despliego las funciones y activo el botón de pago. Pasos en STRIPE.md.

## 5b. Aportaciones voluntarias

La tarjeta de apoyo y la línea del pie están hechas pero ocultas. Con la
cuenta de Stripe creada: Payment Link con «los clientes eligen el importe»,
pegar el enlace en `URL_APOYO` (`src/marca.js`) y desplegar. Antes, pregunta
a tu gestor cómo declararlas (CORREO.md, apartado «Aportaciones»).

## 6. Comprobar tú mismo

- Entra con Google: verás "Completa tu registro" (crear contraseña). Es el
  único paso que no pude probar en automático. Si fallara, "¿Has olvidado tu
  contraseña?" te deja crear la contraseña por correo.
- Gestión → Errores: vacía la lista (los errores de hoy eran de mis cuentas
  de prueba).

## 7. Para más adelante

- Páginas legales (privacidad y términos) antes de anunciar en EE. UU.; te
  las redacto cuando quieras.
- Si prefieres código de 6 cifras en vez de enlace para verificar el correo,
  hace falta un servicio de envío (SMTP/SendGrid) con tu no-reply.
- Versión móvil: primero PWA, luego Capacitor para App Store y Google Play.
