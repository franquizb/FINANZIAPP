import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import useFinanceData from '../hooks/useFinanceData';
import {
    ResponsiveContainer, Legend, Tooltip,
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    AreaChart, Area, LineChart, Line,
    PieChart, Pie, Cell
} from 'recharts';
import { useTheme } from '../context/ThemeContext';

// --- CONSTANTES DE ESTILO (Sin cambios) ---
const CATEGORY_HEX_COLORS = {
    'Ingresos': '#4b5563',
    'GastosEsenciales': '#ca8a04',
    'GastosDiscrecionales': '#f97316',
    'PagoDeDeudas': '#b91c1c',
    'AhorroEInversion': '#059669'
};

const categoryOrder = ['Ingresos', 'GastosEsenciales', 'GastosDiscrecionales', 'PagoDeDeudas', 'AhorroEInversion'];
const categoryStyles = {
    'Ingresos': { color: '#4b5563', title: 'INGRESOS' },
    'GastosEsenciales': { color: '#ca8a04', title: 'GASTOS ESENCIALES' },
    'GastosDiscrecionales': { color: '#f97316', title: 'GASTOS DISCRECIONALES' },
    'PagoDeDeudas': { color: '#b91c1c', title: 'PAGO DE DEUDAS' },
    'AhorroEInversion': { color: '#059669', title: 'AHORRO E INVERSIÓN' }
};

// Componente de carga con spinner de círculo girando
const LoadingSpinner = () => {
    return (
        <div className="flex flex-col items-center justify-center text-white dark:text-gray-200 h-full"> {/* Added h-full for centering vertically */}
            <svg className="animate-spin h-8 w-8 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-3 text-lg">Cargando datos del dashboard...</p>
        </div>
    );
};

// --- COMPONENTES AUXILIARES (Sin cambios en funcionalidad) ---
const DashboardCard = ({ title, children, className = "" }) => (
    <div className={`bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-700 flex flex-col ${className} dark:bg-gray-800 dark:border-gray-700`}>
        <h3 className="text-lg font-bold text-white mb-4 dark:text-gray-200">{title}</h3>
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
        updateFinanceData,
        updateConfig,
        deleteFinanceDataField,
        deleteUserConfigField,
        getMonthName,
        availableYears
    } = useFinanceData(currentYear);

    const [activeTab, setActiveTab] = useState('charts'); // Valor por defecto inicial

    // NOTA: Se eliminó el useEffect que cambiaba activeTab automáticamente
    // para evitar el comportamiento de "salto" al guardar categorías.
    // La selección de pestaña ahora es puramente manual por el usuario.

    const [isEditingMode, setIsEditingMode] = useState(false);
    const [editingCell, setEditingCell] = useState(null);
    const [editingValue, setEditingValue] = useState('');
    
    const [editingName, setEditingName] = useState(null); 
    const [editingNameValue, setEditingNameValue] = useState(''); 
    
    const [addingSubcat, setAddingSubcat] = useState({ category: null, name: '' });
    const [deleteConfirmation, setDeleteConfirmation] = useState({ isOpen: false, mainCatKey: null, subCat: null, groupName: null }); 
    
    const budgetInputRef = useRef(null);
    const nameInputRef = useRef(null);
    const addInputRef = useRef(null);
    
    const [selectedMonthIndex, setSelectedMonthIndex] = useState(new Date().getMonth());
    // CORRECCIÓN: Estado para controlar que el año por defecto solo se establezca una vez.
    const [isInitialYearSet, setIsInitialYearSet] = useState(false);

    // CORRECCIÓN: Lógica para establecer el año por defecto de forma segura y solo al inicio.
    useEffect(() => {
        if (userConfig?.defaultYear && !isInitialYearSet) {
            if (availableYears && availableYears.map(String).includes(String(userConfig.defaultYear))) {
                setCurrentYear(String(userConfig.defaultYear));
            }
            setIsInitialYearSet(true);
        }
    }, [userConfig, availableYears, isInitialYearSet]);


    useEffect(() => { 
        if (editingCell) budgetInputRef.current?.focus(); 
    }, [editingCell]);

    useEffect(() => { 
        if (editingName) nameInputRef.current?.focus(); 
    }, [editingName]);

    useEffect(() => { 
        if (addingSubcat.category) addInputRef.current?.focus(); 
    }, [addingSubcat]);

    const formatCurrency = (value) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(typeof value === 'number' ? value : 0);
    const getMonthNameSpanish = (monthIndex) => ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'][monthIndex];
    const getDisplayMainCategoryName = (mainCategoryKey) => userConfig?.categoryDisplayNames?.[mainCategoryKey] || mainCategoryKey.replace(/([A-Z])/g, ' $1').trim();
    const isNestedCategory = (key) => ['Activos', 'Pasivos'].includes(key);

    const handleBudgetCellClick = (subCategory, currentValue) => { if(isEditingMode) { setEditingCell({ subCategory, originalValue: currentValue }); setEditingValue(currentValue.toString()); }};
    
    const handleNameCellClick = (mainCategoryKey, subCategoryName, groupName = null) => { 
        if(isEditingMode) { 
            setEditingName({ mainCategoryKey, subCategoryName, groupName }); 
            setEditingNameValue(subCategoryName); 
        }
    };
    
    const handleDeleteClick = (mainCatKey, subCat, groupName = null) => { 
        if(isEditingMode) { 
            setDeleteConfirmation({ isOpen: true, mainCatKey, subCat, groupName }); 
        }
    };
    
    const handleInputKeyDown = (e, onCommit) => { 
        if (e.key === 'Enter' || e.key === 'Tab') { e.preventDefault(); onCommit(); } 
        else if (e.key === 'Escape') { 
            setEditingCell(null); 
            setEditingName(null);
            setAddingSubcat({ category: null, name: '' }); 
        }
    };

    const getAllSubcategories = useCallback((mainCategoryKey) => {
        const cat = userConfig?.categories?.[mainCategoryKey];
        if (cat === undefined) return [];
        if (Array.isArray(cat)) { return cat; }
        else if (typeof cat === 'object' && cat !== null) {
            const order = userConfig?.[`${mainCategoryKey}GroupOrder`] || Object.keys(cat);
            let flatList = [];
            order.forEach(groupName => {
                if (cat[groupName] && Array.isArray(cat[groupName])) {
                    flatList = flatList.concat(cat[groupName]);
                }
            });
            return flatList;
        }
        return [];
    }, [userConfig]);

    const handleBudgetInputBlur = async () => {
        if (!editingCell) return;
        const { subCategory, originalValue } = editingCell;
        const finalValue = !isNaN(parseFloat(editingValue)) ? parseFloat(editingValue) : 0;
        setEditingCell(null);
        if (finalValue === originalValue) return;

        const updatePath = `${currentYear}.budget.${subCategory}`;
        const newData = {
            [currentYear]: {
                budget: {
                    [subCategory]: finalValue
                }
            }
        };
        await updateFinanceData(newData);
    };

    const handleAddSubcatCommit = async () => {
        const { category, name } = addingSubcat;
        if (!category || !name.trim()) { setAddingSubcat({ category: null, name: '' }); return; }
        const newName = name.trim();
        
        const updatedUserConfig = JSON.parse(JSON.stringify(userConfig));

        if (!updatedUserConfig.categories[category]) {
            updatedUserConfig.categories[category] = [];
        }

        if (Array.isArray(updatedUserConfig.categories[category])) {
            if (updatedUserConfig.categories[category].includes(newName)) { 
                alert("Esa subcategoría ya existe."); 
                setAddingSubcat({ category: null, name: '' });
                return; 
            }
            updatedUserConfig.categories[category].push(newName);
        } else {
            alert("Solo se pueden añadir subcategorías a categorías planas desde aquí (Ingresos, GastosEsenciales, etc.).");
            setAddingSubcat({ category: null, name: '' });
            return;
        }

        await updateConfig({ categories: updatedUserConfig.categories });

        const currentYearBudget = financeData?.[currentYear]?.budget || {};
        const newDataForFinance = {
            [currentYear]: {
                budget: {
                    ...currentYearBudget,
                    [newName]: 0
                }
            }
        };
        await updateFinanceData(newDataForFinance);
        setAddingSubcat({ category: null, name: '' });
    };

    const handleNameInputBlur = async () => {
        if (!editingName) return; 
        const { mainCategoryKey, subCategoryName, groupName } = editingName;
        const newName = editingNameValue.trim();
        setEditingName(null); 
        if (!newName || newName === subCategoryName) return;
        
        const updatedConfig = JSON.parse(JSON.stringify(userConfig));
        let configPath = `categories.${mainCategoryKey}`;
        let actualSubcategoryArray = null;

        if (isNestedCategory(mainCategoryKey)) {
            if (updatedConfig.categories[mainCategoryKey] && updatedConfig.categories[mainCategoryKey][groupName]) {
                actualSubcategoryArray = updatedConfig.categories[mainCategoryKey][groupName];
                configPath = `categories.${mainCategoryKey}.${groupName}`;
            }
        } else {
            actualSubcategoryArray = updatedConfig.categories[mainCategoryKey];
        }

        if (actualSubcategoryArray) {
            if (actualSubcategoryArray.includes(newName)) { 
                alert("Ese nombre ya existe en esta categoría/grupo."); 
                return; 
            }

            const oldIndex = actualSubcategoryArray.indexOf(subCategoryName);
            if (oldIndex !== -1) {
                actualSubcategoryArray[oldIndex] = newName;

                await updateConfig({ categories: updatedConfig.categories });

                const currentYearData = financeData[currentYear];
                if (currentYearData && currentYearData.budget && currentYearData.budget[subCategoryName] !== undefined) {
                    const budgetValue = currentYearData.budget[subCategoryName];
                    const newBudget = { ...currentYearData.budget };
                    newBudget[newName] = budgetValue;
                    delete newBudget[subCategoryName];

                    await deleteFinanceDataField(`${currentYear}.budget.${subCategoryName}`);
                    await updateFinanceData({
                        [currentYear]: {
                            budget: {
                                [newName]: budgetValue
                            }
                        }
                    });
                }
            }
        }
    };

    const handleConfirmDelete = async () => {
        const { mainCatKey, subCat, groupName } = deleteConfirmation;
        setDeleteConfirmation({ isOpen: false, mainCatKey: null, subCat: null, groupName: null });

        const updatedConfig = JSON.parse(JSON.stringify(userConfig));
        let configUpdatePath = `categories.${mainCatKey}`;
        let actualSubcategoryArray = null;

        if (isNestedCategory(mainCatKey) && groupName) {
            if (updatedConfig.categories[mainCatKey] && updatedConfig.categories[mainCatKey][groupName]) {
                actualSubcategoryArray = updatedConfig.categories[mainCatKey][groupName];
                configUpdatePath = `categories.${mainCatKey}.${groupName}`;
            }
        } else {
            actualSubcategoryArray = updatedConfig.categories[mainCatKey];
        }

        if (actualSubcategoryArray) {
            const initialLength = actualSubcategoryArray.length;
            const newSubcategoryArray = actualSubcategoryArray.filter(name => name !== subCat);

            if (newSubcategoryArray.length === initialLength) {
                console.warn(`Subcategory ${subCat} not found in config for deletion.`);
                return;
            }
            
            let newCategories = JSON.parse(JSON.stringify(userConfig.categories));
            if (isNestedCategory(mainCatKey) && groupName) {
                if (newCategories[mainCatKey] && newCategories[mainCatKey][groupName]) {
                    newCategories[mainCatKey][groupName] = newCategories[mainCatKey][groupName].filter(name => name !== subCat);
                }
            } else {
                if (newCategories[mainCatKey]) {
                    newCategories[mainCatKey] = newCategories[mainCatKey].filter(name => name !== subCat);
                }
            }

            await updateConfig({ categories: newCategories });

            const currentYearBudget = financeData?.[currentYear]?.budget;
            if (currentYearBudget && currentYearBudget[subCat] !== undefined) {
                await deleteFinanceDataField(`${currentYear}.budget.${subCat}`);
            }
        }
    };

    const memoizedData = useMemo(() => {
        const currentFinanceData = financeData || {};
        const currentUserConfig = userConfig || { categories: {} };
        
        // No devuelvas datos vacíos si no hay categorías, porque el `budgetData` se calculará incluso si no hay nada
        // La lógica de "no hay subcategorías definidas" se manejará dentro de `budgetData`
        if (Object.keys(currentUserConfig.categories).length === 0) {
            // Este caso es importante cuando el usuario no tiene categorías
            return {
                summaryCards: { totalIncome: 0, totalExpenses: 0, balance: 0 },
                monthlyChartData: [],
                expenseOverviewData: [],
                topExpensesData: [],
                categoryCardsData: [],
                netWorthChartData: [],
                budgetData: { remanente: 0, tables: {} } // Retorna una estructura vacía para budgetData
            };
        }


        const categories = currentUserConfig.categories;
        const annualData = currentFinanceData[currentYear] || {}; 
        const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

        const getAllSubcategoriesMemoized = (mainCategoryKey) => {
            const cat = categories[mainCategoryKey];
            if (cat === undefined) return [];
            if (Array.isArray(cat)) { return cat; }
            else if (typeof cat === 'object' && cat !== null) {
                const order = currentUserConfig?.[`${mainCategoryKey}GroupOrder`] || Object.keys(cat);
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
            Object.keys(categories).filter(k => k !== 'Ingresos' && k !== 'Activos' && k !== 'Pasivos').forEach(catKey => {
                monthTotals[catKey] = 0;
            });

            const incomeSubcategories = getAllSubcategoriesMemoized('Ingresos');
            incomeSubcategories.forEach(subCat => {
                const total = (monthTransactions[subCat]?.actual || []).reduce((sum, t) => sum + t.amount, 0);
                monthTotals.Ingresos += total;
            });

            const expenseMainCategoriesKeys = Object.keys(categories).filter(key =>
                !['Ingresos', 'Activos', 'Pasivos'].includes(key)
            );

            expenseMainCategoriesKeys.forEach(mainCatKey => {
                const subcatsInMainCat = getAllSubcategoriesMemoized(mainCatKey);
                subcatsInMainCat.forEach(subCat => {
                    const total = (monthTransactions[subCat]?.actual || []).reduce((sum, t) => sum + t.amount, 0);
                    if(monthTotals[mainCatKey] !== undefined) {
                        monthTotals[mainCatKey] += total;
                    } else {
                        monthTotals.Gastos += total;
                    }
                });
            });

            monthTotals.Gastos = expenseMainCategoriesKeys.reduce((sum, catKey) => sum + (monthTotals[catKey] || 0), 0);

            monthTotals.Balance = monthTotals.Ingresos - monthTotals.Gastos;
            return monthTotals;
        });

        const totalIncome = monthlyChartData.reduce((sum, d) => sum + d.Ingresos, 0);
        const totalExpenses = monthlyChartData.reduce((sum, d) => sum + d.Gastos, 0);
        const summaryCards = { totalIncome, totalExpenses, balance: totalIncome - totalExpenses };

        const currentMonthSelectedName = getMonthName(selectedMonthIndex);
        const currentMonthTransactions = annualData.monthly?.[currentMonthSelectedName] || {};
        
        const expenseMainCategoriesKeys = Object.keys(categories).filter(key =>
            !['Ingresos', 'Activos', 'Pasivos'].includes(key)
        );

        let currentMonthRealIncome = 0;
        const incomeSubcategoriesCurrentMonth = getAllSubcategoriesMemoized('Ingresos');
        incomeSubcategoriesCurrentMonth.forEach(subCat => {
            currentMonthRealIncome += (currentMonthTransactions[subCat]?.actual || []).reduce((sum, t) => sum + t.amount, 0);
        });

        let totalCurrentMonthExpenses = 0;
        const expenseOverviewData = [];
        
        expenseMainCategoriesKeys.forEach(mainCatKey => {
            const subcatsInMainCat = getAllSubcategoriesMemoized(mainCatKey);
            let totalForMainCat = 0;
            subcatsInMainCat.forEach(subCat => {
                totalForMainCat += (currentMonthTransactions[subCat]?.actual || []).reduce((sum, t) => sum + t.amount, 0);
            });
            totalCurrentMonthExpenses += totalForMainCat;

            if (totalForMainCat > 0) {
                expenseOverviewData.push({
                    name: getDisplayMainCategoryName(mainCatKey, userConfig),
                    value: totalForMainCat,
                    color: CATEGORY_HEX_COLORS[mainCatKey] || '#cccccc'
                });
            }
        });

        const categoryCardsData = (() => {
            const calculateTotalFor = (mainCatKeys) => {
                const keys = Array.isArray(mainCatKeys) ? mainCatKeys : [mainCatKeys];
                let total = 0;
                keys.forEach(key => {
                    const subcats = getAllSubcategoriesMemoized(key);
                    subcats.forEach(subCat => {
                        total += (currentMonthTransactions[subCat]?.actual || []).reduce((sum, t) => sum + t.amount, 0);
                    });
                });
                return total;
            };

            const totalGastos = calculateTotalFor(['GastosEsenciales', 'GastosDiscrecionales']);
            const totalDeudas = calculateTotalFor('PagoDeDeudas');
            const totalAhorro = calculateTotalFor('AhorroEInversion');

            const calculatePercentage = (total) => currentMonthRealIncome > 0 ? (total / currentMonthRealIncome) * 100 : 0;

            return [
                {
                    name: "GASTOS",
                    total: totalGastos,
                    percentage: calculatePercentage(totalGastos),
                    color: CATEGORY_HEX_COLORS['GastosDiscrecionales']
                },
                {
                    name: "PAGO DE DEUDAS",
                    total: totalDeudas,
                    percentage: calculatePercentage(totalDeudas),
                    color: CATEGORY_HEX_COLORS['PagoDeDeudas']
                },
                {
                    name: "AHORRO",
                    total: totalAhorro,
                    percentage: calculatePercentage(totalAhorro),
                    color: CATEGORY_HEX_COLORS['AhorroEInversion']
                }
            ];
        })();

        const topExpensesData = [];
        const allExpenseSubcategories = expenseMainCategoriesKeys.flatMap(key => getAllSubcategoriesMemoized(key));
        
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

        const budget = annualData.budget || {};
        const budgetData = (() => {
            const results = { tables: {}, remanente: 0 };
            const totalIncomeBudgeted = getAllSubcategoriesMemoized('Ingresos').reduce((sum, subCat) => sum + (budget[subCat] || 0), 0);

            const manageableCategories = ['Ingresos', 'GastosEsenciales', 'GastosDiscrecionales', 'PagoDeDeudas', 'AhorroEInversion'];
            
            manageableCategories.forEach(catKey => {
                const subCategoriesForBudget = getAllSubcategoriesMemoized(catKey);
                if (subCategoriesForBudget.length === 0) {
                    results.tables[catKey] = {
                        rows: [],
                        totalBudgeted: 0,
                        percentage: 0,
                        message: "Añade subcategorías en esta sección"
                    };
                    return;
                }

                const rows = subCategoriesForBudget.map(subCat => ({ name: subCat, budgeted: budget[subCat] || 0 }));
                const totalBudgeted = rows.reduce((sum, r) => sum + r.budgeted, 0);
                const percentage = totalIncomeBudgeted > 0 && catKey !== 'Ingresos' ? (totalBudgeted / totalIncomeBudgeted) * 100 : 0;
                results.tables[catKey] = { rows, totalBudgeted, percentage };
            });

            const totalExpensesAndSavingsBudgeted = Object.keys(results.tables).filter(k => k !== 'Ingresos').reduce((sum, k) => sum + results.tables[k].totalBudgeted, 0);
            results.remanente = totalIncomeBudgeted - totalExpensesAndSavingsBudgeted;

            return { tables: results.tables, remanente: results.remanente };
        })();


        const netWorthDataForChart = annualData.netWorth || { assets: {}, liabilities: {} };
        const monthlyNetWorthTotals = months.map((monthName, index) => {
            let totalAssets = 0;
            let totalLiabilities = 0;

            const activosSubcategoriesFlat = getAllSubcategoriesMemoized('Activos');
            activosSubcategoriesFlat.forEach(subCat => {
                const value = netWorthDataForChart?.Activos?.[subCat]?.[monthName];
                if (value !== undefined && !isNaN(value)) {
                    totalAssets += value;
                }
            });

            const pasivosSubcategoriesFlat = getAllSubcategoriesMemoized('Pasivos');
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
    }, [financeData, userConfig, currentYear, getMonthName, selectedMonthIndex, getAllSubcategories]);


    const {
        summaryCards,
        monthlyChartData,
        budgetData,
        netWorthChartData,
        expenseOverviewData,
        topExpensesData,
        categoryCardsData
    } = memoizedData;

    const remanenteColorClass = useMemo(() => {
        if (budgetData.remanente < 0) return 'text-red-400';
        if (budgetData.remanente === 0) return 'text-green-400';
        return 'text-purple-400';
    }, [budgetData.remanente]);

    // Modificación de la condición de carga
    if (loadingData && !financeData) return (
        <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
            <LoadingSpinner /> {/* Se usa LoadingSpinner aquí */}
        </div>
    );
    if (errorData) return <div className="text-center py-8 text-red-500">Error: {errorData}</div>;
    // Se mantiene esta condición para cuando los datos iniciales (userConfig, financeData) aún no están listos
    if (!userConfig || !financeData) return (
        <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
            <LoadingSpinner /> {/* Se usa LoadingSpinner aquí también */}
        </div>
    );

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-900 min-h-screen text-white dark:bg-gray-900 dark:text-gray-100">
            <ConfirmationModal
                isOpen={deleteConfirmation.isOpen}
                onClose={() => setDeleteConfirmation({ isOpen: false, mainCatKey: null, subCat: null, groupName: null })}
                onConfirm={handleConfirmDelete}
                title="Confirmar Eliminación"
            >
                ¿Estás seguro de que quieres eliminar la subcategoría "<span className="font-bold">{deleteConfirmation.subCat}</span>"? Esta acción es irreversible y afectará los datos históricos asociados a esta subcategoría en el presupuesto.
            </ConfirmationModal>

            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h2 className="text-3xl font-bold text-white mb-4 dark:text-gray-200">Dashboard Anual - {currentYear}</h2>
                <div className="flex gap-4 flex-wrap justify-center sm:justify-start">
                    <select
                        value={currentYear}
                        onChange={(e) => setCurrentYear(e.target.value)}
                        className="bg-gray-700 text-white p-2 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                        {availableYears.map(year => (
                            <option key={year} value={year.toString()}>{year}</option>
                        ))}
                    </select>

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

                    <div className="flex rounded-md bg-gray-700 p-1 flex-grow sm:flex-grow-0">
                        <button
                            onClick={() => setActiveTab('charts')}
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors w-1/2 sm:w-auto ${
                                activeTab === 'charts' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                            Gráficos
                        </button>
                        <button
                            onClick={() => setActiveTab('budget')}
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors w-1/2 sm:w-auto ${
                                activeTab === 'budget' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                            Presupuesto
                        </button>
                    </div>
                </div>
            </header>

            {activeTab === 'charts' && (
                <section>
                    <h2 className="text-3xl font-bold text-white mb-6 dark:text-gray-200">Resumen Anual</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-center">
                        <div className="bg-gray-800 p-4 rounded-lg shadow-lg dark:bg-gray-800 border border-gray-700 dark:border-gray-700">
                            <h3 className="text-md font-semibold text-gray-300 dark:text-gray-300">Ingresos Totales</h3>
                            <p className="text-2xl font-bold text-green-400">{formatCurrency(summaryCards.totalIncome)}</p>
                        </div>
                        <div className="bg-gray-800 p-4 rounded-lg shadow-lg dark:bg-gray-800 border border-gray-700 dark:border-gray-700">
                            <h3 className="text-md font-semibold text-gray-300 dark:text-gray-300">Gastos Totales</h3>
                            <p className="text-2xl font-bold text-red-400">{formatCurrency(summaryCards.totalExpenses)}</p>
                        </div>
                        <div className="bg-gray-800 p-4 rounded-lg shadow-lg dark:bg-gray-800 border border-gray-700 dark:border-gray-700">
                            <h3 className="text-md font-semibold text-gray-300 dark:text-gray-300">Balance Anual</h3>
                            <p className={`text-2xl font-bold ${summaryCards.balance >= 0 ? 'text-blue-400' : 'text-orange-400'}`}>{formatCurrency(summaryCards.balance)}</p>
                        </div>
                    </div>
                    
                    <DashboardCard title={`Desglose de Gastos (${getMonthNameSpanish(selectedMonthIndex)})`} className="lg:col-span-2 mb-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="md:col-span-1 min-h-[250px] flex flex-col items-center justify-center">
                                {expenseOverviewData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={200}>
                                        <PieChart>
                                            <Pie
                                                data={expenseOverviewData}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
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
                                            <Legend wrapperStyle={{fontSize: "12px", paddingTop: '10px'}}/>
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <p className="text-gray-400 text-center">No hay gastos para mostrar este mes.</p>
                                )}
                            </div>

                            <div className="md:col-span-1 flex flex-col min-h-0">
                                <h3 className="text-lg font-semibold text-white mb-2 text-center">Top Gastos del Mes</h3>
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
                        <div className="mt-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {categoryCardsData.map(card => (
                                    <div key={card.name} className="bg-gray-700 p-4 rounded-lg shadow-md text-center border" style={{borderColor: card.color}}>
                                        <h4 className="font-semibold text-white mb-1">{card.name}</h4>
                                        <p className="text-xl font-bold mb-1" style={{color: card.color}}>{formatCurrency(card.total)}</p>
                                        {card.percentage.toFixed(2) !== '0.00' && (
                                            <span className="text-sm text-gray-400">({card.percentage.toFixed(2)}% ingresos)</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </DashboardCard>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                        <DashboardCard title="Evolución del Patrimonio Neto" className="lg:col-span-2">
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

                        <DashboardCard title="Composición de Gastos Mensuales">
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={monthlyChartData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                                    <XAxis dataKey="name" stroke="#cbd5e0" />
                                    <YAxis tickFormatter={formatCurrency} stroke="#cbd5e0" />
                                    <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '0.5rem' }} cursor={{ fill: 'rgba(100, 116, 139, 0.1)' }}/>
                                    <Legend />
                                    {categoryOrder.filter(k => k !== 'Ingresos').map(catKey => {
                                        const style = categoryStyles[catKey];
                                        if (!style) return null;
                                        return (
                                            <Bar key={catKey} dataKey={catKey} stackId="gastos" fill={style.color} name={style.title} />
                                        );
                                    })}
                                </BarChart>
                            </ResponsiveContainer>
                        </DashboardCard>

                        <DashboardCard title="Evolución del Balance Mensual">
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
                    </div>
                </section>
            )}

            {activeTab === 'budget' && (
                <section>
                    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <h2 className="text-4xl font-extrabold text-white tracking-wider dark:text-gray-200">PRESUPUESTO ANUAL</h2>
                        <div className={`bg-purple-800 p-2 rounded-lg text-center shadow-lg border border-purple-500 dark:bg-purple-700 dark:border-purple-600 ${remanenteColorClass}`}>
                            <span className="block text-xs text-purple-200 font-bold">REMANENTE MENSUAL</span>
                            <span className="text-3xl font-bold">{formatCurrency(budgetData.remanente)}</span>
                        </div>
                        <button
                            onClick={() => setIsEditingMode(!isEditingMode)}
                            className={`px-4 py-2 rounded-md transition-colors font-bold text-sm ${isEditingMode ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} dark:bg-blue-700 dark:hover:bg-blue-800`}
                        >
                            {isEditingMode ? 'Finalizar Edición' : 'Activar Edición'}
                        </button>
                    </header>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
                        {categoryOrder.map(catKey => {
                            const data = budgetData.tables[catKey];
                            const styles = categoryStyles[catKey];
                            if (!styles) return null;

                            return (
                                <div key={catKey} className="rounded-lg shadow-lg flex flex-col bg-gray-800 border border-gray-700 dark:bg-gray-800 dark:border-gray-700">
                                    <div className="p-2 rounded-t-lg font-bold flex justify-between items-center text-white" style={{backgroundColor: styles.color}}>
                                        <span>{styles.title}</span>
                                        {isEditingMode && !isNestedCategory(catKey) && (
                                            <button onClick={() => setAddingSubcat({ category: catKey, name: '' })} className="bg-black bg-opacity-20 hover:bg-opacity-40 rounded-full h-6 w-6 flex items-center justify-center text-lg font-bold text-white">+</button>
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
                                                        const isNameEditing = editingName?.subCategoryName === row.name && editingName.mainCategoryKey === catKey && editingName.groupName === null;
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
                                                    <tr>
                                                        <td colSpan={isEditingMode ? 3 : 2} className="py-2 text-center text-gray-400">
                                                            {data?.message || "No hay subcategorías definidas."}
                                                        </td>
                                                    </tr>
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
                                        {data?.percentage > 0 && <div className="text-center font-bold text-lg mt-2" style={{color: styles.color}}>{data.percentage.toFixed(2)}%</div>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}
        </div>
    );
}

export default DashboardPage;