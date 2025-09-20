import { defineStore } from "pinia";
import { ref } from "vue";
import { ClasseService } from "../../services/api/classe.api";

export const useClasseStore = defineStore("classeStore", () => {
  // états
  const classes = ref([]);
  const students = ref([]);
  const teachers = ref([]);
  const currentClass = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // actions

  // Récupérer toutes les classes
  async function fetchClasses() {
    loading.value = true;
    error.value = null;
    try {
      const res = await ClasseService.getAll();

      console.log("Classe Store res : ", res);

      this.classes = Array.isArray(res.data) ? res.data : [];
      return res;
    } catch (err) {
      console.error("Erreur fetchClasses:", err);
      error.value = err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchClassesRegister() {
    loading.value = true;
    error.value = null;
    try {
      const res = await ClasseService.getAllRegister();

      console.log("Classe Store res : ", res);

      this.classes = Array.isArray(res.data) ? res.data : [];
      return res;
    } catch (err) {
      console.error("Erreur fetchClasses:", err);
      error.value = err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchClasseTeacher() {
    loading.value = true;
    error.value = null;
    try {
      const res = await ClasseService.getByTeacher();

      console.log("Classe Store res : ", res);

      this.classes = Array.isArray(res.data) ? res.data : [];
    } catch (err) {
      console.error("Erreur fetchClasses:", err);
      error.value = err;
    } finally {
      loading.value = false;
    }
  }

  async function getStudentFromClass(idClass) {
    loading.value = true;
    error.value = null;
    try {
      const res = await ClasseService.getStudentsFromClass(idClass);

      console.log("Classe Store get students from class res : ", res.data);

      this.students = Array.isArray(res.data) ? res.data : [];
      return res;
    } catch (err) {
      console.error("Erreur getStudentFromClass:", err);
      error.value = err;
    } finally {
      loading.value = false;
    }
  }

  async function getTeacherOfClass(idClass) {
    loading.value = true;
    error.value = null;
    try {
      const res = await ClasseService.getTeachersOfClass(idClass);

      console.log("Classe Store get teachers of class res : ", res.data);

      this.teachers = Array.isArray(res.data) ? res.data : [];
      return res;
    } catch (err) {
      console.error("Erreur getStudentFromClass:", err);
      error.value = err;
    } finally {
      loading.value = false;
    }
  }

  // Récupérer une classe par ID
  async function fetchClass(id) {
    loading.value = true;
    error.value = null;
    try {
      return currentClass.value = await ClasseService.getById(id);
    } catch (err) {
      console.error("Erreur fetchClass:", err);
      error.value = err;
    } finally {
      loading.value = false;
    }
  }

  // Créer une nouvelle classe
  async function createClass(data) {
    loading.value = true;
    error.value = null;
    try {
      const newClass = await ClasseService.create(data);
      classes.value.push(newClass);
      return newClass;
    } catch (err) {
      console.error("Erreur createClass:", err);
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // Mettre à jour une classe
  async function updateClass(id, data) {
    loading.value = true;
    error.value = null;
    try {
      const updated = await ClasseService.update(id, data);
      const index = classes.value.findIndex((c) => c.id_class === id);
      if (index !== -1) classes.value[index] = updated;
      return updated;
    } catch (err) {
      console.error("Erreur updateClass:", err);
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // Supprimer une classe
  async function deleteClass(id) {
    loading.value = true;
    error.value = null;
    try {
      await ClasseService.delete(id);
      classes.value = classes.value.filter((c) => c.id_class !== id);
    } catch (err) {
      console.error("Erreur deleteClass:", err);
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    classes,
    students,
    teachers,
    currentClass,
    loading,
    error,
    fetchClasses,
    fetchClassesRegister,
    fetchClasseTeacher,
    fetchClass,
    getStudentFromClass,
    getTeacherOfClass,
    createClass,
    updateClass,
    deleteClass,
  };
});
