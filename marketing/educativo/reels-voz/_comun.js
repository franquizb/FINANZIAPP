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

const CIERRE = {
  en: ['Money, <span class="c">honestly.</span>', 'Follow for more.'],
  es: ['Dinero, <span class="c">sin rodeos.</span>', 'Síguenos para más.']
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

// Escena de cierre: logo y frase de la serie.
const cierre = {
  html: (t) => `<div style="padding-top:160px;text-align:center"><div class="a" style="display:flex;justify-content:center;margin-bottom:40px"><span style="width:150px;height:150px;border-radius:40px;background:${C.necesidades};display:inline-flex;align-items:center;justify-content:center"><svg width="86" height="86" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg></span></div>
    <h1 class="a" style="font-size:90px">${t.cierre[0]}</h1><p class="lead a" style="margin:28px auto 0;text-align:center">${t.cierre[1]}</p></div>`
};

module.exports = { C, icono, VOZ, CIERRE, CSS, bucle, cierre };
