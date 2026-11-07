// Sube publicaciones a la unidad compartida «FinanziApp» con una estructura
// pensada para quien publica: una carpeta por publicación y, dentro, una
// carpeta por cuenta (Instagram EN/ES, TikTok EN/ES o Reel EN/ES) y un
// documento «Texto para copiar». Idempotente: reutiliza carpetas y no repite
// archivos.
//
// Uso:
//   node publicar-drive.cjs <dir con google-auth-library> <credencial.json> carrusel <out/slug> "<Día…>" "<N · Carrusel · Título>"
//   node publicar-drive.cjs <…> <…> reel <out-reels/slug> "<Día…>" "<N · Reel · Título>"
//   node publicar-drive.cjs <…> <…> doc <archivo.html> "<carpeta destino o raíz>" "<título>"   (HTML → Google Doc)
//   node publicar-drive.cjs <…> <…> hoja <archivo.csv> "<carpeta destino o raíz>" "<título>"  (CSV → Google Sheet)
//   Con --reemplazar al final, lo que ya existe se actualiza (mismo enlace): docs, hojas, vídeos e imágenes.
const fs = require('fs'), path = require('path');
const { GoogleAuth } = require(process.argv[2] + '/node_modules/google-auth-library');
const [, , , keyFile, modo, origen, destino, titulo, opcion] = process.argv;
const API = 'https://www.googleapis.com/drive/v3/files', SUBIDA = 'https://www.googleapis.com/upload/drive/v3/files';
const RAIZ_PUB = '1 · Por publicar';
const TIPOS = { '.mp4': 'video/mp4', '.jpg': 'image/jpeg', '.png': 'image/png' };

(async () => {
  const c = await new GoogleAuth({ keyFile, scopes: ['https://www.googleapis.com/auth/drive'] }).getClient();
  const h = { 'x-goog-user-project': 'personal-franquizb' };
  const pedir = (o) => c.request({ ...o, headers: { ...h, ...(o.headers || {}) } }).then(r => r.data);
  const unidad = (await pedir({ url: 'https://www.googleapis.com/drive/v3/drives?pageSize=20' })).drives.find(d => d.name === 'FinanziApp');
  const buscar = async (nombre, padre, carpeta) => {
    const q = `name='${nombre.replace(/'/g, "\\'")}' and '${padre}' in parents and trashed=false` + (carpeta ? " and mimeType='application/vnd.google-apps.folder'" : '');
    return (await pedir({ url: `${API}?corpora=drive&driveId=${unidad.id}&includeItemsFromAllDrives=true&supportsAllDrives=true&fields=files(id,name)&q=${encodeURIComponent(q)}` })).files[0];
  };
  const carpeta = async (nombre, padre) => (await buscar(nombre, padre, true))
    || pedir({ url: `${API}?supportsAllDrives=true&fields=id,name`, method: 'POST', data: { name: nombre, mimeType: 'application/vnd.google-apps.folder', parents: [padre] } });
  const ruta = async (partes) => { let p = { id: unidad.id }; for (const x of partes.filter(Boolean)) p = await carpeta(x, p.id); return p; };
  // Subida multiparte; con `convertirA` Drive lo convierte (Doc u Hoja de cálculo).
  const subir = async (nombre, padre, datos, tipo, convertirA) => {
    const existe = await buscar(nombre, padre, false);
    if (existe && opcion === '--reemplazar' && !convertirA) {   // vídeos e imágenes: nuevo contenido, mismo enlace
      await pedir({ url: `${SUBIDA}/${existe.id}?uploadType=media&supportsAllDrives=true`, method: 'PATCH', headers: { 'Content-Type': tipo }, data: datos });
      return true;
    }
    if (existe) return false;
    const limite = 'finanziapp' + Date.now() + Math.random().toString(16).slice(2);
    const meta = { name: nombre, parents: [padre], ...(convertirA ? { mimeType: convertirA } : {}) };
    const cuerpo = Buffer.concat([Buffer.from(`--${limite}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(meta)}\r\n--${limite}\r\nContent-Type: ${tipo}\r\n\r\n`), datos, Buffer.from(`\r\n--${limite}--`)]);
    await pedir({ url: `${SUBIDA}?uploadType=multipart&supportsAllDrives=true&fields=id`, method: 'POST', headers: { 'Content-Type': `multipart/related; boundary=${limite}` }, data: cuerpo });
    return true;
  };
  const ent = (s) => [...s].map(ch => { const k = ch.codePointAt(0); return k > 127 ? `&#${k};` : ch; }).join('');
  const html = (txt) => ent(txt.replace(/&/g, '&amp;').replace(/</g, '&lt;')).split('\n').join('<br>');
  const docTextos = async (padre, en, es) => subir('Texto para copiar', padre, Buffer.from(`<html><head><meta charset="utf-8"></head><body>
    <h2>&#127482;&#127480; English (@finanziapp)</h2><p>${html(en)}</p><hr><h2>&#127466;&#127480; Espa&#241;ol (@finanziapp.es)</h2><p>${html(es)}</p></body></html>`), 'text/html', 'application/vnd.google-apps.document');

  let n = 0;
  if (modo === 'carrusel' || modo === 'reel') {
    const pub = await ruta([RAIZ_PUB, destino, titulo]);
    const mapa = modo === 'carrusel'
      ? [['en/4x5', 'Instagram EN'], ['es/4x5', 'Instagram ES'], ['en/9x16', 'TikTok EN'], ['es/9x16', 'TikTok ES']]
      : [['en', 'Reel EN (Instagram y TikTok)'], ['es', 'Reel ES (Instagram y TikTok)']];
    for (const [local, nombre] of mapa) {
      const dir = path.join(origen, local), destinoDir = await carpeta(nombre, pub.id);
      for (const f of fs.readdirSync(dir).sort()) { const t = TIPOS[path.extname(f)]; if (t && await subir(f, destinoDir.id, fs.readFileSync(path.join(dir, f)), t)) n++; }
    }
    const txt = (l) => fs.readFileSync(path.join(origen, modo === 'carrusel' ? `${l}/4x5/texto.txt` : `${l}/texto.txt`), 'utf8');
    if (await docTextos(pub.id, txt('en'), txt('es'))) n++;
    console.log(`✓ ${destino} → ${titulo}: ${n} archivos nuevos · https://drive.google.com/drive/folders/${pub.id}`);
  } else if (modo === 'doc' || modo === 'hoja') {
    const padre = destino === 'raíz' ? { id: unidad.id } : await ruta(destino.split('/'));
    const tipo = modo === 'doc' ? 'text/html' : 'text/csv', datos = fs.readFileSync(origen);
    const hecho = await subir(titulo, padre.id, datos, tipo, modo === 'doc' ? 'application/vnd.google-apps.document' : 'application/vnd.google-apps.spreadsheet');
    if (!hecho && opcion === '--reemplazar') {
      const { id } = await buscar(titulo, padre.id, false);
      await pedir({ url: `${SUBIDA}/${id}?uploadType=media&supportsAllDrives=true`, method: 'PATCH', headers: { 'Content-Type': tipo }, data: datos });
      console.log(`✓ ${modo} «${titulo}» actualizado`);
    } else console.log(hecho ? `✓ ${modo} «${titulo}» creado` : `· «${titulo}» ya existía`);
  }
})().catch(e => { console.log('error', e.response?.status, e.response?.data?.error?.message || e.message); process.exit(1); });
