// Programa un lote de Reels ya renderizados: 2 al día por cuenta (--por-dia N), en franjas de su audiencia elegidas al azar
// cada día (distintas entre semana y en fin de semana) y a un minuto suelto, nunca en punto (horario.cjs; --exacta lo quita).
// Facebook sale unos minutos después que Instagram. Instagram → cola del panel (encolar-instagram.cjs); Facebook → programación nativa
// (publicar-facebook.cjs). Apunta cada vídeo en el cuaderno del panel (estadisticas/cuaderno) con su hora de Canarias.
// Solo cuando el propietario ha pedido publicar en volumen. Sin --programar solo enseña el plan.
// Uso: node programar-lote.cjs <dir google-auth-library> <credencial.json> --desde 2026-11-09 es:slug1,slug2 en:slugA,slugB [--por-dia 2] [--exacta] [--programar] [--solo-ig]
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const [, , fbt, sa] = process.argv;
const op = (n) => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : null; };
const programar = process.argv.includes('--programar'), soloIg = process.argv.includes('--solo-ig'), exacta = process.argv.includes('--exacta');
const { alAzar, despuesDe, elegir, iso: aIso } = require('./horario.cjs');
const porDia = Math.max(1, Math.min(4, +(op('--por-dia') || 2)));

// Franjas (hora de la audiencia), separadas al menos 3 horas; cada día se usan --por-dia de ellas, al azar. Revisarlas con «Cuándo publicar» en el panel.
const FRANJAS = {
  es: { zona: 'Europe/Madrid', laborable: ['08:30', '14:00', '18:30', '21:30'], finde: ['10:30', '13:30', '18:00', '21:00'] },
  en: { zona: 'America/New_York', laborable: ['08:00', '12:30', '16:30', '19:30'], finde: ['10:00', '13:00', '16:00', '19:00'] }
};
const CANARIAS = 'Atlantic/Canary';

// Instante UTC de una hora local en una zona (dos pasadas por si cambia el horario).
function instante(dia, hora, zona) {
  const [y, m, d] = dia.split('-').map(Number), [hh, mm] = hora.split(':').map(Number);
  let t = Date.UTC(y, m - 1, d, hh, mm);
  for (let i = 0; i < 2; i++) {
    const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: zona, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).formatToParts(new Date(t)).map(x => [x.type, x.value]));
    const visto = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute);
    t += Date.UTC(y, m - 1, d, hh, mm) - visto;
  }
  return new Date(t);
}
const enZona = (f, zona, o) => new Intl.DateTimeFormat('en-CA', { timeZone: zona, hourCycle: 'h23', ...o }).format(f);
const finde = (dia, zona) => ['Sat', 'Sun'].includes(new Intl.DateTimeFormat('en-US', { timeZone: zona, weekday: 'short' }).format(instante(dia, '12:00', zona)));

(async () => {
  const desde = op('--desde') || enZona(new Date(), CANARIAS, { year: 'numeric', month: '2-digit', day: '2-digit' });
  const lotes = process.argv.filter(a => /^(es|en):/.test(a)).map(a => [a.slice(0, 2), a.slice(3).split(',').filter(Boolean)]);
  const { GoogleAuth } = require(path.join(fbt, 'node_modules/google-auth-library'));
  const c = await new GoogleAuth({ keyFile: sa, scopes: ['https://www.googleapis.com/auth/datastore'] }).getClient();
  const URL = 'https://firestore.googleapis.com/v1/projects/personal-franquizb/databases/(default)/documents/estadisticas/', h = { 'x-goog-user-project': 'personal-franquizb' };
  const leer = async (doc, def) => { try { return JSON.parse((await c.request({ url: URL + doc, headers: h })).data.fields.json.stringValue); } catch { return def; } };
  const cola = await leer('cola', { items: [] }), cuaderno = await leer('cuaderno', { cuentas: {} });
  const plan = [];
  for (const [cuenta, slugs] of lotes) {
    const F = FRANJAS[cuenta];
    // Huecos libres: a más de 90 minutos de lo que ya hay en la cola de esa cuenta y a más de 20 minutos de ahora.
    const ocupados = cola.items.filter(x => x.cuenta === cuenta && ['pendiente', 'publicando'].includes(x.estado)).map(x => Date.parse(x.cuando));
    const libre = (t) => ocupados.every(o => Math.abs(o - t) > 90 * 60e3);
    const huecos = [];
    for (let k = 0; huecos.length < slugs.length && k < 30; k++) {
      const dia = new Date(Date.parse(desde + 'T12:00:00Z') + k * 864e5).toISOString().slice(0, 10);
      const delDia = F[finde(dia, F.zona) ? 'finde' : 'laborable'];
      // Los días que ya tienen algo en la cola cuentan: entre lo que hay y lo nuevo, no más de --por-dia.
      const yaHay = ocupados.filter(o => enZona(new Date(o), F.zona, { year: 'numeric', month: '2-digit', day: '2-digit' }) === dia).length;
      const libres = delDia.filter(x => libre(instante(dia, x, F.zona).getTime())), cuantas = exacta ? libres.length : Math.max(0, porDia - yaHay);
      for (const hora of cuantas ? elegir(libres, cuantas) : []) {
        const t = exacta ? instante(dia, hora, F.zona) : alAzar(instante(dia, hora, F.zona));
        if (t - Date.now() > 20 * 60e3 && huecos.length < slugs.length) huecos.push(t);
      }
    }
    // Nunca dos veces el mismo vídeo: si ya está pendiente en la cola, se salta.
    const yaEnCola = new Set(cola.items.filter(x => x.cuenta === cuenta && ['pendiente', 'publicando'].includes(x.estado)).map(x => x.slug));
    slugs.filter(s => { if (yaEnCola.has(s)) console.log(`· ${s} ya está en la cola: no se repite`); return !yaEnCola.has(s); })
      .forEach((slug, i) => plan.push({ cuenta, slug, cuando: huecos[i] }));
  }
  for (const p of plan) {
    const dir = path.join(__dirname, 'out-reels', p.slug, p.cuenta), meta = JSON.parse(fs.readFileSync(path.join(dir, 'meta.json'), 'utf8'));
    p.meta = meta; p.dir = dir;
    console.log(`${p.cuenta} · ${enZona(p.cuando, CANARIAS, { weekday: 'short', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })} Canarias (${enZona(p.cuando, FRANJAS[p.cuenta].zona, { hour: '2-digit', minute: '2-digit' })} audiencia) · ${p.slug} · ${meta.total} s`);
    if ((p.cuando - Date.now()) > 6.5 * 864e5) console.log('   ⚠ más de 6,5 días: Instagram no se puede encolar todavía (la URL firmada dura 7 días)');
  }
  if (!programar) { console.log('\n(plan: añade --programar para encolar en Instagram y programar en Facebook)'); return; }
  for (const p of plan) {
    const iso = aIso(p.cuando), isoFb = exacta ? iso : aIso(despuesDe(p.cuando)), video = path.join(p.dir, 'reel.mp4'), texto = path.join(p.dir, 'texto.txt');
    if ((p.cuando - Date.now()) <= 6.5 * 864e5) execFileSync('node', [path.join(__dirname, 'encolar-instagram.cjs'), fbt, sa, p.cuenta, video, texto, iso, '--portada-ms', String(p.meta.portada_ms)], { stdio: 'inherit' });
    if (!soloIg) execFileSync('node', [path.join(__dirname, 'publicar-facebook.cjs'), p.cuenta, video, texto, '--publicar', '--programar', isoFb], { stdio: 'inherit' });
    // Cuaderno: una entrada por vídeo (fecha y hora de Canarias), estado «listo».
    const cu = cuaderno.cuentas[p.cuenta] = cuaderno.cuentas[p.cuenta] || { proximos: [], pendientes: [] };
    cu.proximos = cu.proximos.filter(x => x.slug !== p.slug);
    cu.proximos.push({ fecha: enZona(p.cuando, CANARIAS, { year: 'numeric', month: '2-digit', day: '2-digit' }), hora: enZona(p.cuando, CANARIAS, { hour: '2-digit', minute: '2-digit' }),
      tipo: 'Reel', tema: p.meta.tema, estado: 'listo', slug: p.slug, nota: `Programado en Instagram${soloIg ? '' : ' y Facebook'} · ${p.meta.total} s` });
  }
  await c.request({ url: URL + 'cuaderno', method: 'PATCH', headers: h, data: { fields: { json: { stringValue: JSON.stringify(cuaderno) }, actualizado: { integerValue: String(Date.now()) } } } });
  fs.writeFileSync(path.join(__dirname, 'cuaderno.json'), JSON.stringify(cuaderno, null, 2) + '\n');
  console.log(`✓ ${plan.length} vídeos programados y apuntados en el cuaderno`);
})().catch(e => { console.error('error:', e.response ? JSON.stringify(e.response.data).slice(0, 300) : e.message); process.exit(1); });
