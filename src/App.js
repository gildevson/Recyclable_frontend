import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./components/login/login";
import Menu from "./components/menu/menu";
import Dashboard from "./components/dashboard/Dashboard";
import PrivateRoutes from "./components/routes/PrivateRoute";
import "./App.css";
import UserList from "./components/pages/users/UserList";
import UserCreate from "./components/pages/users/UserCreate";

const AppLayout = () => {
  const location = useLocation();
  const hideMenu = location.pathname === "/login";

  return (
    <div className="app-container">
      {!hideMenu && <Menu />}
      <div className="content">
        <Routes>
          {/* Rota pública */}
          <Route path="/login" element={<Login />} />

          {/* Rotas protegidas */}
          <Route element={<PrivateRoutes />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/users/new" element={<UserCreate />} />
          </Route>

          {/* Rota padrão para redirecionar para login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
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
