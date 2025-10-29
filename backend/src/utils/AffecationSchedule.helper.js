const Affectation = {
  /**
   * Organise les schedules en utilisant un algorithme d'affectation optimisée
   * @param {Array} data - Les données brutes des schedules depuis la base
   * @returns {Object} - Emploi du temps organisé
   */
  schedule: (data) => {
    if (!data || data.length === 0) {
      return {
        lundi: { P1: [], P2: [], P3: [], P4: [] },
        mardi: { P1: [], P2: [], P3: [], P4: [] },
        mercredi: { P1: [], P2: [], P3: [], P4: [] },
        jeudi: { P1: [], P2: [], P3: [], P4: [] },
        vendredi: { P1: [], P2: [], P3: [], P4: [] },
        samedi: { P1: [], P2: [], P3: [], P4: [] },
      };
    }

    // Structure finale organisée
    const organizedSchedule = {
      lundi: { P1: [], P2: [], P3: [], P4: [] },
      mardi: { P1: [], P2: [], P3: [], P4: [] },
      mercredi: { P1: [], P2: [], P3: [], P4: [] },
      jeudi: { P1: [], P2: [], P3: [], P4: [] },
      vendredi: { P1: [], P2: [], P3: [], P4: [] },
      samedi: { P1: [], P2: [], P3: [], P4: [] },
    };

    // Mapping des jours
    const dayMapping = {
      monday_periods: "lundi",
      tuesday_periods: "mardi",
      wednesday_periods: "mercredi",
      thursday_periods: "jeudi",
      friday_periods: "vendredi",
      saturday_periods: "samedi",
    };

    // Trier les cours par priorité (durée ou crédits)
    const sortedSchedules = [...data].sort((a, b) => {
      // Priorité aux cours avec plus de périodes demandées
      const aPeriods = Object.values(dayMapping).reduce(
        (total, dayKey) => total + (a[`${dayKey}_periods`]?.length || 0),
        0
      );
      const bPeriods = Object.values(dayMapping).reduce(
        (total, dayKey) => total + (b[`${dayKey}_periods`]?.length || 0),
        0
      );

      return bPeriods - aPeriods; // Cours avec plus de périodes en premier
    });

    // Fonction pour vérifier les conflits
    const hasConflict = (schedule, day, period) => {
      const existingSchedules = organizedSchedule[day][period];

      // Vérifier conflit d'enseignant (même enseignant ne peut être à 2 endroits)
      const teacherConflict = existingSchedules.some(
        (existing) => existing.teacher_id === schedule.teacher_id
      );

      // Vérifier conflit de cours (même cours ne peut être à la même période)
      const courseConflict = existingSchedules.some(
        (existing) => existing.course_id === schedule.course_id
      );

      return teacherConflict || courseConflict;
    };

    // Fonction pour trouver le meilleur créneau disponible
    const findBestSlot = (schedule, preferredDay, preferredPeriods) => {
      // Essayer d'abord les créneaux préférés
      for (const period of preferredPeriods) {
        if (!hasConflict(schedule, preferredDay, period)) {
          return { day: preferredDay, period, isPreferred: true };
        }
      }

      // Si pas de créneau disponible dans les préférés, chercher ailleurs
      const allDays = [
        "lundi",
        "mardi",
        "mercredi",
        "jeudi",
        "vendredi",
        "samedi",
      ];
      const allPeriods = ["P1", "P2", "P3", "P4"];

      for (const day of allDays) {
        for (const period of allPeriods) {
          if (!hasConflict(schedule, day, period)) {
            return { day, period, isPreferred: false };
          }
        }
      }

      return null; // Aucun créneau disponible
    };

    // Algorithme d'affectation principale
    sortedSchedules.forEach((schedule) => {
      // Traiter chaque jour préféré de l'enseignant
      Object.keys(dayMapping).forEach((dayKey) => {
        const dayName = dayMapping[dayKey];
        const preferredPeriods = schedule[dayKey] || [];

        if (preferredPeriods.length > 0) {
          const bestSlot = findBestSlot(schedule, dayName, preferredPeriods);

          if (bestSlot) {
            organizedSchedule[bestSlot.day][bestSlot.period].push({
              id_schedule: schedule.id_schedule,
              course_title: schedule.course_title,
              teacher_name: `${schedule.teacher_name} ${schedule.teacher_lastname}`,
              teacher_id: schedule.teacher_id,
              course_id: schedule.course_id,
              is_preferred: bestSlot.isPreferred,
              original_preferences: {
                day: dayName,
                periods: preferredPeriods,
              },
            });
          }
        }
      });
    });

    return organizedSchedule;
  },

  /**
   * Calcule les statistiques d'optimisation
   * @param {Object} organizedSchedule - Emploi du temps organisé
   * @param {Array} originalData - Données originales
   * @returns {Object} - Statistiques
   */
  getStatistics: (organizedSchedule, originalData) => {
    let totalAssignments = 0;
    let preferredAssignments = 0;
    let teacherAssignments = {};
    let courseAssignments = {};

    // Compter les affectations
    Object.keys(organizedSchedule).forEach((day) => {
      Object.keys(organizedSchedule[day]).forEach((period) => {
        const assignments = organizedSchedule[day][period];
        totalAssignments += assignments.length;

        assignments.forEach((assignment) => {
          if (assignment.is_preferred) {
            preferredAssignments++;
          }

          // Statistiques par enseignant
          if (!teacherAssignments[assignment.teacher_id]) {
            teacherAssignments[assignment.teacher_id] = {
              name: assignment.teacher_name,
              count: 0,
            };
          }
          teacherAssignments[assignment.teacher_id].count++;

          // Statistiques par cours
          if (!courseAssignments[assignment.course_id]) {
            courseAssignments[assignment.course_id] = {
              title: assignment.course_title,
              count: 0,
            };
          }
          courseAssignments[assignment.course_id].count++;
        });
      });
    });

    const preferenceSatisfaction =
      totalAssignments > 0
        ? Math.round((preferredAssignments / totalAssignments) * 100)
        : 0;

    return {
      totalAssignments,
      preferredAssignments,
      preferenceSatisfaction: `${preferenceSatisfaction}%`,
      teacherDistribution: teacherAssignments,
      courseDistribution: courseAssignments,
      totalCourses: originalData.length,
      totalTeachers: Object.keys(teacherAssignments).length,
    };
  },

  /**
   * Formatte les données pour l'affichage frontend
   * @param {Object} organizedSchedule - Emploi du temps organisé
   * @returns {Array} - Format tableau pour affichage
   */
  formatForDisplay: (organizedSchedule) => {
    const days = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
    const periods = ["P1", "P2", "P3", "P4"];

    const displayData = [
      [
        "Créneau",
        ...days.map((day) => day.charAt(0).toUpperCase() + day.slice(1)),
      ],
    ];

    periods.forEach((period) => {
      const row = [period];
      days.forEach((day) => {
        const courses = organizedSchedule[day][period];
        if (courses.length > 0) {
          const courseText = courses
            .map(
              (course) =>
                `${course.course_title} - ${course.teacher_name.split(" ")[0]}`
            )
            .join("\n");
          row.push(courseText);
        } else {
          row.push("Libre");
        }
      });
      displayData.push(row);
    });

    return displayData;
  },
};

module.exports = Affectation;
