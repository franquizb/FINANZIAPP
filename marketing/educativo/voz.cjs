// Voz en off para los Reels hablados: Google Cloud Text-to-Speech. Con `modelo`
// (Gemini TTS) la voz se dirige como a un actor: `estilo` da el tono y el texto
// admite etiquetas en inglés entre corchetes ([sarcasm], [sigh], [short pause]…).
// Cada frase se sintetiza por separado (así se sabe cuándo empieza cada una) y se
// guarda en cache-voz/ para no volver a pagarla al repetir el render.
// Sin credencial (o con --sin-voz) devuelve silencios con la duración estimada,
// para revisar la animación antes de tener la voz.
const fs = require('fs'), path = require('path'), crypto = require('crypto');

const SR = 44100;
const CACHE = path.join(__dirname, 'cache-voz');
// Texto que se lee: sin *resaltados* ni marcas §; las [etiquetas] solo las entiende Gemini.
const limpiar = (txt, etiquetas = false) => {
  const t = txt.replace(/[*§]/g, '');
  return (etiquetas ? t : t.replace(/\[[^\]]*\]\s*/g, '')).replace(/\s+/g, ' ').trim();
};
// Envuelve PCM de 16 bits sin cabecera en un WAV.
function aWav(pcm, sr) {
  const cab = Buffer.alloc(44);
  cab.write('RIFF', 0); cab.writeUInt32LE(36 + pcm.length, 4); cab.write('WAVEfmt ', 8);
  cab.writeUInt32LE(16, 16); cab.writeUInt16LE(1, 20); cab.writeUInt16LE(1, 22); cab.writeUInt32LE(sr, 24);
  cab.writeUInt32LE(sr * 2, 28); cab.writeUInt16LE(2, 32); cab.writeUInt16LE(16, 34); cab.write('data', 36); cab.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([cab, pcm]);
}

// Duración de un WAV PCM (busca el bloque «data»).
function durWav(archivo) {
  const b = fs.readFileSync(archivo);
  const canales = b.readUInt16LE(22), sr = b.readUInt32LE(24), bits = b.readUInt16LE(34);
  let i = 12;
  while (i < b.length - 8) {
    const id = b.toString('ascii', i, i + 4), tam = b.readUInt32LE(i + 4);
    if (id === 'data') return Math.min(tam, b.length - i - 8) / (sr * canales * bits / 8);
    i += 8 + tam + (tam % 2);
  }
  throw new Error('WAV sin datos: ' + archivo);
}

function silencio(archivo, segundos) {
  const n = Math.round(segundos * SR), datos = Buffer.alloc(n * 2), cab = Buffer.alloc(44);
  cab.write('RIFF', 0); cab.writeUInt32LE(36 + datos.length, 4); cab.write('WAVEfmt ', 8);
  cab.writeUInt32LE(16, 16); cab.writeUInt16LE(1, 20); cab.writeUInt16LE(1, 22); cab.writeUInt32LE(SR, 24);
  cab.writeUInt32LE(SR * 2, 28); cab.writeUInt16LE(2, 32); cab.writeUInt16LE(16, 34); cab.write('data', 36); cab.writeUInt32LE(datos.length, 40);
  fs.writeFileSync(archivo, Buffer.concat([cab, datos]));
}

// frases: textos del guion. voz: { nombre, idioma, modelo?, estilo?, ritmo? }.
// cred: { fbt, sa } o null. Devuelve [{ archivo, dur, real }].
async function sintetizar(frases, voz, cred) {
  fs.mkdirSync(CACHE, { recursive: true });
  let cliente = null;
  if (cred) {
    const { GoogleAuth } = require(path.join(cred.fbt, 'node_modules/google-auth-library'));
    cliente = await new GoogleAuth({ keyFile: cred.sa, scopes: ['https://www.googleapis.com/auth/cloud-platform'] }).getClient();
  }
  const out = [];
  for (const f of frases) {
    const txt = limpiar(f, !!voz.modelo);
    const clave = crypto.createHash('sha1').update([voz.modelo || '', voz.estilo || '', voz.nombre, voz.ritmo || 1, txt].join('|')).digest('hex').slice(0, 16);
    const archivo = path.join(CACHE, `${clave}.wav`);
    if (!fs.existsSync(archivo) && cliente) {
      const r = await cliente.request({
        url: 'https://texttospeech.googleapis.com/v1/text:synthesize', method: 'POST',
        headers: { 'x-goog-user-project': 'personal-franquizb' },
        data: voz.modelo
          ? { input: { prompt: voz.estilo, text: txt }, voice: { languageCode: voz.idioma, name: voz.nombre, modelName: voz.modelo }, audioConfig: { audioEncoding: 'LINEAR16' } }
          : { input: { text: txt }, voice: { languageCode: voz.idioma, name: voz.nombre },
            audioConfig: { audioEncoding: 'LINEAR16', sampleRateHertz: SR, ...(voz.ritmo ? { speakingRate: voz.ritmo } : {}) } }
      });
      const b = Buffer.from(r.data.audioContent, 'base64');
      fs.writeFileSync(archivo, b.toString('ascii', 0, 4) === 'RIFF' ? b : aWav(b, 24000));
    }
    if (fs.existsSync(archivo)) out.push({ archivo, dur: durWav(archivo), real: true });
    else {
      // Estimación: unos 15 caracteres por segundo, más un respiro.
      const prov = path.join(CACHE, `prov-${clave}.wav`), dur = limpiar(f).length / 16.5 + 0.2 + (txt.match(/\[[^\]]*pause\]/g) || []).length * 0.5;
      silencio(prov, dur);
      out.push({ archivo: prov, dur, real: false });
    }
  }
  return out;
}

module.exports = { sintetizar, limpiar, SR };
