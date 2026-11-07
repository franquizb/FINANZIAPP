// Reel: cómo bajar tus facturas fijas en una tarde (móvil, internet, seguros).
const { C, din, fila, lista, tarjetasIconos, cita, cifra, cierre, CIERRE, cuadra } = require('./_comun');

// Ahorro mensual de ejemplo por factura.
const AHORRO = { en: [15, 20, 25], es: [10, 15, 20] };
const mes = (l) => AHORRO[l].reduce((a, b) => a + b, 0);
cuadra('facturas en', [mes('en'), mes('en') * 12].join(), '60,720');
cuadra('facturas es', [mes('es'), mes('es') * 12].join(), '45,540');

const T = {
  en: {
    kicker: 'SAVE MONEY',
    e1: ['Lower your fixed bills <span class="c">in one afternoon</span>', 'A few calls. Less money gone every month.', ['Phone', 'Internet', 'Insurance']],
    e2: ['Before you call', ['Have your bill at hand and know what you pay today', 'Look up what new customers pay, there and at competitors', 'Check when your contract or promo ends']],
    e3: ['What to <span class="c">say</span>', '“I’ve been with you for a few years and I’ve seen better prices. Do you have a better plan for me? If not, I’m thinking of switching.”', 'If they say no, compare and switch. It’s often easier than it looks.'],
    e4: ['What it can <span class="c">add up to</span>', ['Phone', 'Internet', 'Insurance'], (n) => `−$${n}/mo`, 'a year, for one afternoon of calls'],
    e5: ['Do it once a year', ['Set a reminder for the day each promo ends', 'Ask every year: prices for new customers change', 'Bundle only if the total really goes down'], 'Example savings; they vary by provider. Education, not financial advice.'],
    cierre: CIERRE.en
  },
  es: {
    kicker: 'AHORRO',
    e1: ['Baja tus facturas fijas <span class="c">en una tarde</span>', 'Unas pocas llamadas. Menos dinero que se va cada mes.', ['Móvil', 'Internet', 'Seguros']],
    e2: ['Antes de llamar', ['Ten a mano tu factura y lo que pagas hoy', 'Mira cuánto pagan los clientes nuevos, en tu compañía y en otras', 'Comprueba cuándo acaba tu permanencia o tu oferta']],
    e3: ['Qué <span class="c">decir</span>', '«Llevo unos años con vosotros y he visto precios mejores. ¿Tenéis una tarifa mejor para mí? Si no, estoy pensando en cambiarme.»', 'Si te dicen que no, compara y cámbiate. Suele ser más fácil de lo que parece.'],
    e4: ['Lo que puede <span class="c">sumar</span>', ['Móvil', 'Internet', 'Seguro'], (n) => `−${n} €/mes`, 'al año, por una tarde de llamadas'],
    e5: ['Repítelo una vez al año', ['Pon un aviso el día que acaba cada oferta', 'Pregunta cada año: los precios para clientes nuevos cambian', 'Junta servicios solo si el total baja de verdad'], 'Ahorros de ejemplo; dependen de cada compañía. Educación financiera, no asesoramiento.'],
    cierre: CIERRE.es
  }
};

module.exports = {
  slug: 'bajar-facturas',
  T,
  duraciones: [4.5, 6, 6.5, 6.5, 6, 3.6],
  escenas: [
    (t) => `<h1 class="a">${t.e1[0]}</h1><p class="lead a">${t.e1[1]}</p>${tarjetasIconos([['movil', t.e1[2][0]], ['pantalla', t.e1[2][1]], ['escudo', t.e1[2][2]]])}`,
    (t) => `<h1 class="a">${t.e2[0]}</h1>${lista(t.e2[1])}`,
    (t) => `<h1 class="a">${t.e3[0]}</h1>${cita(t.e3[1])}<p class="lead a" style="margin-top:36px">${t.e3[2]}</p>`,
    (t, lang) => `<h1 class="a">${t.e4[0]}</h1>
      ${AHORRO[lang].map((n, i) => fila(t.e4[1][i], t.e4[2](n), n / Math.max(...AHORRO[lang]) * 100, C.necesidades, n)).join('')}
      ${cifra(din(mes(lang) * 12, lang), mes(lang) * 12, t.e4[3])}`,
    (t) => `<h1 class="a">${t.e5[0]}</h1>${lista(t.e5[1])}<p class="nota a" style="font-size:28px;margin-top:30px">${t.e5[2]}</p>`,
    cierre
  ],
  texto: {
    en: `Lower your fixed bills in one afternoon. 📞

Start with the bills that renew on their own: phone, internet and insurance.

Before you call: have your bill at hand, look up what new customers pay (with your provider and with competitors) and check when your contract or promo ends.

What to say: "I've been with you for a few years and I've seen better prices. Do you have a better plan for me? If not, I'm thinking of switching." If they say no, compare and switch. It's often easier than it looks.

What it can add up to: $15 less on your phone, $20 on internet and $25 on insurance is $${mes('en')} a month, or ${din(mes('en') * 12, 'en')} a year, for one afternoon of calls.

Do it once a year: set a reminder for the day each promo ends, because prices for new customers keep changing.

Example savings; they vary by provider. Education, not financial advice.

#savemoney #bills #budgeting #personalfinance #moneytips`,
    es: `Baja tus facturas fijas en una tarde. 📞

Empieza por las que se renuevan solas: móvil, internet y seguros.

Antes de llamar: ten a mano tu factura, mira cuánto pagan los clientes nuevos (en tu compañía y en otras) y comprueba cuándo acaba tu permanencia o tu oferta.

Qué decir: «Llevo unos años con vosotros y he visto precios mejores. ¿Tenéis una tarifa mejor para mí? Si no, estoy pensando en cambiarme». Si te dicen que no, compara y cámbiate. Suele ser más fácil de lo que parece.

Lo que puede sumar: 10 € menos en el móvil, 15 € en internet y 20 € en el seguro son ${mes('es')} € al mes, o ${din(mes('es') * 12, 'es')} al año, por una tarde de llamadas.

Repítelo una vez al año: pon un aviso el día que acaba cada oferta, porque los precios para clientes nuevos cambian.

Ahorros de ejemplo; dependen de cada compañía. Educación financiera, no asesoramiento.

#ahorro #facturas #finanzaspersonales #presupuesto #consejosdedinero`
  }
};
