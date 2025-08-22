import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./login.css";
import logo from "../img/logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const checkAuth = useCallback(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard");
  }, [navigate]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const validateEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const saveSession = (data) => {
    // token separado
    if (data?.token) localStorage.setItem("token", data.token);

    // user completo (id, name, email, permissions...)
    const userObj = {
      id: data?.id ?? null,
      name: data?.name ?? "",
      email: data?.email ?? "",
      permissions: Array.isArray(data?.permissions) ? data.permissions : [],
      role: data?.role ?? null,
    };
    localStorage.setItem("user", JSON.stringify(userObj));

    // nome para o menu (fallback para email)
    localStorage.setItem("username", userObj.name || userObj.email || "Usuário");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (loading) return;

    // validações rápidas
    if (!email || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Por favor, insira um email válido.");
      return;
    }

    setLoading(true);
    try {
      const { data, status } = await api.post("/auth/login", { email, password });
      if (status === 200 && data) {
        saveSession(data);
        navigate("/dashboard");
      } else {
        setError(data?.message || "Erro desconhecido. Tente novamente.");
      }
    } catch (err) {
      const status = err.response?.status;
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
        {/* Coluna esquerda (formulário) */}
        <div className="login-form-column">
          <img src={logo} alt="Logo" className="login-logo" />
          <h1 className="form-title">Seja bem-vindo, insira seus dados.</h1>

          <form onSubmit={handleSubmit} noValidate>
            <div className="input-group">
              <label htmlFor="email">E-mail*</label>
              <input
                id="email"
                type="email"
                placeholder="Digite seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
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
                autoComplete="current-password"
              />
            </div>

            <a href="/forgot-password" className="forgot-password-link">
              Esqueci minha senha
            </a>

            {error && <p className="error-message">{error}</p>}

            <button type="submit" disabled={loading}>
              {loading ? <span className="spinner"></span> : "Entrar"}
            </button>
          </form>
        </div>

        {/* Coluna direita (info) */}
        <div className="login-info-column">
          <h2 className="info-title">LiveWork ERP</h2>
          <p className="info-subtitle">Plataforma de negócios, multitarefa.</p>
          <p className="info-text">
            Backoffice de ponta a ponta em serviços e sistemas para empresas de
            Crédito e Fomento Comercial: Factorings, Cias Securitizadoras,
            FIDCs e ESCs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
