import React, { useState, useEffect, useMemo } from 'react';
import useFinanceData from '../hooks/useFinanceData';
import { v4 as uuidv4 } from 'uuid';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const CATEGORY_HEX_COLORS = { 'Ingresos': '#4b5563', 'GastosEsenciales': '#ca8a04', 'GastosDiscrecionales': '#f97316', 'PagoDeDeudas': '#b91c1c', 'AhorroEInversion': '#059669' };

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
            }
        });
        return map;
    }, [userConfig]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!amount || !selectedSubcat) {
            alert("Por favor, introduce un monto y selecciona una categoría.");
            return;
        }
        const mainCategory = subcatToMainCatMap[selectedSubcat];
        onAddTransaction({
            amount: parseFloat(amount),
            subCategory: selectedSubcat,
            mainCategory: type === 'gasto' ? mainCategory : 'Ingresos',
        });
        setAmount('');
        setSelectedSubcat('');
    };

    const categoriesForDropdown = useMemo(() => {
        if (!userConfig?.categories) return [];
        const expenseCategories = Object.entries(userConfig.categories)
            .filter(([mainCat]) => mainCat !== 'Ingresos' && Array.isArray(userConfig.categories[mainCat]))
            .map(([mainCat, subCats]) => ({
                label: userConfig.categoryDisplayNames[mainCat] || mainCat.replace(/([A-Z])/g, ' $1').trim(),
                options: subCats
            }));

        return type === 'ingreso' ? [{ label: 'Ingresos', options: userConfig.categories.Ingresos || [] }] : expenseCategories;
    }, [userConfig, type]);

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
                    <option value="" disabled>Seleccionar...</option>
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

function MonthlyTrackerPage() {
    const { 
        allFinanceData: financeData, userConfig, loading, error,
        currentYear, setCurrentYear, getMonthName, updateFinanceData 
    } = useFinanceData();
    
    const [selectedMonthIndex, setSelectedMonthIndex] = useState(new Date().getMonth());

    const formatCurrency = (value) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(typeof value === 'number' ? value : 0);
    const getMonthNameSpanish = (monthIndex) => ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'][monthIndex];

    const handleAddTransaction = async ({ amount, subCategory }) => {
        const newTransaction = { id: uuidv4(), amount, date: new Date().toISOString().slice(0, 10) };
        const monthName = getMonthName(selectedMonthIndex);
        const updatedFinanceData = JSON.parse(JSON.stringify(financeData));
        const yearData = updatedFinanceData[currentYear] || { budget: {}, monthly: {} };
        if (!yearData.monthly) yearData.monthly = {};
        if (!yearData.monthly[monthName]) yearData.monthly[monthName] = {};
        if (!yearData.monthly[monthName][subCategory]) yearData.monthly[monthName][subCategory] = { actual: [] };
        yearData.monthly[monthName][subCategory].actual.push(newTransaction);
        await updateFinanceData({ [currentYear]: yearData });
    };

    const memoizedData = useMemo(() => {
        if (!userConfig?.categories || !financeData?.[currentYear]) {
            return { visionGeneral: [], remanente: 0, tasaAhorro: 0, detailedTables: {}, egresosData: [], moneyFlowData: [] };
        }
        const { categories, categoryDisplayNames } = userConfig;
        const { budget = {}, monthly = {} } = financeData[currentYear];
        const monthName = getMonthName(selectedMonthIndex);
        const monthTransactions = monthly?.[monthName] || {};
        const results = {};
        const categoryOrderForCalc = ['Ingresos', 'GastosEsenciales', 'GastosDiscrecionales', 'PagoDeDeudas', 'AhorroEInversion'];

        categoryOrderForCalc.forEach(mainCatKey => {
            if (!Array.isArray(categories[mainCatKey])) return; 
            const rows = categories[mainCatKey].map(subCat => {
                const real = (monthTransactions[subCat]?.actual || []).reduce((sum, t) => sum + t.amount, 0);
                const estimado = budget[subCat] || 0;
                return { name: subCat, real, estimado };
            });
            const totalReal = rows.reduce((sum, r) => sum + r.real, 0);
            const totalEstimado = rows.reduce((sum, r) => sum + r.estimado, 0);
            results[mainCatKey] = { rows, totalReal, totalEstimado };
        });
        
        const visionGeneral = Object.keys(results).map(key => ({ name: categoryDisplayNames?.[key] || key.replace(/([A-Z])/g, ' $1').trim(), Estimado: results[key].totalEstimado, Real: results[key].totalReal }));
        const totalRealIngresos = results['Ingresos']?.totalReal || 0;
        const totalRealEgresos = Object.keys(results).filter(k => k !== 'Ingresos').reduce((sum, k) => sum + results[k].totalReal, 0);
        const remanente = totalRealIngresos - totalRealEgresos;
        const tasaAhorro = totalRealIngresos > 0 ? (results['AhorroEInversion']?.totalReal || 0) / totalRealIngresos * 100 : 0;
        const egresosData = Object.keys(results).filter(k => k !== 'Ingresos' && results[k].totalReal > 0).map(k => ({ name: categoryDisplayNames?.[k] || k, value: results[k].totalReal, color: CATEGORY_HEX_COLORS[k] }));
        const moneyFlowData = Object.keys(results).filter(k => k !== 'Ingresos').flatMap(k => results[k].rows).filter(r => r.real > 0).sort((a, b) => b.real - a.real).slice(0, 8);

        return { visionGeneral, remanente, tasaAhorro, detailedTables: results, egresosData, moneyFlowData };
    }, [financeData, userConfig, currentYear, selectedMonthIndex, getMonthName]);

    if (loading && !financeData) return <div className="flex justify-center items-center h-screen bg-gray-900 text-white">Cargando...</div>;
    if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;
    if (!userConfig || !financeData) return <div className="text-center py-8 text-gray-400">Iniciando datos...</div>;

    const categoryOrder = ['Ingresos', 'GastosEsenciales', 'GastosDiscrecionales', 'PagoDeDeudas', 'AhorroEInversion'];
    
    return (
        <div className="p-2 sm:p-4 md:p-6 bg-gray-900 text-white min-h-screen font-sans">
             <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                 <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{getMonthNameSpanish(selectedMonthIndex)}</h1>
                 <div className="flex items-center gap-2 sm:gap-4">
                     <select value={currentYear} onChange={(e) => setCurrentYear(e.target.value)} className="bg-gray-700 text-white p-2 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">{Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => <option key={year} value={year}>{year}</option>)}</select>
                     <select value={selectedMonthIndex} onChange={(e) => setSelectedMonthIndex(parseInt(e.target.value))} className="bg-gray-700 text-white p-2 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">{Array.from({length: 12}, (_, i) => <option key={i} value={i}>{getMonthNameSpanish(i)}</option>)}</select>
                      <div className="bg-purple-800/80 p-2 rounded-lg text-center shadow-lg">
                          <span className="block text-xs text-purple-200 font-bold">REMANENTE</span>
                          <span className="text-xl sm:text-2xl font-bold">{formatCurrency(memoizedData.remanente)}</span>
                      </div>
                 </div>
             </header>

            <section className="bg-gray-800 border border-gray-700 p-3 sm:p-4 rounded-lg mb-6">
                <h2 className="text-base sm:text-lg font-semibold text-white mb-4">Registro Rápido</h2>
                <QuickTransactionForm userConfig={userConfig} onAddTransaction={handleAddTransaction} />
            </section>
            
            <section className="bg-gray-800 border border-gray-700 p-3 sm:p-4 rounded-lg mb-6">
                 <h2 className="text-base sm:text-lg font-semibold text-white mb-4">Visión General</h2>
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                     <div className="overflow-x-auto">
                         <table className="w-full text-sm">
                             <thead><tr className="border-b border-gray-600"><th className="text-left py-1.5 px-2 font-semibold">Categoría</th><th className="text-right py-1.5 px-2 font-semibold">Estimado</th><th className="text-right py-1.5 px-2 font-semibold">Real</th></tr></thead>
                             <tbody>{memoizedData.visionGeneral.map(item => (<tr key={item.name} className="border-b border-gray-700"><td className="py-2 px-2">{item.name}</td><td className="text-right px-2 text-gray-400">{formatCurrency(item.Estimado)}</td><td className="text-right px-2 font-medium text-white">{formatCurrency(item.Real)}</td></tr>))}</tbody>
                         </table>
                         <div className="mt-4 text-center bg-gray-700/50 p-2 rounded-lg"><span className="font-semibold text-white">{memoizedData.tasaAhorro.toFixed(2)}%</span><span className="ml-2 text-xs text-gray-400">Tasa de Ahorro</span></div>
                     </div>
                     <div className="h-[250px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={memoizedData.visionGeneral.filter(i => i.name !== 'Ingresos')} layout="vertical" margin={{ top: 5, right: 10, left: 80, bottom: 5 }}><CartesianGrid strokeDasharray="2 2" stroke="rgba(255, 255, 255, 0.1)" /><XAxis type="number" hide /><YAxis type="category" dataKey="name" width={80} stroke="#9ca3af" fontSize={10} axisLine={false} tickLine={false} interval={0}/><Tooltip formatter={(v) => formatCurrency(v)} cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem' }} /><Legend wrapperStyle={{fontSize: "11px", paddingTop: '10px'}}/><Bar dataKey="Estimado" fill="#5a67d8" barSize={10} radius={[0, 4, 4, 0]} /><Bar dataKey="Real" fill="#38a169" barSize={10} radius={[0, 4, 4, 0]} /></BarChart></ResponsiveContainer></div>
                 </div>
            </section>
             
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg h-[300px]"><h3 className="text-base font-semibold text-white mb-4 text-center">Distribución de Egresos</h3><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={memoizedData.egresosData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={3}>{memoizedData.egresosData.map((entry) => <Cell key={`cell-${entry.name}`} fill={entry.color} />)}</Pie><Tooltip formatter={(v) => formatCurrency(v)} contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem' }} /><Legend wrapperStyle={{fontSize: "11px"}}/></PieChart></ResponsiveContainer></div>
                <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg h-[300px]"><h3 className="text-base font-semibold text-white mb-4 text-center">Principales Gastos</h3><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={memoizedData.moneyFlowData} dataKey="real" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={3}>{memoizedData.moneyFlowData.map((entry, index) => <Cell key={`cell-${entry.name}`} fill={`hsl(${index * 45}, 60%, 55%)`} />)}</Pie><Tooltip formatter={(v) => formatCurrency(v)} contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem' }} /><Legend wrapperStyle={{fontSize: "11px"}}/></PieChart></ResponsiveContainer></div>
            </section>

            <section>
                <h2 className="text-base sm:text-lg font-semibold text-white mb-4">Desglose Detallado</h2>
                
                {/* --- VISTA PARA ESCRITORIO (TABLAS EN GRID) --- */}
                <div className="hidden md:grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {categoryOrder.map(catKey => {
                        const tableData = memoizedData.detailedTables[catKey];
                        if (!tableData) return null;
                        const displayInfo = { name: userConfig.categoryDisplayNames[catKey] || catKey.replace(/([A-Z])/g, ' $1').trim(), color: CATEGORY_HEX_COLORS[catKey] || '#4b5563' };
                        return (
                            <div key={catKey} className="rounded-lg shadow-md flex flex-col bg-gray-800 border border-gray-700">
                                <div className="p-3 rounded-t-lg font-semibold flex justify-between items-center text-white" style={{borderBottom: `2px solid ${displayInfo.color}`}}>
                                    <span>{displayInfo.name}</span>
                                    <span>{formatCurrency(tableData.totalReal)}</span>
                                </div>
                                <div className="p-3 flex-grow overflow-x-auto">
                                    <table className="w-full text-xs sm:text-sm text-gray-300">
                                        <thead><tr className="border-b border-gray-700"><th className="text-left font-semibold py-1">Subcategoría</th><th className="text-right font-semibold py-1">Estimado</th><th className="text-right font-semibold py-1">Real</th></tr></thead>
                                        <tbody>
                                            {tableData.rows.map(row => (
                                                <tr key={row.name} className="border-b border-gray-700/50"><td className="py-1.5">{row.name}</td><td className="text-right text-gray-400">{formatCurrency(row.estimado)}</td><td className="text-right font-medium text-white">{formatCurrency(row.real)}</td></tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="p-3 text-center font-bold text-sm bg-gray-800/50 rounded-b-lg mt-auto">Total: {formatCurrency(tableData.totalReal)}</div>
                            </div>
                        );
                    })}
                </div>

                {/* --- VISTA PARA MÓVIL (LISTA ÚNICA) --- */}
                <div className="block md:hidden space-y-4">
                    {categoryOrder.map(catKey => {
                        const tableData = memoizedData.detailedTables[catKey];
                        if (!tableData || tableData.rows.length === 0) return null;
                        const displayInfo = { name: userConfig.categoryDisplayNames[catKey] || catKey.replace(/([A-Z])/g, ' $1').trim(), color: CATEGORY_HEX_COLORS[catKey] || '#4b5563' };
                        return (
                            <div key={catKey}>
                                <h3 className="font-bold text-lg mb-2" style={{color: displayInfo.color}}>{displayInfo.name}</h3>
                                <div className="space-y-2">
                                    {tableData.rows.map(row => (
                                        <div key={row.name} className="bg-gray-800 border border-gray-700 p-3 rounded-lg">
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium text-white">{row.name}</span>
                                                <span className="font-bold text-white text-lg">{formatCurrency(row.real)}</span>
                                            </div>
                                            <div className="text-right text-xs text-gray-400 mt-1">
                                                Presupuesto: {formatCurrency(row.estimado)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>

            </section>
        </div>
    );
}

export default MonthlyTrackerPage;
