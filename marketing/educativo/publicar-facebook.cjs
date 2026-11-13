// Publica un Reel en una página de Facebook con la API Graph de Meta: «FinanziApp» (en, EE. UU.) o «Finanziapp ES» (es, España).
// SOLO se usa cuando el propietario pide publicar algo concreto en una página concreta.
//
// El vídeo se sube directamente a Facebook (no hace falta el bucket). Sin --publicar hace un ENSAYO: lo sube como borrador,
// espera a que Facebook lo procese y lo borra, sin que nadie lo vea.
// Con --programar <fecha ISO> Facebook lo publica solo a esa hora (entre 10 minutos y 30 días desde ahora): sirve para
// publicar los de EE. UU. por la tarde de allí.
//
// Uso: node publicar-facebook.cjs es|en <video.mp4> <texto.txt> [--publicar] [--programar 2026-11-09T00:30:00Z]
// El token del usuario del sistema lo inyecta el proxy del entorno en graph.facebook.com (no está en el código). De él se
// saca en memoria el token de la página, que Facebook exige para los Reels; no se guarda ni se muestra.
const fs = require('fs'), path = require('path');
if (process.env.HTTPS_PROXY && !process.env.NODE_USE_ENV_PROXY) {
  const r = require('child_process').spawnSync(process.execPath, ['--no-warnings', ...process.argv.slice(1)], { stdio: 'inherit', env: { ...process.env, NODE_USE_ENV_PROXY: '1' } });
  process.exit(r.status);
}

const G = 'https://graph.facebook.com/v23.0';
const PAGINA = { en: '1341167292422940', es: '1408886742310396' };   // FinanziApp, Finanziapp ES
const [, , idioma, video, textoArchivo] = process.argv;
const op = (n) => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : null; };
const publicar = process.argv.includes('--publicar'), programar = op('--programar');
const pagina = PAGINA[idioma];
if (!pagina || (!op('--borrar-programado') && (!video || !textoArchivo))) { console.error('Uso: node publicar-facebook.cjs es|en <video.mp4> <texto.txt> [--publicar] [--programar fecha]'); process.exit(1); }

let pt = null;   // token de la página (solo en memoria)
const fb = async (ruta, params = {}, metodo = 'GET') => {
  const q = new URLSearchParams({ ...params, ...(pt ? { access_token: pt } : {}) });
  const r = metodo === 'GET' ? await fetch(`${G}/${ruta}?${q}`) : await fetch(`${G}/${ruta}`, { method: metodo, body: q });
  const j = await r.json(); if (j.error) throw new Error(j.error.error_user_msg || j.error.message); return j;
};

// --borrar-programado <slug>: quita de la página los Reels de ese vídeo que estén programados y aún sin publicar
// (para reemplazarlos o cambiarles la hora). Nunca toca uno ya publicado.
if (op('--borrar-programado')) {
  (async () => {
    const slug = op('--borrar-programado'), reg = path.join(__dirname, 'publicados.json'), j = JSON.parse(fs.readFileSync(reg, 'utf8'));
    pt = (await fb(pagina, { fields: 'access_token' })).access_token;
    let n = 0;
    for (const [id, s] of Object.entries(j.facebook || {})) {
      if (s !== slug) continue;
      let v; try { v = await fb(id, { fields: 'published,from{id}' }); } catch { continue; }   // de la otra página o ya no existe
      if (!v.from || v.from.id !== pagina || v.published !== false) continue;
      await fb(id, {}, 'DELETE'); delete j.facebook[id]; n++;
    }
    fs.writeFileSync(reg, JSON.stringify(j, null, 2) + '\n');
    console.log(`✓ Facebook (${idioma}): ${n} programado(s) de «${slug}» retirado(s)`);
  })().catch(e => { console.error('error:', e.message); process.exit(1); });
  return;
}

(async () => {
  let cuando = null;
  if (programar) {
    cuando = Math.floor(new Date(programar).getTime() / 1000);
    const falta = cuando - Date.now() / 1000;
    if (!(falta > 600 && falta < 30 * 86400)) throw new Error('--programar tiene que estar entre 10 minutos y 30 días desde ahora');
  }
  const texto = require('./etiquetas.cjs').variar(fs.readFileSync(textoArchivo, 'utf8').trim(), idioma), datos = fs.readFileSync(video);
  const p = await fb(pagina, { fields: 'name,access_token' });
  pt = p.access_token;

  // 1) Reservar el vídeo, 2) subir el archivo, 3) cerrar con el texto y el estado (borrador, publicado o programado).
  const { video_id, upload_url } = await fb(`${pagina}/video_reels`, { upload_phase: 'start' }, 'POST');
  const r = await fetch(upload_url, { method: 'POST', headers: { Authorization: `OAuth ${pt}`, offset: '0', file_size: String(datos.length), 'Content-Type': 'application/octet-stream' }, body: datos });
  const sub = await r.json(); if (!sub.success) throw new Error('Facebook no acepta el archivo: ' + JSON.stringify(sub.debug_info || sub));
  const estado = !publicar ? 'DRAFT' : cuando ? 'SCHEDULED' : 'PUBLISHED';
  await fb(`${pagina}/video_reels`, { upload_phase: 'finish', video_id, video_state: estado, description: texto, ...(cuando ? { scheduled_publish_time: String(cuando) } : {}) }, 'POST');

  // Esperar a que Facebook lo procese.
  let s;
  for (let i = 0; i < 90; i++) {
    s = (await fb(video_id, { fields: 'status' })).status;
    const fases = [s.uploading_phase, s.processing_phase].map(f => f && f.status);
    if (s.video_status === 'error' || fases.includes('error')) throw new Error('Facebook no ha podido procesar el vídeo: ' + JSON.stringify(s));
    if (fases.every(f => f === 'complete')) break;
    await new Promise(ok => setTimeout(ok, 5000));
  }

  // Portada diseñada (portada.js), si existe: la miniatura que se ve en la página y en las listas de Reels.
  const portada = path.join(path.dirname(path.resolve(video)), 'portada-diseno.jpg');
  let conPortada = false;
  if (fs.existsSync(portada) && !process.argv.includes('--sin-portada')) {
    try {
      const f = new FormData();
      f.append('source', new Blob([fs.readFileSync(portada)], { type: 'image/jpeg' }), 'portada.jpg');
      f.append('is_preferred', 'true'); f.append('access_token', pt);
      const rp = await fetch(`${G}/${video_id}/thumbnails`, { method: 'POST', body: f });
      const jp = await rp.json().catch(() => ({}));
      conPortada = !!jp.success; if (!conPortada) console.log('· Facebook no acepta la portada: ' + JSON.stringify(jp.error || jp).slice(0, 200));
    } catch (e) { console.log('· portada de Facebook: ' + e.message); }
  }

  if (!publicar) {
    await fb(video_id, {}, 'DELETE');
    console.log(`✓ ENSAYO: «${p.name.trim()}» acepta el Reel${conPortada ? ' y su portada' : ''} (subido como borrador, procesado y borrado). No se ha publicado nada (añade --publicar).`);
    return;
  }
  const info = await fb(video_id, { fields: 'permalink_url' });
  const enlace = info.permalink_url ? (info.permalink_url.startsWith('http') ? info.permalink_url : 'https://www.facebook.com' + info.permalink_url) : `https://www.facebook.com/${pagina}`;
  console.log(cuando ? `✓ Programado en «${p.name.trim()}» para ${new Date(cuando * 1000).toISOString()}: ${enlace}` : `✓ Publicado en «${p.name.trim()}»: ${enlace}`);

  // Anota qué vídeo es (out-reels/<slug>/<idioma>/reel.mp4) para las estadísticas de Facebook.
  const reg = path.join(__dirname, 'publicados.json'), j = JSON.parse(fs.readFileSync(reg, 'utf8'));
  (j.facebook = j.facebook || {})[video_id] = path.basename(path.dirname(path.dirname(path.resolve(video))));
  fs.writeFileSync(reg, JSON.stringify(j, null, 2) + '\n');
})().catch(e => { console.error('error:', e.message); process.exit(1); });
