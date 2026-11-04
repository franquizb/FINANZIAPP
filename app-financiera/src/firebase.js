import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Dominio que Google muestra en su ventana de inicio de sesión ("Ir a ...") y
// que sirve los ayudantes de autenticación (/__/auth/*). Para usar el dominio
// propio hace falta, ANTES, autorizar en Google Cloud Console (APIs y
// servicios → Credenciales → cliente OAuth "Web client (auto created by
// Google Service)") la URI de redirección https://<dominio>/__/auth/handler y
// el origen https://<dominio>; si no, Google responde "redirect_uri_mismatch"
// y nadie puede entrar con Google. Mientras USAR_DOMINIO_PROPIO sea false se
// usa el dominio de Firebase, que siempre está autorizado.
const USAR_DOMINIO_PROPIO = true;
const DOMINIOS_PROPIOS = ['finanzas.franquizb.com', 'finanziapp.com', 'www.finanziapp.com'];
const authDomain = (USAR_DOMINIO_PROPIO && typeof window !== 'undefined' && DOMINIOS_PROPIOS.includes(window.location.hostname))
    ? window.location.hostname
    : 'personal-franquizb.firebaseapp.com';

// Configuración de tu proyecto de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDbTnzC7upZn_hItzl5dK8oZn3d10Ut2qw",
    authDomain,
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
