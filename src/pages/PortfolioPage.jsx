import React, { useState, useEffect, useCallback } from 'react';
import useFinanceData from '../hooks/useFinanceData';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';
import { v4 as uuidv4 } from 'uuid';
import AddAssetForm from '../components/AddAssetForm';

// Componente de carga con spinner de círculo girando
const LoadingSpinner = () => {
    return (
        <div className="flex flex-col items-center justify-center text-white dark:text-gray-200">
            <svg className="animate-spin h-8 w-8 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-3 text-lg">Cargando datos de la cartera y cotizaciones...</p>
        </div>
    );
};

// Componente de Skeleton para una fila de la tabla de Portfolio
const PortfolioTableRowSkeleton = () => (
    <tr className="animate-pulse">
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <div className="h-4 bg-gray-600 rounded w-16"></div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm">
            <div className="h-4 bg-gray-600 rounded w-24"></div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm">
            <div className="h-4 bg-gray-600 rounded w-10"></div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm">
            <div className="h-4 bg-gray-600 rounded w-16"></div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm">
            <div className="h-4 bg-gray-600 rounded w-20"></div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm">
            <div className="h-4 bg-gray-600 rounded w-12"></div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm">
            <div className="h-4 bg-gray-600 rounded w-16"></div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm">
            <div className="h-4 bg-gray-600 rounded w-16"></div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm">
            <div className="h-4 bg-gray-600 rounded w-10"></div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm">
            <div className="h-4 bg-gray-600 rounded w-20"></div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm">
            <div className="h-4 bg-gray-600 rounded w-24"></div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <div className="h-4 bg-gray-600 rounded w-16 ml-auto"></div>
        </td>
    </tr>
);


function PortfolioPage() {
    const { financeData, loadingData, errorData, updateFinanceData, userConfig } = useFinanceData();
    const [showAddForm, setShowAddForm] = useState(false);
    const [liveQuotes, setLiveQuotes] = useState({});
    const [fetchingQuotes, setFetchingQuotes] = useState(false);
    const [editingAsset, setEditingAsset] = useState(null);

    const getLiveQuoteCallable = useCallback(
        httpsCallable(functions, 'getLiveQuote'),
        [functions]
    );

    const searchSymbolCallable = useCallback(
        httpsCallable(functions, 'searchSymbol'),
        [functions]
    );

    const portfolioAssets = financeData?.portfolio?.assets || [];

    const formatCurrency = (value, currency = 'EUR') => {
        if (value === null || value === undefined || isNaN(value)) return '-';
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    };

    const formatPercentage = (value) => {
        if (value === null || value === undefined || isNaN(value)) return '-';
        return value.toFixed(2) + '%';
    };

    useEffect(() => {
        const fetchQuotes = async () => {
            const currentPortfolioAssets = financeData?.portfolio?.assets || [];

            if (currentPortfolioAssets.length === 0) {
                setLiveQuotes({});
                setFetchingQuotes(false);
                return;
            }

            setFetchingQuotes(true);
            const quotes = {};
            const uniqueSymbols = [...new Set(currentPortfolioAssets.map(asset => asset.symbol))];

            const fetchDelay = 13 * 1000;
            let delay = 0;

            for (const symbol of uniqueSymbols) {
                await new Promise(resolve => setTimeout(resolve, delay));
                delay += fetchDelay;

                try {
                    const result = await getLiveQuoteCallable({ symbol: symbol });
                    if (result.data) {
                        quotes[symbol] = result.data;
                    }
                } catch (error) {
                    console.error(`Error al obtener cotización para ${symbol}:`, error);
                    quotes[symbol] = { error: 'No disponible' };
                }
            }
            setLiveQuotes(quotes);
            setFetchingQuotes(false);
        };

        fetchQuotes();
        const interval = setInterval(fetchQuotes, 15 * 60 * 1000);
        return () => clearInterval(interval);

    }, [financeData, getLiveQuoteCallable]);


    const handleAddOrUpdateAsset = async (newAsset) => {
        try {
            const currentPortfolioAssets = financeData?.portfolio?.assets || [];
            let updatedAssets;

            if (newAsset.id && currentPortfolioAssets.some(asset => asset.id === newAsset.id)) {
                updatedAssets = currentPortfolioAssets.map(asset =>
                    asset.id === newAsset.id ? newAsset : asset
                );
            } else {
                const existingAssetIndex = currentPortfolioAssets.findIndex(
                    asset => asset.symbol === newAsset.symbol && asset.broker === newAsset.broker
                );

                if (existingAssetIndex !== -1) {
                    const existingAsset = currentPortfolioAssets[existingAssetIndex];

                    const totalShares = existingAsset.shares + newAsset.shares;
                    const totalCost = (existingAsset.shares * existingAsset.avgCost) + (newAsset.shares * newAsset.avgCost);
                    const newAvgCost = totalCost / totalShares;

                    const updatedExistingAsset = {
                        ...existingAsset,
                        shares: totalShares,
                        avgCost: newAvgCost,
                        acquisitionDate: new Date(newAsset.acquisitionDate) < new Date(existingAsset.acquisitionDate)
                                                ? newAsset.acquisitionDate
                                                : existingAsset.acquisitionDate,
                    };

                    updatedAssets = [...currentPortfolioAssets];
                    updatedAssets[existingAssetIndex] = updatedExistingAsset;

                } else {
                    updatedAssets = [...currentPortfolioAssets, { ...newAsset, id: uuidv4() }];
                }
            }

            const updatedPortfolio = {
                ...financeData?.portfolio,
                assets: updatedAssets
            };

            await updateFinanceData({ portfolio: updatedPortfolio });
            
            setShowAddForm(false);
            setEditingAsset(null);
        } catch (error) {
            console.error("Error al guardar/actualizar el activo:", error);
            alert("Fallo al guardar el activo: " + error.message);
        }
    };


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
        } catch (error) {
            console.error("Error al eliminar activo:", error);
            alert("Fallo al eliminar el activo.");
        }
    };

    const handleEditAsset = (asset) => {
        setEditingAsset(asset);
        setShowAddForm(true);
    };

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

    const totalDailyChangePercent = totalPortfolioValue > 0
        ? (totalDailyChange / (totalPortfolioValue - totalDailyChange)) * 100
        : 0;


    if (errorData) {
        return (
            <div className="flex justify-center items-center h-full text-red-500 dark:text-red-400">
                Error al cargar la cartera: {errorData}
            </div>
        );
    }
    
    // Vista de Carga con Skeleton Loader y LoadingSpinner
    if (loadingData || fetchingQuotes) {
        return (
            <div className="p-4 sm:p-6 lg:p-8 bg-gray-900 min-h-screen text-white dark:bg-gray-900 dark:text-gray-100">
                <h1 className="text-4xl font-extrabold text-blue-400 mb-8 border-b-2 border-blue-600 pb-2 dark:text-blue-300 dark:border-blue-700">
                    Cartera de Inversión
                </h1>
                <div className="text-center py-8 text-white dark:text-gray-200">
                    <LoadingSpinner /> {/* Usamos el nuevo componente de spinner aquí */}
                </div>
                {/* Skeleton para las tarjetas de resumen */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    <div className="animate-pulse bg-gray-800 p-6 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
                        <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
                        <div className="h-8 bg-gray-700 rounded w-1/2"></div>
                    </div>
                    <div className="animate-pulse bg-gray-800 p-6 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
                        <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
                        <div className="h-8 bg-gray-700 rounded w-1/2"></div>
                    </div>
                    <div className="animate-pulse bg-gray-800 p-6 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
                        <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
                        <div className="h-8 bg-gray-700 rounded w-1/2"></div>
                    </div>
                </div>
                {/* Skeleton para la tabla de activos */}
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
                    <div className="animate-pulse h-8 bg-gray-700 rounded w-1/3 mb-4"></div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-700 dark:divide-gray-700">
                            <thead className="bg-gray-700 dark:bg-gray-700">
                                <tr>
                                    {/* Encabezados de tabla simplificados para esqueleto */}
                                    {[...Array(12)].map((_, i) => (
                                        <th key={i} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            <div className="h-4 bg-gray-600 rounded w-full"></div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-gray-800 divide-y divide-gray-700 dark:bg-gray-800 dark:divide-gray-700">
                                {/* Múltiples filas de esqueleto */}
                                {[...Array(5)].map((_, i) => (
                                    <PortfolioTableRowSkeleton key={i} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
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

            {/* Formulario para añadir/editar activos */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-10 dark:bg-gray-800 dark:border-gray-700">
                <h2 className="text-2xl font-semibold text-gray-200 mb-4 dark:text-gray-200">
                    {editingAsset ? 'Editar Inversión' : 'Añadir Nueva Inversión'}
                </h2>
                {!showAddForm ? (
                    <button
                        onClick={() => { setShowAddForm(true); setEditingAsset(null); }}
                        className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 dark:bg-blue-700 dark:hover:bg-blue-800"
                    >
                        + Añadir Nuevo Activo
                    </button>
                ) : (
                    <AddAssetForm
                        onAddAsset={handleAddOrUpdateAsset}
                        onCloseForm={() => { setShowAddForm(false); setEditingAsset(null); }}
                        initialAsset={editingAsset || {}}
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
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider dark:text-gray-300">Fecha Adquisición</th>
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
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 dark:text-gray-300">{asset.acquisitionDate}</td>
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
                                                    onClick={() => handleEditAsset(asset)}
                                                    className="text-blue-500 hover:text-blue-700 mr-4 dark:text-blue-400 dark:hover:text-blue-300"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteAsset(asset.id)}
                                                    className="text-red-600 hover:text-red-900 dark:text-red-500 dark:hover:text-red-400"
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