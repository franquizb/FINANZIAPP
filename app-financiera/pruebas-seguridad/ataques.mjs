// Ataques contra las reglas de Firestore de FinanziApp, en el emulador local
// (nunca contra producción). Cada caso dice qué haría un atacante y si las
// reglas deben DENEGARLO (lo normal) o si hoy lo PERMITEN (debilidad conocida
// que se quiere medir).
import { initializeTestEnvironment, assertSucceeds, assertFails } from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';
import { doc, getDoc, setDoc, updateDoc, deleteDoc, addDoc, collection, getDocs, query, where, writeBatch } from 'firebase/firestore';

const REGLAS = process.argv[2] || '../firestore.rules';
const ahora = Date.now();
const DIA = 86400000;
const hoy = new Date().toISOString().slice(0, 10).replace(/-/g, '');
const env = await initializeTestEnvironment({
  projectId: 'demo-finanziapp',
  firestore: { rules: readFileSync(REGLAS, 'utf8'), host: '127.0.0.1', port: 8089 }
});

const perfil = (extra = {}) => ({ isAdmin: false, creado: ahora - 3600000, trialEndsAt: ahora + 10 * DIA, displayName: 'X', email: 'x@x.com', ...extra });
async function sembrar() {
  await env.clearFirestore();
  await env.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore();
    await setDoc(doc(db, 'users/alice'), perfil({ email: 'alice@x.com', displayName: 'Alice' }));
    await setDoc(doc(db, 'users/bob'), perfil({ email: 'bob@x.com', displayName: 'Bob' }));
    await setDoc(doc(db, 'users/bob/data/2026'), { ingresos: 1000 });
    await setDoc(doc(db, 'users/admin'), { isAdmin: true, creado: 0, email: 'admin@x.com' });
    await setDoc(doc(db, 'users/caducado'), perfil({ trialEndsAt: ahora - DIA, email: 'cad@x.com' }));
    await setDoc(doc(db, 'users/bloq'), perfil({ bloqueado: true, email: 'bloq@x.com' }));
    await setDoc(doc(db, 'users/eve'), perfil({ email: 'eve@x.com' }));
    await setDoc(doc(db, 'ajustes/pagos'), { abierto: false, probadores: ['tester@x.com'] });
    await setDoc(doc(db, 'incidencias/inc_bob'), { uid: 'bob', email: 'bob@x.com', categoria: 'pago', mensaje: 'privado', creada: ahora, estado: 'abierta' });
    await setDoc(doc(db, 'invitaciones/vip@x.com'), { email: 'vip@x.com', hasta: 0 });
    await setDoc(doc(db, 'activity_logs/session_bob_20261107'), { uid: 'bob', totalTime: 10, lastSeen: ahora });
  });
}

const ctx = (uid, email, verificado = true) => env.authenticatedContext(uid, { email, email_verified: verificado }).firestore();
const alice = () => ctx('alice', 'alice@x.com');
const eve = () => ctx('eve', 'eve@x.com', false); // correo SIN verificar
const nueva = () => ctx('nueva', 'nueva@x.com');
const anon = () => env.unauthenticatedContext().firestore();

const altaValida = (extra = {}) => ({ isAdmin: false, creado: ahora, trialEndsAt: ahora + 15 * DIA, email: 'nueva@x.com', displayName: 'N', ...extra });

// [grupo, ataque, 'denegar' | 'hoy-permitido' | 'permitir', función]
const casos = [
  ['Alta', 'Crear mi perfil ya como administrador', 'denegar', () => setDoc(doc(nueva(), 'users/nueva'), altaValida({ isAdmin: true }))],
  ['Alta', 'Crear mi perfil con acceso de pago (paidUntil)', 'denegar', () => setDoc(doc(nueva(), 'users/nueva'), altaValida({ paidUntil: ahora + 365 * DIA }))],
  ['Alta', 'Crear mi perfil con un año de prueba gratis', 'denegar', () => setDoc(doc(nueva(), 'users/nueva'), altaValida({ trialEndsAt: ahora + 365 * DIA }))],
  ['Alta', 'Crear mi perfil sin fecha de alta (para saltarme la verificación)', 'denegar', () => setDoc(doc(nueva(), 'users/nueva'), (({ creado, ...r }) => r)(altaValida()))],
  ['Alta', 'Crear mi perfil con fecha de alta antigua (creado = 0)', 'denegar', () => setDoc(doc(nueva(), 'users/nueva'), altaValida({ creado: 0 }))],
  ['Alta', 'Hacerme invitado (gratis) sin invitación', 'denegar', () => setDoc(doc(nueva(), 'users/nueva'), altaValida({ invitado: true, invitadoHasta: 0 }))],
  ['Alta', 'Darme el panel de gestión en los permisos iniciales', 'denegar', () => setDoc(doc(nueva(), 'users/nueva'), altaValida({ permissions: ['users'] }))],
  ['Alta', 'Crear el perfil de OTRA persona', 'denegar', () => setDoc(doc(nueva(), 'users/otra'), altaValida())],
  ['Alta', 'Darme de alta con un Stripe customer inventado', 'denegar', () => setDoc(doc(nueva(), 'users/nueva'), altaValida({ stripeStatus: 'active' }))],
  ['Alta', 'Alta normal (control: debe funcionar)', 'permitir', () => setDoc(doc(nueva(), 'users/nueva'), altaValida())],

  ['Perfil', 'Hacerme administrador', 'denegar', () => updateDoc(doc(alice(), 'users/alice'), { isAdmin: true })],
  ['Perfil', 'Darme acceso de pago gratis (paidUntil)', 'denegar', () => updateDoc(doc(alice(), 'users/alice'), { paidUntil: ahora + 365 * DIA })],
  ['Perfil', 'Alargarme la prueba gratis', 'denegar', () => updateDoc(doc(alice(), 'users/alice'), { trialEndsAt: ahora + 365 * DIA })],
  ['Perfil', 'Marcarme suscripción activa de Stripe', 'denegar', () => updateDoc(doc(alice(), 'users/alice'), { stripeStatus: 'active', plan: 'pro' })],
  ['Perfil', 'Hacerme invitado', 'denegar', () => updateDoc(doc(alice(), 'users/alice'), { invitado: true })],
  ['Perfil', 'Poner creado = 0 para saltarme la verificación', 'denegar', () => updateDoc(doc(alice(), 'users/alice'), { creado: 0 })],
  ['Perfil', 'Darme secciones extra (vistasExtra)', 'denegar', () => updateDoc(doc(alice(), 'users/alice'), { vistasExtra: ['trading'] })],
  ['Perfil', 'Desbloquearme estando bloqueado', 'denegar', () => updateDoc(doc(ctx('bloq', 'bloq@x.com'), 'users/bloq'), { bloqueado: false })],
  ['Perfil', 'Guardar una contraseña en la base de datos', 'denegar', () => updateDoc(doc(alice(), 'users/alice'), { password: '123456' })],
  ['Perfil', 'Sobrescribir mi perfil entero con setDoc (isAdmin incluido)', 'denegar', () => setDoc(doc(alice(), 'users/alice'), perfil({ email: 'alice@x.com', isAdmin: true }))],
  ['Perfil', 'Hacerme admin a la vez que escribo un dato (lote)', 'denegar', () => { const db = alice(); const b = writeBatch(db); b.set(doc(db, 'users/alice/data/2026'), { a: 1 }); b.update(doc(db, 'users/alice'), { isAdmin: true }); return b.commit(); }],
  ['Perfil', 'Borrar mi perfil (para volver a darme de alta con prueba nueva)', 'denegar', () => deleteDoc(doc(alice(), 'users/alice'))],
  ['Alta', 'Darme de alta con el correo de OTRA persona en el perfil', 'denegar', () => setDoc(doc(nueva(), 'users/nueva'), altaValida({ email: 'victima@x.com' }))],
  ['Perfil', 'Guardar mi perfil como la app al entrar (control: merge con mi correo)', 'permitir', () => setDoc(doc(alice(), 'users/alice'), { uid: 'alice', email: 'alice@x.com', displayName: 'Alice', lastLogin: ahora }, { merge: true })],
  ['Perfil', 'Cambiar mi nombre (control: debe funcionar)', 'permitir', () => updateDoc(doc(alice(), 'users/alice'), { displayName: 'Alicia' })],
  ['Perfil', 'Cambiar el correo de mi perfil por el de OTRA persona', 'denegar', () => updateDoc(doc(alice(), 'users/alice'), { email: 'victima@x.com', newsletter: true })],

  ['Datos ajenos', 'Leer el perfil de otro usuario', 'denegar', () => getDoc(doc(alice(), 'users/bob'))],
  ['Datos ajenos', 'Listar todos los usuarios', 'denegar', () => getDocs(collection(alice(), 'users'))],
  ['Datos ajenos', 'Leer las finanzas de otro usuario', 'denegar', () => getDoc(doc(alice(), 'users/bob/data/2026'))],
  ['Datos ajenos', 'Modificar las finanzas de otro usuario', 'denegar', () => setDoc(doc(alice(), 'users/bob/data/2026'), { ingresos: 0 })],
  ['Datos ajenos', 'Leer datos sin iniciar sesión', 'denegar', () => getDoc(doc(anon(), 'users/bob/data/2026'))],

  ['Mis datos', 'Escribir datos con el correo SIN verificar', 'denegar', () => setDoc(doc(eve(), 'users/eve/data/2026'), { a: 1 })],
  ['Mis datos', 'Escribir datos con la prueba terminada', 'denegar', () => setDoc(doc(ctx('caducado', 'cad@x.com'), 'users/caducado/data/2026'), { a: 1 })],
  ['Mis datos', 'Leer mis datos con la prueba terminada (RGPD: debe poder)', 'permitir', () => getDoc(doc(ctx('caducado', 'cad@x.com'), 'users/caducado/data/2026'))],
  ['Mis datos', 'Escribir datos estando bloqueado', 'denegar', () => setDoc(doc(ctx('bloq', 'bloq@x.com'), 'users/bloq/data/2026'), { a: 1 })],
  ['Mis datos', 'Escribir mis datos en prueba (control: debe funcionar)', 'permitir', () => setDoc(doc(alice(), 'users/alice/data/2026'), { a: 1 })],
  ['Mis datos', 'Guardar un documento de ~900 KB (abuso de espacio)', 'hoy-permitido', () => setDoc(doc(alice(), 'users/alice/data/basura'), { x: 'A'.repeat(900000) })],

  ['Administración', 'Abrir o cerrar los pagos (ajustes/pagos)', 'denegar', () => setDoc(doc(alice(), 'ajustes/pagos'), { abierto: true, probadores: [] })],
  ['Administración', 'Cambiar los días de prueba (ajustes/acceso)', 'denegar', () => setDoc(doc(alice(), 'ajustes/acceso'), { diasPrueba: 365, roles: {} })],
  ['Administración', 'Crearme una invitación gratis', 'denegar', () => setDoc(doc(alice(), 'invitaciones/alice@x.com'), { email: 'alice@x.com', hasta: 0 })],
  ['Administración', 'Leer la invitación de otra persona', 'denegar', () => getDoc(doc(alice(), 'invitaciones/vip@x.com'))],
  ['Administración', 'Escribir un evento de Stripe falso', 'denegar', () => setDoc(doc(alice(), 'eventos_stripe/evt_falso'), { tipo: 'invoice.paid', uid: 'alice' })],
  ['Administración', 'Leer los eventos de Stripe', 'denegar', () => getDocs(collection(alice(), 'eventos_stripe'))],
  ['Administración', 'Leer los errores del sistema', 'denegar', () => getDocs(collection(alice(), 'system_errors'))],
  ['Administración', 'Ver la lista de probadores (correos) en ajustes/pagos', 'hoy-permitido', () => getDoc(doc(alice(), 'ajustes/pagos'))],
  ['Administración', 'Un admin que NO es el propietario nombra a otro admin', 'denegar', async () => { await env.withSecurityRulesDisabled(c => setDoc(doc(c.firestore(), 'users/admin2'), { isAdmin: true, creado: 0 })); return updateDoc(doc(ctx('admin2', 'a2@x.com'), 'users/alice'), { isAdmin: true }); }],

  ['Soporte', 'Enviar una incidencia normal (control: debe funcionar)', 'permitir', () => addDoc(collection(alice(), 'incidencias'), { uid: 'alice', email: 'alice@x.com', nombre: 'Alice', categoria: 'pago', mensaje: 'Hola', idioma: 'es', tecnico: 'Chrome', creada: ahora, estado: 'abierta' })],
  ['Administración', 'El propietario nombra a un admin (control: debe funcionar)', 'permitir', async () => { await env.withSecurityRulesDisabled(c => setDoc(doc(c.firestore(), 'users/lK7Y5eUYmSRAiXs2M1J7NyKPSQw2'), { isAdmin: true, creado: 0 })); return updateDoc(doc(ctx('lK7Y5eUYmSRAiXs2M1J7NyKPSQw2', 'brianantigua@gmail.com'), 'users/alice'), { isAdmin: true }); }],
  ['Administración', 'El propietario marca un pago a mano (control)', 'permitir', async () => { await env.withSecurityRulesDisabled(c => setDoc(doc(c.firestore(), 'users/lK7Y5eUYmSRAiXs2M1J7NyKPSQw2'), { isAdmin: true, creado: 0 })); return updateDoc(doc(ctx('lK7Y5eUYmSRAiXs2M1J7NyKPSQw2', 'brianantigua@gmail.com'), 'users/bob'), { paidUntil: ahora + 30 * DIA }); }],
  ['Soporte', 'Leer la incidencia de otro usuario', 'denegar', () => getDoc(doc(alice(), 'incidencias/inc_bob'))],
  ['Soporte', 'Listar todas las incidencias', 'denegar', () => getDocs(collection(alice(), 'incidencias'))],
  ['Soporte', 'Enviar una incidencia en nombre de otro (uid/correo ajenos)', 'denegar', () => addDoc(collection(alice(), 'incidencias'), { uid: 'bob', email: 'bob@x.com', categoria: 'pago', mensaje: 'x', creada: ahora, estado: 'abierta' })],
  ['Soporte', 'Enviar una incidencia ya «resuelta» o con campos extra', 'denegar', () => addDoc(collection(alice(), 'incidencias'), { uid: 'alice', email: 'alice@x.com', categoria: 'pago', mensaje: 'x', creada: ahora, estado: 'abierta', admin: true })],
  ['Soporte', 'Mensaje gigante (más de 2.000 caracteres)', 'denegar', () => addDoc(collection(alice(), 'incidencias'), { uid: 'alice', email: 'alice@x.com', categoria: 'pago', mensaje: 'x'.repeat(5000), creada: ahora, estado: 'abierta' })],
  ['Soporte', 'Marcar mi incidencia como resuelta', 'denegar', async () => { const r = await addDoc(collection(alice(), 'incidencias'), { uid: 'alice', email: 'alice@x.com', categoria: 'pago', mensaje: 'x', creada: ahora, estado: 'abierta' }); return updateDoc(r, { estado: 'resuelta' }); }],
  ['Soporte', 'Enviar incidencias con el correo SIN verificar (spam con cuentas falsas)', 'denegar', () => addDoc(collection(eve(), 'incidencias'), { uid: 'eve', email: 'eve@x.com', categoria: 'otro', mensaje: 'spam', creada: ahora, estado: 'abierta' })],

  ['Actividad', 'Latido normal de actividad (control: como la app)', 'permitir', () => setDoc(doc(alice(), `activity_logs/session_alice_${hoy}`), { uid: 'alice', email: 'alice@x.com', displayName: 'Alice', lastSeen: ahora, totalTime: 60000, end: null, start: ahora }, { merge: true })],
  ['Actividad', 'Cerrar sesión (control: end)', 'permitir', async () => { const db = alice(); await setDoc(doc(db, `activity_logs/session_alice_${hoy}`), { uid: 'alice', lastSeen: ahora, totalTime: 1000, end: null }); return setDoc(doc(db, `activity_logs/session_alice_${hoy}`), { end: ahora }, { merge: true }); }],
  ['Actividad', 'Usar la actividad como almacén (campos extra)', 'denegar', () => setDoc(doc(alice(), `activity_logs/session_alice_${hoy}`), { uid: 'alice', totalTime: 1, basura: 'x'.repeat(1000) })],
  ['Actividad', 'Sobrescribir el registro de actividad de otro', 'denegar', () => setDoc(doc(alice(), 'activity_logs/session_bob_20261107'), { uid: 'alice', totalTime: 0 })],
  ['Actividad', 'Crear registros a nombre de otro', 'denegar', () => setDoc(doc(alice(), 'activity_logs/session_bob_20261108'), { uid: 'bob' })],
  ['Actividad', 'Leer la actividad de otro', 'denegar', () => getDoc(doc(alice(), 'activity_logs/session_bob_20261107'))],
  ['Actividad', 'Inflar mi tiempo de uso (estadísticas del panel)', 'denegar', () => setDoc(doc(alice(), `activity_logs/session_alice_${hoy}`), { uid: 'alice', totalTime: 999999999 })],

  ['Invitaciones', 'Usar la invitación de otro correo con una cuenta SIN verificar', 'hoy-permitido', () => setDoc(doc(ctx('okupa', 'vip@x.com', false), 'users/okupa'), altaValida({ email: 'vip@x.com', invitado: true, invitadoHasta: 0 }))],
  ['Fable', 'Poner en mi perfil el uid de otra persona (engañar al panel de Gestión)', 'denegar', () => updateDoc(doc(alice(), 'users/alice'), { uid: 'bob' })],
  ['Fable', 'Darme de alta con el uid de otra persona en el perfil', 'denegar', () => setDoc(doc(nueva(), 'users/nueva'), altaValida({ uid: 'bob' }))],
  ['Fable', 'Crear miles de registros de actividad con fechas inventadas', 'denegar', () => setDoc(doc(alice(), 'activity_logs/session_alice_20991231'), { uid: 'alice', totalTime: 1, lastSeen: ahora })],
  ['Fable', 'Registro de actividad con el correo de otra persona', 'denegar', () => setDoc(doc(alice(), `activity_logs/session_alice_${hoy}`), { uid: 'alice', email: 'bob@x.com', totalTime: 1, lastSeen: ahora })],
  ['Fable', 'Incidencia con fecha futura para quedarse siempre la primera', 'denegar', () => addDoc(collection(alice(), 'incidencias'), { uid: 'alice', email: 'alice@x.com', categoria: 'pago', mensaje: 'x', creada: 9e15, estado: 'abierta' })],
  ['Fable', 'Error del sistema con un contexto gigante (almacén)', 'denegar', () => addDoc(collection(alice(), 'system_errors'), { uid: 'alice', context: 'x'.repeat(5000), error: 'e', timestamp: ahora })],
  ['Fable', 'Registrar un error normal (control: como la app)', 'permitir', () => addDoc(collection(alice(), 'system_errors'), { uid: 'alice', context: 'Actualizar Perfil', error: 'algo falló', timestamp: ahora })],
  ['Fable', 'Guardar mi perfil con mi propio uid (control: como la app)', 'permitir', () => setDoc(doc(alice(), 'users/alice'), { uid: 'alice', email: 'alice@x.com', lastLogin: ahora }, { merge: true })],

];

let bien = 0, debiles = 0, fallos = 0; const filas = [];
for (const [grupo, nombre, esperado, fn] of casos) {
  await sembrar();
  let permitido;
  try { await fn(); permitido = true; }
  catch (e) {
    const m = String(e?.message || e);
    if (/PERMISSION_DENIED|permission-denied|Missing or insufficient permissions|false for/i.test(m)) permitido = false;
    else { filas.push(`⁉️  error inesperado           | ${grupo.padEnd(14)} | ${nombre}: ${m.slice(0, 120)}`); fallos++; continue; }
  }
  let estado;
  if (esperado === 'denegar') { estado = permitido ? '❌ VULNERABLE' : '✅ bloqueado'; permitido ? fallos++ : bien++; }
  else if (esperado === 'permitir') { estado = permitido ? '✅ funciona' : '❌ ROTO (bloquea a usuarios legítimos)'; permitido ? bien++ : fallos++; }
  else { estado = permitido ? '⚠️  permitido (debilidad)' : '✅ bloqueado'; permitido ? debiles++ : bien++; }
  filas.push(`${estado.padEnd(28)} | ${grupo.padEnd(14)} | ${nombre}`);
}
console.log(filas.join('\n'));
console.log(`\nResumen: ${bien} correctos · ${debiles} debilidades · ${fallos} fallos graves (de ${casos.length} pruebas)`);
await env.cleanup();
process.exit(fallos ? 1 : 0);
