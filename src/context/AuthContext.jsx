// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile // <-- Asegúrate de importar updateProfile si lo vas a usar directamente aquí
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore'; 
import { auth, db } from '../firebase';
import avatars from '../utils/avatars'; // <-- Importa los avatares para initializeUserData

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Define las categorías iniciales con la nueva estructura anidada para Activos/Pasivos
  const initialCategories = {
    Ingresos: ['Sueldo', 'Alquiler', 'Otros'],
    GastosEsenciales: ['Vivienda', 'Transporte', 'Alimentación', 'Salud', 'Suministros', 'Educación', 'Impuestos', 'Otros'],
    GastosDiscrecionales: ['Ocio', 'Restaurantes', 'Compras', 'Viajes', 'Regalos', 'Susripciones', 'Otros'],
    PagoDeDeudas: ['Hipoteca', 'Coche', 'Personales', 'Tarjetas', 'Otros'],
    AhorroEInversion: ['Fondo de Emergencia', 'Inversiones L/P', 'Plan de Pensiones', 'Metas Específicas', 'Otros'],
    
    // Nueva estructura anidada para Activos
    Activos: {
      'Cuentas Bancarias': ['Efectivo', 'Cuentas Corrientes', 'Cuentas Ahorro'],
      'Inversiones': ['Acciones', 'Fondos de Inversión', 'Criptomonedas', 'Planes de Pensiones'],
      'Propiedades': ['Inmuebles'],
      'Otros Activos': ['Otros Activos'] 
    },
    // Nueva estructura anidada para Pasivos
    Pasivos: {
      'Deudas': ['Hipoteca', 'Préstamo Coche', 'Préstamos Personales', 'Deuda Tarjetas'],
      'Otros Pasivos': ['Otros Pasivos'] 
    }
  };

  // Función para refrescar el usuario (útil después de updateProfile)
  const refreshUser = useCallback(async () => {
    if (auth.currentUser) {
      // Fuerza la recarga de los datos del usuario desde Firebase
      // Esto es crucial para obtener la info actualizada (displayName, photoURL)
      await auth.currentUser.reload();
      setCurrentUser(auth.currentUser); // Actualizar el estado con el usuario recargado
      console.log("AuthContext: refreshUser ejecutado. Nuevo currentUser:", auth.currentUser);
    }
  }, []); // Dependencias vacías, ya que auth.currentUser es la referencia directa y no cambia en cada render

  const initializeUserData = async (uid, email) => {
    const currentYear = new Date().getFullYear().toString();
    const months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];

    const monthlyInitialState = {};
    months.forEach(month => {
      monthlyInitialState[month] = { budgeted: {}, actual: [] };
    });

    // Obtener la información actual del usuario de Firebase Auth
    // Esto es importante si el usuario se registró con Google y ya tiene un nombre/foto
    const firebaseUser = auth.currentUser; 
    const initialProfileName = firebaseUser?.displayName || email.split('@')[0];
    const initialAvatarId = firebaseUser?.photoURL ? (avatars.find(a => a.url === firebaseUser.photoURL)?.id || 'default') : 'default';

    await setDoc(doc(db, 'users', `${uid}_config`), {
      defaultYear: currentYear,
      categories: initialCategories,
      email: email, 
      createdAt: new Date(),
      language: 'es', 
      categoryDisplayNames: {},
      ActivosGroupOrder: Object.keys(initialCategories.Activos), 
      PasivosGroupOrder: Object.keys(initialCategories.Pasivos),
      profile: {
        name: initialProfileName,
        avatarId: initialAvatarId,
        bio: '', // <-- ¡AÑADIDO: Campo de biografía inicial!
      }
    });

    // Documento [uid]_data con el año por defecto y estructura básica
    await setDoc(doc(db, 'users', `${uid}_data`), {
      [currentYear]: {
        budget: {}, 
        monthly: monthlyInitialState,
        netWorth: { assets: {}, liabilities: {} },
      },
    });
    console.log("User data initialized for:", email);
  };

  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // No llamas a initializeUserData aquí si ya lo haces después de updateProfile en RegisterPage
        // O si initializeUserData es la única fuente de la config inicial de Firestore.
        // Si initializeUserData es solo para crear datos si no existen, entonces está bien.
        await initializeUserData(userCredential.user.uid, userCredential.user.email);
        return userCredential;
      });
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider)
      .then(async (userCredential) => {
        const userConfigRef = doc(db, 'users', `${userCredential.user.uid}_config`);
        const userConfigSnap = await getDoc(userConfigRef);

        if (!userConfigSnap.exists()) {
          await initializeUserData(userCredential.user.uid, userCredential.user.email);
        }
        return userCredential;
      });
  };

  const logout = () => {
    return signOut(auth);
  };

  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      console.log("AuthContext: onAuthStateChanged - user:", user);
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe; 
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    loading,
    refreshUser // <-- ¡AÑADIDO: Ahora refreshUser se provee!
  };

  return (
    <AuthContext.Provider value={value}>
      {console.log("AuthContext: Providing value - currentUser:", value.currentUser, "loading:", value.loading)}
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};