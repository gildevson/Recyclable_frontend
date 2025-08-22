import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./menu.css";
import {
  FaHome,
  FaUser,
  FaChartBar,
  FaSignOutAlt,
  FaTachometerAlt,
  FaChevronDown,
  FaChevronRight,
  FaTools,
  FaMoneyBillWave,
  FaBuilding,
  FaUsers,
  FaAddressCard,
  FaFolder, // <--- Novo ícone
} from "react-icons/fa";


const Menu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const username = localStorage.getItem("username") || "Guest";
  const [isLoading, setIsLoading] = useState(false);
  const [openGroups, setOpenGroups] = useState({});
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const publicPaths = ["/login", "/forgot-password"];
    const token = localStorage.getItem("token");
    const currentPath = window.location.pathname;
    if (!token && !publicPaths.includes(currentPath)) {
      navigate("/login");
    }
  }, [navigate]);

  const toggleMenu = () => setIsMenuOpen((v) => !v);
  const toggleGroup = (key) =>
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleNavigate = (path) => {
    setIsLoading(true);
    setTimeout(() => {
      navigate(path);
      setIsLoading(false);
      setIsMenuOpen(false);
    }, 600);
  };

  const handleLogout = () => {
    setIsLoading(true);
    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      navigate("/login");
      setIsLoading(false);
      setIsMenuOpen(false);
    }, 600);
  };

  const isActive = (path) => location.pathname.startsWith(path);

  const menuTree = [
  { type: "item", label: "Home", icon: <FaHome />, path: "/dashboard" },
  { type: "item", label: "Operação", icon: <FaTachometerAlt />, path: "/operacao" },
  { type: "item", label: "Manutenção de documentos", icon: <FaAddressCard />, path: "/manutencao-documentos" },
  { type: "item", label: "Cliente", icon: <FaUser />, path: "/cliente" },
  {
    type: "group", // <--- Alterado de "section" para "group"
    label: "Cadastros",
    key: "Cadastros", // <--- Adicionada uma chave
    icon: <FaFolder />, // <--- Adicionado um ícone
    children: [
      { type: "item", label: "Empresa", icon: <FaBuilding />, path: "/cadastros/empresa" },
      { type: "item", label: "Cliente", icon: <FaUser />, path: "/cadastros/cliente" },
      { type: "item", label: "Usuários", icon: <FaUsers />, path: "/cadastros/usuarios" },
      { type: "item", label: "Listar Usuários", icon: <FaUsers />, path: "/users" }, // <--- Movi para cá
      { type: "item", label: "Listar Clientes", icon: <FaUser />, path: "/clients" }, // <--- Movi para cá
    ],
  },
  {
    type: "group",
    label: "Operacional",
    key: "Operacional",
    icon: <FaTools />,
    children: [
      { type: "item", label: "Relatório Mensal", icon: <FaChartBar />, path: "/monthly-report" },
      { type: "item", label: "Relatório Anual", icon: <FaChartBar />, path: "/annual-report" },
    ],
  },
  {
    type: "group",
    label: "Financeiro",
    key: "Financeiro",
    icon: <FaMoneyBillWave />,
    children: [
      { type: "item", label: "Faturamento", icon: <FaMoneyBillWave />, path: "/financeiro/faturamento" },
    ],
  },
];

  const filterBySearch = (node, term) => {
    if (!term) return node;
    const q = term.toLowerCase();

    if (node.type === "item") {
      return node.label.toLowerCase().includes(q) ? node : null;
    }

    if (node.type === "group" || node.type === "section") {
      const kids = node.children?.map((n) => filterBySearch(n, term)).filter(Boolean) || [];
      if (node.label.toLowerCase().includes(q) || kids.length > 0) {
        return { ...node, children: kids };
      }
      return null;
    }
    return null;
  };

  const filteredTree = useMemo(
    () => menuTree.map((n) => filterBySearch(n, search)).filter(Boolean),
    [search]
  );

  const renderNode = (node, keyPrefix = "") => {
    if (node.type === "item") {
      return (
        <li key={`${keyPrefix}${node.path}`} className={`menu-item ${isActive(node.path) ? "active" : ""}`}>
          {node.icon}
          <button onClick={() => handleNavigate(node.path)} className="menu-link">
            {node.label}
          </button>
        </li>
      );
    }

    if (node.type === "section") {
      return (
        <li key={`${keyPrefix}${node.label}`} className="menu-section">
          <span className="menu-section-title">{node.label}</span>
          <ul className="submenu">
            {node.children?.map((child, i) => (
              <React.Fragment key={`${keyPrefix}${node.label}-${i}`}>
                {renderNode(child, `${keyPrefix}${node.label}-${i}-`)}
              </React.Fragment>
            ))}
          </ul>
        </li>
      );
    }

    if (node.type === "group") {
      const isOpen = !!openGroups[node.key];
      return (
        <li key={`${keyPrefix}${node.key}`} className={`menu-group ${isOpen ? "open" : ""}`}>
          <button
            className="menu-group-toggle"
            onClick={() => toggleGroup(node.key)}
            aria-expanded={isOpen}
            aria-controls={`group-${node.key}`}
          >
            {node.icon}
            <span className="menu-link">{node.label}</span>
            <span className="menu-group-caret">
              {isOpen ? <FaChevronDown /> : <FaChevronRight />}
            </span>
          </button>
          {isOpen && (
            <ul id={`group-${node.key}`} className="submenu">
              {node.children?.map((child, i) => (
                <React.Fragment key={`${keyPrefix}${node.key}-${i}`}>
                  {renderNode(child, `${keyPrefix}${node.key}-${i}-`)}
                </React.Fragment>
              ))}
            </ul>
          )}
        </li>
      );
    }
    return null;
  };

  return (
    <div>
      {isLoading && (
        <div className="loading-screen">
          <div className="spinner"></div>
        </div>
      )}

      <button className="hamburger" onClick={toggleMenu} aria-label="Abrir menu">
        <FaChevronRight />
      </button>

      <div className={`menu-container ${isMenuOpen ? "open" : ""}`}>
        {/* Search at the top */}
        <div className="menu-search">
          <input
            type="text"
            placeholder="Pesquisar"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* User Info */}
        <div className="user-info">
          <FaUser className="user-icon" />
          <span>{username}</span>
        </div>

        {/* Main menu items */}
        <ul className="menu">
          {filteredTree.map((n, i) => (
            <React.Fragment key={`root-${i}`}>
              {renderNode(n, `root-${i}-`)}
            </React.Fragment>
          ))}
        </ul>

        {/* Fixed at the bottom */}
        <ul className="menu-bottom">
          <li className="menu-item">
            <FaSignOutAlt />
            <button
              className="logout-button"
              onClick={handleLogout}
              disabled={isLoading}
            >
              {isLoading ? "Saindo..." : "Sair"}
            </button>
          </li>
        </ul>
      </div>

      {isMenuOpen && <div className="overlay" onClick={toggleMenu}></div>}
    </div>
  );
};

export default Menu;