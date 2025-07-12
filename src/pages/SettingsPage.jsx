import React, { useState, useEffect } from 'react';
import useFinanceData from '../hooks/useFinanceData';
import { useTheme } from '../context/ThemeContext'; 

// Importa los componentes de sección
import ProfileSettingsSection from '../components/Settings/ProfileSettingsSection';
import GeneralSettingsSection from '../components/Settings/GeneralSettingsSection';
import CategoryManagementSection from '../components/Settings/CategoryManagementSection';

// Componente de carga con spinner de círculo girando
const LoadingSpinner = () => {
    return (
        <div className="flex flex-col items-center justify-center text-white dark:text-gray-200 h-full">
            <svg className="animate-spin h-8 w-8 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-3 text-lg">Cargando configuración...</p>
        </div>
    );
};


function SettingsPage() {
    // Solo necesitamos loadingData y errorData para la carga *inicial* de toda la página
    const { loadingData, errorData } = useFinanceData(); 
    const [activeTab, setActiveTab] = useState('profile');

    if (loadingData) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            <LoadingSpinner />
        </div>
    );
    if (errorData) return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-red-500">Error al cargar la configuración.</div>;

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-900 min-h-screen text-white dark:bg-gray-900 dark:text-white">
            <h1 className="text-4xl font-extrabold text-blue-400 mb-8 border-b-2 border-blue-600 pb-2">
                Configuración
            </h1>

            {/* Menú de navegación secundario para las secciones de ajustes */}
            <div className="flex border-b border-gray-700 mb-6">
                <button
                    className={`py-2 px-4 ${activeTab === 'profile' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400 hover:text-gray-200'}`}
                    onClick={() => setActiveTab('profile')}
                >
                    Mi Perfil
                </button>
                <button
                    className={`py-2 px-4 ${activeTab === 'general' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400 hover:text-gray-200'}`}
                    onClick={() => setActiveTab('general')}
                >
                    Generales
                </button>
                <button
                    className={`py-2 px-4 ${activeTab === 'categories' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400 hover:text-gray-200'}`}
                    onClick={() => setActiveTab('categories')}
                >
                    Categorías
                </button>
            </div>

            {/* Contenido de la sección de ajustes activa */}
            <div className="bg-gray-700 p-6 rounded-lg shadow-md dark:bg-gray-800">
                {activeTab === 'profile' && <ProfileSettingsSection />}
                {activeTab === 'general' && <GeneralSettingsSection />}
                {activeTab === 'categories' && <CategoryManagementSection />}
            </div>
            {/* La sección "Otras Configuraciones" ha sido eliminada */}
        </div>
    );
}

export default SettingsPage;