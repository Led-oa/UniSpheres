const NoteModel = require("../models/note.model");

const NoteService = {
  async upsertOne(noteData) {
    if (!noteData.course_id || !noteData.student_id) {
      throw new Error("course_id et student_id sont requis.");
    }

    return NoteModel.upSert(noteData);
  },

  async bulkUpsert(notesArray) {
    if (!Array.isArray(notesArray) || notesArray.length === 0) {
      throw new Error("Le tableau de notes est vide ou invalide.");
    }

    // Optionnel : filtrer / valider chaque entrée
    const cleanNotes = notesArray.map((n) => ({
      course_id: n.course_id,
      student_id: n.student_id,
      note_ds: n.note_ds ?? null,
      note_examen: n.note_examen ?? null,
      note_final: n.note_final ?? null,
    }));

    return NoteModel.bulkUpsert(cleanNotes);
  },

  async getForStudent(courseId, studentId) {
    return NoteModel.fetchByCourseForStudent(courseId, studentId);
  },

  async getByCourse(courseId) {
    const res = await NoteModel.fetchByCourse(courseId);
    console.log("GetByCourse : ", res);
    return res;
  },

  async getByStudent(studentId) {
    return NoteModel.fetchByStudents(studentId);
  },

  async getByCourseAndClass(courseId, classId) {
    const res = await NoteModel.fetchByCourseAndClassForStudents(
      courseId,
      classId
    );
    console.log("GetByCourse : ", res);
    return res;
  },

  async update(noteId, noteData) {
    return NoteModel.update(noteId, noteData);
  },

  async remove(noteId) {
    console.log("Suppression notes : ", noteId);
    return NoteModel.delete(noteId);
  },
};

module.exports = NoteService;
