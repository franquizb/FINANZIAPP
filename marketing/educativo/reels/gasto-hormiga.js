// Reel: los gastos hormiga (pequeños gastos diarios que suman mucho en un año).
const { C, din, fila, lista, listaIconos, dos, cierre, CIERRE, cuadra } = require('./_comun');

const DIARIO = { en: [3, 5, 10], es: [2, 4, 8] };
const anual = (d) => d * 365;
cuadra('hormiga en', DIARIO.en.map(anual).join(), '1095,1825,3650');
cuadra('hormiga es', DIARIO.es.map(anual).join(), '730,1460,2920');

const T = {
  en: {
    kicker: 'MONEY HABITS',
    e1: ['<span class="c">$5 a day</span> doesn’t sound like much…', 'Until you add up a whole year.', ['A day', 'A year']],
    e2: ['Small spends, <span class="c">big totals</span>', 'What a small daily habit costs in a year:', (d) => `$${d} a day`],
    e3: ['Where they <span class="c">hide</span>', [['cubiertos', 'Coffee and snacks on the go'], ['movil', 'Delivery fees and tips'], ['bolsa', 'Little online buys'], ['pantalla', 'Apps and in-game purchases']]],
    e4: ['Find yours <span class="c">in one week</span>', ['For 7 days, write down every small spend', 'Circle the ones you wouldn’t miss', 'Cut one, and move that money to savings automatically'], 'It’s not about cutting everything: keep the ones that make you happy. Example figures. Education, not financial advice.'],
    cierre: CIERRE.en
  },
  es: {
    kicker: 'HÁBITOS FINANCIEROS',
    e1: ['<span class="c">4 € al día</span> no parece mucho…', 'Hasta que sumas un año entero.', ['Al día', 'Al año']],
    e2: ['Gastos hormiga, <span class="c">totales gigantes</span>', 'Lo que cuesta en un año un pequeño hábito diario:', (d) => `${d} € al día`],
    e3: ['Dónde se <span class="c">esconden</span>', [['cubiertos', 'Cafés y snacks para llevar'], ['movil', 'Gastos de envío y propinas a domicilio'], ['bolsa', 'Pequeñas compras online'], ['pantalla', 'Apps y compras dentro de juegos']]],
    e4: ['Encuentra los tuyos <span class="c">en una semana</span>', ['Durante 7 días, apunta cada gasto pequeño', 'Rodea los que no echarías de menos', 'Recorta uno y pasa ese dinero al ahorro de forma automática'], 'No se trata de quitarlo todo: quédate con los que te hacen feliz. Cifras de ejemplo. Educación financiera, no asesoramiento.'],
    cierre: CIERRE.es
  }
};

module.exports = {
  slug: 'gasto-hormiga',
  T,
  duraciones: [4.5, 6, 6, 7, 3.6],
  escenas: [
    (t, lang) => `<h1 class="a">${t.e1[0]}</h1><p class="lead a">${t.e1[1]}</p>
      ${dos([t.e1[2][0], din(DIARIO[lang][1], lang)], [t.e1[2][1], '?'])}`,
    (t, lang) => `<h1 class="a">${t.e2[0]}</h1><p class="lead a">${t.e2[1]}</p>
      ${DIARIO[lang].map(d => fila(t.e2[2](d), din(anual(d), lang), anual(d) / anual(DIARIO[lang][2]) * 100, C.caprichos, anual(d))).join('')}`,
    (t) => `<h1 class="a">${t.e3[0]}</h1>${listaIconos(t.e3[1], C.caprichos)}`,
    (t) => `<h1 class="a">${t.e4[0]}</h1>${lista(t.e4[1])}<p class="nota a" style="font-size:28px;margin-top:30px">${t.e4[2]}</p>`,
    cierre
  ],
  texto: {
    en: `$5 a day doesn't sound like much… until you add up a year. 🐜

Small daily spends are easy to miss because each one feels tiny. Over a year: $3 a day is ${din(anual(3), 'en')}, $5 a day is ${din(anual(5), 'en')} and $10 a day is ${din(anual(10), 'en')}.

Where they usually hide: coffee and snacks on the go, delivery fees and tips, little online buys, and apps or in-game purchases.

Find yours in one week: for 7 days, write down every small spend. Circle the ones you wouldn't miss, cut one, and move that money to savings automatically. It's not about cutting everything: keep the ones that make you happy.

Which small spend surprises you most when you add it up? 👇

Example figures. Education, not financial advice.

#savingmoney #moneyhabits #budgeting #personalfinance #frugalliving`,
    es: `4 € al día no parece mucho… hasta que sumas un año. 🐜

Los gastos hormiga pasan desapercibidos porque cada uno parece pequeño. En un año: 2 € al día son ${din(anual(2), 'es')}, 4 € al día son ${din(anual(4), 'es')} y 8 € al día son ${din(anual(8), 'es')}.

Dónde suelen esconderse: cafés y snacks para llevar, gastos de envío y propinas a domicilio, pequeñas compras online y apps o compras dentro de juegos.

Encuéntralos en una semana: durante 7 días, apunta cada gasto pequeño. Rodea los que no echarías de menos, recorta uno y pasa ese dinero al ahorro de forma automática. No se trata de quitarlo todo: quédate con los que te hacen feliz.

¿Cuál es el gasto hormiga que más te sorprende al sumarlo? 👇

Cifras de ejemplo. Educación financiera, no asesoramiento.

#gastoshormiga #ahorro #finanzaspersonales #presupuesto #habitosfinancieros`
  }
};
