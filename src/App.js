import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./components/login/login";
import Menu from "./components/menu/menu";
import Dashboard from "./components/dashboard/Dashboard";
import PrivateRoutes from "./components/routes/PrivateRoute";
import "./App.css";
import UserList from "./components/pages/users/UserList";
import Cliente from "./components/clienteForm/clienteForm"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ForgotPassword from "./components/forgotPassword/forgotPassword";
import ResetPassword from "./components/resetPassword/resetPassword"; // importe o componente
import UserCreate from "./components/pages/userCreate/UserCreate";

const AppLayout = () => {
  const location = useLocation();
  const hideMenu = location.pathname === "/login" || location.pathname === "/forgot-password" || location.pathname === "/reset-password";

  return (
    <div className="app-container">
      {!hideMenu && <Menu />}
      <div className="content">
        <Routes>
          {/* Públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} /> {/* <-- ADICIONAR AQUI */}

          {/* Protegidas */}
          <Route element={<PrivateRoutes />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/users/new" element={<UserCreate />} />
            <Route path="/clientes" element={<Cliente/>} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>

        <ToastContainer position="top-right" autoClose={3000} />
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
