import React, { useState, useEffect } from "react";
import api from "../../services/api";
import "./UserList.css";

const UserCreate = ({ onClose, onUserCreated }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Novo estado
  const [permissionId, setPermissionId] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [canCreate, setCanCreate] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const hasPermission = user?.permissions?.some(p => typeof p === "object" && p.id === 1);
    setCanCreate(hasPermission);

    const fetchPermissions = async () => {
      try {
        const response = await api.get("/permissions");
        const data = Array.isArray(response.data) ? response.data : [];
        console.log("Permissões carregadas:", data);
        setPermissions(data);
      } catch (error) {
        console.error("Erro ao buscar permissões:", error);
        setPermissions([]);
      }
    };

    fetchPermissions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!canCreate) {
      return alert("Você não tem permissão para criar usuários.");
    }

    if (password !== confirmPassword) {
      return alert("As senhas não coincidem.");
    }

    try {
      await api.post("/users/register", {
        name,
        email,
        password,
        permission_id: permissionId
      });
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

        <label>Confirme a Senha:</label>
        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />

        <label>Permissão:</label>
        <select
          value={permissionId}
          onChange={(e) => setPermissionId(Number(e.target.value))}
          required
        >
          <option value="">Selecione a permissão</option>
          <option value={1}>Permissão total</option>
          <option value={0}>Permissão limitada</option>
        </select>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
          <button type="submit" className="create-button">Salvar</button>
          <button type="button" className="cancel-button" onClick={onClose}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default UserCreate;