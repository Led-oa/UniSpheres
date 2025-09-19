const { query } = require("../config/database");

const NoteModel = {
  // Insère ou met à jour une note
  async upSert(noteData) {
    const sql = `
      INSERT INTO note (course_id, student_id, note_ds, note_examen, note_final)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
          note_ds     = COALESCE(VALUES(note_ds), note_ds),
          note_examen = COALESCE(VALUES(note_examen), note_examen),
          note_final  = COALESCE(VALUES(note_final), note_final),
          updated_at  = CURRENT_TIMESTAMP;
    `;
    const params = [
      noteData.course_id,
      noteData.student_id,
      noteData.note_ds,
      noteData.note_examen,
      noteData.note_final,
    ];
    return query(sql, params);
  },

  async bulkUpsert(notes) {
    const placeholders = notes.map(() => "(?, ?, ?, ?, ?)").join(", ");
    const sql = `
      INSERT INTO note (course_id, student_id, note_ds, note_examen, note_final)
      VALUES ${placeholders}
      ON DUPLICATE KEY UPDATE
        note_ds     = COALESCE(VALUES(note_ds), note_ds),
        note_examen = COALESCE(VALUES(note_examen), note_examen),
        note_final  = COALESCE(VALUES(note_final), note_final),
        updated_at  = CURRENT_TIMESTAMP;
    `;

    const params = [];
    for (const n of notes) {
      params.push(
        n.course_id,
        n.student_id,
        n.note_ds,
        n.note_examen,
        n.note_final
      );
    }

    return query(sql, params);
  },

  // Note d’un étudiant précis dans un cours précis
  async fetchByCourseForStudent(courseId, studentId) {
    const sql = `
      SELECT n.*, u.name AS student_name, u.email AS student_email
      FROM note n
      JOIN user u ON u.id_user = n.student_id
      WHERE n.course_id = ? AND n.student_id = ?;
    `;
    return query(sql, [courseId, studentId]);
  },

  // Toutes les notes d’un cours
  async fetchByCourse(courseId) {
    const sql = `
      SELECT n.*, u.name AS student_name, u.lastname AS student_lastname, u.matricule AS student_matricule ,u.email AS student_email
      FROM note n
      JOIN user u ON u.id_user = n.student_id
      WHERE n.course_id = ?
      ORDER BY u.name;
    `;
    return query(sql, [courseId]);
  },

  // Toutes les notes d’un étudiant (tous les cours)
  async fetchByStudents(studentId) {
    const sql = `
      SELECT n.*, c.title AS course_title
      FROM note n
      JOIN course c ON c.id_course = n.course_id
      WHERE n.student_id = ?
      ORDER BY c.title;
    `;
    return query(sql, [studentId]);
  },

  // Notes de tous les étudiants d’une classe pour un cours donné
  async fetchByCourseAndClassForStudents(courseId, classId) {
    const sql = `
      SELECT n.*, u.name AS student_name, u.lastname AS student_lastname, u.matricule AS student_matricule ,u.email AS student_email
      FROM note n
      JOIN user u ON u.id_user = n.student_id
      JOIN course c ON c.id_course = n.course_id
      WHERE n.course_id = ? AND c.class_id = ?
      ORDER BY u.name;
    `;
    return query(sql, [courseId, classId]);
  },

  // Mise à jour d’une note existante (par id_note)
  async update(noteId, noteData) {
    const sql = `
      UPDATE note
      SET
        note_ds     = COALESCE(?, note_ds),
        note_examen = COALESCE(?, note_examen),
        note_final  = COALESCE(?, note_final),
        updated_at  = CURRENT_TIMESTAMP
      WHERE id_note = ?;
    `;
    return query(sql, [
      noteData.note_ds,
      noteData.note_examen,
      noteData.note_final,
      noteId,
    ]);
  },

  // Suppression d’une note
  async delete(noteId) {
    const sql = `DELETE FROM note WHERE id_note = ?;`;
    return query(sql, [noteId]);
  },
};

module.exports = NoteModel;
