// src/components/Profile/UpdateProfileForm.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { updateProfile } from 'firebase/auth';
import { useAuth } from '../../context/AuthContext';
import { auth } from '../../firebase'; 
import useFinanceData from '../../hooks/useFinanceData'; // Asegúrate de importar useFinanceData si updateConfig viene de ahí

function UpdateProfileForm({ currentUser, userConfig, updateConfig, onEditComplete, onCancel }) { 
    const [displayName, setDisplayName] = useState(userConfig?.profile?.name || currentUser?.displayName || '');
    const [bio, setBio] = useState(userConfig?.profile?.bio || ''); // <-- NUEVO ESTADO para la biografía

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { refreshUser } = useAuth(); 

    useEffect(() => {
        setDisplayName(userConfig?.profile?.name || currentUser?.displayName || '');
        setBio(userConfig?.profile?.bio || ''); // <-- Sincronizar biografía
        setMessage(''); 
        setError('');   
    }, [currentUser, userConfig]); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            // Actualizar solo el displayName en Firebase Auth (photoURL se maneja en el modal)
            await updateProfile(auth.currentUser, {
                displayName: displayName,
            });

            const newProfileConfig = {
                ...userConfig.profile, 
                name: displayName,
                bio: bio, // <-- Guardar la biografía en userConfig
            };
            
            // Solo actualiza Firestore si el nombre o la biografía han cambiado
            if (newProfileConfig.name !== userConfig.profile.name || newProfileConfig.bio !== userConfig.profile.bio) {
                await updateConfig({ profile: newProfileConfig }); 
            }

            setMessage('Perfil actualizado exitosamente.');
            refreshUser(); 
            
            if (onEditComplete) {
                onEditComplete(); 
            }

        } catch (err) {
            setError(err.message);
            console.error("Error al actualizar perfil:", err);
        }
    };

    return (
        <div className="mt-8 pt-4 border-t border-gray-600 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-white dark:text-gray-200 mb-3">Actualizar Información</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="displayName" className="block text-sm font-medium text-gray-300 dark:text-gray-300">Nombre de Usuario:</label>
                    <input
                        type="text"
                        id="displayName"
                        className="mt-1 block w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Tu nombre o apodo"
                    />
                </div>

                {/* Nuevo campo de Biografía */}
                <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-300 dark:text-gray-300">Biografía / Lema:</label>
                    <textarea
                        id="bio"
                        rows="3" // Puedes ajustar el número de filas
                        className="mt-1 block w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-white dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-y"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Un lema, tu filosofía financiera..."
                    ></textarea>
                </div>

                <div className="flex space-x-4 mt-4">
                    <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Guardar Cambios
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="inline-flex justify-center py-2 px-4 border border-gray-500 shadow-sm text-sm font-medium rounded-md text-gray-300 bg-gray-600 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                        Cancelar
                    </button>
                </div>
                {message && <p className="text-green-500 text-sm mt-2">{message}</p>}
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </form>
        </div>
    );
}

export default UpdateProfileForm;