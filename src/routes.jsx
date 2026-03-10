import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./views/Login";
import ClientHome from "./views/ClientHome";
import AdminHome from "./views/AdminHome";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/client" element={<ClientHome />} />
      <Route path="/admin" element={<AdminHome />} />
    </Routes>
  );
};

export default AppRoutes;