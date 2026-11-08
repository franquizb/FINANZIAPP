// Batch 1 · @finanziapp (US). Five template pills; each one opens the question for the next.
// Sources / assumptions:
//  - 401(k) match: example math ($60,000 salary, 50% match up to 6%). Matched money may vest over time (plan rules).
//  - Checking your own credit is a soft inquiry and doesn't affect scores (Experian; CFPB); applying for credit
//    (hard inquiry) can cause a small, temporary dip. Free weekly reports at AnnualCreditReport.com.
//  - Rule of 72: approximation (72 ÷ annual return = years to double).
//  - $10,000 at 4%: hypothetical rate (savings rates vary).
//  - $5/day: $1,825/year; invested monthly at a hypothetical 7% a year for 10 years ≈ $26,300.
const { cierreCon } = require('./_comun');
const { cuadra } = require('../reels/_comun');
const P = require('./plantillas');

cuadra('401k: 6% of 60k / 50% match', [60000 * 0.06, 60000 * 0.06 * 0.5].join('/'), '3600/1800');
cuadra('72/8 and 72/2', [72 / 8, 72 / 2].join('/'), '9/36');
cuadra('4% of 10k', 10000 * 0.04, 400);
cuadra('$5 × 365', 5 * 365, 1825);
const SALDOS = [0, 1885, 3906, 6073, 8396, 10888, 13560, 16425, 19497, 22791, 26323];   // $152.08/month at 7%

const pildoras = {
  'en-401k-match': P.pildora({
    slug: 'en-401k-match', cuenta: 'en',
    T: { en: {
      retencion: 'The math at the end <span class="c">is wild</span>',
      guion: [
        [0, 'Your boss is offering you free money, §and it’s easy to §{pop}*leave it on the table*.'],
        [1, 'It’s called the *401(k) match*: §you put in up to a certain percent, §{ding}and your employer adds money on top.'],
        [2, 'Say you make $60,000 and they match 50% up to 6%. §You put in *$3,600*. §{caja}They add *$1,800*.'],
        [3, 'That’s an instant §*50% return*, §{pop}before the market even moves.'],
        [4, 'Rule one: §don’t skip it. §{ding}*Contribute at least enough to get the full match*.'],
        [5, 'Next: Roth or traditional, which one should you pick? [short pause] *Follow* so you don’t miss it.']
      ],
      cierre: 'Roth or traditional? <span class="c">Follow</span> so you don’t miss it.'
    } },
    escenas: [
      P.gancho({ titulo: 'Your 401(k) match is <span class="c">free money</span>. Are you taking it?', objeto: { tipo: 'billete', texto: '$1,800' }, burbuja: 'Free?!' }),
      P.sello({ texto: '401(k) match', frase: 'They add money <span class="c">on top</span>.' }),
      P.versus({ titulo: '$60,000 salary · 50% match up to 6%', izq: { etiqueta: 'You put in', valor: '$3,600' }, der: { etiqueta: 'They add', valor: '$1,800' } }),
      P.contador({ titulo: 'Instant return', hasta: 50, sufijo: '%', tarro: '+$1,800', sep: ',' }),
      P.mito({ lang: 'en', mito: 'I’ll start saving for retirement later.', realidad: 'Contribute at least enough to get the full match. It’s part of your pay.' }),
      cierreCon('moneda')
    ],
    texto: { en: `Your boss is offering you free money, and it’s easy to leave it on the table. 💸

It’s the 401(k) match: you contribute up to a certain percent of your pay and your employer adds money on top.

Example: $60,000 salary, 50% match up to 6%. You put in $3,600, they add $1,800. That’s an instant 50% return before the market even moves.

Rule one: contribute at least enough to get the full match. (Check your plan’s vesting schedule: matched money can take a few years to be fully yours.)

Does your job offer a match? 👇

Next up: Roth or traditional, which one should you pick? Follow so you don’t miss it.

#401k #personalfinance #retirement #moneytips #financialliteracy` }
  }),

  'en-credit-check-myth': P.pildora({
    slug: 'en-credit-check-myth', cuenta: 'en',
    T: { en: {
      retencion: 'What actually <span class="c">does lower it</span>',
      guion: [
        [0, '“Don’t check your credit score, it’ll drop.” §{pop}*Total myth*.'],
        [1, 'Checking your own score is a §*soft inquiry*. §{ding}It has *zero* effect on your score.'],
        [2, 'What can ding it? §A *hard inquiry*: §{pop}when you apply for a new card or a loan.'],
        [3, 'So check it as often as you want. §Your bank app, §{ding}or free reports at *AnnualCreditReport.com*.'],
        [4, 'Next: the rule that tells you how fast your money doubles. [short pause] *Follow* so you don’t miss it.']
      ],
      cierre: 'How fast does money double? <span class="c">Follow</span> so you don’t miss it.'
    } },
    escenas: [
      P.gancho({ titulo: 'Checking your credit score <span class="c">does NOT lower it</span>.', objeto: { tipo: 'tarjeta', texto: 'SCORE 720', color: '#3987e5' }, burbuja: 'Wait, what?', reaccion: 'encoge' }),
      P.sello({ texto: 'Soft inquiry', fuente: 'Experian · CFPB', frase: '<span class="c">Zero</span> effect on your score.' }),
      P.mito({ lang: 'en', mito: 'Checking your score hurts it.', realidad: 'Only hard inquiries (applying for credit) can cause a small, temporary dip.' }),
      P.lista({ titulo: 'Check it, free', items: ['Your bank or card app', 'AnnualCreditReport.com <span style="color:#5eead4">(free weekly reports)</span>'] }),
      cierreCon('tarro')
    ],
    texto: { en: `“Don’t check your credit score, it’ll drop.” Total myth. 📉

Checking your own score or report is a soft inquiry: zero effect on your score. What can ding it is a hard inquiry, when you apply for a new card or loan, and even then it’s usually a small, temporary dip.

So check it as often as you want: most bank apps show it for free, and you can pull your full reports at AnnualCreditReport.com.

How often do you check yours? 👇

Next up: the rule that tells you how fast your money doubles. Follow so you don’t miss it.

#creditscore #personalfinance #moneytips #credit #financialliteracy` }
  }),

  'en-rule-of-72': P.pildora({
    slug: 'en-rule-of-72', cuenta: 'en',
    T: { en: {
      retencion: 'Try it with <span class="c">your own number</span>',
      guion: [
        [0, 'Want to know when your money doubles? §{pop}*There’s a one-second trick*.'],
        [1, 'It’s the §*Rule of 72*: §{ding}divide 72 by your yearly return.'],
        [2, 'At 8% a year, §72 divided by 8 §{caja}is *9 years* to double.'],
        [3, 'At 2%? §*36 years*. §{pop}That’s why where you keep your money matters.'],
        [4, 'Next: what changes when you hit $10,000 saved. [short pause] *Follow* so you don’t miss it.']
      ],
      cierre: 'What changes at $10,000? <span class="c">Follow</span> so you don’t miss it.'
    } },
    escenas: [
      P.gancho({ titulo: 'How fast does your money double? <span class="c">Divide by 72</span>.', objeto: { tipo: 'tarro', texto: '×2' }, burbuja: '72?', reaccion: 'encoge' }),
      P.sello({ texto: 'Rule of 72', frase: '72 ÷ your return = <span class="c">years to double</span>.' }),
      P.contador({ titulo: '72 ÷ 8%', hasta: 9, sufijo: ' years', tarro: '×2', sep: ',' }),
      P.versus({ titulo: 'Years to double your money', izq: { etiqueta: 'At 8% a year', valor: '9 years' }, der: { etiqueta: 'At 2% a year', valor: '36 years', color: P.ROJO } }),
      cierreCon('salto')
    ],
    texto: { en: `Want to know when your money doubles? There’s a one-second trick: the Rule of 72. ⏱️

Divide 72 by your yearly return:
📈 At 8% a year → about 9 years to double
🐢 At 2% a year → about 36 years

It’s an approximation, but it shows why where you keep your money matters.

What return are you getting right now? 👇

Next up: what changes when you hit $10,000 saved. Follow so you don’t miss it.

#ruleof72 #investing #personalfinance #compoundinterest #moneytips` }
  }),

  'en-hito-10000': P.pildora({
    slug: 'en-hito-10000', cuenta: 'en',
    T: { en: {
      retencion: 'Number 2 <span class="c">surprises people</span>',
      guion: [
        [0, 'You’ve saved *$10,000*. §{ding}Here are three things that change.'],
        [1, 'One: your money starts working. §At 4% a year, §that’s §{caja}*$400* without lifting a finger.'],
        [2, 'Two: you can say no. §To a bad job, §a bad deal, §{pop}or a bad landlord.'],
        [3, 'Three: §you stop thinking in paychecks §{ding}and start thinking in *years*.'],
        [4, 'Next: renting isn’t throwing money away. Agree or disagree? [short pause] *Follow* so you don’t miss it.']
      ],
      cierre: 'Is renting throwing money away? <span class="c">Follow</span> so you don’t miss it.'
    } },
    escenas: [
      P.gancho({ titulo: 'At <span class="c">$10,000</span> saved, 3 things change.', objeto: { tipo: 'tarro', texto: '$10,000', nivel: 0.9 }, burbuja: '3 things?' }),
      P.contador({ titulo: '4% of $10,000 a year', hasta: 400, prefijo: '$', tarro: '$400', sep: ',' }),
      P.lista({ titulo: 'You can say no to…', items: ['A bad job', 'A bad deal', 'A bad landlord'] }),
      P.sello({ texto: 'Long-term mindset', frase: 'Paychecks → <span class="c">years</span>.' }),
      cierreCon('moneda')
    ],
    texto: { en: `You’ve saved $10,000. Here are 3 things that change: 🏦

1️⃣ Your money starts working: at 4% a year that’s about $400 without lifting a finger (rates vary).
2️⃣ You can say no: to a bad job, a bad deal or a bad landlord.
3️⃣ You stop thinking in paychecks and start thinking in years.

Where are you on the way to $10k? 👇

Next up: renting isn’t throwing money away. Agree or disagree? Follow so you don’t miss it.

#savingmoney #personalfinance #emergencyfund #moneymilestones #financialliteracy` }
  }),

  'en-5-dollars-a-day': P.pildora({
    slug: 'en-5-dollars-a-day', cuenta: 'en',
    T: { en: {
      retencion: 'Invested, it gets <span class="c">way bigger</span>',
      guion: [
        [0, 'Five bucks a day. §Coffee, a snack, an app. §{pop}*Let’s do the math*.'],
        [1, 'Five dollars a day, every day of the year, §{caja}adds up to *$1,825*.'],
        [2, 'Invest it instead, at 7% a year, §and in 10 years §{ding}that’s about *$26,000*.'],
        [3, 'Not saying skip everything. §Just pick *one* $5 habit §{pop}and point it at your future.'],
        [4, 'Next: why “was $199, now $99” works on everyone. [short pause] *Follow* so you don’t miss it.']
      ],
      cierre: 'Why does “was $199” work? <span class="c">Follow</span> so you don’t miss it.'
    } },
    escenas: [
      P.gancho({ titulo: '$5 a day is <span class="c">$1,825 a year</span>.', objeto: { tipo: 'recibo', lineas: [['Coffee', '$5.00']], total: '$5.00' }, burbuja: 'Only $5…' }),
      P.contador({ titulo: '$5 × 365 days', hasta: 1825, prefijo: '$', tarro: '$1,825', sep: ',' }),
      P.linea({ titulo: '$152 a month at 7% a year', puntos: SALDOS, desde: 'Year 0', hasta: 'Year 10', etiqueta: '≈ $26,000' }),
      P.pregunta({ texto: 'Which $5 habit would you <span class="c">swap</span>?', opciones: ['Coffee', 'Delivery'] }),
      cierreCon('tarro')
    ],
    texto: { en: `Five bucks a day. Coffee, a snack, an app… let’s do the math. ☕

$5 × 365 = $1,825 a year.
Invest it instead (about $152 a month) at a hypothetical 7% a year and in 10 years that’s about $26,000.

Not saying skip everything. Just pick one $5 habit and point it at your future.

Which one would you swap? 👇

Next up: why “was $199, now $99” works on everyone. Follow so you don’t miss it.

#personalfinance #savingmoney #investing #compoundinterest #moneytips` }
  })
};

module.exports = { pildoras };   // reels-voz/cargar.js finds them by slug
