// Datos de contacto y enlaces oficiales de FinanziApp. Se usan en las páginas
// legales, en Configuración y en el pie de la portada: cambiarlos aquí los
// cambia en toda la app (después hay que volver a desplegar el hosting).

export const SITIO = 'https://finanziapp.com';

// Buzón de soporte que se muestra a los usuarios. Cuando exista
// soporte@finanziapp.com (pasos en CORREO.md), cambia esta línea.
export const CORREO_SOPORTE = 'brian@franquizb.com';

// Enlace OFICIAL para aportaciones voluntarias: un Payment Link de la misma
// cuenta de Stripe que cobra la suscripción, con "el cliente elige el importe"
// (pasos en CORREO.md, apartado "Aportaciones"). Mientras esté vacío, la
// sección de apoyo no aparece en ningún sitio.
// También se puede fijar al compilar con REACT_APP_URL_APOYO.
export const URL_APOYO = process.env.REACT_APP_URL_APOYO || '';

// Solo se aceptan enlaces https a dominios de pago conocidos: si alguien
// pegara aquí una URL equivocada, el botón no se mostraría.
const DOMINIOS_APOYO = ['buy.stripe.com', 'donate.stripe.com', 'ko-fi.com', 'www.buymeacoffee.com', 'github.com'];
export const enlaceApoyo = () => {
  try {
    const u = new URL(URL_APOYO);
    return u.protocol === 'https:' && DOMINIOS_APOYO.includes(u.hostname) ? u.href : null;
  } catch (e) {
    return null;
  }
};
