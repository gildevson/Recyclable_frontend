// src/pages/users/UserList.js
import React, { useEffect, useState } from "react";
import axios from "axios"; // ou use seu `api.js` se já tiver configurado
import "./UserList.css";

const UserList = () => {
  const [users, setUsers] = useState([]);

  // Buscar os dados dos usuários
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/users"); // Altere a URL se necessário
        setUsers(response.data);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="user-list-container">
      <h2>Lista de Usuários</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Permissão</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.nome}</td>
              <td>{user.email}</td>
              <td>{user.permissao}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
