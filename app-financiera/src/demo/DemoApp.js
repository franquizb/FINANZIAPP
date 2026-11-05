// ─── MODO DEMO (solo local, REACT_APP_DEMO=1) ───────────────────────────────
// La interfaz real de FinanziApp con datos de ejemplo y sin Firebase, para
// hacer capturas y vídeos de marketing. Parámetros de la URL:
//   v      vista: dashboard | monthly | networth | loans | trading | analysis | settings
//   modo   en monthly: seguimiento | presupuesto
//   mes    mes de Seguimiento (clave en español: enero…diciembre)
//   calc   en analysis: compuesto | hipoteca | fire | vpn | dca | intrinseco
//   menu   0 = menú lateral plegado
// El idioma y el tema se toman del contexto (localStorage appLanguage/appTheme).
import React, { useMemo, useState } from 'react';
import { useApp, setMonedaActiva } from '../context/AppContext';
import { normalizarAjustesAcceso } from '../acceso';
import Calculadoras from '../components/Calculadoras';
import { PiezasDemo } from '../App';
import { crearDemo } from './datosDemo';

export default function DemoApp() {
  const { theme, language } = useApp();
  const {
    Sidebar, Topbar, DashboardView, MonthlyView, NetWorthView, LoansView, TradingView, SettingsView,
    generateInitialYearData, normalizarConfig, VERSION_DATOS, months
  } = PiezasDemo;
  const params = new URLSearchParams(window.location.search);
  const demo = useMemo(() => crearDemo(language, { generateInitialYearData, normalizarConfig, VERSION_DATOS }), [language, generateInitialYearData, normalizarConfig, VERSION_DATOS]);

  const [financialData, setFinancialData] = useState(demo.financialData);
  const [config, setConfig] = useState(demo.config);
  const [activeView, setActiveView] = useState(params.get('v') || 'dashboard');
  const [monthlyMode, setMonthlyMode] = useState(params.get('modo') || 'seguimiento');
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedMonth, setSelectedMonth] = useState(params.get('mes') || months[new Date().getMonth()]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(params.get('menu') === '0');
  const [budgetLocked, setBudgetLocked] = useState(true);
  setMonedaActiva(config.moneda);

  const ajustes = normalizarAjustesAcceso(null);
  const data = financialData[selectedYear];
  const commonProps = { data, year: selectedYear, categories: data?.categories || config.categories, onUpdate: setFinancialData, fullData: financialData, onUpdateCfg: setConfig, config, budgetData: data?.budget };

  const vista = () => {
    switch (activeView) {
      case 'monthly':
        return monthlyMode === 'presupuesto'
          ? <DashboardView {...commonProps} mode="budget" setMode={() => {}} budgetLocked={budgetLocked} setBudgetLocked={setBudgetLocked} visibleBudgetSections={config.visibleBudgetSections} visibleViews={config.visibleViews} soloLectura={false} />
          : <MonthlyView {...commonProps} month={selectedMonth} currentMonthData={data?.monthly?.[selectedMonth]} onIrAPresupuesto={() => setMonthlyMode('presupuesto')} />;
      case 'networth': return <NetWorthView {...commonProps} data={data?.netWorth} />;
      case 'loans': return <LoansView loans={financialData.loans} onUpdate={setFinancialData} fullData={financialData} userId="demo" onUpdateCfg={setConfig} config={config} />;
      case 'trading': return <TradingView trades={financialData.trading} onUpdate={setFinancialData} fullData={financialData} />;
      case 'analysis': return <Calculadoras inicial={params.get('calc')} />;
      case 'settings': return <SettingsView config={config} selectedYear={selectedYear} onUpdate={setConfig} financialData={financialData} onUpdateFD={setFinancialData} user={demo.user} onUpdateProfile={() => {}} onUpdateVisibility={(v) => setConfig(c => ({ ...c, visibleViews: v }))} onStartTutorial={() => {}} soloLectura={false} />;
      default:
        return <DashboardView {...commonProps} mode="charts" setMode={() => {}} budgetLocked={budgetLocked} setBudgetLocked={setBudgetLocked} visibleBudgetSections={config.visibleBudgetSections} visibleViews={config.visibleViews} soloLectura={false} />;
    }
  };

  return (
    <div className={`app-shell ${theme === 'light' ? 'light' : ''}`} data-demo="1">
      {!sidebarCollapsed && <div className="sidebar-overlay" onClick={() => setSidebarCollapsed(true)} />}
      <Sidebar activeView={activeView} setActiveView={setActiveView} onSignOut={() => {}} user={demo.user} collapsed={sidebarCollapsed} config={config} ajustesAcceso={ajustes} />
      <div className="main-content">
        <Topbar
          activeView={activeView} setActiveView={setActiveView} user={demo.user}
          sidebarCollapsed={sidebarCollapsed} toggleSidebar={() => setSidebarCollapsed(p => !p)}
          selectedYear={selectedYear} setSelectedYear={setSelectedYear}
          selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth}
          financialData={financialData} monthlyMode={monthlyMode} setMonthlyMode={setMonthlyMode}
        />
        <div className="page-content fade-in">{vista()}</div>
      </div>
    </div>
  );
}
