// src/views/ClientHome.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ClientHeader from "../components/ClientHeader";
import ClientFooter from "../components/ClientFooter";
import QRModal from "../components/QRModal"; 
import { useTheme } from "../context/ThemeContext"; 

const ClientHome = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");

  // Obtener el usuario del localStorage al cargar
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/");
      return;
    }
    
    const user = JSON.parse(storedUser);
    setUserData(user);
    fetchUserBalance(user.usuarioId);
  }, [navigate]);

  const fetchUserBalance = async (usuarioId) => {
    setLoading(true);
    try {
      const response = await fetch(`https://souvenir-site.com/TarjetCashBack/api/account/${usuarioId}/balance`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });

      const data = await response.json();

      if (data.success) {
        setUserData(prev => ({
          ...prev,
          ...data.data.usuario,
          montoDisponible: data.data.usuario.montoDisponible,
          montoUtilizado: data.data.usuario.montoUtilizado
        }));
        
        // Ordenar transacciones por fecha (más reciente primero)
        const sortedTransactions = (data.data.transacciones || []).sort((a, b) => 
          new Date(b.transaccionFecha) - new Date(a.transaccionFecha)
        );
        setTransactions(sortedTransactions);
      } else {
        setError(data.message || "Error al obtener los datos");
      }
    } catch (error) {
      console.error("Error al obtener balance:", error);
      setError("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener la descripción de la transacción
  const getTransactionDescription = (tx) => {
    if (tx.transaccionTipo === "A") {
      return "Recarga de saldo";
    } else if (tx.transaccionTipo === "C") {
      return "Canje de saldo";
    }
    return "Movimiento";
  };

  // Función para obtener el número de referencia
  const getReferenceNumber = (tx) => {
    if (tx.transaccionTipo === "A") {
      return tx.transaccionNoReferen;
    } else if (tx.transaccionTipo === "C") {
      return tx.transaccionNoReferen;
    }
    return "";
  };

  // Función para formatear el teléfono para mostrar
  const formatPhoneForDisplay = (phone) => {
    if (!phone) return "";
    const clean = phone.toString().replace(/\s/g, "");
    return phone;
  };

  // Función para formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Función para formatear hora
  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calcular estadísticas de transacciones (solo si es titular)
  const calculateStats = () => {
    if (userData?.titular !== 1) {
      return {
        ingresosMes: 0,
        gastosMes: 0,
        totalMovimientos: 0,
        totalRecargas: 0,
        totalCanjes: 0
      };
    }
    
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    let ingresosMes = 0;
    let gastosMes = 0;
    
    transactions.forEach(tx => {
      const txDate = new Date(tx.transaccionFecha);
      if (txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear) {
        if (tx.transaccionTipo === "A") {
          ingresosMes += tx.transaccionImporte;
        } else if (tx.transaccionTipo === "C") {
          gastosMes += tx.transaccionImporte;
        }
      }
    });
    
    return {
      ingresosMes,
      gastosMes,
      totalMovimientos: transactions.length,
      totalRecargas: transactions.filter(tx => tx.transaccionTipo === "A").length,
      totalCanjes: transactions.filter(tx => tx.transaccionTipo === "C").length
    };
  };

  const stats = calculateStats();
  const esTitular = userData?.titular === 1;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-indigo-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando tu información...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 rounded-lg p-6 max-w-md">
            <p className="text-red-800 dark:text-red-300">❌ {error}</p>
            <button
              onClick={() => fetchUserBalance(userData?.usuarioId)}
              className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <ClientHeader esTitular={esTitular} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8 space-y-6">
        {/* Balance card */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          {/* Imagen */}
          <div className="md:w-1/2 order-1 md:order-1">
            <div className="relative rounded-2xl overflow-hidden shadow-lg h-full">
              <img 
                src="/1.jpeg" 
                alt="Wallet illustration" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />              
            </div>
          </div>

          {/* Saldo y acciones QR */}
          <div className="md:w-1/2 order-2 md:order-2 space-y-4">
            {/* Tarjeta de saldo */}
            <div className="bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
              <div>
                <div className="bottom-4 left-4 text-white">
                  <p className="text-sm font-medium opacity-90">Bienvenido a <strong>tu monedero digital</strong></p>                
                </div>
                <p className="text-sm text-indigo-200 font-medium flex items-center gap-2 pt-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Saldo disponible
                </p>
                <p className="text-4xl font-bold mt-2">
                  ${userData?.montoDisponible?.toFixed(2) || "0.00"}
                </p>
              </div>
              
              <div className="mt-4 pt-4 border-t border-indigo-400/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-indigo-200">
                      {userData?.usuarioNombre} {userData?.usuarioApellido}
                    </p>
                    <p className="text-xs text-indigo-200 flex items-center gap-1 mt-1">
                      {userData?.titular === 1 ? "Cuenta Titular" : "Cuenta Adicional"}
                      {userData?.idTitular > 0 && ` · ID Titular: ${userData.idTitular}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-indigo-200">Saldo utilizado</p>
                    <p className="text-sm font-semibold">
                      ${userData?.montoUtilizado?.toFixed(2) || "0.00"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Botón de QR */}
            <button
              onClick={() => setIsQRModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-indigo-600 dark:text-indigo-400 font-semibold py-4 px-4 rounded-xl border-2 border-indigo-600 dark:border-indigo-400 transition-all duration-300 transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              Mi Código QR
            </button>
          </div>
        </div>

        {/* Quick stats - Solo mostrar si es titular */}
        {esTitular && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Ingresos del mes", value: `$${stats.ingresosMes.toFixed(2)}`, color: "text-green-600 dark:text-green-400" },
              { label: "Gastos del mes", value: `$${stats.gastosMes.toFixed(2)}`, color: "text-red-500 dark:text-red-400" },
              { label: "Movimientos", value: stats.totalMovimientos.toString(), color: "text-indigo-600 dark:text-indigo-400" },
              { label: "Recargas", value: stats.totalRecargas.toString(), color: "text-indigo-600 dark:text-indigo-400" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-400 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
                <p className={`text-xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Recent transactions - Solo mostrar si es titular */}
        {esTitular && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-400 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-400 dark:border-gray-700 flex items-center justify-between">
              <h2 className="font-semibold text-gray-800 dark:text-white">Movimientos recientes</h2>
              <Link to="/client/historial" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                Ver todos
              </Link>
            </div>
            {transactions.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <svg className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500 dark:text-gray-400">No hay movimientos registrados</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-400 dark:divide-gray-700">
                {transactions.slice(0, 5).map((tx) => {
                  const isCredit = tx.transaccionTipo === "A";
                  const amount = tx.transaccionImporte;
                  const description = getTransactionDescription(tx);
                  const reference = getReferenceNumber(tx);
                  
                  return (
                    <li key={tx.transaccionId} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg
                            ${isCredit 
                              ? "bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400" 
                              : "bg-red-100 dark:bg-red-900/50 text-red-500 dark:text-red-400"}`}>
                            {isCredit ? "↓" : "↑"}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-medium text-gray-800 dark:text-white">
                                {description}
                              </p>
                              {reference && reference !== "0" && (
                                <span className="text-xs font-mono text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                                  {reference}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-xs text-gray-400 dark:text-gray-500">
                                {formatDate(tx.transaccionFecha)}
                              </p>
                              <span className="text-xs text-gray-400">•</span>
                              <p className="text-xs text-gray-400 dark:text-gray-500">
                                {formatTime(tx.transaccionFecha)}
                              </p>
                              {tx.transaccionTipo === "C" && tx.transaccionFolioTick !== "0" && (
                                <>
                                  <span className="text-xs text-gray-400">•</span>
                                  <p className="text-xs text-gray-400 dark:text-gray-500">
                                    Folio: {tx.transaccionFolioTick}
                                  </p>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <span className={`text-sm font-bold ${isCredit 
                          ? "text-green-600 dark:text-green-400" 
                          : "text-red-500 dark:text-red-400"}`}>
                          {isCredit ? "+" : "-"}${amount.toFixed(2)}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
            {transactions.length > 5 && (
              <div className="px-6 py-3 border-t border-gray-400 dark:border-gray-700 text-center">
                <Link to="/client/historial" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                  Ver los {transactions.length - 5} movimientos restantes
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Mensaje para cuentas adicionales */}
        {!esTitular && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6 text-center">
            <svg className="w-12 h-12 mx-auto text-amber-500 dark:text-amber-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-amber-700 dark:text-amber-300 font-medium">
              Esta es una cuenta adicional
            </p>
            <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
              El historial de movimientos solo está disponible para cuentas titulares.
            </p>
          </div>
        )}
      </main>

      {/* Modal QR */}
      <QRModal 
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        phoneNumber={userData?.usuarioTelefono ? formatPhoneForDisplay(userData.usuarioTelefono.trim()) : ""}
        usuarioId={userData?.usuarioId}
      />

      <ClientFooter />
    </div>
  );
};

export default ClientHome;