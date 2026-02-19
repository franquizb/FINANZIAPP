import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";

// ÍCONOS SVG
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const ListIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" x2="21" y1="6" y2="6"></line><line x1="8" x2="21" y1="12" y2="12"></line><line x1="8" x2="21" y1="18" y2="18"></line><line x1="3" x2="3.01" y1="6" y2="6"></line><line x1="3" x2="3.01" y1="12" y2="12"></line><line x1="3" x2="3.01" y1="18" y2="18"></line></svg>;
const PieChartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const PlusCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="8" y2="16"></line><line x1="8" x2="16" y1="12" y2="12"></line></svg>;
const LogOutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" x2="9" y1="12" y2="12"></line></svg>;
const GoogleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#4285F4" d="M21.35 11.1h-9.2v2.8h5.4c-.2 1.5-1.5 2.5-3.2 2.5-2.2 0-4-1.8-4-4s1.8-4 4-4c1.1 0 2.1.5 2.8 1.2l2.2-2.2C17.2 4.6 15.2 4 13 4c-4.4 0-8 3.6-8 8s3.6 8 8 8c4.6 0 7.7-3.2 7.7-7.7 0-.6-.1-1.2-.2-1.8z"/></svg>;


// CONFIGURACIÓN INICIAL DE LA APP
const initialConfig = {
    currency: '€',
    categories: {
        income: {'Sueldo': ['Salario'],'Ingresos Pasivos': ['Dividendos', 'Alquileres'],'Ingresos Extra': ['Ventas', 'Freelance']},
        expense: {'Vivienda': ['Alquiler/Hipoteca', 'Comunidad', 'Luz', 'Agua', 'Gas', 'Internet'],'Transporte': ['Gasolina', 'Transporte Público', 'Mantenimiento Coche'],'Alimentación': ['Supermercado', 'Restaurantes'],'Ocio': ['Cine', 'Viajes', 'Gimnasio'],'Salud': ['Farmacia', 'Seguro Médico'],'Impuestos': ['IRPF', 'IBI']}
    },
    netWorth: {
        assets: {'Efectivo': ['Cuenta Corriente', 'Efectivo en casa'],'Inversiones': ['Acciones', 'Fondos de Inversión', 'Criptomonedas'],'Propiedades': ['Vivienda Principal']},
        liabilities: {'Deudas a Corto Plazo': ['Tarjeta de Crédito'],'Deudas a Largo Plazo': ['Hipoteca', 'Préstamo Coche']}
    }
};

const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

const Card = ({ children, className = '' }) => (<div className={`bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 ${className}`}>{children}</div>);

const TransactionModal = ({ isOpen, onClose, onAdd, categories, type }) => {
    const [category, setCategory] = useState('');
    const [subcategory, setSubcategory] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (categories && Object.keys(categories).length > 0) setCategory(Object.keys(categories)[0]);
    }, [categories]);
    
    useEffect(() => {
        if (category && categories[category] && categories[category].length > 0) setSubcategory(categories[category][0]);
        else setSubcategory('');
    }, [category, categories]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (category && subcategory && amount) {
            onAdd({id: Date.now().toString(), category, subcategory, description, real: parseFloat(amount), budget: 0 });
            onClose(); setAmount(''); setDescription('');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Añadir {type === 'income' ? 'Ingreso' : 'Gasto'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-300 mb-2">Categoría</label>
                        <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-3 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                           {categories && Object.keys(categories).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-300 mb-2">Sub-Categoría</label>
                        <select value={subcategory} onChange={e => setSubcategory(e.target.value)} className="w-full p-3 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            {category && categories[category] && categories[category].map(sub => <option key={sub} value={sub}>{sub}</option>)}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-300 mb-2">Descripción (Opcional)</label>
                        <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="w-full p-3 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 dark:text-gray-300 mb-2">Monto Real</label>
                        <input type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-3 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="0.00" required />
                    </div>
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600">Cancelar</button>
                        <button type="submit" className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Añadir</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const MonthlyTracker = ({ yearData, onYearDataChange, selectedMonth, currency, config }) => {
    const [isIncomeModalOpen, setIncomeModalOpen] = useState(false);
    const [isExpenseModalOpen, setExpenseModalOpen] = useState(false);
    
    const monthData = useMemo(() => yearData.transactions[selectedMonth] || { income: [], expense: [] }, [yearData.transactions, selectedMonth]);

    const handleTransaction = (type, transaction, indexToUpdate = -1) => {
        const updatedTransactions = JSON.parse(JSON.stringify(yearData.transactions));
        if (!updatedTransactions[selectedMonth]) updatedTransactions[selectedMonth] = { income: [], expense: [] };
        if (indexToUpdate > -1) updatedTransactions[selectedMonth][type][indexToUpdate] = transaction;
        else updatedTransactions[selectedMonth][type].push(transaction);
        onYearDataChange({ ...yearData, transactions: updatedTransactions });
    };
    
    const handleUpdateBudget = (type, index, value) => {
        const itemToUpdate = { ...monthData[type][index] };
        itemToUpdate.budget = parseFloat(value) || 0;
        handleTransaction(type, itemToUpdate, index);
    };

    const handleDeleteTransaction = (type, index) => {
        const updatedTransactions = JSON.parse(JSON.stringify(yearData.transactions));
        updatedTransactions[selectedMonth][type].splice(index, 1);
        onYearDataChange({ ...yearData, transactions: updatedTransactions });
    };

    const totals = useMemo(() => {
        const incomeBudget = monthData.income.reduce((sum, item) => sum + (item.budget || 0), 0);
        const incomeReal = monthData.income.reduce((sum, item) => sum + item.real, 0);
        const expenseBudget = monthData.expense.reduce((sum, item) => sum + (item.budget || 0), 0);
        const expenseReal = monthData.expense.reduce((sum, item) => sum + item.real, 0);
        return {incomeBudget, incomeReal, expenseBudget, expenseReal, incomeDiff: incomeReal - incomeBudget, expenseDiff: expenseReal - expenseBudget, savingsBudget: incomeBudget - expenseBudget, savingsReal: incomeReal - expenseReal, savingsDiff: (incomeReal - expenseReal) - (incomeBudget - expenseBudget)};
    }, [monthData]);

    const TransactionTable = ({ title, type, items }) => (
        <Card className="flex-1">
            <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h3><button onClick={() => type === 'income' ? setIncomeModalOpen(true) : setExpenseModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-semibold">Añadir</button></div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr><th scope="col" className="px-6 py-3">Categoría</th><th scope="col" className="px-6 py-3">Sub-Categoría</th><th scope="col" className="px-6 py-3">Presupuestado</th><th scope="col" className="px-6 py-3">Real</th><th scope="col" className="px-6 py-3">Diferencia</th><th scope="col" className="px-6 py-3">Acciones</th></tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => {
                            const diff = item.real - (item.budget || 0);
                            return (<tr key={item.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"><td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{item.category}</td><td className="px-6 py-4">{item.subcategory}</td><td className="px-6 py-4"><input type="number" value={item.budget || ''} onChange={(e) => handleUpdateBudget(type, index, e.target.value)} className="w-24 bg-gray-100 dark:bg-gray-700 p-1 rounded"/></td><td className="px-6 py-4">{item.real.toFixed(2)} {currency}</td><td className={`px-6 py-4 font-semibold ${diff >= 0 ? 'text-green-500' : 'text-red-500'}`}>{diff.toFixed(2)} {currency}</td><td className="px-6 py-4"><button onClick={() => handleDeleteTransaction(type, index)} className="text-red-500 hover:text-red-700">Eliminar</button></td></tr>);
                        })}
                    </tbody>
                </table>
            </div>
        </Card>
    );

    return (
        <div className="space-y-8">
            <TransactionModal isOpen={isIncomeModalOpen} onClose={() => setIncomeModalOpen(false)} onAdd={(t) => handleTransaction('income', t)} categories={config.categories.income} type="income" />
            <TransactionModal isOpen={isExpenseModalOpen} onClose={() => setExpenseModalOpen(false)} onAdd={(t) => handleTransaction('expense', t)} categories={config.categories.expense} type="expense" />
            <div className="flex flex-col lg:flex-row gap-8"><TransactionTable title="Ingresos" type="income" items={monthData.income} /><TransactionTable title="Gastos" type="expense" items={monthData.expense} /></div>
            <Card>
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Resumen del Mes</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"><tr><th scope="col" className="px-6 py-3">Concepto</th><th scope="col" className="px-6 py-3">Presupuestado</th><th scope="col" className="px-6 py-3">Real</th><th scope="col" className="px-6 py-3">Diferencia</th></tr></thead>
                        <tbody>
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"><td className="px-6 py-4 font-bold text-green-600 dark:text-green-400">TOTAL INGRESOS</td><td className="px-6 py-4">{totals.incomeBudget.toFixed(2)} {currency}</td><td className="px-6 py-4">{totals.incomeReal.toFixed(2)} {currency}</td><td className={`px-6 py-4 font-semibold ${totals.incomeDiff >= 0 ? 'text-green-500' : 'text-red-500'}`}>{totals.incomeDiff.toFixed(2)} {currency}</td></tr>
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"><td className="px-6 py-4 font-bold text-red-600 dark:text-red-400">TOTAL GASTOS</td><td className="px-6 py-4">{totals.expenseBudget.toFixed(2)} {currency}</td><td className="px-6 py-4">{totals.expenseReal.toFixed(2)} {currency}</td><td className={`px-6 py-4 font-semibold ${totals.expenseDiff <= 0 ? 'text-green-500' : 'text-red-500'}`}>{totals.expenseDiff.toFixed(2)} {currency}</td></tr>
                            <tr className="bg-white dark:bg-gray-800"><td className="px-6 py-4 font-bold text-blue-600 dark:text-blue-400">AHORRO / PÉRDIDA</td><td className="px-6 py-4">{totals.savingsBudget.toFixed(2)} {currency}</td><td className="px-6 py-4">{totals.savingsReal.toFixed(2)} {currency}</td><td className={`px-6 py-4 font-semibold ${totals.savingsDiff >= 0 ? 'text-green-500' : 'text-red-500'}`}>{totals.savingsDiff.toFixed(2)} {currency}</td></tr>
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

const AnnualDashboard = ({ yearData, currency }) => {
    const annualSummary = useMemo(() => months.map(month => {
        const monthData = yearData.transactions[month] || { income: [], expense: [] };
        const income = monthData.income.reduce((sum, item) => sum + item.real, 0);
        const expense = monthData.expense.reduce((sum, item) => sum + item.real, 0);
        return { name: month.substring(0, 3), Ingresos: income, Gastos: expense, Ahorro: income - expense };
    }), [yearData.transactions]);
    
    const expenseByCategory = useMemo(() => {
        const expenseMap = new Map();
        Object.values(yearData.transactions).forEach(monthData => monthData.expense.forEach(item => {
            const currentAmount = expenseMap.get(item.category) || 0;
            expenseMap.set(item.category, currentAmount + item.real);
        }));
        return Array.from(expenseMap.entries()).map(([name, value]) => ({ name, value }));
    }, [yearData.transactions]);
    
    const totals = useMemo(() => {
        const totalIncome = annualSummary.reduce((sum, month) => sum + month.Ingresos, 0);
        const totalExpense = annualSummary.reduce((sum, month) => sum + month.Gastos, 0);
        return { totalIncome, totalExpense, totalSavings: totalIncome - totalExpense, savingsRate: totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0 };
    }, [annualSummary]);
    
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF4560'];

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card><h3 className="text-gray-500 dark:text-gray-400 font-semibold">Ingresos Totales</h3><p className="text-3xl font-bold text-green-500">{totals.totalIncome.toFixed(2)} {currency}</p></Card>
                <Card><h3 className="text-gray-500 dark:text-gray-400 font-semibold">Gastos Totales</h3><p className="text-3xl font-bold text-red-500">{totals.totalExpense.toFixed(2)} {currency}</p></Card>
                <Card><h3 className="text-gray-500 dark:text-gray-400 font-semibold">Ahorro Total</h3><p className="text-3xl font-bold text-blue-500">{totals.totalSavings.toFixed(2)} {currency}</p></Card>
                <Card><h3 className="text-gray-500 dark:text-gray-400 font-semibold">Tasa de Ahorro</h3><p className="text-3xl font-bold text-purple-500">{totals.savingsRate.toFixed(1)}%</p></Card>
            </div>
            <Card>
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Ingresos vs Gastos Mensuales</h3>
                <ResponsiveContainer width="100%" height={400}><BarChart data={annualSummary}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Legend /><Bar dataKey="Ingresos" fill="#16a34a" /><Bar dataKey="Gastos" fill="#dc2626" /></BarChart></ResponsiveContainer>
            </Card>
            <div className="flex flex-col lg:flex-row gap-8">
                <Card className="flex-1">
                    <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Distribución de Gastos</h3>
                    <ResponsiveContainer width="100%" height={400}><PieChart><Pie data={expenseByCategory} cx="50%" cy="50%" labelLine={false} outerRadius={150} fill="#8884d8" dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>{expenseByCategory.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}</Pie><Tooltip /></PieChart></ResponsiveContainer>
                </Card>
                <Card className="flex-1">
                    <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Evolución del Ahorro</h3>
                    <ResponsiveContainer width="100%" height={400}><LineChart data={annualSummary}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Legend /><Line type="monotone" dataKey="Ahorro" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} /></LineChart></ResponsiveContainer>
                </Card>
            </div>
        </div>
    );
};

const NetWorthTracker = ({ yearData, onYearDataChange, currency, config }) => {
    const [selectedMonth, setSelectedMonth] = useState(months[new Date().getMonth()]);

    const handleValueChange = (type, category, subcategory, value) => {
        const newValue = parseFloat(value) || 0;
        const updatedNetWorth = JSON.parse(JSON.stringify(yearData.netWorthData));
        if (!updatedNetWorth[selectedMonth]) updatedNetWorth[selectedMonth] = { assets:{}, liabilities:{} };
        if (!updatedNetWorth[selectedMonth][type]) updatedNetWorth[selectedMonth][type] = {};
        if (!updatedNetWorth[selectedMonth][type][category]) updatedNetWorth[selectedMonth][type][category] = {};
        updatedNetWorth[selectedMonth][type][category][subcategory] = newValue;
        onYearDataChange({ ...yearData, netWorthData: updatedNetWorth });
    };

    const netWorthSummary = useMemo(() => months.map(month => {
        const monthData = yearData.netWorthData[month];
        if (!monthData) return { name: month.substring(0,3), "Patrimonio Neto": 0, "Activos": 0, "Pasivos": 0 };
        const totalAssets = Object.values(monthData.assets || {}).flatMap(cat => Object.values(cat)).reduce((sum, val) => sum + val, 0);
        const totalLiabilities = Object.values(monthData.liabilities || {}).flatMap(cat => Object.values(cat)).reduce((sum, val) => sum + val, 0);
        return { name: month.substring(0,3), "Patrimonio Neto": totalAssets - totalLiabilities, "Activos": totalAssets, "Pasivos": totalLiabilities };
    }), [yearData.netWorthData]);
    
    const currentMonthTotals = netWorthSummary[months.indexOf(selectedMonth)];

    const CategoryTable = ({ title, type, categories }) => (
        <Card className="flex-1">
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">{title}</h3>
            <div className="space-y-4">
                {Object.entries(categories).map(([category, subcategories]) => (
                    <div key={category}>
                        <h4 className="font-semibold text-gray-600 dark:text-gray-300">{category}</h4>
                        <div className="pl-4 mt-2 space-y-2">
                        {subcategories.map(sub => (
                             <div key={sub} className="flex justify-between items-center">
                                <label className="text-gray-500 dark:text-gray-400">{sub}</label>
                                <input type="number" step="0.01" className="w-32 bg-gray-100 dark:bg-gray-700 p-2 rounded-lg text-right" value={yearData.netWorthData[selectedMonth]?.[type]?.[category]?.[sub] || ''} onChange={e => handleValueChange(type, category, sub, e.target.value)} placeholder={`0.00 ${currency}`}/>
                            </div>
                        ))}
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );

    return (
        <div className="space-y-8">
             <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"><label htmlFor="month-select-nw" className="mr-4 font-semibold text-gray-700 dark:text-gray-200">Seleccionar Mes:</label><select id="month-select-nw" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white">{months.map(month => <option key={month} value={month}>{month}</option>)}</select></div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card><h3 className="text-gray-500 dark:text-gray-400 font-semibold">Total Activos</h3><p className="text-3xl font-bold text-green-500">{currentMonthTotals.Activos.toFixed(2)} {currency}</p></Card>
                <Card><h3 className="text-gray-500 dark:text-gray-400 font-semibold">Total Pasivos</h3><p className="text-3xl font-bold text-red-500">{currentMonthTotals.Pasivos.toFixed(2)} {currency}</p></Card>
                <Card><h3 className="text-gray-500 dark:text-gray-400 font-semibold">Patrimonio Neto</h3><p className="text-3xl font-bold text-blue-500">{currentMonthTotals['Patrimonio Neto'].toFixed(2)} {currency}</p></Card>
            </div>
            <div className="flex flex-col lg:flex-row gap-8"><CategoryTable title="Activos" type="assets" categories={config.netWorth.assets} /><CategoryTable title="Pasivos" type="liabilities" categories={config.netWorth.liabilities} /></div>
            <Card>
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Evolución del Patrimonio Neto</h3>
                <ResponsiveContainer width="100%" height={400}><LineChart data={netWorthSummary}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Legend /><Line type="monotone" dataKey="Patrimonio Neto" stroke="#2563eb" strokeWidth={2} /><Line type="monotone" dataKey="Activos" stroke="#16a34a" strokeWidth={2} /><Line type="monotone" dataKey="Pasivos" stroke="#dc2626" strokeWidth={2} /></LineChart></ResponsiveContainer>
            </Card>
        </div>
    );
};


function FinanceApp({ user, auth, db }) {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [selectedMonth, setSelectedMonth] = useState(months[new Date().getMonth()]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const docRef = useMemo(() => {
        if (!user) return null;
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        return doc(db, "artifacts", appId, "users", user.uid, "data", "main");
    }, [db, user]);

    useEffect(() => {
        if (!docRef) return;
        
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                const fetchedData = docSnap.data();
                setData(fetchedData);
                const years = Object.keys(fetchedData.financialData || {});
                if (years.length > 0) {
                     setSelectedYear(prevYear => years.includes(prevYear) ? prevYear : Math.max(...years.map(Number)).toString());
                } else {
                    const currentYearStr = new Date().getFullYear().toString();
                    setData(prev => ({...prev, financialData: {[currentYearStr]: {transactions: {}, netWorthData: {}}}}));
                    setSelectedYear(currentYearStr);
                }
            } else {
                 const currentYearStr = new Date().getFullYear().toString();
                 const initialDocData = {
                    config: initialConfig,
                    financialData: {
                        [currentYearStr]: { transactions: {}, netWorthData: {} }
                    }
                };
                setDoc(docRef, initialDocData);
                setData(initialDocData);
                setSelectedYear(currentYearStr);
            }
            setLoading(false);
        }, (error) => {
            console.error("Error al obtener datos de Firestore:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [docRef]);

    const handleDataUpdate = useCallback(async (updatedData) => {
        if (!docRef) return;
        try {
            await setDoc(docRef, updatedData, { merge: true });
        } catch (error) {
            console.error("Error al guardar datos:", error);
        }
    }, [docRef]);

    const handleAddYear = async () => {
        const newYear = prompt("Introduce el nuevo año:", (parseInt(Object.keys(data.financialData).pop() || selectedYear) + 1).toString());
        if (newYear && !isNaN(newYear) && !data.financialData[newYear]) {
            const updatedFinancialData = {
                ...data.financialData,
                [newYear]: { transactions: {}, netWorthData: {} }
            };
            await handleDataUpdate({ financialData: updatedFinancialData });
            setSelectedYear(newYear);
        } else if (data.financialData[newYear]) {
            alert("El año ya existe.");
        }
    };

    const handleYearDataChange = (updatedYearData) => {
        const updatedFinancialData = { ...data.financialData, [selectedYear]: updatedYearData };
        handleDataUpdate({ financialData: updatedFinancialData });
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900"><div className="text-xl font-semibold text-gray-700 dark:text-gray-300">Cargando tus datos financieros...</div></div>;
    }
    
    if (!data) return null;

    const yearData = data.financialData[selectedYear] || { transactions: {}, netWorthData: {} };
    
    const renderContent = () => {
        if (!yearData) return <div>Selecciona un año para empezar.</div>;
        switch (activeTab) {
            case 'dashboard': return <AnnualDashboard yearData={yearData} currency={data.config.currency} />;
            case 'monthly': return <MonthlyTracker yearData={yearData} onYearDataChange={handleYearDataChange} selectedMonth={selectedMonth} currency={data.config.currency} config={data.config} />;
            case 'networth': return <NetWorthTracker yearData={yearData} onYearDataChange={handleYearDataChange} currency={data.config.currency} config={data.config} />;
            case 'settings': return <div><h2 className="text-3xl font-bold text-gray-800 dark:text-white">Configuración</h2><p className="mt-4 text-gray-600 dark:text-gray-400">Aquí podrás configurar las categorías y la moneda en futuras versiones.</p></div>;
            default: return null;
        }
    };

    const NavButton = ({ tabName, icon, label }) => (<button onClick={() => setActiveTab(tabName)} className={`flex items-center space-x-3 p-3 rounded-lg w-full text-left transition-colors duration-200 ${activeTab === tabName ? 'bg-blue-600 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}>{icon}<span className="font-semibold">{label}</span></button>);
    const availableYears = Object.keys(data.financialData || {}).sort((a,b) => b - a);

    return (
        <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen font-sans">
            <div className="flex flex-col lg:flex-row">
                <aside className="w-full lg:w-64 bg-white dark:bg-gray-800 p-6 lg:min-h-screen shadow-lg flex flex-col justify-between">
                    <div>
                        <div className="flex items-center mb-10">
                            <div className="bg-blue-600 p-2 rounded-lg mr-3"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg></div>
                            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Mis Finanzas</h1>
                        </div>
                        <nav className="space-y-4">
                            <NavButton tabName="dashboard" icon={<HomeIcon />} label="Dashboard Anual" />
                            <NavButton tabName="monthly" icon={<ListIcon />} label="Tracker Mensual" />
                            <NavButton tabName="networth" icon={<PieChartIcon />} label="Patrimonio Neto" />
                            <NavButton tabName="settings" icon={<SettingsIcon />} label="Configuración" />
                        </nav>
                    </div>
                    <div className="mt-10">
                         <div className="text-center mb-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Sesión iniciada como:</p>
                            <p className="font-semibold text-gray-800 dark:text-gray-200 truncate">{user.displayName}</p>
                         </div>
                         <button onClick={() => signOut(auth)} className="w-full flex items-center justify-center space-x-2 p-3 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"><LogOutIcon /><span>Cerrar Sesión</span></button>
                    </div>
                </aside>

                <main className="flex-1 p-6 lg:p-10">
                    <header className="flex justify-between items-center mb-8 flex-wrap gap-4">
                        <div className="flex items-center gap-4 flex-wrap">
                            {activeTab === 'monthly' && (<div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm inline-block"><label htmlFor="month-select" className="mr-2 font-semibold text-sm text-gray-600 dark:text-gray-300">Mes:</label><select id="month-select" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="bg-transparent font-semibold text-gray-800 dark:text-white focus:outline-none">{months.map(month => <option key={month} value={month}>{month}</option>)}</select></div>)}
                        </div>
                        <div className="flex items-center gap-2">
                             <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm inline-block"><label htmlFor="year-select" className="mr-2 font-semibold text-sm text-gray-600 dark:text-gray-300">Año:</label><select id="year-select" value={selectedYear} onChange={e => setSelectedYear(e.target.value)} className="bg-transparent font-semibold text-gray-800 dark:text-white focus:outline-none">{availableYears.map(year => <option key={year} value={year}>{year}</option>)}</select></div>
                             <button onClick={handleAddYear} title="Añadir año" className="p-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"><PlusCircleIcon /></button>
                        </div>
                    </header>
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}

function LoginScreen({ onLogin }) {
    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-xl p-10 text-center">
                 <div className="flex items-center justify-center mb-6">
                    <div className="bg-blue-600 p-3 rounded-lg mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Tracker Financiero</h1>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-8">Inicia sesión para gestionar tus finanzas personales.</p>
                <button 
                    onClick={onLogin} 
                    className="flex items-center justify-center w-full px-6 py-3 bg-white border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                    <GoogleIcon />
                    <span className="ml-4 font-semibold text-gray-700 dark:text-gray-200">Iniciar sesión con Google</span>
                </button>
            </div>
        </div>
    );
}

export default function App() {
    const [user, setUser] = useState(null);
    const [auth, setAuth] = useState(null);
    const [db, setDb] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
            const app = initializeApp(firebaseConfig);
            const authInstance = getAuth(app);
            const dbInstance = getFirestore(app);
            setAuth(authInstance);
            setDb(dbInstance);

            const unsubscribe = onAuthStateChanged(authInstance, (currentUser) => {
                setUser(currentUser);
                setLoading(false);
            });
            return () => unsubscribe();
        } catch (error) {
            console.error("Error al inicializar Firebase. Asegúrate de que la configuración es correcta.", error);
            setLoading(false);
        }
    }, []);

    const handleLogin = async () => {
        if (!auth) return;
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Error al iniciar sesión con Google", error);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900"><div className="text-xl font-semibold text-gray-700 dark:text-gray-300">Inicializando aplicación...</div></div>;
    }

    if (!user) {
        return <LoginScreen onLogin={handleLogin} />;
    }

    return <FinanceApp user={user} auth={auth} db={db} />;
}
