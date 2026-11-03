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
// Ponlo a true cuando las funciones de Stripe estén desplegadas y configuradas
// (STRIPE.md). Mientras sea false, la app no muestra el botón de pago sino un
// aviso de que todavía no está disponible.
export const STRIPE_ACTIVO = false;

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

// Portal de Stripe: cambiar tarjeta, ver facturas, cancelar.
export const irAlPortal = async () => {
  const r = await llamar('crearPortalCliente', { origen: origen() });
  if (!r?.url) throw new Error('Stripe no devolvió una URL');
  window.location.assign(r.url);
};

// Solo administradores: estado de todas las suscripciones.
export const resumenStripe = () => llamar('resumenStripe');
