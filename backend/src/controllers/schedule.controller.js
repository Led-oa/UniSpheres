const scheduleService = require("../services/schedule.service");

const scheduleController = {
  async addSchedule(req, res) {
    try {
      // Récupérer les données du body
      const scheduleData = req.body;

      // Ajouter l'ID de l'enseignant à partir du token si non fourni
      if (!scheduleData.teacher_id && req.user.role === "teacher") {
        scheduleData.teacher_id = req.user.id_user;
      }

      // Vérifier que l'utilisateur a le droit d'ajouter cet emploi du temps
      if (
        req.user.role === "teacher" &&
        scheduleData.teacher_id !== req.user.id_user
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Vous n'êtes pas autorisé à ajouter un emploi du temps pour un autre enseignant",
        });
      }

      const result = await scheduleService.addSchedule(scheduleData);

      if (result.success) {
        return res.status(201).json({
          success: true,
          message: result.message,
          data: result.data,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: result.message,
          data: null,
        });
      }
    } catch (error) {
      console.error("Erreur dans addSchedule:", error);
      return res.status(500).json({
        success: false,
        message: "Erreur interne du serveur",
        data: null,
      });
    }
  },

  async getScheduleOfClasse(req, res) {
    try {
      const classId = req.params.classId;
      const currentWeek = req.query.week || null;

      // Vérification des permissions
      if (req.user.role === "student") {
        // Un étudiant ne peut voir que l'emploi du temps de sa propre classe
        if (req.user.class_id !== parseInt(classId)) {
          return res.status(403).json({
            success: false,
            message:
              "Vous n'êtes pas autorisé à voir l'emploi du temps de cette classe",
          });
        }
      }

      const result = await scheduleService.findScheduleOfClass(
        classId,
        currentWeek
      );

      if (result.success) {
        return res.status(200).json({
          success: true,
          message: result.message,
          data: result.data,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: result.message,
          data: null,
        });
      }
    } catch (error) {
      console.error("Erreur dans getScheduleOfClasse:", error);
      return res.status(500).json({
        success: false,
        message: "Erreur interne du serveur",
        data: null,
      });
    }
  },

  async getScheduleOfTeacher(req, res) {
    try {
      let teacherId = req.params.teacherId;
      const currentWeek = req.query.week || null;

      // Si l'utilisateur est un enseignant et qu'aucun teacherId n'est spécifié, utiliser son propre ID
      if (!teacherId && req.user.role === "teacher") {
        teacherId = req.user.id_user;
      }

      // Vérification des permissions
      if (
        req.user.role === "teacher" &&
        parseInt(teacherId) !== req.user.id_user
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Vous n'êtes pas autorisé à voir l'emploi du temps d'un autre enseignant",
        });
      }

      const result = await scheduleService.findScheduleOfTeacher(
        teacherId,
        currentWeek
      );

      if (result.success) {
        return res.status(200).json({
          success: true,
          message: result.message,
          data: result.data,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: result.message,
          data: null,
        });
      }
    } catch (error) {
      console.error("Erreur dans getScheduleOfTeacher:", error);
      return res.status(500).json({
        success: false,
        message: "Erreur interne du serveur",
        data: null,
      });
    }
  },

  async updateSchedule(req, res) {
    try {
      const scheduleId = req.params.scheduleId;
      const { class_id, ...updateData } = req.body;
      const classId = class_id || req.body.classId;

      if (!classId) {
        return res.status(400).json({
          success: false,
          message: "L'ID de classe est requis",
        });
      }

      // Vérifier que l'utilisateur est l'enseignant propriétaire de cet emploi du temps
      if (req.user.role === "teacher") {
        // Récupérer l'emploi du temps pour vérifier la propriété
        const scheduleCheck = await scheduleService.findScheduleOfTeacher(
          req.user.id_user
        );
        if (scheduleCheck.success) {
          const userSchedule = scheduleCheck.data.schedules.find(
            (s) => s.id_schedule === parseInt(scheduleId)
          );
          if (!userSchedule) {
            return res.status(403).json({
              success: false,
              message:
                "Vous n'êtes pas autorisé à modifier cet emploi du temps",
            });
          }
        }
      }

      const result = await scheduleService.updateSchedule(
        scheduleId,
        classId,
        req.user.id_user,
        updateData
      );

      if (result.success) {
        return res.status(200).json({
          success: true,
          message: result.message,
          data: result.data,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: result.message,
          data: null,
        });
      }
    } catch (error) {
      console.error("Erreur dans updateSchedule:", error);
      return res.status(500).json({
        success: false,
        message: "Erreur interne du serveur",
        data: null,
      });
    }
  },

  async deleteSchedule(req, res) {
    try {
      const scheduleId = req.params.scheduleId;

      // Vérifier que l'utilisateur est l'enseignant propriétaire de cet emploi du temps
      if (req.user.role === "teacher") {
        // Récupérer l'emploi du temps pour vérifier la propriété
        const scheduleCheck = await scheduleService.findScheduleOfTeacher(
          req.user.id_user
        );
        if (scheduleCheck.success) {
          const userSchedule = scheduleCheck.data.schedules.find(
            (s) => s.id_schedule === parseInt(scheduleId)
          );
          if (!userSchedule) {
            return res.status(403).json({
              success: false,
              message:
                "Vous n'êtes pas autorisé à supprimer cet emploi du temps",
            });
          }
        }
      }

      const result = await scheduleService.deleteSchedule(
        scheduleId,
        req.user.id_user
      );

      if (result.success) {
        return res.status(200).json({
          success: true,
          message: result.message,
          data: result.data,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: result.message,
          data: null,
        });
      }
    } catch (error) {
      console.error("Erreur dans deleteSchedule:", error);
      return res.status(500).json({
        success: false,
        message: "Erreur interne du serveur",
        data: null,
      });
    }
  },

  // Méthode supplémentaire pour récupérer l'emploi du temps de la semaine courante
  async getCurrentWeekSchedule(req, res) {
    try {
      const classId = req.params.classId;

      // Vérification des permissions pour les étudiants
      if (
        req.user.role === "student" &&
        req.user.class_id !== parseInt(classId)
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Vous n'êtes pas autorisé à voir l'emploi du temps de cette classe",
        });
      }

      const result = await scheduleService.findCurrentWeekSchedule(classId);

      if (result.success) {
        return res.status(200).json({
          success: true,
          message: result.message,
          data: result.data,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: result.message,
          data: null,
        });
      }
    } catch (error) {
      console.error("Erreur dans getCurrentWeekSchedule:", error);
      return res.status(500).json({
        success: false,
        message: "Erreur interne du serveur",
        data: null,
      });
    }
  },

  // Méthode pour récupérer les semaines disponibles
  async getAvailableWeeks(req, res) {
    try {
      const classId = req.query.classId || null;
      const teacherId = req.query.teacherId || null;

      // Vérification des permissions
      if (
        req.user.role === "teacher" &&
        teacherId &&
        parseInt(teacherId) !== req.user.id_user
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Vous n'êtes pas autorisé à voir les semaines d'un autre enseignant",
        });
      }

      if (
        req.user.role === "student" &&
        classId &&
        parseInt(classId) !== req.user.class_id
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Vous n'êtes pas autorisé à voir les semaines de cette classe",
        });
      }

      const result = await scheduleService.getAvailableWeeks(
        classId,
        teacherId
      );

      if (result.success) {
        return res.status(200).json({
          success: true,
          message: result.message,
          data: result.data,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: result.message,
          data: null,
        });
      }
    } catch (error) {
      console.error("Erreur dans getAvailableWeeks:", error);
      return res.status(500).json({
        success: false,
        message: "Erreur interne du serveur",
        data: null,
      });
    }
  },
};

module.exports = scheduleController;
