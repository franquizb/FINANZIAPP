// Cliente de las Cloud Functions de suscripción (functions/index.js).
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from './firebase';

// Debe coincidir con setGlobalOptions({ region }) en functions/index.js.
export const REGION_FUNCIONES = 'europe-west1';
// Precio de acceso anticipado (lanzamiento en EE. UU.): 2,50 USD al mes. Tiene
// que coincidir con el precio recurrente creado en Stripe (STRIPE_PRICE_ID).
// Para subirlo más adelante se crea un precio nuevo en Stripe y se cambia
// STRIPE_PRICE_ID; quien ya estuviera suscrito conserva su precio.
export const PRECIO_MENSUAL = 2.5;
export const MONEDA_PRECIO = 'USD';
// Interruptor general del código de pagos. Quién puede pagar lo decide el
// administrador en Gestión → Stripe (documento ajustes/pagos): primero solo
// los probadores y después todo el mundo. Sin ajustes, nadie ve el botón.
export const STRIPE_ACTIVO = true;

// Lanzamiento de los pagos (ajustes/pagos): { abierto, probadores: [correos] }.
// La app lo lee en tiempo real; la función crearSesionCheckout aplica la misma
// regla en el servidor, así que ocultar el botón no es la única barrera.
export const AJUSTES_PAGOS_POR_DEFECTO = { abierto: false, probadores: [] };
export const normalizarAjustesPagos = (d) => ({
  abierto: d?.abierto === true,
  probadores: Array.isArray(d?.probadores) ? [...new Set(d.probadores.map(c => String(c || '').trim().toLowerCase()).filter(c => c.includes('@')))].slice(0, 50) : []
});
let ajustesPagosActuales = AJUSTES_PAGOS_POR_DEFECTO;
export const setAjustesPagos = (a) => { ajustesPagosActuales = normalizarAjustesPagos(a); };
export const esProbadorPagos = (user) => !!user?.email && ajustesPagosActuales.probadores.includes(String(user.email).toLowerCase());
export const pagosAbiertos = () => ajustesPagosActuales.abierto;
// ¿Puede este usuario pagar ahora mismo?
export const pagoDisponiblePara = (user) => STRIPE_ACTIVO && !!user && (ajustesPagosActuales.abierto || esProbadorPagos(user));

const funciones = () => getFunctions(app, REGION_FUNCIONES);
const llamar = async (nombre, datos) => (await httpsCallable(funciones(), nombre)(datos || {})).data;

// Dominio desde el que se está usando la app. Stripe vuelve a este mismo dominio
// tras el pago: la sesión de Firebase Auth es distinta en cada dominio y, si
// volviera a otro, el usuario aterrizaría sin sesión.
const origen = () => (typeof window !== 'undefined' ? window.location.origin : '');

// true si el error indica que las funciones no están desplegadas o configuradas.
export const stripeNoConfigurado = (e) => ['functions/not-found', 'functions/unavailable', 'functions/internal'].includes(e?.code) || /not-found|CORS|Failed to fetch/i.test(String(e?.message || ''));

// Abre Stripe Checkout (o el portal si ya hay suscripción viva).
export const irAPagar = async (locale) => {
  const r = await llamar('crearSesionCheckout', { locale, origen: origen() });
  if (!r?.url) throw new Error('Stripe no devolvió una URL');
  window.location.assign(r.url);
};

// Baja desde la app (cancelar = true) o reactivación (false). La suscripción
// deja de renovarse al final del periodo pagado; el acceso se mantiene.
export const cambiarRenovacion = (cancelar, motivo) => llamar('cambiarRenovacion', { cancelar, motivo });

// Portal de Stripe: cambiar tarjeta, ver facturas, cancelar.
export const irAlPortal = async () => {
  const r = await llamar('crearPortalCliente', { origen: origen() });
  if (!r?.url) throw new Error('Stripe no devolvió una URL');
  window.location.assign(r.url);
};

// Solo administradores: estado de todas las suscripciones.
export const resumenStripe = () => llamar('resumenStripe');
