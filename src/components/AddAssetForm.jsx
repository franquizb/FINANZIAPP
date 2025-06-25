import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase'; // Importa 'functions' con nombre desde tu firebase.js

function AddAssetForm({ onAddAsset, onCloseForm }) {
  const [symbol, setSymbol] = useState('');
  const [shares, setShares] = useState('');
  const [avgCost, setAvgCost] = useState('');
  const [broker, setBroker] = useState('');
  const [acquisitionDate, setAcquisitionDate] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // --- Estados para el autocompletado ---
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [fetchingSuggestions, setFetchingSuggestions] = useState(false);
  const debounceTimeoutRef = useRef(null);
  const [lastSearchedSymbol, setLastSearchedSymbol] = useState(''); // Para evitar llamadas redundantes de la API

  // Inicializa la función callable para buscar símbolos
  const searchSymbolCallable = httpsCallable(functions, 'searchSymbol'); // Renombrado para evitar conflicto con la variable de estado

  useEffect(() => {
    // Si el símbolo es demasiado corto o no ha cambiado desde la última búsqueda confirmada, no buscar
    if (symbol.length < 2 || symbol === lastSearchedSymbol) {
      setSuggestions([]); // Limpiar sugerencias si no hay suficiente texto o si es el mismo símbolo
      setShowSuggestions(false);
      return;
    }

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Establecer un timeout para buscar después de que el usuario deje de escribir
    debounceTimeoutRef.current = setTimeout(async () => {
      setFetchingSuggestions(true);
      setLastSearchedSymbol(symbol); // Marca este símbolo como el último buscado

      try {
        const result = await searchSymbolCallable({ keywords: symbol });
        console.log("Respuesta de searchSymbol Cloud Function:", result.data); // Para depuración

        // Asegúrate de que result.data sea un array antes de mapear
        if (result.data && Array.isArray(result.data)) {
          const formattedSuggestions = result.data.map(item => ({
            symbol: item.symbol,
            name: item.name
          }));
          setSuggestions(formattedSuggestions);
          setShowSuggestions(true);
        } else {
          // Si la respuesta no es un array o es nula, limpia las sugerencias
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } catch (err) {
        console.error("Error al buscar símbolos:", err);
        // Manejo de errores específicos de la función
        if (err.code === 'resource-exhausted') {
          setError('Límite de peticiones de la API excedido para búsqueda. Inténtalo de nuevo más tarde.');
        } else {
          setError('Error al buscar símbolos. Inténtalo de nuevo.');
        }
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setFetchingSuggestions(false);
      }
    }, 300); // Retraso de 300ms

    // Función de limpieza para el useEffect
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [symbol, lastSearchedSymbol, searchSymbolCallable]); // Dependencias del useEffect

  const handleSelectSuggestion = (selectedSymbol, selectedName) => {
    setSymbol(selectedSymbol); // Establece el símbolo completo
    setSuggestions([]); // Oculta las sugerencias
    setShowSuggestions(false);
    setError(''); // Limpia cualquier error de búsqueda anterior
  };

  // Ref para el contenedor del formulario para detectar clics fuera y ocultar sugerencias
  const formContainerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formContainerRef.current && !formContainerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validaciones básicas
    if (!symbol || !shares || !avgCost || !broker || !acquisitionDate) {
      setError('Por favor, rellena todos los campos obligatorios.');
      return;
    }
    if (isNaN(parseFloat(shares)) || parseFloat(shares) <= 0) {
      setError('La cantidad de acciones debe ser un número positivo.');
      return;
    }
    if (isNaN(parseFloat(avgCost)) || parseFloat(avgCost) <= 0) {
      setError('El costo promedio debe ser un número positivo.');
      return;
    }

    setLoading(true);

    // Encuentra el nombre de la empresa si fue seleccionado de las sugerencias
    const assetName = suggestions.find(s => s.symbol === symbol.toUpperCase())?.name || symbol.toUpperCase();

    const newAsset = {
      id: uuidv4(), // Generar un ID único para el activo
      symbol: symbol.toUpperCase(), // Convertir a mayúsculas para consistencia (AAPL, MSFT)
      name: assetName, // Nombre de la empresa, si está disponible
      shares: parseFloat(shares),
      avgCost: parseFloat(avgCost),
      broker: broker,
      acquisitionDate: acquisitionDate,
      currency: currency,
      // Placeholders para la cotización actual, se llenarán al cargar la lista
      currentPrice: null,
      dailyChange: null,
      dailyChangePercent: null,
    };

    try {
      await onAddAsset(newAsset); // Llamar a la función que viene de la página principal (PortfolioPage)
      // Limpiar formulario y cerrar si es exitoso
      setSymbol('');
      setShares('');
      setAvgCost('');
      setBroker('');
      setAcquisitionDate('');
      setCurrency('USD');
      setSuggestions([]); // Limpiar sugerencias
      setShowSuggestions(false);
      onCloseForm(); // Cerrar el formulario/modal si es una opción
    } catch (err) {
      console.error("Error al añadir activo:", err);
      setError("Error al añadir el activo: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" ref={formContainerRef}>
      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="symbol-input-container relative">
          <label htmlFor="symbol" className="block text-sm font-medium text-gray-300">Símbolo (Ticker)</label>
          <input
            type="text"
            id="symbol"
            className="mt-1 block w-full rounded-md border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-700 text-white p-2"
            value={symbol}
            onChange={(e) => {
              setSymbol(e.target.value);
              setError('');
            }}
            onFocus={() => { // Mostrar sugerencias al enfocar si ya hay y el input no está vacío
              if (suggestions.length > 0 && symbol.length > 0) setShowSuggestions(true);
            }}
            placeholder="Ej: AAPL, MSFT"
            required
            autoComplete="off" // Para deshabilitar el autocompletado del navegador
          />
          {fetchingSuggestions && symbol.length > 1 && (
            <p className="absolute top-full left-0 mt-1 text-sm text-gray-400">Buscando símbolos...</p>
          )}
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute z-20 w-full bg-gray-800 border border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto mt-1">
              {suggestions.map((sugg) => (
                <li
                  key={sugg.symbol}
                  className="p-2 cursor-pointer hover:bg-gray-700 text-white text-sm flex justify-between items-center"
                  onClick={() => handleSelectSuggestion(sugg.symbol, sugg.name)}
                >
                  <span>{sugg.symbol}</span>
                  <span className="text-gray-400 text-xs">{sugg.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <label htmlFor="shares" className="block text-sm font-medium text-gray-300">Cantidad de Acciones/Unidades</label>
          <input
            type="number"
            id="shares"
            className="mt-1 block w-full rounded-md border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-700 text-white p-2"
            value={shares}
            onChange={(e) => setShares(e.target.value)}
            placeholder="Ej: 10"
            step="0.01"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="avgCost" className="block text-sm font-medium text-gray-300">Costo Promedio por Unidad</label>
          <input
            type="number"
            id="avgCost"
            className="mt-1 block w-full rounded-md border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-700 text-white p-2"
            value={avgCost}
            onChange={(e) => setAvgCost(e.target.value)}
            placeholder="Ej: 150.25"
            step="0.01"
            required
          />
        </div>
        <div>
          <label htmlFor="broker" className="block text-sm font-medium text-gray-300">Bróker</label>
          <input
            type="text"
            id="broker"
            className="mt-1 block w-full rounded-md border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-700 text-white p-2"
            value={broker}
            onChange={(e) => setBroker(e.target.value)}
            placeholder="Ej: Interactive Brokers, eToro"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="acquisitionDate" className="block text-sm font-medium text-gray-300">Fecha de Adquisición</label>
          <input
            type="date"
            id="acquisitionDate"
            className="mt-1 block w-full rounded-md border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-700 text-white p-2"
            value={acquisitionDate}
            onChange={(e) => setAcquisitionDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="currency" className="block text-sm font-medium text-gray-300">Moneda</label>
          <select
            id="currency"
            className="mt-1 block w-full rounded-md border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-700 text-white p-2"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="USD">USD - Dólar Estadounidense</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - Libra Esterlina</option>
            <option value="JPY">JPY - Yen Japonés</option>
            {/* Puedes añadir más opciones según necesites */}
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCloseForm}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          disabled={loading}
        >
          {loading ? 'Añadiendo...' : 'Añadir Inversión'}
        </button>
      </div>
    </form>
  );
}

export default AddAssetForm;