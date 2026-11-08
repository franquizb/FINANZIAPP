// Panel de redes de FinanziApp (franquizb.com), codebase «panel»:
// - panelActualizar: cada hora lee Instagram y Facebook de las dos cuentas y lo guarda en Firestore (colección estadisticas,
//   que solo puede leer el propietario según firestore.rules; aquí se escribe con el SDK de administración).
// - panelPublicar: cada 15 minutos publica en Instagram lo que toque de la cola (estadisticas/cola).
// - panelAccion: acciones desde el panel (actualizar ya, responder u ocultar comentarios, cancelar un vídeo de la cola,
//   editar el cuaderno y los referentes).
//   Solo el propietario.
// El token de Meta (usuario del sistema del negocio, no caduca) está en Secret Manager como META_TOKEN.
'use strict';
const { onSchedule } = require('firebase-functions/v2/scheduler');
const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { setGlobalOptions, logger } = require('firebase-functions/v2');
const { defineSecret } = require('firebase-functions/params');
const admin = require('firebase-admin');
const meta = require('./meta');

admin.initializeApp();
setGlobalOptions({ region: 'europe-west1', maxInstances: 1 });
const META_TOKEN = defineSecret('META_TOKEN');
const PROPIETARIO = 'lK7Y5eUYmSRAiXs2M1J7NyKPSQw2';   // el mismo que propietarioUid() en firestore.rules
const col = admin.firestore().collection('estadisticas');

const leerJson = async (doc, defecto) => {
  const s = await col.doc(doc).get();
  if (!s.exists || !s.get('json')) return defecto;
  try { return JSON.parse(s.get('json')); } catch { return defecto; }
};
const guardarJson = (doc, valor) => col.doc(doc).set({ json: JSON.stringify(valor), actualizado: Date.now() });

async function actualizar({ forzarReferentes = false } = {}) {
  const config = await leerJson('config', {});
  const cache = await leerJson('cache', { duraciones: {} });
  const previo = await leerJson('estado', {});
  const conReferentes = forzarReferentes || !previo.referentes || Date.now() - Date.parse(previo.referentes) > 20 * 3600e3;
  const { datos, estado } = await meta.recoger(META_TOKEN.value(), config, cache, { conReferentes });
  for (const [k, d] of Object.entries(datos)) {
    const antes = await leerJson(k, {});
    if (!d.referentes && antes.referentes) d.referentes = antes.referentes;   // se leen una vez al día
    // Si una plataforma falla, se conserva la última lectura buena (marcada como antigua).
    if (!d.ig && antes.ig) { d.ig = antes.ig; d.ig_antiguo = true; }
    if (!d.fb && antes.fb) { d.fb = antes.fb; d.fb_antiguo = true; }
    await guardarJson(k, d);
    await guardarJson('historial_' + k, meta.actualizarHistorial(await leerJson('historial_' + k, null), d));
  }
  await guardarJson('cache', cache);
  estado.referentes = conReferentes ? new Date().toISOString() : previo.referentes || null;
  await guardarJson('estado', estado);
  return estado;
}

// Cola de publicación de Instagram (estadisticas/cola): los vídeos esperan en el bucket privado finanziapp-publicar
// (se borran solos a las 24 h) y se publican cuando llega su hora. Facebook usa su propia programación.
const BUCKET = 'finanziapp-publicar';
async function publicarCola() {
  const cola = await leerJson('cola', { items: [] });
  let hechos = 0;
  for (const it of cola.items) {
    if (it.estado !== 'pendiente' || Date.parse(it.cuando) > Date.now() + 5 * 60e3) continue;
    it.estado = 'publicando'; it.intento = new Date().toISOString();
    await guardarJson('cola', cola);
    try {
      const [datos] = it.url ? [null] : await admin.storage().bucket(BUCKET).file(it.objeto).download();
      const r = await meta.publicarReelIg(META_TOKEN.value(), it, datos);
      if (r.ensayo) Object.assign(it, { estado: 'ensayo ok', hecho: new Date().toISOString() });
      else {
        Object.assign(it, { estado: 'publicado', hecho: new Date().toISOString(), enlace: r.permalink, media: r.id });
        // Se anota qué vídeo es, para que las estadísticas lo reconozcan.
        const codigo = meta.codigoDe(r.permalink);
        if (codigo && it.slug) {
          const config = await leerJson('config', {});
          config.publicados = config.publicados || {}; config.publicados.reels = config.publicados.reels || {};
          config.publicados.reels[codigo] = it.slug;
          await guardarJson('config', config);
        }
      }
      await admin.storage().bucket(BUCKET).file(it.objeto).delete().catch(() => {});
      logger.info('Cola: ' + it.estado, { id: it.id, cuenta: it.cuenta, enlace: it.enlace });
    } catch (e) {
      Object.assign(it, { estado: 'error', error: e.message });
      logger.error('Cola: error al publicar', { id: it.id, error: e.message });
    }
    hechos++;
    await guardarJson('cola', cola);
  }
  return hechos;
}

exports.panelPublicar = onSchedule({ schedule: 'every 15 minutes', timeZone: 'Europe/Madrid', secrets: [META_TOKEN], timeoutSeconds: 540, memory: '1GiB', retryCount: 0 }, async () => {
  const n = await publicarCola();
  if (n) await actualizar();   // que el panel lo enseñe enseguida
});

exports.panelActualizar = onSchedule({ schedule: 'every 60 minutes', timeZone: 'Europe/Madrid', secrets: [META_TOKEN], timeoutSeconds: 540, memory: '512MiB', retryCount: 0 }, async () => {
  const e = await actualizar();
  logger.info('Panel actualizado', { ok: e.ok, llamadas: e.llamadas, segundos: e.duracion_s, errores: e.errores });
});

const USUARIO = /^[a-z0-9._]{1,30}$/, HASHTAG = /^[\p{L}\p{N}_]{1,60}$/u;

exports.panelAccion = onCall({ secrets: [META_TOKEN], timeoutSeconds: 540, memory: '512MiB' }, async (req) => {
  if (!req.auth || req.auth.uid !== PROPIETARIO) throw new HttpsError('permission-denied', 'Solo el propietario puede usar el panel.');
  const p = req.data || {}, c = meta.CUENTAS[p.cuenta];
  const cli = meta.cliente(META_TOKEN.value());
  try {
    switch (p.accion) {
      case 'actualizar':
        return { estado: await actualizar({ forzarReferentes: !!p.referentes }) };

      case 'responder':
      case 'ocultar': {
        if (!c || !['ig', 'fb'].includes(p.plataforma) || typeof p.id !== 'string') throw new HttpsError('invalid-argument', 'Faltan datos.');
        // Solo comentarios de nuestras publicaciones (los que ya están en el panel).
        const d = await leerJson(p.cuenta, {});
        const lista = ((d[p.plataforma] || {}).comentarios) || [];
        const com = lista.find(x => x.id === p.id);
        if (!com) throw new HttpsError('not-found', 'Ese comentario no está en el panel. Actualiza y vuelve a probar.');
        if (p.accion === 'responder') {
          const texto = String(p.texto || '').trim();
          if (!texto || texto.length > 2000) throw new HttpsError('invalid-argument', 'La respuesta está vacía o es demasiado larga.');
          const r = p.plataforma === 'ig'
            ? await cli.pedir(`${p.id}/replies`, { message: texto }, 'POST')
            : await cli.pedir(`${p.id}/comments`, { message: texto }, 'POST', await cli.tokenPagina(c.fb));
          com.respuestas = [...(com.respuestas || []), { autor: p.plataforma === 'ig' ? c.nombre.slice(1) : (d.fb && d.fb.perfil && d.fb.perfil.name) || 'FinanziApp', texto, fecha: new Date().toISOString(), nuestra: true, id: r.id }];
          com.respondido = true;
        } else {
          const ocultar = !!p.ocultar;
          if (p.plataforma === 'ig') await cli.pedir(p.id, { hide: String(ocultar) }, 'POST');
          else await cli.pedir(p.id, { is_hidden: String(ocultar) }, 'POST', await cli.tokenPagina(c.fb));
          com.oculto = ocultar;
        }
        await guardarJson(p.cuenta, d);
        return { ok: true, comentario: com };
      }

      case 'cancelarCola': {
        const cola = await leerJson('cola', { items: [] });
        const it = cola.items.find(x => x.id === p.id);
        if (!it || it.estado !== 'pendiente') throw new HttpsError('failed-precondition', 'Ese vídeo ya no está pendiente.');
        it.estado = 'cancelado'; it.hecho = new Date().toISOString();
        await admin.storage().bucket(BUCKET).file(it.objeto).delete().catch(() => {});
        await guardarJson('cola', cola);
        return { ok: true };
      }

      case 'cuaderno': {
        const cu = p.cuaderno;
        const ok = cu && typeof cu === 'object' && cu.cuentas && ['en', 'es'].every(k => cu.cuentas[k] && Array.isArray(cu.cuentas[k].proximos) && Array.isArray(cu.cuentas[k].pendientes));
        if (!ok || JSON.stringify(cu).length > 300000) throw new HttpsError('invalid-argument', 'El cuaderno no tiene el formato esperado.');
        await guardarJson('cuaderno', cu);
        return { ok: true };
      }

      case 'referentes': {
        if (!c) throw new HttpsError('invalid-argument', 'Falta la cuenta.');
        const cuentas = [...new Set((p.cuentas || []).map(u => String(u).trim().replace(/^@/, '').toLowerCase()).filter(u => USUARIO.test(u)))].slice(0, 20);
        // Meta deja consultar 30 hashtags distintos por semana: como mucho 8 por cuenta.
        const hashtags = [...new Set((p.hashtags || []).map(h => String(h).trim().replace(/^#/, '').toLowerCase()).filter(h => HASHTAG.test(h)))].slice(0, 8);
        const config = await leerJson('config', {});
        config.referentes = { ...(config.referentes || {}), [p.cuenta]: { cuentas, hashtags } };
        await guardarJson('config', config);
        return { ok: true, referentes: config.referentes[p.cuenta] };
      }

      default:
        throw new HttpsError('invalid-argument', 'Acción desconocida.');
    }
  } catch (e) {
    if (e instanceof HttpsError) throw e;
    logger.error('Acción del panel', { accion: p.accion, error: e.message });
    throw new HttpsError('failed-precondition', 'Meta ha respondido: ' + e.message);
  }
});
