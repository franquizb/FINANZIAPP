import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build',
  },
  server: {
    // --- Configuración Principal del Servidor ---
    // '0.0.0.0' es la forma explícita de decirle a Vite que escuche
    // en todas las interfaces de red, no solo en 'localhost'.
    // Esto es NECESARIO para que sea accesible desde fuera de tu ordenador.
    host: '0.0.0.0', 
    port: 5173,

    // --- Configuración de Recarga en Caliente (HMR) para DDNS ---
    // Este bloque es CRUCIAL. Le dice al navegador del cliente (que está
    // en internet) a qué dirección debe conectarse para recibir las
    // actualizaciones en tiempo real (WebSocket).
    hmr: {
      // ¡IMPORTANTE! Este DEBE ser tu nombre de dominio público.
      // No uses una IP local como '192.168.1.30' aquí.
      host: 'financiapp.servehttp.com', 
      
      // Debe ser el mismo puerto que el servidor principal.
      // Asegúrate de que este puerto (5173) esté redirigido en tu router
      // a la IP local de tu ordenador de desarrollo (192.168.1.30).
      port: 5173,
      
      // El protocolo para la conexión. 'ws' es para HTTP.
      // Si en el futuro usas un proxy inverso con un certificado SSL (HTTPS),
      // deberías cambiar esto a 'wss'.
      protocol: 'ws',
    },

    // --- Proxy para tus Cloud Functions ---
    // Esta sección está correcta y no necesita cambios.
    proxy: {
      '/api/v1': {
        target: 'https://us-central1-personal-franquizb.cloudfunctions.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/v1/, ''),
        secure: true,
      },
    },

    // --- CAMBIO CLAVE: Permitir explícitamente el host DDNS ---
    // Esto soluciona el error "403 Forbidden" al añadir tu dominio
    // a la lista de hosts permitidos de Vite por seguridad.
    allowedHosts: ['financiapp.servehttp.com'],
  },
});
