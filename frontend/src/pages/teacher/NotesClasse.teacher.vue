<script setup>
import { useRoute } from "vue-router";
import { ref, onMounted } from "vue";
import { useCourseStore } from "../../stores/course.store"; // fetchCoursesByClass
import { useClasseStore } from "../../stores/academique/classe.store";
import { useNoteStore } from "../../stores/note.store";

// --- Route & paramètres ---
const route = useRoute();
const classId = route.params.idClasse; // ex: /classe/:idClasse
const className = ref(route.params.className || "Classe");

// --- Stores ---
const courseStore = useCourseStore();
const classeStore = useClasseStore();
const noteStore = useNoteStore();

// --- Données réactives ---
const courses = ref([]); // cours de la classe
const classe = ref({}); // infos de la classe
const notes = ref([]); // notes du cours sélectionné
const selectedCourse = ref(null); // cours en cours d'affichage

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

// --- Chargement des notes d’un cours ---
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

// --- Au montage ---
onMounted(async () => {
  await loadClassInfo();
  await loadCourses();
});

// --- Ouvrir le modal & charger les notes ---
function openModal(course) {
  console.log("[NoteClasses] openModal:", course);
  selectedCourse.value = course;
  loadNotes(course.id_course); // 👉 charge les notes dès qu'on ouvre le modal
}
</script>

<template>
  <div class="space-y-6">
    <!-- Titre -->
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
      <h1 class="text-2xl font-bold text-gray-800">
        Notes – Classe {{ classe?.name || className }}
      </h1>
    </div>

    <!-- Liste des cours -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="course in courses"
        :key="course.id_course"
        class="bg-white p-6 rounded-xl shadow border border-gray-100 flex flex-col"
      >
        <h2 class="text-lg font-semibold text-purple-700">
          {{ course.title }}
        </h2>
        <p class="text-gray-500 mt-1">Classe : {{ course.class_name || classe?.name }}</p>

        <button
          @click="openModal(course)"
          class="mt-4 py-2 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90"
        >
          Voir les notes
        </button>
      </div>
    </div>

    <!-- Modal des notes -->
    <div
      v-if="selectedCourse"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-xl w-full max-w-md shadow-lg relative">
        <button
          @click="selectedCourse = null"
          class="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>

        <h3 class="text-xl font-bold text-gray-800 mb-4">
          Notes – {{ selectedCourse.title }}
        </h3>

        <!-- Liste des notes récupérées -->
        <ul class="space-y-2">
          <li
            v-for="note in notes"
            :key="note.student_id"
            class="flex justify-between border-b pb-1"
          >
            <span>{{ note.student_matricule }}</span>
            <span>{{ note.student_lastname }} {{ note.student_name }}</span>
            <span class="font-semibold"> {{ note.note_ds ?? "-" }}/20 </span>
            <span class="font-semibold"> {{ note.note_examen ?? "-" }}/20 </span>
            <span class="font-semibold"> {{ note.note_final ?? "-" }}/20 </span>
          </li>
          <li v-if="notes.length === 0" class="text-gray-500">
            Aucune note disponible pour ce cours.
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
