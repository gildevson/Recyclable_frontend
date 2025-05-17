import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./components/login/login";
import Menu from "./components/menu/menu";
import Dashboard from "./components/dashboard/Dashboard";
import PrivateRoutes from "./components/routes/PrivateRoute";
import "./App.css"; // Estilos globais
import UserList from "./components/pages/users/UserList";

const AppLayout = () => {
  const location = useLocation();
  const hideMenu = location.pathname === "/login"; // Esconde o menu apenas na tela de login

  return (
    <div className="app-container">
      {!hideMenu && <Menu />} {/* Renderiza o menu apenas se não estiver na tela de login */}

      <div className="content">
        <Routes>
          {/* Rota pública */}
          <Route path="/login" element={<Login />} />

          {/* Rotas protegidas */}
          <Route element={<PrivateRoutes />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          {/* Redirecionamento padrão */}
          <Route path="*" element={<Navigate to="/login" />} />
          <Route element={<PrivateRoutes />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<UserList />} /> {/* ✅ Nova rota */}
          </Route>
        </Routes>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
};

export default App;
