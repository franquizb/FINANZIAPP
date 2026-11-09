// Lote 1 · @finanziapp.es (España). Cinco píldoras hechas con plantillas; cada una deja la pregunta de la siguiente.
// Fuentes:
//  - Garantía: Real Decreto-ley 7/2021 (en vigor el 1 de enero de 2022): garantía legal de 3 años en bienes nuevos;
//    si el defecto aparece en los 2 primeros años se presume que ya existía en la entrega. Responde el vendedor.
//  - Devoluciones: Ley General para la Defensa de los Consumidores (RDL 1/2007): 14 días naturales para desistir en
//    compras a distancia; si no se informa del derecho, el plazo se amplía 12 meses. En tienda física no hay derecho
//    legal de desistimiento (solo si la tienda lo ofrece).
//  - Precio por unidad: Real Decreto 3423/2000 (precio por kilo, litro… obligatorio junto al precio de venta).
//  - 50/30/20: popularizada por Elizabeth Warren y Amelia Warren Tyagi en «All Your Worth».
const { cierreCon } = require('./_comun');
const { cuadra } = require('../reels/_comun');
const P = require('./plantillas');

cuadra('café 1,50 × 22 × 12', +(1.5 * 22 * 12).toFixed(2), 396);
cuadra('50/30/20 de 1.500', [1500 * 0.5, 1500 * 0.3, 1500 * 0.2].join('/'), '750/450/300');
cuadra('500 g a 2 € → €/kg', 2 / 0.5, 4);

const pildoras = {
  'es-garantia-3-anos': P.pildora({
    slug: 'es-garantia-3-anos', cuenta: 'es',
    T: { es: {
      retencion: 'Lo de los 2 años <span class="c">te salva</span>',
      guion: [
        [0, 'Se te rompe el móvil a los dos años y medio. §¿Mala suerte? §{pop}*No tan rápido*.'],
        [1, 'Desde 2022, en España, la garantía legal de un producto nuevo es de §{ding}*tres años*, §no dos.'],
        [2, 'Y lo mejor: §si falla en los dos primeros años, la ley da por hecho que *ya venía de fábrica*. §{pop}En el tercero, te toca demostrarlo.'],
        [3, '¿A quién reclamas? §No al fabricante: §{pop}*a la tienda*, que es quien responde.'],
        [4, '¿Y sabías que si compras por internet tienes 14 días para devolverlo sin dar explicaciones? [short pause] La respuesta, en el siguiente vídeo. *Síguenos* para no perdértelo.']
      ],
      cierre: '¿14 días para devolverlo? <span class="c">Síguenos</span> para no perdértelo.'
    } },
    escenas: [
      P.gancho({ titulo: 'Tu móvil falla a los 2 años y medio: <span class="c">no lo pagues tú</span>.', objeto: { tipo: 'cartel', cabecera: 'COMPRADO HACE', texto: '2,5 años', color: P.ROJO }, burbuja: '¿Y ahora?' }),
      P.sello({ texto: 'Garantía: 3 años', fuente: 'Real Decreto-ley 7/2021 · desde el 1 de enero de 2022', objeto: { tipo: 'cartel', cabecera: 'GARANTÍA LEGAL', texto: '3 AÑOS' } }),
      P.lista({ titulo: 'Cómo funciona', items: ['Años 1 y 2: la ley da por hecho que <span style="color:#5eead4">ya venía de fábrica</span>', 'Año 3: sigue cubierto, pero <span style="color:#5eead4">tienes que demostrarlo</span>'] }),
      P.mito({ mito: 'Si se rompe, escribe al fabricante.', realidad: 'Reclama a la tienda: el vendedor responde de la garantía.' }),
      cierreCon('salto')
    ],
    texto: { es: `Se te rompe el móvil a los dos años y medio… y la tienda te dice que ya no está en garantía. 📱

Desde el 1 de enero de 2022, en España la garantía legal de un producto nuevo es de 3 años (Real Decreto-ley 7/2021). Y si el fallo aparece en los dos primeros años, la ley da por hecho que el defecto ya venía de fábrica: no tienes que demostrarlo tú. En el tercer año sigue cubierto, pero te toca probarlo.

¿A quién reclamas? A la tienda, que es quien responde de la garantía legal (aparte de la comercial que dé el fabricante).

Guárdalo para cuando lo necesites 🔖 ¿Te han dicho alguna vez que «ya no está en garantía»? 👇

Y la siguiente: ¿sabías que si compras por internet tienes 14 días para devolverlo sin dar explicaciones? Síguenos para no perdértelo.

#finanzaspersonales #consumo #garantia #derechosdelconsumidor #ahorro` }
  }),

  'es-devolucion-14-dias': P.pildora({
    slug: 'es-devolucion-14-dias', cuenta: 'es',
    T: { es: {
      retencion: 'En la tienda física <span class="c">no funciona igual</span>',
      guion: [
        [0, 'Compras unas zapatillas por internet y no te convencen. §¿Te las quedas? §{pop}*Ni de broma*.'],
        [1, 'En compras a distancia tienes §{ding}*14 días naturales* para devolverlo, §sin dar explicaciones.'],
        [2, 'Y si la tienda no te informa de ese derecho, §el plazo normal es de 14 días, §{pop}*pero se alarga doce meses más*.'],
        [3, 'Ojo: §en una tienda física *no es obligatorio*. §{pop}Solo si la tienda lo ofrece.'],
        [4, '¿Y por qué el paquete grande no siempre sale más barato? [short pause] Te lo cuento en el próximo vídeo. *Síguenos*.']
      ],
      cierre: '¿El paquete grande, más caro? <span class="c">Síguenos</span> para no perdértelo.'
    } },
    escenas: [
      P.gancho({ titulo: 'Compraste online y te arrepientes: <span class="c">tienes 14 días</span>.', objeto: { tipo: 'recibo', titulo: 'PEDIDO ONLINE', lineas: [['Zapatillas', '79,99 €'], ['Envío', '0,00 €']], total: '79,99 €' }, burbuja: 'Mmm…', reaccion: 'encoge' }),
      P.sello({ texto: '14 días', fuente: 'Ley de Consumidores · compras a distancia', frase: 'Sin dar <span class="c">explicaciones</span>.' }),
      P.barras({ titulo: 'Plazo para devolver', items: [{ etiqueta: 'Normal', valor: 14, texto: '14 días' }, { etiqueta: 'Si no te avisan', valor: 60, texto: '+12 meses', color: P.AMBAR }] }),
      P.mito({ mito: 'En la tienda física también tienes 14 días.', realidad: 'Solo si la tienda lo ofrece. Pregunta antes de pagar.' }),
      cierreCon('moneda')
    ],
    texto: { es: `Compraste por internet y no te convence. ¿Te lo quedas? Ni de broma. 👟

En compras a distancia (internet, teléfono…) tienes 14 días naturales para devolverlo sin dar explicaciones: es el derecho de desistimiento. Y si la tienda no te informa de ese derecho, el plazo se alarga 12 meses más. Hay excepciones (productos personalizados, perecederos, precintados que abres…).

Ojo: en una tienda física no es obligatorio. Solo puedes devolverlo si la tienda lo ofrece, así que pregunta antes de pagar.

Guárdalo 🔖 ¿Te han puesto pegas alguna vez para devolver algo? 👇

Y la siguiente: ¿por qué el paquete grande no siempre sale más barato? Síguenos para no perdértelo.

#finanzaspersonales #consumo #comprasonline #derechosdelconsumidor #ahorro` }
  }),

  'es-precio-por-kilo': P.pildora({
    slug: 'es-precio-por-kilo', cuenta: 'es',
    T: { es: {
      retencion: 'Mira la cifra <span class="c">pequeñita</span> de la etiqueta',
      guion: [
        [0, 'El paquete grande sale más barato, ¿no? §{pop}*No siempre*.'],
        [1, 'Por ley, la etiqueta tiene que darte el §{ding}*precio por kilo o por litro*. Es esa cifra pequeñita.'],
        [2, 'Mira: un paquete de medio kilo por 2 euros §te sale a *4 euros el kilo*. §{pop}Y el de un kilo por 4,50, *a 4,50 el kilo*.'],
        [3, 'Así que no compares paquetes: §compara §{pop}*el precio por kilo*.'],
        [4, '¿Y sabes cuánto te cuesta al año el café de cada mañana? [short pause] La respuesta, en el siguiente vídeo. *Síguenos* para no perdértelo.']
      ],
      cierre: '¿Cuánto cuesta tu café al año? <span class="c">Síguenos</span> para no perdértelo.'
    } },
    escenas: [
      P.gancho({ titulo: 'El paquete grande <span class="c">no siempre es más barato</span>.', objeto: { tipo: 'cartel', cabecera: 'TAMAÑO FAMILIAR', texto: '¡AHORRA!', color: P.AMBAR }, burbuja: '¿Seguro?', reaccion: 'encoge' }),
      P.sello({ texto: 'Precio por kilo', fuente: 'Real Decreto 3423/2000', objeto: { tipo: 'etiqueta', antesTxt: 'PRECIO', antes: '2,00 €', ahoraTxt: '€/KG', ahora: '4,00 €' } }),
      P.versus({ titulo: '¿Cuál sale más barato?', izq: { etiqueta: '500 g · 2,00 €', valor: '4,00 €/kg' }, der: { etiqueta: '1 kg · 4,50 €', valor: '4,50 €/kg', color: P.ROJO } }),
      P.mito({ mito: 'Más grande, más barato.', realidad: 'Compara el precio por kilo o por litro: es lo único que vale.' }),
      cierreCon('tarro')
    ],
    texto: { es: `El paquete grande sale más barato… ¿o no? 🛒

Por ley (Real Decreto 3423/2000), la etiqueta tiene que darte el precio por unidad de medida: por kilo, por litro… Es esa cifra pequeñita debajo del precio, y es la única que sirve para comparar.

Ejemplo: 500 g a 2 € salen a 4 €/kg. Un paquete de 1 kg a 4,50 € sale a 4,50 €/kg. El «grande» es más caro.

Guárdalo para tu próxima compra 🔖 ¿Lo habías comprobado alguna vez? 👇

Y la siguiente: ¿cuánto te cuesta al año el café de cada mañana? Síguenos para no perdértelo.

#finanzaspersonales #ahorro #supermercado #consumo #trucosdeahorro` }
  }),

  'es-cafe-hormiga': P.pildora({
    slug: 'es-cafe-hormiga', cuenta: 'es',
    T: { es: {
      retencion: 'No te voy a decir <span class="c">que lo dejes</span>',
      guion: [
        [0, 'Un café de 1,50 cada día de trabajo. §Parece nada. §{pop}*Hagamos la cuenta*.'],
        [1, '1,50 por 22 días al mes, §por 12 meses: §{caja}*396 euros al año*.'],
        [2, 'No te digo que lo dejes. §Te digo que *lo elijas*: §{ding}si te lo tomas, que sea porque lo disfrutas.'],
        [3, 'Y si lo haces en casa la mitad de los días, §te quedan 198, §{pop}*casi 200 euros al año* en tu bolsillo.'],
        [4, '¿Y cómo se reparte el sueldo para que te sobre a final de mes? [short pause] Te lo cuento en el próximo vídeo. *Síguenos*.']
      ],
      cierre: '¿Cómo repartir el sueldo? <span class="c">Síguenos</span> para no perdértelo.'
    } },
    escenas: [
      P.gancho({ titulo: 'Tu café de cada mañana <span class="c">cuesta casi 400 € al año</span>.', objeto: { tipo: 'recibo', lineas: [['Café', '1,50 €']], total: '1,50 €' }, burbuja: '¿Solo 1,50?' }),
      P.contador({ titulo: '1,50 € × 22 días × 12 meses', hasta: 396, sufijo: ' €', tarro: '396 €' }),
      P.sello({ texto: 'Gasto hormiga', frase: 'No lo arrastres: <span class="c">elígelo</span>.' }),
      P.barras({ titulo: 'Al año', items: [{ etiqueta: 'Todos los días', valor: 396, texto: '396 €', color: P.AMBAR }, { etiqueta: 'La mitad en casa', valor: 198, texto: '198 €' }] }),
      cierreCon('salto')
    ],
    texto: { es: `Un café de 1,50 € cada día de trabajo. Parece nada… ☕

1,50 € × 22 días al mes × 12 meses = 396 € al año.

No te digo que lo dejes: te digo que lo elijas. Si te lo tomas, que sea porque lo disfrutas, no por inercia. Y si lo haces en casa la mitad de los días, te quedan casi 200 € al año en el bolsillo.

¿Cuál es tu gasto hormiga? 👇

Y la siguiente: ¿cómo se reparte el sueldo para que te sobre a final de mes? Síguenos para no perdértelo.

#finanzaspersonales #ahorro #gastohormiga #dinero #educacionfinanciera` }
  }),

  'es-regla-50-30-20': P.pildora({
    slug: 'es-regla-50-30-20', cuenta: 'es',
    T: { es: {
      retencion: 'El 20 % es <span class="c">el que casi nadie respeta</span>',
      guion: [
        [0, '¿Cobras y a final de mes §no sabes dónde ha ido el dinero? §{pop}*Prueba esto*.'],
        [1, 'La regla 50/30/20: §la mitad, a lo que necesitas; §el 30 %, a caprichos; §{ding}y el 20 %, a ahorrar.'],
        [2, 'Con 1.500 euros: §750 para vivir, §450 para disfrutar §{caja}y 300 para tu yo del futuro.'],
        [3, 'La popularizó Elizabeth Warren §en su libro *All Your Worth*. §{pop}Y el truco es apartar el 20 % *nada más cobrar*.'],
        [4, '¿Y por qué cobras menos de lo que dice tu contrato? [short pause] *Síguenos* para no perdértelo.']
      ],
      cierre: '¿Por qué cobras menos? <span class="c">Síguenos</span> para no perdértelo.'
    } },
    escenas: [
      P.gancho({ titulo: 'La regla <span class="c">50/30/20</span> para que te sobre a final de mes.', objeto: { tipo: 'billete', texto: '1.500 €' }, burbuja: '¿Dónde está?', reaccion: 'encoge' }),
      P.barras({ titulo: 'Tu sueldo neto', items: [{ etiqueta: 'Necesidades', valor: 50, texto: '50 %' }, { etiqueta: 'Caprichos', valor: 30, texto: '30 %', color: P.AMBAR }, { etiqueta: 'Ahorro', valor: 20, texto: '20 %', color: P.VIOLETA }] }),
      P.lista({ titulo: 'Con 1.500 € netos', items: ['750 € para vivir', '450 € para disfrutar', '<span style="color:#5eead4">300 € para tu yo del futuro</span>'] }),
      P.sello({ texto: '50/30/20', fuente: 'Elizabeth Warren y Amelia Warren Tyagi · «All Your Worth»', frase: 'Aparta el 20 % <span class="c">nada más cobrar</span>.' }),
      cierreCon('moneda')
    ],
    texto: { es: `¿Cobras y a final de mes no sabes dónde ha ido el dinero? Prueba la regla 50/30/20. 💶

👉 50 % para lo que necesitas (casa, comida, facturas)
👉 30 % para caprichos
👉 20 % para ahorrar

Con 1.500 € netos: 750 € para vivir, 450 € para disfrutar y 300 € para tu yo del futuro. La popularizaron Elizabeth Warren y Amelia Warren Tyagi en «All Your Worth». El truco: aparta el 20 % nada más cobrar, no lo que sobre.

¿Te cuadra con tu sueldo o te parece imposible? 👇

Y la siguiente: ¿por qué cobras menos de lo que dice tu contrato? Síguenos para no perdértelo.

#finanzaspersonales #ahorro #presupuesto #dinero #educacionfinanciera` }
  })
};

module.exports = { pildoras };   // reels-voz/cargar.js los encuentra por su slug
