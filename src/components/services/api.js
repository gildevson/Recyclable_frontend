import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
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
    const status = error.response?.status;

    if (status === 401) {
      console.warn("⚠️ Token expirado ou não autenticado. Redirecionando para login.");
      localStorage.removeItem("token");
      window.location.href = "/login";
    } else if (status === 403) {
      console.warn("⚠️ Acesso negado (403). Permissão insuficiente.");
      // NÃO redireciona para login — você pode exibir um alerta aqui se quiser
    }

    return Promise.reject(error);
  }
);

export default api;
