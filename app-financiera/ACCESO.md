# Tipos de cuenta, permisos e invitaciones

Quién puede usar qué en FinanziApp, y desde dónde se controla. Todo se
administra desde **Gestión** (solo administradores), sin tocar código.

## Tipos de cuenta (roles)

El rol de cada usuario se calcula siempre en este orden (igual en la app,
`src/acceso.js`, y en las reglas de Firestore, `firestore.rules`):

| Rol | Cuándo | Por defecto |
|---|---|---|
| **Admin** | `isAdmin: true` en `users/{uid}` (lo pone otro admin, o el propietario) | Todo, incluida Gestión |
| **Bloqueado** | el admin bloquea la cuenta | Solo lectura; ve lo mismo que «prueba terminada» |
| **De pago** | `paidUntil` en el futuro (lo escribe el webhook de Stripe, o el admin a mano) | Todas las secciones, puede editar |
| **Invitado** | `invitado: true` y sin fecha límite o con `invitadoHasta` en el futuro | Todas las secciones, puede editar, **no paga** |
| **En prueba** | `trialEndsAt` en el futuro (se estampa al registrarse) | Todas las secciones, puede editar |
| **Prueba terminada** | nada de lo anterior | Solo el Dashboard, en solo lectura; el resto de secciones muestra la pantalla de pago |

Configuración está siempre disponible (ahí se activa la suscripción y se
cierra sesión) y Gestión es solo para administradores.

## Gestión → Roles y permisos

Una matriz **sección × tipo de cuenta** con casillas, una fila «Puede editar
sus datos» y el número de **días de prueba** para las cuentas nuevas. Al
guardar se escribe `ajustes/acceso` en Firestore y se aplica al instante a
todos los usuarios de ese tipo (la app lo escucha en tiempo real) y a las
reglas de la base de datos (que leen el mismo documento). Por ejemplo, para
que Trading solo lo vean los suscriptores: desmarca Trading en «En prueba» e
«Invitado» y déjalo marcado en «De pago». Las secciones que un usuario no
tiene pero sí tendría con la suscripción aparecen en su menú con un candado y
llevan a la pantalla de pago.

«Valores por defecto» repone la configuración inicial (15 días; todos editan
salvo «prueba terminada», que solo ve el Dashboard).

Si el documento `ajustes/acceso` no existe, valen esos valores por defecto.

## Gestión → Invitaciones (cuentas gratuitas)

Escribe un correo y, si quieres, una fecha límite:

- Si el correo **ya tiene cuenta**, pasa a invitado en ese momento.
- Si **no la tiene**, se guarda `invitaciones/{correo}` y la cuenta nacerá
  como invitada en cuanto esa persona se registre con ese correo (las reglas
  comprueban que la invitación existe y que la fecha coincide). La lista de
  pendientes marca «ya registrado» cuando se ha dado de alta; la invitación se
  puede quitar entonces.

Los invitados tienen lo que marques para «Invitado» en Roles y permisos, no
ven avisos de pago ni botones de suscripción, y vuelven al circuito normal
(prueba → pago) si les quitas la marca o vence su fecha.

## Gestión → Usuarios (ficha de cada usuario)

Desde el lápiz de cada fila:

- **Rol global**: usuario o administrador (un admin no puede quitarse el rol
  a sí mismo; si `propietarioUid()` está configurado en las reglas, solo el
  propietario puede dar o quitar administradores).
- **Prueba gratuita hasta** y **Pagado hasta**: fechas editables (ampliar una
  prueba, regalar meses, marcar un pago manual).
- **Cuenta invitada** y su fecha límite.
- **Secciones para este usuario**: casillas con el estado efectivo. Lo que
  marques de más se guarda en `vistasExtra` y lo que desmarques de lo que su
  tipo ya incluye, en `vistasQuitadas`: son excepciones solo para esa persona
  y se conservan aunque cambie de tipo de cuenta. En la tabla aparecen como
  «+ Sección» (añadida) o tachadas (quitada).
- **Bloquear / desbloquear** desde el candado de la fila.

## Qué garantiza la base de datos (seguridad)

La interfaz oculta y muestra, pero quien manda son las reglas de Firestore:

- El cliente **nunca** puede escribir `isAdmin`, `trialEndsAt`, `paidUntil`,
  `plan`, `bloqueado`, `invitado`, `invitadoHasta`, `vistasExtra`,
  `vistasQuitadas` ni los campos de Stripe. Al registrarse, `trialEndsAt` se
  acota a los días configurados y `invitado` solo se acepta si existe la
  invitación de ese correo.
- Escribir datos financieros exige un rol con «Puede editar sus datos» según
  `ajustes/acceso`, y nunca si la cuenta está bloqueada. Leer los propios
  datos se permite siempre (derecho de acceso del RGPD).
- `ajustes/acceso` lo lee cualquier usuario identificado y solo lo escribe un
  administrador, con forma válida (1–365 días, mapa de roles).
- `invitaciones/{correo}` solo lo leen el admin y la propia persona invitada;
  solo lo escribe el admin.

Para desplegar cambios de reglas: `firebase deploy --only firestore:rules`
desde `app-financiera/` (o la API de Firebase Rules, como hace el script de
despliegue de la sesión de trabajo).
