// La voz oficial de los Reels hablados de FinanziApp y las piezas que comparten.
//
// VOZ APROBADA por el propietario (7 nov 2026): «ahora sí suena bien y engancha»;
// el 8 nov pidió más carisma (sobre todo en inglés) → VOZ es la versión 2 y VOZ_V1 la primera.
// No cambiarla sin que lo pida: es la misma en todos los vídeos para que la
// cuenta tenga una voz reconocible. Gemini TTS no clona voces: la voz es el
// nombre (Charon) + estas indicaciones + el ritmo; con los mismos valores suena igual.
// En español, pasar siempre `node revisar-acento.cjs` antes de renderizar
// (cada toma puede salir con seseo aunque se pida España).
const { C, icono } = require('../comun');

const MODELO = 'gemini-3.1-flash-tts-preview';
const ESTILO = 'You are a witty, smart friend explaining money in a short vertical video. Fast, punchy delivery like a top short-form creator: quick rhythm, short pauses. Deadpan and dry, with playful sarcasm and sharp comedic timing: let the irony live in your intonation, a tiny beat before each punchline, sound amused, never mean, never like an ad.';
// En español, la indicación va en español y pide acento peninsular estándar, siempre en positivo:
// si se menciona otro acento para descartarlo, el filtro de Google rechaza las frases.
const ESTILO_ES = 'Eres un amigo listo que explica dinero en un vídeo corto. Hablas español de España con el acento peninsular estándar de un locutor de radio o pódcast español: con distinción (la z y la c de «ce» y «ci» suenan como en España) y la entonación de España, sin exagerar acentos regionales. Entrega rápida y con gancho, como un buen creador de contenido: frases ágiles y pausas cortas. Tono seco y sarcástico, con buen timing cómico: la ironía se nota en la entonación y hay un mini silencio antes de cada remate; divertido, nunca borde ni con voz de anuncio.';

// Versión 1 (7 nov 2026): la de los dos primeros Reels. Se mantiene para que su audio no cambie.
const VOZ_V1 = {
  en: { modelo: MODELO, nombre: 'Charon', idioma: 'en-US', estilo: ESTILO + ' Natural, conversational American English.', tempo: 1.1, pausaMax: 0.42 },
  es: { modelo: MODELO, nombre: 'Charon', idioma: 'es-ES', estilo: ESTILO_ES, tempo: 1.1, pausaMax: 0.42 }
};

// Versión 2 (8 nov 2026): con CARISMA (la de la primera píldora; resultó demasiado sarcástica). El propietario vio que el Reel en
// inglés rendía peor «por poco carisma»: el «deadpan» seco suena plano en inglés. Ahora:
// presentador con energía, entonación muy viva, sonrisa en la voz y sarcasmo con media sonrisa.
const CARISMA = 'You are the charismatic, quick-witted host of a viral money channel, talking to a friend. High energy and expressive: big pitch variation, a smile in your voice, punchy emphasis on key words, and playful sarcasm delivered with a grin. Never flat or monotone. Short, snappy rhythm with quick comedic beats.';   // «never mean, never like an ad» hacía saltar el filtro de Google
// En español, el acento va lo primero y en inglés: con la indicación «de presentador viral» en
// español, Charon salía con acento latino casi siempre; así sale de España 3 de cada 4 veces
// (las demás las corrige revisar-voz.cjs). Siempre en positivo, sin mencionar otros acentos.
const CARISMA_ES = 'Speak Spanish with a native accent from Spain: standard Peninsular Castilian as spoken in Madrid, with distinción (z and ce/ci pronounced /θ/, as in "cinco" and "diez") and Spain\'s intonation. You are a charismatic, quick-witted host talking to a friend: high energy, big pitch variation, a smile in your voice, punchy emphasis on key words, witty humor with light irony. Never flat or monotone. Short, snappy rhythm.';
const VOZ_V2 = {
  // En inglés, Puck (voz animada) en lugar de Charon: más chispa para el público de EE. UU.
  en: { modelo: MODELO, nombre: 'Puck', idioma: 'en-US', estilo: CARISMA + ' Natural, conversational American English.', tempo: 1.15, pausaMax: 0.38 },
  es: { modelo: MODELO, nombre: 'Charon', idioma: 'es-ES', estilo: CARISMA_ES, tempo: 1.15, pausaMax: 0.38 }   // con carisma habla más despacio: algo más de ritmo
};

// Versión 3 (8 nov 2026), la de por defecto: carisma CERCANO. La v2 le pareció al propietario
// «excesivamente sarcástica»: misma energía, pero humor amable y tono de amigo, sin pullas.
const CERCANO = 'You are a charismatic, warm host talking to a friend about money: high energy, big pitch variation, a smile in your voice, punchy emphasis on key words and light, friendly humor. Genuinely enthusiastic and helpful, never snarky. Never flat or monotone. Short, snappy rhythm.';
const CERCANO_ES = 'Speak Spanish with a native accent from Spain: standard Peninsular Castilian as spoken in Madrid, with distinción (z and ce/ci pronounced /θ/, as in "cinco" and "diez") and Spain\'s intonation. You are a charismatic, warm host talking to a friend about money: high energy, big pitch variation, a smile in your voice, punchy emphasis on key words and light, friendly humor. Genuinely enthusiastic and helpful. Never flat or monotone. Short, snappy rhythm.';
const VOZ = {
  en: { modelo: MODELO, nombre: 'Puck', idioma: 'en-US', estilo: CERCANO + ' Natural, conversational American English.', tempo: 1.15, pausaMax: 0.38 },
  es: { modelo: MODELO, nombre: 'Charon', idioma: 'es-ES', estilo: CERCANO_ES, tempo: 1.15, pausaMax: 0.38 }
};

// Voz «narrador» (9 nov 2026), para los vídeos en 3D: como los perfiles de referencia que le gustan al propietario
// (@resultaaquee, @bigshortmedia): narrador tranquilo y seguro, frases cortas, casi sin pausas, unas 3,5 palabras/s.
const NARRADOR = 'You are the narrator of a short, documentary-style explainer video: calm, confident and clear, close to the listener, speaking at a brisk, steady pace with very short pauses. Natural and conversational, like explaining something fascinating to a friend. Understated, never theatrical.';
const NARRADOR_ES = 'Speak Spanish with a native accent from Spain: standard Peninsular Castilian as spoken in Madrid, with distinción (z and ce/ci pronounced /θ/, as in "cinco" and "diez") and Spain\'s intonation. ' + NARRADOR;
const VOZ_NARRADOR = {
  en: { modelo: MODELO, nombre: 'Puck', idioma: 'en-US', estilo: NARRADOR + ' Natural American English.', tempo: 1.2, pausaMax: 0.26 },
  es: { modelo: MODELO, nombre: 'Charon', idioma: 'es-ES', estilo: NARRADOR_ES, tempo: 1.2, pausaMax: 0.26 }
};

// Ayudas de página para animar muñecos en cualquier escena (incluir en `script` del Reel):
//   posar(g, { pa, pb, pa2, pb2, ba, bb, ba2, bb2, y, x })  ángulos en grados (0 = colgando);
//     brazos: negativo = hacia delante/arriba (derecha), positivo = hacia atrás (izquierda).
//   mano(g, P, 'a'|'b') → posición de la mano en coordenadas del SVG.
//   POSES: de pie, pensando (mano en la barbilla), cartel (brazo arriba), encogerse.
const SCRIPT_MUNECO = `
const POSES = {
  pie: { pa: -6, pb: 8, pa2: 0, pb2: 0, ba: 12, ba2: -10, bb: 10, bb2: -12, y: 0 },
  pensando: { pa: -6, pb: 8, pa2: 0, pb2: 0, ba: -60, ba2: -146, bb: 10, bb2: -12, y: 0 },
  cartel: { pa: -6, pb: 8, pa2: 0, pb2: 0, ba: -172, ba2: 6, bb: 10, bb2: -12, y: 0 },
  encoge: { pa: -6, pb: 8, pa2: 0, pb2: 0, ba: -70, ba2: -70, bb: 70, bb2: 70, y: 0 }
};
function mezclaPose(A, B, p) { const r = {}; for (const k in A) r[k] = A[k] + ((B[k] == null ? A[k] : B[k]) - A[k]) * p; return r; }
function posar(g, P) {
  const r = (sel, tr) => { const n = g.querySelector(sel); if (n) n.setAttribute('transform', tr); };
  r('.pa', 'rotate(' + P.pa + ')'); r('.pb', 'rotate(' + P.pb + ')');
  r('.pa2', 'translate(0,72) rotate(' + P.pa2 + ')'); r('.pb2', 'translate(0,72) rotate(' + P.pb2 + ')');
  r('.ba', 'translate(6,-96) rotate(' + P.ba + ')'); r('.ba2', 'translate(0,50) rotate(' + P.ba2 + ')');
  r('.bb', 'translate(6,-96) rotate(' + P.bb + ')'); r('.bb2', 'translate(0,50) rotate(' + P.bb2 + ')');
  r('.bob', 'translate(' + (P.x || 0) + ',' + (P.y || 0) + ')');
}
function mano(g, P, lado) {
  const rad = (d) => d * Math.PI / 180, th = lado === 'b' ? P.bb : P.ba, ph = lado === 'b' ? P.bb2 : P.ba2;
  const x = 6 - 50 * Math.sin(rad(th)) - 44 * Math.sin(rad(th + ph)), y = -96 + 50 * Math.cos(rad(th)) + 44 * Math.cos(rad(th + ph));
  const X = +g.dataset.x, Y = +g.dataset.y, K = +g.dataset.k;
  return [X + K * (x + (P.x || 0)), Y + K * (y + (P.y || 0))];
}
`;

// Bocadillo del muñeco del cierre.
const CIERRE = {
  en: 'More tricks like this? <span class="c">Follow.</span>',
  es: '¿Más trucos así? <span class="c">Síguenos.</span>'
};

const ATRAS = '#2a9d8f';
// Muñeco sin cara de trazo grueso (cadera en el origen). Piezas animables: .pa/.pb (muslos),
// .pa2/.pb2 (espinillas), .ba/.bb (brazos), .ba2/.bb2 (antebrazos), .bob (cuerpo entero).
// `extra` se dibuja delante del tronco (por ejemplo, un bolsillo).
const muneco = (x, y, escala = 1, extra = '', clase = '') => {
  const L = (x2, y2, c) => `<line x1="0" y1="0" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="20" stroke-linecap="round"/>`;
  const pierna = (k, c) => `<g class="p${k}">${L(0, 72, c)}<g class="p${k}2" transform="translate(0,72)">${L(0, 70, c)}<line x1="0" y1="70" x2="18" y2="70" stroke="${c}" stroke-width="20" stroke-linecap="round"/></g></g>`;
  const brazo = (k, c) => `<g class="b${k}" transform="translate(6,-96)">${L(0, 50, c)}<g class="b${k}2" transform="translate(0,50)">${L(0, 44, c)}</g></g>`;
  return `<g class="corredor ${clase}" data-x="${x}" data-y="${y}" data-k="${escala}" transform="translate(${x},${y}) scale(${escala})"><g class="bob">
    ${brazo('b', ATRAS)}${pierna('b', ATRAS)}
    <line x1="0" y1="0" x2="10" y2="-112" stroke="${C.acento}" stroke-width="22" stroke-linecap="round"/>
    <circle cx="17" cy="-150" r="31" fill="${C.acento}"/>
    ${extra}
    ${pierna('a', C.acento)}${brazo('a', C.acento)}
    <g class="gotas" opacity="0"><path d="M58 -170 q8 12 0 18 q-8 -6 0 -18z" fill="#93c5fd"/><path d="M66 -140 q7 10 0 15 q-7 -5 0 -15z" fill="#93c5fd"/></g>
  </g></g>`;
};

// Estilos de las escenas comunes (sello, pregunta del bucle, frase grande, dos tarjetas).
const CSS = `
  .sello { display: inline-block; border: 6px solid ${C.acento}; color: ${C.acento}; border-radius: 22px; padding: 18px 34px; font-size: 64px; font-weight: 850; letter-spacing: -.01em; text-transform: uppercase; line-height: 1.05; }
  .pregunta { width: 380px; height: 380px; border-radius: 50%; background: rgba(94,234,212,.1); border: 6px solid ${C.acento}; display: flex; align-items: center; justify-content: center; margin: 70px auto 0; position: relative; }
  .pregunta .q { font-size: 250px; font-weight: 850; color: ${C.acento}; line-height: 1; }
  .pregunta .revela { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; opacity: 0; }
  .frase-grande { font-size: 70px; font-weight: 800; text-align: center; letter-spacing: -.02em; margin-top: 40px; }
  .gancho h1 { font-size: 76px; }
`;

// Escena de bucle: frase grande y una interrogación que bota; si hay `revela`, la
// interrogación se convierte en ese contenido en la primera marca § de la frase.
const bucle = (texto, revela) => ({
  html: (t) => `<div class="frase-grande a">${texto(t)}</div>
    <div class="pregunta"><span class="q">?</span>${revela ? `<div class="revela">${revela(t)}</div>` : ''}</div>`,
  anim: function (s, e, el) {
    const r = el.querySelector('.revela'), m = e.seg[0].marcas[0];
    const cambio = r && m != null ? sale(tramo(s, m, m + 0.4)) : 0;
    el.querySelector('.q').style.transform = 'translateY(' + (-Math.abs(Math.sin(s * 3.2)) * 26) + 'px) rotate(' + (Math.sin(s * 2.1) * 6) + 'deg) scale(' + (1 - cambio) + ')';
    if (r) { r.style.opacity = cambio; r.style.transform = 'scale(' + (0.6 + 0.4 * rebote(tramo(s, m, m + 0.5))) + ')'; }
  }
});

// Escena de cierre: un muñeco sin cara hace algo y, con un bocadillo, invita a seguir la
// cuenta mientras suena la última frase. Cambia en cada vídeo (`cierreCon(variante)`):
//   'moneda' → caza una moneda al vuelo y se la guarda en el bolsillo;
//   'tarro'  → le caen monedas en un tarro que se llena y lo celebra con los brazos arriba;
//   'salto'  → se agacha, pega un salto y suelta confeti.
// Todas acaban con el saludo y el bocadillo. La animación lee la variante del HTML.
const Y0 = 682, ESC = 1.45;   // cadera del muñeco y escala (pies sobre el suelo común, a 900 px de la escena)
const SUELO = Y0 + 142 * ESC + 12;
const POS = { moneda: 440, tarro: 330, salto: 470 };
const moneda = (lang, clase, extra = '') => `<g class="${clase}" ${extra} transform="translate(0,-300)"><circle r="34" fill="#e9c46a" stroke="#b8902e" stroke-width="5"/><circle r="22" fill="none" stroke="#b8902e" stroke-width="3"/>
  <text y="12" text-anchor="middle" font-size="32" font-weight="900" fill="#8a6a1f" font-family="Inter,sans-serif">${lang === 'en' ? '$' : '€'}</text></g>`;
const cierreCon = (variante = 'moneda') => ({
  html: (t, lang) => { const X0 = POS[variante]; return `<div class="cierre" data-variante="${variante}" data-x="${X0}" style="position:relative;height:900px">
    <svg viewBox="0 0 1080 900" width="1080" height="900" style="position:absolute;left:-84px;top:0;overflow:visible;font-family:Inter,sans-serif">
      <ellipse class="sombra" cx="${X0 + 14}" cy="${SUELO + 2}" rx="120" ry="16" fill="rgba(0,0,0,.35)"/>
      <line x1="140" y1="${SUELO}" x2="940" y2="${SUELO}" stroke="#24324d" stroke-width="4" stroke-linecap="round"/>
      ${variante === 'tarro' ? `<g class="tarro"><defs><clipPath id="cierre-tarro"><rect x="610" y="${SUELO - 230}" width="210" height="228" rx="38"/></clipPath></defs>
        <rect x="638" y="${SUELO - 262}" width="154" height="34" rx="10" fill="#33415c"/>
        <g clip-path="url(#cierre-tarro)"><rect class="nivel" x="610" y="${SUELO}" width="210" height="230" fill="${C.necesidades}"/></g>
        <rect x="610" y="${SUELO - 230}" width="210" height="228" rx="38" fill="none" stroke="${C.acento}" stroke-width="8"/></g>
        ${[0, 1, 2].map(i => moneda(lang, 'caida caida-' + i)).join('')}` : ''}
      ${muneco(X0, Y0, ESC, variante === 'moneda' ? `<rect x="-16" y="-20" width="34" height="30" rx="8" fill="#0b1222" stroke="${ATRAS}" stroke-width="5"/>` : '')}
      ${variante === 'moneda' ? moneda(lang, 'moneda') : ''}
      ${variante === 'salto' ? `<g class="confeti">${Array.from({ length: 22 }, (_, i) => `<rect class="cf" data-i="${i}" x="-8" y="-4" width="16" height="9" rx="2" fill="${[C.acento, C.caprichos, C.ahorro, '#e66767', '#e9c46a'][i % 5]}" opacity="0"/>`).join('')}</g>` : ''}
      <g class="chispas" opacity="0" fill="#e9c46a">${[[-70, -40], [60, -60], [-40, 50], [70, 30]].map(([dx, dy], i) => `<path class="ch" data-d="${dx},${dy}" d="M0 -14 L4 -4 L14 0 L4 4 L0 14 L-4 4 L-14 0 L-4 -4Z"/>`).join('')}</g>
    </svg>
    <div class="bocadillo" style="position:absolute;left:${X0 + 30}px;right:-30px;top:110px;opacity:0;transform-origin:10% 100%">
      <div style="background:#f1f5f9;color:#0f172a;border-radius:34px;padding:30px 34px;font-size:${t.cierre.replace(/<[^>]+>/g, '').length > 38 ? 42 : 50}px;font-weight:850;line-height:1.12;letter-spacing:-.02em">${t.cierre}</div>
      <svg width="70" height="50" viewBox="0 0 70 50" style="display:block;margin-left:40px;margin-top:-2px"><path d="M0 0 H60 L8 48 Z" fill="#f1f5f9"/></svg>
    </div>
  </div>`; },
  anim: function (s, e, el) {
    const raiz = el.querySelector('.cierre'), v = raiz.dataset.variante, X0 = +raiz.dataset.x, Y0 = 682, K = 1.45, SUELO = Y0 + 142 * K + 12;
    const rad = (g) => g * Math.PI / 180, r = (sel, tr) => { const n = el.querySelector(sel); if (n) n.setAttribute('transform', tr); };
    // Postura base: de pie. th/ph = brazo delantero, tb/pb = trasero; y = desplazamiento vertical; agacha = 0..1.
    let th = 12, ph = -10, tb = 10, pb = -12, y = 0, agacha = 0;
    if (v === 'moneda') {
      if (s < 0.95) { const p = sale(tramo(s, 0.2, 0.75)); th = lerp(12, -165, p); ph = lerp(-10, 0, p); }
      else { const p = sale(tramo(s, 0.95, 1.5)); th = lerp(-165, 25, p); ph = lerp(0, -40, p); }
    } else if (v === 'tarro') {
      const p = sale(tramo(s, 1.05, 1.3)) * (1 - sale(tramo(s, 1.5, 1.75)));   // brazos arriba al caer la última moneda
      th = lerp(12, -160, p); ph = lerp(-10, 0, p); tb = lerp(10, 160, p); pb = lerp(-12, 0, p);
      y = -Math.max(0, Math.sin(tramo(s, 1.05, 1.55) * Math.PI)) * 30;
    } else if (v === 'salto') {
      agacha = Math.sin(tramo(s, 0.1, 0.45) * Math.PI / 2) * (1 - tramo(s, 0.4, 0.5)) + Math.sin(tramo(s, 1.0, 1.3) * Math.PI) * 0.7;
      const h = Math.sin(tramo(s, 0.45, 1.0) * Math.PI) * 150;
      y = -h + agacha * 26;
      const p = sale(tramo(s, 0.4, 0.55)) * (1 - sale(tramo(s, 1.2, 1.6)));
      th = lerp(12, -155, p); ph = lerp(-10, 0, p); tb = lerp(10, 155, p); pb = lerp(-12, 0, p);
    }
    // Saludo final, común a todas.
    const sal = sale(tramo(s, 1.6, 2.0));
    if (sal > 0) { th = lerp(th, -100, sal); ph = lerp(ph, -40 + 20 * Math.sin(s * 8), sal); tb = lerp(tb, 10, sal); pb = lerp(pb, -12, sal); }
    r('.pa', 'rotate(' + (-6 - 34 * agacha) + ')'); r('.pb', 'rotate(' + (8 - 26 * agacha) + ')');
    r('.pa2', 'translate(0,72) rotate(' + (60 * agacha) + ')'); r('.pb2', 'translate(0,72) rotate(' + (52 * agacha) + ')');
    r('.bb', 'translate(6,-96) rotate(' + tb + ')'); r('.bb2', 'translate(0,50) rotate(' + pb + ')');
    r('.ba', 'translate(6,-96) rotate(' + th + ')'); r('.ba2', 'translate(0,50) rotate(' + ph + ')');
    const habla = s > 1.6 ? Math.abs(Math.sin(s * 9)) * 6 : 0;
    r('.bob', 'translate(0,' + (y - habla) + ')');
    const sombra = el.querySelector('.sombra'); sombra.setAttribute('rx', 120 * (1 + y / 400)); sombra.setAttribute('opacity', 1 + y / 300);
    let chispa = null;   // [inicio, x, y] de los destellos
    if (v === 'moneda') {
      const mx = 6 - 50 * Math.sin(rad(th)) - 44 * Math.sin(rad(th + ph)), my = -96 + 50 * Math.cos(rad(th)) + 44 * Math.cos(rad(th + ph));
      const hx = X0 + K * mx, hy = Y0 + K * my + y - habla, mon = el.querySelector('.moneda');
      if (s < 0.95) { const p = tramo(s, 0.15, 0.95); mon.setAttribute('transform', 'translate(' + hx + ',' + lerp(-260, hy, p * p) + ') rotate(' + (s * 400) + ')'); mon.setAttribute('opacity', 1); }
      else { mon.setAttribute('transform', 'translate(' + hx + ',' + hy + ') scale(' + (1 - 0.6 * tramo(s, 1.35, 1.55)) + ')'); mon.setAttribute('opacity', 1 - tramo(s, 1.45, 1.6)); }
      chispa = [1.5, X0 + K, Y0 - 5 * K];
    } else if (v === 'tarro') {
      let llenado = 0.12;
      [[0.15, 0.55], [0.45, 0.85], [0.75, 1.15]].forEach(([a, b], i) => {
        const p = tramo(s, a, b), c = el.querySelector('.caida-' + i), fondo = SUELO - 30 - 230 * llenado;
        c.setAttribute('transform', 'translate(' + (680 + i * 36) + ',' + lerp(-260, fondo, p * p) + ') rotate(' + (s * 300 + i * 90) + ')');
        c.setAttribute('opacity', p > 0 && p < 1 ? 1 : 0);
        if (p >= 1) llenado += 0.26;
      });
      el.querySelector('.nivel').setAttribute('y', SUELO - 2 - 228 * Math.min(0.9, llenado));
      const golpe = Math.max(...[0.55, 0.85, 1.15].map(b => Math.max(0, 1 - Math.abs(s - b - 0.05) / 0.12)));
      el.querySelector('.tarro').setAttribute('transform', 'translate(715,' + SUELO + ') scale(' + (1 + 0.05 * golpe) + ',' + (1 - 0.05 * golpe) + ') translate(-715,' + (-SUELO) + ')');
      chispa = [1.15, 715, SUELO - 250];
    } else if (v === 'salto') {
      const t0 = 0.7, cx = X0 + 17 * K, cy = Y0 - 150 * K - 150;
      el.querySelectorAll('.cf').forEach((c) => {
        const i = +c.dataset.i, a = (i * 137.5) % 360, vx = Math.cos(rad(a)) * (180 + (i * 53) % 160), vy = -260 - (i * 71) % 300, u = s - t0;
        if (u < 0) { c.setAttribute('opacity', 0); return; }
        c.setAttribute('transform', 'translate(' + (cx + vx * u) + ',' + (cy + vy * u + 450 * u * u) + ') rotate(' + (u * (200 + i * 40)) + ')');
        c.setAttribute('opacity', 1 - tramo(u, 1.6, 2.4));
      });
    }
    // Destellos.
    if (chispa) {
      const c = tramo(s, chispa[0], chispa[0] + 0.7);
      el.querySelector('.chispas').setAttribute('opacity', c > 0 && c < 1 ? Math.sin(c * Math.PI) : 0);
      el.querySelectorAll('.ch').forEach((ch) => { const [dx, dy] = ch.dataset.d.split(',').map(Number); ch.setAttribute('transform', 'translate(' + (chispa[1] + dx * (0.4 + c)) + ',' + (chispa[2] + dy * (0.4 + c)) + ') scale(' + (1.2 - c * 0.6) + ')'); });
    }
    // Bocadillo.
    const b = rebote(tramo(s, 1.7, 2.15)), bo = el.querySelector('.bocadillo');
    bo.style.opacity = Math.min(1, b * 1.5); bo.style.transform = 'scale(' + (0.6 + 0.4 * b) + ')';
  }
});
const cierre = cierreCon('moneda');

module.exports = { C, icono, VOZ, VOZ_V1, VOZ_V2, VOZ_NARRADOR, CIERRE, CSS, bucle, cierre, cierreCon, muneco, SCRIPT_MUNECO };
