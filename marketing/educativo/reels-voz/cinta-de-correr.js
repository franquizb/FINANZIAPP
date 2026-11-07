// Reel hablado: la cinta de correr del dinero (inflación del estilo de vida).
// Estructura: gancho → intro → cuerpo 1 (algo que no sabían) → bucle → cuerpo 2 → bucle → final.
const { C, icono } = require('../comun');
const { cuadra } = require('../reels/_comun');

const N = {
  en: { sueldo: [3000, 3300, 3600], items: [['movil', 50], ['casa', 450], ['pantalla', 100]], subida: 300 },
  es: { sueldo: [2000, 2200, 2400], items: [['movil', 40], ['casa', 300], ['pantalla', 60]], subida: 200 }
};
for (const l of ['en', 'es']) {
  const n = N[l];
  cuadra(`gastos ${l}`, n.sueldo[0] + n.items.reduce((a, [, v]) => a + v, 0), n.sueldo[2]);   // gastas todo lo que sube
  cuadra(`subidas ${l}`, n.sueldo[1] - n.sueldo[0], n.subida);
}
cuadra('anual en', N.en.subida / 2 * 12, 1800);
cuadra('anual es', N.es.subida / 2 * 12, 1200);

const ESTILO = 'You are a witty, smart friend explaining money in a short vertical video. Fast, punchy delivery like a top short-form creator: quick rhythm, short pauses. Deadpan and dry, with playful sarcasm and sharp comedic timing: let the irony live in your intonation, a tiny beat before each punchline, sound amused, never mean, never like an ad.';
const MODELO = 'gemini-3.1-flash-tts-preview';
// En español, la indicación va en español y pide acento peninsular estándar, siempre en positivo:
// si se menciona otro acento para descartarlo, el filtro de Google rechaza las frases.
const ESTILO_ES = 'Eres un amigo listo que explica dinero en un vídeo corto. Hablas español de España con el acento peninsular estándar de un locutor de radio o pódcast español: con distinción (la z y la c de «ce» y «ci» suenan como en España) y la entonación de España, sin exagerar acentos regionales. Entrega rápida y con gancho, como un buen creador de contenido: frases ágiles y pausas cortas. Tono seco y sarcástico, con buen timing cómico: la ironía se nota en la entonación y hay un mini silencio antes de cada remate; divertido, nunca borde ni con voz de anuncio.';

const T = {
  en: {
    kicker: 'MONEY, HONESTLY',
    titulo: 'Got a raise. <span class="c">Still broke.</span>',
    l: { antes: 'Before the raise', despues: 'After the raise', sueldo: 'SALARY', gasto: 'SPENDING', ahorro: 'SAVINGS', sobra: 'Left at month end', mes: '/mo',
      felicidad: 'Happiness', tiempo: 'Time', termino: 'Hedonic treadmill', fuente: 'Brickman & Campbell, 1971', disfrutar: 'to enjoy', ahorrar: 'to savings',
      subida: 'raise', anio: 'a year', loco: 'Not the crazy part…', notar: 'Will you miss it?', mitad: 'Half of every raise' },
    guion: [
      [0, '[sarcasm] Congratulations, you got a *raise*.'],
      [0, 'And you’re still *exactly as broke*. [short pause] Impressive.'],
      [1, 'Meet the *money treadmill*. You’ve been on it for years.'],
      [1, 'You earn more,§ it speeds up.§ New phone, because the old one was *so* slow.§ Bigger place.§ Three subscriptions you’ll *definitely* use.'],
      [2, 'Psychologists literally call this the §*hedonic treadmill*. You get used to every upgrade. [short pause] Fast.'],
      [3, 'But that’s not the crazy part. Getting off takes §*ten seconds*. [short pause] And almost nobody does it.'],
      [4, 'Next raise: §*half of it* goes to savings. The day it lands. Before you decide you *deserve a treat*.'],
      [4, '$300 raise? *$150* saved. That’s §*$1,800* a year.'],
      [5, 'And you won’t even miss it. [short pause] Want to know why?'],
      [6, 'Because now the treadmill works *for you*. You get used to the new normal. Same as the phone.'],
      [6, 'Enjoy the other half. You earned it. [short pause] *Literally*.'],
      [7, '[amusement] Follow. Your *future self* is already annoyed you haven’t.']
    ],
    cierre: ['Money, <span class="c">honestly.</span>', 'Follow for more.']
  },
  es: {
    kicker: 'DINERO, SIN RODEOS',
    titulo: 'Te subieron el sueldo. <span class="c">Y sigues sin un duro.</span>',
    l: { antes: 'Antes de la subida', despues: 'Después de la subida', sueldo: 'SUELDO', gasto: 'GASTOS', ahorro: 'AHORRO', sobra: 'Te sobra a fin de mes', mes: '/mes',
      felicidad: 'Felicidad', tiempo: 'Tiempo', termino: 'Cinta de correr hedónica', fuente: 'Brickman y Campbell, 1971', disfrutar: 'para disfrutar', ahorrar: 'al ahorro',
      subida: 'de subida', anio: 'al año', loco: 'Eso no es lo más loco…', notar: '¿Lo vas a notar?', mitad: 'La mitad de cada subida' },
    guion: [
      [0, '[sarcasm] Enhorabuena, te han subido el *sueldo*.'],
      [0, 'Y sigues llegando a fin de mes *igual de justo*. [short pause] Todo un logro.'],
      [1, '[amusement] Bienvenido a la *cinta de correr del dinero*. Llevas años subido a ella.'],
      [1, 'Ganas más,§ y la cinta acelera.§ Móvil nuevo, porque el otro tenía *dos años*, pobre.§ Piso más grande.§ Tres suscripciones que, seguro, *vas a usar*.'],
      [2, 'Los psicólogos lo llaman, literalmente, §*la cinta de correr hedónica*. Te acostumbras a cualquier mejora. [short pause] Y rápido.'],
      [3, 'Pero eso no es lo más loco. Bajarse cuesta §*diez segundos*. [short pause] Y casi nadie lo hace.'],
      [4, 'Próxima subida: §*la mitad* al ahorro. El mismo día que llega. Antes de que decidas que *te lo mereces*.'],
      [4, '¿Te suben 200 €? *100 €* al ahorro. Son §*1.200 € al año*.'],
      [5, 'Y ni lo vas a notar. [short pause] ¿Quieres saber por qué?'],
      [6, 'Porque ahora la cinta trabaja *para ti*. Te acostumbras a lo nuevo. Como al móvil.'],
      [6, 'La otra mitad, disfrútala. Te la has ganado. [short pause] *Literalmente*.'],
      [7, 'Tu *yo del futuro* ya se está impacientando. [short pause] Síguenos.']
    ],
    cierre: ['Dinero, <span class="c">sin rodeos.</span>', 'Síguenos para más.']
  }
};

const din = (n, l) => (l === 'en' ? '$' + n.toLocaleString('en-US') : n.toLocaleString('de-DE') + ' €');
const ROJO = '#e66767', ATRAS = '#2a9d8f';

// Corredor sin cara, de trazo grueso (cadera en el origen).
const corredor = (x, y) => {
  const L = (x2, y2, c) => `<line x1="0" y1="0" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="20" stroke-linecap="round"/>`;
  const pierna = (k, c) => `<g class="p${k}">${L(0, 72, c)}<g class="p${k}2" transform="translate(0,72)">${L(0, 70, c)}<line x1="0" y1="70" x2="18" y2="70" stroke="${c}" stroke-width="20" stroke-linecap="round"/></g></g>`;
  const brazo = (k, c) => `<g class="b${k}" transform="translate(6,-96)">${L(0, 50, c)}<g class="b${k}2" transform="translate(0,50)">${L(0, 44, c)}</g></g>`;
  return `<g class="corredor" transform="translate(${x},${y})"><g class="bob">
    ${brazo('b', ATRAS)}${pierna('b', ATRAS)}
    <line x1="0" y1="0" x2="10" y2="-112" stroke="${C.acento}" stroke-width="22" stroke-linecap="round"/>
    <circle cx="17" cy="-150" r="31" fill="${C.acento}"/>
    ${pierna('a', C.acento)}${brazo('a', C.acento)}
    <g class="gotas" opacity="0"><path d="M58 -170 q8 12 0 18 q-8 -6 0 -18z" fill="#93c5fd"/><path d="M66 -140 q7 10 0 15 q-7 -5 0 -15z" fill="#93c5fd"/></g>
  </g></g>`;
};

// Escena de la cinta (modo «atrapado» o «final»).
const cinta = (t, lang, modo) => {
  const n = N[lang], l = t.l;
  const edificios = [];
  for (let r = 0; r < 4; r++) [[0, 150, 70], [80, 230, 90], [190, 120, 60], [270, 280, 80], [370, 170, 100], [480, 210, 50]].forEach(([x, h, w]) =>
    edificios.push(`<rect x="${x + r * 540 - 200}" y="${760 - h}" width="${w}" height="${h}" rx="6" fill="#16213a"/>`));
  const items = modo === 'atrapado'
    ? n.items.map(([ic, v], i) => `<g class="item item-${i}" opacity="0" transform="translate(${444 + i * 186},40)"><rect width="168" height="170" rx="24" fill="${C.superficie}" stroke="${C.borde}"/>
        <g transform="translate(54,26)">${icono(ic, C.caprichos, 60)}</g><text x="84" y="138" text-anchor="middle" font-size="30" font-weight="800" fill="${C.caprichos}">+${din(v, lang)}</text></g>`).join('')
    : `<g class="mitad" opacity="0" transform="translate(444,40)"><rect width="540" height="170" rx="24" fill="${C.superficie}" stroke="${C.borde}"/>
        <text x="34" y="62" font-size="26" font-weight="700" fill="${C.suave}">${l.mitad.toUpperCase()}</text>
        <text x="34" y="132" font-size="46" font-weight="800" fill="${C.acento}">+${din(n.subida / 2, lang)}${l.mes}</text></g>`;
  return `<svg viewBox="0 0 1080 900" width="1080" height="900" style="position:absolute;left:0;top:0;font-family:Inter,sans-serif">
    <defs><clipPath id="banda-${modo}"><rect x="170" y="700" width="590" height="36" rx="18"/></clipPath></defs>
    <g class="ciudad">${edificios.join('')}</g>
    <line x1="0" y1="760" x2="1080" y2="760" stroke="#24324d" stroke-width="4"/>
    <g transform="translate(84,40)"><rect width="330" height="170" rx="24" fill="${C.superficie}" stroke="${C.borde}"/>
      <text x="32" y="56" font-size="26" font-weight="700" letter-spacing="3" fill="${C.suave}">${l.ahorro}</text>
      <text class="v-ahorro" x="32" y="136" font-size="74" font-weight="800" fill="${modo === 'final' ? C.acento : ROJO}">${din(0, lang)}</text></g>
    ${items}
    <g class="rafagas" stroke="${C.suave}" stroke-width="6" stroke-linecap="round" opacity="0">
      <line x1="220" y1="470" x2="320" y2="470"/><line x1="190" y1="530" x2="300" y2="530"/><line x1="240" y1="590" x2="330" y2="590"/></g>
    <rect x="150" y="734" width="640" height="22" rx="8" fill="#22304a"/>
    <rect x="170" y="700" width="590" height="36" rx="18" fill="#1b263d" stroke="#33415c" stroke-width="3"/>
    <g clip-path="url(#banda-${modo})"><g class="banda">${Array.from({ length: 16 }, (_, i) => `<rect x="${100 + i * 70}" y="708" width="26" height="20" rx="4" fill="#33415c"/>`).join('')}</g></g>
    <line x1="742" y1="704" x2="808" y2="470" stroke="#33415c" stroke-width="20" stroke-linecap="round"/>
    <line x1="760" y1="455" x2="610" y2="520" stroke="#33415c" stroke-width="12" stroke-linecap="round"/>
    <g transform="translate(690,288)"><rect width="300" height="182" rx="22" fill="${C.superficie}" stroke="#33415c" stroke-width="3"/>
      <text x="26" y="44" font-size="22" font-weight="700" letter-spacing="2" fill="${C.suave}">${l.sueldo}</text>
      <text class="v-sueldo" x="26" y="88" font-size="42" font-weight="800" fill="${C.acento}">${din(n.sueldo[modo === 'final' ? 1 : 0], lang)}</text>
      <text x="26" y="128" font-size="22" font-weight="700" letter-spacing="2" fill="${C.suave}">${l.gasto}</text>
      <text class="v-gasto" x="26" y="168" font-size="42" font-weight="800" fill="${C.caprichos}">${din(modo === 'final' ? n.sueldo[1] - n.subida / 2 : n.sueldo[0], lang)}</text></g>
    ${corredor(430, 548)}
  </svg>`;
};

// Curva de la adaptación hedónica: picos con cada mejora que vuelven a la línea base.
const curva = () => {
  const pts = [];
  for (let x = 0; x <= 860; x += 6) {
    let y = 0;
    for (const p of [180, 450, 700]) if (x >= p) y += 230 * Math.exp(-(x - p) / 55);
    pts.push(`${x + 110},${640 - Math.min(y, 260)}`);
  }
  return pts.join(' ');
};

const SCRIPT = `
function pose(el, f, fuerza) {
  const g = (c) => el.querySelector(c), r = (c, tr) => g(c).setAttribute('transform', tr);
  const sa = Math.sin(f), sb = Math.sin(f + Math.PI), ca = Math.cos(f), cb = Math.cos(f + Math.PI);
  r('.pa', 'rotate(' + (-36 * sa * fuerza) + ')'); r('.pb', 'rotate(' + (-36 * sb * fuerza) + ')');
  r('.pa2', 'translate(0,72) rotate(' + (12 + 68 * Math.max(0, ca) * fuerza) + ')');
  r('.pb2', 'translate(0,72) rotate(' + (12 + 68 * Math.max(0, cb) * fuerza) + ')');
  r('.ba', 'translate(6,-96) rotate(' + (34 * sa * fuerza) + ')'); r('.bb', 'translate(6,-96) rotate(' + (34 * sb * fuerza) + ')');
  r('.ba2', 'translate(0,50) rotate(-85)'); r('.bb2', 'translate(0,50) rotate(-85)');
  r('.bob', 'translate(0,' + (-8 * Math.abs(ca) * fuerza) + ')');
}
// Distancia recorrida en la cinta (integral de la velocidad).
function recorrido(s, vel) { let d = 0; for (let u = 0; u < s; u += 0.02) d += vel(u) * 0.02; return d; }
function correr(el, s, vel) {
  const d = recorrido(s, vel), v = vel(s);
  pose(el, d * 2 * Math.PI * 1.25, Math.min(1.15, 0.75 + v * 0.22));
  el.querySelector('.banda').setAttribute('transform', 'translate(' + (-(d * 300) % 70) + ',0)');
  el.querySelector('.rafagas').setAttribute('opacity', Math.max(0, (v - 1.1) * 0.9));
  el.querySelector('.gotas').setAttribute('opacity', v > 1.5 ? 0.5 + 0.5 * Math.sin(s * 9) : 0);
  return d;
}
`;

module.exports = {
  slug: 'cinta-de-correr',
  voz: {
    en: { modelo: MODELO, nombre: 'Charon', idioma: 'en-US', estilo: ESTILO + ' Natural, conversational American English.', tempo: 1.1, pausaMax: 0.42 },
    es: { modelo: MODELO, nombre: 'Charon', idioma: 'es-ES', estilo: ESTILO_ES, tempo: 1.1, pausaMax: 0.42 }
  },
  T,
  datos: (lang) => ({ ...N[lang] }),
  script: SCRIPT,
  css: `
    .gancho h1 { font-size: 76px; }
    .dos { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; margin-top: 54px; }
    .dos .tarjeta { padding: 34px 30px; }
    .dos .eti { font-size: 28px; color: ${C.suave}; font-weight: 650; }
    .dos .grande { font-size: 64px; font-weight: 800; letter-spacing: -.03em; margin-top: 6px; font-variant-numeric: tabular-nums; }
    .dos .peq { font-size: 26px; color: ${C.suave}; font-weight: 600; margin-top: 22px; }
    .sello { display: inline-block; border: 6px solid ${C.acento}; color: ${C.acento}; border-radius: 22px; padding: 18px 34px; font-size: 64px; font-weight: 850; letter-spacing: -.01em; text-transform: uppercase; line-height: 1.05; }
    .pregunta { width: 380px; height: 380px; border-radius: 50%; background: rgba(94,234,212,.1); border: 6px solid ${C.acento}; display: flex; align-items: center; justify-content: center; margin: 70px auto 0; position: relative; }
    .pregunta .q { font-size: 250px; font-weight: 850; color: ${C.acento}; line-height: 1; }
    .pregunta .reloj { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; opacity: 0; }
    .frase-grande { font-size: 70px; font-weight: 800; text-align: center; letter-spacing: -.02em; margin-top: 40px; }
  `,
  escenas: [
    // 0 · Gancho: subida de sueldo y te sobra lo mismo (nada).
    {
      html: (t, lang) => { const n = N[lang], l = t.l; return `<div class="gancho"><h1 class="a">${t.titulo}</h1>
        <div class="dos">
          <div class="tarjeta a"><div class="eti">${l.antes}</div><div class="grande">${din(n.sueldo[0], lang)}</div><div class="peq">${l.sobra}</div><div class="grande" style="color:${ROJO}">${din(0, lang)}</div></div>
          <div class="tarjeta despues" style="opacity:0;border-color:rgba(94,234,212,.4)"><div class="eti">${l.despues}</div><div class="grande" style="color:${C.acento}"><span class="cuenta">${din(n.sueldo[0], lang)}</span></div><div class="peq">${l.sobra}</div><div class="grande cero" style="color:${ROJO}">${din(0, lang)}</div></div>
        </div></div>`; },
      anim: function (s, e, el) {
        const d = el.querySelector('.despues'), p = sale(tramo(s, e.seg[0].ini + 0.3, e.seg[0].ini + 0.9));
        d.style.opacity = p; d.style.transform = 'translateX(' + ((1 - p) * 60) + 'px)';
        const q = sale(tramo(s, e.seg[0].ini + 0.5, e.seg[0].ini + 1.6));
        el.querySelector('.cuenta').textContent = dinero(lerp(D.sueldo[0], D.sueldo[1], q));
        const z = tramo(s, e.seg[1].ini + e.seg[1].dur * 0.55, e.seg[1].ini + e.seg[1].dur * 0.55 + 0.5);
        el.querySelector('.cero').style.transform = 'translateX(' + (Math.sin(z * Math.PI * 6) * 12 * (1 - z)) + 'px) scale(' + (1 + 0.15 * Math.sin(z * Math.PI)) + ')';
      }
    },
    // 1 · Intro + cuerpo 1: la cinta acelera con cada subida y los gastos suben igual.
    {
      html: (t, lang) => cinta(t, lang, 'atrapado'),
      anim: function (s, e, el) {
        const m = e.seg[1].marcas, sube = (a) => sale(tramo(s, a, a + 0.5));
        const vel = (u) => 1 + 0.4 * sale(tramo(u, m[0], m[0] + 0.5)) + 0.5 * sale(tramo(u, m[1], m[1] + 0.5));
        correr(el, s, vel);
        el.querySelector('.v-sueldo').textContent = dinero(D.sueldo[0] + (D.sueldo[1] - D.sueldo[0]) * sube(m[0]) + (D.sueldo[2] - D.sueldo[1]) * sube(m[1]));
        let gasto = D.sueldo[0];
        D.items.forEach(([, v], i) => {
          const a = i === 0 ? m[1] + 0.35 : m[i + 1], p = rebote(tramo(s, a, a + 0.45));
          const it = el.querySelector('.item-' + i);
          it.setAttribute('opacity', Math.min(1, p * 1.4));
          it.setAttribute('transform', 'translate(' + (444 + i * 186) + ',' + (40 - (1 - p) * 40) + ')');
          gasto += v * sale(tramo(s, a + 0.2, a + 0.8));
        });
        el.querySelector('.v-gasto').textContent = dinero(gasto);
      }
    },
    // 2 · Cuerpo 1 (lo que no sabían): la adaptación hedónica, picos que vuelven a la base.
    {
      html: (t) => `<div style="text-align:center"><div class="sello" style="opacity:0">${t.l.termino}</div>
        <div class="fuente" style="margin-top:18px;font-size:28px;color:${C.suave};font-weight:600;opacity:0">${t.l.fuente}</div></div>
        <svg viewBox="0 0 1080 700" width="1080" height="700" style="position:absolute;left:0;top:200px;font-family:Inter,sans-serif">
          <line x1="110" y1="640" x2="990" y2="640" stroke="#33415c" stroke-width="4"/><line x1="110" y1="300" x2="110" y2="640" stroke="#33415c" stroke-width="4"/>
          <text x="124" y="320" font-size="26" fill="${C.suave}" font-weight="600">${t.l.felicidad}</text>
          <text x="990" y="684" font-size="26" fill="${C.suave}" font-weight="600" text-anchor="end">${t.l.tiempo}</text>
          <polyline class="curva" points="${curva()}" fill="none" stroke="${C.acento}" stroke-width="9" stroke-linejoin="round" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>
          ${[['movil', 290], ['casa', 560], ['pantalla', 810]].map(([ic, x], i) => `<g class="pico pico-${i}" opacity="0" transform="translate(${x - 32},${300})">${icono(ic, C.caprichos, 64)}</g>`).join('')}
        </svg>`,
      anim: function (s, e, el) {
        const seg = e.seg[0], m = seg.marcas[0];
        const p = tramo(s, 0.2, seg.ini + seg.dur * 0.95);
        el.querySelector('.curva').setAttribute('stroke-dashoffset', 1 - p);
        [0.19, 0.5, 0.79].forEach((x, i) => el.querySelector('.pico-' + i).setAttribute('opacity', p > x ? 1 : 0));
        const q = rebote(tramo(s, m, m + 0.45)), sello = el.querySelector('.sello');
        sello.style.opacity = Math.min(1, q * 1.5); sello.style.transform = 'rotate(-4deg) scale(' + (1.8 - 0.8 * q) + ')';
        el.querySelector('.fuente').style.opacity = tramo(s, m + 0.4, m + 0.9);
      }
    },
    // 3 · Bucle 1: «eso no es lo más loco» → bajarse cuesta diez segundos.
    {
      html: (t) => `<div class="frase-grande a">${t.l.loco}</div>
        <div class="pregunta"><span class="q">?</span><div class="reloj">${icono('reloj', C.acento, 150)}<div style="font-size:84px;font-weight:850;color:${C.acento};margin-top:8px">10 s</div></div></div>`,
      anim: function (s, e, el) {
        const m = e.seg[0].marcas[0], q = el.querySelector('.q'), r = el.querySelector('.reloj');
        const cambio = sale(tramo(s, m, m + 0.4));
        q.style.transform = 'translateY(' + (-Math.abs(Math.sin(s * 3.2)) * 26) + 'px) rotate(' + (Math.sin(s * 2.1) * 6) + 'deg) scale(' + (1 - cambio) + ')';
        r.style.opacity = cambio; r.style.transform = 'scale(' + (0.6 + 0.4 * rebote(tramo(s, m, m + 0.5))) + ')';
      }
    },
    // 4 · Cuerpo 2: la mitad de cada subida, al ahorro el mismo día.
    {
      html: (t, lang) => { const n = N[lang], l = t.l; return `<div style="position:relative;height:900px">
        <div class="mitad-a" style="position:absolute;left:0;top:40px;width:50%;height:150px;background:${C.necesidades};border-radius:28px 0 0 28px"></div>
        <div class="mitad-b" style="position:absolute;left:50%;top:40px;width:50%;height:150px;background:${C.necesidades};border-radius:0 28px 28px 0"></div>
        <div class="rotulo" style="position:absolute;left:0;right:0;top:40px;height:150px;display:flex;align-items:center;justify-content:center;font-size:52px;font-weight:850;color:#fff">+${din(n.subida, lang)}${l.mes} ${l.subida}</div>
        <div class="eti-a" style="position:absolute;left:0;top:260px;width:430px;text-align:center;opacity:0"><div style="font-size:56px;font-weight:850;color:${C.caprichos}">${din(n.subida / 2, lang)}</div><div style="font-size:30px;color:${C.texto};font-weight:650">${l.disfrutar}</div></div>
        <div class="eti-b" style="position:absolute;right:0;top:260px;width:430px;text-align:center;opacity:0"><div style="font-size:56px;font-weight:850;color:${C.acento}">${din(n.subida / 2, lang)}</div><div style="font-size:30px;color:${C.texto};font-weight:650">${l.ahorrar}</div></div>
        <svg viewBox="0 0 300 330" width="300" height="330" style="position:absolute;right:65px;top:420px">
          <defs><clipPath id="tarro"><rect x="34" y="70" width="232" height="246" rx="40"/></clipPath></defs>
          <rect x="60" y="30" width="180" height="40" rx="12" fill="#33415c"/>
          <g clip-path="url(#tarro)"><rect class="nivel" x="34" y="316" width="232" height="246" fill="${C.necesidades}"/></g>
          <rect x="34" y="70" width="232" height="246" rx="40" fill="none" stroke="${C.acento}" stroke-width="8"/></svg>
        <div class="anual" style="position:absolute;left:0;top:520px;width:520px;opacity:0"><div class="v-anual" style="font-size:110px;font-weight:850;color:${C.acento};letter-spacing:-.04em;line-height:1">${din(0, lang)}</div><div style="font-size:38px;color:${C.texto};font-weight:650;margin-top:8px">${l.anio}</div></div>
      </div>`; },
      anim: function (s, e, el) {
        const m = e.seg[0].marcas[0], p = sale(tramo(s, m, m + 0.7));
        const a = el.querySelector('.mitad-a'), b = el.querySelector('.mitad-b');
        a.style.transform = 'translate(' + (-p * 20) + 'px,' + (p * 60) + 'px)'; a.style.background = p > 0.5 ? '#c27c0e' : '#0f9f8f';
        a.style.borderRadius = p > 0.5 ? '28px' : '28px 0 0 28px'; b.style.borderRadius = p > 0.5 ? '28px' : '0 28px 28px 0';
        b.style.transform = 'translate(' + (p * 20) + 'px,' + (p * 60) + 'px)';
        el.querySelector('.rotulo').style.opacity = 1 - p;
        el.querySelector('.eti-a').style.opacity = tramo(s, m + 0.5, m + 0.9); el.querySelector('.eti-b').style.opacity = tramo(s, m + 0.5, m + 0.9);
        // La mitad del ahorro cae en el tarro.
        const c = sale(tramo(s, m + 1.0, m + 1.8));
        b.style.transform += ' translateY(' + (c * 330) + 'px) scale(' + (1 - 0.75 * c) + ')'; b.style.opacity = 1 - tramo(s, m + 1.6, m + 1.9);
        const nivel = 0.15 + 0.7 * sale(tramo(s, m + 1.6, e.seg[1].ini + e.seg[1].dur));
        el.querySelector('.nivel').setAttribute('y', 316 - 246 * nivel);
        const m2 = e.seg[1].marcas[0], q = sale(tramo(s, m2 - 0.2, m2 + 1.2));
        el.querySelector('.anual').style.opacity = tramo(s, m2 - 0.3, m2);
        el.querySelector('.v-anual').textContent = dinero(D.subida / 2 * 12 * q);
      }
    },
    // 5 · Bucle 2: ¿lo vas a notar?
    {
      html: (t) => `<div class="frase-grande a">${t.l.notar}</div><div class="pregunta"><span class="q">?</span></div>`,
      anim: function (s, e, el) {
        el.querySelector('.q').style.transform = 'translateY(' + (-Math.abs(Math.sin(s * 3.2)) * 26) + 'px) rotate(' + (Math.sin(s * 2.1) * 6) + 'deg)';
      }
    },
    // 6 · Final: la misma cinta, pero ahora avanzas (la ciudad se mueve y el ahorro sube).
    {
      html: (t, lang) => cinta(t, lang, 'final'),
      anim: function (s, e, el) {
        const d = correr(el, s, () => 1.05);
        el.querySelector('.ciudad').setAttribute('transform', 'translate(' + (-(d * 120) % 540) + ',0)');
        const fin = e.seg[e.seg.length - 1];
        el.querySelector('.v-ahorro').textContent = dinero(D.subida / 2 * 12 * sale(tramo(s, 0.6, fin.ini + fin.dur)));
        const p = rebote(tramo(s, 0.4, 0.9)), mi = el.querySelector('.mitad');
        mi.setAttribute('opacity', Math.min(1, p * 1.4)); mi.setAttribute('transform', 'translate(444,' + (40 - (1 - p) * 40) + ')');
      }
    },
    // 7 · Cierre.
    {
      html: (t) => `<div style="padding-top:160px;text-align:center"><div class="a" style="display:flex;justify-content:center;margin-bottom:40px"><span style="width:150px;height:150px;border-radius:40px;background:${C.necesidades};display:inline-flex;align-items:center;justify-content:center"><svg width="86" height="86" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg></span></div>
        <h1 class="a" style="font-size:90px">${t.cierre[0]}</h1><p class="lead a" style="margin:28px auto 0;text-align:center">${t.cierre[1]}</p></div>`
    }
  ],
  texto: {
    en: `You got a raise… and you're exactly as broke as before. Congratulations. 🏃

That's the money treadmill: every time you earn more, your spending speeds up to match. Nicer phone, bigger place, a few more subscriptions. Psychologists have a name for it: the hedonic treadmill (Brickman & Campbell, 1971). Whatever you upgrade to, you get used to, fast.

The way off takes ten seconds: next time you get a raise, send half of it to savings the day it lands. A $300 raise means $150 saved, or $1,800 a year.

And you won't miss it, because the same treadmill now works for you: you get used to the new normal before you ever spend it. Enjoy the other half. You earned it.

What did your last raise disappear into? 👇

Example figures. Education, not financial advice.

#lifestylecreep #personalfinance #savingmoney #moneytips #financialliteracy`,
    es: `Te subieron el sueldo… y llegas a fin de mes igual de justo. Enhorabuena. 🏃

Es la cinta de correr del dinero: cada vez que ganas más, tus gastos aceleran al mismo ritmo. Un móvil nuevo, un piso más grande, unas cuantas suscripciones más. Los psicólogos lo llaman la cinta de correr hedónica (Brickman y Campbell, 1971): te acostumbras a cualquier mejora, y rápido.

Bajarse cuesta diez segundos: la próxima vez que te suban el sueldo, manda la mitad al ahorro el mismo día que llega. Si te suben 200 € al mes, son 100 € al ahorro, o 1.200 € al año.

Y ni lo vas a notar, porque ahora la cinta trabaja para ti: te acostumbras a lo nuevo antes de llegar a gastarlo. La otra mitad, disfrútala. Te la has ganado.

¿En qué se te fue la última subida? 👇

Cifras de ejemplo. Educación financiera, no asesoramiento.

#finanzaspersonales #ahorro #dinero #educacionfinanciera #consejosdedinero`
  }
};
