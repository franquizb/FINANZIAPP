# FinanziApp: principios del proyecto

Léelo antes de cambiar nada. Son decisiones del propietario.

## Es para todo el mundo

- Nada puede depender de tener cuenta de Google. El registro con correo y
  contraseña funciona con **cualquier proveedor** (Gmail, Outlook/Hotmail,
  iCloud, Yahoo, Proton, correos de empresa…) y Google es solo un atajo.
- Toda cuenta con correo **verifica su dirección con un enlace** antes de
  entrar; las reglas de Firestore tampoco dejan escribir a una cuenta nueva sin
  verificar. No quitar esta verificación.
- Los correos que envía la app (verificación, contraseña, avisos, newsletter)
  tienen que llegar a la **bandeja de entrada de cualquier proveedor**, no solo
  de Gmail: remitente con el dominio propio (finanziapp.com) y SPF, DKIM y
  DMARC correctos. Probar siempre también con Outlook.
- Idiomas: español, inglés y alemán (`app-financiera/src/i18n/`), mismas
  claves en los tres. Monedas: la del país del usuario, elegible en
  Configuración.

## Mercado

- Lanzamiento principal en **EE. UU.** (inglés, USD). España (EUR) después.
- Precio de acceso anticipado: 2,50 USD/mes, 15 días de prueba sin tarjeta.

## Seguridad y forma de trabajar

- Nunca pedir claves ni contraseñas en el chat: formularios seguros del
  entorno o la consola del servicio.
- Desplegar a producción (hosting, reglas, funciones) y cambiar DNS solo cuando
  el propietario lo pide expresamente.
- Otras sesiones también suben a `main`: hacer `git fetch` antes de subir y
  comprobar qué está desplegado antes de desplegar encima.

## Dónde está cada cosa

- `app-financiera/`: la app (React + Firebase). `functions/`: pagos con Stripe.
- Guías: `PENDIENTE.md` (lo que hace el propietario), `STRIPE.md`,
  `CORREO.md`, `ACCESO.md`, `BRANDING-GOOGLE.md`.
- `marketing/instagram/`: anuncios, perfil, posts e historias (`PERFIL.md`).
