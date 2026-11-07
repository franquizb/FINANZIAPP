import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// App instalable (PWA): service worker solo en producción (no en el modo demo).
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production' && process.env.REACT_APP_DEMO !== '1') {
  window.addEventListener('load', () => { navigator.serviceWorker.register('/sw.js').catch(() => {}); });
}
// Chrome/Android avisan de que la app se puede instalar con este evento; se
// guarda para el botón «Instalar» de Configuración (que lo usa cuando quiera).
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  window.__avisoInstalar = e;
  window.dispatchEvent(new Event('finanziapp-instalable'));
});
window.addEventListener('appinstalled', () => { window.__avisoInstalar = null; window.dispatchEvent(new Event('finanziapp-instalable')); });

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
