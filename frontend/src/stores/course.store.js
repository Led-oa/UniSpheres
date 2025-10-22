import { defineStore } from "pinia";
import { ref } from "vue";

import { CourseService } from "../services/api/course.api";

export const useCourseStore = defineStore("course", () => {
  const courses = ref([]);
  const currentCourse = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // Récupérer tous les cours
  const fetchAllCourses = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await CourseService.getAllCourses();
      courses.value = response.data;
    } catch (err) {
      console.error("Erreur fetchAllCourses:", err);
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  // Récupérer un cours par ID
  const fetchCourseById = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await CourseService.getCourseById(id);

      console.log("Response course store : ", response.data);

      currentCourse.value = response.data;
      return response.data;
    } catch (err) {
      console.error("Erreur fetchCourseById:", err);
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  // Récupérer les cours d'un professeur
  const fetchCoursesByTeacher = async (teacherId) => {
    loading.value = true;
    error.value = null;
    try {
      console.log("teacher id : ", teacherId);

      const response = await CourseService.getCoursesByTeacher(teacherId);
      return (courses.value = response.data);
    } catch (err) {
      console.error("Erreur fetchCoursesByTeacher:", err);
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  // Récupérer les cours d'une classe
  const fetchCoursesByClass = async (classId) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await CourseService.getCoursesByClass(classId);
      console.log("Store fetch course for class : ", response.data);
      courses.value = response.data;
      return response;
    } catch (err) {
      console.error("Erreur fetchCoursesByClass:", err);
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  // Créer un cours (avec formData pour fichiers)
  const createCourse = async (formData) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await CourseService.createCourse(formData);
      courses.value.push(response.data); // ajout à la liste existante
      return response.data;
    } catch (err) {
      console.error("Erreur createCourse:", err);
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Mettre à jour un cours
  const updateCourse = async (courseId, data) => {
    loading.value = true;
    error.value = null;
    try {
      //   data.forEach((value, key) => {
      //     console.log(key, value);
      //   });

      const payload = {
        title: data.title,
        content: data.content,
        duration: data.duration,
        teach_by: data.teach_by,
        class_id: data.class_id,
      };
      console.log("Cleaned Data to update : ", payload);

      const response = await CourseService.updateCourse(courseId, payload);
      const index = courses.value.findIndex((c) => c.id_course === courseId);
      if (index !== -1) courses.value[index] = response.data;
      if (currentCourse.value?.id_course === courseId)
        currentCourse.value = response.data;
      return response.data;
    } catch (err) {
      console.error("Erreur updateCourse:", err);
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Supprimer un cours
  const deleteCourse = async (courseId) => {
    loading.value = true;
    error.value = null;
    try {
      await CourseService.deleteCourse(courseId);
      courses.value = courses.value.filter((c) => c.id_course !== courseId);
      if (currentCourse.value?.id_course === courseId)
        currentCourse.value = null;
    } catch (err) {
      console.error("Erreur deleteCourse:", err);
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // -------------------
  // Return state & actions
  // -------------------
  return {
    courses,
    currentCourse,
    loading,
    error,
    fetchAllCourses,
    fetchCourseById,
    fetchCoursesByTeacher,
    fetchCoursesByClass,
    createCourse,
    updateCourse,
    deleteCourse,
  };
});
