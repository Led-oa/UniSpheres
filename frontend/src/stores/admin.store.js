import { defineStore } from "pinia";
import { ref } from "vue";
import {
  getAllUsers,
  getUsersByRole,
  activateUser,
  desactivateUser,
  deleteUser,
} from "../services/api/user.api";

export const useAdminStore = defineStore("admin", () => {
  const users = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchUsers = async () => {
    loading.value = true;
    error.value = null;
    try {
      users.value = await getAllUsers();
      console.log("Users.value : ", users.value);
      return users.value;
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  const fetchUsersByRole = async (role) => {
    loading.value = true;
    error.value = null;
    try {
      users.value = await getUsersByRole(role);
      console.log("User value : ", users.value);
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
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
    fetchUsersByRole,
    activate,
    desactivate,
    removeUser,
  };
});
