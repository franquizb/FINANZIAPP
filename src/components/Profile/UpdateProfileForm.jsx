import React, { useState, useEffect } from 'react';
import { updateProfile } from 'firebase/auth';
import { useAuth } from '../../context/AuthContext';
import { auth } from '../../firebase';

function UpdateProfileForm({ currentUser, userConfig, updateConfig, onEditComplete, onCancel }) {
    const [displayName, setDisplayName] = useState(userConfig?.profile?.name || currentUser?.displayName || '');
    const [bio, setBio] = useState(userConfig?.profile?.bio || '');

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Estado de carga para el botón
    const { refreshUser } = useAuth();

    useEffect(() => {
        setDisplayName(userConfig?.profile?.name || currentUser?.displayName || '');
        setBio(userConfig?.profile?.bio || '');
        setMessage('');
        setError('');
    }, [currentUser, userConfig]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Iniciar estado de carga
        setMessage('');
        setError('');

        try {
            // Solo actualiza si hay cambios reales para evitar escrituras innecesarias
            const hasNameChanged = displayName !== (userConfig?.profile?.name || currentUser?.displayName);
            const hasBioChanged = bio !== (userConfig?.profile?.bio || '');

            if (hasNameChanged) {
                await updateProfile(auth.currentUser, {
                    displayName: displayName,
                });
            }

            if (hasNameChanged || hasBioChanged) {
                // Objeto de perfil robusto que no falla si userConfig.profile es undefined
                const newProfileConfig = {
                    ...(userConfig?.profile || {}), // <-- SOLUCIÓN AL ERROR
                    name: displayName,
                    bio: bio,
                };
                await updateConfig({ profile: newProfileConfig });
            }

            setMessage('Perfil actualizado exitosamente.');
            refreshUser(); // Refresca el estado de Firebase Auth en la app

            // Cierra el formulario después de un breve instante para que el usuario vea el mensaje
            setTimeout(() => {
                if (onEditComplete) {
                    onEditComplete();
                }
            }, 1500);

        } catch (err) {
            setError('Error al actualizar el perfil. Inténtalo de nuevo.');
            console.error("Error al actualizar perfil:", err);
            setLoading(false); // Detener estado de carga en caso de error
        }
        // No establecer setLoading(false) aquí para que el mensaje de éxito sea visible
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="displayName" className="block text-sm font-medium text-gray-300">Nombre de Usuario:</label>
                    <input
                        type="text"
                        id="displayName"
                        className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Tu nombre o apodo"
                        disabled={loading} // Deshabilitar mientras se guarda
                    />
                </div>

                <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-300">Biografía / Lema:</label>
                    <textarea
                        id="bio"
                        rows="3"
                        className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-y text-white"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Un lema, tu filosofía financiera..."
                        disabled={loading} // Deshabilitar mientras se guarda
                    />
                </div>

                <div className="flex items-center space-x-4 pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="inline-flex justify-center py-2 px-4 border border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                </div>
                
                {/* Mensajes de estado */}
                <div className="h-5 mt-2">
                    {message && <p className="text-green-400 text-sm">{message}</p>}
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                </div>
            </form>
        </div>
    );
}

export default UpdateProfileForm;