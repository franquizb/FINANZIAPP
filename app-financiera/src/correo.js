// Correos propios (functions/correo.js): verificación y cambio de contraseña
// enviados con Brevo desde noreply@finanziapp.com, con el enlace en
// finanziapp.com y en el idioma del usuario. Si la función no está disponible,
// quien llama vuelve al envío estándar de Firebase.
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from './firebase';
import { REGION_FUNCIONES } from './suscripcion';

const llamar = async (nombre, datos) => (await httpsCallable(getFunctions(app, REGION_FUNCIONES), nombre)(datos)).data;
const origen = () => (typeof window !== 'undefined' ? window.location.origin : '');

export const enviarVerificacionPropia = (idioma) => llamar('enviarCorreoVerificacion', { idioma, origen: origen() });
export const enviarContrasenaPropia = (email, idioma) => llamar('enviarCorreoContrasena', { email, idioma, origen: origen() });
// Límite de envíos alcanzado (uno por minuto): no tiene sentido reintentar con Firebase.
export const esLimiteCorreo = (e) => e?.code === 'functions/resource-exhausted';
