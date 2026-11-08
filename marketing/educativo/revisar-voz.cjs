// Revisa la voz de un Reel hablado frase a frase con Gemini, que escucha cada toma:
// - comprueba que dice exactamente el texto del guion (a veces el modelo se inventa frases);
// - en español, que el acento sea peninsular (cada toma puede salir con seseo aunque se pida España).
// Las tomas que fallan se borran de la caché y se vuelven a generar.
// Uso: node revisar-voz.cjs <dir con google-auth-library> <credencial.json> <slug> [es|en…] [intentos=4]
//      SOLO=5,7 para revisar solo esas frases.
const path = require('path'), fs = require('fs');
const { sintetizar, limpiar } = require('./voz.cjs');
const [, , fbt, sa, slug, ...resto] = process.argv;
const idiomas = resto.filter(x => ['es', 'en'].includes(x));
const intentos = +resto.find(x => /^\d+$/.test(x)) || 4;
const reel = require(path.join(__dirname, 'reels-voz', 'cargar.js'))(slug);
const JUEZ = {
  es: (txt) => `Texto del guion: «${txt}»
Escucha esta frase de una locución en español y responde SOLO con JSON:
{"transcripcion":"lo que oyes","coincide":true|false,"acento":"españa|latinoamerica|mixto","peninsular":0-10,"nota":"comentario breve"}
- coincide: dice el texto del guion sin añadir ni quitar frases (ignora puntuación, números escritos con cifras y etiquetas entre corchetes).
- peninsular: lo claramente que suena a hablante nativo de España (10 = locutor español; 0 = latinoamericano). Juzga SOLO la pronunciación y la entonación (si la z y la c de ce/ci suenan /θ/ o /s/), NO el vocabulario: el texto está escrito para España a propósito.`,
  en: (txt) => `Script text: "${txt}"
Listen to this line of a voice-over and answer ONLY with JSON:
{"transcripcion":"what you hear","coincide":true|false,"nota":"short comment"}
- coincide: it says the script text without adding or dropping sentences (ignore punctuation, numbers written as digits and bracketed tags).`
};
(async () => {
  const { GoogleAuth } = require(path.join(fbt, 'node_modules/google-auth-library'));
  const c = await new GoogleAuth({ keyFile: sa, scopes: ['https://www.googleapis.com/auth/cloud-platform'] }).getClient();
  const juzgar = async (wav, pregunta, n = 0) => {
    try {
      const r = await c.request({ url: 'https://aiplatform.googleapis.com/v1/projects/personal-franquizb/locations/global/publishers/google/models/gemini-3-flash-preview:generateContent', method: 'POST',
        data: { contents: [{ role: 'user', parts: [{ inlineData: { mimeType: 'audio/wav', data: fs.readFileSync(wav).toString('base64') } }, { text: pregunta }] }], generationConfig: { temperature: 0, responseMimeType: 'application/json' } } });
      return JSON.parse(r.data.candidates[0].content.parts.map(p => p.text || '').join(''));
    } catch (e) { if (n < 2 && !e.response) { await new Promise(ok => setTimeout(ok, 3000)); return juzgar(wav, pregunta, n + 1); } throw e; }
  };
  const solo = process.env.SOLO ? process.env.SOLO.split(',').map(Number) : null;
  let malas = 0;
  for (const lang of idiomas.length ? idiomas : Object.keys(reel.T)) {   // Reels de una sola cuenta: solo su idioma
    for (const [i, [, frase]] of reel.T[lang].guion.entries()) {
      if (solo && !solo.includes(i + 1)) continue;
      for (let n = 1; n <= intentos; n++) {
        const [v] = await sintetizar([frase], reel.voz[lang], { fbt, sa });
        const j = await juzgar(v.archivo, JUEZ[lang](limpiar(frase)));
        const ok = j.coincide && (lang !== 'es' || (j.acento === 'españa' && j.peninsular >= 8));
        console.log(`${ok ? '✓' : '✗'} ${lang} ${String(i + 1).padStart(2)} toma ${n} · ${v.dur.toFixed(1)} s${lang === 'es' ? ` · ${j.acento} ${j.peninsular}/10` : ''}${j.coincide ? '' : ' · NO COINCIDE: «' + j.transcripcion + '»'} · ${j.nota}`);
        if (ok) break;
        if (n === intentos) { malas++; break; }
        for (const f of [v.archivo, v.archivo.replace(/-p\d+-t\d+\.wav$/, '.wav')]) if (fs.existsSync(f)) fs.unlinkSync(f);
      }
    }
  }
  console.log(malas ? `⚠ ${malas} frase(s) sin una toma buena` : '✓ todas las frases revisadas');
})().catch(e => { console.log('error', e.response?.status, e.response?.data?.error?.message || e.message); process.exit(1); });
