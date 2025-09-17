// src/components/clienteList/ClienteList.jsx
import React, { useEffect, useState } from "react";
import api from "../services/api";
import "./clienteList.css";
import { useNavigate } from "react-router-dom";
import Loading from "../ui/modal/Loading/Loading";

function parseClientesXml(xmlString) {
  const doc = new window.DOMParser().parseFromString(xmlString, "application/xml");
  const parserError = doc.getElementsByTagName("parsererror")[0];
  if (parserError) throw new Error("Falha ao ler XML.");

  const items = Array.from(doc.getElementsByTagName("item"));
  const getText = (parent, tag) =>
    parent.getElementsByTagName(tag)[0]?.textContent?.trim() ?? "";

  return items.map((item) => ({
    id: getText(item, "id"),
    clienteNome: getText(item, "clienteNome"),
    clienteRazao: getText(item, "clienteRazao"),
    clienteCnpjCpf: getText(item, "clienteCnpjCpf"),
    clienteEmail: getText(item, "clienteEmail"),
    clienteTelefone: getText(item, "clienteTelefone"),
    clienteCelular: getText(item, "clienteCelular"),
    clienteSituacao: getText(item, "clienteSituacao"),
  }));
}

export default function ClienteList() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);     // loading da lista
  const [error, setError] = useState("");
  const [navigating, setNavigating] = useState(false); // loading ao navegar

  const navigate = useNavigate();

  async function fetchClientes() {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/clientes", {
        headers: { Accept: "application/xml" },
        responseType: "text",
        transformResponse: [(data) => data],
      });
      const lista = parseClientesXml(res.data);
      setClientes(lista);
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
    // pequeno delay para o usuário ver o feedback antes da troca de rota
    setTimeout(() => navigate("/clientes/cadastrar"), 800);
  }

  if (loading) return <p>Carregando...</p>;
  if (error) return <p style={{ color: "crimson" }}>{error}</p>;

  return (
    <div className="cliente-list">
      {/* Overlay de navegação (carregamento ao clicar em Cadastrar) */}
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
            <tr key={c.id}>
              <td>{c.clienteNome}</td>
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
