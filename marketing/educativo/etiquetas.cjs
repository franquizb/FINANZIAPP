// Hashtags que no sean los mismos cinco en todas las publicaciones y que, en la cuenta de España, digan que es España:
// en noviembre de 2026 casi todo el alcance de @finanziapp.es estaba en México, porque nada en los textos situaba la
// cuenta (solo el idioma). variar() conserva los hashtags propios del tema, añade el del país y completa hasta cinco
// con genéricos elegidos al azar. Lo usan encolar-instagram.cjs y publicar-facebook.cjs.
const GENERICAS = {
  es: ['#finanzaspersonales', '#educacionfinanciera', '#ahorro', '#dinero', '#ahorrar', '#finanzas', '#economiadomestica', '#consejosdeahorro'],
  en: ['#personalfinance', '#moneytips', '#financialliteracy', '#budgeting', '#savingmoney', '#moneymatters', '#financetips']
};
const PAIS = { es: ['#españa'], en: [] };
const TOTAL = 5;

function variar(texto, cuenta) {
  const lineas = texto.trimEnd().split('\n'), ultima = (lineas[lineas.length - 1] || '').trim();
  if (!GENERICAS[cuenta] || !/^(#[\p{L}\p{N}_]+\s*)+$/u.test(ultima)) return texto;   // sin línea de hashtags: no se toca
  const genericas = GENERICAS[cuenta], pais = PAIS[cuenta];
  const propias = ultima.split(/\s+/).filter(h => !genericas.includes(h.toLowerCase()) && !pais.includes(h.toLowerCase())).slice(0, TOTAL - pais.length - 1);
  const mezcla = genericas.slice();
  for (let i = mezcla.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [mezcla[i], mezcla[j]] = [mezcla[j], mezcla[i]]; }
  const relleno = mezcla.slice(0, Math.max(1, TOTAL - propias.length - pais.length));
  // El orden también cambia: unas veces el tema delante y otras los genéricos.
  const orden = Math.random() < 0.5 ? [...propias, ...relleno, ...pais] : [...relleno.slice(0, 1), ...propias, ...pais, ...relleno.slice(1)];
  lineas[lineas.length - 1] = orden.join(' ');
  return lineas.join('\n');
}

module.exports = { variar };
