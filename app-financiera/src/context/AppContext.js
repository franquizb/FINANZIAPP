import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { app as textosApp } from '../i18n/app';
import { publico as textosPublico } from '../i18n/publico';
import { calculadoras as textosCalculadoras } from '../i18n/calculadoras';
import { suscripcion as textosSuscripcion } from '../i18n/suscripcion';
import { comunidad as textosComunidad } from '../i18n/comunidad';

const AppContext = createContext();

// Idiomas disponibles y su configuración regional para fechas y moneda.
export const IDIOMAS = ['es', 'en', 'de', 'fr', 'zh'];
// Chino: simplificado (zh-CN); un navegador en chino tradicional (zh-TW, zh-HK)
// también recibe esta versión, con las fechas en su propia variante.
export const LOCALES = { es: 'es-ES', en: 'en-US', de: 'de-DE', fr: 'fr-FR', zh: 'zh-CN' };
// Nombre de cada idioma en su propio idioma, para los selectores.
export const NOMBRES_IDIOMA = { es: 'Español', en: 'English', de: 'Deutsch', fr: 'Français', zh: '中文' };
// Configuración regional para fechas y números: la variante del navegador si
// coincide con el idioma (en-GB, es-MX, de-AT…), y si no la de LOCALES. Así un
// estadounidense ve "$1,234.50" y 12/18/2026, y un británico "£1,234.50" y 18/12/2026.
export const localeDe = (lang) => {
    const candidatos = (typeof navigator !== 'undefined' && (navigator.languages?.length ? navigator.languages : [navigator.language])) || [];
    const propio = candidatos.find(c => String(c || '').toLowerCase().startsWith(lang + '-'));
    if (propio) { try { return Intl.getCanonicalLocales(propio)[0]; } catch { /* etiqueta no válida */ } }
    return LOCALES[lang] || LOCALES.es;
};

// Los meses se guardan en los datos con su nombre en español (son claves del
// modelo); aquí solo se traduce cómo se muestran.
export const MESES_CLAVE = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const MESES = {
    es: MESES_CLAVE,
    en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    de: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
    fr: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
    zh: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
};
// Abreviaturas donde las tres primeras letras no sirven (en francés «juin» y
// «juillet» darían las dos «jui»; en chino el nombre ya es corto).
const MESES_CORTOS = {
    fr: ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."],
    zh: MESES.zh
};
const mesCortoDe = (lang, i) => (MESES_CORTOS[lang] ? MESES_CORTOS[lang][i] : (MESES[lang] || MESES.es)[i].slice(0, 3));

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
    },
    fr: {
        appName: "FinanziApp",
        dashboard: "Tableau de bord",
        monthly: "Suivi mensuel",
        networth: "Patrimoine net",
        loans: "Prêts",
        settings: "Paramètres",
        signOut: "Se déconnecter",
        loading: "Chargement...",
        initiating: "Initialisation des données...",
        noData: "Aucune donnée pour",
        Ingresos: "Revenus",
        "Gastos Esenciales": "Dépenses essentielles",
        "Gastos Discrecionales": "Dépenses discrétionnaires",
        "Pago de Deudas": "Remboursement de dettes",
        "Ahorro e Inversión": "Épargne et investissement",
        Activos: "Actifs",
        Pasivos: "Passifs",
        income: "Revenus",
        expenses: "Dépenses",
        savings: "Épargne / Déficit",
        totalYear: "Total annuel",
        monthlyIncome: "Revenus vs dépenses mensuelles",
        expenseDist: "Répartition des dépenses",
        budgetVsActual: "Budget vs réel",
        annualSummary: "Résumé annuel par catégorie",
        totalGeneral: "Total général",
        totalReal: "Total réel",
        category: "Catégorie",
        monthlyAmount: "Montant mensuel",
        monthlyBudget: "Budget mensuel",
        remainder: "Reste",
        budgetSummary: "Résumé du budget",
        concept: "Libellé",
        budget: "Budget",
        percentage: "Pourcentage",
        addTransaction: "Ajouter une transaction",
        mainCategory: "Catégorie principale",
        subCategory: "Sous-catégorie",
        date: "Date",
        amount: "Montant",
        add: "Ajouter",
        transactions: "Transactions",
        noTransactions: "Aucune transaction ce mois-ci.",
        actions: "Actions",
        netWorthEvolution: "Évolution du patrimoine net",
        assets: "Actifs",
        liabilities: "Passifs",
        netWorth: "Patrimoine net",
        generalSettings: "Paramètres généraux",
        defaultYear: "Année par défaut",
        categoryManager: "Gestion des catégories",
        addSubcategory: "Ajouter une sous-catégorie dans",
        newSubcategoryName: "Nom de la nouvelle sous-catégorie",
        cancel: "Annuler",
        confirmDelete: "Confirmer la suppression",
        deleteWarning: "Attention ! Cela supprimera définitivement toutes les données associées.",
        delete: "Supprimer",
        addMainCategory: "Ajouter une catégorie principale",
        createMainCategory: "Créer la catégorie principale",
        language: "Langue",
        theme: "Thème",
        darkMode: "Mode sombre",
        lightMode: "Mode clair",
        charts: "Graphiques",
        budgetMode: "Budget",
        year: "Année",
        month: "Mois",
        collapseMenu: "Réduire le menu",
        expandMenu: "Développer le menu",
        incomeSummary: "Résumé des revenus",
        expenseSummary: "Résumé des dépenses",
        budgeted: "Budgété",
        real: "Réel",
        difference: "Écart",
        essentialExpenses: "Dépenses essentielles",
        discretionaryExpenses: "Dépenses discrétionnaires",
        debtPayments: "Remboursement de dettes",
        savingsInvestment: "Épargne et investissement",
        essentialPlusDiscretionary: "Essentielles + discrétionnaires",
        savingsTotal: "Total épargne et investissement",
        oneTimeExpenses: "Dépenses ponctuelles",
        addOneTime: "Ajouter une dépense ponctuelle",
        loanManagement: "Gestion des prêts et crédits immobiliers",
        loanName: "Nom du prêt",
        loanTotal: "Montant total",
        installments: "Nombre d'échéances",
        installment: "Mensualité",
        startDate: "Date de début",
        endDate: "Date de fin",
        remaining: "Restant",
        calendar: "Tableau d'amortissement",
        interestRate: "Taux d'intérêt (%)",
        interest: "Intérêts",
        principal: "Amortissement",
        totalAmortized: "Total amorti",
        pendingCapital: "Capital restant dû",
        paymentNo: "N°",
        active: "En cours",
        finished: "Terminé",
        budgetLock: "Verrouiller le budget",
        budgetUnlock: "Autoriser la modification",
        loanLocked: "Prêts (à modifier dans l'onglet Prêts)",
        noLoans: "Aucun prêt configuré.",
        totalOwed: "Total dû",
        totalIncome: "Revenus totaux",
        totalExpenses: "Dépenses totales",
        savingsRate: "taux d'épargne",
        ofIncome: "des revenus",
        monthlyAvg: "mois (moy.)",
        loanProgress: "Progression des prêts",
        netWorthSummary: "Résumé du patrimoine",
        tradingSummary: "Résumé du trading",
        winRate: "Taux de réussite",
        totalPnL: "P&L total",
        totalTrades: "Opérations",
        annual: "Annuel",
        monthlyLabel: "Mensuel",
        projectionDetail: "Détail de la projection",
        accInterest: "Intérêts cumulés",
        monthInterestLabel: "Intérêts du mois",
        contribution: "Versement",
        totalBalance: "Solde total",
        investedCapital: "Capital investi",
        initialStart: "Début",
        zoomPrompt: "Faites glisser la barre du bas pour zoomer sur une période précise"
    },
    zh: {
        appName: "FinanziApp",
        dashboard: "仪表盘",
        monthly: "每月跟踪",
        networth: "净资产",
        loans: "贷款",
        settings: "设置",
        signOut: "退出登录",
        loading: "加载中…",
        initiating: "正在初始化数据…",
        noData: "暂无数据",
        Ingresos: "收入",
        "Gastos Esenciales": "必要支出",
        "Gastos Discrecionales": "可选支出",
        "Pago de Deudas": "偿还债务",
        "Ahorro e Inversión": "储蓄与投资",
        Activos: "资产",
        Pasivos: "负债",
        income: "收入",
        expenses: "支出",
        savings: "结余/赤字",
        totalYear: "全年合计",
        monthlyIncome: "每月收入与支出对比",
        expenseDist: "支出分布",
        budgetVsActual: "预算与实际对比",
        annualSummary: "按类别年度汇总",
        totalGeneral: "总计",
        totalReal: "实际合计",
        category: "类别",
        monthlyAmount: "每月金额",
        monthlyBudget: "每月预算",
        remainder: "剩余",
        budgetSummary: "预算汇总",
        concept: "项目",
        budget: "预算",
        percentage: "百分比",
        addTransaction: "添加收支记录",
        mainCategory: "主类别",
        subCategory: "子类别",
        date: "日期",
        amount: "金额",
        add: "添加",
        transactions: "收支记录",
        noTransactions: "本月暂无收支记录。",
        actions: "操作",
        netWorthEvolution: "净资产走势",
        assets: "资产",
        liabilities: "负债",
        netWorth: "净资产",
        generalSettings: "常规设置",
        defaultYear: "默认年份",
        categoryManager: "类别管理",
        addSubcategory: "添加子类别至",
        newSubcategoryName: "新子类别名称",
        cancel: "取消",
        confirmDelete: "确认删除",
        deleteWarning: "注意！此操作将永久删除所有相关数据。",
        delete: "删除",
        addMainCategory: "添加新的主类别",
        createMainCategory: "创建主类别",
        language: "语言",
        theme: "主题",
        darkMode: "深色模式",
        lightMode: "浅色模式",
        charts: "图表",
        budgetMode: "预算",
        year: "年份",
        month: "月份",
        collapseMenu: "收起菜单",
        expandMenu: "展开菜单",
        incomeSummary: "收入汇总",
        expenseSummary: "支出汇总",
        budgeted: "预算",
        real: "实际",
        difference: "差额",
        essentialExpenses: "必要支出",
        discretionaryExpenses: "可选支出",
        debtPayments: "偿还债务",
        savingsInvestment: "储蓄与投资",
        essentialPlusDiscretionary: "必要+可选",
        savingsTotal: "储蓄与投资合计",
        oneTimeExpenses: "一次性支出",
        addOneTime: "添加一次性支出",
        loanManagement: "贷款与房贷管理",
        loanName: "贷款名称",
        loanTotal: "贷款总额",
        installments: "期数",
        installment: "月供",
        startDate: "开始日期",
        endDate: "结束日期",
        remaining: "剩余",
        calendar: "还款计划表",
        interestRate: "利率（%）",
        interest: "利息",
        principal: "本金",
        totalAmortized: "已还本金",
        pendingCapital: "剩余本金",
        paymentNo: "期次",
        active: "进行中",
        finished: "已结清",
        budgetLock: "锁定预算",
        budgetUnlock: "启用编辑",
        loanLocked: "贷款（请在“贷款”标签页中编辑）",
        noLoans: "尚未设置贷款。",
        totalOwed: "待还总额",
        totalIncome: "总收入",
        totalExpenses: "总支出",
        savingsRate: "储蓄率",
        ofIncome: "的收入",
        monthlyAvg: "月均",
        loanProgress: "贷款进度",
        netWorthSummary: "净资产概览",
        tradingSummary: "交易概览",
        winRate: "胜率",
        totalPnL: "总P&L",
        totalTrades: "交易笔数",
        annual: "年度",
        monthlyLabel: "每月",
        projectionDetail: "预测明细",
        accInterest: "累计利息",
        monthInterestLabel: "当月利息",
        contribution: "投入",
        totalBalance: "总余额",
        investedCapital: "投入本金",
        initialStart: "初始",
        zoomPrompt: "拖动底部滑块，可放大查看特定时段"
    }
};

// Diccionario completo de un idioma: textos base + pantallas de la app +
// pantallas públicas (landing, login, tutorial).
const diccionario = (lang) => ({ ...translations[lang], ...(textosApp[lang] || {}), ...(textosPublico[lang] || {}), ...(textosCalculadoras[lang] || {}), ...(textosSuscripcion[lang] || {}), ...(textosComunidad[lang] || {}) });
const DICCIONARIOS = Object.fromEntries(IDIOMAS.map(l => [l, diccionario(l)]));

// Cualquier clave que falte en un idioma cae al inglés (en francés, chino o
// alemán) o al español (el texto original) y, si tampoco existe, se muestra la
// propia clave: así nunca aparece "undefined".
// El marcador global {moneda} (símbolo de la moneda activa) se sustituye al leer el texto.
const conFallback = (lang) => new Proxy(DICCIONARIOS[lang], {
    get: (obj, k) => {
        const reserva = lang === 'es' ? undefined : DICCIONARIOS.en[k];
        const v = (typeof k === 'string' && obj[k] !== undefined) ? obj[k] : (reserva !== undefined ? reserva : (DICCIONARIOS.es[k] !== undefined ? DICCIONARIOS.es[k] : (typeof k === 'string' ? k : undefined)));
        return typeof v === 'string' && v.includes('{') ? sustituirGlobales(v) : v;
    }
});
const TEXTOS = Object.fromEntries(IDIOMAS.map(l => [l, conFallback(l)]));

// Idioma inicial: el elegido por el usuario y, si nunca eligió, el del navegador
// (si está entre los disponibles); en último caso, inglés, porque el
// lanzamiento principal es en EE. UU. (un navegador en francés, chino o
// vietnamita allí debe ver la versión en inglés, no la española).
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
    return 'en';
};

// Idioma y configuración regional activos, para las funciones que viven fuera
// de los componentes (fmt, nombres de mes en los gráficos, avisos de los
// helpers del modelo). Se actualizan de forma síncrona al cambiar de idioma,
// antes del re-render, para que ese mismo render ya los use.
let idiomaActual = detectarIdioma();
let localeActual = localeDe(idiomaActual);
export const getLocale = () => localeActual;
export const getIdioma = () => idiomaActual;

// ─── Moneda ──────────────────────────────────────────────────────────────────
// Los importes son números; la moneda solo decide cómo se muestran. Es una
// propiedad de los datos del usuario (config.moneda en Firestore), no del
// dispositivo: así un mismo usuario ve el mismo símbolo en el móvil y en el
// ordenador. Si aún no ha elegido, se detecta por la región del navegador.
export const MONEDAS = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'CHF', 'MXN', 'ARS', 'CLP', 'COP', 'PEN'];
const MONEDA_POR_REGION = {
    US: 'USD', PR: 'USD', EC: 'USD', SV: 'USD', PA: 'USD',
    GB: 'GBP', CA: 'CAD', AU: 'AUD', CH: 'CHF', LI: 'CHF',
    MX: 'MXN', AR: 'ARS', CL: 'CLP', CO: 'COP', PE: 'PEN'
};
const ZONA_EURO = ['ES', 'DE', 'FR', 'IT', 'PT', 'NL', 'BE', 'AT', 'IE', 'FI', 'GR', 'SK', 'SI', 'EE', 'LV', 'LT', 'LU', 'MT', 'CY', 'HR', 'AD', 'MC', 'SM', 'VA', 'ME'];
export const detectarMoneda = () => {
    const candidatos = (typeof navigator !== 'undefined' && (navigator.languages?.length ? navigator.languages : [navigator.language])) || [];
    for (const c of candidatos) {
        let region = null;
        try { region = new Intl.Locale(c).maximize().region; } catch { region = String(c || '').split('-')[1]?.toUpperCase() || null; }
        if (region && MONEDA_POR_REGION[region]) return MONEDA_POR_REGION[region];
        if (region && ZONA_EURO.includes(region)) return 'EUR';
    }
    return 'USD';
};
let monedaActual = detectarMoneda();
export const getMoneda = () => monedaActual;
export const setMonedaActiva = (m) => { if (MONEDAS.includes(m)) monedaActual = m; };
export const simboloMoneda = (m = monedaActual) => {
    try { return new Intl.NumberFormat(localeActual, { style: 'currency', currency: m }).formatToParts(0).find(p => p.type === 'currency')?.value || m; }
    catch { return m; }
};
export const nombreMoneda = (m) => {
    try { return new Intl.DisplayNames([localeActual], { type: 'currency' }).of(m); } catch { return m; }
};
const sustituirGlobales = (texto) => texto.replace(/\{moneda\}/g, () => simboloMoneda());

// Texto con variables: tf('clave', { n: 3 }) sustituye {n} en el texto.
const interpolar = (texto, vars) => String(texto).replace(/\{(\w+)\}/g, (_, k) => (vars && vars[k] !== undefined) ? vars[k] : '');

// Texto traducido fuera de un componente (mismo fallback que `t`).
export const tx = (clave, vars) => interpolar((TEXTOS[idiomaActual] || TEXTOS.es)[clave], vars);
// Nombre de mes (completo o de 3 letras) a partir de su clave en español, en el idioma activo.
export const nombreMes = (clave) => { const i = MESES_CLAVE.indexOf(clave); return i === -1 ? String(clave) : (MESES[idiomaActual] || MESES.es)[i]; };
export const nombreMesCorto = (clave) => { const i = MESES_CLAVE.indexOf(clave); return i === -1 ? String(clave).slice(0, 3) : mesCortoDe(idiomaActual, i); };

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
        // Título de la pestaña en el idioma de la página (index.html trae el inglés).
        if (TEXTOS[language]?.tituloPagina) document.title = TEXTOS[language].tituloPagina;
    }, [language]);

    // Solo se guarda cuando el usuario elige un idioma a mano; así, mientras no
    // lo haga, la app sigue al idioma del navegador.
    const setLanguageTo = (lang) => {
        if (!IDIOMAS.includes(lang)) return;
        try { localStorage.setItem('appLanguage', lang); } catch { /* sin localStorage */ }
        idiomaActual = lang;
        localeActual = localeDe(lang);
        setLanguage(lang);
    };
    const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    const toggleLanguage = () => setLanguageTo(IDIOMAS[(IDIOMAS.indexOf(language) + 1) % IDIOMAS.length]);

    const value = useMemo(() => {
        const t = TEXTOS[language] || TEXTOS.es;
        const nombres = MESES[language] || MESES.es;
        return {
            theme, toggleTheme, language, toggleLanguage, setLanguageTo, t,
            locale: localeDe(language),
            tf: (clave, vars) => interpolar(t[clave], vars),
            // Nombre del mes a partir de su clave en español ("enero" → "January").
            mes: (clave) => { const i = MESES_CLAVE.indexOf(clave); return i === -1 ? clave : nombres[i]; },
            mesCorto: (clave) => { const i = MESES_CLAVE.indexOf(clave); return i === -1 ? String(clave).slice(0, 3) : mesCortoDe(language, i); }
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
