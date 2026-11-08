// Configuración del panel de redes (franquizb.com) que no sale de la API de Meta, guardada en Firestore (estadisticas/config):
// - publicados: qué vídeo nuestro es cada publicación (publicados.json, lo rellenan los scripts de publicar);
// - videos: slug, cuenta y primera línea del texto de cada vídeo renderizado (out-reels/), para reconocerlos por el texto;
// - referentes: cuentas grandes y hashtags que se vigilan para cada cuenta (el panel deja añadir y quitar);
// - notas: conclusiones de Claude por cuenta (estadisticas-notas.json);
// - abiertas: preguntas con las que acaba un vídeo y que aún hay que responder (reels-voz/REGISTRO.md).
// Con --cuaderno sube también cuaderno.json a estadisticas/cuaderno (sustituye lo editado en el panel: solo para empezar).
// Uso: node panel-config.cjs <dir con google-auth-library> <credencial.json> [--cuaderno] [--solo-archivo salida.json]
const fs = require('fs'), path = require('path');
const [, , fbt, sa] = process.argv;
const AQUI = __dirname, leer = (f) => JSON.parse(fs.readFileSync(path.join(AQUI, f), 'utf8'));

function videos() {
  const base = path.join(AQUI, 'out-reels'), lista = [];
  if (!fs.existsSync(base)) return lista;
  for (const slug of fs.readdirSync(base)) for (const cuenta of ['en', 'es']) {
    const txt = path.join(base, slug, cuenta, 'texto.txt');
    if (fs.existsSync(txt)) lista.push({ slug, cuenta, inicio: fs.readFileSync(txt, 'utf8').split('\n')[0].trim().slice(0, 80) });
  }
  return lista;
}

// Preguntas con las que acaba un vídeo y que hay que responder en otro (REGISTRO.md, «- ES: …» / «- EN: …»).
function abiertas() {
  const reg = fs.readFileSync(path.join(AQUI, 'reels-voz', 'REGISTRO.md'), 'utf8'), out = { en: [], es: [] };
  for (const l of (reg.split('## Pendientes')[1] || '').split('\n')) {
    const m = l.match(/^- (ES|EN): (.+)$/);
    if (m) out[m[1].toLowerCase()].push(m[2].trim());
  }
  return out;
}

const REFERENTES = {
  en: { cuentas: ['humphreytalks', 'thefinancialdiet', 'herfirst100k', 'ramit', 'personalfinanceclub', 'thebudgetmom', 'minoritymindset'], hashtags: ['personalfinance', 'moneytips'] },
  es: { cuentas: [], hashtags: ['finanzaspersonales', 'ahorro', 'educacionfinanciera'] }
};

(async () => {
  const notas = leer('estadisticas-notas.json');
  const config = {
    publicados: leer('publicados.json'), videos: videos(),
    notas: Array.isArray(notas) ? { en: notas, es: notas } : notas,
    referentes: REFERENTES,
    abiertas: abiertas()
  };
  const docs = { config };
  if (process.argv.includes('--cuaderno')) docs.cuaderno = leer('cuaderno.json');
  const i = process.argv.indexOf('--solo-archivo');
  if (i > 0) { fs.writeFileSync(process.argv[i + 1], JSON.stringify(docs, null, 2)); console.log('✓ archivo', process.argv[i + 1]); return; }

  const { GoogleAuth } = require(path.join(fbt, 'node_modules/google-auth-library'));
  const c = await new GoogleAuth({ keyFile: sa, scopes: ['https://www.googleapis.com/auth/datastore'] }).getClient();
  const URL = 'https://firestore.googleapis.com/v1/projects/personal-franquizb/databases/(default)/documents/estadisticas/';
  // La lista de referentes se edita en el panel: si ya existe, se conserva.
  if (!process.argv.includes('--referentes')) {
    try {
      const r = await c.request({ url: URL + 'config', headers: { 'x-goog-user-project': 'personal-franquizb' } });
      const previa = JSON.parse(r.data.fields.json.stringValue);
      if (previa.referentes) config.referentes = previa.referentes;
    } catch { /* primera vez */ }
  }
  for (const [doc, valor] of Object.entries(docs)) {
    await c.request({ url: URL + doc, method: 'PATCH', headers: { 'x-goog-user-project': 'personal-franquizb' },
      data: { fields: { json: { stringValue: JSON.stringify(valor) }, actualizado: { integerValue: String(Date.now()) } } } });
    console.log(`✓ estadisticas/${doc} (${Math.round(JSON.stringify(valor).length / 1024)} KB)`);
  }
})().catch(e => { console.error('error:', e.response ? JSON.stringify(e.response.data) : e.message); process.exit(1); });
