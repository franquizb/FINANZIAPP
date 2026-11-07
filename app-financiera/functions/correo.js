// ─── FinanziApp · Correos propios (verificación y cambio de contraseña) ───────
//
// Firebase genera el enlace (Admin SDK) y nosotros lo enviamos con Brevo desde
// noreply@finanziapp.com, con plantilla propia en el idioma del usuario y el
// enlace en finanziapp.com (Firebase no deja cambiar su plantilla ni la URL de
// acción en este proyecto, y un enlace a otro dominio hacía que Outlook lo
// marcara como spam). /__/auth/action lo sirve Firebase Hosting en cualquier
// dominio del sitio, así que el enlace funciona igual.
//
// Secreto: BREVO_API_KEY (Secret Manager). El remitente noreply@finanziapp.com
// tiene que estar dado de alta en Brevo con el dominio autenticado (CORREO.md).

const crypto = require('crypto');

const DOMINIO_APP = 'https://finanziapp.com';
const REMITENTE = { name: 'FinanziApp', email: 'noreply@finanziapp.com' };
const RESPONDER_A = { name: 'FinanziApp', email: 'support@finanziapp.com' };
const LOGO = `${DOMINIO_APP}/logo120.png`;
const IDIOMAS = ['es', 'en', 'de'];

const TEXTOS = {
  es: {
    verificar: {
      asunto: 'Confirma tu correo para empezar con FinanziApp',
      titulo: 'Confirma tu correo',
      texto: 'Gracias por registrarte en FinanziApp. Pulsa el botón para confirmar tu correo y empezar tus 15 días gratis.',
      boton: 'Confirmar mi correo',
      ignorar: 'Si no has creado una cuenta en FinanziApp, ignora este correo.'
    },
    contrasena: {
      asunto: 'Cambia tu contraseña de FinanziApp',
      titulo: 'Cambia tu contraseña',
      texto: 'Hemos recibido una solicitud para cambiar la contraseña de tu cuenta de FinanziApp. Pulsa el botón para elegir una nueva.',
      boton: 'Elegir nueva contraseña',
      ignorar: 'Si no lo has pedido tú, ignora este correo: tu contraseña no cambia.'
    },
    hola: (n) => (n ? `Hola, ${n}:` : 'Hola:'),
    alternativo: 'Si el botón no funciona, copia y pega este enlace en tu navegador:',
    caduca: 'Por seguridad, el enlace caduca en unas horas.',
    pie: '¿Dudas? Escríbenos a support@finanziapp.com'
  },
  en: {
    verificar: {
      asunto: 'Confirm your email to get started with FinanziApp',
      titulo: 'Confirm your email',
      texto: 'Thanks for signing up for FinanziApp. Tap the button to confirm your email and start your 15-day free trial.',
      boton: 'Confirm my email',
      ignorar: 'If you did not create a FinanziApp account, you can ignore this email.'
    },
    contrasena: {
      asunto: 'Reset your FinanziApp password',
      titulo: 'Reset your password',
      texto: 'We received a request to reset the password for your FinanziApp account. Tap the button to choose a new one.',
      boton: 'Choose a new password',
      ignorar: 'If you did not request this, ignore this email: your password will not change.'
    },
    hola: (n) => (n ? `Hi ${n},` : 'Hi,'),
    alternativo: 'If the button does not work, copy and paste this link into your browser:',
    caduca: 'For your security, this link expires in a few hours.',
    pie: 'Questions? Write to us at support@finanziapp.com'
  },
  de: {
    verificar: {
      asunto: 'Bestätigen Sie Ihre E-Mail für FinanziApp',
      titulo: 'Bestätigen Sie Ihre E-Mail',
      texto: 'Danke für Ihre Registrierung bei FinanziApp. Tippen Sie auf die Schaltfläche, um Ihre E-Mail zu bestätigen und Ihre 15 kostenlosen Testtage zu starten.',
      boton: 'E-Mail bestätigen',
      ignorar: 'Wenn Sie kein FinanziApp-Konto erstellt haben, können Sie diese E-Mail ignorieren.'
    },
    contrasena: {
      asunto: 'Setzen Sie Ihr FinanziApp-Passwort zurück',
      titulo: 'Passwort zurücksetzen',
      texto: 'Wir haben eine Anfrage erhalten, das Passwort Ihres FinanziApp-Kontos zurückzusetzen. Tippen Sie auf die Schaltfläche, um ein neues zu wählen.',
      boton: 'Neues Passwort wählen',
      ignorar: 'Wenn Sie das nicht angefordert haben, ignorieren Sie diese E-Mail: Ihr Passwort bleibt unverändert.'
    },
    hola: (n) => (n ? `Hallo ${n},` : 'Hallo,'),
    alternativo: 'Falls die Schaltfläche nicht funktioniert, kopieren Sie diesen Link in Ihren Browser:',
    caduca: 'Aus Sicherheitsgründen läuft der Link in einigen Stunden ab.',
    pie: 'Fragen? Schreiben Sie uns an support@finanziapp.com'
  }
};

const idiomaValido = (i) => (IDIOMAS.includes(i) ? i : 'en');
const escapar = (s) => String(s || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// El enlace de Firebase (personal-franquizb.firebaseapp.com/__/auth/action?…)
// pasa a finanziapp.com con los mismos parámetros, y en el idioma del usuario.
const aDominioPropio = (enlace, idioma) => {
  const u = new URL(enlace);
  const d = new URL(DOMINIO_APP);
  u.protocol = d.protocol;
  u.host = d.host;
  u.searchParams.set('lang', idioma);
  return u.toString();
};

// HTML sencillo con tablas y estilos en línea: es lo que entienden Outlook,
// Gmail y Apple Mail por igual. Siempre con versión en texto plano.
const componer = (tipo, idioma, nombre, enlace) => {
  const t = TEXTOS[idioma];
  const c = t[tipo];
  const html = `<!doctype html><html lang="${idioma}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapar(c.asunto)}</title></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:24px 12px;"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
<tr><td style="padding:28px 32px 8px;">
<table role="presentation" cellpadding="0" cellspacing="0"><tr>
<td><img src="${LOGO}" width="40" height="40" alt="FinanziApp" style="display:block;border-radius:10px;"></td>
<td style="padding-left:10px;font-size:20px;font-weight:bold;color:#0f172a;">Finanzi<span style="color:#0d9488;">App</span></td>
</tr></table></td></tr>
<tr><td style="padding:16px 32px 0;"><h1 style="margin:0;font-size:22px;line-height:1.3;color:#0f172a;">${escapar(c.titulo)}</h1></td></tr>
<tr><td style="padding:14px 32px 0;font-size:15px;line-height:1.6;color:#334155;">${escapar(t.hola(nombre))}<br><br>${escapar(c.texto)}</td></tr>
<tr><td style="padding:24px 32px 8px;" align="left">
<a href="${escapar(enlace)}" style="display:inline-block;background:#0d9488;color:#ffffff;text-decoration:none;font-weight:bold;font-size:15px;padding:13px 26px;border-radius:10px;">${escapar(c.boton)}</a>
</td></tr>
<tr><td style="padding:12px 32px 0;font-size:12px;line-height:1.6;color:#64748b;">${escapar(t.alternativo)}<br><a href="${escapar(enlace)}" style="color:#0d9488;word-break:break-all;">${escapar(enlace)}</a></td></tr>
<tr><td style="padding:16px 32px 0;font-size:12px;line-height:1.6;color:#64748b;">${escapar(t.caduca)} ${escapar(c.ignorar)}</td></tr>
<tr><td style="padding:24px 32px 28px;font-size:12px;color:#94a3b8;border-top:1px solid #e2e8f0;">${escapar(t.pie)}<br>FinanziApp · finanziapp.com</td></tr>
</table></td></tr></table></body></html>`;
  const texto = `${t.hola(nombre)}\n\n${c.texto}\n\n${c.boton}: ${enlace}\n\n${t.caduca} ${c.ignorar}\n\n${t.pie}\nFinanziApp · finanziapp.com`;
  return { asunto: c.asunto, html, texto };
};

// Envío transaccional con la API de Brevo.
const enviarConBrevo = async (apiKey, { para, nombre, asunto, html, texto, etiqueta }) => {
  const r = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': apiKey, 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({
      sender: REMITENTE,
      replyTo: RESPONDER_A,
      to: [{ email: para, ...(nombre ? { name: nombre } : {}) }],
      subject: asunto,
      htmlContent: html,
      textContent: texto,
      tags: [etiqueta]
    })
  });
  if (!r.ok) throw new Error(`Brevo ${r.status}: ${(await r.text()).slice(0, 300)}`);
  return r.json().catch(() => ({}));
};

// Límite de envíos por destinatario: uno por minuto y seis al día, para que
// nadie use el formulario para llenar el buzón de otra persona. Se guarda en
// limites_correo/{clave}, una colección que solo usa el servidor (las reglas
// de Firestore niegan todo lo que no esté listado).
const comprobarLimite = async (db, clave) => {
  const ahora = Date.now();
  const ref = db.collection('limites_correo').doc(clave);
  return db.runTransaction(async (tx) => {
    const previos = ((await tx.get(ref)).data()?.envios || []).filter((t) => t > ahora - 86400000);
    if (previos.length && previos[previos.length - 1] > ahora - 60000) return false;
    if (previos.length >= 6) return false;
    tx.set(ref, { envios: [...previos, ahora], actualizado: ahora });
    return true;
  });
};

const huella = (texto) => crypto.createHash('sha256').update(texto).digest('hex').slice(0, 40);

module.exports = { idiomaValido, aDominioPropio, componer, enviarConBrevo, comprobarLimite, huella };
