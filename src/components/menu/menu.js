import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './menu.css';
import { FaHome, FaBook, FaBars, FaUserCircle, FaUserPlus, FaSignOutAlt, FaFileAlt } from 'react-icons/fa';

const Menu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [username, setUsername] = useState('Guest');
  const [permission, setPermission] = useState(0);
  const [isLoading, setIsLoading] = useState(false); // Carregamento para logout e navegação
  const [isUserLoading, setIsUserLoading] = useState(false); // Carregamento de dados do usuário
  const navigate = useNavigate();

  // Carrega os dados do usuário
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedPermission = localStorage.getItem('permission');
  
    if (storedUsername && storedUsername !== 'undefined') {
      setUsername(storedUsername);
      setIsUserLoading(false); // Dados já disponíveis, não há necessidade de carregamento
    } else {
      setIsUserLoading(true); // Inicia o carregamento se os dados não estiverem disponíveis
    }
  
    if (storedPermission) {
      const perm = parseInt(storedPermission, 10);
      setPermission(perm);
    }
  
    if (!storedUsername || storedUsername === 'undefined') {
      setTimeout(() => {
        setIsUserLoading(false); // Finaliza o carregamento dos dados
      }, 1000); // Simula 1 segundo de carregamento
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    setIsLoading(true); // Ativa o carregamento de logout
    setTimeout(() => {
      localStorage.removeItem('username');
      localStorage.removeItem('permission');
      navigate('/'); // Redireciona para a página de login
      setIsLoading(false); // Desativa o carregamento
    }, 1500); // Simula 1.5s de carregamento
  };

  // Função para navegar com tela de carregamento
  const handleNavigate = (path) => {
    setIsLoading(true); // Ativa o carregamento
    setTimeout(() => {
      navigate(path); // Redireciona para a rota
      setIsLoading(false); // Desativa o carregamento
    }, 1000); // Simula 1s de carregamento
  };

  return (
    <div>
      {isLoading ? ( // Tela de carregamento durante logout ou navegação
        <div className="loading-screen">
          <div className="spinner"></div>
        </div>
      ) : (
        <>
          <button className="hamburger" onClick={toggleMenu}>
            <FaBars />
          </button>

          <div className={`menu-container ${isMenuOpen ? 'open' : ''}`}>
            <div className="user-info">
              {isUserLoading ? ( // Exibe o carregamento durante a busca de dados do usuário
                <div className="spinner" style={{ width: '30px', height: '30px' }}></div>
              ) : (
                <>
                  <FaUserCircle style={{ marginRight: '10px', fontSize: '24px' }} />
                  <span>{username}</span>
                </>
              )}
            </div>

            <ul className="menu">
              <li>
                <FaHome />
                <button onClick={() => handleNavigate('/home')} className="menu-link">Home</button>
              </li>
              <li>
                <FaFileAlt />
                <button onClick={() => handleNavigate('/ocorrencias')} className="menu-link">Ocorrencias</button>
              </li>
              <li>
                <FaBook />
                <button onClick={() => handleNavigate('/layouts')} className="menu-link">Layouts</button>
              </li>
              {permission === 1 && (
                <li>
                  <FaUserPlus />
                  <button onClick={() => handleNavigate('/add-user')} className="menu-link">Usuários</button>
                </li>
              )}
            </ul>

            <ul className="menu-bottom">
              <li>
                <FaSignOutAlt />
                <button className="logout-button" onClick={handleLogout}>
                  Sair
                </button>
              </li>
            </ul>
          </div>

          {isMenuOpen && <div className="overlay" onClick={toggleMenu}></div>}
        </>
      )}
    </div>
  );
};

export default Menu;
