// Oportunidades para comentar A MANO en vídeos virales de nuestro tema: Reels recientes de cuentas grandes (medios y
// creadores conocidos, cientos de miles o millones de visualizaciones) que hablan de dinero, en cada mercado. Ahí un
// comentario con datos de @finanziapp.es o @finanziapp aporta y lo leen miles de personas. La idea del propietario
// (14 nov 2026): responder con respeto, como profes, al usuario que se equivoca en los comentarios de esos vídeos.
// Solo lee (Business Discovery, API oficial); NO comenta: la API no deja comentar en publicaciones ajenas y automatizar
// comentarios va contra las normas de Instagram. El propietario publica desde la app. Guía de tono: marketing/COMENTARIOS.md.
// Uso: node oportunidades.cjs <salida.json> [--horas 72] [--min 100000]
const fs = require('fs');
if (process.env.HTTPS_PROXY && !process.env.NODE_USE_ENV_PROXY) {
  const r = require('child_process').spawnSync(process.execPath, ['--no-warnings', ...process.argv.slice(1)], { stdio: 'inherit', env: { ...process.env, NODE_USE_ENV_PROXY: '1' } });
  process.exit(r.status);
}
const G = 'https://graph.facebook.com/v24.0';
const MERCADOS = {
  es: { yo: '17841411098796089',
    cuentas: ['el_pais', 'elmundo_es', 'lavanguardia', 'eldiarioes', 'telecincoes', 'rtve', '20m', 'elconfidencial', 'eleconomistaes',
      'mispropiasfinanzas', 'financia_tuvida', 'esmeralda__gl', 'metododinero', 'finanzasya_', 'restaurantemarruzella'],
    tema: /dinero|sueldo|salario|n[oó]mina|ahorr|hipotec|alquiler|vivienda|piso|impuesto|iva\b|irpf|hacienda|precio|euros|€|paro|pensi[oó]n|inflaci[oó]n|banco|tarjeta|deuda|cr[eé]dito|inver|bolsa|aut[oó]nomo|factura|luz|gasolina|compra|rebaja|black friday|smi|cotiz|empresa|negocio|trabajador|cobr/i },
  en: { yo: '17841480765193424',
    cuentas: ['wealth', 'businessinsider', 'morningbrew', 'cnbc', 'cnbcmakeit', 'yahoofinance', 'wsj', 'foxbusiness', 'marketwatch', 'nypost',
      'nowthis', 'humphreytalks', 'herfirst100k', 'personalfinanceclub', 'casuallyfinance', 'smallstepfinance', 'primateeconomics'],
    tema: /money|salary|paycheck|wage|sav(e|ing)|mortgage|rent|hous|tax|irs|price|\$|inflation|tariff|bank|credit|debt|loan|invest|stock|401\(?k|ira\b|retire|budget|afford|cost|tip(ping)?\b|minimum wage|black friday|economy|layoff|job/i }
};
const args = process.argv.slice(2), salida = args[0] || 'oportunidades.json';
const op = (n, d) => args.includes(n) ? +args[args.indexOf(n) + 1] : d;
const horas = op('--horas', 72), minVistas = op('--min', 100000);
const pedir = async (url) => { const j = await (await fetch(url)).json(); if (j.error) throw new Error(j.error.message); return j; };
const espera = (ms) => new Promise(ok => setTimeout(ok, ms));

(async () => {
  const desde = Date.now() - horas * 3600e3, out = {};
  for (const [m, cfg] of Object.entries(MERCADOS)) {
    const lista = [];
    for (const u of cfg.cuentas) {
      try {
        const b = (await pedir(`${G}/${cfg.yo}?fields=business_discovery.username(${u}){followers_count,media.limit(15){caption,like_count,comments_count,view_count,media_product_type,timestamp,permalink}}`)).business_discovery;
        for (const x of b.media?.data || []) {
          if (x.media_product_type !== 'REELS' || Date.parse(x.timestamp) < desde) continue;
          const texto = (x.caption || '').replace(/\s+/g, ' ');
          lista.push({ cuenta: u, seguidores: b.followers_count, permalink: x.permalink, fecha: x.timestamp, vistas: x.view_count ?? null,
            comentarios: x.comments_count ?? null, megusta: x.like_count ?? null, de_dinero: cfg.tema.test(texto), texto: texto.slice(0, 240) });
        }
      } catch (e) { console.log(`· ${m} @${u}: ${e.message.slice(0, 80)}`); }
      await espera(700);
    }
    // Primero los de dinero con muchas visualizaciones; después el resto de virales (por si el tema sale en los comentarios).
    out[m] = lista.filter(x => (x.vistas || 0) >= minVistas || (x.comentarios || 0) >= 300)
      .sort((a, b) => (b.de_dinero - a.de_dinero) || ((b.vistas || 0) - (a.vistas || 0)));
    console.log(`✓ ${m}: ${out[m].length} Reels virales de las últimas ${horas} h (${out[m].filter(x => x.de_dinero).length} de dinero)`);
  }
  fs.writeFileSync(salida, JSON.stringify(out, null, 2));
})().catch(e => { console.error('error:', e.message); process.exit(1); });
