// src/constants/index.js

export const initialCategories = {
  "Ingresos": ["Sueldo", "Alquiler", "Otros"],
  "Gastos Esenciales": ["Vivienda", "Transporte", "Alimentación", "Salud", "Suministros", "Educación", "Impuestos", "Otros"],
  "Gastos Discrecionales": ["Ocio", "Restaurantes", "Compras", "Viajes", "Regalos", "Suscripciones", "Otros"],
  "Pago de Deudas": ["Hipoteca", "Coche", "Personales", "Tarjetas", "Otros"],
  "Ahorro e Inversión": ["Fondo de Emergencia", "Inversiones L/P", "Plan de Pensiones", "Metas Específicas", "Otros"],
  "Activos": ["Efectivo", "Cuentas Corrientes", "Cuentas Ahorro", "Acciones", "Fondos de Inversión", "Criptomonedas", "Planes de Pensiones", "Inmuebles", "Otros Activos"],
  "Pasivos": ["Hipoteca", "Préstamo Coche", "Préstamos Personales", "Deuda Tarjetas", "Otros Pasivos"]
};

// Datos de presupuesto sugeridos para el primer año configurado (mensuales)
export const defaultBudget = {
  "Sueldo": 2500, "Alquiler": 200, "Otros": 50,
  "Vivienda": 500, "Transporte": 100, "Alimentación": 300, "Salud": 66.67, "Suministros": 150, "Educación": 0, "Impuestos": 125, "Otros": 16.67,
  "Ocio": 150, "Restaurantes": 100, "Compras": 125, "Viajes": 83.33, "Regalos": 41.67, "Suscripciones": 25, "Otros": 8.33,
  "Hipoteca": 500, "Coche": 0, "Personales": 0, "Tarjetas": 0, "Otros": 0,
  "Fondo de Emergencia": 100, "Inversiones L/P": 83.33, "Plan de Pensiones": 66.67, "Metas Específicas": 50, "Otros": 0
};

export const months = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
export const defaultStartYear = new Date().getFullYear();

export const GEMINI_API_KEY = "Pega_tu_API_Key_de_Google_AI_Studio_aquí";


export const generateInitialYearData = (year) => {
  const yearData = {
    budget: {},
    monthly: {},
    netWorth: { assets: {}, liabilities: {} }
  };

  Object.keys(initialCategories).forEach(mainCatKey => {
    if (mainCatKey === 'Activos' || mainCatKey === 'Pasivos') {
    } else {
      initialCategories[mainCatKey].forEach(subCat => {
        yearData.budget[subCat] = (year === defaultStartYear && defaultBudget[subCat] !== undefined)
          ? defaultBudget[subCat]
          : 0;
        months.forEach(month => {
          if (!yearData.monthly[month]) yearData.monthly[month] = {};
          yearData.monthly[month][subCat] = { budgeted: 0, actual: [] };
        });
      });
    }
  });

  initialCategories.Activos.forEach(cat => {
    yearData.netWorth.assets[cat] = {};
    months.forEach(month => yearData.netWorth.assets[cat][month] = 0);
  });
  initialCategories.Pasivos.forEach(cat => {
    yearData.netWorth.liabilities[cat] = {};
    months.forEach(month => yearData.netWorth.liabilities[cat][month] = 0);
  });
  return yearData;
};

export const getInitialUserData = (startYear = defaultStartYear, endYear = defaultStartYear + 10) => {
  const financialData = {};
  for (let year = startYear; year <= endYear; year++) {
    financialData[year] = generateInitialYearData(year);
  }
  return financialData;
};