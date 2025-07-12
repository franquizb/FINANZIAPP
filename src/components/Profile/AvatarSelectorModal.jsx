import React, { useState, useEffect } from 'react';
import { updateProfile } from 'firebase/auth';
import { useAuth } from '../../context/AuthContext';
import useFinanceData from '../../hooks/useFinanceData';
import avatars from '../../utils/avatars';
import { auth } from '../../firebase';

function AvatarSelectorModal({ currentUser, userConfig, onClose, onAvatarUpdated }) {
    // MODIFICACIÓN: La lógica de initialAvatarId y customPhotoURL debe reflejar userConfig.profile.avatarUrl
    const initialAvatarUrlFromConfig = userConfig?.profile?.avatarUrl;
    const initialAvatarIdFromConfig = userConfig?.profile?.avatarId;

    let initialSelectedAvatarId = 'default'; // Por defecto
    let initialCustomPhotoURL = '';

    if (initialAvatarUrlFromConfig) {
        initialSelectedAvatarId = 'custom';
        initialCustomPhotoURL = initialAvatarUrlFromConfig;
    } else if (initialAvatarIdFromConfig) {
        initialSelectedAvatarId = initialAvatarIdFromConfig;
    } else if (currentUser?.photoURL) {
        // Fallback a photoURL de Firebase Auth si no hay config de usuario,
        // pero solo si no es uno de nuestros avatares predefinidos.
        const foundAvatar = avatars.find(a => a.url === currentUser.photoURL);
        if (foundAvatar) {
            initialSelectedAvatarId = foundAvatar.id;
        } else {
            initialSelectedAvatarId = 'custom';
            initialCustomPhotoURL = currentUser.photoURL;
        }
    }

    const [selectedAvatarId, setSelectedAvatarId] = useState(initialSelectedAvatarId);
    const [customPhotoURL, setCustomPhotoURL] = useState(initialCustomPhotoURL);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { refreshUser } = useAuth();
    const { updateConfig } = useFinanceData();

    // Este useEffect ahora es menos crítico ya que la inicialización es más robusta.
    // Lo mantengo para re-evaluaciones si userConfig o currentUser cambian MIENTRAS el modal está abierto.
    useEffect(() => {
        const currentAvatarFromConfigUrl = userConfig?.profile?.avatarUrl;
        const currentAvatarFromConfigId = userConfig?.profile?.avatarId;
        const currentAvatarFromFirebasePhotoURL = currentUser?.photoURL;
        
        if (currentAvatarFromConfigUrl) {
            setSelectedAvatarId('custom');
            setCustomPhotoURL(currentAvatarFromConfigUrl);
        } else if (currentAvatarFromConfigId) {
            setSelectedAvatarId(currentAvatarFromConfigId);
            setCustomPhotoURL('');
        } else if (currentAvatarFromFirebasePhotoURL) {
            const foundAvatar = avatars.find(a => a.url === currentAvatarFromFirebasePhotoURL);
            if (foundAvatar) {
                setSelectedAvatarId(foundAvatar.id);
                setCustomPhotoURL('');
            } else {
                setSelectedAvatarId('custom');
                setCustomPhotoURL(currentAvatarFromFirebasePhotoURL);
            }
        } else {
            setSelectedAvatarId('default');
            setCustomPhotoURL('');
        }
    }, [currentUser, userConfig, avatars]); // Asegúrate de que `avatars` no cambie de forma inesperada si es que viene de un prop o contexto dinámico.


    const handleSaveAvatar = async () => {
        setLoading(true);
        setMessage('');
        setError('');
        try {
            let finalPhotoURLToFirebaseAuth = ''; // Para Firebase Auth (photoURL)
            let newAvatarUrlForConfig = null; // Para userConfig.profile.avatarUrl
            let newAvatarIdForConfig = null; // Para userConfig.profile.avatarId

            if (selectedAvatarId === 'custom') {
                if (!customPhotoURL.trim()) {
                    setError('La URL del avatar no puede estar vacía.');
                    setLoading(false);
                    return;
                }
                // Si es una URL personalizada, la guardamos en ambas
                finalPhotoURLToFirebaseAuth = customPhotoURL.trim();
                newAvatarUrlForConfig = customPhotoURL.trim();
                newAvatarIdForConfig = null; // No hay avatarId si es URL personalizada
            } else {
                // Si es un avatar predefinido
                finalPhotoURLToFirebaseAuth = avatars.find(a => a.id === selectedAvatarId)?.url || '';
                newAvatarUrlForConfig = null; // No hay URL personalizada si es un avatarId
                newAvatarIdForConfig = selectedAvatarId;
            }

            // 1. Actualizar Firebase Auth (photoURL)
            // Solo actualiza si hay un valor para photoURL
            if (auth.currentUser) {
                await updateProfile(auth.currentUser, { photoURL: finalPhotoURLToFirebaseAuth });
            } else {
                console.warn("No hay usuario autenticado para actualizar photoURL en Firebase Auth.");
            }
            
            // 2. Actualizar userConfig en Firebase Firestore
            const updatedProfileConfig = { ...userConfig.profile };
            if (newAvatarUrlForConfig) {
                updatedProfileConfig.avatarUrl = newAvatarUrlForConfig;
                delete updatedProfileConfig.avatarId; // Eliminar avatarId si ahora es una URL
            } else {
                updatedProfileConfig.avatarId = newAvatarIdForConfig;
                delete updatedProfileConfig.avatarUrl; // Eliminar avatarUrl si ahora es un ID
            }
            // Si el avatar se establece a default y no tiene URL/ID, asegurarse de que no queden campos
            if (newAvatarIdForConfig === 'default' && !newAvatarUrlForConfig) {
                 delete updatedProfileConfig.avatarUrl;
                 delete updatedProfileConfig.avatarId;
            }


            await updateConfig({ profile: updatedProfileConfig });

            setMessage('Avatar actualizado exitosamente.');
            refreshUser(); // Refresca el estado del usuario en AuthContext
            
            // Llama a la función de callback `onAvatarUpdated` en ProfileSettingsSection
            // Le pasamos la URL final para que ProfileSettingsSection no necesite recalcularla
            // Y el ID si es un avatar predefinido (para que pueda eliminar la URL si cambia a ID)
            if (onAvatarUpdated) {
                onAvatarUpdated(newAvatarUrlForConfig, newAvatarIdForConfig);
            }
            onClose();
        } catch (err) {
            setError(err.message);
            console.error("Error al actualizar avatar:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            {/* Contenedor del Modal con Flexbox para controlar el layout interno */}
            <div className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl border border-gray-700 flex flex-col max-h-[90vh]">
                
                {/* Cabecera Fija */}
                <div className="p-6 flex-shrink-0">
                    <h3 className="text-2xl font-bold text-white text-center">Seleccionar Avatar</h3>
                </div>

                {/* Contenedor de la Cuadrícula (crece y se desplaza si es necesario) */}
                <div className="px-6 pb-4 flex-grow overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(6rem,1fr))] gap-4">
                        {avatars.map(avatar => (
                            <div
                                key={avatar.id}
                                className={`aspect-square rounded-full cursor-pointer transition-all duration-200 ease-in-out flex items-center justify-center
                                    ${selectedAvatarId === avatar.id ? 'border-4 border-blue-500 scale-105 shadow-lg' : 'border-2 border-transparent hover:border-blue-400'}`}
                                onClick={() => {
                                    setSelectedAvatarId(avatar.id);
                                    setCustomPhotoURL('');
                                }}
                            >
                                <img src={avatar.url} alt={`Avatar ${avatar.id}`} className="w-full h-full object-cover rounded-full"/>
                            </div>
                        ))}
                        {/* Opción para URL personalizada */}
                        <div
                            className={`aspect-square rounded-full cursor-pointer border-2 flex flex-col items-center justify-center text-gray-400 p-1 bg-gray-700
                                ${selectedAvatarId === 'custom' ? 'border-4 border-blue-500 scale-105 shadow-lg' : 'border-2 border-transparent hover:border-blue-400'}`}
                            onClick={() => setSelectedAvatarId('custom')}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.807a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m7.58-4.807a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                            </svg>
                            <span className="text-white text-xs font-semibold">URL</span>
                        </div>
                    </div>
                </div>

                {/* Pie de Modal Fijo */}
                <div className="p-6 flex-shrink-0 border-t border-gray-700">
                    {selectedAvatarId === 'custom' && (
                        <div className="mb-4">
                            <label htmlFor="customPhotoURL" className="block text-sm font-medium text-gray-300 mb-2">URL de tu Avatar:</label>
                            <input
                                type="url"
                                id="customPhotoURL"
                                className="block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
                                value={customPhotoURL}
                                onChange={(e) => setCustomPhotoURL(e.target.value)}
                                placeholder="https://ejemplo.com/mi-foto.jpg"
                            />
                        </div>
                    )}

                    {message && <p className="text-green-500 text-sm text-center mb-2">{message}</p>}
                    {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}

                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="py-2 px-5 border border-gray-600 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                            Cancelar
                        </button>
                        <button type="button" onClick={handleSaveAvatar} disabled={loading} className="py-2 px-5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
                            {loading ? 'Guardando...' : 'Guardar Avatar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AvatarSelectorModal;