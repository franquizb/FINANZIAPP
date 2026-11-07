// ─── FinanziApp · Cloud Functions · Suscripciones con Stripe ─────────────────
//
// Flujo:
//   1. El usuario se registra y la app le da 15 días de prueba (trialEndsAt).
//   2. Desde la app pulsa "Activar suscripción" → crearSesionCheckout crea una
//      sesión de Stripe Checkout y la app redirige a Stripe. Si todavía está en
//      prueba, Stripe no cobra hasta que la prueba termine.
//   3. Stripe avisa por webhook (stripeWebhook) de cada cambio de la suscripción
//      y aquí se escribe en users/{uid}: paidUntil, plan, stripeStatus...
//      Las reglas de Firestore ya usan paidUntil para permitir escribir, y el
//      cliente nunca puede modificar esos campos.
//   4. crearPortalCliente abre el portal de Stripe (cambiar tarjeta, facturas,
//      cancelar). resumenStripe devuelve al administrador el estado de todas las
//      suscripciones.
//
// Configuración (ver STRIPE.md): secretos STRIPE_SECRET_KEY y
// STRIPE_WEBHOOK_SECRET; parámetros STRIPE_PRICE_ID y APP_URL (functions/.env).

const { onCall, onRequest, HttpsError } = require('firebase-functions/v2/https');
const { setGlobalOptions } = require('firebase-functions/v2');
const { defineSecret, defineString } = require('firebase-functions/params');
const logger = require('firebase-functions/logger');
const admin = require('firebase-admin');
const Stripe = require('stripe');

admin.initializeApp();
const db = admin.firestore();

// Misma región que usa el cliente (src/suscripcion.js → REGION_FUNCIONES).
setGlobalOptions({ region: 'europe-west1', maxInstances: 10 });

const STRIPE_SECRET_KEY = defineSecret('STRIPE_SECRET_KEY');
const STRIPE_WEBHOOK_SECRET = defineSecret('STRIPE_WEBHOOK_SECRET');
const STRIPE_PRICE_ID = defineString('STRIPE_PRICE_ID');
const APP_URL = defineString('APP_URL', { default: 'https://personal-franquizb.web.app' });
// Configuración del portal de cliente creada por API (bpc_…). Vacío = la
// configuración por defecto que se guarda en el panel de Stripe.
const STRIPE_PORTAL_CONFIG = defineString('STRIPE_PORTAL_CONFIG', { default: '' });
const configPortal = () => (STRIPE_PORTAL_CONFIG.value() ? { configuration: STRIPE_PORTAL_CONFIG.value() } : {});

// Dominios desde los que se usa la app. Stripe vuelve al MISMO dominio desde el
// que se pagó (la app lo envía en `origen`): la sesión de Firebase Auth es
// distinta en cada dominio y, si volviera a otro, el usuario aterrizaría sin
// sesión. Si el origen no está en la lista se usa APP_URL.
const ORIGENES_PERMITIDOS = [
  'https://finanziapp.com',
  'https://www.finanziapp.com',
  'https://finanzas.franquizb.com',
  'https://personal-franquizb.web.app',
  'https://personal-franquizb.firebaseapp.com'
];
const urlApp = (req) => {
  const o = typeof req?.data?.origen === 'string' ? req.data.origen.trim().replace(/\/+$/, '') : '';
  if (ORIGENES_PERMITIDOS.includes(o) || /^http:\/\/localhost(:\d+)?$/.test(o)) return o;
  return APP_URL.value();
};

// Días de margen tras el fin del periodo pagado (reintentos de cobro de Stripe).
const DIAS_GRACIA = 3;
const ESTADOS_ACTIVOS = ['active', 'trialing'];

const stripeCliente = () => new Stripe(STRIPE_SECRET_KEY.value());

const usuarioAutenticado = (req) => {
  if (!req.auth?.uid) throw new HttpsError('unauthenticated', 'Inicia sesión para continuar.');
  return req.auth.uid;
};

const esAdmin = async (uid) => {
  const snap = await db.collection('users').doc(uid).get();
  return snap.exists && snap.data().isAdmin === true;
};

// Fin del periodo pagado. En las versiones recientes de la API de Stripe
// current_period_end vive en cada item de la suscripción.
const finPeriodoMs = (sub) => {
  const seg = sub.current_period_end || sub.items?.data?.[0]?.current_period_end || 0;
  return seg * 1000;
};

const uidPorCliente = async (customerId) => {
  if (!customerId) return null;
  const q = await db.collection('users').where('stripeCustomerId', '==', customerId).limit(1).get();
  return q.empty ? null : q.docs[0].id;
};

// Escribe en users/{uid} lo que la suscripción de Stripe implica para la app.
const sincronizarSuscripcion = async (sub, uidPista) => {
  const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer?.id;
  const uid = sub.metadata?.uid || uidPista || (await uidPorCliente(customerId));
  if (!uid) { logger.warn('Suscripción sin usuario asociado', { subscription: sub.id, customer: customerId }); return null; }

  const activa = ESTADOS_ACTIVOS.includes(sub.status);
  const finPeriodo = finPeriodoMs(sub);
  const datos = {
    stripeCustomerId: customerId || null,
    stripeSubscriptionId: sub.id,
    stripeStatus: sub.status,
    cancelAtPeriodEnd: sub.cancel_at_period_end === true,
    lastUpdated: Date.now()
  };
  if (activa) {
    datos.plan = 'pro';
    datos.paidUntil = finPeriodo + DIAS_GRACIA * 86400000;
  } else if (sub.status === 'past_due') {
    // Cobro fallido: conserva el periodo ya pagado (más la gracia) mientras Stripe reintenta.
    datos.plan = 'impago';
    datos.paidUntil = finPeriodo + DIAS_GRACIA * 86400000;
  } else if (sub.status === 'canceled') {
    datos.plan = 'cancelado';
    datos.paidUntil = finPeriodo; // lo pagado se respeta hasta el fin del periodo
  } else {
    // unpaid, incomplete, incomplete_expired, paused
    datos.plan = 'cancelado';
    datos.paidUntil = 0;
  }
  await db.collection('users').doc(uid).set(datos, { merge: true });
  logger.info('Suscripción sincronizada', { uid, subscription: sub.id, status: sub.status, paidUntil: datos.paidUntil });
  return uid;
};

// ─── Checkout ────────────────────────────────────────────────────────────────
exports.crearSesionCheckout = onCall({ secrets: [STRIPE_SECRET_KEY] }, async (req) => {
  const uid = usuarioAutenticado(req);
  const stripe = stripeCliente();
  const ref = db.collection('users').doc(uid);
  const u = (await ref.get()).data() || {};
  if (u.bloqueado === true) throw new HttpsError('permission-denied', 'La cuenta está bloqueada.');

  // Lanzamiento de los pagos (Gestión → Stripe, documento ajustes/pagos): con
  // los pagos cerrados solo pueden suscribirse los probadores. Es la misma
  // regla que aplica la app, pero aquí no se puede saltar.
  const pagos = (await db.collection('ajustes').doc('pagos').get()).data() || {};
  const correo = String(req.auth.token.email || u.email || '').toLowerCase();
  const probadores = Array.isArray(pagos.probadores) ? pagos.probadores.map(c => String(c).toLowerCase()) : [];
  if (pagos.abierto !== true && !probadores.includes(correo)) {
    throw new HttpsError('failed-precondition', 'Los pagos todavía no están abiertos.');
  }

  // Un cliente guardado que no existe en este modo de Stripe (p. ej. creado en
  // el entorno de prueba antes de pasar a real) se descarta y se crea otro.
  let customerId = u.stripeCustomerId;
  if (customerId) {
    const existe = await stripe.customers.retrieve(customerId)
      .then(c => !c.deleted)
      .catch(e => { if (e?.code === 'resource_missing') return false; throw e; });
    if (!existe) {
      logger.warn('Cliente de Stripe inexistente en este modo; se crea uno nuevo', { uid });
      customerId = null;
      await ref.set({ stripeCustomerId: null, stripeSubscriptionId: null, stripeStatus: null, cancelAtPeriodEnd: false }, { merge: true });
      Object.assign(u, { stripeSubscriptionId: null, stripeStatus: null });
    }
  }
  if (!customerId) {
    const cliente = await stripe.customers.create({
      email: req.auth.token.email || u.email || undefined,
      name: u.displayName || undefined,
      metadata: { uid }
    });
    customerId = cliente.id;
    await ref.set({ stripeCustomerId: customerId }, { merge: true });
  }

  // Si ya tiene una suscripción viva, lo que toca es gestionarla, no crear otra.
  if (u.stripeSubscriptionId && ['active', 'trialing', 'past_due'].includes(u.stripeStatus)) {
    const portal = await stripe.billingPortal.sessions.create({ customer: customerId, return_url: `${urlApp(req)}/settings`, ...configPortal() });
    return { url: portal.url, portal: true };
  }

  const subscriptionData = { metadata: { uid } };
  // Prueba de la app todavía vigente: Stripe no cobra hasta que acabe (mínimo 48 h de margen que exige Stripe).
  const trialEndsAt = Number(u.trialEndsAt) || 0;
  if (trialEndsAt > Date.now() + 48 * 3600 * 1000) subscriptionData.trial_end = Math.floor(trialEndsAt / 1000);

  const locale = typeof req.data?.locale === 'string' && ['es', 'en', 'de', 'fr', 'zh'].includes(req.data.locale) ? req.data.locale : 'auto';
  const sesion = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    client_reference_id: uid,
    line_items: [{ price: STRIPE_PRICE_ID.value(), quantity: 1 }],
    subscription_data: subscriptionData,
    allow_promotion_codes: true,
    locale,
    success_url: `${urlApp(req)}/settings?pago=ok`,
    cancel_url: `${urlApp(req)}/settings?pago=cancelado`,
    metadata: { uid }
  });
  return { url: sesion.url, portal: false };
});

// ─── Portal de cliente ───────────────────────────────────────────────────────
// Baja (o reactivación) desde la propia app, con doble confirmación en la
// interfaz: la suscripción deja de renovarse al final del periodo pagado (o de
// la prueba) y el acceso se mantiene hasta entonces. Reactivar deshace la baja
// mientras el periodo siga vigente.
const MOTIVOS_BAJA = ['too_expensive', 'missing_features', 'switched_service', 'unused', 'other'];
exports.cambiarRenovacion = onCall({ secrets: [STRIPE_SECRET_KEY] }, async (req) => {
  const uid = usuarioAutenticado(req);
  const u = (await db.collection('users').doc(uid).get()).data() || {};
  if (!u.stripeSubscriptionId || !u.stripeCustomerId) throw new HttpsError('failed-precondition', 'No tienes una suscripción activa.');
  const stripe = stripeCliente();
  const actual = await stripe.subscriptions.retrieve(u.stripeSubscriptionId);
  const cliente = typeof actual.customer === 'string' ? actual.customer : actual.customer?.id;
  if (cliente !== u.stripeCustomerId) throw new HttpsError('permission-denied', 'La suscripción no es de esta cuenta.');
  if (!['active', 'trialing', 'past_due'].includes(actual.status)) throw new HttpsError('failed-precondition', 'La suscripción ya no está activa.');
  const cancelar = req.data?.cancelar === true;
  const motivo = MOTIVOS_BAJA.includes(req.data?.motivo) ? req.data.motivo : undefined;
  const sub = await stripe.subscriptions.update(actual.id, {
    cancel_at_period_end: cancelar,
    ...(cancelar && motivo ? { cancellation_details: { feedback: motivo } } : {})
  });
  await sincronizarSuscripcion(sub, uid);
  logger.info(cancelar ? 'Baja programada desde la app' : 'Suscripción reactivada desde la app', { uid, subscription: sub.id, motivo: motivo || null });
  return { cancelaAlFinal: sub.cancel_at_period_end === true, finPeriodo: finPeriodoMs(sub) };
});

exports.crearPortalCliente = onCall({ secrets: [STRIPE_SECRET_KEY] }, async (req) => {
  const uid = usuarioAutenticado(req);
  const u = (await db.collection('users').doc(uid).get()).data() || {};
  if (!u.stripeCustomerId) throw new HttpsError('failed-precondition', 'Todavía no tienes una suscripción.');
  const portal = await stripeCliente().billingPortal.sessions.create({ customer: u.stripeCustomerId, return_url: `${urlApp(req)}/settings`, ...configPortal() });
  return { url: portal.url };
});

// ─── Webhook ─────────────────────────────────────────────────────────────────
exports.stripeWebhook = onRequest({ secrets: [STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET], cors: false }, async (req, res) => {
  if (req.method !== 'POST') { res.status(405).send('Method not allowed'); return; }
  const stripe = stripeCliente();
  let evento;
  try {
    evento = stripe.webhooks.constructEvent(req.rawBody, req.headers['stripe-signature'], STRIPE_WEBHOOK_SECRET.value());
  } catch (e) {
    logger.warn('Firma del webhook inválida', { error: e.message });
    res.status(400).send(`Firma inválida: ${e.message}`);
    return;
  }

  // Idempotencia: Stripe puede reenviar el mismo evento.
  const registro = db.collection('eventos_stripe').doc(evento.id);
  if ((await registro.get()).exists) { res.json({ received: true, duplicado: true }); return; }

  try {
    let uid = null;
    const obj = evento.data.object;
    switch (evento.type) {
      case 'checkout.session.completed':
        if (obj.subscription) uid = await sincronizarSuscripcion(await stripe.subscriptions.retrieve(obj.subscription), obj.client_reference_id);
        break;
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
      case 'customer.subscription.paused':
      case 'customer.subscription.resumed':
        uid = await sincronizarSuscripcion(obj);
        break;
      case 'invoice.paid':
      case 'invoice.payment_failed': {
        const subId = typeof obj.subscription === 'string' ? obj.subscription : obj.subscription?.id;
        if (subId) uid = await sincronizarSuscripcion(await stripe.subscriptions.retrieve(subId));
        break;
      }
      default:
        break;
    }
    await registro.set({
      tipo: evento.type,
      creado: evento.created * 1000,
      procesado: Date.now(),
      uid: uid || null,
      modoPrueba: evento.livemode !== true,
      objeto: obj.id || null
    });
    res.json({ received: true });
  } catch (e) {
    logger.error('Error procesando el evento de Stripe', { id: evento.id, type: evento.type, error: e.message });
    res.status(500).send('Error procesando el evento');
  }
});

// ─── Resumen para el panel de gestión (solo administradores) ─────────────────
exports.resumenStripe = onCall({ secrets: [STRIPE_SECRET_KEY] }, async (req) => {
  const uid = usuarioAutenticado(req);
  if (!(await esAdmin(uid))) throw new HttpsError('permission-denied', 'Solo para administradores.');
  const stripe = stripeCliente();
  const clave = STRIPE_SECRET_KEY.value();

  const suscripciones = [];
  let mrr = 0, activas = 0;
  for await (const s of stripe.subscriptions.list({ status: 'all', limit: 100, expand: ['data.customer', 'data.items.data.price'] })) {
    const precio = s.items?.data?.[0]?.price;
    const importe = precio?.unit_amount != null ? precio.unit_amount / 100 : null;
    const intervalo = precio?.recurring?.interval || null;
    const viva = ESTADOS_ACTIVOS.includes(s.status);
    if (viva && importe != null) {
      activas++;
      mrr += intervalo === 'year' ? importe / 12 : intervalo === 'week' ? importe * 52 / 12 : importe;
    }
    suscripciones.push({
      id: s.id,
      estado: s.status,
      email: typeof s.customer === 'object' ? s.customer?.email || null : null,
      uid: s.metadata?.uid || null,
      importe,
      moneda: precio?.currency || null,
      intervalo,
      renueva: finPeriodoMs(s) || null,
      cancelaAlFinal: s.cancel_at_period_end === true,
      canceladaEn: s.canceled_at ? s.canceled_at * 1000 : null,
      creada: s.created * 1000
    });
  }
  suscripciones.sort((a, b) => b.creada - a.creada);
  return { modoPrueba: clave.startsWith('sk_test'), activas, mrr: Math.round(mrr * 100) / 100, suscripciones, consultado: Date.now() };
});
