// src/pages/SettingsPage.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import useFinanceData from '../hooks/useFinanceData';
import { useTheme } from '../context/ThemeContext';

// Importa los nuevos componentes de sección
import ProfileSettingsSection from '../components/Settings/ProfileSettingsSection';
import GeneralSettingsSection from '../components/Settings/GeneralSettingsSection';
import CategoryManagementSection from '../components/Settings/CategoryManagementSection';

// --- CONSTANTES ---
// Estas constantes y componentes auxiliares DEBEN ser movidos a CategoryManagementSection.jsx
// Si solo se usan en CategoryManagementSection, no tienen por qué estar aquí.
// Pero para que el código sea funcional, se mantienen aquí temporalmente.
const CORE_CATEGORIES = ['Activos', 'Pasivos', 'Ingresos', 'GastosEsenciales', 'GastosDiscrecionales', 'PagoDeDeudas', 'AhorroEInversion'];
const PencilIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>;
const TrashIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>;
const GripVerticalIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a1 1 0 011-1h8a1 1 0 011 1v2a1 1 0 01-1 1H6a1 1 0 01-1-1V4zm0 6a1 1 0 011-1h8a1 1 0 011 1v2a1 1 0 01-1 1H6a1 1 0 01-1-1v-2zm0 6a1 1 0 011-1h8a1 1 0 011 1v2a1 1 0 01-1 1H6a1 1 0 01-1-1v-2z"></path></svg>;

const IconButton = ({ onClick, title, colorClass, children }) => (
    <button onClick={onClick} title={title} className={`p-2 rounded-full transition-colors duration-200 ${colorClass}`}>
        {children}
    </button>
);

function SortableItem({ id, children }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        padding: '12px',
        marginBottom: '8px',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    };

    return (
        <div ref={setNodeRef} style={style} className="bg-gray-700 dark:bg-gray-800">
            <div className="flex justify-between items-center w-full">
                <div className="flex-grow pr-2">{children}</div>
                <div {...attributes} {...listeners} className="p-2 rounded-full hover:bg-gray-600 cursor-grab text-gray-400">
                    <GripVerticalIcon />
                </div>
            </div>
        </div>
    );
}

const InlineEdit = ({ value, onSave, onCancel }) => {
    const [localValue, setLocalValue] = useState(value);
    const inputRef = useRef(null);
    useEffect(() => { inputRef.current?.focus(); inputRef.current?.select(); }, []);
    const handleSave = () => localValue.trim() ? onSave(localValue.trim()) : onCancel();
    const handleKeyDown = (e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') onCancel(); };
    return (
        <div className="flex-grow flex items-center gap-2">
            <input ref={inputRef} type="text" value={localValue} onChange={(e) => setLocalValue(e.target.value)} onBlur={handleSave} onKeyDown={handleKeyDown} className="w-full bg-gray-900 text-white rounded p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" />
        </div>
    );
};


function SettingsPage() {
    const { loadingData, errorData } = useFinanceData(); // Solo para manejar el estado de carga/error global
    const { theme, setThemeMode } = useTheme();

    const [activeTab, setActiveTab] = useState('profile'); // Pestaña "Mi Perfil" por defecto

    // **IMPORTANTE**: La lógica de `localUserConfig`, `editingState`, `newInputs`,
    // `sensors`, `getDisplayMainCategoryName`, `isNestedCategory`,
    // `handleConfigChange`, `handleCategoriesChange`, `handleNewInputChange`,
    // `handleAdd`, `handleDelete`, `handleSaveEdit`, `handleDragEnd`,
    // `isEditing`, y `renderCategoryContent`
    // DEBEN MOVERSE A CategoryManagementSection.jsx.
    // Solo el JSX de esas secciones las usará.

    // Aquí, solo manejamos el estado de carga/error global de la página Settings.
    if (loadingData) return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Cargando configuración...</div>;
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
                {/* Puedes añadir más pestañas aquí: Notificaciones, Seguridad, etc. */}
            </div>

            {/* Contenido de la sección de ajustes activa */}
            <div className="bg-gray-700 p-6 rounded-lg shadow-md dark:bg-gray-800">
                {activeTab === 'profile' && (
                    <ProfileSettingsSection />
                )}

                {activeTab === 'general' && (
                    <GeneralSettingsSection />
                )}

                {activeTab === 'categories' && (
                    <CategoryManagementSection />
                )}
            </div>

            {/* Sección de Otras Configuraciones - Se puede eliminar o dejar como placeholder */}
            <div className="bg-gray-700 p-6 rounded-lg shadow-md mt-8 dark:bg-gray-700">
                <h3 className="text-xl font-bold text-white mb-4 dark:text-white">Otras Configuraciones</h3>
                <p className="text-gray-300 dark:text-gray-300">Más opciones de configuración se añadirán aquí en el futuro.</p>
            </div>
        </div>
    );
}

export default SettingsPage;