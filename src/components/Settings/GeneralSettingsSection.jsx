// src/components/Settings/GeneralSettingsSection.jsx
import React, { useState, useCallback } from 'react';
import useFinanceData from '../../hooks/useFinanceData';
import { useTheme } from '../../context/ThemeContext';
import { v4 as uuidv4 } from 'uuid';

// Componente de carga con spinner de círculo girando (para uso interno del componente)
const LoadingSpinner = () => {
    return (
        <div className="flex flex-col items-center justify-center text-white dark:text-gray-200 h-full py-8">
            <svg className="animate-spin h-8 w-8 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-3 text-lg">Cargando configuración general...</p>
        </div>
    );
};

function GeneralSettingsSection() {
    const { userConfig, loadingData, errorData, updateConfig } = useFinanceData(); 
    const { theme, setThemeMode } = useTheme();

    const [newBrokerName, setNewBrokerName] = useState('');
    const [editingBroker, setEditingBroker] = useState(null); // { id, name }

    const brokers = userConfig?.brokers || [];

    const handleSettingChange = (newConfigPart) => {
        if (!userConfig) return;
        updateConfig({ ...userConfig, ...newConfigPart });
    };

    const handleAddBroker = useCallback(async () => {
        if (newBrokerName.trim() === '') {
            alert("El nombre del broker no puede estar vacío.");
            return;
        }
        if (brokers.some(b => b.name.toLowerCase() === newBrokerName.trim().toLowerCase())) {
            alert("Este broker ya existe.");
            setNewBrokerName('');
            return;
        }

        const updatedBrokers = [...brokers, { id: uuidv4(), name: newBrokerName.trim() }];
        try {
            await updateConfig({ brokers: updatedBrokers }); 
            setNewBrokerName('');
        } catch (error) {
            console.error("Error al añadir broker:", error);
            alert("Fallo al añadir el broker.");
        }
    }, [newBrokerName, brokers, updateConfig]);

    const handleUpdateBroker = useCallback(async () => {
        if (!editingBroker || newBrokerName.trim() === '') {
            alert("El nombre del broker no puede estar vacío.");
            return;
        }
        if (brokers.some(b => b.name.toLowerCase() === newBrokerName.trim().toLowerCase() && b.id !== editingBroker.id)) {
            alert("Ya existe otro broker con este nombre.");
            return;
        }

        const updatedBrokers = brokers.map(b =>
            b.id === editingBroker.id ? { ...b, name: newBrokerName.trim() } : b
        );
        try {
            await updateConfig({ brokers: updatedBrokers });
            setNewBrokerName('');
            setEditingBroker(null);
        } catch (error) {
            console.error("Error al actualizar broker:", error);
            alert("Fallo al actualizar el broker.");
        }
    }, [editingBroker, newBrokerName, brokers, updateConfig]);

    const handleDeleteBroker = useCallback(async (brokerId) => {
        if (!window.confirm("¿Estás seguro de que quieres eliminar este broker?")) {
            return;
        }
        const updatedBrokers = brokers.filter(b => b.id !== brokerId);
        try {
            await updateConfig({ brokers: updatedBrokers });
        } catch (error) {
            console.error("Error al eliminar broker:", error);
            alert("Fallo al eliminar el broker.");
        }
    }, [brokers, updateConfig]);

    const startEditingBroker = useCallback((broker) => {
        setEditingBroker(broker);
        setNewBrokerName(broker.name);
    }, []);

    // Muestra el spinner si está cargando o hay un error, o si userConfig no está disponible
    if (loadingData || !userConfig) return <LoadingSpinner />;
    if (errorData) return <div className="text-center py-8 text-red-500">Error al cargar la configuración.</div>;

    return (
        <div className="w-full">
            <h3 className="text-xl font-bold text-white dark:text-gray-200 mb-4 border-b border-gray-700 pb-2">Ajustes Generales</h3>

            {/* Selector de Año por Defecto */}
            <div className="mb-4">
                <label htmlFor="defaultYear" className="block text-sm font-medium text-gray-300 mb-1 dark:text-gray-300">Año por Defecto:</label>
                <input
                    type="number"
                    id="defaultYear"
                    value={userConfig?.defaultYear || ''}
                    onChange={(e) => handleSettingChange({ defaultYear: e.target.value })}
                    className="mt-1 block w-full md:w-1/3 rounded-md border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-700 text-white p-2 dark:bg-gray-700 dark:text-white"
                />
            </div>

            {/* Selector de Idioma */}
            <div className="mb-4">
                <label htmlFor="language" className="block text-sm font-medium text-gray-300 mb-1 dark:text-gray-300">Idioma:</label>
                <select
                    id="language"
                    value={userConfig?.language || 'es'}
                    onChange={(e) => handleSettingChange({ language: e.target.value })}
                    className="mt-1 block w-full md:w-1/3 rounded-md border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-700 text-white p-2 dark:bg-gray-700 dark:text-white"
                >
                    <option value="es">Español</option>
                    <option value="en">English</option>
                </select>
            </div>

            {/* Selector de Modo Oscuro/Claro */}
            <div className="mb-6">
                <label htmlFor="themeToggle" className="block text-sm font-medium text-gray-300 mb-2 dark:text-gray-300">Tema de la Interfaz:</label>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => setThemeMode('light')}
                        className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                            theme === 'light' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300 hover:bg-gray-700'
                        }`}
                    >
                        Modo Claro
                    </button>
                    <button
                        onClick={() => setThemeMode('dark')}
                        className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                            theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300 hover:bg-gray-700'
                        }`}
                    >
                        Modo Oscuro
                    </button>
                </div>
            </div>

            {/* Sección de Gestión de Brokers (Movida aquí desde SettingsPage) */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-8 dark:bg-gray-800 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-200 mb-4 dark:text-gray-200">Gestión de Brokers</h2>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <input
                        type="text"
                        value={newBrokerName}
                        onChange={(e) => setNewBrokerName(e.target.value)}
                        placeholder="Nombre del nuevo broker"
                        className="flex-grow p-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {editingBroker ? (
                        <div className="flex gap-2">
                            <button
                                onClick={handleUpdateBroker}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                Guardar Edición
                            </button>
                            <button
                                onClick={() => { setEditingBroker(null); setNewBrokerName(''); }}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            >
                                Cancelar
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleAddBroker}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Añadir Broker
                        </button>
                    )}
                </div>

                {brokers.length === 0 ? (
                    <p className="text-gray-400">No hay brokers configurados. Añade uno para empezar.</p>
                ) : (
                    <ul className="divide-y divide-gray-700">
                        {brokers.map(broker => (
                            <li key={broker.id} className="py-2 flex justify-between items-center text-gray-300">
                                <span>{broker.name}</span>
                                <div>
                                    <button
                                        onClick={() => startEditingBroker(broker)}
                                        className="text-yellow-500 hover:text-yellow-700 mr-4"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDeleteBroker(broker.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default GeneralSettingsSection;