// src/components/UserMenuModal.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Para la función de logout
import avatars from '../utils/avatars'; // Para el avatar

function UserMenuModal({ isOpen, onClose, currentUser, userConfig }) {
    const navigate = useNavigate();
    const { logout } = useAuth(); // Obtener la función de logout del AuthContext

    if (!isOpen) return null;

    // Obtener el avatar actual del usuario
    const currentAvatarUrl = userConfig?.profile?.avatarId
        ? avatars.find(a => a.id === userConfig.profile.avatarId)?.url || currentUser?.photoURL || '/avatars/default-avatar.png'
        : currentUser?.photoURL || '/avatars/default-avatar.png';

    const handleEditProfileClick = () => {
        navigate('/settings'); // Navega a la página de Configuración
        onClose(); // Cierra el modal
    };

    const handleLogoutClick = async () => {
        try {
            await logout();
            navigate('/login'); // Redirige al login después de cerrar sesión
            onClose(); // Cierra el modal
        } catch (error) {
            console.error("Error al cerrar sesión desde el modal:", error);
            // Podrías mostrar un mensaje de error al usuario aquí
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
            onClick={onClose} // Cierra el modal al hacer clic fuera
        >
            <div 
                className="bg-gray-800 rounded-lg shadow-xl text-white w-72 p-4 animate-fade-in-up" // Animate con Tailwind
                onClick={(e) => e.stopPropagation()} // Evita que el clic dentro del modal lo cierre
            >
                {/* Info de Usuario */}
                <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-700">
                    <img 
                        src={currentAvatarUrl} 
                        alt="Avatar" 
                        className="w-12 h-12 rounded-full border-2 border-blue-500 object-cover" 
                    />
                    <div className="flex-1 overflow-hidden">
                        <p className="font-bold truncate text-lg">{userConfig?.profile?.name || currentUser?.displayName || currentUser?.email}</p>
                        <p className="text-sm text-gray-400 truncate">{currentUser?.email}</p>
                    </div>
                </div>

                {/* Acciones como Filas/Items Clickables */}
                <ul className="space-y-1">
                    <li 
                        className="flex items-center p-3 rounded-md hover:bg-gray-700 cursor-pointer transition-colors duration-200"
                        onClick={handleEditProfileClick}
                    >
                        <svg className="w-5 h-5 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.827 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.827 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.827-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.827-3.31 2.37-2.37.996.608 2.228.077 2.573-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        <span className="text-base">Editar Perfil</span>
                    </li>
                    <li 
                        className="flex items-center p-3 rounded-md hover:bg-red-700 cursor-pointer transition-colors duration-200 text-red-400"
                        onClick={handleLogoutClick}
                    >
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                        <span className="text-base">Cerrar Sesión</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default UserMenuModal;