import { defineStore } from "pinia";
import { ref, computed, onMounted } from "vue";
import {
  loginUser,
  registerUser,
  getCurrentUser,
} from "../services/api/user.api";

import { useChatStore } from "./chat.store";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const token = ref(localStorage.getItem("token") || null);
  const is_active = ref(null);
  const isLoggedIn = ref(!!token.value);
  const loading = ref(false);
  const error = ref(null);
  const success = ref(null);

  // Fonction pour récupérer les infos utilisateur
  const fetchUserData = async () => {
    if (token.value && !user.value) {
      try {
        loading.value = true;
        // console.log("Fetching user data with token...");
        const userData = await getCurrentUser();
        user.value = userData;
        console.log("User data fetched successfully:", userData);
        return userData;
      } catch (err) {
        // console.error("Failed to fetch user data:", err);
        // Si le token est invalide, nettoyer
        if (err.message?.includes("401") || err.message?.includes("token")) {
          logout();
        }
        throw err;
      } finally {
        loading.value = false;
      }
    }
  };

  const login = async (credentials) => {
    loading.value = true;
    error.value = null;
    try {
      const data = await loginUser(credentials.value);
      token.value = data.token;
      user.value = data.user;
      is_active.value = user.value.is_active;

      console.log("User Value : ", user.value);
      console.log("is_active Value : ", is_active.value);

      localStorage.setItem("token", data.token);
      isLoggedIn.value = true;
      return data;
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  const register = async (userData) => {
    loading.value = true;
    error.value = null;
    try {
      const data = await registerUser(userData);
      success.value = data.success;
      return data;
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    isLoggedIn.value = false;
    localStorage.removeItem("token");
    console.log("User logged out");
  };

  const role = computed(() => user.value?.role || null);

  const checkTokenPresence = () => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) return false;

    // --- Si c'est un JWT, on peut vérifier son expiration ---
    try {
      const payload = JSON.parse(atob(storedToken.split(".")[1]));
      const now = Math.floor(Date.now() / 10000);
      if (payload.exp && payload.exp < now) {
        console.warn("Token expiré");
        logout();
        return false;
      }
    } catch (e) {
      console.warn("Token invalide ou non-JWT");
      // Pas un JWT, on se contente de vérifier sa présence
    }
    return true;
  };

  // Initialiser les données utilisateur
  const initializeAuth = async () => {
    if (!checkTokenPresence()) {
      console.log("Aucun token ou token invalide → déconnexion.");
      logout();
      return;
    }
    if (token.value && !user.value) {
      console.log("Initializing user data from token...");
      try {
        await fetchUserData();
      } catch (error) {
        console.log("Initialization failed:", error.message);
        logout();
      }
    }
  };

  return {
    user,
    token,
    is_active,
    isLoggedIn,
    loading,
    error,
    success,
    role,
    login,
    register,
    fetchUserData,
    initializeAuth,
    checkTokenPresence,
    logout,
  };
});
