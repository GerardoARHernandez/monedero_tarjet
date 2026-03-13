// src/views/RegisterClient.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";

import { CiUser } from "react-icons/ci";
import { BsTelephone } from "react-icons/bs";
import { CiLock } from "react-icons/ci";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";

const RegisterClient = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    password: "",
    confirmPassword: "",
    fechaNacimiento: ""
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Función para formatear el número de teléfono
  const formatPhoneNumber = (value) => {
    const numbers = value.replace(/\D/g, "");
    
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
    }
  };

  // Función para formatear la fecha (YYYY-MM-DD a DD/MM/YYYY para mostrar)
  const formatDateForDisplay = (value) => {
    // Si está vacío, retornar vacío
    if (!value) return "";
    
    // Si ya tiene el formato YYYY-MM-DD (del input date), lo dejamos igual
    return value;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "telefono") {
      // Formatear teléfono
      setFormData(prev => ({
        ...prev,
        [name]: formatPhoneNumber(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    } else if (formData.nombre.trim().length < 3) {
      newErrors.nombre = "El nombre debe tener al menos 3 caracteres";
    }

    // Validar teléfono
    const cleanPhone = formData.telefono.replace(/\D/g, "");
    if (!formData.telefono) {
      newErrors.telefono = "El teléfono es obligatorio";
    } else if (cleanPhone.length !== 10) {
      newErrors.telefono = "El teléfono debe tener 10 dígitos";
    }

    // Validar contraseña
    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    // Validar confirmación de contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirma tu contraseña";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    // Validar fecha de nacimiento (opcional, pero si se ingresa, validar formato)
    if (formData.fechaNacimiento) {
      const fecha = new Date(formData.fechaNacimiento);
      if (isNaN(fecha.getTime())) {
        newErrors.fechaNacimiento = "Fecha inválida";
      } else {
        // Validar que no sea fecha futura
        const hoy = new Date();
        if (fecha > hoy) {
          newErrors.fechaNacimiento = "La fecha no puede ser futura";
        }
      }
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      // Aquí iría la lógica para registrar al usuario
      console.log("Datos del registro:", {
        nombre: formData.nombre,
        telefono: formData.telefono.replace(/\D/g, ""),
        password: formData.password,
        fechaNacimiento: formData.fechaNacimiento || null
      });
      
      // Simulación de registro exitoso
      alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
      navigate("/login");
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900 dark:to-indigo-950 flex items-center justify-center px-4 py-8 transition-colors duration-300">
      <div className="w-full max-w-md">
        {/* Card con imagen */}
        <div className="p-2 mb-6">
          <img src="/1.jpeg" alt="Logo Monedero" className="w-full h-auto rounded-t-2xl" />
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* Header con ThemeToggle */}
          <div className="flex flex-col items-center mb-6">
            <div className="self-end mb-2">
              <ThemeToggle />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Crear cuenta</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Regístrate en tu monedero digital
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nombre completo <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <CiUser />
                </span>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Juan Pérez"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                    errors.nombre 
                      ? 'border-red-500 dark:border-red-500' 
                      : 'border-gray-400 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition`}
                />
              </div>
              {errors.nombre && (
                <p className="mt-1 text-xs text-red-500">{errors.nombre}</p>
              )}
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Número de teléfono <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <BsTelephone />
                </span>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="55-1234-5678"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                    errors.telefono 
                      ? 'border-red-500 dark:border-red-500' 
                      : 'border-gray-400 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition`}
                />
              </div>
              {errors.telefono && (
                <p className="mt-1 text-xs text-red-500">{errors.telefono}</p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Formato: 55-1234-5678 (10 dígitos)
              </p>
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Contraseña <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <CiLock />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-2.5 rounded-lg border ${
                    errors.password 
                      ? 'border-red-500 dark:border-red-500' 
                      : 'border-gray-400 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Confirmar Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirmar contraseña <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <CiLock />
                </span>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-2.5 rounded-lg border ${
                    errors.confirmPassword 
                      ? 'border-red-500 dark:border-red-500' 
                      : 'border-gray-400 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  {showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Fecha de Nacimiento (Opcional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fecha de nacimiento <span className="text-gray-400 text-xs">(opcional)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <LiaBirthdayCakeSolid />
                </span>
                <input
                  type="date"
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                  max={new Date().toISOString().split('T')[0]}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                    errors.fechaNacimiento 
                      ? 'border-red-500 dark:border-red-500' 
                      : 'border-gray-400 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition`}
                />
              </div>
              {errors.fechaNacimiento && (
                <p className="mt-1 text-xs text-red-500">{errors.fechaNacimiento}</p>
              )}
            </div>

            {/* Términos y condiciones */}
            {/* <div className="flex items-start gap-2 text-sm">
              <input 
                type="checkbox" 
                id="terminos" 
                required
                className="mt-1 rounded dark:bg-gray-700"
              />
              <label htmlFor="terminos" className="text-gray-600 dark:text-gray-400">
                Acepto los <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline">Términos y Condiciones</a> y la <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline">Política de Privacidad</a>
              </label>
            </div> */}

            {/* Botón de registro */}
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm shadow mt-4"
            >
              Crear cuenta
            </button>
          </form>

          {/* Separador */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                ¿Ya tienes cuenta?
              </span>
            </div>
          </div>

          {/* Link a login */}
          <Link
            to="/login"
            className="block w-full text-center py-2.5 px-4 border-2 border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 font-semibold rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors text-sm"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterClient;