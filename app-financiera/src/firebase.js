import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Dominio que Google muestra en su ventana de inicio de sesión ("Ir a ...") y
// que sirve los ayudantes de autenticación (/__/auth/*). Si la app se sirve
// desde uno de nuestros dominios (conectados a Firebase Hosting, que ya sirve
// esos ayudantes y los tiene autorizados en Google), se usa ese dominio; en la
// vista previa o en local, el de Firebase.
const DOMINIOS_PROPIOS = ['finanzas.franquizb.com', 'finanziapp.com', 'www.finanziapp.com'];
const authDomain = (typeof window !== 'undefined' && DOMINIOS_PROPIOS.includes(window.location.hostname))
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
