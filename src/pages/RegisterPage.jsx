// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import avatars from '../utils/avatars';
import { auth } from '../firebase'; // Importa auth para updateProfile si lo haces aquí
import { updateProfile } from 'firebase/auth'; // Para establecer nombre y avatar inicial

function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [selectedAvatarId, setSelectedAvatarId] = useState('default');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup, loginWithGoogle } = useAuth(); // Desestructura loginWithGoogle
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const userCredential = await signup(email, password);
            
            const initialPhotoURL = avatars.find(a => a.id === selectedAvatarId)?.url || '';

            await updateProfile(userCredential.user, {
                displayName: displayName,
                photoURL: initialPhotoURL
            });

            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
            console.error("Error al registrar:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleRegister = async () => { // Nueva función para registro con Google
        setError('');
        setLoading(true);
        try {
            await loginWithGoogle(); // loginWithGoogle ya maneja la inicialización de datos si el usuario es nuevo
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
            console.error("Error al registrarse con Google:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white dark:bg-gray-900 dark:text-gray-100">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-700 dark:bg-gray-800 dark:border-gray-700">
                <h2 className="text-3xl font-bold text-center text-white mb-6 dark:text-gray-200">Crear Cuenta</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 dark:text-gray-300">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300 dark:text-gray-300">Contraseña:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>
                    {/* Campo para el nombre de usuario inicial */}
                    <div>
                        <label htmlFor="displayName" className="block text-sm font-medium text-gray-300 dark:text-gray-300">Tu Nombre/Apodo:</label>
                        <input
                            type="text"
                            id="displayName"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            required
                            className="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="Ej: Juan, FinappUser"
                        />
                    </div>
                    {/* Selector de Avatares */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-2">Seleccionar Avatar:</label>
                        <div className="flex flex-wrap gap-3">
                            {avatars.map(avatar => (
                                <img
                                    key={avatar.id}
                                    src={avatar.url}
                                    alt={`Avatar ${avatar.id}`}
                                    className={`w-12 h-12 rounded-full cursor-pointer border-2 ${
                                        selectedAvatarId === avatar.id ? 'border-blue-500' : 'border-transparent'
                                    } hover:border-blue-400 transition-colors duration-200`}
                                    onClick={() => setSelectedAvatarId(avatar.id)}
                                />
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-700 dark:hover:bg-blue-800"
                    >
                        {loading ? 'Registrando...' : 'Registrarse'}
                    </button>
                    {error && <p className="text-red-500 text-center text-sm mt-4">{error}</p>}
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-400 mb-4">O regístrate con:</p>
                    <button
                        onClick={handleGoogleRegister} // Llama a la nueva función
                        disabled={loading}
                        className="w-full flex items-center justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600"
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google logo" className="w-5 h-5 mr-2" />
                        {loading ? 'Conectando con Google...' : 'Registrarse con Google'}
                    </button>
                </div>

                <p className="text-center text-gray-400 text-sm mt-6">
                    ¿Ya tienes cuenta?{' '}
                    <a href="/login" className="font-medium text-blue-500 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300">Iniciar Sesión</a>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;