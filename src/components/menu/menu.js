import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './menu.css';
import { FaHome, FaUser, FaUserPlus, FaChartBar, FaQuestionCircle, FaSignOutAlt } from 'react-icons/fa';

const Menu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [username, setUsername] = useState('Guest');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');

    if (storedUsername) setUsername(storedUsername);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('permission');
    navigate('/');
  };

  return (
    <div>
      <button className="hamburger" onClick={toggleMenu}>
        <FaHome />
      </button>

      <div className={`menu-container ${isMenuOpen ? 'open' : ''}`}>
        <div className="user-info">
          <FaUser style={{ marginRight: '10px', fontSize: '24px' }} />
          <span>{username}</span>
        </div>

        <ul className="menu">
          {/* Home Section */}
          <li>
            <FaHome />
            <button onClick={() => handleNavigate('/home')} className="menu-link">Home</button>
          </li>

          {/* Usuários Section */}
          <li className="menu-section-title">Usuários</li>
          <li>
            <FaUser />
            <button onClick={() => handleNavigate('/users')} className="menu-link">Listar Usuários</button>
          </li>
          <li>
            <FaUserPlus />
            <button onClick={() => handleNavigate('/add-user')} className="menu-link">Adicionar Usuário</button>
          </li>

          {/* Relatórios Section */}
          <li className="menu-section-title">Relatórios</li>
          <li>
            <FaChartBar />
            <button onClick={() => handleNavigate('/monthly-report')} className="menu-link">Relatório Mensal</button>
          </li>
          <li>
            <FaChartBar />
            <button onClick={() => handleNavigate('/annual-report')} className="menu-link">Relatório Anual</button>
          </li>

          {/* Questões Section */}
          <li className="menu-section-title">Questões</li>
          <li>
            <FaQuestionCircle />
            <button onClick={() => handleNavigate('/questions')} className="menu-link">Questões</button>
          </li>
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
    </div>
  );
};

export default Menu;
