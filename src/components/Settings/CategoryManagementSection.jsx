import React, { useState, useCallback, useEffect, useMemo } from 'react';
import useFinanceData from '../../hooks/useFinanceData';

// --- Iconos y Componente de Edición en Línea ---
const PencilIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>;
const TrashIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>;
const ChevronUpIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path></svg>;
const ChevronDownIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>;


const InlineEdit = ({ value, onSave, onCancel }) => {
    const [text, setText] = useState(value);
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') onSave(text.trim());
        if (e.key === 'Escape') onCancel();
    };
    return (
        <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={() => onSave(text.trim())}
            onKeyDown={handleKeyDown}
            className="w-full bg-gray-900 text-white rounded p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
        />
    );
};

// --- Componente Reutilizable para cada Grupo (ej. Cuentas Bancarias) ---
function CategoryGroup({ title, type, groupKey, subcategories, onUpdate, loanSubcategories = [] }) {
    const [newSubcategory, setNewSubcategory] = useState('');
    const [editingSub, setEditingSub] = useState(null);

    const handleAdd = () => {
        const trimmed = newSubcategory.trim();
        if (trimmed && !subcategories.includes(trimmed) && !loanSubcategories.includes(trimmed)) {
            onUpdate(type, groupKey, [...subcategories, trimmed]);
            setNewSubcategory('');
        }
    };

    const handleEdit = (oldName, newName) => {
        if (newName && newName !== oldName && !subcategories.includes(newName) && !loanSubcategories.includes(newName)) {
            const updated = subcategories.map(s => (s === oldName ? newName : s));
            onUpdate(type, groupKey, updated);
        }
        setEditingSub(null);
    };

    const handleDelete = (name) => {
        if (window.confirm(`¿Estás seguro de que quieres eliminar la subcategoría "${name}"?`)) {
            onUpdate(type, groupKey, subcategories.filter(s => s !== name));
        }
    };

    const allSubcategories = useMemo(() => {
        return [...new Set([...loanSubcategories, ...subcategories])];
    }, [loanSubcategories, subcategories]);

    const moveSubcategory = useCallback((fromIndex, toIndex) => {
        const updatedSubcategories = [...subcategories];
        const [movedItem] = updatedSubcategories.splice(fromIndex, 1);
        updatedSubcategories.splice(toIndex, 0, movedItem);
        onUpdate(type, groupKey, updatedSubcategories);
    }, [subcategories, onUpdate, type, groupKey]);


    return (
        <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="font-bold text-lg text-white mb-3">{title}</h4>
            <ul className="space-y-2">
                {allSubcategories.length === 0 && (
                    // Mensaje actualizado para grupos vacíos pero editables
                    <p className="text-gray-400 text-sm italic">
                        Añade una nueva subcategoría para este grupo.
                    </p>
                )}
                {allSubcategories.map((sub, index) => {
                    const isManagedByLoans = loanSubcategories.includes(sub);
                    const manualIndex = subcategories.indexOf(sub); // Only for manual subcategories reordering

                    return (
                        <li key={sub} className="flex justify-between items-center group bg-gray-800 p-2 rounded-md">
                            {isManagedByLoans ? (
                                <span className="text-gray-400 italic">{sub} (Préstamo)</span>
                            ) : (
                                editingSub === sub ? (
                                    <InlineEdit value={sub} onSave={(val) => handleEdit(sub, val)} onCancel={() => setEditingSub(null)} />
                                ) : (
                                    <span className="text-gray-200">{sub}</span>
                                )
                            )}
                            {!isManagedByLoans && (
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {/* Botones de reordenación de subcategorías individuales */}
                                    {manualIndex > 0 && (
                                        <button onClick={() => moveSubcategory(manualIndex, manualIndex - 1)} title="Mover arriba" className="text-gray-400 hover:text-gray-200">
                                            <ChevronUpIcon />
                                        </button>
                                    )}
                                    {manualIndex < subcategories.length - 1 && (
                                        <button onClick={() => moveSubcategory(manualIndex, manualIndex + 1)} title="Mover abajo" className="text-gray-400 hover:text-gray-200">
                                            <ChevronDownIcon />
                                        </button>
                                    )}
                                    <button onClick={() => setEditingSub(sub)} title="Editar" className="text-yellow-400 hover:text-yellow-300"><PencilIcon /></button>
                                    <button onClick={() => handleDelete(sub)} title="Eliminar" className="text-red-500 hover:text-red-400"><TrashIcon /></button>
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-600">
                <input
                    type="text"
                    value={newSubcategory}
                    onChange={(e) => setNewSubcategory(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                    placeholder="Nueva subcategoría..."
                    className="flex-grow bg-gray-800 rounded px-2 py-1 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 px-4 rounded text-white font-semibold">Añadir</button>
            </div>
        </div>
    );
}

// Componente de carga con spinner de círculo girando (para uso interno del componente)
const LoadingSpinner = () => {
    return (
        <div className="flex flex-col items-center justify-center text-white dark:text-gray-200 h-full py-8">
            <svg className="animate-spin h-8 w-8 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-3 text-lg">Cargando categorías...</p>
        </div>
    );
};

// Define los grupos por defecto. Estos son los "keys" internos y sus títulos de visualización.
const ASSET_GROUPS = {
    'Cuentas Bancarias': 'Cuentas Bancarias',
    'Inversiones': 'Inversiones',
    'Propiedades': 'Propiedades',
    'Otros Activos': 'Otros Activos'
};
const LIABILITY_GROUPS = { 'Deudas': 'Deudas' };

// Función auxiliar para distribuir elementos en columnas
// Intentará equilibrar el número de subcategorías entre las columnas
// 'groupsToDistribute' son las claves de los grupos que queremos dividir en columnas (todos los grupos, incluyendo los vacíos si es necesario)
// 'categories' es userConfig.categories
// 'loanSubcategories' es la lista de préstamos para el grupo 'Deudas'
// 'groupMapping' es ASSET_GROUPS o LIABILITY_GROUPS para obtener los títulos
// 'numColumns' es el número de columnas deseadas
const distributeIntoColumns = (groupsToDistribute, categories, loanSubcategories, groupMapping, numColumns = 2) => {
    const columns = Array.from({ length: numColumns }, () => []);
    const columnHeights = Array.from({ length: numColumns }, () => 0); // Altura aproximada basada en el número de subcategorías + algo de overhead

    // Crear un array con groupKey y su altura aproximada (número de subcategorías)
    const groupsWithHeights = groupsToDistribute.map(groupKey => {
        const currentSubcategories = categories?.[groupMapping === ASSET_GROUPS ? 'Activos' : 'Pasivos']?.[groupKey] || [];
        const currentLoanSubcategories = groupMapping === LIABILITY_GROUPS && groupKey === 'Deudas' ? loanSubcategories : [];
        const totalSubcategories = [...new Set([...currentSubcategories, ...currentLoanSubcategories])];
        return {
            groupKey,
            height: totalSubcategories.length + 2 // +2 para título y input/botón, estimación
        };
    });

    // Ordenar grupos por altura en orden descendente para llenar las columnas de manera más uniforme
    groupsWithHeights.sort((a, b) => b.height - a.height);

    // Distribuir grupos a la columna más corta
    groupsWithHeights.forEach(group => {
        const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
        columns[shortestColumnIndex].push(group.groupKey);
        columnHeights[shortestColumnIndex] += group.height;
    });

    return columns;
};

// --- Componente Principal ---
function CategoryManagementSection() {
    const { userConfig, loadingData, errorData, updateConfig, loans } = useFinanceData();

    // Estado local para mantener el orden de los grupos visible en esta página
    const [assetGroupOrder, setAssetGroupOrder] = useState([]);
    const [liabilityGroupOrder, setLiabilityGroupOrder] = useState([]);

    // Extraer las categorías y asegurar que no sean null/undefined antes de usarlas en useMemo
    const categories = userConfig?.categories || {};

    // Sincroniza el estado local con userConfig.ActivosGroupOrder/PasivosGroupOrder
    // al cargar o cuando userConfig cambia
    useEffect(() => {
        if (userConfig) {
            const currentAssetOrder = userConfig.ActivosGroupOrder?.length > 0
                ? userConfig.ActivosGroupOrder.filter(key => Object.keys(ASSET_GROUPS).includes(key))
                : Object.keys(ASSET_GROUPS);
            
            const currentLiabilityOrder = userConfig.PasivosGroupOrder?.length > 0
                ? userConfig.PasivosGroupOrder.filter(key => Object.keys(LIABILITY_GROUPS).includes(key))
                : Object.keys(LIABILITY_GROUPS);
            
            setAssetGroupOrder(currentAssetOrder);
            setLiabilityGroupOrder(currentLiabilityOrder);
        }
    }, [userConfig]); // Dependencia de userConfig para re-sincronizar el orden

    // Guarda el orden de los grupos en userConfig en Firebase
    const saveGroupOrder = useCallback((type, newOrder) => {
        if (type === 'Activos') {
            updateConfig({ ActivosGroupOrder: newOrder });
        } else if (type === 'Pasivos') {
            updateConfig({ PasivosGroupOrder: newOrder });
        }
    }, [updateConfig]);

    const handleUpdateSubcategories = useCallback((type, groupKey, newSubcategories) => {
        const newCategories = JSON.parse(JSON.stringify(userConfig.categories || {}));

        if (!newCategories[type]) {
            newCategories[type] = {};
        }
        newCategories[type][groupKey] = newSubcategories;
        
        updateConfig({ categories: newCategories });
    }, [userConfig, updateConfig]);

    // Extraer las subcategorías de préstamos activos
    const loanSubcategories = loans.map(loan => loan.loanName);

    // Funciones para reordenar los grupos
    const moveGroup = useCallback((type, fromFilteredIndex, toFilteredIndex) => {
        let currentFullOrder = type === 'Activos' ? [...assetGroupOrder] : [...liabilityGroupOrder];
        let currentFilteredOrder = type === 'Activos' ? [...filteredAssetGroupOrder] : [...filteredLiabilityGroupOrder];

        const groupKeyToMove = currentFilteredOrder[fromFilteredIndex];
        const originalIndex = currentFullOrder.indexOf(groupKeyToMove);

        const targetGroupKey = currentFilteredOrder[toFilteredIndex];
        let targetOriginalIndex;

        if (toFilteredIndex === currentFilteredOrder.length) {
            const lastFilteredGroupKey = currentFilteredOrder[currentFilteredOrder.length - 1];
            const lastFilteredOriginalIndex = currentFullOrder.indexOf(lastFilteredGroupKey);
            targetOriginalIndex = lastFilteredOriginalIndex + 1;
        }
        else if (fromFilteredIndex > toFilteredIndex) {
            targetOriginalIndex = currentFullOrder.indexOf(targetGroupKey);
        } else {
            targetOriginalIndex = currentFullOrder.indexOf(targetGroupKey);
            if (originalIndex < targetOriginalIndex) {
                targetOriginalIndex--;
            }
        }
        
        const [movedItem] = currentFullOrder.splice(originalIndex, 1);
        currentFullOrder.splice(targetOriginalIndex, 0, movedItem);
        
        if (type === 'Activos') {
            setAssetGroupOrder(currentFullOrder);
            saveGroupOrder('Activos', currentFullOrder);
        } else {
            setLiabilityGroupOrder(currentFullOrder);
            saveGroupOrder('Pasivos', currentFullOrder);
        }
    }, [assetGroupOrder, liabilityGroupOrder, saveGroupOrder, categories]); // categories como dependencia para los useMemo de las listas filtradas


    // Determinar si hay alguna subcategoría en Activos o Pasivos
    const hasAnyAssetSubcategories = useMemo(() => {
        return Object.values(categories.Activos || {}).some(group => Array.isArray(group) && group.length > 0);
    }, [categories.Activos]);

    const hasAnyLiabilitySubcategories = useMemo(() => {
        return Object.values(categories.Pasivos || {}).some(group => Array.isArray(group) && group.length > 0);
    }, [categories.Pasivos]);

    const hasAnyCategoriesDefined = hasAnyAssetSubcategories || hasAnyLiabilitySubcategories;

    // Filtrar los assetGroupOrder y liabilityGroupOrder para la sección de ORDEN
    // Solo incluir grupos que tienen al menos una subcategoría.
    const filteredAssetGroupOrder = useMemo(() => 
        assetGroupOrder.filter(groupKey => 
            categories.Activos?.[groupKey] && categories.Activos[groupKey].length > 0
        )
    , [assetGroupOrder, categories.Activos]);

    const filteredLiabilityGroupOrder = useMemo(() => 
        liabilityGroupOrder.filter(groupKey =>
            categories.Pasivos?.[groupKey] && categories.Pasivos[groupKey].length > 0
        )
    , [liabilityGroupOrder, categories.Pasivos]);

    // Distribuir grupos de activos en columnas para la sección de GESTIÓN
    // Aquí pasamos *todos* los grupos definidos en ASSET_GROUPS para que todos se muestren
    const assetColumns = useMemo(() => 
        distributeIntoColumns(Object.keys(ASSET_GROUPS), categories, loanSubcategories, ASSET_GROUPS)
    , [categories, loanSubcategories]); 

    // Distribuir grupos de pasivos en columnas para la sección de GESTIÓN
    // Aquí pasamos *todos* los grupos definidos en LIABILITY_GROUPS para que todos se muestren
    const liabilityColumns = useMemo(() => 
        distributeIntoColumns(Object.keys(LIABILITY_GROUPS), categories, loanSubcategories, LIABILITY_GROUPS)
    , [categories, loanSubcategories]);
    
    // El renderizado condicional del spinner y el error de datos debe ir al principio del componente.
    if (loadingData || !userConfig) return <LoadingSpinner />;
    if (errorData) return <div className="text-center py-8 text-red-500">Error al cargar las categorías: {errorData}</div>;

    return (
        <div className="w-full space-y-8">
            {/* Sección de Orden de Visualización de Grupos - Mostrar solo si hay categorías que no estén vacías */}
            {(filteredAssetGroupOrder.length > 0 || filteredLiabilityGroupOrder.length > 0) ? (
                <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                    <h3 className="text-xl font-bold text-white mb-4">Orden de Visualización de Grupos</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Orden de Activos */}
                        <div>
                            <h4 className="text-lg font-semibold text-green-400 mb-3">Activos</h4>
                            {filteredAssetGroupOrder.length > 0 ? (
                                <ul className="space-y-2">
                                    {filteredAssetGroupOrder.map((groupKey, index) => (
                                        <li key={groupKey} className="flex items-center justify-between bg-gray-700 p-2 rounded-md text-gray-200">
                                            <span>{index + 1}. {ASSET_GROUPS[groupKey] || groupKey}</span>
                                            <div className="flex items-center gap-1">
                                                {/* Los índices pasados a moveGroup son los del array filteredAssetGroupOrder */}
                                                {index > 0 && (
                                                    <button onClick={() => moveGroup('Activos', index, index - 1)} title="Mover arriba" className="text-gray-400 hover:text-gray-200">
                                                        <ChevronUpIcon />
                                                    </button>
                                                )}
                                                {index < filteredAssetGroupOrder.length - 1 && (
                                                    <button onClick={() => moveGroup('Activos', index, index + 1)} title="Mover abajo" className="text-gray-400 hover:text-gray-200">
                                                        <ChevronDownIcon />
                                                    </button>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-400 text-sm italic">No hay grupos de Activos con subcategorías para ordenar.</p>
                            )}
                        </div>

                        {/* Orden de Pasivos */}
                        <div>
                            <h4 className="text-lg font-semibold text-red-400 mb-3">Pasivos</h4>
                            {filteredLiabilityGroupOrder.length > 0 ? (
                                <ul className="space-y-2">
                                    {filteredLiabilityGroupOrder.map((groupKey, index) => (
                                        <li key={groupKey} className="flex items-center justify-between bg-gray-700 p-2 rounded-md text-gray-200">
                                            <span>{index + 1}. {LIABILITY_GROUPS[groupKey] || groupKey}</span>
                                            <div className="flex items-center gap-1">
                                                {/* Los índices pasados a moveGroup son los del array filteredLiabilityGroupOrder */}
                                                {index > 0 && (
                                                    <button onClick={() => moveGroup('Pasivos', index, index - 1)} title="Mover arriba" className="text-gray-400 hover:text-gray-200">
                                                        <ChevronUpIcon />
                                                    </button>
                                                )}
                                                {index < filteredLiabilityGroupOrder.length - 1 && (
                                                    <button onClick={() => moveGroup('Pasivos', index, index + 1)} title="Mover abajo" className="text-gray-400 hover:text-gray-200">
                                                        <ChevronDownIcon />
                                                    </button>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-400 text-sm italic">No hay grupos de Pasivos con subcategorías para ordenar.</p>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-8 text-gray-400 dark:text-gray-400">
                    <h2 className="text-2xl font-bold mb-2">Gestiona tus categorías</h2>
                    <p>Para empezar, añade tus primeras subcategorías en las secciones de Activos y Pasivos a continuación.</p>
                </div>
            )}

            {/* Secciones de gestión de subcategorías (Activos) - Distribuidas en columnas */}
            <div>
                <h3 className="text-2xl font-bold text-green-400 mb-4">Gestión de Subcategorías de Activos</h3>
                {/* Contenedor Flex para las columnas */}
                <div className="flex flex-col md:flex-row md:flex-wrap md:justify-between md:gap-6">
                    {assetColumns.map((col, colIndex) => (
                        // Asegúrate de que colIndex sea único si hay varias columnas
                        <div key={`asset-col-${colIndex}`} className="flex-1 min-w-[48%] mb-6 md:mb-0 space-y-6">
                            {col.map(groupKey => {
                                const title = ASSET_GROUPS[groupKey] || groupKey;
                                return (
                                    <CategoryGroup
                                        key={groupKey}
                                        title={title}
                                        type="Activos"
                                        groupKey={groupKey}
                                        subcategories={categories.Activos?.[groupKey] || []}
                                        onUpdate={handleUpdateSubcategories}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* Secciones de gestión de subcategorías (Pasivos) - Distribuidas en columnas */}
            <div>
                <h3 className="text-2xl font-bold text-red-400 mb-4">Gestión de Subcategorías de Pasivos</h3>
                <div className="flex flex-col md:flex-row md:flex-wrap md:justify-between md:gap-6">
                    {liabilityColumns.map((col, colIndex) => (
                        <div key={`liability-col-${colIndex}`} className="flex-1 min-w-[48%] mb-6 md:mb-0 space-y-6">
                            {col.map(groupKey => {
                                const title = LIABILITY_GROUPS[groupKey] || groupKey;
                                const manualSubcategories = categories.Pasivos?.[groupKey] || [];
                                return (
                                    <CategoryGroup
                                        key={groupKey}
                                        title={title}
                                        type="Pasivos"
                                        groupKey={groupKey}
                                        subcategories={manualSubcategories} 
                                        onUpdate={handleUpdateSubcategories}
                                        loanSubcategories={groupKey === 'Deudas' ? loanSubcategories : []} 
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default CategoryManagementSection;