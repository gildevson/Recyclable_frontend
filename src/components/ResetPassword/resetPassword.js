// ResetPassword.js
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token");

  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/reset-password", { token, password });
      toast.success("Senha redefinida com sucesso!");
    } catch (error) {
      toast.error("Erro ao redefinir senha.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Redefinir senha</h2>
      <input
        type="password"
        placeholder="Nova senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Redefinir</button>
    </form>
  );
}
