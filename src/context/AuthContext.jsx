import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
    onAuthStateChanged, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    GoogleAuthProvider, 
    signInWithPopup,
    getAdditionalUserInfo // Importante para detectar nuevos usuarios
} from 'firebase/auth';
import { auth } from '../firebase'; // Asegúrate de que esta ruta a tu config de Firebase sea correcta

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Función para registro con email y contraseña
    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    // Función para inicio de sesión con email y contraseña
    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    // Función para cerrar sesión
    function logout() {
        return signOut(auth);
    }

    // Función para iniciar sesión o registrarse con Google
    async function loginWithGoogle() {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            
            // Obtenemos la información adicional para saber si es un usuario nuevo
            const additionalInfo = getAdditionalUserInfo(result);
            
            // Devolvemos 'true' si es un usuario nuevo, 'false' si ya existía.
            // Esto permite a los componentes decidir a dónde redirigir.
            return additionalInfo.isNewUser; 
            
        } catch (error) {
            console.error("Error durante el inicio de sesión con Google", error);
            throw error; // Propagamos el error para que el componente lo maneje
        }
    }

    // Efecto para escuchar cambios en el estado de autenticación
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            setCurrentUser(user);
            setLoading(false);
        });
        return unsubscribe; // Se desuscribe al desmontar el componente
    }, []);

    const value = {
        currentUser,
        loading,
        signup,
        login,
        logout,
        loginWithGoogle,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}