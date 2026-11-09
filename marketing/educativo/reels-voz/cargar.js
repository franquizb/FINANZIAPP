// Carga un Reel hablado por su slug: reels-voz/<slug>.js o, si no existe, el que lo contenga en un lote (reels-voz/lote*.js,
// que exportan { pildoras: { slug: reel } }).
const fs = require('fs'), path = require('path');
module.exports = function cargar(slug) {
  const f = path.join(__dirname, slug + '.js');
  if (fs.existsSync(f)) return require(f);
  for (const n of fs.readdirSync(__dirname).filter(x => /^(lote|reto).*\.js$/.test(x))) {
    const m = require(path.join(__dirname, n));
    if (m.pildoras && m.pildoras[slug]) return m.pildoras[slug];
  }
  throw new Error('No encuentro el Reel «' + slug + '» en reels-voz/');
};
