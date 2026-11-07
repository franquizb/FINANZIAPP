// Reel hablado: el dolor de pagar (la tarjeta como anestesia para la cartera).
// Estructura: gancho → intro → cuerpo 1 (el experimento del MIT) → bucle → cuerpo 2 → bucle → final.
// Fuentes: Prelec y Loewenstein (1998), «The Red and the Black», Marketing Science (el «dolor de pagar»);
// Prelec y Simester (2001), «Always Leave Home Without It», Marketing Letters: en una subasta de entradas
// de los Celtics, quienes pagarían con tarjeta pujaron casi el doble que quienes pagarían en efectivo.
const { C, icono, VOZ, CIERRE, CSS, bucle, cierreCon } = require('./_comun');
const { cuadra } = require('../reels/_comun');

const N = {
  en: { limite: 75, compras: [['Coffee', 5], ['Movie', 15], ['Takeout', 25], ['Video game', 30]] },
  es: { limite: 60, compras: [['Café', 3], ['Cine', 9], ['Cena a domicilio', 20], ['Videojuego', 28]] }
};
for (const l of ['en', 'es']) cuadra(`límite ${l}`, N[l].compras.reduce((a, [, v]) => a + v, 0), N[l].limite);

const T = {
  en: {
    titulo: 'Your card is <span class="c">anesthesia</span> for your wallet.',
    retencion: 'Wait for the <span class="c">2-tap trick</span>',
    l: { dolor: 'PAIN OF PAYING', metodos: ['Cash', 'Card', 'Phone'], termino: 'The pain of paying', fuente1: 'Prelec & Loewenstein, 1998',
      subasta: 'Same basketball tickets', puja: 'Average bid', uno: '×1', doble: 'almost ×2', fuente2: 'MIT experiment · Prelec & Simester, 2001',
      loco: 'Not the crazy part…', bolsillo: 'In your pocket', limite: 'FUN MONEY LIMIT', seacabo: 'Gone', truco: 'The dumbest trick?', toques: '2 taps',
      banco: 'Your bank · now', pago: (x) => `Card payment: ${x} at Coffee Shop` },
    guion: [
      [0, '[sarcasm] Your card has a superpower. [short pause] It makes spending *not hurt*.'],
      [0, 'Which, for your bank account, is a *pretty big problem*.'],
      [1, '§Paying cash *hurts*. [short pause] §With a card, a beep and done. §With your phone, not even that.'],
      [1, 'Economists even have a name for it: §*the pain of paying*.'],
      [2, 'In an MIT experiment, people bid on basketball tickets.§ Some would pay cash.§ Others, by card.'],
      [2, 'The card group bid §*almost twice as much*. [short pause] For the same tickets.'],
      [3, 'But that’s not the crazy part. [short pause] The fix is §already in your pocket. [short pause] And no, it’s not your wallet.'],
      [4, 'First, make your card *hurt* a little again.§ Put a *limit* on the card you use for fun stuff, right in your bank’s app.'],
      [4, '§When it’s gone, it’s gone. [short pause] Like cash, minus the nineties vibes.'],
      [5, 'And the dumbest trick of all? [short pause] It’s §*two taps* away.'],
      [6, '§Turn on a *notification for every payment*.§ That little ping is the pain your card was missing. [medium pause] You’re welcome.'],
      [7, 'Save this. Your wallet can’t, it has *no hands*. [short pause] And follow.']
    ],
    cierre: CIERRE.en
  },
  es: {
    titulo: 'Tu tarjeta es <span class="c">anestesia</span> para tu cartera.',
    retencion: 'Espera al truco de los <span class="c">2 toques</span>',
    l: { dolor: 'DOLOR AL PAGAR', metodos: ['Efectivo', 'Tarjeta', 'Móvil'], termino: 'El dolor de pagar', fuente1: 'Prelec y Loewenstein, 1998',
      subasta: 'Las mismas entradas', puja: 'Puja media', uno: '×1', doble: 'casi ×2', fuente2: 'Experimento del MIT · Prelec y Simester, 2001',
      loco: 'Eso no es lo más loco…', bolsillo: 'En tu bolsillo', limite: 'LÍMITE DE CAPRICHOS', seacabo: 'Se acabó', truco: '¿El truco más tonto?', toques: '2 toques',
      banco: 'Tu banco · ahora', pago: (x) => `Pago con tarjeta: ${x} en Cafetería` },
    guion: [
      [0, '[sarcasm] Tu tarjeta tiene un superpoder. [short pause] Hace que gastar *no duela*.'],
      [0, 'Y eso, para tu cuenta, es un problema *bastante gordo*.'],
      [1, '§Pagar en efectivo *duele*. [short pause] §Con la tarjeta, un pitido y listo. §Con el móvil, ni eso.'],
      [1, 'Los economistas hasta le han puesto nombre: §*el dolor de pagar*.'],
      [2, 'En un experimento del MIT subastaron entradas de baloncesto.§ Unos iban a pagar en efectivo.§ Otros, con tarjeta.'],
      [2, 'Los de la tarjeta pujaron §*casi el doble*. [short pause] Por las mismas entradas.'],
      [3, 'Pero eso no es lo más loco. [short pause] La solución §ya la llevas en el bolsillo. [short pause] Y no, no es la cartera.'],
      [4, 'Primero, devuélvele un poco de dolor a la tarjeta.§ Ponle un *límite* a la tarjeta de los caprichos desde la app de tu banco.'],
      [4, '§Cuando se acaba, se acaba. [short pause] Como los billetes, pero sin parecer de los noventa.'],
      [5, '¿Y el truco más tonto de todos? [short pause] Está a §*dos toques*.'],
      [6, '§Activa la *notificación de cada pago*.§ Ese pitido del móvil es el dolor que le faltaba a tu tarjeta. [medium pause] De nada.'],
      [7, 'Guárdalo, que tu cartera *no tiene manos*. [short pause] Y síguenos.']
    ],
    cierre: CIERRE.es
  }
};

const din = (n, l, dec = 0) => (l === 'en' ? '$' + n.toFixed(dec) : n.toFixed(dec).replace('.', ',') + ' €');
const ROJO = '#e66767';

// Medidor semicircular del «dolor al pagar». Aguja dibujada hacia la izquierda (0 %) y girada.
const medidor = (cx, cy, r, ancho) => {
  const punto = (p, rr) => [cx + rr * Math.cos(Math.PI * (1 - p)), cy - rr * Math.sin(Math.PI * (1 - p))];
  const arco = (a, b, color) => { const [x1, y1] = punto(a, r), [x2, y2] = punto(b, r); return `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)} A${r} ${r} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}" stroke="${color}" stroke-width="${ancho}" fill="none"/>`; };
  return `${arco(0, 0.39, C.necesidades)}${arco(0.41, 0.69, C.caprichos)}${arco(0.71, 1, ROJO)}
    <g class="aguja" transform="rotate(0 ${cx} ${cy})"><line x1="${cx}" y1="${cy}" x2="${cx - r * 0.86}" y2="${cy}" stroke="${C.tinta}" stroke-width="${ancho * 0.3}" stroke-linecap="round"/></g>
    <circle cx="${cx}" cy="${cy}" r="${ancho * 0.6}" fill="${C.tinta}"/>`;
};
const billete = (color, tam) => `<svg width="${tam}" height="${tam}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.6"/><path d="M6 12h.01M18 12h.01"/></svg>`;

const SCRIPT = `
function aguja(el, p) { const g = el.querySelector('.aguja'), m = g.getAttribute('transform').match(/rotate\\([^ ]+ ([^ ]+) ([^)]+)\\)/); g.setAttribute('transform', 'rotate(' + (180 * p) + ' ' + m[1] + ' ' + m[2] + ')'); }
// Valor que va pasando por una lista de objetivos [momento, valor] con transiciones suaves.
function pasos(s, lista, dur) { let v = lista[0][1]; for (let i = 1; i < lista.length; i++) v = lerp(v, lista[i][1], sale(tramo(s, lista[i][0], lista[i][0] + (dur || 0.5)))); return v; }
`;

module.exports = {
  slug: 'dolor-de-pagar',
  voz: VOZ,
  T,
  datos: (lang) => ({ ...N[lang] }),
  script: SCRIPT,
  css: CSS + `
    .chips { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
    .chip { background: ${C.superficie}; border: 3px solid ${C.borde}; border-radius: 24px; padding: 20px 10px; text-align: center; font-size: 32px; font-weight: 750; color: ${C.texto}; opacity: .45; }
    .chip svg { display: block; margin: 0 auto 8px; }
    .barra-v { position: absolute; bottom: 0; width: 230px; border-radius: 22px 22px 8px 8px; }
    .fila-compra { display: flex; justify-content: space-between; font-size: 38px; font-weight: 700; padding: 16px 6px; border-bottom: 1px solid ${C.borde}; opacity: 0; }
  `,
  escenas: [
    // 0 · Gancho: la tarjeta «dormida» (anestesia).
    {
      html: (t) => `<div class="gancho"><h1 class="a">${t.titulo}</h1>
        <svg viewBox="0 0 912 470" width="912" height="470" style="margin-top:40px;overflow:visible">
          <defs><linearGradient id="gt" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.necesidades}"/><stop offset="1" stop-color="${C.ahorro}"/></linearGradient></defs>
          <g class="tarjeta-g"><g transform="translate(150,90) rotate(-6 260 165)">
            <rect width="520" height="330" rx="34" fill="url(#gt)"/>
            <rect x="48" y="112" width="88" height="66" rx="12" fill="#e9c46a"/><path d="M48 145h88M92 112v66" stroke="#b8902e" stroke-width="3"/>
            <g fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".9"><path d="M418 118a40 40 0 0 1 0 54"/><path d="M440 102a64 64 0 0 1 0 86"/><path d="M462 86a88 88 0 0 1 0 118"/></g>
            <text x="48" y="280" font-size="40" font-weight="700" fill="#fff" opacity=".85" letter-spacing="8" font-family="Inter,sans-serif">•••• ••••</text>
          </g></g>
          <g font-family="Inter,sans-serif" font-weight="900" fill="${C.texto}">
            <text class="z z0" x="700" y="90" font-size="74">Z</text><text class="z z1" x="760" y="40" font-size="56">z</text><text class="z z2" x="806" y="0" font-size="42">z</text></g>
        </svg></div>`,
      anim: function (s, e, el) {
        el.querySelector('.tarjeta-g').setAttribute('transform', 'translate(0,' + (Math.sin(s * 1.6) * 8) + ')');
        el.querySelectorAll('.z').forEach((z, i) => {
          const c = ((s * 0.55 + i * 0.33) % 1);
          z.setAttribute('opacity', Math.sin(c * Math.PI)); z.setAttribute('transform', 'translate(' + (c * 30) + ',' + (-c * 60) + ')');
        });
      }
    },
    // 1 · Intro: el medidor del dolor al pagar (efectivo, tarjeta, móvil) y su nombre.
    {
      html: (t) => `<div style="text-align:center;font-size:28px;font-weight:750;letter-spacing:.14em;color:${C.suave};margin-top:10px">${t.l.dolor}</div>
        <svg viewBox="0 0 912 400" width="912" height="400" style="margin-top:10px">${medidor(456, 350, 300, 52)}</svg>
        <div class="chips" style="margin-top:30px">${t.l.metodos.map((m, i) => `<div class="chip chip-${i}">${i === 0 ? billete(C.tinta, 60) : icono(i === 1 ? 'tarjeta' : 'movil', C.tinta, 60)}${m}</div>`).join('')}</div>
        <div style="text-align:center;margin-top:50px"><div class="sello" style="opacity:0">${t.l.termino}</div>
          <div class="fuente" style="margin-top:16px;font-size:28px;color:${C.suave};font-weight:600;opacity:0">${t.l.fuente1}</div></div>`,
      anim: function (s, e, el) {
        const m = e.seg[0].marcas;
        aguja(el, pasos(s, [[0, 0], [m[0] + 0.2, 0.88], [m[1], 0.3], [m[2], 0.06]], 0.6) + Math.sin(s * 20) * 0.006);
        const activo = s < m[1] ? 0 : s < m[2] ? 1 : 2;
        [0, 1, 2].forEach(i => { const c = el.querySelector('.chip-' + i); c.style.opacity = i === activo ? 1 : 0.45; c.style.borderColor = i === activo ? (i === 0 ? '#e66767' : '#5eead4') : ''; });
        const mt = e.seg[1].marcas[0], q = rebote(tramo(s, mt, mt + 0.45)), sello = el.querySelector('.sello');
        sello.style.opacity = Math.min(1, q * 1.5); sello.style.transform = 'rotate(-3deg) scale(' + (1.8 - 0.8 * q) + ')';
        el.querySelector('.fuente').style.opacity = tramo(s, mt + 0.4, mt + 0.9);
      }
    },
    // 2 · Cuerpo 1: la subasta del MIT (con tarjeta, casi el doble).
    {
      html: (t) => `<div style="display:flex;align-items:center;justify-content:center;gap:22px;margin-top:10px">
          <svg width="96" height="64" viewBox="0 0 48 32"><path d="M4 4h40v8a4 4 0 0 0 0 8v8H4v-8a4 4 0 0 0 0-8z" fill="none" stroke="${C.caprichos}" stroke-width="3" stroke-linejoin="round"/><path d="M30 6v20" stroke="${C.caprichos}" stroke-width="2.5" stroke-dasharray="3 3"/></svg>
          <span style="font-size:44px;font-weight:800">${t.l.subasta}</span></div>
        <div style="position:relative;height:500px;margin:50px auto 0;width:620px">
          <div class="col col-0" style="position:absolute;left:40px;bottom:0;width:230px;height:500px;opacity:0"><div class="eti-b" style="position:absolute;bottom:230px;width:230px;text-align:center;font-size:44px;font-weight:850;color:${C.texto}">${t.l.uno}</div><div class="barra-v b0" style="height:210px;background:${C.necesidades}"></div></div>
          <div class="col col-1" style="position:absolute;right:40px;bottom:0;width:230px;height:500px;opacity:0"><div class="eti-b e1" style="position:absolute;bottom:230px;width:230px;text-align:center;font-size:44px;font-weight:850;color:${C.ahorro}">${t.l.doble}</div><div class="barra-v b1" style="height:210px;background:${C.ahorro}"></div></div>
        </div>
        <div style="display:flex;justify-content:space-between;width:620px;margin:16px auto 0;font-size:34px;font-weight:750;text-align:center">
          <span style="width:310px">${t.l.metodos[0]}</span><span style="width:310px">${t.l.metodos[1]}</span></div>
        <div style="text-align:center;margin-top:26px;font-size:28px;color:${C.suave};font-weight:600">${t.l.puja} · ${t.l.fuente2}</div>`,
      anim: function (s, e, el) {
        const m = e.seg[0].marcas, md = e.seg[1].marcas[0];
        [0, 1].forEach(i => { const c = el.querySelector('.col-' + i), p = sale(tramo(s, m[i], m[i] + 0.5)); c.style.opacity = p; c.style.transform = 'translateY(' + ((1 - p) * 40) + 'px)'; });
        const g = sale(tramo(s, md, md + 0.9)), h = 210 + 200 * g;
        el.querySelector('.b1').style.height = h + 'px';
        const e1 = el.querySelector('.e1'); e1.style.bottom = (h + 20) + 'px'; e1.style.opacity = tramo(s, md + 0.3, md + 0.8);
      }
    },
    // 3 · Bucle 1: la solución ya está en tu bolsillo (el móvil).
    bucle((t) => t.l.loco, (t) => `${icono('movil', C.acento, 150)}<div style="font-size:44px;font-weight:850;color:${C.acento};margin-top:10px">${t.l.bolsillo}</div>`),
    // 4 · Cuerpo 2: un límite a la tarjeta de los caprichos; cuando se acaba, se acaba.
    {
      html: (t, lang) => { const n = N[lang]; return `<div class="panel" style="opacity:0">
        <div style="display:flex;justify-content:space-between;align-items:baseline"><span style="font-size:30px;font-weight:750;letter-spacing:.12em;color:${C.suave}">${t.l.limite}</span><span style="font-size:64px;font-weight:850">${din(n.limite, lang)}</span></div>
        <div style="margin-top:20px;height:64px;border-radius:20px;background:rgba(148,163,184,.14);overflow:hidden"><div class="relleno" style="height:100%;width:0;background:${C.caprichos};border-radius:20px"></div></div>
        <div style="margin-top:26px">${n.compras.map(([x, v], i) => `<div class="fila-compra compra-${i}"><span style="color:${C.texto}">${x}</span><span>−${din(v, lang)}</span></div>`).join('')}</div>
        <div style="text-align:center;margin-top:40px"><div class="sello seacabo" style="opacity:0;border-color:${ROJO};color:${ROJO}">${t.l.seacabo}</div></div></div>`; },
      anim: function (s, e, el) {
        const m0 = e.seg[0].marcas[0], fin = e.seg[1].marcas[0], panel = el.querySelector('.panel');
        panel.style.opacity = sale(tramo(s, m0, m0 + 0.5));
        let gastado = 0;
        D.compras.forEach(([, v], i) => {
          const a = lerp(m0 + 0.7, fin - 0.4, i / (D.compras.length - 1)), p = sale(tramo(s, a, a + 0.35));
          const f = el.querySelector('.compra-' + i); f.style.opacity = p; f.style.transform = 'translateX(' + ((1 - p) * 40) + 'px)';
          gastado += v * p;
        });
        const r = el.querySelector('.relleno'); r.style.width = (100 * gastado / D.limite) + '%'; r.style.background = gastado >= D.limite - 0.01 ? '#e66767' : '#c27c0e';
        const q = rebote(tramo(s, fin + 0.1, fin + 0.55)), st = el.querySelector('.seacabo');
        st.style.opacity = Math.min(1, q * 1.5); st.style.transform = 'rotate(-5deg) scale(' + (1.8 - 0.8 * q) + ')';
      }
    },
    // 5 · Bucle 2: el truco más tonto está a dos toques.
    bucle((t) => t.l.truco, (t) => `<div style="font-size:74px;font-weight:850;color:${C.acento};white-space:nowrap">${t.l.toques}</div>`),
    // 6 · Final: la notificación de cada pago devuelve el dolor (la aguja vuelve a moverse).
    {
      html: (t, lang) => `<div style="position:relative;height:900px">
        <div style="position:absolute;left:10px;top:20px;width:400px;height:760px;border-radius:60px;border:10px solid #33415c;background:#0b1222">
          <div style="width:130px;height:30px;border-radius:15px;background:#33415c;margin:18px auto 0"></div>
          <div class="aviso" style="position:absolute;left:16px;right:16px;top:70px;background:rgba(241,245,249,.95);border-radius:26px;padding:20px 22px;opacity:0;color:#0f172a">
            <div style="display:flex;align-items:center;gap:12px;font-size:22px;font-weight:700;color:#475569"><span style="width:34px;height:34px;border-radius:9px;background:${C.necesidades};display:inline-block"></span>${t.l.banco}</div>
            <div style="font-size:28px;font-weight:750;margin-top:10px;line-height:1.25">${t.l.pago(din(4.5, lang, 2))}</div></div>
          <svg class="ondas" viewBox="0 0 400 300" width="400" height="300" style="position:absolute;left:-10px;top:200px;opacity:0"><circle cx="200" cy="150" r="60" fill="none" stroke="${C.acento}" stroke-width="5" class="o0"/><circle cx="200" cy="150" r="60" fill="none" stroke="${C.acento}" stroke-width="5" class="o1"/></svg>
        </div>
        <div style="position:absolute;right:0;top:200px;width:460px;text-align:center">
          <div style="font-size:24px;font-weight:750;letter-spacing:.12em;color:${C.suave}">${t.l.dolor}</div>
          <svg viewBox="0 0 460 250" width="460" height="250" style="margin-top:10px">${medidor(230, 220, 180, 36)}</svg>
        </div></div>`,
      anim: function (s, e, el) {
        const m = e.seg[0].marcas, av = el.querySelector('.aviso'), p = sale(tramo(s, m[0] + 0.5, m[0] + 1.0));
        av.style.opacity = p; av.style.transform = 'translateY(' + ((1 - p) * -60) + 'px)';
        const on = el.querySelector('.ondas'); on.style.opacity = s > m[0] + 0.5 ? 1 : 0;
        [0, 1].forEach(i => { const c = ((s - m[0] - 0.5) * 0.8 + i * 0.5) % 1; const o = el.querySelector('.o' + i); o.setAttribute('r', 60 + c * 120); o.setAttribute('opacity', s > m[0] + 0.5 ? (1 - c) * 0.8 : 0); });
        const golpe = tramo(s, m[1], m[1] + 0.9);
        aguja(el, pasos(s, [[0, 0.06], [m[1], 0.55]], 0.4) + Math.sin(golpe * Math.PI * 5) * 0.06 * (1 - golpe));
      }
    },
    // 7 · Cierre: monedas al tarro.
    cierreCon('tarro')
  ],
  texto: {
    en: `Your card has a superpower: it makes spending not hurt. 💳💤

Paying cash hurts a little. You watch the bills leave. With a card it's a beep, and with your phone not even that. Economists call it "the pain of paying" (Prelec & Loewenstein, 1998).

The wild part: in an MIT experiment, people bid on basketball tickets. Those told they'd pay by card bid almost twice as much as those paying cash, for the same tickets (Prelec & Simester, 2001).

The fix isn't going back to cash. Give your card a little pain back: put a limit on the card you use for fun stuff, right in your bank's app. When it's gone, it's gone.

And the dumbest trick of all: turn on a notification for every payment. That little ping is the pain your card was missing.

Do you get a ping for every payment, or is your card on silent? 👇

Education, not financial advice.

#personalfinance #moneytips #spending #budgeting #financialliteracy`,
    es: `Tu tarjeta tiene un superpoder: hace que gastar no duela. 💳💤

Pagar en efectivo duele un poco. Ves cómo se van los billetes. Con la tarjeta es un pitido, y con el móvil ni eso. Los economistas lo llaman «el dolor de pagar» (Prelec y Loewenstein, 1998).

Lo curioso: en un experimento del MIT subastaron entradas de baloncesto. Quienes iban a pagar con tarjeta pujaron casi el doble que quienes pagaban en efectivo, por las mismas entradas (Prelec y Simester, 2001).

La solución no es volver al efectivo. Devuélvele un poco de dolor a la tarjeta: ponle un límite a la tarjeta de los caprichos desde la app de tu banco. Cuando se acaba, se acaba.

Y el truco más tonto de todos: activa la notificación de cada pago. Ese pitido es el dolor que le faltaba a tu tarjeta.

¿Te llega un aviso con cada pago o tu tarjeta va en silencio? 👇

Educación financiera, no asesoramiento.

#finanzaspersonales #ahorro #dinero #educacionfinanciera #consejosdedinero`
  }
};
