import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";
import "./forgotPassword.css";
import Loading from "../ui/modal/Loading/Loading";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Limpa flag ao entrar na tela
  useEffect(() => {
    sessionStorage.removeItem("fromForgotPassword");
  }, []);

  // Detecta clique na seta de voltar do navegador
  useEffect(() => {
    const handlePopState = () => {
      sessionStorage.setItem("fromForgotPassword", "true"); // marca que foi navegado para trás
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Envia solicitação de redefinição de senha
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      toast.success("Link enviado para seu e-mail!");
    } catch (error) {
      toast.error("Erro ao solicitar recuperação de senha.");
    } finally {
      setLoading(false);
    }
  };

  // Exibe tela de carregamento
  if (loading) return <Loading />;

  return (
    <form onSubmit={handleSubmit} className="forgot-container">
      <h2>Esqueci minha senha</h2>
      <input
        type="email"
        placeholder="Digite seu email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit">Enviar link</button>

      <button
        type="button"
        className="voltar-botao"
        onClick={() => {
          setLoading(true);
          sessionStorage.setItem("fromForgotPassword", "true");
          setTimeout(() => {
            window.history.back(); // navegador volta naturalmente
          }, 800); // opcional: tempo de loading
        }}
      >
        Voltar
      </button>
    </form>
  );
}
