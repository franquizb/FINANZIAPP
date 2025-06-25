import React, { useState, useEffect, useMemo, useRef } from 'react';
// En tu proyecto real, estas serían las únicas importaciones necesarias:
import useFinanceData from '../hooks/useFinanceData';
import { functions } from '../firebase';
import { v4 as uuidv4 } from 'uuid';
import { httpsCallable } from 'firebase/functions';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';


// --- Iconos SVG para una mejor UI ---
const PlusIcon = () => <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const RefreshIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h5M20 20v-5h-5M4 4l1.5 1.5A9 9 0 0120 12M20 20l-1.5-1.5A9 9 0 004 12"></path></svg>;

// --- Componente: Modal de Confirmación ---
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
            <div className="bg-gray-800 rounded-lg p-6 shadow-xl w-full max-w-md border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
                <div className="text-gray-300 mb-6">{children}</div>
                <div className="flex justify-end gap-4">
                    <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500 text-white transition-colors">Cancelar</button>
                    <button onClick={onConfirm} className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-500 text-white transition-colors">Confirmar</button>
                </div>
            </div>
        </div>
    );
};

// --- Componente: Formulario para registrar una transacción (compra) ---
const TransactionForm = ({ onSave, onCancel }) => {
    const [transaction, setTransaction] = useState({ symbol: '', name: '', shares: '', price: '', currency: 'USD', broker: '', type: 'Stock' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTransaction(prev => ({ ...prev, [name]: name === 'symbol' ? value.toUpperCase() : value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...transaction,
            shares: parseFloat(transaction.shares),
            price: parseFloat(transaction.price),
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <input name="symbol" value={transaction.symbol} onChange={handleChange} placeholder="Símbolo (ej. AAPL)" required className="bg-gray-700 p-2 rounded-md" />
                <input name="name" value={transaction.name} onChange={handleChange} placeholder="Nombre del Activo" required className="bg-gray-700 p-2 rounded-md" />
                <input name="broker" value={transaction.broker} onChange={handleChange} placeholder="Broker / Exchange" required className="bg-gray-700 p-2 rounded-md" />
                <input name="shares" type="number" step="any" value={transaction.shares} onChange={handleChange} placeholder="Cantidad Comprada" required className="bg-gray-700 p-2 rounded-md" />
                <input name="price" type="number" step="any" value={transaction.price} onChange={handleChange} placeholder="Precio de Compra" required className="bg-gray-700 p-2 rounded-md" />
                <select name="type" value={transaction.type} onChange={handleChange} className="bg-gray-700 p-2 rounded-md">
                    <option>Stock</option> <option>Crypto</option> <option>ETF</option> <option>Fondo</option> <option>Otro</option>
                </select>
            </div>
            <div className="flex justify-end gap-4 mt-6">
                <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-700">Cancelar</button>
                <button type="submit" className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700">Registrar Compra</button>
            </div>
        </form>
    );
};

// --- Colores para el gráfico de tarta ---
const PIE_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];


function PortfolioPage() {
    const { financeData, loading: loadingData, error: errorData, updateFinanceData } = useFinanceData();
    const [showAddForm, setShowAddForm] = useState(false);
    const [assetToDelete, setAssetToDelete] = useState(null);
    const [liveQuotes, setLiveQuotes] = useState({});
    const [isFetchingQuotes, setIsFetchingQuotes] = useState(false);
    // --- NUEVOS ESTADOS ---
    const [lastUpdated, setLastUpdated] = useState(null);
    const [quoteChanges, setQuoteChanges] = useState({});

    const getLiveQuoteCallable = useMemo(() => httpsCallable(functions, 'getLiveQuote'), []);
    const portfolioAssets = useMemo(() => financeData?.portfolio?.assets || [], [financeData]);

    const formatCurrency = (value, currency = 'USD') => (typeof value === 'number') ? new Intl.NumberFormat('es-ES', { style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value) : '-';
    const formatPercentage = (value) => (typeof value === 'number') ? `${value.toFixed(2)}%` : '-';

    // --- FUNCIÓN DE FETCH REFACTORIZADA ---
    const fetchQuotes = async () => {
        if (portfolioAssets.length === 0) {
            setLiveQuotes({});
            return;
        }
        setIsFetchingQuotes(true);
        const uniqueSymbols = [...new Set(portfolioAssets.map(asset => asset.symbol))];
        
        try {
            const result = await getLiveQuoteCallable({ symbols: uniqueSymbols });
            const newQuotes = result.data || {};
            
            // Detectar cambios para el efecto visual
            const changes = {};
            Object.keys(newQuotes).forEach(symbol => {
                const oldPrice = liveQuotes[symbol]?.price;
                const newPrice = newQuotes[symbol]?.price;
                if (oldPrice && newPrice > oldPrice) changes[symbol] = 'up';
                else if (oldPrice && newPrice < oldPrice) changes[symbol] = 'down';
            });

            setLiveQuotes(newQuotes);
            setLastUpdated(new Date());
            setQuoteChanges(changes);
            // Limpiar el efecto visual después de un momento
            setTimeout(() => setQuoteChanges({}), 1500);

        } catch (error) {
            console.error("Error fetching live quotes:", error);
        } finally {
            setIsFetchingQuotes(false);
        }
    };
    
    // --- USE EFFECT MEJORADO ---
    useEffect(() => {
        fetchQuotes();
        // Intervalo de actualización reducido a 60 segundos
        const interval = setInterval(fetchQuotes, 60 * 1000); 
        return () => clearInterval(interval);
    }, [portfolioAssets.length]); // Se ejecuta solo si cambia la cantidad de activos


    const handleRegisterTransaction = async (transaction) => {
        const { symbol, name, broker, type, shares, price, currency } = transaction;
        const currentAssets = portfolioAssets;
        
        const existingAssetIndex = currentAssets.findIndex(a => a.symbol === symbol && a.broker === broker);
        let updatedAssets;

        if (existingAssetIndex > -1) {
            const existingAsset = currentAssets[existingAssetIndex];
            const oldTotalCost = existingAsset.avgCost * existingAsset.shares;
            const newTotalCost = price * shares;
            const combinedShares = existingAsset.shares + shares;
            const newAvgCost = (oldTotalCost + newTotalCost) / combinedShares;
            updatedAssets = currentAssets.map((asset, index) => index === existingAssetIndex ? { ...asset, shares: combinedShares, avgCost: newAvgCost } : asset);
        } else {
            const newAsset = { id: uuidv4(), symbol, name, broker, type, shares, avgCost: price, currency };
            updatedAssets = [...currentAssets, newAsset];
        }
        await updateFinanceData({ portfolio: { assets: updatedAssets } });
        setShowAddForm(false);
    };

    const handleDeleteAsset = async () => {
        if (!assetToDelete) return;
        const updatedAssets = portfolioAssets.filter(asset => asset.id !== assetToDelete.id);
        await updateFinanceData({ portfolio: { assets: updatedAssets } });
        setAssetToDelete(null);
    };

    const portfolioMetrics = useMemo(() => {
        let totalValue = 0, totalCost = 0, totalDayChange = 0;
        const allocationByType = {};

        portfolioAssets.forEach(asset => {
            const quote = liveQuotes[asset.symbol];
            const cost = asset.avgCost * asset.shares;
            totalCost += cost;
            const marketValue = (quote && !quote.error && typeof quote.price === 'number') ? quote.price * asset.shares : cost;
            totalValue += marketValue;
            totalDayChange += (quote && !quote.error && typeof quote.change === 'number') ? quote.change * asset.shares : 0;
            allocationByType[asset.type] = (allocationByType[asset.type] || 0) + marketValue;
        });

        const unrealizedGain = totalValue - totalCost;
        const unrealizedGainPercent = totalCost > 0 ? (unrealizedGain / totalCost) * 100 : 0;
        const previousDayValue = totalValue - totalDayChange;
        const dayChangePercent = previousDayValue > 0 ? (totalDayChange / previousDayValue) * 100 : 0;
        const allocation = Object.keys(allocationByType).map(type => ({ name: type, value: allocationByType[type]}));

        return { totalValue, totalCost, unrealizedGain, unrealizedGainPercent, totalDayChange, dayChangePercent, allocation };
    }, [portfolioAssets, liveQuotes]);
    
    const groupedAssets = useMemo(() => {
        return portfolioAssets.reduce((acc, asset) => {
            const broker = asset.broker || 'Sin Broker';
            if (!acc[broker]) acc[broker] = [];
            acc[broker].push(asset);
            return acc;
        }, {});
    }, [portfolioAssets]);

    if (loadingData && portfolioAssets.length === 0) return <div className="text-center py-10 text-white">Cargando datos de la cartera...</div>;
    if (errorData) return <div className="text-center py-10 text-red-500">Error: {errorData}</div>;

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-900 min-h-screen text-white">
            <ConfirmationModal isOpen={!!assetToDelete} onClose={() => setAssetToDelete(null)} onConfirm={handleDeleteAsset} title="Confirmar Eliminación"><p>¿Seguro que quieres eliminar <strong className="text-yellow-400">{assetToDelete?.name} ({assetToDelete?.symbol})</strong> de tu cartera?</p></ConfirmationModal>
            
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                 <h1 className="text-3xl lg:text-4xl font-extrabold text-blue-400">Mi Cartera</h1>
                 <div className="flex items-center gap-4 mt-4 sm:mt-0">
                    {lastUpdated && <span className="text-xs text-gray-400">Última act.: {lastUpdated.toLocaleTimeString()}</span>}
                    <button onClick={fetchQuotes} disabled={isFetchingQuotes} className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 disabled:opacity-50 disabled:cursor-wait"><RefreshIcon /></button>
                 </div>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="bg-gray-800 p-4 rounded-lg"><h3 className="text-gray-400">Valor Total</h3><p className="text-2xl font-bold text-blue-400">{formatCurrency(portfolioMetrics.totalValue)}</p></div>
                <div className="bg-gray-800 p-4 rounded-lg"><h3 className="text-gray-400">G/P del Día</h3><p className={`text-2xl font-bold ${portfolioMetrics.totalDayChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>{formatCurrency(portfolioMetrics.totalDayChange)} ({formatPercentage(portfolioMetrics.dayChangePercent)})</p></div>
                <div className="bg-gray-800 p-4 rounded-lg"><h3 className="text-gray-400">G/P No Realizada</h3><p className={`text-2xl font-bold ${portfolioMetrics.unrealizedGain >= 0 ? 'text-green-500' : 'text-red-500'}`}>{formatCurrency(portfolioMetrics.unrealizedGain)} ({formatPercentage(portfolioMetrics.unrealizedGainPercent)})</p></div>
                <div className="bg-gray-800 p-4 rounded-lg"><h3 className="text-gray-400">Costo Total</h3><p className="text-2xl font-bold text-gray-300">{formatCurrency(portfolioMetrics.totalCost)}</p></div>
            </section>
            
            {/* --- NUEVA SECCIÓN: GRÁFICO DE ASIGNACIÓN --- */}
            <section className="grid grid-cols-1 mb-10">
                <div className="bg-gray-800 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold text-white mb-4">Asignación de Activos</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie data={portfolioMetrics.allocation} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                {portfolioMetrics.allocation.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                            </Pie>
                            <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </section>

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-10">
                {!showAddForm ? ( <button onClick={() => setShowAddForm(true)} className="flex items-center justify-center w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-bold"><PlusIcon /> Registrar Nueva Compra</button> ) : ( <div><h2 className="text-2xl font-semibold mb-4">Registrar Compra de Activo</h2><TransactionForm onSave={handleRegisterTransaction} onCancel={() => setShowAddForm(false)} /></div> )}
            </div>

            {Object.keys(groupedAssets).sort().map(broker => (
                 <div key={broker} className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg mb-8">
                     <h2 className="text-2xl font-semibold text-gray-200 mb-4">{broker} ({groupedAssets[broker].length})</h2>
                     <div className="overflow-x-auto">
                         <table className="min-w-full divide-y divide-gray-700">
                             <thead className="bg-gray-700"><tr>{['Símbolo', 'Nombre', 'Acciones', 'Costo Prom.', 'Tipo', 'Precio Actual', 'Cambio Diario', 'Valor Mercado', 'G/P No Realizada', ''].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{h}</th>)}</tr></thead>
                             <tbody className="bg-gray-800 divide-y divide-gray-700">
                                 {groupedAssets[broker].map(asset => {
                                     const quote = liveQuotes[asset.symbol];
                                     const marketValue = quote && !quote.error && quote.price ? quote.price * asset.shares : null;
                                     const unrealizedGain = marketValue !== null ? marketValue - (asset.avgCost * asset.shares) : null;
                                     const dailyChangeValue = quote && !quote.error && quote.change ? quote.change * asset.shares : null;
                                     
                                     // --- LÓGICA DE ESTILO PARA EFECTO PULSO ---
                                     const priceChangeClass = quoteChanges[asset.symbol] === 'up' ? 'animate-pulse-green' : quoteChanges[asset.symbol] === 'down' ? 'animate-pulse-red' : '';

                                     if(isFetchingQuotes && !quote){ return (<tr key={asset.id} className="animate-pulse"><td colSpan="10" className="px-4 py-5"><div className="h-4 bg-gray-700 rounded"></div></td></tr>) }
                                     return (
                                         <tr key={asset.id} className="hover:bg-gray-700/50">
                                             <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">{asset.symbol}</td>
                                             <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{asset.name}</td>
                                             <td className="px-4 py-4 whitespace-nowrap text-sm">{asset.shares.toFixed(4)}</td>
                                             <td className="px-4 py-4 whitespace-nowrap text-sm">{formatCurrency(asset.avgCost, asset.currency)}</td>
                                             <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-400">{asset.type}</td>
                                             <td className={`px-4 py-4 whitespace-nowrap text-sm font-bold ${priceChangeClass}`}>{quote?.error ? <span className="text-yellow-500">Error</span> : formatCurrency(quote?.price, asset.currency)}</td>
                                             <td className={`px-4 py-4 whitespace-nowrap text-sm font-bold ${dailyChangeValue >= 0 ? 'text-green-500' : 'text-red-500'}`}>{formatCurrency(dailyChangeValue, asset.currency)}</td>
                                             <td className="px-4 py-4 whitespace-nowrap text-sm font-bold">{formatCurrency(marketValue, asset.currency)}</td>
                                             <td className={`px-4 py-4 whitespace-nowrap text-sm font-bold ${unrealizedGain >= 0 ? 'text-green-500' : 'text-red-500'}`}>{formatCurrency(unrealizedGain, asset.currency)}</td>
                                             <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium"><button onClick={() => setAssetToDelete(asset)} className="text-gray-500 hover:text-red-500"><DeleteIcon/></button></td>
                                         </tr>
                                     );
                                 })}
                             </tbody>
                         </table>
                     </div>
                 </div>
             ))}
             {/* Estilos para la animación de pulso, se pueden colocar en el index.css global */}
             <style>{`
                @keyframes pulse-green {
                    0%, 100% { background-color: transparent; }
                    50% { background-color: rgba(16, 185, 129, 0.3); }
                }
                .animate-pulse-green {
                    animation: pulse-green 1.5s ease-in-out;
                }
                @keyframes pulse-red {
                    0%, 100% { background-color: transparent; }
                    50% { background-color: rgba(239, 68, 68, 0.3); }
                }
                .animate-pulse-red {
                    animation: pulse-red 1.5s ease-in-out;
                }
             `}</style>
        </div>
    );
}

export default PortfolioPage;
