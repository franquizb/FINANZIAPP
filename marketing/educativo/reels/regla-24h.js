// Reel: la regla de las 24 horas contra las compras por impulso.
const { C, icono, din, lista, listaIconos, cifra, cierre, CIERRE, cuadra } = require('./_comun');

const SEMANA = 25;                 // compras por impulso que se evitan a la semana (ejemplo)
const ANUAL = SEMANA * 52;
cuadra('regla-24h anual', ANUAL, 1300);

const T = {
  en: {
    kicker: 'MONEY HABITS',
    e1: ['Want it? <span class="c">Wait 24 hours.</span>', 'The simplest trick against impulse buys.', 'before you buy'],
    e2: ['How it works', ['You see something you want, not something you need', 'Save it to a list or leave it in the cart, and close the app', 'Tomorrow, if you still want it and it fits your budget, buy it']],
    e3: ['Why it <span class="c">works</span>', [['reloj', 'The urge cools down', 'Wanting is strongest in the moment'], ['lupa', 'You compare', 'and often find it cheaper, or better'], ['brujula', 'You decide, not the ad', 'Is this where I want my money to go?']]],
    e4: ['If it stops just <span class="c">$25 a week</span>…', `$25 × 52 weeks =`, 'a year that stays with you'],
    e5: ['Make it stick', ['For anything over $100, wait 7 days', 'Unsubscribe from store emails', 'Remove saved cards from shopping apps'], 'Example figures. Education, not financial advice.'],
    cierre: CIERRE.en
  },
  es: {
    kicker: 'HÁBITOS FINANCIEROS',
    e1: ['¿Lo quieres? <span class="c">Espera 24 horas.</span>', 'El truco más sencillo contra las compras por impulso.', 'antes de comprar'],
    e2: ['Cómo funciona', ['Ves algo que quieres, no algo que necesitas', 'Guárdalo en una lista o déjalo en el carrito, y cierra la app', 'Mañana, si aún lo quieres y cabe en tu presupuesto, cómpralo']],
    e3: ['Por qué <span class="c">funciona</span>', [['reloj', 'Las ganas se enfrían', 'El impulso es más fuerte en el momento'], ['lupa', 'Comparas', 'y a menudo lo encuentras más barato, o mejor'], ['brujula', 'Decides tú, no el anuncio', '¿Es aquí donde quiero que vaya mi dinero?']]],
    e4: ['Si te frena solo <span class="c">25 € a la semana</span>…', '25 € × 52 semanas =', 'al año que se quedan contigo'],
    e5: ['Para que funcione', ['Si cuesta más de 100 €, espera 7 días', 'Date de baja de los correos de tiendas', 'Quita las tarjetas guardadas en las apps de compras'], 'Cifras de ejemplo. Educación financiera, no asesoramiento.'],
    cierre: CIERRE.es
  }
};

module.exports = {
  slug: 'regla-24h',
  T,
  duraciones: [4.5, 6, 6.5, 5, 6, 3.6],
  escenas: [
    (t) => `<h1 class="a">${t.e1[0]}</h1><p class="lead a">${t.e1[1]}</p>
      <div class="tarjeta a" style="margin-top:56px;display:flex;align-items:center;gap:40px;padding:48px 52px">
        <span style="flex:0 0 auto;width:160px;height:160px;border-radius:42px;background:rgba(15,159,143,.15);display:inline-flex;align-items:center;justify-content:center">${icono('reloj', C.acento, 96)}</span>
        <div><div class="grande-num" style="color:${C.acento}">24 h</div><div style="font-size:34px;color:${C.suave};font-weight:600;margin-top:12px">${t.e1[2]}</div></div></div>`,
    (t) => `<h1 class="a">${t.e2[0]}</h1>${lista(t.e2[1])}`,
    (t) => `<h1 class="a">${t.e3[0]}</h1>${listaIconos(t.e3[1])}`,
    (t, lang) => `<h1 class="a">${t.e4[0]}</h1><p class="lead a">${t.e4[1]}</p>${cifra(din(ANUAL, lang), ANUAL, t.e4[2])}`,
    (t) => `<h1 class="a">${t.e5[0]}</h1>${lista(t.e5[1])}<p class="nota a" style="font-size:28px;margin-top:30px">${t.e5[2]}</p>`,
    cierre
  ],
  texto: {
    en: `Want it? Wait 24 hours. ⏳

The 24-hour rule is simple: when you want something you don't need, don't buy it right away. Save it to a list or leave it in the cart, close the app and come back tomorrow. If you still want it and it fits your budget, go ahead and enjoy it.

Why it works: the urge to buy is strongest in the moment and cools down fast. A day gives you time to compare prices and to ask yourself if this is really where you want your money to go.

The numbers: if the rule stops just $25 a week of impulse buys, that's ${din(ANUAL, 'en')} a year that stays with you.

Make it stick: wait 7 days for anything over $100, unsubscribe from store emails and remove saved cards from shopping apps.

What's the last thing you bought on impulse? 👇

Example figures. Education, not financial advice.

#impulsebuying #savingmoney #personalfinance #moneyhabits #budgeting`,
    es: `¿Lo quieres? Espera 24 horas. ⏳

La regla de las 24 horas es sencilla: cuando quieras algo que no necesitas, no lo compres en el momento. Guárdalo en una lista o déjalo en el carrito, cierra la app y vuelve mañana. Si aún lo quieres y cabe en tu presupuesto, adelante, disfrútalo.

Por qué funciona: las ganas de comprar son más fuertes en el momento y se enfrían rápido. Un día te da tiempo para comparar precios y para preguntarte si es ahí donde quieres que vaya tu dinero.

Las cuentas: si la regla te frena solo 25 € a la semana en compras por impulso, son ${din(ANUAL, 'es')} al año que se quedan contigo.

Para que funcione: si cuesta más de 100 €, espera 7 días; date de baja de los correos de tiendas y quita las tarjetas guardadas en las apps de compras.

¿Qué es lo último que compraste por impulso? 👇

Cifras de ejemplo. Educación financiera, no asesoramiento.

#comprasporimpulso #ahorro #finanzaspersonales #habitosfinancieros #presupuesto`
  }
};
