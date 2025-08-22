import React, { useEffect, useState, useMemo } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";
import Modal from "../../ui/modal/Modal";
import UserCreate from "../userCreate/UserCreate";
import "./UserList.css";

/** helper admin */
function hasAdminPermission(user) {
  if (!user) return false;
  const role = String(user.role || "").toUpperCase();
  if (role === "ADMIN") return true;
  const perms = user.permissions;
  if (!Array.isArray(perms)) return false;
  if (perms.some(p => typeof p === "object" && (p.id === 1 || String(p.description || "").toUpperCase().includes("ADMIN")))) return true;
  if (perms.some(p => typeof p === "number" && p === 1)) return true;
  if (perms.some(p => typeof p === "string" && p.toUpperCase().includes("ADMIN"))) return true;
  return false;
}

const PAGE_SIZE = 11;

const UserList = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [loading, setLoading] = useState(false);

  // paginação
  const [page, setPage] = useState(1);

  const loggedInUser = (() => {
    try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
  })();
  const isAdmin = hasAdminPermission(loggedInUser);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/users", {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const data = Array.isArray(response.data) ? response.data : (response.data?.users || []);
      setUsers(data);
      setPage(1); // volta pra primeira página ao recarregar
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      toast.error("Erro ao carregar lista de usuários.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => setShowModal(true);
  const handleEdit = (userId) => navigate(`/users/edit/${userId}`);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir este usuário?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");
    setDeletingUserId(id);

    try {
      await api.delete(`/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Usuário excluído com sucesso!");
      setUsers((prev) => {
        const next = prev.filter((u) => u.id !== id);
        // ajusta página se a atual ficar vazia
        const totalPagesAfter = Math.max(1, Math.ceil(next.length / PAGE_SIZE));
        setPage((p) => Math.min(p, totalPagesAfter));
        return next;
      });
    } catch (error) {
      console.error(error);
      if (error.response?.status === 403) {
        toast.error("Você não tem permissão para excluir este usuário.");
      } else if (error.response?.status === 401) {
        toast.error("Sessão expirada. Faça login novamente.");
      } else {
        toast.error("Erro ao excluir usuário.");
      }
    } finally {
      setDeletingUserId(null);
    }
  };

  const getPermissionLabel = (user) => {
    const perms = user?.permissions;
    if (!Array.isArray(perms) || perms.length === 0) return "Sem permissões";
    return perms
      .map((p) => {
        if (typeof p === "object") return (p.description || `ID ${p.id || "?"}`).toString();
        if (typeof p === "number") return `ID ${p}`;
        return String(p);
      })
      .join(", ");
  };

  // paginação calculada
  const totalPages = useMemo(() => Math.max(1, Math.ceil(users.length / PAGE_SIZE)), [users.length]);
  const pageStart = (page - 1) * PAGE_SIZE;
  const pageUsers = useMemo(() => users.slice(pageStart, pageStart + PAGE_SIZE), [users, pageStart]);

  const goToPage = (p) => setPage(Math.min(Math.max(1, p), totalPages));
  const nextPage = () => goToPage(page + 1);
  const prevPage = () => goToPage(page - 1);

  // opcional: render números de página (simples, com elipses se quiser)
  const renderPageNumbers = () => {
    const pages = [];
    const maxShown = 5; // total de botões numéricos visíveis
    let start = Math.max(1, page - Math.floor(maxShown / 2));
    let end = Math.min(totalPages, start + maxShown - 1);
    if (end - start + 1 < maxShown) start = Math.max(1, end - maxShown + 1);

    if (start > 1) {
      pages.push(<button key={1} onClick={() => goToPage(1)} className={`page-btn ${page === 1 ? "active" : ""}`}>1</button>);
      if (start > 2) pages.push(<span key="start-ellipsis" className="page-ellipsis">…</span>);
    }
    for (let p = start; p <= end; p++) {
      pages.push(
        <button
          key={p}
          onClick={() => goToPage(p)}
          className={`page-btn ${page === p ? "active" : ""}`}
          aria-current={page === p ? "page" : undefined}
        >
          {p}
        </button>
      );
    }
    if (end < totalPages) {
      if (end < totalPages - 1) pages.push(<span key="end-ellipsis" className="page-ellipsis">…</span>);
      pages.push(
        <button
          key={totalPages}
          onClick={() => goToPage(totalPages)}
          className={`page-btn ${page === totalPages ? "active" : ""}`}
        >
          {totalPages}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="has-sidebar">
      <div className="user-list-container">
        <div className="user-list-header">
          <h2>Lista de Usuários</h2>

          {isAdmin && (
            <button
              className="create-button"
              onClick={handleCreate}
              aria-label="Criar novo usuário"
              disabled={loading}
            >
              <FaPlus /> Novo Usuário
            </button>
          )}
        </div>

        <table className="user-table" aria-label="Lista de usuários">
          <caption className="sr-only">
            Tabela de usuários com nome, email, permissões e ações
          </caption>
          <thead>
            <tr>
              <th scope="col">Nome</th>
              <th scope="col">Email</th>
              <th scope="col" className="col-permissions">Permissões</th>
              <th scope="col">Ações</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" data-label="Carregando">Carregando...</td>
              </tr>
            ) : pageUsers.length > 0 ? (
              pageUsers.map((user) => (
                <tr key={user.id}>
                  <td data-label="Nome">{user.name}</td>
                  <td data-label="Email" title={user.email}>{user.email}</td>
                  <td data-label="Permissões" className="col-permissions">{getPermissionLabel(user)}</td>
                  <td data-label="Ações" className="action-buttons">
                    <button
                      className="action-button edit"
                      onClick={() => handleEdit(user.id)}
                      title="Alterar Usuário"
                      aria-label={`Editar usuário ${user.name}`}
                    >
                      <FaEdit />
                    </button>
                    {isAdmin && loggedInUser?.id !== user.id && (
                      <button
                        className="action-button delete"
                        onClick={() => handleDelete(user.id)}
                        title="Excluir Usuário"
                        aria-label={`Excluir usuário ${user.name}`}
                        disabled={deletingUserId === user.id}
                      >
                        {deletingUserId === user.id ? "Excluindo..." : <FaTrash />}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" data-label="Mensagem">Nenhum usuário encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Controles de paginação */}
        {!loading && users.length > 0 && (
          <div className="pagination">
            <span className="pagination-info">
              Página {page} de {totalPages} — mostrando {pageUsers.length} de {users.length}
            </span>
            <div className="pagination-controls" role="navigation" aria-label="Paginação da lista de usuários">
              <button className="page-btn" onClick={() => goToPage(1)} disabled={page === 1} aria-label="Primeira página">«</button>
              <button className="page-btn" onClick={prevPage} disabled={page === 1} aria-label="Página anterior">‹</button>
              {renderPageNumbers()}
              <button className="page-btn" onClick={nextPage} disabled={page === totalPages} aria-label="Próxima página">›</button>
              <button className="page-btn" onClick={() => goToPage(totalPages)} disabled={page === totalPages} aria-label="Última página">»</button>
            </div>
          </div>
        )}

        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <UserCreate
            onUserCreated={() => {
              setShowModal(false);
              fetchUsers();
            }}
            onClose={() => setShowModal(false)}
          />
        </Modal>
      </div>
    </div>
  );
};

export default UserList;
