import { defineStore } from "pinia";
import { ref } from "vue";
import { ParcoursService } from "../../services/api/infoGenerique.api";

export const useParcoursStore = defineStore("parcoursStore", () => {
  const parcours = ref([]);
  const currentParcours = ref(null);
  const loading = ref(false);
  const error = ref(null);

  async function fetchParcours() {
    loading.value = true;
    error.value = null;
    try {
      const res = await ParcoursService.getAll();

      console.log("Store parcours: ", res);

      this.parcours = Array.isArray(res.data) ? res.data : [];
    } catch (err) {
      console.error("Erreur fetchParcours:", err);
      error.value = err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchParcoursById(id) {
    loading.value = true;
    error.value = null;
    try {
      currentParcours.value = await ParcoursService.getById(id);
    } catch (err) {
      console.error("Erreur fetchParcoursById:", err);
      error.value = err;
    } finally {
      loading.value = false;
    }
  }

  async function createParcours(data) {
    loading.value = true;
    error.value = null;
    try {
      const newParcours = await ParcoursService.create(data);
      parcours.value.push(newParcours);
      return newParcours;
    } catch (err) {
      console.error("Erreur createParcours:", err);
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateParcours(id, data) {
    loading.value = true;
    error.value = null;
    try {
      const updated = await ParcoursService.update(id, data);
      const index = parcours.value.findIndex((p) => p.id_parcours === id);
      if (index !== -1) parcours.value[index] = updated;
      return updated;
    } catch (err) {
      console.error("Erreur updateParcours:", err);
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteParcours(id) {
    loading.value = true;
    error.value = null;
    try {
      await ParcoursService.delete(id);
      parcours.value = parcours.value.filter((p) => p.id_parcours !== id);
    } catch (err) {
      console.error("Erreur deleteParcours:", err);
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    parcours,
    currentParcours,
    loading,
    error,
    fetchParcours,
    fetchParcoursById,
    createParcours,
    updateParcours,
    deleteParcours,
  };
});
