// Semana 1 de consejos de ahorro para TikTok, Reels e Instagram (EN y ES).
// Cada consejo: gancho, 3 pasos, la cuenta que lo demuestra (`prueba`), la
// captura de la app que se enseña al final y el texto de la publicación.
// Las cifras de `prueba` y de los textos salen de cálculos sencillos que se
// explican en el propio texto; el interés compuesto se calcula en consejos.js.
// Inglés en dólares (EE. UU.) y español en euros (España).

const HASH_EN = ['#moneytips', '#personalfinance', '#savingmoney', '#budgeting', '#financetok'];
const HASH_ES = ['#ahorro', '#finanzaspersonales', '#consejosdedinero', '#presupuesto', '#educacionfinanciera'];

module.exports = [
  {
    slug: 'regla-24-horas', app: 'w-top-gastos.png',
    en: {
      kicker: 'MONEY TIP #1',
      gancho: ['Stop impulse buys', 'with the <em>24-hour rule</em>'],
      pasos: ['See something you want? Add it to a list', 'Wait 24 hours (48 if it’s over $100)', 'Still want it? Buy it guilt-free'],
      prueba: { cifra: '$1,300', texto: 'a year back in your pocket if you skip just $25 a week of impulse buys' },
      cta: 'See where your money really goes',
      texto: `Most impulse buys don't survive 24 hours. ⏳

Here's the rule:
1️⃣ See something you want? Don't buy it yet. Add it to a list.
2️⃣ Wait 24 hours (48 for anything over $100).
3️⃣ Still want it? Buy it, guilt-free.

The math: skipping just $25 a week of impulse purchases = $25 × 52 weeks = $1,300 a year.

Try it today: start a "wait list" in your notes app.

📊 See where your money really goes with FinanziApp. Free for 15 days, no card needed. Link in bio.`,
      hashtags: [...HASH_EN, '#impulsebuying', '#frugalliving']
    },
    es: {
      kicker: 'CONSEJO #1',
      gancho: ['Frena las compras', 'impulsivas: <em>regla de 24 h</em>'],
      pasos: ['¿Quieres algo? Apúntalo en una lista', 'Espera 24 horas (48 si pasa de 100 €)', '¿Lo sigues queriendo? Cómpralo sin culpa'],
      prueba: { cifra: '1.300 €', texto: 'al año si dejas de gastar solo 25 € a la semana en caprichos' },
      cta: 'Mira en qué se va tu dinero',
      texto: `La mayoría de las compras impulsivas no aguantan 24 horas. ⏳

La regla:
1️⃣ ¿Ves algo que quieres? No lo compres todavía: apúntalo en una lista.
2️⃣ Espera 24 horas (48 si cuesta más de 100 €).
3️⃣ ¿Lo sigues queriendo? Cómpralo sin culpa.

Las cuentas: dejar de gastar solo 25 € a la semana en caprichos = 25 € × 52 semanas = 1.300 € al año.

Pruébalo hoy: crea una "lista de espera" en las notas del móvil.

📊 Descubre en qué se va tu dinero con FinanziApp. Gratis 15 días, sin tarjeta. Enlace en la bio.`,
      hashtags: [...HASH_ES, '#comprasimpulsivas', '#ahorrardinero']
    }
  },
  {
    slug: 'suscripciones', app: 'w-categoria.png',
    en: {
      kicker: 'MONEY TIP #2',
      gancho: ['You’re probably paying', 'for <em>subscriptions you forgot</em>'],
      pasos: ['Search your bank app for “monthly”', 'List every subscription you pay', 'Cancel the ones you didn’t use this month'],
      prueba: { cifra: '$335', texto: 'a year saved by canceling just two forgotten $13.99 subscriptions' },
      cta: 'Track every recurring charge',
      texto: `Subscriptions are designed to be forgotten. 🔁

Do a 10-minute audit:
1️⃣ Open your bank app and search for "monthly" or "subscription".
2️⃣ List every recurring charge (streaming, apps, gym, cloud storage…).
3️⃣ Cancel anything you didn't use in the last 30 days.

The math: two forgotten $13.99 subscriptions = $27.98 a month = $335.76 a year.

Try it today: set a calendar reminder to repeat this every 3 months.

📊 Keep every recurring expense in one place with FinanziApp. Free for 15 days. Link in bio.`,
      hashtags: [...HASH_EN, '#subscriptions', '#moneysavingtips']
    },
    es: {
      kicker: 'CONSEJO #2',
      gancho: ['Seguro que pagas', '<em>suscripciones olvidadas</em>'],
      pasos: ['Busca “mensual” en la app de tu banco', 'Apunta todas las suscripciones que pagas', 'Cancela las que no usaste este mes'],
      prueba: { cifra: '335 €', texto: 'al año por cancelar solo dos suscripciones olvidadas de 13,99 €' },
      cta: 'Controla todos tus cargos fijos',
      texto: `Las suscripciones están pensadas para que te olvides de ellas. 🔁

Haz una revisión de 10 minutos:
1️⃣ Abre la app de tu banco y busca "mensual" o "suscripción".
2️⃣ Apunta todos los cargos fijos (series, apps, gimnasio, nube…).
3️⃣ Cancela lo que no hayas usado en los últimos 30 días.

Las cuentas: dos suscripciones olvidadas de 13,99 € = 27,98 € al mes = 335,76 € al año.

Pruébalo hoy: pon un recordatorio para repetirlo cada 3 meses.

📊 Ten todos tus gastos fijos en un solo sitio con FinanziApp. Gratis 15 días. Enlace en la bio.`,
      hashtags: [...HASH_ES, '#suscripciones', '#trucosdeahorro']
    }
  },
  {
    slug: 'regla-50-30-20', app: 'w-distribucion.png',
    en: {
      kicker: 'MONEY TIP #3',
      gancho: ['The simplest budget:', 'the <em>50/30/20 rule</em>'],
      pasos: ['50% of take-home pay: needs', '30%: wants', '20%: savings and paying off debt'],
      prueba: { cifra: '$600', texto: 'saved every month on a $3,000 take-home pay ($1,500 needs · $900 wants)' },
      cta: 'Set up your budget in minutes',
      texto: `If budgeting feels overwhelming, start here. 🧮

The 50/30/20 rule splits your take-home pay (after taxes) into:
1️⃣ 50% needs: rent, groceries, utilities, insurance, minimum debt payments.
2️⃣ 30% wants: eating out, shopping, trips, hobbies.
3️⃣ 20% savings: emergency fund, investing and extra debt payments.

The math: on a $3,000 monthly take-home pay → $1,500 needs, $900 wants, $600 savings. That's $7,200 saved in a year.

It's a starting point, not a law: adjust the numbers to your reality.

📊 Build your 50/30/20 budget in FinanziApp. Free for 15 days. Link in bio.`,
      hashtags: [...HASH_EN, '#503020rule', '#budgetingtips']
    },
    es: {
      kicker: 'CONSEJO #3',
      gancho: ['El presupuesto más fácil:', 'la <em>regla 50/30/20</em>'],
      pasos: ['50% de tu sueldo neto: necesidades', '30%: caprichos', '20%: ahorro y pagar deudas'],
      prueba: { cifra: '400 €', texto: 'ahorrados cada mes con un sueldo neto de 2.000 € (1.000 € necesidades · 600 € caprichos)' },
      cta: 'Monta tu presupuesto en minutos',
      texto: `Si hacer un presupuesto te agobia, empieza por aquí. 🧮

La regla 50/30/20 reparte tu sueldo neto (después de impuestos) en:
1️⃣ 50% necesidades: alquiler o hipoteca, comida, facturas, seguros, cuotas mínimas de deudas.
2️⃣ 30% caprichos: restaurantes, compras, viajes, aficiones.
3️⃣ 20% ahorro: fondo de emergencia, inversión y amortizar deudas.

Las cuentas: con un sueldo neto de 2.000 € al mes → 1.000 € necesidades, 600 € caprichos y 400 € de ahorro. Son 4.800 € ahorrados en un año.

Es un punto de partida, no una ley: ajusta los porcentajes a tu realidad.

📊 Crea tu presupuesto 50/30/20 en FinanziApp. Gratis 15 días. Enlace en la bio.`,
      hashtags: [...HASH_ES, '#regla503020', '#organizartudinero']
    }
  },
  {
    slug: 'pagate-primero', app: 'w-ahorro-mensual.png',
    en: {
      kicker: 'MONEY TIP #4',
      gancho: ['Save without thinking:', '<em>pay yourself first</em>'],
      pasos: ['Pick an amount you won’t miss', 'Automate a transfer on payday', 'Live on what’s left'],
      prueba: { cifra: '$2,600', texto: 'saved in a year by moving $100 every two weeks, automatically' },
      cta: 'Watch your savings grow every month',
      texto: `If you save "what's left at the end of the month", there's usually nothing left. 💸

Flip it:
1️⃣ Pick an amount you won't miss (even $25 works).
2️⃣ Set an automatic transfer to a separate savings account on payday.
3️⃣ Spend what's left, not the other way around.

The math: $100 every two weeks × 26 paychecks = $2,600 a year, without thinking about it.

Try it today: schedule the transfer for your next payday.

📊 Track your monthly savings rate in FinanziApp. Free for 15 days. Link in bio.`,
      hashtags: [...HASH_EN, '#payyourselffirst', '#automatesavings']
    },
    es: {
      kicker: 'CONSEJO #4',
      gancho: ['Ahorra sin pensarlo:', '<em>págate primero</em>'],
      pasos: ['Elige una cantidad que no vayas a echar de menos', 'Programa una transferencia el día de cobro', 'Vive con lo que queda'],
      prueba: { cifra: '1.200 €', texto: 'ahorrados en un año apartando 100 € cada mes de forma automática' },
      cta: 'Mira crecer tu ahorro cada mes',
      texto: `Si ahorras "lo que sobra a final de mes", casi nunca sobra nada. 💸

Dale la vuelta:
1️⃣ Elige una cantidad que no vayas a echar de menos (hasta 25 € sirven).
2️⃣ Programa una transferencia automática a otra cuenta el día que cobras.
3️⃣ Gasta lo que queda, y no al revés.

Las cuentas: 100 € al mes × 12 meses = 1.200 € al año, sin pensarlo.

Pruébalo hoy: programa la transferencia para tu próxima nómina.

📊 Sigue tu tasa de ahorro mensual en FinanziApp. Gratis 15 días. Enlace en la bio.`,
      hashtags: [...HASH_ES, '#pagatealprimero', '#ahorroautomatico']
    }
  },
  {
    slug: 'fondo-de-emergencia', app: 'w-salud.png',
    en: {
      kicker: 'MONEY TIP #5',
      gancho: ['How big should your', '<em>emergency fund</em> be?'],
      pasos: ['First goal: $1,000 for small surprises', 'Then: 3–6 months of essential expenses', 'Keep it separate, but easy to reach'],
      prueba: { cifra: '$7,500', texto: 'is 3 months of a $2,500/month budget, and $15,000 is 6 months' },
      cta: 'Check how many months you’re covered',
      texto: `An emergency fund turns a crisis into an inconvenience. 🛟

How to build it:
1️⃣ Start with a mini goal: $1,000 for small surprises (car repair, vet, a flight home).
2️⃣ Then aim for 3–6 months of essential expenses (rent, food, bills, insurance).
3️⃣ Keep it in a separate savings account: easy to reach, but not in your everyday card.

The math: if your essentials cost $2,500 a month → 3 months = $7,500, 6 months = $15,000.

Try it today: add up last month's essential expenses.

📊 FinanziApp shows how many months your emergency fund covers. Free for 15 days. Link in bio.`,
      hashtags: [...HASH_EN, '#emergencyfund', '#financialsecurity']
    },
    es: {
      kicker: 'CONSEJO #5',
      gancho: ['¿Cuánto debe tener tu', '<em>fondo de emergencia</em>?'],
      pasos: ['Primera meta: 1.000 € para imprevistos', 'Después: 3-6 meses de gastos básicos', 'Separado, pero fácil de usar'],
      prueba: { cifra: '5.400 €', texto: 'son 3 meses de gastos básicos de 1.800 €/mes, y 10.800 € son 6 meses' },
      cta: 'Mira cuántos meses tienes cubiertos',
      texto: `Un fondo de emergencia convierte una crisis en un simple contratiempo. 🛟

Cómo crearlo:
1️⃣ Empieza con una meta pequeña: 1.000 € para imprevistos (avería del coche, veterinario, un billete urgente).
2️⃣ Después, apunta a 3-6 meses de gastos básicos (vivienda, comida, facturas, seguros).
3️⃣ Guárdalo en una cuenta aparte: fácil de usar, pero fuera de tu tarjeta del día a día.

Las cuentas: si tus gastos básicos son 1.800 € al mes → 3 meses = 5.400 €, 6 meses = 10.800 €.

Pruébalo hoy: suma los gastos básicos del mes pasado.

📊 FinanziApp te dice cuántos meses cubre tu fondo de emergencia. Gratis 15 días. Enlace en la bio.`,
      hashtags: [...HASH_ES, '#fondodeemergencia', '#colchonfinanciero']
    }
  },
  {
    slug: 'cocinar-en-casa', app: 'w-comparativa.png',
    en: {
      kicker: 'MONEY TIP #6',
      gancho: ['One small swap,', '<em>$572 a year</em>'],
      pasos: ['Pick one takeout meal you buy every week', 'Cook it at home instead', 'Move the difference to savings'],
      prueba: { cifra: '$572', texto: 'a year: a $15 takeout lunch vs. $4 made at home, once a week' },
      cta: 'Compare your spending month by month',
      texto: `You don't need to give up everything. Swap one thing. 🍱

The swap:
1️⃣ Pick one takeout meal you buy every week.
2️⃣ Cook that one meal at home instead (batch it on Sunday).
3️⃣ Move the money you didn't spend straight into savings.

The math: a $15 takeout lunch vs. about $4 made at home = $11 saved a week × 52 = $572 a year. Do it twice a week and it's $1,144.

Try it today: choose your swap meal for this week.

📊 Compare what you spend each month in FinanziApp. Free for 15 days. Link in bio.`,
      hashtags: [...HASH_EN, '#mealprep', '#frugaltips']
    },
    es: {
      kicker: 'CONSEJO #6',
      gancho: ['Un cambio pequeño,', '<em>442 € al año</em>'],
      pasos: ['Elige una comida que pides fuera cada semana', 'Cocínala en casa', 'Pasa la diferencia al ahorro'],
      prueba: { cifra: '442 €', texto: 'al año: un menú de 12 € frente a 3,50 € hecho en casa, una vez por semana' },
      cta: 'Compara tus gastos mes a mes',
      texto: `No hace falta renunciar a todo. Cambia una sola cosa. 🍱

El cambio:
1️⃣ Elige una comida que compras fuera cada semana.
2️⃣ Prepárala en casa (cocina de más el domingo).
3️⃣ Pasa lo que no has gastado directamente al ahorro.

Las cuentas: un menú de 12 € frente a unos 3,50 € hecho en casa = 8,50 € a la semana × 52 = 442 € al año. Si lo haces dos veces por semana, 884 €.

Pruébalo hoy: elige tu comida "de casa" para esta semana.

📊 Compara lo que gastas cada mes en FinanziApp. Gratis 15 días. Enlace en la bio.`,
      hashtags: [...HASH_ES, '#tupperware', '#ahorrarencomida']
    }
  },
  {
    slug: 'interes-compuesto', app: 'w-calc-compuesto-grafico.png', compuesto: { mensual: 200, interes: 0.07, anios: 30 },
    en: {
      kicker: 'MONEY TIP #7',
      gancho: ['Why starting early', 'beats <em>investing more later</em>'],
      pasos: ['Invest a fixed amount every month', 'Let the returns earn returns', 'Give it time: decades, not months'],
      prueba: { cifra: '{total}', texto: 'from $200/month for 30 years at a 7% average yearly return. You put in {aportado}' },
      cta: 'Run your own numbers for free',
      texto: `Compound interest is returns earning returns, and time is its secret ingredient. ⏰

How it works:
1️⃣ Invest a fixed amount every month.
2️⃣ The returns get reinvested and start earning returns too.
3️⃣ The longer you leave it, the steeper the curve gets.

The math: $200 a month for 30 years at a 7% average yearly return ≈ {total}. You only put in {aportado}; the rest ({crecimiento}) is growth.

Assumes a constant 7% average annual return. Real returns vary and aren't guaranteed. This is education, not financial advice.

📊 Try different amounts and rates in FinanziApp's compound interest calculator. Free for 15 days. Link in bio.`,
      hashtags: [...HASH_EN, '#compoundinterest', '#investingforbeginners']
    },
    es: {
      kicker: 'CONSEJO #7',
      gancho: ['Por qué empezar pronto', 'vale más que <em>invertir más tarde</em>'],
      pasos: ['Invierte una cantidad fija cada mes', 'Deja que la rentabilidad genere rentabilidad', 'Dale tiempo: décadas, no meses'],
      prueba: { cifra: '{total}', texto: 'con 200 €/mes durante 30 años a un 7% anual medio. Tú aportas {aportado}' },
      cta: 'Haz tus propias cuentas gratis',
      texto: `El interés compuesto es rentabilidad que genera rentabilidad, y el tiempo es su ingrediente secreto. ⏰

Cómo funciona:
1️⃣ Invierte una cantidad fija cada mes.
2️⃣ La rentabilidad se reinvierte y también empieza a generar rentabilidad.
3️⃣ Cuanto más tiempo lo dejas, más empinada es la curva.

Las cuentas: 200 € al mes durante 30 años a un 7% anual medio ≈ {total}. Tú solo aportas {aportado}; el resto ({crecimiento}) es crecimiento.

Supone una rentabilidad media constante del 7% anual. La rentabilidad real varía y no está garantizada. Esto es educación financiera, no asesoramiento.

📊 Prueba otras cantidades y tipos en la calculadora de interés compuesto de FinanziApp. Gratis 15 días. Enlace en la bio.`,
      hashtags: [...HASH_ES, '#interescompuesto', '#invertirdesdecero']
    }
  }
];
