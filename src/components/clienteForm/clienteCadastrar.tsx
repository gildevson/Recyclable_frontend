import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api"; // <- AJUSTADO (está em src/services/api.js)
import "../clienteForm/clienteCadastrar.css";

// Tipagem do formulário
interface ClienteForm {
  // Identificação
  consultaSerpro: boolean;
  clienteNome: string;
  clienteRazao: string;
  clienteFantasia: string;
  clienteCnpjCpf: string;
  tipo: "Cliente" | "Fornecedor" | "Parceiro";
  segmento: string;

  // Endereço
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;

  // Contato
  nomeContato: string;
  clienteEmail: string;
  clienteTelefone: string;
  telefone2: string;
  clienteCelular: string;

  // Situação
  clienteSituacao: "ATIVO" | "INATIVO";

  // Outros
  cadPro: string;
}

export default function ClienteCadastrar() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [form, setForm] = useState<ClienteForm>({
    consultaSerpro: false,
    clienteNome: "",
    clienteRazao: "",
    clienteFantasia: "",
    clienteCnpjCpf: "",
    tipo: "Cliente",
    segmento: "",

    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",

    nomeContato: "",
    clienteEmail: "",
    clienteTelefone: "",
    telefone2: "",
    clienteCelular: "",

    clienteSituacao: "ATIVO",
    cadPro: "",
  });

  // Handler para inputs (inclui checkbox)
  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    const t = e.currentTarget;
    const { name, type, value } = t;
    const val = type === "checkbox" ? t.checked : value;

    setForm((prev) => ({ ...prev, [name]: val }));
  }

  // Handler para selects
  function onSelectChange(e: ChangeEvent<HTMLSelectElement>) {
    const { name, value } = e.currentTarget;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validar(): string {
    if (!form.clienteCnpjCpf.trim()) return "Informe o CPF/CNPJ.";
    if (!form.clienteNome.trim()) return "Informe o Nome.";
    return "";
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const msg = validar();
    if (msg) return setError(msg);

    try {
      setSaving(true);
      setError("");

      await api.post(
        "/clientes",
        {
          clienteNome: form.clienteNome,
          clienteRazao: form.clienteRazao,
          clienteCnpjCpf: form.clienteCnpjCpf,
          clienteEmail: form.clienteEmail,
          clienteTelefone: form.clienteTelefone,
          clienteCelular: form.clienteCelular,
          clienteSituacao: form.clienteSituacao,
          clienteNomeContato: form.nomeContato,
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
        },
        { headers: { "Content-Type": "application/json" } }
      );

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
      <div className="page-bar">
        <div className="left">
          <h1>Novo | Cliente</h1>
        </div>
      </div>

      <form className="card" onSubmit={onSubmit}>
        {/* Tipo/segmento/documento */}
        <div className="grid grid-4 gap">
          <div className="field">
            <label>CPF/CNPJ *</label>
            <input
              name="clienteCnpjCpf"
              placeholder="CPF/CNPJ"
              value={form.clienteCnpjCpf}
              onChange={onInputChange}
            />
          </div>

          <div className="field">
            <label>Tipo</label>
            <select name="tipo" value={form.tipo} onChange={onSelectChange}>
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
              onChange={onInputChange}
            />
          </div>

          <div className="field">
            <label>Situação</label>
            <select
              name="clienteSituacao"
              value={form.clienteSituacao}
              onChange={onSelectChange}
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
              onChange={onInputChange}
            />
          </div>
          <div className="field col-span-2">
            <label>Fantasia</label>
            <input
              name="clienteFantasia"
              placeholder="Nome fantasia"
              value={form.clienteFantasia}
              onChange={onInputChange}
            />
          </div>
        </div>

        {/* Endereço */}
        <h2 className="section-title">Endereço</h2>
        <div className="grid grid-6 gap">
          <div className="field">
            <label>CEP</label>
            <input name="cep" value={form.cep} onChange={onInputChange} />
          </div>
          <div className="field col-span-2">
            <label>Logradouro</label>
            <input
              name="logradouro"
              value={form.logradouro}
              onChange={onInputChange}
            />
          </div>
          <div className="field">
            <label>Número</label>
            <input name="numero" value={form.numero} onChange={onInputChange} />
          </div>
          <div className="field">
            <label>Complemento</label>
            <input
              name="complemento"
              value={form.complemento}
              onChange={onInputChange}
            />
          </div>
          <div className="field">
            <label>Bairro</label>
            <input name="bairro" value={form.bairro} onChange={onInputChange} />
          </div>
          <div className="field col-span-2">
            <label>Cidade</label>
            <input name="cidade" value={form.cidade} onChange={onInputChange} />
          </div>
          <div className="field">
            <label>Estado</label>
            <select name="estado" value={form.estado} onChange={onSelectChange}>
              <option value=""></option>
              {[
                "AC","AL","AM","AP","BA","CE","DF","ES","GO","MA","MG",
                "MS","MT","PA","PB","PE","PI","PR","RJ","RN","RO","RR",
                "RS","SC","SE","SP","TO",
              ].map((uf) => (
                <option key={uf} value={uf}>
                  {uf}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Contato */}
        <h2 className="section-title">Contato</h2>
        <div className="grid grid-4 gap">
          <div className="field col-span-2">
            <label>Nome do contato</label>
            <input
              name="nomeContato"
              value={form.nomeContato}
              onChange={onInputChange}
            />
          </div>

          <div className="field col-span-4">
            <label>E-mail</label>
            <input
              name="clienteEmail"
              type="email"
              value={form.clienteEmail}
              onChange={onInputChange}
            />
          </div>

          <div className="field">
            <label>Telefone</label>
            <input
              name="clienteTelefone"
              value={form.clienteTelefone}
              onChange={onInputChange}
            />
          </div>

          <div className="field">
            <label>Celular</label>
            <input
              name="clienteCelular"
              value={form.clienteCelular}
              onChange={onInputChange}
            />
          </div>
        </div>

        {/* Outros dados */}
        <h2 className="section-title">Outros dados</h2>
        <div className="grid grid-4 gap">
          <div className="field">
            <label>CAD/PRO</label>
            <input name="cadPro" value={form.cadPro} onChange={onInputChange} />
          </div>

          <div className="field">
            <label>
              <input
                type="checkbox"
                name="consultaSerpro"
                checked={form.consultaSerpro}
                onChange={onInputChange}
              />{" "}
              Consultar SERPRO
            </label>
          </div>
        </div>

        {/* Feedback de erro e ações */}
        {error && <p className="error">{error}</p>}

        <div className="form-actions">
          <button type="submit" className="btn primary" disabled={saving}>
            {saving ? "Salvando..." : "Salvar"}
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => navigate("/clientes")}
            disabled={saving}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
