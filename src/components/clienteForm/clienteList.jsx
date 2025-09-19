// src/components/clienteList/ClienteList.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";          // ← sobe duas pastas até src/services/api
import "./clienteList.css";

export default function ClienteList() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [navigating, setNavigating] = useState(false);

  const navigate = useNavigate();

  async function fetchClientes() {
    try {
      setLoading(true);
      setError("");
      // Spring retorna JSON (ClienteResponseDTO[])
      const { data } = await api.get("/clientes", {
        headers: { Accept: "application/json" },
      });
      setClientes(data);
    } catch (e) {
      console.error(e);
      setError("Não foi possível carregar clientes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchClientes();
  }, []);

  function handleCadastrarClick() {
    setNavigating(true);
    setTimeout(() => navigate("/clientes/cadastrar"), 800);
  }

  if (loading) return <p>Carregando...</p>;
  if (error) return <p style={{ color: "crimson" }}>{error}</p>;

  return (
    <div className="cliente-list">
      {navigating && (
        <div className="overlay-loading" role="status" aria-live="polite">
          <div className="spinner" />
          <p>Abrindo tela de cadastro...</p>
        </div>
      )}

      <div className="list-bar">
        <h2>Clientes</h2>
        <div className="actions">
          <button onClick={fetchClientes} className="btn-outline">Recarregar</button>
          <button onClick={handleCadastrarClick} className="btn-primary">Cadastrar Cliente</button>
        </div>
      </div>

      <table className="cliente-table">
        <thead>
          <tr>
            <th style={{ textAlign: "left" }}>Nome</th>
            <th style={{ textAlign: "left" }}>CNPJ/CPF</th>
            <th style={{ textAlign: "left" }}>Email</th>
            <th style={{ textAlign: "left" }}>Telefone</th>
            <th style={{ textAlign: "left" }}>Celular</th>
            <th style={{ textAlign: "left" }}>Situação</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((c) => (
            <tr key={c.clienteId}>
              <td>
                <Link className="linklike" to={`/clientes/${c.clienteId}/editar`}>
                  {c.clienteNome}
                </Link>
              </td>
              <td>{c.clienteCnpjCpf}</td>
              <td>{c.clienteEmail}</td>
              <td>{c.clienteTelefone}</td>
              <td>{c.clienteCelular}</td>
              <td>{c.clienteSituacao}</td>
            </tr>
          ))}
          {!clientes.length && (
            <tr>
              <td colSpan="6">Nenhum cliente encontrado.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
