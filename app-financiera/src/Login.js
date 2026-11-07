import React, { useState, useEffect, useRef } from 'react';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, linkWithCredential, EmailAuthProvider, sendEmailVerification, sendPasswordResetEmail, signOut } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useApp } from './context/AppContext';
import { AJUSTES_ACCESO_POR_DEFECTO, normalizarAjustesAcceso } from './acceso';
import { CORREO_SOPORTE } from './marca';
import { enviarCodigoVerificacion, verificarCodigo, enviarCodigoContrasena, cambiarContrasenaConCodigo, motivoCodigo, esLimiteCorreo } from './correo';

// Duracion de la prueba gratuita, en dias, si el administrador no ha fijado
// otra en ajustes/acceso (Gestion > Roles y permisos). Las reglas de Firestore
// leen el mismo documento y acotan el valor: el cliente no puede alargarla.
const DIAS_PRUEBA = AJUSTES_ACCESO_POR_DEFECTO.diasPrueba;

// Las reglas comparan el trialEndsAt que envia el cliente contra la hora del
// SERVIDOR. Si el reloj del usuario va adelantado, el valor se pasaria del
// limite y Firestore rechazaria el alta entera. Restamos una hora de holgura
// (las reglas ademas toleran un dia).
const MARGEN_RELOJ_MS = 60 * 60 * 1000;

const nuevaPrueba = (dias) =>
  Date.now() + (dias || DIAS_PRUEBA) * 24 * 60 * 60 * 1000 - MARGEN_RELOJ_MS;

// Dias de prueba configurados por el administrador (requiere sesion iniciada).
const diasPruebaConfigurados = async () => {
  try {
    const snap = await getDoc(doc(db, 'ajustes', 'acceso'));
    return normalizarAjustesAcceso(snap.exists() ? snap.data() : null).diasPrueba;
  } catch (e) {
    return DIAS_PRUEBA;
  }
};

// Si el administrador invito a este correo (invitaciones/{correo}), la cuenta
// nace ya como invitada (gratuita), con la fecha limite que fijo el admin.
// Las reglas comprueban que la invitacion existe y que la fecha coincide.
const invitacionDe = async (email) => {
  try {
    const snap = await getDoc(doc(db, 'invitaciones', email));
    return snap.exists() ? { invitado: true, invitadoHasta: snap.data().hasta || 0 } : {};
  } catch (e) {
    return {};
  }
};

// Campos de un perfil nuevo: prueba gratuita y, si procede, invitacion.
// `creado` marca las cuentas posteriores a la verificacion obligatoria del
// correo: las reglas exigen correo verificado para escribir datos en ellas.
const perfilNuevo = async (email) => ({
  isAdmin: false,
  creado: Date.now(),
  trialEndsAt: nuevaPrueba(await diasPruebaConfigurados()),
  ...(await invitacionDe(email))
});

const tienePassword = (u) => (u?.providerData || []).some(p => p.providerId === 'password');
const esCuentaGoogle = (u) => (u?.providerData || []).some(p => p.providerId === 'google.com');
// Cuenta con correo y contraseña, posterior a la verificacion obligatoria, sin verificar.
const requiereVerificacion = (u, perfil) => !!u && !u.emailVerified && !esCuentaGoogle(u) && (perfil?.creado || 0) > 0;
// A donde vuelve el usuario desde los correos de verificacion / restablecer contraseña.
const ajustesAccion = () => ({ url: `${window.location.origin}/login` });

// Alta en la newsletter desde el registro. Solo si la persona marca la casilla
// (sin marcar por defecto): queda la fecha, el idioma y el origen como prueba
// del consentimiento. La baja se hace en Configuración o desde cada correo.
const camposNewsletter = (idioma) => ({ newsletter: true, newsletterFecha: Date.now(), newsletterIdioma: idioma, newsletterOrigen: 'registro' });

// Construye el usuario de sesión a partir del perfil de Firestore. El rol de
// administrador sale SOLO de ese documento (el cliente no puede modificarlo):
// no hay ningún correo privilegiado incrustado en el código.
const sesionDesdePerfil = (uid, email, perfil, displayNameAuth) => {
  const isAdmin = perfil.isAdmin === true;
  return {
    uid,
    email,
    displayName: perfil.displayName || displayNameAuth || email.split('@')[0],
    avatar: perfil.avatar || '👤',
    isAdmin,
    // Sin estos campos, AvisoSuscripcion leeria 0 y le mostraria el cartel de
    // "prueba terminada" incluso a quien acaba de pagar.
    trialEndsAt: perfil.trialEndsAt || 0,
    paidUntil: perfil.paidUntil || 0,
    plan: perfil.plan || 'trial',
    bloqueado: perfil.bloqueado === true,
    // Rol de invitado y excepciones de secciones (solo las escribe el admin).
    invitado: perfil.invitado === true,
    invitadoHasta: perfil.invitadoHasta || 0,
    vistasExtra: Array.isArray(perfil.vistasExtra) ? perfil.vistasExtra : [],
    vistasQuitadas: Array.isArray(perfil.vistasQuitadas) ? perfil.vistasQuitadas : [],
    newsletter: perfil.newsletter === true,
    newsletterFecha: perfil.newsletterFecha || 0,
    // El perfil viene del servidor: la app ya puede mostrar el estado de la suscripción.
    perfilListo: true
  };
};

// `pendiente` llega de la app cuando Firebase restaura una sesion que aun no
// puede entrar: { tipo: 'verificar' | 'completar', fbUser }.
export default function Login({ onLogin, pendiente }) {
  const { t, tf, language } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState('');
  const [loading, setLoading] = useState(false);
  // Cuenta de Google sin contraseña: hay que crearla antes de entrar.
  const [completar, setCompletar] = useState(null);
  // Cuenta nueva con correo: hay que verificarlo antes de entrar.
  const [verificar, setVerificar] = useState(null);
  const [reenvioEn, setReenvioEn] = useState(0);
  const [newsletter, setNewsletter] = useState(false);
  // Código de 6 cifras (verificación o cambio de contraseña).
  const [codigo, setCodigo] = useState('');
  // «¿Has olvidado tu contraseña?»: { email } mientras se escribe el código.
  const [recuperar, setRecuperar] = useState(null);
  const entrando = useRef(false);

  // Los correos de Firebase (verificación, restablecer contraseña) salen en el
  // idioma de la app en vez de en el idioma por defecto del proyecto.
  useEffect(() => { if (auth) auth.languageCode = language; }, [language]);

  // Verificación: primero el código de 6 cifras (correo propio desde
  // noreply@finanziapp.com); si la función falla, el enlace de Firebase, para
  // que el registro no dependa nunca de un servicio externo. Devuelve el modo.
  const enviarVerificacion = async (usuario) => {
    try { await enviarCodigoVerificacion(language); return 'codigo'; }
    catch (e) {
      if (esLimiteCorreo(e)) throw e;
      console.warn('Código por correo no disponible, se usa el enlace de Firebase:', e?.message);
      await sendEmailVerification(usuario, ajustesAccion());
      return 'enlace';
    }
  };
  // Traduce el motivo de un código rechazado.
  const errorDeCodigo = (err) => {
    const m = motivoCodigo(err);
    if (m === 'incorrecto') return tf('loginCodigoMal', { n: err.details?.restantes ?? '' });
    if (m === 'intentos') return t.loginCodigoBloqueado;
    if (m === 'caducado') return t.loginCodigoCaducado;
    if (m === 'contrasena') return t.loginErrPasswordLength;
    if (esLimiteCorreo(err)) return t.loginEsperaCorreo;
    return tf('loginErrAuth', { msg: err?.message || '' });
  };

  useEffect(() => {
    if (!pendiente) return;
    setError(''); setAviso('');
    if (pendiente.tipo === 'verificar') setVerificar({ user: pendiente.fbUser, modo: 'codigo' });
    if (pendiente.tipo === 'completar') { setCompletar({ user: pendiente.fbUser }); setName(pendiente.fbUser.displayName || ''); }
  }, [pendiente]);

  // Cuenta regresiva para reenviar el correo de verificacion.
  useEffect(() => {
    if (reenvioEn <= 0) return undefined;
    const id = setTimeout(() => setReenvioEn(s => s - 1), 1000);
    return () => clearTimeout(id);
  }, [reenvioEn]);

  // Entra en la app con un usuario de Firebase que ya puede hacerlo: lee (o
  // crea) el perfil, apunta el acceso y construye la sesion.
  const entrarConUsuario = async (fbUser) => {
    if (entrando.current) return;
    entrando.current = true;
    try { await entrarConUsuarioSinGuardia(fbUser); } catch (e) { entrando.current = false; throw e; }
  };
  const entrarConUsuarioSinGuardia = async (fbUser) => {
    // Tras verificar el correo, el token de sesion sigue diciendo "sin
    // verificar" hasta que se renueva; las reglas de Firestore lo leen de ahi
    // y denegarian las escrituras durante casi una hora. Se fuerza la renovacion.
    try { await fbUser.getIdToken(true); } catch (e) { /* sin red: se reintentara al escribir */ }
    const emailQuery = String(fbUser.email || '').toLowerCase();
    const snap = await getDoc(doc(db, 'users', fbUser.uid));
    const previo = snap.exists() ? (snap.data() || {}) : {};
    const perfil = { uid: fbUser.uid, email: emailQuery, displayName: previo.displayName || fbUser.displayName || emailQuery.split('@')[0], lastLogin: Date.now() };
    if (!snap.exists()) Object.assign(perfil, await perfilNuevo(emailQuery));
    await setDoc(doc(db, 'users', fbUser.uid), perfil, { merge: true });
    const sessionUser = sesionDesdePerfil(fbUser.uid, emailQuery, { ...previo, ...perfil }, fbUser.displayName);
    localStorage.setItem('currentUser', JSON.stringify(sessionUser));
    onLogin(sessionUser);
  };

  // Mientras se espera la verificacion, se comprueba sola cada pocos segundos:
  // al abrir el enlace del correo el usuario entra sin tocar nada.
  useEffect(() => {
    if (!verificar) return undefined;
    const id = setInterval(async () => {
      try {
        await verificar.user.reload();
        if (verificar.user.emailVerified) { clearInterval(id); await entrarConUsuario(verificar.user); }
      } catch (e) { /* sin red: se reintenta */ }
    }, 4000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verificar]);

  const comprobarVerificacion = async () => {
    setError(''); setAviso(''); setLoading(true);
    try {
      await verificar.user.reload();
      if (verificar.user.emailVerified) await entrarConUsuario(verificar.user);
      else setAviso(t.loginVerificarPendiente);
    } catch (err) { setError(tf('loginErrAuth', { msg: err.message })); }
    setLoading(false);
  };
  const reenviarVerificacion = async () => {
    setError(''); setAviso('');
    try {
      const modo = await enviarVerificacion(verificar.user);
      setVerificar(v => ({ ...v, modo }));
      setAviso(modo === 'codigo' ? t.loginCodigoEnviado : t.loginVerificarReenviado);
      setReenvioEn(60);
    } catch (err) { setError(esLimiteCorreo(err) ? t.loginEsperaCorreo : tf('loginErrAuth', { msg: err.message })); }
  };
  // Comprueba el código de verificación y entra.
  const confirmarCodigo = async (e) => {
    e.preventDefault(); setError(''); setAviso('');
    const limpio = codigo.replace(/\D/g, '');
    if (limpio.length !== 6) { setError(t.loginCodigoFormato); return; }
    setLoading(true);
    try {
      await verificarCodigo(limpio);
      await verificar.user.getIdToken(true);
      await verificar.user.reload();
      await entrarConUsuario(verificar.user);
    } catch (err) { setError(errorDeCodigo(err)); }
    setLoading(false);
  };
  const usarOtraCuenta = async () => {
    try { await signOut(auth); } catch (e) { /* sin sesion */ }
    setVerificar(null); setCompletar(null); setRecuperar(null); setCodigo(''); setError(''); setAviso(''); setPassword(''); setConfirmPassword('');
  };

  // «¿Has olvidado tu contraseña?»: código de 6 cifras por correo y nueva
  // contraseña en la misma pantalla. El mensaje es el mismo exista o no la
  // cuenta, para no revelar qué correos están registrados. Si la función no
  // está disponible, enlace de Firebase como antes.
  const handleOlvide = async () => {
    setError(''); setAviso('');
    const emailQuery = email.trim().toLowerCase();
    if (!emailQuery) { setError(t.loginResetSinCorreo); return; }
    try {
      await enviarCodigoContrasena(emailQuery, language);
      setRecuperar({ email: emailQuery }); setCodigo(''); setPassword(''); setConfirmPassword(''); setReenvioEn(60);
      return;
    } catch (err) {
      if (esLimiteCorreo(err)) { setError(t.loginEsperaCorreo); return; }
      if (motivoCodigo(err) === 'correo') { setError(t.loginResetSinCorreo); return; }
      console.warn('Código por correo no disponible, se usa el enlace de Firebase:', err?.message);
    }
    try { await sendPasswordResetEmail(auth, emailQuery, ajustesAccion()); setAviso(t.loginResetEnviado); }
    catch (err) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-email') setAviso(t.loginResetEnviado);
      else setError(tf('loginErrAuth', { msg: err.message }));
    }
  };

  const reenviarCodigoContrasena = async () => {
    setError(''); setAviso('');
    try { await enviarCodigoContrasena(recuperar.email, language); setAviso(t.loginCodigoEnviado); setReenvioEn(60); }
    catch (err) { setError(errorDeCodigo(err)); }
  };
  const guardarNuevaContrasena = async (e) => {
    e.preventDefault(); setError(''); setAviso('');
    const limpio = codigo.replace(/\D/g, '');
    if (limpio.length !== 6) { setError(t.loginCodigoFormato); return; }
    if (password.length < 8) { setError(t.loginErrPasswordLength); return; }
    if (password !== confirmPassword) { setError(t.loginErrPasswordMismatch); return; }
    setLoading(true);
    try {
      await cambiarContrasenaConCodigo(recuperar.email, limpio, password);
      setEmail(recuperar.email); setRecuperar(null); setIsLogin(true);
      setCodigo(''); setPassword(''); setConfirmPassword('');
      setAviso(t.loginRecuperarOk);
    } catch (err) { setError(errorDeCodigo(err)); }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!db || !auth) throw new Error(t.loginErrFirebaseNotReady);

      const emailQuery = email.trim().toLowerCase();

      if (isLogin) {
        let finalUid = null;

        // Firebase Auth es la UNICA autoridad de credenciales.
        try {
          const userCredential = await signInWithEmailAndPassword(auth, emailQuery, password);
          finalUid = userCredential.user.uid;
        } catch (authErr) {
          if (authErr.code === 'auth/user-not-found' || authErr.code === 'auth/invalid-credential' || authErr.code === 'auth/wrong-password') {
            throw new Error(t.loginErrBadCredentials);
          }
          throw authErr;
        }

        // Ya autenticados: el perfil vive en Firestore (no hay copia local).
        const profileSnap = await getDoc(doc(db, 'users', finalUid));
        const perfilExistia = profileSnap.exists();
        const userDoc = perfilExistia ? (profileSnap.data() || {}) : {};
        const usuarioAuth = auth.currentUser;

        // Solo campos no privilegiados. isAdmin, el rol y las excepciones se
        // gestionan desde el panel de admin; si el cliente los enviara, las
        // reglas lo rechazarian.
        const perfil = {
          uid: finalUid,
          email: emailQuery,
          displayName: userDoc.displayName || emailQuery.split('@')[0],
          lastLogin: Date.now()
        };

        if (!perfilExistia) {
          // Cuenta de Auth sin documento de perfil: este setDoc lo CREA. Si no
          // se estampa aqui la prueba, las reglas le denegarian toda escritura
          // para siempre, y ya no hay forma de arreglarlo desde el cliente
          // porque trialEndsAt es inmutable en las actualizaciones.
          Object.assign(perfil, await perfilNuevo(emailQuery));
        }

        await setDoc(doc(db, 'users', finalUid), perfil, { merge: true });

        // Cuenta nueva sin el correo verificado: no entra hasta verificarlo.
        if (requiereVerificacion(usuarioAuth, { ...userDoc, ...perfil })) {
          setVerificar({ user: usuarioAuth });
          setLoading(false);
          return;
        }

        const sessionUser = sesionDesdePerfil(finalUid, emailQuery, { ...userDoc, ...perfil }, null);
        localStorage.setItem('currentUser', JSON.stringify(sessionUser));
        onLogin(sessionUser);

      } else {
        // REGISTRO
        if (password.length < 8) {
          setError(t.loginErrPasswordLength);
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setError(t.loginErrPasswordMismatch);
          setLoading(false);
          return;
        }

        try {
          // Crear en Firebase Auth para registrar de verdad su identidad
          const userCredential = await createUserWithEmailAndPassword(auth, emailQuery, password);
          const newUid = userCredential.user.uid;

          // La contraseña la custodia Firebase Auth. Nunca se guarda en Firestore
          // ni en localStorage: las reglas rechazan cualquier campo `password`.
          // isAdmin se concede solo desde el panel de admin, jamas desde el cliente.
          // Prueba gratuita (y, si el admin invito a este correo, cuenta
          // invitada). Las reglas acotan trialEndsAt a los dias configurados y
          // despues lo vuelven inmutable: el cliente no se la puede prolongar.
          // El pago lo marca Stripe (o el admin) escribiendo paidUntil.
          const newUser = {
            uid: newUid,
            email: emailQuery,
            displayName: name.trim() || emailQuery.split('@')[0],
            ...(await perfilNuevo(emailQuery)),
            ...(newsletter ? camposNewsletter(language) : {}),
            lastLogin: Date.now()
          };

          // Auth ok, ahora sí tenemos permisos para crear su perfil de BD
          await setDoc(doc(db, 'users', newUid), newUser);

          // Verificacion del correo: se envia el enlace y la cuenta no entra
          // hasta que lo abra (evita correos falsos). Las reglas tampoco dejan
          // escribir datos a una cuenta nueva sin verificar.
          let modo = 'codigo';
          try { modo = await enviarVerificacion(userCredential.user); } catch (e) { console.warn('No se pudo enviar la verificación:', e?.message); }
          setVerificar({ user: userCredential.user, modo });
          setReenvioEn(30);
          setLoading(false);
          return;

        } catch (regErr) {
          if (regErr.code === 'auth/email-already-in-use') {
            setError(t.loginErrEmailInUse);
          } else {
            throw regErr;
          }
        }
      }
    } catch (err) {
      console.error("Error detallado auth:", err);
      // Extraer mensaje de error natural si proviene de firebase
      let errorMsg = err.message || t.loginErrUnknown;
      if (err.code) errorMsg = err.message;
      setError(tf('loginErrAuth', { msg: errorMsg }));
    } finally {
      setLoading(false);
    }
  };

  // Entra (o da de alta) con una cuenta de Google que ya tiene contraseña.
  const finalizarGoogle = async (user, nombre, conNewsletter = false) => {
    // La prueba gratuita SOLO se estampa si el documento no existia todavia.
    // En logins posteriores no se puede reenviar trialEndsAt: las reglas
    // prohiben modificar ese campo desde el cliente y denegarian la escritura
    // entera, dejando el login de Google roto.
    const refPerfil = doc(db, 'users', user.uid);
    const perfilPrevio = await getDoc(refPerfil);
    const esAltaNueva = !perfilPrevio.exists();
    const datosPrevios = esAltaNueva ? {} : (perfilPrevio.data() || {});
    const emailQuery = String(user.email || '').toLowerCase();

    const profile = {
      uid: user.uid,
      email: emailQuery,
      displayName: (nombre && nombre.trim()) || datosPrevios.displayName || user.displayName || emailQuery.split('@')[0],
      photoURL: user.photoURL || null,
      lastLogin: Date.now()
    };
    if (esAltaNueva) {
      Object.assign(profile, await perfilNuevo(emailQuery));
      profile.isGoogle = true;
    }
    // Solo se escribe si marca la casilla: no se pisa un alta anterior.
    if (conNewsletter && datosPrevios.newsletter !== true) Object.assign(profile, camposNewsletter(language));
    await setDoc(refPerfil, profile, { merge: true });

    // La sesión se construye siempre con el uid de Firebase Auth y el perfil
    // de Firestore. Antes se usaba una lista de usuarios de localStorage que
    // podía devolver un uid antiguo distinto y cargar datos de otra ruta.
    const sessionUser = sesionDesdePerfil(user.uid, emailQuery, { ...datosPrevios, ...profile }, user.displayName);
    localStorage.setItem('currentUser', JSON.stringify(sessionUser));
    onLogin(sessionUser);
  };

  const handleGoogleSignIn = async () => {
    if (!auth) {
      setError(t.loginErrFirebaseConfig);
      return;
    }
    setError(''); setAviso('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Toda cuenta lleva contraseña: si entra con Google y aun no la tiene,
      // se le pide crearla (queda enlazada a la misma cuenta) antes de entrar.
      if (!tienePassword(user)) {
        setCompletar({ user });
        setName(user.displayName || '');
        setPassword(''); setConfirmPassword('');
        setLoading(false);
        return;
      }
      await finalizarGoogle(user, null);
    } catch (err) {
      console.error(err);
      setError(tf('loginErrGoogle', { msg: err.message }));
    }
    setLoading(false);
  };

  // Paso "completa tu registro": nombre y contraseña para una cuenta de Google.
  const handleCompletar = async (e) => {
    e.preventDefault();
    setError(''); setAviso('');
    if (password.length < 8) { setError(t.loginErrPasswordLength); return; }
    if (password !== confirmPassword) { setError(t.loginErrPasswordMismatch); return; }
    setLoading(true);
    try {
      const user = completar.user;
      try {
        await linkWithCredential(user, EmailAuthProvider.credential(user.email, password));
      } catch (err) {
        if (err.code !== 'auth/provider-already-linked') throw err;
      }
      await finalizarGoogle(user, name, newsletter);
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/credential-already-in-use' || err.code === 'auth/email-already-in-use') setError(t.loginErrEmailInUse);
      else if (err.code === 'auth/weak-password') setError(t.loginErrPasswordLength);
      else if (err.code === 'auth/requires-recent-login') setError(t.loginErrReciente);
      else setError(tf('loginErrAuth', { msg: err.message }));
    }
    setLoading(false);
  };
  const cancelarCompletar = usarOtraCuenta;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f1117 0%, #1a1d27 50%, #0f1117 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', sans-serif",
      padding: 16
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .login-card {
          background: #1e2130;
          border: 1px solid #2d3148;
          border-radius: 16px;
          padding: 40px;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 24px 64px rgba(0,0,0,0.5);
        }
        .login-logo {
          width: 52px; height: 52px;
          background: linear-gradient(135deg, #2dd4bf, #14b8a6);
          box-shadow: 0 10px 26px rgba(45, 212, 191, 0.3);
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-weight: 800; font-size: 20px; color: white;
          margin: 0 auto 20px;
        }
        .login-title { text-align: center; font-size: 22px; font-weight: 800; color: #f0f2ff; margin-bottom: 4px; }
        .login-sub { text-align: center; font-size: 13px; color: #565d80; margin-bottom: 24px; }
        .tab-container {
          display: flex; background: #252840; border-radius: 12px; padding: 4px; margin-bottom: 24px;
        }
        .tab-btn {
          flex: 1; padding: 10px; border-radius: 8px; border: none; background: transparent;
          color: #8b92b8; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s;
        }
        .tab-btn.active { background: #0d9488; color: white; box-shadow: 0 4px 12px rgba(13, 148, 136, 0.35); }
        .login-label { display: block; font-size: 11px; font-weight: 600; color: #8b92b8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
        .login-input {
          width: 100%; padding: 11px 14px;
          background: #252840; border: 1px solid #2d3148;
          border-radius: 8px; color: #f0f2ff;
          font-size: 14px; font-family: 'Inter', sans-serif;
          outline: none; transition: border-color 0.15s;
        }
        .login-input:focus { border-color: #2dd4bf; }
        .login-input::placeholder { color: #565d80; }
        .login-field { margin-bottom: 16px; }
        .login-btn {
          width: 100%; padding: 12px;
          background: #0d9488; color: white;
          border: none; border-radius: 8px;
          font-size: 14px; font-weight: 600;
          font-family: 'Inter', sans-serif;
          cursor: pointer; margin-top: 8px;
          transition: background 0.15s;
        }
        .login-btn:hover { background: #0f766e; }
        .login-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .login-btn-google {
          background: white; color: #1f2937;
          border: 1px solid #d1d5db;
          display: flex; align-items: center; justify-content: center;
          gap: 10px; margin-top: 16px;
        }
        .login-btn-google:hover { background: #f3f4f6; }
        .divider {
          display: flex; align-items: center; text-align: center;
          color: #565d80; font-size: 11px; margin: 24px 0;
        }
        .divider::before, .divider::after {
          content: ''; flex: 1; border-bottom: 1px solid #2d3148;
        }
        .divider:not(:empty)::before { margin-right: .25em; }
        .divider:not(:empty)::after { margin-left: .25em; }
        .login-error {
          background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3);
          border-radius: 8px; padding: 10px 14px;
          color: #ef4444; font-size: 12px; margin-bottom: 16px;
        }
        .login-ok {
          background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.35);
          border-radius: 8px; padding: 10px 14px;
          color: #34d399; font-size: 12px; margin-bottom: 16px;
        }
        .login-link {
          background: none; border: none; padding: 0; cursor: pointer;
          color: #8b92b8; font-size: 12px; text-decoration: underline; font-family: inherit;
        }
        .login-link:hover { color: #c7cbe6; }
        .login-btn-secundario { background: #252840; color: #c7cbe6; margin-top: 10px; }
        .login-btn-secundario:hover { background: #2d3148; }
        .login-paso-titulo { font-size: 18px; font-weight: 800; color: #fff; margin-bottom: 8px; }
        .login-paso-texto { font-size: 13px; color: #8b92b8; line-height: 1.55; margin-bottom: 20px; }
        .login-codigo { text-align: center; font-size: 26px; letter-spacing: 10px; font-family: 'Courier New', monospace; font-weight: 700; }
        .login-casilla {
          display: flex; gap: 10px; align-items: flex-start; cursor: pointer;
          font-size: 11px; line-height: 1.5; color: #8b92b8; margin: 4px 0 14px;
          text-transform: none; letter-spacing: normal; font-weight: 400;
        }
        .login-casilla input { margin-top: 2px; width: 15px; height: 15px; flex: none; accent-color: #14b8a6; cursor: pointer; }
        .login-casilla span { flex: 1; }
        .login-hint {
          text-align: center; font-size: 11px; color: #565d80; margin-top: 20px;
        }
        .login-hint code {
          background: #252840; padding: 2px 6px; border-radius: 4px;
          color: #8b92b8; font-size: 11px;
        }
      `}</style>

      <div className="login-card">
        <div className="login-logo" aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>
        </div>
        <div className="login-title">Finanzi<span style={{ color: '#2dd4bf' }}>App</span></div>
        <div className="login-sub">{t.loginSubtitle}</div>

        {completar ? (
          <form onSubmit={handleCompletar} className="login-completar">
            <div className="login-paso-titulo">{t.loginCompletarTitulo}</div>
            <div className="login-paso-texto">{t.loginCompletarTexto}</div>
            {error && <div className="login-error">{error}</div>}
            <div className="login-field">
              <label className="login-label">{t.loginEmail}</label>
              <input className="login-input" type="email" value={completar.user.email || ''} readOnly disabled />
            </div>
            <div className="login-field">
              <label className="login-label">{t.loginName}</label>
              <input className="login-input" type="text" placeholder={t.loginNamePlaceholder} value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="login-field">
              <label className="login-label">{t.loginPassword}</label>
              <input className="login-input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} autoComplete="new-password" autoFocus />
            </div>
            <div className="login-field">
              <label className="login-label">{t.loginRepeatPassword}</label>
              <input className="login-input" type="password" placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required minLength={8} autoComplete="new-password" />
            </div>
            <label className="login-casilla">
              <input type="checkbox" checked={newsletter} onChange={e => setNewsletter(e.target.checked)} />
              <span>{t.loginNewsletter}</span>
            </label>
            <button className="login-btn" type="submit" disabled={loading}>{loading ? t.loginLoading : t.loginCompletarBtn}</button>
            <button className="login-btn login-btn-secundario" type="button" onClick={cancelarCompletar} disabled={loading}>{t.loginCancelar}</button>
          </form>
        ) : recuperar ? (
          <form onSubmit={guardarNuevaContrasena} className="login-recuperar">
            <div className="login-paso-titulo">🔑 {t.loginRecuperarTitulo}</div>
            <div className="login-paso-texto">{tf('loginRecuperarTexto', { email: recuperar.email })}</div>
            {error && <div className="login-error">{error}</div>}
            {aviso && <div className="login-ok">{aviso}</div>}
            <div className="login-field">
              <label className="login-label">{t.loginCodigoEtiqueta}</label>
              <input className="login-input login-codigo" inputMode="numeric" autoComplete="one-time-code" maxLength={12} placeholder="••••••" value={codigo} onChange={e => setCodigo(e.target.value.replace(/\D/g, '').slice(0, 6))} required autoFocus />
            </div>
            <div className="login-field">
              <label className="login-label">{t.loginPassword}</label>
              <input className="login-input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} autoComplete="new-password" />
            </div>
            <div className="login-field">
              <label className="login-label">{t.loginRepeatPassword}</label>
              <input className="login-input" type="password" placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required minLength={8} autoComplete="new-password" />
            </div>
            <button className="login-btn" type="submit" disabled={loading}>{loading ? t.loginLoading : t.loginRecuperarGuardar}</button>
            <button className="login-btn login-btn-secundario" type="button" onClick={reenviarCodigoContrasena} disabled={loading || reenvioEn > 0}>{reenvioEn > 0 ? `${t.loginCodigoReenviar} (${reenvioEn})` : t.loginCodigoReenviar}</button>
            <div style={{ textAlign: 'center', marginTop: 18 }}>
              <button type="button" className="login-link" onClick={() => { setRecuperar(null); setCodigo(''); setError(''); setAviso(''); }}>{t.loginCancelar}</button>
            </div>
            <div className="login-hint">{t.loginAyudaVerificar} <a href={`mailto:${CORREO_SOPORTE}`} style={{ color: '#c7cbe6' }}>{CORREO_SOPORTE}</a></div>
          </form>
        ) : verificar ? (
          <div className="login-verificar">
            <div className="login-paso-titulo">✉️ {t.loginVerificarTitulo}</div>
            <div className="login-paso-texto">{tf(verificar.modo === 'enlace' ? 'loginVerificarTexto' : 'loginCodigoTexto', { email: verificar.user.email })}</div>
            {error && <div className="login-error">{error}</div>}
            {aviso && <div className="login-ok">{aviso}</div>}
            {verificar.modo === 'enlace' ? (
              <button className="login-btn" type="button" onClick={comprobarVerificacion} disabled={loading}>{loading ? t.loginLoading : t.loginVerificarComprobar}</button>
            ) : (
              <form onSubmit={confirmarCodigo}>
                <div className="login-field">
                  <label className="login-label">{t.loginCodigoEtiqueta}</label>
                  <input className="login-input login-codigo" inputMode="numeric" autoComplete="one-time-code" maxLength={12} placeholder="••••••" value={codigo} onChange={e => setCodigo(e.target.value.replace(/\D/g, '').slice(0, 6))} required autoFocus />
                </div>
                <button className="login-btn" type="submit" disabled={loading}>{loading ? t.loginLoading : t.loginCodigoVerificar}</button>
              </form>
            )}
            <button className="login-btn login-btn-secundario" type="button" onClick={reenviarVerificacion} disabled={loading || reenvioEn > 0}>{(verificar.modo === 'enlace' ? t.loginVerificarReenviar : t.loginCodigoReenviar) + (reenvioEn > 0 ? ` (${reenvioEn})` : '')}</button>
            <div style={{ textAlign: 'center', marginTop: 18 }}>
              <button type="button" className="login-link" onClick={usarOtraCuenta}>{t.loginVerificarOtra}</button>
            </div>
            <div className="login-hint">{t.loginAyudaVerificar} <a href={`mailto:${CORREO_SOPORTE}`} style={{ color: '#c7cbe6' }}>{CORREO_SOPORTE}</a></div>
          </div>
        ) : (
          <>
        <div className="tab-container">
          <button type="button" className={`tab-btn ${isLogin ? 'active' : ''}`} onClick={() => setIsLogin(true)}>
            {t.loginSignIn}
          </button>
          <button type="button" className={`tab-btn ${!isLogin ? 'active' : ''}`} onClick={() => setIsLogin(false)}>
            {t.loginRegister}
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="login-error">{error}</div>}
          {aviso && <div className="login-ok">{aviso}</div>}
          {!isLogin && (
            <div className="login-field">
              <label className="login-label">{t.loginName}</label>
              <input className="login-input" type="text" placeholder={t.loginNamePlaceholder} value={name} onChange={e => setName(e.target.value)} required />
            </div>
          )}
          <div className="login-field">
            <label className="login-label">{t.loginEmail}</label>
            <input className="login-input" type="email" placeholder={t.loginEmailPlaceholder} value={email} onChange={e => setEmail(e.target.value)} autoFocus required />
          </div>
          <div className="login-field">
            <label className="login-label">{t.loginPassword}</label>
            <input className="login-input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} autoComplete={isLogin ? 'current-password' : 'new-password'} />
            {isLogin && (
              <div style={{ textAlign: 'right', marginTop: 8 }}>
                <button type="button" className="login-link" onClick={handleOlvide}>{t.loginOlvide}</button>
              </div>
            )}
          </div>
          {!isLogin && (
            <div className="login-field">
              <label className="login-label">{t.loginRepeatPassword}</label>
              <input className="login-input" type="password" placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required minLength={8} />
            </div>
          )}
          {!isLogin && (
            <label className="login-casilla">
              <input type="checkbox" checked={newsletter} onChange={e => setNewsletter(e.target.checked)} />
              <span>{t.loginNewsletter}</span>
            </label>
          )}
          {!isLogin && (
            <div style={{ fontSize: 11, color: '#8b92b8', lineHeight: 1.5, marginBottom: 14 }}>
              {t.loginAceptas} <a href="/terminos" target="_blank" rel="noreferrer" style={{ color: '#c7cbe6' }}>{t.loginTerminos}</a> {t.loginYLa} <a href="/privacidad" target="_blank" rel="noreferrer" style={{ color: '#c7cbe6' }}>{t.loginPrivacidad}</a>.
            </div>
          )}
          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? t.loginLoading : (isLogin ? t.loginSignIn : t.loginCreateAccount)}
          </button>
        </form>

        <div className="divider">{t.loginOrSignInWith}</div>

        <button className="login-btn login-btn-google" onClick={handleGoogleSignIn} disabled={loading}>
          <svg style={{ width: 18, height: 18 }} viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Google
        </button>


        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <a href="/" style={{ color: '#8b92b8', fontSize: 13, textDecoration: 'none' }}>{t.loginBackHome}</a>
        </div>
        <div className="login-hint">{t.loginAyuda} <a href={`mailto:${CORREO_SOPORTE}`} style={{ color: '#c7cbe6' }}>{CORREO_SOPORTE}</a></div>
          </>
        )}
      </div>
    </div>
  );
}
