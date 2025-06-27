// src/components/Profile/ChangePasswordForm.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { useAuth } from "../../context/AuthContext";

function ChangePasswordForm({ user }) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (newPassword !== confirmNewPassword) {
            setError('Las nuevas contraseñas no coinciden.');
            return;
        }
        if (newPassword.length < 6) {
            setError('La nueva contraseña debe tener al menos 6 caracteres.');
            return;
        }

        try {
            // 1. Reautenticar al usuario
            // Solo para usuarios con email/password
            if (user.email && currentPassword) {
                 const credential = EmailAuthProvider.credential(user.email, currentPassword);
                 await reauthenticateWithCredential(user, credential);
            } else {
                 // Si el usuario no tiene email/password o no introduce la contraseña actual,
                 // Firebase Auth requerirá un re-login reciente.
                 // Para proveedores sociales, la reautenticación es con un popup.
                 // Aquí simplemente informamos al usuario.
                 setError('Para cambiar la contraseña, debes haber iniciado sesión recientemente con tus credenciales actuales. Si usas un proveedor social, cierra sesión y vuelve a iniciarla con ese proveedor, luego intenta cambiar la contraseña.');
                 return;
            }

            // 2. Actualizar la contraseña
            await updatePassword(user, newPassword);
            setMessage('Contraseña actualizada exitosamente.');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch (err) {
            if (err.code === 'auth/wrong-password') {
                setError('La contraseña actual es incorrecta.');
            } else if (err.code === 'auth/requires-recent-login') {
                setError('Por seguridad, debes haber iniciado sesión recientemente para cambiar tu contraseña. Por favor, cierra sesión y vuelve a iniciarla, luego intenta de nuevo.');
            } else {
                setError(err.message);
            }
            console.error("Error al cambiar contraseña:", err);
        }
    };

    return (
        <div className="mt-8 pt-4 border-t border-gray-600 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-white dark:text-gray-200 mb-3">Cambiar Contraseña</h3>
            {user.providerData.some(p => p.providerId === EmailAuthProvider.PROVIDER_ID) ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300 dark:text-gray-300">Contraseña Actual:</label>
                        <input
                            type="password"
                            id="currentPassword"
                            className="mt-1 block w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 dark:text-gray-300">Nueva Contraseña:</label>
                        <input
                            type="password"
                            id="newPassword"
                            className="mt-1 block w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-300 dark:text-gray-300">Confirmar Nueva Contraseña:</label>
                        <input
                            type="password"
                            id="confirmNewPassword"
                            className="mt-1 block w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Cambiar Contraseña
                    </button>
                    {message && <p className="text-green-500 text-sm mt-2">{message}</p>}
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </form>
            ) : (
                <p className="text-gray-400">Tu cuenta no fue creada con correo electrónico/contraseña. No puedes cambiar la contraseña directamente aquí. Si usas un proveedor social (Google, Apple), gestiona tu contraseña a través de ese servicio.</p>
            )}
        </div>
    );
}

export default ChangePasswordForm;