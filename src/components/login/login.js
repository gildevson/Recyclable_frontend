import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import logo from "../img/logo.png";
import "./login.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/menu"); // Redireciona para o menu se o token existir
        }
    }, [navigate]);

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!email || !password) {
            setError("Por favor, preencha todos os campos.");
            setLoading(false);
            return;
        }

        if (!validateEmail(email)) {
            setError("Por favor, insira um email válido.");
            setLoading(false);
            return;
        }

        try {
            const response = await api.post("/auth/login", { email, password });
            if (response.status === 200) {
                // Salva o token no localStorage
                localStorage.setItem("token", response.data.token);

                // Salva o nome do usuário no localStorage
                localStorage.setItem("username", response.data.name); 

                // Redireciona para o menu
                navigate("/menu");
            } else {
                setError(response.data.message || "Erro desconhecido. Tente novamente.");
            }
        } catch (error) {
            const status = error.response?.status;
            if (status === 401) {
                setError("Credenciais inválidas.");
            } else if (status >= 500) {
                setError("Erro no servidor. Tente novamente mais tarde.");
            } else {
                setError("Erro na conexão com o servidor.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-left">
                <img src={logo} alt="Logo" className="login-logo" />
                <h1>Login</h1>
                <p>Bem-vindo ao Sistema de Gestão de Recicláveis</p>
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
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" disabled={loading}>
                        {loading ? <span className="spinner"></span> : "Entrar no Sistema"}
                    </button>
                </form>
                <a href="/forgot-password" className="forgot-password-link">
                    Esqueceu sua senha?
                </a>
            </div>
        </div>
    );
};

export default Login;
