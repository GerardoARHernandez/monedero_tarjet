// src/views/AdminHome.jsx 
import AdminHeader from "../../components/AdminHeader";
import AdminFooter from "../../components/AdminFooter";
import { useTheme } from "../../context/ThemeContext";

const users = [
  { id: 1, name: "Juan Díaz", email: "juan@mail.com", balance: "$4,820.00" },
  { id: 2, name: "María López", email: "maria@mail.com", balance: "$1,250.00" },
  { id: 3, name: "Carlos Ruiz", email: "carlos@mail.com", balance: "$320.00" },
  { id: 4, name: "Ana Torres", email: "ana@mail.com", balance: "$9,100.00"  },
];

const AdminHome = () => {
  return (
    <div className="min-h-screen flex flex-col bg-blue-100 dark:bg-gray-950 transition-colors duration-300">
      <AdminHeader />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 space-y-6">
        {/* Users table */}
        <div className="bg-blue-50 dark:bg-gray-800 rounded-2xl border border-gray-300 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-500 dark:border-gray-700 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800 dark:text-white">Usuarios registrados</h2>
            <button className="text-xs bg-amber-400 text-gray-900 font-semibold px-3 py-1.5 rounded-lg hover:bg-amber-300 transition">
              + Nuevo usuario
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-blue-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3 text-left">Nombre</th>
                  <th className="px-6 py-3 text-left">Correo</th>
                  <th className="px-6 py-3 text-left">Saldo</th>
                  <th className="px-6 py-3 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300 dark:divide-gray-700">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-blue-100 dark:hover:bg-gray-700/50 transition">
                    <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">{user.name}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{user.email}</td>
                    <td className="px-6 py-4 text-amber-600 dark:text-amber-400 font-semibold">{user.balance}</td>                    
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition">Ver</button>
                        <button className="text-xs text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition">Editar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <AdminFooter />
    </div>
  );
};

export default AdminHome;