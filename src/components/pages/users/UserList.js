import React, { useEffect, useState } from "react";
// Importa os ícones de edição, lixeira e adição
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa'; 
import "./UserList.css"; // Estilos para a lista de usuários
import api from "../../services/api"; // Serviço de API para requisições HTTP

/**
 * Componente UserList
 * Exibe uma lista de usuários obtidos de uma API, com ações de criar, alterar e excluir.
 */
const UserList = () => {
  // Estado para armazenar a lista de usuários
  const [users, setUsers] = useState([]);

  // useEffect para buscar os usuários quando o componente for montado
  useEffect(() => {
    /**
     * Função assíncrona para buscar os dados dos usuários.
     */
    const fetchUsers = async () => {
      try {
        // Faz a requisição GET para a rota '/users' da API
        const response = await api.get("/users");
        // Assumindo que a resposta de permissões é um array de objetos com 'description'
        // Se 'permissions' for apenas um array de strings (ex: ["TOTAL", "ADMIN"]), a linha do .map(p => p.description) não seria necessária.
        // Pelo seu screenshot anterior, parece que a permissão é um objeto com 'description'.
        setUsers(response.data);
      } catch (error) {
        // Em caso de erro na requisição, loga o erro no console
        console.error("Erro ao buscar usuários:", error);
        // Aqui você poderia adicionar um estado para exibir uma mensagem de erro ao usuário
      }
    };

    // Chama a função de busca de usuários
    fetchUsers();
  }, []); // O array vazio [] garante que o useEffect rode apenas uma vez, no montagem do componente

  // Função para lidar com a criação de um novo usuário
  const handleCreate = () => {
    alert("Funcionalidade de Criar Usuário. Implemente a navegação para um formulário de criação.");
    // Ex: navigate('/users/new');
  };

  // Funções para lidar com as ações de Alterar e Excluir
  const handleEdit = (userId) => {
    alert(`Funcionalidade de Editar Usuário com ID: ${userId}.`);
    // Ex: navigate(`/users/edit/${userId}`);
  };

  const handleDelete = (userId) => {
    if (window.confirm(`Tem certeza que deseja excluir o usuário com ID: ${userId}?`)) {
      alert(`Funcionalidade de Excluir Usuário com ID: ${userId}.`);
      // Ex: Chamar a API de exclusão e, em seguida, recarregar a lista de usuários
      // try {
      //   await api.delete(`/users/${userId}`);
      //   fetchUsers(); // Recarrega a lista após a exclusão
      // } catch (error) {
      //   console.error("Erro ao excluir usuário:", error);
      //   alert("Erro ao excluir usuário.");
      // }
    }
  };

  return (
    <div className="user-list-container">
      <div className="user-list-header"> {/* Novo container para título e botão */}
        <h2>Lista de Usuários</h2>
        <button className="create-button" onClick={handleCreate}>
          <FaPlus /> Novo Usuário
        </button>
      </div>
      
      <table className="user-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Permissões</th>
            <th>Ações</th> {/* Coluna para os botões de ação */}
          </tr>
        </thead>
        <tbody>
          {/* Mapeia o array de usuários para criar uma linha (tr) para cada um */}
          {users.map((user) => (
            <tr key={user.id}> {/* 'key' é importante para a performance do React em listas */}
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                {/* Lógica de permissões: exibe a descrição se for um objeto, senão o nome */}
                {
                  user.permissions && user.permissions.length > 0
                    ? user.permissions.map(p => p.description || p).join(", ") 
                    : "Sem permissões"
                }
              </td>
              <td className="action-buttons"> {/* Célula para os botões de ação */}
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
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
