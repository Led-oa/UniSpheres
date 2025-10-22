<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";

import { useClasseStore } from "../../stores/academique/classe.store";
import { useCourseStore } from "../../stores/course.store";
import { useNoteStore } from "../../stores/note.store";
import { useUtilityStore } from "../../stores/utility.store";

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

// Computed properties pour les données de la classe - CORRIGÉ
const classInfo = computed(() => {
  // Vérification sécurisée de l'existence des données
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
  await classeStore.getStudentFromClass(idClass);
};

const loadTeacherList = async () => {
  await classeStore.getTeacherOfClass(idClass);
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
    // Réinitialisation sélective sans affecter les données principales
    selectedStudent.value = null;
    modalStudentNotes.value = [];
  }
};

const toggleCoursesModal = () => {
  showCoursesModal.value = !showCoursesModal.value;
  if (!showCoursesModal.value) {
    // Réinitialisation sélective sans affecter les données principales
    selectedTeacher.value = null;
    modalTeacherCourses.value = [];
    // Recharger les cours de la classe pour restaurer la liste principale
    reloadClassCourses();
  }
};

// Données calculées pour les informations de la classe - CORRIGÉ
const classSummary = computed(() => ({
  name: classInfo.value.name || classInfo.value.class_name || "Non défini",
  filiere: classInfo.value.filiere_name || classInfo.value.filiere || "Non défini",
  parcours: classInfo.value.parcours_name || classInfo.value.parcours || "Non défini",
  niveau: classInfo.value.year_value || classInfo.value.niveau || "Non défini",
  studentCount: studentsList.value.length,
  teacherCount: teachersList.value.length,
  courseCount: coursesList.value.length,
}));
</script>

<template>
  <div class="flex min-h-screen text-gray-80">
    <!-- Main Content -->
    <main class="ml-80 flex-1 p-8 space-y-8">
      <!-- Sidebar Informations -->
      <aside
        class="fixed left-24 top-40 w-72 bg-white border-r border-gray-300 p-6 flex flex-col justify-between rounded-3xl shadow-xl"
      >
        <div>
          <h2 class="text-lg font-semibold mb-4">Informations de la classe</h2>
          <ul class="space-y-3">
            <li>
              <span class="font-medium">Nom de la classe :</span> {{ classSummary.name }}
            </li>
            <li><span class="font-medium">Filière :</span> {{ classSummary.filiere }}</li>
            <li>
              <span class="font-medium">Parcours :</span> {{ classSummary.parcours }}
            </li>
            <li><span class="font-medium">Niveau :</span> {{ classSummary.niveau }}</li>
            <li>
              <span class="font-medium">Nombre d'étudiants :</span>
              {{ classSummary.studentCount }}
            </li>
            <li>
              <span class="font-medium">Nombre d'enseignants :</span>
              {{ classSummary.teacherCount }}
            </li>
            <li>
              <span class="font-medium">Nombre de cours :</span>
              {{ classSummary.courseCount }}
            </li>
          </ul>
        </div>
        <button
          class="mt-8 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg w-full transition-colors"
        >
          Modifier
        </button>
      </aside>

      <h1 class="text-2xl font-bold">INFORMATION DE CLASSE</h1>

      <!-- Liste étudiants -->
      <section
        class="bg-white border border-gray-300 rounded-2xl p-6 shadow-sm overflow-auto"
      >
        <h2 class="font-semibold text-center text-lg">Liste étudiants</h2>
        <table class="w-full text-left border-t border-gray-200 overflow-auto">
          <thead>
            <tr class="border-b border-gray-200 text-gray-600">
              <th class="py-2">Photo de profil</th>
              <th>Matricule</th>
              <th>Nom et Prénom</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="student in studentsList"
              :key="student.id_user"
              class="border-b hover:bg-gray-50"
            >
              <td class="py-2">
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
              </td>
              <td>{{ student.matricule || "N/A" }}</td>
              <td>{{ student.name }} {{ student.lastname }}</td>
              <td>
                <button
                  class="border border-blue-500 text-blue-600 hover:bg-blue-50 px-4 py-1.5 rounded-lg transition-colors"
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
      </section>

      <!-- Liste enseignants -->
      <section class="bg-white border border-gray-300 rounded-2xl p-6 shadow-sm">
        <h2 class="font-semibold text-center text-lg">Liste enseignants</h2>
        <table class="w-full text-left border-t border-gray-200">
          <thead>
            <tr class="border-b border-gray-200 text-gray-600">
              <th class="py-2">Photo de profil</th>
              <th>Nom et Prénom</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="teacher in teachersList"
              :key="teacher.id_user"
              class="border-b hover:bg-gray-50"
            >
              <td class="py-2">
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
              </td>
              <td>{{ teacher.name }} {{ teacher.lastname }}</td>
              <td>
                <button
                  class="border border-green-500 text-green-600 hover:bg-green-50 px-4 py-1.5 rounded-lg transition-colors"
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
      </section>

      <!-- Liste des cours -->
      <section class="bg-white border border-gray-300 rounded-2xl p-6 shadow-sm">
        <h2 class="font-semibold text-center text-lg mb-4">Liste des cours</h2>
        <table class="w-full text-left border-t border-gray-200">
          <thead>
            <tr class="border-b border-gray-200 text-gray-600">
              <th class="py-2">Cours</th>
              <th>Enseignant</th>
              <th>Credits</th>
              <th>Volume horaire</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="course in coursesList"
              :key="course.id_course"
              class="border-b hover:bg-gray-50"
            >
              <td>{{ course.title }}</td>
              <td>
                {{ course.teacher_name || "Non assigné" }} {{ course.teacher_lastname }}
              </td>
              <td>{{ course.credits }}</td>
              <td>{{ course.duration }}h</td>
            </tr>
            <tr v-if="coursesList.length === 0">
              <td colspan="3" class="text-center py-4 text-gray-500">
                Aucun cours trouvé
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- Emploi du temps -->
      <section class="bg-white border border-gray-300 rounded-2xl p-6 shadow-sm">
        <h2 class="font-semibold text-lg mb-4">
          Emploi du temps : {{ "20 oct - 25 oct" }}
        </h2>
        <div class="">
          <table class="border-2">
            <thead class="border-2">
              <tr class="border-2">
                <th
                  class="px-6 py-3 border-2 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Horaires / Jours
                </th>
                <th
                  class="px-6 py-3 border-2 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Lundi
                </th>
                <th
                  class="px-6 py-3 border-2 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Mardi
                </th>
                <th
                  class="px-6 py-3 border-2 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Mercredi
                </th>
                <th
                  class="px-6 py-3 border-2 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Jeudi
                </th>
                <th
                  class="px-6 py-3 border-2 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Vendredi
                </th>
                <th
                  class="px-6 py-3 border-2 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Samedi
                </th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-2">
                <td class="px-6 py-3 border-2">1ère Periode</td>
                <td class="px-6 py-3 border-2">{{ "Lundi" }}</td>
                <td class="px-6 py-3 border-2">{{ "Mardi" }}</td>
                <td class="px-6 py-3 border-2">{{ "Mercredi" }}</td>
                <td class="px-6 py-3 border-2">{{ "Jeudi" }}</td>
                <td class="px-6 py-3 border-2">{{ "Vendredi" }}</td>
                <td class="px-6 py-3 border-2">{{ "Samedi" }}</td>
              </tr>
              <tr class="border-2">
                <td class="px-6 py-3 border-2">2ème Periode</td>
                <td class="px-6 py-3 border-2">{{ "Lundi" }}</td>
                <td class="px-6 py-3 border-2">{{ "Mardi" }}</td>
                <td class="px-6 py-3 border-2">{{ "Mercredi" }}</td>
                <td class="px-6 py-3 border-2">{{ "Jeudi" }}</td>
                <td class="px-6 py-3 border-2">{{ "Vendredi" }}</td>
                <td class="px-6 py-3 border-2">{{ "Samedi" }}</td>
              </tr>
              <tr class="border-2">
                <td class="px-6 py-3 border-2">3ème Periode</td>
                <td class="px-6 py-3 border-2">{{ "Lundi" }}</td>
                <td class="px-6 py-3 border-2">{{ "Mardi" }}</td>
                <td class="px-6 py-3 border-2">{{ "Mercredi" }}</td>
                <td class="px-6 py-3 border-2">{{ "Jeudi" }}</td>
                <td class="px-6 py-3 border-2">{{ "Vendredi" }}</td>
              </tr>
              <tr class="border-2">
                <td class="px-6 py-3 border-2">4ème Periode</td>
                <td class="px-6 py-3 border-2">{{ "Lundi" }}</td>
                <td class="px-6 py-3 border-2">{{ "Mardi" }}</td>
                <td class="px-6 py-3 border-2">{{ "Mercredi" }}</td>
                <td class="px-6 py-3 border-2">{{ "Jeudi" }}</td>
                <td class="px-6 py-3 border-2">{{ "Vendredi" }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>

    <!-- Modal Notes -->
    <div
      v-if="showNotesModal"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    >
      <div
        class="bg-white rounded-2xl shadow-xl p-6 w-[500px] max-h-[80vh] overflow-y-auto"
      >
        <h3 class="text-lg font-semibold mb-4">
          Notes de {{ selectedStudent?.name }} {{ selectedStudent?.lastname }}
        </h3>
        <table class="w-full text-left border-t border-gray-200">
          <thead>
            <tr class="border-b border-gray-200 text-gray-600">
              <th class="py-2">Matière</th>
              <th>Note de devoir surveiller</th>
              <th>Note de l'examen</th>
              <th>Note final</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="note in studentNotes" :key="note.id_note" class="border-b">
              <td class="py-2">{{ note.course_title || "Matière inconnue" }}</td>
              <td>{{ note.note_ds }} / 20</td>
              <td>{{ note.note_examen }} / 20</td>
              <td>{{ note.note_final }} / 20</td>
            </tr>
            <tr v-if="studentNotes.length === 0">
              <td colspan="2" class="text-center py-4 text-gray-500">
                Aucune note disponible
              </td>
            </tr>
          </tbody>
        </table>
        <div class="text-right mt-4">
          <button
            class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            @click="toggleNotesModal"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Cours -->
    <div
      v-if="showCoursesModal"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    >
      <div
        class="bg-white rounded-2xl shadow-xl p-6 w-[500px] max-h-[80vh] overflow-y-auto"
      >
        <h3 class="text-lg font-semibold mb-4">
          Cours de {{ selectedTeacher?.name }} {{ selectedTeacher?.lastname }}
        </h3>
        <ul class="text-gray-700 space-y-2">
          <li
            v-for="course in modalTeacherCourses"
            :key="course.id_course"
            class="flex items-center p-2 hover:bg-gray-50 rounded"
          >
            <span class="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
            {{ course.title }} ({{ course.duration }}h)
          </li>
          <li v-if="modalTeacherCourses.length === 0" class="text-gray-500 italic">
            Aucun cours assigné
          </li>
        </ul>
        <div class="text-right mt-4">
          <button
            class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            @click="toggleCoursesModal"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
