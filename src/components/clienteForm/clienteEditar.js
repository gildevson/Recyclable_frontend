// src/components/clienteForm/ClienteEditar.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api"; // ⬅️ ajuste o caminho conforme a pasta real

export default function ClienteEditar() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    clienteNome: "",
    clienteRazao: "",
    clienteCnpjCpf: "",
    clienteEmail: "",
    clienteTelefone: "",
    clienteCelular: "",
    clienteSituacao: "ATIVO",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setError("");
        console.log("➡️ Carregando cliente id:", id);
        const { data } = await api.get(`/clientes/${id}`, {
          headers: { Accept: "application/json" },
        });
        console.log("✅ Cliente carregado:", data);
        setForm({
          clienteNome: data.clienteNome ?? "",
          clienteRazao: data.clienteRazao ?? "",
          clienteCnpjCpf: data.clienteCnpjCpf ?? "",
          clienteEmail: data.clienteEmail ?? "",
          clienteTelefone: data.clienteTelefone ?? "",
          clienteCelular: data.clienteCelular ?? "",
          clienteSituacao: data.clienteSituacao ?? "ATIVO",
        });
      } catch (e) {
        const status = e?.response?.status;
        console.error("❌ GET /clientes/:id falhou:", status, e?.response?.data);
        if (status === 404) setError("Cliente não encontrado.");
        else if (status === 401) setError("Sessão expirada. Entre novamente.");
        else setError("Não foi possível carregar o cliente.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");

      // opcional: remove espaços extras
      const payload = Object.fromEntries(
        Object.entries(form).map(([k, v]) => [k, typeof v === "string" ? v.trim() : v])
      );

      const { data } = await api.put(`/clientes/${id}`, payload, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("✅ PUT salvo:", data);
      navigate("/clientes");
    } catch (e) {
      const status = e?.response?.status;
      const backendMsg = e?.response?.data;
      console.error("❌ PUT /clientes/:id falhou:", status, backendMsg);

      if (status === 409) {
        setError(typeof backendMsg === "string" ? backendMsg : "CNPJ já cadastrado.");
      } else if (status === 400) {
        const msg =
          typeof backendMsg === "string"
            ? backendMsg
            : backendMsg?.message || "Dados inválidos. Verifique os campos.";
        setError(msg);
      } else if (status === 403) {
        setError("Acesso negado (403). Verifique CSRF/CORS no backend.");
      } else if (status === 404) {
        setError("Cliente não encontrado.");
      } else {
        setError("Falha ao salvar alterações.");
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="page">
      <h2>Editar Cliente</h2>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      <form className="card" onSubmit={onSubmit}>
        <div className="field">
          <label>Nome*</label>
          <input name="clienteNome" value={form.clienteNome} onChange={onChange} required />
        </div>
        <div className="field">
          <label>Razão Social</label>
          <input name="clienteRazao" value={form.clienteRazao} onChange={onChange} />
        </div>
        <div className="field">
          <label>CNPJ/CPF*</label>
          <input name="clienteCnpjCpf" value={form.clienteCnpjCpf} onChange={onChange} required />
        </div>
        <div className="field">
          <label>Email</label>
          <input type="email" name="clienteEmail" value={form.clienteEmail} onChange={onChange} />
        </div>
        <div className="field">
          <label>Telefone</label>
          <input name="clienteTelefone" value={form.clienteTelefone} onChange={onChange} />
        </div>
        <div className="field">
          <label>Celular</label>
          <input name="clienteCelular" value={form.clienteCelular} onChange={onChange} />
        </div>
        <div className="field">
          <label>Situação</label>
          <select name="clienteSituacao" value={form.clienteSituacao} onChange={onChange}>
            <option value="ATIVO">ATIVO</option>
            <option value="INATIVO">INATIVO</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" onClick={() => navigate(-1)} className="btn-outline">Cancelar</button>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </div>
  );
}
