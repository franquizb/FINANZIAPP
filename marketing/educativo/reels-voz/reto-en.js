// Series «30 days to get your money in order» · @finanziapp (US), in 3D (reels-voz/tres.js), narrator voice.
// Same choreography as the Spanish series (reto-es.js): the 3D function and the scene timings are shared; the script is
// written for a US audience (paycheck, purchases), not translated. Grey mannequins = your money going its own way;
// what you control lights up. Zone names (NEEDS / WANTS / SAVINGS) come from tres.js according to the language.
// Day 1: no external data (it's a method: write down every purchase for 7 days and label it).
const { pildora3d, hud, finSerie } = require('./tres');
const { pildoras: ES } = require('./reto-es');

const SERIE = '30 DAYS TO GET YOUR MONEY IN ORDER', TOTAL = 30, SIGUE = '<b>Follow</b> so you don’t miss a day';

const pildoras = {
  'en-reto-01': pildora3d({
    slug: 'en-reto-01', cuenta: 'en',
    T: { en: {
      titulo: 'Day 1/30 · Where does your paycheck actually go?',
      guion: [
        [0, 'Your paycheck comes in… §and it’s gone *in every direction*.'],
        [0, 'Do you know exactly where? §If the answer is “kind of,” *stick around*.'],
        [1, 'Because what you can’t see, §*you can’t change*.'],
        [2, '*Day one*. Just one thing: §for seven days, §*write down every purchase*. Don’t change anything. Just look.'],
        [3, 'Give each one a label: §{pop}*need*, §{pop}*want*, §{pop}or *savings*.'],
        [4, 'In a week, you’ll see §{ding}*the whole picture* of your money.'],
        [5, 'Day one of thirty to *get your money in order*. §Tomorrow: the charges that hit your account *every month*.']
      ]
    } },
    fijo: () => hud(1, TOTAL, 'DAY'),
    escenas: [
      // 0 · Bird's-eye: chaos. Card «money tracked: 0%».
      { html: () => `<div class="dato" data-t="translateX(-50%)" style="top:1240px"><small>MONEY TRACKED</small><b class="rojo">0%</b></div>`,
        anim: ES['es-reto-01'].escenas[0].anim },
      { html: () => '', anim: null },
      // 2 · The hero lights up; today's task.
      { html: () => `<div class="rotulo" data-t="translateX(-50%)" style="top:580px">Write down every purchase · 7 days</div>`,
        anim: ES['es-reto-01'].escenas[2].anim },
      { html: () => '', anim: null },
      { html: () => '', anim: null },
      finSerie({ dia: 1, total: TOTAL, serie: SERIE, etiquetaManana: 'TOMORROW · DAY 2', manana: 'The charges that hit your account every month', sigue: SIGUE })
    ],
    tres: ES['es-reto-01'].tres,
    texto: { en: `Your paycheck comes in… and it’s gone in every direction. 👀

Day 1 of 30 to get your money in order. Today, just one thing: for 7 days, write down every purchase and tag it need, want or savings. Don’t change anything yet. Just look.
Easiest way to keep it up: check your bank app every night and add what you missed. Card taps and autopays are the ones people forget.

What do you think will surprise you most? 👇

💾 Save this and start today.
👉 Tomorrow, day 2: the charges that hit your account every month. Follow so you don’t miss a day.

#budgeting #moneychallenge #spendingtracker` }
  })
};

module.exports = { pildoras };
