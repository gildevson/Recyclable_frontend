import React from "react";
import { useNavigate } from "react-router-dom";
import "./menu.css";

const Menu = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="menu-container">
      <h1>Bem-vindo ao Menu</h1>
      <button onClick={handleLogout}>Sair</button>
    </div>
  );
};

export default Menu;
