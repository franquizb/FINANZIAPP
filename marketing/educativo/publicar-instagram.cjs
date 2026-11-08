// Publica un Reel o un carrusel en Instagram con la API Graph de Meta.
// SOLO se usa cuando el propietario pide publicar algo concreto en una cuenta concreta.
//
// Cómo: sube los archivos un momento a Firebase Storage (privado), crea una URL firmada que caduca en
// 1 hora, Instagram la descarga, se publica y se borran los archivos. Coste prácticamente nulo.
// Sin --publicar hace un ENSAYO: prepara la publicación en Instagram y comprueba que la acepta, pero no
// publica nada (el borrador caduca solo en 24 h).
//
// Uso:
//   node publicar-instagram.cjs <dir google-auth-library> <credencial.json> es|en reel <video.mp4> <texto.txt> [--portada portada.jpg] [--publicar]
//   node publicar-instagram.cjs <…> <…> es|en carrusel <carpeta con 01.jpg, 02.jpg…> <texto.txt> [--publicar]
// El token de Instagram lo inyecta el proxy del entorno en graph.facebook.com (no está en el código).
const fs = require('fs'), path = require('path'), crypto = require('crypto');
if (process.env.HTTPS_PROXY && !process.env.NODE_USE_ENV_PROXY) {
  const r = require('child_process').spawnSync(process.execPath, ['--no-warnings', ...process.argv.slice(1)], { stdio: 'inherit', env: { ...process.env, NODE_USE_ENV_PROXY: '1' } });
  process.exit(r.status);
}

const G = 'https://graph.facebook.com/v23.0';
const CUENTA = { en: '17841480765193424', es: '17841411098796089' };   // @finanziapp, @finanziapp.es
const BUCKET = 'personal-franquizb.firebasestorage.app';
const [, , fbt, saArchivo, idioma, tipo, origen, textoArchivo] = process.argv;
const op = (n) => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : null; };
const publicar = process.argv.includes('--publicar');
const sa = JSON.parse(fs.readFileSync(saArchivo, 'utf8'));
const igId = CUENTA[idioma];
if (!igId || !['reel', 'carrusel'].includes(tipo)) { console.error('Uso: … es|en reel|carrusel <origen> <texto.txt> [--publicar]'); process.exit(1); }

// URL firmada V4 de Cloud Storage (GET, caduca en `seg` segundos).
function urlFirmada(objeto, seg = 3600) {
  const fecha = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''), dia = fecha.slice(0, 8);
  const ambito = `${dia}/auto/storage/goog4_request`, ruta = `/${BUCKET}/${objeto.split('/').map(encodeURIComponent).join('/')}`;
  const q = { 'X-Goog-Algorithm': 'GOOG4-RSA-SHA256', 'X-Goog-Credential': `${sa.client_email}/${ambito}`, 'X-Goog-Date': fecha, 'X-Goog-Expires': String(seg), 'X-Goog-SignedHeaders': 'host' };
  const cq = Object.keys(q).sort().map(k => `${encodeURIComponent(k)}=${encodeURIComponent(q[k])}`).join('&');
  const peticion = ['GET', ruta, cq, 'host:storage.googleapis.com\n', 'host', 'UNSIGNED-PAYLOAD'].join('\n');
  const aFirmar = ['GOOG4-RSA-SHA256', fecha, ambito, crypto.createHash('sha256').update(peticion).digest('hex')].join('\n');
  return `https://storage.googleapis.com${ruta}?${cq}&X-Goog-Signature=${crypto.createSign('RSA-SHA256').update(aFirmar).sign(sa.private_key, 'hex')}`;
}

(async () => {
  const { GoogleAuth } = require(path.join(fbt, 'node_modules/google-auth-library'));
  const gcs = await new GoogleAuth({ keyFile: saArchivo, scopes: ['https://www.googleapis.com/auth/devstorage.read_write'] }).getClient();
  const subidos = [];
  const subir = async (archivo) => {
    const nombre = `publicar/${Date.now()}-${path.basename(archivo)}`;
    await gcs.request({ url: `https://storage.googleapis.com/upload/storage/v1/b/${BUCKET}/o?uploadType=media&name=${encodeURIComponent(nombre)}`, method: 'POST',
      headers: { 'Content-Type': archivo.endsWith('.mp4') ? 'video/mp4' : 'image/jpeg' }, data: fs.readFileSync(archivo) });
    subidos.push(nombre);
    return urlFirmada(nombre);
  };
  const borrar = async () => { for (const n of subidos) await gcs.request({ url: `https://storage.googleapis.com/storage/v1/b/${BUCKET}/o/${encodeURIComponent(n)}`, method: 'DELETE' }).catch(() => {}); };
  const ig = async (ruta, params, metodo = 'POST') => {
    const r = await fetch(`${G}/${ruta}`, metodo === 'POST' ? { method: 'POST', body: new URLSearchParams(params) } : undefined);
    const j = await r.json(); if (j.error) throw new Error(j.error.error_user_msg || j.error.message); return j;
  };
  const esperar = async (id) => {
    for (let i = 0; i < 60; i++) {
      const s = await ig(`${id}?fields=status_code,status`, null, 'GET');
      if (s.status_code === 'FINISHED') return;
      if (s.status_code === 'ERROR' || s.status_code === 'EXPIRED') throw new Error('Instagram no acepta el archivo: ' + (s.status || s.status_code));
      await new Promise(ok => setTimeout(ok, 5000));
    }
    throw new Error('Instagram tarda demasiado en procesarlo');
  };

  try {
    const texto = fs.readFileSync(textoArchivo, 'utf8').trim();
    let contenedor;
    if (tipo === 'reel') {
      const params = { media_type: 'REELS', video_url: await subir(origen), caption: texto, share_to_feed: 'true' };
      if (op('--portada')) params.cover_url = await subir(op('--portada'));
      contenedor = (await ig(`${igId}/media`, params)).id;
    } else {
      const imagenes = fs.readdirSync(origen).filter(f => /^\d+\.jpe?g$/.test(f)).sort().slice(0, 10);
      const hijos = [];
      for (const f of imagenes) hijos.push((await ig(`${igId}/media`, { image_url: await subir(path.join(origen, f)), is_carousel_item: 'true' })).id);
      for (const h of hijos) await esperar(h);
      contenedor = (await ig(`${igId}/media`, { media_type: 'CAROUSEL', children: hijos.join(','), caption: texto })).id;
    }
    await esperar(contenedor);
    if (!publicar) { console.log(`✓ ENSAYO: Instagram acepta el ${tipo} para la cuenta ${idioma}. No se ha publicado nada (añade --publicar).`); return; }
    const pub = await ig(`${igId}/media_publish`, { creation_id: contenedor });
    const info = await ig(`${pub.id}?fields=permalink`, null, 'GET');
    console.log(`✓ Publicado: ${info.permalink}`);
  } finally {
    await borrar();
  }
})().catch(e => { console.error('error:', e.message); process.exit(1); });
