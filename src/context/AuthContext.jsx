// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore'; 
import { auth, db } from '../firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Define las categorías iniciales con la nueva estructura anidada para Activos/Pasivos
  const initialCategories = {
    Ingresos: ['Sueldo', 'Alquiler', 'Otros'],
    GastosEsenciales: ['Vivienda', 'Transporte', 'Alimentación', 'Salud', 'Suministros', 'Educación', 'Impuestos', 'Otros'],
    GastosDiscrecionales: ['Ocio', 'Restaurantes', 'Compras', 'Viajes', 'Regalos', 'Suscripciones', 'Otros'],
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

    // Documento [uid]_config
    await setDoc(doc(db, 'users', `${uid}_config`), {
      defaultYear: currentYear,
      categories: initialCategories, // Usa la nueva estructura aquí
      email: email, 
      createdAt: new Date(),
      language: 'es', 
      categoryDisplayNames: {},
      ActivosGroupOrder: Object.keys(initialCategories.Activos), 
      PasivosGroupOrder: Object.keys(initialCategories.Pasivos),
      // NUEVO: Perfil de usuario por defecto
      profile: {
        name: email.split('@')[0], // Nombre inicial tomado del email
        avatarId: 'default' // ID del avatar por defecto
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
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};