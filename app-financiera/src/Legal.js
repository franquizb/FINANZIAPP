import React from 'react';
import { useApp } from './context/AppContext';
import { SITIO, CORREO_SOPORTE } from './marca';

// Páginas legales públicas: /privacidad y /terminos (también /privacy y /terms).
// Responsable y contacto: se muestran tal cual en la página.
const RESPONSABLE = 'Brian Fránquiz';
const CONTACTO = CORREO_SOPORTE;
const FECHA = { es: '5 de noviembre de 2026', en: 'November 5, 2026' };

const TEXTOS = {
  es: {
    privacidad: {
      titulo: 'Política de privacidad',
      secciones: [
        ['Quién es el responsable', `El responsable del tratamiento de tus datos es ${RESPONSABLE}, titular de FinanziApp (${SITIO}). Puedes escribir a ${CONTACTO} para cualquier cuestión relacionada con tus datos.`],
        ['Qué datos tratamos', 'Datos de cuenta: correo electrónico, nombre que elijas, avatar y, si entras con Google, el identificador y la foto de perfil que Google nos facilita. Datos que introduces en la app: presupuestos, movimientos, saldos, préstamos, operaciones y cualquier otra información financiera que registres; son tuyos y solo se usan para mostrártelos y calcular tus resúmenes. Datos de uso: fecha de alta, último acceso, duración de las sesiones y errores técnicos de la aplicación, para mantener el servicio. Datos de pago: si contratas la suscripción, el pago lo gestiona Stripe; nosotros solo guardamos el identificador de cliente, el estado de la suscripción y hasta cuándo está pagada. Nunca vemos ni almacenamos tu tarjeta; lo mismo vale para las aportaciones voluntarias. Newsletter: si te apuntas, guardamos que lo has hecho, la fecha, el idioma y desde dónde (registro o Configuración), y la fecha de baja si te das de baja.'],
        ['Para qué y con qué base legal', 'Prestarte el servicio que contratas al crear la cuenta (ejecución del contrato). Cobrar la suscripción y emitir facturas (contrato y obligaciones legales). Mantener la seguridad, prevenir abusos y corregir errores (interés legítimo). Enviarte correos del servicio, como la verificación del correo o el restablecimiento de la contraseña (contrato). Enviarte la newsletter solo si te apuntas (consentimiento): ideas para ahorrar, novedades de FinanziApp y, en ocasiones, alguna recomendación patrocinada, siempre identificada como publicidad; puedes retirar el consentimiento cuando quieras desde Configuración o con el enlace de baja de cada correo, sin que afecte a tu cuenta. Gestionar las aportaciones voluntarias que decidas hacer (contrato y obligaciones legales). No vendemos ni cedemos tus datos a terceros con fines comerciales, y los patrocinadores nunca reciben tus datos.'],
        ['Dónde se guardan y quién accede', 'La app funciona sobre Firebase y Google Cloud (Google LLC). Los datos se almacenan en servidores de Google en Estados Unidos, con las garantías del Marco de Privacidad de Datos UE-EE. UU. y las cláusulas contractuales tipo de la Comisión Europea. Stripe Payments Europe trata los datos de pago como encargado y responsable independiente para el cobro. Para enviar la newsletter podemos usar un proveedor de envío de correo (encargado del tratamiento), que solo recibe tu correo, tu nombre y tu idioma. Solo el administrador de FinanziApp puede acceder a los datos de tu cuenta, y únicamente para darte soporte o mantener el servicio.'],
        ['Cookies y almacenamiento local', 'Usamos el almacenamiento local del navegador para mantener tu sesión iniciada y recordar preferencias como idioma y tema. Firebase Analytics puede recoger estadísticas de uso agregadas (páginas vistas, dispositivo, país) mediante identificadores anónimos. No usamos cookies publicitarias.'],
        ['Cuánto tiempo', 'Conservamos tus datos mientras tu cuenta exista. Si la prueba o la suscripción termina, los datos se conservan en modo de solo lectura para que puedas consultarlos o reactivar la cuenta. Puedes pedir la eliminación completa en cualquier momento; los registros de facturación se conservan el tiempo que exige la ley.'],
        ['Tus derechos', 'Puedes acceder a tus datos, rectificarlos, suprimirlos, pedir su portabilidad, limitar u oponerte al tratamiento escribiendo a ' + CONTACTO + '. Si consideras que no hemos atendido tu solicitud, puedes reclamar ante la Agencia Española de Protección de Datos (www.aepd.es).'],
        ['Seguridad', 'Todas las comunicaciones van cifradas (HTTPS). Las contraseñas las custodia Firebase Authentication con cifrado seguro; nunca se guardan en nuestra base de datos. Las reglas de la base de datos impiden que una cuenta acceda a los datos de otra.'],
        ['Menores', 'FinanziApp está dirigida a mayores de 18 años. No creamos cuentas a sabiendas para menores; si detectamos una, la eliminaremos.'],
        ['Cambios', 'Si cambiamos esta política, publicaremos la nueva versión en esta misma dirección e indicaremos la fecha de actualización. Última actualización: ' + FECHA.es + '.']
      ]
    },
    terminos: {
      titulo: 'Términos de uso',
      secciones: [
        ['El servicio', `FinanziApp es una aplicación web de gestión de finanzas personales ofrecida por ${RESPONSABLE} (${SITIO}). Permite registrar presupuestos, movimientos, patrimonio, préstamos y operaciones, y ver resúmenes y gráficos a partir de lo que introduces.`],
        ['Tu cuenta', 'Para usar la app necesitas una cuenta con un correo verificado y una contraseña (también si entras con Google). Eres responsable de mantener tus credenciales a salvo y de la información que registras. Una cuenta es personal y no puede compartirse.'],
        ['Prueba gratuita y suscripción', 'Al registrarte dispones de un periodo de prueba gratuito. Al terminar, la cuenta pasa a modo de solo lectura (puedes ver tu Dashboard) hasta que actives la suscripción. El precio de acceso anticipado es de 2,50 USD al mes, impuestos incluidos cuando procedan, y se mantiene mientras conserves la suscripción. El pago se renueva cada mes a través de Stripe y puedes cancelarlo cuando quieras desde Configuración; la cancelación surte efecto al final del periodo pagado. Podemos ofrecer cuentas invitadas gratuitas a nuestra discreción.'],
        ['Aportaciones voluntarias', 'Si quieres, puedes apoyar el desarrollo de FinanziApp con una aportación voluntaria a través de nuestro canal oficial. Es un pago único del importe que elijas y no es una compra: no da acceso a funciones adicionales ni sustituye a la suscripción. Si te equivocas al hacerla, escríbenos en los 14 días siguientes y te la devolvemos.'],
        ['Lo que no es FinanziApp', 'FinanziApp es una herramienta de organización. No presta asesoramiento financiero, fiscal ni de inversión, y los cálculos (por ejemplo, simulaciones de préstamos o resultados de operaciones) se basan únicamente en los datos que tú introduces. Las decisiones que tomes con esa información son tuyas.'],
        ['Uso aceptable', 'No puedes usar la app para fines ilegales, intentar acceder a datos de otros usuarios, interferir con el servicio ni extraer su código o contenido de forma automatizada. Podemos suspender cuentas que incumplan estas normas.'],
        ['Disponibilidad y cambios', 'Trabajamos para que el servicio esté disponible de forma continua, pero puede haber interrupciones por mantenimiento o causas ajenas. Podemos mejorar, cambiar o retirar funciones; si un cambio afecta de forma relevante a lo que has contratado, te avisaremos con antelación.'],
        ['Responsabilidad', 'En la medida que permita la ley, no respondemos de pérdidas indirectas derivadas del uso de la app ni de decisiones tomadas a partir de la información que muestra. Nuestra responsabilidad total queda limitada al importe pagado por la suscripción en los doce meses anteriores.'],
        ['Baja y eliminación', 'Puedes dejar de usar la app en cualquier momento y pedir la eliminación completa de tu cuenta y tus datos escribiendo a ' + CONTACTO + '.'],
        ['Ley aplicable', 'Estos términos se rigen por la legislación española. Si eres consumidor, conservas además los derechos que te reconozca la normativa de tu país de residencia.'],
        ['Contacto', 'Para cualquier duda sobre estos términos: ' + CONTACTO + '. Última actualización: ' + FECHA.es + '.']
      ]
    },
    volver: '← Volver a FinanziApp', idioma: 'English'
  },
  en: {
    privacidad: {
      titulo: 'Privacy Policy',
      secciones: [
        ['Who is responsible', `The data controller is ${RESPONSABLE}, owner of FinanziApp (${SITIO}). You can write to ${CONTACTO} about anything related to your data.`],
        ['What data we process', 'Account data: email address, the name you choose, avatar and, if you sign in with Google, the identifier and profile picture Google provides. Data you enter in the app: budgets, transactions, balances, loans, trades and any other financial information you record; it is yours and is only used to display it to you and compute your summaries. Usage data: sign-up date, last access, session length and technical errors, to keep the service running. Payment data: if you subscribe, Stripe handles the payment; we only keep the customer identifier, the subscription status and the paid-until date. We never see or store your card; the same applies to voluntary contributions. Newsletter: if you subscribe, we record that you did, the date, your language and where you subscribed (sign-up or Settings), and the date you unsubscribe if you do.'],
        ['Why and on what legal basis', 'To provide the service you sign up for (performance of a contract). To charge the subscription and issue invoices (contract and legal obligations). To keep the service secure, prevent abuse and fix errors (legitimate interest). To send you service emails such as email verification or password reset (contract). To send you the newsletter only if you subscribe (consent): saving ideas, FinanziApp news and, occasionally, a sponsored recommendation, always labelled as advertising; you can withdraw consent at any time from Settings or with the unsubscribe link in every email, without affecting your account. To process any voluntary contribution you choose to make (contract and legal obligations). We do not sell or share your data with third parties for marketing, and sponsors never receive your data.'],
        ['Where data is stored and who can access it', 'The app runs on Firebase and Google Cloud (Google LLC). Data is stored on Google servers in the United States under the EU-US Data Privacy Framework and the European Commission standard contractual clauses. Stripe Payments Europe processes payment data for billing. To send the newsletter we may use an email delivery provider (as a processor), which only receives your email address, name and language. Only the FinanziApp administrator can access your account data, and only to support you or maintain the service.'],
        ['Cookies and local storage', 'We use the browser local storage to keep you signed in and remember preferences such as language and theme. Firebase Analytics may collect aggregated usage statistics (pages viewed, device, country) through anonymous identifiers. We do not use advertising cookies.'],
        ['How long', 'We keep your data while your account exists. When the trial or subscription ends, data is kept in read-only mode so you can consult it or reactivate the account. You can request full deletion at any time; billing records are kept for as long as the law requires.'],
        ['Your rights', 'You can access, rectify, erase, port, restrict or object to the processing of your data by writing to ' + CONTACTO + '. If you believe we have not handled your request properly you can complain to the Spanish Data Protection Agency (www.aepd.es) or to your local supervisory authority.'],
        ['Security', 'All communications are encrypted (HTTPS). Passwords are held by Firebase Authentication with secure hashing and are never stored in our database. Database rules prevent one account from accessing another account’s data.'],
        ['Children', 'FinanziApp is intended for adults (18+). We do not knowingly create accounts for minors; if we detect one, we will delete it.'],
        ['Changes', 'If we change this policy we will publish the new version at this same address with the update date. Last updated: ' + FECHA.en + '.']
      ]
    },
    terminos: {
      titulo: 'Terms of Service',
      secciones: [
        ['The service', `FinanziApp is a personal-finance web application offered by ${RESPONSABLE} (${SITIO}). It lets you record budgets, transactions, net worth, loans and trades, and see summaries and charts built from what you enter.`],
        ['Your account', 'To use the app you need an account with a verified email and a password (also when you sign in with Google). You are responsible for keeping your credentials safe and for the information you record. An account is personal and cannot be shared.'],
        ['Free trial and subscription', 'When you sign up you get a free trial period. When it ends, the account switches to read-only mode (you can view your Dashboard) until you activate the subscription. The early-access price is USD 2.50 per month, taxes included where applicable, and it stays the same for as long as you keep the subscription. Payment renews monthly through Stripe and you can cancel at any time from Settings; cancellation takes effect at the end of the paid period. We may offer free guest accounts at our discretion.'],
        ['Voluntary contributions', 'If you wish, you can support the development of FinanziApp with a voluntary contribution through our official channel. It is a one-off payment of the amount you choose and it is not a purchase: it does not unlock extra features or replace the subscription. If you make one by mistake, write to us within 14 days and we will refund it.'],
        ['What FinanziApp is not', 'FinanziApp is an organisation tool. It does not provide financial, tax or investment advice, and its calculations (for example loan simulations or trade results) rely solely on the data you enter. Decisions you make with that information are your own.'],
        ['Acceptable use', 'You may not use the app for unlawful purposes, try to access other users’ data, interfere with the service or extract its code or content in an automated way. We may suspend accounts that break these rules.'],
        ['Availability and changes', 'We work to keep the service available at all times, but there may be interruptions due to maintenance or causes beyond our control. We may improve, change or withdraw features; if a change materially affects what you have paid for, we will notify you in advance.'],
        ['Liability', 'To the extent permitted by law, we are not liable for indirect losses arising from the use of the app or from decisions taken on the basis of the information it shows. Our total liability is limited to the amount paid for the subscription in the previous twelve months.'],
        ['Closing your account', 'You can stop using the app at any time and request full deletion of your account and data by writing to ' + CONTACTO + '.'],
        ['Governing law', 'These terms are governed by Spanish law. If you are a consumer you also keep the rights granted by the laws of your country of residence.'],
        ['Contact', 'For any question about these terms: ' + CONTACTO + '. Last updated: ' + FECHA.en + '.']
      ]
    },
    volver: '← Back to FinanziApp', idioma: 'Español'
  }
};

export default function PaginaLegal({ tipo }) {
  const { language, setLanguageTo } = useApp();
  const idioma = language === 'es' ? 'es' : 'en';
  const t = TEXTOS[idioma];
  const pagina = t[tipo] || t.privacidad;
  const otro = idioma === 'es' ? 'en' : 'es';
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f1117 0%, #1a1d27 50%, #0f1117 100%)', color: '#e5e7eb', fontFamily: "'Inter', sans-serif", padding: '32px 16px' }}>
      <div style={{ maxWidth: 820, margin: '0 auto', background: '#1e2130', border: '1px solid #2d3148', borderRadius: 16, padding: '36px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: '#fff', fontWeight: 800, fontSize: 18 }}>
            <img src="/logo120.png" alt="FinanziApp" width={32} height={32} style={{ borderRadius: 8 }} />
            Finanzi<span style={{ color: '#2dd4bf' }}>App</span>
          </a>
          <button type="button" onClick={() => setLanguageTo(otro)} style={{ background: '#252840', color: '#c7cbe6', border: '1px solid #2d3148', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 12 }}>{t.idioma}</button>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 900, margin: '0 0 6px' }}>{pagina.titulo}</h1>
        <div style={{ fontSize: 12, color: '#8b92b8', marginBottom: 24 }}>{RESPONSABLE} · {CONTACTO}</div>
        {pagina.secciones.map(([titulo, texto]) => (
          <section key={titulo} style={{ marginBottom: 22 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, margin: '0 0 8px', color: '#fff' }}>{titulo}</h2>
            <p style={{ fontSize: 14, lineHeight: 1.65, margin: 0, color: '#c7cbe6' }}>{texto}</p>
          </section>
        ))}
        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', marginTop: 28, fontSize: 13 }}>
          <a href="/" style={{ color: '#8b92b8' }}>{t.volver}</a>
          <a href={tipo === 'privacidad' ? '/terminos' : '/privacidad'} style={{ color: '#8b92b8' }}>{tipo === 'privacidad' ? t.terminos.titulo : t.privacidad.titulo}</a>
        </div>
      </div>
    </div>
  );
}
