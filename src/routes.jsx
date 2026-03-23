import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./views/Login";
import ClientHome from "./views/ClientHome";
import AdminHome from "./views/admin/AdminHome";
import RegisterFromAdmin from "./views/admin/RegisterFromAdmin";
import Abonar from "./views/admin/Abonar";
import Canjear from "./views/admin/Canjear";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/client" element={<ClientHome />} />
      <Route path="/admin" element={<AdminHome />} />
      <Route path="/admin/registrar" element={<RegisterFromAdmin />} />
      <Route path="/admin/canjear" element={<Canjear />} />
      <Route path="/admin/abonar" element={<Abonar />} />
    </Routes>
  );
};

export default AppRoutes;