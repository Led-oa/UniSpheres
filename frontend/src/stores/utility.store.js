import { defineStore } from "pinia";
import { ref } from "vue";
import {
  getTablesCount,
  getLastAnnonces,
  getCoursesCountInClass,
  getCoursesCountByTeacher,
  getClassesCountByTeacher,
} from "../services/api/utility.api";

export const useUtilityStore = defineStore("utility", () => {
  // --- States ---
  const tablesCount = ref([]);
  const lastAnnonces = ref([]);
  const coursesCountInClass = ref(null);
  const coursesCountByTeacher = ref(null);
  const classesCountByTeacher = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // --- Actions ---
  const fetchTablesCount = async () => {
    loading.value = true;
    error.value = null;
    try {
      const res = await getTablesCount();
      tablesCount.value = res.data;
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  const fetchLastAnnonces = async (limit = 5) => {
    loading.value = true;
    error.value = null;
    try {
      const res = await getLastAnnonces(limit);
      lastAnnonces.value = res.data;
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  const fetchCoursesCountInClass = async (classId) => {
    loading.value = true;
    error.value = null;
    try {
      const res = await getCoursesCountInClass(classId);
      coursesCountInClass.value = res.count || res.data?.count || res;
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  const fetchCoursesCountByTeacher = async (teacherId) => {
    loading.value = true;
    error.value = null;
    try {
      const res = await getCoursesCountByTeacher(teacherId);
      coursesCountByTeacher.value = res.count || res.data?.count || res;
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  const fetchClassesCountByTeacher = async (teacherId) => {
    loading.value = true;
    error.value = null;
    try {
      const res = await getClassesCountByTeacher(teacherId);
      classesCountByTeacher.value = res.count || res.data?.count || res;
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  return {
    // state
    tablesCount,
    lastAnnonces,
    coursesCountInClass,
    coursesCountByTeacher,
    classesCountByTeacher,
    loading,
    error,

    // actions
    fetchTablesCount,
    fetchLastAnnonces,
    fetchCoursesCountInClass,
    fetchCoursesCountByTeacher,
    fetchClassesCountByTeacher,
  };
});
