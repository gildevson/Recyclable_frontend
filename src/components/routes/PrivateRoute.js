import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem("token");

    // Redireciona para o login se o token não existir
    if (!token) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default PrivateRoute;
