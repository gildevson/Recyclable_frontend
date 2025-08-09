import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./login.css";
// Se você tiver uma imagem de logo para o painel da esquerda, importe-a aqui
import logo from "../img/logo.png"; 

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const checkAuth = useCallback(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/dashboard");
        }
    }, [navigate]);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

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
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("username", response.data.name);
                navigate("/dashboard");
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
                {/* Painel da esquerda com o formulário */}
                <div className="login-form-column">
                    <img src={logo} alt="Logo" className="login-logo"/>
                    <h1 className="form-title">Seja bem-vindo, insira seus dados.</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                          <label htmlFor="email">E-mail*</label>
                          <input
                              id="email"
                              type="email"
                              placeholder="Digite seu email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                          />
                        </div>
                        <div className="input-group">
                          <label htmlFor="password">Senha*</label>
                          <input
                              id="password"
                              type="password"
                              placeholder="Digite sua senha"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                          />
                        </div>
                        <a href="/forgot-password" className="forgot-password-link">Esqueci minha senha</a>
                        {error && <p className="error-message">{error}</p>}
                        <button type="submit" disabled={loading}>
                            {loading ? <span className="spinner"></span> : "Entrar"}
                        </button>
                    </form>
                </div>

                {/* Painel da direita com informações da empresa */}
                <div className="login-info-column">
                    <h2 className="info-title">LiveWork ERP</h2>
                    <p className="info-subtitle">Plataforma de negócios, multitarefa.</p>
                    <p className="info-text">
                        Backoffice de ponta a ponta em serviços e sistemas para empresas de Crédito e Fomento Comercial: Factorings, Cias Securitizadoras, FIDCs e ESCs.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
