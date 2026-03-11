// src/components/ClientHeader.jsx 
import { useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle"; // Importamos el botón

const ClientHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-indigo-700 dark:bg-indigo-900 text-white shadow-md transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <span className="text-indigo-700 dark:text-indigo-900 font-bold text-sm">M</span>
          </div>
          <span className="text-xl font-bold tracking-tight">Monedero</span>
        </div>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <a href="#" className="hover:text-indigo-200 transition-colors">Inicio</a>
          <a href="#" className="hover:text-indigo-200 transition-colors">Historial</a>
        </nav>

        {/* User y ThemeToggle */}
        <div className="flex items-center gap-3">
          <ThemeToggle /> {/* Botón de tema aquí */}
          <div className="w-9 h-9 rounded-full bg-indigo-500 dark:bg-indigo-700 flex items-center justify-center text-sm font-semibold border-2 border-indigo-300">
            GA
          </div>
          <button
            onClick={() => navigate("/login")}
            className="text-sm text-indigo-200 hover:text-white transition-colors"
          >
            Salir
          </button>
        </div>
      </div>
    </header>
  );
};

export default ClientHeader;