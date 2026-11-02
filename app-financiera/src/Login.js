import React, { useState } from 'react';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const LOCAL_USERS = [];

// Duracion de la prueba gratuita, en dias. Debe coincidir con duracionPrueba()
// de firestore.rules, que es quien realmente lo hace cumplir.
const DIAS_PRUEBA = 15;

// Las reglas comparan el trialEndsAt que envia el cliente contra la hora del
// SERVIDOR. Si el reloj del usuario va adelantado, el valor se pasaria del
// limite y Firestore rechazaria el alta entera. Restamos una hora de holgura
// (las reglas ademas toleran un dia).
const MARGEN_RELOJ_MS = 60 * 60 * 1000;

const nuevaPrueba = () =>
  Date.now() + DIAS_PRUEBA * 24 * 60 * 60 * 1000 - MARGEN_RELOJ_MS;

export default function Login({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!db || !auth) throw new Error("Firebase Auth/DB no inicializada aún");

      const emailQuery = email.trim().toLowerCase();

      if (isLogin) {
        let userCredential;
        let finalUid = null;

        // Intentar loguear en Firebase Auth
        try {
          userCredential = await signInWithEmailAndPassword(auth, emailQuery, password);
          finalUid = userCredential.user.uid;
        } catch (authErr) {
          // Firebase Auth es la UNICA autoridad de credenciales. Se elimino el
          // camino alternativo que comparaba contraseñas en claro guardadas en
          // localStorage: permitia entrar sin pasar por Auth.
          if (authErr.code === 'auth/user-not-found' || authErr.code === 'auth/invalid-credential' || authErr.code === 'auth/wrong-password') {
            throw new Error('Credenciales incorrectas. Verifica tu email y contraseña.');
          }
          throw authErr;
        }

        // Ya estamos autenticados, podemos consultar su perfil en Firebase
        let userDoc = null;
        const profileSnap = await getDoc(doc(db, 'users', finalUid));
        const perfilExistia = profileSnap.exists();
        if (perfilExistia) {
          userDoc = profileSnap.data();
        } else {
          // Si no estaba en BD remota pero sí local
          const usersList = JSON.parse(localStorage.getItem('users_list') || '[]');
          userDoc = usersList.find(u => u.email.trim().toLowerCase() === emailQuery) || {};
        }

        const isUserAdmin = emailQuery === 'brianantigua@gmail.com' || !!userDoc.isAdmin;
        const sessionUser = {
          uid: finalUid,
          email: emailQuery,
          displayName: userDoc.displayName || emailQuery.split('@')[0],
          isAdmin: isUserAdmin,
          permissions: isUserAdmin ? ['dashboard', 'monthly', 'networth', 'loans', 'trading', 'analysis', 'settings', 'users'] : (userDoc.permissions || ['dashboard', 'monthly', 'networth', 'loans', 'trading', 'analysis', 'settings']),
          // Sin estos campos, AvisoSuscripcion leeria 0 y le mostraria el cartel
          // de "prueba terminada" incluso a quien acaba de pagar.
          trialEndsAt: userDoc.trialEndsAt || 0,
          paidUntil: userDoc.paidUntil || 0,
          plan: userDoc.plan || 'trial'
        };

        // Solo campos no privilegiados. isAdmin y permissions se gestionan desde
        // el panel de admin; si el cliente los enviara, las reglas lo rechazarian.
        // Tampoco se reenvia `...userDoc`, que arrastraba el viejo campo password.
        const perfil = {
          uid: finalUid,
          email: emailQuery,
          displayName: sessionUser.displayName,
          lastLogin: Date.now()
        };

        if (!perfilExistia) {
          // Cuenta de Auth sin documento de perfil: este setDoc lo CREA. Si no
          // se estampa aqui la prueba, las reglas le denegarian toda escritura
          // para siempre, y ya no hay forma de arreglarlo desde el cliente
          // porque trialEndsAt es inmutable en las actualizaciones.
          perfil.isAdmin = false;
          perfil.permissions = ['dashboard', 'monthly', 'networth', 'loans', 'trading', 'analysis', 'settings'];
          perfil.trialEndsAt = nuevaPrueba();
          sessionUser.trialEndsAt = perfil.trialEndsAt;
        }

        await setDoc(doc(db, 'users', finalUid), perfil, { merge: true });

        localStorage.setItem('currentUser', JSON.stringify(sessionUser));
        onLogin(sessionUser);

      } else {
        // REGISTRO
        if (password.length < 8) {
          setError('La contraseña debe tener al menos 8 caracteres.');
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setError('Las contraseñas no coinciden.');
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
          const newUser = {
            uid: newUid,
            email: emailQuery,
            displayName: name.trim() || emailQuery.split('@')[0],
            isAdmin: false,
            permissions: ['dashboard', 'monthly', 'networth', 'loans', 'trading', 'analysis', 'settings'],
            // Prueba gratuita. Las reglas acotan este valor a 15 dias como
            // maximo y despues lo vuelven inmutable: el cliente no se la puede
            // prolongar. El pago lo marca el admin escribiendo paidUntil.
            trialEndsAt: nuevaPrueba(),
            lastLogin: Date.now()
          };

          // Auth ok, ahora sí tenemos permisos para crear su perfil de BD
          await setDoc(doc(db, 'users', newUid), newUser);

          // Fallback local
          const currentList = JSON.parse(localStorage.getItem('users_list') || '[]');
          if (!currentList.find(u => u.email === emailQuery)) {
            currentList.push(newUser);
            localStorage.setItem('users_list', JSON.stringify(currentList));
          }

          const sessionUser = {
            uid: newUser.uid,
            email: newUser.email,
            displayName: newUser.displayName,
            isAdmin: newUser.isAdmin,
            permissions: newUser.permissions,
            // Sin esto, al recien registrado le saldria el cartel de prueba
            // caducada en su primera sesion.
            trialEndsAt: newUser.trialEndsAt,
            paidUntil: 0,
            plan: 'trial'
          };

          localStorage.setItem('currentUser', JSON.stringify(sessionUser));
          onLogin(sessionUser);

        } catch (regErr) {
          if (regErr.code === 'auth/email-already-in-use') {
            setError('Este email ya está registrado. Por favor, inicia sesión.');
          } else {
            throw regErr;
          }
        }
      }
    } catch (err) {
      console.error("Error detallado auth:", err);
      // Extraer mensaje de error natural si proviene de firebase
      let errorMsg = err.message || "Error desconocido en Firebase";
      if (err.code) errorMsg = err.message;
      setError('Error en la autenticación: ' + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth) {
      setError('Firebase no está configurado correctamente. Revisa src/firebase.js');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const usersList = JSON.parse(localStorage.getItem('users_list') || '[]');
      const allUsers = [...LOCAL_USERS, ...usersList];

      const existingUser = allUsers.find(u => u.email.toLowerCase() === user.email.toLowerCase());

      // Guardar perfil en Firestore.
      // La prueba gratuita SOLO se estampa si el documento no existia todavia.
      // En logins posteriores no se puede reenviar trialEndsAt: las reglas
      // prohiben modificar ese campo desde el cliente y denegarian la escritura
      // entera, dejando el login de Google roto.
      const refPerfil = doc(db, 'users', user.uid);
      const perfilPrevio = await getDoc(refPerfil);
      const esAltaNueva = !perfilPrevio.exists();

      const profile = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email.split('@')[0],
        photoURL: user.photoURL || null,
        lastLogin: Date.now()
      };

      if (esAltaNueva) {
        profile.isAdmin = false;
        profile.permissions = ['dashboard', 'monthly', 'networth', 'loans', 'trading', 'analysis', 'settings'];
        profile.trialEndsAt = nuevaPrueba();
      }

      await setDoc(refPerfil, profile, { merge: true });

      // Campos de suscripcion para la sesion. Si no viajan aqui, AvisoSuscripcion
      // leeria 0 y le mostraria "tu prueba ha terminado" nada mas entrar.
      const datosPrevios = esAltaNueva ? {} : (perfilPrevio.data() || {});
      const susc = {
        trialEndsAt: esAltaNueva ? profile.trialEndsAt : (datosPrevios.trialEndsAt || 0),
        paidUntil: datosPrevios.paidUntil || 0,
        plan: datosPrevios.plan || 'trial'
      };

      if (existingUser) {
        // Iniciar sesión con el usuario existente
        const isAdmin = existingUser.email.toLowerCase() === 'brianantigua@gmail.com';
        const sessionUser = {
          uid: existingUser.uid,
          email: existingUser.email,
          displayName: existingUser.displayName || user.displayName || 'Usuario Google',
          isAdmin: isAdmin,
          permissions: isAdmin ? ['dashboard', 'monthly', 'networth', 'loans', 'trading', 'analysis', 'settings', 'users'] : (existingUser.permissions || ['dashboard', 'monthly', 'networth', 'loans', 'trading', 'analysis', 'settings']),
          ...susc
        };
        localStorage.setItem('currentUser', JSON.stringify(sessionUser));
        onLogin(sessionUser);
      } else {
        // Si el usuario no existe localmente, crearlo
        const isAdmin = user.email.toLowerCase() === 'brianantigua@gmail.com';
        const newUser = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email.split('@')[0],
          isAdmin: isAdmin,
          isGoogle: true,
          permissions: isAdmin ? ['dashboard', 'monthly', 'networth', 'loans', 'trading', 'analysis', 'settings', 'users'] : ['dashboard', 'monthly', 'networth', 'loans', 'trading', 'analysis', 'settings']
        };

        // Guardar en la lista local y Firebase (opcional, Firebase es lo principal ahora)
        const currentList = JSON.parse(localStorage.getItem('users_list') || '[]');
        currentList.push(newUser);
        localStorage.setItem('users_list', JSON.stringify(currentList));

        // Iniciar sesión inmediatamente
        const sessionUser = {
          uid: newUser.uid,
          email: newUser.email,
          displayName: newUser.displayName,
          isAdmin: isAdmin,
          permissions: newUser.permissions,
          ...susc
        };
        localStorage.setItem('currentUser', JSON.stringify(sessionUser));
        onLogin(sessionUser);
      }
    } catch (err) {
      console.error(err);
      setError('Error al iniciar sesión con Google: ' + err.message);
    }
    setLoading(false);
  };

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
          background: linear-gradient(135deg, #6366f1, #818cf8);
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
        .tab-btn.active { background: #6366f1; color: white; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3); }
        .login-label { display: block; font-size: 11px; font-weight: 600; color: #8b92b8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
        .login-input {
          width: 100%; padding: 11px 14px;
          background: #252840; border: 1px solid #2d3148;
          border-radius: 8px; color: #f0f2ff;
          font-size: 14px; font-family: 'Inter', sans-serif;
          outline: none; transition: border-color 0.15s;
        }
        .login-input:focus { border-color: #6366f1; }
        .login-input::placeholder { color: #565d80; }
        .login-field { margin-bottom: 16px; }
        .login-btn {
          width: 100%; padding: 12px;
          background: #6366f1; color: white;
          border: none; border-radius: 8px;
          font-size: 14px; font-weight: 600;
          font-family: 'Inter', sans-serif;
          cursor: pointer; margin-top: 8px;
          transition: background 0.15s;
        }
        .login-btn:hover { background: #4f52d9; }
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
        .login-hint {
          text-align: center; font-size: 11px; color: #565d80; margin-top: 20px;
        }
        .login-hint code {
          background: #252840; padding: 2px 6px; border-radius: 4px;
          color: #8b92b8; font-size: 11px;
        }
      `}</style>

      <div className="login-card">
        <div className="login-logo">FZ</div>
        <div className="login-title">Finanzi<span style={{ color: '#2dd4bf' }}>App</span></div>
        <div className="login-sub">Gestión de finanzas personales</div>

        <div className="tab-container">
          <button type="button" className={`tab-btn ${isLogin ? 'active' : ''}`} onClick={() => setIsLogin(true)}>
            Iniciar Sesión
          </button>
          <button type="button" className={`tab-btn ${!isLogin ? 'active' : ''}`} onClick={() => setIsLogin(false)}>
            Regístrate
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="login-error">{error}</div>}
          {!isLogin && (
            <div className="login-field">
              <label className="login-label">Nombre</label>
              <input className="login-input" type="text" placeholder="Tu nombre" value={name} onChange={e => setName(e.target.value)} required />
            </div>
          )}
          <div className="login-field">
            <label className="login-label">Email</label>
            <input className="login-input" type="email" placeholder="ejemplo@correo.com" value={email} onChange={e => setEmail(e.target.value)} autoFocus required />
          </div>
          <div className="login-field">
            <label className="login-label">Contraseña</label>
            <input className="login-input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} />
          </div>
          {!isLogin && (
            <div className="login-field">
              <label className="login-label">Repetir Contraseña</label>
              <input className="login-input" type="password" placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required minLength={8} />
            </div>
          )}
          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? 'Cargando...' : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta')}
          </button>
        </form>

        <div className="divider">O INICIA SESIÓN CON</div>

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
          <a href="/" style={{ color: '#8b92b8', fontSize: 13, textDecoration: 'none' }}>← Volver al inicio</a>
        </div>
      </div>
    </div>
  );
}