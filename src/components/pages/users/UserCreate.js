import React, { useState, useEffect } from "react";
import api from "../../services/api";
import "./UserList.css";
import { toast } from "react-toastify";

const UserCreate = ({ onClose, onUserCreated }) => { // desempenho
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [permissionId, setPermissionId] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [canCreate, setCanCreate] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const hasPermission = user?.permissions?.some(
      (p) => typeof p === "object" && p.id === 1
    );
    setCanCreate(hasPermission);

    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token; // ajuste conforme você salva o token

      const response = await api.get("/permissions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Permissões carregadas:", response.data);
      setPermissions(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Erro ao buscar permissões:", error);
      setPermissions([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!canCreate) {
      alert("Você não tem permissão para criar usuários.");
      return;
    }

    if (password !== confirmPassword) {
      alert("As senhas não coincidem.");
      return;
    }

    const payload = {
      name,
      email,
      password,
      permission_id: Number(permissionId), // garantir número
    };

    console.log("Enviando payload:", {...payload, password: "******"}); // não exibir senha no log

    try {
      await api.post("/users/register", payload);
      toast.success("Usuário criado com sucesso!");
      onUserCreated();
      onClose();
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        typeof error.response.data === "string" &&
        error.response.data.includes("Email já cadastrado")
      ) {
        toast.error("Erro: o e-mail informado já está em uso.");
      } else {
        toast.error("Erro ao criar usuário.");
      }
      console.error("Erro ao criar usuário:", error);
    }
  };

  if (!canCreate) {
    return (
      <div className="modal-content">
        <h2>Permissão Negada</h2>
        <p>Você não tem permissão para criar novos usuários.</p>
        <button onClick={onClose} className="cancel-button">
          Fechar
        </button>
      </div>
    );
  }

  return (
    <div className="modal-content">
      <h2>Criar Usuário</h2>
      <form onSubmit={handleSubmit}>
        <label>Nome:</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label>Email:</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Senha:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label>Confirme a Senha:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <label>Permissão:</label>
        <select
          value={permissionId}
          onChange={(e) => setPermissionId(e.target.value)}
          required
        >
          <option value="">Selecione a permissão</option>
          {permissions.map((p) => (
            <option key={p.id} value={p.id}>
              {p.id} - {(p.description || "").trim()}
            </option>
          ))}
        </select>

        <div
          style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}
        >
          <button type="submit" className="create-button">
            Salvar
          </button>
          <button type="button" className="cancel-button" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserCreate;
