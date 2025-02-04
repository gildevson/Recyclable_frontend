import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoutes = () => {
  const token = localStorage.getItem("token");
  

  // Verifica se o token existe
  if (!token) {
    return <Navigate to="/login" />; // Redireciona para a página de login
  }

  // Permite acesso às rotas protegidas
  return <Outlet />;
};

export default PrivateRoutes;
