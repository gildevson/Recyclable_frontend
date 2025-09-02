
// src/components/clienteList/ClienteList.jsx
import React, { useEffect, useState } from "react";
import api from "../services/api";

function parseClientesXml(xmlString) {
  const doc = new window.DOMParser().parseFromString(xmlString, "application/xml");

  // Checa erro de parsing
  const parserError = doc.getElementsByTagName("parsererror")[0];
  if (parserError) throw new Error("Falha ao ler XML.");

  const items = Array.from(doc.getElementsByTagName("item"));

  const getText = (parent, tag) =>
    parent.getElementsByTagName(tag)[0]?.textContent?.trim() ?? "";

  return items.map((item) => ({
    id: getText(item, "id"),
    clienteNome: getText(item, "clienteNome"),
    clienteCnpj: getText(item, "clienteCnpj"),
    clienteEmail: getText(item, "clienteEmail"),
    clienteTelefone: getText(item, "clienteTelefone"),
    clienteCelular: getText(item, "clienteCelular"),
    createdAt: getText(item, "createdAt"),
  }));
}

export default function ClienteList() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchClientes() {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/clientes", {
        // garante que o backend devolva XML (se negocia conteúdo)
        headers: { Accept: "application/xml" },
        // axios não tenta parsear; devolve string
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

  if (loading) return <p>Carregando...</p>;
  if (error) return <p style={{ color: "crimson" }}>{error}</p>;

  return (
    <div>
      <h2>Clientes</h2>
      <button onClick={fetchClientes}>Recarregar</button>

      <table style={{ width: "100%", marginTop: 12, borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left" }}>Nome</th>
            <th style={{ textAlign: "left" }}>CNPJ</th>
            <th style={{ textAlign: "left" }}>Email</th>
            <th style={{ textAlign: "left" }}>Telefone</th>
            <th style={{ textAlign: "left" }}>Celular</th>
            <th style={{ textAlign: "left" }}>Criado em</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((c) => (
            <tr key={c.id}>
              <td>{c.clienteNome}</td>
              <td>{c.clienteCnpj}</td>
              <td>{c.clienteEmail}</td>
              <td>{c.clienteTelefone}</td>
              <td>{c.clienteCelular}</td>
              <td>{c.createdAt}</td>
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
