import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import avatars from '../utils/avatars'; // Asegúrate de que esta ruta es correcta
import { updateProfile } from 'firebase/auth';

function SetupProfilePage() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const [displayName, setDisplayName] = useState('');
    const [selectedAvatarId, setSelectedAvatarId] = useState('default');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
            return;
        }

        // Pre-rellena el campo de nombre si el usuario viene de Google
        if (currentUser.displayName) {
            setDisplayName(currentUser.displayName);
        }
    }, [currentUser, navigate]);

    const handleProfileSetup = async (e) => {
        e.preventDefault();
        if (!displayName.trim()) {
            setError("Por favor, introduce un nombre o apodo.");
            return;
        }
        setError('');
        setLoading(true);

        try {
            const photoURL = avatars.find(a => a.id === selectedAvatarId)?.url;
            await updateProfile(currentUser, { displayName, photoURL });
            navigate('/dashboard');
        } catch (err) {
            setError("No se pudo actualizar el perfil. Inténtalo de nuevo.");
        } finally {
            setLoading(false);
        }
    };
    
    if (!currentUser) {
        return null; // O un spinner de carga, para evitar flashes de contenido
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans antialiased flex items-center justify-center p-4">
             <div className="w-full max-w-md mx-auto">
                <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700">
                    <h2 className="text-4xl font-bold text-center text-white mb-2">¡Un último paso!</h2>
                    <p className="text-center text-gray-400 mb-8">Personaliza tu perfil para una mejor experiencia.</p>
                    <form onSubmit={handleProfileSetup} className="space-y-8">
                        <div>
                            <label htmlFor="displayName" className="block text-sm font-medium text-gray-300">Tu Nombre / Apodo</label>
                            <input
                                type="text" id="displayName" value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)} required
                                className="mt-1 block w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                                placeholder="¿Cómo te llamamos?"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-3">Elige tu Avatar</label>
                            <div className="flex flex-wrap gap-4 justify-center">
                                {avatars.map(avatar => (
                                    <img
                                        key={avatar.id} src={avatar.url} alt={`Avatar ${avatar.id}`}
                                        className={`w-16 h-16 rounded-full cursor-pointer transition-all duration-200 transform hover:scale-110 ${
                                            selectedAvatarId === avatar.id 
                                                ? 'ring-4 ring-offset-2 ring-teal-400 ring-offset-slate-800' 
                                                : 'ring-2 ring-transparent hover:ring-slate-600'
                                        }`}
                                        onClick={() => setSelectedAvatarId(avatar.id)}
                                    />
                                ))}
                            </div>
                        </div>
                        <button type="submit" disabled={loading} className="w-full font-bold py-3 px-6 rounded-full shadow-xl transform transition-all duration-300 hover:scale-105 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 disabled:opacity-50">
                            {loading ? 'Guardando...' : 'Guardar y Continuar'}
                        </button>
                        {error && <p className="text-red-400 text-center text-sm pt-2">{error}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SetupProfilePage;