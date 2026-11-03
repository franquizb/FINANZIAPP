import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { app as textosApp } from '../i18n/app';
import { publico as textosPublico } from '../i18n/publico';
import { calculadoras as textosCalculadoras } from '../i18n/calculadoras';

const AppContext = createContext();

// Idiomas disponibles y su configuración regional para fechas y moneda.
export const IDIOMAS = ['es', 'en', 'de'];
export const LOCALES = { es: 'es-ES', en: 'en-GB', de: 'de-DE' };

// Los meses se guardan en los datos con su nombre en español (son claves del
// modelo); aquí solo se traduce cómo se muestran.
export const MESES_CLAVE = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const MESES = {
    es: MESES_CLAVE,
    en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    de: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"]
};

export const translations = {
    es: {
        appName: 'FinanziApp',
        dashboard: 'Dashboard',
        monthly: 'Seguimiento Mensual',
        networth: 'Patrimonio Neto',
        loans: 'Préstamos',
        settings: 'Configuración',
        signOut: 'Cerrar Sesión',
        loading: 'Cargando...',
        initiating: 'Iniciando datos...',
        noData: 'No hay datos para',
        "Ingresos": 'Ingresos',
        "Gastos Esenciales": 'Gastos Esenciales',
        "Gastos Discrecionales": 'Gastos Discrecionales',
        "Pago de Deudas": 'Pago de Deudas',
        "Ahorro e Inversión": 'Ahorro e Inversión',
        "Activos": 'Activos',
        "Pasivos": 'Pasivos',
        income: 'Ingresos',
        expenses: 'Gastos',
        savings: 'Ahorro / Déficit',
        totalYear: 'Total Año',
        monthlyIncome: 'Ingresos vs. Gastos Mensuales',
        expenseDist: 'Distribución de Gastos',
        budgetVsActual: 'Presupuesto vs. Real',
        annualSummary: 'Resumen Anual por Categoría',
        totalGeneral: 'Total General',
        totalReal: 'Total Real',
        category: 'Categoría',
        monthlyAmount: 'Cantidad Mensual',
        monthlyBudget: 'Presupuesto Mensual',
        remainder: 'Remanente',
        budgetSummary: 'Resumen Presupuesto',
        concept: 'Concepto',
        budget: 'Presupuesto',
        percentage: 'Porcentaje',
        addTransaction: 'Añadir Transacción',
        mainCategory: 'Categoría Principal',
        subCategory: 'Subcategoría',
        date: 'Fecha',
        amount: 'Valor',
        add: 'Añadir',
        transactions: 'Transacciones',
        noTransactions: 'No hay transacciones para este mes.',
        actions: 'Acciones',
        netWorthEvolution: 'Evolución del Patrimonio Neto',
        assets: 'Activos',
        liabilities: 'Pasivos',
        netWorth: 'Patrimonio Neto',
        generalSettings: 'Configuración General',
        defaultYear: 'Año por Defecto',
        categoryManager: 'Gestor de Categorías',
        addSubcategory: 'Añadir Subcategoría en',
        newSubcategoryName: 'Nombre de la nueva subcategoría',
        cancel: 'Cancelar',
        confirmDelete: 'Confirmar Eliminación',
        deleteWarning: '¡Atención! Esto eliminará permanentemente todos los datos asociados.',
        delete: 'Eliminar',
        addMainCategory: 'Añadir Nueva Categoría Principal',
        createMainCategory: 'Crear Categoría Principal',
        language: 'Idioma',
        theme: 'Tema',
        darkMode: 'Modo Oscuro',
        lightMode: 'Modo Claro',
        charts: 'Gráficos',
        budgetMode: 'Presupuesto',
        year: 'Año',
        month: 'Mes',
        collapseMenu: 'Colapsar Menú',
        expandMenu: 'Expandir Menú',
        incomeSummary: 'Resumen de Ingresos',
        expenseSummary: 'Resumen de Gastos',
        budgeted: 'Presupuestado',
        real: 'Real',
        difference: 'Diferencia',
        essentialExpenses: 'Gastos Esenciales',
        discretionaryExpenses: 'Gastos Discrecionales',
        debtPayments: 'Pago de Deudas',
        savingsInvestment: 'Ahorro e Inversión',
        essentialPlusDiscretionary: 'Esenciales + Discrecionales',
        savingsTotal: 'Total Ahorro e Inversión',
        oneTimeExpenses: 'Gastos Puntuales',
        addOneTime: 'Añadir Gasto Puntual',
        loanManagement: 'Gestión de Préstamos e Hipotecas',
        loanName: 'Nombre del Préstamo',
        loanTotal: 'Importe del Préstamo',
        installments: 'Número de Cuotas',
        installment: 'Cuota Mensual',
        startDate: 'Fecha Inicio',
        endDate: 'Fecha Fin',
        remaining: 'Restante',
        calendar: 'Calendario de Pagos',
        interestRate: 'Tipo de Interés (%)',
        interest: 'Intereses',
        principal: 'Amortización Capital',
        totalAmortized: 'Capital Amortizado',
        pendingCapital: 'Capital Pendiente',
        paymentNo: 'Nº Cuota',
        active: 'Activo',
        finished: 'Finalizado',
        budgetLock: 'Bloquear Presupuesto',
        budgetUnlock: 'Habilitar Edición',
        loanLocked: 'Préstamos (editar en pestaña Préstamos)',
        noLoans: 'No hay préstamos configurados.',
        totalOwed: 'Total Pendiente',
        totalIncome: 'Ingresos Totales',
        totalExpenses: 'Gastos Totales',
        savingsRate: 'tasa de ahorro',
        ofIncome: 'del ingreso',
        monthlyAvg: 'mes avg',
        loanProgress: 'Progreso de Préstamos',
        netWorthSummary: 'Resumen Patrimonio',
        tradingSummary: 'Resumen Trading',
        winRate: 'Win Rate',
        totalPnL: 'P&L Total',
        totalTrades: 'Operaciones',
        annual: 'Anual',
        monthlyLabel: 'Mensual',
        projectionDetail: 'Detalle de la Proyección',
        accInterest: 'Intereses Acum.',
        monthInterestLabel: 'Interés Mes',
        contribution: 'Contribución',
        totalBalance: 'Balance Total',
        investedCapital: 'Capital Invertido',
        initialStart: 'Inicio',
        zoomPrompt: 'Arrastra la barra inferior para hacer zoom en un período específico'
    },
    en: {
        appName: 'FinanziApp',
        dashboard: 'Dashboard',
        monthly: 'Monthly Tracker',
        networth: 'Net Worth',
        loans: 'Loans',
        settings: 'Settings',
        signOut: 'Sign Out',
        loading: 'Loading...',
        initiating: 'Initializing data...',
        noData: 'No data for',
        "Ingresos": 'Income',
        "Gastos Esenciales": 'Essential Expenses',
        "Gastos Discrecionales": 'Discretionary Expenses',
        "Pago de Deudas": 'Debt Payments',
        "Ahorro e Inversión": 'Savings & Investments',
        "Activos": 'Assets',
        "Pasivos": 'Liabilities',
        income: 'Income',
        expenses: 'Expenses',
        savings: 'Savings / Deficit',
        totalYear: 'Total Year',
        monthlyIncome: 'Income vs. Monthly Expenses',
        expenseDist: 'Expense Distribution',
        budgetVsActual: 'Budget vs. Actual',
        annualSummary: 'Annual Summary by Category',
        totalGeneral: 'Grand Total',
        totalReal: 'Total Actual',
        category: 'Category',
        monthlyAmount: 'Monthly Amount',
        monthlyBudget: 'Monthly Budget',
        remainder: 'Remainder',
        budgetSummary: 'Budget Summary',
        concept: 'Concept',
        budget: 'Budget',
        percentage: 'Percentage',
        addTransaction: 'Add Transaction',
        mainCategory: 'Main Category',
        subCategory: 'Subcategory',
        date: 'Date',
        amount: 'Amount',
        add: 'Add',
        transactions: 'Transactions',
        noTransactions: 'No transactions for this month.',
        actions: 'Actions',
        netWorthEvolution: 'Net Worth Evolution',
        assets: 'Assets',
        liabilities: 'Liabilities',
        netWorth: 'Net Worth',
        generalSettings: 'General Settings',
        defaultYear: 'Default Year',
        categoryManager: 'Category Manager',
        addSubcategory: 'Add Subcategory in',
        newSubcategoryName: 'New subcategory name',
        cancel: 'Cancel',
        confirmDelete: 'Confirm Deletion',
        deleteWarning: 'Warning! This will permanently delete all associated data.',
        delete: 'Delete',
        addMainCategory: 'Add New Main Category',
        createMainCategory: 'Create Main Category',
        language: 'Language',
        theme: 'Theme',
        darkMode: 'Dark Mode',
        lightMode: 'Light Mode',
        charts: 'Charts',
        budgetMode: 'Budget',
        year: 'Year',
        month: 'Month',
        collapseMenu: 'Collapse Menu',
        expandMenu: 'Expand Menu',
        incomeSummary: 'Income Summary',
        expenseSummary: 'Expense Summary',
        budgeted: 'Budgeted',
        real: 'Actual',
        difference: 'Difference',
        essentialExpenses: 'Essential Expenses',
        discretionaryExpenses: 'Discretionary Expenses',
        debtPayments: 'Debt Payments',
        savingsInvestment: 'Savings & Investment',
        essentialPlusDiscretionary: 'Essential + Discretionary',
        savingsTotal: 'Total Savings & Investment',
        oneTimeExpenses: 'One-time Expenses',
        addOneTime: 'Add One-time Expense',
        loanManagement: 'Loans & Mortgages Management',
        loanName: 'Loan Name',
        loanTotal: 'Total Amount',
        installments: 'Installments',
        installment: 'Installment',
        interestRate: 'Interest Rate (%)',
        interest: 'Interest',
        principal: 'Principal',
        totalAmortized: 'Total Amortized',
        pendingCapital: 'Remaining Balance',
        paymentNo: 'No.',
        startDate: 'Start Date',
        endDate: 'End Date',
        remaining: 'Remaining',
        calendar: 'Amortization Table',
        active: 'Active',
        finished: 'Finished',
        budgetLock: 'Lock Budget',
        budgetUnlock: 'Enable Editing',
        loanLocked: 'Loans (edit in Loans tab)',
        noLoans: 'No loans configured.',
        totalOwed: 'Total Owed',
        totalIncome: 'Total Income',
        totalExpenses: 'Total Expenses',
        savingsRate: 'savings rate',
        ofIncome: 'of income',
        monthlyAvg: 'month avg',
        loanProgress: 'Loan Progress',
        netWorthSummary: 'Net Worth Summary',
        tradingSummary: 'Trading Summary',
        winRate: 'Win Rate',
        totalPnL: 'Total P&L',
        totalTrades: 'Trades',
        annual: 'Annual',
        monthlyLabel: 'Monthly',
        projectionDetail: 'Projection Detail',
        accInterest: 'Acc. Interest',
        monthInterestLabel: 'Month Interest',
        contribution: 'Contribution',
        totalBalance: 'Total Balance',
        investedCapital: 'Invested Capital',
        initialStart: 'Initial',
        zoomPrompt: 'Drag the bottom bar to zoom in on a specific period'
    },
    de: {
        appName: 'FinanziApp',
        dashboard: 'Dashboard',
        monthly: 'Monatliche Verfolgung',
        networth: 'Nettovermögen',
        loans: 'Kredite',
        settings: 'Einstellungen',
        signOut: 'Abmelden',
        loading: 'Laden...',
        initiating: 'Daten werden initialisiert...',
        noData: 'Keine Daten für',
        "Ingresos": 'Einkommen',
        "Gastos Esenciales": 'Wesentliche Ausgaben',
        "Gastos Discrecionales": 'Freiwillige Ausgaben',
        "Pago de Deudas": 'Schuldentilgung',
        "Ahorro e Inversión": 'Sparen & Investition',
        "Activos": 'Vermögenswerte',
        "Pasivos": 'Verbindlichkeiten',
        income: 'Einkommen',
        expenses: 'Ausgaben',
        savings: 'Ersparnisse / Defizit',
        totalYear: 'Gesamtjahr',
        monthlyIncome: 'Einkommen vs. Monatliche Ausgaben',
        expenseDist: 'Ausgabenverteilung',
        budgetVsActual: 'Budget vs. Tatsächlich',
        annualSummary: 'Jahreszusammenfassung nach Kategorie',
        totalGeneral: 'Gesamtsumme',
        totalReal: 'Tatsächliche Summe',
        category: 'Kategorie',
        monthlyAmount: 'Monatlicher Betrag',
        monthlyBudget: 'Monatsbudget',
        remainder: 'Restbetrag',
        budgetSummary: 'Budgetübersicht',
        concept: 'Konzept',
        budget: 'Budget',
        percentage: 'Prozentsatz',
        addTransaction: 'Transaktion hinzufügen',
        mainCategory: 'Hauptkategorie',
        subCategory: 'Unterkategorie',
        date: 'Datum',
        amount: 'Betrag',
        add: 'Hinzufügen',
        transactions: 'Transaktionen',
        noTransactions: 'Keine Transaktionen für diesen Monat.',
        actions: 'Aktionen',
        netWorthEvolution: 'Nettovermögensentwicklung',
        assets: 'Vermögenswerte',
        liabilities: 'Verbindlichkeiten',
        netWorth: 'Nettovermögen',
        generalSettings: 'Allgemeine Einstellungen',
        defaultYear: 'Standardjahr',
        categoryManager: 'Kategorieverwaltung',
        addSubcategory: 'Unterkategorie hinzufügen in',
        newSubcategoryName: 'Name der neuen Unterkategorie',
        cancel: 'Abbrechen',
        confirmDelete: 'Löschen bestätigen',
        deleteWarning: 'Achtung! Dadurch werden alle zugehörigen Daten dauerhaft gelöscht.',
        delete: 'Löschen',
        addMainCategory: 'Neue Hauptkategorie hinzufügen',
        createMainCategory: 'Hauptkategorie erstellen',
        language: 'Sprache',
        theme: 'Thema',
        darkMode: 'Dunkler Modus',
        lightMode: 'Heller Modus',
        charts: 'Diagramme',
        budgetMode: 'Budget',
        year: 'Jahr',
        month: 'Monat',
        collapseMenu: 'Menü einklappen',
        expandMenu: 'Menü ausklappen',
        incomeSummary: 'Einkommensübersicht',
        expenseSummary: 'Ausgabenübersicht',
        budgeted: 'Budgetiert',
        real: 'Tatsächlich',
        difference: 'Differenz',
        essentialExpenses: 'Wesentliche Ausgaben',
        discretionaryExpenses: 'Freiwillige Ausgaben',
        debtPayments: 'Schuldentilgung',
        savingsInvestment: 'Sparen & Investition',
        essentialPlusDiscretionary: 'Wesentlich + Freiwillig',
        savingsTotal: 'Gesamtersparnisse & Investitionen',
        oneTimeExpenses: 'Einmalige Ausgaben',
        addOneTime: 'Einmalige Ausgabe hinzufügen',
        loanManagement: 'Kredit- & Hypothekenverwaltung',
        loanName: 'Kreditname',
        loanTotal: 'Gesamtbetrag',
        installments: 'Raten',
        installment: 'Rate',
        interestRate: 'Zinssatz (%)',
        interest: 'Zinsen',
        principal: 'Tilgung',
        totalAmortized: 'Gesamttilgung',
        pendingCapital: 'Restschuld',
        paymentNo: 'Nr.',
        startDate: 'Startdatum',
        endDate: 'Enddatum',
        remaining: 'Verbleibend',
        calendar: 'Tilgungsplan',
        active: 'Aktiv',
        finished: 'Abgeschlossen',
        budgetLock: 'Budget sperren',
        budgetUnlock: 'Bearbeitung aktivieren',
        loanLocked: 'Kredite (im Reiter Kredite bearbeiten)',
        noLoans: 'Keine Kredite konfiguriert.',
        totalOwed: 'Gesamtschulden',
        totalIncome: 'Gesamteinkommen',
        totalExpenses: 'Gesamtausgaben',
        savingsRate: 'Sparquote',
        ofIncome: 'des Einkommens',
        monthlyAvg: 'Monat Ø',
        loanProgress: 'Kreditfortschritt',
        netWorthSummary: 'Vermögensübersicht',
        tradingSummary: 'Trading-Übersicht',
        winRate: 'Gewinnrate',
        totalPnL: 'Gesamt-P&L',
        totalTrades: 'Trades',
        annual: 'Jährlich',
        monthlyLabel: 'Monatlich',
        projectionDetail: 'Projektionsdetails',
        accInterest: 'Aufgelaufene Zinsen',
        monthInterestLabel: 'Monatszinsen',
        contribution: 'Beitrag',
        totalBalance: 'Gesamtbalance',
        investedCapital: 'Investiertes Kapital',
        initialStart: 'Anfang',
        zoomPrompt: 'Ziehen Sie den unteren Balken, um einen bestimmten Zeitraum heranzuzoomen'
    }
};

// Diccionario completo de un idioma: textos base + pantallas de la app +
// pantallas públicas (landing, login, tutorial).
const diccionario = (lang) => ({ ...translations[lang], ...(textosApp[lang] || {}), ...(textosPublico[lang] || {}), ...(textosCalculadoras[lang] || {}) });
const DICCIONARIOS = Object.fromEntries(IDIOMAS.map(l => [l, diccionario(l)]));

// Cualquier clave que falte en un idioma cae al español (el texto original) y,
// si tampoco existe, se muestra la propia clave: así nunca aparece "undefined".
const conFallback = (lang) => new Proxy(DICCIONARIOS[lang], {
    get: (obj, k) => (typeof k === 'string' && obj[k] !== undefined) ? obj[k] : (DICCIONARIOS.es[k] !== undefined ? DICCIONARIOS.es[k] : (typeof k === 'string' ? k : undefined))
});
const TEXTOS = Object.fromEntries(IDIOMAS.map(l => [l, conFallback(l)]));

// Idioma inicial: el elegido por el usuario y, si nunca eligió, el del navegador
// (si está entre los disponibles); en último caso, español.
const detectarIdioma = () => {
    try {
        const guardado = localStorage.getItem('appLanguage');
        if (guardado && IDIOMAS.includes(guardado)) return guardado;
    } catch { /* sin localStorage */ }
    const candidatos = (typeof navigator !== 'undefined' && (navigator.languages?.length ? navigator.languages : [navigator.language])) || [];
    for (const c of candidatos) {
        const codigo = String(c || '').slice(0, 2).toLowerCase();
        if (IDIOMAS.includes(codigo)) return codigo;
    }
    return 'es';
};

// Idioma y configuración regional activos, para las funciones que viven fuera
// de los componentes (fmt, nombres de mes en los gráficos, avisos de los
// helpers del modelo). Se actualizan de forma síncrona al cambiar de idioma,
// antes del re-render, para que ese mismo render ya los use.
let idiomaActual = detectarIdioma();
let localeActual = LOCALES[idiomaActual];
export const getLocale = () => localeActual;
export const getIdioma = () => idiomaActual;

// Texto con variables: tf('clave', { n: 3 }) sustituye {n} en el texto.
const interpolar = (texto, vars) => String(texto).replace(/\{(\w+)\}/g, (_, k) => (vars && vars[k] !== undefined) ? vars[k] : '');

// Texto traducido fuera de un componente (mismo fallback que `t`).
export const tx = (clave, vars) => interpolar((TEXTOS[idiomaActual] || TEXTOS.es)[clave], vars);
// Nombre de mes (completo o de 3 letras) a partir de su clave en español, en el idioma activo.
export const nombreMes = (clave) => { const i = MESES_CLAVE.indexOf(clave); return i === -1 ? String(clave) : (MESES[idiomaActual] || MESES.es)[i]; };
export const nombreMesCorto = (clave) => nombreMes(clave).slice(0, 3);

export function AppProvider({ children }) {
    const [theme, setTheme] = useState(() => localStorage.getItem('appTheme') || 'dark');
    const [language, setLanguage] = useState(detectarIdioma);

    useEffect(() => {
        localStorage.setItem('appTheme', theme);
        document.documentElement.classList.toggle('dark', theme === 'dark');
        document.documentElement.classList.toggle('light', theme === 'light');
    }, [theme]);

    useEffect(() => {
        document.documentElement.lang = language;
    }, [language]);

    // Solo se guarda cuando el usuario elige un idioma a mano; así, mientras no
    // lo haga, la app sigue al idioma del navegador.
    const setLanguageTo = (lang) => {
        if (!IDIOMAS.includes(lang)) return;
        try { localStorage.setItem('appLanguage', lang); } catch { /* sin localStorage */ }
        idiomaActual = lang;
        localeActual = LOCALES[lang];
        setLanguage(lang);
    };
    const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    const toggleLanguage = () => setLanguageTo(language === 'es' ? 'en' : language === 'en' ? 'de' : 'es');

    const value = useMemo(() => {
        const t = TEXTOS[language] || TEXTOS.es;
        const nombres = MESES[language] || MESES.es;
        return {
            theme, toggleTheme, language, toggleLanguage, setLanguageTo, t,
            locale: LOCALES[language] || LOCALES.es,
            tf: (clave, vars) => interpolar(t[clave], vars),
            // Nombre del mes a partir de su clave en español ("enero" → "January").
            mes: (clave) => { const i = MESES_CLAVE.indexOf(clave); return i === -1 ? clave : nombres[i]; },
            mesCorto: (clave) => { const i = MESES_CLAVE.indexOf(clave); return (i === -1 ? String(clave) : nombres[i]).slice(0, 3); }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [theme, language]);

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    return useContext(AppContext);
}
