import React, { useState, useEffect } from "react";
import api from "../../services/api";// <- use um CSS dedicado ao create (opcional)
import { toast } from "react-toastify";

/** Detecta permissão de admin em formatos comuns:
 * - objetos: [{ id: 1, description: 'ADMIN' }]
 * - números: [1, 2, ...]
 * - strings: ['ADMIN', 'USER']
 * - fallback por role: user.role === 'ADMIN'
 */
function hasAdminPermission(user) {
  if (!user) return false;

  const role = String(user.role || "").toUpperCase();
  if (role === "ADMIN") return true;

  const perms = user.permissions;
  if (!Array.isArray(perms)) return false;

  if (perms.some(p => typeof p === "object" && (p.id === 1 || String(p.description || "").toUpperCase().includes("ADMIN")))) {
    return true;
  }
  if (perms.some(p => typeof p === "number" && p === 1)) return true;
  if (perms.some(p => typeof p === "string" && p.toUpperCase().includes("ADMIN"))) return true;

  return false;
}

const UserCreate = ({ onClose, onUserCreated }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [permissionId, setPermissionId] = useState("");
  const [permissions, setPermissions] = useState([]);

  const [canCreate, setCanCreate] = useState(false);
  const [loadingPerms, setLoadingPerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setCanCreate(hasAdminPermission(user));
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    setLoadingPerms(true);
    try {
      const token = localStorage.getItem("token");
      const resp = await api.get("/permissions", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = Array.isArray(resp.data)
        ? resp.data
        : (resp.data?.permissions || []);

      setPermissions(data);

      // define a primeira permissão como padrão (se ainda não tiver selecionado)
      if (!permissionId && data.length > 0) {
        setPermissionId(Number(data[0].id));
      }
    } catch (error) {
      console.error("Erro ao buscar permissões:", error);
      setPermissions([]);
      toast.error("Não foi possível carregar as permissões.");
    } finally {
      setLoadingPerms(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return; // evita duplo submit

    if (!canCreate) {
      toast.error("Você não tem permissão para criar usuários.");
      return;
    }

    const nm = name.trim();
    const em = email.trim();

    if (!nm || !em || !permissionId) {
      toast.error("Preencha nome, e-mail e permissão.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
      toast.error("E-mail inválido.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }

    const payload = {
      name: nm,
      email: em,
      password,
      permission_id: Number(permissionId), // garantir número
    };

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      await api.post("/users/register", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Usuário criado com sucesso!");

      // reseta o formulário (opcional)
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      onUserCreated?.();
      onClose?.();
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      const msg = error?.response?.data;

      if (typeof msg === "string" && msg.includes("Email já cadastrado")) {
        toast.error("Erro: o e-mail informado já está em uso.");
      } else if (error?.response?.status === 401) {
        toast.error("Sessão expirada. Faça login novamente.");
      } else if (error?.response?.status === 403) {
        toast.error("Sem permissão para criar usuários.");
      } else {
        toast.error("Erro ao criar usuário.");
      }
    } finally {
      setSubmitting(false);
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

      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="name">Nome:</label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="name"
        />

        <label htmlFor="email">Email:</label>
        <input
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          type="email"
          autoComplete="email"
        />

        <label htmlFor="pwd">Senha:</label>
        <input
          id="pwd"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
        />

        <label htmlFor="pwd2">Confirme a Senha:</label>
        <input
          id="pwd2"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          autoComplete="new-password"
        />

        <label htmlFor="perm">Permissão:</label>
        <select
          id="perm"
          value={permissionId}
          onChange={(e) => setPermissionId(Number(e.target.value))}  // <- já converte
          required
          disabled={loadingPerms}
        >
          <option value="">Selecione a permissão</option>
          {permissions.map((p) => (
            <option key={p.id} value={p.id}>
              {p.id} - {(p.description || "").trim()}
            </option>
          ))}
        </select>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
          <button type="submit" className="create-button" disabled={submitting || loadingPerms}>
            {submitting ? "Salvando..." : "Salvar"}
          </button>
          <button type="button" className="cancel-button" onClick={onClose} disabled={submitting}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserCreate;
