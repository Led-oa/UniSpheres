import api from "../Connect.backend.js";

export const scheduleService = {
  /**
   * Ajouter un nouvel emploi du temps
   * @param {Object} scheduleData - Données de l'emploi du temps
   * @returns {Promise}
   */
  addSchedule(scheduleData) {
    return api.post("/schedules", scheduleData);
  },

  /**
   * Récupérer l'emploi du temps d'une classe
   * @param {number} classId - ID de la classe
   * @param {string} week - Semaine optionnelle (format: YYYY-MM-DD)
   * @returns {Promise}
   */
  getScheduleOfClass(classId, week = null) {
    const params = week ? { week } : {};
    return api.get(`/schedules/class/${classId}`, { params });
  },

  /**
   * Récupérer l'emploi du temps d'un enseignant
   * @param {number} teacherId - ID de l'enseignant (optionnel, utilise l'utilisateur connecté si null)
   * @param {string} week - Semaine optionnelle (format: YYYY-MM-DD)
   * @returns {Promise}
   */
  getScheduleOfTeacher(teacherId = null, week = null) {
    const endpoint = teacherId
      ? `/schedules/teacher/${teacherId}`
      : "/schedules/teacher";
    const params = week ? { week } : {};
    return api.get(endpoint, { params });
  },

  /**
   * Récupérer l'emploi du temps de la semaine courante d'une classe
   * @param {number} classId - ID de la classe
   * @returns {Promise}
   */
  getCurrentWeekSchedule(classId) {
    return api.get(`/schedules/class/${classId}/current`);
  },

  /**
   * Récupérer les semaines disponibles
   * @param {number} classId - ID de la classe (optionnel)
   * @param {number} teacherId - ID de l'enseignant (optionnel)
   * @returns {Promise}
   */
  getAvailableWeeks(classId = null, teacherId = null) {
    const params = {};
    if (classId) params.classId = classId;
    if (teacherId) params.teacherId = teacherId;

    return api.get("/schedules/weeks", { params });
  },

  /**
   * Mettre à jour un emploi du temps
   * @param {number} scheduleId - ID de l'emploi du temps
   * @param {Object} updateData - Données de mise à jour
   * @returns {Promise}
   */
  updateSchedule(scheduleId, updateData) {
    return api.put(`/schedules/${scheduleId}`, updateData);
  },

  /**
   * Supprimer un emploi du temps
   * @param {number} scheduleId - ID de l'emploi du temps
   * @returns {Promise}
   */
  deleteSchedule(scheduleId) {
    return api.delete(`/schedules/${scheduleId}`);
  },

  /**
   * Récupérer l'emploi du temps organisé d'une classe
   * @param {number} classId - ID de la classe
   * @param {string} week - Semaine optionnelle (format: YYYY-MM-DD)
   * @returns {Promise}
   */
  getOrganizedSchedule(classId, week = null) {
    const params = week ? { week } : {};
    return api.get(`/schedules/class/${classId}/organized`, { params });
  },
};
