// Carrusel fijado «Empieza aquí»: qué encontrarás en la cuenta y quién hay detrás.
const { C, icono } = require('../comun');

const T = {
  en: {
    kicker: 'START HERE', desliza: 'Swipe →',
    s1: { t: 'Money, <span class="c">explained simply.</span>', l: 'Clear, visual guides to budget, save and get out of debt. No jargon, no hype, no get-rich-quick.' },
    pilares: [['tarta', 'Budgeting', 'Where your money goes'], ['tarro', 'Saving', 'Emergency funds and goals'], ['menos', 'Debt', 'Pay it off faster'], ['sube', 'Investing basics', 'How time grows money']],
    s2: { t: 'What you’ll find here', l: 'Four topics, one goal: feeling in control of your money.' },
    s3: { t: 'How to use this account', pasos: [['marcador', 'Save the guides you want to try', 'They’re made to come back to'], ['calendario', 'New guides every Mon, Wed & Fri', 'In English here, in Spanish at @finanziapp.es'], ['bocadillo', 'Ask in the comments', 'We read and answer every question']] },
    s4: { t: 'Who’s behind this', l: 'We’re the small team building <b>FinanziApp</b>, a calm app to see all your money in one place: budget, spending, savings and net worth.',
      nota: 'We don’t sell financial products, and nothing here is financial advice. Just clear education to help you decide for yourself.' },
    s5: { t: 'Start with <span class="c">these</span>', guias: [['tarta', 'The 50/30/20 rule', 'How to split your paycheck'], ['paraguas', 'Your emergency fund', 'How much, and where to keep it'], ['sube', 'Compound interest', 'Why starting early matters']],
      final: 'Want to put it into practice? FinanziApp is free for 15 days: link in bio.' }
  },
  es: {
    kicker: 'EMPIEZA AQUÍ', desliza: 'Desliza →',
    s1: { t: 'El dinero, <span class="c">explicado fácil.</span>', l: 'Guías claras y visuales para hacer tu presupuesto, ahorrar y salir de deudas. Sin tecnicismos, sin humo y sin promesas de hacerte rico.' },
    pilares: [['tarta', 'Presupuesto', 'En qué se va tu dinero'], ['tarro', 'Ahorro', 'Colchón y objetivos'], ['menos', 'Deudas', 'Saldarlas antes'], ['sube', 'Inversión básica', 'Cómo el tiempo hace crecer el dinero']],
    s2: { t: 'Qué vas a encontrar aquí', l: 'Cuatro temas y un objetivo: sentir que controlas tu dinero.' },
    s3: { t: 'Cómo usar esta cuenta', pasos: [['marcador', 'Guarda las guías que quieras probar', 'Están hechas para volver a ellas'], ['calendario', 'Guías nuevas lunes, miércoles y viernes', 'En español aquí y en inglés en @finanziapp'], ['bocadillo', 'Pregunta en comentarios', 'Leemos y respondemos todas las dudas']] },
    s4: { t: 'Quién hay detrás', l: 'Somos el pequeño equipo que hace <b>FinanziApp</b>, una app tranquila para ver todo tu dinero en un solo sitio: presupuesto, gastos, ahorro y patrimonio.',
      nota: 'No vendemos productos financieros y nada de lo que publicamos es asesoramiento financiero. Solo educación clara para que decidas tú.' },
    s5: { t: 'Empieza por <span class="c">estas</span>', guias: [['tarta', 'La regla 50/30/20', 'Cómo repartir tu sueldo'], ['paraguas', 'Tu fondo de emergencia', 'Cuánto y dónde guardarlo'], ['sube', 'El interés compuesto', 'Por qué empezar pronto importa']],
      final: '¿Quieres ponerlo en práctica? FinanziApp es gratis 15 días: enlace en la bio.' }
  }
};

const fondo = (c) => c + '26';
const colores = [C.necesidades, C.caprichos, C.ahorro, '#3b82c4'];
const fila = (ic, color, titulo, sub, extra = '') => `<div class="item">${extra}<span class="ic" style="background:${fondo(color)}">${icono(ic, color, 42)}</span><span>${titulo}<small>${sub}</small></span></div>`;

module.exports = {
  slug: 'bienvenida',
  T,
  diapositivas: [
    (t) => `<h1 class="grande">${t.s1.t}</h1><p class="lead">${t.s1.l}</p>
      <div style="margin-top:64px;display:grid;grid-template-columns:repeat(4,1fr);gap:18px">${t.pilares.map(([ic], i) =>
        `<div class="tarjeta" style="display:flex;align-items:center;justify-content:center;padding:34px 0">${icono(ic, colores[i], 64)}</div>`).join('')}</div>`,
    (t) => `<h1>${t.s2.t}</h1><p class="lead">${t.s2.l}</p>
      <div style="margin-top:48px;display:flex;flex-direction:column;gap:16px">${t.pilares.map(([ic, a, b], i) => fila(ic, colores[i], a, b)).join('')}</div>`,
    (t) => `<h1>${t.s3.t}</h1>
      <div style="margin-top:52px;display:flex;flex-direction:column;gap:18px">${t.s3.pasos.map(([ic, a, b]) => fila(ic, C.necesidades, a, b)).join('')}</div>`,
    (t) => `<h1>${t.s4.t}</h1><p class="lead">${t.s4.l}</p>
      <div class="tarjeta" style="margin-top:48px;display:flex;gap:26px;align-items:flex-start">
        <span style="flex:0 0 auto;width:76px;height:76px;border-radius:20px;background:${fondo(C.necesidades)};display:inline-flex;align-items:center;justify-content:center">${icono('escudo', C.necesidades, 42)}</span>
        <p style="font-size:29px;line-height:1.45;color:${C.texto}">${t.s4.nota}</p></div>`,
    (t) => `<h1>${t.s5.t}</h1>
      <div style="margin-top:52px;display:flex;flex-direction:column;gap:18px">${t.s5.guias.map(([ic, a, b], i) => fila(ic, colores[i], a, b,
        `<span class="ic" style="background:transparent;border:1px solid ${C.borde};font-size:28px;font-weight:800;color:${C.suave}">${i + 1}</span>`)).join('')}</div>
      <p class="lead" style="margin-top:44px">${t.s5.final}</p>`
  ],
  texto: {
    en: `Welcome! 👋 This account is about one thing: making money simple.

Every Monday, Wednesday and Friday we post a short visual guide on:
• Budgeting: where your money goes and how to plan it
• Saving: emergency funds and goals
• Debt: how to pay it off faster
• Investing basics: why time is your best ally

No jargon, no hype, no get-rich-quick. We're the small team behind FinanziApp, a calm app to see all your money in one place, and we'd rather teach than sell. Nothing here is financial advice; it's education to help you decide for yourself.

Start with the 50/30/20 guide, save the ones you want to try, and ask anything in the comments.

What's the money topic you'd like us to explain first? 👇

#personalfinance #moneytips #budgeting #financialliteracy #moneyexplained`,
    es: `¡Bienvenido! 👋 Esta cuenta va de una cosa: hacer fácil el dinero.

Cada lunes, miércoles y viernes publicamos una guía visual y corta sobre:
• Presupuesto: en qué se va tu dinero y cómo planificarlo
• Ahorro: fondo de emergencia y objetivos
• Deudas: cómo saldarlas antes
• Inversión básica: por qué el tiempo es tu mejor aliado

Sin tecnicismos, sin humo y sin promesas de hacerte rico. Somos el pequeño equipo detrás de FinanziApp, una app tranquila para ver todo tu dinero en un solo sitio, y preferimos enseñar a vender. Nada de esto es asesoramiento financiero: es educación para que decidas tú.

Empieza por la guía del 50/30/20, guarda las que quieras probar y pregunta lo que necesites en comentarios.

¿Qué tema de dinero te gustaría que explicáramos primero? 👇

#finanzaspersonales #educacionfinanciera #ahorro #presupuesto #dineroexplicado`
  }
};
