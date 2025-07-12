import React, { useState, useEffect, useCallback, useRef } from 'react'; // Importa useRef
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';
import useFinanceData from '../hooks/useFinanceData'; // Para acceder a userConfig y los brokers
import { v4 as uuidv4 } from 'uuid'; // Para generar IDs únicos

function AddAssetForm({ onAddAsset, onCloseForm, initialAsset = {} }) {
    const { userConfig } = useFinanceData(); // Obtener userConfig para brokers
    const [symbol, setSymbol] = useState(initialAsset.symbol || '');
    const [assetName, setAssetName] = useState(initialAsset.name || '');
    const [shares, setShares] = useState(initialAsset.shares || '');
    const [avgCost, setAvgCost] = useState(initialAsset.avgCost || '');
    const [broker, setBroker] = useState(initialAsset.broker || '');
    const [acquisitionDate, setAcquisitionDate] = useState(initialAsset.acquisitionDate || '');
    const [currency, setCurrency] = useState(initialAsset.currency || 'EUR');

    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);

    // Ref para el temporizador de debounce
    const debounceTimeoutRef = useRef(null); // <-- Nueva línea para el debounce

    const searchSymbolCallable = useCallback(
        httpsCallable(functions, 'searchSymbol'),
        [functions]
    );

    // Los brokers deberían venir de userConfig, que se carga con useFinanceData
    const brokers = userConfig?.brokers || [];

    const handleSearch = (e) => {
        const query = e.target.value;
        setSymbol(query);
        setSearchResults([]); // Limpiar resultados anteriores inmediatamente al escribir

        // Limpiar el temporizador anterior si existe
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        if (query.length < 2) { // Evitar búsquedas muy cortas
            setSearchLoading(false); // No cargar si la query es muy corta
            return;
        }

        setSearchLoading(true);

        // Establecer un nuevo temporizador
        debounceTimeoutRef.current = setTimeout(async () => {
            try {
                const result = await searchSymbolCallable({ keywords: query });
                if (result.data) {
                    setSearchResults(result.data);
                } else {
                    setSearchResults([]); // Asegurarse de que si no hay datos, se limpia el resultado
                }
            } catch (error) {
                console.error("Error al buscar símbolo:", error);
                setSearchResults([]); // Limpiar resultados en caso de error
                // Aquí podrías añadir una notificación al usuario si el error es por límite excedido
                if (error.code === 'resource-exhausted') {
                    alert('Límite de búsqueda de la API excedido. Por favor, espera un minuto e inténtalo de nuevo.');
                }
            } finally {
                setSearchLoading(false);
            }
        }, 500); // 500ms (medio segundo) de retraso
    };

    const handleSelectSymbol = (selected) => {
        setSymbol(selected.symbol);
        setAssetName(selected.name);
        setCurrency(selected.currency || 'EUR'); // Usar la moneda de la API si está disponible
        setSearchResults([]); // Limpiar resultados de búsqueda
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!symbol || !shares || !avgCost || !broker || !acquisitionDate || !currency) {
            alert("Por favor, rellena todos los campos obligatorios.");
            return;
        }

        const newAssetData = {
            id: initialAsset.id || uuidv4(), // Mantener ID si es edición, generar si es nuevo
            symbol: symbol.toUpperCase(),
            name: assetName,
            shares: parseFloat(shares),
            avgCost: parseFloat(avgCost),
            broker: broker,
            acquisitionDate: acquisitionDate,
            currency: currency,
        };
        onAddAsset(newAssetData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 text-gray-100">
            <div>
                <label htmlFor="symbol" className="block text-sm font-medium text-gray-300">Símbolo (Ticker)</label>
                <input
                    type="text"
                    id="symbol"
                    value={symbol}
                    onChange={handleSearch}
                    className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Ej: AAPL, TSLA"
                    required
                />
                {searchLoading && <p className="text-blue-400 text-sm mt-1">Buscando...</p>}
                {searchResults.length > 0 && (
                    <ul className="mt-2 bg-gray-700 border border-gray-600 rounded-md max-h-48 overflow-y-auto z-10 relative">
                        {searchResults.map((result) => (
                            <li
                                key={result.symbol}
                                className="px-4 py-2 hover:bg-gray-600 cursor-pointer border-b border-gray-600 last:border-b-0"
                                onClick={() => handleSelectSymbol(result)}
                            >
                                {result.symbol} - {result.name} ({result.currency})
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div>
                <label htmlFor="assetName" className="block text-sm font-medium text-gray-300">Nombre del Activo</label>
                <input
                    type="text"
                    id="assetName"
                    value={assetName}
                    onChange={(e) => setAssetName(e.target.value)}
                    className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm cursor-not-allowed"
                    readOnly // El nombre se establecerá al seleccionar el símbolo
                    required
                />
            </div>

            <div>
                <label htmlFor="shares" className="block text-sm font-medium text-gray-300">Cantidad de Acciones</label>
                <input
                    type="number"
                    id="shares"
                    value={shares}
                    onChange={(e) => setShares(e.target.value)}
                    className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    min="0.0001"
                    step="any"
                    required
                />
            </div>

            <div>
                <label htmlFor="avgCost" className="block text-sm font-medium text-gray-300">Coste por Unidad</label>
                <input
                    type="number"
                    id="avgCost"
                    value={avgCost}
                    onChange={(e) => setAvgCost(e.target.value)}
                    className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    min="0"
                    step="any"
                    required
                />
            </div>

            <div>
                <label htmlFor="broker" className="block text-sm font-medium text-gray-300">Broker</label>
                <select
                    id="broker"
                    value={broker}
                    onChange={(e) => setBroker(e.target.value)}
                    className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                >
                    <option value="">Selecciona un Broker</option>
                    {brokers.length === 0 ? (
                        <option value="" disabled>No hay brokers configurados. Añádelos en Ajustes.</option>
                    ) : (
                        brokers.map(b => (
                            <option key={b.id || b.name} value={b.name}>{b.name}</option>
                        ))
                    )}
                </select>
            </div>

            <div>
                <label htmlFor="acquisitionDate" className="block text-sm font-medium text-gray-300">Fecha de Adquisición</label>
                <input
                    type="date"
                    id="acquisitionDate"
                    value={acquisitionDate}
                    onChange={(e) => setAcquisitionDate(e.target.value)}
                    className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                />
            </div>

            <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-300">Moneda</label>
                <input
                    type="text"
                    id="currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm cursor-not-allowed"
                    readOnly // La moneda se establecerá al seleccionar el símbolo
                    required
                />
            </div>

            <div className="flex justify-end space-x-4">
                <button
                    type="button"
                    onClick={onCloseForm}
                    className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                >
                    {initialAsset.id ? 'Guardar Cambios' : 'Añadir Activo'}
                </button>
            </div>
        </form>
    );
}

export default AddAssetForm;