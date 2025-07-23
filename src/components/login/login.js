import React, { useState } from "react";
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

    // Função para validar email
    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    // Lida com a submissão do formulário de login
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;

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
                const userData = {
                    id: response.data.id,
                    name: response.data.name,
                    email: response.data.email,
                    permissions: response.data.permissions
                };

                localStorage.setItem("user", JSON.stringify(userData));
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("username", response.data.name);
                navigate("/dashboard", { replace: true });
            } else {
                setError(response.data.message || "Erro desconhecido. Tente novamente.");
            }
        } catch (error) {
            const status = error.response?.status;
            if (status === 401) {
                setError("Credenciais inválidas. Verifique seu email e senha.");
            } else if (status >= 500) {
                setError("Erro no servidor. Tente novamente mais tarde.");
            } else {
                setError("Erro na conexão com o servidor. Verifique sua internet.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <img src={logo} alt="Logo Remessa Segura" className="login-logo" />
                <h1>Login</h1>
                <p className="welcome-text">Bem-vindo ao Sistema de Gestão de Recicláveis</p>

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
