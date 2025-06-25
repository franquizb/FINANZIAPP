import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // Añadir Navigate
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import MonthlyTrackerPage from './pages/MonthlyTrackerPage';
import NetWorthPage from './pages/NetWorthPage';
import AiAnalysisPage from './pages/AiAnalysisPage';
import SettingsPage from './pages/SettingsPage';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import PortfolioPage from './pages/PortfolioPage';
import { ThemeProvider } from './context/ThemeContext';
import LandingPage from './pages/LandingPage'; // <-- IMPORTACIÓN DE LA LANDING PAGE
import { useAuth } from './context/AuthContext'; // <-- Asegúrate de que useAuth esté aquí

function App() {
  const { currentUser, loading } = useAuth(); // Obtener el estado del usuario

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        Cargando sesión...
      </div>
    );
  }

  return (
    <ThemeProvider>
      <Routes>
        {/* Ruta raíz: si está logueado, va al dashboard; si no, a la Landing Page */}
        <Route path="/" element={currentUser ? <Navigate to="/dashboard" /> : <LandingPage />} />

        {/* Rutas públicas directas (Login, Register) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Grupo de rutas protegidas que usan el Layout */}
        <Route
          path="/" // La ruta padre para las rutas protegidas (no cambia, solo actúa como contenedor)
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          {/* Rutas anidadas que se renderizarán dentro del Outlet de Layout */}
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="monthly-tracker" element={<MonthlyTrackerPage />} />
          <Route path="net-worth" element={<NetWorthPage />} />
          <Route path="ai-analysis" element={<AiAnalysisPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="portfolio" element={<PortfolioPage />} />
        </Route>

        {/* Si intenta acceder a cualquier otra ruta y no está logueado, va a la Landing Page */}
        {/* O simplemente redirige a la ruta raíz para que la lógica de Landing/Dashboard actúe */}
        <Route path="*" element={<Navigate to="/" replace />} /> {/* Usar replace para no mantener en el historial */}
      </Routes>
    </ThemeProvider>
  );
}

export default App;