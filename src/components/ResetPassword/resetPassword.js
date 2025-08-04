import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";
import "./resetPassword.css";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

const handleSubmit = async (e) => {
  e.preventDefault();

  if (password !== confirmPassword) {
    toast.error("As senhas não coincidem.");
    return;
  }

  try {
    await api.post("/auth/reset-password", {
      token,
      password,
      confirmPassword,
    });
    toast.success("Senha redefinida com sucesso!");
  } catch (error) {
    toast.error("Erro ao redefinir senha.");
  }
};

  return (
    <div className="reset-container">
      <form onSubmit={handleSubmit} className="reset-form">
        <h2>Redefinir Senha</h2>

        <input
          type="password"
          placeholder="Nova senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirmar nova senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button type="submit">Redefinir</button>
      </form>
    </div>
  );
}
