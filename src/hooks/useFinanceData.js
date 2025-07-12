import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc, setDoc, getDocs, collection, addDoc, updateDoc, deleteDoc, deleteField } from 'firebase/firestore';
import { db } from '../firebase';

// --- HELPERS ---
const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

const getMonthName = (monthIndex) => {
    return MONTHS[monthIndex];
};

const calculateAmortizationSchedule = (principal, annualInterestRate, termInMonths, startDate, prepayments = {}) => {
    const schedule = [];
    if (!principal || !termInMonths || !startDate || principal <= 0 || termInMonths <= 0) {
        return schedule; // Return empty schedule for invalid inputs
    }

    const monthlyInterestRate = annualInterestRate > 0 ? annualInterestRate / 100 / 12 : 0;
    
    // Calculate the initial fixed monthly payment based on original terms
    let fixedMonthlyPayment = monthlyInterestRate > 0
        ? principal * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, termInMonths)) / (Math.pow(1 + monthlyInterestRate, termInMonths) - 1)
        : principal / termInMonths;

    let remainingBalance = principal;
    let accumulatedPrincipalPaid = 0;
    
    const [startYear, startMonth] = startDate.split('-').map(Number);
    
    for (let i = 0; i < termInMonths; i++) { // Loop for the full term, balance check inside
        const currentMonthAbsolute = (startMonth - 1) + i;
        const currentYear = startYear + Math.floor(currentMonthAbsolute / 12);
        const currentMonth = currentMonthAbsolute % 12; // 0-indexed month
        const currentMonthKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;

        // If remaining balance is effectively zero, stop
        if (remainingBalance <= 0.01) {
            break; 
        }

        // Apply prepayment for the current month BEFORE calculating interest
        if (prepayments[currentMonthKey]) {
            remainingBalance -= prepayments[currentMonthKey];
            remainingBalance = Math.max(0, remainingBalance); // Ensure non-negative after prepayment
        }
        
        // If balance became zero or negative after prepayment, stop here
        if (remainingBalance <= 0.01) {
            // Add a final entry if the loan was paid off early by prepayment
            if (schedule.length > 0 && schedule[schedule.length - 1].remainingBalance > 0.01) {
                 schedule.push({
                    month: i + 1,
                    year: currentYear,
                    monthName: getMonthName(currentMonth),
                    monthYear: new Date(currentYear, currentMonth).toLocaleString('es-ES', { month: 'long', year: 'numeric' }),
                    payment: 0, // No payment needed
                    interestPaid: 0,
                    principalPaid: 0,
                    accumulatedPrincipalPaid: parseFloat(principal.toFixed(2)), // Fully paid
                    remainingBalance: 0
                });
            }
            break;
        }

        const interestPaid = remainingBalance * monthlyInterestRate;
        let principalPaid = fixedMonthlyPayment - interestPaid; // Use the initial fixed payment for this calculation

        // Adjust principal payment for the last period to clear the loan
        if (remainingBalance < principalPaid) {
            principalPaid = remainingBalance;
        }

        let currentPeriodPayment = interestPaid + principalPaid; // Actual payment for this specific period

        remainingBalance -= principalPaid;
        accumulatedPrincipalPaid += principalPaid; // Accumulate principal paid

        schedule.push({
            month: i + 1, // Installment number
            year: currentYear,
            monthName: getMonthName(currentMonth),
            monthYear: new Date(currentYear, currentMonth).toLocaleString('es-ES', { month: 'long', year: 'numeric' }),
            payment: parseFloat(currentPeriodPayment.toFixed(2)), // This is the actual payment for THIS period
            interestPaid: parseFloat(interestPaid.toFixed(2)),
            principalPaid: parseFloat(principalPaid.toFixed(2)),
            accumulatedPrincipalPaid: parseFloat(accumulatedPrincipalPaid.toFixed(2)),
            remainingBalance: parseFloat(Math.max(0, remainingBalance).toFixed(2)) // Ensure non-negative
        });
    }
    return schedule;
};


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


const useFinanceData = (currentYearFromDashboard) => {
    const { currentUser } = useAuth();
    const [financeData, setFinanceData] = useState(null);
    const [userConfig, setUserConfig] = useState(null);
    const [loans, setLoans] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorData, setErrorData] = useState(null);
    const [availableYears, setAvailableYears] = useState([]);
    const [currentYear, setCurrentYearState] = useState(() => currentYearFromDashboard || new Date().getFullYear().toString());

    useEffect(() => {
        if (currentYearFromDashboard && currentYearFromDashboard !== currentYear) {
            setCurrentYearState(currentYearFromDashboard);
        }
    }, [currentYearFromDashboard, currentYear]);

    const fetchFinanceData = useCallback(async () => {
        if (!currentUser) { setLoadingData(false); return; }
        setLoadingData(true);
        setErrorData(null);
        try {
            const userDocRef = doc(db, 'users', currentUser.uid);
            const configDocRef = doc(userDocRef, 'data', 'config');
            const financeDataDocRef = doc(userDocRef, 'data', 'finance');
            const loansCollectionRef = collection(userDocRef, 'loans');

            const [configSnap, financeDataSnap, loansSnap] = await Promise.all([
                getDoc(configDocRef),
                getDoc(financeDataDocRef),
                getDocs(loansCollectionRef)
            ]);

            let fetchedConfig = configSnap.exists() ? configSnap.data() : { categories: {}, categoryDisplayNames: {}, ActivosGroupOrder: [], PasivosGroupOrder: [], brokers: [] };
            let fetchedFinanceData = financeDataSnap.exists() ? financeDataSnap.data() : {};
            
            let configChanged = false;

            if (!fetchedConfig.categories) fetchedConfig.categories = {};
            if (!fetchedConfig.categories.Pasivos) fetchedConfig.categories.Pasivos = {};
            if (!fetchedConfig.categories.PagoDeDeudas) fetchedConfig.categories.PagoDeDeudas = [];
            if (!fetchedConfig.categories.Activos) fetchedConfig.categories.Activos = {};
            
            if (!fetchedConfig.categories.Pasivos['Deudas']) {
                fetchedConfig.categories.Pasivos['Deudas'] = [];
            }
            if (fetchedConfig.categories.Pasivos['Deudas de Préstamos']) {
                const existingDeudas = new Set(fetchedConfig.categories.Pasivos['Deudas']);
                fetchedConfig.categories.Pasivos['Deudas'] = Array.from(new Set([...existingDeudas, ...fetchedConfig.categories.Pasivos['Deudas de Préstamos']]));
                delete fetchedConfig.categories.Pasivos['Deudas de Préstamos'];
                configChanged = true;
            }

            if (!fetchedConfig.PasivosGroupOrder) {
                fetchedConfig.PasivosGroupOrder = ['Deudas'];
                configChanged = true;
            } else if (!fetchedConfig.PasivosGroupOrder.includes('Deudas')) {
                fetchedConfig.PasivosGroupOrder = fetchedConfig.PasivosGroupOrder.filter(group => group !== 'Deudas de Préstamos');
                fetchedConfig.PasivosGroupOrder = ['Deudas', ...fetchedConfig.PasivosGroupOrder];
                configChanged = true;
            } else if (fetchedConfig.PasivosGroupOrder.includes('Deudas de Préstamos')) {
                fetchedConfig.PasivosGroupOrder = fetchedConfig.PasivosGroupOrder.filter(group => group !== 'Deudas de Préstamos');
                configChanged = true;
            }
            
            if (!fetchedConfig.brokers) {
                fetchedConfig.brokers = [];
            }

            const processedLoans = loansSnap.docs.map(doc => {
                const data = doc.data();
                // Ensure initialPrincipal is available for schedule calculation
                const principalForSchedule = data.initialPrincipal || data.principal; 
                const schedule = calculateAmortizationSchedule(principalForSchedule, data.annualInterestRate, data.termInMonths, data.startDate, data.prepayments);
                return { id: doc.id, ...data, schedule };
            });
            setLoans(processedLoans);

            let optimisticUserConfig = JSON.parse(JSON.stringify(fetchedConfig));
            let optimisticFinanceData = JSON.parse(JSON.stringify(fetchedFinanceData));

            const updatePromises = [];
            
            const currentLoanNames = new Set(processedLoans.map(loan => loan.loanName));

            const yearsInFinanceData = Object.keys(optimisticFinanceData).filter(key => /^\d{4}$/.test(key));

            // --- Clean up old loan-related data from financeData and userConfig before regenerating ---
            if (optimisticUserConfig.categories.Pasivos?.['Deudas']) {
                const filteredDeudas = optimisticUserConfig.categories.Pasivos['Deudas'].filter(subCat => 
                    currentLoanNames.has(subCat) || !processedLoans.some(loan => loan.loanName === subCat) 
                );
                if (filteredDeudas.length !== optimisticUserConfig.categories.Pasivos['Deudas'].length) {
                    optimisticUserConfig.categories.Pasivos['Deudas'] = filteredDeudas;
                    configChanged = true;
                }
            }

            if (optimisticUserConfig.categories.PagoDeDeudas) {
                const filteredPagoDeDeudas = optimisticUserConfig.categories.PagoDeDeudas.filter(subCat => currentLoanNames.has(subCat));
                if (filteredPagoDeDeudas.length !== optimisticUserConfig.categories.PagoDeDeudas.length) {
                    optimisticUserConfig.categories.PagoDeDeudas = filteredPagoDeDeudas;
                    configChanged = true;
                }
            }
            
            yearsInFinanceData.forEach(yearStr => {
                if (optimisticFinanceData[yearStr]?.budget) {
                    Object.keys(optimisticFinanceData[yearStr].budget).forEach(subCat => {
                        if (processedLoans.some(loan => loan.loanName === subCat)) {
                            optimisticFinanceData[yearStr].budget[subCat] = 0; 
                        }
                    });
                }
            });

            yearsInFinanceData.forEach(yearStr => {
                if (optimisticFinanceData[yearStr]?.netWorth?.Pasivos) {
                    const existingPasivosSubcats = Object.keys(optimisticFinanceData[yearStr].netWorth.Pasivos);
                    
                    existingPasivosSubcats.forEach(subCat => {
                        if (!currentLoanNames.has(subCat) && processedLoans.some(loan => loan.loanName === subCat)) {
                             delete optimisticFinanceData[yearStr].netWorth.Pasivos[subCat];
                        } else if (currentLoanNames.has(subCat)) {
                            MONTHS.forEach(month => {
                                if (optimisticFinanceData[yearStr].netWorth.Pasivos[subCat][month] !== undefined) {
                                    delete optimisticFinanceData[yearStr].netWorth.Pasivos[subCat][month];
                                }
                            });
                        }
                    });
                }
            });


            // --- Regenerate data for active loans ---
            processedLoans.forEach(loan => {
                const subcategoryName = loan.loanName;
                
                if (!optimisticUserConfig.categories.Pasivos['Deudas'].includes(subcategoryName)) { 
                    optimisticUserConfig.categories.Pasivos['Deudas'].push(subcategoryName); 
                    configChanged = true;
                }
                if (!optimisticUserConfig.categories.PagoDeDeudas.includes(subcategoryName)) {
                    optimisticUserConfig.categories.PagoDeDeudas.push(subcategoryName);
                    configChanged = true;
                }

                if (loan.schedule && loan.schedule.length > 0) {
                    // Use the payment from the first entry of the schedule for the budget, as it reflects the initial fixed payment.
                    const fixedMonthlyPayment = loan.schedule[0]?.payment || 0; 

                    loan.schedule.forEach(entry => {
                        const { year, monthName, remainingBalance } = entry;
                        const yearStr = year.toString();

                        if (!optimisticFinanceData[yearStr]) { optimisticFinanceData[yearStr] = {}; }
                        if (!optimisticFinanceData[yearStr].netWorth) { optimisticFinanceData[yearStr].netWorth = {}; }
                        if (!optimisticFinanceData[yearStr].netWorth.Pasivos) { optimisticFinanceData[yearStr].netWorth.Pasivos = {}; }
                        if (!optimisticFinanceData[yearStr].netWorth.Pasivos[subcategoryName]) { optimisticFinanceData[yearStr].netWorth.Pasivos[subcategoryName] = {}; }
                        optimisticFinanceData[yearStr].netWorth.Pasivos[subcategoryName][monthName] = remainingBalance;

                        if (!optimisticFinanceData[yearStr].budget) { optimisticFinanceData[yearStr].budget = {}; }
                        optimisticFinanceData[yearStr].budget[subcategoryName] = fixedMonthlyPayment;
                    });
                }
            });

            if (configChanged) {
                updatePromises.push(setDoc(configDocRef, optimisticUserConfig, { merge: true }));
            }
            updatePromises.push(setDoc(financeDataDocRef, optimisticFinanceData, { merge: true }));

            await Promise.all(updatePromises);

            setUserConfig(optimisticUserConfig);
            setFinanceData(optimisticFinanceData);


            const yearsWithData = new Set(Object.keys(optimisticFinanceData).filter(key => /^\d{4}$/.test(key)).map(Number));
            yearsWithData.add(new Date().getFullYear());
            setAvailableYears(Array.from(yearsWithData).sort((a, b) => a - b));

        } catch (err) {
            console.error("Error al cargar datos financieros:", err);
            setErrorData("Fallo al cargar datos financieros.");
        } finally {
            setLoadingData(false);
        }
    }, [currentUser]);

    const updateFinanceData = useCallback(async (updates, isUserConfig = false) => {
        if (!currentUser) {
            setErrorData("Usuario no autenticado.");
            return false;
        }

        const docRef = isUserConfig ? doc(db, 'users', currentUser.uid, 'data', 'config') : doc(db, 'users', currentUser.uid, 'data', 'finance');
        const currentLocalData = isUserConfig ? userConfig : financeData;
        const setLocalState = isUserConfig ? setUserConfig : setFinanceData;

        const previousData = JSON.parse(JSON.stringify(currentLocalData));

        const newData = deepMerge(currentLocalData || {}, updates);
        setLocalState(newData);

        try {
            await setDoc(docRef, updates, { merge: true });
            console.log(`Datos ${isUserConfig ? 'de configuración' : 'financieros'} actualizados en Firestore.`);
            return true;
        } catch (e) {
            console.error(`Error al actualizar datos ${isUserConfig ? 'de configuración' : 'financieros'}:`, e);
            setErrorData(`Fallo al actualizar datos: ${e.message}`);
            setLocalState(previousData);
            alert(`Error al guardar: ${e.message}. Se ha revertido el cambio.`);
            return false;
        }
    }, [currentUser, financeData, userConfig]);


    const deleteFinanceDataField = useCallback(async (fieldPath) => {
        if (!currentUser) return false;
        const previousFinanceData = JSON.parse(JSON.stringify(financeData));
        
        const tempUpdatedData = deepMerge(financeData, {});
        let target = tempUpdatedData;
        const pathParts = fieldPath.split('.');
        const lastField = pathParts[pathParts.length - 1];

        for (let i = 0; i < pathParts.length - 1; i++) {
            if (target && target[pathParts[i]] !== undefined) {
                target = target[pathParts[i]];
            } else {
                target = null;
                break;
            }
        }
        if (target && target[lastField] !== undefined) {
            delete target[lastField];
            setFinanceData(tempUpdatedData);
        }

        try {
            const financeDataDocRef = doc(db, 'users', currentUser.uid, 'data', 'finance');
            const updateObject = {};
            updateObject[fieldPath] = deleteField();
            await updateDoc(financeDataDocRef, updateObject);
            return true;
        } catch (err) {
            console.error("Error al eliminar campo de datos financieros:", err);
            setFinanceData(previousFinanceData);
            return false;
        }
    }, [currentUser, financeData]);

    const deleteUserConfigField = useCallback(async (fieldPath) => {
        if (!currentUser) return false;
        const previousUserConfig = JSON.parse(JSON.stringify(userConfig));

        const tempUpdatedConfig = deepMerge(userConfig, {});
        let target = tempUpdatedConfig;
        const pathParts = fieldPath.split('.');
        const lastField = pathParts[pathParts.length - 1];

        for (let i = 0; i < pathParts.length - 1; i++) {
            if (target && target[pathParts[i]] !== undefined) {
                target = target[pathParts[i]];
            } else {
                target = null;
                break;
            }
        }

        if (target) {
            if (Array.isArray(target)) {
                const index = parseInt(lastField, 10);
                if (!isNaN(index) && index >= 0 && index < target.length) {
                    target.splice(index, 1);
                }
            } else {
                delete target[lastField];
            }
            setUserConfig(tempUpdatedConfig);
        }

        try {
            const configDocRef = doc(db, 'users', currentUser.uid, 'data', 'config');
            const updateObject = {};
            updateObject[fieldPath] = deleteField();
            await updateDoc(configDocRef, updateObject);
            return true;
        } catch (err) {
            console.error("Error al eliminar campo de configuración de usuario:", err);
            setUserConfig(previousUserConfig);
            return false;
        }
    }, [currentUser, userConfig]);


    const addLoan = useCallback(async (loanData) => {
        if (!currentUser) return false;
        setIsSubmitting(true);
        
        const tempLoanId = 'temp-' + Date.now();
        const loanDataWithPrincipal = { ...loanData, initialPrincipal: loanData.principal || loanData.initialPrincipal }; 

        const schedule = calculateAmortizationSchedule(
            loanDataWithPrincipal.initialPrincipal,
            loanDataWithPrincipal.annualInterestRate,
            loanDataWithPrincipal.termInMonths,
            loanDataWithPrincipal.startDate,
            loanDataWithPrincipal.prepayments || {}
        );
        
        const tempLoan = { ...loanDataWithPrincipal, id: tempLoanId, schedule: schedule };
        
        setLoans(prevLoans => [...prevLoans, tempLoan]);

        const previousFinanceData = JSON.parse(JSON.stringify(financeData));
        const previousUserConfig = JSON.parse(JSON.stringify(userConfig));

        let optimisticUserConfig = userConfig ? deepMerge({}, userConfig) : { categories: {}, categoryDisplayNames: {}, ActivosGroupOrder: [], PasivosGroupOrder: ['Deudas'], brokers: [] };
        let optimisticFinanceData = financeData ? deepMerge({}, financeData) : {};

        const subcategoryName = loanData.loanName;

        if (!optimisticUserConfig.categories.Pasivos) {
            optimisticUserConfig.categories.Pasivos = {};
        }
        if (!optimisticUserConfig.categories.Pasivos['Deudas']) { 
            optimisticUserConfig.categories.Pasivos['Deudas'] = []; 
        }
        if (!optimisticUserConfig.categories.Pasivos['Deudas'].includes(subcategoryName)) { 
            optimisticUserConfig.categories.Pasivos['Deudas'].push(subcategoryName); 
        }
        
        if (!optimisticUserConfig.PasivosGroupOrder.includes('Deudas')) { 
            optimisticUserConfig.PasivosGroupOrder = ['Deudas', ...(optimisticUserConfig.PasivosGroupOrder || []).filter(group => group !== 'Deudas de Préstamos')]; 
        } else {
             optimisticUserConfig.PasivosGroupOrder = (optimisticUserConfig.PasivosGroupOrder || []).filter(group => group !== 'Deudas de Préstamos');
        }

        if (!optimisticUserConfig.categories.PagoDeDeudas) {
            optimisticUserConfig.categories.PagoDeDeudas = [];
        }
        if (!optimisticUserConfig.categories.PagoDeDeudas.includes(subcategoryName)) {
            optimisticUserConfig.categories.PagoDeDeudas.push(subcategoryName);
        }
        
        setUserConfig(optimisticUserConfig);

        const fixedMonthlyPayment = schedule[0]?.payment || 0;
        const startLoanYear = new Date(loanData.startDate).getFullYear();
        const endLoanYear = new Date(startLoanYear, new Date(loanData.startDate).getMonth() + loanData.termInMonths - 1).getFullYear();
        
        for (let year = startLoanYear; year <= endLoanYear; year++) {
            const yearStr = year.toString();
            optimisticFinanceData[yearStr] = optimisticFinanceData[yearStr] || {};
            optimisticFinanceData[yearStr].budget = optimisticFinanceData[yearStr].budget || {};
            optimisticFinanceData[yearStr].netWorth = optimisticFinanceData[yearStr].netWorth || {};
            optimisticFinanceData[yearStr].netWorth.Pasivos = optimisticFinanceData[yearStr].netWorth.Pasivos || {};
            
            optimisticFinanceData[yearStr].budget[subcategoryName] = fixedMonthlyPayment;
        }

        schedule.forEach(entry => {
            const { year, monthName, remainingBalance } = entry;
            const yearStr = year.toString();
            optimisticFinanceData[yearStr].netWorth.Pasivos[subcategoryName] = optimisticFinanceData[yearStr].netWorth.Pasivos[subcategoryName] || {};
            optimisticFinanceData[yearStr].netWorth.Pasivos[subcategoryName][monthName] = remainingBalance;
        });

        setFinanceData(optimisticFinanceData);

        try {
            const loansCollectionRef = collection(db, 'users', currentUser.uid, 'loans');
            const docRef = await addDoc(loansCollectionRef, { ...loanDataWithPrincipal, userId: currentUser.uid, prepayments: {} });

            setLoans(prevLoans => prevLoans.map(loan => 
                loan.id === tempLoanId ? { ...loan, id: docRef.id } : loan
            ));

            const configDocRef = doc(db, 'users', currentUser.uid, 'data', 'config');
            await setDoc(configDocRef, optimisticUserConfig, { merge: true });

            const financeDataDocRef = doc(db, 'users', currentUser.uid, 'data', 'finance');
            await setDoc(financeDataDocRef, optimisticFinanceData, { merge: true });

            return true;
        } catch (err) {
            console.error("Error al añadir el préstamo y actualizar categorías/presupuesto:", err);
            setLoans(previousLoans);
            setUserConfig(previousUserConfig);
            setFinanceData(previousFinanceData);
            setErrorData(`Fallo al añadir el préstamo: ${err.message}`);
            return false;
        } finally {
            setIsSubmitting(false);
        }
    }, [currentUser, userConfig, financeData]);


    const updateLoan = useCallback(async (loanId, dataToUpdate) => {
        if (!currentUser) return false;
        setIsSubmitting(true);

        const oldLoan = loans.find(l => l.id === loanId);
        if (!oldLoan) {
            setIsSubmitting(false);
            return false;
        }

        const oldSubcategoryName = oldLoan.loanName;
        const newSubcategoryName = dataToUpdate.loanName || oldSubcategoryName;

        const previousLoans = JSON.parse(JSON.stringify(loans));
        const previousFinanceData = JSON.parse(JSON.stringify(financeData));
        const previousUserConfig = JSON.parse(JSON.stringify(userConfig));
        
        const effectiveLoanData = {
            initialPrincipal: dataToUpdate.initialPrincipal !== undefined ? dataToUpdate.initialPrincipal : oldLoan.initialPrincipal,
            annualInterestRate: dataToUpdate.annualInterestRate !== undefined ? dataToUpdate.annualInterestRate : oldLoan.annualInterestRate,
            termInMonths: dataToUpdate.termInMonths !== undefined ? dataToUpdate.termInMonths : oldLoan.termInMonths,
            startDate: dataToUpdate.startDate || oldLoan.startDate,
            prepayments: dataToUpdate.prepayments || oldLoan.prepayments || {}
        };

        const newSchedule = calculateAmortizationSchedule(
            effectiveLoanData.initialPrincipal,
            effectiveLoanData.annualInterestRate,
            effectiveLoanData.termInMonths,
            effectiveLoanData.startDate,
            effectiveLoanData.prepayments
        );
        
        setLoans(prevLoans => prevLoans.map(loan => 
            loan.id === loanId ? { ...loan, ...dataToUpdate, schedule: newSchedule } : loan
        ));

        let optimisticUserConfig = deepMerge({}, userConfig || { categories: {}, categoryDisplayNames: {}, ActivosGroupOrder: [], PasivosGroupOrder: ['Deudas'], brokers: [] });
        let optimisticFinanceData = deepMerge({}, financeData || {});

        let configChanged = false;

        const allYearsAffected = new Set();
        if (oldLoan?.schedule) oldLoan.schedule.forEach(entry => allYearsAffected.add(entry.year.toString()));
        newSchedule.forEach(entry => allYearsAffected.add(entry.year.toString()));

        if (oldSubcategoryName !== newSubcategoryName) {
            if (optimisticUserConfig.categories.Pasivos?.['Deudas de Préstamos']) {
                optimisticUserConfig.categories.Pasivos['Deudas de Préstamos'] = 
                    optimisticUserConfig.categories.Pasivos['Deudas de Préstamos'].filter(name => name !== oldSubcategoryName);
                configChanged = true;
            }
            if (optimisticUserConfig.categories.Pasivos?.['Deudas']) { 
                const index = optimisticUserConfig.categories.Pasivos['Deudas'].indexOf(oldSubcategoryName); 
                if (index !== -1) {
                    optimisticUserConfig.categories.Pasivos['Deudas'][index] = newSubcategoryName; 
                    configChanged = true;
                }
            }
            if (optimisticUserConfig.categories.PagoDeDeudas) {
                const index = optimisticUserConfig.categories.PagoDeDeudas.indexOf(oldSubcategoryName);
                if (index !== -1) {
                    optimisticUserConfig.categories.PagoDeDeudas[index] = newSubcategoryName;
                    configChanged = true;
                }
            }

            allYearsAffected.forEach(yearStr => {
                if (optimisticFinanceData[yearStr]?.netWorth?.Pasivos?.[oldSubcategoryName]) {
                    delete optimisticFinanceData[yearStr].netWorth.Pasivos[oldSubcategoryName];
                }
                if (optimisticFinanceData[yearStr]?.budget?.[oldSubcategoryName]) {
                    delete optimisticFinanceData[yearStr].budget[oldSubcategoryName];
                }
            });
        } else {
            allYearsAffected.forEach(yearStr => {
                if (optimisticFinanceData[yearStr]?.budget?.[newSubcategoryName] !== undefined) {
                    optimisticFinanceData[yearStr].budget[newSubcategoryName] = 0; 
                }
                if (optimisticFinanceData[yearStr]?.netWorth?.Pasivos?.[newSubcategoryName]) {
                    MONTHS.forEach(month => {
                        if (optimisticFinanceData[yearStr].netWorth.Pasivos[newSubcategoryName][month] !== undefined) {
                           delete optimisticFinanceData[yearStr].netWorth.Pasivos[newSubcategoryName][month];
                        }
                    });
                }
            });
        }

        if (!optimisticUserConfig.categories.Pasivos?.['Deudas'].includes(newSubcategoryName)) { 
            optimisticUserConfig.categories.Pasivos['Deudas'].push(newSubcategoryName); 
            configChanged = true;
        }
        if (!optimisticUserConfig.categories.PagoDeDeudas?.includes(newSubcategoryName)) {
            optimisticUserConfig.categories.PagoDeDeudas.push(newSubcategoryName);
            configChanged = true;
        }

        const fixedMonthlyPayment = newSchedule[0]?.payment || 0;

        newSchedule.forEach(entry => {
            const { year, monthName, remainingBalance } = entry;
            const yearStr = year.toString();

            optimisticFinanceData[yearStr] = optimisticFinanceData[yearStr] || {};
            optimisticFinanceData[yearStr].netWorth = optimisticFinanceData[yearStr].netWorth || {};
            optimisticFinanceData[yearStr].netWorth.Pasivos = optimisticFinanceData[yearStr].netWorth.Pasivos || {};
            optimisticFinanceData[yearStr].budget = optimisticFinanceData[yearStr].budget || {};

            optimisticFinanceData[yearStr].netWorth.Pasivos[newSubcategoryName] = optimisticFinanceData[yearStr].netWorth.Pasivos[newSubcategoryName] || {};
            optimisticFinanceData[yearStr].netWorth.Pasivos[newSubcategoryName][monthName] = remainingBalance;
            optimisticFinanceData[yearStr].budget[newSubcategoryName] = fixedMonthlyPayment;
        });

        setUserConfig(optimisticUserConfig);
        setFinanceData(optimisticFinanceData);

        try {
            const loanDocRef = doc(db, 'users', currentUser.uid, 'loans', loanId);
            const finalDataToUpdate = { ...dataToUpdate };
            
            if (dataToUpdate.startDate && oldLoan.startDate && dataToUpdate.startDate > oldLoan.startDate) {
                const originalPrepayments = oldLoan.prepayments || {};
                const newPrepaymentsFiltered = {};
                for (const dateKey in originalPrepayments) {
                    if (dateKey >= dataToUpdate.startDate) {
                        newPrepaymentsFiltered[dateKey] = originalPrepayments[dateKey];
                    }
                }
                finalDataToUpdate.prepayments = newPrepaymentsFiltered;
            } else if (dataToUpdate.prepayments === undefined && oldLoan.prepayments) {
                finalDataToUpdate.prepayments = oldLoan.prepayments;
            }

            await updateDoc(loanDocRef, finalDataToUpdate);

            if (configChanged) {
                const configDocRef = doc(db, 'users', currentUser.uid, 'data', 'config');
                await setDoc(configDocRef, optimisticUserConfig, { merge: true });
            }

            const financeDataDocRef = doc(db, 'users', currentUser.uid, 'data', 'finance');
            await setDoc(financeDataDocRef, optimisticFinanceData, { merge: true });

            return true;
        } catch (err) {
            console.error("Error al actualizar el préstamo y categorías/presupuesto:", err);
            setLoans(previousLoans);
            setUserConfig(previousUserConfig);
            setFinanceData(previousFinanceData);
            setErrorData(`Fallo al actualizar el préstamo: ${err.message}`);
            return false;
        } finally {
            setIsSubmitting(false);
        }
    }, [currentUser, loans, userConfig, financeData]);


    const deleteLoan = useCallback(async (loanId) => {
        if (!currentUser) return false;
        setIsSubmitting(true);

        const loanToDelete = loans.find(l => l.id === loanId);
        if (!loanToDelete) {
            setIsSubmitting(false);
            return false;
        }
        const subcategoryName = loanToDelete.loanName;

        const previousLoans = JSON.parse(JSON.stringify(loans));
        const previousFinanceData = JSON.parse(JSON.stringify(financeData));
        const previousUserConfig = JSON.parse(JSON.stringify(userConfig));

        setLoans(prevLoans => prevLoans.filter(loan => loan.id !== loanId));

        let optimisticUserConfig = deepMerge({}, userConfig || { categories: {}, PasivosGroupOrder: ['Deudas'] });
        let optimisticFinanceData = deepMerge({}, financeData || {});

        if (optimisticUserConfig.categories.Pasivos?.['Deudas']) { 
            optimisticUserConfig.categories.Pasivos['Deudas'] = 
                optimisticUserConfig.categories.Pasivos['Deudas'].filter(name => name !== subcategoryName); 
        }
        if (optimisticUserConfig.categories.Pasivos?.['Deudas de Préstamos']) {
            optimisticUserConfig.categories.Pasivos['Deudas de Préstamos'] = 
                optimisticUserConfig.categories.Pasivos['Deudas de Préstamos'].filter(name => name !== subcategoryName);
        }

        if (optimisticUserConfig.categories.PagoDeDeudas) {
            optimisticUserConfig.categories.PagoDeDeudas = 
                optimisticUserConfig.categories.PagoDeDeudas.filter(name => name !== subcategoryName);
        }
        setUserConfig(optimisticUserConfig);

        const yearsAffectedByLoan = new Set();
        if (loanToDelete.schedule) {
            loanToDelete.schedule.forEach(entry => yearsAffectedByLoan.add(entry.year.toString()));
        }

        yearsAffectedByLoan.forEach(yearStr => {
            if (optimisticFinanceData[yearStr]?.netWorth?.Pasivos?.[subcategoryName]) {
                delete optimisticFinanceData[yearStr].netWorth.Pasivos[subcategoryName];
            }
            if (optimisticFinanceData[yearStr]?.budget?.[subcategoryName]) {
                delete optimisticFinanceData[yearStr].budget[subcategoryName];
            }
        });
        setFinanceData(optimisticFinanceData);

        try {
            const loanDocRef = doc(db, 'users', currentUser.uid, 'loans', loanId);
            await deleteDoc(loanDocRef);

            const configDocRef = doc(db, 'users', currentUser.uid, 'data', 'config');
            await setDoc(configDocRef, optimisticUserConfig, { merge: true });

            const financeDataDocRef = doc(db, 'users', currentUser.uid, 'data', 'finance');
            await setDoc(financeDataDocRef, optimisticFinanceData, { merge: true });

            return true;
        } catch (err) {
            console.error("Error al eliminar el préstamo y sus datos asociados:", err);
            setLoans(previousLoans);
            setUserConfig(previousUserConfig);
            setFinanceData(previousFinanceData);
            setErrorData(`Fallo al eliminar el préstamo: ${err.message}`);
            return false;
        } finally {
            setIsSubmitting(false);
        }
    }, [currentUser, loans, userConfig, financeData]);

    const addPrepayment = useCallback(async (loanId, date, amount) => {
        if (!currentUser) return false;
        setIsSubmitting(true);
        const previousLoans = JSON.parse(JSON.stringify(loans));

        try {
            const updatedLoans = loans.map(loan => {
                if (loan.id === loanId) {
                    const newPrepayments = { ...loan.prepayments, [date]: amount };
                    const currentPrincipalForCalc = loan.initialPrincipal || loan.principal; 
                    const newSchedule = calculateAmortizationSchedule(
                        currentPrincipalForCalc,
                        loan.annualInterestRate,
                        loan.termInMonths,
                        loan.startDate,
                        newPrepayments
                    );
                    return { ...loan, prepayments: newPrepayments, schedule: newSchedule };
                }
                return loan;
            });
            setLoans(updatedLoans);

            const loanDocRef = doc(db, 'users', currentUser.uid, 'loans', loanId);
            await updateDoc(loanDocRef, { [`prepayments.${date}`]: amount });

            await fetchFinanceData(); 

            return true;
        } catch (err) {
            console.error("Error al añadir/editar el pago anticipado:", err);
            setLoans(previousLoans);
            setErrorData(`Fallo al añadir/editar el pago anticipado: ${err.message}`);
            return false;
        } finally {
            setIsSubmitting(false);
        }
    }, [currentUser, loans, fetchFinanceData]);

    const removePrepayment = useCallback(async (loanId, dateKey) => {
        if (!currentUser) return false;
        setIsSubmitting(true);
        const previousLoans = JSON.parse(JSON.stringify(loans));

        try {
            const updatedLoans = loans.map(loan => {
                if (loan.id === loanId) {
                    const newPrepayments = { ...loan.prepayments };
                    delete newPrepayments[dateKey];
                    const currentPrincipalForCalc = loan.initialPrincipal || loan.principal; 
                    const newSchedule = calculateAmortizationSchedule(
                        currentPrincipalForCalc,
                        loan.annualInterestRate,
                        loan.termInMonths,
                        loan.startDate,
                        newPrepayments
                    );
                    return { ...loan, prepayments: newPrepayments, schedule: newSchedule };
                }
                return loan;
            });
            setLoans(updatedLoans);

            const loanDocRef = doc(db, 'users', currentUser.uid, 'loans', loanId);
            await updateDoc(loanDocRef, { [`prepayments.${dateKey}`]: deleteField() });

            await fetchFinanceData(); 
            return true;
        } catch (err) {
            console.error("Error al eliminar el pago anticipado:", err);
            setLoans(previousLoans);
            setErrorData(`Fallo al eliminar el pago anticipado: ${err.message}`);
            return false;
        } finally {
            setIsSubmitting(false);
        }
    }, [currentUser, loans, fetchFinanceData]);

    useEffect(() => {
        fetchFinanceData();
    }, [fetchFinanceData]);

    const annualSummary = useMemo(() => {
        const currentFinanceData = financeData || {};
        const currentUserConfig = userConfig || { categories: {} };

        const incomeCategories = currentUserConfig.categories?.['Ingresos'] || [];
        const expenseCategoriesKeys = Object.keys(currentUserConfig.categories).filter(key =>
            !['Ingresos', 'Activos', 'Pasivos'].includes(key)
        );

        let totalActualIncome = 0;
        let totalActualExpenses = 0;
        let totalCashBalance = 0; 

        const currentYearData = currentFinanceData[currentYear] || {};
        const currentMonthIndex = new Date().getMonth();
        const currentMonthName = getMonthName(currentMonthIndex);

        for (let i = 0; i < 12; i++) {
            const monthName = getMonthName(i);
            const monthData = currentYearData.monthly?.[monthName] || {};

            incomeCategories.forEach(subCat => {
                totalActualIncome += (monthData[subCat]?.actual || []).reduce((sum, t) => sum + t.amount, 0);
            });

            expenseCategoriesKeys.forEach(mainCatKey => {
                const subcatsInMainCat = Array.isArray(currentUserConfig.categories[mainCatKey])
                    ? currentUserConfig.categories[mainCatKey]
                    : Object.values(currentUserConfig.categories[mainCatKey] || {}).flat();

                subcatsInMainCat.forEach(subCat => {
                    totalActualExpenses += (monthData[subCat]?.actual || []).reduce((sum, t) => sum + t.amount, 0);
                });
            });
        }

        let currentNetWorth = 0;
        let currentAssets = 0;
        let currentLiabilities = 0;

        const currentNetWorthData = currentYearData.netWorth || {};

        const activosGroups = currentUserConfig.ActivosGroupOrder?.length > 0 ? currentUserConfig.ActivosGroupOrder : (currentUserConfig.categories.Activos ? Object.keys(currentUserConfig.categories.Activos) : []);
        activosGroups.forEach(groupName => {
            const subcategories = currentUserConfig.categories.Activos?.[groupName] || [];
            subcategories.forEach(subCat => {
                currentAssets += currentNetWorthData.Activos?.[subCat]?.[currentMonthName] || 0;
            });
        });

        const pasivosGroups = currentUserConfig.PasivosGroupOrder?.length > 0 ? currentUserConfig.PasivosGroupOrder : (currentUserConfig.categories.Pasivos ? Object.keys(currentUserConfig.categories.Pasivos) : []);
        pasivosGroups.forEach(groupName => {
            const subcategories = currentUserConfig.categories.Pasivos?.[groupName] || [];
            subcategories.forEach(subCat => {
                currentLiabilities += currentNetWorthData.Pasivos?.[subCat]?.[currentMonthName] || 0;
            });
        });

        currentNetWorth = currentAssets - currentLiabilities;

        if (currentUserConfig.categories.Activos?.['Cuentas Bancarias']) {
            currentUserConfig.categories.Activos['Cuentas Bancarias'].forEach(subCat => {
                totalCashBalance += currentNetWorthData.Activos?.[subCat]?.[currentMonthName] || 0;
            });
        }

        return {
            totalActualIncome,
            totalActualExpenses,
            annualBalance: totalActualIncome - totalActualExpenses,
            currentNetWorth,
            totalPortfolioValue: 0, 
            totalCashBalance 
        };
    }, [financeData, userConfig, currentYear]);

    return {
        financeData, userConfig, loans, loadingData, isSubmitting, errorData, availableYears,
        updateFinanceData, deleteFinanceDataField,
        updateConfig: (newConfig) => updateFinanceData(newConfig, true),
        deleteUserConfigField,
        addLoan, updateLoan, deleteLoan,
        addPrepayment, removePrepayment, getMonthName, annualSummary,
        currentYear, setCurrentYear: setCurrentYearState
    };
};

export default useFinanceData;