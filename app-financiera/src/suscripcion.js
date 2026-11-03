// Cliente de las Cloud Functions de suscripción (functions/index.js).
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from './firebase';

// Debe coincidir con setGlobalOptions({ region }) en functions/index.js.
export const REGION_FUNCIONES = 'europe-west1';
export const PRECIO_MENSUAL_EUR = 4.99;

const funciones = () => getFunctions(app, REGION_FUNCIONES);
const llamar = async (nombre, datos) => (await httpsCallable(funciones(), nombre)(datos || {})).data;

// true si el error indica que las funciones no están desplegadas o configuradas.
export const stripeNoConfigurado = (e) => ['functions/not-found', 'functions/unavailable', 'functions/internal'].includes(e?.code) || /not-found|CORS|Failed to fetch/i.test(String(e?.message || ''));

// Abre Stripe Checkout (o el portal si ya hay suscripción viva).
export const irAPagar = async (locale) => {
  const r = await llamar('crearSesionCheckout', { locale });
  if (!r?.url) throw new Error('Stripe no devolvió una URL');
  window.location.assign(r.url);
};

// Portal de Stripe: cambiar tarjeta, ver facturas, cancelar.
export const irAlPortal = async () => {
  const r = await llamar('crearPortalCliente');
  if (!r?.url) throw new Error('Stripe no devolvió una URL');
  window.location.assign(r.url);
};

// Solo administradores: estado de todas las suscripciones.
export const resumenStripe = () => llamar('resumenStripe');
