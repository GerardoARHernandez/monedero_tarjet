// src/views/admin/RegisterFromAdmin.jsx
import { useState, useEffect } from "react";
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
    apellido: "",
    telefono: "",
    email: "",
    password: "",
    confirmPassword: "",
    fechaNacimiento: "",
    esTitular: "1", // "1" para Sí, "0" para No
    idTitular: "" // ID del titular cuando es cuenta no titular
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [titulares, setTitulares] = useState([]); // Lista de titulares disponibles
  const [loadingTitulares, setLoadingTitulares] = useState(false);

  // Función para cargar la lista de titulares (ajusta según tu API)
  useEffect(() => {
    if (formData.esTitular === "0") {
      cargarTitulares();
    }
  }, [formData.esTitular]);

  const cargarTitulares = async () => {
    setLoadingTitulares(true);
    try {
      // Aquí debes ajustar el endpoint según tu API para obtener la lista de titulares
      // Ejemplo: GET /api/users/titulares
      const response = await fetch("https://souvenir-site.com/TarjetCashBack/api/users/titulares", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTitulares(data);
      }
    } catch (error) {
      console.error("Error al cargar titulares:", error);
    } finally {
      setLoadingTitulares(false);
    }
  };

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
    
    // Limpiar mensaje de éxito cuando el usuario modifica algo
    if (success) {
      setSuccess(null);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    }

    // Validar apellido
    if (!formData.apellido.trim()) {
      newErrors.apellido = "El apellido es obligatorio";
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

    // Validar fecha de nacimiento (opcional pero si se ingresa, debe ser válida)
    if (formData.fechaNacimiento) {
      const fecha = new Date(formData.fechaNacimiento);
      if (isNaN(fecha.getTime())) {
        newErrors.fechaNacimiento = "Fecha inválida";
      } else if (fecha > new Date()) {
        newErrors.fechaNacimiento = "La fecha no puede ser futura";
      }
    }

    // Validar ID del titular cuando NO es titular
    if (formData.esTitular === "0") {
      if (!formData.idTitular) {
        newErrors.idTitular = "Debe seleccionar un titular";
      } else if (isNaN(parseInt(formData.idTitular))) {
        newErrors.idTitular = "El ID del titular debe ser un número válido";
      } else if (parseInt(formData.idTitular) <= 0) {
        newErrors.idTitular = "El ID del titular debe ser mayor a 0";
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      setSuccess(null);
      
      // Limpiar el teléfono para enviarlo sin formato
      const cleanPhone = formData.telefono.replace(/\D/g, "");
      
      // Determinar el idTitular según el caso
      let idTitular;
      if (formData.esTitular === "1") {
        idTitular = 0; // Si es titular, mandar 0
      } else {
        idTitular = parseInt(formData.idTitular); // Si no es titular, usar el ID seleccionado
      }
      
      // Preparar los datos para la API
      const apiData = {
        negocioId: 1, // Asumiendo que el negocioId es 1, ajusta según sea necesario
        titular: parseInt(formData.esTitular), // 1 o 0
        idTitular: idTitular,
        usuarioNombre: formData.nombre.trim(),
        usuarioApellido: formData.apellido.trim(),
        usuarioTelefono: cleanPhone,
        usuarioPass: formData.password,
        usuarioCorreo: formData.email.trim() || null, // Si está vacío, enviar null
        usuarioFechaNacimiento: formData.fechaNacimiento || null // Si está vacío, enviar null
      };
      
      try {
        const response = await fetch("https://souvenir-site.com/TarjetCashBack/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Agrega aquí cualquier token de autenticación si es necesario
            // "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(apiData)
        });

        const data = await response.json();

        if (data.success) {
          setSuccess({
            message: data.message,
            usuarioId: data.data.usuarioId,
            usuarioNombre: data.data.usuarioNombre,
            usuarioApellido: data.data.usuarioApellido,
            usuarioTelefono: data.data.usuarioTelefono,
            usuarioCorreo: data.data.usuarioCorreo,
            esTitular: data.data.titular === 1 ? "Sí" : "No",
            idTitularUsado: idTitular,
            usuarioMiembroDesde: new Date(data.data.usuarioMiembroDesde).toLocaleString('es-MX')
          });
          
          // Limpiar el formulario después del éxito
          setFormData({
            nombre: "",
            apellido: "",
            telefono: "",
            email: "",
            password: "",
            confirmPassword: "",
            fechaNacimiento: "",
            esTitular: "1",
            idTitular: ""
          });
          
          // Limpiar el mensaje de éxito después de 5 segundos
          setTimeout(() => {
            setSuccess(null);
          }, 5000);
        } else {
          throw new Error(data.message || "Error al registrar el usuario");
        }
      } catch (error) {
        console.error("Error al registrar:", error);
        setErrors({
          submit: error.message || "Error al conectar con el servidor"
        });
      } finally {
        setLoading(false);
      }
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
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Juan"
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

              {/* Apellido */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Apellido <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  placeholder="Ej: Pérez"
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.apellido 
                      ? 'border-red-500 dark:border-red-500' 
                      : 'border-gray-400 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition`}
                />
                {errors.apellido && (
                  <p className="mt-1 text-xs text-red-500">{errors.apellido}</p>
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
            </div>

            {/* Fecha de nacimiento (opcional) */}
            <div className="bg-white dark:bg-gray-700 p-4 rounded-xl border border-gray-300 dark:border-gray-600">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fecha de nacimiento <span className="text-gray-400 text-xs">(opcional)</span>
              </label>
              <input
                type="date"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
                className={`w-full px-4 py-2.5 rounded-lg border ${
                  errors.fechaNacimiento 
                    ? 'border-red-500 dark:border-red-500' 
                    : 'border-gray-400 dark:border-gray-600'
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition`}
              />
              {errors.fechaNacimiento && (
                <p className="mt-1 text-xs text-red-500">{errors.fechaNacimiento}</p>
              )}
            </div>

            {/* Pregunta de cuenta titular */}
            <div className="bg-white dark:bg-gray-700 p-4 rounded-xl border border-gray-300 dark:border-gray-600">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                ¿Será cuenta titular? <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="esTitular"
                    value="1"
                    checked={formData.esTitular === "1"}
                    onChange={handleChange}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Sí</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="esTitular"
                    value="0"
                    checked={formData.esTitular === "0"}
                    onChange={handleChange}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">No</span>
                </label>
              </div>
            </div>

            {/* Campo para seleccionar ID del titular (solo cuando NO es titular) */}
            {formData.esTitular === "0" && (
              <div className="bg-white dark:bg-gray-700 p-4 rounded-xl border border-gray-300 dark:border-gray-600">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  ID del Titular <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="idTitular"
                  value={formData.idTitular}
                  onChange={handleChange}
                  placeholder="Ej: 1, 2, 3..."
                  min="1"
                  step="1"
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.idTitular 
                      ? 'border-red-500 dark:border-red-500' 
                      : 'border-gray-400 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition`}
                />
                {errors.idTitular && (
                  <p className="mt-1 text-xs text-red-500">{errors.idTitular}</p>
                )}
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Ingrese el ID del titular al que pertenecerá esta cuenta
                </p>
              </div>
            )}

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

            {/* Mensaje de éxito */}
            {success && (
              <div className="bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-700 rounded-lg p-4 animate-fade-in">
                <div className="flex items-start gap-2">
                  <div className="text-green-800 dark:text-green-300 font-semibold">
                    ✓ {success.message}
                  </div>
                </div>
                <div className="mt-3 text-sm text-green-700 dark:text-green-400 space-y-1">
                  <p><span className="font-medium">ID Usuario:</span> {success.usuarioId}</p>
                  <p><span className="font-medium">Nombre completo:</span> {success.usuarioNombre} {success.usuarioApellido}</p>
                  <p><span className="font-medium">Teléfono:</span> {success.usuarioTelefono}</p>
                  {success.usuarioCorreo && <p><span className="font-medium">Email:</span> {success.usuarioCorreo}</p>}
                  <p><span className="font-medium">Cuenta titular:</span> {success.esTitular}</p>
                  <p><span className="font-medium">ID Titular asociado:</span> {success.idTitularUsado === 0 ? "N/A (es titular)" : success.idTitularUsado}</p>
                  <p><span className="font-medium">Miembro desde:</span> {success.usuarioMiembroDesde}</p>
                </div>
              </div>
            )}

            {/* Error general */}
            {errors.submit && (
              <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 rounded-lg p-4">
                <p className="text-red-800 dark:text-red-300 text-sm">
                  ❌ {errors.submit}
                </p>
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex gap-3 pt-4 border-t border-gray-300 dark:border-gray-700">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold py-3 px-4 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registrando...
                  </span>
                ) : (
                  "Registrar Usuario"
                )}
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