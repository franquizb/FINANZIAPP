/** @type {import('tailwindcss').Config} */
export default {
  // Importante: Configura Tailwind para usar el modo oscuro basado en una clase.
  // Esto permite que el ThemeContext controle el tema dinámicamente.
  darkMode: 'class',
  content: [
    "./index.html",
    // Asegúrate de que esta ruta escanee todos tus archivos JS, JSX, TS, TSX
    "./src/**/*.{js,ts,jsx,tsx}", // <-- MUY IMPORTANTE: ¡Esto debe incluir todos tus componentes!
  ],
  theme: {
    extend: {
      keyframes: {
        // --- Añade esta definición para la animación 'spin' ---
        spin: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        // --- Tus animaciones existentes ---
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-down': {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'bounce-in': {
            '0%': { opacity: '0', transform: 'scale(0.3)' },
            '50%': { opacity: '1', transform: 'scale(1.05)' },
            '70%': { transform: 'scale(0.9)' },
            '100%': { transform: 'scale(1)' },
        },
        'blob': {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        }
      },
      animation: {
        // --- Asocia 'animate-spin' con la animación 'spin' que acabas de definir ---
        spin: 'spin 1s linear infinite',
        // --- Tus animaciones existentes ---
        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
        'fade-in-down': 'fade-in-down 0.8s ease-out forwards',
        'bounce-in': 'bounce-in 1s ease-out forwards',
        'blob': 'blob 7s infinite',
      },
    },
  },
  plugins: [],
}