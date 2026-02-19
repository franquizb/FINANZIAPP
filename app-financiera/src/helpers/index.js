// src/helpers/index.js

export const calculateActualTotal = (transactions) => {
  if (!Array.isArray(transactions)) return 0;
  return transactions.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
};

export const getCategoryGroup = (subCatName, allCategories) => {
    const incomeCategories = allCategories["Ingresos"] || [];
    const expenseMainCategoryKeys = ["Gastos Esenciales", "Gastos Discrecionales", "Pago de Deudas", "Ahorro e Inversión"];
    const assetCategories = allCategories["Activos"] || [];
    const liabilityCategories = allCategories["Pasivos"] || [];

    if (incomeCategories.includes(subCatName)) return { type: 'income', mainCategory: 'Ingresos' };
    
    for (const mainKey of expenseMainCategoryKeys) {
        if (allCategories[mainKey] && allCategories[mainKey].includes(subCatName)) {
            return { type: 'expense', mainCategory: mainKey };
        }
    }
    if (assetCategories.includes(subCatName)) return { type: 'asset', mainCategory: 'Activos' };
    if (liabilityCategories.includes(subCatName)) return { type: 'liability', mainCategory: 'Pasivos' };
    
    return { type: 'unknown', mainCategory: 'Desconocido' };
};