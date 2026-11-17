# Uso: python3 arranque.py <reel.mp4> [...]  → movimiento en el arranque (0-3 s) y en todo el vídeo (necesita numpy y ffmpeg).
# mov3 = cambio medio entre fotogramas (0-255, a 10 fps y 108x192 en gris); quieto3 = fracción de pasos casi sin cambio (<1,0).
# Referencia (42 Reels publicados, 17-11-2026): arranques con quieto3 < 0,2 retienen una mediana del 36 %; con quieto3 ≥ 0,45, del 25 %.
import subprocess, sys, numpy as np
W, H = 108, 192
def frames(p, t0, dur, fps):
    b = subprocess.run(['ffmpeg', '-v', 'error', '-ss', str(t0), '-t', str(dur), '-i', p, '-vf', f'fps={fps},scale={W}:{H},format=gray', '-f', 'rawvideo', '-'], capture_output=True).stdout
    a = np.frombuffer(b, dtype=np.uint8); n = len(a) // (W * H)
    return a[:n * W * H].reshape(n, H, W).astype(np.float32)
for p in sys.argv[1:]:
    a = frames(p, 0, 3, 10); d = np.abs(np.diff(a, axis=0)).mean(axis=(1, 2))
    b = frames(p, 0, 120, 5); e = np.abs(np.diff(b, axis=0)).mean(axis=(1, 2))
    tramos = ' '.join(f'{d[i:i+5].mean():.1f}' for i in range(0, len(d), 5))
    print(f'{p}\n  mov3={d.mean():.2f} quieto3={(d < 1.0).mean():.2f} (cada 0,5 s: {tramos}) · cortes/10 s={(e > 25).sum() / (len(b) / 5) * 10:.1f} · mov total={e.mean():.2f}')
