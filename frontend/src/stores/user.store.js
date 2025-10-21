import { defineStore } from "pinia";
import { ref } from "vue";
import { getUserById, updateUser } from "../services/api/user.api";

export const useUserStore = defineStore("user", () => {
  const currentUser = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const fetchUser = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      currentUser.value = await getUserById(id);

      console.log("Current User : ", currentUser.value);
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  const updateCurrentUser = async (id, userData) => {
    loading.value = true;
    error.value = null;
    try {
      currentUser.value = await updateUser(id, userData);
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  return { currentUser, loading, error, fetchUser, updateCurrentUser };
});
