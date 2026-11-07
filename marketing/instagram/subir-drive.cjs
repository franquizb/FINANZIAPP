// Sube la carpeta de una semana de consejos a la unidad compartida «FinanziApp».
// Uso: node subir-drive.cjs <dir-fbt> <sa.json> <dir-local-semana> "<nombre carpeta en Drive>"
// Estructura: FinanziApp / Marketing / <semana> / {EN - TikTok @finanziapp, ES - TikTok @finanziapp.es}
// Es idempotente: reutiliza carpetas y no vuelve a subir archivos que ya existen.
const fs = require('fs'), path = require('path');
const { GoogleAuth } = require(process.argv[2] + '/node_modules/google-auth-library');
const [, , , keyFile, dirLocal, nombreSemana] = process.argv;
const API = 'https://www.googleapis.com/drive/v3/files', SUBIDA = 'https://www.googleapis.com/upload/drive/v3/files';
const TIPOS = { '.mp4': 'video/mp4', '.jpg': 'image/jpeg', '.png': 'image/png', '.md': 'text/markdown' };
(async () => {
  const c = await new GoogleAuth({ keyFile, scopes: ['https://www.googleapis.com/auth/drive'] }).getClient();
  const h = { 'x-goog-user-project': 'personal-franquizb' };
  const pedir = (o) => c.request({ ...o, headers: { ...h, ...(o.headers || {}) } }).then(r => r.data);
  const unidad = (await pedir({ url: 'https://www.googleapis.com/drive/v3/drives?pageSize=20' })).drives.find(d => d.name === 'FinanziApp');
  if (!unidad) throw new Error('No veo la unidad compartida FinanziApp');
  const buscar = async (nombre, padre, carpeta) => {
    const q = `name='${nombre.replace(/'/g, "\\'")}' and '${padre}' in parents and trashed=false` + (carpeta ? " and mimeType='application/vnd.google-apps.folder'" : '');
    const r = await pedir({ url: `${API}?corpora=drive&driveId=${unidad.id}&includeItemsFromAllDrives=true&supportsAllDrives=true&fields=files(id,name,size)&q=${encodeURIComponent(q)}` });
    return r.files[0];
  };
  const carpeta = async (nombre, padre) => (await buscar(nombre, padre, true))
    || pedir({ url: `${API}?supportsAllDrives=true&fields=id,name`, method: 'POST', data: { name: nombre, mimeType: 'application/vnd.google-apps.folder', parents: [padre] } });
  const marketing = await carpeta('Marketing', unidad.id);
  for (const n of ['Instagram', 'TikTok']) await carpeta(n, marketing.id);
  await carpeta('Documentos', unidad.id);
  const semana = await carpeta(nombreSemana, marketing.id);
  let subidos = 0, saltados = 0, bytes = 0;
  for (const [sub, destino] of [['en', 'EN - TikTok @finanziapp'], ['es', 'ES - TikTok @finanziapp.es']]) {
    const dir = await carpeta(destino, semana.id);
    for (const f of fs.readdirSync(path.join(dirLocal, sub)).sort()) {
      const tipo = TIPOS[path.extname(f)]; if (!tipo) continue;
      if (await buscar(f, dir.id, false)) { saltados++; continue; }
      const datos = fs.readFileSync(path.join(dirLocal, sub, f));
      const limite = 'finanziapp' + Date.now();
      const cuerpo = Buffer.concat([
        Buffer.from(`--${limite}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify({ name: f, parents: [dir.id] })}\r\n--${limite}\r\nContent-Type: ${tipo}\r\n\r\n`),
        datos, Buffer.from(`\r\n--${limite}--`)]);
      await pedir({ url: `${SUBIDA}?uploadType=multipart&supportsAllDrives=true&fields=id`, method: 'POST', headers: { 'Content-Type': `multipart/related; boundary=${limite}` }, data: cuerpo });
      subidos++; bytes += datos.length;
    }
  }
  console.log(`unidad «FinanziApp» → Marketing → ${nombreSemana}: ${subidos} archivos subidos (${(bytes / 1048576).toFixed(1)} MB), ${saltados} ya estaban`);
  console.log('carpeta:', `https://drive.google.com/drive/folders/${semana.id}`);
})().catch(e => { console.log('error', e.response?.status, e.response?.data?.error?.message || e.message); process.exit(1); });
