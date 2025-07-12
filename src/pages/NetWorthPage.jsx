import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import useFinanceData from '../hooks/useFinanceData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// --- Constantes y Helpers movidos fuera para mayor claridad ---
const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const getMonthNameSpanish = (monthIndex) => ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'][monthIndex];

// Función original para formato de moneda con decimales
const formatCurrency = (value) => {
    if (typeof value !== 'number' || isNaN(value)) {
        return '€0,00';
    }
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);
};

// Formato para números grandes sin decimales y con abreviación
const formatLargeNumber = (value) => {
    if (typeof value !== 'number' || isNaN(value)) {
        return '0';
    }
    const absValue = Math.abs(value);
    let formattedValue;
    let suffix = '';

    if (absValue >= 1_000_000) { // Millones
        formattedValue = (value / 1_000_000).toFixed(1);
        suffix = 'M';
    } else if (absValue >= 1_000) { // Miles
        formattedValue = (value / 1_000).toFixed(0); // Redondeado a entero para miles
        suffix = 'K';
    } else { // Menos de mil
        formattedValue = value.toFixed(0); // Sin decimales para números pequeños
    }

    // Quitar .0 si es un número entero después de la división
    if (formattedValue.endsWith('.0')) {
        formattedValue = formattedValue.slice(0, -2);
    }
    
    // Añadir el símbolo de euro y la abreviación
    return `€${formattedValue}${suffix}`;
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
const EditableTableCell = ({ value, isEditing, onCellClick, onInputChange, onInputBlur, onInputKeyDown, inputRef, inputId, editingValue: currentEditingValue, className = "" }) => {
    return (
        <td
            className={`py-1 px-2 text-right border-r border-gray-700 cursor-pointer hover:bg-gray-700/50 relative dark:border-gray-600 ${className}`}
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

// Nuevo componente para mostrar el detalle mensual de una subcategoría en móvil
const SubcategoryMonthlyDetail = ({ subCategory, type, processedNetWorthDataForRender, handleCellClick, editingCell, handleInputChange, handleInputBlur, handleInputKeyDown, inputRefs }) => {
    const headerColor = GROUP_COLORS[type === 'Activos' ? 'Cuentas Bancarias' : 'Deudas Bancarias'] || (type === 'Activos' ? '#059669' : '#ef4444'); // Default color

    return (
        <div className="bg-gray-700 p-4 rounded-lg shadow-md mt-4 dark:bg-gray-800">
            <h5 className="font-semibold text-white mb-3 text-center" style={{ color: headerColor }}>{subCategory}</h5>
            <div className="overflow-x-auto text-xs">
                <table className="min-w-full text-gray-300" style={{ tableLayout: 'fixed' }}>
                    <thead>
                        <tr className="border-b border-gray-600">
                            <th className="py-1 px-2 text-left font-semibold" style={{ width: '60px' }}>Mes</th>
                            <th className="py-1 px-2 text-right font-semibold">Valor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {MONTHS.map((month, monthIndex) => {
                            const cellValue = processedNetWorthDataForRender?.[type]?.[subCategory]?.[month] || 0;
                            const isCurrentlyEditing = editingCell?.monthIndex === monthIndex && editingCell?.type === type && editingCell?.subCategory === subCategory;
                            const inputId = `${type}-${subCategory}-${monthIndex}`;
                            return (
                                <tr key={month} className="border-b border-gray-700/50 last:border-b-0">
                                    <td className="py-1 px-2 text-left">{getMonthNameSpanish(monthIndex).substring(0, 3).toLowerCase()}</td>
                                    <EditableTableCell
                                        value={cellValue}
                                        isEditing={isCurrentlyEditing}
                                        onCellClick={() => handleCellClick(monthIndex, type, subCategory, cellValue)}
                                        onInputChange={handleInputChange}
                                        onInputBlur={handleInputBlur}
                                        onInputKeyDown={handleInputKeyDown}
                                        inputRef={(el) => (inputRefs.current[inputId] = el)}
                                        inputId={inputId}
                                        editingValue={editingCell?.monthIndex === monthIndex && editingCell?.type === type && editingCell?.subCategory === subCategory ? editingValue : cellValue.toString()}
                                        className="py-1 px-2"
                                    />
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Componente de carga con spinner de círculo girando
const LoadingSpinner = () => {
    return (
        <div className="flex flex-col items-center justify-center text-white dark:text-gray-200">
            <svg className="animate-spin h-8 w-8 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-3 text-lg">Cargando datos de patrimonio neto...</p>
        </div>
    );
};


function NetWorthPage() {
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear().toString());
    const [viewMonthlyDetail, setViewMonthlyDetail] = useState(null); // { type: 'Activos'/'Pasivos', subCategory: 'SubcatName' }

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
    // Estado para controlar que el año por defecto solo se establezca una vez.
    const [isInitialYearSet, setIsInitialYearSet] = useState(false);


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

    // Se reemplaza la lógica anterior por esta, que es segura y no bloquea al usuario.
    useEffect(() => {
        if (userConfig?.defaultYear && !isInitialYearSet) {
            if (availableYears && availableYears.map(String).includes(String(userConfig.defaultYear))) {
                setCurrentYear(String(userConfig.defaultYear));
            }
            setIsInitialYearSet(true);
        }
    }, [userConfig, availableYears, isInitialYearSet]);


    // --- CÁLCULOS PRINCIPALES (Memoizados en un solo useMemo) ---
    const processedNetWorthData = useMemo(() => {
        const currentFinanceData = rawFinanceData || {};
        const currentUserConfig = rawUserConfig || { categories: {}, categoryDisplayNames: {}, ActivosGroupOrder: [], PasivosGroupOrder: {} };
        const currentAnnualData = currentFinanceData[currentYear] || {};
        const currentNetWorthData = currentAnnualData.netWorth || { assets: {}, liabilities: {} };
        const currentCategories = currentUserConfig.categories || {};

        // Added check for currentCategories existence to prevent errors if userConfig.categories is empty or undefined
        if (Object.keys(currentFinanceData).length === 0 && (!currentCategories || (Object.keys(currentCategories?.Activos || {}).length === 0 && Object.keys(currentCategories?.Pasivos || {}).length === 0))) {
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
                name: getMonthNameSpanish(index).charAt(0).toLowerCase() + getMonthNameSpanish(index).slice(1, 3), // e.g., "ene", "feb"
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
    }, [rawFinanceData, rawUserConfig, currentYear, selectedDisplayMonthIndex, getMonthName]);

    // Desestructurar processedNetWorthData *después* de su definición
    const {
        monthlyTotals,
        chartData,
        currentDisplayMonthData,
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
        // Use the most recent categories from the hook
        const currentCategories = rawUserConfig?.categories || {};
        const cat = currentCategories[catType];
        if (!cat) return [];
        if (Array.isArray(cat)) { 
            return cat;
        } else if (typeof cat === 'object') {
            const order = rawUserConfig[`${catType}GroupOrder`] || Object.keys(cat);
            let flatList = [];
            order.forEach(groupName => {
                if (cat[groupName] && Array.isArray(cat[groupName])) {
                    flatList = flatList.concat(cat[groupName]);
                }
            });
            return flatList;
        }
        return [];
    }, [rawUserConfig]); // Depend on rawUserConfig to get the latest categories


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
            return true; // Return true as no actual change, but consider it successful
        }

        const success = await handleValueChange(monthIndex, type, subCategory, finalValue);
        if (success) { 
            setEditingCell(null);
            setEditingValue('');
        }
        return success;
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

        // Perform blur (save) operation first
        const blurSuccess = await handleInputBlur(); 
        if (!blurSuccess && editingCell !== null) { 
            // If blur failed (e.g., Firebase update issue), keep editing in the current cell
            return;
        }

        let { monthIndex, type, subCategory } = currentEditingCell; 

        // Get flattened subcategories based on the LATEST user config
        const allAssetSubcategories = getFlattenedEditableSubcategories('Activos');
        const allLiabilitySubcategories = getFlattenedEditableSubcategories('Pasivos');
        
        const currentSubCategoryList = type === 'Activos' ? allAssetSubcategories : allLiabilitySubcategories;
        let currentSubCategoryIndex = currentSubCategoryList.indexOf(subCategory);

        let nextMonthIndex = monthIndex;
        let nextSubCategory = subCategory;
        let nextType = type;
        
        let foundNextCell = false;

        if (e.key === 'Tab') {
            if (monthIndex < MONTHS.length - 1) { // Move right to next month in current subcategory
                nextMonthIndex = monthIndex + 1;
                foundNextCell = true;
            } else { // End of row, move to next subcategory, first month
                nextMonthIndex = 0; 
                if (currentSubCategoryIndex < currentSubCategoryList.length - 1) { // Move to next subcategory in current type
                    nextSubCategory = currentSubCategoryList[currentSubCategoryIndex + 1];
                    foundNextCell = true;
                } else { // End of subcategories in current type, move to next type
                    if (type === 'Activos') {
                        if (allLiabilitySubcategories.length > 0) {
                            nextType = 'Pasivos';
                            nextSubCategory = allLiabilitySubcategories[0];
                            foundNextCell = true;
                        }
                    } else if (type === 'Pasivos') {
                        // End of all editable cells, no next cell
                    }
                }
            }
        } else if (e.key === 'Enter') { // Move down to next subcategory in current month
            if (currentSubCategoryIndex < currentSubCategoryList.length - 1) {
                nextSubCategory = currentSubCategoryList[currentSubCategoryIndex + 1];
                foundNextCell = true;
            } else { // End of subcategories in current type, move to next type (first subcategory, current month)
                if (type === 'Activos') {
                    if (allLiabilitySubcategories.length > 0) {
                        nextType = 'Pasivos';
                        nextSubCategory = allLiabilitySubcategories[0];
                        foundNextCell = true;
                    }
                } else if (type === 'Pasivos') {
                    // End of all editable cells, no next cell
                }
            }
        }

        if (foundNextCell && nextSubCategory) { 
            const newMonthName = getMonthName(nextMonthIndex);
            // Ensure we read from the latest state, which should reflect the previous blur's update
            const nextCellValue = processedNetWorthDataForRender?.[nextType]?.[nextSubCategory]?.[newMonthName] || 0;
            
            // Set the new editing cell and value
            setEditingCell({ monthIndex: nextMonthIndex, type: nextType, subCategory: nextSubCategory, originalValue: nextCellValue });
            setEditingValue(nextCellValue.toString());

            // Manually focus the next input after state update
            // This is crucial because state updates are async. A small delay ensures the DOM is updated.
            setTimeout(() => {
                const nextInputId = `${nextType}-${nextSubCategory}-${nextMonthIndex}`;
                const nextInputRef = inputRefs.current[nextInputId];
                if (nextInputRef) {
                    nextInputRef.focus();
                    nextInputRef.select();
                } else {
                     // If for some reason the next input isn't ready yet, clear editing
                    setEditingCell(null);
                    setEditingValue('');
                }
            }, 50); // A small delay, e.g., 50ms, can help
        } else {
            // If no next cell is found, stop editing
            setEditingCell(null); 
            setEditingValue('');
        }
    }, [editingCell, handleInputBlur, getFlattenedEditableSubcategories, processedNetWorthDataForRender, getMonthName]);


    // Función auxiliar para renderizar una tabla de grupo (Activos/Pasivos)
    const renderGroupTable = useCallback((groupName, type) => {
        // Use the categories state directly for the most up-to-date information
        const currentGroupSubcategories = categories?.[type]?.[groupName];
        
        // Only render the group if it exists AND has subcategories
        if (!currentGroupSubcategories || currentGroupSubcategories.length === 0) {
            return null; // Do not render if no subcategories in this group
        }

        const headerColor = GROUP_COLORS[groupName] || (type === 'Activos' ? '#059669' : '#ef4444');
        
        const groupMonthlyTotals = MONTHS.map(monthName => {
            let total = 0;
            currentGroupSubcategories.forEach(subCat => {
                total += processedNetWorthDataForRender?.[type]?.[subCat]?.[monthName] || 0;
            });
            return total;
        });
        
        return (
            <div key={groupName} className="mb-6">
                <h4 className="font-bold text-lg text-white p-2 rounded-t-lg" style={{ backgroundColor: headerColor }}>
                    {getDisplayMainCategoryName(groupName, userConfig)}
                </h4>
                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto table-wrapper rounded-b-lg border border-gray-700 dark:border-gray-600 bg-gray-600 dark:bg-gray-700">
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
                            {/* currentGroupSubcategories already checked for length > 0 above */}
                            {currentGroupSubcategories.map(subCat => (
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
                            ))}
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

                {/* Mobile View */}
                <div className="md:hidden rounded-b-lg border border-gray-700 dark:border-gray-600 bg-gray-600 dark:bg-gray-700">
                    {/* currentGroupSubcategories already checked for length > 0 above */}
                    {currentGroupSubcategories.map(subCat => (
                        <div key={subCat} className="border-b border-gray-700/50 last:border-b-0 p-3">
                            <div className="flex justify-between items-center text-sm font-medium text-gray-200">
                                <span>{subCat}</span>
                                <div className="flex items-center gap-2">
                                    <span 
                                        className="py-1 px-2 text-right border-r border-gray-700 cursor-pointer hover:bg-gray-700/50 relative dark:border-gray-600 text-sm p-0.5 min-w-[unset] w-auto"
                                        onClick={() => handleCellClick(selectedDisplayMonthIndex, type, subCat, processedNetWorthDataForRender?.[type]?.[subCat]?.[MONTHS[selectedDisplayMonthIndex]] || 0)}
                                        style={{ minWidth: '80px' }} // Keep min-width for consistency in editable span
                                    >
                                        {editingCell?.monthIndex === selectedDisplayMonthIndex && editingCell?.type === type && editingCell?.subCategory === subCat ? (
                                            <input
                                                ref={(el) => (inputRefs.current[`${type}-${subCat}-${selectedDisplayMonthIndex}`] = el)}
                                                type="number"
                                                value={editingValue}
                                                onChange={handleInputChange}
                                                onBlur={handleInputBlur}
                                                onKeyDown={handleInputKeyDown}
                                                className="w-full h-full bg-gray-900 text-white text-right focus:outline-none focus:ring-1 focus:ring-blue-500 rounded absolute inset-0 p-0.5 text-xs dark:bg-gray-800 dark:text-white"
                                                autoFocus
                                                style={numberInputNoArrowStyle}
                                            />
                                        ) : (
                                            formatCurrency(processedNetWorthDataForRender?.[type]?.[subCat]?.[MONTHS[selectedDisplayMonthIndex]] || 0)
                                        )}
                                    </span>
                                    <button
                                        onClick={() => setViewMonthlyDetail({ type, subCategory })}
                                        className="ml-2 p-1 bg-gray-500 hover:bg-gray-400 rounded-full text-white text-xs flex items-center justify-center"
                                        aria-label="Ver detalles mensuales"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            {viewMonthlyDetail?.type === type && viewMonthlyDetail?.subCategory === subCat && (
                                <SubcategoryMonthlyDetail
                                    subCategory={subCat}
                                    type={type}
                                    processedNetWorthDataForRender={processedNetWorthDataForRender}
                                    handleCellClick={handleCellClick}
                                    editingCell={editingCell}
                                    handleInputChange={handleInputChange}
                                    handleInputBlur={handleInputBlur}
                                    handleInputKeyDown={handleInputKeyDown}
                                    inputRefs={inputRefs}
                                />
                            )}
                        </div>
                    ))}
                    {/* Only show total if there are subcategories */}
                    {currentGroupSubcategories.length > 0 && (
                        <div className="p-3 bg-gray-500 font-bold rounded-b-lg dark:bg-gray-600 flex justify-between text-white">
                            <span>TOTAL {getDisplayMainCategoryName(groupName, userConfig).toUpperCase()}</span>
                            <span className={`${type === 'Activos' ? 'text-green-300' : 'text-red-300'}`}>
                                {formatCurrency(groupMonthlyTotals[selectedDisplayMonthIndex] || 0)}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        );
    }, [categories, userConfig, processedNetWorthDataForRender, editingCell, editingValue, handleCellClick, handleInputChange, handleInputBlur, handleInputKeyDown, getMonthNameSpanish, viewMonthlyDetail, selectedDisplayMonthIndex]);

    const totalAnnualIncomeActual = annualSummary?.totalActualIncome || 0;
    const totalAnnualExpenseActual = annualSummary?.totalActualExpenses || 0;
    const annualNetWorth = annualSummary?.currentNetWorth || 0;
    const annualSavingsCapacity = totalAnnualIncomeActual - totalAnnualExpenseActual;
    const currentCashBalance = annualSummary?.totalCashBalance || 0;


    if (loadingData) return (
        <div className="flex justify-center items-center h-screen bg-gray-900 text-white"> {/* Modificado para centrar */}
            <LoadingSpinner />
        </div>
    );
    if (errorData) return <div className="text-center py-8 text-red-500 dark:text-red-400">Error al cargar datos: {errorData}</div>;
    
    // Lógica de renderizado mejorada: Mostrar mensaje de bienvenida si no hay categorías de Activos o Pasivos
    // Check if there are any subcategories defined under Activos or Pasivos, regardless of groups
    const hasAnyAssetSubcategories = userConfig?.categories?.Activos && Object.values(userConfig.categories.Activos).some(group => Array.isArray(group) && group.length > 0);
    const hasAnyLiabilitySubcategories = userConfig?.categories?.Pasivos && Object.values(userConfig.categories.Pasivos).some(group => Array.isArray(group) && group.length > 0);

    if (!hasAnyAssetSubcategories && !hasAnyLiabilitySubcategories) {
        return (
            <div className="text-center py-16 text-gray-400 dark:text-gray-400">
                <h2 className="text-2xl font-bold mb-2">Bienvenido a la sección de Patrimonio Neto</h2>
                <p>Para empezar, ve a <span className="font-bold text-blue-400">Configuración {'>'} Categorías</span> y añade tus primeras subcategorías de Activos y Pasivos.</p>
            </div>
        );
    }

    // Filter `activosGroupOrder` and `pasivosGroupOrder` to only include groups that actually have subcategories.
    const filteredActivosGroupOrder = (userConfig.ActivosGroupOrder || Object.keys(categories.Activos || {})).filter(groupName => 
        categories.Activos?.[groupName] && categories.Activos[groupName].length > 0
    );
    const filteredPasivosGroupOrder = (userConfig.PasivosGroupOrder || Object.keys(categories.Pasivos || {})).filter(groupName =>
        categories.Pasivos?.[groupName] && categories.Pasivos[groupName].length > 0
    );


    return (
        <div className="p-6 bg-gray-800 rounded-lg shadow-lg dark:bg-gray-900 min-h-screen text-gray-100 dark:text-gray-100">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-white dark:text-gray-200 mb-4 sm:mb-0">Seguimiento de Patrimonio Neto - {currentYear}</h2>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <select
                        value={currentYear}
                        onChange={(e) => setCurrentYear(e.target.value)}
                        className="bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                        {availableYears.filter(year => !isNaN(year)).map(year => (
                            <option key={year} value={year.toString()}>{year.toString()}</option>
                        ))}
                    </select>
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

            {/* NOTA DE INFORMACIÓN PARA MÓVILES */}
            <div className="md:hidden bg-blue-700 text-white text-center p-3 rounded-lg mb-6 text-sm">
                <p>Estás viendo una versión reducida. Para más detalles, por favor, visualiza en un ordenador.</p>
            </div>

            {/* Tarjetas de resumen anual */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8 text-center">
                <div className="bg-gray-700 p-4 rounded-lg shadow-md dark:bg-gray-800">
                    <h3 className="text-xs sm:text-md font-semibold text-gray-300 dark:text-gray-300">Total Ingresos</h3>
                    <p className="text-lg sm:text-xl font-bold text-green-400">{formatCurrency(totalAnnualIncomeActual)}</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg shadow-md dark:bg-gray-800">
                    <h3 className="text-xs sm:text-md font-semibold text-gray-300 dark:text-gray-300">Total Gastos</h3>
                    <p className="text-lg sm:text-xl font-bold text-red-400">{formatCurrency(totalAnnualExpenseActual)}</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg shadow-md dark:bg-gray-800">
                    <h3 className="text-xs sm:text-md font-semibold text-gray-300 dark:text-gray-300">Patrimonio Neto</h3>
                    <p className="text-lg sm:text-xl font-bold text-blue-400">{formatCurrency(annualNetWorth)}</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg shadow-md dark:bg-gray-800">
                    <h3 className="text-xs sm:text-md font-semibold text-gray-300 dark:text-gray-300">Capacidad Ahorro</h3>
                    <p className={`text-lg sm:text-xl font-bold ${annualSavingsCapacity >= 0 ? 'text-green-400' : 'text-orange-400'}`}>{formatCurrency(annualSavingsCapacity)}</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg shadow-md dark:bg-gray-800">
                    <h3 className="text-xs sm:text-md font-semibold text-gray-300 dark:text-gray-300">Saldo Actual</h3>
                    <p className="text-lg sm:text-xl font-bold text-green-400">{formatCurrency(currentCashBalance)}</p>
                </div>
            </div>

            {/* Gráfico de Evolución */}
            <div className="bg-gray-700 p-4 sm:p-6 rounded-lg shadow-md mb-8 dark:bg-gray-800">
                <h3 className="text-lg sm:text-xl font-bold text-white dark:text-gray-200 mb-4">Evolución del Patrimonio Neto</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                        <XAxis dataKey="name" stroke="#cbd5e0" tickFormatter={(value) => String(value)} /> 
                        <YAxis stroke="#cbd5e0" tickFormatter={formatLargeNumber} />
                        <Tooltip
                            formatter={(value) => formatCurrency(value)}
                            labelFormatter={(label) => `Mes: ${getMonthNameSpanish(MONTHS.findIndex(m => m.substring(0,3).toLowerCase() === String(label).toLowerCase()))}`}
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

            {/* Secciones de Activos y Pasivos */}
            <div className="space-y-8 mb-8">
                <section>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 dark:text-gray-200">Activos</h3>
                    {filteredActivosGroupOrder.length > 0 ? (
                        filteredActivosGroupOrder.map(groupName => (
                            renderGroupTable(groupName, 'Activos')
                        ))
                    ) : (
                        <p className="text-gray-400 text-center col-span-full">
                            ¡Crea tus categorías de Activos en la página de Ajustes para registrarlas aquí!
                        </p>
                    )}
                    {/* Display Total Assets if there are any subcategories defined */}
                    {(hasAnyAssetSubcategories) && (
                           <div className="hidden md:block overflow-x-auto mt-4 bg-gray-600 rounded-lg overflow-hidden text-white dark:bg-gray-700">
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
                     {(hasAnyAssetSubcategories) && (
                        <div className="md:hidden p-3 bg-gray-500 font-bold rounded-lg mt-4 dark:bg-gray-600 flex justify-between text-white">
                            <span>TOTAL ACTIVOS</span>
                            <span className="text-green-300">
                                {formatCurrency(processedNetWorthData.monthlyTotals[selectedDisplayMonthIndex]?.totalAssets || 0)}
                            </span>
                        </div>
                    )}
                </section>

                <section>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 dark:text-gray-200">Pasivos</h3>
                    {filteredPasivosGroupOrder.length > 0 ? (
                        filteredPasivosGroupOrder.map(groupName => (
                            renderGroupTable(groupName, 'Pasivos')
                        ))
                    ) : (
                        <p className="text-gray-400 text-center col-span-full">
                            ¡Crea tus categorías de Pasivos en la página de Ajustes para registrarlas aquí!
                        </p>
                    )}
                     {/* Display Total Liabilities if there are any subcategories defined */}
                     {(hasAnyLiabilitySubcategories) && (
                        <div className="hidden md:block overflow-x-auto mt-4 bg-gray-600 rounded-lg overflow-hidden text-white dark:bg-gray-700">
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
                     {(hasAnyLiabilitySubcategories) && (
                        <div className="md:hidden p-3 bg-gray-500 font-bold rounded-lg mt-4 dark:bg-gray-600 flex justify-between text-white">
                            <span>TOTAL PASIVOS</span>
                            <span className="text-red-300">
                                {formatCurrency(processedNetWorthData.monthlyTotals[selectedDisplayMonthIndex]?.totalLiabilities || 0)}
                            </span>
                        </div>
                    )}
                </section>
            </div>
            
            {/* Resumen Mensual de Patrimonio Neto */}
            <div className="bg-gray-700 p-4 sm:p-6 rounded-lg shadow-md mb-8 dark:bg-gray-800">
                <h3 className="text-lg sm:text-xl font-bold text-white dark:text-gray-200 mb-4">Resumen Mensual de Patrimonio Neto</h3>
                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto">
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
                            <tr className="font-bold">
                                <td className="py-2 px-3 text-left border-r border-gray-700 dark:border-gray-600">Patrimonio Neto</td>
                                {monthlyTotals.map((data) => (
                                    <td key={`networth-value-${data.monthName}`} className="py-2 px-3 text-right text-blue-300">
                                        {formatCurrency(data.netWorth)}
                                    </td>
                                ))}
                            </tr>
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

                {/* Mobile View */}
                <div className="md:hidden">
                    <div className="bg-gray-600 rounded-lg overflow-hidden text-white dark:bg-gray-700">
                        {monthlyTotals.map((data, index) => (
                            <div key={`mobile-summary-${data.monthName}`} className="p-3 border-b border-gray-700/50 last:border-b-0">
                                <h4 className="font-bold text-sm mb-1">{getMonthNameSpanish(index)}</h4>
                                <div className="flex justify-between items-center text-sm mb-0.5">
                                    <span>Patrimonio Neto:</span>
                                    <span className="text-blue-300">{formatCurrency(data.netWorth)}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span>Variación Mensual:</span>
                                    <span className={`${chartData[index]?.monthlyChangeNetWorth >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                                        {formatCurrency(Math.abs(chartData[index]?.monthlyChangeNetWorth || 0))}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NetWorthPage;