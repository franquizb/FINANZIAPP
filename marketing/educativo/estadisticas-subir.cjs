// Junta las estadísticas propias, los referentes y las conclusiones, y las guarda en Firestore
// (estadisticas/instagram), de donde las lee la web privada estadisticas.franquizb.com.
// Solo el propietario puede leer ese documento (firestore.rules); se escribe con la cuenta de servicio.
// Uso: node estadisticas-subir.cjs <dir con google-auth-library> <credencial.json> <propias.json> <referentes.json> [--solo-archivo salida.json]
const fs = require('fs'), path = require('path');
const [, , fbt, sa, propias, referentes] = process.argv;

const p = JSON.parse(fs.readFileSync(propias, 'utf8')), r = JSON.parse(fs.readFileSync(referentes, 'utf8'));
const notas = JSON.parse(fs.readFileSync(path.join(__dirname, 'estadisticas-notas.json'), 'utf8'));
const datos = { actualizado: new Date().toISOString(), propias: p.filas, referentes: r, notas };

(async () => {
  const i = process.argv.indexOf('--solo-archivo');
  if (i > 0) { fs.writeFileSync(process.argv[i + 1], JSON.stringify(datos)); console.log('✓ archivo', process.argv[i + 1]); return; }
  const { GoogleAuth } = require(path.join(fbt, 'node_modules/google-auth-library'));
  const c = await new GoogleAuth({ keyFile: sa, scopes: ['https://www.googleapis.com/auth/datastore'] }).getClient();
  const json = JSON.stringify(datos);
  await c.request({
    url: 'https://firestore.googleapis.com/v1/projects/personal-franquizb/databases/(default)/documents/estadisticas/instagram',
    method: 'PATCH', headers: { 'x-goog-user-project': 'personal-franquizb' },
    data: { fields: { json: { stringValue: json }, actualizado: { integerValue: String(Date.now()) } } }
  });
  console.log(`✓ estadísticas guardadas (${(json.length / 1024).toFixed(0)} KB)`);
})().catch(e => { console.log('error', e.response?.status, e.response?.data?.error?.message || e.message); process.exit(1); });
