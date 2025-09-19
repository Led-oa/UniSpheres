// src/stores/note.store.js
import { defineStore } from "pinia";
import { ref } from "vue";
import { NoteService } from "../services/api/note.api";
import { parseNotesFile } from "../utils/parseNoteFile";

export const useNoteStore = defineStore("note", () => {
  const notes = ref([]); // Toutes les notes récupérées
  const currentNote = ref(null); // Note individuelle
  const isLoading = ref(false);
  const error = ref(null);

  // Insérer ou mettre à jour une note
  const upSert = async (noteData) => {
    isLoading.value = true;
    error.value = null;
    try {
      const res = await NoteService.upSert(noteData);
      return res.data;
    } catch (err) {
      console.error("Erreur upSert note :", err);
      error.value = err;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Bulk insert/update
  const bulkUpsert = async (file, students, courseId) => {
    isLoading.value = true;
    error.value = null;
    try {
      const notesData = await parseNotesFile(file, students, courseId);

      const res = await NoteService.bulkUpsert(notesData);

      notes.value = res.data || [];

      return notes.value;
    } catch (err) {
      console.error("Erreur bulkUpsert notes :", err);
      error.value = err;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Récupérer toutes les notes d'un cours
  const fetchByCourse = async (courseId) => {
    isLoading.value = true;
    error.value = null;
    try {
      const res = await NoteService.fetchByCourse(courseId);
      notes.value = res.data || [];
      return res;
    } catch (err) {
      console.error("Erreur fetchByCourse :", err);
      error.value = err;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Récupérer la note d'un étudiant pour un cours spécifique
  const fetchByCourseForStudent = async (courseId, studentId) => {
    isLoading.value = true;
    error.value = null;
    try {
      const res = await NoteService.fetchByCourseForStudent(
        courseId,
        studentId
      );
      currentNote.value = res.data || null;
      return currentNote.value;
    } catch (err) {
      console.error("Erreur fetchByCourseForStudent :", err);
      error.value = err;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Récupérer toutes les notes d'un étudiant
  const fetchByStudents = async (studentId) => {
    isLoading.value = true;
    error.value = null;
    try {
      const res = await NoteService.fetchByStudents(studentId);
      notes.value = res.data || [];
      return notes.value;
    } catch (err) {
      console.error("Erreur fetchByStudents :", err);
      error.value = err;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Récupérer toutes les notes d'un cours pour une classe
  const fetchByCourseAndClassForStudents = async (courseId, classId) => {
    isLoading.value = true;
    error.value = null;
    try {
      const res = await NoteService.fetchByCourseAndClassForStudents(
        courseId,
        classId
      );
      notes.value = res.data || [];
      return notes.value;
    } catch (err) {
      console.error("Erreur fetchByCourseAndClassForStudents :", err);
      error.value = err;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Mettre à jour une note par son ID
  const update = async (noteId, noteData) => {
    isLoading.value = true;
    error.value = null;
    try {
      const res = await NoteService.update(noteId, noteData);
      return res.data;
    } catch (err) {
      console.error("Erreur update note :", err);
      error.value = err;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Supprimer une note par son ID
  const remove = async (noteId) => {
    isLoading.value = true;
    error.value = null;
    try {
      const res = await NoteService.delete(noteId);
      return res.data;
    } catch (err) {
      console.error("Erreur delete note :", err);
      error.value = err;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // --- Return state & actions ---
  return {
    notes,
    currentNote,
    isLoading,
    error,
    upSert,
    bulkUpsert,
    fetchByCourse,
    fetchByCourseForStudent,
    fetchByStudents,
    fetchByCourseAndClassForStudents,
    update,
    remove,
  };
});
