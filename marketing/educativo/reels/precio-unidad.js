// Reel: el precio por unidad (el envase grande no siempre sale más barato).
const { C, din, fila, lista, listaIconos, dos, cierre, CIERRE, cuadra } = require('./_comun');

// Precios de ejemplo. EN: por onza; ES: por kilo.
const P = {
  en: { unidad: 'oz', pequeño: { cant: 12, precio: 2.49 }, grande: { cant: 32, precio: 7.29 } },
  es: { unidad: 'kg', pequeño: { cant: 0.5, precio: 1.79 }, grande: { cant: 1.2, precio: 4.79 } }
};
const porUnidad = (l, k) => P[l][k].precio / P[l][k].cant;
const masCaro = (l) => Math.round((porUnidad(l, 'grande') / porUnidad(l, 'pequeño') - 1) * 100);  // % que paga de más el grande
const pu = (l, k) => (l === 'en' ? din(porUnidad(l, k), l, 2) + ' / oz' : din(porUnidad(l, k), l, 2).replace(' €', ' €/kg'));
cuadra('pu en pequeño', +porUnidad('en', 'pequeño').toFixed(2), 0.21);
cuadra('pu en grande', +porUnidad('en', 'grande').toFixed(2), 0.23);
cuadra('pu es pequeño', +porUnidad('es', 'pequeño').toFixed(2), 3.58);
cuadra('pu es grande', +porUnidad('es', 'grande').toFixed(2), 3.99);
cuadra('más caro en', masCaro('en'), 10);
cuadra('más caro es', masCaro('es'), 11);

const T = {
  en: {
    kicker: 'SMART SHOPPING',
    e1: ['The big pack <span class="c">isn’t always cheaper</span>', 'One number on the shelf tag tells you.', ['Small · 12 oz', 'Big · 32 oz']],
    e2: ['Look at the <span class="c">price per unit</span>', 'Same product, compared per ounce:', `The big pack costs about <span style="color:${C.caprichos}">${masCaro('en')}% more</span> per ounce.`],
    e3: ['How to find it', ['Look for “unit price” on the shelf tag. It’s often in small print', 'Compare the same unit: per oz, per lb, per count', 'Not there? Divide the price by the quantity'], `$2.49 ÷ 12 oz = ${pu('en', 'pequeño')}`],
    e4: ['The big one <span class="c">is</span> worth it if…', [['lupa', 'Its unit price is lower', 'Check it, don’t assume it'], ['calendario', 'You’ll use it before it expires', 'Food you throw away is the priciest'], ['casa', 'You have room to store it', 'and it won’t get lost at the back']], 'Example prices. Education, not financial advice.'],
    cierre: CIERRE.en
  },
  es: {
    kicker: 'COMPRA INTELIGENTE',
    e1: ['El envase grande <span class="c">no siempre sale más barato</span>', 'Te lo dice un número de la etiqueta.', ['Pequeño · 500 g', 'Grande · 1,2 kg']],
    e2: ['Mira el <span class="c">precio por unidad</span>', 'El mismo producto, comparado por kilo:', `El grande sale un <span style="color:${C.caprichos}">${masCaro('es')}% más caro</span> por kilo.`],
    e3: ['Cómo encontrarlo', ['Búscalo en la etiqueta del estante: suele ir en letra pequeña', 'Compara la misma unidad: por kilo, por litro, por unidad', '¿No aparece? Divide el precio entre la cantidad'], `1,79 € ÷ 0,5 kg = ${pu('es', 'pequeño')}`],
    e4: ['El grande <span class="c">sí</span> compensa si…', [['lupa', 'Su precio por unidad es menor', 'Compruébalo, no lo des por hecho'], ['calendario', 'Lo vas a gastar antes de que caduque', 'Lo que se tira es lo más caro'], ['casa', 'Tienes sitio para guardarlo', 'y no se queda olvidado al fondo']], 'Precios de ejemplo. Educación financiera, no asesoramiento.'],
    cierre: CIERRE.es
  }
};

module.exports = {
  slug: 'precio-unidad',
  T,
  duraciones: [5, 6.5, 6.5, 6.5, 3.6],
  escenas: [
    (t, lang) => `<h1 class="a">${t.e1[0]}</h1><p class="lead a">${t.e1[1]}</p>
      ${dos([t.e1[2][0], din(P[lang].pequeño.precio, lang, 2)], [t.e1[2][1], din(P[lang].grande.precio, lang, 2)], false)}`,
    (t, lang) => `<h1 class="a">${t.e2[0]}</h1><p class="lead a">${t.e2[1]}</p>
      ${fila(t.e1[2][0], pu(lang, 'pequeño'), porUnidad(lang, 'pequeño') / porUnidad(lang, 'grande') * 100, C.necesidades)}
      ${fila(t.e1[2][1], pu(lang, 'grande'), 100, C.caprichos)}
      <p class="lead a" style="margin-top:40px;font-weight:650;color:${C.tinta}">${t.e2[2]}</p>`,
    (t) => `<h1 class="a">${t.e3[0]}</h1>${lista(t.e3[1])}
      <div class="tarjeta a" style="margin-top:28px;text-align:center;font-size:40px;font-weight:800;color:${C.acento};font-variant-numeric:tabular-nums">${t.e3[2]}</div>`,
    (t) => `<h1 class="a">${t.e4[0]}</h1>${listaIconos(t.e4[1])}<p class="nota a" style="font-size:28px;margin-top:30px">${t.e4[2]}</p>`,
    cierre
  ],
  texto: {
    en: `The big pack isn't always cheaper. 🛒

Example: 12 oz for $2.49 or 32 oz for $7.29. The big one looks like the better deal, but per ounce the small one costs ${pu('en', 'pequeño')} and the big one ${pu('en', 'grande')}. The big pack costs about ${masCaro('en')}% more.

How to check in seconds: look for the "unit price" on the shelf tag (it's often in small print) and compare the same unit, per oz, per lb or per count. If it's not there, divide the price by the quantity.

When the big one is worth it: when its unit price really is lower, you'll use it before it expires and you have room to store it. Food you throw away is the most expensive kind.

Example prices. Education, not financial advice.

#smartshopping #groceries #savingmoney #budgeting #personalfinance`,
    es: `El envase grande no siempre sale más barato. 🛒

Ejemplo: 500 g por 1,79 € o 1,2 kg por 4,79 €. El grande parece mejor compra, pero por kilo el pequeño sale a ${pu('es', 'pequeño')} y el grande a ${pu('es', 'grande')}. El grande es un ${masCaro('es')}% más caro.

Cómo comprobarlo en segundos: busca el precio por unidad en la etiqueta del estante (suele ir en letra pequeña) y compara la misma unidad: por kilo, por litro o por unidad. Si no aparece, divide el precio entre la cantidad.

Cuándo compensa el grande: cuando su precio por unidad es de verdad menor, lo vas a gastar antes de que caduque y tienes sitio para guardarlo. Lo que se tira es lo más caro.

Precios de ejemplo. Educación financiera, no asesoramiento.

#comprainteligente #ahorro #supermercado #presupuesto #finanzaspersonales`
  }
};
