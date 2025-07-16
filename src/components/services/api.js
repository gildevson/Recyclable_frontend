import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

// Interceptor de requisição: adiciona token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de resposta: trata erros globais
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && [401, 403].includes(error.response.status)) {
      console.warn("⚠️ Acesso não autorizado. Redirecionando para login.");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
