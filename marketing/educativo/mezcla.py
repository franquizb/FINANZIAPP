# Mezcla la voz en off con la música de fondo para los Reels hablados.
# La música baja mientras se habla (ducking suave) y sube en los silencios.
# Uso: python3 mezcla.py <spec.json>
#   spec = { "total": s, "frases": [{"archivo": wav, "ini": s}], "musica": wav, "salida": wav,
#            "sonidos": [{"archivo": wav, "ini": s, "vol": 0.3, "fin": s}] }
#   "musica": null → sin música (la voz y los efectos solos; los huecos quedan en silencio digital).
#   "fin" (opcional): el efecto se corta en seco en ese segundo (rampa de 4 ms para que no haga clic).
#   "baja" (opcional): {"desde": s, "db": -3}: el efecto baja db dB a partir de ese segundo (rampa de 0,25 s).
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

# Efectos de sonido: encima de todo, sin bajar la música.
efectos = np.zeros(n)
for e in spec.get('sonidos', []):
    x = leer(e['archivo']) * e.get('vol', 0.3)
    a = int(round(e['ini'] * SR)); b = min(n, a + len(x))
    if e.get('baja'):  # baja db dB desde el segundo «desde» (rampa de 0,25 s) hasta el final del efecto
        d = int(round(e['baja']['desde'] * SR)) - a
        x = x * (1 + (10 ** (e['baja']['db'] / 20) - 1) * np.clip((np.arange(len(x)) - d) / (0.25 * SR), 0, 1))
    if e.get('fin') is not None:
        b = min(b, int(round(e['fin'] * SR)))
        r = min(int(0.004 * SR), max(0, b - a))
        if r: x = x.copy(); x[b - a - r:b - a] *= np.linspace(1, 0, r)
    if a < b: efectos[a:b] += x[:b - a]

musica = np.zeros(n)
if spec.get('musica'):
    m = leer(spec['musica'])
    musica[:min(n, len(m))] = m[:n]
mezcla = voz + musica * ganancia + efectos
mezcla /= max(1.0, np.max(np.abs(mezcla)) / 0.95)
pcm = (mezcla * 32767).astype(np.int16)
with wave.open(spec['salida'], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes(np.column_stack([pcm, pcm]).ravel().tobytes())
