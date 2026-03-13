// src/views/admin/RegisterFromAdmin.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import AdminHeader from "../../components/AdminHeader";
import AdminFooter from "../../components/AdminFooter";

import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";

const RegisterFromAdmin = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: "",
    password: "",
    confirmPassword: "",
    fechaNacimiento: "",
    saldoInicial: "0"
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "telefono") {
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

    // Limpiar error del campo
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
    }

    // Validar teléfono
    const cleanPhone = formData.telefono.replace(/\D/g, "");
    if (!formData.telefono) {
      newErrors.telefono = "El teléfono es obligatorio";
    } else if (cleanPhone.length !== 10) {
      newErrors.telefono = "El teléfono debe tener 10 dígitos";
    }

    // Validar email (opcional pero si se ingresa, validar formato)
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Correo electrónico inválido";
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

    // Validar saldo inicial
    if (formData.saldoInicial && isNaN(parseFloat(formData.saldoInicial))) {
      newErrors.saldoInicial = "El saldo debe ser un número";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      // Aquí iría la lógica para registrar al usuario desde el admin
      console.log("Registro desde admin:", {
        ...formData,
        telefono: formData.telefono.replace(/\D/g, ""),
        password: "[PROTEGIDA]"
      });
      
      alert("Usuario registrado exitosamente");
      navigate("/admin");
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-blue-100 dark:bg-gray-950 transition-colors duration-300">
      <AdminHeader />

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8">
        <div className="bg-blue-50 dark:bg-gray-800 rounded-2xl border border-gray-300 dark:border-gray-700 overflow-hidden">
          {/* Header del formulario */}
          <div className="px-6 py-4 border-b border-gray-500 dark:border-gray-700 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Registrar Nuevo Usuario
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Complete los datos para crear una nueva cuenta
              </p>
            </div>
            <Link
              to="/admin"
              className="text-xs bg-gray-500 hover:bg-gray-600 text-white font-semibold px-3 py-1.5 rounded-lg transition"
            >
              ← Volver
            </Link>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Grid de 2 columnas para datos personales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nombre completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Juan Pérez"
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.nombre 
                      ? 'border-red-500 dark:border-red-500' 
                      : 'border-gray-400 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition`}
                />
                {errors.nombre && (
                  <p className="mt-1 text-xs text-red-500">{errors.nombre}</p>
                )}
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Teléfono <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="55-1234-5678"
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.telefono 
                      ? 'border-red-500 dark:border-red-500' 
                      : 'border-gray-400 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition`}
                />
                {errors.telefono && (
                  <p className="mt-1 text-xs text-red-500">{errors.telefono}</p>
                )}
              </div>

              {/* Email (opcional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Correo electrónico <span className="text-gray-400 text-xs">(opcional)</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="correo@ejemplo.com"
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.email 
                      ? 'border-red-500 dark:border-red-500' 
                      : 'border-gray-400 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition`}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Fecha de nacimiento (opcional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Fecha de nacimiento <span className="text-gray-400 text-xs">(opcional)</span>
                </label>
                <input
                  type="date"
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Saldo inicial */}
            <div className="bg-white dark:bg-gray-700 p-4 rounded-xl border border-gray-300 dark:border-gray-600">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Saldo inicial
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  name="saldoInicial"
                  value={formData.saldoInicial}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className={`w-full pl-8 pr-4 py-2.5 rounded-lg border ${
                    errors.saldoInicial 
                      ? 'border-red-500 dark:border-red-500' 
                      : 'border-gray-400 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition`}
                />
              </div>
              {errors.saldoInicial && (
                <p className="mt-1 text-xs text-red-500">{errors.saldoInicial}</p>
              )}
            </div>

            {/* Contraseñas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Contraseña */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contraseña <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full px-4 py-2.5 rounded-lg border ${
                      errors.password 
                        ? 'border-red-500 dark:border-red-500' 
                        : 'border-gray-400 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400"
                  >
                    {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
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
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full px-4 py-2.5 rounded-lg border ${
                      errors.confirmPassword 
                        ? 'border-red-500 dark:border-red-500' 
                        : 'border-gray-400 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400"
                  >
                    {showConfirmPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-3 pt-4 border-t border-gray-300 dark:border-gray-700">
              <button
                type="submit"
                className="flex-1 bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold py-3 px-4 rounded-lg transition-colors text-sm"
              >
                Registrar Usuario
              </button>
              <Link
                to="/admin"
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors text-sm text-center"
              >
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </main>

      <AdminFooter />
    </div>
  );
};

export default RegisterFromAdmin;