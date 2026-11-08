// Lectura de Instagram y Facebook para el panel de redes (API Graph de Meta). Sin Firebase: se puede probar en local.
// Dos cuentas con personalidad propia: en = @finanziapp + página «FinanziApp» (EE. UU.), es = @finanziapp.es + «Finanziapp ES» (España).
'use strict';

const G = 'https://graph.facebook.com/v24.0';
const CUENTAS = {
  en: { nombre: '@finanziapp', pais: 'EE. UU.', ig: '17841480765193424', fb: '1341167292422940', zona: 'America/New_York' },
  es: { nombre: '@finanziapp.es', pais: 'España', ig: '17841411098796089', fb: '1408886742310396', zona: 'Europe/Madrid' }
};
const D = 86400;
const MET = {
  igCuenta: ['views', 'reach', 'accounts_engaged', 'total_interactions', 'likes', 'comments', 'shares', 'saves', 'profile_views', 'website_clicks', 'profile_links_taps', 'replies'],
  igReel: ['views', 'reach', 'saved', 'shares', 'likes', 'comments', 'total_interactions', 'ig_reels_avg_watch_time', 'ig_reels_video_view_total_time'],
  igFeed: ['views', 'reach', 'saved', 'shares', 'likes', 'comments', 'total_interactions', 'profile_visits', 'follows'],
  fbPagina: ['page_follows', 'page_daily_follows_unique', 'page_media_view', 'page_total_media_view_unique', 'page_post_engagements', 'page_video_views', 'page_views_total'],
  fbReel: ['blue_reels_play_count', 'fb_reels_total_plays', 'fb_reels_replay_count', 'post_video_avg_time_watched', 'post_video_view_time', 'post_video_social_actions',
    'post_video_retention_graph', 'post_video_followers', 'post_video_likes_by_reaction_type']
};

// Cliente de la API. token = null → sin access_token (en local lo pone el proxy del entorno).
function cliente(token) {
  const paginas = {};
  let llamadas = 0;
  async function pedir(ruta, params = {}, metodo = 'GET', tok = token) {
    llamadas++;
    const q = new URLSearchParams(params);
    if (tok) q.set('access_token', tok);
    const r = metodo === 'GET' ? await fetch(`${G}/${ruta}?${q}`) : await fetch(`${G}/${ruta}`, { method: metodo, body: q });
    const j = await r.json();
    if (j.error) { const e = new Error(j.error.error_user_msg || j.error.message); e.codigo = j.error.code; throw e; }
    return j;
  }
  async function tokenPagina(id) {
    if (!paginas[id]) paginas[id] = (await pedir(id, { fields: 'access_token' })).access_token;
    return paginas[id];
  }
  return { pedir, tokenPagina, llamadas: () => llamadas };
}

// Varias métricas en una llamada; si Meta rechaza alguna, se piden una a una para no perder las demás.
async function insights(cli, ruta, metricas, extra = {}, tok) {
  const out = {};
  const leer = (j) => {
    for (const d of j.data || []) {
      if (d.total_value) out[d.name] = d.total_value.value;
      else if (d.values && d.values.length === 1 && !d.values[0].end_time) out[d.name] = d.values[0].value;
      // end_time marca el final del día: la fecha del dato es la del día anterior.
      else if (d.values) out[d.name] = d.values.map(v => ({ fecha: v.end_time ? new Date(Date.parse(v.end_time) - 3600e3 * 12).toISOString().slice(0, 10) : '', valor: v.value }));
    }
  };
  try { leer(await cli.pedir(ruta, { metric: metricas.join(','), ...extra }, 'GET', tok)); }
  catch { for (const m of metricas) { try { leer(await cli.pedir(ruta, { metric: m, ...extra }, 'GET', tok)); } catch { /* métrica no disponible */ } } }
  return out;
}

// Duración de un MP4 leyendo la caja mvhd (sin ffprobe).
function duracionMp4(buf) {
  const moov = buf.indexOf('moov');
  const i = buf.indexOf('mvhd', moov >= 0 ? moov : 0);
  if (i < 4) return null;
  const v = buf[i + 4];
  const escala = v === 1 ? buf.readUInt32BE(i + 24) : buf.readUInt32BE(i + 16);
  const dur = v === 1 ? Number(buf.readBigUInt64BE(i + 28)) : buf.readUInt32BE(i + 20);
  return escala ? +(dur / escala).toFixed(2) : null;
}

// Meta devuelve unas fechas en segundos y otras en texto ISO.
const fechaMeta = (x) => { if (x == null || x === '') return null; const f = new Date(typeof x === 'number' || /^\d+$/.test(x) ? +x * 1000 : x); return isNaN(f) ? null : f.toISOString(); };
const codigoDe = (enlace) => ((enlace || '').match(/\/(?:reel|reels|p)\/([^/?]+)/) || [])[1] || null;
const primeraLinea = (t) => (t || '').split('\n')[0].trim();

// Qué vídeo nuestro es: por el registro de publicados o por el principio del texto.
function temaDe(config, plataforma, id, codigo, texto) {
  const reg = (config.publicados || {})[plataforma === 'ig' ? 'reels' : 'facebook'] || {};
  const slug = reg[plataforma === 'ig' ? codigo : id];
  if (slug) return slug;
  const t = primeraLinea(texto);
  const v = (config.videos || []).find(x => x.inicio && t.startsWith(x.inicio.slice(0, 40)));
  return v ? v.slug : null;
}

async function instagram(cli, c, config, cache, errores) {
  const ahora = Math.floor(Date.now() / 1000);
  const perfil = await cli.pedir(c.ig, { fields: 'username,name,followers_count,follows_count,media_count,profile_picture_url,biography,website' });
  const ventana = (desde, hasta) => insights(cli, `${c.ig}/insights`, MET.igCuenta, { metric_type: 'total_value', period: 'day', since: desde, until: hasta });
  const resumen = { d1: await ventana(ahora - D, ahora), d7: await ventana(ahora - 7 * D, ahora), d7prev: await ventana(ahora - 14 * D, ahora - 7 * D), d28: await ventana(ahora - 28 * D, ahora) };
  // Series diarias de 28 días (Instagram solo las da para el alcance; los seguidores, a partir de 100).
  const serie = await insights(cli, `${c.ig}/insights`, ['reach', 'follower_count'], { period: 'day', since: ahora - 28 * D, until: ahora });
  let cuota = null;
  try { const q = (await cli.pedir(`${c.ig}/content_publishing_limit`, { fields: 'config,quota_usage' })).data[0]; cuota = { usada: q.quota_usage, total: q.config.quota_total }; } catch (e) { errores.push('Cuota IG: ' + e.message); }

  const publicaciones = [], comentarios = [];
  let pag = await cli.pedir(`${c.ig}/media`, { fields: 'id,caption,media_type,media_product_type,timestamp,permalink,thumbnail_url,media_url,like_count,comments_count', limit: '50' });
  const media = [...pag.data];
  while (pag.paging && pag.paging.next && media.length < 150) { pag = await (await fetch(pag.paging.next)).json(); media.push(...(pag.data || [])); }
  for (const m of media) {
    const reel = m.media_product_type === 'REELS';
    const met = await insights(cli, `${m.id}/insights`, reel ? MET.igReel : MET.igFeed);
    let dur = cache.duraciones[m.id];
    if (reel && dur == null && m.media_url) {
      try { dur = duracionMp4(Buffer.from(await (await fetch(m.media_url)).arrayBuffer())); if (dur) cache.duraciones[m.id] = dur; } catch { /* sin duración */ }
    }
    const visto = met.ig_reels_avg_watch_time != null ? met.ig_reels_avg_watch_time / 1000 : null;
    const codigo = codigoDe(m.permalink);
    publicaciones.push({
      plataforma: 'ig', id: m.id, fecha: m.timestamp, tipo: reel ? 'Reel' : (m.media_type === 'CAROUSEL_ALBUM' ? 'Carrusel' : m.media_type === 'VIDEO' ? 'Vídeo' : 'Imagen'),
      tema: temaDe(config, 'ig', m.id, codigo, m.caption), texto: primeraLinea(m.caption).slice(0, 160), enlace: m.permalink, miniatura: m.thumbnail_url || (m.media_type === 'IMAGE' ? m.media_url : null),
      vistas: met.views ?? null, alcance: met.reach ?? null, megusta: met.likes ?? m.like_count ?? null, comentarios: met.comments ?? m.comments_count ?? null,
      guardados: met.saved ?? null, compartidos: met.shares ?? null, interacciones: met.total_interactions ?? null, visitas_perfil: met.profile_visits ?? null, seguidores: met.follows ?? null,
      visto_medio_s: visto != null ? +visto.toFixed(1) : null, duracion_s: dur ?? null, retencion: visto != null && dur ? Math.round(100 * visto / dur) : null,
      tiempo_total_h: met.ig_reels_video_view_total_time != null ? +(met.ig_reels_video_view_total_time / 3600000).toFixed(2) : null
    });
    if (m.comments_count > 0) {
      try {
        const cs = (await cli.pedir(`${m.id}/comments`, { fields: 'id,text,username,timestamp,like_count,hidden,replies{id,text,username,timestamp}', limit: '50' })).data;
        for (const x of cs) {
          const resp = ((x.replies && x.replies.data) || []).map(r => ({ autor: r.username, texto: r.text, fecha: r.timestamp, nuestra: r.username === perfil.username }));
          comentarios.push({ plataforma: 'ig', id: x.id, publicacion: { id: m.id, enlace: m.permalink, tema: temaDe(config, 'ig', m.id, codigo, m.caption) || primeraLinea(m.caption).slice(0, 60) },
            autor: x.username, texto: x.text, fecha: x.timestamp, megusta: x.like_count || 0, oculto: !!x.hidden, nuestro: x.username === perfil.username,
            respuestas: resp, respondido: resp.some(r => r.nuestra) });
        }
      } catch (e) { errores.push('Comentarios IG: ' + e.message); }
    }
  }
  return { perfil, resumen, serie, cuota, publicaciones, comentarios };
}

async function facebook(cli, c, config, errores) {
  const ahora = Math.floor(Date.now() / 1000);
  const pt = await cli.tokenPagina(c.fb);
  const perfil = await cli.pedir(c.fb, { fields: 'name,followers_count,fan_count,link,about,website' });
  const serie = await insights(cli, `${c.fb}/insights`, MET.fbPagina, { period: 'day', since: ahora - 28 * D, until: ahora }, pt);
  const vistos = new Set(), lista = [];
  try {
    const r = await cli.pedir(`${c.fb}/video_reels`, { fields: 'id,description,created_time,permalink_url,length,published,scheduled_publish_time', limit: '50' }, 'GET', pt);
    for (const v of r.data || []) { vistos.add(v.id); lista.push(v); }
  } catch (e) { errores.push('Reels FB: ' + e.message); }
  // Los programados no salen en la lista: se buscan por el registro de publicados.
  for (const id of Object.keys((config.publicados || {}).facebook || {})) {
    if (vistos.has(id)) continue;
    try { const v = await cli.pedir(id, { fields: 'id,description,created_time,permalink_url,length,published,scheduled_publish_time,from{id}' }, 'GET', pt);
      if (v.from && v.from.id === c.fb) lista.push(v); } catch { /* es de la otra página o ya no existe */ }
  }
  const publicaciones = [], comentarios = [], programados = [];
  for (const v of lista) {
    const enlace = v.permalink_url ? (v.permalink_url.startsWith('http') ? v.permalink_url : 'https://www.facebook.com' + v.permalink_url) : null;
    const tema = temaDe(config, 'fb', v.id, null, v.description);
    if (v.published === false) { programados.push({ id: v.id, tema, texto: primeraLinea(v.description).slice(0, 160), cuando: fechaMeta(v.scheduled_publish_time), enlace }); continue; }
    const met = await insights(cli, `${v.id}/video_insights`, MET.fbReel, {}, pt);
    // post_video_avg_time_watched viene en milisegundos.
    const visto = typeof met.post_video_avg_time_watched === 'number' && (met.blue_reels_play_count || met.fb_reels_total_plays) ? met.post_video_avg_time_watched / 1000 : null;
    const social = met.post_video_social_actions || {}, reacciones = met.post_video_likes_by_reaction_type || {};
    const curva = met.post_video_retention_graph && typeof met.post_video_retention_graph === 'object'
      ? Object.entries(met.post_video_retention_graph).map(([k, val]) => [+k, +val]).sort((a, b) => a[0] - b[0]) : [];
    publicaciones.push({
      plataforma: 'fb', id: v.id, fecha: v.created_time, tipo: 'Reel', tema, texto: primeraLinea(v.description).slice(0, 160), enlace,
      vistas: met.blue_reels_play_count ?? met.fb_reels_total_plays ?? null, repeticiones: met.fb_reels_replay_count ?? null,
      megusta: Object.values(reacciones).reduce((a, b) => a + (+b || 0), 0) || (social.LIKE ?? 0), comentarios: social.COMMENT ?? 0, compartidos: social.SHARE ?? 0,
      seguidores: met.post_video_followers ?? null, visto_medio_s: visto != null ? +visto.toFixed(1) : null, duracion_s: v.length ? +(+v.length).toFixed(1) : null,
      retencion: visto != null && v.length ? Math.round(100 * visto / v.length) : null, tiempo_total_h: met.post_video_view_time != null ? +(met.post_video_view_time / 3600000).toFixed(2) : null,
      curva
    });
    try {
      const cs = (await cli.pedir(`${v.id}/comments`, { fields: 'id,message,from{id,name},created_time,is_hidden,like_count,comments{id,message,from{id,name},created_time}', limit: '50' }, 'GET', pt)).data;
      for (const x of cs) {
        const resp = ((x.comments && x.comments.data) || []).map(r => ({ autor: r.from ? r.from.name : '—', texto: r.message, fecha: r.created_time, nuestra: !!(r.from && r.from.id === c.fb) }));
        comentarios.push({ plataforma: 'fb', id: x.id, publicacion: { id: v.id, enlace, tema: tema || primeraLinea(v.description).slice(0, 60) },
          autor: x.from ? x.from.name : 'Alguien', texto: x.message, fecha: x.created_time, megusta: x.like_count || 0, oculto: !!x.is_hidden,
          nuestro: !!(x.from && x.from.id === c.fb), respuestas: resp, respondido: resp.some(r => r.nuestra) });
      }
    } catch (e) { errores.push('Comentarios FB: ' + e.message); }
  }
  return { perfil, serie, publicaciones, programados, comentarios };
}

// Referentes: qué funciona en cuentas grandes (Business Discovery) y en hashtags, por cuenta.
async function referentes(cli, cuenta, conf, errores) {
  const yo = CUENTAS[cuenta].ig, gancho = (t) => primeraLinea(t).slice(0, 140);
  const cuentas = [], reels = [], hashtags = {};
  for (const u of conf.cuentas || []) {
    try {
      const b = (await cli.pedir(yo, { fields: `business_discovery.username(${u}){username,followers_count,media_count,media.limit(25){caption,like_count,comments_count,view_count,media_product_type,timestamp,permalink}}` })).business_discovery;
      const suyos = ((b.media && b.media.data) || []).filter(m => m.media_product_type === 'REELS' && m.view_count);
      cuentas.push({ usuario: b.username, seguidores: b.followers_count, reels: suyos.length, mediana_vistas: suyos.map(m => m.view_count).sort((a, z) => a - z)[Math.floor(suyos.length / 2)] || null });
      for (const m of suyos) reels.push({ usuario: b.username, seguidores: b.followers_count, fecha: m.timestamp.slice(0, 10), vistas: m.view_count, megusta: m.like_count, comentarios: m.comments_count,
        multiplicador: +(m.view_count / b.followers_count).toFixed(2), gancho: gancho(m.caption), enlace: m.permalink });
    } catch (e) { cuentas.push({ usuario: u, error: e.message.slice(0, 120) }); }
  }
  for (const tag of conf.hashtags || []) {
    try {
      const id = (await cli.pedir('ig_hashtag_search', { user_id: yo, q: tag })).data[0].id;
      const top = (await cli.pedir(`${id}/top_media`, { user_id: yo, fields: 'caption,like_count,comments_count,media_type,timestamp,permalink', limit: '30' })).data;
      hashtags[tag] = top.map(m => ({ fecha: m.timestamp.slice(0, 10), tipo: m.media_type, megusta: m.like_count, comentarios: m.comments_count, gancho: gancho(m.caption), enlace: m.permalink }))
        .sort((a, z) => (z.megusta + 5 * z.comentarios) - (a.megusta + 5 * a.comentarios)).slice(0, 15);
    } catch (e) { errores.push(`#${tag}: ${e.message.slice(0, 100)}`); }
  }
  reels.sort((a, z) => z.multiplicador - a.multiplicador);
  return { fecha: new Date().toISOString(), cuentas, reels: reels.slice(0, 60), hashtags };
}

async function estadoToken(cli, token) {
  if (!token) return null;
  try {
    const d = (await cli.pedir('debug_token', { input_token: token })).data;
    return { valido: d.is_valid, caduca: d.expires_at ? new Date(d.expires_at * 1000).toISOString() : 'nunca', permisos: d.scopes || [], tipo: d.type || null };
  } catch (e) { return { valido: false, error: e.message }; }
}

// Lo recoge todo. config: { publicados, videos, referentes: { en: {cuentas, hashtags}, es: {...} } }; cache: { duraciones }.
async function recoger(token, config, cache, { conReferentes = false } = {}) {
  const cli = cliente(token), inicio = Date.now(), errores = [], datos = {};
  for (const [k, c] of Object.entries(CUENTAS)) {
    const d = { cuenta: k, ...c, actualizado: new Date().toISOString() };
    try { d.ig = await instagram(cli, c, config, cache, errores); } catch (e) { errores.push(`Instagram ${c.nombre}: ${e.message}`); }
    try { d.fb = await facebook(cli, c, config, errores); } catch (e) { errores.push(`Facebook ${c.pais}: ${e.message}`); }
    if (conReferentes && config.referentes && config.referentes[k]) {
      try { d.referentes = await referentes(cli, k, config.referentes[k], errores); } catch (e) { errores.push(`Referentes ${k}: ${e.message}`); }
    }
    datos[k] = d;
  }
  const token_ = await estadoToken(cli, token);
  return { datos, estado: { ultima: new Date().toISOString(), duracion_s: Math.round((Date.now() - inicio) / 1000), llamadas: cli.llamadas(), ok: errores.length === 0, errores, token: token_ } };
}

// Historial: una foto al día de cada cuenta y, por publicación, sus reproducciones (por hora las primeras 72 h, luego por día).
function actualizarHistorial(hist, d) {
  hist = hist || { dias: {}, media: {} };
  const ahora = new Date(), dia = ahora.toISOString().slice(0, 10), hora = ahora.toISOString().slice(0, 13);
  const pubs = [...((d.ig && d.ig.publicaciones) || []), ...((d.fb && d.fb.publicaciones) || [])];
  const suma = (pl, k) => pubs.filter(p => p.plataforma === pl).reduce((a, p) => a + (+p[k] || 0), 0);
  hist.dias[dia] = {
    ig_seguidores: d.ig ? d.ig.perfil.followers_count : null, fb_seguidores: d.fb && d.fb.perfil ? (d.fb.perfil.followers_count ?? d.fb.perfil.fan_count ?? null) : null,
    ig_publicaciones: d.ig ? d.ig.perfil.media_count : null, ig_vistas: suma('ig', 'vistas'), ig_alcance: suma('ig', 'alcance'), ig_interacciones: suma('ig', 'interacciones'),
    fb_vistas: suma('fb', 'vistas'), ig_visitas_perfil_1d: d.ig ? d.ig.resumen.d1.profile_views ?? null : null
  };
  for (const p of pubs) {
    if (p.vistas == null) continue;
    const h = hist.media[p.id] = hist.media[p.id] || { plataforma: p.plataforma, fecha: p.fecha, puntos: {} };
    const edad = (ahora - new Date(p.fecha)) / 3600000;
    h.puntos[edad <= 72 ? hora : dia] = p.vistas;
  }
  // Recorte: 400 días.
  const limite = new Date(ahora - 400 * D * 1000).toISOString().slice(0, 10);
  for (const k of Object.keys(hist.dias)) if (k < limite) delete hist.dias[k];
  for (const [id, h] of Object.entries(hist.media)) if (h.fecha.slice(0, 10) < limite) delete hist.media[id];
  return hist;
}

module.exports = { CUENTAS, cliente, recoger, actualizarHistorial, duracionMp4, codigoDe };
