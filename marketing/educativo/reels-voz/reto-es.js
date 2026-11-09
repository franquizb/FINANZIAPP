// Serie «30 días para ordenar tu dinero» · @finanziapp.es (España), en 3D (reels-voz/tres.js).
// Cada día: una sola acción concreta, en ~30 s, y al final «Mañana: …» (da el motivo para seguir la cuenta).
// La metáfora de toda la serie: los maniquíes grises son tu dinero yendo por libre; lo que controlas se enciende.
// Texto de la publicación: gancho + resumen que NO repite el guion + qué hacer hoy (petición del propietario).
// Día 1: no lleva datos externos (es un método: apuntar los gastos 7 días y etiquetarlos).
const { pildora3d, hud, finSerie } = require('./tres');

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
  })
};

module.exports = { pildoras };
