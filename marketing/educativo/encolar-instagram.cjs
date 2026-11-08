// Deja un Reel en la cola de publicación de Instagram: se publica solo a la hora indicada (la función panelPublicar
// mira la cola cada 15 minutos). El vídeo espera en el bucket privado finanziapp-publicar (carpeta cola/, se borra a los 9 días)
// y la hora tiene que estar dentro de los próximos 6,5 días (la URL firmada dura 7 días como mucho). Solo cuando el propietario pide publicar algo concreto.
// Con --ensayo, Instagram lo prepara y lo procesa pero no lo publica (para comprobar que todo funciona).
// Uso: node encolar-instagram.cjs <dir google-auth-library> <credencial.json> es|en <video.mp4> <texto.txt> <fecha ISO> [--portada-ms 3500] [--ensayo]
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const [, , fbt, sa, cuenta, video, textoArchivo, cuando] = process.argv;
const op = (n) => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : null; };
if (!['es', 'en'].includes(cuenta) || !video || !textoArchivo || !cuando) { console.error('Uso: … es|en <video.mp4> <texto.txt> <fecha ISO> [--portada-ms N] [--ensayo]'); process.exit(1); }
const hora = Date.parse(cuando);
if (isNaN(hora) || hora < Date.now() - 60e3 || hora > Date.now() + 6.8 * 864e5) { console.error('La fecha tiene que estar entre ahora y dentro de 6 días y medio (la URL firmada dura 7 días como mucho).'); process.exit(1); }

// URL firmada V4 de Cloud Storage (GET), igual que en publicar-instagram.cjs.
function urlFirmada(sa, bucket, objeto, seg) {
  const fecha = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''), dia = fecha.slice(0, 8);
  const ambito = `${dia}/auto/storage/goog4_request`, ruta = `/${bucket}/${objeto.split('/').map(encodeURIComponent).join('/')}`;
  const q = { 'X-Goog-Algorithm': 'GOOG4-RSA-SHA256', 'X-Goog-Credential': `${sa.client_email}/${ambito}`, 'X-Goog-Date': fecha, 'X-Goog-Expires': String(seg), 'X-Goog-SignedHeaders': 'host' };
  const cq = Object.keys(q).sort().map(k => `${encodeURIComponent(k)}=${encodeURIComponent(q[k])}`).join('&');
  const peticion = ['GET', ruta, cq, 'host:storage.googleapis.com\n', 'host', 'UNSIGNED-PAYLOAD'].join('\n');
  const aFirmar = ['GOOG4-RSA-SHA256', fecha, ambito, crypto.createHash('sha256').update(peticion).digest('hex')].join('\n');
  return `https://storage.googleapis.com${ruta}?${cq}&X-Goog-Signature=${crypto.createSign('RSA-SHA256').update(aFirmar).sign(sa.private_key, 'hex')}`;
}

const BUCKET = 'finanziapp-publicar', FS = 'https://firestore.googleapis.com/v1/projects/personal-franquizb/databases/(default)/documents/estadisticas/cola';
(async () => {
  const { GoogleAuth } = require(path.join(fbt, 'node_modules/google-auth-library'));
  const c = await new GoogleAuth({ keyFile: sa, scopes: ['https://www.googleapis.com/auth/cloud-platform'] }).getClient();
  const h = { 'x-goog-user-project': 'personal-franquizb' };
  const slug = path.basename(path.dirname(path.dirname(path.resolve(video))));
  const id = `${new Date().toISOString().slice(0, 16).replace(/[-:T]/g, '')}-${cuenta}-${slug}`;
  const objeto = `cola/${id}.mp4`;
  await c.request({ url: `https://storage.googleapis.com/upload/storage/v1/b/${BUCKET}/o?uploadType=media&name=${encodeURIComponent(objeto)}`, method: 'POST',
    headers: { ...h, 'Content-Type': 'video/mp4' }, data: fs.readFileSync(video) });
  let cola = { items: [] };
  try { const r = await c.request({ url: FS, headers: h }); cola = JSON.parse(r.data.fields.json.stringValue); } catch { /* primera vez */ }
  // Se guardan solo los últimos 50 movimientos.
  cola.items = [...cola.items.slice(-49), { id, cuenta, plataforma: 'ig', slug, objeto, cuando: new Date(hora).toISOString(), texto: fs.readFileSync(textoArchivo, 'utf8').trim(),
    url: urlFirmada(JSON.parse(fs.readFileSync(sa, 'utf8')), BUCKET, objeto, Math.min(604800, Math.round((hora - Date.now()) / 1000) + 3 * 3600)),
    thumb_ms: op('--portada-ms') ? +op('--portada-ms') : null, ensayo: process.argv.includes('--ensayo'), estado: 'pendiente', creado: new Date().toISOString(),
    sha1: crypto.createHash('sha1').update(fs.readFileSync(video)).digest('hex').slice(0, 12) }];
  await c.request({ url: FS, method: 'PATCH', headers: h, data: { fields: { json: { stringValue: JSON.stringify(cola) }, actualizado: { integerValue: String(Date.now()) } } } });
  console.log(`✓ En la cola de Instagram (${cuenta}): ${slug} → ${new Date(hora).toISOString()}${process.argv.includes('--ensayo') ? ' (ENSAYO: no se publicará)' : ''}`);
})().catch(e => { console.error('error:', e.response ? JSON.stringify(e.response.data).slice(0, 300) : e.message); process.exit(1); });
