import axios from "axios";

// URL de base du backend
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:8000/api" : "http://localhost/api");

// Création d'une instance Axios
const api = axios.create({
  baseURL: `${API_BASE_URL}`,
  timeout: 10000, // 10s
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur de requêtes (ajout token si besoin)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // ou Pinia/Store
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur de réponses (gestion globale des erreurs)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Erreur API:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
