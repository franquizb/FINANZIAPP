// Qué Reels usan tomas de voz cuyos tiempos de palabras son más viejos que el audio (subtítulos desajustados).
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const dir = process.argv[2];
const { limpiar } = require(path.join(dir, 'voz.cjs'));
const cache = path.join(dir, 'cache-voz');
const viejas = new Set();
for (const j of fs.readdirSync(cache).filter(x => x.endsWith('.palabras.json'))) {
  const w = path.join(cache, j.replace(/\.palabras\.json$/, ''));
  if (fs.existsSync(w) && fs.statSync(path.join(cache, j)).mtimeMs < fs.statSync(w).mtimeMs - 2000) viejas.add(j.slice(0, 16));
}
const rv = path.join(dir, 'reels-voz'); const reels = {};
for (const n of fs.readdirSync(rv).filter(x => x.endsWith('.js') && !/^(_comun|cargar|plantillas|tres)\.js$/.test(x))) {
  let m; try { m = require(path.join(rv, n)); } catch (e) { continue; }
  if (m.pildoras) Object.assign(reels, m.pildoras); else if (m.T) reels[n.replace(/\.js$/, '')] = m;
}
for (const [slug, reel] of Object.entries(reels)) for (const lang of Object.keys(reel.T || {})) {
  const voz = (reel.voz || {})[lang]; if (!voz || !reel.T[lang].guion) continue;
  const malas = [];
  reel.T[lang].guion.forEach(([, f], i) => {
    const txt = limpiar(f, !!voz.modelo);
    const clave = crypto.createHash('sha1').update([voz.modelo || '', voz.estilo || '', voz.nombre, voz.ritmo || 1, txt].join('|')).digest('hex').slice(0, 16);
    if (viejas.has(clave)) malas.push(i + 1);
  });
  if (malas.length) console.log(slug, lang, 'frases', malas.join(','));
}
console.log('tomas viejas:', viejas.size);
