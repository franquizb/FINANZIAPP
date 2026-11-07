# Suscripciones con Stripe

Cómo funciona y qué hay que configurar para cobrar la suscripción (2,50 USD/mes,
precio de acceso anticipado para el lanzamiento en EE. UU.) con 15 días de
prueba gratuita. El precio se define en Stripe (STRIPE_PRICE_ID) y, para la
interfaz, en `src/suscripcion.js` (PRECIO_MENSUAL, MONEDA_PRECIO) y en los
textos `precioMes` / `susIncluye` de `src/i18n/`.

## Cómo funciona

1. Al registrarse, la app concede la prueba gratuita (`trialEndsAt` en
   `users/{uid}`; 15 días por defecto, configurables en Gestión → Roles y
   permisos, ver ACCESO.md). Las reglas de Firestore permiten escribir según
   el tipo de cuenta (prueba vigente, pagada o invitada) y nunca si la cuenta
   está bloqueada; con la prueba terminada solo queda el Dashboard en lectura.
2. En Configuración → Suscripción (o en el aviso de prueba) el usuario pulsa
   **Activar suscripción**. La Cloud Function `crearSesionCheckout` crea una
   sesión de Stripe Checkout y la app redirige a Stripe. Si la prueba sigue
   vigente, Stripe no cobra hasta que termine.
3. Stripe avisa por webhook a `stripeWebhook` de cada cambio
   (`checkout.session.completed`, `customer.subscription.*`, `invoice.paid`,
   `invoice.payment_failed`). La función escribe en `users/{uid}`:
   `paidUntil` (fin del periodo pagado + 3 días de margen), `plan`
   (`pro`, `impago`, `cancelado`), `stripeStatus`, `stripeCustomerId`,
   `stripeSubscriptionId`, `cancelAtPeriodEnd`. El cliente **no puede**
   modificar ninguno de esos campos (reglas).
4. **Gestionar suscripción** abre el portal de Stripe (cambiar tarjeta,
   facturas, datos). La **baja** se hace en la propia app (Mi cuenta →
   Suscripción, con doble confirmación y motivo) a través de la función
   `cambiarRenovacion`, que también permite reactivarla; por eso el portal
   tiene la cancelación desactivada. `resumenStripe` da al administrador el
   estado de todas las suscripciones desde el panel de Gestión, y la pestaña
   Gestión → Resumen calcula los ingresos previstos con los datos de la app.

Las funciones viven en `functions/` (Node 24, región `europe-west1`, codebase
`finanziapp`, así que el despliegue no toca las funciones `searchSymbol` y
`getLiveQuote` que ya existen en el proyecto).

## Configuración (una sola vez)

Requisitos: proyecto en plan Blaze (ya lo está: hay funciones desplegadas) y
una cuenta de Stripe.

1. **Producto y precio en Stripe** (dashboard → Catálogo de productos): crea
   «FinanziApp» con un precio recurrente mensual de **2,50 USD** (moneda USD).
   Copia el ID del precio (`price_…`). Hazlo primero en *modo de prueba* y,
   cuando funcione, repite en *modo en vivo* (los IDs y claves son distintos
   en cada modo). Para subir el precio más adelante: crea un precio nuevo en
   Stripe y cambia `STRIPE_PRICE_ID`; los suscriptores existentes conservan el
   precio con el que se dieron de alta (es lo que promete el texto de acceso
   anticipado de la app).

2. **Parámetros** (no secretos): copia `functions/.env.example` a
   `functions/.env` y pon el `STRIPE_PRICE_ID`. La app envía a la función el
   dominio desde el que se paga y Stripe vuelve a ese mismo dominio (lista
   `ORIGENES_PERMITIDOS` en `functions/index.js`: finanziapp.com,
   finanzas.franquizb.com y personal-franquizb.web.app); `APP_URL` solo es el
   respaldo si no llega ninguno. Ojo: finanziapp.com solo funcionará cuando su
   DNS apunte a Firebase Hosting (registro A `199.36.158.100` y TXT
   `hosting-site=personal-franquizb`).

3. **Secretos**. Dos opciones equivalentes:

   - Con la CLI de Firebase autenticada, desde `app-financiera/`:

     ```bash
     firebase functions:secrets:set STRIPE_SECRET_KEY
     ```

     Pega la clave secreta de Stripe (`sk_test_…` o `sk_live_…`), y lo mismo con
     `STRIPE_WEBHOOK_SECRET` (el secreto de firma del webhook, paso 5).

   - Sin CLI, en la consola de Google Cloud → Seguridad → Secret Manager →
     «Crear secreto», con esos dos nombres exactos (`STRIPE_SECRET_KEY` y
     `STRIPE_WEBHOOK_SECRET`) y el valor correspondiente. Al desplegar, la CLI
     de Firebase concede acceso a la cuenta de las funciones. Para cambiar un
     valor (por ejemplo pasar de prueba a en vivo) se añade una versión nueva
     al secreto y se vuelven a desplegar las funciones.

   La URL del webhook es conocida de antemano, así que puedes crear el
   endpoint en Stripe (paso 5) antes de desplegar y tener ya el `whsec_…`:
   `https://europe-west1-personal-franquizb.cloudfunctions.net/stripeWebhook`.

4. **Desplegar las funciones**:

   ```bash
   cd functions && npm install && cd ..
   firebase deploy --only functions:finanziapp
   ```

   Al terminar, la CLI muestra la URL de `stripeWebhook`, del estilo
   `https://europe-west1-personal-franquizb.cloudfunctions.net/stripeWebhook`.

5. **Webhook en Stripe** (dashboard → Desarrolladores → Webhooks → Añadir
   destino): pega esa URL y selecciona los eventos
   `checkout.session.completed`, `customer.subscription.created`,
   `customer.subscription.updated`, `customer.subscription.deleted`,
   `customer.subscription.paused`, `customer.subscription.resumed`,
   `invoice.paid` e `invoice.payment_failed`. Copia el *secreto de firma*
   (`whsec_…`) y guárdalo:

   ```bash
   firebase functions:secrets:set STRIPE_WEBHOOK_SECRET
   firebase deploy --only functions:finanziapp
   ```

6. **Portal de cliente**: en Stripe → Configuración → Portal de cliente, activa
   «actualizar método de pago», «historial de facturas» y «datos del cliente»,
   y deja **desactivado** «cancelar suscripción» (la baja va por la app). Al
   pasar a modo real, repite esta configuración en el portal en vivo.

7. **Abrir los pagos por fases** (Gestión → Stripe → «Lanzamiento de los
   pagos», documento `ajustes/pagos`): al principio están **cerrados** y solo
   los **probadores** (correos de la lista) ven el botón de suscripción; la
   función `crearSesionCheckout` aplica la misma regla en el servidor. Añádete
   con «Añadirme a mí» (como administrador también puedes pagar, para probar
   un cobro real), comprueba el pago y, cuando todo esté bien, pulsa **Abrir a
   todos**. Quien ya tiene suscripción puede gestionarla siempre, aunque los
   pagos se vuelvan a cerrar.

8. **Reglas y hosting**: `npm run build` y
   `firebase deploy --only firestore:rules,hosting` (las reglas ya incluyen
   los campos de Stripe y `eventos_stripe`).

## Probar

En modo de prueba, usa la tarjeta `4242 4242 4242 4242` con cualquier fecha
futura y CVC. Tras pagar, en Gestión → Resumen de Stripe debe aparecer la
suscripción, en «Últimos eventos» los eventos del webhook, y en la fila del
usuario el estado «De pago». Para probar el impago usa `4000 0000 0000 0341`.

## Cerrar el rol de administrador a tu cuenta

En `firestore.rules`, `propietarioUid()` devuelve `'PON-AQUI-TU-UID'`. Pon
ahí tu UID (lo ves en Gestión → Acceso de administrador) y despliega las
reglas: a partir de entonces solo tu cuenta puede dar o quitar el rol de
administrador, aunque otro administrador editara usuarios.

## Dónde se ve cada cosa

- Usuario: Configuración → Suscripción (estado, activar, gestionar). El aviso
  de prueba aparece en todas las pantallas desde 5 días antes de acabar.
- Administrador: Gestión → KPIs (usuarios, en prueba, de pago, caducados,
  bloqueados, MRR), filtros y buscador, estado y fechas de cada usuario,
  Resumen de Stripe, últimos eventos del webhook y Acceso de administrador.
- Logs de las funciones: `firebase functions:log` o la consola de Firebase.
