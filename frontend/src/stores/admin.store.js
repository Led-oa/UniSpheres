import { defineStore } from "pinia";
import { ref } from "vue";
import {
  getAllUsers,
  loadAllApi,
  getUsersByRole,
  activateUser,
  desactivateUser,
  deleteUser,
} from "../services/api/user.api";

export const useAdminStore = defineStore("admin", () => {
  const users = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const pagination = ref({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: 10,
  });

  const fetchUsers = async (page = 1, limit = 10) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await getAllUsers(page, limit);
      users.value = response.data;
      pagination.value = response.pagination;
      return response;
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  const fetchAll = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await loadAllApi();
      console.log("Response : ", response);
      users.value = response.data;
      return response;
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  const fetchAdmins = async () => {
    loading.value = true;
    error.value = null;
    try {
      teachers.value = await getUsersByRole("teacher");
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  const fetchUsersByRole = async (role, page = 1, limit = 10) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await getUsersByRole(role, page, limit);

      console.log("Response adminstore : ", response);

      users.value = response.data;
      pagination.value = response.pagination;
      return response;
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  const changePage = async (page) => {
    pagination.value.currentPage = page;
    // Recharger les données selon l'onglet actif
    // Cette logique sera gérée dans le composant
  };

  const activate = async (id) => {
    try {
      await activateUser(id);
      await fetchUsers();
    } catch (err) {
      error.value = err;
    }
  };

  const desactivate = async (id) => {
    try {
      await desactivateUser(id);
      await fetchUsers();
    } catch (err) {
      error.value = err;
    }
  };

  const removeUser = async (id) => {
    try {
      await deleteUser(id);
      await fetchUsers();
    } catch (err) {
      error.value = err;
    }
  };

  return {
    users,
    loading,
    error,
    fetchUsers,
    fetchAll,
    pagination,
    changePage,
    fetchAdmins,
    fetchUsersByRole,
    activate,
    desactivate,
    removeUser,
  };
});
