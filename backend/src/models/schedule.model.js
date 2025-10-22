const { query } = require("../config/database");

const scheduleModel = {
  async addSchedule(scheduleData) {
    const {
      teacher_id,
      class_id,
      course_id,
      week_start,
      monday_periods,
      tuesday_periods,
      wednesday_periods,
      thursday_periods,
      friday_periods,
      saturday_periods,
    } = scheduleData;

    const sql = `
          INSERT INTO schedule (
            teacher_id, class_id, course_id, week_start,
            monday_periods, tuesday_periods, wednesday_periods,
            thursday_periods, friday_periods, saturday_periods
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

    const params = [
      teacher_id,
      class_id,
      course_id,
      week_start,
      monday_periods ? monday_periods.join(",") : null,
      tuesday_periods ? tuesday_periods.join(",") : null,
      wednesday_periods ? wednesday_periods.join(",") : null,
      thursday_periods ? thursday_periods.join(",") : null,
      friday_periods ? friday_periods.join(",") : null,
      saturday_periods ? saturday_periods.join(",") : null,
    ];

    try {
      const result = await query(sql, params);
      return { success: true, scheduleId: result.insertId };
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        throw new Error(
          "Un emploi du temps existe déjà pour cette combinaison enseignant/classe/cours/semaine"
        );
      }
      throw new Error(
        `Erreur lors de l'ajout de l'emploi du temps: ${error.message}`
      );
    }
  },

  async getScheduleOfClass(classId, currentWeek = null) {
    let sql = `
      SELECT 
        s.id_schedule,
        s.teacher_id,
        s.class_id,
        s.course_id,
        s.week_start,
        s.monday_periods,
        s.tuesday_periods,
        s.wednesday_periods,
        s.thursday_periods,
        s.friday_periods,
        s.saturday_periods,
        s.created_at,
        s.updated_at,
        c.title as course_title,
        u.name as teacher_name,
        u.lastname as teacher_lastname,
        cl.name as class_name
      FROM schedule s
      INNER JOIN course c ON s.course_id = c.id_course
      INNER JOIN user u ON s.teacher_id = u.id_user
      INNER JOIN classe cl ON s.class_id = cl.id_class
      WHERE s.class_id = ?
    `;

    const params = [classId];

    // Si currentWeek est fourni, filtrer par semaine
    if (currentWeek) {
      sql += ` AND s.week_start = ?`;
      params.push(currentWeek);
    }

    sql += ` ORDER BY s.week_start DESC, c.title`;

    try {
      const schedules = await query(sql, params);

      // Transformer les données pour séparer les périodes en tableaux
      return schedules.map((schedule) => ({
        ...schedule,
        monday_periods: schedule.monday_periods
          ? schedule.monday_periods.split(",")
          : [],
        tuesday_periods: schedule.tuesday_periods
          ? schedule.tuesday_periods.split(",")
          : [],
        wednesday_periods: schedule.wednesday_periods
          ? schedule.wednesday_periods.split(",")
          : [],
        thursday_periods: schedule.thursday_periods
          ? schedule.thursday_periods.split(",")
          : [],
        friday_periods: schedule.friday_periods
          ? schedule.friday_periods.split(",")
          : [],
        saturday_periods: schedule.saturday_periods
          ? schedule.saturday_periods.split(",")
          : [],
      }));
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération de l'emploi du temps de la classe: ${error.message}`
      );
    }
  },

  async getScheduleOfTeacher(teacherId, currentWeek = null) {
    let sql = `
      SELECT 
        s.id_schedule,
        s.teacher_id,
        s.class_id,
        s.course_id,
        s.week_start,
        s.monday_periods,
        s.tuesday_periods,
        s.wednesday_periods,
        s.thursday_periods,
        s.friday_periods,
        s.saturday_periods,
        s.created_at,
        s.updated_at,
        c.title as course_title,
        cl.name as class_name,
        f.name as filiere_name,
        p.name as parcours_name,
        y.year_value
      FROM schedule s
      INNER JOIN course c ON s.course_id = c.id_course
      INNER JOIN classe cl ON s.class_id = cl.id_class
      INNER JOIN filiere f ON cl.filiere_id = f.id_filiere
      INNER JOIN parcours p ON cl.parcours_id = p.id_parcours
      INNER JOIN year y ON cl.year_id = y.id_year
      WHERE s.teacher_id = ?
    `;

    const params = [teacherId];

    // Si currentWeek est fourni, filtrer par semaine
    if (currentWeek) {
      sql += ` AND s.week_start = ?`;
      params.push(currentWeek);
    }

    sql += ` ORDER BY s.week_start DESC, cl.name, c.title`;

    try {
      const schedules = await query(sql, params);

      return schedules.map((schedule) => ({
        ...schedule,
        monday_periods: schedule.monday_periods
          ? schedule.monday_periods.split(",")
          : [],
        tuesday_periods: schedule.tuesday_periods
          ? schedule.tuesday_periods.split(",")
          : [],
        wednesday_periods: schedule.wednesday_periods
          ? schedule.wednesday_periods.split(",")
          : [],
        thursday_periods: schedule.thursday_periods
          ? schedule.thursday_periods.split(",")
          : [],
        friday_periods: schedule.friday_periods
          ? schedule.friday_periods.split(",")
          : [],
        saturday_periods: schedule.saturday_periods
          ? schedule.saturday_periods.split(",")
          : [],
      }));
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération de l'emploi du temps de l'enseignant: ${error.message}`
      );
    }
  },

  async updateScheduleOfClassByTeacher(
    scheduleId,
    classId,
    teacherId,
    updateData
  ) {
    // Vérifier d'abord que l'emploi du temps appartient à l'enseignant et à la classe
    const checkSql = `
          SELECT id_schedule FROM schedule 
          WHERE id_schedule = ? AND teacher_id = ? AND class_id = ?
        `;

    try {
      const existingSchedule = await query(checkSql, [
        scheduleId,
        teacherId,
        classId,
      ]);

      if (existingSchedule.length === 0) {
        throw new Error("Emploi du temps non trouvé ou non autorisé");
      }

      // Construire la requête de mise à jour dynamiquement
      const updateFields = [];
      const updateParams = [];

      const fields = [
        "monday_periods",
        "tuesday_periods",
        "wednesday_periods",
        "thursday_periods",
        "friday_periods",
        "saturday_periods",
      ];

      fields.forEach((field) => {
        if (updateData[field] !== undefined) {
          updateFields.push(`${field} = ?`);
          updateParams.push(
            updateData[field] ? updateData[field].join(",") : null
          );
        }
      });

      if (updateFields.length === 0) {
        throw new Error("Aucune donnée à mettre à jour");
      }

      updateParams.push(scheduleId, teacherId, classId);

      const updateSql = `
            UPDATE schedule 
            SET ${updateFields.join(", ")}, updated_at = CURRENT_TIMESTAMP
            WHERE id_schedule = ? AND teacher_id = ? AND class_id = ?
          `;

      const result = await query(updateSql, updateParams);

      return {
        success: true,
        affectedRows: result.affectedRows,
        message:
          result.affectedRows > 0
            ? "Emploi du temps mis à jour avec succès"
            : "Aucune modification effectuée",
      };
    } catch (error) {
      throw new Error(
        `Erreur lors de la mise à jour de l'emploi du temps: ${error.message}`
      );
    }
  },

  async removeScheduleOfClassByTeacher(scheduleId, teacherId) {
    const sql = `
          DELETE FROM schedule 
          WHERE id_schedule = ? AND teacher_id = ?
        `;

    try {
      const result = await query(sql, [scheduleId, teacherId]);

      return {
        success: true,
        affectedRows: result.affectedRows,
        message:
          result.affectedRows > 0
            ? "Emploi du temps supprimé avec succès"
            : "Aucun emploi du temps trouvé",
      };
    } catch (error) {
      throw new Error(
        `Erreur lors de la suppression de l'emploi du temps: ${error.message}`
      );
    }
  },

  // Méthode utilitaire pour vérifier les conflits d'emploi du temps
  async checkScheduleConflict(
    teacherId,
    classId,
    weekStart,
    scheduleId = null
  ) {
    let sql = `
          SELECT id_schedule FROM schedule 
          WHERE teacher_id = ? AND class_id = ? AND week_start = ?
        `;
    const params = [teacherId, classId, weekStart];

    if (scheduleId) {
      sql += ` AND id_schedule != ?`;
      params.push(scheduleId);
    }

    try {
      const conflicts = await query(sql, params);
      return conflicts.length > 0;
    } catch (error) {
      throw new Error(
        `Erreur lors de la vérification des conflits: ${error.message}`
      );
    }
  },

  // Nouvelle méthode pour récupérer toutes les semaines disponibles
  async getAvailableWeeks(classId = null, teacherId = null) {
    let sql = `SELECT DISTINCT week_start FROM schedule`;
    const params = [];

    if (classId || teacherId) {
      sql += ` WHERE`;
      const conditions = [];

      if (classId) {
        conditions.push(` class_id = ?`);
        params.push(classId);
      }

      if (teacherId) {
        conditions.push(` teacher_id = ?`);
        params.push(teacherId);
      }

      sql += conditions.join(" AND");
    }

    sql += ` ORDER BY week_start DESC`;

    try {
      const weeks = await query(sql, params);
      return weeks.map((week) => week.week_start);
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération des semaines disponibles: ${error.message}`
      );
    }
  },
};

module.exports = scheduleModel;
