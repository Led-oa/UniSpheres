import { defineStore } from "pinia";
import { ref } from "vue";

import { AnnonceService } from "../services/api/annonce.api";

export const useAnnonceStore = defineStore("annonce", () => {
  const annonces = ref([]);
  const currentAnnonce = ref(null);
  const isLoading = ref(false);
  const error = ref(null);

  const fetchAllAnnonces = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      annonces.value = await AnnonceService.getAllAnnonces();
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
      // Mettre à jour la liste locale
      const index = annonces.value.findIndex((a) => a.id_annonce === id);
      if (index !== -1) annonces.value[index] = updated;
      if (currentAnnonce.value && currentAnnonce.value.id_annonce === id) {
        currentAnnonce.value = updated;
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

  return {
    annonces,
    currentAnnonce,
    isLoading,
    error,
    fetchAllAnnonces,
    fetchAnnonceById,
    createAnnonce,
    updateAnnonce,
    deleteAnnonce,
  };
});
