import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./components/login/login";
import Menu from "./components/menu/menu";
import Dashboard from "./components/dashboard/Dashboard";
import PrivateRoutes from "./components/routes/PrivateRoute";
import "./App.css";
import UserList from "./components/pages/users/UserList";
import UserCreate from "./components/pages/users/UserCreate";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ForgotPassword from "./components/forgotPassword/forgotPassword";


const AppLayout = () => {
  const location = useLocation();
  const hideMenu = location.pathname === "/login" || location.pathname === "/forgot-password";


  return (
    <div className="app-container">
      {!hideMenu && <Menu />}
      <div className="content">
        <Routes>
          {/* Públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protegidas */}
          <Route element={<PrivateRoutes />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/users/new" element={<UserCreate />} />
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
