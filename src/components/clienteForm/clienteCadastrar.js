import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../clienteForm/clienteCadastrar.css";

export default function ClienteCadastrar() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    // Identificação
    consultaSerpro: false,
    clienteNome: "",
    clienteFantasia: "",
    clienteCnpjCpf: "",
    tipo: "Cliente",
    segmento: "",

    // Endereço
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",

    // Contato
    nomeContato: "",
    clienteEmail: "",
    clienteTelefone: "",
    telefone2: "",
    clienteCelular: "",

    // Situação
    clienteSituacao: "ATIVO",

    // Outros (exemplo)
    cadPro: "",
  });

  function onChange(e) {
    const { name, type, checked, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }

  function validar() {
    if (!form.clienteCnpjCpf.trim()) return "Informe o CPF/CNPJ.";
    if (!form.clienteNome.trim()) return "Informe o Nome.";
    return "";
  }

  async function onSubmit(e) {
    e.preventDefault();
    const msg = validar();
    if (msg) return setError(msg);

    try {
      setSaving(true);
      setError("");

      // ajuste o payload conforme seu backend
      await api.post("/clientes", {
        clienteNome: form.clienteNome,
        clienteCnpjCpf: form.clienteCnpjCpf,
        clienteEmail: form.clienteEmail,
        clienteTelefone: form.clienteTelefone,
        clienteCelular: form.clienteCelular,
        clienteSituacao: form.clienteSituacao,
        // campos extras se seu backend aceitar:
        fantasia: form.clienteFantasia,
        tipo: form.tipo,
        segmento: form.segmento,
        endereco: {
          cep: form.cep,
          logradouro: form.logradouro,
          numero: form.numero,
          complemento: form.complemento,
          bairro: form.bairro,
          cidade: form.cidade,
          estado: form.estado,
        },
        contato: {
          nome: form.nomeContato,
          telefone2: form.telefone2,
        },
        cadPro: form.cadPro,
        consultaSerpro: form.consultaSerpro,
      }, {
        headers: { "Content-Type": "application/json" },
      });

      navigate("/clientes");
    } catch (err) {
      console.error(err);
      setError("Não foi possível salvar o cliente.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page">
      {/* Barra de topo */}
      <div className="page-bar">
        <div className="left">
          <h1>Novo | Cliente</h1>
         
        </div>
        
      </div>

      <form className="card" onSubmit={onSubmit}>
        {/* Linha de tipo/segmento/documento */}
        <div className="grid grid-4 gap">
          <div className="field">
            <label>CPF/CNPJ *</label>
            <input
              name="clienteCnpjCpf"
              placeholder="CPF/CNPJ"
              value={form.clienteCnpjCpf}
              onChange={onChange}
            />
          </div>
          <div className="field">
            <label>Tipo</label>
            <select name="tipo" value={form.tipo} onChange={onChange}>
              <option>Cliente</option>
              <option>Fornecedor</option>
              <option>Parceiro</option>
            </select>
          </div>
          <div className="field">
            <label>Segmento</label>
            <input
              name="segmento"
              placeholder="Segmento"
              value={form.segmento}
              onChange={onChange}
            />
          </div>
          <div className="field">
            <label>Situação</label>
            <select
              name="clienteSituacao"
              value={form.clienteSituacao}
              onChange={onChange}
            >
              <option value="ATIVO">ATIVO</option>
              <option value="INATIVO">INATIVO</option>
            </select>
          </div>
        </div>

        <div className="divider" />

        {/* Cadastro */}
        <h2 className="section-title">Cadastro</h2>
        <div className="grid grid-4 gap">
          <div className="field col-span-2">
            <label>Nome *</label>
            <input
              name="clienteNome"
              placeholder="Nome completo"
              value={form.clienteNome}
              onChange={onChange}
            />
          </div>
          <div className="field col-span-2">
            <label>Fantasia</label>
            <input
              name="clienteFantasia"
              placeholder="Nome fantasia"
              value={form.clienteFantasia}
              onChange={onChange}
            />
          </div>
        </div>

        {/* Endereço */}
        <h2 className="section-title">Endereço</h2>
        <div className="grid grid-6 gap">
          <div className="field">
            <label>CEP</label>
            <input name="cep" value={form.cep} onChange={onChange} />
          </div>
          <div className="field col-span-2">
            <label>Logradouro</label>
            <input name="logradouro" value={form.logradouro} onChange={onChange} />
          </div>
          <div className="field">
            <label>Número</label>
            <input name="numero" value={form.numero} onChange={onChange} />
          </div>
          <div className="field">
            <label>Complemento</label>
            <input name="complemento" value={form.complemento} onChange={onChange} />
          </div>
          <div className="field">
            <label>Bairro</label>
            <input name="bairro" value={form.bairro} onChange={onChange} />
          </div>
          <div className="field col-span-2">
            <label>Cidade</label>
            <input name="cidade" value={form.cidade} onChange={onChange} />
          </div>
          <div className="field">
            <label>Estado</label>
            <select name="estado" value={form.estado} onChange={onChange}>
              <option value=""></option>
              {["AC","AL","AM","AP","BA","CE","DF","ES","GO","MA","MG","MS","MT","PA","PB","PE","PI","PR","RJ","RN","RO","RR","RS","SC","SE","SP","TO"].map(uf => (
                <option key={uf} value={uf}>{uf}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Contato */}
        <h2 className="section-title">Contato</h2>
        <div className="grid grid-4 gap">
          <div className="field col-span-2">
            <label>Nome do contato</label>
            <input name="nomeContato" value={form.nomeContato} onChange={onChange} />
          </div>
          <div className="field col-span-4">
            <label>E-mail</label>
            <input
              name="clienteEmail"
              type="email"
              value={form.clienteEmail}
              onChange={onChange}
            />
          </div>
          <div className="field">
            <label>Telefone 1</label>
            <input name="clienteTelefone" value={form.clienteTelefone} onChange={onChange} />
          </div>
          <div className="field">
            <label>Telefone 2</label>
            <input name="telefone2" value={form.telefone2} onChange={onChange} />
          </div>
          <div className="field">
            <label>Celular</label>
            <input name="clienteCelular" value={form.clienteCelular} onChange={onChange} />
          </div>
        </div>

        {/* Outros dados */}
        <h2 className="section-title">Outros dados</h2>
        <div className="grid grid-4 gap">
          <div className="field">
            <label>CAD/PRO</label>
            <input name="cadPro" value={form.cadPro} onChange={onChange} />
          </div>
        </div>

        {error && <p className="error">{error}</p>}

        <div className="form-actions">
          <button type="submit" className="btn primary" disabled={saving}>
            {saving ? "Salvando..." : "Salvar"}
          </button>
          <button type="button" className="btn" onClick={() => navigate("/clientes")}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
