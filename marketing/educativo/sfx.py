# Efectos de sonido propios para los Reels (sintetizados aquí: sin bancos de sonidos ni licencias).
# Uso: python3 sfx.py <carpeta>  → <carpeta>/sfx-{whoosh,pop,ding,caja,tic}.wav (44,1 kHz, mono)
#   whoosh: barrido de ruido para los cambios de escena · pop: burbuja para que algo aparezca
#   ding: campanita para un dato o una idea · caja: «cha-ching» de caja registradora para el dinero
#   tic: clic seco (cuentas atrás, ruletas)
import os, sys, wave
import numpy as np

SR = 44100
rng = np.random.default_rng(7)
dest = sys.argv[1]
os.makedirs(dest, exist_ok=True)

def env(n, ataque, caida):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(ataque, 1e-4)) * np.exp(-t / caida)

def pasa_banda(x, f_lo, f_hi):
    # Dos filtros de un polo (paso alto y paso bajo) con frecuencias que pueden variar por muestra.
    f_lo = np.broadcast_to(f_lo, x.shape); f_hi = np.broadcast_to(f_hi, x.shape)
    y = np.zeros_like(x); lp = hp_prev_x = hp = 0.0
    for i in range(len(x)):
        a = np.exp(-2 * np.pi * f_hi[i] / SR); lp = (1 - a) * x[i] + a * lp
        b = np.exp(-2 * np.pi * f_lo[i] / SR); hp = b * (hp + lp - hp_prev_x); hp_prev_x = lp
        y[i] = hp
    return y

def campana(f, dur, parciales=((1, 1), (2.76, .45), (5.4, .25), (8.93, .12))):
    n = int(dur * SR); t = np.arange(n) / SR
    return sum(g * np.sin(2 * np.pi * f * k * t) * np.exp(-t * (3 + 2.2 * k)) for k, g in parciales) * np.minimum(1, t / 0.002)

def guardar(nombre, x, pico=0.9):
    x = x / (np.max(np.abs(x)) + 1e-9) * pico
    with wave.open(os.path.join(dest, f'sfx-{nombre}.wav'), 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())

# whoosh: ruido con la banda subiendo y bajando, forma de campana.
n = int(0.42 * SR); u = np.linspace(0, 1, n)
forma = np.sin(np.pi * u) ** 1.6
centro = 500 + 2600 * np.sin(np.pi * np.clip(u * 1.1, 0, 1))
guardar('whoosh', pasa_banda(rng.standard_normal(n), centro * 0.45, centro * 1.8) * forma, 0.8)

# pop: seno que cae de tono muy rápido.
n = int(0.13 * SR); t = np.arange(n) / SR
f = 260 + 900 * np.exp(-t * 38)
guardar('pop', np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.002, 0.035), 0.85)

# ding: campanita aguda.
guardar('ding', campana(1568, 1.1), 0.7)

# caja: dos golpes metálicos («cha») y campana con monedas («ching»).
total = np.zeros(int(0.95 * SR))
for ini in (0.0, 0.09):
    m = int(0.06 * SR); golpe = pasa_banda(rng.standard_normal(m), 2500, 9000) * env(m, 0.001, 0.015)
    a = int(ini * SR); total[a:a + m] += golpe * 0.9
c = campana(2093, 0.8) * 0.8 + campana(2637, 0.8) * 0.5
a = int(0.17 * SR); total[a:a + len(c)] += c[:len(total) - a]
for k in range(9):   # monedas
    f0 = rng.uniform(3200, 5200); d = int(0.05 * SR); tt = np.arange(d) / SR
    a = int((0.2 + k * 0.045 + rng.uniform(0, 0.02)) * SR)
    if a + d < len(total): total[a:a + d] += np.sin(2 * np.pi * f0 * tt) * np.exp(-tt * 70) * 0.25
guardar('caja', total, 0.8)

# tic: clic corto.
n = int(0.03 * SR)
guardar('tic', pasa_banda(rng.standard_normal(n), 1500, 6000) * env(n, 0.0005, 0.006), 0.7)
print('✓ efectos en', dest)
