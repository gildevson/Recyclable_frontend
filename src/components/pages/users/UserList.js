import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Importante!
import api from "../../services/api";
import Modal from "../../ui/modal/Modal";
import UserCreate from "./UserCreate";
import "./UserList.css";

const UserList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState(null);

  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const isAdmin = loggedInUser?.permissions?.some(
    (p) => typeof p === "object" && p.id === 1
  );

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      toast.error("Erro ao carregar lista de usuários.");
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Usuário excluído com sucesso!");
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (error) {
      console.error(error);

      if (error.response?.status === 403) {
        toast.error("Você não tem permissão para excluir este usuário.");
        // Não redireciona, apenas avisa
      } else {
        toast.error("Erro ao excluir usuário.");
      }
    } finally {
      setDeletingUserId(null);
    }
  };

  const getPermissionLabel = (user) => {
    if (!user.permissions || user.permissions.length === 0) {
      return "Sem permissões";
    }
    return user.permissions
      .map((p) => (typeof p === "object" ? p.description : p))
      .join(", ");
  };

  return (
    <div className="user-list-container">
      <div className="user-list-header">
        <h2>Lista de Usuários</h2>
        {isAdmin && (
          <button className="create-button" onClick={handleCreate}>
            <FaPlus /> Novo Usuário
          </button>
        )}
      </div>

      <table className="user-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Permissões</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{getPermissionLabel(user)}</td>
                <td className="action-buttons">
                  <button
                    className="action-button edit"
                    onClick={() => handleEdit(user.id)}
                    title="Alterar Usuário"
                  >
                    <FaEdit />
                  </button>
                  {isAdmin && loggedInUser?.id !== user.id && (
                    <button
                      className="action-button delete"
                      onClick={() => handleDelete(user.id)}
                      title="Excluir Usuário"
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
              <td colSpan="4">Nenhum usuário encontrado.</td>
            </tr>
          )}
        </tbody>
      </table>

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
  );
};

export default UserList;
