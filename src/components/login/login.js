import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api"; // Certifique-se que o caminho para sua API está correto
import logo from "../img/logo.png"; // Verifique se o caminho do seu logo está correto
import "./login.css"; // Importa os estilos para esta página

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Callback para verificar se o usuário está autenticado
    const checkAuth = useCallback(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/dashboard"); // Redireciona para o dashboard se já estiver autenticado
        }
    }, [navigate]);

    // Verifica se o usuário já está logado ao montar o componente
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    // Função para validar email
    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    // Lida com a submissão do formulário de login
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(""); // Limpa erros anteriores

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
                // Salva o token e o nome do usuário no localStorage
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("username", response.data.name);
                localStorage.setItem("user", JSON.stringify(response.data.user)); // 🔧 ESSENCIAL

                navigate("/dashboard");
            } else {
                // Caso a API retorne um status de erro não HTTP (ex: 200 com mensagem de erro no corpo)
                setError(response.data.message || "Erro desconhecido. Tente novamente.");
            }
        } catch (error) {
            // Trata erros de requisição (HTTP status codes)
            const status = error.response?.status;
            if (status === 401) {
                setError("Credenciais inválidas. Verifique seu email e senha.");
            } else if (status >= 500) {
                setError("Erro no servidor. Tente novamente mais tarde.");
            } else {
                setError("Erro na conexão com o servidor. Verifique sua internet.");
            }
        } finally {
            setLoading(false); // Sempre desabilita o carregamento no final
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                {/* Certifique-se que 'logo' está importado corretamente e o caminho para 'logo.png' está certo */}
                <img src={logo} alt="Logo Remessa Segura" className="login-logo" />
                <h1>Login</h1>
                {/* Adicionada a classe 'welcome-text' para melhor estilização */}
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
