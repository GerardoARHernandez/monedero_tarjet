// src/context/ThemeContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    // Verificar si hay una preferencia guardada
    const saved = localStorage.getItem('theme');
    // Verificar preferencia del sistema si no hay guardada
    if (!saved) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return saved === 'dark';
  });

  useEffect(() => {
    // Guardar preferencia
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Aplicar clase al html
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};