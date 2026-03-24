// src/components/AdminHeader.jsx 
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const AdminHeader = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="bg-gray-900 dark:bg-gray-950 text-white shadow-lg border-b border-gray-700 dark:border-gray-800 transition-colors duration-300 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-400 rounded-md flex items-center justify-center">
              <span className="text-gray-900 font-bold text-sm">M</span>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight">Monedero</span>
              <span className="ml-2 text-xs bg-amber-400 text-gray-900 font-semibold px-2 py-0.5 rounded-full">
                ADMIN
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
            <Link to="/admin" className="hover:text-white transition-colors">Dashboard</Link>
            <Link to="/admin/abonar" className="hover:text-white transition-colors">Abonar</Link>
            <Link to="/admin/canjear" className="hover:text-white transition-colors">Canjear</Link>
            <Link to="/admin/registrar" className="hover:text-white transition-colors">Registrar</Link>
          </nav>

          {/* Admin user y ThemeToggle - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <div className="text-right">
              <p className="text-sm font-semibold">Admin</p>
              <p className="text-xs text-gray-400">Superusuario</p>
            </div>
            <div className="w-9 h-9 rounded-md bg-amber-400 flex items-center justify-center text-sm font-bold text-gray-900">
              A
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-400 hover:text-white transition-colors ml-1"
            >
              Salir
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-3">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg hover:bg-gray-800 transition-colors focus:outline-none"
              aria-label="Abrir menú"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span className={`w-full h-0.5 bg-white rounded-full transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`w-full h-0.5 bg-white rounded-full transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`w-full h-0.5 bg-white rounded-full transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      <div 
        className={`md:hidden fixed top-[73px] left-0 right-0 bg-gray-900 dark:bg-gray-950 border-b border-gray-700 dark:border-gray-800 shadow-lg transition-all duration-300 z-30 ${
          isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
          {/* User Info - Mobile */}
          <div className="flex items-center gap-3 pb-3 border-b border-gray-700 mb-2">
            <div className="w-10 h-10 rounded-md bg-amber-400 flex items-center justify-center text-sm font-bold text-gray-900">
              A
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Admin</p>
              <p className="text-xs text-gray-400">Superusuario</p>
            </div>
          </div>

          {/* Navigation Links - Mobile */}
          <Link
            to="/admin"
            onClick={closeMenu}
            className="block py-3 px-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            Dashboard
          </Link>
          <Link
            to="/admin/abonar"
            onClick={closeMenu}
            className="block py-3 px-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            Abonar
          </Link>
          <Link
            to="/admin/canjear"
            onClick={closeMenu}
            className="block py-3 px-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            Canjear
          </Link>
          <Link
            to="/admin/registrar"
            onClick={closeMenu}
            className="block py-3 px-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            Registrar
          </Link>

          {/* Logout Button - Mobile */}
          <button
            onClick={() => {
              closeMenu();
              handleLogout();
            }}
            className="w-full text-left py-3 px-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors mt-2 border-t border-gray-700 pt-3"
          >
            Salir
          </button>
        </div>
      </div>

      {/* Overlay para cerrar el menú al hacer click fuera */}
      {isMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={closeMenu}
        ></div>
      )}
    </>
  );
};

export default AdminHeader;