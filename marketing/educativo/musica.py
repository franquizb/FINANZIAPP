# Música de fondo original para los Reels: un colchón suave de acordes
# (Cmaj7 → Am7 → Fmaj7 → G6), sin derechos de terceros. Síntesis aditiva con
# envolventes lentas, un poco de desafinado (coro), filtro paso bajo y una
# reverberación sencilla. Uso: python3 musica.py <segundos> <salida.wav>
import sys, wave
import numpy as np

SR = 44100
dur = float(sys.argv[1])
salida = sys.argv[2]
n = int(SR * dur)
t = np.arange(n) / SR

def nota(nombre):
    base = {'C': -9, 'D': -7, 'E': -5, 'F': -4, 'G': -2, 'A': 0, 'B': 2}
    letra, octava = nombre[0], int(nombre[-1])
    semitonos = base[letra] + (octava - 4) * 12
    return 440.0 * 2 ** (semitonos / 12)

ACORDES = [['C3', 'G3', 'E4', 'B4'], ['A2', 'E3', 'C4', 'G4'], ['F2', 'C3', 'A3', 'E4'], ['G2', 'D3', 'B3', 'E4']]
PASO = 4.0           # segundos por acorde
señal = np.zeros(n)
for i in range(int(np.ceil(dur / PASO)) + 1):
    ini = i * PASO - 1.0                        # solapa 1 s con el anterior
    acorde = ACORDES[i % len(ACORDES)]
    seg = (t >= ini) & (t < ini + PASO + 2.0)
    tt = t[seg] - ini
    largo = PASO + 2.0
    env = np.sin(np.pi * np.clip(tt / largo, 0, 1)) ** 2   # entrada y salida lentas
    for j, nm in enumerate(acorde):
        f = nota(nm)
        for detune, vol in ((-0.12, 0.5), (0.12, 0.5)):
            fase = 2 * np.pi * (f + detune) * tt
            onda = np.sin(fase) + 0.18 * np.sin(2 * fase) + 0.06 * np.sin(3 * fase)
            señal[seg] += vol * env * onda * (0.9 if j == 0 else 0.55)

# Paso bajo de un polo (suaviza los armónicos)
alfa = 0.08
filtrada = np.empty_like(señal)
acc = 0.0
for k in range(n):
    acc += alfa * (señal[k] - acc)
    filtrada[k] = acc

# Reverberación sencilla: varios retardos con realimentación
rev = filtrada.copy()
for retardo, g in ((0.031, 0.35), (0.047, 0.3), (0.071, 0.25), (0.113, 0.2)):
    d = int(retardo * SR)
    eco = np.zeros(n)
    eco[d:] = filtrada[:-d] * g
    rev += eco
mezcla = 0.7 * filtrada + 0.3 * rev

# Fundido de entrada y salida, y volumen moderado (pico a −14 dBFS)
fade_in, fade_out = int(1.0 * SR), int(1.8 * SR)
mezcla[:fade_in] *= np.linspace(0, 1, fade_in)
mezcla[-fade_out:] *= np.linspace(1, 0, fade_out)
mezcla = mezcla / np.max(np.abs(mezcla)) * 10 ** (-14 / 20)
pcm = (mezcla * 32767).astype(np.int16)
estereo = np.column_stack([pcm, pcm]).ravel()
with wave.open(salida, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes(estereo.tobytes())
print(f'✓ música {dur:.1f} s → {salida}')
