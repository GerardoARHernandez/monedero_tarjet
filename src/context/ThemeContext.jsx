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
  const [isDark, setIsDark] = useState(true);
  const [autoMode, setAutoMode] = useState(true); // true = automático, false = manual
  const [currentHour, setCurrentHour] = useState(new Date().getHours());

  // Función para determinar si debe ser dark según la hora
  const shouldBeDark = (hour) => {
    // Dark mode de 6pm (18:00) a 8am (08:00)
    // Light mode de 8am a 6pm
    return hour < 8 || hour >= 18;
  };

  // Actualizar la hora cada minuto para cambios automáticos
  useEffect(() => {
    const updateHour = () => {
      const newHour = new Date().getHours();
      setCurrentHour(newHour);
      
      if (autoMode) {
        const newIsDark = shouldBeDark(newHour);
        setIsDark(newIsDark);
      }
    };
    
    // Actualizar inmediatamente
    updateHour();
    
    // Actualizar cada minuto para detectar cambios de hora
    const interval = setInterval(updateHour, 60000);
    
    return () => clearInterval(interval);
  }, [autoMode]);

  // Cargar preferencias guardadas al inicio
  useEffect(() => {
    const savedAutoMode = localStorage.getItem('themeAutoMode');
    const savedTheme = localStorage.getItem('theme');
    const savedHour = localStorage.getItem('themeHour');
    
    // Verificar si hay una preferencia guardada para el modo automático
    if (savedAutoMode !== null) {
      setAutoMode(savedAutoMode === 'true');
    }
    
    // Si estamos en modo manual y hay un tema guardado
    if (savedAutoMode === 'false' && savedTheme) {
      setIsDark(savedTheme === 'dark');
    } 
    // Si estamos en modo automático o no hay preferencias guardadas
    else {
      const hour = savedHour ? parseInt(savedHour) : new Date().getHours();
      setCurrentHour(hour);
      setIsDark(shouldBeDark(hour));
    }
  }, []);

  // Guardar preferencias cuando cambian
  useEffect(() => {
    localStorage.setItem('themeAutoMode', autoMode);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    localStorage.setItem('themeHour', currentHour.toString());
    
    // Aplicar clase al html
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark, autoMode, currentHour]);

  // Función para cambiar el tema manualmente
  const toggleTheme = () => {
    if (autoMode) {
      // Si estaba en automático, al cambiar manualmente se desactiva el modo automático
      setAutoMode(false);
    }
    setIsDark(prev => !prev);
  };

  // Función para activar/desactivar el modo automático
  const setAutoTheme = (enabled) => {
    setAutoMode(enabled);
    if (enabled) {
      // Al activar automático, aplicar el tema según la hora actual
      setIsDark(shouldBeDark(currentHour));
    }
  };

  // Función para obtener el estado actual del modo
  const getThemeMode = () => {
    return autoMode ? 'auto' : 'manual';
  };

  return (
    <ThemeContext.Provider value={{ 
      isDark, 
      toggleTheme, 
      autoMode, 
      setAutoTheme,
      getThemeMode,
      currentHour
    }}>
      {children}
    </ThemeContext.Provider>
  );
};