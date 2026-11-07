// Códigos por correo (functions/correo.js): verificación de la cuenta y cambio
// de contraseña con un código de 6 cifras enviado con Brevo desde
// noreply@finanziapp.com, en el idioma del usuario. Si la función no está
// disponible, quien llama vuelve al enlace estándar de Firebase.
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from './firebase';
import { REGION_FUNCIONES } from './suscripcion';

const llamar = async (nombre, datos) => (await httpsCallable(getFunctions(app, REGION_FUNCIONES), nombre)(datos)).data;

export const enviarCodigoVerificacion = (idioma) => llamar('enviarCodigoVerificacion', { idioma });
export const verificarCodigo = (codigo) => llamar('verificarCodigo', { codigo });
export const enviarCodigoContrasena = (email, idioma) => llamar('enviarCodigoContrasena', { email, idioma });
export const cambiarContrasenaConCodigo = (email, codigo, nueva) => llamar('cambiarContrasenaConCodigo', { email, codigo, nueva });

// Motivo que devuelve la función: incorrecto | intentos | caducado | limite | correo | contrasena.
export const motivoCodigo = (e) => e?.details?.motivo || null;
// Límite de correos (uno por minuto): no tiene sentido reintentar con Firebase.
export const esLimiteCorreo = (e) => e?.code === 'functions/resource-exhausted' && motivoCodigo(e) !== 'intentos';
