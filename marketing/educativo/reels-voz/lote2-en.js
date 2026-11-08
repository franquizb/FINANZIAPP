// Batch 2 · @finanziapp (US). Each pill opens the question for the next.
// Sources / assumptions:
//  - Roth vs traditional: traditional = tax break now, withdrawals taxed; Roth = taxed now, qualified withdrawals tax-free.
//  - Renting: Ben Felix's "5% rule" (≈1% property tax + 1% maintenance + 3% cost of capital) as a rule of thumb.
//  - Penny: U.S. Mint FY2024 annual report: 3.69 cents to make and distribute a penny (nickel: 13.78 cents); in 2025 the
//    Mint placed its final order of penny blanks.
//  - Credit utilization: balance ÷ limit; common guidance is to stay under 30% (lower is better).
//  - Emergency fund: common guideline of 3–6 months of essential expenses.
const { cierreCon } = require('./_comun');
const { cuadra } = require('../reels/_comun');
const P = require('./plantillas');

cuadra('5% of 400k / 12', Math.round(400000 * 0.05 / 12), 1667);
cuadra('30% of $1,000', 1000 * 0.3, 300);
cuadra('3 and 6 months of $3,000', [3000 * 3, 3000 * 6].join('/'), '9000/18000');

const pildoras = {
  'en-roth-vs-traditional': P.pildora({
    slug: 'en-roth-vs-traditional', cuenta: 'en',
    T: { en: {
      retencion: 'Most people <span class="c">pick wrong</span>',
      guion: [
        [0, 'Roth or traditional? §{pop}*It comes down to one question*.'],
        [1, '*Traditional*: §you get the tax break now, §{pop}and pay taxes when you take the money out.'],
        [2, '*Roth*: §you pay taxes now, §{ding}and later it comes out *tax-free*.'],
        [3, 'So ask yourself: §will my tax rate be higher later? §{pop}If yes, Roth. If no, traditional. Plenty of people do both.'],
        [4, 'Next: why the U.S. just stopped making pennies. [short pause] *Follow* so you don’t miss it.']
      ],
      cierre: 'Why no more pennies? <span class="c">Follow</span> so you don’t miss it.'
    } },
    escenas: [
      P.gancho({ titulo: 'Roth or traditional? <span class="c">One question decides</span>.', objeto: { tipo: 'cartel', cabecera: 'RETIREMENT', texto: 'Roth?', color: '#3987e5' }, burbuja: 'Hmm…', reaccion: 'encoge' }),
      P.versus({ titulo: 'Traditional', izq: { etiqueta: 'Now', valor: 'Tax break' }, der: { etiqueta: 'Later', valor: 'Taxed', color: P.ROJO } }),
      P.versus({ titulo: 'Roth', izq: { etiqueta: 'Now', valor: 'Taxed', color: P.ROJO }, der: { etiqueta: 'Later', valor: 'Tax-free' } }),
      P.pregunta({ texto: 'Will your tax rate be <span class="c">higher later</span>?', opciones: ['Yes → Roth', 'No → Traditional'] }),
      cierreCon('salto')
    ],
    texto: { en: `Roth or traditional? It comes down to one question. 🧠

Traditional: you get the tax break now and pay taxes when you take the money out.
Roth: you pay taxes now and qualified withdrawals come out tax-free later.

Ask yourself: will my tax rate be higher later? If yes, Roth. If no, traditional. Not sure? Plenty of people split between both.

Which one do you use? 👇

Next up: why the U.S. just stopped making pennies. Follow so you don’t miss it.

#rothira #401k #retirement #personalfinance #taxes` }
  }),

  'en-renting-agree': P.pildora({
    slug: 'en-renting-agree', cuenta: 'en',
    T: { en: {
      retencion: 'Owners pay <span class="c">“rent” too</span>',
      guion: [
        [0, '“Renting is throwing money away.” §{pop}*Is it, though?*'],
        [1, 'Owners have money they never get back too: §property taxes, §maintenance, §{pop}and the interest on the loan.'],
        [2, 'A popular rule of thumb: §those costs add up to about §{caja}*5% of the home’s value* a year.'],
        [3, 'On a $400,000 home, §that’s about *$1,667 a month*. §{ding}Rent below that? Renting can win.'],
        [4, 'Agree or disagree? Tell me below. [short pause] Next: what changes at $100,000. *Follow* so you don’t miss it.']
      ],
      cierre: 'What changes at $100,000? <span class="c">Follow</span> so you don’t miss it.'
    } },
    escenas: [
      P.gancho({ titulo: 'Renting isn’t throwing money away. <span class="c">Agree or disagree?</span>', objeto: { tipo: 'cartel', cabecera: 'FOR RENT', texto: '$1,600/mo', color: P.AMBAR }, burbuja: 'Wasted?', reaccion: 'encoge' }),
      P.lista({ titulo: 'Money owners never get back', items: ['Property taxes', 'Maintenance', 'Interest on the loan'] }),
      P.sello({ texto: 'The 5% rule', fuente: 'Rule of thumb popularized by Ben Felix', frase: 'About <span class="c">5% of the home’s value</span> a year.' }),
      P.contador({ titulo: '5% of $400,000 ÷ 12', hasta: 1667, prefijo: '$', sufijo: '/mo', tarro: '$1,667', sep: ',' }),
      cierreCon('moneda')
    ],
    texto: { en: `“Renting is throwing money away.” Is it, though? 🏠

Owners have unrecoverable costs too: property taxes, maintenance and the interest on the loan (plus what their down payment could earn elsewhere). A popular rule of thumb, the 5% rule, puts those at about 5% of the home’s value per year.

On a $400,000 home that’s about $1,667 a month. If you can rent something similar for less, renting can come out ahead. It depends on your city, your rates and how long you stay.

Agree or disagree? 👇

Next up: what changes when you hit $100,000. Follow so you don’t miss it.

#renting #homeownership #personalfinance #realestate #moneytips` }
  }),

  'en-penny-cost': P.pildora({
    slug: 'en-penny-cost', cuenta: 'en',
    T: { en: {
      retencion: 'The nickel is <span class="c">even worse</span>',
      guion: [
        [0, 'It costs the U.S. almost §{pop}*4 cents* to make one penny.'],
        [1, 'In 2024, the Mint spent §{caja}*3.69 cents* on every 1-cent coin.'],
        [2, 'And the nickel? §{pop}Almost *14 cents* to make a 5-cent coin.'],
        [3, 'So in 2025, §the Mint placed its §{ding}*last order of penny blanks*.'],
        [4, 'Next: the 30% rule that can boost your credit score. [short pause] *Follow* so you don’t miss it.']
      ],
      cierre: 'The 30% credit rule? <span class="c">Follow</span> so you don’t miss it.'
    } },
    escenas: [
      P.gancho({ titulo: 'One penny costs <span class="c">almost 4 cents</span> to make.', objeto: { tipo: 'tarro', texto: '1¢' }, burbuja: '4 cents?!' }),
      P.contador({ titulo: 'Cost to make one penny (2024)', hasta: 3.69, sufijo: '¢', tarro: '1¢', sep: ',' }),
      P.versus({ titulo: 'Cost to make each coin', fuente: 'U.S. Mint, 2024 annual report', izq: { etiqueta: 'Penny (1¢)', valor: '3.69¢', color: P.ROJO }, der: { etiqueta: 'Nickel (5¢)', valor: '13.78¢', color: P.ROJO } }),
      P.sello({ texto: 'Last penny order', fuente: 'U.S. Mint, 2025', frase: 'No more new pennies <span class="c">once the blanks run out</span>.' }),
      cierreCon('tarro')
    ],
    texto: { en: `It costs the U.S. almost 4 cents to make one penny. 🪙

In fiscal 2024 the U.S. Mint spent 3.69 cents to make and distribute every 1-cent coin, and 13.78 cents for each 5-cent nickel (U.S. Mint annual report). In 2025 the Mint placed its final order of penny blanks: no new pennies once they run out.

Would you miss the penny? 👇

Next up: the 30% rule that can boost your credit score. Follow so you don’t miss it.

#penny #moneyfacts #personalfinance #economy #funfacts` }
  }),

  'en-credit-utilization': P.pildora({
    slug: 'en-credit-utilization', cuenta: 'en',
    T: { en: {
      retencion: 'The timing trick <span class="c">at the end</span>',
      guion: [
        [0, 'You pay your card in full every month §and your score still isn’t great? §{pop}*Look at this number*.'],
        [1, 'It’s your §{ding}*credit utilization*: §how much of your limit you’re using.'],
        [2, 'The common advice: §stay under §{caja}*30%*. §With a $1,000 limit, under $300.'],
        [3, 'Trick: §pay it down *before the statement closes*, §{pop}because that’s the balance that usually gets reported.'],
        [4, 'Next: how big your emergency fund should actually be. [short pause] *Follow* so you don’t miss it.']
      ],
      cierre: 'How big an emergency fund? <span class="c">Follow</span> so you don’t miss it.'
    } },
    escenas: [
      P.gancho({ titulo: 'The <span class="c">30% rule</span> for your credit score.', objeto: { tipo: 'tarjeta', texto: 'LIMIT $1,000', color: '#3987e5' }, burbuja: '30%?', reaccion: 'encoge' }),
      P.sello({ texto: 'Credit utilization', frase: 'Balance ÷ limit = <span class="c">how much you use</span>.' }),
      P.barras({ titulo: '$1,000 limit', items: [{ etiqueta: 'Under 30%', valor: 300, texto: '$300' }, { etiqueta: 'Too high', valor: 800, texto: '$800', color: P.ROJO }] }),
      P.mito({ lang: 'en', mito: 'Paying on the due date is enough.', realidad: 'Pay before the statement closes: that balance is usually what gets reported.' }),
      cierreCon('salto')
    ],
    texto: { en: `Paying your card in full every month and your score still isn’t great? Look at your credit utilization. 💳

It’s how much of your limit you’re using (balance ÷ limit). The common advice is to stay under 30%, and lower is better: with a $1,000 limit, under $300.

Trick: pay it down before your statement closes, because that’s the balance that usually gets reported to the credit bureaus.

What’s your utilization right now? 👇

Next up: how big your emergency fund should actually be. Follow so you don’t miss it.

#creditscore #creditcards #personalfinance #moneytips #financialliteracy` }
  }),

  'en-emergency-fund': P.pildora({
    slug: 'en-emergency-fund', cuenta: 'en',
    T: { en: {
      retencion: 'Where you keep it <span class="c">matters</span>',
      guion: [
        [0, 'Car breaks down, rent is due, §{pop}*and your card is maxed out*. Sound familiar?'],
        [1, 'That’s what an §{ding}*emergency fund* is for: §money that only covers surprises.'],
        [2, 'The usual target: §3 to 6 months of essential expenses. §{caja}Spend $3,000 a month? That’s $9,000 to $18,000.'],
        [3, 'Too much? §Start with your first $1,000, §{pop}and keep it in a high-yield savings account.'],
        [4, 'Next: why “was $199, now $99” works on everyone. [short pause] *Follow* so you don’t miss it.']
      ],
      cierre: 'Why does “was $199” work? <span class="c">Follow</span> so you don’t miss it.'
    } },
    escenas: [
      P.gancho({ titulo: 'How big should your <span class="c">emergency fund</span> be?', objeto: { tipo: 'recibo', titulo: 'SURPRISES', lineas: [['Car repair', '$850'], ['Vet', '$400']], total: '$1,250' }, burbuja: 'Ugh.', reaccion: 'encoge' }),
      P.sello({ texto: 'Emergency fund', frase: 'Only for <span class="c">surprises</span>.' }),
      P.barras({ titulo: 'If you spend $3,000 a month', items: [{ etiqueta: '3 months', valor: 9000, texto: '$9,000' }, { etiqueta: '6 months', valor: 18000, texto: '$18,000', color: P.AMBAR }] }),
      P.lista({ titulo: 'Start here', items: ['Your first $1,000', 'In a high-yield savings account', 'Then build to 3–6 months'] }),
      cierreCon('moneda')
    ],
    texto: { en: `Car breaks down, rent is due and your card is maxed out. Sound familiar? 🚗

That’s what an emergency fund is for: money that only covers surprises. The usual target is 3 to 6 months of essential expenses. Spend $3,000 a month? That’s $9,000 to $18,000.

Too much right now? Start with your first $1,000, keep it in a high-yield savings account and build from there.

How many months do you have covered? 👇

Next up: why “was $199, now $99” works on everyone. Follow so you don’t miss it.

#emergencyfund #savingmoney #personalfinance #moneytips #financialliteracy` }
  })
};

module.exports = { pildoras };
