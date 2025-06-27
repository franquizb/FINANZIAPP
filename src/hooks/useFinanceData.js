// src/hooks/useFinanceData.js
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

// Helper para obtener el nombre del mes (en minúsculas para claves de Firestore)
const getMonthName = (monthIndex) => {
    const months = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    return months[monthIndex];
};

const useFinanceData = (currentYearFromDashboard) => {
    const { currentUser } = useAuth();
    const [financeData, setFinanceData] = useState(null);
    const [userConfig, setUserConfig] = useState(null);
    const [loadingData, setLoadingData] = useState(true);
    const [errorData, setErrorData] = useState(null);
    const [availableYears, setAvailableYears] = useState([]);

    useEffect(() => {
        const fetchFinanceData = async () => {
            if (!currentUser) {
                setLoadingData(false);
                setAvailableYears([]);
                return;
            }

            setLoadingData(true);
            setErrorData(null);

            try {
                const configDocRef = doc(db, 'users', `${currentUser.uid}_config`);
                const dataDocRef = doc(db, 'users', `${currentUser.uid}_data`);

                const configSnap = await getDoc(configDocRef);
                const dataSnap = await getDoc(dataDocRef);

                let fetchedConfig = configSnap.exists() ? configSnap.data() : {};
                let fetchedData = dataSnap.exists() ? dataSnap.data() : {};

                // --- Lógica de Inicialización MÍNIMA (SIN DATOS PREDEFINIDOS) ---
                let updatedConfigToSave = { ...fetchedConfig };
                let configNeedsUpdate = false;

                // Si no hay categorías, inicializarlas como objeto vacío
                if (!updatedConfigToSave.categories) {
                    updatedConfigToSave.categories = {};
                    configNeedsUpdate = true;
                }

                // Asegurar que defaultYear, language, categoryDisplayNames y profile existan
                if (updatedConfigToSave.defaultYear === undefined) {
                    updatedConfigToSave.defaultYear = new Date().getFullYear().toString();
                    configNeedsUpdate = true;
                }
                if (updatedConfigToSave.language === undefined) {
                    updatedConfigToSave.language = 'es';
                    configNeedsUpdate = true;
                }
                if (updatedConfigToSave.categoryDisplayNames === undefined) {
                    updatedConfigToSave.categoryDisplayNames = {};
                    configNeedsUpdate = true;
                }

                // Inicializar el perfil si no existe
                if (!updatedConfigToSave.profile) {
                    updatedConfigToSave.profile = {
                        name: currentUser.email.split('@')[0],
                        avatarId: 'default',
                        bio: ''
                    };
                    configNeedsUpdate = true;
                } else if (updatedConfigToSave.profile.bio === undefined) {
                    updatedConfigToSave.profile.bio = '';
                    configNeedsUpdate = true;
                }

                if (configNeedsUpdate) {
                    await setDoc(configDocRef, updatedConfigToSave, { merge: true });
                }

                setUserConfig(updatedConfigToSave);

                // --- Inicialización de datos financieros (sin valores predefinidos) ---
                if (!fetchedData.portfolio) {
                    fetchedData.portfolio = { assets: [] };
                }

                const yearToFetch = currentYearFromDashboard || updatedConfigToSave.defaultYear || new Date().getFullYear().toString();

                const yearDataPath = fetchedData?.[yearToFetch];
                // Si no hay datos para el año actual o el documento está vacío, inicializarlo con estructura vacía
                if (!yearDataPath || Object.keys(fetchedData).length === 0 || Object.keys(fetchedData[yearToFetch] || {}).length === 0) {
                    const monthsNamesLowercase = [
                        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
                    ];
                    const monthlyInitialState = {};
                    monthsNamesLowercase.forEach(month => {
                        monthlyInitialState[month] = { budgeted: {}, actual: [] }; 
                    });

                    const initialYearData = {
                        budget: {},
                        monthly: monthlyInitialState,
                        netWorth: { assets: {}, liabilities: {} },
                    };

                    await setDoc(dataDocRef, {
                        ...fetchedData,
                        [yearToFetch]: initialYearData
                    }, { merge: true });

                    fetchedData = {
                        ...fetchedData,
                        [yearToFetch]: initialYearData
                    };
                }

                setFinanceData({
                    ...fetchedData,
                });

                // --- Lógica para identificar años con datos ---
                const yearsWithData = new Set();
                const currentYearNum = new Date().getFullYear();

                yearsWithData.add(currentYearNum);
                for (let i = 1; i <= 3; i++) {
                    yearsWithData.add(currentYearNum + i);
                }
                // Añadir el año que el usuario está viendo actualmente si no es NaN
                if (!isNaN(parseInt(currentYearFromDashboard))) {
                    yearsWithData.add(parseInt(currentYearFromDashboard));
                }
                

                for (const yearKey in fetchedData) {
                    if (!isNaN(parseInt(yearKey)) && yearKey.length === 4 && Object.keys(fetchedData[yearKey] || {}).length > 0) {
                        yearsWithData.add(parseInt(yearKey));
                    }
                }
                
                const sortedYears = Array.from(yearsWithData).sort((a, b) => a - b);
                setAvailableYears(sortedYears);

            } catch (err) {
                console.error("Error al cargar datos financieros:", err);
                setErrorData("Fallo al cargar datos financieros.");
                setAvailableYears([]);
            } finally {
                setLoadingData(false);
            }
        };

        fetchFinanceData();
    }, [currentUser, currentYearFromDashboard]);

    // Función auxiliar para realizar una fusión profunda de objetos
    const deepMerge = (target, source) => {
        const output = { ...target };
        if (target && typeof target === 'object' && source && typeof source === 'object') {
            Object.keys(source).forEach(key => {
                if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key]) && target[key] && typeof target[key] === 'object' && !Array.isArray(target[key])) {
                    output[key] = deepMerge(target[key], source[key]);
                } else {
                    output[key] = source[key];
                }
            });
        }
        return output;
    };


    // Función para actualizar los datos en Firestore y en el estado local (Optimistic Update)
    const updateFinanceData = async (newData) => {
        if (!currentUser) {
            console.warn("updateFinanceData: No hay usuario autenticado. No se puede actualizar.");
            return false;
        }

        // Validación de currentYear antes de la actualización
        const yearKeyToUpdate = Object.keys(newData).find(key => key.match(/^\d{4}$/));
        if (yearKeyToUpdate && (typeof yearKeyToUpdate !== 'string' || yearKeyToUpdate.length !== 4 || isNaN(parseInt(yearKeyToUpdate)))) {
            console.error("updateFinanceData: La clave de año no es válida en newData. No se puede actualizar el estado local ni Firestore.", newData);
            setErrorData("Error interno: Año no válido para la actualización.");
            return false;
        }

        let previousFinanceData = null; 
        setFinanceData(prevData => {
            previousFinanceData = prevData;
            const updatedPrevData = JSON.parse(JSON.stringify(prevData || {})); // Asegurarse de tener una copia profunda para evitar mutaciones inesperadas
            
            for (const yearKey in newData) {
                if (yearKey.match(/^\d{4}$/)) { // Si la clave es un año
                    // Obtener los datos existentes para el año o inicializarlo si no existe
                    const existingYearData = updatedPrevData[yearKey] || {};
                    const newYearDataPart = newData[yearKey] || {}; // La parte de newData para este año

                    // Fusionar el objeto netWorth más profundamente
                    const mergedNetWorth = deepMerge(existingYearData.netWorth || {}, newYearDataPart.netWorth || {});

                    // Fusionar monthly y budget
                    const mergedMonthly = deepMerge(existingYearData.monthly || {}, newYearDataPart.monthly || {});
                    const mergedBudget = deepMerge(existingYearData.budget || {}, newYearDataPart.budget || {});

                    updatedPrevData[yearKey] = {
                        ...existingYearData, // Copiar otras propiedades de nivel superior del año
                        ...Object.fromEntries(Object.entries(newYearDataPart).filter(([k]) => !['budget', 'monthly', 'netWorth'].includes(k))), // Otras propiedades que vengan en newYearDataPart
                        budget: mergedBudget,
                        monthly: mergedMonthly,
                        netWorth: mergedNetWorth, // Usar la fusión profunda de netWorth
                    };
                } else { // Si la clave no es un año (ej. 'portfolio')
                    updatedPrevData[yearKey] = deepMerge(updatedPrevData[yearKey] || {}, newData[yearKey] || {});
                }
            }
            console.log("updateFinanceData: Estado local actualizado optimísticamente.", updatedPrevData);
            return updatedPrevData;
        });

        try {
            const dataDocRef = doc(db, 'users', `${currentUser.uid}_data`);
            console.log("updateFinanceData: Enviando a Firestore:", JSON.stringify(newData));
            await setDoc(dataDocRef, newData, { merge: true });
            console.log("updateFinanceData: Datos financieros actualizados con éxito en Firestore.");
            
            const updatedYearsSet = new Set(availableYears);
            for (const yearKey in newData) {
                if (yearKey.match(/^\d{4}$/)) {
                    if (Object.keys(newData[yearKey] || {}).length > 0) {
                        updatedYearsSet.add(parseInt(yearKey));
                    }
                }
            }
            if (!isNaN(parseInt(currentYearFromDashboard))) { // Asegurarse de que el año no sea NaN
                updatedYearsSet.add(parseInt(currentYearFromDashboard));
            }
            
            setAvailableYears(Array.from(updatedYearsSet).sort((a, b) => a - b));

            return true;
        } catch (err) {
            console.error("updateFinanceData: Error al actualizar datos financieros en Firestore:", err);
            setErrorData("Fallo al actualizar datos financieros en la nube.");
            if (previousFinanceData) {
                setFinanceData(previousFinanceData);
                console.log("updateFinanceData: Rollback de estado local debido a fallo de Firestore.");
            }
            return false;
        }
    };

    // Función para actualizar la configuración
    const updateConfig = async (newConfig) => {
        if (!currentUser) {
            console.warn("updateConfig: No hay usuario autenticado. No se puede actualizar.");
            return false;
        }
        let previousUserConfig = null;
        setUserConfig(prevConfig => {
            previousUserConfig = prevConfig;
            const updatedConfig = deepMerge(prevConfig || {}, newConfig || {}); // Usar deepMerge
            console.log("updateConfig: Estado local actualizado optimísticamente (config).", updatedConfig);
            return updatedConfig;
        });

        try {
            const configDocRef = doc(db, 'users', `${currentUser.uid}_config`);
            console.log("updateConfig: Enviando a Firestore:", JSON.stringify(newConfig));
            await setDoc(configDocRef, newConfig, { merge: true });
            console.log("Configuración de usuario actualizada con éxito.");
            return true;
        } catch (err) {
            console.error("Error al actualizar la configuración de usuario:", err);
            setErrorData("Fallo al actualizar la configuración de usuario.");
            if (previousUserConfig) {
                setUserConfig(previousUserConfig);
                console.log("updateConfig: Rollback de estado local debido a fallo de Firestore.");
            }
            return false;
        }
    };

    const annualSummary = useMemo(() => {
        if (!financeData || !userConfig || !userConfig.categories) {
            return {
                totalActualIncome: 0,
                totalActualExpenses: 0,
                annualBalance: 0,
                currentNetWorth: 0,
                totalPortfolioValue: 0,
                currentCashBalance: 0,
            };
        }

        const categories = userConfig.categories;
        const annualData = financeData[currentYearFromDashboard] || {}; 
        const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

        const getAllSubcategories = (mainCategoryKey) => {
            const cat = categories[mainCategoryKey];
            if (cat === undefined) return [];
            if (Array.isArray(cat)) { 
                return cat;
            } else if (typeof cat === 'object') {
                const order = userConfig[`${mainCategoryKey}GroupOrder`] || Object.keys(cat);
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

        let totalActualIncome = 0;
        let totalActualExpenses = 0;

        months.forEach(monthName => {
            const monthTransactions = annualData.monthly?.[monthName] || {};
            
            const incomeSubcategories = getAllSubcategories('Ingresos');
            incomeSubcategories.forEach(subCat => {
                const total = (monthTransactions[subCat]?.actual || []).reduce((sum, t) => sum + t.amount, 0);
                totalActualIncome += total;
            });

            const expenseMainCategoriesKeys = Object.keys(categories || {}).filter(key =>
                !['Ingresos', 'Activos', 'Pasivos'].includes(key)
            );
            expenseMainCategoriesKeys.forEach(mainCatKey => {
                const subcatsInMainCat = getAllSubcategories(mainCatKey);
                subcatsInMainCat.forEach(subCat => {
                    const total = (monthTransactions[subCat]?.actual || []).reduce((sum, t) => sum + t.amount, 0);
                    totalActualExpenses += total;
                });
            });
        });

        const annualBalance = totalActualIncome - totalActualExpenses;

        const netWorthData = annualData.netWorth || { assets: {}, liabilities: {} };
        const totalAssets = Object.values(netWorthData.assets || {}).reduce((sum, val) => {
            if (typeof val === 'number') return sum + val;
            if (typeof val === 'object' && val !== null) { 
                const monthValues = Object.values(val);
                return sum + (monthValues[monthValues.length - 1] || 0);
            }
            return sum;
        }, 0);
        const totalLiabilities = Object.values(netWorthData.liabilities || {}).reduce((sum, val) => {
            if (typeof val === 'number') return sum + val;
            if (typeof val === 'object' && val !== null) { 
                const monthValues = Object.values(val);
                return sum + (monthValues[monthValues.length - 1] || 0);
            }
            return sum;
        }, 0);
        const currentNetWorth = totalAssets - totalLiabilities;

        const totalPortfolioValue = financeData.portfolio?.assets?.reduce((sum, asset) => sum + (asset.currentValue || 0), 0);
        
        let currentCashBalance = 0;
        const cashCategories = ['Efectivo', 'Cuentas Corrientes', 'Cuentas Ahorro'];
        const latestMonthWithCashData = months.slice().reverse().find(monthName => 
            cashCategories.some(subCat => netWorthData?.Activos?.[subCat]?.[monthName] !== undefined)
        );

        if (latestMonthWithCashData) {
          cashCategories.forEach(subCat => {
            currentCashBalance += netWorthData?.Activos?.[subCat]?.[latestMonthWithCashData] || 0;
          });
        }


        return {
            totalActualIncome,
            totalActualExpenses,
            annualBalance,
            currentNetWorth,
            totalPortfolioValue,
            totalCashBalance: currentCashBalance
        };
    }, [financeData, userConfig, currentYearFromDashboard]);

    return {
        financeData,
        userConfig,
        loadingData,
        errorData,
        updateFinanceData,
        updateConfig,
        getMonthName,
        annualSummary,
        availableYears
    };
};

export default useFinanceData;