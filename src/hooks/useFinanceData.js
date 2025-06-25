import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

// Helper para obtener el nombre del mes
const getMonthName = (monthIndex) => {
  const months = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  return months[monthIndex];
};

// Estructura de categorías por defecto para la inicialización
const defaultInitialCategories = {
  Ingresos: ['Nómina'],
  GastosEsenciales: ['Alquiler/Hipoteca', 'Comida', 'Suministros'],
  GastosDiscrecionales: ['Ocio', 'Restaurantes'],
  PagoDeDeudas: ['Tarjeta de Crédito', 'Préstamos'],
  AhorroEInversion: ['Fondo de Emergencia', 'Inversión General'],
  Activos: {
    'Cuentas Bancarias': ['Efectivo', 'Cuentas Corrientes', 'Cuentas Ahorro'],
    'Inversiones': ['Acciones', 'Fondos de Inversión', 'Criptomonedas', 'Planes de Pensiones'],
    'Propiedades': ['Inmuebles'],
    'Otros Activos': ['Otros Activos']
  },
  Pasivos: {
    'Deudas': ['Hipoteca', 'Préstamo Coche', 'Préstamos Personales', 'Deuda Tarjetas'],
    'Otros Pasivos': ['Otros Pasivos']
  }
};

// Objeto de configuración "esqueleto" para renderizar la UI inmediatamente.
const skeletonUserConfig = {
  profile: { name: 'Cargando...', avatarId: 'default' },
  categories: defaultInitialCategories,
  defaultYear: new Date().getFullYear().toString(),
  language: 'es',
  categoryDisplayNames: {},
  ActivosGroupOrder: Object.keys(defaultInitialCategories.Activos),
  PasivosGroupOrder: Object.keys(defaultInitialCategories.Pasivos),
};


const useFinanceData = () => {
  const { currentUser } = useAuth();
  const [userConfig, setUserConfig] = useState(skeletonUserConfig);
  const [financeData, setFinanceData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear().toString());
  const [isConfigReady, setIsConfigReady] = useState(false);

  // EFECTO 1: Suscripción a la configuración del usuario
  useEffect(() => {
    if (!currentUser || !currentUser.uid) {
      setLoading(false);
      setUserConfig(skeletonUserConfig);
      setFinanceData({});
      setIsConfigReady(false);
      return;
    }

    setLoading(true);
    setIsConfigReady(false);
    const configDocRef = doc(db, 'users', `${currentUser.uid}_config`);

    const unsubscribeConfig = onSnapshot(configDocRef, async (snapshot) => {
      if (snapshot.exists()) {
        const configData = snapshot.data();
        setUserConfig(configData);
        setCurrentYear(configData.defaultYear || new Date().getFullYear().toString());
        setIsConfigReady(true);
      } else {
        const newConfig = {
          categories: defaultInitialCategories,
          defaultYear: new Date().getFullYear().toString(),
          language: 'es',
          categoryDisplayNames: {},
          ActivosGroupOrder: Object.keys(defaultInitialCategories.Activos),
          PasivosGroupOrder: Object.keys(defaultInitialCategories.Pasivos),
          profile: { name: currentUser.email.split('@')[0], avatarId: 'default' }
        };
        try {
          await setDoc(configDocRef, newConfig);
        } catch (err) {
            console.error("Error creando la configuración inicial:", err);
            setError("Fallo al inicializar la configuración.");
            setLoading(false);
        }
      }
    }, (err) => {
      console.error("Error en el listener de configuración:", err);
      setError("Fallo al cargar la configuración.");
      setLoading(false);
    });

    return () => unsubscribeConfig();
  }, [currentUser]);


  // EFECTO 2: Suscripción a los datos financieros
  useEffect(() => {
    if (!currentUser || !currentUser.uid || !isConfigReady) {
      setFinanceData({});
      return;
    }

    const dataDocRef = doc(db, 'users', `${currentUser.uid}_data`);
    const unsubscribeData = onSnapshot(dataDocRef, (snapshot) => {
      const allData = snapshot.exists() ? snapshot.data() : {};
      setFinanceData(allData);
      setLoading(false); 
    }, (err) => {
      console.error("Error en el listener de datos financieros:", err);
      setError("Fallo al cargar datos financieros.");
      setLoading(false);
    });

    return () => unsubscribeData();
  }, [currentUser, isConfigReady]);


  // FUNCIONES DE ACTUALIZACIÓN
  const updateFinanceData = useCallback(async (newData) => {
    if (!currentUser || !currentUser.uid) return false;
    // No establecemos 'loading' a true para una experiencia más fluida (actualización optimista)
    try {
      const dataDocRef = doc(db, 'users', `${currentUser.uid}_data`);
      await setDoc(dataDocRef, newData, { merge: true });
      return true;
    } catch (err) {
      console.error("Error al actualizar datos financieros:", err);
      setError("Fallo al actualizar datos financieros.");
      // Asegurarse de que loading se desactive si hay un error
      setLoading(false); 
      return false;
    }
  }, [currentUser]);

  const updateConfig = useCallback(async (newConfig) => {
    if (!currentUser || !currentUser.uid) return false;
    try {
      const configDocRef = doc(db, 'users', `${currentUser.uid}_config`);
      await setDoc(configDocRef, newConfig, { merge: true });
      return true;
    } catch (err) {
      console.error("Error al actualizar la configuración:", err);
      setError("Fallo al actualizar la configuración.");
      setLoading(false);
      return false;
    }
  }, [currentUser]);

  console.log("DEBUG: Estado del hook useFinanceData", { 
    currentUser: currentUser?.uid, 
    isConfigReady, 
    financeData, 
    loading, 
    error 
  });
    
  return {
    allFinanceData: financeData,
    userConfig,
    loading,
    error,
    currentYear,
    setCurrentYear,
    updateFinanceData,
    updateConfig,
    getMonthName
  };
};

export default useFinanceData;
