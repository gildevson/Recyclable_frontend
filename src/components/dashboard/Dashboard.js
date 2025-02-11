import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";


import "./dashboard.css";

const Dashboard = () => {
  const userData = [
    { name: "Jan", usuarios: 50, vendas: 20 },
    { name: "Fev", usuarios: 80, vendas: 40 },
    { name: "Mar", usuarios: 120, vendas: 60 },
    { name: "Abr", usuarios: 140, vendas: 90 },
    { name: "Mai", usuarios: 160, vendas: 110 },
  ];

  const pieData = [
    { name: "Ativos", value: 60, color: "#007bff" },
    { name: "Inativos", value: 40, color: "#ffcc00" },
  ];

  return (
    <div className="dashboard-container">


      {/* Cards */}
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Total de Usuários</h2>
          <p>150</p>
        </div>
        <div className="dashboard-card">
          <h2>Relatórios Mensais</h2>
          <p>35</p>
        </div>
        <div className="dashboard-card">
          <h2>Relatórios Anuais</h2>
          <p>10</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="dashboard-charts">
        <div className="chart-container">
          <h3>Usuários e Vendas Mensais</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={userData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="usuarios" fill="#8884d8" name="Usuários" />
              <Bar dataKey="vendas" fill="#82ca9d" name="Vendas" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Crescimento de Usuários</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={userData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="usuarios" stroke="#ff7300" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Usuários Ativos x Inativos</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

        </div>
        <div className="recent-activities">
          <h3>Atividades Recentes</h3>
          <ul>
            <li>📌 João Silva cadastrou um novo usuário.</li>
            <li>📊 Relatório mensal de abril foi gerado.</li>
            <li>📥 Novo usuário Maria Souza se registrou.</li>
            <li>🔄 Sistema atualizado para a versão 2.0</li>
          </ul>
        </div>
        <div className="alert-box">
          <h3>📢 Avisos do Sistema</h3>
          <p>🚀 Atualização agendada para amanhã às 22h.</p>
          <p>⚠️ Relatório anual precisa ser gerado até dia 10.</p>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
