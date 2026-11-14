// Lote 2 · @finanziapp.es (España). Cada píldora deja la pregunta de la siguiente.
// Fuentes:
//  - Nómina: Orden PJC/297/2026 (cotización 2026). Trabajador con contrato indefinido: 4,70 % contingencias comunes
//    + 1,55 % desempleo + 0,10 % formación + 0,15 % MEI = 6,50 %. La retención de IRPF depende del sueldo y la situación
//    personal y es un adelanto de la declaración de la renta.
//  - Pagas extra: el sueldo bruto anual es el mismo con 12 o 14 pagas; la retención de IRPF se calcula sobre el anual y
//    la base de cotización ya incluye la parte proporcional de las extras.
//  - Letras del Tesoro: deuda pública a 3, 6, 9 y 12 meses; nominal de 1.000 €; se compran por debajo y al vencer se
//    cobran 1.000 €; se pueden comprar directamente en el Tesoro Público sin comisiones.
//  - Fondo de emergencia: regla orientativa de 3 a 6 meses de gastos.
//  - Reduflación: ejemplo hipotético 150 g → 130 g al mismo precio (+15 % por kilo).
const { cierreCon } = require('./_comun');
const { cuadra } = require('../reels/_comun');
const P = require('./plantillas');

cuadra('cotización 2026', +(4.7 + 1.55 + 0.1 + 0.15).toFixed(2), 6.5);
cuadra('6,5 % de 2.000', 2000 * 0.065, 130);
cuadra('3 y 6 meses de 1.200', [1200 * 3, 1200 * 6].join('/'), '3600/7200');
cuadra('150 g → 130 g', Math.round((150 / 130 - 1) * 100), 15);

const pildoras = {
  'es-nomina-bruto-neto': P.pildora({
    slug: 'es-nomina-bruto-neto', cuenta: 'es',
    T: { es: {
      retencion: 'Lo del IRPF <span class="c">no es lo que crees</span>',
      guion: [
        [0, 'Tu contrato dice 2.000 euros al mes. §Pero en tu cuenta §{pop}*entra bastante menos*.'],
        [1, 'Primero, la Seguridad Social: §en 2026 el trabajador cotiza el §{ding}*6,5 %*. §Con 2.000 euros, 130 al mes.'],
        [2, 'Después, la retención del IRPF, §que depende de tu sueldo y de tu situación.'],
        [3, 'Y ojo: §la retención *no es un impuesto extra*. §{pop}Es un adelanto de tu declaración de la renta.'],
        [4, '¿Y qué es mejor, cobrar las pagas extra prorrateadas o en junio y diciembre? [short pause] La respuesta, en el siguiente vídeo. *Síguenos* para no perdértelo.']
      ],
      cierre: '¿Pagas extra prorrateadas o no? <span class="c">Síguenos</span> para no perdértelo.'
    } },
    escenas: [
      P.gancho({ titulo: 'Por qué cobras <span class="c">menos de lo que dice tu contrato</span>.', objeto: { tipo: 'billete', texto: '2.000 €' }, burbuja: '¿Dónde está?', reaccion: 'encoge' }),
      P.contador({ titulo: 'Seguridad Social del trabajador · 2026', hasta: 130, sufijo: ' € al mes', tarro: '6,5 %' }),
      P.sello({ texto: 'Retención IRPF', frase: 'Depende de tu sueldo <span class="c">y de tu situación</span>.' }),
      P.mito({ mito: 'La retención es un impuesto extra.', realidad: 'Es un adelanto de tu declaración de la renta.' }),
      cierreCon('tarro')
    ],
    texto: { es: `Tu contrato dice 2.000 € al mes… y en tu cuenta entra bastante menos. 💸

1️⃣ Seguridad Social: en 2026 el trabajador con contrato indefinido cotiza el 6,50 % (4,70 % contingencias comunes, 1,55 % desempleo, 0,10 % formación y 0,15 % MEI). Con 2.000 € brutos, unos 130 € al mes.
2️⃣ Retención de IRPF: depende de tu sueldo y tu situación personal.

Ojo: la retención no es un impuesto extra, es un adelanto de tu declaración de la renta. Por eso a unos les sale a devolver y a otros a pagar.

¿Te cuadra con tu nómina? 👇

Y la siguiente: ¿qué es mejor, pagas extra prorrateadas o en junio y diciembre? Síguenos para no perdértelo.

#nomina #finanzaspersonales #irpf #trabajo #educacionfinanciera` }
  }),

  'es-pagas-extra': P.pildora({
    slug: 'es-pagas-extra', cuenta: 'es',
    T: { es: {
      retencion: 'La respuesta <span class="c">no es la que piensas</span>',
      guion: [
        [0, '¿Pagas extra prorrateadas §o en junio y diciembre? §{pop}*¿Cuál te da más dinero?*'],
        [1, 'Ninguna. §Doce pagas o catorce, §{ding}*el sueldo bruto del año es el mismo*.'],
        [2, 'Y Hacienda calcula la retención sobre lo que ganas en el año, §{pop}así que al final pagas lo mismo.'],
        [3, 'La diferencia es solo §*cuándo* te llega. §Prorrateadas, más cada mes. §{pop}En junio y diciembre, un colchón obligado.'],
        [4, '¿Y qué son las Letras del Tesoro y por qué todo el mundo habla de ellas? [short pause] Te lo cuento en el próximo vídeo. *Síguenos*.']
      ],
      cierre: '¿Letras del Tesoro? <span class="c">Síguenos</span> para no perdértelo.'
    } },
    escenas: [
      P.gancho({ titulo: 'Pagas extra: <span class="c">¿prorrateadas o en junio y diciembre?</span>', objeto: { tipo: 'cartel', cabecera: 'PAGAS', texto: '12 o 14', color: P.VIOLETA }, burbuja: '¿Cuál?', reaccion: 'encoge' }),
      P.versus({ titulo: 'Sueldo bruto del año', izq: { etiqueta: '12 pagas', valor: '28.000 €' }, der: { etiqueta: '14 pagas', valor: '28.000 €' } }),
      P.sello({ texto: 'Mismo IRPF', frase: 'La retención se calcula <span class="c">sobre el año</span>.' }),
      P.lista({ titulo: 'Lo único que cambia', items: ['Prorrateadas: <span style="color:#5eead4">más cada mes</span>', 'En junio y diciembre: <span style="color:#5eead4">un colchón obligado</span>'] }),
      cierreCon('salto')
    ],
    texto: { es: `¿Pagas extra prorrateadas o en junio y diciembre? ¿Cuál te da más dinero? 🤔

Ninguna: con 12 o con 14 pagas, el sueldo bruto del año es el mismo. Y la retención de IRPF se calcula sobre lo que ganas en el año, así que al final pagas lo mismo (la cotización a la Seguridad Social también incluye siempre la parte proporcional de las extras).

La diferencia es solo cuándo te llega: prorrateadas, más dinero cada mes; en junio y diciembre, un colchón obligado para el verano y la Navidad.

¿Tú cuál prefieres? 👇

Y la siguiente: ¿qué son las Letras del Tesoro y por qué todo el mundo habla de ellas? Síguenos para no perdértelo.

#nomina #pagasextra #finanzaspersonales #ahorro #educacionfinanciera` }
  }),

  'es-letras-tesoro': P.pildora({
    slug: 'es-letras-tesoro', cuenta: 'es',
    T: { es: {
      retencion: 'Se compran <span class="c">sin comisiones</span>',
      guion: [
        [0, 'Todo el mundo habla de las Letras del Tesoro. §{pop}*Te lo explico en treinta segundos*.'],
        [1, 'Le prestas dinero al Estado §a 3, 6, 9 o 12 meses. §{ding}*Esa es la Letra*.'],
        [2, 'Cada una vale 1.000 euros al vencer, §pero la compras *un poco más barata*. §{caja}Esa diferencia es lo que ganas.'],
        [3, 'Y la puedes comprar directamente §en la web del Tesoro, §{pop}*sin comisiones*.'],
        [4, '¿Y cuánto dinero deberías tener guardado para imprevistos? [short pause] La respuesta, en el siguiente vídeo. *Síguenos* para no perdértelo.']
      ],
      cierre: '¿Cuánto guardar para imprevistos? <span class="c">Síguenos</span> para no perdértelo.'
    } },
    escenas: [
      P.gancho({ titulo: 'Las Letras del Tesoro <span class="c">en 30 segundos</span>.', objeto: { tipo: 'billete', texto: '1.000 €' }, burbuja: '¿Cómo van?' }),
      P.lista({ titulo: 'Le prestas al Estado a…', items: ['3 meses', '6 o 9 meses', '12 meses'] }),
      P.versus({ titulo: 'Así ganas', izq: { etiqueta: 'La compras por', valor: 'menos' }, der: { etiqueta: 'Al vencer cobras', valor: '1.000 €' } }),
      P.sello({ texto: 'Sin comisiones', fuente: 'Comprándolas directamente en el Tesoro Público', frase: 'Desde <span class="c">1.000 €</span>.' }),
      cierreCon('moneda')
    ],
    texto: { es: `Todo el mundo habla de las Letras del Tesoro. Te lo explico en 30 segundos. 🏛️

Le prestas dinero al Estado a 3, 6, 9 o 12 meses. Cada Letra vale 1.000 € al vencer, pero la compras un poco más barata: esa diferencia es lo que ganas. La rentabilidad cambia en cada subasta.

Se pueden comprar directamente en la web del Tesoro Público, sin comisiones.

¿Tienes alguna o te lo estás pensando? 👇

Y la siguiente: ¿cuánto dinero deberías tener guardado para imprevistos? Síguenos para no perdértelo.

#letrasdeltesoro #finanzaspersonales #ahorro #inversion #educacionfinanciera` }
  }),

  'es-fondo-emergencia': P.pildora({
    slug: 'es-fondo-emergencia', cuenta: 'es',
    T: { es: {
      retencion: 'Y dónde guardarlo <span class="c">también importa</span>',
      guion: [
        [0, 'Se te rompe la lavadora y el coche el mismo mes. §{pop}*¿Tienes con qué pagarlo?*'],
        [1, 'Para eso está el §{ding}*fondo de emergencia*: §dinero solo para imprevistos.'],
        [2, 'La regla habitual: §de 3 a 6 meses de gastos. §{caja}Si gastas 1.200 al mes, entre 3.600 y 7.200 euros.'],
        [3, 'Y guárdalo donde lo puedas sacar rápido, §{pop}*no invertido en bolsa*.'],
        [4, '¿Y por qué la bolsa de patatas trae cada vez menos patatas? [short pause] Te lo cuento en el próximo vídeo. *Síguenos*.']
      ],
      cierre: '¿Por qué hay menos patatas? <span class="c">Síguenos</span> para no perdértelo.'
    } },
    escenas: [
      P.gancho({ titulo: '¿Cuánto dinero deberías tener <span class="c">para imprevistos</span>?', objeto: { tipo: 'recibo', titulo: 'AVERÍAS', lineas: [['Lavadora', '450 €'], ['Coche', '620 €']], total: '1.070 €' }, burbuja: '¡Uf!', reaccion: 'encoge' }),
      P.sello({ texto: 'Fondo de emergencia', frase: 'Solo para <span class="c">imprevistos</span>.' }),
      P.barras({ titulo: 'Si gastas 1.200 € al mes', items: [{ etiqueta: '3 meses', valor: 3600, texto: '3.600 €' }, { etiqueta: '6 meses', valor: 7200, texto: '7.200 €', color: P.AMBAR }] }),
      P.mito({ mito: 'Lo meto en bolsa, que rinde más.', realidad: 'Que lo puedas sacar rápido y sin perder: cuenta o depósito.' }),
      cierreCon('tarro')
    ],
    texto: { es: `Se te rompe la lavadora y el coche el mismo mes. ¿Tienes con qué pagarlo? 🧺🚗

Para eso está el fondo de emergencia: dinero que solo se toca para imprevistos. La regla habitual es tener de 3 a 6 meses de gastos: si gastas 1.200 € al mes, entre 3.600 y 7.200 €.

Y guárdalo donde lo puedas sacar rápido y sin perder (cuenta remunerada, depósito…), no invertido en bolsa.

¿Cuántos meses tienes cubiertos? 👇

Y la siguiente: ¿por qué la bolsa de patatas trae cada vez menos patatas? Síguenos para no perdértelo.

#fondodeemergencia #finanzaspersonales #ahorro #dinero #educacionfinanciera` }
  }),

  'es-reduflacion': P.pildora({
    slug: 'es-reduflacion', cuenta: 'es',
    T: { es: {
      retencion: 'Tiene nombre <span class="c">y se puede pillar</span>',
      guion: [
        [0, 'Mismo precio, mismo paquete… §{pop}*¿y menos patatas?*'],
        [1, 'Se llama §{ding}*reduflación*: §te dan menos producto por el mismo precio.'],
        [2, 'Si la bolsa pasa de 150 a 130 gramos al mismo precio, §{caja}*te sale un 15 % más caro el kilo*.'],
        [3, 'Tu defensa: §mira el precio por kilo §{pop}y compáralo con el de la última vez.'],
        [4, 'Por eso el precio parece el mismo: §{pop}*no sube el precio, encoge el paquete*.']
      ],
      cierre: 'No sube el precio: <span class="c">encoge el paquete</span>.'
    } },
    escenas: [
      P.gancho({ titulo: 'Mismo precio, <span class="c">menos patatas</span>.', objeto: { tipo: 'cartel', cabecera: 'PATATAS', texto: '150 g → 130 g', color: P.AMBAR }, burbuja: '¿Eh?', reaccion: 'encoge' }),
      P.sello({ texto: 'Reduflación', frase: 'Menos producto, <span class="c">mismo precio</span>.' }),
      P.versus({ titulo: 'Mismo precio de la bolsa', izq: { etiqueta: 'Antes', valor: '150 g' }, der: { etiqueta: 'Ahora', valor: '130 g', color: P.ROJO } }),
      P.mito({ mito: 'Si cuesta lo mismo, no ha subido.', realidad: 'Mira el precio por kilo: es ahí donde se nota.' }),
      cierreCon('moneda')
    ],
    texto: { es: `Mismo precio, mismo paquete… ¿y menos patatas? 🥔

Se llama reduflación: te dan menos producto por el mismo precio. Si una bolsa pasa de 150 a 130 gramos sin cambiar de precio, el kilo te sale un 15 % más caro.

Tu defensa: mira el precio por kilo (por ley tiene que estar en la etiqueta) y compáralo con el de la última vez.

¿Qué producto has pillado haciéndolo? 👇

¿Te ha pasado con algún producto? Cuéntanos cuál 👇

#reduflacion #supermercado #finanzaspersonales #ahorro #consumo` }
  })
};

module.exports = { pildoras };
