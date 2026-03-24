// src/views/AdminHome.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import AdminHeader from "../../components/AdminHeader";
import AdminFooter from "../../components/AdminFooter";
import { useTheme } from "../../context/ThemeContext";

const AdminHome = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Verificar si hay usuario admin en localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/");
      return;
    }
    
    const user = JSON.parse(storedUser);
    // Verificar si es admin (puedes ajustar según tu lógica)
    // Por ahora, asumimos que cualquier usuario que llega a admin es admin
    fetchUsers(1); // Negocio ID = 1
  }, [navigate]);

  const fetchUsers = async (negocioId) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`https://souvenir-site.com/TarjetCashBack/api/users/${negocioId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Si necesitas token de autenticación, agrégalo aquí
          // "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });

      const data = await response.json();

      if (data.success) {
        // Para cada usuario, necesitamos obtener su saldo actual
        const usersWithBalance = await Promise.all(
          data.data.map(async (user) => {
            const balanceData = await fetchUserBalance(user.usuarioId);
            return {
              ...user,
              balance: balanceData?.montoDisponible || 0
            };
          })
        );
        setUsers(usersWithBalance);
      } else {
        setError(data.message || "Error al obtener los usuarios");
      }
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      setError("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserBalance = async (usuarioId) => {
    try {
      const response = await fetch(`https://souvenir-site.com/TarjetCashBack/api/account/${usuarioId}/balance`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });
      const data = await response.json();
      if (data.success) {
        return data.data.usuario;
      }
      return null;
    } catch (error) {
      console.error(`Error al obtener balance del usuario ${usuarioId}:`, error);
      return null;
    }
  };

  // Función para formatear el teléfono
  const formatPhoneNumber = (phone) => {
    if (!phone) return "No especificado";
    const clean = phone.toString().trim();
    if (clean.length === 10) {
      return `${clean.slice(0, 3)}-${clean.slice(3, 6)}-${clean.slice(6)}`;
    }
    return clean;
  };

  // Función para formatear saldo
  const formatBalance = (balance) => {
    return `$${balance?.toFixed(2) || "0.00"}`;
  };

  // Filtrar usuarios por búsqueda
  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.usuarioNombre?.toLowerCase().includes(searchLower) ||
      user.usuarioApellido?.toLowerCase().includes(searchLower) ||
      user.usuarioTelefono?.toLowerCase().includes(searchLower) ||
      user.usuarioCorreo?.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-blue-100 dark:bg-gray-950">
        <AdminHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <svg className="animate-spin h-12 w-12 text-indigo-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando usuarios...</p>
          </div>
        </main>
        <AdminFooter />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-blue-100 dark:bg-gray-950">
        <AdminHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 rounded-lg p-6 max-w-md">
            <p className="text-red-800 dark:text-red-300 text-center">❌ {error}</p>
            <button
              onClick={() => fetchUsers(1)}
              className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Reintentar
            </button>
          </div>
        </main>
        <AdminFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-blue-100 dark:bg-gray-950 transition-colors duration-300">
      <AdminHeader />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 space-y-6">
        {/* Users table */}
        <div className="bg-blue-50 dark:bg-gray-800 rounded-2xl border border-gray-300 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-500 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="font-semibold text-gray-800 dark:text-white">Usuarios registrados</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Total: {users.length} usuarios
                </p>
              </div>
              <div className="flex gap-3">
                {/* Buscador */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar por nombre, teléfono o email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64 px-4 py-2 rounded-lg border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <Link
                  to="/admin/registrar"
                  className="text-xs bg-amber-400 text-gray-900 font-semibold px-4 py-2 rounded-lg hover:bg-amber-300 transition inline-flex items-center gap-1"
                >
                  <span>+</span> Nuevo usuario
                </Link>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-gray-500 dark:text-gray-400">No se encontraron usuarios</p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="mt-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Limpiar búsqueda
                  </button>
                )}
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-blue-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 uppercase text-xs">
                  <tr>
                    <th className="px-6 py-3 text-left">ID</th>
                    <th className="px-6 py-3 text-left">Nombre completo</th>
                    <th className="px-6 py-3 text-left">Teléfono</th>
                    <th className="px-6 py-3 text-left">Correo</th>
                    <th className="px-6 py-3 text-left">Tipo</th>
                    <th className="px-6 py-3 text-left">Saldo</th>
                    <th className="px-6 py-3 text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300 dark:divide-gray-700">
                  {filteredUsers.map((user) => (
                    <tr key={user.usuarioId} className="hover:bg-blue-100 dark:hover:bg-gray-700/50 transition">
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs font-mono">
                        {user.usuarioId}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-gray-900 dark:text-white font-medium">
                            {user.usuarioNombre} {user.usuarioApellido}
                          </p>
                          {user.titular === 1 && (
                            <span className="inline-block mt-1 text-xs bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded">
                              Titular
                            </span>
                          )}
                          {user.idTitular !== user.usuarioId && user.idTitular > 0 && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              ID Titular: {user.idTitular}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                        {formatPhoneNumber(user.usuarioTelefono)}
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                        {user.usuarioCorreo || "No especificado"}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          user.titular === 1 
                            ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300" 
                            : "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                        }`}>
                          {user.titular === 1 ? "Principal" : "Adicional"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-amber-600 dark:text-amber-400 font-semibold">
                        {formatBalance(user.balance)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Link
                            to={`/admin/abonar?usuarioId=${user.usuarioId}`}
                            className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded transition"
                          >
                            Abonar
                          </Link>
                          <Link
                            to={`/admin/canjear?usuarioId=${user.usuarioId}`}
                            className="text-xs bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded transition"
                          >
                            Canjear
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Resumen de estadísticas */}
          {users.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-500 dark:border-gray-700 bg-blue-50 dark:bg-gray-900">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Total usuarios</p>
                  <p className="text-xl font-bold text-gray-800 dark:text-white">{users.length}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Cuentas titulares</p>
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">
                    {users.filter(u => u.titular === 1).length}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Cuentas adicionales</p>
                  <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {users.filter(u => u.titular === 0).length}
                  </p>
                </div>                
              </div>
            </div>
          )}
        </div>
      </main>

      <AdminFooter />
    </div>
  );
};

export default AdminHome;