import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/login/login";
import Menu from "./components/menu/menu";
import PrivateRoutes from "./components/routes/PrivateRoute"; // Caminho do PrivateRoutes

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Rota pública */}
        <Route path="/login" element={<Login />} />

        {/* Rotas protegidas */}
        <Route element={<PrivateRoutes />}>
          <Route path="/menu" element={<Menu />} />
        </Route>

        {/* Redirecionar rotas inválidas para login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
