// src/views/admin/Abonar.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import AdminHeader from "../../components/AdminHeader";
import AdminFooter from "../../components/AdminFooter";

const Abonar = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    usuarioId: "",
    importe: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

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

    // Validar usuarioId
    if (!formData.usuarioId) {
      newErrors.usuarioId = "El ID del usuario es obligatorio";
    } else if (!/^\d+$/.test(formData.usuarioId)) {
      newErrors.usuarioId = "El ID debe ser un número válido";
    } else if (parseInt(formData.usuarioId) <= 0) {
      newErrors.usuarioId = "El ID debe ser mayor a 0";
    }

    // Validar importe
    if (!formData.importe) {
      newErrors.importe = "El importe es obligatorio";
    } else if (parseFloat(formData.importe) <= 0) {
      newErrors.importe = "El importe debe ser mayor a 0";
    } else if (isNaN(parseFloat(formData.importe))) {
      newErrors.importe = "El importe debe ser un número válido";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      setSuccess(null);
      
      try {
        const response = await fetch("https://souvenir-site.com/TarjetCashBack/api/account/wallet/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Agrega aquí cualquier token de autenticación si es necesario
            // "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            usuarioId: parseInt(formData.usuarioId),
            importe: parseFloat(formData.importe)
          })
        });

        const data = await response.json();

        if (data.success) {
          setSuccess({
            message: data.message,
            transaccionId: data.data.transaccionId,
            saldoDetId: data.data.saldoDetId,
            folio: data.data.folio,
            importe: data.data.importe,
            nuevoSaldo: data.data.montoDisponibleActualizado,
            fecha: new Date(data.data.fecha).toLocaleString('es-MX')
          });
          
          // Limpiar el importe después del éxito, pero mantener el ID por si quieren hacer otro abono al mismo usuario
          setFormData(prev => ({
            ...prev,
            importe: ""
          }));
          
          // Limpiar el mensaje de éxito después de 5 segundos
          setTimeout(() => {
            setSuccess(null);
          }, 5000);
        } else {
          throw new Error(data.message || "Error al procesar el abono");
        }
      } catch (error) {
        console.error("Error al abonar:", error);
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
                Abonar a Cuenta
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Agregue saldo a la cuenta de un cliente existente
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
            {/* ID del Usuario */}
            <div className="bg-white dark:bg-gray-700 p-4 rounded-xl border border-gray-300 dark:border-gray-600">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                ID del Usuario <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="usuarioId"
                value={formData.usuarioId}
                onChange={handleChange}
                placeholder="Ej: 1, 2, 3..."
                min="1"
                step="1"
                className={`w-full px-4 py-2.5 rounded-lg border ${
                  errors.usuarioId 
                    ? 'border-red-500 dark:border-red-500' 
                    : 'border-gray-400 dark:border-gray-600'
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition`}
              />
              {errors.usuarioId && (
                <p className="mt-1 text-xs text-red-500">{errors.usuarioId}</p>
              )}
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Ingrese el ID numérico del usuario al que desea abonar saldo
              </p>
            </div>

            {/* Importe a abonar */}
            <div className="bg-white dark:bg-gray-700 p-4 rounded-xl border border-gray-300 dark:border-gray-600">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Importe a abonar <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  name="importe"
                  value={formData.importe}
                  onChange={handleChange}
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  className={`w-full pl-8 pr-4 py-2.5 rounded-lg border ${
                    errors.importe 
                      ? 'border-red-500 dark:border-red-500' 
                      : 'border-gray-400 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition`}
                />
              </div>
              {errors.importe && (
                <p className="mt-1 text-xs text-red-500">{errors.importe}</p>
              )}
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
                  <p><span className="font-medium">Folio:</span> <span className="font-mono">{success.folio}</span></p>
                  <p><span className="font-medium">Importe abonado:</span> ${success.importe.toFixed(2)} MXN</p>
                  <p><span className="font-medium">Nuevo saldo disponible:</span> ${success.nuevoSaldo.toFixed(2)} MXN</p>
                  <p><span className="font-medium">Fecha:</span> {success.fecha}</p>
                  <p><span className="font-medium">ID Transacción:</span> {success.transaccionId}</p>
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
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                  </span>
                ) : (
                  "Abonar Saldo"
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

export default Abonar;