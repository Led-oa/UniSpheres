const scheduleModel = require("../models/schedule.model");

const Affectation = require("../utils/AffecationSchedule.helper");

const scheduleService = {
  async addSchedule(scheduleData) {
    try {
      // Validation des données requises
      const requiredFields = [
        "teacher_id",
        "class_id",
        "course_id",
        "week_start",
      ];
      const missingFields = requiredFields.filter(
        (field) => !scheduleData[field]
      );

      if (missingFields.length > 0) {
        throw new Error(`Champs manquants: ${missingFields.join(", ")}`);
      }

      // Validation du format de la date
      const weekStart = new Date(scheduleData.week_start);
      if (isNaN(weekStart.getTime())) {
        throw new Error("Format de date invalide pour week_start");
      }

      // Vérifier que week_start est un lundi
      const dayOfWeek = weekStart.getDay();
      if (dayOfWeek !== 1) {
        // 1 = lundi
        throw new Error("La date week_start doit être un lundi");
      }

      // Validation des périodes
      const days = [
        "monday_periods",
        "tuesday_periods",
        "wednesday_periods",
        "thursday_periods",
        "friday_periods",
        "saturday_periods",
      ];
      const validPeriods = ["P1", "P2", "P3", "P4"];

      for (const day of days) {
        if (scheduleData[day] && Array.isArray(scheduleData[day])) {
          const invalidPeriods = scheduleData[day].filter(
            (period) => !validPeriods.includes(period)
          );
          if (invalidPeriods.length > 0) {
            throw new Error(
              `Périodes invalides pour ${day}: ${invalidPeriods.join(
                ", "
              )}. Périodes valides: P1, P2, P3, P4`
            );
          }
        }
      }

      // Vérifier les conflits d'emploi du temps
      const hasConflict = await scheduleModel.checkScheduleConflict(
        scheduleData.teacher_id,
        scheduleData.class_id,
        scheduleData.week_start
      );

      if (hasConflict) {
        throw new Error(
          "Un emploi du temps existe déjà pour cette combinaison enseignant/classe/semaine"
        );
      }

      // Ajouter l'emploi du temps
      const result = await scheduleModel.addSchedule(scheduleData);
      return {
        success: true,
        message: "Emploi du temps ajouté avec succès",
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  },

  async findScheduleOfClass(classId, currentWeek = null) {
    try {
      // Validation de l'ID de classe
      if (!classId || isNaN(parseInt(classId))) {
        throw new Error("ID de classe invalide");
      }

      // Validation de currentWeek si fourni
      if (currentWeek) {
        const weekDate = new Date(currentWeek);
        if (isNaN(weekDate.getTime())) {
          throw new Error("Format de date invalide pour currentWeek");
        }
      }

      const schedules = await scheduleModel.getScheduleOfClass(
        parseInt(classId),
        currentWeek
      );

      // Grouper par semaine pour une meilleure organisation (seulement si pas de filtre par semaine)
      let groupedByWeek = {};
      if (!currentWeek) {
        groupedByWeek = schedules.reduce((acc, schedule) => {
          const weekKey = schedule.week_start;
          if (!acc[weekKey]) {
            acc[weekKey] = [];
          }
          acc[weekKey].push(schedule);
          return acc;
        }, {});
      }

      return {
        success: true,
        message: currentWeek
          ? `Emploi du temps de la semaine ${currentWeek} récupéré avec succès`
          : "Emploi du temps récupéré avec succès",
        data: {
          schedules,
          groupedByWeek: currentWeek
            ? { [currentWeek]: schedules }
            : groupedByWeek,
          currentWeek,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  },

  async findScheduleOfTeacher(teacherId, currentWeek = null) {
    try {
      // Validation de l'ID de l'enseignant
      if (!teacherId || isNaN(parseInt(teacherId))) {
        throw new Error("ID d'enseignant invalide");
      }

      // Validation de currentWeek si fourni
      if (currentWeek) {
        const weekDate = new Date(currentWeek);
        if (isNaN(weekDate.getTime())) {
          throw new Error("Format de date invalide pour currentWeek");
        }
      }

      const schedules = await scheduleModel.getScheduleOfTeacher(
        parseInt(teacherId),
        currentWeek
      );

      // Organiser les données par semaine et classe (seulement si pas de filtre par semaine)
      let organizedData = {};
      if (!currentWeek) {
        organizedData = schedules.reduce((acc, schedule) => {
          const weekKey = schedule.week_start;
          const classKey = schedule.class_name;

          if (!acc[weekKey]) {
            acc[weekKey] = {};
          }
          if (!acc[weekKey][classKey]) {
            acc[weekKey][classKey] = [];
          }

          acc[weekKey][classKey].push(schedule);
          return acc;
        }, {});
      } else {
        // Si filtre par semaine, organiser seulement par classe
        organizedData = schedules.reduce((acc, schedule) => {
          const classKey = schedule.class_name;
          if (!acc[classKey]) {
            acc[classKey] = [];
          }
          acc[classKey].push(schedule);
          return acc;
        }, {});
      }

      return {
        success: true,
        message: currentWeek
          ? `Emploi du temps de l'enseignant pour la semaine ${currentWeek} récupéré avec succès`
          : "Emploi du temps de l'enseignant récupéré avec succès",
        data: {
          schedules,
          organizedData,
          currentWeek,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  },

  async findOrganizedSchedule(classId, currentWeek = null) {
    try {
      // Utilise la méthode existante pour récupérer les données
      const result = await this.findScheduleOfClass(classId, currentWeek);
      
      if (!result.success) {
        return result; // Retourne l'erreur existante
      }

      // Applique l'algorithme d'affectation
      const organizedSchedule = Affectation.schedule(result.data.schedules);
      const statistics = Affectation.getStatistics(organizedSchedule, result.data.schedules);
      const displayData = Affectation.formatForDisplay(organizedSchedule);

      return {
        success: true,
        message: `Emploi du temps organisé ${currentWeek ? `pour la semaine ${currentWeek}` : ''}`,
        data: {
          organizedSchedule,
          statistics,
          displayData,
          originalData: result.data.schedules,
          currentWeek
        }
      };

    } catch (error) {
      return {
        success: false,
        message: `Erreur d'organisation: ${error.message}`,
        data: null
      };
    }
  },

  async updateSchedule(scheduleId, classId, teacherId, updateData) {
    try {
      // Validation des IDs
      if (!scheduleId || isNaN(parseInt(scheduleId))) {
        throw new Error("ID d'emploi du temps invalide");
      }
      if (!classId || isNaN(parseInt(classId))) {
        throw new Error("ID de classe invalide");
      }
      if (!teacherId || isNaN(parseInt(teacherId))) {
        throw new Error("ID d'enseignant invalide");
      }

      // Validation des données de mise à jour
      if (!updateData || Object.keys(updateData).length === 0) {
        throw new Error("Aucune donnée de mise à jour fournie");
      }

      // Validation des périodes si présentes dans updateData
      const validPeriods = ["P1", "P2", "P3", "P4"];
      const days = [
        "monday_periods",
        "tuesday_periods",
        "wednesday_periods",
        "thursday_periods",
        "friday_periods",
        "saturday_periods",
      ];

      for (const day of days) {
        if (updateData[day] && Array.isArray(updateData[day])) {
          const invalidPeriods = updateData[day].filter(
            (period) => !validPeriods.includes(period)
          );
          if (invalidPeriods.length > 0) {
            throw new Error(
              `Périodes invalides pour ${day}: ${invalidPeriods.join(", ")}`
            );
          }
        }
      }

      const result = await scheduleModel.updateScheduleOfClassByTeacher(
        parseInt(scheduleId),
        parseInt(classId),
        parseInt(teacherId),
        updateData
      );

      if (result.affectedRows === 0) {
        throw new Error(
          "Aucun emploi du temps trouvé ou non autorisé à modifier"
        );
      }

      return {
        success: true,
        message: result.message,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  },

  async deleteSchedule(scheduleId, teacherId) {
    try {
      // Validation des IDs
      if (!scheduleId || isNaN(parseInt(scheduleId))) {
        throw new Error("ID d'emploi du temps invalide");
      }
      if (!teacherId || isNaN(parseInt(teacherId))) {
        throw new Error("ID d'enseignant invalide");
      }

      const result = await scheduleModel.removeScheduleOfClassByTeacher(
        parseInt(scheduleId),
        parseInt(teacherId)
      );

      if (result.affectedRows === 0) {
        throw new Error(
          "Aucun emploi du temps trouvé ou non autorisé à supprimer"
        );
      }

      return {
        success: true,
        message: result.message,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  },

  // Méthode pour récupérer l'emploi du temps de la semaine courante (maintenant simplifiée)
  async findCurrentWeekSchedule(classId) {
    try {
      // Calculer le lundi de la semaine courante
      const today = new Date();
      const currentMonday = new Date(today);
      currentMonday.setDate(
        today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)
      );
      const weekStart = currentMonday.toISOString().split("T")[0];

      // Utiliser la méthode mise à jour avec le paramètre currentWeek
      return await this.findScheduleOfClass(classId, weekStart);
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  },

  async getAvailableWeeks(classId = null, teacherId = null) {
    try {
      const weeks = await scheduleModel.getAvailableWeeks(classId, teacherId);

      return {
        success: true,
        message: "Semaines disponibles récupérées avec succès",
        data: weeks,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  },
};

module.exports = scheduleService;
