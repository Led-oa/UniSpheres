<script setup>
import { ref, onMounted } from "vue";
import { useNoteStore } from "../../stores/note.store";
import { useCourseStore } from "../../stores/course.store";
import { useClasseStore } from "../../stores/academique/classe.store";
import { useRoute } from "vue-router";

import ModalAttributGradeTeacher from "../../components/teacher/ModalAttributGrade.teacher.vue";
import ModalUploadGradesTeacher from "../../components/teacher/ModalUploadGrades.teacher.vue";
// --- Stores & route ---
const noteStore = useNoteStore();
const courseStore = useCourseStore();
const classeStore = useClasseStore();
const route = useRoute();

// --- State réactif ---
const course = ref(null);
const notes = ref([]);
const students = ref([]);
const isImportModalOpen = ref(false);
const selectedStudent = ref(null);
const isNoteModalOpen = ref(false);
const stats = ref({
  average: 0,
  max: 0,
  min: 0,
  completed: 0,
});

const courseId = route.params.id;

// --- Méthodes ---
const calculateStats = () => {
  const grades = notes.value
    .filter((s) => s.note_final !== null)
    .map((s) => Number(s.note_final));

  if (grades.length > 0) {
    stats.value.average = grades.reduce((a, b) => a + b, 0) / grades.length;
    stats.value.max = Math.max(...grades);
    stats.value.min = Math.min(...grades);
    stats.value.completed = grades.length;
  } else {
    stats.value.average = stats.value.max = stats.value.min = stats.value.completed = 0;
  }
};

// Fonction dédiée pour ouvrir le modal "Ajouter note"
const openAddNoteModal = () => {
  selectedStudent.value = null;
  isNoteModalOpen.value = true;
};

// Fonction pour ouvrir le modal "Modifier note"
const openEditNoteModal = (student) => {
  selectedStudent.value = student;
  isNoteModalOpen.value = true;
};

const handleNotesSaved = () => {
  calculateStats();
  isNoteModalOpen.value = false;
};

const formatNote = (note) => {
  if (note === null || note === undefined || isNaN(Number(note))) return "-";
  return Number(note).toFixed(2);
};

const getNoteColor = (note) => {
  if (note === null) return "text-gray-400";
  if (note >= 16) return "text-green-600 font-semibold";
  if (note >= 14) return "text-blue-600";
  if (note >= 12) return "text-yellow-600";
  if (note >= 10) return "text-orange-600";
  return "text-red-600 font-semibold";
};

// --- Préparation pour bulk import ---
const loadCourseInfo = async () => {
  course.value = await courseStore.fetchCourseById(courseId);
  const classId = course.value.class_id;
  return classId;
};

const loadNote = async (classId) => {
  const fetchedNotes = await noteStore.fetchByCourseAndClassForStudents(
    courseId,
    classId
  );
  console.log("Composant : ", fetchedNotes);
  notes.value = fetchedNotes.data.map((n) => ({
    id: n.student_id,
    matricule: n.student_matricule,
    nom: n.student_lastname,
    prenom: n.student_name,
    note_ds: n.note_ds,
    note_examen: n.note_examen,
    note_final: n.note_final,
  }));
  calculateStats();
};

const loadStudent = async (classId) => {
  const res = await classeStore.getStudentFromClass(classId);
  students.value = res.data;
  // Servira pour préparer le bulkUpsert
};

// --- Chargement des données depuis le backend ---
onMounted(async () => {
  try {
    const classId = await loadCourseInfo();
    await loadNote(classId);
    await loadStudent(classId);
    console.log("Cours :", course.value);
    console.log("Notes :", notes.value);
    console.log("Étudiants :", students.value);
  } catch (err) {
    console.error("Erreur lors du chargement des notes ou du cours :", err);
  }
});
</script>

<template>
  <div class="px-6 py-8">
    <!-- Header & Import -->
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8"
    >
      <div class="flex">
        <button @click="$router.back()" class="p-2 rounded-lg hover:bg-gray-100">
          <svg
            class="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <div>
          <h1 class="text-3xl font-bold text-gray-900">
            {{ course?.title || "Matière" }}
          </h1>
          <p class="mt-2 text-gray-600">Gérer les notes de la matière</p>
        </div>
      </div>
      <div class="flex space-x-2 mt-4 sm:mt-0">
        <button
          @click="openAddNoteModal"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Attribuer Notes
        </button>
        <button
          @click="isImportModalOpen = true"
          class="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
        >
          Importer des Notes
        </button>
      </div>
    </div>

    <!-- Statistiques -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div class="bg-white rounded-lg shadow border border-gray-200 p-4 text-center">
        <div class="text-2xl font-bold text-blue-600">{{ stats.average.toFixed(1) }}</div>
        <div class="text-sm text-gray-600">Moyenne</div>
      </div>
      <div class="bg-white rounded-lg shadow border border-gray-200 p-4 text-center">
        <div class="text-2xl font-bold text-green-600">{{ stats.max.toFixed(1) }}</div>
        <div class="text-sm text-gray-600">Meilleure note</div>
      </div>
      <div class="bg-white rounded-lg shadow border border-gray-200 p-4 text-center">
        <div class="text-2xl font-bold text-red-600">{{ stats.min.toFixed(1) }}</div>
        <div class="text-sm text-gray-600">Plus basse</div>
      </div>
    </div>

    <!-- Informations de la matière -->
    <div class="bg-white rounded-lg shadow border border-gray-200 p-6 mb-8">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Informations de la matière</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <span class="text-sm text-gray-600">Code:</span>
          <p class="font-medium">{{ course?.id_course }}</p>
        </div>
        <div>
          <span class="text-sm text-gray-600">Enseignant:</span>
          <p class="font-medium">
            {{ course?.teacher_lastname }} {{ course?.teacher_name }}
          </p>
        </div>
        <div>
          <span class="text-sm text-gray-600">Durations : </span>
          <p class="font-medium">{{ course?.duration }} Heures</p>
        </div>
        <div>
          <span class="text-sm text-gray-600">Classe : </span>
          <p class="font-medium">{{ course?.class_name }}</p>
        </div>
      </div>
    </div>

    <!-- Liste des étudiants -->
    <div class="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">Notes des étudiants</h2>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Matricule
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Nom & Prénom
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Note DS
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Note Examen
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Note Finale
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="note in notes" :key="note.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ note.matricule }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ note.nom }} {{ note.prenom }}
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm"
                :class="getNoteColor(note.note_ds)"
              >
                {{ formatNote(note.note_ds) }}
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm"
                :class="getNoteColor(note.note_examen)"
              >
                {{ formatNote(note.note_examen) }}
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-semibold"
                :class="getNoteColor(note.note_final)"
              >
                {{ formatNote(note.note_final) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  @click="openEditNoteModal(note)"
                  class="text-blue-600 hover:text-blue-900"
                >
                  {{ note.note_ds ? "Modifier" : "Attribuer" }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="notes.length === 0" class="text-center py-12 text-gray-500">
        Aucune notes n'a été attribuer.
      </div>
    </div>
    <!-- Modals -->
    <ModalUploadGradesTeacher
      v-if="isImportModalOpen"
      @close="isImportModalOpen = false"
      :course-id="courseId"
      @saved="handleNotesSaved"
    />
    <ModalAttributGradeTeacher
      v-if="isNoteModalOpen"
      :mode="selectedStudent ? 'edit' : 'add'"
      :student-list="students"
      :current-student="selectedStudent"
      :course-id="courseId"
      @close="isNoteModalOpen = false"
      @saved="handleNotesSaved"
    />
  </div>
</template>
