# Momento exacto de cada palabra en las tomas de voz, para los subtítulos palabra a palabra y las marcas §.
# Escucha cada toma con Whisper (faster-whisper, en local y gratis) y casa lo que oye con el texto del guion,
# que ya sabemos: así los tiempos son los de la voz real aunque Whisper se equivoque en alguna palabra.
# Uso: python alinear.py <spec.json>
#   spec = { "idioma": "es", "modelo": "small", "clips": [{ "archivo": wav, "palabras": ["Sabes", "que", …] }] }
# Escribe <wav>.palabras.json = [[ini, fin], …] (segundos dentro de la toma, una pareja por palabra) y lo
# reutiliza si ya existe. Sin faster-whisper instalado termina con código 3 y el motor reparte el tiempo
# por el largo de las palabras.
import json, os, re, sys, unicodedata
from difflib import SequenceMatcher

spec = json.load(open(sys.argv[1]))
pendientes = [c for c in spec['clips'] if not os.path.exists(c['archivo'] + '.palabras.json')]
if not pendientes:
    sys.exit(0)
try:
    from faster_whisper import WhisperModel
except ImportError:
    sys.exit(3)

def audio16k(archivo):
    # Se lee el WAV aquí (16 kHz, mono) para no depender de la versión de PyAV.
    import wave
    import numpy as np
    with wave.open(archivo, 'rb') as w:
        sr, canales = w.getframerate(), w.getnchannels()
        x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
    if canales > 1:
        x = x.reshape(-1, canales).mean(axis=1)
    t = np.arange(int(len(x) * 16000 / sr)) * sr / 16000
    return np.interp(t, np.arange(len(x)), x).astype(np.float32)

def norm(w):
    w = unicodedata.normalize('NFD', w.lower())
    w = ''.join(ch for ch in w if unicodedata.category(ch) != 'Mn')
    return re.sub(r'[^a-z0-9ñ$€%]+', '', w)

modelo = WhisperModel(spec.get('modelo', 'small'), device='cpu', compute_type='int8')
for c in pendientes:
    guion = c['palabras']
    segs, _ = modelo.transcribe(audio16k(c['archivo']), language=spec['idioma'], word_timestamps=True, beam_size=5,
                                initial_prompt=' '.join(guion), vad_filter=False, condition_on_previous_text=False)
    oidas = [w for s in segs for w in (s.words or [])]
    a, b = [norm(w) for w in guion], [norm(w.word) for w in oidas]
    tiempos = [None] * len(guion)
    for bloque in SequenceMatcher(None, a, b, autojunk=False).get_matching_blocks():
        for k in range(bloque.size):
            w = oidas[bloque.b + k]
            tiempos[bloque.a + k] = [round(w.start, 3), round(w.end, 3)]
    # Palabras sin pareja (números dichos en letra, nombres…): se reparten entre las vecinas por su largo.
    fin_total = round(oidas[-1].end, 3) if oidas else 0.5 * len(guion)
    i = 0
    while i < len(guion):
        if tiempos[i] is not None:
            i += 1; continue
        j = i
        while j < len(guion) and tiempos[j] is None:
            j += 1
        desde = tiempos[i - 1][1] if i > 0 else (round(oidas[0].start, 3) if oidas else 0)
        hasta = tiempos[j][0] if j < len(guion) else fin_total
        hasta = max(hasta, desde + 0.12 * (j - i))
        largos = [max(1, len(guion[k])) for k in range(i, j)]
        t = desde
        for k, l in zip(range(i, j), largos):
            d = (hasta - desde) * l / sum(largos)
            tiempos[k] = [round(t, 3), round(t + d, 3)]
            t += d
        i = j
    json.dump(tiempos, open(c['archivo'] + '.palabras.json', 'w'))
    print(f"✓ {os.path.basename(c['archivo'])}: {len(oidas)} palabras oídas, {len(guion)} del guion")
