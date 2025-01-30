import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/login/login";
import Menu from "./components/menu/menu";
import PrivateRoute from "./components/routes/PrivateRoute"; // Certifique-se do caminho correto

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Rota de Login */}
        <Route path="/login" element={<Login />} />

        {/* Rota Protegida */}
        <Route 
          path="/menu" 
          element={
            <PrivateRoute>
              <Menu />
            </PrivateRoute>
          } 
        />

        {/* Redirecionar rotas inválidas para login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
