<script setup>
import { ref, onMounted } from "vue";
import { useNoteStore } from "../../stores/note.store";
import { useCourseStore } from "../../stores/course.store";
import { useClasseStore } from "../../stores/academique/classe.store";
import { useRoute } from "vue-router";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";

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
const isDeleteModalOpen = ref(false);
const studentToDelete = ref(null);
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

// Fonction pour ouvrir le modal de suppression
const openDeleteModal = (student) => {
  console.log("Supprimer la note : ", student);
  studentToDelete.value = student;
  isDeleteModalOpen.value = true;
};

// Fonction pour supprimer une note
const deleteNote = async () => {
  if (!studentToDelete.value) return;

  try {
    // await noteStore.deleteNote(courseId, studentToDelete.value.id);
    await noteStore.remove(studentToDelete.value.id);
    // Recharger les notes après suppression
    const classId = course.value.class_id;
    await loadNote(classId);
    isDeleteModalOpen.value = false;
    studentToDelete.value = null;
  } catch (error) {
    console.error("Erreur lors de la suppression de la note:", error);
  }
};

const handleNotesSaved = async () => {
  calculateStats();
  const classId = course.value.class_id;
  await loadNote(classId);
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
      <div class="flex items-center space-x-4">
        <button
          @click="$router.back()"
          class="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
          <svg
            class="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
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
          class="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 ease-in-out"
        >
          Attribuer Notes
        </button>
        <button
          @click="isImportModalOpen = true"
          class="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 ease-in-out"
        >
          Importer des Notes
        </button>
      </div>
    </div>

    <!-- Statistiques -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div
        class="bg-white rounded-lg shadow border border-gray-200 p-4 text-center transition-transform duration-200 hover:scale-105"
      >
        <div class="text-2xl font-bold text-blue-600">{{ stats.average.toFixed(1) }}</div>
        <div class="text-sm text-gray-600">Moyenne</div>
      </div>
      <div
        class="bg-white rounded-lg shadow border border-gray-200 p-4 text-center transition-transform duration-200 hover:scale-105"
      >
        <div class="text-2xl font-bold text-green-600">{{ stats.max.toFixed(1) }}</div>
        <div class="text-sm text-gray-600">Meilleure note</div>
      </div>
      <div
        class="bg-white rounded-lg shadow border border-gray-200 p-4 text-center transition-transform duration-200 hover:scale-105"
      >
        <div class="text-2xl font-bold text-red-600">{{ stats.min.toFixed(1) }}</div>
        <div class="text-sm text-gray-600">Plus basse</div>
      </div>
    </div>

    <!-- Informations de la matière -->
    <div
      class="bg-white rounded-lg shadow border border-gray-200 p-6 mb-8 transition-colors duration-200"
    >
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
    <div
      class="bg-white rounded-lg shadow border border-gray-200 overflow-hidden transition-colors duration-200"
    >
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
                Note Devoir Surveiller
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
            <tr
              v-for="note in notes"
              :key="note.id"
              class="hover:bg-gray-50 transition-colors duration-150"
            >
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
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                <button
                  @click="openEditNoteModal(note)"
                  class="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                >
                  {{ note.note_ds ? "Modifier" : "Attribuer" }}
                </button>
                <button
                  v-if="note.note_ds || note.note_examen"
                  @click="openDeleteModal(note)"
                  class="text-red-600 hover:text-red-900 transition-colors duration-200"
                >
                  Supprimer
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

    <!-- Modal de confirmation de suppression (Headless UI) -->
    <TransitionRoot as="template" :show="isDeleteModalOpen">
      <Dialog as="div" class="relative z-10" @close="isDeleteModalOpen = false">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/75 transition-opacity" />
        </TransitionChild>

        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div
            class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
          >
            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 translate-y-0 sm:scale-100"
              leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel
                class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
              >
                <div class="sm:flex sm:items-start">
                  <div
                    class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
                  >
                    <svg
                      class="h-6 w-6 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  </div>
                  <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <DialogTitle
                      as="h3"
                      class="text-base font-semibold leading-6 text-gray-900"
                    >
                      Supprimer la note
                    </DialogTitle>
                    <div class="mt-2">
                      <p class="text-sm text-gray-500">
                        Êtes-vous sûr de vouloir supprimer les notes de
                        <span class="font-semibold"
                          >{{ studentToDelete?.nom }} {{ studentToDelete?.prenom }}</span
                        >
                        ({{ studentToDelete?.matricule }}) ? Cette action est
                        irréversible.
                      </p>
                    </div>
                  </div>
                </div>
                <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 transition-colors duration-200 ease-in-out sm:ml-3 sm:w-auto"
                    @click="deleteNote"
                  >
                    Oui, supprimer
                  </button>
                  <button
                    type="button"
                    class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors duration-200 ease-in-out sm:mt-0 sm:w-auto"
                    @click="isDeleteModalOpen = false"
                  >
                    Annuler
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Modals externes (À convertir en Headless UI) -->
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
