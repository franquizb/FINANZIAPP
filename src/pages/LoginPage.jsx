// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
// Eliminada la importación de react-icons/fc
// Eliminada la importación de useTranslation

function LoginPage() {
  // Eliminada la inicialización de t
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Fallo al iniciar sesión. Verifica tu correo y contraseña.'); // Texto directo en español
      console.error(err);
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError('Fallo al iniciar sesión con Google.'); // Texto directo en español
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Inicia sesión en Financiapp</h2> {/* Texto directo */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="email">
              Correo Electrónico
            </label> {/* Texto directo */}
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white"
              id="email"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="password">
              Contraseña
            </label> {/* Texto directo */}
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white"
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col items-center justify-between">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mb-4"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Cargando...' : 'Iniciar Sesión'}
            </button> {/* Texto directo */}
            <button
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mb-4 flex items-center justify-center gap-2"
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              {/* SVG para el icono de Google (solución directa) */}
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.799 10.1199C19.799 9.3879 19.739 8.6509 19.609 7.9259H9.99902V12.0199H15.424C15.179 13.3939 14.436 14.6369 13.351 15.4129L13.344 15.4649L16.634 18.0699L16.839 18.0869C18.89 16.2089 20 13.3159 20 10.1199C20 9.5089 19.957 8.8999 19.897 8.2979" fill="#EA4335"/>
                <path d="M9.99902 19.9999C12.75 19.9999 15.111 19.0669 16.839 18.0869L13.351 15.4129C12.42 16.0359 11.298 16.4259 9.99902 16.4259C7.63602 16.4259 5.65902 14.8219 4.97202 12.6399L4.85802 12.6489L1.47202 15.2289L1.42302 15.3409C3.17802 18.7309 6.44202 19.9999 9.99902 19.9999Z" fill="#34A853"/>
                <path d="M4.97202 12.6399C4.70802 11.8029 4.56802 10.9169 4.56802 9.9999C4.56802 9.0829 4.70802 8.1969 4.97202 7.3599L4.97002 7.2539L1.46402 4.6739L1.42302 4.7859C0.493021 6.6479 0 8.3289 0 9.9999C0 11.6709 0.493021 13.3519 1.42302 15.2139L4.97202 12.6399Z" fill="#FBBC04"/>
                <path d="M9.99902 3.5749C11.247 3.5749 12.38 4.0049 13.253 4.8089L16.883 1.3419C15.118 0.480903 12.75 0 9.99902 0C6.44202 0 3.17802 1.2689 1.42302 4.6589L4.97202 7.2389C5.65902 5.0569 7.63602 3.5749 9.99902 3.5749Z" fill="#4285F4"/>
              </svg>
              Iniciar Sesión con Google
            </button> {/* Texto directo */}
          </div>
        </form>
        <div className="text-center mt-4">
          <Link to="/register" className="text-blue-400 hover:text-blue-200 text-sm">
            ¿No tienes una cuenta? Regístrate
          </Link> {/* Texto directo */}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;