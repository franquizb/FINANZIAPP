import { calcularResumen, suscripcionDe, netoPorCobro, GRACIA_MS, DIA_MS } from './resumenGestion';

const AHORA = new Date(2026, 10, 7, 12, 0, 0).getTime(); // 7 nov 2026, 12:00
const dias = (n) => AHORA + n * DIA_MS;
const fin = (n) => dias(n) + GRACIA_MS; // paidUntil para un periodo que termina en n días

const users = [
  { uid: 'admin', isAdmin: true, creado: dias(-200) },
  { uid: 'a1', creado: dias(-40), trialEndsAt: dias(-25), stripeSubscriptionId: 's1', stripeStatus: 'active', paidUntil: fin(10) },
  { uid: 'a2', creado: dias(-20), trialEndsAt: dias(-5), stripeSubscriptionId: 's2', stripeStatus: 'active', paidUntil: fin(40) },
  { uid: 'p1', creado: dias(-3), trialEndsAt: dias(12), stripeSubscriptionId: 's3', stripeStatus: 'trialing', paidUntil: fin(12) },
  { uid: 'c1', creado: dias(-50), trialEndsAt: dias(-35), stripeSubscriptionId: 's4', stripeStatus: 'active', cancelAtPeriodEnd: true, paidUntil: fin(5) },
  { uid: 'i1', creado: dias(-60), trialEndsAt: dias(-45), stripeSubscriptionId: 's5', stripeStatus: 'past_due', paidUntil: fin(-1) },
  { uid: 't1', creado: dias(0), trialEndsAt: dias(15) },
  { uid: 't2', creado: dias(-10), trialEndsAt: dias(5) },
  { uid: 'x1', creado: dias(-30), trialEndsAt: dias(-15) },
  { uid: 'x2', creado: dias(-33), trialEndsAt: dias(-18) },
  { uid: 'manual', creado: dias(-5), trialEndsAt: dias(10), paidUntil: dias(100) },
  { uid: 'inv', creado: dias(-6), trialEndsAt: dias(9), invitado: true, invitadoHasta: dias(20) },
  { uid: 'viejo' }
];
const logs = [
  { uid: 'viejo', start: dias(-400), lastSeen: dias(-400) },
  { uid: 'a1', lastSeen: dias(0) },
  { uid: 'a1', lastSeen: dias(-1) },
  { uid: 't2', lastSeen: dias(-6) },
  { uid: 'x1', lastSeen: dias(-20) }
];

test('clasifica las suscripciones de Stripe', () => {
  expect(suscripcionDe(users[1], AHORA)).toEqual({ tipo: 'activa', fecha: dias(10) });
  expect(suscripcionDe(users[3], AHORA).tipo).toBe('prueba');
  expect(suscripcionDe(users[4], AHORA).tipo).toBe('cancelando');
  expect(suscripcionDe(users[5], AHORA).tipo).toBe('impago');
  expect(suscripcionDe(users[10], AHORA)).toBeNull(); // acceso puesto a mano: sin ingresos
});

test('resumen de ingresos, altas y agenda', () => {
  const r = calcularResumen({ users, logs, ahora: AHORA, precio: 2.5 });
  expect(r.usuarios).toBe(13);
  expect(r.altas.hoy).toBe(1);
  expect(r.altas.d7).toBe(4); // t1, p1, manual, inv
  expect(r.altas.sinFecha).toBe(0); // «viejo» toma su primera sesión
  expect(r.activos).toEqual({ hoy: 1, d7: 2, d30: 3 });
  const i = r.ingresos;
  expect([i.activas, i.pruebaConTarjeta, i.cancelando, i.impago]).toEqual([2, 1, 1, 1]);
  expect(i.mrr).toBe(5);
  expect(i.previsto).toBe(7.5);
  expect(i.anual).toBe(90);
  expect(i.netoPrevisto).toBeCloseTo(3 * netoPorCobro(2.5));
  expect(netoPorCobro(2.5)).toBeCloseTo(2.11);
  // Conversión: suscritos alguna vez (a1, a2, p1, c1, i1) de los decididos (+ x1, x2, viejo sin prueba no cuenta)
  expect(i.convertidos).toBe(5);
  expect(i.decididos).toBe(7);
  expect(i.enPrueba).toBe(2); // t1, t2
  expect(i.potencialPruebas).toBeCloseTo(2 * 2.5 * 5 / 7);
  // Agenda: renovación a1 (10 d), primer cobro p1 (12 d), baja c1 (5 d), fin de prueba t2 (5 d) y t1 (15 d), invitación (20 d); a2 renueva en 40 d (fuera)
  expect(r.agenda.map(e => `${e.tipo}:${e.uid}`)).toEqual(['baja:c1', 'finPrueba:t2', 'renovacion:a1', 'primerCobro:p1', 'finPrueba:t1', 'finInvitacion:inv']);
  expect(r.cobrosProximos).toEqual({ n: 2, importe: 5 });
  expect(r.impagos.map(e => e.uid)).toEqual(['i1']);
  expect(r.porDia).toHaveLength(30);
  expect(r.porDia[29].altas).toBe(1);
  expect(r.porMes).toHaveLength(12);
  expect(r.porMes[11].total).toBe(13);
  expect(r.porMes.reduce((s, m) => s + m.altas, 0)).toBe(12); // «viejo» es de hace 400 días
});
