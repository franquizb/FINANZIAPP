// Serie «30 días para ordenar tu dinero» · @finanziapp.es (España), en 3D (reels-voz/tres.js).
// Cada día: una sola acción concreta, en ~30 s, y al final «Mañana: …» (da el motivo para seguir la cuenta).
// La metáfora de toda la serie: los maniquíes grises son tu dinero yendo por libre; lo que controlas se enciende.
// Texto de la publicación: gancho + resumen que NO repite el guion + qué hacer hoy (petición del propietario).
// Día 1: no lleva datos externos (es un método: apuntar los gastos 7 días y etiquetarlos).
const { pildora3d, hud, finSerie } = require('./tres');
const { cuadra } = require('../reels/_comun');

// Día 3: sin datos externos; es un ejemplo inventado y se presenta como tal («si cobras 1.600…»).
const SUELDO = 1600, HORAS = 160, PRECIO = 120, HORA = SUELDO / HORAS;
// Día 5: ejemplo (no estadística). 5 % de 1.600 € = 80 € al mes; × 12 = 960 € al año; la nómina en pantalla son 20 maniquíes de 80 €.
const PCT = 5, MES5 = SUELDO * PCT / 100;
cuadra('reto-05 mes', MES5, 80);
cuadra('reto-05 año', MES5 * 12, 960);
cuadra('reto-05 maniquíes', SUELDO / 20, MES5);
cuadra('reto-03 hora', HORA, 10);
cuadra('reto-03 horas', PRECIO / HORA, 12);

const SERIE = '30 DÍAS PARA ORDENAR TU DINERO', TOTAL = 30;

const pildoras = {
  'es-reto-01': pildora3d({
    slug: 'es-reto-01', cuenta: 'es',
    T: { es: {
      titulo: 'Día 1/30 · ¿A dónde se va tu sueldo?',
      guion: [
        [0, 'Cada mes entra tu sueldo… §y se te va *por todas partes*.'],
        [0, '¿Sabes exactamente a dónde? §Si la respuesta es «más o menos», *quédate*.'],
        [1, 'Porque lo que no ves, §*no lo puedes cambiar*.'],
        [2, '*Día uno*. Solo una cosa: §durante siete días, §*apunta cada gasto*. Sin cambiar nada. Solo mirar.'],
        [3, 'Y ponle una de tres etiquetas: §{pop}*fijo*, §{pop}*capricho* §{pop}o *ahorro*.'],
        [4, 'En una semana vas a ver §{ding}*el dibujo completo*. Y te va a sorprender.'],
        [5, 'Día uno de treinta para *ordenar tu dinero*. §Mañana: el gasto que se te escapa *sin darte cuenta*.']
      ]
    } },
    fijo: () => hud(1, TOTAL),
    escenas: [
      // 0 · Cenital: el caos. Tarjeta «dinero controlado: 0 %».
      { html: () => `<div class="dato" data-t="translateX(-50%)" style="top:1240px"><small>DINERO CONTROLADO</small><b class="rojo">0 %</b></div>`,
        anim: function (s, e, el) { const m = e.seg[0].marcas[0]; aparece3(el.querySelector('.dato'), rebote(tramo(s, m - 0.1, m + 0.3))); } },
      // 1 · A ras de suelo, entre los que pasan.
      { html: () => '', anim: null },
      // 2 · El héroe se enciende; rótulo con la tarea.
      { html: () => `<div class="rotulo" data-t="translateX(-50%)" style="top:580px">Apunta cada gasto · 7 días</div>`,
        anim: function (s, e, el) { const m = e.seg[0].marcas[1]; aparece3(el.querySelector('.rotulo'), rebote(tramo(s, m - 0.1, m + 0.3))); } },
      // 3 · Las tres zonas se encienden y cada uno va a la suya.
      { html: () => '', anim: null },
      // 4 · Grúa hacia arriba: el dibujo completo.
      { html: () => '', anim: null },
      // 5 · Tarjeta de la serie y el avance de mañana.
      finSerie({ dia: 1, total: TOTAL, serie: SERIE, etiquetaManana: 'MAÑANA · DÍA 2', manana: 'El gasto que se te escapa sin darte cuenta', sigue: '<b>Síguenos</b> para no perderte ningún día' })
    ],
    tres: function (t, k, s, e, W) {
      const p = Math.min(1, s / (e.fin - e.ini)), E3 = ESC[3], M3 = E3.seg[0].marcas, HX = 0, HZ = 7.4;
      // Cada grupo deja de vagar cuando se dice su etiqueta (escena 3).
      const orden = (i, a) => E3.ini + (M3[a.grupo] != null ? M3[a.grupo] : 1 + a.grupo * 0.6) + (i % 9) * 0.06;
      if (k === 0) {
        W.multitud(t);
        const a = -0.35 + 0.55 * p; W.camara(Math.sin(a) * 7, 25 - 5 * p, 3 + Math.cos(a) * 7, 0, 0, 0);
      } else if (k === 1) {
        W.multitud(t); W.niebla(7, 28);
        W.camara(-2.4 + 1.6 * p, 1.1, 5.4, 0.8, 1.25, -4);
      } else if (k === 2) {
        // Nadie pasa pegado a la cámara ni al héroe (sí por delante, a media distancia: da profundidad).
        const a = 0.6 - 0.85 * p, cx = HX + Math.sin(a) * 5.4, cz = HZ + Math.cos(a) * 5.4;
        W.multitud(t, { evita: [[HX, HZ, 2.3], [cx, cz, 3.4]] }); W.niebla(9, 32);
        W.heroe({ x: HX, z: HZ, luz: sale(tramo(s, 0.05, 0.6)) });
        W.camara(cx, 1.7, cz, HX, 1.62, HZ);
      } else if (k === 3) {
        W.multitud(t, { orden, evita: [[HX, HZ, 1.2]] });
        W.zonas([0, 1, 2].map(g => sale(tramo(s, (M3[g] != null ? M3[g] : 1) - 0.2, (M3[g] != null ? M3[g] : 1) + 0.3))));
        W.heroe({ x: HX, z: HZ, luz: 1, gira: Math.PI });
        W.camara(0, 19.6 - 0.6 * p, 15.5 - 0.5 * p, 0, 0, 1);
      } else if (k === 4) {
        const m = e.seg[0].marcas[0] != null ? e.seg[0].marcas[0] : 1, q = sale(p);
        W.multitud(t, { orden }); W.zonas([1, 1, 1]);
        const arriba = sale(tramo(s, m, m + 0.45));
        W.heroe({ x: HX, z: HZ, luz: 1, gira: Math.PI * (1 - sale(tramo(s, 0.2, 0.9))), brazos: arriba, y: Math.abs(Math.sin(s * 7)) * 0.12 * arriba });
        W.camara(0, 3.4 + 15.6 * q, 16.5 - 1.5 * q, 0, 1.4 - 1.4 * q, 2.2 - 1.2 * q);
      } else {
        W.multitud(t, { orden }); W.zonas([1, 1, 1]);
        W.heroe({ x: HX, z: HZ, luz: 1, brazos: 1 });
        const a = 0.28 * p; W.camara(Math.sin(a) * 14, 19 + 2 * p, 1 + Math.cos(a) * 14, 0, 0, 1);
      }
    },
    texto: { es: `Tu sueldo entra… y se te va por todas partes. ¿Sabes exactamente a dónde? 👀

Día 1 de 30 para ordenar tu dinero. Hoy, solo una cosa: durante 7 días apunta cada gasto y ponle una etiqueta: fijo, capricho o ahorro. Sin cambiar nada todavía. Solo mirar.

💾 Guárdalo y empieza hoy.
👉 Mañana, día 2: el gasto que se te escapa sin darte cuenta. Síguenos para no perderte ningún día.

#finanzaspersonales #ahorro #retodeahorro #educacionfinanciera #dinero` }
  }),

  // Día 2 · Suscripciones y cargos que se repiten: una fila que sale por una puerta roja sin que la mires.
  'es-reto-02': pildora3d({
    slug: 'es-reto-02', cuenta: 'es',
    T: { es: {
      titulo: 'Día 2/30 · El gasto que se te escapa sin darte cuenta',
      guion: [
        [0, 'Hay un gasto que sale de tu cuenta *todos los meses*… §y ni lo miras.'],
        [1, 'Suscripciones, apps, el gimnasio al que no vas. §Se cobran solas, §{tic}*una a una*.'],
        [2, 'Son pequeñas. §Por eso *nunca las revisas*.'],
        [3, '*Día dos*. §Abre tu banco §y busca los cargos que *se repiten*. Apúntalos todos.'],
        [4, 'Y hoy, §{ding}*cancela uno* que no uses. Solo uno.'],
        [5, 'Día dos de treinta para *ordenar tu dinero*. §Mañana: lo que vale de verdad *una hora de tu trabajo*.']
      ]
    } },
    fijo: () => hud(2, TOTAL),
    escenas: [
      { html: () => `<div class="dato" data-t="translateX(-50%)" style="top:1230px;left:69%"><small>SALE SOLO</small><b class="rojo">cada mes</b></div>`,
        anim: function (s, e, el) { const m = e.seg[0].marcas[0]; aparece3(el.querySelector('.dato'), rebote(tramo(s, m - 0.1, m + 0.3))); } },
      { html: () => '', anim: null },
      // Contador de cobros: sube cada vez que uno cruza la puerta (mismo ritmo que la fila: 1,3 m/s y 24,5/9 m entre ellos).
      { html: () => `<div class="dato" data-t="translateX(-50%)" style="top:540px"><small>COBROS AUTOMÁTICOS</small><b class="rojo">0</b></div>`,
        anim: function (s, e, el) { const d = el.querySelector('.dato'), paso = 24.5 / 9; aparece3(d, rebote(tramo(s, 0.1, 0.45)));
          d.querySelector('b').textContent = '+' + (1 + Math.floor((e.ini + s) * 1.3 / paso) - Math.floor(e.ini * 1.3 / paso)); } },
      { html: () => `<div class="rotulo" data-t="translateX(-50%)" style="top:580px">Busca lo que se repite</div>`,
        anim: function (s, e, el) { const m = e.seg[0].marcas[1]; aparece3(el.querySelector('.rotulo'), rebote(tramo(s, m - 0.1, m + 0.3))); } },
      { html: () => `<div class="rotulo" data-t="translateX(-50%)" style="top:580px">Hoy: cancela uno</div>`,
        anim: function (s, e, el) { const m = e.seg[0].marcas[0]; aparece3(el.querySelector('.rotulo'), rebote(tramo(s, m - 0.1, m + 0.3))); } },
      finSerie({ dia: 2, total: TOTAL, serie: SERIE, etiquetaManana: 'MAÑANA · DÍA 3', manana: 'Lo que vale de verdad una hora de tu trabajo', sigue: '<b>Síguenos</b> para no perderte ningún día' })
    ],
    tres: function (t, k, s, e, W) {
      const p = Math.min(1, s / (e.fin - e.ini)), NF = 9, LARGO = 24.5, PASO = LARGO / NF, VEL = 1.3, PZ = -7, HX = 2.3;
      const E3 = ESC[3], E4 = ESC[4];
      const tA = E3.ini + (E3.seg[0].marcas[1] != null ? E3.seg[0].marcas[1] : 2);     // la fila se para: «busca los cargos»
      const tC = E4.ini + (E4.seg[0].marcas[0] != null ? E4.seg[0].marcas[0] : 0.8);   // «cancela uno»
      const zFila = (i, tt) => 16 - (((tt * VEL + i * PASO) % LARGO) + LARGO) % LARGO;
      let kc = 0, mejor = 1e9; for (let i = 0; i < NF; i++) { const d = Math.abs(zFila(i, tA) - 2.5); if (d < mejor) { mejor = d; kc = i; } }
      const HZ = zFila(kc, tA);
      const EN = typeof LANG !== 'undefined' && LANG === 'en';   // la misma coreografía sirve al día 2 en inglés (reto-en.js)
      const NOMBRES = EN ? ['STREAMING', 'GYM', 'APP', 'CLOUD', 'MUSIC', 'GAMES', 'NEWS', 'INSURANCE', 'FREE TRIAL']
        : ['STREAMING', 'GIMNASIO', 'APP', 'NUBE', 'MÚSICA', 'JUEGOS', 'REVISTA', 'SEGURO', 'PRUEBA GRATIS'];
      const fila = (i) => {   // estado de cada uno de la fila en este instante
        const z = zFila(i, Math.min(t, tA)), parado = t > tA, retraso = 0.1 * Math.max(0, (HZ + 6 - z) / PASO);
        const visto = parado ? sale(tramo(t, tA + retraso, tA + retraso + 0.45)) : 0, fuera = i === kc ? sale(tramo(t, tC + 0.25, tC + 1.1)) : 0;
        return { z, parado, visto, fuera, esc: Math.min(1, Math.max(0, (z - PZ + 1.3) / 1.3)) * Math.min(1, (16 - z) / 1.5) * (1 - fuera) };
      };
      const directo = (i, a) => {
        if (i >= NF) {   // los demás van por dos «aceras» paralelas y no cruzan la fila
          const lado = i % 2 ? 1 : -1, dir = i % 3 ? -1 : 1, u = (((t * a.vel + a.u0) % 30) + 30) % 30 - 15;
          return { x: lado > 0 ? 7.6 + ((i * 2.37) % 7.5) : -(3.6 + ((i * 2.37) % 8)), z: dir * u, rot: dir > 0 ? 0 : Math.PI, amp: 1, fase: t * a.vel * 4.5, esc: Math.min(1, (15 - Math.abs(u)) / 2.5) };
        }
        const f = fila(i), giro = f.parado ? sale(tramo(t, tA, tA + 0.5)) : 0;
        return { x: 0, z: f.z, rot: Math.PI - (Math.PI / 2) * giro, amp: f.parado ? Math.max(0, 1 - (t - tA) * 3) : 1, fase: Math.min(t, tA) * VEL * 4.5, esc: f.esc,
          color: 0xef4444, cq: 0.92, brillo: 0.2, color2: i === kc && t > tC ? 0x475569 : 0xe2a336, c2q: i === kc && t > tC ? 1 : f.visto };
      };
      const rotulos = (alto) => { for (let i = 0; i < NF; i++) { const f = fila(i); if (f.esc > 0.6) W.etiqueta('f' + i, NOMBRES[i], 0, alto || 2.28, f.z, (f.esc - 0.6) / 0.4, f.visto > 0.5 ? '#e2a336' : '#f87171'); } };
      // En inglés (en-reto-02): como mucho 4 rótulos a la vez, los de los maniquíes más cercanos, enteros dentro del cuadro
      // (márgenes de 60 px), sin pisarse y todos con el mismo tamaño de letra (W.rotulo). Se llama después de W.camara.
      const rotulosEN = () => {
        const y = 2.28, cand = [];
        for (let i = 0; i < NF; i++) { const f = fila(i); if (f.esc > 0.6) cand.push({ i, f }); }
        cand.sort((a, b) => W.cam.position.distanceTo(new W.T.Vector3(0, y, a.f.z)) - W.cam.position.distanceTo(new W.T.Vector3(0, y, b.f.z)));
        const ok = [];
        for (const c of cand) {
          if (ok.length >= 4) break;
          const P = W.pantalla(0, y, c.f.z), d = W.cam.position.distanceTo(new W.T.Vector3(0, y, c.f.z));
          if (P.z > 1) continue;
          const ppm = 1920 / (2 * d * Math.tan(23 * Math.PI / 180)), ancho = W.anchoRotulo(NOMBRES[c.i]) * ppm / 2, alto = 0.352 * ppm / 2;
          if (P.x - ancho < 60 || P.x + ancho > 1020 || P.y - alto < 480 || P.y + alto > 1500) continue;
          if (ok.some(o => Math.abs(o.x - P.x) < o.w + ancho + 10 && Math.abs(o.y - P.y) < o.h + alto + 8)) continue;
          ok.push({ x: P.x, y: P.y, w: ancho, h: alto });
          W.rotulo('f' + c.i, NOMBRES[c.i], 0, y, c.f.z, (c.f.esc - 0.6) / 0.4, c.f.visto > 0.5 ? '#e2a336' : '#f87171');
        }
      };
      const luzPuerta = t > tC ? 1 - 0.5 * sale(tramo(t, tC, tC + 0.6)) : 1;
      W.puerta({ x: 0, z: PZ, luz: luzPuerta }); W.multitud(t, { directo });
      if (k === 0) {
        W.camara(5.4 - 1.4 * p, 6.4 - p, 13.5 - 2.5 * p, 0, 1.2, -3);
      } else if (k === 1) {
        if (!EN) rotulos(); W.niebla(11, 36);
        const cz = 5 - 0.9 * s; W.camara(4.4, 2.5, cz + 6, 0, 1.55, cz - 2.5);   // tres cuartos, acompañando a la fila
        if (EN) rotulosEN();
      } else if (k === 2) {
        W.niebla(9, 30);
        W.camara(-3.7 + 0.5 * p, 2.0, -0.8 - 0.6 * p, 0.2, 1.75, -7.2);
      } else if (k === 3) {
        if (!EN) rotulos(); W.heroe({ x: HX, z: HZ, luz: sale(tramo(s, 0.05, 0.55)), gira: -Math.PI / 2 });
        W.camara(6.4 - 0.8 * p, 4.3, HZ + 9 - p, 0.9, 1.5, HZ - 2.2);
        if (EN) rotulosEN();
      } else if (k === 4) {
        if (!EN) rotulos(); W.heroe({ x: HX, z: HZ, luz: 1, gira: -Math.PI / 2, senala: sale(tramo(t, tC - 0.4, tC - 0.05)) });
        W.etiqueta('hecho', EN ? 'CANCELED ✓' : 'CANCELADA ✓', 0, 1.5, HZ, sale(tramo(t, tC + 0.7, tC + 1.1)), '#5eead4');
        W.camara(3.3 - 0.3 * p, 2.05, HZ + 8 - 0.5 * p, 1.05, 1.9, HZ);
        if (EN) rotulosEN();
      } else {
        W.heroe({ x: HX, z: HZ, luz: 1, gira: -Math.PI / 2 + 0.9 * sale(tramo(s, 0, 0.8)) });
        const a = 0.25 * p; W.camara(4 + Math.sin(a) * 3, 8.5 + p, HZ + 10.5, 0, 0.6, HZ - 3.5);
      }
    },
    texto: { es: `Hay un gasto que sale de tu cuenta todos los meses… y ni lo miras. 👻

Día 2 de 30 para ordenar tu dinero: abre la app de tu banco, busca los cargos que se repiten (suscripciones, apps, cuotas) y apúntalos todos. Y hoy cancela uno que no uses. Solo uno.

💾 Guárdalo para hacerlo esta noche.
👉 Mañana, día 3: lo que vale de verdad una hora de tu trabajo. Síguenos para no perderte ningún día.

#finanzaspersonales #ahorro #suscripciones #retodeahorro #educacionfinanciera` }
  }),

  // Día 3 · Lo que vale una hora de tu trabajo: los precios, pasados a horas. Los maniquíes son aquí tus horas de trabajo.
  // El gancho: una fila de doce que se va por la puerta roja (120 € = 12 h). Al final, las mismas doce horas, detectadas
  // (ámbar), esperando delante de la puerta: ¿las dejas ir por unas zapatillas?
  'es-reto-03': pildora3d({
    slug: 'es-reto-03', cuenta: 'es',
    T: { es: {
      titulo: 'Día 3/30 · Lo que vale de verdad una hora de tu trabajo',
      guion: [
        [0, 'Ese capricho no cuesta 120 euros. §Cuesta *doce horas de tu vida*.'],
        [1, 'Haz la cuenta: tu sueldo neto, §entre las horas que trabajas al mes. §{ding}Eso vale *una hora tuya*.'],
        [2, 'Si cobras 1.600 y trabajas 160 horas, §{caja}son *diez euros la hora*.'],
        [3, '*Día tres*. §Calcula tu hora. §Y antes de comprar algo, *pásalo a horas*.'],
        [4, 'Unas zapatillas de 120: §{pop}doce horas trabajando. ¿Las siguen valiendo?'],
        [5, 'Día tres de treinta para *ordenar tu dinero*. §Mañana: el truco de las *24 horas* antes de comprar.']
      ]
    } },
    fijo: () => hud(3, TOTAL),
    cssExtra: `
      .cuenta { position: absolute; left: 50%; background: rgba(9,14,27,.88); border: 2px solid rgba(148,163,184,.3); border-radius: 24px;
        padding: 18px 44px 22px; text-align: center; white-space: nowrap; opacity: 0; }
      .cuenta small { display: block; font: 700 22px/1.3 'DejaVu Sans Mono', monospace; letter-spacing: .16em; color: #94a3b8; margin-bottom: 4px; }
      .cuenta .l { display: block; font-size: 56px; line-height: 1.18; font-weight: 900; letter-spacing: -.015em; color: #fff; font-variant-numeric: tabular-nums; }
      .cuenta .l.res { font-size: 80px; color: #5eead4; }
      .cuenta .l.ambar { color: #f5b94a; }`,
    escenas: [
      // 0 · La fila de doce se va por la puerta roja; «120 €» encima y la traducción a horas.
      { html: () => `<div class="dato" data-t="translateX(-50%)" style="top:1250px"><small>EN HORAS DE TRABAJO</small><b class="rojo">${PRECIO / HORA} HORAS</b></div>`,
        anim: function (s, e, el) { const m = e.seg[0].marcas[0]; aparece3(el.querySelector('.dato'), rebote(tramo(s, m - 0.1, m + 0.3))); } },
      // 1 · La cuenta, paso a paso; el héroe (una hora tuya) se enciende en el «ding».
      { html: () => `<div class="cuenta" data-t="translateX(-50%)" style="top:520px"><small>LA CUENTA</small>
          <span class="l">Sueldo neto</span><span class="l">÷ horas al mes</span><span class="l res">= 1 hora tuya</span></div>`,
        anim: function (s, e, el) { const M = e.seg[0].marcas, c = el.querySelector('.cuenta'), l = c.querySelectorAll('.l');
          aparece3(c, rebote(tramo(s, 0.15, 0.5)));
          [-1, M[0], M[1]].forEach((m, i) => { const q = i === 0 ? 1 : sale(tramo(s, m - 0.1, m + 0.25)); l[i].style.opacity = q; l[i].style.transform = 'translateY(' + (1 - q) * 18 + 'px)'; }); } },
      // 2 · El ejemplo: 1.600 € ÷ 160 h = 10 €/h.
      { html: () => `<div class="cuenta" data-t="translateX(-50%)" style="top:520px"><small>EJEMPLO</small>
          <span class="l">${SUELDO.toLocaleString('es-ES', { useGrouping: 'always' })} € ÷ ${HORAS} h</span><span class="l res">= ${HORA} €/h</span></div>`,
        anim: function (s, e, el) { const m = e.seg[0].marcas[0], c = el.querySelector('.cuenta'), l = c.querySelectorAll('.l');
          aparece3(c, rebote(tramo(s, 0.1, 0.45))); const q = rebote(tramo(s, m - 0.1, m + 0.3)); l[1].style.opacity = Math.min(1, q * 1.5); l[1].style.transform = 'scale(' + (0.7 + 0.3 * q) + ')'; } },
      // 3 · La tarea del día.
      { html: () => `<div class="rotulo" data-t="translateX(-50%)" style="top:540px">Calcula tu hora</div>
          <div class="rotulo" data-t="translateX(-50%)" style="top:640px">Antes de comprar: pásalo a horas</div>`,
        anim: function (s, e, el) { const M = e.seg[0].marcas, r = el.querySelectorAll('.rotulo');
          aparece3(r[0], rebote(tramo(s, M[0] - 0.1, M[0] + 0.3))); aparece3(r[1], rebote(tramo(s, M[1] - 0.1, M[1] + 0.3))); } },
      // 4 · Zapatillas de 120 €: doce horas se separan del mes y esperan delante de la puerta.
      { html: () => `<div class="cuenta" data-t="translateX(-50%)" style="top:520px"><small>ZAPATILLAS</small>
          <span class="l">${PRECIO} € ÷ ${HORA} €/h</span><span class="l res ambar">= ${PRECIO / HORA} horas</span></div>`,
        anim: function (s, e, el) { const m = e.seg[0].marcas[0], c = el.querySelector('.cuenta'), l = c.querySelectorAll('.l');
          aparece3(c, rebote(tramo(s, 0.1, 0.45))); const q = rebote(tramo(s, m - 0.1, m + 0.3)); l[1].style.opacity = Math.min(1, q * 1.5); l[1].style.transform = 'scale(' + (0.7 + 0.3 * q) + ')'; } },
      finSerie({ dia: 3, total: TOTAL, serie: SERIE, etiquetaManana: 'MAÑANA · DÍA 4', manana: 'El truco de las 24 horas antes de comprar', sigue: '<b>Síguenos</b> para no perderte ningún día' })
    ],
    tres: function (t, k, s, e, W) {
      // Mundo del día: un bloque de 7 × 6 maniquíes grises (tus horas del mes) con el héroe delante; las columnas 5 y 6
      // son las doce horas del gancho (i 0..11). La puerta roja, a la derecha y al fondo.
      const p = Math.min(1, s / (e.fin - e.ini)), BX = -0.6, DX = 3.4, DZ = -5.4, HX = -0.6, HZ = 3.3, NQ = 12;
      const E4 = ESC[4], tP = E4.ini + (E4.seg[0].marcas[0] != null ? E4.seg[0].marcas[0] : 1.4);   // «doce horas»
      const enBloque = (i) => { const c = i < NQ ? 5 + i % 2 : (i - NQ) % 5, r = i < NQ ? Math.floor(i / 2) : Math.floor((i - NQ) / 5); return [BX + (c - 3) * 0.8, 1 - r * 0.95]; };
      const enFila = (j) => [DX + (j % 2 - 0.5) * 0.8, 1 - Math.floor(j / 2) * 0.95];
      const aceras = (i, a) => { const lado = i % 2 ? 1 : -1, dir = i % 3 ? -1 : 1, u = (((t * a.vel + a.u0) % 30) + 30) % 30 - 15;
        return { x: DX + (lado > 0 ? 7.6 + ((i * 2.37) % 7.5) : -(4.6 + ((i * 2.37) % 8))), z: DZ + 7 + dir * u, rot: dir > 0 ? 0 : Math.PI, amp: 1, fase: t * a.vel * 4.5, esc: Math.min(1, (15 - Math.abs(u)) / 2.5) }; };
      let directo;
      if (k === 0) {
        // Gancho: las doce en fila india hacia la puerta (en bucle: siempre hay doce en la fila).
        const LARGO = 15, PASO = LARGO / NQ, VEL = 1.2;
        directo = (i, a) => {
          if (i >= NQ) return aceras(i, a);
          const z = DZ + LARGO - (((t * VEL + i * PASO) % LARGO) + LARGO) % LARGO;
          return { x: DX, z, rot: Math.PI, amp: 1, fase: t * VEL * 4.5, color: 0xef4444, cq: 0.92, brillo: 0.2,
            esc: Math.min(1, Math.max(0, (z - DZ + 0.2) / 1.2)) * Math.min(1, (DZ + LARGO - z) / 1.5) };
        };
      } else {
        directo = (i, a) => {
          if (i >= 42) return { x: -40, z: -40, esc: 0 };
          const [bx, bz] = enBloque(i), mece = 0.06 * Math.sin(t * 0.8 + i * 1.7);
          if (i >= NQ || t < tP) return { x: bx, z: bz, rot: mece };
          // Las doce horas de las zapatillas: se separan del bloque hacia la puerta y se quedan esperando (ámbar: detectadas).
          const t0 = tP + (i % 2) * 0.12 + Math.floor(i / 2) * 0.07, q = tramo(t, t0, t0 + 1.7), ee = q * q * (3 - 2 * q), [fx, fz] = enFila(i);
          const rot = q < 0.15 ? giro(0, Math.PI / 2, q / 0.15) : q < 0.85 ? Math.PI / 2 : giro(Math.PI / 2, Math.PI, (q - 0.85) / 0.15);
          return { x: bx + (fx - bx) * ee, z: bz + (fz - bz) * ee, rot, amp: q < 1 ? Math.min(1, (1 - q) * 6, q * 8) : 0, fase: (t - t0) * 7,
            color: 0xe2a336, cq: sale(tramo(t, t0 - 0.1, t0 + 0.4)), brillo: 0.3 };
        };
      }
      const giro = (a, b, q) => a + (b - a) * q;
      W.multitud(t, { directo });
      W.puerta({ x: DX, z: DZ, luz: k === 0 ? 1 : 0.8 });
      if (k === 0) {
        W.etiqueta('precio', '120 €', DX, 3.5, DZ, 1, '#f87171', 2.3);
        W.niebla(12, 40);
        W.camara(DX + 5.4 - 1.4 * p, 6.4 - p, DZ + 20.5 - 2.5 * p, DX, 1.2, DZ + 4);
      } else if (k === 1) {
        const M = e.seg[0].marcas, luz = sale(tramo(s, (M[1] != null ? M[1] : 3) - 0.1, (M[1] != null ? M[1] : 3) + 0.5));
        W.heroe({ x: HX, z: HZ, luz, y: 0.05 * luz * Math.max(0, Math.sin((s - (M[1] || 3)) * 9)) });
        W.niebla(10, 34);
        W.camara(HX + 1.8 - 0.5 * p, 3.0, HZ + 7.8 - 0.6 * p, HX + 0.2, 1.75, HZ - 1.5);
      } else if (k === 2) {
        const m = e.seg[0].marcas[0] != null ? e.seg[0].marcas[0] : 2;
        W.heroe({ x: HX, z: HZ, luz: 1 });
        W.etiqueta('hora', '10 €/h', HX, 2.3, HZ, sale(tramo(s, m - 0.05, m + 0.35)), '#5eead4', 0.95);
        W.niebla(8, 28);
        W.camara(HX + 2.2 - 0.5 * p, 2.1, HZ + 6.4 - 0.6 * p, HX + 0.2, 2.05, HZ - 0.6);
      } else if (k === 3) {
        W.heroe({ x: HX, z: HZ, luz: 1, brazos: 0 });
        W.etiqueta('hora', '10 €/h', HX, 2.3, HZ, 1, '#5eead4', 0.95);
        W.niebla(10, 34);
        const a = -0.55 + 0.75 * p; W.camara(HX + Math.sin(a) * 7, 2.4, HZ + Math.cos(a) * 7, HX, 1.9, HZ - 1.5);
      } else if (k === 4) {
        const q = sale(tramo(t, tP + 1.4, tP + 2.4));
        W.heroe({ x: HX, z: HZ, luz: 1, gira: (Math.PI / 2) * 0.6 * q });
        W.etiqueta('hora', '10 €/h', HX, 2.35, HZ, 1, '#5eead4', 1.05);
        W.etiqueta('doce', '12 HORAS', DX, 2.65, -1.4, sale(tramo(t, tP + 1.5, tP + 2)), '#e2a336', 1.8);
        W.niebla(14, 46);
        W.camara(1.0 + 0.3 * p, 4.6 - 0.2 * p, 15.5 - 0.8 * p, 1.1, 2.0, -1.5);
      } else {
        W.heroe({ x: HX, z: HZ, luz: 1, gira: Math.PI / 2 * 0.6 });
        const a = 0.2 * p; W.camara(4.4 + Math.sin(a) * 6, 9 + p, 12.5, 0.3, 0.4, -2);
      }
    },
    texto: { es: `Ese capricho de 120 € no cuesta 120 €. Cuesta 12 horas de tu vida. ⏳

Día 3 de 30 para ordenar tu dinero. Hoy, una cuenta: tu sueldo neto ÷ las horas que trabajas al mes = lo que vale tu hora. Y desde hoy, antes de comprar algo, divide el precio entre tu hora: eso es lo que te cuesta en tiempo de tu vida.

💾 Guárdalo y haz la cuenta hoy.
👉 Mañana, día 4: el truco de las 24 horas antes de comprar. Síguenos para no perderte ningún día.

#finanzaspersonales #ahorro #retodeahorro #educacionfinanciera #dinero` }
  }),

  // Día 4 · La regla de las 24 horas: las ganas de comprar llegan en segundos y muchas veces se van solas.
  // Sin datos ni estadísticas: es una regla práctica. Enlaza con el día 3 (pasar el precio a horas de trabajo).
  'es-reto-04': pildora3d({
    slug: 'es-reto-04', cuenta: 'es',
    T: { es: {
      titulo: 'Día 4/30 · El truco de las 24 horas antes de comprar',
      guion: [
        [0, '¿Lo quieres, §o lo quieres *ahora*? No es lo mismo.'],
        [1, 'Las ganas de comprar llegan en segundos. §Y muchas veces, §{pop}se van solas *en un día*.'],
        [2, '*Día cuatro*. §Si no es comida ni una urgencia, §{tic}espera *24 horas* antes de pagar.'],
        [3, 'Déjalo en el carrito y §pásalo a horas de trabajo, como ayer. §{ding}Si mañana lo sigues queriendo, *cómpralo tranquilo*.'],
        [4, 'Y si mañana ni te acuerdas, §{caja}ese dinero *se queda contigo*.'],
        [5, 'Día cuatro de treinta para *ordenar tu dinero*. §Mañana: *págate a ti primero*, el mismo día que cobras.']
      ]
    } },
    fijo: () => hud(4, TOTAL),
    cssExtra: `
      .reloj24 { position: absolute; left: 50%; top: 520px; text-align: center; background: rgba(9,14,27,.88); border: 3px solid rgba(245,185,74,.7);
        border-radius: 26px; padding: 14px 44px 20px; white-space: nowrap; opacity: 0; }
      .reloj24 small { display: block; font: 700 23px/1.35 'DejaVu Sans Mono', monospace; letter-spacing: .14em; color: #f5b94a; }
      .reloj24 b { display: block; font: 800 112px/1.05 'DejaVu Sans Mono', monospace; color: #fff; letter-spacing: -.02em; }`,
    escenas: [
      // 0 · El héroe ante la puerta roja: «LO QUIERO» → «LO QUIERO YA».
      { html: () => '', anim: null },
      // 1 · Las ganas (rojas) corren hacia la puerta; en el pop se apagan y se dispersan.
      { html: () => '', anim: null },
      // 2 · Reloj de 24 horas que empieza a correr en el tic.
      { html: () => `<div class="reloj24" data-t="translateX(-50%)"><small>SI NO ES COMIDA NI UNA URGENCIA</small><b>24:00:00</b></div>
          <div class="rotulo" data-t="translateX(-50%)" style="top:790px">Espera 24 horas antes de pagar</div>`,
        anim: function (s, e, el) {
          const M = e.seg[0].marcas, m0 = M[0] != null ? M[0] : 0.8, m1 = M[1] != null ? M[1] : 2.5, r = el.querySelector('.reloj24');
          aparece3(r, rebote(tramo(s, m0 - 0.1, m0 + 0.3))); aparece3(el.querySelector('.rotulo'), rebote(tramo(s, m1 - 0.1, m1 + 0.3)));
          const q = Math.max(0, 24 * 3600 - Math.max(0, s - m1) * 900), h = Math.floor(q / 3600), mi = Math.floor(q / 60) % 60, se = Math.floor(q) % 60;
          r.querySelector('b').textContent = [h, mi, se].map(x => String(x).padStart(2, '0')).join(':'); } },
      // 3 · El carrito (caja turquesa) guarda la compra: «= 12 horas de trabajo»; en el ding la puerta se vuelve turquesa.
      { html: () => `<div class="rotulo" data-t="translateX(-50%)" style="top:560px">= 12 horas de trabajo</div>
          <div class="rotulo" data-t="translateX(-50%)" style="top:660px">¿Mañana lo quieres? Cómpralo tranquilo</div>`,
        anim: function (s, e, el) { const M = e.seg[0].marcas, r = el.querySelectorAll('.rotulo');
          aparece3(r[0], rebote(tramo(s, (M[0] != null ? M[0] : 1.5) - 0.1, (M[0] != null ? M[0] : 1.5) + 0.3)));
          aparece3(r[1], rebote(tramo(s, (M[1] != null ? M[1] : 3.5) - 0.1, (M[1] != null ? M[1] : 3.5) + 0.3))); } },
      // 4 · La compra se desvanece y las doce horas de ayer vuelven contigo, en turquesa.
      { html: () => `<div class="dato" data-t="translateX(-50%)" style="top:540px"><small>SE QUEDA CONTIGO</small><b>12 horas</b></div>`,
        anim: function (s, e, el) { const m = e.seg[0].marcas[0] != null ? e.seg[0].marcas[0] : 1.2; aparece3(el.querySelector('.dato'), rebote(tramo(s, m + 0.4, m + 0.8))); } },
      finSerie({ dia: 4, total: TOTAL, serie: SERIE, etiquetaManana: 'MAÑANA · DÍA 5', manana: 'Págate a ti primero, el mismo día que cobras', sigue: '<b>Síguenos</b> para no perderte ningún día' })
    ],
    tres: function (t, k, s, e, W) {
      const p = Math.min(1, s / (e.fin - e.ini)), DZ = -6, HX = 0, HZ = 1.5, CX = 1.7, CZ = 2.3, NQ = 12;
      const mk = (kk, j, def) => ESC[kk].ini + (ESC[kk].seg[0].marcas[j] != null ? ESC[kk].seg[0].marcas[j] : def);
      const ROJO = 0xef4444, TURQ = 0x2dd4bf, AMBAR = 0xe2a336;
      const fuera = { x: -60, z: -60, esc: 0 };
      let directo = () => fuera;
      W.puerta({ x: 0, z: DZ, luz: k === 2 ? 0.55 : 1 });
      if (k === 0) {
        const m0 = mk(0, 0, 1);
        W.heroe({ x: HX, z: HZ, gira: Math.PI, luz: 0.15, senala: sale(tramo(t, m0, m0 + 0.4)) });
        const ya = sale(tramo(t, m0 - 0.05, m0 + 0.3));
        W.etiqueta('quiero', 'LO QUIERO', 0, 3.35, DZ, 1 - ya, '#f87171', 1.7);
        W.etiqueta('quieroya', 'LO QUIERO YA', 0, 3.35, DZ, ya, '#f87171', 1.7 * (1 + 0.06 * Math.sin(t * 9) * ya));
        W.camara(1.5 - 0.3 * p, 2.3, 6.6 - 0.8 * p, 0, 1.7, DZ + 1);
      } else if (k === 1) {
        const tP = mk(1, 1, 2.6);
        directo = (i, a) => {
          if (i >= 9) return fuera;
          const x0 = (i % 3 - 1) * 0.9, z0 = 4.6 + Math.floor(i / 3) * 1.1, tt = Math.min(t, tP) - e.ini, z = z0 - 3.1 * tt;
          const d = sale(tramo(t, tP, tP + 1.2)), lado = i % 2 ? 1 : -1, ang = lado * (0.6 + (i % 3) * 0.35);
          return { x: x0 + Math.sin(ang) * 3.2 * d, z: z - Math.cos(ang) * 0.4 * d, rot: Math.PI - ang * d, amp: 1 - 0.75 * d, fase: t * 10 * (1 - 0.6 * d),
            esc: 1 - 0.85 * sale(tramo(t, tP + 0.6, tP + 1.6)), color: ROJO, cq: 0.92 * (1 - d), brillo: 0.25 };
        };
        W.niebla(10, 40);
        W.camara(4.4 - 0.8 * p, 3.4, 11 - 0.6 * p, 0, 1.0, -2.4);
      } else if (k === 2) {
        W.heroe({ x: HX, z: HZ, gira: Math.PI * (1 - sale(tramo(s, 0.1, 0.9))), luz: 0.4 + 0.6 * sale(tramo(s, 0.3, 1)) });
        W.niebla(9, 34);
        W.camara(1.8 - 0.4 * p, 2.0, HZ + 6 - 0.6 * p, 0, 2.25, HZ - 2);
      } else if (k === 3) {
        const m0 = mk(3, 0, 1.5), m1 = mk(3, 1, 3.5), ca = sale(tramo(s, 0.15, 0.85)), va = tramo(t, m1 + 0.3, m1 + 4.5);
        W.caja({ x: CX, z: CZ, rot: -0.3, luz: 1, item: { y: 0.45 + 2.2 * (1 - ca) * (1 - ca) } });
        W.etiqueta('doceh', '12 HORAS', CX, 1.75, CZ, sale(tramo(t, m0 - 0.05, m0 + 0.3)), '#e2a336', 1.2);
        W.puerta({ x: 0, z: DZ, luz: 1, color: TURQ, cq: sale(tramo(t, m1 - 0.05, m1 + 0.5)) });
        W.heroe({ x: HX, z: HZ + (DZ - 0.5 - HZ) * va, gira: va > 0 ? Math.PI : -0.4, luz: 1, amp: va > 0 && va < 1 ? 0.75 : 0, fase: t * 6 });
        W.camara(6.2 - 0.8 * p, 4.6, 11.8 - 0.8 * p, 0.2, 1.2, -2.2);
      } else if (k === 4) {
        const tC = mk(4, 0, 1.2);
        W.caja({ x: CX, z: CZ, rot: -0.3, luz: 1, item: { op: 1 - sale(tramo(s, 0.1, 0.9)) } });
        W.heroe({ x: HX, z: HZ, gira: 0, luz: 1 });
        directo = (i, a) => {
          if (i >= NQ) return fuera;
          const x0 = 1.3 + (i % 2) * 0.8, z0 = DZ + 1.4 + Math.floor(i / 2) * 0.9, x1 = -1.6 - (i % 2) * 0.8, z1 = 0.9 - Math.floor(i / 2) * 0.9;
          const t0 = tC + (i % 2) * 0.1 + Math.floor(i / 2) * 0.08, q = tramo(t, t0, t0 + 2.2), ee = q * q * (3 - 2 * q);
          return { x: x0 + (x1 - x0) * ee, z: z0 + (z1 - z0) * ee, rot: q <= 0 ? 0 : q < 1 ? Math.atan2(x1 - x0, z1 - z0) : 0, amp: q > 0 && q < 1 ? 1 : 0, fase: (t - t0) * 7,
            color: AMBAR, cq: 0.9, brillo: 0.3, color2: TURQ, c2q: sale(tramo(t, t0, t0 + 0.6)) };
        };
        W.etiqueta('doce', '12 HORAS', -2, 2.6, -1.6, sale(tramo(t, tC + 2.2, tC + 2.7)), '#5eead4', 1.2);
        W.camara(0.4 - 0.3 * p, 6.8, 12.6 - 0.6 * p, -0.2, 0.4, -2);
      } else {
        W.heroe({ x: HX, z: HZ, luz: 1 });
        directo = (i, a) => i >= NQ ? fuera : { x: -1.6 - (i % 2) * 0.8, z: 0.9 - Math.floor(i / 2) * 0.9, color: TURQ, cq: 0.9, brillo: 0.3 };
        const a = 0.25 * p; W.camara(3 + Math.sin(a) * 3, 8 + p, 11, -0.5, 0.4, -2);
      }
      W.multitud(t, { directo });
    },
    texto: { es: `¿Lo quieres, o lo quieres ahora? No es lo mismo. ⏳

Día 4 de 30 para ordenar tu dinero. La regla de hoy: si no es comida ni una urgencia, espera 24 horas antes de pagar. Déjalo en el carrito y pásalo a horas de trabajo, con la cuenta de ayer (precio ÷ lo que vale tu hora).
Un truco para que funcione: borra la tarjeta guardada en las tiendas online. Tener que sacarla otra vez te da esos segundos para pensarlo.

💾 Guárdalo para tu próxima compra.
👉 Mañana, día 5: págate a ti primero, el mismo día que cobras. Síguenos para no perderte ningún día.

#finanzaspersonales #ahorro #retodeahorro #educacionfinanciera #dinero` }
  }),

  // Día 5 · Págate a ti primero: transferencia automática el mismo día que cobras. Ejemplo (no estadística): si cobras
  // 1.600 €, un 5 % son 80 € al mes y 960 € al año. En pantalla, la nómina son 20 maniquíes: cada uno, 80 € (el 5 %).
  'es-reto-05': pildora3d({
    slug: 'es-reto-05', cuenta: 'es',
    T: { es: {
      titulo: 'Día 5/30 · Págate a ti primero, el mismo día que cobras',
      guion: [
        [0, 'Si ahorras lo que te sobra a final de mes, §ya sabes cuánto te sobra: §{pop}*nada*.'],
        [1, 'El truco es darle la vuelta. §El día que cobras la nómina, §lo primero que pagas *eres tú*.'],
        [2, '*Día cinco*. §Programa una transferencia automática a otra cuenta §{tic}*el mismo día que cobras*.'],
        [3, 'Empieza pequeño: §un 5 % del sueldo. §Si cobras 1.600 euros, §{caja}*80 al mes*.'],
        [4, 'Lo que no ves en tu cuenta, §{ding}*no te lo gastas*. §Y en un año son *960 euros*.'],
        [5, 'Día cinco de treinta para *ordenar tu dinero*. §Mañana: *las comisiones del banco* que puedes dejar de pagar.']
      ]
    } },
    fijo: () => hud(5, TOTAL),
    cssExtra: `
      .cal { position: absolute; left: 50%; top: 510px; text-align: center; background: rgba(9,14,27,.9); border: 3px solid rgba(245,185,74,.75);
        border-radius: 24px; padding: 12px 40px 18px; white-space: nowrap; opacity: 0; }
      .cal small { display: block; font: 700 23px/1.35 'DejaVu Sans Mono', monospace; letter-spacing: .14em; color: #f5b94a; }
      .cal b { display: block; font-size: 66px; line-height: 1.1; font-weight: 900; color: #fff; letter-spacing: -.02em; }
      .cuenta5 { position: absolute; left: 50%; top: 510px; background: rgba(9,14,27,.9); border: 2px solid rgba(94,234,212,.5); border-radius: 24px;
        padding: 14px 42px 18px; text-align: center; white-space: nowrap; opacity: 0; }
      .cuenta5 small { display: block; font: 700 23px/1.35 'DejaVu Sans Mono', monospace; letter-spacing: .14em; color: #94a3b8; }
      .cuenta5 .l { display: block; font-size: 54px; line-height: 1.18; font-weight: 900; color: #fff; font-variant-numeric: tabular-nums; }
      .cuenta5 .t { color: #5eead4; }`,
    escenas: [
      // 0 · Fin de mes: la nómina se ha ido por la puerta; el héroe mira la caja de «lo que sobra»: 0 €.
      { html: () => '', anim: null },
      // 1 · Día de cobro: entra la nómina (20 maniquíes) y el primero se vuelve turquesa y se aparta: eres tú.
      { html: () => '', anim: null },
      // 2 · La caja «AHORRO», el calendario ámbar «DÍA DE COBRO» y, en el tic, «AUTOMÁTICO».
      { html: () => `<div class="cal" data-t="translateX(-50%)"><small>CADA MES</small><b>DÍA DE COBRO</b></div>
          <div class="rotulo" data-t="translateX(-50%)" style="top:700px">Transferencia AUTOMÁTICA</div>`,
        anim: function (s, e, el) { const M = e.seg[0].marcas, m0 = M[0] != null ? M[0] : 0.6, m1 = M[1] != null ? M[1] : 3;
          aparece3(el.querySelector('.cal'), rebote(tramo(s, m0 - 0.1, m0 + 0.3))); aparece3(el.querySelector('.rotulo'), rebote(tramo(s, m1 - 0.1, m1 + 0.3))); } },
      // 3 · La cuenta: 5 % de 1.600 € = 80 € al mes (uno de los 20 maniquíes).
      { html: () => `<div class="cuenta5" data-t="translateX(-50%)"><small>SI COBRAS ${SUELDO.toLocaleString('es-ES', { useGrouping: 'always' })} €</small>
          <span class="l">${SUELDO.toLocaleString('es-ES', { useGrouping: 'always' })} € × ${PCT} %</span><span class="l t">= ${MES5} € al mes</span></div>`,
        anim: function (s, e, el) { const M = e.seg[0].marcas, c = el.querySelector('.cuenta5'), l = c.querySelectorAll('.l');
          aparece3(c, rebote(tramo(s, (M[1] != null ? M[1] : 1.2) - 0.1, (M[1] != null ? M[1] : 1.2) + 0.3)));
          const m = M[2] != null ? M[2] : 2.4, q = rebote(tramo(s, m - 0.1, m + 0.3)); l[1].style.opacity = Math.min(1, q * 1.5); l[1].style.transform = 'scale(' + (0.7 + 0.3 * q) + ')'; } },
      // 4 · El turquesa entra en la caja y el resto se va al mes; contador «12 meses → 960 €».
      { html: () => `<div class="cuenta5" data-t="translateX(-50%)"><small>EN UN AÑO</small><span class="l"><span class="mes">1 mes</span> → <span class="t eur">80 €</span></span></div>`,
        anim: function (s, e, el) { const M = e.seg[0].marcas, m = M[1] != null ? M[1] : 2.2, c = el.querySelector('.cuenta5');
          aparece3(c, rebote(tramo(s, m - 0.1, m + 0.3))); const n = 1 + Math.round(11 * tramo(s, m + 0.1, m + 1.4));
          c.querySelector('.mes').textContent = n + (n === 1 ? ' mes' : ' meses'); c.querySelector('.eur').textContent = (n * 80).toLocaleString('es-ES') + ' €'; } },
      finSerie({ dia: 5, total: TOTAL, serie: SERIE, etiquetaManana: 'MAÑANA · DÍA 6', manana: 'Las comisiones del banco que puedes dejar de pagar', sigue: '<b>Síguenos</b> para no perderte ningún día' })
    ],
    tres: function (t, k, s, e, W) {
      const p = Math.min(1, s / (e.fin - e.ini)), N = 20, DX = -1.4, DZ = -7.5, HX = 0.7, HZ = 2.9, CX = 2.3, CZ = 1.6;
      const mk = (kk, j, def) => ESC[kk].ini + (ESC[kk].seg[0].marcas[j] != null ? ESC[kk].seg[0].marcas[j] : def);
      const TURQ = 0x2dd4bf, ROJO = 0xef4444;
      const fuera = { x: -60, z: -60, esc: 0 };
      const rejilla = (i) => [-2.6 + (i % 4) * 0.8, 0.6 - Math.floor(i / 4) * 0.9];
      const yo = [1.45, 2.35];   // el «tú» turquesa, junto al héroe y la caja
      let directo = () => fuera, cajaItem = null;
      W.puerta({ x: DX, z: DZ, luz: k === 0 || k === 4 ? 1 : 0.5 });
      const tYo = mk(1, 1, 3);   // «lo primero que pagas eres tú»
      if (k === 0) {
        const m1 = mk(0, 1, 2.6);
        directo = (i, a) => {   // la nómina, en fila india hacia la puerta (en bucle)
          if (i >= 10) return fuera;
          const L = 12, z = DZ + L - (((t * 1.3 + i * L / 10) % L) + L) % L;
          return { x: DX, z, rot: Math.PI, amp: 1, fase: t * 6, color: ROJO, cq: 0.85, brillo: 0.2, esc: Math.min(1, Math.max(0, (z - DZ + 0.2) / 1.2)) * Math.min(1, (DZ + L - z) / 1.5) };
        };
        W.heroe({ x: HX, z: HZ, luz: 0.15, gira: 1.15 });
        W.caja({ x: CX, z: CZ, rot: -0.3, luz: 0.4 });
        W.etiqueta('sobra', 'LO QUE SOBRA', CX, 1.55, CZ, 1, '#e2a336', 1.1);
        W.etiqueta('cero', '0 €', CX, 2.15, CZ, sale(tramo(t, m1 - 0.05, m1 + 0.3)), '#f87171', 1.3 + 0.15 * rebote(tramo(t, m1, m1 + 0.4)));
        W.camara(5.0 - 0.5 * p, 3.6, 10.2 - 0.5 * p, 0.0, 1.3, -1.5);
      } else if (k === 1) {
        directo = (i, a) => {
          if (i >= N) return fuera;
          const [gx, gz] = rejilla(i), t0 = e.ini + 0.1 + (i % 4) * 0.05 + Math.floor(i / 4) * 0.18, q = tramo(t, t0, t0 + 1.6), ee = q * q * (3 - 2 * q), x0 = gx - 7;
          let x = x0 + (gx - x0) * ee, z = gz, rot = Math.PI / 2, amp = q < 1 ? 1 : 0;
          if (q >= 1) rot = giro(Math.PI / 2, 0, tramo(t, t0 + 1.6, t0 + 1.9));
          if (i === 0) { const v = tramo(t, tYo + 0.2, tYo + 1.5), ev = v * v * (3 - 2 * v); if (v > 0) { x = gx + (yo[0] - gx) * ev; z = gz + (yo[1] - gz) * ev; rot = v < 1 ? Math.atan2(yo[0] - gx, yo[1] - gz) : 0; amp = v < 1 ? 1 : 0; } }
          return { x, z, rot, amp, fase: (t - t0) * 7, color: i === 0 ? TURQ : null, cq: i === 0 ? sale(tramo(t, tYo - 0.05, tYo + 0.4)) : 0, brillo: 0.35 };
        };
        W.heroe({ x: HX, z: HZ, luz: 0.3 + 0.7 * sale(tramo(t, tYo, tYo + 0.6)), gira: -0.6 });
        W.caja({ x: CX, z: CZ, rot: -0.3, luz: 0.4 });
        W.etiqueta('nomina', 'NÓMINA', -1.4, 2.6, -1.2, sale(tramo(t, mk(1, 0, 1.5) - 0.05, mk(1, 0, 1.5) + 0.3)), '#cbd5e1', 1.2);
        W.camara(2.6 - 0.4 * p, 6.4, 11.4 - 0.6 * p, -0.4, 0.4, -1);
      } else if (k === 2) {
        directo = (i, a) => i >= N ? fuera : i === 0 ? { x: yo[0], z: yo[1], rot: 0.3, color: TURQ, cq: 1, brillo: 0.35 } : { x: rejilla(i)[0], z: rejilla(i)[1], rot: 0 };
        W.heroe({ x: HX, z: HZ, luz: 1, gira: 0.5 });
        W.caja({ x: CX, z: CZ, rot: -0.3, luz: 1 });
        W.etiqueta('ahorro', 'AHORRO', CX, 1.45, CZ, 1, '#5eead4', 0.9);
        W.camara(4.6 - 0.5 * p, 2.4, 7.2 - 0.6 * p, 1.4, 1.35, 1.0);
      } else if (k === 3) {
        const m2 = mk(3, 2, 2.4);
        directo = (i, a) => i >= N ? fuera : i === 0 ? { x: yo[0], z: yo[1], rot: 0.3, color: TURQ, cq: 1, brillo: 0.35 } : { x: rejilla(i)[0], z: rejilla(i)[1], rot: 0.04 * Math.sin(t + i) };
        W.heroe({ x: HX, z: HZ, luz: 1, gira: -0.5 });
        W.caja({ x: CX, z: CZ, rot: -0.3, luz: 1 });
        W.etiqueta('mil6', '1.600 €', -1.4, 2.55, -1.2, sale(tramo(s, 0.2, 0.6)), '#cbd5e1', 1.2);
        W.etiqueta('ochenta', '80 €', yo[0], 2.3, yo[1], sale(tramo(t, m2 - 0.05, m2 + 0.3)), '#5eead4', 1.1);
        W.camara(1.2 - 0.4 * p, 7.0, 12.2 - 0.5 * p, -0.4, 2.2, -0.4);
      } else if (k === 4) {
        const tD = mk(4, 0, 1.2), entra = tramo(s, 0.1, 1.2);
        directo = (i, a) => {
          if (i >= N) return fuera;
          if (i === 0) { const ee = entra * entra * (3 - 2 * entra); return { x: yo[0] + (CX - yo[0]) * ee, z: yo[1] + (CZ - yo[1]) * ee, rot: Math.atan2(CX - yo[0], CZ - yo[1]), amp: entra < 1 ? 1 : 0, fase: t * 7, esc: 1 - sale(tramo(s, 0.8, 1.3)), color: TURQ, cq: 1, brillo: 0.35 }; }
          const [gx, gz] = rejilla(i), t0 = e.ini + 0.4 + i * 0.08, q = tramo(t, t0, t0 + 3), ee = q * q * (3 - 2 * q);
          const x = gx + (DX - gx) * ee, z = gz + (DZ - gz) * ee;
          return { x, z, rot: q > 0 ? Math.atan2(DX - gx, DZ - gz) : 0, amp: q > 0 && q < 1 ? 1 : 0, fase: (t - t0) * 7, esc: 1 - sale(tramo(t, t0 + 2.4, t0 + 3)) };
        };
        cajaItem = { y: 0.42, op: sale(tramo(s, 1.0, 1.4)), color: TURQ };
        W.heroe({ x: HX, z: HZ, luz: 1, gira: 0.9, brazos: sale(tramo(t, tD, tD + 0.4)) });
        W.caja({ x: CX, z: CZ, rot: -0.3, luz: 1, item: cajaItem });
        W.camara(5.4 - 0.6 * p, 4.4, 9.6 - 0.6 * p, 0.2, 1.0, -1.6);
      } else {
        W.heroe({ x: HX, z: HZ, luz: 1, brazos: 1 });
        W.caja({ x: CX, z: CZ, rot: -0.3, luz: 1, item: { y: 0.42, color: TURQ } });
        const a = 0.25 * p; W.camara(3 + Math.sin(a) * 3, 6 + p, 9.5, 0.8, 0.8, 0);
      }
      function giro(a, b, q) { return a + (b - a) * q; }
      W.multitud(t, { directo });
    },
    texto: { es: `Si ahorras lo que te sobra a final de mes, ya sabes cuánto te sobra. 🫠

Día 5 de 30 para ordenar tu dinero. Hoy: programa una transferencia automática a otra cuenta el mismo día que cobras la nómina. Empieza por un 5 %: si cobras 1.600 €, son 80 € al mes.
Ponle nombre a esa cuenta («Colchón», «Viaje»…), así sabes para qué es. Y si cobras en fecha variable, prográmala para el día siguiente al que suele llegar la nómina.

💾 Guárdalo y prográmala hoy.
👉 Mañana, día 6: las comisiones del banco que puedes dejar de pagar. Síguenos para no perderte ningún día.

#ahorro #finanzaspersonales #retodeahorro` }
  }),

  // Día 6 · Las comisiones del banco. Fuentes: ASUFIN, VII Barómetro de comisiones bancarias (18-may-2026): comisión media
  // de mantenimiento no bonificada 167,27 €/año (160 € en el VI, may-2025; recogido por Finantres e Infobae/Europa Press).
  // Orden ECE/228/2019, art. 3: cuenta de pago básica, máximo 3 €/mes. RD 164/2019: gratuita para personas vulnerables.
  // RDL 19/2017 (cap. III) y Orden ECE/228/2019: traslado de cuentas, lo gestiona el banco receptor, máx. 13 días hábiles
  // (Banco de España, Portal del Cliente Bancario). Primer día de la serie sin anuncio del siguiente (petición del propietario).
  'es-reto-06': pildora3d({
    slug: 'es-reto-06', cuenta: 'es',
    T: { es: {
      titulo: 'Día 6/30 · Las comisiones del banco que puedes dejar de pagar',
      guion: [
        [0, 'Tu banco puede cobrarte *solo por tener la cuenta*. §Si no cumples sus condiciones, §{pop}de media, *más de 160 euros al año*.'],
        [1, 'Es la comisión de mantenimiento. §Muchos bancos la quitan §si *domicilias la nómina* o pagas recibos con ellos.'],
        [2, '*Día seis*. §Abre tu extracto, §{tic}busca *mantenimiento* y *tarjeta*, §y suma lo de este año.'],
        [3, 'Si te cobran, §pide que te lo quiten §o cámbiate: §{ding}por ley, el *banco nuevo* se encarga de trasladar tus recibos.'],
        [4, 'Y si no puedes cumplir condiciones, §existe la *cuenta de pago básica*: §como mucho, *3 euros al mes*.'],
        [5, 'Día seis de treinta. §El dinero que no se va en comisiones §{pop}*también es ahorro*.']
      ]
    } },
    fijo: () => hud(6, TOTAL),
    cssExtra: `
      .com6 { position: absolute; left: 50%; top: 520px; background: rgba(9,14,27,.9); border: 2px solid rgba(245,185,74,.7); border-radius: 24px;
        padding: 14px 42px 18px; text-align: center; white-space: nowrap; opacity: 0; }
      .com6 small { display: block; font: 700 23px/1.35 'DejaVu Sans Mono', monospace; letter-spacing: .14em; color: #94a3b8; }
      .com6 .l { display: block; font-size: 58px; line-height: 1.16; font-weight: 900; color: #fff; }
      .com6 .r { color: #f87171; } .com6 .t { color: #5eead4; } .com6 .a { color: #f5b94a; }
      .com6 .fte { display: block; margin-top: 8px; font: 600 21px/1.3 'DejaVu Sans Mono', monospace; color: #94a3b8; letter-spacing: .02em; }`,
    escenas: [
      // 0 · La cuenta cobra: monedas rojas que se van por la puerta del banco; «MANTENIMIENTO» y, en el pop, «+160 € al año».
      { html: () => `<div class="com6" data-t="translateX(-50%)"><small>SI NO CUMPLES CONDICIONES</small><span class="l">más de <span class="r">160 € al año</span></span>
          <span class="fte">Media de mantenimiento · ASUFIN, 2026</span></div>`,
        anim: function (s, e, el) { const M = e.seg[0].marcas, m = M[1] != null ? M[1] : 2.6, c = el.querySelector('.com6');
          aparece3(c, 1); const q = rebote(tramo(s, m - 0.1, m + 0.35)); c.querySelector('.r').style.transform = 'scale(' + (1 + 0.18 * Math.sin(Math.PI * q)) + ')'; c.querySelector('.r').style.display = 'inline-block'; } },
      // 1 · Las condiciones: «NÓMINA» y «RECIBOS»; la puerta se vuelve turquesa y deja de salir dinero.
      { html: () => '', anim: null },
      // 2 · Día 6: busca en el extracto «mantenimiento» y «tarjeta».
      { html: () => `<div class="com6" data-t="translateX(-50%)"><small>EN TU EXTRACTO, BUSCA</small><span class="l a">Mantenimiento</span><span class="l a">Tarjeta</span></div>`,
        anim: function (s, e, el) { const M = e.seg[0].marcas, c = el.querySelector('.com6'), l = c.querySelectorAll('.l'), m = M[1] != null ? M[1] : 1.6;
          aparece3(c, rebote(tramo(s, m - 0.2, m + 0.2))); l[1].style.opacity = tramo(s, m + 0.5, m + 0.9); } },
      // 3 · Pide que te lo quiten o cámbiate: el héroe lleva la caja de recibos a la puerta turquesa (el banco nuevo).
      { html: () => `<div class="rotulo" data-t="translateX(-50%)" style="top:560px">El banco nuevo traslada tus recibos</div>`,
        anim: function (s, e, el) { const M = e.seg[0].marcas, m = M[2] != null ? M[2] : 3; aparece3(el.querySelector('.rotulo'), rebote(tramo(s, m - 0.1, m + 0.3))); } },
      // 4 · La cuenta de pago básica: como mucho 3 € al mes.
      { html: () => `<div class="com6" data-t="translateX(-50%)" style="border-color:rgba(94,234,212,.6)"><small>CUENTA DE PAGO BÁSICA</small><span class="l">como mucho <span class="t">3 € al mes</span></span>
          <span class="fte">Orden ECE/228/2019 · gratis para personas vulnerables (RD 164/2019)</span></div>`,
        anim: function (s, e, el) { const M = e.seg[0].marcas, m = M[0] != null ? M[0] : 1.2; aparece3(el.querySelector('.com6'), rebote(tramo(s, m - 0.1, m + 0.3))); } },
      finSerie({ dia: 6, total: TOTAL, serie: SERIE, etiquetaManana: 'HOY · DÍA 6', manana: 'Revisa mantenimiento y tarjeta en tu extracto', sigue: '<b>Síguenos</b> para no perderte ningún día' })
    ],
    tres: function (t, k, s, e, W) {
      const p = Math.min(1, s / (e.fin - e.ini)), DX = -1.2, DZ = -6.5, HX = 1.2, HZ = 2.6, CX = 2.4, CZ = 1.2;
      const TURQ = 0x2dd4bf, ROJO = 0xef4444, fuera = { x: -60, z: -60, esc: 0 };
      const mk = (j, def) => e.ini + (e.seg[0].marcas[j] != null ? e.seg[0].marcas[j] : def);
      // Monedas rojas en fila hacia la puerta del banco (en bucle): el dinero que se va en comisiones.
      const fila = (n, vel) => (i) => {
        if (i >= n) return fuera;
        const L = 10, z = DZ + L - (((t * vel + i * L / n) % L) + L) % L;
        return { x: DX + 0.25 * Math.sin(i * 1.7), z, rot: Math.PI, amp: 1, fase: t * 6, color: ROJO, cq: 0.85, brillo: 0.2, esc: 0.62 * Math.min(1, Math.max(0, (z - DZ + 0.2) / 1.2)) * Math.min(1, (DZ + L - z) / 1.5) };
      };
      let directo = () => fuera;
      if (k === 0) {
        directo = fila(9, 1.4);
        W.puerta({ x: DX, z: DZ, luz: 1 });
        W.etiqueta('mant', 'MANTENIMIENTO', DX, 3.2, DZ, 1, '#f87171', 1.8);
        W.heroe({ x: HX, z: HZ, luz: 0.25, gira: 2.6 });
        W.camara(4.6 - 0.5 * p, 3.4, 9.6 - 0.6 * p, -0.4, 1.4, -2.2);
      } else if (k === 1) {
        const mN = mk(1, 2.4), cambia = sale(tramo(t, mN + 0.6, mN + 1.4));
        directo = (i) => { const d = fila(9, 1.4 * (1 - cambia))(i); return d === fuera ? d : { ...d, esc: d.esc * (1 - cambia) }; };
        W.puerta({ x: DX, z: DZ, luz: 1, color: TURQ, cq: cambia });
        W.etiqueta('nomina6', 'NÓMINA', DX - 1.5, 2.4, DZ + 2.5, sale(tramo(t, mN - 0.05, mN + 0.3)), '#5eead4', 1.6);
        W.etiqueta('recibos6', 'RECIBOS', DX + 1.6, 2.4, DZ + 2.5, sale(tramo(t, mN + 0.5, mN + 0.8)), '#5eead4', 1.6);
        W.heroe({ x: HX, z: HZ, luz: 0.4 + 0.6 * cambia, gira: 2.6 });
        W.camara(3.6 - 0.4 * p, 3.2, 8.8 - 0.4 * p, -0.8, 1.6, -2.6);
      } else if (k === 2) {
        W.puerta({ x: DX, z: DZ, luz: 0.6, color: TURQ, cq: 1 });
        W.heroe({ x: HX, z: HZ, luz: 1, gira: 0.3 });
        W.caja({ x: CX, z: CZ, rot: -0.3, luz: 0.8 });
        W.camara(3.4 - 0.4 * p, 2.3, 7.6 - 0.5 * p, 1.4, 1.3, 0.8);
      } else if (k === 3) {
        const mL = mk(3, 3.2), v = tramo(t, mL - 0.4, mL + 1.6), ev = v * v * (3 - 2 * v);
        const hx = HX + (DX + 0.9 - HX) * ev, hz = HZ + (DZ + 1.6 - HZ) * ev;
        W.puerta({ x: DX, z: DZ, luz: 1, color: TURQ, cq: 1 });
        W.etiqueta('nuevo6', 'BANCO NUEVO', DX, 3.2, DZ, sale(tramo(t, mL - 0.1, mL + 0.3)), '#5eead4', 1.8);
        W.heroe({ x: hx, z: hz, luz: 1, gira: v > 0 && v < 1 ? Math.atan2(DX - HX, DZ - HZ) : 2.6 });
        W.caja({ x: hx + 0.9, z: hz + 0.2, rot: -0.3, luz: 1, item: { y: 0.42, color: TURQ } });
        W.etiqueta('rec6', 'RECIBOS', hx + 0.9, 1.45, hz + 0.2, sale(tramo(s, 0.3, 0.7)), '#cbd5e1', 1.4);
        W.camara(4.8 - 0.4 * p, 3.6, 8.6 - 0.8 * p, -0.2, 1.2, -2.0);
      } else if (k === 4) {
        W.puerta({ x: DX, z: DZ, luz: 1, color: TURQ, cq: 1 });
        W.heroe({ x: HX, z: HZ, luz: 1, gira: 0.6, brazos: sale(tramo(s, 0.6, 1.0)) });
        W.camara(3.2 - 0.3 * p, 2.6, 7.4 - 0.4 * p, 0.6, 1.2, -1.2);
      } else {
        W.puerta({ x: DX, z: DZ, luz: 0.5, color: TURQ, cq: 1 });
        W.heroe({ x: HX, z: HZ, luz: 1, brazos: 1 });
        const a = 0.25 * p; W.camara(3 + Math.sin(a) * 3, 6 + p, 9.5, 0.4, 0.8, -1);
      }
      W.multitud(t, { directo });
    },
    texto: { es: `Tu banco puede cobrarte solo por tener la cuenta. 🏦

Día 6 de 30 para ordenar tu dinero. Hoy: abre el extracto, busca «mantenimiento» y «tarjeta» y suma lo que te han cobrado este año. Si no cumples las condiciones del banco, la comisión media de mantenimiento pasa de 160 € al año (ASUFIN, 2026).
Si te cobran, pide que te la quiten o cámbiate: por ley, el banco nuevo se encarga de trasladar tus recibos (como mucho, 13 días hábiles). Y si no puedes cumplir condiciones, la cuenta de pago básica cuesta como mucho 3 € al mes, y es gratis para personas en situación de vulnerabilidad.

¿Cuánto te ha salido la cuenta? 👇

Fuentes: ASUFIN, Barómetro de comisiones (mayo de 2026) · Orden ECE/228/2019 · RD 164/2019 · RDL 19/2017 · Banco de España, Portal del Cliente Bancario.

#ahorro #comisionesbancarias #retodeahorro` }
  })
};




module.exports = { pildoras };
