# Suscripciones con Stripe

Cómo funciona y qué hay que configurar para cobrar la suscripción (4,99 €/mes)
con 15 días de prueba gratuita.

## Cómo funciona

1. Al registrarse, la app concede 15 días de prueba (`trialEndsAt` en
   `users/{uid}`). Las reglas de Firestore permiten escribir mientras
   `trialEndsAt` o `paidUntil` estén en el futuro y la cuenta no esté bloqueada.
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
   facturas, cancelar). `resumenStripe` da al administrador el estado de todas
   las suscripciones desde el panel de Gestión.

Las funciones viven en `functions/` (Node 20, región `europe-west1`, codebase
`finanziapp`, así que el despliegue no toca las funciones `searchSymbol` y
`getLiveQuote` que ya existen en el proyecto).

## Configuración (una sola vez)

Requisitos: proyecto en plan Blaze (ya lo está: hay funciones desplegadas) y
una cuenta de Stripe.

1. **Producto y precio en Stripe** (dashboard → Catálogo de productos): crea
   «FinanziApp» con un precio recurrente mensual de 4,99 €. Copia el ID del
   precio (`price_…`). Hazlo primero en *modo de prueba* y, cuando funcione,
   repite en *modo en vivo* (los IDs y claves son distintos en cada modo).

2. **Parámetros** (no secretos): copia `functions/.env.example` a
   `functions/.env` y pon el `STRIPE_PRICE_ID`. `APP_URL` es la URL pública de
   la app (a la que vuelve Stripe tras el pago).

3. **Secretos** (desde `app-financiera/`, con la CLI de Firebase autenticada):

   ```bash
   firebase functions:secrets:set STRIPE_SECRET_KEY
   ```

   Pega la clave secreta de Stripe (`sk_test_…` o `sk_live_…`). El secreto del
   webhook se crea en el paso 5; de momento pon cualquier valor provisional:

   ```bash
   firebase functions:secrets:set STRIPE_WEBHOOK_SECRET
   ```

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
   «cancelar suscripción» y «actualizar método de pago» y guarda.

7. **Activar el botón en la app**: en `src/suscripcion.js` pon
   `STRIPE_ACTIVO = true` (mientras está en `false` la app muestra «el pago con
   tarjeta todavía no está disponible» en lugar del botón).

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
