import { defineStore } from "pinia";
import { ref } from "vue";
import { YearService } from "../../services/api/infoGenerique.api";

export const useYearStore = defineStore("yearStore", () => {
  const years = ref([]);
  const currentYear = ref(null);
  const loading = ref(false);
  const error = ref(null);

  async function fetchYears() {
    loading.value = true;
    error.value = null;
    try {
      const res = await YearService.getAll();
      console.log("Store years : ", res);
      this.years = Array.isArray(res.data) ? res.data : [];
    } catch (err) {
      console.error("Erreur fetchYears:", err);
      error.value = err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchYearById(id) {
    loading.value = true;
    error.value = null;
    try {
      currentYear.value = await YearService.getById(id);
    } catch (err) {
      console.error("Erreur fetchYearById:", err);
      error.value = err;
    } finally {
      loading.value = false;
    }
  }

  async function createYear(data) {
    loading.value = true;
    error.value = null;
    try {
      console.log("Store year : ", data);
      const newYear = await YearService.create(data);
      years.value.push(newYear);
      return newYear;
    } catch (err) {
      console.error("Erreur createYear:", err);
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateYear(id, data) {
    loading.value = true;
    error.value = null;
    try {
      const updated = await YearService.update(id, data);
      const index = years.value.findIndex((y) => y.id_year === id);
      if (index !== -1) years.value[index] = updated;
      return updated;
    } catch (err) {
      console.error("Erreur updateYear:", err);
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteYear(id) {
    loading.value = true;
    error.value = null;
    try {
      await YearService.delete(id);
      years.value = years.value.filter((y) => y.id_year !== id);
    } catch (err) {
      console.error("Erreur deleteYear:", err);
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    years,
    currentYear,
    loading,
    error,
    fetchYears,
    fetchYearById,
    createYear,
    updateYear,
    deleteYear,
  };
});
