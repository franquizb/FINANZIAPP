// src/pages/ProfilePage.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { GoogleAuthProvider, EmailAuthProvider, OAuthProvider } from 'firebase/auth'; // Asegúrate de que estos proveedores estén importados
import UpdateProfileForm from '../components/Profile/UpdateProfileForm'; // Componente para actualizar nombre/foto
import ChangePasswordForm from '../components/Profile/ChangePasswordForm'; // Componente para cambiar contraseña
import DeleteAccountSection from '../components/Profile/DeleteAccountSection'; // Componente para eliminar cuenta

function ProfilePage() {
    const { user, loading } = useAuth();
    const [activeTab, setActiveTab] = useState('info'); // Pestaña activa: 'info', 'password', 'delete'

    if (loading) {
        return <div className="text-center py-8 text-white dark:text-gray-200">Cargando perfil...</div>;
    }

    if (!user) {
        // Esto debería ser manejado por PrivateRoute, pero es una buena salvaguarda
        return <div className="text-center py-8 text-red-500 dark:text-red-400">No hay usuario autenticado. Redirigiendo...</div>;
    }

    // Obtener los proveedores vinculados al usuario
    const linkedProviders = user.providerData.map(profile => {
        switch (profile.providerId) {
            case GoogleAuthProvider.PROVIDER_ID:
                return 'Google';
            case EmailAuthProvider.PROVIDER_ID:
                return 'Correo Electrónico/Contraseña';
            case OAuthProvider.PROVIDER_ID: // Apple OAuthProvider tiene providerId 'apple.com'
                return 'Apple';
            // Añade más casos si usas otros proveedores (Facebook, Twitter, etc.)
            default:
                return profile.providerId; // Mostrar el ID si no es reconocido
        }
    });

    // Determinar si el usuario puede cambiar la contraseña (solo si inició sesión con email/password)
    const canChangePassword = user.providerData.some(
        (provider) => provider.providerId === EmailAuthProvider.PROVIDER_ID
    );

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-900 min-h-screen text-white dark:bg-gray-900 dark:text-gray-100">
            <h2 className="text-3xl font-bold text-white dark:text-gray-200 mb-6 border-b-2 border-blue-600 pb-2">Mi Perfil</h2>

            {/* Navegación por pestañas */}
            <div className="flex border-b border-gray-700 mb-6">
                <button
                    className={`py-2 px-4 ${activeTab === 'info' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400 hover:text-gray-200'}`}
                    onClick={() => setActiveTab('info')}
                >
                    Información General
                </button>
                {canChangePassword && ( // Solo muestra esta pestaña si el usuario puede cambiar la contraseña
                    <button
                        className={`py-2 px-4 ${activeTab === 'password' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400 hover:text-gray-200'}`}
                        onClick={() => setActiveTab('password')}
                    >
                        Cambiar Contraseña
                    </button>
                )}
                <button
                    className={`py-2 px-4 ${activeTab === 'delete' ? 'border-b-2 border-red-500 text-red-500' : 'text-gray-400 hover:text-gray-200'}`}
                    onClick={() => setActiveTab('delete')}
                >
                    Eliminar Cuenta
                </button>
            </div>

            {/* Contenido de la pestaña activa */}
            <div className="bg-gray-700 p-6 rounded-lg shadow-md dark:bg-gray-800">
                {activeTab === 'info' && (
                    <>
                        <p className="mb-2 text-gray-300"><span className="font-semibold text-white">Email:</span> {user.email || 'N/A'}</p>
                        <p className="mb-4 text-gray-300"><span className="font-semibold text-white">ID de Usuario (UID):</span> {user.uid}</p>

                        <h3 className="text-xl font-semibold text-white dark:text-gray-200 mb-3">Servicios Vinculados:</h3>
                        <ul className="list-disc list-inside mb-6">
                            {linkedProviders.length > 0 ? (
                                linkedProviders.map((provider, index) => (
                                    <li key={index} className="text-gray-300">{provider}</li>
                                ))
                            ) : (
                                <li className="text-gray-400">No hay servicios vinculados.</li>
                            )}
                        </ul>
                        <UpdateProfileForm user={user} />
                    </>
                )}

                {activeTab === 'password' && canChangePassword && (
                    <ChangePasswordForm user={user} />
                )}

                {activeTab === 'delete' && (
                    <DeleteAccountSection user={user} />
                )}
            </div>
        </div>
    );
}

export default ProfilePage;