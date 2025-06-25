import React, { useState, useEffect, useMemo, useRef } from 'react';

import useFinanceData from '../hooks/useFinanceData';

import {
    PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip,
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    LineChart, Line // Nuevas importaciones para el gráfico de Patrimonio Neto
} from 'recharts';

// --- CAMBIO CLAVE: Mover constantes de estilo al principio del componente ---
// Se definen aquí para que estén disponibles para todos los hooks y la lógica de renderizado.
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

// --- NUEVAS CONSTANTES PARA EL GRÁFICO DE PATRIMONIO NETO (replicadas de NetWorthPage) ---
// Se definen aquí para que este componente sea autónomo respecto a la lógica del gráfico de patrimonio neto.
const NET_WORTH_MONTHS_KEYS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];


// Componente Modal de Confirmación
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
            <div className="bg-gray-800 rounded-lg p-6 shadow-xl w-full max-w-md border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
                <div className="text-gray-300 mb-6">{children}</div>
                <div className="flex justify-end gap-4">
                    <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500 text-white transition-colors">Cancelar</button>
                    <button onClick={onConfirm} className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-500 text-white transition-colors">Confirmar</button>
                </div>
            </div>
        </div>
    );
};


function DashboardPage() {
    const {
        allFinanceData: financeData,
        userConfig,
        loading,
        error,
        currentYear,
        setCurrentYear,
        updateFinanceData,
        updateConfig,
        getMonthName // Este getMonthName devuelve nombres de meses capitalizados, ej. "Enero"
    } = useFinanceData();

    const [displayMode, setDisplayMode] = useState('charts');
    const [isEditingMode, setIsEditingMode] = useState(false);

    // Estados para la edición
    const [editingCell, setEditingCell] = useState(null);
    const [editingValue, setEditingValue] = useState('');
    const [editingName, setEditingName] = useState(null);
    const [editingNameValue, setEditingNameValue] = useState('');
    const [addingSubcat, setAddingSubcat] = useState({ category: null, name: '' });
    const [deleteConfirmation, setDeleteConfirmation] = useState({ isOpen: false, mainCatKey: null, subCat: null });

    // Referencias a inputs para poder enfocarlos
    const budgetInputRef = useRef(null);
    const nameInputRef = useRef(null);
    const addInputRef = useRef(null);

    useEffect(() => { if (editingCell) budgetInputRef.current?.focus(); }, [editingCell]);
    useEffect(() => { if (editingName) nameInputRef.current?.focus(); }, [editingName]);
    useEffect(() => { if (addingSubcat.category) addInputRef.current?.focus(); }, [addingSubcat]);

    // --- FUNCIONES AUXILIARES ---
    const formatCurrency = (value) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(typeof value === 'number' ? value : 0);
    // getMonthNameSpanish ya está en Dashboard y devuelve abreviaciones como 'Ene'
    const getMonthNameSpanish = (monthIndex) => ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'][monthIndex];
    const getDisplayMainCategoryName = (mainCategoryKey) => userConfig?.categoryDisplayNames?.[mainCategoryKey] || mainCategoryKey.replace(/([A-Z])/g, ' $1').trim();

    // --- MANEJADORES DE INTERACCIÓN ---
    const handleBudgetCellClick = (subCategory, currentValue) => { if(isEditingMode) { setEditingCell({ subCategory, originalValue: currentValue }); setEditingValue(currentValue.toString()); }};
    const handleNameCellClick = (mainCategoryKey, subCategoryName) => { if(isEditingMode) { setEditingName({ mainCategoryKey, subCategoryName }); setEditingNameValue(subCategoryName); }};
    const handleDeleteClick = (mainCatKey, subCat) => { if(isEditingMode) { setDeleteConfirmation({ isOpen: true, mainCatKey, subCat }); }};
    const handleInputKeyDown = (e, onCommit) => { if (e.key === 'Enter' || e.key === 'Tab') { e.preventDefault(); onCommit(); } else if (e.key === 'Escape') { setEditingCell(null); setEditingName(null); setAddingSubcat({ category: null, name: '' }); }};

    // --- LÓGICA DE ACTUALIZACIÓN DE DATOS ---
    const updateCurrentYearData = async (dataToMerge) => {
        const currentYearData = financeData[currentYear] || {};
        const updatedYearData = { ...currentYearData, ...dataToMerge };
        await updateFinanceData({ [currentYear]: updatedYearData });
    };

    const handleBudgetInputBlur = async () => {
        if (!editingCell) return;
        const { subCategory, originalValue } = editingCell;
        const finalValue = !isNaN(parseFloat(editingValue)) ? parseFloat(editingValue) : 0;
        setEditingCell(null);
        if (finalValue === originalValue) return;

        const budget = financeData[currentYear]?.budget || {};
        budget[subCategory] = finalValue;

        await updateCurrentYearData({ budget });
    };

    const handleAddSubcatCommit = async () => {
        const { category, name } = addingSubcat;
        if (!category || !name.trim()) { setAddingSubcat({ category: null, name: '' }); return; }
        const newName = name.trim();
        const updatedConfig = JSON.parse(JSON.stringify(userConfig));
        if (updatedConfig.categories[category].includes(newName)) { alert("Esa subcategoría ya existe."); return; }

        updatedConfig.categories[category].push(newName);

        const budget = financeData[currentYear]?.budget || {};
        budget[newName] = 0;

        await updateConfig({ categories: updatedConfig.categories });
        await updateCurrentYearData({ budget });
        setAddingSubcat({ category: null, name: '' });
    };

    const handleNameInputBlur = async () => {
        if (!editingName) return;
        const { mainCategoryKey, subCategoryName } = editingName;
        const newName = editingNameValue.trim();
        setEditingName(null);
        if (!newName || newName === subCategoryName) return;

        const updatedConfig = JSON.parse(JSON.stringify(userConfig));
        const subCatArray = updatedConfig.categories[mainCategoryKey];
        if (subCatArray.includes(newName)) { alert("Ese nombre ya existe."); return; }

        updatedConfig.categories[mainCategoryKey] = subCatArray.map(name => name === subCategoryName ? newName : name);

        const budget = financeData[currentYear]?.budget || {};
        if (budget && budget[subCategoryName] !== undefined) {
            budget[newName] = budget[subCategoryName];
            delete budget[subCategoryName];
        }

        await updateConfig({ categories: updatedConfig.categories });
        await updateCurrentYearData({ budget });
    };

    const handleConfirmDelete = async () => {
        const { mainCatKey, subCat } = deleteConfirmation;
        const updatedConfig = JSON.parse(JSON.stringify(userConfig));

        updatedConfig.categories[mainCatKey] = updatedConfig.categories[mainCatKey].filter(name => name !== subCat);

        const budget = financeData[currentYear]?.budget || {};
        if (budget) delete budget[subCat];

        await updateConfig({ categories: updatedConfig.categories });
        await updateCurrentYearData({ budget });
        setDeleteConfirmation({ isOpen: false, mainCatKey: null, subCat: null });
    };

    // --- PROCESAMIENTO DE DATOS MEMOIZADO ---
    const memoizedData = useMemo(() => {
        if (!userConfig?.categories || !financeData) {
            return {
                annualSummary: { monthlyBars: [], totalIncome: 0, totalExpenses: 0, balance: 0 },
                budgetData: { remanente: 0, tables: {} },
                chartData: { expenseDistribution: [], netWorthChartData: [] } // Inicializar netWorthChartData
            };
        }

        const categories = userConfig.categories;
        const annualData = financeData[currentYear] || {};
        const displayNameToKeyMap = Object.entries(userConfig.categoryDisplayNames || {}).reduce((acc, [key, val]) => { acc[val] = key; return acc; }, {});


        const annualSummary = (() => {
            const monthlyRecords = annualData.monthly || {};
            const monthlyData = Array.from({ length: 12 }, (_, i) => {
                const monthName = getMonthName(i); // Ej. "Enero"
                const monthTransactions = monthlyRecords[monthName] || {};
                let income = 0, expenses = 0;
                (categories.Ingresos || []).forEach(subCat => { income += (monthTransactions[subCat]?.actual || []).reduce((sum, t) => sum + t.amount, 0); });
                Object.keys(categories).filter(k => k !== 'Ingresos' && Array.isArray(categories[k])).forEach(catKey => { (categories[catKey] || []).forEach(subCat => { expenses += (monthTransactions[subCat]?.actual || []).reduce((sum, t) => sum + t.amount, 0); }); });
                return { name: getMonthNameSpanish(i), Ingresos: income, Gastos: expenses };
            });
            const totalIncome = monthlyData.reduce((sum, d) => sum + d.Ingresos, 0);
            const totalExpenses = monthlyData.reduce((sum, d) => sum + d.Gastos, 0);
            return { monthlyBars: monthlyData, totalIncome, totalExpenses, balance: totalIncome - totalExpenses };
        })();

        const expenseDistribution = (() => {
            const currentMonthName = getMonthName(new Date().getMonth());
            const currentMonthTransactions = annualData.monthly?.[currentMonthName] || {};
            const distribution = {};
            Object.keys(categories).filter(k => k !== 'Ingresos' && Array.isArray(categories[k])).forEach(catKey => {
                (categories[catKey] || []).forEach(subCat => {
                    const total = (currentMonthTransactions[subCat]?.actual || []).reduce((sum, t) => sum + t.amount, 0);
                    if (total > 0) {
                        const displayName = getDisplayMainCategoryName(catKey);
                        distribution[displayName] = (distribution[displayName] || 0) + total;
                    }
                });
            });
            return Object.keys(distribution).map(name => {
                const keyFromName = Object.keys(categoryStyles).find(k => categoryStyles[k].title === name.toUpperCase().replace(' ', ' '));
                return {name, value: distribution[name], key: displayNameToKeyMap[name] || keyFromName }
            });
        })();

        const budgetData = (() => {
            const budget = annualData.budget || {};
            const results = {};
            const totalIncome = (categories['Ingresos'] || []).reduce((sum, subCat) => sum + (budget[subCat] || 0), 0);
            Object.keys(categories).forEach(catKey => {
                if (!Array.isArray(categories[catKey])) return;
                const rows = categories[catKey].map(subCat => ({ name: subCat, budgeted: budget[subCat] || 0 }));
                const totalBudgeted = rows.reduce((sum, r) => sum + r.budgeted, 0);
                results[catKey] = { rows, totalBudgeted, percentage: totalIncome > 0 && catKey !== 'Ingresos' ? (totalBudgeted / totalIncome) * 100 : 0 };
            });
            const totalExpensesAndSavings = Object.keys(results).filter(k => k !== 'Ingresos').reduce((sum, k) => sum + results[k].totalBudgeted, 0);
            results.remanente = totalIncome - totalExpensesAndSavings;
            return { tables: results, remanente: results.remanente };
        })();

        // --- CÁLCULO DE DATOS DEL GRÁFICO DE PATRIMONIO NETO (Lógica importada de NetWorthPage) ---
        const netWorthChartData = (() => {
            const netWorthData = annualData.netWorth || {};

            // Asegurarse de que las categorías 'Activos' y 'Pasivos' existen y tienen la estructura esperada
            if (!userConfig?.categories?.Activos || !userConfig?.categories?.Pasivos) {
                return [];
            }

            const monthlyTotals = NET_WORTH_MONTHS_KEYS.map((monthName) => { // monthName en minúsculas (ej. "enero") para acceder a los datos
                let totalAssets = 0, totalLiabilities = 0;

                // Sumar activos por subcategoría dentro de cada grupo
                // userConfig.categories.Activos puede ser un objeto con nombres de grupo como claves
                Object.values(userConfig.categories.Activos).flat().forEach(subCat => {
                    totalAssets += netWorthData.Activos?.[subCat]?.[monthName] || 0;
                });

                // Sumar pasivos por subcategoría dentro de cada grupo
                // userConfig.categories.Pasivos puede ser un objeto con nombres de grupo como claves
                Object.values(userConfig.categories.Pasivos).flat().forEach(subCat => {
                    totalLiabilities += netWorthData.Pasivos?.[subCat]?.[monthName] || 0;
                });

                return { totalAssets, totalLiabilities, netWorth: totalAssets - totalLiabilities };
            });

            return monthlyTotals.map((data, index) => ({
                name: getMonthNameSpanish(index), // Usar los nombres de mes abreviados (Ene, Feb, etc.) para el eje X del gráfico
                Activos: data.totalAssets,
                Pasivos: data.totalLiabilities,
                'Patrimonio Neto': data.netWorth,
            }));
        })();

        return { annualSummary, budgetData, chartData: { expenseDistribution, netWorthChartData } };
    }, [financeData, userConfig, currentYear, getMonthName]); // Se añadió getMonthName a las dependencias

    if (loading) return <div className="flex justify-center items-center h-screen bg-gray-900 text-white text-xl">Sincronizando datos...</div>;
    if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

    return (
        <div className="p-4 sm:p-6 bg-gray-900 text-white min-h-screen">
            <ConfirmationModal isOpen={deleteConfirmation.isOpen} onClose={() => setDeleteConfirmation({ isOpen: false })} onConfirm={handleConfirmDelete} title="Confirmar Eliminación">
                <p>¿Seguro que quieres eliminar la subcategoría <strong className="text-yellow-400">"{deleteConfirmation.subCat}"</strong>?</p>
                <p className="mt-2 text-sm text-gray-400">Esta acción no se puede deshacer.</p>
            </ConfirmationModal>

            <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                <div className="flex items-center gap-4 bg-gray-800 p-1 rounded-lg border border-gray-700">
                    <button onClick={() => setDisplayMode('charts')} className={`px-4 py-2 text-sm rounded-md transition-colors ${displayMode === 'charts' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>Gráficos</button>
                    <button onClick={() => setDisplayMode('budget')} className={`px-4 py-2 text-sm rounded-md transition-colors ${displayMode === 'budget' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>Presupuesto</button>
                </div>
                <div className="flex items-center gap-4">
                    <select value={currentYear} onChange={(e) => setCurrentYear(e.target.value)} className="bg-gray-700 text-white p-2 rounded-md">
                        {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => <option key={year} value={year}>{year}</option>)}
                    </select>
                    {displayMode === 'budget' && (
                        <button
                            onClick={() => setIsEditingMode(!isEditingMode)}
                            className={`px-4 py-2 rounded-md transition-colors font-bold text-sm ${isEditingMode ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                        >
                            {isEditingMode ? 'Finalizar Edición' : 'Activar Edición'}
                        </button>
                    )}
                </div>
            </header>

            {displayMode === 'charts' && (
                <section>
                    <h2 className="text-3xl font-bold text-white mb-6">Resumen Anual</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-center">
                        <div className="bg-gray-800 p-4 rounded-lg">
                            <h3 className="text-gray-400">Ingresos Totales</h3>
                            <p className="text-2xl font-bold text-green-400">{formatCurrency(memoizedData.annualSummary.totalIncome)}</p>
                        </div>
                        <div className="bg-gray-800 p-4 rounded-lg">
                            <h3 className="text-gray-400">Gastos Totales</h3>
                            <p className="text-2xl font-bold text-red-400">{formatCurrency(memoizedData.annualSummary.totalExpenses)}</p>
                        </div>
                        <div className="bg-gray-800 p-4 rounded-lg">
                            <h3 className="text-gray-400">Balance Anual</h3>
                            <p className={`text-2xl font-bold ${memoizedData.annualSummary.balance >= 0 ? 'text-blue-400' : 'text-orange-400'}`}>
                                {formatCurrency(memoizedData.annualSummary.balance)}
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-gray-800 p-6 rounded-lg">
                            <h3 className="text-xl font-bold mb-4">Ingresos vs. Gastos Mensuales</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={memoizedData.annualSummary.monthlyBars}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                                    <XAxis dataKey="name" stroke="#cbd5e0" />
                                    <YAxis tickFormatter={formatCurrency}/>
                                    <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                                    <Legend />
                                    <Bar dataKey="Ingresos" fill="#10b981" />
                                    <Bar dataKey="Gastos" fill="#ef4444" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="bg-gray-800 p-6 rounded-lg">
                            <h3 className="text-xl font-bold mb-4">Distribución de Gastos (Mes Actual)</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie data={memoizedData.chartData.expenseDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={5}>
                                        {memoizedData.chartData.expenseDistribution.map((entry) => (
                                            <Cell key={entry.name} fill={CATEGORY_HEX_COLORS[entry.key] || '#8884d8'} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* NUEVO: Gráfico de Evolución Anual del Patrimonio Neto */}
                    <div className="bg-gray-800 p-6 rounded-lg shadow-md mt-8">
                        <h3 className="text-xl font-bold text-white mb-4">Evolución Anual del Patrimonio Neto</h3>
                        <ResponsiveContainer width="100%" height={350}>
                            <LineChart data={memoizedData.chartData.netWorthChartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                                <XAxis dataKey="name" stroke="#cbd5e0" />
                                <YAxis tickFormatter={formatCurrency} stroke="#cbd5e0" />
                                <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} itemStyle={{ color: '#ffffff' }} />
                                <Legend />
                                <Line type="monotone" dataKey="Activos" stroke="#82ca9d" />
                                <Line type="monotone" dataKey="Pasivos" stroke="#ef4444" />
                                <Line type="monotone" dataKey="Patrimonio Neto" stroke="#8884d8" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </section>
            )}

            {displayMode === 'budget' && (
                <section>
                    <header className="flex justify-between items-start mb-6">
                        <h2 className="text-4xl font-extrabold text-white tracking-wider">PRESUPUESTO</h2>
                        <div className="bg-purple-800 p-2 rounded-lg text-center shadow-lg border border-purple-500">
                            <span className="block text-xs text-purple-200 font-bold">REMANENTE</span>
                            <span className="text-3xl font-bold">{formatCurrency(memoizedData.budgetData.remanente)}</span>
                        </div>
                    </header>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
                        {categoryOrder.map(catKey => {
                            const data = memoizedData.budgetData.tables[catKey];
                            const styles = categoryStyles[catKey];
                            if (!data || !styles) return null;
                            return (
                                <div key={catKey} className="rounded-lg shadow-lg flex flex-col bg-gray-800">
                                    <div className="p-2 rounded-t-lg font-bold flex justify-between items-center text-white" style={{backgroundColor: styles.color}}>
                                        <span>{styles.title}</span>
                                        {isEditingMode && <button onClick={() => setAddingSubcat({ category: catKey, name: '' })} className="bg-black bg-opacity-20 hover:bg-opacity-40 rounded-full h-6 w-6 flex items-center justify-center text-lg font-bold">+</button> }
                                    </div>
                                    <div className="p-3 flex-grow">
                                        <table className="w-full text-sm text-white">
                                            <thead>
                                                <tr className="border-b border-gray-600">
                                                    <th className="text-left font-normal py-1">Subcategoría</th>
                                                    <th className="text-right font-normal py-1">Monto</th>
                                                    {isEditingMode && <th className="w-6"></th>}
                                                </tr>
                                            </thead>
                                            <tbody>
                                            {data.rows.map(row => {
                                                const isAmountEditing = editingCell?.subCategory === row.name;
                                                const isNameEditing = editingName?.subCategoryName === row.name;
                                                return (
                                                    <tr key={row.name}>
                                                        <td className="py-2 pr-2" onClick={() => handleNameCellClick(catKey, row.name)}>
                                                            {isNameEditing ? (
                                                                <input
                                                                    ref={nameInputRef}
                                                                    type="text"
                                                                    value={editingNameValue}
                                                                    onChange={(e) => setEditingNameValue(e.target.value)}
                                                                    onBlur={handleNameInputBlur}
                                                                    onKeyDown={(e) => handleInputKeyDown(e, handleNameInputBlur)}
                                                                    className="w-full bg-gray-900 p-0.5 rounded outline-none ring-1 ring-blue-500"
                                                                />
                                                            ) : (
                                                                <span className={` ${isEditingMode ? 'cursor-pointer hover:text-blue-400' : ''}`}>
                                                                    {row.name}
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="py-2 pl-2 text-right font-bold" onClick={() => handleBudgetCellClick(row.name, row.budgeted)}>
                                                            {isAmountEditing ? (
                                                                <input
                                                                    ref={budgetInputRef}
                                                                    type="number"
                                                                    value={editingValue}
                                                                    onChange={(e) => setEditingValue(e.target.value)}
                                                                    onBlur={handleBudgetInputBlur}
                                                                    onKeyDown={(e) => handleInputKeyDown(e, handleBudgetInputBlur)}
                                                                    className="w-full bg-gray-900 text-right p-0.5 rounded outline-none ring-1 ring-blue-500"
                                                                />
                                                            ) : (
                                                                <span className={`${isEditingMode ? 'cursor-pointer hover:bg-gray-700 rounded p-1' : ''}`}>
                                                                    {formatCurrency(row.budgeted)}
                                                                </span>
                                                            )}
                                                        </td>
                                                        {isEditingMode && (
                                                            <td className="py-2 pl-2 text-center w-6">
                                                                <button onClick={() => handleDeleteClick(catKey, row.name)} className="text-red-500 hover:text-red-400 font-bold">X</button>
                                                            </td>
                                                        )}
                                                    </tr>
                                                );
                                            })}
                                            {addingSubcat.category === catKey && (
                                                <tr>
                                                    <td colSpan={isEditingMode ? 3: 2} className="pt-2">
                                                        <input
                                                            ref={addInputRef}
                                                            type="text"
                                                            placeholder="Nueva subcategoría..."
                                                            value={addingSubcat.name}
                                                            onChange={e => setAddingSubcat({ ...addingSubcat, name: e.target.value })}
                                                            onBlur={handleAddSubcatCommit}
                                                            onKeyDown={e => handleInputKeyDown(e, handleAddSubcatCommit)}
                                                            className="w-full bg-gray-700 p-1 rounded outline-none ring-1 ring-blue-500"
                                                        />
                                                    </td>
                                                </tr>
                                            )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="p-2 border-t-2 border-gray-700 mt-auto">
                                        <div className="flex justify-between items-center font-bold">
                                            <span>Total</span>
                                            <span>{formatCurrency(data.totalBudgeted)}</span>
                                        </div>
                                        {data.percentage > 0 && <div className="text-center font-bold text-lg mt-2" style={{color: styles.color}}>{data.percentage.toFixed(2)}%</div>}
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
