import React, { useState, useEffect, useMemo, useRef } from 'react';
import useFinanceData from '../hooks/useFinanceData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

// --- Constantes y Helpers movidos fuera para mayor claridad ---
const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const getMonthNameSpanish = (monthIndex) => ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'][monthIndex];
const formatCurrency = (value) => {
    if (typeof value !== 'number' || isNaN(value)) return '€0,00';
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);
};

// --- Paleta de colores para los encabezados de grupo ---
const GROUP_COLORS = ['#2563eb', '#059669', '#d97706', '#db2777', '#6d28d9', '#0891b2', '#c026d3', '#be185d'];

function NetWorthPage() {
    // --- CAMBIO CLAVE: Usar las variables correctas del hook ---
    const {
        allFinanceData: financeData,
        userConfig,
        loading,
        error,
        currentYear,
        setCurrentYear,
        updateFinanceData,
        getMonthName
    } = useFinanceData();

    const [selectedDisplayMonthIndex, setSelectedDisplayMonthIndex] = useState(new Date().getMonth());
    const [editingCell, setEditingCell] = useState(null); 
    const [editingValue, setEditingValue] = useState('');
    const inputRef = useRef(null); 

    useEffect(() => {
        if (editingCell && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editingCell]);

    // --- LÓGICA DE DATOS Y NAVEGACIÓN ---

    const groupColorMap = useMemo(() => {
        if (!userConfig) return {};
        const map = {};
        const aGroups = userConfig.ActivosGroupOrder || [];
        const pGroups = userConfig.PasivosGroupOrder || [];
        [...aGroups, ...pGroups].forEach((groupName, index) => {
            map[groupName] = GROUP_COLORS[index % GROUP_COLORS.length];
        });
        return map;
    }, [userConfig]);

    const flatSubcategories = useMemo(() => {
        if (!userConfig?.categories) return [];
        const list = [];
        (userConfig.ActivosGroupOrder || []).forEach(group => {
            (userConfig.categories.Activos?.[group] || []).forEach(subCat => {
                list.push({ type: 'Activos', subCat });
            });
        });
        (userConfig.PasivosGroupOrder || []).forEach(group => {
            (userConfig.categories.Pasivos?.[group] || []).forEach(subCat => {
                list.push({ type: 'Pasivos', subCat });
            });
        });
        return list;
    }, [userConfig]);


    // --- LÓGICA DE EDICIÓN EN LÍNEA ---

    const handleCellClick = (monthIndex, type, subCategory, currentValue) => {
        setEditingCell({ monthIndex, type, subCategory });
        setEditingValue(currentValue ? currentValue.toString() : '');
    };

    const handleInputBlur = async () => {
        if (!editingCell) return;
        const { monthIndex, type, subCategory } = editingCell;
        
        const numericValue = editingValue === '' ? 0 : parseFloat(editingValue);

        if (isNaN(numericValue)) {
            setEditingCell(null);
            return;
        }

        const monthName = getMonthName(monthIndex);
        
        const updatedFinanceData = JSON.parse(JSON.stringify(financeData));
        const yearData = updatedFinanceData[currentYear] || { netWorth: {} };
        if (!yearData.netWorth) yearData.netWorth = {};
        if (!yearData.netWorth[type]) yearData.netWorth[type] = {};
        if (!yearData.netWorth[type][subCategory]) yearData.netWorth[type][subCategory] = {};
        
        if (yearData.netWorth[type][subCategory][monthName] !== numericValue) {
            yearData.netWorth[type][subCategory][monthName] = numericValue;
            await updateFinanceData({ [currentYear]: yearData });
        }
        setEditingCell(null); 
    };
    
    const handleInputKeyDown = async (e) => {
        if (e.key !== 'Enter' && e.key !== 'Tab' && e.key !== 'Escape') return;
        e.preventDefault();

        if (e.key === 'Escape') {
            setEditingCell(null);
            return;
        }

        const currentEditingCell = { ...editingCell };
        await handleInputBlur(); 

        const { monthIndex, subCategory } = currentEditingCell;
        let currentFlatIndex = flatSubcategories.findIndex(item => item.subCat === subCategory);
        let nextMonthIndex = monthIndex;
        let nextFlatIndex = currentFlatIndex;

        if (e.key === 'Enter') {
            nextFlatIndex++;
        } else if (e.key === 'Tab') {
            nextMonthIndex++;
            if (nextMonthIndex >= MONTHS.length) {
                nextMonthIndex = 0;
                nextFlatIndex++;
            }
        }
        
        if (nextFlatIndex >= 0 && nextFlatIndex < flatSubcategories.length) {
            const nextCellData = flatSubcategories[nextFlatIndex];
            const nextValue = financeData?.[currentYear]?.netWorth?.[nextCellData.type]?.[nextCellData.subCat]?.[MONTHS[nextMonthIndex]] || 0;
            handleCellClick(nextMonthIndex, nextCellData.type, nextCellData.subCat, nextValue);
        }
    };


    const processedData = useMemo(() => {
        const categories = userConfig?.categories;
        const annualData = financeData?.[currentYear] || {};
        const netWorthData = annualData.netWorth || {};

        if (!categories) {
            return { monthlyTotals: Array(12).fill({}), chartData: [], assetBarData: [], liabilityBarData: [] };
        }

        const monthlyTotals = MONTHS.map((monthName, index) => {
            let totalAssets = 0, totalLiabilities = 0;
            if (categories.Activos) Object.values(categories.Activos).flat().forEach(subCat => { totalAssets += netWorthData.Activos?.[subCat]?.[monthName] || 0; });
            if (categories.Pasivos) Object.values(categories.Pasivos).flat().forEach(subCat => { totalLiabilities += netWorthData.Pasivos?.[subCat]?.[monthName] || 0; });
            return { totalAssets, totalLiabilities, netWorth: totalAssets - totalLiabilities };
        });

        const chartData = monthlyTotals.map((data, index) => ({
            name: getMonthNameSpanish(index).slice(0, 3), Activos: data.totalAssets, Pasivos: data.totalLiabilities, 'Patrimonio Neto': data.netWorth,
        }));
        
        const selectedMonthName = getMonthName(selectedDisplayMonthIndex);
        const assetBarData = categories.Activos ? Object.values(categories.Activos).flat().map(subCat => ({ name: subCat, value: netWorthData.Activos?.[subCat]?.[selectedMonthName] || 0 })).filter(item => item.value > 0) : [];
        const liabilityBarData = categories.Pasivos ? Object.values(categories.Pasivos).flat().map(subCat => ({ name: subCat, value: netWorthData.Pasivos?.[subCat]?.[selectedMonthName] || 0 })).filter(item => item.value > 0) : [];
        
        return { monthlyTotals, chartData, assetBarData, liabilityBarData };
    }, [financeData, userConfig, currentYear, selectedDisplayMonthIndex, getMonthName]);

    // --- RENDERIZADO ---
    // --- CAMBIO CLAVE: Usar las variables correctas y quitar el bloqueo ---
    if (loading) return <div className="text-center py-8 text-white">Cargando datos...</div>;
    if (error) return <div className="text-center py-8 text-red-500">Error al cargar datos: {error}</div>;

    const { monthlyTotals, chartData, assetBarData, liabilityBarData } = processedData;
    const currentDisplayMonthData = monthlyTotals[selectedDisplayMonthIndex];
    const prevDisplayMonthData = selectedDisplayMonthIndex > 0 ? monthlyTotals[selectedDisplayMonthIndex - 1] : { totalAssets: 0, totalLiabilities: 0, netWorth: 0 };
    const currentMonthAssetsChange = currentDisplayMonthData.totalAssets - prevDisplayMonthData.totalAssets;
    const currentMonthLiabilitiesChange = currentDisplayMonthData.totalLiabilities - prevDisplayMonthData.totalLiabilities;
    const currentMonthNetWorthChange = currentDisplayMonthData.netWorth - prevDisplayMonthData.netWorth;

    const renderGroupTable = (groupName, groupSubCategories, type) => {
        return (
            <div key={groupName} className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-2 p-2 rounded-t-lg" style={{ backgroundColor: groupColorMap[groupName] || '#374151' }}>{groupName}</h4>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-gray-600 rounded-b-lg overflow-hidden text-white text-sm">
                        <thead><tr className="bg-gray-500/50"><th className="py-2 px-4 text-left">Categoría</th>{MONTHS.map(m => <th key={m} className="py-2 px-4 text-right">{m.slice(0,3)}</th>)}</tr></thead>
                        <tbody>
                            {groupSubCategories.map(subCat => {
                                const isEditingRow = editingCell?.type === type && editingCell?.subCategory === subCat;
                                return (
                                    <tr key={subCat} className={`border-b border-gray-500/50 ${isEditingRow ? 'bg-blue-900/40' : 'hover:bg-gray-500/30'}`}>
                                        <td className="py-2 px-4 text-left font-medium">{subCat}</td>
                                        {MONTHS.map((month, monthIndex) => {
                                            const cellValue = financeData?.[currentYear]?.netWorth?.[type]?.[subCat]?.[month] || 0;
                                            const isEditingCell = isEditingRow && editingCell?.monthIndex === monthIndex;
                                            return (
                                                <td key={month} className="py-0 px-0 text-right relative" onClick={() => !isEditingCell && handleCellClick(monthIndex, type, subCat, cellValue)}>
                                                    {isEditingCell ? 
                                                        <input 
                                                            ref={inputRef} 
                                                            type="number" 
                                                            inputMode="decimal"
                                                            value={editingValue} 
                                                            onChange={e => setEditingValue(e.target.value)} 
                                                            onBlur={handleInputBlur} 
                                                            onKeyDown={handleInputKeyDown}
                                                            onFocus={e => e.target.select()}
                                                            className="w-full h-full bg-gray-900 text-white text-right outline-none ring-2 ring-blue-500 p-2" /> 
                                                        : <span className="block p-2">{formatCurrency(cellValue)}</span>
                                                    }
                                                </td>
                                            );
                                        })}
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <div className="p-4 sm:p-6 bg-gray-800 rounded-lg shadow-lg flex flex-col flex-grow">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-white">Patrimonio Neto - {currentYear}</h2>
                <div className="flex gap-4">
                    <select value={currentYear} onChange={(e) => setCurrentYear(e.target.value)} className="bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"><option value="2024">2024</option><option value="2025">2025</option></select>
                    <select value={selectedDisplayMonthIndex} onChange={(e) => setSelectedDisplayMonthIndex(parseInt(e.target.value))} className="bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">{MONTHS.map((m, i) => <option key={m} value={i}>{getMonthNameSpanish(i)}</option>)}</select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-700 p-4 rounded-lg"><h3 className="text-gray-300">Activos</h3><p className="text-2xl font-bold text-green-400">{formatCurrency(currentDisplayMonthData.totalAssets)}</p><p className={`text-sm ${currentMonthAssetsChange >= 0 ? 'text-green-300' : 'text-red-300'}`}>{currentMonthAssetsChange >= 0 ? '▲' : '▼'} {formatCurrency(Math.abs(currentMonthAssetsChange))}</p></div>
                <div className="bg-gray-700 p-4 rounded-lg"><h3 className="text-gray-300">Pasivos</h3><p className="text-2xl font-bold text-red-400">{formatCurrency(currentDisplayMonthData.totalLiabilities)}</p><p className={`text-sm ${currentMonthLiabilitiesChange <= 0 ? 'text-green-300' : 'text-red-300'}`}>{currentMonthLiabilitiesChange <= 0 ? '▼' : '▲'} {formatCurrency(Math.abs(currentMonthLiabilitiesChange))}</p></div>
                <div className="bg-gray-700 p-4 rounded-lg"><h3 className="text-gray-300">Patrimonio Neto</h3><p className="text-2xl font-bold text-blue-400">{formatCurrency(currentDisplayMonthData.netWorth)}</p><p className={`text-sm ${currentMonthNetWorthChange >= 0 ? 'text-green-300' : 'text-red-300'}`}>{currentMonthNetWorthChange >= 0 ? '▲' : '▼'} {formatCurrency(Math.abs(currentMonthNetWorthChange))}</p></div>
            </div>

            <div className="bg-gray-700 p-6 rounded-lg shadow-md mb-8">
                <h3 className="text-xl font-bold text-white mb-4">Evolución Anual</h3>
                <ResponsiveContainer width="100%" height={350}><LineChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="#4a5568" /><XAxis dataKey="name" stroke="#cbd5e0" /><YAxis tickFormatter={formatCurrency} stroke="#cbd5e0" /><Tooltip formatter={(v) => formatCurrency(v)} contentStyle={{ backgroundColor: '#2d3748', border: 'none' }} itemStyle={{ color: '#ffffff' }} /><Legend /><Line type="monotone" dataKey="Activos" stroke="#82ca9d" /><Line type="monotone" dataKey="Pasivos" stroke="#ef4444" /><Line type="monotone" dataKey="Patrimonio Neto" stroke="#8884d8" /></LineChart></ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-gray-700 p-6 rounded-lg"><h3 className="text-xl font-bold text-white mb-4">Desglose Activos ({getMonthNameSpanish(selectedDisplayMonthIndex)})</h3>{assetBarData.length > 0 ? <ResponsiveContainer width="100%" height={300}><BarChart data={assetBarData} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="#4a5568" /><XAxis type="number" tickFormatter={formatCurrency} stroke="#cbd5e0" /><YAxis type="category" dataKey="name" width={100} stroke="#cbd5e0" /><Tooltip formatter={(v) => formatCurrency(v)} contentStyle={{ backgroundColor: '#2d3748', border: 'none' }} /><Bar dataKey="value" fill="#82ca9d" /></BarChart></ResponsiveContainer> : <p className="text-gray-400 text-center mt-10">Sin datos de activos para este mes.</p>}</div>
                <div className="bg-gray-700 p-6 rounded-lg"><h3 className="text-xl font-bold text-white mb-4">Desglose Pasivos ({getMonthNameSpanish(selectedDisplayMonthIndex)})</h3>{liabilityBarData.length > 0 ? <ResponsiveContainer width="100%" height={300}><BarChart data={liabilityBarData} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="#4a5568" /><XAxis type="number" tickFormatter={formatCurrency} stroke="#cbd5e0" /><YAxis type="category" dataKey="name" width={100} stroke="#cbd5e0" /><Tooltip formatter={(v) => formatCurrency(v)} contentStyle={{ backgroundColor: '#2d3748', border: 'none' }} /><Bar dataKey="value" fill="#ef4444" /></BarChart></ResponsiveContainer> : <p className="text-gray-400 text-center mt-10">Sin datos de pasivos para este mes.</p>}</div>
            </div>

            <div className="space-y-8">
                {userConfig?.ActivosGroupOrder && <div><h3 className="text-2xl font-bold text-white mb-4">Activos</h3>{userConfig.ActivosGroupOrder.map(groupName => renderGroupTable(groupName, userConfig.categories.Activos[groupName], 'Activos'))}</div>}
                {userConfig?.PasivosGroupOrder && <div><h3 className="text-2xl font-bold text-white mb-4">Pasivos</h3>{userConfig.PasivosGroupOrder.map(groupName => renderGroupTable(groupName, userConfig.categories.Pasivos[groupName], 'Pasivos'))}</div>}
            </div>
        </div>
    );
}

export default NetWorthPage;
