const { query } = require("../config/database");

const ClasseModel = {
  // Récupérer toutes les classes avec leurs informations liées
  async getAll() {
    const sql = `
      SELECT c.*, f.name AS filiere_name, p.name AS parcours_name, y.year_value
      FROM classe c
      JOIN filiere f ON c.filiere_id = f.id_filiere
      JOIN parcours p ON c.parcours_id = p.id_parcours
      JOIN year y ON c.year_id = y.id_year
    `;
    const rows = await query(sql);
    return rows;
  },

  // Récupérer une classe par ID
  async getById(id) {
    const sql = `
      SELECT c.*, f.name AS filiere_name, p.name AS parcours_name, y.year_value
      FROM classe c
      JOIN filiere f ON c.filiere_id = f.id_filiere
      JOIN parcours p ON c.parcours_id = p.id_parcours
      JOIN year y ON c.year_id = y.id_year
      WHERE c.id_class = ?
    `;
    const rows = await query(sql, [id]);
    return rows[0];
  },

  async getByTeacher(teacherId) {
    const sql = `
        SELECT DISTINCT 
      c.*,
      f.name AS filiere_name,
      p.name AS parcours_name,
      y.year_value AS year_value
    FROM classe c
    INNER JOIN course co ON c.id_class = co.class_id
    INNER JOIN filiere f ON c.filiere_id = f.id_filiere
    INNER JOIN parcours p ON c.parcours_id = p.id_parcours
    INNER JOIN year y ON c.year_id = y.id_year
    WHERE co.teach_by = ?
    ORDER BY c.name
  `;
    const rows = await query(sql, [teacherId]);
    return rows;
  },

  async getStudentByClass(classId) {
    const sql = `SELECT * FROM user WHERE class_id = ?`;
    const rows = await query(sql, [classId]);
    return rows;
  },

  async getTeacherByClass(classId) {
    const sql = `SELECT DISTINCT
                    u.*
                 FROM
                    USER u
                 INNER JOIN course c ON
                    u.id_user = c.teach_by
                 WHERE
                    u.role = 'teacher' AND c.class_id = ?
                 ORDER BY
                    u.name;`;
    const rows = await query(sql, [classId]);
    return rows;
  },

  // Créer une nouvelle classe
  async create(data) {
    const sql = `
      INSERT INTO classe (name, filiere_id, parcours_id, year_id)
      VALUES (?, ?, ?, ?)
    `;
    const result = await query(sql, [
      data.name,
      data.filiere_id,
      data.parcours_id,
      data.year_id,
    ]);
    return { id_class: result.insertId, ...data };
  },

  // Mettre à jour une classe
  async update(id, data) {
    const sql = `
      UPDATE classe SET name = ?, filiere_id = ?, parcours_id = ?, year_id = ?
      WHERE id_class = ?
    `;
    await query(sql, [
      data.name,
      data.filiere_id,
      data.parcours_id,
      data.year_id,
      id,
    ]);
    return { id_class: id, ...data };
  },

  // Supprimer une classe
  async delete(id) {
    const sql = `DELETE FROM classe WHERE id_class = ?`;
    await query(sql, [id]);
    return { deleted: true, id_class: id };
  },
};

module.exports = ClasseModel;
