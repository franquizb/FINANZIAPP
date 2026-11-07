// ─── FinanziApp · Correos propios: códigos de verificación y de contraseña ────
//
// En vez de los enlaces de Firebase, enviamos un código de 6 cifras con Brevo
// desde noreply@finanziapp.com, con plantilla propia en el idioma del usuario.
// Sin enlaces de acción en el correo: llega mejor a la bandeja de entrada
// (Outlook marcaba como spam el enlace a firebaseapp.com) y el usuario puede
// leer el código en el móvil y escribirlo en el ordenador.
//
// Secreto: BREVO_API_KEY (Secret Manager). El dominio finanziapp.com está
// autenticado en Brevo y el remitente noreply@finanziapp.com, activo (CORREO.md).

const crypto = require('crypto');

const DOMINIO_APP = 'https://finanziapp.com';
const REMITENTE = { name: 'FinanziApp', email: 'noreply@finanziapp.com' };
const RESPONDER_A = { name: 'FinanziApp', email: 'support@finanziapp.com' };
const LOGO = `${DOMINIO_APP}/logo120.png`;
const IDIOMAS = ['es', 'en', 'de'];

const TEXTOS = {
  es: {
    verificar: {
      asunto: (c) => `${c} es tu código de FinanziApp`,
      titulo: 'Confirma tu correo',
      texto: 'Gracias por registrarte en FinanziApp. Escribe este código en la app para confirmar tu correo y empezar tus 15 días gratis:',
      ignorar: 'Si no has creado una cuenta en FinanziApp, ignora este correo.'
    },
    contrasena: {
      asunto: (c) => `${c} es tu código para cambiar la contraseña de FinanziApp`,
      titulo: 'Cambia tu contraseña',
      texto: 'Hemos recibido una solicitud para cambiar la contraseña de tu cuenta de FinanziApp. Escribe este código en la app junto a tu nueva contraseña:',
      ignorar: 'Si no lo has pedido tú, ignora este correo: tu contraseña no cambia.'
    },
    hola: (n) => (n ? `Hola, ${n}:` : 'Hola:'),
    caduca: 'El código caduca en 15 minutos. No lo compartas con nadie: FinanziApp nunca te lo pedirá.',
    pie: '¿Dudas? Escríbenos a support@finanziapp.com'
  },
  en: {
    verificar: {
      asunto: (c) => `${c} is your FinanziApp code`,
      titulo: 'Confirm your email',
      texto: 'Thanks for signing up for FinanziApp. Enter this code in the app to confirm your email and start your 15-day free trial:',
      ignorar: 'If you did not create a FinanziApp account, you can ignore this email.'
    },
    contrasena: {
      asunto: (c) => `${c} is your FinanziApp password reset code`,
      titulo: 'Reset your password',
      texto: 'We received a request to reset the password for your FinanziApp account. Enter this code in the app together with your new password:',
      ignorar: 'If you did not request this, ignore this email: your password will not change.'
    },
    hola: (n) => (n ? `Hi ${n},` : 'Hi,'),
    caduca: 'This code expires in 15 minutes. Do not share it with anyone: FinanziApp will never ask you for it.',
    pie: 'Questions? Write to us at support@finanziapp.com'
  },
  de: {
    verificar: {
      asunto: (c) => `${c} ist Ihr FinanziApp-Code`,
      titulo: 'Bestätigen Sie Ihre E-Mail',
      texto: 'Danke für Ihre Registrierung bei FinanziApp. Geben Sie diesen Code in der App ein, um Ihre E-Mail zu bestätigen und Ihre 15 kostenlosen Testtage zu starten:',
      ignorar: 'Wenn Sie kein FinanziApp-Konto erstellt haben, können Sie diese E-Mail ignorieren.'
    },
    contrasena: {
      asunto: (c) => `${c} ist Ihr Code zum Zurücksetzen des FinanziApp-Passworts`,
      titulo: 'Passwort zurücksetzen',
      texto: 'Wir haben eine Anfrage erhalten, das Passwort Ihres FinanziApp-Kontos zurückzusetzen. Geben Sie diesen Code zusammen mit Ihrem neuen Passwort in der App ein:',
      ignorar: 'Wenn Sie das nicht angefordert haben, ignorieren Sie diese E-Mail: Ihr Passwort bleibt unverändert.'
    },
    hola: (n) => (n ? `Hallo ${n},` : 'Hallo,'),
    caduca: 'Der Code läuft in 15 Minuten ab. Geben Sie ihn an niemanden weiter: FinanziApp wird Sie nie danach fragen.',
    pie: 'Fragen? Schreiben Sie uns an support@finanziapp.com'
  }
};

const idiomaValido = (i) => (IDIOMAS.includes(i) ? i : 'en');
const escapar = (s) => String(s || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// HTML sencillo con tablas y estilos en línea: es lo que entienden Outlook,
// Gmail y Apple Mail por igual. Siempre con versión en texto plano.
const componer = (tipo, idioma, nombre, codigo) => {
  const t = TEXTOS[idioma];
  const c = t[tipo];
  const asunto = c.asunto(codigo);
  const html = `<!doctype html><html lang="${idioma}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapar(asunto)}</title></head>
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
<tr><td style="padding:22px 32px 6px;" align="center">
<div style="display:inline-block;background:#f0fdfa;border:1px solid #99f6e4;border-radius:12px;padding:16px 28px;font-family:'Courier New',Courier,monospace;font-size:34px;font-weight:bold;letter-spacing:10px;color:#0f172a;">${escapar(codigo)}</div>
</td></tr>
<tr><td style="padding:16px 32px 0;font-size:12px;line-height:1.6;color:#64748b;">${escapar(t.caduca)} ${escapar(c.ignorar)}</td></tr>
<tr><td style="padding:24px 32px 28px;font-size:12px;color:#94a3b8;border-top:1px solid #e2e8f0;">${escapar(t.pie)}<br>FinanziApp · finanziapp.com</td></tr>
</table></td></tr></table></body></html>`;
  const texto = `${t.hola(nombre)}\n\n${c.texto}\n\n${codigo}\n\n${t.caduca} ${c.ignorar}\n\n${t.pie}\nFinanziApp · finanziapp.com`;
  return { asunto, html, texto };
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

// Límite de correos por destinatario: uno por minuto y seis al día, para que
// nadie use la app para llenar el buzón de otra persona. Se guarda en
// limites_correo/{clave}, colección que solo usa el servidor (las reglas de
// Firestore niegan todo lo que no esté listado).
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

// ─── Códigos de 6 cifras ─────────────────────────────────────────────────────
// Se guarda solo el hash (con sal) en codigos/{clave}, colección que solo usa
// el servidor. Caduca a los 15 minutos y admite 5 intentos; pedir uno nuevo
// sustituye al anterior.
const MINUTOS_CODIGO = 15;
const INTENTOS_CODIGO = 5;
const hashCodigo = (codigo, sal) => crypto.createHash('sha256').update(`${sal}:${codigo}`).digest('hex');

const crearCodigo = async (db, clave, datos) => {
  const codigo = String(crypto.randomInt(0, 1000000)).padStart(6, '0');
  const sal = crypto.randomBytes(16).toString('hex');
  await db.collection('codigos').doc(clave).set({ ...datos, hash: hashCodigo(codigo, sal), sal, expira: Date.now() + MINUTOS_CODIGO * 60000, intentos: 0, creado: Date.now() });
  return codigo;
};

// Devuelve { ok: true, datos } o { ok: false, motivo: 'caducado' | 'intentos' | 'incorrecto', restantes }.
const comprobarCodigo = async (db, clave, codigo) => {
  const ref = db.collection('codigos').doc(clave);
  return db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) return { ok: false, motivo: 'caducado' };
    const d = snap.data();
    if (d.expira < Date.now()) { tx.delete(ref); return { ok: false, motivo: 'caducado' }; }
    if (d.intentos >= INTENTOS_CODIGO) return { ok: false, motivo: 'intentos' };
    const limpio = String(codigo || '').replace(/\D/g, '');
    const esperado = Buffer.from(d.hash, 'hex');
    const recibido = Buffer.from(hashCodigo(limpio, d.sal), 'hex');
    if (limpio.length !== 6 || !crypto.timingSafeEqual(esperado, recibido)) {
      const usados = d.intentos + 1;
      tx.update(ref, { intentos: usados });
      const restantes = INTENTOS_CODIGO - usados;
      return { ok: false, motivo: restantes > 0 ? 'incorrecto' : 'intentos', restantes };
    }
    tx.delete(ref);
    return { ok: true, datos: d };
  });
};

module.exports = { idiomaValido, componer, enviarConBrevo, comprobarLimite, huella, crearCodigo, comprobarCodigo };
