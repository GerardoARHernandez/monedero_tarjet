// src/components/ThemeToggle.jsx
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { isDark, toggleTheme, autoMode, setAutoTheme } = useTheme();

  // Función para alternar entre modos
  const toggleAutoMode = () => {
    setAutoTheme(!autoMode);
  };

  return (
    <div className="relative flex items-center gap-2">
      {/* Indicador de modo automático */}
      <button
        onClick={toggleAutoMode}
        className={`p-1.5 rounded-lg transition-all duration-200 ${
          autoMode 
            ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400' 
            : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
        }`}
        title={autoMode ? "Modo automático (basado en hora)" : "Modo manual"}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      {/* Botón de tema */}
      <button
        onClick={toggleTheme}
        className={`p-1.5 rounded-lg transition-all duration-200 ${
          autoMode 
            ? 'opacity-50 hover:opacity-100' 
            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
        disabled={autoMode}
        title={autoMode ? "Modo automático activado - cambia a modo manual para ajustar manualmente" : "Cambiar tema"}
      >
        {isDark ? (
          <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>

      {/* Tooltip flotante para explicar el modo automático */}
      {autoMode && (
        <div className="absolute bottom-full left-0 mb-2 px-2 py-1 text-xs bg-gray-800 text-white rounded whitespace-nowrap">
          Auto: {new Date().getHours() < 8 || new Date().getHours() >= 18 ? '🌙 Modo oscuro' : '☀️ Modo claro'}
        </div>
      )}
    </div>
  );
};

export default ThemeToggle;