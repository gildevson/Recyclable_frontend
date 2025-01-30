import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080", // Verifique se o backend está executando nessa porta
    withCredentials: true, // Enviar cookies nas requisições
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;
