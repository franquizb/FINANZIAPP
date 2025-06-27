// src/pages/DashboardPage.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import useFinanceData from '../hooks/useFinanceData';
import {
    ResponsiveContainer, Legend, Tooltip,
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    AreaChart, Area, LineChart, Line,
    PieChart, Pie, Cell
} from 'recharts';
// import { useTheme } from '../context/ThemeContext'; // No usado en este archivo

// --- CONSTANTES DE ESTILO ---
const CATEGORY_HEX_COLORS = {
    'Ingresos': '#4b5563',
    'GastosEsenciales': '#ca8a04',
    'GastosDiscrecionales': '#f97316',
    'PagoDeDeudas': '#b91c1c',
    'AhorroEInversion': '#059669',
    'TotalGastosSumVisual': '#eab308' // Nuevo color para la suma visual de gastos
};

const categoryOrder = ['Ingresos', 'GastosEsenciales', 'GastosDiscrecionales', 'PagoDeDeudas', 'AhorroEInversion'];
const categoryStyles = {
    'Ingresos': { color: '#4b5563', title: 'INGRESOS' },
    'GastosEsenciales': { color: '#ca8a04', title: 'GASTOS ESENCIALES' },
    'GastosDiscrecionales': { color: '#f97316', title: 'GASTOS DISCRECIONALES' },
    'PagoDeDeudas': { color: '#b91c1c', title: 'PAGO DE DEUDAS' },
    'AhorroEInversion': { color: '#059669', title: 'AHORRO E INVERSIÓN' },
    'TotalGastosSumVisual': { color: '#eab308', title: 'GASTOS TOTALES' } // Título para la suma visual
};

// --- COMPONENTES AUXILIARES ---
const DashboardCard = ({ children, className = "" }) => (
    <div className={`bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-700 flex flex-col ${className} dark:bg-gray-800 dark:border-gray-700`}>
        <div className="flex-grow h-full">
            {children}
        </div>
    </div>
);

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
            <div className="bg-gray-800 rounded-lg p-6 shadow-xl w-full max-w-md border border-gray-700 dark:bg-gray-700 dark:border-gray-600">
                <h3 className="text-xl font-bold text-white mb-4 dark:text-gray-200">{title}</h3>
                <div className="text-gray-300 mb-6 dark:text-gray-300">{children}</div>
                <div className="flex justify-end gap-4">
                    <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500 text-white transition-colors dark:bg-gray-500 dark:hover:bg-gray-600">Cancelar</button>
                    <button onClick={onConfirm} className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-500 text-white transition-colors dark:bg-red-500 dark:hover:bg-red-600">Confirmar</button>
                </div>
            </div>
        </div>
    );
};

function DashboardPage() {
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear().toString());

    const {
        financeData,
        userConfig,
        loadingData,
        errorData,
        updateFinanceData, // Función expuesta por el hook para actualizar financeData
        updateConfig,     // Función expuesta por el hook para actualizar userConfig
        getMonthName,
        availableYears
    } = useFinanceData(currentYear);

    const [activeTab, setActiveTab] = useState('charts');
    const [isEditingMode, setIsEditingMode] = useState(false);
    const [editingCell, setEditingCell] = useState(null);
    const [editingValue, setEditingValue] = useState('');
    const [editingName, setEditingName] = useState(null);
    const [editingNameValue, setEditingNameValue] = useState('');
    const [addingSubcat, setAddingSubcat] = useState({ category: null, name: '' });
    const [deleteConfirmation, setDeleteConfirmation] = useState({ isOpen: false, mainCatKey: null, subCat: null });
    const budgetInputRef = useRef(null);
    const nameInputRef = useRef(null);
    const addInputRef = useRef(null);
    const [selectedMonthIndex, setSelectedMonthIndex] = useState(new Date().getMonth());

    useEffect(() => { if (editingCell) budgetInputRef.current?.focus(); }, [editingCell]);
    useEffect(() => { if (editingName) nameInputRef.current?.focus(); }, [editingName]);
    useEffect(() => { if (addingSubcat.category) addInputRef.current?.focus(); }, [addingSubcat]);

    useEffect(() => {
        if (userConfig && userConfig.defaultYear && currentYear !== userConfig.defaultYear) {
            setCurrentYear(userConfig.defaultYear);
        }
    }, [userConfig, currentYear]);

    const formatCurrency = (value) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(typeof value === 'number' ? value : 0);
    const getMonthNameSpanish = (monthIndex) => ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'][monthIndex];
    const getDisplayMainCategoryName = (mainCategoryKey) => userConfig?.categoryDisplayNames?.[mainCategoryKey] || mainCategoryKey.replace(/([A-Z])/g, ' $1').trim();

    const handleBudgetCellClick = (subCategory, currentValue) => { if(isEditingMode) { setEditingCell({ subCategory, originalValue: currentValue }); setEditingValue(currentValue.toString()); }};
    const handleNameCellClick = (mainCategoryKey, subCategoryName) => { 
        if(isEditingMode) { 
            setEditingName({ mainCategoryKey, subCategoryName }); 
            setEditingNameValue(subCategoryName);
        }
    };
    const handleDeleteClick = (mainCatKey, subCat) => { if(isEditingMode) { setDeleteConfirmation({ isOpen: true, mainCatKey, subCat }); }};
    const handleInputKeyDown = (e, onCommit) => { if (e.key === 'Enter' || e.key === 'Tab') { e.preventDefault(); onCommit(); } else if (e.key === 'Escape') { setEditingCell(null); setEditingName(null); setAddingSubcat({ category: null, name: '' }); }};

    const updateLocalFinanceDataHelper = (budgetUpdateObject) => {
        updateFinanceData({ [currentYear]: { budget: budgetUpdateObject } });
    };

    const updateLocalUserConfigHelper = (categoriesUpdateObject) => {
        updateConfig({ categories: categoriesUpdateObject });
    };

    const handleBudgetInputBlur = async () => {
        if (!editingCell) return;
        const { subCategory, originalValue } = editingCell;
        const finalValue = !isNaN(parseFloat(editingValue)) ? parseFloat(editingValue) : 0;
        setEditingCell(null);
        if (finalValue === originalValue) return;

        const previousBudget = financeData[currentYear]?.budget || {};
        const newBudgetLocal = { ...previousBudget, [subCategory]: finalValue };
        
        updateLocalFinanceDataHelper(newBudgetLocal); 
    };

    const handleAddSubcatCommit = async () => {
        const { category, name } = addingSubcat;
        if (!category || !name.trim()) { setAddingSubcat({ category: null, name: '' }); return; }
        const newSubcatName = name.trim();
        setAddingSubcat({ category: null, name: '' });

        const previousUserConfigCategories = JSON.parse(JSON.stringify(userConfig?.categories || {}));
        const updatedConfigCategoriesLocal = JSON.parse(JSON.stringify(userConfig?.categories || {})); 

        let categoryUpdated = false;
        
        if (!updatedConfigCategoriesLocal[category]) {
            updatedConfigCategoriesLocal[category] = {}; 
        }
        
        if (Array.isArray(updatedConfigCategoriesLocal[category])) {
            const subCatArray = updatedConfigCategoriesLocal[category];
            if (subCatArray.includes(newSubcatName)) { alert("Esa subcategoría ya existe."); return; }
            subCatArray.push(newSubcatName);
            categoryUpdated = true;
        } else if (typeof updatedConfigCategoriesLocal[category] === 'object' && updatedConfigCategoriesLocal[category] !== null) {
            const defaultGroup = Object.keys(updatedConfigCategoriesLocal[category])[0] || 'Otros';
            if (!updatedConfigCategoriesLocal[category][defaultGroup]) {
                updatedConfigCategoriesLocal[category][defaultGroup] = [];
            }
            if (updatedConfigCategoriesLocal[category][defaultGroup].includes(newSubcatName)) { alert("Esa subcategoría ya existe en este grupo."); return; }
            updatedConfigCategoriesLocal[category][defaultGroup].push(newSubcatName);
            categoryUpdated = true;
        } else {
            alert("Tipo de categoría no soportado para añadir subcategoría."); 
            return;
        }

        if (!categoryUpdated) return;

        updateLocalUserConfigHelper(updatedConfigCategoriesLocal);

        const previousBudget = financeData[currentYear]?.budget || {};
        const newBudgetLocal = { ...previousBudget, [newSubcatName]: 0 };
        updateLocalFinanceDataHelper(newBudgetLocal);
    };

    const handleNameInputBlur = async () => {
        if (!editingName) return;
        const { mainCategoryKey, subCategoryName } = editingName;
        const newName = editingNameValue.trim();
        setEditingName(null);
        if (!newName || newName === subCategoryName) return;

        const previousUserConfigCategories = JSON.parse(JSON.stringify(userConfig?.categories || {}));
        const updatedConfigCategoriesLocal = JSON.parse(JSON.stringify(userConfig?.categories || {}));
        
        let foundAndUpdated = false;
        if (Array.isArray(updatedConfigCategoriesLocal[mainCategoryKey])) {
            const subCatArray = updatedConfigCategoriesLocal[mainCategoryKey];
            if (subCatArray.includes(newName)) { alert("Ese nombre ya existe."); return; }
            updatedConfigCategoriesLocal[mainCategoryKey] = subCatArray.map(name => name === subCategoryName ? newName : name);
            foundAndUpdated = true;
        } else if (typeof updatedConfigCategoriesLocal[mainCategoryKey] === 'object' && updatedConfigCategoriesLocal[mainCategoryKey] !== null) {
            for (const groupName in updatedConfigCategoriesLocal[mainCategoryKey]) {
                const groupSubCategories = updatedConfigCategoriesLocal[mainCategoryKey][groupName];
                if (Array.isArray(groupSubCategories) && groupSubCategories.includes(subCategoryName)) {
                    if (groupSubCategories.includes(newName)) { alert("Ese nombre ya existe en este grupo."); return; }
                    updatedConfigCategoriesLocal[mainCategoryKey][groupName] = groupSubCategories.map(name => name === subCategoryName ? newName : name);
                    foundAndUpdated = true;
                    break;
                }
            }
        }

        if (!foundAndUpdated) return;

        updateLocalUserConfigHelper(updatedConfigCategoriesLocal);

        const previousBudget = financeData[currentYear]?.budget || {};
        const newBudgetLocal = { ...previousBudget };
        if (newBudgetLocal[subCategoryName] !== undefined) {
            newBudgetLocal[newName] = newBudgetLocal[subCategoryName];
            delete newBudgetLocal[subCategoryName];
        }
        updateLocalFinanceDataHelper(newBudgetLocal);
    };

    const handleConfirmDelete = async () => {
        const { mainCatKey, subCat } = deleteConfirmation;
        setDeleteConfirmation({ isOpen: false, mainCatKey: null, subCat: null });

        const previousUserConfigCategories = JSON.parse(JSON.stringify(userConfig?.categories || {}));
        const updatedConfigCategoriesLocal = JSON.parse(JSON.stringify(userConfig?.categories || {}));
        
        let foundAndDeleted = false;
        if (Array.isArray(updatedConfigCategoriesLocal[mainCatKey])) {
            const subCatArray = updatedConfigCategoriesLocal[mainCatKey];
            updatedConfigCategoriesLocal[mainCatKey] = subCatArray.filter(name => name !== subCat);
            if (updatedConfigCategoriesLocal[mainCatKey].length === 0) {
                delete updatedConfigCategoriesLocal[mainCatKey];
            }
            foundAndDeleted = true;
        } else if (typeof updatedConfigCategoriesLocal[mainCatKey] === 'object' && updatedConfigCategoriesLocal[mainCatKey] !== null) {
            for (const groupName in updatedConfigCategoriesLocal[mainCatKey]) {
                const groupSubCategories = updatedConfigCategoriesLocal[mainCatKey][groupName];
                if (Array.isArray(groupSubCategories) && groupSubCategories.includes(subCat)) {
                    updatedConfigCategoriesLocal[mainCatKey][groupName] = groupSubCategories.filter(name => name !== subCat);
                    if (updatedConfigCategoriesLocal[mainCatKey][groupName].length === 0) {
                        delete updatedConfigCategoriesLocal[mainCatKey][groupName];
                        if (Object.keys(updatedConfigCategoriesLocal[mainCatKey]).length === 0) {
                            delete updatedConfigCategoriesLocal[mainCategoryKey];
                        }
                    }
                    foundAndDeleted = true;
                    break;
                }
            }
        }

        if (!foundAndDeleted) return;

        updateLocalUserConfigHelper(updatedConfigCategoriesLocal);

        const previousBudget = financeData[currentYear]?.budget || {};
        const newBudgetLocal = { ...previousBudget };
        if (newBudgetLocal[subCat] !== undefined) {
            delete newBudgetLocal[subCat];
        }
        updateLocalFinanceDataHelper(newBudgetLocal);
    };

    // --- PROCESAMIENTO DE DATOS MEMOIZADO ---
    const memoizedData = useMemo(() => {
        if (!financeData || !userConfig || !userConfig.categories) {
            return {
                summaryCards: { totalIncome: 0, totalExpenses: 0, balance: 0 },
                monthlyChartData: [],
                expenseOverviewData: [],
                topExpensesData: [],
                categoryCardsData: [],
                netWorthChartData: [],
                budgetData: { remanente: 0, tables: {} }
            };
        }

        const categories = userConfig.categories;
        const annualData = financeData[currentYear] || {};
        const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

        const getAllSubcategories = (mainCategoryKey) => {
            const cat = categories[mainCategoryKey];
            if (cat === undefined) return [];
            if (Array.isArray(cat)) {
                return cat;
            } else if (typeof cat === 'object' && cat !== null) {
                const order = userConfig?.[`${mainCategoryKey}GroupOrder`] || Object.keys(cat || {});
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

        const monthlyChartData = Array.from({ length: 12 }, (_, i) => {
            const monthName = getMonthName(i);
            const monthTransactions = annualData.monthly?.[monthName] || {};

            const monthTotals = { name: getMonthNameSpanish(i), Ingresos: 0, Gastos: 0 }; 
            monthTotals.GastosEsenciales = 0;
            monthTotals.GastosDiscrecionales = 0;
            monthTotals.PagoDeDeudas = 0;
            monthTotals.AhorroEInversion = 0;

            const incomeSubcategories = getAllSubcategories('Ingresos');
            incomeSubcategories.forEach(subCat => {
                const total = (monthTransactions[subCat]?.actual || []).reduce((sum, t) => sum + t.amount, 0);
                monthTotals.Ingresos += total;
            });

            const actualExpenseMainCategoriesKeys = Object.keys(categories || {}).filter(key =>
                !['Ingresos', 'Activos', 'Pasivos'].includes(key)
            );

            actualExpenseMainCategoriesKeys.forEach(mainCatKey => {
                const subcatsInMainCat = getAllSubcategories(mainCatKey);
                subcatsInMainCat.forEach(subCat => {
                    const total = (monthTransactions[subCat]?.actual || []).reduce((sum, t) => sum + t.amount, 0);
                    if (monthTotals[mainCatKey] !== undefined) {
                        monthTotals[mainCatKey] += total;
                    }
                    monthTotals.Gastos += total;
                });
            });
            
            monthTotals.Balance = monthTotals.Ingresos - monthTotals.Gastos;
            return monthTotals;
        });

        const totalIncome = monthlyChartData.reduce((sum, d) => sum + d.Ingresos, 0);
        const totalExpenses = monthlyChartData.reduce((sum, d) => sum + d.Gastos, 0);
        const summaryCards = { totalIncome, totalExpenses, balance: totalIncome - totalExpenses };

        // --- 2. DATOS PARA EL DESGLOSE DE GASTOS (MES SELECCIONADO) ---
        const currentMonthSelectedName = getMonthName(selectedMonthIndex);
        const currentMonthTransactions = annualData.monthly?.[currentMonthSelectedName] || {};
        
        // Define expenseMainCategoriesKeys aquí para que sea accesible globalmente en memoizedData
        const expenseMainCategoriesKeys = Object.keys(categories || {}).filter(key =>
            !['Ingresos', 'Activos', 'Pasivos'].includes(key)
        );

        let currentMonthRealIncome = 0;
        const incomeSubcategoriesCurrentMonth = getAllSubcategories('Ingresos');
        incomeSubcategoriesCurrentMonth.forEach(subCat => {
            currentMonthRealIncome += (currentMonthTransactions[subCat]?.actual || []).reduce((sum, t) => sum + t.amount, 0);
        });


        let totalCurrentMonthExpenses = 0;
        const expenseOverviewData = [];
        let categoryCardsData = []; // Cambiado a `let` para poder modificarlo

        expenseMainCategoriesKeys.forEach(mainCatKey => {
            const subcatsInMainCat = getAllSubcategories(mainCatKey);
            let totalForMainCat = 0;
            subcatsInMainCat.forEach(subCat => {
                totalForMainCat += (currentMonthTransactions[subCat]?.actual || []).reduce((sum, t) => sum + t.amount, 0);
            });
            totalCurrentMonthExpenses += totalForMainCat;

            if (totalForMainCat > 0) {
                const percentageOfIncome = currentMonthRealIncome > 0 ? (totalForMainCat / currentMonthRealIncome) * 100 : 0;
                expenseOverviewData.push({
                    name: getDisplayMainCategoryName(mainCatKey, userConfig),
                    value: totalForMainCat,
                    color: CATEGORY_HEX_COLORS[mainCatKey] || '#cccccc'
                });
                categoryCardsData.push({
                    name: getDisplayMainCategoryName(mainCatKey, userConfig),
                    total: totalForMainCat,
                    percentage: percentageOfIncome,
                    color: CATEGORY_HEX_COLORS[mainCatKey] || '#cccccc',
                });
            }
        });
        
        // Calcular el total de Gastos Esenciales y Discrecionales para la TARJETA VISUAL
        const totalGastosEsencialesActual = categoryCardsData.find(c => c.name === getDisplayMainCategoryName('GastosEsenciales', userConfig))?.total || 0;
        const totalGastosDiscrecionalesActual = categoryCardsData.find(c => c.name === getDisplayMainCategoryName('GastosDiscrecionales', userConfig))?.total || 0;
        const totalClasifiedExpensesActualSum = totalGastosEsencialesActual + totalGastosDiscrecionalesActual;

        // Añadir la tarjeta de suma VISUAL solo si hay datos en alguna de las categorías sumadas
        if (totalClasifiedExpensesActualSum > 0) {
            const percentageOfIncome = currentMonthRealIncome > 0 ? (totalClasifiedExpensesActualSum / currentMonthRealIncome) * 100 : 0;
            categoryCardsData.push({
                name: categoryStyles.TotalGastosSumVisual.title, // 'GASTOS TOTALES'
                total: totalClasifiedExpensesActualSum,
                percentage: percentageOfIncome,
                color: CATEGORY_HEX_COLORS.TotalGastosSumVisual, // Amarillo
                isSumCard: true // Bandera para identificarla en el renderizado
            });
        }
        
        // Ordenar categoryCardsData para asegurar que "Gastos Totales" esté donde queremos
        // y que Ingresos vaya primero.
        const customCardOrder = {
            'INGRESOS': 1,
            [getDisplayMainCategoryName('GastosEsenciales', userConfig)]: 2,
            [getDisplayMainCategoryName('GastosDiscrecionales', userConfig)]: 3,
            'GASTOS TOTALES': 4, // Colocar la tarjeta de suma después de esenciales y discrecionales
            [getDisplayMainCategoryName('PagoDeDeudas', userConfig)]: 5,
            [getDisplayMainCategoryName('AhorroEInversion', userConfig)]: 6,
        };
        categoryCardsData.sort((a, b) => (customCardOrder[a.name] || 99) - (customCardOrder[b.name] || 99));


        const topExpensesData = [];
        const allExpenseSubcategories = expenseMainCategoriesKeys.flatMap(key => getAllSubcategories(key));
        
        allExpenseSubcategories.forEach(subCat => {
            const subCatTotal = (currentMonthTransactions[subCat]?.actual || []).reduce((sum, t) => sum + t.amount, 0);
            if (subCatTotal > 0) {
                topExpensesData.push({
                    name: subCat,
                    total: subCatTotal,
                });
            }
        });
        topExpensesData.sort((a, b) => b.total - a.total).slice(0, 10);

        // --- 3. DATOS DEL PRESUPUESTO (SIN CATEGORÍA VIRTUAL DE SUMA) ---
        const budgetData = (() => {
            const currentBudget = financeData[currentYear]?.budget || {};

            const results = {};
            const totalIncomeBudgeted = getAllSubcategories('Ingresos').reduce((sum, subCat) => sum + (currentBudget[subCat] || 0), 0);

            // Filtrar solo las categorías que existan en userConfig.categories
            Object.keys(categories || {}).filter(catKey => 
                categoryOrder.includes(catKey) // Filtrar por el orden definido
            ).forEach(catKey => {
                // EXCLUIR categorías no deseadas del procesamiento del presupuesto
                if (['Activos', 'Pasivos'].includes(catKey)) return; 

                const subCategoriesForBudget = getAllSubcategories(catKey);
                const rows = subCategoriesForBudget.map(subCat => ({ name: subCat, budgeted: currentBudget[subCat] || 0 }));
                const totalBudgeted = rows.reduce((sum, r) => sum + r.budgeted, 0);

                const percentage = totalIncomeBudgeted > 0 && catKey !== 'Ingresos' ? (totalBudgeted / totalIncomeBudgeted) * 100 : 0;

                results[catKey] = { rows, totalBudgeted, percentage };
            });
            
            // Recalcular el remanente usando las categorías de gasto REALES
            const totalExpensesAndSavingsBudgeted = (
                (results.GastosEsenciales?.totalBudgeted || 0) +
                (results.GastosDiscrecionales?.totalBudgeted || 0) +
                (results.PagoDeDeudas?.totalBudgeted || 0) +
                (results.AhorroEInversion?.totalBudgeted || 0)
            );
            
            results.remanente = totalIncomeBudgeted - totalExpensesAndSavingsBudgeted;

            return { tables: results, remanente: results.remanente };
        })();


        const netWorthDataForChart = annualData.netWorth || { assets: {}, liabilities: {} };
        const monthlyNetWorthTotals = months.map((monthName, index) => {
            let totalAssets = 0;
            let totalLiabilities = 0;

            const activosSubcategoriesFlat = getAllSubcategories('Activos');
            activosSubcategoriesFlat.forEach(subCat => {
                const value = netWorthDataForChart?.Activos?.[subCat]?.[monthName];
                if (value !== undefined && !isNaN(value)) {
                    totalAssets += value;
                }
            });

            const pasivosSubcategoriesFlat = getAllSubcategories('Pasivos');
            pasivosSubcategoriesFlat.forEach(subCat => {
                const value = netWorthDataForChart?.Pasivos?.[subCat]?.[monthName];
                if (value !== undefined && !isNaN(value)) {
                    totalLiabilities += value;
                }
            });

            return {
                name: getMonthNameSpanish(index).charAt(0).toUpperCase() + getMonthNameSpanish(index).slice(1, 3),
                Activos: totalAssets,
                Pasivos: totalLiabilities,
                'Patrimonio Neto': totalAssets - totalLiabilities,
            };
        });

        return { summaryCards, monthlyChartData, budgetData, netWorthChartData: monthlyNetWorthTotals, expenseOverviewData, topExpensesData, categoryCardsData };
    }, [financeData, userConfig, currentYear, getMonthName, selectedMonthIndex]);


    const {
        summaryCards,
        monthlyChartData,
        budgetData,
        netWorthChartData,
        expenseOverviewData,
        topExpensesData,
        categoryCardsData
    } = memoizedData;


    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-900 min-h-screen text-white dark:bg-gray-900 dark:text-gray-100">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h2 className="text-3xl font-bold text-white mb-4 dark:text-gray-200">Dashboard - {currentYear}</h2>
                <div className="flex gap-4 flex-wrap justify-center sm:justify-start">
                    {/* Selector de Año */}
                    <select
                        value={currentYear}
                        onChange={(e) => setCurrentYear(e.target.value)}
                        className="bg-gray-700 text-white p-2 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                        {availableYears.map(year => (
                            <option key={year} value={year.toString()}>{year}</option>
                        ))}
                    </select>

                    {/* Selector de Mes (condicional) - Se mantiene para gráficos */}
                    {activeTab === 'charts' && (
                        <select
                            value={selectedMonthIndex}
                            onChange={(e) => setSelectedMonthIndex(parseInt(e.target.value))}
                            className="bg-gray-700 text-white p-2 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        >
                            {Array.from({ length: 12 }, (_, i) => (
                                <option key={i} value={i}>{getMonthNameSpanish(i)}</option>
                            ))}
                        </select>
                    )}

                    {/* Mejora de estilo para las pestañas */}
                    <div className="flex rounded-lg bg-gray-700 p-1 shadow-inner flex-grow sm:flex-grow-0 border border-gray-600 dark:bg-gray-700 dark:border-gray-600">
                        <button
                            onClick={() => setActiveTab('charts')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ease-in-out w-1/2 sm:w-auto ${
                                activeTab === 'charts' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-300 hover:text-white hover:bg-gray-600'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        >
                            Gráficos
                        </button>
                        <button
                            onClick={() => setActiveTab('budget')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ease-in-out w-1/2 sm:w-auto ${
                                activeTab === 'budget' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-300 hover:text-white hover:bg-gray-600'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        >
                            Presupuesto
                        </button>
                    </div>
                </div>
            </header>

            {/* Contenido de la Pestaña Activa */}
            {activeTab === 'charts' && (
                <section>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-center">
                        <div className="bg-gray-800 p-4 rounded-lg shadow-lg dark:bg-gray-800 border border-gray-700 dark:border-gray-700">
                            <h3 className="text-md font-semibold text-gray-300 dark:text-gray-300">Ingresos</h3>
                            <p className="text-2xl font-bold text-green-400">{formatCurrency(summaryCards.totalIncome)}</p>
                        </div>
                        <div className="bg-gray-800 p-4 rounded-lg shadow-lg dark:bg-gray-800 border border-gray-700 dark:border-gray-700">
                            <h3 className="text-md font-semibold text-gray-300 dark:text-gray-300">Gastos</h3>
                            <p className="text-2xl font-bold text-red-400">{formatCurrency(summaryCards.totalExpenses)}</p>
                        </div>
                        <div className="bg-gray-800 p-4 rounded-lg shadow-lg dark:bg-gray-800 border border-gray-700 dark:border-gray-700">
                            <h3 className="text-md font-semibold text-gray-300 dark:text-gray-300">Balance</h3>
                            <p className={`text-2xl font-bold ${summaryCards.balance >= 0 ? 'text-blue-400' : 'text-orange-400'}`}>{formatCurrency(summaryCards.balance)}</p>
                        </div>
                    </div>
                    
                    {/* Sección de Desglose de Gastos (Mes Actual) */}
                    <DashboardCard className="lg:col-span-2 mb-8">
                        <h3 className="text-lg font-bold text-white mb-4 dark:text-gray-200">Desglose de Gastos ({getMonthNameSpanish(selectedMonthIndex)})</h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Gráfico de Anillos */}
                            <div className="md:col-span-1 min-h-[250px] flex flex-col items-center justify-center">
                                <h3 className="text-lg font-semibold text-white mb-2 text-center">Distribución de Gastos</h3>
                                {expenseOverviewData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={200}>
                                        <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                                            <Pie
                                                data={expenseOverviewData}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={70}
                                                fill="#8884d8"
                                                labelLine={false}
                                            >
                                                {expenseOverviewData.map((entry, index) => (
                                                    <Cell key={`cell-${entry.name}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip 
                                                formatter={(value) => formatCurrency(value)}
                                                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '0.5rem' }}
                                            />
                                            <Legend 
                                                wrapperStyle={{fontSize: "12px", paddingTop: '10px'}}
                                                layout="vertical"
                                                align="right"
                                                verticalAlign="middle"
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <p className="text-gray-400 text-center">No hay gastos para mostrar este mes.</p>
                                )}
                            </div>

                            {/* Tabla Top N Gastos */}
                            <div className="md:col-span-1 flex flex-col min-h-0">
                                <h3 className="text-lg font-semibold text-white mb-2 text-center">Top 10 Gastos</h3>
                                {topExpensesData.length > 0 ? (
                                    <div className="overflow-y-auto custom-scrollbar flex-grow pr-2">
                                        <table className="w-full text-sm text-gray-300">
                                            <tbody>
                                                {topExpensesData.map((item, index) => (
                                                    <tr key={item.name} className={`${index % 2 === 0 ? 'bg-gray-700/50' : 'bg-gray-700/30'} border-b border-gray-600 last:border-b-0`}>
                                                        <td className="py-1.5 px-2 font-medium text-white">{item.name}</td>
                                                        <td className="py-1.5 px-2 text-right">{formatCurrency(item.total)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-gray-400 text-center">No hay gastos principales para mostrar.</p>
                                )}
                            </div>
                        </div>
                        {/* Cuadrícula de Tarjetas de Resumen por Categoría Principal */}
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold text-white mb-4 text-center">Gastos por Categoría</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {
                                    // Filtrar y mapear las tarjetas para incluir la de suma
                                    // categoryCardsData contiene todas las tarjetas individuales + la sumatoria si se calculó
                                    categoryCardsData.length > 0 ? (
                                        categoryCardsData.map(card => (
                                            <div key={card.name} className="bg-gray-700 p-4 rounded-lg shadow-md text-center border" style={{borderColor: card.color}}>
                                                <h4 className="font-semibold text-white mb-1">{card.name}</h4>
                                                <p className="text-xl font-bold mb-1" style={{color: card.color}}>{formatCurrency(card.total)}</p>
                                                {card.percentage.toFixed(2) !== '0.00' && (
                                                    <span className="text-sm text-gray-400">({card.percentage.toFixed(2)}% ingresos)</span>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-400 col-span-full text-center">No hay datos de gastos por categoría principal este mes.</p>
                                    )
                                }
                            </div>
                        </div>
                    </DashboardCard>

                    {/* Contenedor principal de los gráficos de resumen mensual */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                        <DashboardCard>
                            <h3 className="text-lg font-bold text-white mb-4 dark:text-gray-200">Composición de Gastos Mensuales</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={monthlyChartData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                                    <XAxis dataKey="name" stroke="#cbd5e0" />
                                    <YAxis tickFormatter={formatCurrency} stroke="#cbd5e0" />
                                    <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '0.5rem' }} cursor={{ fill: 'rgba(100, 116, 139, 0.1)' }}/>
                                    <Legend />
                                    {['Ingresos', 'GastosEsenciales', 'GastosDiscrecionales', 'PagoDeDeudas', 'AhorroEInversion']
                                        .filter(catKey => monthlyChartData.some(d => d[catKey] > 0 || catKey === 'Ingresos'))
                                        .map(catKey => {
                                            const style = categoryStyles[catKey];
                                            if (!style) return null;
                                            return (
                                                <Bar key={catKey} dataKey={catKey} stackId="gastos" fill={style.color} name={style.title} />
                                            );
                                    })}
                                </BarChart>
                            </ResponsiveContainer>
                        </DashboardCard>

                        <DashboardCard>
                            <h3 className="text-lg font-bold text-white mb-4 dark:text-gray-200">Evolución del Balance Mensual</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={monthlyChartData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                                    <defs>
                                        <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                                    <XAxis dataKey="name" stroke="#cbd5e0" />
                                    <YAxis tickFormatter={formatCurrency} stroke="#cbd5e0" />
                                    <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '0.5rem' }}/>
                                    <Area type="monotone" dataKey="Balance" stroke="#3b82f6" fillOpacity={1} fill="url(#colorBalance)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </DashboardCard>

                        <DashboardCard className="lg:col-span-2">
                            <h3 className="text-lg font-bold text-white mb-4 dark:text-gray-200">Evolución del Patrimonio Neto</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={netWorthChartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                                    <XAxis dataKey="name" stroke="#cbd5e0" />
                                    <YAxis tickFormatter={formatCurrency} stroke="#cbd5e0" />
                                    <Tooltip
                                        formatter={(value) => formatCurrency(value)}
                                        labelFormatter={(label) => `Mes: ${label}`}
                                        contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '0.5rem' }}
                                        itemStyle={{ color: '#ffffff' }}
                                    />
                                    <Legend />
                                    <Line type="monotone" dataKey="Activos" stroke="#82ca9d" activeDot={{ r: 8 }} />
                                    <Line type="monotone" dataKey="Pasivos" stroke="#ef4444" activeDot={{ r: 8 }} />
                                    <Line type="monotone" dataKey="Patrimonio Neto" stroke="#3b82f6" activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </DashboardCard>
                    </div>
                </section>
            )}

            {activeTab === 'budget' && (
                <section>
                    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <h2 className="text-4xl font-extrabold text-white tracking-wider dark:text-gray-200">PRESUPUESTO</h2>
                        <div className="bg-purple-800 p-2 rounded-lg text-center shadow-lg border border-purple-500 dark:bg-purple-700 dark:border-purple-600">
                            <span className="block text-xs text-purple-200 font-bold">REMANENTE</span>
                            <span className={`text-3xl font-bold ${
                                budgetData.remanente < 0 ? 'text-red-400' : 
                                budgetData.remanente === 0 ? 'text-green-400' : 
                                'text-purple-400'
                            }`}>{formatCurrency(budgetData.remanente)}</span>
                        </div>
                        <button
                            onClick={() => setIsEditingMode(!isEditingMode)}
                            className={`px-4 py-2 rounded-md transition-colors font-bold text-sm ${isEditingMode ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} dark:bg-blue-700 dark:hover:bg-blue-800`}
                        >
                            {isEditingMode ? 'Finalizar Edición' : 'Activar Edición'}
                        </button>
                    </header>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
                        {
                            (() => {
                                // En la pestaña de PRESUPUESTO, siempre mostramos GastosEsenciales y GastosDiscrecionales por separado
                                const categoriesToRenderOrder = ['Ingresos', 'GastosEsenciales', 'GastosDiscrecionales', 'PagoDeDeudas', 'AhorroEInversion']; 

                                return categoriesToRenderOrder
                                    .filter(catKey => {
                                        // Filtra para mostrar solo las categorías que existen en userConfig.categories
                                        // O si estamos en modo edición (para poder añadir subcategorías a ellas, incluso si están vacías).
                                        const currentCategories = userConfig?.categories || {};
                                        const hasCategoryInConfig = Object.keys(currentCategories).includes(catKey);
                                        
                                        // Si la categoría existe en la configuración O estamos en modo edición, la mostramos.
                                        // Así se ven las tarjetas vacías en modo edición para añadirles contenido.
                                        return hasCategoryInConfig || isEditingMode;
                                    })
                                    .map(catKey => {
                                        // No hay tarjeta de suma en la sección de Presupuesto
                                        const data = budgetData.tables[catKey];
                                        const styles = categoryStyles[catKey];

                                        return (
                                            <div key={catKey} className="rounded-lg shadow-lg flex flex-col bg-gray-800 border border-gray-700 dark:bg-gray-800 dark:border-gray-700">
                                                <div className="p-2 rounded-t-lg font-bold flex justify-between items-center text-white" style={{backgroundColor: styles.color}}>
                                                    <span>{styles.title}</span>
                                                    {isEditingMode && (
                                                        userConfig?.categories?.[catKey] && addingSubcat.category !== catKey && (
                                                            <button onClick={() => setAddingSubcat({ category: catKey, name: '' })} className="bg-black bg-opacity-20 hover:bg-opacity-40 rounded-full h-6 w-6 flex items-center justify-center text-lg font-bold text-white">+</button>
                                                        )
                                                    )}
                                                </div>
                                                <div className="p-3 flex-grow">
                                                    <table className="w-full text-sm text-white">
                                                        <thead>
                                                            <tr className="border-b border-gray-600 dark:border-gray-600">
                                                                <th className="text-left font-normal py-1">Subcategoría</th>
                                                                <th className="text-right font-normal py-1">Monto</th>
                                                                {isEditingMode && <th className="w-6"></th>}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {data && data.rows && data.rows.length > 0 ? (
                                                                data.rows.map(row => {
                                                                    const isAmountEditing = editingCell?.subCategory === row.name;
                                                                    const isNameEditing = editingName?.subCategoryName === row.name && editingName.mainCategoryKey === catKey;
                                                                    return (
                                                                        <tr key={row.name}>
                                                                            <td className="py-2 pr-2" onClick={() => handleNameCellClick(catKey, row.name)}>
                                                                                {isNameEditing ? <input ref={nameInputRef} type="text" value={editingNameValue} onChange={(e) => setEditingNameValue(e.target.value)} onBlur={handleNameInputBlur} onKeyDown={(e) => handleInputKeyDown(e, handleNameInputBlur)} className="w-full bg-gray-900 p-0.5 rounded outline-none ring-1 ring-blue-500 dark:bg-gray-700 dark:text-white" /> : <span className={` ${isEditingMode ? 'cursor-pointer hover:text-blue-400' : ''}`}>{row.name}</span>}
                                                                            </td>
                                                                            <td className="py-2 pl-2 text-right font-bold" onClick={() => handleBudgetCellClick(row.name, row.budgeted)}>
                                                                                {isAmountEditing ? <input ref={budgetInputRef} type="number" value={editingValue} onChange={(e) => setEditingValue(e.target.value)} onBlur={handleBudgetInputBlur} onKeyDown={(e) => handleInputKeyDown(e, handleBudgetInputBlur)} className="w-full bg-gray-900 text-right p-0.5 rounded outline-none ring-1 ring-blue-500 dark:bg-gray-700 dark:text-white" /> : <span className={`${isEditingMode ? 'cursor-pointer hover:bg-gray-700 rounded p-1' : ''}`}>{formatCurrency(row.budgeted)}</span>}
                                                                            </td>
                                                                            {isEditingMode && <td className="py-2 pl-2 text-center w-6"><button onClick={() => handleDeleteClick(catKey, row.name)} className="text-red-500 hover:text-red-400 font-bold">X</button></td>}
                                                                        </tr>
                                                                    );
                                                                })
                                                            ) : (
                                                                isEditingMode && addingSubcat.category !== catKey && (
                                                                    <tr>
                                                                        <td colSpan={isEditingMode ? 3 : 2} className="py-2 text-center text-gray-400">
                                                                            No hay subcategorías.
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            )}
                                                            {addingSubcat.category === catKey && (
                                                                <tr>
                                                                    <td colSpan={isEditingMode ? 3 : 2} className="pt-2">
                                                                        <input ref={addInputRef} type="text" placeholder="Nueva subcategoría..." value={addingSubcat.name} onChange={e => setAddingSubcat({ ...addingSubcat, name: e.target.value })} onBlur={handleAddSubcatCommit} onKeyDown={e => handleInputKeyDown(e, handleAddSubcatCommit)} className="w-full bg-gray-700 p-1 rounded outline-none ring-1 ring-blue-500 dark:bg-gray-600 dark:text-white"/>
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div className="p-2 border-t-2 border-gray-700 mt-auto dark:border-gray-600">
                                                    <div className="flex justify-between items-center font-bold"><span>Total Presupuestado</span><span>{formatCurrency(data?.totalBudgeted || 0)}</span></div>
                                                    {data?.percentage.toFixed(2) !== '0.00' && data?.percentage > 0 && (
                                                        <div className="text-center font-bold text-lg mt-2" style={{color: styles.color}}>{data.percentage.toFixed(2)}%</div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                            })()
                        }
                        {Object.keys(userConfig?.categories || {}).length === 0 && !isEditingMode && (
                            <p className="text-gray-400 text-center col-span-full mt-4">
                                ¡Empieza añadiendo tus categorías y subcategorías en el menú de configuración (Ajustes)!
                            </p>
                        )}
                    </div>
                </section>
            )}
            <ConfirmationModal
                isOpen={deleteConfirmation.isOpen}
                onClose={() => setDeleteConfirmation({ isOpen: false, mainCatKey: null, subCat: null })}
                onConfirm={handleConfirmDelete}
                title="Confirmar Eliminación"
            >
                ¿Estás seguro de que quieres eliminar la subcategoría "<span className="font-bold text-red-300">{deleteConfirmation.subCat}</span>"? Esta acción no se puede deshacer.
            </ConfirmationModal>
        </div>
    );
}

export default DashboardPage;