// Cálculos del resumen del panel de gestión (pestaña «Resumen»).
// Funciones puras sobre los documentos de users/ y activity_logs/ que ya
// carga el panel: no hacen consultas propias, así que el resumen no cuesta
// lecturas extra de Firestore.

export const DIA_MS = 86400000;
// Días de gracia que la Cloud Function suma a paidUntil tras el fin del periodo.
export const GRACIA_MS = 3 * DIA_MS;
// Comisiones aproximadas de Stripe por cobro con tarjeta en EE. UU.
// (2,9 % + 0,30 USD) más Stripe Billing (0,7 % del importe facturado).
export const COMISION_STRIPE = { porcentaje: 0.029 + 0.007, fijo: 0.30 };

// Estado de un usuario para el panel de gestión.
export const estadoUsuarioAdmin = (u, ahora) => {
  if (u.isAdmin) return 'admin';
  if (u.bloqueado) return 'bloqueado';
  if ((u.paidUntil || 0) > ahora) return u.stripeStatus === 'past_due' ? 'impago' : (u.cancelAtPeriodEnd ? 'cancelando' : 'pago');
  if (u.invitado === true && (!(u.invitadoHasta || 0) || u.invitadoHasta > ahora)) return 'invitado';
  if ((u.trialEndsAt || 0) > ahora) return 'prueba';
  return 'caducado';
};

// Situación de la suscripción de Stripe de un usuario (solo cuentas que han
// pasado por Stripe; un acceso de pago puesto a mano no genera ingresos).
//   activa      → paga y renueva el día `fecha`
//   prueba      → se suscribió durante la prueba: primer cobro el día `fecha`
//   cancelando  → ha pedido la baja: deja de tener acceso el día `fecha`
//   impago      → el último cobro falló; Stripe lo está reintentando
export const suscripcionDe = (u, ahora) => {
  if (!u.stripeSubscriptionId || !((u.paidUntil || 0) > ahora)) return null;
  const fecha = u.paidUntil - GRACIA_MS;
  if (u.stripeStatus === 'past_due') return { tipo: 'impago', fecha };
  if (u.cancelAtPeriodEnd) return { tipo: 'cancelando', fecha };
  if (u.stripeStatus === 'trialing') return { tipo: 'prueba', fecha };
  if (u.stripeStatus === 'active') return { tipo: 'activa', fecha };
  return null;
};

export const netoPorCobro = (precio) => Math.max(0, precio - precio * COMISION_STRIPE.porcentaje - COMISION_STRIPE.fijo);

const inicioDia = (ms) => { const d = new Date(ms); d.setHours(0, 0, 0, 0); return d.getTime(); };
const claveMes = (ms) => { const d = new Date(ms); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; };

// Fecha de alta de cada usuario: `creado` (cuentas nuevas) o, en las cuentas
// antiguas que no lo tienen, su primera sesión registrada.
export const fechasDeAlta = (users, logs) => {
  const primera = {};
  for (const l of logs) {
    const t = l.start || l.lastSeen;
    if (!l.uid || !t) continue;
    if (!primera[l.uid] || t < primera[l.uid]) primera[l.uid] = t;
  }
  const fechas = {};
  for (const u of users) fechas[u.uid] = u.creado || primera[u.uid] || null;
  return fechas;
};

export function calcularResumen({ users, logs, ahora, precio, dias = 30, meses = 12, horizonte = 30 }) {
  const hoy = inicioDia(ahora);
  const alta = fechasDeAlta(users, logs);
  const desde = (n) => hoy - (n - 1) * DIA_MS; // n días contando hoy

  // ─── Usuarios y altas ───
  const conFecha = users.filter(u => alta[u.uid]);
  const altasEn = (inicio, fin = Infinity) => conFecha.filter(u => alta[u.uid] >= inicio && alta[u.uid] < fin).length;
  const dHoy = new Date(hoy);
  const inicioMes = new Date(dHoy.getFullYear(), dHoy.getMonth(), 1).getTime();
  const inicioMesAnterior = new Date(dHoy.getFullYear(), dHoy.getMonth() - 1, 1).getTime();
  // Mismo tramo del mes anterior (del día 1 al día de hoy) para comparar el ritmo.
  const mismoDiaMesAnterior = Math.min(
    new Date(dHoy.getFullYear(), dHoy.getMonth() - 1, dHoy.getDate() + 1).getTime(),
    inicioMes
  );
  const altas = {
    hoy: altasEn(hoy),
    d7: altasEn(desde(7)),
    d30: altasEn(desde(30)),
    mes: altasEn(inicioMes),
    mesAnteriorMismoTramo: altasEn(inicioMesAnterior, mismoDiaMesAnterior),
    sinFecha: users.length - conFecha.length
  };

  // ─── Activos (usuarios distintos con sesión en el periodo) ───
  const activosEn = (inicio) => new Set(logs.filter(l => l.uid && (l.lastSeen || 0) >= inicio).map(l => l.uid)).size;
  const activos = { hoy: activosEn(hoy), d7: activosEn(desde(7)), d30: activosEn(desde(30)) };

  // ─── Estados de las cuentas ───
  const estados = {};
  for (const u of users) { const e = estadoUsuarioAdmin(u, ahora); estados[e] = (estados[e] || 0) + 1; }

  // ─── Suscripciones e ingresos ───
  const subs = { activa: [], prueba: [], cancelando: [], impago: [] };
  for (const u of users) { const s = suscripcionDe(u, ahora); if (s) subs[s.tipo].push({ u, fecha: s.fecha }); }
  const n = (k) => subs[k].length;
  const enPruebaSinTarjeta = users.filter(u => estadoUsuarioAdmin(u, ahora) === 'prueba');
  // Conversión: de las cuentas cuya prueba ya terminó (o que se suscribieron),
  // cuántas han llegado a suscribirse alguna vez.
  const clientes = users.filter(u => !u.isAdmin && !(u.invitado === true && estadoUsuarioAdmin(u, ahora) === 'invitado'));
  const convertidos = clientes.filter(u => u.stripeSubscriptionId).length;
  const decididos = clientes.filter(u => u.stripeSubscriptionId || ((u.trialEndsAt || 0) > 0 && u.trialEndsAt <= ahora)).length;
  const conversion = decididos > 0 ? convertidos / decididos : null;
  const mrr = n('activa') * precio;
  const previsto = (n('activa') + n('prueba')) * precio;
  const ingresos = {
    precio,
    activas: n('activa'),
    pruebaConTarjeta: n('prueba'),
    cancelando: n('cancelando'),
    impago: n('impago'),
    mrr,
    previsto,
    netoPrevisto: (n('activa') + n('prueba')) * netoPorCobro(precio),
    anual: previsto * 12,
    perdida: n('cancelando') * precio,
    enRiesgo: n('impago') * precio,
    enPrueba: enPruebaSinTarjeta.length,
    conversion,
    convertidos,
    decididos,
    // Lo que añadirían las pruebas en curso si convierten como hasta ahora
    // (sin historial todavía: el máximo, si se suscribieran todas).
    potencialPruebas: enPruebaSinTarjeta.length * precio * (conversion == null ? 1 : conversion),
    potencialEsMaximo: conversion == null
  };

  // ─── Agenda de los próximos días ───
  const limite = ahora + horizonte * DIA_MS;
  const agenda = [];
  const anadir = (tipo, u, fecha, importe = 0) => { if (fecha >= hoy && fecha <= limite) agenda.push({ tipo, uid: u.uid, nombre: u.displayName || '', email: u.email || '', fecha, importe }); };
  subs.activa.forEach(({ u, fecha }) => anadir('renovacion', u, fecha, precio));
  subs.prueba.forEach(({ u, fecha }) => anadir('primerCobro', u, fecha, precio));
  subs.cancelando.forEach(({ u, fecha }) => anadir('baja', u, fecha));
  enPruebaSinTarjeta.forEach(u => anadir('finPrueba', u, u.trialEndsAt));
  users.filter(u => estadoUsuarioAdmin(u, ahora) === 'invitado' && u.invitadoHasta).forEach(u => anadir('finInvitacion', u, u.invitadoHasta));
  agenda.sort((a, b) => a.fecha - b.fecha);
  const cobrosProximos = agenda.filter(e => e.importe > 0);
  const impagos = subs.impago.map(({ u, fecha }) => ({ tipo: 'impago', uid: u.uid, nombre: u.displayName || '', email: u.email || '', fecha, importe: precio }));

  // ─── Series para los gráficos ───
  const porDia = Array.from({ length: dias }, (_, i) => {
    const inicio = hoy - (dias - 1 - i) * DIA_MS;
    // Paso de 25 h y vuelta a medianoche: resiste los cambios de hora.
    const fin = inicioDia(inicio + 25 * 3600000);
    return { fecha: inicio, altas: altasEn(inicio, fin) };
  });
  const porMes = Array.from({ length: meses }, (_, i) => {
    const inicio = new Date(dHoy.getFullYear(), dHoy.getMonth() - (meses - 1 - i), 1).getTime();
    const fin = new Date(dHoy.getFullYear(), dHoy.getMonth() - (meses - 2 - i), 1).getTime();
    // Total al cierre del mes; las cuentas sin fecha se cuentan desde el principio.
    const total = altas.sinFecha + conFecha.filter(u => alta[u.uid] < fin).length;
    return { clave: claveMes(inicio), fecha: inicio, altas: altasEn(inicio, fin), total };
  });

  return {
    usuarios: users.length,
    altas,
    activos,
    estados,
    ingresos,
    agenda,
    cobrosProximos: { n: cobrosProximos.length, importe: cobrosProximos.reduce((s, e) => s + e.importe, 0) },
    impagos,
    porDia,
    porMes
  };
}
