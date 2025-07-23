import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const PrivateRoutes = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" />;
  }

  // Protege rota específica: /users/new requer "Permissão total"
  if (location.pathname === "/users/new") {
    const hasPermission = user?.permissions?.includes("Permissão total");
    if (!hasPermission) {
      return <Navigate to="/dashboard" />;
    }
  }

  return <Outlet />;
};

export default PrivateRoutes;
