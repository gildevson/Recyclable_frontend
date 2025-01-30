import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api"; // Certifique-se do caminho correto
import "./login.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!email || !password) {
            setError("Por favor, preencha todos os campos.");
            setLoading(false);
            return;
        }

        try {
            const response = await api.post("/auth/login", { email, password });
            if (response.status === 200) {
                localStorage.setItem("token", response.data.token); // Salva o token
                navigate("/menu"); // Redireciona para o menu
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setError("Credenciais inválidas.");
            } else {
                setError("Erro na conexão com o servidor.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <h1>Login</h1>
            <p>Sistema de Gestão de Recicláveis</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Digite seu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {error && <p className="login-error-message">{error}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? "Carregando..." : "Entrar no Sistema"}
                </button>
            </form>
        </div>
    );
};

export default Login;
