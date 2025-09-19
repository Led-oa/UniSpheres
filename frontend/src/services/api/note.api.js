import api from "../Connect.backend";

export const NoteService = {
  //  Insérer ou mettre à jour une note
  upSert(noteData) {
    return api.post("/note", noteData);
  },
  // Récupérer toutes les notes d'un cours
  fetchByCourse(courseId) {
    return api.get(`/note/course/${courseId}`);
  },
  // Récupérer la note d'un étudiant pour un cours spécifique
  fetchByCourseForStudent(courseId, studentId) {
    return api.get(`/note/course/${courseId}/student/${studentId}`);
  },
  // Récupérer toutes les notes d'un étudiant
  fetchByStudents(studentId) {
    return api.get(`/note/student/${studentId}`);
  },
  // Récupérer toutes les notes d'un cours pour une classe
  fetchByCourseAndClassForStudents(courseId, classId) {
    return api.get(`/note/course/${courseId}/class/${classId}`);
  },
  // Mettre à jour une note par son ID
  update(noteId, noteData) {
    return api.put(`/note/${noteId}`, noteData);
  },
  // Supprimer une note par son ID
  delete(noteId) {
    return api.delete(`/note/${noteId}`);
  },
  //  Insert / update en bulk
  bulkUpsert(notesData) {
    return api.post("/note/bulk", { notes: notesData });
  },
};
