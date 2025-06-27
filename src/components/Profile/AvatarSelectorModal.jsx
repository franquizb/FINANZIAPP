// src/components/Profile/AvatarSelectorModal.jsx
import React, { useState, useEffect } from 'react';
import { updateProfile } from 'firebase/auth';
import { useAuth } from '../../context/AuthContext';
import useFinanceData from '../../hooks/useFinanceData'; // Para actualizar userConfig
import avatars from '../../utils/avatars'; // Tu lista de avatares
import { auth } from '../../firebase'; // Necesario para updateProfile

function AvatarSelectorModal({ currentUser, userConfig, onClose, onAvatarUpdated }) {
    // Estado local para la selección del avatar en el modal
    const initialAvatarId = userConfig?.profile?.avatarId || (avatars.find(a => a.url === currentUser?.photoURL)?.id) || 'default';
    const [selectedAvatarId, setSelectedAvatarId] = useState(initialAvatarId);
    const [customPhotoURL, setCustomPhotoURL] = useState(
        selectedAvatarId === 'custom' ? currentUser?.photoURL || '' : ''
    );
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { refreshUser } = useAuth();
    const { updateConfig } = useFinanceData(); // Necesitamos esta función para actualizar Firestore

    // Sincronizar el estado del modal si las props cambian (ej. si el usuario cambia de sesión)
    useEffect(() => {
        const currentAvatarFromConfig = userConfig?.profile?.avatarId;
        const currentAvatarFromFirebase = currentUser?.photoURL;

        let initialId = 'default';
        if (currentAvatarFromConfig) {
            initialId = currentAvatarFromConfig;
        } else if (currentAvatarFromFirebase) {
            const foundAvatar = avatars.find(a => a.url === currentAvatarFromFirebase);
            if (foundAvatar) {
                initialId = foundAvatar.id;
            } else {
                initialId = 'custom';
                setCustomPhotoURL(currentAvatarFromFirebase);
            }
        }
        setSelectedAvatarId(initialId);
        setMessage('');
        setError('');
    }, [currentUser, userConfig]);

    const handleSaveAvatar = async () => {
        setLoading(true);
        setMessage('');
        setError('');

        try {
            let finalPhotoURL = '';
            if (selectedAvatarId === 'custom') {
                finalPhotoURL = customPhotoURL;
            } else {
                finalPhotoURL = avatars.find(a => a.id === selectedAvatarId)?.url || '';
            }

            // 1. Actualizar el perfil de Firebase Auth
            await updateProfile(auth.currentUser, {
                photoURL: finalPhotoURL
            });

            // 2. Actualizar la configuración del usuario en Firestore
            const newProfileConfig = {
                ...userConfig.profile,
                avatarId: selectedAvatarId // Guardamos el ID del avatar seleccionado
            };
            await updateConfig({ profile: newProfileConfig });

            setMessage('Avatar actualizado exitosamente.');
            refreshUser(); // Refrescar el estado del usuario en el contexto
            if (onAvatarUpdated) {
                onAvatarUpdated(finalPhotoURL); // Notificar al padre que el avatar se actualizó
            }
            onClose(); // Cerrar el modal después de guardar
        } catch (err) {
            setError(err.message);
            console.error("Error al actualizar avatar:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md border border-gray-700 dark:bg-gray-800 dark:border-gray-700">
                <h3 className="text-2xl font-bold text-white dark:text-gray-200 mb-4 text-center">Seleccionar Avatar</h3>

                {/* Cuadrícula de Avatares */}
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 mb-6 max-h-60 overflow-y-auto custom-scrollbar p-2">
                    {avatars.map(avatar => (
                        <div
                            key={avatar.id}
                            className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full cursor-pointer overflow-hidden transition-all duration-200 ease-in-out
                                ${selectedAvatarId === avatar.id ? 'border-4 border-blue-500 scale-105 shadow-lg' : 'border-2 border-transparent hover:border-blue-400'}`}
                            onClick={() => {
                                setSelectedAvatarId(avatar.id);
                                setCustomPhotoURL(''); // Limpiar URL personalizada si se elige un avatar predefinido
                            }}
                        >
                            <img
                                src={avatar.url}
                                alt={`Avatar ${avatar.id}`}
                                className="w-full h-full object-cover"
                            />
                            {selectedAvatarId === avatar.id && (
                                <div className="absolute inset-0 flex items-center justify-center bg-blue-500 bg-opacity-50 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    ))}
                    {/* Opción para URL personalizada */}
                    <div
                        className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full cursor-pointer border-2 flex flex-col items-center justify-center text-gray-400 text-xs text-center p-1 bg-gray-700
                            ${selectedAvatarId === 'custom' ? 'border-4 border-blue-500 scale-105 shadow-lg' : 'border-2 border-transparent hover:border-blue-400'}`}
                        onClick={() => setSelectedAvatarId('custom')}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.807a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m7.58-4.807a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                        </svg>
                        <span className="text-white text-xs">URL</span>
                        {selectedAvatarId === 'custom' && (
                            <div className="absolute inset-0 flex items-center justify-center bg-blue-500 bg-opacity-50 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                        )}
                    </div>
                </div>

                {/* Campo de URL de Foto de Perfil si se selecciona "custom" */}
                {selectedAvatarId === 'custom' && (
                    <div className="mb-4">
                        <label htmlFor="customPhotoURL" className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-1">URL de tu Avatar:</label>
                        <input
                            type="url"
                            id="customPhotoURL"
                            className="mt-1 block w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            value={customPhotoURL}
                            onChange={(e) => setCustomPhotoURL(e.target.value)}
                            placeholder="https://ejemplo.com/mi-foto.jpg"
                        />
                    </div>
                )}

                {message && <p className="text-green-500 text-sm mt-2 text-center">{message}</p>}
                {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}

                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="py-2 px-4 border border-gray-500 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-600 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={handleSaveAvatar}
                        disabled={loading}
                        className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Guardando...' : 'Guardar Avatar'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AvatarSelectorModal;