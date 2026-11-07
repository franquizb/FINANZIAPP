// La voz oficial de los Reels hablados de FinanziApp y las piezas que comparten.
//
// VOZ APROBADA por el propietario (7 nov 2026): «ahora sí suena bien y engancha».
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

const VOZ = {
  en: { modelo: MODELO, nombre: 'Charon', idioma: 'en-US', estilo: ESTILO + ' Natural, conversational American English.', tempo: 1.1, pausaMax: 0.42 },
  es: { modelo: MODELO, nombre: 'Charon', idioma: 'es-ES', estilo: ESTILO_ES, tempo: 1.1, pausaMax: 0.42 }
};

// Bocadillo del muñeco del cierre.
const CIERRE = {
  en: 'More tricks like this? <span class="c">Follow.</span>',
  es: '¿Más trucos así? <span class="c">Síguenos.</span>'
};

const ATRAS = '#2a9d8f';
// Muñeco sin cara de trazo grueso (cadera en el origen). Piezas animables: .pa/.pb (muslos),
// .pa2/.pb2 (espinillas), .ba/.bb (brazos), .ba2/.bb2 (antebrazos), .bob (cuerpo entero).
// `extra` se dibuja delante del tronco (por ejemplo, un bolsillo).
const muneco = (x, y, escala = 1, extra = '') => {
  const L = (x2, y2, c) => `<line x1="0" y1="0" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="20" stroke-linecap="round"/>`;
  const pierna = (k, c) => `<g class="p${k}">${L(0, 72, c)}<g class="p${k}2" transform="translate(0,72)">${L(0, 70, c)}<line x1="0" y1="70" x2="18" y2="70" stroke="${c}" stroke-width="20" stroke-linecap="round"/></g></g>`;
  const brazo = (k, c) => `<g class="b${k}" transform="translate(6,-96)">${L(0, 50, c)}<g class="b${k}2" transform="translate(0,50)">${L(0, 44, c)}</g></g>`;
  return `<g class="corredor" transform="translate(${x},${y}) scale(${escala})"><g class="bob">
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

// Escena de cierre: el muñeco caza una moneda al vuelo, se la guarda en el bolsillo
// y, con un bocadillo, invita a seguir la cuenta mientras suena la última frase.
const X0 = 440, Y0 = 600, ESC = 1.45;   // cadera del muñeco y escala
const cierre = {
  html: (t, lang) => `<div style="position:relative;height:900px">
    <svg viewBox="0 0 1080 900" width="1080" height="900" style="position:absolute;left:-84px;top:0;overflow:visible;font-family:Inter,sans-serif">
      <ellipse cx="${X0 + 14}" cy="${Y0 + 142 * ESC + 14}" rx="120" ry="16" fill="rgba(0,0,0,.35)"/>
      <line x1="140" y1="${Y0 + 142 * ESC + 12}" x2="940" y2="${Y0 + 142 * ESC + 12}" stroke="#24324d" stroke-width="4" stroke-linecap="round"/>
      ${muneco(X0, Y0, ESC, `<rect x="-16" y="-20" width="34" height="30" rx="8" fill="#0b1222" stroke="${ATRAS}" stroke-width="5"/>`)}
      <g class="chispas" opacity="0" fill="#e9c46a">${[[-70, -40], [60, -60], [-40, 50], [70, 30]].map(([dx, dy], i) => `<path class="ch ch-${i}" data-d="${dx},${dy}" d="M0 -14 L4 -4 L14 0 L4 4 L0 14 L-4 4 L-14 0 L-4 -4Z"/>`).join('')}</g>
      <g class="moneda" transform="translate(0,-200)"><circle r="34" fill="#e9c46a" stroke="#b8902e" stroke-width="5"/><circle r="22" fill="none" stroke="#b8902e" stroke-width="3"/>
        <text y="12" text-anchor="middle" font-size="32" font-weight="900" fill="#8a6a1f">${lang === 'en' ? '$' : '€'}</text></g>
    </svg>
    <div class="bocadillo" style="position:absolute;left:470px;right:-30px;top:40px;opacity:0;transform-origin:10% 100%">
      <div style="background:#f1f5f9;color:#0f172a;border-radius:34px;padding:30px 34px;font-size:50px;font-weight:850;line-height:1.12;letter-spacing:-.02em">${t.cierre}</div>
      <svg width="70" height="50" viewBox="0 0 70 50" style="display:block;margin-left:40px;margin-top:-2px"><path d="M0 0 H60 L8 48 Z" fill="#f1f5f9"/></svg>
    </div>
  </div>`,
  anim: function (s, e, el) {
    const X0 = 440, Y0 = 600, K = 1.45, rad = (g) => g * Math.PI / 180;   // mismas coordenadas que el SVG
    const r = (sel, tr) => el.querySelector(sel).setAttribute('transform', tr);
    // Postura de pie y brazo delantero según el momento.
    let th, ph;
    if (s < 0.95) { const p = sale(tramo(s, 0.2, 0.75)); th = lerp(12, -165, p); ph = lerp(-10, 0, p); }
    else if (s < 1.6) { const p = sale(tramo(s, 0.95, 1.5)); th = lerp(-165, 25, p); ph = lerp(0, -40, p); }
    else { const p = sale(tramo(s, 1.6, 2.0)); th = lerp(25, -100, p); ph = lerp(-40, -40 + 20 * Math.sin(s * 8), p); }   // saludo: brazo abierto y antebrazo que se mueve
    r('.pa', 'rotate(-6)'); r('.pb', 'rotate(8)'); r('.pa2', 'translate(0,72) rotate(0)'); r('.pb2', 'translate(0,72) rotate(0)');
    r('.bb', 'translate(6,-96) rotate(10)'); r('.bb2', 'translate(0,50) rotate(-12)');
    r('.ba', 'translate(6,-96) rotate(' + th + ')'); r('.ba2', 'translate(0,50) rotate(' + ph + ')');
    const habla = s > 1.6 ? Math.abs(Math.sin(s * 9)) * 6 : 0;
    r('.bob', 'translate(0,' + (-habla) + ')');
    // Mano (para que la moneda la siga).
    const mx = 6 - 50 * Math.sin(rad(th)) - 44 * Math.sin(rad(th + ph)), my = -96 - habla + 50 * Math.cos(rad(th)) + 44 * Math.cos(rad(th + ph));
    const hx = X0 + K * mx, hy = Y0 + K * my;
    const mon = el.querySelector('.moneda');
    if (s < 0.95) { const p = tramo(s, 0.15, 0.95); mon.setAttribute('transform', 'translate(' + hx + ',' + lerp(-260, hy, p * p) + ') rotate(' + (s * 400) + ')'); mon.setAttribute('opacity', 1); }
    else { mon.setAttribute('transform', 'translate(' + hx + ',' + hy + ') scale(' + (1 - 0.6 * tramo(s, 1.35, 1.55)) + ')'); mon.setAttribute('opacity', 1 - tramo(s, 1.45, 1.6)); }
    // Destellos al entrar en el bolsillo.
    const c = tramo(s, 1.5, 2.2), bx = X0 + K * 1, by = Y0 + K * -5;
    el.querySelector('.chispas').setAttribute('opacity', c > 0 && c < 1 ? Math.sin(c * Math.PI) : 0);
    el.querySelectorAll('.ch').forEach((ch) => { const [dx, dy] = ch.dataset.d.split(',').map(Number); ch.setAttribute('transform', 'translate(' + (bx + dx * (0.4 + c)) + ',' + (by + dy * (0.4 + c)) + ') scale(' + (1.2 - c * 0.6) + ')'); });
    // Bocadillo.
    const b = rebote(tramo(s, 1.7, 2.15)), bo = el.querySelector('.bocadillo');
    bo.style.opacity = Math.min(1, b * 1.5); bo.style.transform = 'scale(' + (0.6 + 0.4 * b) + ')';
  }
};

module.exports = { C, icono, VOZ, CIERRE, CSS, bucle, cierre, muneco };
