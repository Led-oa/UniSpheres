import { defineStore } from "pinia";
import { ref } from "vue";
import FileAPI from "../services/api/file.api";

export const useFileStore = defineStore("file", () => {
  // État
  const files = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Actions

  const fetchFilesByOwner = async (ownerType, ownerId) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await FileAPI.fetchFilesByOwner(ownerType, ownerId);
      files.value = response.data.data || [];
      return files.value;
    } catch (err) {
      console.error("Erreur fetchFilesByOwner:", err);
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const uploadFile = async (formData, type) => {
    loading.value = true;
    error.value = null;
    try {
      let response;
      if (type === "course")
        response = await FileAPI.uploadCourseFile(formData);
      else if (type === "annonce")
        response = await FileAPI.uploadAnnonceFile(formData);
      else if (type === "message")
        response = await FileAPI.uploadMessageFile(formData);
      else throw new Error("Type de fichier inconnu");

      // Ajouter le fichier uploadé dans l'état
      files.value.push(response.data.data);
      return response.data.data;
    } catch (err) {
      console.error("Erreur uploadFile:", err);
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateFile = async (fileId, data) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await FileAPI.updateFile(fileId, data);

      // Mettre à jour le fichier dans l'état
      const index = files.value.findIndex((f) => f.id_file === fileId);
      if (index !== -1) files.value[index] = response.data;

      return response.data;
    } catch (err) {
      console.error("Erreur updateFile:", err);
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const removeFile = async (fileId) => {
    loading.value = true;
    error.value = null;
    try {
      await FileAPI.removeFile(fileId);
      files.value = files.value.filter((f) => f.id_file !== fileId);
      return true;
    } catch (err) {
      console.error("Erreur removeFile:", err);
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    files,
    loading,
    error,
    fetchFilesByOwner,
    uploadFile,
    updateFile,
    removeFile,
  };
});
