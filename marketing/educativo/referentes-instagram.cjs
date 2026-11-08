// Referentes: qué funciona en Instagram en finanzas personales (datos públicos, API Graph de Meta).
// - Cuentas grandes (Business Discovery): sus últimos Reels con reproducciones, me gusta y comentarios;
//   «multiplicador» = reproducciones / seguidores (cuánto empuja el algoritmo ese vídeo más allá de su público).
// - Hashtags (búsqueda de hashtags): lo más popular en español e inglés (sin reproducciones: la API no las da).
// El token lo inyecta el proxy del entorno en graph.facebook.com; solo lectura.
// Uso: node referentes-instagram.cjs [--json salida.json]   (límite de Meta: 30 hashtags distintos por semana)
const fs = require('fs');
if (process.env.HTTPS_PROXY && !process.env.NODE_USE_ENV_PROXY) {
  const r = require('child_process').spawnSync(process.execPath, ['--no-warnings', ...process.argv.slice(1)], { stdio: 'inherit', env: { ...process.env, NODE_USE_ENV_PROXY: '1' } });
  process.exit(r.status);
}

const G = 'https://graph.facebook.com/v23.0';
const YO = '17841411098796089';   // @finanziapp.es: la cuenta desde la que se consulta
const CUENTAS = ['humphreytalks', 'thefinancialdiet', 'herfirst100k', 'ramit', 'vivianntu', 'grahamstephan', 'nischa', 'personalfinanceclub', 'thebudgetmom', 'minoritymindset'];
const HASHTAGS = { es: ['finanzaspersonales', 'ahorro', 'educacionfinanciera'], en: ['personalfinance', 'moneytips'] };

const pedir = async (url) => { const j = await (await fetch(url)).json(); if (j.error) throw new Error(j.error.message); return j; };
const gancho = (c) => (c || '').split('\n')[0].trim().slice(0, 140);

(async () => {
  const cuentas = [], reels = [], hashtags = {};
  for (const u of CUENTAS) {
    try {
      const b = (await pedir(`${G}/${YO}?fields=business_discovery.username(${u}){username,followers_count,media_count,media.limit(25){caption,like_count,comments_count,view_count,media_product_type,timestamp,permalink}}`)).business_discovery;
      const media = (b.media && b.media.data) || [];
      const suyos = media.filter(m => m.media_product_type === 'REELS' && m.view_count);
      cuentas.push({ usuario: b.username, seguidores: b.followers_count, reels: suyos.length, mediana_vistas: suyos.map(m => m.view_count).sort((a, z) => a - z)[Math.floor(suyos.length / 2)] || null });
      for (const m of suyos) reels.push({ usuario: b.username, seguidores: b.followers_count, fecha: m.timestamp.slice(0, 10), vistas: m.view_count, megusta: m.like_count, comentarios: m.comments_count,
        multiplicador: +(m.view_count / b.followers_count).toFixed(2), gancho: gancho(m.caption), enlace: m.permalink });
      console.log(`✓ @${b.username}: ${b.followers_count} seguidores, ${suyos.length} reels`);
    } catch (e) { console.log(`· @${u}: ${e.message.slice(0, 80)}`); }
  }
  for (const [lang, tags] of Object.entries(HASHTAGS)) for (const tag of tags) {
    try {
      const id = (await pedir(`${G}/ig_hashtag_search?user_id=${YO}&q=${tag}`)).data[0].id;
      const top = (await pedir(`${G}/${id}/top_media?user_id=${YO}&fields=caption,like_count,comments_count,media_type,timestamp,permalink&limit=30`)).data;
      hashtags[tag] = { idioma: lang, publicaciones: top.map(m => ({ fecha: m.timestamp.slice(0, 10), tipo: m.media_type, megusta: m.like_count, comentarios: m.comments_count, gancho: gancho(m.caption), enlace: m.permalink }))
        .sort((a, z) => (z.megusta + 5 * z.comentarios) - (a.megusta + 5 * a.comentarios)) };
      console.log(`✓ #${tag}: ${top.length} publicaciones`);
    } catch (e) { console.log(`· #${tag}: ${e.message.slice(0, 80)}`); }
  }
  reels.sort((a, z) => z.multiplicador - a.multiplicador);
  const res = { fecha: new Date().toISOString(), cuentas, reels, hashtags };
  const i = process.argv.indexOf('--json'); if (i > 0) fs.writeFileSync(process.argv[i + 1], JSON.stringify(res, null, 2));
  console.log('\nReels que más superan a su propia audiencia (vistas / seguidores):');
  for (const r of reels.slice(0, 12)) console.log(`  ×${String(r.multiplicador).padEnd(5)} ${String(r.vistas).padStart(8)} vistas · @${r.usuario.padEnd(18)} | ${r.gancho.slice(0, 90)}`);
})().catch(e => { console.error('error:', e.message); process.exit(1); });
