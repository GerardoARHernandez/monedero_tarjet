// src/components/ClientHeader.jsx 
import { useNavigate, Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const ClientHeader = ({ esTitular = true }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="bg-indigo-700 dark:bg-indigo-900 text-white shadow-md transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/client" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <span className="text-indigo-700 dark:text-indigo-900 font-bold text-sm">M</span>
          </div>
          <span className="text-xl font-bold tracking-tight">Monedero</span>
        </Link>

        {/* Nav - Ocultar historial si no es titular */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/client" className="hover:text-indigo-200 transition-colors">Inicio</Link>
          {esTitular && (
            <Link to="/client/historial" className="hover:text-indigo-200 transition-colors">Historial</Link>
          )}
        </nav>

        {/* User y ThemeToggle */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="w-9 h-9 rounded-full bg-indigo-500 dark:bg-indigo-700 flex items-center justify-center text-sm font-semibold border-2 border-indigo-300">
            GA
          </div>
          <button
            onClick={handleLogout}
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