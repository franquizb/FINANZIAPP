// Estadísticas de Instagram (@finanziapp y @finanziapp.es) con la API Graph de Meta.
// El token NO está en el código: lo inyecta el proxy del entorno en las peticiones a graph.facebook.com
// (guardado con el formulario seguro). Solo lee datos; no publica ni cambia nada.
//
// Uso: node estadisticas-instagram.cjs [--json salida.json]
// Para cada publicación: reproducciones, alcance, guardados, compartidos, me gusta, comentarios y, en los
// Reels, el tiempo medio de visualización. Si el Reel es nuestro (su texto coincide con un texto.txt de
// out-reels/), calcula la retención media: tiempo medio visto / duración del vídeo.
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');

// fetch de Node solo usa el proxy (que es quien añade el token) con NODE_USE_ENV_PROXY=1.
if (process.env.HTTPS_PROXY && !process.env.NODE_USE_ENV_PROXY) {
  const r = require('child_process').spawnSync(process.execPath, ['--no-warnings', ...process.argv.slice(1)], { stdio: 'inherit', env: { ...process.env, NODE_USE_ENV_PROXY: '1' } });
  process.exit(r.status);
}

const G = 'https://graph.facebook.com/v23.0';
const CUENTAS = { '17841480765193424': 'finanziapp (EN)', '17841411098796089': 'finanziapp.es (ES)' };
const METRICAS = {
  REELS: ['views', 'reach', 'saved', 'shares', 'likes', 'comments', 'total_interactions', 'ig_reels_avg_watch_time', 'ig_reels_video_view_total_time'],
  FEED: ['views', 'reach', 'saved', 'shares', 'likes', 'comments', 'total_interactions', 'profile_visits', 'follows']
};

const pedir = async (url) => {
  const r = await fetch(url);
  const j = await r.json();
  if (j.error) throw new Error(j.error.message);
  return j;
};

// Nuestros vídeos: primera línea del texto → { slug, idioma, duración }.
function nuestrosReels() {
  const base = path.join(__dirname, 'out-reels'), mapa = [];
  if (!fs.existsSync(base)) return mapa;
  for (const slug of fs.readdirSync(base)) for (const lang of ['en', 'es']) {
    const dir = path.join(base, slug, lang), txt = path.join(dir, 'texto.txt'), mp4 = path.join(dir, 'reel.mp4');
    if (!fs.existsSync(txt) || !fs.existsSync(mp4)) continue;
    const dur = +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', mp4]).toString().trim();
    mapa.push({ slug, lang, dur, inicio: fs.readFileSync(txt, 'utf8').split('\n')[0].slice(0, 40) });
  }
  return mapa;
}

(async () => {
  const propios = nuestrosReels(), filas = [];
  for (const [id, nombre] of Object.entries(CUENTAS)) {
    const cuenta = await pedir(`${G}/${id}?fields=username,followers_count,media_count`);
    let url = `${G}/${id}/media?fields=id,caption,media_type,media_product_type,timestamp,permalink,media_url,thumbnail_url&limit=50`;
    while (url) {
      const pag = await pedir(url);
      for (const m of pag.data) {
        const tipo = m.media_product_type === 'REELS' ? 'REELS' : 'FEED';
        const datos = {};
        // Una petición por métrica: si alguna no existe para ese tipo, no se pierden las demás.
        for (const met of METRICAS[tipo]) {
          try { datos[met] = (await pedir(`${G}/${m.id}/insights?metric=${met}`)).data[0].values[0].value; } catch { /* métrica no disponible */ }
        }
        // ¿Es uno de nuestros vídeos? Por el texto o, si se publicó sin texto, por la duración del vídeo.
        let nuestro = propios.find(p => (m.caption || '').startsWith(p.inicio));
        let durPublicado = null;
        if (tipo === 'REELS' && m.media_url) {
          try {
            const tmp = path.join(require('os').tmpdir(), `ig-${m.id}.mp4`);
            if (!fs.existsSync(tmp)) fs.writeFileSync(tmp, Buffer.from(await (await fetch(m.media_url)).arrayBuffer()));
            durPublicado = +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', tmp]).toString().trim();
          } catch { /* sin duración */ }
        }
        if (!nuestro && durPublicado) {
          const lang = nombre.includes('ES') ? 'es' : 'en';
          const cerca = propios.filter(p => p.lang === lang).map(p => ({ p, d: Math.abs(p.dur - durPublicado) })).sort((a, b) => a.d - b.d)[0];
          if (cerca && cerca.d < 0.6) nuestro = cerca.p;
        }
        const visto = datos.ig_reels_avg_watch_time != null ? datos.ig_reels_avg_watch_time / 1000 : null;
        filas.push({
          cuenta: nombre, seguidores: cuenta.followers_count, fecha: m.timestamp.slice(0, 10), tipo: tipo === 'REELS' ? 'Reel' : (m.media_type === 'CAROUSEL_ALBUM' ? 'Carrusel' : 'Imagen'),
          tema: nuestro ? nuestro.slug : (m.caption || '').split('\n')[0].slice(0, 50), enlace: m.permalink, ...datos,
          visto_medio_s: visto != null ? +visto.toFixed(1) : null, duracion_s: durPublicado ? +durPublicado.toFixed(1) : nuestro ? +nuestro.dur.toFixed(1) : null,
          retencion: visto != null && (durPublicado || nuestro) ? Math.round(100 * visto / (durPublicado || nuestro.dur)) : null
        });
      }
      url = pag.paging && pag.paging.next;
    }
  }
  filas.sort((a, b) => (a.cuenta + a.fecha).localeCompare(b.cuenta + b.fecha));
  const salida = process.argv.indexOf('--json');
  if (salida > 0) fs.writeFileSync(process.argv[salida + 1], JSON.stringify({ fecha: new Date().toISOString(), filas }, null, 2));
  console.table(filas.map(f => ({ cuenta: f.cuenta.split(' ')[1], fecha: f.fecha, tipo: f.tipo, tema: String(f.tema).slice(0, 28), vistas: f.views, alcance: f.reach,
    'visto medio': f.visto_medio_s, dura: f.duracion_s, 'ret %': f.retencion, guard: f.saved, comp: f.shares, megusta: f.likes, seguid: f.follows })));
})().catch(e => { console.error('error:', e.message); process.exit(1); });
