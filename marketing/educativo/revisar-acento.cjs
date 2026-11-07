// Genera cada frase en español, la escucha Gemini y repite las que no suenan claramente de España.
// Uso: node revisar-acento.cjs <dir con google-auth-library> <credencial.json> <slug> [intentos=3]  (SOLO=5,7 para unas frases)
// Gemini escucha cada toma y juzga solo la pronunciación; las tomas con seseo o entonación
// no peninsular se borran de la caché y se vuelven a generar.
const path = require('path'), fs = require('fs');
const ED = __dirname;
const { sintetizar } = require(ED + '/voz.cjs');
const [, , fbt, sa, slug, intentosTxt] = process.argv;
const reel = require(`${ED}/reels-voz/${slug}.js`);
const JUEZ = `Escucha esta frase de una locución en español. Responde SOLO con JSON:
{"acento":"españa|latinoamerica|mixto","peninsular":0-10,"sarcasmo":0-10,"nota":"comentario breve"}
peninsular = lo claramente que suena a hablante nativo de España (10 = locutor español; 0 = latinoamericano).
Juzga SOLO la pronunciación y la entonación (por ejemplo, si la z y la c de ce/ci suenan /θ/ o /s/), NO el vocabulario ni la gramática: el texto está escrito para España a propósito.`;
(async () => {
  const { GoogleAuth } = require(path.join(fbt, 'node_modules/google-auth-library'));
  const c = await new GoogleAuth({ keyFile: sa, scopes: ['https://www.googleapis.com/auth/cloud-platform'] }).getClient();
  const juzgar = async (wav, n = 0) => {
    const r = await c.request({ url: 'https://aiplatform.googleapis.com/v1/projects/personal-franquizb/locations/global/publishers/google/models/gemini-3-flash-preview:generateContent', method: 'POST',
      data: { contents: [{ role: 'user', parts: [{ inlineData: { mimeType: 'audio/wav', data: fs.readFileSync(wav).toString('base64') } }, { text: JUEZ }] }], generationConfig: { temperature: 0, responseMimeType: 'application/json' } } })
      .catch((e) => (n < 2 && !e.response ? new Promise(ok => setTimeout(ok, 3000)).then(() => juzgar(wav, n + 1)) : Promise.reject(e)));
    if (!r.data) return r;   // ya viene interpretado de un reintento
    return JSON.parse(r.data.candidates[0].content.parts.map(p => p.text || '').join(''));
  };
  const voz = reel.voz.es;
  const solo = process.env.SOLO ? process.env.SOLO.split(',').map(Number) : null;
  for (const [i, [, frase]] of reel.T.es.guion.entries()) {
    if (solo && !solo.includes(i + 1)) continue;
    for (let n = 1; n <= (+intentosTxt || 3); n++) {
      const [v] = await sintetizar([frase], voz, { fbt, sa });
      const j = await juzgar(v.archivo);
      const ok = j.acento === 'españa' && j.peninsular >= 8;
      console.log(`${ok ? '✓' : '✗'} ${String(i + 1).padStart(2)} toma ${n}: ${j.acento} ${j.peninsular}/10 · sarcasmo ${j.sarcasmo} · ${j.nota} · «${frase.replace(/[*§]/g, '').slice(0, 50)}»`);
      if (ok) break;
      if (n < (+intentosTxt || 3)) for (const f of [v.archivo, v.archivo.replace(/-p\d+-t\d+\.wav$/, '.wav')]) if (fs.existsSync(f)) fs.unlinkSync(f);
    }
  }
})().catch(e => { console.log('error', e.response?.status, e.response?.data?.error?.message || e.message); process.exit(1); });
