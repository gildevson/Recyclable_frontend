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

  // Verifica se o usuário tem permissão para criar usuários
  const canCreateUser = user?.permissions?.some(p => typeof p === "object" && p.id === 1);

  // Carrega a lista de usuários ao montar o componente
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users");
      console.log("Usuários recebidos:", response.data);
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
        fetchUsers(); // Atualiza a lista após deletar
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
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  {user.permissions && user.permissions.length > 0
                    ? user.permissions.map(p => p.description || p).join(", ")
                    : "Sem permissões"}
                </td>
                <td className="action-buttons">
                  <button
                    className="action-button edit"
                    onClick={() => handleEdit(user.id)}
                    title="Alterar Usuário"
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="action-button delete"
                    onClick={() => handleDelete(user.id)}
                    title="Excluir Usuário"
                  >
                    <FaTrash />
                  </button>
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

      {/* Modal para criação de usuário */}
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
