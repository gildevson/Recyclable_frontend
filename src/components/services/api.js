// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: /* import.meta.env.VITE_API_URL || */ "http://localhost:8080",
  withCredentials: true,
});

// Request: injeta token (exceto em GETs públicos de /clientes)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  // Monta URL absoluta para extrair pathname com segurança
  const full = new URL(config.url, config.baseURL);
  const pathname = full.pathname;
  const method = (config.method || "get").toLowerCase();

  // Rotas públicas (ajuste conforme sua política)
  const isPublicClientesGET =
    method === "get" && (pathname === "/clientes" || pathname.startsWith("/clientes/"));

  if (token && !isPublicClientesGET) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response: trata erros globais
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    if (status === 401) {
      console.warn("⚠️ 401: não autenticado/expirado. Limpando sessão.");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("username");
      window.location.href = "/login";
    } else if (status === 403) {
      console.warn("⚠️ 403: permissão insuficiente.");
    }
    return Promise.reject(err);
  }
);

export default api;
