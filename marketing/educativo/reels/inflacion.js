// Reel: qué podrás comprar con 100 dentro de 20 años (inflación del 3% anual, ejemplo).
const { C, din, fila, lista, dos, cierre, CIERRE, cuadra } = require('./_comun');

const INF = 0.03;
const poder = (anios) => 100 / Math.pow(1 + INF, anios);              // lo que compran 100 de hoy
const precio = (anios) => 100 * Math.pow(1 + INF, anios);             // lo que cuesta lo que hoy vale 100
const real = (interes) => 100 * Math.pow((1 + interes) / (1 + INF), 20);
// Las cifras que se citan en el texto y en las escenas salen de estas fórmulas.
cuadra('poder 20', Math.round(poder(20)), 55);
cuadra('precio 20', Math.round(precio(20)), 181);
cuadra('real 4%', Math.round(real(0.04)), 121);

const T = {
  en: {
    kicker: 'MONEY BASICS',
    e1: ['What will <span class="c">$100</span> buy in 20 years?', 'A 30-second look at inflation.'],
    e2: ['Prices rise a little <span class="c">every year</span>', 'That’s inflation. At 3% a year, what costs $100 today costs:', ['Today', 'In 10 years', 'In 20 years']],
    e3: ['So your $100 buys <span class="c">less and less</span>', 'What $100 kept in cash will buy, in today’s money:'],
    e4: ['What protects it: interest that <span class="c">beats inflation</span>', 'What $100 is worth in 20 years, in today’s money, if it earns:', ['0% (cash at home)', '2% a year', '3% a year', '4% a year']],
    e5: ['What you can do', [['Keep your emergency fund where it earns interest'], ['Invest money you won’t need for 5+ years'], ['Review your plan once a year']], 'Example with 3% yearly inflation. Real inflation varies. Education, not financial advice.'],
    cierre: CIERRE.en
  },
  es: {
    kicker: 'FINANZAS BÁSICAS',
    e1: ['¿Qué podrás comprar con <span class="c">100 €</span> dentro de 20 años?', 'La inflación, en 30 segundos.'],
    e2: ['Los precios suben un poco <span class="c">cada año</span>', 'Eso es la inflación. Al 3% anual, lo que hoy cuesta 100 € costará:', ['Hoy', 'En 10 años', 'En 20 años']],
    e3: ['Así que tus 100 € compran <span class="c">cada vez menos</span>', 'Lo que comprarán 100 € guardados en casa, en dinero de hoy:'],
    e4: ['Lo que lo protege: un interés que <span class="c">gane a la inflación</span>', 'Lo que valdrán 100 € dentro de 20 años, en dinero de hoy, si rinden:', ['0% (en casa)', '2% al año', '3% al año', '4% al año']],
    e5: ['Qué puedes hacer', [['Guarda tu fondo de emergencia donde genere interés'], ['Invierte el dinero que no vayas a necesitar en 5+ años'], ['Revisa tu plan una vez al año']], 'Ejemplo con una inflación del 3% anual. La inflación real varía. Educación financiera, no asesoramiento.'],
    cierre: CIERRE.es
  }
};


module.exports = {
  slug: 'inflacion',
  T,
  duraciones: [4.5, 5.5, 5.5, 6.5, 6, 3.6],
  escenas: [
    (t, lang) => `<h1 class="a">${t.e1[0]}</h1><p class="lead a">${t.e1[1]}</p>
      ${dos([t.e2[2][0], din(100, lang)], [t.e2[2][2], '?'])}`,
    (t, lang) => `<h1 class="a">${t.e2[0]}</h1><p class="lead a">${t.e2[1]}</p>
      <div class="tarjeta a" style="margin-top:40px">${[0, 10, 20].map((a, i) => fila(t.e2[2][i], din(precio(a), lang), precio(a) / precio(20) * 100, '#e66767', precio(a))).join('').replace(/class="a" /g, '')}</div>`,
    (t, lang) => `<h1 class="a">${t.e3[0]}</h1><p class="lead a">${t.e3[1]}</p>
      ${[0, 10, 20].map((a, i) => fila(t.e2[2][i], din(poder(a), lang), poder(a), C.necesidades, poder(a))).join('')}`,
    (t, lang) => `<h1 class="a">${t.e4[0]}</h1><p class="lead a">${t.e4[1]}</p>
      ${[0, 0.02, 0.03, 0.04].map((r, i) => fila(t.e4[2][i], din(real(r), lang), real(r) / real(0.04) * 100, r < INF ? C.suave : r === INF ? C.necesidades : C.acento, real(r))).join('')}`,
    (t) => `<h1 class="a">${t.e5[0]}</h1>${lista(t.e5[1].map(([x]) => x))}
      <p class="nota a" style="font-size:28px;margin-top:30px">${t.e5[2]}</p>`,
    cierre
  ],
  texto: {
    en: `What will $100 buy in 20 years? 💸

Inflation is the slow rise in prices over time. At 3% a year, something that costs $100 today costs about ${din(precio(10), 'en')} in 10 years and ${din(precio(20), 'en')} in 20.

Flip it around: $100 kept in cash will buy what ${din(poder(10), 'en')} buys today in 10 years, and what ${din(poder(20), 'en')} buys in 20. That's why money that sits still slowly loses value.

What protects it is interest that beats inflation. After 20 years, in today's money, $100 earning 2% a year is worth about ${din(real(0.02), 'en')}; at 3% it keeps pace (${din(real(0.03), 'en')}); at 4% it gets ahead (${din(real(0.04), 'en')}).

What you can do: keep your emergency fund in an account that pays interest, invest money you won't need for 5+ years, and review your plan once a year.

Example with 3% yearly inflation; real inflation varies. Education, not financial advice.

#inflation #personalfinance #moneytips #financialliteracy #savingmoney`,
    es: `¿Qué podrás comprar con 100 € dentro de 20 años? 💸

La inflación es la subida lenta de los precios con el tiempo. Al 3% anual, lo que hoy cuesta 100 € costará unos ${din(precio(10), 'es')} dentro de 10 años y ${din(precio(20), 'es')} dentro de 20.

Dicho al revés: 100 € guardados en casa comprarán dentro de 10 años lo que hoy compran ${din(poder(10), 'es')}, y dentro de 20, lo que hoy compran ${din(poder(20), 'es')}. Por eso el dinero parado pierde valor poco a poco.

Lo que lo protege es un interés que gane a la inflación. Dentro de 20 años, en dinero de hoy, 100 € que rinden un 2% anual valen unos ${din(real(0.02), 'es')}; al 3% mantienen su valor (${din(real(0.03), 'es')}); al 4% lo superan (${din(real(0.04), 'es')}).

Qué puedes hacer: guarda tu fondo de emergencia en una cuenta que genere interés, invierte el dinero que no vayas a necesitar en 5 años o más y revisa tu plan una vez al año.

Ejemplo con una inflación del 3% anual; la inflación real varía. Educación financiera, no asesoramiento.

#inflacion #finanzaspersonales #ahorro #educacionfinanciera #dinero`
  }
};
