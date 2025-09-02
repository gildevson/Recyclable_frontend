import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from "recharts";
import "./dashboard.css";

const Dashboard = () => {
  const userData = [
    { name: "Jan", usuarios: 50, vendas: 20, mobile: 55, desktop: 65 },
    { name: "Fev", usuarios: 80, vendas: 40, mobile: 60, desktop: 70 },
    { name: "Mar", usuarios: 120, vendas: 60, mobile: 35, desktop: 25 },
    { name: "Abr", usuarios: 140, vendas: 90, mobile: 58, desktop: 52 },
    { name: "Mai", usuarios: 160, vendas: 110, mobile: 60, desktop: 55 },
    { name: "Jun", usuarios: 175, vendas: 125, mobile: 50, desktop: 40 },
    { name: "Jul", usuarios: 185, vendas: 135, mobile: 55, desktop: 45 },
    { name: "Ago", usuarios: 190, vendas: 140, mobile: 60, desktop: 50 },
    { name: "Set", usuarios: 200, vendas: 150, mobile: 62, desktop: 52 },
    { name: "Out", usuarios: 240, vendas: 170, mobile: 78, desktop: 62 },
    { name: "Nov", usuarios: 150, vendas: 95,  mobile: 45, desktop: 40 },
    { name: "Dez", usuarios: 230, vendas: 160, mobile: 70, desktop: 65 },
  ];

  const pieData = [
    { name: "Ativos", value: 60, color: "#1e66ff" },
    { name: "Inativos", value: 40, color: "#ffcc00" },
  ];

  return (
    <div className="dash-wrap">
      {/* HEADER */}
      <div className="dash-header">
        <div>
          <h1>Analytics Dashboard</h1>
          <p>Welcome back, Lucy! We've missed you. 👋</p>
        </div>

        <div className="header-actions">
          <button className="btn-ghost" title="Refresh">⟳</button>
          <button className="btn-ghost" title="Filter">⛃</button>
          <button className="btn-primary">Today: April 29</button>
        </div>
      </div>

      {/* TOP ROW: KPIs + CHART */}
      <div className="top-grid">
        <div className="kpi-card">
          <div className="kpi-head">
            <span className="kpi-title">Visitors</span>
          </div>
          <div className="kpi-main">
            <div className="kpi-number">24.532</div>
          </div>
          <div className="kpi-foot">
            <span className="badge up">+14%</span>
            <span className="muted">Since last week</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-head">
            <span className="kpi-title">Activity</span>
            <span className="chip">Annual</span>
          </div>
          <div className="kpi-main">
            <div className="kpi-number">63.200</div>
          </div>
          <div className="kpi-foot">
            <span className="badge down">-12%</span>
            <span className="muted">Since last week</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-head">
            <span className="kpi-title">Real-Time</span>
            <span className="chip">Monthly</span>
          </div>
          <div className="kpi-main">
            <div className="kpi-number">1.320</div>
          </div>
          <div className="kpi-foot">
            <span className="badge down">-18%</span>
            <span className="muted">Since last week</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-head">
            <span className="kpi-title">Bounce</span>
            <span className="chip">Yearly</span>
          </div>
          <div className="kpi-main">
            <div className="kpi-number">12.364</div>
          </div>
          <div className="kpi-foot">
            <span className="badge up">+27%</span>
            <span className="muted">Since last week</span>
          </div>
        </div>

        <div className="chart-card span-2">
          <div className="card-head">
            <h3>Mobile / Desktop</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={userData} barGap={4}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {/* azul escuro = desktop / azul claro = mobile */}
              <Bar dataKey="desktop" name="Desktop" stackId="a" fill="#3b82f6" />
              <Bar dataKey="mobile"  name="Mobile"  stackId="a" fill="#93c5fd" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SECOND ROW: EXTRA CHARTS / LISTS */}
      <div className="bottom-grid">
        <div className="chart-card">
          <div className="card-head"><h3>Usuários e Vendas Mensais</h3></div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={userData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="usuarios" name="Usuários" fill="#93c5fd" />
              <Bar dataKey="vendas"   name="Vendas"   fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="card-head"><h3>Crescimento de Usuários</h3></div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={userData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="usuarios" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="card-head"><h3>Usuários Ativos x Inativos</h3></div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85}>
                {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="list-card">
          <div className="card-head"><h3>Atividades Recentes</h3></div>
          <ul>
            <li>📌 João Silva cadastrou um novo usuário.</li>
            <li>📊 Relatório mensal de abril foi gerado.</li>
            <li>📥 Novo usuário Maria Souza se registrou.</li>
            <li>🔄 Sistema atualizado para a versão 2.0.</li>
          </ul>
        </div>

        <div className="alert-card">
          <div className="card-head"><h3>📢 Avisos do Sistema</h3></div>
          <p>🚀 Atualização agendada para amanhã às 22h.</p>
          <p>⚠️ Relatório anual precisa ser gerado até dia 10.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
