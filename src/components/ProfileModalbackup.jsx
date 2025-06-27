import React, { useState, useEffect } from 'react';
import avatars from '../utils/avatars'; // Asumo que este util existe

// --- Icono de Logout para el botón ---
const LogoutIcon = () => (
    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
);


function ProfileModal({ isOpen, onClose, userProfile, updateProfile, onLogout }) {
    const [name, setName] = useState('');
    const [selectedAvatarId, setSelectedAvatarId] = useState('default');

    useEffect(() => {
        if (isOpen && userProfile) {
            setName(userProfile.name || '');
            setSelectedAvatarId(userProfile.avatarId || 'default');
        }
    }, [isOpen, userProfile]);

    if (!isOpen) return null;

    const handleSave = async () => {
        const updatedProfile = {
            name: name.trim(),
            avatarId: selectedAvatarId
        };
        // Llama a la función updateConfig con el objeto de perfil completo
        await updateProfile({ profile: updatedProfile });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
            <div className="bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-md border border-gray-700">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Editar Perfil</h2>
                
                <div className="mb-6">
                    <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="profileName">
                        Nombre
                    </label>
                    <input
                        type="text"
                        id="profileName"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-gray-700 border border-gray-600 text-white shadow-inner appearance-none rounded-lg w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Tu nombre o alias"
                    />
                </div>
                
                <div className="mb-8">
                    <label className="block text-gray-400 text-sm font-bold mb-2">
                        Seleccionar Avatar
                    </label>
                    <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                        {avatars.map((avatar) => (
                            <img
                                key={avatar.id}
                                src={avatar.url}
                                alt={`Avatar ${avatar.id}`}
                                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full cursor-pointer border-2 transition-all duration-200 ${
                                    selectedAvatarId === avatar.id 
                                    ? 'border-blue-500 scale-110' 
                                    : 'border-gray-700 hover:border-gray-500'
                                }`}
                                onClick={() => setSelectedAvatarId(avatar.id)}
                            />
                        ))}
                    </div>
                </div>

                {/* --- SECCIÓN DE BOTONES ACTUALIZADA --- */}
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-700">
                    {/* Botón de Logout a la izquierda */}
                    <button
                        onClick={onLogout}
                        className="flex items-center bg-red-800/80 hover:bg-red-700 text-red-300 hover:text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-200"
                    >
                        <LogoutIcon />
                        Cerrar Sesión
                    </button>

                    {/* Botones de Cancelar y Guardar a la derecha */}
                    <div className="flex gap-4">
                        <button
                            onClick={onClose}
                            className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-200"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-200"
                        >
                            Guardar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfileModal;
