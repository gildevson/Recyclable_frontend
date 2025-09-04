import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from "recharts";
import "./dashboard.css";

// --- Data Definitions ---
const monthlyData = [
  { name: "Jan", users: 50, sales: 20, mobile: 55, desktop: 65 },
  { name: "Feb", users: 80, sales: 40, mobile: 60, desktop: 70 },
  { name: "Mar", users: 120, sales: 60, mobile: 35, desktop: 25 },
  { name: "Apr", users: 140, sales: 90, mobile: 58, desktop: 52 },
  { name: "May", users: 160, sales: 110, mobile: 60, desktop: 55 },
  { name: "Jun", users: 175, sales: 125, mobile: 50, desktop: 40 },
  { name: "Jul", users: 185, sales: 135, mobile: 55, desktop: 45 },
  { name: "Aug", users: 190, sales: 140, mobile: 60, desktop: 50 },
  { name: "Sep", users: 200, sales: 150, mobile: 62, desktop: 52 },
  { name: "Oct", users: 240, sales: 170, mobile: 78, desktop: 62 },
  { name: "Nov", users: 150, sales: 95, mobile: 45, desktop: 40 },
  { name: "Dec", users: 230, sales: 160, mobile: 70, desktop: 65 },
];

const userStatusData = [
  { name: "Active", value: 60, color: "#3b82f6" },
  { name: "Inactive", value: 40, color: "#93c5fd" },
];

const Dashboard = () => {
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
        
        {/* Mobile/Desktop Usage Bar Chart */}
        <div className="chart-card span-2">
          <div className="card-head">
            <h3>Mobile / Desktop Usage</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyData} barGap={4}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="desktop" name="Desktop" stackId="a" fill="#3b82f6" />
              <Bar dataKey="mobile" name="Mobile" stackId="a" fill="#93c5fd" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SECOND ROW: EXTRA CHARTS / LISTS */}
      <div className="bottom-grid">
        {/* Monthly Users and Sales Bar Chart */}
        <div className="chart-card">
          <div className="card-head">
            <h3>Monthly Users & Sales</h3>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="users" name="Users" fill="#93c5fd" />
              <Bar dataKey="sales" name="Sales" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* User Growth Line Chart */}
        <div className="chart-card">
          <div className="card-head">
            <h3>User Growth</h3>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthlyData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Active vs. Inactive Users Pie Chart */}
        <div className="chart-card">
          <div className="card-head">
            <h3>Active vs. Inactive Users</h3>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={userStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85}>
                {userStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity List */}
        <div className="list-card">
          <div className="card-head">
            <h3>Recent Activity</h3>
          </div>
          <ul>
            <li>📌 John Doe added a new user.</li>
            <li>📊 Monthly report for April was generated.</li>
            <li>📥 New user Jane Smith signed up.</li>
            <li>🔄 System updated to version 2.0.</li>
          </ul>
        </div>

        {/* System Alerts */}
        <div className="alert-card">
          <div className="card-head">
            <h3>📢 System Alerts</h3>
          </div>
          <p>🚀 Update scheduled for tomorrow at 10 PM.</p>
          <p>⚠️ Annual report must be generated by the 10th.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;