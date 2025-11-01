<script setup>
import { useRoute } from "vue-router";
import { ref, onMounted } from "vue";
import { useCourseStore } from "../../stores/course.store";
import { useClasseStore } from "../../stores/academique/classe.store";
import { useNoteStore } from "../../stores/note.store";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";

// --- Route & paramètres ---
const route = useRoute();
const classId = route.params.idClasse;
const className = ref(route.params.className || "Classe");

// --- Stores ---
const courseStore = useCourseStore();
const classeStore = useClasseStore();
const noteStore = useNoteStore();

// --- Données réactives ---
const courses = ref([]);
const classe = ref({});
const notes = ref([]);
const selectedCourse = ref(null);
const isNotesModalOpen = ref(false);

// --- Chargement infos classe ---
const loadClassInfo = async () => {
  try {
    const res = await classeStore.fetchClass(classId);
    console.log("[NoteClasses] fetchClass:", res);
    classe.value = res?.data || {};
  } catch (err) {
    console.error("[NoteClasses] Erreur fetchClass:", err);
  }
};

// --- Chargement cours de la classe ---
const loadCourses = async () => {
  try {
    const res = await courseStore.fetchCoursesByClass(classId);
    console.log("[NoteClasses] fetchCoursesByClass:", res);
    courses.value = res?.data || [];
  } catch (err) {
    console.error("[NoteClasses] Erreur fetchCoursesByClass:", err);
  }
};

// --- Chargement des notes d'un cours ---
const loadNotes = async (courseId) => {
  try {
    const res = await noteStore.fetchByCourse(courseId);
    console.log("[NoteClasses] fetchByCourse:", res);
    notes.value = res?.data || [];
  } catch (err) {
    console.error("[NoteClasses] Erreur fetchByCourse:", err);
    notes.value = [];
  }
};

// --- Ouvrir le modal & charger les notes ---
const openNotesModal = async (course) => {
  console.log("[NoteClasses] openNotesModal:", course);
  selectedCourse.value = course;
  isNotesModalOpen.value = true;
  await loadNotes(course.id_course);
};

// --- Fermer le modal ---
const closeNotesModal = () => {
  isNotesModalOpen.value = false;
  selectedCourse.value = null;
  notes.value = [];
};

// --- Au montage ---
onMounted(async () => {
  await loadClassInfo();
  await loadCourses();
});

// --- Formater une note ---
const formatNote = (note) => {
  if (note === null || note === undefined) return "-";
  return Number(note).toFixed(1);
};

// --- Couleur selon la note ---
const getNoteColor = (note) => {
  if (note === null || note === undefined) return "text-gray-400";
  const numNote = Number(note);
  if (numNote >= 16) return "text-green-600 font-semibold";
  if (numNote >= 14) return "text-blue-600";
  if (numNote >= 12) return "text-yellow-600";
  if (numNote >= 10) return "text-orange-600";
  return "text-red-600 font-semibold";
};
</script>

<template>
  <div class="space-y-6">
    <!-- Titre -->
    <div class="flex items-center space-x-4">
      <button
        @click="$router.back()"
        class="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
      >
        <svg
          class="w-5 h-5 text-gray-600 transition-colors duration-200"
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
        <h1 class="text-2xl font-bold text-gray-800 transition-colors duration-200">
          Notes – Classe {{ classe?.name || className }}
        </h1>
        <p class="text-gray-500 text-sm mt-1 transition-colors duration-200">
          Gestion des notes par matière
        </p>
      </div>
    </div>

    <!-- Liste des cours -->
    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-300"
    >
      <div
        v-for="course in courses"
        :key="course.id_course"
        class="bg-white p-6 rounded-xl shadow border border-gray-100 flex flex-col transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-105"
      >
        <h2 class="text-lg font-semibold text-purple-700 transition-colors duration-200">
          {{ course.title }}
        </h2>
        <p class="text-gray-500 mt-1 transition-colors duration-200">
          Classe : {{ course.class_name || classe?.name }}
        </p>
        <p class="text-gray-500 text-sm mt-1 transition-colors duration-200">
          Enseignant : {{ course.teacher_name }} {{ course.teacher_lastname }}
        </p>

        <button
          @click="openNotesModal(course)"
          class="mt-4 py-2 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-all duration-200 ease-in-out font-medium"
        >
          Voir les notes
        </button>
      </div>
    </div>

    <!-- Message si aucun cours -->
    <div
      v-if="courses.length === 0"
      class="text-center py-12 text-gray-500 transition-colors duration-200"
    >
      <svg
        class="w-12 h-12 text-gray-400 mx-auto mb-4 transition-colors duration-200"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 14l9-5-9-5-9 5 9 5z"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 14l9-5-9-5-9 5 9 5z"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 14v6l9-5-9-5-9 5 9 5z"
        />
      </svg>
      Aucun cours trouvé pour cette classe.
    </div>

    <!-- Modal des notes (Headless UI) -->
    <TransitionRoot as="template" :show="isNotesModalOpen">
      <Dialog as="div" class="relative z-50" @close="closeNotesModal">
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
                class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:p-6"
              >
                <!-- En-tête du modal -->
                <div class="flex items-center justify-between mb-6">
                  <DialogTitle as="h3" class="text-xl font-bold leading-6 text-gray-900">
                    Notes – {{ selectedCourse?.title }}
                  </DialogTitle>
                  <button
                    @click="closeNotesModal"
                    class="rounded-md bg-white text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    <svg
                      class="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <!-- Informations du cours -->
                <div
                  class="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200 transition-colors duration-200"
                >
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span
                        class="font-medium text-blue-700 transition-colors duration-200"
                        >Classe:</span
                      >
                      <p class="text-blue-900 transition-colors duration-200">
                        {{ selectedCourse?.class_name || classe?.name }}
                      </p>
                    </div>
                    <div>
                      <span
                        class="font-medium text-blue-700 transition-colors duration-200"
                        >Enseignant:</span
                      >
                      <p class="text-blue-900 transition-colors duration-200">
                        {{ selectedCourse?.teacher_name }}
                        {{ selectedCourse?.teacher_lastname }}
                      </p>
                    </div>
                    <div>
                      <span
                        class="font-medium text-blue-700 transition-colors duration-200"
                        >Code:</span
                      >
                      <p class="text-blue-900 transition-colors duration-200">
                        {{ selectedCourse?.id_course }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Liste des notes -->
                <div class="overflow-x-auto">
                  <table
                    class="min-w-full divide-y divide-gray-200 transition-colors duration-200"
                  >
                    <thead class="bg-gray-50 transition-colors duration-200">
                      <tr>
                        <th
                          class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider transition-colors duration-200"
                        >
                          Matricule
                        </th>
                        <th
                          class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider transition-colors duration-200"
                        >
                          Étudiant
                        </th>
                        <th
                          class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider transition-colors duration-200"
                        >
                          Note DS
                        </th>
                        <th
                          class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider transition-colors duration-200"
                        >
                          Note Examen
                        </th>
                        <th
                          class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider transition-colors duration-200"
                        >
                          Note Finale
                        </th>
                      </tr>
                    </thead>
                    <tbody
                      class="bg-white divide-y divide-gray-200 transition-colors duration-200"
                    >
                      <tr
                        v-for="note in notes"
                        :key="note.student_id"
                        class="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td
                          class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 transition-colors duration-200"
                        >
                          {{ note.student_matricule }}
                        </td>
                        <td
                          class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 transition-colors duration-200"
                        >
                          {{ note.student_lastname }} {{ note.student_name }}
                        </td>
                        <td
                          class="px-4 py-3 whitespace-nowrap text-sm text-center transition-colors duration-200"
                          :class="getNoteColor(note.note_ds)"
                        >
                          {{ formatNote(note.note_ds) }}/20
                        </td>
                        <td
                          class="px-4 py-3 whitespace-nowrap text-sm text-center transition-colors duration-200"
                          :class="getNoteColor(note.note_examen)"
                        >
                          {{ formatNote(note.note_examen) }}/20
                        </td>
                        <td
                          class="px-4 py-3 whitespace-nowrap text-sm text-center font-semibold transition-colors duration-200"
                          :class="getNoteColor(note.note_final)"
                        >
                          {{ formatNote(note.note_final) }}/20
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Message si aucune note -->
                <div
                  v-if="notes.length === 0"
                  class="text-center py-8 text-gray-500 transition-colors duration-200"
                >
                  <svg
                    class="w-12 h-12 text-gray-400 mx-auto mb-4 transition-colors duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 14l9-5-9-5-9 5 9 5z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 14v6l9-5-9-5-9 5 9 5z"
                    />
                  </svg>
                  <p class="text-lg font-medium transition-colors duration-200">
                    Aucune note disponible
                  </p>
                  <p class="text-sm transition-colors duration-200">
                    Aucune note n'a été saisie pour ce cours.
                  </p>
                </div>

                <!-- Pied du modal -->
                <div class="mt-6 flex justify-end">
                  <button
                    @click="closeNotesModal"
                    class="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-all duration-200 ease-in-out"
                  >
                    Fermer
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>
