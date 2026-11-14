// Estudia los Reels de cuentas de referencia (Business Discovery, datos públicos, solo lectura) para aprender qué
// reparte Instagram en un mercado: por cada cuenta, sus últimos Reels con reproducciones, me gusta, comentarios, fecha,
// duración (del MP4) y texto, y cuánto se aparta cada Reel de la mediana de su cuenta («índice» = vistas / mediana).
// Así se comparan ganchos, duraciones y horas dentro de la misma cuenta, sin que pese el tamaño de cada una.
// El token lo inyecta el proxy del entorno en graph.facebook.com.
// Uso: node estudiar-referentes.cjs <carpeta salida> usuario1 usuario2 … [--videos N]   (descarga los N mejores y N peores)
const fs = require('fs'), path = require('path');
if (process.env.HTTPS_PROXY && !process.env.NODE_USE_ENV_PROXY) {
  const r = require('child_process').spawnSync(process.execPath, ['--no-warnings', ...process.argv.slice(1)], { stdio: 'inherit', env: { ...process.env, NODE_USE_ENV_PROXY: '1' } });
  process.exit(r.status);
}
const G = 'https://graph.facebook.com/v24.0';
const YO = '17841480765193424';   // @finanziapp: la cuenta desde la que se consulta
const args = process.argv.slice(2), salida = args[0];
const nVideos = args.includes('--videos') ? +args[args.indexOf('--videos') + 1] : 0;
const usuarios = args.slice(1).filter((x, i, a) => !x.startsWith('--') && a[i - 1] !== '--videos');
const pedir = async (url) => { const j = await (await fetch(url)).json(); if (j.error) throw new Error(j.error.message); return j; };
const mediana = (v) => { const s = [...v].sort((a, b) => a - b); return s.length ? s[Math.floor(s.length / 2)] : 0; };
const espera = (ms) => new Promise(ok => setTimeout(ok, ms));

(async () => {
  fs.mkdirSync(salida, { recursive: true });
  const resumen = [];
  for (const u of usuarios) {
    let b;
    try {
      b = (await pedir(`${G}/${YO}?fields=business_discovery.username(${u}){username,name,biography,followers_count,media_count,media.limit(50){caption,like_count,comments_count,view_count,media_type,media_product_type,timestamp,permalink,media_url,thumbnail_url}}`)).business_discovery;
    } catch (e) { console.log(`✗ ${u}: ${e.message.slice(0, 90)}`); resumen.push({ usuario: u, error: e.message.slice(0, 120) }); await espera(1500); continue; }
    const reels = (b.media?.data || []).filter(m => m.media_product_type === 'REELS' && typeof m.view_count === 'number');
    const med = mediana(reels.map(m => m.view_count));
    for (const m of reels) {
      m.indice = med ? +(m.view_count / med).toFixed(2) : null;
      m.gancho = (m.caption || '').split('\n')[0].trim().slice(0, 160);
      m.hora_ny = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date(m.timestamp));
    }
    reels.sort((a, b) => b.view_count - a.view_count);
    // Vídeos para mirar: los N con más índice y los N con menos (para comparar arranques dentro de la misma cuenta).
    if (nVideos && reels.length >= 4) {
      const dir = path.join(salida, u); fs.mkdirSync(dir, { recursive: true });
      const elegidos = [...reels.slice(0, nVideos).map(m => ['alto', m]), ...reels.slice(-nVideos).map(m => ['bajo', m])];
      for (const [tipo, m] of elegidos) {
        if (!m.media_url) continue;
        const f = path.join(dir, `${tipo}-${m.permalink.split('/').filter(Boolean).pop()}.mp4`);
        try { if (!fs.existsSync(f)) fs.writeFileSync(f, Buffer.from(await (await fetch(m.media_url)).arrayBuffer())); m.archivo = f; m.grupo = tipo; } catch { /* sin vídeo */ }
      }
    }
    for (const m of reels) { delete m.media_url; delete m.thumbnail_url; }
    const fila = { usuario: b.username, nombre: b.name, bio: (b.biography || '').replace(/\n/g, ' / ').slice(0, 200), seguidores: b.followers_count, publicaciones: b.media_count,
      reels: reels.length, mediana_vistas: med, max_vistas: reels[0]?.view_count ?? null, multiplicador: b.followers_count ? +(med / b.followers_count).toFixed(3) : null };
    resumen.push(fila);
    fs.writeFileSync(path.join(salida, `${u}.json`), JSON.stringify({ ...fila, lista: reels }, null, 2));
    console.log(`✓ ${u}: ${fila.seguidores} seguidores · ${fila.reels} reels · mediana ${med} · máx ${fila.max_vistas}`);
    await espera(1500);
  }
  fs.writeFileSync(path.join(salida, 'resumen.json'), JSON.stringify(resumen, null, 2));
})().catch(e => { console.error('error:', e.message); process.exit(1); });
