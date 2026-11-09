// Reemplaza o mueve un Reel ya programado (Instagram en la cola del panel + Facebook) sin duplicarlo:
// cancela lo pendiente de ese vídeo, retira el programado de Facebook y lo vuelve a programar con el archivo
// actual de out-reels/ a la misma hora o a la nueva. Actualiza la hora en el cuaderno del panel.
// Solo cuando el propietario ha pedido cambiar algo de lo programado.
// Uso: node reprogramar.cjs <dir google-auth-library> <credencial.json> es|en <slug> [nueva fecha ISO] [--solo-ig]
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const [, , fbt, sa, cuenta, slug] = process.argv;
const nueva = process.argv[6] && !process.argv[6].startsWith('--') ? process.argv[6] : null, soloIg = process.argv.includes('--solo-ig');
if (!['es', 'en'].includes(cuenta) || !slug) { console.error('Uso: … es|en <slug> [nueva fecha ISO] [--solo-ig]'); process.exit(1); }
const BUCKET = 'finanziapp-publicar', CANARIAS = 'Atlantic/Canary';
const enZona = (f, o) => new Intl.DateTimeFormat('en-CA', { timeZone: CANARIAS, hourCycle: 'h23', ...o }).format(f);

(async () => {
  const { GoogleAuth } = require(path.join(fbt, 'node_modules/google-auth-library'));
  const c = await new GoogleAuth({ keyFile: sa, scopes: ['https://www.googleapis.com/auth/cloud-platform'] }).getClient();
  const URL = 'https://firestore.googleapis.com/v1/projects/personal-franquizb/databases/(default)/documents/estadisticas/', h = { 'x-goog-user-project': 'personal-franquizb' };
  const leer = async (doc) => JSON.parse((await c.request({ url: URL + doc, headers: h })).data.fields.json.stringValue);
  const guardar = (doc, v) => c.request({ url: URL + doc, method: 'PATCH', headers: h, data: { fields: { json: { stringValue: JSON.stringify(v) }, actualizado: { integerValue: String(Date.now()) } } } });

  const cola = await leer('cola');
  const pend = cola.items.filter(x => x.cuenta === cuenta && x.slug === slug && x.estado === 'pendiente');
  const cuando = nueva ? new Date(nueva) : pend[0] ? new Date(pend[0].cuando) : null;
  if (!cuando || isNaN(cuando)) { console.log(`· ${slug}: no está pendiente y no se ha dado fecha: no hago nada`); return; }
  if (cuando - Date.now() < 20 * 60e3) { console.log(`· ${slug}: faltan menos de 20 minutos (o ya pasó): no lo toco`); return; }
  for (const it of pend) {
    Object.assign(it, { estado: 'cancelado', hecho: new Date().toISOString(), error: 'reprogramado' });
    await c.request({ url: `https://storage.googleapis.com/storage/v1/b/${BUCKET}/o/${encodeURIComponent(it.objeto)}`, method: 'DELETE', headers: h }).catch(() => {});
  }
  if (pend.length) await guardar('cola', cola);
  const dir = path.join(__dirname, 'out-reels', slug, cuenta), meta = JSON.parse(fs.readFileSync(path.join(dir, 'meta.json'), 'utf8'));
  const iso = cuando.toISOString().replace(/\.\d{3}Z$/, 'Z'), video = path.join(dir, 'reel.mp4'), texto = path.join(dir, 'texto.txt');
  const run = (script, args) => execFileSync('node', [path.join(__dirname, script), ...args], { stdio: 'inherit' });
  if (!soloIg) run('publicar-facebook.cjs', [cuenta, '--borrar-programado', slug]);
  run('encolar-instagram.cjs', [fbt, sa, cuenta, video, texto, iso, '--portada-ms', String(meta.portada_ms)]);
  if (!soloIg) run('publicar-facebook.cjs', [cuenta, video, texto, '--publicar', '--programar', iso]);

  const cuaderno = await leer('cuaderno'), cu = cuaderno.cuentas[cuenta];
  cu.proximos = cu.proximos.filter(x => x.slug !== slug);
  cu.proximos.push({ fecha: enZona(cuando, { year: 'numeric', month: '2-digit', day: '2-digit' }), hora: enZona(cuando, { hour: '2-digit', minute: '2-digit' }), tipo: 'Reel', tema: meta.tema, estado: 'listo', slug,
    nota: `Programado en Instagram${soloIg ? '' : ' y Facebook'} · ${meta.total} s` });
  await guardar('cuaderno', cuaderno);
  fs.writeFileSync(path.join(__dirname, 'cuaderno.json'), JSON.stringify(cuaderno, null, 2) + '\n');
  console.log(`✓ ${slug} reprogramado para ${iso}`);
})().catch(e => { console.error('error:', e.response ? JSON.stringify(e.response.data).slice(0, 300) : e.message); process.exit(1); });
