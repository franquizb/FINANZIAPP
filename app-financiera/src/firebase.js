import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Configuración de tu proyecto de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDbTnzC7upZn_hItzl5dK8oZn3d10Ut2qw",
    authDomain: "personal-franquizb.firebaseapp.com",
    projectId: "personal-franquizb",
    storageBucket: "personal-franquizb.firebasestorage.app",
    messagingSenderId: "252802857674",
    appId: "1:252802857674:web:59b13a4eaadca714651233",
    measurementId: "G-K369TETQ62"
};

let app, auth, analytics, db;

try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    if (typeof window !== 'undefined') {
        analytics = getAnalytics(app);
    }
} catch (error) {
    console.error("Firebase no se pudo inicializar:", error);
}

export { app, auth, analytics, db };
