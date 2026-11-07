# Mezcla la voz en off con la música de fondo para los Reels hablados.
# La música baja mientras se habla (ducking suave) y sube en los silencios.
# Uso: python3 mezcla.py <spec.json>
#   spec = { "total": s, "frases": [{"archivo": wav, "ini": s}], "musica": wav, "salida": wav }
import json, sys, wave
import numpy as np

spec = json.load(open(sys.argv[1]))
SR = 44100
n = int(round(spec['total'] * SR))

def leer(archivo):
    with wave.open(archivo, 'rb') as w:
        sr, canales, ancho = w.getframerate(), w.getnchannels(), w.getsampwidth()
        x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float64) / 32768
    x = x.reshape(-1, canales).mean(axis=1) if canales > 1 else x
    if sr != SR:  # remuestreo lineal (las voces ya vienen a 44,1 kHz; por si acaso)
        t = np.arange(int(len(x) * SR / sr)) * sr / SR
        x = np.interp(t, np.arange(len(x)), x)
    return x

voz = np.zeros(n)
activa = np.zeros(n)
for f in spec['frases']:
    x = leer(f['archivo'])
    a = int(round(f['ini'] * SR)); b = min(n, a + len(x))
    voz[a:b] += x[:b - a]
    activa[a:b] = 1

# Normaliza la voz (pico a −1,5 dBFS) si hay voz real.
pico = np.max(np.abs(voz))
if pico > 1e-4:
    voz *= 10 ** (-1.5 / 20) / pico

# Envolvente de la música: 0,22 bajo la voz, 0,75 en silencio, con transiciones de ~0,35 s.
ganancia = np.where(activa > 0, 0.22, 0.75)
k = int(0.35 * SR)
ventana = np.ones(k) / k
ganancia = np.convolve(np.pad(ganancia, (k, k), mode='edge'), ventana, mode='same')[k:-k]

m = leer(spec['musica'])
musica = np.zeros(n); musica[:min(n, len(m))] = m[:n]
mezcla = voz + musica * ganancia
mezcla /= max(1.0, np.max(np.abs(mezcla)) / 0.95)
pcm = (mezcla * 32767).astype(np.int16)
with wave.open(spec['salida'], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes(np.column_stack([pcm, pcm]).ravel().tobytes())
