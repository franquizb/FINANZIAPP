// src/pages/MonthlyTrackerPage.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import useFinanceData from '../hooks/useFinanceData';
import { useAuth } from '../context/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const CATEGORY_HEX_COLORS = { 'Ingresos': '#4b5563', 'GastosEsenciales': '#ca8a04', 'GastosDiscrecionales': '#f97316', 'PagoDeDeudas': '#b91c1c', 'AhorroEInversion': '#059669' };

// Define categoryOrder al nivel superior para que sea globalmente accesible
const categoryOrder = ['Ingresos', 'GastosEsenciales', 'GastosDiscrecionales', 'PagoDeDeudas', 'AhorroEInversion'];

// Definir categoryStyles aquí para que sea accesible de manera consistente
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
        <div className="flex flex-col items-center justify-center text-white dark:text-gray-200">
            <svg className="animate-spin h-8 w-8 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-3 text-lg">Cargando datos mensuales...</p>
        </div>
    );
};


// --- Componente para el Formulario de Registro Rápido (con diseño responsive) ---
const QuickTransactionForm = ({ userConfig, onAddTransaction }) => {
    const [amount, setAmount] = useState('');
    const [selectedSubcat, setSelectedSubcat] = useState('');
    const [type, setType] = useState('gasto');

    const subcatToMainCatMap = useMemo(() => {
        if (!userConfig?.categories) return {};
        const map = {};
        Object.entries(userConfig.categories).forEach(([mainCat, subCats]) => {
            if (Array.isArray(subCats)) {
                subCats.forEach(subCat => { map[subCat] = mainCat; });
            } else if (typeof subCats === 'object' && subCats !== null) {
                Object.values(subCats).forEach(groupSubCats => {
                    if (Array.isArray(groupSubCats)) {
                        groupSubCats.forEach(subCat => { map[subCat] = mainCat; });
                    }
                });
            }
        });
        return map;
    }, [userConfig?.categories]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!amount || parseFloat(amount) <= 0 || !selectedSubcat) {
            alert("Por favor, introduce un monto positivo y selecciona una categoría.");
            return;
        }
        
        onAddTransaction({
            amount: parseFloat(amount),
            category: selectedSubcat, // Pass subCategory as 'category' in the transaction object
            type: type === 'ingreso' ? 'income' : 'expense',
            description: '', // Quick form doesn't have description input, can leave empty
        });
        setAmount('');
        setSelectedSubcat('');
    };

    const categoriesForDropdown = useMemo(() => {
        if (!userConfig?.categories) return [];
        const categories = userConfig.categories;
        const displayNames = userConfig.categoryDisplayNames || {};

        const getFlatSubcategories = (mainCatKey) => {
            const cat = categories[mainCatKey];
            if (cat === undefined) return [];
            if (Array.isArray(cat)) { return cat; }
            if (typeof cat === 'object' && cat !== null) {
                let flatList = [];
                Object.values(cat).forEach(groupSubCats => {
                    if (Array.isArray(groupSubCats)) { flatList = flatList.concat(groupSubCats); }
                });
                return flatList;
            }
            return [];
        };

        let dropdownCategories = [];

        if (type === 'ingreso') {
            const incomeSubcats = getFlatSubcategories('Ingresos');
            if (incomeSubcats.length > 0) {
                dropdownCategories.push({
                    label: displayNames['Ingresos'] || 'Ingresos',
                    options: incomeSubcats
                });
            }
        } else {
            const expenseMainCategoriesKeys = Object.keys(categories).filter(key =>
                !['Ingresos', 'Activos', 'Pasivos'].includes(key)
            );
            expenseMainCategoriesKeys.forEach(mainCatKey => {
                const options = getFlatSubcategories(mainCatKey);
                if (options.length > 0) {
                    dropdownCategories.push({
                        label: displayNames[mainCatKey] || mainCatKey.replace(/([A-Z])/g, ' $1').trim(),
                        options: options
                    });
                }
            });
        }
        return dropdownCategories;
    }, [userConfig?.categories, userConfig?.categoryDisplayNames, type]);


    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-2 md:grid-cols-4 gap-3 items-end">
            <div className="col-span-2 md:col-span-1 flex bg-gray-700/80 p-1 rounded-lg">
                <button type="button" onClick={() => setType('gasto')} className={`w-1/2 p-2 rounded-md text-sm font-bold transition-colors ${type === 'gasto' ? 'bg-red-500/80 text-white' : 'text-gray-400'}`}>Gasto</button>
                <button type="button" onClick={() => setType('ingreso')} className={`w-1/2 p-2 rounded-md text-sm font-bold transition-colors ${type === 'ingreso' ? 'bg-green-500/80 text-white' : 'text-gray-400'}`}>Ingreso</button>
            </div>
            <div>
                <label htmlFor="amount" className="text-xs font-semibold text-gray-400">Cantidad</label>
                <input id="amount" type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="w-full bg-gray-800 border border-gray-600 p-2 rounded-md text-white mt-1" required />
            </div>
            <div>
                <label htmlFor="category" className="text-xs font-semibold text-gray-400">Categoría</label>
                <select id="category" value={selectedSubcat} onChange={(e) => setSelectedSubcat(e.target.value)} className="w-full bg-gray-800 border border-gray-600 p-2 rounded-md text-white mt-1" required>
                    <option value="" disabled>{categoriesForDropdown.length > 0 ? "Seleccionar..." : "No hay categorías disponibles"}</option>
                    {categoriesForDropdown.map(group => (
                        <optgroup key={group.label} label={group.label}>
                            {group.options.map(subCat => <option key={subCat} value={subCat}>{subCat}</option>)}
                        </optgroup>
                    ))}
                </select>
            </div>
            <button type="submit" className="col-span-2 md:col-span-1 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-2 rounded-md transition-colors h-10">Añadir</button>
        </form>
    );
};

// Componente para una entrada de transacción (sin cambios)
const TransactionItem = ({ transaction, onDelete, formatCurrency }) => {
    return (
        <div className="flex justify-between items-center bg-gray-700 p-3 rounded-md shadow-sm mb-2 hover:bg-gray-600 transition-colors">
            <div className="flex-1">
                <p className="text-white font-semibold">{transaction.description || transaction.category}</p>
                <p className="text-gray-400 text-sm">{transaction.category} - {new Date(transaction.date).toLocaleDateString()}</p>
            </div>
            <div className={`text-lg font-bold ${transaction.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                {formatCurrency(transaction.amount * (transaction.type === 'income' ? 1 : -1))}
            </div>
            <div className="ml-4 flex space-x-2">
                <button onClick={() => onDelete(transaction.id)} className="text-red-400 hover:text-red-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
            </div>
        </div>
    );
};


function MonthlyTrackerPage() {
    const {
        financeData,
        userConfig,
        loadingData,
        errorData,
        currentYear,
        setCurrentYear,
        getMonthName,
        updateFinanceData,
        availableYears
    } = useFinanceData();

    const { currentUser } = useAuth();

    const [selectedMonthIndex, setSelectedMonthIndex] = useState(new Date().getMonth());
    const [formError, setFormError] = useState('');
    const [formMessage, setFormMessage] = useState('');

    const formatCurrency = (value) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(typeof value === 'number' ? value : 0);
    const getMonthNameSpanish = (monthIndex) => ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'][monthIndex];

    const monthlySummary = useMemo(() => {
        if (!financeData?.[currentYear] || !userConfig?.categories) {
            return {
                visionGeneral: [], remanente: 0, tasaAhorro: 0, detailedTables: {},
                egresosData: [], moneyFlowData: [], totalBudgeted: 0, totalActual: 0, monthlyBalance: 0,
                totalRealIngresosMes: 0
            };
        }

        const { categories, categoryDisplayNames } = userConfig;
        const annualData = financeData[currentYear] || {};
        const monthName = getMonthName(selectedMonthIndex);
        const monthTransactions = annualData.monthly?.[monthName] || {};
        const budget = annualData.budget || {};

        const results = {};
        
        const getFlatSubcategories = (mainCatKey) => {
            const cat = categories[mainCatKey];
            if (cat === undefined) return [];
            if (Array.isArray(cat)) { return cat; }
            if (typeof cat === 'object' && cat !== null) {
                let flatList = [];
                Object.values(cat).forEach(groupSubCats => {
                    if (Array.isArray(groupSubCats)) { flatList = flatList.concat(groupSubCats); }
                });
                return flatList;
            }
            return [];
        };

        categoryOrder.forEach(mainCatKey => {
            if (!categories[mainCatKey]) { 
                results[mainCatKey] = { rows: [], totalReal: 0, totalEstimado: 0, percentageOfTotal: 0 };
                return; 
            }

            const subcategoriesInMainCat = getFlatSubcategories(mainCatKey);

            const rows = subcategoriesInMainCat.map(subCat => {
                const real = (monthTransactions[subCat]?.actual || []).reduce((sum, t) => sum + t.amount, 0);
                const estimado = budget[subCat] || 0;
                return { name: subCat, real, estimado }; // Removed percentage from subcategory row
            });
            const totalReal = rows.reduce((sum, r) => sum + r.real, 0);
            const totalEstimado = rows.reduce((sum, r) => sum + r.estimado, 0);
            results[mainCatKey] = { rows, totalReal, totalEstimado, percentageOfTotal: 0 }; 
        });
        
        let totalBudgetedOverall = 0;
        Object.keys(categories || {}).forEach(mainCatKey => {
            if (!['Activos', 'Pasivos'].includes(mainCatKey)) {
                getFlatSubcategories(mainCatKey).forEach(subCat => {
                    totalBudgetedOverall += budget[subCat] || 0;
                });
            }
        });


        const totalRealIngresosMes = results['Ingresos']?.totalReal || 0;
        const totalRealEgresos = Object.keys(results).filter(k => k !== 'Ingresos').reduce((sum, k) => sum + results[k].totalReal, 0);
        const remanente = totalRealIngresosMes - totalRealEgresos;
        const tasaAhorro = totalRealIngresosMes > 0 ? (results['AhorroEInversion']?.totalReal || 0) / totalRealIngresosMes * 100 : 0;
        
        const egresosData = Object.keys(results).filter(k => k !== 'Ingresos' && results[k].totalReal > 0).map(k => ({
            name: categoryDisplayNames?.[k] || k.replace(/([A-Z])/g, ' $1').trim(),
            value: results[k].totalReal,
            color: CATEGORY_HEX_COLORS[k] || '#cccccc'
        }));

        const moneyFlowData = categoryOrder.filter(k => k !== 'Ingresos')
                                        .flatMap(k => results[k]?.rows || [])
                                        .filter(r => r.real > 0)
                                        .sort((a, b) => b.real - a.real)
                                        .slice(0, 8);

        // Recalcular el porcentaje del total de la categoría frente a los ingresos reales del mes
        categoryOrder.forEach(mainCatKey => {
            if (results[mainCatKey]) { // Asegurarse de que la categoría existe en results
                results[mainCatKey].percentageOfTotal = totalRealIngresosMes > 0 ? (results[mainCatKey].totalReal / totalRealIngresosMes) * 100 : 0;
            }
        });

        const visionGeneralData = categoryOrder.filter(catKey => Object.keys(categories || {}).includes(catKey)).map(key => ({
            name: categoryDisplayNames?.[key] || key.replace(/([A-Z])/g, ' $1').trim(), 
            Estimado: results[key]?.totalEstimado || 0, 
            Real: results[key]?.totalReal || 0 
        }));

        return { 
            visionGeneral: visionGeneralData,
            remanente, 
            tasaAhorro, 
            detailedTables: results, 
            egresosData, 
            moneyFlowData,
            totalBudgeted: totalBudgetedOverall,
            totalActual: totalRealIngresosMes - totalRealEgresos + remanente, 
            monthlyBalance: remanente,
            totalRealIngresosMes
        };
    }, [financeData, userConfig, currentYear, selectedMonthIndex, getMonthName]);


    const handleAddTransaction = async ({ amount, category, type, description }) => {
        setFormError('');
        setFormMessage('');

        const newTransaction = {
            id: uuidv4(),
            amount,
            type,
            category,
            description: description || '',
            date: new Date().toISOString().slice(0, 10),
            createdAt: new Date().toISOString(),
            createdBy: currentUser?.uid,
        };
    
        const monthName = getMonthName(selectedMonthIndex);
        
        const currentFinanceDataForUpdate = JSON.parse(JSON.stringify(financeData || {}));
        const yearDataToUpdate = currentFinanceDataForUpdate[currentYear] || { budget: {}, monthly: {} };
        
        if (!yearDataToUpdate.monthly) yearDataToUpdate.monthly = {};
        if (!yearDataToUpdate.monthly[monthName]) yearDataToUpdate.monthly[monthName] = {};
        if (!yearDataToUpdate.monthly[monthName][newTransaction.category]) {
            yearDataToUpdate.monthly[monthName][newTransaction.category] = { actual: [] };
        }
        
        yearDataToUpdate.monthly[monthName][newTransaction.category].actual.push(newTransaction);
        
        const success = await updateFinanceData({ [currentYear]: yearDataToUpdate });
        
        if (success) {
            setFormMessage('Transacción añadida exitosamente.');
        } else {
            setFormError("Fallo al añadir transacción.");
        }
    };

    const handleDeleteTransaction = async (transactionId) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar esta transacción?')) {
            return;
        }
        
        const monthName = getMonthName(selectedMonthIndex);
        
        const currentFinanceDataForUpdate = JSON.parse(JSON.stringify(financeData || {}));
        const yearDataToUpdate = currentFinanceDataForUpdate[currentYear] || { monthly: {} };
        const currentMonthDataToUpdate = yearDataToUpdate.monthly?.[monthName] || {};
    
        let foundAndDeleted = false;
        for (const subCatKey in currentMonthDataToUpdate) {
            if (currentMonthDataToUpdate[subCatKey]?.actual) {
                const initialLength = currentMonthDataToUpdate[subCatKey].actual.length;
                currentMonthDataToUpdate[subCatKey].actual = currentMonthDataToUpdate[subCatKey].actual.filter(t => t.id !== transactionId);
                if (currentMonthDataToUpdate[subCatKey].actual.length < initialLength) {
                    foundAndDeleted = true;
                }
            }
        }

        if (!foundAndDeleted) {
            setFormError("Transacción no encontrada para eliminar.");
            console.warn("Transaction not found for deletion in local state.");
            return;
        }
        
        const success = await updateFinanceData({ [currentYear]: yearDataToUpdate });
    
        if (success) {
            setFormMessage('Transacción eliminada exitosamente.');
        } else {
            setFormError("Fallo al eliminar transacción.");
        }
    };


    if (loadingData && !financeData) return (
        <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
            <LoadingSpinner /> {/* Se usa el nuevo LoadingSpinner aquí */}
        </div>
    );
    if (errorData) return <div className="text-center py-8 text-red-500">Error: {errorData}</div>;
    if (!userConfig || !financeData) return <div className="text-center py-8 text-gray-400">Iniciando datos...</div>;

    const categories = userConfig.categories || {}; 
    
    const categoriesForBudgetDisplay = categoryOrder.filter(catKey => 
        Object.keys(categories).includes(catKey)
    );

    return (
        <div className="p-2 sm:p-4 md:p-6 bg-gray-900 text-white min-h-screen font-sans">
             <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                 <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{getMonthNameSpanish(selectedMonthIndex)}</h1>
                 <div className="flex items-center gap-2 sm:gap-4">
                    <select 
                        value={currentYear} 
                        onChange={(e) => setCurrentYear(e.target.value)} 
                        className="bg-gray-700 text-white p-2 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {availableYears.map(year => (
                            <option key={year} value={year.toString()}>{year.toString()}</option> 
                        ))}
                    </select>
                    <select value={selectedMonthIndex} onChange={(e) => setSelectedMonthIndex(parseInt(e.target.value))} className="bg-gray-700 text-white p-2 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">{Array.from({length: 12}, (_, i) => <option key={i} value={i}>{getMonthNameSpanish(i)}</option>)}</select>
                     <div className="bg-purple-800/80 p-2 rounded-lg text-center shadow-lg">
                         <span className="block text-xs text-purple-200 font-bold">REMANENTE</span>
                         <span className="text-xl sm:text-2xl font-bold">{formatCurrency(monthlySummary.remanente)}</span>
                     </div>
                 </div>
             </header>

            <section className="bg-gray-800 border border-gray-700 p-3 sm:p-4 rounded-lg mb-6">
                <h2 className="text-base sm:text-lg font-semibold text-white mb-4">Registro Rápido</h2>
                <QuickTransactionForm userConfig={userConfig} onAddTransaction={handleAddTransaction} />
                {formError && <p className="text-red-500 text-sm mt-2">{formError}</p>}
                {formMessage && <p className="text-green-500 text-sm mt-2">{formMessage}</p>}
                {(!userConfig.categories || Object.keys(userConfig.categories).length === 0) && (
                    <p className="text-gray-400 text-center mt-4">
                        ¡Crea tus categorías en la página de Ajustes para empezar a registrar transacciones!
                    </p>
                )}
            </section>
            
            {/* Sección: Desglose Detallado */}
            <section className="mb-6 bg-gray-800 border border-gray-700 p-3 sm:p-4 rounded-lg">
                <h2 className="text-base sm:text-lg font-semibold text-white mb-4">Desglose Detallado</h2>
                
                {categoriesForBudgetDisplay.length === 0 && (
                    <p className="text-gray-400 text-center">
                        Añade categorías de ingresos y gastos en la página de Ajustes para ver el desglose.
                    </p>
                )}

                {/* Esta sección usa la estructura de tarjetas homogénea (para escritorio y móvil) */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {categoriesForBudgetDisplay.map(catKey => {
                        const tableData = monthlySummary.detailedTables[catKey];
                        const styles = categoryStyles[catKey];
                        if (!tableData || !styles) return null; 

                        return (
                            <div key={catKey} className="rounded-lg shadow-lg flex flex-col bg-gray-800 border border-gray-700 dark:bg-gray-800 dark:border-gray-700">
                                <div className="p-2 rounded-t-lg font-bold flex justify-between items-center text-white" style={{backgroundColor: styles.color}}>
                                    <span>{styles.title}</span>
                                </div>
                                <div className="p-3 flex-grow">
                                    <table className="w-full text-sm text-white">
                                        <thead>
                                            <tr className="border-b border-gray-600 dark:border-gray-600">
                                                <th className="text-left font-normal py-1">Subcategoría</th>
                                                <th className="text-right font-normal py-1">Estimado</th>
                                                <th className="text-right font-normal py-1">Real</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tableData.rows.length > 0 ? (
                                                tableData.rows.map(row => (
                                                    <tr key={row.name}>
                                                        <td className="py-2 pr-2">{row.name}</td>
                                                        <td className="py-2 pl-2 text-right text-gray-400">{formatCurrency(row.estimado)}</td>
                                                        <td className="py-2 pl-2 text-right font-bold">{formatCurrency(row.real)}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="3" className="py-2 text-center text-gray-400">
                                                        No hay transacciones ni presupuesto para esta categoría.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="p-2 border-t-2 border-gray-700 mt-auto dark:border-gray-600">
                                    <div className="flex justify-between items-center font-bold">
                                        <span>Total:</span>
                                        <span>{formatCurrency(tableData.totalReal)}</span>
                                    </div>
                                    {/* Mostrar porcentaje de la categoría (si no es Ingresos) */}
                                    {catKey !== 'Ingresos' && monthlySummary.totalRealIngresosMes > 0 && tableData.percentageOfTotal.toFixed(2) !== '0.00' && (
                                        <div className="text-center font-bold text-lg mt-2" style={{color: styles.color}}>{tableData.percentageOfTotal.toFixed(2)}%</div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section> 

            {/* SECCIÓN: Resumen del Mes (Presupuestado vs Real) */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8 dark:bg-gray-800 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-200 mb-4 dark:text-gray-200">Resumen de {getMonthNameSpanish(selectedMonthIndex)} {currentYear}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                    <div>
                        <span className="block text-gray-400 text-sm">Presupuestado:</span>
                        <span className="block font-bold text-lg text-blue-400">{formatCurrency(monthlySummary.totalBudgeted)}</span>
                    </div>
                    <div>
                        <span className="block text-gray-400 text-sm">Real:</span>
                        <span className="block font-bold text-lg text-green-400">{formatCurrency(monthlySummary.totalActual)}</span>
                    </div>
                    <div>
                        <span className="block text-gray-400 text-sm">Balance:</span>
                        <span className="block font-bold text-lg">
                            <span className={monthlySummary.monthlyBalance >= 0 ? 'text-green-400' : 'text-red-400'}>
                                {formatCurrency(monthlySummary.monthlyBalance)}
                            </span>
                        </span>
                    </div>
                </div>
            </div>

            {/* SECCIÓN: Gráficos de Egresos y Principales Gastos */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg h-[300px]"><h3 className="text-base font-semibold text-white mb-4 text-center">Distribución de Egresos</h3><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={monthlySummary.egresosData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={3}>{monthlySummary.egresosData.map((entry) => <Cell key={`cell-${entry.name}`} fill={entry.color} />)}</Pie><Tooltip formatter={(v) => formatCurrency(v)} contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem' }} /><Legend wrapperStyle={{fontSize: "11px"}}/></PieChart></ResponsiveContainer></div>
                <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg h-[300px]"><h3 className="text-base font-semibold text-white mb-4 text-center">Principales Gastos</h3><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={monthlySummary.moneyFlowData} dataKey="real" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={3}>{monthlySummary.moneyFlowData.map((entry, index) => <Cell key={`cell-${entry.name}`} fill={`hsl(${index * 45}, 60%, 55%)`} />)}</Pie><Tooltip formatter={(v) => formatCurrency(v)} contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem' }} /><Legend wrapperStyle={{fontSize: "11px"}}/></PieChart></ResponsiveContainer></div>
            </section>

            {/* SECCIÓN: Visión General (Gráficos y tabla resumen) */}
            <section className="bg-gray-800 border border-gray-700 p-3 sm:p-4 rounded-lg mb-6">
                    <h2 className="text-base sm:text-lg font-semibold text-white mb-4">Visión General</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead><tr className="border-b border-gray-600"><th className="text-left py-1.5 px-2 font-semibold">Categoría</th><th className="text-right py-1.5 px-2 font-semibold">Estimado</th><th className="text-right py-1.5 px-2 font-semibold">Real</th></tr></thead>
                                <tbody>
                                    {monthlySummary.visionGeneral.length > 0 ? (
                                        monthlySummary.visionGeneral.map(item => (
                                            <tr key={item.name} className="border-b border-gray-700">
                                                <td className="py-2 px-2">{item.name}</td>
                                                <td className="text-right px-2 text-gray-400">{formatCurrency(item.Estimado)}</td>
                                                <td className="text-right px-2 font-medium text-white">{formatCurrency(item.Real)}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="py-2 text-center text-gray-400">No hay datos para la visión general.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            <div className="mt-4 text-center bg-gray-700/50 p-2 rounded-lg"><span className="font-semibold text-white">{monthlySummary.tasaAhorro.toFixed(2)}%</span><span className="ml-2 text-xs text-gray-400">Tasa de Ahorro</span></div>
                        </div>
                        <div className="h-[250px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={monthlySummary.visionGeneral.filter(i => i.name !== 'Ingresos')} layout="vertical" margin={{ top: 5, right: 10, left: 80, bottom: 5 }}><CartesianGrid strokeDasharray="2 2" stroke="rgba(255, 255, 255, 0.1)" /><XAxis type="number" hide /><YAxis type="category" dataKey="name" width={80} stroke="#9ca3af" fontSize={10} axisLine={false} tickLine={false} interval={0}/><Tooltip formatter={(v) => formatCurrency(v)} cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem' }} /><Legend wrapperStyle={{fontSize: "11px", paddingTop: '10px'}}/><Bar dataKey="Estimado" fill="#5a67d8" barSize={10} radius={[0, 4, 4, 0]} /><Bar dataKey="Real" fill="#38a169" barSize={10} radius={[0, 4, 4, 0]} /></BarChart></ResponsiveContainer></div>
                    </div>
            </section>
        </div>
    );
}

export default MonthlyTrackerPage;