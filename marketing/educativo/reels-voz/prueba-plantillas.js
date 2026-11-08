// Prueba visual de todas las plantillas (no se publica): node reel-voz.js prueba-plantillas es --vista --sin-voz
const { VOZ, cierreCon } = require('./_comun');
const P = require('./plantillas');

module.exports = {
  slug: 'prueba-plantillas', cuenta: 'es', arranque: 'lleno', inicio: 0.1, suelo: true, voz: VOZ, script: P.SCRIPT, css: P.CSS,
  T: { es: {
    retencion: 'Texto de retención <span class="c">de prueba</span>',
    guion: [
      [0, 'Gancho con §un ticket §del súper.'],
      [1, 'Versus: §izquierda y §derecha.'],
      [2, 'Barras: §una, §dos y §tres.'],
      [3, 'Contador hasta §mil.'],
      [4, 'Sello: §efecto ancla y §una frase.'],
      [5, 'Lista: §uno, §dos y §tres.'],
      [6, 'Mito: §tachado. Realidad: §verdad.'],
      [7, 'Línea: §el punto.'],
      [8, 'Pregunta: §de acuerdo o §no.'],
      [9, 'Cierre con la pregunta siguiente.']
    ],
    cierre: '¿La siguiente? <span class="c">Síguenos</span> para no perdértelo.'
  } },
  escenas: [
    P.gancho({ titulo: 'El ticket del súper <span class="c">esconde esto</span>.', objeto: { tipo: 'recibo', lineas: [['Leche', '1,15 €'], ['Pan', '0,90 €'], ['Café', '4,20 €']], total: '6,25 €' }, burbuja: '¿Tanto?' }),
    P.versus({ fuente: 'Fuente de prueba, 2026', titulo: '¿Quién paga más?', izq: { etiqueta: 'Marca blanca', valor: '1,15 €' }, der: { etiqueta: 'Marca', valor: '1,89 €', color: P.ROJO } }),
    P.barras({ titulo: 'Reparto del precio', fuente: 'Prueba', items: [{ etiqueta: 'Agricultor', valor: 24, texto: '24 %' }, { etiqueta: 'Transporte', valor: 18, texto: '18 %' }, { etiqueta: 'Súper', valor: 58, texto: '58 %' }] }),
    P.contador({ titulo: '20 € a la semana', hasta: 1040, sufijo: ' €', tarro: '1.040 €' }),
    P.sello({ texto: 'Efecto ancla', fuente: 'Tversky y Kahneman, 1974', objeto: { tipo: 'etiqueta', antes: '199 €', ahora: '99 €' }, frase: 'Un número al azar <span class="c">mueve tu respuesta</span>.' }),
    P.lista({ titulo: '3 cosas que cambian', items: ['Un pinchazo deja de ser una crisis', 'Adiós a la tarjeta al 20 %', 'Dejas de vivir <span style="color:#5eead4">al límite</span>'] }),
    P.mito({ mito: 'Alquilar es tirar el dinero.', realidad: 'Depende del precio, de los años y de lo que haces con la diferencia.' }),
    P.linea({ titulo: 'Precio en 30 días', puntos: [119, 119, 119, 120, 119, 199, 199, 99], desde: 'hace 30 días', hasta: 'hoy', destacar: 7, etiqueta: '99 €' }),
    P.pregunta({ texto: '¿Alquilar es <span class="c">tirar el dinero</span>?', opciones: ['De acuerdo', 'Para nada'] }),
    cierreCon('tarro')
  ],
  texto: { es: 'prueba' }
};
