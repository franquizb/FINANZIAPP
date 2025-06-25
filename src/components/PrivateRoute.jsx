// src/components/PrivateRoute.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
// Eliminada la importación de useTranslation

function PrivateRoute({ children }) {
  // Eliminada la inicialización de t
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        Cargando...
      </div>
    );
  }

  return currentUser ? children : <Navigate to="/login" />;
}

export default PrivateRoute;