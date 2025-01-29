import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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

        // Validação de campos no frontend
        if (!email || !password) {
            setError("Por favor, preencha todos os campos.");
            setLoading(false);
            return;
        }

        try {
            // Chamada ao backend
            const response = await axios.post("http://localhost:8080/auth/login", {
                email,
                password,
            });

            if (response.status === 200) {
                // Login bem-sucedido
                localStorage.setItem("token", response.data.token);
                navigate("/menu");
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
