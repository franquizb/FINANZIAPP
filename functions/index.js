// functions/index.js
// Versión 1.4 - Corrección del uso de variables de entorno para v2.

const { https } = require("firebase-functions/v2");
const axios = require("axios");
const admin = require("firebase-admin");

// Inicializar Firebase Admin SDK
admin.initializeApp();

// La clave API se lee de las variables de entorno inyectadas por Firebase Secrets.
// ¡IMPORTANTE! Asegúrate de que esta línea sea la única forma de acceder a la clave.
const ALPHA_VANTAGE_API_KEY = process.env.ALPHAVANTAGE_KEY; // <-- ¡ESTA ES LA LÍNEA CORRECTA!

/**
 * Firebase Cloud Function para obtener la cotización en tiempo real de un símbolo bursátil.
 * Accede a la API de Alpha Vantage de forma segura.
 *
 * @param {Object} request - Objeto con los datos de la petición.
 * @param {string} request.data.symbol - El símbolo bursátil del activo (ej. "AAPL").
 * @returns {Object} Un objeto con la cotización del activo o un mensaje de error.
 */
exports.getLiveQuote = https.onCall(
  { secrets: ["ALPHAVANTAGE_KEY"] }, // Asegura que la función tiene acceso al secret
  async (request) => {
    console.log("getLiveQuote ejecutada con secret.");

    // Asegúrate de que la clave API esté definida para esta invocación
    if (!ALPHA_VANTAGE_API_KEY) {
      console.error("CRÍTICO: ALPHAVANTAGE_KEY no está disponible en el entorno de ejecución de getLiveQuote.");
      throw new https.HttpsError(
          "internal",
          "La clave API para Alpha Vantage no está configurada correctamente en el entorno de la función."
      );
    }

    // Verifica que el usuario esté autenticado
    if (!request.auth) {
      throw new https.HttpsError(
        "unauthenticated",
        "Esta función requiere autenticación."
      );
    }

    const { symbol } = request.data;

    if (!symbol) {
      throw new https.HttpsError(
        "invalid-argument",
        "El símbolo del activo es requerido."
      );
    }

    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;

    try {
      const response = await axios.get(url);
      const quoteData = response.data["Global Quote"];

      if (quoteData && Object.keys(quoteData).length > 0) {
        return {
          symbol: quoteData["01. symbol"],
          open: parseFloat(quoteData["02. open"]),
          high: parseFloat(quoteData["03. high"]),
          low: parseFloat(quoteData["04. low"]),
          price: parseFloat(quoteData["05. price"]),
          volume: parseInt(quoteData["06. volume"]),
          latestTradingDay: quoteData["07. latest trading day"],
          previousClose: parseFloat(quoteData["08. previous close"]),
          change: parseFloat(quoteData["09. change"]),
          changePercent: parseFloat(quoteData["10. change percent"].replace('%', '')),
          lastRefreshed: new Date().toISOString()
        };
      } else {
        console.warn(`No quote data found for symbol ${symbol}. API Response:`, response.data);
        throw new https.HttpsError(
          "not-found",
          `No se encontraron datos para el símbolo ${symbol}.`
        );
      }
    } catch (error) {
      console.error("Error al obtener cotización desde Alpha Vantage:", error.message);
      if (error.response) {
          console.error("Alpha Vantage API Response Data:", error.response.data);
          if (error.response.data && error.response.data["Note"]) {
              throw new https.HttpsError(
                  "resource-exhausted",
                  `Límite de peticiones de la API excedido o error de API: ${error.response.data["Note"]}`
              );
          }
      }
      throw new https.HttpsError(
        "internal",
        `Error interno al obtener cotización para ${symbol}: ${error.message}`
      );
    }
  }
);

/**
 * Firebase Cloud Function para buscar símbolos bursátiles por palabras clave.
 * Accede a la API de Alpha Vantage de forma segura.
 *
 * @param {Object} data - Objeto con los datos de la petición.
 * @param {string} data.keywords - Palabras clave para buscar (ej. "tesl", "apple").
 * @returns {Array} Un array de objetos con símbolos y nombres (ej. [{symbol: "TSLA", name: "Tesla Inc"}])
 */
exports.searchSymbol = https.onCall(
  { secrets: ["ALPHAVANTAGE_KEY"] }, // Asegura que la función tiene acceso al secret
  async (request) => {
    console.log("searchSymbol ejecutada con secret.");

    // Asegúrate de que la clave API esté definida para esta invocación
    if (!ALPHA_VANTAGE_API_KEY) {
      console.error("CRÍTICO: ALPHAVANTAGE_KEY no está disponible en el entorno de ejecución de searchSymbol.");
      throw new https.HttpsError(
          "internal",
          "La clave API no está configurada correctamente para la búsqueda de símbolos."
      );
    }

    // Verifica que el usuario esté autenticado
    if (!request.auth) {
      throw new https.HttpsError(
        "unauthenticated",
        "Esta función requiere autenticación."
      );
    }

    const { keywords } = request.data;

    if (!keywords || keywords.length < 2) {
      return []; // Devolver array vacío si las palabras clave son muy cortas
    }

    const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${keywords}&apikey=${ALPHA_VANTAGE_API_KEY}`;

    try {
      const response = await axios.get(url);
      const bestMatches = response.data.bestMatches;

      if (bestMatches && Array.isArray(bestMatches) && bestMatches.length > 0) {
        return bestMatches.map(match => ({
          symbol: match["1. symbol"],
          name: match["2. name"],
          type: match["3. type"],
          region: match["4. region"],
          currency: match["8. currency"],
        }));
      } else {
        return []; // Devolver array vacío si no hay coincidencias o la estructura es inesperada
      }
    } catch (error) {
      console.error("Error al buscar símbolo:", error.message);
      if (error.response) {
          console.error("Alpha Vantage API Response Error (searchSymbol):", error.response.data);
          if (error.response.data && error.response.data["Note"]) {
              throw new https.HttpsError(
                  "resource-exhausted",
                  `Límite de peticiones de la API excedido para búsqueda: ${error.response.data["Note"]}`
              );
          }
      }
      throw new https.HttpsError(
        "internal",
        `Error al buscar símbolo ${keywords}: ${error.message}`
      );
    }
  }
);