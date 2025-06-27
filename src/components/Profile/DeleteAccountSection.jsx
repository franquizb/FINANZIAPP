// src/components/Profile/DeleteAccountSection.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { deleteUser, reauthenticateWithCredential, EmailAuthProvider, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";

function DeleteAccountSection({ user }) {
    const [confirmText, setConfirmText] = useState('');
    const [password, setPassword] = useState(''); // Para reautenticación con email/password
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { logout } = useAuth(); // Asumiendo que tienes una función logout

    const handleDeleteAccount = async () => {
        setError('');
        setMessage('');

        if (confirmText !== 'ELIMINAR MI CUENTA') {
            setError('Por favor, escribe "ELIMINAR MI CUENTA" para confirmar.');
            return;
        }

        try {
            // Reautenticar al usuario antes de eliminar
            // Esto es crucial para la seguridad.
            // La forma de reautenticar depende del proveedor de inicio de sesión.
            let credential;
            const providerId = user.providerData[0]?.providerId; // Asumimos el primer proveedor para reautenticar

            if (providerId === EmailAuthProvider.PROVIDER_ID) {
                if (!password) {
                    setError('Por favor, introduce tu contraseña actual para confirmar.');
                    return;
                }
                credential = EmailAuthProvider.credential(user.email, password);
            } else if (providerId === GoogleAuthProvider.PROVIDER_ID) {
                // Para Google, Apple, etc., la reautenticación es con un popup
                // Esto es más complejo y a menudo se maneja con un `signInWithPopup`
                // Aquí simplificamos, pero en producción deberías manejarlo con un popup
                // o un flujo que pida al usuario iniciar sesión de nuevo con su proveedor social.
                // Por ahora, solo mostraremos un mensaje si no es email/password.
                setError('Para eliminar tu cuenta, por favor, inicia sesión de nuevo con tu proveedor social (Google/Apple) y vuelve a intentarlo.');
                return;
            } else if (providerId === OAuthProvider.PROVIDER_ID) { // Apple
                 setError('Para eliminar tu cuenta, por favor, inicia sesión de nuevo con tu proveedor social (Google/Apple) y vuelve a intentarlo.');
                 return;
            } else {
                setError('No se puede reautenticar con este tipo de proveedor. Por favor, contacta a soporte.');
                return;
            }

            // Si es email/password, intentamos reautenticar
            if (credential) {
                 await reauthenticateWithCredential(user, credential);
            }


            // Eliminar la cuenta de autenticación de Firebase
            await deleteUser(user);

            // Importante: También deberías eliminar los datos del usuario en Firestore.
            // La forma más segura de hacer esto es con una Cloud Function que se dispara
            // cuando un usuario es eliminado (onDelete).
            // Si no tienes Cloud Functions, tendrías que eliminar los documentos
            // [uid]_config y [uid]_data directamente aquí (menos seguro para datos sensibles).
            // Ejemplo (NO RECOMENDADO PARA PRODUCCIÓN SIN REVISIÓN DE SEGURIDAD):
            // import { doc, deleteDoc } from 'firebase/firestore';
            // import { db } from '../../firebase'; // Si tienes una instancia de Firestore
            // await deleteDoc(doc(db, 'users', `${user.uid}_config`));
            // await deleteDoc(doc(db, 'users', `${user.uid}_data`));
            // FIN DEL EJEMPLO

            setMessage('Cuenta eliminada exitosamente.');
            logout(); // Limpia el estado de autenticación en tu aplicación
            navigate('/'); // Redirige a la página de inicio o de registro
        } catch (err) {
            if (err.code === 'auth/requires-recent-login') {
                setError('Por seguridad, debes haber iniciado sesión recientemente para eliminar tu cuenta. Por favor, cierra sesión y vuelve a iniciarla, luego intenta de nuevo.');
            } else if (err.code === 'auth/wrong-password') {
                setError('Contraseña incorrecta.');
            } else {
                setError(err.message);
            }
            console.error("Error al eliminar cuenta:", err);
        }
    };

    return (
        <div className="mt-8">
            <h3 className="text-xl font-semibold text-red-400 dark:text-red-300 mb-3">Eliminar Cuenta</h3>
            <p className="text-gray-300 mb-4">Esta acción es irreversible y eliminará permanentemente tu cuenta y todos tus datos.</p>

            {user.providerData[0]?.providerId === EmailAuthProvider.PROVIDER_ID && (
                <div className="mb-4">
                    <label htmlFor="deletePassword" className="block text-sm font-medium text-gray-300">Introduce tu contraseña para confirmar:</label>
                    <input
                        type="password"
                        id="deletePassword"
                        className="mt-1 block w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm text-white"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
            )}

            <div className="mb-4">
                <label htmlFor="confirmDelete" className="block text-sm font-medium text-gray-300">Escribe "ELIMINAR MI CUENTA" para confirmar:</label>
                <input
                    type="text"
                    id="confirmDelete"
                    className="mt-1 block w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm text-white"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    required
                />
            </div>

            <button
                onClick={handleDeleteAccount}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
                Confirmar Eliminación de Cuenta
            </button>
            {message && <p className="text-green-500 text-sm mt-2">{message}</p>}
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
    );
}

export default DeleteAccountSection;