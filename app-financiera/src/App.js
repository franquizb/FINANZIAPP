// App.js — App Financiera (localStorage, sin Firebase, sin IA)
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Login from './Login';
import LandingPage from './LandingPage';
import { AppProvider, useApp, getLocale, nombreMesCorto, tx } from './context/AppContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line,
  AreaChart, Area, ComposedChart
} from 'recharts';
import TutorialWizard from './components/TutorialWizard';
import Calculadoras from './components/Calculadoras';
import { db, auth } from './firebase';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot, collection, query, addDoc, increment, orderBy, limit } from 'firebase/firestore';
import { irAPagar, irAlPortal, resumenStripe, stripeNoConfigurado, PRECIO_MENSUAL, MONEDA_PRECIO, STRIPE_ACTIVO } from './suscripcion';

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
    if (esSeccionPatrimonio(mk)) return;
    d.categories[mk].forEach(sub => {
      const c = claveSub(mk, sub);
      d.budget[c] = (year === defaultStartYear && defaultBudget[sub] !== undefined) ? defaultBudget[sub] : 0;
      months.forEach(m => {
        if (!d.monthly[m]) d.monthly[m] = {};
        d.monthly[m][c] = { budgeted: 0, actual: [] };
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
    Object.keys(d.budget).forEach(c => {
      const v = parseFloat(base.budget?.[c]) || 0;
      d.budget[c] = v;
      months.forEach(m => { d.monthly[m][c].budgeted = v; });
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
  // Los préstamos vigentes ese año tienen que figurar en Pago de Deudas y en
  // Pasivos aunque el año base no los tuviera (p. ej. un préstamo dado de alta
  // para un año futuro cuando ese año todavía no existía). Si no, sus cuotas
  // salían en la lista de movimientos pero no en los totales.
  (fullData?.loans || []).forEach(l => {
    if (prestamoCubreAnio(l, year)) {
      asegurarSub(d, 'Pago de Deudas', l.name);
      asegurarSub(d, 'Pasivos', l.name);
    }
  });
  return d;
};

const VISTAS_POR_DEFECTO = ['dashboard', 'monthly', 'networth', 'loans', 'trading', 'analysis', 'settings', 'users'];
const SECCIONES_PRESUPUESTO = ["Ingresos", "Gastos Esenciales", "Gastos Discrecionales", "Pago de Deudas", "Ahorro e Inversión"];

// ─── DASHBOARD CONFIGURABLE ──────────────────────────────────────────────────
// Catálogo de bloques del dashboard. Cada usuario elige cuáles ve, en qué orden
// y a qué anchura; algunos tienen opciones propias (categoría elegida, objetivo).
// "vista" indica que el bloque solo tiene sentido si esa sección está visible.
// "clave" es la entrada del diccionario con el título del bloque.
const WIDGETS_DASHBOARD = [
  { id: 'kpis', clave: 'wKpis', size: 'full' },
  { id: 'salud', clave: 'wSalud', size: 'full' },
  { id: 'flujo', clave: 'wFlujo', size: 'half' },
  { id: 'distribucion', clave: 'wDistribucion', size: 'half' },
  { id: 'ahorro-acumulado', clave: 'wAhorroAcumulado', size: 'half' },
  { id: 'objetivo', clave: 'wObjetivo', size: 'half' },
  { id: 'presupuesto-ingresos', clave: 'wPresupuestoIngresos', size: 'half' },
  { id: 'presupuesto-gastos', clave: 'wPresupuestoGastos', size: 'half' },
  { id: 'top-gastos', clave: 'wTopGastos', size: 'half' },
  { id: 'categoria', clave: 'wCategoria', size: 'half' },
  { id: 'ahorro-mensual', clave: 'wAhorroMensual', size: 'full' },
  { id: 'comparativa', clave: 'wComparativa', size: 'full' },
  { id: 'patrimonio', clave: 'wPatrimonio', size: 'half', vista: 'networth' },
  { id: 'prestamos', clave: 'wPrestamos', size: 'half', vista: 'loans' },
  { id: 'trading', clave: 'wTrading', size: 'full', vista: 'trading' }
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
  dashboard: normalizarDashboard(savedConfig?.dashboard),
  // Último año cuyo presupuesto se dio por revisado en la "revisión de inicio de año".
  revisionAnio: parseInt(savedConfig?.revisionAnio) || 0
});

// ¿Toca revisar las expectativas del año? Solo al empezar un año (enero a
// marzo) o al preparar uno futuro, si existe el año anterior para comparar y
// el usuario no lo ha dado ya por revisado.
// Meses de un año con algún movimiento real registrado.
const mesesConDatosReales = (anio) => months.filter(m => Object.values(anio?.monthly?.[m] || {}).some(c => (c?.actual || []).length > 0)).length;

// Hay revisión pendiente si estamos a principios de año (o el año es futuro),
// el año anterior tiene datos reales con los que comparar y no se ha marcado
// ya como revisado.
const revisionDeAnioPendiente = (fullData, year, config) => {
  const hoy = new Date();
  const inicioDeAnio = (year === hoy.getFullYear() && hoy.getMonth() <= 2) || year > hoy.getFullYear();
  return inicioDeAnio && mesesConDatosReales(fullData?.[year - 1]) > 0 && (parseInt(config?.revisionAnio) || 0) !== year;
};

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

const fmt = (v, currency = 'EUR') => (v || 0).toLocaleString(getLocale(), { style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2 });

const EXPENSE_KEYS = ["Gastos Esenciales", "Gastos Discrecionales", "Pago de Deudas", "Ahorro e Inversión"];
const ALL_MAIN_KEYS = ["Ingresos", ...EXPENSE_KEYS];

// ─── CLAVES DE PRESUPUESTO Y SUBCATEGORÍAS ───────────────────────────────────
// El presupuesto y las transacciones de cada año se guardan por
// "Sección|Subcategoría". Antes se indexaban solo por el nombre de la
// subcategoría, así que dos subcategorías con el mismo nombre en secciones
// distintas (el "Otros" de Ingresos, Gastos Esenciales, Discrecionales, Deudas
// y Ahorro) compartían el mismo cubo: cada movimiento se contaba cinco veces y
// borrar o renombrar una arrastraba a las demás. `migrarDatos` convierte los
// datos antiguos al cargarlos.
const SEP_CLAVE = '|';
const VERSION_DATOS = 2;
const claveSub = (mk, sub) => `${mk}${SEP_CLAVE}${sub}`;
const esSeccionPatrimonio = (mk) => mk === 'Activos' || mk === 'Pasivos';
const claveNW = (mk) => mk === 'Activos' ? 'assets' : 'liabilities';
const clonar = (o) => JSON.parse(JSON.stringify(o));

// Fecha local "YYYY-MM-DD" (toISOString() da la fecha UTC, que a primera hora
// de la mañana en España todavía es el día anterior).
const fechaISO = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const hoyLocal = () => fechaISO(new Date());

// Nombre de subcategoría saneado: sin espacios sobrantes, con mayúscula inicial
// y sin el separador de clave. Devuelve null (y avisa) si no vale.
const nombreSubValido = (raw) => {
  const s = String(raw || '').trim();
  if (!s) return null;
  if (s.includes(SEP_CLAVE)) { alert(tx('nombreSinSeparador', { sep: SEP_CLAVE })); return null; }
  return s.charAt(0).toUpperCase() + s.slice(1);
};

// Añade una subcategoría a los datos de UN año: la lista de categorías y, según
// la sección, sus entradas de presupuesto y meses o su fila de patrimonio (12
// meses a 0). Idempotente.
const asegurarSub = (d, mk, sub) => {
  if (!d) return;
  if (!d.categories) d.categories = clonar(initialCategories);
  if (!d.categories[mk]) d.categories[mk] = [];
  if (!d.categories[mk].includes(sub)) {
    d.categories[mk].push(sub);
    d.categories[mk].sort();
  }
  if (esSeccionPatrimonio(mk)) {
    const k = claveNW(mk);
    if (!d.netWorth) d.netWorth = { assets: {}, liabilities: {} };
    if (!d.netWorth[k]) d.netWorth[k] = {};
    if (!d.netWorth[k][sub]) { d.netWorth[k][sub] = {}; months.forEach(m => { d.netWorth[k][sub][m] = 0; }); }
  } else {
    const c = claveSub(mk, sub);
    if (!d.budget) d.budget = {};
    if (d.budget[c] === undefined) d.budget[c] = 0;
    if (!d.monthly) d.monthly = {};
    months.forEach(m => {
      if (!d.monthly[m]) d.monthly[m] = {};
      if (!d.monthly[m][c]) d.monthly[m][c] = { budgeted: 0, actual: [] };
    });
  }
};

// Quita una subcategoría de los datos de UN año junto con sus datos. Solo los de
// esa sección: una homónima en otra sección no se toca.
const eliminarSub = (d, mk, sub) => {
  if (!d) return;
  if (d.categories?.[mk]) d.categories[mk] = d.categories[mk].filter(s => s !== sub);
  if (esSeccionPatrimonio(mk)) {
    if (d.netWorth?.[claveNW(mk)]) delete d.netWorth[claveNW(mk)][sub];
  } else {
    const c = claveSub(mk, sub);
    if (d.budget) delete d.budget[c];
    months.forEach(m => { if (d.monthly?.[m]) delete d.monthly[m][c]; });
  }
};

// Renombra una subcategoría en los datos de UN año moviendo sus datos a la clave nueva.
const renombrarSub = (d, mk, oldName, newName) => {
  if (!d) return;
  if (d.categories?.[mk]) {
    const i = d.categories[mk].indexOf(oldName);
    if (i !== -1) { d.categories[mk][i] = newName; d.categories[mk].sort(); }
  }
  if (esSeccionPatrimonio(mk)) {
    const nw = d.netWorth?.[claveNW(mk)];
    if (nw && nw[oldName] !== undefined) { nw[newName] = nw[oldName]; delete nw[oldName]; }
  } else {
    const co = claveSub(mk, oldName), cn = claveSub(mk, newName);
    if (d.budget && d.budget[co] !== undefined) { d.budget[cn] = d.budget[co]; delete d.budget[co]; }
    months.forEach(m => {
      if (d.monthly?.[m]?.[co]) { d.monthly[m][cn] = d.monthly[m][co]; delete d.monthly[m][co]; }
    });
  }
};

// Copia de los datos con `fn` aplicada a cada año >= startY (las operaciones
// sobre categorías afectan al año seleccionado y a los posteriores, nunca a los
// anteriores, que conservan su historial).
const enAniosDesde = (fullData, startY, fn) => {
  const nd = clonar(fullData);
  aniosConDatos(nd).filter(y => y >= startY).forEach(y => fn(nd[y], y));
  return nd;
};

// ¿Chocaría renombrar oldName → newName en la sección mk? Solo si en la
// configuración o en algún año >= startY conviven los dos nombres: ahí el
// renombrado fusionaría dos subcategorías y pisaría datos. Donde oldName ya no
// existe (p. ej. un año posterior ya renombrado) no pasa nada, así que se puede
// alinear el historial de un año anterior sin que el nombre nuevo lo impida.
const renombradoConflictivo = (fullData, config, mk, oldName, newName, startY) => {
  const chocan = (lista) => lista.includes(oldName) && lista.includes(newName);
  return chocan(config?.categories?.[mk] || []) ||
    aniosConDatos(fullData).filter(y => y >= startY).some(y => chocan(fullData[y]?.categories?.[mk] || []));
};

// Configuración global con la subcategoría añadida / quitada / renombrada.
const configConSub = (config, mk, sub) => {
  const nc = clonar(config);
  if (!nc.categories) nc.categories = clonar(initialCategories);
  if (!nc.categories[mk]) nc.categories[mk] = [];
  if (!nc.categories[mk].includes(sub)) { nc.categories[mk].push(sub); nc.categories[mk].sort(); }
  return nc;
};
const configSinSub = (config, mk, sub) => {
  const nc = clonar(config);
  if (nc.categories?.[mk]) nc.categories[mk] = nc.categories[mk].filter(s => s !== sub);
  return nc;
};
const configRenombrada = (config, mk, oldName, newName) => {
  const nc = clonar(config);
  if (nc.categories?.[mk]) {
    const i = nc.categories[mk].indexOf(oldName);
    if (i !== -1) nc.categories[mk][i] = newName;
    nc.categories[mk].sort();
  }
  return nc;
};

// Migración del modelo antiguo (clave = nombre) al nuevo (clave = sección|nombre).
// Cuando un nombre estaba en varias secciones no hay forma de saber a cuál
// pertenecían sus movimientos: se asignan a la primera sección de esta lista que
// lo contenga (lo más probable es que un "Otros" fuera un gasto; los ingresos van
// al final) y las demás empiezan vacías. Los datos de subcategorías que ya no
// están en ninguna sección se conservan tal cual (no se muestran, pero no se pierden).
const PREFERENCIA_MIGRACION = [...EXPENSE_KEYS, 'Ingresos'];
const migrarDatos = (fd, cfgCats) => {
  if (!fd || (parseInt(fd.version) || 1) >= VERSION_DATOS) return fd;
  const nd = clonar(fd);
  aniosConDatos(nd).forEach(y => {
    const d = nd[y];
    if (!d || typeof d !== 'object') return;
    if (!d.categories) d.categories = clonar(cfgCats || initialCategories);
    const budget = {};
    const monthly = {};
    months.forEach(m => { monthly[m] = {}; });
    const asignados = new Set();
    const secciones = [
      ...PREFERENCIA_MIGRACION,
      ...Object.keys(d.categories).filter(mk => !esSeccionPatrimonio(mk) && !PREFERENCIA_MIGRACION.includes(mk))
    ];
    secciones.forEach(mk => (d.categories[mk] || []).forEach(sub => {
      const c = claveSub(mk, sub);
      const primera = !asignados.has(sub);
      asignados.add(sub);
      budget[c] = primera ? (parseFloat(d.budget?.[sub]) || 0) : 0;
      months.forEach(m => {
        const v = primera ? d.monthly?.[m]?.[sub] : null;
        monthly[m][c] = (v && typeof v === 'object')
          ? { budgeted: parseFloat(v.budgeted) || 0, actual: Array.isArray(v.actual) ? v.actual : [] }
          : { budgeted: 0, actual: [] };
      });
    }));
    Object.keys(d.budget || {}).forEach(k => { if (!asignados.has(k) && !k.includes(SEP_CLAVE)) budget[k] = d.budget[k]; });
    months.forEach(m => Object.keys(d.monthly?.[m] || {}).forEach(k => {
      if (!asignados.has(k) && !k.includes(SEP_CLAVE)) monthly[m][k] = d.monthly[m][k];
    }));
    d.budget = budget;
    d.monthly = monthly;
  });
  nd.version = VERSION_DATOS;
  return nd;
};

// Datos financieros tal y como los usa la app: modelo actual y arrays garantizados.
const normalizarFD = (fd, cfgCats) => {
  const nd = migrarDatos(fd, cfgCats);
  if (!nd.loans) nd.loans = [];
  if (!nd.trading) nd.trading = [];
  return nd;
};

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
  const clave = [getLocale(), loan.id, loan.totalAmount, loan.installmentsCount, loan.interestRate, loan.amount, loan.startDate, JSON.stringify(loan.extraAmortizations || [])].join('|');
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
      month: d.toLocaleString(getLocale(), { month: 'long', year: 'numeric' }),
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

// Préstamos cuyo nombre es la subcategoría `sub` (puede haber más de uno) y suma
// de sus cuotas en un mes. Antes se usaba `find`, así que con dos préstamos del
// mismo nombre solo el primero contaba en presupuesto y totales.
const prestamosDe = (fullData, sub) => (fullData?.loans || []).filter(l => l.name === sub);
const cuotaPrestamos = (fullData, sub, year, mIdx) => prestamosDe(fullData, sub).reduce((s, l) => {
  const lv = getLoanValues(l, year, mIdx);
  return s + (lv.active ? lv.installment : 0);
}, 0);

// ¿Paga alguna cuota el préstamo durante `year`?
const prestamoCubreAnio = (loan, year) => {
  if (!loan || !loan.startDate) return false;
  return fechaLocal(loan.startDate).getFullYear() <= year && finRealPrestamo(loan).getFullYear() >= year;
};

const getEffectiveBudget = (sub, mainCategory, year, mIdx, fullData, manualBudget) => {
  if (mainCategory === 'Pago de Deudas') {
    const loans = prestamosDe(fullData, sub);
    if (loans.length) {
      if (mIdx === -1) {
        // Media mensual de los préstamos que cubren el año completo. Los que no
        // lo cubren no salen en la tabla recurrente (se listan en puntuales).
        let total = 0;
        loans.filter(l => isLoanFullYear(l, year)).forEach(l => {
          for (let m = 0; m < 12; m++) total += getLoanValues(l, year, m).installment;
        });
        return total / 12;
      }
      return cuotaPrestamos(fullData, sub, year, mIdx);
    }
  }
  return parseFloat(manualBudget?.[claveSub(mainCategory, sub)]) || 0;
};

// Ingresos y gastos de cada mes de un año (las cuotas de préstamos cuentan como
// gasto real). Lo usan el dashboard (también para comparar con el año anterior).
const calcularTotalesMensuales = (data, categories, fullData, year) => months.map((m, mIdx) => {
  const income = (categories["Ingresos"] || []).reduce((s, sub) => s + calcTotal(data?.monthly?.[m]?.[claveSub('Ingresos', sub)]?.actual || []), 0);
  const expenses = EXPENSE_KEYS.reduce((s, mk) => s + (categories[mk] || []).reduce((ss, sub) => {
    let val = calcTotal(data?.monthly?.[m]?.[claveSub(mk, sub)]?.actual || []);
    if (mk === 'Pago de Deudas') val += cuotaPrestamos(fullData, sub, year, mIdx);
    return ss + val;
  }, 0), 0);
  return { name: nombreMesCorto(m).toUpperCase(), income, expenses };
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
    // Residuo de coma flotante (0.1 + 0.2 - 0.3 ≠ 0): la posición está cerrada.
    // Si no se pone a cero exacto, sigue contando como abierta y un Short
    // posterior sobre el activo se trataría como cierre del Long.
    if (Math.abs(a.totalQty) < 1e-9) { a.totalQty = 0; a.totalCost = 0; }

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

// El nombre visible de cada sección es t[id] (traducido).
const PERMISSIONS = [
  { id: 'dashboard', icon: PATHS.dashboard },
  { id: 'monthly', icon: PATHS.monthly },
  { id: 'networth', icon: PATHS.networth },
  { id: 'loans', icon: PATHS.loan },
  { id: 'trading', icon: PATHS.trading },
  { id: 'analysis', icon: PATHS.analysis },
  { id: 'settings', icon: PATHS.settings },
  { id: 'users', icon: PATHS.users },
];

// Texto con tramos en negrita marcados con **...** (p. ej. "Llevas **{a}** de {b}").
// Permite traducir frases enteras sin romper el orden de las palabras.
const Negrita = ({ texto, estilo }) => String(texto || '').split('**').map((trozo, i) => i % 2 ? <b key={i} style={estilo}>{trozo}</b> : <React.Fragment key={i}>{trozo}</React.Fragment>);

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
// El cobro lo hace Stripe (functions/index.js): el webhook escribe paidUntil,
// plan y el estado de la suscripcion en users/{uid}, y las reglas de Firestore
// devuelven o quitan el acceso de escritura segun paidUntil / trialEndsAt.
// Dias de margen que la Cloud Function suma a paidUntil tras cada periodo
// pagado (debe coincidir con DIAS_GRACIA en functions/index.js).
const GRACIA_MS = 3 * 86400000;
const ESTADOS_STRIPE_VIVOS = ['active', 'trialing', 'past_due'];

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

// Estado de la suscripción tal y como se muestra al usuario.
const describirSuscripcion = (user, t, tf, locale) => {
  const estado = estadoSuscripcion(user);
  const fecha = (ms) => new Date(ms).toLocaleDateString(locale);
  if (user?.bloqueado) return { clave: 'bloqueada', texto: t.susEstadoBloqueada, color: 'var(--red)' };
  if (estado.motivo === 'admin') return { clave: 'admin', texto: t.susEstadoAdmin, color: 'var(--accent)' };
  if (estado.motivo === 'pagado') {
    if (user.stripeStatus === 'past_due') return { clave: 'impago', texto: tf('susEstadoImpago', { fecha: fecha(user.paidUntil) }), color: 'var(--yellow)' };
    if (user.cancelAtPeriodEnd) return { clave: 'cancelando', texto: tf('susEstadoCancelando', { fecha: fecha(user.paidUntil - GRACIA_MS) }), color: 'var(--yellow)' };
    if (['active', 'trialing'].includes(user.stripeStatus)) return { clave: 'activa', texto: tf('susEstadoActiva', { fecha: fecha(user.paidUntil - GRACIA_MS) }), color: 'var(--green)' };
    return { clave: 'pagada', texto: tf('susEstadoPagada', { fecha: fecha(user.paidUntil) }), color: 'var(--green)' };
  }
  if (estado.motivo === 'prueba') return { clave: 'prueba', texto: estado.diasRestantes === 1 ? t.susEstadoPruebaUno : tf('susEstadoPrueba', { n: estado.diasRestantes }), color: 'var(--blue)' };
  if (user?.stripeSubscriptionId || user?.plan === 'cancelado') return { clave: 'cancelada', texto: t.susEstadoCancelada, color: 'var(--text-muted)' };
  return { clave: 'caducada', texto: t.susEstadoCaducada, color: 'var(--red)' };
};

// Botón de activar (Stripe Checkout) o gestionar (portal de Stripe) la suscripción.
function BotonesSuscripcion({ user }) {
  const { t, tf, language } = useApp();
  const [ocupado, setOcupado] = useState(false);
  const [error, setError] = useState(null);
  if (!user || user.isAdmin || user.bloqueado) return null;
  if (!STRIPE_ACTIVO) return <div style={{ fontSize: 12, color: 'var(--text-muted)', maxWidth: 320 }}>{t.susNoDisponible}</div>;
  const tieneStripe = !!user.stripeSubscriptionId && ESTADOS_STRIPE_VIVOS.includes(user.stripeStatus);
  const ir = async (fn) => {
    setOcupado(true); setError(null);
    try { await fn(); } // redirige a Stripe; si vuelve, es por error
    catch (e) {
      console.error('Stripe:', e);
      setError(stripeNoConfigurado(e) ? t.susNoDisponible : tf('susError', { msg: e?.message || '' }));
      setOcupado(false);
    }
  };
  return (
    <div>
      {tieneStripe
        ? <button className="btn btn-ghost" disabled={ocupado} onClick={() => ir(irAlPortal)} style={{ whiteSpace: 'nowrap' }}>{ocupado ? t.susRedirigiendo : t.susGestionar}</button>
        : <button className="btn btn-primary" disabled={ocupado} onClick={() => ir(() => irAPagar(language))} style={{ whiteSpace: 'nowrap' }}>{ocupado ? t.susRedirigiendo : t.susActivar}</button>}
      {error && <div style={{ color: 'var(--red)', fontSize: 12, marginTop: 6, maxWidth: 320 }}>{error}</div>}
    </div>
  );
}

// Aviso de prueba a punto de acabar o ya caducada. No bloquea la interfaz: el
// usuario conserva la lectura de sus datos (derecho de acceso del RGPD) y lo
// que pierde es la escritura, que ya deniegan las reglas.
function AvisoSuscripcion({ user }) {
  const { t, tf } = useApp();
  const estado = estadoSuscripcion(user);
  // Hasta que el perfil se haya leído del servidor no se sabe el estado real:
  // mostrar el aviso antes producía un destello de "prueba terminada" al entrar.
  if (user && !user.perfilListo) return null;
  if (estado.motivo === 'admin' || estado.motivo === 'pagado' || estado.motivo === 'sin-sesion') return null;
  if (estado.activa && estado.diasRestantes > 5) return null;

  const caducada = !estado.activa;
  const precio = t.precioMes;
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
            ? t.subTrialEnded
            : (estado.diasRestantes === 1 ? t.subDaysLeftOne : tf('subDaysLeft', { n: estado.diasRestantes }))}
        </div>
        <div style={{ fontSize: 12, opacity: .8, marginTop: 2 }}>
          {caducada ? tf('subExpiredBody', { precio }) : tf('subTrialBody', { precio })}
        </div>
      </div>
      <BotonesSuscripcion user={user} />
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
  const { theme, t, tf } = useApp();
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
  const initialView = VISTAS_POR_DEFECTO.includes(pathView) ? pathView : 'dashboard';
  const [activeView, _setActiveView] = useState(initialView);

  // Memoizada: el tutorial la tiene como dependencia de un efecto que reinicia
  // la acción pedida al usuario; recreada en cada render, cualquier snapshot de
  // Firestore deshacía el progreso del paso.
  const setActiveView = useCallback((v) => {
    _setActiveView(v);
    navigate(`/${v}`);
  }, [navigate]);

  // Sincroniza la vista con la URL solo cuando cambia la URL (atrás/adelante
  // del navegador, enlaces directos). React Router 7 aplica la navegación como
  // transición, así que durante unos ms la vista ya es la nueva y la URL aún la
  // vieja: si este efecto también dependiera de activeView, devolvería la vista
  // a la URL antigua y, con el tutorial pidiendo la nueva, entraba en bucle.
  const vistaActualRef = useRef(activeView);
  vistaActualRef.current = activeView;
  useEffect(() => {
    const pv = location.pathname.substring(1);
    if (pv && VISTAS_POR_DEFECTO.includes(pv) && pv !== vistaActualRef.current) {
      _setActiveView(pv);
    }
  }, [location.pathname]);

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
  // El tutorial se decide con la PRIMERA configuración recibida. Si se evaluara
  // en cada snapshot, a quien Firestore le rechaza guardar tutorialCompleted
  // (prueba caducada, cuenta bloqueada) se le reabría en bucle y le tapaba la app.
  const tutorialEvaluado = useRef(false);
  // La migración del modelo de datos se escribe una sola vez por sesión.
  const migracionEscrita = useRef(false);
  // Última configuración conocida (el snapshot de datos puede llegar antes que el estado).
  const configActual = useRef(null);
  useEffect(() => {
    if (!config || anioInicialAplicado.current) return;
    anioInicialAplicado.current = true;
    const y = parseInt(config.anioInicial);
    if (y && y > 1900) setSelectedYear(y);
  }, [config]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  // Pestaña de Seguimiento Mensual: 'seguimiento' (lo real, mes a mes) o
  // 'presupuesto' (el plan del año). El Dashboard solo muestra gráficos.
  const [monthlyMode, setMonthlyMode] = useState('seguimiento');
  // Para el tutorial: al llevar al usuario a Seguimiento Mensual se abre la
  // pestaña Seguimiento. Memorizada: es dependencia de un efecto del tutorial.
  const setActiveViewTutorial = useCallback((v) => {
    if (v === 'monthly') setMonthlyMode('seguimiento');
    setActiveView(v);
  }, [setActiveView]);
  const [budgetLocked, setBudgetLocked] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);

  const handleLogin = (u) => {
    // Solo fija el usuario y navega. La carga de datos (y el estado "Cargando...")
    // la gestiona el efecto que depende de userId: cuando onAuthStateChanged ya ha
    // restaurado la sesión de este mismo uid, volver a poner loading=true aquí
    // dejaba la pantalla en "Cargando..." para siempre, porque el efecto no se
    // reinicia si el uid no cambia.
    setUser(u);
    setError(null); setBudgetLocked(true);
    navigate('/dashboard');
  };

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Restaurar sesión desde Firebase. El rol de administrador sale SOLO del
        // documento de Firestore, que el cliente no puede modificar.
        let userData = {};
        let perfilLeido = false;
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          userData = userDoc.exists() ? userDoc.data() : {};
          perfilLeido = userDoc.exists();
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
          bloqueado: userData.bloqueado === true,
          stripeStatus: userData.stripeStatus || null,
          stripeSubscriptionId: userData.stripeSubscriptionId || null,
          cancelAtPeriodEnd: userData.cancelAtPeriodEnd === true,
          // El perfil se ha leído del servidor: los avisos de suscripción ya pueden mostrarse.
          perfilListo: perfilLeido
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

    // Estado propio de cada usuario. Si en la misma pestaña entra otra persona,
    // no debe heredar el año que miraba la anterior (se le crearía un año de
    // datos que no pidió) ni saltarse su "año por defecto".
    anioInicialAplicado.current = false;
    aniosIntentados.current = new Set();
    tutorialEvaluado.current = false;
    migracionEscrita.current = false;
    configActual.current = null;
    setSelectedYear(defaultStartYear);
    setSelectedMonth(months[new Date().getMonth()]);

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
      configActual.current = currentConfig;
      setConfig(currentConfig);
      if (!tutorialEvaluado.current) {
        tutorialEvaluado.current = true;
        if (!currentConfig.tutorialCompleted) setShowTutorial(true);
      }
    }, (err) => {
      console.error("Error syncing config:", err);
    });

    // Listen for real-time updates for Financial Data
    const unsubData = onSnapshot(dataRef, async (snap) => {
      if (snap.exists()) {
        const bruto = snap.data();
        const necesitaMigrar = (parseInt(bruto.version) || 1) < VERSION_DATOS;
        // La migración usa las categorías de la configuración para los años que
        // no tengan las suyas. Los dos snapshots llegan en cualquier orden: si
        // el de datos va primero, se lee la configuración antes de convertir.
        if (necesitaMigrar && !configActual.current) {
          try {
            const cs = await getDoc(configRef);
            if (!configActual.current) configActual.current = normalizarConfig(cs.exists() ? cs.data() : null);
          } catch (e) {
            console.error('No se pudo leer la configuración antes de migrar:', e);
          }
        }
        const fd = normalizarFD(bruto, configActual.current?.categories);
        setFinancialData(fd);
        // Datos en el formato antiguo: se guardan ya convertidos (una vez por
        // sesión; si la escritura falla, la app sigue funcionando con la copia
        // convertida en memoria y lo reintentará al abrir de nuevo).
        if (necesitaMigrar && !migracionEscrita.current) {
          migracionEscrita.current = true;
          setDoc(dataRef, fd).catch(e => {
            console.error('No se pudo guardar la migración del modelo de datos:', e);
            logErrorToFirebase('Migrar modelo de datos', e);
          });
        }
      } else {
        const initialData = {
          version: VERSION_DATOS,
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
      // tx (y no tf) para no añadir el idioma como dependencia del efecto de carga.
      setError(tx('errSync', { msg: err.message }));
      setLoading(false);
    });

    // Perfil en tiempo real: cuando Stripe (webhook) o el administrador cambian
    // la suscripción, el bloqueo o el rol, la app lo refleja sin recargar.
    const unsubPerfil = onSnapshot(doc(db, 'users', userId), (snap) => {
      if (!snap.exists()) return;
      const d = snap.data();
      // Justo después de iniciar sesión, Firestore puede emitir primero la copia
      // LOCAL del perfil con solo los campos que acaba de escribir el login
      // (uid, email, nombre, lastLogin). Si en ese instante se tomara isAdmin o
      // trialEndsAt como ausentes, durante una fracción de segundo el usuario
      // parecía sin rol y con la prueba caducada (el aviso rojo "fugaz"). Por
      // eso solo se sobrescribe cada campo cuando viene en el documento.
      const tiene = (k) => d[k] !== undefined;
      setUser(prev => {
        if (!prev || prev.uid !== userId) return prev;
        const isAdmin = tiene('isAdmin') ? d.isAdmin === true : !!prev.isAdmin;
        const nu = {
          ...prev,
          displayName: d.displayName || prev.displayName,
          avatar: d.avatar || prev.avatar,
          isAdmin,
          permissions: isAdmin ? PERMISSIONS.map(p => p.id) : (d.permissions || prev.permissions),
          trialEndsAt: tiene('trialEndsAt') ? (d.trialEndsAt || 0) : (prev.trialEndsAt || 0),
          paidUntil: tiene('paidUntil') ? (d.paidUntil || 0) : (prev.paidUntil || 0),
          plan: d.plan || prev.plan || 'trial',
          bloqueado: tiene('bloqueado') ? d.bloqueado === true : !!prev.bloqueado,
          stripeStatus: tiene('stripeStatus') ? (d.stripeStatus || null) : (prev.stripeStatus || null),
          stripeSubscriptionId: tiene('stripeSubscriptionId') ? (d.stripeSubscriptionId || null) : (prev.stripeSubscriptionId || null),
          cancelAtPeriodEnd: tiene('cancelAtPeriodEnd') ? d.cancelAtPeriodEnd === true : !!prev.cancelAtPeriodEnd,
          perfilListo: prev.perfilListo || (!snap.metadata.hasPendingWrites && !snap.metadata.fromCache)
        };
        localStorage.setItem('currentUser', JSON.stringify(nu));
        return nu;
      });
    }, (err) => console.error('Error syncing profile:', err));

    // Registro de actividad: un documento por usuario y día, con latido cada 5 minutos.
    const INTERVALO_LATIDO = 5 * 60 * 1000;
    let lastTick = Date.now();
    const logSession = async () => {
      if (!userId) return;
      try {
        const now = Date.now();
        // Acotado al intervalo: con el portátil suspendido o la pestaña en
        // segundo plano, el reloj sigue corriendo y un solo latido sumaba horas.
        const diff = Math.min(now - lastTick, INTERVALO_LATIDO + 30000);
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
    const interval = setInterval(logSession, INTERVALO_LATIDO);

    return () => {
      unsubConfig();
      unsubData();
      unsubPerfil();
      clearInterval(interval);
    };
  }, [userId]);

  // Mensaje legible cuando Firestore rechaza una escritura.
  const explicarErrorGuardado = (e) => {
    const code = String(e?.code || '');
    if (code.includes('permission-denied')) {
      if (user?.bloqueado) return t.errBloqueado;
      const estado = estadoSuscripcion(user);
      if (!estado.activa) return t.errPruebaTerminada;
      return t.errPermisos;
    }
    if (code.includes('unavailable') || (typeof navigator !== 'undefined' && navigator.onLine === false)) {
      return t.errSinConexion;
    }
    return tf('errGuardar', { msg: e?.message || t.errDesconocido });
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
      if (cs.exists()) {
        const nc = normalizarConfig(cs.data());
        configActual.current = nc;
        setConfig(nc);
      }
      if (ds.exists()) setFinancialData(normalizarFD(ds.data(), configActual.current?.categories));
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
    configActual.current = nc;
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
    configActual.current = null;
    setUser(null); setConfig(null); setFinancialData(null); setErrorGuardado(null); setShowTutorial(false);
    navigate('/');
  };

  const commonProps = { data: financialData?.[selectedYear], year: selectedYear, categories: financialData?.[selectedYear]?.categories || config?.categories, onUpdate: updateFD, fullData: financialData, onUpdateCfg: updateCfg, config, budgetData: financialData?.[selectedYear]?.budget };

  const renderView = () => {
    if (loading) return <div className="loading-state"><div className="spinner" /><span>{t.loading}</span></div>;
    if (error) return <div className="loading-state" style={{ color: 'var(--red)' }}>{error}</div>;
    if (!financialData || !config) return <div className="loading-state"><div className="spinner" /></div>;

    // Check user visibility preference (Settings is always allowed if permission exists)
    const isVisible = config?.visibleViews?.includes(activeView) || activeView === 'settings';
    if (!isVisible && activeView !== 'users') return <AccessDenied />;

    switch (activeView) {
      case 'dashboard':
        if (!hasPermission(user, 'dashboard')) return <AccessDenied />;
        return <DashboardView {...commonProps} mode="charts" setMode={() => {}} budgetLocked={budgetLocked} setBudgetLocked={setBudgetLocked} visibleBudgetSections={config.visibleBudgetSections} visibleViews={config.visibleViews} />;
      case 'monthly':
        if (!hasPermission(user, 'monthly')) return <AccessDenied />;
        // El presupuesto del año vive dentro de Seguimiento Mensual (pestaña "Presupuesto").
        if (monthlyMode === 'presupuesto') {
          return <DashboardView {...commonProps} mode="budget" setMode={() => {}} budgetLocked={budgetLocked} setBudgetLocked={setBudgetLocked} visibleBudgetSections={config.visibleBudgetSections} visibleViews={config.visibleViews} />;
        }
        return <MonthlyView {...commonProps} month={selectedMonth} currentMonthData={financialData[selectedYear]?.monthly?.[selectedMonth]} onIrAPresupuesto={() => setMonthlyMode('presupuesto')} />;
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
        return <Calculadoras />;
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
      <div style={{ fontWeight: 800, fontSize: 18 }}>{t.accesoRestringido}</div>
      <div style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 8, maxWidth: 300 }}>
        {t.elUsuario} <b>{user.displayName}</b> {t.sinPermisoPara} <b>{t[activeView] || activeView}</b>.
      </div>
      <button className="btn btn-primary" style={{ marginTop: 24 }} onClick={() => {
        const primera = PERMISSIONS.find(p => hasPermission(user, p.id) && (config?.visibleViews?.includes(p.id) || p.id === 'settings'));
        setActiveView(primera ? primera.id : 'settings');
      }}>
        {t.volverInicio}
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
          monthlyMode={monthlyMode}
          setMonthlyMode={setMonthlyMode}
        />
        <AvisoSuscripcion user={user} />
        {errorGuardado && (
          <div role="alert" style={{
            margin: '12px 16px 0', padding: '12px 16px', borderRadius: 10,
            display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
            background: 'rgba(220,38,38,.10)', border: '1px solid rgba(220,38,38,.45)'
          }}>
            <span style={{ fontSize: 20, lineHeight: 1 }}>⚠️</span>
            <div style={{ flex: 1, minWidth: 220, fontSize: 13 }}><b>{t.noGuardado}</b> {errorGuardado}</div>
            <button className="btn btn-ghost" onClick={() => setErrorGuardado(null)}>{t.cerrar}</button>
          </div>
        )}
        <div className="page-content fade-in">{renderView()}</div>
      </div>
      {showTutorial && (
        <TutorialWizard
          activeView={activeView}
          monthlyMode={monthlyMode}
          setActiveView={setActiveViewTutorial}
          onClose={() => { setMonthlyMode('seguimiento'); setShowTutorial(false); }}
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
          <button key={item.id} className={`nav-item ${activeView === item.id ? 'active' : ''}`} onClick={() => setActiveView(item.id)} title={collapsed ? t[item.id] : ''}>
            <Ic d={item.icon} size={18} />
            {!collapsed && <span className="nav-label">{t[item.id]}</span>}
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
                {user?.isAdmin ? t.rolAdmin : t.rolUsuario}
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
function Topbar({ activeView, setActiveView, user, sidebarCollapsed, toggleSidebar, selectedYear, setSelectedYear, selectedMonth, setSelectedMonth, financialData, monthlyMode, setMonthlyMode }) {
  const { t, mes } = useApp();
  return (
    <div className="topbar">
      <div className="topbar-left">
        <button className="toggle-btn" onClick={toggleSidebar} title={sidebarCollapsed ? t.expandMenu : t.collapseMenu}>
          <Ic d={sidebarCollapsed ? PATHS.menu : "M18 6L6 18M6 6l12 12"} size={16} />
        </button>
        <span className="topbar-title">{t[activeView] || activeView}</span>
      </div>
      <div className="topbar-right" style={{ gap: 16 }}>
        {activeView === 'monthly' && (
          <div className="settings-toggle">
            <button className={`settings-toggle-btn ${monthlyMode === 'seguimiento' ? 'active' : ''}`} onClick={() => setMonthlyMode('seguimiento')}>{t.modoSeguimiento}</button>
            <button className={`settings-toggle-btn ${monthlyMode === 'presupuesto' ? 'active' : ''}`} onClick={() => setMonthlyMode('presupuesto')}>{t.budgetMode}</button>
          </div>
        )}
        <select className="select-input" style={{ width: 'auto' }} value={selectedYear} onChange={e => setSelectedYear(parseInt(e.target.value))}>
          {(() => {
            const dataYears = Object.keys(financialData || {}).filter(y => !isNaN(parseInt(y))).map(y => parseInt(y));
            if (!dataYears.length) dataYears.push(new Date().getFullYear());
            let minYear = Math.min(...dataYears);
            let maxYear = Math.max(...dataYears, new Date().getFullYear() + 4);
            // Fechas en hora local y fin real del préstamo (con amortizaciones
            // anticipadas): new Date('2026-01-01') en UTC caía en 2025 y añadía
            // al selector un año extra que, al elegirlo, se creaba y guardaba.
            (financialData?.loans || []).forEach(l => {
              if (l.startDate) {
                const sy = fechaLocal(l.startDate).getFullYear();
                if (sy < minYear) minYear = sy;
                const ey = finRealPrestamo(l).getFullYear();
                if (ey > maxYear) maxYear = ey;
              }
            });
            const valid = [];
            for (let i = minYear; i <= maxYear; i++) {
              const hasData = financialData?.[i] && (Object.keys(financialData[i]?.oneTime || {}).some(k => financialData[i].oneTime[k].length > 0) || Object.keys(financialData[i]?.monthly?.enero || {}).some(k => financialData[i].monthly.enero[k]?.actual?.length > 0));
              if (i <= new Date().getFullYear() + 4 || hasData || (financialData?.loans || []).some(l => prestamoCubreAnio(l, i))) {
                valid.push(i);
              }
            }
            return valid.map(y => <option key={y} value={y}>{y}</option>);
          })()}
        </select>
        {activeView === 'monthly' && monthlyMode !== 'presupuesto' && (
          <select className="select-input" style={{ width: 'auto', textTransform: 'capitalize' }} value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
            {months.map(m => <option key={m} value={m} style={{ textTransform: 'capitalize' }}>{mes(m)}</option>)}
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
            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, marginTop: 2 }}>{user?.isAdmin ? t.rolAdmin : t.rolUsuario}</div>
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
  useEffect(() => { setVal(sub); }, [sub]);

  if (editing && !disabled) {
    return <input autoFocus value={val} onChange={e => setVal(e.target.value)} onBlur={() => {
      setEditing(false);
      const newName = val.trim();
      if (newName && newName !== sub) onRename(newName);
      // Si el cambio se rechaza (nombre repetido), la próxima edición parte del nombre actual.
      setVal(sub);
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
  const { t, tf, theme, locale, mes, mesCorto } = useApp();
  const [addingTo, setAddingTo] = useState(null);
  const [newSub, setNewSub] = useState('');
  const [editandoDashboard, setEditandoDashboard] = useState(false);

  if (!data) return <div className="loading-state">{t.noData} {year}</div>;

  const isDark = theme === 'dark';
  const tooltipStyle = { backgroundColor: isDark ? '#1e2130' : '#fff', border: `1px solid ${isDark ? '#2d3148' : '#e2e5f0'}`, borderRadius: 8, fontSize: 12 };
  const axisColor = isDark ? '#565d80' : '#9098b8';
  const gridColor = isDark ? '#2d3148' : '#e2e5f0';

  const expenseKeys = EXPENSE_KEYS;

  // Mismo cálculo que la comparativa con el año anterior (cuotas de préstamos incluidas).
  const monthlyTotals = calcularTotalesMensuales(data, categories, fullData, year);

  const totalIncome = monthlyTotals.reduce((s, i) => s + i.income, 0);
  const totalExpenses = monthlyTotals.reduce((s, i) => s + i.expenses, 0);
  const totalSavings = totalIncome - totalExpenses;
  const mesesConIngresoAnio = monthlyTotals.filter(m => m.income > 0).length;

  const expenseDist = [];
  expenseKeys.forEach(mk => (categories[mk] || []).forEach(sub => {
    let v = months.reduce((s, m, mIdx) => {
      let val = calcTotal(data.monthly?.[m]?.[claveSub(mk, sub)]?.actual || []);
      if (mk === 'Pago de Deudas') val += cuotaPrestamos(fullData, sub, year, mIdx);
      return s + val;
    }, 0);
    if (v > 0) expenseDist.push({ name: sub, value: v });
  }));

  // Budget calculations
  const monthsPassed = year === new Date().getFullYear() ? new Date().getMonth() + 1 : 12;
  const idxTodos = months.map((_, i) => i);
  const idxHasta = idxTodos.slice(0, monthsPassed);

  const getSubsWithOneTime = (mk) => Array.from(new Set([
    ...(categories[mk] || []),
    ...months.flatMap(m => (data.oneTime?.[m] || []).filter(ot => ot.cat === mk).map(ot => ot.sub))
  ]));

  // Importes puntuales de una subcategoría en los meses indicados.
  const puntuales = (mk, sub, idxMeses) => idxMeses.reduce((acc, i) => acc + (data.oneTime?.[months[i]] || []).filter(ot => ot.cat === mk && ot.sub === sub).reduce((ss, ot) => ss + ot.amount, 0), 0);
  // Cuotas de los préstamos que NO cubren el año completo. En la tabla recurrente
  // salen a 0 y se listan como puntuales, así que entran en el presupuesto igual
  // que los gastos puntuales: antes contaban en el "real" pero no en el plan ni
  // en el remanente.
  const cuotasParciales = (mk, sub, idxMeses) => mk !== 'Pago de Deudas' ? 0 :
    prestamosDe(fullData, sub).filter(l => !isLoanFullYear(l, year)).reduce((s, l) => s + idxMeses.reduce((ss, i) => {
      const lv = getLoanValues(l, year, i);
      return ss + (lv.active ? lv.installment : 0);
    }, 0), 0);
  const realDe = (mk, sub, idxMeses) => idxMeses.reduce((s, i) => {
    let val = calcTotal(data.monthly?.[months[i]]?.[claveSub(mk, sub)]?.actual || []);
    if (mk === 'Pago de Deudas') val += cuotaPrestamos(fullData, sub, year, i);
    return s + val;
  }, 0);

  const incomeVsActual = getSubsWithOneTime("Ingresos").map(c => {
    const budgetedTotal = getEffectiveBudget(c, "Ingresos", year, -1, fullData, data.budget) * monthsPassed + puntuales("Ingresos", c, idxHasta);
    return { name: c, budgeted: budgetedTotal, actual: realDe("Ingresos", c, idxHasta) };
  }).filter(i => i.budgeted > 0 || i.actual > 0);

  const expenseVsActual = expenseKeys.map(mk => {
    const subs = getSubsWithOneTime(mk);
    const budgetedTotal = subs.reduce((s, sub) => s + getEffectiveBudget(sub, mk, year, -1, fullData, data.budget) * monthsPassed + puntuales(mk, sub, idxHasta) + cuotasParciales(mk, sub, idxHasta), 0);
    const actual = subs.reduce((s, sub) => s + realDe(mk, sub, idxHasta), 0);
    return { name: mk.replace('Gastos ', '').replace('Ahorro e Inversión', 'Ahorro'), budgeted: budgetedTotal, actual };
  }).filter(i => i.budgeted > 0 || i.actual > 0);

  const totalIncomeBudgeted = getSubsWithOneTime("Ingresos").reduce((s, sub) =>
    s + getEffectiveBudget(sub, "Ingresos", year, -1, fullData, data.budget) + puntuales("Ingresos", sub, idxTodos) / 12, 0);

  const totalExpensesBudgeted = expenseKeys.reduce((s, mk) => s + getSubsWithOneTime(mk).reduce((ss, sub) =>
    ss + getEffectiveBudget(sub, mk, year, -1, fullData, data.budget) + (puntuales(mk, sub, idxTodos) + cuotasParciales(mk, sub, idxTodos)) / 12, 0), 0);
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
                const isLoan = mk === 'Pago de Deudas' && prestamosDe(fullData, sub).length > 0;
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
                              // Solo el año seleccionado y los posteriores: los años anteriores conservan su historial.
                              onUpdateCfg(configSinSub(config, mk, sub));
                              onUpdate(enAniosDesde(fullData, year, d => eliminarSub(d, mk, sub)));
                            }} />
                          )}
                          <RenameSpan
                            sub={sub}
                            disabled={budgetLocked}
                            onRename={raw => {
                              const newName = nombreSubValido(raw);
                              if (!newName || newName === sub) return;
                              // Renombrar a un nombre que ya existe junto al actual pisaría sus datos y dejaría dos filas iguales.
                              if (renombradoConflictivo(fullData, config, mk, sub, newName, year)) { alert(tf('yaExisteEn', { nombre: newName, seccion: t[mk] || mk })); return; }
                              onUpdateCfg(configRenombrada(config, mk, sub, newName));
                              onUpdate(enAniosDesde(fullData, year, d => renombrarSub(d, mk, sub, newName)));
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
                          value={data.budget?.[claveSub(mk, sub)] || 0}
                          disabled={budgetLocked}
                          onSave={v => {
                            // El importe del presupuesto es propio de cada año: no se copia a los años siguientes
                            // (al crear un año nuevo ya se hereda el presupuesto del anterior).
                            const nd = clonar(fullData);
                            const d = nd[String(year)];
                            if (!d) return;
                            const c = claveSub(mk, sub);
                            asegurarSub(d, mk, sub);
                            d.budget[c] = v;
                            months.forEach(mo => { d.monthly[mo][c].budgeted = v; });
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
                        placeholder={t.addSubPlaceholder}
                        className="text-input"
                        style={{ flex: 1, padding: '4px 8px', fontSize: 13, border: '1px solid var(--accent)' }}
                        value={newSub}
                        onChange={e => setNewSub(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' && newSub.trim()) {
                            const sub = nombreSubValido(newSub);
                            if (!sub) return;
                            if ((categories[mk] || []).includes(sub)) { alert(t.yaExisteAnio); return; }
                            onUpdateCfg(configConSub(config, mk, sub));
                            // Solo el año seleccionado y los posteriores.
                            onUpdate(enAniosDesde(fullData, year, d => asegurarSub(d, mk, sub)));
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
            <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{t.total}</span>
            <span className="text-right" style={{ fontWeight: 800, color: getCategoryColor(mk) }}>{fmt(total)}</span>
          </div>
          {mk !== 'Ingresos' && totalIncomeBudgeted > 0 && (
            <div style={{ padding: '8px 12px', borderTop: '1px solid var(--border)', fontSize: 11, fontWeight: 700, textAlign: 'center', background: 'rgba(255,255,255,0.02)' }}>
              <span style={{ color: getCategoryColor(mk) }}>{((total / totalIncomeBudgeted) * 100).toFixed(1)}%</span> {t.delPresupuesto}
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
        alert(t.puntualAviso);
        return;
      }

      const nd = JSON.parse(JSON.stringify(fullData));
      // Un mismo `grupo` para todos los meses del alta: así la fila agrupada se
      // borra entera (antes cada mes tenía su id y la papelera solo quitaba el primero).
      const grupo = crypto.randomUUID();
      activeMonths.forEach(m => {
        if (!nd[year].oneTime) nd[year].oneTime = {};
        if (!nd[year].oneTime[m]) nd[year].oneTime[m] = [];
        nd[year].oneTime[m].push({ id: crypto.randomUUID(), grupo, cat, sub: sub.trim(), amount });
      });
      onUpdate(nd);
      e.target.reset();
    };

    // Los puntuales antiguos no tienen `grupo`: se agrupan (y se borran) por categoría, nombre e importe.
    const claveGrupoPuntual = (x) => x.grupo || `${x.cat}-${x.sub}-${x.amount}`;
    const handleDeleteOneTimeGroup = (x) => {
      const nd = JSON.parse(JSON.stringify(fullData));
      months.forEach(m => {
        if (nd[year].oneTime?.[m]) nd[year].oneTime[m] = nd[year].oneTime[m].filter(ot => claveGrupoPuntual(ot) !== claveGrupoPuntual(x));
      });
      onUpdate(nd);
    };

    // ─── Revisión de inicio de año: presupuesto frente a la media real del año anterior ──
    const anterior = fullData[year - 1];
    const revision = (() => {
      if (!revisionDeAnioPendiente(fullData, year, config)) return null;
      const mesesConDatos = mesesConDatosReales(anterior);
      const divisor = Math.max(1, mesesConDatos);
      const filas = [];
      (visibleBudgetSections || ALL_MAIN_KEYS).forEach(mk => {
        (categories[mk] || []).forEach(sub => {
          if (mk === 'Pago de Deudas' && prestamosDe(fullData, sub).length) return; // las cuotas salen del préstamo
          const clave = claveSub(mk, sub);
          const total = months.reduce((s, m) => s + calcTotal(anterior.monthly?.[m]?.[clave]?.actual || []), 0);
          const media = Math.round((total / divisor) * 100) / 100;
          const presupuesto = parseFloat(data.budget?.[clave]) || 0;
          if (media > 0 || presupuesto > 0) filas.push({ mk, sub, clave, presupuesto, media });
        });
      });
      return { filas, meses: mesesConDatos };
    })();
    const fijarPresupuesto = (nd, clave, v) => {
      if (!nd[year].budget) nd[year].budget = {};
      nd[year].budget[clave] = v;
      if (!nd[year].monthly) nd[year].monthly = {};
      months.forEach(m => {
        if (!nd[year].monthly[m]) nd[year].monthly[m] = {};
        if (!nd[year].monthly[m][clave]) nd[year].monthly[m][clave] = { budgeted: 0, actual: [] };
        nd[year].monthly[m][clave].budgeted = v;
      });
    };
    const marcarRevisado = () => onUpdateCfg({ ...config, revisionAnio: year });
    const aplicarMedia = (f) => { const nd = clonar(fullData); fijarPresupuesto(nd, f.clave, f.media); onUpdate(nd); };
    const aplicarMediasReales = () => {
      if (!revision || !window.confirm(tf('revConfirmar', { year, anterior: year - 1 }))) return;
      const nd = clonar(fullData);
      revision.filas.filter(f => f.media > 0).forEach(f => fijarPresupuesto(nd, f.clave, f.media));
      onUpdate(nd);
      marcarRevisado();
    };

    return (
      <div className="section-gap" style={{ marginTop: 20 }}>
        {revision && (
          <div className="card" style={{ marginBottom: 8, border: '1px solid var(--accent)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div className="chart-card-title" style={{ marginBottom: 4 }}>🎯 {tf('revTitulo', { year })}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{tf('revDesc', { year, anterior: year - 1, meses: revision.meses })}</div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button className="btn btn-primary" disabled={!revision.filas.some(f => f.media > 0)} onClick={aplicarMediasReales}>{t.revAplicarTodo}</button>
                <button className="btn btn-ghost" onClick={marcarRevisado}>{t.revRevisado}</button>
              </div>
            </div>
            <div className="table-wrap" style={{ marginTop: 12, maxHeight: 320, overflowY: 'auto' }}>
              <table style={{ margin: 0, fontSize: 12 }}>
                <thead><tr><th>{t.category}</th><th className="text-right">{tf('revPresupuesto', { year })}</th><th className="text-right">{tf('revMediaReal', { anterior: year - 1 })}</th><th className="text-right">{t.difference}</th><th></th></tr></thead>
                <tbody>
                  {revision.filas.map(f => {
                    const diff = f.media - f.presupuesto;
                    const peor = f.mk === 'Ingresos' ? diff < 0 : diff > 0;
                    return (
                      <tr key={f.clave}>
                        <td>{f.sub} <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>· {t[f.mk] || f.mk}</span></td>
                        <td className="text-right">{fmt(f.presupuesto)}</td>
                        <td className="text-right" style={{ fontWeight: 600 }}>{fmt(f.media)}</td>
                        <td className="text-right" style={{ color: Math.abs(diff) < 0.005 ? 'var(--text-muted)' : (peor ? 'var(--red)' : 'var(--green)') }}>{diff > 0 ? '+' : ''}{fmt(diff)}</td>
                        <td className="text-right"><button className="btn btn-ghost" style={{ padding: '2px 8px', fontSize: 11 }} disabled={Math.abs(diff) < 0.005 || f.media <= 0} onClick={() => aplicarMedia(f)}>{t.revUsar}</button></td>
                      </tr>
                    );
                  })}
                  {revision.filas.length === 0 && <tr><td colSpan={5} style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 12 }}>{tf('revSinDatos', { anterior: year - 1 })}</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 24, marginBottom: 32 }}>
          <div>
            <h2 style={{ fontSize: 32, fontWeight: 900, margin: 0, letterSpacing: '-0.04em' }}>{t.presupuestoAnual}</h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '4px 0 0' }}>{tf('planificaFinanzas', { year })}</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className={`remanente-card ${remanente > 0 ? 'positive' : remanente < 0 ? 'negative' : 'zero'}`}>
              <div style={{ fontSize: 10, fontWeight: 800, opacity: 0.8, marginBottom: 4 }}>{t.remanenteMensual}</div>
              <div style={{ fontSize: 24, fontWeight: 900 }}>{fmt(remanente)}</div>
            </div>
            <button className={`btn ${budgetLocked ? 'btn-ghost' : 'btn-primary'}`} style={{ height: 60, padding: '0 24px', borderRadius: 16 }} onClick={() => setBudgetLocked(!budgetLocked)}>
              <Ic d={budgetLocked ? PATHS.lock : PATHS.unlock} size={18} style={{ marginRight: 8 }} />
              {budgetLocked ? t.desbloquearEdicion : t.bloquearEdicion}
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
                  {categoriesList.map(c => <option key={c} value={c}>{t[c] || c}</option>)}
                </select>
                <input name="sub" type="text" className="text-input" placeholder={t.puntualNombrePlaceholder} required />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{t.seleccionarMeses}</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                  {months.map(m => (
                    <label key={m} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, cursor: 'pointer' }}>
                      <input type="checkbox" name={`month_${m}`} /> {mesCorto(m)}
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
                        const key = claveGrupoPuntual(x);
                        if (!manualMap.has(key)) manualMap.set(key, { ...x, key, months: [m] });
                        else manualMap.get(key).months.push(m);
                      });
                    });

                    // Una fila por préstamo. La cuota varía en los últimos decimales
                    // entre meses (y la última puede ser menor): agrupar por importe
                    // partía el préstamo en varias filas con la misma key.
                    const loanMap = new Map();
                    fullData.loans?.filter(l => !isLoanFullYear(l, year)).forEach(loan => {
                      months.forEach((m, mIdx) => {
                        const lv = getLoanValues(loan, year, mIdx);
                        if (lv.active) {
                          if (!loanMap.has(loan.id)) loanMap.set(loan.id, { id: loan.id, name: loan.name, amount: lv.installment, total: 0, months: [] });
                          const fila = loanMap.get(loan.id);
                          fila.months.push(m);
                          fila.total += lv.installment;
                        }
                      });
                    });

                    const rows = [];
                    manualMap.forEach(x => {
                      rows.push(
                        <tr key={x.key}>
                          <td style={{ fontSize: 10, color: 'var(--accent)', fontWeight: 600 }}>
                            {x.months.map(m => mesCorto(m)).join(', ')}
                          </td>
                          <td style={{ fontSize: 11 }}>{x.sub}</td>
                          <td className="text-right" style={{ fontWeight: 600 }}>{fmt(x.amount)}</td>
                          <td className="text-right">
                            <button className="btn btn-icon btn-danger" style={{ width: 22, height: 22 }} title={t.eliminarTodosMeses} onClick={() => handleDeleteOneTimeGroup(x)}>
                              <Ic d={PATHS.trash} size={11} />
                            </button>
                          </td>
                        </tr>
                      );
                    });

                    loanMap.forEach(x => {
                      rows.push(
                        <tr key={`auto-${x.id}`} className="loan-row-puntual" title={tf('totalEnAnio', { year, importe: fmt(x.total) })}>
                          <td style={{ fontSize: 10, color: 'var(--blue)', fontWeight: 600 }}>
                            {x.months.map(m => mesCorto(m)).join(', ')}
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
    // Un Pasivo que coincide con un préstamo vale lo que diga el préstamo (como en
    // la tabla de Patrimonio); no se suma además el importe anotado a mano.
    let totalLiab = (categories["Pasivos"] || []).filter(c => !prestamosDe(fullData, c).length).reduce((s, c) => s + (data?.netWorth?.liabilities?.[c]?.[m] || 0), 0);
    if (fullData.loans) {
      fullData.loans.forEach(loan => {
        const lv = getLoanValues(loan, year, mIdx);
        if (lv.active) totalLiab += lv.balance;
      });
    }
    return { name: mesCorto(m).toUpperCase(), [t.assets]: totalAssets, [t.liabilities]: totalLiab, nw: totalAssets - totalLiab };
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
      return { name: mesCorto(m).toUpperCase(), plan, real: i < monthsPassed ? real : null };
    });
  })();

  // Top de gastos del año.
  const topGastos = [...expenseDist].sort((a, b) => b.value - a.value).slice(0, 6)
    .map(x => ({ ...x, pct: totalExpenses > 0 ? (x.value / totalExpenses) * 100 : 0 }));

  // Comparativa con el año anterior.
  const datosAnioAnterior = fullData[year - 1];
  const totalesAnterior = datosAnioAnterior ? calcularTotalesMensuales(datosAnioAnterior, datosAnioAnterior.categories || categories, fullData, year - 1) : null;
  const comparativa = totalesAnterior ? months.map((m, i) => ({
    name: mesCorto(m).toUpperCase(),
    [`${t.expenses} ${year}`]: monthlyTotals[i].expenses,
    [`${t.expenses} ${year - 1}`]: totalesAnterior[i].expenses,
    [`${t.income} ${year}`]: monthlyTotals[i].income,
    [`${t.income} ${year - 1}`]: totalesAnterior[i].income
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
  const tituloDe = (id) => { const def = WIDGETS_DASHBOARD.find(d => d.id === id); return def ? t[def.clave] : id; };
  const moverWidget = (id, delta) => {
    const k = widgetsVisibles.findIndex(w => w.id === id);
    const destino = widgetsVisibles[k + delta];
    if (k < 0 || !destino) return;
    const arr = [...dashboardCfg.widgets];
    const i = arr.findIndex(w => w.id === id), j = arr.findIndex(w => w.id === destino.id);
    [arr[i], arr[j]] = [arr[j], arr[i]];
    guardarDashboard(arr);
  };
  const restablecerDashboard = () => { if (window.confirm(t.restablecerConfirm)) guardarDashboard(normalizarDashboard(null).widgets); };

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
    let real = calcTotal(data.monthly?.[m]?.[claveSub(mkElegida, subElegida)]?.actual || []);
    if (mkElegida === 'Pago de Deudas') real += cuotaPrestamos(fullData, subElegida, year, i);
    const presupuesto = getEffectiveBudget(subElegida, mkElegida, year, i, fullData, data.budget);
    return { name: mesCorto(m).toUpperCase(), real, presupuesto };
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
  const tickCompacto = v => new Intl.NumberFormat(locale, { notation: 'compact' }).format(v);
  const sinDatos = (texto) => <div className="loading-state" style={{ height: '80%', fontSize: 12, textAlign: 'center', padding: 12 }}>{texto}</div>;

  const renderWidget = (w) => {
    switch (w.id) {
      case 'kpis': return (
        <div className="grid-3">
          <div className="card" style={{ borderLeft: '4px solid var(--accent)', background: 'linear-gradient(135deg, var(--bg-card), rgba(45, 212, 191, 0.05))' }}>
            <div className="card-title">{t.totalIncome} ({year})</div>
            <div className="card-value green">{fmt(totalIncome)}</div>
            {/* Media sobre los meses con ingresos (en marzo, 3 nóminas no son 3/12 de nómina al mes). */}
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>{fmt(mesesConIngresoAnio > 0 ? totalIncome / mesesConIngresoAnio : 0)} / {t.monthlyAvg}</div>
          </div>
          <div className="card" style={{ borderLeft: '4px solid var(--red)', background: 'linear-gradient(135deg, var(--bg-card), rgba(244, 63, 94, 0.05))' }}>
            <div className="card-title">{t.totalExpenses}</div>
            <div className="card-value red">{fmt(totalExpenses)}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>{totalIncome > 0 ? `${((totalExpenses / totalIncome) * 100).toFixed(1)}% ${t.ofIncome}` : t.sinIngresosRegistrados}</div>
          </div>
          <div className="card" style={{ borderLeft: '4px solid var(--blue)', background: 'linear-gradient(135deg, var(--bg-card), rgba(56, 189, 248, 0.05))' }}>
            <div className="card-title">{t.savings}</div>
            <div className="card-value blue">{fmt(totalSavings)}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>{totalIncome > 0 ? `${((totalSavings / totalIncome) * 100).toFixed(1)}% ${t.savingsRate}` : t.sinIngresosRegistrados}</div>
          </div>
        </div>
      );

      case 'salud': return (
        <div className="card">
          <div className="chart-card-title">{t.wSalud} {esAnioActual ? tf('saludHasta', { mes: mes(months[monthsPassed - 1]) }) : `(${year})`}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {[
              { label: t.tasaAhorro, valor: tasaAhorro, mostrar: v => `${v.toFixed(1)} %`, color: semaforo(tasaAhorro, 20, 10), max: 40, nota: t.tasaAhorroNota },
              { label: t.fondoEmergencia, valor: mesesCubiertos, mostrar: v => `${v.toFixed(1)} ${t.meses}`, color: semaforo(mesesCubiertos, 6, 3), max: 12, nota: tf('fondoNota', { cats: catsFondo.join(' + ') || t.assets }) },
              { label: t.cargaDeuda, valor: ratioDeuda, mostrar: v => `${v.toFixed(1)} %`, color: semaforo(ratioDeuda, 30, 40, true), max: 60, nota: t.cargaDeudaNota }
            ].map(g => (
              <div key={g.label} style={{ padding: 14, borderRadius: 12, background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{g.label}</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: g.color, margin: '6px 0' }}>{(g.valor === null || g.valor === undefined || isNaN(g.valor)) ? t.sinDatos : g.mostrar(g.valor)}</div>
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
          ) : sinDatos(t.sinDatos)}
        </div>
      );

      case 'ahorro-acumulado': return (
        <div className="chart-card" style={{ height: 320 }}>
          <div className="chart-card-title">{t.wAhorroAcumulado}</div>
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
              <Area type="monotone" dataKey="plan" name={t.planSegunPresupuesto} stroke="var(--accent)" strokeWidth={2} strokeDasharray="6 4" fillOpacity={0} />
              <Area type="monotone" dataKey="real" name={t.real} stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorAcumulado)" connectNulls={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      );

      case 'objetivo': {
        const colorObjetivo = objetivoAhorro > 0 ? (proyeccionAhorro >= objetivoAhorro ? 'var(--green)' : progresoObjetivo >= (monthsPassed / 12) * 100 ? 'var(--yellow)' : 'var(--red)') : 'var(--accent)';
        return (
          <div className="card" style={{ height: 320, display: 'flex', flexDirection: 'column' }}>
            <div className="chart-card-title">{t.wObjetivo}</div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
              <label style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>{tf('objetivoPara', { year })}</label>
              <BudgetInput value={objetivoAhorro} disabled={false} onSave={v => setOpcionesWidget('objetivo', { objetivo: v })} />
            </div>
            {objetivoAhorro > 0 ? (
              <>
                <div style={{ fontSize: 32, fontWeight: 900, color: colorObjetivo, lineHeight: 1 }}>{Math.max(0, progresoObjetivo).toFixed(0)} %</div>
                <div style={{ height: 10, background: 'var(--bg-input)', borderRadius: 5, overflow: 'hidden', margin: '12px 0' }}>
                  <div style={{ height: '100%', width: `${Math.max(0, Math.min(100, progresoObjetivo))}%`, background: colorObjetivo, borderRadius: 5, transition: 'width .4s' }} />
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  <Negrita texto={tf('llevasDe', { a: fmt(ahorroYTD), b: fmt(objetivoAhorro) })} />
                  {esAnioActual ? (
                    <> <Negrita texto={tf('ritmoActual', { ritmo: fmt(ritmoMensual), proy: fmt(proyeccionAhorro) })} /> {proyeccionAhorro >= objetivoAhorro ? t.vasPorDelante : tf('teFaltarian', { x: fmt(objetivoAhorro - proyeccionAhorro) })}</>
                  ) : (
                    <> {ahorroYTD >= objetivoAhorro ? t.objetivoCumplido : tf('faltaron', { x: fmt(objetivoAhorro - ahorroYTD) })}</>
                  )}
                </div>
              </>
            ) : (
              <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>{t.objetivoAyuda}</div>
            )}
          </div>
        );
      }

      case 'presupuesto-ingresos': return (
        <div className="chart-card" style={{ height: 280 }}>
          <div className="chart-card-title">{tf('presupuestoVsRealN', { seccion: t.income, n: monthsPassed })}</div>
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
          ) : sinDatos(t.sinDatosPresupuesto)}
        </div>
      );

      case 'presupuesto-gastos': return (
        <div className="chart-card" style={{ height: 280 }}>
          <div className="chart-card-title">{tf('presupuestoVsRealN', { seccion: t.expenses, n: monthsPassed })}</div>
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
          ) : sinDatos(t.sinDatosPresupuesto)}
        </div>
      );

      case 'top-gastos': return (
        <div className="chart-card" style={{ height: 320 }}>
          <div className="chart-card-title">{tf('dondeSeVa', { year })}</div>
          {topGastos.length > 0 ? (
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={topGastos} layout="vertical" margin={{ left: 4, right: 56, top: 4, bottom: 4 }}>
                <CartesianGrid horizontal={false} stroke={gridColor} strokeOpacity={0.5} />
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={118} tick={{ fontSize: 11 }} stroke={axisColor} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(99,102,241,0.08)' }} formatter={(v, n, p) => [`${fmt(v)} (${(p?.payload?.pct || 0).toFixed(1)} % ${t.delGasto})`, t.gasto]} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} label={{ position: 'right', fontSize: 11, fill: axisColor, formatter: v => fmt(v) }}>
                  {topGastos.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : sinDatos(t.sinGastosRegistrados)}
        </div>
      );

      case 'categoria': return (
        <div className="chart-card" style={{ height: 320 }}>
          <div className="chart-card-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span>{t.wCategoria}</span>
            <select className="select-input" style={{ width: 'auto', height: 30, fontSize: 12, padding: '0 8px' }} value={claveCategoria} onChange={e => setOpcionesWidget('categoria', { cat: e.target.value })}>
              {ALL_MAIN_KEYS.map(mk => (
                <optgroup key={mk} label={t[mk] || mk}>
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
                <Bar dataKey="real" name={tf('realDe', { sub: subElegida })} fill={getCategoryColor(mkElegida)} radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="presupuesto" name={t.budget} stroke="var(--text-secondary)" strokeWidth={2} strokeDasharray="6 4" dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          ) : sinDatos(t.sinCategorias)}
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
          <div className="chart-card-title">{tf('esteAnioVsAnterior', { a: year, b: year - 1 })}</div>
          {totalesAnterior ? (
            <>
              <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', fontSize: 12, marginBottom: 6 }}>
                {[
                  { l: t.income, a: ingresosYTD, b: ingresosAnteriorYTD, mejorSiSube: true },
                  { l: t.expenses, a: gastosYTD, b: gastosAnteriorYTD, mejorSiSube: false },
                  { l: t.ahorro, a: ahorroYTD, b: ingresosAnteriorYTD - gastosAnteriorYTD, mejorSiSube: true }
                ].map(d => {
                  const diff = d.a - d.b;
                  const pct = d.b !== 0 ? (diff / Math.abs(d.b)) * 100 : null;
                  const color = (d.mejorSiSube ? diff >= 0 : diff <= 0) ? 'var(--green)' : 'var(--red)';
                  return <span key={d.l}>{d.l}: <b style={{ color }}>{diff >= 0 ? '+' : ''}{fmt(diff)}</b>{pct !== null && <span style={{ color: 'var(--text-muted)' }}> ({pct >= 0 ? '+' : ''}{pct.toFixed(0)} %)</span>}</span>;
                })}
                <span style={{ color: 'var(--text-muted)' }}>{tf('primerosMeses', { n: monthsPassed })}</span>
              </div>
              <ResponsiveContainer width="100%" height="80%">
                <ComposedChart data={comparativa} barSize={10}>
                  <CartesianGrid stroke={gridColor} strokeOpacity={0.5} />
                  <XAxis dataKey="name" stroke={axisColor} tick={{ fontSize: 11 }} />
                  <YAxis stroke={axisColor} tick={{ fontSize: 11 }} tickFormatter={tickCompacto} />
                  <Tooltip contentStyle={tooltipStyle} formatter={v => fmt(v)} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey={`${t.expenses} ${year - 1}`} fill="#94a3b8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey={`${t.expenses} ${year}`} fill="#ef4444" radius={[4, 4, 0, 0]} />
                  <Line type="monotone" dataKey={`${t.income} ${year - 1}`} stroke="#94a3b8" strokeWidth={2} strokeDasharray="6 4" dot={false} />
                  <Line type="monotone" dataKey={`${t.income} ${year}`} stroke="#10b981" strokeWidth={2} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </>
          ) : sinDatos(tf('sinDatosAnioAnterior', { year: year - 1 }))}
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
            ? t.modoPersonalizacion
            : `${tf('bloquesVisibles', { n: widgetsVisibles.length })}${widgetsOcultos.length ? ` · ${tf('bloquesOcultos', { n: widgetsOcultos.length })}` : ''}`}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {editandoDashboard && widgetsOcultos.length > 0 && (
            <select className="select-input" style={{ width: 'auto', height: 36 }} value="" onChange={e => { if (e.target.value) cambiarWidget(e.target.value, { visible: true }); }}>
              <option value="">{t.anadirBloque}</option>
              {widgetsOcultos.map(w => <option key={w.id} value={w.id}>{tituloDe(w.id)}</option>)}
            </select>
          )}
          {editandoDashboard && <button className="btn btn-ghost" onClick={restablecerDashboard}>{t.restablecer}</button>}
          <button className={`btn ${editandoDashboard ? 'btn-primary' : 'btn-ghost'} dashboard-personalizar-btn`} onClick={() => setEditandoDashboard(!editandoDashboard)}>
            <Ic d={PATHS.settings} size={14} /> {editandoDashboard ? t.listo : t.personalizar}
          </button>
        </div>
      </div>

      <div className="grid-2" style={{ alignItems: 'stretch' }}>
        {widgetsVisibles.map((w, idx) => (
          <div key={w.id} style={{ gridColumn: w.size === 'full' ? '1 / -1' : 'auto', position: 'relative', outline: editandoDashboard ? '2px dashed var(--accent)' : 'none', outlineOffset: 4, borderRadius: 12 }}>
            {editandoDashboard && (
              <div style={{ position: 'absolute', top: 6, right: 6, zIndex: 5, display: 'flex', gap: 4, background: 'var(--bg-card)', border: '1px solid var(--accent)', borderRadius: 8, padding: 4, boxShadow: 'var(--shadow)' }}>
                <button className="btn btn-icon btn-ghost" style={botonEdicion} title={t.subir} disabled={idx === 0} onClick={() => moverWidget(w.id, -1)}>▲</button>
                <button className="btn btn-icon btn-ghost" style={botonEdicion} title={t.bajar} disabled={idx === widgetsVisibles.length - 1} onClick={() => moverWidget(w.id, 1)}>▼</button>
                <button className="btn btn-icon btn-ghost" style={botonEdicion} title={w.size === 'full' ? t.mediaAnchura : t.anchuraCompleta} onClick={() => cambiarWidget(w.id, { size: w.size === 'full' ? 'half' : 'full' })}>{w.size === 'full' ? '⇥' : '⇔'}</button>
                <button className="btn btn-icon btn-danger" style={botonEdicion} title={t.ocultar} onClick={() => cambiarWidget(w.id, { visible: false })}>✕</button>
              </div>
            )}
            {renderWidget(w)}
          </div>
        ))}
        {widgetsVisibles.length === 0 && (
          <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
            {t.sinBloques}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MONTHLY VIEW ─────────────────────────────────────────────────────────────
// Cifra editable "en la celda": se muestra formateada; al hacer clic se convierte
// en un campo del MISMO tamaño (la tabla no se mueve) que guarda al salir o con
// Enter; Esc cancela. Campo de texto con teclado decimal, sin flechas, y admite
// coma o punto como separador.
const CeldaCifra = ({ value, onSave, title, color, bold, disabled }) => {
  const [editando, setEditando] = useState(false);
  const [val, setVal] = useState('');
  const [anchoEdicion, setAnchoEdicion] = useState(72);
  const cancelado = useRef(false);
  const spanRef = useRef(null);
  const abrir = () => {
    if (disabled) return;
    cancelado.current = false;
    // El campo mide lo mismo que ocupaba la cifra: la tabla no se mueve.
    setAnchoEdicion(Math.max(64, Math.ceil((spanRef.current?.getBoundingClientRect().width || 0) + 10)));
    setVal(String(Math.round((parseFloat(value) || 0) * 100) / 100));
    setEditando(true);
  };
  const confirmar = () => {
    setEditando(false);
    if (cancelado.current) return;
    const num = parseFloat(String(val).trim().replace(/\s/g, '').replace(',', '.'));
    if (!isNaN(num) && Math.abs(num - (parseFloat(value) || 0)) > 0.004) onSave(Math.round(num * 100) / 100);
  };
  if (!editando) {
    return (
      <span ref={spanRef} onClick={abrir} title={disabled ? '' : title}
        style={{ display: 'inline-block', whiteSpace: 'nowrap', cursor: disabled ? 'default' : 'pointer', fontWeight: bold ? 700 : 500, color: color || 'inherit', borderBottom: disabled ? 'none' : '1px dashed var(--border)', paddingBottom: 1 }}>
        {fmt(value)}
      </span>
    );
  }
  return (
    <input type="text" inputMode="decimal" autoFocus value={val}
      style={{ width: anchoEdicion, maxWidth: '100%', boxSizing: 'border-box', height: 22, padding: '0 3px', margin: '-2px 0', verticalAlign: 'middle', textAlign: 'right', fontSize: 'inherit', fontFamily: 'inherit', fontWeight: bold ? 700 : 500, color: color || 'inherit', background: 'var(--bg-input)', border: '1px solid var(--accent)', borderRadius: 6, outline: 'none' }}
      onFocus={e => e.target.select()}
      onChange={e => setVal(e.target.value)}
      onBlur={confirmar}
      onKeyDown={e => {
        if (e.key === 'Enter') e.target.blur();
        if (e.key === 'Escape') { cancelado.current = true; e.target.blur(); }
      }} />
  );
};

function MonthlyView({ currentMonthData, categories, onUpdate, fullData, year, month, budgetData, onIrAPresupuesto, config, onUpdateCfg }) {
  const { t, tf, mes } = useApp();

  const [notaEstimado, setNotaEstimado] = useState(false);
  // Todo se edita dentro de la tabla (ya no hay formulario aparte): fila
  // desplegada, movimiento nuevo y movimiento en edición.
  const [filaAbierta, setFilaAbierta] = useState(null);
  const [nuevoMov, setNuevoMov] = useState({ amount: '', date: '', nota: '' });
  const [editMov, setEditMov] = useState(null);

  // Al cambiar de mes o de año en la barra superior, la fecha propuesta pasa a
  // ese mes (hoy, si es el mes en curso). Antes se proponía siempre la fecha de
  // hoy en UTC, así que un gasto anotado en octubre se guardaba con fecha de
  // noviembre y a primera hora de la mañana con el día anterior.
  useEffect(() => {
    const mIdx = months.indexOf(month);
    const hoy = new Date();
    const propuesta = hoy.getFullYear() === year && hoy.getMonth() === mIdx ? hoyLocal() : `${year}-${String(mIdx + 1).padStart(2, '0')}-01`;
    setFilaAbierta(null);
    setEditMov(null);
    setNuevoMov({ amount: '', date: propuesta, nota: '' });
  }, [year, month]);

  if (!currentMonthData) return <div className="loading-state">{t.noData} {mes(month)} {year}</div>;

  const expenseKeys = EXPENSE_KEYS;
  const mIdx = months.indexOf(month);
  const fechaPropuesta = () => {
    const hoy = new Date();
    return hoy.getFullYear() === year && hoy.getMonth() === mIdx ? hoyLocal() : `${year}-${String(mIdx + 1).padStart(2, '0')}-01`;
  };

  // Cada subcategoría se lee con su clave "Sección|Nombre": las homónimas de
  // secciones distintas ("Otros") ya no comparten movimientos.
  const allTxs = [];
  Object.keys(categories).forEach(mk => {
    if (esSeccionPatrimonio(mk)) return;
    (categories[mk] || []).forEach(sub => {
      const clave = claveSub(mk, sub);
      (currentMonthData[clave]?.actual || []).forEach(tx => {
        allTxs.push({ ...tx, type: mk === 'Ingresos' ? 'income' : 'expense', category: sub, mainCategory: mk, clave });
      });
    });
  });

  // Inject automatic loan transactions
  if (fullData.loans) {
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

  // ─── Guardado desde la tabla ───────────────────────────────────────────────
  const cuboDe = (nd, mk, sub) => { asegurarSub(nd[year], mk, sub); return nd[year].monthly[month][claveSub(mk, sub)]; };

  // Total real del mes escrito a mano: se crea o ajusta un movimiento para que
  // la suma coincida. Las cuotas automáticas de préstamos no se tocan.
  const guardarReal = (mk, sub, v) => {
    const cuotas = mk === 'Pago de Deudas' ? cuotaPrestamos(fullData, sub, year, mIdx) : 0;
    const objetivo = Math.round((v - cuotas) * 100) / 100;
    const nd = clonar(fullData);
    const cubo = cuboDe(nd, mk, sub);
    const lista = cubo.actual || [];
    const diff = Math.round((objetivo - calcTotal(lista)) * 100) / 100;
    if (Math.abs(diff) < 0.005) return;
    if (lista.length === 0) {
      lista.push({ id: crypto.randomUUID(), amount: objetivo, date: fechaPropuesta() });
    } else if (lista.length === 1) {
      if (Math.abs(objetivo) < 0.005) lista.length = 0; else lista[0].amount = objetivo;
    } else {
      lista.push({ id: crypto.randomUUID(), amount: diff, date: fechaPropuesta(), nota: t.smAjuste });
    }
    cubo.actual = lista;
    onUpdate(nd);
  };

  const anadirMov = (mk, sub) => {
    const amount = parseFloat(String(nuevoMov.amount).replace(',', '.'));
    if (isNaN(amount) || !nuevoMov.date) { alert(t.completaCampos); return; }
    const nd = clonar(fullData);
    const cubo = cuboDe(nd, mk, sub);
    const mov = { id: crypto.randomUUID(), amount: Math.round(amount * 100) / 100, date: nuevoMov.date };
    if (nuevoMov.nota.trim()) mov.nota = nuevoMov.nota.trim();
    cubo.actual = [...(cubo.actual || []), mov];
    onUpdate(nd);
    setNuevoMov({ amount: '', date: nuevoMov.date, nota: '' });
  };

  const guardarEdicionMov = () => {
    if (!editMov) return;
    const amount = parseFloat(String(editMov.amount).replace(',', '.'));
    if (isNaN(amount) || !editMov.date) { alert(t.completaCampos); return; }
    const nd = clonar(fullData);
    const cubo = nd[year]?.monthly?.[month]?.[editMov.clave];
    if (cubo) {
      cubo.actual = (cubo.actual || []).map(tx => {
        if (tx.id !== editMov.id) return tx;
        const n = { ...tx, amount: Math.round(amount * 100) / 100, date: editMov.date };
        const nota = String(editMov.nota || '').trim();
        if (nota) n.nota = nota; else delete n.nota;
        return n;
      });
    }
    onUpdate(nd);
    setEditMov(null);
  };

  const handleDelete = (clave, id) => {
    if (String(id).startsWith('loan-')) {
      alert(t.cuotasAutomaticas);
      return;
    }
    const nd = clonar(fullData);
    const cubo = nd[year]?.monthly?.[month]?.[clave];
    if (cubo) cubo.actual = (cubo.actual || []).filter(tx => tx.id !== id);
    onUpdate(nd);
    if (editMov?.id === id) setEditMov(null);
  };

  const abrirFila = (c) => {
    const abierta = filaAbierta === c;
    setFilaAbierta(abierta ? null : c);
    setEditMov(null);
    setNuevoMov({ amount: '', date: fechaPropuesta(), nota: '' });
  };

  const inputPeq = { height: 30, fontSize: 12, padding: '0 8px' };

  // Movimientos de una categoría dentro de la tabla: lista editable y alta.
  // Filas flexibles (no una tabla anidada) para que quepan en la tarjeta y se
  // reorganicen en pantallas estrechas sin desbordar la tabla principal.
  const estiloFila = { display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center', padding: '4px 0', borderBottom: '1px solid var(--border)', fontSize: 12 };
  const campoFecha = { ...inputPeq, width: 138, flex: '0 0 138px' };
  const campoNota = { ...inputPeq, flex: '1 1 110px', minWidth: 90 };
  const campoImporte = { ...inputPeq, width: 96, flex: '0 0 96px', textAlign: 'right' };
  const renderDetalle = (mk, sub, c, lista, esPrestamo, cuotas) => (
    <tr key={`${c}-detalle`}>
      <td colSpan={3} style={{ padding: '8px 10px 12px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', whiteSpace: 'normal' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase' }}>{tf('smMovimientosDe', { sub })}</div>
        {esPrestamo && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{t.smCuotaAuto}: <b>{fmt(cuotas)}</b></div>}
        {lista.length === 0 && <div style={{ fontSize: 12, color: 'var(--text-muted)', padding: '4px 0' }}>{t.smSinMovimientos}</div>}
        {[...lista].sort((a, b) => String(a.date).localeCompare(String(b.date))).map(tx => (
          editMov && editMov.id === tx.id ? (
            <div key={tx.id} style={{ ...estiloFila, cursor: 'default' }}>
              <input type="date" className="date-input" style={campoFecha} value={editMov.date} onChange={e => setEditMov({ ...editMov, date: e.target.value })} />
              <input className="text-input" style={campoNota} placeholder={t.smConceptoOpcional} value={editMov.nota} onChange={e => setEditMov({ ...editMov, nota: e.target.value })} onKeyDown={e => { if (e.key === 'Enter') guardarEdicionMov(); if (e.key === 'Escape') setEditMov(null); }} />
              <input type="number" step="0.01" className="number-input" style={campoImporte} value={editMov.amount} onChange={e => setEditMov({ ...editMov, amount: e.target.value })} onKeyDown={e => { if (e.key === 'Enter') guardarEdicionMov(); if (e.key === 'Escape') setEditMov(null); }} autoFocus />
              <span style={{ whiteSpace: 'nowrap' }}>
                <button className="btn btn-primary" style={{ padding: '2px 8px', fontSize: 11 }} onClick={guardarEdicionMov}>{t.smGuardar}</button>
                <button className="btn btn-ghost" style={{ padding: '2px 8px', fontSize: 11, marginLeft: 4 }} onClick={() => setEditMov(null)}>✕</button>
              </span>
            </div>
          ) : (
            <div key={tx.id} title={t.smEditarAyuda} style={{ ...estiloFila, flexWrap: 'nowrap', cursor: 'pointer' }} onClick={() => setEditMov({ clave: c, id: tx.id, amount: String(tx.amount), date: tx.date, nota: tx.nota || '' })}>
              <span style={{ color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{tx.date}</span>
              <span style={{ color: 'var(--text-muted)', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tx.nota || ''}</span>
              <span style={{ fontWeight: 600, whiteSpace: 'nowrap', color: tx.amount < 0 ? 'var(--yellow)' : 'inherit' }}>{fmt(tx.amount)}</span>
              <button className="btn btn-icon btn-danger" style={{ width: 22, height: 22, flexShrink: 0 }} title={t.delete} onClick={e => { e.stopPropagation(); handleDelete(c, tx.id); }}><Ic d={PATHS.trash} size={11} /></button>
            </div>
          )
        ))}
        <div style={{ ...estiloFila, borderBottom: 'none', marginTop: 6 }}>
          <input type="date" className="date-input" style={campoFecha} value={nuevoMov.date} onChange={e => setNuevoMov({ ...nuevoMov, date: e.target.value })} />
          <input className="text-input" style={campoNota} placeholder={t.smConceptoOpcional} value={nuevoMov.nota} onChange={e => setNuevoMov({ ...nuevoMov, nota: e.target.value })} onKeyDown={e => e.key === 'Enter' && anadirMov(mk, sub)} />
          <input type="number" step="0.01" className="number-input" style={campoImporte} placeholder="0.00" value={nuevoMov.amount} onChange={e => setNuevoMov({ ...nuevoMov, amount: e.target.value })} onKeyDown={e => e.key === 'Enter' && anadirMov(mk, sub)} />
          <button className="btn btn-primary" style={{ padding: '2px 10px', fontSize: 11, whiteSpace: 'nowrap' }} onClick={() => anadirMov(mk, sub)}>+ {t.add}</button>
        </div>
      </td>
    </tr>
  );

  const renderMonthlyTable = (mk) => {
    const subsSet = new Set(categories[mk] || []);
    (fullData[year]?.oneTime?.[month] || []).filter(ot => ot.cat === mk).forEach(ot => Object.keys(ot).length > 0 && subsSet.add(ot.sub));
    const subs = Array.from(subsSet);

    if (!subs.length) return null;

    let totalEstimated = 0;
    let totalReal = 0;
    const colorReal = mk === 'Ingresos' ? 'var(--green)' : 'var(--red)';

    const rows = subs.flatMap(sub => {
      const c = claveSub(mk, sub);
      const esPrestamo = mk === 'Pago de Deudas' && prestamosDe(fullData, sub).length > 0;
      const cuotas = esPrestamo ? cuotaPrestamos(fullData, sub, year, mIdx) : 0;
      const base = getEffectiveBudget(sub, mk, year, mIdx, fullData, budgetData);
      const puntuales = (fullData[year]?.oneTime?.[month] || []).filter(ot => ot.cat === mk && ot.sub === sub).reduce((acc, ot) => acc + ot.amount, 0);
      const est = base + puntuales;
      const lista = currentMonthData?.[c]?.actual || [];
      const act = calcTotal(lista) + cuotas;

      totalEstimated += est;
      totalReal += act;
      const abierta = filaAbierta === c;

      const filas = [
        <tr key={c} style={abierta ? { background: 'var(--bg-secondary)' } : undefined}>
          <td>
            {/* El desplegable va dentro del nombre (sin botón aparte) para que las cinco tarjetas quepan en una fila a 1080p. */}
            <span onClick={() => abrirFila(c)} title={abierta ? t.smOcultar : t.smVer} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5, userSelect: 'none' }}>
              <span style={{ fontSize: 9, width: 10, display: 'inline-block', color: abierta ? 'var(--accent)' : 'var(--text-muted)' }}>{abierta ? '▾' : '▸'}</span>
              <span>{sub}</span>
              {lista.length > 0 && <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>({lista.length})</span>}
            </span>
          </td>
          <td className="text-right" style={{ color: 'var(--text-muted)' }}>
            {/* El estimado solo se edita en Dashboard → Presupuesto; al pulsarlo se explica. */}
            <span title={esPrestamo ? t.smCuotaAuto : tf('smEstimadoAyuda', { year })} onClick={() => { if (!esPrestamo) setNotaEstimado(true); }} style={{ cursor: esPrestamo ? 'default' : 'help' }}>{fmt(est)}</span>
            {puntuales !== 0 && <div style={{ fontSize: 10, color: 'var(--accent)' }}>{fmt(puntuales)} {t.smPuntuales}</div>}
          </td>
          <td className="text-right">
            <CeldaCifra value={act} onSave={v => guardarReal(mk, sub, v)} title={t.smRealAyuda} color={colorReal} bold />
          </td>
        </tr>
      ];
      if (abierta) filas.push(renderDetalle(mk, sub, c, lista, esPrestamo, cuotas));
      return filas;
    });

    const isIncome = mk === 'Ingresos';
    return (
      <div className="card sm-card" key={mk} style={{ padding: 0, overflow: 'hidden' }}>
        <div className="budget-header-card" style={{ backgroundColor: getCategoryColor(mk) }}>
          <span>{(t[mk] || mk).toUpperCase()}</span>
        </div>
        <div className="table-wrap" style={{ flex: 1, borderBottom: '1px solid var(--border)' }}>
          <table style={{ margin: 0 }}>
            <thead><tr><th>{t.category}</th><th className="text-right">{t.estimado}</th><th className="text-right">{t.real}</th></tr></thead>
            <tbody>{rows}</tbody>
          </table>
        </div>
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', background: 'var(--bg-card)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto auto', padding: '12px 16px', fontSize: 13, alignItems: 'center' }}>
            <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{t.total}</div>
            <div className="text-right" style={{ fontWeight: 800, minWidth: '80px', paddingLeft: '16px' }}>{fmt(totalEstimated)}</div>
            <div className="text-right" style={{ fontWeight: 800, color: getCategoryColor(mk), minWidth: '80px', paddingLeft: '16px' }}>{fmt(totalReal)}</div>
          </div>
          {!isIncome && totalIncome > 0 && (
            <div style={{ padding: '8px 12px', borderTop: '1px solid var(--border)', fontSize: 11, fontWeight: 700, textAlign: 'center', background: 'rgba(255,255,255,0.02)' }}>
              <span style={{ color: getCategoryColor(mk) }}>{((totalReal / totalIncome) * 100).toFixed(1)}%</span> {t.gastadoSobreMes}
            </div>
          )}
        </div>
      </div >
    );
  };

  const totalExpenses = expenseKeys.reduce((acc, mk) => {
    const subs = categories[mk] || [];
    return acc + subs.reduce((s, sub) => {
      let act = calcTotal(currentMonthData?.[claveSub(mk, sub)]?.actual || []);
      if (mk === 'Pago de Deudas') act += cuotaPrestamos(fullData, sub, year, mIdx);
      return s + act;
    }, 0);
  }, 0);

  return (
    <div className="section-gap">
      {/* KPIs */}
      <div className="grid-3">
        <div className="card"><div className="card-title">{t.income}</div><div className="card-value green">{fmt(totalIncome)}</div></div>
        <div className="card"><div className="card-title">{t.expenses}</div><div className="card-value red">{fmt(totalExpenses)}</div></div>
        <div className="card"><div className="card-title">{t.savings}</div><div className={`card-value ${totalIncome - totalExpenses >= 0 ? 'blue' : 'yellow'}`}>{fmt(totalIncome - totalExpenses)}</div></div>
      </div>

      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 16 }}>{t.smAyudaTabla}</div>
      {revisionDeAnioPendiente(fullData, year, config) && (
        <div role="note" style={{ marginTop: 10, padding: '10px 14px', borderRadius: 10, background: 'rgba(16,185,129,.10)', border: '1px solid rgba(16,185,129,.4)', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', fontSize: 13 }}>
          <span style={{ fontSize: 18, lineHeight: 1 }}>🎯</span>
          <span style={{ flex: 1, minWidth: 220 }}>{tf('revBanner', { year, anterior: year - 1 })}</span>
          {onIrAPresupuesto && <button className="btn btn-primary" style={{ padding: '4px 12px', fontSize: 12 }} onClick={onIrAPresupuesto}>{t.revBannerBtn}</button>}
          {onUpdateCfg && <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: 12 }} title={t.revRevisado} onClick={() => onUpdateCfg({ ...config, revisionAnio: year })}>✕</button>}
        </div>
      )}
      {notaEstimado && (
        <div role="status" style={{ marginTop: 10, padding: '10px 14px', borderRadius: 10, background: 'rgba(99,102,241,.10)', border: '1px solid rgba(99,102,241,.4)', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', fontSize: 13 }}>
          <span style={{ flex: 1, minWidth: 220 }}>{tf('smEstimadoAyuda', { year })}</span>
          {onIrAPresupuesto && <button className="btn btn-primary" style={{ padding: '4px 12px', fontSize: 12 }} onClick={onIrAPresupuesto}>{t.smIrPresupuesto}</button>}
          <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: 12 }} onClick={() => setNotaEstimado(false)}>✕</button>
        </div>
      )}

      {/* Tarjetas por sección: cinco por fila si hay sitio de sobra; si no, tres arriba y dos abajo centradas (reglas .sm-grid en index.css) */}
      <div className="sm-grid-wrap" style={{ marginTop: 12, marginBottom: 24 }}>
        <div className="sm-grid">
          {ALL_MAIN_KEYS.map(renderMonthlyTable)}
        </div>
      </div>

      {/* Transactions table */}
      <div className="card">
        <div className="chart-card-title" style={{ marginBottom: 12 }}>{t.transactions} — {mes(month).charAt(0).toUpperCase() + mes(month).slice(1)}</div>
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
                        <span className="badge badge-accent" style={{ fontSize: 11 }}>{t[tx.mainCategory] || tx.mainCategory}</span>
                      </div>
                    </td>
                    <td>{tx.category}{tx.nota && <span style={{ color: 'var(--text-muted)', fontSize: 11 }}> · {tx.nota}</span>}{tx.isAuto && <span style={{ color: 'var(--text-muted)', fontSize: 11 }}> · {t.smCuotaAuto}</span>}</td>
                    <td className="text-right" style={{ fontWeight: 700, color: tx.type === 'income' ? 'var(--green)' : 'var(--red)' }}>{fmt(tx.amount)}</td>
                    <td className="text-center">
                      <button className="btn btn-icon btn-danger" onClick={() => handleDelete(tx.clave, tx.id)} title={t.delete}>
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
  const { t, theme, locale, mes, mesCorto } = useApp();
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
    // Un Pasivo que coincide con un préstamo muestra en la tabla el saldo del
    // préstamo, no el valor anotado a mano: en el gráfico tampoco se suman los dos.
    let totalLiab = (categories["Pasivos"] || []).filter(c => !prestamosDe(fullData, c).length).reduce((s, c) => s + (data?.liabilities?.[c]?.[m] || 0), 0);
    // Inject loan balance as liability
    if (fullData.loans) {
      fullData.loans.forEach(loan => {
        const lv = getLoanValues(loan, year, mIdx);
        if (lv.active) totalLiab += lv.balance;
      });
    }
    return { name: mesCorto(m).toUpperCase(), [t.assets]: totalAssets, [t.liabilities]: totalLiab, [t.netWorth]: totalAssets - totalLiab };
  });

  const renderTable = (type) => {
    const cats = categories[type] || [];
    if (!cats.length) return null;
    const nwk = type === 'Activos' ? 'assets' : 'liabilities';
    const displayMonths = isMobileNW ? [selectedMobileMonth] : months;

    return (
      <div className="card">
        <div className="chart-card-title">{t[type] || type}</div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{t.category}</th>
                {displayMonths.map(m => <th key={m} className="text-right" style={{ fontSize: 10 }}>{mesCorto(m).toUpperCase()}</th>)}
              </tr>
            </thead>
            <tbody>
              {cats.map(cat => {
                const prestamos = type === 'Pasivos' ? prestamosDe(fullData, cat) : [];
                return (
                  <tr key={cat}>
                    <td style={{ whiteSpace: 'nowrap', fontSize: 12 }}>{cat}</td>
                    {displayMonths.map((m) => {
                      const mIdx = months.indexOf(m);
                      let val = data?.[nwk]?.[cat]?.[m] || 0;
                      if (prestamos.length) {
                        val = prestamos.reduce((s, l) => { const lv = getLoanValues(l, year, mIdx); return s + (lv.active ? lv.balance : 0); }, 0);
                      }
                      return (
                        <td key={m} className="text-right">
                          {prestamos.length ? (
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
            <YAxis stroke={axisColor} tick={{ fontSize: 11 }} tickFormatter={v => new Intl.NumberFormat(locale, { notation: 'compact' }).format(v)} />
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
          <label style={{ fontSize: 12, fontWeight: 700, marginRight: 8, color: 'var(--text-secondary)' }}>{t.seleccionarMesMovil}</label>
          <select className="select-input" value={selectedMobileMonth} onChange={e => setSelectedMobileMonth(e.target.value)} style={{ textTransform: 'capitalize', marginTop: 8 }}>
            {months.map(m => <option key={m} value={m}>{mes(m)}</option>)}
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
  const { t, tf, locale } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [expandedLoan, setExpandedLoan] = useState(null);
  const [extraAmount, setExtraAmount] = useState('');
  const [extraMonth, setExtraMonth] = useState('');
  const [extraAmortLoan, setExtraAmortLoan] = useState(null);

  const handleAdd = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const name = nombreSubValido(fd.get('name'));
    if (!name) return;
    // Todas las vistas buscan el préstamo por su nombre: con dos iguales solo
    // uno entraba en presupuesto y totales aunque los dos salieran en la lista.
    if (loans.some(l => l.name === name)) { alert(tf('prestamoDuplicado', { nombre: name })); return; }
    const loanTotal = parseFloat(fd.get('loanTotal'));
    const count = parseInt(fd.get('installments'));
    const rateYear = parseFloat(fd.get('rate')) || 0;
    const startStr = fd.get('start');
    if (!(loanTotal > 0) || !(count > 0) || !startStr) { alert(t.revisaPrestamo); return; }

    // Formula: Cuota = (P * i) / (1 - (1 + i)^-n)
    const i = (rateYear / 100) / 12;
    const amount = i > 0
      ? (loanTotal * i) / (1 - Math.pow(1 + i, -count))
      : loanTotal / count;

    const newLoan = {
      id: crypto.randomUUID(),
      name,
      amount: amount, // monthly installment
      totalAmount: loanTotal,
      installmentsCount: count,
      interestRate: rateYear,
      startDate: startStr
    };
    // Fin según el cuadro de amortización, en hora local (new Date('YYYY-MM-DD')
    // es UTC y setMonth con día 29-31 se desbordaba al mes siguiente).
    newLoan.endDate = fechaISO(finRealPrestamo(newLoan));

    const nd = clonar(fullData);
    nd.loans.push(newLoan);

    onUpdateCfg(configConSub(configConSub(config, 'Pago de Deudas', name), 'Pasivos', name));

    // El préstamo tiene que figurar como subcategoría desde su año de inicio, para
    // que sus cuotas salgan en Presupuesto, Seguimiento y Patrimonio. Los años
    // que aún no existan lo recibirán al crearse (crearAnioHeredado).
    const loanStartYear = fechaLocal(startStr).getFullYear();
    aniosConDatos(nd).filter(y => y >= loanStartYear).forEach(y => {
      asegurarSub(nd[y], 'Pago de Deudas', name);
      asegurarSub(nd[y], 'Pasivos', name);
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

  // Devuelve true si la amortización se ha añadido (el formulario se cierra solo entonces).
  const handleExtraAmort = (e, loanId) => {
    e.preventDefault();
    if (!extraAmount || parseFloat(extraAmount) <= 0 || !extraMonth) return false;
    const nd = JSON.parse(JSON.stringify(fullData));
    const loan = nd.loans.find(l => l.id === loanId);
    if (!loan) return false;
    // Las amortizaciones anticipadas acortan el préstamo: una extra en una cuota
    // posterior a la última real no se aplicaría nunca ni se vería en el cuadro.
    const numero = parseInt(extraMonth);
    const cuotasReales = simularPrestamo(loan).length || loan.installmentsCount;
    if (!(numero >= 1) || numero > cuotasReales) {
      alert(tf('cuotaFueraCuadro', { n: cuotasReales }));
      return false;
    }
    if (!loan.extraAmortizations) loan.extraAmortizations = [];
    loan.extraAmortizations.push({ paymentNo: numero, amount: parseFloat(extraAmount), id: crypto.randomUUID() });
    onUpdate(nd);
    setExtraAmount(''); setExtraMonth('');
    return true;
  };

  const handleDeleteExtraAmort = (loanId, extraId) => {
    if (!window.confirm(t.eliminarAmortConfirm)) return;
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
            <div><label>{t.loanName}</label><input name="name" className="text-input" placeholder={t.ejHipoteca} required /></div>
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
          const endLabel = end.toLocaleDateString(locale, { month: 'short', year: 'numeric' });

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
                    <button className="btn btn-icon btn-ghost" onClick={() => { setExtraAmortLoan(extraAmortLoan === l.id ? null : l.id); setExpandedLoan(null); }} title={t.amortAnticipada}>
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
                    <span className="badge badge-accent" style={{ fontSize: 10 }}>{t.frances}</span>
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
                          {l.extraAmortizations && l.extraAmortizations.length > 0 && <th className="text-right">{t.extra}</th>}
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
                                          <button type="button" onClick={() => handleDeleteExtraAmort(l.id, ex.id)} style={{ background: 'none', border: 'none', color: 'var(--red)', cursor: 'pointer', padding: 0 }} title={t.delete}><Ic d={PATHS.trash} size={10} /></button>
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
                  {(() => {
                    // Extras registradas en cuotas que ya no existen (el préstamo se
                    // acortó después): no se aplican y antes no había forma de borrarlas.
                    const filas = getAmortizationTable(l).length;
                    const huerfanas = (l.extraAmortizations || []).filter(ex => ex.paymentNo > filas);
                    if (!huerfanas.length) return null;
                    return (
                      <div style={{ padding: '12px 20px 4px', fontSize: 12, color: 'var(--text-muted)' }}>
                        <div style={{ marginBottom: 6 }}>{tf('extrasFueraCuadro', { n: filas })}</div>
                        {huerfanas.map(ex => (
                          <div key={ex.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                            <span>{tf('cuotaN', { n: ex.paymentNo })}: +{fmt(ex.amount)}</span>
                            <button type="button" className="btn btn-ghost" style={{ padding: '2px 8px', fontSize: 11, color: 'var(--red)' }} onClick={() => handleDeleteExtraAmort(l.id, ex.id)}>{t.delete}</button>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              )}
              {extraAmortLoan === l.id && (
                <div style={{ background: 'var(--bg-card-hover)', borderTop: '1px solid var(--border)', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
                    {t.nuevaAmortAnticipada}
                  </div>
                  <form onSubmit={(e) => { if (handleExtraAmort(e, l.id)) setExtraAmortLoan(null); }} className="fade-in" style={{ display: 'flex', gap: 12, alignItems: 'end' }}>
                    <div>
                      <label style={{ fontSize: 11 }}>{t.numMesCuota}</label>
                      <input className="number-input" type="number" min="1" max={simularPrestamo(l).length || l.installmentsCount} value={extraMonth} onChange={e => setExtraMonth(e.target.value)} required placeholder={t.ej12} style={{ height: 36, padding: '0 12px', width: 120 }} />
                    </div>
                    <div>
                      <label style={{ fontSize: 11 }}>{t.importeExtra}</label>
                      <input className="number-input" type="number" step="0.01" min="1" value={extraAmount} onChange={e => setExtraAmount(e.target.value)} required placeholder="1000.00" style={{ height: 36, padding: '0 12px', width: 140 }} />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ height: 36 }}>{t.aplicar}</button>
                    <button type="button" className="btn btn-ghost" style={{ height: 36 }} onClick={() => setExtraAmortLoan(null)}>{t.cancel}</button>
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
  const { t, tf, theme, toggleTheme, language, setLanguageTo, locale } = useApp();
  // Vuelta de Stripe Checkout (?pago=ok | cancelado): se muestra una vez y se limpia la URL.
  const [avisoPago] = useState(() => {
    const p = new URLSearchParams(window.location.search).get('pago');
    if (p) window.history.replaceState({}, '', window.location.pathname);
    return p;
  });
  const sus = describirSuscripcion(user, t, tf, locale);
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
    alert(t.perfilActualizado);
  };

  // Las tres operaciones afectan al año seleccionado y a los posteriores (los
  // anteriores conservan su historial) y solo a la sección indicada: un Activo o
  // Pasivo con el mismo nombre que una subcategoría de presupuesto (el Pasivo
  // "Hipoteca" frente al gasto "Hipoteca") ya no comparte datos con ella.
  const handleAddCat = () => {
    const name = nombreSubValido(newCatName);
    if (!name) return;
    const currentYearCats = financialData?.[selectedYear]?.categories || config.categories;
    if ((currentYearCats[modalMainCat] || []).includes(name)) { alert(t.yaExisteAnio); return; }
    onUpdate(configConSub(config, modalMainCat, name));
    onUpdateFD(enAniosDesde(financialData, selectedYear, d => asegurarSub(d, modalMainCat, name)));
    setShowModal(false); setNewCatName('');
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    const { mk, sub } = deleteTarget;
    onUpdate(configSinSub(config, mk, sub));
    onUpdateFD(enAniosDesde(financialData, selectedYear, d => eliminarSub(d, mk, sub)));
    setShowDeleteModal(false); setDeleteTarget(null);
  };

  const handleRename = () => {
    if (!renameTarget) return;
    const newName = nombreSubValido(renameValue);
    if (!newName) return;
    const { mk, oldName } = renameTarget;
    if (oldName === newName) { setRenameTarget(null); return; }
    // Si el nombre nuevo convive con el actual en este año, en uno posterior o
    // en la configuración, renombrar duplicaría la entrada y pisaría sus datos.
    if (renombradoConflictivo(financialData, config, mk, oldName, newName, selectedYear)) {
      alert(tf('yaExisteEn', { nombre: newName, seccion: t[mk] || mk }));
      return;
    }
    onUpdate(configRenombrada(config, mk, oldName, newName));
    onUpdateFD(enAniosDesde(financialData, selectedYear, d => renombrarSub(d, mk, oldName, newName)));
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
                  <h3 style={{ fontSize: 28, fontWeight: 900, margin: 0, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>{profileName || t.usuario}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
                    <span className={`badge ${user?.isAdmin ? 'badge-accent' : 'badge-ghost'}`} style={{ padding: '4px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700 }}>
                      {user?.isAdmin ? t.rolAdministrador : t.rolUsuario}
                    </span>
                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--text-muted)' }} />
                    <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>{user?.email}</span>
                  </div>
                </div>
                {!isEditingProfile && (
                  <button className="btn btn-ghost" onClick={() => setIsEditingProfile(true)}>
                    <Ic d={PATHS.settings} size={14} /> {t.editarPerfil}
                  </button>
                )}
              </div>
            </div>

            {isEditingProfile ? (
              <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40 }} className="fade-in">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div style={{ background: 'var(--bg-input)', padding: 20, borderRadius: 16, border: '1px solid var(--border)' }}>
                    <label style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 800, marginBottom: 16, display: 'block', letterSpacing: '0.05em' }}>{t.informacionBasica}</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div>
                        <label style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, display: 'block' }}>{t.nombrePublico}</label>
                        <input
                          className="text-input"
                          value={profileName}
                          onChange={e => setProfileName(e.target.value)}
                          style={{ height: 46, background: 'var(--bg-card)', fontSize: 14, fontWeight: 600, borderRadius: 10 }}
                          placeholder={t.ejNombre}
                        />
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button className="btn btn-ghost" style={{ flex: 1, height: 50 }} onClick={() => setIsEditingProfile(false)}>{t.cancel}</button>
                    <button
                      className="btn btn-primary"
                      style={{ flex: 2, height: 50, justifyContent: 'center' }}
                      onClick={handleSaveProfile}
                    >
                      <Ic d="M5 13l4 4L19 7" size={20} /> {t.guardarPerfil}
                    </button>
                  </div>
                </div>

                <div style={{ background: 'var(--bg-input)', padding: 20, borderRadius: 16, border: '1px solid var(--border)' }}>
                  <label style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 800, marginBottom: 16, display: 'block', letterSpacing: '0.05em' }}>{t.personalizarAvatar}</label>
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
                  <Negrita texto={t.pulsaEditarPerfil} />
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

        {/* Suscripción */}
        <div className="card">
          <div className="chart-card-title">{t.susTitulo}</div>
          {avisoPago && (
            <div style={{ marginBottom: 14, padding: '10px 14px', borderRadius: 10, fontSize: 13, background: avisoPago === 'ok' ? 'rgba(16,185,129,.10)' : 'var(--bg-secondary)', border: `1px solid ${avisoPago === 'ok' ? 'rgba(16,185,129,.45)' : 'var(--border)'}` }}>
              {avisoPago === 'ok' ? `✅ ${t.susPagoOk}` : t.susPagoCancelado}
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 220 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: sus.color }}>{sus.texto}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.5 }}>{t.susIncluye}</div>
              {sus.clave === 'prueba' && <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 6 }}>{t.susPruebaNota}</div>}
              {['activa', 'cancelando', 'impago'].includes(sus.clave) && <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 6 }}>{t.susGestionarAyuda}</div>}
            </div>
            <div style={{ textAlign: 'right' }}>
              {!user?.isAdmin && <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 8 }}>{t.precioMes}</div>}
              <BotonesSuscripcion user={user} />
            </div>
          </div>
          {!user?.isAdmin && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 12 }}>🔒 {t.susSeguro}</div>}
        </div>

        {/* Gestión de Secciones */}
        <div className="card">
          <div className="chart-card-title">{t.visibilidadSecciones}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>{t.visibilidadSeccionesDesc}</div>
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
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{t[p.id]}</div>
                    <div style={{ fontSize: 10, opacity: 0.7 }}>{isVisible ? t.visible : t.oculto}</div>
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

          <div className="chart-card-title" style={{ marginTop: 32 }}>{t.categoriasPresupuestoVisibles}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>{t.categoriasPresupuestoDesc}</div>
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
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{t[section] || section}</div>
                    <div style={{ fontSize: 10, opacity: 0.7 }}>{isVisible ? t.mostrar : t.ocultarMayus}</div>
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
                  <Ic d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" size={12} /> {t.lanzarTutorial}
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
                <option value={0}>{t.automaticoAnio}</option>
                {Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - 1 + i).map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>
                {t.aniosNuevosAyuda}
              </div>
            </div>
          </div>
        </div>

        {/* Category manager */}
        <div className="card">
          <div className="chart-card-title">{t.categoryManager} <span style={{ color: 'var(--accent)', fontWeight: 800 }}>({selectedYear} ➝)</span></div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>
            <Negrita texto={tf('modificaCategoriasPara', { year: selectedYear })} /> {t.usaSelectorAnio}
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
              <div className="modal-title">{t.addSubcategory} "{t[modalMainCat] || modalMainCat}"</div>
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
              <div className="modal-title">{tf('renombrar', { nombre: renameTarget.oldName })}</div>
              <input className="text-input" value={renameValue} onChange={e => setRenameValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleRename()} autoFocus />
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>{t.seModificaraEn}</div>
              <div className="modal-actions">
                <button className="btn btn-ghost" onClick={() => setRenameTarget(null)}>{t.cancel}</button>
                <button className="btn btn-primary" onClick={handleRename}>{t.guardar}</button>
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
                <Negrita texto={tf('eliminarSub', { sub: deleteTarget?.sub })} estilo={{ color: 'var(--red)' }} /><br />
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
  const { t, tf, theme } = useApp();
  const isDark = theme === 'dark';
  const tooltipStyle = { backgroundColor: isDark ? '#1e2130' : '#fff', border: `1px solid ${isDark ? '#2d3148' : '#e2e5f0'}`, borderRadius: 8, fontSize: 12 };
  const axisColor = isDark ? '#565d80' : '#9098b8';
  const gridColor = isDark ? '#2d3148' : '#e2e5f0';

  const [form, setForm] = useState({ date: hoyLocal(), asset: '', action: 'COMPRA', type: 'Long', price: '', amount: '', fees: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    // Sin fecha, el orden cronológico (del que dependen precio medio y PnL) se rompía.
    if (!form.date || isNaN(new Date(form.date).getTime())) { alert(t.indicaFecha); return; }
    if (!form.asset.trim() || !form.price || !form.amount) { alert(t.indicaActivo); return; }
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
          <div className="card-title">{t.resultadoNeto}</div>
          <div className={`card-value ${stats.profit >= 0 ? 'green' : 'red'}`}>{fmt(stats.profit)}</div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{tf('brutoComis', { bruto: fmt(stats.gross), comis: fmt(stats.fees) })}</div>
        </div>
        <div className="card">
          <div className="card-title">{t.estadisticas}</div>
          <div className="card-value blue">{stats.wins}W - {stats.losses}L</div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{t.ratio}: {stats.total > 0 ? (stats.wins / (stats.wins + stats.losses || 1) * 100).toFixed(1) : 0}%</div>
        </div>
        <div className="card">
          <div className="card-title">{t.posicionesAbiertas}</div>
          <div className="card-value">{stats.openPositions}</div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{tf('deTransacciones', { n: stats.total })}</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="chart-card" style={{ height: 300 }}>
          <div className="chart-card-title">{t.curvaEquidad}</div>
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
          <div className="chart-card-title">{t.posicionesActuales}</div>
          <div className="table-wrap" style={{ height: '80%', overflow: 'auto' }}>
            <table style={{ fontSize: 11 }}>
              <thead><tr><th>{t.activo}</th><th>{t.tipo}</th><th className="text-right">{t.cantidad}</th><th className="text-right">{t.precioAvg}</th></tr></thead>
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
        <div className="chart-card-title">{t.nuevaOperacion}</div>
        <form onSubmit={handleAdd} className="trading-form" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))' }}>
          <div><label>{t.date}</label><input type="date" className="date-input" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
          <div><label>{t.activo}</label><input type="text" className="text-input" placeholder="BTC/USDT" value={form.asset} onChange={e => setForm({ ...form, asset: e.target.value })} /></div>
          <div><label>{t.accion}</label>
            <select className="select-input" value={form.action} onChange={e => setForm({ ...form, action: e.target.value })}>
              <option value="COMPRA">{t.COMPRA}</option><option value="VENTA">{t.VENTA}</option>
            </select>
          </div>
          <div><label>{t.direccion}</label>
            <select className="select-input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
              <option>Long</option><option>Short</option>
            </select>
          </div>
          <div><label>{t.precio}</label><input type="number" step="any" className="number-input" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} /></div>
          <div><label>{t.cantidad}</label><input type="number" step="any" className="number-input" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} /></div>
          <div><label>{t.comisiones}</label><input type="number" step="any" className="number-input" value={form.fees} onChange={e => setForm({ ...form, fees: e.target.value })} /></div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', height: 42 }}>{t.add}</button>
        </form>
      </div>

      <div className="card">
        <div className="chart-card-title">{t.historialOperaciones}</div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{t.date}</th>
                <th>{t.activo}</th>
                <th>{t.accion}</th>
                <th>{t.tipo}</th>
                <th className="text-right">{t.cantidad}</th>
                <th className="text-right">{t.precio}</th>
                <th className="text-center">{t.actions}</th>
              </tr>
            </thead>
            <tbody>
              {sortedTrades.map(op => (
                <tr key={op.id}>
                  <td style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{op.date}</td>
                  <td style={{ fontWeight: 700 }}>{op.asset}</td>
                  <td><span style={{ fontSize: 10, fontWeight: 800, color: op.action === 'COMPRA' ? 'var(--green)' : 'var(--blue)' }}>{t[op.action] || op.action}</span></td>
                  <td><span className={op.type === 'Long' ? 'trading-badge-long' : 'trading-badge-short'}>{op.type.toUpperCase()}</span></td>
                  <td className="text-right">{op.amount}</td>
                  <td className="text-right">{fmt(op.price)}</td>
                  <td className="text-center">
                    <button className="btn btn-icon btn-danger" onClick={() => handleDelete(op.id)}><Ic d={PATHS.trash} size={14} /></button>
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

// ─── MANAGEMENT VIEW (CRUD + ANALYTICS) ─────────────────────────────────────────
// Estado de un usuario para el panel de gestión.
const estadoUsuarioAdmin = (u, ahora) => {
  if (u.isAdmin) return 'admin';
  if (u.bloqueado) return 'bloqueado';
  if ((u.paidUntil || 0) > ahora) return u.stripeStatus === 'past_due' ? 'impago' : (u.cancelAtPeriodEnd ? 'cancelando' : 'pago');
  if ((u.trialEndsAt || 0) > ahora) return 'prueba';
  return 'caducado';
};
const COLOR_ESTADO_ADMIN = { admin: 'var(--accent)', pago: 'var(--green)', cancelando: 'var(--yellow)', impago: 'var(--red)', prueba: 'var(--blue)', caducado: 'var(--text-muted)', bloqueado: 'var(--red)' };

function UserManagementView() {
  const { t, tf, locale } = useApp();
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [systemErrors, setSystemErrors] = useState([]);
  const [eventosStripe, setEventosStripe] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [filtro, setFiltro] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [stripe, setStripe] = useState({ datos: null, cargando: false, error: null });
  const [uidCopiado, setUidCopiado] = useState(false);

  useEffect(() => {
    // Eventos del webhook de Stripe (solo lectura; los escribe la Cloud Function).
    const unsubEventos = onSnapshot(query(collection(db, 'eventos_stripe'), orderBy('procesado', 'desc'), limit(20)),
      (snap) => setEventosStripe(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
      (err) => console.warn('Eventos de Stripe no disponibles:', err?.message));
    return () => unsubEventos();
  }, []);

  useEffect(() => {
    // Usuarios en tiempo real (solo Firestore: la lista antigua de localStorage ya no existe).
    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      setUsers(snap.docs.map(doc => ({ uid: doc.id, ...doc.data() })));
    }, (err) => {
      console.error(err);
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
    const dayStr = d.toLocaleDateString(locale, { day: '2-digit', month: 'short' });
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

  // ─── Suscripciones: estado de cada usuario, KPIs, filtros ─────────────────
  const fechaCorta = (ms) => ms ? new Date(ms).toLocaleDateString(locale) : t.admSinFecha;
  const estadoDe = (u) => estadoUsuarioAdmin(u, now);
  const etiquetaEstado = (u) => {
    const e = estadoDe(u);
    if (e === 'cancelando') return tf('admEstadoCancelando', { fecha: fechaCorta((u.paidUntil || 0) - GRACIA_MS) });
    return { admin: t.admEstadoAdmin, pago: t.admEstadoPago, impago: t.admEstadoImpago, prueba: t.admEstadoPrueba, caducado: t.admEstadoCaducado, bloqueado: t.admEstadoBloqueado }[e] || e;
  };
  const ultimoAcceso = (u) => { const l = logs.filter(x => x.uid === u.uid).sort((a, b) => (b.lastSeen || 0) - (a.lastSeen || 0))[0]; return l?.lastSeen ? new Date(l.lastSeen).toLocaleDateString(locale) : t.admNunca; };
  const cuenta = (estado) => users.filter(u => estadoDe(u) === estado).length;
  const dePago = users.filter(u => ['pago', 'cancelando', 'impago'].includes(estadoDe(u))).length;
  const kpis = [
    { id: 'todos', label: t.admUsuarios, valor: users.length, color: 'var(--text-primary)' },
    { id: 'prueba', label: t.admEnPrueba, valor: cuenta('prueba'), color: 'var(--blue)' },
    { id: 'pago', label: t.admDePago, valor: dePago, color: 'var(--green)' },
    { id: 'caducado', label: t.admCaducados, valor: cuenta('caducado'), color: 'var(--text-muted)' },
    { id: 'bloqueado', label: t.admBloqueados, valor: cuenta('bloqueado'), color: 'var(--red)' },
    { id: 'admin', label: t.admFiltroAdmin, valor: cuenta('admin'), color: 'var(--accent)' }
  ];
  const coincideFiltro = (u) => filtro === 'todos' || (filtro === 'pago' ? ['pago', 'cancelando', 'impago'].includes(estadoDe(u)) : estadoDe(u) === filtro);
  const coincideBusqueda = (u) => { const q = busqueda.trim().toLowerCase(); return !q || String(u.displayName || '').toLowerCase().includes(q) || String(u.email || '').toLowerCase().includes(q) || String(u.uid || '').toLowerCase().includes(q); };
  const usuariosFiltrados = users.filter(u => coincideFiltro(u) && coincideBusqueda(u));
  const miUid = auth?.currentUser?.uid || '';
  const copiarUid = async () => { try { await navigator.clipboard.writeText(miUid); setUidCopiado(true); setTimeout(() => setUidCopiado(false), 2000); } catch { /* sin portapapeles */ } };

  const cargarStripe = async () => {
    setStripe({ datos: null, cargando: true, error: null });
    try {
      setStripe({ datos: await resumenStripe(), cargando: false, error: null });
    } catch (e) {
      console.error('Resumen de Stripe:', e);
      setStripe({ datos: null, cargando: false, error: stripeNoConfigurado(e) ? t.admStripeNoConfigurado : tf('admStripeError', { msg: e?.message || '' }) });
    }
  };
  const fmtImporte = (v, moneda) => v == null ? '—' : v.toLocaleString(locale, { style: 'currency', currency: (moneda || 'eur').toUpperCase() });

  const exportCSV = () => {
    const headers = [t.csvUsuario, t.csvEmail, t.csvInicio, t.csvFin, t.csvDuracion];
    const rows = logs.map(l => [
      users.find(u => u.uid === l.uid)?.displayName || t.desconocido,
      l.email,
      // Los registros antiguos no tienen `start`: se estima restando el tiempo acumulado.
      new Date(l.start || ((l.lastSeen || 0) - (l.totalTime || 0))).toLocaleString(locale),
      l.end ? new Date(l.end).toLocaleString(locale) : t.sesionActiva,
      Math.round((l.totalTime || 0) / 60000)
    ]);
    // Cada campo entrecomillado: las fechas ("3/11/2026, 10:15:30") y algunos
    // nombres llevan coma y desalineaban las columnas.
    const campo = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const csvContent = [headers.map(campo).join(','), ...rows.map(r => r.map(campo).join(','))].join('\n');
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
      alert(tf('errorGuardarUsuario', { msg: err.message }));
    }
  };

  // Desde el navegador no se puede borrar una cuenta de Firebase Auth, y borrar
  // solo el documento dejaba al usuario entrar de nuevo con una prueba gratuita
  // nueva. En su lugar se bloquea: conserva la lectura de sus datos (RGPD) pero
  // las reglas le deniegan cualquier escritura.
  const handleBloqueo = async (u) => {
    if (u.isAdmin || u.uid === auth?.currentUser?.uid) return alert(t.noBloquearAdmin);
    const bloquear = !u.bloqueado;
    const nombre = u.displayName || u.email || u.uid;
    if (!window.confirm(bloquear ? tf('bloquearConfirm', { nombre }) : tf('desbloquearConfirm', { nombre }))) return;
    try {
      await setDoc(doc(db, 'users', u.uid), { bloqueado: bloquear, lastUpdated: Date.now() }, { merge: true });
    } catch (err) {
      alert(tf('errorActualizarUsuario', { msg: err.message }));
    }
  };

  // Se renderiza como función (no como componente): un componente definido dentro
  // del render es un tipo nuevo en cada render y React desmontaba el formulario
  // con cada snapshot (cada latido de otro usuario), perdiendo lo que el admin
  // estaba escribiendo.
  const renderUserForm = (u, onCancel) => (
    <div className="card fade-in" style={{ marginBottom: 20, border: '1px solid var(--accent)' }}>
      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 10px 0' }}>{t.datosCuenta}</h3>
            <div><label className="login-label">{t.nombre}</label><input name="name" className="text-input" defaultValue={u?.displayName} required /></div>
            <div><label className="login-label">{t.email}</label><input type="email" className="text-input" value={u?.email || ''} readOnly disabled title={t.emailGestionadoAuth} /></div>
            {/* Campo de contraseña eliminado: mostraba en claro la contraseña
                almacenada. Firebase Auth custodia las credenciales. */}
            <div>
              <label className="login-label">{t.pagadoHasta}</label>
              <input
                name="paidUntil"
                type="date"
                className="text-input"
                defaultValue={u?.paidUntil ? fechaISO(new Date(u.paidUntil)) : ''}
              />
              <div style={{ fontSize: 11, opacity: .65, marginTop: 4 }}>
                {u?.trialEndsAt
                  ? tf('pruebaHasta', { fecha: new Date(u.trialEndsAt).toLocaleDateString(locale) })
                  : t.sinPrueba}
                {t.dejaloVacio}
              </div>
            </div>
            <div><label className="login-label">{t.rolGlobal}</label>
              <select name="role" className="select-input" defaultValue={u?.isAdmin ? 'admin' : 'user'}>
                <option value="user">{t.rolUsuarioPermisos}</option>
                <option value="admin">{t.rolAdminTodo}</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 10px 0' }}>{t.permisosEspecificos}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {PERMISSIONS.map(p => (
                <label key={p.id} className="permission-toggle">
                  <input type="checkbox" name={`perm_${p.id}`} defaultChecked={u ? u.permissions?.includes(p.id) : true} />
                  <span>{t[p.id]}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 12, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
          <button type="button" className="btn btn-ghost" onClick={onCancel}>{t.cancel}</button>
          <button type="submit" className="btn btn-primary">{t.guardarCambios}</button>
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
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>{t.estadoRealtime}</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="pulse-dot"></span> {onlineUsers.length} <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--text-secondary)' }}>{t.usuariosHoy}</span>
          </div>
          <div style={{ position: 'absolute', right: -10, bottom: -10, opacity: 0.1 }}><Ic d={PATHS.users} size={80} /></div>
        </div>

        <div className="card" style={{ padding: '24px', background: 'var(--bg-secondary)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 12 }}>{t.historicoTrafico}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ textAlign: 'center' }}><div style={{ fontSize: 18, fontWeight: 800 }}>{stats7d}</div><div style={{ fontSize: 9, color: 'var(--text-muted)' }}>{t.dias7}</div></div>
            <div style={{ textAlign: 'center' }}><div style={{ fontSize: 18, fontWeight: 800 }}>{stats30d}</div><div style={{ fontSize: 9, color: 'var(--text-muted)' }}>{t.dias30}</div></div>
            <div style={{ textAlign: 'center' }}><div style={{ fontSize: 18, fontWeight: 800 }}>{stats90d}</div><div style={{ fontSize: 9, color: 'var(--text-muted)' }}>{t.dias90}</div></div>
            <div style={{ textAlign: 'center', color: 'var(--accent)' }}><div style={{ fontSize: 18, fontWeight: 800 }}>{stats365d}</div><div style={{ fontSize: 9 }}>{String(t.annual).toUpperCase()}</div></div>
          </div>
        </div>

        <div className="card" style={{ padding: '24px', display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={exportCSV} style={{ padding: '12px 20px', fontSize: 14 }}>
            <Ic d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" size={18} />
            {t.exportarCsv}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24, marginBottom: 32 }}>
        <div className="card" style={{ height: 350 }}>
          <div className="chart-card-title">{t.tendenciaActividad}</div>
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
          <div className="chart-card-title">{t.rankingEngagement}</div>
          <div className="table-wrap">
            <table style={{ marginTop: 10 }}>
              <thead>
                <tr>
                  <th style={{ background: 'transparent' }}>{t.usuario}</th>
                  <th className="text-center" style={{ background: 'transparent' }}>{t.sesiones}</th>
                  <th className="text-right" style={{ background: 'transparent' }}>{t.tiempoTotal}</th>
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
                    <td className="text-right" style={{ color: 'var(--text-secondary)' }}>{ua.time} {t.min}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ─── Suscripciones: KPIs ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14, marginBottom: 24 }}>
        {kpis.map(k => (
          <button key={k.id} onClick={() => setFiltro(k.id)} className="card" style={{ textAlign: 'left', cursor: 'pointer', padding: '16px 18px', border: filtro === k.id ? `1px solid ${k.color}` : '1px solid var(--border)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{k.label}</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: k.color, marginTop: 4 }}>{k.valor}</div>
          </button>
        ))}
        <div className="card" style={{ padding: '16px 18px', borderLeft: '4px solid var(--green)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{t.admMrr}</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: 'var(--green)', marginTop: 4 }}>{(dePago * PRECIO_MENSUAL).toLocaleString(locale, { style: 'currency', currency: MONEDA_PRECIO })}</div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{tf('admMrrAyuda', { n: dePago, precio: t.precioMes })}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 24, marginBottom: 32 }}>
        {/* ─── Acceso de administrador ─── */}
        <div className="card">
          <div className="chart-card-title">🛡️ {t.admAcceso}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.55, marginBottom: 14 }}>{t.admAccesoDesc}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', padding: '10px 12px', background: 'var(--bg-secondary)', borderRadius: 10, border: '1px solid var(--border)' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>{t.admTuUid}</span>
            <code style={{ fontSize: 12, flex: 1, minWidth: 160, wordBreak: 'break-all' }}>{miUid}</code>
            <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: 11 }} onClick={copiarUid}>{uidCopiado ? `✓ ${t.admCopiado}` : t.admCopiar}</button>
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', margin: '16px 0 8px' }}>{t.admAdmins}</div>
          {users.filter(u => u.isAdmin).map(u => (
            <div key={u.uid} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, fontSize: 12, padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
              <span><b>{u.displayName}</b> <span style={{ color: 'var(--text-secondary)' }}>{u.email}</span></span>
              <code style={{ color: 'var(--text-muted)', fontSize: 11 }}>{u.uid === miUid ? '★ ' : ''}{u.uid}</code>
            </div>
          ))}
        </div>

        {/* ─── Resumen de Stripe ─── */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <div className="chart-card-title" style={{ marginBottom: 0 }}>💳 {t.admResumenStripe}</div>
            <button className="btn btn-ghost" style={{ fontSize: 12 }} disabled={stripe.cargando} onClick={cargarStripe}>{stripe.cargando ? t.admCargando : (stripe.datos ? t.admActualizar : t.admCargarStripe)}</button>
          </div>
          {stripe.error && <div style={{ marginTop: 12, fontSize: 12, color: 'var(--red)' }}>{stripe.error}</div>}
          {stripe.datos && (
            <div style={{ marginTop: 14 }}>
              <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', fontSize: 12, marginBottom: 10 }}>
                <span className={`badge ${stripe.datos.modoPrueba ? 'badge-ghost' : 'badge-green'}`}>{stripe.datos.modoPrueba ? t.admModoPrueba : t.admEnVivo}</span>
                <span>{t.admActivas}: <b>{stripe.datos.activas}</b></span>
                <span>{t.admMrrReal}: <b style={{ color: 'var(--green)' }}>{fmtImporte(stripe.datos.mrr, 'eur')}</b></span>
                <span style={{ color: 'var(--text-muted)' }}>{tf('admConsultado', { hora: new Date(stripe.datos.consultado).toLocaleTimeString(locale) })}</span>
              </div>
              <div className="table-wrap" style={{ maxHeight: 260, overflowY: 'auto' }}>
                <table style={{ fontSize: 12 }}>
                  <thead><tr><th>{t.usuario}</th><th>{t.admEstado}</th><th className="text-right">{t.admImporte}</th><th className="text-right">{t.admRenovacion}</th></tr></thead>
                  <tbody>
                    {stripe.datos.suscripciones.length === 0 && <tr><td colSpan={4} className="text-center" style={{ padding: 16, color: 'var(--text-muted)' }}>{t.admStripeSin}</td></tr>}
                    {stripe.datos.suscripciones.map(s => (
                      <tr key={s.id}>
                        <td>{users.find(u => u.uid === s.uid)?.displayName || s.email || s.id}<div style={{ color: 'var(--text-muted)', fontSize: 11 }}>{s.email}</div></td>
                        <td><span className="badge badge-ghost" style={{ color: ['active', 'trialing'].includes(s.estado) ? 'var(--green)' : s.estado === 'past_due' ? 'var(--red)' : 'var(--text-muted)' }}>{s.estado}{s.cancelaAlFinal ? ' · ' + t.admCancelacion.toLowerCase() : ''}</span></td>
                        <td className="text-right">{fmtImporte(s.importe, s.moneda)}{s.intervalo ? ` / ${s.intervalo}` : ''}</td>
                        <td className="text-right">{s.renueva ? new Date(s.renueva).toLocaleDateString(locale) : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', margin: '18px 0 8px' }}>{t.admEventos}</div>
          {eventosStripe.length === 0 ? <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t.admSinEventos}</div> : (
            <div className="table-wrap" style={{ maxHeight: 200, overflowY: 'auto' }}>
              <table style={{ fontSize: 11 }}>
                <thead><tr><th>{t.admFecha}</th><th>{t.admTipo}</th><th>{t.usuario}</th></tr></thead>
                <tbody>
                  {eventosStripe.map(ev => (
                    <tr key={ev.id}>
                      <td style={{ whiteSpace: 'nowrap', color: 'var(--text-muted)' }}>{new Date(ev.procesado || ev.creado).toLocaleString(locale)}</td>
                      <td><code>{ev.tipo}</code>{ev.modoPrueba && <span className="badge badge-ghost" style={{ marginLeft: 6, fontSize: 9 }}>test</span>}</td>
                      <td>{users.find(u => u.uid === ev.uid)?.displayName || ev.uid || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>{t.usuariosSistema}</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '4px 0 0' }}>{t.gestionIdentidades}</p>
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', maxWidth: 360, textAlign: 'right' }}>
          {t.cuentasSeCrean}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 16 }}>
        <input className="text-input" style={{ maxWidth: 320, height: 40 }} placeholder={t.admBuscar} value={busqueda} onChange={e => setBusqueda(e.target.value)} />
        <div className="settings-toggle" style={{ flexWrap: 'wrap' }}>
          {kpis.map(k => <button key={k.id} className={`settings-toggle-btn ${filtro === k.id ? 'active' : ''}`} onClick={() => setFiltro(k.id)}>{k.id === 'todos' ? t.admFiltroTodos : k.label} ({k.valor})</button>)}
        </div>
      </div>

      {editingUser && renderUserForm(editingUser, () => setEditingUser(null))}

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{t.usuario}</th>
                <th>{t.admEstado}</th>
                <th>{t.rolPermisos}</th>
                <th className="text-center">{t.actions}</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.map(u => (
                <tr key={u.uid}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{u.displayName}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{u.email}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: 10 }}>{t.admUltimoAcceso}: {ultimoAcceso(u)}</div>
                  </td>
                  <td>
                    <span className="badge badge-ghost" style={{ color: COLOR_ESTADO_ADMIN[estadoDe(u)], borderColor: COLOR_ESTADO_ADMIN[estadoDe(u)], fontSize: 10 }}>{etiquetaEstado(u)}</span>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                      {u.isAdmin ? '' : (u.paidUntil || 0) > now ? tf('admPagadoHasta', { fecha: fechaCorta(u.paidUntil) }) : (u.trialEndsAt ? tf('admPruebaHasta', { fecha: fechaCorta(u.trialEndsAt) }) : t.admSinFecha)}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Stripe: {u.stripeStatus ? <code>{u.stripeStatus}</code> : t.admStripeSin}</div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {u.isAdmin ? (
                        <span className="badge badge-accent" style={{ fontSize: 9 }}>{t.adminTotal}</span>
                      ) : (
                        (u.permissions || []).map(pId => {
                          const p = PERMISSIONS.find(px => px.id === pId);
                          return <span key={pId} className="badge badge-ghost" style={{ fontSize: 9, opacity: 0.8 }}>{p ? t[p.id] : pId}</span>;
                        })
                      )}
                      {(!u.isAdmin && (!u.permissions || u.permissions.length === 0)) && (
                        <span style={{ fontSize: 11, color: 'var(--red)', fontStyle: 'italic' }}>{t.sinAccesos}</span>
                      )}
                      {u.bloqueado && (
                        <span className="badge" style={{ fontSize: 9, background: 'var(--red)', color: 'white' }}>{t.bloqueado}</span>
                      )}
                    </div>
                  </td>
                  <td className="text-center">
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                      <button className="btn btn-icon" title={t.editar} onClick={() => setEditingUser(u)}>
                        <Ic d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" size={14} />
                      </button>
                      {!u.isAdmin && (
                        <button className={`btn btn-icon ${u.bloqueado ? 'btn-primary' : 'btn-danger'}`} title={u.bloqueado ? t.desbloquear : t.bloquear} onClick={() => handleBloqueo(u)}>
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
          <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: 'var(--red)' }}>{t.auditoriaErrores}</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '4px 0 0' }}>{t.auditoriaErroresDesc}</p>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {systemErrors.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>{t.sinErrores}</div>
        ) : (
          <div className="table-wrap" style={{ maxHeight: 300, overflowY: 'auto' }}>
            <table style={{ margin: 0 }}>
              <thead>
                <tr>
                  <th style={{ background: 'var(--bg-secondary)' }}>{t.fechaHora}</th>
                  <th style={{ background: 'var(--bg-secondary)' }}>{t.operacion}</th>
                  <th style={{ background: 'var(--bg-secondary)' }}>{t.mensajeError}</th>
                  <th style={{ background: 'var(--bg-secondary)', textAlign: 'right' }}>{t.afectado}</th>
                </tr>
              </thead>
              <tbody>
                {systemErrors.map(err => {
                  const affectedUser = users.find(u => u.uid === err.uid);
                  return (
                    <tr key={err.id}>
                      <td style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                        {new Date(err.timestamp).toLocaleString(locale)}
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