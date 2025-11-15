<script setup>
import { onMounted, ref, computed } from "vue";
import { useUtilityStore } from "../../stores/utility.store";
import { useAuthStore } from "../../stores/auth.store";
import { useClasseStore } from "../../stores/academique/classe.store";
import { useScheduleStore } from "../../stores/schedule.store";
import scheduleOther from "../other/schedule.other.vue";

// Stores
const utilityStore = useUtilityStore();
const authStore = useAuthStore();
const classeStore = useClasseStore();
const scheduleStore = useScheduleStore();

// Data
const classInfo = ref(null);
const avgNote = ref("–");
const student = computed(() => authStore.user);
const isLoading = ref(false);

// Chargement des données utilisateur
const loadUser = async () => {
  if (authStore.token && !authStore.user) {
    try {
      await authStore.fetchUserData();
    } catch (error) {
      console.error("Erreur chargement utilisateur:", error);
    }
  }
};

// Chargement des informations de classe
const loadClass = async (classId) => {
  if (!classId) return;

  try {
    await classeStore.fetchClass(classId);
    classInfo.value = classeStore.currentClass?.data;
  } catch (error) {
    console.error("Erreur chargement classe:", error);
  }
};

// Chargement des données du dashboard
const loadDashboardData = async () => {
  if (!student.value?.class_id) return;

  isLoading.value = true;
  try {
    await Promise.all([
      utilityStore.fetchCoursesCountInClass(student.value.class_id),
      utilityStore.fetchLastAnnonces(5),
      loadClass(student.value.class_id),
    ]);
  } catch (error) {
    console.error("Erreur chargement dashboard:", error);
  } finally {
    isLoading.value = false;
  }
};

// Gestion des événements du composant ScheduleOther
const onScheduleLoaded = (data) => {
  console.log("✅ Emploi du temps chargé:", data);
};

const onCellClick = (cellData) => {
  console.log("📅 Cellule cliquée:", cellData);
  showCourseDetails(cellData);
};

const onScheduleError = (error) => {
  console.error("❌ Erreur emploi du temps:", error);
};

const showCourseDetails = (courseData) => {
  if (courseData.courses.length > 0) {
    const course = courseData.courses[0];
    alert(
      `Détails du cours:\n${course.course_title}\nEnseignant: ${
        course.teacher_name
      }\nCrédits: ${course.credits || "N/A"}`
    );
  }
};

// Initialisation
onMounted(async () => {
  await loadUser();
  await loadDashboardData();
  avgNote.value = "14.5 / 20";
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 rounded-2xl p-6 transition-all duration-300">
    <!-- En-tête -->
    <div class="mb-8 transition-all duration-300">
      <h1 class="text-3xl font-bold text-gray-800 mb-2 transition-colors duration-200">
        Tableau de bord Étudiant
      </h1>
      <p class="text-gray-600 transition-colors duration-200">
        Bienvenue
        <span class="font-semibold text-indigo-600 transition-colors duration-200">
          {{ student.name || "Étudiant" }} </span
        >, voici votre résumé académique
      </p>
    </div>

    <!-- Indicateur de chargement global -->
    <div
      v-if="isLoading"
      class="fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300 ease-in-out"
    >
      <div class="flex items-center space-x-2">
        <svg
          class="w-4 h-4 animate-spin text-white transition-colors duration-200"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <span>Chargement des données...</span>
      </div>
    </div>

    <!-- Cartes de statistiques -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 transition-all duration-300">
      <!-- Total des Cours -->
      <div
        class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-all duration-300 ease-in-out hover:-translate-y-1"
      >
        <div class="flex items-center space-x-4 transition-colors duration-200">
          <div
            class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center transition-colors duration-200"
          >
            <svg
              class="w-6 h-6 text-blue-600 transition-colors duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <div class="transition-colors duration-200">
            <p class="text-gray-500 text-sm font-medium transition-colors duration-200">
              Total des Cours
            </p>
            <p class="text-2xl font-bold text-gray-800 transition-colors duration-200">
              {{ utilityStore.coursesCountInClass || 0 }}
            </p>
            <p class="text-xs text-gray-400 mt-1 transition-colors duration-200">
              Cette année académique
            </p>
          </div>
        </div>
      </div>

      <!-- Classe -->
      <div
        class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-all duration-300 ease-in-out hover:-translate-y-1"
      >
        <div class="flex items-center space-x-4 transition-colors duration-200">
          <div
            class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center transition-colors duration-200"
          >
            <svg
              class="w-6 h-6 text-green-600 transition-colors duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <div class="transition-colors duration-200">
            <p class="text-gray-500 text-sm font-medium transition-colors duration-200">
              Votre Classe
            </p>
            <p class="text-2xl font-bold text-gray-800 transition-colors duration-200">
              {{ classInfo?.name || "Non assigné" }}
            </p>
            <p
              class="text-xs text-gray-400 mt-1 transition-colors duration-200"
              v-if="classInfo"
            >
              {{ classInfo.filiere_name }} • {{ classInfo.year_value }}
            </p>
          </div>
        </div>
      </div>

      <!-- Notes moyennes -->
      <div
        class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-all duration-300 ease-in-out hover:-translate-y-1"
      >
        <div class="flex items-center space-x-4 transition-colors duration-200">
          <div
            class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center transition-colors duration-200"
          >
            <svg
              class="w-6 h-6 text-purple-600 transition-colors duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div class="transition-colors duration-200">
            <p class="text-gray-500 text-sm font-medium transition-colors duration-200">
              Moyenne Générale
            </p>
            <p class="text-2xl font-bold text-gray-800 transition-colors duration-200">
              {{ avgNote }}
            </p>
            <p class="text-xs text-gray-400 mt-1 transition-colors duration-200">
              Dernière mise à jour
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Grille principale du contenu -->
    <div class="grid grid-cols-1 xl:grid-cols-1 gap-8 transition-all duration-300">
      <!-- Emploi du temps -->
      <div
        class="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out"
      >
        <scheduleOther
          :classId="student?.class_id"
          title="Mon Emploi du Temps"
          view-mode="table"
          :show-week-selector="true"
          :show-statistics="false"
          :show-refresh="true"
          :show-empty-message="true"
          empty-message="Aucun cours planifié pour cette semaine."
          :auto-load="true"
          @schedule-loaded="onScheduleLoaded"
          @cell-click="onCellClick"
          @error="onScheduleError"
        />
      </div>

      <!-- Annonces et Événements -->
      <div class="space-y-8 transition-all duration-300">
        <!-- Dernières annonces -->
        <div
          class="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 ease-in-out hover:shadow-xl"
        >
          <div
            class="flex items-center justify-between mb-6 transition-colors duration-200"
          >
            <h2
              class="text-xl font-semibold text-gray-800 flex items-center transition-colors duration-200"
            >
              <span
                class="w-3 h-3 bg-blue-500 rounded-full mr-3 transition-colors duration-200"
              ></span>
              Dernières annonces
            </h2>
            <span
              v-if="utilityStore.lastAnnonces.length > 0"
              class="text-sm text-white bg-blue-500 px-3 py-1 rounded-full font-medium transition-all duration-200 ease-in-out hover:bg-blue-600"
            >
              {{ utilityStore.lastAnnonces.length }} nouvelle(s)
            </span>
          </div>

          <div class="space-y-4 pr-2 transition-all duration-300">
            <div
              v-for="a in utilityStore.lastAnnonces"
              :key="a.id_annonce"
              class="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg hover:shadow-md transition-all duration-200 ease-in-out hover:border-green-600"
            >
              <div
                class="flex justify-between items-start mb-2 transition-colors duration-200"
              >
                <h3
                  class="font-semibold text-gray-800 text-sm line-clamp-1 transition-colors duration-200"
                >
                  {{ a.title }}
                </h3>
                <span
                  class="text-xs text-gray-500 bg-white px-2 py-1 rounded shrink-0 ml-2 transition-all duration-200 ease-in-out hover:bg-gray-100"
                >
                  {{ new Date(a.created_at).toLocaleDateString("fr-FR") }}
                </span>
              </div>
              <p
                class="text-gray-600 text-sm leading-relaxed line-clamp-2 transition-colors duration-200"
              >
                {{ a.content }}
              </p>
              <div
                class="flex justify-between items-center mt-3 transition-colors duration-200"
              >
                <span
                  v-if="a.priority === 'high'"
                  class="text-xs text-red-600 bg-red-100 px-2 py-1 rounded transition-all duration-200 ease-in-out hover:bg-red-200"
                >
                  <svg
                    class="w-3 h-3 inline mr-1 transition-colors duration-200"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Important
                </span>
                <span
                  v-else-if="a.priority === 'medium'"
                  class="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded transition-all duration-200 ease-in-out hover:bg-yellow-200"
                >
                  <svg
                    class="w-3 h-3 inline mr-1 transition-colors duration-200"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Moyen
                </span>
                <span
                  v-else
                  class="text-xs text-gray-500 transition-all duration-200 ease-in-out hover:bg-gray-100 px-2 py-1 rounded"
                >
                  <svg
                    class="w-3 h-3 inline mr-1 transition-colors duration-200"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Information
                </span>

                <span
                  class="text-xs text-blue-600 font-medium transition-colors duration-200"
                >
                  Par {{ a.posted_by_name || "Administrateur" }}
                </span>
              </div>
            </div>

            <!-- État vide -->
            <div
              v-if="utilityStore.lastAnnonces.length === 0"
              class="text-center py-8 text-gray-500 transition-all duration-300"
            >
              <svg
                class="w-16 h-16 text-gray-400 mx-auto mb-4 transition-colors duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9m0 0v12m0-12a2 2 0 012-2h2a2 2 0 012 2M9 9v12"
                />
              </svg>
              <p class="font-medium transition-colors duration-200">
                Aucune annonce pour le moment
              </p>
              <p class="text-sm mt-1 transition-colors duration-200">
                Les nouvelles annonces apparaîtront ici
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Styles personnalisés */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
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
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
  transition: background-color 0.2s ease-in-out;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Animation d'entrée */
.fade-enter-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from {
  opacity: 0;
}

/* Styles pour l'intégration du composant ScheduleOther */
:deep(.schedule-other) {
  box-shadow: none;
  border-radius: 0;
}

:deep(.schedule-header) {
  border-radius: 12px 12px 0 0;
  margin-bottom: 0;
}

:deep(.schedule-table) {
  border-radius: 0 0 12px 12px;
}

:deep(.schedule-content) {
  padding: 0;
}

/* Transitions globales */
* {
  transition-property: color, background-color, border-color, transform, box-shadow;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
