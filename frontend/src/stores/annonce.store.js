import { defineStore } from "pinia";
import { ref } from "vue";
import { AnnonceService } from "../services/api/annonce.api";

export const useAnnonceStore = defineStore("annonce", () => {
  const annonces = ref([]);
  const currentAnnonce = ref(null);
  const isLoading = ref(false);
  const error = ref(null);
  const pagination = ref({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: 9,
  });

  const fetchAllAnnonces = async (page = 1, limit = 9) => {
    isLoading.value = true;
    error.value = null;
    try {
      const res = await AnnonceService.getAllAnnonces(page, limit);
      console.log("resultat annonces : ", res);

      annonces.value = res.data;
      pagination.value = res.pagination;
    } catch (err) {
      console.error("Erreur fetchAllAnnonces:", err);
      error.value = err.message || "Erreur lors du chargement des annonces";
    } finally {
      isLoading.value = false;
    }
  };

  const fetchAnnonceById = async (id) => {
    isLoading.value = true;
    error.value = null;
    try {
      currentAnnonce.value = await AnnonceService.getAnnonceById(id);
    } catch (err) {
      console.error("Erreur fetchAnnonceById:", err);
      error.value = err.message || `Annonce ${id} introuvable`;
    } finally {
      isLoading.value = false;
    }
  };

  const createAnnonce = async (data, files = []) => {
    isLoading.value = true;
    error.value = null;
    try {
      const annonce = await AnnonceService.createAnnonce(data, files);
      annonces.value.unshift(annonce); // Ajouter en début de liste
      return annonce;
    } catch (err) {
      console.error("Erreur createAnnonce:", err);
      error.value = err.message || "Erreur lors de la création de l'annonce";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const updateAnnonce = async (id, data, files = [], removeFiles = []) => {
    isLoading.value = true;
    error.value = null;
    try {
      const updated = await AnnonceService.updateAnnonce(
        id,
        data,
        files,
        removeFiles
      );

      // More robust state update - create new array for reactivity
      const index = annonces.value.findIndex((a) => a.id_annonce === id);
      if (index !== -1) {
        annonces.value = [
          ...annonces.value.slice(0, index),
          updated,
          ...annonces.value.slice(index + 1),
        ];
      }

      if (currentAnnonce.value && currentAnnonce.value.id_annonce === id) {
        currentAnnonce.value = { ...updated }; // Create a new object reference
      }

      return updated;
    } catch (err) {
      console.error("Erreur updateAnnonce:", err);
      error.value = err.message || "Erreur lors de la mise à jour de l'annonce";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteAnnonce = async (id) => {
    isLoading.value = true;
    error.value = null;
    try {
      await AnnonceService.deleteAnnonce(id);
      annonces.value = annonces.value.filter((a) => a.id_annonce !== id);
      if (currentAnnonce.value && currentAnnonce.value.id_annonce === id) {
        currentAnnonce.value = null;
      }
    } catch (err) {
      console.error("Erreur deleteAnnonce:", err);
      error.value = err.message || "Erreur lors de la suppression de l'annonce";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const changePage = async (page) => {
    pagination.value.currentPage = page;
    await fetchAllAnnonces(page, pagination.value.itemsPerPage);
  };

  return {
    annonces,
    currentAnnonce,
    isLoading,
    error,
    pagination,
    changePage,
    fetchAllAnnonces,
    fetchAnnonceById,
    createAnnonce,
    updateAnnonce,
    deleteAnnonce,
  };
});
