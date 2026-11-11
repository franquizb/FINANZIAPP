// Serie «30 días para ordenar tu dinero» · @finanziapp.es (España), en 3D (reels-voz/tres.js).
// Cada día: una sola acción concreta, en ~30 s, y al final «Mañana: …» (da el motivo para seguir la cuenta).
// La metáfora de toda la serie: los maniquíes grises son tu dinero yendo por libre; lo que controlas se enciende.
// Texto de la publicación: gancho + resumen que NO repite el guion + qué hacer hoy (petición del propietario).
// Día 1: no lleva datos externos (es un método: apuntar los gastos 7 días y etiquetarlos).
const { pildora3d, hud, finSerie } = require('./tres');
const { cuadra } = require('../reels/_comun');

// Día 3: sin datos externos; es un ejemplo inventado y se presenta como tal («si cobras 1.600…»).
const SUELDO = 1600, HORAS = 160, PRECIO = 120, HORA = SUELDO / HORAS;
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
      const NOMBRES = ['STREAMING', 'GIMNASIO', 'APP', 'NUBE', 'MÚSICA', 'JUEGOS', 'REVISTA', 'SEGURO', 'PRUEBA GRATIS'];
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
      const luzPuerta = t > tC ? 1 - 0.5 * sale(tramo(t, tC, tC + 0.6)) : 1;
      W.puerta({ x: 0, z: PZ, luz: luzPuerta }); W.multitud(t, { directo });
      if (k === 0) {
        W.camara(5.4 - 1.4 * p, 6.4 - p, 13.5 - 2.5 * p, 0, 1.2, -3);
      } else if (k === 1) {
        rotulos(); W.niebla(11, 36);
        const cz = 5 - 0.9 * s; W.camara(4.4, 2.5, cz + 6, 0, 1.55, cz - 2.5);   // tres cuartos, acompañando a la fila
      } else if (k === 2) {
        W.niebla(9, 30);
        W.camara(-3.7 + 0.5 * p, 2.0, -0.8 - 0.6 * p, 0.2, 1.75, -7.2);
      } else if (k === 3) {
        rotulos(); W.heroe({ x: HX, z: HZ, luz: sale(tramo(s, 0.05, 0.55)), gira: -Math.PI / 2 });
        W.camara(6.4 - 0.8 * p, 4.3, HZ + 9 - p, 0.9, 1.5, HZ - 2.2);
      } else if (k === 4) {
        rotulos(); W.heroe({ x: HX, z: HZ, luz: 1, gira: -Math.PI / 2, senala: sale(tramo(t, tC - 0.4, tC - 0.05)) });
        W.etiqueta('hecho', 'CANCELADA ✓', 0, 1.5, HZ, sale(tramo(t, tC + 0.7, tC + 1.1)), '#5eead4');
        W.camara(3.3 - 0.3 * p, 2.05, HZ + 8 - 0.5 * p, 1.05, 1.9, HZ);
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
  })
};


module.exports = { pildoras };
