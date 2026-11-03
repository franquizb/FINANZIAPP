# Dominio finanziapp.com, correo profesional y ventana de Google

Qué queda por hacer en las consolas (nada de esto se puede hacer desde el
código) para que el inicio de sesión con Google y los correos de la app se
vean con la marca FinanziApp, como en Investing.com y compañía.

## Lo que ya hace la app

- La ventana de Google muestra **«Ir a finanzas.franquizb.com»** (y dirá
  «Ir a finanziapp.com» en cuanto ese dominio esté conectado a Firebase
  Hosting): `src/firebase.js` usa como `authDomain` el dominio desde el que
  se sirve la app.
- Toda cuenta lleva contraseña (también las de Google), el correo se verifica
  al registrarse y existe «¿Has olvidado tu contraseña?». Ver ACCESO.md.

## 1. Comprar finanziapp.com y conectarlo

1. Compra el dominio (cualquier registrador; ~12 €/año).
2. Firebase Console → Hosting → **Añadir dominio personalizado** →
   `finanziapp.com` (y `www.finanziapp.com` como redirección). Firebase te
   da un registro **TXT** de verificación y los **A** (hoy, `199.36.158.100`;
   usa los que muestre la consola). Ponlos en el DNS del registrador. En
   cuanto el certificado esté emitido (minutos u horas), la app responde en
   https://finanziapp.com, Google ya lo tiene autorizado (está en los
   dominios autorizados de Authentication) y la ventana dirá «Ir a
   finanziapp.com».
3. Stripe (cuando se active): el código ya acepta finanziapp.com como origen
   de pago (`ORIGENES_PERMITIDOS` en `functions/index.js`).

## 2. Correo profesional con Google Workspace (sin pagar otra licencia)

Ya pagas Workspace para franquizb.com. Añade finanziapp.com como **dominio
alternativo (alias)** en admin.google.com → Cuenta → Dominios → Gestionar
dominios → «Añadir un dominio» → *Alias de dominio de usuario*. Es gratis:
cada usuario recibe automáticamente su misma dirección en el dominio nuevo
(brian@finanziapp.com) y puedes crear alias como `soporte@finanziapp.com` o
`no-reply@finanziapp.com` (Usuarios → tu usuario → Correos electrónicos
alternativos, o un Grupo de Google para soporte@). Para responder desde esa
dirección en Gmail: Configuración → Cuentas → «Enviar como».

## 3. Que los correos de la app salgan de no-reply@finanziapp.com

Los correos de verificación y de «restablecer contraseña» los envía Firebase
Authentication y hoy salen de `noreply@personal-franquizb.firebaseapp.com`.
Para que salgan de tu dominio:

Firebase Console → Authentication → **Templates** (Plantillas) → icono del
lápiz junto al remitente → **Personalizar dominio** → `finanziapp.com`.
Firebase muestra 4-5 registros DNS (un TXT de verificación, un TXT SPF
`v=spf1 include:_spf.firebasemail.com ~all` y dos CNAME DKIM
`firebase1._domainkey` / `firebase2._domainkey`). Ponlos en el DNS y pulsa
«Verificar». Desde entonces el remitente es `noreply@finanziapp.com`
(puedes cambiar el nombre visible a «FinanziApp» en la misma pantalla).
Ahí mismo se edita el texto de cada plantilla (asunto y cuerpo) en cada
idioma: Authentication → Templates → Idioma de la plantilla.

No hace falta ningún servidor de correo ni SMTP: lo envía Firebase.

## 4. La ventana de Google con nombre, logo y correo de asistencia

Lo que ves como «Información sobre el desarrollador: personal-franquizb…» y
«Correo de asistencia: brianantigua@gmail.com» es la **pantalla de
consentimiento de OAuth** del proyecto. Se cambia en Google Cloud Console →
proyecto **personal-franquizb** → **APIs y servicios → Pantalla de
consentimiento de OAuth** (ahora dentro de «Google Auth Platform → Branding»):

| Campo | Valor recomendado |
|---|---|
| Nombre de la aplicación | **FinanziApp** |
| Correo de asistencia | `soporte@finanziapp.com` (tiene que ser una cuenta o un Grupo de Google tuyo; mientras no exista, `brian@franquizb.com`) |
| Logotipo | PNG/JPG cuadrado, 120×120, fondo transparente (el isotipo FZ) |
| Página principal | https://finanziapp.com |
| Política de privacidad / Términos | https://finanziapp.com/privacidad y /terminos (hay que crear esas páginas; te las redacto cuando quieras) |
| Dominios autorizados | `finanziapp.com`, `franquizb.com`, `firebaseapp.com` |
| Correo de contacto del desarrollador | tu correo |

Guarda y pulsa **Publicar aplicación** (estado «En producción»). Con solo los
permisos básicos (correo y perfil) no hace falta pasar la verificación de
Google para que se muestre el **nombre**; para que aparezca el **logotipo**
Google exige verificar la marca (Verification Center → enviar; suele tardar
unos días y pide que el dominio de la página principal sea tuyo). Hasta
entonces la ventana dirá «Para continuar a FinanziApp» con el correo de
asistencia que pongas, como en el ejemplo de Investing.com.

## 5. Después, en el código (lo hago yo cuando tengas el dominio)

- Nada obligatorio: `authDomain`, orígenes de Stripe y dominios autorizados
  ya incluyen finanziapp.com.
- Opcional: cambiar los enlaces de la portada y de los correos de ayuda para
  que apunten a finanziapp.com, y redirigir finanzas.franquizb.com al nuevo
  dominio cuando quieras dejar solo uno.
