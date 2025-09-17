import { defineStore } from "pinia";
import { ref } from "vue";
import { FiliereService } from "../../services/api/infoGenerique.api";

export const useFiliereStore = defineStore("filiereStore", () => {
  const filieres = ref([]);
  const currentFiliere = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // Actions
  async function fetchFilieres() {
    loading.value = true;
    error.value = null;
    try {
      const res = await FiliereService.getAll();
      console.log("Store filiere : ", res);
      this.filieres = Array.isArray(res.data) ? res.data : [];
    } catch (err) {
      console.error("Erreur fetchFilieres:", err);
      error.value = err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchFiliere(id) {
    loading.value = true;
    error.value = null;
    try {
      currentFiliere.value = await FiliereService.getById(id);
    } catch (err) {
      console.error("Erreur fetchFiliere:", err);
      error.value = err;
    } finally {
      loading.value = false;
    }
  }

  async function createFiliere(data) {
    loading.value = true;
    error.value = null;
    try {
      const newFiliere = await FiliereService.create(data);
      filieres.value.push(newFiliere);
      return newFiliere;
    } catch (err) {
      console.error("Erreur createFiliere:", err);
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateFiliere(id, data) {
    loading.value = true;
    error.value = null;
    try {
      const updated = await FiliereService.update(id, data);
      const index = filieres.value.findIndex((f) => f.id_filiere === id);
      if (index !== -1) filieres.value[index] = updated;
      return updated;
    } catch (err) {
      console.error("Erreur updateFiliere:", err);
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteFiliere(id) {
    loading.value = true;
    error.value = null;
    try {
      await FiliereService.delete(id);
      filieres.value = filieres.value.filter((f) => f.id_filiere !== id);
    } catch (err) {
      console.error("Erreur deleteFiliere:", err);
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    filieres,
    currentFiliere,
    loading,
    error,
    fetchFilieres,
    fetchFiliere,
    createFiliere,
    updateFiliere,
    deleteFiliere,
  };
});
