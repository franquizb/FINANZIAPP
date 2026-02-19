// src/components/DashboardView.js
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { months } from '../constants'; // Importa months
import { calculateActualTotal, getCategoryGroup } from '../helpers'; // Importa helpers
import { Icon } from './Icons'; // Importa Icon para usarlo en gráficos si es necesario

export default function DashboardView({ data, year, categories, onUpdateFinancialData, fullData, mode, setMode }) {
  if (!data) return <div className="text-center">No hay datos para {year}.</div>;
  
  // --- Cálculos para el Modo Gráficos (Charts Mode) ---
  const monthlyTotals = months.map(month => {
    let income = 0;
    (categories["Ingresos"] || []).forEach(subCat => { 
        income += calculateActualTotal(data.monthly?.[month]?.[subCat]?.actual || []); 
    });
    
    let expenses = 0;
    const expenseMainCategoryKeys = ["Gastos Esenciales", "Gastos Discrecionales", "Pago de Deudas", "Ahorro e Inversión"];
    expenseMainCategoryKeys.forEach(mainCatKey => {
        (categories[mainCatKey] || []).forEach(subCat => {
            expenses += calculateActualTotal(data.monthly?.[month]?.[subCat]?.actual || []); 
        });
    });

    return { name: month.substring(0, 3).toUpperCase(), income, expenses };
  });

  const totalIncomeCharts = monthlyTotals.reduce((sum, item) => sum + item.income, 0);
  const totalExpensesCharts = monthlyTotals.reduce((sum, item) => sum + item.expenses, 0);
  const totalSavingsCharts = totalIncomeCharts - totalExpensesCharts;
  
  const expenseDistribution = [];
  const allExpenseSubCategories = [];
  ["Gastos Esenciales", "Gastos Discrecionales", "Pago de Deudas", "Ahorro e Inversión"].forEach(mainCatKey => {
      allExpenseSubCategories.push(...(categories[mainCatKey] || [])); // Obtener todas las subcategorías de gastos
  });

  allExpenseSubCategories.forEach(subCat => {
      const total = months.reduce((sum, month) => sum + calculateActualTotal(data.monthly?.[month]?.[subCat]?.actual || []), 0); 
      if (total > 0) expenseDistribution.push({ name: subCat, value: total });
  });
  
  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe", "#00c49f", "#ffbb28", "#ff8042", "#a4de6c"];

  // Datos para el gráfico de Presupuesto vs. Real por Categoría de Gasto (Charts Mode)
  const budgetVsActualExpenseData = [];
  const expenseMainCategoryKeysForCharts = ["Gastos Esenciales", "Gastos Discrecionales", "Pago de Deudas", "Ahorro e Inversión"];
  expenseMainCategoryKeysForCharts.forEach(mainCatKey => {
      // Sumar el presupuesto mensual de las subcategorías de esta categoría principal, y multiplicarlo por 12 para anualizar
      const budgeted = (categories[mainCatKey] || []).reduce((sum, subCat) => {
          return sum + (data.budget?.[subCat] || 0); // Presupuesto es por subcategoría (ya es mensual)
      }, 0) * 12; // Anualizar para el gráfico anual
      
      const actual = months.reduce((sum, month) => {
          return sum + (categories[mainCatKey] || []).reduce((subSum, subCat) => {
              return subSum + calculateActualTotal(data.monthly?.[month]?.[subCat]?.actual || []); 
          }, 0);
      }, 0);
      if (budgeted > 0 || actual > 0) {
          budgetVsActualExpenseData.push({
              name: mainCatKey,
              'Gasto Presupuestado': budgeted,
              'Gasto Real': actual
          });
      }
  });

  // NUEVO: Cálculos para la tabla de Resumen de Totales Anuales por Categoría
  const summaryAnnualActualsTableData = [];
  const mainCategoriesForAnnualSummary = ["Ingresos", "Gastos Esenciales", "Gastos Discrecionales", "Pago de Deudas", "Ahorro e Inversión"];
  
  mainCategoriesForAnnualSummary.forEach(mainCatKey => {
      const totalActualForMainCat = months.reduce((sum, month) => {
          return sum + (categories[mainCatKey] || []).reduce((subSum, subCat) => {
              return subSum + calculateActualTotal(data.monthly?.[month]?.[subCat]?.actual || []);
          }, 0);
      }, 0);
      if (totalActualForMainCat > 0) {
        summaryAnnualActualsTableData.push({ name: mainCatKey, value: totalActualForMainCat });
      }
  });
  const totalSummaryAnnualActuals = summaryAnnualActualsTableData.reduce((sum, item) => sum + item.value, 0);


  // --- Lógica para el Modo Presupuesto Anual (Budget Mode) ---
  // Calcular todos los totales necesarios al inicio del bloque
  const totalIncomeBudgeted = (categories["Ingresos"] || []).reduce((sum, cat) => sum + (data.budget?.[cat] || 0), 0);
  
  const totalExpensesBudgeted = ["Gastos Esenciales", "Gastos Discrecionales", "Pago de Deudas", "Ahorro e Inversión"].reduce((sum, mainCatKey) => {
      return sum + (categories[mainCatKey] || []).reduce((subSum, subCat) => {
          return subSum + (data.budget?.[subCat] || 0); // Suma presupuestos de subcategorías (ya son mensuales)
      }, 0);
  }, 0);

  const remanente = totalIncomeBudgeted - totalExpensesBudgeted;

  // Totales para las filas extra del resumen (calculados antes de summaryBudgetTableData)
  const totalEssentialDiscretionary = (categories["Gastos Esenciales"] || []).reduce((sum, subCat) => sum + (data.budget?.[subCat] || 0), 0) +
                                     (categories["Gastos Discrecionales"] || []).reduce((sum, subCat) => sum + (data.budget?.[subCat] || 0), 0);
  
  const totalSavingInvestment = (categories["Ahorro e Inversión"] || []).reduce((sum, subCat) => sum + (data.budget?.[subCat] || 0), 0);

  // Datos para la tabla de Resumen Final de Presupuesto (6ª tabla)
  const summaryBudgetTableData = [];
  const mainCategoriesForSummary = ["Ingresos", "Gastos Esenciales", "Gastos Discrecionales", "Pago de Deudas", "Ahorro e Inversión"];
  
  mainCategoriesForSummary.forEach(mainCatKey => {
      const budgeted = (categories[mainCatKey] || []).reduce((sum, subCat) => {
          return sum + (data.budget?.[subCat] || 0); // Suma presupuestos de subcategorías (mensuales)
      }, 0);
      summaryBudgetTableData.push({ name: mainCatKey, budgeted: budgeted });
  });

  const totalIncomeForPercentages = totalIncomeBudgeted > 0 ? totalIncomeBudgeted : 1; 

  summaryBudgetTableData.forEach(item => {
      item.percentage = (item.budgeted / totalIncomeForPercentages) * 100;
  });

  const percentageEssentialDiscretionary = (totalEssentialDiscretionary / totalIncomeForPercentages) * 100;
  const percentageSavingInvestment = (totalSavingInvestment / totalIncomeForPercentages) * 100;


  // Datos para las tablas individuales de presupuesto (Ingresos, Gastos Esenciales, etc.)
  const renderBudgetCategoryTable = (mainCategoryKey) => {
    const tableSubCategories = categories[mainCategoryKey] || [];
    
    // Si no hay subcategorías para renderizar, no renderizar la tabla
    if (tableSubCategories.length === 0 && !['Activos', 'Pasivos'].includes(mainCategoryKey)) {
      return null;
    }

    const tableData = [];
    tableSubCategories.forEach(subCat => {
        tableData.push({
            name: subCat,
            value: data.budget?.[subCat] || 0 // Presupuesto por subcategoría (mensual)
        });
    });

    const totalTableBudgeted = tableData.reduce((sum, item) => sum + item.value, 0);

    return (
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4 text-white">{mainCategoryKey}</h3> {/* Título es la categoría principal */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="p-3">Categoría</th>
                <th className="p-3 text-right">Cantidad Mensual</th> {/* CAMBIADO A MENSUAL */}
              </tr>
            </thead>
            <tbody>
              {tableData.map(item => (
                <tr key={item.name} className="border-b border-gray-700 hover:bg-gray-700/50">
                  <td className="p-3">{item.name}</td>
                  <td className="p-3 text-right">
                    <input
                      type="number"
                      value={item.value}
                      onChange={(e) => {
                        const newValue = parseFloat(e.target.value) || 0;
                        const newData = JSON.parse(JSON.stringify(fullData));
                        newData[year].budget[item.name] = newValue; // Guardar por subcategoría (mensual)
                        
                        // Actualizar budgeted mensual en los datos mensuales
                        months.forEach(month => {
                            if (newData[year].monthly[month]?.[item.name]) {
                                newData[year].monthly[month][item.name].budgeted = newValue; // Actualiza el 'budgeted' mensual
                            }
                        });
                        onUpdateFinancialData(newData);
                      }}
                      className="w-32 bg-transparent text-right outline-none focus:bg-gray-700 rounded p-1"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-bold text-white">
                <td className="p-3">Total {mainCategoryKey}</td> 
                <td className="p-3 text-right">{totalTableBudgeted.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  };


  if (mode === 'charts') {
    return (
      <div className="space-y-8">
        {/* Tarjetas de Resumen de Totales Anuales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg"><h3 className="text-gray-400 text-sm">Ingresos Totales (Año)</h3><p className="text-3xl font-bold text-green-400">{totalIncomeCharts.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}</p></div>
          <div className="bg-gray-800 p-6 rounded-lg"><h3 className="text-gray-400 text-sm">Gastos Totales (Año)</h3><p className="text-3xl font-bold text-red-400">{totalExpensesCharts.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}</p></div>
          <div className="bg-gray-800 p-6 rounded-lg"><h3 className="text-gray-400 text-sm">Ahorro / Déficit Total (Año)</h3><p className={`text-3xl font-bold ${totalSavingsCharts >= 0 ? "text-blue-400" : "text-yellow-400"}`}>{totalSavingsCharts.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}</p></div>
        </div>
        
        {/* Fila superior de gráficos (Ingresos vs Gastos, Distribución) */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 h-96">
          <div className="lg:col-span-3 bg-gray-800 p-6 rounded-lg"><h3 className="text-lg font-semibold mb-4">Ingresos vs. Gastos Mensuales</h3><ResponsiveContainer width="100%" height="90%"><BarChart data={monthlyTotals}><CartesianGrid strokeDasharray="3 3" stroke="#4a5568" /><XAxis dataKey="name" stroke="#a0aec0" /><YAxis stroke="#a0aec0" tickFormatter={(value) => new Intl.NumberFormat("es-ES", { notation: "compact", compactDisplay: "short" }).format(value)} /><Tooltip contentStyle={{ backgroundColor: "#2d3748", border: "none" }} cursor={{fill: "#4a5568"}} /><Legend /><Bar dataKey="income" fill="#48bb78" name="Ingresos" /><Bar dataKey="expenses" fill="#f56565" name="Gastos" /></BarChart></ResponsiveContainer></div>
          <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg"><h3 className="text-lg font-semibold mb-4">Distribución de Gastos</h3><ResponsiveContainer width="100%" height="90%"><PieChart><Pie data={expenseDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={'80%'} label>{expenseDistribution.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}</Pie><Tooltip contentStyle={{ backgroundColor: "#2d3748", border: "none" }} /><Legend /></PieChart></ResponsiveContainer></div>
        </div>

        {/* Fila inferior de gráficos/tablas (Presupuesto vs Real, Resumen de Totales Anuales) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-96">
            {/* Gráfico de Gasto Presupuestado vs. Gasto Real por Categoría */}
            <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Gasto Presupuestado vs. Gasto Real (Por Categoría)</h3>
                {budgetVsActualExpenseData.length > 0 ? (
                <ResponsiveContainer width="100%" height="90%">
                    <BarChart data={budgetVsActualExpenseData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" /><XAxis dataKey="name" stroke="#a0aec0" /><YAxis stroke="#a0aec0" tickFormatter={(value) => new Intl.NumberFormat("es-ES", { notation: "compact", compactDisplay: "short" }).format(value)} /><Tooltip contentStyle={{ backgroundColor: "#2d3748", border: "none" }} cursor={{fill: "#4a5568"}} /><Legend /><Bar dataKey="Gasto Presupuestado" fill="#8884d8" />
                    <Bar dataKey="Gasto Real" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
                ) : (
                <p className="text-center text-gray-400">No hay datos de gastos o presupuestos para mostrar en este gráfico.</p>
                )}
            </div>

            {/* NUEVA TABLA: Resumen de Totales Anuales por Categoría */}
            <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Resumen de Totales Anuales por Categoría</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="p-3">Categoría</th>
                                <th className="p-3 text-right">Total Real</th>
                            </tr>
                        </thead>
                        <tbody>
                            {summaryAnnualActualsTableData.length === 0 ? (
                                <tr><td colSpan="2" className="p-3 text-center text-gray-400">No hay datos reales para mostrar.</td></tr>
                            ) : (
                                summaryAnnualActualsTableData.map(item => (
                                    <tr key={item.name} className="border-b border-gray-700 hover:bg-gray-700/50">
                                        <td className="p-3">{item.name}</td>
                                        <td className="p-3 text-right">{item.value.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                        <tfoot>
                            <tr className="font-bold text-white">
                                <td className="p-3">Total General</td>
                                <td className="p-3 text-right">{totalSummaryAnnualActuals.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
      </div>
    );
  } else if (mode === 'budget') { // --- MODO PRESUPUESTO ANUAL (Budget Mode) ---
    return (
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-white mb-6">Presupuesto Mensual - {year}</h2>

        {/* REMANENTE */}
        <div className="flex justify-end mb-8">
          <div className={`p-4 rounded-lg shadow-md ${remanente === 0 ? 'bg-green-600' : remanente > 0 ? 'bg-blue-600' : 'bg-red-600'} text-white text-xl font-bold`}>
            Remanente: {remanente.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
          </div>
        </div>

        {/* Tablas Individuales (Ingresos, Gastos Esenciales, etc.) - Agrupadas en dos columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Columna Izquierda */}
            <div className="space-y-8">
                {renderBudgetCategoryTable("Ingresos")}
                {renderBudgetCategoryTable("Gastos Esenciales")}
                {renderBudgetCategoryTable("Gastos Discrecionales")}
            </div>
            
            {/* Columna Derecha */}
            <div className="space-y-8">
                {renderBudgetCategoryTable("Pago de Deudas")}
                {renderBudgetCategoryTable("Ahorro e Inversión")}
            </div>
        </div>

        {/* Tabla de Resumen (la 6ª tabla) */}
        <div className="bg-gray-800 p-6 rounded-lg mt-8">
            <h3 className="text-xl font-bold mb-4 text-white">Resumen Presupuesto Mensual</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-700">
                            <th className="p-3">Concepto</th>
                            <th className="p-3 text-right">Presupuesto</th>
                            <th className="p-3 text-right">Porcentaje (%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {summaryBudgetTableData.map(item => (
                            <tr key={item.name} className="border-b border-gray-700 hover:bg-gray-700/50">
                                <td className="p-3 font-semibold">{item.name}</td>
                                <td className="p-3 text-right">{item.budgeted.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}</td>
                                <td className="p-3 text-right">{item.percentage.toFixed(2)}%</td>
                            </tr>
                        ))}
                        {/* Filas de agrupamiento extra */}
                        <tr className="border-b border-gray-700 hover:bg-gray-700/50">
                            <td className="p-3 font-semibold text-indigo-400">Gastos Sumados (Esenciales + Discrecionales)</td>
                            <td className="p-3 text-right font-bold">{totalEssentialDiscretionary.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}</td>
                            <td className="p-3 text-right font-bold">{percentageEssentialDiscretionary.toFixed(2)}%</td>
                        </tr>
                        <tr className="border-b border-gray-700 hover:bg-gray-700/50">
                            <td className="p-3 font-semibold text-indigo-400">Ahorro e Inversión Sumados</td>
                            <td className="p-3 text-right font-bold">{totalSavingInvestment.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}</td>
                            <td className="p-3 text-right font-bold">{percentageSavingInvestment.toFixed(2)}%</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    );
  }
}

// MonthlyTrackerView MODIFICADO para tabla de transacciones plana y gráficos
function MonthlyTrackerView({ currentMonthData, categories, onUpdate, fullData, year, month, budgetData }) {
  if (!currentMonthData) return <div className="text-center">No hay datos para {month} de {year}.</div>;

  const today = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [newTransactionDate, setNewTransactionDate] = useState(today);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [newTransactionAmount, setNewTransactionAmount] = useState('');
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [newTransactionMainCategory, setNewTransactionMainCategory] = useState(() => {
      const defaultMain = Object.keys(categories).find(key => key.includes('Gasto') || key === 'Ingresos') || Object.keys(categories)[0]; 
      return defaultMain;
  }); 
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [newTransactionSubCategory, setNewTransactionSubCategory] = useState(() => { 
    const defaultMain = Object.keys(categories).find(key => key.includes('Gasto') || key === 'Ingresos') || Object.keys(categories)[0];
    return (categories[defaultMain] || [])?.length > 0
        ? (categories[defaultMain] || [])[0]
        : '';
  });
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [newTransactionType, setNewTransactionType] = useState(() => {
      // Inicializar el tipo de transacción según la categoría principal por defecto
      const defaultMain = Object.keys(categories).find(key => key.includes('Gasto') || key === 'Ingresos') || Object.keys(categories)[0];
      return getCategoryGroup(categories[defaultMain]?.[0] || '', categories).type;
  });


  // Recopilar todas las transacciones del mes, mezclando ingresos y gastos
  const allTransactions = [];
  
  Object.keys(categories).forEach(mainCatKey => {
      if (mainCatKey !== 'Activos' && mainCatKey !== 'Pasivos') {
          (categories[mainCatKey] || []).forEach(subCat => {
              if (currentMonthData[subCat]?.actual) {
                  currentMonthData[subCat].actual.forEach(transaction => {
                      const { type, mainCategory } = getCategoryGroup(subCat, categories); 
                      allTransactions.push({ ...transaction, type: type, category: subCat, mainCategory: mainCategory });
                  });
              }
          });
      }
  });

  allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Calcular totales
  const totalIncome = allTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = allTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const totalSavings = totalIncome - totalExpenses;

  // Datos para los nuevos gráficos de Presupuesto vs. Real (mensual)
  const incomeBudgetVsActualData = (categories["Ingresos"] || []).map(cat => ({
    name: cat,
    'Presupuestado': (budgetData?.[cat]) || 0, // Presupuesto mensual de subcategoría
    'Real': calculateActualTotal(currentMonthData?.[cat]?.actual || [])
  })).filter(item => item['Presupuestado'] > 0 || item['Real'] > 0);

  const expenseBudgetVsActualData = ["Gastos Esenciales", "Gastos Discrecionales", "Pago de Deudas", "Ahorro e Inversión"].map(mainCatKey => {
      const budgeted = (categories[mainCatKey] || []).reduce((sum, subCat) => {
          return sum + (budgetData?.[subCat] || 0); 
      }, 0);
      const actual = (categories[mainCatKey] || []).reduce((sum, subCat) => {
          return sum + calculateActualTotal(currentMonthData?.[subCat]?.actual || []);
      }, 0);
      return {
          name: mainCatKey,
          'Presupuestado': budgeted,
          'Real': actual
      };
  }).filter(item => item['Presupuestado'] > 0 || item['Real'] > 0);


  const handleTypeChange = (e) => {
    const mainCat = e.target.value;
    setNewTransactionMainCategory(mainCat);
    const { type } = getCategoryGroup(categories[mainCat]?.[0] || '', categories); 
    setNewTransactionType(type); 
    setNewTransactionSubCategory((categories[mainCat] || [])?.length > 0 ? (categories[mainCat] || [])[0] : '');
  };

  const handleSubCategoryChange = (e) => {
      setNewTransactionSubCategory(e.target.value);
  };


  const handleAddTransaction = () => {
    const targetSubCategory = newTransactionSubCategory; 

    if (!newTransactionAmount || parseFloat(newTransactionAmount) <= 0 || !targetSubCategory || !newTransactionDate) {
      alert('Por favor, completa todos los campos (Fecha, Cantidad, Categoría Principal, Subcategoría) para añadir la transacción.');
      return;
    }
    
    const availableSubCategories = categories[newTransactionMainCategory] || [];
    if (!availableSubCategories.includes(newTransactionSubCategory)) {
        alert(`La subcategoría "${newTransactionSubCategory}" no es válida para la categoría principal seleccionada.`);
        return;
    }

    const newData = JSON.parse(JSON.stringify(fullData));
    const targetMonthlyData = newData[year].monthly[month];

    if (!targetMonthlyData[targetSubCategory]) { 
        targetMonthlyData[targetSubCategory] = { budgeted: 0, actual: [] }; 
    }
    const currentTransactions = targetMonthlyData[targetSubCategory].actual || [];
    
    currentTransactions.push({
      id: crypto.randomUUID(),
      amount: parseFloat(newTransactionAmount),
      date: newTransactionDate
    });

    targetMonthlyData[targetSubCategory].actual = currentTransactions;
    onUpdate(newData);

    setNewTransactionDate(today);
    setNewTransactionAmount('');
    const defaultMain = newTransactionMainCategory; 
    setNewTransactionMainCategory(defaultMain); 
    setNewTransactionSubCategory(targetSubCategory); 
  };

  const handleDeleteTransaction = (subCategoryToDelete, transactionId) => { 
    const newData = JSON.parse(JSON.stringify(fullData));
    const targetMonthlyData = newData[year].monthly[month];

    targetMonthlyData[subCategoryToDelete].actual = (targetMonthlyData[subCategoryToDelete].actual || []).filter(
      item => item.id !== transactionId
    );
    onUpdate(newData);
  };

  const renderCategorySummaryTable = (type) => {
      const dataToRender = type === 'Ingresos' ? incomeBudgetVsActualData : expenseBudgetVsActualData; 
      const title = type === 'Ingresos' ? 'Resumen de Ingresos' : 'Resumen de Gastos'; 
      
      let totalBudgeted = 0;
      let totalReal = 0;

      if (type === 'Ingresos') {
        totalBudgeted = incomeBudgetVsActualData.reduce((sum, item) => sum + item.Presupuestado, 0);
        totalReal = incomeBudgetVsActualData.reduce((sum, item) => sum + item.Real, 0);
      } else { 
        const expenseGroupKeys = ["Gastos Esenciales", "Gastos Discrecionales", "Pago de Deudas", "Ahorro e Inversión"];
        expenseGroupKeys.forEach(mainCatKey => {
            const groupBudgeted = (categories[mainCatKey] || []).reduce((sum, subCat) => sum + (budgetData?.[subCat] || 0), 0);
            const groupReal = (categories[mainCatKey] || []).reduce((sum, subCat) => sum + calculateActualTotal(currentMonthData?.[subCat]?.actual || []), 0);
            totalBudgeted += groupBudgeted;
            totalReal += groupReal;
        });
      }

      const totalDifference = totalReal - totalBudgeted;


      return (
          <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4 text-white">{title}</h3>
              <div className="overflow-x-auto">
                  <table className="w-full text-left">
                      <thead>
                          <tr className="border-b border-gray-700">
                              <th className="p-3">Categoría</th>
                              <th className="p-3 text-right">Presupuesto</th>
                              <th className="p-3 text-right">Real</th>
                              <th className="p-3 text-right">Diferencia</th>
                          </tr>
                      </thead>
                      <tbody>
                          {dataToRender.map(item => { 
                              const diff = item.Real - item.Presupuestado;
                              return (
                                  <tr key={item.name} className="border-b border-gray-700 hover:bg-gray-700/50">
                                      <td className="p-3">{item.name}</td>
                                      <td className="p-3 text-right">{item.Presupuestado.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}</td>
                                      <td className="p-3 text-right">{item.Real.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}</td>
                                      <td className={`p-3 text-right font-medium ${diff > 0 ? (type === "Ingresos" ? "text-green-400" : "text-red-400") : (type === "Ingresos" ? "text-red-400" : "text-green-400")}`}>
                                          {diff.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
                                      </td>
                                  </tr>
                              );
                          })}
                      </tbody>
                      <tfoot>
                        <tr className="font-bold text-white">
                            <td className="p-3">Total {title.replace('Resumen de ', '')}</td>
                            <td className="p-3 text-right">{totalBudgeted.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}</td>
                            <td className="p-3 text-right">{totalReal.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}</td>
                            <td className={`p-3 text-right ${totalDifference > 0 ? (type === "Ingresos" ? "text-green-400" : "text-red-400") : (type === "Ingresos" ? "text-red-400" : "text-green-400")}`}>
                                {totalDifference.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
                            </td>
                        </tr>
                      </tfoot>
                  </table>
              </div>
          </div>
      );
  };


  return (
    <div className="space-y-6">
      {/* Resumen de Totales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg text-center">
          <h3 className="text-gray-400 text-sm">Total Ingresos</h3>
          <p className="text-2xl font-bold text-green-400">{totalIncome.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg text-center">
          <h3 className="text-gray-400 text-sm">Total Gastos</h3>
          <p className="text-2xl font-bold text-red-400">{totalExpenses.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg text-center">
          <h3 className="text-gray-400 text-sm">Ahorro</h3>
          <p className={`text-2xl font-bold ${totalSavings >= 0 ? "text-blue-400" : "text-yellow-400"}`}>{totalSavings.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}</p>
        </div>
      </div>

      {/* NUEVOS GRÁFICOS: Presupuesto vs. Real (Mensual) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-6 rounded-lg h-96">
          <h3 className="text-lg font-semibold mb-4">Ingresos: Presupuesto vs. Real</h3>
          {incomeBudgetVsActualData.length > 0 ? (
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={incomeBudgetVsActualData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" /><XAxis dataKey="name" stroke="#a0aec0" /><YAxis stroke="#a0aec0" tickFormatter={(value) => new Intl.NumberFormat("es-ES", { notation: "compact", compactDisplay: "short" }).format(value)} /><Tooltip contentStyle={{ backgroundColor: "#2d3748", border: "none" }} cursor={{fill: "#4a5568"}} /><Legend /><Bar dataKey="Presupuestado" fill="#8884d8" />
                <Bar dataKey="Real" fill="#48bb78" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-400">No hay datos de ingresos o presupuestos para mostrar.</p>
          )}
        </div>

        <div className="bg-gray-800 p-6 rounded-lg h-96">
          <h3 className="text-lg font-semibold mb-4">Gastos: Presupuesto vs. Real</h3>
          {expenseBudgetVsActualData.length > 0 ? (
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={expenseBudgetVsActualData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" /><XAxis dataKey="name" stroke="#a0aec0" /><YAxis stroke="#a0aec0" tickFormatter={(value) => new Intl.NumberFormat("es-ES", { notation: "compact", compactDisplay: "short" }).format(value)} /><Tooltip contentStyle={{ backgroundColor: "#2d3748", border: "none" }} cursor={{fill: "#4a5568"}} /><Legend /><Bar dataKey="Presupuestado" fill="#8884d8" />
                <Bar dataKey="Real" fill="#f56565" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-400">No hay datos de gastos o presupuestos para mostrar.</p>
          )}
        </div>
      </div>

      {/* NUEVAS TABLAS DE RESUMEN DE PRESUPUESTO VS REAL POR CATEGORÍA */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {renderCategorySummaryTable('Ingresos')}
        {renderCategorySummaryTable('Gastos')} {/* Para este resumen, combinamos todos los tipos de gastos */}
      </div>


      {/* Formulario para añadir nueva transacción */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4 text-white">Añadir Nueva Transacción</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end"> {/* Ajustado a 5 columnas */}
          {/* Categoría Principal (Ingreso, Gasto Esencial, etc.) */}
          <div>
            <label htmlFor="main-category" className="block text-sm font-medium text-gray-400 mb-1">Categoría Principal</label>
            <select
              id="main-category"
              value={newTransactionMainCategory}
              onChange={handleTypeChange} 
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {Object.keys(categories).filter(key => key !== 'Activos' && key !== 'Pasivos').map(mainCat => (
                  <option key={mainCat} value={mainCat}>{mainCat}</option>
              ))}
            </select>
          </div>
          {/* Subcategoría */}
          <div>
            <label htmlFor="sub-category" className="block text-sm font-medium text-gray-400 mb-1">Subcategoría</label>
            <select
              id="sub-category"
              value={newTransactionSubCategory}
              onChange={handleSubCategoryChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {(categories[newTransactionMainCategory] || []).map(subCat => ( 
                  <option key={subCat} value={subCat}>{subCat}</option>
              ))}
            </select>
          </div>
          {/* Fecha */}
          <div>
            <label htmlFor="transaction-date" className="block text-sm font-medium text-gray-400 mb-1">Fecha</label>
            <input
              type="date"
              id="transaction-date"
              value={newTransactionDate}
              onChange={(e) => setNewTransactionDate(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          {/* Valor */}
          <div>
            <label htmlFor="transaction-amount" className="block text-sm font-medium text-gray-400 mb-1">Valor</label>
            <input
              type="number"
              id="transaction-amount"
              placeholder="0.00"
              value={newTransactionAmount}
              onChange={(e) => setNewTransactionAmount(e.target.value)}
              className="w-full bg-gray-700 border