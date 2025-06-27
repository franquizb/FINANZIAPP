// src/components/Settings/CategoryManagementSection.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import useFinanceData from '../../hooks/useFinanceData';

// --- CONSTANTES ---
const CORE_CATEGORIES = ['Activos', 'Pasivos', 'Ingresos', 'GastosEsenciales', 'GastosDiscrecionales', 'PagoDeDeudas', 'AhorroEInversion'];

// --- ICONOS SVG ---
const PencilIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>;
const TrashIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>;
const GripVerticalIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a1 1 0 011-1h8a1 1 0 011 1v2a1 1 0 01-1 1H6a1 1 0 01-1-1V4zm0 6a1 1 0 011-1h8a1 1 0 011 1v2a1 1 0 01-1 1H6a1 1 0 01-1-1v-2zm0 6a1 1 0 011-1h8a1 1 0 011 1v2a1 1 0 01-1 1H6a1 1 0 01-1-1v-2z"></path></svg>;

// --- COMPONENTES AUXILIARES ---
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


function CategoryManagementSection() {
    const { userConfig, loadingData, errorData, updateConfig } = useFinanceData();
    const [localUserConfig, setLocalUserConfig] = useState(null);
    const [editingState, setEditingState] = useState({ type: null, path: [] });
    const [newInputs, setNewInputs] = useState({ group: {}, subCategory: {} });

    useEffect(() => {
        if (userConfig) {
            setLocalUserConfig(JSON.parse(JSON.stringify(userConfig)));
        }
    }, [userConfig]);

    const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
    const getDisplayMainCategoryName = (key) => localUserConfig?.categoryDisplayNames?.[key] || key.replace(/([A-Z])/g, ' $1').trim();
    const isNestedCategory = (key) => localUserConfig && localUserConfig.categories[key] && !Array.isArray(localUserConfig.categories[key]);

    const handleConfigChange = useCallback((newConfigPart) => {
        setLocalUserConfig(prevConfig => {
            const updatedConfig = { ...prevConfig, ...newConfigPart };
            updateConfig(updatedConfig);
            return updatedConfig;
        });
    }, [updateConfig]);

    const handleCategoriesChange = useCallback((newCategories) => {
        handleConfigChange({ categories: newCategories });
    }, [handleConfigChange]);

    const handleNewInputChange = useCallback((field, value, categoryPath) => {
        setNewInputs(prev => ({
            ...prev,
            [field]: {
                ...prev[field],
                [categoryPath]: value
            }
        }));
    }, []);

    const handleAdd = useCallback((type, path) => {
        const categories = JSON.parse(JSON.stringify(localUserConfig.categories));
        if (type === 'group') {
            const [mainCat] = path;
            const groupName = newInputs.group[mainCat]?.trim();
            if (!groupName) return alert('El nombre del grupo no puede estar vacío.');
            if (categories[mainCat][groupName]) return alert('Ese grupo ya existe.');
            categories[mainCat][groupName] = [];
            const orderKey = `${mainCat}GroupOrder`;
            const newOrder = [...(localUserConfig[orderKey] || []), groupName];
            handleConfigChange({ categories, [orderKey]: newOrder });
            handleNewInputChange('group', '', mainCat);
        } else if (type === 'sub') {
            const subCatName = newInputs.subCategory[path.join('.')]?.trim();
            if(!subCatName) return alert('El nombre no puede estar vacío.');
            const [main, group] = path;
            if (!categories[main][group] || !Array.isArray(categories[main][group])) {
                console.error(`Group ${group} not found or not an array under ${main}. Initializing.`);
                categories[main][group] = [];
            }
            if (categories[main][group].includes(subCatName)) return alert('Esa subcategoría ya existe.');
            categories[main][group].push(subCatName);
            handleCategoriesChange(categories);
            handleNewInputChange('subCategory', '', path.join('.'));
        }
    }, [localUserConfig, newInputs.group, newInputs.subCategory, handleConfigChange, handleCategoriesChange, handleNewInputChange]);

    const handleDelete = useCallback((type, path) => {
        if (!window.confirm('¿Estás seguro? Esta acción no se puede deshacer y puede afectar a datos existentes.')) return;
        const config = JSON.parse(JSON.stringify(localUserConfig));
        if (type === 'group') {
            const [main, group] = path;
            delete config.categories[main][group];
            const orderKey = `${main}GroupOrder`;
            config[orderKey] = (config[orderKey] || []).filter(g => g !== group);
        } else if (type === 'sub') {
            const [main, group, sub] = path;
            config.categories[main][group] = config.categories[main][group].filter(s => s !== sub);
        }
        handleConfigChange(config);
    }, [localUserConfig, handleConfigChange]);

    const handleSaveEdit = useCallback((newValue) => {
        const { type, path } = editingState;
        const config = JSON.parse(JSON.stringify(localUserConfig));

        if (type === 'group') {
            const [mainKey, oldGroupName] = path;
            if (newValue === oldGroupName) {
                setEditingState({ type: null, path: [] });
                return;
            }
            if (Object.keys(config.categories[mainKey]).includes(newValue)) {
                alert('Ya existe un grupo con ese nombre.');
                setEditingState({ type: null, path: [] });
                return;
            }
            const oldGroups = config.categories[mainKey];
            config.categories[mainKey] = Object.keys(oldGroups).reduce((acc, key) => { acc[key === oldGroupName ? newValue : key] = oldGroups[key]; return acc; }, {});
            const orderKey = `${mainKey}GroupOrder`;
            config[orderKey] = (config[orderKey] || []).map(g => g === oldGroupName ? newValue : g);
        } else if (type === 'sub') {
            const [mainKey, groupName, oldSubName] = path;
            if (newValue === oldSubName) {
                setEditingState({ type: null, path: [] });
                return;
            }
            if (config.categories[mainKey][groupName].includes(newValue)) {
                alert('Ya existe una subcategoría con ese nombre en este grupo.');
                setEditingState({ type: null, path: [] });
                return;
            }
            config.categories[mainKey][groupName] = config.categories[mainKey][groupName].map(s => s === oldSubName ? newValue : s);
        }

        handleConfigChange(config);
        setEditingState({ type: null, path: [] });
    }, [editingState, localUserConfig, handleConfigChange]);

    const handleDragEnd = useCallback((event, mainCategoryKey) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const orderKey = `${mainCategoryKey}GroupOrder`;
        const items = localUserConfig[orderKey];
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        const newArray = [...items];
        const [movedItem] = newArray.splice(oldIndex, 1);
        newArray.splice(newIndex, 0, movedItem);
        handleConfigChange({ [orderKey]: newArray });
    }, [localUserConfig, handleConfigChange]);


    if (loadingData || !localUserConfig) return <div className="text-center py-8 text-white">Cargando configuración...</div>;
    if (errorData) return <div className="text-center py-8 text-red-500">Error al cargar la configuración.</div>;

    const isEditing = (type, path) => editingState.type === type && editingState.path.join('.') === path.join('.');

    const renderCategoryContent = (mainCatKey) => {
        const mainCat = localUserConfig.categories[mainCatKey];
        const orderKey = `${mainCatKey}GroupOrder`;
        const groupOrder = localUserConfig[orderKey] || Object.keys(mainCat || {});

        return (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, mainCatKey)}>
                <SortableContext items={groupOrder} strategy={verticalListSortingStrategy}>
                    {groupOrder.map(groupName => (
                        <SortableItem key={groupName} id={groupName}>
                            <div className="flex justify-between items-center w-full mb-2">
                                {isEditing('group', [mainCatKey, groupName]) ? <InlineEdit value={groupName} onSave={(val) => handleSaveEdit(val)} onCancel={() => setEditingState({ type: null, path: [] })} /> : <span className="font-bold text-lg text-white dark:text-white">{groupName}</span>}
                                <div className="flex items-center">
                                    <IconButton title="Editar Grupo" colorClass="text-yellow-400 hover:bg-yellow-500/20" onClick={() => setEditingState({ type: 'group', path: [mainCatKey, groupName] })}><PencilIcon /></IconButton>
                                    <IconButton title="Eliminar Grupo" colorClass="text-red-400 hover:bg-red-500/20" onClick={() => handleDelete('group', [mainCatKey, groupName])}><TrashIcon /></IconButton>
                                </div>
                            </div>
                            <ul className="list-disc pl-8 w-full">
                                {(mainCat[groupName] || []).map(subCat => (
                                    <li key={subCat} className="flex justify-between items-center py-1 group text-gray-200 dark:text-gray-200">
                                        {isEditing('sub', [mainCatKey, groupName, subCat]) ?
                                            <InlineEdit value={subCat} onSave={(val) => handleSaveEdit(val)} onCancel={() => setEditingState({ type: null, path: [] })} /> :
                                            <span>{subCat}</span>
                                        }
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <IconButton title="Editar Subcategoría" colorClass="text-yellow-400 hover:bg-yellow-500/20" onClick={() => setEditingState({ type: 'sub', path: [mainCatKey, groupName, subCat] })}><PencilIcon /></IconButton>
                                            <IconButton title="Eliminar Subcategoría" colorClass="text-red-400 hover:bg-red-500/20" onClick={() => handleDelete('sub', [mainCatKey, groupName, subCat])}><TrashIcon /></IconButton>
                                        </div>
                                    </li>
                                ))}
                                <li className="flex gap-2 mt-2">
                                    <input type="text" placeholder="Nueva subcategoría..." value={newInputs.subCategory[`${mainCatKey}.${groupName}`] || ''} onChange={(e) => handleNewInputChange('subCategory', e.target.value, `${mainCatKey}.${groupName}`)} className="flex-grow bg-gray-800 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white" />
                                    <button onClick={() => handleAdd('sub', [mainCatKey, groupName])} className="bg-blue-600 hover:bg-blue-700 px-3 rounded text-white">Añadir</button>
                                </li>
                            </ul>
                        </SortableItem>
                    ))}
                </SortableContext>
                <div className="flex gap-2 mt-4 p-2 border-t border-gray-600 dark:border-gray-600">
                    <input type="text" placeholder="Nuevo grupo..." value={newInputs.group[mainCatKey] || ''} onChange={(e) => handleNewInputChange('group', e.target.value, mainCatKey)} className="flex-grow bg-gray-800 rounded px-2 py-1 focus:ring-2 focus:ring-green-500 outline-none dark:bg-gray-700 dark:text-white" />
                    <button onClick={() => handleAdd('group', [mainCatKey])} className="bg-green-600 hover:bg-green-700 px-3 rounded text-white">Añadir Grupo</button>
                </div>
            </DndContext>
        );
    };

    return (
        <div className="w-full">
            <h3 className="text-xl font-bold text-white dark:text-gray-200 mb-4 border-b border-gray-700 pb-2">Gestionar Categorías</h3>

            {Object.keys(localUserConfig.categories)
                .filter(key => CORE_CATEGORIES.includes(key))
                .map(mainCatKey => (
                    <div key={mainCatKey} className="p-4 bg-gray-700 rounded-xl flex flex-col mb-4 dark:bg-gray-700">
                        <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-600 dark:border-gray-600">
                            <h4 className="text-xl font-bold text-blue-300 dark:text-blue-300">{getDisplayMainCategoryName(mainCatKey)}</h4>
                        </div>
                        <div className="flex-grow">
                            {isNestedCategory(mainCatKey) ? (
                                renderCategoryContent(mainCatKey)
                            ) : (
                                <ul className="list-disc pl-8 w-full">
                                    {(localUserConfig.categories[mainCatKey] || []).map(subCat => (
                                        <li key={subCat} className="flex justify-between items-center py-1 group text-gray-200 dark:text-gray-200">
                                            {isEditing('sub', [mainCatKey, subCat]) ?
                                                <InlineEdit value={subCat} onSave={(val) => handleSaveEdit(val)} onCancel={() => setEditingState({ type: null, path: [] })} /> :
                                                <span>{subCat}</span>
                                            }
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <IconButton title="Editar Subcategoría" colorClass="text-yellow-400 hover:bg-yellow-500/20" onClick={() => setEditingState({ type: 'sub', path: [mainCatKey, subCat] })}><PencilIcon /></IconButton>
                                                <IconButton title="Eliminar Subcategoría" colorClass="text-red-400 hover:bg-red-500/20" onClick={() => handleDelete('sub', [mainCatKey, subCat])}><TrashIcon /></IconButton>
                                            </div>
                                        </li>
                                    ))}
                                    <li className="flex gap-2 mt-2">
                                        <input type="text" placeholder="Nueva subcategoría..." value={newInputs.subCategory[mainCatKey] || ''} onChange={(e) => handleNewInputChange('subCategory', e.target.value, mainCatKey)} className="flex-grow bg-gray-800 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white" />
                                        <button onClick={() => handleAdd('sub', [mainCatKey])} className="bg-blue-600 hover:bg-blue-700 px-3 rounded text-white">Añadir</button>
                                    </li>
                                </ul>
                            )}
                        </div>
                    </div>
                ))}
                {/* Este es el botón de añadir subcategoría para categorías NO ANIDADAS como Ingresos, GastosEsenciales, etc. */}
                {/* Se renderiza fuera del map anterior para que aparezca una vez por cada categoría principal plana */}
                {Object.keys(localUserConfig.categories)
                    .filter(key => CORE_CATEGORIES.includes(key) && !isNestedCategory(key))
                    .map(mainCatKey => (
                        <div key={`add-subcat-flat-${mainCatKey}`} className="flex gap-2 mt-4 p-2 border-t border-gray-600 dark:border-gray-600">
                            <input type="text" placeholder="Nueva subcategoría..." value={newInputs.subCategory[mainCatKey] || ''} onChange={(e) => handleNewInputChange('subCategory', e.target.value, mainCatKey)} className="flex-grow bg-gray-800 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white" />
                            <button onClick={() => handleAdd('sub', [mainCatKey])} className="bg-blue-600 hover:bg-blue-700 px-3 rounded text-white">Añadir Subcategoría</button>
                        </div>
                    ))
                }
        </div>
    );
}

export default CategoryManagementSection;