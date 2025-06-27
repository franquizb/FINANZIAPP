// src/pages/NetWorthPage.jsx
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import useFinanceData from '../hooks/useFinanceData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// --- Constantes y Helpers movidos fuera para mayor claridad ---
const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const getMonthNameSpanish = (monthIndex) => ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'][monthIndex];
const formatCurrency = (value) => {
    if (typeof value !== 'number' || isNaN(value)) {
        return '€0,00';
    }
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);
};

// Helper para obtener el nombre de visualización de una categoría principal
const getDisplayMainCategoryName = (mainCategoryKey, userConfig) => {
    const config = userConfig || {};
    if (config.categoryDisplayNames?.[mainCategoryKey]) {
        return config.categoryDisplayNames[mainCategoryKey];
    }
    return mainCategoryKey.replace(/([A-Z])/g, ' $1').trim();
};

// Paleta de colores para los encabezados de grupo
const GROUP_COLORS = {
    'Cuentas Bancarias': '#2563eb', 
    'Inversiones': '#059669', 
    'Propiedades': '#d97706', 
    'Otros Activos': '#db2777', 
    'Deudas': '#8b5cf6', 
    'Deudas Bancarias': '#ef4444', 
    'Deudas de Tarjeta de Crédito': '#dc2626', 
    'Otras Deudas': '#b91c1c' 
};

// Estilo para el input numérico para ocultar flechas de navegador
const numberInputNoArrowStyle = {
    MozAppearance: 'textfield',
    WebkitAppearance: 'none',
    appearance: 'none',
    margin: 0,
    boxSizing: 'border-box'
};

// Componente para la celda editable
const EditableTableCell = ({ value, isEditing, onCellClick, onInputChange, onInputBlur, onInputKeyDown, inputRef, inputId, editingValue: currentEditingValue }) => {
    return (
        <td
            className="py-1 px-2 text-right border-r border-gray-700 cursor-pointer hover:bg-gray-700/50 relative dark:border-gray-600"
            onClick={onCellClick}
            style={{ minWidth: '80px' }}
        >
            {isEditing ? (
                <input
                    ref={inputRef}
                    type="number"
                    value={currentEditingValue}
                    onChange={onInputChange}
                    onBlur={onInputBlur}
                    onKeyDown={onInputKeyDown}
                    className="w-full h-full bg-gray-900 text-white text-right focus:outline-none focus:ring-1 focus:ring-blue-500 rounded absolute inset-0 p-0.5 text-xs dark:bg-gray-800 dark:text-white"
                    autoFocus
                    style={numberInputNoArrowStyle}
                />
            ) : (
                formatCurrency(value)
            )}
        </td>
    );
};


function NetWorthPage() {
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear().toString());

    const {
        financeData: rawFinanceData,
        userConfig: rawUserConfig,
        loadingData,
        errorData,
        updateFinanceData,
        getMonthName,
        availableYears,
        annualSummary
    } = useFinanceData(currentYear);

    const financeData = rawFinanceData || {};
    const userConfig = rawUserConfig || { categories: {}, categoryDisplayNames: {}, ActivosGroupOrder: [], PasivosGroupOrder: {} };
    const categories = userConfig.categories || {}; 

    const [selectedDisplayMonthIndex, setSelectedDisplayMonthIndex] = useState(new Date().getMonth());
    const [editingCell, setEditingCell] = useState(null); 
    const [editingValue, setEditingValue] = useState(''); 
    const inputRefs = useRef({}); 


    useEffect(() => {
        if (editingCell) {
            const inputId = `${editingCell.type}-${editingCell.subCategory}-${editingCell.monthIndex}`;
            const currentInputRef = inputRefs.current[inputId];
            if (currentInputRef) {
                currentInputRef.focus();
                currentInputRef.select();
            }
        }
    }, [editingCell]);

    useEffect(() => {
        if (userConfig && userConfig.defaultYear && currentYear !== userConfig.defaultYear) {
            setCurrentYear(userConfig.defaultYear);
        }
    }, [userConfig, currentYear]);


    // --- CÁLCULOS PRINCIPALES (Memoizados en un solo useMemo) ---
    const processedNetWorthData = useMemo(() => {
        const currentFinanceData = rawFinanceData || {};
        const currentUserConfig = rawUserConfig || { categories: {}, categoryDisplayNames: {}, ActivosGroupOrder: [], PasivosGroupOrder: {} };
        const currentAnnualData = currentFinanceData[currentYear] || {};
        const currentNetWorthData = currentAnnualData.netWorth || { assets: {}, liabilities: {} };
        const currentCategories = currentUserConfig.categories || {};

        if (Object.keys(currentFinanceData).length === 0 || Object.keys(currentCategories).length === 0) {
            return {
                monthlyTotals: [],
                chartData: [],
                currentDisplayMonthData: { totalAssets: 0, totalLiabilities: 0, netWorth: 0 },
                previousDisplayMonthData: null,
                currentMonthNetWorthChange: 0,
                currentMonthAssetsChange: 0,
                currentMonthLiabilitiesChange: 0,
                totalAssets: 0,
                totalLiabilities: 0,
                currentNetWorth: 0,
                netWorthData: currentNetWorthData,
            };
        }
        
        const allMonthsArray = MONTHS;

        const getFlattenedSubs = (catType) => {
            const cat = currentCategories[catType];
            if (!cat) return [];
            if (Array.isArray(cat)) { 
                return cat;
            } else if (typeof cat === 'object') {
                const order = currentUserConfig[`${catType}GroupOrder`] || Object.keys(cat);
                let flatList = [];
                order.forEach(groupName => {
                    if (cat[groupName] && Array.isArray(cat[groupName])) {
                        flatList = flatList.concat(cat[groupName]);
                    }
                });
                return flatList;
            }
            return [];
        };

        const monthlyTotalsCalculated = allMonthsArray.map((monthName, index) => {
            let totalAssets = 0;
            let totalLiabilities = 0;

            const activosSubcategoriesFlat = getFlattenedSubs('Activos');
            activosSubcategoriesFlat.forEach(subCat => {
                const value = currentNetWorthData?.Activos?.[subCat]?.[monthName];
                if (value !== undefined && !isNaN(value)) {
                    totalAssets += value;
                }
            });

            const pasivosSubcategoriesFlat = getFlattenedSubs('Pasivos');
            pasivosSubcategoriesFlat.forEach(subCat => {
                const value = currentNetWorthData?.Pasivos?.[subCat]?.[monthName];
                if (value !== undefined && !isNaN(value)) {
                    totalLiabilities += value;
                }
            });

            return {
                monthIndex: index,
                monthName: monthName,
                totalAssets,
                totalLiabilities,
                netWorth: totalAssets - totalLiabilities,
            };
        });

        const chartDataCalculated = monthlyTotalsCalculated.map((currentMonthData, index) => {
            const prevMonthData = index > 0 ? monthlyTotalsCalculated[index - 1] : null;

            const monthlyChangeAssets = prevMonthData ? currentMonthData.totalAssets - prevMonthData.totalAssets : 0;
            const monthlyChangeLiabilities = prevMonthData ? currentMonthData.totalLiabilities - prevMonthData.totalLiabilities : 0;
            const monthlyChangeNetWorth = prevMonthData ? currentMonthData.netWorth - prevMonthData.netWorth : 0;

            return {
                name: getMonthNameSpanish(index).charAt(0).toUpperCase() + getMonthNameSpanish(index).slice(1, 3),
                Activos: currentMonthData.totalAssets,
                Pasivos: currentMonthData.totalLiabilities,
                'Patrimonio Neto': currentMonthData.netWorth,
                monthlyChangeAssets,
                monthlyChangeLiabilities,
                monthlyChangeNetWorth
            };
        });

        const currentDisplayMonthDataCalc = monthlyTotalsCalculated[selectedDisplayMonthIndex] || { totalAssets: 0, totalLiabilities: 0, netWorth: 0 };
        const previousDisplayMonthDataCalc = selectedDisplayMonthIndex > 0 ? monthlyTotalsCalculated[selectedDisplayMonthIndex - 1] : null;

        const currentMonthNetWorthChangeCalc = previousDisplayMonthDataCalc ? (currentDisplayMonthDataCalc.netWorth - previousDisplayMonthDataCalc.netWorth) : 0;
        const currentMonthAssetsChangeCalc = previousDisplayMonthDataCalc ? (currentDisplayMonthDataCalc.totalAssets - previousDisplayMonthDataCalc.totalAssets) : 0;
        const currentMonthLiabilitiesChangeCalc = previousDisplayMonthDataCalc ? (currentDisplayMonthDataCalc.totalLiabilities - previousDisplayMonthDataCalc.totalLiabilities) : 0;

        const totalAssetsCalc = currentDisplayMonthDataCalc.totalAssets;
        const totalLiabilitiesCalc = currentDisplayMonthDataCalc.totalLiabilities;
        const currentNetWorthCalc = currentDisplayMonthDataCalc.netWorth;


        return {
            monthlyTotals: monthlyTotalsCalculated,
            chartData: chartDataCalculated,
            currentDisplayMonthData: currentDisplayMonthDataCalc,
            previousDisplayMonthData: previousDisplayMonthDataCalc,
            currentMonthNetWorthChange: currentMonthNetWorthChangeCalc,
            currentMonthAssetsChange: currentMonthAssetsChangeCalc,
            currentMonthLiabilitiesChange: currentMonthLiabilitiesChangeCalc,
            totalAssets: totalAssetsCalc,
            totalLiabilities: totalLiabilitiesCalc,
            currentNetWorth: currentNetWorthCalc,
            netWorthData: currentNetWorthData,
        };
    }, [rawFinanceData, rawUserConfig, currentYear, selectedDisplayMonthIndex, getMonthName, MONTHS]);

    // Desestructurar processedNetWorthData *después* de su definición
    const {
        monthlyTotals,
        chartData,
        currentDisplayMonthData,
        previousDisplayMonthData,
        currentMonthNetWorthChange,
        currentMonthAssetsChange,
        currentMonthLiabilitiesChange,
        totalAssets,
        totalLiabilities,
        currentNetWorth,
        netWorthData: processedNetWorthDataForRender,
    } = processedNetWorthData;


    // --- FUNCIONES DE MANEJO DE EVENTOS Y HELPERS DE RENDERIZADO ---
    const getFlattenedEditableSubcategories = useCallback((catType) => {
        const cat = categories[catType];
        if (!cat) return [];
        if (Array.isArray(cat)) { 
            return cat;
        } else if (typeof cat === 'object') {
            const order = userConfig[`${catType}GroupOrder`] || Object.keys(cat);
            let flatList = [];
            order.forEach(groupName => {
                if (cat[groupName] && Array.isArray(cat[groupName])) {
                    flatList = flatList.concat(cat[groupName]);
                }
            });
            return flatList;
        }
        return [];
    }, [categories, userConfig]);


    const handleValueChange = useCallback(async (monthIndex, type, subCategory, newValue) => {
        if (!currentYear || typeof currentYear !== 'string' || currentYear.length !== 4 || isNaN(parseInt(currentYear))) {
            console.error("handleValueChange: currentYear no es válido. No se puede actualizar Firebase.", currentYear);
            alert("Error: El año seleccionado no es válido. Por favor, selecciona un año correcto.");
            return false;
        }

        const monthNameForFirestore = getMonthName(monthIndex);
        const numericValue = parseFloat(newValue);
        let finalValue = isNaN(numericValue) ? 0 : numericValue;

        const newDataForUpdate = {
            [currentYear]: { 
                netWorth: {
                    [type]: {
                        [subCategory]: {
                            [monthNameForFirestore]: finalValue
                        }
                    }
                }
            }
        };

        const success = await updateFinanceData(newDataForUpdate);
        return success;
    }, [currentYear, getMonthName, updateFinanceData]);


    const handleCellClick = useCallback((monthIndex, type, subCategory, currentValue) => {
        setEditingCell({ monthIndex, type, subCategory, originalValue: currentValue });
        setEditingValue(currentValue.toString());
    }, []); 

    const handleInputChange = useCallback((e) => {
        setEditingValue(e.target.value);
    }, []);

    const handleInputBlur = useCallback(async () => {
        if (!editingCell) return;

        const { monthIndex, type, subCategory, originalValue } = editingCell;
        const numericValue = parseFloat(editingValue);
        let finalValue = isNaN(numericValue) ? 0 : numericValue;

        if (finalValue === originalValue && editingValue.trim() === originalValue.toString().trim()) {
            setEditingCell(null);
            setEditingValue('');
            return;
        }

        const success = await handleValueChange(monthIndex, type, subCategory, finalValue);
        if (success) { 
            setEditingCell(null);
            setEditingValue('');
        }
    }, [editingCell, editingValue, handleValueChange]);

    const handleInputKeyDown = useCallback(async (e) => {
        if (e.key !== 'Enter' && e.key !== 'Tab' && e.key !== 'Escape') return;
        e.preventDefault(); 

        if (e.key === 'Escape') {
            setEditingCell(null);
            setEditingValue('');
            return;
        }

        const currentEditingCell = { ...editingCell };
        if (!currentEditingCell) return;

        const blurSuccess = await handleInputBlur(); 
        if (!blurSuccess && editingCell !== null) { 
             return;
        }

        const { monthIndex, type, subCategory } = currentEditingCell; 

        let allSubcategoriesForType = getFlattenedEditableSubcategories(type);
        let currentSubCategoryIndex = allSubcategoriesForType.indexOf(subCategory);

        let nextMonthIndex = monthIndex;
        let nextSubCategory = subCategory;
        let nextType = type;
        
        let foundNextCell = false;

        if (e.key === 'Tab') {
            if (monthIndex < MONTHS.length - 1) { 
                nextMonthIndex = monthIndex + 1;
                nextSubCategory = subCategory;
                nextType = type;
                foundNextCell = true;
            } else { 
                nextMonthIndex = 0; 
                if (currentSubCategoryIndex < allSubcategoriesForType.length - 1) {
                    nextSubCategory = allSubcategoriesForType[currentSubCategoryIndex + 1];
                    nextType = type;
                    foundNextCell = true;
                } else { 
                    if (type === 'Activos') {
                        nextType = 'Pasivos';
                        const pasivosSubCategoriesFlat = getFlattenedEditableSubcategories('Pasivos');
                        if (pasivosSubCategoriesFlat.length > 0) {
                            nextSubCategory = pasivosSubCategoriesFlat[0];
                            foundNextCell = true;
                        }
                    } 
                }
            }
        } else if (e.key === 'Enter') {
            if (currentSubCategoryIndex < allSubcategoriesForType.length - 1) {
                nextSubCategory = allSubcategoriesForType[currentSubCategoryIndex + 1];
                nextType = type;
                foundNextCell = true;
            } else { 
                if (type === 'Activos') {
                    nextType = 'Pasivos';
                    const pasivosSubCategoriesFlat = getFlattenedEditableSubcategories('Pasivos');
                    if (pasivosSubCategoriesFlat.length > 0) {
                        nextSubCategory = pasivosSubCategoriesFlat[0];
                        foundNextCell = true;
                    }
                } 
            }
        }

        if (foundNextCell && nextSubCategory) { 
            const newMonthName = getMonthName(nextMonthIndex);
            const nextCellValue = processedNetWorthDataForRender?.[nextType]?.[nextSubCategory]?.[newMonthName] || 0;
            setEditingCell({ monthIndex: nextMonthIndex, type: nextType, subCategory: nextSubCategory, originalValue: nextCellValue });
            setEditingValue(nextCellValue.toString());
        } else {
            setEditingCell(null); 
        }
    }, [editingCell, handleInputBlur, getFlattenedEditableSubcategories, processedNetWorthDataForRender, getMonthName, MONTHS]);


    // Función auxiliar para renderizar una tabla de grupo (Activos/Pasivos)
    const renderGroupTable = useCallback((groupName, groupSubCategories, type) => {
        // CORRECCIÓN CLAVE: Aplanar las subcategorías del grupo aquí mismo
        const getFlattenedSubcategoriesForGroup = (mainCatKey, subGroupName) => {
            const groupContent = categories?.[mainCatKey]?.[subGroupName];
            if (!groupContent) return [];
            if (Array.isArray(groupContent)) {
                return groupContent; // Si ya es un array de subcategorías
            } else if (typeof groupContent === 'object' && groupContent !== null) {
                let flatList = [];
                // Asume que si es un objeto, contiene arrays de subcategorías (ej. { 'subgrupo1': ['item1'], 'subgrupo2': ['item2'] })
                Object.values(groupContent).forEach(subCatArray => {
                    if (Array.isArray(subCatArray)) {
                        flatList = flatList.concat(subCatArray);
                    }
                });
                return flatList;
            }
            return [];
        };

        // Obtener las subcategorías a renderizar para ESTE grupo
        const subCategoriesToRender = getFlattenedSubcategoriesForGroup(type, groupName);


        const headerColor = GROUP_COLORS[groupName] || (type === 'Activos' ? '#059669' : '#ef4444');
        
        // Si la categoría principal o el grupo no existen en userConfig, no renderizar la tabla
        if (!(categories?.[type] && categories?.[type]?.[groupName])) {
            return null;
        }

        const groupMonthlyTotals = MONTHS.map(monthName => {
            let total = 0;
            subCategoriesToRender.forEach(subCat => {
                total += processedNetWorthDataForRender?.[type]?.[subCat]?.[monthName] || 0;
            });
            return total;
        });
        
        return (
            <div key={groupName} className="mb-6">
                <h4 className="font-bold text-lg text-white p-2 rounded-t-lg" style={{ backgroundColor: headerColor }}>
                    {getDisplayMainCategoryName(groupName, userConfig)}
                </h4>
                <div className="overflow-x-auto table-wrapper rounded-b-lg border border-gray-700 dark:border-gray-600 bg-gray-600 dark:bg-gray-700">
                    <table className="min-w-full text-xs sm:text-sm text-gray-300" style={{ tableLayout: 'fixed' }}>
                        <thead>
                            <tr className="border-b border-gray-600 dark:border-gray-600">
                                <th className="py-2 px-3 text-left font-semibold sticky left-0 bg-gray-800 z-10" style={{ minWidth: '120px', width: '120px' }}>Categoría</th>
                                {MONTHS.map((month, index) => (
                                    <th key={`${groupName}-header-${month}`} className="py-2 px-3 text-right" style={{ minWidth: '80px', width: '80px' }}>{getMonthNameSpanish(index)}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {subCategoriesToRender.length > 0 ? (
                                subCategoriesToRender.map(subCat => (
                                    <tr key={subCat} className="border-b border-gray-700/50 last:border-b-0">
                                        <td className="py-2 px-3 text-left font-normal border-r border-gray-700 dark:border-gray-600 sticky left-0 bg-gray-800 z-10" style={{ minWidth: '120px', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {subCat}
                                        </td>
                                        {MONTHS.map((month, monthIndex) => {
                                            const cellValue = processedNetWorthDataForRender?.[type]?.[subCat]?.[month] || 0;
                                            const isCurrentlyEditing = editingCell?.monthIndex === monthIndex && editingCell?.type === type && editingCell?.subCategory === subCat;
                                            const inputId = `${type}-${subCat}-${monthIndex}`;
                                            return (
                                                <EditableTableCell
                                                    key={inputId}
                                                    value={cellValue}
                                                    isEditing={isCurrentlyEditing}
                                                    onCellClick={() => handleCellClick(monthIndex, type, subCat, cellValue)}
                                                    onInputChange={handleInputChange}
                                                    onInputBlur={handleInputBlur}
                                                    onInputKeyDown={handleInputKeyDown}
                                                    inputRef={(el) => (inputRefs.current[inputId] = el)}
                                                    inputId={inputId}
                                                    editingValue={editingValue} 
                                                />
                                            );
                                        })}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={MONTHS.length + 1} className="py-4 text-center text-gray-400">
                                        No hay subcategorías en este grupo.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                        <tfoot>
                            <tr className="bg-gray-500 font-bold dark:bg-gray-600">
                                <td className="py-2 px-3 text-left border-r border-gray-700 dark:border-gray-600 sticky left-0 bg-gray-500 dark:bg-gray-600 z-20" style={{ minWidth: '120px', width: '120px' }}>TOTAL {getDisplayMainCategoryName(groupName, userConfig).toUpperCase()}</td>
                                {MONTHS.map((month, index) => {
                                    const totalValue = groupMonthlyTotals[index] || 0;
                                    return (
                                        <td key={`total-${groupName}-${MONTHS[index]}`} className={`py-2 px-3 text-right ${type === 'Activos' ? 'text-green-300' : 'text-red-300'}`} style={{ minWidth: '80px', width: '80px' }}>
                                            {formatCurrency(totalValue)}
                                        </td>
                                    );
                                })}
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        );
    }, [categories, userConfig, processedNetWorthDataForRender, editingCell, editingValue, handleCellClick, handleInputChange, handleInputBlur, handleInputKeyDown, getMonthNameSpanish, MONTHS]);

    const totalAnnualIncomeActual = annualSummary?.totalActualIncome || 0;
    const totalAnnualExpenseActual = annualSummary?.totalActualExpenses || 0;
    const annualNetWorth = annualSummary?.currentNetWorth || 0;
    const annualSavingsCapacity = totalAnnualIncomeActual - totalAnnualExpenseActual;
    const currentCashBalance = annualSummary?.totalCashBalance || 0;


    if (loadingData) return <div className="text-center py-8 text-white dark:text-gray-200">Cargando datos de patrimonio neto...</div>;
    if (errorData) return <div className="text-center py-8 text-red-500 dark:text-red-400">Error al cargar datos: {errorData}</div>;
    if (Object.keys(financeData).length === 0 || Object.keys(userConfig.categories).length === 0) return (
        <div className="text-center py-8 text-gray-400 dark:text-gray-400">
            <h2 className="text-2xl">No se encontraron datos para {currentYear}.</h2>
            <p>Empieza añadiendo categorías de activos y pasivos en el menú de ajustes, y luego registra sus valores aquí.</p>
        </div>
    );

    const activosGroupOrder = userConfig.ActivosGroupOrder || Object.keys(categories.Activos || {});
    const pasivosGroupOrder = userConfig.PasivosGroupOrder || Object.keys(categories.Pasivos || {});


    return (
        <div className="p-6 bg-gray-800 rounded-lg shadow-lg dark:bg-gray-900 min-h-screen text-gray-100 dark:text-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-white dark:text-gray-200">Seguimiento de Patrimonio Neto - {currentYear}</h2>
                <div className="flex gap-4">
                    {/* Selector de Año */}
                    <select
                        value={currentYear}
                        onChange={(e) => setCurrentYear(e.target.value)}
                        className="bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                        {/* Filtrar años para evitar NaN o undefined */}
                        {availableYears.filter(year => !isNaN(year)).map(year => (
                            <option key={year} value={year.toString()}>{year.toString()}</option>
                        ))}
                    </select>
                    {/* Selector de Mes */}
                    <select
                        value={selectedDisplayMonthIndex}
                        onChange={(e) => setSelectedDisplayMonthIndex(parseInt(e.target.value))}
                        className="bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                        {MONTHS.map((month, index) => (
                            <option key={month} value={index}>{getMonthNameSpanish(index)}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Tarjetas de Resumen Anual */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8 text-center">
                <div className="bg-gray-700 p-4 rounded-lg shadow-md dark:bg-gray-800">
                    <h3 className="text-md font-semibold text-gray-300 dark:text-gray-300">Total Ingresos</h3>
                    <p className="text-xl font-bold text-green-400">{formatCurrency(totalAnnualIncomeActual)}</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg shadow-md dark:bg-gray-800">
                    <h3 className="text-md font-semibold text-gray-300 dark:text-gray-300">Total Gastos</h3>
                    <p className="text-xl font-bold text-red-400">{formatCurrency(totalAnnualExpenseActual)}</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg shadow-md dark:bg-gray-800">
                    <h3 className="text-md font-semibold text-gray-300 dark:text-gray-300">Patrimonio Neto</h3>
                    <p className="text-xl font-bold text-blue-400">{formatCurrency(annualNetWorth)}</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg shadow-md dark:bg-gray-800">
                    <h3 className="text-md font-semibold text-gray-300 dark:text-gray-300">Capacidad Ahorro</h3>
                    <p className={`text-xl font-bold ${annualSavingsCapacity >= 0 ? 'text-green-400' : 'text-orange-400'}`}>{formatCurrency(annualSavingsCapacity)}</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg shadow-md dark:bg-gray-800">
                    <h3 className="text-md font-semibold text-gray-300 dark:text-gray-300">Saldo Actual</h3>
                    <p className="text-xl font-bold text-green-400">{formatCurrency(currentCashBalance)}</p>
                </div>
            </div>


            {/* Tarjetas de Resumen para el mes seleccionado */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-700 p-4 rounded-lg shadow-md dark:bg-gray-800">
                    <h3 className="text-lg font-semibold text-gray-300 dark:text-gray-300">Activos ({getMonthNameSpanish(selectedDisplayMonthIndex)})</h3>
                    <p className="text-2xl font-bold text-green-400">
                        {formatCurrency(totalAssets)}
                    </p>
                    <p className={`text-sm ${currentMonthAssetsChange >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                        {currentMonthAssetsChange >= 0 ? '▲' : '▼'} {formatCurrency(currentMonthAssetsChange)} vs. mes anterior
                    </p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg shadow-md dark:bg-gray-800">
                    <h3 className="text-lg font-semibold text-gray-300 dark:text-gray-300">Pasivos ({getMonthNameSpanish(selectedDisplayMonthIndex)})</h3>
                    <p className="text-2xl font-bold text-red-400">
                        {formatCurrency(totalLiabilities)}
                    </p>
                    <p className={`text-sm ${currentMonthLiabilitiesChange <= 0 ? 'text-green-300' : 'text-red-300'}`}>
                        {currentMonthLiabilitiesChange <= 0 ? '▼' : '▲'} {formatCurrency(currentMonthLiabilitiesChange)} vs. mes anterior
                    </p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg shadow-md dark:bg-gray-800">
                    <h3 className="text-lg font-semibold text-gray-300 dark:text-gray-300">Patrimonio Neto ({getMonthNameSpanish(selectedDisplayMonthIndex)})</h3>
                    <p className="text-2xl font-bold text-blue-400">
                        {formatCurrency(currentNetWorth)}
                    </p>
                    <p className={`text-sm ${currentMonthNetWorthChange >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                        {currentMonthNetWorthChange >= 0 ? '▲' : '▼'} {formatCurrency(currentMonthNetWorthChange)} vs. mes anterior
                    </p>
                </div>
            </div>

            {/* Gráfico de Líneas de Patrimonio Neto (Activos, Pasivos, Patrimonio Neto) */}
            <div className="bg-gray-700 p-6 rounded-lg shadow-md mb-8 dark:bg-gray-800">
                <h3 className="text-xl font-bold text-white dark:text-gray-200">Evolución del Patrimonio Neto</h3>
                <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                        <XAxis dataKey="name" stroke="#cbd5e0" />
                        <YAxis stroke="#cbd5e0" />
                        <Tooltip
                            formatter={(value) => formatCurrency(value)}
                            labelFormatter={(label) => `Mes: ${label}`}
                            contentStyle={{ backgroundColor: '#2d3748', border: 'none', borderRadius: '4px' }}
                            itemStyle={{ color: '#ffffff' }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="Activos" stroke="#82ca9d" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="Pasivos" stroke="#ef4444" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="Patrimonio Neto" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Secciones de Tablas Editables de Activos y Pasivos (Estructura de tabla original) */}
            <div className="space-y-8 mb-8"> {/* Contenedor para las tablas grandes */}
                {/* Tabla Principal de Activos */}
                <section>
                    <h3 className="text-2xl font-bold text-white mb-4 dark:text-gray-200">Activos</h3>
                    {/* Renderiza cada grupo de Activos como una tabla separada */}
                    {activosGroupOrder.length > 0 ? (
                        activosGroupOrder.map(groupName => {
                            const groupSubCategories = categories?.Activos?.[groupName] || [];
                            if (!(categories?.Activos && categories?.Activos[groupName])) { 
                                return null;
                            }
                            return renderGroupTable(groupName, groupSubCategories, 'Activos');
                        })
                    ) : (
                        <p className="text-gray-400 text-center col-span-full">
                            ¡Crea tus categorías de Activos en la página de Ajustes para registrarlas aquí!
                        </p>
                    )}
                    {/* Fila de Gran Total Activos (por fuera de los grupos) */}
                    {(activosGroupOrder.length > 0 || (categories?.Activos && Object.keys(categories.Activos).length > 0)) && (
                        <div className="overflow-x-auto mt-4 bg-gray-600 rounded-lg overflow-hidden text-white dark:bg-gray-700">
                            <table className="min-w-full text-sm" style={{ tableLayout: 'fixed' }}>
                                <tbody>
                                    <tr className="bg-gray-500 font-bold dark:bg-gray-600">
                                        <td className="py-2 px-3 text-left border-r border-gray-700 dark:border-gray-600 sticky left-0 bg-gray-500 dark:bg-gray-600 z-20" style={{ minWidth: '120px', width: '120px' }}>TOTAL ACTIVOS</td>
                                        {MONTHS.map((month, index) => (
                                            <td key={`total-asset-grand-${month}`} className="py-2 px-3 text-right text-green-300" style={{ minWidth: '80px', width: '80px' }}>
                                                {formatCurrency(processedNetWorthData.monthlyTotals.find(m => m.monthName === month)?.totalAssets || 0)}
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                {/* Tabla Principal de Pasivos */}
                <section>
                    <h3 className="text-2xl font-bold text-white mb-4 dark:text-gray-200">Pasivos</h3>
                    {/* Renderiza cada grupo de Pasivos como una tabla separada */}
                    {pasivosGroupOrder.length > 0 ? (
                        pasivosGroupOrder.map(groupName => {
                            const groupSubCategories = categories?.Pasivos?.[groupName] || [];
                            // Si el grupo existe en userConfig.categories, lo renderizamos incluso si está vacío.
                            if (!(categories?.Pasivos && categories?.Pasivos[groupName])) { 
                                return null;
                            }
                            return renderGroupTable(groupName, groupSubCategories, 'Pasivos');
                        })
                    ) : (
                        <p className="text-gray-400 text-center col-span-full">
                            ¡Crea tus categorías de Pasivos en la página de Ajustes para registrarlas aquí!
                        </p>
                    )}
                    {/* Fila de Gran Total Pasivos (por fuera de los grupos) */}
                    {(pasivosGroupOrder.length > 0 || (categories?.Pasivos && Object.keys(categories.Pasivos).length > 0)) && (
                        <div className="overflow-x-auto mt-4 bg-gray-600 rounded-lg overflow-hidden text-white dark:bg-gray-700">
                            <table className="min-w-full text-sm" style={{ tableLayout: 'fixed' }}>
                                <tbody>
                                    <tr className="bg-gray-500 font-bold dark:bg-gray-600">
                                        <td className="py-2 px-3 text-left border-r border-gray-700 dark:border-gray-600 sticky left-0 bg-gray-500 dark:bg-gray-600 z-20" style={{ minWidth: '120px', width: '120px' }}>TOTAL PASIVOS</td>
                                        {MONTHS.map((month, index) => {
                                            const totalForMonth = (processedNetWorthData.monthlyTotals.find(m => m.monthName === month)?.totalLiabilities) || 0;
                                            return (
                                                <td key={`total-liability-grand-${month}`} className={`py-2 px-3 text-right ${totalForMonth > 0 ? 'text-red-300' : 'text-green-300'}`} style={{ minWidth: '80px', width: '80px' }}>
                                                    {formatCurrency(totalForMonth)}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>
            
            {/* Tabla de Patrimonio Neto y Variación Mensual (se mantiene igual) */}
            <div className="bg-gray-700 p-6 rounded-lg shadow-md mb-8 dark:bg-gray-800">
                <h3 className="text-xl font-bold text-white dark:text-gray-200">Resumen Mensual de Patrimonio Neto</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-gray-600 rounded-lg overflow-hidden text-white dark:bg-gray-700 text-sm">
                        <thead>
                            <tr className="bg-gray-500 dark:bg-gray-600">
                                <th className="py-2 px-3 text-left border-r border-gray-700 dark:border-gray-600">Categoría</th>
                                {MONTHS.map((month) => (
                                    <th key={`month-networth-header-${month}`} className="py-2 px-3 text-right">{getMonthNameSpanish(MONTHS.indexOf(month))}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {/* Fila de Patrimonio Neto Total */}
                            <tr className="font-bold">
                                <td className="py-2 px-3 text-left border-r border-gray-700 dark:border-gray-600">Patrimonio Neto</td>
                                {monthlyTotals.map((data) => (
                                    <td key={`networth-value-${data.monthName}`} className="py-2 px-3 text-right text-blue-300">
                                        {formatCurrency(data.netWorth)}
                                    </td>
                                ))}
                            </tr>
                            {/* Fila de Variación Mensual del Patrimonio Neto */}
                            <tr className="font-bold">
                                <td className="py-2 px-3 text-left border-r border-gray-700 dark:border-gray-600">Variación Mensual</td>
                                {chartData.map((data) => (
                                    <td key={`networth-change-${data.name}`} className={`py-2 px-3 text-right ${data.monthlyChangeNetWorth >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                                        {formatCurrency(Math.abs(data.monthlyChangeNetWorth))}
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}

export default NetWorthPage;