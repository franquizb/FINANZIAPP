import React, { useState, useEffect, useCallback } from 'react'; 
import useFinanceData from '../hooks/useFinanceData';
import AddAssetForm from '../components/AddAssetForm';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase'; // Asegúrate de importar 'functions'

function PortfolioPage() {
  const { financeData, loadingData, errorData, updateFinanceData } = useFinanceData();
  const [showAddForm, setShowAddForm] = useState(false);
  const [liveQuotes, setLiveQuotes] = useState({}); // Estado para almacenar cotizaciones en vivo
  const [fetchingQuotes, setFetchingQuotes] = useState(false);

  // Inicializa la función callable para obtener cotizaciones
  const getLiveQuoteCallable = useCallback(
    httpsCallable(functions, 'getLiveQuote'),
    [functions] // Dependencia: solo se recrea si 'functions' cambia
  );

  const portfolioAssets = financeData?.portfolio?.assets || [];

  // Función para formatear moneda
  const formatCurrency = (value, currency = 'EUR') => { // Moneda por defecto EUR
    if (value === null || value === undefined) return '-';
    return new Intl.NumberFormat('es-ES', { // Formato es-ES para EUR
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Función para formatear porcentaje
  const formatPercentage = (value) => {
    if (value === null || value === undefined) return '-';
    return value.toFixed(2) + '%';
  };

  // Efecto para obtener las cotizaciones de los activos cuando cambian los assets
  useEffect(() => {
    const fetchQuotes = async () => {
      if (portfolioAssets.length === 0) {
        setLiveQuotes({});
        setFetchingQuotes(false); // Resetear si no hay assets
        return;
      }

      setFetchingQuotes(true);
      const quotes = {};
      const uniqueSymbols = [...new Set(portfolioAssets.map(asset => asset.symbol))]; // Evitar llamadas duplicadas

      for (const symbol of uniqueSymbols) {
        try {
          const result = await getLiveQuoteCallable({ symbol: symbol });
          if (result.data) {
            quotes[symbol] = result.data;
          }
        } catch (error) {
          console.error(`Error al obtener cotización para ${symbol}:`, error);
          quotes[symbol] = { error: 'No disponible' }; // Marcar con error
        }
      }
      setLiveQuotes(quotes);
      setFetchingQuotes(false);
    };

    fetchQuotes();
    // Considera una actualización periódica (ej. cada 5 minutos) si la API lo permite
    const interval = setInterval(fetchQuotes, 5 * 60 * 1000); // 5 minutos
    return () => clearInterval(interval); // Limpia el intervalo al desmontar
  }, [portfolioAssets, getLiveQuoteCallable]); // Dependencia en portfolioAssets y la función callable

  // Función para añadir un nuevo activo a la cartera
  const handleAddAsset = async (newAsset) => {
    try {
      const currentPortfolioAssets = financeData?.portfolio?.assets || [];
      const updatedPortfolio = {
        ...financeData?.portfolio,
        assets: [...currentPortfolioAssets, newAsset]
      };
      await updateFinanceData({ portfolio: updatedPortfolio });
      setShowAddForm(false);
      // Las cotizaciones se refrescarán automáticamente debido al useEffect cuando portfolioAssets cambie
      console.log('Activo añadido a Firestore:', newAsset);
    } catch (error) {
      console.error("Error al guardar el nuevo activo:", error);
      throw new Error("No se pudo guardar el activo en Firestore: " + error.message);
    }
  };

  // Función para eliminar un activo de la cartera
  const handleDeleteAsset = async (assetId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este activo de tu cartera?")) {
      return;
    }
    try {
      const currentPortfolioAssets = financeData.portfolio.assets || [];
      const updatedAssets = currentPortfolioAssets.filter(asset => asset.id !== assetId);
      const updatedPortfolio = {
        ...financeData.portfolio,
        assets: updatedAssets
      };
      await updateFinanceData({ portfolio: updatedPortfolio });
      console.log('Activo eliminado de Firestore:', assetId);
    } catch (error) {
      console.error("Error al eliminar activo:", error);
      alert("Fallo al eliminar el activo.");
    }
  };

  // Cálculos para las métricas de resumen de la cartera
  let totalPortfolioValue = 0;
  let totalUnrealizedGainLoss = 0;
  let totalCostBasis = 0;
  let totalDailyChange = 0;

  portfolioAssets.forEach(asset => {
    const quote = liveQuotes[asset.symbol];
    if (quote && quote.price && !quote.error) {
      const currentValue = quote.price * asset.shares;
      const originalCost = asset.avgCost * asset.shares;
      const unrealized = currentValue - originalCost;
      const dailyChangeValue = quote.change * asset.shares;

      totalPortfolioValue += currentValue;
      totalUnrealizedGainLoss += unrealized;
      totalCostBasis += originalCost;
      totalDailyChange += dailyChangeValue;
    }
  });

  const totalUnrealizedGainLossPercent = totalCostBasis > 0
    ? (totalUnrealizedGainLoss / totalCostBasis) * 100
    : 0;

  const totalDailyChangePercent = totalPortfolioValue > 0 // Basado en el valor de cierre anterior
    ? (totalDailyChange / (totalPortfolioValue - totalDailyChange)) * 100 // Estimación
    : 0;


  if (loadingData || fetchingQuotes) { // Añadir fetchingQuotes al estado de carga
    return (
      <div className="flex justify-center items-center h-full text-white dark:text-gray-200">
        Cargando datos de la cartera y cotizaciones...
      </div>
    );
  }

  if (errorData) {
    return (
      <div className="flex justify-center items-center h-full text-red-500 dark:text-red-400">
        Error al cargar la cartera: {errorData}
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-900 min-h-screen text-white dark:bg-gray-900 dark:text-gray-100">
      <h1 className="text-4xl font-extrabold text-blue-400 mb-8 border-b-2 border-blue-600 pb-2 dark:text-blue-300 dark:border-blue-700">
        Mi Cartera de Inversiones
      </h1>

      {/* Sección de resumen de la cartera */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-200 mb-2 dark:text-gray-200">Valor Total de la Cartera</h2>
          <p className="text-3xl font-bold text-green-400">{formatCurrency(totalPortfolioValue, portfolioAssets[0]?.currency || 'EUR')}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-200 mb-2 dark:text-gray-200">Ganancia/Pérdida Total No Realizada</h2>
          <p className={`text-3xl font-bold ${totalUnrealizedGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {formatCurrency(totalUnrealizedGainLoss, portfolioAssets[0]?.currency || 'EUR')} ({formatPercentage(totalUnrealizedGainLossPercent)})
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-200 mb-2 dark:text-gray-200">Cambio Diario de la Cartera</h2>
          <p className={`text-3xl font-bold ${totalDailyChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {formatCurrency(totalDailyChange, portfolioAssets[0]?.currency || 'EUR')} ({formatPercentage(totalDailyChangePercent)})
          </p>
        </div>
      </div>

      {/* Formulario para añadir activos */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-10 dark:bg-gray-800 dark:border-gray-700">
        <h2 className="text-2xl font-semibold text-gray-200 mb-4 dark:text-gray-200">Añadir Nueva Inversión</h2>
        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            + Añadir Nuevo Activo
          </button>
        ) : (
          <AddAssetForm
            onAddAsset={handleAddAsset}
            onCloseForm={() => setShowAddForm(false)}
          />
        )}
      </div>

      {/* Lista/Tabla de activos */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
        <h2 className="text-2xl font-semibold text-gray-200 mb-4 dark:text-gray-200">Activos en Cartera ({portfolioAssets.length})</h2>
        {portfolioAssets.length === 0 ? (
          <p className="text-gray-400 dark:text-gray-400">Aún no tienes activos en tu cartera. ¡Añade uno para empezar!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700 dark:divide-gray-700">
              <thead className="bg-gray-700 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider dark:text-gray-300">Símbolo</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider dark:text-gray-300">Nombre</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider dark:text-gray-300">Acciones</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider dark:text-gray-300">Costo Promedio</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider dark:text-gray-300">Broker</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider dark:text-gray-300">Cotización Actual</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider dark:text-gray-300">Cambio Diario ($)</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider dark:text-gray-300">Cambio Diario (%)</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider dark:text-gray-300">Valor de Mercado</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider dark:text-gray-300">Ganancia/Pérdida No Realizada</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider dark:text-gray-300">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700 dark:bg-gray-800 dark:divide-gray-700">
                {portfolioAssets.map((asset) => {
                  const quote = liveQuotes[asset.symbol];
                  const currentPrice = quote && !quote.error ? quote.price : null;
                  const dailyChange = quote && !quote.error ? quote.change : null;
                  const dailyChangePercent = quote && !quote.error ? quote.changePercent : null;

                  const marketValue = currentPrice !== null ? currentPrice * asset.shares : null;
                  const originalCostTotal = asset.avgCost * asset.shares;
                  const unrealizedGainLoss = marketValue !== null ? marketValue - originalCostTotal : null;
                  const unrealizedGainLossPercent = unrealizedGainLoss !== null && originalCostTotal > 0
                    ? (unrealizedGainLoss / originalCostTotal) * 100
                    : null;

                  return (
                    <tr key={asset.id} className="hover:bg-gray-700 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white dark:text-white">{asset.symbol}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 dark:text-gray-300">{asset.name || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 dark:text-gray-300">{asset.shares}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 dark:text-gray-300">{formatCurrency(asset.avgCost, asset.currency)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 dark:text-gray-300">{asset.broker}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white dark:text-white">{currentPrice !== null ? formatCurrency(currentPrice, asset.currency) : (quote?.error || '-')}</td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${dailyChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {dailyChange !== null ? formatCurrency(dailyChange, asset.currency) : '-'}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${dailyChangePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {dailyChangePercent !== null ? formatPercentage(dailyChangePercent) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white dark:text-white">{marketValue !== null ? formatCurrency(marketValue, asset.currency) : '-'}</td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${unrealizedGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {unrealizedGainLoss !== null ? `${formatCurrency(unrealizedGainLoss, asset.currency)} (${formatPercentage(unrealizedGainLossPercent)})` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDeleteAsset(asset.id)}
                          className="text-red-600 hover:text-red-900 ml-4 dark:text-red-500 dark:hover:text-red-400"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default PortfolioPage;