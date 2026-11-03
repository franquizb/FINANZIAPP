// ─── MODELO DE ACCESO ────────────────────────────────────────────────────────
// Tipos de cuenta (roles), qué secciones usa cada uno y si puede editar sus
// datos. Los ajustes globales viven en Firestore (ajustes/acceso) y el
// administrador los cambia desde Gestión → Roles y permisos. Cada usuario
// puede tener además excepciones propias (vistasExtra / vistasQuitadas) que
// solo escribe el administrador.
//
// OJO: todo esto gobierna la INTERFAZ. Lo que de verdad corta el acceso de
// escritura son las reglas de Firestore (firestore.rules), que aplican el
// mismo cálculo de rol y leen los mismos ajustes.

// Secciones de la app, en el orden del menú.
export const VISTAS = ['dashboard', 'monthly', 'networth', 'loans', 'trading', 'analysis', 'settings', 'users'];
// Secciones que el administrador reparte por rol: Configuración siempre está
// disponible (ahí se paga y se cierra sesión) y Gestión es solo de administradores.
export const VISTAS_ASIGNABLES = ['dashboard', 'monthly', 'networth', 'loans', 'trading', 'analysis'];

// Roles que se configuran. 'admin' y 'bloqueado' no se configuran: el admin lo
// ve todo y el bloqueado solo conserva la lectura (RGPD).
export const ROLES = ['prueba', 'pago', 'invitado', 'caducado'];

export const AJUSTES_ACCESO_POR_DEFECTO = {
  diasPrueba: 15,
  roles: {
    prueba: { vistas: [...VISTAS_ASIGNABLES], escribir: true },
    pago: { vistas: [...VISTAS_ASIGNABLES], escribir: true },
    invitado: { vistas: [...VISTAS_ASIGNABLES], escribir: true },
    // Prueba terminada sin pagar: solo el Dashboard, y sin editar.
    caducado: { vistas: ['dashboard'], escribir: false }
  }
};

// Limpia lo que venga de Firestore (o null) y rellena con los valores por defecto.
export const normalizarAjustesAcceso = (d) => {
  const base = AJUSTES_ACCESO_POR_DEFECTO;
  const dias = parseInt(d?.diasPrueba);
  const roles = {};
  ROLES.forEach(r => {
    const src = d?.roles?.[r];
    roles[r] = {
      vistas: Array.isArray(src?.vistas) ? VISTAS_ASIGNABLES.filter(v => src.vistas.includes(v)) : [...base.roles[r].vistas],
      escribir: typeof src?.escribir === 'boolean' ? src.escribir : base.roles[r].escribir
    };
  });
  return { diasPrueba: dias >= 1 && dias <= 365 ? dias : base.diasPrueba, roles };
};

// Rol efectivo de un usuario de sesión (o de un documento users/{uid}).
// Mismo orden que rolDe() en firestore.rules.
export const rolEfectivo = (user, ahora = Date.now()) => {
  if (!user) return 'anonimo';
  if (user.isAdmin) return 'admin';
  if (user.bloqueado) return 'bloqueado';
  if ((user.paidUntil || 0) > ahora) return 'pago';
  if (user.invitado === true && (!(user.invitadoHasta || 0) || user.invitadoHasta > ahora)) return 'invitado';
  if ((user.trialEndsAt || 0) > ahora) return 'prueba';
  return 'caducado';
};

const ajustesDe = (ajustes) => ajustes || AJUSTES_ACCESO_POR_DEFECTO;

// Secciones que puede abrir el usuario: las de su rol, más sus extras, menos
// las quitadas; Configuración siempre; Gestión solo para administradores.
export const vistasPermitidas = (user, ajustes, ahora = Date.now()) => {
  const rol = rolEfectivo(user, ahora);
  if (rol === 'anonimo') return [];
  if (rol === 'admin') return [...VISTAS];
  const a = ajustesDe(ajustes);
  const base = rol === 'bloqueado' ? a.roles.caducado.vistas : (a.roles[rol]?.vistas || []);
  const extra = Array.isArray(user.vistasExtra) ? user.vistasExtra : [];
  const quitadas = Array.isArray(user.vistasQuitadas) ? user.vistasQuitadas : [];
  const set = new Set([...base, ...extra].filter(v => VISTAS_ASIGNABLES.includes(v) && !quitadas.includes(v)));
  set.add('settings');
  return VISTAS.filter(v => set.has(v));
};

export const puedeVer = (user, ajustes, vista) => vistasPermitidas(user, ajustes).includes(vista);

// Puede editar sus datos (las reglas lo deciden de verdad; esto evita mostrar
// botones que acabarían en un error de "no guardado").
export const puedeEscribir = (user, ajustes, ahora = Date.now()) => {
  const rol = rolEfectivo(user, ahora);
  if (rol === 'admin') return true;
  if (rol === 'anonimo' || rol === 'bloqueado') return false;
  return ajustesDe(ajustes).roles[rol]?.escribir !== false;
};

// Secciones que el usuario NO tiene pero tendría con la suscripción: se
// muestran en el menú con un candado y llevan a la pantalla de pago.
export const vistasConCandado = (user, ajustes, ahora = Date.now()) => {
  const rol = rolEfectivo(user, ahora);
  if (['admin', 'pago', 'bloqueado', 'anonimo'].includes(rol)) return [];
  const mias = vistasPermitidas(user, ajustes, ahora);
  const quitadas = Array.isArray(user.vistasQuitadas) ? user.vistasQuitadas : [];
  return ajustesDe(ajustes).roles.pago.vistas.filter(v => !mias.includes(v) && !quitadas.includes(v));
};

// Excepciones de un usuario a partir de las secciones marcadas por el admin:
// lo marcado que su rol no incluye pasa a vistasExtra; lo desmarcado que su
// rol sí incluye pasa a vistasQuitadas.
export const excepcionesDesdeMarcadas = (rol, ajustes, marcadas) => {
  const a = ajustesDe(ajustes);
  const base = rol === 'admin' ? VISTAS_ASIGNABLES : (rol === 'bloqueado' ? a.roles.caducado.vistas : (a.roles[rol]?.vistas || []));
  return {
    vistasExtra: VISTAS_ASIGNABLES.filter(v => marcadas.includes(v) && !base.includes(v)),
    vistasQuitadas: VISTAS_ASIGNABLES.filter(v => !marcadas.includes(v) && base.includes(v))
  };
};
