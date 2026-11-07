// Carruseles educativos (Instagram y TikTok en modo foto).
// Uso: node carrusel.js <tema> [en|es…] [4x5|9x16…]
// Salida: out/<tema>/<idioma>/<formato>/01.jpg … y texto.txt (la descripción)
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { pagina } = require('./comun');

const FORMATOS = {
  '4x5': { w: 1080, h: 1350, arriba: 68, abajo: 60, lado: 76, h1: 76, txt: 34, centrar: true },
  // TikTok tapa arriba (pestañas) y abajo (descripción): margen amplio y contenido centrado.
  '9x16': { w: 1080, h: 1920, arriba: 210, abajo: 330, lado: 76, h1: 80, txt: 36, centrar: true }
};

(async () => {
  const args = process.argv.slice(2);
  const tema = require(`./temas/${args[0]}.js`);
  const idiomas = args.filter(a => ['en', 'es'].includes(a));
  const formatos = args.filter(a => FORMATOS[a]);
  const browser = await chromium.launch();
  for (const lang of idiomas.length ? idiomas : ['en', 'es']) {
    const t = tema.T[lang];
    for (const fmt of formatos.length ? formatos : Object.keys(FORMATOS)) {
      const F = FORMATOS[fmt];
      const dir = path.join(__dirname, 'out', tema.slug, lang, fmt);
      fs.mkdirSync(dir, { recursive: true });
      const page = await browser.newPage({ viewport: { width: F.w, height: F.h }, deviceScaleFactor: 1 });
      const total = tema.diapositivas.length;
      for (const [i, d] of tema.diapositivas.entries()) {
        const pie = i === 0 ? t.desliza : i === total - 1 ? 'finanziapp.com' : '';
        const html = pagina({ F, lang, kicker: t.kicker, n: i + 1, total, contenido: d(t, lang), pie });
        const tmp = path.join(dir, '.tmp.html');
        fs.writeFileSync(tmp, html);
        await page.goto('file://' + tmp, { waitUntil: 'load' });
        await page.evaluate(() => document.fonts.ready);
        const desborda = await page.evaluate(() => { const c = document.querySelector('.cuerpo'); return c.scrollHeight > c.clientHeight + 2; });
        await page.screenshot({ path: path.join(dir, String(i + 1).padStart(2, '0') + '.jpg'), type: 'jpeg', quality: 93 });
        fs.unlinkSync(tmp);
        if (desborda) console.log(`⚠ ${lang} ${fmt} diapositiva ${i + 1}: el contenido no cabe`);
      }
      await page.close();
      fs.writeFileSync(path.join(dir, 'texto.txt'), tema.texto[lang]);
      console.log(`✓ ${tema.slug} ${lang} ${fmt}: ${total} diapositivas`);
    }
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
