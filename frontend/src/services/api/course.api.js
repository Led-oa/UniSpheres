import api from "../Connect.backend.js";

export const CourseService = {
  // Récupérer tous les cours
  getAllCourses() {
    return api.get("/course");
  },

  // Récupérer un cours par son ID
  getCourseById(courseId) {
    return api.get(`/course/${courseId}`);
  },

  // Récupérer les cours d'un professeur (teacher)
  getCoursesByTeacher(teacherId) {
    return api.get(`/course/teacher/${teacherId}`);
  },

  // Récupérer les cours d'une classe
  getCoursesByClass(classId) {
    return api.get(`/course/class/${classId}`);
  },

  // Créer un cours avec fichiers
  createCourse(formData) {
    // formData doit être un FormData contenant :
    // title, content, duration, teach_by, class_id et éventuellement "files"
    return api.post("/course", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Mettre à jour un cours
  updateCourse(courseId, data) {
    return api.patch(`/course/${courseId}`, data);
  },

  // Supprimer un cours
  deleteCourse(courseId) {
    return api.delete(`/course/${courseId}`);
  },
};
