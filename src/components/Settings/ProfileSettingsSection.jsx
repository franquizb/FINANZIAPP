import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import useFinanceData from '../../hooks/useFinanceData';
import UpdateProfileForm from '../Profile/UpdateProfileForm';
import AvatarSelectorModal from '../Profile/AvatarSelectorModal';
import avatars from '../../utils/avatars';

// Componente de carga con spinner de círculo girando (para uso interno del componente)
const LoadingSpinner = () => {
    return (
        <div className="flex flex-col items-center justify-center text-white dark:text-gray-200 h-full py-8">
            <svg className="animate-spin h-8 w-8 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-3 text-lg">Cargando perfil...</p>
        </div>
    );
};

function ProfileSettingsSection() {
    const { currentUser } = useAuth();
    const { userConfig, updateConfig, loadingData, errorData } = useFinanceData(); // Incluir loadingData y errorData

    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [showAvatarModal, setShowAvatarModal] = useState(false);

    // Muestra el spinner si está cargando o hay un error, o si userConfig no está disponible
    if (loadingData || !userConfig || !currentUser) {
        return <LoadingSpinner />;
    }
    if (errorData) {
        return <div className="text-center p-8 bg-gray-800 rounded-lg text-red-500">Error al cargar el perfil: {errorData}</div>;
    }

    const handleEditComplete = () => {
        setIsEditingProfile(false);
    };

    // Lógica para determinar la URL del avatar
    const currentAvatarUrl = userConfig?.profile?.avatarUrl
        ? userConfig.profile.avatarUrl
        : (avatars.find(a => a.id === userConfig?.profile?.avatarId)?.url || currentUser?.photoURL || '/default-avatar.png');

    // Manejar la actualización del avatar desde el modal
    const handleAvatarUpdated = async (newAvatarUrl, newAvatarId = null) => {
        setShowAvatarModal(false);

        const updatedProfile = { ...userConfig.profile };

        if (newAvatarUrl) {
            updatedProfile.avatarUrl = newAvatarUrl;
            if (newAvatarId === null) {
                delete updatedProfile.avatarId;
            }
        } else if (newAvatarId) {
            updatedProfile.avatarId = newAvatarId;
            delete updatedProfile.avatarUrl;
        } else {
            delete updatedProfile.avatarUrl;
            delete updatedProfile.avatarId;
        }
        
        try {
            await updateConfig({ profile: updatedProfile });
        } catch (error) {
            console.error("Error al actualizar el avatar:", error);
        }
    };

    return (
        <div className="bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-700">
            {!isEditingProfile ? (
                <div className="text-center">
                    {/* Avatar grande y centrado */}
                    <div 
                        className="relative w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-4 cursor-pointer group"
                        onClick={() => setShowAvatarModal(true)}
                    >
                        <img
                            src={currentAvatarUrl}
                            alt="Avatar de usuario"
                            className="w-full h-full rounded-full object-cover border-4 border-gray-600 shadow-lg group-hover:border-blue-500 transition-all duration-300 transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 5.232z" />
                            </svg>
                        </div>
                    </div>

                    {/* Información del perfil */}
                    <h3 className="text-3xl font-bold text-white mt-4">
                        {userConfig?.profile?.name || currentUser?.displayName}
                    </h3>
                    <p className="text-gray-400 text-md italic mt-2 max-w-md mx-auto">
                        {userConfig?.profile?.bio || 'Añade una biografía para personalizar tu perfil.'}
                    </p>

                    {/* === NUEVA SECCIÓN: DETALLES DE LA CUENTA === */}
                    <div className="max-w-sm mx-auto mt-6 pt-4 border-t border-gray-700">
                        <div className="flex justify-between items-center text-sm text-gray-400">
                            <span className="font-semibold text-gray-300">Correo Electrónico:</span>
                            <span>{currentUser.email}</span>
                        </div>
                    </div>

                    {/* Botón de edición */}
                    <button
                        onClick={() => setIsEditingProfile(true)}
                        className="mt-8 inline-flex items-center gap-2 py-2 px-6 border border-transparent shadow-sm text-md font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 transition-transform transform hover:scale-105"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                            <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                        </svg>
                        Editar Perfil
                    </button>
                </div>
            ) : (
                <div>
                    <h3 className="text-2xl font-bold text-white mb-6 text-center">Editando Perfil</h3>
                    <UpdateProfileForm
                        currentUser={currentUser}
                        userConfig={userConfig}
                        updateConfig={updateConfig}
                        onEditComplete={handleEditComplete}
                        onCancel={() => setIsEditingProfile(false)}
                    />
                </div>
            )}

            {showAvatarModal && (
                <AvatarSelectorModal
                    currentUser={currentUser}
                    userConfig={userConfig}
                    onClose={() => setShowAvatarModal(false)}
                    onAvatarUpdated={handleAvatarUpdated} 
                />
            )}
        </div>
    );
}

export default ProfileSettingsSection;