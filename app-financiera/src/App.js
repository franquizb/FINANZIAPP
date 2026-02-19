// App.js — App Financiera (localStorage, sin Firebase, sin IA)
import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Login from './Login';
import LandingPage from './LandingPage';
import { AppProvider, useApp } from './context/AppContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line,
  AreaChart, Area, Brush
} from 'recharts';
import TutorialWizard from './components/TutorialWizard';
import { db, auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot, collection, query, addDoc, updateDoc, deleteDoc, getDocs } from 'firebase/firestore';

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

const getLoanValues = (loan, year, monthIdx) => {
  if (!loan || !loan.startDate) return { installment: 0, balance: 0, active: false };
  const start = new Date(loan.startDate);
  const current = new Date(year, monthIdx, 1);
  const diffMonths = (current.getFullYear() - start.getFullYear()) * 12 + (current.getMonth() - start.getMonth());

  if (diffMonths < 0 || diffMonths >= loan.installmentsCount) return { installment: 0, balance: 0, active: false };

  let pending = loan.totalAmount;
  const i = (loan.interestRate / 100) / 12;
  const inst = loan.amount || 0;

  for (let n = 0; n <= diffMonths; n++) {
    const interest = pending * i;
    const principal = inst - interest;
    if (n === diffMonths) return { installment: inst, balance: pending, active: true };
    pending -= principal;
  }
  return { installment: 0, balance: 0, active: false };
};

const isLoanFullYear = (loan, year) => {
  const start = new Date(loan.startDate);
  const end = new Date(loan.endDate);
  const yearStart = new Date(year, 0, 1);
  const yearEnd = new Date(year, 11, 31);
  return start <= yearStart && end >= yearEnd;
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

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/" element={<AppInner isHome />} />
          <Route path="/login" element={<AppInner />} />
          <Route path="/register" element={<AppInner />} />
          <Route path="/app/*" element={<AppInner />} />
          <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
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
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedYear, setSelectedYear] = useState(defaultStartYear);
  const [selectedMonth, setSelectedMonth] = useState(months[new Date().getMonth()]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dashboardMode, setDashboardMode] = useState('charts');
  const [budgetLocked, setBudgetLocked] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);

  const handleLogin = (u) => {
    setUser(u); setConfig(null); setFinancialData(null); setLoading(true); setError(null); setBudgetLocked(true);
    navigate('/app/dashboard');
  };

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Restaurar sesión desde Firebase
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        const userData = userDoc.exists() ? userDoc.data() : {};
        const isAdmin = firebaseUser.email === 'brianantigua@gmail.com' || userData.isAdmin;
        const sessionUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: userData.displayName || firebaseUser.displayName || firebaseUser.email.split('@')[0],
          isAdmin: isAdmin,
          permissions: isAdmin ? PERMISSIONS.map(p => p.id) : (userData.permissions || ['dashboard', 'monthly', 'networth', 'loans', 'trading', 'analysis', 'settings'])
        };
        setUser(sessionUser);
        localStorage.setItem('currentUser', JSON.stringify(sessionUser));
      } else {
        // No hay sesión en Firebase
        if (!localStorage.getItem('currentUser')) {
          setUser(null);
        }
      }
    });
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (user && (window.location.pathname === '/login' || window.location.pathname === '/register' || window.location.pathname === '/')) {
      navigate('/app/dashboard');
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
      const configSnap = await getDoc(configRef);
      const dataSnap = await getDoc(dataRef);
      if (!configSnap.exists() || !dataSnap.exists()) {
        const localConfig = localDB.get(`users_${userId}_config`);
        const localData = localDB.get(`users_${userId}_data`);
        if (localConfig && !configSnap.exists()) await setDoc(configRef, localConfig);
        if (localData && !dataSnap.exists()) await setDoc(dataRef, localData);
      }
    };
    migrateIfNecessary();

    // Listen for real-time updates for Config
    const unsubConfig = onSnapshot(configRef, (snap) => {
      if (snap.exists()) {
        const savedConfig = snap.data();
        const currentConfig = {
          tutorialCompleted: savedConfig?.tutorialCompleted || false,
          defaultYear: savedConfig?.defaultYear || defaultStartYear,
          categories: savedConfig?.categories || JSON.parse(JSON.stringify(initialCategories)),
          visibleViews: savedConfig?.visibleViews || ['dashboard', 'monthly', 'networth', 'loans', 'trading', 'analysis', 'settings', 'users'],
          visibleBudgetSections: savedConfig?.visibleBudgetSections || ["Ingresos", "Gastos Esenciales", "Gastos Discrecionales", "Pago de Deudas", "Ahorro e Inversión"]
        };
        setConfig(currentConfig);
        if (!currentConfig.tutorialCompleted) setShowTutorial(true);
      } else {
        // Default config if none exists
        setConfig({
          tutorialCompleted: false,
          defaultYear: defaultStartYear,
          categories: JSON.parse(JSON.stringify(initialCategories)),
          visibleViews: ['dashboard', 'monthly', 'networth', 'loans', 'trading', 'analysis', 'settings', 'users'],
          visibleBudgetSections: ["Ingresos", "Gastos Esenciales", "Gastos Discrecionales", "Pago de Deudas", "Ahorro e Inversión"]
        });
      }
    });

    // Listen for real-time updates for Financial Data
    const unsubData = onSnapshot(dataRef, (snap) => {
      if (snap.exists()) {
        const fd = snap.data();
        if (!fd.loans) fd.loans = [];
        if (!fd.trading) fd.trading = [];
        setFinancialData(fd);
      }
      setLoading(false);
    }, (err) => {
      console.error("Error syncing data:", err);
      setError("Error de sincronización: " + err.message);
      setLoading(false);
    });

    // Sincronizar logs de actividad
    const logSession = async () => {
      if (!userId) return;
      try {
        const sessionKey = `session_${userId}`; // Una sola sesión activa por usuario
        const sessionRef = doc(db, 'activity_logs', sessionKey);

        await setDoc(sessionRef, {
          uid: userId,
          email: user?.email,
          displayName: user?.displayName,
          start: Date.now(), // Firestore merge:true mantendrá el 'start' original si ya existe
          lastSeen: Date.now(),
          end: null
        }, { merge: true });
      } catch (e) {
        console.error("Error logging session:", e);
      }
    };
    logSession();
    const interval = setInterval(logSession, 30000); // Latido cada 30 segundos

    return () => {
      unsubConfig();
      unsubData();
      clearInterval(interval);
    };
  }, [userId, user]);

  if (!user) {
    if (isHome) return <LandingPage />;
    return <Login onLogin={handleLogin} />;
  }

  const updateFD = async (nd) => {
    setFinancialData(nd);
    localDB.set(`users_${userId}_data`, nd);
    if (userId) {
      try {
        await setDoc(doc(db, 'users', userId, 'data', 'financial'), nd);
      } catch (e) { console.error("Error guardando en la nube:", e); }
    }
  };

  const updateCfg = async (nc) => {
    setConfig(nc);
    localDB.set(`users_${userId}_config`, nc);
    if (userId) {
      try {
        await setDoc(doc(db, 'users', userId, 'settings', 'config'), nc);
      } catch (e) { console.error("Error guardando config en la nube:", e); }
    }
  };

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
      }
    }

    const list = localDB.get('users_list') || [];
    const newList = list.map(u => u.uid === user.uid ? { ...u, ...newProfile } : u);
    localDB.set('users_list', newList);
  };

  const updateVisibleViews = (views) => {
    updateCfg({ ...config, visibleViews: views });
  };

  const signOut = () => {
    const logs = localDB.get('activity_logs') || [];
    const current = logs.find(l => l.uid === userId && !l.end);
    if (current) current.end = Date.now();
    localDB.set('activity_logs', logs);
    localStorage.removeItem('currentUser');
    setUser(null); setConfig(null); setFinancialData(null);
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
      <button className="btn btn-primary" style={{ marginTop: 24 }} onClick={() => setActiveView('dashboard')}>
        Volver al Inicio
      </button>
    </div>
  );

  return (
    <div className={`app-shell ${theme === 'light' ? 'light' : ''}`}>
      {!sidebarCollapsed && <div className="sidebar-overlay" onClick={() => setSidebarCollapsed(true)} />}
      <Sidebar activeView={activeView} setActiveView={setActiveView} onSignOut={signOut} user={user} collapsed={sidebarCollapsed} config={config} />
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
  const titles = { dashboard: t.dashboard, monthly: t.monthly, networth: t.networth, loans: t.loans, settings: t.settings, users: 'Gestión' };
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
          {Object.keys(financialData || {})
            .filter(y => !isNaN(parseInt(y)) && (parseInt(y) <= new Date().getFullYear() + 4 || Object.keys(financialData[y]?.oneTime || {}).some(k => financialData[y].oneTime[k].length > 0) || Object.keys(financialData[y]?.monthly?.enero || {}).some(k => financialData[y].monthly.enero[k]?.actual?.length > 0)))
            .map(y => <option key={y} value={y}>{y}</option>)}
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

function DashboardView({ data, year, categories, onUpdate, fullData, onUpdateCfg, config, mode, setMode, budgetLocked, setBudgetLocked, visibleBudgetSections, visibleViews }) {
  const { t, theme } = useApp();
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

  const incomeVsActual = (categories["Ingresos"] || []).map(c => {
    const budgeted = getEffectiveBudget(c, "Ingresos", year, -1, fullData, data.budget) * (monthsPassed / 12); // proportional, or full year? "datos de cantidad mensual" -> Wait, budget is monthly!
    // No, getEffectiveBudget returns monthly amount. So budget for x months is * monthsPassed.
    const budgetedTotal = getEffectiveBudget(c, "Ingresos", year, -1, fullData, data.budget) * monthsPassed;
    const actual = months.slice(0, monthsPassed).reduce((s, m) => s + calcTotal(data.monthly?.[m]?.[c]?.actual || []), 0);
    return { name: c, budgeted: budgetedTotal, actual };
  }).filter(i => i.budgeted > 0 || i.actual > 0);

  const expenseVsActual = expenseKeys.map(mk => {
    const budgetedTotal = (categories[mk] || []).reduce((s, sub) => s + getEffectiveBudget(sub, mk, year, -1, fullData, data.budget), 0) * monthsPassed;
    const actual = months.slice(0, monthsPassed).reduce((s, m, mIdx) => s + (categories[mk] || []).reduce((ss, sub) => {
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

  const totalIncomeBudgeted = (categories["Ingresos"] || []).reduce((s, sub) => s + getEffectiveBudget(sub, "Ingresos", year, -1, fullData, data.budget), 0);
  const totalExpensesBudgeted = expenseKeys.reduce((s, mk) => s + (categories[mk] || []).reduce((ss, sub) => ss + getEffectiveBudget(sub, mk, year, -1, fullData, data.budget), 0), 0);
  const remanente = totalIncomeBudgeted - totalExpensesBudgeted;

  const tradingPnL = (fullData.trading || []).reduce((s, t) => s + t.pnl, 0);
  const winRate = fullData.trading?.length > 0
    ? (fullData.trading.filter(t => t.pnl > 0).length / fullData.trading.length * 100).toFixed(1)
    : 0;

  const renderBudgetTable = (mk) => {
    const subs = categories[mk] || [];
    if (!subs.length) return null;

    const total = subs.reduce((s, sub) => s + getEffectiveBudget(sub, mk, year, -1, fullData, data.budget), 0);

    return (
      <div className={`card ${budgetLocked ? 'budget-locked' : ''}`} key={mk} style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div className="budget-header-card" style={{ backgroundColor: getCategoryColor(mk) }}>
          <span>{mk.toUpperCase()}</span>
          {!budgetLocked && (
            <button className="btn btn-icon" style={{ padding: 4, height: 24, width: 24, background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white' }}
              onClick={() => {
                const sub = prompt(`Añadir subcategoría a ${mk}:`);
                if (sub) {
                  const nc = JSON.parse(JSON.stringify(config));
                  if (!nc.categories[mk]) nc.categories[mk] = [];
                  nc.categories[mk].push(sub);
                  onUpdateCfg(nc);
                }
              }}>
              <Ic d={PATHS.plus} size={14} />
            </button>
          )}
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
                            <button className="btn btn-icon btn-danger" style={{ width: 18, height: 18, padding: 0 }}
                              onClick={() => {
                                if (window.confirm(`¿Eliminar ${sub}?`)) {
                                  const nc = JSON.parse(JSON.stringify(config));
                                  nc.categories[mk] = nc.categories[mk].filter(s => s !== sub);
                                  onUpdateCfg(nc);

                                  const nd = JSON.parse(JSON.stringify(fullData));
                                  delete nd[year].budget[sub];
                                  months.forEach(m => { if (nd[year].monthly[m]) delete nd[year].monthly[m][sub]; });
                                  onUpdate(nd);
                                }
                              }}>
                              <Ic d="M6 18L18 6M6 6l12 12" size={10} />
                            </button>
                          )}
                          <span style={{ flex: 1, cursor: budgetLocked ? 'default' : 'pointer' }}
                            title={budgetLocked ? '' : 'Click para renombrar'}
                            onClick={() => {
                              if (budgetLocked) return;
                              const newName = prompt(`Renombrar ${sub} a:`, sub);
                              if (newName && newName !== sub) {
                                const nc = JSON.parse(JSON.stringify(config));
                                nc.categories[mk] = nc.categories[mk].map(s => s === sub ? newName : s);
                                onUpdateCfg(nc);

                                const nd = JSON.parse(JSON.stringify(fullData));
                                if (nd[year].budget[sub] !== undefined) {
                                  nd[year].budget[newName] = nd[year].budget[sub];
                                  delete nd[year].budget[sub];
                                }
                                months.forEach(m => {
                                  if (nd[year].monthly[m]?.[sub]) {
                                    nd[year].monthly[m][newName] = nd[year].monthly[m][sub];
                                    delete nd[year].monthly[m][sub];
                                  }
                                });
                                onUpdate(nd);
                              }
                            }}>
                            {sub}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="text-right">
                      {isLoan ? (
                        <span style={{ fontWeight: 600, paddingRight: 4, color: 'var(--text-muted)' }}>{fmt(val)}</span>
                      ) : (
                        <input type="number" className="budget-input" value={data.budget?.[sub] || 0}
                          disabled={budgetLocked}
                          onChange={e => {
                            const v = parseFloat(e.target.value) || 0;
                            const nd = JSON.parse(JSON.stringify(fullData));
                            const yKeys = Object.keys(nd).filter(k => !isNaN(parseInt(k)) && parseInt(k) >= year);
                            yKeys.forEach(k => {
                              if (nd[k].budget && nd[k].budget[sub] !== undefined) {
                                nd[k].budget[sub] = v;
                                months.forEach(mo => { if (nd[k].monthly[mo]?.[sub]) nd[k].monthly[mo][sub].budgeted = v; });
                              }
                            });
                            onUpdate(nd);
                          }} />
                      )}
                    </td>
                  </tr>
                );
              }).filter(row => row !== null)}
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
                <select name="cat" className="select-input" required onChange={(e) => {
                  const subSelect = e.target.form.elements.sub;
                  subSelect.innerHTML = (categories[e.target.value] || []).map(s => `<option value="${s}">${s}</option>`).join('');
                }}>
                  <option value="">{t.category}</option>
                  {categoriesList.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select name="sub" className="select-input" required>
                  <option value="">{t.subCategory}</option>
                </select>
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
    const start = new Date(loan.startDate);
    const now = new Date();
    const diffMonths = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
    const passed = Math.max(0, Math.min(loan.installmentsCount, diffMonths + 1));
    const progress = (passed / loan.installmentsCount) * 100;
    return { name: loan.name, progress, passed, total: loan.installmentsCount, amount: loan.totalAmount };
  }) : [];

  // Trading data (only if trading view is visible)
  const showTrading = (visibleViews || []).includes('trading');

  // Monthly savings data
  const monthlySavingsData = monthlyTotals.map(m => ({
    name: m.name,
    savings: m.income - m.expenses,
  }));

  return (
    <div className="section-gap fade-in">
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

      {/* Charts row 1: Income vs Expenses + Expense Distribution */}
      <div className="grid-5-3">
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
              <YAxis stroke={axisColor} axisLine={false} tickLine={false} tick={{ fontSize: 11 }} tickFormatter={v => new Intl.NumberFormat('es-ES', { notation: 'compact' }).format(v)} />
              <Tooltip
                contentStyle={{ ...tooltipStyle, border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                cursor={{ stroke: 'var(--accent)', strokeWidth: 2 }}
              />
              <Legend verticalAlign="top" align="right" height={36} iconType="circle" />
              <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" name={t.income} />
              <Area type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" name={t.expenses} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
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
          ) : <div className="loading-state" style={{ height: '80%', fontSize: 12 }}>Sin datos</div>}
        </div>
      </div>

      {/* Charts row 2: Budget vs Actual Income/Expenses */}
      <div className="grid-2">
        <div className="chart-card" style={{ height: 280 }}>
          <div className="chart-card-title">{t.income}: Presupuesto vs Real ({monthsPassed} meses)</div>
          {incomeVsActual.length > 0 ? (
            <ResponsiveContainer width="100%" height="88%">
              <BarChart data={incomeVsActual} barSize={18}>
                <CartesianGrid stroke={gridColor} strokeOpacity={0.5} />
                <XAxis dataKey="name" stroke={axisColor} tick={{ fontSize: 11 }} />
                <YAxis stroke={axisColor} tick={{ fontSize: 11 }} tickFormatter={v => new Intl.NumberFormat('es-ES', { notation: 'compact' }).format(v)} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(99,102,241,0.08)' }} formatter={v => fmt(v)} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="budgeted" fill="var(--accent)" name={t.budgeted} radius={[4, 4, 0, 0]} />
                <Bar dataKey="actual" fill="var(--green)" name={t.real} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="loading-state" style={{ height: '80%', fontSize: 12 }}>Sin datos de presupuesto</div>}
        </div>
        <div className="chart-card" style={{ height: 280 }}>
          <div className="chart-card-title">{t.expenses}: Presupuesto vs Real ({monthsPassed} meses)</div>
          {expenseVsActual.length > 0 ? (
            <ResponsiveContainer width="100%" height="88%">
              <BarChart data={expenseVsActual} barSize={18}>
                <CartesianGrid stroke={gridColor} strokeOpacity={0.5} />
                <XAxis dataKey="name" stroke={axisColor} tick={{ fontSize: 11 }} />
                <YAxis stroke={axisColor} tick={{ fontSize: 11 }} tickFormatter={v => new Intl.NumberFormat('es-ES', { notation: 'compact' }).format(v)} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(99,102,241,0.08)' }} formatter={v => fmt(v)} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="budgeted" fill="var(--accent)" name={t.budgeted} radius={[4, 4, 0, 0]} />
                <Bar dataKey="actual" fill="var(--red)" name={t.real} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="loading-state" style={{ height: '80%', fontSize: 12 }}>Sin datos de presupuesto</div>}
        </div>
      </div>

      <div className="chart-card" style={{ height: 280 }}>
        <div className="chart-card-title">{t.savings} ({t.month})</div>
        <ResponsiveContainer width="100%" height="88%">
          <BarChart data={monthlySavingsData} barSize={20}>
            <CartesianGrid stroke={gridColor} strokeOpacity={0.5} />
            <XAxis dataKey="name" stroke={axisColor} tick={{ fontSize: 11 }} />
            <YAxis stroke={axisColor} tick={{ fontSize: 11 }} tickFormatter={v => new Intl.NumberFormat('es-ES', { notation: 'compact' }).format(v)} />
            <Tooltip contentStyle={tooltipStyle} formatter={v => fmt(v)} />
            <Bar dataKey="savings" name={t.savings} radius={[4, 4, 0, 0]}>
              {monthlySavingsData.map((entry, i) => (
                <Cell key={i} fill={entry.savings >= 0 ? '#10b981' : '#ef4444'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Charts row 3: Net Worth (conditional) + Loan Progress (conditional) */}
      {
        (showNetWorth || showLoans) && (
          <div className="grid-2">
            {showNetWorth && (
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
                    <YAxis stroke={axisColor} tick={{ fontSize: 11 }} tickFormatter={v => new Intl.NumberFormat('es-ES', { notation: 'compact' }).format(v)} />
                    <Tooltip contentStyle={tooltipStyle} formatter={v => fmt(v)} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Area type="monotone" dataKey={t.assets} stroke="#10b981" strokeWidth={2} fillOpacity={0} />
                    <Area type="monotone" dataKey={t.liabilities} stroke="#ef4444" strokeWidth={2} fillOpacity={0} />
                    <Area type="monotone" dataKey="nw" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorNW)" name={t.netWorth} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
            {showLoans && loansData.length > 0 && (
              <div className="chart-card" style={{ height: 280, overflow: 'auto' }}>
                <div className="chart-card-title">{t.loanProgress}</div>
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
              </div>
            )}
          </div>
        )
      }

      {/* Charts row 4: Trading (conditional) */}
      {
        showTrading && (fullData.trading || []).length > 0 && (
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
        )
      }
    </div >
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
    const subs = categories[mk] || [];
    if (!subs.length) return null;

    let totalEstimated = 0;
    let totalReal = 0;

    const rows = subs.map(sub => {
      let est = getEffectiveBudget(sub, mk, year, mIdx, fullData, budgetData);
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
          <span>{mk.toUpperCase()}</span>
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 160px 140px 100px', gap: 12, alignItems: 'end' }}>
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

  if (!data) return <div className="loading-state">{t.noData} {year}</div>;

  const handleChange = (type, cat, month, val) => {
    const nd = JSON.parse(JSON.stringify(fullData));
    const nwk = type === 'Activos' ? 'assets' : 'liabilities';
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
    return (
      <div className="card">
        <div className="chart-card-title">{type}</div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{t.category}</th>
                {months.map(m => <th key={m} className="text-right" style={{ fontSize: 10 }}>{m.substring(0, 3).toUpperCase()}</th>)}
              </tr>
            </thead>
            <tbody>
              {cats.map(cat => {
                const loan = type === 'Pasivos' && fullData.loans?.find(l => l.name === cat);
                return (
                  <tr key={cat}>
                    <td style={{ whiteSpace: 'nowrap', fontSize: 12 }}>{cat}</td>
                    {months.map((m, mIdx) => {
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
                                  if (idx !== -1 && inputs[idx + months.length]) {
                                    inputs[idx + months.length].focus();
                                    inputs[idx + months.length].select();
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

  const getAmortizationTable = (loan) => {
    const list = [];
    let pending = loan.totalAmount;
    let totalAmortized = 0;
    const i = (loan.interestRate / 100) / 12;
    const start = new Date(loan.startDate);

    for (let n = 1; n <= loan.installmentsCount; n++) {
      const interest = pending * i;
      const principal = loan.amount - interest;
      totalAmortized += principal;
      pending -= principal;

      const d = new Date(start);
      d.setMonth(start.getMonth() + n - 1);
      const mLabel = d.toLocaleString('es-ES', { month: 'long', year: 'numeric' });

      list.push({
        num: n,
        month: mLabel,
        date: d,
        fixed: loan.amount,
        interest: interest,
        principal: principal,
        totalAmortized: totalAmortized,
        pending: Math.max(0, pending)
      });
    }
    return list;
  };

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
          const start = new Date(l.startDate);
          const end = new Date(l.endDate);
          const now = new Date();
          const isFinished = now > end;

          const diffMonths = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
          const passed = Math.max(0, Math.min(l.installmentsCount, diffMonths + 1));
          const progress = (passed / l.installmentsCount) * 100;

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
                    <button className="btn btn-icon btn-ghost" onClick={() => setExpandedLoan(expandedLoan === l.id ? null : l.id)} title={t.calendar}>
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
                  <div className="loan-stat"><span className="loan-stat-label">{t.endDate}</span><span className="loan-stat-value">{l.endDate}</span></div>
                </div>

                <div className="loan-progress" style={{ marginTop: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, marginBottom: 6 }}>
                    <span>{passed} / {l.installmentsCount} {t.installments}</span>
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
    const startY = selectedYear;
    Object.keys(nfd).forEach(y => {
      if (parseInt(y) >= startY) {
        if (!nfd[y].categories) nfd[y].categories = JSON.parse(JSON.stringify(currentYearCats));
        nfd[y].categories[modalMainCat] = [...(nfd[y].categories[modalMainCat] || []), name].sort();
        if (nfd[y].budget?.[name] === undefined) nfd[y].budget[name] = 0;
        months.forEach(m => { if (!nfd[y].monthly[m]?.[name]) nfd[y].monthly[m][name] = { budgeted: 0, actual: [] }; });
      }
    });

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

    onUpdateFD(nd);
    setShowDeleteModal(false); setDeleteTarget(null);
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
            {/* Default year */}
            <div>
              <label style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 8, display: 'block' }}>{t.defaultYear}</label>
              <select className="select-input" value={config?.defaultYear || new Date().getFullYear()} onChange={e => { const nc = { ...config, defaultYear: parseInt(e.target.value) }; onUpdate(nc); }} style={{ width: '100%', maxWidth: 250, height: 46 }}>
                {Array.from({ length: 11 }, (_, i) => { const year = new Date().getFullYear(); return year + i; }).map(y => <option key={y} value={y}>{y}</option>)}
              </select>
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
            {ALL_MAIN_KEYS.concat(['Activos', 'Pasivos']).map(mk => (
              <div key={mk} style={{ borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>{mk}</span>
                  <button className="btn btn-ghost" style={{ padding: '5px 10px', fontSize: 12 }} onClick={() => { setModalMainCat(mk); setNewCatName(''); setShowModal(true); }}>
                    <Ic d={PATHS.plus} size={13} /> {t.add}
                  </button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {((financialData?.[selectedYear]?.categories || config.categories)[mk] || []).map(sub => (
                    <span key={sub} className="chip">
                      {sub}
                      <button className="chip-remove" onClick={() => { setDeleteTarget({ mk, sub }); setShowDeleteModal(true); }}>
                        <Ic d="M6 18L18 6M6 6l12 12" size={11} />
                      </button>
                    </span>
                  ))}
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

  const processed = useMemo(() => {
    const assets = {};
    let totalRealizedPnL = 0;
    let totalGrossPnL = 0;
    let totalFees = 0;
    let wins = 0;
    let losses = 0;
    const history = [];
    // Sort by date, and then by the order they were added (ts or array position)
    // Since existing trades don't have ts, we rely on the fact they are stored newest first.
    // We reverse to get oldest -> newest, then apply a stable sort by date.
    const sorted = [...trades].reverse().sort((a, b) => {
      const da = new Date(a.date);
      const db = new Date(b.date);
      if (da - db !== 0) return da - db;
      // If same date, use timestamp if available, otherwise stay in reversed order (chronological)
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

      // If position was closed, reset type to current trade's type
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
      } else { // Short
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
  }, [trades]);

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
                    <th className="text-right">{t.invested}</th>
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
  const [showAdd, setShowAdd] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Real-time users
    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      const list = snap.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
      setUsers(list);
      setLoading(false);
    });

    // Real-time logs
    const unsubLogs = onSnapshot(collection(db, 'activity_logs'), (snap) => {
      const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLogs(list);
    });

    return () => {
      unsubUsers();
      unsubLogs();
    };
  }, []);
  const now = Date.now();
  const getInPeriod = (days) => logs.filter(l => l.lastSeen > now - days * 24 * 3600 * 1000);

  const stats7d = getInPeriod(7).length;
  const stats30d = getInPeriod(30).length;
  const stats90d = getInPeriod(90).length;
  const stats365d = getInPeriod(365).length;

  const onlineUsers = users.filter(u => {
    const userLog = logs.find(l => l.uid === u.uid && !l.end);
    return userLog && (now - userLog.lastSeen) < 120000; // Activos en los últimos 2 minutos
  });

  // Chart Data: Sessions per day last 30 days
  const chartData = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const dayStr = d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
    const count = logs.filter(l => {
      const ld = new Date(l.start);
      return ld.getDate() === d.getDate() && ld.getMonth() === d.getMonth() && ld.getFullYear() === d.getFullYear();
    }).length;
    return { name: dayStr, sesiones: count };
  });

  // Calculate most active users
  const userActivity = users.map(u => {
    const uLogs = logs.filter(l => l.uid === u.uid);
    const totalTime = uLogs.reduce((acc, l) => acc + ((l.end || l.lastSeen) - l.start), 0);
    return { name: u.displayName, sessions: uLogs.length, time: Math.round(totalTime / 60000) };
  }).sort((a, b) => b.sessions - a.sessions);

  const exportCSV = () => {
    const headers = ['Usuario', 'Email', 'Inicio', 'Fin', 'Duración (min)'];
    const rows = logs.map(l => [
      users.find(u => u.uid === l.uid)?.displayName || 'Desconocido',
      l.email,
      new Date(l.start).toLocaleString(),
      l.end ? new Date(l.end).toLocaleString() : 'Sesión Activa',
      Math.round(((l.end || l.lastSeen) - l.start) / 60000)
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
    const fd = new FormData(e.target);
    const perms = PERMISSIONS.map(p => p.id).filter(id => fd.get(`perm_${id}`) === 'on');

    const uid = editingUser ? editingUser.uid : `u-${Date.now()}`;
    const userData = {
      displayName: fd.get('name'),
      email: fd.get('email').toLowerCase().trim(),
      password: fd.get('password'),
      isAdmin: fd.get('role') === 'admin',
      permissions: perms,
      lastUpdated: Date.now()
    };

    try {
      await setDoc(doc(db, 'users', uid), userData, { merge: true });
      setEditingUser(null);
      setShowAdd(false);
    } catch (err) {
      alert("Error al guardar usuario: " + err.message);
    }
  };

  const handleDelete = async (uid) => {
    if (uid === 'admin-001' || users.find(u => u.uid === uid)?.email === 'brianantigua@gmail.com') return alert('No puedes eliminar al administrador');
    if (!window.confirm('¿Eliminar usuario?')) return;
    try {
      await deleteDoc(doc(db, 'users', uid));
    } catch (err) {
      alert("Error al eliminar: " + err.message);
    }
  };

  const UserForm = ({ u, onCancel }) => (
    <div className="card fade-in" style={{ marginBottom: 20, border: '1px solid var(--accent)' }}>
      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 10px 0' }}>Datos de Cuenta</h3>
            <div><label className="login-label">Nombre</label><input name="name" className="text-input" defaultValue={u?.displayName} required /></div>
            <div><label className="login-label">Email</label><input name="email" type="email" className="text-input" defaultValue={u?.email} required /></div>
            <div><label className="login-label">Contraseña</label><input name="password" type="text" className="text-input" defaultValue={u?.password} required /></div>
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
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-ghost" onClick={() => {
            const users = localDB.get('users_list') || [];
            const currentUser = localDB.get('currentUser');
            const totalSize = (JSON.stringify(localStorage).length / 1024).toFixed(2);
            const debugInfo = {
              metadata: {
                engine: "Web Browser (LocalStorage)",
                usage: totalSize + " KB",
                lastSession: currentUser?.email
              },
              tables: {
                users_list: users,
                current_session: currentUser
              }
            };
            console.log("DATABASE INSPECTION:", debugInfo);
            alert(`--- BBDD LOCAL EN TIEMPO REAL ---\n\n` +
              `Tamaño en disco: ${totalSize} KB\n` +
              `Usuarios registrados: ${users.length}\n\n` +
              `JSON DE USUARIOS:\n${JSON.stringify(users, null, 2).slice(0, 500)}...\n\n` +
              `(El detalle completo se ha enviado a la consola del desarrollador F12 para una inspección profunda)`);
          }} style={{ fontSize: 11 }}>
            <Ic d={PATHS.lock} size={14} /> Inspeccionar BBDD
          </button>
          <button className="btn btn-primary" onClick={() => { setEditingUser(null); setShowAdd(true); }}>
            <Ic d={PATHS.plus} size={16} /> Añadir Usuario
          </button>
        </div>
      </div>

      {(showAdd || editingUser) && (
        <UserForm u={editingUser} onCancel={() => { setShowAdd(false); setEditingUser(null); }} />
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
                    </div>
                  </td>
                  <td className="text-center">
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                      <button className="btn btn-icon" onClick={() => { setEditingUser(u); setShowAdd(false); }}>
                        <Ic d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" size={14} />
                      </button>
                      {u.uid !== 'admin-001' && (
                        <button className="btn btn-icon btn-danger" onClick={() => handleDelete(u.uid)}>
                          <Ic d={PATHS.trash} size={14} />
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
    </div>
  );
}