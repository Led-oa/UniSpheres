import api from "../Connect.backend.js";

// ✅ Authentification

export const registerUser = async (userData) => {
  try {
    const response = await api.post("/user/register", userData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/user/login", credentials);
    return response.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// ✅ Utilisateurs protégés

export const getCurrentUser = async () => {
  try {
    const response = await api.get("/user/me");

    console.log("Structure response getCurrentUser : ", response.data);

    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getAllUsers = async (page = 1, limit = 10) => {
  try {
    const response = await api.get("/user", {
      params: { page, limit },
    });
    return response.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export const getUsersByRole = async (role, page = 1, limit = 10) => {
  try {
    const response = await api.get(`/user/role/${role}`, {
      params: { page, limit },
    });
    return response.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export const getAllTeacher = async () => {
  try {
    const response = await api.get(`/user/teachers`);
    return response.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export const loadAllApi = async () => {
  try {
    const response = await api.get(`/user/load/allUsers`);
    console.log("Reponse", response);
    return response.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export const getUserById = async (id) => {
  try {
    const response = await api.get(`/user/${id}`);
    return response.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await api.patch(`/user/${id}`, userData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export const activateUser = async (id) => {
  try {
    const response = await api.patch(`/user/${id}/activate`);
    return response.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export const desactivateUser = async (id) => {
  try {
    const response = await api.patch(`/user/${id}/desactivate`);
    return response.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/user/${id}`);
    return response.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};
