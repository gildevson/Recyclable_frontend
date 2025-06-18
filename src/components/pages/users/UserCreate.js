// src/components/pages/users/UserCreate.js
import React, { useState, useEffect } from "react";
import api from "../../services/api";
import "./UserList.css";

const UserCreate = ({ onClose, onUserCreated }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [canCreate, setCanCreate] = useState(true);

  useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user"));
  const hasPermission = user?.permissions?.some(p => {
    if (typeof p === "object") {
      return p.id === 1;
    }
    return false;
  });
  setCanCreate(hasPermission);
}, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canCreate) return alert("Você não tem permissão para criar usuários.");
    try {
      await api.post("/users", { name, email, password });
      alert("Usuário criado com sucesso!");
      onUserCreated();
      onClose();
    } catch (err) {
      console.error("Erro ao criar usuário", err);
      alert("Erro ao criar usuário.");
    }
  };

  if (!canCreate) {
    return (
      <div className="modal-content">
        <h2>Permissão Negada</h2>
        <p>Você não tem permissão para criar novos usuários.</p>
        <button onClick={onClose} className="cancel-button">Fechar</button>
      </div>
    );
  }

  return (
    <div className="modal-content">
      <h2>Criar Usuário</h2>
      <form onSubmit={handleSubmit}>
        <label>Nome:</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required />

        <label>Email:</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>Senha:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
          <button type="submit" className="create-button">Salvar</button>
          <button type="button" className="cancel-button" onClick={onClose}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default UserCreate;
