/// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

// Tu configuración de Firebase para la aplicación web
const firebaseConfig = {
  apiKey: "AIzaSyDbTnzC7upZn_hItzl5dK8oZn3d10Ut2qw", // Tus valores reales
  authDomain: "personal-franquizb.firebaseapp.com",
  projectId: "personal-franquizb",
  storageBucket: "personal-franquizb.firebasestorage.app",
  messagingSenderId: "252802857674",
  appId: "1:252802857674:web:eb8524604cdcf86a651233",
  measurementId: "G-ST049043T4"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Obtén instancias de los servicios que usarás
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app, 'us-central1');

export default app;
