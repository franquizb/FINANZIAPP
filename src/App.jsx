// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
import LandingPage from './pages/LandingPage';
import { useAuth } from './context/AuthContext';
import AmortizationPage from './pages/AmortizationPage';
import SetupProfilePage from './pages/SetupProfilePage';

function App() {
  const { currentUser, loading } = useAuth();

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
        {/* Si el usuario está autenticado y accede a /, lo manda a /dashboard.
            Si no está autenticado, muestra la LandingPage.
            Esto es crucial: al cerrar sesión, currentUser se hace null,
            y si estabas en /, se muestra LandingPage.
            Si estabas en /dashboard (ruta protegida), AuthContext.logout() te empujará a /.
        */}
        <Route path="/" element={currentUser ? <Navigate to="/dashboard" /> : <LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/setup-profile" element={<SetupProfilePage />}  />

        {/* Las rutas protegidas bajo PrivateRoute */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="monthly-tracker" element={<MonthlyTrackerPage />} />
          <Route path="net-worth" element={<NetWorthPage />} />
          <Route path="ai-analysis" element={<AiAnalysisPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="portfolio" element={<PortfolioPage />} />
          <Route path="amortization" element={<AmortizationPage />} />
        </Route>

        {/* Catch-all para cualquier otra URL */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;