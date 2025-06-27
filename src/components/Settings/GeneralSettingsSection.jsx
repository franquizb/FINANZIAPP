// src/components/Settings/GeneralSettingsSection.jsx
import React from 'react';
import useFinanceData from '../../hooks/useFinanceData';
import { useTheme } from '../../context/ThemeContext';

function GeneralSettingsSection() {
    const { userConfig, loadingData, errorData, updateConfig } = useFinanceData();
    const { theme, setThemeMode } = useTheme();

    // handleConfigChange necesita ser una función aquí o pasarse como prop si se quiere un botón de guardar único
    // Para simplificar, asumiremos que cada cambio actualiza directamente el userConfig
    const handleSettingChange = (newConfigPart) => {
        if (!userConfig) return; // Evitar errores si userConfig aún no ha cargado
        updateConfig({ ...userConfig, ...newConfigPart });
    };

    if (loadingData || !userConfig) return <div className="text-center py-8 text-white">Cargando configuración general...</div>;
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

            {/* Este botón de guardar ya no es necesario si handleSettingChange actualiza directamente */}
            {/*
            <button
                onClick={() => handleSettingChange(localUserConfig)} // Eliminar localUserConfig si no se usa
                className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
                Guardar Cambios Generales
            </button>
            */}
        </div>
    );
}

export default GeneralSettingsSection;