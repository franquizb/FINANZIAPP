// src/components/PrivateRoute.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        Cargando...
      </div>
    );
  }

  // Si no hay usuario, redirige a /login. Esta es la función principal de un PrivateRoute.
  // La redirección post-logout a / la maneja AuthContext.
  return currentUser ? children : <Navigate to="/" />;
}

export default PrivateRoute;