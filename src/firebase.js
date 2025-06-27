// src/firebase.js
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  EmailAuthProvider,
  OAuthProvider,
  // updateProfile, // No se importan directamente aquí si solo se usan en componentes
  // updatePassword, // No se importan directamente aquí si solo se usan en componentes
  // reauthenticateWithCredential, // No se importan directamente aquí si solo se usan en componentes
  // deleteUser // No se importan directamente aquí si solo se usan en componentes
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

// Tu configuración de Firebase para la aplicación web
const firebaseConfig = {
  apiKey: "AIzaSyDbTnzC7upZn_hItzl5dK8oZn3d10Ut2qw", // Reemplaza con tu apiKey real
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
export const functions = getFunctions(app, 'us-central1'); // Mantén tu región de funciones

// PROVEEDORES DE AUTENTICACIÓN
export const googleProvider = new GoogleAuthProvider();
export const emailProvider = new EmailAuthProvider();
export const appleProvider = new OAuthProvider('apple.com'); // Proveedor de Apple

// PARA EMULADORES (Solo se importan y conectan si estamos en localhost)
if (window.location.hostname === "localhost") {
  // Las importaciones de connectEmulator deben estar dentro del bloque condicional
  // para que no se incluyan en el bundle de producción
  const { connectAuthEmulator } = require('firebase/auth');
  const { connectFirestoreEmulator } = require('firebase/firestore');
  const { connectFunctionsEmulator } = require('firebase/functions');

  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(db, "http://localhost:8080");
  connectFunctionsEmulator(functions, "http://localhost:5001");
  console.log("Conectado a emuladores de Firebase");
}