import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa'; 
import "./UserList.css";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import Modal from "../../ui/modal/Modal";
import UserCreate from "./UserCreate";

const UserList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Recupera o usuário logado
  const user = JSON.parse(localStorage.getItem("user"));

  // Verifica se o usuário tem permissão
const canCreateUser = user?.permissions?.some(p => {
  if (typeof p === "object") {
    return p.id === 1;
  }
  return false;
});

// ✅ Agora sim o useEffect está sendo usado
useEffect(() => {
  fetchUsers();
}, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  };

  const handleCreate = () => {
    setShowModal(true);
  };

  const handleEdit = (userId) => {
    navigate(`/users/edit/${userId}`);
  };

  const handleDelete = async (userId) => {
    if (window.confirm(`Tem certeza que deseja excluir o usuário com ID: ${userId}?`)) {
      try {
        await api.delete(`/users/${userId}`);
        fetchUsers();
      } catch (error) {
        console.error("Erro ao excluir usuário:", error);
        alert("Erro ao excluir usuário.");
      }
    }
  };

  return (
    <div className="user-list-container">
      <div className="user-list-header">
        <h2>Lista de Usuários</h2>
        {canCreateUser && (
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
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                {
                  user.permissions && user.permissions.length > 0
                    ? user.permissions.map(p => p.description || p).join(", ") 
                    : "Sem permissões"
                }
              </td>
              <td className="action-buttons">
                <button className="action-button edit" onClick={() => handleEdit(user.id)} title="Alterar Usuário">
                  <FaEdit />
                </button>
                <button className="action-button delete" onClick={() => handleDelete(user.id)} title="Excluir Usuário">
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal para criação */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <UserCreate onSuccess={() => {
          setShowModal(false);
          fetchUsers(); // Recarrega a lista após cadastro
        }} />
      </Modal>
    </div>
  );
};

export default UserList;
