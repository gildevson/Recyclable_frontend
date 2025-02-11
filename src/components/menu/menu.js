import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./menu.css";
import {
  FaHome,
  FaUser,
  FaUserPlus,
  FaChartBar,
  FaQuestionCircle,
  FaSignOutAlt,
  FaTachometerAlt,
} from "react-icons/fa";

const Menu = () => {
  // Estado para controlar se o menu está aberto ou fechado
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Estado para armazenar o nome do usuário
  const [username, setUsername] = useState("Guest");

  // Estado para exibir a tela de carregamento
  const [isLoading, setIsLoading] = useState(false); // ADICIONADO para controle do spinner

  const navigate = useNavigate();

  // useEffect para verificar o token e redirecionar para o login caso não exista
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }

    // Recupera o nome do usuário do localStorage
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) setUsername(storedUsername);
  }, [navigate]);

  // Função para alternar o estado do menu (abrir/fechar)
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Função para navegar para uma rota específica
  const handleNavigate = (path) => {
    setIsLoading(true); // ADICIONADO para ativar o spinner
    setTimeout(() => {
      navigate(path); // Navega para a rota especificada
      setIsLoading(false); // ADICIONADO para desativar o spinner após a navegação
    }, 1000); // Simula um atraso de 1 segundo
  };

  // Função para logout
  const handleLogout = () => {
    setIsLoading(true); // ADICIONADO para ativar o spinner durante o logout
    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      navigate("/login"); // Redireciona para a página de login
      setIsLoading(false); // ADICIONADO para desativar o spinner após o logout
    }, 1000);
  };

  // Itens do menu com ícones e rotas
  const menuItems = [
    { label: "Dashboard", icon: <FaTachometerAlt />, path: "/dashboard" }, 
    { label: "Listar Usuários", icon: <FaUser />, path: "/users" },
    { label: "Adicionar Usuário", icon: <FaUserPlus />, path: "/add-user" },
    { label: "Relatório Mensal", icon: <FaChartBar />, path: "/monthly-report" },
    { label: "Relatório Anual", icon: <FaChartBar />, path: "/annual-report" },
    { label: "Questões", icon: <FaQuestionCircle />, path: "/questions" },
  ];

  return (
    <div>
      {/* ADICIONADO: Tela de carregamento com spinner */}
      {isLoading && ( // Exibe o spinner enquanto isLoading for verdadeiro
        <div className="loading-screen">
          <div className="spinner"></div>
        </div>
      )}

      {/* Botão para abrir/fechar o menu */}
      <button className="hamburger" onClick={toggleMenu}>
        <FaHome />
      </button>

      {/* Container do menu */}
      <div className={`menu-container ${isMenuOpen ? "open" : ""}`}>
        {/* Informações do usuário */}
        <div className="user-info">
          <FaUser style={{ marginRight: "10px", fontSize: "24px" }} />
          <span>{username}</span>
        </div>

        {/* Itens do menu */}
        <ul className="menu">
          {menuItems.map((item, index) => (
            <li key={index}>
              {item.icon}
              <button
                onClick={() => handleNavigate(item.path)} // ADICIONADO: Chamada para handleNavigate
                className="menu-link"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Botão de logout */}
        <ul className="menu-bottom">
          <li>
            <FaSignOutAlt />
            <button
              className="logout-button"
              onClick={handleLogout} // ADICIONADO: Spinner durante o logout
              disabled={isLoading} // Desabilita o botão enquanto está carregando
            >
              {isLoading ? "Saindo..." : "Sair"} {/* Mostra "Saindo..." durante o carregamento */}
            </button>
          </li>
        </ul>
      </div>

      {/* Overlay para fechar o menu ao clicar fora */}
      {isMenuOpen && <div className="overlay" onClick={toggleMenu}></div>}
    </div>
  );
};

export default Menu;
