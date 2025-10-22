import { defineStore } from "pinia";
import { ref } from "vue";
import { getUsersByRole, getAllTeacher } from "../services/api/user.api";

export const useTeacherStore = defineStore("teacher", () => {
  const teachers = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchTeachers = async () => {
    loading.value = true;
    error.value = null;
    try {
      const res = await getAllTeacher();
      console.log("Liste of all teacher : ", res.data);
      return (teachers.value = res.data);
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  return { teachers, loading, error, fetchTeachers };
});
