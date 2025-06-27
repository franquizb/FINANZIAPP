// src/pages/ProfilePage.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import useFinanceData from '../../hooks/useFinanceData';
import { GoogleAuthProvider, EmailAuthProvider } from 'firebase/auth';
import UpdateProfileForm from '../Profile/UpdateProfileForm';
import ChangePasswordForm from '../Profile/ChangePasswordForm';
import DeleteAccountSection from '../Profile/DeleteAccountSection';
import AvatarSelectorModal from '../Profile/AvatarSelectorModal';
import avatars from '../../utils/avatars';

function ProfilePage() {
    // Desestructura annualSummary de useFinanceData
    const { currentUser, loading } = useAuth();
    const { financeData, userConfig, loadingData, errorData, updateConfig, currentYear, annualSummary } = useFinanceData(); // <-- Desestructura annualSummary
    const [activeTab, setActiveTab] = useState('info');
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [showAvatarModal, setShowAvatarModal] = useState(false);

    console.log("ProfilePage: user from useAuth:", currentUser, "loading from useAuth:", loading, "loadingData from useFinanceData:", loadingData);

    if (loading || loadingData) {
        return <div className="text-center py-8 text-white dark:text-gray-200">Cargando perfil y configuración...</div>;
    }

    if (!currentUser) {
        return <div className="text-center py-8 text-red-500 dark:text-red-400">No hay usuario autenticado. Redirigiendo...</div>;
    }

    if (errorData) {
        return <div className="text-center py-8 text-red-500 dark:text-red-400">Error al cargar la configuración del usuario: {errorData}</div>;
    }

    if (!userConfig) {
        return <div className="text-center py-8 text-gray-400 dark:text-gray-400">Preparando configuración de usuario... Recarga la página si tarda mucho.</div>;
    }
    
    const canChangePassword = currentUser.providerData.some( 
        (provider) => provider.providerId === EmailAuthProvider.PROVIDER_ID
    );

    const handleProfileEditComplete = () => {
        setIsEditingProfile(false); 
    };

    const handleAvatarUpdated = (newPhotoURL) => {
        console.log("Avatar actualizado en ProfilePage:", newPhotoURL);
    };

    // Formateador de moneda (lo mantenemos aquí, o puedes exportarlo desde useFinanceData)
    const formatCurrency = (value) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(typeof value === 'number' ? value : 0);

    // Los datos ahora vienen de annualSummary
    const { totalActualIncome, totalActualExpenses, annualBalance, currentNetWorth, totalPortfolioValue } = annualSummary;


    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-900 min-h-screen text-white dark:bg-gray-900 dark:text-gray-100">
            <h2 className="text-3xl font-bold text-white dark:text-gray-200 mb-6 border-b-2 border-blue-600 pb-2">Mi Perfil</h2>

            <div className="flex border-b border-gray-700 mb-6">
                <button
                    className={`py-2 px-4 ${activeTab === 'info' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400 hover:text-gray-200'}`}
                    onClick={() => { setActiveTab('info'); setIsEditingProfile(false); }}
                >
                    Información General
                </button>
                {canChangePassword && (
                    <button
                        className={`py-2 px-4 ${activeTab === 'password' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400 hover:text-gray-200'}`}
                        onClick={() => { setActiveTab('password'); setIsEditingProfile(false); }}
                    >
                        Cambiar Contraseña
                    </button>
                )}
                <button
                    className={`py-2 px-4 ${activeTab === 'delete' ? 'border-b-2 border-red-500 text-red-500' : 'text-gray-400 hover:text-gray-200'}`}
                    onClick={() => { setActiveTab('delete'); setIsEditingProfile(false); }}
                >
                    Eliminar Cuenta
                </button>
            </div>

            <div className="bg-gray-700 p-6 rounded-lg shadow-md dark:bg-gray-800">
                {activeTab === 'info' && (
                    <>
                        {!isEditingProfile ? (
                            <div className="flex flex-col items-center justify-center p-4">
                                {/* Avatar - AHORA CLICKEABLE */}
                                <div 
                                    className="relative w-28 h-28 mb-4 cursor-pointer" 
                                    onClick={() => setShowAvatarModal(true)} 
                                >
                                    <img
                                        src={currentUser?.photoURL || userConfig?.profile?.avatarId ? avatars.find(a => a.id === userConfig.profile.avatarId)?.url || currentUser?.photoURL || '/default-avatar.png' : '/default-avatar.png'}
                                        alt="Avatar de usuario"
                                        className="w-full h-full rounded-full object-cover border-4 border-blue-500 shadow-lg"
                                    />
                                    {/* Icono de edición sobre el avatar */}
                                    <div className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 text-white shadow-md hover:bg-blue-700 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zm-7.536 7.536l2.828 2.828-.793.793c-.156.156-.216.368-.179.576l.115.65.65.115c.208.037.42.022.576-.179l.793-.793L15.364 9l-2.828-2.828L5.05 13.95zm-2.828 2.828l-.793.793L3 17.071V19h1.929l3.536-3.536-.793-.793L3 17.071V19h1.929l3.536-3.536z" />
                                        </svg>
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-white dark:text-gray-200 mb-2">
                                    {userConfig?.profile?.name || currentUser?.displayName || 'Usuario'}
                                </h3>
                                {/* Biografía/Lema */}
                                {userConfig?.profile?.bio && (
                                    <p className="text-gray-400 text-md italic mb-4 max-w-md text-center">{userConfig.profile.bio}</p>
                                )}
                                <p className="text-gray-400 text-sm mb-6">Miembro desde: {currentUser?.metadata?.creationTime ? new Date(currentUser.metadata.creationTime).toLocaleDateString() : 'N/A'}</p>

                                <div className="w-full max-w-md text-left">
                                    <h4 className="text-lg font-semibold text-white dark:text-gray-200 mb-3 border-b border-gray-600 pb-2">Detalles de la Cuenta</h4>
                                    <p className="mb-2 text-gray-300"><span className="font-semibold text-white">Email:</span> {currentUser?.email || 'N/A'}</p>
                                </div>

                                {/* Panel de Estadísticas Clave */}
                                <div className="w-full max-w-md mt-8 p-4 bg-gray-800 rounded-lg shadow-md border border-gray-700 dark:bg-gray-800 dark:border-gray-700">
                                    <h4 className="text-lg font-semibold text-white dark:text-gray-200 mb-3 border-b border-gray-600 pb-2">Estadísticas Clave ({currentYear})</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                        <div className="flex justify-between items-center text-gray-300">
                                            <span>Ingresos Anuales:</span>
                                            <span className="font-bold text-green-400">{formatCurrency(totalActualIncome)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-gray-300">
                                            <span>Gastos Anuales:</span>
                                            <span className="font-bold text-red-400">{formatCurrency(totalActualExpenses)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-gray-300">
                                            <span>Balance Anual:</span>
                                            <span className={`font-bold ${annualBalance >= 0 ? 'text-blue-400' : 'text-orange-400'}`}>{formatCurrency(annualBalance)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-gray-300">
                                            <span>Patrimonio Neto:</span>
                                            <span className={`font-bold ${currentNetWorth >= 0 ? 'text-green-400' : 'text-red-400'}`}>{formatCurrency(currentNetWorth)}</span>
                                        </div>
                                        {totalPortfolioValue !== 0 && ( // Muestra solo si hay valor de cartera
                                            <div className="flex justify-between items-center text-gray-300">
                                                <span>Valor de Cartera:</span>
                                                <span className="font-bold text-purple-400">{formatCurrency(totalPortfolioValue)}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <button
                                    onClick={() => setIsEditingProfile(true)}
                                    className="mt-6 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Editar Perfil
                                </button>
                            </div>
                        ) : (
                            <UpdateProfileForm
                                currentUser={currentUser}
                                userConfig={userConfig}
                                updateConfig={updateConfig}
                                onEditComplete={handleProfileEditComplete} 
                                onCancel={() => setIsEditingProfile(false)} 
                            />
                        )}
                    </>
                )}
                {activeTab === 'password' && canChangePassword && (
                    <ChangePasswordForm user={currentUser} />
                )}
                {activeTab === 'delete' && (
                    <DeleteAccountSection user={currentUser} />
                )}
            </div>

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

export default ProfilePage;