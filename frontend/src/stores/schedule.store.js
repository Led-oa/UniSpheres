import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { scheduleService } from "../services/api/schedule.api";

export const useScheduleStore = defineStore("schedule", () => {
  // State
  const schedules = ref([]);
  const organizedSchedule = ref({});
  const availableWeeks = ref([]);
  const currentWeekSchedule = ref({});
  const statistics = ref({});
  const loading = ref(false);
  const error = ref(null);

  // Getters
  const getSchedules = computed(() => schedules.value);
  const getOrganizedSchedule = computed(() => organizedSchedule.value);
  const getAvailableWeeks = computed(() => availableWeeks.value);
  const getCurrentWeekSchedule = computed(() => currentWeekSchedule.value);
  const getStatistics = computed(() => statistics.value);
  const isLoading = computed(() => loading.value);
  const getError = computed(() => error.value);

  // Actions
  const resetError = () => {
    error.value = null;
  };

  const setLoading = (value) => {
    loading.value = value;
  };

  // Récupérer l'emploi du temps d'une classe
  const fetchScheduleOfClass = async (classId, week = null) => {
    try {
      setLoading(true);
      resetError();

      const response = await scheduleService.getScheduleOfClass(classId, week);

      if (response.data.success) {
        schedules.value = response.data.data.schedules;
        return response.data.data;
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      error.value = err.message;
      console.error("Erreur fetchScheduleOfClass:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Récupérer l'emploi du temps organisé d'une classe
  const fetchOrganizedSchedule = async (classId, week = null) => {
    try {
      setLoading(true);
      resetError();

      const response = await scheduleService.getOrganizedSchedule(
        classId,
        week
      );

      if (response.data.success) {
        organizedSchedule.value = response.data.data.organizedSchedule;
        statistics.value = response.data.data.statistics;
        return response.data.data;
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      error.value = err.message;
      console.error("Erreur fetchOrganizedSchedule:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Récupérer l'emploi du temps d'un enseignant
  const fetchScheduleOfTeacher = async (teacherId = null, week = null) => {
    try {
      setLoading(true);
      resetError();

      const response = await scheduleService.getScheduleOfTeacher(
        teacherId,
        week
      );

      if (response.data.success) {
        schedules.value = response.data.data.schedules;
        return response.data.data;
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      error.value = err.message;
      console.error("Erreur fetchScheduleOfTeacher:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Récupérer l'emploi du temps de la semaine courante
  const fetchCurrentWeekSchedule = async (classId) => {
    try {
      setLoading(true);
      resetError();

      const response = await scheduleService.getCurrentWeekSchedule(classId);

      if (response.data.success) {
        currentWeekSchedule.value = response.data.data;
        return response.data.data;
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      error.value = err.message;
      console.error("Erreur fetchCurrentWeekSchedule:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Récupérer les semaines disponibles
  const fetchAvailableWeeks = async (classId = null, teacherId = null) => {
    try {
      setLoading(true);
      resetError();

      const response = await scheduleService.getAvailableWeeks(
        classId,
        teacherId
      );

      if (response.data.success) {
        availableWeeks.value = response.data.data;
        return response.data.data;
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      error.value = err.message;
      console.error("Erreur fetchAvailableWeeks:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Ajouter un nouvel emploi du temps
  const addSchedule = async (scheduleData) => {
    try {
      setLoading(true);
      resetError();

      const response = await scheduleService.addSchedule(scheduleData);

      if (response.data.success) {
        // Recharger les données si nécessaire
        await fetchScheduleOfTeacher(scheduleData.teacher_id);
        return response.data.data;
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      error.value = err.message;
      console.error("Erreur addSchedule:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour un emploi du temps
  const updateSchedule = async (scheduleId, updateData) => {
    try {
      setLoading(true);
      resetError();

      const response = await scheduleService.updateSchedule(
        scheduleId,
        updateData
      );

      if (response.data.success) {
        // Recharger les données
        const schedule = schedules.value.find(
          (s) => s.id_schedule === scheduleId
        );
        if (schedule) {
          await fetchScheduleOfTeacher(schedule.teacher_id);
        }
        return response.data.data;
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      error.value = err.message;
      console.error("Erreur updateSchedule:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Supprimer un emploi du temps
  const deleteSchedule = async (scheduleId) => {
    try {
      setLoading(true);
      resetError();

      const response = await scheduleService.deleteSchedule(scheduleId);

      if (response.data.success) {
        // Supprimer du state local
        schedules.value = schedules.value.filter(
          (s) => s.id_schedule !== scheduleId
        );
        return response.data.data;
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      error.value = err.message;
      console.error("Erreur deleteSchedule:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Réinitialiser le store
  const resetStore = () => {
    schedules.value = [];
    organizedSchedule.value = {};
    availableWeeks.value = [];
    currentWeekSchedule.value = {};
    statistics.value = {};
    loading.value = false;
    error.value = null;
  };

  return {
    // State
    schedules,
    organizedSchedule,
    availableWeeks,
    currentWeekSchedule,
    statistics,
    loading,
    error,

    // Getters
    getSchedules,
    getOrganizedSchedule,
    getAvailableWeeks,
    getCurrentWeekSchedule,
    getStatistics,
    isLoading,
    getError,

    // Actions
    resetError,
    setLoading,
    fetchScheduleOfClass,
    fetchOrganizedSchedule,
    fetchScheduleOfTeacher,
    fetchCurrentWeekSchedule,
    fetchAvailableWeeks,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    resetStore,
  };
});
