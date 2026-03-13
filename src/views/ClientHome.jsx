// src/views/ClientHome.jsx 
import ClientHeader from "../components/ClientHeader";
import ClientFooter from "../components/ClientFooter";
import { useTheme } from "../context/ThemeContext"; 

const transactions = [
  { id: 1, desc: "Recarga de saldo", amount: "+$500.00", date: "10 mar 2026", type: "credit" },
  { id: 2, desc: "Pago Café", amount: "-$199.00", date: "09 mar 2026", type: "debit" },
  { id: 4, desc: "Recarga de saldo", amount: "+$120.00", date: "07 mar 2026", type: "credit" },
];

const ClientHome = () => {
  const { isDark } = useTheme(); // Opcional

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <ClientHeader />

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

          {/* Saldo  */}
          <div className="md:w-1/2 order-2 md:order-2">
            <div className="bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg h-full flex flex-col justify-between">
              <div>
                <div className=" bottom-4 left-4 text-white">
                  <p className="text-sm font-medium opacity-90">Bienvenido a <strong className="">tu monedero digital</strong> </p>                
                </div>
                <p className="text-sm text-indigo-200 font-medium flex items-center gap-2 pt-2">
                  
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Saldo disponible
                </p>
                <p className="text-4xl font-bold mt-2">$820.00</p>
              </div>
              
              <div className="mt-4 pt-4 border-t border-indigo-400/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-indigo-200">Gerardo Ruelas Hernández</p>
                    <p className="text-xs text-indigo-200 flex items-center gap-1 mt-1">
                      Dept. 334
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas  */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Ingresos del mes", value: "$1,200.00", color: "text-green-600 dark:text-green-400" },
            { label: "Gastos del mes", value: "$780.00", color: "text-red-500 dark:text-red-400" },
            { label: "Movimientos", value: "3", color: "text-indigo-600 dark:text-indigo-400" },
            { label: "Recargas", value: "2", color: "text-indigo-600 dark:text-indigo-400" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-400 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
              <p className={`text-xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Transacciones Recientes  */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-400 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-400 dark:border-gray-700 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800 dark:text-white">Movimientos recientes</h2>
            <a href="#" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">Ver todos</a>
          </div>
          <ul className="divide-y divide-gray-400 dark:divide-gray-700">
            {transactions.map((tx) => (
              <li key={tx.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-lg
                    ${tx.type === "credit" 
                      ? "bg-green-400 dark:bg-green-900/80" 
                      : "bg-red-400 dark:bg-red-900/80"}`}>
                    {tx.type === "credit" ? "↓" : "↑"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">{tx.desc}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{tx.date}</p>
                  </div>
                </div>
                <span className={`text-sm font-bold ${tx.type === "credit" 
                  ? "text-green-600 dark:text-green-400" 
                  : "text-red-500 dark:text-red-400"}`}>
                  {tx.amount}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </main>

      <ClientFooter />
    </div>
  );
};

export default ClientHome;