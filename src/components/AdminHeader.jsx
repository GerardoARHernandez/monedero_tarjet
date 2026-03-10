import { useNavigate } from "react-router-dom";

const AdminHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-gray-900 text-white shadow-lg border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-amber-400 rounded-md flex items-center justify-center">
          </div>
            <span className="text-gray-900 font-bold text-sm">M</span>
          <div>
            <span className="text-xl font-bold tracking-tight">Monedero</span>
            <span className="ml-2 text-xs bg-amber-400 text-gray-900 font-semibold px-2 py-0.5 rounded-full">
              ADMIN
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
          <a href="#" className="hover:text-white transition-colors">Dashboard</a>
          <a href="#" className="hover:text-white transition-colors">Abonar</a>
          <a href="#" className="hover:text-white transition-colors">Canjear</a>
        </nav>

        {/* Admin user */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold">Admin</p>
            <p className="text-xs text-gray-400">Superusuario</p>
          </div>
          <div className="w-9 h-9 rounded-md bg-amber-400 flex items-center justify-center text-sm font-bold text-gray-900">
            A
          </div>
          <button
            onClick={() => navigate("/login")}
            className="text-sm text-gray-400 hover:text-white transition-colors ml-1"
          >
            Salir
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;