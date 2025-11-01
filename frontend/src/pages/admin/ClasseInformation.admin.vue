<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useClasseStore } from "../../stores/academique/classe.store";
import { useCourseStore } from "../../stores/course.store";
import { useNoteStore } from "../../stores/note.store";
import { useUtilityStore } from "../../stores/utility.store";
import scheduleOther from "../other/schedule.other.vue";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";

const route = useRoute();
const idClass = parseInt(route.params.idClasse);

const courseStore = useCourseStore();
const noteStore = useNoteStore();
const classeStore = useClasseStore();
const utilityStore = useUtilityStore();

// États réactifs
const selectedStudent = ref(null);
const selectedTeacher = ref(null);

const modalStudentNotes = ref([]);
const modalTeacherCourses = ref([]);

// Computed properties pour les données de la classe
const classInfo = computed(() => {
  if (!classeStore.currentClass) return {};
  if (classeStore.currentClass.data) return classeStore.currentClass.data;
  return classeStore.currentClass;
});
const studentsList = computed(() => classeStore.students || []);
const teachersList = computed(() => classeStore.teachers || []);
const coursesList = computed(() => courseStore.courses || []);
const studentNotes = computed(() => noteStore.notes.data || []);
const utility = computed(() => utilityStore.coursesCountInClass || []);

// Chargement des données
const loadStudentList = async () => {
  const res = await classeStore.getStudentFromClass(idClass);
  console.log("Liste etudiant : ", res);
};

const loadTeacherList = async () => {
  const res = await classeStore.getTeacherOfClass(idClass);
  console.log("Liste enseignant : ", res);
};

const loadClassInfo = async () => {
  try {
    const res = await classeStore.fetchClass(idClass);
    console.log("Class Info : ", res);
  } catch (error) {
    console.error("Erreur lors du chargement des informations de la classe:", error);
  }
};

const loadClassCourseList = async () => {
  try {
    await courseStore.fetchCoursesByClass(idClass);
  } catch (error) {
    console.error("Erreur lors du chargement des cours de la classe: ", error);
  }
};

const loadUtilityData = async () => {
  await utilityStore.fetchCoursesCountInClass(idClass);
};

// Charger les notes d'un étudiant
const loadStudentNotes = async (studentId) => {
  selectedStudent.value = studentsList.value.find(
    (student) => student.id_user === studentId
  );
  try {
    const notes = await noteStore.fetchByStudents(studentId);
    modalStudentNotes.value = notes || [];
  } catch (error) {
    console.error("Erreur lors du chargement des notes:", error);
    modalStudentNotes.value = [];
  }
  toggleNotesModal();
};

// Charger les cours d'un enseignant
const loadTeacherCourses = async (teacherId) => {
  selectedTeacher.value = teachersList.value.find(
    (teacher) => teacher.id_user === teacherId
  );
  try {
    const courses = await courseStore.fetchCoursesByTeacher(teacherId);
    console.log("Cours of teacher : ", courses);
    modalTeacherCourses.value = courses || [];
  } catch (error) {
    console.error("Erreur lors du chargement des cours de l'enseignant:", error);
    modalTeacherCourses.value = [];
  }
  toggleCoursesModal();
};

const reloadClassCourses = async () => {
  try {
    await loadClassCourseList();
  } catch (error) {
    console.error("Erreur lors du rechargement des cours:", error);
  }
};

// Initialisation
onMounted(async () => {
  try {
    await Promise.all([
      loadClassCourseList(),
      loadClassInfo(),
      loadStudentList(),
      loadTeacherList(),
      loadUtilityData(),
    ]);
  } catch (error) {
    console.error("Erreur lors du chargement des données:", error);
  }
});

// Modals
const showNotesModal = ref(false);
const showCoursesModal = ref(false);

const toggleNotesModal = () => {
  showNotesModal.value = !showNotesModal.value;
  if (!showNotesModal.value) {
    selectedStudent.value = null;
    modalStudentNotes.value = [];
  }
};

const toggleCoursesModal = () => {
  showCoursesModal.value = !showCoursesModal.value;
  if (!showCoursesModal.value) {
    selectedTeacher.value = null;
    modalTeacherCourses.value = [];
    reloadClassCourses();
  }
};

// Données calculées pour les informations de la classe
const classSummary = computed(() => ({
  name: classInfo.value.name || classInfo.value.class_name || "Non défini",
  filiere: classInfo.value.filiere_name || classInfo.value.filiere || "Non défini",
  parcours: classInfo.value.parcours_name || classInfo.value.parcours || "Non défini",
  niveau: classInfo.value.year_value || classInfo.value.niveau || "Non défini",
  studentCount: studentsList.value.length,
  teacherCount: teachersList.value.length,
  courseCount: coursesList.value.length,
}));

// Gestion des événements du composant ScheduleOther
const onScheduleLoaded = (data) => {
  console.log("✅ Emploi du temps chargé:", data);
};

const onCellClick = (cellData) => {
  console.log("📅 Cellule cliquée:", cellData);
  // Vous pouvez implémenter l'affichage des détails du cours ici
  if (cellData.courses.length > 0) {
    const course = cellData.courses[0];
    alert(
      `Détails du cours:\n${course.course_title}\nEnseignant: ${course.teacher_name}\nPériode: ${cellData.period}`
    );
  }
};

const onScheduleError = (error) => {
  console.error("❌ Erreur emploi du temps:", error);
};
</script>

<template>
  <div class="min-h-screen text-gray-800 transition-all duration-300">
    <!-- Container Principal -->
    <div class="flex flex-col lg:flex-row gap-8 p-4 lg:p-8">
      <!-- Sidebar Informations - Responsive -->
      <aside
        class="lg:sticky lg:top-8 lg:h-fit w-full lg:w-80 bg-white border border-gray-300 p-6 rounded-2xl shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl order-1 lg:order-1"
      >
        <div class="transition-colors duration-200">
          <h2 class="text-lg font-semibold mb-4 transition-colors duration-200">
            Informations de la classe
          </h2>
          <ul class="space-y-3 transition-colors duration-200">
            <li class="transition-colors duration-200">
              <span class="font-medium transition-colors duration-200"
                >Nom de la classe :</span
              >
              {{ classSummary.name }}
            </li>
            <li class="transition-colors duration-200">
              <span class="font-medium transition-colors duration-200">Filière :</span>
              {{ classSummary.filiere }}
            </li>
            <li class="transition-colors duration-200">
              <span class="font-medium transition-colors duration-200">Parcours :</span>
              {{ classSummary.parcours }}
            </li>
            <li class="transition-colors duration-200">
              <span class="font-medium transition-colors duration-200">Niveau :</span>
              {{ classSummary.niveau }}
            </li>
            <li class="transition-colors duration-200">
              <span class="font-medium transition-colors duration-200"
                >Nombre d'étudiants :</span
              >
              {{ classSummary.studentCount }}
            </li>
            <li class="transition-colors duration-200">
              <span class="font-medium transition-colors duration-200"
                >Nombre d'enseignants :</span
              >
              {{ classSummary.teacherCount }}
            </li>
            <li class="transition-colors duration-200">
              <span class="font-medium transition-colors duration-200"
                >Nombre de cours :</span
              >
              {{ classSummary.courseCount }}
            </li>
          </ul>
        </div>
        <button
          class="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg w-full transition-all duration-200 ease-in-out hover:scale-105 text-sm lg:text-base"
        >
          Modifier
        </button>
      </aside>

      <!-- Contenu Principal -->
      <main class="flex-1 space-y-6 lg:space-y-8 order-2 lg:order-2">
        <!-- En-tête -->
        <div class="bg-white border border-gray-300 rounded-2xl p-4 lg:p-6 shadow-sm">
          <h1
            class="text-xl lg:text-2xl font-bold transition-colors duration-200 text-center lg:text-left"
          >
            INFORMATION DE CLASSE
          </h1>
        </div>

        <!-- Liste étudiants -->
        <section
          class="bg-white border border-gray-300 rounded-2xl p-4 lg:p-6 shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg"
        >
          <h2
            class="font-semibold text-center text-lg mb-4 transition-colors duration-200"
          >
            Liste étudiants
          </h2>

          <!-- Version Desktop (Table) -->
          <div class="hidden lg:block overflow-x-auto">
            <table class="w-full text-left border-t border-gray-200 min-w-[600px]">
              <thead>
                <tr class="border-b border-gray-200 text-gray-600 text-sm">
                  <th class="py-3 px-2">Photo</th>
                  <th class="py-3 px-2">Matricule</th>
                  <th class="py-3 px-2">Nom et Prénom</th>
                  <th class="py-3 px-2">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="student in studentsList"
                  :key="student.id_user"
                  class="border-b hover:bg-gray-50 transition-all duration-200 ease-in-out"
                >
                  <td class="py-3 px-2">
                    <div class="flex justify-center">
                      <img
                        v-if="student.profile_pic"
                        :src="student.profile_pic"
                        :alt="`Photo de ${student.name} ${student.lastname}`"
                        class="w-8 h-8 lg:w-10 lg:h-10 rounded-full object-cover transition-all duration-300 ease-in-out hover:scale-110"
                      />
                      <div
                        v-else
                        class="w-8 h-8 lg:w-10 lg:h-10 bg-gray-300 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out hover:scale-110"
                      >
                        <span class="text-gray-600 text-xs"
                          >{{ student.name?.charAt(0)
                          }}{{ student.lastname?.charAt(0) }}</span
                        >
                      </div>
                    </div>
                  </td>
                  <td class="py-3 px-2 text-sm">
                    {{ student.matricule || "N/A" }}
                  </td>
                  <td class="py-3 px-2 text-sm">
                    {{ student.name }} {{ student.lastname }}
                  </td>
                  <td class="py-3 px-2">
                    <button
                      class="border border-blue-500 text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-all duration-200 ease-in-out hover:scale-105 text-sm w-full lg:w-auto"
                      @click="loadStudentNotes(student.id_user)"
                    >
                      Voir notes
                    </button>
                  </td>
                </tr>
                <tr v-if="studentsList.length === 0">
                  <td colspan="4" class="text-center py-4 text-gray-500">
                    Aucun étudiant trouvé
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Version Mobile (Cards) -->
          <div class="lg:hidden space-y-3">
            <div
              v-for="student in studentsList"
              :key="student.id_user"
              class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-all duration-200 ease-in-out"
            >
              <div class="flex items-center space-x-3 mb-3">
                <img
                  v-if="student.profile_pic"
                  :src="student.profile_pic"
                  :alt="`Photo de ${student.name} ${student.lastname}`"
                  class="w-10 h-10 rounded-full object-cover"
                />
                <div
                  v-else
                  class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center"
                >
                  <span class="text-gray-600 text-xs"
                    >{{ student.name?.charAt(0) }}{{ student.lastname?.charAt(0) }}</span
                  >
                </div>
                <div class="flex-1">
                  <p class="font-medium text-sm">
                    {{ student.name }} {{ student.lastname }}
                  </p>
                  <p class="text-gray-500 text-xs">{{ student.matricule || "N/A" }}</p>
                </div>
              </div>
              <button
                class="border border-blue-500 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg transition-all duration-200 ease-in-out hover:scale-105 text-sm w-full"
                @click="loadStudentNotes(student.id_user)"
              >
                Voir notes
              </button>
            </div>
            <div v-if="studentsList.length === 0" class="text-center py-4 text-gray-500">
              Aucun étudiant trouvé
            </div>
          </div>
        </section>

        <!-- Liste enseignants -->
        <section
          class="bg-white border border-gray-300 rounded-2xl p-4 lg:p-6 shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg"
        >
          <h2
            class="font-semibold text-center text-lg mb-4 transition-colors duration-200"
          >
            Liste enseignants
          </h2>

          <!-- Version Desktop (Table) -->
          <div class="hidden lg:block overflow-x-auto">
            <table class="w-full text-left border-t border-gray-200 min-w-[500px]">
              <thead>
                <tr class="border-b border-gray-200 text-gray-600 text-sm">
                  <th class="py-3 px-2">Photo</th>
                  <th class="py-3 px-2">Nom et Prénom</th>
                  <th class="py-3 px-2">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="teacher in teachersList"
                  :key="teacher.id_user"
                  class="border-b hover:bg-gray-50 transition-all duration-200 ease-in-out"
                >
                  <td class="py-3 px-2">
                    <div class="flex justify-center">
                      <img
                        v-if="teacher.profile_pic"
                        :src="teacher.profile_pic"
                        :alt="`Photo de ${teacher.name} ${teacher.lastname}`"
                        class="w-8 h-8 lg:w-10 lg:h-10 rounded-full object-cover transition-all duration-300 ease-in-out hover:scale-110"
                      />
                      <div
                        v-else
                        class="w-8 h-8 lg:w-10 lg:h-10 bg-gray-300 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out hover:scale-110"
                      >
                        <span class="text-gray-600 text-xs"
                          >{{ teacher.name?.charAt(0)
                          }}{{ teacher.lastname?.charAt(0) }}</span
                        >
                      </div>
                    </div>
                  </td>
                  <td class="py-3 px-2 text-sm">
                    {{ teacher.name }} {{ teacher.lastname }}
                  </td>
                  <td class="py-3 px-2">
                    <button
                      class="border border-green-500 text-green-600 hover:bg-green-50 px-3 py-1.5 rounded-lg transition-all duration-200 ease-in-out hover:scale-105 text-sm w-full lg:w-auto"
                      @click="loadTeacherCourses(teacher.id_user)"
                    >
                      Voir cours
                    </button>
                  </td>
                </tr>
                <tr v-if="teachersList.length === 0">
                  <td colspan="3" class="text-center py-4 text-gray-500">
                    Aucun enseignant trouvé
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Version Mobile (Cards) -->
          <div class="lg:hidden space-y-3">
            <div
              v-for="teacher in teachersList"
              :key="teacher.id_user"
              class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-all duration-200 ease-in-out"
            >
              <div class="flex items-center space-x-3 mb-3">
                <img
                  v-if="teacher.profile_pic"
                  :src="teacher.profile_pic"
                  :alt="`Photo de ${teacher.name} ${teacher.lastname}`"
                  class="w-10 h-10 rounded-full object-cover"
                />
                <div
                  v-else
                  class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center"
                >
                  <span class="text-gray-600 text-xs"
                    >{{ teacher.name?.charAt(0) }}{{ teacher.lastname?.charAt(0) }}</span
                  >
                </div>
                <div class="flex-1">
                  <p class="font-medium text-sm">
                    {{ teacher.name }} {{ teacher.lastname }}
                  </p>
                </div>
              </div>
              <button
                class="border border-green-500 text-green-600 hover:bg-green-50 px-4 py-2 rounded-lg transition-all duration-200 ease-in-out hover:scale-105 text-sm w-full"
                @click="loadTeacherCourses(teacher.id_user)"
              >
                Voir cours
              </button>
            </div>
            <div v-if="teachersList.length === 0" class="text-center py-4 text-gray-500">
              Aucun enseignant trouvé
            </div>
          </div>
        </section>

        <!-- Liste des cours -->
        <section
          class="bg-white border border-gray-300 rounded-2xl p-4 lg:p-6 shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg"
        >
          <h2
            class="font-semibold text-center text-lg mb-4 transition-colors duration-200"
          >
            Liste des cours
          </h2>

          <div class="overflow-x-auto">
            <table
              class="w-full text-left border-t border-gray-200 min-w-[600px] lg:min-w-0"
            >
              <thead>
                <tr class="border-b border-gray-200 text-gray-600 text-sm">
                  <th class="py-3 px-2">Cours</th>
                  <th class="py-3 px-2">Enseignant</th>
                  <th class="py-3 px-2">Credits</th>
                  <th class="py-3 px-2">Volume horaire</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="course in coursesList"
                  :key="course.id_course"
                  class="border-b hover:bg-gray-50 transition-all duration-200 ease-in-out"
                >
                  <td class="py-3 px-2 text-sm">{{ course.title }}</td>
                  <td class="py-3 px-2 text-sm">
                    {{ course.teacher_name || "Non assigné" }}
                    {{ course.teacher_lastname }}
                  </td>
                  <td class="py-3 px-2 text-sm">{{ course.credits }}</td>
                  <td class="py-3 px-2 text-sm">{{ course.duration }}h</td>
                </tr>
                <tr v-if="coursesList.length === 0">
                  <td colspan="4" class="text-center py-4 text-gray-500">
                    Aucun cours trouvé
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- Emploi du temps avec scheduleOther -->
        <section
          class="bg-white border border-gray-300 rounded-2xl p-4 lg:p-6 shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg"
        >
          <scheduleOther
            :classId="idClass"
            :title="`Emploi du temps - ${classSummary.name}`"
            view-mode="table"
            :show-week-selector="true"
            :show-statistics="true"
            :show-refresh="true"
            :show-empty-message="true"
            empty-message="Aucun cours planifié pour cette classe."
            :auto-load="true"
            @schedule-loaded="onScheduleLoaded"
            @cell-click="onCellClick"
            @error="onScheduleError"
          />
        </section>
      </main>
    </div>

    <!-- Modal Notes (Headless UI) -->
    <TransitionRoot as="template" :show="showNotesModal">
      <Dialog as="div" class="relative z-50" @close="toggleNotesModal">
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
                class="relative transform overflow-hidden rounded-2xl bg-white px-4 pb-4 pt-5 text-left shadow-2xl transition-all sm:my-8 w-full max-w-2xl mx-4 sm:mx-0 sm:p-6"
              >
                <div class="flex items-center justify-between mb-4">
                  <DialogTitle as="h3" class="text-lg font-semibold">
                    Notes de {{ selectedStudent?.name }} {{ selectedStudent?.lastname }}
                  </DialogTitle>
                  <button
                    @click="toggleNotesModal"
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

                <div class="overflow-x-auto">
                  <table class="w-full text-left border-t border-gray-200 min-w-[500px]">
                    <thead>
                      <tr class="border-b border-gray-200 text-gray-600 text-sm">
                        <th class="py-2 px-2">Matière</th>
                        <th class="py-2 px-2">Note DS</th>
                        <th class="py-2 px-2">Note Examen</th>
                        <th class="py-2 px-2">Note Finale</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="note in studentNotes"
                        :key="note.id_note"
                        class="border-b hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td class="py-2 px-2 text-sm">
                          {{ note.course_title || "Matière inconnue" }}
                        </td>
                        <td class="py-2 px-2 text-sm">{{ note.note_ds }} / 20</td>
                        <td class="py-2 px-2 text-sm">{{ note.note_examen }} / 20</td>
                        <td class="py-2 px-2 text-sm">{{ note.note_final }} / 20</td>
                      </tr>
                      <tr v-if="studentNotes.length === 0">
                        <td colspan="4" class="text-center py-4 text-gray-500 text-sm">
                          Aucune note disponible
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div class="text-right mt-4">
                  <button
                    class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all duration-200 ease-in-out hover:scale-105 text-sm"
                    @click="toggleNotesModal"
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

    <!-- Modal Cours (Headless UI) -->
    <TransitionRoot as="template" :show="showCoursesModal">
      <Dialog as="div" class="relative z-50" @close="toggleCoursesModal">
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
                class="relative transform overflow-hidden rounded-2xl bg-white px-4 pb-4 pt-5 text-left shadow-2xl transition-all sm:my-8 w-full max-w-md mx-4 sm:mx-0 sm:p-6"
              >
                <div class="flex items-center justify-between mb-4">
                  <DialogTitle as="h3" class="text-lg font-semibold">
                    Cours de {{ selectedTeacher?.name }} {{ selectedTeacher?.lastname }}
                  </DialogTitle>
                  <button
                    @click="toggleCoursesModal"
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

                <ul class="text-gray-700 space-y-2">
                  <li
                    v-for="course in modalTeacherCourses"
                    :key="course.id_course"
                    class="flex items-center p-2 hover:bg-gray-50 rounded transition-all duration-200 ease-in-out hover:scale-105 text-sm"
                  >
                    <span
                      class="w-2 h-2 bg-blue-500 rounded-full mr-3 transition-colors duration-200"
                    ></span>
                    {{ course.title }} ({{ course.duration }}h)
                  </li>
                  <li
                    v-if="modalTeacherCourses.length === 0"
                    class="text-gray-500 italic transition-colors duration-200 text-sm"
                  >
                    Aucun cours assigné
                  </li>
                </ul>

                <div class="text-right mt-4">
                  <button
                    class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all duration-200 ease-in-out hover:scale-105 text-sm"
                    @click="toggleCoursesModal"
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

<style scoped>
/* Transitions globales */
* {
  transition-property: color, background-color, border-color, transform, box-shadow;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Animation de spin */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Scrollbar personnalisée */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
  transition: background-color 0.3s ease-in-out;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Responsive utilities */
@media (max-width: 1024px) {
  .lg\:sticky {
    position: relative;
  }
}
</style>
