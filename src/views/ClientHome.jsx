import ClientHeader from "../components/ClientHeader";
import ClientFooter from "../components/ClientFooter";

const transactions = [
  { id: 1, desc: "Recarga de saldo", amount: "+$500.00", date: "10 mar 2026", type: "credit" },
  { id: 2, desc: "Pago Café", amount: "-$199.00", date: "09 mar 2026", type: "debit" },
  { id: 4, desc: "Recarga de saldo", amount: "+$120.00", date: "07 mar 2026", type: "credit" },
];

const ClientHome = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <ClientHeader />

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8 space-y-6">
        {/* Balance card */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-2xl p-6 text-white shadow-lg">
          <p className="text-sm text-indigo-200 font-medium">Saldo disponible</p>
          <p className="text-4xl font-bold mt-1">$820.00</p>
          <div>
            <p className="text-sm text-indigo-200 mt-2">Gerardo Ruelas Hernández</p>
            <p className="text-xs text-indigo-200">55 3213 4821</p>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Ingresos del mes", value: "$1,200.00", color: "text-green-600" },
            { label: "Gastos del mes", value: "$780.00", color: "text-red-500" },
            { label: "Movimientos", value: "3", color: "text-indigo-600" },
            { label: "Recargas", value: "2", color: "text-indigo-600" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <p className="text-xs text-gray-500">{stat.label}</p>
              <p className={`text-xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Recent transactions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Movimientos recientes</h2>
            <a href="#" className="text-sm text-indigo-600 hover:underline">Ver todos</a>
          </div>
          <ul className="divide-y divide-gray-50">
            {transactions.map((tx) => (
              <li key={tx.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-lg
                    ${tx.type === "credit" ? "bg-green-100" : "bg-red-100"}`}>
                    {tx.type === "credit" ? "↓" : "↑"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{tx.desc}</p>
                    <p className="text-xs text-gray-400">{tx.date}</p>
                  </div>
                </div>
                <span className={`text-sm font-bold ${tx.type === "credit" ? "text-green-600" : "text-red-500"}`}>
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