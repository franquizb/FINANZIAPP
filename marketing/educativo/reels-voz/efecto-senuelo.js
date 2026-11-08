// Reel hablado (versión larga, NO publicada: el propietario prefiere píldoras de 20–30 s): el efecto señuelo.
// Se usa como banco de escenas; la versión publicable es trampa-01-senuelo.js.
// Estructura: gancho → intro → cuerpo 1 (el experimento de The Economist) → bucle → cuerpo 2 → bucle → final.
// Fuentes: Huber, Payne y Puto (1982), Journal of Consumer Research (efecto de dominancia asimétrica, «señuelo»);
// Dan Ariely, «Predictably Irrational» / «Las trampas del deseo» (2008): con estudiantes del MIT, web 59 $ (16 %),
// papel 125 $ (0 %), papel + web 125 $ (84 %); sin la opción de papel: web 68 %, papel + web 32 % (elección hipotética).
const { C, icono, VOZ, CIERRE, CSS, bucle, cierreCon } = require('./_comun');
const { cuadra } = require('../reels/_comun');

const EXP = { con: [16, 0, 84], sin: [68, 32] };
cuadra('con señuelo', EXP.con.reduce((a, b) => a + b, 0), 100);
cuadra('sin señuelo', EXP.sin.reduce((a, b) => a + b, 0), 100);
const N = {
  en: { palomitas: [5, 8.5, 9], planes: [6.99, 12.99, 13.99] },
  es: { palomitas: [5, 8.5, 9], planes: [6.99, 12.99, 13.99] }
};
cuadra('premium − estándar', +(N.en.planes[2] - N.en.planes[1]).toFixed(2), 1);

const T = {
  en: {
    titulo: 'The medium popcorn <span class="c">is a trap</span>.',
    retencion: 'Stay for the question that <span class="c">beats the trick</span>',
    l: { tallas: ['Small', 'Medium', 'Large'], para: 'Why is it here?', termino: 'Decoy effect', etiqueta: 'MEDIUM',
      fuente: 'The Economist · MIT students (Ariely, 2008)', con: 'WITH THE DECOY', sin: 'WITHOUT IT', opciones: ['Web only · $59', 'Print only · $125', 'Print + web · $125'],
      loco: 'Not the crazy part…', movil: 'On your phone', planes: ['Basic', 'Standard', 'Premium'], mas: 'only +$1', quieren: 'what they want to sell you',
      tapado: 'COVERED', pregunta: 'The question that beats it?', cita: '“If only these two existed, which would I pick?”', tu: 'YOU', marketing: 'MARKETING', mes: '/mo' },
    guion: [
      [0, '[amusement] The medium popcorn is *not there* for you to buy.'],
      [0, 'It’s there so you buy §*the large*. [short pause] And it works. Every time.'],
      [1, '[enthusiasm] It’s called the §*decoy effect*. Like a hunter’s wooden duck: useless on its own,§ but it pulls the real ones in.'],
      [2, '[curiosity] In an MIT experiment, people got three subscriptions:§ web only, $59.§ Print only, $125.§ Print and web… also $125.'],
      [2, '§Nobody picked print only. But *84%* chose the combo. [short pause] §They removed the silly option…§ and the combo dropped to *32%*.'],
      [3, 'But that’s not the crazy part. [short pause] The crazy part is §it’s on your phone right now.'],
      [4, 'Look at any subscription:§ Basic, Standard, Premium.§ Standard, priced almost like Premium.§ Coincidence? Not even a little.'],
      [4, 'Solution: §*forget the middle option*, and pick between the other two.'],
      [5, 'And the one question that beats it?'],
      [6, '§*“If only these two existed, which would I pick?”* [short pause] If it’s the cheaper one,§ congrats: you just beat a whole marketing department.'],
      [7, 'Send this to the friend who always goes large. [short pause] And follow.']
    ],
    cierre: CIERRE.en
  },
  es: {
    titulo: 'Las palomitas medianas <span class="c">son una trampa</span>.',
    retencion: 'Al final: la pregunta que <span class="c">desactiva el truco</span>',
    l: { tallas: ['Pequeña', 'Mediana', 'Grande'], para: '¿Para qué está?', termino: 'Efecto señuelo', etiqueta: 'MEDIANA',
      fuente: 'The Economist · estudiantes del MIT (Ariely, 2008)', con: 'CON SEÑUELO', sin: 'SIN SEÑUELO', opciones: ['Solo web · 59 $', 'Solo papel · 125 $', 'Papel + web · 125 $'],
      loco: 'Eso no es lo más loco…', movil: 'En tu móvil', planes: ['Básico', 'Estándar', 'Prémium'], mas: 'solo +1 €', quieren: 'el que quieren venderte',
      tapado: 'TAPADO', pregunta: '¿La pregunta que lo desactiva?', cita: '«Si solo existieran estas dos, ¿cuál elegiría?»', tu: 'TÚ', marketing: 'MARKETING', mes: '/mes' },
    guion: [
      [0, '[amusement] Las palomitas medianas *no están ahí* para que las compres.'],
      [0, 'Están ahí para que compres §*las grandes*. [short pause] Y funciona. Siempre.'],
      [1, '[enthusiasm] Se llama §*efecto señuelo*. Como el pato de madera de los cazadores: no sirve para nada,§ salvo para atraer a los de verdad.'],
      [2, '[curiosity] En un experimento del MIT ofrecieron tres suscripciones:§ solo web, 59 dólares.§ Solo papel, 125.§ Papel y web… también 125.'],
      [2, '§Nadie quiso solo papel. Pero el *84 %* eligió el combo. [short pause] §Quitaron la opción tonta…§ y el combo cayó al *32 %*.'],
      [3, 'Pero eso no es lo más loco. [short pause] Lo más loco es que §lo tienes en el móvil ahora mismo.'],
      [4, 'Mira cualquier suscripción:§ básico, estándar, prémium.§ El estándar, casi al precio del prémium.§ ¿Casualidad? Para nada.'],
      [4, 'Solución: §*olvídate de la opción del medio* y elige entre las otras dos.'],
      [5, '¿Y la pregunta que lo desactiva todo?'],
      [6, '§*«Si solo existieran estas dos, ¿cuál elegiría?»* [short pause] Si es la barata,§ enhorabuena: le acabas de ganar a todo un departamento de marketing.'],
      [7, 'Compártelo con quien siempre pide el menú grande. [short pause] Y síguenos.']
    ],
    cierre: CIERRE.es
  }
};

const din = (n, l) => (l === 'en' ? '$' + n.toFixed(2) : n.toFixed(2).replace('.', ',').replace(',00', '') + ' €');
const ROJO = '#e66767';

// Cubo de palomitas (rayas y palomitas por encima). `id` único para el recorte de las rayas.
const cubo = (id, cx, base, k) => {
  const arriba = 150 * k, abajo = 108 * k, alto = 170 * k, y0 = base - alto;
  const forma = `M${cx - arriba / 2} ${y0} L${cx + arriba / 2} ${y0} L${cx + abajo / 2} ${base} L${cx - abajo / 2} ${base} Z`;
  const rayas = Array.from({ length: 6 }, (_, i) => `<rect x="${cx - arriba / 2 + i * arriba / 5 - arriba / 20}" y="${y0}" width="${arriba / 10}" height="${alto}" fill="#f1f5f9"/>`).join('');
  const bolas = [[-50, 6], [-22, -8], [8, 2], [36, -10], [56, 8], [-36, -26], [18, -28], [-4, -40]].map(([dx, dy]) =>
    `<circle cx="${cx + dx * k}" cy="${y0 + dy * k}" r="${22 * k}" fill="#f6e7b6" stroke="#e2c27a" stroke-width="3"/>`).join('');
  return `<defs><clipPath id="cubo-${id}"><path d="${forma}"/></clipPath></defs>${bolas}
    <path d="${forma}" fill="${ROJO}"/><g clip-path="url(#cubo-${id})">${rayas}</g><path d="${forma}" fill="none" stroke="#b44f4f" stroke-width="4" stroke-linejoin="round"/>`;
};
// Pato: de madera (señuelo) o de verdad.
const pato = (madera) => {
  const cuerpo = madera ? '#a9744f' : C.acento, sombra = madera ? '#7a5034' : ATRAS_PATO;
  return `<ellipse cx="0" cy="0" rx="110" ry="50" fill="${cuerpo}"/><path d="M-100 -10 L-150 -40 L-120 6 Z" fill="${cuerpo}"/>
    <circle cx="78" cy="-58" r="38" fill="${cuerpo}"/><path d="M110 -62 L150 -52 L110 -44 Z" fill="#e9a23b"/><circle cx="88" cy="-66" r="5" fill="#0f172a"/>
    <path d="M-60 -10 Q0 30 60 -6" fill="none" stroke="${sombra}" stroke-width="6" stroke-linecap="round"/>
    ${madera ? '<path d="M-80 18 Q-20 26 40 18M-70 -26 Q-10 -34 50 -24" fill="none" stroke="#8b5e3c" stroke-width="3"/><circle cx="-40" cy="0" r="4" fill="#5b3a24"/><circle cx="30" cy="4" r="4" fill="#5b3a24"/>' : ''}`;
};
const ATRAS_PATO = '#2a9d8f';

module.exports = {
  slug: 'efecto-senuelo',
  voz: VOZ,
  T,
  datos: (lang) => ({ ...N[lang], exp: EXP }),
  css: CSS + `
    .fila-exp { margin-top: 18px; }
    .fila-exp .cab { display: flex; justify-content: space-between; font-size: 34px; font-weight: 700; margin-bottom: 10px; }
    .fila-exp .pista { height: 30px; border-radius: 10px; background: rgba(148,163,184,.14); overflow: hidden; }
    .fila-exp .bar { height: 100%; width: 0; border-radius: 10px; }
    .panel-exp { background: ${C.superficie}; border: 1px solid ${C.borde}; border-radius: 26px; padding: 24px 30px 28px; }
    .panel-exp .tit { font-size: 24px; font-weight: 800; letter-spacing: .14em; color: ${C.suave}; }
    .plan { position: absolute; top: 120px; width: 280px; height: 360px; background: ${C.superficie}; border: 3px solid ${C.borde}; border-radius: 28px; text-align: center; padding-top: 44px; opacity: 0; }
    .plan .nom { font-size: 36px; font-weight: 800; }
    .plan .pre { font-size: 54px; font-weight: 850; margin-top: 24px; letter-spacing: -.02em; }
    .plan .mes { font-size: 26px; color: ${C.suave}; font-weight: 600; }
    .plan .pts { margin-top: 30px; display: flex; flex-direction: column; gap: 14px; align-items: center; }
    .plan .pts span { width: 150px; height: 12px; border-radius: 6px; background: rgba(148,163,184,.25); }
  `,
  escenas: [
    // 0 · Gancho: tres tamaños de palomitas; la mediana está ahí para que compres la grande.
    {
      html: (t, lang) => { const n = N[lang]; return `<div class="gancho"><h1 class="a">${t.titulo}</h1>
        <svg viewBox="0 0 912 560" width="912" height="560" style="margin-top:20px;overflow:visible;font-family:Inter,sans-serif">
          ${[[150, 0.72], [456, 0.96], [762, 1.2]].map(([cx, k], i) => `<g class="cubo cubo-${i}" data-cx="${cx}" opacity="0">${cubo(i, cx, 440, k)}
            <text x="${cx}" y="496" text-anchor="middle" font-size="40" font-weight="850" fill="${C.tinta}">${din(n.palomitas[i], lang)}</text>
            <text x="${cx}" y="534" text-anchor="middle" font-size="26" font-weight="650" fill="${C.suave}">${t.l.tallas[i]}</text></g>`).join('')}
          <g class="duda" opacity="0"><circle cx="456" cy="150" r="46" fill="rgba(94,234,212,.12)" stroke="${C.acento}" stroke-width="5"/><text x="456" y="172" text-anchor="middle" font-size="64" font-weight="900" fill="${C.acento}">?</text></g>
          <g class="flecha" opacity="0"><path d="M762 120 v-40" stroke="${C.acento}" stroke-width="10" stroke-linecap="round"/><path d="M738 104 L762 128 L786 104" fill="none" stroke="${C.acento}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/></g>
        </svg></div>`; },
      anim: function (s, e, el) {
        [0, 1, 2].forEach(i => { const g = el.querySelector('.cubo-' + i), p = rebote(tramo(s, 0.2 + i * 0.25, 0.65 + i * 0.25)), cx = +g.dataset.cx;
          g.setAttribute('opacity', Math.min(1, p * 1.4)); g.setAttribute('transform', 'translate(' + cx + ',440) scale(' + (0.6 + 0.4 * p) + ') translate(' + (-cx) + ',-440)'); });
        const d = el.querySelector('.duda'), q = rebote(tramo(s, 1.1, 1.5));
        d.setAttribute('opacity', Math.min(1, q * 1.4) * (1 - tramo(s, e.seg[1].marcas[0], e.seg[1].marcas[0] + 0.3)));
        d.setAttribute('transform', 'translate(0,' + (-Math.abs(Math.sin(s * 3.5)) * 14) + ')');
        const m = e.seg[1].marcas[0], g = el.querySelector('.cubo-2'), pulso = tramo(s, m, m + 0.5);
        if (s > m) g.setAttribute('transform', 'translate(762,440) scale(' + (1 + 0.08 * Math.sin(pulso * Math.PI)) + ') translate(-762,-440)');
        const f = el.querySelector('.flecha'); f.setAttribute('opacity', tramo(s, m, m + 0.3)); f.setAttribute('transform', 'translate(0,' + (Math.sin(s * 6) * 8) + ')');
      }
    },
    // 1 · Intro: el pato de madera del cazador (el señuelo) atrae a los de verdad.
    {
      html: (t) => `<div style="text-align:center;height:140px"><div class="sello" style="opacity:0">${t.l.termino}</div></div>
        <svg viewBox="0 0 1080 740" width="1080" height="740" style="position:absolute;left:0;top:150px;overflow:hidden;font-family:Inter,sans-serif">
          <g class="madera" transform="translate(330,430)">${pato(true)}
            <g transform="translate(-10,40)"><line x1="0" y1="0" x2="0" y2="60" stroke="${C.suave}" stroke-width="3"/><rect x="-80" y="60" width="160" height="56" rx="12" fill="#f1f5f9"/><text x="0" y="98" text-anchor="middle" font-size="30" font-weight="850" fill="#0f172a">${t.l.etiqueta}</text></g></g>
          ${[0, 1, 2].map(i => `<g class="real real-${i}" transform="translate(1300,${400 + i * 70}) scale(${0.7 - i * 0.08})">${pato(false)}</g>`).join('')}
          <g class="agua"><path d="${Array.from({ length: 30 }, (_, i) => `${i === 0 ? 'M' : 'Q'}${-200 + i * 60} ${i % 2 ? 470 : 490}${i === 0 ? '' : ` ${-170 + i * 60} 480`}`).join(' ')} L1600 760 L-200 760 Z" fill="rgba(56,189,248,.18)"/></g>
        </svg>`,
      anim: function (s, e, el) {
        const m = e.seg[0].marcas, q = rebote(tramo(s, m[0], m[0] + 0.45)), sello = el.querySelector('.sello');
        sello.style.opacity = Math.min(1, q * 1.5); sello.style.transform = 'rotate(-3deg) scale(' + (1.8 - 0.8 * q) + ')';
        el.querySelector('.madera').setAttribute('transform', 'translate(330,' + (430 + Math.sin(s * 2) * 6) + ') rotate(' + (Math.sin(s * 1.5) * 2) + ')');
        el.querySelector('.agua').setAttribute('transform', 'translate(' + (-(s * 40) % 120) + ',' + (Math.sin(s * 2) * 4) + ')');
        [0, 1, 2].forEach(i => { const p = sale(tramo(s, m[1] + i * 0.25, m[1] + 1.4 + i * 0.25)), x = lerp(1300, 600 + i * 130, p);
          el.querySelector('.real-' + i).setAttribute('transform', 'translate(' + x + ',' + (400 + i * 70 + Math.sin(s * 2.4 + i) * 5) + ') scale(-' + (0.7 - i * 0.08) + ',' + (0.7 - i * 0.08) + ')'); });
      }
    },
    // 2 · Cuerpo 1: el experimento (con y sin la opción señuelo).
    {
      html: (t) => `<div style="text-align:center;font-size:27px;font-weight:650;color:${C.suave}">${t.l.fuente}</div>
        <div class="panel-exp" style="margin-top:22px"><div class="tit">${t.l.con}</div>
          ${t.l.opciones.map((o, i) => `<div class="fila-exp fa fa-${i}" style="opacity:0"><div class="cab"><span class="op">${o}</span><span class="porc">0 %</span></div><div class="pista"><div class="bar" style="background:${i === 2 ? C.acento : i === 1 ? ROJO : C.suave}"></div></div></div>`).join('')}</div>
        <div class="panel-exp panel-b" style="margin-top:24px;opacity:0"><div class="tit">${t.l.sin}</div>
          ${[0, 2].map((i, k) => `<div class="fila-exp fb fb-${k}"><div class="cab"><span>${t.l.opciones[i]}</span><span class="porc">0 %</span></div><div class="pista"><div class="bar" style="background:${i === 2 ? C.acento : C.suave}"></div></div></div>`).join('')}</div>`,
      anim: function (s, e, el) {
        const m3 = e.seg[0].marcas, m4 = e.seg[1].marcas;
        const pon = (fila, pct, p) => { fila.querySelector('.bar').style.width = (pct * p) + '%'; fila.querySelector('.porc').textContent = Math.round(pct * p) + ' %'; };
        [0, 1, 2].forEach(i => { const f = el.querySelector('.fa-' + i), p = sale(tramo(s, m3[i], m3[i] + 0.4)); f.style.opacity = p; f.style.transform = 'translateX(' + ((1 - p) * 40) + 'px)';
          pon(f, D.exp.con[i], sale(tramo(s, m4[0] + i * 0.15, m4[0] + 1.2 + i * 0.15))); });
        const tacha = tramo(s, m4[1], m4[1] + 0.4), f1 = el.querySelector('.fa-1');
        f1.querySelector('.op').style.textDecoration = tacha > 0.5 ? 'line-through' : 'none'; if (tacha > 0) f1.style.opacity = 1 - 0.6 * tacha;
        const pb = el.querySelector('.panel-b'), p = sale(tramo(s, m4[1] + 0.2, m4[1] + 0.7)); pb.style.opacity = p; pb.style.transform = 'translateY(' + ((1 - p) * 40) + 'px)';
        [0, 1].forEach(k => pon(el.querySelector('.fb-' + k), D.exp.sin[k], sale(tramo(s, m4[2] - 0.3, m4[2] + 0.9))));
      }
    },
    // 3 · Bucle 1: lo tienes en el móvil.
    bucle((t) => t.l.loco, (t) => `${icono('movil', C.acento, 150)}<div style="font-size:44px;font-weight:850;color:${C.acento};margin-top:10px">${t.l.movil}</div>`),
    // 4 · Cuerpo 2: básico, estándar, prémium; el estándar es el señuelo → tápalo.
    {
      html: (t, lang) => { const n = N[lang]; return `<div style="position:relative;height:900px">
        ${[0, 1, 2].map(i => `<div class="plan plan-${i}" style="left:${i * 306}px"><div class="nom">${t.l.planes[i]}</div><div class="pre">${din(n.planes[i], lang)}</div><div class="mes">${t.l.mes}</div><div class="pts">${'<span></span>'.repeat(i + 2)}</div></div>`).join('')}
        <div class="corchete" style="position:absolute;left:446px;top:40px;width:440px;text-align:center;opacity:0">
          <div style="font-size:40px;font-weight:850;color:${C.caprichos}">${t.l.mas}</div>
          <div style="margin:8px auto 0;width:300px;height:26px;border:5px solid ${C.caprichos};border-bottom:none;border-radius:14px 14px 0 0"></div></div>
        <div class="quieren" style="position:absolute;left:612px;top:500px;width:280px;text-align:center;font-size:30px;font-weight:800;color:${C.acento};opacity:0">★ ${t.l.quieren}</div>
        <div class="tapa" style="position:absolute;left:306px;top:-400px;opacity:0;width:280px;height:360px;border-radius:28px;background:repeating-linear-gradient(45deg,#334155 0 22px,#1e293b 22px 44px);display:flex;align-items:center;justify-content:center;font-size:38px;font-weight:900;letter-spacing:.08em;color:#f1f5f9">${t.l.tapado}</div>
        <div class="vs" style="position:absolute;left:0;right:0;top:620px;text-align:center;font-size:56px;font-weight:900;opacity:0">${t.l.planes[0]} <span style="color:${C.acento}">vs</span> ${t.l.planes[2]}</div>
      </div>`; },
      anim: function (s, e, el) {
        const m6 = e.seg[0].marcas, m7 = e.seg[1].marcas[0];
        [0, 1, 2].forEach(i => { const p = rebote(tramo(s, m6[0] + i * 0.2, m6[0] + 0.5 + i * 0.2)), c = el.querySelector('.plan-' + i); c.style.opacity = Math.min(1, p * 1.4); c.style.transform = 'translateY(' + ((1 - p) * 50) + 'px)'; });
        const c = el.querySelector('.corchete'), pc = sale(tramo(s, m6[1], m6[1] + 0.4)); c.style.opacity = pc; c.style.transform = 'translateY(' + ((1 - pc) * -20) + 'px)';
        const pq = tramo(s, m6[2], m6[2] + 0.4), prem = el.querySelector('.plan-2');
        el.querySelector('.quieren').style.opacity = pq; if (pq > 0) prem.style.borderColor = '#5eead4';
        const pt = sale(tramo(s, m7, m7 + 0.55)), tapa = el.querySelector('.tapa'); tapa.style.top = lerp(-400, 120, pt) + 'px'; tapa.style.opacity = pt > 0 ? 1 : 0;
        el.querySelector('.vs').style.opacity = tramo(s, m7 + 0.6, m7 + 1.0);
        if (pt > 0.9) { el.querySelector('.corchete').style.opacity = 1 - tramo(s, m7 + 0.5, m7 + 0.8); el.querySelector('.quieren').style.opacity = 1 - tramo(s, m7 + 0.5, m7 + 0.8); }
      }
    },
    // 5 · Bucle 2: la pregunta que lo desactiva.
    bucle((t) => t.l.pregunta),
    // 6 · Final: la pregunta y el marcador «Tú 1 · 0 Marketing».
    {
      html: (t) => `<div class="cita a" style="opacity:0;margin-top:30px;background:${C.superficie};border:3px solid ${C.acento};border-radius:30px;padding:44px 40px;font-size:58px;line-height:1.15;font-weight:850;text-align:center">${t.l.cita}</div>
        <div class="marcador" style="opacity:0;margin-top:60px;display:flex;align-items:center;justify-content:center;gap:26px">
          <div style="text-align:center"><div style="font-size:30px;font-weight:800;letter-spacing:.12em;color:${C.acento}">${t.l.tu}</div><div class="g1" style="width:150px;height:170px;border-radius:24px;background:#0b1222;border:4px solid ${C.acento};font-size:120px;font-weight:900;display:flex;align-items:center;justify-content:center;margin-top:10px">0</div></div>
          <div style="font-size:90px;font-weight:900;color:${C.suave};padding-top:40px">:</div>
          <div style="text-align:center"><div style="font-size:30px;font-weight:800;letter-spacing:.12em;color:${C.suave}">${t.l.marketing}</div><div style="width:150px;height:170px;border-radius:24px;background:#0b1222;border:4px solid #33415c;font-size:120px;font-weight:900;display:flex;align-items:center;justify-content:center;margin-top:10px;color:${C.suave}">0</div></div>
        </div>`,
      anim: function (s, e, el) {
        const m = e.seg[0].marcas, c = el.querySelector('.cita'), p = rebote(tramo(s, m[0], m[0] + 0.5));
        c.style.opacity = Math.min(1, p * 1.4); c.style.transform = 'scale(' + (0.85 + 0.15 * p) + ')';
        const mk = el.querySelector('.marcador'), q = sale(tramo(s, m[1] - 0.6, m[1] - 0.2)); mk.style.opacity = q;
        const g = el.querySelector('.g1'), giro = tramo(s, m[1] + 0.2, m[1] + 0.6);
        g.textContent = giro > 0.5 ? '1' : '0'; g.style.transform = 'rotateX(' + (Math.sin(giro * Math.PI) * 80) + 'deg) scale(' + (1 + 0.12 * Math.sin(giro * Math.PI)) + ')';
        if (giro >= 1) g.style.background = 'rgba(94,234,212,.18)';
      }
    },
    // 7 · Cierre: salto con confeti (ha ganado al marketing).
    cierreCon('salto')
  ],
  texto: {
    en: `The medium popcorn isn't there for you to buy. 🍿

It's there so you buy the large. It's called the decoy effect (Huber, Payne & Puto, 1982): an option almost nobody picks, but that makes another one look like a steal. Like a hunter's wooden duck.

The famous example: MIT students were offered three subscriptions to The Economist: web only for $59, print only for $125, and print + web, also for $125. Nobody chose print only, but 84% went for the combo. Remove the silly option and the combo dropped to 32% (Dan Ariely, "Predictably Irrational", 2008).

It's on your phone right now: in many subscription plans, the middle tier costs almost the same as the top one. The trick: cover the middle option and compare the other two.

The question that beats it: "If only these two existed, which would I pick?"

What's the last thing you upsized because "it was basically the same price"? 👇

Education, not financial advice.

#personalfinance #moneytips #psychology #savingmoney #financialliteracy`,
    es: `Las palomitas medianas no están ahí para que las compres. 🍿

Están ahí para que compres las grandes. Se llama efecto señuelo (Huber, Payne y Puto, 1982): una opción que casi nadie elige, pero que hace que otra parezca un chollo. Como el pato de madera de los cazadores.

El ejemplo más famoso: a estudiantes del MIT les ofrecieron tres suscripciones a The Economist: solo web por 59 $, solo papel por 125 $ y papel + web también por 125 $. Nadie eligió solo papel, pero el 84 % se quedó con el combo. Al quitar la opción absurda, el combo bajó al 32 % (Dan Ariely, «Las trampas del deseo», 2008).

Lo tienes en el móvil ahora mismo: en muchos planes de suscripción, el intermedio cuesta casi lo mismo que el más caro. El truco: tapa la opción del medio y compara las otras dos.

La pregunta que lo desactiva: «Si solo existieran estas dos, ¿cuál elegiría?».

¿Qué es lo último que compraste en grande «porque total, era casi lo mismo»? 👇

Educación financiera, no asesoramiento.

#finanzaspersonales #ahorro #dinero #educacionfinanciera #psicologia`
  }
};

// Piezas reutilizables por las píldoras de la serie «Trampas de precio».
module.exports.piezas = { cubo, pato, din };
