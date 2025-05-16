import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/users')
      .then(response => {
        console.log("Usuários recebidos:", response.data); // 👈 debug
        setUsers(response.data);
      })
      .catch(error => console.error("Erro ao buscar usuários:", error));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Lista de Usuários</h2>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr><td colSpan="2">Nenhum usuário encontrado.</td></tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
