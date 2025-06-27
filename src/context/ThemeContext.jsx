// src/context/ThemeContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

// Crea el Contexto
const ThemeContext = createContext();

// Custom Hook para usar el tema fácilmente en cualquier componente
export function useTheme() {
  return useContext(ThemeContext);
}

// Componente Proveedor del Tema
export function ThemeProvider({ children }) {
  // Estado inicial del tema, intentando leerlo del localStorage o por defecto 'dark'
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem('theme');
    return storedTheme ? storedTheme : 'dark'; // Por defecto, el tema es 'dark'
  });

  // Efecto para actualizar la clase del body/html cuando cambia el tema
  useEffect(() => {
    const root = window.document.documentElement; // Elemento <html>
    const isDark = theme === 'dark';

    // Elimina la clase opuesta para evitar conflictos y añade la clase correcta
    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }

    localStorage.setItem('theme', theme); // Guarda la preferencia en localStorage
  }, [theme]); // Se ejecuta cuando el tema cambia

  // Función para cambiar el tema
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  // Función para establecer un tema específico
  const setThemeMode = (mode) => {
    setTheme(mode);
  };

  const value = {
    theme,
    toggleTheme,
    setThemeMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}