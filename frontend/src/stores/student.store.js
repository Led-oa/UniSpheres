import { defineStore } from "pinia";
import { ref } from "vue";
import { getUsersByRole } from "../services/api/user.api";

export const useStudentStore = defineStore("student", () => {
  const students = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchStudents = async () => {
    loading.value = true;
    error.value = null;
    try {
      students.value = await getUsersByRole("student");
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  return { students, loading, error, fetchStudents };
});
