import React from "react";
import { useNavigate } from "react-router-dom";

const Menu = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove o token
    navigate("/login"); // Redireciona para a tela de login
  };

  return (
    <div>
      <h1>Bem-vindo ao Sistema</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Menu;
