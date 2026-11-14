// Oportunidades para comentar A MANO: vídeos recientes y con conversación de nuestro tema en cada mercado, donde un
// comentario con datos de @finanziapp.es o @finanziapp aporta y se ve. Solo lee (búsqueda de hashtags y cuentas de
// referencia con la API oficial); NO comenta: la API no deja comentar en publicaciones ajenas y automatizar comentarios
// va contra las normas de Instagram. El propietario publica desde la app los comentarios que preparamos.
// Límite de Meta: 30 hashtags distintos por cuenta cada 7 días.
// Uso: node oportunidades.cjs <salida.json> [--horas 72]
const fs = require('fs');
if (process.env.HTTPS_PROXY && !process.env.NODE_USE_ENV_PROXY) {
  const r = require('child_process').spawnSync(process.execPath, ['--no-warnings', ...process.argv.slice(1)], { stdio: 'inherit', env: { ...process.env, NODE_USE_ENV_PROXY: '1' } });
  process.exit(r.status);
}
const G = 'https://graph.facebook.com/v24.0';
const MERCADOS = {
  es: { yo: '17841411098796089', hashtags: ['finanzaspersonales', 'ahorro', 'hosteleria', 'autonomos', 'vivienda', 'nomina'],
    cuentas: ['restaurantemarruzella'] },
  en: { yo: '17841480765193424', hashtags: ['personalfinance', 'moneytips', 'smallbusiness', 'budgeting', 'creditcards', 'investing'],
    cuentas: ['casuallyfinance', 'smallstepfinance', 'basicfinancialliteracy', 'primateeconomics', 'monkey__economics'] }
};
const salida = process.argv[2] || 'oportunidades.json';
const horas = process.argv.includes('--horas') ? +process.argv[process.argv.indexOf('--horas') + 1] : 72;
const pedir = async (url) => { const j = await (await fetch(url)).json(); if (j.error) throw new Error(j.error.message); return j; };
const espera = (ms) => new Promise(ok => setTimeout(ok, ms));

(async () => {
  const desde = Date.now() - horas * 3600e3, out = {};
  for (const [m, cfg] of Object.entries(MERCADOS)) {
    const vistos = new Map();
    const anota = (x, origen) => {
      if (!x.permalink || Date.parse(x.timestamp) < desde) return;
      const prev = vistos.get(x.permalink);
      if (prev) { prev.origen.push(origen); return; }
      vistos.set(x.permalink, { permalink: x.permalink, fecha: x.timestamp, comentarios: x.comments_count ?? null, megusta: x.like_count ?? null,
        vistas: x.view_count ?? null, tipo: x.media_product_type || x.media_type, texto: (x.caption || '').replace(/\s+/g, ' ').slice(0, 220), origen: [origen] });
    };
    for (const tag of cfg.hashtags) {
      try {
        const id = (await pedir(`${G}/ig_hashtag_search?user_id=${cfg.yo}&q=${tag}`)).data[0].id;
        for (const tipo of ['top_media', 'recent_media']) {
          const d = (await pedir(`${G}/${id}/${tipo}?user_id=${cfg.yo}&fields=caption,like_count,comments_count,media_type,media_product_type,timestamp,permalink&limit=50`)).data;
          d.forEach(x => anota(x, `#${tag}`));
        }
      } catch (e) { console.log(`· ${m} #${tag}: ${e.message.slice(0, 80)}`); }
      await espera(800);
    }
    for (const u of cfg.cuentas) {
      try {
        const b = (await pedir(`${G}/${cfg.yo}?fields=business_discovery.username(${u}){media.limit(12){caption,like_count,comments_count,view_count,media_type,media_product_type,timestamp,permalink}}`)).business_discovery;
        (b.media?.data || []).forEach(x => anota(x, `@${u}`));
      } catch (e) { console.log(`· ${m} @${u}: ${e.message.slice(0, 80)}`); }
      await espera(800);
    }
    // Orden: conversación (comentarios) y alcance; primero vídeos.
    out[m] = [...vistos.values()].sort((a, b) => ((b.tipo === 'REELS' || b.tipo === 'VIDEO') - (a.tipo === 'REELS' || a.tipo === 'VIDEO')) || ((b.comentarios || 0) - (a.comentarios || 0)) || ((b.megusta || 0) - (a.megusta || 0)));
    console.log(`✓ ${m}: ${out[m].length} publicaciones de las últimas ${horas} h`);
  }
  fs.writeFileSync(salida, JSON.stringify(out, null, 2));
})().catch(e => { console.error('error:', e.message); process.exit(1); });
