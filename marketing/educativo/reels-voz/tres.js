// Mundo 3D para los Reels (Three.js dentro del motor reel-voz.js): maniquíes en un escenario oscuro con un solo
// color de acento, como los vídeos de referencia que le gustan al propietario (@montealto.agency, @resultaaquee).
// La metáfora de base: cada maniquí gris es dinero tuyo que va por libre; los que controlas se encienden.
//
// Uso en un Reel:  module.exports = pildora3d({ slug, cuenta, T, escenas: [{ html, anim }…], tres: function (t, k, s, e, W) {…} })
//   tres(t, k, s, e, W) se ejecuta en la página en cada fotograma: t = tiempo global, k = escena, s = tiempo en la escena,
//   e = { ini, fin, seg: [{ ini, dur, marcas }] } y W = este mundo:
//     W.camara(px, py, pz, lx, ly, lz)          posición y punto al que mira
//     W.multitud(t, { orden, dur, sitio, grupo, evita })
//         sin `orden` todos caminan a su aire; orden(i) = instante (global) en que el maniquí i deja de vagar y va a
//         su sitio (sitio(i) → [x, z]; por defecto tres bloques: fijos, caprichos y ahorro) y coge el color de su grupo.
//     W.heroe({ x, z, gira, luz, brazos, visible })   el maniquí turquesa (luz 0..1 = de gris a encendido)
//     W.zonas([q0, q1, q2])                    intensidad de las tres zonas del suelo (con su rótulo)
//     W.multitud(t, { directo })               directo(i, a) → { x, z, rot, amp, fase, esc, color, cq… } lleva a ese maniquí de la mano
//     W.etiqueta(clave, texto, x, y, z, op, css, tam)   rótulo flotante (tam: escala, 1 por defecto) · W.puerta({ x, z, luz })   puerta luminosa roja
//     W.casa({ x, z, rot, esc, bloque(i) → { color, q, brillo, op, dz, dy, esc } })   casa de 100 bloques (1 bloque = 1 %)
//     W.casitas([{ x, z, rot, esc, color, q }…])   hasta 5 casas pequeñas
//     W.caja({ x, z, rot, luz, op, item: { y, op, color } })   caja abierta turquesa (el carrito) con la compra dentro
//     W.puerta({ …, color, cq })   la puerta pasa del rojo a otro color (por defecto, roja)
//     W.niebla(cerca, lejos) · W.T = THREE · W.gente · W.GRUPOS
// Se renderiza por software (SwiftShader) a 0,8× y el navegador lo escala: nítido de sobra para vídeo.
const { C, VOZ_NARRADOR } = require('./_comun');

const SCRIPT_3D = `
const W3 = (() => {
  const T = THREE, ANCHO = 1080, ALTO = 1920, ESCALA = 0.8;
  if (T.ColorManagement) T.ColorManagement.legacyMode = false;   // los colores hex son sRGB de verdad (si no, salen lavados)
  const R = new T.WebGLRenderer({ canvas: document.getElementById('c3d'), antialias: true, preserveDrawingBuffer: true });
  R.setPixelRatio(1); R.setSize(ANCHO * ESCALA, ALTO * ESCALA, false);
  R.shadowMap.enabled = true; R.shadowMap.type = T.PCFSoftShadowMap;
  R.outputEncoding = T.sRGBEncoding; R.toneMapping = T.ACESFilmicToneMapping; R.toneMappingExposure = 1.15;
  const S = new T.Scene(), FONDO = 0x070b16;
  S.background = new T.Color(FONDO); S.fog = new T.Fog(FONDO, 14, 46);
  const cam = new T.PerspectiveCamera(46, ANCHO / ALTO, 0.1, 160);

  // Luces: ambiente frío, una principal con sombras suaves y un contraluz turquesa que recorta las siluetas.
  S.add(new T.HemisphereLight(0x9fb4dd, 0x05070d, 0.85));
  const sol = new T.DirectionalLight(0xffffff, 1.85); sol.position.set(9, 20, 11); sol.castShadow = true;
  sol.shadow.mapSize.set(2048, 2048); sol.shadow.bias = -0.0006; sol.shadow.radius = 5;
  Object.assign(sol.shadow.camera, { left: -24, right: 24, top: 24, bottom: -24, near: 1, far: 70 }); S.add(sol);
  const contra = new T.DirectionalLight(0x5eead4, 1.1); contra.position.set(-8, 7, -14); S.add(contra);

  // Suelo oscuro con una rejilla tenue.
  const suelo = new T.Mesh(new T.PlaneGeometry(240, 240), new T.MeshStandardMaterial({ color: 0x111a30, roughness: 0.9, metalness: 0.05 }));
  suelo.rotation.x = -Math.PI / 2; suelo.receiveShadow = true; S.add(suelo);
  const rejilla = new T.GridHelper(120, 80, 0x26365a, 0x1c2843); rejilla.position.y = 0.004; S.add(rejilla);

  // ——— maniquí articulado (1,8 de alto, mira hacia +Z) ———
  const G = {
    torso: new T.CapsuleGeometry(0.17, 0.36, 6, 14), pelvis: new T.SphereGeometry(0.175, 14, 10), cabeza: new T.SphereGeometry(0.15, 20, 14),
    cuello: new T.CylinderGeometry(0.05, 0.06, 0.1, 10), brazo: new T.CapsuleGeometry(0.055, 0.22, 4, 10), ante: new T.CapsuleGeometry(0.048, 0.22, 4, 10),
    mano: new T.SphereGeometry(0.06, 10, 8), muslo: new T.CapsuleGeometry(0.078, 0.3, 4, 10), pierna: new T.CapsuleGeometry(0.062, 0.32, 4, 10),
    pie: new T.CapsuleGeometry(0.055, 0.14, 4, 8), junta: new T.SphereGeometry(0.068, 10, 8)
  };
  function maniqui(mat) {
    const g = new T.Group(), cuerpo = new T.Group(); g.add(cuerpo);
    const m = (geo, x, y, z, padre) => { const o = new T.Mesh(geo, mat); o.position.set(x, y, z); o.castShadow = true; (padre || cuerpo).add(o); return o; };
    m(G.pelvis, 0, 0.96, 0); m(G.torso, 0, 1.27, 0); m(G.cuello, 0, 1.58, 0); m(G.cabeza, 0, 1.74, 0).scale.y = 1.12;
    const lado = (sx) => {
      const hombro = new T.Group(); hombro.position.set(sx * 0.245, 1.46, 0); cuerpo.add(hombro);
      m(G.junta, 0, 0, 0, hombro); m(G.brazo, 0, -0.17, 0, hombro);
      const codo = new T.Group(); codo.position.set(0, -0.33, 0); hombro.add(codo);
      m(G.junta, 0, 0, 0, codo).scale.setScalar(0.8); m(G.ante, 0, -0.16, 0, codo); m(G.mano, 0, -0.33, 0, codo);
      const cadera = new T.Group(); cadera.position.set(sx * 0.1, 0.93, 0); cuerpo.add(cadera);
      m(G.muslo, 0, -0.22, 0, cadera);
      const rodilla = new T.Group(); rodilla.position.set(0, -0.44, 0); cadera.add(rodilla);
      m(G.junta, 0, 0, 0, rodilla); m(G.pierna, 0, -0.22, 0, rodilla); m(G.pie, 0, -0.44, 0.07, rodilla).rotation.x = Math.PI / 2;
      return { hombro, codo, cadera, rodilla };
    };
    return { g, cuerpo, izq: lado(1), der: lado(-1), mat };
  }
  // Ciclo de andar (amp 1) o de pie (amp 0); arriba 0..1 levanta los dos brazos (celebrar).
  function andar(a, fase, amp, arriba) {
    amp = amp == null ? 1 : amp; arriba = arriba || 0;
    const s = Math.sin(fase), c = Math.cos(fase), b = 1 - arriba;
    a.izq.cadera.rotation.x = -0.55 * s * amp; a.der.cadera.rotation.x = 0.55 * s * amp;
    a.izq.rodilla.rotation.x = (0.12 + 0.8 * Math.max(0, c)) * amp; a.der.rodilla.rotation.x = (0.12 + 0.8 * Math.max(0, -c)) * amp;
    a.izq.hombro.rotation.x = 0.5 * s * amp * b; a.der.hombro.rotation.x = -0.5 * s * amp * b;
    a.izq.hombro.rotation.z = 0.1 + 2.55 * arriba; a.der.hombro.rotation.z = -0.1 - 2.55 * arriba;
    a.izq.codo.rotation.x = a.der.codo.rotation.x = -(0.22 + 0.3 * amp) * (1 - 0.7 * arriba);
    a.cuerpo.position.y = (0.035 * Math.abs(c) - 0.02) * amp; a.cuerpo.rotation.x = 0.06 * amp;
  }

  // ——— multitud ———
  const GRIS = new T.Color(0xb4bac6), NEGRO = new T.Color(0x000000);
  const GRUPOS = [{ nombre: 'FIJOS', color: new T.Color(0x14b8a6) }, { nombre: 'CAPRICHOS', color: new T.Color(0xe2a336) }, { nombre: 'AHORRO', color: new T.Color(0x8b7cf6) }];
  const N = 44, L = 32, REPARTO = [22, 13, 9], ZX = [-2.9, 0, 2.9], PASO_X = 0.82, PASO_Z = 0.95, FRENTE = 3.2;
  let semilla = 7; const azar = () => { semilla = (semilla * 1664525 + 1013904223) % 4294967296; return semilla / 4294967296; };
  const gente = [], cacheCol = {}, color = (hex) => cacheCol[hex] || (cacheCol[hex] = new T.Color(hex));
  for (let i = 0; i < N; i++) {
    const a = maniqui(new T.MeshStandardMaterial({ color: 0xb4bac6, roughness: 0.5, metalness: 0.05 })), ang = azar() * Math.PI * 2;
    Object.assign(a, { ang, dx: Math.sin(ang), dz: Math.cos(ang), lat: (azar() - 0.5) * 18, u0: azar() * L, vel: 1.05 + azar() * 0.75, f0: azar() * 6.28, esc: 0.94 + azar() * 0.12 });
    a.grupo = i < REPARTO[0] ? 0 : i < REPARTO[0] + REPARTO[1] ? 1 : 2;
    const j = i - (a.grupo === 0 ? 0 : a.grupo === 1 ? REPARTO[0] : REPARTO[0] + REPARTO[1]);
    a.sitio = [ZX[a.grupo] + (j % 3 - 1) * PASO_X, FRENTE - Math.floor(j / 3) * PASO_Z];
    S.add(a.g); gente.push(a);
  }
  const giro = (a, b, p) => { let d = ((b - a + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI; return a + d * p; };
  function multitud(t, o) {
    o = o || {}; const dur = o.dur || 1.9;
    gente.forEach((a, i) => {
      const d = o.directo ? o.directo(i, a) : null;
      if (d) {   // la coreografía lo lleva de la mano: { x, z, rot, amp, fase, esc, brazos, color, cq, color2, c2q, brillo }
        a.g.position.set(d.x, 0, d.z); a.g.rotation.y = d.rot || 0; a.g.scale.setScalar(Math.max(0.001, a.esc * (d.esc == null ? 1 : d.esc)));
        andar(a, a.f0 + (d.fase || 0), d.amp || 0, d.brazos || 0);
        const cq = d.color == null ? 0 : (d.cq == null ? 1 : d.cq), br = d.brillo == null ? 0.3 : d.brillo;
        a.mat.color.copy(GRIS); a.mat.emissive.copy(NEGRO);
        if (d.color != null) { a.mat.color.lerp(color(d.color), cq); a.mat.emissive.lerp(color(d.color), br * cq); }
        if (d.color2 != null) { a.mat.color.lerp(color(d.color2), d.c2q || 0); a.mat.emissive.lerp(color(d.color2), d.c2q || 0).multiplyScalar(1 - 0.5 * (d.c2q || 0)); }
        return;
      }
      const t0 = o.orden ? o.orden(i, a) : Infinity, tw = Math.min(t, t0);
      const u = ((a.u0 + a.vel * tw) % L + L) % L - L / 2;
      let x = a.dx * u + a.dz * a.lat, z = a.dz * u - a.dx * a.lat, rot = a.ang, amp = 1, q = 0;
      let esc = a.esc * Math.min(1, (L / 2 - Math.abs(u)) / 2.5);   // al dar la vuelta por el borde encoge y no «salta»
      if (o.evita) for (const [ex, ez, er] of o.evita) { const vx = x - ex, vz = z - ez, d = Math.hypot(vx, vz); if (d < er) { const k = er / (d || 0.01); x = ex + vx * k; z = ez + vz * k; } }
      let fase = a.f0 + a.vel * tw * 4.5;
      if (t > t0) {
        q = Math.min(1, (t - t0) / dur); const e = q * q * (3 - 2 * q), sitio = o.sitio ? o.sitio(i, a) : a.sitio;
        const hacia = Math.atan2(sitio[0] - x, sitio[1] - z);
        rot = q < 0.2 ? giro(a.ang, hacia, q / 0.2) : q > 0.85 ? giro(hacia, 0, (q - 0.85) / 0.15) : hacia;
        x += (sitio[0] - x) * e; z += (sitio[1] - z) * e; esc += (a.esc - esc) * e;
        amp = q < 1 ? Math.min(1, (1 - q) * 6) : 0; fase += (t - t0) * 7.5;
      }
      a.g.position.set(x, 0, z); a.g.rotation.y = rot; a.g.scale.setScalar(Math.max(0.001, esc));
      andar(a, fase, amp, 0);
      const gr = GRUPOS[o.grupo ? o.grupo(i, a) : a.grupo].color;
      a.mat.color.copy(GRIS).lerp(gr, q); a.mat.emissive.copy(NEGRO).lerp(gr, 0.3 * q);
    });
  }

  // ——— textura de resplandor y héroe turquesa ———
  function lienzo(w, h, pintar) { const c = document.createElement('canvas'); c.width = w; c.height = h; pintar(c.getContext('2d'), w, h); const tx = new T.CanvasTexture(c); tx.encoding = T.sRGBEncoding; return tx; }
  const halo = lienzo(256, 256, (x) => { const g = x.createRadialGradient(128, 128, 0, 128, 128, 128); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.35, 'rgba(255,255,255,.35)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 256, 256); });
  const ACENTO = new T.Color(0x2dd4bf);
  const H = maniqui(new T.MeshStandardMaterial({ color: 0xb4bac6, roughness: 0.42, metalness: 0.05 }));
  H.g.scale.setScalar(1.06); S.add(H.g);
  const luzH = new T.PointLight(0x5eead4, 0, 11, 1.6); S.add(luzH);
  const aura = new T.Sprite(new T.SpriteMaterial({ map: halo, color: 0x5eead4, blending: T.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0 })); aura.scale.setScalar(5.2); S.add(aura);
  const charco = new T.Mesh(new T.PlaneGeometry(7, 7), new T.MeshBasicMaterial({ map: halo, color: 0x5eead4, blending: T.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0 }));
  charco.rotation.x = -Math.PI / 2; charco.position.y = 0.02; S.add(charco);
  function heroe(o) {
    o = o || {}; const x = o.x || 0, z = o.z == null ? 6.4 : o.z, luz = o.luz || 0;
    H.g.visible = o.visible !== false; H.g.position.set(x, o.y || 0, z); H.g.rotation.y = o.gira || 0;
    andar(H, o.fase || 0, o.amp || 0, o.brazos || 0);
    if (o.senala) { H.der.hombro.rotation.x = -1.35 * o.senala; H.der.codo.rotation.x = -0.15; }
    H.mat.color.copy(GRIS).lerp(ACENTO, luz); H.mat.emissive.copy(NEGRO).lerp(ACENTO, 0.4 * luz);
    luzH.position.set(x, 2.3, z + 0.9); luzH.intensity = 2.2 * luz * (H.g.visible ? 1 : 0);
    aura.position.set(x, 1.25, z); aura.material.opacity = 0.16 * luz * (H.g.visible ? 1 : 0);
    charco.position.set(x, 0.02, z); charco.material.opacity = 0.22 * luz * (H.g.visible ? 1 : 0);
  }

  // ——— zonas del suelo con rótulo (una por grupo) ———
  const zonasM = GRUPOS.map((gr, k) => {
    const filas = Math.ceil(REPARTO[k] / 3), ancho = 2.7, fondo = filas * PASO_Z + 1.9, css = '#' + gr.color.getHexString();
    const tx = lienzo(512, Math.round(512 * fondo / ancho), (x, w, h) => {
      const g = x.createLinearGradient(0, h, 0, 0); g.addColorStop(0, css + '66'); g.addColorStop(1, css + '14');
      x.fillStyle = g; x.strokeStyle = css; x.lineWidth = 10; x.beginPath(); x.roundRect(8, 8, w - 16, h - 16, 34); x.fill(); x.stroke();
      x.fillStyle = '#ffffff'; x.font = '900 ' + (gr.nombre.length > 7 ? 70 : 92) + 'px Inter, sans-serif'; x.textAlign = 'center'; x.fillText(gr.nombre, w / 2, h - 52);
    });
    const p = new T.Mesh(new T.PlaneGeometry(ancho, fondo), new T.MeshBasicMaterial({ map: tx, transparent: true, depthWrite: false, opacity: 0 }));
    p.rotation.x = -Math.PI / 2; p.position.set(ZX[k], 0.012, FRENTE + 1.5 - fondo / 2 + 0.05); S.add(p); return p;
  });
  function zonas(q) { zonasM.forEach((p, k) => { p.material.opacity = Math.max(0, Math.min(1, (q && q[k]) || 0)); p.visible = p.material.opacity > 0.001; }); }

  // ——— etiquetas flotantes (una por clave; se ocultan solas si un fotograma no las pide) ———
  const etiquetas = {};
  function etiqueta(k, texto, x, y, z, op, css, tam) {
    css = css || '#5eead4'; let e = etiquetas[k + css];
    if (!e) {
      const tx = lienzo(512, 144, (c, w, h) => { c.fillStyle = 'rgba(9,14,27,.94)'; c.strokeStyle = css; c.lineWidth = 9; c.beginPath(); c.roundRect(7, 7, w - 14, h - 14, 44); c.fill(); c.stroke();
        c.fillStyle = '#fff'; c.font = '800 ' + (texto.length > 10 ? 50 : texto.length > 7 ? 62 : 72) + 'px Inter, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(texto, w / 2, h / 2 + 4); });
      const sp = new T.Sprite(new T.SpriteMaterial({ map: tx, transparent: true, depthWrite: false })); sp.scale.set(1.25, 0.352, 1); S.add(sp);
      e = etiquetas[k + css] = { sp };
    }
    tam = tam || 1; e.sp.scale.set(1.25 * tam, 0.352 * tam, 1);
    e.sp.position.set(x, y, z); e.sp.material.opacity = op == null ? 1 : op; e.usada = e.sp.material.opacity > 0.01;
  }

  // ——— puerta luminosa (por donde «se va» el dinero) ———
  const puertaG = new T.Group(); puertaG.visible = false; S.add(puertaG);
  const matP = new T.MeshStandardMaterial({ color: 0xef4444, emissive: 0xef4444, emissiveIntensity: 0.7, roughness: 0.4 });
  [-1, 1].forEach(sx => { const po = new T.Mesh(new T.BoxGeometry(0.16, 2.7, 0.16), matP); po.position.set(sx * 0.95, 1.35, 0); po.castShadow = true; puertaG.add(po); });
  const dintel = new T.Mesh(new T.BoxGeometry(2.06, 0.16, 0.16), matP); dintel.position.set(0, 2.7, 0); puertaG.add(dintel);
  const velo = new T.Mesh(new T.PlaneGeometry(1.74, 2.62), new T.MeshBasicMaterial({ map: lienzo(64, 256, (c, w, h) => { const g = c.createLinearGradient(0, h, 0, 0); g.addColorStop(0, 'rgba(255,255,255,.8)'); g.addColorStop(1, 'rgba(255,255,255,.1)'); c.fillStyle = g; c.fillRect(0, 0, w, h); }),
    color: 0xf87171, transparent: true, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide, opacity: 0.5 }));
  velo.position.set(0, 1.31, 0); puertaG.add(velo);
  const luzP = new T.PointLight(0xf87171, 0, 13, 1.6); luzP.position.set(0, 1.6, 0.9); puertaG.add(luzP);
  const charcoP = new T.Mesh(new T.PlaneGeometry(9, 9), new T.MeshBasicMaterial({ map: halo, color: 0xf87171, blending: T.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.3 }));
  charcoP.rotation.x = -Math.PI / 2; charcoP.position.set(0, 0.02, 0.7); puertaG.add(charcoP);
  const P_ROJO = new T.Color(0xef4444), P_ROJO2 = new T.Color(0xf87171);
  function puerta(o) {
    if (!o) { puertaG.visible = false; luzP.intensity = 0; return; }
    const l = o.luz == null ? 1 : o.luz; puertaG.visible = true; puertaG.position.set(o.x || 0, 0, o.z || 0); puertaG.rotation.y = o.rot || 0;
    matP.emissiveIntensity = 0.1 + 0.6 * l; velo.material.opacity = 0.5 * l; luzP.intensity = 2.8 * l; charcoP.material.opacity = 0.3 * l;
    // color (opcional): la puerta pasa de rojo a ese color con cq (0..1); sin color, roja como siempre.
    const q = o.color == null ? 0 : (o.cq == null ? 1 : o.cq), c = o.color == null ? P_ROJO : color(o.color);
    matP.color.copy(P_ROJO).lerp(c, q); matP.emissive.copy(P_ROJO).lerp(c, q);
    [velo.material.color, luzP.color, charcoP.material.color].forEach(x => x.copy(P_ROJO2).lerp(c, q));
  }

  // ——— caja abierta (el carrito) y la compra que se guarda dentro ———
  // W.caja({ x, z, rot, luz, op, item: { y, op, color } }) · W.caja(null) la apaga.
  const cajaG = new T.Group(); cajaG.visible = false; S.add(cajaG);
  const matC = new T.MeshStandardMaterial({ color: 0x2dd4bf, emissive: 0x2dd4bf, emissiveIntensity: 0.35, roughness: 0.45, transparent: true });
  [[1.3, 0.08, 1.0, 0, 0.04, 0], [1.3, 0.75, 0.08, 0, 0.375, 0.46], [1.3, 0.75, 0.08, 0, 0.375, -0.46], [0.08, 0.75, 1.0, 0.61, 0.375, 0], [0.08, 0.75, 1.0, -0.61, 0.375, 0]]
    .forEach(([w, h, d, x, y, z]) => { const m = new T.Mesh(new T.BoxGeometry(w, h, d), matC); m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; cajaG.add(m); });
  const matI = new T.MeshStandardMaterial({ color: 0xe2a336, emissive: 0xe2a336, emissiveIntensity: 0.25, roughness: 0.5, transparent: true });
  const itemC = new T.Mesh(new T.BoxGeometry(0.7, 0.42, 0.5), matI); itemC.castShadow = true; cajaG.add(itemC);
  function caja(o) {
    if (!o) { cajaG.visible = false; return; }
    cajaG.visible = true; cajaG.position.set(o.x || 0, 0, o.z || 0); cajaG.rotation.y = o.rot || 0;
    matC.opacity = o.op == null ? 1 : o.op; matC.depthWrite = matC.opacity > 0.99; matC.emissiveIntensity = 0.1 + 0.4 * (o.luz == null ? 1 : o.luz);
    const it = o.item; itemC.visible = !!it && (it.op == null || it.op > 0.01);
    if (it) { itemC.position.set(0, it.y == null ? 0.45 : it.y, 0); matI.opacity = it.op == null ? 1 : it.op; matI.depthWrite = matI.opacity > 0.99;
      matI.color.copy(color(it.color || 0xe2a336)); matI.emissive.copy(matI.color); }
  }

  // ——— casa de 100 bloques (cada bloque = 1 % de lo que pagas): tejado escalonado (filas de 2, 4, 6 y 8) y muro de 8 × 10.
  // Los bloques se numeran de arriba abajo y de izquierda a derecha: 0–19 el tejado, 20–29 la fila de arriba del muro…
  // W.casa({ x, z, rot, esc, bloque: (i) => ({ color, q, brillo, op, dz, dy, esc }) })  · W.casa(null) la apaga.
  const casaG = new T.Group(); casaG.visible = false; S.add(casaG);
  const LADO_B = 0.5, geoB = new T.BoxGeometry(LADO_B * 0.9, LADO_B * 0.9, LADO_B * 1.8), bloques = [];
  const FILAS_CASA = [2, 4, 6, 8, 10, 10, 10, 10, 10, 10, 10, 10];
  FILAS_CASA.forEach((n, f) => {
    const y = (FILAS_CASA.length - 1 - f) * LADO_B + LADO_B / 2;
    for (let c = 0; c < n; c++) {
      const m = new T.Mesh(geoB, new T.MeshStandardMaterial({ color: 0xb4bac6, roughness: 0.55, metalness: 0.05, transparent: true }));
      m.position.set((c - (n - 1) / 2) * LADO_B, y, 0); m.castShadow = true; m.receiveShadow = true; casaG.add(m);
      bloques.push({ m, x: m.position.x, y });
    }
  });
  function casa(o) {
    if (!o) { casaG.visible = false; return; }
    casaG.visible = true; casaG.position.set(o.x || 0, 0, o.z || 0); casaG.rotation.y = o.rot || 0; casaG.scale.setScalar(o.esc || 1);
    bloques.forEach((b, i) => {
      const d = (o.bloque && o.bloque(i)) || {}, mt = b.m.material, q = d.q == null ? 1 : d.q;
      mt.color.copy(GRIS); mt.emissive.copy(NEGRO);
      if (d.color != null) { mt.color.lerp(color(d.color), q); mt.emissive.lerp(color(d.color), (d.brillo == null ? 0.35 : d.brillo) * q); }
      mt.opacity = d.op == null ? 1 : d.op; mt.depthWrite = mt.opacity > 0.99;
      b.m.position.set(b.x, b.y + (d.dy || 0), d.dz || 0); b.m.scale.setScalar(Math.max(0.001, d.esc == null ? 1 : d.esc)); b.m.visible = mt.opacity > 0.01;
    });
  }

  // ——— casitas (hasta 5): W.casitas([{ x, z, rot, esc, color, q }]) · W.casitas(null) las apaga ———
  const casitasM = Array.from({ length: 5 }, () => {
    const g = new T.Group(), mt = new T.MeshStandardMaterial({ color: 0xb4bac6, roughness: 0.55, metalness: 0.05 });
    const cuerpo = new T.Mesh(new T.BoxGeometry(1.3, 1.1, 1.3), mt); cuerpo.position.y = 0.55;
    const tejado = new T.Mesh(new T.ConeGeometry(1.08, 0.75, 4), mt); tejado.position.y = 1.1 + 0.375; tejado.rotation.y = Math.PI / 4;
    [cuerpo, tejado].forEach(m => { m.castShadow = true; m.receiveShadow = true; g.add(m); });
    g.visible = false; S.add(g); return { g, mt };
  });
  function casitas(lista) {
    casitasM.forEach((c, k) => {
      const o = lista && lista[k]; c.g.visible = !!o; if (!o) return;
      c.g.position.set(o.x || 0, 0, o.z || 0); c.g.rotation.y = o.rot || 0; c.g.scale.setScalar(o.esc || 1);
      c.mt.color.copy(GRIS); c.mt.emissive.copy(NEGRO);
      if (o.color != null) { const q = o.q == null ? 1 : o.q; c.mt.color.lerp(color(o.color), q); c.mt.emissive.lerp(color(o.color), 0.3 * q); }
    });
  }

  function camara(px, py, pz, lx, ly, lz) { cam.position.set(px, py, pz); cam.lookAt(lx, ly, lz); }
  function niebla(cerca, lejos) { S.fog.near = cerca; S.fog.far = lejos; }
  const W = { T, S, cam, gente, GRUPOS, H, camara, multitud, heroe, zonas, niebla, andar, etiqueta, puerta, color, casa, casitas, caja };
  W.fotograma = (t, k, s, e, coreo) => {
    niebla(14, 46); zonas(null); heroe({ visible: false }); puerta(null); casa(null); casitas(null); caja(null); for (const q in etiquetas) etiquetas[q].usada = false;
    coreo(t, k, s, e, W);
    for (const q in etiquetas) etiquetas[q].sp.visible = etiquetas[q].usada;
    R.render(S, cam);
  };
  return W;
})();
// Capa fija: el reloj de «grabando».
function alPintar(t) { const r = document.getElementById('reloj'); if (r) { const s = Math.floor(t); r.textContent = String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); } }
function aparece3(nodo, p) { if (nodo) { nodo.style.opacity = Math.min(1, p * 1.5); nodo.style.transform = (nodo.dataset.t || '') + ' scale(' + (0.7 + 0.3 * p) + ')'; } }
`;

const MONO = `'DejaVu Sans Mono', 'Liberation Mono', ui-monospace, monospace`;
const CSS_3D = `
  .escena { top: 0 !important; height: 1920px !important; padding: 0 !important; }
  .vin { position: absolute; inset: 0; pointer-events: none;
    background: radial-gradient(130% 80% at 50% 46%, transparent 52%, rgba(3,5,12,.62) 100%),
      linear-gradient(rgba(7,11,22,.92) 0%, rgba(7,11,22,.6) 15%, transparent 31%, transparent 76%, rgba(7,11,22,.8) 100%); }
  #sub { top: 262px; height: 210px; left: 86px; right: 86px; font-size: 62px; font-weight: 750; letter-spacing: -.012em; line-height: 1.22; text-shadow: 0 2px 16px rgba(0,0,0,.8); }
  #sub .w { padding: 1px 10px; margin: 3px -3px; border: 3px solid transparent; border-radius: 13px; color: #fff; }
  #sub .w.c { color: ${C.acento}; }
  #sub .w.luego { opacity: .4; }
  #sub .w.act { background: rgba(94,234,212,.13); border-color: ${C.acento}; color: #fff; text-shadow: none; }
  .hud { position: absolute; top: 152px; font: 700 25px/1 ${MONO}; letter-spacing: .12em; color: #cbd5e1; }
  .hud.i { left: 66px; border: 2px solid rgba(94,234,212,.55); color: ${C.acento}; padding: 11px 16px; border-radius: 10px; background: rgba(7,11,22,.6); }
  .hud.d { right: 66px; display: flex; gap: 11px; align-items: center; padding: 13px 0; }
  .hud.d i { width: 14px; height: 14px; border-radius: 50%; background: #ef4444; box-shadow: 0 0 12px #ef4444; }
  .dato { position: absolute; left: 50%; background: rgba(9,14,27,.86); border: 2px solid rgba(148,163,184,.3); border-radius: 22px; padding: 16px 34px 18px; text-align: center; opacity: 0; white-space: nowrap; }
  .dato small { display: block; font: 700 22px/1.3 ${MONO}; letter-spacing: .16em; color: #94a3b8; }
  .dato b { display: block; font-size: 74px; line-height: 1.05; font-weight: 900; letter-spacing: -.02em; color: ${C.acento}; font-variant-numeric: tabular-nums; }
  .dato b.rojo { color: #f87171; }
  .rotulo { position: absolute; left: 50%; padding: 14px 30px; border-radius: 16px; background: ${C.acento}; color: #06121a; font-size: 44px; font-weight: 900; letter-spacing: -.01em; opacity: 0; white-space: nowrap; }
  .fin { position: absolute; inset: 0; background: rgba(5,8,17,.7); display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 0 80px 120px; }
  .fin .num { font-size: 250px; line-height: 1; font-weight: 900; letter-spacing: -.04em; color: #fff; }
  .fin .num b { color: ${C.acento}; }
  .fin .puntos { display: grid; grid-template-columns: repeat(15, 22px); gap: 12px; margin: 34px 0 30px; }
  .fin .puntos i { width: 22px; height: 22px; border-radius: 6px; background: rgba(148,163,184,.22); }
  .fin .puntos i.on { background: ${C.acento}; box-shadow: 0 0 14px rgba(94,234,212,.7); }
  .fin .serie { font: 700 27px/1.3 ${MONO}; letter-spacing: .14em; color: #94a3b8; }
  .fin .manana { margin-top: 70px; border: 2px solid rgba(94,234,212,.5); border-radius: 26px; padding: 26px 34px 30px; background: rgba(9,14,27,.9); opacity: 0; max-width: 860px; }
  .fin .manana small { display: block; font: 700 24px/1.3 ${MONO}; letter-spacing: .16em; color: ${C.acento}; margin-bottom: 10px; }
  .fin .manana span { font-size: 54px; line-height: 1.12; font-weight: 850; letter-spacing: -.02em; color: #fff; }
  .fin .sigue { margin-top: 44px; font-size: 36px; font-weight: 700; color: #cbd5e1; opacity: 0; }
  .fin .sigue b { color: ${C.acento}; }
`;

// Capa fija de la serie: «DÍA n/total» y el reloj.
const hud = (dia, total, palabra = 'DÍA') => `<div class="hud i">${palabra} ${dia}/${total}</div><div class="hud d"><i></i><span id="reloj">00:00</span></div>`;
// Tarjeta final de la serie: n/total, puntos de progreso y el avance de mañana (aparece en la 1.ª marca de la escena).
const finSerie = ({ dia, total, serie, manana, etiquetaManana, sigue }) => ({
  html: () => `<div class="fin"><div class="num"><b>${dia}</b>/${total}</div>
      <div class="puntos">${Array.from({ length: total }, (_, i) => `<i class="${i < dia ? 'on' : ''}"></i>`).join('')}</div>
      <div class="serie">${serie}</div>
      <div class="manana"><small>${etiquetaManana}</small><span>${manana}</span></div>
      <div class="sigue">${sigue}</div></div>`,
  anim: function (s, e, el) {
    const m = e.seg[0].marcas[0] != null ? e.seg[0].marcas[0] : 1.2;
    const n = el.querySelector('.num'); n.style.transform = 'scale(' + (0.8 + 0.2 * rebote(tramo(s, 0, 0.4))) + ')';
    const ma = el.querySelector('.manana'), p = sale(tramo(s, m - 0.1, m + 0.4)); ma.style.opacity = p; ma.style.transform = 'translateY(' + (1 - p) * 40 + 'px)';
    el.querySelector('.sigue').style.opacity = tramo(s, m + 0.9, m + 1.4);
  }
});

// Base de un Reel en 3D: arranque lleno, voz de narrador, subtítulos arriba en golpes más largos y la capa fija.
const pildora3d = (o) => ({ arranque: 'lleno', inicio: 0.1, voz: VOZ_NARRADOR, script: SCRIPT_3D + (o.scriptExtra || ''), css: CSS_3D + (o.cssExtra || ''),
  sub: { max: 4, largo: 20 }, datos: () => ({}), ...o });

module.exports = { pildora3d, hud, finSerie, SCRIPT_3D, CSS_3D };
