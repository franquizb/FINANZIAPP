// App.js — App Financiera (localStorage, sin Firebase, sin IA)
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Login from './Login';
import LandingPage from './LandingPage';
import { AppProvider, useApp } from './context/AppContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line,
  AreaChart, Area, Brush, ComposedChart
} from 'recharts';
import TutorialWizard from './components/TutorialWizard';
import { db, auth } from './firebase';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot, collection, query, addDoc, increment, orderBy } from 'firebase/firestore';

const logErrorToFirebase = async (context, err) => {
  try {
    const errorMsg = err instanceof Error ? err.message : String(err);
    const userId = auth?.currentUser?.uid || 'anonymous';
    await addDoc(collection(db, 'system_errors'), {
      context,
      error: errorMsg,
      timestamp: Date.now(),
      uid: userId
    });
  } catch (e) {
    console.warn("No se pudo guardar el log de error en Firebase:", e);
  }
};

// ─── DB LOCAL ────────────────────────────────────────────────────────────────
const localDB = {
  get: (k) => { try { const d = localStorage.getItem(k); return d ? JSON.parse(d) : null; } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { } },
  exportAll: () => {
    const backup = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('users_') || key === 'currentUser') {
        backup[key] = localStorage.getItem(key);
      }
    }
    return JSON.stringify(backup);
  },
  importAll: (json) => {
    try {
      const data = JSON.parse(json);
      Object.keys(data).forEach(k => localStorage.setItem(k, data[k]));
      return true;
    } catch (e) { return false; }
  }
};

// ─── DATOS INICIALES ─────────────────────────────────────────────────────────
const initialCategories = {
  "Ingresos": ["Sueldo", "Alquiler", "Otros"],
  "Gastos Esenciales": ["Vivienda", "Transporte", "Alimentación", "Salud", "Suministros", "Educación", "Impuestos", "Otros"],
  "Gastos Discrecionales": ["Ocio", "Restaurantes", "Compras", "Viajes", "Regalos", "Suscripciones", "Otros"],
  "Pago de Deudas": ["Hipoteca", "Coche", "Personales", "Tarjetas", "Otros"],
  "Ahorro e Inversión": ["Fondo de Emergencia", "Inversiones L/P", "Plan de Pensiones", "Metas Específicas", "Otros"],
  "Activos": ["Efectivo", "Cuentas Corrientes", "Cuentas Ahorro", "Acciones", "Fondos de Inversión", "Criptomonedas", "Planes de Pensiones", "Inmuebles", "Otros Activos"],
  "Pasivos": ["Hipoteca", "Préstamo Coche", "Préstamos Personales", "Deuda Tarjetas", "Otros Pasivos"]
};

const defaultBudget = {
  "Sueldo": 2500, "Alquiler": 200,
  "Vivienda": 500, "Transporte": 100, "Alimentación": 300, "Salud": 66.67,
  "Suministros": 150, "Impuestos": 125,
  "Ocio": 150, "Restaurantes": 100, "Compras": 125, "Viajes": 83.33,
  "Regalos": 41.67, "Suscripciones": 25,
  "Hipoteca": 500,
  "Fondo de Emergencia": 100, "Inversiones L/P": 83.33, "Plan de Pensiones": 66.67, "Metas Específicas": 50
};

const months = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const defaultStartYear = new Date().getFullYear();

const generateInitialYearData = (year, cats = initialCategories) => {
  const d = { budget: {}, monthly: {}, netWorth: { assets: {}, liabilities: {} }, oneTime: {}, categories: JSON.parse(JSON.stringify(cats)) };
  months.forEach(m => { d.oneTime[m] = []; });
  Object.keys(d.categories).forEach(mk => {
    if (mk === 'Activos' || mk === 'Pasivos') return;
    d.categories[mk].forEach(sub => {
      d.budget[sub] = (year === defaultStartYear && defaultBudget[sub] !== undefined) ? defaultBudget[sub] : 0;
      months.forEach(m => {
        if (!d.monthly[m]) d.monthly[m] = {};
        d.monthly[m][sub] = { budgeted: 0, actual: [] };
      });
    });
  });
  if (d.categories.Activos) { d.categories.Activos.forEach(c => { d.netWorth.assets[c] = {}; months.forEach(m => d.netWorth.assets[c][m] = 0); }); }
  if (d.categories.Pasivos) { d.categories.Pasivos.forEach(c => { d.netWorth.liabilities[c] = {}; months.forEach(m => d.netWorth.liabilities[c][m] = 0); }); }
  return d;
};

// ─── AÑOS ────────────────────────────────────────────────────────────────────
const aniosConDatos = (fd) => Object.keys(fd || {}).map(Number).filter(y => !isNaN(y)).sort((a, b) => a - b);

// Crea los datos de un año que todavía no existe heredando del año anterior más
// cercano (o del siguiente, si solo hay años posteriores): mismas categorías,
// mismo presupuesto mensual y, cuando el año base es anterior, el saldo de
// diciembre de cada activo y pasivo como punto de partida. Las transacciones y
// los gastos puntuales empiezan vacíos. Así el año nuevo arranca ya configurado
// y, a partir de ahí, cada año conserva sus propios cambios.
const crearAnioHeredado = (fullData, year, config) => {
  const years = aniosConDatos(fullData);
  const previos = years.filter(y => y < year);
  const posteriores = years.filter(y => y > year);
  const baseYear = previos.length ? previos[previos.length - 1] : (posteriores.length ? posteriores[0] : null);
  const base = baseYear !== null ? fullData[baseYear] : null;
  const cats = base?.categories || config?.categories || initialCategories;
  const d = generateInitialYearData(year, cats);
  if (base) {
    Object.keys(d.budget).forEach(sub => {
      const v = parseFloat(base.budget?.[sub]) || 0;
      d.budget[sub] = v;
      months.forEach(m => { d.monthly[m][sub].budgeted = v; });
    });
    if (baseYear < year) {
      ['assets', 'liabilities'].forEach(k => {
        Object.keys(d.netWorth[k]).forEach(cat => {
          const dic = parseFloat(base.netWorth?.[k]?.[cat]?.diciembre) || 0;
          months.forEach(m => { d.netWorth[k][cat][m] = dic; });
        });
      });
    }
  }
  return d;
};

const VISTAS_POR_DEFECTO = ['dashboard', 'monthly', 'networth', 'loans', 'trading', 'analysis', 'settings', 'users'];
const SECCIONES_PRESUPUESTO = ["Ingresos", "Gastos Esenciales", "Gastos Discrecionales", "Pago de Deudas", "Ahorro e Inversión"];

// ─── DASHBOARD CONFIGURABLE ──────────────────────────────────────────────────
// Catálogo de bloques del dashboard. Cada usuario elige cuáles ve, en qué orden
// y a qué anchura; algunos tienen opciones propias (categoría elegida, objetivo).
// "vista" indica que el bloque solo tiene sentido si esa sección está visible.
const WIDGETS_DASHBOARD = [
  { id: 'kpis', titulo: 'Resumen del año (ingresos, gastos, ahorro)', size: 'full' },
  { id: 'salud', titulo: 'Salud financiera', size: 'full' },
  { id: 'flujo', titulo: 'Ingresos vs. gastos mensuales', size: 'half' },
  { id: 'distribucion', titulo: 'Distribución de gastos', size: 'half' },
  { id: 'ahorro-acumulado', titulo: 'Ahorro acumulado: plan vs. real', size: 'half' },
  { id: 'objetivo', titulo: 'Objetivo de ahorro anual', size: 'half' },
  { id: 'presupuesto-ingresos', titulo: 'Ingresos: presupuesto vs. real', size: 'half' },
  { id: 'presupuesto-gastos', titulo: 'Gastos: presupuesto vs. real', size: 'half' },
  { id: 'top-gastos', titulo: 'Dónde se va el dinero (top gastos)', size: 'half' },
  { id: 'categoria', titulo: 'Evolución de una categoría', size: 'half' },
  { id: 'ahorro-mensual', titulo: 'Ahorro por mes', size: 'full' },
  { id: 'comparativa', titulo: 'Este año vs. el anterior', size: 'full' },
  { id: 'patrimonio', titulo: 'Patrimonio neto', size: 'half', vista: 'networth' },
  { id: 'prestamos', titulo: 'Progreso de préstamos', size: 'half', vista: 'loans' },
  { id: 'trading', titulo: 'Resumen de trading', size: 'full', vista: 'trading' }
];

// Disposición guardada -> lista completa y saneada: conserva el orden, la
// visibilidad, la anchura y las opciones del usuario, descarta bloques que ya no
// existen y añade al final los nuevos que aparezcan en versiones posteriores.
const normalizarDashboard = (saved) => {
  const guardados = Array.isArray(saved?.widgets) ? saved.widgets : [];
  const lista = [];
  guardados.forEach(w => {
    const def = WIDGETS_DASHBOARD.find(d => d.id === w?.id);
    if (def && !lista.some(x => x.id === def.id)) {
      lista.push({
        id: def.id,
        visible: w.visible !== false,
        size: (w.size === 'full' || w.size === 'half') ? w.size : def.size,
        opciones: (w.opciones && typeof w.opciones === 'object') ? w.opciones : {}
      });
    }
  });
  WIDGETS_DASHBOARD.forEach(def => {
    if (!lista.some(x => x.id === def.id)) lista.push({ id: def.id, visible: true, size: def.size, opciones: {} });
  });
  return { widgets: lista };
};

// Configuración del usuario tal y como la usa la app, con valores por defecto.
// anioInicial: 0 = abrir siempre en el año en curso; un año concreto = abrir en ese año.
const normalizarConfig = (savedConfig) => ({
  tutorialCompleted: savedConfig?.tutorialCompleted || false,
  anioInicial: parseInt(savedConfig?.anioInicial) || 0,
  categories: savedConfig?.categories || JSON.parse(JSON.stringify(initialCategories)),
  visibleViews: savedConfig?.visibleViews || [...VISTAS_POR_DEFECTO],
  visibleBudgetSections: savedConfig?.visibleBudgetSections || [...SECCIONES_PRESUPUESTO],
  dashboard: normalizarDashboard(savedConfig?.dashboard)
});

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const calcTotal = (txs) => Array.isArray(txs) ? txs.reduce((s, i) => s + (parseFloat(i.amount) || 0), 0) : 0;

const getCategoryColor = (mk) => {
  switch (mk) {
    case 'Ingresos': return 'var(--green)';
    case 'Gastos Esenciales': return 'var(--blue)';
    case 'Gastos Discrecionales': return 'var(--yellow)';
    case 'Pago de Deudas': return 'var(--red)';
    case 'Ahorro e Inversión': return 'var(--accent)';
    default: return 'var(--text-secondary)';
  }
};

const getCategoryGroup = (sub, cats) => {
  if ((cats["Ingresos"] || []).includes(sub)) return { type: 'income', mainCategory: 'Ingresos' };
  for (const mk of ["Gastos Esenciales", "Gastos Discrecionales", "Pago de Deudas", "Ahorro e Inversión"]) {
    if ((cats[mk] || []).includes(sub)) return { type: 'expense', mainCategory: mk };
  }
  if ((cats["Activos"] || []).includes(sub)) return { type: 'asset', mainCategory: 'Activos' };
  if ((cats["Pasivos"] || []).includes(sub)) return { type: 'liability', mainCategory: 'Pasivos' };
  return { type: 'unknown', mainCategory: '?' };
};

const fmt = (v, currency = 'EUR') => (v || 0).toLocaleString('es-ES', { style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2 });

const EXPENSE_KEYS = ["Gastos Esenciales", "Gastos Discrecionales", "Pago de Deudas", "Ahorro e Inversión"];
const ALL_MAIN_KEYS = ["Ingresos", ...EXPENSE_KEYS];

// ─── PRÉSTAMOS ───────────────────────────────────────────────────────────────
// Fecha "YYYY-MM-DD" interpretada en hora local (new Date('2026-01-01') la toma
// como UTC y en zonas horarias negativas cae en el día anterior).
const fechaLocal = (s) => {
  if (s instanceof Date) return s;
  const p = String(s || '').split('-').map(Number);
  return (p.length === 3 && !isNaN(p[0]) && !isNaN(p[1]) && !isNaN(p[2])) ? new Date(p[0], p[1] - 1, p[2]) : new Date(s);
};

// Cuadro de amortización completo (sistema francés) contando las amortizaciones
// anticipadas. Es la única fuente de verdad del préstamo: de aquí salen la cuota
// y el saldo de cada mes para el Dashboard, el Seguimiento, el Patrimonio y la
// pestaña de Préstamos, de modo que todas las vistas coinciden entre sí.
const _cacheSimulaciones = new Map();
const simularPrestamo = (loan) => {
  if (!loan || !loan.startDate) return [];
  const clave = [loan.id, loan.totalAmount, loan.installmentsCount, loan.interestRate, loan.amount, loan.startDate, JSON.stringify(loan.extraAmortizations || [])].join('|');
  if (_cacheSimulaciones.has(clave)) return _cacheSimulaciones.get(clave);

  const rows = [];
  const total = parseFloat(loan.totalAmount) || 0;
  const count = parseInt(loan.installmentsCount) || 0;
  const i = ((parseFloat(loan.interestRate) || 0) / 100) / 12;
  const cuota = parseFloat(loan.amount) || 0;
  const start = fechaLocal(loan.startDate);
  let pending = total;
  let totalAmortized = 0;

  for (let n = 1; n <= count && pending > 0.01; n++) {
    const pendingBefore = pending;
    const interest = pending * i;
    let principal = cuota - interest;
    if (principal > pending) principal = pending;
    if (principal < 0) principal = 0;
    totalAmortized += principal;
    pending -= principal;

    let extraHere = 0;
    const extras = (loan.extraAmortizations || []).filter(e => e.paymentNo === n);
    for (const ex of extras) {
      const am = Math.min(parseFloat(ex.amount) || 0, pending);
      extraHere += am;
      pending -= am;
      totalAmortized += am;
    }

    const d = new Date(start.getFullYear(), start.getMonth() + n - 1, 1);
    rows.push({
      num: n,
      date: d,
      month: d.toLocaleString('es-ES', { month: 'long', year: 'numeric' }),
      fixed: interest + principal, // lo que se paga de verdad ese mes (la última cuota puede ser menor)
      interest,
      principal,
      extraAmortization: extraHere,
      extrasList: extras,
      totalAmortized,
      pendingBefore,
      pending: Math.max(0, pending)
    });
    if (pending <= 0.01) break;
  }

  if (_cacheSimulaciones.size > 200) _cacheSimulaciones.clear();
  _cacheSimulaciones.set(clave, rows);
  return rows;
};

// Primer día del mes de la última cuota real (las amortizaciones anticipadas adelantan el final).
const finRealPrestamo = (loan) => {
  const rows = simularPrestamo(loan);
  if (rows.length) return rows[rows.length - 1].date;
  const f = fechaLocal(loan?.endDate || loan?.startDate || new Date());
  return new Date(f.getFullYear(), f.getMonth(), 1);
};

const getLoanValues = (loan, year, monthIdx) => {
  if (!loan || !loan.startDate) return { installment: 0, balance: 0, active: false };
  const start = fechaLocal(loan.startDate);
  const diffMonths = (year - start.getFullYear()) * 12 + (monthIdx - start.getMonth());
  const rows = simularPrestamo(loan);
  if (diffMonths < 0 || diffMonths >= rows.length) return { installment: 0, balance: 0, active: false };
  const row = rows[diffMonths];
  return { installment: row.fixed, balance: row.pendingBefore, active: true };
};

// Un préstamo cubre el año completo si paga cuota de enero a diciembre.
const isLoanFullYear = (loan, year) => {
  if (!loan || !loan.startDate) return false;
  const start = fechaLocal(loan.startDate);
  const primerMes = new Date(start.getFullYear(), start.getMonth(), 1);
  const end = finRealPrestamo(loan);
  return primerMes <= new Date(year, 0, 1) && end >= new Date(year, 11, 1);
};

const getEffectiveBudget = (sub, mainCategory, year, mIdx, fullData, manualBudget) => {
  if (mainCategory === 'Pago de Deudas' && fullData?.loans) {
    const loan = fullData.loans.find(l => l.name === sub);
    if (loan) {
      if (mIdx === -1) {
        // Si no es año completo, no sale en la tabla recurrente (se va a puntuales)
        if (!isLoanFullYear(loan, year)) return 0;
        let total = 0;
        for (let m = 0; m < 12; m++) {
          total += getLoanValues(loan, year, m).installment;
        }
        return total / 12;
      }
      const lv = getLoanValues(loan, year, mIdx);
      return lv.active ? lv.installment : 0;
    }
  }
  return manualBudget?.[sub] || 0;
};

// Ingresos y gastos de cada mes de un año (las cuotas de préstamos cuentan como
// gasto real). Lo usa el dashboard para comparar con el año anterior.
const calcularTotalesMensuales = (data, categories, fullData, year) => months.map((m, mIdx) => {
  const income = (categories["Ingresos"] || []).reduce((s, sub) => s + calcTotal(data?.monthly?.[m]?.[sub]?.actual || []), 0);
  const expenses = EXPENSE_KEYS.reduce((s, mk) => s + (categories[mk] || []).reduce((ss, sub) => {
    let val = calcTotal(data?.monthly?.[m]?.[sub]?.actual || []);
    if (mk === 'Pago de Deudas' && fullData?.loans) {
      const loan = fullData.loans.find(l => l.name === sub);
      if (loan) { const lv = getLoanValues(loan, year, mIdx); if (lv.active) val += lv.installment; }
    }
    return ss + val;
  }, 0), 0);
  return { name: m.substring(0, 3).toUpperCase(), income, expenses };
});

// ─── TRADING ─────────────────────────────────────────────────────────────────
// Resultado realizado por activo (precio medio, PnL cerrado, comisiones) a partir
// del historial de operaciones. Lo usan la pestaña Trading y el Dashboard, para
// que ambos muestren las mismas cifras.
const procesarTrades = (trades) => {
  const assets = {};
  let totalRealizedPnL = 0;
  let totalGrossPnL = 0;
  let totalFees = 0;
  let wins = 0;
  let losses = 0;
  const history = [];
  // Orden cronológico: por fecha y, a igual fecha, por marca de tiempo (las
  // operaciones antiguas sin `ts` se guardaron de más nueva a más antigua).
  const sorted = [...(trades || [])].reverse().sort((a, b) => {
    const fa = new Date(a.date);
    const fb = new Date(b.date);
    if (fa - fb !== 0) return fa - fb;
    if (a.ts && b.ts) return a.ts - b.ts;
    return 0;
  });

  sorted.forEach(t => {
    const qty = parseFloat(t.amount);
    const price = parseFloat(t.price);
    const fees = parseFloat(t.fees || 0);
    const assetName = t.asset?.trim();
    if (!assetName || isNaN(qty) || isNaN(price)) return;

    if (!assets[assetName]) {
      assets[assetName] = { totalQty: 0, totalCost: 0, avgPrice: 0, realizedPnL: 0, fees: 0, type: t.type };
    }
    const a = assets[assetName];
    // Si la posición estaba cerrada, la dirección pasa a ser la de la nueva operación.
    if (a.totalQty === 0) a.type = t.type;

    let tGrossPnL = 0;
    if (a.type === 'Long') {
      if (t.action === 'COMPRA') {
        a.totalCost += qty * price;
        a.totalQty += qty;
        a.avgPrice = a.totalQty > 0 ? a.totalCost / a.totalQty : 0;
      } else {
        const closingQty = Math.min(qty, a.totalQty);
        if (closingQty > 0) {
          tGrossPnL = (price - a.avgPrice) * closingQty;
          a.totalQty -= closingQty;
          a.totalCost = a.totalQty * a.avgPrice;
        }
      }
    } else {
      if (t.action === 'VENTA') {
        a.totalCost += qty * price;
        a.totalQty += qty;
        a.avgPrice = a.totalQty > 0 ? a.totalCost / a.totalQty : 0;
      } else {
        const closingQty = Math.min(qty, a.totalQty);
        if (closingQty > 0) {
          tGrossPnL = (a.avgPrice - price) * closingQty;
          a.totalQty -= closingQty;
          a.totalCost = a.totalQty * a.avgPrice;
        }
      }
    }

    if (tGrossPnL > 0) wins++;
    else if (tGrossPnL < 0) losses++;

    const tNetPnL = tGrossPnL - fees;
    a.realizedPnL += tNetPnL;
    a.fees += fees;
    totalGrossPnL += tGrossPnL;
    totalFees += fees;
    totalRealizedPnL += tNetPnL;
    history.push({ name: t.date, pnl: totalRealizedPnL });
  });
  return { assets, totalRealizedPnL, totalGrossPnL, totalFees, history, wins, losses };
};

// ─── ICONS ───────────────────────────────────────────────────────────────────
const Ic = ({ d, size = 18, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d={d} />
  </svg>
);
const PATHS = {
  dashboard: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  monthly: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  networth: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
  settings: "M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z",
  signout: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1",
  sun: "M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 5a7 7 0 100 14A7 7 0 0012 5z",
  moon: "M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z",
  menu: "M3 12h18M3 6h18M3 18h18",
  trash: "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6",
  plus: "M12 5v14M5 12h14",
  chevronR: "M9 18l6-6-6-6",
  globe: "M12 2a10 10 0 100 20A10 10 0 0012 2zM2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20",
  lock: "M7 11V7a5 5 0 0110 0v4M5 11h14v10H5z",
  unlock: "M7 11V7a5 5 0 019.9-1M5 11h14v10H5z",
  loan: "M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6",
  users: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100-8 4 4 0 000 8z",
  trading: "M12 20V10M18 20V4M6 20v-4",
  analysis: "M21 21H3V3M7 14l3-3 5 5 6-6"
};

const PERMISSIONS = [
  { id: 'dashboard', label: 'Dashboard', icon: PATHS.dashboard },
  { id: 'monthly', label: 'Seguimiento Mensual', icon: PATHS.monthly },
  { id: 'networth', label: 'Patrimonio Neto', icon: PATHS.networth },
  { id: 'loans', label: 'Préstamos', icon: PATHS.loan },
  { id: 'trading', label: 'Trading', icon: PATHS.trading },
  { id: 'analysis', label: 'Análisis', icon: PATHS.analysis },
  { id: 'settings', label: 'Configuración', icon: PATHS.settings },
  { id: 'users', label: 'Gestión', icon: PATHS.users },
];

const AVATARS = [
  '👤', '👨‍💻', '👩‍💻', '👨‍💼', '👩‍💼', '🦁', '🦊', '🐱', '🐶', '🦄',
  '🚀', '🎨', '🎮', '💡', '🎵', '⚽', '🍕', '🌍', '🔥', '💎',
  '🌈', '👑', '⚡', '🤖', '👻', '🍀', '🦋', '🐳', '🍎', '🌙'
];

const hasPermission = (user, permId) => {
  if (!user) return false;
  if (user.isAdmin) return true;
  return user.permissions?.includes(permId);
};

// ─── SUSCRIPCION ──────────────────────────────────────────────────────────────
// Enlace de cobro de Revolut. Cuando entre el pago, el admin marca `paidUntil`
// en el panel de Gestion y las reglas devuelven el acceso de escritura.
const ENLACE_PAGO = 'https://revolut.me/CAMBIAME';
const PRECIO = '4,99 € / mes';

// OJO: esto es solo para la interfaz. Quien impide escribir de verdad son las
// reglas de Firestore (suscripcionActiva). Manipular esto en el navegador no
// da acceso a nada.
const estadoSuscripcion = (user) => {
  if (!user) return { activa: false, motivo: 'sin-sesion' };
  if (user.isAdmin) return { activa: true, motivo: 'admin' };

  const ahora = Date.now();
  if ((user.paidUntil || 0) > ahora) {
    return { activa: true, motivo: 'pagado', hasta: user.paidUntil };
  }
  if ((user.trialEndsAt || 0) > ahora) {
    const dias = Math.ceil((user.trialEndsAt - ahora) / (24 * 60 * 60 * 1000));
    return { activa: true, motivo: 'prueba', diasRestantes: dias };
  }
  return { activa: false, motivo: (user.trialEndsAt ? 'prueba-caducada' : 'sin-prueba') };
};

// Aviso de prueba a punto de acabar o ya caducada. No bloquea la interfaz: el
// usuario conserva la lectura de sus datos (derecho de acceso del RGPD) y lo
// que pierde es la escritura, que ya deniegan las reglas.
function AvisoSuscripcion({ user }) {
  const estado = estadoSuscripcion(user);
  if (estado.motivo === 'admin' || estado.motivo === 'pagado' || estado.motivo === 'sin-sesion') return null;
  if (estado.activa && estado.diasRestantes > 5) return null;

  const caducada = !estado.activa;
  return (
    <div style={{
      margin: '12px 16px 0', padding: '12px 16px', borderRadius: 10,
      display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
      background: caducada ? 'rgba(220,38,38,.10)' : 'rgba(234,179,8,.10)',
      border: `1px solid ${caducada ? 'rgba(220,38,38,.45)' : 'rgba(234,179,8,.45)'}`
    }}>
      <span style={{ fontSize: 20, lineHeight: 1 }}>{caducada ? '🔒' : '⏳'}</span>
      <div style={{ flex: 1, minWidth: 220 }}>
        <div style={{ fontWeight: 700, fontSize: 14 }}>
          {caducada
            ? 'Tu prueba gratuita ha terminado'
            : `Te quedan ${estado.diasRestantes} ${estado.diasRestantes === 1 ? 'día' : 'días'} de prueba`}
        </div>
        <div style={{ fontSize: 12, opacity: .8, marginTop: 2 }}>
          {caducada
            ? `Puedes seguir consultando y exportando tus datos, pero no añadir ni modificar nada. Activa tu cuenta por ${PRECIO}.`
            : `Cuando acabe podrás seguir consultando tus datos, pero no editarlos. ${PRECIO}.`}
        </div>
      </div>
      <a href={ENLACE_PAGO} target="_blank" rel="noopener noreferrer"
         className="btn btn-primary"
         style={{ textDecoration: 'none', whiteSpace: 'nowrap' }}>
        Pagar con Revolut
      </a>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/" element={<AppInner isHome />} />
          <Route path="/login" element={<AppInner />} />
          <Route path="/register" element={<AppInner />} />
          {PERMISSIONS.map(p => <Route key={p.id} path={`/${p.id}`} element={<AppInner />} />)}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}

function AppInner({ isHome }) {
  const { theme } = useApp();
  const navigate = useNavigate();

  const getSavedUser = () => { try { const s = localStorage.getItem('currentUser'); return s ? JSON.parse(s) : null; } catch { return null; } };
  const [user, setUser] = useState(getSavedUser);
  const userId = user?.uid || null;

  const [config, setConfig] = useState(null);
  const [financialData, setFinancialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const pathView = location.pathname.substring(1);
  const validViews = ['dashboard', 'monthly', 'networth', 'loans', 'trading', 'analysis', 'settings', 'users'];
  const initialView = validViews.includes(pathView) ? pathView : 'dashboard';
  const [activeView, _setActiveView] = useState(initialView);

  const setActiveView = (v) => {
    _setActiveView(v);
    navigate(`/${v}`);
  };

  useEffect(() => {
    const pv = location.pathname.substring(1);
    if (pv && validViews.includes(pv) && pv !== activeView) {
      _setActiveView(pv);
    }
  }, [location.pathname, activeView]);

  const [selectedYear, setSelectedYear] = useState(defaultStartYear);
  const [selectedMonth, setSelectedMonth] = useState(months[new Date().getMonth()]);
  const [errorGuardado, setErrorGuardado] = useState(null);
  // Referencias para el registro de actividad (no deben re-disparar efectos).
  const userRef = useRef(user);
  useEffect(() => { userRef.current = user; }, [user]);
  const sessionKeyRef = useRef(null);
  // Años cuya creación automática ya se intentó en esta sesión (evita bucles si la escritura falla).
  const aniosIntentados = useRef(new Set());
  // "Año por defecto" de Configuración: 0 = automático (año en curso). Se aplica una vez al cargar.
  const anioInicialAplicado = useRef(false);
  useEffect(() => {
    if (!config || anioInicialAplicado.current) return;
    anioInicialAplicado.current = true;
    const y = parseInt(config.anioInicial);
    if (y && y > 1900) setSelectedYear(y);
  }, [config]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dashboardMode, setDashboardMode] = useState('charts');
  const [budgetLocked, setBudgetLocked] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);

  const handleLogin = (u) => {
    setUser(u); setConfig(null); setFinancialData(null); setLoading(true); setError(null); setBudgetLocked(true);
    navigate('/dashboard');
  };

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Restaurar sesión desde Firebase. El rol de administrador sale SOLO del
        // documento de Firestore, que el cliente no puede modificar.
        let userData = {};
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          userData = userDoc.exists() ? userDoc.data() : {};
        } catch (e) {
          console.error('No se pudo leer el perfil del usuario:', e);
        }
        const isAdmin = userData.isAdmin === true;
        const sessionUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: userData.displayName || firebaseUser.displayName || (firebaseUser.email || '').split('@')[0],
          avatar: userData.avatar || '👤',
          isAdmin: isAdmin,
          permissions: isAdmin ? PERMISSIONS.map(p => p.id) : (userData.permissions || ['dashboard', 'monthly', 'networth', 'loans', 'trading', 'analysis', 'settings']),
          // Estado de suscripcion. Solo informativo para la interfaz: quien
          // realmente corta la escritura son las reglas de Firestore.
          trialEndsAt: userData.trialEndsAt || 0,
          paidUntil: userData.paidUntil || 0,
          plan: userData.plan || 'trial',
          bloqueado: userData.bloqueado === true
        };
        setUser(sessionUser);
        localStorage.setItem('currentUser', JSON.stringify(sessionUser));
      } else {
        // Sin sesión en Firebase Auth no hay sesión en la app. Antes se
        // conservaba la copia de localStorage y "cerrar sesión" no cerraba nada.
        localStorage.removeItem('currentUser');
        setUser(null);
      }
    });
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (user && (window.location.pathname === '/login' || window.location.pathname === '/register' || window.location.pathname === '/')) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Load data from Firestore (Real-time Sync)
  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    setLoading(true);

    const configRef = doc(db, 'users', userId, 'settings', 'config');
    const dataRef = doc(db, 'users', userId, 'data', 'financial');

    // MIGRATION HELPER (Run once if no cloud data)
    const migrateIfNecessary = async () => {
      try {
        const configSnap = await getDoc(configRef);
        const dataSnap = await getDoc(dataRef);
        if (!configSnap.exists() || !dataSnap.exists()) {
          const localConfig = localDB.get(`users_${userId}_config`);
          const localData = localDB.get(`users_${userId}_data`);
          if (localConfig && !configSnap.exists()) await setDoc(configRef, localConfig);
          if (localData && !dataSnap.exists()) await setDoc(dataRef, localData);
        }
      } catch (e) {
        console.error('Error en la migración inicial:', e);
      }
    };
    migrateIfNecessary();

    // Listen for real-time updates for Config
    const unsubConfig = onSnapshot(configRef, (snap) => {
      const currentConfig = normalizarConfig(snap.exists() ? snap.data() : null);
      setConfig(currentConfig);
      if (!currentConfig.tutorialCompleted) setShowTutorial(true);
    }, (err) => {
      console.error("Error syncing config:", err);
    });

    // Listen for real-time updates for Financial Data
    const unsubData = onSnapshot(dataRef, (snap) => {
      if (snap.exists()) {
        const fd = snap.data();
        if (!fd.loans) fd.loans = [];
        if (!fd.trading) fd.trading = [];
        setFinancialData(fd);
      } else {
        const initialData = {
          [defaultStartYear]: generateInitialYearData(defaultStartYear, initialCategories),
          loans: [],
          trading: []
        };
        setFinancialData(initialData);
        if (userId) setDoc(dataRef, initialData).catch(e => console.error("Error creating initial data", e));
      }
      setLoading(false);
    }, (err) => {
      console.error("Error syncing data:", err);
      setError("Error de sincronización: " + err.message);
      setLoading(false);
    });

    // Registro de actividad: un documento por usuario y día, con latido cada 5 minutos.
    let lastTick = Date.now();
    const logSession = async () => {
      if (!userId) return;
      try {
        const now = Date.now();
        const diff = now - lastTick;
        lastTick = now;

        const d = new Date();
        const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
        const sessionKey = `session_${userId}_${ymd}`;
        const sessionRef = doc(db, 'activity_logs', sessionKey);

        const datos = {
          uid: userId,
          email: userRef.current?.email || null,
          displayName: userRef.current?.displayName || null,
          lastSeen: now,
          totalTime: increment(diff),
          end: null
        };
        if (sessionKeyRef.current !== sessionKey) {
          // Primer latido del día en esta sesión: si el documento no existe se
          // guarda la hora de inicio (la usa la auditoría del panel de gestión).
          const snap = await getDoc(sessionRef);
          if (!snap.exists()) datos.start = now;
          sessionKeyRef.current = sessionKey;
        }
        await setDoc(sessionRef, datos, { merge: true });
      } catch (e) {
        console.error("Error logging session:", e);
      }
    };
    logSession();
    const interval = setInterval(logSession, 5 * 60 * 1000); // Latido cada 5 minutos

    return () => {
      unsubConfig();
      unsubData();
      clearInterval(interval);
    };
  }, [userId]);

  // Mensaje legible cuando Firestore rechaza una escritura.
  const explicarErrorGuardado = (e) => {
    const code = String(e?.code || '');
    if (code.includes('permission-denied')) {
      if (user?.bloqueado) return 'Tu cuenta está bloqueada: no se pueden guardar cambios. Contacta con el administrador.';
      const estado = estadoSuscripcion(user);
      if (!estado.activa) return 'Tu prueba gratuita ha terminado: los cambios no se guardan. Activa tu cuenta para seguir editando.';
      return 'Firestore ha rechazado el cambio por falta de permisos. Se ha restaurado la última versión guardada.';
    }
    if (code.includes('unavailable') || (typeof navigator !== 'undefined' && navigator.onLine === false)) {
      return 'Sin conexión: el cambio no se ha podido guardar. Se ha restaurado la última versión guardada.';
    }
    return `No se pudo guardar el cambio (${e?.message || 'error desconocido'}). Se ha restaurado la última versión guardada.`;
  };

  // Vuelve a cargar los datos tal y como están en la nube, para deshacer un
  // cambio que no se pudo guardar y que la pantalla no muestre algo falso.
  const recargarDesdeNube = async () => {
    if (!userId) return;
    try {
      const [ds, cs] = await Promise.all([
        getDoc(doc(db, 'users', userId, 'data', 'financial')),
        getDoc(doc(db, 'users', userId, 'settings', 'config'))
      ]);
      if (ds.exists()) {
        const fd = ds.data();
        if (!fd.loans) fd.loans = [];
        if (!fd.trading) fd.trading = [];
        setFinancialData(fd);
      }
      if (cs.exists()) setConfig(normalizarConfig(cs.data()));
    } catch (e) {
      console.error('No se pudo recargar desde la nube:', e);
    }
  };

  const updateFD = async (nd) => {
    setFinancialData(nd);
    localDB.set(`users_${userId}_data`, nd);
    if (!userId) return;
    try {
      await setDoc(doc(db, 'users', userId, 'data', 'financial'), nd);
      setErrorGuardado(null);
    } catch (e) {
      console.error("Error guardando en la nube:", e);
      logErrorToFirebase("Guardar Datos Financieros", e);
      setErrorGuardado(explicarErrorGuardado(e));
      await recargarDesdeNube();
    }
  };

  const updateCfg = async (nc) => {
    setConfig(nc);
    localDB.set(`users_${userId}_config`, nc);
    if (!userId) return;
    try {
      await setDoc(doc(db, 'users', userId, 'settings', 'config'), nc);
      setErrorGuardado(null);
    } catch (e) {
      console.error("Error guardando config en la nube:", e);
      logErrorToFirebase("Guardar Configuración", e);
      setErrorGuardado(explicarErrorGuardado(e));
      await recargarDesdeNube();
    }
  };

  // Si el año seleccionado todavía no tiene datos (al empezar un año nuevo o al
  // elegir un año futuro para prepararlo), se crea heredando del año anterior y
  // se guarda. Cada año se intenta una sola vez por sesión.
  useEffect(() => {
    if (!userId || loading || !financialData || !config) return;
    if (financialData[selectedYear]) return;
    if (aniosIntentados.current.has(selectedYear)) return;
    aniosIntentados.current.add(selectedYear);
    const nd = JSON.parse(JSON.stringify(financialData));
    nd[selectedYear] = crearAnioHeredado(financialData, selectedYear, config);
    updateFD(nd);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, loading, financialData, config, selectedYear]);

  if (!user) {
    if (isHome) return <LandingPage />;
    return <Login onLogin={handleLogin} />;
  }

  const updateProfile = async (newProfile) => {
    const updatedUser = { ...user, ...newProfile };
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    if (userId) {
      try {
        await setDoc(doc(db, 'users', userId), {
          displayName: updatedUser.displayName,
          avatar: updatedUser.avatar || '👤',
          email: updatedUser.email
        }, { merge: true });
      } catch (e) {
        console.error("Error actualizando perfil en Firestore:", e);
        logErrorToFirebase("Actualizar Perfil", e);
      }
    }

  };

  const updateVisibleViews = (views) => {
    updateCfg({ ...config, visibleViews: views });
  };

  const signOut = async () => {
    if (userId && sessionKeyRef.current) {
      try {
        await setDoc(doc(db, 'activity_logs', sessionKeyRef.current), { end: Date.now() }, { merge: true });
      } catch (e) {
        console.error('Error cerrando sesión en Firebase:', e);
      }
    }
    sessionKeyRef.current = null;
    // Cierra la sesión de Firebase Auth de verdad. Antes solo se borraba la copia
    // local y, al recargar la página, el usuario volvía a estar dentro.
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.error('Error al cerrar la sesión de Firebase Auth:', e);
    }
    localStorage.removeItem('currentUser');
    setUser(null); setConfig(null); setFinancialData(null); setErrorGuardado(null);
    navigate('/');
  };

  const commonProps = { data: financialData?.[selectedYear], year: selectedYear, categories: financialData?.[selectedYear]?.categories || config?.categories, onUpdate: updateFD, fullData: financialData, onUpdateCfg: updateCfg, config, budgetData: financialData?.[selectedYear]?.budget };

  const renderView = () => {
    if (loading) return <div className="loading-state"><div className="spinner" /><span>Cargando...</span></div>;
    if (error) return <div className="loading-state" style={{ color: 'var(--red)' }}>{error}</div>;
    if (!financialData || !config) return <div className="loading-state"><div className="spinner" /></div>;

    // Check user visibility preference (Settings is always allowed if permission exists)
    const isVisible = config?.visibleViews?.includes(activeView) || activeView === 'settings';
    if (!isVisible && activeView !== 'users') return <AccessDenied />;

    switch (activeView) {
      case 'dashboard':
        if (!hasPermission(user, 'dashboard')) return <AccessDenied />;
        return <DashboardView {...commonProps} mode={dashboardMode} setMode={setDashboardMode} budgetLocked={budgetLocked} setBudgetLocked={setBudgetLocked} visibleBudgetSections={config.visibleBudgetSections} visibleViews={config.visibleViews} />;
      case 'monthly':
        if (!hasPermission(user, 'monthly')) return <AccessDenied />;
        return <MonthlyView {...commonProps} month={selectedMonth} currentMonthData={financialData[selectedYear]?.monthly?.[selectedMonth]} />;
      case 'networth':
        if (!hasPermission(user, 'networth')) return <AccessDenied />;
        return <NetWorthView {...commonProps} data={financialData[selectedYear]?.netWorth} />;
      case 'loans':
        if (!hasPermission(user, 'loans')) return <AccessDenied />;
        return <LoansView loans={financialData?.loans || []} onUpdate={updateFD} fullData={financialData} userId={userId} onUpdateCfg={updateCfg} config={config} />;
      case 'trading':
        if (!hasPermission(user, 'trading')) return <AccessDenied />;
        return <TradingView trades={financialData?.trading || []} onUpdate={updateFD} fullData={financialData} />;
      case 'analysis':
        if (!hasPermission(user, 'analysis')) return <AccessDenied />;
        return <AnalysisView />;
      case 'settings':
        if (!hasPermission(user, 'settings')) return <AccessDenied />;
        return <SettingsView config={config} selectedYear={selectedYear} onUpdate={updateCfg} financialData={financialData} onUpdateFD={updateFD} user={user} onUpdateProfile={updateProfile} onUpdateVisibility={updateVisibleViews} onStartTutorial={() => setShowTutorial(true)} />;
      case 'users':
        if (!hasPermission(user, 'users')) return <AccessDenied />;
        return <UserManagementView />;
      default: return null;
    }
  };

  const AccessDenied = () => (
    <div className="loading-state" style={{ color: 'var(--red)', flexDirection: 'column', textAlign: 'center', padding: 40 }}>
      <Ic d={PATHS.lock} size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
      <div style={{ fontWeight: 800, fontSize: 18 }}>Acceso Restringido</div>
      <div style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 8, maxWidth: 300 }}>
        El usuario <b>{user.displayName}</b> no tiene permisos para acceder a <b>{activeView}</b>.
      </div>
      <button className="btn btn-primary" style={{ marginTop: 24 }} onClick={() => {
        const primera = PERMISSIONS.find(p => hasPermission(user, p.id) && (config?.visibleViews?.includes(p.id) || p.id === 'settings'));
        setActiveView(primera ? primera.id : 'settings');
      }}>
        Volver al Inicio
      </button>
    </div>
  );

  return (
    <div className={`app-shell ${theme === 'light' ? 'light' : ''}`}>
      {!sidebarCollapsed && <div className="sidebar-overlay" onClick={() => setSidebarCollapsed(true)} />}
      <Sidebar activeView={activeView} setActiveView={(v) => { setActiveView(v); setSidebarCollapsed(true); }} onSignOut={signOut} user={user} collapsed={sidebarCollapsed} config={config} />
      <div className="main-content">
        <Topbar
          activeView={activeView}
          setActiveView={setActiveView}
          user={user}
          sidebarCollapsed={sidebarCollapsed}
          toggleSidebar={() => setSidebarCollapsed(p => !p)}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          appName='FinanziApp'
          financialData={financialData}
          dashboardMode={dashboardMode}
          setDashboardMode={setDashboardMode}
        />
        <AvisoSuscripcion user={user} />
        {errorGuardado && (
          <div role="alert" style={{
            margin: '12px 16px 0', padding: '12px 16px', borderRadius: 10,
            display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
            background: 'rgba(220,38,38,.10)', border: '1px solid rgba(220,38,38,.45)'
          }}>
            <span style={{ fontSize: 20, lineHeight: 1 }}>⚠️</span>
            <div style={{ flex: 1, minWidth: 220, fontSize: 13 }}><b>No se ha guardado.</b> {errorGuardado}</div>
            <button className="btn btn-ghost" onClick={() => setErrorGuardado(null)}>Cerrar</button>
          </div>
        )}
        <div className="page-content fade-in">{renderView()}</div>
      </div>
      {showTutorial && (
        <TutorialWizard
          activeView={activeView}
          setActiveView={setActiveView}
          dashboardMode={dashboardMode}
          onClose={() => setShowTutorial(false)}
          onComplete={() => { const nc = { ...config, tutorialCompleted: true }; updateCfg(nc); setShowTutorial(false); }}
        />
      )}
    </div>
  );
}

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
function Sidebar({ activeView, setActiveView, onSignOut, user, collapsed, config }) {
  const { t } = useApp();
  const navItems = PERMISSIONS.filter(p => {
    const isPermitted = hasPermission(user, p.id);
    const isVisible = config?.visibleViews?.includes(p.id) || p.id === 'settings'; // Settings always visible for user
    return isPermitted && isVisible;
  });
  return (
    <nav className={`sidebar ${collapsed ? 'collapsed' : 'mobile-open'}`}>
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon" style={{ background: 'var(--accent)', color: 'white', borderRadius: '10px', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px var(--accent-light)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
            <polyline points="16 7 22 7 22 13" />
          </svg>
        </div>
        {!collapsed && <span className="sidebar-logo-text" style={{ letterSpacing: '0.5px', fontWeight: 800, color: 'var(--text-primary)' }}>Finanzi<span style={{ color: 'var(--accent)' }}>App</span></span>}
      </div>
      <div className="sidebar-nav">
        {navItems.map(item => (
          <button key={item.id} className={`nav-item ${activeView === item.id ? 'active' : ''}`} onClick={() => setActiveView(item.id)} title={collapsed ? item.label : ''}>
            <Ic d={item.icon} size={18} />
            {!collapsed && <span className="nav-label">{item.label}</span>}
          </button>
        ))}
      </div>
      <div className="sidebar-footer">
        <div className="user-info" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ fontSize: 24, background: 'var(--bg-input)', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {user?.avatar || '👤'}
          </div>
          {!collapsed && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="user-name" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.displayName}</div>
              <div className={`badge ${user?.isAdmin ? 'badge-accent' : 'badge-ghost'}`} style={{ fontSize: 9, marginTop: 2 }}>
                {user?.isAdmin ? 'ADMIN' : 'USUARIO'}
              </div>
            </div>
          )}
        </div>
        <button className="signout-btn" onClick={onSignOut} title={collapsed ? t.signOut : ''}>
          <Ic d={PATHS.signout} size={16} />
          {!collapsed && <span>{t.signOut}</span>}
        </button>
      </div>
    </nav>
  );
}

const TOPBAR_STYLES = `
  @media (min-width: 800px) {
    .desktop-only-flex { display: block !important; }
  }
  .nav-item-hover:hover {
    background: var(--bg-card-hover) !important;
  }
  .grid-5 {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 20px;
  }
  .budget-header-card {
    padding: 12px;
    border-radius: 12px 12px 0 0;
    font-weight: 800;
    font-size: 13px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--text-on-accent);
    letter-spacing: 0.05em;
  }
  .remanente-card {
    padding: 12px 24px;
    border-radius: 16px;
    text-align: center;
    box-shadow: var(--shadow);
    border: 1px solid var(--border);
    min-width: 200px;
  }
  .remanente-card.positive { background: var(--bg-card); border-color: var(--green); color: var(--green); box-shadow: 0 0 20px var(--green-light); }
  .remanente-card.negative { background: var(--bg-card); border-color: var(--red); color: var(--red); box-shadow: 0 0 20px var(--red-light); }
  .remanente-card.zero { background: var(--bg-card); border-color: var(--accent); color: var(--accent); box-shadow: 0 0 20px var(--accent-light); }
`;

// ─── TOPBAR ──────────────────────────────────────────────────────────────────
function Topbar({ activeView, setActiveView, user, sidebarCollapsed, toggleSidebar, selectedYear, setSelectedYear, selectedMonth, setSelectedMonth, financialData, dashboardMode, setDashboardMode }) {
  const { t } = useApp();
  const titles = { dashboard: t.dashboard, monthly: t.monthly, networth: t.networth, loans: t.loans, trading: 'Trading', analysis: 'Análisis', settings: t.settings, users: 'Gestión' };
  return (
    <div className="topbar">
      <div className="topbar-left">
        <button className="toggle-btn" onClick={toggleSidebar} title={sidebarCollapsed ? t.expandMenu : t.collapseMenu}>
          <Ic d={sidebarCollapsed ? PATHS.menu : "M18 6L6 18M6 6l12 12"} size={16} />
        </button>
        <span className="topbar-title">{titles[activeView] || activeView}</span>
      </div>
      <div className="topbar-right" style={{ gap: 16 }}>
        {activeView === 'dashboard' && (
          <div className="settings-toggle">
            <button className={`settings-toggle-btn ${dashboardMode === 'charts' ? 'active' : ''}`} onClick={() => setDashboardMode('charts')}>{t.charts}</button>
            <button className={`settings-toggle-btn ${dashboardMode === 'budget' ? 'active' : ''}`} onClick={() => setDashboardMode('budget')}>{t.budgetMode}</button>
          </div>
        )}
        <select className="select-input" style={{ width: 'auto' }} value={selectedYear} onChange={e => setSelectedYear(parseInt(e.target.value))}>
          {(() => {
            const dataYears = Object.keys(financialData || {}).filter(y => !isNaN(parseInt(y))).map(y => parseInt(y));
            if (!dataYears.length) dataYears.push(new Date().getFullYear());
            let minYear = Math.min(...dataYears);
            let maxYear = Math.max(...dataYears, new Date().getFullYear() + 4);
            (financialData?.loans || []).forEach(l => {
              if (l.startDate) {
                const sy = new Date(l.startDate).getFullYear();
                if (sy < minYear) minYear = sy;
                const count = l.installmentsCount || 1;
                const ey = new Date(new Date(l.startDate).setMonth(new Date(l.startDate).getMonth() + count)).getFullYear();
                if (ey > maxYear) maxYear = ey;
              }
            });
            const valid = [];
            for (let i = minYear; i <= maxYear; i++) {
              const hasData = financialData?.[i] && (Object.keys(financialData[i]?.oneTime || {}).some(k => financialData[i].oneTime[k].length > 0) || Object.keys(financialData[i]?.monthly?.enero || {}).some(k => financialData[i].monthly.enero[k]?.actual?.length > 0));
              if (i <= new Date().getFullYear() + 4 || hasData || (financialData?.loans || []).some(l => {
                const sy = new Date(l.startDate).getFullYear();
                const ey = new Date(new Date(l.startDate).setMonth(new Date(l.startDate).getMonth() + (l.installmentsCount || 1))).getFullYear();
                return i >= sy && i <= ey;
              })) {
                valid.push(i);
              }
            }
            return valid.map(y => <option key={y} value={y}>{y}</option>);
          })()}
        </select>
        {activeView === 'monthly' && (
          <select className="select-input" style={{ width: 'auto', textTransform: 'capitalize' }} value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
            {months.map(m => <option key={m} value={m} style={{ textTransform: 'capitalize' }}>{m}</option>)}
          </select>
        )}

        <div style={{ height: 32, width: 1, background: 'var(--border)', margin: '0 4px' }} />

        <button
          onClick={() => setActiveView('settings')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'none',
            border: 'none',
            padding: '4px 8px',
            borderRadius: 12,
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
          className="nav-item-hover"
        >
          <div style={{ fontSize: 13, fontWeight: 700, textAlign: 'right', display: 'none', flexShrink: 0 }} className="desktop-only-flex">
            <div style={{ color: 'var(--text-primary)', lineHeight: 1 }}>{user?.displayName}</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, marginTop: 2 }}>{user?.isAdmin ? 'ADMIN' : 'USUARIO'}</div>
          </div>
          <div style={{
            width: 38, height: 38,
            borderRadius: 12,
            background: 'var(--bg-input)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22,
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            {user?.avatar || '👤'}
          </div>
        </button>
      </div>
      <style dangerouslySetInnerHTML={{ __html: TOPBAR_STYLES }} />
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
const CHART_COLORS = ["#2dd4bf", "#38bdf8", "#fbbf24", "#f43f5e", "#818cf8", "#a78bfa", "#f472b6", "#fb923c", "#4ade80"];

// ─── BUDGET INPUT ─────────────────────────────────────────────────────────────
const BudgetInput = ({ value, disabled, onSave }) => {
  const [val, setVal] = useState(value);
  useEffect(() => { setVal(value); }, [value]);
  return (
    <input 
      type="number" 
      className="budget-input" 
      value={val}
      disabled={disabled}
      onChange={e => setVal(e.target.value)}
      onBlur={() => {
        const num = parseFloat(val) || 0;
        if (num !== value) onSave(num);
      }}
    />
  );
};

const DeleteConfirmButton = ({ onDelete }) => {
  const [confirming, setConfirming] = useState(false);
  if (confirming) {
    return (
      <div style={{ display: 'flex', gap: 4 }}>
        <button className="btn btn-danger" style={{ padding: '2px 6px', fontSize: 10, borderRadius: 4 }} onClick={onDelete}>OK</button>
        <button className="btn btn-secondary" style={{ padding: '2px 6px', fontSize: 10, borderRadius: 4 }} onClick={() => setConfirming(false)}>✕</button>
      </div>
    );
  }
  return (
    <button className="btn btn-icon btn-danger" style={{ width: 18, height: 18, padding: 0 }} onClick={() => setConfirming(true)}>
      <Ic d="M6 18L18 6M6 6l12 12" size={10} />
    </button>
  );
};

const RenameSpan = ({ sub, onRename, disabled }) => {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(sub);
  
  if (editing && !disabled) {
    return <input autoFocus value={val} onChange={e => setVal(e.target.value)} onBlur={() => {
      setEditing(false);
      const newName = val.trim();
      if (newName && newName !== sub) onRename(newName);
      else setVal(sub);
    }} onKeyDown={e => {
      if (e.key === 'Enter') e.target.blur();
      if (e.key === 'Escape') { setVal(sub); setEditing(false); }
    }} style={{ padding: '2px 4px', fontSize: 12, width: '100%', background: 'var(--bg)', color: 'var(--text-primary)', border: '1px solid var(--accent)', borderRadius: 4 }} />;
  }
  return (
    <span style={{ flex: 1, cursor: disabled ? 'default' : 'pointer' }} title={disabled ? '' : 'Click para renombrar'} onClick={() => { if (!disabled) setEditing(true); }}>
      {sub}
    </span>
  );
};

function DashboardView({ data, year, categories, onUpdate, fullData, onUpdateCfg, config, mode, setMode, budgetLocked, setBudgetLocked, visibleBudgetSections, visibleViews }) {
  const { t, theme } = useApp();
  const [addingTo, setAddingTo] = useState(null);
  const [newSub, setNewSub] = useState('');
  const [editandoDashboard, setEditandoDashboard] = useState(false);

  if (!data) return <div className="loading-state">{t.noData} {year}</div>;

  const isDark = theme === 'dark';
  const tooltipStyle = { backgroundColor: isDark ? '#1e2130' : '#fff', border: `1px solid ${isDark ? '#2d3148' : '#e2e5f0'}`, borderRadius: 8, fontSize: 12 };
  const axisColor = isDark ? '#565d80' : '#9098b8';
  const gridColor = isDark ? '#2d3148' : '#e2e5f0';

  const expenseKeys = EXPENSE_KEYS;

  const monthlyTotals = months.map((m, mIdx) => {
    let income = (categories["Ingresos"] || []).reduce((s, sub) => s + calcTotal(data.monthly?.[m]?.[sub]?.actual || []), 0);
    let expenses = expenseKeys.reduce((s, mk) => s + (categories[mk] || []).reduce((ss, sub) => {
      let val = calcTotal(data.monthly?.[m]?.[sub]?.actual || []);
      // Inject loan payments as actual expenses in charts
      if (mk === 'Pago de Deudas' && fullData.loans) {
        const loan = fullData.loans.find(l => l.name === sub);
        if (loan) {
          const lv = getLoanValues(loan, year, mIdx);
          if (lv.active) val += lv.installment;
        }
      }
      return ss + val;
    }, 0), 0);
    return { name: m.substring(0, 3).toUpperCase(), income, expenses };
  });

  const totalIncome = monthlyTotals.reduce((s, i) => s + i.income, 0);
  const totalExpenses = monthlyTotals.reduce((s, i) => s + i.expenses, 0);
  const totalSavings = totalIncome - totalExpenses;

  const expenseDist = [];
  expenseKeys.forEach(mk => (categories[mk] || []).forEach(sub => {
    let v = months.reduce((s, m, mIdx) => {
      let val = calcTotal(data.monthly?.[m]?.[sub]?.actual || []);
      if (mk === 'Pago de Deudas' && fullData.loans) {
        const loan = fullData.loans.find(l => l.name === sub);
        if (loan) {
          const lv = getLoanValues(loan, year, mIdx);
          if (lv.active) val += lv.installment;
        }
      }
      return s + val;
    }, 0);
    if (v > 0) expenseDist.push({ name: sub, value: v });
  }));

  // Budget calculations
  const monthsPassed = year === new Date().getFullYear() ? new Date().getMonth() + 1 : 12;

  const getSubsWithOneTime = (mk) => Array.from(new Set([
    ...(categories[mk] || []),
    ...months.flatMap(m => (data.oneTime?.[m] || []).filter(ot => ot.cat === mk).map(ot => ot.sub))
  ]));

  const incomeVsActual = getSubsWithOneTime("Ingresos").map(c => {
    let budgetedTotal = getEffectiveBudget(c, "Ingresos", year, -1, fullData, data.budget) * monthsPassed;
    budgetedTotal += months.slice(0, monthsPassed).reduce((acc, m) => acc + (data.oneTime?.[m] || []).filter(ot => ot.cat === "Ingresos" && ot.sub === c).reduce((ss, ot) => ss + ot.amount, 0), 0);
    const actual = months.slice(0, monthsPassed).reduce((s, m) => s + calcTotal(data.monthly?.[m]?.[c]?.actual || []), 0);
    return { name: c, budgeted: budgetedTotal, actual };
  }).filter(i => i.budgeted > 0 || i.actual > 0);

  const expenseVsActual = expenseKeys.map(mk => {
    const subs = getSubsWithOneTime(mk);
    const budgetedTotal = subs.reduce((s, sub) => {
      let b = getEffectiveBudget(sub, mk, year, -1, fullData, data.budget) * monthsPassed;
      b += months.slice(0, monthsPassed).reduce((acc, m) => acc + (data.oneTime?.[m] || []).filter(ot => ot.cat === mk && ot.sub === sub).reduce((ss, ot) => ss + ot.amount, 0), 0);
      return s + b;
    }, 0);

    const actual = months.slice(0, monthsPassed).reduce((s, m, mIdx) => s + subs.reduce((ss, sub) => {
      let val = calcTotal(data.monthly?.[m]?.[sub]?.actual || []);
      if (mk === 'Pago de Deudas' && fullData.loans) {
        const loan = fullData.loans.find(l => l.name === sub);
        if (loan) {
          const lv = getLoanValues(loan, year, mIdx);
          if (lv.active) val += lv.installment;
        }
      }
      return ss + val;
    }, 0), 0);
    return { name: mk.replace('Gastos ', '').replace('Ahorro e Inversión', 'Ahorro'), budgeted: budgetedTotal, actual };
  }).filter(i => i.budgeted > 0 || i.actual > 0);

  const totalIncomeBudgeted = getSubsWithOneTime("Ingresos").reduce((s, sub) => {
    let b = getEffectiveBudget(sub, "Ingresos", year, -1, fullData, data.budget);
    b += months.reduce((acc, m) => acc + (data.oneTime?.[m] || []).filter(ot => ot.cat === "Ingresos" && ot.sub === sub).reduce((ss, ot) => ss + ot.amount, 0), 0) / 12;
    return s + b;
  }, 0);
  
  const totalExpensesBudgeted = expenseKeys.reduce((s, mk) => s + getSubsWithOneTime(mk).reduce((ss, sub) => {
    let b = getEffectiveBudget(sub, mk, year, -1, fullData, data.budget);
    b += months.reduce((acc, m) => acc + (data.oneTime?.[m] || []).filter(ot => ot.cat === mk && ot.sub === sub).reduce((sss, ot) => sss + ot.amount, 0), 0) / 12;
    return ss + b;
  }, 0), 0);
  const remanente = totalIncomeBudgeted - totalExpensesBudgeted;

  // Mismo cálculo que la pestaña Trading (las operaciones no llevan un campo
  // pnl: el resultado se obtiene cerrando posiciones contra el precio medio).
  const tradingStats = procesarTrades(fullData.trading || []);
  const tradingPnL = tradingStats.totalRealizedPnL;
  const tradingCerradas = tradingStats.wins + tradingStats.losses;
  const winRate = tradingCerradas > 0 ? (tradingStats.wins / tradingCerradas * 100).toFixed(1) : 0;

  const renderBudgetTable = (mk) => {
    const subs = categories[mk] || [];
    if (!subs.length) return null;

    const total = subs.reduce((s, sub) => s + getEffectiveBudget(sub, mk, year, -1, fullData, data.budget), 0);

    return (
      <div className={`card ${budgetLocked ? 'budget-locked' : ''}`} key={mk} style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div className="budget-header-card" style={{ backgroundColor: getCategoryColor(mk) }}>
          <span>{(t[mk] || mk).toUpperCase()}</span>
          <button className="btn btn-icon" style={{ padding: 4, height: 24, width: 24, background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white' }}
            onClick={() => { setAddingTo(mk); setNewSub(''); }}>
            <Ic d={PATHS.plus} size={14} />
          </button>
        </div>
        <div className="table-wrap" style={{ flex: 1, borderBottom: '1px solid var(--border)' }}>
          <table style={{ margin: 0 }}>
            <thead><tr><th>{t.category}</th><th className="text-right">{t.monthlyAmount}</th></tr></thead>
            <tbody>
              {subs.map(sub => {
                const loan = mk === 'Pago de Deudas' && fullData.loans?.find(l => l.name === sub);
                const isLoan = !!loan;
                const val = getEffectiveBudget(sub, mk, year, -1, fullData, data.budget);
                return (
                  <tr key={sub} className={isLoan ? 'loan-row' : ''}>
                    <td>
                      {isLoan ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span>{sub} <span className="loan-badge" title={t.loanLocked}><Ic d={PATHS.lock} size={10} /></span></span>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          {!budgetLocked && (
                            <DeleteConfirmButton onDelete={() => {
                              const nc = JSON.parse(JSON.stringify(config));
                              nc.categories[mk] = nc.categories[mk].filter(s => s !== sub);
                              onUpdateCfg(nc);

                              const nd = JSON.parse(JSON.stringify(fullData));
                              // Solo el año seleccionado y los posteriores: los años anteriores conservan su historial.
                              const yKeys = Object.keys(nd).filter(k => !isNaN(parseInt(k)) && parseInt(k) >= year);
                              yKeys.forEach(y => {
                                if (nd[y].categories?.[mk]) {
                                  nd[y].categories[mk] = nd[y].categories[mk].filter(s => s !== sub);
                                }
                                if (nd[y].budget) delete nd[y].budget[sub];
                                months.forEach(m => { if (nd[y].monthly?.[m]) delete nd[y].monthly[m][sub]; });
                                if (mk === 'Activos' && nd[y].netWorth?.assets?.[sub]) delete nd[y].netWorth.assets[sub];
                                if (mk === 'Pasivos' && nd[y].netWorth?.liabilities?.[sub]) delete nd[y].netWorth.liabilities[sub];
                              });
                              onUpdate(nd);
                            }} />
                          )}
                          <RenameSpan 
                            sub={sub} 
                            disabled={budgetLocked} 
                            onRename={newName => {
                              const nc = JSON.parse(JSON.stringify(config));
                              nc.categories[mk] = nc.categories[mk].map(s => s === sub ? newName : s);
                              onUpdateCfg(nc);

                              const nd = JSON.parse(JSON.stringify(fullData));
                              // Solo el año seleccionado y los posteriores.
                              const yKeys = Object.keys(nd).filter(k => !isNaN(parseInt(k)) && parseInt(k) >= year);
                              yKeys.forEach(y => {
                                if (nd[y].categories?.[mk]) {
                                  nd[y].categories[mk] = nd[y].categories[mk].map(s => s === sub ? newName : s);
                                }
                                if (nd[y].budget && nd[y].budget[sub] !== undefined) {
                                  nd[y].budget[newName] = nd[y].budget[sub];
                                  delete nd[y].budget[sub];
                                }
                                months.forEach(m => {
                                  if (nd[y].monthly?.[m]?.[sub]) {
                                    nd[y].monthly[m][newName] = nd[y].monthly[m][sub];
                                    delete nd[y].monthly[m][sub];
                                  }
                                });
                                if (mk === 'Activos' && nd[y].netWorth?.assets?.[sub]) {
                                  nd[y].netWorth.assets[newName] = nd[y].netWorth.assets[sub];
                                  delete nd[y].netWorth.assets[sub];
                                }
                                if (mk === 'Pasivos' && nd[y].netWorth?.liabilities?.[sub]) {
                                  nd[y].netWorth.liabilities[newName] = nd[y].netWorth.liabilities[sub];
                                  delete nd[y].netWorth.liabilities[sub];
                                }
                              });
                              onUpdate(nd);
                            }} 
                          />
                        </div>
                      )}
                    </td>
                    <td className="text-right">
                      {isLoan ? (
                        <span style={{ fontWeight: 600, paddingRight: 4, color: 'var(--text-muted)' }}>{fmt(val)}</span>
                      ) : (
                        <BudgetInput 
                          value={data.budget?.[sub] || 0}
                          disabled={budgetLocked}
                          onSave={v => {
                            const nd = JSON.parse(JSON.stringify(fullData));
                            // El importe del presupuesto es propio de cada año: no se copia a los años siguientes
                            // (al crear un año nuevo ya se hereda el presupuesto del anterior).
                            const yKeys = Object.keys(nd).filter(k => parseInt(k) === year);
                            yKeys.forEach(k => {
                              if (!nd[k].budget) nd[k].budget = {};
                              nd[k].budget[sub] = v;
                              if (!nd[k].monthly) {
                                nd[k].monthly = {};
                                months.forEach(mo => nd[k].monthly[mo] = {});
                              }
                              months.forEach(mo => {
                                if (!nd[k].monthly[mo]) nd[k].monthly[mo] = {};
                                if (!nd[k].monthly[mo][sub]) nd[k].monthly[mo][sub] = { budgeted: 0, actual: [] };
                                nd[k].monthly[mo][sub].budgeted = v;
                              });
                            });
                            onUpdate(nd);
                          }} 
                        />
                      )}
                    </td>
                  </tr>
                );
              }).filter(row => row !== null)}
              {addingTo === mk && (
                <tr>
                  <td colSpan={2} style={{ padding: '8px 12px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <input 
                        autoFocus
                        placeholder="Añadir subcategoría..."
                        className="text-input"
                        style={{ flex: 1, padding: '4px 8px', fontSize: 13, border: '1px solid var(--accent)' }}
                        value={newSub}
                        onChange={e => setNewSub(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' && newSub.trim()) {
                            const sub = newSub.trim();
                            const nc = JSON.parse(JSON.stringify(config));
                            if (!nc.categories[mk]) nc.categories[mk] = [];
                            if (!nc.categories[mk].includes(sub)) {
                              nc.categories[mk].push(sub);
                              nc.categories[mk].sort();
                            }
                            onUpdateCfg(nc);

                            const nd = JSON.parse(JSON.stringify(fullData));
                            // Solo el año seleccionado y los posteriores.
                            const yKeys = Object.keys(nd).filter(k => !isNaN(parseInt(k)) && parseInt(k) >= year);
                            yKeys.forEach(y => {
                              if (!nd[y].categories) nd[y].categories = JSON.parse(JSON.stringify(nc.categories));
                              if (!nd[y].categories[mk]) nd[y].categories[mk] = [];
                              if (!nd[y].categories[mk].includes(sub)) {
                                nd[y].categories[mk].push(sub);
                                nd[y].categories[mk].sort();
                              }
                              if (!nd[y].budget) nd[y].budget = {};
                              if (nd[y].budget[sub] === undefined) nd[y].budget[sub] = 0;
                              if (!nd[y].monthly) nd[y].monthly = {};
                              months.forEach(m => {
                                if (!nd[y].monthly[m]) nd[y].monthly[m] = {};
                                if (!nd[y].monthly[m][sub]) nd[y].monthly[m][sub] = { budgeted: 0, actual: [] };
                              });
                            });
                            onUpdate(nd);
                            setAddingTo(null);
                            setNewSub('');
                          } else if (e.key === 'Escape') {
                            setAddingTo(null);
                            setNewSub('');
                          }
                        }}
                      />
                      <button className="btn btn-secondary" style={{ padding: '0 8px' }} onClick={() => { setAddingTo(null); setNewSub(''); }}>
                        ✕
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', background: 'var(--bg-card)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', fontSize: 13 }}>
            <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>Total</span>
            <span className="text-right" style={{ fontWeight: 800, color: getCategoryColor(mk) }}>{fmt(total)}</span>
          </div>
          {mk !== 'Ingresos' && totalIncomeBudgeted > 0 && (
            <div style={{ padding: '8px 12px', borderTop: '1px solid var(--border)', fontSize: 11, fontWeight: 700, textAlign: 'center', background: 'rgba(255,255,255,0.02)' }}>
              <span style={{ color: getCategoryColor(mk) }}>{((total / totalIncomeBudgeted) * 100).toFixed(1)}%</span> del presupuesto
            </div>
          )}
        </div>
      </div>
    );
  };

  if (mode === 'budget') {
    const categoriesList = ALL_MAIN_KEYS;

    const handleAddOneTime = (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const cat = fd.get('cat');
      const sub = fd.get('sub');
      const activeMonths = months.filter(m => fd.get(`month_${m}`) === 'on');
      const amount = parseFloat(fd.get('amount'));

      if (!cat || !sub || activeMonths.length === 0 || isNaN(amount)) {
        alert('Por favor, selecciona al menos un mes e introduce un importe válido.');
        return;
      }

      const nd = JSON.parse(JSON.stringify(fullData));
      activeMonths.forEach(m => {
        if (!nd[year].oneTime) nd[year].oneTime = {};
        if (!nd[year].oneTime[m]) nd[year].oneTime[m] = [];
        nd[year].oneTime[m].push({ id: crypto.randomUUID(), cat, sub, amount });
      });
      onUpdate(nd);
      e.target.reset();
    };

    const handleDeleteOneTime = (month, id) => {
      const nd = JSON.parse(JSON.stringify(fullData));
      nd[year].oneTime[month] = nd[year].oneTime[month].filter(x => x.id !== id);
      onUpdate(nd);
    };

    return (
      <div className="section-gap" style={{ marginTop: 20 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 24, marginBottom: 32 }}>
          <div>
            <h2 style={{ fontSize: 32, fontWeight: 900, margin: 0, letterSpacing: '-0.04em' }}>PRESUPUESTO ANUAL</h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '4px 0 0' }}>Planifica tus finanzas mensuales para {year}.</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className={`remanente-card ${remanente > 0 ? 'positive' : remanente < 0 ? 'negative' : 'zero'}`}>
              <div style={{ fontSize: 10, fontWeight: 800, opacity: 0.8, marginBottom: 4 }}>REMANENTE MENSUAL</div>
              <div style={{ fontSize: 24, fontWeight: 900 }}>{fmt(remanente)}</div>
            </div>
            <button className={`btn ${budgetLocked ? 'btn-ghost' : 'btn-primary'}`} style={{ height: 60, padding: '0 24px', borderRadius: 16 }} onClick={() => setBudgetLocked(!budgetLocked)}>
              <Ic d={budgetLocked ? PATHS.lock : PATHS.unlock} size={18} style={{ marginRight: 8 }} />
              {budgetLocked ? 'Desbloquear Edición' : 'Bloquear Edición'}
            </button>
          </div>
        </div>

        <div className="grid-5">
          {(visibleBudgetSections || ALL_MAIN_KEYS).map(section => renderBudgetTable(section))}
        </div>

        <div className="section-gap">

          {/* One-time Expenses Table */}
          <div className="card one-time-section">
            <div className="one-time-title">
              <Ic d={PATHS.plus} size={16} />
              {t.oneTimeExpenses}
            </div>
            <form onSubmit={handleAddOneTime} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <select name="cat" className="select-input" required>
                  <option value="">{t.category}</option>
                  {categoriesList.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input name="sub" type="text" className="text-input" placeholder="Nombre (ej. Paga extra)" required />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Seleccionar meses:</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                  {months.map(m => (
                    <label key={m} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, cursor: 'pointer' }}>
                      <input type="checkbox" name={`month_${m}`} /> {m.slice(0, 3)}
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <input name="amount" type="number" step="0.01" className="text-input" placeholder="0.00" required />
                <button type="submit" className="btn btn-primary" style={{ padding: '0 15px' }}>
                  {t.add}
                </button>
              </div>
            </form>

            <div className="table-wrap" style={{ maxHeight: 200, overflowY: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>{t.month}</th>
                    <th>{t.category}</th>
                    <th className="text-right">{t.amount}</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const manualMap = new Map();
                    months.forEach(m => {
                      (data.oneTime?.[m] || []).forEach(x => {
                        const key = `${x.cat}-${x.sub}-${x.amount}`;
                        if (!manualMap.has(key)) manualMap.set(key, { ...x, months: [m] });
                        else manualMap.get(key).months.push(m);
                      });
                    });

                    const loanMap = new Map();
                    fullData.loans?.filter(l => !isLoanFullYear(l, year)).forEach(loan => {
                      months.forEach((m, mIdx) => {
                        const lv = getLoanValues(loan, year, mIdx);
                        if (lv.active) {
                          const k = `${loan.id}-${lv.installment}`;
                          if (!loanMap.has(k)) loanMap.set(k, { id: loan.id, name: loan.name, amount: lv.installment, months: [m] });
                          else loanMap.get(k).months.push(m);
                        }
                      });
                    });

                    const rows = [];
                    manualMap.forEach(x => {
                      rows.push(
                        <tr key={x.id}>
                          <td style={{ fontSize: 10, color: 'var(--accent)', fontWeight: 600 }}>
                            {x.months.map(m => m.slice(0, 3)).join(', ')}
                          </td>
                          <td style={{ fontSize: 11 }}>{x.sub}</td>
                          <td className="text-right" style={{ fontWeight: 600 }}>{fmt(x.amount)}</td>
                          <td className="text-right">
                            <button className="btn btn-icon btn-danger" style={{ width: 22, height: 22 }} onClick={() => {
                              const nd = JSON.parse(JSON.stringify(fullData));
                              x.months.forEach(m => { if (nd[year].oneTime?.[m]) nd[year].oneTime[m] = nd[year].oneTime[m].filter(ot => ot.id !== x.id); });
                              onUpdate(nd);
                            }}>
                              <Ic d={PATHS.trash} size={11} />
                            </button>
                          </td>
                        </tr>
                      );
                    });

                    loanMap.forEach(x => {
                      rows.push(
                        <tr key={`auto-${x.id}`} className="loan-row-puntual">
                          <td style={{ fontSize: 10, color: 'var(--blue)', fontWeight: 600 }}>
                            {x.months.map(m => m.slice(0, 3)).join(', ')}
                          </td>
                          <td style={{ fontSize: 11 }}>
                            {x.name} <span style={{ color: 'var(--blue)', marginLeft: 4 }} title={t.loanLocked}><Ic d={PATHS.lock} size={10} /></span>
                          </td>
                          <td className="text-right" style={{ fontWeight: 600, color: 'var(--blue)' }}>{fmt(x.amount)}</td>
                          <td></td>
                        </tr>
                      );
                    });

                    return rows.length > 0 ? rows : (
                      <tr><td colSpan={4} className="text-center" style={{ padding: 20, color: 'var(--text-muted)' }}>{t.noData}</td></tr>
                    );
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Net worth chart data (only if networth view is visible)
  const showNetWorth = (visibleViews || []).includes('networth');
  const netWorthChartData = showNetWorth ? months.map((m, mIdx) => {
    let totalAssets = (categories["Activos"] || []).reduce((s, c) => s + (data?.netWorth?.assets?.[c]?.[m] || 0), 0);
    let totalLiab = (categories["Pasivos"] || []).reduce((s, c) => s + (data?.netWorth?.liabilities?.[c]?.[m] || 0), 0);
    if (fullData.loans) {
      fullData.loans.forEach(loan => {
        const lv = getLoanValues(loan, year, mIdx);
        if (lv.active) totalLiab += lv.balance;
      });
    }
    return { name: m.substring(0, 3).toUpperCase(), [t.assets]: totalAssets, [t.liabilities]: totalLiab, nw: totalAssets - totalLiab };
  }) : [];

  // Loan progress data (only if loans view is visible)
  const showLoans = (visibleViews || []).includes('loans');
  const loansData = showLoans ? (fullData.loans || []).map(loan => {
    const start = fechaLocal(loan.startDate);
    const now = new Date();
    const totalCuotas = simularPrestamo(loan).length || loan.installmentsCount;
    const diffMonths = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
    const passed = Math.max(0, Math.min(totalCuotas, diffMonths + 1));
    const progress = (passed / totalCuotas) * 100;
    return { name: loan.name, progress, passed, total: totalCuotas, amount: loan.totalAmount };
  }) : [];

  // Trading data (only if trading view is visible)
  const showTrading = (visibleViews || []).includes('trading');

  // Monthly savings data
  const monthlySavingsData = monthlyTotals.map(m => ({
    name: m.name,
    savings: m.income - m.expenses,
  }));

  // ─── Datos para los bloques del dashboard ─────────────────────────────────
  const esAnioActual = year === new Date().getFullYear();
  const totalesHasta = monthlyTotals.slice(0, monthsPassed);
  const ingresosYTD = totalesHasta.reduce((s, m) => s + m.income, 0);
  const gastosYTD = totalesHasta.reduce((s, m) => s + m.expenses, 0);
  const ahorroYTD = ingresosYTD - gastosYTD;
  const tasaAhorro = ingresosYTD > 0 ? (ahorroYTD / ingresosYTD) * 100 : null;

  const mesesConGasto = totalesHasta.filter(m => m.expenses > 0).length;
  const gastoMedioMensual = mesesConGasto > 0 ? gastosYTD / mesesConGasto : totalExpensesBudgeted;
  const mesesConIngreso = totalesHasta.filter(m => m.income > 0).length;
  const ingresoMedioMensual = mesesConIngreso > 0 ? ingresosYTD / mesesConIngreso : totalIncomeBudgeted;

  // Fondo de emergencia: activos líquidos del último mes con patrimonio anotado.
  const esLiquido = (c) => /efectivo|cuenta|liquid|caja/i.test(c);
  const catsLiquidas = (categories["Activos"] || []).filter(esLiquido);
  const catsFondo = catsLiquidas.length ? catsLiquidas : (categories["Activos"] || []);
  let mesPatrimonio = -1;
  months.forEach((m, i) => {
    if ((categories["Activos"] || []).some(c => (data?.netWorth?.assets?.[c]?.[m] || 0) !== 0)) mesPatrimonio = i;
  });
  const fondoEmergencia = mesPatrimonio >= 0 ? catsFondo.reduce((s, c) => s + (data?.netWorth?.assets?.[c]?.[months[mesPatrimonio]] || 0), 0) : 0;
  const mesesCubiertos = gastoMedioMensual > 0 && mesPatrimonio >= 0 ? fondoEmergencia / gastoMedioMensual : null;

  // Carga de deuda: cuotas del mes de referencia sobre el ingreso mensual medio.
  const mesReferencia = esAnioActual ? new Date().getMonth() : 11;
  const cuotasMes = (fullData.loans || []).reduce((s, l) => { const lv = getLoanValues(l, year, mesReferencia); return s + (lv.active ? lv.installment : 0); }, 0);
  const ratioDeuda = ingresoMedioMensual > 0 ? (cuotasMes / ingresoMedioMensual) * 100 : null;

  // Ahorro acumulado real frente al plan del presupuesto.
  const ahorroPlanMes = totalIncomeBudgeted - totalExpensesBudgeted;
  const ahorroAcumulado = (() => {
    let real = 0, plan = 0;
    return months.map((m, i) => {
      plan += ahorroPlanMes;
      if (i < monthsPassed) real += monthlyTotals[i].income - monthlyTotals[i].expenses;
      return { name: m.substring(0, 3).toUpperCase(), plan, real: i < monthsPassed ? real : null };
    });
  })();

  // Top de gastos del año.
  const topGastos = [...expenseDist].sort((a, b) => b.value - a.value).slice(0, 6)
    .map(x => ({ ...x, pct: totalExpenses > 0 ? (x.value / totalExpenses) * 100 : 0 }));

  // Comparativa con el año anterior.
  const datosAnioAnterior = fullData[year - 1];
  const totalesAnterior = datosAnioAnterior ? calcularTotalesMensuales(datosAnioAnterior, datosAnioAnterior.categories || categories, fullData, year - 1) : null;
  const comparativa = totalesAnterior ? months.map((m, i) => ({
    name: m.substring(0, 3).toUpperCase(),
    [`Gastos ${year}`]: monthlyTotals[i].expenses,
    [`Gastos ${year - 1}`]: totalesAnterior[i].expenses,
    [`Ingresos ${year}`]: monthlyTotals[i].income,
    [`Ingresos ${year - 1}`]: totalesAnterior[i].income
  })) : [];
  const anteriorHasta = totalesAnterior ? totalesAnterior.slice(0, monthsPassed) : [];
  const ingresosAnteriorYTD = anteriorHasta.reduce((s, m) => s + m.income, 0);
  const gastosAnteriorYTD = anteriorHasta.reduce((s, m) => s + m.expenses, 0);

  // ─── Configuración del dashboard: orden, visibilidad, tamaño y opciones ──
  // Se guarda en la configuración del usuario (Firestore), así cada persona ve
  // el dashboard como lo ha dejado, en cualquier dispositivo.
  const dashboardCfg = normalizarDashboard(config?.dashboard);
  const guardarDashboard = (widgets) => onUpdateCfg({ ...config, dashboard: { widgets } });
  const opcionesDe = (id) => (dashboardCfg.widgets.find(w => w.id === id) || {}).opciones || {};
  const setOpcionesWidget = (id, opciones) => guardarDashboard(dashboardCfg.widgets.map(w => w.id === id ? { ...w, opciones: { ...(w.opciones || {}), ...opciones } } : w));
  const cambiarWidget = (id, cambios) => guardarDashboard(dashboardCfg.widgets.map(w => w.id === id ? { ...w, ...cambios } : w));
  const disponible = (id) => { const def = WIDGETS_DASHBOARD.find(d => d.id === id); return !!def && (!def.vista || (visibleViews || []).includes(def.vista)); };
  const widgetsVisibles = dashboardCfg.widgets.filter(w => w.visible && disponible(w.id));
  const widgetsOcultos = dashboardCfg.widgets.filter(w => !w.visible && disponible(w.id));
  const tituloDe = (id) => WIDGETS_DASHBOARD.find(d => d.id === id)?.titulo || id;
  const moverWidget = (id, delta) => {
    const k = widgetsVisibles.findIndex(w => w.id === id);
    const destino = widgetsVisibles[k + delta];
    if (k < 0 || !destino) return;
    const arr = [...dashboardCfg.widgets];
    const i = arr.findIndex(w => w.id === id), j = arr.findIndex(w => w.id === destino.id);
    [arr[i], arr[j]] = [arr[j], arr[i]];
    guardarDashboard(arr);
  };
  const restablecerDashboard = () => { if (window.confirm('¿Volver a la disposición inicial del dashboard?')) guardarDashboard(normalizarDashboard(null).widgets); };

  // Evolución de una categoría (opción guardada como "Categoría principal|Subcategoría").
  const todasSubs = ALL_MAIN_KEYS.flatMap(mk => (categories[mk] || []).map(sub => ({ mk, sub, clave: `${mk}|${sub}` })));
  const claveCategoria = (() => {
    const guardada = opcionesDe('categoria').cat;
    if (guardada && todasSubs.some(x => x.clave === guardada)) return guardada;
    const top = topGastos[0] && todasSubs.find(x => x.sub === topGastos[0].name && x.mk !== 'Ingresos');
    return top ? top.clave : (todasSubs[0]?.clave || '');
  })();
  const [mkElegida, subElegida] = claveCategoria.split('|');
  const evolucionCategoria = subElegida ? months.map((m, i) => {
    let real = calcTotal(data.monthly?.[m]?.[subElegida]?.actual || []);
    if (mkElegida === 'Pago de Deudas') {
      const loan = (fullData.loans || []).find(l => l.name === subElegida);
      if (loan) { const lv = getLoanValues(loan, year, i); if (lv.active) real += lv.installment; }
    }
    const presupuesto = getEffectiveBudget(subElegida, mkElegida, year, i, fullData, data.budget);
    return { name: m.substring(0, 3).toUpperCase(), real, presupuesto };
  }) : [];

  // Objetivo de ahorro anual (editable en el propio bloque).
  const objetivoAhorro = parseFloat(opcionesDe('objetivo').objetivo) || 0;
  const progresoObjetivo = objetivoAhorro > 0 ? (ahorroYTD / objetivoAhorro) * 100 : 0;
  const ritmoMensual = monthsPassed > 0 ? ahorroYTD / monthsPassed : 0;
  const proyeccionAhorro = esAnioActual ? ritmoMensual * 12 : ahorroYTD;

  const semaforo = (v, bueno, medio, menorEsMejor = false) => {
    if (v === null || v === undefined || isNaN(v)) return 'var(--text-muted)';
    const ok = menorEsMejor ? v <= bueno : v >= bueno;
    const regular = menorEsMejor ? v <= medio : v >= medio;
    return ok ? 'var(--green)' : regular ? 'var(--yellow)' : 'var(--red)';
  };
  const tickCompacto = v => new Intl.NumberFormat('es-ES', { notation: 'compact' }).format(v);
  const sinDatos = (texto) => <div className="loading-state" style={{ height: '80%', fontSize: 12, textAlign: 'center', padding: 12 }}>{texto}</div>;

  const renderWidget = (w) => {
    switch (w.id) {
      case 'kpis': return (
        <div className="grid-3">
          <div className="card" style={{ borderLeft: '4px solid var(--accent)', background: 'linear-gradient(135deg, var(--bg-card), rgba(45, 212, 191, 0.05))' }}>
            <div className="card-title">{t.totalIncome} ({year})</div>
            <div className="card-value green">{fmt(totalIncome)}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>{fmt(totalIncome / 12)} / {t.monthlyAvg}</div>
          </div>
          <div className="card" style={{ borderLeft: '4px solid var(--red)', background: 'linear-gradient(135deg, var(--bg-card), rgba(244, 63, 94, 0.05))' }}>
            <div className="card-title">{t.totalExpenses}</div>
            <div className="card-value red">{fmt(totalExpenses)}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>{((totalExpenses / (totalIncome || 1)) * 100).toFixed(1)}% {t.ofIncome}</div>
          </div>
          <div className="card" style={{ borderLeft: '4px solid var(--blue)', background: 'linear-gradient(135deg, var(--bg-card), rgba(56, 189, 248, 0.05))' }}>
            <div className="card-title">{t.savings}</div>
            <div className="card-value blue">{fmt(totalSavings)}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>{((totalSavings / (totalIncome || 1)) * 100).toFixed(1)}% {t.savingsRate}</div>
          </div>
        </div>
      );

      case 'salud': return (
        <div className="card">
          <div className="chart-card-title">Salud financiera {esAnioActual ? `(hasta ${months[monthsPassed - 1]})` : `(${year})`}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {[
              { label: 'Tasa de ahorro', valor: tasaAhorro, mostrar: v => `${v.toFixed(1)} %`, color: semaforo(tasaAhorro, 20, 10), max: 40, nota: 'Lo que guardas de cada euro que ingresas. Referencia: 20 % o más.' },
              { label: 'Fondo de emergencia', valor: mesesCubiertos, mostrar: v => `${v.toFixed(1)} meses`, color: semaforo(mesesCubiertos, 6, 3), max: 12, nota: `${catsFondo.join(' + ') || 'Activos'} entre el gasto medio mensual. Referencia: de 3 a 6 meses.` },
              { label: 'Carga de deuda', valor: ratioDeuda, mostrar: v => `${v.toFixed(1)} %`, color: semaforo(ratioDeuda, 30, 40, true), max: 60, nota: 'Cuotas de préstamos sobre el ingreso mensual medio. Referencia: por debajo del 30 %.' }
            ].map(g => (
              <div key={g.label} style={{ padding: 14, borderRadius: 12, background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{g.label}</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: g.color, margin: '6px 0' }}>{(g.valor === null || g.valor === undefined || isNaN(g.valor)) ? 'Sin datos' : g.mostrar(g.valor)}</div>
                <div style={{ height: 8, background: 'var(--bg-input)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.max(0, Math.min(100, ((g.valor || 0) / g.max) * 100))}%`, background: g.color, borderRadius: 4, transition: 'width .4s' }} />
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 6 }}>{g.nota}</div>
              </div>
            ))}
          </div>
        </div>
      );

      case 'flujo': return (
        <div className="chart-card" style={{ height: 320, padding: '20px' }}>
          <div className="chart-card-title" style={{ marginBottom: 20 }}>{t.monthlyIncome}</div>
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={monthlyTotals}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke={gridColor} strokeOpacity={0.5} />
              <XAxis dataKey="name" stroke={axisColor} axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
              <YAxis stroke={axisColor} axisLine={false} tickLine={false} tick={{ fontSize: 11 }} tickFormatter={tickCompacto} />
              <Tooltip contentStyle={{ ...tooltipStyle, border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} cursor={{ stroke: 'var(--accent)', strokeWidth: 2 }} formatter={v => fmt(v)} />
              <Legend verticalAlign="top" align="right" height={36} iconType="circle" />
              <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" name={t.income} />
              <Area type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" name={t.expenses} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      );

      case 'distribucion': return (
        <div className="chart-card" style={{ height: 320, padding: '20px' }}>
          <div className="chart-card-title" style={{ marginBottom: 20 }}>{t.expenseDist}</div>
          {expenseDist.length > 0 ? (
            <ResponsiveContainer width="100%" height="85%">
              <PieChart>
                <Pie data={expenseDist} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="85%" innerRadius="60%" paddingAngle={5}>
                  {expenseDist.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} stroke="none" />)}
                </Pie>
                <Tooltip contentStyle={{ ...tooltipStyle, borderRadius: 12 }} formatter={v => fmt(v)} />
                <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: 11, paddingLeft: 20 }} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          ) : sinDatos('Sin datos')}
        </div>
      );

      case 'ahorro-acumulado': return (
        <div className="chart-card" style={{ height: 320 }}>
          <div className="chart-card-title">Ahorro acumulado: plan vs. real</div>
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={ahorroAcumulado}>
              <defs>
                <linearGradient id="colorAcumulado" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={gridColor} strokeOpacity={0.5} />
              <XAxis dataKey="name" stroke={axisColor} tick={{ fontSize: 11 }} />
              <YAxis stroke={axisColor} tick={{ fontSize: 11 }} tickFormatter={tickCompacto} />
              <Tooltip contentStyle={tooltipStyle} formatter={v => fmt(v)} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="plan" name="Plan (según presupuesto)" stroke="var(--accent)" strokeWidth={2} strokeDasharray="6 4" fillOpacity={0} />
              <Area type="monotone" dataKey="real" name="Real" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorAcumulado)" connectNulls={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      );

      case 'objetivo': {
        const colorObjetivo = objetivoAhorro > 0 ? (proyeccionAhorro >= objetivoAhorro ? 'var(--green)' : progresoObjetivo >= (monthsPassed / 12) * 100 ? 'var(--yellow)' : 'var(--red)') : 'var(--accent)';
        return (
          <div className="card" style={{ height: 320, display: 'flex', flexDirection: 'column' }}>
            <div className="chart-card-title">Objetivo de ahorro anual</div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
              <label style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>Objetivo para {year} (€)</label>
              <BudgetInput value={objetivoAhorro} disabled={false} onSave={v => setOpcionesWidget('objetivo', { objetivo: v })} />
            </div>
            {objetivoAhorro > 0 ? (
              <>
                <div style={{ fontSize: 32, fontWeight: 900, color: colorObjetivo, lineHeight: 1 }}>{Math.max(0, progresoObjetivo).toFixed(0)} %</div>
                <div style={{ height: 10, background: 'var(--bg-input)', borderRadius: 5, overflow: 'hidden', margin: '12px 0' }}>
                  <div style={{ height: '100%', width: `${Math.max(0, Math.min(100, progresoObjetivo))}%`, background: colorObjetivo, borderRadius: 5, transition: 'width .4s' }} />
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Llevas <b>{fmt(ahorroYTD)}</b> de {fmt(objetivoAhorro)}.
                  {esAnioActual ? (
                    <> Al ritmo actual ({fmt(ritmoMensual)} al mes) terminarás el año con <b>{fmt(proyeccionAhorro)}</b>: {proyeccionAhorro >= objetivoAhorro ? 'vas por delante del objetivo.' : `te faltarían ${fmt(objetivoAhorro - proyeccionAhorro)}.`}</>
                  ) : (
                    <> {ahorroYTD >= objetivoAhorro ? 'Objetivo cumplido.' : `Faltaron ${fmt(objetivoAhorro - ahorroYTD)}.`}</>
                  )}
                </div>
              </>
            ) : (
              <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>Escribe cuánto quieres ahorrar este año y verás el progreso y una proyección a fin de año según tu ritmo actual.</div>
            )}
          </div>
        );
      }

      case 'presupuesto-ingresos': return (
        <div className="chart-card" style={{ height: 280 }}>
          <div className="chart-card-title">{t.income}: Presupuesto vs Real ({monthsPassed} meses)</div>
          {incomeVsActual.length > 0 ? (
            <ResponsiveContainer width="100%" height="88%">
              <BarChart data={incomeVsActual} barSize={18}>
                <CartesianGrid stroke={gridColor} strokeOpacity={0.5} />
                <XAxis dataKey="name" stroke={axisColor} tick={{ fontSize: 11 }} />
                <YAxis stroke={axisColor} tick={{ fontSize: 11 }} tickFormatter={tickCompacto} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(99,102,241,0.08)' }} formatter={v => fmt(v)} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="budgeted" fill="var(--accent)" name={t.budgeted} radius={[4, 4, 0, 0]} />
                <Bar dataKey="actual" fill="var(--green)" name={t.real} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : sinDatos('Sin datos de presupuesto')}
        </div>
      );

      case 'presupuesto-gastos': return (
        <div className="chart-card" style={{ height: 280 }}>
          <div className="chart-card-title">{t.expenses}: Presupuesto vs Real ({monthsPassed} meses)</div>
          {expenseVsActual.length > 0 ? (
            <ResponsiveContainer width="100%" height="88%">
              <BarChart data={expenseVsActual} barSize={18}>
                <CartesianGrid stroke={gridColor} strokeOpacity={0.5} />
                <XAxis dataKey="name" stroke={axisColor} tick={{ fontSize: 11 }} />
                <YAxis stroke={axisColor} tick={{ fontSize: 11 }} tickFormatter={tickCompacto} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(99,102,241,0.08)' }} formatter={v => fmt(v)} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="budgeted" fill="var(--accent)" name={t.budgeted} radius={[4, 4, 0, 0]} />
                <Bar dataKey="actual" fill="var(--red)" name={t.real} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : sinDatos('Sin datos de presupuesto')}
        </div>
      );

      case 'top-gastos': return (
        <div className="chart-card" style={{ height: 320 }}>
          <div className="chart-card-title">Dónde se va el dinero ({year})</div>
          {topGastos.length > 0 ? (
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={topGastos} layout="vertical" margin={{ left: 4, right: 56, top: 4, bottom: 4 }}>
                <CartesianGrid horizontal={false} stroke={gridColor} strokeOpacity={0.5} />
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={118} tick={{ fontSize: 11 }} stroke={axisColor} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(99,102,241,0.08)' }} formatter={(v, n, p) => [`${fmt(v)} (${(p?.payload?.pct || 0).toFixed(1)} % del gasto)`, 'Gasto']} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} label={{ position: 'right', fontSize: 11, fill: axisColor, formatter: v => fmt(v) }}>
                  {topGastos.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : sinDatos('Sin gastos registrados')}
        </div>
      );

      case 'categoria': return (
        <div className="chart-card" style={{ height: 320 }}>
          <div className="chart-card-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span>Evolución de una categoría</span>
            <select className="select-input" style={{ width: 'auto', height: 30, fontSize: 12, padding: '0 8px' }} value={claveCategoria} onChange={e => setOpcionesWidget('categoria', { cat: e.target.value })}>
              {ALL_MAIN_KEYS.map(mk => (
                <optgroup key={mk} label={mk}>
                  {(categories[mk] || []).map(sub => <option key={`${mk}|${sub}`} value={`${mk}|${sub}`}>{sub}</option>)}
                </optgroup>
              ))}
            </select>
          </div>
          {subElegida ? (
            <ResponsiveContainer width="100%" height="80%">
              <ComposedChart data={evolucionCategoria} barSize={16}>
                <CartesianGrid stroke={gridColor} strokeOpacity={0.5} />
                <XAxis dataKey="name" stroke={axisColor} tick={{ fontSize: 11 }} />
                <YAxis stroke={axisColor} tick={{ fontSize: 11 }} tickFormatter={tickCompacto} />
                <Tooltip contentStyle={tooltipStyle} formatter={v => fmt(v)} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="real" name={`Real: ${subElegida}`} fill={getCategoryColor(mkElegida)} radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="presupuesto" name="Presupuesto" stroke="var(--text-secondary)" strokeWidth={2} strokeDasharray="6 4" dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          ) : sinDatos('Sin categorías')}
        </div>
      );

      case 'ahorro-mensual': return (
        <div className="chart-card" style={{ height: 280 }}>
          <div className="chart-card-title">{t.savings} ({t.month})</div>
          <ResponsiveContainer width="100%" height="88%">
            <BarChart data={monthlySavingsData} barSize={20}>
              <CartesianGrid stroke={gridColor} strokeOpacity={0.5} />
              <XAxis dataKey="name" stroke={axisColor} tick={{ fontSize: 11 }} />
              <YAxis stroke={axisColor} tick={{ fontSize: 11 }} tickFormatter={tickCompacto} />
              <Tooltip contentStyle={tooltipStyle} formatter={v => fmt(v)} />
              <Bar dataKey="savings" name={t.savings} radius={[4, 4, 0, 0]}>
                {monthlySavingsData.map((entry, i) => (
                  <Cell key={i} fill={entry.savings >= 0 ? '#10b981' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      );

      case 'comparativa': return (
        <div className="chart-card" style={{ height: 340 }}>
          <div className="chart-card-title">Este año vs. el anterior ({year} vs. {year - 1})</div>
          {totalesAnterior ? (
            <>
              <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', fontSize: 12, marginBottom: 6 }}>
                {[
                  { l: 'Ingresos', a: ingresosYTD, b: ingresosAnteriorYTD, mejorSiSube: true },
                  { l: 'Gastos', a: gastosYTD, b: gastosAnteriorYTD, mejorSiSube: false },
                  { l: 'Ahorro', a: ahorroYTD, b: ingresosAnteriorYTD - gastosAnteriorYTD, mejorSiSube: true }
                ].map(d => {
                  const diff = d.a - d.b;
                  const pct = d.b !== 0 ? (diff / Math.abs(d.b)) * 100 : null;
                  const color = (d.mejorSiSube ? diff >= 0 : diff <= 0) ? 'var(--green)' : 'var(--red)';
                  return <span key={d.l}>{d.l}: <b style={{ color }}>{diff >= 0 ? '+' : ''}{fmt(diff)}</b>{pct !== null && <span style={{ color: 'var(--text-muted)' }}> ({pct >= 0 ? '+' : ''}{pct.toFixed(0)} %)</span>}</span>;
                })}
                <span style={{ color: 'var(--text-muted)' }}>primeros {monthsPassed} meses</span>
              </div>
              <ResponsiveContainer width="100%" height="80%">
                <ComposedChart data={comparativa} barSize={10}>
                  <CartesianGrid stroke={gridColor} strokeOpacity={0.5} />
                  <XAxis dataKey="name" stroke={axisColor} tick={{ fontSize: 11 }} />
                  <YAxis stroke={axisColor} tick={{ fontSize: 11 }} tickFormatter={tickCompacto} />
                  <Tooltip contentStyle={tooltipStyle} formatter={v => fmt(v)} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey={`Gastos ${year - 1}`} fill="#94a3b8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey={`Gastos ${year}`} fill="#ef4444" radius={[4, 4, 0, 0]} />
                  <Line type="monotone" dataKey={`Ingresos ${year - 1}`} stroke="#94a3b8" strokeWidth={2} strokeDasharray="6 4" dot={false} />
                  <Line type="monotone" dataKey={`Ingresos ${year}`} stroke="#10b981" strokeWidth={2} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </>
          ) : sinDatos(`No hay datos de ${year - 1}. Cuando existan, aquí verás la comparación mes a mes.`)}
        </div>
      );

      case 'patrimonio': return (
        <div className="chart-card" style={{ height: 280 }}>
          <div className="chart-card-title">{t.netWorthSummary}</div>
          <ResponsiveContainer width="100%" height="88%">
            <AreaChart data={netWorthChartData}>
              <defs>
                <linearGradient id="colorNW" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={gridColor} strokeOpacity={0.5} />
              <XAxis dataKey="name" stroke={axisColor} tick={{ fontSize: 11 }} />
              <YAxis stroke={axisColor} tick={{ fontSize: 11 }} tickFormatter={tickCompacto} />
              <Tooltip contentStyle={tooltipStyle} formatter={v => fmt(v)} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey={t.assets} stroke="#10b981" strokeWidth={2} fillOpacity={0} />
              <Area type="monotone" dataKey={t.liabilities} stroke="#ef4444" strokeWidth={2} fillOpacity={0} />
              <Area type="monotone" dataKey="nw" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorNW)" name={t.netWorth} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      );

      case 'prestamos': return (
        <div className="chart-card" style={{ height: 280, overflow: 'auto' }}>
          <div className="chart-card-title">{t.loanProgress}</div>
          {loansData.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 8 }}>
              {loansData.map((loan, i) => (
                <div key={i} style={{ padding: '0 4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
                    <span>{loan.name}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{loan.passed}/{loan.total}</span>
                  </div>
                  <div style={{ height: 8, background: 'var(--bg-input)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${loan.progress}%`, background: loan.progress >= 100 ? 'var(--green)' : 'var(--accent)', borderRadius: 4, transition: 'width 0.5s ease' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
                    <span>{fmt(loan.amount)}</span>
                    <span>{loan.progress.toFixed(0)}%</span>
                  </div>
                </div>
              ))}
            </div>
          ) : sinDatos(t.noLoans)}
        </div>
      );

      case 'trading': return (
        <div className="grid-3">
          <div className="card" style={{ borderLeft: '4px solid var(--green)' }}>
            <div className="card-title">{t.totalPnL}</div>
            <div className={`card-value ${tradingPnL >= 0 ? 'green' : 'red'}`}>{fmt(tradingPnL)}</div>
          </div>
          <div className="card" style={{ borderLeft: '4px solid var(--accent)' }}>
            <div className="card-title">{t.winRate}</div>
            <div className="card-value">{winRate}%</div>
          </div>
          <div className="card" style={{ borderLeft: '4px solid var(--blue)' }}>
            <div className="card-title">{t.totalTrades}</div>
            <div className="card-value">{(fullData.trading || []).length}</div>
          </div>
        </div>
      );

      default: return null;
    }
  };

  const botonEdicion = { width: 28, height: 28, padding: 0, fontSize: 12 };

  return (
    <div className="section-gap fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          {editandoDashboard
            ? 'Modo personalización: sube, baja, ensancha u oculta cada bloque. Se guarda en tu cuenta.'
            : `${widgetsVisibles.length} bloques visibles${widgetsOcultos.length ? ` · ${widgetsOcultos.length} ocultos` : ''}`}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {editandoDashboard && widgetsOcultos.length > 0 && (
            <select className="select-input" style={{ width: 'auto', height: 36 }} value="" onChange={e => { if (e.target.value) cambiarWidget(e.target.value, { visible: true }); }}>
              <option value="">+ Añadir bloque…</option>
              {widgetsOcultos.map(w => <option key={w.id} value={w.id}>{tituloDe(w.id)}</option>)}
            </select>
          )}
          {editandoDashboard && <button className="btn btn-ghost" onClick={restablecerDashboard}>Restablecer</button>}
          <button className={`btn ${editandoDashboard ? 'btn-primary' : 'btn-ghost'} dashboard-personalizar-btn`} onClick={() => setEditandoDashboard(!editandoDashboard)}>
            <Ic d={PATHS.settings} size={14} /> {editandoDashboard ? 'Listo' : 'Personalizar'}
          </button>
        </div>
      </div>

      <div className="grid-2" style={{ alignItems: 'stretch' }}>
        {widgetsVisibles.map((w, idx) => (
          <div key={w.id} style={{ gridColumn: w.size === 'full' ? '1 / -1' : 'auto', position: 'relative', outline: editandoDashboard ? '2px dashed var(--accent)' : 'none', outlineOffset: 4, borderRadius: 12 }}>
            {editandoDashboard && (
              <div style={{ position: 'absolute', top: 6, right: 6, zIndex: 5, display: 'flex', gap: 4, background: 'var(--bg-card)', border: '1px solid var(--accent)', borderRadius: 8, padding: 4, boxShadow: 'var(--shadow)' }}>
                <button className="btn btn-icon btn-ghost" style={botonEdicion} title="Subir" disabled={idx === 0} onClick={() => moverWidget(w.id, -1)}>▲</button>
                <button className="btn btn-icon btn-ghost" style={botonEdicion} title="Bajar" disabled={idx === widgetsVisibles.length - 1} onClick={() => moverWidget(w.id, 1)}>▼</button>
                <button className="btn btn-icon btn-ghost" style={botonEdicion} title={w.size === 'full' ? 'Media anchura' : 'Anchura completa'} onClick={() => cambiarWidget(w.id, { size: w.size === 'full' ? 'half' : 'full' })}>{w.size === 'full' ? '⇥' : '⇔'}</button>
                <button className="btn btn-icon btn-danger" style={botonEdicion} title="Ocultar" onClick={() => cambiarWidget(w.id, { visible: false })}>✕</button>
              </div>
            )}
            {renderWidget(w)}
          </div>
        ))}
        {widgetsVisibles.length === 0 && (
          <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
            No hay bloques visibles. Pulsa "Personalizar" y añade los que quieras.
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MONTHLY VIEW ─────────────────────────────────────────────────────────────
function MonthlyView({ currentMonthData, categories, onUpdate, fullData, year, month, budgetData }) {
  const { t, theme } = useApp();
  const isDark = theme === 'dark';
  const tooltipStyle = { backgroundColor: isDark ? '#1e2130' : '#fff', border: `1px solid ${isDark ? '#2d3148' : '#e2e5f0'}`, borderRadius: 8, fontSize: 12 };
  const axisColor = isDark ? '#565d80' : '#9098b8';
  const gridColor = isDark ? '#2d3148' : '#e2e5f0';

  const today = new Date().toISOString().split('T')[0];
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [txDate, setTxDate] = useState(today);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [txAmount, setTxAmount] = useState('');
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [txMainCat, setTxMainCat] = useState(() => Object.keys(categories).find(k => k !== 'Activos' && k !== 'Pasivos') || '');
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [txSubCat, setTxSubCat] = useState(() => { const mk = Object.keys(categories).find(k => k !== 'Activos' && k !== 'Pasivos') || ''; return (categories[mk] || [])[0] || ''; });

  if (!currentMonthData) return <div className="loading-state">{t.noData} {month} {year}</div>;

  const expenseKeys = EXPENSE_KEYS;
  const allTxs = [];
  Object.keys(categories).forEach(mk => {
    if (mk === 'Activos' || mk === 'Pasivos') return;
    (categories[mk] || []).forEach(sub => {
      (currentMonthData[sub]?.actual || []).forEach(tx => {
        const { type, mainCategory } = getCategoryGroup(sub, categories);
        allTxs.push({ ...tx, type, category: sub, mainCategory });
      });
    });
  });

  // Inject automatic loan transactions
  if (fullData.loans) {
    const mIdx = months.indexOf(month);
    fullData.loans.forEach(loan => {
      const lv = getLoanValues(loan, year, mIdx);
      if (lv.active) {
        allTxs.push({
          id: `loan-${loan.id}-${year}-${month}`,
          date: `${year}-${String(mIdx + 1).padStart(2, '0')}-01`,
          type: 'expense',
          category: loan.name,
          mainCategory: 'Pago de Deudas',
          amount: lv.installment,
          isAuto: true
        });
      }
    });
  }
  allTxs.sort((a, b) => new Date(b.date) - new Date(a.date));

  const totalIncome = allTxs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);

  const mIdx = months.indexOf(month);

  const renderMonthlyTable = (mk) => {
    const subsSet = new Set(categories[mk] || []);
    (fullData[year]?.oneTime?.[month] || []).filter(ot => ot.cat === mk).forEach(ot => Object.keys(ot).length > 0 && subsSet.add(ot.sub));
    const subs = Array.from(subsSet);
    
    if (!subs.length) return null;

    let totalEstimated = 0;
    let totalReal = 0;

    const rows = subs.map(sub => {
      let est = getEffectiveBudget(sub, mk, year, mIdx, fullData, budgetData);
      est += (fullData[year]?.oneTime?.[month] || []).filter(ot => ot.cat === mk && ot.sub === sub).reduce((acc, ot) => acc + ot.amount, 0);
      
      let act = calcTotal(currentMonthData?.[sub]?.actual || []);

      if (mk === 'Pago de Deudas' && fullData.loans) {
        const loan = fullData.loans.find(l => l.name === sub);
        if (loan) {
          const lv = getLoanValues(loan, year, mIdx);
          if (lv.active) act += lv.installment;
        }
      }

      totalEstimated += est;
      totalReal += act;

      return (
        <tr key={sub}>
          <td>{sub}</td>
          <td className="text-right" style={{ color: 'var(--text-muted)' }}>{fmt(est)}</td>
          <td className="text-right" style={{ fontWeight: 700, color: mk === 'Ingresos' ? 'var(--green)' : 'var(--red)' }}>{fmt(act)}</td>
        </tr>
      );
    });

    const isIncome = mk === 'Ingresos';
    return (
      <div className="card" key={mk} style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div className="budget-header-card" style={{ backgroundColor: getCategoryColor(mk) }}>
          <span>{(t[mk] || mk).toUpperCase()}</span>
        </div>
        <div className="table-wrap" style={{ flex: 1, borderBottom: '1px solid var(--border)' }}>
          <table style={{ margin: 0 }}>
            <thead><tr><th>{t.category}</th><th className="text-right">Estimado</th><th className="text-right">Real</th></tr></thead>
            <tbody>{rows}</tbody>
          </table>
        </div>
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', background: 'var(--bg-card)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto auto', padding: '12px 16px', fontSize: 13, alignItems: 'center' }}>
            <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>Total</div>
            <div className="text-right" style={{ fontWeight: 800, minWidth: '80px', paddingLeft: '16px' }}>{fmt(totalEstimated)}</div>
            <div className="text-right" style={{ fontWeight: 800, color: getCategoryColor(mk), minWidth: '80px', paddingLeft: '16px' }}>{fmt(totalReal)}</div>
          </div>
          {!isIncome && totalIncome > 0 && (
            <div style={{ padding: '8px 12px', borderTop: '1px solid var(--border)', fontSize: 11, fontWeight: 700, textAlign: 'center', background: 'rgba(255,255,255,0.02)' }}>
              <span style={{ color: getCategoryColor(mk) }}>{((totalReal / totalIncome) * 100).toFixed(1)}%</span> gastado sobre mes
            </div>
          )}
        </div>
      </div >
    );
  };

  const totalExpenses = expenseKeys.reduce((acc, mk) => {
    const subs = categories[mk] || [];
    return acc + subs.reduce((s, sub) => {
      let act = calcTotal(currentMonthData?.[sub]?.actual || []);
      if (mk === 'Pago de Deudas' && fullData.loans) {
        const loan = fullData.loans.find(l => l.name === sub);
        if (loan) {
          const lv = getLoanValues(loan, year, mIdx);
          if (lv.active) act += lv.installment;
        }
      }
      return s + act;
    }, 0);
  }, 0);

  const handleAdd = () => {
    if (!txAmount || parseFloat(txAmount) <= 0 || !txSubCat || !txDate) { alert('Completa todos los campos'); return; }
    const nd = JSON.parse(JSON.stringify(fullData));
    if (!nd[year].monthly[month][txSubCat]) nd[year].monthly[month][txSubCat] = { budgeted: 0, actual: [] };
    nd[year].monthly[month][txSubCat].actual.push({ id: crypto.randomUUID(), amount: parseFloat(txAmount), date: txDate });
    onUpdate(nd);
    setTxAmount('');
  };

  const handleDelete = (sub, id) => {
    if (String(id).startsWith('loan-')) {
      alert('Las cuotas de préstamos se generan automáticamente. Para eliminarlas o modificarlas, ve a la pestaña de Préstamos.');
      return;
    }
    const nd = JSON.parse(JSON.stringify(fullData));
    if (nd[year].monthly[month][sub]) {
      nd[year].monthly[month][sub].actual = nd[year].monthly[month][sub].actual.filter(tx => tx.id !== id);
    }
    onUpdate(nd);
  };

  return (
    <div className="section-gap">
      {/* KPIs */}
      <div className="grid-3">
        <div className="card"><div className="card-title">{t.income}</div><div className="card-value green">{fmt(totalIncome)}</div></div>
        <div className="card"><div className="card-title">{t.expenses}</div><div className="card-value red">{fmt(totalExpenses)}</div></div>
        <div className="card"><div className="card-title">{t.savings}</div><div className={`card-value ${totalIncome - totalExpenses >= 0 ? 'blue' : 'yellow'}`}>{fmt(totalIncome - totalExpenses)}</div></div>
      </div>

      {/* Budget Tables */}
      <div className="grid-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginTop: 24, marginBottom: 24 }}>
        {ALL_MAIN_KEYS.map(renderMonthlyTable)}
      </div>

      {/* Add transaction */}
      <div className="card">
        <div className="chart-card-title">{t.addTransaction}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, alignItems: 'end' }}>
          <div>
            <label>{t.mainCategory}</label>
            <select className="select-input" value={txMainCat} onChange={e => { setTxMainCat(e.target.value); setTxSubCat((categories[e.target.value] || [])[0] || ''); }}>
              {ALL_MAIN_KEYS.map(mk => <option key={mk} value={mk}>{mk}</option>)}
            </select>
          </div>
          <div>
            <label>{t.subCategory}</label>
            <select className="select-input" value={txSubCat} onChange={e => setTxSubCat(e.target.value)}>
              {(categories[txMainCat] || []).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label>{t.date}</label>
            <input type="date" className="date-input" value={txDate} onChange={e => setTxDate(e.target.value)} />
          </div>
          <div>
            <label>{t.amount} (€)</label>
            <input type="number" className="number-input" placeholder="0.00" value={txAmount} onChange={e => setTxAmount(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAdd()} />
          </div>
          <div>
            <label style={{ visibility: 'hidden' }}>-</label>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleAdd}>{t.add}</button>
          </div>
        </div>
      </div>

      {/* Transactions table */}
      <div className="card">
        <div className="chart-card-title" style={{ marginBottom: 12 }}>{t.transactions} — {month.charAt(0).toUpperCase() + month.slice(1)}</div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{t.date}</th>
                <th>{t.mainCategory}</th>
                <th>{t.subCategory}</th>
                <th className="text-right">{t.amount}</th>
                <th className="text-center">{t.actions}</th>
              </tr>
            </thead>
            <tbody>
              {allTxs.length === 0
                ? <tr><td colSpan={5} className="text-center" style={{ padding: '24px' }}>{t.noTransactions}</td></tr>
                : allTxs.map(tx => (
                  <tr key={tx.id}>
                    <td style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{tx.date}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span className="cat-band" style={{ backgroundColor: getCategoryColor(tx.mainCategory) }} />
                        <span className="badge badge-accent" style={{ fontSize: 11 }}>{tx.mainCategory}</span>
                      </div>
                    </td>
                    <td>{tx.category}</td>
                    <td className="text-right" style={{ fontWeight: 700, color: tx.type === 'income' ? 'var(--green)' : 'var(--red)' }}>{fmt(tx.amount)}</td>
                    <td className="text-center">
                      <button className="btn btn-icon btn-danger" onClick={() => handleDelete(tx.category, tx.id)} title="Eliminar">
                        <Ic d={PATHS.trash} size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── NET WORTH ────────────────────────────────────────────────────────────────
function NetWorthView({ data, categories, onUpdate, fullData, year }) {
  const { t, theme } = useApp();
  const isDark = theme === 'dark';
  const tooltipStyle = { backgroundColor: isDark ? '#1e2130' : '#fff', border: `1px solid ${isDark ? '#2d3148' : '#e2e5f0'}`, borderRadius: 8, fontSize: 12 };
  const axisColor = isDark ? '#565d80' : '#9098b8';
  const gridColor = isDark ? '#2d3148' : '#e2e5f0';

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [selectedMobileMonth, setSelectedMobileMonth] = useState(() => months[new Date().getMonth()]);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isMobileNW, setIsMobileNW] = useState(window.innerWidth < 800);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const handleResize = () => setIsMobileNW(window.innerWidth < 800);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!data) return <div className="loading-state">{t.noData} {year}</div>;

  const handleChange = (type, cat, month, val) => {
    const nd = JSON.parse(JSON.stringify(fullData));
    const nwk = type === 'Activos' ? 'assets' : 'liabilities';
    if (!nd[year].netWorth) nd[year].netWorth = { assets: {}, liabilities: {} };
    if (!nd[year].netWorth[nwk]) nd[year].netWorth[nwk] = {};
    if (!nd[year].netWorth[nwk][cat]) nd[year].netWorth[nwk][cat] = {};
    nd[year].netWorth[nwk][cat][month] = parseFloat(val) || 0;
    onUpdate(nd);
  };

  const chartData = months.map((m, mIdx) => {
    let totalAssets = (categories["Activos"] || []).reduce((s, c) => s + (data?.assets?.[c]?.[m] || 0), 0);
    let totalLiab = (categories["Pasivos"] || []).reduce((s, c) => s + (data?.liabilities?.[c]?.[m] || 0), 0);
    // Inject loan balance as liability
    if (fullData.loans) {
      fullData.loans.forEach(loan => {
        const lv = getLoanValues(loan, year, mIdx);
        if (lv.active) totalLiab += lv.balance;
      });
    }
    return { name: m.substring(0, 3).toUpperCase(), [t.assets]: totalAssets, [t.liabilities]: totalLiab, [t.netWorth]: totalAssets - totalLiab };
  });

  const renderTable = (type) => {
    const cats = categories[type] || [];
    if (!cats.length) return null;
    const nwk = type === 'Activos' ? 'assets' : 'liabilities';
    const displayMonths = isMobileNW ? [selectedMobileMonth] : months;

    return (
      <div className="card">
        <div className="chart-card-title">{type}</div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{t.category}</th>
                {displayMonths.map(m => <th key={m} className="text-right" style={{ fontSize: 10 }}>{m.substring(0, 3).toUpperCase()}</th>)}
              </tr>
            </thead>
            <tbody>
              {cats.map(cat => {
                const loan = type === 'Pasivos' && fullData.loans?.find(l => l.name === cat);
                return (
                  <tr key={cat}>
                    <td style={{ whiteSpace: 'nowrap', fontSize: 12 }}>{cat}</td>
                    {displayMonths.map((m) => {
                      const mIdx = months.indexOf(m);
                      let val = data?.[nwk]?.[cat]?.[m] || 0;
                      if (loan) {
                        const lv = getLoanValues(loan, year, mIdx);
                        val = lv.active ? lv.balance : 0;
                      }
                      return (
                        <td key={m} className="text-right">
                          {loan ? (
                            <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>{fmt(val).replace(' €', '')}</span>
                          ) : (
                            <input type="number" className="nw-input" value={val || 0}
                              onChange={e => handleChange(type, cat, m, e.target.value)}
                              onKeyDown={e => {
                                if (e.key === 'Enter') {
                                  const inputs = Array.from(document.querySelectorAll('.nw-input'));
                                  const idx = inputs.indexOf(e.target);
                                  // Salta a la misma columna de la fila siguiente (en móvil solo hay una columna).
                                  if (idx !== -1 && inputs[idx + displayMonths.length]) {
                                    inputs[idx + displayMonths.length].focus();
                                    inputs[idx + displayMonths.length].select();
                                  }
                                }
                              }} />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="section-gap">
      <div className="chart-card" style={{ height: 300 }}>
        <div className="chart-card-title">{t.netWorthEvolution}</div>
        <ResponsiveContainer width="100%" height="88%">
          <LineChart data={chartData}>
            <CartesianGrid stroke={gridColor} strokeOpacity={0.5} />
            <XAxis dataKey="name" stroke={axisColor} tick={{ fontSize: 11 }} />
            <YAxis stroke={axisColor} tick={{ fontSize: 11 }} tickFormatter={v => new Intl.NumberFormat('es-ES', { notation: 'compact' }).format(v)} />
            <Tooltip contentStyle={tooltipStyle} formatter={v => fmt(v)} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey={t.assets} stroke="var(--green)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey={t.liabilities} stroke="var(--red)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey={t.netWorth} stroke="var(--accent)" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {isMobileNW && (
        <div className="card" style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 700, marginRight: 8, color: 'var(--text-secondary)' }}>Seleccionar mes a visualizar/editar:</label>
          <select className="select-input" value={selectedMobileMonth} onChange={e => setSelectedMobileMonth(e.target.value)} style={{ textTransform: 'capitalize', marginTop: 8 }}>
            {months.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      )}
      {renderTable("Activos")}
      {renderTable("Pasivos")}
    </div>
  );
}

// ─── LOANS VIEW ───────────────────────────────────────────────────────────────
function LoansView({ loans, onUpdate, fullData, userId, onUpdateCfg, config }) {
  const { t } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [expandedLoan, setExpandedLoan] = useState(null);
  const [extraAmount, setExtraAmount] = useState('');
  const [extraMonth, setExtraMonth] = useState('');
  const [extraAmortLoan, setExtraAmortLoan] = useState(null);

  const handleAdd = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const loanTotal = parseFloat(fd.get('loanTotal'));
    const count = parseInt(fd.get('installments'));
    const rateYear = parseFloat(fd.get('rate')) || 0;
    const startStr = fd.get('start');

    // Formula: Cuota = (P * i) / (1 - (1 + i)^-n)
    const i = (rateYear / 100) / 12;
    const amount = i > 0
      ? (loanTotal * i) / (1 - Math.pow(1 + i, -count))
      : loanTotal / count;

    const start = new Date(startStr);
    const end = new Date(start);
    end.setMonth(start.getMonth() + count - 1);

    const newLoan = {
      id: crypto.randomUUID(),
      name: fd.get('name'),
      amount: amount, // monthly installment
      totalAmount: loanTotal,
      installmentsCount: count,
      interestRate: rateYear,
      startDate: startStr,
      endDate: end.toISOString().split('T')[0],
    };

    const nd = JSON.parse(JSON.stringify(fullData));
    nd.loans.push(newLoan);

    // Update global config
    const newConfig = JSON.parse(JSON.stringify(config));
    if (!newConfig.categories["Pago de Deudas"].includes(newLoan.name)) {
      newConfig.categories["Pago de Deudas"].push(newLoan.name);
    }
    if (!newConfig.categories["Pasivos"].includes(newLoan.name)) {
      newConfig.categories["Pasivos"].push(newLoan.name);
    }
    onUpdateCfg(newConfig);

    // Propagate to yearly categories to ensure it shows in Budget/Monthly views
    const loanStartYear = start.getFullYear();
    Object.keys(nd).forEach(y => {
      const yr = parseInt(y);
      if (!isNaN(yr) && yr >= loanStartYear) {
        if (!nd[y].categories) nd[y].categories = JSON.parse(JSON.stringify(newConfig.categories));
        if (!nd[y].categories["Pago de Deudas"].includes(newLoan.name)) nd[y].categories["Pago de Deudas"].push(newLoan.name);
        if (!nd[y].categories["Pasivos"].includes(newLoan.name)) nd[y].categories["Pasivos"].push(newLoan.name);

        // Ensure budget for this loan exists
        if (nd[y].budget && nd[y].budget[newLoan.name] === undefined) nd[y].budget[newLoan.name] = 0;
      }
    });

    onUpdate(nd);
    setShowAdd(false);
  };

  const handleDelete = (id) => {
    if (!window.confirm(t.confirmDelete)) return;
    const nd = JSON.parse(JSON.stringify(fullData));
    nd.loans = nd.loans.filter(l => l.id !== id);
    onUpdate(nd);
  };

  const handleExtraAmort = (e, loanId) => {
    e.preventDefault();
    if (!extraAmount || parseFloat(extraAmount) <= 0 || !extraMonth) return;
    const nd = JSON.parse(JSON.stringify(fullData));
    const loan = nd.loans.find(l => l.id === loanId);
    if (!loan) return;
    if (!loan.extraAmortizations) loan.extraAmortizations = [];
    loan.extraAmortizations.push({ paymentNo: parseInt(extraMonth), amount: parseFloat(extraAmount), id: crypto.randomUUID() });
    onUpdate(nd);
    setExtraAmount(''); setExtraMonth('');
  };

  const handleDeleteExtraAmort = (loanId, extraId) => {
    if (!window.confirm("¿Eliminar amortización anticipada?")) return;
    const nd = JSON.parse(JSON.stringify(fullData));
    const loan = nd.loans.find(l => l.id === loanId);
    if (!loan || !loan.extraAmortizations) return;
    loan.extraAmortizations = loan.extraAmortizations.filter(ex => ex.id !== extraId);
    onUpdate(nd);
  };

  // El cuadro sale del mismo simulador que usan el Dashboard, el Seguimiento y
  // el Patrimonio, así las amortizaciones anticipadas cuadran en todas las vistas.
  const getAmortizationTable = (loan) => simularPrestamo(loan);

  return (
    <div className="section-gap">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: 18, fontWeight: 800 }}>{t.loanManagement}</h2>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
          <Ic d={PATHS.plus} size={16} /> {t.add}
        </button>
      </div>

      {showAdd && (
        <div className="card">
          <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
            <div><label>{t.loanName}</label><input name="name" className="text-input" placeholder="Ej: Hipoteca" required /></div>
            <div><label>{t.loanTotal} (€)</label><input name="loanTotal" type="number" step="0.01" className="text-input" required /></div>
            <div><label>{t.installments}</label><input name="installments" type="number" min="1" className="text-input" required /></div>
            <div><label>{t.interestRate}</label><input name="rate" type="number" step="0.01" className="text-input" placeholder="0.00" /></div>
            <div><label>{t.startDate}</label><input name="start" type="date" className="date-input" required /></div>
            <div style={{ alignSelf: 'end', display: 'flex', gap: 8 }}>
              <button type="button" className="btn btn-ghost" onClick={() => setShowAdd(false)}>{t.cancel}</button>
              <button type="submit" className="btn btn-primary">{t.add}</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid-2">
        {loans.length === 0 ? (
          <div className="card text-center" style={{ gridColumn: '1 / -1', padding: 40, color: 'var(--text-muted)' }}>
            <Ic d={PATHS.loan} size={40} style={{ marginBottom: 12, opacity: 0.2 }} />
            <p>{t.noLoans}</p>
          </div>
        ) : loans.map(l => {
          const start = fechaLocal(l.startDate);
          const totalCuotas = simularPrestamo(l).length || l.installmentsCount;
          const end = finRealPrestamo(l); // contando amortizaciones anticipadas
          const now = new Date();
          const isFinished = new Date(now.getFullYear(), now.getMonth(), 1) > end;
          const endLabel = end.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });

          const diffMonths = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
          const passed = Math.max(0, Math.min(totalCuotas, diffMonths + 1));
          const progress = (passed / totalCuotas) * 100;

          return (
            <div className="card" key={l.id} style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: 20 }}>
                <div className="loan-card-header">
                  <div>
                    <div className="loan-card-name" style={{ fontSize: 16 }}>{l.name}</div>
                    <div className="loan-card-type" style={{ color: isFinished ? 'var(--green)' : 'var(--blue)' }}>
                      {isFinished ? t.finished : t.active}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-icon btn-ghost" onClick={() => { setExtraAmortLoan(extraAmortLoan === l.id ? null : l.id); setExpandedLoan(null); }} title="Amortización Anticipada">
                      <Ic d={PATHS.trading} size={14} />
                    </button>
                    <button className="btn btn-icon btn-ghost" onClick={() => { setExpandedLoan(expandedLoan === l.id ? null : l.id); setExtraAmortLoan(null); }} title={t.calendar}>
                      <Ic d={PATHS.monthly} size={14} />
                    </button>
                    <button className="btn btn-icon btn-danger" onClick={() => handleDelete(l.id)}>
                      <Ic d={PATHS.trash} size={14} />
                    </button>
                  </div>
                </div>

                <div className="loan-stats" style={{ marginTop: 20, gridTemplateColumns: 'repeat(2, 1fr)' }}>
                  <div className="loan-stat"><span className="loan-stat-label">{t.loanTotal}</span><span className="loan-stat-value">{fmt(l.totalAmount)}</span></div>
                  <div className="loan-stat"><span className="loan-stat-label">{t.installment}</span><span className="loan-stat-value" style={{ color: 'var(--blue)' }}>{fmt(l.amount)}</span></div>
                  <div className="loan-stat"><span className="loan-stat-label">{t.interestRate}</span><span className="loan-stat-value">{l.interestRate}%</span></div>
                  <div className="loan-stat"><span className="loan-stat-label">{t.endDate}</span><span className="loan-stat-value" style={{ textTransform: 'capitalize' }}>{endLabel}</span></div>
                </div>

                <div className="loan-progress" style={{ marginTop: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, marginBottom: 6 }}>
                    <span>{passed} / {totalCuotas} {t.installments}</span>
                    <span>{progress.toFixed(0)}%</span>
                  </div>
                  <div className="loan-progress-bar" style={{ height: 6 }}>
                    <div className="loan-progress-fill" style={{ width: `${progress}%`, background: isFinished ? 'var(--green)' : '' }} />
                  </div>
                </div>
              </div>

              {expandedLoan === l.id && (
                <div style={{ background: 'var(--bg-input)', borderTop: '1px solid var(--border)', padding: '0 0 10px 0' }}>
                  <div style={{ padding: '20px 20px 10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
                      {t.calendar}
                    </div>
                    <span className="badge badge-accent" style={{ fontSize: 10 }}>FRANCÉS</span>
                  </div>

                  <div className="table-wrap" style={{ maxHeight: 400, overflowY: 'auto' }}>
                    <table className="amortization-table">
                      <thead>
                        <tr>
                          <th>{t.paymentNo}</th>
                          <th>{t.month}</th>
                          <th className="text-right">{t.installment}</th>
                          <th className="text-right">{t.interest}</th>
                          <th className="text-right">{t.principal}</th>
                          {l.extraAmortizations && l.extraAmortizations.length > 0 && <th className="text-right">Extra</th>}
                          <th className="text-right">{t.totalAmortized}</th>
                          <th className="text-right">{t.pendingCapital}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getAmortizationTable(l).map((m, idx) => {
                          const isPaid = new Date() > m.date;
                          return (
                            <tr key={idx} style={{ borderBottom: '1px solid var(--border)', background: isPaid ? 'var(--bg-card-hover)' : 'transparent' }}>
                              <td style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{m.num}</td>
                              <td style={{ textTransform: 'capitalize', color: 'var(--text-primary)', fontSize: 12 }}>{m.month}</td>
                              <td className="text-right" style={{ color: '#0ea5e9', fontWeight: 700 }}>{fmt(m.fixed)}</td>
                              <td className="text-right" style={{ color: '#ef4444' }}>{fmt(m.interest)}</td>
                              <td className="text-right" style={{ color: '#10b981' }}>{fmt(m.principal)}</td>
                              {l.extraAmortizations && l.extraAmortizations.length > 0 && (
                                <td className="text-right" style={{ color: 'var(--accent)', fontWeight: 700 }}>
                                  {m.extraAmortization > 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                                      {m.extrasList.map(ex => (
                                        <div key={ex.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                          <button type="button" onClick={() => handleDeleteExtraAmort(l.id, ex.id)} style={{ background: 'none', border: 'none', color: 'var(--red)', cursor: 'pointer', padding: 0 }} title="Eliminar"><Ic d={PATHS.trash} size={10} /></button>
                                          <span>+{fmt(ex.amount)}</span>
                                        </div>
                                      ))}
                                    </div>
                                  ) : '-'}
                                </td>
                              )}
                              <td className="text-right" style={{ color: '#c084fc' }}>{fmt(m.totalAmortized)}</td>
                              <td className="text-right" style={{ color: '#94a3b8' }}>{fmt(m.pending)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {extraAmortLoan === l.id && (
                <div style={{ background: 'var(--bg-card-hover)', borderTop: '1px solid var(--border)', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
                    Nueva Amortización Anticipada
                  </div>
                  <form onSubmit={(e) => { handleExtraAmort(e, l.id); setExtraAmortLoan(null); }} className="fade-in" style={{ display: 'flex', gap: 12, alignItems: 'end' }}>
                    <div>
                      <label style={{ fontSize: 11 }}>Nº Mes (Cuota)</label>
                      <input className="number-input" type="number" min="1" max={l.installmentsCount} value={extraMonth} onChange={e => setExtraMonth(e.target.value)} required placeholder="Ej: 12" style={{ height: 36, padding: '0 12px', width: 120 }} />
                    </div>
                    <div>
                      <label style={{ fontSize: 11 }}>Importe extra (€)</label>
                      <input className="number-input" type="number" step="0.01" min="1" value={extraAmount} onChange={e => setExtraAmount(e.target.value)} required placeholder="1000.00" style={{ height: 36, padding: '0 12px', width: 140 }} />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ height: 36 }}>Aplicar</button>
                    <button type="button" className="btn btn-ghost" style={{ height: 36 }} onClick={() => setExtraAmortLoan(null)}>Cancelar</button>
                  </form>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}


// ─── SETTINGS ─────────────────────────────────────────────────────────────────
function SettingsView({ config, selectedYear, onUpdate, financialData, onUpdateFD, user, onUpdateProfile, onUpdateVisibility, onStartTutorial }) {
  const { t, theme, toggleTheme, language, setLanguageTo } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [modalMainCat, setModalMainCat] = useState('Ingresos');
  const [newCatName, setNewCatName] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [renameTarget, setRenameTarget] = useState(null);
  const [renameValue, setRenameValue] = useState('');

  // Profile local state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(user?.displayName || '');
  const [profileAvatar, setProfileAvatar] = useState(user?.avatar || '👤');

  const handleSaveProfile = () => {
    onUpdateProfile({ displayName: profileName, avatar: profileAvatar });
    setIsEditingProfile(false);
    alert('Perfil actualizado con éxito');
  };

  const handleAddCat = () => {
    if (!newCatName.trim()) return;
    const name = newCatName.trim().charAt(0).toUpperCase() + newCatName.trim().slice(1);

    // Check if exists in current year
    const currentYearCats = financialData?.[selectedYear]?.categories || config.categories;
    if ((currentYearCats[modalMainCat] || []).includes(name)) { alert('Ya existe en este año'); return; }

    const nfd = JSON.parse(JSON.stringify(financialData));
    const nc = JSON.parse(JSON.stringify(config));
    const startY = selectedYear;

    // update current config globally to make it persistent for new years
    if (!nc.categories[modalMainCat]) nc.categories[modalMainCat] = [];
    if (!nc.categories[modalMainCat].includes(name)) {
      nc.categories[modalMainCat].push(name);
      nc.categories[modalMainCat].sort();
    }

    Object.keys(nfd).forEach(y => {
      if (parseInt(y) >= startY) {
        if (!nfd[y].categories) nfd[y].categories = JSON.parse(JSON.stringify(currentYearCats));
        if (!nfd[y].categories[modalMainCat]) nfd[y].categories[modalMainCat] = [];
        if (!nfd[y].categories[modalMainCat].includes(name)) {
          nfd[y].categories[modalMainCat].push(name);
          nfd[y].categories[modalMainCat].sort();
        }

        if (nfd[y].budget && nfd[y].budget[name] === undefined) nfd[y].budget[name] = 0;
        if (nfd[y].monthly) {
          months.forEach(m => {
            if (!nfd[y].monthly[m]) nfd[y].monthly[m] = {};
            if (!nfd[y].monthly[m][name]) nfd[y].monthly[m][name] = { budgeted: 0, actual: [] };
          });
        }
        if (modalMainCat === 'Activos' || modalMainCat === 'Pasivos') {
          const nwk = modalMainCat === 'Activos' ? 'assets' : 'liabilities';
          if (!nfd[y].netWorth) nfd[y].netWorth = { assets: {}, liabilities: {} };
          if (!nfd[y].netWorth[nwk]) nfd[y].netWorth[nwk] = {};
          if (!nfd[y].netWorth[nwk][name]) nfd[y].netWorth[nwk][name] = {};
        }
      }
    });

    onUpdate(nc);
    onUpdateFD(nfd);
    setShowModal(false); setNewCatName('');
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    const { mk, sub } = deleteTarget;

    const nfd = JSON.parse(JSON.stringify(financialData));
    const startY = selectedYear;

    Object.keys(nfd).forEach(y => {
      if (parseInt(y) >= startY) {
        if (nfd[y].categories && nfd[y].categories[mk]) {
          nfd[y].categories[mk] = nfd[y].categories[mk].filter(s => s !== sub);
        }
        if (nfd[y].budget) delete nfd[y].budget[sub];
        months.forEach(m => { if (nfd[y].monthly?.[m]) delete nfd[y].monthly[m][sub]; });
        if (nfd[y].netWorth) {
          if (nfd[y].netWorth.assets?.[sub]) delete nfd[y].netWorth.assets[sub];
          if (nfd[y].netWorth.liabilities?.[sub]) delete nfd[y].netWorth.liabilities[sub];
        }
      }
    });

    // Update global config as well
    const nc = JSON.parse(JSON.stringify(config));
    if (nc.categories[mk]) {
      nc.categories[mk] = nc.categories[mk].filter(s => s !== sub);
    }
    onUpdate(nc);
    onUpdateFD(nfd);
    setShowDeleteModal(false); setDeleteTarget(null);
  };

  const handleRename = () => {
    if (!renameTarget || !renameValue.trim()) return;
    const newName = renameValue.trim().charAt(0).toUpperCase() + renameValue.trim().slice(1);
    const { mk, oldName } = renameTarget;
    if (oldName === newName) { setRenameTarget(null); return; }

    const currentYearCats = financialData?.[selectedYear]?.categories || config.categories;
    if ((currentYearCats[mk] || []).includes(newName)) { alert('Ya existe en este año'); return; }

    const nfd = JSON.parse(JSON.stringify(financialData));
    const startY = selectedYear;

    const nc = JSON.parse(JSON.stringify(config));
    if (nc.categories[mk]) {
      const idx = nc.categories[mk].indexOf(oldName);
      if (idx !== -1) nc.categories[mk][idx] = newName;
      nc.categories[mk].sort();
    }

    Object.keys(nfd).forEach(y => {
      const yr = parseInt(y);
      if (!isNaN(yr) && yr >= startY) {
        if (nfd[y].categories && nfd[y].categories[mk]) {
          const idx = nfd[y].categories[mk].indexOf(oldName);
          if (idx !== -1) nfd[y].categories[mk][idx] = newName;
          nfd[y].categories[mk].sort();
        }
        if (nfd[y].budget && nfd[y].budget[oldName] !== undefined) {
          nfd[y].budget[newName] = nfd[y].budget[oldName];
          delete nfd[y].budget[oldName];
        }
        if (nfd[y].monthly) {
          months.forEach(m => {
            if (nfd[y].monthly[m] && nfd[y].monthly[m][oldName]) {
              nfd[y].monthly[m][newName] = nfd[y].monthly[m][oldName];
              delete nfd[y].monthly[m][oldName];
            }
          });
        }
        if (nfd[y].netWorth) {
          const nwk = mk === 'Activos' ? 'assets' : 'liabilities';
          if ((mk === 'Activos' || mk === 'Pasivos') && nfd[y].netWorth[nwk] && nfd[y].netWorth[nwk][oldName] !== undefined) {
            nfd[y].netWorth[nwk][newName] = nfd[y].netWorth[nwk][oldName];
            delete nfd[y].netWorth[nwk][oldName];
          }
        }
      }
    });

    onUpdate(nc);
    onUpdateFD(nfd);
    setRenameTarget(null);
  };


  return (
    <div className="section-gap fade-in">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24 }}>
        {/* Mi Perfil - Advanced Redesign */}
        <div className="card" style={{ gridColumn: '1 / -1', padding: 0, overflow: 'hidden', border: '1px solid var(--border)', background: 'linear-gradient(180deg, var(--bg-card) 0%, var(--bg-secondary) 100%)' }}>
          <div style={{ height: 100, background: 'linear-gradient(135deg, var(--accent) 0%, #818cf8 100%)', opacity: 0.9, position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'url(https://www.transparenttextures.com/patterns/cubes.png)', opacity: 0.1 }}></div>
          </div>
          <div style={{ position: 'relative', marginTop: -50, padding: '0 32px 32px' }}>
            <div style={{ display: 'flex', gap: 24, alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative' }}>
                <div style={{
                  fontSize: 80,
                  background: 'var(--bg-card)',
                  width: 130, height: 130,
                  borderRadius: 32,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '6px solid var(--bg-card)',
                  boxShadow: 'var(--shadow)',
                  zIndex: 10,
                  transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }} className="profile-main-avatar">
                  {profileAvatar}
                </div>
                <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'var(--green)', width: 28, height: 28, borderRadius: '50%', border: '5px solid var(--bg-card)', zIndex: 11, boxShadow: 'var(--shadow-sm)' }} />
              </div>
              <div style={{ flex: 1, paddingBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: 28, fontWeight: 900, margin: 0, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>{profileName || 'Usuario'}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
                    <span className={`badge ${user?.isAdmin ? 'badge-accent' : 'badge-ghost'}`} style={{ padding: '4px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700 }}>
                      {user?.isAdmin ? 'ADMINISTRADOR' : 'USUARIO'}
                    </span>
                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--text-muted)' }} />
                    <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>{user?.email}</span>
                  </div>
                </div>
                {!isEditingProfile && (
                  <button className="btn btn-ghost" onClick={() => setIsEditingProfile(true)}>
                    <Ic d={PATHS.settings} size={14} /> Editar Perfil
                  </button>
                )}
              </div>
            </div>

            {isEditingProfile ? (
              <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40 }} className="fade-in">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div style={{ background: 'var(--bg-input)', padding: 20, borderRadius: 16, border: '1px solid var(--border)' }}>
                    <label style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 800, marginBottom: 16, display: 'block', letterSpacing: '0.05em' }}>INFORMACIÓN BÁSICA</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div>
                        <label style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, display: 'block' }}>NOMBRE PÚBLICO</label>
                        <input
                          className="text-input"
                          value={profileName}
                          onChange={e => setProfileName(e.target.value)}
                          style={{ height: 46, background: 'var(--bg-card)', fontSize: 14, fontWeight: 600, borderRadius: 10 }}
                          placeholder="Ej. Juan Pérez"
                        />
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button className="btn btn-ghost" style={{ flex: 1, height: 50 }} onClick={() => setIsEditingProfile(false)}>Cancelar</button>
                    <button
                      className="btn btn-primary"
                      style={{ flex: 2, height: 50, justifyContent: 'center' }}
                      onClick={handleSaveProfile}
                    >
                      <Ic d="M5 13l4 4L19 7" size={20} /> Guardar Perfil
                    </button>
                  </div>
                </div>

                <div style={{ background: 'var(--bg-input)', padding: 20, borderRadius: 16, border: '1px solid var(--border)' }}>
                  <label style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 800, marginBottom: 16, display: 'block', letterSpacing: '0.05em' }}>PERSONALIZAR AVATAR</label>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gap: 10,
                    maxHeight: 220,
                    overflowY: 'auto',
                    paddingRight: 8
                  }} className="avatar-grid-custom">
                    {AVATARS.map(av => (
                      <button
                        key={av}
                        onClick={() => setProfileAvatar(av)}
                        style={{
                          fontSize: 28,
                          aspectRatio: '1',
                          background: profileAvatar === av ? 'var(--accent)' : 'var(--bg-card)',
                          border: 'none',
                          borderRadius: 14,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        className="avatar-select-btn"
                      >
                        {av}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ marginTop: 24, padding: 16, background: 'var(--bg-secondary)', borderRadius: 12, border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ background: 'var(--accent-light)', color: 'var(--accent)', padding: 8, borderRadius: 8 }}>
                  <Ic d={PATHS.unlock} size={20} />
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                  Pulsa en <b>Editar Perfil</b> para cambiar tu nombre público o elegir un nuevo avatar.
                </div>
              </div>
            )}
          </div>
        </div>
        <style>{`
          .avatar-select-btn:hover {
            transform: translateY(-4px) scale(1.1);
            background: var(--bg-card-hover);
            z-index: 5;
          }
          .profile-main-avatar:hover {
             transform: scale(1.02);
          }
          .avatar-grid-custom::-webkit-scrollbar { width: 5px; }
          .avatar-grid-custom::-webkit-scrollbar-thumb { background: var(--border-light); border-radius: 10px; }
        `}</style>

        {/* Gestión de Secciones */}
        <div className="card">
          <div className="chart-card-title">Visibilidad de Secciones</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>Personaliza tu barra lateral ocultando las secciones que no utilizas a diario.</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            {PERMISSIONS.filter(p => !['settings', 'users'].includes(p.id)).map(p => {
              const isVisible = config?.visibleViews?.includes(p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    const current = config?.visibleViews || [];
                    const next = isVisible ? current.filter(id => id !== p.id) : [...current, p.id];
                    onUpdateVisibility(next);
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 16px', borderRadius: 12,
                    background: isVisible ? 'var(--accent-light)' : 'var(--bg-secondary)',
                    border: isVisible ? '1px solid var(--accent)' : '1px solid var(--border)',
                    color: isVisible ? 'var(--accent)' : 'var(--text-secondary)',
                    cursor: 'pointer', transition: 'all 0.2s',
                    textAlign: 'left'
                  }}
                >
                  <Ic d={p.icon} size={18} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{p.label}</div>
                    <div style={{ fontSize: 10, opacity: 0.7 }}>{isVisible ? 'VISIBLE' : 'OCULTO'}</div>
                  </div>
                  <div style={{
                    width: 20, height: 20, borderRadius: 6,
                    background: isVisible ? 'var(--accent)' : 'var(--bg-card)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {isVisible && <Ic d="M5 13l4 4L19 7" size={12} style={{ color: 'white' }} />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="chart-card-title" style={{ marginTop: 32 }}>Categorías de Presupuesto Visibles</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>Elige qué bloques del presupuesto anual quieres ver en el dashboard.</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            {["Ingresos", "Gastos Esenciales", "Gastos Discrecionales", "Pago de Deudas", "Ahorro e Inversión"].map(section => {
              const isVisible = config?.visibleBudgetSections?.includes(section);
              return (
                <button
                  key={section}
                  onClick={() => {
                    const current = config?.visibleBudgetSections || [];
                    const next = isVisible ? current.filter(s => s !== section) : [...current, section];
                    onUpdate({ ...config, visibleBudgetSections: next });
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 16px', borderRadius: 12,
                    background: isVisible ? 'var(--bg-card)' : 'var(--bg-secondary)',
                    border: isVisible ? `1px solid ${getCategoryColor(section)}` : '1px solid var(--border)',
                    color: isVisible ? getCategoryColor(section) : 'var(--text-secondary)',
                    cursor: 'pointer', transition: 'all 0.2s',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ width: 12, height: 12, borderRadius: 4, background: getCategoryColor(section) }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{section}</div>
                    <div style={{ fontSize: 10, opacity: 0.7 }}>{isVisible ? 'MOSTRAR' : 'OCULTAR'}</div>
                  </div>
                  <div style={{
                    width: 20, height: 20, borderRadius: 6,
                    background: isVisible ? getCategoryColor(section) : 'var(--bg-card)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {isVisible && <Ic d="M5 13l4 4L19 7" size={12} style={{ color: 'white' }} />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Appearance */}
        <div className="card">
          <div className="chart-card-title">{t.generalSettings}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Theme */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label>{t.theme}</label>
                <button className="btn btn-ghost" style={{ fontSize: 11, padding: '4px 8px' }} onClick={onStartTutorial}>
                  <Ic d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" size={12} /> Lanzar Tutorial
                </button>
              </div>
              <div className="settings-toggle" style={{ marginTop: 6 }}>
                <button className={`settings-toggle-btn ${theme === 'dark' ? 'active' : ''}`} onClick={() => theme !== 'dark' && toggleTheme()}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}><Ic d={PATHS.moon} size={14} /> {t.darkMode}</span>
                </button>
                <button className={`settings-toggle-btn ${theme === 'light' ? 'active' : ''}`} onClick={() => theme !== 'light' && toggleTheme()}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}><Ic d={PATHS.sun} size={14} /> {t.lightMode}</span>
                </button>
              </div>
            </div>
            {/* Language */}
            <div>
              <label>{t.language}</label>
              <div className="settings-toggle" style={{ marginTop: 6 }}>
                <button className={`settings-toggle-btn ${language === 'es' ? 'active' : ''}`} onClick={() => setLanguageTo('es')}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}><Ic d={PATHS.globe} size={14} /> Español</span>
                </button>
                <button className={`settings-toggle-btn ${language === 'en' ? 'active' : ''}`} onClick={() => setLanguageTo('en')}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}><Ic d={PATHS.globe} size={14} /> English</span>
                </button>
                <button className={`settings-toggle-btn ${language === 'de' ? 'active' : ''}`} onClick={() => setLanguageTo('de')}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}><Ic d={PATHS.globe} size={14} /> Deutsch</span>
                </button>
              </div>
            </div>
            {/* Año con el que se abre la app: 0 = automático (año en curso) */}
            <div>
              <label style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 8, display: 'block' }}>{t.defaultYear}</label>
              <select className="select-input" value={config?.anioInicial || 0} onChange={e => { onUpdate({ ...config, anioInicial: parseInt(e.target.value) || 0 }); }} style={{ width: '100%', maxWidth: 250, height: 46 }}>
                <option value={0}>Automático (año en curso)</option>
                {Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - 1 + i).map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>
                Los años nuevos se crean solos al seleccionarlos en la barra superior, heredando las categorías, el presupuesto y los saldos del año anterior. Después, cada año guarda sus propios cambios.
              </div>
            </div>
          </div>
        </div>

        {/* Category manager */}
        <div className="card">
          <div className="chart-card-title">{t.categoryManager} <span style={{ color: 'var(--accent)', fontWeight: 800 }}>({selectedYear} ➝)</span></div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>
            Modifica las categorías para <b>{selectedYear}</b> y años posteriores.
            Utiliza el selector de año en la barra superior para editar un año en concreto.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {['Activos', 'Pasivos'].map(mk => (
              <div key={mk} style={{ borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontWeight: 600, fontSize: 13, color: getCategoryColor(mk) }}>{t[mk] || mk}</span>
                  <button className="btn btn-ghost" style={{ padding: '5px 10px', fontSize: 12 }} onClick={() => { setModalMainCat(mk); setNewCatName(''); setShowModal(true); }}>
                    <Ic d={PATHS.plus} size={13} /> {t.add}
                  </button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {((financialData?.[selectedYear]?.categories || config.categories)[mk] || []).map(sub => {
                    const isLoan = (mk === 'Pasivos' || mk === 'Pago de Deudas') && (financialData?.loans || []).some(l => l.name === sub);
                    return (
                      <span key={sub} className="chip" style={{ paddingRight: isLoan ? 12 : 6 }} onClick={() => { if (!isLoan) { setRenameTarget({ mk, oldName: sub }); setRenameValue(sub); } }}>
                        {sub}
                        {isLoan ? (
                          <span style={{ marginLeft: 6, opacity: 0.5 }} title={t.loanLocked}>
                            <Ic d={PATHS.lock} size={10} />
                          </span>
                        ) : (
                          <button className="chip-remove" onClick={(e) => { e.stopPropagation(); setDeleteTarget({ mk, sub }); setShowDeleteModal(true); }}>
                            <Ic d="M6 18L18 6M6 6l12 12" size={11} />
                          </button>
                        )}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add subcategory modal */}
      {
        showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-title">{t.addSubcategory} "{modalMainCat}"</div>
              <input className="text-input" placeholder={t.newSubcategoryName} value={newCatName} onChange={e => setNewCatName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddCat()} autoFocus />
              <div className="modal-actions">
                <button className="btn btn-ghost" onClick={() => setShowModal(false)}>{t.cancel}</button>
                <button className="btn btn-primary" onClick={handleAddCat}>{t.add}</button>
              </div>
            </div>
          </div>
        )
      }

      {/* Rename modal */}
      {
        renameTarget && (
          <div className="modal-overlay" onClick={() => setRenameTarget(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-title">Renombrar "{renameTarget.oldName}"</div>
              <input className="text-input" value={renameValue} onChange={e => setRenameValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleRename()} autoFocus />
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>Se modificará en presupuestos, transacciones y patrimonio.</div>
              <div className="modal-actions">
                <button className="btn btn-ghost" onClick={() => setRenameTarget(null)}>{t.cancel}</button>
                <button className="btn btn-primary" onClick={handleRename}>Guardar</button>
              </div>
            </div>
          </div>
        )
      }

      {/* Delete confirm modal */}
      {
        showDeleteModal && (
          <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-title">{t.confirmDelete}</div>
              <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.6 }}>
                ¿Eliminar <strong style={{ color: 'var(--red)' }}>{deleteTarget?.sub}</strong>?<br />
                <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{t.deleteWarning}</span>
              </p>
              <div className="modal-actions">
                <button className="btn btn-ghost" onClick={() => setShowDeleteModal(false)}>{t.cancel}</button>
                <button className="btn btn-danger" onClick={handleDelete}>{t.delete}</button>
              </div>
            </div>
          </div>
        )
      }

      {/* Trading View */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .trading-form { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 12px; align-items: end; margin-bottom: 24px; }
        .trading-badge-long { background: rgba(16, 185, 129, 0.1); color: #10b981; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: 700; }
        .trading-badge-short { background: rgba(239, 68, 68, 0.1); color: #ef4444; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: 700; }
      `}} />
    </div >
  );
}

// ─── TRADING VIEW ──────────────────────────────────────────────────────────────
function TradingView({ trades, onUpdate, fullData }) {
  const { t, theme } = useApp();
  const isDark = theme === 'dark';
  const tooltipStyle = { backgroundColor: isDark ? '#1e2130' : '#fff', border: `1px solid ${isDark ? '#2d3148' : '#e2e5f0'}`, borderRadius: 8, fontSize: 12 };
  const axisColor = isDark ? '#565d80' : '#9098b8';
  const gridColor = isDark ? '#2d3148' : '#e2e5f0';

  const [form, setForm] = useState({ date: new Date().toISOString().split('T')[0], asset: '', action: 'COMPRA', type: 'Long', price: '', amount: '', fees: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.asset || !form.price || !form.amount) return;
    const nt = { ...form, asset: form.asset.trim(), id: crypto.randomUUID(), ts: Date.now(), price: parseFloat(form.price), amount: parseFloat(form.amount), fees: parseFloat(form.fees || 0) };
    const nd = JSON.parse(JSON.stringify(fullData));
    nd.trading = [nt, ...(nd.trading || [])];
    onUpdate(nd);
    setForm({ ...form, asset: '', price: '', amount: '', fees: '' });
  };

  const handleDelete = (id) => {
    const nd = JSON.parse(JSON.stringify(fullData));
    nd.trading = nd.trading.filter(t => t.id !== id);
    onUpdate(nd);
  };

  const processed = useMemo(() => procesarTrades(trades), [trades]);

  const stats = {
    total: trades.length,
    profit: processed.totalRealizedPnL,
    gross: processed.totalGrossPnL,
    fees: processed.totalFees,
    wins: processed.wins,
    losses: processed.losses,
    openPositions: Object.values(processed.assets).filter(a => a.totalQty > 0).length
  };

  const sortedTrades = useMemo(() => [...trades].sort((a, b) => new Date(b.date) - new Date(a.date)), [trades]);

  return (
    <div className="section-gap">
      <div className="grid-3">
        <div className="card" style={{ borderLeft: '4px solid var(--green)' }}>
          <div className="card-title">Resultado Neto (Realizado)</div>
          <div className={`card-value ${stats.profit >= 0 ? 'green' : 'red'}`}>{fmt(stats.profit)}</div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Bruto: {fmt(stats.gross)} | Comis: {fmt(stats.fees)}</div>
        </div>
        <div className="card">
          <div className="card-title">Estadísticas</div>
          <div className="card-value blue">{stats.wins}W - {stats.losses}L</div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Ratio: {stats.total > 0 ? (stats.wins / (stats.wins + stats.losses || 1) * 100).toFixed(1) : 0}%</div>
        </div>
        <div className="card">
          <div className="card-title">Posiciones Abiertas</div>
          <div className="card-value">{stats.openPositions}</div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>De {stats.total} transacciones</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="chart-card" style={{ height: 300 }}>
          <div className="chart-card-title">Curva de Equidad (PnL Acumulado)</div>
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={processed.history}>
              <defs>
                <linearGradient id="colorPnL" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke={gridColor} strokeOpacity={0.5} />
              <XAxis dataKey="name" stroke={axisColor} fontSize={10} hide />
              <YAxis stroke={axisColor} fontSize={10} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="pnl" stroke="#6366f1" fill="url(#colorPnL)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card" style={{ height: 300 }}>
          <div className="chart-card-title">Posiciones Actuales</div>
          <div className="table-wrap" style={{ height: '80%', overflow: 'auto' }}>
            <table style={{ fontSize: 11 }}>
              <thead><tr><th>Activo</th><th>Tipo</th><th className="text-right">Cantidad</th><th className="text-right">Precio Avg</th></tr></thead>
              <tbody>
                {Object.entries(processed.assets).filter(([_, a]) => a.totalQty > 0).map(([name, a]) => (
                  <tr key={name}>
                    <td>{name}</td>
                    <td><span className={a.type === 'Long' ? 'trading-badge-long' : 'trading-badge-short'}>{a.type.toUpperCase()}</span></td>
                    <td className="text-right">{a.totalQty}</td>
                    <td className="text-right">{fmt(a.avgPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="chart-card-title">Nueva Operación</div>
        <form onSubmit={handleAdd} className="trading-form" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))' }}>
          <div><label>Fecha</label><input type="date" className="date-input" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
          <div><label>Activo</label><input type="text" className="text-input" placeholder="BTC/USDT" value={form.asset} onChange={e => setForm({ ...form, asset: e.target.value })} /></div>
          <div><label>Acción</label>
            <select className="select-input" value={form.action} onChange={e => setForm({ ...form, action: e.target.value })}>
              <option>COMPRA</option><option>VENTA</option>
            </select>
          </div>
          <div><label>Dirección</label>
            <select className="select-input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
              <option>Long</option><option>Short</option>
            </select>
          </div>
          <div><label>Precio</label><input type="number" step="any" className="number-input" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} /></div>
          <div><label>Cantidad</label><input type="number" step="any" className="number-input" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} /></div>
          <div><label>Comisiones</label><input type="number" step="any" className="number-input" value={form.fees} onChange={e => setForm({ ...form, fees: e.target.value })} /></div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', height: 42 }}>Añadir</button>
        </form>
      </div>

      <div className="card">
        <div className="chart-card-title">Historial de Operaciones</div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Activo</th>
                <th>Acción</th>
                <th>Tipo</th>
                <th className="text-right">Cantidad</th>
                <th className="text-right">Precio</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sortedTrades.map(t => (
                <tr key={t.id}>
                  <td style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{t.date}</td>
                  <td style={{ fontWeight: 700 }}>{t.asset}</td>
                  <td><span style={{ fontSize: 10, fontWeight: 800, color: t.action === 'COMPRA' ? 'var(--green)' : 'var(--blue)' }}>{t.action}</span></td>
                  <td><span className={t.type === 'Long' ? 'trading-badge-long' : 'trading-badge-short'}>{t.type.toUpperCase()}</span></td>
                  <td className="text-right">{t.amount}</td>
                  <td className="text-right">{fmt(t.price)}</td>
                  <td className="text-center">
                    <button className="btn btn-icon btn-danger" onClick={() => handleDelete(t.id)}><Ic d={PATHS.trash} size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── ANALYSIS VIEW (MAIN CONTAINER) ───────────────────────────────────────────
function AnalysisView() {
  const [activeTab, setActiveTab] = useState('vpn');

  return (
    <div className="section-gap">
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, padding: 4, background: 'var(--bg-secondary)', borderRadius: 12, width: 'fit-content' }}>
        <button className={`btn ${activeTab === 'vpn' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('vpn')} style={{ borderRadius: 8, padding: '8px 20px' }}>VPN / TIR</button>
        <button className={`btn ${activeTab === 'compound' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('compound')} style={{ borderRadius: 8, padding: '8px 20px' }}>Interés Compuesto</button>
      </div>

      {activeTab === 'vpn' ? <VPNView /> : <CompoundInterestView />}
    </div>
  );
}

// ─── VPN / TIR SUB-VIEW ───────────────────────────────────────────────────────
function VPNView() {
  const { theme } = useApp();
  const [initialInvestment, setInitialInvestment] = useState(10000);
  const [discountRate, setDiscountRate] = useState(10);
  const [periods, setPeriods] = useState(5);
  const [flows, setFlows] = useState([2000, 3000, 4000, 4000, 5000]);

  const updatePeriods = (num) => {
    const n = parseInt(num) || 1;
    setPeriods(n);
    const newFlows = [...flows];
    while (newFlows.length < n) newFlows.push(0);
    setFlows(newFlows.slice(0, n));
  };

  const calculateVPN = (rate) => {
    const r = rate / 100;
    let vpn = -initialInvestment;
    flows.forEach((f, i) => {
      vpn += f / Math.pow(1 + r, i + 1);
    });
    return vpn;
  };

  const calculateTIR = () => {
    let low = -0.99, high = 5.0, tir = 0;
    for (let i = 0; i < 100; i++) {
      tir = (low + high) / 2;
      if (calculateVPN(tir * 100) > 0) low = tir;
      else high = tir;
    }
    return tir * 100;
  };

  const vpn = calculateVPN(discountRate);
  const tir = calculateTIR();

  const getSemaforo = (val) => {
    if (val > 0.01) return { color: 'var(--green)', icon: '🟢', msg: '¡Adelante! Proyecto rentable.' };
    if (val < -0.01) return { color: 'var(--red)', icon: '🔴', msg: '¡Alto! Destrucción de valor.' };
    return { color: 'var(--accent)', icon: '🟡', msg: 'Indiferente / Neutro.' };
  };

  const status = getSemaforo(vpn);

  return (
    <div className="fade-in">
      <div className="grid-2">
        <div className="card">
          <div className="chart-card-title">Configuración del Proyecto</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label>Inversión Inicial ($I_0$)</label>
              <input type="number" className="text-input" value={initialInvestment} onChange={e => setInitialInvestment(parseFloat(e.target.value) || 0)} />
            </div>
            <div className="grid-2" style={{ gap: 12 }}>
              <div>
                <label>Tasa Descuento (%)</label>
                <input type="number" className="text-input" value={discountRate} onChange={e => setDiscountRate(parseFloat(e.target.value) || 0)} />
              </div>
              <div>
                <label>Años/Periodos</label>
                <input type="number" className="text-input" value={periods} onChange={e => updatePeriods(e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ borderLeft: `6px solid ${status.color}` }}>
          <div className="chart-card-title">Resultado del Análisis</div>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Valor Presente Neto (VPN)</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: status.color }}>{fmt(vpn)}</div>
          </div>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Tasa Interna de Retorno (TIR)</div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>{tir.toFixed(2)}%</div>
          </div>
          <div style={{ padding: '12px 16px', background: `${status.color}15`, borderRadius: 12, border: `1px solid ${status.color}30` }}>
            <span style={{ fontSize: 20, marginRight: 8 }}>{status.icon}</span>
            <span style={{ fontWeight: 600, color: status.color }}>{status.msg}</span>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <div className="chart-card-title">Flujos de Caja Futuros ($F_t$)</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 16 }}>
          {flows.map((f, i) => (
            <div key={i}>
              <label>Año {i + 1}</label>
              <input type="number" className="text-input" value={f}
                onChange={e => {
                  const nf = [...flows];
                  nf[i] = parseFloat(e.target.value) || 0;
                  setFlows(nf);
                }} />
            </div>
          ))}
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: 24 }}>
        <div className="card" style={{ fontSize: 13, lineHeight: 1.6 }}>
          <div className="chart-card-title">¿Qué significa el VPN?</div>
          <p>Trae todos los flujos futuros al valor de <b>HOY</b> restando la inflación y el costo de oportunidad.</p>
          <ul style={{ paddingLeft: 20, marginTop: 10 }}>
            <li><b style={{ color: 'var(--green)' }}>VPN {'>'} 0</b>: Ganas dinero real por encima de tu rentabilidad exigida.</li>
            <li><b style={{ color: 'var(--red)' }}>VPN {'<'} 0</b>: Estás perdiendo poder adquisitivo o ganando menos que el mínimo.</li>
          </ul>
        </div>
        <div className="card" style={{ fontSize: 13, lineHeight: 1.6 }}>
          <div className="chart-card-title">¿Qué significa la TIR?</div>
          <p>Es la rentabilidad porcentual anual que genera el proyecto por sí mismo.</p>
          <p style={{ marginTop: 10 }}>Si tu <b>TIR ({tir.toFixed(1)}%)</b> es mayor que tu <b>Tasa de Descuento ({discountRate}%)</b>, el proyecto vale la pena.</p>
        </div>
      </div>
    </div>
  );
}

// ─── COMPOUND INTEREST SUB-VIEW ──────────────────────────────────────────────
function CompoundInterestView() {
  const { t, theme } = useApp();
  const [initial, setInitial] = useState(5000);
  const [monthly, setMonthly] = useState(200);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(20);
  const [tableMode, setTableMode] = useState('years');
  const [tablePage, setTablePage] = useState(0);

  const yearlyData = useMemo(() => {
    let current = initial;
    let totalInvested = initial;
    const r = rate / 100 / 12;
    const results = [{ year: 0, total: initial, invested: initial, interest: 0 }];
    for (let y = 1; y <= years; y++) {
      for (let m = 0; m < 12; m++) {
        current = (current + monthly) * (1 + r);
        totalInvested += monthly;
      }
      results.push({ year: y, total: Math.round(current), invested: totalInvested, interest: Math.round(current - totalInvested) });
    }
    return results;
  }, [initial, monthly, rate, years]);

  const monthlyData = useMemo(() => {
    let current = initial;
    let totalInvested = initial;
    const r = rate / 100 / 12;
    const mLabels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const results = [{ month: 0, yearLabel: '-', monthLabel: t.initialStart, total: initial, invested: initial, interest: 0, monthInterest: 0, monthContrib: initial }];
    for (let y = 1; y <= years; y++) {
      for (let m = 0; m < 12; m++) {
        const interestThisMonth = (current + monthly) * r;
        current = (current + monthly) * (1 + r);
        totalInvested += monthly;
        results.push({
          month: (y - 1) * 12 + m + 1,
          yearLabel: y,
          monthLabel: mLabels[m],
          total: Math.round(current),
          invested: totalInvested,
          interest: Math.round(current - totalInvested),
          monthInterest: Math.round(interestThisMonth),
          monthContrib: monthly
        });
      }
    }
    return results;
  }, [initial, monthly, rate, years]);

  const finalTotal = yearlyData[yearlyData.length - 1].total;
  const finalInvested = yearlyData[yearlyData.length - 1].invested;
  const totalInterests = finalTotal - finalInvested;

  const isDark = theme === 'dark';
  const axisColor = isDark ? '#565d80' : '#7a82a0';
  const gridColor = isDark ? '#2d3148' : '#d4d8e4';
  const tooltipBg = isDark ? '#1e2130' : '#f9fafb';

  const ITEMS_PER_PAGE = 24;
  const totalPages = Math.ceil(monthlyData.length / ITEMS_PER_PAGE);
  const paginatedData = monthlyData.slice(tablePage * ITEMS_PER_PAGE, (tablePage + 1) * ITEMS_PER_PAGE);

  return (
    <div className="fade-in">
      <div className="grid-2">
        <div className="card">
          <div className="chart-card-title">Configuración de Ahorro</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="grid-2" style={{ gap: 12 }}>
              <div><label>Balance Inicial</label><input type="number" className="text-input" value={initial} onChange={e => setInitial(parseFloat(e.target.value) || 0)} /></div>
              <div><label>Contribución Mensual</label><input type="number" className="text-input" value={monthly} onChange={e => setMonthly(parseFloat(e.target.value) || 0)} /></div>
            </div>
            <div className="grid-2" style={{ gap: 12 }}>
              <div><label>Rentabilidad Anual (%)</label><input type="number" className="text-input" value={rate} onChange={e => setRate(parseFloat(e.target.value) || 0)} /></div>
              <div><label>Años</label><input type="number" className="text-input" value={years} onChange={e => setYears(parseInt(e.target.value) || 1)} /></div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="chart-card-title">Resultado Proyectado</div>
          <div className="grid-2" style={{ gap: 24 }}>
            <div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Capital Final</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--accent)' }}>{fmt(finalTotal)}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Intereses Generados</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--green)' }}>{fmt(totalInterests)}</div>
            </div>
          </div>
          <div style={{ marginTop: 16, fontSize: 13, color: 'var(--text-secondary)' }}>
            Has invertido un total de <b>{fmt(finalInvested)}</b>.
            El interés compuesto ha multiplicado tu capital por <b>{(finalTotal / (finalInvested || 1)).toFixed(2)}x</b>.
          </div>
        </div>
      </div>

      {/* Zoomable Chart with Brush */}
      <div className="chart-card" style={{ height: 420, marginTop: 24, padding: 24 }}>
        <div className="chart-card-title">Crecimiento de la Inversión</div>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '-8px 0 12px 0' }}>{t.zoomPrompt}</p>
        <ResponsiveContainer width="100%" height="85%">
          <AreaChart data={yearlyData}>
            <defs>
              <linearGradient id="colorTotal2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorInvested2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke={gridColor} strokeOpacity={0.5} />
            <XAxis dataKey="year" stroke={axisColor} tick={{ fontSize: 11 }} label={{ value: 'Años', position: 'insideBottom', offset: -5, fontSize: 11, fill: axisColor }} />
            <YAxis stroke={axisColor} tick={{ fontSize: 11 }} tickFormatter={v => new Intl.NumberFormat('es-ES', { notation: 'compact' }).format(v)} />
            <Tooltip formatter={v => fmt(v)} contentStyle={{ borderRadius: 12, background: tooltipBg, border: 'none', boxShadow: 'var(--shadow)' }} />
            <Legend wrapperStyle={{ fontSize: 12, paddingBottom: 28 }} />
            <Area type="monotone" dataKey="total" stroke="var(--accent)" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal2)" name="Balance Total" />
            <Area type="monotone" dataKey="invested" stroke="var(--text-muted)" strokeWidth={2} fillOpacity={1} fill="url(#colorInvested2)" name="Capital Invertido" />
            <Brush dataKey="year" height={28} stroke="var(--accent)" fill={isDark ? '#161825' : '#eef0f5'} travellerWidth={10} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Data Table */}
      <div className="card" style={{ marginTop: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <div className="chart-card-title" style={{ marginBottom: 0 }}>{t.projectionDetail}</div>
          <div className="settings-toggle">
            <button className={`settings-toggle-btn ${tableMode === 'years' ? 'active' : ''}`} onClick={() => { setTableMode('years'); setTablePage(0); }}>
              {t.annual}
            </button>
            <button className={`settings-toggle-btn ${tableMode === 'months' ? 'active' : ''}`} onClick={() => { setTableMode('months'); setTablePage(0); }}>
              {t.monthlyLabel}
            </button>
          </div>
        </div>
        <div className="table-wrap" style={{ maxHeight: 500, overflowY: 'auto' }}>
          <table>
            <thead>
              <tr>
                {tableMode === 'years' ? (
                  <>
                    <th>{t.year}</th>
                    <th className="text-right">{t.investedCapital}</th>
                    <th className="text-right">{t.accInterest}</th>
                    <th className="text-right">{t.totalBalance}</th>
                  </>
                ) : (
                  <>
                    <th>{t.year}</th>
                    <th>{t.month}</th>
                    <th className="text-right">{t.contribution}</th>
                    <th className="text-right">{t.monthInterestLabel}</th>
                    <th className="text-right">{t.investedCapital}</th>
                    <th className="text-right">{t.accInterest}</th>
                    <th className="text-right">{t.totalBalance}</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {(tableMode === 'years' ? yearlyData : paginatedData).map((row, i) => (
                <tr key={i}>
                  {tableMode === 'years' ? (
                    <>
                      <td style={{ fontWeight: 600 }}>{row.year === 0 ? t.initialStart : `${t.year} ${row.year}`}</td>
                      <td className="text-right">{fmt(row.invested)}</td>
                      <td className="text-right" style={{ color: 'var(--green)' }}>{fmt(row.interest)}</td>
                      <td className="text-right" style={{ fontWeight: 700, color: 'var(--accent)' }}>{fmt(row.total)}</td>
                    </>
                  ) : (
                    <>
                      <td style={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: 11 }}>{row.yearLabel}</td>
                      <td style={{ fontSize: 12 }}>{row.monthLabel}</td>
                      <td className="text-right" style={{ fontSize: 12 }}>{fmt(row.monthContrib)}</td>
                      <td className="text-right" style={{ color: 'var(--green)', fontSize: 12 }}>{fmt(row.monthInterest)}</td>
                      <td className="text-right" style={{ fontSize: 12 }}>{fmt(row.invested)}</td>
                      <td className="text-right" style={{ color: 'var(--green)', fontSize: 12 }}>{fmt(row.interest)}</td>
                      <td className="text-right" style={{ fontWeight: 700, color: 'var(--accent)', fontSize: 12 }}>{fmt(row.total)}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                {tableMode === 'years' ? (
                  <>
                    <td style={{ fontWeight: 800 }}>Total</td>
                    <td className="text-right" style={{ fontWeight: 700 }}>{fmt(finalInvested)}</td>
                    <td className="text-right" style={{ fontWeight: 700, color: 'var(--green)' }}>{fmt(totalInterests)}</td>
                    <td className="text-right" style={{ fontWeight: 800, color: 'var(--accent)' }}>{fmt(finalTotal)}</td>
                  </>
                ) : (
                  <>
                    <td colSpan={4} style={{ fontWeight: 800 }}>Total</td>
                    <td className="text-right" style={{ fontWeight: 700 }}>{fmt(finalInvested)}</td>
                    <td className="text-right" style={{ fontWeight: 700, color: 'var(--green)' }}>{fmt(totalInterests)}</td>
                    <td className="text-right" style={{ fontWeight: 800, color: 'var(--accent)' }}>{fmt(finalTotal)}</td>
                  </>
                )}
              </tr>
            </tfoot>
          </table>
        </div>
        {tableMode === 'months' && totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
            <button className="btn btn-ghost" disabled={tablePage === 0} onClick={() => setTablePage(p => p - 1)} style={{ padding: '6px 16px' }}>
              ← Anterior
            </button>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>
              Página {tablePage + 1} de {totalPages}
            </span>
            <button className="btn btn-ghost" disabled={tablePage >= totalPages - 1} onClick={() => setTablePage(p => p + 1)} style={{ padding: '6px 16px' }}>
              Siguiente →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MANAGEMENT VIEW (CRUD + ANALYTICS) ─────────────────────────────────────────
function UserManagementView() {
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [systemErrors, setSystemErrors] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Usuarios en tiempo real (solo Firestore: la lista antigua de localStorage ya no existe).
    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      setUsers(snap.docs.map(doc => ({ uid: doc.id, ...doc.data() })));
      setLoading(false);
    }, (err) => {
      console.error(err);
      setLoading(false);
    });

    // Real-time logs
    const unsubLogs = onSnapshot(collection(db, 'activity_logs'), (snap) => {
      const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLogs(list);
    }, (err) => {
      console.error("Logs sync error:", err);
      setLogs([]);
    });

    // Real-time system errors
    const unsubErrors = onSnapshot(
      query(collection(db, 'system_errors'), orderBy('timestamp', 'desc')),
      (snap) => {
        setSystemErrors(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      },
      (err) => console.error("Error fetching system errors:", err)
    );

    return () => {
      unsubUsers();
      unsubLogs();
      unsubErrors();
    };
  }, []);
  const now = Date.now();
  const getInPeriod = (days) => logs.filter(l => l.lastSeen > now - days * 24 * 3600 * 1000);

  const stats7d = getInPeriod(7).length;
  const stats30d = getInPeriod(30).length;
  const stats90d = getInPeriod(90).length;
  const stats365d = getInPeriod(365).length;

  const onlineUsers = users.filter(u => {
    const userLog = logs.sort((a, b) => b.lastSeen - a.lastSeen).find(l => l.uid === u.uid && !l.end);
    return userLog && (now - userLog.lastSeen) < 5 * 60000; // Activos en los últimos 5 minutos
  });

  // Chart Data: Sessions per day last 30 days
  const chartData = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const dayStr = d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
    const count = logs.filter(l => {
      if (!l.lastSeen) return false;
      const ld = new Date(l.lastSeen);
      return ld.getDate() === d.getDate() && ld.getMonth() === d.getMonth() && ld.getFullYear() === d.getFullYear();
    }).length;
    return { name: dayStr, sesiones: count };
  });

  // Calculate most active users
  const userActivity = users.map(u => {
    const uLogs = logs.filter(l => l.uid === u.uid);
    const totalTime = uLogs.reduce((acc, l) => acc + (l.totalTime || 0), 0);
    return { name: u.displayName, sessions: uLogs.length, time: Math.round(totalTime / 60000) };
  }).sort((a, b) => b.time - a.time);

  const exportCSV = () => {
    const headers = ['Usuario', 'Email', 'Inicio', 'Fin', 'Duración (min)'];
    const rows = logs.map(l => [
      users.find(u => u.uid === l.uid)?.displayName || 'Desconocido',
      l.email,
      // Los registros antiguos no tienen `start`: se estima restando el tiempo acumulado.
      new Date(l.start || ((l.lastSeen || 0) - (l.totalTime || 0))).toLocaleString(),
      l.end ? new Date(l.end).toLocaleString() : 'Sesión Activa',
      Math.round((l.totalTime || 0) / 60000)
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `reporte_actividad_${new Date().toISOString().slice(0, 10)}.csv`);
    link.click();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    const fd = new FormData(e.target);
    const perms = PERMISSIONS.map(p => p.id).filter(id => fd.get(`perm_${id}`) === 'on');

    // Las cuentas se crean registrándose en la web (Firebase Auth); aquí solo se
    // editan. El email no se toca: cambiarlo solo en Firestore lo desacoplaría de
    // Auth. Pago recibido: se apunta la fecha hasta la que queda cubierto; las
    // reglas solo dejan escribir ese campo al admin.
    const fechaPago = fd.get('paidUntil');
    const esUnoMismo = editingUser.uid === auth?.currentUser?.uid;
    const userData = {
      displayName: fd.get('name'),
      isAdmin: esUnoMismo ? true : fd.get('role') === 'admin', // un admin no puede quitarse el rol a sí mismo
      permissions: perms,
      paidUntil: fechaPago ? new Date(`${fechaPago}T23:59:59`).getTime() : 0,
      lastUpdated: Date.now()
    };

    try {
      await setDoc(doc(db, 'users', editingUser.uid), userData, { merge: true });
      setEditingUser(null);
    } catch (err) {
      alert("Error al guardar usuario: " + err.message);
    }
  };

  // Desde el navegador no se puede borrar una cuenta de Firebase Auth, y borrar
  // solo el documento dejaba al usuario entrar de nuevo con una prueba gratuita
  // nueva. En su lugar se bloquea: conserva la lectura de sus datos (RGPD) pero
  // las reglas le deniegan cualquier escritura.
  const handleBloqueo = async (u) => {
    if (u.isAdmin || u.uid === auth?.currentUser?.uid) return alert('No puedes bloquear a un administrador');
    const bloquear = !u.bloqueado;
    const nombre = u.displayName || u.email || u.uid;
    if (!window.confirm(bloquear ? `¿Bloquear a ${nombre}? No podrá guardar cambios hasta que lo desbloquees.` : `¿Desbloquear a ${nombre}?`)) return;
    try {
      await setDoc(doc(db, 'users', u.uid), { bloqueado: bloquear, lastUpdated: Date.now() }, { merge: true });
    } catch (err) {
      alert("Error al actualizar el usuario: " + err.message);
    }
  };

  const UserForm = ({ u, onCancel }) => (
    <div className="card fade-in" style={{ marginBottom: 20, border: '1px solid var(--accent)' }}>
      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 10px 0' }}>Datos de Cuenta</h3>
            <div><label className="login-label">Nombre</label><input name="name" className="text-input" defaultValue={u?.displayName} required /></div>
            <div><label className="login-label">Email</label><input type="email" className="text-input" value={u?.email || ''} readOnly disabled title="El email lo gestiona Firebase Auth" /></div>
            {/* Campo de contraseña eliminado: mostraba en claro la contraseña
                almacenada. Firebase Auth custodia las credenciales. */}
            <div>
              <label className="login-label">Pagado hasta</label>
              <input
                name="paidUntil"
                type="date"
                className="text-input"
                defaultValue={u?.paidUntil ? new Date(u.paidUntil).toISOString().slice(0, 10) : ''}
              />
              <div style={{ fontSize: 11, opacity: .65, marginTop: 4 }}>
                {u?.trialEndsAt
                  ? `Prueba hasta ${new Date(u.trialEndsAt).toLocaleDateString('es-ES')}. `
                  : 'Sin prueba registrada. '}
                Déjalo vacío para dejarlo sin pagar.
              </div>
            </div>
            <div><label className="login-label">Rol Global</label>
              <select name="role" className="select-input" defaultValue={u?.isAdmin ? 'admin' : 'user'}>
                <option value="user">Usuario (Basado en Permisos)</option>
                <option value="admin">Administrador (Todo permitido)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 10px 0' }}>Permisos Específicos</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {PERMISSIONS.map(p => (
                <label key={p.id} className="permission-toggle">
                  <input type="checkbox" name={`perm_${p.id}`} defaultChecked={u ? u.permissions?.includes(p.id) : true} />
                  <span>{p.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 12, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
          <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancelar</button>
          <button type="submit" className="btn btn-primary">Guardar Cambios</button>
        </div>
      </form>
      <style>{`
        .permission-toggle {
          display: flex; align-items: center; gap: 8; padding: 10px;
          background: rgba(255,255,255,0.03); border-radius: 8px;
          cursor: pointer; font-size: 11px; font-weight: 500;
          transition: background 0.2s;
        }
        .permission-toggle:hover { background: rgba(255,255,255,0.06); }
        .permission-toggle input { width: 16px; height: 16px; cursor: pointer; }
      `}</style>
    </div>
  );

  return (
    <div className="section-gap fade-in" style={{ width: '100%', maxWidth: 1600, margin: '0 auto' }}>
      {/* Analytics Dashboard - Professional Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 32 }}>
        <div className="card" style={{ padding: '24px', borderLeft: '4px solid var(--green)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>Estado Realtime</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="pulse-dot"></span> {onlineUsers.length} <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--text-secondary)' }}>usuarios hoy</span>
          </div>
          <div style={{ position: 'absolute', right: -10, bottom: -10, opacity: 0.1 }}><Ic d={PATHS.users} size={80} /></div>
        </div>

        <div className="card" style={{ padding: '24px', background: 'var(--bg-secondary)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 12 }}>Histórico de Tráfico</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ textAlign: 'center' }}><div style={{ fontSize: 18, fontWeight: 800 }}>{stats7d}</div><div style={{ fontSize: 9, color: 'var(--text-muted)' }}>7 DÍAS</div></div>
            <div style={{ textAlign: 'center' }}><div style={{ fontSize: 18, fontWeight: 800 }}>{stats30d}</div><div style={{ fontSize: 9, color: 'var(--text-muted)' }}>30 DÍAS</div></div>
            <div style={{ textAlign: 'center' }}><div style={{ fontSize: 18, fontWeight: 800 }}>{stats90d}</div><div style={{ fontSize: 9, color: 'var(--text-muted)' }}>90 DÍAS</div></div>
            <div style={{ textAlign: 'center', color: 'var(--accent)' }}><div style={{ fontSize: 18, fontWeight: 800 }}>{stats365d}</div><div style={{ fontSize: 9 }}>ANUAL</div></div>
          </div>
        </div>

        <div className="card" style={{ padding: '24px', display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={exportCSV} style={{ padding: '12px 20px', fontSize: 14 }}>
            <Ic d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" size={18} />
            Exportar Auditoría CSV
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24, marginBottom: 32 }}>
        <div className="card" style={{ height: 350 }}>
          <div className="chart-card-title">Tendencia de Actividad (30 días)</div>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} stroke="var(--border)" strokeOpacity={0.5} />
              <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)' }} />
              <YAxis fontSize={10} axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)' }} />
              <Tooltip
                contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                cursor={{ fill: 'var(--accent-light)' }}
              />
              <Bar dataKey="sesiones" fill="var(--accent)" radius={[4, 4, 0, 0]} barSize={12} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="chart-card-title">Ranking de Engagement</div>
          <div className="table-wrap">
            <table style={{ marginTop: 10 }}>
              <thead>
                <tr>
                  <th style={{ background: 'transparent' }}>Usuario</th>
                  <th className="text-center" style={{ background: 'transparent' }}>Sesiones</th>
                  <th className="text-right" style={{ background: 'transparent' }}>Tiempo Total</th>
                </tr>
              </thead>
              <tbody>
                {userActivity.slice(0, 5).map((ua, idx) => (
                  <tr key={idx}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: idx === 0 ? 'var(--yellow)' : 'var(--accent)' }}></div>
                        {ua.name}
                      </div>
                    </td>
                    <td className="text-center" style={{ fontWeight: 700 }}>{ua.sessions}</td>
                    <td className="text-right" style={{ color: 'var(--text-secondary)' }}>{ua.time} min</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Usuarios del Sistema</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '4px 0 0' }}>Gestión de identidades y privilegios granulares.</p>
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', maxWidth: 360, textAlign: 'right' }}>
          Las cuentas se crean cuando el usuario se registra en la web. Aquí se editan nombre, rol, permisos y pagos, y se bloquean o desbloquean.
        </div>
      </div>

      {editingUser && (
        <UserForm u={editingUser} onCancel={() => setEditingUser(null)} />
      )}

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Rol / Permisos</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.uid}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{u.displayName}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{u.email}</div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {u.isAdmin ? (
                        <span className="badge badge-accent" style={{ fontSize: 9 }}>ADMIN TOTAL</span>
                      ) : (
                        (u.permissions || []).map(pId => {
                          const p = PERMISSIONS.find(px => px.id === pId);
                          return <span key={pId} className="badge badge-ghost" style={{ fontSize: 9, opacity: 0.8 }}>{p?.label}</span>;
                        })
                      )}
                      {(!u.isAdmin && (!u.permissions || u.permissions.length === 0)) && (
                        <span style={{ fontSize: 11, color: 'var(--red)', fontStyle: 'italic' }}>Sin accesos</span>
                      )}
                      {u.bloqueado && (
                        <span className="badge" style={{ fontSize: 9, background: 'var(--red)', color: 'white' }}>BLOQUEADO</span>
                      )}
                    </div>
                  </td>
                  <td className="text-center">
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                      <button className="btn btn-icon" title="Editar" onClick={() => setEditingUser(u)}>
                        <Ic d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" size={14} />
                      </button>
                      {!u.isAdmin && (
                        <button className={`btn btn-icon ${u.bloqueado ? 'btn-primary' : 'btn-danger'}`} title={u.bloqueado ? 'Desbloquear' : 'Bloquear'} onClick={() => handleBloqueo(u)}>
                          <Ic d={u.bloqueado ? PATHS.unlock : PATHS.lock} size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 40, marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: 'var(--red)' }}>Auditoría de Errores Críticos (Firebase)</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '4px 0 0' }}>Registro de fallos en sincronización o base de datos reportados por la plataforma.</p>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {systemErrors.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>No se han registrado errores en el sistema.</div>
        ) : (
          <div className="table-wrap" style={{ maxHeight: 300, overflowY: 'auto' }}>
            <table style={{ margin: 0 }}>
              <thead>
                <tr>
                  <th style={{ background: 'var(--bg-secondary)' }}>Fecha y Hora</th>
                  <th style={{ background: 'var(--bg-secondary)' }}>Operación</th>
                  <th style={{ background: 'var(--bg-secondary)' }}>Mensaje de Error</th>
                  <th style={{ background: 'var(--bg-secondary)', textAlign: 'right' }}>Afectado</th>
                </tr>
              </thead>
              <tbody>
                {systemErrors.map(err => {
                  const affectedUser = users.find(u => u.uid === err.uid);
                  return (
                    <tr key={err.id}>
                      <td style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                        {new Date(err.timestamp).toLocaleString()}
                      </td>
                      <td style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)' }}>
                        {err.context}
                      </td>
                      <td style={{ fontSize: 12, color: 'var(--red)', fontFamily: 'monospace' }}>
                        {err.error}
                      </td>
                      <td style={{ textAlign: 'right', fontSize: 12 }}>
                        {affectedUser ? affectedUser.displayName : <span style={{ opacity: 0.5 }}>{err.uid}</span>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}