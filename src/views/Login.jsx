// src/views/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";

const Login = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  // Número de teléfono específico para admin
  const ADMIN_PHONE = "5512345678"; // Cambia esto por el número que quieras

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Limpiar el número de teléfono (quitar espacios, guiones, etc.)
    const cleanPhone = phone.replace(/\D/g, "");
    
    if (cleanPhone === ADMIN_PHONE) {
      navigate("/admin");
    } else {
      navigate("/client");
    }
  };

  // Función para formatear el número de teléfono mientras se escribe
  const formatPhoneNumber = (value) => {
    // Eliminar todo lo que no sea número
    const numbers = value.replace(/\D/g, "");
    
    // Aplicar formato dependiendo de la longitud
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
    }
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900 dark:to-indigo-950 flex items-center justify-center px-4 transition-colors duration-300">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="p-2 mb-6">
          <img src="/1.jpeg" alt="Logo Monedero" className="w-full h-auto rounded-t-2xl" />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="self-end mb-2">
              <ThemeToggle />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Monedero</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Inicia sesión en tu monedero</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Número de teléfono
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="55-1234-5678"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600 dark:text-gray-400 cursor-pointer">
                <input type="checkbox" className="rounded dark:bg-gray-700" />
                Recordarme
              </label>
              <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm shadow"
            >
              Iniciar Sesión
            </button>
          </form>

          {/* Hint */}
          <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-6">
            Tip: usa <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">55-1234-5678</span> para entrar como administrador
          </p>

          {/* Opción de registro */}
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
            ¿No tienes cuenta?{" "}
            <Link to="/registro" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;