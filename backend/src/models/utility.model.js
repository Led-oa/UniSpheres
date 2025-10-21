const { query } = require("../config/database");
const dotenv = require("dotenv");

const utilityModel = {
  // 1. Compter les lignes dans chaque table
  async countAllTables() {
    const sql = `
      SELECT table_name, table_rows 
      FROM information_schema.tables 
      WHERE table_schema = '${process.env.DB_NAME}';
    `;
    return await query(sql);
  },

  // 2. Dernières annonces
  async getLastAnnonces(limit = 5) {
    const sql = `
      SELECT * 
      FROM annonce 
      ORDER BY created_at DESC 
      LIMIT ?;
    `;
    return await query(sql, [limit]);
  },

  // 3. Nombre de cours dans une classe
  async countCoursesInClass(classId) {
    const sql = `
      SELECT COUNT(*) AS nb_cours 
      FROM course 
      WHERE class_id = ?;
    `;
    const result = await query(sql, [classId]);
    return result[0].nb_cours;
  },

  // 4. Nombre de cours d’un enseignant
  async countCoursesByTeacher(teacherId) {
    const sql = `
      SELECT COUNT(*) AS nb_cours 
      FROM course 
      WHERE teach_by = ?;
    `;
    const result = await query(sql, [teacherId]);
    return result[0].nb_cours;
  },

  // 5. Nombre de classes d’un enseignant
  async countClassesByTeacher(teacherId) {
    const sql = `
      SELECT COUNT(DISTINCT class_id) AS nb_classes 
      FROM course 
      WHERE teach_by = ?;
    `;
    const result = await query(sql, [teacherId]);
    return result[0].nb_classes;
  },
};

module.exports = utilityModel;
